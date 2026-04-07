import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "public" | "police" | "government" | "insurance" | "partner";

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole;
  userName: string;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: "public",
  userName: "",
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>("public");

  const roleNames: Record<UserRole, string> = {
    public: "John Moyo",
    police: "Insp. T. Ncube",
    government: "Dir. S. Mutasa",
    insurance: "K. Zimuto",
    partner: "M. Chikwanha",
  };

  const login = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole("public");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, userName: roleNames[role], login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
