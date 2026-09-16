from typing import Dict, Any, List
from backend.app.ai.provider import AIProvider

class MockAIProvider(AIProvider):
    """
    Deterministic Mock AI Provider for offline testing and development.
    Generates explainable, domain-grounded narratives labeled as AI-generated.
    """

    async def generate_risk_summary(self, risk_context: Dict[str, Any]) -> Dict[str, Any]:
        asset_name = risk_context.get("asset_name", "Critical Enterprise Asset")
        vuln_name = risk_context.get("vulnerability_name", "Identified Security Flaw")
        threat_name = risk_context.get("threat_name", "Adversarial Threat Vector")
        residual_risk = risk_context.get("residual_risk", 50.0)
        eal = risk_context.get("eal", 0.0)

        summary = (
            f"The asset '{asset_name}' is currently subjected to elevated risk exposure ({residual_risk}/100) "
            f"due to '{vuln_name}' under active interest by '{threat_name}'. Existing security controls reduce "
            f"loss probability but leave a significant residual loss profile."
        )

        consequences = (
            f"Exploitation could compromise core operational availability, resulting in an estimated "
            f"Expected Annual Loss (EAL) of ₹{eal:,.2f}. Secondary implications include regulatory audit findings, "
            f"customer data exposure penalties under DPDP, and potential service interruption."
        )

        recommendations = [
            f"Deploy emergency patch or hotfix targeting {vuln_name} across production clusters.",
            "Enforce strict egress inspection and isolate communication within a zero-trust network perimeter.",
            "Conduct validation tests to confirm existing defensive controls detect exploit payload staging.",
        ]

        executive_explanation = (
            f"This risk represents a top-tier operational liability for {asset_name}. Addressing this vulnerability "
            f"produces an immediate inflection in total organizational cyber exposure."
        )

        return {
            "is_ai_generated": True,
            "provider": "MockAIProvider (Deterministic v1)",
            "summary": summary,
            "consequences": consequences,
            "recommendations": recommendations,
            "executive_explanation": executive_explanation,
        }

    async def generate_investment_narrative(self, investment_context: Dict[str, Any]) -> Dict[str, Any]:
        opt_a = investment_context.get("option_a", {})
        opt_b = investment_context.get("option_b", {})

        return {
            "is_ai_generated": True,
            "provider": "MockAIProvider",
            "narrative": (
                f"Comparing {opt_a.get('name', 'Option A')} against {opt_b.get('name', 'Option B')}: "
                f"Option A targets immediate tactical remediation with higher percentage ROI, whereas "
                f"Option B establishes systemic defensive coverage yielding greater absolute loss reduction. "
                f"Selection should align with organizational capital constraints and immediate compliance deadlines."
            ),
        }
