"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  applyDesignSettings,
  DEFAULT_DESIGN_SETTINGS,
  DESIGN_SETTINGS_KEY,
  readDesignSettings,
  type DesignSettings,
} from "@/lib/design-settings";

type RangeControlProps = {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  suffix?: string;
  value: number;
};

function RangeControl({
  label,
  max,
  min,
  onChange,
  step,
  suffix = "",
  value,
}: RangeControlProps) {
  return (
    <label className="design-control">
      <span>
        {label}
        <output>
          {value}
          {suffix}
        </output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function DesignControls() {
  const [open, setOpen] = useState(true);
  const [settings, setSettings] = useState(DEFAULT_DESIGN_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [layoutEditing, setLayoutEditing] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = readDesignSettings();
      setSettings(saved);
      applyDesignSettings(saved);
      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    applyDesignSettings(settings);
    window.localStorage.setItem(
      DESIGN_SETTINGS_KEY,
      JSON.stringify(settings),
    );
  }, [hydrated, settings]);

  const update = <Key extends keyof DesignSettings>(
    key: Key,
    value: DesignSettings[Key],
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const reset = () => {
    setSettings(DEFAULT_DESIGN_SETTINGS);
    window.localStorage.removeItem(DESIGN_SETTINGS_KEY);
  };

  const toggleLayoutEditing = () => {
    const next = !layoutEditing;
    setLayoutEditing(next);
    document.documentElement.dataset.layoutEditing = String(next);
    window.dispatchEvent(new Event("aberuca-layout-mode"));
  };

  const resetLayout = () => {
    window.dispatchEvent(new Event("aberuca-layout-reset"));
  };

  return (
    <aside className={`design-controls${open ? " is-open" : ""}`}>
      <button
        className="design-controls__toggle"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Cerrar ajustes" : "Ajustar diseño"}
      </button>

      {open ? (
        <div className="design-controls__panel">
          <header>
            <p>Local design lab</p>
            <h2>Ajustes de Aberuca</h2>
          </header>

          <div className="layout-tools">
            <button
              type="button"
              aria-pressed={layoutEditing}
              onClick={toggleLayoutEditing}
            >
              {layoutEditing ? "Terminar de mover" : "Mover cajas"}
            </button>
            <button type="button" onClick={resetLayout}>
              Restablecer cajas
            </button>
          </div>
          {layoutEditing ? (
            <p className="layout-tools__help">
              Arrastra cualquier caja. Usa la esquina inferior derecha para
              cambiar su tamaño.
            </p>
          ) : null}

          <label className="design-control">
            <span>Tipografía de texto</span>
            <select
              value={settings.font}
              onChange={(event) =>
                update(
                  "font",
                  event.target.value as DesignSettings["font"],
                )
              }
            >
              <option value="open-sauce">Open Sauce One</option>
              <option value="helvetica">Helvetica Neue</option>
              <option value="arial">Arial</option>
            </select>
          </label>

          <label className="design-control">
            <span>Tipografía del wordmark</span>
            <select
              value={settings.wordmarkFont}
              onChange={(event) =>
                update(
                  "wordmarkFont",
                  event.target.value as DesignSettings["wordmarkFont"],
                )
              }
            >
              <option value="jost">Jost Light</option>
              <option value="open-sauce">Open Sauce One</option>
              <option value="helvetica">Helvetica Neue</option>
            </select>
          </label>

          <RangeControl
            label="Escala del wordmark"
            min={0.6}
            max={1.4}
            step={0.01}
            value={settings.wordmarkScale}
            suffix="×"
            onChange={(value) => update("wordmarkScale", value)}
          />
          <RangeControl
            label="Marca del menú"
            min={1.25}
            max={4}
            step={0.05}
            value={settings.navMarkSize}
            suffix="rem"
            onChange={(value) => update("navMarkSize", value)}
          />
          <RangeControl
            label="Titular"
            min={1.35}
            max={2.5}
            step={0.05}
            value={settings.headingSize}
            suffix="rem"
            onChange={(value) => update("headingSize", value)}
          />
          <RangeControl
            label="Texto"
            min={0.875}
            max={1.5}
            step={0.025}
            value={settings.bodySize}
            suffix="rem"
            onChange={(value) => update("bodySize", value)}
          />
          <RangeControl
            label="Interlineado"
            min={1.1}
            max={2}
            step={0.05}
            value={settings.lineHeight}
            onChange={(value) => update("lineHeight", value)}
          />
          <RangeControl
            label="Tracking"
            min={-0.04}
            max={0.12}
            step={0.005}
            value={settings.tracking}
            suffix="em"
            onChange={(value) => update("tracking", value)}
          />

          <fieldset className="design-colors">
            <legend>Colores del fondo</legend>
            {(
              [
                ["mist", "Mist"],
                ["coral", "Coral"],
                ["violet", "Violeta"],
                ["blue", "Azul"],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                <span>{label}</span>
                <input
                  type="color"
                  value={settings[key]}
                  onChange={(event) => update(key, event.target.value)}
                />
              </label>
            ))}
          </fieldset>

          <RangeControl
            label="Grano"
            min={0}
            max={0.8}
            step={0.01}
            value={settings.grain}
            onChange={(value) => update("grain", value)}
          />
          <RangeControl
            label="Movimiento"
            min={0}
            max={0.7}
            step={0.01}
            value={settings.flowOpacity}
            onChange={(value) => update("flowOpacity", value)}
          />

          <footer>
            <button type="button" onClick={reset}>
              Restablecer diseño
            </button>
            <Link href="/" target="_blank">
              Abrir USA
            </Link>
            <Link href="/latam" target="_blank">
              Abrir Latam
            </Link>
            <Link href="/peru" target="_blank">
              Abrir Perú
            </Link>
          </footer>
        </div>
      ) : null}
    </aside>
  );
}
