import { useState } from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useRealtime } from "@/contexts/RealtimeContext";
import { supabase } from "@/lib/supabase";
import {
  SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, Search, ShieldCheck, Landmark, Building2, Handshake,
  LogOut, Bell, User, Shield, Settings, Mail, Lock, HelpCircle, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const roleNavItems: Record<UserRole, { title: string; url: string; icon: typeof LayoutDashboard }[]> = {
  public: [
    { title: "Dashboard", url: "/app/public", icon: LayoutDashboard },
    { title: "Vehicle Search", url: "/app/report", icon: Search },
  ],
  police: [
    { title: "Console", url: "/app/police", icon: ShieldCheck },
    { title: "Vehicle Search", url: "/app/report", icon: Search },
  ],
  government: [
    { title: "Console", url: "/app/government", icon: Landmark },
    { title: "Vehicle Search", url: "/app/report", icon: Search },
  ],
  insurance: [
    { title: "Portal", url: "/app/insurance", icon: Building2 },
    { title: "Vehicle Search", url: "/app/report", icon: Search },
  ],
  partner: [
    { title: "Portal", url: "/app/partners", icon: Handshake },
    { title: "Vehicle Search", url: "/app/report", icon: Search },
  ],
  customs: [
    { title: "Customs Console", url: "/app/customs", icon: ShieldCheck },
    { title: "Vehicle Search", url: "/app/report", icon: Search },
  ],
};

const roleBadgeLabels: Record<UserRole, string> = {
  public: "Public",
  police: "Police",
  government: "Government",
  insurance: "Insurance",
  partner: "Partner",
  customs: "Customs (ZIMRA)",
};

const roleBadgeColors: Record<UserRole, string> = {
  public: "bg-primary/10 text-primary border-primary/20",
  police: "bg-info/10 text-info border-info/20",
  government: "bg-accent/10 text-accent border-accent/20",
  insurance: "bg-success/10 text-success border-success/20",
  partner: "bg-warning/10 text-warning border-warning/20",
  customs: "bg-destructive/10 text-destructive border-destructive/20",
};

const severityColors: Record<string, string> = {
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  error: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
};

const AppLayout = () => {
  const { role, userName, logout, isAuthenticated, authMode, user, profile } = useAuth();
  const { notifications, unreadCount, markAllRead, markRead, isConnected } = useRealtime();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = roleNavItems[role];

  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/app/login" replace />;
  }

  const handleMarkAllRead = () => {
    markAllRead();
    toast.success("All notifications marked as read");
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved");
    setSettingsOpen(false);
  };

  return (
    <>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <Sidebar collapsible="icon" className="border-r-0">
            <SidebarContent className="pt-6">
              <div className="px-4 mb-8 flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
                <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
                </div>
                <span className="font-display font-bold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                  ZimVerify
                </span>
              </div>

              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.url}
                            end
                            className="hover:bg-sidebar-accent/50 rounded-lg transition-all"
                            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                          >
                            <item.icon className="h-5 w-5 mr-3 shrink-0" />
                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <div className="mt-auto p-4 space-y-1">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setSettingsOpen(true)}
                      className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg"
                    >
                      <Settings className="h-5 w-5 mr-3 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => { logout(); navigate("/app/login"); }}
                      className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg"
                    >
                      <LogOut className="h-5 w-5 mr-3 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            </SidebarContent>
          </Sidebar>

          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-16 border-b border-border/40 bg-card/50 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0 sticky top-0 z-30">
              <SidebarTrigger />
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search vehicles, cases..."
                  className="h-10 font-body text-sm rounded-xl border-border/40 bg-background/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                      navigate("/app/report");
                      toast.info("Searching...", { description: (e.target as HTMLInputElement).value });
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-3 ml-auto">
                {/* Realtime connection indicator */}
                {authMode === "supabase" && (
                  <div className="flex items-center gap-1.5" data-testid="realtime-status">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-success animate-pulse" : "bg-muted-foreground/30"}`} />
                    <span className="text-xs text-muted-foreground font-body hidden sm:inline">
                      {isConnected ? "Live" : "Offline"}
                    </span>
                  </div>
                )}

                {/* Notifications */}
                <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-lg" data-testid="notification-bell">
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-96 max-h-[400px] overflow-y-auto">
                    <div className="flex items-center justify-between px-3 py-2 sticky top-0 bg-popover z-10">
                      <p className="font-display font-semibold text-sm">Notifications</p>
                      {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="text-xs font-body text-primary h-auto py-0.5" onClick={handleMarkAllRead}>Mark all read</Button>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? (
                      <div className="px-3 py-6 text-center text-muted-foreground font-body text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <DropdownMenuItem
                          key={n.id}
                          className="flex-col items-start gap-0.5 cursor-pointer px-3 py-2.5"
                          onClick={() => markRead(n.id)}
                        >
                          <div className="flex items-center gap-2 w-full">
                            {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-body ${severityColors[n.severity] || ""}`}>
                              {n.type}
                            </span>
                            <span className={`font-body text-sm flex-1 ${!n.read ? "font-semibold" : ""}`}>{n.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground font-body pl-3.5">{n.desc}</span>
                          <span className="text-xs text-muted-foreground/60 font-body pl-3.5">{n.time}</span>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Badge variant="outline" className={`font-body text-xs rounded-lg ${roleBadgeColors[role]}`}>
                  {roleBadgeLabels[role]}
                </Badge>

                {/* Profile dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2.5 pl-2 border-l border-border/40 cursor-pointer hover:opacity-80 transition-opacity">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-body font-medium hidden sm:block text-foreground">{userName}</span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="font-display font-semibold text-sm">{userName}</p>
                      <p className="text-xs text-muted-foreground font-body">{roleBadgeLabels[role]} Account {authMode === "demo" ? "(Demo)" : ""}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("Help center", { description: "Visit docs.zimverify.gov.zw for guides." })} className="cursor-pointer">
                      <HelpCircle className="h-4 w-4 mr-2" /> Help & Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { logout(); navigate("/app/login"); }} className="cursor-pointer text-destructive">
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            <main className="flex-1 overflow-auto p-6 lg:p-8">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Account Settings</DialogTitle>
            <DialogDescription className="font-body">Manage your profile and preferences</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-display font-semibold text-sm text-foreground">Profile</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-body text-xs">Name</Label>
                  <Input defaultValue={userName} className="mt-1 rounded-xl border-border/60 text-sm" />
                </div>
                <div>
                  <Label className="font-body text-xs">Email</Label>
                  <Input defaultValue={authMode === "supabase" && user?.email ? user.email : "demo@zimverify.gov.zw"} className="mt-1 rounded-xl border-border/60 text-sm" readOnly={authMode === "supabase"} />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-border/30">
              <h4 className="font-display font-semibold text-sm text-foreground">Notifications</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body text-sm">Email notifications</span>
                </div>
                <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body text-sm">Push notifications</span>
                </div>
                <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-border/30">
              <h4 className="font-display font-semibold text-sm text-foreground">Security</h4>
              <Button variant="outline" className="font-body rounded-xl border-border/40 text-sm w-full justify-start" onClick={() => {
                if (authMode === "supabase") {
                  supabase.auth.resetPasswordForEmail(user?.email || "", {
                    redirectTo: `${window.location.origin}/auth/reset-password`,
                  }).then(({ error }) => {
                    if (error) toast.error("Failed to send reset email");
                    else toast.success("Password reset email sent", { description: "Check your inbox." });
                  });
                } else {
                  toast.info("Demo mode — no real password to reset");
                }
              }}>
                <Lock className="h-4 w-4 mr-2" /> Change Password
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)} className="font-body rounded-xl">Cancel</Button>
            <Button onClick={handleSaveSettings} className="font-body rounded-xl">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppLayout;
