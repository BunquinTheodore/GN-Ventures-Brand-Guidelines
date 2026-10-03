import type { NextConfig } from "next";

const ONE_YEAR_S = 60 * 60 * 24 * 365;
const THIRTY_DAYS_S = 60 * 60 * 24 * 30;
const ONE_DAY_S = 60 * 60 * 24;

const IMMUTABLE = `public, max-age=${ONE_YEAR_S}, immutable`;
const FIVE_MINUTES_S = 60 * 5;
/* /brand, /cursor and /fonts keep their names across asset rebuilds, so they must not be immutable or cached for weeks.
   Fresh for 5 minutes, then served stale while revalidating (ETag, usually a 304) for a day. */
const SHORT_REVALIDATE = `public, max-age=${FIVE_MINUTES_S}, stale-while-revalidate=${ONE_DAY_S}`;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: THIRTY_DAYS_S,
  },
  async headers() {
    return [
      { source: "/_next/static/:path*", headers: [{ key: "Cache-Control", value: IMMUTABLE }] },
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: SHORT_REVALIDATE }] },
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: SHORT_REVALIDATE }] },
      { source: "/cursor/:path*", headers: [{ key: "Cache-Control", value: SHORT_REVALIDATE }] },
    ];
  },
};

export default nextConfig;
