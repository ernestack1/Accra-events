type EventTicket = {
  name: string;
  price: number;
  available: number;
};

type EventDetails = {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  ticketMode?: "free" | "internal" | "external";
ticketLink?: string;
  ticketTypes?: EventTicket[];
  price: string;
  image: string;
  description: string;
};

export const events: Record<string, EventDetails> = {
  "accra-music-night": {
    title: "Accra Music Night",
    category: "Music",
    date: "24 October 2026",
    time: "7:00 PM – 11:00 PM",
    location: "Grand Arena, Accra",
    ticketMode: "internal",
    ticketLink: "",
    ticketTypes: [
      { name: "Regular", price: 100, available: 500 },
      { name: "VIP", price: 200, available: 200 },
      { name: "VVIP", price: 350, available: 100 },
    ],
    price: "From GH₵100",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=85",
    description:
      "Experience an unforgettable night of live music, amazing performances and great entertainment in Accra.",
  },

  "accra-business-summit-2026": {
    ticketMode: "internal",
    ticketLink: "",
    ticketTypes: [
      { name: "Regular", price: 250, available: 500 },
      { name: "VIP", price: 400, available: 200 },
      { name: "VVIP", price: 600, available: 100 },
    ],
    title: "Accra Business Summit 2026",
    category: "Business",
    date: "28 October 2026",
    time: "9:00 AM",
    location: "Labadi Beach Hotel",
    price: "From GH₵250",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=85",
    description:
      "Connect with business leaders, entrepreneurs and professionals at this major business event in Accra.",
  },

  "accra-food-festival": {
    title: "Accra Food Festival",
    category: "Food & Drinks",
    date: "2 November 2026",
    time: "10:00 AM",
    location: "Efua Sutherland Park",
    price: "From GH₵50",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85",
    description:
      "Enjoy delicious food, drinks and an exciting atmosphere featuring some of Accra's favourite food experiences.",
  },

  "accra-comedy-live": {
    title: "Accra Comedy Live",
    category: "Shows",
    date: "14 November 2026",
    time: "6:00 PM",
    location: "National Theatre",
    price: "From GH₵80",
    image:
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1400&q=85",
    description:
      "Get ready for an evening of comedy, entertainment and unforgettable performances at the National Theatre.",
  },
};
