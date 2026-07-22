import type { Fine, Appeal, TrafficOffence, ComplianceSummary, DriverPoints } from "@/lib/database.types";

// ============================================================
// Mock Data — Traffic Compliance Module
// Used in demo mode; Supabase integration ready for live mode
// ============================================================

const MOCK_OFFENCES: TrafficOffence[] = [
  { id: "off-1", plate: "HRE 4421 ZW", vin: "JTNB11HK0J3012345", offence_type: "Speeding", offence_code: "SPD-01", description: "Exceeding speed limit in urban zone", location: "Samora Machel Ave, Harare", camera_id: "CAM-HRE-042", evidence_url: "", speed_detected: 92, speed_limit: 60, captured_at: "2026-04-10T14:32:00Z", status: "fine_issued", reviewed_by: "Insp. T. Ncube", reviewed_at: "2026-04-10T16:00:00Z", created_at: "2026-04-10T14:32:00Z" },
  { id: "off-2", plate: "BYO 7789 ZW", vin: "MHFVC41F9JJ123456", offence_type: "Red Light", offence_code: "RLV-01", description: "Red light violation at controlled intersection", location: "Fife Ave / Leopold Takawira, Harare", camera_id: "CAM-HRE-017", evidence_url: "", speed_detected: null, speed_limit: null, captured_at: "2026-04-12T08:15:00Z", status: "validated", reviewed_by: "", reviewed_at: "", created_at: "2026-04-12T08:15:00Z" },
  { id: "off-3", plate: "HRE 4421 ZW", vin: "JTNB11HK0J3012345", offence_type: "Speeding", offence_code: "SPD-02", description: "Exceeding speed limit on highway", location: "Harare-Mutare Highway, KM 42", camera_id: "CAM-HWY-008", evidence_url: "", speed_detected: 148, speed_limit: 120, captured_at: "2026-04-14T11:20:00Z", status: "pending_review", reviewed_by: "", reviewed_at: "", created_at: "2026-04-14T11:20:00Z" },
  { id: "off-4", plate: "GWE 1102 ZW", vin: "3GCPYBEK0JG654321", offence_type: "Unregistered Vehicle", offence_code: "REG-01", description: "Operating vehicle with expired registration", location: "Robert Mugabe Rd, Harare", camera_id: "CAM-HRE-055", evidence_url: "", speed_detected: null, speed_limit: null, captured_at: "2026-04-15T09:45:00Z", status: "pending_review", reviewed_by: "", reviewed_at: "", created_at: "2026-04-15T09:45:00Z" },
];

const MOCK_FINES: Fine[] = [
  { id: "fine-1", offence_id: "off-1", plate: "HRE 4421 ZW", vin: "JTNB11HK0J3012345", owner_name: "John Moyo", owner_id: "ID-12345", offence_type: "Speeding (92 in 60 zone)", amount: 150, currency: "USD", penalty_points: 3, due_date: "2026-05-10T00:00:00Z", status: "unpaid", issued_by: "Insp. T. Ncube", paid_at: null, payment_ref: null, renewal_blocked: false, created_at: "2026-04-10T16:30:00Z" },
  { id: "fine-2", offence_id: "off-5", plate: "HRE 4421 ZW", vin: "JTNB11HK0J3012345", owner_name: "John Moyo", owner_id: "ID-12345", offence_type: "Parking Violation", amount: 30, currency: "USD", penalty_points: 0, due_date: "2026-04-01T00:00:00Z", status: "overdue", issued_by: "Traffic Officer", paid_at: null, payment_ref: null, renewal_blocked: true, created_at: "2026-03-01T10:00:00Z" },
  { id: "fine-3", offence_id: "off-6", plate: "BYO 7789 ZW", vin: "MHFVC41F9JJ123456", owner_name: "Sarah Ncube", owner_id: "ID-67890", offence_type: "Red Light Violation", amount: 200, currency: "USD", penalty_points: 4, due_date: "2026-05-12T00:00:00Z", status: "appealed", issued_by: "Insp. R. Maphosa", paid_at: null, payment_ref: null, renewal_blocked: false, created_at: "2026-04-12T10:00:00Z" },
  { id: "fine-4", offence_id: "off-7", plate: "GWE 1102 ZW", vin: "3GCPYBEK0JG654321", owner_name: "Peter Mutasa", owner_id: "ID-11223", offence_type: "Speeding (85 in 60 zone)", amount: 100, currency: "USD", penalty_points: 2, due_date: "2026-03-15T00:00:00Z", status: "paid", issued_by: "Cpl. M. Dube", paid_at: "2026-03-20T14:00:00Z", payment_ref: "PAY-2026-0312", renewal_blocked: false, created_at: "2026-02-15T08:00:00Z" },
];

const MOCK_APPEALS: Appeal[] = [
  { id: "app-1", fine_id: "fine-3", plate: "BYO 7789 ZW", appellant_name: "Sarah Ncube", appellant_email: "sarah@example.com", reason: "Camera malfunction — traffic light was amber, not red", evidence_text: "I have dashcam footage showing the light was amber when I entered the intersection. The camera timestamp is 2 seconds ahead.", status: "under_review", adjudicator_notes: "", adjudicated_by: "", adjudicated_at: null, created_at: "2026-04-14T09:00:00Z" },
  { id: "app-2", fine_id: "fine-5", plate: "HRE 8812 ZW", appellant_name: "Grace Dube", appellant_email: "grace@example.com", reason: "Vehicle was reported stolen at the time of offence", evidence_text: "Police report #ZRP-2026-4421 confirms my vehicle was stolen on March 5th. The offence occurred on March 8th.", status: "overturned", adjudicator_notes: "Verified with ZRP stolen vehicle database. Fine overturned.", adjudicated_by: "Dir. S. Mutasa", adjudicated_at: "2026-04-15T11:00:00Z", created_at: "2026-04-10T14:00:00Z" },
];

// --- Public: Search fines by plate ---
export function searchFinesByPlate(plate: string): Fine[] {
  const q = plate.toUpperCase().replace(/\s+/g, " ").trim();
  return MOCK_FINES.filter(f => f.plate.toUpperCase().includes(q));
}

// --- Public: Get compliance summary for a vehicle ---
export function getComplianceSummary(plate: string): ComplianceSummary {
  const fines = searchFinesByPlate(plate);
  const unpaid = fines.filter(f => f.status === "unpaid" || f.status === "overdue");
  const totalOwed = unpaid.reduce((s, f) => s + f.amount, 0);
  const totalPoints = fines.filter(f => f.status !== "paid").reduce((s, f) => s + f.penalty_points, 0);
  const blocked = fines.some(f => f.renewal_blocked);
  const offenceCount = fines.filter(f => f.status !== "paid" && f.status !== "waived").length;

  let risk: ComplianceSummary["risk_level"] = "normal";
  if (totalPoints >= 12) risk = "suspended";
  else if (offenceCount >= 3) risk = "repeated_offences";
  else if (offenceCount >= 2 || totalPoints >= 6) risk = "elevated";

  return {
    outstanding_fines: unpaid.length > 0,
    fine_count: unpaid.length,
    total_owed: totalOwed,
    renewal_status: blocked ? "blocked" : "clear",
    risk_level: risk,
    points: totalPoints,
  };
}

// --- Public: Submit appeal ---
export function submitAppeal(appeal: Omit<Appeal, "id" | "status" | "adjudicator_notes" | "adjudicated_by" | "adjudicated_at" | "created_at">): Appeal {
  const newAppeal: Appeal = {
    ...appeal,
    id: `app-${Date.now()}`,
    status: "submitted",
    adjudicator_notes: "",
    adjudicated_by: "",
    adjudicated_at: null,
    created_at: new Date().toISOString(),
  };
  MOCK_APPEALS.push(newAppeal);
  // Mark fine as appealed
  const fine = MOCK_FINES.find(f => f.id === appeal.fine_id);
  if (fine) fine.status = "appealed";
  return newAppeal;
}

// --- Public: Pay fine (mock) ---
export function payFine(fineId: string): Fine | null {
  const fine = MOCK_FINES.find(f => f.id === fineId);
  if (!fine) return null;
  fine.status = "paid";
  fine.paid_at = new Date().toISOString();
  fine.payment_ref = `PAY-${Date.now().toString(36).toUpperCase()}`;
  fine.renewal_blocked = false;
  return fine;
}

// --- Police: Get pending offences for review ---
export function getPendingOffences(): TrafficOffence[] {
  return MOCK_OFFENCES.filter(o => o.status === "pending_review");
}

// --- Police: Get all offences ---
export function getAllOffences(): TrafficOffence[] {
  return [...MOCK_OFFENCES].sort((a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime());
}

// --- Police: Validate offence ---
export function validateOffence(offenceId: string, reviewerId: string): TrafficOffence | null {
  const off = MOCK_OFFENCES.find(o => o.id === offenceId);
  if (!off) return null;
  off.status = "validated";
  off.reviewed_by = reviewerId;
  off.reviewed_at = new Date().toISOString();
  return off;
}

// --- Police: Reject offence ---
export function rejectOffence(offenceId: string, reviewerId: string): TrafficOffence | null {
  const off = MOCK_OFFENCES.find(o => o.id === offenceId);
  if (!off) return null;
  off.status = "rejected";
  off.reviewed_by = reviewerId;
  off.reviewed_at = new Date().toISOString();
  return off;
}

// --- Police: Issue fine from validated offence ---
export function issueFineFromOffence(offenceId: string, amount: number, points: number, issuedBy: string): Fine | null {
  const off = MOCK_OFFENCES.find(o => o.id === offenceId);
  if (!off || off.status !== "validated") return null;
  off.status = "fine_issued";
  const newFine: Fine = {
    id: `fine-${Date.now()}`,
    offence_id: offenceId,
    plate: off.plate,
    vin: off.vin,
    owner_name: "Owner (from registry)",
    owner_id: "",
    offence_type: `${off.offence_type}${off.speed_detected ? ` (${off.speed_detected} in ${off.speed_limit} zone)` : ""}`,
    amount,
    currency: "USD",
    penalty_points: points,
    due_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: "unpaid",
    issued_by: issuedBy,
    paid_at: null,
    payment_ref: null,
    renewal_blocked: amount >= 200,
    created_at: new Date().toISOString(),
  };
  MOCK_FINES.push(newFine);
  return newFine;
}

// --- Police: Get repeat offender profile ---
export function getDriverProfile(plate: string): DriverPoints {
  const fines = searchFinesByPlate(plate);
  const activeFines = fines.filter(f => f.status !== "paid" && f.status !== "waived");
  const totalPoints = activeFines.reduce((s, f) => s + f.penalty_points, 0);
  let risk: DriverPoints["risk_level"] = "normal";
  if (totalPoints >= 12) risk = "suspended";
  else if (totalPoints >= 8) risk = "high";
  else if (totalPoints >= 4) risk = "elevated";

  return {
    plate,
    total_points: totalPoints,
    active_fines: activeFines.length,
    total_fines: fines.length,
    renewal_blocked: fines.some(f => f.renewal_blocked),
    risk_level: risk,
    last_offence_at: fines.length > 0 ? fines[fines.length - 1].created_at : null,
  };
}

// --- Gov: All fines ---
export function getAllFines(): Fine[] {
  return [...MOCK_FINES].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// --- Gov: All appeals ---
export function getAllAppeals(): Appeal[] {
  return [...MOCK_APPEALS].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// --- Gov: Adjudicate appeal ---
export function adjudicateAppeal(appealId: string, decision: "upheld" | "overturned" | "dismissed", notes: string, adjudicator: string): Appeal | null {
  const appeal = MOCK_APPEALS.find(a => a.id === appealId);
  if (!appeal) return null;
  appeal.status = decision;
  appeal.adjudicator_notes = notes;
  appeal.adjudicated_by = adjudicator;
  appeal.adjudicated_at = new Date().toISOString();
  if (decision === "overturned") {
    const fine = MOCK_FINES.find(f => f.id === appeal.fine_id);
    if (fine) { fine.status = "waived"; fine.renewal_blocked = false; }
  }
  return appeal;
}

// --- Gov: Enforcement stats ---
export function getEnforcementStats() {
  const fines = MOCK_FINES;
  return {
    totalFinesIssued: fines.length,
    totalRevenue: fines.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0),
    unpaidTotal: fines.filter(f => f.status === "unpaid" || f.status === "overdue").reduce((s, f) => s + f.amount, 0),
    overdueCount: fines.filter(f => f.status === "overdue").length,
    appealsPending: MOCK_APPEALS.filter(a => a.status === "submitted" || a.status === "under_review").length,
    renewalsBlocked: fines.filter(f => f.renewal_blocked).length,
    pendingReview: MOCK_OFFENCES.filter(o => o.status === "pending_review").length,
  };
}
