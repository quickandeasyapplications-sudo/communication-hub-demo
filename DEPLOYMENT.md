# Commercial Deployment Guide for Quick and Easy Tech Communication Hub (Client & Server)

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

The Communication Hub is now a two-part application: a **Client (React App)** and a **Server (Node.js/Socket.io)**. A commercial deployment requires hosting both components.

Before deploying the Communication Hub, ensure you have:

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher (or npm/yarn)
- Access to the necessary API keys (OpenAI API key for AI features)
- **A hosting platform capable of running a persistent Node.js server (e.g., AWS EC2, DigitalOcean Droplet, Heroku, or a specialized PaaS) for the real-time collaboration feature.**
- A web server or hosting platform for the static client files.

Before deploying the Communication Hub, ensure you have:

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher (or npm/yarn)
- Access to the necessary API keys (OpenAI API key for AI features)
- A web server or hosting platform for production deployment

## Local Development and Testing (Client & Server)

To run the full application locally, you must start both the client and the server.

### 1. Server Setup and Start
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `pnpm install`
3. Create a `.env` file from `.env.example` and set `CLIENT_URL` to your client's local development URL (e.g., `http://localhost:5173`).
4. Start the server:
   ```bash
   pnpm start
   ```
   The server will run on the port specified in your `.env` file (default: 3001).

### 2. Client Setup and Start
1. Navigate to the `communication-hub` directory: `cd communication-hub`
2. Install dependencies: `pnpm install`
3. Create a `.env` file from `.env.example` and set `VITE_OPENAI_API_KEY` and `VITE_API_BASE_URL` (if needed).
4. **Crucially, set the collaboration server URL:**
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_API_BASE_URL=your_api_base_url_if_needed
   VITE_COLLABORATION_SERVER=http://localhost:3001
   ```
5. Start the development server:
   ```bash
   pnpm run dev
   ```
   The client will typically run on port 5173.

### Production Build (Client Only)

1. Build the client application:
   ```bash
   cd communication-hub
   pnpm run build
   ```
2. The static files are in the `dist` folder.

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

## Commercial Production Deployment (Client & Server)

Commercial deployment requires hosting the client (static files) and the server (Node.js application) separately.

### 1. Server Deployment (Node.js/Socket.io)

The server must be deployed to a platform that supports persistent Node.js applications (e.g., AWS EC2, Heroku, DigitalOcean).

1. **Build and Configure**:
   *   Navigate to the `server` directory.
   *   Ensure all dependencies are installed: `pnpm install`
   *   **Set Environment Variables**: Configure the `PORT` (e.g., 80 or 443) and, most importantly, set the **`CLIENT_URL`** to the public URL of your deployed client (e.g., `https://app.yourdomain.com`). This is vital for CORS.

2. **Deployment**:
   *   Deploy the `server` directory contents to your chosen Node.js hosting platform.
   *   Start the server using `pnpm start` or a process manager like PM2.
   *   **Record the public URL of the deployed server** (e.g., `https://api.yourdomain.com:3001`).

### 2. Client Deployment (Static Files)

The client is a static application and can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, Nginx, etc.).

1. **Build the Client**:
   ```bash
   cd communication-hub
   pnpm run build
   ```
2. **Configure Client Environment**:
   *   Before building, ensure the client's production environment variable `VITE_COLLABORATION_SERVER` is set to the public URL of your deployed server (e.g., `https://api.yourdomain.com:3001`).
   *   If deploying to a GitHub Pages subdirectory, ensure `vite.config.js` has the correct `base` path.

3. **Deploy the `dist` folder**:
   *   Copy the contents of the `communication-hub/dist` directory to your static hosting platform.

### Traditional Web Server (Apache/Nginx) - Client Only

This section is for the static client files only. The server must be hosted separately.

1. Build the application:
   ```bash
   pnpm run build
   ```
2. Copy the contents of the `dist` directory to your web server's document root or a subdirectory.
3. Configure your web server for single-page application routing (as detailed below).

**Apache** (`.htaccess` file in the root directory):
... (Existing Apache config)

**Nginx** (in your server block):
... (Existing Nginx config)

### Node.js Server - Client Only (Deprecated for Commercial Use)

This method is not recommended for commercial deployment as it only serves the static files and does not run the real-time server.

1. Install a simple HTTP server:
... (Existing Node.js Server config)

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

## Docker Deployment (Client & Server)

For a unified deployment, a multi-stage Docker setup is recommended.

1. **Create a `Dockerfile`** in the project root (`/communication-hub-final-production/`):
   ```dockerfile
   # --- Stage 1: Build Client ---
   FROM node:20-alpine AS client-build
   WORKDIR /app/client
   COPY communication-hub/package.json communication-hub/pnpm-lock.yaml ./
   RUN npm install -g pnpm && pnpm install --frozen-lockfile
   COPY communication-hub/. .
   # Set VITE_COLLABORATION_SERVER to the internal Docker service name (e.g., http://server:3001)
   ARG VITE_COLLABORATION_SERVER
   ENV VITE_COLLABORATION_SERVER=$VITE_COLLABORATION_SERVER
   RUN pnpm run build

   # --- Stage 2: Build Server ---
   FROM node:20-alpine AS server-build
   WORKDIR /app/server
   COPY server/package.json server/pnpm-lock.yaml ./
   RUN npm install -g pnpm && pnpm install --frozen-lockfile
   COPY server/. .

   # --- Stage 3: Final Production Image ---
   FROM nginx:stable-alpine
   # Copy built client files
   COPY --from=client-build /app/client/dist /usr/share/nginx/html
   # Copy built server files
   COPY --from=server-build /app/server /usr/src/app
   
   # Expose ports for Nginx (Client) and Node.js (Server)
   EXPOSE 80 3001
   
   # Use a custom startup script to run both Nginx and Node.js server
   COPY startup.sh /usr/local/bin/
   RUN chmod +x /usr/local/bin/startup.sh
   
   CMD ["startup.sh"]
   ```

2. **Create a `startup.sh`** script in the project root:
   ```bash
   #!/bin/sh
   # Start the Node.js server in the background
   node /usr/src/app/server.js &
   # Start Nginx in the foreground
   nginx -g "daemon off;"
   ```

3. **Use Docker Compose** for easy management and networking.

This is the recommended approach for commercial deployment.

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

## Cloud Deployment (PaaS/IaaS)

For commercial use, deploying to a Platform as a Service (PaaS) or Infrastructure as a Service (IaaS) is recommended.

### Vercel/Netlify (Client Only)

These are suitable for the static client only. You will need a separate deployment for the server.

... (Existing Vercel/Netlify config)

### AWS Amplify (Client Only)

... (Existing AWS Amplify config)

### Heroku/DigitalOcean App Platform (Server Recommended)

These platforms are ideal for hosting the Node.js server component.

1. **Deploy Server**: Deploy the `server` directory as a Node.js application.
2. **Deploy Client**: Deploy the `communication-hub` directory to a static hosting service or a separate build pipeline.

**Crucial Step**: Ensure the `VITE_COLLABORATION_SERVER` variable in the client build is set to the public URL of the deployed server.

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
