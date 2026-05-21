import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nodemailer uses Node APIs / dynamic requires — keep it external so the bundler resolves it from node_modules.
  serverExternalPackages: ["nodemailer", "@prisma/client", "prisma", "exceljs", "node-cron", "jose"],
};

export default nextConfig;
