export type SelectOption = {
    value: string;
    label: string;
  };

export const options: SelectOption[] = [
    { value: 'top-users', label: 'Top Users by Risk Score or Volume' },
    { value: 'activity-over-time', label: 'User Activity Over Time' },
    { value: 'time-vs-type', label: 'Time vs. Activity Type' },
    { value: 'summary-kpi', label: 'Summary Statistics' }
  ];
  
  export const defaultSelected: SelectOption[] = [
    { value: 'top-users', label: 'Top Users by Risk Score or Volume' },
    { value: 'activity-over-time', label: 'User Activity Over Time' }
  ];