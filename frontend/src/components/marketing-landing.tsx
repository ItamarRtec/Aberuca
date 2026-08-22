"use client";

import { useCallback, useEffect, useState } from "react";
import { EditableBox } from "@/components/editable-box";
import { FlowField } from "@/components/flow-field";
import { PartnerApplyForm } from "@/components/partner-apply-form";
import { RegionNav } from "@/components/region-nav";
import { UsaContactForm } from "@/components/usa-contact-form";
import { peruWhatsAppHref } from "@/lib/contact";
import { REGIONS, type RegionId } from "@/lib/regions";

type MarketingLandingProps = {
  placeSelected?: boolean;
  region: RegionId;
};

type SectionId = "enterprise" | "interlinks" | "partner" | "contact";

const INTERLINKS_COPY = {
  en: {
    heading: "Interlinks",
    title: "Interlinks connects your business with artificial intelligence.",
    intro:
      "It is Aberuca’s technology that enables AI agents to understand:",
    points: [
      "what services you offer,",
      "when you are available,",
      "where you work,",
      "and how they can send you a request or booking.",
    ],
    body:
      "So when someone searches for a service using artificial intelligence, your business can be discovered and contacted directly.",
    closing:
      "Your business keeps working as usual. Interlinks creates the connection.",
  },
  es: {
    heading: "Interlinks",
    title: "Interlinks conecta tu negocio con la inteligencia artificial.",
    intro:
      "Es la tecnología de Aberuca que le permite a los agentes de IA entender:",
    points: [
      "qué servicios ofreces,",
      "cuándo estás disponible,",
      "dónde trabajas,",
      "y cómo pueden enviarte una solicitud o reserva.",
    ],
    body:
      "Así, cuando una persona busque un servicio usando inteligencia artificial, tu negocio puede ser descubierto y contactado de forma directa.",
    closing:
      "Tu negocio sigue funcionando como siempre. Interlinks crea la conexión.",
  },
} as const;

const HERO_ACTIONS = {
  en: {
    primary: "Contact us",
    secondary: "What is Interlinks?",
  },
  es: {
    interlinks: "¿Qué es Interlinks?",
  },
  peru: {
    primary: "Postula al Programa Partner de Interlinks",
    secondary: "¿Qué es Interlinks?",
  },
} as const;

const PERU_PROGRAM = {
  eyebrow: "Programa de Partners Fundadores de Interlinks",
  title: "Lanza tu asistente de IA y conecta tu negocio a Interlinks",
  closing: "Cupos limitados para los primeros partners de Interlinks.",
  terms: "Aplican términos y condiciones.",
} as const;

const PERU_ENTERPRISE = {
  cta: "Contáctanos por WhatsApp",
  whatsapp:
    "Hola Aberuca, represento a una gran empresa y quiero conversar sobre Interlinks.",
} as const;

const USA_CONTACT = {
  eyebrow: "Contact",
  title: "Talk with Aberuca",
  body: "Tell us about your business and how you want to connect with Interlinks.",
} as const;

const PERU_STEPS = [
  {
    title: "Creamos tu asistente de IA",
    body:
      "Adaptado a tu negocio, tus servicios y la forma en que atiendes a tus clientes.",
  },
  {
    title: "Lo conectamos a Interlinks",
    body:
      "Para que tu negocio pueda integrarse a nuevas experiencias impulsadas por inteligencia artificial.",
  },
  {
    title: "Lo pruebas durante 7 días sin costo",
    body: "Sin costo de implementación durante el periodo de prueba.",
  },
  {
    title: "Tú decides si continúas",
    body:
      "Si te genera valor, puedes mantenerlo mediante una suscripción mensual.",
  },
] as const;

const PERU_BENEFITS = [
  "Un asistente de IA personalizado para tu negocio.",
  "Atención automatizada de consultas frecuentes.",
  "Una nueva forma de recibir solicitudes de clientes.",
  "Tu negocio conectado a la tecnología Interlinks.",
  "7 días de prueba sin costo.",
] as const;

const PERU_REQUIREMENTS = [
  "Ser emprendedor o representar a una pequeña o mediana empresa.",
  "Contar con un negocio formalmente registrado.",
  "Tener interés en probar nuevas formas de atención y conexión con clientes.",
] as const;

export function MarketingLanding({
  placeSelected = false,
  region,
}: MarketingLandingProps) {
  const market = REGIONS[region];
  const interlinks = INTERLINKS_COPY[market.lang];
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [heroReady, setHeroReady] = useState(false);
  const [navExtended, setNavExtended] = useState(false);
  const showHero = placeSelected && heroReady;
  const showContent = showHero && navExtended;

  const revealHero = useCallback(() => {
    setNavExtended(true);
  }, []);

  useEffect(() => {
    if (!placeSelected) return undefined;

    let second = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => setHeroReady(true));
    });

    return () => {
      window.cancelAnimationFrame(first);
      window.cancelAnimationFrame(second);
    };
  }, [placeSelected]);

  useEffect(() => {
    if (!activeSection) return undefined;

    let timeout = 0;
    const frame = window.requestAnimationFrame(() => {
      timeout = window.setTimeout(() => {
        document.getElementById(activeSection)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [activeSection]);

  const closeSection = () => {
    setActiveSection(null);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <main className="marketing-landing" lang={market.lang}>
      <section
        className={`hero hero--marketing${showHero ? " is-ready" : " is-chooser"}`}
        aria-label={showHero ? undefined : "Aberuca"}
        aria-labelledby={showHero ? "hero-title" : undefined}
      >
        <FlowField />
        <RegionNav
          current={region}
          placeSelected={placeSelected}
          ready={showHero}
          onExtended={revealHero}
          peruAudience={
            activeSection === "enterprise"
              ? "enterprise"
              : activeSection === "partner"
                ? "sme"
                : null
          }
          onPeruAudienceSelect={
            region === "peru"
              ? (audience) =>
                  setActiveSection(
                    audience === "enterprise" ? "enterprise" : "partner",
                  )
              : undefined
          }
        />

        {showContent ? (
        <div className="hero-content hero-content--marketing">
          <EditableBox
            className="hero-identity"
            id={`${region}-identidad-v2`}
          >
            <p className="hero-market">{market.label}</p>
            <h1 id="hero-title">Aberuca</h1>
          </EditableBox>

          <EditableBox
            className="hero-headline"
            id={`${region}-titular-v2`}
          >
            <h2>{market.tagline}</h2>
          </EditableBox>

          <EditableBox
            className="hero-actions"
            id={`${region}-acciones-v2`}
          >
            {region === "peru" ? (
              <>
                <button
                  className="button button--hero-primary"
                  type="button"
                  onClick={() => setActiveSection("partner")}
                >
                  {HERO_ACTIONS.peru.primary}
                </button>
                <button
                  className="button button--hero-secondary"
                  type="button"
                  onClick={() => setActiveSection("interlinks")}
                >
                  {HERO_ACTIONS.peru.secondary}
                </button>
              </>
            ) : region === "usa" ? (
              <>
                <button
                  className="button button--hero-primary"
                  type="button"
                  onClick={() => setActiveSection("contact")}
                >
                  {HERO_ACTIONS.en.primary}
                </button>
                <button
                  className="button button--hero-secondary"
                  type="button"
                  onClick={() => setActiveSection("interlinks")}
                >
                  {HERO_ACTIONS.en.secondary}
                </button>
              </>
            ) : (
              <button
                className="button button--hero-primary"
                type="button"
                onClick={() => setActiveSection("interlinks")}
              >
                {HERO_ACTIONS.es.interlinks}
              </button>
            )}
          </EditableBox>
        </div>
        ) : null}

        <div className="hero-bottom">
          {showContent && market.note ? (
            <p className="hero-founded">{market.note}</p>
          ) : null}
          <footer className="site-copyright">
            Copyright © Aberuca Technologies 2026
          </footer>
        </div>
      </section>

      {region === "peru" && activeSection === "partner" ? (
        <section
          className="interlinks-section"
          id="partner"
          aria-labelledby="partner-title"
        >
          <button
            className="section-close"
            type="button"
            onClick={closeSection}
          >
            Cerrar
          </button>
          <p className="section-eyebrow">{PERU_PROGRAM.eyebrow}</p>
          <h2 id="partner-title">{PERU_PROGRAM.title}</h2>
          <p className="section-body">
            Desarrollamos un asistente de IA para tu negocio{" "}
            <strong>sin costo de implementación</strong> y lo conectamos a
            Interlinks para ayudarte a atender consultas, mostrar tus servicios
            y recibir nuevas solicitudes.
          </p>
          <p className="section-body">
            Tienes <strong>7 días para probarlo sin costo</strong>. Después, tú
            decides si quieres continuar con una suscripción mensual.
          </p>
          <h3 className="partner-section-title">¿Cómo funciona?</h3>
          <ol className="partner-steps">
            {PERU_STEPS.map((step) => (
              <li key={step.title}>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <h3 className="partner-section-title">¿Qué obtienes?</h3>
          <ul className="partner-list">
            {PERU_BENEFITS.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
          <h3 className="partner-section-title">Requisitos</h3>
          <ul className="partner-list">
            {PERU_REQUIREMENTS.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
          <p className="partner-closing">{PERU_PROGRAM.closing}</p>
          <PartnerApplyForm />
          <p className="partner-terms">{PERU_PROGRAM.terms}</p>
        </section>
      ) : null}

      {region === "peru" && activeSection === "enterprise" ? (
        <section
          className="interlinks-section"
          id="enterprise"
          aria-labelledby="enterprise-title"
        >
          <button
            className="section-close"
            type="button"
            onClick={closeSection}
          >
            Cerrar
          </button>
          <p className="section-eyebrow">Grandes Empresas</p>
          <h2 id="enterprise-title">Soluciones de IA para empresas</h2>
          <p className="section-body">
            Contáctanos para conversar sobre las necesidades de tu empresa y
            desarrollar una solución con Interlinks.
          </p>
          <a
            className="button button--primary"
            href={peruWhatsAppHref(PERU_ENTERPRISE.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {PERU_ENTERPRISE.cta}
          </a>
        </section>
      ) : null}

      {activeSection === "interlinks" ? (
        <section
          className="interlinks-section interlinks-story"
          id="interlinks"
          aria-labelledby="interlinks-title"
        >
          <button
            className="section-close"
            type="button"
            onClick={closeSection}
          >
            {market.lang === "es" ? "Cerrar" : "Close"}
          </button>
          <p className="section-eyebrow">{interlinks.heading}</p>
          <h2 id="interlinks-title">{interlinks.title}</h2>
          <p className="section-body">{interlinks.intro}</p>
          <ol className="partner-steps">
            {interlinks.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ol>
          <p className="section-body">{interlinks.body}</p>
          <p className="interlinks-closing">{interlinks.closing}</p>
        </section>
      ) : null}

      {region === "usa" && activeSection === "contact" ? (
        <section
          className="interlinks-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <button
            className="section-close"
            type="button"
            onClick={closeSection}
          >
            Close
          </button>
          <p className="section-eyebrow">{USA_CONTACT.eyebrow}</p>
          <h2 id="contact-title">{USA_CONTACT.title}</h2>
          <p className="section-body">{USA_CONTACT.body}</p>
          <UsaContactForm />
        </section>
      ) : null}

      {activeSection ? (
        <footer className="site-copyright site-copyright--page">
          Copyright © Aberuca Technologies 2026
        </footer>
      ) : null}
    </main>
  );
}
