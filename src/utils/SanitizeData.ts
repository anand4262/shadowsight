
interface PoliciesBreached {
    dataLeakage?: string[];
    pii?: string[];
    sensitive?: string[];
  }
  
  interface Values {
    destinations?: string[];
    cloudProvider?: string;
  }
  
  interface CSVRecord {
    activityId: string;
    user: string;
    date: string;
    time: string;
    riskScore: number;
    integration: string;
    policiesBreached: PoliciesBreached;
    values: Values;
    status: string;
    managerAction: string;
    dataVolumeMB: number;  
  }
  
  // Async data sanitization function
  export const sanitizeDataAsync = async (data: CSVRecord[]): Promise<CSVRecord[]> => {
    try {
      // Check if the data is an array and is not empty
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid or empty data");
      }
  
      // Process the data (trimming, filling missing values, etc.)
      const cleanedData = await Promise.all(data.map(async (record: CSVRecord) => {
        // Calculate risk score first (you only calculate once)
        const calculatedRiskScore = calculateRiskScore(record);
  
        return {
          ...record,
          // Trimming whitespace from string fields
          user: (record.user || '').trim(),
          integration: (record.integration || '').trim(),
          date: formatDate(record.date),
          time: (record.time || '').trim(),
          // Filling missing values
          policiesBreached: record.policiesBreached || {},
          values: record.values || {},
          managerAction: record.managerAction || 'Unknown',
          // Validating numeric fields
          riskScore: await validateNumber(calculatedRiskScore),  
          dataVolumeMB: await validateNumber(record.dataVolumeMB), // Validate dataVolumeMB
        };
      }));
  
      // Return the cleaned data once processing is complete
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
  
  // Date format conversion from DD/MM/YYYY to YYYY-MM-DD
  const formatDate = (date: string): string => {
    if (!date) return '';
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };
  
  // Validating that the value is a number, and returning 0 if it's invalid
  const validateNumber = async (value: number): Promise<number> => {
    return isNaN(value) ? 0 : value;
  };
  
  // Risk score calculation based on rules
  const calculateRiskScore = (activity: CSVRecord): number => {
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
  const inputData: CSVRecord[] = [
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
  
  // Calling the async function and handling the sanitized data
 /*  const handleSanitizedData = async () => {
    const sanitizedData = await sanitizeDataAsync(inputData);
  
    if (sanitizedData.length === 0) {
      console.log("Data sanitization failed or there was an error.");
    } else {
      console.log("Sanitized data:", sanitizedData);
    }
  };
  
  // Call the sanitization function
  handleSanitizedData(); */
  