import { NextResponse } from "next/server";

type Expense = {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
};

// Global In-Memory Database (Survives React re-renders and basic Vercel caching)
const globalForDb = global as unknown as { expenses: Expense[] };
if (!globalForDb.expenses) {
  globalForDb.expenses =[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let result = globalForDb.expenses.filter(e => e.userId === userId);

    if (category && category !== "All") {
      result = result.filter(e => e.category === category);
    }

    if (sort === "date_asc") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, userId, amount, category, description, date } = body;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Idempotency check
    const existing = globalForDb.expenses.find(e => e.id === id);
    if (existing) return NextResponse.json(existing, { status: 200 });

    const newExpense: Expense = {
      id, userId, amount, category, description, date,
      created_at: new Date().toISOString()
    };

    globalForDb.expenses.push(newExpense);
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id || !userId) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    globalForDb.expenses = globalForDb.expenses.filter(e => !(e.id === id && e.userId === userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}