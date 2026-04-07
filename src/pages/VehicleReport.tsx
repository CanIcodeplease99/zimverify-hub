import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, Download, Printer, Share2, Car, Shield, User, FileText,
  Calendar, MapPin, AlertTriangle, Wrench, Activity,
} from "lucide-react";

const mockReport = {
  plate: "ABC 1234 ZW",
  vin: "1HGBH41JXMN109186",
  year: 2024,
  make: "Toyota",
  model: "Hilux",
  trim: "SR5 Double Cab",
  status: "Clear",
  statusDesc: "No adverse records found. Vehicle is clear for transactions.",
  body: "Pickup",
  engine: "2.8L Turbo Diesel I4",
  color: "White",
  mileageBand: "15,000 – 20,000 km",
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

const VehicleReport = () => {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setSearched(false);
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 1500);
  };

  const statusColor = mockReport.status === "Clear"
    ? "bg-success/10 text-success border-success/30"
    : mockReport.status === "Review"
    ? "bg-warning/10 text-warning border-warning/30"
    : "bg-destructive/10 text-destructive border-destructive/30";

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Vehicle Search</h1>
        <p className="text-muted-foreground font-body mt-1">Enter a plate number or VIN/chassis to run a check.</p>
      </div>

      {/* Search bar */}
      <Card>
        <CardContent className="p-5 flex gap-3">
          <Input
            placeholder="Enter plate or VIN/chassis..."
            className="flex-1 font-body"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} className="font-body px-6">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </CardContent>
      </Card>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      )}

      {/* Report */}
      {searched && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Top Summary */}
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    {mockReport.year} {mockReport.make} {mockReport.model} {mockReport.trim}
                  </h2>
                  <p className="text-muted-foreground font-body mt-1">{mockReport.statusDesc}</p>
                </div>
                <Badge variant="outline" className={`text-sm px-4 py-1.5 font-body font-semibold ${statusColor}`}>
                  {mockReport.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2"><Car className="h-5 w-5 text-primary" /> Vehicle Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "VIN", value: mockReport.vin },
                  { label: "Plate", value: mockReport.plate },
                  { label: "Year", value: mockReport.year },
                  { label: "Make / Model", value: `${mockReport.make} ${mockReport.model}` },
                  { label: "Body", value: mockReport.body },
                  { label: "Engine", value: mockReport.engine },
                  { label: "Color", value: mockReport.color },
                  { label: "Mileage", value: mockReport.mileageBand },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-muted-foreground font-body">{item.label}</p>
                    <p className="font-body font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ownership */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Ownership History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-body mb-4">{mockReport.owners.length} owner(s) on record</p>
              <div className="space-y-3">
                {mockReport.owners.map((owner, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-body font-medium text-foreground">{owner.period}</p>
                      <p className="text-xs text-muted-foreground font-body">{owner.region} · {owner.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Title & Legal */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Title & Legal Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Stolen Alert", value: mockReport.titleStatus.stolen ? "YES" : "None", ok: !mockReport.titleStatus.stolen },
                  { label: "Salvage/Rebuilt", value: mockReport.titleStatus.salvage ? "YES" : "None", ok: !mockReport.titleStatus.salvage },
                  { label: "Flood Damage", value: mockReport.titleStatus.flood ? "YES" : "None", ok: !mockReport.titleStatus.flood },
                  { label: "Odometer", value: mockReport.titleStatus.odometerRollback ? "Anomaly" : "OK", ok: !mockReport.titleStatus.odometerRollback },
                ].map((item) => (
                  <div key={item.label} className={`p-3 rounded-lg text-center ${item.ok ? "bg-success/5 border border-success/20" : "bg-destructive/5 border border-destructive/20"}`}>
                    <p className="text-xs text-muted-foreground font-body">{item.label}</p>
                    <p className={`font-body font-semibold ${item.ok ? "text-success" : "text-destructive"}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Registration */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Registration & Licensing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><p className="text-xs text-muted-foreground font-body">Status</p><p className="font-body font-medium text-success">{mockReport.registration.status}</p></div>
                <div><p className="text-xs text-muted-foreground font-body">Expiry</p><p className="font-body font-medium">{mockReport.registration.expiry}</p></div>
                <div><p className="text-xs text-muted-foreground font-body">Renewals</p><p className="font-body font-medium">{mockReport.registration.renewals}</p></div>
                <div><p className="text-xs text-muted-foreground font-body">Lapses</p><p className="font-body font-medium">{mockReport.registration.lapses}</p></div>
              </div>
            </CardContent>
          </Card>

          {/* Service History */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" /> Service / Inspection History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockReport.serviceHistory.map((s, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <p className="font-body font-medium text-foreground">{s.type}</p>
                      <p className="text-xs text-muted-foreground font-body">{s.date} · {s.mileage} · {s.provider}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Accidents */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary" /> Accident / Damage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-success/5 border border-success/20 text-center">
                <p className="font-body text-success font-semibold">No accidents or damage reported</p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Detailed Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 space-y-4">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
                {mockReport.timeline.map((t, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-primary border-2 border-card" />
                    <p className="text-xs text-muted-foreground font-body">{t.date}</p>
                    <p className="font-body font-medium text-foreground">{t.event}</p>
                    <p className="text-sm text-muted-foreground font-body">{t.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button className="font-body"><Download className="mr-2 h-4 w-4" /> Download Report</Button>
            <Button variant="outline" className="font-body"><Printer className="mr-2 h-4 w-4" /> Print</Button>
            <Button variant="outline" className="font-body"><Share2 className="mr-2 h-4 w-4" /> Share Secure Link</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VehicleReport;
