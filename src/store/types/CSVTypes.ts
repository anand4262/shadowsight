export interface CSVRecord {
    activityId: string;
    user: string;
    date: string;
    time: string;
    riskScore: number;
    integration: string;
    policiesBreached: {
      dataLeakage?: string[];
      pii?: string[];
      sensitive?: string[];
    };
    values: {
      destinations?: string[];
      cloudProvider?: string;
      device?: string;
    };
    status: 'underReview' | 'trusted' | 'nonConcern' | 'concern';
    managerAction?: string;
  }
  
  export interface CSVState {
    data: CSVRecord[]; 
    isLoading: boolean;
    error: string | null;
    processedData: { [key: string]: number };
  }
  