import copy
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from visual_engine.past_exam_adapter import adapt_expected_facts, build_candidate


def sample():
    return {
        "schemaVersion": "past-exam-expected-facts-v1",
        "questionUid": "adapter-q01",
        "route": "STANDARD",
        "visualType": "coordinate_geometry",
        "viewport": {"xMin": -3, "xMax": 3, "yMin": -3, "yMax": 3},
        "sourceFacts": {"A": [0, 0], "B": [2, 0], "xAxis": [0, 1, 0], "yAxis": [1, 0, 0]},
        "derivedFacts": {},
        "displayFacts": {},
        "objects": [
            {"id": "A", "kind": "POINT", "at": [0, 0]},
            {"id": "B", "kind": "POINT", "at": [2, 0]},
            {"id": "xAxis", "kind": "LINE", "coefficients": [0, 1, 0]},
            {"id": "yAxis", "kind": "LINE", "coefficients": [1, 0, 0]},
            {"id": "origin", "kind": "INTERSECTION", "refs": ["xAxis", "yAxis"], "target": "A"},
        ],
        "axes": True,
    }


class PastExamAdapterTests(unittest.TestCase):
    def test_hash_tracks_frozen_expected_fact_bytes(self):
        a = sample()
        b = copy.deepcopy(a)
        b["sourceFacts"]["B"] = [3, 0]
        self.assertNotEqual(adapt_expected_facts(a)["independentFactHash"], adapt_expected_facts(b)["independentFactHash"])

    def test_inner_outer_binding_is_identical(self):
        fact = adapt_expected_facts(sample())
        self.assertEqual(fact["independentFactHash"], fact["visualSpec"]["sourceFacts"]["independentFactHash"])

    def test_independent_engine_entrypoint_rejects_hash_mismatch(self):
        from visual_engine.entrypoints import build_independent
        fact = adapt_expected_facts(sample())
        fact["independentFactHash"] = "0" * 64
        with self.assertRaisesRegex(ValueError, "FROZEN_FACT_HASH_BINDING_FAIL"):
            build_independent({}, fact)

    def test_missing_visual_spec_fields_fail_closed(self):
        bad = sample()
        del bad["objects"]
        with self.assertRaisesRegex(ValueError, "SCHEMA_FAIL"):
            adapt_expected_facts(bad)

    def test_invalid_semantic_relation_fails_closed(self):
        bad = sample()
        bad["objects"][-1]["refs"] = ["xAxis", "missing"]
        with tempfile.TemporaryDirectory() as tmp:
            facts = Path(tmp) / "facts.json"
            facts.write_text(json.dumps(bad), encoding="utf-8")
            with self.assertRaises(ValueError):
                build_candidate(bad, {"engineVersion": "geometry-visual-v1", "runId": "adapter-test", "outputRoot": "archive/_generated/geometry-visual-engine/adapter-test", "productionBaselinePolicy": "READ_ONLY", "allowProductionWrite": False})

    def test_production_output_root_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "PRODUCTION_WRITE_FORBIDDEN"):
            build_candidate(sample(), {"engineVersion": "geometry-visual-v1", "runId": "adapter-test", "outputRoot": "archive/assets/images/adapter-test", "productionBaselinePolicy": "READ_ONLY", "allowProductionWrite": False})

    def test_candidate_path_is_accepted(self):
        result = build_candidate(sample(), {"engineVersion": "geometry-visual-v1", "runId": "adapter-regression", "outputRoot": "archive/_generated/geometry-visual-engine/adapter-regression", "productionBaselinePolicy": "READ_ONLY", "allowProductionWrite": False})
        self.assertEqual(result["route"], "STANDARD")
        self.assertTrue((Path(__file__).resolve().parents[4] / result["path"] / "visual.svg").is_file())

    def test_no_production_payload_or_source_fields_are_created_or_mutated(self):
        original = sample()
        before = copy.deepcopy(original)
        result = adapt_expected_facts(original)
        self.assertEqual(original, before)
        self.assertEqual(set(result), {"independentFactHash", "visualSpec"})
        contract = json.loads((Path(__file__).resolve().parents[2] / "past-exam-pipeline" / "completion-contract.json").read_text(encoding="utf-8"))
        self.assertIn("solutionImage", contract["allowedCompletionFields"])
        self.assertNotIn("geometryVisual", contract["allowedCompletionFields"])

    def test_no_new_stage_and_final_authority_is_separate(self):
        root = Path(__file__).resolve().parents[2] / "past-exam-pipeline"
        contract = json.loads((root / "completion-contract.json").read_text(encoding="utf-8"))
        stages = contract["stages"]
        start = stages.index("EXPECTED_FACT_FREEZE")
        self.assertEqual(stages[start + 1], "NUMERIC_VISUAL_BUILD")
        self.assertNotIn("SVG_ENGINE_UPGRADE_PENDING", stages)
        rules = (Path(__file__).resolve().parents[4] / "docs/rules/02_PIPELINES/Past_Exam_V3_COMPLETE.md").read_text(encoding="utf-8")
        self.assertIn("FINAL/APPLY", rules)
        self.assertIn("단독 차단하지 않으며", rules)

    def test_special_route_requires_candidate_svg_and_registered_adapter(self):
        bad = sample()
        bad["route"] = "SPECIAL"
        bad["specialVisual"] = {"adapter": "UNKNOWN", "candidateSvg": "<svg/>"}
        with self.assertRaisesRegex(ValueError, "SPECIAL_REQUIRES"):
            build_candidate(bad, {"engineVersion": "geometry-visual-v1", "runId": "adapter-test", "outputRoot": "archive/_generated/geometry-visual-engine/adapter-test", "productionBaselinePolicy": "READ_ONLY", "allowProductionWrite": False})

    def test_registered_special_route_stays_candidate_only(self):
        special = sample()
        special["route"] = "SPECIAL"
        special["specialVisual"] = {"adapter": "HANDCRAFTED_SVG", "candidateSvg": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="2"/></svg>'}
        result = build_candidate(special, {"engineVersion": "geometry-visual-v1", "runId": "adapter-special", "outputRoot": "archive/_generated/geometry-visual-engine/adapter-special", "productionBaselinePolicy": "READ_ONLY", "allowProductionWrite": False})
        self.assertEqual(result["route"], "SPECIAL")
        witness = json.loads((Path(__file__).resolve().parents[4] / result["path"] / "witness.json").read_text(encoding="utf-8"))
        self.assertFalse(witness["publicationAuthorized"])


if __name__ == "__main__":
    unittest.main()
