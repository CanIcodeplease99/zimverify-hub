import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isPortalAllowedOnCurrentDomain } from "@/lib/subdomain";
import type { PortalType } from "@/lib/rbac";

interface PortalGuardProps {
  portal: PortalType;
  children: ReactNode;
}

/**
 * Guards portal routes — blocks access if the current domain
 * is not authorized to serve this portal.
 * 
 * On production: police.zimverify.com can only serve police portal.
 * On main domain: internal portals are completely blocked (404).
 * On development: all portals accessible via path-based routing.
 */
const PortalGuard = ({ portal, children }: PortalGuardProps) => {
  if (!isPortalAllowedOnCurrentDomain(portal)) {
    // Return 404 — don't even reveal that the portal exists
    return <Navigate to="/not-found" replace />;
  }

  return <>{children}</>;
};

export default PortalGuard;
