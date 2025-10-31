import { useNavigate } from 'react-router-dom'
import { Mic, Sparkles, FileText, Brain } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const { token } = useAuth()

  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="gradient-brand p-2 rounded-lg">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-blue-600 bg-clip-text text-transparent">
                Voxify AI
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 gradient-brand text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary-700 to-blue-600 bg-clip-text text-transparent">
            Transform Podcasts into Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            AI-powered transcription and analysis for podcasts and videos. Extract key takeaways, speaker highlights, and memorable quotes instantly.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 gradient-brand text-white rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            Start Analyzing Now
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="gradient-brand w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
            <p className="text-gray-600">
              Advanced AI extracts meaningful insights, key takeaways, and highlights from your content automatically.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="gradient-brand w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Accurate Transcription</h3>
            <p className="text-gray-600">
              High-quality transcription with speaker identification, perfect for podcasts and interviews.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="gradient-brand w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Summaries</h3>
            <p className="text-gray-600">
              Get concise summaries, memorable quotes, and speaker highlights in seconds.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}