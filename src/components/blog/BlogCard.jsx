// src/components/blog/BlogCard.jsx
"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const BlogCard = ({ post, isLast = false }) => {
  const formatDate = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleTagClick = (e, tag) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Filter by tag or navigate to tag page
    console.log(`Filter by tag: ${tag}`);
  };

  return (
    <article className={`py-8 ${!isLast ? "border-b border-gray-200" : ""}`}>
      <Link href={`/blog/${post.slug}`} className="block group">
        {/* Image */}
        <div className="mb-6">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg group-hover:opacity-95 transition-opacity duration-200"
            />
          ) : (
            <div className="w-full h-96 rounded-lg card-gradient flex items-center justify-center group-hover:opacity-95 transition-opacity duration-200">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🌟</div>
                <p className="text-lg font-medium opacity-90">
                  Cycles & Stages
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Tags and Meta */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            <span>•</span>
            <span>{post.readTime} min read</span>
            {post.featured && (
              <>
                <span>•</span>
                <span className="text-blue-600 font-medium">Featured</span>
              </>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 text-lg leading-relaxed">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                onClick={(e) => handleTagClick(e, tag)}
                className="text-sm text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Author */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {post.author}
            </span>
            <span className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors group-hover:underline">
              Read article →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
