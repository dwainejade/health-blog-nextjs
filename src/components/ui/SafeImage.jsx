// src/components/ui/SafeImage.jsx
"use client";

import React, { useState } from "react";
import Image from "next/image";

const SafeImage = ({
  src,
  alt,
  width,
  height,
  fill,
  className = "",
  fallbackSrc = null,
  showFallbackIcon = true,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Handle image load error
  const handleError = () => {
    setImageError(true);
    setLoading(false);
  };

  // Handle successful load
  const handleLoad = () => {
    setLoading(false);
  };

  // If there's an error and no fallback, show placeholder
  if (imageError && !fallbackSrc) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={!fill ? { width, height } : undefined}
      >
        {showFallbackIcon && (
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>
    );
  }

  // If there's an error but we have a fallback, try the fallback
  if (imageError && fallbackSrc) {
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={className}
        onError={() => setImageError(true)}
        onLoad={handleLoad}
        {...props}
      />
    );
  }

  // Normal image rendering
  return (
    <>
      {loading && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
};

export default SafeImage;
