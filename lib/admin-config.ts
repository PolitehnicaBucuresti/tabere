/**
 * Non-obvious admin URL prefix (avoid `/admin`).
 * Change in one place if you prefer another path.
 */
export const ADMIN_PATH_SEGMENT = "parc-tabere-7qm2x9";

export const adminBasePath = `/${ADMIN_PATH_SEGMENT}`;

export const adminPanouPath = `${adminBasePath}/panou`;

/**
 * Default password (override with ADMIN_PASSWORD in production).
 * TODO: remove default in production and set only via env.
 */
export const DEFAULT_ADMIN_PASSWORD = "UpbTabere#adm_k7n2";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
}

export const SESSION_COOKIE_NAME = "tb_adm_sess";

export function getSessionSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET?.trim();
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[tabere-admin] ADMIN_SESSION_SECRET is not set or too short — set a strong random value in production.",
    );
  }
  return "dev-only-tabere-admin-session-secret-min-32chars!!";
}
