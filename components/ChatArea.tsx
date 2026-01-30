'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Message } from '@/types'
import MessageBubble from './MessageBubble'

interface ChatAreaProps {
  messages: Message[]
  onSendMessage: (message: Message) => void
  onUpdateMessage: (messageId: string, newContent: string) => void
  conversationId: string | null
  isLoading?: boolean
  setIsLoading?: (loading: boolean) => void
  selectedModel?: string
}

export default function ChatArea({
  messages,
  onSendMessage,
  onUpdateMessage,
  conversationId,
  isLoading: externalIsLoading,
  setIsLoading: setExternalIsLoading,
  selectedModel = 'grok-4-fast',
}: ChatAreaProps) {
  const [input, setInput] = useState('')
  const [internalIsLoading, setInternalIsLoading] = useState(false)
  
  // Use external loading state if provided, otherwise use internal
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading
  const setIsLoading = setExternalIsLoading || setInternalIsLoading
  const [isMac, setIsMac] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Detect platform on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(navigator.platform.toLowerCase().includes('mac'))
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Debug: Log messages when they change
  useEffect(() => {
    console.log('ChatArea messages updated:', messages.length, messages)
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input, // Keep multiline content, only trim for validation
      timestamp: new Date().toISOString(),
    }

    onSendMessage(userMessage)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.content && !data.message) {
        throw new Error('Empty response from server')
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || data.message || 'Sorry, I could not generate a response.',
        timestamp: new Date().toISOString(),
      }

      onSendMessage(assistantMessage)
    } catch (error: any) {
      console.error('Error:', error)
      let errorMessage = 'Sorry, there was an error processing your request. Please try again.'
      
      if (error.message) {
        errorMessage = error.message
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error: Could not connect to the server. Please check your connection.'
      }
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Error: ${errorMessage}`,
        timestamp: new Date().toISOString(),
      }
      onSendMessage(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Command+Enter (Mac) or Ctrl+Enter (Windows/Linux) creates new line
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      console.log('Command+Enter detected - inserting newline manually')
      e.preventDefault()
      e.stopPropagation()
      
      // Manually insert a newline at the cursor position
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = input
      const newText = text.substring(0, start) + '\n' + text.substring(end)
      
      console.log('Inserting newline at position', start, 'new text length:', newText.length)
      setInput(newText)
      
      // Set cursor position after the newline
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1
          // Auto-resize
          textareaRef.current.style.height = 'auto'
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
      }, 0)
      
      return
    }
    // Shift+Enter also creates new line (default browser behavior)
    if (e.key === 'Enter' && e.shiftKey) {
      // Allow default behavior (new line) - textarea handles this naturally
      // Don't prevent default or stop propagation
      return
    }
    // Enter submits (only if no modifiers)
    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault()
      e.stopPropagation()
      handleSubmit(e)
      return
    }
  }
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission is handled by handleSubmit when Enter is pressed
    // Command+Enter and Shift+Enter are handled in onKeyDown and should not reach here
    // This prevents any accidental form submissions
  }
  
  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Additional safeguard: prevent form submission on Command+Enter or Ctrl+Enter
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.stopPropagation()
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
              <p className="text-sm">Start a conversation by typing a message below.</p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => {
              if (!message || !message.id || !message.content) {
                console.warn('Invalid message:', message)
                return null
              }
              return (
                <MessageBubble 
                  key={message.id} 
                  message={message} 
                  onUpdate={onUpdateMessage}
                />
              )
            })}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-chat flex-shrink-0">
        <div className="max-w-3xl mx-auto p-4">
          <form onSubmit={handleFormSubmit} className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              placeholder="Message AI..."
              rows={1}
              className="w-full bg-input text-white rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32 overflow-y-auto"
              disabled={isLoading}
              style={{ minHeight: '44px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, {isMac ? '⌘' : 'Ctrl'}+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
