import { supabase } from "@/lib/supabase";
import type { Vehicle, CustomsEntry, VerificationLog, Profile } from "@/lib/database.types";

// --- Vehicles ---

export async function fetchVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchVehicles error:", error.message);
    return [];
  }
  return (data ?? []) as Vehicle[];
}

export async function searchVehicle(query: string): Promise<Vehicle | null> {
  const upper = query.toUpperCase().trim();

  // Try VIN match
  let { data } = await supabase
    .from("vehicles")
    .select("*")
    .ilike("vin", `%${upper}%`)
    .limit(1)
    .single();

  if (data) return data as Vehicle;

  // Try registration match
  const result = await supabase
    .from("vehicles")
    .select("*")
    .ilike("registration", `%${upper}%`)
    .limit(1)
    .single();

  return (result.data as Vehicle) ?? null;
}

// --- Customs Entries ---

export async function fetchCustomsEntries(): Promise<CustomsEntry[]> {
  const { data, error } = await supabase
    .from("customs_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchCustomsEntries error:", error.message);
    return [];
  }
  return (data ?? []) as CustomsEntry[];
}

export async function createCustomsEntry(entry: Omit<CustomsEntry, "id" | "created_at">): Promise<{ data: CustomsEntry | null; error: string | null }> {
  // Also insert into vehicles table
  const { error: vehicleError } = await supabase
    .from("vehicles")
    .upsert({
      vin: entry.vin,
      make: entry.make,
      model: entry.model,
      year: entry.year,
      color: entry.color,
      registration: entry.registration,
      owner_name: entry.importer_name,
      status: "active",
    }, { onConflict: "vin" });

  if (vehicleError) {
    console.warn("Vehicle upsert warning:", vehicleError.message);
  }

  const { data, error } = await supabase
    .from("customs_entries")
    .insert(entry)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as CustomsEntry, error: null };
}

// --- Verification Logs ---

export async function logVerification(log: {
  user_id: string;
  search_type: string;
  search_query: string;
  result_found: boolean;
  result_data: Record<string, unknown>;
}): Promise<void> {
  const { error } = await supabase.from("verification_logs").insert(log);
  if (error) console.error("logVerification error:", error.message);
}

export async function fetchVerificationLogs(userId: string): Promise<VerificationLog[]> {
  const { data, error } = await supabase
    .from("verification_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("fetchVerificationLogs error:", error.message);
    return [];
  }
  return (data ?? []) as VerificationLog[];
}

// --- Customs KPIs ---

export async function fetchCustomsKPIs(): Promise<{
  entriesToday: number;
  totalMonth: number;
  processedRate: number;
  pendingReview: number;
}> {
  const today = new Date().toISOString().split("T")[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const [todayRes, monthRes, pendingRes] = await Promise.all([
    supabase.from("customs_entries").select("id", { count: "exact", head: true }).gte("created_at", today),
    supabase.from("customs_entries").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
    supabase.from("customs_entries").select("id", { count: "exact", head: true }).eq("status", "Review"),
  ]);

  const total = monthRes.count ?? 0;
  const pending = pendingRes.count ?? 0;
  const processed = total > 0 ? ((total - pending) / total) * 100 : 100;

  return {
    entriesToday: todayRes.count ?? 0,
    totalMonth: total,
    processedRate: Math.round(processed * 10) / 10,
    pendingReview: pending,
  };
}

// --- Admin: Profiles ---

export async function fetchAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchAllProfiles error:", error.message);
    return [];
  }
  return (data ?? []) as Profile[];
}

// --- Admin: Update Vehicle Status ---

export async function updateVehicleStatus(vin: string, status: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("vehicles")
    .update({ status })
    .eq("vin", vin);

  if (error) return { error: error.message };
  return { error: null };
}

// --- Admin: All Verification Logs ---

export async function fetchAllVerificationLogs(): Promise<VerificationLog[]> {
  const { data, error } = await supabase
    .from("verification_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("fetchAllVerificationLogs error:", error.message);
    return [];
  }
  return (data ?? []) as VerificationLog[];
}

// --- Admin: System Stats ---

export async function fetchSystemStats(): Promise<{
  totalVehicles: number;
  stolenVehicles: number;
  totalUsers: number;
  totalEntries: number;
  totalVerifications: number;
}> {
  const [veh, stolen, users, entries, verif] = await Promise.all([
    supabase.from("vehicles").select("id", { count: "exact", head: true }),
    supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("status", "stolen"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("customs_entries").select("id", { count: "exact", head: true }),
    supabase.from("verification_logs").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalVehicles: veh.count ?? 0,
    stolenVehicles: stolen.count ?? 0,
    totalUsers: users.count ?? 0,
    totalEntries: entries.count ?? 0,
    totalVerifications: verif.count ?? 0,
  };
}
