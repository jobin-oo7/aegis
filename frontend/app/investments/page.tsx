"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { DEMO_INVESTMENTS, DEMO_RISKS } from "@/lib/demo-data";
import {
  DollarSign,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Scale
} from "lucide-react";

export default function InvestmentsPage() {
  const [selectedOptionA, setSelectedOptionA] = useState<string>("inv_patch_rce");
  const [selectedOptionB, setSelectedOptionB] = useState<string>("inv_deploy_waf_rules");

  const currentTotalEAL = DEMO_RISKS.reduce((sum, r) => sum + r.eal, 0); // ₹3.695 Cr
  const currentTotalRisk = 52.03;

  const optA = DEMO_INVESTMENTS.find((i) => i.id === selectedOptionA) || DEMO_INVESTMENTS[0];
  const optB = DEMO_INVESTMENTS.find((i) => i.id === selectedOptionB) || DEMO_INVESTMENTS[1];

  return (
    <PageShell
      title="Investment Optimization & Capital Allocation"
      description="Model security initiatives, calculate expected loss reduction, and compare decision scenarios"
    >
      {/* 1. Scenario Comparison Simulator (Section 8.6) */}
      <Card className="border-indigo-500/30">
        <CardHeader className="bg-slate-900/60 rounded-t-2xl pb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            <CardTitle>Executive Scenario Comparison Simulator</CardTitle>
          </div>
          <CardDescription>
            Contrast measurable financial outcomes and risk reduction without automatic algorithmic bias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option A */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="info">Scenario Option A</Badge>
                <span className="text-xs font-semibold text-emerald-400">ROI: {optA.roi}%</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-base">{optA.name}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{optA.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Capital Cost</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{formatCurrency(optA.cost)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Implementation</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{optA.implementation_time}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] text-blue-400 uppercase font-semibold">Risk Reduction</p>
                  <p className="text-sm font-bold text-blue-400 mt-0.5">-{optA.expected_risk_reduction} pts</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] text-emerald-400 uppercase font-semibold">Annual EAL Saved</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">{formatCurrency(optA.expected_eal_reduction)}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
                <p className="flex justify-between">
                  <span>Projected Residual EAL:</span>
                  <span className="font-semibold text-slate-200">
                    {formatCurrency(currentTotalEAL - optA.expected_eal_reduction)}
                  </span>
                </p>
              </div>
            </div>

            {/* Option B */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="warning">Scenario Option B</Badge>
                <span className="text-xs font-semibold text-emerald-400">ROI: {optB.roi}%</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-base">{optB.name}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{optB.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Capital Cost</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{formatCurrency(optB.cost)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Implementation</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{optB.implementation_time}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] text-blue-400 uppercase font-semibold">Risk Reduction</p>
                  <p className="text-sm font-bold text-blue-400 mt-0.5">-{optB.expected_risk_reduction} pts</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] text-emerald-400 uppercase font-semibold">Annual EAL Saved</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">{formatCurrency(optB.expected_eal_reduction)}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
                <p className="flex justify-between">
                  <span>Projected Residual EAL:</span>
                  <span className="font-semibold text-slate-200">
                    {formatCurrency(currentTotalEAL - optB.expected_eal_reduction)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. All Proposed Initiatives Table */}
      <Card>
        <CardHeader>
          <CardTitle>Planned & Proposed Security Investments</CardTitle>
          <CardDescription>Quantified financial benefit estimates based on configured risk engine assumptions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Initiative Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Expected Risk Reduction</TableHead>
                <TableHead>Expected EAL Reduction</TableHead>
                <TableHead>Estimated ROI</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEMO_INVESTMENTS.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-slate-100">{inv.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{inv.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" size="sm">{inv.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold text-slate-200">{formatCurrency(inv.cost)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-blue-400">-{inv.expected_risk_reduction} pts</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-xs text-emerald-400">{formatCurrency(inv.expected_eal_reduction)}/yr</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-emerald-400">{inv.roi}%</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={inv.status === "Approved" ? "success" : "warning"} size="sm">
                      {inv.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
