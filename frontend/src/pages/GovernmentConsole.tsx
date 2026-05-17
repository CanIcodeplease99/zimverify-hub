import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity, Database, ShieldCheck, Clock, Users, Settings, Building2,
  TrendingUp, CheckCircle2, Car, AlertTriangle, Search, FileText,
  Loader2, Wifi, RefreshCw, Shield,
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useRealtime } from "@/contexts/RealtimeContext";
import {
  fetchVehicles, fetchCustomsEntries, fetchAllProfiles,
  fetchAllVerificationLogs, fetchSystemStats, updateVehicleStatus,
} from "@/services/dataService";
import type { Vehicle, CustomsEntry, Profile, VerificationLog } from "@/lib/database.types";
import DatabaseIntegrationPanel from "@/components/DatabaseIntegrationPanel";
import FraudDetectionPanel from "@/components/FraudDetectionPanel";

const uptimeData = [
  { day: "Mon", uptime: 99.98 }, { day: "Tue", uptime: 99.95 },
  { day: "Wed", uptime: 100 }, { day: "Thu", uptime: 99.99 },
  { day: "Fri", uptime: 99.92 }, { day: "Sat", uptime: 100 }, { day: "Sun", uptime: 99.97 },
];
const auditData = [
  { hour: "00:00", events: 120 }, { hour: "04:00", events: 45 },
  { hour: "08:00", events: 380 }, { hour: "12:00", events: 520 },
  { hour: "16:00", events: 610 }, { hour: "20:00", events: 290 },
];
const uptimeConfig = { uptime: { label: "Uptime %", color: "hsl(var(--success))" } };
const auditConfig = { events: { label: "Audit Events", color: "hsl(var(--primary))" } };

const mockKpis = [
  { label: "Agency Sync", value: "Healthy", icon: Database, trend: "All systems go", color: "text-success" },
  { label: "Audit Events", value: "14,218", icon: Activity, trend: "+820 today", color: "text-primary" },
  { label: "Uptime", value: "99.97%", icon: ShieldCheck, trend: "30-day average", color: "text-accent" },
  { label: "Review Queue", value: "5", icon: Clock, trend: "3 pending >24h", color: "text-warning" },
];

const integrations = [
  { institution: "Central Vehicle Registry", status: "Healthy", latency: "45ms", lastSync: "2 min ago" },
  { institution: "Zimbabwe National Road Admin", status: "Healthy", latency: "62ms", lastSync: "5 min ago" },
  { institution: "Zimbabwe Republic Police", status: "Review", latency: "180ms", lastSync: "1 hr ago" },
  { institution: "Insurance Council", status: "Healthy", latency: "38ms", lastSync: "3 min ago" },
];

const intStatusColors: Record<string, string> = {
  Healthy: "bg-success/10 text-success border-success/20",
  Review: "bg-warning/10 text-warning border-warning/20",
};

const vehStatusColors: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  stolen: "bg-destructive/10 text-destructive border-destructive/20",
  impounded: "bg-warning/10 text-warning border-warning/20",
};

const roleColors: Record<string, string> = {
  public: "bg-primary/10 text-primary border-primary/20",
  police: "bg-info/10 text-info border-info/20",
  government: "bg-accent/10 text-accent border-accent/20",
  insurance: "bg-success/10 text-success border-success/20",
  partner: "bg-warning/10 text-warning border-warning/20",
  customs: "bg-destructive/10 text-destructive border-destructive/20",
};

const mockUsers = [
  { name: "Insp. T. Ncube", role: "Police", status: "Active", lastLogin: "2 hours ago" },
  { name: "K. Zimuto", role: "Insurance", status: "Active", lastLogin: "1 day ago" },
  { name: "M. Chikwanha", role: "Partner", status: "Active", lastLogin: "3 hours ago" },
  { name: "S. Mutasa", role: "Government", status: "Active", lastLogin: "Just now" },
  { name: "J. Moyo", role: "Public", status: "Suspended", lastLogin: "5 days ago" },
];

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

type AdminTab = "overview" | "vehicles" | "users" | "entries" | "audit";

const GovernmentConsole = () => {
  const { authMode, user } = useAuth();
  const { isConnected } = useRealtime();
  const isLive = authMode === "supabase";

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [loading, setLoading] = useState(false);

  // Live data
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [entries, setEntries] = useState<CustomsEntry[]>([]);
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [stats, setStats] = useState<{ totalVehicles: number; stolenVehicles: number; totalUsers: number; totalEntries: number; totalVerifications: number } | null>(null);

  // Dialogs
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [vehicleDetailOpen, setVehicleDetailOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [instName, setInstName] = useState("");
  const [instType, setInstType] = useState("");
  const [autoSync, setAutoSync] = useState(true);
  const [auditRetention, setAuditRetention] = useState("90");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState("");

  const loadData = async () => {
    if (!isLive) return;
    setLoading(true);
    try {
      const [v, p, e, l, s] = await Promise.all([
        fetchVehicles(), fetchAllProfiles(), fetchCustomsEntries(),
        fetchAllVerificationLogs(), fetchSystemStats(),
      ]);
      setVehicles(v); setProfiles(p); setEntries(e); setLogs(l); setStats(s);
    } catch { toast.error("Failed to load data"); }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [isLive]);

  const liveKpis = stats ? [
    { label: "Total Vehicles", value: String(stats.totalVehicles), icon: Car, trend: `${stats.stolenVehicles} stolen`, color: "text-primary" },
    { label: "Registered Users", value: String(stats.totalUsers), icon: Users, trend: "Live count", color: "text-accent" },
    { label: "Customs Entries", value: String(stats.totalEntries), icon: FileText, trend: "All ports", color: "text-success" },
    { label: "Verifications", value: String(stats.totalVerifications), icon: Search, trend: "Total checks", color: "text-info" },
  ] : mockKpis;

  const filteredVehicles = vehicles.filter(v =>
    !vehicleSearch || v.vin.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
    v.registration?.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
    v.make.toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  const handleStatusChange = async (vehicle: Vehicle, newStatus: string) => {
    if (!isLive) { toast.info("Demo mode — status changes are simulated"); return; }
    const { error } = await updateVehicleStatus(vehicle.vin, newStatus);
    if (error) { toast.error("Failed to update", { description: error }); return; }
    toast.success(`${vehicle.make} ${vehicle.model} marked as ${newStatus}`);
    setVehicles(prev => prev.map(v => v.vin === vehicle.vin ? { ...v, status: newStatus } : v));
    setVehicleDetailOpen(false);
  };

  const handleOnboard = () => {
    if (!instName.trim() || !instType) { toast.error("Please fill all fields."); return; }
    toast.success(`${instName} onboarded`, { description: `Added as ${instType} institution.` });
    setInstName(""); setInstType(""); setOnboardOpen(false);
  };

  const handleSaveConfig = () => {
    toast.success("System configuration saved");
    setConfigOpen(false);
  };

  const tabs: { id: AdminTab; label: string; icon: typeof Activity }[] = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "vehicles", label: "Vehicles", icon: Car },
    { id: "users", label: "Users", icon: Users },
    { id: "entries", label: "Customs", icon: FileText },
    { id: "audit", label: "Audit Log", icon: Activity },
  ];

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-6xl">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-display font-bold text-foreground">Government Console</h1>
              {isLive && (
                <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs font-body gap-1">
                  {isConnected && <Wifi className="h-3 w-3" />} Live
                </Badge>
              )}
              {!isLive && <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs font-body">Demo</Badge>}
            </div>
            <p className="text-muted-foreground font-body mt-1">Governance, oversight & administration.</p>
          </div>
          {isLive && (
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="font-body rounded-xl" data-testid="refresh-data-btn">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          )}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div variants={itemVariants} className="flex gap-1 bg-muted/30 p-1 rounded-xl overflow-x-auto" data-testid="admin-tabs">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`font-body rounded-lg flex-shrink-0 ${activeTab === tab.id ? "" : "text-muted-foreground"}`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="h-4 w-4 mr-1.5" /> {tab.label}
            </Button>
          ))}
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {(isLive ? liveKpis : mockKpis).map((kpi) => (
            <motion.div key={kpi.label} variants={itemVariants}>
              <Card className="border-border/40 bg-card/70 backdrop-blur-sm hover:shadow-lg hover:border-border/60 transition-all duration-300 hover:-translate-y-0.5">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center">
                      <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">{kpi.value}</p>
                  <p className="text-sm text-muted-foreground font-body">{kpi.label}</p>
                  <p className="text-xs text-muted-foreground/60 font-body mt-1">{kpi.trend}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground font-body">Loading live data...</span>
          </div>
        )}

        {/* === OVERVIEW TAB === */}
        {activeTab === "overview" && (
          <>
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
                  <CardHeader><CardTitle className="font-display text-lg">System Uptime (7 days)</CardTitle></CardHeader>
                  <CardContent>
                    <ChartContainer config={uptimeConfig} className="h-[220px] w-full">
                      <AreaChart data={uptimeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs><linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} /></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                        <XAxis dataKey="day" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis domain={[99.8, 100.1]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="uptime" stroke="hsl(var(--success))" fill="url(#uptimeGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
                  <CardHeader><CardTitle className="font-display text-lg">Audit Events Today</CardTitle></CardHeader>
                  <CardContent>
                    <ChartContainer config={auditConfig} className="h-[220px] w-full">
                      <BarChart data={auditData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                        <XAxis dataKey="hour" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="events" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
                <CardHeader><CardTitle className="font-display text-lg">Institution Integrations</CardTitle></CardHeader>
                <CardContent>
                  <table className="w-full"><thead><tr className="text-left border-b border-border/40">
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Institution</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Latency</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Last Sync</th>
                  </tr></thead><tbody>
                    {integrations.map((row) => (
                      <tr key={row.institution} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 font-body font-medium text-foreground flex items-center gap-2">
                          {row.status === "Healthy" ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> : <Clock className="h-4 w-4 text-warning shrink-0" />}
                          {row.institution}
                        </td>
                        <td className="py-3.5"><Badge variant="outline" className={`font-body text-xs rounded-lg ${intStatusColors[row.status]}`}>{row.status}</Badge></td>
                        <td className="py-3.5 text-sm text-muted-foreground font-body">{row.latency}</td>
                        <td className="py-3.5 text-sm text-muted-foreground font-body">{row.lastSync}</td>
                      </tr>
                    ))}
                  </tbody></table>
                </CardContent>
              </Card>
            </motion.div>

            <DatabaseIntegrationPanel />
            <FraudDetectionPanel />

            <motion.div variants={itemVariants}>
              <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
                <CardHeader><CardTitle className="font-display text-lg">Administration</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button className="font-body rounded-xl shadow-sm shadow-primary/10" onClick={() => setActiveTab("users")}><Users className="mr-2 h-4 w-4" /> Manage Users</Button>
                  <Button variant="outline" className="font-body rounded-xl border-border/40" onClick={() => setOnboardOpen(true)}><Building2 className="mr-2 h-4 w-4" /> Institution Onboarding</Button>
                  <Button variant="outline" className="font-body rounded-xl border-border/40" onClick={() => setConfigOpen(true)}><Settings className="mr-2 h-4 w-4" /> System Configuration</Button>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {/* === VEHICLES TAB === */}
        {activeTab === "vehicles" && (
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display text-lg">Vehicle Registry</CardTitle>
                <Input
                  placeholder="Search VIN, plate, make..."
                  value={vehicleSearch}
                  onChange={e => setVehicleSearch(e.target.value)}
                  className="max-w-xs h-9 rounded-xl border-border/60 font-body text-sm"
                  data-testid="vehicle-search-input"
                />
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full" data-testid="vehicles-table">
                    <thead><tr className="text-left border-b border-border/40">
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">VIN</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Vehicle</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Registration</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Owner</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Actions</th>
                    </tr></thead>
                    <tbody>
                      {(isLive ? filteredVehicles : [
                        { vin: "JTNB11HK0J3012345", make: "Toyota", model: "Hilux", year: 2024, registration: "HRE 4421 ZW", owner_name: "John Moyo", status: "active", color: "White", id: "1", created_at: "" },
                        { vin: "WBADT43452G123456", make: "BMW", model: "3 Series", year: 2020, registration: "HRE 8812 ZW", owner_name: "Grace Dube", status: "stolen", color: "Black", id: "2", created_at: "" },
                        { vin: "SALGS2EF8FA987654", make: "Land Rover", model: "Range Rover", year: 2019, registration: "BYO 4456 ZW", owner_name: "Michael Sithole", status: "stolen", color: "Grey", id: "3", created_at: "" },
                      ]).map(v => (
                        <tr key={v.vin} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="py-3 font-mono text-sm text-foreground">{v.vin}</td>
                          <td className="py-3 font-body text-sm text-muted-foreground">{v.year} {v.make} {v.model}</td>
                          <td className="py-3 font-body text-sm font-medium text-foreground">{v.registration || "—"}</td>
                          <td className="py-3 font-body text-sm text-muted-foreground">{v.owner_name || "—"}</td>
                          <td className="py-3">
                            <Badge variant="outline" className={`font-body text-xs rounded-lg ${vehStatusColors[v.status] || ""}`}>{v.status}</Badge>
                          </td>
                          <td className="py-3">
                            <Button size="sm" variant="ghost" className="text-xs font-body text-primary" onClick={() => { setSelectedVehicle(v); setVehicleDetailOpen(true); }}>
                              Manage
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {isLive && filteredVehicles.length === 0 && !loading && (
                    <p className="text-center py-8 text-muted-foreground font-body">No vehicles found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* === USERS TAB === */}
        {activeTab === "users" && (
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg">Registered Users</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full" data-testid="users-table">
                    <thead><tr className="text-left border-b border-border/40">
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Name</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Email</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Role</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Joined</th>
                    </tr></thead>
                    <tbody>
                      {(isLive ? profiles : mockUsers.map((u, i) => ({
                        id: String(i), full_name: u.name, email: `${u.name.split(' ').pop()?.toLowerCase()}@zimverify.gov.zw`,
                        role: u.role.toLowerCase(), created_at: new Date().toISOString(),
                      }))).map((u) => (
                        <tr key={u.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="py-3.5 font-body font-medium text-foreground">{u.full_name || "—"}</td>
                          <td className="py-3.5 font-body text-sm text-muted-foreground">{u.email}</td>
                          <td className="py-3.5">
                            <Badge variant="outline" className={`font-body text-xs rounded-lg capitalize ${roleColors[u.role] || ""}`}>{u.role}</Badge>
                          </td>
                          <td className="py-3.5 font-body text-sm text-muted-foreground">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {isLive && profiles.length === 0 && !loading && (
                    <p className="text-center py-8 text-muted-foreground font-body">No registered users yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* === CUSTOMS ENTRIES TAB === */}
        {activeTab === "entries" && (
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg">All Customs Entries</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full" data-testid="entries-admin-table">
                    <thead><tr className="text-left border-b border-border/40">
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Entry #</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">VIN</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Vehicle</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Port</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Date</th>
                    </tr></thead>
                    <tbody>
                      {(isLive ? entries : [
                        { id: "1", entry_number: "CE-2026-001234", vin: "JTNB11HK0J3012345", make: "Toyota", model: "Hilux", year: 2024, port_of_entry: "Beitbridge", status: "Processed", created_at: "2026-04-16T09:15:00Z", color: "", country_of_origin: "", importer_name: "", importer_id: "", registration: "", created_by: "" },
                        { id: "2", entry_number: "CE-2026-001233", vin: "MHFVC41F9JJ123456", make: "Honda", model: "Fit", year: 2023, port_of_entry: "Harare Airport", status: "Processed", created_at: "2026-04-16T08:30:00Z", color: "", country_of_origin: "", importer_name: "", importer_id: "", registration: "", created_by: "" },
                      ]).map(e => (
                        <tr key={e.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="py-3 font-body font-medium text-foreground">{e.entry_number}</td>
                          <td className="py-3 font-mono text-sm text-muted-foreground">{e.vin}</td>
                          <td className="py-3 font-body text-sm text-muted-foreground">{e.year} {e.make} {e.model}</td>
                          <td className="py-3 font-body text-sm text-muted-foreground">{e.port_of_entry}</td>
                          <td className="py-3"><Badge variant="outline" className="font-body text-xs rounded-lg">{e.status}</Badge></td>
                          <td className="py-3 font-body text-sm text-muted-foreground">{new Date(e.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* === AUDIT LOG TAB === */}
        {activeTab === "audit" && (
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg">Verification Audit Trail</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full" data-testid="audit-table">
                    <thead><tr className="text-left border-b border-border/40">
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Type</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Query</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Result</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Time</th>
                    </tr></thead>
                    <tbody>
                      {(isLive ? logs : [
                        { id: "1", user_id: "", search_type: "national_vin_check", search_query: "JTNB11HK0J3012345", result_found: true, result_data: {}, created_at: new Date().toISOString() },
                        { id: "2", user_id: "", search_type: "interpol_check", search_query: "WBADT43452G123456", result_found: true, result_data: {}, created_at: new Date(Date.now() - 3600000).toISOString() },
                      ]).map(l => (
                        <tr key={l.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="py-3">
                            <Badge variant="outline" className={`font-body text-xs rounded-lg ${l.search_type === "interpol_check" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"}`}>
                              {l.search_type === "interpol_check" ? "Interpol" : "National DB"}
                            </Badge>
                          </td>
                          <td className="py-3 font-mono text-sm text-foreground">{l.search_query}</td>
                          <td className="py-3">
                            <Badge variant="outline" className={`font-body text-xs rounded-lg ${l.result_found ? "bg-success/10 text-success" : "bg-muted/20 text-muted-foreground"}`}>
                              {l.result_found ? "Found" : "No Match"}
                            </Badge>
                          </td>
                          <td className="py-3 font-body text-sm text-muted-foreground">{new Date(l.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                      {isLive && logs.length === 0 && !loading && (
                        <tr><td colSpan={4} className="py-8 text-center text-muted-foreground font-body">No verification logs yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Vehicle Detail/Manage Dialog */}
      <Dialog open={vehicleDetailOpen} onOpenChange={setVehicleDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Manage Vehicle</DialogTitle>
            <DialogDescription className="font-body">{selectedVehicle?.make} {selectedVehicle?.model} — {selectedVehicle?.registration || selectedVehicle?.vin}</DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/20 border border-border/20"><p className="text-xs text-muted-foreground font-body">VIN</p><p className="font-mono text-sm font-bold">{selectedVehicle.vin}</p></div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border/20"><p className="text-xs text-muted-foreground font-body">Registration</p><p className="font-body font-bold">{selectedVehicle.registration || "—"}</p></div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border/20"><p className="text-xs text-muted-foreground font-body">Owner</p><p className="font-body font-bold">{selectedVehicle.owner_name || "—"}</p></div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border/20"><p className="text-xs text-muted-foreground font-body">Current Status</p><Badge variant="outline" className={`font-body text-xs rounded-lg ${vehStatusColors[selectedVehicle.status] || ""}`}>{selectedVehicle.status}</Badge></div>
              </div>
              <div className="border-t pt-4">
                <Label className="font-body text-sm font-semibold">Change Status</Label>
                <div className="flex gap-2 mt-2">
                  {["active", "stolen", "impounded"].map(s => (
                    <Button
                      key={s}
                      variant={selectedVehicle.status === s ? "default" : "outline"}
                      size="sm"
                      className="font-body rounded-lg capitalize"
                      onClick={() => handleStatusChange(selectedVehicle, s)}
                      disabled={selectedVehicle.status === s}
                      data-testid={`status-${s}-btn`}
                    >
                      {s === "stolen" && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {s === "active" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {s === "impounded" && <Shield className="h-3 w-3 mr-1" />}
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Institution Onboarding Dialog */}
      <Dialog open={onboardOpen} onOpenChange={setOnboardOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Onboard Institution</DialogTitle>
            <DialogDescription className="font-body">Register a new institutional partner</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label className="font-body text-sm">Institution Name</Label><Input value={instName} onChange={(e) => setInstName(e.target.value)} placeholder="e.g. National Insurance Corp" className="mt-1.5 rounded-xl border-border/60" /></div>
            <div><Label className="font-body text-sm">Type</Label>
              <Select value={instType} onValueChange={setInstType}><SelectTrigger className="mt-1.5 rounded-xl border-border/60"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent><SelectItem value="Government">Government Agency</SelectItem><SelectItem value="Law Enforcement">Law Enforcement</SelectItem><SelectItem value="Insurance">Insurance Provider</SelectItem><SelectItem value="Commercial">Commercial Partner</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOnboardOpen(false)} className="font-body rounded-xl">Cancel</Button><Button onClick={handleOnboard} className="font-body rounded-xl">Onboard</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* System Configuration Dialog */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-display">System Configuration</DialogTitle><DialogDescription className="font-body">Platform-wide settings</DialogDescription></DialogHeader>
          <div className="space-y-5">
            <div className="flex items-center justify-between"><div><p className="font-body font-medium text-foreground text-sm">Auto-Sync Databases</p><p className="text-xs text-muted-foreground font-body">Automatically sync all connected databases</p></div><Switch checked={autoSync} onCheckedChange={setAutoSync} /></div>
            <div className="flex items-center justify-between"><div><p className="font-body font-medium text-foreground text-sm">Maintenance Mode</p><p className="text-xs text-muted-foreground font-body">Restrict access to admins only</p></div><Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} /></div>
            <div><Label className="font-body text-sm">Audit Log Retention (days)</Label><Input type="number" value={auditRetention} onChange={(e) => setAuditRetention(e.target.value)} className="mt-1.5 rounded-xl border-border/60" min="30" max="365" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setConfigOpen(false)} className="font-body rounded-xl">Cancel</Button><Button onClick={handleSaveConfig} className="font-body rounded-xl">Save Configuration</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GovernmentConsole;
