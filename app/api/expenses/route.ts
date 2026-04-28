// app/api/expenses/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");
  let result = [...db.expenses];
  if (category && category !== "All") result = result.filter(e => e.category === category);
  if (sort === "date_desc") result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  // Idempotency check: prevents duplicates on network retries
  if (db.expenses.find(e => e.id === body.id)) return NextResponse.json(body, { status: 200 });
  const newExpense = { ...body, created_at: new Date().toISOString() };
  db.expenses.push(newExpense);
  return NextResponse.json(newExpense, { status: 201 });
}