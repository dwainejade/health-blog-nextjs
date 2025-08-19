// src/services/githubService.js

const GITHUB_API_BASE = "https://api.github.com";

class GitHubService {
  constructor(token = null) {
    this.token = token;
    this.headers = {
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `token ${token}` }),
    };
  }

  /**
   * Get repository contents from a specific path
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} path - Path to the content (e.g., 'blogs' or 'posts')
   * @param {string} ref - Branch/commit reference (default: main)
   */
  async getRepositoryContents(owner, repo, path = "", ref = "main") {
    try {
      const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${ref}`;
      const response = await fetch(url, { headers: this.headers });

      if (!response.ok) {
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching repository contents:", error);
      throw error;
    }
  }

  /**
   * Get file content by SHA or path
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} sha - File SHA hash
   */
  async getFileContent(owner, repo, sha) {
    try {
      const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/blobs/${sha}`;
      const response = await fetch(url, { headers: this.headers });

      if (!response.ok) {
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Decode base64 content
      if (data.encoding === "base64") {
        return atob(data.content);
      }

      return data.content;
    } catch (error) {
      console.error("Error fetching file content:", error);
      throw error;
    }
  }

  /**
   * Get all blog files from a repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} blogPath - Path to blog directory
   * @param {Array<string>} extensions - File extensions to filter (e.g., ['.md', '.mdx'])
   */
  async getBlogFiles(
    owner,
    repo,
    blogPath = "blogs",
    extensions = [".md", ".mdx"]
  ) {
    try {
      const contents = await this.getRepositoryContents(owner, repo, blogPath);

      // Filter for blog files based on extensions
      const blogFiles = contents.filter((item) => {
        if (item.type !== "file") return false;
        return extensions.some((ext) => item.name.toLowerCase().endsWith(ext));
      });

      return blogFiles;
    } catch (error) {
      console.error("Error fetching blog files:", error);
      throw error;
    }
  }

  /**
   * Get blog content with metadata
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} blogPath - Path to blog directory
   */
  async getAllBlogPosts(owner, repo, blogPath = "blogs") {
    try {
      const blogFiles = await this.getBlogFiles(owner, repo, blogPath);

      // Fetch content for each blog file
      const blogPosts = await Promise.all(
        blogFiles.map(async (file) => {
          const content = await this.getFileContent(owner, repo, file.sha);

          // Extract frontmatter and content
          const { frontmatter, content: markdownContent } =
            this.parseFrontmatter(content);

          return {
            id: file.sha,
            filename: file.name,
            path: file.path,
            size: file.size,
            sha: file.sha,
            downloadUrl: file.download_url,
            frontmatter,
            content: markdownContent,
            lastModified: new Date().toISOString(), // GitHub API doesn't provide this directly
          };
        })
      );

      return blogPosts;
    } catch (error) {
      console.error("Error fetching all blog posts:", error);
      throw error;
    }
  }

  /**
   * Parse frontmatter from markdown content
   * @param {string} content - Raw markdown content
   */
  parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return {
        frontmatter: {},
        content: content,
      };
    }

    const frontmatterText = match[1];
    const markdownContent = match[2];

    // Simple YAML parser for frontmatter
    const frontmatter = {};
    frontmatterText.split("\n").forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex !== -1) {
        const key = line.substring(0, colonIndex).trim();
        const value = line
          .substring(colonIndex + 1)
          .trim()
          .replace(/^["']|["']$/g, "");
        frontmatter[key] = value;
      }
    });

    return {
      frontmatter,
      content: markdownContent,
    };
  }

  /**
   * Search repositories for blog content
   * @param {string} query - Search query
   * @param {string} user - GitHub username to filter by
   */
  async searchBlogRepositories(query = "blog", user = null) {
    try {
      let searchQuery = `${query} in:name,description,readme`;
      if (user) {
        searchQuery += ` user:${user}`;
      }

      const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(
        searchQuery
      )}&sort=updated&order=desc`;
      const response = await fetch(url, { headers: this.headers });

      if (!response.ok) {
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error("Error searching repositories:", error);
      throw error;
    }
  }
}

export default GitHubService;
