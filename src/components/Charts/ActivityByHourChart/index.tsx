import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { CSVRecord } from '@/store/types/CSVTypes';
import { getTimeOfDayDistribution } from '@/utils/GlobalHelpers';
import { ApexOptions } from 'apexcharts';
import { cn } from '@/lib/utils';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const PAGE_SIZE = 5;

const ActivityByHourChart: React.FC<{ className?: string }> = ({ className }) => {
  const uploadedFiles = useSelector((state: RootState) => state.csv.data) as CSVRecord[];
  const safeData = Array.isArray(uploadedFiles) ? uploadedFiles : [];

  const { labels, series } = useMemo(() => getTimeOfDayDistribution(safeData), [safeData]);

  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(labels.length / PAGE_SIZE);

  const paginatedLabels = labels.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const paginatedSeries = series.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    colors: ['#5750F1'],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '55%',
      },
    },
    xaxis: {
      categories: paginatedLabels,
      labels: { rotate: -45, style: { fontSize: '12px' } },
      title: { text: 'Time of Day', style: { fontSize: '14px' } },
    },
    yaxis: {
      title: { text: 'Activity Count', style: { fontSize: '14px' } },
      labels: { style: { fontSize: '12px' } },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '12px' },
    },
    tooltip: {
      y: { formatter: (val: number) => `${val} activities` },
    },
    grid: { strokeDashArray: 5 },
  };

  return (
    <div className={cn('rounded-[10px] bg-white px-7.5 py-6 shadow-1 dark:bg-gray-dark', className)}>
    <div className='flex items-center justify-between'>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Activity Count by Hour
      </h3>
        <div className="flex gap-2">
                <button
                disabled={page === 0}
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
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
        series={[{ name: 'Activity Count', data: paginatedSeries }]}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default ActivityByHourChart;
