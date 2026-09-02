from __future__ import annotations

import json
import tempfile
import unittest
import zipfile
from pathlib import Path

from alive.engine.exam_batch import (
    assemble_exam,
    package_exam,
    preflight_exam,
    record_exam_render,
    start_exam_batch,
    sync_exam_batch,
)
from alive.engine.phase3 import ARCHIVE_FIELDS
from alive.engine.run_store import RunStore, atomic_write_json, sha256_file


def source_question(ordinal: int, *, visual: bool = False) -> dict:
    question = {
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
        "solution": "풀이",
    }
    if visual:
        question["image"] = "assets/q.svg"
    return question


def structured_question(ordinal: int) -> dict:
    question = source_question(ordinal)
    question["id"] = 1
    question["content"] = f"새 유사 문항 {ordinal}"
    question["tags"] = ["함수"]
    question.update({
        "answerType": "choice_index",
        "canonicalAnswer": "3",
        "acceptableAnswers": [],
        "equivalencePolicy": "exact",
    })
    return question


class ExamBatchTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.runtime = self.root / "alive/runtime/runs"
        self.store = RunStore(self.runtime)
        self.source = self.root / "archive/exams/original/high/h1/2final/test.js"
        self.source.parent.mkdir(parents=True)

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def write_exam(self, questions: list[dict]) -> None:
        self.source.write_text(
            "window.examTitle = \"테스트 시험\";\n\n"
            f"window.questionBank = {json.dumps(questions, ensure_ascii=False, indent=2)};\n",
            encoding="utf-8",
        )

    def start_supported(self) -> dict:
        self.write_exam([source_question(1), source_question(2)])
        return start_exam_batch(
            self.root,
            self.store,
            self.source.relative_to(self.root).as_posix(),
            "테스트 전체 유사",
            "test-engine",
        )

    def freeze_children(self, parent: dict, *, duplicate: bool = False) -> None:
        for ordinal_text, child in parent["children"].items():
            ordinal = int(ordinal_text)
            child_dir = self.store.run_dir(child["runId"])
            atomic_write_json(
                child_dir / "source/source-question.json",
                {"questionSha256": child["sourceQuestionSha256"]},
            )
            structured = structured_question(1 if duplicate else ordinal)
            visual_dependency = parent["preflight"]["questions"][ordinal - 1]["visualDependency"]
            visual_member = None
            if visual_dependency == "ESSENTIAL":
                visual_member = "final/assets/q1.svg"
                visual_path = child_dir / visual_member
                visual_path.parent.mkdir(parents=True, exist_ok=True)
                visual_path.write_text(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"></svg>\n',
                    encoding="utf-8",
                )
                structured["visual"] = {
                    "visualSpecVersion": "0.1", "assetType": "svg",
                    "assetLocalPath": visual_member, "assetSha256": sha256_file(visual_path),
                    "renderer": "test", "visualValidator": "PASS",
                }
            atomic_write_json(child_dir / "final/structured-question.json", structured)
            atomic_write_json(child_dir / "final/validation-sidecar.json", {"finalStatus": "PASS"})
            package = child_dir / "final/alive-evidence-pack.zip"
            members = ["final/structured-question.json", "final/validation-sidecar.json"]
            if visual_member:
                members.append(visual_member)
            with zipfile.ZipFile(package, "w", compression=zipfile.ZIP_DEFLATED) as archive:
                for member in members:
                    archive.write(child_dir / member, arcname=member)
            atomic_write_json(
                child_dir / "final/package-report.json",
                {
                    "zipSha256": sha256_file(package),
                    "publicationStatus": "NOT_PUBLISHED",
                    "roundTrip": "PASS",
                    "validationSidecarFinalStatus": "PASS",
                    "members": members,
                },
            )
            manifest = self.store.load(child["runId"])
            manifest["status"] = "LOCALLY_FROZEN"
            manifest["currentStage"] = "R17_LOCAL_FREEZE"
            self.store.save(child["runId"], manifest)

    def test_preflight_and_start_fail_closed_without_partial_children(self) -> None:
        unsupported = source_question(2)
        unsupported["tags"].append("공통자료")
        self.write_exam([source_question(1), unsupported])
        _, report = preflight_exam(self.root, self.source.relative_to(self.root).as_posix())
        self.assertEqual([2], report["heldOrdinals"])
        self.assertEqual(7, report["scoreContract"]["totalPoints"])
        parent = start_exam_batch(
            self.root, self.store, self.source.relative_to(self.root).as_posix(), None, "test-engine"
        )
        self.assertEqual("BLOCKED", parent["status"])
        self.assertEqual({}, parent["children"])

    def test_preflight_accepts_valid_multiple_choice_answers(self) -> None:
        multiple = source_question(1)
        multiple["answer"] = "②, ④"
        self.write_exam([multiple])

        _, report = preflight_exam(self.root, self.source.relative_to(self.root).as_posix())

        self.assertTrue(report["wholeExamReady"])
        self.assertEqual([], report["heldOrdinals"])
        question_report = report["questions"][0]
        self.assertEqual(2, question_report["answerCardinality"])
        self.assertEqual("MCQ_MULTIPLE_ANSWER", question_report["normalizations"][-1])
        self.assertEqual("MULTIPLE_CIRCLED", question_report["answerRepresentation"])

    def test_visual_exam_child_asset_is_assembled_and_packaged(self) -> None:
        self.write_exam([source_question(1, visual=True)])
        parent = start_exam_batch(
            self.root, self.store, self.source.relative_to(self.root).as_posix(), None, "test-engine"
        )
        self.assertEqual("READY_FOR_CHILD_RUNS", parent["status"])
        self.assertEqual("ESSENTIAL", parent["preflight"]["questions"][0]["visualDependency"])
        self.freeze_children(parent)
        assembled = assemble_exam(self.root, self.store, parent["runId"], "시각 시험")
        parent_dir = self.store.run_dir(parent["runId"])
        self.assertTrue((parent_dir / "final/assets/q01.svg").is_file())
        structured = json.loads((parent_dir / "final/structured-exam.json").read_text(encoding="utf-8"))
        self.assertIn("alive-exam-runs", structured["questions"][0]["image"])
        self.assertEqual("READY_FOR_RENDER", assembled["status"])
        evidence = {
            "actualBrowser": True, "productionEngine": True,
            "modes": {
                name: {"verdict": "PASS", "ready": True, "renderError": None,
                       "unrenderedMath": 0, "overflowCount": 0, "lastQuestion": 1,
                       "badImages": [], "lastPageChecked": True}
                for name in ("exam", "solution", "answer")
            },
        }
        evidence_path = self.root / "visual-exam-render.json"
        evidence_path.write_text(json.dumps(evidence), encoding="utf-8")
        record_exam_render(self.store, parent["runId"], evidence_path)
        package_exam(self.store, parent["runId"])
        with zipfile.ZipFile(parent_dir / "final/alive-whole-exam-pack.zip") as archive:
            self.assertIn("final/assets/q01.svg", archive.namelist())

    def test_supported_exam_creates_one_child_per_question(self) -> None:
        parent = self.start_supported()
        self.assertEqual("READY_FOR_CHILD_RUNS", parent["status"])
        self.assertEqual(2, len(parent["children"]))
        for ordinal, child in parent["children"].items():
            context = json.loads(
                (self.store.run_dir(child["runId"]) / "evidence/adapter-context.json").read_text(encoding="utf-8")
            )
            self.assertEqual(1, context["id"])
            self.assertNotIn("객관식", context["tags"])
            self.assertEqual(int(ordinal), self.store.load(child["runId"])["sourceLock"]["questionOrdinal"])

    def test_nonvisual_constructed_response_is_supported(self) -> None:
        response = source_question(1)
        response.update({
            "questionType": "서술형",
            "tags": ["서술형", "함수"],
            "choices": [],
            "answer": "$x=2$",
        })
        self.write_exam([response])
        _, report = preflight_exam(self.root, self.source.relative_to(self.root).as_posix())
        self.assertTrue(report["wholeExamReady"])
        parent = start_exam_batch(
            self.root, self.store, self.source.relative_to(self.root).as_posix(), None, "test-engine"
        )
        child = parent["children"]["1"]
        context_payload = json.loads(
            (self.store.run_dir(child["runId"]) / "evidence/adapter-context.json").read_text(encoding="utf-8")
        )
        self.assertEqual("CONSTRUCTED_RESPONSE", context_payload["expectedQuestionType"])
        self.assertNotIn("서술형", context_payload["tags"])

    def test_preflight_normalizes_supported_archive_type_choice_and_score_notations(self) -> None:
        image_asset = self.root / "archive/assets/choice-panel.png"
        image_asset.parent.mkdir(parents=True)
        image_asset.write_bytes(b"\x89PNG\r\n\x1a\nimage-panel")
        short_answer = source_question(1)
        short_answer.update({
            "questionType": "단답형",
            "tags": ["단답형", "함수"],
            "choices": [],
            "answer": "$2$",
            "content": "단답형 문항. [부분 점수 없음, 5점]",
        })
        image_only_mcq = source_question(2, visual=True)
        image_only_mcq.update({
            "choices": [],
            "image": "assets/choice-panel.png",
            "content": "그림 안의 다섯 선택지에서 고르시오. [4점]",
        })
        inline_score = source_question(3)
        inline_score["content"] = "보기 자료. [3.7점]<div class=\"note-box\">조건</div>"
        self.write_exam([short_answer, image_only_mcq, inline_score])

        _, report = preflight_exam(self.root, self.source.relative_to(self.root).as_posix())

        self.assertTrue(report["wholeExamReady"])
        self.assertEqual(12.7, report["scoreContract"]["totalPoints"])
        self.assertEqual("주관식", report["questions"][0]["normalizedQuestionType"])
        self.assertIn("QUESTION_TYPE_SHORT_ANSWER_ALIAS", report["questions"][0]["normalizations"])
        self.assertEqual("IMAGE_ONLY", report["questions"][1]["choiceRepresentation"])
        self.assertIn("MCQ_IMAGE_ONLY_CHOICES", report["questions"][1]["normalizations"])
        self.assertEqual("INLINE_SCORE_ANNOTATION", report["questions"][2]["score"]["notation"])

        parent = start_exam_batch(
            self.root, self.store, self.source.relative_to(self.root).as_posix(), None, "test-engine"
        )
        context = json.loads(
            (self.store.run_dir(parent["children"]["1"]["runId"]) / "evidence/adapter-context.json")
            .read_text(encoding="utf-8")
        )
        self.assertEqual("SHORT_ANSWER", context["expectedQuestionType"])
        self.assertNotIn("단답형", context["tags"])

    def test_image_only_mcq_requires_a_valid_local_archive_image(self) -> None:
        corrupt_asset = self.root / "archive/assets/corrupt-choice-panel.png"
        corrupt_asset.parent.mkdir(parents=True)
        corrupt_asset.write_bytes(b"not an image")
        for image_path in ("assets/missing-choice-panel.png", "assets/corrupt-choice-panel.png"):
            with self.subTest(image_path=image_path):
                image_only_mcq = source_question(1, visual=True)
                image_only_mcq.update({"choices": [], "image": image_path})
                self.write_exam([image_only_mcq])

                _, report = preflight_exam(self.root, self.source.relative_to(self.root).as_posix())

                self.assertFalse(report["wholeExamReady"])
                self.assertEqual(["MCQ_FIVE_CHOICES_REQUIRED"], report["questions"][0]["codes"])

    def test_real_2025_h1_second_midterms_are_whole_exam_ready(self) -> None:
        repository_root = Path(__file__).resolve().parents[3]
        source_dir = repository_root / "archive/exams/original/high/h1/2mid"
        expectations = {
            "25_금당고_2학기_중간_고1_기출.js": {
                "shortAnswers": [18], "imageChoices": [],
                "visuals": {
                    3: "OPTIONAL", 4: "OPTIONAL", 8: "OPTIONAL", 11: "OPTIONAL",
                    12: "OPTIONAL", 14: "ESSENTIAL", 16: "OPTIONAL", 18: "OPTIONAL",
                    19: "OPTIONAL", 21: "OPTIONAL",
                },
            },
            "25_매산고_2학기_중간_고1_기출.js": {
                "shortAnswers": [16, 17, 18], "imageChoices": [],
                "visuals": {7: "OPTIONAL", 10: "ESSENTIAL", 14: "OPTIONAL", 18: "OPTIONAL", 20: "OPTIONAL"},
            },
            "25_순천고_2학기_중간_고1_기출.js": {
                "shortAnswers": [18, 19, 20], "imageChoices": [],
                "visuals": {
                    7: "OPTIONAL", 9: "OPTIONAL", 10: "OPTIONAL", 11: "ESSENTIAL",
                    16: "OPTIONAL", 17: "OPTIONAL", 18: "ESSENTIAL", 19: "OPTIONAL", 22: "OPTIONAL",
                },
            },
            "25_제일고_2학기_중간_고1_기출.js": {
                "shortAnswers": [], "imageChoices": [2, 12],
                "visuals": {
                    2: "ESSENTIAL", 12: "ESSENTIAL", 13: "OPTIONAL", 15: "ESSENTIAL",
                    16: "OPTIONAL", 17: "ESSENTIAL", 18: "ESSENTIAL", 22: "OPTIONAL",
                },
            },
        }

        for filename, expected in expectations.items():
            source = source_dir / filename
            _, report = preflight_exam(repository_root, source.relative_to(repository_root).as_posix())
            questions = report["questions"]

            with self.subTest(source=filename):
                self.assertTrue(report["wholeExamReady"])
                self.assertEqual([], report["heldOrdinals"])
                self.assertEqual([], report["examCodes"])
                self.assertEqual(100, report["scoreContract"]["totalPoints"])
                self.assertEqual(
                    expected["shortAnswers"],
                    [
                        question["ordinal"] for question in questions
                        if "QUESTION_TYPE_SHORT_ANSWER_ALIAS" in question["normalizations"]
                    ],
                )
                self.assertEqual(
                    expected["imageChoices"],
                    [
                        question["ordinal"] for question in questions
                        if question["choiceRepresentation"] == "IMAGE_ONLY"
                    ],
                )
                self.assertEqual(
                    expected["visuals"],
                    {
                        question["ordinal"]: question["visualDependency"]
                        for question in questions
                        if question["visualDependency"] != "NONE"
                    },
                )

    def test_source_drift_is_rejected(self) -> None:
        parent = self.start_supported()
        self.source.write_text(self.source.read_text(encoding="utf-8") + "\n", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "SOURCE_LOCK_DRIFT"):
            sync_exam_batch(self.root, self.store, parent["runId"])

    def test_retryable_r03_failure_creates_one_recovery_child_with_lineage(self) -> None:
        parent = self.start_supported()
        original_child = parent["children"]["1"]
        original_run_id = original_child["runId"]
        original_dir = self.store.run_dir(original_run_id)
        original_context = (original_dir / "evidence/adapter-context.json").read_bytes()
        original_manifest = self.store.load(original_run_id)
        original_manifest.update({
            "status": "FAILED",
            "currentStage": "R03_SOURCE_ANALYSIS",
            "codes": ["SOURCE_ANALYSIS_GATE_FAILED"],
        })
        self.store.save(original_run_id, original_manifest)
        failed_original = self.store.load(original_run_id)

        synced = sync_exam_batch(self.root, self.store, parent["runId"])

        child = synced["children"]["1"]
        recovery_run_id = f"{original_run_id}-recovery-01"
        self.assertEqual("ACTIVE", synced["status"])
        self.assertEqual(recovery_run_id, child["runId"])
        self.assertEqual(original_run_id, child["predecessorRunId"])
        self.assertEqual(original_run_id, child["rootRunId"])
        self.assertEqual(1, child["recoveryAttempt"])
        self.assertEqual("SOURCE_ANALYSIS_GATE_FAILED", child["recoveryReasonCode"])
        self.assertEqual(2, len(child["attempts"]))
        self.assertEqual("FAILED", child["attempts"][0]["status"])
        self.assertEqual("SOURCE_ANALYSIS_GATE_FAILED", child["attempts"][0]["failureReasonCode"])
        self.assertEqual("READY_FOR_ORCHESTRATION", child["attempts"][1]["status"])
        self.assertEqual(failed_original, self.store.load(original_run_id))

        recovery_dir = self.store.run_dir(recovery_run_id)
        recovery = self.store.load(recovery_run_id)
        self.assertEqual("READY_FOR_ORCHESTRATION", recovery["status"])
        self.assertEqual("R03_SOURCE_ANALYSIS", recovery["currentStage"])
        self.assertEqual(original_run_id, recovery["predecessorRunId"])
        self.assertEqual(original_run_id, recovery["rootRunId"])
        self.assertEqual(1, recovery["recoveryAttempt"])
        self.assertEqual("SOURCE_ANALYSIS_GATE_FAILED", recovery["recoveryReasonCode"])
        self.assertEqual(parent["sourceLock"], {**recovery["sourceLock"], "questionOrdinal": None})
        self.assertEqual(1, recovery["sourceLock"]["questionOrdinal"])
        self.assertEqual(child["sourceQuestionSha256"], recovery["sourceQuestionSha256"])
        self.assertEqual(
            child["sourceQuestionSha256"],
            json.loads((recovery_dir / "source/source-question.json").read_text(encoding="utf-8"))["questionSha256"],
        )
        self.assertEqual(original_context, (recovery_dir / "evidence/adapter-context.json").read_bytes())

    def test_failed_recovery_child_closes_parent_after_the_single_attempt(self) -> None:
        parent = self.start_supported()
        original_run_id = parent["children"]["1"]["runId"]
        original = self.store.load(original_run_id)
        original.update({
            "status": "FAILED",
            "currentStage": "R03_SOURCE_ANALYSIS",
            "codes": ["SOURCE_ANALYSIS_GATE_FAILED"],
        })
        self.store.save(original_run_id, original)
        recovered = sync_exam_batch(self.root, self.store, parent["runId"])
        recovery_run_id = recovered["children"]["1"]["runId"]
        recovery = self.store.load(recovery_run_id)
        recovery.update({
            "status": "FAILED",
            "currentStage": "R03_SOURCE_ANALYSIS",
            "codes": ["SOURCE_ANALYSIS_GATE_FAILED"],
        })
        self.store.save(recovery_run_id, recovery)

        terminal = sync_exam_batch(self.root, self.store, parent["runId"])

        self.assertEqual("FAILED", terminal["status"])
        self.assertEqual("E02_CHILD_RUNS", terminal["currentStage"])
        self.assertIn("CHILD_RECOVERY_EXHAUSTED", terminal["codes"])
        self.assertEqual(recovery_run_id, terminal["children"]["1"]["runId"])
        self.assertFalse(self.store.run_dir(f"{original_run_id}-recovery-02").exists())
        self.assertEqual("SOURCE_ANALYSIS_GATE_FAILED", terminal["children"]["1"]["attempts"][1]["failureReasonCode"])

    def test_source_lock_and_source_question_integrity_failures_are_not_retried(self) -> None:
        parent = self.start_supported()
        source_lock_child = parent["children"]["1"]
        source_hash_child = parent["children"]["2"]
        source_lock_manifest = self.store.load(source_lock_child["runId"])
        source_lock_manifest.update({
            "status": "FAILED",
            "currentStage": "R03_SOURCE_ANALYSIS",
            "codes": ["SOURCE_LOCK_DRIFT"],
        })
        self.store.save(source_lock_child["runId"], source_lock_manifest)
        source_hash_child["sourceQuestionSha256"] = "tampered-source-question-hash"
        parent_on_disk = self.store.load(parent["runId"])
        parent_on_disk["children"]["2"]["sourceQuestionSha256"] = source_hash_child["sourceQuestionSha256"]
        self.store.save(parent["runId"], parent_on_disk)
        source_hash_manifest = self.store.load(source_hash_child["runId"])
        source_hash_manifest.update({
            "status": "FAILED",
            "currentStage": "R03_SOURCE_ANALYSIS",
            "codes": ["SOURCE_ANALYSIS_GATE_FAILED"],
        })
        self.store.save(source_hash_child["runId"], source_hash_manifest)

        terminal = sync_exam_batch(self.root, self.store, parent["runId"])

        self.assertEqual("FAILED", terminal["status"])
        self.assertIn("CHILD_RECOVERY_INTEGRITY_FAILURE", terminal["codes"])
        self.assertEqual(source_lock_child["runId"], terminal["children"]["1"]["runId"])
        self.assertEqual(source_hash_child["runId"], terminal["children"]["2"]["runId"])
        self.assertFalse(self.store.run_dir(f"{source_lock_child['runId']}-recovery-01").exists())
        self.assertFalse(self.store.run_dir(f"{source_hash_child['runId']}-recovery-01").exists())

    def test_frozen_children_assemble_render_and_package_complete_exam(self) -> None:
        parent = self.start_supported()
        self.freeze_children(parent)
        synced = sync_exam_batch(self.root, self.store, parent["runId"])
        self.assertEqual("READY_FOR_ASSEMBLY", synced["status"])
        assembled = assemble_exam(self.root, self.store, parent["runId"], "생성 시험")
        self.assertEqual("READY_FOR_RENDER", assembled["status"])
        structured = json.loads(
            (self.store.run_dir(parent["runId"]) / "final/structured-exam.json").read_text(encoding="utf-8")
        )
        self.assertEqual([1, 2], [question["id"] for question in structured["questions"]])
        self.assertTrue(structured["questions"][0]["content"].endswith("[3점]"))
        self.assertTrue(structured["questions"][1]["content"].endswith("[4점]"))
        for question in structured["questions"]:
            self.assertTrue(set(ARCHIVE_FIELDS).issubset(question))
        evidence = {
            "actualBrowser": True,
            "productionEngine": True,
            "modes": {
                mode: {
                    "verdict": "PASS", "ready": True, "renderError": None,
                    "unrenderedMath": 0, "overflowCount": 0, "lastQuestion": 2,
                    "badImages": [], "lastPageChecked": True,
                }
                for mode in ("exam", "solution", "answer")
            },
        }
        evidence_path = self.root / "render.json"
        evidence_path.write_text(json.dumps(evidence), encoding="utf-8")
        record_exam_render(self.store, parent["runId"], evidence_path)
        packaged = package_exam(self.store, parent["runId"])
        self.assertEqual("LOCALLY_FROZEN", packaged["status"])
        self.assertEqual("NOT_PUBLISHED", packaged["package"]["publicationStatus"])

    def test_render_and_duplicate_assembly_fail_closed(self) -> None:
        parent = self.start_supported()
        self.freeze_children(parent, duplicate=True)
        with self.assertRaisesRegex(ValueError, "duplicate"):
            assemble_exam(self.root, self.store, parent["runId"], "중복 시험")


if __name__ == "__main__":
    unittest.main()
