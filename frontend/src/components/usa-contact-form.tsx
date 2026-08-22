"use client";

import { useState, type FormEvent } from "react";
import {
  contactInquiryFromForm,
  parseContactInquiry,
} from "@/lib/contact-inquiry";

export function UsaContactForm() {
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const parsed = parseContactInquiry(contactInquiryFromForm(new FormData(form)));

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
        setMessage(result.error ?? "We could not send your message.");
        return;
      }

      form.reset();
      setStatus("sent");
      setMessage("Message sent. We will get back to you soon.");
    } catch {
      setStatus("error");
      setMessage("We could not send your message. Please try again.");
    }
  };

  return (
    <form className="apply-form" onSubmit={onSubmit} aria-busy={status === "saving"}>
      <h3 className="partner-section-title">Send a message</h3>
      <p className="apply-form__lede">
        Tell us about your business. We save your note and follow up by email.
      </p>

      <div className="apply-form__grid">
        <label className="apply-field">
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>

        <label className="apply-field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>

        <label className="apply-field">
          <span>Company</span>
          <input name="company" type="text" autoComplete="organization" />
        </label>

        <label className="apply-field">
          <span>Phone</span>
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" />
        </label>

        <label className="apply-field apply-field--wide">
          <span>Message</span>
          <textarea
            name="message"
            rows={4}
            required
            minLength={10}
            placeholder="What should we know about your business?"
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
        {status === "saving" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
