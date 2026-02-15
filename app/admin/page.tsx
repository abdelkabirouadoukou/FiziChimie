'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff, Home, X, Atom, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  published: boolean
  links: Link[]
}

// Educational structure constants
const LEVELS = ['Collège', 'Lycée', 'Tronc Commun']
const YEARS = {
  'Collège': ['1ère Année', '2ème Année', '3ème Année'],
  'Lycée': ['Tronc Commun', '1ère Bac Sciences', '2ème Bac Sciences'],
  'Tronc Commun': ['Tronc Commun']
}
const SUBJECTS = ['Physique', 'Chimie']
const LESSON_TYPES = ['Cours', 'Exercice', 'Examen', 'Vidéo', 'Résumé']

export default function AdminPage() {
  const { user } = useUser()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set())
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'Lycée',
    year: 'Tronc Commun',
    subject: 'Physique',
    chapter: '',
    lessonType: 'Cours',
    order: 0,
    pdfUrl: '',
    videoUrl: '',
    published: false,
    links: [] as Link[],
  })

  const [newLink, setNewLink] = useState({ title: '', url: '' })

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons')
      const data = await response.json()
      setLessons(data)
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingLesson ? `/api/lessons/${editingLesson.id}` : '/api/lessons'
      const method = editingLesson ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchLessons()
        resetForm()
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error saving lesson:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) return
    
    try {
      const response = await fetch(`/api/lessons/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchLessons()
      }
    } catch (error) {
      console.error('Error deleting lesson:', error)
    }
  }

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setFormData({
      title: lesson.title,
      description: lesson.description || '',
      level: lesson.level,
      year: lesson.year,
      subject: lesson.subject,
      chapter: lesson.chapter || '',
      lessonType: lesson.lessonType,
      order: lesson.order,
      pdfUrl: lesson.pdfUrl || '',
      videoUrl: lesson.videoUrl || '',
      published: lesson.published,
      links: lesson.links || [],
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      level: 'Lycée',
      year: 'Tronc Commun',
      subject: 'Physique',
      chapter: '',
      lessonType: 'Cours',
      order: 0,
      pdfUrl: '',
      videoUrl: '',
      published: false,
      links: [],
    })
    setEditingLesson(null)
    setNewLink({ title: '', url: '' })
  }

  const addLink = () => {
    if (newLink.title && newLink.url) {
      setFormData({
        ...formData,
        links: [...formData.links, newLink],
      })
      setNewLink({ title: '', url: '' })
    }
  }

  const removeLink = (index: number) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index),
    })
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

  // Group lessons by year, subject, and chapter
  const groupedLessons = lessons.reduce((acc, lesson) => {
    const yearKey = `${lesson.level} - ${lesson.year}`
    if (!acc[yearKey]) acc[yearKey] = {}
    if (!acc[yearKey][lesson.subject]) acc[yearKey][lesson.subject] = {}
    const chapterKey = lesson.chapter || 'Sans Chapitre'
    if (!acc[yearKey][lesson.subject][chapterKey]) acc[yearKey][lesson.subject][chapterKey] = []
    acc[yearKey][lesson.subject][chapterKey].push(lesson)
    return acc
  }, {} as Record<string, Record<string, Record<string, Lesson[]>>>)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Atom className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold">Tableau de Bord Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Accueil
                </Button>
              </Link>
              <Link href="/lessons">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Voir les Leçons
                </Button>
              </Link>
              <UserButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Gérer les Leçons</h2>
            <p className="text-gray-600">Créer et gérer du contenu éducatif</p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            size="lg"
          >
            {showForm ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une Leçon
              </>
            )}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingLesson ? 'Modifier la Leçon' : 'Créer une Nouvelle Leçon'}</CardTitle>
              <CardDescription>
                Remplissez les détails ci-dessous pour {editingLesson ? 'modifier' : 'créer'} une leçon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Educational Structure */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="level">Niveau *</Label>
                    <select
                      id="level"
                      required
                      value={formData.level}
                      onChange={(e) => {
                        const newLevel = e.target.value
                        setFormData({ 
                          ...formData, 
                          level: newLevel,
                          year: YEARS[newLevel as keyof typeof YEARS][0]
                        })
                      }}
                      className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                    >
                      {LEVELS.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Année *</Label>
                    <select
                      id="year"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                    >
                      {YEARS[formData.level as keyof typeof YEARS].map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Matière *</Label>
                    <select
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                    >
                      {SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chapter">Chapitre</Label>
                    <Input
                      id="chapter"
                      value={formData.chapter}
                      onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                      placeholder="ex: Mécanique, Électricité, Chimie Organique"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lessonType">Type de Leçon *</Label>
                    <select
                      id="lessonType"
                      required
                      value={formData.lessonType}
                      onChange={(e) => setFormData({ ...formData, lessonType: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                    >
                      {LESSON_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Entrez le titre de la leçon"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Entrez la description de la leçon"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pdfUrl">URL du PDF</Label>
                    <Input
                      id="pdfUrl"
                      type="url"
                      value={formData.pdfUrl}
                      onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                      placeholder="https://example.com/file.pdf"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">URL de la Vidéo YouTube</Label>
                    <Input
                      id="videoUrl"
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Ordre (pour le tri)</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-600">Les leçons seront triées par ordre croissant</p>
                </div>

                <div className="space-y-3">
                  <Label>Liens Additionnels</Label>
                  {formData.links.length > 0 && (
                    <div className="space-y-2">
                      {formData.links.map((link, index) => (
                        <Card key={index}>
                          <CardContent className="flex items-center justify-between p-3">
                            <span className="text-sm">{link.title} - {link.url}</span>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeLink(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Titre du lien"
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    />
                    <Input
                      type="url"
                      placeholder="URL du lien"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    />
                    <Button type="button" variant="secondary" onClick={addLink}>
                      Ajouter
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="published" className="font-normal cursor-pointer">
                    Publier la leçon (rendre visible aux étudiants)
                  </Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingLesson ? 'Modifier la Leçon' : 'Créer la Leçon'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setShowForm(false)
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lessons List - Organized by Year */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des leçons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-xl text-gray-600 mb-2">Aucune leçon pour le moment</p>
            <p className="text-sm text-gray-600 mb-4">Créez votre première leçon pour commencer !</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer la Première Leçon
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.keys(groupedLessons).sort().map((yearKey) => (
              <Card key={yearKey} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleYear(yearKey)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl">{yearKey}</CardTitle>
                      <CardDescription>
                        {Object.values(groupedLessons[yearKey]).reduce((acc, subj) => 
                          acc + Object.values(subj).reduce((a, ch) => a + ch.length, 0), 0
                        )} leçons
                      </CardDescription>
                    </div>
                    {expandedYears.has(yearKey) ? (
                      <ChevronUp className="h-6 w-6" />
                    ) : (
                      <ChevronDown className="h-6 w-6" />
                    )}
                  </div>
                </CardHeader>

                {expandedYears.has(yearKey) && (
                  <CardContent className="space-y-6">
                    {Object.keys(groupedLessons[yearKey]).sort().map((subject) => (
                      <div key={subject} className="space-y-3">
                        <h4 className="text-lg font-semibold text-blue-600 border-b pb-2">{subject}</h4>
                        {Object.keys(groupedLessons[yearKey][subject]).sort().map((chapter) => (
                          <div key={chapter} className="space-y-2 ml-4">
                            <h5 className="text-md font-medium text-gray-700">{chapter}</h5>
                            <div className="grid gap-2 ml-4">
                              {groupedLessons[yearKey][subject][chapter]
                                .sort((a, b) => a.order - b.order)
                                .map((lesson) => (
                                <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <h6 className="font-medium">{lesson.title}</h6>
                                          <Badge variant={lesson.lessonType === 'Cours' ? 'default' : 'secondary'}>
                                            {lesson.lessonType}
                                          </Badge>
                                          {lesson.published ? (
                                            <Badge variant="default">
                                              <Eye className="h-3 w-3 mr-1" />
                                              Publié
                                            </Badge>
                                          ) : (
                                            <Badge variant="secondary">
                                              <EyeOff className="h-3 w-3 mr-1" />
                                              Brouillon
                                            </Badge>
                                          )}
                                        </div>
                                        {lesson.description && (
                                          <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                                        )}
                                        <div className="flex gap-2 text-xs text-gray-600">
                                          {lesson.pdfUrl && <span>📄 PDF</span>}
                                          {lesson.videoUrl && <span>🎥 Vidéo</span>}
                                          {lesson.links && lesson.links.length > 0 && (
                                            <span>🔗 {lesson.links.length} lien(s)</span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(lesson)}>
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(lesson.id)}>
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
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
