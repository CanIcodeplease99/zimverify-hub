import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, Eye, Clock, Flag, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const initialAlerts = [
  {
    id: "FRD-001", type: "Cloned Plates", plate: "HRE 4421 ZW",
    description: "Same plate detected on two different vehicles (Toyota Hilux & Nissan NP300) in different provinces within 24 hours.",
    severity: "critical", time: "12 min ago", status: "Active",
  },
  {
    id: "FRD-002", type: "Odometer Rollback", plate: "BYO 7789 ZW",
    description: "Service record shows 85,000 km but latest inspection logged 42,000 km. Possible rollback detected.",
    severity: "high", time: "1 hour ago", status: "Investigating",
  },
  {
    id: "FRD-003", type: "Title Washing", plate: "GWE 1102 ZW",
    description: "Vehicle previously marked as salvage in Bulawayo, re-registered as clean title in Harare.",
    severity: "high", time: "3 hours ago", status: "Active",
  },
  {
    id: "FRD-004", type: "VIN Tampering", plate: "MUT 3345 ZW",
    description: "Physical VIN inspection mismatch with database records. Secondary VIN stamp appears altered.",
    severity: "critical", time: "5 hours ago", status: "Escalated",
  },
  {
    id: "FRD-005", type: "Insurance Fraud", plate: "MSV 6678 ZW",
    description: "Three total-loss claims filed on same VIN across different insurers within 18 months.",
    severity: "medium", time: "1 day ago", status: "Resolved",
  },
];

const severityConfig: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
  high: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  medium: { color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
};

const statusConfig: Record<string, { color: string; icon: typeof ShieldAlert }> = {
  Active: { color: "text-destructive", icon: ShieldAlert },
  Investigating: { color: "text-warning", icon: Eye },
  Escalated: { color: "text-primary", icon: Flag },
  Resolved: { color: "text-success", icon: CheckCircle2 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface FraudDetectionPanelProps {
  compact?: boolean;
}

const FraudDetectionPanel = ({ compact = false }: FraudDetectionPanelProps) => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<typeof initialAlerts[0] | null>(null);
  const [escalateNote, setEscalateNote] = useState("");

  const displayAlerts = compact ? alerts.slice(0, 3) : alerts;

  const handleViewDetails = (alert: typeof initialAlerts[0]) => {
    setSelectedAlert(alert);
    setDetailOpen(true);
  };

  const handleEscalate = () => {
    if (!selectedAlert) return;
    setAlerts(prev => prev.map(a => a.id === selectedAlert.id ? { ...a, status: "Escalated" } : a));
    toast.success(`Alert ${selectedAlert.id} escalated`, { description: escalateNote || "Sent to senior investigator." });
    setEscalateNote("");
    setDetailOpen(false);
  };

  const handleResolve = () => {
    if (!selectedAlert) return;
    setAlerts(prev => prev.map(a => a.id === selectedAlert.id ? { ...a, status: "Resolved" } : a));
    toast.success(`Alert ${selectedAlert.id} resolved`);
    setDetailOpen(false);
  };

  return (
    <>
      <motion.div variants={itemVariants}>
        <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" /> Fraud Detection Alerts
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs font-body">
                {alerts.filter(a => a.status === "Active").length} Active
              </Badge>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs font-body">
                {alerts.filter(a => a.severity === "critical").length} Critical
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {displayAlerts.map((alert) => {
              const sev = severityConfig[alert.severity];
              const stat = statusConfig[alert.status];
              const StatusIcon = stat.icon;
              return (
                <motion.div
                  key={alert.id}
                  whileHover={{ x: 2 }}
                  className={`p-4 rounded-xl border ${sev.border} ${sev.bg} transition-all hover:shadow-md cursor-pointer`}
                  onClick={() => handleViewDetails(alert)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-body font-semibold text-foreground text-sm">{alert.type}</span>
                        <Badge variant="outline" className={`text-xs font-body ${sev.bg} ${sev.color} ${sev.border}`}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline" className={`text-xs font-body ${stat.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" /> {alert.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-body font-medium">{alert.plate} · {alert.id}</p>
                      <p className="text-xs text-muted-foreground/80 font-body mt-1.5 line-clamp-2">{alert.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground/60 font-body whitespace-nowrap flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {alert.time}
                    </span>
                  </div>
                  {!compact && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="text-xs font-body rounded-lg h-7 border-border/40" onClick={(e) => { e.stopPropagation(); handleViewDetails(alert); }}>
                        View Details
                      </Button>
                      {alert.status !== "Resolved" && alert.status !== "Escalated" && (
                        <Button size="sm" variant="outline" className="text-xs font-body rounded-lg h-7 border-border/40" onClick={(e) => { e.stopPropagation(); setSelectedAlert(alert); handleEscalate(); }}>
                          Escalate
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
            {compact && (
              <Button variant="ghost" className="w-full text-sm font-body text-primary" onClick={() => toast.info("Navigate to full fraud panel from Government Console")}>
                View all {alerts.length} alerts →
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">{selectedAlert?.type} — {selectedAlert?.id}</DialogTitle>
            <DialogDescription className="font-body">{selectedAlert?.plate}</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground font-body">{selectedAlert.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/20 border border-border/20">
                  <p className="text-xs text-muted-foreground font-body">Severity</p>
                  <Badge variant="outline" className={`text-xs font-body ${severityConfig[selectedAlert.severity].color}`}>{selectedAlert.severity}</Badge>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border/20">
                  <p className="text-xs text-muted-foreground font-body">Status</p>
                  <Badge variant="outline" className={`text-xs font-body ${statusConfig[selectedAlert.status].color}`}>{selectedAlert.status}</Badge>
                </div>
              </div>
              {selectedAlert.status !== "Resolved" && (
                <>
                  <div>
                    <Label className="font-body text-sm">Escalation Note</Label>
                    <Textarea placeholder="Add context..." value={escalateNote} onChange={(e) => setEscalateNote(e.target.value)} className="mt-1.5 rounded-xl border-border/60 min-h-[80px]" />
                  </div>
                  <div className="flex gap-2">
                    {selectedAlert.status !== "Escalated" && (
                      <Button className="flex-1 font-body rounded-xl" onClick={handleEscalate}>Escalate</Button>
                    )}
                    <Button variant="outline" className="flex-1 font-body rounded-xl" onClick={handleResolve}>Mark Resolved</Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FraudDetectionPanel;
