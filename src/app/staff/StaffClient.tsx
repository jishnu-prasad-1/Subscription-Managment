"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WindowCard } from "@/components/ui/WindowCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { PennyMascot } from "@/components/mascot/PennyMascot";
import { useRole } from "@/context/RoleContext";

interface StaffRow {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface StaffClientProps {
  initialStaff: StaffRow[];
}

export const StaffClient: React.FC<StaffClientProps> = ({ initialStaff }) => {
  const { role, user, switchWorkspace, canManageStaff } = useRole();
  const [staffList, setStaffList] = useState<StaffRow[]>(initialStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [staffRole, setStaffRole] = useState("STAFF");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff: StaffRow = {
      id: `staff-${Date.now()}`,
      name,
      email,
      role: staffRole,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setStaffList([newStaff, ...staffList]);
    setIsModalOpen(false);
    showToast(`Added internal team member '${name}' as ${staffRole}!`);
  };

  const toggleStaffStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    showToast("Updated staff account status!");
  };

  // 1. Customer Boundary Check
  if (role === "CUSTOMER") {
    return (
      <div className="p-8 bg-white border-[3px] border-[#1D1E24] shadow-[6px_6px_0px_#1D1E24] text-center max-w-2xl mx-auto my-12 animate-in zoom-in-95">
        <div className="w-16 h-16 bg-[#FF4D6D] text-white border-2 border-[#1D1E24] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#1D1E24]">
          <span className="material-symbols-outlined text-[36px]">badge</span>
        </div>
        <h2 className="font-headline text-[22px] font-black uppercase text-[#1D1E24] mb-2">
          Access Restricted: Customer Tenant Boundary
        </h2>
        <p className="text-[13px] text-[#606275] font-semibold mb-6 leading-relaxed">
          You are currently signed in as <strong>Customer (David Vance - Acme Corp)</strong>. Internal staff directories, operations queues, and administrative rosters are restricted to internal Brightloop personnel.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/portal">
            <NeoButton variant="primary" size="md" icon="storefront">
              Return to My Customer Portal ➔
            </NeoButton>
          </Link>
          <button
            type="button"
            onClick={() => switchWorkspace("STAFF")}
            className="px-4 py-2 bg-[#FFD600] border-2 border-[#1D1E24] font-headline text-[12px] font-black uppercase shadow-[2px_2px_0px_#1D1E24] hover:bg-[#FFE04D]"
          >
            Switch to Staff View
          </button>
        </div>
      </div>
    );
  }

  // 2. Staff View vs Admin View
  const isStaffRole = role === "STAFF";

  return (
    <div className="flex flex-col gap-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFD600] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] px-4 py-2 font-headline text-[12px] font-black uppercase animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-[#1D1E24] p-5 sm:p-6 shadow-[4px_4px_0px_#1D1E24]">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 bg-[#FFD600] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24] shrink-0">
            <span className="material-symbols-outlined text-[32px] text-[#1D1E24] font-black">
              badge
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-[22px] uppercase font-black text-[#1D1E24]">
                {isStaffRole ? "Staff Operations & Execution Desk" : "Staff Account Management & RBAC"}
              </h1>
              <span className={`font-headline text-[10px] px-2 py-0.5 font-black border border-[#1D1E24] ${
                isStaffRole ? "bg-[#FFD600] text-[#1D1E24]" : "bg-[#25F4D2] text-[#003D32]"
              }`}>
                {isStaffRole ? "STAFF_ACTIVE" : "ADMIN_ONLY"}
              </span>
            </div>
            <p className="text-[13px] text-[#606275] font-semibold mt-0.5">
              {isStaffRole
                ? `Welcome back, ${user.name}! Track customer proposals, register new subscribers, and handle billing inquiries.`
                : "Manage internal operations coordinators, sales reps & RBAC privileges"}
            </p>
          </div>
        </div>

        {canManageStaff ? (
          <NeoButton
            variant="secondary"
            size="md"
            icon="person_add"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Staff Member
          </NeoButton>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/quotations">
              <NeoButton variant="primary" size="sm" icon="add">
                + Quotation
              </NeoButton>
            </Link>
            <Link href="/customers">
              <NeoButton variant="secondary" size="sm" icon="person_add">
                + Customer
              </NeoButton>
            </Link>
          </div>
        )}
      </section>

      {/* Staff Operational Quick Desk (Shown for Staff Specialists) */}
      {isStaffRole && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] p-4 shadow-[4px_4px_0px_#1D1E24] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-headline text-[11px] font-black uppercase text-[#006b5b]">
                  Commercial Pipeline
                </span>
                <span className="px-1.5 py-0.2 bg-[#25F4D2] text-[#003D32] border border-[#1D1E24] font-headline text-[9px] font-black">
                  ACTIVE
                </span>
              </div>
              <h3 className="font-headline text-[18px] font-black text-[#1D1E24] mb-1">
                Sales Proposals
              </h3>
              <p className="text-[12px] text-[#606275]">
                Draft custom quotations with preset discount templates and 1-click subscription conversion.
              </p>
            </div>
            <Link href="/quotations" className="mt-4">
              <NeoButton variant="primary" size="sm" icon="arrow_forward" className="w-full">
                Go to Quotations
              </NeoButton>
            </Link>
          </div>

          <div className="bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] p-4 shadow-[4px_4px_0px_#1D1E24] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-headline text-[11px] font-black uppercase text-[#FF5C00]">
                  Client Registry
                </span>
                <span className="px-1.5 py-0.2 bg-[#FFD600] text-[#1D1E24] border border-[#1D1E24] font-headline text-[9px] font-black">
                  CRM
                </span>
              </div>
              <h3 className="font-headline text-[18px] font-black text-[#1D1E24] mb-1">
                Customer Onboarding
              </h3>
              <p className="text-[12px] text-[#606275]">
                Register new client commercial accounts, configure GST/Tax IDs, and assign billing terms.
              </p>
            </div>
            <Link href="/customers" className="mt-4">
              <NeoButton variant="secondary" size="sm" icon="person_add" className="w-full">
                Register New Customer
              </NeoButton>
            </Link>
          </div>

          <div className="bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] p-4 shadow-[4px_4px_0px_#1D1E24] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-headline text-[11px] font-black uppercase text-[#008F7A]">
                  Collections
                </span>
                <span className="px-1.5 py-0.2 bg-[#00E5C9] text-[#1D1E24] border border-[#1D1E24] font-headline text-[9px] font-black">
                  INVOICING
                </span>
              </div>
              <h3 className="font-headline text-[18px] font-black text-[#1D1E24] mb-1">
                Invoices &amp; Payments
              </h3>
              <p className="text-[12px] text-[#606275]">
                Review unpaid subscriber invoices, record offline bank payments, and email receipts.
              </p>
            </div>
            <Link href="/invoices" className="mt-4">
              <NeoButton variant="ghost" size="sm" icon="receipt_long" className="w-full">
                Review Invoices
              </NeoButton>
            </Link>
          </div>
        </div>
      )}

      {/* Staff Roster Table */}
      <div className="bg-white border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] overflow-x-auto">
        <div className="p-3 bg-[#FFF0DC] border-b-2 border-[#1D1E24] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#1D1E24]">groups</span>
            <span className="font-headline text-[12px] uppercase font-black text-[#1D1E24]">
              Internal Team Directory ({staffList.length} Members)
            </span>
          </div>
          {!canManageStaff && (
            <span className="text-[10px] font-headline font-bold uppercase text-[#606275]">
              (Read-Only Colleague Directory)
            </span>
          )}
        </div>
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#FFF8EE] border-b-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black text-[#1D1E24]">
              <th className="px-4 py-3">Staff Member</th>
              <th className="px-4 py-3">Email Address</th>
              <th className="px-4 py-3">Role Tier</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined Date</th>
              {canManageStaff && <th className="px-4 py-3 text-center">Admin Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#1D1E24]">
            {staffList.map((s) => (
              <tr key={s.id} className="hover:bg-[#25F4D2]/15 transition-colors">
                <td className="px-4 py-3.5 font-headline font-black text-[#1D1E24] flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#FFF0DC] border border-[#1D1E24] flex items-center justify-center font-bold text-[10px]">
                    {s.name.slice(0, 2).toUpperCase()}
                  </div>
                  {s.name}
                  {s.email === user.email && (
                    <span className="text-[9px] px-1 bg-[#FFD600] text-[#1D1E24] border border-[#1D1E24] font-bold">
                      YOU
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-[11px] text-[#34363F]">{s.email}</td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-block px-2 py-0.5 text-[9px] font-headline uppercase font-black border border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24] ${
                      s.role === "ADMIN" ? "bg-[#FFD600] text-[#1D1E24]" : "bg-[#25F4D2] text-[#003D32]"
                    }`}
                  >
                    {s.role}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={s.isActive ? "text-[#006b5b] font-bold" : "text-[#FF4D6D] font-bold"}>
                    {s.isActive ? "● Active" : "● Deactivated"}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-headline font-bold text-[11px]">
                  {formatDate(s.createdAt)}
                </td>
                {canManageStaff && (
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => toggleStaffStatus(s.id)}
                      className="px-2 py-0.5 bg-[#FFF8EE] border border-[#1D1E24] font-headline text-[9px] uppercase font-black shadow-[1px_1px_0px_#1D1E24] hover:bg-[#FFD600]"
                    >
                      {s.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Add Staff (Admin Only) */}
      {canManageStaff && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Invite Internal Staff Member"
          icon="badge"
        >
          <form onSubmit={handleCreateStaff} className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-2.5 bg-[#FFF0DC] border-2 border-[#1D1E24]">
              <PennyMascot mood="dispatch" size="sm" />
              <p className="text-[11px] font-bold text-[#1D1E24]">
                Staff accounts receive operational privileges to draft quotes, onboard customers, and manage invoices.
              </p>
            </div>

            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Liam Chen"
                className="w-full p-2 bg-white border-2 border-[#1D1E24] text-[12px] font-bold"
              />
            </div>

            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Work Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@brightloop.com"
                className="w-full p-2 bg-white border-2 border-[#1D1E24] text-[12px] font-bold"
              />
            </div>

            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                RBAC Role Tier *
              </label>
              <select
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] text-[12px] font-bold"
              >
                <option value="STAFF">STAFF (Sales &amp; Billing Specialist)</option>
                <option value="ADMIN">ADMIN (Super Administrator)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t-2 border-[#1D1E24]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 bg-[#FFF0DC] border-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black shadow-[2px_2px_0px_#1D1E24]"
              >
                Cancel
              </button>
              <NeoButton variant="primary" size="md" type="submit">
                Create Staff Account ➔
              </NeoButton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
