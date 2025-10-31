import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Download, Sparkles, Target, Users, MessageSquareQuote } from 'lucide-react'
import Header from '../components/Header'
import QuoteCard from '../components/QuoteCard'
import api from '../api/axios'

export default function JobDetail() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${jobId}`)
        setJob(response.data)
      } catch (err) {
        console.error('Failed to fetch job:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [jobId])

  const handleDownload = async (type) => {
    try {
      const response = await api.get(`/jobs/${jobId}/download/${type}`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${type}_${jobId}.${type === 'transcript' ? 'txt' : 'mp3'}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error(`Failed to download ${type}:`, error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!job || job.status !== 'done' || !job.summary) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Job not ready</h3>
            <p className="text-gray-600">This job is still processing or has no summary available.</p>
          </div>
        </main>
      </div>
    )
  }

  const summary = job.summary

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Results</h1>
              <p className="text-gray-600">
                {job.source_type === 'youtube' ? 'YouTube Video' : 'Uploaded Video'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload('transcript')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Transcript</span>
              </button>
              <button
                onClick={() => handleDownload('audio')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Audio</span>
              </button>
            </div>
          </div>

          {summary.summary && (
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Summary</h2>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{summary.summary}</p>
              </div>
            </div>
          )}
        </div>

        {summary.key_takeaways && summary.key_takeaways.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-center space-x-2 mb-6">
              <Target className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Key Takeaways</h2>
            </div>
            <div className="grid gap-4">
              {summary.key_takeaways.map((takeaway, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-100"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-gray-800">{takeaway}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {summary.speaker_highlights && summary.speaker_highlights.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Speaker Highlights</h2>
            </div>
            <div className="space-y-4">
              {summary.speaker_highlights.map((highlight, index) => (
                <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                  <p className="text-gray-800">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {summary.memorable_quotes && summary.memorable_quotes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-2 mb-6">
              <MessageSquareQuote className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Memorable Quotes</h2>
            </div>
            <div className="grid gap-6">
              {summary.memorable_quotes.map((quote, index) => (
                <QuoteCard 
                  key={index} 
                  quote={typeof quote === 'string' ? quote : quote.quote} 
                  speaker={typeof quote === 'object' ? quote.speaker : null}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}