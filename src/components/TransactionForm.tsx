// src/components/TransactionForm.tsx
"use client"; // This component needs client-side interactivity

import { useState, useEffect } from "react";
import type { TransactionInput, CategoryListData } from "@/types";

interface TransactionFormProps {
  onSubmit: (transaction: TransactionInput) => Promise<void>;
  categories: CategoryListData | null;
  isLoadingCategories: boolean;
  onCancel: () => void; // Function to call when cancel button is clicked
}

const initialFormData: TransactionInput = {
  date: new Date().toISOString().split("T")[0], // Defaults to today
  amount: 0,
  type: "EXPENSE",
  category: "",
  description: "",
};

export default function TransactionForm({
  onSubmit,
  categories,
  isLoadingCategories,
  onCancel,
}: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionInput>(initialFormData);
  const [currentCategoryList, setCurrentCategoryList] = useState<string[]>([]);

  useEffect(() => {
    let newCategoryList: string[] = []; // Default to empty array
    if (categories) {
      // categories prop is of type CategoryListData | null
      if (formData.type === "INCOME") {
        // Use the correct property name from the updated CategoryListData interface
        newCategoryList = categories.incomeCategories || [];
      } else {
        // Use the correct property name
        newCategoryList = categories.expenseCategories || [];
      }
    }
    setCurrentCategoryList(newCategoryList);
    if (
      formData.category &&
      newCategoryList.length > 0 &&
      !newCategoryList.includes(formData.category)
    ) {
      setFormData((prev) => ({ ...prev, category: "" })); // Reset if invalid
    } else if (!formData.category && newCategoryList.length > 0) {
      // Optional: Pre-select the first category if none is selected and list is not empty
      // setFormData(prev => ({ ...prev, category: newCategoryList[0] }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.type, categories]); //formData.category removed from dependency to avoid reset loop

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newType = e.target.value as "INCOME" | "EXPENSE";
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: "", // Reset category when type changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.category && currentCategoryList.length > 0) {
      alert("Please select a category.");
      return;
    }
    if (formData.amount <= 0) {
      alert("Amount must be greater than zero.");
      return;
    }
    await onSubmit(formData);
    setFormData(initialFormData); // Reset form after submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <input
          type="date"
          name="date"
          id="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount
        </label>
        <input
          type="number"
          name="amount"
          id="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          step="0.01"
          min="0.01"
          className="text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <fieldset className="mt-4">
        <legend className="block text-sm font-medium text-gray-700">
          Type
        </legend>
        <div className="mt-2 flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="EXPENSE"
              checked={formData.type === "EXPENSE"}
              onChange={handleTypeChange}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Expense</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="INCOME"
              checked={formData.type === "INCOME"}
              onChange={handleTypeChange}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Income</span>
          </label>
        </div>
      </fieldset>
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
          required
          disabled={isLoadingCategories || currentCategoryList.length === 0}
          className="text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="" disabled>
            {isLoadingCategories ? "Loading..." : "Select category..."}
          </option>
          {currentCategoryList.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
}
