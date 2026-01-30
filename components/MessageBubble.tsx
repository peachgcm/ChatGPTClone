'use client'

import { useState, useRef, useEffect } from 'react'
import { Message } from '@/types'
import { User, Bot, Edit2, Check, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MessageBubbleProps {
  message: Message
  onUpdate?: (messageId: string, newContent: string) => void
}

export default function MessageBubble({ message, onUpdate }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [isEditing])

  useEffect(() => {
    setEditContent(message.content)
  }, [message.content])

  const handleSave = () => {
    // Don't save if content is empty
    if (!editContent.trim()) {
      setIsEditing(false)
      return
    }
    // Save if content changed
    if (editContent !== message.content && onUpdate) {
      onUpdate(message.id, editContent)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditContent(message.content)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      // Command+Enter saves
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  if (isEditing && isUser && onUpdate) {
    return (
      <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-gray-600'
        }`}>
          {isUser ? (
            <User size={18} className="text-white" />
          ) : (
            <Bot size={18} className="text-white" />
          )}
        </div>
        <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
          <div className={`inline-block rounded-lg px-4 py-3 max-w-[85%] ${
            isUser 
              ? 'bg-blue-600 text-white' 
              : 'bg-message-user text-gray-100'
          }`}>
            <textarea
              ref={textareaRef}
              value={editContent}
              onChange={(e) => {
                setEditContent(e.target.value)
                if (textareaRef.current) {
                  textareaRef.current.style.height = 'auto'
                  textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
                }
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-white resize-none focus:outline-none whitespace-pre-wrap break-words"
              rows={1}
              style={{ minHeight: '1.5rem' }}
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button
                onClick={handleCancel}
                className="p-1 rounded hover:bg-black/20 transition-colors"
                title="Cancel (Esc)"
              >
                <X size={14} />
              </button>
              <button
                onClick={handleSave}
                className="p-1 rounded hover:bg-black/20 transition-colors"
                title="Save (⌘+Enter)"
              >
                <Check size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`group flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-600' : 'bg-gray-600'
      }`}>
        {isUser ? (
          <User size={18} className="text-white" />
        ) : (
          <Bot size={18} className="text-white" />
        )}
      </div>
      <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block rounded-lg px-4 py-3 max-w-[85%] relative ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-message-user text-gray-100'
        }`}>
          {isUser && onUpdate && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute -top-2 -right-2 p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Edit message"
            >
              <Edit2 size={12} className="text-gray-300" />
            </button>
          )}
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          ) : (
            <div className="break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Style code blocks
                  code: ({ node, inline, className, children, ...props }: any) => {
                    if (inline) {
                      return (
                        <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      )
                    }
                    return (
                      <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto my-2">
                        <code className={className || ''} {...props}>
                          {children}
                        </code>
                      </pre>
                    )
                  },
                  // Style links
                  a: ({ node, ...props }: any) => (
                    <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
                  ),
                  // Style lists
                  ul: ({ node, ...props }: any) => (
                    <ul className="list-disc list-inside my-2 space-y-1" {...props} />
                  ),
                  ol: ({ node, ...props }: any) => (
                    <ol className="list-decimal list-inside my-2 space-y-1" {...props} />
                  ),
                  // Style headings
                  h1: ({ node, ...props }: any) => (
                    <h1 className="text-xl font-bold mt-4 mb-2" {...props} />
                  ),
                  h2: ({ node, ...props }: any) => (
                    <h2 className="text-lg font-bold mt-3 mb-2" {...props} />
                  ),
                  h3: ({ node, ...props }: any) => (
                    <h3 className="text-base font-bold mt-2 mb-1" {...props} />
                  ),
                  // Style paragraphs
                  p: ({ node, ...props }: any) => (
                    <p className="my-2" {...props} />
                  ),
                  // Style blockquotes
                  blockquote: ({ node, ...props }: any) => (
                    <blockquote className="border-l-4 border-gray-600 pl-4 my-2 italic" {...props} />
                  ),
                  // Style tables
                  table: ({ node, ...props }: any) => (
                    <div className="overflow-x-auto my-2">
                      <table className="border-collapse border border-gray-600" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }: any) => (
                    <th className="border border-gray-600 px-2 py-1 bg-gray-800" {...props} />
                  ),
                  td: ({ node, ...props }: any) => (
                    <td className="border border-gray-600 px-2 py-1" {...props} />
                  ),
                  // Style horizontal rules
                  hr: ({ node, ...props }: any) => (
                    <hr className="border-gray-600 my-4" {...props} />
                  ),
                  // Style strong/bold text
                  strong: ({ node, ...props }: any) => (
                    <strong className="font-bold" {...props} />
                  ),
                  // Style emphasis/italic text
                  em: ({ node, ...props }: any) => (
                    <em className="italic" {...props} />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
