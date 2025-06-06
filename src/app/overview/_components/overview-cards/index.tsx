import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "@/app/(home)/fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { useFetchProcessedData } from '@/utils/GlobalHelpers';

export async function OverviewCardsGroup() {
 const flatData = useFetchProcessedData();
 console.log()
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Records"
        value={flatData.totalRecords}
        Icon={icons.TotalRecords}
      />

      <OverviewCard
        label="Unique Users"
        value={flatData.uniqueUsers}
        Icon={icons.Users}
      />

      <OverviewCard
        label="Highest Risk Score"
        value={flatData.highestRiskScore}
        Icon={icons.HighestRisk}
      />

      <OverviewCard
        label="Lowest Risk Score"
        value={flatData.lowestRiskScore}
        Icon={icons.RiskScore}
      />

      <OverviewCard
        label="Average Risk Score"
        value={flatData.avgRiskScore}
        Icon={icons.AvgScore}
      />
    </div>
  );
}
