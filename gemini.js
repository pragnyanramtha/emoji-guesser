// services/gemini.js

// To re-enable the Gemini API:
// 1. Uncomment the lines marked with "API-UNCOMMENT".
// 2. In server.js, add 'async' back to startNewRound and 'await' back to the getEmojiClue() call.
// 3. Run `npm install @google/generative-ai dotenv` if you uninstalled them.

// const { GoogleGenerativeAI } = require('@google/generative-ai'); // API-UNCOMMENT
// require('dotenv').config(); // API-UNCOMMENT
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // API-UNCOMMENT

// --- Local Data ---
const simpleWords = [
  "lighthouse",
  "snow globe",
  "sundial",
  "light switch",
  "beehive",
  "greenhouse",
  "water bottle",
  "air conditioner",
  "sewing machine",
  "electric fan",
  "fire station",
  "recycling bin",
  "wastebasket"
];

const emojiClueMap = {
  "lighthouse": "💡🏠🌊",
  "snow globe": "❄️🔮✨",
  "sundial": "☀️🕰️🗿",
  "light switch": "💡🔛🔌",
  "beehive": "🐝🍯🏠",
  "greenhouse": "🌱🏠☀️",
  "water bottle": "💧🍾",
  "air conditioner": "❄️🌬️📦",
  "sewing machine": "🧵🪡👕",
  "electric fan": "🌬️⚡💨",
  "fire station": "🚒🔥🏢",
  "recycling bin": "♻️🗑️🥫",
  "wastebasket": "🗑️📄🍎"
};


// --- Function to get the clue ---

// By default, we use the local dictionary.
function getEmojiClue() {
    const randomWord = simpleWords[Math.floor(Math.random() * simpleWords.length)];
    const clue = emojiClueMap[randomWord];

    console.log(`Serving local clue for "${randomWord}": ${clue}`);
    return { secretWord: randomWord, clue: clue };
}


/*
// --- ALTERNATIVE: Gemini API implementation (Commented Out) ---
const EMOJI_REGEX = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|[\u00a9\u00ae\u2122\u2139\ufe0f]|[\ufe0f\u200d\u20e3])+$/;

async function getEmojiClue() {
    const MAX_ATTEMPTS = 3;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const randomWord = simpleWords[Math.floor(Math.random() * simpleWords.length)];
            const prompt = `Generate a short, creative sequence of 3-5 emojis to represent the word: "${randomWord}". Respond with ONLY the emoji string, no other text, punctuation, or explanation.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const emojiClue = response.text().trim();

            if (emojiClue && emojiClue.length < 20 && EMOJI_REGEX.test(emojiClue)) {
                console.log(`Success on attempt ${attempt}: Clue for "${randomWord}" is ${emojiClue}`);
                return { secretWord: randomWord, clue: emojiClue };
            }
            
            console.warn(`Attempt ${attempt} failed validation. Clue received: "${emojiClue}"`);

        } catch (error) {
            console.error(`Error on attempt ${attempt} fetching from Gemini API:`, error.message);
        }
    }

    // Fallback if all attempts fail
    console.error("All API attempts failed. Using fallback.");
    return { secretWord: 'star', clue: '⭐' };
}
*/

// Export both the function and the word list.
module.exports = { getEmojiClue, simpleWords };