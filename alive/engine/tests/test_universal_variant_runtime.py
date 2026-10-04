from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from alive.engine.curriculum_adapters import load_high1_curriculum_adapters
from alive.engine.mixed_exam_planner import MixedExamPlannerError, build_mixed_exam_plan
from alive.engine.structure_families import StructureFamilyAdapter, default_structure_family_registry
from alive.engine.universal_variant_runtime import (
    UNIVERSAL_STAGES,
    UniversalRunStore,
    UniversalRuntimeError,
    assemble_universal_exam,
    package_universal_run,
    record_universal_closure,
    record_universal_candidate_set,
    record_universal_mother_final,
    record_universal_render,
    record_universal_revision,
    record_universal_review,
    record_universal_stage,
    record_universal_variant_precheck,
    resume_universal_run,
    seal_universal_run,
    start_universal_run,
    write_universal_variant_ledger,
)
from alive.engine.variant_proof import REQUIRED_CHECKS, build_proof_check, reduce_variant_class


class UniversalVariantRuntimeTests(unittest.TestCase):
    def test_mixed_planner_is_capability_gated_and_ordered(self) -> None:
        registry = default_structure_family_registry()
        registry.register(
            StructureFamilyAdapter(
                family_id="LINEAR_EQUATION",
                transform_capabilities={"numeric": "SUPPORTED"},
                solver_profile="fixture",
            )
        )
        plan = build_mixed_exam_plan(
            [
                {"id": 1, "structureFamily": "LINEAR_EQUATION"},
                {"id": 2, "structureFamily": "LINEAR_EQUATION"},
                {"id": 3, "structureFamily": "MIXED"},
            ],
            registry=registry,
            target_classes=("A", "B", "C"),
        )
        self.assertEqual("HOLD", plan["status"])
        self.assertEqual([1, 2, 3], [item["sourceOrdinal"] for item in plan["assignments"]])
        self.assertEqual("READY", plan["assignments"][0]["status"])
        self.assertEqual("HOLD", plan["assignments"][1]["status"])
        self.assertEqual("HOLD", plan["assignments"][2]["status"])
        self.assertEqual("CAPABILITY_PRECHECK_FAIL", plan["assignments"][1]["code"])
        self.assertEqual("UNSUPPORTED", plan["assignments"][2]["capability"]["status"])

    def test_planner_rejects_malformed_transform_map(self) -> None:
        with self.assertRaises(MixedExamPlannerError):
            build_mixed_exam_plan(
                [{"id": 1, "structureFamily": "LINEAR_EQUATION", "transformByClass": ["numeric"]}],
                registry=default_structure_family_registry(),
            )

    def test_planner_uses_canonical_unit_family_and_holds_conflicts(self) -> None:
        structure_registry = default_structure_family_registry()
        structure_registry.register(
            StructureFamilyAdapter(
                family_id="DIRECT_CALCULATION",
                transform_capabilities={"numeric": "SUPPORTED"},
                solver_profile="fixture",
            )
        )
        curriculum_registry = load_high1_curriculum_adapters(Path(__file__).resolve().parents[3])
        plan = build_mixed_exam_plan(
            [
                {"id": 1, "unitKey": "H22-C-01", "structureFamily": "DIRECT_CALCULATION"},
                {"id": 2, "unitKey": "H22-C-01", "structureFamily": "MIXED"},
            ],
            registry=structure_registry,
            curriculum_registry=curriculum_registry,
            target_classes=("A",),
        )
        self.assertEqual("READY", plan["assignments"][0]["status"])
        self.assertEqual("HOLD", plan["assignments"][1]["status"])
        self.assertEqual("CURRICULUM_FAMILY_MISMATCH", plan["assignments"][1]["code"])

    def test_universal_run_can_resume_package_closure_and_seal_locally(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            runtime_root = Path(temporary)
            run_id = "universal-runtime-fixture"
            batch_plan = [[1, 2], [3]]
            created = start_universal_run(
                runtime_root,
                run_id=run_id,
                source_lock={"path": "source.js", "sha256": "a" * 64, "ruleSnapshotSha256": "b" * 64},
                question_count=3,
                batch_plan=batch_plan,
            )
            self.assertEqual("S01_PREFLIGHT", created["currentStage"])
            store = UniversalRunStore(runtime_root)
            run_dir = store.run_dir(run_id)
            self.assertTrue((run_dir / "source/source-lock.json").is_file())
            self.assertTrue((run_dir / "plans/batch-plan.json").is_file())

            for stage_id in UNIVERSAL_STAGES[1:5]:
                record_universal_stage(store, run_id, stage_id, status="PASS", evidence=f"fixture:{stage_id}")
            candidates, proof_rows, evidence_catalog = [], [], set()
            for ordinal, declared in enumerate(("A", "B", "C"), 1):
                sidecar, refs = self._sidecar(ordinal, declared)
                result = reduce_variant_class(sidecar, evidence_catalog=refs)
                candidates.append(self._candidate(run_id, ordinal, declared, sidecar, result))
                proof_rows.append({"id": ordinal, "sidecar": sidecar})
                evidence_catalog.update(refs)
            record_universal_candidate_set(store, run_id, candidates)
            precheck = record_universal_variant_precheck(
                store,
                run_id,
                proof_rows,
                evidence_catalog=evidence_catalog,
            )
            self.assertEqual("PASS", precheck["precheck"]["status"])
            review, review_catalog = self._review_ledger(3)
            record_universal_review(store, run_id, review, round_name="review1", evidence_catalog=review_catalog)
            record_universal_revision(
                store,
                run_id,
                {"status": "PASS", "bounded": True, "changedQuestionIds": []},
            )
            record_universal_review(store, run_id, review, round_name="review2", evidence_catalog=review_catalog)
            record_universal_mother_final(store, run_id)
            ledger = write_universal_variant_ledger(store, run_id, precheck["precheck"]["questions"])
            self.assertEqual("PASS", ledger["status"])
            assembled = assemble_universal_exam(store, run_id, "universal-runtime-fixture")
            self.assertEqual("PASS", assembled["assembly"]["status"])
            render = record_universal_render(store, run_id, self._render_evidence(3))
            self.assertEqual("S09_PACKAGE", store.load(run_id)["currentStage"])
            packaged = package_universal_run(store, run_id)
            self.assertEqual("PASS", packaged["roundTrip"])
            self.assertTrue(Path(packaged["packagePath"]).is_file())
            self.assertEqual("S09A_FINAL_CLOSURE", store.load(run_id)["currentStage"])

            closure = record_universal_closure(
                store,
                run_id,
                {
                    "artifactType": "ALIVE_UNIVERSAL_FINAL_CLOSURE",
                    "status": "PASS",
                    "browserRender": {
                        "status": "PASS",
                        "actualBrowser": True,
                        "productionEngine": True,
                        "pages": ["exam", "solution", "answer"],
                    },
                    "package": {"status": "PASS", "roundTrip": "PASS"},
                    "renderEvidenceSha256": render["renderEvidenceSha256"],
                },
            )
            self.assertEqual("SEALED", closure["currentStage"])
            sealed = seal_universal_run(store, run_id)
            self.assertEqual("SEALED_LOCAL", sealed["status"])
            self.assertEqual("NOT_PUBLISHED", sealed["publicationStatus"])

            resumed = resume_universal_run(store, run_id, batch_plan=batch_plan)
            self.assertEqual("SEALED_LOCAL", resumed["status"])
            with self.assertRaises(UniversalRuntimeError):
                resume_universal_run(store, run_id, batch_plan=[[1], [2, 3]])
            with self.assertRaises(UniversalRuntimeError):
                record_universal_stage(store, run_id, "SEALED", status="PASS", evidence="late-mutation")

    def test_dedicated_final_stages_cannot_be_faked_by_generic_stage_command(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            start_universal_run(
                Path(temporary),
                run_id="dedicated-stage-guard",
                source_lock={"sha256": "c" * 64, "ruleSnapshotSha256": "d" * 64},
                question_count=1,
                batch_plan=[[1]],
            )
            store = UniversalRunStore(Path(temporary))
            for stage_id in UNIVERSAL_STAGES[1:5]:
                record_universal_stage(store, "dedicated-stage-guard", stage_id, status="PASS", evidence="ok")
            with self.assertRaises(UniversalRuntimeError):
                record_universal_stage(store, "dedicated-stage-guard", "S02_ROUND1_GENERATION", status="PASS", evidence="fake")
            with self.assertRaises(UniversalRuntimeError):
                record_universal_stage(store, "dedicated-stage-guard", "S08_BROWSER_RENDER", status="PASS", evidence="fake")
            with self.assertRaises(UniversalRuntimeError):
                record_universal_stage(store, "dedicated-stage-guard", "S09_PACKAGE", status="PASS", evidence="fake")

    @staticmethod
    def _render_evidence(question_count: int) -> dict:
        mode = {
            "verdict": "PASS",
            "lastQuestion": question_count,
            "lastPageChecked": True,
            "unrenderedMath": 0,
            "overflowCount": 0,
            "badImages": [],
            "renderError": None,
            "screenshotCaptured": True,
        }
        return {
            "artifactType": "ALIVE_FINAL_RENDER_EVIDENCE",
            "actualBrowser": True,
            "productionEngine": True,
            "modes": {name: mode for name in ("exam", "solution", "answer")},
        }

    @staticmethod
    def _sidecar(ordinal: int, declared: str) -> tuple[dict, set[str]]:
        refs = set()
        checks = []
        for name in REQUIRED_CHECKS[declared]:
            ref = f"ev:{ordinal}:{declared}:{name}"
            refs.add(ref)
            checks.append(build_proof_check(name, "PASS", method="runtime-fixture", evidence_refs=[ref]))
        delta = 1 if declared == "C" else 0
        return {
            "artifactType": "ALIVE_VARIANT_PROOF_SIDECAR",
            "schemaVersion": "0.1.0",
            "sourceQuestionId": str(ordinal),
            "declaredClass": declared,
            "verifiedClass": "HOLD",
            "structureFamily": "LINEAR_EQUATION",
            "transform": "numeric" if declared == "A" else "representation" if declared == "B" else "PARAMETER_RECOVERY",
            "capabilityStatus": "SUPPORTED",
            "coreConceptPreserved": True,
            "solutionGraphPreserved": True,
            "coreDecisionDelta": 0,
            "branchDelta": 0,
            "newConceptDelta": 0,
            "preprocessingDelta": delta,
            "preprocessLoad": {"type": "inference" if declared == "C" else "none", "magnitude": delta},
            "preprocessDeterministic": True,
            "preprocessOutputArity": 1 if declared == "C" else 0,
            "studentObservableInputsOnly": True,
            "ablationPassed": True,
            "shortcutBlocked": True,
            "difficultyDelta": {},
            "proofChecks": checks,
            "proofSha256": f"runtime-proof-{ordinal}-{declared}",
        }, refs

    @staticmethod
    def _candidate(run_id: str, ordinal: int, declared: str, sidecar: dict, result: dict) -> dict:
        detail = {
            "version": "0.1",
            "audience": "student",
            "depth": "detailed",
            "given": f"{ordinal}x+1=3이 주어져 있다.",
            "goal": "x의 값을 구한다.",
            "keyIdea": "양변에서 1을 빼고 계수로 나눈다.",
            "conceptNote": "일차방정식의 기본 성질을 사용한다.",
            "steps": [
                {"title": "정리", "work": f"{ordinal}x=2", "why": "양변에서 1을 뺀다."},
                {"title": "계산", "work": "x=2/a", "why": "양변을 계수로 나눈다."},
            ],
            "check": "얻은 값을 원래 식에 대입해 확인한다.",
            "commonMistakes": ["이항할 때 부호를 바꾸지 않는 것"],
            "diagramRequirement": "NOT_REQUIRED",
        }
        return {
            "artifactType": "ALIVE_UNIVERSAL_CANDIDATE",
            "schemaVersion": "0.1.0",
            "runId": run_id,
            "sourceQuestionId": str(ordinal),
            "sourceQuestionSha256": "a" * 64,
            "ruleSnapshotSha256": "b" * 64,
            "variantPlan": {"declaredClass": declared, "transform": sidecar["transform"]},
            "studentPayload": {
                "content": f"{ordinal}x+1=3의 해를 구하시오.",
                "choices": [],
                "questionType": "주관식",
                "layoutTag": "grid",
                "wide": False,
            },
            "answerContract": {"displayAnswer": "2"},
            "solution": "[풀이 과정] 양변에서 1을 빼고 계수로 나눈다.",
            "solutionDetail": detail,
            "archiveMetadata": {
                "level": "중",
                "category": "일차방정식",
                "originalCategory": "일차방정식",
                "standardCourse": "공통수학1",
                "standardUnitKey": "H22-C-01",
                "standardUnit": "다항식의 연산",
                "standardUnitOrder": 1,
                "subUnitKey": "H22-C-01-TEST",
                "subUnit": "기본 계산",
                "subUnitConfidence": "fixture",
                "subUnitClassificationDepth": "complete_rule",
                "questionType": "주관식",
                "layoutTag": "grid",
                "tags": [],
                "wide": False,
            },
            "variantProof": sidecar,
            "variantResult": result,
        }

    @staticmethod
    def _review_ledger(question_count: int) -> tuple[dict, set[str]]:
        catalog = set()
        rows = []
        for ordinal in range(1, question_count + 1):
            row = {"id": ordinal}
            for view in ("blindMath", "solution", "variantComparison"):
                ref = f"review:{ordinal}:{view}"
                catalog.add(ref)
                row[view] = {"status": "PASS", "method": "runtime-review-fixture", "evidenceRefs": [ref]}
            rows.append(row)
        return {"artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER", "schemaVersion": "0.1.0", "questions": rows}, catalog

    def test_universal_run_rejects_incomplete_batch_plan(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            with self.assertRaises(UniversalRuntimeError):
                start_universal_run(
                    Path(temporary),
                    run_id="bad-plan",
                    source_lock={"sha256": "b" * 64, "ruleSnapshotSha256": "c" * 64},
                    question_count=3,
                    batch_plan=[[1], [2]],
                )


if __name__ == "__main__":
    unittest.main()
