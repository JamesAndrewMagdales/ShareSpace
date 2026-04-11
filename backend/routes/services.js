import express from 'express';
import { body, query as queryValidator, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all services with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      city,
      minPrice,
      maxPrice,
      minRating,
      isRemote,
      page = 1,
      limit = 12,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    let whereClause = 'WHERE s.status = ? AND s.is_available = 1';
    let values = ['Active'];

    // Search by title or description
    if (search) {
      whereClause += ' AND (s.title LIKE ? OR s.description LIKE ?)';
      values.push(`%${search}%`, `%${search}%`);
    }

    // Filter by category
    if (category) {
      whereClause += ' AND s.category_id = ?';
      values.push(category);
    }

    // Filter by city
    if (city) {
      whereClause += ' AND s.city = ?';
      values.push(city);
    }

    // Filter by price range
    if (minPrice) {
      whereClause += ' AND s.price >= ?';
      values.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      whereClause += ' AND s.price <= ?';
      values.push(parseFloat(maxPrice));
    }

    // Filter by minimum provider rating
    if (minRating) {
      whereClause += ' AND u.rating_avg >= ?';
      values.push(parseFloat(minRating));
    }

    // Filter by remote availability
    if (isRemote === 'true') {
      whereClause += ' AND s.is_remote = 1';
    }

    // Valid sort fields
    const validSortFields = ['created_at', 'price', 'title', 'u.rating_avg'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM services s 
      JOIN users u ON s.user_id = u.id 
      ${whereClause}
    `;
    const countResult = await query(countQuery, values);
    const total = countResult[0].total;

    // Get services with pagination
    const servicesQuery = `
      SELECT 
        s.id,
        s.title,
        s.description,
        s.price,
        s.price_type,
        s.location,
        s.city,
        s.is_remote,
        s.is_available,
        s.duration_minutes,
        s.views_count,
        s.created_at,
        u.id as provider_id,
        CONCAT(u.first_name, ' ', u.last_name) as provider_name,
        u.profile_image,
        u.rating_avg as provider_rating,
        u.is_verified as provider_verified,
        sc.name as category_name,
        sc.icon as category_icon
      FROM services s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      ${whereClause}
      ORDER BY ${sortField} ${order}
      LIMIT ? OFFSET ?
    `;

    const services = await query(servicesQuery, [...values, parseInt(limit), offset]);

    // Get primary image for each service
    for (const service of services) {
      const images = await query(
        'SELECT image_url FROM service_images WHERE service_id = ? AND is_primary = 1 LIMIT 1',
        [service.id]
      );
      service.image = images.length > 0 ? images[0].image_url : null;
    }

    res.json({
      success: true,
      data: {
        services,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get a single service by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Increment view count
    await query('UPDATE services SET views_count = views_count + 1 WHERE id = ?', [id]);

    const services = await query(
      `SELECT 
        s.id,
        s.title,
        s.description,
        s.price,
        s.price_type,
        s.location,
        s.city,
        s.is_remote,
        s.is_available,
        s.duration_minutes,
        s.views_count,
        s.created_at,
        u.id as provider_id,
        CONCAT(u.first_name, ' ', u.last_name) as provider_name,
        u.profile_image,
        u.rating_avg as provider_rating,
        u.total_reviews as provider_total_reviews,
        u.is_verified as provider_verified,
        u.bio as provider_bio,
        sc.id as category_id,
        sc.name as category_name,
        sc.icon as category_icon
      FROM services s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.id = ? AND s.status = 'Active'`,
      [id]
    );

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const service = services[0];

    // Get service images
    const images = await query(
      'SELECT image_url, is_primary, display_order FROM service_images WHERE service_id = ? ORDER BY display_order',
      [id]
    );
    service.images = images;

    // Get provider skills
    const skills = await query(
      `SELECT s.id, s.name, s.category, us.experience_level, us.years_of_experience
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = ?`,
      [service.provider_id]
    );
    service.provider_skills = skills;

    // Get recent reviews for provider
    const reviews = await query(
      `SELECT r.rating, r.comment, r.created_at, 
              CONCAT(u.first_name, ' ', LEFT(u.last_name, 1), '.') as reviewer_name,
              r.is_anonymous
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.reviewed_id = ?
       ORDER BY r.created_at DESC
       LIMIT 5`,
      [service.provider_id]
    );
    service.provider_reviews = reviews;

    res.json({
      success: true,
      data: service
    });

  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create a new service (requires authentication)
router.post('/', [
  authenticateToken,
  body('title').trim().notEmpty().isLength({ min: 3, max: 255 }),
  body('description').trim().notEmpty(),
  body('category_id').optional().isInt({ min: 1 }),
  body('price').optional().isFloat({ min: 0 }),
  body('price_type').optional().isIn(['Fixed', 'Hourly', 'Negotiable', 'Free']),
  body('location').optional().trim(),
  body('city').optional().trim(),
  body('is_remote').optional().isBoolean(),
  body('duration_minutes').optional().isInt({ min: 15, max: 480 })
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

    const {
      title,
      description,
      category_id,
      price,
      price_type,
      location,
      city,
      is_remote,
      duration_minutes
    } = req.body;

    const userId = req.user.id;

    const result = await query(
      `INSERT INTO services (user_id, title, description, category_id, price, price_type, 
              location, city, is_remote, duration_minutes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, description, category_id, price || 0, price_type || 'Fixed', 
       location, city, is_remote || false, duration_minutes || 60]
    );

    const serviceId = result.insertId;

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: {
        id: serviceId,
        title,
        description,
        category_id,
        price,
        price_type,
        location,
        city,
        is_remote,
        duration_minutes
      }
    });

  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update a service (requires authentication and ownership)
router.put('/:id', [
  authenticateToken,
  body('title').optional().trim().isLength({ min: 3, max: 255 }),
  body('description').optional().trim(),
  body('category_id').optional().isInt({ min: 1 }),
  body('price').optional().isFloat({ min: 0 }),
  body('price_type').optional().isIn(['Fixed', 'Hourly', 'Negotiable', 'Free']),
  body('location').optional().trim(),
  body('city').optional().trim(),
  body('is_remote').optional().isBoolean(),
  body('is_available').optional().isBoolean(),
  body('duration_minutes').optional().isInt({ min: 15, max: 480 })
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
    const userId = req.user.id;

    // Check ownership
    const services = await query('SELECT user_id FROM services WHERE id = ?', [id]);
    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (services[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own services'
      });
    }

    const {
      title,
      description,
      category_id,
      price,
      price_type,
      location,
      city,
      is_remote,
      is_available,
      duration_minutes
    } = req.body;

    const updateFields = [];
    const values = [];

    if (title) { updateFields.push('title = ?'); values.push(title); }
    if (description) { updateFields.push('description = ?'); values.push(description); }
    if (category_id) { updateFields.push('category_id = ?'); values.push(category_id); }
    if (price) { updateFields.push('price = ?'); values.push(price); }
    if (price_type) { updateFields.push('price_type = ?'); values.push(price_type); }
    if (location) { updateFields.push('location = ?'); values.push(location); }
    if (city) { updateFields.push('city = ?'); values.push(city); }
    if (is_remote !== undefined) { updateFields.push('is_remote = ?'); values.push(is_remote); }
    if (is_available !== undefined) { updateFields.push('is_available = ?'); values.push(is_available); }
    if (duration_minutes) { updateFields.push('duration_minutes = ?'); values.push(duration_minutes); }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateFields.push('updated_at = NOW()');
    values.push(id);

    await query(`UPDATE services SET ${updateFields.join(', ')} WHERE id = ?`, values);

    res.json({
      success: true,
      message: 'Service updated successfully'
    });

  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete a service (soft delete - sets status to Inactive)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check ownership
    const services = await query('SELECT user_id FROM services WHERE id = ?', [id]);
    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (services[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own services'
      });
    }

    await query("UPDATE services SET status = 'Inactive', is_available = 0, updated_at = NOW() WHERE id = ?", [id]);

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all service categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await query(
      'SELECT id, name, description, icon FROM service_categories WHERE is_active = 1 ORDER BY name'
    );

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get services by provider
router.get('/provider/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const services = await query(
      `SELECT 
        s.id, s.title, s.description, s.price, s.price_type, s.location, s.city,
        s.is_remote, s.is_available, s.duration_minutes, s.views_count, s.created_at,
        sc.name as category_name
      FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.user_id = ? AND s.status = 'Active' AND s.is_available = 1
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?`,
      [providerId, parseInt(limit), offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) as total FROM services WHERE user_id = ? AND status = ? AND is_available = 1',
      [providerId, 'Active']
    );

    res.json({
      success: true,
      data: {
        services,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get provider services error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;