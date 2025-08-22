// src/components/editor/SaveButton.jsx
import { useState } from "react";

export default function SaveButton({
  onSave,
  isLoading,
  disabled,
  variant = "primary",
  className = "",
}) {
  const [lastSaved, setLastSaved] = useState(null);

  const handleSave = async () => {
    try {
      await onSave();
      setLastSaved(new Date());
    } catch (error) {
      // Error is handled by the parent component
      console.error("Save failed:", error);
    }
  };

  const getButtonClass = () => {
    const baseClass =
      "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
      success:
        "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    };

    return `${baseClass} ${variants[variant]} ${className}`;
  };

  const formatLastSaved = () => {
    if (!lastSaved) return "";

    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000); // seconds

    if (diff < 60) return "Saved just now";
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)} minutes ago`;
    return `Saved at ${lastSaved.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleSave}
        disabled={disabled || isLoading}
        className={getButtonClass()}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Saving...
          </div>
        ) : (
          "Save Post"
        )}
      </button>

      {lastSaved && !isLoading && (
        <span className="text-sm text-gray-500 mt-1">{formatLastSaved()}</span>
      )}
    </div>
  );
}
