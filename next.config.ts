import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nodemailer uses Node APIs / dynamic requires — keep it external so the bundler resolves it from node_modules.
  serverExternalPackages: ["nodemailer"],
};

export default nextConfig;
