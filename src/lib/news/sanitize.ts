import "server-only";

import sanitizeHtml from "sanitize-html";

/**
 * Nettoie le HTML d'un article avant affichage : seules les balises produites
 * par l'éditeur sont conservées (vidéos YouTube comprises).
 */
export function sanitizeNewsHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "h2", "h3", "strong", "b", "em", "i", "s", "u", "code", "pre",
      "a", "ul", "ol", "li", "blockquote", "hr", "img", "figure", "figcaption", "div", "iframe",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      div: ["data-youtube-video"],
      iframe: ["src", "width", "height", "allow", "allowfullscreen", "title"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"], iframe: ["https"] },
    allowedIframeHostnames: ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com", "youtube-nocookie.com"],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" },
      }),
      iframe: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, title: attribs.title || "Vidéo YouTube", allowfullscreen: "true" },
      }),
    },
  });
}
