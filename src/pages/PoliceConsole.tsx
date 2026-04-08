import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Activity, AlertTriangle, Wifi, CheckCircle, ArrowUp, FileText } from "lucide-react";

const kpis = [
  { label: "Open Cases", value: "7", icon: ShieldAlert },
  { label: "Stops Today", value: "23", icon: Activity },
  { label: "Escalations", value: "2", icon: ArrowUp },
  { label: "Device Status", value: "Online", icon: Wifi },
];

const cases = [
  { plate: "HRE 4421 ZW", status: "Flagged", event: "Stolen marker active", actions: ["Escalate", "Hold"] },
  { plate: "BYO 7789 ZW", status: "Review", event: "Registry mismatch", actions: ["Escalate", "Hold"] },
  { plate: "GWE 1102 ZW", status: "Clear", event: "Routine check", actions: ["Release"] },
  { plate: "MUT 3345 ZW", status: "Flagged", event: "Licence expired 6mo+", actions: ["Escalate", "Hold"] },
  { plate: "MSV 6678 ZW", status: "Clear", event: "Routine check", actions: ["Release"] },
];

const alerts = [
  { title: "Stolen Marker — HRE 4421 ZW", desc: "Active stolen alert since 2026-01-15. Registered in Harare.", time: "2 hours ago" },
  { title: "Registry Mismatch — BYO 7789 ZW", desc: "VIN does not match CVR records. Manual review required.", time: "5 hours ago" },
];

const statusColors: Record<string, string> = {
  Clear: "bg-success/10 text-success border-success/20",
  Review: "bg-warning/10 text-warning border-warning/20",
  Flagged: "bg-destructive/10 text-destructive border-destructive/20",
};

const PoliceConsole = () => {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Police Console</h1>
        <p className="text-muted-foreground font-body mt-1">Field operations & investigations overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <kpi.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-display font-bold text-foreground">{kpi.value}</p>
                <p className="text-sm text-muted-foreground font-body">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cases Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-lg">Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Plate</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Last Event</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr key={c.plate} className="border-b last:border-0">
                      <td className="py-3 font-body font-medium text-foreground">{c.plate}</td>
                      <td className="py-3">
                        <Badge variant="outline" className={`font-body text-xs ${statusColors[c.status]}`}>{c.status}</Badge>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground font-body">{c.event}</td>
                      <td className="py-3 flex gap-2">
                        {c.actions.map((a) => (
                          <Button key={a} variant="ghost" size="sm" className="font-body text-xs">{a}</Button>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.title} className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                <p className="font-body font-semibold text-foreground text-sm">{alert.title}</p>
                <p className="text-xs text-muted-foreground font-body mt-1">{alert.desc}</p>
                <p className="text-xs text-muted-foreground font-body mt-2">{alert.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button className="font-body"><ArrowUp className="mr-2 h-4 w-4" /> Escalate Case</Button>
          <Button variant="outline" className="font-body"><FileText className="mr-2 h-4 w-4" /> Capture Roadside Note</Button>
          <Button variant="outline" className="font-body"><CheckCircle className="mr-2 h-4 w-4" /> Mark Resolved</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PoliceConsole;
