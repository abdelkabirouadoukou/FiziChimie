# Fizi-Chimie - Educational Platform

A modern educational platform built with Next.js for teaching Physics and Chemistry. Teachers can create and manage lessons with PDFs, YouTube videos, and links, while students can browse and access all published content.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Clerk
- **Database**: Neon (PostgreSQL)
- **ORM**: Prisma
- **File Uploads**: Uploadthing (for future direct video/file uploads)
- **Styling**: Tailwind CSS

## 📦 Features

- **Admin Dashboard**: Create, edit, and delete lessons
- **Student Portal**: Browse and filter lessons by subject and grade
- **Content Types**: 
  - YouTube videos (embedded)
  - PDF documents
  - External links
- **Filters**: Subject and grade-based filtering
- **Authentication**: Secure sign-in with Clerk
- **Real-time**: Instant updates when lessons are published

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
bun install
```

### 2. Set Up Neon Database

1. Go to [Neon](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string

### 3. Set Up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your API keys

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Uploadthing (Optional - for future direct uploads)
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=xxxxx
```

### 5. Initialize Database

```bash
# Generate Prisma Client
bunx prisma generate

# Push schema to database
bunx prisma db push
```

### 6. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Usage

### For Teachers/Admins

1. Sign in with Clerk
2. Navigate to `/admin`
3. Click "Add New Lesson"
4. Fill in the lesson details:
   - Title and description
   - Subject (e.g., Physics, Chemistry)
   - Grade level
   - PDF URL (optional)
   - YouTube video URL (optional)
   - Additional links (optional)
5. Check "Publish lesson" to make it visible to students
6. Click "Create Lesson"

### For Students

1. Visit the homepage
2. Browse all published lessons
3. Filter by subject or grade
4. Click "Show More" to view lesson content
5. Watch embedded videos, download PDFs, or access links

## 🎥 Content Hosting Recommendations

### Current Setup (YouTube)
- **Videos**: Use YouTube for free video hosting
- **PDFs**: Upload to Google Drive, Dropbox, or any file hosting service and share the link

### Future Direct Uploads
The platform is already configured with **Uploadthing** for when you want to upload videos directly:
- **Free Tier**: 2GB storage, generous bandwidth
- **Fast**: Optimized for media delivery
- **Easy Integration**: Already set up in the codebase

To enable Uploadthing:
1. Sign up at [uploadthing.com](https://uploadthing.com)
2. Add your API keys to `.env.local`
3. Uncomment the file upload components (will need to be added)

### Alternative Free Hosting Options
- **Cloudinary**: 25GB free storage for images/videos
- **Bunny.net**: Affordable CDN with video streaming
- **Google Drive**: Unlimited storage with workspace/education account

## 🗄️ Database Schema

### Lesson Model
- `id`: Unique identifier
- `title`: Lesson title
- `description`: Optional description
- `subject`: Subject name (Physics, Chemistry, etc.)
- `grade`: Grade level
- `pdfUrl`: URL to PDF file
- `videoUrl`: YouTube or direct video URL
- `published`: Visibility status
- `createdBy`: Teacher's Clerk user ID
- `createdAt`/`updatedAt`: Timestamps

### Link Model
- Related links for each lesson
- Can have multiple links per lesson

## 📁 Project Structure

```
app/
├── api/
│   └── lessons/
│       ├── route.ts           # GET (all), POST (create)
│       └── [id]/route.ts      # GET, PUT, DELETE (single)
├── admin/
│   └── page.tsx               # Admin dashboard
├── page.tsx                   # Student homepage
├── layout.tsx                 # Root layout with Clerk
└── globals.css                # Global styles

lib/
└── prisma.ts                  # Prisma client instance

prisma/
└── schema.prisma              # Database schema

middleware.ts                  # Clerk middleware for protected routes
```

## 🔒 Security

- Admin routes (`/admin/*`) are protected with Clerk authentication
- API routes verify user authentication before allowing modifications
- Database operations use Prisma for SQL injection protection

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy Database

Your Neon database is already cloud-hosted and production-ready!

## 📝 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

