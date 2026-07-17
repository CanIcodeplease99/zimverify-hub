import PortalLogin from "@/components/PortalLogin";

const PoliceLogin = () => (
  <PortalLogin
    portalType="police"
    title="Police Portal"
    subtitle="Zimbabwe Republic Police — classified law enforcement system"
    accentColor="bg-blue-700"
    warningText="This is a restricted Zimbabwe Republic Police system. Unauthorized access is a criminal offence under the Computer Crime and Cyber Crime Act [Chapter 12:07]. All access attempts are monitored, recorded, and subject to audit. Unauthorized users will be investigated and prosecuted to the fullest extent of the law."
  />
);

export default PoliceLogin;
