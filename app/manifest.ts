import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Poli Summer Camp — Tabere copii UPB",
    short_name: "Poli Summer Camp",
    description:
      "Tabere urbane POLITEHNICA București pentru copii între 5 și 11 ani: înscriere online și activități STEM.",
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#eef3fb",
    theme_color: "#3f5ea8",
    lang: "ro",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
