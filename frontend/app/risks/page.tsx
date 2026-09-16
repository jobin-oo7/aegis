"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency, getRiskLevelColor } from "@/lib/utils";
import { DEMO_RISKS, DEMO_ASSETS, DEMO_VULNERABILITIES, DEMO_THREATS } from "@/lib/demo-data";
import { RealDataStudioModal } from "@/components/studio/RealDataStudioModal";
import { Risk } from "@/types/risk";
import { Search, Filter, ArrowUpDown, ArrowUpRight, ShieldCheck, PlusCircle, Calculator, Download } from "lucide-react";

export default function RiskRegisterPage() {
  const [risks, setRisks] = useState<Risk[]>(DEMO_RISKS);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"residual_risk" | "eal" | "inherent_risk">("residual_risk");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const filteredRisks = useMemo(() => {
    return risks.filter((risk) => {
      const matchesSearch =
        risk.asset_name?.toLowerCase().includes(search.toLowerCase()) ||
        risk.vulnerability_name?.toLowerCase().includes(search.toLowerCase()) ||
        risk.threat_name?.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = levelFilter === "all" || risk.risk_level === levelFilter;
      return matchesSearch && matchesLevel;
    }).sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      return sortOrder === "desc" ? valB - valA : valA - valB;
    });
  }, [risks, search, levelFilter, sortBy, sortOrder]);

  const handleRiskCalculated = (newRisk: Risk) => {
    setRisks([newRisk, ...risks]);
  };

  return (
    <PageShell
      title="Organizational Risk Register"
      description="Authoritative repository of identified cybersecurity risks, quantification factors, and residual exposures"
      onOpenStudio={() => setIsStudioOpen(true)}
      actions={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsStudioOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            <span>Calculate New Risk</span>
          </Button>
          <Link href="/dashboard#matrix">
            <Button variant="outline" size="sm">
              <span>View Matrix</span>
            </Button>
          </Link>
        </div>
      }
    >
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Filter by asset, CVE, or threat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Risk Level Filter */}
            <div className="w-44">
              <Select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                <option value="all">All Risk Levels</option>
                <option value="Critical">Critical (&gt;80)</option>
                <option value="Very High">Very High (&gt;60-80)</option>
                <option value="High">High (&gt;40-60)</option>
                <option value="Moderate">Moderate (&gt;20-40)</option>
                <option value="Low">Low (0-20)</option>
              </Select>
            </div>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Sort By:</span>
            <button
              onClick={() => {
                if (sortBy === "residual_risk") {
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                } else {
                  setSortBy("residual_risk");
                  setSortOrder("desc");
                }
              }}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                sortBy === "residual_risk"
                  ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              Residual Score {sortBy === "residual_risk" && (sortOrder === "desc" ? "↓" : "↑")}
            </button>
            <button
              onClick={() => {
                if (sortBy === "eal") {
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                } else {
                  setSortBy("eal");
                  setSortOrder("desc");
                }
              }}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                sortBy === "eal"
                  ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              EAL {sortBy === "eal" && (sortOrder === "desc" ? "↓" : "↑")}
            </button>
          </div>
        </CardHeader>

        <CardContent>
          {filteredRisks.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-300">No risks match the current filter</h3>
              <p className="text-xs text-slate-500">Try adjusting your search criteria or calculate a new risk.</p>
              <Button size="sm" onClick={() => setIsStudioOpen(true)}>
                <PlusCircle className="w-3.5 h-3.5 mr-1" />
                <span>Calculate New Risk</span>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset & Target</TableHead>
                  <TableHead>Vulnerability (CVE)</TableHead>
                  <TableHead>Threat Vector</TableHead>
                  <TableHead>Likelihood</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Inherent</TableHead>
                  <TableHead>Residual</TableHead>
                  <TableHead>Expected Loss (EAL)</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRisks.map((risk) => (
                  <TableRow key={risk.id}>
                    <TableCell>
                      <div>
                        <Link href={`/risks/${risk.id}`} className="font-semibold text-slate-100 hover:text-blue-400 transition-colors">
                          {risk.asset_name}
                        </Link>
                        <p className="text-[11px] text-slate-400">{risk.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-300">{risk.vulnerability_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-400">{risk.threat_name}</span>
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
                      <span className="font-semibold text-xs text-slate-100">{formatCurrency(risk.eal)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={risk.risk_level === "Very High" ? "danger" : risk.risk_level === "Critical" ? "critical" : "warning"} size="sm">
                        {risk.risk_level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/risks/${risk.id}`}>
                        <Button variant="ghost" size="sm">
                          <span>Details</span>
                          <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <RealDataStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        existingAssets={DEMO_ASSETS}
        existingVulns={DEMO_VULNERABILITIES}
        existingThreats={DEMO_THREATS}
        onRiskCalculated={handleRiskCalculated}
      />
    </PageShell>
  );
}
