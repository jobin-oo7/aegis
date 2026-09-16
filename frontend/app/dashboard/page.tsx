"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency, getRiskLevelColor } from "@/lib/utils";
import { DEMO_RISKS, DEMO_ASSETS, DEMO_INVESTMENTS } from "@/lib/demo-data";
import {
  ShieldAlert,
  TrendingDown,
  Coins,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Plus
} from "lucide-react";

export default function DashboardPage() {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [risks, setRisks] = useState(DEMO_RISKS);

  // Compute metrics dynamically from risks
  const totalInherentRisk = (risks.reduce((acc, r) => acc + r.inherent_risk, 0) / risks.length).toFixed(1);
  const totalResidualRisk = (risks.reduce((acc, r) => acc + r.residual_risk, 0) / risks.length).toFixed(1);
  const totalEAL = risks.reduce((acc, r) => acc + r.eal, 0);
  const totalInherentEAL = risks.reduce((acc, r) => acc + (r.loss_magnitude * r.annual_frequency), 0);
  const ealReduction = totalInherentEAL - totalEAL;
  const criticalCount = risks.filter((r) => r.risk_level === "Critical" || r.risk_level === "Very High").length;
  const totalInvestment = DEMO_INVESTMENTS.reduce((acc, i) => acc + i.cost, 0);

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 600);
  };

  return (
    <PageShell
      title="Executive Cyber Risk Overview"
      description="Continuous financial quantification, expected annual loss, and capital optimization"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleRecalculate} isLoading={isRecalculating}>
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalculate Engine</span>
          </Button>
          <Link href="/investments">
            <Button size="sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimize Investments</span>
            </Button>
          </Link>
        </div>
      }
    >
      {/* 1. Hero Risk Exposure Banner (Section 8.2) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 relative overflow-hidden apple-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>Overall Posture: Very High Exposure</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Composite Cyber Risk Exposure: <span className="text-orange-400">{totalResidualRisk}</span> / 100
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Security controls (WAF, EDR, KMS Encryption, MFA) currently mitigate organizational risk from an inherent score of{" "}
              <span className="text-slate-300 font-semibold">{totalInherentRisk}</span> down to{" "}
              <span className="text-blue-400 font-semibold">{totalResidualRisk}</span>, preventing an estimated{" "}
              <span className="text-emerald-400 font-semibold">{formatCurrency(ealReduction)}</span> in annualized losses.
            </p>
          </div>

          <div className="flex items-center gap-6 self-start lg:self-center border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-8">
            <div className="text-center space-y-1">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Inherent Exposure</p>
              <div className="text-2xl font-bold text-slate-300">{totalInherentRisk}</div>
              <p className="text-[10px] text-slate-400">Pre-controls</p>
            </div>
            <div className="text-slate-600 text-lg">→</div>
            <div className="text-center space-y-1">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-blue-400">Residual Exposure</p>
              <div className="text-2xl font-bold text-blue-400">{totalResidualRisk}</div>
              <p className="text-[10px] text-emerald-400 font-medium">Control Reduction: 43%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Executive KPI Grid (Section 8.2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Critical & High Risks"
          value={criticalCount}
          subtitle="Across 6 primary business assets"
          change="+1 new CVE"
          isPositive={false}
          icon={AlertTriangle}
          variant="critical"
        />
        <StatCard
          title="Total Expected Loss (EAL)"
          value={formatCurrency(totalEAL)}
          subtitle="Annualized incident exposure"
          change="-₹85.0 L with controls"
          isPositive={true}
          icon={ShieldAlert}
          variant="warning"
        />
        <StatCard
          title="Modeled Risk Reduction"
          value={formatCurrency(ealReduction)}
          subtitle="Capital saved via controls"
          change="3.4x Control ROI"
          isPositive={true}
          icon={TrendingDown}
          variant="success"
        />
        <StatCard
          title="Security Capital Allocated"
          value={formatCurrency(totalInvestment)}
          subtitle="4 active & planned initiatives"
          change="₹46.0 L projected save"
          isPositive={true}
          icon={Coins}
          variant="accent"
        />
      </div>

      {/* 3. Middle Section: Risk Heatmap Matrix & Top Threats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="matrix">
        {/* Visual Risk Heatmap (Section 8.3) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Continuous Risk Matrix (Likelihood vs. Impact)</CardTitle>
              <CardDescription>
                5×5 Deterministic exposure heatmap mapped to enterprise risk thresholds
              </CardDescription>
            </div>
            <Badge variant="outline" size="sm">v1 Engine Active</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              {/* Heatmap Grid */}
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {/* Row 5 (Likelihood High) */}
                <div className="h-16 rounded-xl bg-amber-500/20 border border-amber-500/30 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-amber-300 font-medium">Moderate</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>
                <div className="h-16 rounded-xl bg-orange-500/20 border border-orange-500/30 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-orange-300 font-medium">High</span>
                  <span className="text-xs text-slate-400">1</span>
                </div>
                <div className="h-16 rounded-xl bg-orange-500/30 border border-orange-500/40 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-orange-300 font-medium">High</span>
                  <span className="text-xs text-slate-400">1</span>
                </div>
                <div className="h-16 rounded-xl bg-rose-500/25 border border-rose-500/40 flex flex-col items-center justify-center p-1 relative ring-1 ring-rose-500/50">
                  <span className="text-[10px] text-rose-300 font-bold">Very High</span>
                  <span className="text-xs font-bold text-rose-200">2 risks</span>
                  <span className="text-[9px] text-rose-400">Payment API</span>
                </div>
                <div className="h-16 rounded-xl bg-rose-600/35 border border-rose-500/60 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-rose-200 font-bold">Critical</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>

                {/* Row 4 */}
                <div className="h-16 rounded-xl bg-yellow-500/15 border border-yellow-500/25 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-yellow-300 font-medium">Moderate</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>
                <div className="h-16 rounded-xl bg-amber-500/20 border border-amber-500/30 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-amber-300 font-medium">Moderate</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>
                <div className="h-16 rounded-xl bg-orange-500/20 border border-orange-500/30 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-orange-300 font-medium">High</span>
                  <span className="text-xs font-semibold text-slate-200">1 risk</span>
                </div>
                <div className="h-16 rounded-xl bg-rose-500/20 border border-rose-500/30 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-rose-300 font-semibold">Very High</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>
                <div className="h-16 rounded-xl bg-rose-600/30 border border-rose-500/50 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-rose-200 font-bold">Critical</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>

                {/* Row 3 */}
                <div className="h-16 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-emerald-300 font-medium">Low</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>
                <div className="h-16 rounded-xl bg-yellow-500/15 border border-yellow-500/25 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-yellow-300 font-medium">Moderate</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>
                <div className="h-16 rounded-xl bg-amber-500/15 border border-amber-500/25 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-amber-300 font-medium">Moderate</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>
                <div className="h-16 rounded-xl bg-orange-500/20 border border-orange-500/30 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-orange-300 font-medium">High</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>
                <div className="h-16 rounded-xl bg-rose-500/25 border border-rose-500/40 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-rose-300 font-bold">Very High</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>

                {/* Row 2 & 1 (Low Likelihood) */}
                <div className="h-16 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-emerald-300 font-medium">Low</span>
                  <span className="text-xs font-semibold text-emerald-200">1 risk</span>
                </div>
                <div className="h-16 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-emerald-300 font-medium">Low</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>
                <div className="h-16 rounded-xl bg-yellow-500/15 border border-yellow-500/25 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-yellow-300 font-medium">Moderate</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>
                <div className="h-16 rounded-xl bg-amber-500/15 border border-amber-500/25 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-amber-300 font-medium">Moderate</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>
                <div className="h-16 rounded-xl bg-orange-500/20 border border-orange-500/30 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] text-orange-300 font-medium">High</span>
                  <span className="text-xs text-slate-400">0</span>
                </div>
              </div>

              {/* Axis labels */}
              <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium pt-3 px-1">
                <span>Impact: Negligible (0)</span>
                <span className="uppercase tracking-wider font-semibold text-slate-400">Impact Axis →</span>
                <span>Critical (100)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Executive Summary Card (Section 1.4 & 8.5) */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <CardTitle>AI Risk Intelligence</CardTitle>
            </div>
            <CardDescription>Synthesized telemetry from authoritative risk engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1.5">
              <p className="font-semibold text-indigo-300">Top Priority Action:</p>
              <p className="text-slate-300">
                Patch <span className="text-white font-medium">CVE-2024-21413</span> on the Payment Gateway API. This single remediation eliminates ₹85.0 L in Expected Annual Loss with an estimated 1600% ROI.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Key Exposure Drivers:</p>
              <ul className="space-y-1 text-slate-400 list-disc list-inside">
                <li>Internet exposure on 2 transactional services</li>
                <li>Nation-state threat actor actively probing port 443</li>
                <li>DPDP Act liability on 1.2M KYC accounts</li>
              </ul>
            </div>
          </CardContent>
          <div className="p-5 pt-0">
            <Link href="/risks/rsk_payment_rce">
              <Button variant="secondary" size="sm" className="w-full justify-between">
                <span>Inspect Priority Risk Narrative</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* 4. Top Ranked Risks Register Preview (Section 8.4) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Ranked Risk Register (Top Exposures)</CardTitle>
            <CardDescription>Sorted deterministically by Residual Risk Score and Expected Annual Loss</CardDescription>
          </div>
          <Link href="/risks">
            <Button variant="outline" size="sm">
              <span>View All Risks</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk & Asset</TableHead>
                <TableHead>Vulnerability</TableHead>
                <TableHead>Likelihood</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Inherent</TableHead>
                <TableHead>Residual</TableHead>
                <TableHead>Expected Loss (EAL)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {risks.slice(0, 4).map((risk) => {
                const color = getRiskLevelColor(risk.risk_level);
                return (
                  <TableRow key={risk.id}>
                    <TableCell>
                      <div>
                        <Link href={`/risks/${risk.id}`} className="font-semibold text-slate-100 hover:text-blue-400 transition-colors">
                          {risk.asset_name}
                        </Link>
                        <p className="text-xs text-slate-400">{risk.threat_name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-300">{risk.vulnerability_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">{risk.likelihood}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">{risk.impact}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-slate-400">{risk.inherent_risk}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-bold text-blue-400">{risk.residual_risk}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-xs text-slate-100">{formatCurrency(risk.eal)}/yr</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={risk.risk_level === "Very High" ? "danger" : "warning"} size="sm">
                        {risk.risk_level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/risks/${risk.id}`}>
                        <Button variant="ghost" size="sm">Inspect</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
