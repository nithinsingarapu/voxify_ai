import { useState, useEffect, useRef } from 'react'
import { Youtube, Upload, AlertCircle, Loader2 } from 'lucide-react'
import Header from '../components/Header'
import JobCard from '../components/JobCard'
import SkeletonLoader from '../components/SkeletonLoader'
import api from '../api/axios'

export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const pollIntervalRef = useRef(null)

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs/')
      setJobs(response.data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
    pollIntervalRef.current = setInterval(fetchJobs, 4000)
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  const handleYoutubeSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('youtube_url', youtubeUrl)

      await api.post('/jobs/submit-url', formData)
      setYoutubeUrl('')
      fetchJobs()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit YouTube URL')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) return

    setError('')
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      await api.post('/jobs/upload-video', formData)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchJobs()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload video')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Submit content for transcription and analysis</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="gradient-brand p-2 rounded-lg">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">YouTube URL</h2>
            </div>
            <form onSubmit={handleYoutubeSubmit} className="space-y-4">
              <input
                type="url"
                required
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 gradient-brand text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit YouTube URL</span>
                )}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="gradient-brand p-2 rounded-lg">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Upload Video</h2>
            </div>
            <form onSubmit={handleFileSubmit} className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-primary-600 hover:text-primary-700 font-medium">
                    Choose a file
                  </span>
                  <span className="text-gray-600"> or drag and drop</span>
                </label>
                <p className="text-sm text-gray-500 mt-2">MP4, MOV, AVI up to 500MB</p>
                {selectedFile && (
                  <p className="text-sm text-gray-700 mt-3 font-medium">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={!selectedFile || submitting}
                className="w-full py-3 gradient-brand text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Upload Video</span>
                )}
              </button>
            </form>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Jobs</h2>
          <div className="space-y-4">
            {loading ? (
              <>
                <SkeletonLoader />
                <SkeletonLoader />
              </>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="gradient-brand w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs yet</h3>
                <p className="text-gray-600">Submit a YouTube URL or upload a video to get started</p>
              </div>
            ) : (
              jobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>
        </div>
      </main>
    </div>
  )
}