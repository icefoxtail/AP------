from __future__ import annotations

import copy
import json
import tempfile
import unittest
from pathlib import Path

from alive.engine.phase2_artifacts import (
    ArtifactValidationError,
    reduce_candidate_pool,
    reduce_phase2_stage,
    reduce_plan_pool,
    validate_artifact,
    validate_candidate_draft,
    validate_candidate_judge_input,
    validate_math_evidence,
    validate_source_analysis_pair,
)
from alive.engine.visual_renderer import render_visual_file


SHA = "a" * 64
PAYLOAD_SHA = "b" * 64


def common(artifact_type: str, artifact_id: str, producer: str) -> dict[str, object]:
    return {
        "schemaVersion": "0.2.0",
        "artifactType": artifact_type,
        "artifactId": artifact_id,
        "producerId": producer,
        "sourceLockSha256": SHA,
    }


def source_analysis(lane: str) -> dict[str, object]:
    return {
        **common("SOURCE_ANALYSIS", f"analysis-{lane.lower()}", f"analyst-{lane.lower()}"),
        "analysisLane": lane,
        "sourceQuestionId": "q-19",
        "curriculum": {"course": "공통수학2", "unitKey": "H1-CM2-01"},
        "solutionStructure": ["조건 해석", "식 구성", "결론"],
        "sourceFingerprint": {
            "coreInvariants": ["두 조건의 결합"],
            "mutableFeatures": ["계수", "질문 대상"],
        },
        "assumptions": [],
        "unresolvedPoints": [],
    }


def plan(lane: str, fingerprint: str | None = None) -> dict[str, object]:
    return {
        **common("TRANSFORMATION_PLAN", f"plan-{lane.lower()}", f"planner-{lane.lower()}"),
        "planLane": lane,
        "strategy": f"strategy {lane}",
        "strategyFingerprint": fingerprint or f"strategy-fp-{lane.lower()}",
        "sourceAnalysisIds": ["analysis-a", "analysis-b"],
        "lockedCore": ["두 조건의 결합"],
        "allowedChanges": ["계수 변경"],
        "forbiddenChanges": ["단순 숫자갈이"],
        "expectedDifficultyDelta": "same",
        "proofObligations": ["정답 유일성"],
    }


def candidate(label: str, plan_id: str) -> dict[str, object]:
    return {
        **common("CANDIDATE_DRAFT", f"candidate-{label}", f"builder-{label}"),
        "candidateId": f"candidate-{label}",
        "planArtifactId": plan_id,
        "candidateFingerprint": f"candidate-fp-{label}",
        "question": {
            "questionType": "MCQ",
            "content": "방정식의 해를 구하여라.",
            "choices": ["$1$", "$2$", "$3$", "$4$", "$5$"],
        },
        "answerContract": {
            "answerType": "choice_index",
            "canonicalAnswer": "2",
            "equivalencePolicy": "exact_index",
            "verificationProfile": "EXACT",
        },
        "solution": {"steps": ["식을 정리한다.", "해를 구한다."]},
    }


def math_evidence(label: str, candidate_id: str, answer: str = "2") -> dict[str, object]:
    return {
        **common("MATH_EVIDENCE", f"math-{candidate_id}-{label}", f"solver-{label}"),
        "candidateArtifactId": candidate_id,
        "blinded": True,
        "inputDisclosure": ["questionType", "content", "choices"],
        "studentPayloadSha256": PAYLOAD_SHA,
        "derivedAnswer": answer,
        "method": "독립 대수 계산",
        "coverage": "모든 보기를 대입하여 확인",
        "verdict": "PASS",
        "inputSnapshot": {"content": "방정식", "choices": ["1", "2"]},
    }


def fidelity(label: str, candidate_id: str) -> dict[str, object]:
    dimensions = {
        name: {"verdict": "PASS", "evidence": [f"{name} checked"]}
        for name in ("curriculum", "fidelity", "difficulty", "antiClone", "distractor")
    }
    return {
        **common("FIDELITY_EVIDENCE", f"fidelity-{candidate_id}-{label}", f"reviewer-{label}"),
        "candidateArtifactId": candidate_id,
        "dimensions": dimensions,
        "overallVerdict": "PASS",
    }


def judge(label: str, plan_id: str, score: int = 90) -> dict[str, object]:
    draft = candidate(label, plan_id)
    candidate_id = str(draft["artifactId"])
    return {
        **common("CANDIDATE_JUDGE_INPUT", f"judge-{label}", f"judge-agent-{label}"),
        "candidate": draft,
        "mathEvidence": [
            math_evidence(f"{label}-i2", candidate_id),
            math_evidence(f"{label}-i3", candidate_id),
        ],
        "fidelityEvidence": [fidelity(label, candidate_id)],
        "judgeVerdict": "PASS",
        "score": score,
    }


class Phase2ArtifactTests(unittest.TestCase):
    def test_intermediate_stage_reducers_cover_r04_through_r11(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            run_dir = Path(temporary)
            tasks: dict[str, dict[str, str]] = {}

            def write(stage: str, kind: str, relative: str, payload: dict[str, object]) -> None:
                path = run_dir / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
                tasks[relative] = {"stageId": stage, "artifactKind": kind, "outputPath": relative}

            fingerprint = {
                **common("CURRICULUM_FINGERPRINT", "fingerprint-1", "fingerprinter"),
                "sourceAnalysisIds": ["analysis-a", "analysis-b"],
                "curriculum": {"course": "공통수학2", "unitKey": "H22-C2-07"},
                "coreInvariants": ["핵심 조건"],
                "mutableFeatures": ["계수"],
                "proofObligations": ["정답 유일성"],
            }
            write("R04_CURRICULUM_FINGERPRINT", "curriculum_fingerprint", "source/curriculum-fingerprint.json", fingerprint)
            for lane in ("A", "B", "C"):
                write("R05_PLAN_POOL", "transformation_plan", f"plans/plan-{lane.lower()}.json", plan(lane))
            critic = {
                **common("PLAN_CRITIC", "critic-1", "critic"),
                "planArtifactIds": ["plan-a", "plan-b", "plan-c"],
                "survivingPlanIds": ["plan-a", "plan-b"],
                "verdict": "PASS",
                "reasons": ["독립 전략 두 개 유지"],
            }
            write("R06_PLAN_CRITIC", "plan_critic", "plans/critic.json", critic)
            for label in ("a", "b"):
                draft = candidate(label, f"plan-{label}")
                write("R07_CANDIDATE_BUILD", "candidate_draft", f"candidates/{label}/draft/candidate.json", draft)
                local = {
                    **common("LOCAL_CHECK", f"local-{label}", f"local-checker-{label}"),
                    "candidateArtifactId": f"candidate-{label}",
                    "checks": [{"name": "schema", "verdict": "PASS", "evidence": ["validated"]}],
                    "overallVerdict": "PASS",
                }
                write("R08_LOCAL_CHECKS", "local_check", f"candidates/{label}/evidence/local-check.json", local)
                for verifier in ("i2", "i3"):
                    write(
                        "R09_INDEPENDENT_MATH", "math_evidence",
                        f"candidates/{label}/evidence/math-{verifier}.json",
                        math_evidence(f"{label}-{verifier}", f"candidate-{label}"),
                    )
                quality = fidelity(f"{label}-quality", f"candidate-{label}")
                write("R10_QUALITY_GATES", "fidelity_evidence", f"candidates/{label}/evidence/fidelity.json", quality)
                final_fidelity = fidelity(f"{label}-final", f"candidate-{label}")
                write("R11_DISTRACTOR", "fidelity_evidence", f"candidates/{label}/evidence/fidelity-final.json", final_fidelity)

            manifest: dict[str, object] = {"phase2": {"tasks": tasks}}
            self.assertEqual("PASS", reduce_phase2_stage("R04_CURRICULUM_FINGERPRINT", run_dir, manifest)["outcome"])
            self.assertEqual("PASS", reduce_phase2_stage("R05_PLAN_POOL", run_dir, manifest)["outcome"])
            critic_result = reduce_phase2_stage("R06_PLAN_CRITIC", run_dir, manifest)
            self.assertEqual("PASS", critic_result["outcome"])
            manifest["phase2"].update(critic_result["manifestUpdates"]["phase2"])  # type: ignore[union-attr,index]
            candidate_result = reduce_phase2_stage("R07_CANDIDATE_BUILD", run_dir, manifest)
            self.assertEqual("PASS", candidate_result["outcome"])
            manifest["phase2"].update(candidate_result["manifestUpdates"]["phase2"])  # type: ignore[union-attr,index]
            for stage in (
                "R08_LOCAL_CHECKS", "R09_INDEPENDENT_MATH", "R10_QUALITY_GATES", "R11_DISTRACTOR"
            ):
                self.assertEqual("PASS", reduce_phase2_stage(stage, run_dir, manifest)["outcome"], stage)

    def test_source_analyses_require_disjoint_a_b_identity(self) -> None:
        first, second = validate_source_analysis_pair([source_analysis("A"), source_analysis("B")])
        self.assertNotEqual(first["artifactId"], second["artifactId"])

        duplicate = source_analysis("B")
        duplicate["producerId"] = "analyst-a"
        with self.assertRaises(ArtifactValidationError):
            validate_source_analysis_pair([source_analysis("A"), duplicate])

    def test_candidate_choices_must_not_embed_rendered_labels(self) -> None:
        draft = candidate("a", "plan-a")
        draft["question"]["choices"][0] = "① $1$"  # type: ignore[index]
        with self.assertRaisesRegex(ArtifactValidationError, "rendered choice label"):
            validate_candidate_draft(draft)

    def test_constructed_response_passes_r11_without_distractor_dimension(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            run_dir = Path(temporary)
            tasks: dict[str, dict[str, str]] = {}
            for label in ("a", "b"):
                draft = candidate(label, f"plan-{label}")
                draft["question"] = {
                    "questionType": "CONSTRUCTED_RESPONSE",
                    "content": "풀이 과정을 서술하여라.",
                    "choices": [],
                }
                draft["answerContract"] = {
                    "answerType": "expression",
                    "canonicalAnswer": "x=2",
                    "acceptableAnswers": [],
                    "equivalencePolicy": "normalized_string",
                    "verificationProfile": "EXACT",
                }
                candidate_path = f"candidates/{label}/draft/candidate.json"
                path = run_dir / candidate_path
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(json.dumps(draft, ensure_ascii=False), encoding="utf-8")
                tasks[candidate_path] = {
                    "stageId": "R07_CANDIDATE_BUILD",
                    "artifactKind": "candidate_draft",
                    "outputPath": candidate_path,
                }
                evidence = fidelity(f"{label}-response", f"candidate-{label}")
                del evidence["dimensions"]["distractor"]  # type: ignore[index]
                evidence_path = f"candidates/{label}/evidence/fidelity-final.json"
                target = run_dir / evidence_path
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(json.dumps(evidence, ensure_ascii=False), encoding="utf-8")
                tasks[evidence_path] = {
                    "stageId": "R11_DISTRACTOR",
                    "artifactKind": "fidelity_evidence",
                    "outputPath": evidence_path,
                }
            manifest = {
                "phase2": {
                    "tasks": tasks,
                    "candidateArtifactIds": ["candidate-a", "candidate-b"],
                }
            }
            result = reduce_phase2_stage("R11_DISTRACTOR", run_dir, manifest)
            self.assertEqual("PASS", result["outcome"], result)
            self.assertEqual("RESPONSE_FORM_GATE_PASS", result["codes"][0])

    def test_r07_visual_candidate_requires_hash_locked_deterministic_asset(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            run_dir = Path(temporary)
            tasks: dict[str, dict[str, str]] = {}
            for label in ("a", "b"):
                draft_dir = run_dir / f"candidates/{label}/draft"
                draft_dir.mkdir(parents=True)
                spec = {
                    "version": "0.1", "type": "coordinate_plane",
                    "width": 200, "height": 200, "xRange": [-2, 2], "yRange": [-2, 2],
                    "points": [{"x": 1, "y": 1, "label": label.upper()}],
                }
                spec_path = draft_dir / "visual-spec.json"
                spec_path.write_text(json.dumps(spec), encoding="utf-8")
                report = render_visual_file(
                    spec_path, draft_dir / "visual.svg", draft_dir / "visual-render-report.json"
                )
                draft = candidate(label, f"plan-{label}")
                draft.update({
                    "visualDependency": "ESSENTIAL", "visualSpec": spec,
                    "visualAsset": {
                        "path": f"candidates/{label}/draft/visual.svg", "assetType": "svg",
                        "sha256": report["assetSha256"], "specSha256": report["specSha256"],
                        "rendererVersion": report["rendererVersion"],
                        "reportPath": f"candidates/{label}/draft/visual-render-report.json",
                        "deterministicRerender": "PASS",
                    },
                })
                candidate_path = f"candidates/{label}/draft/candidate.json"
                (run_dir / candidate_path).write_text(
                    json.dumps(draft, ensure_ascii=False), encoding="utf-8"
                )
                tasks[candidate_path] = {
                    "stageId": "R07_CANDIDATE_BUILD", "artifactKind": "candidate_draft",
                    "outputPath": candidate_path,
                }
            manifest = {"phase2": {"tasks": tasks}}
            result = reduce_phase2_stage("R07_CANDIDATE_BUILD", run_dir, manifest)
            self.assertEqual("PASS", result["outcome"], result)
            (run_dir / "candidates/a/draft/visual.svg").write_text("tampered", encoding="utf-8")
            failed = reduce_phase2_stage("R07_CANDIDATE_BUILD", run_dir, manifest)
            self.assertEqual("FAIL", failed["outcome"])

    def test_math_evidence_must_be_blinded(self) -> None:
        evidence = math_evidence("i2", "candidate-a")
        evidence["inputDisclosure"].append("answerContract")  # type: ignore[union-attr]
        evidence["inputSnapshot"]["intendedAnswer"] = "2"  # type: ignore[index]
        with self.assertRaisesRegex(ArtifactValidationError, "forbidden"):
            validate_math_evidence(evidence)

        top_level_leak = math_evidence("i3", "candidate-a")
        top_level_leak["sourceSolution"] = "hidden source solution"
        with self.assertRaisesRegex(ArtifactValidationError, "sourceSolution"):
            validate_math_evidence(top_level_leak)

    def test_cli_validator_applies_context_locks(self) -> None:
        validated = validate_artifact(
            "source_analysis",
            source_analysis("A"),
            {"sourceLockSha256": SHA, "expectedLane": "A"},
        )
        self.assertEqual("analysis-a", validated["artifactId"])
        with self.assertRaises(ArtifactValidationError):
            validate_artifact(
                "SOURCE_ANALYSIS", source_analysis("A"), {"expectedLane": "B"}
            )

    def test_judge_requires_two_disjoint_math_verifiers(self) -> None:
        artifact = judge("a", "plan-a")
        artifact["mathEvidence"][1]["producerId"] = artifact["mathEvidence"][0]["producerId"]  # type: ignore[index]
        with self.assertRaisesRegex(ArtifactValidationError, "producers must be distinct"):
            validate_candidate_judge_input(artifact)

    def test_judge_rejects_cross_artifact_identity_or_source_collision(self) -> None:
        artifact = judge("a", "plan-a")
        artifact["mathEvidence"][0]["artifactId"] = artifact["candidate"]["artifactId"]  # type: ignore[index]
        artifact["fidelityEvidence"][0]["sourceLockSha256"] = "c" * 64  # type: ignore[index]
        with self.assertRaises(ArtifactValidationError) as caught:
            validate_candidate_judge_input(artifact)
        message = str(caught.exception)
        self.assertIn("artifactId", message)
        self.assertIn("same source lock", message)

    def test_mcq_distractor_failure_cannot_hide_behind_overall_pass(self) -> None:
        artifact = judge("a", "plan-a")
        artifact["fidelityEvidence"][0]["dimensions"]["distractor"]["verdict"] = "FAIL"  # type: ignore[index]
        with self.assertRaisesRegex(ArtifactValidationError, "every dimension"):
            validate_candidate_judge_input(artifact)

    def test_plan_reducer_requires_two_surviving_distinct_strategies(self) -> None:
        result = reduce_plan_pool([plan("A"), plan("B"), plan("C")], ["plan-a"])
        self.assertEqual("FAIL", result["outcome"])
        self.assertEqual("INSUFFICIENT_DISTINCT_PLANS", result["code"])

        same = reduce_plan_pool(
            [plan("A", "same"), plan("B", "same")], ["plan-a", "plan-b"]
        )
        self.assertEqual("FAIL", same["outcome"])

        passed = reduce_plan_pool([plan("A"), plan("B"), plan("C")])
        self.assertEqual("PASS", passed["outcome"])
        self.assertEqual(3, len(passed["survivors"]))

    def test_candidate_reducer_selects_highest_scored_proven_candidate(self) -> None:
        result = reduce_candidate_pool([judge("a", "plan-a", 91), judge("b", "plan-b", 88)])
        self.assertEqual("PASS", result["outcome"])
        self.assertEqual("candidate-a", result["selectedCandidateId"])

    def test_candidate_reducer_fails_closed_on_unverified_gate(self) -> None:
        first = judge("a", "plan-a")
        second = judge("b", "plan-b")
        first["mathEvidence"][0]["verdict"] = "UNVERIFIED"  # type: ignore[index]
        second["fidelityEvidence"][0]["overallVerdict"] = "FAIL"  # type: ignore[index]
        result = reduce_candidate_pool([first, second])
        self.assertEqual("FAIL", result["outcome"])
        self.assertEqual("INSUFFICIENT_PROVEN_CANDIDATES", result["code"])

    def test_candidate_reducer_requires_solver_answer_to_match_contract(self) -> None:
        first = judge("a", "plan-a", 99)
        for evidence in first["mathEvidence"]:  # type: ignore[union-attr]
            evidence["derivedAnswer"] = "3"
        result = reduce_candidate_pool([first, judge("b", "plan-b", 80)])
        self.assertEqual("FAIL", result["outcome"])
        self.assertEqual("INSUFFICIENT_PROVEN_CANDIDATES", result["code"])

    def test_candidate_reducer_requires_two_distinct_candidates_and_plans(self) -> None:
        only_one = reduce_candidate_pool([judge("a", "plan-a")])
        self.assertEqual("INSUFFICIENT_DISTINCT_CANDIDATES", only_one["code"])

        first = judge("a", "plan-a")
        second = judge("b", "plan-a")
        same_plan = reduce_candidate_pool([first, second])
        self.assertEqual("FAIL", same_plan["outcome"])
        self.assertEqual("INSUFFICIENT_DISTINCT_CANDIDATES", same_plan["code"])

    def test_candidate_reducer_fails_on_malformed_artifact_instead_of_ignoring_it(self) -> None:
        valid = judge("a", "plan-a")
        malformed = copy.deepcopy(judge("b", "plan-b"))
        del malformed["candidate"]["answerContract"]
        result = reduce_candidate_pool([valid, malformed])
        self.assertEqual("FAIL", result["outcome"])
        self.assertEqual("CANDIDATE_JUDGE_INPUT_INVALID", result["code"])

    def test_stage_reducer_blocks_on_missing_and_passes_complete_source_pair(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            run_dir = Path(temporary)
            (run_dir / "source").mkdir()
            blocked = reduce_phase2_stage("R03_SOURCE_ANALYSIS", run_dir, {})
            self.assertEqual({"outcome": "BLOCKED", "codes": ["SOURCE_ANALYSIS_MISSING"]}, blocked)

            for lane in ("A", "B"):
                (run_dir / "source" / f"analysis-{lane.lower()}.json").write_text(
                    json.dumps(source_analysis(lane), ensure_ascii=False), encoding="utf-8"
                )
            passed = reduce_phase2_stage("R03_SOURCE_ANALYSIS", run_dir, {})
            self.assertEqual("PASS", passed["outcome"])
            self.assertIn("manifestUpdates", passed)

    def test_stage_reducer_requires_explicit_critic_survivors(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            run_dir = Path(temporary)
            (run_dir / "plans").mkdir()
            for lane in ("A", "B", "C"):
                (run_dir / "plans" / f"plan-{lane.lower()}.json").write_text(
                    json.dumps(plan(lane), ensure_ascii=False), encoding="utf-8"
                )
            blocked = reduce_phase2_stage("R06_PLAN_CRITIC", run_dir, {})
            self.assertEqual("BLOCKED", blocked["outcome"])
            passed = reduce_phase2_stage(
                "R06_PLAN_CRITIC",
                run_dir,
                {"phase2": {"survivingPlanIds": ["plan-a", "plan-b"]}},
            )
            self.assertEqual("PASS", passed["outcome"])

            malformed_manifest = {"phase2": {"artifactPaths": []}}
            failed = reduce_phase2_stage("R06_PLAN_CRITIC", run_dir, malformed_manifest)
            self.assertEqual("FAIL", failed["outcome"])
            self.assertEqual(["PHASE2_MANIFEST_CONTRACT_INVALID"], failed["codes"])

    def test_stage_reducer_selects_only_after_two_candidates_survive(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            run_dir = Path(temporary)
            paths = []
            for label, plan_id in (("a", "plan-a"), ("b", "plan-b")):
                relative = f"candidates/{label}/judge-input.json"
                path = run_dir / relative
                path.parent.mkdir(parents=True)
                path.write_text(json.dumps(judge(label, plan_id), ensure_ascii=False), encoding="utf-8")
                paths.append(relative)
            result = reduce_phase2_stage(
                "R12_FINAL_REDUCER",
                run_dir,
                {"phase2": {"artifactPaths": {"candidateJudgeInputs": paths}}},
            )
            self.assertEqual("PASS", result["outcome"])
            self.assertEqual(
                "candidate-a", result["manifestUpdates"]["phase2"]["selectedCandidateId"]
            )


if __name__ == "__main__":
    unittest.main()
