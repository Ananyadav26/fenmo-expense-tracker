import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const expenses = await prisma.expense.findMany({
      where: {
        userId: userId,
        ...(category && category !== "All" ? { category } : {}),
      },
      orderBy: {
        date: sort === "date_asc" ? "asc" : "desc",
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, userId, amount, category, description, date } = body;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Idempotency: Prevent duplicates
    const existing = await prisma.expense.findUnique({ where: { id } });
    if (existing) return NextResponse.json(existing, { status: 200 });

    const newExpense = await prisma.expense.create({
      data: {
        id,
        userId,
        amount, // In cents!
        category,
        description,
        date: new Date(date),
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id || !userId) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    await prisma.expense.deleteMany({
      where: { id, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}