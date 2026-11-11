import { Metadata } from "next";
import { supabase } from "@/app/lib/supabase";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const { data: event } = await supabase
    .from("events")
    .select("title, description, image, location, event_date")
    .eq("slug", slug)
    .single();

  if (!event) {
    return {
      title: "Event Not Found | Events in Accra",
    };
  }

  return {
    title: `${event.title} | Events in Accra`,
    description: `${event.description || `Discover ${event.title} in ${event.location || "Accra, Ghana"}.`} Find event details, dates and tickets on Events in Accra.`,
    openGraph: {
      title: `${event.title} | Events in Accra`,
      description: event.description || `Discover ${event.title} in Accra, Ghana.`,
      images: event.image ? [event.image] : [],
      type: "website",
    },
  };
}