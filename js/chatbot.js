// Chatbot Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-message');
const minimizeButton = document.querySelector('.minimize-btn');
const chatbotCard = document.querySelector('.chatbot-card');

// Chatbot State
let isMinimized = false;

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyCSGxQ5BbB5LhmT5bJmCVLEuUlexXwjiYQ'; 
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Add welcome message on load
document.addEventListener('DOMContentLoaded', () => {
    addMessage("Hello! I'm your AI assistant for social good tracking. How can I help you today?");
});

// Add message to chat window
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

// Validate prompt for topic relevance
function isRelevantToSocialGoodTracking(prompt) {
    const keywords = [
        "social good", "impact", "tracking", "nonprofit", "sustainability",
        "donation", "volunteer", "climate", "charity", "community"
    ];
    return keywords.some(keyword => prompt.toLowerCase().includes(keyword));
}

// Sanitize Gemini output by removing stars
function cleanResponseText(text) {
    return text.replace(/\*\*/g, '').replace(/\*/g, '');
}

// Get AI response from Gemini API
async function getGeminiResponse(prompt) {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a helpful AI assistant focused on social good tracking. Please provide guidance for: ${prompt}`
                    }]
                }]
            })
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        let rawText = data.candidates[0].content.parts[0].text;
        let cleanedText = cleanResponseText(rawText);
        return cleanedText;
    } catch (error) {
        console.error('Error:', error);
        return 'I apologize, but I encountered an error. Please try again later.';
    }
}

// Handle user input
async function handleUserInput() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    userInput.value = '';

    // Check topic relevance
    if (!isRelevantToSocialGoodTracking(message)) {
        addMessage('Please ask a question related to social good tracking.');
        return;
    }

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing fade-in';
    typingDiv.textContent = 'Typing...';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const response = await getGeminiResponse(message);

    typingDiv.remove();
    addMessage(response);
}

// Event listeners
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
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

// Add typing CSS
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
