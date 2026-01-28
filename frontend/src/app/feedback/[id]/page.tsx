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
    if (score >= 8.5) return 'text-emerald-600'
    if (score >= 7.0) return 'text-sky-600'
    if (score >= 5.5) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 8.5) return 'bg-emerald-500'
    if (score >= 7.0) return 'bg-sky-500'
    if (score >= 5.5) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 8.5) return 'Excellent'
    if (score >= 7.0) return 'Good'
    if (score >= 5.5) return 'Satisfactory'
    return 'Needs Improvement'
  }

  const getScoreBar = (score: number) => {
    const percentage = (score / 10) * 100
    const colorClass = getScoreBgColor(score)
    
    return (
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div
          className={`${colorClass} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mb-4"></div>
          <p className="text-slate-600">Generating your feedback...</p>
        </div>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="card p-8 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl text-slate-900 font-semibold mb-2">Failed to Load Feedback</p>
          <p className="text-slate-600 mb-6">There was an error retrieving your conversation feedback.</p>
          <Link href="/scenarios" className="btn-primary inline-block">
            Return to Scenarios
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Vital Talk</h1>
                <p className="text-xs text-slate-500">Session Feedback</p>
              </div>
            </Link>
            <Link href="/scenarios" className="btn-secondary">
              New Scenario
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Overall Score Card */}
          <div className="card p-10 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Session Complete</h2>
              <p className="text-slate-600">Here's your comprehensive performance feedback</p>
            </div>
            
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-7xl font-bold mb-2">
                  <span className={getScoreColor(feedback.overall_score)}>
                    {feedback.overall_score.toFixed(1)}
                  </span>
                </div>
                <div className="text-sm text-slate-500 font-medium">out of 10.0</div>
                <div className={`mt-3 px-4 py-1.5 rounded-full text-sm font-semibold ${
                  feedback.overall_score >= 8.5 ? 'bg-emerald-100 text-emerald-700' :
                  feedback.overall_score >= 7.0 ? 'bg-sky-100 text-sky-700' :
                  feedback.overall_score >= 5.5 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {getScoreLabel(feedback.overall_score)}
                </div>
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="mb-2">
                  <span className="text-sm font-medium text-slate-700">Overall Performance</span>
                </div>
                {getScoreBar(feedback.overall_score)}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-sky-50 border-l-4 border-sky-500 p-6 rounded-r-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-sky-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-sky-900 mb-1">Performance Summary</h3>
                  <p className="text-sky-800 leading-relaxed">{feedback.summary}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="card p-8 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Detailed Assessment</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScoreItem
                label="Empathy"
                score={feedback.empathy_score}
                description="Acknowledging emotions and providing emotional support"
                icon={(
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              />
              <ScoreItem
                label="Clarity"
                score={feedback.clarity_score}
                description="Clear communication and checking understanding"
                icon={(
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                )}
              />
              <ScoreItem
                label="Emotional Alignment"
                score={feedback.emotional_alignment_score}
                description="Matching the family's emotional state appropriately"
                icon={(
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              />
              <ScoreItem
                label="Ethical Appropriateness"
                score={feedback.ethical_appropriateness_score}
                description="Following medical ethics and respecting autonomy"
                icon={(
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
              />
              <ScoreItem
                label="Cultural Sensitivity"
                score={feedback.cultural_sensitivity_score}
                description="Considering cultural norms and family dynamics"
                icon={(
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              />
            </div>
          </div>

          {/* Strengths and Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Strengths */}
            <div className="card p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Strengths</h3>
              </div>
              <ul className="space-y-3">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700 text-sm leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="card p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Growth Areas</h3>
              </div>
              <ul className="space-y-3">
                {feedback.areas_for_improvement.map((area, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700 text-sm leading-relaxed">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/scenarios"
              className="flex-1 btn-primary text-center flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Practice Another Scenario</span>
            </Link>
            <button
              onClick={() => router.push(`/conversation/${conversationId}`)}
              className="flex-1 btn-secondary text-center flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Review Conversation</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

function ScoreItem({ label, score, description, icon }: { 
  label: string
  score: number
  description: string
  icon: JSX.Element 
}) {
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-600'
    if (score >= 7.0) return 'text-sky-600'
    if (score >= 5.5) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 8.5) return 'bg-emerald-500'
    if (score >= 7.0) return 'bg-sky-500'
    if (score >= 5.5) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getScoreBar = (score: number) => {
    const percentage = (score / 10) * 100
    const colorClass = getScoreBgColor(score)
    
    return (
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`${colorClass} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }

  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-slate-600">
            {icon}
          </div>
          <span className="font-semibold text-slate-900">{label}</span>
        </div>
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score.toFixed(1)}
        </span>
      </div>
      <p className="text-xs text-slate-600 mb-3">{description}</p>
      {getScoreBar(score)}
    </div>
  )
}
