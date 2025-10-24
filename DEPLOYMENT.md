# Deployment Guide for Quick and Easy Tech Communication Hub

This guide provides detailed instructions for deploying the Communication Hub application in various environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Deployment](#local-deployment)
3. [Server Deployment](#server-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Cloud Deployment](#cloud-deployment)
6. [Environment Variables](#environment-variables)
7. [Security Considerations](#security-considerations)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying the Communication Hub, ensure you have:

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher (or npm/yarn)
- Access to the necessary API keys (OpenAI API key for AI features)
- A web server or hosting platform for production deployment

## Local Deployment

### Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/communication-hub.git
   cd communication-hub
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory with the required environment variables:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   pnpm run dev
   ```

5. Access the application at `http://localhost:3000`

### Production Build (Local)

1. Build the application:
   ```bash
   pnpm run build
   ```

2. Preview the production build locally:
   ```bash
   pnpm run preview
   ```

3. Access the application at `http://localhost:4173`

## Server Deployment

### Traditional Web Server (Apache/Nginx)

1. Build the application:
   ```bash
   pnpm run build
   ```

2. Copy the contents of the `dist` directory to your web server's document root or a subdirectory.

3. Configure your web server:

   **Apache** (`.htaccess` file in the root directory):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

   **Nginx** (in your server block):
   ```nginx
   location / {
     root /path/to/communication-hub/dist;
     try_files $uri $uri/ /index.html;
   }
   ```

4. Restart your web server to apply the changes.

### Node.js Server

1. Install a simple HTTP server:
   ```bash
   pnpm add -g serve
   ```

2. Build the application:
   ```bash
   pnpm run build
   ```

3. Serve the production build:
   ```bash
   serve -s dist
   ```

4. Access the application at the URL provided by the serve command.

## Docker Deployment

1. Create a `Dockerfile` in the root directory:
   ```dockerfile
   FROM node:18-alpine AS build
   WORKDIR /app
   RUN npm install -g pnpm
   COPY package.json pnpm-lock.yaml ./
   RUN pnpm install
   COPY . .
   RUN pnpm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. Create an `nginx.conf` file:
   ```nginx
   server {
     listen 80;
     server_name _;
     
     location / {
       root /usr/share/nginx/html;
       index index.html;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. Build the Docker image:
   ```bash
   docker build -t communication-hub .
   ```

4. Run the Docker container:
   ```bash
   docker run -p 8080:80 -d communication-hub
   ```

5. Access the application at `http://localhost:8080`

## Cloud Deployment

### Netlify

1. Install the Netlify CLI:
   ```bash
   pnpm add -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Build and deploy:
   ```bash
   pnpm run build
   netlify deploy --prod
   ```

4. Follow the prompts to complete the deployment.

### Vercel

1. Install the Vercel CLI:
   ```bash
   pnpm add -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the application:
   ```bash
   vercel --prod
   ```

4. Follow the prompts to complete the deployment.

### AWS Amplify

1. Install the AWS Amplify CLI:
   ```bash
   pnpm add -g @aws-amplify/cli
   ```

2. Configure Amplify:
   ```bash
   amplify configure
   ```

3. Initialize Amplify in your project:
   ```bash
   amplify init
   ```

4. Add hosting:
   ```bash
   amplify add hosting
   ```

5. Deploy:
   ```bash
   amplify publish
   ```

## Environment Variables

The Communication Hub requires certain environment variables to function properly:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENAI_API_KEY` | API key for OpenAI services | Yes (for AI features) |
| `VITE_API_BASE_URL` | Base URL for backend API | No (defaults to mock data) |
| `VITE_MOCK_DATA` | Use mock data instead of real API calls | No (defaults to "false") |

### Setting Environment Variables

**Development**:
Create a `.env` file in the root directory with the required variables.

**Production**:
Set environment variables according to your hosting platform's documentation:

- **Netlify**: In the Netlify dashboard under Site settings > Build & deploy > Environment
- **Vercel**: In the Vercel dashboard under Project settings > Environment Variables
- **AWS Amplify**: In the Amplify Console under App settings > Environment variables

## Security Considerations

1. **API Keys**: Never commit API keys to your repository. Always use environment variables.

2. **HTTPS**: Ensure your production deployment uses HTTPS to encrypt data in transit.

3. **Content Security Policy**: Consider implementing a Content Security Policy to prevent XSS attacks.

4. **Regular Updates**: Keep dependencies updated to patch security vulnerabilities.

5. **Access Control**: Implement proper authentication and authorization if connecting to backend services.

## Troubleshooting

### Blank Screen After Deployment

1. Check the browser console for errors.
2. Ensure all environment variables are correctly set.
3. Verify that the server is configured to serve the `index.html` file for all routes.

### API Connection Issues

1. Check that the API keys are correctly set in environment variables.
2. Verify network connectivity to the API endpoints.
3. Check for CORS issues if using a separate backend.

### Build Failures

1. Ensure all dependencies are installed: `pnpm install`
2. Clear the cache: `pnpm cache clean`
3. Remove node_modules and reinstall: `rm -rf node_modules && pnpm install`

### Performance Issues

1. Analyze the bundle size: `pnpm run build -- --report`
2. Consider code splitting for large components.
3. Optimize images and other assets.

---

For additional support, please contact the Quick and Easy Tech support team.

© 2025 Quick and Easy Tech. All rights reserved.
