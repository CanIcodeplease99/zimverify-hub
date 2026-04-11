import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Activity, AlertTriangle, Wifi, CheckCircle, ArrowUp, FileText, Clock, TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const caseTrends = [
  { week: "W1", opened: 5, resolved: 3 },
  { week: "W2", opened: 8, resolved: 6 },
  { week: "W3", opened: 4, resolved: 7 },
  { week: "W4", opened: 9, resolved: 5 },
  { week: "W5", opened: 6, resolved: 8 },
  { week: "W6", opened: 7, resolved: 7 },
];

const caseDistribution = [
  { name: "Stolen", value: 12, color: "hsl(var(--destructive))" },
  { name: "Mismatch", value: 8, color: "hsl(var(--warning))" },
  { name: "Expired", value: 15, color: "hsl(var(--accent))" },
  { name: "Routine", value: 45, color: "hsl(var(--primary))" },
];

const caseTrendConfig = {
  opened: { label: "Opened", color: "hsl(var(--destructive))" },
  resolved: { label: "Resolved", color: "hsl(var(--success))" },
};

const caseDistConfig = {
  value: { label: "Cases", color: "hsl(var(--primary))" },
};

const kpis = [
  { label: "Open Cases", value: "7", icon: ShieldAlert, trend: "+2 today", color: "text-destructive" },
  { label: "Stops Today", value: "23", icon: Activity, trend: "↑ 15% vs avg", color: "text-primary" },
  { label: "Escalations", value: "2", icon: ArrowUp, trend: "Pending review", color: "text-warning" },
  { label: "Device Status", value: "Online", icon: Wifi, trend: "All synced", color: "text-success" },
];

const cases = [
  { plate: "HRE 4421 ZW", status: "Flagged", event: "Stolen marker active", actions: ["Escalate", "Hold"] },
  { plate: "BYO 7789 ZW", status: "Review", event: "Registry mismatch", actions: ["Escalate", "Hold"] },
  { plate: "GWE 1102 ZW", status: "Clear", event: "Routine check", actions: ["Release"] },
  { plate: "MUT 3345 ZW", status: "Flagged", event: "Licence expired 6mo+", actions: ["Escalate", "Hold"] },
  { plate: "MSV 6678 ZW", status: "Clear", event: "Routine check", actions: ["Release"] },
];

const alerts = [
  { title: "Stolen Marker — HRE 4421 ZW", desc: "Active stolen alert since 2026-01-15. Registered in Harare.", time: "2 hours ago", severity: "high" },
  { title: "Registry Mismatch — BYO 7789 ZW", desc: "VIN does not match CVR records. Manual review required.", time: "5 hours ago", severity: "medium" },
];

const statusColors: Record<string, string> = {
  Clear: "bg-success/10 text-success border-success/20",
  Review: "bg-warning/10 text-warning border-warning/20",
  Flagged: "bg-destructive/10 text-destructive border-destructive/20",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PoliceConsole = () => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 max-w-6xl">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-display font-bold text-foreground">Police Console</h1>
        <p className="text-muted-foreground font-body mt-1">Field operations & investigations overview.</p>
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

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
            <CardHeader><CardTitle className="font-display text-lg">Case Trends (6 weeks)</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={caseTrendConfig} className="h-[220px] w-full">
                <LineChart data={caseTrends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="week" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="opened" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="resolved" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
            <CardHeader><CardTitle className="font-display text-lg">Case Distribution</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={caseDistConfig} className="h-[220px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie data={caseDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} strokeWidth={2} stroke="hsl(var(--card))">
                    {caseDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {caseDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                    {item.name} ({item.value})
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
            <CardHeader><CardTitle className="font-display text-lg">Cases</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-border/40">
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Plate</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Last Event</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((c) => (
                      <tr key={c.plate} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 font-body font-medium text-foreground">{c.plate}</td>
                        <td className="py-3.5">
                          <Badge variant="outline" className={`font-body text-xs rounded-lg ${statusColors[c.status]}`}>{c.status}</Badge>
                        </td>
                        <td className="py-3.5 text-sm text-muted-foreground font-body">{c.event}</td>
                        <td className="py-3.5 flex gap-2">
                          {c.actions.map((a) => (
                            <Button key={a} variant="ghost" size="sm" className="font-body text-xs hover:bg-primary/5 hover:text-primary">{a}</Button>
                          ))}
                        </td>
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
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" /> Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.title} className={`p-4 rounded-xl border ${alert.severity === 'high' ? 'border-destructive/20 bg-destructive/5' : 'border-warning/20 bg-warning/5'}`}>
                  <p className="font-body font-semibold text-foreground text-sm">{alert.title}</p>
                  <p className="text-xs text-muted-foreground font-body mt-1">{alert.desc}</p>
                  <p className="text-xs text-muted-foreground/60 font-body mt-2 flex items-center gap-1"><Clock className="h-3 w-3" /> {alert.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
          <CardHeader><CardTitle className="font-display text-lg">Quick Actions</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button className="font-body rounded-xl shadow-sm shadow-primary/10"><ArrowUp className="mr-2 h-4 w-4" /> Escalate Case</Button>
            <Button variant="outline" className="font-body rounded-xl border-border/40"><FileText className="mr-2 h-4 w-4" /> Capture Roadside Note</Button>
            <Button variant="outline" className="font-body rounded-xl border-border/40"><CheckCircle className="mr-2 h-4 w-4" /> Mark Resolved</Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PoliceConsole;
