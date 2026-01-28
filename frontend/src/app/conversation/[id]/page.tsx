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
  
  // Audio-related state
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const [audioMode, setAudioMode] = useState(true)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/api/conversations/ws/${conversationId}`)
    
    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    }
    
    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'hint') {
        setHint(data.content)
        setShowHint(true)
      } else if (data.type === 'system') {
        alert(data.content)
      } else {
        setMessages((prev) => [...prev, data])
        if (data.emotional_state) {
          setCurrentEmotion(data.emotional_state)
        }
        
        if (data.role === 'agent' && audioMode && data.content) {
          await playAgentResponse(data.content, data.emotional_state || 'neutral')
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
  }, [conversationId, audioMode])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.onended = () => setIsPlayingAudio(false)
    
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage
    if (!textToSend.trim() || !wsRef.current) return
    
    const userMessage: Message = {
      role: 'user',
      content: textToSend,
    }
    
    setMessages((prev) => [...prev, userMessage])
    
    wsRef.current.send(JSON.stringify({
      type: 'message',
      content: textToSend,
    }))
    
    setInputMessage('')
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      })
      
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await processAudioRecording(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Failed to start recording:', error)
      alert('Microphone access denied. Please allow microphone access to use voice input.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processAudioRecording = async (audioBlob: Blob) => {
    setIsProcessingAudio(true)
    
    try {
      const formData = new FormData()
      formData.append('audio_file', audioBlob, 'recording.webm')
      
      const response = await fetch('http://localhost:8000/api/audio/speech-to-text', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) throw new Error('Transcription failed')
      
      const data = await response.json()
      await sendMessage(data.text)
    } catch (error) {
      console.error('Audio processing failed:', error)
      alert('Failed to process audio. Please try again.')
    } finally {
      setIsProcessingAudio(false)
    }
  }

  const playAgentResponse = async (text: string, emotion: string) => {
    try {
      setIsPlayingAudio(true)
      
      const response = await fetch('http://localhost:8000/api/audio/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, emotion }),
      })
      
      if (!response.ok) throw new Error('TTS failed')
      
      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        await audioRef.current.play()
      }
    } catch (error) {
      console.error('Audio playback failed:', error)
      setIsPlayingAudio(false)
    }
  }

  const handleRedo = () => {
    if (!wsRef.current) return
    
    wsRef.current.send(JSON.stringify({
      type: 'redo',
    }))
    
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

  const getEmotionConfig = (emotion: string) => {
    const configs: { [key: string]: { color: string; label: string; icon: JSX.Element } } = {
      neutral: {
        color: 'bg-slate-100 text-slate-700 border-slate-300',
        label: 'Neutral',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      denial: {
        color: 'bg-amber-100 text-amber-700 border-amber-300',
        label: 'Denial',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        )
      },
      anger: {
        color: 'bg-red-100 text-red-700 border-red-300',
        label: 'Anger',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      },
      bargaining: {
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        label: 'Bargaining',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        )
      },
      sadness: {
        color: 'bg-purple-100 text-purple-700 border-purple-300',
        label: 'Sadness',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      acceptance: {
        color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        label: 'Acceptance',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
    }
    return configs[emotion] || configs.neutral
  }

  const emotionConfig = getEmotionConfig(currentEmotion)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 flex-shrink-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Conversation Training</h1>
                  <p className="text-xs text-slate-500">Live Session</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600 font-medium">Emotional State:</span>
                <span className={`badge ${emotionConfig.color} border`}>
                  {emotionConfig.icon}
                  <span className="ml-1">{emotionConfig.label}</span>
                </span>
                {isPlayingAudio && (
                  <span className="badge bg-sky-100 text-sky-700 border-sky-300 animate-pulse">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-1">Playing</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAudioMode(!audioMode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  audioMode
                    ? 'bg-sky-500 text-white hover:bg-sky-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
                title={audioMode ? 'Audio mode ON' : 'Audio mode OFF'}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span>{audioMode ? 'Audio' : 'Text'}</span>
              </button>
              
              <button
                onClick={handleHint}
                className="btn-secondary flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Hint</span>
              </button>
              
              <button
                onClick={handleRedo}
                disabled={messages.length < 2}
                className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
                <span>Redo</span>
              </button>
              
              <button
                onClick={handleEndConversation}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span>End Session</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hint Banner */}
      {showHint && hint && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
          <div className="container mx-auto flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 mb-1">Coaching Suggestion</p>
                <p className="text-sm text-amber-800">{hint}</p>
              </div>
            </div>
            <button
              onClick={() => setShowHint(false)}
              className="text-amber-600 hover:text-amber-800 ml-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-6 py-6 h-full">
          <div className="card h-full p-6 overflow-y-auto">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-xl p-4 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-sky-500 text-white'
                        : message.role === 'agent'
                        ? 'bg-white border border-slate-200'
                        : 'bg-amber-50 border border-amber-200'
                    }`}
                  >
                    <div className={`text-xs font-semibold mb-2 ${
                      message.role === 'user' ? 'text-sky-100' : 'text-slate-500'
                    }`}>
                      {message.role === 'user' ? 'You (Doctor)' : 'Family Member'}
                    </div>
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                      message.role === 'user' ? 'text-white' : 'text-slate-800'
                    }`}>
                      {message.content}
                    </p>
                    {message.emotional_state && message.role === 'agent' && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <span className={`badge ${getEmotionConfig(message.emotional_state).color} border text-xs`}>
                          {getEmotionConfig(message.emotional_state).icon}
                          <span className="ml-1">{getEmotionConfig(message.emotional_state).label}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 flex-shrink-0">
        <div className="container mx-auto px-6 py-4">
          {audioMode ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center space-y-3">
                {!isRecording && !isProcessingAudio && (
                  <button
                    onClick={startRecording}
                    disabled={!isConnected}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-4 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg">Press to Record</span>
                  </button>
                )}
                
                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="bg-red-600 text-white font-medium px-8 py-4 rounded-full animate-pulse flex items-center space-x-3 shadow-lg"
                  >
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span className="text-lg">Recording... Click to Stop</span>
                  </button>
                )}
                
                {isProcessingAudio && (
                  <div className="flex items-center space-x-3 text-slate-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500"></div>
                    <span className="font-medium">Processing your response...</span>
                  </div>
                )}
                
                <p className="text-sm text-slate-500">
                  {!isRecording && !isProcessingAudio && 'Click the button and speak your response clearly'}
                  {isRecording && 'Speak now... Click the button when finished'}
                  {isProcessingAudio && 'Transcribing your speech...'}
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto flex items-center space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your response as the doctor..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                disabled={!isConnected}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!isConnected || !inputMessage.trim()}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Send</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
          
          {!isConnected && (
            <p className="text-sm text-red-600 text-center mt-3">
              Connection lost. Attempting to reconnect...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
