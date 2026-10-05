from __future__ import annotations

import re
import json
import hashlib
from collections.abc import Iterable, Mapping, Sequence
from pathlib import Path
from typing import Any

from .run_store import sha256_file


SCHEMA_VERSION = "0.2.0"

SOURCE_ANALYSIS = "SOURCE_ANALYSIS"
TRANSFORMATION_PLAN = "TRANSFORMATION_PLAN"
CANDIDATE_DRAFT = "CANDIDATE_DRAFT"
MATH_EVIDENCE = "MATH_EVIDENCE"
FIDELITY_EVIDENCE = "FIDELITY_EVIDENCE"
CANDIDATE_JUDGE_INPUT = "CANDIDATE_JUDGE_INPUT"
CURRICULUM_FINGERPRINT = "CURRICULUM_FINGERPRINT"
PLAN_CRITIC = "PLAN_CRITIC"
LOCAL_CHECK = "LOCAL_CHECK"
VISUAL_EVIDENCE = "VISUAL_EVIDENCE"

VERDICTS = frozenset({"PASS", "FAIL", "UNVERIFIED"})
QUESTION_TYPES = frozenset({"MCQ", "SHORT_ANSWER", "CONSTRUCTED_RESPONSE"})
ANSWER_TYPES = frozenset({
    "choice_index", "integer", "rational", "decimal", "expression", "equation",
    "inequality", "interval", "set", "ordered_pair", "multiple_values", "text",
})
EQUIVALENCE_POLICIES = frozenset({
    "exact", "exact_index", "normalized_string", "numeric_equivalence",
    "symbolic_equivalence", "equation_equivalence", "set_equivalence",
    "interval_equivalence",
})
SOURCE_LANES = frozenset({"A", "B"})
PLAN_LANES = frozenset({"A", "B", "C"})

_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_CHOICE_LABEL = re.compile(
    r"^\s*(?:[①②③④⑤⑥⑦⑧⑨⑩]|\(?[1-9]\)|[1-9][.)]|[가-힣][.)])\s*"
)
_BLINDED_ALLOWED_INPUTS = frozenset({"questionType", "content", "choices", "assets"})
_BLINDED_FORBIDDEN_KEYS = frozenset(
    {
        "answer",
        "answerContract",
        "acceptableAnswers",
        "builderNotes",
        "canonicalAnswer",
        "intendedAnswer",
        "plan",
        "solution",
        "sourceAnswer",
        "sourceSolution",
    }
)
_FIDELITY_DIMENSIONS = (
    "curriculum",
    "fidelity",
    "difficulty",
    "antiClone",
)


class ArtifactValidationError(ValueError):
    """Raised when a Phase 2 artifact violates its deterministic contract."""

    def __init__(self, errors: Sequence[str]):
        self.errors = tuple(errors)
        super().__init__("; ".join(self.errors))


def _is_mapping(value: Any) -> bool:
    return isinstance(value, Mapping)


def _require_mapping(value: Any, path: str, errors: list[str]) -> Mapping[str, Any]:
    if not _is_mapping(value):
        errors.append(f"{path} must be an object")
        return {}
    return value


def _require_string(
    obj: Mapping[str, Any], key: str, errors: list[str], *, path: str = "artifact"
) -> str:
    value = obj.get(key)
    if not isinstance(value, str) or not value.strip():
        errors.append(f"{path}.{key} must be a non-empty string")
        return ""
    return value.strip()


def _require_bool(
    obj: Mapping[str, Any], key: str, errors: list[str], *, path: str = "artifact"
) -> bool | None:
    value = obj.get(key)
    if not isinstance(value, bool):
        errors.append(f"{path}.{key} must be a boolean")
        return None
    return value


def _require_list(
    obj: Mapping[str, Any],
    key: str,
    errors: list[str],
    *,
    path: str = "artifact",
    minimum: int = 1,
) -> list[Any]:
    value = obj.get(key)
    if not isinstance(value, list):
        errors.append(f"{path}.{key} must be an array")
        return []
    if len(value) < minimum:
        errors.append(f"{path}.{key} must contain at least {minimum} item(s)")
    return value


def _require_string_list(
    obj: Mapping[str, Any],
    key: str,
    errors: list[str],
    *,
    path: str = "artifact",
    minimum: int = 1,
) -> list[str]:
    values = _require_list(obj, key, errors, path=path, minimum=minimum)
    if any(not isinstance(item, str) or not item.strip() for item in values):
        errors.append(f"{path}.{key} must contain only non-empty strings")
        return []
    return [item.strip() for item in values]


def _validate_common(
    artifact: Mapping[str, Any], expected_type: str, errors: list[str]
) -> None:
    schema_version = _require_string(artifact, "schemaVersion", errors)
    if schema_version and schema_version != SCHEMA_VERSION:
        errors.append(f"artifact.schemaVersion must equal {SCHEMA_VERSION}")
    artifact_type = _require_string(artifact, "artifactType", errors)
    if artifact_type and artifact_type != expected_type:
        errors.append(f"artifact.artifactType must equal {expected_type}")
    _require_string(artifact, "artifactId", errors)
    _require_string(artifact, "producerId", errors)
    source_sha = _require_string(artifact, "sourceLockSha256", errors)
    if source_sha and not _SHA256.fullmatch(source_sha):
        errors.append("artifact.sourceLockSha256 must be a lowercase SHA-256 hex digest")


def _finish(artifact: Mapping[str, Any], errors: list[str]) -> Mapping[str, Any]:
    if errors:
        raise ArtifactValidationError(errors)
    return artifact


def validate_source_analysis(artifact: Mapping[str, Any]) -> Mapping[str, Any]:
    errors: list[str] = []
    artifact = _require_mapping(artifact, "artifact", errors)
    _validate_common(artifact, SOURCE_ANALYSIS, errors)
    lane = _require_string(artifact, "analysisLane", errors)
    if lane and lane not in SOURCE_LANES:
        errors.append("artifact.analysisLane must be A or B")
    _require_string(artifact, "sourceQuestionId", errors)

    curriculum = _require_mapping(artifact.get("curriculum"), "artifact.curriculum", errors)
    _require_string(curriculum, "course", errors, path="artifact.curriculum")
    _require_string(curriculum, "unitKey", errors, path="artifact.curriculum")
    _require_string_list(artifact, "solutionStructure", errors)

    fingerprint = _require_mapping(
        artifact.get("sourceFingerprint"), "artifact.sourceFingerprint", errors
    )
    _require_string_list(
        fingerprint, "coreInvariants", errors, path="artifact.sourceFingerprint"
    )
    _require_string_list(
        fingerprint, "mutableFeatures", errors, path="artifact.sourceFingerprint"
    )
    _require_string_list(artifact, "assumptions", errors, minimum=0)
    _require_string_list(artifact, "unresolvedPoints", errors, minimum=0)
    return _finish(artifact, errors)


def validate_transformation_plan(artifact: Mapping[str, Any]) -> Mapping[str, Any]:
    errors: list[str] = []
    artifact = _require_mapping(artifact, "artifact", errors)
    _validate_common(artifact, TRANSFORMATION_PLAN, errors)
    lane = _require_string(artifact, "planLane", errors)
    if lane and lane not in PLAN_LANES:
        errors.append("artifact.planLane must be A, B, or C")
    _require_string(artifact, "strategy", errors)
    _require_string(artifact, "strategyFingerprint", errors)
    source_ids = _require_string_list(artifact, "sourceAnalysisIds", errors, minimum=2)
    if source_ids and len(source_ids) != 2:
        errors.append("artifact.sourceAnalysisIds must contain exactly analysis A and B")
    if len(set(source_ids)) != len(source_ids):
        errors.append("artifact.sourceAnalysisIds must be distinct")
    _require_string_list(artifact, "lockedCore", errors)
    _require_string_list(artifact, "allowedChanges", errors)
    _require_string_list(artifact, "forbiddenChanges", errors)
    _require_string(artifact, "expectedDifficultyDelta", errors)
    _require_string_list(artifact, "proofObligations", errors)
    return _finish(artifact, errors)


def validate_curriculum_fingerprint(artifact: Mapping[str, Any]) -> Mapping[str, Any]:
    errors: list[str] = []
    artifact = _require_mapping(artifact, "artifact", errors)
    _validate_common(artifact, CURRICULUM_FINGERPRINT, errors)
    source_ids = _require_string_list(artifact, "sourceAnalysisIds", errors, minimum=2)
    if len(source_ids) != 2 or len(set(source_ids)) != 2:
        errors.append("artifact.sourceAnalysisIds must identify exactly two analyses")
    curriculum = _require_mapping(artifact.get("curriculum"), "artifact.curriculum", errors)
    _require_string(curriculum, "course", errors, path="artifact.curriculum")
    _require_string(curriculum, "unitKey", errors, path="artifact.curriculum")
    _require_string_list(artifact, "coreInvariants", errors)
    _require_string_list(artifact, "mutableFeatures", errors)
    _require_string_list(artifact, "proofObligations", errors)
    return _finish(artifact, errors)


def validate_plan_critic(artifact: Mapping[str, Any]) -> Mapping[str, Any]:
    errors: list[str] = []
    artifact = _require_mapping(artifact, "artifact", errors)
    _validate_common(artifact, PLAN_CRITIC, errors)
    plan_ids = _require_string_list(artifact, "planArtifactIds", errors, minimum=3)
    survivors = _require_string_list(artifact, "survivingPlanIds", errors, minimum=0)
    if len(plan_ids) != len(set(plan_ids)):
        errors.append("artifact.planArtifactIds must be distinct")
    if len(survivors) != len(set(survivors)):
        errors.append("artifact.survivingPlanIds must be distinct")
    if set(survivors) - set(plan_ids):
        errors.append("artifact.survivingPlanIds must be a subset of planArtifactIds")
    verdict = artifact.get("verdict")
    if verdict is not None and verdict not in {"PASS", "FAIL"}:
        errors.append("artifact.verdict must be PASS or FAIL when present")
    effective_verdict = verdict or ("PASS" if len(survivors) >= 2 else "FAIL")
    if effective_verdict == "PASS" and len(survivors) < 2:
        errors.append("a PASS plan critic must retain at least 2 plans")
    if effective_verdict == "FAIL" and len(survivors) >= 2:
        errors.append("a FAIL plan critic cannot retain 2 or more plans")
    _require_string_list(artifact, "reasons", errors)
    return _finish(artifact, errors)


def validate_local_check(artifact: Mapping[str, Any]) -> Mapping[str, Any]:
    errors: list[str] = []
    artifact = _require_mapping(artifact, "artifact", errors)
    _validate_common(artifact, LOCAL_CHECK, errors)
    _require_string(artifact, "candidateArtifactId", errors)
    checks = _require_list(artifact, "checks", errors)
    for index, item in enumerate(checks):
        gate = _require_mapping(item, f"artifact.checks[{index}]", errors)
        _require_string(gate, "name", errors, path=f"artifact.checks[{index}]")
        verdict = _require_string(gate, "verdict", errors, path=f"artifact.checks[{index}]")
        if verdict and verdict not in VERDICTS:
            errors.append(f"artifact.checks[{index}].verdict must be PASS, FAIL, or UNVERIFIED")
        _require_string_list(gate, "evidence", errors, path=f"artifact.checks[{index}]")
    overall = _require_string(artifact, "overallVerdict", errors)
    if overall and overall not in VERDICTS:
        errors.append("artifact.overallVerdict must be PASS, FAIL, or UNVERIFIED")
    if overall == "PASS" and any(
        isinstance(item, Mapping) and item.get("verdict") != "PASS" for item in checks
    ):
        errors.append("artifact.overallVerdict cannot PASS unless every check PASSes")
    return _finish(artifact, errors)


def _validate_choices(question: Mapping[str, Any], errors: list[str]) -> None:
    question_type = _require_string(question, "questionType", errors, path="artifact.question")
    if question_type and question_type not in QUESTION_TYPES:
        errors.append(
            "artifact.question.questionType must be MCQ, SHORT_ANSWER, or CONSTRUCTED_RESPONSE"
        )
    _require_string(question, "content", errors, path="artifact.question")
    choices = question.get("choices")
    if question_type == "MCQ":
        if not isinstance(choices, list) or len(choices) < 2:
            errors.append("artifact.question.choices must contain at least 2 choices for MCQ")
            return
    elif choices not in (None, []):
        errors.append("artifact.question.choices must be absent or empty for non-MCQ")
        return
    if isinstance(choices, list):
        if any(not isinstance(choice, str) or not choice.strip() for choice in choices):
            errors.append("artifact.question.choices must contain only non-empty strings")
        for index, choice in enumerate(choices):
            if isinstance(choice, str) and _CHOICE_LABEL.match(choice):
                errors.append(
                    f"artifact.question.choices[{index}] must not contain a rendered choice label"
                )
        if len(choices) != len(set(choices)):
            errors.append("artifact.question.choices must be distinct")


def validate_candidate_draft(artifact: Mapping[str, Any]) -> Mapping[str, Any]:
    errors: list[str] = []
    artifact = _require_mapping(artifact, "artifact", errors)
    _validate_common(artifact, CANDIDATE_DRAFT, errors)
    candidate_id = _require_string(artifact, "candidateId", errors)
    if candidate_id and artifact.get("artifactId") != candidate_id:
        errors.append("artifact.candidateId must equal artifact.artifactId")
    _require_string(artifact, "planArtifactId", errors)
    _require_string(artifact, "candidateFingerprint", errors)
    question = _require_mapping(artifact.get("question"), "artifact.question", errors)
    _validate_choices(question, errors)

    answer = _require_mapping(artifact.get("answerContract"), "artifact.answerContract", errors)
    answer_type = _require_string(answer, "answerType", errors, path="artifact.answerContract")
    canonical_answer = _require_string(
        answer, "canonicalAnswer", errors, path="artifact.answerContract"
    )
    equivalence_policy = _require_string(
        answer, "equivalencePolicy", errors, path="artifact.answerContract"
    )
    _require_string(answer, "verificationProfile", errors, path="artifact.answerContract")
    if answer_type and answer_type not in ANSWER_TYPES:
        errors.append("artifact.answerContract.answerType is not supported")
    if equivalence_policy and equivalence_policy not in EQUIVALENCE_POLICIES:
        errors.append("artifact.answerContract.equivalencePolicy is not supported")
    acceptable = answer.get("acceptableAnswers", [])
    if not isinstance(acceptable, list) or any(
        not isinstance(item, str) or not item.strip() for item in acceptable
    ):
        errors.append("artifact.answerContract.acceptableAnswers must be a string array when present")
    if question.get("questionType") == "MCQ":
        if answer_type and answer_type != "choice_index":
            errors.append("MCQ artifact.answerContract.answerType must be choice_index")
        choices = question.get("choices", [])
        try:
            answer_index = int(canonical_answer)
        except (TypeError, ValueError):
            answer_index = 0
        if canonical_answer and (answer_index < 1 or answer_index > len(choices)):
            errors.append("MCQ canonicalAnswer must be a 1-based index within choices")
    elif answer_type == "choice_index":
        errors.append("non-MCQ artifact.answerContract.answerType must not be choice_index")

    solution = _require_mapping(artifact.get("solution"), "artifact.solution", errors)
    _require_string_list(solution, "steps", errors, path="artifact.solution")
    visual_dependency = artifact.get("visualDependency", "NONE")
    if visual_dependency not in {"NONE", "OPTIONAL", "ESSENTIAL"}:
        errors.append("artifact.visualDependency must be NONE, OPTIONAL, or ESSENTIAL")
    if visual_dependency == "ESSENTIAL":
        visual_spec = _require_mapping(artifact.get("visualSpec"), "artifact.visualSpec", errors)
        if visual_spec.get("version", "0.1") != "0.1":
            errors.append("artifact.visualSpec.version must equal 0.1")
        _require_string(visual_spec, "type", errors, path="artifact.visualSpec")
        visual_asset = _require_mapping(artifact.get("visualAsset"), "artifact.visualAsset", errors)
        _require_string(visual_asset, "path", errors, path="artifact.visualAsset")
        asset_type = _require_string(visual_asset, "assetType", errors, path="artifact.visualAsset")
        if asset_type and asset_type != "svg":
            errors.append("artifact.visualAsset.assetType currently supports svg only")
        asset_sha = _require_string(visual_asset, "sha256", errors, path="artifact.visualAsset")
        if asset_sha and not _SHA256.fullmatch(asset_sha):
            errors.append("artifact.visualAsset.sha256 must be a lowercase SHA-256 digest")
        _require_string(visual_asset, "rendererVersion", errors, path="artifact.visualAsset")
        spec_sha = _require_string(visual_asset, "specSha256", errors, path="artifact.visualAsset")
        if spec_sha and not _SHA256.fullmatch(spec_sha):
            errors.append("artifact.visualAsset.specSha256 must be a lowercase SHA-256 digest")
        _require_string(visual_asset, "reportPath", errors, path="artifact.visualAsset")
        if visual_asset.get("deterministicRerender") != "PASS":
            errors.append("artifact.visualAsset.deterministicRerender must PASS")
    return _finish(artifact, errors)


def validate_visual_evidence(artifact: Mapping[str, Any]) -> Mapping[str, Any]:
    errors: list[str] = []
    artifact = _require_mapping(artifact, "artifact", errors)
    _validate_common(artifact, VISUAL_EVIDENCE, errors)
    _require_string(artifact, "candidateArtifactId", errors)
    for key in ("assetSha256", "visualSpecSha256"):
        digest = _require_string(artifact, key, errors)
        if digest and not _SHA256.fullmatch(digest):
            errors.append(f"artifact.{key} must be a lowercase SHA-256 digest")
    checks = _require_mapping(artifact.get("checks"), "artifact.checks", errors)
    required = ("math", "topology", "semanticOwnership", "crop", "labels", "answerLeak", "determinism")
    for name in required:
        _validate_gate(checks.get(name), f"artifact.checks.{name}", errors)
    overall = _require_string(artifact, "overallVerdict", errors)
    if overall and overall not in VERDICTS:
        errors.append("artifact.overallVerdict must be PASS, FAIL, or UNVERIFIED")
    if overall == "PASS" and any(
        not isinstance(checks.get(name), Mapping) or checks[name].get("verdict") != "PASS"
        for name in required
    ):
        errors.append("artifact.overallVerdict cannot PASS unless every visual check PASSes")
    return _finish(artifact, errors)


def _walk_forbidden_keys(value: Any, path: str, errors: list[str]) -> None:
    if isinstance(value, Mapping):
        for key, child in value.items():
            child_path = f"{path}.{key}"
            if key in _BLINDED_FORBIDDEN_KEYS:
                errors.append(f"{child_path} is forbidden in blinded math evidence")
            _walk_forbidden_keys(child, child_path, errors)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            _walk_forbidden_keys(child, f"{path}[{index}]", errors)


def validate_math_evidence(artifact: Mapping[str, Any]) -> Mapping[str, Any]:
    errors: list[str] = []
    artifact = _require_mapping(artifact, "artifact", errors)
    _validate_common(artifact, MATH_EVIDENCE, errors)
    _require_string(artifact, "candidateArtifactId", errors)
    blinded = _require_bool(artifact, "blinded", errors)
    if blinded is False:
        errors.append("artifact.blinded must be true")
    disclosed = _require_string_list(artifact, "inputDisclosure", errors)
    if len(disclosed) != len(set(disclosed)):
        errors.append("artifact.inputDisclosure must not contain duplicates")
    unexpected = sorted(set(disclosed) - _BLINDED_ALLOWED_INPUTS)
    if unexpected:
        errors.append(f"artifact.inputDisclosure contains forbidden inputs: {', '.join(unexpected)}")
    _require_string(artifact, "studentPayloadSha256", errors)
    payload_sha = artifact.get("studentPayloadSha256")
    if isinstance(payload_sha, str) and payload_sha and not _SHA256.fullmatch(payload_sha):
        errors.append("artifact.studentPayloadSha256 must be a lowercase SHA-256 hex digest")
    _require_string(artifact, "derivedAnswer", errors)
    _require_string(artifact, "method", errors)
    _require_string(artifact, "coverage", errors)
    verdict = _require_string(artifact, "verdict", errors)
    if verdict and verdict not in VERDICTS:
        errors.append("artifact.verdict must be PASS, FAIL, or UNVERIFIED")
    _walk_forbidden_keys(artifact, "artifact", errors)
    return _finish(artifact, errors)


def _validate_gate(
    gate: Any, path: str, errors: list[str]
) -> Mapping[str, Any]:
    gate = _require_mapping(gate, path, errors)
    verdict = _require_string(gate, "verdict", errors, path=path)
    if verdict and verdict not in VERDICTS:
        errors.append(f"{path}.verdict must be PASS, FAIL, or UNVERIFIED")
    _require_string_list(gate, "evidence", errors, path=path)
    return gate


def validate_fidelity_evidence(artifact: Mapping[str, Any]) -> Mapping[str, Any]:
    errors: list[str] = []
    artifact = _require_mapping(artifact, "artifact", errors)
    _validate_common(artifact, FIDELITY_EVIDENCE, errors)
    _require_string(artifact, "candidateArtifactId", errors)
    dimensions = _require_mapping(artifact.get("dimensions"), "artifact.dimensions", errors)
    for dimension in _FIDELITY_DIMENSIONS:
        _validate_gate(dimensions.get(dimension), f"artifact.dimensions.{dimension}", errors)
    if "distractor" in dimensions:
        _validate_gate(dimensions.get("distractor"), "artifact.dimensions.distractor", errors)
    overall = _require_string(artifact, "overallVerdict", errors)
    if overall and overall not in VERDICTS:
        errors.append("artifact.overallVerdict must be PASS, FAIL, or UNVERIFIED")
    if overall == "PASS" and any(
        isinstance(dimensions.get(name), Mapping)
        and dimensions[name].get("verdict") != "PASS"
        for name in dimensions
    ):
        errors.append("artifact.overallVerdict cannot PASS unless every dimension PASSes")
    return _finish(artifact, errors)


def validate_candidate_judge_input(artifact: Mapping[str, Any]) -> Mapping[str, Any]:
    errors: list[str] = []
    artifact = _require_mapping(artifact, "artifact", errors)
    _validate_common(artifact, CANDIDATE_JUDGE_INPUT, errors)
    candidate_obj = artifact.get("candidate")
    try:
        candidate = validate_candidate_draft(candidate_obj)
    except ArtifactValidationError as exc:
        errors.extend(f"artifact.candidate: {error}" for error in exc.errors)
        candidate = {}

    math_items = _require_list(artifact, "mathEvidence", errors, minimum=2)
    valid_math: list[Mapping[str, Any]] = []
    for index, item in enumerate(math_items):
        try:
            valid_math.append(validate_math_evidence(item))
        except ArtifactValidationError as exc:
            errors.extend(f"artifact.mathEvidence[{index}]: {error}" for error in exc.errors)

    fidelity_items = _require_list(artifact, "fidelityEvidence", errors, minimum=1)
    valid_fidelity: list[Mapping[str, Any]] = []
    for index, item in enumerate(fidelity_items):
        try:
            valid_fidelity.append(validate_fidelity_evidence(item))
        except ArtifactValidationError as exc:
            errors.extend(f"artifact.fidelityEvidence[{index}]: {error}" for error in exc.errors)

    candidate_artifact_id = candidate.get("artifactId")
    for evidence in (*valid_math, *valid_fidelity):
        if candidate_artifact_id and evidence.get("candidateArtifactId") != candidate_artifact_id:
            errors.append("all evidence must reference artifact.candidate.artifactId")
    _append_identity_errors(valid_math, errors, "artifact.mathEvidence")
    if len({item.get("producerId") for item in valid_math}) != len(valid_math):
        errors.append("artifact.mathEvidence producers must be distinct")
    if valid_math and len({item.get("studentPayloadSha256") for item in valid_math}) != 1:
        errors.append("artifact.mathEvidence must verify the same blinded student payload")
    nested_artifacts = [item for item in [candidate, *valid_math, *valid_fidelity] if item]
    _append_identity_errors(nested_artifacts, errors, "candidate and evidence artifacts")
    all_artifacts = [artifact, *nested_artifacts]
    if len({item.get("artifactId") for item in all_artifacts}) != len(all_artifacts):
        errors.append("judge, candidate, and evidence artifactId values must be disjoint")
    if len({item.get("producerId") for item in all_artifacts}) != len(all_artifacts):
        errors.append("judge, candidate, and evidence producerId values must be disjoint")
    if len({item.get("sourceLockSha256") for item in all_artifacts}) > 1:
        errors.append("judge, candidate, and evidence must reference the same source lock")
    if (
        candidate.get("question", {}).get("questionType") == "MCQ"
        and any("distractor" not in item.get("dimensions", {}) for item in valid_fidelity)
    ):
        errors.append("MCQ fidelity evidence must include the distractor dimension")
    visual_items = artifact.get("visualEvidence", [])
    if not isinstance(visual_items, list):
        errors.append("artifact.visualEvidence must be an array when present")
        visual_items = []
    valid_visual: list[Mapping[str, Any]] = []
    for index, item in enumerate(visual_items):
        try:
            valid_visual.append(validate_visual_evidence(item))
        except ArtifactValidationError as exc:
            errors.extend(f"artifact.visualEvidence[{index}]: {error}" for error in exc.errors)
    if candidate.get("visualDependency", "NONE") == "ESSENTIAL":
        if len(valid_visual) != 1 or valid_visual[0].get("overallVerdict") != "PASS":
            errors.append("ESSENTIAL visual candidate requires exactly one PASS visual evidence artifact")
        elif valid_visual[0].get("candidateArtifactId") != candidate_artifact_id:
            errors.append("visual evidence must reference artifact.candidate.artifactId")
    for evidence in valid_visual:
        if evidence.get("sourceLockSha256") != artifact.get("sourceLockSha256"):
            errors.append("visual evidence must reference the same source lock")
    _append_identity_errors(valid_visual, errors, "artifact.visualEvidence")
    occupied_ids = [item.get("artifactId") for item in [artifact, candidate, *valid_math, *valid_fidelity, *valid_visual] if item]
    if len(occupied_ids) != len(set(occupied_ids)):
        errors.append("visual evidence identity must be disjoint from judge and other evidence")

    verdict = _require_string(artifact, "judgeVerdict", errors)
    if verdict and verdict not in VERDICTS:
        errors.append("artifact.judgeVerdict must be PASS, FAIL, or UNVERIFIED")
    score = artifact.get("score")
    if not isinstance(score, (int, float)) or isinstance(score, bool) or not 0 <= score <= 100:
        errors.append("artifact.score must be a number from 0 through 100")
    return _finish(artifact, errors)


_VALIDATORS = {
    SOURCE_ANALYSIS: validate_source_analysis,
    TRANSFORMATION_PLAN: validate_transformation_plan,
    CANDIDATE_DRAFT: validate_candidate_draft,
    MATH_EVIDENCE: validate_math_evidence,
    FIDELITY_EVIDENCE: validate_fidelity_evidence,
    VISUAL_EVIDENCE: validate_visual_evidence,
    CANDIDATE_JUDGE_INPUT: validate_candidate_judge_input,
    CURRICULUM_FINGERPRINT: validate_curriculum_fingerprint,
    PLAN_CRITIC: validate_plan_critic,
    LOCAL_CHECK: validate_local_check,
}


_KIND_ALIASES = {
    "source_analysis": SOURCE_ANALYSIS,
    "transformation_plan": TRANSFORMATION_PLAN,
    "candidate_draft": CANDIDATE_DRAFT,
    "math_evidence": MATH_EVIDENCE,
    "fidelity_evidence": FIDELITY_EVIDENCE,
    "visual_evidence": VISUAL_EVIDENCE,
    "candidate_judge_input": CANDIDATE_JUDGE_INPUT,
    "curriculum_fingerprint": CURRICULUM_FINGERPRINT,
    "plan_critic": PLAN_CRITIC,
    "local_check": LOCAL_CHECK,
}


def validate_artifact(kind: str, payload: dict, context: dict) -> dict:
    """CLI-facing validator with deterministic context checks.

    ``kind`` accepts a canonical artifact type or its lowercase snake-case alias.
    The validated payload is returned unchanged. Context may lock the source hash,
    producer, lane, or disallow artifact identities already owned by sibling tasks.
    """

    artifact_type = _KIND_ALIASES.get(kind, kind)
    validator = _VALIDATORS.get(artifact_type)
    if validator is None:
        raise ArtifactValidationError((f"unsupported artifactType: {artifact_type!r}",))
    validated = dict(validator(payload))
    errors: list[str] = []
    expected_sha = context.get("sourceLockSha256") or context.get("expectedSourceLockSha256")
    if expected_sha is not None and validated.get("sourceLockSha256") != expected_sha:
        errors.append("artifact source lock does not match validation context")
    expected_producer = context.get("producerId") or context.get("expectedProducerId")
    if expected_producer is not None and validated.get("producerId") != expected_producer:
        errors.append("artifact producer does not match validation context")
    expected_lane = context.get("lane") or context.get("expectedLane")
    actual_lane = validated.get("analysisLane", validated.get("planLane"))
    if expected_lane is not None and actual_lane != expected_lane:
        errors.append("artifact lane does not match validation context")
    forbidden_ids = context.get("forbiddenArtifactIds", [])
    if validated.get("artifactId") in forbidden_ids:
        errors.append("artifact identity is already owned by another task")
    if errors:
        raise ArtifactValidationError(errors)
    return validated


def _append_identity_errors(
    artifacts: Iterable[Mapping[str, Any]], errors: list[str], path: str
) -> None:
    artifacts = list(artifacts)
    for field in ("artifactId", "producerId"):
        values = [artifact.get(field) for artifact in artifacts]
        if len(values) != len(set(values)):
            errors.append(f"{path} must have disjoint {field} values")


def validate_source_analysis_pair(
    analyses: Sequence[Mapping[str, Any]],
) -> tuple[Mapping[str, Any], Mapping[str, Any]]:
    errors: list[str] = []
    if len(analyses) != 2:
        errors.append("source analysis pool must contain exactly A and B")
    valid: list[Mapping[str, Any]] = []
    for index, analysis in enumerate(analyses):
        try:
            valid.append(validate_source_analysis(analysis))
        except ArtifactValidationError as exc:
            errors.extend(f"analyses[{index}]: {error}" for error in exc.errors)
    _append_identity_errors(valid, errors, "source analyses")
    if {item.get("analysisLane") for item in valid} != SOURCE_LANES:
        errors.append("source analysis lanes must be exactly A and B")
    if len({item.get("sourceLockSha256") for item in valid}) > 1:
        errors.append("source analyses must reference the same source lock")
    if len({item.get("sourceQuestionId") for item in valid}) > 1:
        errors.append("source analyses must reference the same source question")
    if errors:
        raise ArtifactValidationError(errors)
    return valid[0], valid[1]


def _failure(code: str, reasons: Sequence[str]) -> dict[str, Any]:
    return {"outcome": "FAIL", "code": code, "reasons": list(reasons), "survivors": []}


def reduce_plan_pool(
    plans: Sequence[Mapping[str, Any]], surviving_plan_ids: Iterable[str] | None = None
) -> dict[str, Any]:
    """Fail-closed deterministic reduction of independently produced plans."""

    errors: list[str] = []
    valid: list[Mapping[str, Any]] = []
    for index, plan in enumerate(plans):
        try:
            valid.append(validate_transformation_plan(plan))
        except ArtifactValidationError as exc:
            errors.extend(f"plans[{index}]: {error}" for error in exc.errors)
    _append_identity_errors(valid, errors, "plans")
    if len({item.get("planLane") for item in valid}) != len(valid):
        errors.append("plans must use disjoint planLane values")
    if len({item.get("sourceLockSha256") for item in valid}) > 1:
        errors.append("plans must reference the same source lock")
    if len({frozenset(item.get("sourceAnalysisIds", [])) for item in valid}) > 1:
        errors.append("plans must reference the same source analysis pair")
    if errors:
        return _failure("PLAN_ARTIFACT_INVALID", errors)

    requested = (
        {str(item) for item in surviving_plan_ids}
        if surviving_plan_ids is not None
        else {str(item["artifactId"]) for item in valid}
    )
    known = {str(item["artifactId"]) for item in valid}
    unknown = sorted(requested - known)
    if unknown:
        return _failure("PLAN_SURVIVOR_UNKNOWN", [f"unknown plan ids: {', '.join(unknown)}"])
    survivors = [item for item in valid if item["artifactId"] in requested]
    if len(survivors) < 2:
        return _failure("INSUFFICIENT_DISTINCT_PLANS", ["at least 2 plans must survive"])
    if len({item["strategyFingerprint"] for item in survivors}) < 2:
        return _failure(
            "INSUFFICIENT_DISTINCT_PLANS",
            ["surviving plans must have at least 2 distinct strategy fingerprints"],
        )
    return {
        "outcome": "PASS",
        "code": "PLAN_POOL_REDUCED",
        "reasons": [],
        "survivors": sorted(item["artifactId"] for item in survivors),
    }


def _judge_passes(judge: Mapping[str, Any]) -> bool:
    if judge.get("judgeVerdict") != "PASS":
        return False
    math_items = judge.get("mathEvidence", [])
    if any(item.get("verdict") != "PASS" for item in math_items):
        return False
    if len({item.get("derivedAnswer") for item in math_items}) != 1:
        return False
    canonical_answer = judge.get("candidate", {}).get("answerContract", {}).get(
        "canonicalAnswer"
    )
    if not isinstance(canonical_answer, str) or any(
        item.get("derivedAnswer", "").strip() != canonical_answer.strip()
        for item in math_items
    ):
        return False
    fidelity_items = judge.get("fidelityEvidence", [])
    if not fidelity_items or not all(
        item.get("overallVerdict") == "PASS" for item in fidelity_items
    ):
        return False
    if judge.get("candidate", {}).get("visualDependency", "NONE") == "ESSENTIAL":
        visual_items = judge.get("visualEvidence", [])
        return len(visual_items) == 1 and visual_items[0].get("overallVerdict") == "PASS"
    return True


def reduce_candidate_pool(
    judge_inputs: Sequence[Mapping[str, Any]],
) -> dict[str, Any]:
    """Select one proven candidate; incomplete or contradictory evidence always fails."""

    errors: list[str] = []
    valid: list[Mapping[str, Any]] = []
    for index, judge in enumerate(judge_inputs):
        try:
            valid.append(validate_candidate_judge_input(judge))
        except ArtifactValidationError as exc:
            errors.extend(f"judgeInputs[{index}]: {error}" for error in exc.errors)
    _append_identity_errors(valid, errors, "candidate judge inputs")
    if errors:
        return _failure("CANDIDATE_JUDGE_INPUT_INVALID", errors)

    candidates = [judge["candidate"] for judge in valid]
    _append_identity_errors(candidates, errors, "candidates")
    if len({candidate.get("sourceLockSha256") for candidate in candidates}) > 1:
        errors.append("candidates must reference the same source lock")
    if errors:
        return _failure("CANDIDATE_IDENTITY_COLLISION", errors)
    candidate_ids = [candidate["artifactId"] for candidate in candidates]
    if len(candidate_ids) < 2 or len(set(candidate_ids)) < 2:
        return _failure(
            "INSUFFICIENT_DISTINCT_CANDIDATES",
            ["at least 2 distinct candidates must reach the final reducer"],
        )
    if len({candidate["candidateFingerprint"] for candidate in candidates}) < 2:
        return _failure(
            "INSUFFICIENT_DISTINCT_CANDIDATES",
            ["candidate fingerprints must prove at least 2 distinct candidates"],
        )
    if len({candidate["planArtifactId"] for candidate in candidates}) < 2:
        return _failure(
            "INSUFFICIENT_DISTINCT_CANDIDATES",
            ["candidates must originate from at least 2 distinct plans"],
        )
    passing = [judge for judge in valid if _judge_passes(judge)]
    if len(passing) < 2:
        return _failure(
            "INSUFFICIENT_PROVEN_CANDIDATES",
            ["at least 2 distinct candidates must survive every required Gate"],
        )
    selected = sorted(
        passing,
        key=lambda item: (-float(item["score"]), item["candidate"]["artifactId"]),
    )[0]
    return {
        "outcome": "PASS",
        "code": "CANDIDATE_SELECTED",
        "reasons": [],
        "survivors": sorted(item["candidate"]["artifactId"] for item in passing),
        "selectedCandidateId": selected["candidate"]["artifactId"],
        "selectedJudgeArtifactId": selected["artifactId"],
    }


reduce_candidate_judgements = reduce_candidate_pool


def _stage_result(
    outcome: str,
    *codes: str,
    manifest_updates: Mapping[str, Any] | None = None,
) -> dict[str, Any]:
    result: dict[str, Any] = {"outcome": outcome, "codes": list(codes)}
    if manifest_updates:
        result["manifestUpdates"] = dict(manifest_updates)
    return result


def _safe_artifact_path(run_dir: Path, relative_path: str) -> Path:
    root = run_dir.resolve()
    candidate = (root / relative_path).resolve()
    try:
        candidate.relative_to(root)
    except ValueError as exc:
        raise ArtifactValidationError((f"artifact path escapes run directory: {relative_path}",)) from exc
    return candidate


def _validate_visual_asset(
    run_dir: Path, candidate: Mapping[str, Any], candidate_path: str
) -> None:
    if candidate.get("visualDependency", "NONE") != "ESSENTIAL":
        return
    visual_asset = candidate["visualAsset"]
    asset_path = _safe_artifact_path(run_dir, visual_asset["path"])
    report_path = _safe_artifact_path(run_dir, visual_asset["reportPath"])
    draft_root = _safe_artifact_path(run_dir, str(Path(candidate_path).parent))
    try:
        asset_path.relative_to(draft_root)
        report_path.relative_to(draft_root)
    except ValueError as error:
        raise ArtifactValidationError(
            ("visual asset and report must stay in the candidate draft directory",)
        ) from error
    if not asset_path.is_file() or asset_path.suffix.lower() != ".svg":
        raise ArtifactValidationError(("ESSENTIAL visual SVG asset is missing",))
    if asset_path.name != "visual.svg" or report_path.name != "visual-render-report.json":
        raise ArtifactValidationError(("visual asset filenames do not match the task contract",))
    if sha256_file(asset_path) != visual_asset["sha256"]:
        raise ArtifactValidationError(("visual asset SHA-256 mismatch",))
    lowered = asset_path.read_text(encoding="utf-8").lower()
    if any(token in lowered for token in (
        "<script", "<foreignobject", 'href="http://', "href='http://",
        'href="https://', "href='https://", "xlink:href",
    )):
        raise ArtifactValidationError(("visual SVG contains active or external content",))
    spec_sha = hashlib.sha256(
        json.dumps(
            candidate["visualSpec"], ensure_ascii=False, sort_keys=True, separators=(",", ":")
        ).encode("utf-8")
    ).hexdigest()
    if spec_sha != visual_asset["specSha256"]:
        raise ArtifactValidationError(("visualSpec SHA-256 mismatch",))
    if not report_path.is_file():
        raise ArtifactValidationError(("visual render report is missing",))
    report = json.loads(report_path.read_text(encoding="utf-8"))
    if (
        report.get("assetSha256") != visual_asset["sha256"]
        or report.get("specSha256") != spec_sha
        or report.get("deterministicRerender") != "PASS"
        or report.get("generativeModelUsed") is not False
    ):
        raise ArtifactValidationError(("visual render provenance did not PASS",))


def _load_json_artifacts(
    run_dir: Path, relative_paths: Sequence[str]
) -> tuple[list[dict[str, Any]], list[str], list[str]]:
    artifacts: list[dict[str, Any]] = []
    missing: list[str] = []
    invalid: list[str] = []
    for relative_path in relative_paths:
        try:
            path = _safe_artifact_path(run_dir, relative_path)
        except ArtifactValidationError as exc:
            invalid.extend(exc.errors)
            continue
        if not path.is_file():
            missing.append(relative_path)
            continue
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, json.JSONDecodeError) as exc:
            invalid.append(f"{relative_path}: {exc}")
            continue
        if not isinstance(payload, dict):
            invalid.append(f"{relative_path}: root must be a JSON object")
            continue
        artifacts.append(payload)
    return artifacts, missing, invalid


def _configured_paths(
    manifest: Mapping[str, Any], key: str, defaults: Sequence[str]
) -> list[str]:
    phase2 = manifest.get("phase2", {})
    if not isinstance(phase2, Mapping):
        raise ArtifactValidationError(("manifest.phase2 must be an object",))
    artifact_paths = phase2.get("artifactPaths", {})
    if not isinstance(artifact_paths, Mapping):
        raise ArtifactValidationError(("manifest.phase2.artifactPaths must be an object",))
    configured = artifact_paths.get(key)
    if configured is None:
        return list(defaults)
    if not isinstance(configured, list) or any(not isinstance(item, str) for item in configured):
        raise ArtifactValidationError((f"manifest.phase2.artifactPaths.{key} must be a string array",))
    return configured


def _discover_judge_paths(run_dir: Path, manifest: Mapping[str, Any]) -> list[str]:
    configured = _configured_paths(manifest, "candidateJudgeInputs", ())
    if configured:
        return configured
    patterns = (
        "candidates/*/judge-input.json",
        "candidates/*/evidence/judge-input.json",
        "evidence/candidate-judge-*.json",
    )
    found: set[str] = set()
    for pattern in patterns:
        for path in run_dir.glob(pattern):
            if path.is_file():
                found.add(path.relative_to(run_dir).as_posix())
    return sorted(found)


def _stage_task_paths(
    manifest: Mapping[str, Any], stage_id: str, artifact_kind: str | None = None
) -> list[str]:
    phase2 = manifest.get("phase2", {})
    tasks = phase2.get("tasks", {}) if isinstance(phase2, Mapping) else {}
    if not isinstance(tasks, Mapping):
        return []
    paths = []
    for task in tasks.values():
        if not isinstance(task, Mapping) or task.get("stageId") != stage_id:
            continue
        if artifact_kind is not None and task.get("artifactKind") != artifact_kind:
            continue
        output = task.get("outputPath")
        if isinstance(output, str):
            paths.append(output)
    return sorted(paths)


def _candidate_slots_from_manifest(manifest: Mapping[str, Any]) -> list[str]:
    phase2 = manifest.get("phase2", {})
    slots = phase2.get("approvedCandidateSlots") if isinstance(phase2, Mapping) else None
    if isinstance(slots, list) and len(slots) >= 2 and all(isinstance(item, str) for item in slots):
        return list(slots)
    return ["a", "b", "c"]


def _load_validated(
    run_dir: Path,
    paths: Sequence[str],
    validator: Any,
    missing_code: str,
    invalid_code: str,
) -> tuple[list[dict[str, Any]] | None, dict[str, Any] | None]:
    artifacts, missing, invalid = _load_json_artifacts(run_dir, paths)
    if invalid:
        return None, _stage_result("FAIL", invalid_code)
    if missing:
        return None, _stage_result("BLOCKED", missing_code)
    validated: list[dict[str, Any]] = []
    try:
        for artifact in artifacts:
            validated.append(dict(validator(artifact)))
    except ArtifactValidationError:
        return None, _stage_result("FAIL", invalid_code)
    return validated, None


def reduce_phase2_stage(stage_id: str, run_dir: Path, manifest: dict) -> dict:
    """CLI-facing, read-only Phase 2 stage reducer.

    Missing expected artifacts are retryable ``BLOCKED`` outcomes. Invalid,
    contradictory, or identity-colliding artifacts are terminal ``FAIL`` for the
    reducer call. This function never mutates ``manifest`` or writes the Run.
    """

    run_dir = Path(run_dir)
    try:
        if stage_id == "R03_SOURCE_ANALYSIS":
            paths = _stage_task_paths(manifest, stage_id) or _configured_paths(
                manifest, "sourceAnalyses", ("source/analysis-a.json", "source/analysis-b.json")
            )
            artifacts, missing, invalid = _load_json_artifacts(run_dir, paths)
            if invalid:
                return _stage_result("FAIL", "SOURCE_ANALYSIS_READ_INVALID")
            if missing:
                return _stage_result("BLOCKED", "SOURCE_ANALYSIS_MISSING")
            try:
                pair = validate_source_analysis_pair(artifacts)
            except ArtifactValidationError:
                return _stage_result("FAIL", "SOURCE_ANALYSIS_INVALID")
            return _stage_result(
                "PASS",
                "SOURCE_ANALYSIS_READY",
                manifest_updates={
                    "phase2": {"sourceAnalysisArtifactIds": [item["artifactId"] for item in pair]}
                },
            )

        if stage_id == "R04_CURRICULUM_FINGERPRINT":
            paths = _stage_task_paths(manifest, stage_id) or ["source/curriculum-fingerprint.json"]
            artifacts, result = _load_validated(
                run_dir, paths, validate_curriculum_fingerprint,
                "CURRICULUM_FINGERPRINT_MISSING", "CURRICULUM_FINGERPRINT_INVALID",
            )
            if result:
                return result
            assert artifacts is not None
            if len(artifacts) != 1:
                return _stage_result("FAIL", "CURRICULUM_FINGERPRINT_COUNT_INVALID")
            return _stage_result(
                "PASS", "CURRICULUM_FINGERPRINT_READY",
                manifest_updates={"phase2": {"curriculumFingerprintArtifactId": artifacts[0]["artifactId"]}},
            )

        if stage_id in {"R05_PLAN_POOL", "R06_PLAN_CRITIC"}:
            paths = _stage_task_paths(manifest, "R05_PLAN_POOL", "transformation_plan") or _configured_paths(
                manifest, "plans", ("plans/plan-a.json", "plans/plan-b.json", "plans/plan-c.json")
            )
            artifacts, missing, invalid = _load_json_artifacts(run_dir, paths)
            if invalid:
                return _stage_result("FAIL", "PLAN_ARTIFACT_READ_INVALID")
            if missing:
                return _stage_result("BLOCKED", "PLAN_ARTIFACT_MISSING")
            surviving_ids: Iterable[str] | None = None
            if stage_id == "R06_PLAN_CRITIC":
                critic_paths = _stage_task_paths(manifest, stage_id, "plan_critic")
                if critic_paths:
                    critics, critic_result = _load_validated(
                        run_dir, critic_paths, validate_plan_critic,
                        "PLAN_CRITIC_DECISION_MISSING", "PLAN_CRITIC_INVALID",
                    )
                    if critic_result:
                        return critic_result
                    if critics is None or len(critics) != 1:
                        return _stage_result("FAIL", "PLAN_CRITIC_COUNT_INVALID")
                    critic_verdict = critics[0].get("verdict") or (
                        "PASS" if len(critics[0]["survivingPlanIds"]) >= 2 else "FAIL"
                    )
                    if critic_verdict != "PASS":
                        return _stage_result("FAIL", "PLAN_CRITIC_REJECTED")
                    surviving_ids = critics[0]["survivingPlanIds"]
                else:
                    phase2 = manifest.get("phase2", {})
                    surviving_ids = phase2.get("survivingPlanIds") if isinstance(phase2, Mapping) else None
                if not isinstance(surviving_ids, list):
                    return _stage_result("BLOCKED", "PLAN_CRITIC_DECISION_MISSING")
            reduced = reduce_plan_pool(artifacts, surviving_ids)
            if reduced["outcome"] != "PASS":
                return _stage_result("FAIL", reduced["code"])
            updates: dict[str, Any] = {"survivingPlanIds": reduced["survivors"]}
            if stage_id == "R06_PLAN_CRITIC":
                lane_by_id = {item["artifactId"]: item["planLane"].lower() for item in artifacts}
                updates["approvedCandidateSlots"] = [lane_by_id[item] for item in reduced["survivors"]]
            return _stage_result("PASS", reduced["code"], manifest_updates={"phase2": updates})

        if stage_id == "R07_CANDIDATE_BUILD":
            paths = _stage_task_paths(manifest, stage_id, "candidate_draft")
            artifacts, result = _load_validated(
                run_dir, paths, validate_candidate_draft,
                "CANDIDATE_DRAFT_MISSING", "CANDIDATE_DRAFT_INVALID",
            )
            if result:
                return result
            assert artifacts is not None
            if len(artifacts) < 2:
                return _stage_result("FAIL", "INSUFFICIENT_DISTINCT_CANDIDATES")
            if len({item["artifactId"] for item in artifacts}) != len(artifacts):
                return _stage_result("FAIL", "CANDIDATE_IDENTITY_COLLISION")
            if len({item["candidateFingerprint"] for item in artifacts}) < 2:
                return _stage_result("FAIL", "INSUFFICIENT_DISTINCT_CANDIDATES")
            if len({item["planArtifactId"] for item in artifacts}) < 2:
                return _stage_result("FAIL", "INSUFFICIENT_DISTINCT_PLANS")
            slots = [Path(path).parts[1] for path in paths]
            for item, path in zip(artifacts, paths, strict=True):
                _validate_visual_asset(run_dir, item, path)
            return _stage_result(
                "PASS", "CANDIDATE_POOL_READY",
                manifest_updates={"phase2": {
                    "approvedCandidateSlots": slots,
                    "candidateArtifactIds": [item["artifactId"] for item in artifacts],
                    "candidateVisualDependencies": {
                        slot: item.get("visualDependency", "NONE")
                        for slot, item in zip(slots, artifacts, strict=True)
                    },
                }},
            )

        if stage_id == "R08_LOCAL_CHECKS":
            paths = _stage_task_paths(manifest, stage_id, "local_check")
            artifacts, result = _load_validated(
                run_dir, paths, validate_local_check,
                "LOCAL_CHECK_MISSING", "LOCAL_CHECK_INVALID",
            )
            if result:
                return result
            assert artifacts is not None
            if len(artifacts) < 2 or any(item["overallVerdict"] != "PASS" for item in artifacts):
                return _stage_result("FAIL", "LOCAL_CHECK_GATE_FAILED")
            if len({item["candidateArtifactId"] for item in artifacts}) != len(artifacts):
                return _stage_result("FAIL", "LOCAL_CHECK_CANDIDATE_COLLISION")
            return _stage_result("PASS", "LOCAL_CHECKS_PASS")

        if stage_id == "R09_INDEPENDENT_MATH":
            paths = _stage_task_paths(manifest, stage_id, "math_evidence")
            artifacts, result = _load_validated(
                run_dir, paths, validate_math_evidence,
                "MATH_EVIDENCE_MISSING", "MATH_EVIDENCE_INVALID",
            )
            if result:
                return result
            assert artifacts is not None
            grouped: dict[str, list[dict[str, Any]]] = {}
            for item in artifacts:
                grouped.setdefault(item["candidateArtifactId"], []).append(item)
            expected = manifest.get("phase2", {}).get("candidateArtifactIds", [])
            if not isinstance(expected, list) or set(grouped) != set(expected):
                return _stage_result("FAIL", "MATH_EVIDENCE_COVERAGE_INVALID")
            candidate_paths = _stage_task_paths(manifest, "R07_CANDIDATE_BUILD", "candidate_draft")
            candidates, candidate_result = _load_validated(
                run_dir, candidate_paths, validate_candidate_draft,
                "CANDIDATE_DRAFT_MISSING", "CANDIDATE_DRAFT_INVALID",
            )
            if candidate_result:
                return candidate_result
            answer_by_id = {
                item["artifactId"]: item["answerContract"]["canonicalAnswer"].strip()
                for item in (candidates or [])
            }
            for candidate_id, items in grouped.items():
                if len(items) != 2 or len({item["producerId"] for item in items}) != 2:
                    return _stage_result("FAIL", "MATH_VERIFIER_INDEPENDENCE_INVALID")
                if any(item["verdict"] != "PASS" for item in items):
                    return _stage_result("FAIL", "MATH_GATE_FAILED")
                if len({item["derivedAnswer"].strip() for item in items}) != 1:
                    return _stage_result("FAIL", "MATH_ANSWER_CONFLICT")
                if items[0]["derivedAnswer"].strip() != answer_by_id.get(candidate_id):
                    return _stage_result("FAIL", "MATH_ANSWER_CONTRACT_MISMATCH")
            return _stage_result("PASS", "INDEPENDENT_MATH_PASS")

        if stage_id in {"R10_QUALITY_GATES", "R11_DISTRACTOR"}:
            paths = _stage_task_paths(manifest, stage_id, "fidelity_evidence")
            artifacts, result = _load_validated(
                run_dir, paths, validate_fidelity_evidence,
                "FIDELITY_EVIDENCE_MISSING", "FIDELITY_EVIDENCE_INVALID",
            )
            if result:
                return result
            assert artifacts is not None
            expected = manifest.get("phase2", {}).get("candidateArtifactIds", [])
            if len(artifacts) < 2 or {item["candidateArtifactId"] for item in artifacts} != set(expected):
                return _stage_result("FAIL", "FIDELITY_EVIDENCE_COVERAGE_INVALID")
            if any(item["overallVerdict"] != "PASS" for item in artifacts):
                return _stage_result("FAIL", "FIDELITY_GATE_FAILED")
            if stage_id == "R10_QUALITY_GATES":
                candidate_paths = _stage_task_paths(
                    manifest, "R07_CANDIDATE_BUILD", "candidate_draft"
                )
                candidates, candidate_result = _load_validated(
                    run_dir, candidate_paths, validate_candidate_draft,
                    "CANDIDATE_DRAFT_MISSING", "CANDIDATE_DRAFT_INVALID",
                )
                if candidate_result:
                    return candidate_result
                visual_candidates = {
                    item["artifactId"]: item for item in (candidates or [])
                    if item.get("visualDependency", "NONE") == "ESSENTIAL"
                }
                visual_paths = _stage_task_paths(manifest, stage_id, "visual_evidence")
                if visual_candidates:
                    visual_artifacts, visual_result = _load_validated(
                        run_dir, visual_paths, validate_visual_evidence,
                        "VISUAL_EVIDENCE_MISSING", "VISUAL_EVIDENCE_INVALID",
                    )
                    if visual_result:
                        return visual_result
                    visual_by_id = {
                        item["candidateArtifactId"]: item for item in (visual_artifacts or [])
                    }
                    if set(visual_by_id) != set(visual_candidates):
                        return _stage_result("FAIL", "VISUAL_EVIDENCE_COVERAGE_INVALID")
                    for candidate_id, evidence in visual_by_id.items():
                        visual_asset = visual_candidates[candidate_id]["visualAsset"]
                        if (
                            evidence["overallVerdict"] != "PASS"
                            or evidence["assetSha256"] != visual_asset["sha256"]
                            or evidence["visualSpecSha256"] != visual_asset["specSha256"]
                        ):
                            return _stage_result("FAIL", "VISUAL_GATE_FAILED")
                elif visual_paths:
                    return _stage_result("FAIL", "UNEXPECTED_VISUAL_EVIDENCE")
            if stage_id == "R11_DISTRACTOR":
                candidate_paths = _stage_task_paths(
                    manifest, "R07_CANDIDATE_BUILD", "candidate_draft"
                )
                candidates, candidate_result = _load_validated(
                    run_dir, candidate_paths, validate_candidate_draft,
                    "CANDIDATE_DRAFT_MISSING", "CANDIDATE_DRAFT_INVALID",
                )
                if candidate_result:
                    return candidate_result
                question_type_by_id = {
                    item["artifactId"]: item["question"]["questionType"]
                    for item in (candidates or [])
                }
                if any(
                    question_type_by_id.get(item["candidateArtifactId"]) == "MCQ"
                    and "distractor" not in item["dimensions"]
                    for item in artifacts
                ):
                    return _stage_result("FAIL", "DISTRACTOR_GATE_MISSING")
            return _stage_result(
                "PASS", "RESPONSE_FORM_GATE_PASS" if stage_id == "R11_DISTRACTOR" else "QUALITY_GATES_PASS"
            )

        if stage_id == "R12_FINAL_REDUCER":
            paths = _stage_task_paths(manifest, stage_id, "candidate_judge_input") or _discover_judge_paths(run_dir, manifest)
            if not paths:
                return _stage_result("BLOCKED", "CANDIDATE_JUDGE_INPUT_MISSING")
            artifacts, missing, invalid = _load_json_artifacts(run_dir, paths)
            if invalid:
                return _stage_result("FAIL", "CANDIDATE_JUDGE_INPUT_READ_INVALID")
            if missing:
                return _stage_result("BLOCKED", "CANDIDATE_JUDGE_INPUT_MISSING")
            reduced = reduce_candidate_pool(artifacts)
            if reduced["outcome"] != "PASS":
                return _stage_result("FAIL", reduced["code"])
            return _stage_result(
                "PASS",
                reduced["code"],
                manifest_updates={
                    "phase2": {
                        "survivingCandidateIds": reduced["survivors"],
                        "selectedCandidateId": reduced["selectedCandidateId"],
                        "selectedJudgeArtifactId": reduced["selectedJudgeArtifactId"],
                    }
                },
            )
    except ArtifactValidationError:
        return _stage_result("FAIL", "PHASE2_MANIFEST_CONTRACT_INVALID")
    return _stage_result("FAIL", "PHASE2_STAGE_UNSUPPORTED")


__all__ = [
    "ArtifactValidationError",
    "CANDIDATE_DRAFT",
    "CANDIDATE_JUDGE_INPUT",
    "FIDELITY_EVIDENCE",
    "MATH_EVIDENCE",
    "SCHEMA_VERSION",
    "SOURCE_ANALYSIS",
    "TRANSFORMATION_PLAN",
    "reduce_candidate_judgements",
    "reduce_candidate_pool",
    "reduce_plan_pool",
    "reduce_phase2_stage",
    "validate_artifact",
    "validate_candidate_draft",
    "validate_candidate_judge_input",
    "validate_fidelity_evidence",
    "validate_math_evidence",
    "validate_source_analysis",
    "validate_source_analysis_pair",
    "validate_transformation_plan",
]
