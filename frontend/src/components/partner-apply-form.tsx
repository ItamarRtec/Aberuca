"use client";

import { useState, type FormEvent } from "react";
import { peruWhatsAppHref } from "@/lib/contact";
import {
  PARTNER_SECTORS,
  parsePartnerApplication,
  partnerApplicationFromForm,
  partnerWhatsAppMessage,
} from "@/lib/partner-application";

export function PartnerApplyForm() {
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const parsed = parsePartnerApplication(partnerApplicationFromForm(new FormData(form)));

    if ("error" in parsed) {
      setStatus("error");
      setMessage(parsed.error);
      return;
    }

    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch("/api/partner-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(result.error ?? "No pudimos guardar la postulación.");
        return;
      }

      window.open(
        peruWhatsAppHref(partnerWhatsAppMessage(parsed.data)),
        "_blank",
        "noopener,noreferrer",
      );
      form.reset();
      setStatus("sent");
      setMessage("Postulación guardada. Te abrimos WhatsApp para enviarla también.");
    } catch {
      setStatus("error");
      setMessage("No pudimos enviar la postulación. Inténtalo de nuevo.");
    }
  };

  return (
    <form className="apply-form" onSubmit={onSubmit} aria-busy={status === "saving"}>
      <h3 className="partner-section-title">Postular a mi negocio</h3>
      <p className="apply-form__lede">
        Completa los datos de tu empresa. Al enviar, guardamos la postulación y
        abrimos WhatsApp.
      </p>

      <div className="apply-form__grid">
        <label className="apply-field">
          <span>Nombre del negocio</span>
          <input name="business" type="text" autoComplete="organization" required />
        </label>

        <label className="apply-field">
          <span>RUC</span>
          <input
            name="ruc"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{11}"
            maxLength={11}
            minLength={11}
            placeholder="11 dígitos"
            required
          />
        </label>

        <label className="apply-field">
          <span>Ámbito</span>
          <select name="sector" required defaultValue="">
            <option value="" disabled>
              Selecciona un rubro
            </option>
            {PARTNER_SECTORS.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </label>

        <label className="apply-field">
          <span>Ciudad</span>
          <input name="city" type="text" autoComplete="address-level2" required />
        </label>

        <label className="apply-field">
          <span>Nombre de contacto</span>
          <input name="contact" type="text" autoComplete="name" required />
        </label>

        <label className="apply-field">
          <span>WhatsApp</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
          />
        </label>

        <label className="apply-field apply-field--wide">
          <span>Correo</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>

        <label className="apply-field apply-field--wide">
          <span>Qué servicios ofreces</span>
          <textarea
            name="services"
            rows={4}
            required
            minLength={10}
            placeholder="Cuéntanos qué haces, para quién y cómo atiendes hoy."
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
        {status === "saving" ? "Enviando…" : "Enviar postulación"}
      </button>
    </form>
  );
}
