import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";
import { FileUp, Key, Shield, AlertTriangle, Activity, Zap, TrendingUp, Upload, Copy } from "lucide-react";

const insuranceKpis = [
  { label: "Claims Linked", value: "342", icon: Shield, trend: "+18 this week", color: "text-primary" },
  { label: "Risk Checks", value: "1,204", icon: Activity, trend: "↑ 8% vs last month", color: "text-accent" },
  { label: "API Status", value: "Online", icon: Zap, trend: "99.9% uptime", color: "text-success" },
  { label: "Bulk Uploads", value: "8", icon: FileUp, trend: "3 processing", color: "text-warning" },
];

const claims = [
  { id: "CLM-2026-001", status: "Verified", risk: "Low", vehicle: "2024 Toyota Hilux", date: "Apr 7" },
  { id: "CLM-2026-002", status: "Review", risk: "Medium", vehicle: "2019 Honda Fit", date: "Apr 6" },
  { id: "CLM-2026-003", status: "Hold", risk: "High", vehicle: "2018 Nissan NP300", date: "Apr 5" },
  { id: "CLM-2026-004", status: "Verified", risk: "Low", vehicle: "2023 Ford Ranger", date: "Apr 4" },
];

const partnerAlerts = [
  { title: "Claim mismatch — CLM-2026-002", desc: "VIN on claim does not match registration records.", time: "1 hour ago", severity: "warning" },
  { title: "Claim cleared — CLM-2026-001", desc: "Vehicle verified, claim approved for processing.", time: "3 hours ago", severity: "success" },
  { title: "Suspected fraud — CLM-2026-003", desc: "Multiple claims on same VIN within 30 days.", time: "6 hours ago", severity: "critical" },
];

const statusColors: Record<string, string> = {
  Verified: "bg-success/10 text-success border-success/20",
  Review: "bg-warning/10 text-warning border-warning/20",
  Hold: "bg-destructive/10 text-destructive border-destructive/20",
};

const riskColors: Record<string, string> = { Low: "text-success", Medium: "text-warning", High: "text-destructive" };

const alertColors: Record<string, string> = {
  warning: "border-warning/30 bg-warning/5",
  success: "border-success/30 bg-success/5",
  critical: "border-destructive/30 bg-destructive/5",
};

const InsurancePartnerPortal = () => {
  const location = useLocation();
  const isPartner = location.pathname.includes("partners");

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {isPartner ? "Partner Portal" : "Insurance Portal"}
          </h1>
          <p className="text-muted-foreground font-body mt-1">
            {isPartner ? "API management, bulk operations & analytics." : "Claims verification, risk checks & fraud monitoring."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {insuranceKpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-border/60">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
                </div>
                <p className="text-3xl font-display font-bold text-foreground">{kpi.value}</p>
                <p className="text-sm text-muted-foreground font-body mt-0.5">{kpi.label}</p>
                <p className="text-xs text-muted-foreground/70 font-body mt-2">{kpi.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {!isPartner && (
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="font-display text-lg">Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {claims.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.06 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-body font-medium text-foreground">{c.id}</p>
                          <p className="text-xs text-muted-foreground font-body">{c.vehicle} • {c.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-body font-semibold ${riskColors[c.risk]}`}>{c.risk}</span>
                        <Badge variant="outline" className={`font-body text-xs ${statusColors[c.status]}`}>{c.status}</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" /> Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {partnerAlerts.map((alert, i) => (
                  <motion.div
                    key={alert.title}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.08 }}
                    className={`p-4 rounded-xl border ${alertColors[alert.severity]}`}
                  >
                    <p className="font-body font-semibold text-foreground text-sm">{alert.title}</p>
                    <p className="text-xs text-muted-foreground font-body mt-1">{alert.desc}</p>
                    <p className="text-xs text-muted-foreground/60 font-body mt-2">{alert.time}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {isPartner && (
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="font-display text-lg">Bulk Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center bg-muted/20 hover:bg-muted/30 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-body font-medium text-foreground mb-1">Drag & drop CSV of plates/VINs</p>
                  <p className="text-sm text-muted-foreground font-body">or click to browse files</p>
                  <Button variant="outline" className="mt-4 font-body rounded-xl">Browse Files</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="font-display text-lg">API Token Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Key className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="font-body font-medium text-foreground">Production Token</p>
                      <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                        zv_prod_••••••••k4m2
                        <Copy className="h-3 w-3 cursor-pointer hover:text-foreground transition-colors" />
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="font-body text-xs rounded-lg text-destructive hover:text-destructive">Revoke</Button>
                </div>
                <Button className="font-body rounded-xl w-full"><Key className="mr-2 h-4 w-4" /> Create New Token</Button>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <h4 className="font-display font-semibold text-foreground mb-3">Usage Metrics</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "12,480", label: "Requests/mo" },
                      { value: "42ms", label: "Median Latency" },
                      { value: "0.02%", label: "Error Rate" },
                    ].map((m) => (
                      <div key={m.label} className="text-center p-4 bg-muted/30 rounded-xl">
                        <p className="text-xl font-display font-bold text-foreground">{m.value}</p>
                        <p className="text-xs text-muted-foreground font-body mt-1">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InsurancePartnerPortal;
