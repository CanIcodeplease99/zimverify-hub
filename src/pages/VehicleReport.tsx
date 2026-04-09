import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, Download, Printer, Share2, Car, Shield, User, FileText,
  Calendar, MapPin, AlertTriangle, Wrench, Activity, CheckCircle2, Clock,
} from "lucide-react";

const mockReport = {
  plate: "ABC 1234 ZW", vin: "1HGBH41JXMN109186", year: 2024, make: "Toyota", model: "Hilux",
  trim: "SR5 Double Cab", status: "Clear",
  statusDesc: "No adverse records found. Vehicle is clear for transactions.",
  body: "Pickup", engine: "2.8L Turbo Diesel I4", color: "White", mileageBand: "15,000 – 20,000 km",
  owners: [
    { period: "Jan 2024 – Present", region: "Harare", type: "Personal" },
    { period: "Jun 2022 – Dec 2023", region: "Bulawayo", type: "Commercial" },
  ],
  titleStatus: { stolen: false, salvage: false, flood: false, odometerRollback: false },
  registration: { status: "Active", expiry: "2027-03-15", renewals: 3, lapses: 0 },
  serviceHistory: [
    { date: "2025-11-10", type: "Major Service", mileage: "18,200 km", provider: "Toyota Zimbabwe" },
    { date: "2025-05-20", type: "Inspection", mileage: "12,500 km", provider: "ZINARA Depot" },
    { date: "2024-08-01", type: "First Service", mileage: "5,000 km", provider: "Toyota Zimbabwe" },
  ],
  accidents: [],
  timeline: [
    { date: "2024-01-15", event: "First Registration", detail: "Registered in Harare" },
    { date: "2024-08-01", event: "Service", detail: "First service at 5,000 km" },
    { date: "2025-03-10", event: "Licence Renewed", detail: "ZINARA licence renewed" },
    { date: "2025-05-20", event: "Inspection", detail: "Passed vehicle inspection" },
    { date: "2025-11-10", event: "Service", detail: "Major service at 18,200 km" },
    { date: "2026-03-15", event: "Licence Renewed", detail: "ZINARA licence renewed" },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const VehicleReport = () => {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true); setSearched(false);
    setTimeout(() => { setLoading(false); setSearched(true); }, 1500);
  };

  const statusColor = "bg-success/10 text-success border-success/30";

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Vehicle Search</h1>
        <p className="text-muted-foreground font-body mt-1">Enter a plate number or VIN/chassis to run a check.</p>
      </div>

      {/* Search bar */}
      <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
        <CardContent className="p-5 flex gap-3">
          <Input placeholder="Enter plate or VIN/chassis..." className="flex-1 font-body h-12 rounded-xl border-border/40 bg-background/50" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
          <Button onClick={handleSearch} className="font-body px-8 h-12 rounded-xl shadow-sm shadow-primary/10">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </CardContent>
      </Card>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
      )}

      {/* Report */}
      {searched && !loading && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5">
          {/* Top Summary */}
          <motion.div variants={itemVariants}>
            <Card className="border-l-4 border-l-success border-border/40 bg-card/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground">{mockReport.year} {mockReport.make} {mockReport.model} {mockReport.trim}</h2>
                    <p className="text-muted-foreground font-body mt-1 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" /> {mockReport.statusDesc}
                    </p>
                  </div>
                  <Badge variant="outline" className={`text-sm px-4 py-1.5 font-body font-semibold rounded-xl ${statusColor}`}>{mockReport.status}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vehicle Overview */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><Car className="h-5 w-5 text-primary" /> Vehicle Overview</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "VIN", value: mockReport.vin }, { label: "Plate", value: mockReport.plate },
                    { label: "Year", value: mockReport.year }, { label: "Make / Model", value: `${mockReport.make} ${mockReport.model}` },
                    { label: "Body", value: mockReport.body }, { label: "Engine", value: mockReport.engine },
                    { label: "Color", value: mockReport.color }, { label: "Mileage", value: mockReport.mileageBand },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl bg-muted/20 border border-border/20">
                      <p className="text-xs text-muted-foreground font-body">{item.label}</p>
                      <p className="font-body font-medium text-foreground mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ownership */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Ownership History</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-body mb-4">{mockReport.owners.length} owner(s) on record</p>
                <div className="space-y-3">
                  {mockReport.owners.map((owner, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/20 hover:border-primary/20 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm">{i + 1}</div>
                      <div className="flex-1">
                        <p className="font-body font-medium text-foreground">{owner.period}</p>
                        <p className="text-xs text-muted-foreground font-body flex items-center gap-1"><MapPin className="h-3 w-3" /> {owner.region} · {owner.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Title & Legal */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Title & Legal Status</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Stolen Alert", value: "None", ok: true },
                    { label: "Salvage/Rebuilt", value: "None", ok: true },
                    { label: "Flood Damage", value: "None", ok: true },
                    { label: "Odometer", value: "OK", ok: true },
                  ].map((item) => (
                    <div key={item.label} className={`p-4 rounded-xl text-center border ${item.ok ? "bg-success/5 border-success/15" : "bg-destructive/5 border-destructive/15"}`}>
                      <CheckCircle2 className={`h-5 w-5 mx-auto mb-2 ${item.ok ? "text-success" : "text-destructive"}`} />
                      <p className="text-xs text-muted-foreground font-body">{item.label}</p>
                      <p className={`font-body font-semibold ${item.ok ? "text-success" : "text-destructive"}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Registration */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Registration & Licensing</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Status", value: mockReport.registration.status, cls: "text-success font-semibold" },
                    { label: "Expiry", value: mockReport.registration.expiry },
                    { label: "Renewals", value: mockReport.registration.renewals },
                    { label: "Lapses", value: mockReport.registration.lapses },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl bg-muted/20 border border-border/20">
                      <p className="text-xs text-muted-foreground font-body">{item.label}</p>
                      <p className={`font-body font-medium mt-0.5 ${(item as any).cls || "text-foreground"}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Service History */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" /> Service / Inspection History</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReport.serviceHistory.map((s, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 border border-border/20 hover:border-primary/20 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                        <Wrench className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-body font-medium text-foreground">{s.type}</p>
                        <p className="text-xs text-muted-foreground font-body flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {s.date} · {s.mileage} · {s.provider}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Accidents */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary" /> Accident / Damage</CardTitle></CardHeader>
              <CardContent>
                <div className="p-5 rounded-xl bg-success/5 border border-success/15 text-center">
                  <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="font-body text-success font-semibold">No accidents or damage reported</p>
                  <p className="text-xs text-muted-foreground font-body mt-1">This vehicle has a clean accident history</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timeline */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Detailed Timeline</CardTitle></CardHeader>
              <CardContent>
                <div className="relative pl-8 space-y-5">
                  <div className="absolute left-[15px] top-3 bottom-3 w-px bg-border" />
                  {mockReport.timeline.map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="relative"
                    >
                      <div className="absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-card shadow-sm" />
                      <div className="p-3 rounded-xl hover:bg-muted/20 transition-colors">
                        <p className="text-xs text-muted-foreground font-body flex items-center gap-1"><Calendar className="h-3 w-3" /> {t.date}</p>
                        <p className="font-body font-medium text-foreground">{t.event}</p>
                        <p className="text-sm text-muted-foreground font-body">{t.detail}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <Button className="font-body rounded-xl shadow-sm shadow-primary/10"><Download className="mr-2 h-4 w-4" /> Download Report</Button>
            <Button variant="outline" className="font-body rounded-xl border-border/40"><Printer className="mr-2 h-4 w-4" /> Print</Button>
            <Button variant="outline" className="font-body rounded-xl border-border/40"><Share2 className="mr-2 h-4 w-4" /> Share Secure Link</Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default VehicleReport;
