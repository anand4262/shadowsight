"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import { RootState } from "@/store/Store";
import { useTotalCSVRecordCount } from "@/utils/GlobalHelpers";
import MultiSelect from "@/components/MultiSelect";
import DownloadJSONButton from "@/components/DownloadJSONButton";
import DownloadImageButton from "@/components/DownloadImageButton";
import ChartSkeleton from "@/components/ui/chartSkeleton";
import { LazyChartMap, ChartKey } from "@/utils/lazyChartMap";

export default function Home() {
  const router = useRouter();
  const CSVRecords = useSelector((state: RootState) => state.csv.data);
  const selected = useSelector((state: RootState) => state.selected.selected);
  const totalRecords = useTotalCSVRecordCount();
  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    if (totalRecords === 0) {
      router.replace("/upload");
    } else {
      setIsClientReady(true);
    }
  }, [CSVRecords, router]);

  if (!isClientReady) return null;

  return (
    <>
      <div className="flex justify-end gap-4">
        <DownloadJSONButton />
        <DownloadImageButton targetRef={dashboardRef} />
      </div>

      <h4 className="text-heading-5 font-bold text-dark dark:text-white">Select Graphs</h4>
      <MultiSelect />

      <div
        ref={dashboardRef}
        className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5"
      >
        {selected.map((select) => {
          const key = select.value as ChartKey;
          const ChartComponent = LazyChartMap[key];

          return ChartComponent ? (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="col-span-12 xl:col-span-12"
            >
              <Suspense fallback={<ChartSkeleton />}>
                <ChartComponent />
              </Suspense>
            </motion.div>
          ) : (
            <div key={key} className="col-span-12">
              Nothing is selected
            </div>
          );
        })}
      </div>
    </>
  );
}
