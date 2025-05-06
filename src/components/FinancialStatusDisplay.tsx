// src/components/FinancialStatusDisplay.tsx

interface FinancialStatusDisplayProps {
  status: string | null;
  isLoading: boolean;
}

export default function FinancialStatusDisplay({
  status,
  isLoading,
}: FinancialStatusDisplayProps) {
  const getPillClasses = (statusDescription?: string | null): string => {
    // Base classes for all pills: padding, text size, rounded corners, inline display
    const basePillClasses =
      "px-3 py-1 text-xs font-semibold rounded-full inline-block shadow-sm";

    if (!statusDescription) {
      return `${basePillClasses} bg-gray-200 text-gray-700`; // Default for unknown/error status
    }

    // Conditional classes based on status content
    if (statusDescription.includes("Positive")) {
      return `${basePillClasses} bg-green-100 text-green-800 border border-green-300`;
    }
    if (statusDescription.includes("Negative")) {
      return `${basePillClasses} bg-red-100 text-red-800 border border-red-300`;
    }
    if (statusDescription.includes("Zero")) {
      return `${basePillClasses} bg-yellow-100 text-yellow-800 border border-yellow-300`; // Using yellow for zero/neutral
    }

    return `${basePillClasses} bg-gray-200 text-gray-700 border border-gray-300`;
  };

  if (isLoading) {
    return (
      <p className="text-sm text-gray-500 animate-pulse">Loading status...</p>
    );
  }

  if (!status) {
    return null;
  }

  return <span className={getPillClasses(status)}>{status}</span>;
}
