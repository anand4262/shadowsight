"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/Store"; // Correctly import RootState
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getActivityDataByDate } from "@/utils/GlobalHelpers"; // New helper function for processing activity data
import { ApexOptions } from "apexcharts";

// Dynamically import the ApexChart component to prevent SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function ActivityOverviewChart() {
  const uploadedFiles = useSelector((state: RootState) => state.csv.data); // Get uploaded files from Redux
  const [formattedData, setFormattedData] = useState<{
    dates: string[];
    emailCounts: number[];
    usbCounts: number[];
    cloudCounts: number[];
  }>({
    dates: [],
    emailCounts: [],
    usbCounts: [],
    cloudCounts: [],
  });

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const data = getActivityDataByDate(uploadedFiles); // Get the processed activity data
      const dates = data.map((item) => item.date); // Extract dates
      const emailCounts = data.map((item) => item.emailCount); // Extract email counts
      const usbCounts = data.map((item) => item.usbCount); // Extract usb counts
      const cloudCounts = data.map((item) => item.cloudCount); // Extract cloud counts

      setFormattedData({ dates, emailCounts, usbCounts, cloudCounts }); // Update state
    }
  }, [uploadedFiles]);

  // ApexChart options
  const options: ApexOptions = {
    chart: {
      type: "line", // Line chart to represent the data over time
      height: 350,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    colors: ["#5750F1", "#FF5733", "#0ABEF9"], // Set line colors for Email, USB, Cloud
    stroke: {
      width: 2,
      curve: "smooth",
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
      categories: formattedData.dates, // Dates for the x-axis
      title: {
        text: "Date",
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },
    yaxis: {
      title: {
        text: "Activity Count",
      },
      min: 0,
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
    <div className="rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">Activity Overview</h2>
      </div>

      <Chart
        options={options}
        series={[
          { name: "Email Activity", data: formattedData.emailCounts },
          { name: "USB Activity", data: formattedData.usbCounts },
          { name: "Cloud Activity", data: formattedData.cloudCounts },
        ]}
        type="line"
        height={350}
      />
    </div>
  );
}
