export function getAdminEmails() {
  return (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function getPrimaryEmail(user) {
  return user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() || "";
}

export function isAdminUser(user) {
  const email = getPrimaryEmail(user);
  if (!email) return false;
  return getAdminEmails().includes(email);
}
