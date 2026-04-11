import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, FileText, AlertTriangle, Eye, Wallet, ClipboardList, ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";

const checksOverTime = [
  { month: "Jan", checks: 8 },
  { month: "Feb", checks: 12 },
  { month: "Mar", checks: 6 },
  { month: "Apr", checks: 18 },
  { month: "May", checks: 14 },
  { month: "Jun", checks: 22 },
  { month: "Jul", checks: 14 },
];

const statusBreakdown = [
  { status: "Clear", count: 38 },
  { status: "Review", count: 7 },
  { status: "Flagged", count: 3 },
];

const checksChartConfig = {
  checks: { label: "Checks", color: "hsl(var(--primary))" },
};

const statusChartConfig = {
  count: { label: "Count", color: "hsl(var(--accent))" },
};

const kpis = [
  { label: "Recent Checks", value: "14", icon: ClipboardList, trend: "+3 this week", color: "text-primary" },
  { label: "Wallet Balance", value: "$23.50", icon: Wallet, trend: "Last topped up 2d ago", color: "text-accent" },
  { label: "Risk Notices", value: "0", icon: AlertTriangle, trend: "All clear", color: "text-success" },
  { label: "Access Level", value: "Public", icon: Eye, trend: "Standard tier", color: "text-info" },
];

const recentSearches = [
  { plate: "ABC 1234 ZW", status: "Clear", date: "2026-04-07 10:15", vehicle: "2024 Toyota Hilux" },
  { plate: "HRE 9981 ZW", status: "Review", date: "2026-04-06 14:30", vehicle: "2019 Honda Fit" },
  { plate: "BYO 4456 ZW", status: "Clear", date: "2026-04-05 09:20", vehicle: "2022 Ford Ranger" },
  { plate: "MUT 2278 ZW", status: "Flagged", date: "2026-04-04 16:45", vehicle: "2017 Nissan NP300" },
  { plate: "GWE 8812 ZW", status: "Clear", date: "2026-04-03 11:00", vehicle: "2023 Isuzu KB" },
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

const PublicDashboard = () => {
  const navigate = useNavigate();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 max-w-6xl">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground font-body mt-1">Welcome back — your vehicle verification hub.</p>
      </motion.div>

      {/* KPIs */}
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
            <CardHeader><CardTitle className="font-display text-lg">Checks Over Time</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={checksChartConfig} className="h-[220px] w-full">
                <AreaChart data={checksOverTime} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="checksGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="checks" stroke="hsl(var(--primary))" fill="url(#checksGrad)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
            <CardHeader><CardTitle className="font-display text-lg">Results Breakdown</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={statusChartConfig} className="h-[220px] w-full">
                <BarChart data={statusBreakdown} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="status" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
          <CardHeader><CardTitle className="font-display text-lg">Quick Actions</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/app/report")} className="font-body rounded-xl shadow-sm shadow-primary/10">
              <Search className="mr-2 h-4 w-4" /> Run Vehicle Check
            </Button>
            <Button variant="outline" className="font-body rounded-xl border-border/40 hover:bg-card">
              <FileText className="mr-2 h-4 w-4" /> View Report
            </Button>
            <Button variant="outline" className="font-body rounded-xl border-border/40 hover:bg-card">
              <Download className="mr-2 h-4 w-4" /> Download Receipt
            </Button>
            <Button variant="outline" className="font-body rounded-xl border-border/40 hover:bg-card">
              <AlertTriangle className="mr-2 h-4 w-4" /> Report an Issue
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Searches */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Recent Searches</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs font-body text-primary">
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border/40">
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Plate / VIN</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Vehicle</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Date / Time</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSearches.map((search) => (
                    <tr key={search.plate} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 font-body font-medium text-foreground">{search.plate}</td>
                      <td className="py-3.5 text-sm text-muted-foreground font-body">{search.vehicle}</td>
                      <td className="py-3.5">
                        <Badge variant="outline" className={`font-body text-xs rounded-lg ${statusColors[search.status]}`}>{search.status}</Badge>
                      </td>
                      <td className="py-3.5 text-sm text-muted-foreground font-body">{search.date}</td>
                      <td className="py-3.5">
                        <Button variant="ghost" size="sm" className="font-body text-xs text-primary hover:text-primary" onClick={() => navigate("/app/report")}>View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PublicDashboard;
