"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Clock, User, AlertCircle, BookOpen } from "lucide-react"

type Resource = {
  id: string
  subject: string
  link: string
  uploader: string
  createdAt: string
}

export function ResourceList() {
  const [data, setData] = useState<Resource[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/resource")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then((data: Resource[]) => {
        setData(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])


  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
    return `${Math.floor(diffInSeconds / 31536000)} years ago`
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 shadow-sm animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mt-3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md p-6 rounded-lg border border-red-200 bg-red-50 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-red-800">Failed to load resources</h3>
        <p className="mt-1 text-red-700">{error}</p>
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="mx-auto max-w-md p-6 rounded-lg border text-center">
        <BookOpen className="mx-auto h-10 w-10 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No resources found</h3>
        <p className="mt-1 text-gray-500">Check back later for new resources.</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {data.map((res) => (
        <div key={res.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">{res.subject}</h3>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">Resource</span>
          </div>

          <a
            href={res.link}
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm break-all">{res.link}</span>
          </a>

          <div className="mt-3 pt-3 border-t flex flex-wrap items-center gap-x-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>{res.uploader}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span title={new Date(res.createdAt).toLocaleString()}>{formatRelativeTime(res.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
