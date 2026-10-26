export function readLanguage(search, stored) {
  const requested = new URLSearchParams(search).get("lang");
  return requested === "fr" || requested === "en" ? requested : stored === "fr" ? "fr" : "en";
}

export function safeLink(value) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value, "https://portfolio.local");
    return ["https:", "mailto:", "tel:"].includes(url.protocol) ? value : undefined;
  } catch { return undefined; }
}
