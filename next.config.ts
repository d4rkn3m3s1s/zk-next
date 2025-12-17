import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
  // Trigger restart for Prisma Client update
  turbopack: {}, // Explicitly enable Turbopack (silences webpack config warning)
};

export default withPWA(nextConfig);
