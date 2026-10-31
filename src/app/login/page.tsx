"use client";

import React, { useState } from "react";
import { PennyMascot } from "@/components/mascot/PennyMascot";
import { NeoButton } from "@/components/ui/NeoButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRole, UserRole } from "@/context/RoleContext";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();
  const [selectedRole, setSelectedRole] = useState<UserRole>("ADMIN");
  const [email, setEmail] = useState("admin@brightloop.com");
  const [password, setPassword] = useState("Brightloop@2026");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let targetRole: UserRole = "ADMIN";
    let targetPath = "/";

    if (email.toLowerCase().includes("customer") || selectedRole === "CUSTOMER") {
      targetRole = "CUSTOMER";
      targetPath = "/portal";
    } else if (email.toLowerCase().includes("staff") || selectedRole === "STAFF") {
      targetRole = "STAFF";
      targetPath = "/staff";
    } else {
      targetRole = "ADMIN";
      targetPath = "/";
    }

    setRole(targetRole);

    setTimeout(() => {
      router.push(targetPath);
    }, 450);
  };

  const fillCredentials = (r: UserRole) => {
    setSelectedRole(r);
    if (r === "ADMIN") {
      setEmail("admin@brightloop.com");
      setPassword("Brightloop@2026");
    } else if (r === "STAFF") {
      setEmail("staff@brightloop.com");
      setPassword("Brightloop@2026");
    } else {
      setEmail("customer@acme.com");
      setPassword("Brightloop@2026");
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage(
      `Password reset token generated for '${forgotEmail}'! (In development mode, token URL has been logged to console).`
    );
  };

  return (
    <div className="min-h-screen bg-retro-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFF8EE] border-[3px] border-[#1D1E24] shadow-[6px_6px_0px_#1D1E24]">
        {/* Retro Header Strip */}
        <div className="bg-[#FFD600] px-4 py-2 border-b-[3px] border-[#1D1E24] flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#1D1E24] font-bold">
              lock
            </span>
            <span className="font-headline text-[13px] uppercase text-[#1D1E24] font-black tracking-wider">
              BRIGHTLOOP // ROLE-BASED AUTHENTICATION
            </span>
          </div>
          <span className="font-mono text-[10px] font-black bg-[#1D1E24] text-white px-2 py-0.5 border border-[#1D1E24]">
            RBAC 3.0
          </span>
        </div>

        {/* Mascot Greeting */}
        <div className="p-4 bg-[#FFE170]/50 border-b-2 border-[#1D1E24] flex items-center gap-3">
          <PennyMascot mood="dispatch" size="md" />
          <div>
            <span className="font-headline text-[9px] uppercase font-black bg-[#FFD600] px-1 py-0.2 border border-[#1D1E24]">
              PENNY SAYS:
            </span>
            <p className="text-[12px] font-bold text-[#1D1E24] mt-0.5">
              &ldquo;Pick your role below to experience completely isolated features tailored for that sign-in!&rdquo;
            </p>
          </div>
        </div>

        {/* 1-Click Role Switcher Buttons */}
        <div className="p-3 bg-[#FCE9D0] border-b-2 border-[#1D1E24]">
          <span className="font-headline text-[10px] uppercase font-black text-[#5B5D68] block mb-1.5">
            Select Role to Test Different Features:
          </span>
          <div className="grid grid-cols-3 gap-1.5 font-headline text-[10px] uppercase font-black">
            <button
              type="button"
              onClick={() => fillCredentials("ADMIN")}
              className={`py-1.5 transition-all border border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24] ${
                selectedRole === "ADMIN"
                  ? "bg-[#25F4D2] text-[#003D32] border-2 border-[#1D1E24] font-black"
                  : "bg-white text-[#1D1E24] hover:bg-[#25F4D2]/40"
              }`}
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("STAFF")}
              className={`py-1.5 transition-all border border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24] ${
                selectedRole === "STAFF"
                  ? "bg-[#FFD600] text-[#1D1E24] border-2 border-[#1D1E24] font-black"
                  : "bg-white text-[#1D1E24] hover:bg-[#FFE170]"
              }`}
            >
              Staff Rep
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("CUSTOMER")}
              className={`py-1.5 transition-all border border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24] ${
                selectedRole === "CUSTOMER"
                  ? "bg-[#FF4D6D] text-white border-2 border-[#1D1E24] font-black"
                  : "bg-white text-[#FF3355] hover:bg-[#FFA2B4]"
              }`}
            >
              Customer
            </button>
          </div>
          <div className="mt-2 text-[10.5px] font-mono text-[#1D1E24] bg-white p-1.5 border border-[#1D1E24]">
            {selectedRole === "ADMIN" && "👑 Admin: Master control (Catalog, Plans, Taxes, Staff Roster, Billing Runs)."}
            {selectedRole === "STAFF" && "💼 Staff: Sales & billing execution (+ Customer, + Quotation, Subscriptions)."}
            {selectedRole === "CUSTOMER" && "👤 Customer: Tenant-isolated portal (My Subscriptions, Invoices, Pay Balance)."}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[13px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-headline text-[11px] uppercase font-black text-[#1D1E24]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-[#006b5b] font-bold hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[13px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            />
          </div>

          <NeoButton variant="primary" size="lg" type="submit" disabled={loading}>
            {loading ? "Authenticating Session..." : `Sign In as ${selectedRole} ➔`}
          </NeoButton>

          <div className="pt-3 border-t-2 border-[#1D1E24] text-center text-[12px] font-bold text-[#606275]">
            New to Brightloop?{" "}
            <Link href="/register" className="text-[#006b5b] underline font-black">
              Register customer account
            </Link>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1E24]/60">
          <div className="w-full max-w-sm bg-[#FFF8EE] border-[3px] border-[#1D1E24] shadow-[6px_6px_0px_#1D1E24] p-4">
            <h3 className="font-headline text-[14px] uppercase font-black text-[#1D1E24] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">lock_reset</span>
              Password Reset Link
            </h3>
            <p className="text-[11px] text-[#5B5D68] mb-3">
              Enter your registered email to receive a secure time-limited reset link.
            </p>
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-2 bg-white border-2 border-[#1D1E24] text-[12px] font-bold"
              />
              {resetMessage && (
                <div className="p-2 bg-[#25F4D2]/40 border border-[#1D1E24] text-[11px] font-bold text-[#003D32]">
                  {resetMessage}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1 bg-[#FFF0DC] border border-[#1D1E24] text-[11px] font-black uppercase"
                >
                  Close
                </button>
                <NeoButton variant="secondary" size="sm" type="submit">
                  Send Reset Link
                </NeoButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
