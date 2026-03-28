import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateApiKey } from "@/lib/api-auth";
import { getSupabaseServerClient } from "@/lib/supabase/client";

const requestSchema = z.object({
  portfolio_id: z.string().uuid(),
});

function nextDate(current: string, frequency: string): string {
  const d = new Date(current);
  switch (frequency) {
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "biweekly":
      d.setDate(d.getDate() + 14);
      break;
    case "monthly":
    default:
      d.setMonth(d.getMonth() + 1);
      break;
  }
  return d.toISOString().split("T")[0];
}

export async function POST(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { portfolio_id } = parsed.data;
    const db = getSupabaseServerClient();

    const { data: portfolio } = await db
      .from("portfolios")
      .select("*")
      .eq("id", portfolio_id)
      .eq("status", "active")
      .single();

    if (!portfolio) {
      return NextResponse.json({ error: "Active portfolio not found" }, { status: 404 });
    }

    if (!portfolio.contribution_amount) {
      return NextResponse.json({ error: "No contribution configured" }, { status: 400 });
    }

    // Insert simulated contribution
    const { data: contribution, error: insertError } = await db
      .from("contribution_history")
      .insert({
        portfolio_id,
        amount: portfolio.contribution_amount,
        status: "simulated",
      })
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json({ error: "Failed to record contribution" }, { status: 500 });
    }

    // Advance next_contribution_date
    const newDate = nextDate(
      portfolio.next_contribution_date ?? new Date().toISOString().split("T")[0],
      portfolio.contribution_frequency ?? "monthly"
    );

    await db
      .from("portfolios")
      .update({ next_contribution_date: newDate, updated_at: new Date().toISOString() })
      .eq("id", portfolio_id);

    return NextResponse.json({
      contribution,
      next_contribution_date: newDate,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
