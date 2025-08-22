// pages/blog/create.js (or src/pages/blog/create.js)
"use client";

import { useState, useEffect } from "react";
// import { navigate } from "next/navigate";
import PostForm from "@/components/editor/PostForm";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import "@/styles/editor.scss";

export default function CreateBlogPost() {
  const [content, setContent] = useState("");

  const handleEditorChange = (newContent) => {
    console.log("🔍 DEBUG: Editor content changed, length:", newContent.length);
    console.log(
      "🔍 DEBUG: Content preview:",
      newContent.substring(0, 100) + "..."
    );
    setContent(newContent);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 ">
      <div className="max-w-6xl mx-auto py-8">
        <PostForm onSave={() => {}} />
        <div className="editor-wrapper mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SimpleEditor
            content={content}
            onChange={handleEditorChange}
            placeholder="Start writing your blog post..."
          />
        </div>
      </div>
    </div>
  );
}

// For editing existing posts, you could create pages/blog/edit/[id].js
// export default function EditBlogPost() {
//   const router = useRouter()
//   const { id } = router.query
//   const [initialData, setInitialData] = useState(null)
//   const [loading, setLoading] = useState(true)
//
//   useEffect(() => {
//     if (id) {
//       fetchBlogPost(id)
//     }
//   }, [id])
//
//   const fetchBlogPost = async (postId) => {
//     try {
//       const response = await fetch(`/api/blog/posts/${postId}`)
//       const post = await response.json()
//       setInitialData(post)
//     } catch (error) {
//       console.error('Error fetching blog post:', error)
//     } finally {
//       setLoading(false)
//     }
//   }
//
//   const handleSave = async (formData) => {
//     // Similar to create but with PUT method
//     const response = await fetch(`/api/blog/posts/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData)
//     })
//     // Handle response...
//   }
//
//   if (loading) return <div>Loading...</div>
//
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto py-8">
//         <BlogPostEditor
//           initialData={initialData}
//           onSave={handleSave}
//         />
//       </div>
//     </div>
//   )
// }
