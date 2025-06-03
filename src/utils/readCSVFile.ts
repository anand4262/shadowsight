import Papa from 'papaparse';

const readCSVFile = async (file: File): Promise<any> => {
  const sizeInMB = file.size / (1024 * 1024);

  return new Promise((resolve, reject) => {
    if (sizeInMB <= 2) {
      // Small file - parse all at once
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (result) => {
          console.log("Parsed Small File:", result.data);
          resolve(result.data);
        },
        error: (error) => reject(error),
      });
    } else {
      // Large file - parse row-by-row
      const parsedData: any[] = [];

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        step: (row) => {
          parsedData.push(row.data);
        },
        complete: () => {
          console.log("Parsed Large File:", parsedData);
          resolve(parsedData);
        },
        error: (error) => reject(error),
      });
    }
  });
};

export default readCSVFile;
