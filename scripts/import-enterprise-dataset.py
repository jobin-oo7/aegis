#!/usr/bin/env python
"""
Importer Script for Aegis-Quant Enterprise Dataset
Loads complete, real-world parameterized dataset into the active database.
Run: python scripts/import-enterprise-dataset.py
"""
import json
import os
import sys

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.db.database import SessionLocal, Base, engine
from backend.app.models.organization import Organization, UserProfile
from backend.app.models.asset import Asset
from backend.app.models.vulnerability import Vulnerability
from backend.app.models.threat import Threat
from backend.app.models.control import Control
from backend.app.models.risk import Risk
from backend.app.models.investment import Investment

def load_dataset():
    dataset_path = os.path.join(os.path.dirname(__file__), "..", "database", "datasets", "enterprise_risk_dataset.json")
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return

    with open(dataset_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print("Ensuring database tables exist...")
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        print(f"Importing enterprise data for: {data['organization']['name']}...")

        # 1. Organization
        org_data = data["organization"]
        org = Organization(
            id=org_data["id"],
            name=org_data["name"],
            industry=org_data["industry"],
            currency=org_data["currency"]
        )
        db.merge(org)

        # 2. Users
        for u in data.get("users", []):
            user = UserProfile(
                id=u["id"],
                organization_id=u["organization_id"],
                full_name=u["full_name"],
                role=u["role"]
            )
            db.merge(user)

        # 3. Assets
        for a in data.get("assets", []):
            asset = Asset(
                id=a["id"],
                organization_id=a["organization_id"],
                name=a["name"],
                asset_type=a["asset_type"],
                description=a.get("description"),
                criticality=a["criticality"],
                business_value=a["business_value"],
                data_sensitivity=a["data_sensitivity"],
                internet_exposed=a["internet_exposed"],
                owner=a.get("owner"),
                environment=a.get("environment", "Production"),
                status=a.get("status", "Active")
            )
            db.merge(asset)

        # 4. Vulnerabilities
        for v in data.get("vulnerabilities", []):
            vuln = Vulnerability(
                id=v["id"],
                asset_id=v["asset_id"],
                cve_id=v.get("cve_id"),
                name=v["name"],
                description=v.get("description"),
                cvss_score=v["cvss_score"],
                exploitability_score=v["exploitability_score"],
                severity=v["severity"],
                patch_available=v.get("patch_available", False),
                exploit_available=v.get("exploit_available", False),
                status=v.get("status", "Open")
            )
            db.merge(vuln)

        # 5. Threats
        for t in data.get("threats", []):
            threat = Threat(
                id=t["id"],
                organization_id=t["organization_id"],
                name=t["name"],
                description=t.get("description"),
                threat_type=t["threat_type"],
                activity_level=t["activity_level"],
                source=t.get("source")
            )
            db.merge(threat)

        # 6. Controls
        for c in data.get("controls", []):
            control = Control(
                id=c["id"],
                organization_id=c["organization_id"],
                name=c["name"],
                control_type=c["control_type"],
                description=c.get("description"),
                effectiveness=c["effectiveness"],
                coverage=c["coverage"],
                status=c.get("status", "Operational")
            )
            db.merge(control)

        # 7. Risks
        for r in data.get("risks", []):
            risk = Risk(
                id=r["id"],
                organization_id=r["organization_id"],
                asset_id=r["asset_id"],
                vulnerability_id=r["vulnerability_id"],
                threat_id=r["threat_id"],
                likelihood=r["likelihood"],
                impact=r["impact"],
                inherent_risk=r["inherent_risk"],
                control_effectiveness=r.get("control_adjustment", 0.0),
                residual_risk=r["residual_risk"],
                annual_frequency=r.get("annual_frequency", 0.1),
                loss_magnitude=r.get("expected_loss", 0.0),
                eal=r.get("eal", 0.0),
                risk_level="High" if r["residual_risk"] > 20 else "Moderate",
                risk_status=r.get("status", "Active"),
                calculation_version="v1"
            )
            db.merge(risk)

        # 8. Investments
        for inv in data.get("investments", []):
            investment = Investment(
                id=inv["id"],
                organization_id=inv["organization_id"],
                name=inv["name"],
                description=f"Mitigation investment for {inv.get('target_risk_id')}",
                category="Security Control",
                cost=inv["cost"],
                implementation_time="30 days",
                expected_likelihood_reduction=inv["expected_risk_reduction"] * 0.6,
                expected_impact_reduction=inv["expected_risk_reduction"] * 0.4,
                expected_risk_reduction=inv["expected_risk_reduction"],
                expected_eal_reduction=inv.get("projected_eal_savings", 0.0),
                roi=inv.get("roi_percentage", 0.0),
                status=inv.get("status", "Planned")
            )
            db.merge(investment)

        db.commit()
        print("[+] Successfully loaded 6 Assets, 5 Real CVE Vulnerabilities, 4 Threat Profiles, 5 Security Controls, 4 Quantified Risks, and 3 Investment Options!")

if __name__ == "__main__":
    load_dataset()
