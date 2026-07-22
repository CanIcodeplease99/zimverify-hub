import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, ShieldX, Ban } from "lucide-react";
import { getComplianceSummary } from "@/services/trafficService";
import type { ComplianceSummary as CSType } from "@/lib/database.types";

const riskColors: Record<CSType["risk_level"], { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  normal: { bg: "bg-success/10", text: "text-success", icon: CheckCircle2 },
  elevated: { bg: "bg-warning/10", text: "text-warning", icon: AlertTriangle },
  repeated_offences: { bg: "bg-destructive/10", text: "text-destructive", icon: ShieldX },
  suspended: { bg: "bg-destructive/10", text: "text-destructive", icon: Ban },
};

const riskLabels: Record<CSType["risk_level"], string> = {
  normal: "Normal",
  elevated: "Elevated",
  repeated_offences: "Repeated Offences",
  suspended: "Suspended",
};

interface Props {
  plate: string;
  showLink?: boolean;
  onViewDetails?: () => void;
}

const ComplianceSummary = ({ plate, showLink, onViewDetails }: Props) => {
  const summary = getComplianceSummary(plate);
  const risk = riskColors[summary.risk_level];
  const RiskIcon = risk.icon;

  return (
    <Card className="border-border/40 bg-card/70" data-testid="compliance-summary">
      <CardContent className="p-4 space-y-2.5">
        <p className="font-display font-semibold text-sm text-foreground">Traffic Compliance</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-muted/20">
            <p className="text-xs text-muted-foreground font-body">Outstanding Fines</p>
            <p className={`font-display font-bold text-lg ${summary.outstanding_fines ? "text-destructive" : "text-success"}`}>
              {summary.outstanding_fines ? `${summary.fine_count}` : "None"}
            </p>
            {summary.total_owed > 0 && <p className="text-xs text-muted-foreground">${summary.total_owed} owed</p>}
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/20">
            <p className="text-xs text-muted-foreground font-body">Renewal Status</p>
            <Badge variant="outline" className={`mt-1 text-xs ${summary.renewal_status === "clear" ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
              {summary.renewal_status === "clear" ? "Clear" : "Blocked"}
            </Badge>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/20">
            <p className="text-xs text-muted-foreground font-body">Risk Level</p>
            <div className={`flex items-center justify-center gap-1 mt-1 px-2 py-0.5 rounded ${risk.bg}`}>
              <RiskIcon className={`h-3.5 w-3.5 ${risk.text}`} />
              <span className={`text-xs font-body font-semibold ${risk.text}`}>{riskLabels[summary.risk_level]}</span>
            </div>
          </div>
        </div>
        {summary.points > 0 && (
          <p className="text-xs text-muted-foreground font-body text-center">{summary.points} penalty points active</p>
        )}
        {showLink && onViewDetails && (
          <button onClick={onViewDetails} className="w-full text-xs text-primary font-body font-semibold hover:underline text-center pt-1" data-testid="view-compliance-details">
            View full compliance details
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceSummary;
