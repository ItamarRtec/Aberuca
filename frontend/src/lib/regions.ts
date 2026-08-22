export type RegionId = "usa" | "latam" | "peru";

export type Region = {
  id: RegionId;
  href: string;
  label: string;
  short: string;
  lang: "en" | "es";
  note?: string;
  tagline: string;
  title: string;
};

export const REGIONS: Record<RegionId, Region> = {
  usa: {
    id: "usa",
    href: "/",
    label: "Aberuca USA",
    short: "USA",
    lang: "en",
    tagline: "Make your business discoverable and actionable by AI agents.",
    title: "Aberuca USA",
  },
  latam: {
    id: "latam",
    href: "/latam",
    label: "Aberuca Latam",
    short: "Latam",
    lang: "es",
    tagline:
      "Haz visible tu negocio para la nueva era de la inteligencia artificial.",
    title: "Aberuca Latam",
  },
  peru: {
    id: "peru",
    href: "/peru",
    label: "Aberuca Perú",
    short: "Perú",
    lang: "es",
    note: "Nacida en Estados Unidos. Fundada por un peruano.",
    tagline:
      "Haz visible tu negocio para la nueva era de la inteligencia artificial.",
    title: "Aberuca Perú",
  },
};

export const REGION_ORDER: RegionId[] = [
  "usa",
  "latam",
  "peru",
];

export const LATAM_COUNTRIES: RegionId[] = ["peru"];
