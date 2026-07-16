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
