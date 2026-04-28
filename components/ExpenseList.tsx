"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import ExpenseChart from "./ExpenseChart";

export default function ExpenseList({ userId, refreshTrigger }: { userId: string, refreshTrigger: number }) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("All");
  const[sort, setSort] = useState("date_desc"); // <-- MAKE SURE THIS IS HERE

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // <-- MAKE SURE SORT IS IN THIS URL
      const res = await fetch(`/api/expenses?userId=${userId}&category=${cat}&sort=${sort}`); 
      if (res.ok) setExpenses(await res.json());
    } catch {
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, [refreshTrigger, cat, sort, userId]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses?id=${id}&userId=${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted!");
      fetchExpenses(); // Refresh list immediately
    } catch {
      toast.error("Could not delete");
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0) / 100;

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col text-black">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Expenses</h2>
          <div className="text-lg font-bold text-blue-800 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
            Total: ₹{totalAmount.toFixed(2)}
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="p-2 border border-gray-300 rounded-md text-sm w-full md:w-64">
            <option value="All">All Categories</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Transportation">Transportation</option>
            <option value="Utilities">Utilities</option>
            <option value="Subscriptions">Subscriptions</option>
            <option value="Entertainment">Entertainment</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)} className="p-2 border border-gray-300 rounded-md text-sm w-full md:w-64">
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No expenses found.</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {expenses.map((expense) => (
              <div key={expense.id} className="group flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                <div>
                  <p className="font-medium text-gray-800">{expense.description}</p>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{expense.category}</span>
                    <span className="text-xs text-gray-400">{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-gray-900">₹{(expense.amount / 100).toFixed(2)}</p>
                  <button onClick={() => handleDelete(expense.id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ExpenseChart expenses={expenses} />
    </>
  );
}