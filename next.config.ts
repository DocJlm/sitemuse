import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [{ source: "/", destination: "/zh", permanent: false }];
  },
};
export default config;
