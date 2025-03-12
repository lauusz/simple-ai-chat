# AI CHAT

AI CHAT is a simple chatbot application using a local AI model with Ollama. This project is built with Next.js, TypeScript, and Tailwind CSS, providing a clean and minimalistic UI for real-time chat interactions.

## Features

- 🔥 **Real-time chat** with a local AI model
- 🎨 **Simple UI** powered by Next.js and Tailwind CSS
- 🔄 **Easily switch AI models** by modifying `/api/chat/route.ts`
- ⚡ **Runs offline** with locally downloaded AI models

## Requirements

Before running this project, ensure you have the following installed:

1. **Ollama** – Download and install from [Ollama](https://ollama.ai/)
2. **AI Models** – Download your preferred AI models via Ollama (e.g., Qwen2.5)
3. **Node.js** – Install the latest LTS version from [Node.js](https://nodejs.org/)

## Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/lauusz/simple-ai-chat.git
cd ai-chat
npm install
```

## Usage

1. Ensure **Ollama** is running and the AI model is installed.
2. Start the Next.js development server:

```sh
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.
4. Start chatting with your local AI model! 🗨️

## Customization

To change the AI model used in the chatbot, update the model name in `/api/chat/route.ts` to match the model installed on your PC:

```ts
const model = "qwen:2.5"; // Change this to your preferred model
```

## Screenshot

![AI Chat Screenshot](https://github.com/user-attachments/assets/2364b382-9edd-49f5-8664-551859e0e158)

## Future Plans 🚀

- 💾 Save chat history
- 📂 Upload and process PDFs
- 🎙️ Implement voice-to-text functionality

## License

MIT License. Feel free to use and modify this project! 💡

