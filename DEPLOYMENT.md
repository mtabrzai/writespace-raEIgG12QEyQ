# Deployment Guide

This guide provides step-by-step instructions for deploying writespace to various platforms.

## Vercel

Vercel is the recommended platform for deploying writespace. It provides seamless integration with the Vite build system and automatic deployments from Git.

### Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- The Vercel CLI installed (optional, for local deployment)
- A GitHub, GitLab, or Bitbucket repository with the writespace code

### Deployment Steps

#### Using the Vercel Website

1. Go to [vercel.com](https://vercel.com) and sign in to your account
2. Click the **"Add New"** button and select **"Project"**
3. Import your writespace Git repository
4. Configure the project settings:
   - **Project Name**: writespace
   - **Framework Preset**: Vite
   - **Root Directory**: Leave empty (or specify if your project is in a subdirectory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**

#### Using the Vercel CLI

1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your writespace project directory:
   ```bash
   cd writespace
   ```

3. Run the deployment command:
   ```bash
   vercel
   ```

4. Follow the prompts to:
   - Link your project to an existing Vercel project or create a new one
   - Set the project name
   - Choose the root directory
   - Confirm the build settings

5. Your project will be deployed automatically

### Environment Variables

Configure the following environment variables in your Vercel project settings:

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variables:

```
VITE_API_BASE_URL=your_api_base_url
```

### Custom Domains

To add a custom domain to your Vercel deployment:

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** > **Domains**
3. Enter your custom domain name
4. Follow the instructions to configure DNS settings with your domain provider

## Netlify

### Prerequisites

- A Netlify account (sign up at [netlify.com](https://www.netlify.com))
- The writespace code in a Git repository

### Deployment Steps

1. Go to [netlify.com](https://www.netlify.com) and sign in to your account
2. Click **"Add new site"** and select **"Import an existing project"**
3. Connect your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your writespace repository
5. Configure the build settings:
   - **Base directory**: Leave empty (or specify if your project is in a subdirectory)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**

### Environment Variables

Configure environment variables in Netlify:

1. Go to your site dashboard on Netlify
2. Navigate to **Site settings** > **Environment variables**
3. Add the following variable:

```
VITE_API_BASE_URL=your_api_base_url
```

## Static Hosting (GitHub Pages, AWS S3, etc.)

### Prerequisites

- A built version of your writespace application (`dist` directory)
- Access to your hosting provider

### Deployment Steps

1. Build your application:
   ```bash
   npm run build
   ```

2. The build process will create a `dist` directory with all the static files needed for deployment

3. Upload the contents of the `dist` directory to your hosting provider:

   - **GitHub Pages**: Push the contents to a `gh-pages` branch or use the `gh-pages` npm package
   - **AWS S3**: Upload the files to your S3 bucket and configure it for static website hosting
   - **Other providers**: Follow their specific instructions for hosting static files

### Environment Variables

For static hosting, environment variables need to be configured at build time:

1. Create a `.env` file in your project root with the required variables:
   ```
   VITE_API_BASE_URL=your_api_base_url
   ```

2. Run the build command:
   ```bash
   npm run build
   ```

3. The environment variables will be embedded in the built files

## Docker Deployment

### Prerequisites

- Docker installed on your system
- Dockerfile (included in the project)

### Building the Docker Image

1. Build the Docker image:
   ```bash
   docker build -t writespace .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:80 writespace
   ```

3. Access the application at `http://localhost:3000`

### Dockerfile

The project includes a Dockerfile for containerized deployment:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

The project includes an nginx configuration file (`nginx.conf`):

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Handle API requests if needed
    # location /api {
    #     proxy_pass http://api-server;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    # }
}
```

## Continuous Deployment

### GitHub Actions

The project includes a GitHub Actions workflow file (`.github/workflows/deploy.yml`) for continuous deployment:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        run: npm install -g vercel && vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Setting up GitHub Actions

1. Create the following secrets in your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel access token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

2. The workflow will automatically deploy your application to Vercel whenever changes are pushed to the main branch

## Troubleshooting

### Common Issues

1. **Build fails with "Module not found" errors**:
   - Ensure all dependencies are listed in package.json
   - Run `npm install` to update dependencies
   - Check for typos in import statements

2. **Environment variables not available**:
   - Ensure variables are prefixed with `VITE_` for Vite applications
   - For static hosting, ensure variables are set before building
   - For Vercel/Netlify, ensure variables are configured in the project settings

3. **White screen after deployment**:
   - Check the browser console for errors
   - Ensure the build output directory is correctly specified
   - Verify that the router is configured correctly for the deployment environment

4. **API requests failing**:
   - Ensure the `VITE_API_BASE_URL` environment variable is correctly set
   - Check CORS settings on your API server
   - Verify that the API endpoint is accessible from the deployed environment

5. **CSS not loading**:
   - Ensure the build process completed successfully
   - Check that static files are being served correctly
   - Verify that the base path in vite.config.js is correct

### Getting Help

If you encounter issues during deployment:

1. Check the [Vite documentation](https://vitejs.dev/guide/)
2. Review the [Vercel documentation](https://vercel.com/docs)
3. Consult the [React documentation](https://react.dev/)
4. Open an issue in the writespace GitHub repository