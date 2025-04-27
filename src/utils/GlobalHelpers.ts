export const processData = (data: any[]) => {
    const processed = data.reduce((acc, record) => {
      acc[record.integration] = (acc[record.integration] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  
    return processed;
  };