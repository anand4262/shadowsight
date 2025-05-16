export type SelectOption = {
  value: string;
  label: string;
};

export const options: SelectOption[] = [
 

  {value: 'emailDomainActivity', label: 'Email Domain Activity'},
  {value: 'activityCountByRiskScore', label: 'Activity Count by Risk Score'},
  { value: 'activityOverview', label: 'Activity Overview' },
  { value: 'dataLeakageByDate', label: 'Data Leakage by Date' },
  { value: 'managerOutcomeSummary', label: 'Manager Outcome Summary' },
  { value: 'activityCountByHour', label: 'Activity Count by Hour' },
  { value: 'dataLeakageByUser', label: 'Data Leakage by User' },
  { value: 'sensitiveDataBreachSummary', label: 'PII / PHI / PCI Breaches' }
  
  /* ,
  { value: 'summary-kpi', label: 'Summary Statistics' },
  { value: 'summary-kpi', label: 'Summary Statistics' },
  { value: 'summary-kpi', label: 'Summary Statistics' },
  { value: 'summary-kpi', label: 'Summary Statistics' },
  { value: 'summary-kpi', label: 'Summary Statistics' }, */

];


export const defaultSelected: SelectOption[] = [
  { value: 'dataLeakageByDate', label: 'Data Leakage by Date' },
  { value: 'managerOutcomeSummary', label: 'Manager Outcome Summary' },
  { value: 'activityCountByHour', label: 'Activity Count by Hour' },
  { value: 'dataLeakageByUser', label: 'Data Leakage by User' },
];