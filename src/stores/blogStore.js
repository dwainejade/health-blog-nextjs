// src/stores/blogStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBlogStore = create(
  persist(
    (set, get) => ({
      // State
      posts: [],
      currentPost: null,
      loading: false,
      error: null,
      drafts: [],

      // Filters and search
      searchQuery: "",
      selectedCategory: "all",
      sortBy: "date", // 'date', 'title', 'popular'

      // Actions
      setPosts: (posts) => set({ posts }),

      setCurrentPost: (post) => set({ currentPost: post }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      // Add new post
      addPost: (post) =>
        set((state) => ({
          posts: [post, ...state.posts],
        })),

      // Update existing post
      updatePost: (updatedPost) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
          ),
          currentPost:
            state.currentPost?.id === updatedPost.id
              ? updatedPost
              : state.currentPost,
        })),

      // Delete post
      deletePost: (postId) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== postId),
          currentPost:
            state.currentPost?.id === postId ? null : state.currentPost,
        })),

      // Search and filter
      setSearchQuery: (query) => set({ searchQuery: query }),

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      setSortBy: (sortBy) => set({ sortBy }),

      // Get filtered posts
      getFilteredPosts: () => {
        const { posts, searchQuery, selectedCategory, sortBy } = get();

        let filtered = [...posts];

        // Apply search filter
        if (searchQuery) {
          filtered = filtered.filter(
            (post) =>
              post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply category filter
        if (selectedCategory !== "all") {
          filtered = filtered.filter(
            (post) =>
              post.category === selectedCategory ||
              post.tags?.includes(selectedCategory)
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          switch (sortBy) {
            case "title":
              return a.title.localeCompare(b.title);
            case "popular":
              return (b.views || 0) - (a.views || 0);
            case "date":
            default:
              return new Date(b.date) - new Date(a.date);
          }
        });

        return filtered;
      },

      // Draft management
      setDrafts: (drafts) => set({ drafts }),

      addDraft: (draft) =>
        set((state) => ({
          drafts: [draft, ...state.drafts],
        })),

      updateDraft: (updatedDraft) =>
        set((state) => ({
          drafts: state.drafts.map((draft) =>
            draft.id === updatedDraft.id ? updatedDraft : draft
          ),
        })),

      deleteDraft: (draftId) =>
        set((state) => ({
          drafts: state.drafts.filter((draft) => draft.id !== draftId),
        })),

      // Convert draft to post
      publishDraft: (draftId) => {
        const { drafts, addPost, deleteDraft } = get();
        const draft = drafts.find((d) => d.id === draftId);

        if (draft) {
          const post = {
            ...draft,
            status: "published",
            publishedAt: new Date().toISOString(),
          };
          addPost(post);
          deleteDraft(draftId);
          return post;
        }
        return null;
      },

      // Clear all data
      clearAll: () =>
        set({
          posts: [],
          currentPost: null,
          drafts: [],
          searchQuery: "",
          selectedCategory: "all",
          sortBy: "date",
          error: null,
        }),
    }),
    {
      name: "blog-storage",
      partialize: (state) => ({
        posts: state.posts,
        drafts: state.drafts,
        searchQuery: state.searchQuery,
        selectedCategory: state.selectedCategory,
        sortBy: state.sortBy,
      }),
    }
  )
);
