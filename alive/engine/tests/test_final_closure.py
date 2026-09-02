from __future__ import annotations

import json
import shutil
import tempfile
import unittest
from pathlib import Path

from alive.engine.final_closure import audit_final_closure


def _question() -> dict:
    return {
        "id": 1,
        "level": "하",
        "category": "확률분포",
        "originalCategory": "확률분포",
        "standardCourse": "확률과 통계",
        "standardUnitKey": "H15-PS-05",
        "standardUnit": "확률분포",
        "standardUnitOrder": 5,
        "questionType": "객관식",
        "layoutTag": "grid",
        "tags": [],
        "wide": False,
        "content": "확률변수 $X$의 값은?",
        "choices": ["$1$", "$2$", "$3$", "$4$", "$5$"],
        "answer": "③",
        "solution": "[조건] 조건을 확인한다.\n[풀이 과정] $X=3$을 얻는다.\n따라서 정답은 ③이다.",
    }


class FinalClosureTests(unittest.TestCase):
    def _write_js(self, root: Path) -> Path:
        path = root / "archive/exams/similar/high/h1/2mid/test_유사.js"
        path.parent.mkdir(parents=True)
        path.write_text(
            'window.examTitle = "25_테스트_2학기_중간_고1_수학_유사";\n'
            + "window.questionBank = "
            + json.dumps([_question()], ensure_ascii=False)
            + ";\n",
            encoding="utf-8",
        )
        return path

    def test_final_closure_blocks_missing_evidence(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            js = self._write_js(root)

            report = audit_final_closure(root, js, None, None, None)

            self.assertEqual("FAIL", report["status"])
            self.assertEqual("NOT_TESTED", report["browser"]["status"])
            self.assertEqual("NOT_TESTED", report["externalReview"]["status"])
            self.assertEqual("NOT_TESTED", report["questions"][0]["checks"]["math"])
            self.assertEqual("NOT_TESTED", report["questions"][0]["checks"]["solutionArithmetic"])

    def test_final_closure_catches_half_boundary_arithmetic_contradiction(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            question = _question()
            question["solution"] = "[풀이 과정] $a+0.5=150$이므로 $a=149$이다."
            js = root / "archive/exams/similar/high/h1/2mid/test_유사.js"
            js.parent.mkdir(parents=True)
            js.write_text(
                'window.examTitle = "25_테스트_2학기_중간_고1_수학_유사";\n'
                + "window.questionBank = "
                + json.dumps([question], ensure_ascii=False)
                + ";\n",
                encoding="utf-8",
            )

            report = audit_final_closure(root, js, None, None, None)

            self.assertEqual("FAIL", report["status"])
            self.assertTrue(any(item["code"] == "INCONSISTENT_HALF_BOUNDARY_ARITHMETIC" for item in report["findings"]))
            self.assertEqual("FAIL", report["questions"][0]["checks"]["solutionArithmetic"])

    def test_final_closure_rechecks_curriculum_method_policy(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            question = _question()
            question["solution"] = "[풀이 과정] 이항분포를 정규분포로 근사하여 표준화한다."
            question["solutionDetail"] = {
                "keyIdea": "이항분포를 정규분포로 근사한다.",
                "steps": [{"title": "표준화", "work": "정규분포로 근사한다.", "why": "확률을 계산한다."}],
            }
            js = root / "archive/exams/similar/high/h1/2mid/test_유사.js"
            js.parent.mkdir(parents=True)
            js.write_text(
                'window.examTitle = "25_테스트_2학기_중간_고1_수학_유사";\n'
                + "window.questionBank = "
                + json.dumps([question], ensure_ascii=False)
                + ";\n",
                encoding="utf-8",
            )

            report = audit_final_closure(root, js, None, None, None)

            self.assertTrue(
                any(item["code"] == "CONTINUITY_CORRECTION_POLICY" for item in report["findings"])
            )
            self.assertEqual("FAIL", report["questions"][0]["status"])

    @unittest.skipUnless(shutil.which("node"), "node is required for the positive VM closure test")
    def test_final_closure_passes_complete_evidence(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            js = self._write_js(root)
            ledger = root / "review-ledger.json"
            ledger.write_text(
                json.dumps(
                    {
                        "artifactType": "ALIVE_FINAL_REVIEW_LEDGER",
                        "questions": [
                            {
                                "id": 1,
                                **{field: "PASS" for field in (
                                    "structure", "math", "answer", "solution",
                                    "solutionArithmetic", "latex", "meta", "asset", "render",
                                )},
                            }
                        ],
                    },
                    ensure_ascii=False,
                ),
                encoding="utf-8",
            )
            render = root / "render.json"
            mode = {
                "verdict": "PASS",
                "lastQuestion": 1,
                "lastPageChecked": True,
                "unrenderedMath": 0,
                "overflowCount": 0,
                "badImages": [],
                "renderError": None,
                "screenshotCaptured": True,
            }
            render.write_text(
                json.dumps(
                    {"artifactType": "ALIVE_FINAL_RENDER_EVIDENCE", "actualBrowser": True, "productionEngine": True, "modes": {name: mode for name in ("exam", "solution", "answer")}},
                    ensure_ascii=False,
                ),
                encoding="utf-8",
            )
            findings = root / "external-findings.json"
            findings.write_text('{"findings": []}', encoding="utf-8")

            incomplete_variant = root / "variant-incomplete.json"
            incomplete_variant.write_text(
                json.dumps(
                    {
                        "artifactType": "ALIVE_VARIANT_PROOF_LEDGER",
                        "variantProofLedgerComplete": "PASS",
                        "questions": [],
                    },
                    ensure_ascii=False,
                ),
                encoding="utf-8",
            )
            blocked = audit_final_closure(root, js, ledger, render, findings, None, None, incomplete_variant)
            self.assertEqual("FAIL", blocked["status"])
            self.assertEqual("FAIL", blocked["gates"]["variant"])

            variant = root / "variant.json"
            variant.write_text(
                json.dumps(
                    {
                        "artifactType": "ALIVE_VARIANT_PROOF_LEDGER",
                        "variantProofLedgerComplete": "PASS",
                        "questions": [
                            {"id": 1, "variant": {"status": "PASS", "verifiedClass": "VERIFIED_A"}},
                        ],
                    },
                    ensure_ascii=False,
                ),
                encoding="utf-8",
            )
            report = audit_final_closure(root, js, ledger, render, findings, root / "closure.json", None, variant)

            self.assertEqual("PASS", report["status"])
            self.assertEqual("PASS", report["gates"]["variant"])
            self.assertTrue((root / "closure.json").is_file())
            self.assertTrue(all(row["status"] == "PASS" for row in report["questions"]))


if __name__ == "__main__":
    unittest.main()
