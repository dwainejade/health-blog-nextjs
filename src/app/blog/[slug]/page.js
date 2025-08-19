// src/app/blog/[slug]/page.js (Individual blog post page)
import { notFound } from "next/navigation";
import { mockBlogPosts } from "@/data/mockBlogData";
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const post = mockBlogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Health Blog`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

export async function generateStaticParams() {
  // Generate static params for all blog posts
  return mockBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }) {
  const post = mockBlogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Image */}
        <div className="aspect-w-16 aspect-h-9">
          <Image
            src={
              post.imageUrl ||
              "https://via.placeholder.com/800x450/f0f9ff/3b82f6?text=Health+Blog"
            }
            alt={post.title}
            width={800}
            height={450}
            className="w-full h-64 md:h-96 object-cover"
            priority
          />
        </div>

        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-600">
              <span className="font-medium">{post.author}</span>
              <span>•</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span>•</span>
              <span>{post.readTime} min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8 font-medium">
              {post.excerpt}
            </p>

            {/* This would be your rich content from the editor */}
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                This is where the full blog post content would be displayed.
                Currently showing mock content, but this will be replaced with
                the rich text content from your TipTap editor stored in
                Firebase.
              </p>

              <p>
                The content will be rendered as HTML and can include all the
                formatting options from your rich text editor including:
              </p>

              <ul>
                <li>Bold and italic text formatting</li>
                <li>Headers and subheaders</li>
                <li>Links and images</li>
                <li>Lists and quotes</li>
                <li>And much more!</li>
              </ul>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to all articles
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
