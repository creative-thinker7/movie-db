import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingExcludes: {
    "*": [
      "uploads/**/*",
      "prisma/*.db",
      "**/*.test.ts",
      "**/*.test.tsx",
      "aws/**/*",
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
