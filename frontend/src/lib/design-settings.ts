export type DesignSettings = {
  font: "open-sauce" | "helvetica" | "arial";
  wordmarkFont: "jost" | "open-sauce" | "helvetica";
  wordmarkScale: number;
  navMarkSize: number;
  headingSize: number;
  bodySize: number;
  lineHeight: number;
  tracking: number;
  mist: string;
  coral: string;
  violet: string;
  blue: string;
  grain: number;
  flowOpacity: number;
};

export const DESIGN_SETTINGS_KEY = "aberuca-design-settings-v3";

export const DEFAULT_DESIGN_SETTINGS: DesignSettings = {
  font: "open-sauce",
  wordmarkFont: "jost",
  wordmarkScale: 1,
  navMarkSize: 2,
  headingSize: 2,
  bodySize: 1,
  lineHeight: 1.6,
  tracking: -0.045,
  mist: "#c0beb9",
  coral: "#ca3b35",
  violet: "#8967a3",
  blue: "#3669ab",
  grain: 0.48,
  flowOpacity: 0.38,
};

const FONT_STACKS: Record<DesignSettings["font"], string> = {
  "open-sauce":
    'var(--font-open-sauce), "Helvetica Neue", Helvetica, Arial, sans-serif',
  helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  arial: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
};

const WORDMARK_STACKS: Record<DesignSettings["wordmarkFont"], string> = {
  jost: 'var(--font-jost), "Helvetica Neue", Helvetica, Arial, sans-serif',
  "open-sauce":
    'var(--font-open-sauce), "Helvetica Neue", Helvetica, Arial, sans-serif',
  helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif',
};

export function applyDesignSettings(settings: DesignSettings) {
  const root = document.documentElement.style;
  const scale = settings.wordmarkScale;

  root.setProperty("--font-body", FONT_STACKS[settings.font]);
  root.setProperty("--font-display", FONT_STACKS[settings.font]);
  root.setProperty("--font-wordmark", WORDMARK_STACKS[settings.wordmarkFont]);
  root.setProperty(
    "--text-wordmark",
    `clamp(${4.75 * scale}rem, ${10.5 * scale}vw, ${9.75 * scale}rem)`,
  );
  root.setProperty(
    "--text-hero",
    `clamp(1.35rem, 2.2vw + 0.8rem, ${settings.headingSize}rem)`,
  );
  root.setProperty("--text-md", `${settings.bodySize}rem`);
  root.setProperty("--leading-body", String(settings.lineHeight));
  root.setProperty("--tracking-wordmark", `${settings.tracking}em`);
  root.setProperty("--nav-mark-size", `${settings.navMarkSize}rem`);
  root.setProperty("--color-mist", settings.mist);
  root.setProperty("--color-ember", settings.coral);
  root.setProperty("--color-ember-hot", settings.coral);
  root.setProperty("--color-rose", settings.coral);
  root.setProperty("--color-violet", settings.violet);
  root.setProperty("--color-blue-deep", settings.blue);
  root.setProperty("--grain-opacity", String(settings.grain));
  root.setProperty("--flow-opacity", String(settings.flowOpacity));
}

export function readDesignSettings(): DesignSettings {
  try {
    const saved = window.localStorage.getItem(DESIGN_SETTINGS_KEY);
    if (!saved) return DEFAULT_DESIGN_SETTINGS;
    return { ...DEFAULT_DESIGN_SETTINGS, ...JSON.parse(saved) };
  } catch {
    return DEFAULT_DESIGN_SETTINGS;
  }
}
