import { Transaction } from "../types";

const STORAGE_KEY = 'dompet_siswa_data_v1';

// In a real app, this would be an API call to Firebase/Supabase/Postgres.
// We are simulating the "Online Database" behavior with local persistence
// as we cannot provision a real backend in this environment.

export const databaseService = {
  getAllTransactions: (): Transaction[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load transactions", error);
      return [];
    }
  },

  addTransaction: (transaction: Transaction): Transaction[] => {
    const current = databaseService.getAllTransactions();
    const updated = [transaction, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteTransaction: (id: string): Transaction[] => {
    const current = databaseService.getAllTransactions();
    const updated = current.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  calculateBalance: (transactions: Transaction[]): number => {
    return transactions.reduce((acc, curr) => {
      return curr.type === 'INCOME' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  }
};
