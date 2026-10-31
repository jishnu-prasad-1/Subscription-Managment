import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";

export const metadata: Metadata = {
  title: "Brightloop // Subscription Management System",
  description: "Next-Generation Retro-Modern SaaS Subscription & Recurring Billing Operating System",
  icons: {
    icon: "https://lh3.googleusercontent.com/aida/AEtjO1Xsivtj-tPOaHXD5dIu7yCQVnMF6jOpeiXMH_1PdXnsikV8oT4F3jEiPdN0oc944gng0j6Zt2vyusNWasNN48aD-jZy0i7HKLwodoUotRrVhl_YMezAG0dP1F6T0vSunykCTUXjaehHYJhb3Tj2o3QqbmdQ83RyKdW8R_hyXwlaHKchtaQ3W3wJxwWfM-ld1I5GEXTM0usDwIcCXubUfAPZNI6Ljv2bVL-KXrnxwtXc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#FFF8EE] text-[#1D1E24] antialiased min-h-screen selection:bg-[#25F4D2] selection:text-[#003D32]">
        <RoleProvider>
          {children}
        </RoleProvider>
      </body>
    </html>
  );
}

