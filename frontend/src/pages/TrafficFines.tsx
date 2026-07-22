import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, CreditCard, FileText, AlertTriangle, CheckCircle2, Clock, Download, Scale } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { searchFinesByPlate, payFine, submitAppeal, getComplianceSummary } from "@/services/trafficService";
import ComplianceSummary from "@/components/ComplianceSummary";
import type { Fine } from "@/lib/database.types";

const fineStatusColors: Record<string, string> = {
  unpaid: "bg-warning/10 text-warning border-warning/20",
  paid: "bg-success/10 text-success border-success/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
  appealed: "bg-info/10 text-info border-info/20",
  waived: "bg-muted/20 text-muted-foreground border-border/20",
};

const containerV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemV = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const TrafficFines = () => {
  const [searchPlate, setSearchPlate] = useState("");
  const [fines, setFines] = useState<Fine[]>([]);
  const [searched, setSearched] = useState(false);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [appealDialogOpen, setAppealDialogOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  const [appealReason, setAppealReason] = useState("");
  const [appealEvidence, setAppealEvidence] = useState("");
  const [appealName, setAppealName] = useState("");
  const [appealEmail, setAppealEmail] = useState("");

  const handleSearch = () => {
    if (!searchPlate.trim()) { toast.error("Enter a plate number"); return; }
    const results = searchFinesByPlate(searchPlate);
    setFines(results);
    setSearched(true);
    if (results.length === 0) toast.info("No fines found for this plate");
  };

  const handlePay = () => {
    if (!selectedFine) return;
    const paid = payFine(selectedFine.id);
    if (paid) {
      toast.success("Payment successful", { description: `Ref: ${paid.payment_ref}` });
      setFines(searchFinesByPlate(searchPlate));
    }
    setPayDialogOpen(false);
  };

  const handleAppeal = () => {
    if (!selectedFine || !appealReason.trim() || !appealName.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    submitAppeal({ fine_id: selectedFine.id, plate: selectedFine.plate, appellant_name: appealName, appellant_email: appealEmail, reason: appealReason, evidence_text: appealEvidence });
    toast.success("Appeal submitted", { description: "You will be notified of the outcome." });
    setFines(searchFinesByPlate(searchPlate));
    setAppealDialogOpen(false);
    setAppealReason(""); setAppealEvidence(""); setAppealName(""); setAppealEmail("");
  };

  return (
    <>
      <motion.div variants={containerV} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
        <motion.div variants={itemV}>
          <h1 className="text-3xl font-display font-bold text-foreground">Traffic Fines & Compliance</h1>
          <p className="text-muted-foreground font-body mt-1">Check fines, make payments, and view your compliance status.</p>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemV}>
          <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label className="font-body text-sm">Vehicle Plate Number</Label>
                  <Input
                    placeholder="e.g. HRE 4421 ZW"
                    value={searchPlate}
                    onChange={e => setSearchPlate(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                    className="mt-1.5 h-12 rounded-xl border-border/60 bg-card/50 font-mono text-lg"
                    data-testid="fine-search-input"
                  />
                </div>
                <Button onClick={handleSearch} className="h-12 rounded-xl font-body px-6" data-testid="fine-search-btn">
                  <Search className="mr-2 h-4 w-4" /> Check Fines
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance Summary */}
        {searched && searchPlate && (
          <motion.div variants={itemV}>
            <ComplianceSummary plate={searchPlate} />
          </motion.div>
        )}

        {/* Fines List */}
        {searched && (
          <motion.div variants={itemV}>
            <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="font-display text-lg">Fines for {searchPlate}</CardTitle></CardHeader>
              <CardContent>
                {fines.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
                    <p className="font-display font-semibold text-foreground">No outstanding fines</p>
                    <p className="text-sm text-muted-foreground font-body">This vehicle has a clean record.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fines.map(fine => (
                      <div key={fine.id} className="p-4 rounded-xl border border-border/30 hover:bg-muted/10 transition-colors" data-testid={`fine-${fine.id}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-display font-semibold text-foreground">{fine.offence_type}</p>
                              <Badge variant="outline" className={`text-xs font-body ${fineStatusColors[fine.status]}`}>{fine.status}</Badge>
                              {fine.renewal_blocked && <Badge variant="outline" className="text-xs font-body bg-destructive/10 text-destructive border-destructive/20">Renewal Blocked</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground font-body">Fine: <strong>${fine.amount} {fine.currency}</strong> | Points: {fine.penalty_points} | Due: {new Date(fine.due_date).toLocaleDateString()}</p>
                            {fine.paid_at && <p className="text-xs text-success font-body mt-1">Paid {new Date(fine.paid_at).toLocaleDateString()} — Ref: {fine.payment_ref}</p>}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            {(fine.status === "unpaid" || fine.status === "overdue") && (
                              <>
                                <Button size="sm" onClick={() => { setSelectedFine(fine); setPayDialogOpen(true); }} className="font-body rounded-lg" data-testid={`pay-${fine.id}`}>
                                  <CreditCard className="h-3.5 w-3.5 mr-1" /> Pay
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => { setSelectedFine(fine); setAppealDialogOpen(true); }} className="font-body rounded-lg" data-testid={`appeal-${fine.id}`}>
                                  <Scale className="h-3.5 w-3.5 mr-1" /> Appeal
                                </Button>
                              </>
                            )}
                            {fine.status === "paid" && (
                              <Button size="sm" variant="outline" className="font-body rounded-lg" onClick={() => toast.success("Receipt downloaded (mock)")}>
                                <Download className="h-3.5 w-3.5 mr-1" /> Receipt
                              </Button>
                            )}
                            {fine.status === "appealed" && (
                              <Badge variant="outline" className="bg-info/10 text-info border-info/20 text-xs"><Clock className="h-3 w-3 mr-1" /> Under Review</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div variants={itemV}>
          <Card className="border-border/40 bg-card/70 backdrop-blur-sm bg-blue-50/50">
            <CardContent className="p-5">
              <h3 className="font-display font-semibold text-foreground mb-2">How it works</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground font-body">
                <li>Enter your vehicle plate number to check for any outstanding fines</li>
                <li>Pay fines instantly using digital payment methods</li>
                <li>Download official notices and payment receipts</li>
                <li>Submit an appeal if you believe a fine was issued in error</li>
                <li>Unpaid fines may block your vehicle registration renewal</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Pay Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Pay Fine</DialogTitle>
            <DialogDescription className="font-body">Confirm payment for this traffic fine</DialogDescription>
          </DialogHeader>
          {selectedFine && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/20 border border-border/20">
                <p className="font-body font-semibold">{selectedFine.offence_type}</p>
                <p className="text-sm text-muted-foreground font-body">Plate: {selectedFine.plate}</p>
                <p className="text-2xl font-display font-bold text-foreground mt-2">${selectedFine.amount} {selectedFine.currency}</p>
              </div>
              <p className="text-xs text-muted-foreground font-body">Payment will be processed instantly. A receipt will be available for download.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayDialogOpen(false)} className="font-body rounded-xl">Cancel</Button>
            <Button onClick={handlePay} className="font-body rounded-xl" data-testid="confirm-pay-btn">
              <CreditCard className="mr-2 h-4 w-4" /> Pay ${selectedFine?.amount}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Appeal Dialog */}
      <Dialog open={appealDialogOpen} onOpenChange={setAppealDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Submit Appeal</DialogTitle>
            <DialogDescription className="font-body">Dispute this fine — provide your reason and any supporting evidence</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label className="font-body text-sm">Your Full Name *</Label><Input value={appealName} onChange={e => setAppealName(e.target.value)} placeholder="Full legal name" className="mt-1.5 rounded-xl border-border/60" data-testid="appeal-name" /></div>
            <div><Label className="font-body text-sm">Email</Label><Input type="email" value={appealEmail} onChange={e => setAppealEmail(e.target.value)} placeholder="For notification of outcome" className="mt-1.5 rounded-xl border-border/60" /></div>
            <div><Label className="font-body text-sm">Reason for Appeal *</Label><Textarea value={appealReason} onChange={e => setAppealReason(e.target.value)} placeholder="Explain why this fine should be reviewed" className="mt-1.5 rounded-xl border-border/60 min-h-[80px]" data-testid="appeal-reason" /></div>
            <div><Label className="font-body text-sm">Supporting Evidence</Label><Textarea value={appealEvidence} onChange={e => setAppealEvidence(e.target.value)} placeholder="Describe any evidence (dashcam footage, witness statements, etc.)" className="mt-1.5 rounded-xl border-border/60 min-h-[60px]" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAppealDialogOpen(false)} className="font-body rounded-xl">Cancel</Button>
            <Button onClick={handleAppeal} className="font-body rounded-xl" data-testid="submit-appeal-btn">
              <Scale className="mr-2 h-4 w-4" /> Submit Appeal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrafficFines;
