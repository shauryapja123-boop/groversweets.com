import React, { createContext, useContext, useState } from "react";

interface User {
  id: string;
  role: "admin" | "manager" | "employee";
  email: string;
  name: string; // Added name property
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, additionalUsers?: User[]) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (identifier: string, password: string, additionalUsers: User[] = []) => {
    setIsLoading(true);

    // Demo users (with password for initial login)
    const demoUsers: User[] = [
      { id: "a1", role: "admin", email: "admin@groversweets.com", password: "admin123", name: "Rajesh Grover", employeeId: "GS-ADMIN-001", mobile: "9876543210", outletId: "o1" },
      { id: "m1", role: "manager", email: "manager1@groversweets.com", password: "manager123", name: "Vikram Singh", employeeId: "GS-MGR-001", mobile: "9876543211", outletId: "o1" },
      { id: "e1", role: "employee", email: "emp1@groversweets.com", password: "emp123", name: "Rahul Gupta", employeeId: "GS-EMP-001", mobile: "9876543220", outletId: "o1" },
    ];

    // Merge all users (demo + dynamic)
    const allUsers = [...demoUsers, ...additionalUsers];

    // Match identifier (email, employeeId, or mobile) and password
    const foundUser = allUsers.find(
      (u: any) =>
        (u.email === identifier || u.employeeId === identifier || u.mobile === identifier) &&
        u.password === password
    );

    setIsLoading(false);

    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Helper function for demo passwords
function getPasswordForRole(role: string) {
  switch (role) {
    case "admin":
      return "admin123";
    case "manager":
      return "manager123";
    case "employee":
      return "emp123";
    default:
      return "";
  }
}