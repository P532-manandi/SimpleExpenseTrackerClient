// src/components/TransactionList.tsx
import type { TransactionOutput } from "@/types";

interface TransactionListProps {
  transactions: TransactionOutput[];
  isLoading: boolean;
}

export default function TransactionList({
  transactions,
  isLoading,
}: TransactionListProps) {
  if (isLoading) {
    return <p className="text-center text-gray-500">Loading transactions...</p>;
  }
  if (!transactions || transactions.length === 0) {
    return <p className="text-center text-gray-500">No transactions found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {tx.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {tx.description || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {tx.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {tx.type}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                  tx.type === "INCOME" ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.type === "INCOME" ? "+" : "-"}${tx.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
