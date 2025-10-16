document.addEventListener('DOMContentLoaded', function() {
    // Initialize the message chart
    initMessageChart();
    
    // Platform navigation functionality
    const platformNavItems = document.querySelectorAll('.platform-nav li');
    platformNavItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            platformNavItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Filter chat list based on selected platform
            const selectedPlatform = this.getAttribute('data-platform');
            filterChatsByPlatform(selectedPlatform);
        });
    });
    
    // Chat item selection functionality
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all chat items
            chatItems.forEach(chatItem => chatItem.classList.remove('active'));
            
            // Add active class to clicked chat item
            this.classList.add('active');
            
            // In a real app, this would load the conversation
            // For demo purposes, we'll just update the header
            updateMessageHeader(this);
        });
    });
    
    // Smart reply functionality
    const smartReplyButtons = document.querySelectorAll('.smart-reply-options button');
    smartReplyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const replyText = this.textContent;
            document.querySelector('.message-input input').value = replyText;
        });
    });
    
    // Send message functionality
    const sendButton = document.querySelector('.send-btn');
    const messageInput = document.querySelector('.message-input input');
    
    sendButton.addEventListener('click', function() {
        sendMessage();
    });
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Workflow buttons functionality
    const workflowButtons = document.querySelectorAll('.workflow-btn');
    workflowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            showNotification(`${action} action triggered`);
        });
    });
    
    // Task checkbox functionality
    const taskCheckboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskText = this.nextElementSibling.textContent;
            if (this.checked) {
                showNotification(`Task completed: ${taskText}`);
            }
        });
    });
});

// Initialize the message chart
function initMessageChart() {
    const ctx = document.getElementById('messageChart').getContext('2d');
    
    // Platform colors
    const platformColors = {
        whatsapp: '#25D366',
        telegram: '#0088cc',
        slack: '#4A154B',
        discord: '#5865F2',
        teams: '#6264A7'
    };
    
    // Sample data for the chart
    const messageChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['WhatsApp', 'Telegram', 'Slack', 'Discord', 'Teams'],
            datasets: [{
                label: 'Messages',
                data: [42, 28, 18, 12, 24],
                backgroundColor: [
                    platformColors.whatsapp,
                    platformColors.telegram,
                    platformColors.slack,
                    platformColors.discord,
                    platformColors.teams
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    });
}

// Filter chats by platform
function filterChatsByPlatform(platform) {
    const chatItems = document.querySelectorAll('.chat-item');
    
    chatItems.forEach(item => {
        const itemPlatform = item.getAttribute('data-platform');
        
        if (platform === 'all' || itemPlatform === platform) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show notification
    if (platform === 'all') {
        showNotification('Showing all messages');
    } else {
        showNotification(`Filtered to show ${platform} messages`);
    }
}

// Update message header when selecting a chat
function updateMessageHeader(chatItem) {
    const contactName = chatItem.querySelector('h3').textContent;
    const platformType = chatItem.getAttribute('data-platform');
    const avatarText = chatItem.querySelector('.chat-avatar span').textContent;
    
    // Update the message header
    document.querySelector('.contact-info h3').textContent = contactName;
    document.querySelector('.contact-info .chat-avatar span').textContent = avatarText;
    
    // Update platform indicator class
    const platformIndicator = document.querySelector('.contact-info .platform-indicator');
    platformIndicator.className = 'platform-indicator ' + platformType;
    
    // Update platform icon
    let iconClass = '';
    switch (platformType) {
        case 'whatsapp':
            iconClass = 'fab fa-whatsapp';
            break;
        case 'telegram':
            iconClass = 'fab fa-telegram';
            break;
        case 'slack':
            iconClass = 'fab fa-slack';
            break;
        case 'discord':
            iconClass = 'fab fa-discord';
            break;
        case 'teams':
            iconClass = 'fab fa-microsoft';
            break;
    }
    
    platformIndicator.innerHTML = `<i class="${iconClass}"></i>`;
    
    // In a real app, this would load the conversation
    showNotification(`Loaded conversation with ${contactName}`);
}

// Send message functionality
function sendMessage() {
    const messageInput = document.querySelector('.message-input input');
    const messageText = messageInput.value.trim();
    
    if (messageText) {
        // Create new message element
        const messagesContainer = document.querySelector('.messages-container');
        const newMessage = document.createElement('div');
        newMessage.className = 'message sent';
        
        // Get current time
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
        
        // Set message content
        newMessage.innerHTML = `
            <div class="message-content">
                <p>${messageText}</p>
                <span class="message-time">${formattedTime}</span>
            </div>
        `;
        
        // Add message to container
        messagesContainer.appendChild(newMessage);
        
        // Clear input
        messageInput.value = '';
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simulate response after a delay (for demo purposes)
        setTimeout(() => {
            simulateResponse();
        }, 2000);
    }
}

// Simulate response (for demo purposes)
function simulateResponse() {
    const messagesContainer = document.querySelector('.messages-container');
    const newMessage = document.createElement('div');
    newMessage.className = 'message received';
    
    // Get current time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
    
    // Sample responses
    const responses = [
        "That sounds good to me!",
        "I'll review this and get back to you soon.",
        "Thanks for the update. Let's discuss this in our next meeting.",
        "Perfect, I appreciate your quick response.",
        "Could you provide more details about this?"
    ];
    
    // Select random response
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Set message content
    newMessage.innerHTML = `
        <div class="message-content">
            <p>${randomResponse}</p>
            <span class="message-time">${formattedTime}</span>
        </div>
    `;
    
    // Add message to container
    messagesContainer.appendChild(newMessage);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Update sentiment (randomly for demo)
    updateSentiment();
    
    // Update smart replies
    updateSmartReplies();
}

// Update sentiment indicator (randomly for demo)
function updateSentiment() {
    const sentimentValue = document.querySelector('.sentiment-value');
    const sentiments = [
        { class: 'positive', icon: 'fa-smile', text: 'Positive' },
        { class: 'neutral', icon: 'fa-meh', text: 'Neutral' },
        { class: 'positive', icon: 'fa-smile', text: 'Positive' } // Weighted to show positive more often
    ];
    
    const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    sentimentValue.className = `sentiment-value ${randomSentiment.class}`;
    sentimentValue.innerHTML = `<i class="fas ${randomSentiment.icon}"></i> ${randomSentiment.text}`;
}

// Update smart replies based on conversation context
function updateSmartReplies() {
    const smartReplyOptions = document.querySelector('.smart-reply-options');
    
    // Sample smart replies
    const smartReplies = [
        [
            "I'll work on that right away.",
            "When do you need this completed?",
            "Let me know if you need anything else."
        ],
        [
            "Thanks for your feedback.",
            "I'll schedule a meeting to discuss this further.",
            "Would tomorrow work for a quick call?"
        ],
        [
            "I've attached the updated document.",
            "Let's review this together next week.",
            "I'll incorporate your suggestions."
        ]
    ];
    
    // Select random set of replies
    const randomReplies = smartReplies[Math.floor(Math.random() * smartReplies.length)];
    
    // Update smart reply buttons
    smartReplyOptions.innerHTML = '';
    randomReplies.forEach(reply => {
        const button = document.createElement('button');
        button.textContent = reply;
        button.addEventListener('click', function() {
            document.querySelector('.message-input input').value = reply;
        });
        smartReplyOptions.appendChild(button);
    });
}

// Show notification (for demo purposes)
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(166, 255, 0, 0.9)',
        color: '#000',
        padding: '10px 20px',
        borderRadius: '4px',
        zIndex: '1000',
        fontWeight: '500',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        transition: 'opacity 0.3s, transform 0.3s',
        opacity: '0',
        transform: 'translateY(10px)'
    });
    
    // Add to body
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
