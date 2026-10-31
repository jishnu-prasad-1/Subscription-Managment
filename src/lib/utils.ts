import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: "USD" | "INR" = "USD"): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "N/A";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatPeriod(startInput: Date | string, endInput: Date | string): string {
  return `${formatDate(startInput)} – ${formatDate(endInput)}`;
}

export function getStatusBadgeStyle(status: string): { bg: string; text: string; border: string } {
  const s = status.toLowerCase();
  switch (s) {
    case "active":
      return { bg: "bg-[#25F4D2]", text: "text-[#003D32]", border: "border-[#1D1E24]" };
    case "confirmed":
      return { bg: "bg-[#00C2E8]", text: "text-[#1D1E24]", border: "border-[#1D1E24]" };
    case "quotation":
      return { bg: "bg-[#FFD600]", text: "text-[#1D1E24]", border: "border-[#1D1E24]" };
    case "draft":
      return { bg: "bg-[#FFE0A3]", text: "text-[#1D1E24]", border: "border-[#1D1E24]" };
    case "paid":
      return { bg: "bg-[#25F4D2]", text: "text-[#003D32]", border: "border-[#1D1E24]" };
    case "overdue":
      return { bg: "bg-[#FF4D6D]", text: "text-white", border: "border-[#1D1E24]" };
    case "paused":
      return { bg: "bg-[#FFE170]", text: "text-[#1D1E24]", border: "border-[#1D1E24]" };
    case "closed":
    case "cancelled":
      return { bg: "bg-[#EED2AF]", text: "text-[#1D1E24]", border: "border-[#1D1E24]" };
    default:
      return { bg: "bg-white", text: "text-[#1D1E24]", border: "border-[#1D1E24]" };
  }
}
