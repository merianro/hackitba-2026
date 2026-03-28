import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateApiKey } from "@/lib/api-auth";
import { getSupabaseServerClient } from "@/lib/supabase/client";

const profileSchema = z.object({
  phone: z.string().min(1),
  experience: z.enum(["none", "basic", "intermediate", "advanced"]),
  goal: z.enum(["short_term", "inflation", "growth", "retirement", "other"]),
  horizon: z.enum(["less_1y", "1_to_3y", "more_3y"]),
  risk_tolerance: z.enum(["conservative", "moderate", "aggressive"]),
});

export async function GET(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) {
    return NextResponse.json({ error: "phone query param required" }, { status: 400 });
  }

  const db = getSupabaseServerClient();

  const { data: user } = await db
    .from("users")
    .select("id")
    .eq("phone", phone)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data: profile } = await db
    .from("investor_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({ user_id: user.id, profile });
}

export async function POST(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { phone, experience, goal, horizon, risk_tolerance } = parsed.data;
    const db = getSupabaseServerClient();

    // Upsert user by phone
    const { data: user, error: userError } = await db
      .from("users")
      .upsert({ phone }, { onConflict: "phone" })
      .select("id")
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "Failed to upsert user" }, { status: 500 });
    }

    // Upsert investor profile
    const { data: profile, error: profileError } = await db
      .from("investor_profiles")
      .upsert(
        {
          user_id: user.id,
          experience,
          goal,
          horizon,
          risk_tolerance,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select("*")
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Failed to upsert profile" }, { status: 500 });
    }

    return NextResponse.json({ user_id: user.id, profile });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
