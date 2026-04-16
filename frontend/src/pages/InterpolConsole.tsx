import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Globe, AlertTriangle, Search, Shield, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

const kpis = [
  { label: "Global Alerts", value: "847", icon: Globe, trend: "Active stolen vehicles", color: "text-destructive" },
  { label: "Cross-Border Checks", value: "156", icon: MapPin, trend: "This month", color: "text-primary" },
  { label: "Verified Seizures", value: "23", icon: Shield, trend: "+5 this week", color: "text-success" },
  { label: "Pending Review", value: "7", icon: Clock, trend: "Awaiting confirmation", color: "text-warning" },
];

const flaggedVehicles = [
  { vin: "WBADT43452G123456", make: "BMW", model: "3 Series", status: "Stolen", country: "South Africa", flagDate: "2026-01-15", severity: "high" },
  { vin: "SALGS2EF8FA987654", make: "Land Rover", model: "Range Rover", status: "Stolen", country: "Kenya", flagDate: "2026-02-20", severity: "high" },
  { vin: "YV1CZ592451112233", make: "Volvo", model: "XC60", status: "Under Investigation", country: "Zambia", flagDate: "2026-03-10", severity: "medium" },
];

const severityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-info/10 text-info border-info/20",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const InterpolConsole = () => {
  const [searchVin, setSearchVin] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchVin.trim() || searchVin.length < 17) {
      toast.error("Please enter a valid 17-character VIN");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const flagged = flaggedVehicles.find(v => v.vin.includes(searchVin.toUpperCase().substring(0, 10)));
      
      if (flagged) {
        setSearchResult({ found: true, ...flagged });
        toast.error("⚠️ VEHICLE FLAGGED IN INTERPOL DATABASE", {
          description: `${flagged.make} ${flagged.model} - Status: ${flagged.status}`
        });
      } else {
        setSearchResult({ found: false });
        toast.success("✅ No Interpol flags found", {
          description: "Vehicle not found in stolen vehicle database"
        });
      }
      
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 max-w-6xl">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-display font-bold text-foreground">Interpol Console</h1>
          <p className="text-muted-foreground font-body mt-1">International vehicle tracking & cross-border verification.</p>
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
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">{kpi.value}</p>
                  <p className="text-sm text-muted-foreground font-body">{kpi.label}</p>
                  <p className="text-xs text-muted-foreground/60 font-body mt-1">{kpi.trend}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* VIN Search - TABLET OPTIMIZED */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-display text-lg">🔍 International VIN Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Enter 17-character VIN"
                  value={searchVin}
                  onChange={(e) => setSearchVin(e.target.value.toUpperCase())}
                  className="flex-1 h-14 text-lg rounded-xl border-border/60 font-mono"
                  maxLength={17}
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={loading}
                  className="h-14 px-8 font-body text-lg rounded-xl shadow-md shadow-primary/20"
                >
                  <Search className="mr-2 h-5 w-5" />
                  {loading ? "Checking..." : "Check Interpol DB"}
                </Button>
              </div>

              {searchResult && (
                <div className={`mt-6 p-6 rounded-xl border-2 ${searchResult.found ? 'border-destructive bg-destructive/5' : 'border-success bg-success/5'}`}>
                  {searchResult.found ? (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                        <div>
                          <h3 className="text-xl font-display font-bold text-destructive">VEHICLE FLAGGED</h3>
                          <p className="text-sm text-muted-foreground font-body">Found in Interpol stolen vehicle database</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground font-body">VIN</p>
                          <p className="font-mono font-bold text-foreground">{searchResult.vin}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground font-body">Vehicle</p>
                          <p className="font-body font-bold text-foreground">{searchResult.make} {searchResult.model}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground font-body">Status</p>
                          <Badge className="bg-destructive text-destructive-foreground">{searchResult.status}</Badge>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground font-body">Origin Country</p>
                          <p className="font-body font-bold text-foreground">{searchResult.country}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg col-span-2">
                          <p className="text-xs text-muted-foreground font-body">Flag Date</p>
                          <p className="font-body font-bold text-foreground">{searchResult.flagDate}</p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                        <p className="text-sm font-body text-destructive font-semibold">
                          🚨 IMMEDIATE ACTION REQUIRED: Detain vehicle, contact local law enforcement, and file cross-border seizure report.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Shield className="h-12 w-12 text-success mx-auto mb-3" />
                      <h3 className="text-xl font-display font-bold text-success">All Clear</h3>
                      <p className="text-muted-foreground font-body">Vehicle not found in Interpol stolen database</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Flagged Vehicles */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/40 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-display text-lg">🌍 Currently Flagged Vehicles (Regional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-border/40">
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">VIN</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Vehicle</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Status</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Country</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Flag Date</th>
                      <th className="pb-3 font-body font-semibold text-sm text-muted-foreground">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flaggedVehicles.map((vehicle) => (
                      <tr key={vehicle.vin} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 font-body font-mono text-sm text-foreground">{vehicle.vin}</td>
                        <td className="py-3.5 text-sm text-muted-foreground font-body">{vehicle.make} {vehicle.model}</td>
                        <td className="py-3.5">
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-body text-xs rounded-lg">{vehicle.status}</Badge>
                        </td>
                        <td className="py-3.5 text-sm text-muted-foreground font-body">{vehicle.country}</td>
                        <td className="py-3.5 text-sm text-muted-foreground font-body">{vehicle.flagDate}</td>
                        <td className="py-3.5">
                          <Badge variant="outline" className={`font-body text-xs rounded-lg ${severityColors[vehicle.severity]}`}>
                            {vehicle.severity}
                          </Badge>
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
          <Card className="border-border/40 bg-card/70 backdrop-blur-sm bg-blue-50/50">
            <CardContent className="p-6">
              <h3 className="font-display font-semibold text-lg text-foreground mb-3">🌍 Interpol Officer Guidelines</h3>
              <ul className="space-y-2 text-sm font-body text-muted-foreground">
                <li>✅ This system connects to the Interpol Stolen Motor Vehicle (SMV) database</li>
                <li>✅ Cross-border checks are logged for international cooperation</li>
                <li>✅ All flagged vehicles require immediate detention and local law enforcement notification</li>
                <li>✅ Data is shared with SADC member states for regional security</li>
                <li>✅ Verified seizures contribute to global vehicle crime statistics</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
};

export default InterpolConsole;
