import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, ShieldCheck, Clock, Users, Settings, Building2, TrendingUp, CheckCircle2 } from "lucide-react";

const kpis = [
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

const statusColors: Record<string, string> = {
  Healthy: "bg-success/10 text-success border-success/20",
  Review: "bg-warning/10 text-warning border-warning/20",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const GovernmentConsole = () => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 max-w-6xl">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-display font-bold text-foreground">Government Console</h1>
        <p className="text-muted-foreground font-body mt-1">Governance, oversight & system health.</p>
      </motion.div>

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
          <CardHeader><CardTitle className="font-display text-lg">Institution Integrations</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border/40">
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Institution</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Latency</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Last Sync</th>
                  </tr>
                </thead>
                <tbody>
                  {integrations.map((row) => (
                    <tr key={row.institution} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 font-body font-medium text-foreground flex items-center gap-2">
                        {row.status === "Healthy" && <CheckCircle2 className="h-4 w-4 text-success shrink-0" />}
                        {row.status === "Review" && <Clock className="h-4 w-4 text-warning shrink-0" />}
                        {row.institution}
                      </td>
                      <td className="py-3.5">
                        <Badge variant="outline" className={`font-body text-xs rounded-lg ${statusColors[row.status]}`}>{row.status}</Badge>
                      </td>
                      <td className="py-3.5 text-sm text-muted-foreground font-body">{row.latency}</td>
                      <td className="py-3.5 text-sm text-muted-foreground font-body">{row.lastSync}</td>
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
          <CardHeader><CardTitle className="font-display text-lg">Administration</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button className="font-body rounded-xl shadow-sm shadow-primary/10"><Users className="mr-2 h-4 w-4" /> User & Role Management</Button>
            <Button variant="outline" className="font-body rounded-xl border-border/40"><Building2 className="mr-2 h-4 w-4" /> Institution Onboarding</Button>
            <Button variant="outline" className="font-body rounded-xl border-border/40"><Settings className="mr-2 h-4 w-4" /> System Configuration</Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default GovernmentConsole;
