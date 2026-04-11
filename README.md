# ShareSpace - A Modern Service Marketplace

ShareSpace is a modern, responsive ReactJS web application for a service marketplace platform. This is a **frontend-only** project built with React 18, React Router, and modern CSS.

## 🚀 Features

### Core Pages
- **Landing Page** - Modern homepage with hero section, featured services, and call-to-action
- **Login Page** - User authentication with demo credentials
- **Register Page** - New user registration
- **About Us** - Company information, mission, vision, and team
- **Contact Us** - Contact form with company information
- **Search Services** - Advanced service search with filters
- **Dashboard** - User dashboard with statistics and management
- **Messages** - Real-time messaging interface
- **Create Service** - Service creation form

### Additional Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI/UX** - Clean design with smooth animations
- **Navigation System** - Full navigation with mobile menu
- **Footer** - Complete footer with links and contact info

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Lucide React** - Beautiful SVG icons
- **CSS3** - Custom styling with modern features
- **Vite** - Fast build tool and dev server

## 📁 Project Structure

```
ShareSpace/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout with header/footer
│   │   └── Layout.css          # Layout styles
│   ├── pages/
│   │   ├── home.jsx            # Landing page
│   │   ├── Home.css            # Home page styles
│   │   ├── Login.jsx           # Login page
│   │   ├── Login.css           # Login page styles
│   │   ├── Register.jsx        # Registration page
│   │   ├── About.jsx           # About Us page
│   │   ├── About.css           # About page styles
│   │   ├── Contact.jsx         # Contact Us page
│   │   ├── Contact.css         # Contact page styles
│   │   ├── Search.jsx          # Service search page
│   │   ├── Search.css          # Search page styles
│   │   ├── Dashboard.jsx       # User dashboard
│   │   ├── Dashboard.css       # Dashboard styles
│   │   ├── Messages.jsx        # Messaging system
│   │   ├── Messages.css        # Messaging styles
│   │   ├── CreateService.jsx   # Service creation page
│   │   └── CreateService.css   # Service creation styles
│   ├── App.jsx                 # Main App component
│   ├── App.css                 # App styles
│   └── main.jsx                # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to the ShareSpace directory**
   ```bash
   cd ShareSpace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser to: http://localhost:5173

### Demo Credentials
For testing the login page:
- **Email:** user@example.com
- **Password:** password123

## 📖 Pages Overview

### Landing Page (/)
- Hero section with call-to-action
- Featured services showcase
- How it works section
- Benefits and features

### About Us (/about)
- Company mission and vision
- Statistics and achievements
- Team members
- Why choose us

### Contact Us (/contact)
- Contact form
- Email, phone, and address
- Business hours
- Success message on submission

### Search (/search)
- Service search with filters
- Category filtering
- Price range filtering
- Rating filters
- Grid and list view options

### Dashboard (/dashboard)
- User profile overview
- Service management
- Request tracking
- Reviews and ratings
- Settings

### Messages (/messages)
- Conversation list
- Real-time chat interface
- Search conversations
- Online status indicators

### Create Service (/create-service)
- Service title and description
- Category selection
- Pricing options
- Location settings
- Image upload

## 🎨 Design Features

### Color Scheme
- Primary: #3b82f6 (Blue)
- Secondary: #2563eb (Dark Blue)
- Success: #10b981 (Green)
- Warning: #f59e0b (Orange)
- Error: #dc2626 (Red)

### Typography
- Headings: Bold, modern font weights
- Body: Clean, readable font sizes
- Buttons: Consistent styling with hover effects

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

### Production Build
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## 📄 License

This project is created for educational purposes.

## 🙏 Acknowledgments

- Built with React 18 and Vite
- Icons by Lucide React
- Designed with modern UI/UX principles

---

**ShareSpace** - Connecting talents with opportunities, one service at a time. 🚀