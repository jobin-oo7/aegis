"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ShieldAlert,
  LayoutDashboard,
  FileSpreadsheet,
  Grid3X3,
  Server,
  Bug,
  Crosshair,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Settings,
  Sparkles,
  DollarSign
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Risk Quantification",
    items: [
      { title: "Risk Register", href: "/risks", icon: FileSpreadsheet },
      { title: "Risk Matrix", href: "/dashboard#matrix", icon: Grid3X3 },
    ],
  },
  {
    title: "Security Posture",
    items: [
      { title: "Assets Inventory", href: "/assets", icon: Server },
      { title: "Vulnerabilities", href: "/vulnerabilities", icon: Bug },
      { title: "Threat Intel", href: "/threats", icon: Crosshair },
      { title: "Security Controls", href: "/controls", icon: ShieldCheck },
    ],
  },
  {
    title: "Financial & Capital",
    items: [
      { title: "Investment Opt.", href: "/investments", icon: DollarSign, badge: "AI" },
      { title: "Loss Analytics", href: "/analytics", icon: TrendingUp },
    ],
  },
  {
    title: "Administration",
    items: [
      { title: "Settings & Weights", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-xl flex flex-col h-screen fixed top-0 left-0 z-40 select-none">
      {/* Platform Branding */}
      <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-slate-100 flex items-center gap-1.5">
              Aegis-Quant
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">v1</span>
            </div>
            <p className="text-[10px] text-slate-400 font-normal">Risk Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {navigation.map((section) => (
          <div key={section.title} className="space-y-1">
            <h4 className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {section.title}
            </h4>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                    isActive
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300")} />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Org Profile Status Indicator */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-200 truncate">CyberAegis Financial</p>
            <p className="text-[10px] text-slate-400">Risk Engine: Deterministic v1</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
