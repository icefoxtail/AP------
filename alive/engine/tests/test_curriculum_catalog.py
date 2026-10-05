from __future__ import annotations

import unittest
from pathlib import Path

from alive.engine.curriculum_catalog import load_curriculum_catalog
from alive.engine.mixed_exam_planner import build_mixed_exam_plan
from alive.engine.structure_families import default_structure_family_registry


class CurriculumCatalogTests(unittest.TestCase):
    def setUp(self) -> None:
        self.root = Path(__file__).resolve().parents[3]
        self.catalog = load_curriculum_catalog(self.root)

    def test_reads_all_canonical_course_tables(self) -> None:
        self.assertGreaterEqual(self.catalog.capability_report()["courseCount"], 16)
        self.assertGreaterEqual(self.catalog.capability_report()["unitCount"], 130)
        self.assertEqual("M1-03", self.catalog.require("M1-03").unit_key)
        self.assertEqual("문자와 식", self.catalog.require("M1-03").label)
        self.assertEqual("H22-M1-08", self.catalog.require("H22-M1-08").unit_key)

    def test_catalog_never_promotes_a_unit_without_an_adapter(self) -> None:
        report = self.catalog.capability_report()
        self.assertEqual(0, report["supportedUnitCount"])
        self.assertEqual(report["unitCount"], report["holdUnitCount"])
        self.assertTrue(all(row["generationAllowed"] is False for row in report["rows"]))
        self.assertTrue(all(row["capabilityStatus"] == "HOLD" for row in report["rows"]))

    def test_planner_preserves_explicit_family_but_holds_missing_adapter(self) -> None:
        result = build_mixed_exam_plan(
            [{"id": 1, "unitKey": "M1-03", "structureFamily": "LINEAR_EQUATION", "content": "x", "questionType": "단답형"}],
            registry=default_structure_family_registry(),
            curriculum_registry=self.catalog,
            target_classes=("A",),
        )
        assignment = result["assignments"][0]
        self.assertEqual("LINEAR_EQUATION", assignment["structureFamily"])
        self.assertEqual("HOLD", assignment["status"])
        self.assertEqual("CAPABILITY_PRECHECK_FAIL", assignment["code"])
        self.assertEqual("HOLD", assignment["canonicalUnit"]["promotionState"])

    def test_planner_does_not_invent_mixed_family_for_unknown_analysis(self) -> None:
        result = build_mixed_exam_plan(
            [{"id": 1, "unitKey": "H22-M1-01", "content": "원문", "questionType": "단답형"}],
            registry=default_structure_family_registry(),
            curriculum_registry=self.catalog,
            target_classes=("B",),
        )
        assignment = result["assignments"][0]
        self.assertEqual("MIXED", assignment["structureFamily"])
        self.assertEqual("HOLD", assignment["status"])
        self.assertEqual("CAPABILITY_PRECHECK_FAIL", assignment["code"])


if __name__ == "__main__":
    unittest.main()
