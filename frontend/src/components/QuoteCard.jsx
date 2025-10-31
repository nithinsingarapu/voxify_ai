import { Quote } from 'lucide-react'

export default function QuoteCard({ quote, speaker }) {
  return (
    <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-100">
      <Quote className="w-8 h-8 text-primary-400 mb-3" />
      <p className="text-lg text-gray-800 mb-3 italic">"{quote}"</p>
      {speaker && (
        <p className="text-sm font-medium text-primary-700">— {speaker}</p>
      )}
    </div>
  )
}