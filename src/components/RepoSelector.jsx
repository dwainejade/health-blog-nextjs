// src/components/RepoSelector.js

import React, { useState } from "react";
import { useGitHubRepoSearch } from "../hooks/useGitHubBlog";
import LoadingSpinner from "./ui/LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const RepoSelector = ({
  onRepoSelect,
  token = null,
  initialOwner = "",
  initialRepo = "",
}) => {
  const [owner, setOwner] = useState(initialOwner);
  const [repo, setRepo] = useState(initialRepo);
  const [searchQuery, setSearchQuery] = useState("");

  const { repositories, loading, error, searchRepositories } =
    useGitHubRepoSearch(token);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (owner && repo) {
      onRepoSelect({ owner: owner.trim(), name: repo.trim() });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchRepositories(searchQuery);
    }
  };

  const handleRepoClick = (repository) => {
    onRepoSelect({
      owner: repository.owner.login,
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      url: repository.html_url,
    });
  };

  return (
    <div className="space-y-6">
      {/* Manual Repository Input */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Enter Repository Details</h3>
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="owner"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Owner/Organization
              </label>
              <input
                id="owner"
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="e.g., octocat"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="repo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Repository Name
              </label>
              <input
                id="repo"
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="e.g., blog"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            Load Repository
          </button>
        </form>
      </div>

      {/* Repository Search */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Search Repositories</h3>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for blog repositories..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </form>

        {/* Search Results */}
        {loading && <LoadingSpinner message="Searching repositories..." />}
        {error && <ErrorMessage message={error} />}

        {repositories.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium mb-3">Search Results:</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {repositories.map((repo) => (
                <div
                  key={repo.id}
                  onClick={() => handleRepoClick(repo)}
                  className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-blue-600">
                        {repo.full_name}
                      </h5>
                      {repo.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>⭐ {repo.stargazers_count}</span>
                        <span>🍴 {repo.forks_count}</span>
                        <span>
                          📅 {new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoSelector;
