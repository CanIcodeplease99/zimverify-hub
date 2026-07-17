import PortalLogin from "@/components/PortalLogin";

const GovLogin = () => (
  <PortalLogin
    portalType="government"
    title="Government Portal"
    subtitle="Republic of Zimbabwe — authorized government personnel only"
    accentColor="bg-emerald-800"
    warningText="This system is the property of the Government of Zimbabwe. Access is restricted to authorized officials of ZIMRA, ZINARA, the Central Vehicle Registry, and designated government agencies. Unauthorized access, use, or disclosure of information is prohibited and constitutes a criminal offence. Violators will be prosecuted under applicable law."
  />
);

export default GovLogin;
