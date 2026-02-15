# Quick Setup Guide

Follow these steps to get your Fizi-Chimie educational platform up and running:

## Step 1: Set Up Neon Database
1. Visit https://neon.tech
2. Create a free account
3. Create a new project (name it "fizi-chimie-db" or anything you like)
4. Copy the connection string from the dashboard
5. Save it for the next step

## Step 2: Set Up Clerk Authentication
1. Visit https://dashboard.clerk.com
2. Create a free account
3. Click "+ Add application"
4. Name it "Fizi-Chimie"
5. Copy the following keys:
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (starts with pk_)
   - CLERK_SECRET_KEY (starts with sk_)
6. Save them for the next step

## Step 3: Create Environment File
1. In your project root, create a file named `.env.local`
2. Copy the contents from `.env.example`
3. Replace the placeholder values with your actual keys:
   - DATABASE_URL: Your Neon connection string
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Your Clerk publishable key
   - CLERK_SECRET_KEY: Your Clerk secret key
4. Save the file

Example `.env.local`:
```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Step 4: Initialize Database
Open your terminal in the project folder and run:

```bash
bunx prisma generate
bunx prisma db push
```

This will:
- Generate the Prisma client
- Create the database tables in Neon

## Step 5: Run the Development Server
```bash
bun dev
```

Your app will be available at http://localhost:3000

## Step 6: Test It Out!

### As a Student:
1. Open http://localhost:3000
2. You'll see the homepage with no lessons yet

### As a Teacher:
1. Click "Sign In" in the top right
2. Create an account with Clerk
3. After signing in, click "Admin Dashboard"
4. Create your first lesson!

## Troubleshooting

### "Can't connect to database"
- Check your DATABASE_URL in `.env.local`
- Make sure you ran `bunx prisma db push`

### "Clerk authentication error"
- Verify your Clerk keys in `.env.local`
- Make sure you copied the correct keys (publishable and secret)

### "Module not found"
- Run `bun install` to install all dependencies

## Next Steps

1. Create some test lessons
2. Upload PDFs to Google Drive and use the shareable links
3. Add YouTube video URLs for embedded videos
4. Invite students to view your lessons!

## Content Hosting Tips

### For PDFs:
- Upload to Google Drive
- Right-click → Share → Get link
- Change permissions to "Anyone with the link can view"
- Use the direct download link in your lessons

### For Videos:
- Upload to YouTube (even as unlisted videos)
- Copy the video URL
- Paste it into the lesson form
- The platform will automatically embed it!

### For Future Direct Uploads:
- Sign up at https://uploadthing.com
- Free tier gives you 2GB storage
- Add your Uploadthing keys to `.env.local`
- Perfect for hosting files directly without third-party services
