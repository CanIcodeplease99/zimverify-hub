// ============================================================
// ZimVerify Role-Based Access Control (RBAC)
// ============================================================

// --- Portal Types ---
export type PortalType = "public" | "police" | "government" | "insurance";

// --- User Roles ---
export type UserRole =
  | "PUBLIC_USER"
  | "POLICE_OFFICER"
  | "POLICE_SUPERVISOR"
  | "CUSTOMS_OFFICER"
  | "ZINARA_OFFICER"
  | "REGISTRY_OFFICER"
  | "GOV_ADMIN"
  | "INSURANCE_AGENT"
  | "INSURANCE_MANAGER";

// --- Legacy role mapping (for existing Supabase data) ---
export function normalizeLegacyRole(role: string): UserRole {
  const map: Record<string, UserRole> = {
    public: "PUBLIC_USER",
    police: "POLICE_OFFICER",
    government: "GOV_ADMIN",
    customs: "CUSTOMS_OFFICER",
    insurance: "INSURANCE_AGENT",
    partner: "INSURANCE_AGENT",
  };
  return map[role] || (role as UserRole) || "PUBLIC_USER";
}

// --- Which portal each role belongs to ---
export const ROLE_PORTAL_MAP: Record<UserRole, PortalType> = {
  PUBLIC_USER: "public",
  POLICE_OFFICER: "police",
  POLICE_SUPERVISOR: "police",
  CUSTOMS_OFFICER: "government",
  ZINARA_OFFICER: "government",
  REGISTRY_OFFICER: "government",
  GOV_ADMIN: "government",
  INSURANCE_AGENT: "insurance",
  INSURANCE_MANAGER: "insurance",
};

// --- Roles available in each portal's signup/demo ---
export const PORTAL_ROLES: Record<PortalType, { role: UserRole; label: string; description: string; icon: string }[]> = {
  public: [
    { role: "PUBLIC_USER", label: "Public User", description: "Vehicle checks and verification reports.", icon: "🏠" },
  ],
  police: [
    { role: "POLICE_OFFICER", label: "Police Officer", description: "Field operations, VIN checks, Interpol verification.", icon: "🛡️" },
    { role: "POLICE_SUPERVISOR", label: "Police Supervisor", description: "Case oversight, escalation review, team management.", icon: "⭐" },
  ],
  government: [
    { role: "CUSTOMS_OFFICER", label: "Customs Officer (ZIMRA)", description: "Import vehicle data, border entry management.", icon: "🚚" },
    { role: "ZINARA_OFFICER", label: "ZINARA Officer", description: "Road administration and licensing oversight.", icon: "🛣️" },
    { role: "REGISTRY_OFFICER", label: "Registry Officer", description: "Vehicle registration and ownership records.", icon: "📋" },
    { role: "GOV_ADMIN", label: "Government Admin", description: "Full system administration and audit access.", icon: "🏛️" },
  ],
  insurance: [
    { role: "INSURANCE_AGENT", label: "Insurance Agent", description: "Claims verification, fraud checks, risk assessment.", icon: "📋" },
    { role: "INSURANCE_MANAGER", label: "Insurance Manager", description: "Approval workflows, team management, analytics.", icon: "💼" },
  ],
};

// --- Permission Actions ---
export type Permission =
  | "page:dashboard"
  | "page:vehicle_search"
  | "page:police_console"
  | "page:interpol_check"
  | "page:customs_console"
  | "page:gov_admin"
  | "page:insurance_portal"
  | "page:partner_portal"
  | "page:traffic_fines"
  | "page:traffic_enforcement"
  | "page:traffic_compliance_admin"
  | "action:search_vehicle"
  | "action:search_interpol"
  | "action:register_import"
  | "action:edit_vehicle_status"
  | "action:escalate_case"
  | "action:approve_claim"
  | "action:export_data"
  | "action:print_report"
  | "action:manage_users"
  | "action:system_config"
  | "action:view_audit_log"
  | "action:create_api_token"
  | "action:bulk_upload"
  | "action:pay_fine"
  | "action:submit_appeal"
  | "action:review_offence"
  | "action:issue_fine"
  | "action:adjudicate_appeal"
  | "action:manage_rules_engine";

// --- Role -> Permissions ---
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  PUBLIC_USER: [
    "page:dashboard",
    "page:vehicle_search",
    "page:traffic_fines",
    "action:search_vehicle",
    "action:print_report",
    "action:pay_fine",
    "action:submit_appeal",
  ],
  POLICE_OFFICER: [
    "page:dashboard",
    "page:police_console",
    "page:vehicle_search",
    "page:interpol_check",
    "page:traffic_enforcement",
    "action:search_vehicle",
    "action:search_interpol",
    "action:escalate_case",
    "action:print_report",
    "action:review_offence",
    "action:issue_fine",
  ],
  POLICE_SUPERVISOR: [
    "page:dashboard",
    "page:police_console",
    "page:vehicle_search",
    "page:interpol_check",
    "page:traffic_enforcement",
    "action:search_vehicle",
    "action:search_interpol",
    "action:escalate_case",
    "action:export_data",
    "action:print_report",
    "action:view_audit_log",
    "action:review_offence",
    "action:issue_fine",
  ],
  CUSTOMS_OFFICER: [
    "page:dashboard",
    "page:customs_console",
    "page:vehicle_search",
    "action:search_vehicle",
    "action:register_import",
    "action:print_report",
  ],
  ZINARA_OFFICER: [
    "page:dashboard",
    "page:vehicle_search",
    "action:search_vehicle",
    "action:print_report",
    "action:export_data",
  ],
  REGISTRY_OFFICER: [
    "page:dashboard",
    "page:vehicle_search",
    "action:search_vehicle",
    "action:edit_vehicle_status",
    "action:print_report",
    "action:export_data",
  ],
  GOV_ADMIN: [
    "page:dashboard",
    "page:gov_admin",
    "page:customs_console",
    "page:vehicle_search",
    "page:traffic_compliance_admin",
    "action:search_vehicle",
    "action:register_import",
    "action:edit_vehicle_status",
    "action:export_data",
    "action:print_report",
    "action:manage_users",
    "action:system_config",
    "action:view_audit_log",
    "action:adjudicate_appeal",
    "action:manage_rules_engine",
  ],
  INSURANCE_AGENT: [
    "page:dashboard",
    "page:insurance_portal",
    "page:vehicle_search",
    "action:search_vehicle",
    "action:print_report",
  ],
  INSURANCE_MANAGER: [
    "page:dashboard",
    "page:insurance_portal",
    "page:partner_portal",
    "page:vehicle_search",
    "action:search_vehicle",
    "action:approve_claim",
    "action:export_data",
    "action:print_report",
    "action:create_api_token",
    "action:bulk_upload",
  ],
};

// --- Helper: Check if role has permission ---
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

// --- Helper: Check if role belongs to portal ---
export function isRoleAllowedInPortal(role: UserRole, portal: PortalType): boolean {
  return ROLE_PORTAL_MAP[role] === portal;
}

// --- Helper: Get dashboard route for a role ---
export function getDashboardRoute(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    PUBLIC_USER: "/app/public",
    POLICE_OFFICER: "/app/police",
    POLICE_SUPERVISOR: "/app/police",
    CUSTOMS_OFFICER: "/app/customs",
    ZINARA_OFFICER: "/app/government",
    REGISTRY_OFFICER: "/app/government",
    GOV_ADMIN: "/app/government",
    INSURANCE_AGENT: "/app/insurance",
    INSURANCE_MANAGER: "/app/insurance",
  };
  return routes[role] || "/app/public";
}

// --- Helper: Get login route for a portal ---
export function getPortalLoginRoute(portal: PortalType): string {
  const routes: Record<PortalType, string> = {
    public: "/app/login",
    police: "/portal/police/login",
    government: "/portal/gov/login",
    insurance: "/portal/insurance/login",
  };
  return routes[portal];
}

// --- Helper: Detect portal from path ---
export function detectPortalFromPath(path: string): PortalType {
  if (path.startsWith("/portal/police") || path.startsWith("/app/police")) return "police";
  if (path.startsWith("/portal/gov") || path.startsWith("/app/government") || path.startsWith("/app/customs")) return "government";
  if (path.startsWith("/portal/insurance") || path.startsWith("/app/insurance") || path.startsWith("/app/partners")) return "insurance";
  return "public";
}

// --- Role display labels ---
export const ROLE_LABELS: Record<UserRole, string> = {
  PUBLIC_USER: "Public",
  POLICE_OFFICER: "Police Officer",
  POLICE_SUPERVISOR: "Police Supervisor",
  CUSTOMS_OFFICER: "Customs (ZIMRA)",
  ZINARA_OFFICER: "ZINARA",
  REGISTRY_OFFICER: "Registry",
  GOV_ADMIN: "Gov Admin",
  INSURANCE_AGENT: "Insurance Agent",
  INSURANCE_MANAGER: "Insurance Manager",
};
