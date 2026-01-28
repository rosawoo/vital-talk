'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Feedback {
  conversation_id: number
  empathy_score: number
  clarity_score: number
  emotional_alignment_score: number
  ethical_appropriateness_score: number
  cultural_sensitivity_score: number
  overall_score: number
  strengths: string[]
  areas_for_improvement: string[]
  summary: string
}

export default function FeedbackPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string
  
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/conversations/${conversationId}/feedback`
      )
      const data = await response.json()
      setFeedback(data)
    } catch (error) {
      console.error('Failed to fetch feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600'
    if (score >= 7.0) return 'text-blue-600'
    if (score >= 5.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBar = (score: number) => {
    const percentage = (score / 10) * 100
    let colorClass = 'bg-green-500'
    if (score < 8.5) colorClass = 'bg-blue-500'
    if (score < 7.0) colorClass = 'bg-yellow-500'
    if (score < 5.5) colorClass = 'bg-red-500'
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`${colorClass} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Generating feedback...</div>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Failed to load feedback</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Conversation Feedback
            </h1>
            
            {/* Overall Score */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-6xl font-bold">
                <span className={getScoreColor(feedback.overall_score)}>
                  {feedback.overall_score.toFixed(1)}
                </span>
                <span className="text-2xl text-gray-400">/10</span>
              </div>
              <div className="flex-1">
                {getScoreBar(feedback.overall_score)}
                <p className="text-sm text-gray-600 mt-2">Overall Performance</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
              <p className="text-blue-800">{feedback.summary}</p>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Scores</h2>
            
            <div className="space-y-6">
              <ScoreItem
                label="Empathy"
                score={feedback.empathy_score}
                description="Acknowledging emotions and providing emotional support"
              />
              <ScoreItem
                label="Clarity"
                score={feedback.clarity_score}
                description="Clear communication and checking for understanding"
              />
              <ScoreItem
                label="Emotional Alignment"
                score={feedback.emotional_alignment_score}
                description="Matching the family's emotional state appropriately"
              />
              <ScoreItem
                label="Ethical Appropriateness"
                score={feedback.ethical_appropriateness_score}
                description="Following medical ethics and respecting autonomy"
              />
              <ScoreItem
                label="Cultural Sensitivity"
                score={feedback.cultural_sensitivity_score}
                description="Considering cultural norms and family dynamics"
              />
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ✅ Strengths
            </h2>
            <ul className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">•</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📈 Areas for Improvement
            </h2>
            <ul className="space-y-2">
              {feedback.areas_for_improvement.map((area, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">•</span>
                  <span className="text-gray-700">{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href="/scenarios"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
            >
              Try Another Scenario
            </Link>
            <button
              onClick={() => router.push(`/conversation/${conversationId}`)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Review Conversation
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function ScoreItem({ label, score, description }: { label: string; score: number; description: string }) {
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600'
    if (score >= 7.0) return 'text-blue-600'
    if (score >= 5.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBar = (score: number) => {
    const percentage = (score / 10) * 100
    let colorClass = 'bg-green-500'
    if (score < 8.5) colorClass = 'bg-blue-500'
    if (score < 7.0) colorClass = 'bg-yellow-500'
    if (score < 5.5) colorClass = 'bg-red-500'
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${colorClass} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="font-semibold text-gray-900">{label}</span>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score.toFixed(1)}
        </span>
      </div>
      {getScoreBar(score)}
    </div>
  )
}
