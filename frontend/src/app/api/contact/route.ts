import {
  contactApiError,
  parseContactInquiry,
} from "@/lib/contact-inquiry";
import { insertContactInquiry } from "@/lib/supabase/insert-contact-inquiry";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: contactApiError("usa", "read") },
      { status: 400 },
    );
  }

  const parsed = parseContactInquiry(payload);

  if ("error" in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  try {
    await insertContactInquiry(parsed.data);
  } catch {
    return Response.json(
      { error: contactApiError(parsed.data.region, "save") },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
