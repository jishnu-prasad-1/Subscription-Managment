"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { role, switchWorkspace } = useRole();

  const isAdmin = role === "ADMIN";
  const isStaff = role === "STAFF";
  const isCustomer = role === "CUSTOMER";

  // Role-Specific Navigation Definitions
  const adminNavLinks = [
    { label: "Overview", path: "/", icon: "dashboard" },
    { label: "Products", path: "/products", icon: "inventory_2" },
    { label: "Plans", path: "/plans", icon: "layers" },
    { label: "Customers", path: "/customers", icon: "group" },
    { label: "Quotations", path: "/quotations", icon: "request_quote" },
    { label: "Subscriptions", path: "/subscriptions", icon: "autorenew" },
    { label: "Invoices", path: "/invoices", icon: "receipt_long" },
    { label: "Discounts", path: "/discounts", icon: "loyalty" },
    { label: "Payments", path: "/payments", icon: "payments" },
    { label: "Reports & Analytics", path: "/reports", icon: "analytics" },
  ];

  const staffNavLinks = [
    { label: "Staff Desk", path: "/staff", icon: "badge" },
    { label: "Quotations", path: "/quotations", icon: "request_quote" },
    { label: "Subscriptions", path: "/subscriptions", icon: "autorenew" },
    { label: "Customers", path: "/customers", icon: "group" },
    { label: "Invoices", path: "/invoices", icon: "receipt_long" },
    { label: "Payments", path: "/payments", icon: "payments" },
  ];

  const customerNavLinks = [
    { label: "My Subscriptions", path: "/portal", icon: "storefront" },
    { label: "My Invoices", path: "/portal", icon: "receipt_long" },
  ];

  const currentNavLinks = isCustomer
    ? customerNavLinks
    : isStaff
    ? staffNavLinks
    : adminNavLinks;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 xl:w-72 bg-[#FFF2DF] border-r-[3px] border-[#1D1E24] z-50 flex flex-col justify-between select-none shadow-[4px_0px_0px_#1D1E24]">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Bar */}
        <div className="p-3 border-b-[3px] border-[#1D1E24] bg-[#FFD600] flex items-center justify-between shadow-[0_2px_0px_#1D1E24]">
          <Link href={isCustomer ? "/portal" : isStaff ? "/staff" : "/"} className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-[#1D1E24] bg-white flex items-center justify-center p-0.5 shadow-[1.5px_1.5px_0px_#1D1E24]">
              {/* Retro Logo Mark */}
              <span className="font-headline font-black text-[16px] text-[#00BFA0]">B</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-[15px] uppercase text-[#1D1E24] font-black leading-none tracking-tight">
                Brightloop
              </span>
              <span className="font-headline text-[9px] text-[#1D1E24]/80 font-bold tracking-wider">
                SUB.SYS_v2.4
              </span>
            </div>
          </Link>
        </div>

        {/* Workspace Mode Switcher (Active RBAC Selector) */}
        <div className="p-2.5 border-b-[3px] border-[#1D1E24] bg-[#FCE9D0]">
          <div className="text-[9.5px] font-headline uppercase font-black text-[#1D1E24] tracking-wider mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#FF6B00] inline-block border border-[#1D1E24]"></span>
            Sign In Mode: <strong className="uppercase">{role}</strong>
          </div>
          <div className="grid grid-cols-3 gap-1.5 bg-[#FFF8EE] p-1 border-2 border-[#1D1E24]">
            <button
              type="button"
              onClick={() => switchWorkspace("ADMIN")}
              className={`py-1.5 font-headline text-[10.5px] text-center uppercase font-black transition-all block ${
                isAdmin
                  ? "bg-[#25F4D2] text-[#003D32] border-2 border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24]"
                  : "text-[#1D1E24] hover:bg-[#FFD600]"
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => switchWorkspace("STAFF")}
              className={`py-1.5 font-headline text-[10.5px] text-center uppercase font-black transition-all block ${
                isStaff
                  ? "bg-[#FFD600] text-[#1D1E24] border-2 border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24]"
                  : "text-[#1D1E24] hover:bg-[#FFD600]"
              }`}
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => switchWorkspace("CUSTOMER")}
              className={`py-1.5 font-headline text-[10.5px] text-center uppercase font-black transition-all block ${
                isCustomer
                  ? "bg-[#FF4D6D] text-white border-2 border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24]"
                  : "text-[#1D1E24] hover:bg-[#FFD600]"
              }`}
            >
              Portal
            </button>
          </div>
        </div>

        {/* Role-Specific Navigation Menu Links */}
        <nav className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-1.5 bg-[#FFF2DF]">
          {/* Section Label */}
          <div className="px-2 pt-1 text-[9px] font-headline uppercase font-black text-[#5B5D68] tracking-widest">
            {isCustomer ? "Customer Portal" : isStaff ? "Staff Operations Desk" : "Super Admin Control"}
          </div>

          {currentNavLinks.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.label}
                href={item.path}
                prefetch={true}
                className={`flex items-center gap-3 px-3.5 py-2 font-headline text-[12px] uppercase transition-all duration-75 ${
                  isActive
                    ? "bg-[#25F4D2] text-[#003D32] font-black border-[2.5px] border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24] translate-x-1"
                    : "text-[#1D1E24] font-bold hover:bg-[#FFF8EE] hover:border-2 hover:border-[#1D1E24] border-2 border-transparent active:translate-x-0.5 active:translate-y-0.5"
                }`}
              >
                <span className="material-symbols-outlined text-[19px]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Admin-Only Extra Navigation Items */}
          {isAdmin && (
            <>
              <div className="my-2 border-t-[2.5px] border-[#1D1E24] opacity-25"></div>

              <Link
                href="/staff"
                prefetch={true}
                className={`flex items-center justify-between px-3.5 py-2 font-headline text-[12px] uppercase transition-all duration-75 ${
                  pathname === "/staff"
                    ? "bg-[#FFD600] text-[#1D1E24] font-black border-[2.5px] border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24] translate-x-1"
                    : "text-[#1D1E24] font-bold hover:bg-[#FFF8EE] hover:border-2 hover:border-[#1D1E24] border-2 border-transparent active:translate-x-0.5 active:translate-y-0.5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[19px]">badge</span>
                  <span>Staff Mgmt</span>
                </div>
                <span className="px-1.5 py-0.5 bg-[#FFD600] text-[#1D1E24] border border-[#1D1E24] font-headline text-[9px] font-black shadow-[1px_1px_0px_#1D1E24]">
                  ADMIN
                </span>
              </Link>

              <Link
                href="/settings"
                prefetch={true}
                className={`flex items-center gap-3 px-3.5 py-2 font-headline text-[12px] uppercase transition-all duration-75 ${
                  pathname === "/settings"
                    ? "bg-[#25F4D2] text-[#003D32] font-black border-[2.5px] border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24] translate-x-1"
                    : "text-[#1D1E24] font-bold hover:bg-[#FFF8EE] hover:border-2 hover:border-[#1D1E24] border-2 border-transparent active:translate-x-0.5 active:translate-y-0.5"
                }`}
              >
                <span className="material-symbols-outlined text-[19px]">settings</span>
                <span>Settings &amp; SLA</span>
              </Link>
            </>
          )}

          {/* Customer Support Quick Link */}
          {isCustomer && (
            <div className="mt-auto p-3 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[2px_2px_0px_#1D1E24] text-[11px]">
              <div className="font-headline font-black text-[10px] uppercase text-[#FF4D6D] mb-1">
                Tenant Isolation: ACTIVE
              </div>
              <p className="text-[#606275] leading-tight">
                Acme Corp workspace isolated. Administrative tools are restricted to staff.
              </p>
            </div>
          )}
        </nav>

        {/* Footer System Status & Logout */}
        <div className="p-2 border-t-[3px] border-[#1D1E24] bg-[#FCE9D0] flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-2 py-1 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[2px_2px_0px_#1D1E24]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25F4D2] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00BFA0] border border-[#1D1E24]"></span>
              </span>
              <span className="font-headline text-[10px] text-[#1D1E24] font-black uppercase">
                {role} Mode
              </span>
            </div>
            <span className="font-headline text-[9px] text-[#1D1E24] font-black bg-[#FFD600] px-1 border border-[#1D1E24]">
              ONLINE
            </span>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 px-3 py-1 font-headline text-[11px] uppercase bg-[#FFF8EE] hover:bg-[#FF4D6D] hover:text-white text-[#1D1E24] font-black border-2 border-[#1D1E24] shadow-[2.5px_2.5px_0px_#1D1E24] active:translate-x-0.5 active:translate-y-0.5 transition-all duration-75"
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            <span>Switch / Sign Out</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
