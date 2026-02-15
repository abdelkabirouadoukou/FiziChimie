'use client'

import { useState, useEffect } from 'react'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

interface Link {
  title: string
  url: string
}

interface Lesson {
  id: string
  title: string
  description: string | null
  subject: string
  grade: string
  pdfUrl: string | null
  videoUrl: string | null
  links: Link[]
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    let videoId = null
    
    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v')
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1)
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  } catch {
    return null
  }
}

export default function Home() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [selectedGrade, setSelectedGrade] = useState<string>('')
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)

  useEffect(() => {
    fetchLessons()
  }, [selectedSubject, selectedGrade])

  const fetchLessons = async () => {
    try {
      const params = new URLSearchParams({ published: 'true' })
      if (selectedSubject) params.append('subject', selectedSubject)
      if (selectedGrade) params.append('grade', selectedGrade)
      
      const response = await fetch(`/api/lessons?${params}`)
      const data = await response.json()
      setLessons(data)
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const subjects = Array.from(new Set(lessons.map(l => l.subject)))
  const grades = Array.from(new Set(lessons.map(l => l.grade)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">Fizi-Chimie</h1>
              <SignedIn>
                <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm">
                  Admin Dashboard
                </Link>
              </SignedIn>
            </div>
            <div className="flex items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Physics & Chemistry Learning Platform
          </h2>
          <p className="text-xl text-gray-600">
            Explore lessons, watch videos, and download resources
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Filter Lessons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Grades</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading lessons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No lessons available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {lesson.title}
                      </h3>
                      <div className="flex gap-3 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {lesson.subject}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          {lesson.grade}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {expandedLesson === lesson.id ? 'Show Less' : 'Show More'}
                    </button>
                  </div>

                  {lesson.description && (
                    <p className="text-gray-700 mb-4">{lesson.description}</p>
                  )}

                  {expandedLesson === lesson.id && (
                    <div className="space-y-6 mt-6">
                      {lesson.videoUrl && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">📹 Video Lesson</h4>
                          {(() => {
                            const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl)
                            return embedUrl ? (
                              <div className="aspect-video">
                                <iframe
                                  src={embedUrl}
                                  className="w-full h-full rounded-lg"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            ) : (
                              <a
                                href={lesson.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Watch Video
                              </a>
                            )
                          })()}
                        </div>
                      )}

                      {lesson.pdfUrl && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">📄 PDF Resource</h4>
                          <a
                            href={lesson.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Download PDF
                          </a>
                        </div>
                      )}

                      {lesson.links && lesson.links.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">🔗 Additional Resources</h4>
                          <div className="space-y-2">
                            {lesson.links.map((link, index) => (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <span className="text-blue-600 hover:text-blue-800 font-medium">
                                  {link.title} →
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>© 2026 Fizi-Chimie - Educational Platform</p>
        </div>
      </footer>
    </div>
  )
}

