'use client'

import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export interface Model {
  id: string
  name: string
  description: string
}

const AVAILABLE_MODELS: Model[] = [
  {
    id: 'grok-4-fast',
    name: 'Grok-4 Fast',
    description: 'Fast Groq model',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'Fast and cost-effective',
  },
  {
    id: 'supermind-agent-v1',
    name: 'Supermind Agent',
    description: 'Multi-tool agent with web search',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Google Gemini',
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash',
    description: 'Fast Gemini reasoning',
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    description: 'OpenAI-compatible',
  },
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedModelData = AVAILABLE_MODELS.find(m => m.id === selectedModel) || AVAILABLE_MODELS[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-message hover:bg-message-user transition-colors flex items-center justify-between"
        title="Select AI model"
      >
        <div className="flex flex-col items-start">
          <span className="font-medium">{selectedModelData.name}</span>
          <span className="text-xs text-gray-400">{selectedModelData.description}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-sidebar border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {AVAILABLE_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelChange(model.id)
                setIsOpen(false)
              }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-message transition-colors ${
                selectedModel === model.id ? 'bg-message-user' : ''
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-gray-400">{model.description}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
