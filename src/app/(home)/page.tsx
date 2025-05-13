"use client"
import { Suspense} from "react";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import {EmailDomainChart} from "@/components/Charts/EmailDomains"
import { ActivityOverviewChart } from '@/components/Charts/ActivityOverviewChart';
import RiskScoreBarChart from "@/components/Charts/RiskDistribution"
import DataLeakageByDate from "@/components/Charts/DataLeakageByDate"
import MultiSelect from "@/components/MultiSelect"

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};


export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  //const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  //const CSVRecords = useSelector((state: RootState) => state.csv.data);
  //const uploadedFiles = useSelector((state: RootState) => state.csv.data);
  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        {/* <OverviewCardsGroup /> */}
        <h4 className="{text-heading-5 font-bold text-dark dark:text-white}">Select Graphs</h4>
        <MultiSelect />
      </Suspense>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        
      <EmailDomainChart className="col-span-12 xl:col-span-6" />
      <RiskScoreBarChart  className="col-span-12 xl:col-span-6"/>
      <ActivityOverviewChart   className="col-span-12 xl:col-span-6"/>
      <DataLeakageByDate className="col-span-12 xl:col-span-6"/>
        <div className="col-span-12 grid xl:col-span-8">
          
        </div>
      </div>
    </>
  );
}
