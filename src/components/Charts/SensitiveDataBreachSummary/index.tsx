import React, { useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { cn } from '@/lib/utils';
import { getSensitiveDataBreachSummary, useFlatCSVData } from "@/utils/GlobalHelpers";
import ChartSkeleton from "@/components/ui/chartSkeleton";

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type PropsType = {
  className?: string;
};

const SensitiveDataBreachSummaryChart: React.FC<PropsType> = ({ className }) => {
  const flatData = useFlatCSVData();

  const { categories, seriesData } = useMemo(() => {
    return getSensitiveDataBreachSummary(flatData);
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
    xaxis: {
      categories,
      title: { text: 'Sensitive Data Type' },
      labels: { rotate: -45 },
    },
    yaxis: {
      title: { text: 'Activity Count' },
    },
    dataLabels: { enabled: true },
    tooltip: {
      y: {
        formatter: (val) => `${val} breaches`,
      },
    },
  };

  return (
    <div className={cn('rounded-[10px] bg-white px-6 py-5 shadow-md', className)}>
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
        PII / PHI / PCI Breaches
      </h3>
      <Suspense fallback={<ChartSkeleton />}>
        <ApexChart
          options={options}
          series={[{ name: 'Breaches', data: seriesData }]}
          type="bar"
          height={350}
        />
      </Suspense>
    </div>
  );
};

export default SensitiveDataBreachSummaryChart;
