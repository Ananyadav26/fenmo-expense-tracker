# Fenmo Personal Finance Tool

A production-ready, full-stack Expense Tracker built for the Fenmo SDE Technical Assessment.

## 🚀 Live Links
- **Application:**https://fenmo-expense-tracker-gray.vercel.app/
- **Repository:**https://github.com/Ananyadav26/fenmo-expense-tracker

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** Server-Side In-Memory Store (Pivoted from Supabase)
- **Styling:** Tailwind CSS + Recharts (Analytics)
- **Validation:** React Hook Form + Zod

## 🧠 Key Design Decisions & Trade-offs

### 1. Persistence Mechanism Pivot (In-Memory Store)
**Trade-off:** Initially, I fully integrated Supabase (PostgreSQL) via Prisma. However, during the final Vercel deployment, connection pooling timeouts (`PrismaClientInitializationError`) threatened to break the live app. 
**Decision:** To strictly honor the 4-hour timebox and deliver a **feature-complete and bug-free** application, I immediately pivoted to a global in-memory Node.js array (which is explicitly allowed in the assessment guidelines). This allowed me to prioritize data correctness, API idempotency, and the analytics UI over wrestling with cloud database configurations under a ticking clock.

### 2. Money Handling (The Cents Pattern)
To ensure absolute data correctness and avoid floating-point binary arithmetic errors, the application handles money using the **Cents Pattern**. All currency is multiplied by 100 on the frontend, stored as an integer on the backend, and divided by 100 for UI display.

### 3. Idempotency & Network Resilience
Every expense generated on the frontend is assigned a unique `UUID` before the API call. If a `POST` request is retried due to an unreliable network or a double-click, the backend prevents duplicate entries, ensuring data correctness.

### 4. Personalization Strategy
To ensure a realistic user experience without the overhead of configuring OAuth, the app utilizes a "Local Device Profile" strategy. A unique `userId` is generated on the first visit, stored in `localStorage`, and attached to all API queries.
