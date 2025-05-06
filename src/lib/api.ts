// src/lib/api.ts
import type {
  TransactionInput,
  TransactionOutput,
  MonthlySummaryData,
  CategoryListData,
  FinancialStatusData,
  ApiCategoryResponse,
  ApiMonthlySummaryResponse,
  ApiTransactionsResponse,
  ApiAddTransactionResponse,
  ApiErrorResponse,
} from "@/types"; // Assuming @ is configured for src

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiErrorResponse | { message: string } = {
      message: `HTTP error! status: ${response.status}`,
    };
    try {
      errorData = await response.json();
    } catch (e) {
      // If parsing fails, we can log the error and return a generic message
      console.error("Failed to parse error response:", e);
    }
    const errorMessage =
      (errorData as ApiErrorResponse).error ||
      (errorData as { message: string }).message ||
      "Unknown error";
    console.error("API Error:", errorMessage, "Status:", response.status);
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

export async function fetchCategories(): Promise<CategoryListData> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const data = await handleResponse<ApiCategoryResponse>(response);
  return data.categories;
}

export async function fetchTransactions(): Promise<TransactionOutput[]> {
  const response = await fetch(`${API_BASE_URL}/transactions`);
  if (response.status === 204) {
    // Handle No Content
    return [];
  }
  const data = await handleResponse<ApiTransactionsResponse>(response);
  return data.transactions;
}

export async function fetchMonthlySummary(): Promise<MonthlySummaryData> {
  const response = await fetch(`${API_BASE_URL}/reports/monthly-summary`);
  const data = await handleResponse<ApiMonthlySummaryResponse>(response);
  return data.monthlySummary;
}

export async function fetchFinancialStatus(): Promise<FinancialStatusData> {
  const response = await fetch(`${API_BASE_URL}/reports/financial-status`);
  return handleResponse<FinancialStatusData>(response);
}

export async function addTransaction(
  transactionData: TransactionInput
): Promise<ApiAddTransactionResponse> {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  });
  return handleResponse<ApiAddTransactionResponse>(response);
}
