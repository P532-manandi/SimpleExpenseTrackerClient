// src/app/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchMonthlySummary,
  fetchYearlySummary,
  fetchTransactions,
  fetchCategories,
  fetchFinancialStatus,
} from "@/lib/api"; // Adjust the import path as necessary
import {
  type PeriodicSummaryData,
  type TransactionOutput,
  type CategoryListData,
  type FinancialStatusData,
} from "@/types"; // Adjust the import path as necessary

import Header from "@/components/Header";
import MonthlySummaryDisplay from "@/components/MonthlySummaryDisplay";
import FinancialStatusDisplay from "@/components/FinancialStatusDisplay";
import TransactionList from "@/components/TransactionList";
import AddTransactionModal from "@/components/AddTransactionModal";
import YearlySummaryDisplay from "@/components/YearlySummaryDisplay";

export default function HomePage() {
  const [monthlySummaryData, setMonthlySummaryData] =
    useState<PeriodicSummaryData | null>(null);
  const [yearlySummaryData, setYearlySummaryData] =
    useState<PeriodicSummaryData | null>(null);
  const [transactions, setTransactions] = useState<TransactionOutput[]>([]);
  const [categories, setCategories] = useState<CategoryListData | null>(null);
  const [financialStatus, setFinancialStatus] = useState<string | null>(null);

  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    setIsLoadingSummary(true);
    setIsLoadingTransactions(true);
    setIsLoadingCategories(true);
    setIsLoadingStatus(true);
    setError(null);

    try {
      const [
        monthlySummary,
        yearlySummary,
        transactionsData,
        categoriesData,
        statusData,
      ]: [
        PeriodicSummaryData, // Assuming MonthlySummaryData is imported and used for summary
        PeriodicSummaryData,
        TransactionOutput[], // Assuming TransactionOutput is imported and used for transactionsData
        CategoryListData, // Assuming CategoryListData is imported and used for categoriesData
        FinancialStatusData // Explicitly use the FinancialStatusData type here
      ] = await Promise.all([
        fetchMonthlySummary(),
        fetchYearlySummary(),
        fetchTransactions(),
        fetchCategories(),
        fetchFinancialStatus(),
      ]);
      setMonthlySummaryData(monthlySummary);
      setYearlySummaryData(yearlySummary);
      setTransactions(transactionsData);
      setCategories(categoriesData);
      setFinancialStatus(statusData.financialStatus);
    } catch (err) {
      setError((err as Error).message || "Failed to load data.");
      console.error(err);
    } finally {
      setIsLoadingSummary(false);
      setIsLoadingTransactions(false);
      setIsLoadingCategories(false);
      setIsLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleTransactionSuccessfullyAdded = () => {
    handleCloseModal();
    loadAllData();
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <Header />

      <main className="w-full max-w-4xl">
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          {/* --- Top Row of the Card: Monthly Summary Title and Financial Status Pill --- */}
          <div className="flex justify-between items-center mb-3">
            {" "}
            {/* Adjusted bottom margin */}
            <h2 className="text-xl font-semibold text-gray-700">
              Current Month Summary
            </h2>
            {/* Financial Status Pill moved here to be on the top right of this line */}
            <FinancialStatusDisplay
              status={financialStatus}
              isLoading={isLoadingStatus}
            />
          </div>
          {/* Monthly data display remains directly under its title's container */}
          <MonthlySummaryDisplay
            summaryData={monthlySummaryData}
            isLoading={isLoadingSummary}
          />
          {/* --- End Monthly Summary Block --- */}

          {/* Visual Separator */}
          <hr className="my-6 border-gray-200" />

          {/* --- Yearly Summary Block --- */}
          <div className="mb-6">
            {" "}
            {/* Kept margin-bottom for this block */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-700">
                Current Year Summary
              </h2>
              {/* If you had a specific status/icon for yearly, it could go here */}
            </div>
            <YearlySummaryDisplay
              summaryData={yearlySummaryData} // Make sure this data is fetched and available
              isLoading={isLoadingSummary} // Make sure this loading state is managed
            />
          </div>
          {/* --- End Yearly Summary Block --- */}

          {/* The FinancialStatusDisplay was previously here at the very bottom, now it's at the top right. */}
        </section>

        {/* Add Transaction Button Section */}
        <section className="mb-8 flex justify-center sm:justify-end">
          <button
            onClick={handleOpenModal}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
          >
            + Add New Transaction
          </button>
        </section>

        {/* Error Display Section */}
        {error && (
          <p className="text-red-500 text-center mb-4">Error: {error}</p>
        )}

        {/* Transaction List Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Transaction List
          </h2>
          <TransactionList
            transactions={transactions}
            isLoading={isLoadingTransactions}
          />
        </section>
      </main>
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmitSuccess={handleTransactionSuccessfullyAdded} // Pass the submission handler
        categories={categories}
        isLoadingCategories={isLoadingCategories}
      />
    </div>
  );
}
