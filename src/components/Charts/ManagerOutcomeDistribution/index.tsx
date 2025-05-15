import React, { useMemo, Suspense} from 'react';
import dynamic from 'next/dynamic';
import {getManagerOutcomeDistribution} from "@/utils/GlobalHelpers"
import { ApexOptions } from 'apexcharts';
import { useSelector } from 'react-redux'; 
import { RootState } from '@/store/Store';
import { CSVRecord } from '@/store/types/CSVTypes';
import { cn } from '@/lib/utils';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type PropsType = {
    className?: string;
  };

const ManagerOutcomeDistribution: React.FC<PropsType> = ({ className }) => {
      const uploadedFiles = useSelector((state: RootState) => state.csv.data) as CSVRecord[];
      
 const safeData = Array.isArray(uploadedFiles) ? uploadedFiles : [];

 const { labels, series } = useMemo(() => {
    if (safeData.length === 0) {
      return { labels: [], series: [] }; 
    }
    return getManagerOutcomeDistribution(safeData);
  }, [safeData]);

  const options: ApexOptions = {
    chart: {
      type: 'pie',
      toolbar: { show: false },
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
  )
}

export default ManagerOutcomeDistribution