"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS =['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export default function ExpenseChart({ expenses }: { expenses: any[] }) {
  const dataMap = expenses.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = 0;
    acc[curr.category] += (curr.amount / 100);
    return acc;
  }, {} as Record<string, number>);

  const data = Object.keys(dataMap).map((key) => ({
    name: key,
    value: dataMap[key],
  }));

  // Show this beautiful placeholder if there is no data yet!
  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6 h-80 flex flex-col items-center justify-center text-gray-400">
        <span className="text-4xl mb-2">📊</span>
        <p>Add some expenses to see your visual breakdown!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6 h-80 text-black">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Spending by Category</h3>
      {/* ResponsiveContainer needs a strict height wrapper, which we have above (h-80) */}
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => `₹${Number(value).toFixed(2)}`} />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}