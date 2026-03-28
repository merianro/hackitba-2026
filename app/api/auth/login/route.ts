import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y password requeridos" }, { status: 400 });
    }

    const db = getSupabaseServerClient();
    const { data: user } = await db
      .from("users")
      .select("id, phone, email, password")
      .eq("email", email)
      .single();

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    const res = NextResponse.json({
      id: user.id,
      email: user.email,
      phone: user.phone,
    });

    res.cookies.set("user_id", user.id, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
