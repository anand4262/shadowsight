
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
    const destinations = file.values?.destinations;
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

/* export const getDataLeakageByDate = (
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
}; */

export const getDataLeakageByDate = (
  data: any[]
): { categories: string[]; seriesData: number[] } => {
  const counts: Record<string, number> = {};

  for (const row of data) {
    try {
      const breaches = row.policiesBreached?.dataLeakage;

      if (Array.isArray(breaches) && breaches.length > 0) {
        const rawDate = row.date;
        const dateObj = new Date(rawDate);

        if (!rawDate || isNaN(dateObj.getTime())) continue;

        // Format as dd/mm/yyyy
        const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(
          dateObj.getMonth() + 1
        ).padStart(2, '0')}/${dateObj.getFullYear()}`;

        counts[formattedDate] = (counts[formattedDate] || 0) + 1;
      }
    } catch (err) {
      console.warn('Invalid JSON in policiesBreached:', row.policiesBreached);
      continue;
    }
  }

  const categories = Object.keys(counts).sort((a, b) => {
    const [ad, am, ay] = a.split('/').map(Number);
    const [bd, bm, by] = b.split('/').map(Number);
    return new Date(ay, am - 1, ad).getTime() - new Date(by, bm - 1, bd).getTime();
  });

  const seriesData = categories.map(date => counts[date]);

  return { categories, seriesData };
};


export const getManagerOutcomeDistribution = (data: any[]) => {
  const counts: Record<string, number> = {
    knownGoodActivity: 0,
    employeeCounselled: 0,
    escalated: 0,
    unknown: 0,
  };

  for (const row of data) {
    const action = typeof row.managerAction === 'string'
      ? row.managerAction.trim().toLowerCase()
      : '';

    switch (action) {
      case 'knowngoodactivity':
        counts.knownGoodActivity++;
        break;
      case 'employeecounselled':
        counts.employeeCounselled++;
        break;
      case 'escalated':
        counts.escalated++;
        break;
      default:
        counts.unknown++;
        break;
    }
  }

  const labels = [
    'Known Good Activity',
    'Employee Counselled',
    'Escalated',
    'Unknown'
  ];

  const series = [
    counts.knownGoodActivity,
    counts.employeeCounselled,
    counts.escalated,
    counts.unknown
  ];

  return { labels, series };
};

export const getTimeOfDayDistribution = (data: any[]) => {
  const counts = new Array(24).fill(0);

  for (const row of data) {
    const timeStr = row.time;
    if (!timeStr) continue;

    const [hourStr] = timeStr.split(':');
    const hour = parseInt(hourStr, 10);

    if (!isNaN(hour) && hour >= 0 && hour <= 23) {
      counts[hour]++;
    }
  }

  const labels = Array.from({ length: 24 }, (_, i) => {
    const hour12 = i % 12 === 0 ? 12 : i % 12;
    const suffix = i < 12 ? 'AM' : 'PM';
    return `${hour12} ${suffix}`;
  });

  return {
    labels,       // Use in chart x-axis
    series: counts // Use as data
  };
};

export const getDataLeakageByUserFiltered = (data: any[]) => {
  const counts: Record<string, number> = {};

  for (const row of data) {
    const user = row.user;
    const policy = row.policiesBreached;

    const isLeaked =
      policy?.dataLeakage &&
      Array.isArray(policy.dataLeakage) &&
      policy.dataLeakage.length > 0;

    if (user && isLeaked) {
      counts[user] = (counts[user] || 0) + 1;
    }
  }

  // Filter users with >10 incidents
  const filtered = Object.entries(counts)
    .filter(([_, count]) => count > 3)
    .sort((a, b) => b[1] - a[1]); // Sort descending

  const labels = filtered.map(([user]) => user);
  const series = filtered.map(([_, count]) => count);

  return { labels, series };
};

export const getHighRiskPolicyMatrix = (data: any[]) => {
  const result: Record<string, { enhanced: number; pip: number; productivity: number }> = {};

  for (const row of data) {
    const user = row.user;
    const riskScore = row.riskScore;

    if (!user || riskScore < 1000) continue;

    // Handle stringified JSON or object
    let policy: any = {};
    try {
      policy = typeof row.policiesBreached === 'string'
        ? JSON.parse(row.policiesBreached)
        : row.policiesBreached;
    } catch (e) {
      continue; // skip if invalid
    }

    const enhanced = Array.isArray(policy.EnhancedMonitoring) ? policy.EnhancedMonitoring.length : 0;
    const pip = Array.isArray(policy.PerformanceImprovementPlan) ? policy.PerformanceImprovementPlan.length : 0;
    const productivity = Array.isArray(policy.ProductivityMonitored) ? policy.ProductivityMonitored.length : 0;

    if (!result[user]) {
      result[user] = { enhanced, pip, productivity };
    } else {
      result[user].enhanced += enhanced;
      result[user].pip += pip;
      result[user].productivity += productivity;
    }
  }

  return Object.entries(result).map(([user, values]) => ({
    user,
    ...values,
  }));
};

export const getSensitiveDataBreachSummary = (data: any[]) => {
  let piiCount = 0;
  let phiCount = 0;
  let pciCount = 0;

  for (const row of data) {
    const policies = row.policiesBreached;

    if (policies?.pii && Array.isArray(policies.pii) && policies.pii.length > 0) {
      piiCount++;
    }
    if (policies?.phi && Array.isArray(policies.phi) && policies.phi.length > 0) {
      phiCount++;
    }
    if (policies?.pci && Array.isArray(policies.pci) && policies.pci.length > 0) {
      pciCount++;
    }
  }

  return {
    categories: ['PII', 'PHI', 'PCI'],
    seriesData: [piiCount, phiCount, pciCount]
  };
};

import { getKMeansLabels } from './MLHelps';

export const enrichAndClusterRecords = (records: any[]) => {
  // Step 1: Enrich records
  const enriched = records.map((row) => ({
    ...row,
    emailCount: row.emailCount ?? 0,
    usbCount: row.usbCount ?? 0,
    cloudCount: row.cloudCount ?? 0,
    riskScore: row.riskScore ?? 0,
  }));

  // Step 2: Apply KMeans clustering
  const clusterLabels = getKMeansLabels(enriched);

  // Step 3: Merge cluster label into each record
  return enriched.map((row, idx) => ({
    ...row,
    cluster: clusterLabels[idx],
  }));
};

