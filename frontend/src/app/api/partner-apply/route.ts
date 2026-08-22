import { parsePartnerApplication } from "@/lib/partner-application";
import { insertPartnerApplication } from "@/lib/supabase/insert-partner-application";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "No pudimos leer la postulación." },
      { status: 400 },
    );
  }

  const parsed = parsePartnerApplication(payload);

  if ("error" in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  try {
    await insertPartnerApplication(parsed.data);
  } catch {
    return Response.json(
      { error: "No pudimos guardar la postulación. Inténtalo de nuevo." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
