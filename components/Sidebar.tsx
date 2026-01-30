'use client'

import { useState } from 'react'
import { Plus, MessageSquare, Trash2, X } from 'lucide-react'
import { Conversation } from '@/types'
import ModelSelector from './ModelSelector'

interface SidebarProps {
  conversations: Conversation[]
  activeConversationId: string | null
  onNewChat: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  selectedModel,
  onModelChange,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="w-64 bg-sidebar border-r border-border flex flex-col h-full">
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="m-2 p-3 rounded-lg border border-border hover:bg-message-user transition-colors flex items-center gap-2 text-sm"
      >
        <Plus size={16} />
        New Chat
      </button>

      {/* Model Selector */}
      <div className="px-2 mb-2">
        <ModelSelector selectedModel={selectedModel} onModelChange={onModelChange} />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-500 text-sm mt-8">
            No conversations yet. Start a new chat!
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                  activeConversationId === conversation.id
                    ? 'bg-message-user'
                    : 'hover:bg-message'
                }`}
                onMouseEnter={() => setHoveredId(conversation.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="flex-shrink-0 text-gray-400" />
                  <span className="text-sm truncate flex-1">
                    {conversation.title}
                  </span>
                  {hoveredId === conversation.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteConversation(conversation.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
