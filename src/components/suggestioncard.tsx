type SuggestionCardProps = {
  suggestion: RiskSuggestion;
  recordMeta: {
    user?: string;
    activityId?: string;
    date?: string;
  };
};

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, recordMeta }) => {
  const { message, severity, action } = suggestion;
  const bgColor =
    severity === "high"
      ? "bg-red-100 border-l-4 border-red-500"
      : severity === "medium"
      ? "bg-yellow-100 border-l-4 border-yellow-500"
      : "bg-green-100 border-l-4 border-green-500";

  return (
    <div className={`p-4 mb-4 rounded shadow-sm ${bgColor}`}>
      <p className="font-bold">{message}</p>
      <p className="text-sm text-gray-700">Recommended Action: {action}</p>
      <div className="text-xs text-gray-600 mt-2">
        {recordMeta.user && <div><strong>User:</strong> {recordMeta.user}</div>}
        {recordMeta.activityId && <div><strong>Activity ID:</strong> {recordMeta.activityId}</div>}
        {recordMeta.date && <div><strong>Date:</strong> {recordMeta.date}</div>}
      </div>
    </div>
  );
};
