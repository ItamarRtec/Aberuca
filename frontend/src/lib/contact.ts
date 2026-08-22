export const PERU_WHATSAPP_PHONE =
  process.env.NEXT_PUBLIC_PERU_WHATSAPP_PHONE ?? "51998049576";

export function peruWhatsAppHref(message: string) {
  const phone = PERU_WHATSAPP_PHONE.replace(/\D/g, "");
  const text = encodeURIComponent(message);

  return `https://wa.me/${phone}?text=${text}`;
}
