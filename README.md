# Quick and Easy Tech Communication Hub

A cross-platform communication hub that unifies multiple messaging platforms (WhatsApp, Telegram, Slack, Discord, Teams) with a branded interface and advanced AI-powered features.

## Features

### Core Communication Features
- **Multi-Platform Integration**: Unified support for WhatsApp, Telegram, Slack, Discord, and Microsoft Teams
- **Real-Time Messaging**: Seamless message synchronization across all platforms
- **Advanced Search**: Powerful search functionality across all conversations and platforms
- **Smart Filtering**: Filter by platform, conversation type, read status, and more
- **Unified Inbox**: Single interface for all communication channels

### AI-Powered Features
- **Smart Reply Suggestions**: Context-aware reply recommendations using advanced NLP
- **Sentiment Analysis**: Real-time emotional tone analysis for messages and conversations
- **Conversation Trends**: Track sentiment changes over time for better relationship management
- **Automated Workflows**: Customizable triggers for automated responses and actions
- **Intelligent Categorization**: Automatic message classification and prioritization

### Analytics & Insights
- **Communication Dashboard**: Comprehensive analytics showing message volume, platform usage, and activity patterns
- **Performance Metrics**: Response time tracking, user engagement, and productivity insights
- **Sentiment Tracking**: Visual representation of conversation sentiment trends
- **Platform Comparison**: Detailed breakdown of usage across different communication platforms
- **Export Capabilities**: Data export for further analysis and reporting

### Task Management
- **Message-to-Task Conversion**: Transform any message into an actionable task with one click
- **Task Assignment**: Assign tasks to team members with due dates and priorities
- **Progress Tracking**: Monitor task completion and follow-up requirements
- **Source Linking**: Maintain connection between tasks and their originating conversations
- **Priority Management**: High, medium, and low priority classification with visual indicators

### Workflow Automation
- **Custom Triggers**: Set up automated actions based on keywords, senders, or platforms
- **Auto-Responses**: Intelligent out-of-office and meeting request handling
- **Notification Management**: Smart alerts for urgent messages and important communications
- **Rule-Based Actions**: Create complex automation rules for repetitive tasks
- **Workflow Analytics**: Track automation effectiveness and usage statistics

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher

### Installation
1. Clone the repository
```bash
git clone https://github.com/quickandeasytechco/communication-hub.git
cd communication-hub
```

2. Install dependencies
```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_API_BASE=https://api.openai.com/v1
```

4. Start the development server
```bash
pnpm run dev
```

5. Build for production
```bash
pnpm run build
```

## Project Structure

```
communication-hub/
├── src/
│   ├── components/          # React components
│   │   ├── AnalyticsDashboard.jsx
│   │   ├── ChatList.jsx
│   │   ├── EnhancedSidebar.jsx
│   │   ├── Logo.jsx
│   │   ├── MessageArea.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SentimentIndicator.jsx
│   │   ├── SmartReplyPanel.jsx
│   │   ├── TaskManager.jsx
│   │   └── WorkflowPanel.jsx
│   ├── hooks/               # Custom React hooks
│   │   └── useMockData.js
│   ├── lib/                 # Utility libraries
│   │   ├── aiService.js
│   │   ├── types.js
│   │   ├── utils.js
│   │   └── workflowService.js
│   ├── assets/              # Static assets
│   │   └── logo.png
│   ├── App.jsx              # Main application component
│   ├── App.css              # Global styles and branding
│   └── main.jsx             # Application entry point
├── dist/                    # Production build
├── public/                  # Public assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
└── vite.config.js           # Vite configuration
```

## Technologies Used

- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide Icons**: Consistent iconography throughout the application

## Branding

The application uses the Quick and Easy Tech branding:
- **Colors**: Black, Lime Green (#A6FF00), White, Grey, Electric Blue
- **Logo**: Lightning bolt design
- **Typography**: Modern, clean font family

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

© 2025 Quick and Easy Tech. All rights reserved.
