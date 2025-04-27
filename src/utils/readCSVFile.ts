import Papa from 'papaparse';

const readCSVFile = async (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (result) => {
        console.log("Parsed Data:", result.data);
        resolve(result.data);  // Resolve promise with parsed data
      },
      error: (error) => {
        reject(error);  // Reject the promise if parsing fails
      },
      header: true,  // Assuming CSV has headers
      skipEmptyLines: true,  // Skip empty lines
      dynamicTyping: true,  // Automatically convert numeric values
    });
  });
};


export default readCSVFile