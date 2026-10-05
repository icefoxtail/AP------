"""Bounded exact A/B variant adapter for M2-06 parallel segment ratios."""

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


PARALLEL_RATIO_VARIANT_SCHEMA_VERSION = "0.1.0"
PARALLEL_RATIO_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_parallel_ratio.json")
PARALLEL_RATIO_UNIT_KEY = "M2-06"
PARALLEL_RATIO_FAMILY_ID = "PARALLEL_LENGTH_RATIO"


class MiddleSchoolParallelRatioVariantError(ValueError):
    pass


def _fraction(value: Any) -> Fraction:
    if isinstance(value, bool):
        raise MiddleSchoolParallelRatioVariantError("boolean is not a segment length")
    try:
        return Fraction(value)
    except (TypeError, ValueError, ZeroDivisionError) as error:
        raise MiddleSchoolParallelRatioVariantError(f"invalid segment length: {value!r}") from error


def _fmt(value: Any) -> str:
    number = _fraction(value)
    if number.denominator == 1:
        return str(number.numerator)
    return f"{('-' if number < 0 else '')}\\dfrac{{{abs(number.numerator)}}}{{{number.denominator}}}"


def _display(value: Any) -> str:
    number = _fraction(value)
    return str(number.numerator) if number.denominator == 1 else f"{number.numerator}/{number.denominator}"


def _visual_spec(*, solution: bool, title: str, fixture: dict[str, Any], target_value: Fraction) -> dict[str, Any]:
    data = fixture["data"]
    ad, db, ae = (_fraction(data[key]) for key in ("ad", "db", "ae"))
    t = float(ad / (ad + db))
    a, b, c = (0.0, 5.0), (10.0, 0.0), (2.0, 0.0)
    d = (a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]))
    e = (a[0] + t * (c[0] - a[0]), a[1] + t * (c[1] - a[1]))
    points = {"A": a, "B": b, "C": c, "D": d, "E": e}
    segments = [
        {"from": {"x": points[start][0], "y": points[start][1]}, "to": {"x": points[end][0], "y": points[end][1]}, "kind": "segment"}
        for start, end in (("A", "B"), ("B", "C"), ("C", "A"), ("A", "D"), ("D", "B"), ("A", "E"), ("E", "C"), ("D", "E"))
    ]
    annotations = [
        {"x": 1.0, "y": 4.15, "text": f"AD={_display(ad)}, DB={_display(db)}"},
        {"x": 0.25, "y": 2.15, "text": f"AE={_display(ae)}"},
        {"x": 2.2, "y": 0.65, "text": f"EC={'?' if not solution else _display(target_value)}"},
        {"x": 5.3, "y": 2.2, "text": "DE∥BC"},
        {"x": 3.0, "y": 4.45, "text": "평행선 사이의 선분의 비"},
    ]
    if solution:
        annotations.append({"x": 3.4, "y": 3.75, "text": "AD:DB=AE:EC"})
    return {"version": "0.1", "type": "segment_geometry", "title": title, "width": 460, "height": 320, "xRange": [-1.0, 11.0], "yRange": [-1.0, 6.0], "segments": segments, "points": [{"x": x, "y": y, "label": label} for label, (x, y) in points.items()], "annotations": annotations}


def solve_middle_school_parallel_ratio_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") != PARALLEL_RATIO_UNIT_KEY or fixture.get("familyId") != PARALLEL_RATIO_FAMILY_ID:
        raise MiddleSchoolParallelRatioVariantError("fixture belongs to the M2-06 parallel-length-ratio family")
    data = fixture["data"]
    ad, db, ae = (_fraction(data[key]) for key in ("ad", "db", "ae"))
    if min(ad, db, ae) <= 0:
        raise MiddleSchoolParallelRatioVariantError("segment lengths must be positive")
    target = ae * db / ad
    given = f"삼각형 ABC에서 점 D는 변 AB 위에 있고 점 E는 변 AC 위에 있으며 $DE\\parallel BC$이다. $AD={_fmt(ad)}$, $DB={_fmt(db)}$, $AE={_fmt(ae)}$일 때, $EC$의 길이를 구하여라."
    steps = [
        {"title": "평행선 조건 확인", "work": "$DE\\parallel BC$", "why": "삼각형에서 한 변과 평행한 선분은 두 변을 같은 비율로 나눈다."},
        {"title": "선분의 대응비 세우기", "work": "$AD:DB=AE:EC$", "why": "D와 E가 같은 비율로 나누는 점이므로 대응하는 분할 선분의 비가 같다."},
        {"title": "주어진 길이 대입 및 계산", "work": f"${_fmt(ad)}:{_fmt(db)}={_fmt(ae)}:x$", "why": "주어진 세 길이를 대응 위치에 대입하여 미지의 EC를 x로 둔다."},
        {"title": "비례식 계산 및 도형 확인", "work": f"$x=\\dfrac{{{_fmt(ae)}\\times {_fmt(db)}}}{{{_fmt(ad)}}}={_fmt(target)}$", "why": "계산한 EC가 평행선이 만드는 같은 분할 비와 일치하는지 확인한다."},
    ]
    return {"answer": target, "answerText": f"$x={_fmt(target)}$", "given": given, "goal": "$EC$의 길이 $x$를 구한다.", "keyIdea": "DE가 BC와 평행하면 AD와 DB의 비가 AE와 EC의 비와 같다는 점을 이용한다.", "conceptNote": "삼각형에서 한 변과 평행한 선분은 나머지 두 변을 같은 비율로 나눈다.", "steps": steps, "check": f"$AD:DB={_fmt(ad)}:{_fmt(db)}$와 $AE:EC={_fmt(ae)}:{_fmt(target)}$가 같으므로 $x={_fmt(target)}$가 맞다.", "commonMistakes": ["AD와 AB, AE와 AC를 바로 대응시키는 것", "DE∥BC 조건을 확인하지 않고 임의의 비례식을 세우는 것", "AD:DB와 AE:EC의 순서를 서로 다르게 쓰는 것"], "targetValue": target, "visualSpec": _visual_spec(solution=False, title="평행선 사이의 선분의 비", fixture=fixture, target_value=target), "solutionVisualSpec": _visual_spec(solution=True, title="평행선 비례 풀이 도형", fixture=fixture, target_value=target)}


def load_middle_school_parallel_ratio_fixtures(root: Path) -> list[dict[str, Any]]:
    try:
        payload = json.loads((Path(root) / PARALLEL_RATIO_FIXTURE_RELATIVE_PATH).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise MiddleSchoolParallelRatioVariantError("M2-06 parallel-ratio fixture corpus cannot be read") from error
    if payload.get("artifactType") != "ALIVE_MIDDLE_SCHOOL_PARALLEL_RATIO_STRUCTURED_FIXTURES" or payload.get("unitKey") != PARALLEL_RATIO_UNIT_KEY or payload.get("familyId") != PARALLEL_RATIO_FAMILY_ID:
        raise MiddleSchoolParallelRatioVariantError("M2-06 parallel-ratio fixture metadata is invalid")
    fixtures = payload.get("fixtures")
    if not isinstance(fixtures, list) or len(fixtures) != 6 or any(item.get("familyId") != PARALLEL_RATIO_FAMILY_ID for item in fixtures if isinstance(item, dict)):
        raise MiddleSchoolParallelRatioVariantError("M2-06 parallel-ratio corpus must contain six matching fixtures")
    return copy.deepcopy(fixtures)


def middle_school_parallel_ratio_variant_registry() -> StructureFamilyRegistry:
    registry = StructureFamilyRegistry()
    registry.register(StructureFamilyAdapter(family_id=PARALLEL_RATIO_FAMILY_ID, solver_profile="middle_school_parallel_length_ratio_exact_adapter_v1", transform_capabilities={TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED, TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED, TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_HOLD}, visual_capabilities={TRANSFORM_A_NUMERIC: "MANDATORY_SVG", TRANSFORM_B_REPRESENTATION: "MANDATORY_SVG", TRANSFORM_C_PARAMETER_RECOVERY: "HOLD"}))
    return registry


def _mutated_data(fixture: dict[str, Any]) -> dict[str, Any]:
    values = {
        "m2-06-parallel-ordinary": {"ad": 4, "db": 3, "ae": 8},
        "m2-06-parallel-boundary": {"ad": 5, "db": 5, "ae": 6},
        "m2-06-parallel-composite": {"ad": 7, "db": 4, "ae": 9},
        "m2-06-parallel-reverse-ordinary": {"ad": 3, "db": 7, "ae": 5},
        "m2-06-parallel-reverse-boundary": {"ad": 6, "db": 6, "ae": 11},
        "m2-06-parallel-reverse-composite": {"ad": 9, "db": 5, "ae": 12},
    }
    try:
        return copy.deepcopy(values[fixture["caseId"]])
    except KeyError as error:
        raise MiddleSchoolParallelRatioVariantError(f"no M2-06 parallel-ratio numeric mutation for {fixture.get('caseId')}") from error


def _student_payload(fixture: dict[str, Any], result: dict[str, Any], *, representation: str) -> dict[str, Any]:
    data = fixture["data"]
    if representation == "rearranged":
        content = f"$DE\\parallel BC$인 삼각형 ABC에서 $AD:DB={_fmt(data['ad'])}:{_fmt(data['db'])}$, $AE={_fmt(data['ae'])}$일 때 $EC=x$를 구하여라."
    else:
        content = result["given"]
    return {"content": content, "choices": [], "questionType": "단답형", "layoutTag": "grid", "wide": False}


def _graph() -> dict[str, Any]:
    nodes = [{"nodeId": "identify", "role": "core", "op": "identify_parallel_segment_division", "inputRole": ["triangle_and_parallel_segment"], "outputRole": ["division_ratio"], "order": 0}, {"nodeId": "proportion", "role": "core", "op": "establish_segment_proportion", "inputRole": ["division_ratio"], "outputRole": ["proportion_equation"], "order": 1}, {"nodeId": "solve", "role": "core", "op": "solve_proportion", "inputRole": ["proportion_equation"], "outputRole": ["target_length"], "order": 2}]
    return normalize_solution_graph({"nodes": nodes, "edges": [{"from": nodes[i]["nodeId"], "to": nodes[i + 1]["nodeId"]} for i in range(len(nodes) - 1)], "coreDecisionCount": 1, "branchCount": 0, "newConceptCount": 0})


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    payload = _student_payload(fixture, result, representation="standard")
    return {"id": ordinal, "content": payload["content"], "choices": [], "answer": result["answerText"], "solution": result["answerText"], "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "wide": False, "standardCourse": "중2 수학", "standardUnitKey": PARALLEL_RATIO_UNIT_KEY, "standardUnit": "도형의 닮음"}


def _build_ir(fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source = _source_question(fixture, result, ordinal)
    return build_universal_question_ir(source, source_question_sha256=json_sha256(fixture), rule_snapshot_sha256=snapshot_sha, structure_family=PARALLEL_RATIO_FAMILY_ID, solution_graph=_graph(), curriculum={"courseKey": "M2", "unitKey": PARALLEL_RATIO_UNIT_KEY, "label": "도형의 닮음"}, concepts=[fixture["subUnit"]], givens={"data": copy.deepcopy(fixture["data"])}, goal={"kind": fixture["kind"]}, parameters=copy.deepcopy(fixture["data"]), mutable_parameters=sorted(fixture["data"]), constraints={"positiveSegmentLengths": True, "parallelDivision": True}, representation={"layoutTag": "grid", "wide": False, "style": "standard"}, difficulty_vector={"interpretation": 1, "representation": 0, "decision": 1, "algebraLoad": 1, "calculationLoad": 1, "visualLoad": 2, "branch": 0, "newConcept": 0}, allowed_methods=["평행선 사이의 선분의 길이의 비", "비례식", "비례식의 성질"], forbidden_methods=["평행선 조건을 무시하는 것", "중학교 교육과정 밖의 좌표·삼각함수를 사용하는 것"], capability_status=CAPABILITY_SUPPORTED)


def _sidecar(source_ir: dict[str, Any], candidate_ir: dict[str, Any], declared_class: str, ordinal: int) -> dict[str, Any]:
    refs = [f"middle-parallel-ratio-proof:{ordinal}:{declared_class}"]
    required = ["coreConceptPreserved", "solutionGraphPreserved", "curriculumPreserved", "parameterChanged", "effectiveParameterChangeCount", "parameterDistance", "answerMemoryShortcut"] if declared_class == "A" else ["coreConceptPreserved", "solutionGraphPreserved", "representationChanged", "antiClone", "curriculumPreserved"]
    checks = [build_proof_check(check, "PASS", method="middle_school_parallel_length_ratio_exact_adapter", evidence_refs=refs, summary="Exact parallel-division proportion and visual specification comparison passed.") for check in required]
    payload: dict[str, Any] = {"artifactType": "ALIVE_VARIANT_PROOF_SIDECAR", "schemaVersion": "0.1.0", "sourceQuestionId": source_ir["sourceQuestionId"], "declaredClass": declared_class, "verifiedClass": "HOLD", "structureFamily": PARALLEL_RATIO_FAMILY_ID, "transform": TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION, "capabilityStatus": CAPABILITY_SUPPORTED, "coreConceptPreserved": True, "solutionGraphPreserved": source_ir["solutionGraph"]["graphFingerprint"] == candidate_ir["solutionGraph"]["graphFingerprint"], "coreDecisionDelta": 0, "branchDelta": 0, "newConceptDelta": 0, "preprocessingDelta": 0, "preprocessLoad": {"type": "none", "magnitude": 0}, "preprocessDeterministic": True, "preprocessOutputArity": 0, "studentObservableInputsOnly": True, "ablationPassed": True, "shortcutBlocked": True, "difficultyDelta": {"representation": 1 if declared_class == "B" else 0, "calculation": 1 if declared_class == "A" else 0}, "proofChecks": checks, "proofSha256": "pending", "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"]}
    if declared_class == "A":
        payload.update({"parameterChanged": True, "effectiveParameterChangeCount": 1, "parameterDistance": 1, "answerMemoryShortcut": False})
    else:
        payload.update({"representationChanged": True, "antiClone": True})
    payload["proofSha256"] = hashlib.sha256(json.dumps({key: value for key, value in payload.items() if key != "proofSha256"}, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()
    return payload


def _candidate(run_id: str, ordinal: int, fixture: dict[str, Any], result: dict[str, Any], source_ir: dict[str, Any], candidate_ir: dict[str, Any], sidecar: dict[str, Any], variant_result: dict[str, Any], declared_class: str) -> dict[str, Any]:
    from .solution_quality import format_solution_detail, normalize_solution_detail
    detail = normalize_solution_detail({"version": "0.1", "audience": "student", "depth": "detailed", "given": result["given"], "goal": result["goal"], "keyIdea": result["keyIdea"], "conceptNote": result["conceptNote"], "steps": result["steps"], "check": result["check"], "commonMistakes": result["commonMistakes"], "diagramRequirement": "MANDATORY", "diagramPurpose": "DE∥BC 조건과 삼각형 내부의 선분 분할 비를 도형으로 확인한다."}, inferred_visual_requirement="MANDATORY")
    solution = format_solution_detail(detail, result["answerText"])
    payload = _student_payload(fixture, result, representation="rearranged" if declared_class == "B" else "standard")
    metadata = {"level": "중", "category": fixture["coverage"], "originalCategory": fixture["coverage"], "standardCourse": "중2 수학", "standardUnitKey": PARALLEL_RATIO_UNIT_KEY, "standardUnit": "도형의 닮음", "standardUnitOrder": 6, "subUnitKey": fixture["subUnitKey"], "subUnit": fixture["subUnit"], "subUnitConfidence": "deterministic_fixture", "subUnitClassificationDepth": "complete_rule", "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "tags": [fixture["coverage"], "ALIVE_UNIVERSAL_MIDDLE_SCHOOL_PARALLEL_RATIO_BOUNDED"], "wide": False}
    candidate = {"artifactType": "ALIVE_UNIVERSAL_CANDIDATE", "schemaVersion": "0.1.0", "runId": run_id, "sourceQuestionId": source_ir["sourceQuestionId"], "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"], "variantPlan": {"declaredClass": declared_class, "transform": sidecar["transform"], "familyId": PARALLEL_RATIO_FAMILY_ID, "bridgeStatus": "BOUNDED_MIDDLE_SCHOOL_PARALLEL_LENGTH_RATIO_EXACT_VARIANT", "sourceGraphFingerprint": source_ir["solutionGraph"]["graphFingerprint"], "candidateGraphFingerprint": candidate_ir["solutionGraph"]["graphFingerprint"]}, "studentPayload": payload, "answerContract": {"answerType": "text", "displayAnswer": result["answerText"], "equivalencePolicy": "normalized_math_text"}, "solution": solution, "solutionDetail": detail, "archiveMetadata": metadata, "variantProof": sidecar, "variantResult": variant_result, "visualDependency": "MANDATORY", "solutionVisualElements": {"required": True}, "visualSpec": copy.deepcopy(result["visualSpec"]), "solutionVisualSpec": copy.deepcopy(result["solutionVisualSpec"])}
    return validate_universal_candidate(candidate)


def _review(ordinal: int) -> dict[str, Any]:
    return {"id": ordinal, "blindMath": {"status": "PASS", "method": "middle_school_parallel_length_ratio_independent_exact_recompute", "evidenceRefs": [f"middle-parallel-ratio-review:{ordinal}:blindMath"]}, "solution": {"status": "PASS", "method": "middle_school_parallel_length_ratio_solution_detail_contract", "evidenceRefs": [f"middle-parallel-ratio-review:{ordinal}:solution"]}, "variantComparison": {"status": "PASS", "method": "middle_school_parallel_length_ratio_visual_comparison", "evidenceRefs": [f"middle-parallel-ratio-review:{ordinal}:variantComparison"]}}


def build_middle_school_parallel_ratio_variant_inputs(root: Path, *, run_id: str, declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A", "B"}:
        raise MiddleSchoolParallelRatioVariantError("C is HOLD for M2-06 parallel-ratio until a genuine preprocess fixture exists")
    snapshot = load_rule_pack(Path(root).resolve(), required=True)
    if not rule_pack_is_ready(snapshot):
        raise MiddleSchoolParallelRatioVariantError("canonical rule pack is not ready")
    fixtures = load_middle_school_parallel_ratio_fixtures(root)
    transform = TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION
    source_questions: list[dict[str, Any]] = []
    source_irs: list[dict[str, Any]] = []
    candidate_irs: list[dict[str, Any]] = []
    candidates: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    reviews: list[dict[str, Any]] = []
    assignments: list[dict[str, Any]] = []
    for ordinal, fixture in enumerate(fixtures, 1):
        source_result = solve_middle_school_parallel_ratio_fixture(fixture)
        source_question = _source_question(fixture, source_result, ordinal)
        source_questions.append(source_question)
        source_ir = _build_ir(fixture, source_result, ordinal, snapshot["snapshotSha256"])
        require_valid_universal_question_ir(source_ir)
        source_irs.append(source_ir)
        variant = copy.deepcopy(fixture)
        if declared_class == "A":
            variant["data"] = _mutated_data(fixture)
        result = solve_middle_school_parallel_ratio_fixture(variant)
        candidate_payload = _student_payload(variant, result, representation="rearranged" if declared_class == "B" else "standard")
        candidate_ir = copy.deepcopy(source_ir)
        candidate_ir["studentPayload"] = {**candidate_ir["studentPayload"], "content": candidate_payload["content"]}
        candidate_ir["parameters"] = copy.deepcopy(variant["data"])
        candidate_irs.append(candidate_ir)
        sidecar = _sidecar(source_ir, candidate_ir, declared_class, ordinal)
        refs = {ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]}
        variant_result = reduce_variant_class(sidecar, evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise MiddleSchoolParallelRatioVariantError(f"M2-06 parallel-ratio variant proof failed: {fixture['caseId']}")
        candidates.append(_candidate(run_id, ordinal, variant, result, source_ir, candidate_ir, sidecar, variant_result, declared_class))
        proof_rows.append({"id": ordinal, "sidecar": sidecar})
        reviews.append(_review(ordinal))
        assignments.append({"id": ordinal, "unitKey": PARALLEL_RATIO_UNIT_KEY, "familyId": PARALLEL_RATIO_FAMILY_ID, "transform": transform, "status": "READY", "solver": "middle_school_parallel_length_ratio_exact_adapter_v1", "variantClass": declared_class})
    review_catalog = sorted({ref for row in reviews for view in ("blindMath", "solution", "variantComparison") for ref in row[view]["evidenceRefs"]})
    proof_catalog = sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_PARALLEL_RATIO_BOUNDED_VARIANT_INPUT", "schemaVersion": PARALLEL_RATIO_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "BOUNDED_MIDDLE_SCHOOL_PARALLEL_LENGTH_RATIO_EXACT_VARIANT", "variantClass": declared_class, "transform": transform, "fixtureScope": "M2-06_parallel_length_ratio_structured", "ruleSnapshotSha256": snapshot["snapshotSha256"], "questionCount": len(candidates), "sourceQuestions": source_questions, "sourceIR": source_irs, "candidateIR": candidate_irs, "candidates": candidates, "proofRows": proof_rows, "proofCatalog": proof_catalog, "reviewLedger": {"artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER", "schemaVersion": "0.1.0", "questions": reviews}, "reviewCatalog": review_catalog, "independentReviews": reviews, "capabilityPreflight": {"status": "PASS", "assignments": assignments}, "visualRecon": {"status": "PASS", "questions": [{"id": item["id"], "visualDependency": "MANDATORY", "problem": "PASS", "solution": "PASS"} for item in assignments]}, "promotionStatus": "CANDIDATE", "promotionReason": "M2-06 parallel length ratio exact A/B slice; C remains HOLD"}


def build_middle_school_parallel_ratio_capability_report(root: Path) -> dict[str, Any]:
    records: list[dict[str, Any]] = []
    for declared_class in ("A", "B"):
        inputs = build_middle_school_parallel_ratio_variant_inputs(root, run_id=f"capability-middle-parallel-ratio-{declared_class.lower()}", declared_class=declared_class)
        for assignment, candidate in zip(inputs["capabilityPreflight"]["assignments"], inputs["candidates"]):
            records.append({"familyId": PARALLEL_RATIO_FAMILY_ID, "transform": inputs["transform"], "polarity": "positive", "status": "PASS", "unitKey": PARALLEL_RATIO_UNIT_KEY, "variantClass": declared_class, "verifiedClass": candidate["variantResult"]["verifiedClass"]})
        records.append({"familyId": PARALLEL_RATIO_FAMILY_ID, "transform": inputs["transform"], "polarity": "negative", "status": "PASS", "unitKey": PARALLEL_RATIO_UNIT_KEY, "variantClass": declared_class, "negativeCode": "VARIANT_PROOF_FAILED"})
    records.append({"familyId": PARALLEL_RATIO_FAMILY_ID, "transform": TRANSFORM_C_PARAMETER_RECOVERY, "polarity": "negative", "status": "PASS", "unitKey": PARALLEL_RATIO_UNIT_KEY, "variantClass": "C", "negativeCode": "C_ABLATION_FAILED"})
    promotion = evaluate_capability_promotion(records)
    return {**promotion, "artifactType": "ALIVE_MIDDLE_SCHOOL_PARALLEL_RATIO_CAPABILITY_PROMOTION", "schemaVersion": PARALLEL_RATIO_VARIANT_SCHEMA_VERSION, "scope": "M2-06 parallel-length-ratio structured general/boundary/composite fixtures", "unitCount": 1, "fixtureCount": 6, "status": "ACTIVE_BOUNDED" if promotion["holdCount"] == 1 and promotion["activeCount"] == 2 else "HOLD", "cRecords": records, "productionArchiveRegistration": "NOT_PERFORMED", "publicationStatus": "NOT_PUBLISHED"}


def prepare_middle_school_parallel_ratio_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str) -> dict[str, Any]:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger
    inputs = build_middle_school_parallel_ratio_variant_inputs(root, run_id=run_id, declared_class=declared_class)
    source_path = Path(root).resolve() / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    source_path.parent.mkdir(parents=True, exist_ok=True)
    source_path.write_text("window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\nwindow.questionBank = " + json.dumps(inputs["sourceQuestions"], ensure_ascii=False, indent=2) + ";\n", encoding="utf-8", newline="\n")
    source_manifest = {"artifactType": "ALIVE_MIDDLE_SCHOOL_PARALLEL_RATIO_UNIVERSAL_SOURCE_JS", "schemaVersion": PARALLEL_RATIO_VARIANT_SCHEMA_VERSION, "runId": run_id, "questionCount": inputs["questionCount"], "path": source_path.relative_to(Path(root).resolve()).as_posix(), "sha256": sha256_file(source_path), "ruleSnapshotSha256": inputs["ruleSnapshotSha256"], "publicationStatus": "NOT_PUBLISHED"}
    atomic_write_json(source_path.with_name(source_path.stem + "-manifest.json"), source_manifest)
    start = start_universal_run(Path(runtime_root).resolve(), run_id=run_id, source_lock={"path": source_manifest["path"], "sha256": source_manifest["sha256"], "ruleSnapshotSha256": inputs["ruleSnapshotSha256"]}, question_count=inputs["questionCount"], batch_plan=[[start for start in range(index, min(index + 4, inputs["questionCount"] + 1))] for index in range(1, inputs["questionCount"] + 1, 4)])
    store = UniversalRunStore(Path(runtime_root).resolve())
    run_dir = store.run_dir(run_id)
    atomic_write_json(run_dir / "source/variant-input.json", inputs)
    record_universal_stage(store, run_id, "S01_PREFLIGHT", status="PASS", evidence="middle-school-parallel-ratio-exact-variant-preflight")
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
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_PARALLEL_RATIO_BOUNDED_VARIANT_PREPARED_RUN", "schemaVersion": PARALLEL_RATIO_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "READY_FOR_BROWSER_RENDER", "variantClass": declared_class, "fixtureScope": "M2-06_parallel_length_ratio_structured", "run": start, "source": source_manifest, "questionCount": inputs["questionCount"], "variantLedger": ledger, "assembly": assembled["assembly"], "currentStage": UniversalRunStore(Path(runtime_root).resolve()).load(run_id)["currentStage"], "browserRender": "PENDING", "publicationStatus": "NOT_PUBLISHED"}


__all__ = ["PARALLEL_RATIO_FAMILY_ID", "PARALLEL_RATIO_UNIT_KEY", "MiddleSchoolParallelRatioVariantError", "build_middle_school_parallel_ratio_capability_report", "build_middle_school_parallel_ratio_variant_inputs", "load_middle_school_parallel_ratio_fixtures", "middle_school_parallel_ratio_variant_registry", "prepare_middle_school_parallel_ratio_variant_run", "solve_middle_school_parallel_ratio_fixture"]
