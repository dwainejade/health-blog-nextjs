// src/stores/editorStore.js
import { create } from "zustand";

export const useEditorStore = create((set, get) => ({
  // State
  content: "",
  title: "",
  excerpt: "",
  category: "",
  tags: [],
  featuredImage: null,
  isDirty: false,
  isAutoSaving: false,
  lastSaved: null,

  // Editor settings
  autoSaveInterval: 30000, // 30 seconds
  autoSaveEnabled: true,

  // Actions
  setContent: (content) => set({ content, isDirty: true }),

  setTitle: (title) => set({ title, isDirty: true }),

  setExcerpt: (excerpt) => set({ excerpt, isDirty: true }),

  setCategory: (category) => set({ category, isDirty: true }),

  setTags: (tags) => set({ tags, isDirty: true }),

  addTag: (tag) =>
    set((state) => ({
      tags: [...state.tags, tag],
      isDirty: true,
    })),

  removeTag: (tagToRemove) =>
    set((state) => ({
      tags: state.tags.filter((tag) => tag !== tagToRemove),
      isDirty: true,
    })),

  setFeaturedImage: (image) => set({ featuredImage: image, isDirty: true }),

  setAutoSaving: (isAutoSaving) => set({ isAutoSaving }),

  setLastSaved: (timestamp) =>
    set({
      lastSaved: timestamp,
      isDirty: false,
    }),

  // Get current post data
  getCurrentPostData: () => {
    const state = get();
    return {
      title: state.title,
      content: state.content,
      excerpt: state.excerpt,
      category: state.category,
      tags: state.tags,
      featuredImage: state.featuredImage,
      lastModified: new Date().toISOString(),
    };
  },

  // Load post data into editor
  loadPost: (post) =>
    set({
      title: post.title || "",
      content: post.content || "",
      excerpt: post.excerpt || "",
      category: post.category || "",
      tags: post.tags || [],
      featuredImage: post.featuredImage || null,
      isDirty: false,
      lastSaved: post.lastModified || null,
    }),

  // Clear editor
  clearEditor: () =>
    set({
      content: "",
      title: "",
      excerpt: "",
      category: "",
      tags: [],
      featuredImage: null,
      isDirty: false,
      lastSaved: null,
    }),

  // Auto-save functionality
  triggerAutoSave: async () => {
    const {
      autoSaveEnabled,
      isDirty,
      getCurrentPostData,
      setAutoSaving,
      setLastSaved,
    } = get();

    if (!autoSaveEnabled || !isDirty) return;

    setAutoSaving(true);

    try {
      const postData = getCurrentPostData();

      // Save to localStorage as backup
      localStorage.setItem(
        "editor-autosave",
        JSON.stringify({
          ...postData,
          timestamp: Date.now(),
        })
      );

      // Here you could also save to your backend/GitHub
      // await saveToBackend(postData);

      setLastSaved(Date.now());
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setAutoSaving(false);
    }
  },

  // Restore from auto-save
  restoreFromAutoSave: () => {
    try {
      const saved = localStorage.getItem("editor-autosave");
      if (saved) {
        const data = JSON.parse(saved);
        get().loadPost(data);
        return true;
      }
    } catch (error) {
      console.error("Failed to restore auto-save:", error);
    }
    return false;
  },

  // Toggle auto-save
  toggleAutoSave: () =>
    set((state) => ({
      autoSaveEnabled: !state.autoSaveEnabled,
    })),
}));
