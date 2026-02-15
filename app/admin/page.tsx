'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
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
  published: boolean
  links: Link[]
}

export default function AdminPage() {
  const { user } = useUser()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
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
    if (!confirm('Are you sure you want to delete this lesson?')) return
    
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
      subject: lesson.subject,
      grade: lesson.grade,
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
      subject: '',
      grade: '',
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                View Student Page
              </Link>
            </div>
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Manage Lessons</h2>
          <button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add New Lesson'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Physics, Chemistry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Grade 10, Grade 11"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/file.pdf"
                  value={formData.pdfUrl}
                  onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Links
                </label>
                <div className="space-y-2 mb-2">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <span className="flex-1">{link.title} - {link.url}</span>
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Link title"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="Link URL"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={addLink}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                  Publish lesson (make visible to students)
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingLesson ? 'Update Lesson' : 'Create Lesson'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm()
                    setShowForm(false)
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading lessons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No lessons yet. Create your first lesson!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{lesson.title}</h3>
                      {lesson.published ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{lesson.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500 mb-3">
                      <span className="font-medium">{lesson.subject}</span>
                      <span>{lesson.grade}</span>
                    </div>
                    {lesson.pdfUrl && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">📄 PDF attached</span>
                      </div>
                    )}
                    {lesson.videoUrl && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">🎥 Video attached</span>
                      </div>
                    )}
                    {lesson.links && lesson.links.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">🔗 {lesson.links.length} link(s)</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(lesson)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
