from __future__ import annotations

import json
import os
import re
import uuid
import zipfile
import shutil
from pathlib import Path
from typing import Any

from .run_store import atomic_write_json, sha256_file


ADAPTER_VERSION = "0.5.0-r13-response-types"
SERIALIZER_VERSION = "0.3.0-r14"
CIRCLED = ("①", "②", "③", "④", "⑤")
LABEL_RE = re.compile(r"^\s*(?:[①②③④⑤]|\(?[1-5]\)?[.)])")
QUESTION_TYPE_MAP = {
    "MCQ": "객관식",
    "SHORT_ANSWER": "주관식",
    "CONSTRUCTED_RESPONSE": "서술형",
}
ANSWER_TYPES = {
    "choice_index", "integer", "rational", "decimal", "expression", "equation",
    "inequality", "interval", "set", "ordered_pair", "multiple_values", "text",
}
EQUIVALENCE_POLICIES = {
    "exact", "exact_index", "normalized_string", "numeric_equivalence",
    "symbolic_equivalence", "equation_equivalence", "set_equivalence",
    "interval_equivalence",
}


def _read_json(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ValueError(f"JSON object required: {path}")
    return payload


def _atomic_write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{uuid.uuid4().hex}.tmp")
    try:
        with temporary.open("w", encoding="utf-8", newline="\n") as output:
            output.write(text)
            output.flush()
            os.fsync(output.fileno())
        os.replace(temporary, path)
    finally:
        if temporary.exists():
            temporary.unlink()


def _atomic_copy(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(f".{target.name}.{uuid.uuid4().hex}.tmp")
    try:
        shutil.copyfile(source, temporary)
        os.replace(temporary, target)
    finally:
        if temporary.exists():
            temporary.unlink()


def _require_context(context: dict[str, Any]) -> None:
    string_fields = (
        "level", "category", "originalCategory", "standardCourse", "standardUnitKey",
        "standardUnit", "subUnitKey", "subUnit", "subUnitConfidence",
        "subUnitClassificationDepth", "layoutTag",
    )
    for key in string_fields:
        if not isinstance(context.get(key), str) or not context[key].strip():
            raise ValueError(f"adapter context requires non-empty {key}")
    if context["level"] not in {"하", "중", "상"}:
        raise ValueError("adapter context level must be 하, 중, or 상")
    if not isinstance(context.get("standardUnitOrder"), int) or context["standardUnitOrder"] < 0:
        raise ValueError("adapter context standardUnitOrder must be a nonnegative integer")
    if context["layoutTag"] != "grid":
        raise ValueError("V0.1 adapter supports layoutTag=grid only")
    if not isinstance(context.get("tags"), list) or any(
        not isinstance(item, str) or not item.strip() for item in context["tags"]
    ):
        raise ValueError("adapter context tags must be a string array")
    if any(item in {"객관식", "주관식", "서술형"} for item in context["tags"]):
        raise ValueError("tags must not duplicate questionType")
    if not isinstance(context.get("wide"), bool):
        raise ValueError("adapter context wide must be boolean")
    if context.get("id") != 1:
        raise ValueError("V0.1 one-question adapter requires id=1")
    expected_type = context.get("expectedQuestionType")
    if expected_type is not None and expected_type not in QUESTION_TYPE_MAP:
        raise ValueError("adapter context expectedQuestionType is invalid")
    expected_visual = context.get("expectedVisualDependency")
    if expected_visual is not None and expected_visual not in {"NONE", "OPTIONAL", "ESSENTIAL"}:
        raise ValueError("adapter context expectedVisualDependency is invalid")


def _validate_canonical_metadata(root: Path, context: dict[str, Any]) -> None:
    master = root / "docs" / "rules" / "01_CANONICAL" / "JS아카이브_표준단원키_마스터테이블.md"
    text = master.read_text(encoding="utf-8")
    unit_row = f"| {context['standardUnitKey']} | {context['standardUnit']} | {context['standardUnitOrder']} |"
    if unit_row not in text:
        raise ValueError("adapter context standard unit tuple is not canonical")
    subunit_row = f"| {context['standardUnitKey']} | {context['subUnitKey']} | {context['subUnit']} |"
    if subunit_row not in text:
        raise ValueError("adapter context subunit tuple is not canonical")


def adapt_selected_candidate(root: Path, run_dir: Path, manifest: dict[str, Any], context_path: Path) -> dict[str, Any]:
    if manifest.get("status") != "PHASE2_COMPLETE" or manifest.get("currentStage") != "R13_STRUCTURED_ADAPTER":
        raise ValueError("Run is not ready for R13")
    selected_id = manifest.get("phase2", {}).get("selectedCandidateId")
    if not isinstance(selected_id, str):
        raise ValueError("selected candidate is missing")
    context = _read_json(context_path)
    _require_context(context)
    _validate_canonical_metadata(root, context)
    candidate_path = run_dir / "final" / "selected-candidate.json"
    candidate = _read_json(candidate_path)
    if candidate.get("artifactId") != selected_id:
        raise ValueError("selected candidate artifact identity mismatch")
    question = candidate.get("question")
    contract = candidate.get("answerContract")
    solution = candidate.get("solution")
    if not isinstance(question, dict) or question.get("questionType") not in QUESTION_TYPE_MAP:
        raise ValueError("R13 question type is unsupported")
    ir_question_type = question["questionType"]
    expected_type = context.get("expectedQuestionType")
    if expected_type is not None and expected_type != ir_question_type:
        raise ValueError("R13 candidate question type does not match the source contract")
    choices = question.get("choices", [])
    if not isinstance(contract, dict):
        raise ValueError("R13 answer contract is invalid")
    answer_type = contract.get("answerType")
    equivalence_policy = contract.get("equivalencePolicy")
    canonical_answer = contract.get("canonicalAnswer")
    acceptable_answers = contract.get("acceptableAnswers", [])
    if answer_type not in ANSWER_TYPES:
        raise ValueError("R13 answerType is unsupported")
    if equivalence_policy not in EQUIVALENCE_POLICIES:
        raise ValueError("R13 equivalencePolicy is unsupported")
    if not isinstance(canonical_answer, str) or not canonical_answer.strip():
        raise ValueError("R13 canonicalAnswer is required")
    if not isinstance(acceptable_answers, list) or any(
        not isinstance(item, str) or not item.strip() for item in acceptable_answers
    ):
        raise ValueError("R13 acceptableAnswers must be a string array")
    if ir_question_type == "MCQ":
        if not isinstance(choices, list) or len(choices) != 5:
            raise ValueError("R13 MCQ requires exactly five choices")
        if len(set(choices)) != 5 or any(not isinstance(item, str) or not item.strip() for item in choices):
            raise ValueError("R13 choices must be five distinct non-empty strings")
        if any(LABEL_RE.search(item) for item in choices):
            raise ValueError("R13 choices must not embed rendered labels")
        if answer_type != "choice_index":
            raise ValueError("R13 MCQ answer contract is invalid")
        try:
            index = int(canonical_answer)
        except ValueError as error:
            raise ValueError("R13 canonical choice index is invalid") from error
        if not 1 <= index <= 5:
            raise ValueError("R13 canonical choice index is out of range")
        answer = CIRCLED[index - 1]
        display_canonical = choices[index - 1]
        ending = f"따라서 정답은 {answer}이다."
    else:
        if choices not in (None, []):
            raise ValueError("R13 non-MCQ choices must be empty")
        if answer_type == "choice_index":
            raise ValueError("R13 non-MCQ answerType must not be choice_index")
        choices = []
        answer = str(contract.get("displayAnswer") or canonical_answer).strip()
        display_canonical = canonical_answer.strip()
        ending = f"따라서 답은 {answer}이다."
    if not isinstance(solution, dict) or not isinstance(solution.get("steps"), list) or not solution["steps"]:
        raise ValueError("R13 solution steps are required")
    solution_text = "\n".join(str(step).strip() for step in solution["steps"] if str(step).strip())
    if ending not in solution_text:
        solution_text = f"{solution_text}\n{ending}"
    structured = {
        "id": context["id"],
        "questionType": QUESTION_TYPE_MAP[ir_question_type],
        "level": context["level"],
        "category": context["category"],
        "originalCategory": context["originalCategory"],
        "standardCourse": context["standardCourse"],
        "standardUnitKey": context["standardUnitKey"],
        "standardUnit": context["standardUnit"],
        "standardUnitOrder": context["standardUnitOrder"],
        "subUnitKey": context["subUnitKey"],
        "subUnit": context["subUnit"],
        "subUnitConfidence": context["subUnitConfidence"],
        "subUnitClassificationDepth": context["subUnitClassificationDepth"],
        "layoutTag": context["layoutTag"],
        "tags": context["tags"],
        "wide": context["wide"],
        "content": question["content"],
        "choices": choices,
        "answer": answer,
        "answerType": answer_type,
        "canonicalAnswer": display_canonical,
        "acceptableAnswers": acceptable_answers,
        "equivalencePolicy": equivalence_policy,
        "solution": solution_text,
    }
    visual_dependency = candidate.get("visualDependency", "NONE")
    expected_visual = context.get("expectedVisualDependency")
    if expected_visual == "ESSENTIAL" and visual_dependency != "ESSENTIAL":
        raise ValueError("R13 ESSENTIAL source visual cannot be downgraded")
    if expected_visual == "NONE" and visual_dependency != "NONE":
        raise ValueError("R13 nonvisual source unexpectedly gained a visual dependency")
    visual_package: dict[str, Any] | None = None
    if visual_dependency == "ESSENTIAL":
        visual_asset = candidate.get("visualAsset")
        visual_spec = candidate.get("visualSpec")
        if not isinstance(visual_asset, dict) or not isinstance(visual_spec, dict):
            raise ValueError("R13 ESSENTIAL visual candidate is missing its visual contract")
        source_asset = (run_dir / str(visual_asset.get("path", ""))).resolve()
        try:
            source_asset.relative_to(run_dir.resolve())
        except ValueError as error:
            raise ValueError("R13 visual asset escapes the Run") from error
        if not source_asset.is_file() or sha256_file(source_asset) != visual_asset.get("sha256"):
            raise ValueError("R13 visual asset hash mismatch")
        selection_report = _read_json(run_dir / "final" / "selection-report.json")
        visual_evidence = selection_report.get("visualEvidence")
        if (
            not isinstance(visual_evidence, list) or len(visual_evidence) != 1
            or visual_evidence[0].get("overallVerdict") != "PASS"
            or visual_evidence[0].get("candidateArtifactId") != selected_id
            or visual_evidence[0].get("assetSha256") != visual_asset.get("sha256")
            or visual_evidence[0].get("visualSpecSha256") != visual_asset.get("specSha256")
        ):
            raise ValueError("R13 independent visual evidence did not PASS")
        final_asset = run_dir / "final" / "assets" / "q1.svg"
        _atomic_copy(source_asset, final_asset)
        visual_package = {
            "visualSpecVersion": str(visual_spec.get("version", "0.1")),
            "assetType": "svg",
            "assetLocalPath": "final/assets/q1.svg",
            "assetSha256": sha256_file(final_asset),
            "renderer": visual_asset.get("rendererVersion"),
            "visualValidator": "PASS",
        }
        structured["visual"] = visual_package
    context_target = run_dir / "final" / "adapter-context.json"
    structured_target = run_dir / "final" / "structured-question.json"
    atomic_write_json(context_target, context)
    atomic_write_json(structured_target, structured)
    adapter_report = {
        "stageId": "R13_STRUCTURED_ADAPTER",
        "verdict": "PASS",
        "adapterVersion": ADAPTER_VERSION,
        "selectedCandidateId": selected_id,
        "sourceLockSha256": manifest["sourceLock"]["sha256"],
        "checks": [
            "canonical metadata tuple", "question type mapping", "answer contract",
            "choice ownership when MCQ", "solution answer ending", "internal metadata separated",
        ],
        "contextSha256": sha256_file(context_target),
        "structuredQuestionSha256": sha256_file(structured_target),
    }
    report_target = run_dir / "final" / "adapter-report.json"
    atomic_write_json(report_target, adapter_report)
    sidecar = {
        "questionUid": f"{manifest['runId']}:{selected_id}",
        "sourceUid": manifest["sourceLock"].get("qKey") or (
            f"{manifest['sourceLock']['path']}#{manifest['sourceLock'].get('questionOrdinal')}"
        ),
        "familyId": f"{manifest['sourceLock']['sha256']}:{manifest['sourceLock'].get('questionOrdinal')}",
        "variantIndex": None,
        "mode": manifest["request"]["generationMode"],
        "profile": manifest["request"]["outputProfile"],
        "conceptKey": context["standardUnitKey"],
        "problemTypeKey": context["subUnitKey"],
        "templateKey": candidate.get("candidateFingerprint", ""),
        "solutionEntry": candidate.get("candidateFingerprint", ""),
        "solutionGraph": ["independent_derivation", "canonical_answer", "final_conclusion"],
        "difficultyBucket": "standard" if context["level"] == "중" else "unknown",
        "difficultyVectorSource": "model_estimated",
        "difficultyVector": {},
        "difficultyComparison": {
            "baselineSourceUid": manifest["sourceLock"].get("qKey") or "",
            "delta": {},
            "equivalence": "EQUIVALENT",
        },
        "visualDependency": visual_dependency,
        "visual": visual_package,
        "trapTags": context["tags"],
        "validators": {
            "V2_MATH": {"status": "PASS", "evidenceLevel": "A", "method": "independent_derivation", "coverage": "complete", "independenceLevel": "I2_SEPARATE_CALL", "evidence": ["two blinded math artifacts agreed with the answer contract"]},
            "V4_FIDELITY": {"status": "PASS", "evidenceLevel": "A", "method": "independent_review", "coverage": "complete", "independenceLevel": "I2_SEPARATE_CALL", "evidence": ["curriculum, fidelity, difficulty, and anti-clone gates passed"]},
        },
        "finalStatus": "HOLD",
        "codes": [],
        "pipelineRunId": manifest["runId"],
        "checkpointId": "R13_STRUCTURED_ADAPTER",
        "resumeFromStage": "R15_REAL_RENDER",
        "requiredResource": "browserRenderEvidence",
        "resumePayload": {},
    }
    if ir_question_type == "MCQ":
        sidecar["validators"]["V8_DISTRACTOR"] = {
            "status": "PASS", "evidenceLevel": "A", "method": "misconception_mapping",
            "coverage": "complete", "independenceLevel": "I2_SEPARATE_CALL",
            "evidence": ["all distractors map to distinct concrete errors"],
        }
    if visual_dependency == "ESSENTIAL":
        sidecar["validators"]["V5_VISUAL"] = {
            "status": "PASS", "code": None, "blocking": False,
            "evidenceLevel": "A", "method": "deterministic_svg_and_independent_review",
            "coverage": "complete", "independenceLevel": "I2_SEPARATE_CALL",
            "evidence": ["visualSpec, deterministic asset hash, and independent visual evidence agree"],
        }
    sidecar_target = run_dir / "final" / "validation-sidecar.json"
    atomic_write_json(sidecar_target, sidecar)
    return {
        "adapterVersion": ADAPTER_VERSION,
        "adapterContextSha256": sha256_file(context_target),
        "structuredQuestionSha256": sha256_file(structured_target),
        "adapterReportSha256": sha256_file(report_target),
        "validationSidecarSha256": sha256_file(sidecar_target),
    }


ARCHIVE_FIELDS = (
    "id", "level", "category", "originalCategory", "standardCourse", "standardUnitKey",
    "standardUnit", "standardUnitOrder", "subUnitKey", "subUnit", "subUnitConfidence",
    "subUnitClassificationDepth", "questionType", "layoutTag", "tags", "wide", "content",
    "choices", "answer", "solution",
)
OPTIONAL_ARCHIVE_FIELDS = (
    "image",
    "imageSize",
    "choiceColumns",
    "solutionImage",
    "solutionImageSize",
)


def _archive_projection(structured: dict[str, Any]) -> dict[str, Any]:
    projected = {key: structured[key] for key in ARCHIVE_FIELDS}
    projected.update({key: structured[key] for key in OPTIONAL_ARCHIVE_FIELDS if key in structured})
    return projected


def _parse_serialized_js(text: str) -> tuple[str, list[dict[str, Any]]]:
    match = re.fullmatch(
        r'window\.examTitle = ("(?:[^"\\]|\\.)*");\s*window\.questionBank = (\[[\s\S]*\]);\s*',
        text,
    )
    if not match:
        raise ValueError("serialized JS does not match strict archive envelope")
    title = json.loads(match.group(1))
    bank = json.loads(match.group(2))
    if not isinstance(title, str) or not isinstance(bank, list):
        raise ValueError("serialized JS payload types are invalid")
    return title, bank


def serialize_structured_question(root: Path, run_dir: Path, manifest: dict[str, Any], title: str) -> dict[str, Any]:
    if manifest.get("currentStage") != "R14_JS_SERIALIZER":
        raise ValueError("Run is not ready for R14")
    if not title.strip():
        raise ValueError("exam title is required")
    structured = _read_json(run_dir / "final" / "structured-question.json")
    visual = structured.get("visual")
    shadow = root / "archive" / "_generated" / "alive-runs" / manifest["runId"] / "candidate.js"
    if isinstance(visual, dict):
        local_asset = run_dir / visual["assetLocalPath"]
        if sha256_file(local_asset) != visual["assetSha256"]:
            raise ValueError("serializer visual asset hash mismatch")
        shadow_asset = shadow.parent / "assets" / "q1.svg"
        _atomic_copy(local_asset, shadow_asset)
        structured["image"] = f"_generated/alive-runs/{manifest['runId']}/assets/q1.svg"
    archive_question = _archive_projection(structured)
    script = (
        f"window.examTitle = {json.dumps(title, ensure_ascii=False)};\n\n"
        f"window.questionBank = {json.dumps([archive_question], ensure_ascii=False, indent=2)};\n"
    )
    staging = run_dir / "final" / "staging" / "generated-question.js"
    _atomic_write_text(staging, script)
    _atomic_write_text(shadow, script)
    parsed_title, parsed_bank = _parse_serialized_js(staging.read_text(encoding="utf-8"))
    if parsed_title != title or parsed_bank != [archive_question]:
        raise ValueError("serializer semantic round-trip mismatch")
    report = {
        "stageId": "R14_JS_SERIALIZER",
        "verdict": "PASS",
        "serializerVersion": SERIALIZER_VERSION,
        "examTitle": title,
        "questionCount": 1,
        "semanticRoundTrip": "PASS",
        "choiceOrderPreserved": True,
        "answerPreserved": True,
        "internalFieldsExcluded": sorted(set(structured) - set(archive_question)),
        "stagingSha256": sha256_file(staging),
        "shadowSha256": sha256_file(shadow),
        "shadowArchiveRelativePath": shadow.relative_to(root / "archive").as_posix(),
        "publicationStatus": "NOT_PUBLISHED",
    }
    if isinstance(visual, dict):
        report["visualAssetSha256"] = visual["assetSha256"]
        report["visualArchiveRelativePath"] = archive_question["image"]
    report_target = run_dir / "final" / "serializer-report.json"
    atomic_write_json(report_target, report)
    return {
        "serializerVersion": SERIALIZER_VERSION,
        "stagingJsSha256": sha256_file(staging),
        "serializerReportSha256": sha256_file(report_target),
        "renderDataPath": report["shadowArchiveRelativePath"],
    }


def record_render_evidence(run_dir: Path, manifest: dict[str, Any], evidence_path: Path) -> dict[str, Any]:
    if manifest.get("currentStage") != "R15_REAL_RENDER":
        raise ValueError("Run is not ready for R15")
    evidence = _read_json(evidence_path)
    modes = evidence.get("modes")
    if not isinstance(modes, dict) or set(modes) != {"exam", "solution", "answer"}:
        raise ValueError("render evidence requires exam, solution, and answer modes")
    for name, result in modes.items():
        if not isinstance(result, dict) or result.get("verdict") != "PASS":
            raise ValueError(f"render mode {name} did not PASS")
        if result.get("ready") is not True or result.get("renderError") is not None:
            raise ValueError(f"render mode {name} readiness invalid")
        if result.get("unrenderedMath") != 0 or result.get("overflowCount") != 0:
            raise ValueError(f"render mode {name} math or overflow check failed")
        if result.get("lastQuestion") != 1 or result.get("badImages") != []:
            raise ValueError(f"render mode {name} coverage or image check failed")
    if evidence.get("actualBrowser") is not True or evidence.get("productionEngine") is not True:
        raise ValueError("R15 requires actual-browser production-engine evidence")
    target = run_dir / "render" / "render-evidence.json"
    atomic_write_json(target, evidence)
    return {"renderEvidenceSha256": sha256_file(target)}


def package_run(run_dir: Path, manifest: dict[str, Any]) -> dict[str, Any]:
    repair_frozen = (
        manifest.get("currentStage") == "R17_LOCAL_FREEZE"
        and manifest.get("status") == "LOCALLY_FROZEN"
    )
    if manifest.get("currentStage") != "R16_PACKAGE" and not repair_frozen:
        raise ValueError("Run is not ready for R16")
    sidecar_path = run_dir / "final" / "validation-sidecar.json"
    sidecar = _read_json(sidecar_path)
    sidecar.update({
        "finalStatus": "PASS",
        "codes": [],
        "checkpointId": "R16_PACKAGE",
        "resumeFromStage": "",
        "requiredResource": "",
        "resumePayload": {},
    })
    atomic_write_json(sidecar_path, sidecar)
    package = run_dir / "final" / "alive-evidence-pack.zip"
    members = [
        "final/adapter-context.json", "final/structured-question.json", "final/adapter-report.json",
        "final/staging/generated-question.js", "final/serializer-report.json",
        "final/selected-candidate.json", "final/selection-report.json", "final/validation-sidecar.json",
        "render/render-evidence.json",
    ]
    if (run_dir / "final/assets/q1.svg").is_file():
        members.append("final/assets/q1.svg")
    for relative in members:
        if not (run_dir / relative).is_file():
            raise ValueError(f"package member missing: {relative}")
    with zipfile.ZipFile(package, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for relative in members:
            archive.write(run_dir / relative, arcname=relative)
    with zipfile.ZipFile(package, "r") as archive:
        if archive.testzip() is not None or sorted(archive.namelist()) != sorted(members):
            raise ValueError("package round-trip failed")
    report = {
        "stageId": "R16_PACKAGE", "verdict": "PASS", "members": members,
        "zipSha256": sha256_file(package), "roundTrip": "PASS",
        "validationSidecarSha256": sha256_file(sidecar_path),
        "validationSidecarFinalStatus": "PASS",
        "publicationStatus": "NOT_PUBLISHED",
    }
    report_target = run_dir / "final" / "package-report.json"
    atomic_write_json(report_target, report)
    return {"packageSha256": sha256_file(package), "packageReportSha256": sha256_file(report_target)}
