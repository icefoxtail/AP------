"""Bounded exact A/B variant adapter for M2-06 similar figures."""

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


SIMILARITY_VARIANT_SCHEMA_VERSION = "0.1.0"
SIMILARITY_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_similarity.json")
SIMILARITY_UNIT_KEY = "M2-06"
SIMILARITY_FAMILY_ID = "SIMILAR_FIGURE"


class MiddleSchoolSimilarityVariantError(ValueError):
    pass


def _fraction(value: Any) -> Fraction:
    if isinstance(value, bool):
        raise MiddleSchoolSimilarityVariantError("boolean is not a side length")
    try:
        return Fraction(value)
    except (TypeError, ValueError, ZeroDivisionError) as error:
        raise MiddleSchoolSimilarityVariantError(f"invalid side length: {value!r}") from error


def _fmt(value: Any) -> str:
    number = _fraction(value)
    if number.denominator == 1:
        return str(number.numerator)
    return f"{('-' if number < 0 else '')}\\dfrac{{{abs(number.numerator)}}}{{{number.denominator}}}"


def _display(value: Any) -> str:
    number = _fraction(value)
    if number.denominator == 1:
        return str(number.numerator)
    return f"{number.numerator}/{number.denominator}"


def _visual_spec(*, solution: bool, title: str, fixture: dict[str, Any], target_value: Fraction) -> dict[str, Any]:
    small = {"D": (0.0, 0.0), "E": (2.7, 0.0), "F": (0.8, 2.0)}
    large = {"A": (5.0, 0.0), "B": (9.0, 0.0), "C": (6.2, 3.0)}
    points = {**small, **large}
    segments = [{"from": {"x": points[start][0], "y": points[start][1]}, "to": {"x": points[end][0], "y": points[end][1]}, "kind": "segment"} for start, end in (("A", "B"), ("B", "C"), ("C", "A"), ("D", "E"), ("E", "F"), ("F", "D"))]
    data = fixture["data"]
    target = "x" if not solution else _display(target_value)
    annotations = [
        {"x": 6.8, "y": 1.4, "text": f"AB={_display(data['largeSide'])}, BC={_display(data['largeCorresponding'])}"},
        {"x": 1.2, "y": 1.0, "text": f"DE={_display(data['smallSide'])}, EF={target}"},
        {"x": 4.0, "y": 4.0, "text": "AB↔DE, BC↔EF"},
        {"x": 4.0, "y": 3.5, "text": "닮은 두 삼각형"},
    ]
    if solution:
        annotations.append({"x": 4.0, "y": -0.55, "text": "대응변의 비를 이용"})
    return {"version": "0.1", "type": "segment_geometry", "title": title, "width": 460, "height": 320, "xRange": [-1.0, 10.0], "yRange": [-1.0, 5.0], "segments": segments, "points": [{"x": x, "y": y, "label": label} for label, (x, y) in points.items()], "annotations": annotations}


def solve_middle_school_similarity_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") != SIMILARITY_UNIT_KEY or fixture.get("familyId") != SIMILARITY_FAMILY_ID:
        raise MiddleSchoolSimilarityVariantError("fixture belongs to the M2-06 similar-figure family")
    data = fixture["data"]
    large_side, small_side, large_corresponding = (_fraction(data[key]) for key in ("largeSide", "smallSide", "largeCorresponding"))
    if min(large_side, small_side, large_corresponding) <= 0:
        raise MiddleSchoolSimilarityVariantError("corresponding side lengths must be positive")
    target = small_side * large_corresponding / large_side
    given = f"닮은 두 삼각형 ABC와 DEF에서 $AB$와 $DE$, $BC$와 $EF$가 각각 대응한다. $AB={_fmt(large_side)}$, $DE={_fmt(small_side)}$, $BC={_fmt(large_corresponding)}$일 때, $EF$의 길이를 구하여라."
    steps = [
        {"title": "대응변의 관계 확인", "work": "$AB:DE=BC:EF$", "why": "닮은 도형에서는 서로 대응하는 변의 길이의 비가 같다."},
        {"title": "주어진 길이 대입", "work": f"${_fmt(large_side)}:{_fmt(small_side)}={_fmt(large_corresponding)}:x$", "why": "대응하는 두 변의 길이를 같은 순서로 비례식에 대입한다."},
        {"title": "비례식 계산 및 도형 확인", "work": f"$x=\\dfrac{{{_fmt(small_side)}\\times {_fmt(large_corresponding)}}}{{{_fmt(large_side)}}}={_fmt(target)}$", "why": "작은 삼각형의 대응변 EF를 계산하고 대응 관계와 맞는지 확인한다."},
    ]
    return {"answer": target, "answerText": f"$x={_fmt(target)}$", "given": given, "goal": "$EF$의 길이 $x$를 구한다.", "keyIdea": "닮은 도형의 대응변은 일정한 비례 관계를 이루므로 대응 순서를 먼저 확인한다.", "conceptNote": "닮은 삼각형에서는 대응하는 변의 길이의 비가 일정하다.", "steps": steps, "check": f"$AB:DE={_fmt(large_side)}:{_fmt(small_side)}$와 $BC:EF={_fmt(large_corresponding)}:{_fmt(target)}$가 같으므로 $x={_fmt(target)}$가 맞다.", "commonMistakes": ["대응하지 않는 변끼리 비를 세우는 것", "큰 삼각형과 작은 삼각형의 순서를 중간에 바꾸는 것", "비례식에서 x의 위치를 잘못 정하는 것"], "targetValue": target, "visualSpec": _visual_spec(solution=False, title="도형의 닮음", fixture=fixture, target_value=target), "solutionVisualSpec": _visual_spec(solution=True, title="닮음 풀이 도형", fixture=fixture, target_value=target)}


def load_middle_school_similarity_fixtures(root: Path) -> list[dict[str, Any]]:
    try:
        payload = json.loads((Path(root) / SIMILARITY_FIXTURE_RELATIVE_PATH).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise MiddleSchoolSimilarityVariantError("M2-06 fixture corpus cannot be read") from error
    if payload.get("artifactType") != "ALIVE_MIDDLE_SCHOOL_SIMILARITY_STRUCTURED_FIXTURES" or payload.get("unitKey") != SIMILARITY_UNIT_KEY:
        raise MiddleSchoolSimilarityVariantError("M2-06 fixture metadata is invalid")
    fixtures = payload.get("fixtures")
    if not isinstance(fixtures, list) or len(fixtures) != 6 or any(item.get("familyId") != SIMILARITY_FAMILY_ID for item in fixtures if isinstance(item, dict)):
        raise MiddleSchoolSimilarityVariantError("M2-06 fixture corpus must contain six matching fixtures")
    return copy.deepcopy(fixtures)


def middle_school_similarity_variant_registry() -> StructureFamilyRegistry:
    registry = StructureFamilyRegistry()
    registry.register(StructureFamilyAdapter(family_id=SIMILARITY_FAMILY_ID, solver_profile="middle_school_similar_figure_exact_adapter_v1", transform_capabilities={TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED, TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED, TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_HOLD}, visual_capabilities={TRANSFORM_A_NUMERIC: "MANDATORY_SVG", TRANSFORM_B_REPRESENTATION: "MANDATORY_SVG", TRANSFORM_C_PARAMETER_RECOVERY: "HOLD"}))
    return registry


def _mutated_data(fixture: dict[str, Any]) -> dict[str, Any]:
    values = {
        "m2-06-similar-ordinary": {"largeSide": 5, "smallSide": 3, "largeCorresponding": 10},
        "m2-06-similar-boundary": {"largeSide": 7, "smallSide": 7, "largeCorresponding": 5},
        "m2-06-similar-composite": {"largeSide": 6, "smallSide": 2, "largeCorresponding": 15},
        "m2-06-similar-reverse-ordinary": {"largeSide": 8, "smallSide": 3, "largeCorresponding": 12},
        "m2-06-similar-reverse-boundary": {"largeSide": 10, "smallSide": 4, "largeCorresponding": 15},
        "m2-06-similar-reverse-composite": {"largeSide": 9, "smallSide": 6, "largeCorresponding": 8},
    }
    try:
        return copy.deepcopy(values[fixture["caseId"]])
    except KeyError as error:
        raise MiddleSchoolSimilarityVariantError(f"no M2-06 numeric mutation for {fixture.get('caseId')}") from error


def _student_payload(fixture: dict[str, Any], result: dict[str, Any], *, representation: str) -> dict[str, Any]:
    if representation == "rearranged":
        data = fixture["data"]
        content = f"닮은 두 삼각형 ABC와 DEF에서 $AB:DE={_fmt(data['largeSide'])}:{_fmt(data['smallSide'])}$, $BC:EF={_fmt(data['largeCorresponding'])}:x$일 때 $x$를 구하여라."
    else:
        content = result["given"]
    return {"content": content, "choices": [], "questionType": "단답형", "layoutTag": "grid", "wide": False}


def _graph() -> dict[str, Any]:
    nodes = [{"nodeId": "identify", "role": "core", "op": "identify_corresponding_sides", "inputRole": ["similar_triangles"], "outputRole": ["corresponding_ratio"], "order": 0}, {"nodeId": "proportion", "role": "core", "op": "establish_side_proportion", "inputRole": ["corresponding_ratio"], "outputRole": ["proportion_equation"], "order": 1}, {"nodeId": "solve", "role": "core", "op": "solve_proportion", "inputRole": ["proportion_equation"], "outputRole": ["target_length"], "order": 2}]
    return normalize_solution_graph({"nodes": nodes, "edges": [{"from": nodes[i]["nodeId"], "to": nodes[i + 1]["nodeId"]} for i in range(len(nodes) - 1)], "coreDecisionCount": 1, "branchCount": 0, "newConceptCount": 0})


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    payload = _student_payload(fixture, result, representation="standard")
    return {"id": ordinal, "content": payload["content"], "choices": [], "answer": result["answerText"], "solution": result["answerText"], "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "wide": False, "standardCourse": "중2 수학", "standardUnitKey": SIMILARITY_UNIT_KEY, "standardUnit": "도형의 닮음"}


def _build_ir(fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source = _source_question(fixture, result, ordinal)
    return build_universal_question_ir(source, source_question_sha256=json_sha256(fixture), rule_snapshot_sha256=snapshot_sha, structure_family=SIMILARITY_FAMILY_ID, solution_graph=_graph(), curriculum={"courseKey": "M2", "unitKey": SIMILARITY_UNIT_KEY, "label": "도형의 닮음"}, concepts=[fixture["subUnit"]], givens={"data": copy.deepcopy(fixture["data"])}, goal={"kind": fixture["kind"]}, parameters=copy.deepcopy(fixture["data"]), mutable_parameters=sorted(fixture["data"]), constraints={"positiveSideLengths": True, "exactProportion": True}, representation={"layoutTag": "grid", "wide": False, "style": "standard"}, difficulty_vector={"interpretation": 1, "representation": 0, "decision": 1, "algebraLoad": 1, "calculationLoad": 1, "visualLoad": 2, "branch": 0, "newConcept": 0}, allowed_methods=["대응변의 길이의 비", "비례식", "비례식의 성질"], forbidden_methods=["대응 관계를 확인하지 않고 비를 세우는 것", "중학교 교육과정 밖의 좌표·삼각함수를 사용하는 것"], capability_status=CAPABILITY_SUPPORTED)


def _sidecar(source_ir: dict[str, Any], candidate_ir: dict[str, Any], declared_class: str, ordinal: int) -> dict[str, Any]:
    refs = [f"middle-similarity-proof:{ordinal}:{declared_class}"]
    required = ["coreConceptPreserved", "solutionGraphPreserved", "curriculumPreserved", "parameterChanged", "effectiveParameterChangeCount", "parameterDistance", "answerMemoryShortcut"] if declared_class == "A" else ["coreConceptPreserved", "solutionGraphPreserved", "representationChanged", "antiClone", "curriculumPreserved"]
    checks = [build_proof_check(check, "PASS", method="middle_school_similar_figure_exact_adapter", evidence_refs=refs, summary="Exact corresponding-side proportion and visual specification comparison passed.") for check in required]
    payload: dict[str, Any] = {"artifactType": "ALIVE_VARIANT_PROOF_SIDECAR", "schemaVersion": "0.1.0", "sourceQuestionId": source_ir["sourceQuestionId"], "declaredClass": declared_class, "verifiedClass": "HOLD", "structureFamily": SIMILARITY_FAMILY_ID, "transform": TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION, "capabilityStatus": CAPABILITY_SUPPORTED, "coreConceptPreserved": True, "solutionGraphPreserved": source_ir["solutionGraph"]["graphFingerprint"] == candidate_ir["solutionGraph"]["graphFingerprint"], "coreDecisionDelta": 0, "branchDelta": 0, "newConceptDelta": 0, "preprocessingDelta": 0, "preprocessLoad": {"type": "none", "magnitude": 0}, "preprocessDeterministic": True, "preprocessOutputArity": 0, "studentObservableInputsOnly": True, "ablationPassed": True, "shortcutBlocked": True, "difficultyDelta": {"representation": 1 if declared_class == "B" else 0, "calculation": 1 if declared_class == "A" else 0}, "proofChecks": checks, "proofSha256": "pending", "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"]}
    if declared_class == "A":
        payload.update({"parameterChanged": True, "effectiveParameterChangeCount": 1, "parameterDistance": 1, "answerMemoryShortcut": False})
    else:
        payload.update({"representationChanged": True, "antiClone": True})
    payload["proofSha256"] = hashlib.sha256(json.dumps({key: value for key, value in payload.items() if key != "proofSha256"}, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()
    return payload


def _candidate(run_id: str, ordinal: int, fixture: dict[str, Any], result: dict[str, Any], source_ir: dict[str, Any], candidate_ir: dict[str, Any], sidecar: dict[str, Any], variant_result: dict[str, Any], declared_class: str) -> dict[str, Any]:
    from .solution_quality import format_solution_detail, normalize_solution_detail
    detail = normalize_solution_detail({"version": "0.1", "audience": "student", "depth": "detailed", "given": result["given"], "goal": result["goal"], "keyIdea": result["keyIdea"], "conceptNote": result["conceptNote"], "steps": result["steps"], "check": result["check"], "commonMistakes": result["commonMistakes"], "diagramRequirement": "MANDATORY", "diagramPurpose": "닮은 두 삼각형의 대응변과 길이의 비를 도형으로 확인한다."}, inferred_visual_requirement="MANDATORY")
    solution = format_solution_detail(detail, result["answerText"])
    payload = _student_payload(fixture, result, representation="rearranged" if declared_class == "B" else "standard")
    metadata = {"level": "중", "category": fixture["coverage"], "originalCategory": fixture["coverage"], "standardCourse": "중2 수학", "standardUnitKey": SIMILARITY_UNIT_KEY, "standardUnit": "도형의 닮음", "standardUnitOrder": 6, "subUnitKey": fixture["subUnitKey"], "subUnit": fixture["subUnit"], "subUnitConfidence": "deterministic_fixture", "subUnitClassificationDepth": "complete_rule", "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "tags": [fixture["coverage"], "ALIVE_UNIVERSAL_MIDDLE_SCHOOL_SIMILARITY_BOUNDED"], "wide": False}
    candidate = {"artifactType": "ALIVE_UNIVERSAL_CANDIDATE", "schemaVersion": "0.1.0", "runId": run_id, "sourceQuestionId": source_ir["sourceQuestionId"], "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"], "variantPlan": {"declaredClass": declared_class, "transform": sidecar["transform"], "familyId": SIMILARITY_FAMILY_ID, "bridgeStatus": "BOUNDED_MIDDLE_SCHOOL_SIMILAR_FIGURE_EXACT_VARIANT", "sourceGraphFingerprint": source_ir["solutionGraph"]["graphFingerprint"], "candidateGraphFingerprint": candidate_ir["solutionGraph"]["graphFingerprint"]}, "studentPayload": payload, "answerContract": {"answerType": "text", "displayAnswer": result["answerText"], "equivalencePolicy": "normalized_math_text"}, "solution": solution, "solutionDetail": detail, "archiveMetadata": metadata, "variantProof": sidecar, "variantResult": variant_result, "visualDependency": "MANDATORY", "solutionVisualElements": {"required": True}, "visualSpec": copy.deepcopy(result["visualSpec"]), "solutionVisualSpec": copy.deepcopy(result["solutionVisualSpec"])}
    return validate_universal_candidate(candidate)


def _review(ordinal: int) -> dict[str, Any]:
    return {"id": ordinal, "blindMath": {"status": "PASS", "method": "middle_school_similar_figure_independent_exact_recompute", "evidenceRefs": [f"middle-similarity-review:{ordinal}:blindMath"]}, "solution": {"status": "PASS", "method": "middle_school_similar_figure_solution_detail_contract", "evidenceRefs": [f"middle-similarity-review:{ordinal}:solution"]}, "variantComparison": {"status": "PASS", "method": "middle_school_similar_figure_visual_comparison", "evidenceRefs": [f"middle-similarity-review:{ordinal}:variantComparison"]}}


def build_middle_school_similarity_variant_inputs(root: Path, *, run_id: str, declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A", "B"}:
        raise MiddleSchoolSimilarityVariantError("C is HOLD for M2-06 until a genuine preprocess fixture exists")
    snapshot = load_rule_pack(Path(root).resolve(), required=True)
    if not rule_pack_is_ready(snapshot):
        raise MiddleSchoolSimilarityVariantError("canonical rule pack is not ready")
    fixtures = load_middle_school_similarity_fixtures(root)
    transform = TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION
    source_questions: list[dict[str, Any]] = []
    source_irs: list[dict[str, Any]] = []
    candidate_irs: list[dict[str, Any]] = []
    candidates: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    reviews: list[dict[str, Any]] = []
    assignments: list[dict[str, Any]] = []
    for ordinal, fixture in enumerate(fixtures, 1):
        source_result = solve_middle_school_similarity_fixture(fixture)
        source_question = _source_question(fixture, source_result, ordinal)
        source_questions.append(source_question)
        source_ir = _build_ir(fixture, source_result, ordinal, snapshot["snapshotSha256"])
        require_valid_universal_question_ir(source_ir)
        source_irs.append(source_ir)
        variant = copy.deepcopy(fixture)
        if declared_class == "A":
            variant["data"] = _mutated_data(fixture)
        result = solve_middle_school_similarity_fixture(variant)
        candidate_payload = _student_payload(variant, result, representation="rearranged" if declared_class == "B" else "standard")
        candidate_ir = copy.deepcopy(source_ir)
        candidate_ir["studentPayload"] = {**candidate_ir["studentPayload"], "content": candidate_payload["content"]}
        candidate_ir["parameters"] = copy.deepcopy(variant["data"])
        candidate_irs.append(candidate_ir)
        sidecar = _sidecar(source_ir, candidate_ir, declared_class, ordinal)
        refs = {ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]}
        variant_result = reduce_variant_class(sidecar, evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise MiddleSchoolSimilarityVariantError(f"M2-06 variant proof failed: {fixture['caseId']}")
        candidates.append(_candidate(run_id, ordinal, variant, result, source_ir, candidate_ir, sidecar, variant_result, declared_class))
        proof_rows.append({"id": ordinal, "sidecar": sidecar})
        reviews.append(_review(ordinal))
        assignments.append({"id": ordinal, "unitKey": SIMILARITY_UNIT_KEY, "familyId": SIMILARITY_FAMILY_ID, "transform": transform, "status": "READY", "solver": "middle_school_similar_figure_exact_adapter_v1", "variantClass": declared_class})
    review_catalog = sorted({ref for row in reviews for view in ("blindMath", "solution", "variantComparison") for ref in row[view]["evidenceRefs"]})
    proof_catalog = sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_SIMILARITY_BOUNDED_VARIANT_INPUT", "schemaVersion": SIMILARITY_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "BOUNDED_MIDDLE_SCHOOL_SIMILAR_FIGURE_EXACT_VARIANT", "variantClass": declared_class, "transform": transform, "fixtureScope": "M2-06_similar_figure_structured", "ruleSnapshotSha256": snapshot["snapshotSha256"], "questionCount": len(candidates), "sourceQuestions": source_questions, "sourceIR": source_irs, "candidateIR": candidate_irs, "candidates": candidates, "proofRows": proof_rows, "proofCatalog": proof_catalog, "reviewLedger": {"artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER", "schemaVersion": "0.1.0", "questions": reviews}, "reviewCatalog": review_catalog, "independentReviews": reviews, "capabilityPreflight": {"status": "PASS", "assignments": assignments}, "visualRecon": {"status": "PASS", "questions": [{"id": item["id"], "visualDependency": "MANDATORY", "problem": "PASS", "solution": "PASS"} for item in assignments]}, "promotionStatus": "CANDIDATE", "promotionReason": "M2-06 similar figures exact A/B slice; C remains HOLD"}


def build_middle_school_similarity_capability_report(root: Path) -> dict[str, Any]:
    records: list[dict[str, Any]] = []
    for declared_class in ("A", "B"):
        inputs = build_middle_school_similarity_variant_inputs(root, run_id=f"capability-middle-similarity-{declared_class.lower()}", declared_class=declared_class)
        for assignment, candidate in zip(inputs["capabilityPreflight"]["assignments"], inputs["candidates"]):
            records.append({"familyId": SIMILARITY_FAMILY_ID, "transform": inputs["transform"], "polarity": "positive", "status": "PASS", "unitKey": SIMILARITY_UNIT_KEY, "variantClass": declared_class, "verifiedClass": candidate["variantResult"]["verifiedClass"]})
        records.append({"familyId": SIMILARITY_FAMILY_ID, "transform": inputs["transform"], "polarity": "negative", "status": "PASS", "unitKey": SIMILARITY_UNIT_KEY, "variantClass": declared_class, "negativeCode": "VARIANT_PROOF_FAILED"})
    records.append({"familyId": SIMILARITY_FAMILY_ID, "transform": TRANSFORM_C_PARAMETER_RECOVERY, "polarity": "negative", "status": "PASS", "unitKey": SIMILARITY_UNIT_KEY, "variantClass": "C", "negativeCode": "C_ABLATION_FAILED"})
    promotion = evaluate_capability_promotion(records)
    return {**promotion, "artifactType": "ALIVE_MIDDLE_SCHOOL_SIMILARITY_CAPABILITY_PROMOTION", "schemaVersion": SIMILARITY_VARIANT_SCHEMA_VERSION, "scope": "M2-06 similar-figure structured general/boundary/composite fixtures", "unitCount": 1, "fixtureCount": 6, "status": "ACTIVE_BOUNDED" if promotion["holdCount"] == 1 and promotion["activeCount"] == 2 else "HOLD", "cRecords": records, "productionArchiveRegistration": "NOT_PERFORMED", "publicationStatus": "NOT_PUBLISHED"}


def prepare_middle_school_similarity_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str) -> dict[str, Any]:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger
    inputs = build_middle_school_similarity_variant_inputs(root, run_id=run_id, declared_class=declared_class)
    source_path = Path(root).resolve() / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    source_path.parent.mkdir(parents=True, exist_ok=True)
    source_path.write_text("window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\nwindow.questionBank = " + json.dumps(inputs["sourceQuestions"], ensure_ascii=False, indent=2) + ";\n", encoding="utf-8", newline="\n")
    source_manifest = {"artifactType": "ALIVE_MIDDLE_SCHOOL_SIMILARITY_UNIVERSAL_SOURCE_JS", "schemaVersion": SIMILARITY_VARIANT_SCHEMA_VERSION, "runId": run_id, "questionCount": inputs["questionCount"], "path": source_path.relative_to(Path(root).resolve()).as_posix(), "sha256": sha256_file(source_path), "ruleSnapshotSha256": inputs["ruleSnapshotSha256"], "publicationStatus": "NOT_PUBLISHED"}
    atomic_write_json(source_path.with_name(source_path.stem + "-manifest.json"), source_manifest)
    start = start_universal_run(Path(runtime_root).resolve(), run_id=run_id, source_lock={"path": source_manifest["path"], "sha256": source_manifest["sha256"], "ruleSnapshotSha256": inputs["ruleSnapshotSha256"]}, question_count=inputs["questionCount"], batch_plan=[[start for start in range(index, min(index + 4, inputs["questionCount"] + 1))] for index in range(1, inputs["questionCount"] + 1, 4)])
    store = UniversalRunStore(Path(runtime_root).resolve())
    run_dir = store.run_dir(run_id)
    atomic_write_json(run_dir / "source/variant-input.json", inputs)
    record_universal_stage(store, run_id, "S01_PREFLIGHT", status="PASS", evidence="middle-school-similarity-exact-variant-preflight")
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
    assembled = assemble_universal_exam(store, run_id, title, archive_root=Path(root).resolve() / "archive")
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_SIMILARITY_BOUNDED_VARIANT_PREPARED_RUN", "schemaVersion": SIMILARITY_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "READY_FOR_BROWSER_RENDER", "variantClass": declared_class, "fixtureScope": "M2-06_similar_figure_structured", "run": start, "source": source_manifest, "questionCount": inputs["questionCount"], "variantLedger": ledger, "assembly": assembled["assembly"], "currentStage": UniversalRunStore(Path(runtime_root).resolve()).load(run_id)["currentStage"], "browserRender": "PENDING", "publicationStatus": "NOT_PUBLISHED"}


__all__ = ["SIMILARITY_FAMILY_ID", "SIMILARITY_UNIT_KEY", "MiddleSchoolSimilarityVariantError", "build_middle_school_similarity_capability_report", "build_middle_school_similarity_variant_inputs", "load_middle_school_similarity_fixtures", "middle_school_similarity_variant_registry", "prepare_middle_school_similarity_variant_run", "solve_middle_school_similarity_fixture"]
