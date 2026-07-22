export type { UserRole, PortalType, Permission } from "./rbac";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  registration: string;
  owner_name: string;
  status: string;
  created_at: string;
}

export interface CustomsEntry {
  id: string;
  entry_number: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  port_of_entry: string;
  country_of_origin: string;
  importer_name: string;
  importer_id: string;
  registration: string;
  status: string;
  created_by: string;
  created_at: string;
}

export interface VerificationLog {
  id: string;
  user_id: string;
  search_type: string;
  search_query: string;
  result_found: boolean;
  result_data: Record<string, unknown>;
  created_at: string;
}

export interface PoliceCase {
  id: string;
  plate: string;
  status: string;
  event: string;
  created_by: string;
  created_at: string;
}

// --- Traffic Compliance Module ---

export interface TrafficOffence {
  id: string;
  plate: string;
  vin: string;
  offence_type: string;
  offence_code: string;
  description: string;
  location: string;
  camera_id: string;
  evidence_url: string;
  speed_detected: number | null;
  speed_limit: number | null;
  captured_at: string;
  status: "pending_review" | "validated" | "rejected" | "fine_issued";
  reviewed_by: string;
  reviewed_at: string;
  created_at: string;
}

export interface Fine {
  id: string;
  offence_id: string;
  plate: string;
  vin: string;
  owner_name: string;
  owner_id: string;
  offence_type: string;
  amount: number;
  currency: string;
  penalty_points: number;
  due_date: string;
  status: "unpaid" | "paid" | "overdue" | "appealed" | "waived";
  issued_by: string;
  paid_at: string | null;
  payment_ref: string | null;
  renewal_blocked: boolean;
  created_at: string;
}

export interface Appeal {
  id: string;
  fine_id: string;
  plate: string;
  appellant_name: string;
  appellant_email: string;
  reason: string;
  evidence_text: string;
  status: "submitted" | "under_review" | "upheld" | "overturned" | "dismissed";
  adjudicator_notes: string;
  adjudicated_by: string;
  adjudicated_at: string | null;
  created_at: string;
}

export interface DriverPoints {
  plate: string;
  total_points: number;
  active_fines: number;
  total_fines: number;
  renewal_blocked: boolean;
  risk_level: "normal" | "elevated" | "high" | "suspended";
  last_offence_at: string | null;
}

export interface ComplianceSummary {
  outstanding_fines: boolean;
  fine_count: number;
  total_owed: number;
  renewal_status: "clear" | "blocked";
  risk_level: "normal" | "elevated" | "repeated_offences" | "suspended";
  points: number;
}
