// src/hooks/useFirebasePosts.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { firebasePostService } from "@/services/firebasePostService";
import { useAuthStore } from "@/stores/authStore";

// Hook for managing all posts (admin)
export const useFirebasePosts = (autoFetch = true) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  const fetchAllPosts = useCallback(async (status = null) => {
    setLoading(true);
    setError(null);

    try {
      const allPosts = await firebasePostService.getAllPosts(status);
      setPosts(allPosts);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(
    async (postData) => {
      setLoading(true);
      setError(null);

      try {
        firebasePostService.validatePost({
          ...postData,
          authorId: user?.uid,
        });

        const newPost = await firebasePostService.createPost({
          ...postData,
          authorId: user?.uid,
          authorEmail: user?.email,
        });

        setPosts((prev) => [newPost, ...prev]);
        return newPost;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const updatePost = useCallback(async (postId, updates) => {
    setLoading(true);
    setError(null);

    try {
      const updatedPost = await firebasePostService.updatePost(postId, updates);
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? updatedPost : post))
      );
      return updatedPost;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (postId) => {
    setLoading(true);
    setError(null);

    try {
      await firebasePostService.deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const publishPost = useCallback(
    async (postId) => {
      return updatePost(postId, { status: "published" });
    },
    [updatePost]
  );

  const unpublishPost = useCallback(
    async (postId) => {
      return updatePost(postId, { status: "draft" });
    },
    [updatePost]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchAllPosts();
    }
  }, [autoFetch, fetchAllPosts]);

  return {
    posts,
    loading,
    error,
    fetchAllPosts,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
    refreshPosts: fetchAllPosts,
  };
};

// Hook for public posts (published only)
export const usePublicPosts = (pageSize = 10) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);

  const fetchPosts = useCallback(
    async (reset = false) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const result = await firebasePostService.getPublishedPosts(
          pageSize,
          reset ? null : lastDoc
        );

        if (reset) {
          setPosts(result.posts);
        } else {
          setPosts((prev) => [...prev, ...result.posts]);
        }

        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching public posts:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, lastDoc, loading]
  );

  const refreshPosts = useCallback(() => {
    setLastDoc(null);
    setHasMore(true);
    fetchPosts(true);
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchPosts(false);
    }
  }, [hasMore, loading, fetchPosts]);

  useEffect(() => {
    fetchPosts(true);
  }, [pageSize]); // Only depend on pageSize to avoid infinite loops

  return {
    posts,
    loading,
    error,
    hasMore,
    refreshPosts,
    loadMore,
  };
};

// Hook for a single post
export const useFirebasePost = (postId = null, slug = null) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async () => {
    if (!postId && !slug) return;

    setLoading(true);
    setError(null);

    try {
      let fetchedPost;
      if (slug) {
        fetchedPost = await firebasePostService.getPostBySlug(slug);
      } else {
        fetchedPost = await firebasePostService.getPostById(postId);
      }

      setPost(fetchedPost);

      // Increment views for published posts
      if (fetchedPost.status === "published") {
        firebasePostService.incrementViews(fetchedPost.id);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false);
    }
  }, [postId, slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    post,
    loading,
    error,
    refreshPost: fetchPost,
  };
};

// Hook for searching posts
export const usePostSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchPosts = useCallback(async (searchTerm, status = "published") => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchResults = await firebasePostService.searchPosts(
        searchTerm,
        status
      );
      setResults(searchResults);
    } catch (err) {
      setError(err.message);
      console.error("Error searching posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchPosts,
    clearResults,
  };
};

// Hook for posts by tag
export const usePostsByTag = (tag) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPostsByTag = useCallback(async () => {
    if (!tag) return;

    setLoading(true);
    setError(null);

    try {
      const tagPosts = await firebasePostService.getPostsByTag(tag);
      setPosts(tagPosts);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching posts by tag:", err);
    } finally {
      setLoading(false);
    }
  }, [tag]);

  useEffect(() => {
    fetchPostsByTag();
  }, [fetchPostsByTag]);

  return {
    posts,
    loading,
    error,
    refreshPosts: fetchPostsByTag,
  };
};
