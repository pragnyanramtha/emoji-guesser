// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { getEmojiClue, simpleWords } = require('./gemini.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));


let users = {};
let gameState = {
    secretWord: '',
    clue: '',
    roundInProgress: false,
};


const FACE_EMOJIS = ['😀', '😎', '🥳', '😊', '😂', '😇', '😍', '🤩', '🤓', '🤠'];
const TYPING_EMOJIS = ['✍️', '🤔', '🏃‍♂️', '🧐', '🤯', '💬', '👀'];
let availableTypingEmojis = [...TYPING_EMOJIS];


const startNewRound = async () => {
    console.log("Starting a new round...");
    gameState.roundInProgress = true;
    const { secretWord, clue } = await getEmojiClue();
    gameState.secretWord = secretWord;
    gameState.clue = clue;

    io.emit('game:new_round', { clue });
    io.emit('system:message', 'A new round has started! Guess the word from the emojis.');
};


io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    

    socket.on('client:get_word_list', (callback) => {
        callback(simpleWords);
    });

    socket.on('user:join', ({ username }) => {
        const emojiAvatar = FACE_EMOJIS[Math.floor(Math.random() * FACE_EMOJIS.length)];
        users[socket.id] = { id: socket.id, username, emojiAvatar };
        
        socket.broadcast.emit('system:message', `${username} has joined the game!`);
        io.emit('user:list_update', Object.values(users));
        
        if (!gameState.roundInProgress && Object.keys(users).length >= 1) {
            startNewRound();
        } else if (gameState.roundInProgress) {
            socket.emit('game:new_round', { clue: gameState.clue });
        }
    });

    socket.on('chat:message', (msg) => {
        const user = users[socket.id];
        if (!user || !gameState.roundInProgress) return;

        const sanitizedMsg = msg.trim().toLowerCase();
        const secretWord = gameState.secretWord.toLowerCase();

        if (sanitizedMsg.includes(secretWord)) {
            gameState.roundInProgress = false;
            io.emit('game:over', { winner: user.username, secretWord: gameState.secretWord });
            setTimeout(startNewRound, 10000);
        } else {
            io.emit('chat:message', { user, text: msg, timestamp: new Date() });
        }
    });
    
    socket.on('user:typing_start', () => {
        const user = users[socket.id];
        if (user && !user.typingEmoji) {
            if (availableTypingEmojis.length > 0) {
                user.typingEmoji = availableTypingEmojis.pop();
                io.emit('user:list_update', Object.values(users));
            }
        }
    });

    socket.on('user:typing_stop', () => {
        const user = users[socket.id];
        if (user && user.typingEmoji) {
            availableTypingEmojis.push(user.typingEmoji);
            delete user.typingEmoji;
            io.emit('user:list_update', Object.values(users));
        }
    });

    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            console.log(`User disconnected: ${user.username}`);
            if (user.typingEmoji) {
                availableTypingEmojis.push(user.typingEmoji);
            }
            delete users[socket.id];
            socket.broadcast.emit('system:message', `${user.username} has left the game.`);
            io.emit('user:list_update', Object.values(users));
        }
    });
});

server.listen(PORT, () => {
    console.log(`Emoji Guesser is running at http://localhost:${PORT}`);
});