"use client";

import {  useSelector } from "react-redux";
import {  RootState } from "@/store/Store"; 
import { cn } from "@/lib/utils";
import { getEmailDomainData, getActivityDataByDate } from "@/utils/GlobalHelpers"; 
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts"; 

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type PropsType = {
  className?: string;
};

export function EmailDomainChart({className}: PropsType) {
    const [formattedData, setFormattedData] = useState<{
        domains: string[]; // Array of domain strings
        activityCounts: number[]; // Array of activity counts (numbers)
      }>({ domains: [], activityCounts: [] });
  const uploadedFiles = useSelector((state: RootState) => state.csv.data);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const data = getEmailDomainData(uploadedFiles); 
      const test = getActivityDataByDate(uploadedFiles)
      console.log("t2", test)
      const domains = data.map((item) => item.domain); // Extract domains
      const activityCounts = data.map((item) => item.count); // Extract activity counts

      setFormattedData({ domains, activityCounts }); 
      
    }
  }, [uploadedFiles]);

  const options: ApexOptions = {
    chart: {
      type: "bar", // Ensuring chart type is "bar"
      height: 350,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    colors: ["#5750F1"], // Set the bar color to your preference
    plotOptions: {
      bar: {
        columnWidth: "55%",
        borderRadius: 8, // Use borderRadius for rounded bars
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
      categories: formattedData.domains, // Email domains on the x-axis
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Activity Count", // Label for the y-axis
      },
      tickAmount: 5, // Control the number of ticks on the y-axis
      min: 0, // Start at 0
      max: Math.max(...formattedData.activityCounts) + 20, // Max value for y-axis based on the max count value
      labels: {
        formatter: function (value: number) {
          return `${value}`; // Format the y-axis labels as numbers
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      marker: {
        show: true,
      },
    },
  };

  return (
    <div className={cn("rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">Email Domains Activity</h2>
      </div>

      <Chart
        options={options}
        series={[{ name: "Activities", data: formattedData.activityCounts }]}
        type="bar" // Ensure the chart type is correctly specified
        height={350}
      />
    </div>
  );
}
