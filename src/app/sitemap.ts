import type { MetadataRoute } from "next";

import { services } from "../data/services";
import { teamMembers } from "../data/team";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.SITE_URL ?? "https://afroza-coorporate.vercel.app"
  ).replace(/\/$/, "");

  const staticRoutes = [
    "",
    "about",
    "about/faq",
    "about/tarifs",
    "contact",
    "features",
    "news",
    "services",
  ];

  const pages: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date(),
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
  }));

  const memberEntries: MetadataRoute.Sitemap = teamMembers.map((member) => ({
    url: `${baseUrl}/membres/${member.slug}`,
    lastModified: new Date(),
  }));

  return [...pages, ...serviceEntries, ...memberEntries];
}