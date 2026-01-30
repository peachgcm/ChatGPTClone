'use client'

import { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatArea from '@/components/ChatArea'
import ModelSelector from '@/components/ModelSelector'
import { Conversation, Message } from '@/types'

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>('grok-4-fast')

  // Set mounted flag to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load conversations and model from localStorage on mount (client-side only)
  useEffect(() => {
    if (!isMounted) return
    
    try {
      // Load selected model
      const savedModel = localStorage.getItem('selectedModel')
      if (savedModel) {
        setSelectedModel(savedModel)
      }

      const savedConversations = localStorage.getItem('conversations')
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Validate conversation structure
          const validConversations = parsed.filter((conv: any) => 
            conv && 
            typeof conv === 'object' && 
            conv.id && 
            conv.title && 
            Array.isArray(conv.messages)
          )
          
          if (validConversations.length > 0) {
            setConversations(validConversations)
            setActiveConversationId(validConversations[0].id)
            setMessages(validConversations[0].messages || [])
          } else {
            console.warn('No valid conversations found in localStorage')
          }
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      // Clear corrupted data
      try {
        localStorage.removeItem('conversations')
      } catch (e) {
        // Ignore
      }
    }
  }, [isMounted])

  // Save conversations to localStorage whenever they change (client-side only)
  useEffect(() => {
    if (!isMounted) return
    
    try {
      localStorage.setItem('conversations', JSON.stringify(conversations))
    } catch (error) {
      console.error('Error saving conversations to localStorage:', error)
    }
  }, [conversations, isMounted])

  // Save selected model to localStorage
  useEffect(() => {
    if (!isMounted) return
    
    try {
      localStorage.setItem('selectedModel', selectedModel)
    } catch (error) {
      console.error('Error saving model to localStorage:', error)
    }
  }, [selectedModel, isMounted])

  // Update messages only when switching to a different conversation
  // This prevents overwriting messages that were just added to the current conversation
  const prevActiveConversationId = useRef<string | null>(null)
  
  useEffect(() => {
    if (!isMounted) return
    
    // Only update messages if we switched to a different conversation
    if (prevActiveConversationId.current !== activeConversationId) {
      prevActiveConversationId.current = activeConversationId
      
      if (activeConversationId) {
        const conversation = conversations.find(c => c.id === activeConversationId)
        if (conversation) {
          setMessages(conversation.messages || [])
        } else {
          setMessages([])
        }
      } else {
        setMessages([])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId, isMounted])

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    }
    setConversations([newConversation, ...conversations])
    setActiveConversationId(newConversation.id)
    setMessages([])
  }

  const deleteConversation = (id: string) => {
    const updated = conversations.filter(c => c.id !== id)
    setConversations(updated)
    if (activeConversationId === id) {
      if (updated.length > 0) {
        setActiveConversationId(updated[0].id)
      } else {
        setActiveConversationId(null)
        setMessages([])
      }
    }
  }

  // Helper function to get first line of content
  const getFirstLine = (content: string): string => {
    const firstLine = content.split('\n')[0].trim()
    return firstLine.substring(0, 50) || 'New Chat'
  }

  const addMessage = (message: Message) => {
    console.log('addMessage called:', message)
    
    if (!activeConversationId) {
      // Create a new conversation with the first message
      const newId = Date.now().toString()
      const newConversation: Conversation = {
        id: newId,
        title: message.role === 'user' 
          ? getFirstLine(message.content)
          : 'New Chat',
        messages: [message],
        createdAt: new Date().toISOString(),
      }
      console.log('Creating new conversation:', newConversation)
      setConversations([newConversation, ...conversations])
      setActiveConversationId(newId)
      setMessages([message])
      return
    }

    // Use functional updates to ensure we have the latest state
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, message]
      console.log('Updating messages:', updatedMessages.length, updatedMessages)
      
      // Update conversations with the new message
      setConversations(prevConversations => 
        prevConversations.map(c => {
          if (c.id === activeConversationId) {
            const updated = { ...c, messages: updatedMessages }
            // Update title from first line of first user message if it's still "New Chat"
            if (c.title === 'New Chat' && message.role === 'user') {
              updated.title = getFirstLine(message.content)
            }
            return updated
          }
          return c
        })
      )
      
      return updatedMessages
    })
  }

  const updateMessage = async (messageId: string, newContent: string) => {
    // Find the index of the message being edited
    const messageIndex = messages.findIndex(m => m.id === messageId)
    if (messageIndex === -1) return

    const editedMessage = messages[messageIndex]
    
    // If it's a user message, remove all messages after it and regenerate AI response
    if (editedMessage.role === 'user') {
      // Keep messages up to and including the edited one
      const messagesUpToEdit = messages.slice(0, messageIndex + 1).map(m => 
        m.id === messageId ? { ...m, content: newContent } : m
      )
      
      setMessages(messagesUpToEdit)
      
      // Update conversations
      setConversations(conversations.map(c => {
        if (c.id === activeConversationId) {
          return { ...c, messages: messagesUpToEdit }
        }
        return c
      }))

      // Regenerate AI response
      try {
        setIsLoading(true)
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messagesUpToEdit.map(m => ({
              role: m.role,
              content: m.content,
            })),
            model: selectedModel,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`)
        }

        const data = await response.json()
        
        if (data.content || data.message) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.content || data.message,
            timestamp: new Date().toISOString(),
          }
          addMessage(assistantMessage)
        }
      } catch (error: any) {
        console.error('Error regenerating response:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `❌ Error: ${error.message || 'Failed to regenerate response. Please try again.'}`,
          timestamp: new Date().toISOString(),
        }
        addMessage(errorMessage)
      } finally {
        setIsLoading(false)
      }
    } else {
      // For assistant messages, just update the content
      const updatedMessages = messages.map(m => 
        m.id === messageId ? { ...m, content: newContent } : m
      )
      setMessages(updatedMessages)
      
      setConversations(conversations.map(c => {
        if (c.id === activeConversationId) {
          return { ...c, messages: updatedMessages }
        }
        return c
      }))
    }
  }

  const selectConversation = (id: string) => {
    setActiveConversationId(id)
  }

  return (
    <div className="flex h-screen bg-chat overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={createNewConversation}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
      <ChatArea
        messages={messages}
        onSendMessage={addMessage}
        onUpdateMessage={updateMessage}
        conversationId={activeConversationId}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        selectedModel={selectedModel}
      />
    </div>
  )
}
