'use client'

import { useState, useEffect } from 'react'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft, Video, FileText, Link2, ChevronDown, ChevronUp, Atom } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [selectedGrade, setSelectedGrade] = useState<string>('')
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)

  useEffect(() => {
    // Get params from URL if any
    const params = new URLSearchParams(window.location.search)
    const subjectParam = params.get('subject')
    if (subjectParam) setSelectedSubject(subjectParam)
    
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Atom className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Fizi-Chimie
                </h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back Home
                </Button>
              </Link>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="sm">Sign In</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/admin">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4">Browse Lessons</h2>
          <p className="text-lg text-gray-600">
            Explore our collection of Physics and Chemistry lessons
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Lessons</CardTitle>
            <CardDescription>Find exactly what you&apos;re looking for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                >
                  <option value="">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <select
                  id="grade"
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
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
          </CardContent>
        </Card>

        {/* Lessons */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading lessons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-xl text-gray-600 mb-2">No lessons available yet</p>
            <p className="text-sm text-gray-600">Check back soon for new content!</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-3">{lesson.title}</CardTitle>
                      <div className="flex gap-2 mb-3">
                        <Badge variant="default">{lesson.subject}</Badge>
                        <Badge variant="secondary">{lesson.grade}</Badge>
                        {lesson.videoUrl && <Badge variant="outline"><Video className="h-3 w-3 mr-1" />Video</Badge>}
                        {lesson.pdfUrl && <Badge variant="outline"><FileText className="h-3 w-3 mr-1" />PDF</Badge>}
                        {lesson.links && lesson.links.length > 0 && (
                          <Badge variant="outline"><Link2 className="h-3 w-3 mr-1" />{lesson.links.length}</Badge>
                        )}
                      </div>
                      {lesson.description && (
                        <CardDescription className="text-base">{lesson.description}</CardDescription>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                    >
                      {expandedLesson === lesson.id ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          More
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>

                {expandedLesson === lesson.id && (
                  <CardContent className="space-y-6 border-t pt-6">
                    {lesson.videoUrl && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Video className="h-5 w-5 mr-2 text-blue-600" />
                          Video Lesson
                        </h4>
                        {(() => {
                          const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl)
                          return embedUrl ? (
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <iframe
                                src={embedUrl}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <Button variant="outline" asChild>
                              <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer">
                                Watch Video
                              </a>
                            </Button>
                          )
                        })()}
                      </div>
                    )}

                    {lesson.pdfUrl && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-blue-600" />
                          PDF Resource
                        </h4>
                        <Button asChild>
                          <a href={lesson.pdfUrl} target="_blank" rel="noopener noreferrer">
                            Download PDF
                          </a>
                        </Button>
                      </div>
                    )}

                    {lesson.links && lesson.links.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Link2 className="h-5 w-5 mr-2 text-blue-600" />
                          Additional Resources
                        </h4>
                        <div className="space-y-2">
                          {lesson.links.map((link, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="w-full justify-start"
                              asChild
                            >
                              <a href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.title}
                              </a>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
