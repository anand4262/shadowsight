import React, { useMemo, Suspense} from 'react';
import {getSensitiveDataBreachSummary} from "@/utils/GlobalHelpers"
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { CSVRecord } from '@/store/types/CSVTypes';
import { cn } from '@/lib/utils';
import { ApexOptions } from 'apexcharts';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type PropsType = {
    className?: string;
  };

const SensitiveDataBreachSummaryChart: React.FC<PropsType> = ({ className }) => {
    const uploadedFiles = useSelector((state: RootState) => state.csv.data) as CSVRecord[];
    const safeData = Array.isArray(uploadedFiles) ? uploadedFiles : [];
    const { categories, seriesData } = useMemo(() => {
        return getSensitiveDataBreachSummary(safeData);
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
        columnWidth: '50%',
      }
    },
    xaxis: {
      categories,
      title: { text: 'Sensitive Data Type' },
      labels: { rotate: -45 },
    },
    yaxis: {
      title: { text: 'Activity Count' }
    },
    dataLabels: { enabled: true },
    tooltip: {
      y: { formatter: (val) => `${val} breaches` }
    }
  };
  return (
    <div className={cn('rounded-[10px] bg-white px-6 py-5 shadow-md', className)}>
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">PII / PHI / PCI Breaches</h3>
      <ApexChart
        options={options}
        series={[{ name: 'Breaches', data: seriesData }]}
        type="bar"
        height={350}
      />
    </div>
  )
}

export default SensitiveDataBreachSummaryChart