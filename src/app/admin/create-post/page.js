// app/admin/create/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostForm from "@/components/editor/PostForm";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useFirebasePosts } from "@/hooks/useFirebasePosts";
import { useAuthStore } from "@/stores/authStore"; // Add auth store for user info
import "@/styles/editor.scss";

export default function CreateBlogPost() {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { createPost, loading } = useFirebasePosts(false); // Don't auto-fetch on mount
  const { user } = useAuthStore(); // Get current user
  const router = useRouter();

  const handleEditorChange = (newContent) => {
    setContent(newContent);
    // Clear success message when content changes
    if (success) setSuccess(false);
  };

  const handleSave = async (formData) => {
    setError(null);
    setSuccess(false);

    try {
      // Validate user is authenticated
      if (!user) {
        throw new Error("You must be logged in to create posts");
      }

      // Combine form data with editor content
      const postData = {
        ...formData,
        content: content,
        // authorId and authorEmail will be added by createPost hook
      };

      const result = await createPost(postData);

      setSuccess(true);

      // Optional: Redirect to the published post or admin dashboard after 2 seconds
      setTimeout(() => {
        router.push("/admin/posts"); // or wherever your post management is
      }, 2000);

      console.log("Post created successfully:", result);
    } catch (err) {
      setError(err.message || "Failed to save post");
      console.error("Error creating post:", err);
    }
  };

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-4">
            You must be logged in to create blog posts.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Blog Post
          </h1>
          <p className="text-gray-600">Write and publish your blog post</p>
          {user && (
            <p className="text-sm text-gray-500 mt-2">
              Logged in as: {user.email}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success!</h3>
                <p className="mt-1 text-sm text-green-700">
                  Your blog post has been saved successfully. Redirecting to
                  posts...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Post Form */}
        <PostForm
          onSave={handleSave}
          isLoading={loading}
          showSaveButton={true}
          initialData={{
            authorName: user?.displayName || "",
            authorEmail: user?.email || "",
          }}
        />

        {/* Editor */}
        <div className="editor-wrapper mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Content Editor
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Write your blog post content below
            </p>
          </div>

          <SimpleEditor
            content={content}
            onChange={handleEditorChange}
            placeholder="Start writing your blog post..."
            userId={user?.uid} // Pass user ID for image tracking
          />
        </div>

        {/* Additional Save Button at Bottom */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() =>
              handleSave({
                title: "Untitled Post",
                shortDescription: "No description provided",
                excerpt: "",
                authorName: user?.displayName || "Unknown Author",
                authorEmail: user?.email || "",
                authorBio: "",
                tags: [],
                category: "",
                status: "draft",
              })
            }
            disabled={loading || !content.trim()}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              "Save Draft"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
