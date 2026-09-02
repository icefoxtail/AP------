from __future__ import annotations

import json
import tempfile
import unittest
import zipfile
from pathlib import Path

from alive.engine.run_store import atomic_write_json
from alive.engine.staged_exam import (
    StagedRunStore,
    _answer_matches,
    _normalize_contract,
    assemble_staged_exam,
    build_staged_status,
    mark_staged_task_complete,
    package_staged_exam,
    record_staged_render,
    recover_staged_task,
    reconcile_staged_run,
    start_staged_dispatch,
    start_staged_exam,
)
from alive.engine.context_cache import CONTEXT_CACHE_RELATIVE, prepare_staged_context


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


class StagedExamTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.source = self.root / "archive/exams/original/high/h1/2final/staged.js"
        self.source.parent.mkdir(parents=True)
        self.runtime = self.root / "alive/runtime/staged-runs"
        self.store = StagedRunStore(self.runtime)

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def write_exam(self, count: int = 4) -> None:
        self.source.write_text(
            'window.examTitle = "단계형 테스트";\n'
            + "window.questionBank = "
            + json.dumps([source_question(i) for i in range(1, count + 1)], ensure_ascii=False)
            + ";\n",
            encoding="utf-8",
        )

    def start(self) -> dict:
        self.write_exam()
        manifest = start_staged_exam(
            self.root,
            self.store,
            self.source.relative_to(self.root).as_posix(),
            "단계형 테스트 전체 유사",
            "test-engine",
            batch_count=2,
        )
        for batch_id in ("b01", "b02"):
            packet_path = self.store.run_dir(manifest["runId"]) / manifest["tasks"][f"{batch_id}-round1"]["packetPath"]
            packet = json.loads(packet_path.read_text(encoding="utf-8"))
            self.assertEqual(
                f"source/reference-pack/{batch_id}.json",
                packet["referencePackPath"],
            )
        return manifest

    def test_source_context_cache_reuses_exact_context_and_invalidates_on_source_change(self) -> None:
        self.write_exam()
        first, first_cache = prepare_staged_context(
            self.root, self.source.relative_to(self.root).as_posix()
        )
        second, second_cache = prepare_staged_context(
            self.root, self.source.relative_to(self.root).as_posix()
        )
        self.assertEqual("MISS", first_cache["status"])
        self.assertEqual("HIT", second_cache["status"])
        self.assertEqual(first["preflight"]["sourceLock"]["sha256"], second["preflight"]["sourceLock"]["sha256"])
        cache_files = list((self.root / CONTEXT_CACHE_RELATIVE).glob("*.json"))
        self.assertEqual(1, len(cache_files))

        self.source.write_text(
            self.source.read_text(encoding="utf-8") + "\n// source revision\n",
            encoding="utf-8",
        )
        _, third_cache = prepare_staged_context(
            self.root, self.source.relative_to(self.root).as_posix()
        )
        self.assertEqual("MISS", third_cache["status"])

    def start_visual(self) -> dict:
        asset = self.root / "archive/assets/source.svg"
        asset.parent.mkdir(parents=True, exist_ok=True)
        asset.write_text(
            '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="5"/></svg>',
            encoding="utf-8",
        )
        question = source_question(1)
        question["image"] = "assets/source.svg"
        self.source.write_text(
            'window.examTitle = "시각 단계형 테스트";\n'
            + "window.questionBank = "
            + json.dumps([question], ensure_ascii=False)
            + ";\n",
            encoding="utf-8",
        )
        return start_staged_exam(
            self.root,
            self.store,
            self.source.relative_to(self.root).as_posix(),
            "시각 단계형 테스트 전체 유사",
            "test-engine",
            batch_count=1,
        )

    @staticmethod
    def solution_detail() -> dict:
        return {
            "version": "0.1",
            "audience": "student",
            "depth": "detailed",
            "given": "문제에 주어진 조건을 확인한다.",
            "goal": "문항에서 구하는 값을 찾는다.",
            "keyIdea": "함수의 조건을 식으로 옮긴 뒤 순서대로 계산한다.",
            "steps": [
                {"title": "조건 정리", "work": "주어진 조건을 식으로 정리한다.", "why": "문제의 조건을 계산 가능한 식으로 바꾸기 위해서이다."},
                {"title": "계산", "work": "정리한 식에 값을 대입하여 계산한다.", "why": "구하려는 값과 직접 연결되는 식이기 때문이다."},
            ],
            "check": "계산 결과가 주어진 조건을 만족하는지 확인한다.",
            "commonMistakes": ["조건의 순서를 바꾸어 대입하지 않도록 주의한다."],
            "diagramRequirement": "NOT_REQUIRED",
        }

    @staticmethod
    def circle_solution_detail() -> dict:
        return {
            "version": "0.1",
            "audience": "student",
            "depth": "detailed",
            "given": "원의 중심 C와 접선 ℓ, 접점 T가 주어져 있다.",
            "goal": "접선과 반지름의 관계를 이용해 구하는 값을 찾는다.",
            "keyIdea": "접점에서 그은 반지름은 접선에 수직이다.",
            "conceptNote": "접선과 반지름의 수직 관계를 도형에서 확인한 뒤 식으로 옮긴다.",
            "steps": [
                {"title": "중심과 접점 확인", "work": "중심 C에서 접점 T로 선분 CT를 긋는다.", "why": "접선 문제에서 반지름과 접점의 위치를 분명히 하기 위해서이다."},
                {"title": "수직 관계 사용", "work": "CT와 ℓ은 서로 수직이다.", "why": "원의 접선은 접점에서 그은 반지름과 수직이기 때문이다."},
                {"title": "조건 대입", "work": "주어진 길이를 CT와 직각삼각형의 관계에 대입한다.", "why": "확인한 수직 관계가 구하는 값과 연결되기 때문이다."},
            ],
            "check": "구한 값을 원의 방정식과 접선 조건에 대입하여 확인한다.",
            "commonMistakes": ["접선과 반지름을 평행하다고 판단하지 않는다."],
            "diagramRequirement": "MANDATORY",
            "diagramPurpose": "원, 중심 C, 접점 T, 반지름 CT, 접선 ℓ, 직각 표시를 보여준다.",
        }

    @staticmethod
    def draft(manifest: dict, task: dict) -> dict:
        return {
            "artifactType": "ALIVE_STAGED_BATCH_DRAFT",
            "questions": [
                {
                    "ordinal": ordinal,
                    "studentPayload": {
                        "id": ordinal,
                        "questionType": "MCQ",
                        "level": "중",
                        "content": f"새 유사 문항 {ordinal}의 값을 구하여라.",
                        "choices": ["1", "2", "3", "4", "5"],
                    },
                    "answerContract": {
                        "answerType": "choice_index",
                        "canonicalAnswer": "3",
                        "acceptableAnswers": [],
                    },
                    "solution": "새 문항의 풀이",
                    "solutionDetail": StagedExamTests.solution_detail(),
                    "transformationPlan": {"kind": "quick"},
                }
                for ordinal in task["ordinals"]
            ],
        }

    @staticmethod
    def review(task: dict, *, verdict: str = "PASS") -> dict:
        return {
            "artifactType": "ALIVE_STAGED_BATCH_REVIEW",
            "reviews": [
                {
                    "ordinal": ordinal,
                    "verdict": verdict,
                    "independentAnswer": {
                        "answerType": "choice_index",
                        "canonicalAnswer": "3",
                    },
                    "checks": {"mathematics": "PASS" if verdict == "PASS" else "FAIL"},
                    "findings": [] if verdict == "PASS" else ["수정 필요"],
                    "solutionReview": {
                        "verdict": "PASS" if verdict == "PASS" else "REVISE",
                        "studentCanFollow": verdict == "PASS",
                        "checks": {
                            "readability": "PASS" if verdict == "PASS" else "REVISE",
                            "stepReasons": "PASS" if verdict == "PASS" else "REVISE",
                            "theoremJustification": "NOT_APPLICABLE",
                            "answerCheck": "PASS" if verdict == "PASS" else "REVISE",
                            "diagramConsistency": "NOT_APPLICABLE",
                        },
                        "findings": [] if verdict == "PASS" else ["해설 수정 필요"],
                    },
                }
                for ordinal in task["ordinals"]
            ],
        }

    def put_inbox(self, manifest: dict, task: dict, payload: dict) -> None:
        atomic_write_json(self.store.run_dir(manifest["runId"]) / task["outputPath"], payload)

    def accept_current_tasks(self, manifest: dict, *, kind: str, review_verdict: str = "PASS") -> None:
        for task in list(manifest["tasks"].values()):
            if task["status"] != "PENDING" or task["kind"] != kind:
                continue
            payload = self.draft(manifest, task) if kind == "BATCH_BUILDER" else self.review(task, verdict=review_verdict)
            self.put_inbox(manifest, task, payload)
        reconcile_staged_run(self.store, manifest["runId"])

    def test_four_stages_are_batch_separated_and_assemble(self) -> None:
        manifest = self.start()
        self.assertEqual("S02_ROUND1_GENERATION", manifest["currentStage"])
        self.assertEqual("NOT_AVAILABLE", manifest["rulePack"]["status"])
        run_dir = self.store.run_dir(manifest["runId"])
        self.assertTrue((run_dir / "source/rule-snapshot.json").is_file())
        self.assertTrue((run_dir / "source/reference-pack.json").is_file())

        self.assertEqual(2, len(manifest["tasks"]))
        self.assertTrue(all(task["stage"] == "S02_ROUND1_GENERATION" for task in manifest["tasks"].values()))
        packet = json.loads((run_dir / manifest["tasks"]["b01-round1"]["packetPath"]).read_text(encoding="utf-8"))
        self.assertIn("source/rule-snapshot.json", packet["allowedInputPaths"])
        self.assertIn("source/reference-pack/b01.json", packet["allowedInputPaths"])
        self.assertEqual(5, packet["responseRequirements"]["1"]["choiceCount"])

        self.accept_current_tasks(manifest, kind="BATCH_BUILDER")
        manifest = self.store.load(manifest["runId"])
        self.assertEqual("S03_REVIEW1", manifest["currentStage"])
        self.assertEqual(4, len(manifest["tasks"]))
        self.assertEqual(2, len([task for task in manifest["tasks"].values() if task["kind"] == "BATCH_REVIEWER"]))

        self.accept_current_tasks(manifest, kind="BATCH_REVIEWER")
        manifest = self.store.load(manifest["runId"])
        self.assertEqual("S05_REVIEW2", manifest["currentStage"])
        self.assertEqual(8, len(manifest["tasks"]))
        self.assertEqual(2, len([task for task in manifest["tasks"].values() if task["round"] == "revision" and task["status"] == "SKIPPED"]))

        self.accept_current_tasks(manifest, kind="BATCH_REVIEWER")
        manifest = self.store.load(manifest["runId"])
        self.assertEqual("READY_FOR_ASSEMBLY", manifest["status"])
        self.assertEqual("S07_ASSEMBLY", manifest["currentStage"])

        assembled = assemble_staged_exam(self.root, self.store, manifest["runId"], "단계형 테스트 유사")
        self.assertEqual("READY_FOR_MANUAL_REVIEW", assembled["status"])
        self.assertTrue((self.store.run_dir(manifest["runId"]) / "final/staging/generated-exam.js").is_file())
        status = build_staged_status(self.store, manifest["runId"])
        self.assertEqual("MANUAL_RENDER_REVIEW", status["queue"][0]["kind"])

        packaged = package_staged_exam(self.store, manifest["runId"])
        self.assertEqual("DRAFT_PACKAGED", packaged["status"])
        self.assertTrue((self.store.run_dir(manifest["runId"]) / "final/alive-staged-exam-pack.zip").is_file())

    def test_batch_candidate_artifact_alias_is_accepted(self) -> None:
        manifest = self.start()
        task = next(
            item for item in manifest["tasks"].values()
            if item["kind"] == "BATCH_BUILDER" and item["status"] == "PENDING"
        )
        payload = self.draft(manifest, task)
        payload["artifactType"] = "ALIVE_STAGED_BATCH_CANDIDATE"
        self.put_inbox(manifest, task, payload)
        reconcile_staged_run(self.store, manifest["runId"])
        accepted = self.store.load(manifest["runId"])["batches"][task["batchId"]]
        accepted_payload = json.loads(
            (self.store.run_dir(manifest["runId"]) / accepted["round1AcceptedPath"]).read_text(
                encoding="utf-8"
            )
        )
        self.assertEqual("ALIVE_STAGED_BATCH_DRAFT", accepted_payload["artifactType"])

    def test_review_finding_routes_only_that_batch_through_revision(self) -> None:
        manifest = self.start()
        self.accept_current_tasks(manifest, kind="BATCH_BUILDER")
        manifest = self.store.load(manifest["runId"])
        for task in list(manifest["tasks"].values()):
            if task["kind"] == "BATCH_REVIEWER":
                self.put_inbox(manifest, task, self.review(task, verdict="REVISE" if task["batchId"] == "b01" else "PASS"))
        reconcile_staged_run(self.store, manifest["runId"])
        manifest = self.store.load(manifest["runId"])
        self.assertEqual("S04_REVISION", manifest["currentStage"])
        revisions = [task for task in manifest["tasks"].values() if task["round"] == "revision"]
        self.assertEqual(1, len([task for task in revisions if task["status"] == "PENDING"]))
        self.assertEqual(1, len([task for task in revisions if task["status"] == "SKIPPED"]))

    def test_review_accepts_legacy_result_artifact_alias(self) -> None:
        manifest = self.start()
        self.accept_current_tasks(manifest, kind="BATCH_BUILDER")
        manifest = self.store.load(manifest["runId"])
        task = manifest["tasks"]["b01-review1"]
        payload = self.review(task)
        payload["artifactType"] = "ALIVE_STAGED_REVIEW_RESULT"
        payload["reviews"][0]["independentAnswer"] = {"value": 0, "choiceIndex": 3}
        payload["reviews"][0]["visualCheck"] = {"verdict": "PASS", "role": "solution"}
        self.put_inbox(manifest, task, payload)
        result = reconcile_staged_run(self.store, manifest["runId"])
        self.assertEqual(1, len(result["accepted"]))
        self.assertTrue(self.store.load(manifest["runId"])["batches"]["b01"]["review1"]["items"][0]["answerMatch"])
        self.assertEqual("ACCEPTED", self.store.load(manifest["runId"])["tasks"][task["taskId"]]["status"])

    def test_review_prefers_selected_choice_when_content_is_also_reported(self) -> None:
        manifest = self.start()
        self.accept_current_tasks(manifest, kind="BATCH_BUILDER")
        manifest = self.store.load(manifest["runId"])
        task = manifest["tasks"]["b01-review1"]
        payload = self.review(task)
        payload["reviews"][0]["independentAnswer"] = {
            "canonicalAnswer": "1/3",
            "selectedChoice": 3,
        }
        self.put_inbox(manifest, task, payload)
        result = reconcile_staged_run(self.store, manifest["runId"])
        self.assertEqual(1, len(result["accepted"]))
        accepted_item = self.store.load(manifest["runId"])["batches"]["b01"]["review1"]["items"][0]
        self.assertEqual("3", accepted_item["independentAnswer"]["canonicalAnswer"])
        self.assertTrue(accepted_item["answerMatch"])

    def test_recover_failed_task_reopens_only_that_artifact(self) -> None:
        manifest = self.start()
        self.accept_current_tasks(manifest, kind="BATCH_BUILDER")
        manifest = self.store.load(manifest["runId"])
        task = manifest["tasks"]["b01-review1"]
        self.put_inbox(manifest, task, self.review(task))
        task["status"] = "FAILED"
        task["lastError"] = "temporary artifact contract mismatch"
        manifest["status"] = "FAILED"
        manifest["codes"] = ["STAGED_ARTIFACT_RETRY_EXHAUSTED"]
        self.store.save(manifest["runId"], manifest)

        recovered = recover_staged_task(self.store, manifest["runId"], task["taskId"])
        self.assertEqual("PENDING", recovered["status"])
        self.assertEqual("REVIEW1_RUNNING", self.store.load(manifest["runId"])["status"])
        mark_staged_task_complete(self.store, manifest["runId"], task["taskId"])
        result = reconcile_staged_run(self.store, manifest["runId"])
        self.assertEqual(1, len(result["accepted"]))

    def test_dispatched_task_waits_for_completion_marker_and_accepts_legacy_answer_alias(self) -> None:
        manifest = self.start()
        task = manifest["tasks"]["b01-round1"]
        start_staged_dispatch(self.store, manifest["runId"], task["taskId"], "external-b01")
        payload = self.draft(manifest, task)
        for item in payload["questions"]:
            item["answerContract"] = {
                "responseForm": "객관식",
                "correctChoiceNumber": 3,
                "correctChoiceIndex": 2,
                "correctChoice": "$3$",
            }
        self.put_inbox(manifest, task, payload)
        before = reconcile_staged_run(self.store, manifest["runId"])
        self.assertEqual([], before["accepted"])
        self.assertEqual("DISPATCHED", self.store.load(manifest["runId"])["tasks"][task["taskId"]]["status"])

        mark_staged_task_complete(self.store, manifest["runId"], task["taskId"])
        after = reconcile_staged_run(self.store, manifest["runId"])
        self.assertEqual(1, len(after["accepted"]))
        persisted = self.store.load(manifest["runId"])
        self.assertEqual("ACCEPTED", persisted["tasks"][task["taskId"]]["status"])

    def test_answer_matching_resolves_choice_content_and_display_answer(self) -> None:
        self.assertTrue(
            _answer_matches(
                {"answerType": "choice_index", "canonicalAnswer": "3"},
                {"answerType": "choice", "canonicalAnswer": "30"},
                ["10", "20", "30", "40", "50"],
            )
        )
        self.assertTrue(
            _answer_matches(
                {"answerType": "text", "canonicalAnswer": "P(X=0)=27/64;P(X=1)=27/64"},
                {"answerType": "text", "canonicalAnswer": "P(X=0)=27/64, P(X=1)=27/64"},
            )
        )
        self.assertTrue(
            _answer_matches(
                {
                    "answerType": "expression",
                    "canonicalAnswer": "k∈{−9,−8,−7};a=2;b=−16",
                    "displayAnswer": "k∈{−9,−8,−7}, a=2, b=−16",
                },
                {"answerType": "text", "canonicalAnswer": "k∈{−9,−8,−7}, a=2, b=−16"},
            )
        )

    def test_multiple_choice_contract_normalizes_indices_and_matches_order_independently(self) -> None:
        contract = _normalize_contract(
            {"answerType": "choice_indices", "correctChoiceNumbers": [2, 4]},
            source_question(1),
            "MCQ",
            2,
        )

        self.assertEqual("choice_indices", contract["answerType"])
        self.assertEqual("2,4", contract["canonicalAnswer"])
        self.assertEqual("②, ④", contract["displayAnswer"])
        self.assertEqual(2, contract["answerCardinality"])
        self.assertTrue(
            _answer_matches(
                contract,
                {"answerType": "choice_indices", "canonicalAnswer": "4,2"},
            )
        )

    def test_visual_question_runs_through_recon_svg_review_assembly_and_package(self) -> None:
        manifest = self.start_visual()
        self.assertEqual("S02_ROUND1_GENERATION", manifest["currentStage"])
        self.assertEqual("PASS", manifest["stages"][2]["status"])
        run_dir = self.store.run_dir(manifest["runId"])
        recon = json.loads((run_dir / "source/visual-recon.json").read_text(encoding="utf-8"))
        self.assertEqual("READY", recon["status"])
        self.assertTrue(list((run_dir / "source/visual").rglob("*")))

        task = manifest["tasks"]["b01-round1"]
        payload = self.draft(manifest, task)
        payload["questions"][0]["visualSpec"] = {
            "type": "coordinate_plane",
            "width": 240,
            "height": 240,
            "xRange": [-3, 3],
            "yRange": [-3, 3],
            "segments": [{"from": {"x": -1, "y": -1}, "to": {"x": 2, "y": 2}}],
            "points": [{"x": 2, "y": 2, "label": "P"}],
        }
        self.put_inbox(manifest, task, payload)
        reconcile_staged_run(self.store, manifest["runId"])
        manifest = self.store.load(manifest["runId"])
        self.assertEqual("S03_REVIEW1", manifest["currentStage"])
        review_task = manifest["tasks"]["b01-review1"]
        candidate = json.loads((run_dir / "candidates/b01/round1.json").read_text(encoding="utf-8"))
        review_payload = self.review(review_task)
        visual_asset = candidate["questions"][0]["visualAsset"]
        review_payload["reviews"][0]["visualCheck"] = {
            "verdict": "PASS",
            "assetSha256": visual_asset["sha256"],
            "visualSpecSha256": visual_asset["specSha256"],
            "checks": {
                "topology": "PASS",
                "semanticOwnership": "PASS",
                "labels": "PASS",
                "determinism": "PASS",
            },
        }
        self.put_inbox(manifest, review_task, review_payload)
        reconcile_staged_run(self.store, manifest["runId"])
        manifest = self.store.load(manifest["runId"])
        self.assertEqual("S05_REVIEW2", manifest["currentStage"])
        review2 = manifest["tasks"]["b01-review2"]
        candidate2 = json.loads((run_dir / "candidates/b01/revision.json").read_text(encoding="utf-8"))
        review_payload = self.review(review2)
        visual_asset = candidate2["questions"][0]["visualAsset"]
        review_payload["reviews"][0]["visualCheck"] = {
            "verdict": "PASS",
            "assetSha256": visual_asset["sha256"],
            "visualSpecSha256": visual_asset["specSha256"],
            "checks": {
                "topology": "PASS",
                "semanticOwnership": "PASS",
                "labels": "PASS",
                "determinism": "PASS",
            },
        }
        self.put_inbox(manifest, review2, review_payload)
        reconcile_staged_run(self.store, manifest["runId"])
        manifest = self.store.load(manifest["runId"])
        self.assertEqual("READY_FOR_ASSEMBLY", manifest["status"])
        assembled = assemble_staged_exam(self.root, self.store, manifest["runId"], "시각 단계형 테스트 유사")
        self.assertEqual("READY_FOR_MANUAL_REVIEW", assembled["status"])
        structured = json.loads((run_dir / "final/structured-exam.json").read_text(encoding="utf-8"))
        self.assertIn("_generated/alive-staged-exam-runs", structured["questions"][0]["image"])
        self.assertTrue((run_dir / "final/assets/q001.svg").is_file())

        evidence = {
            "actualBrowser": True,
            "productionEngine": True,
            "modes": {
                name: {
                    "verdict": "PASS", "ready": True, "renderError": None,
                    "unrenderedMath": 0, "overflowCount": 0, "lastQuestion": 1,
                    "badImages": [], "lastPageChecked": True,
                    "solutionVisualCoverage": {
                        "requiredOrdinals": [],
                        "renderedOrdinals": [],
                        "missingOrdinals": [],
                        "verdict": "PASS",
                    } if name == "solution" else None,
                }
                for name in ("exam", "solution", "answer")
            },
        }
        evidence_path = self.root / "render-evidence.json"
        evidence_path.write_text(json.dumps(evidence), encoding="utf-8")
        record_staged_render(self.store, manifest["runId"], evidence_path)
        packaged = package_staged_exam(self.store, manifest["runId"])
        self.assertEqual("RENDERED_PACKAGED", packaged["status"])
        with zipfile.ZipFile(run_dir / "final/alive-staged-exam-pack.zip") as archive:
            self.assertIn("final/assets/q001.svg", archive.namelist())
            self.assertIn("source/visual-recon.json", archive.namelist())

    def test_circle_solution_visual_is_required_and_reaches_solution_page(self) -> None:
        self.write_exam(count=1)
        source_payload = json.loads(self.source.read_text(encoding="utf-8").split("=", 2)[-1].rstrip(";\n"))
        source_payload[0]["content"] = "원의 방정식과 접선 ℓ의 관계를 이용하여라. [3점]"
        self.source.write_text(
            'window.examTitle = "원 해설 단계형 테스트";\n'
            + "window.questionBank = "
            + json.dumps(source_payload, ensure_ascii=False)
            + ";\n",
            encoding="utf-8",
        )
        manifest = start_staged_exam(
            self.root,
            self.store,
            self.source.relative_to(self.root).as_posix(),
            "원 해설 단계형 테스트 전체 유사",
            "test-engine",
            batch_count=1,
        )
        task = manifest["tasks"]["b01-round1"]
        payload = self.draft(manifest, task)
        payload["questions"][0]["solutionDetail"] = self.circle_solution_detail()
        payload["questions"][0]["solutionVisualSpec"] = {
            "version": "0.1",
            "type": "circle_geometry",
            "width": 300,
            "height": 300,
            "xRange": [-5, 5],
            "yRange": [-5, 5],
            "circles": [{"center": {"x": 0, "y": 0, "label": "C"}, "radius": 3}],
            "points": [
                {"x": 0, "y": 0, "label": "C"},
                {"x": 0, "y": 3, "label": "T"},
            ],
            "segments": [{"from": {"x": 0, "y": 0}, "to": {"x": 0, "y": 3}, "kind": "radius", "label": "r"}],
            "lines": [{"from": {"x": -5, "y": 3}, "to": {"x": 5, "y": 3}, "kind": "tangent", "label": "ℓ"}],
            "rightAngles": [{"vertex": {"x": 0, "y": 3}, "alongA": {"x": 0, "y": 0}, "alongB": {"x": 1, "y": 3}}],
        }
        self.put_inbox(manifest, task, payload)
        reconcile_staged_run(self.store, manifest["runId"])
        manifest = self.store.load(manifest["runId"])
        candidate = json.loads((self.store.run_dir(manifest["runId"]) / "candidates/b01/round1.json").read_text(encoding="utf-8"))
        item = candidate["questions"][0]
        self.assertEqual("MANDATORY", item["solutionQuality"]["visualRequirement"])
        self.assertIn("/solution/", item["solutionVisualAsset"]["path"])

        for task_id in ("b01-review1",):
            review_task = manifest["tasks"][task_id]
            review_payload = self.review(review_task)
            visual_asset = item["solutionVisualAsset"]
            review_payload["reviews"][0]["solutionReview"]["checks"]["diagramConsistency"] = "PASS"
            review_payload["reviews"][0]["solutionReview"]["visualCheck"] = {
                "verdict": "PASS",
                "assetSha256": visual_asset["sha256"],
                "visualSpecSha256": visual_asset["specSha256"],
                "checks": {"topology": "PASS", "semanticOwnership": "PASS", "labels": "PASS", "determinism": "PASS"},
            }
            self.put_inbox(manifest, review_task, review_payload)
        reconcile_staged_run(self.store, manifest["runId"])
        manifest = self.store.load(manifest["runId"])
        self.assertEqual("S05_REVIEW2", manifest["currentStage"])
        review_task = manifest["tasks"]["b01-review2"]
        candidate = json.loads((self.store.run_dir(manifest["runId"]) / "candidates/b01/revision.json").read_text(encoding="utf-8"))
        visual_asset = candidate["questions"][0]["solutionVisualAsset"]
        review_payload = self.review(review_task)
        review_payload["reviews"][0]["solutionReview"]["checks"]["diagramConsistency"] = "PASS"
        review_payload["reviews"][0]["solutionReview"]["visualCheck"] = {
            "verdict": "PASS",
            "assetSha256": visual_asset["sha256"],
            "visualSpecSha256": visual_asset["specSha256"],
            "checks": {"topology": "PASS", "semanticOwnership": "PASS", "labels": "PASS", "determinism": "PASS"},
        }
        self.put_inbox(manifest, review_task, review_payload)
        reconcile_staged_run(self.store, manifest["runId"])
        manifest = self.store.load(manifest["runId"])
        self.assertEqual("S07_ASSEMBLY", manifest["currentStage"])
        self.assertEqual([1], manifest["motherFinal"]["solutionVisualRequiredOrdinals"])

        assemble_staged_exam(self.root, self.store, manifest["runId"], "원 해설 단계형 테스트 유사")
        run_dir = self.store.run_dir(manifest["runId"])
        structured = json.loads((run_dir / "final/structured-exam.json").read_text(encoding="utf-8"))
        self.assertIn("solutionImage", structured["questions"][0])
        self.assertTrue((run_dir / "final/assets/q001-solution.svg").is_file())


if __name__ == "__main__":
    unittest.main()
