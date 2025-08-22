// src/components/post/SimplePostDisplay.jsx
"use client";

import {
  processContentImages,
  getResponsiveImageUrls,
} from "@/lib/simple-image-utils";
import { useEffect, useState } from "react";

export function SimplePostDisplay({ post }) {
  const [processedContent, setProcessedContent] = useState("");

  useEffect(() => {
    if (post?.content) {
      // Process the content to replace image placeholders with actual Cloudinary URLs
      const processed = processContentImages(post.content);
      setProcessedContent(processed);
    }
  }, [post?.content]);

  if (!post) return null;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {/* Featured Image using our ID system */}
        {post.featuredImageId && (
          <FeaturedImage imageId={post.featuredImageId} title={post.title} />
        )}

        <div className="text-gray-600 mb-4">
          By {post.authorName} • {new Date(post.createdAt).toLocaleDateString()}
        </div>

        {post.tags && (
          <div className="flex gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Post Content with processed images */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />

      {/* Enhanced styling for our image wrappers */}
      <style jsx global>{`
        .blog-image-wrapper {
          margin: 2rem 0;
          text-align: center;
        }

        .blog-image-wrapper img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transition: transform 0.3s ease;
        }

        .blog-image-wrapper img:hover {
          transform: scale(1.02);
        }

        .blog-image-wrapper figcaption {
          margin-top: 1rem;
          font-style: italic;
          color: #6b7280;
          font-size: 0.9rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Responsive images */
        @media (max-width: 768px) {
          .blog-image-wrapper {
            margin: 1.5rem -1rem;
          }
        }
      `}</style>
    </article>
  );
}

// Featured Image Component
function FeaturedImage({ imageId, title }) {
  const images = getResponsiveImageUrls(imageId);

  if (!images.featured) return null;

  return (
    <div className="mb-8">
      <picture>
        <source media="(max-width: 768px)" srcSet={images.mobile} />
        <source media="(max-width: 1024px)" srcSet={images.tablet} />
        <img
          src={images.featured}
          alt={title}
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        />
      </picture>
    </div>
  );
}
