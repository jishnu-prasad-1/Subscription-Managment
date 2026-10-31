"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FFF8EE] flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 pl-64 xl:pl-72 flex flex-col min-h-screen">
        {/* Fixed Top Header */}
        <Header />

        {/* Scrollable Viewport Canvas */}
        <main className="w-full pt-16 bg-[#FFF8EE] min-h-[calc(100vh-4rem)] flex-1">
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
