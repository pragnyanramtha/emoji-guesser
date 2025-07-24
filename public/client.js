// public/client.js
document.addEventListener('DOMContentLoaded', () => {

    
    const socket = io(window.location.origin);


    // Views
    const landingPage = document.getElementById('landing-page');
    const gameView = document.getElementById('game-view');
    const gameOverView = document.getElementById('game-over-view');

    // Landing Page elements
    const landingForm = document.getElementById('landing-form');
    const usernameInput = document.getElementById('username-input');

    // Game elements
    const clueDisplay = document.getElementById('clue-display');
    const usersList = document.getElementById('users-list');
    const wordList = document.getElementById('word-list');
    const messagesContainer = document.getElementById('messages-container');
    const messages = document.getElementById('messages');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const typingIndicator = document.getElementById('typing-indicator');

    // Game Over elements
    const winnerAnnouncement = document.getElementById('winner-announcement');
    const playAgainButton = document.getElementById('play-again-button');

    let isTyping = false;

    // --- Main User Entry Flow ---
    landingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        if (username) {
            socket.emit('user:join', { username });
            // Transition from landing page to the game
            landingPage.classList.add('hidden');
            gameView.classList.remove('hidden');
            messageInput.focus();
        }
    });

    playAgainButton.addEventListener('click', () => {
        gameOverView.classList.add('hidden');
        gameView.classList.remove('hidden');
        messageInput.focus();
    });
    
    // --- Game Setup & Connection ---
    socket.on('connect', () => {
        socket.emit('client:get_word_list', (words) => {
            populateWordList(words);
        });
    });

    function populateWordList(words) {
        wordList.innerHTML = '';
        words.sort().forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            wordList.appendChild(li);
        });
    }

    // --- Chat & Typing Logic ---
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = messageInput.value.trim();
        if (msg) {
            socket.emit('chat:message', msg);
            messageInput.value = '';
            if (isTyping) {
                socket.emit('user:typing_stop');
                isTyping = false;
            }
        }
    });

    messageInput.addEventListener('input', () => {
        if (!isTyping) {
            socket.emit('user:typing_start');
            isTyping = true;
        }
    });

    messageInput.addEventListener('blur', () => {
        if (isTyping) {
            socket.emit('user:typing_stop');
            isTyping = false;
        }
    });

    // --- DOM Update Functions ---
    const addMessageToDOM = (html) => {
        messages.innerHTML += html;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    socket.on('chat:message', ({ user, text }) => {
        addMessageToDOM(`
            <div class="message-wrapper">
                <div class="user-avatar">${user.emojiAvatar}</div>
                <div class="message">
                    <div class="username">${user.username}</div>
                    <div class="text">${text}</div>
                </div>
            </div>
        `);
    });

    socket.on('system:message', (text) => {
        addMessageToDOM(`<div class="system-message">${text}</div>`);
    });

    // --- Game Flow Logic ---
    socket.on('game:new_round', ({ clue }) => {
        if (!gameOverView.classList.contains('hidden')) {
            gameOverView.classList.add('hidden');
            gameView.classList.remove('hidden');
        }
        clueDisplay.textContent = clue;
        messages.innerHTML = '';
    });

    socket.on('game:over', ({ winner, secretWord }) => {
        gameView.classList.add('hidden');
        winnerAnnouncement.innerHTML = `🥳 <span class="winner-name">${winner}</span> won! <br><small>The word was: "${secretWord}"</small>`;
        gameOverView.classList.remove('hidden');
    });

    // --- Dynamic User List Rendering (THE CORRECTED/RESTORED FUNCTION) ---
    socket.on('user:list_update', (users) => {
        const typingUsernames = [];
        usersList.innerHTML = ''; // Clear the list before re-rendering
        
        users.forEach(user => {
            // Use the typing emoji if it exists, otherwise use the default avatar
            const avatar = user.typingEmoji || user.emojiAvatar;
            
            const userElement = document.createElement('li');
            userElement.innerHTML = `<span class="user-avatar">${avatar}</span> ${user.username}`;
            usersList.appendChild(userElement);
            
            if (user.typingEmoji) {
                typingUsernames.push(user.username);
            }
        });

        // Update the "is typing..." text indicator
        if (typingUsernames.length === 0) {
            typingIndicator.textContent = '';
        } else if (typingUsernames.length === 1) {
            typingIndicator.textContent = `${typingUsernames[0]} is typing...`;
        } else {
            typingIndicator.textContent = 'Several people are typing...';
        }
    });
});

// In public/client.js

// ... (all code before this function remains the same) ...

socket.on('chat:message', ({ user, text, timestamp }) => {
    // Format the timestamp into a readable string like "11:45 AM"
    const time = new Date(timestamp).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit'
    });

    addMessageToDOM(`
        <div class="message-wrapper">
            <div class="user-avatar">${user.emojiAvatar}</div>
            <div class="message">
                <div class="username">${user.username}</div>
                <div class="text">
                    ${text}
                </div>
                <!-- The new timestamp element -->
                <span class="message-timestamp">${time}</span>
            </div>
        </div>
    `);
});

// ... (all code after this function remains the same) ...