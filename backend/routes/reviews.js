import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create a review for a service request
router.post('/', [
  authenticateToken,
  body('service_request_id').isInt({ min: 1 }),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim(),
  body('is_anonymous').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { service_request_id, rating, comment, is_anonymous } = req.body;
    const reviewer_id = req.user.id;

    // Get service request details
    const requests = await query(
      `SELECT provider_id, requester_id, status 
       FROM service_requests WHERE id = ?`,
      [service_request_id]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    const request = requests[0];

    // Check if request is completed
    if (request.status !== 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed services'
      });
    }

    // Only allow reviewer if they were part of the request
    if (reviewer_id !== request.requester_id && reviewer_id !== request.provider_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only review services you were involved in'
      });
    }

    // Check if review already exists
    const existingReview = await query(
      'SELECT id FROM reviews WHERE service_request_id = ? AND reviewer_id = ?',
      [service_request_id, reviewer_id]
    );

    if (existingReview.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this service'
      });
    }

    // Determine who is being reviewed (the other party)
    const reviewed_id = reviewer_id === request.requester_id 
      ? request.provider_id 
      : request.requester_id;

    // Create the review
    const result = await query(
      `INSERT INTO reviews (service_request_id, reviewer_id, reviewed_id, rating, comment, is_anonymous) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [service_request_id, reviewer_id, reviewed_id, rating, comment, is_anonymous || false]
    );

    // Create notification for the reviewed user
    await query(
      `INSERT INTO notifications (user_id, type, title, message, related_id, related_type) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [reviewed_id, 'review', 'New Review Received', 
       `You received a ${rating}-star review`, result.insertId, 'review']
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        id: result.insertId,
        service_request_id,
        rating,
        comment
      }
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get reviews for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    let whereClause = 'WHERE r.reviewed_id = ?';
    let values = [userId];

    if (rating) {
      whereClause += ' AND r.rating = ?';
      values.push(parseInt(rating));
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await query(
      `SELECT 
        r.id, r.rating, r.comment, r.is_anonymous, r.created_at,
        CASE 
          WHEN r.is_anonymous = 1 THEN 'Anonymous'
          ELSE CONCAT(u.first_name, ' ', LEFT(u.last_name, 1), '.')
        END as reviewer_name,
        u.profile_image,
        sr.id as service_request_id,
        s.title as service_title
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      JOIN service_requests sr ON r.service_request_id = sr.id
      JOIN services s ON sr.service_id = s.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?`,
      [...values, parseInt(limit), offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM reviews ${whereClause}`,
      values
    );

    // Get rating breakdown
    const breakdown = await query(
      `SELECT rating, COUNT(*) as count 
       FROM reviews WHERE reviewed_id = ? 
       GROUP BY rating ORDER BY rating DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        reviews,
        rating_breakdown: breakdown,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's own reviews (reviews they wrote)
router.get('/my-reviews', authenticateToken, async (req, res) => {
  try {
    const reviewer_id = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await query(
      `SELECT 
        r.id, r.rating, r.comment, r.is_anonymous, r.created_at,
        CONCAT(u.first_name, ' ', u.last_name) as reviewed_name,
        u.profile_image, u.rating_avg,
        s.title as service_title
      FROM reviews r
      JOIN users u ON r.reviewed_id = u.id
      JOIN service_requests sr ON r.service_request_id = sr.id
      JOIN services s ON sr.service_id = s.id
      WHERE r.reviewer_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?`,
      [reviewer_id, parseInt(limit), offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) as total FROM reviews WHERE reviewer_id = ?',
      [reviewer_id]
    );

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update a review
router.put('/:id', [
  authenticateToken,
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Check ownership
    const reviews = await query(
      'SELECT * FROM reviews WHERE id = ? AND reviewer_id = ?',
      [id, userId]
    );

    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you cannot edit this review'
      });
    }

    const updateFields = [];
    const values = [];

    if (rating !== undefined) { updateFields.push('rating = ?'); values.push(rating); }
    if (comment !== undefined) { updateFields.push('comment = ?'); values.push(comment); }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    await query(
      `UPDATE reviews SET ${updateFields.join(', ')} WHERE id = ?`,
      [...values, id]
    );

    res.json({
      success: true,
      message: 'Review updated successfully'
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete a review
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check ownership (only reviewer can delete their review)
    const reviews = await query(
      'SELECT * FROM reviews WHERE id = ? AND reviewer_id = ?',
      [id, userId]
    );

    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you cannot delete this review'
      });
    }

    await query('DELETE FROM reviews WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get review statistics for a user
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get average rating and total reviews
    const stats = await query(
      `SELECT 
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(*) as total_reviews,
        COALESCE(SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END), 0) as five_star,
        COALESCE(SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END), 0) as four_star,
        COALESCE(SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END), 0) as three_star,
        COALESCE(SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END), 0) as two_star,
        COALESCE(SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END), 0) as one_star
      FROM reviews WHERE reviewed_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      data: stats[0]
    });

  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;