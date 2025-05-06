// src/types/index.ts

export interface TransactionInput {
  date: string; // YYYY-MM-DD
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string;
}

export interface TransactionOutput {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string;
}

export interface MonthlySummaryData {
  income: number; // Changed from totalIncome
  expenses: number; // Changed from totalExpenses
  net: number; // Changed from netAmount
  formattedTotalIncome?: string;
  formattedTotalExpenses?: string;
  formattedTotalNet?: string; // Changed from formattedNetAmount
  generatedDate?: string; // Changed from reportGeneratedTimestamp, format: date-time
  startDay?: string; // Changed from reportStartDate, format: date
  endDay?: string; // Changed from reportEndDate, format: date
  financialStatusDescription?: string; // Assuming this is still part of the object or fetched separately
}

export interface CategoryListData {
  incomeCategories: string[]; // Corrected to match API
  expenseCategories: string[]; // Corrected to match API
}

export interface ApiCategoryResponse {
  // This wrapper type is still correct
  categories: CategoryListData;
}
export interface FinancialStatusData {
  financialStatus: string;
}

export interface ApiMonthlySummaryResponse {
  monthlySummary: MonthlySummaryData;
}

export interface ApiTransactionsResponse {
  transactions: TransactionOutput[];
}

export interface ApiAddTransactionResponse {
  transactionId: string;
}

export interface ApiErrorResponse {
  error: string;
}
