"use client";

import { useState } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";

export default function Home() {
  // This state triggers the list to refresh when a new expense is added
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header section */}
        <header className="mb-6 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fenmo Expense Tracker</h1>
          <p className="text-gray-500 mt-1">Record and review your personal expenses easily.</p>
        </header>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-4 h-fit">
            <ExpenseForm onRefresh={handleRefresh} />
          </div>

          {/* Right Column: List & Total Summary */}
          <div className="lg:col-span-8">
            <ExpenseList refreshTrigger={refreshTrigger} />
          </div>

        </div>
      </div>
    </main>
  );
}