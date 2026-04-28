export interface Expense {
  id: string; 
  amount: number; // STORED IN CENTS (e.g. 1050 for ₹10.50)
  category: string;
  description: string;
  date: string;
  created_at: string;
}