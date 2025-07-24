// services/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// A curated list of simple, everyday objects.
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
const EMOJI_REGEX = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|[\u00a9\u00ae\u2122\u2139\ufe0f]|[\ufe0f\u200d\u20e3])+$/;

async function getEmojiClue() {
    const MAX_ATTEMPTS = 3;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
            const randomWord = simpleWords[Math.floor(Math.random() * simpleWords.length)];
            const prompt = `Generate a short, creative sequence of 3-5 emojis to represent the word: "${randomWord}". Respond with ONLY the emoji string, no other text or explanation.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const emojiClue = response.text().trim();

            // More robust validation
            if (emojiClue && emojiClue.length < 20 && EMOJI_REGEX.test(emojiClue)) {
                console.log(`Success on attempt ${attempt}: Clue for "${randomWord}" is ${emojiClue}`);
                return { secretWord: randomWord, clue: emojiClue };
            }
            // If validation fails, it will loop to the next attempt
            console.warn(`Attempt ${attempt} failed validation. Clue received: "${emojiClue}"`);

        } catch (error) {
            console.error(`Error on attempt ${attempt} fetching from Gemini API:`, error.message);
        }
    }

    // Fallback if all attempts fail
    console.error("All API attempts failed. Using fallback.");
    return { secretWord: 'star', clue: '⭐' };
}

// Export simpleWords for the UI
module.exports = { getEmojiClue, simpleWords };