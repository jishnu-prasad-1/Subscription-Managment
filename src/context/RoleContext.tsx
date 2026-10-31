"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export type UserRole = "ADMIN" | "STAFF" | "CUSTOMER";

export interface UserPersona {
  role: UserRole;
  name: string;
  email: string;
  title: string;
  initials: string;
  themeColor: string;
  badgeBg: string;
  badgeText: string;
  rbacLevel: string;
  companyName?: string;
}

export const PERSONAS: Record<UserRole, UserPersona> = {
  ADMIN: {
    role: "ADMIN",
    name: "Samira Jenkins",
    email: "admin@brightloop.com",
    title: "Super Admin",
    initials: "SJ",
    themeColor: "#25F4D2",
    badgeBg: "bg-[#25F4D2]",
    badgeText: "text-[#003D32]",
    rbacLevel: "ALL_PERMISSIONS (Executive)",
  },
  STAFF: {
    role: "STAFF",
    name: "Liam Chen",
    email: "staff@brightloop.com",
    title: "Staff Specialist",
    initials: "LC",
    themeColor: "#FFD600",
    badgeBg: "bg-[#FFD600]",
    badgeText: "text-[#1D1E24]",
    rbacLevel: "STAFF_OPERATIONS (Sales & Operations)",
  },
  CUSTOMER: {
    role: "CUSTOMER",
    name: "David Vance",
    email: "customer@acme.com",
    title: "Acme Corp Customer",
    initials: "DV",
    themeColor: "#FF4D6D",
    badgeBg: "bg-[#FF4D6D]",
    badgeText: "text-white",
    rbacLevel: "CUSTOMER_PORTAL (Tenant Isolated)",
    companyName: "Acme Corporation",
  },
};

interface RoleContextType {
  role: UserRole;
  user: UserPersona;
  setRole: (role: UserRole) => void;
  switchWorkspace: (role: UserRole) => void;
  // Specific RBAC capability gates
  canAddCustomer: boolean;
  canCreateQuotation: boolean;
  canManagePlans: boolean;
  canManageProducts: boolean;
  canManageStaff: boolean;
  canRunBillingEngine: boolean;
  canViewReports: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEY = "brightloop_active_role";

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Determine initial role based on route or storage
  const [role, setRoleState] = useState<UserRole>("ADMIN");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Check localStorage first
    const saved = localStorage.getItem(STORAGE_KEY) as UserRole | null;
    if (saved && (saved === "ADMIN" || saved === "STAFF" || saved === "CUSTOMER")) {
      // If path strongly implies a mode, keep user in sync
      if (pathname.startsWith("/portal") && saved !== "CUSTOMER") {
        setRoleState("CUSTOMER");
        localStorage.setItem(STORAGE_KEY, "CUSTOMER");
      } else if (pathname.startsWith("/staff") && saved !== "STAFF" && saved !== "ADMIN") {
        setRoleState("STAFF");
        localStorage.setItem(STORAGE_KEY, "STAFF");
      } else {
        setRoleState(saved);
      }
    } else {
      // Fallback by pathname
      if (pathname.startsWith("/portal")) {
        setRoleState("CUSTOMER");
        localStorage.setItem(STORAGE_KEY, "CUSTOMER");
      } else if (pathname.startsWith("/staff")) {
        setRoleState("STAFF");
        localStorage.setItem(STORAGE_KEY, "STAFF");
      } else {
        setRoleState("ADMIN");
        localStorage.setItem(STORAGE_KEY, "ADMIN");
      }
    }
    setMounted(true);
  }, [pathname]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newRole);
      // Dispatch a storage event for cross-component sync
      window.dispatchEvent(new Event("role-change"));
    }
  };

  const switchWorkspace = (targetRole: UserRole) => {
    setRole(targetRole);
    if (targetRole === "ADMIN") {
      router.push("/");
    } else if (targetRole === "STAFF") {
      router.push("/staff");
    } else if (targetRole === "CUSTOMER") {
      router.push("/portal");
    }
  };

  const user = PERSONAS[role];

  // RBAC permissions matrix
  const canAddCustomer = role === "ADMIN" || role === "STAFF";
  const canCreateQuotation = role === "ADMIN" || role === "STAFF";
  const canManagePlans = role === "ADMIN";
  const canManageProducts = role === "ADMIN";
  const canManageStaff = role === "ADMIN";
  const canRunBillingEngine = role === "ADMIN";
  const canViewReports = role === "ADMIN";

  return (
    <RoleContext.Provider
      value={{
        role,
        user,
        setRole,
        switchWorkspace,
        canAddCustomer,
        canCreateQuotation,
        canManagePlans,
        canManageProducts,
        canManageStaff,
        canRunBillingEngine,
        canViewReports,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (!context) {
    // Default safe fallback if outside provider
    const defaultUser = PERSONAS.ADMIN;
    return {
      role: "ADMIN",
      user: defaultUser,
      setRole: () => {},
      switchWorkspace: () => {},
      canAddCustomer: true,
      canCreateQuotation: true,
      canManagePlans: true,
      canManageProducts: true,
      canManageStaff: true,
      canRunBillingEngine: true,
      canViewReports: true,
    };
  }
  return context;
}
