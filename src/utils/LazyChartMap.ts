// utils/LazyChartMap.ts
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export type ChartKey =
  | "emailDomainActivity"
  | "activityCountByRiskScore"
  | "activityOverview"
  | "dataLeakageByDate"
  | "managerOutcomeSummary"
  | "activityCountByHour"
  | "dataLeakageByUser"
  | "sensitiveDataBreachSummary";

export const LazyChartMap: Record<ChartKey, ComponentType> = {
  emailDomainActivity: dynamic(() => import("@/components/Charts/EmailDomains")),
  activityCountByRiskScore: dynamic(() => import("@/components/Charts/RiskDistribution")),
  activityOverview: dynamic(() => import("@/components/Charts/ActivityOverviewChart")),
  dataLeakageByDate: dynamic(() => import("@/components/Charts/DataLeakageByDate")),
  managerOutcomeSummary: dynamic(() => import("@/components/Charts/ManagerOutcomeDistribution")),
  activityCountByHour: dynamic(() => import("@/components/Charts/ActivityByHourChart")),
  dataLeakageByUser: dynamic(() => import("@/components/Charts/DataLeakageByUserFiltered")),
  sensitiveDataBreachSummary: dynamic(() => import("@/components/Charts/SensitiveDataBreachSummary")),
};
