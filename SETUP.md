# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
AI_BUILDER_TOKEN=sk_113c9059_00bdfce4fd872093b49b3649bb76f1d6d40f
AI_BUILDER_API_BASE_URL=https://space.ai-builders.com/backend/v1
```

**Important**: Replace the token above with your actual AI Builder token if needed.

## Step 3: Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### If you get "Module not found" errors:
- Make sure you've run `npm install`
- Delete `node_modules` and `.next` folders, then run `npm install` again

### If API calls fail:
- Check that your `.env.local` file exists and has the correct `AI_BUILDER_TOKEN`
- Verify the token is valid and has access to the models

### If styles don't load:
- Make sure Tailwind CSS is properly configured (check `tailwind.config.js`)
- Restart the dev server

## Available Models

You can change the model in `app/api/chat/route.ts` or add a model selector to the UI. Available models:

- `grok-4-fast` (default) - Fast Groq model
- `deepseek` - Fast and cost-effective
- `supermind-agent-v1` - Multi-tool agent with web search
- `gemini-2.5-pro` - Google Gemini
- `gemini-3-flash-preview` - Fast Gemini reasoning
- `gpt-5` - OpenAI-compatible
