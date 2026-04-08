import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, FileText, AlertTriangle, Eye, Wallet, ClipboardList, ArrowUpRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const kpis = [
  { label: "Recent Checks", value: "14", icon: ClipboardList, trend: "+3 this week", color: "text-primary" },
  { label: "Wallet Balance", value: "$23.50", icon: Wallet, trend: "Last topped up 2d ago", color: "text-accent" },
  { label: "Risk Notices", value: "0", icon: AlertTriangle, trend: "All clear", color: "text-success" },
  { label: "Access Level", value: "Public", icon: Eye, trend: "Standard tier", color: "text-primary" },
];

const recentSearches = [
  { plate: "ABC 1234 ZW", status: "Clear", date: "2026-04-07 10:15", vehicle: "2024 Toyota Hilux" },
  { plate: "HRE 9981 ZW", status: "Review", date: "2026-04-06 14:30", vehicle: "2019 Honda Fit" },
  { plate: "BYO 4456 ZW", status: "Clear", date: "2026-04-05 09:20", vehicle: "2022 Ford Ranger" },
  { plate: "MUT 2278 ZW", status: "Flagged", date: "2026-04-04 16:45", vehicle: "2018 Nissan NP300" },
  { plate: "GWE 8812 ZW", status: "Clear", date: "2026-04-03 11:00", vehicle: "2023 Toyota Fortuner" },
];

const statusColors: Record<string, string> = {
  Clear: "bg-success/10 text-success border-success/20",
  Review: "bg-warning/10 text-warning border-warning/20",
  Flagged: "bg-destructive/10 text-destructive border-destructive/20",
};

const PublicDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground font-body mt-1">Welcome back — your vehicle verification hub.</p>
        </div>
        <Button onClick={() => navigate("/app/report")} className="font-body rounded-xl shadow-lg shadow-primary/15">
          <Search className="mr-2 h-4 w-4" /> New Vehicle Check
        </Button>
      </div>

      {/* KPIs — gradient cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-border/60">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <TrendingUp className="h-4 w-4 text-success/60" />
                </div>
                <p className="text-3xl font-display font-bold text-foreground">{kpi.value}</p>
                <p className="text-sm text-muted-foreground font-body mt-0.5">{kpi.label}</p>
                <p className="text-xs text-muted-foreground/70 font-body mt-2">{kpi.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/app/report")} className="font-body rounded-xl">
              <Search className="mr-2 h-4 w-4" /> Run Vehicle Check
            </Button>
            <Button variant="outline" className="font-body rounded-xl hover:border-primary/40">
              <FileText className="mr-2 h-4 w-4" /> View Report
            </Button>
            <Button variant="outline" className="font-body rounded-xl hover:border-primary/40">
              <Download className="mr-2 h-4 w-4" /> Download Receipt
            </Button>
            <Button variant="outline" className="font-body rounded-xl hover:border-primary/40">
              <AlertTriangle className="mr-2 h-4 w-4" /> Report an Issue
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Searches */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Recent Searches</CardTitle>
            <Button variant="ghost" size="sm" className="font-body text-xs text-primary">
              View All <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border/60">
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Plate / VIN</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Vehicle</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Date / Time</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSearches.map((search, i) => (
                    <motion.tr
                      key={search.plate}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.05 }}
                      className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3.5 font-body font-semibold text-foreground">{search.plate}</td>
                      <td className="py-3.5 text-sm text-muted-foreground font-body">{search.vehicle}</td>
                      <td className="py-3.5">
                        <Badge variant="outline" className={`font-body text-xs ${statusColors[search.status]}`}>{search.status}</Badge>
                      </td>
                      <td className="py-3.5 text-sm text-muted-foreground font-body">{search.date}</td>
                      <td className="py-3.5">
                        <Button variant="ghost" size="sm" className="font-body text-xs text-primary hover:text-primary/80" onClick={() => navigate("/app/report")}>
                          View Report
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PublicDashboard;
