const DEFAULT_EMAIL_DOMAIN = "gmail.com";

export function normalizeUsername(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/\.+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

export function usernameToEmail(value) {
  const text = String(value ?? "").trim().toLowerCase();

  if (!text) return "";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return text;

  const username = normalizeUsername(text);

  return username ? `${username}@${DEFAULT_EMAIL_DOMAIN}` : "";
}
