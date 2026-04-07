import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Search,
  ShieldCheck,
  Landmark,
  Building2,
  Handshake,
  LogOut,
  Bell,
  User,
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
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon" className="border-r-0">
          <SidebarContent className="pt-6">
            <div className="px-4 mb-6 flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <ShieldCheck className="h-7 w-7 text-sidebar-primary shrink-0" />
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
                          className="hover:bg-sidebar-accent/50"
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
                    onClick={() => {
                      logout();
                      navigate("/app/login");
                    }}
                    className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
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
          <header className="h-14 border-b bg-card flex items-center px-4 gap-4 shrink-0">
            <SidebarTrigger />
            <div className="flex-1 max-w-md">
              <Input placeholder="Search vehicles, cases..." className="h-9 font-body text-sm" />
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
              </Button>
              <Badge variant="outline" className="font-body text-xs">{roleBadgeLabels[role]}</Badge>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-body font-medium hidden sm:block">{userName}</span>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
