from __future__ import annotations

import json
import tempfile
import unittest
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
from unittest.mock import patch

from alive.engine.alive_cli import main
from alive.engine.fast_exam import (
    FastRunStore,
    assemble_fast_exam,
    build_fast_status,
    fast_capability_report,
    fail_fast_dispatch,
    package_fast_exam,
    record_fast_render,
    reconcile_fast_run,
    start_fast_dispatch,
    start_fast_exam,
    submit_fast_artifact,
)
from alive.engine.run_store import atomic_write_json
from alive.engine.source_question import artifact_sha256


def source_question(ordinal: int, *, common: bool = False) -> dict:
    tags = ["객관식", "함수"]
    if common:
        tags.append("공통자료")
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
        "tags": tags,
        "wide": False,
        "content": f"원문 {ordinal}의 값을 구하여라. [{ordinal + 2}점]",
        "choices": ["1", "2", "3", "4", "5"],
        "answer": "③",
        "solution": "원문 풀이",
    }


class FastExamTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.source = self.root / "archive/exams/original/high/h1/2final/fast-test.js"
        self.source.parent.mkdir(parents=True)
        self.runtime = self.root / "alive/runtime/fast-runs"
        self.store = FastRunStore(self.runtime)

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def write_exam(self, questions: list[dict]) -> None:
        self.source.write_text(
            "window.examTitle = \"FAST 테스트\";\n"
            + "window.questionBank = "
            + json.dumps(questions, ensure_ascii=False)
            + ";\n",
            encoding="utf-8",
        )

    def start(
        self,
        questions: list[dict],
        *,
        variation_mode: str = "STRUCTURAL_VARIANT",
    ) -> dict:
        self.write_exam(questions)
        return start_fast_exam(
            self.root,
            self.store,
            self.source.relative_to(self.root).as_posix(),
            "FAST 테스트 전체 유사",
            "test-engine",
            variation_mode=variation_mode,
        )

    @staticmethod
    def draft(manifest: dict, task: dict, *, label: str = "새 문항") -> dict:
        variation_mode = manifest.get("request", {}).get(
            "variationMode", "CONFIRMATION"
        )
        structural_delta = (
            [
                {
                    "dimension": "condition_structure",
                    "description": "조건의 함수 관계를 새로운 비교 조건으로 재구성한다.",
                }
            ]
            if variation_mode == "STRUCTURAL_VARIANT"
            else []
        )
        payload = {
            "schemaVersion": "0.1.0",
            "artifactType": "ALIVE_FAST_QUESTION_DRAFT",
            "artifactId": f"draft-{task['ordinal']}-{task['attempt']}",
            "runId": manifest["runId"],
            "producerId": task["producerId"],
            "sourceLockSha256": manifest["sourceLock"]["sha256"],
            "sourceQuestionSha256": manifest["questions"][str(task["ordinal"])]
            ["sourceQuestionSha256"],
            "questionOrdinal": task["ordinal"],
            "attempt": task["attempt"],
            "studentPayload": {
                "id": 1,
                "questionType": "MCQ",
                "level": "중",
                "content": f"{label}의 값을 구하여라.",
                "choices": ["1", "2", "3", "4", "5"],
            },
            "sourceFingerprint": {"concept": "함수", "solutionGraph": ["계산"]},
            "transformationPlan": {
                "kind": "structural_variant" if variation_mode == "STRUCTURAL_VARIANT" else "confirmation",
                "variationMode": variation_mode,
                "change": "조건 재구성",
                "structuralDelta": structural_delta,
                "distractorProvenance": [
                    {
                        "choiceIndex": index,
                        "errorFamily": family,
                        "errorRoute": route,
                    }
                    for index, family, route in (
                        (1, "OMISSION", "조건의 첫 항을 생략하여 중간 결과 1을 얻는 오류"),
                        (2, "SIGN", "부호를 반대로 처리하여 계산 결과 2를 선택하는 오류"),
                        (4, "COEFFICIENT", "계수를 잘못 적용하여 계산 결과 4를 얻는 오류"),
                        (5, "BOUNDARY", "구간 끝점을 잘못 대입하여 결과 5를 선택하는 오류"),
                    )
                ],
            },
            "answerContract": {
                "answerType": "choice_index",
                "canonicalAnswer": "3",
                "acceptableAnswers": [],
                "equivalencePolicy": "exact",
            },
            "solution": "새 문항의 풀이",
            "riskFlags": [],
        }
        payload["artifactSha256"] = artifact_sha256(payload)
        return payload

    @staticmethod
    def review(manifest: dict, task: dict, student_hash: str, *, verdict: str = "PASS") -> dict:
        payload = {
            "schemaVersion": "0.1.0",
            "artifactType": "ALIVE_FAST_QUESTION_REVIEW",
            "artifactId": f"review-{task['ordinal']}-{task['attempt']}",
            "runId": manifest["runId"],
            "producerId": task["producerId"],
            "sourceLockSha256": manifest["sourceLock"]["sha256"],
            "sourceQuestionSha256": manifest["questions"][str(task["ordinal"])]
            ["sourceQuestionSha256"],
            "questionOrdinal": task["ordinal"],
            "attempt": task["attempt"],
            "studentPayloadSha256": student_hash,
            "independentAnswer": {
                "answerType": "choice_index",
                "canonicalAnswer": "3",
            },
            "verdict": verdict,
            "checks": {
                "mathematics": "PASS" if verdict == "PASS" else "FAIL",
                "curriculum": "PASS",
                "fidelity": "PASS",
                "difficulty": "PASS",
            },
            "findings": [],
            "independenceLevel": "I2_SEPARATE_CALL",
        }
        payload["artifactSha256"] = artifact_sha256(payload)
        return payload

    def put_inbox(self, manifest: dict, task: dict, payload: dict) -> Path:
        path = self.store.run_dir(manifest["runId"]) / task["outputPath"]
        atomic_write_json(path, payload)
        return path

    def test_start_creates_parent_only_fast_state_and_blinded_sources(self) -> None:
        manifest = self.start([source_question(1), source_question(2)])

        self.assertEqual("ALIVE_FAST_EXAM_RUN", manifest["artifactType"])
        self.assertEqual("GENERATING", manifest["status"])
        self.assertEqual("F02_GENERATION", manifest["currentStage"])
        self.assertEqual(2, len(manifest["questions"]))
        self.assertEqual(2, len(manifest["tasks"]))
        self.assertTrue(all(task["status"] == "PENDING" for task in manifest["tasks"].values()))
        self.assertTrue(
            all(
                task["route"] == {"model": "gpt-5.6-luna", "reasoning": "xhigh"}
                for task in manifest["tasks"].values()
            )
        )
        for ordinal in (1, 2):
            student = json.loads(
                (self.store.run_dir(manifest["runId"]) / f"source/student/q{ordinal:03d}.json")
                .read_text(encoding="utf-8")
            )
            self.assertNotIn("answer", student)
            self.assertNotIn("solution", student)
        status = build_fast_status(self.store, manifest["runId"])
        self.assertEqual(2, status["progress"]["pendingTasks"])
        self.assertEqual(2, len([item for item in status["queue"] if item["kind"] == "AGENT_TASK"]))

    def test_builder_then_blinded_review_reaches_ready_without_child_runs(self) -> None:
        manifest = self.start([source_question(1)])
        builder = next(iter(manifest["tasks"].values()))
        draft = self.draft(manifest, builder)
        draft_path = self.put_inbox(manifest, builder, draft)
        accepted = submit_fast_artifact(self.store, manifest["runId"], builder["taskId"], draft_path)

        self.assertEqual("GENERATED", accepted["questionStatus"])
        persisted = self.store.load(manifest["runId"])
        question = persisted["questions"]["1"]
        self.assertEqual("GENERATED", question["status"])
        verifier = persisted["tasks"][question["verifierTaskId"]]
        self.assertEqual("BLINDED_VERIFIER", verifier["kind"])
        packet = json.loads(
            (self.store.run_dir(manifest["runId"]) / verifier["packetPath"]).read_text(encoding="utf-8")
        )
        self.assertNotIn(verifier["acceptedPath"], packet["allowedInputPaths"])
        self.assertIn("final/*", packet["forbiddenInputPaths"])
        self.assertNotIn("answerContract", packet["forbiddenInputPaths"])

        review = self.review(persisted, verifier, question["accepted"]["studentPayloadSha256"])
        review_path = self.put_inbox(persisted, verifier, review)
        result = submit_fast_artifact(self.store, persisted["runId"], verifier["taskId"], review_path)
        self.assertEqual("READY", result["questionStatus"])
        final = self.store.load(manifest["runId"])
        self.assertEqual("READY_FOR_ASSEMBLY", final["status"])
        self.assertEqual("F04_ASSEMBLY", final["currentStage"])
        self.assertFalse((self.store.runtime_root / f"{manifest['runId']}-q001").exists())

    def test_historical_review_envelope_is_normalized_without_inventing_answer(self) -> None:
        manifest = self.start([source_question(1)])
        builder = next(iter(manifest["tasks"].values()))
        draft_path = self.put_inbox(manifest, builder, self.draft(manifest, builder))
        submit_fast_artifact(self.store, manifest["runId"], builder["taskId"], draft_path)

        persisted = self.store.load(manifest["runId"])
        question = persisted["questions"]["1"]
        verifier = persisted["tasks"][question["verifierTaskId"]]
        review = self.review(persisted, verifier, question["accepted"]["studentPayloadSha256"])
        review["independentAnswer"].pop("answerType")
        review["overall"] = review.pop("verdict")
        review["independence"] = review.pop("independenceLevel")
        review["artifactSha256"] = artifact_sha256(review)
        review_path = self.put_inbox(persisted, verifier, review)

        result = submit_fast_artifact(self.store, persisted["runId"], verifier["taskId"], review_path)
        self.assertEqual("READY", result["questionStatus"])
        finished = self.store.load(manifest["runId"])
        accepted_review_meta = finished["questions"]["1"]["accepted"]["review"]
        accepted_review = json.loads(
            (self.store.run_dir(manifest["runId"]) / accepted_review_meta["path"])
            .read_text(encoding="utf-8")
        )
        self.assertEqual("choice_index", accepted_review["independentAnswer"]["answerType"])
        self.assertEqual("PASS", accepted_review["verdict"])
        normalizations = finished["tasks"][verifier["taskId"]]["normalizations"]
        self.assertIn("INFERRED_REVIEW_ANSWER_TYPE", normalizations)
        self.assertIn("OVERALL_TO_VERDICT", normalizations)
        self.assertIn("INDEPENDENCE_TO_LEVEL", normalizations)

    def test_legacy_review_value_and_hash_aliases_are_normalized(self) -> None:
        manifest = self.start([source_question(1)])
        builder = next(iter(manifest["tasks"].values()))
        draft_path = self.put_inbox(manifest, builder, self.draft(manifest, builder))
        submit_fast_artifact(self.store, manifest["runId"], builder["taskId"], draft_path)

        persisted = self.store.load(manifest["runId"])
        question = persisted["questions"]["1"]
        verifier = persisted["tasks"][question["verifierTaskId"]]
        review = self.review(persisted, verifier, question["accepted"]["studentPayloadSha256"])
        review["artifactType"] = "ALIVE_FAST_REVIEW"
        review.pop("artifactId")
        review.pop("producerId")
        review.pop("attempt")
        review["independentAnswer"].pop("canonicalAnswer")
        review["independentAnswer"]["value"] = 3
        review["canonicalAnswer"] = "3"
        review.pop("studentPayloadSha256")
        review["artifactSha256"] = artifact_sha256(review)
        review_path = self.put_inbox(persisted, verifier, review)

        result = submit_fast_artifact(self.store, persisted["runId"], verifier["taskId"], review_path)
        self.assertEqual("READY", result["questionStatus"])
        normalizations = self.store.load(persisted["runId"])["tasks"][verifier["taskId"]]["normalizations"]
        self.assertIn("REVIEW_ARTIFACT_TYPE_ALIAS", normalizations)
        self.assertIn("REVIEW_VALUE_TO_CHOICE_INDEX", normalizations)
        self.assertIn("DERIVED_STUDENT_PAYLOAD_HASH", normalizations)

    def test_dispatch_backpressure_and_reconcile_are_idempotent(self) -> None:
        manifest = self.start([source_question(1)])
        task = next(iter(manifest["tasks"].values()))
        started, idempotent = start_fast_dispatch(
            self.store, manifest["runId"], task["taskId"], "agent-fast-1"
        )
        self.assertFalse(idempotent)
        self.assertEqual("DISPATCHED", started["status"])
        _, idempotent = start_fast_dispatch(
            self.store, manifest["runId"], task["taskId"], "agent-fast-1"
        )
        self.assertTrue(idempotent)
        failed = fail_fast_dispatch(self.store, manifest["runId"], task["taskId"], "THREAD_LIMIT")
        self.assertEqual("PENDING", failed["status"])

        persisted = self.store.load(manifest["runId"])
        draft_path = self.put_inbox(persisted, task, self.draft(persisted, task))
        reconciliation = reconcile_fast_run(self.store, manifest["runId"])
        self.assertEqual([], reconciliation["errors"])
        self.assertEqual("GENERATED", self.store.load(manifest["runId"])["questions"]["1"]["status"])
        self.assertTrue(draft_path.is_file())
        second = reconcile_fast_run(self.store, manifest["runId"])
        self.assertEqual([], second["accepted"])

    def test_reconcile_rechecks_same_rejected_file_after_validator_change(self) -> None:
        manifest = self.start([source_question(1)])
        task = next(iter(manifest["tasks"].values()))
        draft = self.draft(manifest, task)
        for item in draft["transformationPlan"]["distractorProvenance"]:
            item["errorFamily"] = "ARITHMETIC"
        draft["artifactSha256"] = artifact_sha256(draft)
        path = self.put_inbox(manifest, task, draft)
        first = reconcile_fast_run(self.store, manifest["runId"])
        self.assertEqual([], first["accepted"])
        rejected = self.store.load(manifest["runId"])
        self.assertEqual("PENDING", rejected["tasks"][task["taskId"]]["status"])

        fixed = self.draft(rejected, rejected["tasks"][task["taskId"]])
        fixed["artifactSha256"] = artifact_sha256(fixed)
        atomic_write_json(path, fixed)
        second = reconcile_fast_run(self.store, manifest["runId"])
        self.assertEqual(1, len(second["accepted"]))

    def test_draft_rejects_rendered_choice_labels(self) -> None:
        manifest = self.start([source_question(1)])
        task = next(iter(manifest["tasks"].values()))
        draft = self.draft(manifest, task)
        draft["studentPayload"]["choices"][0] = "① 1"
        draft["artifactSha256"] = artifact_sha256(draft)
        path = self.put_inbox(manifest, task, draft)
        with self.assertRaisesRegex(ValueError, "rendered labels"):
            submit_fast_artifact(self.store, manifest["runId"], task["taskId"], path)

    def test_structural_variant_rejects_number_only_surface_clone_before_review(self) -> None:
        manifest = self.start([source_question(1)])
        task = next(iter(manifest["tasks"].values()))
        draft = self.draft(manifest, task)
        draft["studentPayload"]["content"] = "원문 99의 값을 구하여라. [99점]"
        draft["artifactSha256"] = artifact_sha256(draft)
        path = self.put_inbox(manifest, task, draft)

        with self.assertRaisesRegex(ValueError, "FAST_STRUCTURAL_SURFACE_CLONE"):
            submit_fast_artifact(self.store, manifest["runId"], task["taskId"], path)

    def test_confirmation_requires_grounded_distractor_provenance(self) -> None:
        manifest = self.start([source_question(1)], variation_mode="CONFIRMATION")
        task = next(iter(manifest["tasks"].values()))
        draft = self.draft(manifest, task)
        draft["transformationPlan"].pop("distractorProvenance")
        draft["artifactSha256"] = artifact_sha256(draft)
        path = self.put_inbox(manifest, task, draft)

        with self.assertRaisesRegex(ValueError, "FAST_DISTRACTOR_PROVENANCE_REQUIRED"):
            submit_fast_artifact(self.store, manifest["runId"], task["taskId"], path)

    def test_draft_rejects_duplicate_distractor_error_families_before_review(self) -> None:
        manifest = self.start([source_question(1)])
        task = next(iter(manifest["tasks"].values()))
        draft = self.draft(manifest, task)
        for item in draft["transformationPlan"]["distractorProvenance"]:
            item["errorFamily"] = "ARITHMETIC"
        draft["artifactSha256"] = artifact_sha256(draft)
        path = self.put_inbox(manifest, task, draft)

        with self.assertRaisesRegex(ValueError, "FAST_DISTRACTOR_PROVENANCE_FAMILY_DUPLICATE"):
            submit_fast_artifact(self.store, manifest["runId"], task["taskId"], path)

    def test_draft_rejects_generic_distractor_route_before_review(self) -> None:
        manifest = self.start([source_question(1)])
        task = next(iter(manifest["tasks"].values()))
        draft = self.draft(manifest, task)
        draft["transformationPlan"]["distractorProvenance"][0]["errorRoute"] = "단순한 실수로 결과 4를 선택한다"
        draft["artifactSha256"] = artifact_sha256(draft)
        path = self.put_inbox(manifest, task, draft)

        with self.assertRaisesRegex(ValueError, "FAST_DISTRACTOR_PROVENANCE_ROUTE_NOT_CONCRETE"):
            submit_fast_artifact(self.store, manifest["runId"], task["taskId"], path)

    def test_preflight_is_fail_closed_without_fast_tasks(self) -> None:
        manifest = self.start([source_question(1, common=True)])
        self.assertEqual("BLOCKED", manifest["status"])
        self.assertEqual("F01_PREFLIGHT", manifest["currentStage"])
        self.assertEqual({}, manifest["tasks"])
        self.assertIn("FAST_PREFLIGHT_FAIL", manifest["codes"])

    def test_visual_dependency_is_held_before_fast_model_dispatch(self) -> None:
        question = source_question(1)
        question["image"] = "assets/source.svg"
        manifest = self.start([question])
        self.assertEqual("BLOCKED", manifest["status"])
        self.assertEqual("F01_PREFLIGHT", manifest["currentStage"])
        self.assertEqual({}, manifest["tasks"])
        self.assertIn("FAST_VISUAL_NOT_SUPPORTED", manifest["codes"])

    def test_capability_reports_nonvisual_mvp_boundary(self) -> None:
        report = fast_capability_report()
        self.assertTrue(report["active"])
        self.assertEqual("NONVISUAL_WHOLE_EXAM", report["scope"])
        self.assertEqual("STRUCTURAL_VARIANT", report["defaultVariationMode"])
        self.assertEqual(["CONFIRMATION", "STRUCTURAL_VARIANT"], report["variationModes"])
        self.assertIn("essential_visual_generation_lane", report["missing"])
        self.assertIn("fast_inbox_acceptance", report["implemented"])

    def test_review_failure_rechecks_then_regenerates_once(self) -> None:
        manifest = self.start([source_question(1)])
        builder = next(iter(manifest["tasks"].values()))
        draft_path = self.put_inbox(manifest, builder, self.draft(manifest, builder, label="첫 시도"))
        submit_fast_artifact(self.store, manifest["runId"], builder["taskId"], draft_path)

        persisted = self.store.load(manifest["runId"])
        primary = persisted["tasks"][persisted["questions"]["1"]["verifierTaskId"]]
        failed_review = self.review(
            persisted,
            primary,
            persisted["questions"]["1"]["accepted"]["studentPayloadSha256"],
            verdict="FAIL",
        )
        failed_path = self.put_inbox(persisted, primary, failed_review)
        result = submit_fast_artifact(self.store, manifest["runId"], primary["taskId"], failed_path)
        self.assertEqual("RECHECKING", result["questionStatus"])

        persisted = self.store.load(manifest["runId"])
        recheck = next(
            task for task in persisted["tasks"].values()
            if task["kind"] == "BLINDED_VERIFIER" and task["lane"] == "recheck"
        )
        recheck_review = self.review(
            persisted,
            recheck,
            persisted["questions"]["1"]["accepted"]["studentPayloadSha256"],
            verdict="FAIL",
        )
        recheck_path = self.put_inbox(persisted, recheck, recheck_review)
        result = submit_fast_artifact(self.store, manifest["runId"], recheck["taskId"], recheck_path)
        self.assertEqual("GENERATING", result["parentStatus"])

        persisted = self.store.load(manifest["runId"])
        question = persisted["questions"]["1"]
        self.assertEqual(1, question["attempt"])
        self.assertEqual(1, len(question["attemptHistory"]))
        self.assertIn("accepted", question["attemptHistory"][0])
        builder2 = persisted["tasks"][question["builderTaskId"]]
        draft2_path = self.put_inbox(persisted, builder2, self.draft(persisted, builder2, label="재생성"))
        submit_fast_artifact(self.store, manifest["runId"], builder2["taskId"], draft2_path)
        persisted = self.store.load(manifest["runId"])
        verifier2 = persisted["tasks"][persisted["questions"]["1"]["verifierTaskId"]]
        review2 = self.review(
            persisted,
            verifier2,
            persisted["questions"]["1"]["accepted"]["studentPayloadSha256"],
        )
        review2_path = self.put_inbox(persisted, verifier2, review2)
        result = submit_fast_artifact(self.store, manifest["runId"], verifier2["taskId"], review2_path)
        self.assertEqual("READY", result["questionStatus"])
        finished = self.store.load(manifest["runId"])
        self.assertEqual("READY_FOR_ASSEMBLY", finished["status"])
        self.assertEqual(1, len(finished["questions"]["1"]["reviewHistory"]))

    def test_nonvisual_fast_exam_reaches_assembly_render_and_package(self) -> None:
        manifest = self.start([source_question(1), source_question(2)])
        run_id = manifest["runId"]
        for task in list(manifest["tasks"].values()):
            draft_path = self.put_inbox(
                manifest,
                task,
                self.draft(manifest, task, label=f"새 문항 {task['ordinal']}"),
            )
            submit_fast_artifact(self.store, run_id, task["taskId"], draft_path)
            manifest = self.store.load(run_id)
        for ordinal in (1, 2):
            manifest = self.store.load(run_id)
            question = manifest["questions"][str(ordinal)]
            verifier = manifest["tasks"][question["verifierTaskId"]]
            review = self.review(
                manifest,
                verifier,
                question["accepted"]["studentPayloadSha256"],
            )
            review_path = self.put_inbox(manifest, verifier, review)
            submit_fast_artifact(self.store, run_id, verifier["taskId"], review_path)

        assembled = assemble_fast_exam(self.root, self.store, run_id, "FAST MVP 시험지")
        self.assertEqual("READY_FOR_RENDER", assembled["status"])
        run_dir = self.store.run_dir(run_id)
        self.assertTrue((run_dir / "final/staging/generated-exam.js").is_file())
        script = (run_dir / "final/staging/generated-exam.js").read_text(encoding="utf-8")
        self.assertIn("window.questionBank", script)
        self.assertTrue(
            (self.root / "archive/_generated/alive-fast-exam-runs" / run_id / "candidate.js").is_file()
        )

        evidence = {
            "runId": run_id,
            "actualBrowser": True,
            "productionEngine": True,
            "modes": {
                mode: {
                    "verdict": "PASS",
                    "ready": True,
                    "renderError": None,
                    "unrenderedMath": 0,
                    "overflowCount": 0,
                    "lastQuestion": 2,
                    "badImages": [],
                    "lastPageChecked": True,
                }
                for mode in ("exam", "solution", "answer")
            },
        }
        evidence_path = self.root / "render-evidence.json"
        atomic_write_json(evidence_path, evidence)
        rendered = record_fast_render(self.store, run_id, evidence_path)
        self.assertEqual("READY_FOR_PACKAGE", rendered["status"])
        packaged = package_fast_exam(self.store, run_id)
        self.assertEqual("AUTO_READY", packaged["status"])
        package = run_dir / "final/alive-fast-exam-pack.zip"
        self.assertTrue(package.is_file())
        self.assertIn("final/structured-exam.json", packaged["package"]["members"])

    def test_cli_fast_start_resolves_a_unique_exam_query(self) -> None:
        self.write_exam([source_question(1)])
        (self.root / "archive/question-index.js").write_text(
            "window.questionIndex = "
            + json.dumps(
                [{
                    "qKey": "fast-test-1",
                    "sourceFile": self.source.relative_to(self.root).as_posix().replace("archive/exams/", ""),
                    "sourceOrdinal": 1,
                    "grade": "고1",
                    "subject": "공통수학2",
                    "school": "FAST고",
                    "examYear": 2025,
                    "semester": "2",
                    "examType": "final",
                }],
                ensure_ascii=False,
            )
            + ";\n",
            encoding="utf-8",
        )
        output = StringIO()
        with patch("alive.engine.alive_cli.repository_root", return_value=self.root), redirect_stdout(output):
            code = main([
                "fast-exam-start",
                "--query",
                "25년 FAST고 고1 2학기 기말 전체 유사",
                "--runtime-root",
                str(self.runtime),
                "--json",
            ])
        self.assertEqual(0, code)
        payload = json.loads(output.getvalue())
        self.assertEqual("GENERATING", payload["status"])
        saved = self.store.load(payload["runId"])
        self.assertEqual("FAST_EXAM", saved["request"]["executionMode"])


if __name__ == "__main__":
    unittest.main()
