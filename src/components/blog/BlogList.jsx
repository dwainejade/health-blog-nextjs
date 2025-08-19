// src/components/blog/BlogList.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import BlogCard from "./BlogCard";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import { mockBlogPosts, mockCategories } from "../../data/mockBlogData";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Simulate API call
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPosts(mockBlogPosts);
      } catch (err) {
        setError("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) =>
        post.tags.includes(selectedCategory)
      );
    }

    // Filter by search term
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(lowercaseSearch) ||
          post.excerpt.toLowerCase().includes(lowercaseSearch) ||
          post.tags.some((tag) => tag.toLowerCase().includes(lowercaseSearch))
      );
    }

    return filtered;
  }, [posts, selectedCategory, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="text-center space-y-4">
              <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded max-w-md mx-auto"></div>
            <div className="flex justify-center space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded w-20"></div>
              ))}
            </div>
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-64 bg-gray-200 rounded-lg"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cycles & Stages
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Evidence-based insights for a healthier, happier life
          </p>
        </div>

        {/* Search and Filters */}
        {/* <div className="mb-12 space-y-6">
          <div className="max-w-md mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>

          <CategoryFilter
            categories={mockCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div> */}

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            {filteredPosts.length === 0
              ? "No articles found"
              : `${filteredPosts.length} article${
                  filteredPosts.length !== 1 ? "s" : ""
                }`}
            {searchTerm && (
              <span className="ml-1">
                for "<span className="font-medium">{searchTerm}</span>"
              </span>
            )}
          </p>
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or browsing different categories.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Blog Posts */}
        {filteredPosts.length > 0 && (
          <div className="pb-12">
            {filteredPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                isLast={index === filteredPosts.length - 1}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredPosts.length > 0 && (
          <div className="text-center pb-12">
            <button
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              onClick={() => console.log("Load more posts")}
            >
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
