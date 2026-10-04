from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class TaskTemplate:
    artifact_kind: str
    slot: str
    agent: str
    output_path: str
    input_refs: tuple[dict[str, Any], ...]
    forbidden_inputs: tuple[str, ...] = ()


def _source_analysis_contract(
    manifest: dict[str, Any], source_question_id: str | None
) -> dict[str, str]:
    source_lock = manifest.get("sourceLock")
    if not isinstance(source_lock, dict):
        raise ValueError("R03 source analysis requires a source lock")
    source_lock_sha256 = source_lock.get("sha256")
    if not isinstance(source_lock_sha256, str) or not source_lock_sha256:
        raise ValueError("R03 source analysis requires sourceLock.sha256")
    question_ordinal = source_lock.get("questionOrdinal")
    if isinstance(question_ordinal, bool) or not isinstance(question_ordinal, int) or question_ordinal < 1:
        raise ValueError("R03 source analysis requires a positive sourceLock.questionOrdinal")
    return {
        "sourceLockSha256": source_lock_sha256,
        "sourceQuestionId": source_question_id or str(question_ordinal),
    }


def _candidate_slots(manifest: dict[str, Any]) -> list[str]:
    approved = manifest.get("phase2", {}).get("approvedCandidateSlots")
    if isinstance(approved, list) and approved:
        return [str(slot) for slot in approved]
    return ["a", "b", "c"]


def templates_for_stage(stage_id: str, manifest: dict[str, Any]) -> list[TaskTemplate]:
    source_student = {"path": "source/source-question.json", "view": "STUDENT_PAYLOAD_ONLY"}
    source_full = {"path": "source/source-question.json", "view": "FULL_LOCKED_SOURCE"}
    fingerprint = {"path": "source/curriculum-fingerprint.json", "view": "FULL"}

    if stage_id == "R03_SOURCE_ANALYSIS":
        return [
            TaskTemplate(
                "source_analysis",
                "a",
                "alive_source_analyst",
                "source/analysis-a.json",
                (source_full,),
                ("source/analysis-b.json",),
            ),
            TaskTemplate(
                "source_analysis",
                "b",
                "alive_source_analyst",
                "source/analysis-b.json",
                (source_student,),
                ("source/analysis-a.json", "source answer", "source solution"),
            ),
        ]
    if stage_id == "R04_CURRICULUM_FINGERPRINT":
        return [
            TaskTemplate(
                "curriculum_fingerprint",
                "main",
                "alive_fidelity_reviewer",
                "source/curriculum-fingerprint.json",
                (
                    {"path": "source/analysis-a.json", "view": "FULL"},
                    {"path": "source/analysis-b.json", "view": "FULL"},
                    source_full,
                ),
            )
        ]
    if stage_id == "R05_PLAN_POOL":
        return [
            TaskTemplate(
                "transformation_plan",
                slot,
                "alive_plan_designer",
                f"plans/plan-{slot}.json",
                (fingerprint, source_student),
                tuple(f"plans/plan-{other}.json" for other in "abc" if other != slot),
            )
            for slot in "abc"
        ]
    if stage_id == "R06_PLAN_CRITIC":
        return [
            TaskTemplate(
                "plan_critic",
                "main",
                "alive_fidelity_reviewer",
                "plans/critic.json",
                tuple({"path": f"plans/plan-{slot}.json", "view": "FULL"} for slot in "abc")
                + (fingerprint,),
            )
        ]
    if stage_id == "R07_CANDIDATE_BUILD":
        plan_slots = manifest.get("phase2", {}).get("approvedCandidateSlots") or ["a", "b", "c"]
        return [
            TaskTemplate(
                "candidate_draft",
                str(slot),
                "alive_candidate_builder",
                f"candidates/{slot}/draft/candidate.json",
                (
                    {"path": f"plans/plan-{slot}.json", "view": "FULL"},
                    fingerprint,
                    source_student,
                ),
                tuple(f"candidates/{other}/" for other in "abc" if other != slot)
                + ("independent math evidence",),
            )
            for slot in plan_slots
        ]
    if stage_id == "R08_LOCAL_CHECKS":
        return [
            TaskTemplate(
                "local_check",
                slot,
                "alive_fidelity_reviewer",
                f"candidates/{slot}/evidence/local-check.json",
                ({"path": f"candidates/{slot}/draft/candidate.json", "view": "FULL"},),
            )
            for slot in _candidate_slots(manifest)
        ]
    if stage_id == "R09_INDEPENDENT_MATH":
        return [
            TaskTemplate(
                "math_evidence",
                f"{slot}-{verifier}",
                "alive_math_verifier",
                f"candidates/{slot}/evidence/math-{verifier}.json",
                ({"path": f"candidates/{slot}/draft/candidate.json", "view": "STUDENT_PAYLOAD_ONLY"},),
                (
                    "candidate answer",
                    "candidate solution",
                    "source answer",
                    "source solution",
                    "plans/",
                    "builder notes",
                ),
            )
            for slot in _candidate_slots(manifest)
            for verifier in ("i2", "i3")
        ]
    if stage_id == "R10_QUALITY_GATES":
        packets = [
            TaskTemplate(
                "fidelity_evidence",
                slot,
                "alive_fidelity_reviewer",
                f"candidates/{slot}/evidence/fidelity.json",
                (
                    {"path": f"candidates/{slot}/draft/candidate.json", "view": "FULL"},
                    {"path": f"candidates/{slot}/evidence/math-i2.json", "view": "RESULT_ONLY"},
                    {"path": f"candidates/{slot}/evidence/math-i3.json", "view": "RESULT_ONLY"},
                    fingerprint,
                    source_student,
                ),
            )
            for slot in _candidate_slots(manifest)
        ]
        dependencies = manifest.get("phase2", {}).get("candidateVisualDependencies", {})
        packets.extend(
            TaskTemplate(
                "visual_evidence",
                slot,
                "alive_visual_reviewer",
                f"candidates/{slot}/evidence/visual.json",
                (
                    {"path": f"candidates/{slot}/draft/candidate.json", "view": "FULL"},
                    {"path": f"candidates/{slot}/draft/visual.svg", "view": "ASSET"},
                    {"path": f"candidates/{slot}/draft/visual-render-report.json", "view": "FULL"},
                    fingerprint,
                ),
            )
            for slot in _candidate_slots(manifest)
            if dependencies.get(slot) == "ESSENTIAL"
        )
        return packets
    if stage_id == "R11_DISTRACTOR":
        return [
            TaskTemplate(
                "fidelity_evidence",
                slot,
                "alive_fidelity_reviewer",
                f"candidates/{slot}/evidence/fidelity-final.json",
                (
                    {"path": f"candidates/{slot}/draft/candidate.json", "view": "FULL"},
                    {"path": f"candidates/{slot}/evidence/fidelity.json", "view": "FULL"},
                    {"path": f"candidates/{slot}/evidence/math-i2.json", "view": "RESULT_ONLY"},
                    {"path": f"candidates/{slot}/evidence/math-i3.json", "view": "RESULT_ONLY"},
                ),
            )
            for slot in _candidate_slots(manifest)
        ]
    if stage_id == "R12_FINAL_REDUCER":
        dependencies = manifest.get("phase2", {}).get("candidateVisualDependencies", {})
        return [
            TaskTemplate(
                "candidate_judge_input",
                slot,
                "alive_fidelity_reviewer",
                f"candidates/{slot}/evidence/judge-input.json",
                (
                    {"path": f"candidates/{slot}/draft/candidate.json", "view": "STUDENT_PAYLOAD_AND_PROVENANCE"},
                    {"path": f"candidates/{slot}/evidence/local-check.json", "view": "FULL"},
                    {"path": f"candidates/{slot}/evidence/math-i2.json", "view": "RESULT_ONLY"},
                    {"path": f"candidates/{slot}/evidence/math-i3.json", "view": "RESULT_ONLY"},
                    {"path": f"candidates/{slot}/evidence/fidelity-final.json", "view": "FULL"},
                ) + (
                    ({"path": f"candidates/{slot}/evidence/visual.json", "view": "FULL"},)
                    if dependencies.get(slot) == "ESSENTIAL" else ()
                ),
                ("builder notes", "unselected private reasoning"),
            )
            for slot in _candidate_slots(manifest)
        ]
    raise ValueError(f"stage does not have Phase 2 task templates: {stage_id}")


def build_task_packets(
    stage_id: str, manifest: dict[str, Any], *, source_question_id: str | None = None
) -> list[dict[str, Any]]:
    packets: list[dict[str, Any]] = []
    source_analysis_contract = (
        _source_analysis_contract(manifest, source_question_id)
        if stage_id == "R03_SOURCE_ANALYSIS" else None
    )
    for template in templates_for_stage(stage_id, manifest):
        task_id = f"{stage_id}:{template.artifact_kind}:{template.slot}"
        contract_hints: list[str] = []
        if template.artifact_kind == "math_evidence":
            contract_hints.append("For MCQ, derivedAnswer is the student-facing 1-based choice index.")
        if stage_id == "R11_DISTRACTOR":
            contract_hints.append(
                "MCQ requires the exact singular key dimensions.distractor; "
                "SHORT_ANSWER and CONSTRUCTED_RESPONSE omit distractor and verify response form instead."
            )
        if template.artifact_kind == "candidate_judge_input":
            contract_hints.append("mathEvidence and fidelityEvidence are arrays of full artifacts.")
        packet = {
            "taskId": task_id,
            "stageId": stage_id,
            "artifactKind": template.artifact_kind,
            "slot": template.slot,
            "agent": template.agent,
            "producerId": task_id,
            "inputRefs": list(template.input_refs),
            "forbiddenInputs": list(template.forbidden_inputs),
            "contractHints": contract_hints,
            "outputPath": template.output_path,
            "status": "PENDING",
        }
        if source_analysis_contract is not None:
            packet.update(source_analysis_contract)
            contract_hints.append(
                "sourceQuestionId must equal the packet's canonical source artifact ID, "
                "or the 1-based sourceLock.questionOrdinal when the source has no ID."
            )
        packets.append(packet)
    return packets
