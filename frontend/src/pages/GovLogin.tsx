import PortalLogin from "@/components/PortalLogin";

const GovLogin = () => (
  <PortalLogin
    portalType="government"
    title="Government Portal"
    subtitle="Authorized government personnel only"
    accentColor="bg-emerald-800"
  />
);

export default GovLogin;
