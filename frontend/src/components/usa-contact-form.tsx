"use client";

import { useState, type FormEvent } from "react";
import {
  contactInquiryFromForm,
  contactLangForRegion,
  parseContactInquiry,
  type ContactInquiry,
} from "@/lib/contact-inquiry";

type UsaContactFormProps = {
  region?: ContactInquiry["region"];
};

const COPY = {
  en: {
    title: "Send a message",
    lede: "Tell us about your business. We save your note and follow up by email.",
    name: "Name",
    email: "Email",
    company: "Company",
    phone: "Phone",
    message: "Message",
    placeholder: "What should we know about your business?",
    sending: "Sending…",
    send: "Send message",
    sent: "Message sent. We will get back to you soon.",
    fail: "We could not send your message. Please try again.",
  },
  es: {
    title: "Enviar un mensaje",
    lede: "Cuéntanos sobre tu negocio. Guardamos tu nota y te respondemos por correo.",
    name: "Nombre",
    email: "Correo",
    company: "Empresa",
    phone: "Teléfono",
    message: "Mensaje",
    placeholder: "¿Qué debemos saber de tu negocio?",
    sending: "Enviando…",
    send: "Enviar mensaje",
    sent: "Mensaje enviado. Te escribiremos pronto.",
    fail: "No pudimos enviar el mensaje. Inténtalo de nuevo.",
  },
} as const;

export function UsaContactForm({ region = "usa" }: UsaContactFormProps) {
  const copy = COPY[contactLangForRegion(region)];
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const parsed = parseContactInquiry(
      contactInquiryFromForm(new FormData(form), region),
    );

    if ("error" in parsed) {
      setStatus("error");
      setMessage(parsed.error);
      return;
    }

    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(result.error ?? copy.fail);
        return;
      }

      form.reset();
      setStatus("sent");
      setMessage(copy.sent);
    } catch {
      setStatus("error");
      setMessage(copy.fail);
    }
  };

  return (
    <form className="apply-form" onSubmit={onSubmit} aria-busy={status === "saving"}>
      <h3 className="partner-section-title">{copy.title}</h3>
      <p className="apply-form__lede">{copy.lede}</p>

      <div className="apply-form__grid">
        <label className="apply-field">
          <span>{copy.name}</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>

        <label className="apply-field">
          <span>{copy.email}</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>

        <label className="apply-field">
          <span>{copy.company}</span>
          <input name="company" type="text" autoComplete="organization" />
        </label>

        <label className="apply-field">
          <span>{copy.phone}</span>
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" />
        </label>

        <label className="apply-field apply-field--wide">
          <span>{copy.message}</span>
          <textarea
            name="message"
            rows={4}
            required
            minLength={10}
            placeholder={copy.placeholder}
          />
        </label>
      </div>

      {message ? (
        <p
          className={
            status === "error"
              ? "apply-form__status apply-form__status--error"
              : "apply-form__status apply-form__status--ok"
          }
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}

      <button
        className="button button--primary"
        type="submit"
        disabled={status === "saving"}
      >
        {status === "saving" ? copy.sending : copy.send}
      </button>
    </form>
  );
}
