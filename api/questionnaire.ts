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
  services: string[];
  extras: string[];
  priorities: string[];
  personality: string[];
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmail(data: QuestionnaireData): string {
  const { fields, services, extras, priorities, personality, spectrums } = data;

  const section = (label: string, content: string) => `
    <tr>
      <td style="padding:16px 20px;border-bottom:1px solid #1a1a1a;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#CA2323;">${label}</p>
        <div style="font-size:14px;color:#e0e0e0;line-height:1.6;">${content}</div>
      </td>
    </tr>`;

  const tag = (text: string) =>
    `<span style="display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:4px 10px;margin:3px 6px 3px 0;font-size:12px;color:#fff;">${escapeHtml(text)}</span> `;

  let rows = "";

  // ── SCREEN 1: About You ──
  if (fields.name || fields.company)
    rows += section("Client", `${escapeHtml(fields.name || "")}${fields.company ? `, ${escapeHtml(fields.company)}` : ""}${fields.email ? `<br><span style="color:#888;">${escapeHtml(fields.email)}</span>` : ""}`);

  if (fields.website)
    rows += section("Website", escapeHtml(fields.website));

  if (fields.oneliner)
    rows += section("What They Do", escapeHtml(fields.oneliner));

  // ── SCREEN 2: Services ──
  if (services.length)
    rows += section("Services", services.map((s) => tag(s.replace(/-/g, " "))).join(""));

  if (extras.length)
    rows += section("Extras", extras.map((s) => tag(s)).join(""));

  // ── SCREEN 3: The Gap ──
  if (fields.problem)
    rows += section("The Problem", escapeHtml(fields.problem));

  if (priorities.length)
    rows += section("Top Priorities", priorities.map((p, i) => `<div style="margin:2px 0;"><span style="color:#CA2323;font-weight:600;">${i + 1}.</span> ${escapeHtml(p.replace(/-/g, " "))}</div>`).join(""));

  // ── Audience & Competitors ──
  if (fields.audience)
    rows += section("Who It's For", escapeHtml(fields.audience));

  if (fields.competitors)
    rows += section("Competitors", escapeHtml(fields.competitors));

  // ── Visual Direction ──
  if (personality.length)
    rows += section("Brand Personality", personality.map((s) => tag(s)).join(""));

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

  if (fields.visual_inspo)
    rows += section("Visual Inspiration", escapeHtml(fields.visual_inspo));

  // ── Wrap Up ──
  if (fields.deadline)
    rows += section("Deadline", escapeHtml(fields.deadline));

  if (fields.budget)
    rows += section("Budget", escapeHtml(fields.budget));

  if (fields.referral)
    rows += section("How They Found Us", escapeHtml(fields.referral));

  if (fields.anything_else)
    rows += section("Anything Else", escapeHtml(fields.anything_else));

  // Creative Directions — compact summary, not the main event
  const { directions } = data;
  if (directions && directions.length) {
    const dirHtml = directions.map(d => {
      const marker = d.recommended ? " ★" : "";
      const score = Math.round(d.score);
      return `<div style="margin:4px 0;font-size:12px;color:#bbb;">
        <span style="color:#e0e0e0;font-weight:600;">${escapeHtml(d.name)}${marker}</span>
        <span style="color:#666;"> — score: ${score} — </span>
        <span style="color:#888;">${d.references.join(", ")}</span>
      </div>`;
    }).join('');
    rows += section("Auto-Suggested Directions (starting points)", `<div style="font-size:11px;color:#666;margin-bottom:6px;">Algorithm-generated from slider + personality data. Use as reference, not prescription.</div>${dirHtml}`);
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
        <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#CA2323;">New Questionnaire</p>
        <p style="margin:2px 0 0;font-size:18px;font-weight:700;color:#fff;">${escapeHtml(clientName)}</p>
        <p style="margin:2px 0 0;font-size:11px;color:#666;">${date}</p>
      </td>
    </tr></table>

    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#111;border-radius:12px;border:1px solid #222;overflow:hidden;">
      ${rows}
    </table>

    <p style="margin:24px 0 0;font-size:11px;color:#444;text-align:center;">Rizzy Studio &middot; rizzy.today/discovery</p>
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
      from: "Rizzy Studio <studio@whatsfordinner.fit>",
      to: notifyEmail,
      subject: `Questionnaire: ${clientName}`,
      html: buildEmail(data),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Questionnaire email error:", err);
    return res.status(500).json({ error: "Failed to send" });
  }
}
