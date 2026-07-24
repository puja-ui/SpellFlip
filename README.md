# SpellFlip
**Toss the coin, learn your fate 🪙🔮**

A medieval-themed, AI-powered coin toss application that dynamically generates poetic prophecies based on your gameplay using the Gemini API.

**[🚀 Try it live here!](https://spell-flip.vercel.app/)**

https://github.com/user-attachments/assets/4d3d9970-e5a1-414a-8521-5396bb3761e7

## The problem this solves
Sometimes you need to make a tough decision—like whether to "Journey to the East" or "Defend the Castle". A standard coin flip gives you a binary answer, but it lacks flair. SpellFlip turns a simple coin toss into an immersive, atmospheric experience. By feeding the outcome of your tosses into a generative AI model, it acts as a digital seer, providing customized, narrative-driven prophecies that make your decisions feel legendary.

## Architecture
```text
User Input (Labels & Tosses)
      ↓
Frontend (Vanilla JS / CSS Animations)
(Simulates the coin toss and tracks scores)
      ↓
Backend API — Python Serverless Function
(Builds the prompt based on the final score)
      ↓
Gemini AI
(Generates a medieval, Instagram-worthy prophecy)
      ↓
The Magician's Note
```

## Why this tech stack?
Using **Vanilla HTML/CSS/JS** for the frontend keeps the application incredibly lightweight and blazing fast, without the overhead of heavy frameworks like React. The coin flip parallax animations (snowfall, layered backgrounds) run smoothly purely through CSS. 

For the backend, **Python** was chosen for its unparalleled simplicity and native support on **Vercel Serverless Functions**. It securely hides the Gemini API key from the browser while efficiently formatting dynamic prompts using only the Python standard library.

## Features & Gameplay

| Feature | Description |
|---|---|
| **Custom Stakes** | You define what "Heads" and "Tails" represent (e.g., *Buy Pizza* vs *Cook at Home*). |
| **Best-of-N** | Choose how many times you want to toss (must be an odd number, as favored by the fates). |
| **Immersive UI** | Realistic coin flip animations, layered snowfall, and dark fantasy aesthetics. |
| **AI Prophecies** | The outcome is interpreted by a "medieval magician", giving you a highly contextual, poetic reading of your fate. |

## Models
| Role | Model | Provider | Why |
|---|---|---|---|
| **The Magician** | `gemini-3.1-flash-lite` | Google AI | Incredibly fast, reliable, and capable of generating rich, poetic prose with very low latency. |

## Stack
- **Frontend**: Vanilla JS, HTML, CSS
- **Backend**: Python 3 (Standard Library only)
- **Deployment**: Vercel (Static hosting + Python Serverless Functions)
- **AI API**: Google Gemini

## Project structure
```text
SpellFlip/
├── api/
│   ├── generate.py       # Vercel Serverless Function endpoint
│   ├── _utils.py         # Python helper logic and API wrapper
│   └── prompt.txt        # The AI prompt template
├── public/
│   ├── index.html        # Game UI
│   ├── script.js         # Frontend game logic
│   ├── style.css         # Animations and styling
│   └── assets/           # Media files (coin, dragon, castle)
├── .env                  # Secret API keys (gitignored)
├── requirements.txt      # Empty (Signals Python runtime to Vercel)
├── server.py             # Script for local development hosting
└── vercel.json           # Vercel routing rules
```

## Setup

### Prerequisites
- Python 3.10+
- A free Google Gemini API key — [Google AI Studio](https://aistudio.google.com/)

### Installation
```bash
git clone https://github.com/puja-ui/SpellFlip.git
cd SpellFlip
```

### Environment variables
Create a `.env` file in the root directory and add your Gemini key:
```env
GEMINI_API_KEY=your_gemini_key_here
```

### Run Locally
Start the built-in Python web server:
```bash
python3 server.py
```
Open your browser and navigate to `http://localhost:8000`.

## Modifying the Prophecy
The personality and rules of the Magician are defined in `api/prompt.txt`. You can easily tweak this file to change the tone of the output (e.g., from a medieval seer to a futuristic AI, or a sarcastic goblin) without touching any code.

## Deployment Pipeline (Vercel)
This project is pre-configured to be deployed on Vercel with zero configuration.
1. Push the code to a GitHub repository.
2. Import the repository into Vercel.
3. Add `GEMINI_API_KEY` to the Environment Variables in the Vercel dashboard.
4. Deploy! 

Vercel will automatically serve the `/public` folder as static files and convert `api/generate.py` into a Serverless Function.

## Key design decisions

**Why no external dependencies?** 
The Python backend intentionally uses `urllib.request` instead of `requests` or the official Google SDK. This keeps the project extremely lightweight, ensures instant cold-starts on Vercel, and requires zero `pip install` steps for new developers.

**Why is the backend separated?**
The game logic runs entirely in the browser (JS) for zero-latency coin flipping. The backend is *only* called at the very end. This protects the secret API key while ensuring the game feels incredibly responsive.

## What's next
- **Sound Effects**: Add medieval atmospheric music and coin-clinking sound effects.
- **Save History**: Use `localStorage` to keep a grimoire of past prophecies.
- **Multiple Coins**: Introduce different coin types (gold, silver, cursed) that subtly alter the Magician's prompt.
