import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, Search, ShieldCheck, Landmark, Building2, Handshake,
  LogOut, Bell, User, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
};

const roleBadgeLabels: Record<UserRole, string> = {
  public: "Public",
  police: "Police",
  government: "Government",
  insurance: "Insurance",
  partner: "Partner",
};

const roleBadgeColors: Record<UserRole, string> = {
  public: "bg-primary/10 text-primary border-primary/20",
  police: "bg-info/10 text-info border-info/20",
  government: "bg-accent/10 text-accent border-accent/20",
  insurance: "bg-success/10 text-success border-success/20",
  partner: "bg-warning/10 text-warning border-warning/20",
};

const AppLayout = () => {
  const { role, userName, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = roleNavItems[role];

  if (!isAuthenticated) {
    navigate("/app/login");
    return null;
  }

  return (
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

            <div className="mt-auto p-4">
              <SidebarMenu>
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
          {/* Top bar */}
          <header className="h-16 border-b border-border/40 bg-card/50 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0 sticky top-0 z-30">
            <SidebarTrigger />
            <div className="flex-1 max-w-md">
              <Input placeholder="Search vehicles, cases..." className="h-10 font-body text-sm rounded-xl border-border/40 bg-background/50" />
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <Button variant="ghost" size="icon" className="relative rounded-lg">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
              </Button>
              <Badge variant="outline" className={`font-body text-xs rounded-lg ${roleBadgeColors[role]}`}>
                {roleBadgeLabels[role]}
              </Badge>
              <div className="flex items-center gap-2.5 pl-2 border-l border-border/40">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-body font-medium hidden sm:block text-foreground">{userName}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
