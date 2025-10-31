import { useNavigate } from 'react-router-dom'
import { FileText, Download, Eye, Clock } from 'lucide-react'
import JobStatusBadge from './JobStatusBadge'
import api from '../api/axios'

export default function JobCard({ job }) {
  const navigate = useNavigate()

  const handleDownload = async (type) => {
    try {
      const response = await api.get(`/jobs/${job.id}/download/${type}`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${type}_${job.id}.${type === 'transcript' ? 'txt' : 'mp3'}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error(`Failed to download ${type}:`, error)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {job.source_type === 'youtube' ? 'YouTube Video' : 'Uploaded Video'}
          </h3>
          <p className="text-sm text-gray-500 truncate mb-3">{job.source}</p>
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(job.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <JobStatusBadge status={job.status} />
      </div>

      {job.status === 'done' && (
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => navigate(`/job/${job.id}`)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-lg hover:from-primary-700 hover:to-blue-700 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>View Summary</span>
          </button>
          <button
            onClick={() => handleDownload('transcript')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Download Transcript</span>
          </button>
          <button
            onClick={() => handleDownload('audio')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Audio</span>
          </button>
        </div>
      )}

      {job.status === 'failed' && job.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{job.error}</p>
        </div>
      )}
    </div>
  )
}