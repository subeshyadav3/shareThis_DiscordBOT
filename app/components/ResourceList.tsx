"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Clock, User, AlertCircle, BookOpen, FileText, Lock, Users } from "lucide-react"

type Resource = {
  id: string
  subject: string
  link: string
  uploader: string
  createdAt: string
  receiver?: string
}

type UserStat = {
  username: string
  resourceCount: number
  lastActive: string
}

export default function ResourceTabs() {
  const [activeTab, setActiveTab] = useState<"all" | "files" | "private" | "users">("all")

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Resource Center</h1>


        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "all" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All Resources
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "files" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Files Only
          </button>
          <button
            onClick={() => setActiveTab("private")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "private" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Private Shares
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "users" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            User Stats
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "all" && <ResourceList />}
        {activeTab === "files" && <FileResourceList />}
        {activeTab === "private" && <PrivateResourceList />}
        {activeTab === "users" && <UserStatsList />}
      </div>
    </div>
  )
}

function ResourceList() {
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

function FileResourceList() {
  const [data, setData] = useState<Resource[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/resource/files")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch files")
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

  const isFileUrl = (url: string): boolean => {

    return url.includes("cdn.discordapp.com") || /\.\w{3,4}($|\?)/.test(url)
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
        <h3 className="mt-2 text-lg font-medium text-red-800">Failed to load files</h3>
        <p className="mt-1 text-red-700">{error}</p>
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="mx-auto max-w-md p-6 rounded-lg border text-center">
        <FileText className="mx-auto h-10 w-10 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No files found</h3>
        <p className="mt-1 text-gray-500">No files have been shared yet.</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {data.map((res) => (
        <div key={res.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">{res.subject}</h3>
            <span className="text-xs px-2 py-1 bg-blue-100 rounded-full text-blue-600">File</span>
          </div>

          <a
            href={res.link}
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm break-all">{res.link.split("/").pop()}</span>
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

function PrivateResourceList() {
  const [data, setData] = useState<Resource[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/resource/privates")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch private resources")
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
        <h3 className="mt-2 text-lg font-medium text-red-800">Failed to load private resources</h3>
        <p className="mt-1 text-red-700">{error}</p>
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="mx-auto max-w-md p-6 rounded-lg border text-center">
        <Lock className="mx-auto h-10 w-10 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No private shares found</h3>
        <p className="mt-1 text-gray-500">No resources have been shared privately yet.</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {data.map((res) => (
        <div key={res.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">{res.subject}</h3>
            <span className="text-xs px-2 py-1 bg-purple-100 rounded-full text-purple-600">Private</span>
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
              <span>From: {res.uploader}</span>
            </div>
            {res.receiver && (
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>To: {res.receiver}</span>
              </div>
            )}
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

function UserStatsList() {
  const [data, setData] = useState<UserStat[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user stats")
        return res.json()
      })
      .then((data: UserStat[]) => {
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
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md p-6 rounded-lg border border-red-200 bg-red-50 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-red-800">Failed to load user stats</h3>
        <p className="mt-1 text-red-700">{error}</p>
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="mx-auto max-w-md p-6 rounded-lg border text-center">
        <Users className="mx-auto h-10 w-10 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No users found</h3>
        <p className="mt-1 text-gray-500">No user activity has been recorded yet.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Username
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Resources Shared
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Active
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((user, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-500">{user.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.resourceCount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span title={new Date(user.lastActive).toLocaleString()}>{formatRelativeTime(user.lastActive)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
