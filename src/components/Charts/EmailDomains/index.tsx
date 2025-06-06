'use client';

import { cn } from '@/lib/utils';
import { getEmailDomainData, useFlatCSVData } from '@/utils/GlobalHelpers';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import type { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type PropsType = {
  className?: string;
};

const PAGE_SIZE = 20;
const TOP_N = 10; // How many top active domains to show in "Highly Active" mode

const  EmailDomainChart = ({ className }: PropsType) => {
  const csvData = useFlatCSVData();
  const [page, setPage] = useState(0);
  const [filterMode, setFilterMode] = useState<'highlyActive' | 'all'>('highlyActive');

  const domainData = useMemo(() => {
    return getEmailDomainData(csvData).sort((a, b) => b.count - a.count);
  }, [csvData]);

  // Filtered & paginated data depending on filterMode
  const currentPageData = useMemo(() => {
    if (filterMode === 'highlyActive') {
      // Only show top N domains, no pagination
      const topDomains = domainData.slice(0, TOP_N);
      return {
        domains: topDomains.map((item) => item.domain),
        activityCounts: topDomains.map((item) => item.count),
      };
    } else {
      // Show paginated full data
      const totalPages = Math.ceil(domainData.length / PAGE_SIZE);
      // Clamp page so it doesn't go out of bounds if data changes
      const validPage = Math.min(page, totalPages - 1);
      const start = validPage * PAGE_SIZE;
      const slice = domainData.slice(start, start + PAGE_SIZE);
      return {
        domains: slice.map((item) => item.domain),
        activityCounts: slice.map((item) => item.count),
      };
    }
  }, [filterMode, page, domainData]);

  const totalPages = useMemo(() => {
    if (filterMode === 'all') {
      return Math.ceil(domainData.length / PAGE_SIZE);
    }
    return 1;
  }, [filterMode, domainData]);

  const maxY =
    currentPageData.activityCounts.length > 0
      ? Math.max(...currentPageData.activityCounts) + 20
      : 100;

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      fontFamily: 'inherit',
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    colors: ['#5750F1'],
    plotOptions: {
       bar: {
          horizontal: true, // <-- Switch orientation
          borderRadius: 8,
          barHeight: '60%', // Optional: adjust bar thickness
        },
    },
    grid: {
      strokeDashArray: 5,
      yaxis: {
        lines: { show: true },
      },
    },
    xaxis: {
      categories: currentPageData.domains,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      title: { text: 'Activity Count' },
      tickAmount: 5,
      min: 0,
      max: maxY,
      labels: {
        formatter: (value: number) => `${value}`,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      marker: { show: true },
    },
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterMode(e.target.value as 'highlyActive' | 'all');
    setPage(0); // reset page on filter change
  };

  return (
    <div
      className={cn(
        'rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Email Domains Activity
        </h2>

        <select
          onChange={handleFilterChange}
          value={filterMode}
          className="rounded border border-gray-300 px-3 py-1 text-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="highlyActive">Highly Active Only</option>
          <option value="all">Show All (Paginated)</option>
        </select>
      </div>

      <Chart
        options={options}
        series={[{ name: 'Activities', data: currentPageData.activityCounts }]}
        type="bar"
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
    </div>
  );
}

export default EmailDomainChart