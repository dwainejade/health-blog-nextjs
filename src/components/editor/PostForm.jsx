// src/components/editor/PostForm.jsx
import { useState } from "react";
// import ImageUpload from "./ImageUpload";

const PostForm = ({
  title,
  setTitle,
  shortDesc = "",
  setShortDesc,
  posterImage,
  setPosterImage,
}) => {
  const [imagePreview, setImagePreview] = useState(posterImage);

  const handleImageChange = (imageUrl) => {
    setPosterImage(imageUrl);
    setImagePreview(imageUrl);
  };

  const handleTitleChange = (e) => {
    console.log("📝 Title changed to:", e.target.value);
    setTitle(e.target.value);
  };

  const handleDescChange = (e) => {
    console.log("📝 Short desc changed to:", e.target.value);
    setShortDesc(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Title Input */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter your blog post title..."
          className="w-full text-3xl font-bold placeholder-gray-400 border-none outline-none resize-none bg-transparent"
          autoFocus
        />
      </div>

      {/* Poster Image Upload */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Featured Image
        </h3>
        <ImageUpload
          value={posterImage}
          onChange={handleImageChange}
          preview={imagePreview}
          placeholder="Add a featured image for your post..."
        />
      </div> */}

      {/* Short Description Input */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Post Description
        </h3>
        <textarea
          value={shortDesc}
          onChange={handleDescChange}
          placeholder="Write a brief description or excerpt for your post..."
          rows={3}
          className="w-full text-lg placeholder-gray-400 border-none outline-none resize-none bg-transparent"
        />
        <div className="mt-2 text-sm text-gray-500">
          {shortDesc.length}/300 characters
        </div>
      </div>
    </div>
  );
};

export default PostForm;
