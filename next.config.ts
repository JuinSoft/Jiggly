import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    DYNAMIC_ENV_ID: process.env.DYNAMIC_ENV_ID,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GET_QUOTE_API: process.env.GET_QUOTE_API,
    TX_STATUS_API: process.env.TX_STATUS_API,
    TOKEN_CONNECTION_API: process.env.TOKEN_CONNECTION_API,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
