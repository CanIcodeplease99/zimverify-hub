import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Activity, AlertTriangle, Wifi, CheckCircle, ArrowUp, FileText, Clock, TrendingUp, Globe, Search, Shield } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FraudDetectionPanel from "@/components/FraudDetectionPanel";

const caseTrends = [
  { week: "W1", opened: 5, resolved: 3 },
  { week: "W2", opened: 8, resolved: 6 },
  { week: "W3", opened: 4, resolved: 7 },
  { week: "W4", opened: 9, resolved: 5 },
  { week: "W5", opened: 6, resolved: 8 },
  { week: "W6", opened: 7, resolved: 7 },
];

const caseDistribution = [
  { name: "Stolen", value: 12, color: "hsl(var(--destructive))" },
  { name: "Mismatch", value: 8, color: "hsl(var(--warning))" },
  { name: "Expired", value: 15, color: "hsl(var(--accent))" },
  { name: "Routine", value: 45, color: "hsl(var(--primary))" },
];

const caseTrendConfig = {
  opened: { label: "Opened", color: "hsl(var(--destructive))" },
  resolved: { label: "Resolved", color: "hsl(var(--success))" },
};

const caseDistConfig = {
  value: { label: "Cases", color: "hsl(var(--primary))" },
};

const initialCases = [
  { plate: "HRE 4421 ZW", status: "Flagged", event: "Stolen marker active", actions: ["Escalate", "Hold"] },
  { plate: "BYO 7789 ZW", status: "Review", event: "Registry mismatch", actions: ["Escalate", "Hold"] },
  { plate: "GWE 1102 ZW", status: "Clear", event: "Routine check", actions: ["Release"] },
  { plate: "MUT 3345 ZW", status: "Flagged", event: "Licence expired 6mo+", actions: ["Escalate", "Hold"] },
  { plate: "MSV 6678 ZW", status: "Clear", event: "Routine check", actions: ["Release"] },
];

const alerts = [
  { title: "Stolen Marker — HRE 4421 ZW", desc: "Active stolen alert since 2026-01-15. Registered in Harare.", time: "2 hours ago", severity: "high" },
  { title: "Registry Mismatch — BYO 7789 ZW", desc: "VIN does not match CVR records. Manual review required.", time: "5 hours ago", severity: "medium" },
];

const statusColors: Record<string, string> = {
  Clear: "bg-success/10 text-success border-success/20",
  Review: "bg-warning/10 text-warning border-warning/20",
  Flagged: "bg-destructive/10 text-destructive border-destructive/20",
  Escalated: "bg-primary/10 text-primary border-primary/20",
  Held: "bg-info/10 text-info border-info/20",
  Released: "bg-muted/20 text-muted-foreground border-border/30",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PoliceConsole = () => {
  const [cases, setCases] = useState(initialCases);
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState("");
  const [noteText, setNoteText] = useState("");
  const [escalateReason, setEscalateReason] = useState("");
  
  // Interpol Verification
  const [interpolVin, setInterpolVin] = useState("");
  const [interpolLoading, setInterpolLoading] = useState(false);
  const [interpolResult, setInterpolResult] = useState<any>(null);
  
  // Regular VIN Check (National Database)
  const [regularVin, setRegularVin] = useState("");
  const [regularLoading, setRegularLoading] = useState(false);
  const [regularResult, setRegularResult] = useState<any>(null);
  
  const flaggedVehicles = [
    { vin: "WBADT43452G123456", make: "BMW", model: "3 Series", country: "South Africa", status: "Stolen" },
    { vin: "SALGS2EF8FA987654", make: "Land Rover", model: "Range Rover", country: "Kenya", status: "Stolen" },
  ];
  
  const nationalVehicles = [
    { vin: "JTNB11HK0J3012345", make: "Toyota", model: "Hilux", year: 2024, color: "White", registration: "HRE 4421 ZW", owner: "John Moyo", importDate: "2024-01-15", port: "Beitbridge", customsEntry: "CE-2024-001234" },
    { vin: "MHFVC41F9JJ123456", make: "Honda", model: "Fit", year: 2023, color: "Silver", registration: "BYO 7789 ZW", owner: "Sarah Ncube", importDate: "2023-11-20", port: "Harare Airport", customsEntry: "CE-2023-009876" },
    { vin: "3GCPYBEK0JG654321", make: "Ford", model: "Ranger", year: 2024, color: "Blue", registration: "GWE 1102 ZW", owner: "Peter Mutasa", importDate: "2024-03-10", port: "Chirundu", customsEntry: "CE-2024-002456" },
  ];

  const handleCaseAction = (plate: string, action: string) => {
    if (action === "Escalate") {
      setSelectedPlate(plate);
      setEscalateDialogOpen(true);
      return;
    }
    if (action === "Hold") {
      setCases(prev => prev.map(c => c.plate === plate ? { ...c, status: "Held", actions: ["Release"] } : c));
      toast.warning(`Vehicle ${plate} placed on hold`, { description: "Pending further investigation." });
      return;
    }
    if (action === "Release") {
      setCases(prev => prev.map(c => c.plate === plate ? { ...c, status: "Released", actions: [] } : c));
      toast.success(`Vehicle ${plate} released`, { description: "Case closed, no further action." });
    }
  };

  const handleEscalate = () => {
    setCases(prev => prev.map(c => c.plate === selectedPlate ? { ...c, status: "Escalated", actions: [] } : c));
    toast.success(`Case ${selectedPlate} escalated`, { description: escalateReason || "Sent to senior officer for review." });
    setEscalateReason("");
    setEscalateDialogOpen(false);
  };

  const handleQuickEscalate = () => {
    const flagged = cases.find(c => c.status === "Flagged");
    if (flagged) {
      setSelectedPlate(flagged.plate);
      setEscalateDialogOpen(true);
    } else {
      toast.info("No flagged cases to escalate");
    }
  };

  const handleMarkResolved = () => {
    const held = cases.find(c => c.status === "Held" || c.status === "Escalated");
    if (held) {
      setCases(prev => prev.map(c => c.plate === held.plate ? { ...c, status: "Released", actions: [] } : c));
      toast.success(`Case ${held.plate} resolved`);
    } else {
      toast.info("No pending cases to resolve");
    }
  };

  const handleCaptureNote = () => {
    if (!noteText.trim()) { toast.error("Please enter a note."); return; }
    toast.success("Roadside note saved", { description: `Note captured at ${new Date().toLocaleTimeString()}` });
    setNoteText("");
    setNoteDialogOpen(false);
  };
  
  const handleInterpolCheck = () => {
    if (!interpolVin.trim() || interpolVin.length < 10) {
      toast.error("Please enter a valid VIN");
      return;
    }
    
    setInterpolLoading(true);
    
    // Simulate Interpol database check
    setTimeout(() => {
      const flagged = flaggedVehicles.find(v => v.vin.includes(interpolVin.toUpperCase().substring(0, 10)));
      
      if (flagged) {
        setInterpolResult({ found: true, ...flagged, flagDate: "2026-01-15" });
        toast.error("⚠️ VEHICLE FLAGGED IN INTERPOL DATABASE", {
          description: `${flagged.make} ${flagged.model} - ${flagged.status}`
        });
      } else {
        setInterpolResult({ found: false });
        toast.success("✅ No Interpol flags found", {
          description: "Vehicle not in stolen vehicle database"
        });
      }
      
      setInterpolLoading(false);
    }, 1500);
  };
  
  const handleRegularVinCheck = () => {
    if (!regularVin.trim() || regularVin.length < 10) {
      toast.error("Please enter a valid VIN or Registration Number");
      return;
    }
    
    setRegularLoading(true);
    
    // Simulate national database check
    setTimeout(() => {
      const vehicle = nationalVehicles.find(v => 
        v.vin.includes(regularVin.toUpperCase().substring(0, 10)) || 
        v.registration.toUpperCase().includes(regularVin.toUpperCase())
      );
      
      if (vehicle) {
        setRegularResult({ found: true, ...vehicle });
        toast.success("✅ Vehicle found in national database", {
          description: `${vehicle.make} ${vehicle.model} - ${vehicle.registration}`
        });
      } else {
        setRegularResult({ found: false });
        toast.warning("Vehicle not found", {
          description: "No matching vehicle in national database"
        });
      }
      
      setRegularLoading(false);
    }, 1000);
  };

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 max-w-6xl">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-display font-bold text-foreground">Police Console</h1>
          <p className="text-muted-foreground font-body mt-1">Field operations & investigations overview.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Open Cases", value: String(cases.filter(c => !["Released"].includes(c.status)).length), icon: ShieldAlert, trend: "+2 today", color: "text-destructive" },
            { label: "Stops Today", value: "23", icon: Activity, trend: "↑ 15% vs avg", color: "text-primary" },
            { label: "Escalations", value: String(cases.filter(c => c.status === "Escalated").length), icon: ArrowUp, trend: "Pending review", color: "text-warning" },
            { label: "Device Status", value: "Online", icon: Wifi, trend: "All synced", color: "text-success" },
          ].map((kpi) => (
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

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg">Case Trends (6 weeks)</CardTitle></CardHeader>
              <CardContent>
                <ChartContainer config={caseTrendConfig} className="h-[220px] w-full">
                  <LineChart data={caseTrends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="week" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="opened" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="resolved" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg">Case Distribution</CardTitle></CardHeader>
              <CardContent>
                <ChartContainer config={caseDistConfig} className="h-[220px] w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie data={caseDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} strokeWidth={2} stroke="hsl(var(--card))">
                      {caseDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {caseDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                      {item.name} ({item.value})
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Regular VIN Check - National Database */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                National Vehicle Database - Quick VIN Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                  placeholder="Enter VIN or Registration Number"
                  value={regularVin}
                  onChange={(e) => setRegularVin(e.target.value.toUpperCase())}
                  className="flex-1 h-14 text-lg rounded-xl border-border/60 font-mono"
                />
                <Button 
                  onClick={handleRegularVinCheck} 
                  disabled={regularLoading}
                  className="h-14 px-8 font-body text-lg rounded-xl shadow-md shadow-primary/20"
                >
                  <Search className="mr-2 h-5 w-5" />
                  {regularLoading ? "Searching..." : "Check Vehicle"}
                </Button>
              </div>

              {regularResult && (
                <div className={`p-6 rounded-xl border-2 ${regularResult.found ? 'border-primary bg-primary/5' : 'border-warning bg-warning/5'}`}>
                  {regularResult.found ? (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="h-8 w-8 text-success" />
                        <div>
                          <h3 className="text-xl font-display font-bold text-foreground">Vehicle Found</h3>
                          <p className="text-sm text-muted-foreground font-body">Registered in Zimbabwe national database</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground font-body">VIN</p>
                          <p className="font-mono font-bold text-foreground text-sm">{regularResult.vin}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground font-body">Registration</p>
                          <p className="font-body font-bold text-foreground">{regularResult.registration}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground font-body">Vehicle</p>
                          <p className="font-body font-bold text-foreground">{regularResult.make} {regularResult.model}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground font-body">Year</p>
                          <p className="font-body font-bold text-foreground">{regularResult.year}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground font-body">Color</p>
                          <p className="font-body font-bold text-foreground">{regularResult.color}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground font-body">Owner</p>
                          <p className="font-body font-bold text-foreground">{regularResult.owner}</p>
                        </div>
                      </div>

                      <div className="border-t mt-4 pt-4">
                        <h4 className="font-semibold text-foreground mb-3">Import Details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Import Date:</p>
                            <p className="font-semibold">{new Date(regularResult.importDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Port of Entry:</p>
                            <p className="font-semibold">{regularResult.port}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Customs Entry:</p>
                            <p className="font-semibold">{regularResult.customsEntry}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-3" />
                      <h3 className="text-xl font-display font-bold text-warning">Vehicle Not Found</h3>
                      <p className="text-muted-foreground font-body">No matching vehicle in national database</p>
                      <p className="text-sm text-muted-foreground font-body mt-2">Vehicle may not be registered or incorrect VIN/plate</p>
                    </div>
                  )}
                </div>
              )}
              
              {!regularResult && (
                <div className="bg-primary-50/50 border border-primary-200/50 rounded-lg p-4">
                  <p className="text-sm font-body text-primary-900 font-semibold mb-2">🔍 National Database Check</p>
                  <ul className="text-xs text-primary-800 font-body space-y-1">
                    <li>• Search by VIN or Registration Number (plate)</li>
                    <li>• Instant access to vehicle ownership and import history</li>
                    <li>• Verify vehicle details during traffic stops</li>
                    <li>• Data sourced from ZIMRA customs records</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Interpol Verification Section - TABLET OPTIMIZED */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Interpol Database Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                  placeholder="Enter 17-character VIN"
                  value={interpolVin}
                  onChange={(e) => setInterpolVin(e.target.value.toUpperCase())}
                  className="flex-1 h-14 text-lg rounded-xl border-border/60 font-mono"
                  maxLength={17}
                />
                <Button 
                  onClick={handleInterpolCheck} 
                  disabled={interpolLoading}
                  className="h-14 px-8 font-body text-lg rounded-xl shadow-md shadow-primary/20"
                >
                  <Search className="mr-2 h-5 w-5" />
                  {interpolLoading ? "Checking..." : "Check Interpol"}
                </Button>
              </div>

              {interpolResult && (
                <div className={`p-6 rounded-xl border-2 ${interpolResult.found ? 'border-destructive bg-destructive/5' : 'border-success bg-success/5'}`}>
                  {interpolResult.found ? (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                        <div>
                          <h3 className="text-xl font-display font-bold text-destructive">VEHICLE FLAGGED</h3>
                          <p className="text-sm text-muted-foreground font-body">Found in Interpol stolen vehicle database</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground font-body">VIN</p>
                          <p className="font-mono font-bold text-foreground">{interpolResult.vin}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground font-body">Vehicle</p>
                          <p className="font-body font-bold text-foreground">{interpolResult.make} {interpolResult.model}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground font-body">Status</p>
                          <Badge className="bg-destructive text-destructive-foreground">{interpolResult.status}</Badge>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground font-body">Origin Country</p>
                          <p className="font-body font-bold text-foreground">{interpolResult.country}</p>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                        <p className="text-sm font-body text-destructive font-semibold">
                          🚨 IMMEDIATE ACTION: Detain vehicle, contact senior officer, and file cross-border report.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Shield className="h-12 w-12 text-success mx-auto mb-3" />
                      <h3 className="text-xl font-display font-bold text-success">All Clear</h3>
                      <p className="text-muted-foreground font-body">Vehicle not found in Interpol stolen database</p>
                    </div>
                  )}
                </div>
              )}
              
              {!interpolResult && (
                <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-4">
                  <p className="text-sm font-body text-blue-900 font-semibold mb-2">🌍 About Interpol Verification</p>
                  <ul className="text-xs text-blue-800 font-body space-y-1">
                    <li>• Connected to Interpol Stolen Motor Vehicle (SMV) database</li>
                    <li>• Real-time checks for cross-border stolen vehicles</li>
                    <li>• Data shared across SADC member states</li>
                    <li>• All checks are logged for audit purposes</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg">Cases</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-border/40">
                        <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Plate</th>
                        <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                        <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Last Event</th>
                        <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cases.map((c) => (
                        <tr key={c.plate} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="py-3.5 font-body font-medium text-foreground">{c.plate}</td>
                          <td className="py-3.5">
                            <Badge variant="outline" className={`font-body text-xs rounded-lg ${statusColors[c.status] || statusColors.Clear}`}>{c.status}</Badge>
                          </td>
                          <td className="py-3.5 text-sm text-muted-foreground font-body">{c.event}</td>
                          <td className="py-3.5 flex gap-2">
                            {c.actions.length > 0 ? c.actions.map((a) => (
                              <Button key={a} variant="ghost" size="sm" className="font-body text-xs hover:bg-primary/5 hover:text-primary" onClick={() => handleCaseAction(c.plate, a)}>{a}</Button>
                            )) : (
                              <span className="text-xs text-muted-foreground/50 font-body">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" /> Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.title} className={`p-4 rounded-xl border ${alert.severity === 'high' ? 'border-destructive/20 bg-destructive/5' : 'border-warning/20 bg-warning/5'}`}>
                    <p className="font-body font-semibold text-foreground text-sm">{alert.title}</p>
                    <p className="text-xs text-muted-foreground font-body mt-1">{alert.desc}</p>
                    <p className="text-xs text-muted-foreground/60 font-body mt-2 flex items-center gap-1"><Clock className="h-3 w-3" /> {alert.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <FraudDetectionPanel compact />

        <motion.div variants={itemVariants}>
          <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
            <CardHeader><CardTitle className="font-display text-lg">Quick Actions</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button className="font-body rounded-xl shadow-sm shadow-primary/10" onClick={handleQuickEscalate}><ArrowUp className="mr-2 h-4 w-4" /> Escalate Case</Button>
              <Button variant="outline" className="font-body rounded-xl border-border/40" onClick={() => setNoteDialogOpen(true)}><FileText className="mr-2 h-4 w-4" /> Capture Roadside Note</Button>
              <Button variant="outline" className="font-body rounded-xl border-border/40" onClick={handleMarkResolved}><CheckCircle className="mr-2 h-4 w-4" /> Mark Resolved</Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Escalate Dialog */}
      <Dialog open={escalateDialogOpen} onOpenChange={setEscalateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Escalate Case</DialogTitle>
            <DialogDescription className="font-body">Escalating {selectedPlate} to senior officer</DialogDescription>
          </DialogHeader>
          <div>
            <Label className="font-body text-sm">Reason (optional)</Label>
            <Textarea placeholder="Provide escalation reason..." value={escalateReason} onChange={(e) => setEscalateReason(e.target.value)} className="mt-1.5 rounded-xl border-border/60 min-h-[80px]" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEscalateDialogOpen(false)} className="font-body rounded-xl">Cancel</Button>
            <Button onClick={handleEscalate} className="font-body rounded-xl bg-destructive hover:bg-destructive/90">Escalate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Roadside Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Capture Roadside Note</DialogTitle>
            <DialogDescription className="font-body">Record observations from the field</DialogDescription>
          </DialogHeader>
          <div>
            <Label className="font-body text-sm">Note</Label>
            <Textarea placeholder="Vehicle condition, driver behaviour, location details..." value={noteText} onChange={(e) => setNoteText(e.target.value)} className="mt-1.5 rounded-xl border-border/60 min-h-[120px]" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialogOpen(false)} className="font-body rounded-xl">Cancel</Button>
            <Button onClick={handleCaptureNote} className="font-body rounded-xl">Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PoliceConsole;
