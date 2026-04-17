import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import type { UserRole, Profile } from "@/lib/database.types";

export type { UserRole } from "@/lib/database.types";

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
  setAuthMode: (mode: AuthMode) => void;
  login: (role: UserRole) => void;
  loginWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  logout: () => void;
}

const demoRoleNames: Record<UserRole, string> = {
  public: "John Moyo",
  police: "Insp. T. Ncube",
  government: "Dir. S. Mutasa",
  insurance: "K. Zimuto",
  partner: "M. Chikwanha",
  customs: "Officer R. Chigumira (ZIMRA)",
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: "public",
  userName: "",
  user: null,
  profile: null,
  session: null,
  authMode: "demo",
  loading: false,
  setAuthMode: () => {},
  login: () => {},
  loginWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null, needsConfirmation: false }),
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authMode, setAuthMode] = useState<AuthMode>(
    isSupabaseConfigured ? "supabase" : "demo"
  );
  const [loading, setLoading] = useState(false);

  // Demo state
  const [demoAuthenticated, setDemoAuthenticated] = useState(false);
  const [demoRole, setDemoRole] = useState<UserRole>("public");

  // Supabase state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setProfile(data as Profile);
    }
  }, []);

  useEffect(() => {
    if (authMode !== "supabase" || !isSupabaseConfigured) return;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          fetchProfile(s.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [authMode, fetchProfile]);

  // Demo login
  const login = (selectedRole: UserRole) => {
    setDemoRole(selectedRole);
    setDemoAuthenticated(true);
  };

  // Supabase email login
  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { error: error?.message ?? null };
  };

  // Supabase signup
  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) return { error: error.message, needsConfirmation: false };
    return { error: null, needsConfirmation: true };
  };

  // Logout
  const logout = () => {
    if (authMode === "demo") {
      setDemoAuthenticated(false);
      setDemoRole("public");
    } else {
      supabase.auth.signOut();
      setProfile(null);
    }
  };

  // Derived values based on auth mode
  const isAuthenticated =
    authMode === "demo" ? demoAuthenticated : Boolean(session);

  const role: UserRole =
    authMode === "demo"
      ? demoRole
      : (profile?.role as UserRole) ?? "public";

  const userName =
    authMode === "demo"
      ? demoRoleNames[demoRole]
      : profile?.full_name || user?.email || "";

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        userName,
        user,
        profile,
        session,
        authMode,
        loading,
        setAuthMode,
        login,
        loginWithEmail,
        signUpWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
