import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Caveat,
  Geist_Mono,
  IBM_Plex_Mono,
  Inter,
  Josefin_Sans,
  Jost,
  Manrope,
  Poppins,
} from "next/font/google";
import FxProvider from "@/components/fx/FxProvider";
import "./globals.css";

/* Core families: the shared GN type system. */
const josefin = Josefin_Sans({ subsets: ["latin"], weight: ["300", "400"], display: "swap", variable: "--font-josefin" });
const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-poppins" });
const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--font-geist-mono" });

/* Secondary families (Mazal social kit, Commune): not preloaded. next/font needs literal options. */
const archivo = Archivo({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-archivo" });
const jost = Jost({ subsets: ["latin"], display: "swap", preload: false, weight: ["300"], variable: "--font-jost" });
const inter = Inter({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-caveat" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], display: "swap", preload: false, weight: ["400"], variable: "--font-plex-mono" });

const DESCRIPTION =
  "Brand guidelines for GN Ventures and its six departments: Media, Academy, Club, Labs, Mazal and Commune. Logo, color, type, voice and downloads.";

export const metadata: Metadata = {
  title: "GN Ventures Brand Guidelines",
  description: DESCRIPTION,
  applicationName: "GN Ventures Brand Guidelines",
  openGraph: {
    title: "GN Ventures Brand Guidelines",
    description: DESCRIPTION,
    siteName: "GN Ventures",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GN Ventures Brand Guidelines",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#08090a",
  width: "device-width",
  initialScale: 1,
};

const FONT_VARS = [
  josefin,
  manrope,
  poppins,
  geistMono,
  archivo,
  jost,
  inter,
  caveat,
  plexMono,
]
  .map((f) => f.variable)
  .join(" ");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={FONT_VARS} style={{ colorScheme: "dark" }}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <FxProvider />
        {children}
      </body>
    </html>
  );
}
