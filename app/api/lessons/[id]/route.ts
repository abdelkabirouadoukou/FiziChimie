import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        links: true,
      },
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, level, year, subject, chapter, lessonType, order, pdfUrl, videoUrl, links, published } = body

    // Delete existing links and recreate them
    await prisma.link.deleteMany({
      where: { lessonId: id },
    })

    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        title,
        description,
        level,
        year,
        subject,
        chapter: chapter || null,
        lessonType: lessonType || 'Cours',
        order: order || 0,
        pdfUrl,
        videoUrl,
        published,
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
    console.error('Error updating lesson:', error)
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    await prisma.lesson.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    )
  }
}
