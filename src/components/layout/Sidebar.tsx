"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const isPortal = pathname.startsWith("/portal");
  const isStaff = pathname.startsWith("/staff");
  const isAdmin = !isPortal && !isStaff;

  const navLinks = [
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

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 xl:w-72 bg-[#FFF2DF] border-r-[3px] border-[#1D1E24] z-50 flex flex-col justify-between select-none shadow-[4px_0px_0px_#1D1E24]">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Bar */}
        <div className="p-3 border-b-[3px] border-[#1D1E24] bg-[#FFD600] flex items-center justify-between shadow-[0_2px_0px_#1D1E24]">
          <Link href="/" className="flex items-center gap-2">
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

          {/* 90s OS Window Buttons */}
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 border-2 border-[#1D1E24] bg-[#FFF8EE] flex items-center justify-center font-headline text-[8px] font-bold shadow-[1px_1px_0px_#1D1E24]">
              _
            </div>
            <div className="w-3.5 h-3.5 border-2 border-[#1D1E24] bg-[#FFF8EE] flex items-center justify-center font-headline text-[8px] font-bold shadow-[1px_1px_0px_#1D1E24]">
              □
            </div>
            <div className="w-3.5 h-3.5 border-2 border-[#1D1E24] bg-[#FF4D6D] text-white flex items-center justify-center font-headline text-[8px] font-bold shadow-[1px_1px_0px_#1D1E24]">
              ×
            </div>
          </div>
        </div>

        {/* Workspace Mode Switcher (Fully functional, prefetched & dynamic) */}
        <div className="p-2 border-b-[3px] border-[#1D1E24] bg-[#FCE9D0]">
          <div className="text-[9px] font-headline uppercase font-black text-[#1D1E24] tracking-wider mb-1 flex items-center gap-1">
            <span className="w-2 h-2 bg-[#FF6B00] inline-block border border-[#1D1E24]"></span>
            Workspace Mode Switcher
          </div>
          <div className="grid grid-cols-3 gap-1 bg-[#FFF8EE] p-0.5 border-2 border-[#1D1E24]">
            <Link
              href="/"
              prefetch={true}
              className={`py-1 font-headline text-[10px] text-center uppercase font-black transition-all block ${
                isAdmin
                  ? "bg-[#25F4D2] text-[#003D32] border-2 border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24]"
                  : "text-[#1D1E24] hover:bg-[#FFD600]"
              }`}
            >
              Admin
            </Link>
            <Link
              href="/staff"
              prefetch={true}
              className={`py-1 font-headline text-[10px] text-center uppercase font-black transition-all block ${
                isStaff
                  ? "bg-[#FFD600] text-[#1D1E24] border-2 border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24]"
                  : "text-[#1D1E24] hover:bg-[#FFD600]"
              }`}
            >
              Staff
            </Link>
            <Link
              href="/portal"
              prefetch={true}
              className={`py-1 font-headline text-[10px] text-center uppercase font-black transition-all block ${
                isPortal
                  ? "bg-[#FF4D6D] text-white border-2 border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24]"
                  : "text-[#1D1E24] hover:bg-[#FFD600]"
              }`}
            >
              Portal
            </Link>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 bg-[#FFF2DF]">
          {navLinks.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                prefetch={true}
                className={`flex items-center gap-2.5 px-3 py-1.5 font-headline text-[12px] uppercase transition-all duration-75 ${
                  isActive
                    ? "bg-[#25F4D2] text-[#003D32] font-black border-[2.5px] border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24] translate-x-1"
                    : "text-[#1D1E24] font-bold hover:bg-[#FFF8EE] hover:border-2 hover:border-[#1D1E24] border-2 border-transparent active:translate-x-0.5 active:translate-y-0.5"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="my-1.5 border-t-[2.5px] border-[#1D1E24] opacity-25"></div>

          {/* Admin Protected Staff Management */}
          <Link
            href="/staff"
            prefetch={true}
            className={`flex items-center justify-between px-3 py-1.5 font-headline text-[12px] uppercase transition-all duration-75 ${
              pathname === "/staff"
                ? "bg-[#FFD600] text-[#1D1E24] font-black border-[2.5px] border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24] translate-x-1"
                : "text-[#1D1E24] font-bold hover:bg-[#FFF8EE] hover:border-2 hover:border-[#1D1E24] border-2 border-transparent active:translate-x-0.5 active:translate-y-0.5"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">badge</span>
              <span>Staff Mgmt</span>
            </div>
            <span className="px-1.5 py-0.2 bg-[#FFD600] text-[#1D1E24] border border-[#1D1E24] font-headline text-[9px] font-black shadow-[1px_1px_0px_#1D1E24]">
              STAFF
            </span>
          </Link>

          {/* Customer Self-Service Portal Navigation Link */}
          <Link
            href="/portal"
            prefetch={true}
            className={`flex items-center justify-between px-3 py-1.5 font-headline text-[12px] uppercase transition-all duration-75 ${
              pathname === "/portal"
                ? "bg-[#FF4D6D] text-white font-black border-[2.5px] border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24] translate-x-1"
                : "text-[#1D1E24] font-bold hover:bg-[#FFF8EE] hover:border-2 hover:border-[#1D1E24] border-2 border-transparent active:translate-x-0.5 active:translate-y-0.5"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span>Customer Portal</span>
            </div>
            <span className="px-1.5 py-0.2 bg-[#FF4D6D] text-white border border-[#1D1E24] font-headline text-[9px] font-black shadow-[1px_1px_0px_#1D1E24]">
              PORTAL
            </span>
          </Link>

          <Link
            href="/settings"
            prefetch={true}
            className={`flex items-center gap-2.5 px-3 py-1.5 font-headline text-[12px] uppercase transition-all duration-75 ${
              pathname === "/settings"
                ? "bg-[#25F4D2] text-[#003D32] font-black border-[2.5px] border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24] translate-x-1"
                : "text-[#1D1E24] font-bold hover:bg-[#FFF8EE] hover:border-2 hover:border-[#1D1E24] border-2 border-transparent active:translate-x-0.5 active:translate-y-0.5"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span>Settings &amp; SLA</span>
          </Link>
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
                v2.6 Online
              </span>
            </div>
            <span className="font-headline text-[9px] text-[#1D1E24] font-black bg-[#FFD600] px-1 border border-[#1D1E24]">
              99.98%
            </span>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 px-3 py-1 font-headline text-[11px] uppercase bg-[#FFF8EE] hover:bg-[#FF4D6D] hover:text-white text-[#1D1E24] font-black border-2 border-[#1D1E24] shadow-[2.5px_2.5px_0px_#1D1E24] active:translate-x-0.5 active:translate-y-0.5 transition-all duration-75"
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            <span>Log Out</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
