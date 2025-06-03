"use client"
import { Suspense, useRef, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import {EmailDomainChart} from "@/components/Charts/EmailDomains"
import { ActivityOverviewChart } from '@/components/Charts/ActivityOverviewChart';
import RiskScoreBarChart from "@/components/Charts/RiskDistribution"
import DataLeakageByDate from "@/components/Charts/DataLeakageByDate"
import ManagerOutcomeDistribution from "@/components/Charts/ManagerOutcomeDistribution"
import ActivityByHourChart from "@/components/Charts/ActivityByHourChart"
import MultiSelect from "@/components/MultiSelect"
import DataLeakageByUserFiltered from "@/components/Charts/DataLeakageByUserFiltered"
import HighRiskEmployeeChart from "@/components/Charts/HighRiskEmployeeChart"
import SensitiveDataBreachSummaryChart from "@/components/Charts/SensitiveDataBreachSummary"
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux'; 
import { RootState } from '@/store/Store';
import DownloadJSONButton from "@/components/DownloadJSONButton"
import DownloadImageButton from "@/components/DownloadImageButton"
import {useTotalCSVRecordCount} from "@/utils/GlobalHelpers"

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

 const ChartComponentMap: Record<string, React.FC<{ /* data: CSVRecord[]; */ [key: string]: any }>> = {
  emailDomainActivity: EmailDomainChart,
  activityCountByRiskScore: RiskScoreBarChart,
  activityOverview: ActivityOverviewChart,
  dataLeakageByDate: DataLeakageByDate,
  managerOutcomeSummary: ManagerOutcomeDistribution,
  activityCountByHour: ActivityByHourChart,
  dataLeakageByUser: DataLeakageByUserFiltered,
  sensitiveDataBreachSummary: SensitiveDataBreachSummaryChart
};


export default  function Home({ searchParams }: PropsType) {
  //const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  const [isClientReady, setIsClientReady] = useState(false);
  const router = useRouter();
  const CSVRecords = useSelector((state: RootState) => state.csv.data);
  const selected = useSelector((state: RootState) => state.selected.selected);
  const dashboardRef = useRef<HTMLDivElement | null>(null);
   const totalRecords = useTotalCSVRecordCount(); 

useEffect(() => {
    // Prevent flicker: block render until we check data
    if (totalRecords === 0) {
      router.replace("/upload");
    } else {
      setIsClientReady(true);
    }
  }, [CSVRecords, router]);

  if (!isClientReady) {
    // Prevent any UI from showing while deciding
    return null;
  }

   const ChartComponentMap: Record<string, React.FC<{ /* data: CSVRecord[]; */ [key: string]: any }>> = {
  emailDomainActivity: EmailDomainChart,
  activityCountByRiskScore: RiskScoreBarChart,
  activityOverview: ActivityOverviewChart,
  dataLeakageByDate: DataLeakageByDate,
  managerOutcomeSummary: ManagerOutcomeDistribution,
  activityCountByHour: ActivityByHourChart,
  dataLeakageByUser: DataLeakageByUserFiltered,
  sensitiveDataBreachSummary: SensitiveDataBreachSummaryChart
};

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        {/* <OverviewCardsGroup /> */}
       
      </Suspense>
      <div className="flex justify-end gap-4">
        <DownloadJSONButton />
        <DownloadImageButton targetRef={dashboardRef} />
      </div>
      <h4 className="{text-heading-5 font-bold text-dark dark:text-white}">Select Graphs</h4>
      <MultiSelect />
      
      <div ref={dashboardRef} className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
     
        {selected.map((select) => {
          const ChartComponent = ChartComponentMap[select.value];
          return ChartComponent ? (
            <motion.div
            key={select.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="col-span-12 xl:col-span-12"
          >
              <ChartComponent   />
          </motion.div>
              
          ) : <div className="col-span-12">Nothing is selected</div>;
        })}
      {/* <HighRiskEmployeeChart /> */}
        <div className="col-span-12 grid xl:col-span-8">
          
        </div>
      </div>
    </>
  );
}
