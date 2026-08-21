// src/app/robots.ts
// Dynamic robots.txt generation for AFROZA Editor
// Replaces the static public/robots.txt

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://afroza-editor.tech/sitemap.xml",
  };
}
