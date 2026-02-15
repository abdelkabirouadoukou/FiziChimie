import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const grade = searchParams.get('grade')
    const published = searchParams.get('published')

    const lessons = await prisma.lesson.findMany({
      where: {
        ...(subject && { subject }),
        ...(grade && { grade }),
        ...(published !== null && { published: published === 'true' }),
      },
      include: {
        links: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, subject, grade, pdfUrl, videoUrl, links, published } = body

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        subject,
        grade,
        pdfUrl,
        videoUrl,
        published: published || false,
        createdBy: userId,
        links: links?.length > 0 ? {
          create: links.map((link: { title: string; url: string }) => ({
            title: link.title,
            url: link.url,
          })),
        } : undefined,
      },
      include: {
        links: true,
      },
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    )
  }
}
