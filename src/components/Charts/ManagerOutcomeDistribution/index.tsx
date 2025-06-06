import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getManagerOutcomeDistribution, useFlatCSVData } from '@/utils/GlobalHelpers';
import { ApexOptions } from 'apexcharts';
import { cn } from '@/lib/utils';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type PropsType = {
  className?: string;
};

const ManagerOutcomeDistribution: React.FC<PropsType> = ({ className }) => {
  const flatData = useFlatCSVData();

  const { labels, series } = useMemo(() => {
    if (flatData.length === 0) {
      return { labels: [], series: [] };
    }
    return getManagerOutcomeDistribution(flatData);
  }, [flatData]);

  const options: ApexOptions = {
    chart: {
      type: 'pie',
      toolbar: { show: false },
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
    labels,
    legend: {
      position: 'bottom',
      fontSize: '14px',
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} entries`,
      },
    },
  };

  return (
    <div className={cn(
      'rounded-[10px] bg-white px-7.5 py-6 shadow-1 dark:bg-gray-dark dark:text-white',
      className
    )}>
      <h3 className="text-lg font-semibold mb-4">Manager Outcome Summary</h3>
      <ApexChart options={options} series={series} type="pie" height={350} />
    </div>
  );
};

export default ManagerOutcomeDistribution;
