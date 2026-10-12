import { EXCERPT_MAX, TITLE_MAX } from "./types";
import { truncate } from "./format";

/**
 * Conversion d'un post de la chaîne WhatsApp en news :
 * 1re ligne → titre, reste → contenu HTML, hashtags → mots-clés.
 */

export type WhatsAppOptions = {
  /** *gras*, _italique_, ~barré~ et ```code``` convertis en HTML. */
  convertFormatting: boolean;
  /** Hashtags retirés du texte (ils restent dans les mots-clés). */
  removeHashtags: boolean;
  removeEmojis: boolean;
};

export type PreparedPost = {
  title: string;
  excerpt: string;
  html: string;
  keywords: string[];
};

const EMOJI =
  /(?:\p{Extended_Pictographic}|\p{Regional_Indicator})(?:️|[\u{1F3FB}-\u{1F3FF}]|‍(?:\p{Extended_Pictographic}|\p{Regional_Indicator}))*️?/gu;
const HASHTAG = /(^|[^\p{L}\p{N}_&#/])#([\p{L}\p{N}_]{2,50})/gu;
const URL_PATTERN = /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"])/g;

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function applyFormatting(escaped: string) {
  return escaped
    .replace(/```([^`]+?)```/g, "<code>$1</code>")
    .replace(/(^|[\s(])\*(?!\s)([^*\n]+?)(?<!\s)\*(?=$|[\s).,!?:;])/g, "$1<strong>$2</strong>")
    .replace(/(^|[\s(])_(?!\s)([^_\n]+?)(?<!\s)_(?=$|[\s).,!?:;])/g, "$1<em>$2</em>")
    .replace(/(^|[\s(])~(?!\s)([^~\n]+?)(?<!\s)~(?=$|[\s).,!?:;])/g, "$1<s>$2</s>");
}

function stripFormatting(text: string) {
  return text
    .replace(/```([^`]+?)```/g, "$1")
    .replace(/(^|[\s(])([*_~])(?!\s)([^*_~\n]+?)(?<!\s)\2(?=$|[\s).,!?:;])/g, "$1$3");
}

/** Texte d'une ligne → HTML en ligne (liens cliquables, mise en forme). */
function inlineHtml(text: string, convertFormatting: boolean) {
  return text
    .split(URL_PATTERN)
    .map((part, index) => {
      if (index % 2 === 1) {
        const href = escapeHtml(part);
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${href}</a>`;
      }
      const escaped = escapeHtml(part);
      return convertFormatting ? applyFormatting(escaped) : escaped;
    })
    .join("");
}

function cleanLine(line: string, options: Pick<WhatsAppOptions, "removeHashtags" | "removeEmojis">) {
  let result = line;
  if (options.removeEmojis) result = result.replace(EMOJI, "");
  if (options.removeHashtags) result = result.replace(HASHTAG, "$1");
  return result.replace(/[ \t]{2,}/g, " ").trim();
}

export function extractHashtags(text: string) {
  const tags = new Map<string, string>();
  for (const match of text.matchAll(HASHTAG)) {
    const tag = match[2];
    if (!tags.has(tag.toLowerCase())) tags.set(tag.toLowerCase(), tag);
  }
  return [...tags.values()];
}

type Block =
  | { type: "p"; lines: string[] }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "quote"; lines: string[] };

const BULLET = /^(?:[-•●▪◦]|\*(?=\s))\s+/;
const NUMBERED = /^\d{1,3}[.)]\s+/;
const QUOTE = /^>\s?/;

function toBlocks(lines: string[]) {
  const blocks: Block[] = [];
  let current = null as Block | null;

  for (const line of lines) {
    if (!line) {
      if (current) blocks.push(current);
      current = null;
      continue;
    }

    const listType = BULLET.test(line) ? "ul" : NUMBERED.test(line) ? "ol" : null;
    if (listType) {
      const item = line.replace(listType === "ul" ? BULLET : NUMBERED, "");
      if (current?.type === listType) {
        current.items.push(item);
      } else {
        if (current) blocks.push(current);
        current = { type: listType, items: [item] };
      }
      continue;
    }

    const type = QUOTE.test(line) ? "quote" : "p";
    const text = type === "quote" ? line.replace(QUOTE, "") : line;
    if (current?.type === type) {
      current.lines.push(text);
    } else {
      if (current) blocks.push(current);
      current = { type, lines: [text] };
    }
  }
  if (current) blocks.push(current);
  return blocks;
}

function blocksToHtml(blocks: Block[], convertFormatting: boolean) {
  const inline = (text: string) => inlineHtml(text, convertFormatting);
  return blocks
    .map((block) => {
      switch (block.type) {
        case "ul":
        case "ol":
          return `<${block.type}>${block.items.map((item) => `<li><p>${inline(item)}</p></li>`).join("")}</${block.type}>`;
        case "quote":
          return `<blockquote><p>${block.lines.map(inline).join("<br>")}</p></blockquote>`;
        default:
          return `<p>${block.lines.map(inline).join("<br>")}</p>`;
      }
    })
    .join("");
}

/** Convertit un texte WhatsApp (sans titre) en HTML pour l'éditeur. */
export function whatsappTextToHtml(text: string, options: WhatsAppOptions) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n").map((line) => cleanLine(line, options));
  return blocksToHtml(toBlocks(lines), options.convertFormatting);
}

export function prepareWhatsAppPost(text: string, options: WhatsAppOptions): PreparedPost {
  const normalized = text.replace(/\r\n?/g, "\n").trim();
  const keywords = extractHashtags(normalized);
  const rawLines = normalized.split("\n");
  const titleIndex = rawLines.findIndex((line) => cleanLine(line, options) !== "");

  const titleSource = titleIndex >= 0 ? rawLines[titleIndex] : "";
  const title = truncate(
    stripFormatting(cleanLine(titleSource, { removeEmojis: options.removeEmojis, removeHashtags: true })),
    TITLE_MAX
  );

  const bodyLines = rawLines
    .slice(titleIndex + 1)
    .map((line) => cleanLine(line, options));
  // Retire les lignes vides en tête du corps.
  while (bodyLines.length && !bodyLines[0]) bodyLines.shift();

  const html = blocksToHtml(toBlocks(bodyLines), options.convertFormatting);
  const plainBody = stripFormatting(
    bodyLines
      .filter(Boolean)
      .map((line) => line.replace(BULLET, "").replace(NUMBERED, "").replace(QUOTE, ""))
      .join(" ")
  );
  const excerpt = truncate(plainBody || title, EXCERPT_MAX);

  return { title, excerpt, html, keywords };
}
