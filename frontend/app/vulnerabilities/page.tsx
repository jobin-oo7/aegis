"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DEMO_VULNERABILITIES } from "@/lib/demo-data";
import { Bug, Search, ShieldCheck, AlertCircle, ArrowUpRight } from "lucide-react";

export default function VulnerabilitiesPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filteredVulns = DEMO_VULNERABILITIES.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.cve_id?.toLowerCase().includes(search.toLowerCase()) ||
      v.asset_name?.toLowerCase().includes(search.toLowerCase());
    const matchesSev = severityFilter === "all" || v.severity === severityFilter;
    return matchesSearch && matchesSev;
  });

  return (
    <PageShell
      title="Vulnerability Management"
      description="Tracked CVE telemetry, CVSS exploitability metrics, patch availability, and affected enterprise assets"
    >
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search CVE ID, flaw name, or asset..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-44">
              <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
                <option value="all">All Severities</option>
                <option value="Critical">Critical (9.0 - 10.0)</option>
                <option value="High">High (7.0 - 8.9)</option>
                <option value="Medium">Medium (4.0 - 6.9)</option>
                <option value="Low">Low (0.1 - 3.9)</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CVE ID & Flaw</TableHead>
                <TableHead>Target Asset</TableHead>
                <TableHead>CVSS Base</TableHead>
                <TableHead>Exploitability</TableHead>
                <TableHead>Exploit PoC</TableHead>
                <TableHead>Patch Status</TableHead>
                <TableHead>State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVulns.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <div>
                      <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                        {v.cve_id}
                        <Badge variant={v.severity === "Critical" ? "critical" : "warning"} size="sm">
                          {v.severity}
                        </Badge>
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">{v.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-300">{v.asset_name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-rose-400">{v.cvss_score}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs">{v.exploitability_score}%</span>
                  </TableCell>
                  <TableCell>
                    {v.exploit_available ? (
                      <span className="text-xs text-rose-400 font-semibold">Available</span>
                    ) : (
                      <span className="text-xs text-slate-500">None Public</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {v.patch_available ? (
                      <Badge variant="success" size="sm">Patch Ready</Badge>
                    ) : (
                      <Badge variant="danger" size="sm">Zero-Day / No Patch</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" size="sm">{v.status}</Badge>
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
