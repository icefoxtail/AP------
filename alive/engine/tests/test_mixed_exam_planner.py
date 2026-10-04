from __future__ import annotations

import unittest

from alive.engine.middle_school_data_organization_interpretation_engine import (
    middle_school_data_variant_registry,
)
from alive.engine.mixed_exam_planner import build_mixed_exam_plan
from alive.engine.structure_families import StructureFamilyAdapter, StructureFamilyRegistry


class MixedExamPlannerTests(unittest.TestCase):
    def test_planner_records_source_profile_and_exact_class_ranges(self) -> None:
        registry = StructureFamilyRegistry()
        registry.register(
            StructureFamilyAdapter(
                family_id="LINEAR_EQUATION",
                transform_capabilities={"numeric": "SUPPORTED", "representation": "SUPPORTED"},
                solver_profile="fixture",
            )
        )
        result = build_mixed_exam_plan(
            [
                {"id": 1, "structureFamily": "LINEAR_EQUATION", "level": "중", "questionType": "객관식"},
                {"id": 2, "structureFamily": "LINEAR_EQUATION", "level": "중", "questionType": "주관식", "visualRequired": True},
                {"id": 3, "structureFamily": "LINEAR_EQUATION", "level": "상", "questionType": "객관식"},
                {"id": 4, "structureFamily": "LINEAR_EQUATION", "level": "상", "questionType": "객관식"},
            ],
            registry=registry,
            target_classes=("A", "B"),
            target_class_ranges={"A": {"min": 2, "max": 2}, "B": {"min": 2, "max": 2}},
            planner_policy={"maxVisualCount": 1, "maxConstructedResponseCount": 1},
            school_profile={"school": "fixture", "term": "mid"},
        )
        self.assertEqual("PASS", result["status"])
        self.assertEqual({"A": 2, "B": 2}, result["plannedDistribution"]["variantClass"])
        self.assertEqual("PASS", result["rangeStatus"])
        self.assertEqual(1, result["sourceDistribution"]["visualCount"])
        self.assertEqual(1, result["plannedDistribution"]["constructedResponseCount"])
        self.assertEqual("fixture", result["schoolProfile"]["school"])

    def test_ineligible_c_is_hold_without_silent_substitution(self) -> None:
        registry = StructureFamilyRegistry()
        registry.register(
            StructureFamilyAdapter(
                family_id="LINEAR_EQUATION",
                transform_capabilities={"PARAMETER_RECOVERY": "SUPPORTED"},
                solver_profile="fixture",
            )
        )
        result = build_mixed_exam_plan(
            [{"id": 1, "structureFamily": "LINEAR_EQUATION", "allowedVariantClasses": ["A"]}],
            registry=registry,
            target_classes=("C",),
        )
        self.assertEqual("HOLD", result["status"])
        self.assertEqual("QUESTION_VARIANT_CLASS_NOT_ELIGIBLE", result["assignments"][0]["code"])

    def test_middle_school_bounded_family_is_accepted_by_shared_contract(self) -> None:
        registry = middle_school_data_variant_registry()
        self.assertEqual(
            "SUPPORTED",
            registry.capability("DATA_FREQUENCY_TOTAL", "numeric")["status"],
        )


if __name__ == "__main__":
    unittest.main()
