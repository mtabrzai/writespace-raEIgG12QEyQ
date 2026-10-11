# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-07-10

### Added
- Initial release of writespace
- **User Authentication**
  - Login and registration system
  - Admin and regular user roles
  - Session management with Zustand store
  - Protected routes with role-based access control
- **Blog Management**
  - Rich text editing with formatting options
  - Create, read, update, and delete blog posts
  - Draft and published post states
  - Tagging system for posts
  - Auto-save functionality
- **Admin Dashboard**
  - User management (create, view, delete users)
  - Content management overview
  - Statistics and metrics
- **UI Components**
  - Responsive navbar with dark mode support
  - Avatar components with role badges
  - Feature cards for landing page
  - Post cards for displaying blog content
  - Form components with validation
- **Deployment Support**
  - Vercel deployment configuration
  - Netlify deployment configuration
  - Docker containerization support
  - GitHub Actions for continuous deployment
  - Static hosting support (GitHub Pages, AWS S3)
- **Testing**
  - Vitest configuration for unit testing
  - Testing Library for React component testing
  - JSDOM for DOM testing
- **Development Tools**
  - Vite for fast development and building
  - Tailwind CSS for styling
  - React Router DOM for client-side routing
  - DOMPurify for content sanitization
  - PropTypes for runtime type checking
  - clsx for conditional class names

### Changed
- N/A (Initial release)

### Deprecated
- N/A (Initial release)

### Removed
- N/A (Initial release)

### Fixed
- N/A (Initial release)

### Security
- Content sanitization with DOMPurify
- Environment variable handling
- Protected routes for sensitive areas

## Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- npm (v9 or later)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/writespace.git
   cd writespace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Default Credentials
- **Admin**:
  - Username: `admin`
  - Password: `SecurePassword123!`

- **Regular User**:
  - Any email/password combination will work for registration

### Environment Variables
Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=your_api_base_url
```

### Available Scripts
- `npm run dev`: Start the development server
- `npm run build`: Create a production build
- `npm run preview`: Preview the production build locally
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode