"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let storedId = localStorage.getItem("fenmo_user_id");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("fenmo_user_id", storedId);
    }
    setUserId(storedId);
  },[]);

  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  if (!userId) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="mb-6 pb-6 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fenmo Expense Tracker</h1>
            <p className="text-gray-500 mt-1">Your personal finance dashboard.</p>
          </div>
          <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium">
            👤 Device Profile: {userId.substring(0, 6)}...
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 h-fit">
            <ExpenseForm userId={userId} onRefresh={() => setRefreshTrigger(r => r + 1)} />
          </div>
          <div className="lg:col-span-8">
            <ExpenseList userId={userId} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </main>
  );
}