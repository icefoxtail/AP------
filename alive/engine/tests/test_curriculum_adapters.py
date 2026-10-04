from __future__ import annotations

import unittest
from pathlib import Path

from alive.engine.curriculum_adapters import load_high1_curriculum_adapters
from alive.engine.high1_units import load_all_high1_fixtures
from alive.engine.structure_families import default_structure_family_registry


class CurriculumAdapterTests(unittest.TestCase):
    def setUp(self) -> None:
        self.root = Path(__file__).resolve().parents[3]
        self.registry = load_high1_curriculum_adapters(self.root)

    def test_registry_matches_all_18_canonical_units(self) -> None:
        adapters = self.registry.list()
        self.assertEqual(18, len(adapters))
        self.assertEqual("H22-C-01", adapters[0].unit_key)
        self.assertEqual("H22-C2-09", adapters[-1].unit_key)
        self.assertEqual("원의 방정식", self.registry.require("H22-C2-03").label)

    def test_existing_high1_solver_solution_and_visual_lane_are_connected(self) -> None:
        fixtures = load_all_high1_fixtures(self.root)
        selected = next(item for item in fixtures if item["caseId"] == "h22-c2-03-circle-tangent-composite")
        adapter = self.registry.require(selected["unitKey"])
        result = adapter.solve_fixture(selected)
        review = adapter.independently_review(selected, result)
        self.assertEqual("PASS", review["verdict"])
        self.assertEqual("PASS", result["solutionQuality"]["verdict"])
        self.assertIsInstance(result["solutionDetail"], dict)
        self.assertIsInstance(result["solutionVisualSpec"], dict)

    def test_universal_variant_capabilities_remain_hold_until_transform_promotion(self) -> None:
        report = self.registry.capability_report(default_structure_family_registry())
        self.assertEqual(18, report["canonicalUnitCount"])
        self.assertTrue(all(row["capability"]["status"] == "HOLD" for row in report["rows"]))
        self.assertEqual("NOT_PERFORMED", report["productionArchiveRegistration"])


if __name__ == "__main__":
    unittest.main()
