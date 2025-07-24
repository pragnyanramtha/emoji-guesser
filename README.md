# Emoji Guesser 🤔

A real-time, multiplayer emoji word puzzle game powered by Node.js, Socket.IO, and the Google Gemini AI.

**[➡️ Live Demo Link! ](https://emoji-guesser.onrender.com)**

---

## About The Project

Emoji Guesser is an interactive web game where players compete to guess a secret word based on a sequence of emojis. The twist? The emoji clues are generated on-the-fly by Google's Gemini AI, making every round a unique and creative challenge.

The application is built with a modern, sleek, and responsive dark-themed UI inspired by Vercel and X.com, featuring smooth transitions and a live-updating interface.

### Core Features

*   **Real-Time Gameplay:** Uses WebSockets (via Socket.IO) for instantaneous chat and game events.
*   **AI-Generated Clues:** Integrates with the Google Gemini API to dynamically create emoji clues for random words.
*   **Dynamic User Profiles:** Users are assigned random emoji avatars that change to unique "typing" emojis (`✍️`, `🤔`, `🏃‍♂️`) when they are active.
*   **Live User & Typing Indicators:** See who's online and who's currently typing a message.
*   **Flexible Answer Detection:** The game intelligently detects the correct answer even if it's part of a larger sentence.
*   **Modern, Responsive UI:** A sleek, animated landing page and a three-column game layout that looks great on all screen sizes.
*   **Word Bank:** A helpful list of possible words gives players a fighting chance.

---

## 🛠 Tech Stack

This project is built with a modern, full-stack JavaScript toolset.

*   **Backend:** Node.js, Express.js
*   **Real-Time Communication:** Socket.IO
*   **AI Integration:** Google Gemini API
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   **Deployment:** Render

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   **Node.js:** Make sure you have Node.js installed (v18.x or later is recommended). You can download it [here](https://nodejs.org/).
*   **Git:** You'll need Git to clone the repository.
*   **Google Gemini API Key:** You must have an API key from Google AI Studio. You can get one for free [here](https://aistudio.google.com/app/apikey).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/emoji-guesser.git
    cd emoji-guesser
    ```

2.  **Install NPM packages:**
    This will install all the required dependencies like Express and Socket.IO.
    ```bash
    npm install
    ```

3.  **Create your environment file:** optional (please uncomment a some code in gemini.js for functional api)
    Create a new file named `.env` in the root of your project directory. This file will hold your secret API key and is ignored by Git.
    ```
    # .env
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```
    Replace `"YOUR_API_KEY_HERE"` with your actual key from Google AI Studio.

4.  **Run the development server:**
    ```bash
    node server.js
    ```

5.  **Open the application:**
    Open your web browser and navigate to `http://localhost:3000`. The game should now be running locally!

---

## ☁️ Deployment

This application is ready to be deployed on modern cloud platforms. We recommend **Render** for its simplicity and generous free tier for Node.js applications.

1.  **Push your code to a GitHub repository.**
2.  **Create a new "Web Service"** on Render and connect your GitHub repository.
3.  **Use the following settings:**
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
4.  **Add your Environment Variable:**
    *   **Key:** `GEMINI_API_KEY`
    *   **Value:** `(Your secret API key)`
5.  **Deploy!** Render will automatically build and launch your application.


