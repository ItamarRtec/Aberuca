export type ContactInquiry = {
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  region: "usa";
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    return { error: "Please complete the form to continue." };
  }

  const body = input as Record<string, unknown>;
  const name = readString(body.name, 120);
  const email = readString(body.email, 160).toLowerCase();
  const company = readString(body.company, 120);
  const phone = readString(body.phone, 40);
  const message = readString(body.message, 2000);

  if (name.length < 2) {
    return { error: "Please enter your name." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Please enter a valid email." };
  }

  if (phone && phone.length < 7) {
    return { error: "Please enter a valid phone number." };
  }

  if (message.length < 10) {
    return { error: "Please tell us a little more in your message." };
  }

  return {
    data: {
      name,
      email,
      company: company.length > 0 ? company : null,
      phone: phone.length > 0 ? phone : null,
      message,
      region: "usa",
    },
  };
}

export function contactInquiryFromForm(form: FormData): unknown {
  return {
    name: form.get("name"),
    email: form.get("email"),
    company: form.get("company"),
    phone: form.get("phone"),
    message: form.get("message"),
  };
}
