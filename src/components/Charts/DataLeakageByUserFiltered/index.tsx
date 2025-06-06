import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { getDataLeakageByUserFiltered } from '@/utils/GlobalHelpers';
import { cn } from '@/lib/utils';
import { useFlatCSVData } from '@/utils/GlobalHelpers'; 
import { CSVRecord } from '@/store/types/CSVTypes';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const PAGE_SIZE = 5;

const DataLeakageByUserChart: React.FC<{ className?: string }> = ({ className }) => {
  const safeData: CSVRecord[] = useFlatCSVData();
  const [page, setPage] = useState(0);

  const { labels, series } = useMemo(() => getDataLeakageByUserFiltered(safeData), [safeData]);
  const totalPages = Math.ceil(labels.length / PAGE_SIZE);

  const paginatedLabels = labels.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const paginatedSeries = series.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

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

    xaxis: {
      categories: paginatedLabels,
      labels: {
        rotate: -45,
        style: {
          fontSize: '11px',
          fontFamily: 'inherit',
        },
      },
      title: {
        text: 'User Email',
        style: { fontSize: '14px' },
      },
    },
    yaxis: {
      title: {
        text: 'Leakage Incidents',
        style: { fontSize: '14px' },
      },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '12px' },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} incidents`,
      },
    },
    grid: {
      strokeDashArray: 5,
    },
  };

  return (
    <div className={cn(
      'rounded-[10px] bg-white px-7.5 py-6 shadow-1 dark:bg-gray-dark dark:shadow-card',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Data Leakage by User (&gt;10)
        </h3>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(prev => prev + 1)}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Next
          </button>
        </div>
      </div>

      <ApexChart
        options={options}
        series={[{ name: 'Leakages', data: paginatedSeries }]}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default DataLeakageByUserChart;
