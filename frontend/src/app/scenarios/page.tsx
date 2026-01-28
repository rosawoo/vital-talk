'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Scenario {
  id: number
  title: string
  description: string
  difficulty: string
  patient_age?: number
  patient_condition?: string
}

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchScenarios()
  }, [])

  const fetchScenarios = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/scenarios/')
      const data = await response.json()
      setScenarios(data)
    } catch (error) {
      console.error('Failed to fetch scenarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyConfig = (difficulty: string) => {
    const configs = {
      beginner: {
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        label: 'Beginner',
        icon: (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
          </svg>
        )
      },
      intermediate: {
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        label: 'Intermediate',
        icon: (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
      },
      advanced: {
        color: 'bg-red-100 text-red-700 border-red-200',
        label: 'Advanced',
        icon: (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
        )
      },
      expert: {
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        label: 'Expert',
        icon: (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      },
    }
    return configs[difficulty as keyof typeof configs] || configs.beginner
  }

  const startScenario = async (scenarioId: number) => {
    try {
      const response = await fetch('http://localhost:8000/api/conversations/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: scenarioId,
          user_id: 1,
        }),
      })
      const data = await response.json()
      router.push(`/conversation/${data.id}`)
    } catch (error) {
      console.error('Failed to start conversation:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mb-4"></div>
          <p className="text-slate-600">Loading scenarios...</p>
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
                <p className="text-xs text-slate-500">Medical Communication Training</p>
              </div>
            </Link>
            <Link href="/" className="text-slate-600 hover:text-sky-500 transition-colors text-sm font-medium">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Choose Your Training Scenario</h2>
            <p className="text-lg text-slate-600">
              Select a conversation scenario to begin practicing. Each scenario presents unique challenges 
              and emotional dynamics.
            </p>
          </div>

          {/* Scenarios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario) => {
              const difficultyConfig = getDifficultyConfig(scenario.difficulty)
              
              return (
                <div
                  key={scenario.id}
                  className="card p-6 hover:border-sky-300 transition-all duration-200 cursor-pointer group"
                >
                  {/* Difficulty Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`badge ${difficultyConfig.color} border`}>
                      {difficultyConfig.icon}
                      <span className="ml-1">{difficultyConfig.label}</span>
                    </span>
                    <div className="text-slate-400 text-sm">
                      {scenario.patient_age && `Age ${scenario.patient_age}`}
                    </div>
                  </div>

                  {/* Scenario Content */}
                  <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                    {scenario.title}
                  </h3>

                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    {scenario.description}
                  </p>

                  {scenario.patient_condition && (
                    <div className="mb-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Patient Condition
                      </div>
                      <p className="text-sm text-slate-700">{scenario.patient_condition}</p>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => startScenario(scenario.id)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <span>Start Scenario</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>

          {/* Help Card */}
          <div className="mt-12 card p-8 bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Training Tips</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Use Audio Mode for the most realistic training experience
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Request hints during the conversation to get coaching suggestions
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Use the Redo feature to try different approaches without consequences
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
