"use client";

import React, { useState } from "react";
import { WindowCard } from "@/components/ui/WindowCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { PennyMascot } from "@/components/mascot/PennyMascot";

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
  const [staffList, setStaffList] = useState<StaffRow[]>(initialStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STAFF");

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
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setStaffList([newStaff, ...staffList]);
    setIsModalOpen(false);
    showToast(`Added internal team member '${name}' as ${role}!`);
  };

  const toggleStaffStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    showToast("Updated staff account status!");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFD600] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] px-4 py-2 font-headline text-[12px] font-black uppercase animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-[#1D1E24] p-4 shadow-[4px_4px_0px_#1D1E24]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFD600] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24]">
            <span className="material-symbols-outlined text-[28px] text-[#1D1E24] font-black">
              badge
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-[20px] uppercase font-black text-[#1D1E24]">
                Staff Account Management
              </h1>
              <span className="font-headline text-[10px] px-2 py-0.5 bg-[#FFD600] text-[#1D1E24] font-black border border-[#1D1E24]">
                ADMIN_ONLY
              </span>
            </div>
            <p className="text-[12px] text-[#606275] font-semibold">
              Manage internal operations coordinators, sales reps &amp; RBAC privileges
            </p>
          </div>
        </div>

        <NeoButton
          variant="secondary"
          size="md"
          icon="person_add"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Staff Member
        </NeoButton>
      </section>

      {/* Staff Table */}
      <div className="bg-white border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] overflow-x-auto">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#FFF0DC] border-b-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black text-[#1D1E24]">
              <th className="p-3">Staff Member</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">Role Tier</th>
              <th className="p-3">Status</th>
              <th className="p-3">Joined Date</th>
              <th className="p-3 text-center">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#1D1E24]">
            {staffList.map((s) => (
              <tr key={s.id} className="hover:bg-[#25F4D2]/15 transition-colors">
                <td className="p-3 font-headline font-black text-[#1D1E24]">{s.name}</td>
                <td className="p-3 text-[11px] text-[#34363F]">{s.email}</td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-[9px] font-headline uppercase font-black border border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24] ${
                      s.role === "ADMIN" ? "bg-[#FFD600] text-[#1D1E24]" : "bg-[#25F4D2] text-[#003D32]"
                    }`}
                  >
                    {s.role}
                  </span>
                </td>
                <td className="p-3">
                  <span className={s.isActive ? "text-[#006b5b] font-bold" : "text-[#FF4D6D] font-bold"}>
                    {s.isActive ? "● Active" : "● Deactivated"}
                  </span>
                </td>
                <td className="p-3 font-headline font-bold text-[11px]">
                  {formatDate(s.createdAt)}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => toggleStaffStatus(s.id)}
                    className="px-2 py-0.5 bg-[#FFF8EE] border border-[#1D1E24] font-headline text-[9px] uppercase font-black shadow-[1px_1px_0px_#1D1E24] hover:bg-[#FFD600]"
                  >
                    {s.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Add Staff */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Invite Internal Staff Member"
        icon="badge"
      >
        <form onSubmit={handleCreateStaff} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2.5 bg-[#FFF0DC] border-2 border-[#1D1E24]">
            <PennyMascot mood="dispatch" size="sm" />
            <p className="text-[12px] font-bold text-[#1D1E24]">
              &ldquo;Only Admins can authorize new staff members to access the operations hub!&rdquo;
            </p>
          </div>

          <div>
            <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jordan Hayes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
              Work Email
            </label>
            <input
              type="email"
              required
              placeholder="jordan@brightloop.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
              Assigned Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            >
              <option value="STAFF">Staff (Daily Operations, Quotes &amp; Invoices)</option>
              <option value="ADMIN">Super Admin (Full System Control)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-[#1D1E24]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-[#FFF8EE] border-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black shadow-[2px_2px_0px_#1D1E24]"
            >
              Cancel
            </button>
            <NeoButton variant="secondary" size="md" type="submit">
              Create Staff Account
            </NeoButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

