import { render, screen } from '@testing-library/react'
import MessageBubble from '../MessageBubble'
import { Message } from '@/types'

describe('MessageBubble', () => {
  const mockUserMessage: Message = {
    id: '1',
    role: 'user',
    content: 'Hello, AI!',
    timestamp: new Date().toISOString(),
  }

  const mockAssistantMessage: Message = {
    id: '2',
    role: 'assistant',
    content: 'Hello! How can I help you?',
    timestamp: new Date().toISOString(),
  }

  it('renders user message correctly', () => {
    render(<MessageBubble message={mockUserMessage} />)
    expect(screen.getByText('Hello, AI!')).toBeInTheDocument()
  })

  it('renders assistant message correctly', () => {
    render(<MessageBubble message={mockAssistantMessage} />)
    expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument()
  })

  it('shows edit button for user messages when onUpdate is provided', () => {
    const mockUpdate = jest.fn()
    render(<MessageBubble message={mockUserMessage} onUpdate={mockUpdate} />)
    
    // Edit button should be present (may need to hover)
    const editButton = screen.queryByTitle('Edit message')
    expect(editButton).toBeInTheDocument()
  })

  it('does not show edit button for assistant messages', () => {
    const mockUpdate = jest.fn()
    render(<MessageBubble message={mockAssistantMessage} onUpdate={mockUpdate} />)
    
    const editButton = screen.queryByTitle('Edit message')
    expect(editButton).not.toBeInTheDocument()
  })
})
