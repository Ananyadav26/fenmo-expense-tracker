// lib/db.ts
import { Expense } from "@/types";
const globalForDb = global as unknown as { expenses: Expense[] };
if (!globalForDb.expenses) globalForDb.expenses = [];
export const db = { expenses: globalForDb.expenses };