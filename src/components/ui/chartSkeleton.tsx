import React from 'react';

const ChartSkeleton: React.FC = () => {
  return (
    <div className="w-full h-[350px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 animate-shimmer" />
    </div>
  );
};

export default ChartSkeleton;
