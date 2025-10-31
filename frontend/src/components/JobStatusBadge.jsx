export default function JobStatusBadge({ status }) {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Pending'
    },
    processing: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Processing'
    },
    done: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Done'
    },
    failed: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Failed'
    }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}