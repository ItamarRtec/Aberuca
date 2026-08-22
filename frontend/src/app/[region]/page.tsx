import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingLanding } from "@/components/marketing-landing";
import {
  REGIONS,
  REGION_ORDER,
  type RegionId,
} from "@/lib/regions";

type RegionPageProps = {
  params: Promise<{ region: string }>;
};

const MARKET_ROUTES = REGION_ORDER.filter((region) => region !== "usa");

function isRegionId(value: string): value is RegionId {
  return value in REGIONS && value !== "usa";
}

export function generateStaticParams() {
  return MARKET_ROUTES.map((region) => ({ region }));
}

export async function generateMetadata({
  params,
}: RegionPageProps): Promise<Metadata> {
  const { region } = await params;
  if (!isRegionId(region)) return {};

  const market = REGIONS[region];
  return {
    title: market.title,
    description: market.tagline,
    alternates: {
      canonical: `https://www.aberuca.com${market.href}`,
    },
  };
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region } = await params;
  if (!isRegionId(region)) notFound();

  return (
    <MarketingLanding
      placeSelected={region === "peru"}
      region={region}
    />
  );
}
