'use client'

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { BookOpen, Video, FileText, Sparkles, ArrowRight, GraduationCap, Beaker, Atom } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Atom className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Fizi-Chimie
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/lessons">
                <Button variant="ghost">Browse Lessons</Button>
              </Link>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button>Sign In</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/admin">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Badge className="mx-auto" variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              Master Physics & Chemistry
            </Badge>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
              Learn Science
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                The Smart Way
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access free video lessons, comprehensive PDFs, and interactive resources designed for students to excel in Physics and Chemistry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/lessons">
                <Button size="lg" className="text-lg px-8">
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Sign Up Free
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive learning resources tailored for students at every level
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-600 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Video Lessons</CardTitle>
                <CardDescription>
                  Watch engaging video tutorials that break down complex concepts into easy-to-understand lessons
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-600 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>PDF Resources</CardTitle>
                <CardDescription>
                  Download comprehensive study materials, notes, and practice problems to learn offline
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-600 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Curated Links</CardTitle>
                <CardDescription>
                  Access handpicked external resources and references to deepen your understanding
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 hover:shadow-2xl transition-shadow">
              <CardHeader className="space-y-4">
                <Beaker className="h-16 w-16" />
                <CardTitle className="text-3xl text-white">Physics</CardTitle>
                <CardDescription className="text-blue-100 text-base">
                  Explore mechanics, thermodynamics, electromagnetism, optics, and modern physics with comprehensive lessons and experiments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/lessons?subject=Physics">
                  <Button variant="secondary" className="w-full">
                    Explore Physics
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0 hover:shadow-2xl transition-shadow">
              <CardHeader className="space-y-4">
                <Atom className="h-16 w-16" />
                <CardTitle className="text-3xl text-white">Chemistry</CardTitle>
                <CardDescription className="text-purple-100 text-base">
                  Master organic, inorganic, physical chemistry, and chemical reactions through detailed lessons and practical examples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/lessons?subject=Chemistry">
                  <Button variant="secondary" className="w-full">
                    Explore Chemistry
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Simple Steps to Success
            </h3>
            <p className="text-lg text-gray-600">
              Start learning in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 mx-auto">
                1
              </div>
              <h4 className="text-xl font-semibold">Browse Lessons</h4>
              <p className="text-gray-600">
                Choose from our collection of Physics and Chemistry lessons organized by grade and topic
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 mx-auto">
                2
              </div>
              <h4 className="text-xl font-semibold">Watch & Learn</h4>
              <p className="text-gray-600">
                Watch video tutorials, download PDFs, and explore additional resources at your own pace
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl font-bold text-purple-600 mx-auto">
                3
              </div>
              <h4 className="text-xl font-semibold">Master Topics</h4>
              <p className="text-gray-600">
                Practice with problems, review materials, and become confident in your understanding
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <GraduationCap className="h-20 w-20 mx-auto" />
          <h3 className="text-4xl md:text-5xl font-bold">
            Ready to Excel in Science?
          </h3>
          <p className="text-xl text-blue-100">
            Join thousands of students mastering Physics and Chemistry with our free comprehensive resources
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/lessons">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Browse All Lessons
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white/30">
                  Get Started Free
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Atom className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-white">Fizi-Chimie</span>
              </div>
              <p className="text-sm">
                Your comprehensive platform for mastering Physics and Chemistry through engaging lessons and resources.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/lessons" className="hover:text-white transition-colors">Browse Lessons</Link></li>
                <li><Link href="/lessons?subject=Physics" className="hover:text-white transition-colors">Physics</Link></li>
                <li><Link href="/lessons?subject=Chemistry" className="hover:text-white transition-colors">Chemistry</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Teachers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <SignedIn>
                    <Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link>
                  </SignedIn>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="hover:text-white transition-colors">Sign In to Teach</button>
                    </SignInButton>
                  </SignedOut>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2026 Fizi-Chimie. All rights reserved. Built with ❤️ for students.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


