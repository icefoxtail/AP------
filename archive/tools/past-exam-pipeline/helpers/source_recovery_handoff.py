"""Bridge a full-page-first answer/solution handoff into ALIVE recovery.

The extraction pipeline remains source-faithful and never repairs content. An
independent solver can pass its locked source payload and solve evidence to
this bridge, which delegates diagnosis and bounded R0/R1 production to the
ALIVE runtime without hand-authored defect or candidate lists.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from alive.engine.run_store import atomic_write_json
from alive.engine.source_recovery import build_blind_verifier_adapter, run_source_recovery


def _read(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError("source recovery handoff input must be an object")
    return value


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Run the ALIVE source recovery handoff")
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args(argv)
    request = _read(Path(args.input).resolve())
    aliases = {
        "sourceQuestionUid": "source_question_uid",
        "sourceLockSha256": "source_lock_sha256",
        "sourceRecoveryPolicy": "source_recovery_policy",
        "recoveryAuthority": "recovery_authority",
        "initialScopeUids": "initial_scope_uids",
        "sourceEvidenceAvailable": "source_evidence_available",
        "requiredResource": "required_resource",
        "sourcePayload": "source_payload",
        "independentSolve": "independent_solve",
        "blindVerifierSolve": "blind_verifier_solve",
        "builderSessionId": "builder_session_id",
        "verifierId": "verifier_id",
        "verifierSessionId": "verifier_session_id",
        "authorization": "authorization",
        "qualityClosureEvidence": "quality_closure_evidence",
        "lineageParityEvidence": "lineage_parity_evidence",
        "recoveryPlanId": "recovery_plan_id",
    }
    normalized = {aliases.get(key, key): value for key, value in request.items()}
    if "defectTypes" in request:
        normalized["defect_types"] = request["defectTypes"]
    blind_solve = normalized.pop("blind_verifier_solve", None)
    if blind_solve is not None:
        normalized["blind_verifier"] = build_blind_verifier_adapter(blind_solve)
    result = run_source_recovery(**normalized)
    atomic_write_json(Path(args.output).resolve(), result)
    return 0 if result.get("status") in {"NOT_REQUIRED", "RECOVERED", "PRESERVE_ONLY"} else 2


if __name__ == "__main__":
    raise SystemExit(main())
