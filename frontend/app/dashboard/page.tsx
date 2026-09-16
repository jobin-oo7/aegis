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
import { DEMO_RISKS, DEMO_ASSETS, DEMO_VULNERABILITIES, DEMO_THREATS, DEMO_INVESTMENTS } from "@/lib/demo-data";
import { ExecutiveProfitSimulator } from "@/components/charts/ExecutiveProfitSimulator";
import { RiskMatrixScatterChart } from "@/components/charts/RiskMatrixScatterChart";
import { RealDataStudioModal } from "@/components/studio/RealDataStudioModal";
import { Asset } from "@/types/asset";
import { Vulnerability, Threat, Investment } from "@/types/security";
import { Risk } from "@/types/risk";
import {
  ShieldAlert,
  TrendingDown,
  Coins,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  PlusCircle,
  Calculator,
  Layers,
  Sliders
} from "lucide-react";

export default function DashboardPage() {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [risks, setRisks] = useState<Risk[]>(DEMO_RISKS);
  const [assets, setAssets] = useState<Asset[]>(DEMO_ASSETS);
  const [vulns, setVulns] = useState<Vulnerability[]>(DEMO_VULNERABILITIES);
  const [threats, setThreats] = useState<Threat[]>(DEMO_THREATS);
  const [investments, setInvestments] = useState<Investment[]>(DEMO_INVESTMENTS);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Compute metrics dynamically from risks
  const totalInherentRisk = (risks.reduce((acc, r) => acc + r.inherent_risk, 0) / risks.length).toFixed(1);
  const totalResidualRisk = (risks.reduce((acc, r) => acc + r.residual_risk, 0) / risks.length).toFixed(1);
  const totalEAL = risks.reduce((acc, r) => acc + r.eal, 0);
  const totalInherentEAL = risks.reduce((acc, r) => acc + (r.loss_magnitude * r.annual_frequency), 0);
  const ealReduction = totalInherentEAL - totalEAL;
  const criticalCount = risks.filter((r) => r.risk_level === "Critical" || r.risk_level === "Very High").length;
  const totalInvestment = investments.reduce((acc, i) => acc + i.cost, 0);

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 500);
  };

  const handleRiskCalculated = (newRisk: Risk) => {
    setRisks([newRisk, ...risks]);
  };

  const handleAssetAdded = (newAsset: Asset) => {
    setAssets([newAsset, ...assets]);
  };

  const handleVulnAdded = (newVuln: Vulnerability) => {
    setVulns([newVuln, ...vulns]);
  };

  const handleInvestmentAdded = (newInv: Investment) => {
    setInvestments([newInv, ...investments]);
  };

  return (
    <PageShell
      title="Executive Cyber Risk & Financial Profit Intelligence"
      description="Continuous financial quantification, loss preservation, capital optimization, and interactive simulation"
      onOpenStudio={() => setIsStudioOpen(true)}
      actions={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsStudioOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            <span>Add Real Data & Calculate</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={handleRecalculate} isLoading={isRecalculating}>
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalculate All</span>
          </Button>
        </div>
      }
    >
      {/* 1. Hero Risk Exposure Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 relative overflow-hidden apple-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>Overall Posture: High Residual Exposure</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Composite Cyber Risk Exposure: <span className="text-orange-400">{totalResidualRisk}</span> / 100
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Implemented security controls currently mitigate organizational exposure from an inherent score of{" "}
              <span className="text-slate-300 font-semibold">{totalInherentRisk}</span> down to{" "}
              <span className="text-blue-400 font-semibold">{totalResidualRisk}</span>, preserving an estimated{" "}
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
              <p className="text-[10px] text-emerald-400 font-medium">Mitigation: 43%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Critical & High Risks"
          value={criticalCount}
          subtitle={`Across ${assets.length} monitored assets`}
          change="+1 recent CVE"
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
          title="Loss Prevented / Capital Preserved"
          value={formatCurrency(ealReduction)}
          subtitle="Financial capital saved via controls"
          change="3.4x Control Multiple"
          isPositive={true}
          icon={TrendingDown}
          variant="success"
        />
        <StatCard
          title="Security Capital Allocated"
          value={formatCurrency(totalInvestment)}
          subtitle={`${investments.length} active & planned initiatives`}
          change="₹46.0 L projected return"
          isPositive={true}
          icon={Coins}
          variant="accent"
        />
      </div>

      {/* 3. EXECUTIVE PROFIT & LOSS SIMULATOR (SLIDERS + RECHARTS GRAPHS) */}
      <ExecutiveProfitSimulator />

      {/* 4. Risk Scatterplot Matrix & AI Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RiskMatrixScatterChart risks={risks} />
        </div>

        {/* AI Executive Summary Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <CardTitle>AI Risk & Profit Synthesis</CardTitle>
            </div>
            <CardDescription>Synthesized telemetry from authoritative risk engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1.5">
              <p className="font-semibold text-indigo-300">Highest Profit Opportunity:</p>
              <p className="text-slate-300">
                Patch <span className="text-white font-medium">CVE-2024-21413</span> on Payment Gateway API. Capital cost of ₹5.0 L yields an estimated ₹85.0 L loss reduction, representing a <span className="text-emerald-400 font-bold">1600% ROSI</span>.
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
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-between"
              onClick={() => setIsStudioOpen(true)}
            >
              <span>Launch Live Calculation Studio</span>
              <Calculator className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* 5. Ranked Risk Register */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Ranked Risk Register (Top Exposures)</CardTitle>
            <CardDescription>Sorted deterministically by Residual Risk Score and Expected Annual Loss</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsStudioOpen(true)}>
              <PlusCircle className="w-3.5 h-3.5 mr-1" />
              <span>Calculate New Risk</span>
            </Button>
            <Link href="/risks">
              <Button variant="outline" size="sm">
                <span>View All Risks</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk & Target Asset</TableHead>
                <TableHead>Vulnerability (CVE)</TableHead>
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
              {risks.slice(0, 5).map((risk) => (
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
                    <Badge variant={risk.risk_level === "Very High" ? "danger" : risk.risk_level === "Critical" ? "critical" : "warning"} size="sm">
                      {risk.risk_level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/risks/${risk.id}`}>
                      <Button variant="ghost" size="sm">Inspect</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Real Data & Calculation Studio Modal */}
      <RealDataStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        existingAssets={assets}
        existingVulns={vulns}
        existingThreats={threats}
        onRiskCalculated={handleRiskCalculated}
        onAssetAdded={handleAssetAdded}
        onVulnAdded={handleVulnAdded}
        onInvestmentAdded={handleInvestmentAdded}
      />
    </PageShell>
  );
}
