import { cookies } from "next/headers";
import { getSupabaseServerClient, isSupabaseConfigured } from "./supabase/client";

export interface SessionUser {
  id: string;
  phone: string;
  email: string | null;
  connected_bank: string | null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return null;

  const db = getSupabaseServerClient();
  const { data } = await db
    .from("users")
    .select("id, phone, email, connected_bank")
    .eq("id", userId)
    .single();

  if (!data) return null;
  return data as SessionUser;
}
