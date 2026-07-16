import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import type { Profile } from "@/lib/database.types";
import type { UserRole, PortalType } from "@/lib/rbac";
import { normalizeLegacyRole, ROLE_PORTAL_MAP, hasPermission, getDashboardRoute, getPortalLoginRoute } from "@/lib/rbac";
import type { Permission } from "@/lib/rbac";

export type { UserRole, PortalType, Permission } from "@/lib/rbac";

type AuthMode = "demo" | "supabase";

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole;
  userName: string;
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  authMode: AuthMode;
  loading: boolean;
  portal: PortalType;
  setAuthMode: (mode: AuthMode) => void;
  login: (role: UserRole) => void;
  loginWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  logout: () => void;
  can: (permission: Permission) => boolean;
}

const demoRoleNames: Record<UserRole, string> = {
  PUBLIC_USER: "John Moyo",
  POLICE_OFFICER: "Insp. T. Ncube",
  POLICE_SUPERVISOR: "Supt. R. Maphosa",
  CUSTOMS_OFFICER: "Officer R. Chigumira (ZIMRA)",
  ZINARA_OFFICER: "Officer P. Dlamini (ZINARA)",
  REGISTRY_OFFICER: "Officer L. Banda (Registry)",
  GOV_ADMIN: "Dir. S. Mutasa",
  INSURANCE_AGENT: "K. Zimuto",
  INSURANCE_MANAGER: "M. Chikwanha",
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: "PUBLIC_USER",
  userName: "",
  user: null,
  profile: null,
  session: null,
  authMode: "demo",
  loading: false,
  portal: "public",
  setAuthMode: () => {},
  login: () => {},
  loginWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null, needsConfirmation: false }),
  logout: () => {},
  can: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authMode, setAuthMode] = useState<AuthMode>(isSupabaseConfigured ? "supabase" : "demo");
  const [loading, setLoading] = useState(false);
  const [demoAuthenticated, setDemoAuthenticated] = useState(false);
  const [demoRole, setDemoRole] = useState<UserRole>("PUBLIC_USER");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (!error && data) setProfile(data as Profile);
  }, []);

  useEffect(() => {
    if (authMode !== "supabase" || !isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, [authMode, fetchProfile]);

  const login = (selectedRole: UserRole) => {
    setDemoRole(selectedRole);
    setDemoAuthenticated(true);
  };

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { error: error?.message ?? null };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string, role: UserRole) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) return { error: error.message, needsConfirmation: false };
    return { error: null, needsConfirmation: true };
  };

  const logout = () => {
    if (authMode === "demo") {
      setDemoAuthenticated(false);
      setDemoRole("PUBLIC_USER");
    } else {
      supabase.auth.signOut();
      setProfile(null);
    }
  };

  const isAuthenticated = authMode === "demo" ? demoAuthenticated : Boolean(session);

  const role: UserRole = authMode === "demo"
    ? demoRole
    : normalizeLegacyRole(profile?.role || "public");

  const userName = authMode === "demo"
    ? demoRoleNames[demoRole]
    : profile?.full_name || user?.email || "";

  const portal: PortalType = ROLE_PORTAL_MAP[role] || "public";

  const can = (permission: Permission) => hasPermission(role, permission);

  return (
    <AuthContext.Provider value={{
      isAuthenticated, role, userName, user, profile, session,
      authMode, loading, portal, setAuthMode, login, loginWithEmail,
      signUpWithEmail, logout, can,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
