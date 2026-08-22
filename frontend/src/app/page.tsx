import type { Metadata } from "next";
import { MarketingLanding } from "@/components/marketing-landing";
import { REGIONS } from "@/lib/regions";

const market = REGIONS.usa;

export const metadata: Metadata = {
  title: market.title,
  description: market.tagline,
  alternates: { canonical: "https://www.aberuca.com/" },
};

type HomeProps = {
  searchParams: Promise<{ place?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { place } = await searchParams;

  return (
    <MarketingLanding
      placeSelected={place === "usa"}
      region="usa"
    />
  );
}
