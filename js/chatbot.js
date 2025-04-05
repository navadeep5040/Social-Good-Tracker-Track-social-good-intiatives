// Chatbot Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-message');
const minimizeButton = document.querySelector('.minimize-btn');
const chatbotCard = document.querySelector('.chatbot-card');

// Chatbot State
let isMinimized = false;

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyCSGxQ5BbB5LhmT5bJmCVLEuUlexXwjiYQ'; // Replace with your actual API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Chatbot UI Functions
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'} fade-in`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Toggle chatbot visibility
function toggleChatbot() {
    isMinimized = !isMinimized;
    chatbotCard.classList.toggle('minimized');
    minimizeButton.innerHTML = isMinimized ? 
        '<i class="fas fa-plus"></i>' : 
        '<i class="fas fa-minus"></i>';
}

// Gemini API Functions
async function getGeminiResponse(prompt) {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a helpful AI assistant focused on social good initiatives. 
                               Please provide guidance and recommendations for: ${prompt}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error:', error);
        return 'I apologize, but I encountered an error. Please try again later.';
    }
}

// Event Listeners
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

minimizeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleChatbot();
});

chatbotCard.addEventListener('click', (e) => {
    if (isMinimized && !e.target.closest('.minimize-btn')) {
        toggleChatbot();
    }
});

async function handleUserInput() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, true);
    userInput.value = '';

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing fade-in';
    typingDiv.textContent = 'Typing...';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Get AI response
    const response = await getGeminiResponse(message);

    // Remove typing indicator and add AI response
    typingDiv.remove();
    addMessage(response);
}

// Initialize chatbot with welcome message
document.addEventListener('DOMContentLoaded', () => {
    addMessage('Hello! I\'m your AI assistant for social good initiatives. How can I help you today?');
});

// Add some CSS for the typing indicator
const style = document.createElement('style');
style.textContent = `
    .typing {
        opacity: 0.7;
        font-style: italic;
    }
    
    .fade-in {
        animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style); 