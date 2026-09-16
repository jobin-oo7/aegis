"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface PageShellProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  onOpenStudio?: () => void;
  children: React.ReactNode;
}

export function PageShell({ title, description, actions, onOpenStudio, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Header onOpenStudio={onOpenStudio} />
        <main className="flex-1 p-8 space-y-6 max-w-7xl w-full mx-auto">
          {(title || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/40">
              <div>
                {title && <h1 className="text-2xl font-bold tracking-tight text-slate-100">{title}</h1>}
                {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
              </div>
              {actions && <div className="flex items-center gap-2.5">{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
