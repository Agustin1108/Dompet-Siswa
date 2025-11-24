export type TransactionType = 'EXPENSE' | 'INCOME';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  date: number; // timestamp
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface SoundAssets {
  tap: string;
  success: string;
  delete: string;
  cash: string;
}