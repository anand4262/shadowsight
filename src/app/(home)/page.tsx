"use client";
import { evaluateRisk } from "@/utils/riskrules";
import { SuggestionCard } from "@/components/suggestioncard";
import { Suspense, useRef } from "react";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { EmailDomainChart } from "@/components/Charts/EmailDomains";
import { ActivityOverviewChart } from "@/components/Charts/ActivityOverviewChart";
import RiskScoreBarChart from "@/components/Charts/RiskDistribution";
import DataLeakageByDate from "@/components/Charts/DataLeakageByDate";
import ManagerOutcomeDistribution from "@/components/Charts/ManagerOutcomeDistribution";
import ActivityByHourChart from "@/components/Charts/ActivityByHourChart";
import MultiSelect from "@/components/MultiSelect";
import DataLeakageByUserFiltered from "@/components/Charts/DataLeakageByUserFiltered";
import HighRiskEmployeeChart from "@/components/Charts/HighRiskEmployeeChart";
import SensitiveDataBreachSummaryChart from "@/components/Charts/SensitiveDataBreachSummary";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import DownloadJSONButton from "@/components/DownloadJSONButton";
import DownloadImageButton from "@/components/DownloadImageButton";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export const chartComponentMap: Record<
  string,
  React.FC<{ [key: string]: any }>
> = {
  emailDomainActivity: EmailDomainChart,
  activityCountByRiskScore: RiskScoreBarChart,
  activityOverview: ActivityOverviewChart,
  dataLeakageByDate: DataLeakageByDate,
  managerOutcomeSummary: ManagerOutcomeDistribution,
  activityCountByHour: ActivityByHourChart,
  dataLeakageByUser: DataLeakageByUserFiltered,
  sensitiveDataBreachSummary: SensitiveDataBreachSummaryChart,
};

export default function Home({ searchParams }: PropsType) {
  const selected = useSelector((state: RootState) => state.selected.selected);
  const records = useSelector((state: RootState) => state.csv.data);
  const dashboardRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>{/* Summary cards */}</Suspense>

      <div className="flex justify-end gap-4">
        <DownloadJSONButton />
        <DownloadImageButton targetRef={dashboardRef} />
      </div>

      <h4 className="text-heading-5 font-bold text-dark dark:text-white">
        Select Graphs
      </h4>
      <MultiSelect />

      {/* Chart Area */}
      <div
        ref={dashboardRef}
        className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5"
      >
        {selected.map((select) => {
          const ChartComponent = chartComponentMap[select.value];
          return ChartComponent ? (
            <motion.div
              key={select.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="col-span-12 xl:col-span-6"
            >
              <ChartComponent />
            </motion.div>
          ) : (
            <div className="col-span-12">Nothing is selected</div>
          );
        })}
      </div>

      {/* Suggestions Section */}
      <h2 className="text-xl font-semibold mb-4">ML-Based Suggestions</h2>
{records.slice(0, 10).map((record: any, idx: number) => {
  // ✅ Fix: Check multiple casing possibilities
  const riskScore = record.riskScore ?? record.riskscore ?? 0;
  const integration = record.integration ?? "unknown";
  const activityType = record.activityType ?? record.activitytype ?? "unknown";

  // ✅ Log to verify values
  console.log("Evaluating risk for input:", { riskScore, integration, activityType });

  const suggestion = evaluateRisk({
    riskScore,
    integration
  });

  return suggestion ? (
    <SuggestionCard
  key={idx}
  suggestion={suggestion}
  recordMeta={{
    user: record.user,
    activityId: record.activityId,
    date: record.date,
  }}
/>

  ) : null;
})}

      <div className="col-span-12 mt-8">
        <h2 className="text-xl font-semibold mb-4">ML-Based Suggestions</h2>
        {records.slice(0, 10).map((record: any, idx: number) => {
          const suggestion = evaluateRisk({
            riskScore: record.riskscore,
            integration: record.integration,
          });

          return suggestion ? (
            <SuggestionCard key={idx} suggestion={suggestion} />
          ) : null;
        })}
      </div>
    </>
  );
}
