"use client";

import { useEffect, useState } from "react";
import { CloseIcon, UploadIcon } from "@/assets/icons";

// Props definition
type UploadedFileProps = {
  message: string;
  size: number;
  progress: number;
  onClose: () => void;
};

// Format the size to a human-readable string (B, KB, MB)
const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  else return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const UploadedFile = ({ message, size, progress, onClose }: UploadedFileProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Update animated progress whenever the actual progress prop changes
  useEffect(() => {
    if (progress < 100) {
      const timeout = setTimeout(() => setAnimatedProgress(progress), 100); // Delay the update slightly for smooth animation
      return () => clearTimeout(timeout);
    } else {
      setAnimatedProgress(100);  // Immediately set progress to 100 when the upload is complete
    }
  }, [progress]);  // Depend on the progress prop

  return (
    <div className="relative dark:border-dark-3 dark:bg-gray-dark rounded-xl border border-gray-300 bg-white shadow-sm p-4 transition-all">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
        aria-label="Remove file"
      >
        <CloseIcon />
      </button>

      <p className="text-sm font-medium break-words">{message}</p>
      <p className="text-xs text-gray-500 mt-1">{formatSize(size)}</p>

      <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#5750F1] transition-all duration-500 ease-in-out"
          style={{ width: `${animatedProgress}%` }}  // This is the dynamic width based on progress
        />
      </div>

      <p className="text-right text-xs mt-1 text-gray-500">
        {animatedProgress < 100 ? `${animatedProgress}%` : "Uploaded"}
      </p>
    </div>
  );
};

export default UploadedFile;
