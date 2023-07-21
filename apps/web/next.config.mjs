await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@our-trips/ui"],
};

export default config;
