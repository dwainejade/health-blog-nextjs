// src/utils/populateMockData.js - Complete working version

import { useState } from "react";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { mockBlogPosts, mockAuthors } from "@/data/mockPosts";

export class MockDataPopulator {
  constructor() {
    this.postsCollection = collection(db, "posts");
    this.authorsCollection = collection(db, "authors");
  }

  // Add all mock posts to Firestore
  async addMockPosts() {
    const results = [];

    console.log("🔥 Adding mock posts to Firestore...");

    for (const post of mockBlogPosts) {
      try {
        // Convert dates to proper format for Firestore
        const postData = {
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
        };

        // Use the mock ID as the document ID
        const docRef = doc(db, "posts", post.id);
        await setDoc(docRef, postData);

        results.push({
          id: post.id,
          title: post.title,
          status: "success",
        });

        console.log(`✅ Added: ${post.title}`);
      } catch (error) {
        console.error(`❌ Failed to add: ${post.title}`, error);
        results.push({
          id: post.id,
          title: post.title,
          status: "error",
          error: error.message,
        });
      }
    }

    return results;
  }

  // Add author profiles to Firestore
  async addMockAuthors() {
    const results = [];

    console.log("👩‍⚕️ Adding author profiles to Firestore...");

    for (const author of mockAuthors) {
      try {
        const docRef = doc(db, "authors", author.id);
        await setDoc(docRef, author);

        results.push({
          id: author.id,
          name: author.name,
          status: "success",
        });

        console.log(`✅ Added author: ${author.name}`);
      } catch (error) {
        console.error(`❌ Failed to add author: ${author.name}`, error);
        results.push({
          id: author.id,
          name: author.name,
          status: "error",
          error: error.message,
        });
      }
    }

    return results;
  }

  // Add everything at once
  async populateAll() {
    try {
      console.log("🚀 Starting mock data population...");

      const authorResults = await this.addMockAuthors();
      const postResults = await this.addMockPosts();

      const summary = {
        authors: {
          total: mockAuthors.length,
          successful: authorResults.filter((r) => r.status === "success")
            .length,
          failed: authorResults.filter((r) => r.status === "error").length,
        },
        posts: {
          total: mockBlogPosts.length,
          successful: postResults.filter((r) => r.status === "success").length,
          failed: postResults.filter((r) => r.status === "error").length,
        },
      };

      console.log("📊 Population Summary:", summary);

      return {
        success: true,
        summary,
        authorResults,
        postResults,
      };
    } catch (error) {
      console.error("💥 Population failed:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Convenience function to use in components
export const populateMockData = async () => {
  const populator = new MockDataPopulator();
  return await populator.populateAll();
};

// FIXED: Complete component with proper return statement
export function MockDataPopulatorComponent({ onComplete }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handlePopulate = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const populator = new MockDataPopulator();
      const result = await populator.populateAll();

      setResults(result);

      if (onComplete) {
        onComplete(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Added the missing return statement and JSX
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

      {/* Preview of what will be added */}
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
            with different specialties
          </p>
          <p>
            • <strong>Realistic Content</strong> written by midwives for
            expectant and new mothers
          </p>
        </div>
      </div>

      {/* FIXED: Action Button that actually calls handlePopulate */}
      <div className="mb-6">
        <button
          onClick={handlePopulate}
          disabled={loading}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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
      {results && (
        <div className="space-y-4">
          {results.success ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-semibold text-green-900 mb-2">✅ Success!</h3>
              <div className="text-green-700 text-sm space-y-1">
                <p>
                  Authors: {results.summary.authors.successful}/
                  {results.summary.authors.total} added
                </p>
                <p>
                  Posts: {results.summary.posts.successful}/
                  {results.summary.posts.total} added
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="font-semibold text-red-900 mb-2">
                ❌ Population Failed
              </h3>
              <p className="text-red-700 text-sm">{results.error}</p>
            </div>
          )}

          {/* Detailed Results */}
          {results.summary && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h4 className="font-medium text-gray-900 mb-3">
                📊 Detailed Results
              </h4>

              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-gray-800">
                    👩‍⚕️ Authors Added:
                  </h5>
                  <div className="text-sm text-gray-600 mt-1">
                    {results.authorResults?.map((author) => (
                      <div
                        key={author.id}
                        className="flex items-center space-x-2"
                      >
                        <span>{author.status === "success" ? "✅" : "❌"}</span>
                        <span>{author.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-800">📝 Posts Added:</h5>
                  <div className="text-sm text-gray-600 mt-1">
                    {results.postResults?.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center space-x-2"
                      >
                        <span>{post.status === "success" ? "✅" : "❌"}</span>
                        <span className="truncate">{post.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="font-semibold text-yellow-900 mb-2">💡 Next Steps</h3>
        <div className="text-yellow-700 text-sm space-y-1">
          <p>1. After population, visit your blog to see the posts</p>
          <p>2. Test the Firebase post hooks with real data</p>
          <p>3. Try editing and creating new posts</p>
          <p>4. Check Firebase Console to see the data structure</p>
        </div>
      </div>
    </div>
  );
}

// Export the component as default for easier importing
export default MockDataPopulatorComponent;
