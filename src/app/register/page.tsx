"use client";

import React, { useState } from "react";
import { PennyMascot } from "@/components/mascot/PennyMascot";
import { NeoButton } from "@/components/ui/NeoButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password Policy Checks (PDF Page 2 requirements)
  const isLengthValid = password.length > 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = isLengthValid && hasUppercase && hasLowercase && hasSpecial;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError("Please satisfy all password security criteria before registering.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      router.push("/portal");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-retro-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFF8EE] border-[3px] border-[#1D1E24] shadow-[6px_6px_0px_#1D1E24]">
        {/* Header Strip */}
        <div className="bg-[#25F4D2] px-4 py-2 border-b-[3px] border-[#1D1E24] flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#003D32] font-bold">
              person_add
            </span>
            <span className="font-headline text-[13px] uppercase text-[#003D32] font-black tracking-wider">
              SUBSCRIBER REGISTRATION
            </span>
          </div>
          <span className="font-mono text-[10px] font-black bg-[#003D32] text-[#25F4D2] px-2 py-0.5 border border-[#1D1E24]">
            NEW_ACCOUNT
          </span>
        </div>

        {/* Penny Mascot Guidance Box */}
        <div className="p-3.5 bg-[#FFE170]/40 border-b-2 border-[#1D1E24] flex items-center gap-3">
          <PennyMascot mood={isPasswordValid ? "celebrate" : "dispatch"} size="md" />
          <div>
            <span className="font-headline text-[9px] uppercase font-black bg-[#FFD600] px-1 py-0.2 border border-[#1D1E24]">
              SECURITY COACH
            </span>
            <p className="text-[12px] font-bold text-[#1D1E24] mt-0.5">
              {isPasswordValid
                ? "“Looking sharp! That password satisfies all our security rules!”"
                : "“Make sure your password is over 8 characters with upper, lower & special chars!”"}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-2.5 bg-[#FFCCD5] border-b-2 border-[#1D1E24] font-headline text-[11px] font-bold text-[#FF3355]">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleRegister} className="p-5 flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-headline text-[10px] uppercase font-black text-[#1D1E24] mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="David Vance"
                className="w-full p-2 bg-white border-2 border-[#1D1E24] text-[12px] font-bold shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-headline text-[10px] uppercase font-black text-[#1D1E24] mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full p-2 bg-white border-2 border-[#1D1E24] text-[12px] font-bold shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-headline text-[10px] uppercase font-black text-[#1D1E24] mb-1">
              Work Email (Must be unique)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="david@acmecorp.com"
              className="w-full p-2 bg-white border-2 border-[#1D1E24] text-[12px] font-bold shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-headline text-[10px] uppercase font-black text-[#1D1E24] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. Brightloop@2026"
              className="w-full p-2 bg-white border-2 border-[#1D1E24] text-[12px] font-bold shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            />

            {/* Password Policy Meter (PDF Page 2 Strict Rules) */}
            <div className="mt-2 p-2.5 bg-[#FFF0DC] border-2 border-[#1D1E24] text-[11px] flex flex-col gap-1">
              <span className="font-headline text-[9px] uppercase font-black text-[#5B5D68]">
                Required Password Security Policy:
              </span>
              <div className="grid grid-cols-2 gap-1 font-bold">
                <span className={isLengthValid ? "text-[#006b5b]" : "text-[#FF4D6D]"}>
                  {isLengthValid ? "✔" : "✖"} More than 8 characters
                </span>
                <span className={hasUppercase ? "text-[#006b5b]" : "text-[#FF4D6D]"}>
                  {hasUppercase ? "✔" : "✖"} 1 Uppercase letter
                </span>
                <span className={hasLowercase ? "text-[#006b5b]" : "text-[#FF4D6D]"}>
                  {hasLowercase ? "✔" : "✖"} 1 Lowercase letter
                </span>
                <span className={hasSpecial ? "text-[#006b5b]" : "text-[#FF4D6D]"}>
                  {hasSpecial ? "✔" : "✖"} 1 Special character
                </span>
              </div>
            </div>
          </div>

          <NeoButton
            variant="primary"
            size="lg"
            type="submit"
            disabled={loading || !isPasswordValid}
          >
            {loading ? "Creating Account..." : "Create Account & Enter Portal ➔"}
          </NeoButton>

          <div className="pt-2 border-t-2 border-[#1D1E24] text-center text-[12px] font-bold text-[#606275]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#006b5b] underline font-black">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

