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
    `<span style="display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:4px 10px;margin:2px 4px 2px 0;font-size:12px;color:#fff;">${escapeHtml(text)}</span>`;

  let rows = "";

  // ── SCREEN 1: About You ──
  if (fields.name || fields.company)
    rows += section("Client", `${escapeHtml(fields.name || "")}${fields.company ? `, ${escapeHtml(fields.company)}` : ""}`);

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

  // ── SCREEN 4: Audience ──
  if (fields.audience)
    rows += section("Ideal Customer", escapeHtml(fields.audience));

  if (fields.audience_pain)
    rows += section("Their Pain Points", escapeHtml(fields.audience_pain));

  if (fields.audience_channels)
    rows += section("Where They Hang Out", escapeHtml(fields.audience_channels));

  // ── SCREEN 5: Brand Personality ──
  if (personality.length)
    rows += section("Brand Personality", personality.map((s) => tag(s)).join(""));

  if (fields.brand_feeling)
    rows += section("Desired Feeling", escapeHtml(fields.brand_feeling));

  // ── SCREEN 6: Visual Direction ──
  const specEntries = Object.entries(spectrums);
  if (specEntries.length) {
    const vis = specEntries
      .map(([key, val]) => {
        const [left, right] = specLabels[key] || [key, key];
        const pct = val as number;
        const label = pct < 35 ? left : pct > 65 ? right : `${left}/${right} mix`;
        return `<div style="margin:4px 0;display:flex;align-items:center;gap:8px;">
          <span style="font-size:11px;color:#888;width:60px;">${left}</span>
          <div style="flex:1;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;position:relative;">
            <div style="position:absolute;left:0;top:0;height:4px;width:${pct}%;background:#CA2323;border-radius:2px;"></div>
          </div>
          <span style="font-size:11px;color:#888;width:60px;text-align:right;">${right}</span>
        </div>`;
      })
      .join("");
    rows += section("Visual Fingerprint", vis);
  }

  if (fields.visual_inspo)
    rows += section("Visual Inspiration", escapeHtml(fields.visual_inspo));

  // ── SCREEN 7: Competitors ──
  if (fields.competitors)
    rows += section("Competitors", escapeHtml(fields.competitors));

  if (fields.competitor_good)
    rows += section("What Competitors Do Well", escapeHtml(fields.competitor_good));

  if (fields.competitor_bad)
    rows += section("What Competitors Get Wrong", escapeHtml(fields.competitor_bad));

  // ── SCREEN 8: Timeline & Final ──
  if (fields.deadline)
    rows += section("Deadline", escapeHtml(fields.deadline));

  if (fields.budget)
    rows += section("Budget", escapeHtml(fields.budget));

  if (fields.anything_else)
    rows += section("Anything Else", escapeHtml(fields.anything_else));

  // Creative Directions
  const { directions } = data;
  if (directions && directions.length) {
    let dirHtml = directions.map(d => {
      const badge = d.recommended ? `<span style="display:inline-block;background:rgba(202,35,35,0.2);color:#CA2323;font-size:9px;font-weight:600;padding:2px 6px;border-radius:4px;margin-left:6px;text-transform:uppercase;letter-spacing:0.05em;">Best Match</span>` : '';
      const swatches = d.palette.map(c =>
        `<span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:${escapeHtml(c)};border:1px solid rgba(255,255,255,0.1);"></span>`
      ).join('');
      const refs = d.references.map(r =>
        `<span style="display:inline-block;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:100px;padding:2px 8px;font-size:10px;color:#aaa;">${escapeHtml(r)}</span>`
      ).join(' ');
      return `<div style="background:rgba(255,255,255,0.04);border:1px solid ${d.recommended ? '#CA2323' : 'rgba(255,255,255,0.08)'};border-radius:10px;padding:14px;margin-bottom:8px;">
        <div style="font-weight:700;font-size:14px;color:#fff;margin-bottom:4px;">${escapeHtml(d.name)}${badge}</div>
        <div style="font-size:11px;color:#999;margin-bottom:10px;line-height:1.5;">${escapeHtml(d.vibe)}</div>
        <div style="display:flex;gap:4px;margin-bottom:8px;">${swatches}</div>
        <div style="font-size:10px;color:#666;text-transform:uppercase;letter-spacing:0.08em;margin-top:8px;">Typography</div>
        <div style="font-size:11px;color:#bbb;margin:2px 0 6px;">${escapeHtml(d.typography)}</div>
        <div style="font-size:10px;color:#666;text-transform:uppercase;letter-spacing:0.08em;">Motion</div>
        <div style="font-size:11px;color:#bbb;margin:2px 0 6px;">${escapeHtml(d.motion)}</div>
        <div style="font-size:10px;color:#666;text-transform:uppercase;letter-spacing:0.08em;">References</div>
        <div style="margin-top:4px;">${refs}</div>
      </div>`;
    }).join('');
    rows += section("Creative Directions", dirHtml);
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
