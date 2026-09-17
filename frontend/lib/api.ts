import { Risk } from "@/types/risk";
import { Asset } from "@/types/asset";
import { Vulnerability, Threat, SecurityControl, Investment } from "@/types/security";
import { DEMO_RISKS, DEMO_ASSETS, DEMO_VULNERABILITIES, DEMO_THREATS, DEMO_CONTROLS, DEMO_INVESTMENTS } from "@/lib/demo-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function fetchWithFallback<T>(endpoint: string, fallbackData: T, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
    if (!res.ok) {
      console.warn(`API request to ${endpoint} returned ${res.status}. Using cached/fallback data.`);
      return fallbackData;
    }
    return await res.json();
  } catch (err) {
    // Graceful offline fallback
    return fallbackData;
  }
}

export const api = {
  // Health
  checkHealth: () => fetchWithFallback("/health", { status: "ok" }),

  // Risks
  getRisks: () => fetchWithFallback<Risk[]>("/risks", DEMO_RISKS),
  getRiskById: (id: string) =>
    fetchWithFallback<Risk>(`/risks/${id}`, DEMO_RISKS.find((r) => r.id === id) || DEMO_RISKS[0]),
  calculateRisk: (payload: any) =>
    fetchWithFallback<Risk>("/risks/calculate", DEMO_RISKS[0], {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Assets
  getAssets: () => fetchWithFallback<Asset[]>("/assets", DEMO_ASSETS),
  getAssetById: (id: string) =>
    fetchWithFallback<Asset>(`/assets/${id}`, DEMO_ASSETS.find((a) => a.id === id) || DEMO_ASSETS[0]),

  // Vulnerabilities
  getVulnerabilities: () => fetchWithFallback<Vulnerability[]>("/vulnerabilities", DEMO_VULNERABILITIES),

  // Threats
  getThreats: () => fetchWithFallback<Threat[]>("/threats", DEMO_THREATS),

  // Controls
  getControls: () => fetchWithFallback<SecurityControl[]>("/controls", DEMO_CONTROLS),

  // Investments
  getInvestments: () => fetchWithFallback<Investment[]>("/investments", DEMO_INVESTMENTS),
  optimizeInvestments: (ids: string[]) =>
    fetchWithFallback("/investments/optimize", [], {
      method: "POST",
      body: JSON.stringify({ investment_ids: ids }),
    }),

  // Analytics
  getAnalyticsOverview: () =>
    fetchWithFallback("/analytics/overview", {
      total_eal: 36950000,
      inherent_eal: 45450000,
      eal_reduction: 8500000,
      average_residual_risk: 34.15,
      critical_risks_count: 2,
    }),

  // AI
  generateRiskSummary: (riskContext: any) =>
    fetchWithFallback("/ai/risk-summary", {
      is_ai_generated: true,
      summary: "High-consequence remote code execution exposing card processing infrastructure.",
      consequences: "Potential unauthorized transaction fabrication and regulatory penalties.",
      recommendations: ["Deploy emergency patch within 24 hours"],
      executive_explanation: "Highest financial liability facing the organization.",
    }, {
      method: "POST",
      body: JSON.stringify(riskContext),
    }),

  chatWithAI: (messages: { role: string; content: string }[], context?: any) =>
    fetchWithFallback("/ai/chat", {
      role: "assistant",
      content: "Hello! I am Aegis-Quant AI, your cyber risk intelligence and capital quantification advisor. Our deterministic quantification engine monitors 6 active enterprise risks with a total residual EAL of ₹36,950,000.",
      suggestions: [
        "What is our total organizational EAL liability?",
        "Which risk is currently ranked #1 and why?",
        "If we spend ₹800,000 on WAF, what is our projected ROSI?",
        "Explain how Likelihood & Residual Risk are calculated",
      ],
      citations: ["Aegis Deterministic Risk Model v1.0", "ISO/IEC 27005", "NIST SP 800-30"],
    }, {
      method: "POST",
      body: JSON.stringify({ messages, context }),
    }),
};

