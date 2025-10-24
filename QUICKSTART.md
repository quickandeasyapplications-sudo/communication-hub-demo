# Quick Start Guide - Communication Hub

Get up and running with the Quick and Easy Tech Communication Hub in minutes!

## 5-Minute Setup

### Step 1: Install Prerequisites (2 minutes)

Ensure you have Node.js 18+ and pnpm installed:

```bash
# Check if already installed
node --version
pnpm --version

# If not installed, visit nodejs.org and install Node.js
# Then install pnpm:
npm install -g pnpm
```

### Step 2: Extract and Install (2 minutes)

```bash
# Extract the zip file and navigate to the directory
cd communication-hub

# Install dependencies
pnpm install
```

### Step 3: Configure and Run (1 minute)

```bash
# Create environment file
echo "VITE_OPENAI_API_KEY=your_key_here" > .env

# Start the application
pnpm run dev
```

Open your browser to `http://localhost:3000` and you're ready to go!

## First-Time User Guide

### Navigating the Interface

The Communication Hub interface has three main sections:

**Left Sidebar**: Platform navigation, analytics preview, and task list
**Main Area**: Search bar, conversation list, and message display
**Right Sidebar**: Workflow actions, contact details, and shared files

### Connecting Platforms

The application currently uses mock data for demonstration. To connect real platforms:

1. Obtain API credentials from each platform
2. Configure them in the settings
3. Authorize the Communication Hub to access your accounts

### Using Key Features

**Sending Messages**: Click on a conversation, type your message, and press Enter or click the send button.

**Smart Replies**: Click on any suggested reply below the message area to use it instantly.

**Creating Tasks**: Right-click on any message and select "Convert to Task" to create an actionable item.

**Viewing Analytics**: Click the analytics section in the left sidebar to see communication insights.

**Workflow Automation**: Access Settings > Workflows to create automated responses and actions.

## Common Tasks

### Searching for Messages

Use the search bar at the top of the main area. You can filter by platform, date, or content type using the filter button.

### Managing Tasks

View all tasks in the left sidebar. Click on a task to edit it, or check the box to mark it complete.

### Customizing Settings

Access Settings from the menu to customize themes, notifications, and platform connections.

## Need More Help?

- **Full Installation Guide**: See [INSTALLATION.md](./INSTALLATION.md)
- **User Manual**: See [USER_GUIDE.md](./USER_GUIDE.md)
- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Support**: Email support@quickandeasytech.com

---

© 2025 Quick and Easy Tech. All rights reserved.
