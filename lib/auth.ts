export function isAdmin(req: Request): boolean {
  const password = req.headers.get("x-admin-password");
  return !!password && password === process.env.ADMIN_PASSWORD;
}
