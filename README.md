# writespace

A simple, powerful writing platform for bloggers, journalists, and content creators.

## Features

- Rich text editing with formatting options
- Auto-save functionality
- Easy sharing and publishing
- Privacy controls for drafts
- User authentication and role management
- Admin dashboard for user and content management
- Dark mode support

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Icons**: React Icons
- **Form Validation**: PropTypes
- **Security**: DOMPurify
- **Testing**: Vitest + Testing Library

## Getting Started

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

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Create a production build
- `npm run preview`: Preview the production build locally
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode

## Project Structure

```
writespace/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── stores/        # Zustand stores
│   ├── constants.js   # Application constants
│   ├── hooks/         # Custom hooks
│   ├── App.jsx        # Main application component
│   ├── main.jsx       # Application entry point
│   └── index.css      # Global styles
├── index.html         # HTML entry point
├── package.json       # Project configuration
├── tailwind.config.js # Tailwind CSS configuration
├── postcss.config.js  # PostCSS configuration
└── vite.config.js     # Vite configuration
```

## Deployment

### Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Drag and drop the `dist` folder to Netlify

### Static Hosting

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the contents of the `dist` folder to your hosting provider

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=your_api_base_url
```

## Testing

Run tests with:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.