import type { PartnerApplication } from "@/lib/partner-application";

export async function insertPartnerApplication(row: PartnerApplication) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase configuration");
  }

  const response = await fetch(`${url}/rest/v1/aberuca_partner_applications`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    throw new Error(`Insert failed (${response.status})`);
  }
}
