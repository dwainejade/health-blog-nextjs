// src/components/MockDataPopulator.js - Simpler version

"use client";

import { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { mockBlogPosts, mockAuthors } from "@/data/mockPosts";

export default function MockDataPopulator({ onComplete }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const addMockData = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log("🚀 Adding mock data to Firestore...");

      // Add posts
      for (const post of mockBlogPosts) {
        const postData = {
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
        };

        const docRef = doc(db, "posts", post.id);
        await setDoc(docRef, postData);
        console.log(`✅ Added post: ${post.title}`);
      }

      // Add authors
      for (const author of mockAuthors) {
        const docRef = doc(db, "authors", author.id);
        await setDoc(docRef, author);
        console.log(`✅ Added author: ${author.name}`);
      }

      const result = {
        success: true,
        summary: {
          posts: {
            total: mockBlogPosts.length,
            successful: mockBlogPosts.length,
          },
          authors: {
            total: mockAuthors.length,
            successful: mockAuthors.length,
          },
        },
      };

      setResults(result);

      if (onComplete) {
        onComplete(result);
      }
    } catch (err) {
      console.error("Error adding mock data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🏥 Midwifery Blog Mock Data
        </h2>
        <p className="text-gray-600">
          Populate Firestore with sample midwifery and women's health content
        </p>
      </div>

      {/* Preview */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-semibold text-blue-900 mb-2">
          📝 What will be added:
        </h3>
        <div className="text-blue-700 text-sm space-y-1">
          <p>
            • <strong>5 Blog Posts</strong> covering labor, postpartum,
            nutrition, mental health, birth planning
          </p>
          <p>
            • <strong>1 Draft Post</strong> about VBAC for testing draft
            functionality
          </p>
          <p>
            • <strong>5 Author Profiles</strong> of certified nurse midwives
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="mb-6">
        <button
          onClick={addMockData}
          disabled={loading}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Adding Mock Data...
            </span>
          ) : (
            "🚀 Populate Firestore with Mock Data"
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="font-semibold text-red-900 mb-2">❌ Error</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {results && results.success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-semibold text-green-900 mb-2">✅ Success!</h3>
          <div className="text-green-700 text-sm space-y-1">
            <p>
              Posts: {results.summary.posts.successful}/
              {results.summary.posts.total} added
            </p>
            <p>
              Authors: {results.summary.authors.successful}/
              {results.summary.authors.total} added
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
