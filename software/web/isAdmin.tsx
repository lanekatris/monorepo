export function isAdmin() {
  return process.env.NEXT_PUBLIC_SHOW_ADMIN === 'true';
}
