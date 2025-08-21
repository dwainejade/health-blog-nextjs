// src/app/test-mock-data/page.js - Fixed imports and component

"use client";

import { useState } from "react";
import { useFirebasePosts, usePublicPosts } from "@/hooks/useFirebasePosts";
import Link from "next/link";

// Import the mock data populator component properly
import MockDataPopulatorComponent from "@/utils/populateMockData";

export default function TestMockDataPage() {
  const [mockDataAdded, setMockDataAdded] = useState(false);
  const [showPosts, setShowPosts] = useState(false);

  // Use the Firebase hooks to test data retrieval
  const {
    posts: allPosts,
    loading: loadingAll,
    fetchAllPosts,
  } = useFirebasePosts(false);
  const { posts: publicPosts, loading: loadingPublic } = usePublicPosts(10);

  const handleMockDataComplete = (result) => {
    if (result.success) {
      setMockDataAdded(true);
      // Refresh the posts after adding mock data
      fetchAllPosts();
    }
  };

  const toggleShowPosts = () => {
    setShowPosts(!showPosts);
    if (!showPosts) {
      fetchAllPosts();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🏥 Midwifery Blog - Mock Data Setup
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Populate your Firestore database with realistic midwifery and
            women's health content to test your blog functionality.
          </p>
        </div>

        {/* Mock Data Populator Component */}
        <div className="mb-8">
          <MockDataPopulatorComponent onComplete={handleMockDataComplete} />
        </div>

        {/* Success Message */}
        {mockDataAdded && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-green-900 mb-2">
                🎉 Mock Data Added Successfully!
              </h2>
              <p className="text-green-700 mb-4">
                Your Firestore database now contains sample midwifery blog
                content.
              </p>
              <div className="space-x-4">
                <button
                  onClick={toggleShowPosts}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {showPosts ? "Hide Posts" : "View Added Posts"}
                </button>
                <Link
                  href="/"
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Visit Blog Home
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Posts Display */}
        {showPosts && (
          <div className="space-y-8">
            {/* Public Posts */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                📖 Published Posts ({publicPosts.length})
              </h3>

              {loadingPublic ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading posts...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publicPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 line-clamp-2">
                          {post.title}
                        </h4>
                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex-shrink-0">
                          {post.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>By {post.authorName}</span>
                        <div className="flex items-center space-x-2">
                          <span>{post.views} views</span>
                          <span>•</span>
                          <span>{post.readingTime} min read</span>
                        </div>
                      </div>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* All Posts (including drafts) */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                📝 All Posts - Admin View ({allPosts.length})
              </h3>

              {loadingAll ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading all posts...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          By {post.authorName}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            post.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.status}
                        </span>

                        <div className="text-xs text-gray-500">
                          {post.views} views
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Test Firebase Hooks */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🔧 Firebase Hooks Test Results
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <h4 className="font-medium text-blue-900 mb-2">
                    usePublicPosts Hook
                  </h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>Status: {loadingPublic ? "🔄 Loading" : "✅ Loaded"}</p>
                    <p>Posts Found: {publicPosts.length}</p>
                    <p>Published Only: Yes</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <h4 className="font-medium text-green-900 mb-2">
                    useFirebasePosts Hook
                  </h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>Status: {loadingAll ? "🔄 Loading" : "✅ Loaded"}</p>
                    <p>All Posts: {allPosts.length}</p>
                    <p>Includes Drafts: Yes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3">📋 Next Steps</h3>
          <div className="text-blue-700 text-sm space-y-2">
            <p>
              <strong>1. Populate Mock Data:</strong> Click the button above to
              add sample midwifery content
            </p>
            <p>
              <strong>2. Test Blog Functionality:</strong> Visit your blog home
              page to see the posts in action
            </p>
            <p>
              <strong>3. Test Admin Features:</strong> Try creating, editing,
              and managing posts
            </p>
            <p>
              <strong>4. Verify Firebase Console:</strong> Check your Firestore
              database to see the document structure
            </p>
            <p>
              <strong>5. Test Search & Filtering:</strong> Try searching for
              posts by tags or content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
