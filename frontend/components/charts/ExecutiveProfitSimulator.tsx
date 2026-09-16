"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { calculateExecutiveProfit, calculateEAL } from "@/lib/risk-engine";
import { DollarSign, TrendingUp, ShieldCheck, Scale, Sparkles, RefreshCw, Zap } from "lucide-react";

export function ExecutiveProfitSimulator() {
  // Interactive Sliders State
  const [investmentCost, setInvestmentCost] = useState<number>(1200000); // ₹12 L
  const [controlEffectiveness, setControlEffectiveness] = useState<number>(65); // 65% reduction
  const [annualFrequency, setAnnualFrequency] = useState<number>(0.35); // 0.35/yr
  const [lossMagnitude, setLossMagnitude] = useState<number>(40000000); // ₹4 Cr

  // Calculate current baseline EAL from sliders
  const currentEAL = useMemo(() => {
    return calculateEAL(annualFrequency, lossMagnitude);
  }, [annualFrequency, lossMagnitude]);

  // Compute executive profit metrics
  const profitMetrics = useMemo(() => {
    return calculateExecutiveProfit(currentEAL, controlEffectiveness, investmentCost);
  }, [currentEAL, controlEffectiveness, investmentCost]);

  // Waterfall comparison data for BarChart
  const waterfallData = useMemo(() => {
    return [
      {
        name: "Baseline Loss (EAL)",
        amount: profitMetrics.currentLossExposure,
        fill: "#f43f5e", // Rose
        description: "Annual exposure without security capital",
      },
      {
        name: "Security Investment",
        amount: profitMetrics.investmentCost,
        fill: "#3b82f6", // Blue
        description: "Capital budget allocated",
      },
      {
        name: "Loss Prevented",
        amount: profitMetrics.projectedLossMitigated,
        fill: "#10b981", // Emerald
        description: "Financial capital saved via controls",
      },
      {
        name: "Net Profit / Return",
        amount: Math.max(0, profitMetrics.netFinancialProfit),
        fill: "#8b5cf6", // Purple
        description: "Net Value Created (Savings - Cost)",
      },
      {
        name: "Residual Loss",
        amount: profitMetrics.residualLossExposure,
        fill: "#f59e0b", // Amber
        description: "Remaining annualized exposure",
      },
    ];
  }, [profitMetrics]);

  // Sensitivity curve data: showing profit across varying budget investments
  const sensitivityData = useMemo(() => {
    const points = [];
    for (let costStep = 200000; costStep <= 5000000; costStep += 400000) {
      // Diminishing returns curve: eff = 90 * (1 - e^(-costStep / 1500000))
      const simulatedEff = Math.min(92, Math.round(92 * (1 - Math.exp(-costStep / 1400000))));
      const res = calculateExecutiveProfit(currentEAL, simulatedEff, costStep);
      points.push({
        budgetFormatted: formatCurrency(costStep),
        rawCost: costStep,
        lossMitigated: res.projectedLossMitigated,
        netProfit: res.netFinancialProfit,
        roi: res.rosiPercentage,
      });
    }
    return points;
  }, [currentEAL]);

  const handlePreset = (type: "conservative" | "balanced" | "aggressive") => {
    if (type === "conservative") {
      setInvestmentCost(500000);
      setControlEffectiveness(45);
    } else if (type === "balanced") {
      setInvestmentCost(1500000);
      setControlEffectiveness(75);
    } else {
      setInvestmentCost(3500000);
      setControlEffectiveness(90);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Executive Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 apple-shadow">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-rose-400">Baseline Loss Exposure</p>
          <p className="text-xl font-bold text-slate-100 mt-1">{formatCurrency(profitMetrics.currentLossExposure)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Annualized Incident EAL</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 apple-shadow">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-blue-400">Security Capital Cost</p>
          <p className="text-xl font-bold text-blue-300 mt-1">{formatCurrency(profitMetrics.investmentCost)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Defensive Budget</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 apple-shadow">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400">Loss Prevented</p>
          <p className="text-xl font-bold text-emerald-300 mt-1">{formatCurrency(profitMetrics.projectedLossMitigated)}</p>
          <p className="text-[10px] text-emerald-500 mt-0.5">Capital Preserved</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/40 apple-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-purple-300">Net Financial Profit</p>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-purple-200 mt-1">
            {profitMetrics.netFinancialProfit >= 0 ? "+" : ""}
            {formatCurrency(profitMetrics.netFinancialProfit)}
          </p>
          <p className="text-[10px] text-purple-300/80 mt-0.5">Net Value Created</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 apple-shadow">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-300">Return (ROSI)</p>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-200 mt-1">+{profitMetrics.rosiPercentage}%</p>
          <p className="text-[10px] text-emerald-400 mt-0.5">
            {profitMetrics.benefitCostRatio}x Benefit-to-Cost
          </p>
        </div>
      </div>

      {/* 2. Interactive Sliders Control Panel */}
      <Card className="border-blue-500/30">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-400" />
              <CardTitle>Executive Interactive Sliders Simulator</CardTitle>
            </div>
            <CardDescription>
              Drag sliders to adjust capital budget, defensive efficacy, and asset loss magnitude in real-time
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
            <span className="text-xs text-slate-400 mr-1">Presets:</span>
            <button
              onClick={() => handlePreset("conservative")}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Conservative
            </button>
            <button
              onClick={() => handlePreset("balanced")}
              className="px-2.5 py-1 text-xs rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/40"
            >
              Balanced
            </button>
            <button
              onClick={() => handlePreset("aggressive")}
              className="px-2.5 py-1 text-xs rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/40"
            >
              Aggressive
            </button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* Slider 1: Investment Budget */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Security Capital Budget</span>
              <span className="font-mono text-blue-400 font-bold">{formatCurrency(investmentCost)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={5000000}
              step={100000}
              value={investmentCost}
              onChange={(e) => setInvestmentCost(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>₹1 L</span>
              <span>₹25 L</span>
              <span>₹50 L</span>
            </div>
          </div>

          {/* Slider 2: Control Effectiveness */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Defensive Control Efficacy</span>
              <span className="font-mono text-emerald-400 font-bold">{controlEffectiveness}% Mitigated</span>
            </div>
            <input
              type="range"
              min={10}
              max={95}
              step={5}
              value={controlEffectiveness}
              onChange={(e) => setControlEffectiveness(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10% (Basic)</span>
              <span>60% (Robust)</span>
              <span>95% (Zero-Trust)</span>
            </div>
          </div>

          {/* Slider 3: Incident Frequency */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Incident Frequency Scenario</span>
              <span className="font-mono text-amber-400 font-bold">{annualFrequency} / year</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={1.0}
              step={0.05}
              value={annualFrequency}
              onChange={(e) => setAnnualFrequency(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.05 (Rare)</span>
              <span>0.50 (Biennial)</span>
              <span>1.00 (Annual)</span>
            </div>
          </div>

          {/* Slider 4: Single Incident Loss Magnitude */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Single Incident Loss Max</span>
              <span className="font-mono text-rose-400 font-bold">{formatCurrency(lossMagnitude)}</span>
            </div>
            <input
              type="range"
              min={5000000}
              max={100000000}
              step={5000000}
              value={lossMagnitude}
              onChange={(e) => setLossMagnitude(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>₹50 L</span>
              <span>₹5 Cr</span>
              <span>₹10 Cr</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Recharts Visualizations (Waterfall & Optimization Curve) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waterfall Comparison BarChart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-400" />
              <CardTitle>Capital Preservation & Profit Waterfall</CardTitle>
            </div>
            <CardDescription>
              Visual comparison of loss exposure, investment cost, and net preserved capital
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(val) => formatCurrency(val)}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-xl text-xs space-y-1">
                          <p className="font-semibold text-slate-100">{data.name}</p>
                          <p className="text-sm font-bold text-emerald-400">{formatCurrency(data.amount)}</p>
                          <p className="text-[10px] text-slate-400">{data.description}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Investment Sensitivity AreaChart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <CardTitle>Net Profit & Loss Reduction Optimization Curve</CardTitle>
            </div>
            <CardDescription>
              Marginal net value created across scaling capital investments
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensitivityData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="mitigatedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="budgetFormatted" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => formatCurrency(val)} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-xl text-xs space-y-1">
                          <p className="font-semibold text-slate-100">Budget: {data.budgetFormatted}</p>
                          <p className="text-emerald-400">Loss Prevented: {formatCurrency(data.lossMitigated)}</p>
                          <p className="text-purple-400 font-bold">Net Profit: {formatCurrency(data.netProfit)}</p>
                          <p className="text-blue-400">ROSI: +{data.roi}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="lossMitigated"
                  name="Loss Prevented"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#mitigatedGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="netProfit"
                  name="Net Profit"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#profitGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
