'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getActivityDataByDate, useFlatCSVData } from '@/utils/GlobalHelpers';
import { ApexOptions } from 'apexcharts';
import { cn } from '@/lib/utils';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type PropsType = {
  className?: string;
};

const PAGE_SIZE = 5;

const  ActivityOverviewChart = ({ className }: PropsType) => {
  const flatData = useFlatCSVData();

  const [filterMode, setFilterMode] = useState<'threshold' | 'all'>('threshold');
  const [threshold, setThreshold] = useState(10);
  const [page, setPage] = useState(0);

  // No loading state needed because data processing is sync and fast
  // Process and sort data once flatData changes
  const allData = useMemo(() => {
    if (!flatData || flatData.length === 0) return [];
    const data = getActivityDataByDate(flatData);
    return data
      .map((item) => ({
        ...item,
        totalCount: item.emailCount + item.usbCount + item.cloudCount,
      }))
      .sort((a, b) => b.totalCount - a.totalCount);
  }, [flatData]);

  const filteredData = useMemo(() => {
    if (filterMode === 'threshold') {
      return allData.filter((d) => d.totalCount >= threshold);
    }
    return allData;
  }, [allData, filterMode, threshold]);

  const totalPages = useMemo(() => Math.ceil(filteredData.length / PAGE_SIZE), [filteredData]);

  const paginatedData = useMemo(() => {
    if (filterMode === 'all') {
      const validPage = Math.min(page, totalPages - 1);
      const start = validPage * PAGE_SIZE;
      return filteredData.slice(start, start + PAGE_SIZE);
    }
    // threshold mode shows all filtered data at once (should be small anyway)
    return filteredData;
  }, [filterMode, page, filteredData, totalPages]);

  const formattedData = useMemo(
    () => ({
      dates: paginatedData.map((d) => d.date),
      emailCounts: paginatedData.map((d) => d.emailCount),
      usbCounts: paginatedData.map((d) => d.usbCount),
      cloudCounts: paginatedData.map((d) => d.cloudCount),
    }),
    [paginatedData]
  );

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      fontFamily: 'inherit',
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 },
      },
    },
    colors: ['#5750F1', '#FF5733', '#0ABEF9'],
    stroke: { width: 2, curve: 'smooth' },
    grid: { strokeDashArray: 5, yaxis: { lines: { show: true } } },
    xaxis: {
      categories: formattedData.dates,
      title: { text: 'Date' },
      axisBorder: { show: true },
      axisTicks: { show: true },
      labels: { rotate: -45, style: { fontSize: '12px' } },
    },
    yaxis: { title: { text: 'Activity Count' }, min: 0, labels: { style: { fontSize: '12px' } } },
    dataLabels: { enabled: false },
    tooltip: { marker: { show: true } },
  };

  const handlePrev = () => setPage((p) => Math.max(p - 1, 0));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  return (
    <div
      className={cn(
        'rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">Activity Overview</h2>

        <div className="flex gap-2 items-center">
          <select
            onChange={(e) => {
              setFilterMode(e.target.value as any);
              setPage(0);
            }}
            value={filterMode}
            className="rounded border border-gray-300 px-3 py-1 text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="threshold">Highly Active (Threshold)</option>
            <option value="all">Show All (Paginated)</option>
          </select>

          {filterMode === 'threshold' && (
            <input
              type="number"
              min={1}
              step={10}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-20 rounded border border-gray-300 px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"
              title="Min total activity count"
            />
          )}
        </div>
      </div>

      {flatData.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-6">No activity data available.</p>
      ) : (
        <>
          <Chart
            options={options}
            series={[
              { name: 'Email Activity', data: formattedData.emailCounts },
              { name: 'USB Activity', data: formattedData.usbCounts },
              { name: 'Cloud Activity', data: formattedData.cloudCounts },
            ]}
            type="line"
            height={350}
          />

          {filterMode === 'all' && totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={handlePrev}
                disabled={page === 0}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Prev
              </button>
              <span className="text-gray-600 dark:text-gray-300">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={page === totalPages - 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}


export default ActivityOverviewChart 