import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";
import { FileUp, Key, Shield, AlertTriangle, Activity, Zap, Clock, TrendingUp, Upload, CreditCard } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import { businessTiers, formatUSD } from "@/config/pricing";

const claimsOverTime = [
  { month: "Jan", verified: 42, flagged: 5 },
  { month: "Feb", verified: 38, flagged: 8 },
  { month: "Mar", verified: 55, flagged: 3 },
  { month: "Apr", verified: 48, flagged: 6 },
  { month: "May", verified: 62, flagged: 4 },
  { month: "Jun", verified: 58, flagged: 7 },
];

const apiUsage = [
  { day: "Mon", requests: 1850 },
  { day: "Tue", requests: 2100 },
  { day: "Wed", requests: 1920 },
  { day: "Thu", requests: 2400 },
  { day: "Fri", requests: 2080 },
  { day: "Sat", requests: 820 },
  { day: "Sun", requests: 610 },
];

const claimsChartConfig = {
  verified: { label: "Verified", color: "hsl(var(--success))" },
  flagged: { label: "Flagged", color: "hsl(var(--destructive))" },
};

const apiChartConfig = {
  requests: { label: "API Requests", color: "hsl(var(--accent))" },
};

const insuranceKpis = [
  { label: "Claims Linked", value: "342", icon: Shield, trend: "+18 this week", color: "text-primary" },
  { label: "Risk Checks", value: "1,204", icon: Activity, trend: "↑ 8% vs last month", color: "text-accent" },
  { label: "API Status", value: "Online", icon: Zap, trend: "All endpoints healthy", color: "text-success" },
  { label: "Bulk Uploads", value: "8", icon: FileUp, trend: "2 processing", color: "text-info" },
];

const claims = [
  { id: "CLM-2026-001", status: "Verified", risk: "Low", vehicle: "2023 Toyota Corolla" },
  { id: "CLM-2026-002", status: "Review", risk: "Medium", vehicle: "2019 Nissan NP200" },
  { id: "CLM-2026-003", status: "Hold", risk: "High", vehicle: "2021 Ford Ranger" },
  { id: "CLM-2026-004", status: "Verified", risk: "Low", vehicle: "2024 Isuzu D-Max" },
];

const partnerAlerts = [
  { title: "Claim mismatch — CLM-2026-002", desc: "VIN on claim does not match registration records.", time: "1 hour ago", severity: "warning" },
  { title: "Claim cleared — CLM-2026-001", desc: "Vehicle verified, claim approved for processing.", time: "3 hours ago", severity: "success" },
  { title: "Suspected fraud — CLM-2026-003", desc: "Multiple claims on same VIN within 30 days.", time: "6 hours ago", severity: "error" },
];

const statusColors: Record<string, string> = {
  Verified: "bg-success/10 text-success border-success/20",
  Review: "bg-warning/10 text-warning border-warning/20",
  Hold: "bg-destructive/10 text-destructive border-destructive/20",
};

const riskColors: Record<string, string> = { Low: "text-success", Medium: "text-warning", High: "text-destructive" };

const alertColors: Record<string, string> = {
  warning: "border-warning/20 bg-warning/5",
  success: "border-success/20 bg-success/5",
  error: "border-destructive/20 bg-destructive/5",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const InsurancePartnerPortal = () => {
  const location = useLocation();
  const isPartner = location.pathname.includes("partners");

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 max-w-6xl">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-display font-bold text-foreground">
          {isPartner ? "Partner Portal" : "Insurance Portal"}
        </h1>
        <p className="text-muted-foreground font-body mt-1">
          {isPartner ? "API management, bulk operations & analytics." : "Claims verification, risk checks & fraud monitoring."}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {insuranceKpis.map((kpi) => (
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
            <CardHeader><CardTitle className="font-display text-lg">{isPartner ? "API Usage (7 days)" : "Claims Over Time"}</CardTitle></CardHeader>
            <CardContent>
              {isPartner ? (
                <ChartContainer config={apiChartConfig} className="h-[220px] w-full">
                  <BarChart data={apiUsage} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="day" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="requests" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <ChartContainer config={claimsChartConfig} className="h-[220px] w-full">
                  <LineChart data={claimsOverTime} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="verified" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="flagged" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
            <CardHeader><CardTitle className="font-display text-lg">{isPartner ? "Latency Trend" : "Risk Distribution"}</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={apiChartConfig} className="h-[220px] w-full">
                <BarChart
                  data={isPartner
                    ? apiUsage.map((d, i) => ({ ...d, latency: [38, 42, 45, 39, 44, 52, 48][i] }))
                    : [{ risk: "Low", count: 28 }, { risk: "Medium", count: 9 }, { risk: "High", count: 4 }]
                  }
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey={isPartner ? "day" : "risk"} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey={isPartner ? "latency" : "count"} fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {!isPartner && (
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg">Claims</CardTitle></CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-border/40">
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Claim ID</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Vehicle</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((c) => (
                      <tr key={c.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 font-body font-medium text-foreground">{c.id}</td>
                        <td className="py-3.5 text-sm text-muted-foreground font-body">{c.vehicle}</td>
                        <td className="py-3.5"><Badge variant="outline" className={`font-body text-xs rounded-lg ${statusColors[c.status]}`}>{c.status}</Badge></td>
                        <td className={`py-3.5 text-sm font-body font-semibold ${riskColors[c.risk]}`}>{c.risk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" /> Partner Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {partnerAlerts.map((alert) => (
                  <div key={alert.title} className={`p-4 rounded-xl border ${alertColors[alert.severity]}`}>
                    <p className="font-body font-semibold text-foreground text-sm">{alert.title}</p>
                    <p className="text-xs text-muted-foreground font-body mt-1">{alert.desc}</p>
                    <p className="text-xs text-muted-foreground/60 font-body mt-2 flex items-center gap-1"><Clock className="h-3 w-3" /> {alert.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {isPartner && (
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg">Bulk Upload</CardTitle></CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border/40 rounded-2xl p-10 text-center bg-muted/10 hover:border-primary/30 hover:bg-muted/20 transition-all cursor-pointer">
                  <div className="w-14 h-14 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-body text-foreground font-medium">Drag & drop CSV of plates/VINs</p>
                  <p className="text-sm text-muted-foreground font-body mt-1">or click to browse files</p>
                  <Button variant="outline" className="mt-4 font-body rounded-xl border-border/40">Browse Files</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg">API Token Management</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/20 border border-border/20 flex items-center justify-between">
                  <div>
                    <p className="font-body font-medium text-foreground">Production Token</p>
                    <p className="text-xs text-muted-foreground font-body">zv_prod_••••••••k4m2</p>
                  </div>
                  <Button variant="outline" size="sm" className="font-body text-xs rounded-lg border-border/40">Revoke</Button>
                </div>
                <Button className="font-body rounded-xl shadow-sm shadow-primary/10"><Key className="mr-2 h-4 w-4" /> Create New Token</Button>

                <div className="mt-6 pt-4 border-t border-border/30">
                  <h4 className="font-display font-semibold text-foreground mb-3">Usage Metrics</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "12,480", label: "Requests/mo" },
                      { value: "42ms", label: "Median Latency" },
                      { value: "0.02%", label: "Error Rate" },
                    ].map((m) => (
                      <div key={m.label} className="text-center p-3 bg-muted/20 rounded-xl border border-border/20">
                        <p className="text-lg font-display font-bold text-foreground">{m.value}</p>
                        <p className="text-xs text-muted-foreground font-body">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default InsurancePartnerPortal;
