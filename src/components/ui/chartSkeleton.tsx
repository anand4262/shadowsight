// components/loaders/ChartSkeleton.tsx

import React from 'react';

const ChartSkeleton: React.FC = () => {
  return (
    <div className="w-full h-[350px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
      <div className="text-sm text-gray-500 dark:text-gray-300">Loading chart...</div>
    </div>
  );
};

export default ChartSkeleton;
