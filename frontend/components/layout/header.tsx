"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  PlusCircle,
  LogOut,
  User,
  ChevronDown,
  Shield,
  CheckCircle2,
  KeyRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, setCurrentUser, clearCurrentUser, DEMO_PERSONAS } from "@/lib/auth";
import { User as UserType } from "@/types/user";

interface HeaderProps {
  onOpenStudio?: () => void;
}

export function Header({ onOpenStudio }: HeaderProps) {
  const router = useRouter();
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [user, setUser] = useState<UserType>(DEMO_PERSONAS.executive);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync user state from localStorage
  useEffect(() => {
    setUser(getCurrentUser());
    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener("aegis_auth_changed", handleAuthChange);
    return () => window.removeEventListener("aegis_auth_changed", handleAuthChange);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchPersona = (key: string) => {
    const p = DEMO_PERSONAS[key];
    if (p) {
      setCurrentUser(p);
      setIsUserMenuOpen(false);
    }
  };

  const handleLogout = () => {
    clearCurrentUser();
    setIsUserMenuOpen(false);
    router.push("/login");
  };

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
      <div className="flex items-center gap-3">
        {/* Quick Add Real Data Action */}
        {onOpenStudio && (
          <Button
            size="sm"
            onClick={onOpenStudio}
            className="hidden sm:inline-flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs shadow-md shadow-blue-600/10"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            <span>Add Real Data & Calculate</span>
          </Button>
        )}

        {/* Currency Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
          <button
            onClick={() => setCurrency("INR")}
            className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors ${
              currency === "INR"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            INR (₹)
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors ${
              currency === "USD"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            USD ($)
          </button>
        </div>

        {/* Live Engine Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Engine v1</span>
        </div>

        {/* User Profile Menu Dropdown */}
        <div className="relative pl-2 border-l border-slate-800" ref={menuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-900/80 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-indigo-400/30 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
              {user.avatar_initials || user.full_name?.slice(0, 2).toUpperCase() || "PS"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-slate-200 leading-tight truncate max-w-[120px]">
                {user.full_name}
              </p>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
          </button>

          {/* Interactive User Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl p-2 z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-slate-100 truncate">{user.full_name}</p>
                <p className="text-[11px] text-blue-400 font-medium truncate">{user.role}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.organization_name}</p>
              </div>

              {/* Quick Persona Switcher */}
              <div className="py-2 border-b border-slate-800">
                <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Switch Persona
                </p>
                {Object.entries(DEMO_PERSONAS).map(([k, p]) => {
                  const isCurrent = user.email === p.email;
                  return (
                    <button
                      key={k}
                      onClick={() => handleSwitchPersona(k)}
                      className={`w-full px-3 py-1.5 rounded-lg text-left text-xs flex items-center justify-between transition-colors ${
                        isCurrent
                          ? "bg-blue-600/20 text-blue-400 font-medium"
                          : "text-slate-300 hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="truncate">
                        <span className="truncate block font-medium">{p.full_name}</span>
                        <span className="text-[10px] text-slate-400 truncate block">{p.role}</span>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Login / Logout actions */}
              <div className="pt-1.5 space-y-1">
                <Link
                  href="/login"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/60 flex items-center gap-2 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>Go to Login Screen</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
