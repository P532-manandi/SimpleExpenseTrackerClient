// src/components/AddTransactionModal.tsx
"use client";

import TransactionForm from "./TransactionForm";
import type { TransactionInput, CategoryListData } from "@/types";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void; // To refresh data after successful submission
  categories: CategoryListData | null;
  isLoadingCategories: boolean;
}
import { addTransaction } from "@/lib/api";
export default function AddTransactionModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  categories,
  isLoadingCategories,
}: AddTransactionModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (transaction: TransactionInput) => {
    try {
      // Call your API function from lib/api.ts

      await addTransaction(transaction);
      alert("Transaction added successfully!"); // Replace with better notification
      onSubmitSuccess(); // Call to refresh data and close modal
    } catch (error) {
      console.error("Failed to add transaction:", error);
      alert(
        `Error: ${(error as Error).message || "Failed to add transaction."}`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Transaction
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>
        <TransactionForm
          onSubmit={handleSubmit}
          categories={categories}
          isLoadingCategories={isLoadingCategories}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
