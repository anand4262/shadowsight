import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { getDataLeakageByDate } from '@/utils/GlobalHelpers';
import { cn } from '@/lib/utils';
import { useFlatCSVData } from '@/utils/GlobalHelpers'; 
import { CSVRecord } from '@/store/types/CSVTypes';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type PropsType = {
  className?: string;
};

const DataLeakageByDate: React.FC<PropsType> = ({ className }) => {
  const safeData: CSVRecord[] = useFlatCSVData();
  const [pageIndex, setPageIndex] = useState(0);

  const allDates = useMemo(() => {
    const dates = Array.from(new Set(
      safeData
        .map(row => new Date(row.date))
        .filter(d => !isNaN(d.getTime()))
        .map(d => d.toISOString().split('T')[0])
    ));
    return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [safeData]);

  const pagedDates = useMemo(() => {
    return allDates.slice(pageIndex * 5, (pageIndex + 1) * 5);
  }, [allDates, pageIndex]);

  const filteredData = useMemo(() => {
    return safeData.filter(row => {
      const date = new Date(row.date).toISOString().split('T')[0];
      return pagedDates.includes(date);
    });
  }, [safeData, pagedDates]);

  const { categories, seriesData } = useMemo(() => {
    if (filteredData.length === 0) {
      return { categories: [], seriesData: [] };
    }
    return getDataLeakageByDate(filteredData);
  }, [filteredData]);

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
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories,
      title: { text: 'Date', style: { fontSize: '14px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        show: true,
        rotate: -45,
        trim: false,
        style: {
          fontSize: '12px',
          fontFamily: 'inherit',
          colors: ['#6B7280'],
        },
      },
    },
    yaxis: {
      title: { text: 'Leakage Incidents', style: { fontSize: '14px' } },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '12px' },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} activities`,
      },
    },
  };

  return (
    <div className={cn(
      'rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card',
      className
    )}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Data Leakage by Date
          </h3>
          <div className="flex gap-2">
            <button
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(prev => prev - 1)}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
            >
              Prev
            </button>
            <button
              disabled={(pageIndex + 1) * 5 >= allDates.length}
              onClick={() => setPageIndex(prev => prev + 1)}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
            >
              Next
            </button>
          </div>
        </div>
        <ApexChart
          options={options}
          series={[{ name: 'Activity Count', data: seriesData }]}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default DataLeakageByDate;
