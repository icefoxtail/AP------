from __future__ import annotations

import json
import tempfile
import unittest
import zipfile
from pathlib import Path

from alive.engine.phase3 import (
    adapt_selected_candidate,
    package_run,
    record_render_evidence,
    serialize_structured_question,
)
from alive.engine.visual_renderer import render_visual_file


SHA = "a" * 64


def candidate() -> dict:
    return {
        "schemaVersion": "0.2.0",
        "artifactType": "CANDIDATE_DRAFT",
        "artifactId": "candidate-b",
        "candidateId": "candidate-b",
        "producerId": "builder-b",
        "sourceLockSha256": SHA,
        "planArtifactId": "plan-b",
        "candidateFingerprint": "function-four-roots",
        "question": {
            "questionType": "MCQ",
            "content": "함수의 치역이 {k}일 때 가능한 k의 개수는?",
            "choices": ["6", "7", "8", "9", "10"],
        },
        "answerContract": {
            "answerType": "choice_index",
            "canonicalAnswer": "3",
            "equivalencePolicy": "exact_index",
            "verificationProfile": "EXACT",
        },
        "solution": {"steps": ["가능한 k는 1부터 8까지이므로 개수는 8이다."]},
    }


def context() -> dict:
    return {
        "id": 1,
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
        "layoutTag": "grid",
        "tags": ["함수", "상수함수"],
        "wide": False,
    }


def constructed_candidate() -> dict:
    value = candidate()
    value["candidateFingerprint"] = "disjoint-set-definition"
    value["question"] = {
        "questionType": "CONSTRUCTED_RESPONSE",
        "content": "두 집합이 서로소라는 뜻을 쓰고 예를 하나 들어라.",
        "choices": [],
    }
    value["answerContract"] = {
        "answerType": "text",
        "canonicalAnswer": "$A\\cap B=\\varnothing$이고 공통 원소가 없다.",
        "acceptableAnswers": ["두 집합의 교집합이 공집합이다."],
        "equivalencePolicy": "normalized_string",
        "verificationProfile": "EXACT",
    }
    value["solution"] = {
        "steps": ["서로소의 정의에 따라 두 집합의 교집합은 공집합이다."]
    }
    return value


class Phase3Tests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.run_dir = self.root / "alive/runtime/runs/run-1"
        for name in ("final", "render"):
            (self.run_dir / name).mkdir(parents=True, exist_ok=True)
        master = self.root / "docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md"
        master.parent.mkdir(parents=True)
        master.write_text(
            "| H22-C2-07 | 함수 | 7 |\n"
            "| H22-C2-07 | H22-C2-07-FUNCTION_BASIC | 함수의 뜻과 그래프 | H22-C2-07-FUNCTION_BASIC |\n",
            encoding="utf-8",
        )
        (self.run_dir / "final/selected-candidate.json").write_text(
            json.dumps(candidate(), ensure_ascii=False), encoding="utf-8"
        )
        (self.run_dir / "final/selection-report.json").write_text("{}", encoding="utf-8")
        self.context_path = self.root / "context.json"
        self.context_path.write_text(json.dumps(context(), ensure_ascii=False), encoding="utf-8")
        self.manifest = {
            "runId": "run-1",
            "status": "PHASE2_COMPLETE",
            "currentStage": "R13_STRUCTURED_ADAPTER",
            "request": {"generationMode": "EXAM_FOLLOWUP", "outputProfile": "JS_ARCHIVE"},
            "sourceLock": {"sha256": SHA, "path": "source.js", "questionOrdinal": 19, "qKey": "source.js_19"},
            "phase2": {"selectedCandidateId": "candidate-b"},
        }

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def test_adapter_serializer_render_and_package_round_trip(self) -> None:
        adapted = adapt_selected_candidate(self.root, self.run_dir, self.manifest, self.context_path)
        self.assertIn("structuredQuestionSha256", adapted)
        structured = json.loads((self.run_dir / "final/structured-question.json").read_text(encoding="utf-8"))
        self.assertEqual("③", structured["answer"])
        self.assertEqual("8", structured["canonicalAnswer"])
        self.assertTrue(structured["solution"].endswith("따라서 정답은 ③이다."))
        self.assertTrue((self.run_dir / "final/validation-sidecar.json").is_file())

        self.manifest["currentStage"] = "R14_JS_SERIALIZER"
        serialized = serialize_structured_question(self.root, self.run_dir, self.manifest, "ALIVE 테스트")
        self.assertIn("stagingJsSha256", serialized)
        report = json.loads((self.run_dir / "final/serializer-report.json").read_text(encoding="utf-8"))
        self.assertEqual("PASS", report["semanticRoundTrip"])
        self.assertIn("answerType", report["internalFieldsExcluded"])

        evidence = {
            "actualBrowser": True,
            "productionEngine": True,
            "modes": {
                name: {"verdict": "PASS", "ready": True, "renderError": None, "unrenderedMath": 0, "overflowCount": 0, "lastQuestion": 1, "badImages": []}
                for name in ("exam", "solution", "answer")
            },
        }
        evidence_path = self.root / "render.json"
        evidence_path.write_text(json.dumps(evidence), encoding="utf-8")
        self.manifest["currentStage"] = "R15_REAL_RENDER"
        record_render_evidence(self.run_dir, self.manifest, evidence_path)
        self.manifest["currentStage"] = "R16_PACKAGE"
        packaged = package_run(self.run_dir, self.manifest)
        self.assertIn("packageSha256", packaged)
        self.assertTrue((self.run_dir / "final/alive-evidence-pack.zip").is_file())
        sidecar = json.loads((self.run_dir / "final/validation-sidecar.json").read_text(encoding="utf-8"))
        self.assertEqual("PASS", sidecar["finalStatus"])
        self.assertEqual("", sidecar["requiredResource"])
        with zipfile.ZipFile(self.run_dir / "final/alive-evidence-pack.zip") as archive:
            zipped_sidecar = json.loads(archive.read("final/validation-sidecar.json"))
        self.assertEqual("PASS", zipped_sidecar["finalStatus"])

    def test_adapter_rejects_noncanonical_metadata(self) -> None:
        broken = context()
        broken["standardUnit"] = "잘못된 단원"
        self.context_path.write_text(json.dumps(broken, ensure_ascii=False), encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "not canonical"):
            adapt_selected_candidate(self.root, self.run_dir, self.manifest, self.context_path)

    def test_adapter_supports_constructed_response_without_distractor_contract(self) -> None:
        draft = constructed_candidate()
        (self.run_dir / "final/selected-candidate.json").write_text(
            json.dumps(draft, ensure_ascii=False), encoding="utf-8"
        )
        response_context = context()
        response_context["expectedQuestionType"] = "CONSTRUCTED_RESPONSE"
        response_context["tags"] = ["집합", "서로소"]
        self.context_path.write_text(
            json.dumps(response_context, ensure_ascii=False), encoding="utf-8"
        )
        adapted = adapt_selected_candidate(
            self.root, self.run_dir, self.manifest, self.context_path
        )
        self.assertIn("structuredQuestionSha256", adapted)
        structured = json.loads(
            (self.run_dir / "final/structured-question.json").read_text(encoding="utf-8")
        )
        self.assertEqual("서술형", structured["questionType"])
        self.assertEqual([], structured["choices"])
        self.assertEqual("text", structured["answerType"])
        self.assertEqual("normalized_string", structured["equivalencePolicy"])
        sidecar = json.loads(
            (self.run_dir / "final/validation-sidecar.json").read_text(encoding="utf-8")
        )
        self.assertNotIn("V8_DISTRACTOR", sidecar["validators"])

    def test_adapter_rejects_question_type_downgrade(self) -> None:
        response_context = context()
        response_context["expectedQuestionType"] = "CONSTRUCTED_RESPONSE"
        self.context_path.write_text(
            json.dumps(response_context, ensure_ascii=False), encoding="utf-8"
        )
        with self.assertRaisesRegex(ValueError, "does not match"):
            adapt_selected_candidate(self.root, self.run_dir, self.manifest, self.context_path)

    def test_visual_candidate_asset_reaches_serializer_shadow(self) -> None:
        visual_dir = self.run_dir / "candidates/b/draft"
        visual_dir.mkdir(parents=True)
        spec = {
            "version": "0.1", "type": "simple_function_graph",
            "width": 240, "height": 240, "xRange": [-3, 3], "yRange": [-3, 3],
            "curves": [{"points": [{"x": -3, "y": -1}, {"x": 0, "y": 0}, {"x": 3, "y": 1}]}],
        }
        spec_path = visual_dir / "visual-spec.json"
        spec_path.write_text(json.dumps(spec), encoding="utf-8")
        report = render_visual_file(
            spec_path, visual_dir / "visual.svg", visual_dir / "visual-render-report.json"
        )
        draft = candidate()
        draft["visualDependency"] = "ESSENTIAL"
        draft["visualSpec"] = spec
        draft["visualAsset"] = {
            "path": "candidates/b/draft/visual.svg", "assetType": "svg",
            "sha256": report["assetSha256"], "specSha256": report["specSha256"],
            "rendererVersion": report["rendererVersion"],
            "reportPath": "candidates/b/draft/visual-render-report.json",
            "deterministicRerender": "PASS",
        }
        (self.run_dir / "final/selected-candidate.json").write_text(
            json.dumps(draft, ensure_ascii=False), encoding="utf-8"
        )
        (self.run_dir / "final/selection-report.json").write_text(
            json.dumps({"visualEvidence": [{
                "candidateArtifactId": "candidate-b", "overallVerdict": "PASS",
                "assetSha256": report["assetSha256"],
                "visualSpecSha256": report["specSha256"],
            }]}), encoding="utf-8"
        )
        visual_context = context()
        visual_context["expectedVisualDependency"] = "ESSENTIAL"
        self.context_path.write_text(json.dumps(visual_context, ensure_ascii=False), encoding="utf-8")
        adapt_selected_candidate(self.root, self.run_dir, self.manifest, self.context_path)
        self.assertTrue((self.run_dir / "final/assets/q1.svg").is_file())
        self.manifest["currentStage"] = "R14_JS_SERIALIZER"
        serialize_structured_question(self.root, self.run_dir, self.manifest, "시각 테스트")
        shadow = self.root / "archive/_generated/alive-runs/run-1/assets/q1.svg"
        self.assertTrue(shadow.is_file())
        generated = (self.run_dir / "final/staging/generated-question.js").read_text(encoding="utf-8")
        self.assertIn("_generated/alive-runs/run-1/assets/q1.svg", generated)
        render = {
            "actualBrowser": True, "productionEngine": True,
            "modes": {
                name: {"verdict": "PASS", "ready": True, "renderError": None,
                       "unrenderedMath": 0, "overflowCount": 0, "lastQuestion": 1,
                       "badImages": []}
                for name in ("exam", "solution", "answer")
            },
        }
        render_path = self.root / "visual-render-evidence.json"
        render_path.write_text(json.dumps(render), encoding="utf-8")
        self.manifest["currentStage"] = "R15_REAL_RENDER"
        record_render_evidence(self.run_dir, self.manifest, render_path)
        self.manifest["currentStage"] = "R16_PACKAGE"
        package_run(self.run_dir, self.manifest)
        with zipfile.ZipFile(self.run_dir / "final/alive-evidence-pack.zip") as archive:
            self.assertIn("final/assets/q1.svg", archive.namelist())

    def test_render_evidence_fails_closed(self) -> None:
        self.manifest["currentStage"] = "R15_REAL_RENDER"
        evidence_path = self.root / "render.json"
        evidence_path.write_text(json.dumps({"actualBrowser": True, "productionEngine": True, "modes": {}}), encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "requires exam"):
            record_render_evidence(self.run_dir, self.manifest, evidence_path)


if __name__ == "__main__":
    unittest.main()
