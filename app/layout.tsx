import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

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
      className="h-full antialiased"
    >
         <body className="min-h-full flex flex-col">
        
<Script
  id="google-tag-manager"
  strategy="afterInteractive"
>
  {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-5H7ZZSP9');`}
</Script>

        {children}
      </body>
    </html>
  );
}
