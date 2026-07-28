import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";

interface Direction {
  name: string;
  vibe: string;
  palette: string[];
  typography: string;
  motion: string;
  references: string[];
  recommended: boolean;
  score: number;
}

interface QuestionnaireData {
  fields: Record<string, string>;
  build: string[];
  stage: string[];
  priorities: string[];
  personality: string[];
  voice: string[];
  content_status: string[];
  identity_state: string[];
  name_status: string[];
  brand_surfaces: string[];
  comms: string[];
  spectrums: Record<string, number>;
  directions: Direction[];
}

const specLabels: Record<string, [string, string]> = {
  tone: ["Dark", "Light"],
  volume: ["Loud", "Quiet"],
  finish: ["Polished", "Raw"],
  era: ["Modern", "Nostalgic"],
  mood: ["Playful", "Serious"],
  density: ["Dense", "Spacious"],
};

// Human-readable labels for coded values
const LABELS: Record<string, Record<string, string>> = {
  build: { website: "Website", brand: "Brand & naming", logo: "Logo", identity: "Visual identity" },
  stage: { idea: "Just an idea", "pre-launch": "Pre-launch", launched: "Launched", scaling: "Scaling" },
  priorities: {
    "from-zero": "Starting from scratch, no brand yet",
    "level-up": "Have something but it looks amateur",
    convert: "People aren't converting",
    consistency: "Brand is all over the place",
    standout: "We look like everyone else",
    launch: "Launching soon, need to come out loud",
  },
  voice: { plainspoken: "Plainspoken", poetic: "Poetic", "bold-voice": "Bold", "warm-voice": "Warm", technical: "Technical", witty: "Witty" },
  content_status: { "copy-ready": "Copy ready", "images-ready": "Images ready", "need-copy": "Need help with copy", "need-images": "Need help with images" },
  identity_state: { "from-scratch": "Starting from scratch", evolving: "Evolving what exists", "keep-assets": "Have assets to keep" },
  name_status: { "name-locked": "Name is locked", "open-naming": "Open to naming help", "need-name": "Need a name" },
  brand_surfaces: { digital: "Digital / product", social: "Social", motion: "Motion / video", print: "Print", merch: "Merch", packaging: "Packaging", signage: "Signage" },
  comms: { email: "Email", slack: "Slack / Discord", calls: "Calls", "async-video": "Async video (Loom)", text: "WhatsApp / text" },
};

const lab = (group: string, v: string): string => LABELS[group]?.[v] || v.replace(/-/g, " ");

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmail(data: QuestionnaireData): string {
  const {
    fields, build, stage, priorities, personality,
    voice, content_status, identity_state, name_status, brand_surfaces, comms, spectrums,
  } = data;

  const section = (label: string, content: string) => `
    <tr>
      <td style="padding:16px 20px;border-bottom:1px solid #1a1a1a;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#CA2323;">${label}</p>
        <div style="font-size:14px;color:#e0e0e0;line-height:1.6;">${content}</div>
      </td>
    </tr>`;

  const tag = (text: string) =>
    `<span style="display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:4px 10px;margin:3px 6px 3px 0;font-size:12px;color:#fff;">${escapeHtml(text)}</span> `;

  const tags = (group: string, arr: string[]) => arr.map((v) => tag(lab(group, v))).join("");
  const field = (v?: string) => (v ? escapeHtml(v) : "");

  let rows = "";

  // ── Client ──
  if (fields.name || fields.company)
    rows += section("Client", `${escapeHtml(fields.name || "")}${fields.company ? `, ${escapeHtml(fields.company)}` : ""}${fields.email ? `<br><span style="color:#888;">${escapeHtml(fields.email)}</span>` : ""}`);

  // ── Engagement ──
  if (build.length) rows += section("Building", tags("build", build));
  if (fields.first_priority) rows += section("Starting With", field(fields.first_priority));
  if (fields.deadline) rows += section("Deadline", field(fields.deadline));

  // ── Business ──
  if (fields.website) rows += section("Site / Socials", field(fields.website));
  if (fields.oneliner) rows += section("What They Do", field(fields.oneliner));
  if (stage.length) rows += section("Stage", tags("stage", stage));
  if (fields.goal) rows += section("6-Month Goal", field(fields.goal));

  // ── Positioning ──
  if (fields.audience) rows += section("Who It's For", field(fields.audience));
  if (fields.competitors) rows += section("Up Against", field(fields.competitors));
  if (fields.differentiator) rows += section("What Makes Them Different", field(fields.differentiator));
  if (fields.feeling) rows += section("Wants People To Feel", field(fields.feeling));
  if (priorities.length)
    rows += section("What Matters Most", priorities.map((p, i) => `<div style="margin:2px 0;"><span style="color:#CA2323;font-weight:600;">${i + 1}.</span> ${escapeHtml(lab("priorities", p))}</div>`).join(""));

  // ── Visual fingerprint ──
  const specEntries = Object.entries(spectrums);
  if (specEntries.length) {
    const vis = specEntries
      .map(([key, val]) => {
        const [left, right] = specLabels[key] || [key, key];
        const pct = val as number;
        const leaning = pct < 30 ? `strong ${left.toLowerCase()}` : pct < 45 ? `leaning ${left.toLowerCase()}` : pct > 70 ? `strong ${right.toLowerCase()}` : pct > 55 ? `leaning ${right.toLowerCase()}` : "neutral";
        return `<div style="margin:6px 0;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:3px;">
            <span style="font-size:12px;color:#e0e0e0;font-weight:600;">${left} / ${right}</span>
            <span style="font-size:11px;color:#CA2323;font-weight:600;">${pct}%</span>
          </div>
          <div style="font-size:11px;color:#888;margin-bottom:2px;">${leaning} &mdash; 0% = full ${left.toLowerCase()}, 100% = full ${right.toLowerCase()}</div>
        </div>`;
      })
      .join("");
    rows += section("Visual Fingerprint (Raw Data)", vis);
  }
  if (fields.colors_avoid) rows += section("Colors Off-Limits", field(fields.colors_avoid));
  if (personality.length) rows += section("Brand Personality", personality.map((s) => tag(s)).join(""));
  if (fields.visual_inspo) rows += section("Visual Inspiration", field(fields.visual_inspo));

  // ── Voice ──
  if (fields.tagline) rows += section("Current Tagline", field(fields.tagline));
  if (fields.headline) rows += section("Headline Seed", `&ldquo;${field(fields.headline)}&rdquo;`);
  if (fields.not_you) rows += section("Not Them", field(fields.not_you));
  if (voice.length) rows += section("Voice", tags("voice", voice));

  // ── Website (only if relevant) ──
  const hasWebsite = build.includes("website") || fields.pages || fields.primary_action || fields.features || fields.ref_sites || fields.domain || content_status.length;
  if (hasWebsite) {
    let web = "";
    if (fields.pages) web += `<p style="margin:0 0 8px;"><strong style="color:#fff;">Pages:</strong> ${field(fields.pages)}</p>`;
    if (fields.primary_action) web += `<p style="margin:0 0 8px;"><strong style="color:#fff;">Primary action:</strong> ${field(fields.primary_action)}</p>`;
    if (fields.features) web += `<p style="margin:0 0 8px;"><strong style="color:#fff;">Features / integrations:</strong> ${field(fields.features)}</p>`;
    if (content_status.length) web += `<p style="margin:0 0 8px;"><strong style="color:#fff;">Content:</strong><br>${tags("content_status", content_status)}</p>`;
    if (fields.content_owner) web += `<p style="margin:0 0 8px;"><strong style="color:#fff;">Copy / images by:</strong> ${field(fields.content_owner)}</p>`;
    if (fields.ref_sites) web += `<p style="margin:0 0 8px;"><strong style="color:#fff;">Reference sites:</strong> ${field(fields.ref_sites)}</p>`;
    if (fields.domain) web += `<p style="margin:0;"><strong style="color:#fff;">Domain / hosting:</strong> ${field(fields.domain)}</p>`;
    if (web) rows += section("Website", web);
  }

  // ── Brand & identity (only if relevant) ──
  const hasIdentity = build.some((b) => ["brand", "logo", "identity"].includes(b)) || identity_state.length || name_status.length || brand_surfaces.length || fields.existing_assets || fields.brand_story || fields.avoid_brands;
  if (hasIdentity) {
    let id = "";
    if (identity_state.length) id += `<p style="margin:0 0 8px;"><strong style="color:#fff;">Starting point:</strong><br>${tags("identity_state", identity_state)}</p>`;
    if (name_status.length) id += `<p style="margin:0 0 8px;"><strong style="color:#fff;">Name:</strong><br>${tags("name_status", name_status)}</p>`;
    if (brand_surfaces.length) id += `<p style="margin:0 0 8px;"><strong style="color:#fff;">Brand lives on:</strong><br>${tags("brand_surfaces", brand_surfaces)}</p>`;
    if (fields.existing_assets) id += `<p style="margin:0 0 8px;"><strong style="color:#fff;">Keep:</strong> ${field(fields.existing_assets)}</p>`;
    if (fields.brand_story) id += `<p style="margin:0 0 8px;"><strong style="color:#fff;">Story / symbolism:</strong> ${field(fields.brand_story)}</p>`;
    if (fields.avoid_brands) id += `<p style="margin:0;"><strong style="color:#fff;">Do not look like:</strong> ${field(fields.avoid_brands)}</p>`;
    if (id) rows += section("Brand & Identity", id);
  }

  // ── Logistics ──
  if (fields.approvers) rows += section("Signs Off", field(fields.approvers));
  if (comms.length) rows += section("Comms Preference", tags("comms", comms));
  if (fields.budget) rows += section("Budget", field(fields.budget));
  if (fields.assets_links) rows += section("Files / References", field(fields.assets_links));
  if (fields.anything_else) rows += section("Anything Else", field(fields.anything_else));

  // ── Auto-suggested directions (internal reference only) ──
  const { directions } = data;
  if (directions && directions.length) {
    const dirHtml = directions
      .map((d) => {
        const marker = d.recommended ? " ★" : "";
        const score = Math.round(d.score);
        return `<div style="margin:4px 0;font-size:12px;color:#bbb;">
        <span style="color:#e0e0e0;font-weight:600;">${escapeHtml(d.name)}${marker}</span>
        <span style="color:#666;"> · score: ${score} · </span>
        <span style="color:#888;">${d.references.join(", ")}</span>
      </div>`;
      })
      .join("");
    rows += section("Auto-Suggested Directions (internal)", `<div style="font-size:11px;color:#666;margin-bottom:6px;">Generated from slider + type + personality data. Reference for you, not shown to the client.</div>${dirHtml}`);
  }

  const clientName = fields.name || fields.company || "Unknown";
  const date = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000;font-family:-apple-system,system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:16px;"><tr>
      <td style="vertical-align:middle;padding-left:0;">
        <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#CA2323;">New Discovery</p>
        <p style="margin:2px 0 0;font-size:18px;font-weight:700;color:#fff;">${escapeHtml(clientName)}</p>
        <p style="margin:2px 0 0;font-size:11px;color:#666;">${date}</p>
      </td>
    </tr></table>

    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#111;border-radius:12px;border:1px solid #222;overflow:hidden;">
      ${rows}
    </table>

    <p style="margin:24px 0 0;font-size:11px;color:#444;text-align:center;">Rizzy Today &middot; rizzy.today/discovery</p>
  </div>
</body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFICATION_EMAIL;

  if (!apiKey || !notifyEmail) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const data = req.body as QuestionnaireData;
    const clientName = data.fields?.name || data.fields?.company || "New Client";

    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Rizzy Today <studio@whatsfordinner.fit>",
      to: notifyEmail,
      subject: `Discovery: ${clientName}`,
      html: buildEmail(data),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Questionnaire email error:", err);
    return res.status(500).json({ error: "Failed to send" });
  }
}
