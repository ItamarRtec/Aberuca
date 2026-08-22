const FALLBACKS: Record<string, string> = {
  "--color-flow-gray": "#b9b6b2",
  "--color-flow-coral": "#e4444e",
  "--color-flow-violet": "#8560a0",
  "--color-flow-blue": "#3268ab",
  "--color-flow-navy": "#285b98",
};

export function hexToVec3(hex: string): [number, number, number] {
  const value = hex.trim().replace("#", "");
  if (value.length < 6) return [0, 0, 0];
  return [
    Number.parseInt(value.slice(0, 2), 16) / 255,
    Number.parseInt(value.slice(2, 4), 16) / 255,
    Number.parseInt(value.slice(4, 6), 16) / 255,
  ];
}

export function readToken(name: string): string {
  const live = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (live.startsWith("#") && live.length >= 7) return live;
  return FALLBACKS[name] ?? live;
}

export function readTokenNumber(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
