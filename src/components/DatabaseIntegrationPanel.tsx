import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, CheckCircle2, Clock, AlertTriangle, RefreshCw, Link2, Globe, Server, Shield } from "lucide-react";

const databases = [
  {
    name: "Central Vehicle Registry (CVR)",
    type: "Primary Registry",
    status: "Connected",
    records: "4.2M vehicles",
    latency: "45ms",
    lastSync: "2 min ago",
    syncFrequency: "Real-time",
    description: "National vehicle registration records, ownership transfers, and title status.",
  },
  {
    name: "Zimbabwe Republic Police (ZRP)",
    type: "Law Enforcement",
    status: "Connected",
    records: "126K cases",
    latency: "62ms",
    lastSync: "5 min ago",
    syncFrequency: "Every 5 min",
    description: "Stolen vehicle markers, wanted vehicle alerts, and case records.",
  },
  {
    name: "ZINARA – Road Admin",
    type: "Licensing Authority",
    status: "Connected",
    records: "3.8M licences",
    latency: "38ms",
    lastSync: "3 min ago",
    syncFrequency: "Real-time",
    description: "Vehicle licence status, road tax records, and toll history.",
  },
  {
    name: "Insurance Council of Zimbabwe",
    type: "Insurance Registry",
    status: "Connected",
    records: "2.1M policies",
    latency: "55ms",
    lastSync: "8 min ago",
    syncFrequency: "Every 15 min",
    description: "Active insurance policies, claims history, and write-off records.",
  },
  {
    name: "INTERPOL – Stolen Motor Vehicle DB",
    type: "International",
    status: "Degraded",
    records: "7.8M global",
    latency: "180ms",
    lastSync: "1 hr ago",
    syncFrequency: "Hourly",
    description: "International stolen vehicle database cross-referencing for imports and border checks.",
  },
  {
    name: "VID – Vehicle Inspection Depots",
    type: "Inspections",
    status: "Connected",
    records: "890K inspections",
    latency: "72ms",
    lastSync: "10 min ago",
    syncFrequency: "Every 30 min",
    description: "Fitness certificates, roadworthiness inspections, and emissions testing results.",
  },
];

const statusConfig: Record<string, { color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  Connected: { color: "text-success", bg: "bg-success/10", border: "border-success/20", icon: CheckCircle2 },
  Degraded: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", icon: AlertTriangle },
  Offline: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", icon: Clock },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const DatabaseIntegrationPanel = () => {
  const connectedCount = databases.filter(d => d.status === "Connected").length;

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" /> National Database Integrations
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs font-body">
              {connectedCount}/{databases.length} Connected
            </Badge>
            <Button size="sm" variant="outline" className="text-xs font-body rounded-lg h-7 border-border/40">
              <RefreshCw className="h-3 w-3 mr-1" /> Sync All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {databases.map((db) => {
            const config = statusConfig[db.status];
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={db.name}
                whileHover={{ x: 2 }}
                className="p-4 rounded-xl border border-border/30 bg-muted/10 hover:bg-muted/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-body font-semibold text-foreground text-sm">{db.name}</span>
                      <Badge variant="outline" className={`text-xs font-body ${config.bg} ${config.color} ${config.border}`}>
                        <StatusIcon className="h-3 w-3 mr-1" /> {db.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs font-body bg-muted/30 text-muted-foreground border-border/20">
                        {db.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground/80 font-body mt-1">{db.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-body">
                      <span className="flex items-center gap-1"><Server className="h-3 w-3" /> {db.records}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {db.latency}</span>
                      <span className="flex items-center gap-1"><RefreshCw className="h-3 w-3" /> {db.syncFrequency}</span>
                      <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Last: {db.lastSync}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Link2 className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Shield className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Automated Licence Verification Status */}
          <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="font-body font-semibold text-foreground text-sm">Automated Licence Verification</span>
              <Badge className="bg-success text-success-foreground text-xs font-body">Active</Badge>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              Real-time licence status checks via ZINARA integration. Expired, suspended, and revoked licences are automatically flagged during vehicle searches. 
              Processing ~2,400 automated checks/day with 99.97% accuracy.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DatabaseIntegrationPanel;
