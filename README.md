# Vite to Next.js Migration Plan - Health Blog

## 🎯 Migration Goals

- Secure GitHub API integration with server-side tokens
- Better SEO with server-side rendering
- Improved performance with static generation
- Keep existing React components with minimal changes
- Maintain all current functionality

## 📋 Pre-Migration Checklist

### 1. Backup Current Project

```bash
git branch vite-backup
git push origin vite-backup
```

### 2. Document Current Features

- [ ] Rich text editor (TipTap)
- [ ] GitHub API integration
- [ ] Firebase authentication
- [ ] Cloudinary image uploads
- [ ] Blog post CRUD operations
- [ ] Responsive design
- [ ] Tailwind CSS styling

### 3. Environment Variables Audit

```bash
# Current VITE_ variables to migrate:
VITE_FIREBASE_API_KEY → NEXT_PUBLIC_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID → NEXT_PUBLIC_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID → NEXT_PUBLIC_FIREBASE_APP_ID
VITE_GITHUB_OWNER → NEXT_PUBLIC_GITHUB_OWNER
VITE_GITHUB_REPO → NEXT_PUBLIC_GITHUB_REPO
VITE_GITHUB_BRANCH → NEXT_PUBLIC_GITHUB_BRANCH
VITE_CLOUDINARY_CLOUD_NAME → NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET → NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
VITE_CLOUDINARY_API_KEY → NEXT_PUBLIC_CLOUDINARY_API_KEY

# Server-only variables (secure):
GITHUB_TOKEN (no NEXT_PUBLIC_ prefix)
ADMIN_EMAILS (no NEXT_PUBLIC_ prefix)
CLOUDINARY_API_SECRET (no NEXT_PUBLIC_ prefix)
```

## 🚀 Migration Steps

### Phase 1: Next.js Project Setup (Day 1)

#### 1.1 Create New Next.js Project

```bash
# Create new Next.js project with App Router
npx create-next-app@latest health-blog-nextjs --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd health-blog-nextjs
```

#### 1.2 Install Dependencies

```bash
# Core dependencies from your current project
npm install firebase
npm install @tiptap/core @tiptap/react @tiptap/starter-kit
npm install @tiptap/extension-highlight @tiptap/extension-horizontal-rule
npm install @tiptap/extension-image @tiptap/extension-link @tiptap/extension-list
npm install @tiptap/extension-placeholder @tiptap/extension-subscript
npm install @tiptap/extension-superscript @tiptap/extension-text-align
npm install @tiptap/extension-typography @tiptap/extension-underline
npm install @tiptap/extensions @tiptap/pm
npm install date-fns react-icons react-hotkeys-hook
npm install lodash.throttle @types/lodash.throttle

# Additional Next.js optimizations
npm install next-themes # for dark mode
npm install @next/bundle-analyzer # for performance monitoring
```

#### 1.3 Project Structure Setup

```
health-blog-nextjs/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   ├── write/
│   │   │   └── page.tsx            # Editor page
│   │   ├── post/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Dynamic blog post page
│   │   ├── about/
│   │   │   └── page.tsx            # About page
│   │   ├── api/                     # API routes (NEW!)
│   │   │   ├── auth/
│   │   │   │   └── route.ts        # Authentication endpoints
│   │   │   ├── github/
│   │   │   │   ├── posts/
│   │   │   │   │   └── route.ts    # Posts CRUD
│   │   │   │   ├── upload/
│   │   │   │   │   └── route.ts    # File upload
│   │   │   │   └── health/
│   │   │   │       └── route.ts    # Health check
│   │   │   └── cloudinary/
│   │   │       └── route.ts        # Image upload
│   │   ├── globals.css             # Global styles
│   │   └── not-found.tsx           # 404 page
│   ├── components/                  # Migrate existing components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── blog/
│   │   │   ├── BlogCard.tsx
│   │   │   ├── BlogList.tsx
│   │   │   ├── BlogPost.tsx
│   │   │   └── BlogMeta.tsx
│   │   ├── editor/
│   │   │   ├── TipTapEditor.tsx    # Migrate from current editor
│   │   │   ├── EditorToolbar.tsx
│   │   │   └── SaveStatus.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── LoadingSpinner.tsx
│   ├── lib/                         # Utilities and config
│   │   ├── firebase.ts             # Firebase config
│   │   ├── github.ts               # GitHub server-side API
│   │   ├── cloudinary.ts           # Cloudinary config
│   │   ├── auth.ts                 # Authentication utilities
│   │   └── utils.ts                # General utilities
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── types/                       # TypeScript type definitions
│   │   ├── blog.ts
│   │   ├── auth.ts
│   │   └── api.ts
│   └── styles/                      # Additional styles
├── public/                          # Static assets
├── .env.local                       # Environment variables
├── .env.example                     # Environment variables template
├── next.config.js                   # Next.js configuration
└── tailwind.config.js              # Tailwind configuration
```

### Phase 2: Core Configuration (Day 2)

#### 2.1 Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["raw.githubusercontent.com", "res.cloudinary.com"],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: "/api/github/:path*",
        destination: "/api/github/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
```

#### 2.2 Environment Variables Setup

```bash
# .env.local
# Firebase (client-safe)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# GitHub (client-safe)
NEXT_PUBLIC_GITHUB_OWNER=dwainejade
NEXT_PUBLIC_GITHUB_REPO=leah-blog-content
NEXT_PUBLIC_GITHUB_BRANCH=main

# Cloudinary (client-safe)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key

# Server-only (secure)
GITHUB_TOKEN=your_github_token
ADMIN_EMAILS=admin@gmail.com,test@test.com
CLOUDINARY_API_SECRET=your_api_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

#### 2.3 TypeScript Configuration

```json
// tsconfig.json additions
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

### Phase 3: API Routes Implementation (Day 3-4)

#### 3.1 GitHub API Routes

```typescript
// src/app/api/github/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { githubApi } from "@/lib/github";

export async function GET() {
  try {
    const posts = await githubApi.getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const post = await githubApi.createPost(body);
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
```

#### 3.2 Authentication Middleware

```typescript
// src/lib/auth.ts
import { NextRequest } from "next/server";

export async function validateAuth(request: NextRequest) {
  // Implement Firebase admin verification
  // Check if user is in ADMIN_EMAILS list
}
```

### Phase 4: Component Migration (Day 5-7)

#### 4.1 Migrate Layout Components

```typescript
// src/app/layout.tsx
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
```

#### 4.2 Migrate Blog Components

- Copy existing components with minimal changes
- Update import statements for Next.js
- Replace `import.meta.env` with `process.env` where needed
- Add proper TypeScript types

#### 4.3 Migrate Editor Components

- Update TipTap editor for Next.js
- Implement server-side save functionality
- Add proper error handling

### Phase 5: Data Fetching Strategy (Day 8-9)

#### 5.1 Server Components for SEO

```typescript
// src/app/post/[slug]/page.tsx
import { githubApi } from "@/lib/github";
import { BlogPost } from "@/components/blog/BlogPost";

export async function generateStaticParams() {
  const posts = await githubApi.getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await githubApi.getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}
```

#### 5.2 Client Components for Interactivity

```typescript
// src/components/editor/TipTapEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useCallback } from "react";

export function TipTapEditor() {
  const handleSave = useCallback(async (content: string) => {
    // Call Next.js API route instead of direct GitHub API
    await fetch("/api/github/posts", {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }, []);

  // Rest of your existing editor logic
}
```

### Phase 6: Testing & Optimization (Day 10-11)

#### 6.1 Testing Checklist

- [ ] All pages render correctly
- [ ] Editor functionality works
- [ ] GitHub API integration secure
- [ ] Firebase authentication works
- [ ] Image uploads functional
- [ ] SEO meta tags implemented
- [ ] Performance optimized

#### 6.2 Performance Optimizations

```typescript
// src/app/page.tsx
import { Suspense } from "react";
import { BlogList } from "@/components/blog/BlogList";
import { BlogListSkeleton } from "@/components/ui/BlogListSkeleton";

export default function HomePage() {
  return (
    <div>
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogList />
      </Suspense>
    </div>
  );
}
```

### Phase 7: Deployment (Day 12)

#### 7.1 Vercel Configuration

```bash
# Update Vercel environment variables
vercel env add GITHUB_TOKEN
vercel env add ADMIN_EMAILS
vercel env add CLOUDINARY_API_SECRET
vercel env add NEXTAUTH_SECRET

# Add all NEXT_PUBLIC_ variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... etc
```

#### 7.2 Deployment Commands

```bash
npm run build
npm run start # Test production build locally
vercel --prod # Deploy to production
```

## 🔄 Migration Strategy

### Option A: Clean Slate (Recommended)

1. Create new Next.js project
2. Migrate components one by one
3. Test thoroughly before switching domains

### Option B: Gradual Migration

1. Keep current Vite project running
2. Build Next.js version in parallel
3. Switch when ready

## 📊 Benefits After Migration

### Security Improvements

- ✅ GitHub tokens hidden server-side
- ✅ API endpoints protected
- ✅ Environment variables secure

### Performance Improvements

- ✅ Server-side rendering for SEO
- ✅ Static generation for published posts
- ✅ Image optimization with Next.js Image
- ✅ Automatic code splitting

### Developer Experience

- ✅ Better TypeScript support
- ✅ Built-in API routes
- ✅ Automatic optimizations
- ✅ Better error handling

## 🚨 Potential Challenges

### 1. TipTap Editor SSR Issues

**Solution**: Ensure editor only renders on client-side

```typescript
const [isMounted, setIsMounted] = useState(false);
useEffect(() => setIsMounted(true), []);
if (!isMounted) return null;
```

### 2. Firebase Client-Side Only

**Solution**: Use dynamic imports or client-only components

### 3. GitHub API Rate Limits

**Solution**: Implement caching with Next.js built-in cache

## 📅 Estimated Timeline

- **Total Time**: 12 days
- **MVP Ready**: Day 8
- **Production Ready**: Day 12
- **Parallel Development**: Can run alongside current Vite app

## 🎯 Success Metrics

- [ ] All existing features work
- [ ] GitHub tokens are secure
- [ ] Page load speed improved
- [ ] SEO scores improved
- [ ] No breaking changes for users
