"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("priya.sharma@cyberaegis.com");
  const [role, setRole] = useState("Security Analyst");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 items-center justify-center shadow-lg shadow-blue-500/20 mb-2">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Aegis-Quant</h1>
          <p className="text-xs text-slate-400">Cyber Risk Intelligence & Quantification Platform</p>
        </div>

        {/* Login Card */}
        <Card variant="glass" className="border-slate-800/80">
          <CardHeader>
            <CardTitle>Enterprise Sign In</CardTitle>
            <CardDescription>Select your organizational role to access the quantification engine</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Corporate Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Role Context</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Security Analyst", "Executive", "Admin", "Viewer"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left flex items-center justify-between ${
                        role === r
                          ? "bg-blue-600/15 border-blue-500/40 text-blue-400 shadow-sm"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>{r}</span>
                      {role === r && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  <span>Access Platform</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-400">
                  Protected with Supabase Authentication & RLS Policies
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
