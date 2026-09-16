"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { TabsList, TabTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { formatCurrency } from "@/lib/utils";
import {
  calculateLikelihood,
  calculateImpact,
  calculateExposure,
  calculateResidualRisk,
  calculateEAL,
  classifyRiskLevel,
} from "@/lib/risk-engine";
import { Asset } from "@/types/asset";
import { Vulnerability, Threat, SecurityControl, Investment } from "@/types/security";
import { Risk } from "@/types/risk";
import { Server, Bug, Crosshair, ShieldCheck, DollarSign, Calculator, Plus, CheckCircle2 } from "lucide-react";

interface RealDataStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingAssets: Asset[];
  existingVulns: Vulnerability[];
  existingThreats: Threat[];
  onAssetAdded?: (asset: Asset) => void;
  onVulnAdded?: (vuln: Vulnerability) => void;
  onRiskCalculated?: (risk: Risk) => void;
  onInvestmentAdded?: (investment: Investment) => void;
}

export function RealDataStudioModal({
  isOpen,
  onClose,
  existingAssets,
  existingVulns,
  existingThreats,
  onAssetAdded,
  onVulnAdded,
  onRiskCalculated,
  onInvestmentAdded,
}: RealDataStudioModalProps) {
  const [activeTab, setActiveTab] = useState<"asset" | "vulnerability" | "calculate" | "investment">("calculate");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Tab 1: Real Asset Form State
  const [assetForm, setAssetForm] = useState({
    name: "",
    asset_type: "API",
    description: "",
    criticality: "High" as const,
    business_value: 25000000,
    data_sensitivity: 85,
    internet_exposed: true,
    owner: "DevOps & Security Team",
    environment: "Production" as const,
  });

  // Tab 2: Real Vulnerability Form State
  const [vulnForm, setVulnForm] = useState({
    name: "",
    cve_id: "CVE-2024-",
    asset_id: existingAssets[0]?.id || "ast_payment_api",
    description: "",
    cvss_score: 8.5,
    exploitability_score: 80,
    severity: "High" as const,
    patch_available: true,
    exploit_available: true,
  });

  // Tab 3: Risk Calculation Studio Form State
  const [calcForm, setCalcForm] = useState({
    asset_id: existingAssets[0]?.id || "ast_payment_api",
    vulnerability_id: existingVulns[0]?.id || "vuln_rce",
    threat_id: existingThreats[0]?.id || "tht_ext_apt",
    exploitability: 85,
    threat_activity: 80,
    exposure: 100,
    vuln_severity: 90,
    historical_incidents: 60,
    financial_impact: 85,
    data_sensitivity: 90,
    business_criticality: 95,
    regulatory_impact: 80,
    availability_impact: 85,
    control_effectiveness: 45,
    annual_frequency: 0.30,
    loss_magnitude: 35000000,
  });

  // Tab 4: Real Investment Form State
  const [invForm, setInvForm] = useState({
    name: "",
    category: "Tooling" as const,
    cost: 800000,
    implementation_time: "14 days",
    expected_likelihood_reduction: 20,
    expected_impact_reduction: 15,
    expected_risk_reduction: 22,
    expected_eal_reduction: 4500000,
    description: "",
  });

  // Compute live deterministic risk numbers on the fly
  const liveLikelihood = calculateLikelihood(
    calcForm.exploitability,
    calcForm.threat_activity,
    calcForm.exposure,
    calcForm.vuln_severity,
    calcForm.historical_incidents
  );
  const liveImpact = calculateImpact(
    calcForm.financial_impact,
    calcForm.data_sensitivity,
    calcForm.business_criticality,
    calcForm.regulatory_impact,
    calcForm.availability_impact
  );
  const liveInherentRisk = calculateExposure(liveLikelihood, liveImpact);
  const { inherent: preservedInherent, residual: liveResidualRisk } = calculateResidualRisk(
    liveInherentRisk,
    calcForm.control_effectiveness
  );
  const liveEAL = calculateEAL(calcForm.annual_frequency, calcForm.loss_magnitude);
  const liveRiskLevel = classifyRiskLevel(liveResidualRisk);

  // Submit Handlers
  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsset: Asset = {
      id: `ast_${Date.now()}`,
      organization_id: "org_default",
      ...assetForm,
      status: "Active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      active_risks_count: 0,
      max_residual_risk: 0,
    };
    onAssetAdded?.(newAsset);
    setSuccessMessage(`Asset "${newAsset.name}" successfully registered!`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleSaveVuln = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAsset = existingAssets.find((a) => a.id === vulnForm.asset_id);
    const newVuln: Vulnerability = {
      id: `vuln_${Date.now()}`,
      ...vulnForm,
      asset_name: targetAsset?.name || vulnForm.asset_id,
      discovered_at: new Date().toISOString(),
      status: "Open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onVulnAdded?.(newVuln);
    setSuccessMessage(`Vulnerability "${newVuln.cve_id || newVuln.name}" saved!`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleCalculateAndSaveRisk = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAsset = existingAssets.find((a) => a.id === calcForm.asset_id);
    const targetVuln = existingVulns.find((v) => v.id === calcForm.vulnerability_id);
    const targetThreat = existingThreats.find((t) => t.id === calcForm.threat_id);

    const newRisk: Risk = {
      id: `rsk_${Date.now()}`,
      organization_id: "org_default",
      asset_id: calcForm.asset_id,
      asset_name: targetAsset?.name || "Target Asset",
      vulnerability_id: calcForm.vulnerability_id,
      vulnerability_name: targetVuln?.name || "Identified Flaw",
      threat_id: calcForm.threat_id,
      threat_name: targetThreat?.name || "Adversary",
      likelihood: liveLikelihood,
      impact: liveImpact,
      inherent_risk: preservedInherent,
      control_effectiveness: calcForm.control_effectiveness,
      residual_risk: liveResidualRisk,
      annual_frequency: calcForm.annual_frequency,
      loss_magnitude: calcForm.loss_magnitude,
      eal: liveEAL,
      risk_level: liveRiskLevel,
      risk_status: "Active",
      calculation_version: "v1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      drivers: [
        `Asset exposure score: ${calcForm.exposure}%`,
        `Exploitability rating: ${calcForm.exploitability}%`,
        `Direct business valuation: ${formatCurrency(calcForm.loss_magnitude)}`,
      ],
    };

    onRiskCalculated?.(newRisk);
    setSuccessMessage(`Risk computed and added to live register: Residual ${newRisk.residual_risk}, EAL ${formatCurrency(newRisk.eal)}!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSaveInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    const roi = invForm.cost > 0 ? ((invForm.expected_eal_reduction - invForm.cost) / invForm.cost) * 100 : 0;
    const newInv: Investment = {
      id: `inv_${Date.now()}`,
      organization_id: "org_default",
      ...invForm,
      roi: Number(roi.toFixed(1)),
      status: "Proposed",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onInvestmentAdded?.(newInv);
    setSuccessMessage(`Investment "${newInv.name}" added with +${newInv.roi}% ROI!`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Real Data Ingestion & Live Calculation Studio"
      description="Add your actual enterprise infrastructure, flaws, and calculate deterministic cyber risk"
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("calculate")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === "calculate" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Risk Calculation Studio</span>
          </button>
          <button
            onClick={() => setActiveTab("asset")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === "asset" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Add Real Asset</span>
          </button>
          <button
            onClick={() => setActiveTab("vulnerability")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === "vulnerability" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Add Vulnerability / CVE</span>
          </button>
          <button
            onClick={() => setActiveTab("investment")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === "investment" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Add Capital Investment</span>
          </button>
        </div>

        {successMessage && (
          <Alert variant="success" title="Action Completed">
            {successMessage}
          </Alert>
        )}

        {/* TAB 1: RISK CALCULATION STUDIO */}
        {activeTab === "calculate" && (
          <form onSubmit={handleCalculateAndSaveRisk} className="space-y-4">
            {/* Real-time calculated score banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-blue-950/40 border border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Likelihood</p>
                <p className="text-lg font-bold text-slate-100">{liveLikelihood}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Impact</p>
                <p className="text-lg font-bold text-slate-100">{liveImpact}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Inherent Risk</p>
                <p className="text-lg font-bold text-slate-300">{preservedInherent}</p>
              </div>
              <div>
                <p className="text-[10px] text-blue-400 uppercase font-semibold">Residual Risk</p>
                <p className="text-lg font-bold text-blue-400">{liveResidualRisk}</p>
                <Badge variant="outline" size="sm">{liveRiskLevel}</Badge>
              </div>
              <div>
                <p className="text-[10px] text-emerald-400 uppercase font-semibold">Expected Loss (EAL)</p>
                <p className="text-lg font-bold text-emerald-400">{formatCurrency(liveEAL)}</p>
                <p className="text-[9px] text-slate-400">per annum</p>
              </div>
            </div>

            {/* Target Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Target Asset</label>
                <Select
                  value={calcForm.asset_id}
                  onChange={(e) => setCalcForm({ ...calcForm, asset_id: e.target.value })}
                >
                  {existingAssets.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.asset_type})</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Target Vulnerability (CVE)</label>
                <Select
                  value={calcForm.vulnerability_id}
                  onChange={(e) => setCalcForm({ ...calcForm, vulnerability_id: e.target.value })}
                >
                  {existingVulns.map((v) => (
                    <option key={v.id} value={v.id}>{v.cve_id || v.name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Adversary Threat</label>
                <Select
                  value={calcForm.threat_id}
                  onChange={(e) => setCalcForm({ ...calcForm, threat_id: e.target.value })}
                >
                  {existingThreats.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.threat_type})</option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Interactive Sliders for Formula Factors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Exploitability Score</span>
                  <span className="font-mono text-blue-400 font-bold">{calcForm.exploitability}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={calcForm.exploitability}
                  onChange={(e) => setCalcForm({ ...calcForm, exploitability: Number(e.target.value) })}
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-xs pt-2">
                  <span className="text-slate-300">Internet Exposure (Ingress)</span>
                  <span className="font-mono text-blue-400 font-bold">{calcForm.exposure}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={calcForm.exposure}
                  onChange={(e) => setCalcForm({ ...calcForm, exposure: Number(e.target.value) })}
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-xs pt-2">
                  <span className="text-slate-300">Incident Frequency (cadence)</span>
                  <span className="font-mono text-amber-400 font-bold">{calcForm.annual_frequency}/yr</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={1.0}
                  step={0.05}
                  value={calcForm.annual_frequency}
                  onChange={(e) => setCalcForm({ ...calcForm, annual_frequency: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Financial Impact Severity</span>
                  <span className="font-mono text-rose-400 font-bold">{calcForm.financial_impact}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={calcForm.financial_impact}
                  onChange={(e) => setCalcForm({ ...calcForm, financial_impact: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-xs pt-2">
                  <span className="text-slate-300">Active Control Mitigation Efficacy</span>
                  <span className="font-mono text-emerald-400 font-bold">{calcForm.control_effectiveness}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={95}
                  value={calcForm.control_effectiveness}
                  onChange={(e) => setCalcForm({ ...calcForm, control_effectiveness: Number(e.target.value) })}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-xs pt-2">
                  <span className="text-slate-300">Single Incident Loss Magnitude</span>
                  <span className="font-mono text-rose-400 font-bold">{formatCurrency(calcForm.loss_magnitude)}</span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={100000000}
                  step={1000000}
                  value={calcForm.loss_magnitude}
                  onChange={(e) => setCalcForm({ ...calcForm, loss_magnitude: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
              <Button type="submit">
                <Calculator className="w-3.5 h-3.5 mr-1.5" />
                <span>Calculate & Save to Active Risk Register</span>
              </Button>
            </div>
          </form>
        )}

        {/* TAB 2: ADD REAL ASSET */}
        {activeTab === "asset" && (
          <form onSubmit={handleSaveAsset} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Asset Name</label>
              <Input
                required
                placeholder="e.g. Core Banking Payment Gateway"
                value={assetForm.name}
                onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Asset Type</label>
                <Select
                  value={assetForm.asset_type}
                  onChange={(e) => setAssetForm({ ...assetForm, asset_type: e.target.value })}
                >
                  <option value="API">API Gateway / Microservice</option>
                  <option value="Database">Transactional Database</option>
                  <option value="Cloud Storage">S3 / GCS Cloud Storage</option>
                  <option value="Server">Kubernetes / Compute Server</option>
                  <option value="Portal">Web Portal</option>
                  <option value="Endpoint">Enterprise Endpoints</option>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Criticality Tier</label>
                <Select
                  value={assetForm.criticality}
                  onChange={(e) => setAssetForm({ ...assetForm, criticality: e.target.value as any })}
                >
                  <option value="Critical">Critical (Tier 0)</option>
                  <option value="High">High (Tier 1)</option>
                  <option value="Medium">Medium (Tier 2)</option>
                  <option value="Low">Low (Tier 3)</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Monetary Business Valuation (₹)</label>
                <Input
                  type="number"
                  value={assetForm.business_value}
                  onChange={(e) => setAssetForm({ ...assetForm, business_value: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Data Sensitivity (0–100)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={assetForm.data_sensitivity}
                  onChange={(e) => setAssetForm({ ...assetForm, data_sensitivity: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="modal_internet_exposed"
                checked={assetForm.internet_exposed}
                onChange={(e) => setAssetForm({ ...assetForm, internet_exposed: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
              />
              <label htmlFor="modal_internet_exposed" className="text-xs text-slate-300">
                Directly Internet Exposed (Public Ingress)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Real Asset</Button>
            </div>
          </form>
        )}

        {/* TAB 3: ADD REAL VULNERABILITY */}
        {activeTab === "vulnerability" && (
          <form onSubmit={handleSaveVuln} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">CVE Identifier</label>
                <Input
                  required
                  placeholder="e.g. CVE-2024-3094"
                  value={vulnForm.cve_id}
                  onChange={(e) => setVulnForm({ ...vulnForm, cve_id: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Associated Asset</label>
                <Select
                  value={vulnForm.asset_id}
                  onChange={(e) => setVulnForm({ ...vulnForm, asset_id: e.target.value })}
                >
                  {existingAssets.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Vulnerability Name</label>
              <Input
                required
                placeholder="e.g. Remote Code Execution via Deserialization"
                value={vulnForm.name}
                onChange={(e) => setVulnForm({ ...vulnForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">CVSS Base Score (0.0 - 10.0)</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.0"
                  max="10.0"
                  value={vulnForm.cvss_score}
                  onChange={(e) => setVulnForm({ ...vulnForm, cvss_score: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Exploitability Rating (0–100%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={vulnForm.exploitability_score}
                  onChange={(e) => setVulnForm({ ...vulnForm, exploitability_score: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={vulnForm.patch_available}
                  onChange={(e) => setVulnForm({ ...vulnForm, patch_available: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                />
                Patch is Ready
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={vulnForm.exploit_available}
                  onChange={(e) => setVulnForm({ ...vulnForm, exploit_available: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                />
                Public Exploit PoC Exists
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Vulnerability</Button>
            </div>
          </form>
        )}

        {/* TAB 4: ADD REAL CAPITAL INVESTMENT */}
        {activeTab === "investment" && (
          <form onSubmit={handleSaveInvestment} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Initiative / Project Name</label>
              <Input
                required
                placeholder="e.g. Deploy Hardware Security Keys & Microsegmentation"
                value={invForm.name}
                onChange={(e) => setInvForm({ ...invForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Investment Cost (₹)</label>
                <Input
                  type="number"
                  value={invForm.cost}
                  onChange={(e) => setInvForm({ ...invForm, cost: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Expected Annual EAL Saved (₹)</label>
                <Input
                  type="number"
                  value={invForm.expected_eal_reduction}
                  onChange={(e) => setInvForm({ ...invForm, expected_eal_reduction: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 flex justify-between items-center text-xs">
              <span className="text-slate-300">Projected Return on Investment (ROSI):</span>
              <span className="font-bold text-emerald-400">
                +{invForm.cost > 0 ? (((invForm.expected_eal_reduction - invForm.cost) / invForm.cost) * 100).toFixed(1) : 0}%
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit">Register Investment</Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
