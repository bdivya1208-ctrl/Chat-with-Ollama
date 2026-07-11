# Chat with Ollama 🤖

A modern AI chat application that interacts with a locally running Ollama model. The application supports multi-turn conversations, message history, loading indicators, model selection, and clearing chat history.

## Features

- 💬 Chat with a local Ollama model
- 📝 Conversation history
- 💾 Chat history saved using LocalStorage
- ⏳ Loading indicator while AI generates responses
- 🗑️ Clear chat functionality
- ➕ New Chat button
- 🤖 Model selection
- 📱 Responsive user interface
- ⌨️ Press Enter to send messages (Shift + Enter for a new line)

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Ollama REST API
- LocalStorage
- Font Awesome
- Google Fonts (Inter)

---

## Prerequisites

Before running the project, install Ollama.

Download:

https://ollama.com/download

Install a model:

```bash
ollama pull llama3
```

Start the Ollama server:

```bash
ollama serve
```

---

## Running the Project

1. Clone the repository.

```bash
git clone https://github.com/YOUR_USERNAME/Chat-with-Ollama.git
```

2. Open the project folder.

3. Launch the project using VS Code Live Server or any local web server.

4. Open the application in your browser.

5. Make sure Ollama is running before sending messages.

---

## Project Structure

```
Chat-with-Ollama/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## Notes

This application communicates with a locally running Ollama server using:

```
http://127.0.0.1:11434/api/chat
```

Because Ollama runs locally, the AI chat functionality only works when the application is opened on your own computer with Ollama running.

The GitHub Pages deployment demonstrates the user interface only and cannot communicate with a local Ollama server.

---

## Demo

A demo video is included with the project submission.

---

## Author

Developed by **YOUR NAME**
