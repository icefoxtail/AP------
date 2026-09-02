from __future__ import annotations

import json
import tempfile
import unittest
import zipfile
from unittest.mock import patch
from pathlib import Path

from alive.engine.adaptive_staged_exam import (
    ADAPTIVE_PROFILE,
    ADAPTIVE_REVIEW_POLICY,
    assemble_adaptive_exam,
    build_adaptive_status,
    fail_adaptive_staged_dispatch,
    package_adaptive_exam,
    record_adaptive_render,
    record_adaptive_visual_inspection,
    reconcile_adaptive_staged_run,
    start_adaptive_correction_cycle,
    start_adaptive_staged_dispatch,
    start_adaptive_staged_exam,
)
from alive.engine.adaptive_method_profile import (
    METHOD_PROFILES,
    lint_solution_method,
    method_profile_for_unit,
)
from alive.engine.run_store import atomic_write_json
from alive.engine.staged_exam import StagedRunStore
from alive.engine.tests.test_staged_exam import StagedExamTests


def source_question(ordinal: int) -> dict:
    return {
        "id": ordinal,
        "level": "중",
        "category": "함수",
        "originalCategory": "함수",
        "standardCourse": "공통수학2",
        "standardUnitKey": "H22-C2-07",
        "standardUnit": "함수",
        "standardUnitOrder": 7,
        "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
        "subUnit": "함수의 뜻과 그래프",
        "subUnitConfidence": "rule_inferred",
        "subUnitClassificationDepth": "complete_rule",
        "questionType": "객관식",
        "layoutTag": "grid",
        "tags": ["객관식", "함수"],
        "wide": False,
        "content": f"문항 {ordinal}의 값을 구하여라. [{ordinal + 2}점]",
        "choices": ["1", "2", "3", "4", "5"],
        "answer": "③",
        "solution": "원문 풀이",
    }


class AdaptiveStagedExamTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.source = self.root / "archive/exams/original/high/h1/2final/adaptive.js"
        self.source.parent.mkdir(parents=True)
        self.runtime = self.root / "alive/runtime/adaptive-staged-runs"
        self.store = StagedRunStore(self.runtime)

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def start(self) -> dict:
        self.source.write_text(
            'window.examTitle = "적응형 테스트";\n'
            + "window.questionBank = "
            + json.dumps(
                [source_question(i) for i in range(1, 5)], ensure_ascii=False
            )
            + ";\n",
            encoding="utf-8",
        )
        return start_adaptive_staged_exam(
            self.root,
            self.store,
            self.source.relative_to(self.root).as_posix(),
            "적응형 테스트 전체 유사",
            "test-engine",
            batch_count=2,
        )

    def put(self, manifest: dict, task: dict, payload: dict) -> None:
        atomic_write_json(self.store.run_dir(manifest["runId"]) / task["outputPath"], payload)

    def accept_builders(self, manifest: dict) -> None:
        for task in list(manifest["tasks"].values()):
            if task["status"] == "PENDING" and task["kind"] == "BATCH_BUILDER":
                self.put(manifest, task, StagedExamTests.draft(manifest, task))
        reconcile_adaptive_staged_run(self.store, manifest["runId"])

    def test_all_pass_batches_carry_forward_review_evidence(self) -> None:
        manifest = self.start()
        self.assertEqual(ADAPTIVE_PROFILE, manifest["request"]["workflowProfile"])
        self.assertEqual("gpt-5.6-luna", manifest["request"]["modelProfile"]["model"])
        self.assertEqual("xhigh", manifest["request"]["modelProfile"]["reasoning"])
        self.assertEqual("READY", manifest["methodProfiles"]["status"])
        self.assertTrue(
            (self.store.run_dir(manifest["runId"]) / "source/method-profiles.json").is_file()
        )
        self.accept_builders(manifest)
        manifest = self.store.load(manifest["runId"])

        for task in manifest["tasks"].values():
            if task["kind"] != "BATCH_REVIEWER":
                continue
            packet = json.loads(
                (self.store.run_dir(manifest["runId"]) / task["packetPath"]).read_text(
                    encoding="utf-8"
                )
            )
            self.assertEqual("QUESTION_METHOD_PROFILE_HARD_LOCK", packet["methodGate"])
            self.assertTrue(packet["methodProfiles"])

        for task in list(manifest["tasks"].values()):
            if task["kind"] == "BATCH_REVIEWER":
                self.put(manifest, task, StagedExamTests.review(task))
        reconcile_adaptive_staged_run(self.store, manifest["runId"])

        manifest = self.store.load(manifest["runId"])
        self.assertEqual("READY_FOR_ASSEMBLY", manifest["status"])
        self.assertEqual("S07_ASSEMBLY", manifest["currentStage"])
        review2 = [
            task
            for task in manifest["tasks"].values()
            if task["round"] == "review2"
        ]
        self.assertEqual(2, len(review2))
        self.assertTrue(all(task["status"] == "SKIPPED" for task in review2))
        self.assertEqual(
            2,
            sum(
                event["type"] == "ADAPTIVE_REVIEW2_CARRIED_FORWARD"
                for event in manifest["events"]
            ),
        )
        self.assertTrue(
            all(
                batch["review2"]["policy"] == ADAPTIVE_REVIEW_POLICY
                and batch["review2"]["carriedForward"] is True
                for batch in manifest["batches"].values()
            )
        )

        assembled = assemble_adaptive_exam(
            self.root,
            self.store,
            manifest["runId"],
            "적응형 테스트 전체 유사",
        )
        self.assertEqual("READY_FOR_MANUAL_REVIEW", assembled["status"])
        report = json.loads(
            (
                self.store.run_dir(manifest["runId"])
                / "final/review-report.json"
            ).read_text(encoding="utf-8")
        )
        self.assertEqual(ADAPTIVE_PROFILE, report["workflowProfile"])
        self.assertEqual(ADAPTIVE_REVIEW_POLICY, report["reviewPolicy"])

        packaged = package_adaptive_exam(self.store, manifest["runId"])
        self.assertEqual("DRAFT_PACKAGED", packaged["status"])
        external = packaged["package"]["externalReviewPackage"]
        self.assertEqual("EXTERNAL_REVIEW_PACKAGED", external["status"])
        external_path = self.root / external["output"]
        self.assertTrue(external_path.is_file())
        self.assertIn(".js", external["memberExtensions"])
        self.assertTrue(
            set(external["memberExtensions"]).issubset({".js", ".svg", ".png"})
        )
        with zipfile.ZipFile(external_path) as external_zip:
            self.assertIsNone(external_zip.testzip())
            self.assertTrue(any(name.startswith("original/") for name in external_zip.namelist()))
            self.assertTrue(any(name.startswith("similar/") for name in external_zip.namelist()))
        with __import__("zipfile").ZipFile(
            self.store.run_dir(manifest["runId"]) / "final/alive-staged-exam-pack.zip"
        ) as archive:
            self.assertIn("source/method-profiles.json", archive.namelist())
            self.assertIsNone(archive.testzip())

    def test_revised_batch_keeps_a_fresh_review2_task(self) -> None:
        manifest = self.start()
        self.accept_builders(manifest)
        manifest = self.store.load(manifest["runId"])
        for task in list(manifest["tasks"].values()):
            if task["kind"] != "BATCH_REVIEWER":
                continue
            verdict = "REVISE" if task["batchId"] == "b01" else "PASS"
            self.put(manifest, task, StagedExamTests.review(task, verdict=verdict))
        reconcile_adaptive_staged_run(self.store, manifest["runId"])

        manifest = self.store.load(manifest["runId"])
        self.assertEqual("S04_REVISION", manifest["currentStage"])
        revision = manifest["tasks"]["b01-revision"]
        self.assertEqual("PENDING", revision["status"])
        self.put(manifest, revision, StagedExamTests.draft(manifest, revision))
        reconcile_adaptive_staged_run(self.store, manifest["runId"])

        manifest = self.store.load(manifest["runId"])
        self.assertEqual("S05_REVIEW2", manifest["currentStage"])
        self.assertEqual("PENDING", manifest["tasks"]["b01-review2"]["status"])
        review2_packet = json.loads(
            (
                self.store.run_dir(manifest["runId"])
                / manifest["tasks"]["b01-review2"]["packetPath"]
            ).read_text(encoding="utf-8")
        )
        self.assertEqual("QUESTION_METHOD_PROFILE_HARD_LOCK", review2_packet["methodGate"])
        self.assertEqual(
            {
                str(ordinal): manifest["methodProfiles"]["profiles"][str(ordinal)]
                for ordinal in manifest["batches"]["b01"]["ordinals"]
            },
            review2_packet["methodProfiles"],
        )
        self.assertEqual("SKIPPED", manifest["tasks"]["b02-review2"]["status"])
        self.assertEqual(
            ADAPTIVE_REVIEW_POLICY,
            manifest["batches"]["b02"]["review2"]["policy"],
        )

    def test_external_review_package_failure_blocks_adaptive_package(self) -> None:
        manifest = self.start()
        self.accept_builders(manifest)
        manifest = self.store.load(manifest["runId"])
        for task in list(manifest["tasks"].values()):
            if task["kind"] == "BATCH_REVIEWER":
                self.put(manifest, task, StagedExamTests.review(task))
        reconcile_adaptive_staged_run(self.store, manifest["runId"])
        assemble_adaptive_exam(self.root, self.store, manifest["runId"], "적응형 테스트 전체 유사")

        with patch(
            "alive.engine.adaptive_staged_exam._external_review_package_for_run",
            side_effect=RuntimeError("external package sentinel"),
        ):
            with self.assertRaisesRegex(ValueError, "external review package is mandatory"):
                package_adaptive_exam(self.store, manifest["runId"])

        failed = self.store.load(manifest["runId"])
        self.assertEqual("FAILED", failed["status"])
        self.assertIn("EXTERNAL_REVIEW_PACKAGE_REQUIRED", failed["codes"])

    def test_method_profile_rejects_vector_determinant_and_unjustified_projection(self) -> None:
        line_profile = method_profile_for_unit("H22-C2-02")
        bad_line_detail = {
            "keyIdea": "직선의 방정식과 좌표를 이용한다.",
            "steps": [
                {
                    "title": "넓이",
                    "work": "벡터의 행렬식으로 넓이를 계산한다.",
                    "why": "넓이를 구하기 위해서이다.",
                }
            ],
        }
        bad_line = lint_solution_method(
            line_profile,
            "[풀이 과정] 벡터의 행렬식으로 넓이를 계산한다.",
            bad_line_detail,
        )
        self.assertEqual("FAIL", bad_line["verdict"])
        self.assertTrue(
            any(hit["code"] == "VECTOR_DETERMINANT_CORE" for hit in bad_line["forbiddenHits"])
        )

        circle_profile = method_profile_for_unit("H22-C2-03")
        bad_circle_detail = {
            "keyIdea": "원의 접선 구조를 이용한다.",
            "steps": [
                {
                    "title": "길이",
                    "work": "투영 정리에 따라 CM=CA^2/PC를 사용한다.",
                    "why": "필요한 길이를 구하기 위해서이다.",
                }
            ],
        }
        bad_circle = lint_solution_method(
            circle_profile,
            "[풀이 과정] 투영 정리에 따라 CM=CA^2/PC를 사용한다.",
            bad_circle_detail,
        )
        self.assertEqual("FAIL", bad_circle["verdict"])
        self.assertEqual(
            "PROJECTION_THEOREM_JUSTIFICATION",
            bad_circle["justificationChecks"][0]["code"],
        )

        good_line_detail = {
            "keyIdea": "기울기와 직선의 방정식을 이용해 수선의 교점을 찾는다.",
            "steps": [
                {
                    "title": "넓이",
                    "work": "직선의 방정식과 점과 직선 사이의 거리를 이용해 밑변과 높이로 넓이를 구한다.",
                    "why": "직선의 관계를 좌표와 거리로 계산하기 위해서이다.",
                }
            ],
        }
        good_line = lint_solution_method(
            line_profile,
            "[풀이 과정] 직선의 방정식과 점과 직선 사이의 거리를 이용해 밑변과 높이로 넓이를 구한다.",
            good_line_detail,
        )
        self.assertEqual("PASS", good_line["verdict"])

        rejected_method_detail = {
            "keyIdea": "벡터의 행렬식은 사용하지 않고 좌표와 거리로 해결한다.",
            "steps": [
                {
                    "title": "좌표 풀이",
                    "work": "직선의 방정식과 점과 직선 사이의 거리를 이용한다.",
                    "why": "고1 과정의 좌표 방법으로 계산하기 위해서이다.",
                }
            ],
        }
        rejected_method = lint_solution_method(
            line_profile,
            "[풀이 과정] 벡터의 행렬식은 사용하지 않고 좌표와 거리로 해결한다.",
            rejected_method_detail,
        )
        self.assertEqual("PASS", rejected_method["verdict"])

    def test_all_canonical_method_profiles_have_passing_fixture_routes(self) -> None:
        fixture_path = Path(__file__).resolve().parents[1] / "fixtures_adaptive_method_profiles.json"
        fixtures = json.loads(fixture_path.read_text(encoding="utf-8"))
        self.assertEqual(set(METHOD_PROFILES), {item["unitKey"] for item in fixtures})
        for item in fixtures:
            profile = method_profile_for_unit(item["unitKey"])
            report = lint_solution_method(
                profile,
                "[풀이 과정] " + item["positiveSolution"],
                {"keyIdea": item["positiveSolution"], "steps": []},
            )
            self.assertEqual("PASS", report["verdict"], item["unitKey"])

    def test_source_visual_inspection_blocks_generation_until_recorded(self) -> None:
        asset = self.root / "archive/assets/source.svg"
        asset.parent.mkdir(parents=True, exist_ok=True)
        asset.write_text(
            '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="5"/></svg>',
            encoding="utf-8",
        )
        question = source_question(1)
        question["image"] = "assets/source.svg"
        self.source.parent.mkdir(parents=True, exist_ok=True)
        self.source.write_text(
            'window.examTitle = "시각 적응형 테스트";\n'
            + "window.questionBank = "
            + json.dumps([question], ensure_ascii=False)
            + ";\n",
            encoding="utf-8",
        )
        manifest = start_adaptive_staged_exam(
            self.root,
            self.store,
            self.source.relative_to(self.root).as_posix(),
            "시각 적응형 테스트 전체 유사",
            "test-engine",
            batch_count=1,
        )
        self.assertEqual("BLOCKED", manifest["status"])
        self.assertEqual("S01A_VISUAL_RECON", manifest["currentStage"])
        status = build_adaptive_status(self.store, manifest["runId"])
        self.assertEqual("RECORD_SOURCE_VISUAL_INSPECTION", status["queue"][0]["kind"])
        ordinal = manifest["visualInspection"]["requiredOrdinals"][0]
        hashes = manifest["visualRecon"]["questions"][str(ordinal)]["visualFingerprint"]["assetSha256"]
        evidence_path = self.root / "visual-inspection.json"
        evidence_path.write_text(
            json.dumps(
                {
                    "artifactType": "ALIVE_ADAPTIVE_SOURCE_VISUAL_INSPECTION",
                    "runId": manifest["runId"],
                    "actualBrowser": True,
                    "productionEngine": True,
                    "questions": [
                        {
                            "ordinal": ordinal,
                            "verdict": "PASS",
                            "semanticInspection": "PASS",
                            "browserInspection": "PASS",
                            "screenshotPath": "screenshots/source-q001.png",
                            "sourceAssetSha256": hashes,
                            "notes": "source diagram is legible",
                        }
                    ],
                },
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )
        manifest = record_adaptive_visual_inspection(
            self.store, manifest["runId"], evidence_path
        )
        self.assertEqual("ROUND1_GENERATING", manifest["status"])
        self.assertEqual("S02_ROUND1_GENERATION", manifest["currentStage"])
        self.assertEqual("PASS", manifest["visualInspection"]["status"])
        builder = next(
            task for task in manifest["tasks"].values() if task["kind"] == "BATCH_BUILDER"
        )
        builder_packet = json.loads(
            (self.store.run_dir(manifest["runId"]) / builder["packetPath"]).read_text(
                encoding="utf-8"
            )
        )
        self.assertIn("source/visual-inspection.json", builder_packet["allowedInputPaths"])
        self.assertEqual("PASS", builder_packet["sourceVisualInspection"]["status"])

    def test_status_exposes_only_a_bounded_dispatch_window(self) -> None:
        manifest = self.start()
        current_stage = manifest["currentStage"]
        for index in range(3, 9):
            manifest["tasks"][f"extra-{index}"] = {
                "taskId": f"extra-{index}",
                "kind": "BATCH_BUILDER",
                "stage": current_stage,
                "round": "round1",
                "batchId": f"b{index:02d}",
                "status": "PENDING",
                "packetPath": f"tasks/extra-{index}.json",
                "outputPath": f"inbox/extra-{index}.json",
                "completionMarkerPath": f"inbox/extra-{index}.complete.json",
            }
        self.store.save(manifest["runId"], manifest)
        status = build_adaptive_status(self.store, manifest["runId"])
        task_items = [item for item in status["queue"] if item["kind"] == "AGENT_TASK"]
        self.assertEqual(4, len(task_items))
        self.assertEqual(4, status["dispatchWindow"]["maxConcurrentTasks"])
        self.assertGreater(status["dispatchWindow"]["hiddenPendingCurrentStage"], 0)

    def test_adaptive_dispatch_failure_keeps_four_attempt_budget(self) -> None:
        manifest = self.start()
        task_id = "b01-round1"
        for attempt in range(1, 4):
            start_adaptive_staged_dispatch(
                self.store,
                manifest["runId"],
                task_id,
                f"adaptive-failure-test-{attempt}",
                "gpt-5.6-luna/xhigh",
            )
            task = fail_adaptive_staged_dispatch(
                self.store,
                manifest["runId"],
                task_id,
                "TEST_RETRYABLE_FAILURE",
            )
            self.assertEqual("PENDING", task["status"])
        manifest = self.store.load(manifest["runId"])
        self.assertEqual("ROUND1_GENERATING", manifest["status"])
        self.assertEqual(3, len(manifest["tasks"][task_id]["dispatch"]["attempts"]))

    def test_adaptive_artifact_rejection_does_not_fall_back_to_two_attempts(self) -> None:
        manifest = self.start()
        task_id = "b01-round1"
        for attempt in range(1, 3):
            if attempt > 1:
                start_adaptive_staged_dispatch(
                    self.store,
                    manifest["runId"],
                    task_id,
                    f"adaptive-artifact-test-{attempt}",
                    "gpt-5.6-luna/xhigh",
                )
            task = self.store.load(manifest["runId"])["tasks"][task_id]
            self.put(manifest, task, {"artifactType": "INVALID_ADAPTIVE_ARTIFACT"})
            from alive.engine.staged_exam import mark_staged_task_complete

            mark_staged_task_complete(self.store, manifest["runId"], task_id)
            reconcile_adaptive_staged_run(self.store, manifest["runId"])
            manifest = self.store.load(manifest["runId"])
            self.assertEqual("PENDING", manifest["tasks"][task_id]["status"])
            self.assertEqual("ROUND1_GENERATING", manifest["status"])

    def test_render_failure_is_persisted_and_routes_to_correction(self) -> None:
        manifest = self.start()
        self.accept_builders(manifest)
        manifest = self.store.load(manifest["runId"])
        for task in list(manifest["tasks"].values()):
            if task["kind"] == "BATCH_REVIEWER":
                self.put(manifest, task, StagedExamTests.review(task))
        reconcile_adaptive_staged_run(self.store, manifest["runId"])
        manifest = self.store.load(manifest["runId"])
        assemble_adaptive_exam(self.root, self.store, manifest["runId"], "시각 오류 테스트")
        evidence_path = self.root / "bad-render.json"
        evidence_path.write_text(
            json.dumps(
                {
                    "actualBrowser": True,
                    "productionEngine": True,
                    "affectedOrdinals": [1],
                    "modes": {
                        "exam": {
                            "verdict": "FAIL",
                            "ready": True,
                            "renderError": "label collision",
                            "lastQuestion": 4,
                            "lastPageChecked": True,
                            "unrenderedMath": 0,
                            "overflowCount": 1,
                            "badImages": [],
                        },
                        "solution": {
                            "verdict": "PASS",
                            "ready": True,
                            "renderError": None,
                            "lastQuestion": 4,
                            "lastPageChecked": True,
                            "unrenderedMath": 0,
                            "overflowCount": 0,
                            "badImages": [],
                            "solutionVisualCoverage": {
                                "requiredOrdinals": [],
                                "renderedOrdinals": [],
                                "missingOrdinals": [],
                                "verdict": "PASS",
                            },
                        },
                        "answer": {
                            "verdict": "PASS",
                            "ready": True,
                            "renderError": None,
                            "lastQuestion": 4,
                            "lastPageChecked": True,
                            "unrenderedMath": 0,
                            "overflowCount": 0,
                            "badImages": [],
                        },
                    },
                },
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )
        manifest = record_adaptive_render(self.store, manifest["runId"], evidence_path)
        self.assertEqual("MANUAL_REVIEW_REQUIRED", manifest["status"])
        self.assertEqual("S08_RENDER_REVIEW", manifest["currentStage"])
        self.assertEqual([1], manifest["renderFailure"]["affectedOrdinals"])
        self.assertTrue(
            (self.store.run_dir(manifest["runId"]) / "render/render-failure-01.json").is_file()
        )
        status = build_adaptive_status(self.store, manifest["runId"])
        self.assertEqual("CORRECTION_START", status["queue"][-1]["kind"])

    def test_correction_loop_holds_then_restarts_only_unresolved_batch(self) -> None:
        manifest = self.start()
        self.accept_builders(manifest)
        manifest = self.store.load(manifest["runId"])
        for task in list(manifest["tasks"].values()):
            if task["kind"] != "BATCH_REVIEWER":
                continue
            verdict = "REVISE" if task["round"] == "review1" and task["batchId"] == "b01" else "PASS"
            self.put(manifest, task, StagedExamTests.review(task, verdict=verdict))
        reconcile_adaptive_staged_run(self.store, manifest["runId"])
        manifest = self.store.load(manifest["runId"])

        revision = manifest["tasks"]["b01-revision"]
        self.put(manifest, revision, StagedExamTests.draft(manifest, revision))
        reconcile_adaptive_staged_run(self.store, manifest["runId"])
        manifest = self.store.load(manifest["runId"])
        review2 = manifest["tasks"]["b01-review2"]
        self.put(manifest, review2, StagedExamTests.review(review2, verdict="REVISE"))
        reconcile_adaptive_staged_run(self.store, manifest["runId"])
        manifest = self.store.load(manifest["runId"])
        self.assertEqual("MANUAL_REVIEW_REQUIRED", manifest["status"])

        # A legacy held Run can be resumed through the adaptive V2 lane.
        manifest["request"]["workflowProfile"] = "ADAPTIVE_XHIGH_V1"
        manifest["request"]["reviewPolicy"] = "LEGACY_REVIEW"
        self.store.save(manifest["runId"], manifest)
        manifest = start_adaptive_correction_cycle(self.store, manifest["runId"])
        self.assertEqual("CORRECTION_RUNNING", manifest["status"])
        self.assertEqual(ADAPTIVE_PROFILE, manifest["request"]["workflowProfile"])
        self.assertEqual(ADAPTIVE_REVIEW_POLICY, manifest["request"]["reviewPolicy"])
        repair = manifest["tasks"]["b01-repair-01"]
        repair_packet = json.loads(
            (self.store.run_dir(manifest["runId"]) / repair["packetPath"]).read_text(
                encoding="utf-8"
            )
        )
        self.assertEqual("QUESTION_METHOD_PROFILE_HARD_LOCK", repair_packet["methodGate"])
        self.assertTrue(repair_packet["methodProfiles"])
        self.put(manifest, repair, StagedExamTests.draft(manifest, repair))
        reconcile_adaptive_staged_run(self.store, manifest["runId"])
        manifest = self.store.load(manifest["runId"])
        repair_review = manifest["tasks"]["b01-repair-review-01"]
        repair_review_packet = json.loads(
            (
                self.store.run_dir(manifest["runId"])
                / repair_review["packetPath"]
            ).read_text(encoding="utf-8")
        )
        self.assertEqual(
            "QUESTION_METHOD_PROFILE_HARD_LOCK", repair_review_packet["methodGate"]
        )
        self.assertTrue(repair_review_packet["methodProfiles"])
        self.put(manifest, repair_review, StagedExamTests.review(repair_review, verdict="PASS"))
        reconcile_adaptive_staged_run(self.store, manifest["runId"])
        manifest = self.store.load(manifest["runId"])
        self.assertEqual("READY_FOR_ASSEMBLY", manifest["status"])
        self.assertEqual("READY_FOR_ASSEMBLY", manifest["correctionLoop"]["status"])


if __name__ == "__main__":
    unittest.main()
