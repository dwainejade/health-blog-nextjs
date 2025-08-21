// src/components/blog/BlogCard.jsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import SafeImage from "@/components/ui/SafeImage";
import { formatDistanceToNow } from "date-fns";

const BlogCard = ({ post, isLast = false }) => {
  // Extract excerpt from content (first 150 characters without HTML)
  const getExcerpt = (content, maxLength = 200) => {
    if (!content) return "";

    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, "");

    if (plainText.length <= maxLength) return plainText;

    // Truncate at word boundary
    const truncated = plainText.substr(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");

    return truncated.substr(0, lastSpace) + "...";
  };

  // Format the publication date
  const formatDate = (date) => {
    if (!date) return "";

    try {
      // Handle Firestore timestamp or regular date
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Get the post URL - use slug if available, otherwise use ID
  const getPostUrl = () => {
    if (post.slug) {
      return `/posts/${post.slug}`;
    }
    return `/posts/${post.id}`;
  };

  // Get author name from Firebase data structure
  const getAuthorName = () => {
    if (post.author?.authorName) {
      return post.author.authorName;
    }
    if (post.authorName) {
      return post.authorName;
    }
    return "Unknown Author";
  };

  // Get author avatar
  const getAuthorAvatar = () => {
    if (post.author?.bio?.avatar) {
      return post.author.bio.avatar;
    }
    if (post.authorAvatar) {
      return post.authorAvatar;
    }
    return null;
  };

  return (
    <Link href={getPostUrl()} className="block">
      <article
        className={`group cursor-pointer transition-colors duration-200`}
      >
        {/* Featured Image - Full width on top */}
        {post.featuredImage && (
          <div className="mb-6">
            <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
              <SafeImage
                src={post.featuredImage}
                alt={post.title || "Blog post image"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="space-y-4">
          {/* Categories/Tags */}
          {(post.categories || post.tags) && (
            <div className="flex flex-wrap gap-2">
              {(post.categories || post.tags)
                ?.slice(0, 3)
                .map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {item}
                  </span>
                ))}
              {(post.categories || post.tags)?.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{(post.categories || post.tags).length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 text-lg leading-relaxed">
            {post.excerpt || getExcerpt(post.content)}
          </p>

          {/* Author and Date */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4">
            <div className="flex items-center space-x-3">
              {/* Author Avatar */}
              {getAuthorAvatar() && (
                <SafeImage
                  src={getAuthorAvatar()}
                  alt={getAuthorName()}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}

              {/* Author Name */}
              <span className="font-medium text-gray-700">
                {getAuthorName()}
              </span>
            </div>

            {/* Publication Date */}
            {post.createdAt && (
              <time dateTime={post.createdAt.toISOString?.() || post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            )}
          </div>

          {/* Read More Indicator */}
          <div className="pt-2 flex items-center text-blue-600 font-medium">
            <span className="group-hover:text-blue-800 transition-colors">
              Read full article
            </span>
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {/* View Count (if available) */}
          {post.views && post.views > 0 && (
            <div className="text-xs text-gray-400">
              {post.views} {post.views === 1 ? "view" : "views"}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
