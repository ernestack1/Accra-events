import { MetadataRoute } from "next";
import { supabase } from "@/app/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://eventsinaccra.com";

  const { data: events } = await supabase
    .from("events")
    .select("slug, updated_at, published")
    .eq("published", true);

  const eventPages = (events || []).map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.updated_at
      ? new Date(event.updated_at)
      : new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/events/all`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...eventPages,
  ];
}