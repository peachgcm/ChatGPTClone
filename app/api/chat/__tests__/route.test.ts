import { POST } from '../route'
import { NextRequest } from 'next/server'

// Mock OpenAI
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{
              message: {
                content: 'Test response',
              },
            }],
            model: 'grok-4-fast',
            usage: {
              prompt_tokens: 10,
              completion_tokens: 5,
              total_tokens: 15,
            },
          }),
        },
      },
    })),
  }
})

describe('/api/chat', () => {
  beforeEach(() => {
    process.env.AI_BUILDER_TOKEN = 'test-token'
    process.env.AI_BUILDER_API_BASE_URL = 'https://test.api.com/v1'
  })

  afterEach(() => {
    delete process.env.AI_BUILDER_TOKEN
    delete process.env.AI_BUILDER_API_BASE_URL
  })

  it('returns error when AI_BUILDER_TOKEN is not set', async () => {
    delete process.env.AI_BUILDER_TOKEN
    
    const request = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('API configuration error')
  })

  it('returns error when messages array is empty', async () => {
    const request = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Messages array is required')
  })

  it('successfully processes valid chat request', async () => {
    const request = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'grok-4-fast',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.content).toBe('Test response')
    expect(data.model).toBe('grok-4-fast')
  })
})
