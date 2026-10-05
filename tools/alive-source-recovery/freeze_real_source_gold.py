from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "reports/alive-source-recovery-p1-real-source-20260909"
GOLD = ROOT / "gold"


def main() -> int:
    rows = []
    for path in sorted(GOLD.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        rows.append({"caseId": data["caseId"], "goldRef": f"gold/{path.name}", "goldArtifactSha256": data["goldArtifactSha256"]})
    body = {
        "schemaVersion": "ALIVE_SOURCE_RECOVERY_P1_GOLD_FREEZE_v1",
        "status": "FROZEN_BEFORE_ENGINE",
        "goldCount": len(rows),
        "gold": rows,
    }
    body["freezeManifestSha256"] = "sha256:" + hashlib.sha256((json.dumps(body, ensure_ascii=False, sort_keys=True) + "\n").encode("utf-8")).hexdigest()
    (ROOT / "gold_freeze.json").write_text(json.dumps(body, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": body["status"], "goldCount": len(rows), "freezeManifestSha256": body["freezeManifestSha256"]}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
