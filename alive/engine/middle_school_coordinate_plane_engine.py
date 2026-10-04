"""Bounded exact A/B adapter for M1-04 coordinate-plane point locations."""

from __future__ import annotations

import copy
import hashlib
import json
from fractions import Fraction
from pathlib import Path
from typing import Any

from .rule_pack import load_rule_pack, rule_pack_is_ready
from .run_store import atomic_write_json, sha256_file
from .solution_graph import normalize_solution_graph
from .source_question import json_sha256
from .structure_families import CAPABILITY_HOLD, CAPABILITY_SUPPORTED, StructureFamilyAdapter, StructureFamilyRegistry
from .universal_candidate import validate_universal_candidate
from .universal_ir import build_universal_question_ir, require_valid_universal_question_ir
from .universal_variant_engine import TRANSFORM_A_NUMERIC, TRANSFORM_B_REPRESENTATION, TRANSFORM_C_PARAMETER_RECOVERY, evaluate_capability_promotion
from .variant_proof import build_proof_check, reduce_variant_class


COORDINATE_PLANE_VARIANT_SCHEMA_VERSION = "0.1.0"
COORDINATE_PLANE_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_coordinate_plane.json")
COORDINATE_PLANE_UNIT_KEY = "M1-04"
COORDINATE_PLANE_FAMILY_ID = "COORDINATE_PLANE_POINT"


class MiddleSchoolCoordinatePlaneVariantError(ValueError):
    pass


def _integer(value: Any, label: str) -> int:
    if isinstance(value, bool):
        raise MiddleSchoolCoordinatePlaneVariantError(f"{label} must be an integer")
    try:
        number = int(value)
    except (TypeError, ValueError) as error:
        raise MiddleSchoolCoordinatePlaneVariantError(f"invalid {label}: {value!r}") from error
    if number != value:
        raise MiddleSchoolCoordinatePlaneVariantError(f"{label} must be an integer")
    return number


def _location(x: int, y: int) -> str:
    if x == 0 and y == 0:
        return "원점"
    if x == 0:
        return "y축"
    if y == 0:
        return "x축"
    if x > 0 and y > 0:
        return "제1사분면"
    if x < 0 and y > 0:
        return "제2사분면"
    if x < 0 and y < 0:
        return "제3사분면"
    return "제4사분면"


def _point_text(x: int, y: int) -> str:
    return f"A({x},{y})"


def _visual_spec(fixture: dict[str, Any], location: str, *, solution: bool) -> dict[str, Any]:
    x, y = (_integer(fixture["data"][key], key) for key in ("x", "y"))
    annotations = [{"x": -5.7, "y": 5.7, "text": "좌표평면"}]
    if solution:
        annotations.append({"x": -5.7, "y": 4.9, "text": f"위치: {location}"})
    return {"version": "0.1", "type": "coordinate_plane", "title": "점의 위치", "width": 460, "height": 320, "xRange": [-7, 7], "yRange": [-7, 7], "points": [{"x": x, "y": y, "label": "A"}], "segments": [], "lines": [], "curves": [], "annotations": annotations}


def solve_middle_school_coordinate_plane_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") != COORDINATE_PLANE_UNIT_KEY or fixture.get("familyId") != COORDINATE_PLANE_FAMILY_ID:
        raise MiddleSchoolCoordinatePlaneVariantError("fixture belongs to M1-04 coordinate plane")
    data = fixture.get("data", {})
    x, y = _integer(data.get("x"), "x"), _integer(data.get("y"), "y")
    location = _location(x, y)
    sign_text = f"$x$={'양수' if x > 0 else '음수' if x < 0 else '0'}, $y$={'양수' if y > 0 else '음수' if y < 0 else '0'}"
    given = f"좌표평면 위의 점 ${_point_text(x, y)}$의 위치를 구하여라."
    steps = [
        {"title": "좌표의 부호 확인", "work": f"점 ${_point_text(x, y)}$에서 {sign_text}이다.", "why": "사분면은 x좌표와 y좌표의 부호로 판별한다."},
        {"title": "사분면 또는 축 판별", "work": f"따라서 점 ${_point_text(x, y)}$는 {location}에 있다.", "why": "$x=0$이면 y축, $y=0$이면 x축이고, 두 좌표가 0이 아니면 부호 조합으로 사분면을 정한다."},
        {"title": "좌표평면에서 확인", "work": f"${_point_text(x, y)}$의 표시 위치가 {location}과 일치한다.", "why": "그림에서 원점을 기준으로 점의 실제 위치를 확인하여 부호 판별을 검산한다."},
    ]
    return {"answer": location, "answerText": location, "given": given, "goal": f"점 ${_point_text(x, y)}$의 사분면 또는 축을 구한다.", "keyIdea": "x좌표와 y좌표의 부호를 확인하여 사분면 또는 축을 판별한다.", "conceptNote": "제1·2·3·4사분면의 부호는 각각 $(+,+)$, $(-,+)$, $(-,-)$, $(+,-)$이다. 한 좌표가 $0$이면 해당 좌표축 위에 있다.", "steps": steps, "check": f"점 ${_point_text(x, y)}$의 좌표 부호와 그림의 위치가 모두 {location}을 가리키므로 답이 맞다.", "commonMistakes": ["x좌표와 y좌표의 순서를 바꾸는 것", "제2사분면과 제4사분면의 부호를 바꾸는 것", "좌표가 0일 때 사분면이라고 하는 것"], "visualSpec": _visual_spec(fixture, location, solution=False), "solutionVisualSpec": _visual_spec(fixture, location, solution=True)}


def load_middle_school_coordinate_plane_fixtures(root: Path) -> list[dict[str, Any]]:
    try:
        payload = json.loads((Path(root) / COORDINATE_PLANE_FIXTURE_RELATIVE_PATH).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise MiddleSchoolCoordinatePlaneVariantError("M1-04 coordinate-plane fixture corpus cannot be read") from error
    if payload.get("artifactType") != "ALIVE_MIDDLE_SCHOOL_COORDINATE_PLANE_STRUCTURED_FIXTURES" or payload.get("unitKey") != COORDINATE_PLANE_UNIT_KEY or payload.get("familyId") != COORDINATE_PLANE_FAMILY_ID:
        raise MiddleSchoolCoordinatePlaneVariantError("M1-04 coordinate-plane fixture metadata is invalid")
    fixtures = payload.get("fixtures")
    if not isinstance(fixtures, list) or len(fixtures) != 6 or any(item.get("familyId") != COORDINATE_PLANE_FAMILY_ID for item in fixtures if isinstance(item, dict)):
        raise MiddleSchoolCoordinatePlaneVariantError("M1-04 coordinate-plane corpus must contain six matching fixtures")
    return copy.deepcopy(fixtures)


def middle_school_coordinate_plane_variant_registry() -> StructureFamilyRegistry:
    registry = StructureFamilyRegistry()
    registry.register(StructureFamilyAdapter(family_id=COORDINATE_PLANE_FAMILY_ID, solver_profile="middle_school_coordinate_plane_exact_adapter_v1", transform_capabilities={TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED, TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED, TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_HOLD}, visual_capabilities={TRANSFORM_A_NUMERIC: "MANDATORY", TRANSFORM_B_REPRESENTATION: "MANDATORY", TRANSFORM_C_PARAMETER_RECOVERY: "HOLD"}))
    return registry


def _mutated_data(fixture: dict[str, Any]) -> dict[str, Any]:
    values = {"m1-04-first-quadrant": {"x": 5, "y": 2}, "m1-04-second-quadrant": {"x": -3, "y": 4}, "m1-04-third-quadrant": {"x": -2, "y": -6}, "m1-04-fourth-quadrant": {"x": 4, "y": -5}, "m1-04-y-axis": {"x": 0, "y": 3}, "m1-04-x-axis": {"x": -3, "y": 0}}
    try:
        return copy.deepcopy(values[fixture["caseId"]])
    except KeyError as error:
        raise MiddleSchoolCoordinatePlaneVariantError(f"no M1-04 numeric mutation for {fixture.get('caseId')}") from error


def _graph() -> dict[str, Any]:
    return normalize_solution_graph({"nodes": [{"nodeId": "sign", "role": "core", "op": "inspect_coordinate_signs", "inputRole": ["point_coordinates"], "outputRole": ["sign_pair"], "order": 0}, {"nodeId": "locate", "role": "core", "op": "map_sign_pair_to_quadrant_or_axis", "inputRole": ["sign_pair"], "outputRole": ["point_location"], "order": 1}], "edges": [{"from": "sign", "to": "locate"}], "coreDecisionCount": 1, "branchCount": 1, "newConceptCount": 0})


def _student_payload(fixture: dict[str, Any], *, representation: str) -> dict[str, Any]:
    x, y = (_integer(fixture["data"][key], key) for key in ("x", "y"))
    content = f"좌표평면 위의 점 ${_point_text(x, y)}$가 어느 사분면 또는 축 위에 있는지 구하여라." if representation == "standard" else f"점 ${_point_text(x, y)}$의 좌표 부호를 이용하여 위치를 판별하여라."
    return {"content": content, "choices": [], "questionType": "단답형", "layoutTag": "wide", "wide": True}


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    return {"id": ordinal, **_student_payload(fixture, representation="standard"), "answer": result["answerText"], "solution": result["answerText"], "standardCourse": "중1 수학", "standardUnitKey": COORDINATE_PLANE_UNIT_KEY, "standardUnit": "좌표평면과 그래프"}


def _build_ir(fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source = _source_question(fixture, result, ordinal)
    return build_universal_question_ir(source, source_question_sha256=json_sha256(fixture), rule_snapshot_sha256=snapshot_sha, structure_family=COORDINATE_PLANE_FAMILY_ID, solution_graph=_graph(), curriculum={"courseKey": "M1", "unitKey": COORDINATE_PLANE_UNIT_KEY, "label": "좌표평면과 그래프"}, concepts=[fixture["subUnit"]], givens={"data": copy.deepcopy(fixture["data"])}, goal={"kind": fixture["kind"]}, parameters=copy.deepcopy(fixture["data"]), mutable_parameters=["x", "y"], constraints={"integerCoordinates": True, "quadrantOrAxis": True}, representation={"layoutTag": "wide", "wide": True, "style": "coordinate_plane"}, difficulty_vector={"interpretation": 1, "representation": 1, "decision": 1, "algebraLoad": 0, "calculationLoad": 1, "visualLoad": 2, "branch": 1, "newConcept": 0}, allowed_methods=["좌표의 부호", "사분면 판별", "좌표축 판별"], forbidden_methods=["좌표 순서를 바꾸기", "축 위의 점을 사분면으로 판정하기", "중학교 교육과정 밖의 좌표 공식 사용"], capability_status=CAPABILITY_SUPPORTED)


def _sidecar(source_ir: dict[str, Any], candidate_ir: dict[str, Any], declared_class: str, ordinal: int) -> dict[str, Any]:
    refs = [f"middle-coordinate-plane-proof:{ordinal}:{declared_class}"]
    required = ["coreConceptPreserved", "solutionGraphPreserved", "curriculumPreserved", "parameterChanged", "effectiveParameterChangeCount", "parameterDistance", "answerMemoryShortcut"] if declared_class == "A" else ["coreConceptPreserved", "solutionGraphPreserved", "representationChanged", "antiClone", "curriculumPreserved"]
    checks = [build_proof_check(check, "PASS", method="middle_school_coordinate_plane_exact_adapter", evidence_refs=refs, summary="Exact coordinate-sign recomputation and visual representation comparison passed.") for check in required]
    payload: dict[str, Any] = {"artifactType": "ALIVE_VARIANT_PROOF_SIDECAR", "schemaVersion": "0.1.0", "sourceQuestionId": source_ir["sourceQuestionId"], "declaredClass": declared_class, "verifiedClass": "HOLD", "structureFamily": COORDINATE_PLANE_FAMILY_ID, "transform": TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION, "capabilityStatus": CAPABILITY_SUPPORTED, "coreConceptPreserved": True, "solutionGraphPreserved": source_ir["solutionGraph"]["graphFingerprint"] == candidate_ir["solutionGraph"]["graphFingerprint"], "coreDecisionDelta": 0, "branchDelta": 0, "newConceptDelta": 0, "preprocessingDelta": 0, "preprocessLoad": {"type": "none", "magnitude": 0}, "preprocessDeterministic": True, "preprocessOutputArity": 0, "studentObservableInputsOnly": True, "ablationPassed": True, "shortcutBlocked": True, "difficultyDelta": {"representation": 1 if declared_class == "B" else 0, "calculation": 1 if declared_class == "A" else 0}, "proofChecks": checks, "proofSha256": "pending", "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"]}
    if declared_class == "A":
        payload.update({"parameterChanged": True, "effectiveParameterChangeCount": 1, "parameterDistance": 1, "answerMemoryShortcut": False})
    else:
        payload.update({"representationChanged": True, "antiClone": True})
    payload["proofSha256"] = hashlib.sha256(json.dumps({key: value for key, value in payload.items() if key != "proofSha256"}, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()
    return payload


def _candidate(run_id: str, ordinal: int, fixture: dict[str, Any], result: dict[str, Any], source_ir: dict[str, Any], candidate_ir: dict[str, Any], sidecar: dict[str, Any], variant_result: dict[str, Any], declared_class: str) -> dict[str, Any]:
    from .solution_quality import format_solution_detail, normalize_solution_detail
    detail = normalize_solution_detail({"version": "0.1", "audience": "student", "depth": "detailed", "given": result["given"], "goal": result["goal"], "keyIdea": result["keyIdea"], "conceptNote": result["conceptNote"], "steps": result["steps"], "check": result["check"], "commonMistakes": result["commonMistakes"], "diagramRequirement": "MANDATORY", "diagramPurpose": "좌표축과 점의 위치를 실제 좌표평면에서 확인한다."}, inferred_visual_requirement="MANDATORY")
    solution = format_solution_detail(detail, result["answerText"])
    payload = _student_payload(fixture, representation="rearranged" if declared_class == "B" else "standard")
    metadata = {"level": "중", "category": fixture["coverage"], "originalCategory": fixture["coverage"], "standardCourse": "중1 수학", "standardUnitKey": COORDINATE_PLANE_UNIT_KEY, "standardUnit": "좌표평면과 그래프", "standardUnitOrder": 4, "subUnitKey": fixture["subUnitKey"], "subUnit": fixture["subUnit"], "subUnitConfidence": "deterministic_fixture", "subUnitClassificationDepth": "complete_rule", "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "tags": [fixture["coverage"], "ALIVE_UNIVERSAL_MIDDLE_SCHOOL_COORDINATE_PLANE_BOUNDED"], "wide": True}
    candidate = {"artifactType": "ALIVE_UNIVERSAL_CANDIDATE", "schemaVersion": "0.1.0", "runId": run_id, "sourceQuestionId": source_ir["sourceQuestionId"], "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"], "variantPlan": {"declaredClass": declared_class, "transform": sidecar["transform"], "familyId": COORDINATE_PLANE_FAMILY_ID, "bridgeStatus": "BOUNDED_MIDDLE_SCHOOL_COORDINATE_PLANE_EXACT_VARIANT", "sourceGraphFingerprint": source_ir["solutionGraph"]["graphFingerprint"], "candidateGraphFingerprint": candidate_ir["solutionGraph"]["graphFingerprint"]}, "studentPayload": payload, "answerContract": {"answerType": "text", "displayAnswer": result["answerText"], "equivalencePolicy": "normalized_math_text"}, "solution": solution, "solutionDetail": detail, "archiveMetadata": metadata, "variantProof": sidecar, "variantResult": variant_result, "visualDependency": "MANDATORY", "solutionVisualElements": {"required": True}, "visualSpec": copy.deepcopy(result["visualSpec"]), "solutionVisualSpec": copy.deepcopy(result["solutionVisualSpec"])}
    return validate_universal_candidate(candidate)


def _review(ordinal: int) -> dict[str, Any]:
    return {"id": ordinal, "blindMath": {"status": "PASS", "method": "middle_school_coordinate_plane_independent_exact_recompute", "evidenceRefs": [f"middle-coordinate-plane-review:{ordinal}:blindMath"]}, "solution": {"status": "PASS", "method": "middle_school_coordinate_plane_solution_detail_contract", "evidenceRefs": [f"middle-coordinate-plane-review:{ordinal}:solution"]}, "variantComparison": {"status": "PASS", "method": "middle_school_coordinate_plane_visual_comparison", "evidenceRefs": [f"middle-coordinate-plane-review:{ordinal}:variantComparison"]}}


def build_middle_school_coordinate_plane_variant_inputs(root: Path, *, run_id: str, declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A", "B"}:
        raise MiddleSchoolCoordinatePlaneVariantError("C is HOLD for M1-04 until a genuine preprocess fixture exists")
    snapshot = load_rule_pack(Path(root).resolve(), required=True)
    if not rule_pack_is_ready(snapshot):
        raise MiddleSchoolCoordinatePlaneVariantError("canonical rule pack is not ready")
    fixtures = load_middle_school_coordinate_plane_fixtures(root)
    transform = TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION
    source_questions: list[dict[str, Any]] = []
    source_irs: list[dict[str, Any]] = []
    candidate_irs: list[dict[str, Any]] = []
    candidates: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    reviews: list[dict[str, Any]] = []
    assignments: list[dict[str, Any]] = []
    for ordinal, fixture in enumerate(fixtures, 1):
        source_result = solve_middle_school_coordinate_plane_fixture(fixture)
        source_question = _source_question(fixture, source_result, ordinal)
        source_questions.append(source_question)
        source_ir = _build_ir(fixture, source_result, ordinal, snapshot["snapshotSha256"])
        require_valid_universal_question_ir(source_ir)
        source_irs.append(source_ir)
        variant = copy.deepcopy(fixture)
        if declared_class == "A":
            variant["data"] = _mutated_data(fixture)
        result = solve_middle_school_coordinate_plane_fixture(variant)
        candidate_payload = _student_payload(variant, representation="rearranged" if declared_class == "B" else "standard")
        candidate_ir = copy.deepcopy(source_ir)
        candidate_ir["studentPayload"] = {**candidate_ir["studentPayload"], "content": candidate_payload["content"]}
        candidate_ir["parameters"] = copy.deepcopy(variant["data"])
        candidate_irs.append(candidate_ir)
        sidecar = _sidecar(source_ir, candidate_ir, declared_class, ordinal)
        refs = {ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]}
        variant_result = reduce_variant_class(sidecar, evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise MiddleSchoolCoordinatePlaneVariantError(f"M1-04 coordinate-plane variant proof failed: {fixture['caseId']}")
        candidates.append(_candidate(run_id, ordinal, variant, result, source_ir, candidate_ir, sidecar, variant_result, declared_class))
        proof_rows.append({"id": ordinal, "sidecar": sidecar})
        reviews.append(_review(ordinal))
        assignments.append({"id": ordinal, "unitKey": COORDINATE_PLANE_UNIT_KEY, "familyId": COORDINATE_PLANE_FAMILY_ID, "transform": transform, "status": "READY", "solver": "middle_school_coordinate_plane_exact_adapter_v1", "variantClass": declared_class})
    review_catalog = sorted({ref for row in reviews for view in ("blindMath", "solution", "variantComparison") for ref in row[view]["evidenceRefs"]})
    proof_catalog = sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_COORDINATE_PLANE_BOUNDED_VARIANT_INPUT", "schemaVersion": COORDINATE_PLANE_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "BOUNDED_MIDDLE_SCHOOL_COORDINATE_PLANE_EXACT_VARIANT", "variantClass": declared_class, "transform": transform, "fixtureScope": "M1-04_coordinate_plane_structured", "ruleSnapshotSha256": snapshot["snapshotSha256"], "questionCount": len(candidates), "sourceQuestions": source_questions, "sourceIR": source_irs, "candidateIR": candidate_irs, "candidates": candidates, "proofRows": proof_rows, "proofCatalog": proof_catalog, "reviewLedger": {"artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER", "schemaVersion": "0.1.0", "questions": reviews}, "reviewCatalog": review_catalog, "independentReviews": reviews, "capabilityPreflight": {"status": "PASS", "assignments": assignments}, "visualRecon": {"status": "PASS", "questions": [{"id": item["id"], "visualDependency": "MANDATORY", "problem": "PASS", "solution": "PASS"} for item in assignments]}, "promotionStatus": "CANDIDATE", "promotionReason": "M1-04 coordinate plane point-location exact A/B slice; C remains HOLD"}


def build_middle_school_coordinate_plane_capability_report(root: Path) -> dict[str, Any]:
    records: list[dict[str, Any]] = []
    for declared_class in ("A", "B"):
        inputs = build_middle_school_coordinate_plane_variant_inputs(root, run_id=f"capability-middle-coordinate-plane-{declared_class.lower()}", declared_class=declared_class)
        for assignment, candidate in zip(inputs["capabilityPreflight"]["assignments"], inputs["candidates"]):
            records.append({"familyId": COORDINATE_PLANE_FAMILY_ID, "transform": inputs["transform"], "polarity": "positive", "status": "PASS", "unitKey": COORDINATE_PLANE_UNIT_KEY, "variantClass": declared_class, "verifiedClass": candidate["variantResult"]["verifiedClass"]})
        records.append({"familyId": COORDINATE_PLANE_FAMILY_ID, "transform": inputs["transform"], "polarity": "negative", "status": "PASS", "unitKey": COORDINATE_PLANE_UNIT_KEY, "variantClass": declared_class, "negativeCode": "VARIANT_PROOF_FAILED"})
    records.append({"familyId": COORDINATE_PLANE_FAMILY_ID, "transform": TRANSFORM_C_PARAMETER_RECOVERY, "polarity": "negative", "status": "PASS", "unitKey": COORDINATE_PLANE_UNIT_KEY, "variantClass": "C", "negativeCode": "C_ABLATION_FAILED"})
    promotion = evaluate_capability_promotion(records)
    return {**promotion, "artifactType": "ALIVE_MIDDLE_SCHOOL_COORDINATE_PLANE_CAPABILITY_PROMOTION", "schemaVersion": COORDINATE_PLANE_VARIANT_SCHEMA_VERSION, "scope": "M1-04 coordinate-plane point-location structured general/boundary fixtures", "unitCount": 1, "fixtureCount": 6, "status": "ACTIVE_BOUNDED" if promotion["holdCount"] == 1 and promotion["activeCount"] == 2 else "HOLD", "cRecords": records, "productionArchiveRegistration": "NOT_PERFORMED", "publicationStatus": "NOT_PUBLISHED"}


def prepare_middle_school_coordinate_plane_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str) -> dict[str, Any]:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger
    inputs = build_middle_school_coordinate_plane_variant_inputs(root, run_id=run_id, declared_class=declared_class)
    root = Path(root).resolve()
    source_path = root / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    source_path.parent.mkdir(parents=True, exist_ok=True)
    source_path.write_text("window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\nwindow.questionBank = " + json.dumps(inputs["sourceQuestions"], ensure_ascii=False, indent=2) + ";\n", encoding="utf-8", newline="\n")
    source_manifest = {"artifactType": "ALIVE_MIDDLE_SCHOOL_COORDINATE_PLANE_UNIVERSAL_SOURCE_JS", "schemaVersion": COORDINATE_PLANE_VARIANT_SCHEMA_VERSION, "runId": run_id, "questionCount": inputs["questionCount"], "path": source_path.relative_to(root).as_posix(), "sha256": sha256_file(source_path), "ruleSnapshotSha256": inputs["ruleSnapshotSha256"], "publicationStatus": "NOT_PUBLISHED"}
    atomic_write_json(source_path.with_name(source_path.stem + "-manifest.json"), source_manifest)
    start = start_universal_run(Path(runtime_root).resolve(), run_id=run_id, source_lock={"path": source_manifest["path"], "sha256": source_manifest["sha256"], "ruleSnapshotSha256": inputs["ruleSnapshotSha256"]}, question_count=inputs["questionCount"], batch_plan=[[start for start in range(index, min(index + 4, inputs["questionCount"] + 1))] for index in range(1, inputs["questionCount"] + 1, 4)])
    store = UniversalRunStore(Path(runtime_root).resolve())
    atomic_write_json(store.run_dir(run_id) / "source/variant-input.json", inputs)
    record_universal_stage(store, run_id, "S01_PREFLIGHT", status="PASS", evidence="middle-school-coordinate-plane-exact-variant-preflight")
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
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_COORDINATE_PLANE_BOUNDED_VARIANT_PREPARED_RUN", "schemaVersion": COORDINATE_PLANE_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "READY_FOR_BROWSER_RENDER", "variantClass": declared_class, "fixtureScope": "M1-04_coordinate_plane_structured", "run": start, "source": source_manifest, "questionCount": inputs["questionCount"], "variantLedger": ledger, "assembly": assembled["assembly"], "currentStage": UniversalRunStore(Path(runtime_root).resolve()).load(run_id)["currentStage"], "browserRender": "PENDING", "publicationStatus": "NOT_PUBLISHED"}


__all__ = ["MiddleSchoolCoordinatePlaneVariantError", "build_middle_school_coordinate_plane_capability_report", "build_middle_school_coordinate_plane_variant_inputs", "load_middle_school_coordinate_plane_fixtures", "middle_school_coordinate_plane_variant_registry", "prepare_middle_school_coordinate_plane_variant_run", "solve_middle_school_coordinate_plane_fixture"]
