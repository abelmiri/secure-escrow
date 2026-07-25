import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    PHASE: process.env.PHASE,
    DEV_USER: process.env.DEV_USER,
  },
}

export default nextConfig
