import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getSupabaseServerClient } from "@/lib/supabase/client";
import { DebitSetupForm } from "@/components/debit/DebitSetupForm";

export default async function DebitSetupPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const db = getSupabaseServerClient();
  const { data: portfolio } = await db
    .from("portfolios")
    .select("contribution_amount, contribution_frequency, next_contribution_date")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  return (
    <DebitSetupForm
      connectedBank={user.connected_bank}
      currentAmount={portfolio?.contribution_amount ?? null}
      currentFrequency={portfolio?.contribution_frequency ?? null}
      currentNextDate={portfolio?.next_contribution_date ?? null}
    />
  );
}
