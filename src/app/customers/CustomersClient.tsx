"use client";

import React, { useState } from "react";
import { WindowCard } from "@/components/ui/WindowCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { Modal } from "@/components/ui/Modal";
import { PennyMascot } from "@/components/mascot/PennyMascot";

interface SubBrief {
  id: string;
  number: string;
  status: string;
  amount: number;
}

interface InvBrief {
  id: string;
  number: string;
  status: string;
  total: number;
  balance: number;
}

interface CustomerRow {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  billingAddress: string;
  taxId: string;
  paymentTermsDefault: string;
  isActive: boolean;
  subscriptionsCount: number;
  invoicesCount: number;
  paymentsCount: number;
  subscriptions: SubBrief[];
  invoices: InvBrief[];
}

interface CustomersClientProps {
  initialCustomers: CustomerRow[];
}

export const CustomersClient: React.FC<CustomersClientProps> = ({ initialCustomers }) => {
  const [customers, setCustomers] = useState<CustomerRow[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Net 15");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: CustomerRow = {
      id: `cust-${Date.now()}`,
      companyName,
      contactName,
      email,
      phone: phone || "+1-555-0100",
      billingAddress,
      taxId: taxId || "GST-PENDING",
      paymentTermsDefault: paymentTerms,
      isActive: true,
      subscriptionsCount: 0,
      invoicesCount: 0,
      paymentsCount: 0,
      subscriptions: [],
      invoices: [],
    };

    setCustomers([newCust, ...customers]);
    setIsModalOpen(false);
    showToast(`Created customer '${companyName}'!`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFD600] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] px-4 py-2 font-headline text-[12px] font-black uppercase animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Header Banner - Comfortable Spacing */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-[#1D1E24] p-5 sm:p-6 shadow-[4px_4px_0px_#1D1E24]">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 bg-[#FFD600] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24] shrink-0">
            <span className="material-symbols-outlined text-[32px] text-[#1D1E24] font-black">
              group
            </span>
          </div>
          <div>
            <h1 className="font-headline text-[22px] uppercase font-black text-[#1D1E24]">
              Customer Management &amp; CRM 360
            </h1>
            <p className="text-[13px] text-[#606275] font-semibold mt-0.5">
              Subscriber commercial directory, tax profiles, contract histories &amp; ledger timelines
            </p>
          </div>
        </div>

        <NeoButton
          variant="secondary"
          size="md"
          icon="person_add"
          onClick={() => setIsModalOpen(true)}
        >
          + Add New Customer
        </NeoButton>
      </section>

      {/* Search Input */}
      <div className="relative flex items-center w-full max-w-sm">
        <span className="material-symbols-outlined absolute left-2 text-[#1D1E24] text-[16px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by company, contact, or email..."
          className="w-full pl-7 pr-3 py-1.5 bg-white border-2 border-[#1D1E24] text-[12px] font-bold shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
        />
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] overflow-x-auto">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#FFF0DC] border-b-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black text-[#1D1E24]">
              <th className="p-3">Company Account</th>
              <th className="p-3">Primary Contact</th>
              <th className="p-3">Email &amp; Phone</th>
              <th className="p-3">Tax ID / GSTIN</th>
              <th className="p-3">Payment Terms</th>
              <th className="p-3 text-center">Portfolio Volume</th>
              <th className="p-3 text-center">360 View</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#1D1E24]">
            {filteredCustomers.map((cust) => (
              <tr key={cust.id} className="hover:bg-[#25F4D2]/15 transition-colors">
                <td className="p-3 font-headline font-black text-[#1D1E24]">
                  {cust.companyName}
                </td>
                <td className="p-3 font-bold text-[#1D1E24]">{cust.contactName}</td>
                <td className="p-3 text-[11px]">
                  <div>{cust.email}</div>
                  <div className="text-[#606275]">{cust.phone}</div>
                </td>
                <td className="p-3 font-headline text-[11px] font-black text-[#006b5b]">
                  {cust.taxId}
                </td>
                <td className="p-3 font-headline text-[11px] font-bold">
                  {cust.paymentTermsDefault}
                </td>
                <td className="p-3 text-center">
                  <span className="font-headline text-[10px] font-black bg-[#FFF2DF] px-2 py-0.5 border border-[#1D1E24]">
                    {cust.subscriptionsCount} Subs | {cust.invoicesCount} Invoices
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => setSelectedCustomer(cust)}
                    className="px-2.5 py-1 bg-[#25F4D2] text-[#003D32] border border-[#1D1E24] font-headline text-[10px] uppercase font-black shadow-[1.5px_1.5px_0px_#1D1E24] hover:bg-[#38EFD0]"
                  >
                    Timeline ➔
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer 360 Timeline Drawer Modal */}
      <Modal
        isOpen={selectedCustomer !== null}
        onClose={() => setSelectedCustomer(null)}
        title={`Customer 360 Timeline: ${selectedCustomer?.companyName}`}
        icon="account_circle"
        maxWidth="max-w-2xl"
      >
        {selectedCustomer && (
          <div className="flex flex-col gap-4 text-[12px]">
            {/* Profile Brief */}
            <div className="p-3 bg-[#FFF0DC] border-2 border-[#1D1E24] grid grid-cols-2 gap-2 font-headline">
              <div>
                <span className="text-[10px] text-[#5B5D68] uppercase font-black block">Contact</span>
                <span className="font-bold text-[#1D1E24]">{selectedCustomer.contactName} ({selectedCustomer.email})</span>
              </div>
              <div>
                <span className="text-[10px] text-[#5B5D68] uppercase font-black block">Tax ID &amp; Terms</span>
                <span className="font-bold text-[#1D1E24]">{selectedCustomer.taxId} | {selectedCustomer.paymentTermsDefault}</span>
              </div>
            </div>

            {/* Subscriptions History */}
            <div>
              <h3 className="font-headline text-[12px] uppercase font-black text-[#1D1E24] mb-1.5 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#00BFA0] border border-[#1D1E24]"></span>
                Active Subscriptions ({selectedCustomer.subscriptions.length})
              </h3>
              <div className="border border-[#1D1E24] bg-white divide-y divide-[#1D1E24]">
                {selectedCustomer.subscriptions.length === 0 ? (
                  <div className="p-2 text-[#606275]">No active subscriptions found.</div>
                ) : (
                  selectedCustomer.subscriptions.map((s) => (
                    <div key={s.id} className="p-2 flex items-center justify-between">
                      <span className="font-headline font-black text-[#1D1E24]">{s.number}</span>
                      <span className="text-[10px] font-headline uppercase font-black px-1.5 py-0.2 bg-[#25F4D2] text-[#003D32] border border-[#1D1E24]">
                        {s.status}
                      </span>
                      <span className="font-headline font-black">₹{s.amount.toFixed(2)}/cycle</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Invoices History */}
            <div>
              <h3 className="font-headline text-[12px] uppercase font-black text-[#1D1E24] mb-1.5 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#FFD600] border border-[#1D1E24]"></span>
                Invoicing Ledger ({selectedCustomer.invoices.length})
              </h3>
              <div className="border border-[#1D1E24] bg-white divide-y divide-[#1D1E24]">
                {selectedCustomer.invoices.length === 0 ? (
                  <div className="p-2 text-[#606275]">No invoices on record.</div>
                ) : (
                  selectedCustomer.invoices.map((inv) => (
                    <div key={inv.id} className="p-2 flex items-center justify-between">
                      <span className="font-headline font-black text-[#1D1E24]">{inv.number}</span>
                      <span className="text-[10px] font-headline uppercase font-black px-1.5 py-0.2 bg-[#FFF0DC] border border-[#1D1E24]">
                        {inv.status}
                      </span>
                      <span className="font-headline font-black">Total: ₹{inv.total.toFixed(2)} (Due: ₹{inv.balance.toFixed(2)})</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Create Customer */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Customer Account"
        icon="person_add"
      >
        <form onSubmit={handleCreateCustomer} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2.5 bg-[#FFF0DC] border-2 border-[#1D1E24]">
            <PennyMascot mood="dispatch" size="sm" />
            <p className="text-[12px] font-bold text-[#1D1E24]">
              &ldquo;Add customer commercial details, tax ID, and payment terms!&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Global Systems"
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Contact Person
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Rachel Adams"
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="billing@apex.com"
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1-555-0144"
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
              Billing Address
            </label>
            <textarea
              rows={2}
              required
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              placeholder="100 Market St, Suite 200..."
              className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Tax ID / GSTIN
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="US-EIN-123456"
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Default Terms
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              >
                <option value="Immediate">Immediate / Due on Receipt</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
              </select>
            </div>
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
              Register Customer
            </NeoButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

