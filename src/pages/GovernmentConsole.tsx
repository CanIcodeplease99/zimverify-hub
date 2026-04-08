import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, ShieldCheck, Clock, Users, Settings, Building2, TrendingUp, Zap } from "lucide-react";

const kpis = [
  { label: "Agency Sync", value: "Healthy", icon: Database, trend: "All 4 agencies online", color: "text-success" },
  { label: "Audit Events", value: "14,218", icon: Activity, trend: "+342 today", color: "text-primary" },
  { label: "Uptime", value: "99.97%", icon: ShieldCheck, trend: "30-day rolling", color: "text-accent" },
  { label: "Review Queue", value: "5", icon: Clock, trend: "2 urgent", color: "text-warning" },
];

const integrations = [
  { institution: "Central Vehicle Registry", abbr: "CVR", status: "Healthy", latency: "45ms", lastSync: "2 min ago", records: "1.2M" },
  { institution: "Zimbabwe National Road Admin", abbr: "ZINARA", status: "Healthy", latency: "62ms", lastSync: "5 min ago", records: "890K" },
  { institution: "Zimbabwe Republic Police", abbr: "ZRP", status: "Review", latency: "180ms", lastSync: "1 hr ago", records: "340K" },
  { institution: "Insurance Council of Zimbabwe", abbr: "ICZ", status: "Healthy", latency: "38ms", lastSync: "3 min ago", records: "560K" },
];

const statusColors: Record<string, string> = {
  Healthy: "bg-success/10 text-success border-success/20",
  Review: "bg-warning/10 text-warning border-warning/20",
};

const GovernmentConsole = () => {
  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Government Console</h1>
          <p className="text-muted-foreground font-body mt-1">Governance, oversight & system health.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
          <Zap className="h-4 w-4 text-success" />
          <span className="text-sm font-body text-success font-medium">All systems operational</span>
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

      {/* Integrations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Institution Integrations</CardTitle>
            <Badge variant="secondary" className="font-body text-xs">4 connected</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {integrations.map((row, i) => (
                <motion.div
                  key={row.institution}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-display font-bold text-primary">{row.abbr}</span>
                    </div>
                    <div>
                      <p className="font-body font-medium text-foreground">{row.institution}</p>
                      <p className="text-xs text-muted-foreground font-body">{row.records} records • Last sync {row.lastSync}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-body text-muted-foreground">{row.latency}</span>
                    <Badge variant="outline" className={`font-body text-xs ${statusColors[row.status]}`}>{row.status}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Admin Tools */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-lg">Administration</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button className="font-body rounded-xl"><Users className="mr-2 h-4 w-4" /> User & Role Management</Button>
            <Button variant="outline" className="font-body rounded-xl hover:border-primary/40"><Building2 className="mr-2 h-4 w-4" /> Institution Onboarding</Button>
            <Button variant="outline" className="font-body rounded-xl hover:border-primary/40"><Settings className="mr-2 h-4 w-4" /> System Configuration</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default GovernmentConsole;
