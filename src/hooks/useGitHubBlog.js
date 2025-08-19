// src/hooks/useGitHubBlog.js

import { useState, useEffect, useCallback } from "react";
import GitHubService from "../services/githubService";

export const useGitHubBlog = (owner, repo, options = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const {
    token = null,
    blogPath = "blogs",
    autoFetch = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  const githubService = new GitHubService(token);

  const fetchBlogs = useCallback(async () => {
    if (!owner || !repo) {
      setError("Owner and repository are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const blogPosts = await githubService.getAllBlogPosts(
        owner,
        repo,
        blogPath
      );

      // Sort blogs by date if available in frontmatter
      const sortedBlogs = blogPosts.sort((a, b) => {
        const dateA = new Date(a.frontmatter.date || a.lastModified);
        const dateB = new Date(b.frontmatter.date || b.lastModified);
        return dateB - dateA; // Most recent first
      });

      setBlogs(sortedBlogs);
      setLastFetched(new Date());
    } catch (err) {
      setError(err.message);
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  }, [owner, repo, blogPath, githubService]);

  const refreshBlogs = useCallback(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const getBlogById = useCallback(
    (id) => {
      return blogs.find((blog) => blog.id === id || blog.filename === id);
    },
    [blogs]
  );

  const searchBlogs = useCallback(
    (query) => {
      if (!query) return blogs;

      const lowercaseQuery = query.toLowerCase();
      return blogs.filter(
        (blog) =>
          blog.frontmatter.title?.toLowerCase().includes(lowercaseQuery) ||
          blog.frontmatter.description
            ?.toLowerCase()
            .includes(lowercaseQuery) ||
          blog.content.toLowerCase().includes(lowercaseQuery) ||
          blog.frontmatter.tags?.some((tag) =>
            tag.toLowerCase().includes(lowercaseQuery)
          )
      );
    },
    [blogs]
  );

  const getBlogsByTag = useCallback(
    (tag) => {
      return blogs.filter((blog) => blog.frontmatter.tags?.includes(tag));
    },
    [blogs]
  );

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch && owner && repo) {
      const now = new Date();
      const shouldFetch = !lastFetched || now - lastFetched > cacheTime;

      if (shouldFetch) {
        fetchBlogs();
      }
    }
  }, [autoFetch, owner, repo, fetchBlogs, cacheTime, lastFetched]);

  return {
    blogs,
    loading,
    error,
    lastFetched,
    refreshBlogs,
    getBlogById,
    searchBlogs,
    getBlogsByTag,
    fetchBlogs,
  };
};

// Hook for saving blogs to localStorage
export const useLocalBlogStorage = (storageKey = "github-blogs") => {
  const [storedBlogs, setStoredBlogs] = useState([]);

  // Load blogs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setStoredBlogs(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading blogs from localStorage:", error);
    }
  }, [storageKey]);

  const saveBlogs = useCallback(
    (blogs) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(blogs));
        setStoredBlogs(blogs);
      } catch (error) {
        console.error("Error saving blogs to localStorage:", error);
      }
    },
    [storageKey]
  );

  const saveBlog = useCallback(
    (blog) => {
      const updatedBlogs = [...storedBlogs];
      const existingIndex = updatedBlogs.findIndex((b) => b.id === blog.id);

      if (existingIndex >= 0) {
        updatedBlogs[existingIndex] = blog;
      } else {
        updatedBlogs.push(blog);
      }

      saveBlogs(updatedBlogs);
    },
    [storedBlogs, saveBlogs]
  );

  const removeBlog = useCallback(
    (blogId) => {
      const updatedBlogs = storedBlogs.filter((blog) => blog.id !== blogId);
      saveBlogs(updatedBlogs);
    },
    [storedBlogs, saveBlogs]
  );

  const clearBlogs = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setStoredBlogs([]);
    } catch (error) {
      console.error("Error clearing blogs from localStorage:", error);
    }
  }, [storageKey]);

  return {
    storedBlogs,
    saveBlogs,
    saveBlog,
    removeBlog,
    clearBlogs,
  };
};

// Hook for GitHub repository search
export const useGitHubRepoSearch = (token = null) => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const githubService = new GitHubService(token);

  const searchRepositories = useCallback(
    async (query, user = null) => {
      setLoading(true);
      setError(null);

      try {
        const repos = await githubService.searchBlogRepositories(query, user);
        setRepositories(repos);
      } catch (err) {
        setError(err.message);
        console.error("Error searching repositories:", err);
      } finally {
        setLoading(false);
      }
    },
    [githubService]
  );

  return {
    repositories,
    loading,
    error,
    searchRepositories,
  };
};
