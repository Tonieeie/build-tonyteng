import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 100, email: 200, company: 120, industry: 60, task: 60, message: 5000 } as const;

// Best-effort per-instance throttle: 5 requests / 10 min per IP.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function throttled(ip: string) {
  const now = Date.now();
  if (hits.size > 5000) hits.clear();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled → pretend success so bots move on.
  if (str(body.website, 200)) return Response.json({ ok: true });

  const name = str(body.name, LIMITS.name);
  const email = str(body.email, LIMITS.email);
  const company = str(body.company, LIMITS.company);
  const industry = str(body.industry, LIMITS.industry);
  const message = str(body.message, LIMITS.message);
  const tasks = (Array.isArray(body.tasks) ? body.tasks : [])
    .map((t) => str(t, LIMITS.task))
    .filter(Boolean)
    .slice(0, 12);

  if (!name || !EMAIL_RE.test(email) || (!tasks.length && message.length < 10)) {
    return Response.json(
      { error: "Please add your name, a valid email, and tick a box or write a short description." },
      { status: 422 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) {
    return Response.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return Response.json(
      { error: "The form isn't connected yet. Please try again later." },
      { status: 503 },
    );
  }

  const from = process.env.CONTACT_FROM_EMAIL || "build.tonyteng.dev <onboarding@resend.dev>";
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Business: ${company || "-"}`,
    `Type of business: ${industry || "-"}`,
    `What eats their week: ${tasks.length ? tasks.join(", ") : "-"}`,
    "",
    message || "(no extra details)",
  ].join("\n");

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    replyTo: email,
    subject: `New project request: ${name}${company ? ` (${company})` : ""}`,
    text,
  });

  if (error) {
    console.error("[contact] Resend error", error);
    return Response.json({ error: "Couldn't send right now. Please try again shortly." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
