import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Database, CheckCircle2, TrendingUp, FileText, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCustomsEntries, createCustomsEntry, fetchCustomsKPIs } from "@/services/dataService";
import type { CustomsEntry } from "@/lib/database.types";

const mockKpis = [
  { label: "Entries Today", value: "47", icon: Truck, trend: "+12 vs yesterday", color: "text-primary" },
  { label: "Total Imports (Month)", value: "1,234", icon: Database, trend: "+8% vs last month", color: "text-accent" },
  { label: "Processed", value: "98.5%", icon: CheckCircle2, trend: "Compliance rate", color: "text-success" },
  { label: "Pending Review", value: "3", icon: FileText, trend: "Needs verification", color: "text-warning" },
];

const mockEntries = [
  { entryNo: "CE-2026-001234", vin: "JTNB11HK0J3012345", make: "Toyota", model: "Hilux", year: 2024, port: "Beitbridge", status: "Processed", date: "2026-04-16 09:15" },
  { entryNo: "CE-2026-001233", vin: "MHFVC41F9JJ123456", make: "Honda", model: "Fit", year: 2023, port: "Harare Airport", status: "Processed", date: "2026-04-16 08:30" },
  { entryNo: "CE-2026-001232", vin: "3GCPYBEK0JG654321", make: "Ford", model: "Ranger", year: 2024, port: "Chirundu", status: "Review", date: "2026-04-15 14:20" },
];

const statusColors: Record<string, string> = {
  Processed: "bg-success/10 text-success border-success/20",
  Review: "bg-warning/10 text-warning border-warning/20",
  Pending: "bg-info/10 text-info border-info/20",
};

const zimPorts = [
  "Beitbridge", "Chirundu", "Forbes", "Harare Airport", "Kazungula",
  "Kariba", "Mutare", "Nyamapanda", "Plumtree", "Victoria Falls"
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CustomsConsole = () => {
  const { authMode, user } = useAuth();
  const isLive = authMode === "supabase";

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [entries, setEntries] = useState<CustomsEntry[]>([]);
  const [liveKpis, setLiveKpis] = useState<{ entriesToday: number; totalMonth: number; processedRate: number; pendingReview: number } | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  const [formData, setFormData] = useState({
    entryNumber: "",
    vin: "",
    make: "",
    model: "",
    year: "",
    color: "",
    portOfEntry: "",
    countryOfOrigin: "",
    importerName: "",
    importerID: "",
    registrationNumber: "",
  });

  useEffect(() => {
    if (!isLive) return;
    setLoadingData(true);
    Promise.all([fetchCustomsEntries(), fetchCustomsKPIs()])
      .then(([e, k]) => {
        setEntries(e);
        setLiveKpis(k);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoadingData(false));
  }, [isLive]);

  const kpis = isLive && liveKpis
    ? [
        { label: "Entries Today", value: String(liveKpis.entriesToday), icon: Truck, trend: "Live data", color: "text-primary" },
        { label: "Total Imports (Month)", value: liveKpis.totalMonth.toLocaleString(), icon: Database, trend: "Live data", color: "text-accent" },
        { label: "Processed", value: `${liveKpis.processedRate}%`, icon: CheckCircle2, trend: "Compliance rate", color: "text-success" },
        { label: "Pending Review", value: String(liveKpis.pendingReview), icon: FileText, trend: "Needs verification", color: "text-warning" },
      ]
    : mockKpis;

  const displayEntries = isLive
    ? entries.map((e) => ({
        entryNo: e.entry_number,
        vin: e.vin,
        make: e.make,
        model: e.model,
        year: e.year,
        port: e.port_of_entry,
        status: e.status,
        date: new Date(e.created_at).toLocaleString(),
      }))
    : mockEntries;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.entryNumber || !formData.vin || !formData.make || !formData.model || !formData.portOfEntry) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isLive) {
      setSubmitting(true);
      const { error } = await createCustomsEntry({
        entry_number: formData.entryNumber,
        vin: formData.vin.toUpperCase(),
        make: formData.make,
        model: formData.model,
        year: formData.year ? parseInt(formData.year) : 0,
        color: formData.color,
        port_of_entry: formData.portOfEntry,
        country_of_origin: formData.countryOfOrigin,
        importer_name: formData.importerName,
        importer_id: formData.importerID,
        registration: formData.registrationNumber.toUpperCase(),
        status: "Pending",
        created_by: user?.id || "",
      });
      setSubmitting(false);

      if (error) {
        toast.error("Failed to register", { description: error });
        return;
      }

      // Refresh data
      const [newEntries, newKpis] = await Promise.all([fetchCustomsEntries(), fetchCustomsKPIs()]);
      setEntries(newEntries);
      setLiveKpis(newKpis);
    }

    toast.success("Vehicle import registered", {
      description: `Entry ${formData.entryNumber} added to ${isLive ? "Supabase" : "mock"} database`,
    });

    setFormData({
      entryNumber: "", vin: "", make: "", model: "", year: "", color: "",
      portOfEntry: "", countryOfOrigin: "", importerName: "", importerID: "", registrationNumber: "",
    });
    setAddDialogOpen(false);
  };

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 max-w-6xl">
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-bold text-foreground">Customs Console (ZIMRA)</h1>
            {isLive && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs font-body" data-testid="live-badge">
                Live
              </Badge>
            )}
            {!isLive && (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs font-body" data-testid="demo-badge">
                Demo
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground font-body mt-1">Source of truth for imported vehicles -- border entry management.</p>
        </motion.div>

        {loadingData ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground font-body">Loading live data...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {kpis.map((kpi) => (
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

            <motion.div variants={itemVariants}>
              <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-display text-lg">Recent Import Entries</CardTitle>
                  <Button onClick={() => setAddDialogOpen(true)} className="font-body rounded-xl shadow-sm shadow-primary/10" data-testid="register-import-btn">
                    <Plus className="mr-2 h-4 w-4" /> Register Import
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full" data-testid="entries-table">
                      <thead>
                        <tr className="text-left border-b border-border/40">
                          <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Entry Number</th>
                          <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">VIN</th>
                          <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Vehicle</th>
                          <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Port of Entry</th>
                          <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                          <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Date/Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayEntries.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-muted-foreground font-body">
                              No entries found. Register a new import to get started.
                            </td>
                          </tr>
                        ) : (
                          displayEntries.map((entry) => (
                            <tr key={entry.entryNo} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                              <td className="py-3.5 font-body font-medium text-foreground">{entry.entryNo}</td>
                              <td className="py-3.5 text-sm text-muted-foreground font-body font-mono">{entry.vin}</td>
                              <td className="py-3.5 text-sm text-muted-foreground font-body">{entry.year} {entry.make} {entry.model}</td>
                              <td className="py-3.5 text-sm text-muted-foreground font-body">{entry.port}</td>
                              <td className="py-3.5">
                                <Badge variant="outline" className={`font-body text-xs rounded-lg ${statusColors[entry.status] || ""}`}>{entry.status}</Badge>
                              </td>
                              <td className="py-3.5 text-sm text-muted-foreground font-body">{entry.date}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-border/40 bg-card/70 backdrop-blur-sm bg-blue-50/50">
                <CardContent className="p-6">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-3">ZIMRA Officer Guidelines</h3>
                  <ul className="space-y-2 text-sm font-body text-muted-foreground">
                    <li>All imported vehicles MUST be registered in the system at point of entry</li>
                    <li>VIN verification is mandatory -- verify against vehicle chassis plate</li>
                    <li>Customs Entry Number must follow format: CE-YYYY-NNNNNN</li>
                    <li>This data becomes the source of truth for law enforcement and public verification</li>
                    <li>Historical data will be accessible to police, government agencies, and public users</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Add Import Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Register Imported Vehicle</DialogTitle>
            <DialogDescription className="font-body">
              Enter complete vehicle import details for {isLive ? "Supabase" : "demo"} database
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-sm">Customs Entry Number *</Label>
                <Input
                  placeholder="CE-2026-NNNNNN"
                  value={formData.entryNumber}
                  onChange={(e) => handleInputChange("entryNumber", e.target.value)}
                  className="mt-1.5 rounded-xl border-border/60"
                  data-testid="entry-number-input"
                />
              </div>
              <div>
                <Label className="font-body text-sm">VIN (Vehicle Identification Number) *</Label>
                <Input
                  placeholder="17-character VIN"
                  value={formData.vin}
                  onChange={(e) => handleInputChange("vin", e.target.value.toUpperCase())}
                  className="mt-1.5 rounded-xl border-border/60 font-mono"
                  maxLength={17}
                  data-testid="vin-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-sm">Make *</Label>
                <Input
                  placeholder="e.g., Toyota"
                  value={formData.make}
                  onChange={(e) => handleInputChange("make", e.target.value)}
                  className="mt-1.5 rounded-xl border-border/60"
                  data-testid="make-input"
                />
              </div>
              <div>
                <Label className="font-body text-sm">Model *</Label>
                <Input
                  placeholder="e.g., Hilux"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className="mt-1.5 rounded-xl border-border/60"
                  data-testid="model-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-sm">Year</Label>
                <Input
                  type="number"
                  placeholder="2024"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  className="mt-1.5 rounded-xl border-border/60"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              <div>
                <Label className="font-body text-sm">Color</Label>
                <Input
                  placeholder="e.g., White"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  className="mt-1.5 rounded-xl border-border/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-sm">Port of Entry *</Label>
                <Select value={formData.portOfEntry} onValueChange={(v) => handleInputChange("portOfEntry", v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl border-border/60" data-testid="port-select">
                    <SelectValue placeholder="Select port" />
                  </SelectTrigger>
                  <SelectContent>
                    {zimPorts.map((port) => (
                      <SelectItem key={port} value={port}>{port}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-body text-sm">Country of Origin</Label>
                <Input
                  placeholder="e.g., Japan"
                  value={formData.countryOfOrigin}
                  onChange={(e) => handleInputChange("countryOfOrigin", e.target.value)}
                  className="mt-1.5 rounded-xl border-border/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-sm">Importer Name</Label>
                <Input
                  placeholder="Full name or company"
                  value={formData.importerName}
                  onChange={(e) => handleInputChange("importerName", e.target.value)}
                  className="mt-1.5 rounded-xl border-border/60"
                />
              </div>
              <div>
                <Label className="font-body text-sm">Importer ID/Registration</Label>
                <Input
                  placeholder="National ID or company reg"
                  value={formData.importerID}
                  onChange={(e) => handleInputChange("importerID", e.target.value)}
                  className="mt-1.5 rounded-xl border-border/60"
                />
              </div>
            </div>

            <div>
              <Label className="font-body text-sm">Registration Number (if applicable)</Label>
              <Input
                placeholder="e.g., ABC 1234 ZW"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange("registrationNumber", e.target.value.toUpperCase())}
                className="mt-1.5 rounded-xl border-border/60"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="font-body rounded-xl">Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="font-body rounded-xl" data-testid="submit-import-btn">
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</> : "Register Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomsConsole;
