import React, { useMemo, Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { useSelector } from 'react-redux'; 
import { RootState } from '@/store/Store';
import { CSVRecord } from '@/store/types/CSVTypes';
import { getDataLeakageByDate } from '@/utils/GlobalHelpers';
import { cn } from '@/lib/utils';
import ChartSkeleton from '@/components/ui/chartSkeleton';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type PropsType = {
  className?: string;
};

const DataLeakageByDate: React.FC<PropsType> = ({ className }) => {
  const uploadedFiles = useSelector((state: RootState) => state.csv.data) as CSVRecord[];
  const safeData = Array.isArray(uploadedFiles) ? uploadedFiles : [];

  const [range, setRange] = useState<'7' | '30' | 'all'>('7');

  const filteredData = useMemo(() => {
    if (range === 'all') return safeData;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(range));
    return safeData.filter((row) => {
      const date = new Date(row.date);
      return !isNaN(date.getTime()) && date >= cutoff;
    });
  }, [safeData, range]);

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
      fontFamily: 'inherit'
    },
    colors: ['#5750F1'],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '55%'
      }
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
          colors: ['#6B7280']
        }
      }
    },
    yaxis: {
      title: { text: 'Leakage Incidents', style: { fontSize: '14px' } }
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '12px' }
    },
    tooltip: {
      y: { formatter: (val) => `${val} activities` }
    }
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
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as '7' | '30' | 'all')}
            className="text-sm border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <Suspense fallback={<ChartSkeleton />}>
          <ApexChart
            options={options}
            series={[{ name: 'Activity Count', data: seriesData }]}
            type="bar"
            height={350}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default DataLeakageByDate;
