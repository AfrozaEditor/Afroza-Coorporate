// Le Cameroun est à UTC+1 toute l'année (pas d'heure d'été).
export const SITE_TIME_ZONE = "Africa/Douala";
const SITE_UTC_OFFSET = "+01:00";

const shortDate = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: SITE_TIME_ZONE,
});

const longDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: SITE_TIME_ZONE,
});

const timeOfDay = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: SITE_TIME_ZONE,
});

/** « 02 avr. 2026 » — liste du back-office. */
export function formatShortDate(iso: string | null | undefined) {
  return iso ? shortDate.format(new Date(iso)) : "—";
}

/** « 20 mai 2026 » — aperçus et article. */
export function formatLongDate(iso: string | null | undefined) {
  return iso ? longDate.format(new Date(iso)) : "—";
}

export function formatTime(iso: string) {
  return timeOfDay.format(new Date(iso));
}

/** « 22-05-2026 » — format historique de la page News. */
export function formatDashedDate(iso: string) {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: SITE_TIME_ZONE,
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")}-${get("month")}-${get("year")}`;
}

/** Date (AAAA-MM-JJ) et heure (HH:MM) saisies à l'heure de Yaoundé → ISO UTC. */
export function siteLocalToIso(date: string, time: string) {
  return new Date(`${date}T${time || "09:00"}:00${SITE_UTC_OFFSET}`).toISOString();
}

/** ISO UTC → { date: AAAA-MM-JJ, time: HH:MM } à l'heure de Yaoundé. */
export function isoToSiteLocal(iso: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: SITE_TIME_ZONE,
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
}

export function slugify(text: string, maxLength = 80) {
  const slug = text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    // Élisions : « l'application » → « application ».
    .replace(/\b(?:[cdjlmnst]|qu)['’]/g, "")
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length <= maxLength) return slug;
  const cut = slug.slice(0, maxLength);
  return cut.slice(0, cut.lastIndexOf("-") > 20 ? cut.lastIndexOf("-") : maxLength).replace(/-+$/, "");
}

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** « Jedidia Kamdem Souop » → « JK » */
export function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return (words[0][0] + (words[1]?.[0] ?? "")).toUpperCase();
}

/** « Jedidia Kamdem Souop » → « Jedidia K. S. » */
export function shortName(name: string) {
  const [first, ...rest] = name.trim().split(/\s+/).filter(Boolean);
  if (!first) return "";
  return [first, ...rest.map((word) => `${word[0].toUpperCase()}.`)].join(" ");
}

/** « Jedidia Kamdem Souop » → « Jedidia Kamdem S. » (barre latérale) */
export function compactName(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 2) return words.join(" ");
  return [...words.slice(0, 2), ...words.slice(2).map((word) => `${word[0].toUpperCase()}.`)].join(" ");
}

/** Coupe un texte à `max` caractères sur une fin de mot, avec « … ». */
export function truncate(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.!?-]+$/, "")}…`;
}

export function htmlToText(html: string) {
  return html
    .replace(/<(br|\/p|\/h[1-6]|\/li|\/blockquote)\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
