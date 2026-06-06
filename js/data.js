/* ============================================================
   Lautbox Malaysia — data.js
   Single source of truth for site content.
   Loaded before app.js (globals).

   ⚠️  Replace the number below with the real WhatsApp line.
       Format: country code + number, digits only, no "+".
       Example for +60 12-345 6789  ->  "60123456789"
   ============================================================ */
const PHONE = "60XXXXXXXXX";

const SITE = {
  name: "Lautbox Malaysia",
  tagline: "Fresh Seafood From Sea To You",
  logo: "assets/images/logo.jpg",
  hours: "Mon – Sun · 9am – 9pm",
  social: {
    instagram: "#",
    facebook: "#",
  },
};

/* Image filenames live in assets/images/ (note: real files use spaces) */
const IMG = (file) => "assets/images/" + encodeURIComponent(file);

/* Category metadata drives filter tabs + card badges */
const CATEGORIES = {
  frozen: { label: "Frozen", badge: "Frozen", icon: "snowflake", accent: "ocean" },
  live:   { label: "Live Seafood", badge: "Live", icon: "waves", accent: "coral" },
};

const PRODUCTS = [
  /* ---------- Frozen ---------- */
  { name: "Dory Fish Fillet",         category: "frozen", image: "Dory Fish Fillet.jpg",         variants: ["1kg±/pkt", "2.5kg/pkt"] },
  { name: "Coral Grouper",            category: "frozen", image: "Coral Grouper.jpg",            variants: ["600–800g", "800–1000g", "1000–1200g"] },
  { name: "Chinese Pomfret",          category: "frozen", image: "Chinese Pomfret.jpg",          variants: ["600–800g"] },
  { name: "Octopus",                  category: "frozen", image: "Octopus.jpg",                  variants: ["300–500g"] },
  { name: "Sabah Wild Tiger Prawn",   category: "frozen", image: "Sabah Wild Tiger Prawn.jpg",   variants: ["6/8", "8/10", "10/12"] },
  { name: "Clam",                     category: "frozen", image: "Clam.jpg",                     variants: ["500g/pkt"] },
  { name: "Frozen Tuna Saku",         category: "frozen", image: "Frozen Tuna Saku.jpg",         variants: [] },
  { name: "Fresh Frozen Lobster",     category: "frozen", image: "Fresh Frozen Lobster.jpg",     variants: [] },
  { name: "Frozen Marinated Abalone", category: "frozen", image: "Frozen Marinated Abalone.jpg", variants: [] },

  /* ---------- Live Seafood ---------- */
  { name: "Bighead Carp (Ikan Grass Carp)",  category: "live", image: "Bighead Carp (Ikan Grass Carp).jpg",  variants: [] },
  { name: "Tiger Grouper (Kerapu Harimau)",  category: "live", image: "Tiger Grouper (Kerapu Harimau).jpg",  variants: [] },
  { name: "Marble Goby (Ikan Soon Hock)",    category: "live", image: "Marble Goby (Ikan Soon Hock).jpg",    variants: [] },
  { name: "Coral Grouper (Kerapu Coral)",    category: "live", image: "Coral Grouper (Kerapu Coral).jpg",    variants: [] },
  { name: "Grass Carp (Ikan Grass Carp)",    category: "live", image: "Grass Carp (Ikan Grass Carp).jpg",    variants: [] },
  { name: "Live Lobster",                    category: "live", image: "Live Lobster.jpg",                    variants: [] },
  { name: "Mantis Shrimp (Udang Lipan)",     category: "live", image: "Mantis Shrimp (Udang Lipan).jpg",     variants: [] },
  { name: "Mud Crab (Ketam Nipah)",          category: "live", image: "Mud Crab (Ketam Nipah).jpg",          variants: [] },
  { name: "Flower Crab (Ketam Bunga)",       category: "live", image: "Flower Crab (Ketam Bunga).jpg",       variants: [] },
];

/* ---------- Dummy partner stockists / pickup points ----------
   Placeholder data — swap names/areas for real outlets later.   */
const MERCHANTS = [
  { name: "Lautbox @ Mont Kiara",   area: "Mont Kiara",   state: "Kuala Lumpur", note: "Flagship pickup point",     hours: "9am – 9pm" },
  { name: "Lautbox SS15",           area: "Subang Jaya",  state: "Selangor",     note: "Partner stockist",          hours: "10am – 8pm" },
  { name: "Lautbox Gurney",         area: "George Town",  state: "Penang",       note: "Partner stockist",          hours: "9am – 7pm" },
  { name: "Lautbox Austin",         area: "Johor Bahru",  state: "Johor",        note: "Pickup & cold chain hub",   hours: "9am – 9pm" },
  { name: "Lautbox KK Central",     area: "Kota Kinabalu",state: "Sabah",        note: "Source & dispatch point",   hours: "8am – 6pm" },
  { name: "Lautbox Riverside",      area: "Kuching",      state: "Sarawak",      note: "Partner stockist",          hours: "9am – 8pm" },
];
