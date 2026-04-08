import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Activity, AlertTriangle, Wifi, CheckCircle, ArrowUp, FileText, TrendingUp, Radio } from "lucide-react";

const kpis = [
  { label: "Open Cases", value: "7", icon: ShieldAlert, trend: "+2 today", color: "text-destructive" },
  { label: "Stops Today", value: "23", icon: Activity, trend: "↑ 15% vs yesterday", color: "text-primary" },
  { label: "Escalations", value: "2", icon: ArrowUp, trend: "Pending review", color: "text-warning" },
  { label: "Device Status", value: "Online", icon: Wifi, trend: "All synced", color: "text-success" },
];

const cases = [
  { plate: "HRE 4421 ZW", status: "Flagged", event: "Stolen marker active", vehicle: "2020 Toyota Corolla", actions: ["Escalate", "Hold"] },
  { plate: "BYO 7789 ZW", status: "Review", event: "Registry mismatch", vehicle: "2019 Nissan NP200", actions: ["Escalate", "Hold"] },
  { plate: "GWE 1102 ZW", status: "Clear", event: "Routine check", vehicle: "2023 Ford Everest", actions: ["Release"] },
  { plate: "MUT 3345 ZW", status: "Flagged", event: "Licence expired 6mo+", vehicle: "2017 Isuzu KB", actions: ["Escalate", "Hold"] },
  { plate: "MSV 6678 ZW", status: "Clear", event: "Routine check", vehicle: "2024 Toyota Hilux", actions: ["Release"] },
];

const alerts = [
  { title: "Stolen Marker — HRE 4421 ZW", desc: "Active stolen alert since 2026-01-15. Registered in Harare. Last seen Borrowdale.", time: "2 hours ago", severity: "critical" },
  { title: "Registry Mismatch — BYO 7789 ZW", desc: "VIN does not match CVR records. Manual review required.", time: "5 hours ago", severity: "warning" },
  { title: "Licence Expiry — MUT 3345 ZW", desc: "Vehicle licence expired over 6 months. Owner notified twice.", time: "1 day ago", severity: "warning" },
];

const statusColors: Record<string, string> = {
  Clear: "bg-success/10 text-success border-success/20",
  Review: "bg-warning/10 text-warning border-warning/20",
  Flagged: "bg-destructive/10 text-destructive border-destructive/20",
};

const PoliceConsole = () => {
  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Police Console</h1>
          <p className="text-muted-foreground font-body mt-1">Field operations & investigations overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-success animate-pulse" />
          <span className="text-sm font-body text-success font-medium">Connected to dispatch</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => (
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cases Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-display text-lg">Active Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-border/60">
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Plate</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Vehicle</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Last Event</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((c, i) => (
                      <motion.tr
                        key={c.plate}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.05 }}
                        className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3.5 font-body font-semibold text-foreground">{c.plate}</td>
                        <td className="py-3.5 text-sm text-muted-foreground font-body">{c.vehicle}</td>
                        <td className="py-3.5">
                          <Badge variant="outline" className={`font-body text-xs ${statusColors[c.status]}`}>{c.status}</Badge>
                        </td>
                        <td className="py-3.5 text-sm text-muted-foreground font-body">{c.event}</td>
                        <td className="py-3.5 flex gap-2">
                          {c.actions.map((a) => (
                            <Button key={a} variant={a === "Escalate" ? "default" : "ghost"} size="sm" className="font-body text-xs rounded-lg">{a}</Button>
                          ))}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" /> Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert, i) => (
                <motion.div
                  key={alert.title}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.08 }}
                  className={`p-4 rounded-xl border ${
                    alert.severity === "critical"
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-warning/30 bg-warning/5"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${alert.severity === "critical" ? "bg-destructive animate-pulse" : "bg-warning"}`} />
                    <div>
                      <p className="font-body font-semibold text-foreground text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground font-body mt-1">{alert.desc}</p>
                      <p className="text-xs text-muted-foreground/60 font-body mt-2">{alert.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button className="font-body rounded-xl"><ArrowUp className="mr-2 h-4 w-4" /> Escalate Case</Button>
            <Button variant="outline" className="font-body rounded-xl hover:border-primary/40"><FileText className="mr-2 h-4 w-4" /> Capture Roadside Note</Button>
            <Button variant="outline" className="font-body rounded-xl hover:border-primary/40"><CheckCircle className="mr-2 h-4 w-4" /> Mark Resolved</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PoliceConsole;
