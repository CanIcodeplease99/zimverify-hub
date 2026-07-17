// ============================================================
// Subdomain Detection & Portal Routing
// ============================================================
// Production subdomains:
//   zimverify.com          → public only
//   police.zimverify.com   → police portal only
//   gov.zimverify.com      → government portal only
//   insurance.zimverify.com → insurance portal only
//
// Development (no subdomains): path-based fallback
//   /portal/police/*   → police portal
//   /portal/gov/*      → government portal
//   /portal/insurance/* → insurance portal
// ============================================================

import type { PortalType } from "./rbac";

// Map subdomains to portal types
const SUBDOMAIN_MAP: Record<string, PortalType> = {
  police: "police",
  gov: "government",
  insurance: "insurance",
};

// Known development/preview hostnames where path-based routing is allowed
const DEV_HOSTNAMES = [
  "localhost",
  "127.0.0.1",
  "preview.emergentagent.com",
];

function isDevelopment(): boolean {
  const host = window.location.hostname;
  return DEV_HOSTNAMES.some(d => host.includes(d));
}

/**
 * Detect portal type from the current hostname subdomain.
 * Returns null if on the main/public domain.
 */
export function detectSubdomainPortal(): PortalType | null {
  const host = window.location.hostname;

  // Check for subdomain pattern: <portal>.zimverify.com or <portal>.<anything>
  const parts = host.split(".");
  if (parts.length >= 2) {
    const sub = parts[0].toLowerCase();
    if (SUBDOMAIN_MAP[sub]) {
      return SUBDOMAIN_MAP[sub];
    }
  }

  return null;
}

/**
 * Check if the current domain is allowed to serve a specific portal.
 * - On production: only the matching subdomain can access a portal
 * - On development: path-based routing is allowed as fallback
 */
export function isPortalAllowedOnCurrentDomain(portal: PortalType): boolean {
  // Public portal is always allowed on main domain
  if (portal === "public") return true;

  // Check subdomain first
  const subPortal = detectSubdomainPortal();
  if (subPortal === portal) return true;

  // In development, allow path-based routing
  if (isDevelopment()) return true;

  // On production main domain — block internal portals
  return false;
}

/**
 * Get the correct URL for a portal login.
 * On production, returns the subdomain URL. On dev, returns path-based URL.
 */
export function getPortalUrl(portal: PortalType): string {
  if (isDevelopment()) {
    // Path-based in dev
    const pathMap: Record<PortalType, string> = {
      public: "/app/login",
      police: "/portal/police/login",
      government: "/portal/gov/login",
      insurance: "/portal/insurance/login",
    };
    return pathMap[portal];
  }

  // Production subdomain URLs
  const baseDomain = getBaseDomain();
  const subMap: Record<PortalType, string> = {
    public: `https://${baseDomain}/app/login`,
    police: `https://police.${baseDomain}/login`,
    government: `https://gov.${baseDomain}/login`,
    insurance: `https://insurance.${baseDomain}/login`,
  };
  return subMap[portal];
}

function getBaseDomain(): string {
  const host = window.location.hostname;
  const parts = host.split(".");
  // Remove subdomain if present
  if (parts.length > 2) {
    return parts.slice(1).join(".");
  }
  return host;
}
