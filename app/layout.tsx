import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eventsinaccra.com"),
  title: {
    default: "Events in Accra | Discover Events, Concerts & Parties",
    template: "%s | Events in Accra",
  },
  description:
    "Discover events in Accra, Ghana. Find upcoming concerts, parties, festivals, business events, exhibitions and exciting things to do around Accra. Explore events and never miss what's happening.",
  keywords: [
    "Events in Accra",
    "Accra events",
    "Events in Ghana",
    "Accra concerts",
    "Parties in Accra",
    "Things to do in Accra",
    "Accra festivals",
  ],
  openGraph: {
    title: "Events in Accra | Discover What's Happening",
    description:
      "Find concerts, parties, festivals, exhibitions and exciting events happening in Accra, Ghana.",
    url: "https://eventsinaccra.com",
    siteName: "Events in Accra",
    locale: "en_GH",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
