const SHORT_PASSWORD_SUFFIX = "__flight_app_password";

export function normalizeAuthPassword(password) {
  const value = String(password ?? "").trim();

  if (!value || value.length >= 6) return value;

  return `${value}${SHORT_PASSWORD_SUFFIX}`;
}
