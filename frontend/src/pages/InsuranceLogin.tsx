import PortalLogin from "@/components/PortalLogin";

const InsuranceLogin = () => (
  <PortalLogin
    portalType="insurance"
    title="Insurance Portal"
    subtitle="Approved insurance providers and authorized partners only"
    accentColor="bg-amber-700"
    warningText="Access to this system is restricted to employees of approved insurance organizations with valid credentials. Unauthorized access attempts are logged and will be reported to the relevant authorities."
  />
);

export default InsuranceLogin;
