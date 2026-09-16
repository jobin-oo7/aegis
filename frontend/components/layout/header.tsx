"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Shield, User, Globe, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search risks, CVEs, assets, controls..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Currency Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
          <button
            onClick={() => setCurrency("INR")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              currency === "INR"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            INR (₹)
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              currency === "USD"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            USD ($)
          </button>
        </div>

        {/* Live Engine Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Continuous Scoring</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* User Profile Menu */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600/50 flex items-center justify-center text-slate-200 font-semibold text-xs">
            PM
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-medium text-slate-200 leading-tight">Priya Sharma</p>
            <p className="text-[10px] text-slate-400">Lead Risk Analyst</p>
          </div>
        </div>
      </div>
    </header>
  );
}
