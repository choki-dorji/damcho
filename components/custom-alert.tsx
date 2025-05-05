import React, { useEffect } from "react";
import { X } from "lucide-react";

interface CustomAlertProps {
  type?: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  onClose?: () => void;
  duration?: number; // in milliseconds
}

const typeStyles = {
  success: "bg-green-100 border-green-400 text-green-700",
  error: "bg-red-100 border-red-400 text-red-700",
  info: "bg-blue-100 border-blue-400 text-blue-700",
  warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
};

export default function CustomAlert({
  type = "info",
  title,
  message,
  onClose,
  duration = 3000, // default 3 seconds
}: CustomAlertProps) {
  useEffect(() => {
    if (!onClose || !duration) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`border-l-4 p-4 mb-4 rounded relative flex items-start shadow ${typeStyles[type]}`}
      role="alert"
    >
      <div className="flex-1">
        <strong className="block font-bold">{title}</strong>
        <span className="block">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-xl text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}