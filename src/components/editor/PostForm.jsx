// src/components/editor/PostForm.jsx
import { useState, useEffect } from "react";
import SaveButton from "./SaveButton";

export default function PostForm({
  onSave,
  isLoading,
  initialData = {},
  showSaveButton = true,
}) {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    excerpt: "",
    slug: "", // Add slug field
    tags: [],
    category: "",
    status: "draft",
    ...initialData,
  });

  const [newTag, setNewTag] = useState("");
  const [slugLocked, setSlugLocked] = useState(false); // Track if user manually edited slug

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({ ...prev, ...initialData }));
      // If initialData has a slug, consider it locked
      if (initialData.slug) {
        setSlugLocked(true);
      }
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from title if not locked
    if (name === "title" && !slugLocked) {
      const autoSlug = generateSlugFromTitle(value);
      setFormData((prev) => ({ ...prev, slug: autoSlug }));
    }

    // If user manually edits slug, lock it
    if (name === "slug") {
      setSlugLocked(true);
    }
  };

  const generateSlugFromTitle = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleResetSlug = () => {
    const newSlug = generateSlugFromTitle(formData.title);
    setFormData((prev) => ({ ...prev, slug: newSlug }));
    setSlugLocked(false);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.title.trim()) {
      throw new Error("Title is required");
    }
    if (!formData.shortDescription.trim()) {
      throw new Error("Short description is required");
    }

    // Validate slug
    if (formData.slug && !/^[a-z0-9-]*$/.test(formData.slug)) {
      throw new Error(
        "URL slug can only contain lowercase letters, numbers, and hyphens"
      );
    }

    // Use shortDescription as excerpt if excerpt is not provided
    const dataToSave = {
      ...formData,
      excerpt: formData.excerpt || formData.shortDescription,
      slug: formData.slug || generateSlugFromTitle(formData.title), // Fallback slug generation
    };

    await onSave(dataToSave);
  };

  const isFormValid = formData.title.trim() && formData.shortDescription.trim();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Blog Post Details</h2>
        {showSaveButton && (
          <SaveButton
            onSave={handleSave}
            isLoading={isLoading}
            disabled={!isFormValid}
            variant="primary"
          />
        )}
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter your blog post title..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
            required
          />
        </div>

        {/* URL Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            URL Slug
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="flex">
                <span className="inline-flex items-center px-3 py-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  yoursite.com/blog/
                </span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="url-friendly-slug"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  pattern="[a-z0-9-]*"
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Only lowercase letters, numbers, and hyphens allowed
              </div>
            </div>
            <button
              type="button"
              onClick={handleResetSlug}
              className="px-3 py-3 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              title="Generate slug from title"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label
            htmlFor="shortDescription"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Short Description *
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            placeholder="Brief description of your blog post..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            required
          />
          <div className="text-sm text-gray-500 mt-1">
            {formData.shortDescription.length}/160 characters
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Excerpt (Optional)
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            placeholder="Optional custom excerpt (will use short description if not provided)..."
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          />
          <div className="text-sm text-gray-500 mt-1">
            Used for search and previews
          </div>
        </div>

        {/* Category and Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select a category</option>
              <option value="pregnancy">Pregnancy</option>
              <option value="nutrition">Nutrition</option>
              <option value="mental-health">Mental Health</option>
              <option value="birth-preparation">Birth Preparation</option>
              <option value="postpartum">Postpartum</option>
              <option value="newborn-care">Newborn Care</option>
              <option value="breastfeeding">Breastfeeding</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>

          {/* Add Tag Form */}
          <form onSubmit={handleAddTag} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Add
            </button>
          </form>

          {/* Display Tags */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
