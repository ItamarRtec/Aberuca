export type ContactInquiry = {
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  region: "usa" | "latam" | "peru";
};

export type ContactLang = "en" | "es";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ERRORS = {
  en: {
    empty: "Please complete the form to continue.",
    name: "Please enter your name.",
    email: "Please enter a valid email.",
    phone: "Please enter a valid phone number.",
    message: "Please tell us a little more in your message.",
    read: "We could not read the message.",
    save: "We could not send your message. Please try again.",
  },
  es: {
    empty: "Completa el formulario para continuar.",
    name: "Indica tu nombre.",
    email: "Indica un correo válido.",
    phone: "Indica un teléfono válido.",
    message: "Cuéntanos un poco más en tu mensaje.",
    read: "No pudimos leer el mensaje.",
    save: "No pudimos enviar el mensaje. Inténtalo de nuevo.",
  },
} as const;

export function contactLangForRegion(
  region: ContactInquiry["region"],
): ContactLang {
  return region === "usa" ? "en" : "es";
}

function readString(value: unknown, max: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, max);
}

export function parseContactInquiry(
  input: unknown,
): { data: ContactInquiry } | { error: string } {
  if (!input || typeof input !== "object") {
    return { error: ERRORS.en.empty };
  }

  const body = input as Record<string, unknown>;
  const region: ContactInquiry["region"] =
    body.region === "latam" || body.region === "peru" ? body.region : "usa";
  const copy = ERRORS[contactLangForRegion(region)];
  const name = readString(body.name, 120);
  const email = readString(body.email, 160).toLowerCase();
  const company = readString(body.company, 120);
  const phone = readString(body.phone, 40);
  const message = readString(body.message, 2000);

  if (name.length < 2) {
    return { error: copy.name };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: copy.email };
  }

  if (phone && phone.length < 7) {
    return { error: copy.phone };
  }

  if (message.length < 10) {
    return { error: copy.message };
  }

  return {
    data: {
      name,
      email,
      company: company.length > 0 ? company : null,
      phone: phone.length > 0 ? phone : null,
      message,
      region,
    },
  };
}

export function contactApiError(
  region: ContactInquiry["region"],
  kind: "read" | "save",
) {
  return ERRORS[contactLangForRegion(region)][kind];
}

export function contactInquiryFromForm(
  form: FormData,
  region: ContactInquiry["region"] = "usa",
): unknown {
  return {
    name: form.get("name"),
    email: form.get("email"),
    company: form.get("company"),
    phone: form.get("phone"),
    message: form.get("message"),
    region,
  };
}
