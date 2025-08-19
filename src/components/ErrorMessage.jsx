// src/components/ErrorMessage.js

import React from "react";

const ErrorMessage = ({
  message = "An error occurred",
  onRetry = null,
  type = "error",
}) => {
  const typeStyles = {
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconMap = {
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div className={`p-4 border rounded-lg ${typeStyles[type]}`}>
      <div className="flex items-center">
        <span className="mr-3 text-lg">{iconMap[type]}</span>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-4 bg-white hover:bg-gray-50 border border-current px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
