import React, { useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { useSelector } from 'react-redux'; 
import { RootState } from '@/store/Store';
import { getActivityCountByRiskRange } from '@/utils/GlobalHelpers';
import { CSVRecord } from '@/store/types/CSVTypes';
import { cn } from '@/lib/utils';
import ChartSkeleton from "@/components/ui/chartSkeleton"
// Dynamically import ApexCharts to support Next.js SSR
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type PropsType = {
  className?: string;
};

const RiskScoreBarChart: React.FC<PropsType> = ({ className }) => {
  const uploadedFiles = useSelector((state: RootState) => state.csv.data) as CSVRecord[];

  const safeData = Array.isArray(uploadedFiles) ? uploadedFiles : [];

  const { categories, seriesData } = useMemo(() => {
    if (safeData.length === 0) {
      return { categories: [], seriesData: [] };
    }
    return getActivityCountByRiskRange(safeData);
  }, [safeData]);

  
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      fontFamily: 'inherit',
      animations: {
        enabled: true,
        speed: 800,
        easing: 'easeinout', // this causes TS error
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      } as any,
    },
    colors: ["#5750F1"],
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
      title: { text: 'Risk Score Range', style: { fontSize: '14px' } },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      /* labels: { 
      rotate: -45,
      trim: false,
      } */
    },
    yaxis: {
      title: { text: 'Unique Activity Count', style: { fontSize: '14px' } }
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
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Activity Count by Risk Score
        </h3>
        <Suspense fallback={<ChartSkeleton />}>
            {<ApexChart
                    options={options}
                    series={[{ name: 'Activity Count', data: seriesData }]}
                    type="bar"
                    height={350}
            />}
        </Suspense>
      </div>
    </div>
  );
};

export default RiskScoreBarChart;





