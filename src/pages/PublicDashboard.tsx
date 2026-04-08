import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, FileText, AlertTriangle, Eye, Wallet, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

const kpis = [
  { label: "Recent Checks", value: "14", icon: ClipboardList },
  { label: "Wallet Balance", value: "$23.50", icon: Wallet },
  { label: "Risk Notices", value: "0", icon: AlertTriangle },
  { label: "Access Level", value: "Public", icon: Eye },
];

const recentSearches = [
  { plate: "ABC 1234 ZW", status: "Clear", date: "2026-04-07 10:15" },
  { plate: "HRE 9981 ZW", status: "Review", date: "2026-04-06 14:30" },
  { plate: "BYO 4456 ZW", status: "Clear", date: "2026-04-05 09:20" },
  { plate: "MUT 2278 ZW", status: "Flagged", date: "2026-04-04 16:45" },
  { plate: "GWE 8812 ZW", status: "Clear", date: "2026-04-03 11:00" },
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
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground font-body mt-1">Welcome back — your vehicle verification hub.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <kpi.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-display font-bold text-foreground">{kpi.value}</p>
                <p className="text-sm text-muted-foreground font-body">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/app/report")} className="font-body">
            <Search className="mr-2 h-4 w-4" /> Run Vehicle Check
          </Button>
          <Button variant="outline" className="font-body">
            <FileText className="mr-2 h-4 w-4" /> View Report
          </Button>
          <Button variant="outline" className="font-body">
            <Download className="mr-2 h-4 w-4" /> Download Receipt
          </Button>
          <Button variant="outline" className="font-body">
            <AlertTriangle className="mr-2 h-4 w-4" /> Report an Issue
          </Button>
        </CardContent>
      </Card>

      {/* Recent Searches */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Recent Searches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Plate / VIN</th>
                  <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                  <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Date / Time</th>
                  <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentSearches.map((search) => (
                  <tr key={search.plate} className="border-b last:border-0">
                    <td className="py-3 font-body font-medium text-foreground">{search.plate}</td>
                    <td className="py-3">
                      <Badge variant="outline" className={`font-body text-xs ${statusColors[search.status]}`}>
                        {search.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground font-body">{search.date}</td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" className="font-body text-xs" onClick={() => navigate("/app/report")}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicDashboard;
