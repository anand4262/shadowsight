import { getKMeansLabels } from "./MLHelps";
import { CSVRecord } from "@/store/types/CSVTypes";

export interface MLAnnotatedRecord extends CSVRecord {
  cluster: number;
  mlComment: string;
}

export function enhanceWithML(data: CSVRecord[]): MLAnnotatedRecord[] {
  if (!Array.isArray(data) || data.length === 0) return [];

  const clusterLabels = getKMeansLabels(data);

  return data.map((row, index) => {
    const cluster = clusterLabels[index];

    let mlComment = "";
    if (cluster === 2) {
      mlComment = "ML: Detected outlier pattern (cluster 2).";
    } else if (cluster === 1) {
      mlComment = "ML: Moderate activity cluster.";
    } else {
      mlComment = "ML: Typical user behavior.";
    }

    return {
      ...row,
      cluster,
      mlComment,
    };
  });
}
