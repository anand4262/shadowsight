import { CSVRecord } from "@/store/types/CSVTypes";

interface ExtendedCSVRecord extends CSVRecord {
  dataVolumeMB: number;
}

// Async data sanitization function
export const sanitizeDataAsync = async (
  data: ExtendedCSVRecord[]
): Promise<ExtendedCSVRecord[]> => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid or empty data");
    }

    const cleanedData: ExtendedCSVRecord[] = await Promise.all(
      data.map(async (record: ExtendedCSVRecord) => {
        const calculatedRiskScore = calculateRiskScore(record);
        const rowPolicyData =
          typeof record.policiesBreached === "string"
            ? JSON.parse(record.policiesBreached)
            : record.policiesBreached;
        const rawValues =
          typeof record.values === "string"
            ? JSON.parse(record.values)
            : record.values;

        return {
          ...record,
          user: (record.user || "").trim(),
          integration: (record.integration || "").trim(),
          date: formatDate(record.date),
          time: (record.time || "").trim(),
          policiesBreached: rowPolicyData || {},
          values: rawValues || {},
          managerAction: record.managerAction || "Unknown",
          riskScore: await validateNumber(calculatedRiskScore),
          dataVolumeMB: await validateNumber(record.dataVolumeMB),
        };
      }));
      return cleanedData;
    } catch (error: unknown) {
        // Ensure that error is an instance of Error before accessing .message
        if (error instanceof Error) {
          console.error('Error during data sanitization:', error.message);
        } else {
          console.error('An unknown error occurred during data sanitization');
        }
        return [];  // Return an empty dataset in case of an error
      }
  };
  
  const formatDate = (date: string): string => {
    if (!date) return '';
    
    // If the date is in DD/MM/YYYY format
    const dateParts = date.split('/');
    
    if (dateParts.length === 3) {
      const [day, month, year] = dateParts;
      
      // Convert to a valid date string (ISO format) YYYY-MM-DD
      const validDateString = `${year}-${month}-${day}`;
      const parsedDate = new Date(validDateString);
  
      // Check if the parsed date is valid
      if (isNaN(parsedDate.getTime())) {
        return '';  // Return empty if the date is invalid
      }
  
      // Return the ISO string format
      return parsedDate.toISOString();
    }
  
    // If it's not in DD/MM/YYYY format, attempt to parse it directly (e.g., for YYYY-MM-DD)
    const parsedDate = new Date(date);
    
    if (isNaN(parsedDate.getTime())) {
      return '';  // Return empty string if invalid
    }
  
    // Return the ISO string format
    return parsedDate.toISOString();
  };
  

  
  // Validating that the value is a number, and returning 0 if it's invalid
  const validateNumber = async (value: number): Promise<number> => {
    return isNaN(value) ? 0 : value;
  };
  
  // Risk score calculation based on rules
  const calculateRiskScore = (activity: ExtendedCSVRecord): number => {
    let score = activity.riskScore;
  
    // Add points if activity type includes "download"
    if (activity.integration && activity.integration.includes('download')) {
      score += 20;
    }
  
    // Add points if data volume exceeds 100MB
    if (activity.dataVolumeMB > 100) {
      score += 30;
    }
  
    // Add points for external file activities (usb, cloud)
    if (['si-usb', 'si-cloud'].includes(activity.integration)) {
      score += 50;
    }
  
    return score;
  };
  
  // Example data for testing
  const inputData: ExtendedCSVRecord[] = [
    {
      activityId: '01JHH7WVXCNK5YE83V5VBTBGEY',
      user: 'jacob.moore@zenith.com',
      date: '13/01/2025',
      time: '17:55',
      riskScore: 580,
      integration: 'si-email',
      policiesBreached: { dataLeakage: ['emailContainedDocuments', 'emailContainedSpreadsheets'] },
      values: { destinations: ['jmoore73@gmail.com'] },
      status: 'underReview',
      managerAction: '',
      dataVolumeMB: 120,  // Sample data for dataVolumeMB
    },
    {
      activityId: '01JHH7WVYSTFZXPSKY3YJ6KKH4',
      user: 'nora.baker@zenith.com',
      date: '13/01/2025',
      time: '17:40',
      riskScore: 1620,
      integration: 'si-cloud',
      policiesBreached: {
        dataLeakage: [
          'cloudUploadContainedDocuments',
          'cloudUploadContainedPDFs',
          'cloudUploadContainedPresentations',
          'cloudUploadContainedZipFiles',
        ],
        pii: ['cloudUploadContainedPII'],
        sensitive: ['cloudUploadContainedConfidentialData'],
      },
      values: { cloudProvider: 'Apple iCloud' },
      status: 'underReview',
      managerAction: '',
      dataVolumeMB: 200,  // Sample data for dataVolumeMB
    },
    // Add more records as necessary
  ];
  

 
