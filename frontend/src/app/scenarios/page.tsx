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

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800',
    }
    return colors[difficulty as keyof typeof colors] || colors.beginner
  }

  const startScenario = async (scenarioId: number) => {
    try {
      const response = await fetch('http://localhost:8000/api/conversations/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: scenarioId,
          user_id: 1, // Mock user ID
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading scenarios...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Select a Scenario</h1>
          <p className="text-gray-600">Choose a training scenario to begin practicing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
                    scenario.difficulty
                  )}`}
                >
                  {scenario.difficulty}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {scenario.title}
              </h3>

              <p className="text-gray-600 mb-4">{scenario.description}</p>

              {scenario.patient_age && (
                <div className="text-sm text-gray-500 mb-4">
                  <p>Patient Age: {scenario.patient_age}</p>
                  <p className="mt-1">{scenario.patient_condition}</p>
                </div>
              )}

              <button
                onClick={() => startScenario(scenario.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Start Scenario
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
