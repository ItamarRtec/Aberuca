import type { Metadata } from "next";
import Image from "next/image";
import { Atmosphere } from "@/components/atmosphere";
import { Button } from "@/components/button";
import "./design-card.css";

export const metadata: Metadata = {
  title: "Design Card — Aberuca",
  description: "Aberuca color, type, boxes, and atmosphere tokens.",
};

const swatches = [
  { token: "--color-bg", hex: "#efede8", use: "page", variable: "var(--color-bg)" },
  { token: "--color-surface", hex: "#ffffff", use: "cards", variable: "var(--color-surface)" },
  { token: "--color-surface-inset", hex: "#e4e1db", use: "wells", variable: "var(--color-surface-inset)" },
  { token: "--color-text", hex: "#16181c", use: "ink", variable: "var(--color-text)" },
  { token: "--color-text-muted", hex: "#5c6168", use: "supporting", variable: "var(--color-text-muted)" },
  { token: "--color-accent", hex: "#2b5fa0", use: "primary", variable: "var(--color-accent)" },
  { token: "--color-border", hex: "#d4d0c9", use: "hairline", variable: "var(--color-border)" },
  { token: "--color-mist", hex: "#c0beb9", use: "field left", variable: "var(--color-mist)" },
  { token: "--color-ember", hex: "#ca3b35", use: "glow only", variable: "var(--color-ember)" },
  { token: "--color-ember-hot", hex: "#c41f47", use: "orb core", variable: "var(--color-ember-hot)" },
  { token: "--color-rose", hex: "#c41f47", use: "field mid", variable: "var(--color-rose)" },
  { token: "--color-violet", hex: "#8967a3", use: "field mid", variable: "var(--color-violet)" },
  { token: "--color-flow-gray", hex: "#b9b6b2", use: "flow left", variable: "var(--color-flow-gray)" },
  { token: "--color-flow-coral", hex: "#e4444e", use: "flow center", variable: "var(--color-flow-coral)" },
  { token: "--color-flow-violet", hex: "#8560a0", use: "flow mid", variable: "var(--color-flow-violet)" },
  { token: "--color-flow-blue", hex: "#3268ab", use: "flow right", variable: "var(--color-flow-blue)" },
  { token: "--color-flow-navy", hex: "#285b98", use: "flow depth", variable: "var(--color-flow-navy)" },
] as const;

const spaces = [
  "--space-2xs",
  "--space-xs",
  "--space-sm",
  "--space-md",
  "--space-lg",
  "--space-xl",
  "--space-2xl",
  "--space-3xl",
  "--space-4xl",
] as const;

export default function DesignCardPage() {
  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Phase 1</p>
        <h1>Design Card</h1>
        <p className="lede">
          Colors, type, boxes, and atmosphere locked from the Aberuca wordmark.
          Every later section uses only these tokens.
        </p>
      </header>

      <section className="block" aria-labelledby="identity">
        <h2 id="identity">Identity</h2>
        <Atmosphere />
        <figure className="reference">
          <Image
            src="/aberuca-wordmark.png"
            width={1024}
            height={579}
            alt="Official Aberuca wordmark: white sentence-case type on a grainy mist-to-blue field with an ember glow"
            priority
          />
          <figcaption className="caption">
            Official reference. The field above is the same image in code:
            blurred orbs, grain, and type. Use the coded field in the product.
          </figcaption>
        </figure>
      </section>

      <section className="block" aria-labelledby="color">
        <h2 id="color">Color</h2>
        <div className="swatches">
          {swatches.map((swatch) => (
            <article className="swatch" key={swatch.token}>
              <div
                className="swatch__chip"
                style={{ background: swatch.variable }}
              />
              <dl className="meta">
                <dt>{swatch.token}</dt>
                <dd>
                  {swatch.hex} · {swatch.use}
                </dd>
              </dl>
            </article>
          ))}
          <article className="swatch">
            <div className="swatch__chip swatch__chip--on-field">
              <span className="visually-hidden">White on blue</span>
            </div>
            <dl className="meta">
              <dt>--color-text-on-atmosphere</dt>
              <dd>#ffffff · wordmark</dd>
            </dl>
          </article>
        </div>
        <p className="note">
          Ember is atmosphere, not a button. White on ember is 4.0:1 and fails
          body text.
        </p>
      </section>

      <section className="block" aria-labelledby="type">
        <h2 id="type">Typography</h2>
        <div className="specimens specimens--type">
          <div className="type-row">
            <p className="type-wordmark">Aberuca</p>
            <dl className="meta">
              <dt>--text-wordmark</dt>
              <dd>Jost Light · clamp · wordmark</dd>
            </dl>
          </div>
          <div className="type-row">
            <p className="type-xl">Section title</p>
            <dl className="meta">
              <dt>--text-xl</dt>
              <dd>1.75rem · medium</dd>
            </dl>
          </div>
          <div className="type-row">
            <p className="type-lg">Supporting line that stays short.</p>
            <dl className="meta">
              <dt>--text-lg</dt>
              <dd>1.25rem · regular</dd>
            </dl>
          </div>
          <div className="type-row">
            <p className="type-md">
              Body text on the lifted mist page. Open Sauce One, the Aberuca
              grotesque.
            </p>
            <dl className="meta">
              <dt>--text-md</dt>
              <dd>1rem · regular · 1.6</dd>
            </dl>
          </div>
          <div className="type-row">
            <p className="type-sm">Secondary UI and captions</p>
            <dl className="meta">
              <dt>--text-sm</dt>
              <dd>0.875rem</dd>
            </dl>
          </div>
          <div className="type-row">
            <p className="type-xs">LABEL / META</p>
            <dl className="meta">
              <dt>--text-xs</dt>
              <dd>0.75rem · medium</dd>
            </dl>
          </div>
        </div>
      </section>

      <section className="block" aria-labelledby="boxes">
        <h2 id="boxes">Boxes</h2>
        <div className="specimens">
          <div className="box box--surface">
            <strong>Surface</strong>
            <span className="caption">--radius-lg · --space-xl · no shadow</span>
          </div>
          <div className="box box--card">
            <strong>Card</strong>
            <span className="caption">
              --radius-lg · --border-thin · --shadow-soft
            </span>
          </div>
          <div className="box box--inset">
            <strong>Inset</strong>
            <span className="caption">--radius-md · --color-surface-inset</span>
          </div>
          <div className="box box--outline">
            <strong>Outline</strong>
            <span className="caption">--radius-md · hairline only</span>
          </div>
        </div>
      </section>

      <section className="block" aria-labelledby="space">
        <h2 id="space">Space</h2>
        <div className="spaces">
          {spaces.map((token) => (
            <div className="space-row" key={token}>
              <span className="caption">{token}</span>
              <div className="space-bar" style={{ width: `var(${token})` }} />
            </div>
          ))}
        </div>
      </section>

      <section className="block" aria-labelledby="controls">
        <h2 id="controls">Controls</h2>
        <div className="controls">
          <div className="control-set">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <a className="link" href="#identity">
              Inline link
            </a>
            <Button disabled>Disabled</Button>
          </div>
          <p className="note">
            Focus each control. The ring is --focus-ring. Primary uses brand
            blue, not ember.
          </p>
        </div>
      </section>

      <section className="block" aria-labelledby="motion">
        <h2 id="motion">Motion</h2>
        <p className="note">
          --duration-fast 120ms · --duration-med 200ms · --ease-standard.
          Hero flow: --flow-fps 24 · --flow-cycle 32s · --flow-grain 0.035.
          WebGL off when prefers-reduced-motion or a low-power device; CSS field
          is the fallback.
        </p>
      </section>
    </main>
  );
}
