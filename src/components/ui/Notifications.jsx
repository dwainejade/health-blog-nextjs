// src/components/ui/Notifications.js
"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores/uiStore";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

export default function Notifications() {
  const { notifications, removeNotification } = useUIStore();

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    notifications.forEach((notification) => {
      if (notification.id) {
        setTimeout(() => {
          removeNotification(notification.id);
        }, 5000);
      }
    });
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <FaExclamationCircle className="w-5 h-5 text-red-500" />;
      case "info":
      default:
        return <FaInfoCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center space-x-3 p-4 rounded-lg border shadow-lg max-w-sm ${getBgColor(
            notification.type
          )}`}
        >
          {getIcon(notification.type)}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
