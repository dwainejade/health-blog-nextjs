// src/app/posts/[id]/page.js
"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFirebasePost } from "@/hooks/useFirebasePosts";
import { useAuthStore } from "@/stores/authStore";
import SafeImage from "@/components/ui/SafeImage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import "@/styles/editor.scss";

const PostPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAdmin, user } = useAuthStore();

  // Ensure postId is always a string for Firebase compatibility
  const postId = String(decodeURIComponent(params.id));

  // Debug logging
  useEffect(() => {
    console.log("🔍 PostPage Debug Info:");
    console.log("Raw params:", params);
    console.log("Raw params.id:", params.id);
    console.log("Post ID (string):", postId);
    console.log("Type of postId:", typeof postId);
    console.log("Post ID length:", postId?.length);
  }, [params, postId]);

  const { post, loading, error, refreshPost } = useFirebasePost(postId);

  // Debug the post data
  useEffect(() => {
    if (post) {
      console.log("✅ Post loaded successfully:", post);
    }
    if (error) {
      console.log("❌ Post loading error:", error);
    }
  }, [post, error]);

  // Format the publication date
  const formatDate = (date) => {
    if (!date) return "";

    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return {
        full: format(dateObj, "MMMM d, yyyy"),
        relative: formatDistanceToNow(dateObj, { addSuffix: true }),
      };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { full: "", relative: "" };
    }
  };

  // Get author name
  const getAuthorName = () => {
    if (post?.author?.authorName) return post.author.authorName;
    if (post?.authorName) return post.authorName;
    return "Unknown Author";
  };

  // Get author avatar with Cloudinary optimization
  const getAuthorAvatar = () => {
    const avatar = post?.author?.bio?.avatar || post?.authorAvatar;
    if (!avatar) return null;

    // If it's a Cloudinary URL, optimize it
    if (avatar.includes("cloudinary.com")) {
      return avatar.replace(
        "/upload/",
        "/upload/w_100,h_100,c_fill,f_auto,q_auto/"
      );
    }
    return avatar;
  };

  // Get author bio
  const getAuthorBio = () => {
    if (post?.author?.bio?.description) return post.author.bio.description;
    if (post?.authorBio) return post.authorBio;
    return null;
  };

  // Get optimized featured image from Cloudinary
  const getOptimizedFeaturedImage = () => {
    const featuredImage = post?.featuredImage;
    if (!featuredImage) return null;

    // If it's a Cloudinary URL, optimize it for different screen sizes
    if (featuredImage.includes("cloudinary.com")) {
      return {
        mobile: featuredImage.replace(
          "/upload/",
          "/upload/w_768,f_auto,q_auto/"
        ),
        tablet: featuredImage.replace(
          "/upload/",
          "/upload/w_1024,f_auto,q_auto/"
        ),
        desktop: featuredImage.replace(
          "/upload/",
          "/upload/w_1200,f_auto,q_auto/"
        ),
        original: featuredImage,
      };
    }

    // For non-Cloudinary images, return the original
    return {
      mobile: featuredImage,
      tablet: featuredImage,
      desktop: featuredImage,
      original: featuredImage,
    };
  };

  // Handle edit button click
  const handleEditPost = () => {
    router.push(`/admin/edit/${postId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded w-3/4"></div>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>

            {/* Image skeleton */}
            <div className="h-96 bg-gray-200 rounded-lg"></div>

            {/* Content skeleton */}
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Debug information for development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-semibold mb-2">
                Debug Information:
              </h3>
              <div className="text-sm text-red-600 space-y-1">
                <p>
                  <strong>Post ID:</strong> {postId}
                </p>
                <p>
                  <strong>Error:</strong> {error}
                </p>
                <p>
                  <strong>Post object:</strong> {post ? "exists" : "null"}
                </p>
              </div>
            </div>
          )}

          <ErrorMessage
            message={error || "Post not found"}
            onRetry={refreshPost}
          />
          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to all posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const dates = formatDate(post.createdAt);
  const optimizedImages = getOptimizedFeaturedImage();

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation and Admin Controls */}
        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            All Posts
          </Link>

          {/* Admin Edit Button */}
          {isAdmin() && (
            <button
              onClick={handleEditPost}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Post
            </button>
          )}
        </div>

        {/* Article Header */}
        <header className="mb-12">
          {/* Categories/Tags */}
          {(post.categories || post.tags) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {(post.categories || post.tags)?.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
            {post.title}
          </h1>

          {/* Author and Date Info */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-8">
            <div className="flex items-center space-x-4">
              {/* Author Avatar with Cloudinary optimization */}
              {getAuthorAvatar() && (
                <SafeImage
                  src={getAuthorAvatar()}
                  alt={getAuthorName()}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}

              {/* Author Info */}
              <div>
                <div className="font-semibold text-gray-900">
                  {getAuthorName()}
                </div>
                <div className="text-sm text-gray-600">
                  {dates.full} • {dates.relative}
                </div>
              </div>
            </div>

            {/* Post Stats */}
            <div className="text-sm text-gray-500">
              {post.views && post.views > 0 && (
                <span>
                  {post.views} {post.views === 1 ? "view" : "views"}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Featured Image with Cloudinary optimization */}
        {optimizedImages && (
          <div className="mb-12">
            <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
              <picture>
                <source
                  media="(max-width: 768px)"
                  srcSet={optimizedImages.mobile}
                />
                <source
                  media="(max-width: 1024px)"
                  srcSet={optimizedImages.tablet}
                />
                <SafeImage
                  src={optimizedImages.desktop}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                />
              </picture>
            </div>
          </div>
        )}

        {/* Article Content with enhanced image optimization */}
        <div className="prose prose-lg max-w-none mb-12">
          <div
            dangerouslySetInnerHTML={{
              __html:
                post.content?.replace(
                  /<img([^>]+)src="([^"]*cloudinary[^"]*)"([^>]*)>/g,
                  (match, before, src, after) => {
                    // Optimize Cloudinary images in content
                    const optimizedSrc = src.replace(
                      "/upload/",
                      "/upload/w_800,f_auto,q_auto/"
                    );
                    return `<img${before}src="${optimizedSrc}"${after} loading="lazy">`;
                  }
                ) || post.content,
            }}
            className="prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
          />
        </div>

        {/* Article Footer */}
        <footer className="border-t border-gray-200 pt-8">
          {/* Author Bio Section */}
          {getAuthorBio() && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-4">
                {getAuthorAvatar() && (
                  <SafeImage
                    src={getAuthorAvatar()}
                    alt={getAuthorName()}
                    width={64}
                    height={64}
                    className="rounded-full flex-shrink-0"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About {getAuthorName()}
                  </h3>
                  <p className="text-gray-700">{getAuthorBio()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                Share this article:
              </span>

              {/* Social Share Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    const text = encodeURIComponent(post.title);
                    window.open(
                      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
                      "_blank"
                    );
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Share on Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                      "_blank"
                    );
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Share on Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    const title = encodeURIComponent(post.title);
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`,
                      "_blank"
                    );
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // You could add a toast notification here
                    alert("Link copied to clipboard!");
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Copy link"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Last Updated */}
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <div className="text-sm text-gray-500">
                Updated {formatDate(post.updatedAt).relative}
              </div>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
};

export default PostPage;
