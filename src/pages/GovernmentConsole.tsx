import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, ShieldCheck, Clock, Users, Settings, Building2 } from "lucide-react";

const kpis = [
  { label: "Agency Sync", value: "Healthy", icon: Database },
  { label: "Audit Events", value: "14,218", icon: Activity },
  { label: "Uptime", value: "99.97%", icon: ShieldCheck },
  { label: "Review Queue", value: "5", icon: Clock },
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

const GovernmentConsole = () => {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Government Console</h1>
        <p className="text-muted-foreground font-body mt-1">Governance, oversight & system health.</p>
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

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Institution Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Institution</th>
                  <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                  <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Latency</th>
                  <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Last Sync</th>
                </tr>
              </thead>
              <tbody>
                {integrations.map((row) => (
                  <tr key={row.institution} className="border-b last:border-0">
                    <td className="py-3 font-body font-medium text-foreground">{row.institution}</td>
                    <td className="py-3">
                      <Badge variant="outline" className={`font-body text-xs ${statusColors[row.status]}`}>{row.status}</Badge>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground font-body">{row.latency}</td>
                    <td className="py-3 text-sm text-muted-foreground font-body">{row.lastSync}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Admin Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Administration</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button className="font-body"><Users className="mr-2 h-4 w-4" /> User & Role Management</Button>
          <Button variant="outline" className="font-body"><Building2 className="mr-2 h-4 w-4" /> Institution Onboarding</Button>
          <Button variant="outline" className="font-body"><Settings className="mr-2 h-4 w-4" /> System Configuration</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GovernmentConsole;
