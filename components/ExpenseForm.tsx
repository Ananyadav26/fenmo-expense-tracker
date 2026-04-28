"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const schema = z.object({
  amount: z.coerce.number().positive(),
  category: z.string().min(1),
  description: z.string().min(3).max(100),
  date: z.string().min(1),
});

export default function ExpenseForm({ onRefresh }: { onRefresh: () => void }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
      await fetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify({ ...data, id: uuidv4(), amount: Math.round(data.amount * 100) }),
      });
      toast.success("Added!");
      reset();
      onRefresh();
    } catch { toast.error("Error"); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded-lg shadow border text-black space-y-4">
      <input type="number" step="0.01" {...register("amount")} placeholder="Amount (₹)" className="w-full p-2 border rounded" />
      <select {...register("category")} className="w-full p-2 border rounded">
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Bills">Bills</option>
        <option value="Other">Other</option>
      </select>
      <input type="date" {...register("date")} className="w-full p-2 border rounded" />
      <input type="text" {...register("description")} placeholder="Description" className="w-full p-2 border rounded" />
      <button disabled={isSubmitting} className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-blue-300">Add</button>
    </form>
  );
}