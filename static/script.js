// Chat state
let currentChatId = null;
let chats = JSON.parse(localStorage.getItem('chats') || '[]');

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const chatForm = document.getElementById('chatForm');
const sendBtn = document.getElementById('sendBtn');
const thinkingIndicator = document.getElementById('thinkingIndicator');
const chatHistory = document.getElementById('chatHistory');
const newChatBtn = document.getElementById('newChatBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderChatHistory();
    if (chats.length > 0) {
        loadChat(chats[0].id);
    }
    
    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    });
    
    // Handle keyboard shortcuts
    messageInput.addEventListener('keydown', (e) => {
        // Enter (without Shift) = Submit
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // Create a synthetic submit event
            const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
            chatForm.dispatchEvent(submitEvent);
        }
        // Shift+Enter = New line (default behavior, no need to prevent)
    });
    
    // Handle form submission
    chatForm.addEventListener('submit', handleSubmit);
    
    // Handle new chat button
    newChatBtn.addEventListener('click', startNewChat);
});

function startNewChat() {
    currentChatId = null;
    chatMessages.innerHTML = `
        <div class="welcome-message">
            <h2>Welcome!</h2>
            <p>Start a conversation by typing a message below.</p>
            <p>I can search the web and read web pages to help answer your questions.</p>
        </div>
    `;
    renderChatHistory();
}

function renderChatHistory() {
    chatHistory.innerHTML = '';
    chats.forEach(chat => {
        const item = document.createElement('div');
        item.className = `chat-history-item ${chat.id === currentChatId ? 'active' : ''}`;
        item.innerHTML = `
            <div class="chat-history-item-title">${chat.title || 'New Chat'}</div>
            <div class="chat-history-item-preview">${chat.preview || 'No messages yet'}</div>
        `;
        item.addEventListener('click', () => loadChat(chat.id));
        chatHistory.appendChild(item);
    });
}

function loadChat(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    
    currentChatId = chatId;
    chatMessages.innerHTML = '';
    
    chat.messages.forEach(msg => {
        addMessageToUI(msg.role, msg.content, false);
    });
    
    renderChatHistory();
    scrollToBottom();
}

function handleSubmit(e) {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Add user message to UI
    addMessageToUI('user', message);
    
    // Create or update chat
    if (!currentChatId) {
        currentChatId = Date.now().toString();
        chats.push({
            id: currentChatId,
            title: message.substring(0, 50),
            preview: message.substring(0, 100),
            messages: []
        });
    }
    
    // Save user message
    const chat = chats.find(c => c.id === currentChatId);
    chat.messages.push({ role: 'user', content: message });
    chat.preview = message.substring(0, 100);
    saveChats();
    renderChatHistory();
    
    // Show thinking indicator
    showThinking();
    
    // Disable input
    sendBtn.disabled = true;
    messageInput.disabled = true;
    
    // Send to API
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_message: message })
    })
    .then(response => response.json())
    .then(data => {
        hideThinking();
        
        // Add assistant message to UI
        const assistantMessage = data.message || 'No response received';
        addMessageToUI('assistant', assistantMessage);
        
        // Save assistant message
        chat.messages.push({ role: 'assistant', content: assistantMessage });
        chat.preview = assistantMessage.substring(0, 100);
        saveChats();
        renderChatHistory();
    })
    .catch(error => {
        hideThinking();
        console.error('Error:', error);
        addMessageToUI('assistant', 'Sorry, I encountered an error. Please try again.');
    })
    .finally(() => {
        // Re-enable input
        sendBtn.disabled = false;
        messageInput.disabled = false;
        messageInput.focus();
    });
}

function addMessageToUI(role, content, animate = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = content;
    
    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString();
    
    messageDiv.appendChild(bubble);
    messageDiv.appendChild(time);
    
    if (animate) {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
    }
    
    // Remove welcome message if present
    const welcomeMsg = chatMessages.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    chatMessages.appendChild(messageDiv);
    
    if (animate) {
        setTimeout(() => {
            messageDiv.style.transition = 'opacity 0.3s, transform 0.3s';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }
    
    scrollToBottom();
}

function showThinking() {
    thinkingIndicator.style.display = 'flex';
    scrollToBottom();
}

function hideThinking() {
    thinkingIndicator.style.display = 'none';
}

function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

function saveChats() {
    localStorage.setItem('chats', JSON.stringify(chats));
}
