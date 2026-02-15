'use client'

import { useState, useEffect } from 'react'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft, Video, FileText, Link2, ChevronDown, ChevronUp, Atom, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Link {
  title: string
  url: string
}

interface Lesson {
  id: string
  title: string
  description: string | null
  level: string
  year: string
  subject: string
  chapter: string | null
  lessonType: string
  order: number
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

const getLessonTypeColor = (type: string) => {
  const colors = {
    'Cours': 'bg-blue-100 text-blue-800',
    'Exercice': 'bg-green-100 text-green-800',
    'Examen': 'bg-red-100 text-red-800',
    'Vidéo': 'bg-purple-100 text-purple-800',
    'Résumé': 'bg-yellow-100 text-yellow-800',
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set())
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set())
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set())
  const [selectedLevel, setSelectedLevel] = useState<string>('')

  useEffect(() => {
    fetchLessons()
  }, [selectedLevel])

  const fetchLessons = async () => {
    try {
      const params = new URLSearchParams({ published: 'true' })
      if (selectedLevel) params.append('level', selectedLevel)
      
      const response = await fetch(`/api/lessons?${params}`)
      const data = await response.json()
      setLessons(data)
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleYear = (year: string) => {
    const newExpanded = new Set(expandedYears)
    if (newExpanded.has(year)) {
      newExpanded.delete(year)
    } else {
      newExpanded.add(year)
    }
    setExpandedYears(newExpanded)
  }

  const toggleSubject = (key: string) => {
    const newExpanded = new Set(expandedSubjects)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedSubjects(newExpanded)
  }

  const toggleLesson = (id: string) => {
    const newExpanded = new Set(expandedLessons)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedLessons(newExpanded)
  }

  // Group lessons by year, subject, and chapter
  const groupedLessons = lessons.reduce((acc, lesson) => {
    const yearKey = `${lesson.level} - ${lesson.year}`
    if (!acc[yearKey]) acc[yearKey] = {}
    if (!acc[yearKey][lesson.subject]) acc[yearKey][lesson.subject] = {}
    const chapterKey = lesson.chapter || 'Général'
    if (!acc[yearKey][lesson.subject][chapterKey]) acc[yearKey][lesson.subject][chapterKey] = []
    acc[yearKey][lesson.subject][chapterKey].push(lesson)
    return acc
  }, {} as Record<string, Record<string, Record<string, Lesson[]>>>)

  const levels = Array.from(new Set(lessons.map(l => l.level)))

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
                  FiziChimie
                </h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="sm">Se Connecter</Button>
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
          <h2 className="text-4xl font-bold mb-4">📚 Parcourir les Leçons</h2>
          <p className="text-lg text-gray-600">
            Explorez notre collection de leçons de Physique et Chimie organisées par année
          </p>
        </div>

        {/* Level Filter */}
        {levels.length > 1 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Filtrer par Niveau</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedLevel === '' ? 'default' : 'outline'}
                  onClick={() => setSelectedLevel('')}
                >
                  Tous les Niveaux
                </Button>
                {levels.map((level) => (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? 'default' : 'outline'}
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lessons */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des leçons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">Aucune leçon disponible pour le moment</p>
            <p className="text-sm text-gray-600">Revenez bientôt pour du nouveau contenu !</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.keys(groupedLessons).sort().map((yearKey) => (
              <Card key={yearKey} className="overflow-hidden border-2 hover:border-blue-400 transition-colors">
                <CardHeader 
                  className="cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors"
                  onClick={() => toggleYear(yearKey)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                        {yearKey}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {Object.keys(groupedLessons[yearKey]).join(', ')} • {' '}
                        {Object.values(groupedLessons[yearKey]).reduce((acc, subj) => 
                          acc + Object.values(subj).reduce((a, ch) => a + ch.length, 0), 0
                        )} leçons disponibles
                      </CardDescription>
                    </div>
                    {expandedYears.has(yearKey) ? (
                      <ChevronUp className="h-6 w-6 text-blue-600" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                </CardHeader>

                {expandedYears.has(yearKey) && (
                  <CardContent className="pt-6 space-y-6">
                    {Object.keys(groupedLessons[yearKey]).sort().map((subject) => {
                      const subjectKey = `${yearKey}-${subject}`
                      return (
                        <div key={subject} className="border rounded-lg overflow-hidden">
                          <div 
                            className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => toggleSubject(subjectKey)}
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                                {subject === 'Physique' ? '⚛️' : '🧪'} {subject}
                                <Badge variant="secondary">
                                  {Object.values(groupedLessons[yearKey][subject]).reduce((a, ch) => a + ch.length, 0)} leçons
                                </Badge>
                              </h4>
                              {expandedSubjects.has(subjectKey) ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </div>
                          </div>

                          {expandedSubjects.has(subjectKey) && (
                            <div className="p-4 space-y-4 bg-white">
                              {Object.keys(groupedLessons[yearKey][subject]).sort().map((chapter) => (
                                <div key={chapter} className="space-y-2">
                                  <h5 className="text-lg font-medium text-gray-800 border-l-4 border-blue-500 pl-3">
                                    📖 {chapter}
                                  </h5>
                                  <div className="grid gap-3 ml-6">
                                    {groupedLessons[yearKey][subject][chapter]
                                      .sort((a, b) => a.order - b.order)
                                      .map((lesson) => (
                                      <Card 
                                        key={lesson.id} 
                                        className="hover:shadow-md transition-shadow border-l-4"
                                        style={{ borderLeftColor: lesson.lessonType === 'Cours' ? '#3b82f6' : lesson.lessonType === 'Exercice' ? '#10b981' : '#ef4444' }}
                                      >
                                        <CardHeader className="pb-3">
                                          <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <CardTitle className="text-lg">{lesson.title}</CardTitle>
                                                <Badge className={getLessonTypeColor(lesson.lessonType)}>
                                                  {lesson.lessonType}
                                                </Badge>
                                                {lesson.videoUrl && <Badge variant="outline"><Video className="h-3 w-3 mr-1" />Vidéo</Badge>}
                                                {lesson.pdfUrl && <Badge variant="outline"><FileText className="h-3 w-3 mr-1" />PDF</Badge>}
                                                {lesson.links && lesson.links.length > 0 && (
                                                  <Badge variant="outline"><Link2 className="h-3 w-3 mr-1" />{lesson.links.length}</Badge>
                                                )}
                                              </div>
                                              {lesson.description && (
                                                <CardDescription>{lesson.description}</CardDescription>
                                              )}
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => toggleLesson(lesson.id)}
                                            >
                                              {expandedLessons.has(lesson.id) ? (
                                                <>
                                                  <ChevronUp className="h-4 w-4 mr-1" />
                                                  Réduire
                                                </>
                                              ) : (
                                                <>
                                                  <ChevronDown className="h-4 w-4 mr-1" />
                                                  Voir
                                                </>
                                              )}
                                            </Button>
                                          </div>
                                        </CardHeader>

                                        {expandedLessons.has(lesson.id) && (
                                          <CardContent className="space-y-6 border-t pt-6">
                                            {lesson.videoUrl && (
                                              <div>
                                                <h4 className="font-semibold mb-3 flex items-center text-purple-700">
                                                  <Video className="h-5 w-5 mr-2" />
                                                  Vidéo de la Leçon
                                                </h4>
                                                {(() => {
                                                  const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl)
                                                  return embedUrl ? (
                                                    <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
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
                                                        Regarder la Vidéo
                                                      </a>
                                                    </Button>
                                                  )
                                                })()}
                                              </div>
                                            )}

                                            {lesson.pdfUrl && (
                                              <div>
                                                <h4 className="font-semibold mb-3 flex items-center text-blue-700">
                                                  <FileText className="h-5 w-5 mr-2" />
                                                  Document PDF
                                                </h4>
                                                <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                                                  <a href={lesson.pdfUrl} target="_blank" rel="noopener noreferrer">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Télécharger le PDF
                                                  </a>
                                                </Button>
                                              </div>
                                            )}

                                            {lesson.links && lesson.links.length > 0 && (
                                              <div>
                                                <h4 className="font-semibold mb-3 flex items-center text-green-700">
                                                  <Link2 className="h-5 w-5 mr-2" />
                                                  Ressources Additionnelles
                                                </h4>
                                                <div className="space-y-2">
                                                  {lesson.links.map((link, index) => (
                                                    <Button
                                                      key={index}
                                                      variant="outline"
                                                      className="w-full justify-start hover:bg-green-50"
                                                      asChild
                                                    >
                                                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                        <Link2 className="h-4 w-4 mr-2" />
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
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
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
