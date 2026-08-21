import type { MetadataRoute } from "next";

import { services } from "../data/services";
import { teamMembers } from "../data/team";

const SITE_URL = "https://afroza-editor.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  /* ─── Static pages with SEO priority ─── */
  const staticRoutes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }[] = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/services", changeFrequency: "monthly", priority: 0.9 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/features", changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/news", changeFrequency: "weekly", priority: 0.7 },
    { path: "/about/faq", changeFrequency: "monthly", priority: 0.6 },
    { path: "/about/tarifs", changeFrequency: "monthly", priority: 0.6 },
  ];

  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  /* ─── Service detail pages ─── */
  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  /* ─── Team member pages ─── */
  const memberEntries: MetadataRoute.Sitemap = teamMembers.map((member) => ({
    url: `${baseUrl}/membres/${member.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...pages, ...serviceEntries, ...memberEntries];
}