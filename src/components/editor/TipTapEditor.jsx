// src/components/editor/TipTapEditor.js
"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditorStore } from "@/stores/editorStore";
import { useAutoSave } from "@/hooks/useAutoSave";

export default function TipTapEditor() {
  const {
    content,
    setContent,
    title,
    setTitle,
    isDirty,
    isAutoSaving,
    lastSaved,
    clearEditor,
  } = useEditorStore();

  // Enable auto-save
  useAutoSave();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your blog post...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none min-h-[400px] p-4 focus:outline-none",
      },
    },
  });

  // Update editor content when store changes
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-4">
        <div>Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Title Input */}
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title..."
          className="w-full text-2xl font-bold border-none focus:outline-none focus:ring-0 placeholder-gray-400"
        />
      </div>

      {/* Editor Status */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          {isDirty && (
            <span className="text-orange-600">• Unsaved changes</span>
          )}
          {isAutoSaving && <span className="text-blue-600">Saving...</span>}
          {lastSaved && !isDirty && (
            <span className="text-green-600">
              Saved {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}
        </div>

        <button
          onClick={clearEditor}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Simple Toolbar */}
      <div className="border border-gray-200 rounded-t-lg p-2 flex gap-2 bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            editor.isActive("bold")
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 hover:bg-gray-100"
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            editor.isActive("italic")
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 hover:bg-gray-100"
          }`}
        >
          Italic
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1 rounded text-sm transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 hover:bg-gray-100"
          }`}
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-3 py-1 rounded text-sm transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 hover:bg-gray-100"
          }`}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            editor.isActive("bulletList")
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 hover:bg-gray-100"
          }`}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            editor.isActive("orderedList")
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 hover:bg-gray-100"
          }`}
        >
          1. List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            editor.isActive("blockquote")
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 hover:bg-gray-100"
          }`}
        >
          Quote
        </button>
      </div>

      {/* Editor Content */}
      <div className="border border-gray-200 border-t-0 rounded-b-lg">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
