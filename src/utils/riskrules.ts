export type RiskInput = {
  riskScore: number;
  integration?: string;
};

export type RiskSuggestion = {
  message: string;
  severity: "low" | "medium" | "high";
  action: string;
};

/**
 * Rule-based risk evaluation for ML suggestions.
 * Currently uses `riskScore` and `integration` fields only.
 */
export function evaluateRisk(input: RiskInput): RiskSuggestion | null {
  const { riskScore, integration } = input;

  console.log("Evaluating risk for input:", input); // ✅ DEBUG LOG

  if (riskScore > 1800 && integration === "si-usb") {
    return {
      message: "High-risk USB data transfer detected.",
      severity: "high",
      action: "Investigate USB usage and restrict external drives."
    };
  }

  if (riskScore > 1500 && integration === "si-email") {
    return {
      message: "Suspicious email activity with elevated risk.",
      severity: "medium",
      action: "Review recent email communications for data leaks."
    };
  }

  if (riskScore > 1000 && integration === "si-cloud") {
    return {
      message: "Unusual cloud upload behavior.",
      severity: "medium",
      action: "Check cloud activity logs and tighten sharing permissions."
    };
  }

  return null; // No rules matched
}
