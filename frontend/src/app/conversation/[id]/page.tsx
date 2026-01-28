'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Message {
  role: 'user' | 'agent' | 'system'
  content: string
  emotional_state?: string
  type?: string
}

export default function ConversationPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState('neutral')
  const [showHint, setShowHint] = useState(false)
  const [hint, setHint] = useState('')
  
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(`ws://localhost:8000/api/conversations/ws/${conversationId}`)
    
    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    }
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'hint') {
        setHint(data.content)
        setShowHint(true)
      } else if (data.type === 'system') {
        // Handle system messages
        alert(data.content)
      } else {
        setMessages((prev) => [...prev, data])
        if (data.emotional_state) {
          setCurrentEmotion(data.emotional_state)
        }
      }
    }
    
    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    }
    
    wsRef.current = ws
    
    return () => {
      ws.close()
    }
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!inputMessage.trim() || !wsRef.current) return
    
    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
    }
    
    setMessages((prev) => [...prev, userMessage])
    
    wsRef.current.send(JSON.stringify({
      type: 'message',
      content: inputMessage,
    }))
    
    setInputMessage('')
  }

  const handleRedo = () => {
    if (!wsRef.current) return
    
    wsRef.current.send(JSON.stringify({
      type: 'redo',
    }))
    
    // Remove last 2 messages (user and agent)
    setMessages((prev) => prev.slice(0, -2))
  }

  const handleHint = () => {
    if (!wsRef.current) return
    
    wsRef.current.send(JSON.stringify({
      type: 'hint',
    }))
  }

  const handleEndConversation = () => {
    router.push(`/feedback/${conversationId}`)
  }

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      neutral: 'bg-gray-100 text-gray-800',
      denial: 'bg-yellow-100 text-yellow-800',
      anger: 'bg-red-100 text-red-800',
      bargaining: 'bg-blue-100 text-blue-800',
      sadness: 'bg-purple-100 text-purple-800',
      acceptance: 'bg-green-100 text-green-800',
    }
    return colors[emotion] || colors.neutral
  }

  const getEmotionEmoji = (emotion: string) => {
    const emojis: { [key: string]: string } = {
      neutral: '😐',
      denial: '🙅',
      anger: '😠',
      bargaining: '🤝',
      sadness: '😢',
      acceptance: '🕊️',
    }
    return emojis[emotion] || emojis.neutral
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Conversation Training</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">Current Emotion:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEmotionColor(currentEmotion)}`}>
                  {getEmotionEmoji(currentEmotion)} {currentEmotion}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleHint}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                💡 Get Hint
              </button>
              <button
                onClick={handleRedo}
                disabled={messages.length < 2}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⏮️ Redo
              </button>
              <button
                onClick={handleEndConversation}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                ✓ End & Get Feedback
              </button>
            </div>
          </div>
        </div>

        {/* Hint Banner */}
        {showHint && hint && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <span className="text-2xl mr-3">💡</span>
                <div>
                  <p className="text-sm font-semibold text-yellow-800">Coaching Hint</p>
                  <p className="text-sm text-yellow-700 mt-1">{hint}</p>
                </div>
              </div>
              <button
                onClick={() => setShowHint(false)}
                className="text-yellow-600 hover:text-yellow-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 overflow-y-auto mb-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.role === 'agent'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-yellow-50 text-yellow-900'
                  }`}
                >
                  <div className="text-xs font-semibold mb-1 opacity-75">
                    {message.role === 'user' ? 'You (Doctor)' : 'Family Member'}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.emotional_state && (
                    <div className="text-xs mt-2 opacity-75">
                      Emotion: {message.emotional_state}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your response as the doctor..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected || !inputMessage.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          {!isConnected && (
            <p className="text-sm text-red-600 mt-2">Disconnected from server...</p>
          )}
        </div>
      </div>
    </main>
  )
}
