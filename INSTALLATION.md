# Installation Guide - Quick and Easy Tech Communication Hub

This comprehensive guide provides step-by-step instructions for installing and configuring the Communication Hub application.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Pre-Installation Checklist](#pre-installation-checklist)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [First-Time Setup](#first-time-setup)
6. [Verification](#verification)
7. [Common Installation Issues](#common-installation-issues)

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **Processor**: Dual-core 2.0 GHz or faster
- **RAM**: 4 GB
- **Storage**: 500 MB available space
- **Internet**: Broadband connection (5 Mbps or faster)
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

### Recommended Requirements

- **Processor**: Quad-core 2.5 GHz or faster
- **RAM**: 8 GB or more
- **Storage**: 1 GB available space
- **Internet**: Broadband connection (25 Mbps or faster)

### Software Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **Package Manager**: pnpm 8.0.0+ (recommended) or npm 9.0.0+
- **Git**: Version 2.30.0 or higher (for version control)

## Pre-Installation Checklist

Before installing the Communication Hub, ensure you have:

- [ ] Administrative/sudo access on your system
- [ ] Node.js and pnpm installed
- [ ] API keys for required services (OpenAI for AI features)
- [ ] Access credentials for messaging platforms you want to integrate
- [ ] Firewall configured to allow necessary connections
- [ ] Antivirus software configured to allow the application

## Installation Steps

### Step 1: Install Node.js and pnpm

#### Windows

1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the prompts
3. Open Command Prompt and verify installation:
   ```cmd
   node --version
   npm --version
   ```
4. Install pnpm globally:
   ```cmd
   npm install -g pnpm
   ```

#### macOS

1. Using Homebrew:
   ```bash
   brew install node
   brew install pnpm
   ```
2. Verify installation:
   ```bash
   node --version
   pnpm --version
   ```

#### Linux (Ubuntu/Debian)

1. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
2. Install pnpm:
   ```bash
   npm install -g pnpm
   ```
3. Verify installation:
   ```bash
   node --version
   pnpm --version
   ```

### Step 2: Extract the Application

1. Extract the `communication-hub-production.zip` file to your desired location:
   - **Windows**: Right-click the zip file and select "Extract All"
   - **macOS**: Double-click the zip file
   - **Linux**: Use the command `unzip communication-hub-production.zip`

2. Navigate to the extracted directory:
   ```bash
   cd communication-hub
   ```

### Step 3: Install Dependencies

1. Open a terminal/command prompt in the application directory

2. Install all required dependencies:
   ```bash
   pnpm install
   ```

   This process may take 5-10 minutes depending on your internet connection.

3. Wait for the installation to complete. You should see a message indicating successful installation.

### Step 4: Configure Environment Variables

1. Create a `.env` file in the root directory of the application:
   ```bash
   # Windows (Command Prompt)
   copy .env.example .env
   
   # macOS/Linux
   cp .env.example .env
   ```

2. Open the `.env` file in a text editor and add your configuration:
   ```
   # OpenAI API Configuration (Required for AI features)
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional: Custom API Base URL
   # VITE_API_BASE_URL=https://your-api-server.com
   
   # Optional: Enable mock data for testing
   # VITE_MOCK_DATA=false
   ```

3. Save the file

### Step 5: Build the Application

1. Build the production version:
   ```bash
   pnpm run build
   ```

2. The build process will create a `dist` directory with optimized files

3. Verify the build completed successfully (you should see a success message)

## Configuration

### API Keys Setup

#### OpenAI API Key (Required for AI Features)

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

#### Platform Integration Keys (Optional)

If you plan to connect real messaging platforms:

- **WhatsApp Business API**: Contact WhatsApp for business API access
- **Telegram Bot API**: Create a bot through @BotFather on Telegram
- **Slack API**: Create an app in the Slack API dashboard
- **Discord Bot**: Create a bot in the Discord Developer Portal
- **Microsoft Teams**: Register an app in Azure AD

### Network Configuration

1. **Firewall Rules**: Ensure the following ports are open:
   - Port 3000 (development server)
   - Port 443 (HTTPS for production)

2. **Proxy Settings**: If behind a corporate proxy, configure:
   ```bash
   # Set proxy environment variables
   export HTTP_PROXY=http://proxy.company.com:8080
   export HTTPS_PROXY=http://proxy.company.com:8080
   ```

### Security Configuration

1. **HTTPS Certificate**: For production deployment, obtain an SSL certificate:
   - Use Let's Encrypt for free certificates
   - Or purchase from a certificate authority

2. **Content Security Policy**: Review and adjust CSP settings in `index.html` if needed

## First-Time Setup

### Starting the Application

#### Development Mode

1. Start the development server:
   ```bash
   pnpm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. The application should load and display the login/welcome screen

#### Production Mode

1. After building, serve the production files:
   ```bash
   pnpm run preview
   ```

2. Or use a production web server (see DEPLOYMENT.md for details)

### Initial Configuration Wizard

1. **Welcome Screen**: Click "Get Started" to begin setup

2. **Platform Connection**: 
   - Select which platforms you want to connect
   - Follow the authentication prompts for each platform
   - Grant necessary permissions

3. **Profile Setup**:
   - Add your name and profile picture
   - Set your status message
   - Configure notification preferences

4. **Preferences**:
   - Choose your theme (Light/Dark)
   - Set language preferences
   - Configure keyboard shortcuts

5. **Complete Setup**: Click "Finish" to start using the application

## Verification

### Testing the Installation

1. **Basic Functionality Test**:
   - [ ] Application loads without errors
   - [ ] Navigation between sections works
   - [ ] Search functionality responds
   - [ ] Settings can be accessed and modified

2. **Platform Integration Test** (if configured):
   - [ ] Platforms show as connected
   - [ ] Messages can be viewed
   - [ ] New messages appear in real-time
   - [ ] Sending messages works

3. **AI Features Test** (if API key configured):
   - [ ] Smart replies appear for conversations
   - [ ] Sentiment analysis displays correctly
   - [ ] Workflow automation can be configured

4. **Performance Test**:
   - [ ] Application loads in under 3 seconds
   - [ ] Navigation is smooth and responsive
   - [ ] No console errors in browser developer tools

### Checking Logs

1. **Browser Console**: Press F12 and check the Console tab for errors

2. **Application Logs**: Check the terminal/command prompt where you started the application

3. **Network Activity**: In browser DevTools, check the Network tab for failed requests

## Common Installation Issues

### Issue: "Command not found: pnpm"

**Solution**:
```bash
npm install -g pnpm
```

### Issue: "EACCES: permission denied"

**Solution** (Linux/macOS):
```bash
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

### Issue: "Port 3000 is already in use"

**Solution**:
1. Find and stop the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   ```

2. Or use a different port:
   ```bash
   pnpm run dev -- --port 3001
   ```

### Issue: "Module not found" errors

**Solution**:
1. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules
   pnpm install
   ```

2. Clear pnpm cache:
   ```bash
   pnpm store prune
   ```

### Issue: Build fails with memory error

**Solution**:
Increase Node.js memory limit:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm run build
```

### Issue: API key not working

**Solution**:
1. Verify the API key is correctly set in `.env`
2. Ensure there are no extra spaces or quotes
3. Restart the development server after changing `.env`
4. Check API key validity on the provider's dashboard

### Issue: Blank screen after deployment

**Solution**:
1. Check browser console for errors
2. Verify all assets are properly served
3. Check that the base URL is correctly configured
4. Ensure JavaScript is enabled in the browser

## Getting Help

If you encounter issues not covered in this guide:

1. **Documentation**: Review the USER_GUIDE.md and DEPLOYMENT.md files
2. **Support**: Contact Quick and Easy Tech support at support@quickandeasytech.com
3. **Community**: Check the FAQ section in USER_GUIDE.md

## Next Steps

After successful installation:

1. Read the [USER_GUIDE.md](./USER_GUIDE.md) for detailed feature documentation
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment options
3. Explore the application and customize settings to your preferences
4. Connect your messaging platforms and start unifying your communications

---

© 2025 Quick and Easy Tech. All rights reserved.
