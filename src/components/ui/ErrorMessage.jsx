// src/components/ui/ErrorMessage.jsx
const ErrorMessage = ({
  message = "Something went wrong",
  onRetry = null,
  className = "",
}) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="max-w-md mx-auto">
        {/* Error Icon */}
        <div className="text-red-400 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
