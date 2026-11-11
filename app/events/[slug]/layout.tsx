
import { Metadata } from "next";
import type { ReactNode } from "react";
import { supabase } from "@/app/lib/supabase";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const { data: event } = await supabase
    .from("events")
    .select("title, description, image, location")
    .eq("slug", slug)
    .single();

  if (!event) {
    return {
      title: "Event Not Found | Events in Accra",
    };
  }

  const title = event.title;
  const description =
    event.description ||
    `Discover ${event.title} happening in ${event.location || "Accra, Ghana"}. Find event details on Events in Accra.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://eventsinaccra.com/events/${slug}`,
      siteName: "Events in Accra",
      type: "website",
      images: event.image ? [event.image] : [],
    },
  };
}

export default function EventLayout({ children }: Props) {
  return <>{children}</>;
}
