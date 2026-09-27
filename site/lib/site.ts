// All site copy. Written for business owners who don't know (or care) how AI works:
// talk about their week, not about technology.

export const site = {
  url: "https://build.tonyteng.dev",
  domain: "build.tonyteng.dev",
  name: "Custom AI Solutions",
  owner: "Tony Teng",
  ownerUrl: "https://tonyteng.dev",
  title: "Custom AI Solutions — Hand off the boring parts of your business",
  description:
    "Workflow automation, AI helpers, websites and custom apps for small businesses, working with the apps you already use. Free demo first, and you only pay if you go ahead.",
};

export const nav = [
  { href: "#work", label: "Examples" },
  { href: "#industries", label: "Who it's for" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export const proof = [
  { t: "Free demo first", d: "See it working on your real task before you spend anything." },
  { t: "Works with what you use", d: "Xero, MYOB, Gmail, Shopify, your booking system, even a spreadsheet." },
  { t: "A real person, start to finish", d: "No call centre, no hand-offs. You deal directly with the person who builds it." },
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
    image: "/media/case-forms.jpg",
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
    image: "/media/case-web-3d.jpg",
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
    image: "/media/case-app.jpg",
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
    title: "Like it? Then we set it up properly",
    body: "You get a fixed quote before any paid work starts. If the demo isn't right for you, you walk away and owe nothing.",
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
    { name: "Care plan", price: "from A$99", unit: "/month, optional", body: "I keep an eye on it, fix anything that breaks and make small changes." },
  ],
} as const;

export const capabilities = [
  { icon: "flow", title: "Workflow automation", body: "The repetitive steps between your inbox, spreadsheets, forms and apps, done for you around the clock.", span: 2 },
  { icon: "chat", title: "Answer customers 24/7", body: "Replies from your own prices, hours and FAQs.", span: 1 },
  { icon: "file", title: "Type up receipts & bills", body: "Read, sorted, checked and filed in your accounts.", span: 1 },
  { icon: "app", title: "App development", body: "Custom apps for your phone or your team: receipt scanners, job sheets, booking and stock apps, saving straight to your own cloud or database.", span: 2 },
  { icon: "money", title: "Chase payments", body: "Polite reminders until the money's in.", span: 1 },
  { icon: "quote", title: "Quotes & proposals", body: "From a voice note to a document ready to send.", span: 1 },
  {
    icon: "cube",
    title: "3D demo videos",
    body: "Animated 3D walkthroughs of your product, shop or idea. For pitches, launch pages and social posts.",
    span: 2,
  },
  { icon: "chart", title: "Reports that write themselves", body: "Your weekly numbers, delivered without the copy-paste.", span: 1 },
  { icon: "plugs", title: "Connect your apps", body: "Xero, Shopify, Gmail and your booking system, finally talking to each other.", span: 1 },
  { icon: "calendar", title: "Bookings & reminders", body: "Fewer no-shows, fuller calendars.", span: 1 },
  { icon: "book", title: "A helper for your staff", body: "Answers questions from your own manuals and procedures.", span: 1 },
  { icon: "browser", title: "Websites & online shops", body: "Fast sites built around your product that show up on Google.", span: 1 },
  { icon: "game", title: "Games & fun projects", body: "Promo games, quizzes and interactive experiences.", span: 1 },
] as const;

export const ideas = [
  "Text back every missed call",
  "Sort receipts for BAS",
  "Remind clients before appointments",
  "Draft quotes from voice notes",
  "Chase unpaid invoices politely",
  "Answer “where's my order?”",
  "Send the Monday report automatically",
  "Offer cancelled slots to the waitlist",
  "Turn our product into a 3D launch video",
  "Build a booking site for my studio",
  "A receipt app for my team",
  "Automate our weekly supplier orders",
];

export const faqs = [
  {
    q: "Do I need to know anything about AI?",
    a: "No. Tell me what eats your week in plain English. I handle the technical side and show you the result working.",
  },
  {
    q: "How much does it cost?",
    a: `The demo is free. Small helpers start from ${pricing.small} and most projects land between ${pricing.projectRange}. You get a fixed quote after the demo, before you pay anything.`,
  },
  {
    q: "What does it cost to keep running?",
    a: `Usually ${pricing.running} a month for the AI and hosting, paid straight to those providers at cost. The optional care plan (from ${pricing.care}/month) covers me keeping an eye on it.`,
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

/** Past projects (sub-page /work). Shown as images only: no client names, no links. */
export const projects = [
  {
    id: "hotel",
    title: "Hotel website",
    type: "Website · Hospitality",
    image: "/work/hotel-v2.jpg",
    alt: "A hotel website shown on a laptop and phone, with an aerial photo of the hotel in the desert",
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
    image: "/work/agency-v2.jpg",
    alt: "A marketing agency website shown on a laptop and phone, with an animated particle swan",
    summary: "A bold agency site with an animated hero that turns visitors into enquiries.",
    points: ["Interactive particle animation", "Services, projects and careers pages", "English and Chinese"],
  },
  {
    id: "covers",
    title: "Social media cover studio",
    type: "Internal tool · Marketing",
    image: "/work/covers-v2.jpg",
    alt: "A tool for making branded social media cover images, shown on a laptop and phone",
    summary: "Staff pick a template, drop in a photo and download an on-brand cover. No designer needed.",
    points: ["14 brand templates", "Pick, upload, download", "Consistent branding across the team"],
  },
] as const;
