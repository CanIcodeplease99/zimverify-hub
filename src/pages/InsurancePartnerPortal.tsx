import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";
import { FileUp, Key, BarChart3, Shield, AlertTriangle, CheckCircle, Activity, Zap } from "lucide-react";

const insuranceKpis = [
  { label: "Claims Linked", value: "342", icon: Shield },
  { label: "Risk Checks", value: "1,204", icon: Activity },
  { label: "API Status", value: "Online", icon: Zap },
  { label: "Bulk Uploads", value: "8", icon: FileUp },
];

const claims = [
  { id: "CLM-2026-001", status: "Verified", risk: "Low" },
  { id: "CLM-2026-002", status: "Review", risk: "Medium" },
  { id: "CLM-2026-003", status: "Hold", risk: "High" },
  { id: "CLM-2026-004", status: "Verified", risk: "Low" },
];

const partnerAlerts = [
  { title: "Claim mismatch — CLM-2026-002", desc: "VIN on claim does not match registration records.", time: "1 hour ago" },
  { title: "Claim cleared — CLM-2026-001", desc: "Vehicle verified, claim approved for processing.", time: "3 hours ago" },
  { title: "Suspected fraud — CLM-2026-003", desc: "Multiple claims on same VIN within 30 days.", time: "6 hours ago" },
];

const statusColors: Record<string, string> = {
  Verified: "bg-success/10 text-success border-success/20",
  Review: "bg-warning/10 text-warning border-warning/20",
  Hold: "bg-destructive/10 text-destructive border-destructive/20",
};

const riskColors: Record<string, string> = {
  Low: "text-success",
  Medium: "text-warning",
  High: "text-destructive",
};

const InsurancePartnerPortal = () => {
  const location = useLocation();
  const isPartner = location.pathname.includes("partners");

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          {isPartner ? "Partner Portal" : "Insurance Portal"}
        </h1>
        <p className="text-muted-foreground font-body mt-1">
          {isPartner ? "API management, bulk operations & analytics." : "Claims verification, risk checks & fraud monitoring."}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insuranceKpis.map((kpi, i) => (
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

      {!isPartner && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display text-lg">Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Claim ID</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                    <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-3 font-body font-medium text-foreground">{c.id}</td>
                      <td className="py-3">
                        <Badge variant="outline" className={`font-body text-xs ${statusColors[c.status]}`}>{c.status}</Badge>
                      </td>
                      <td className={`py-3 text-sm font-body font-semibold ${riskColors[c.risk]}`}>{c.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" /> Partner Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {partnerAlerts.map((alert) => (
                <div key={alert.title} className="p-3 rounded-lg border bg-muted/30">
                  <p className="font-body font-semibold text-foreground text-sm">{alert.title}</p>
                  <p className="text-xs text-muted-foreground font-body mt-1">{alert.desc}</p>
                  <p className="text-xs text-muted-foreground font-body mt-1">{alert.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {isPartner && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Bulk Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-xl p-10 text-center bg-muted/30">
                <FileUp className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-body text-muted-foreground">Drag & drop CSV of plates/VINs here</p>
                <Button variant="outline" className="mt-4 font-body">Browse Files</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">API Token Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                <div>
                  <p className="font-body font-medium text-foreground">Production Token</p>
                  <p className="text-xs text-muted-foreground font-body">zv_prod_••••••••k4m2</p>
                </div>
                <Button variant="outline" size="sm" className="font-body text-xs">Revoke</Button>
              </div>
              <Button className="font-body"><Key className="mr-2 h-4 w-4" /> Create New Token</Button>

              <div className="mt-6 pt-4 border-t">
                <h4 className="font-display font-semibold text-foreground mb-3">Usage Metrics</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-display font-bold text-foreground">12,480</p>
                    <p className="text-xs text-muted-foreground font-body">Requests/mo</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-display font-bold text-foreground">42ms</p>
                    <p className="text-xs text-muted-foreground font-body">Median Latency</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-display font-bold text-foreground">0.02%</p>
                    <p className="text-xs text-muted-foreground font-body">Error Rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InsurancePartnerPortal;
