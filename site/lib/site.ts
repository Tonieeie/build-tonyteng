// All site copy. Written for business owners who don't know (or care) how AI works:
// talk about their week, not about technology.

export const site = {
  url: "https://build.tonyteng.dev",
  domain: "build.tonyteng.dev",
  name: "Custom AI Solutions",
  owner: "Tony Teng",
  ownerUrl: "https://tonyteng.dev",
  title: "Less admin. Better tools. No IT team needed. — Tony Teng",
  description:
    "Automation, websites and business tools for small businesses without an IT team. Setup, a walkthrough and optional ongoing care. Free demo before you commit.",
};

export const nav = [
  { href: "#services", label: "Services & support" },
  { href: "#work", label: "Examples" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export const proof = [
  { t: "Free demo first", d: "See it working on your real task before you spend anything." },
  { t: "Works with what you use", d: "Xero, MYOB, Gmail, Shopify, your booking system, even a spreadsheet." },
  { t: "Someone to call after launch", d: "Deal directly with me, with optional ongoing care. See services and support below." },
] as const;

/** "Sound familiar?" — the owner's own words, then what changes. */
export const pains = [
  {
    said: "I spend Friday afternoons typing receipts into Xero.",
    fix: "They're read, sorted and checked for you. You just glance and approve.",
  },
  {
    said: "Customers message at 10pm and I reply the next day.",
    fix: "They get an answer in seconds, and a booking if they want one.",
  },
  {
    said: "Writing a quote takes me an hour.",
    fix: "Describe the job in a voice note or a few lines. Get a quote ready to send.",
  },
  {
    said: "I hate chasing people who haven't paid.",
    fix: "Friendly reminders go out on schedule and stop the moment they pay.",
  },
  {
    said: "I copy the same details into three different systems.",
    fix: "Type it once. The other places update themselves.",
  },
  {
    said: "My website is slow and nobody finds it on Google.",
    fix: "A fast, modern site built around your product, set up to show up in search.",
  },
] as const;

export const cases = [
  {
    n: "01",
    label: "Online forms",
    title: "Type it once. The forms fill themselves.",
    image: "/media/case-forms-v2.jpg",
    alt: "You add a row to a spreadsheet, the AI helper fills in a supplier sign-up form on a website, and the reference number is saved back to the sheet",
    problem:
      "You copy the same details into supplier portals, government forms or booking sites, one box at a time, again and again.",
    how: "Add the details to your spreadsheet once. Your AI helper opens the website, fills in every box, sends it and saves the reference number back to your sheet, day or night.",
    goodFor: ["Supplier sign-ups", "Council & government forms", "Listings", "Insurance claims"],
  },
  {
    n: "02",
    label: "Websites",
    title: "Your product, on a website that sells.",
    image: "/media/case-web-3d-v2.jpg",
    alt: "A product website being built around a ceramic mug, with a 3D close-up of hot chocolate pouring into the mug",
    problem:
      "Your product is good, but your website is slow, awkward on a phone or doesn't exist yet, and people can't find you on Google.",
    how: "Send a few photos and notes. You get a fast, good-looking site built around your product, tuned to load quickly, work on every phone and show up in search, so visitors turn into orders and enquiries.",
    goodFor: ["Product launches", "Online shops", "Local services", "Landing pages"],
  },
  {
    n: "03",
    label: "Custom apps",
    title: "A receipt app, built just for you.",
    image: "/media/case-app-v2.jpg",
    alt: "A custom receipt app on a phone scans a receipt, the AI helper reads the store, date and total, and it is saved to the business's own database and cloud",
    problem:
      "Receipts pile up in wallets, utes and inboxes, and someone types them into a spreadsheet or the accounts by hand.",
    how: "I build you a simple app for your phone. Snap a receipt and your AI helper reads the store, date and total, sorts it, and uploads it straight to your own cloud storage or database. It can send a copy to Xero or MYOB too.",
    goodFor: ["Receipts & expenses", "Field teams", "Delivery dockets", "Stock checks"],
  },
] as const;

export const industries = [
  {
    id: "trades",
    name: "Trades & home services",
    blurb: "Plumbers, electricians, builders, cleaners, landscapers.",
    examples: [
      "Missed a call on the tools? The customer gets a text straight back asking what they need, and the job lands in your calendar.",
      "Quotes from a voice note or a few photos, in your branding, ready to send.",
      "Receipts from the ute snapped on your phone and sorted for BAS.",
      "Polite payment reminders until every invoice is paid.",
    ],
  },
  {
    id: "clinics",
    name: "Clinics & allied health",
    blurb: "Physios, dentists, psychologists, vets, beauty clinics.",
    examples: [
      "Reminders and easy rebooking by text, so fewer empty appointments.",
      "Someone cancels? The next person on the waitlist is offered the spot.",
      "After-hours questions about fees, parking and availability answered straight away.",
      "Set up to fit your practice software and your privacy obligations.",
    ],
  },
  {
    id: "property",
    name: "Real estate & property",
    blurb: "Agencies, property managers, landlords.",
    examples: [
      "A tenant sends a photo of a leak. The job is logged, a tradie is contacted and the owner gets an update.",
      "Listing enquiries answered at any hour, with inspection times offered.",
      "Rent reminders, entry notices and lease renewals drafted and sent on time.",
    ],
  },
  {
    id: "shops",
    name: "Online shops",
    blurb: "Shopify, WooCommerce and marketplace sellers.",
    examples: [
      "“Where's my order?” answered day and night from your tracking info.",
      "Returns handled by your rules. Anything unusual comes to you.",
      "Product descriptions written from a photo and a few notes.",
    ],
  },
  {
    id: "accounting",
    name: "Accountants & bookkeepers",
    blurb: "Practices and sole bookkeepers.",
    examples: [
      "Clients reminded automatically until every document is in.",
      "Receipts and bills read and coded into Xero, with anything odd flagged.",
      "A monthly summary for each client, drafted from the books.",
    ],
  },
] as const;

export const steps = [
  {
    n: "01",
    title: "Tell me what's eating your week",
    body: "Plain English is perfect, no tech words needed. If you can, send an example: a receipt, a screenshot, the question customers keep asking.",
  },
  {
    n: "02",
    title: "Get a free working demo",
    body: "I build a demo on your real task so you can watch it work. You don't pay anything at this stage.",
  },
  {
    n: "03",
    title: "I set it up and show you how to use it",
    body: "You approve a fixed quote before any paid work starts. I build and connect it, then walk you and your team through the everyday steps.",
  },
  {
    n: "04",
    title: "Choose the support you need",
    body: "Want me to look after it? We agree an optional care plan for ongoing checks, fixes and small changes. You know what's covered and what it costs before signing up.",
  },
] as const;

/** Prices in AUD. Change here and they update everywhere (pricing section + FAQ). */
export const pricing = {
  small: "A$800",
  projectRange: "A$2,000–6,000",
  care: "A$99",
  running: "A$10–50",
  tiers: [
    { name: "Demo", price: "Free", unit: "", body: "A working demo on your real task. Yours to judge." },
    { name: "Small helper", price: "from A$800", unit: "one-off", body: "One job handled end to end, like receipts into Xero or payment reminders." },
    { name: "Bigger project", price: "A$2,000–6,000", unit: "typical", body: "Several steps or apps, a customer assistant, or a website." },
    { name: "Care plan", price: "from A$99", unit: "/month, optional", body: "Ongoing checks, fixes and small changes within an agreed scope. Larger additions are quoted separately." },
  ],
} as const;

export const services = [
  {
    icon: "flow",
    label: "Automate",
    title: "Less repetitive admin",
    body: "Get the routine jobs off your plate, using the software your business already runs on.",
    points: ["Receipts and invoices entered for you", "Customer replies and booking reminders", "Details passed between your apps"],
    href: "#work",
    link: "See everyday examples",
  },
  {
    icon: "browser",
    label: "Build",
    title: "Websites & business tools",
    body: "A website or simple app built around how you work. I handle the setup and show you how to use it.",
    points: ["Websites that help customers enquire", "Booking, job and receipt tools", "A walkthrough for you and your team"],
    href: "/work",
    link: "See past projects",
  },
  {
    icon: "care",
    label: "Look after",
    title: "Support after launch",
    body: "Keep the person who built it on hand to look after it. Optional care covers ongoing checks, fixes and small changes within an agreed scope.",
    points: ["Deal directly with me", "Know what's covered before you start", "Larger additions quoted separately"],
    href: "#pricing",
    link: "See pricing and running costs",
  },
] as const;

export const faqs = [
  {
    q: "Who looks after it once it's running?",
    a: `You can choose an optional care plan from ${pricing.care}/month. I handle ongoing checks, fixes and small changes within the scope we agree before you sign up. Larger additions are quoted separately. Without a care plan, ongoing maintenance isn't included in the project price.`,
  },
  {
    q: "Do I need technical skills or an IT team?",
    a: "No. Describe the problem in your own words. I handle the build and setup, and show you and your team how to use it. If I need access to an account, I explain what is needed and help you through it.",
  },
  {
    q: "How much does it cost?",
    a: `The demo is free. Small helpers start from ${pricing.small} and most projects land between ${pricing.projectRange}. You get a fixed quote after the demo, before you pay anything.`,
  },
  {
    q: "What does it cost to keep running?",
    a: `Usually ${pricing.running} a month for the AI and hosting, paid straight to those providers at cost. The optional care plan (from ${pricing.care}/month) covers ongoing checks, fixes and small changes within our agreed scope.`,
  },
  {
    q: "What if it makes a mistake?",
    a: "You decide how much it does on its own. Anything important, like refunds, payments or unusual cases, can wait for your OK first.",
  },
  {
    q: "Is my data safe?",
    a: "Your data stays in your own accounts wherever possible, and I only ask for the access each job actually needs. Nothing sensitive is needed for the demo.",
  },
  {
    q: "Do I have to change the software I use?",
    a: "Usually not. It works with what you already have: Xero, MYOB, Gmail, Outlook, Shopify, your booking system or a plain spreadsheet.",
  },
  {
    q: "What if the demo isn't right?",
    a: "Tell me what's missing. If it's still not what you need, you walk away and owe nothing.",
  },
] as const;

/** Contact form quick picks. */
export const taskOptions = [
  "Workflow automation",
  "Replying to customers",
  "Chasing payments",
  "Quotes",
  "Copying data between apps",
  "Reports",
  "App development",
  "Website",
  "Something else",
] as const;

export const businessTypes = [...industries.map((i) => i.name), "Something else"] as const;

/** Past projects (sub-page /work). Project previews, without client links. */
export const projects = [
  {
    id: "hotel",
    title: "Hotel website",
    type: "Website · Hospitality",
    image: "/work/hotel-desktop.jpg",
    video: "/work/hotel-desktop.mp4",
    alt: "Hotel website desktop tour, scrolling from the aerial opening through the interiors and dining spaces",
    summary: "A cinematic website for a resort hotel, built to feel like arriving there.",
    points: ["Full-screen aerial video and imagery", "Chinese-language content, designed mobile-first", "Fast to load on phones"],
  },
  {
    id: "insurance",
    title: "Health insurance comparison platform",
    type: "Web app · Insurance",
    image: "/work/insurance-v2.jpg",
    alt: "An insurance comparison site shown on a laptop and phone, with a quote form",
    summary: "Helps international students and visitors compare health cover and request a quote in minutes.",
    points: ["Compares 27 policies from 9 insurers", "Instant quote form and visa guide", "English and Chinese"],
  },
  {
    id: "agency",
    title: "Digital marketing agency website",
    type: "Website · Marketing",
    image: "/work/agency-desktop.jpg",
    video: "/work/agency-desktop.mp4",
    alt: "Marketing agency website desktop preview with a rotating particle swan",
    summary: "A bold agency site with an animated hero that turns visitors into enquiries.",
    points: ["Interactive particle animation", "Services, projects and careers pages", "English and Chinese"],
  },
  {
    id: "rv",
    title: "Caravan & RV website",
    type: "Website · Recreational vehicles",
    image: "/work/rv-homepage.jpg",
    video: "/work/rv-homepage.mp4",
    alt: "Caravan and RV website homepage video showing off-road caravans in the Australian outdoors",
    summary: "Helps buyers explore off-road caravans, understand their features and request a quote.",
    points: ["Caravan ranges organised by size", "Detailed product and feature pages", "Quote enquiries and helpful buying guides"],
  },
] as const;
