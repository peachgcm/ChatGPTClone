import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: process.env.AI_BUILDER_API_BASE_URL || 'https://space.ai-builders.com/backend/v1',
  apiKey: process.env.AI_BUILDER_TOKEN,
})

export async function POST(req: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.AI_BUILDER_TOKEN) {
      console.error('AI_BUILDER_TOKEN is not set')
      return NextResponse.json(
        { 
          error: 'API configuration error',
          message: 'AI_BUILDER_TOKEN is not configured. Please check your .env.local file.'
        },
        { status: 500 }
      )
    }

    const { messages, model = 'grok-4-fast' } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Validate message format
    const validMessages = messages.filter((msg: any) => 
      msg && 
      typeof msg === 'object' && 
      msg.role && 
      msg.content &&
      (msg.role === 'user' || msg.role === 'assistant' || msg.role === 'system')
    )

    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: 'No valid messages found' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: model,
      messages: validMessages,
      temperature: 0.7,
      stream: false,
    })

    const content = completion.choices[0]?.message?.content || ''

    if (!content) {
      console.warn('Empty response from API', completion)
      return NextResponse.json(
        { 
          error: 'Empty response',
          message: 'The AI service returned an empty response. Please try again.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      content,
      model: completion.model,
      usage: completion.usage,
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    
    // Handle specific OpenAI API errors
    if (error.status === 401) {
      return NextResponse.json(
        { 
          error: 'Authentication failed',
          message: 'Invalid API token. Please check your AI_BUILDER_TOKEN in .env.local'
        },
        { status: 401 }
      )
    }
    
    if (error.status === 429) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please wait a moment and try again.'
        },
        { status: 429 }
      )
    }

    if (error.message?.includes('fetch failed') || error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { 
          error: 'Connection failed',
          message: 'Could not connect to the AI service. Please check your internet connection and try again.'
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        message: error.message || 'Unknown error occurred. Please try again.'
      },
      { status: 500 }
    )
  }
}
