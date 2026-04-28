"use client";
import { useEffect, useState } from "react";

export default function ExpenseList({ refreshTrigger }: { refreshTrigger: number }) {
  const [expenses, setExpenses] = useState([]);
  const [cat, setCat] = useState("All");

  useEffect(() => {
    fetch(`/api/expenses?category=${cat}&sort=date_desc`)
      .then(res => res.json())
      .then(data => setExpenses(data));
  }, [refreshTrigger, cat]);

  const total = expenses.reduce((acc, curr: any) => acc + curr.amount, 0) / 100;

  return (
    <div className="p-6 bg-white rounded-lg shadow border text-black">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">Total: ₹{total.toFixed(2)}</h2>
        <select onChange={(e) => setCat(e.target.value)} className="border rounded">
          <option value="All">All</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Bills">Bills</option>
        </select>
      </div>
      {expenses.map((e: any) => (
        <div key={e.id} className="border-b py-2 flex justify-between">
          <span>{e.description} ({e.category})</span>
          <span className="font-mono">₹{(e.amount / 100).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}