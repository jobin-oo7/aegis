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
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import { DEMO_ASSETS } from "@/lib/demo-data";
import { Asset } from "@/types/asset";
import { Server, Search, Plus, Globe, Lock, ArrowUpRight } from "lucide-react";

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(DEMO_ASSETS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New asset form state
  const [newAsset, setNewAsset] = useState({
    name: "",
    asset_type: "API",
    criticality: "High" as const,
    business_value: 10000000,
    data_sensitivity: 80,
    internet_exposed: true,
    owner: "Engineering",
    environment: "Production" as const,
  });

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Asset = {
      id: `ast_${Date.now()}`,
      organization_id: "org_default",
      name: newAsset.name,
      asset_type: newAsset.asset_type,
      criticality: newAsset.criticality,
      business_value: Number(newAsset.business_value),
      data_sensitivity: Number(newAsset.data_sensitivity),
      internet_exposed: newAsset.internet_exposed,
      owner: newAsset.owner,
      environment: newAsset.environment,
      status: "Active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      active_risks_count: 0,
      max_residual_risk: 0,
    };
    setAssets([created, ...assets]);
    setIsModalOpen(false);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.asset_type.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || asset.asset_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <PageShell
      title="Asset Inventory"
      description="Organizational infrastructure, services, databases, and continuous exposure posture"
      actions={
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>Register Asset</span>
        </Button>
      }
    >
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search asset name or type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-44">
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">All Asset Types</option>
                <option value="API">API</option>
                <option value="Database">Database</option>
                <option value="Portal">Portal</option>
                <option value="Cloud Storage">Cloud Storage</option>
                <option value="Endpoint">Endpoint</option>
                <option value="Server">Server</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Criticality</TableHead>
                <TableHead>Business Value</TableHead>
                <TableHead>Exposure</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Active Risks</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <div>
                      <Link href={`/assets/${asset.id}`} className="font-semibold text-slate-100 hover:text-blue-400 transition-colors">
                        {asset.name}
                      </Link>
                      <p className="text-xs text-slate-400">{asset.owner}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" size="sm">{asset.asset_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        asset.criticality === "Critical"
                          ? "critical"
                          : asset.criticality === "High"
                          ? "warning"
                          : "default"
                      }
                      size="sm"
                    >
                      {asset.criticality}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-slate-200">{formatCurrency(asset.business_value)}</span>
                  </TableCell>
                  <TableCell>
                    {asset.internet_exposed ? (
                      <span className="inline-flex items-center gap-1 text-xs text-orange-400 font-medium">
                        <Globe className="w-3 h-3" /> Internet-Facing
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <Lock className="w-3 h-3" /> Internal VPC
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-300">{asset.environment}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-semibold text-blue-400">
                      {asset.active_risks_count || 0} active
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link href={`/assets/${asset.id}`}>
                      <Button variant="ghost" size="sm">
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal for adding new asset */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Organizational Asset"
        description="Add a critical IT/OT resource into the continuous risk quantification engine"
      >
        <form onSubmit={handleCreateAsset} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Asset Name</label>
            <Input
              required
              placeholder="e.g. Core Settlement API"
              value={newAsset.name}
              onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Asset Type</label>
              <Select
                value={newAsset.asset_type}
                onChange={(e) => setNewAsset({ ...newAsset, asset_type: e.target.value })}
              >
                <option value="API">API</option>
                <option value="Database">Database</option>
                <option value="Portal">Portal</option>
                <option value="Cloud Storage">Cloud Storage</option>
                <option value="Endpoint">Endpoint</option>
                <option value="Server">Server</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Criticality Tier</label>
              <Select
                value={newAsset.criticality}
                onChange={(e) => setNewAsset({ ...newAsset, criticality: e.target.value as any })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Business Value (₹)</label>
              <Input
                type="number"
                value={newAsset.business_value}
                onChange={(e) => setNewAsset({ ...newAsset, business_value: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Data Sensitivity (0-100)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={newAsset.data_sensitivity}
                onChange={(e) => setNewAsset({ ...newAsset, data_sensitivity: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="internet_exposed"
              checked={newAsset.internet_exposed}
              onChange={(e) => setNewAsset({ ...newAsset, internet_exposed: e.target.checked })}
              className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
            />
            <label htmlFor="internet_exposed" className="text-xs text-slate-300">
              Directly Internet Exposed (Public Ingress)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Asset</Button>
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}
