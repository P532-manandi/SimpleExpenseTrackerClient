import type { PeriodicSummaryData } from "@/types";

interface YearlySummaryDisplayProps {
  summaryData: PeriodicSummaryData | null;
  isLoading: boolean;
}

export default function YearlySummaryDisplay({
  summaryData,
  isLoading,
}: YearlySummaryDisplayProps) {
  if (isLoading) {
    return <p className="text-center text-gray-500">Loading summary...</p>;
  }
  if (!summaryData) {
    console.log(summaryData);
    return (
      <p className="text-center text-red-500">Could not load summary data.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
      <div>
        <p className="text-sm text-gray-500">Total Income</p>
        <p className="text-2xl font-bold text-green-600">
          {/* Use the new field names, and the fallback with || 0 before toFixed */}
          {summaryData.formattedTotalIncome ||
            `$${(summaryData.income || 0).toFixed(2)}`}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Total Expenses</p>
        <p className="text-2xl font-bold text-red-600">
          {summaryData.formattedTotalExpenses ||
            `$${(summaryData.expenses || 0).toFixed(2)}`}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Net Amount</p>
        <p className="text-2xl font-bold text-blue-600">
          {/* Note: your API returns formattedTotalNet, so we use that */}
          {summaryData.formattedTotalNet ||
            `$${(summaryData.net || 0).toFixed(2)}`}
        </p>
      </div>
    </div>
  );
}
