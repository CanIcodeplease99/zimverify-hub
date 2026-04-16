import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, ShieldCheck, Clock, Users, Settings, Building2, TrendingUp, CheckCircle2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import DatabaseIntegrationPanel from "@/components/DatabaseIntegrationPanel";
import FraudDetectionPanel from "@/components/FraudDetectionPanel";

const uptimeData = [
  { day: "Mon", uptime: 99.98 },
  { day: "Tue", uptime: 99.95 },
  { day: "Wed", uptime: 100 },
  { day: "Thu", uptime: 99.99 },
  { day: "Fri", uptime: 99.92 },
  { day: "Sat", uptime: 100 },
  { day: "Sun", uptime: 99.97 },
];

const auditData = [
  { hour: "00:00", events: 120 },
  { hour: "04:00", events: 45 },
  { hour: "08:00", events: 380 },
  { hour: "12:00", events: 520 },
  { hour: "16:00", events: 610 },
  { hour: "20:00", events: 290 },
];

const uptimeConfig = {
  uptime: { label: "Uptime %", color: "hsl(var(--success))" },
};
const auditConfig = {
  events: { label: "Audit Events", color: "hsl(var(--primary))" },
};

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

const mockUsers = [
  { name: "Insp. T. Ncube", role: "Police", status: "Active", lastLogin: "2 hours ago" },
  { name: "K. Zimuto", role: "Insurance", status: "Active", lastLogin: "1 day ago" },
  { name: "M. Chikwanha", role: "Partner", status: "Active", lastLogin: "3 hours ago" },
  { name: "S. Mutasa", role: "Government", status: "Active", lastLogin: "Just now" },
  { name: "J. Moyo", role: "Public", status: "Suspended", lastLogin: "5 days ago" },
];

const GovernmentConsole = () => {
  const [userMgmtOpen, setUserMgmtOpen] = useState(false);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [instName, setInstName] = useState("");
  const [instType, setInstType] = useState("");

  // Settings state
  const [autoSync, setAutoSync] = useState(true);
  const [auditRetention, setAuditRetention] = useState("90");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleOnboard = () => {
    if (!instName.trim() || !instType) { toast.error("Please fill all fields."); return; }
    toast.success(`${instName} onboarded`, { description: `Added as ${instType} institution.` });
    setInstName("");
    setInstType("");
    setOnboardOpen(false);
  };

  const handleSaveConfig = () => {
    toast.success("System configuration saved", { description: `Audit retention: ${auditRetention} days, Auto-sync: ${autoSync ? "ON" : "OFF"}` });
    setConfigOpen(false);
  };

  return (
    <>
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

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg">System Uptime (7 days)</CardTitle></CardHeader>
              <CardContent>
                <ChartContainer config={uptimeConfig} className="h-[220px] w-full">
                  <AreaChart data={uptimeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="day" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis domain={[99.8, 100.1]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="uptime" stroke="hsl(var(--success))" fill="url(#uptimeGrad)" strokeWidth={2} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg">Audit Events Today</CardTitle></CardHeader>
              <CardContent>
                <ChartContainer config={auditConfig} className="h-[220px] w-full">
                  <BarChart data={auditData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="hour" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="events" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
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

        <DatabaseIntegrationPanel />
        <FraudDetectionPanel />

        <motion.div variants={itemVariants}>
          <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
            <CardHeader><CardTitle className="font-display text-lg">Administration</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button className="font-body rounded-xl shadow-sm shadow-primary/10" onClick={() => setUserMgmtOpen(true)}><Users className="mr-2 h-4 w-4" /> User & Role Management</Button>
              <Button variant="outline" className="font-body rounded-xl border-border/40" onClick={() => setOnboardOpen(true)}><Building2 className="mr-2 h-4 w-4" /> Institution Onboarding</Button>
              <Button variant="outline" className="font-body rounded-xl border-border/40" onClick={() => setConfigOpen(true)}><Settings className="mr-2 h-4 w-4" /> System Configuration</Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* User & Role Management Dialog */}
      <Dialog open={userMgmtOpen} onOpenChange={setUserMgmtOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">User & Role Management</DialogTitle>
            <DialogDescription className="font-body">Manage platform users and their access levels</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {mockUsers.map((u) => (
              <div key={u.name} className="p-4 rounded-xl border border-border/30 bg-muted/10 flex items-center justify-between">
                <div>
                  <p className="font-body font-medium text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground font-body">Last login: {u.lastLogin}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-body">{u.role}</Badge>
                  <Badge variant="outline" className={`text-xs font-body ${u.status === "Active" ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>{u.status}</Badge>
                  <Button size="sm" variant="ghost" className="text-xs font-body" onClick={() => {
                    toast.success(`${u.name} updated`, { description: u.status === "Active" ? "User suspended." : "User re-activated." });
                  }}>
                    {u.status === "Active" ? "Suspend" : "Activate"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Institution Onboarding Dialog */}
      <Dialog open={onboardOpen} onOpenChange={setOnboardOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Onboard Institution</DialogTitle>
            <DialogDescription className="font-body">Register a new institutional partner</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-body text-sm">Institution Name</Label>
              <Input value={instName} onChange={(e) => setInstName(e.target.value)} placeholder="e.g. National Insurance Corp" className="mt-1.5 rounded-xl border-border/60" />
            </div>
            <div>
              <Label className="font-body text-sm">Type</Label>
              <Select value={instType} onValueChange={setInstType}>
                <SelectTrigger className="mt-1.5 rounded-xl border-border/60"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Government">Government Agency</SelectItem>
                  <SelectItem value="Law Enforcement">Law Enforcement</SelectItem>
                  <SelectItem value="Insurance">Insurance Provider</SelectItem>
                  <SelectItem value="Commercial">Commercial Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOnboardOpen(false)} className="font-body rounded-xl">Cancel</Button>
            <Button onClick={handleOnboard} className="font-body rounded-xl">Onboard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* System Configuration Dialog */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">System Configuration</DialogTitle>
            <DialogDescription className="font-body">Platform-wide settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body font-medium text-foreground text-sm">Auto-Sync Databases</p>
                <p className="text-xs text-muted-foreground font-body">Automatically sync all connected databases</p>
              </div>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body font-medium text-foreground text-sm">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground font-body">Restrict access to admins only</p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>
            <div>
              <Label className="font-body text-sm">Audit Log Retention (days)</Label>
              <Input type="number" value={auditRetention} onChange={(e) => setAuditRetention(e.target.value)} className="mt-1.5 rounded-xl border-border/60" min="30" max="365" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigOpen(false)} className="font-body rounded-xl">Cancel</Button>
            <Button onClick={handleSaveConfig} className="font-body rounded-xl">Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GovernmentConsole;
