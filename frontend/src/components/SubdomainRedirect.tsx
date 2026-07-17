import { Navigate } from "react-router-dom";
import { detectSubdomainPortal } from "@/lib/subdomain";

/**
 * When user visits the root "/" on a subdomain (e.g., police.zimverify.com),
 * auto-redirect them to the portal login page.
 * On main domain, show the public landing page.
 */
const SubdomainRedirect = ({ fallback }: { fallback: React.ReactNode }) => {
  const subPortal = detectSubdomainPortal();

  if (subPortal === "police") return <Navigate to="/portal/police/login" replace />;
  if (subPortal === "government") return <Navigate to="/portal/gov/login" replace />;
  if (subPortal === "insurance") return <Navigate to="/portal/insurance/login" replace />;

  // Main domain — show the public landing page
  return <>{fallback}</>;
};

export default SubdomainRedirect;
