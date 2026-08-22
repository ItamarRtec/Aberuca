export const PARTNER_SECTORS = [
  "Gastronomía",
  "Comercio",
  "Salud y bienestar",
  "Belleza",
  "Educación",
  "Servicios profesionales",
  "Turismo y hospedaje",
  "Transporte y logística",
  "Hogar y oficios",
  "Tecnología",
  "Otro",
] as const;

export type PartnerSector = (typeof PARTNER_SECTORS)[number];

export type PartnerApplication = {
  business_name: string;
  ruc: string;
  sector: PartnerSector;
  city: string;
  contact_name: string;
  phone: string;
  email: string;
  services: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RUC_PATTERN = /^[0-9]{11}$/;

function readString(value: unknown, max: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, max);
}

function isSector(value: string): value is PartnerSector {
  return (PARTNER_SECTORS as readonly string[]).includes(value);
}

export function parsePartnerApplication(
  input: unknown,
): { data: PartnerApplication } | { error: string } {
  if (!input || typeof input !== "object") {
    return { error: "Completa el formulario para continuar." };
  }

  const body = input as Record<string, unknown>;
  const data = {
    business_name: readString(body.business_name, 120),
    ruc: readString(body.ruc, 11),
    sector: readString(body.sector, 80),
    city: readString(body.city, 80),
    contact_name: readString(body.contact_name, 120),
    phone: readString(body.phone, 40),
    email: readString(body.email, 160).toLowerCase(),
    services: readString(body.services, 2000),
  };

  if (data.business_name.length < 2) {
    return { error: "Indica el nombre del negocio." };
  }

  if (!RUC_PATTERN.test(data.ruc)) {
    return { error: "El RUC debe tener 11 dígitos." };
  }

  if (!isSector(data.sector)) {
    return { error: "Selecciona un ámbito." };
  }

  if (data.city.length < 2) {
    return { error: "Indica la ciudad." };
  }

  if (data.contact_name.length < 2) {
    return { error: "Indica el nombre de contacto." };
  }

  if (data.phone.length < 6) {
    return { error: "Indica un WhatsApp válido." };
  }

  if (!EMAIL_PATTERN.test(data.email)) {
    return { error: "Indica un correo válido." };
  }

  if (data.services.length < 10) {
    return { error: "Cuéntanos un poco más sobre tus servicios." };
  }

  return {
    data: {
      ...data,
      sector: data.sector,
    },
  };
}

export function partnerApplicationFromForm(form: FormData): unknown {
  return {
    business_name: form.get("business"),
    ruc: form.get("ruc"),
    sector: form.get("sector"),
    city: form.get("city"),
    contact_name: form.get("contact"),
    phone: form.get("phone"),
    email: form.get("email"),
    services: form.get("services"),
  };
}

export function partnerWhatsAppMessage(data: PartnerApplication) {
  return [
    "Hola Aberuca, postulo mi negocio al Programa de Partners Fundadores de Interlinks.",
    "",
    `Negocio: ${data.business_name}`,
    `RUC: ${data.ruc}`,
    `Ámbito: ${data.sector}`,
    `Ciudad: ${data.city}`,
    `Contacto: ${data.contact_name}`,
    `WhatsApp: ${data.phone}`,
    `Correo: ${data.email}`,
    `Servicios: ${data.services}`,
  ].join("\n");
}
