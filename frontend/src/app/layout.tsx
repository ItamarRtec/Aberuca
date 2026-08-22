import type { Metadata } from "next";
import { Jost } from "next/font/google";
import localFont from "next/font/local";
import { DesignControls } from "@/components/design-controls";
import { DesignSettingsProvider } from "@/components/design-settings-provider";
import "./globals.css";

const openSauce = localFont({
  src: [
    {
      path: "./fonts/OpenSauceOne-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/OpenSauceOne-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/OpenSauceOne-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-sauce",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aberuca USA",
    template: "%s",
  },
  description: "Make your business discoverable and actionable by AI agents.",
  metadataBase: new URL("https://www.aberuca.com"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${openSauce.variable} ${jost.variable} h-full`}
    >
      <body className="min-h-full">
        <DesignSettingsProvider />
        {children}
        {process.env.NODE_ENV === "development" ? <DesignControls /> : null}
      </body>
    </html>
  );
}
