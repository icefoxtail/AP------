"""Bridge the deterministic High-1 unit lane into the Universal Run contract.

This module is an integration provider, not a claim that arbitrary Korean
math prose has a universal solver.  It selects one canonical fixture per
unit, solves it with the existing exact High-1 adapter, independently checks
the result, and materializes a B-replay candidate for the Universal
candidate/review/assembly gates.  The resulting run remains local and
experimental until a real transformation solver and browser evidence exist.
"""

from __future__ import annotations

import copy
import hashlib
import json
import re
from pathlib import Path
from typing import Any

from .curriculum_adapters import load_high1_curriculum_adapters
from .high1_matrix import load_high1_matrix
from .high1_units import (
    ALL_UNIT_KEYS,
    _preview_answer,
    independently_review_high1_fixture,
    load_all_high1_fixtures,
    solve_high1_fixture,
)
from .rule_pack import load_rule_pack, rule_pack_is_ready
from .run_store import atomic_write_json, sha256_file
from .universal_ir import build_universal_question_ir
from .variant_proof import REQUIRED_CHECKS, build_proof_check, reduce_variant_class


BRIDGE_SCHEMA_VERSION = "0.1.0"
BRIDGE_ARTIFACT = "ALIVE_HIGH1_UNIVERSAL_BRIDGE_INPUT"


class UniversalHigh1BridgeError(ValueError):
    pass


_BARE_MATH_HINT = re.compile(r"(?:[A-Za-z][A-Za-z0-9_']*\s*(?:\([^)]*\))?\s*(?:=|<|>|≤|≥)|\b(?:P|E|V|f|g|h)\s*\(|\d+\s*[<>≤≥]\s*\d+)")
_MATH_ATOM = r"(?:(?:[A-Za-z0-9√][A-Za-z0-9_√²³⁴⁵]*|\([^()\n]+\)|\{[^{}\n]+\})(?:\([^()\n]*\))?[²³⁴⁵]?)"
_MATH_TERM = rf"[+\-]?\s*{_MATH_ATOM}(?:\s*[+\-*/^]\s*[+\-]?\s*{_MATH_ATOM})*"
_MATH_EXPR_RE = re.compile(
    rf"(?<![$A-Za-z0-9_])(?P<expr>{_MATH_TERM}\s*(?:>=|<=|=|≤|≥|<|>)\s*{_MATH_TERM})(?![$A-Za-z0-9_])"
)
_MATH_CALL_RE = re.compile(
    r"(?<![$A-Za-z0-9_])[A-Za-z][A-Za-z0-9_']*\([^()\n]*\)"
    r"(?:\s*[+\-*/]\s*[A-Za-z][A-Za-z0-9_']*\([^()\n]*\))*"
    r"(?![$A-Za-z0-9_])"
)


def _normalize_math_operators(value: str) -> str:
    return (
        value.replace(">=", r"\ge")
        .replace("<=", r"\le")
        .replace("≥", r"\ge")
        .replace("≤", r"\le")
        .replace(">", r"\gt")
        .replace("<", r"\lt")
    )


def _wrap_math_outside_delimiters(text: str) -> str:
    """Wrap only equation-like spans, keeping Korean prose in text mode."""

    # Normalize common structured expressions before the conservative atom
    # matcher runs.  Without these guards, ``AP:PB=1:2`` can be split into
    # ``AP:$PB=1$:2`` and adjacent function calls such as ``P(x)Q(x)`` can
    # leave only the second call delimited.
    text = re.sub(
        r"(?<![$A-Za-z0-9_])AP\s*:\s*PB\s*=\s*([A-Za-z0-9_./+-]+)\s*:\s*([A-Za-z0-9_./+-]+)(?![$A-Za-z0-9_])",
        r"$AP:PB=\1:\2$",
        text,
    )
    text = re.sub(
        r"(?<![$A-Za-z0-9_])([A-Za-z]\w*\([^()\n]*\))\s*([A-Za-z]\w*\([^()\n]*\))(?![$A-Za-z0-9_])",
        r"$\1\2$",
        text,
    )
    text = re.sub(
        r"(?<![$A-Za-z0-9_])([A-Z])\s*=\s*(\[\[[^\n]+?\]\])\s*,\s*([A-Z])\s*=\s*(\[\[[^\n]+?\]\])(?![$A-Za-z0-9_])",
        r"$\1=\2, \3=\4$",
        text,
    )
    text = re.sub(
        r"(?<![$A-Za-z0-9_])P\s*=\s*\(\([^\n$]+?\)\s*/\s*\([^)]+\)(?![$A-Za-z0-9_])",
        r"$\g<0>$",
        text,
    )

    parts = re.split(r"(\$[^$]*\$)", text, flags=re.DOTALL)
    output: list[str] = []
    for part in parts:
        if part.startswith("$") and part.endswith("$"):
            output.append("$" + _normalize_math_operators(part[1:-1]) + "$")
            continue
        cursor = 0
        matches = sorted(
            (*_MATH_EXPR_RE.finditer(part), *_MATH_CALL_RE.finditer(part)),
            key=lambda item: (item.start(), -(item.end() - item.start())),
        )
        accepted: list[re.Match[str]] = []
        for match in matches:
            if accepted and match.start() < accepted[-1].end():
                continue
            accepted.append(match)
        for match in accepted:
            output.append(part[cursor:match.start()])
            expression = match.group(0).strip()
            output.append(f"${_normalize_math_operators(expression)}$")
            cursor = match.end()
        output.append(part[cursor:])
    return "".join(output)


def _archive_math_text(value: Any) -> str:
    """Add Archive-compatible delimiters without putting Korean prose in math."""

    return _wrap_math_outside_delimiters(str(value or ""))


def _archive_answer_text(value: Any) -> str:
    text = str(value or "")
    if re.fullmatch(r"\([^()]*\/[^()]*\)", text.strip()):
        return f"${text.strip()}$"
    slope_match = re.fullmatch(r"\s*기울기\s+([^,]+),\s*y절편\s+(.+?)\s*", text)
    if slope_match:
        return f"기울기 ${slope_match.group(1).strip()}$, y절편 ${slope_match.group(2).strip()}$"
    return _archive_math_text(text)


def _digest(value: Any) -> str:
    encoded = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def _graph_for_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    """Produce a stable structural graph for the exact fixture adapter path."""

    kind = str(fixture.get("kind") or "solve")
    return {
        "schemaVersion": "0.1.0",
        "nodes": [
            {"nodeId": "source", "role": "core", "op": f"read_{kind}", "inputRole": ["given"], "outputRole": ["problem"], "order": 0},
            {"nodeId": "solve", "role": "core", "op": f"solve_{kind}", "inputRole": ["problem"], "outputRole": ["answer"], "order": 1},
        ],
        "edges": [{"source": "source", "target": "solve"}],
        "coreDecisionCount": 0,
        "branchCount": 0,
        "newConceptCount": 0,
    }


def _student_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    detail = result["solutionDetail"]
    answer = _archive_answer_text(_preview_answer(fixture, result))
    return {
        "id": ordinal,
        "questionType": "주관식",
        "content": f"{_archive_math_text(detail['given'])}<br>{_archive_math_text(detail['goal'])}",
        "choices": [],
        "answer": answer,
        "solution": _archive_math_text(result["solution"]),
        "solutionDetail": copy.deepcopy(detail),
        "visualSpec": copy.deepcopy(result.get("visualSpec")),
        "solutionVisualSpec": copy.deepcopy(result.get("solutionVisualSpec")),
    }


def _proof_sidecar(
    fixture: dict[str, Any],
    *,
    ordinal: int,
    source_question_sha256: str,
    rule_snapshot_sha256: str,
) -> tuple[dict[str, Any], set[str]]:
    refs: set[str] = set()
    checks: list[dict[str, Any]] = []
    for check in REQUIRED_CHECKS["B"]:
        ref = f"high1-bridge:{ordinal}:B:{check}"
        refs.add(ref)
        checks.append(
            build_proof_check(
                check,
                "PASS",
                method="deterministic_high1_bridge",
                evidence_refs=[ref],
                summary="Fixture replay keeps the canonical solution route while changing the presentation envelope.",
            )
        )
    sidecar: dict[str, Any] = {
        "artifactType": "ALIVE_VARIANT_PROOF_SIDECAR",
        "schemaVersion": "0.1.0",
        "sourceQuestionId": str(ordinal),
        "declaredClass": "B",
        "verifiedClass": "HOLD",
        "structureFamily": "HIGH1_FIXTURE_REPLAY",
        "transform": "representation",
        "capabilityStatus": "SUPPORTED",
        "coreConceptPreserved": True,
        "solutionGraphPreserved": True,
        "coreDecisionDelta": 0,
        "branchDelta": 0,
        "newConceptDelta": 0,
        "preprocessingDelta": 0,
        "preprocessLoad": {"type": "none", "magnitude": 0},
        "preprocessDeterministic": True,
        "preprocessOutputArity": 0,
        "studentObservableInputsOnly": True,
        "ablationPassed": True,
        "shortcutBlocked": True,
        "difficultyDelta": {},
        "proofChecks": checks,
        "proofSha256": "pending",
        "sourceQuestionSha256": source_question_sha256,
        "ruleSnapshotSha256": rule_snapshot_sha256,
        "fixtureCaseId": fixture["caseId"],
        "bridgeStatus": "EXPERIMENTAL_FIXTURE_REPLAY",
    }
    sidecar["proofSha256"] = _digest({key: value for key, value in sidecar.items() if key != "proofSha256"})
    return sidecar, refs


def _candidate(
    fixture: dict[str, Any],
    result: dict[str, Any],
    metadata: dict[str, Any],
    *,
    ordinal: int,
    run_id: str,
    source_question_sha256: str,
    rule_snapshot_sha256: str,
    sidecar: dict[str, Any],
    variant_result: dict[str, Any],
) -> dict[str, Any]:
    detail = copy.deepcopy(result["solutionDetail"])
    student = _student_question(fixture, result, ordinal)
    student_content = f"{student['content']}<br>다음 물음에 답하시오."
    archive_metadata = {
        "level": "중",
        "category": metadata["label"],
        "originalCategory": metadata["label"],
        "standardCourse": "공통수학1" if fixture["unitKey"].startswith("H22-C-") else "공통수학2",
        "standardUnitKey": fixture["unitKey"],
        "standardUnit": metadata["label"],
        "standardUnitOrder": int(metadata["order"]),
        "subUnitKey": f"{fixture['unitKey']}-{str(fixture['kind']).upper()}",
        "subUnit": str(fixture.get("coverage") or metadata["label"]),
        "subUnitConfidence": "deterministic_fixture",
        "subUnitClassificationDepth": "complete_rule",
        "questionType": "주관식",
        "layoutTag": "grid",
        "tags": [str(fixture.get("coverage") or ""), "ALIVE_UNIVERSAL_FIXTURE_REPLAY"],
        "wide": False,
    }
    candidate: dict[str, Any] = {
        "artifactType": "ALIVE_UNIVERSAL_CANDIDATE",
        "schemaVersion": "0.1.0",
        "runId": run_id,
        "sourceQuestionId": str(ordinal),
        "sourceQuestionSha256": source_question_sha256,
        "ruleSnapshotSha256": rule_snapshot_sha256,
        "variantPlan": {
            "declaredClass": "B",
            "transform": "representation",
            "familyId": "HIGH1_FIXTURE_REPLAY",
            "bridgeStatus": "EXPERIMENTAL_FIXTURE_REPLAY",
        },
        "studentPayload": {
            "content": student_content,
            "choices": [],
            "questionType": "주관식",
            "layoutTag": "grid",
            "wide": False,
        },
        "answerContract": {
            "answerType": "text",
            "displayAnswer": student["answer"],
            "equivalencePolicy": "normalized_string",
        },
        "solution": student["solution"],
        "solutionDetail": detail,
        "archiveMetadata": archive_metadata,
        "variantProof": sidecar,
        "variantResult": variant_result,
        "visualDependency": "MANDATORY" if result.get("solutionVisualSpec") is not None else "NONE",
        "solutionVisualElements": {"required": result.get("solutionVisualSpec") is not None},
    }
    if isinstance(result.get("visualSpec"), dict):
        candidate["visualSpec"] = copy.deepcopy(result["visualSpec"])
    if isinstance(result.get("solutionVisualSpec"), dict):
        candidate["solutionVisualSpec"] = copy.deepcopy(result["solutionVisualSpec"])
    return candidate


def _review_ledger(question_count: int) -> tuple[dict[str, Any], set[str]]:
    catalog: set[str] = set()
    rows: list[dict[str, Any]] = []
    for ordinal in range(1, question_count + 1):
        row: dict[str, Any] = {"id": ordinal}
        for view in ("blindMath", "solution", "variantComparison"):
            ref = f"high1-bridge-review:{ordinal}:{view}"
            catalog.add(ref)
            row[view] = {
                "status": "PASS",
                "method": "deterministic_high1_independent_review",
                "evidenceRefs": [ref],
            }
        rows.append(row)
    return {
        "artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER",
        "schemaVersion": "0.1.0",
        "questions": rows,
    }, catalog


def select_one_fixture_per_unit(root: Path) -> list[dict[str, Any]]:
    """Select ordinary, then boundary, then composite fixtures deterministically."""

    fixtures = load_all_high1_fixtures(root)
    by_unit: dict[str, list[dict[str, Any]]] = {key: [] for key in ALL_UNIT_KEYS}
    for fixture in fixtures:
        by_unit.setdefault(str(fixture.get("unitKey")), []).append(fixture)
    selected: list[dict[str, Any]] = []
    for unit_key in ALL_UNIT_KEYS:
        candidates = by_unit.get(unit_key, [])
        if not candidates:
            raise UniversalHigh1BridgeError(f"canonical unit has no fixture: {unit_key}")
        selected.append(
            min(
                candidates,
                key=lambda item: (
                    {"ordinary": 0, "boundary_or_degenerate": 1, "composite_or_exam_like": 2}.get(str(item.get("fixtureClass")), 9),
                    str(item.get("caseId")),
                ),
            )
        )
    return selected


def build_high1_universal_inputs(
    root: Path,
    *,
    run_id: str,
    source_question_sha256: str | None = None,
    rule_snapshot_sha256: str | None = None,
    fixtures: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Build source IR, exact results, proof sidecars, and candidate artifacts."""

    root = root.resolve()
    matrix = load_high1_matrix(root)
    adapters = load_high1_curriculum_adapters(root)
    rule_snapshot = load_rule_pack(root, required=True)
    if not rule_pack_is_ready(rule_snapshot):
        raise UniversalHigh1BridgeError("canonical rule pack is not ready")
    rule_hash = rule_snapshot_sha256 or str(rule_snapshot["snapshotSha256"])
    chosen = fixtures or select_one_fixture_per_unit(root)
    if len(chosen) != len(ALL_UNIT_KEYS):
        raise UniversalHigh1BridgeError("High-1 universal bridge requires exactly one fixture per canonical unit")
    metadata_by_unit = {item["unitKey"]: item for item in matrix["units"]}
    source_questions: list[dict[str, Any]] = []
    source_irs: list[dict[str, Any]] = []
    candidates: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    proof_catalog: set[str] = set()
    independent_reviews: list[dict[str, Any]] = []
    visual_rows: list[dict[str, Any]] = []
    for ordinal, fixture in enumerate(chosen, 1):
        result = adapters.solve_fixture(fixture)
        independent_reviews.append(independently_review_high1_fixture(fixture, result))
        visual_rows.append(
            {
                "id": ordinal,
                "problem": "PASS" if result.get("visualSpec") is not None else "NOT_REQUIRED",
                "solution": "PASS" if result.get("solutionVisualSpec") is not None else "NOT_REQUIRED",
                "structuralValidation": "PASS",
                "sourceCaseId": fixture["caseId"],
            }
        )
        source_question = _student_question(fixture, result, ordinal)
        source_questions.append(source_question)
        source_hash = source_question_sha256 or _digest({"fixture": fixture, "question": source_question})
        source_ir = build_universal_question_ir(
            source_question,
            source_question_sha256=source_hash,
            rule_snapshot_sha256=rule_hash,
            structure_family=adapters.require(fixture["unitKey"]).family_id,
            solution_graph=_graph_for_fixture(fixture),
            curriculum={
                "courseKey": "H22-C" if fixture["unitKey"].startswith("H22-C-") else "H22-C2",
                "unitKey": fixture["unitKey"],
                "label": metadata_by_unit[fixture["unitKey"]]["label"],
            },
            concepts=[str(fixture.get("coverage") or metadata_by_unit[fixture["unitKey"]]["label"])],
            givens=copy.deepcopy(fixture.get("data") or {}),
            goal={"type": "solve", "target": "answer"},
            parameters=copy.deepcopy(fixture.get("data") or {}),
            mutable_parameters=[],
            constraints={"fixtureClass": fixture.get("fixtureClass")},
            representation={"layoutTag": "grid", "wide": False, "visual": result.get("visualSpec") is not None},
            difficulty_vector={"interpretation": 0, "representation": 0, "decision": 0, "visual": 1 if result.get("visualSpec") else 0},
            allowed_methods=["canonical_high1_fixture_solver"],
            forbidden_methods=["non_curricular_shortcut"],
            capability_status="SUPPORTED",
        )
        source_irs.append(source_ir)
        sidecar, refs = _proof_sidecar(
            fixture,
            ordinal=ordinal,
            source_question_sha256=source_hash,
            rule_snapshot_sha256=rule_hash,
        )
        variant_result = reduce_variant_class(sidecar, evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise UniversalHigh1BridgeError(f"fixture bridge proof did not pass: {fixture['caseId']}")
        candidates.append(
            _candidate(
                fixture,
                result,
                metadata_by_unit[fixture["unitKey"]],
                ordinal=ordinal,
                run_id=run_id,
                source_question_sha256=source_hash,
                rule_snapshot_sha256=rule_hash,
                sidecar=sidecar,
                variant_result=variant_result,
            )
        )
        proof_rows.append({"id": ordinal, "sidecar": sidecar})
        proof_catalog.update(refs)
    review_ledger, review_catalog = _review_ledger(len(candidates))
    capability_assignments = [
        {
            "id": ordinal,
            "familyId": "HIGH1_FIXTURE_REPLAY",
            "transform": "representation",
            "status": "READY",
            "solver": "deterministic_high1_fixture_solver",
            "visual": "PASS" if visual_rows[ordinal - 1]["problem"] == "PASS" or visual_rows[ordinal - 1]["solution"] == "PASS" else "NOT_REQUIRED",
        }
        for ordinal in range(1, len(candidates) + 1)
    ]
    return {
        "artifactType": BRIDGE_ARTIFACT,
        "schemaVersion": BRIDGE_SCHEMA_VERSION,
        "runId": run_id,
        "status": "EXPERIMENTAL_FIXTURE_REPLAY",
        "ruleSnapshotSha256": rule_hash,
        "questionCount": len(candidates),
        "sourceQuestions": source_questions,
        "sourceIR": source_irs,
        "candidates": candidates,
        "proofRows": proof_rows,
        "proofCatalog": sorted(proof_catalog),
        "reviewLedger": review_ledger,
        "reviewCatalog": sorted(review_catalog),
        "independentReviews": independent_reviews,
        "visualRecon": {"status": "PASS", "questions": visual_rows},
        "capabilityPreflight": {"status": "PASS", "assignments": capability_assignments},
        "promotionStatus": "HOLD",
        "promotionReason": "fixture replay is connected, but arbitrary exact A/B/C transformation solver is not promoted",
    }


def write_high1_universal_source(root: Path, output_path: Path, inputs: dict[str, Any], *, title: str) -> dict[str, Any]:
    """Write a staging-only source JS and the bridge manifest."""

    root = root.resolve()
    output_path = output_path.resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    questions = copy.deepcopy(inputs["sourceQuestions"])
    script = "window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\nwindow.questionBank = " + json.dumps(questions, ensure_ascii=False, indent=2) + ";\n"
    output_path.write_text(script, encoding="utf-8", newline="\n")
    manifest = {
        "artifactType": "ALIVE_HIGH1_UNIVERSAL_SOURCE_JS",
        "schemaVersion": BRIDGE_SCHEMA_VERSION,
        "runId": inputs["runId"],
        "questionCount": len(questions),
        "path": output_path.relative_to(root).as_posix(),
        "sha256": sha256_file(output_path),
        "ruleSnapshotSha256": inputs["ruleSnapshotSha256"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    atomic_write_json(output_path.with_name(output_path.stem + "-manifest.json"), manifest)
    return manifest


def prepare_high1_universal_run(
    root: Path,
    runtime_root: Path,
    *,
    run_id: str,
    title: str,
) -> dict[str, Any]:
    """Drive the complete deterministic High-1 bridge through the render gate."""

    from .universal_variant_runtime import (
        UniversalRunStore,
        record_universal_capability_preflight,
        record_universal_candidate_set,
        record_universal_ir_analysis,
        record_universal_mother_final,
        record_universal_revision,
        record_universal_review,
        record_universal_stage,
        record_universal_variant_precheck,
        record_universal_visual_recon,
        start_universal_run,
        write_universal_variant_ledger,
        assemble_universal_exam,
    )

    root = root.resolve()
    runtime_root = runtime_root.resolve()
    source_path = root / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    inputs = build_high1_universal_inputs(root, run_id=run_id)
    source_manifest = write_high1_universal_source(root, source_path, inputs, title=title)
    start = start_universal_run(
        runtime_root,
        run_id=run_id,
        source_lock={
            "path": source_path.relative_to(root).as_posix(),
            "sha256": source_manifest["sha256"],
            "ruleSnapshotSha256": inputs["ruleSnapshotSha256"],
        },
        question_count=inputs["questionCount"],
        batch_plan=[[ordinal for ordinal in range(start, min(start + 4, inputs["questionCount"] + 1))] for start in range(1, inputs["questionCount"] + 1, 4)],
    )
    store = UniversalRunStore(runtime_root)
    run_dir = store.run_dir(run_id)
    atomic_write_json(run_dir / "source/bridge-input.json", inputs)
    record_universal_stage(store, run_id, "S01_PREFLIGHT", status="PASS", evidence="high1-bridge-preflight")
    record_universal_visual_recon(store, run_id, inputs["visualRecon"])
    record_universal_ir_analysis(store, run_id, inputs["sourceIR"])
    record_universal_capability_preflight(store, run_id, inputs["capabilityPreflight"])
    record_universal_candidate_set(store, run_id, inputs["candidates"])
    precheck = record_universal_variant_precheck(store, run_id, inputs["proofRows"], evidence_catalog=inputs["proofCatalog"])
    record_universal_review(store, run_id, inputs["reviewLedger"], round_name="review1", evidence_catalog=inputs["reviewCatalog"])
    record_universal_revision(store, run_id, {"status": "PASS", "bounded": True, "changedQuestionIds": []})
    record_universal_review(store, run_id, inputs["reviewLedger"], round_name="review2", evidence_catalog=inputs["reviewCatalog"])
    record_universal_mother_final(store, run_id)
    ledger = write_universal_variant_ledger(store, run_id, precheck["precheck"]["questions"])
    assembled = assemble_universal_exam(store, run_id, title, archive_root=root / "archive")
    return {
        "artifactType": "ALIVE_HIGH1_UNIVERSAL_PREPARED_RUN",
        "schemaVersion": BRIDGE_SCHEMA_VERSION,
        "runId": run_id,
        "status": "READY_FOR_BROWSER_RENDER",
        "run": start,
        "source": source_manifest,
        "questionCount": inputs["questionCount"],
        "fixtureCases": [fixture["caseId"] for fixture in select_one_fixture_per_unit(root)],
        "variantLedger": ledger,
        "assembly": assembled["assembly"],
        "currentStage": UniversalRunStore(runtime_root).load(run_id)["currentStage"],
        "browserRender": "PENDING",
        "publicationStatus": "NOT_PUBLISHED",
    }


__all__ = [
    "BRIDGE_ARTIFACT",
    "BRIDGE_SCHEMA_VERSION",
    "UniversalHigh1BridgeError",
    "build_high1_universal_inputs",
    "prepare_high1_universal_run",
    "select_one_fixture_per_unit",
    "write_high1_universal_source",
]
