import React, { useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { cn } from '@/lib/utils';
import ChartSkeleton from "@/components/ui/chartSkeleton";
import { getActivityCountByRiskRange, useFlatCSVData  } from '@/utils/GlobalHelpers';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type PropsType = {
  className?: string;
};

const RiskScoreBarChart: React.FC<PropsType> = ({ className }) => {
  const flatData = useFlatCSVData();

  const { categories, seriesData } = useMemo(() => {
    if (flatData.length === 0) {
      return { categories: [], seriesData: [] };
    }
    return getActivityCountByRiskRange(flatData);
  }, [flatData]);

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
    colors: ["#5750F1"],
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
      title: {
        text: 'Risk Score Range',
        style: { fontSize: '14px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: 'Unique Activity Count',
        style: { fontSize: '14px' },
      },
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
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Activity Count by Risk Score
        </h3>
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

export default RiskScoreBarChart;
