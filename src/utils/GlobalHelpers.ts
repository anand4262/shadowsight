export const processData = (data: any[]) => {
    const processed = data.reduce((acc, record) => {
      acc[record.integration] = (acc[record.integration] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  
    return processed;
  };


 // utils/GlobalHelpers.ts

 export const getEmailDomainData = (uploadedFiles: any[]) => {
  const emailDomainCounts: { [key: string]: number } = {};

  uploadedFiles.forEach((file) => {
    const values = JSON.parse(file.values)
    const destinations = values?.destinations;
    if (Array.isArray(destinations)) {
      destinations.forEach((email: string) => {
        const domain = email.split('@')[1]; // Extract domain from email

        if (domain) {
          emailDomainCounts[domain] = (emailDomainCounts[domain] || 0) + 1;
        }
      });
    }
  });

  return Object.keys(emailDomainCounts).map((domain) => ({
    domain,
    count: emailDomainCounts[domain],
  }));
};

export const getActivityDataByDate = (uploadedFiles: any[]) => {
  const dateCounts: { [key: string]: { emailCount: number; usbCount: number; cloudCount: number } } = {};

  uploadedFiles.forEach((file) => {
    let { date, integration } = file;
    date = new Date(date);

 date = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

    if (!date) return;

    if (!dateCounts[date]) {
      dateCounts[date] = {
        emailCount: 0,
        usbCount: 0,
        cloudCount: 0,
      };
    }
    if (integration === "si-email") {
      dateCounts[date].emailCount++;
    } else if (integration === "si-usb") {
      dateCounts[date].usbCount++;
    } else if (integration === "si-cloud") {
      dateCounts[date].cloudCount++;
    }
  });

  return Object.keys(dateCounts).map((date) => ({
    date,
    emailCount: dateCounts[date].emailCount,
    usbCount: dateCounts[date].usbCount,
    cloudCount: dateCounts[date].cloudCount,
  }));
};


  

export const getActivityCountByRiskRange = (
  data: { activityId: string; riskScore: number }[],
  customRanges: number[] = [0, 500, 1000, 1500, 2000, 2500, 3000]
) => {
  const labels = customRanges.slice(1).map((end, i) => `${customRanges[i]}–${end}`);
  const counts = new Array(labels.length).fill(0);
  const bins: Set<string>[] = counts.map(() => new Set());

  for (const row of data) {
    const score = row.riskScore;
    const id = row.activityId;

    // Proper inclusive binning
    const idx = customRanges.findIndex(
      (start, i) =>
        i < customRanges.length - 1 &&
        score >= start &&
        score <= customRanges[i + 1]
    );

    if (idx !== -1) {
      bins[idx].add(id);
    }
  }

  const finalCounts = bins.map(set => set.size);

  return {
    categories: labels,
    seriesData: finalCounts
  };
};

/* export const getDataLeakageByDate = (
  data: any[]
): { categories: string[]; seriesData: number[] } => {
  const counts: Record<string, number> = {};
  for (const row of data) {
   const rowPolicyData = JSON.parse(row.policiesBreached)
    const breaches = rowPolicyData?.dataLeakage;
    if (Array.isArray(breaches) && breaches.length > 0) {
      //const date = new Date(row.date).toISOString().split('T')[0]; // YYYY-MM-DD
      const dateObj = new Date(row.date);
      const date = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;

      counts[date] = (counts[date] || 0) + 1;
    }
  }

  const categories = Object.keys(counts).sort(); // sorted by date
  const seriesData = categories.map((date) => counts[date]);

  return { categories, seriesData };
}; */

export const getDataLeakageByDate = (
  data: any[]
): { categories: string[]; seriesData: number[] } => {
  const counts: Record<string, number> = {};

  for (const row of data) {
    try {
      const rowPolicyData = JSON.parse(row.policiesBreached);
      const breaches = rowPolicyData?.dataLeakage;

      if (Array.isArray(breaches) && breaches.length > 0) {
        const rawDate = row.date;
        const dateObj = new Date(rawDate);

        // Skip invalid or missing dates
        if (!rawDate || isNaN(dateObj.getTime())) continue;

        // Format date as dd/mm/yyyy
        const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(
          dateObj.getMonth() + 1
        ).padStart(2, '0')}/${dateObj.getFullYear()}`;

        counts[formattedDate] = (counts[formattedDate] || 0) + 1;
      }
    } catch (err) {
      console.warn('Skipping invalid policiesBreached JSON:', row.policiesBreached);
      continue;
    }
  }

  // Sort dd/mm/yyyy chronologically
  const categories = Object.keys(counts).sort((a, b) => {
    const [ad, am, ay] = a.split('/').map(Number);
    const [bd, bm, by] = b.split('/').map(Number);
    return new Date(ay, am - 1, ad).getTime() - new Date(by, bm - 1, bd).getTime();
  });

  const seriesData = categories.map((date) => counts[date]);

  return { categories, seriesData };
};

