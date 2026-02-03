# This-Is-For - AI Chat Interface

A modern ChatGPT-like interface built with Next.js, featuring a two-column layout with conversation management and AI chat powered by the AI Builder API (using Groq's grok-4-fast model).

## Features

- 🎨 **ChatGPT-like UI**: Clean, modern two-column interface
- 💬 **Conversation Management**: Create, switch, and delete conversations
- 🤖 **AI Integration**: Powered by AI Builder API with Groq (grok-4-fast) model
- 💾 **Local Storage**: Conversations are saved locally in your browser
- 📱 **Responsive Design**: Beautiful dark theme with smooth interactions
- ⚡ **Real-time Chat**: Fast responses with loading indicators

## Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
AI_BUILDER_TOKEN=your_ai_builder_token_here
AI_BUILDER_API_BASE_URL=https://space.ai-builders.com/backend/v1
```

**Note**: The `AI_BUILDER_TOKEN` is required. You can get it from your AI Builder account.

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
this-is-for/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API route for chat completions
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page component
├── components/
│   ├── ChatArea.tsx              # Main chat interface
│   ├── MessageBubble.tsx         # Individual message component
│   └── Sidebar.tsx               # Conversation sidebar
├── types/
│   └── index.ts                 # TypeScript type definitions
└── package.json
```

## Usage

1. **Start a New Chat**: Click the "New Chat" button in the sidebar
2. **Send Messages**: Type your message in the input field and press Enter or click Send
3. **Switch Conversations**: Click on any conversation in the sidebar to switch
4. **Delete Conversations**: Hover over a conversation and click the trash icon

## API Configuration

The app uses the AI Builder API which supports multiple models:

- `grok-4-fast` (default) - Fast Groq model
- `deepseek` - Fast and cost-effective
- `supermind-agent-v1` - Multi-tool agent
- `gemini-2.5-pro` - Google Gemini
- `gemini-3-flash-preview` - Fast Gemini reasoning
- `gpt-5` - OpenAI-compatible

You can modify the model in `app/api/chat/route.ts` or add model selection to the UI.

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI SDK** - For API integration (OpenAI-compatible)
- **Lucide React** - Icons
- **AI Builder API** - Backend AI service

## Build for Production

```bash
npm run build
npm start
```

## Notes

- Conversations are stored in browser localStorage
- The API uses the AI Builder backend at `https://space.ai-builders.com/backend/v1`
- Make sure your `AI_BUILDER_TOKEN` is valid and has access to the models you want to use
