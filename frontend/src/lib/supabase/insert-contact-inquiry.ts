import type { ContactInquiry } from "@/lib/contact-inquiry";

export async function insertContactInquiry(row: ContactInquiry) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase configuration");
  }

  const response = await fetch(`${url}/rest/v1/aberuca_contact_inquiries`, {
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
