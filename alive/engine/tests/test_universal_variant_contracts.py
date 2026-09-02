from __future__ import annotations

import copy
import unittest

from alive.engine.solution_graph import normalize_solution_graph, strip_preprocess_graph
from alive.engine.structure_families import (
    CAPABILITY_HOLD,
    CAPABILITY_UNSUPPORTED,
    StructureFamilyAdapter,
    default_structure_family_registry,
)
from alive.engine.universal_ir import (
    UniversalIRError,
    build_universal_question_ir,
    split_student_proof_ir,
    validate_universal_question_ir,
)
from alive.engine.variant_proof import (
    REQUIRED_CHECKS,
    VARIANT_PROOF_ARTIFACT,
    VARIANT_PROOF_SCHEMA_VERSION,
    build_proof_check,
    reduce_variant_class,
    validate_variant_proof_sidecar,
)
from alive.engine.universal_variant_engine import (
    UniversalVariantEngineError,
    adapt_b_candidate,
    apply_a_parameter_variant,
    build_c_variant,
    build_variant_plan,
    build_variant_proof_ledger,
    evaluate_capability_promotion,
)


class UniversalVariantContractTests(unittest.TestCase):
    def _graph(self) -> dict:
        return {
            "nodes": [
                {"nodeId": "n-source", "role": "core", "op": "read", "inputRole": ["given"], "outputRole": ["equation"], "order": 0, "value": 7},
                {"nodeId": "n-solve", "role": "core", "op": "solve", "inputRole": ["equation"], "outputRole": ["answer"], "order": 1, "value": 3},
            ],
            "edges": [{"source": "n-source", "target": "n-solve"}],
            "coreDecisionCount": 0,
            "branchCount": 0,
            "newConceptCount": 0,
        }

    def _sidecar(self, declared: str) -> dict:
        preprocessing_delta = 1 if declared == "C" else 0
        output_arity = 1 if declared == "C" else 0
        checks = [
            build_proof_check(
                name,
                "PASS",
                method="fixture_deterministic",
                evidence_refs=[f"ev:{declared}:{name}"],
            )
            for name in REQUIRED_CHECKS[declared]
        ]
        return {
            "artifactType": VARIANT_PROOF_ARTIFACT,
            "schemaVersion": VARIANT_PROOF_SCHEMA_VERSION,
            "sourceQuestionId": "q1",
            "declaredClass": declared,
            "verifiedClass": "HOLD",
            "structureFamily": "LINEAR_EQUATION",
            "transform": "numeric",
            "capabilityStatus": "SUPPORTED",
            "coreConceptPreserved": True,
            "solutionGraphPreserved": True,
            "coreDecisionDelta": 0,
            "branchDelta": 0,
            "newConceptDelta": 0,
            "preprocessingDelta": preprocessing_delta,
            "preprocessLoad": {"type": "inference" if declared == "C" else "none", "magnitude": preprocessing_delta},
            "preprocessDeterministic": True,
            "preprocessOutputArity": output_arity,
            "studentObservableInputsOnly": True,
            "ablationPassed": True,
            "shortcutBlocked": True,
            "difficultyDelta": {},
            "proofChecks": checks,
            "proofSha256": "fixture-proof",
        }

    def _catalog(self, sidecar: dict) -> set[str]:
        return {ref for item in sidecar["proofChecks"] for ref in item["evidenceRefs"]}

    def _supported_registry(self):
        registry = default_structure_family_registry()
        registry.register(
            StructureFamilyAdapter(
                family_id="LINEAR_EQUATION",
                transform_capabilities={
                    "numeric": "SUPPORTED",
                    "representation": "SUPPORTED",
                    "PARAMETER_RECOVERY": "SUPPORTED",
                },
                solver_profile="fixture-linear-equation",
            )
        )
        return registry

    def _ir(self) -> dict:
        return build_universal_question_ir(
            {
                "id": 1,
                "questionType": "객관식",
                "content": "{{a}}x+1=3의 해를 구하시오.",
                "choices": ["{{a}}", "2", "3", "4", "5"],
                "answer": "②",
                "layoutTag": "grid",
            },
            source_question_sha256="a" * 64,
            rule_snapshot_sha256="b" * 64,
            structure_family="LINEAR_EQUATION",
            solution_graph=self._graph(),
            parameters={"a": 1},
            mutable_parameters=["a"],
            curriculum={"courseKey": "H22-C", "unitKey": "H22-C-01"},
        )

    def test_graph_fingerprint_ignores_node_ids_and_numeric_values(self) -> None:
        first = normalize_solution_graph(self._graph())
        second_raw = copy.deepcopy(self._graph())
        second_raw["nodes"][0].update({"nodeId": "alpha", "value": 999})
        second_raw["nodes"][1].update({"nodeId": "omega", "value": -12})
        second_raw["edges"] = [{"from": "alpha", "to": "omega"}]
        second = normalize_solution_graph(second_raw)
        self.assertEqual(first["graphFingerprint"], second["graphFingerprint"])

    def test_strip_preprocess_preserves_core_graph_only(self) -> None:
        graph = self._graph()
        graph["nodes"].insert(0, {"nodeId": "p0", "role": "preprocess", "op": "decode", "inputRole": ["table"], "outputRole": ["equation"], "order": 0})
        graph["nodes"][1]["order"] = 1
        graph["nodes"][2]["order"] = 2
        graph["edges"] = [
            {"source": "p0", "target": "n-source"},
            {"source": "n-source", "target": "n-solve"},
        ]
        stripped = strip_preprocess_graph(graph)
        self.assertEqual(2, len(stripped["nodes"]))
        self.assertTrue(all(node["role"] == "core" for node in stripped["nodes"]))
        self.assertEqual([{"from": 0, "to": 1}], stripped["edges"])

    def test_default_registry_keeps_family_transform_on_hold_and_mixed_unsupported(self) -> None:
        registry = default_structure_family_registry()
        self.assertEqual(CAPABILITY_HOLD, registry.capability("LINEAR_EQUATION", "numeric")["status"])
        self.assertEqual(CAPABILITY_UNSUPPORTED, registry.capability("MIXED", "numeric")["status"])
        with self.assertRaises(ValueError):
            StructureFamilyAdapter(family_id="MIXED", transform_capabilities={"numeric": "SUPPORTED"})

    def test_universal_ir_split_keeps_answer_only_in_proof_ir(self) -> None:
        source = {
            "id": 1,
            "questionType": "객관식",
            "content": "방정식 $x+1=3$을 푸시오.",
            "choices": ["1", "2", "3", "4", "5"],
            "answer": "②",
            "solution": "x=2",
            "layoutTag": "grid",
        }
        ir = build_universal_question_ir(
            source,
            source_question_sha256="a" * 64,
            rule_snapshot_sha256="b" * 64,
            structure_family="LINEAR_EQUATION",
            solution_graph=self._graph(),
            curriculum={"courseKey": "H22-C", "unitKey": "H22-C-01"},
        )
        self.assertEqual("PASS", validate_universal_question_ir(ir)["status"])
        split = split_student_proof_ir(ir)
        self.assertNotIn("answer", split["studentIR"])
        self.assertNotIn("solution", split["studentIR"])
        self.assertEqual("②", split["proofIR"]["sourceAnswerContract"]["answer"])

    def test_ir_requires_explicit_hash_and_graph(self) -> None:
        source = {"id": 1, "questionType": "객관식", "content": "문항", "choices": []}
        with self.assertRaises(UniversalIRError):
            build_universal_question_ir(
                source,
                source_question_sha256="not-a-hash",
                rule_snapshot_sha256="b" * 64,
                structure_family="DIRECT_CALCULATION",
                solution_graph=self._graph(),
            )

    def test_student_payload_proof_field_is_rejected(self) -> None:
        source = {"id": 1, "questionType": "객관식", "content": "문항", "choices": []}
        ir = build_universal_question_ir(
            source,
            source_question_sha256="a" * 64,
            rule_snapshot_sha256="b" * 64,
            structure_family="DIRECT_CALCULATION",
            solution_graph=self._graph(),
        )
        ir["studentPayload"]["answer"] = "①"
        self.assertEqual("FAIL", validate_universal_question_ir(ir)["status"])
        with self.assertRaises(UniversalIRError):
            split_student_proof_ir(ir)

    def test_variant_reducer_requires_resolved_evidence_catalog(self) -> None:
        sidecar = self._sidecar("A")
        self.assertEqual("PASS", validate_variant_proof_sidecar(sidecar)["status"])
        self.assertEqual("HOLD", reduce_variant_class(sidecar)["status"])
        result = reduce_variant_class(sidecar, evidence_catalog=self._catalog(sidecar))
        self.assertEqual("PASS", result["status"])
        self.assertEqual("VERIFIED_A", result["verifiedClass"])

    def test_variant_c_requires_exactly_one_observable_preprocess(self) -> None:
        sidecar = self._sidecar("C")
        result = reduce_variant_class(sidecar, evidence_catalog=self._catalog(sidecar))
        self.assertEqual("VERIFIED_C", result["verifiedClass"])

        private_input = copy.deepcopy(sidecar)
        private_input["studentObservableInputsOnly"] = False
        result = reduce_variant_class(private_input, evidence_catalog=self._catalog(private_input))
        self.assertEqual("REJECT", result["verifiedClass"])
        self.assertIn("C_PRIVATE_INPUT", result["codes"])

    def test_failed_c_ablation_is_fake_c(self) -> None:
        sidecar = self._sidecar("C")
        for check in sidecar["proofChecks"]:
            if check["check"] == "ablationPassed":
                check["status"] = "FAIL"
        result = reduce_variant_class(sidecar, evidence_catalog=self._catalog(sidecar))
        self.assertEqual("FAKE_C", result["verifiedClass"])

    def test_core_delta_is_advanced_even_when_declared_b(self) -> None:
        sidecar = self._sidecar("B")
        sidecar["coreDecisionDelta"] = 1
        result = reduce_variant_class(sidecar, evidence_catalog=self._catalog(sidecar))
        self.assertEqual("ADVANCED", result["verifiedClass"])

    def test_mixed_is_never_auto_verified(self) -> None:
        sidecar = self._sidecar("A")
        sidecar["structureFamily"] = "MIXED"
        result = reduce_variant_class(sidecar, evidence_catalog=self._catalog(sidecar))
        self.assertEqual("HOLD", result["verifiedClass"])

    def test_pending_capability_cannot_be_verified_by_proof_alone(self) -> None:
        sidecar = self._sidecar("A")
        sidecar["capabilityStatus"] = "HOLD"
        result = reduce_variant_class(sidecar, evidence_catalog=self._catalog(sidecar))
        self.assertEqual("HOLD", result["verifiedClass"])
        self.assertIn("CAPABILITY_NOT_SUPPORTED", result["codes"])

    def test_variant_plan_and_a_parameter_transform_are_bounded(self) -> None:
        registry = self._supported_registry()
        ir = self._ir()
        plan = build_variant_plan(ir, declared_class="A", transform="numeric", registry=registry)
        self.assertEqual("READY", plan["status"])
        transformed = apply_a_parameter_variant(ir, parameter_bindings={"a": 2}, registry=registry)
        self.assertEqual("CANDIDATE_READY_FOR_SOLVER", transformed["status"])
        self.assertIn("2x+1", transformed["candidateIR"]["studentPayload"]["content"])
        self.assertEqual(1, transformed["evidence"]["effectiveParameterChangeCount"])
        with self.assertRaises(UniversalVariantEngineError):
            apply_a_parameter_variant(ir, parameter_bindings={"b": 2}, registry=registry)

    def test_existing_b_adapter_and_c_preprocess_preserve_core_contract(self) -> None:
        registry = self._supported_registry()
        ir = self._ir()
        b = adapt_b_candidate(
            ir,
            candidate_payload={**ir["studentPayload"], "content": "서로 다른 표현으로 방정식을 푼다."},
            candidate_solution_graph=ir["solutionGraph"],
            registry=registry,
        )
        self.assertEqual("CANDIDATE_READY_FOR_PROOF", b["status"])
        self.assertTrue(b["evidence"]["coreGraphPreserved"])
        c = build_c_variant(
            ir,
            preprocess_node={
                "nodeId": "p0",
                "role": "preprocess",
                "op": "recover_parameter",
                "deterministic": True,
                "branchCount": 0,
                "newConcept": False,
                "required": True,
                "outputArity": 1,
                "studentObservableInputsOnly": True,
            },
            transform="PARAMETER_RECOVERY",
            registry=registry,
        )
        self.assertEqual(1, c["candidateIR"]["preprocessingStepCount"])
        stripped = strip_preprocess_graph(c["candidateIR"]["solutionGraph"])
        self.assertEqual(ir["solutionGraph"]["graphFingerprint"], stripped["graphFingerprint"])

    def test_ledger_and_capability_promotion_are_closed_per_family_transform(self) -> None:
        sidecar = self._sidecar("A")
        result = reduce_variant_class(sidecar, evidence_catalog=self._catalog(sidecar))
        ledger = build_variant_proof_ledger([{"id": 1, "result": result}])
        self.assertEqual("PASS", ledger["variantProofLedgerComplete"])
        promotion = evaluate_capability_promotion(
            [
                {"familyId": "LINEAR_EQUATION", "transform": "numeric", "polarity": "positive", "status": "PASS"},
                {"familyId": "LINEAR_EQUATION", "transform": "numeric", "polarity": "negative", "status": "PASS"},
                {"familyId": "LINEAR_EQUATION", "transform": "representation", "polarity": "positive", "status": "PASS"},
            ]
        )
        by_key = {item["familyTransform"]: item for item in promotion["capabilities"]}
        self.assertEqual("ACTIVE", by_key["LINEAR_EQUATION×numeric"]["status"])
        self.assertEqual("HOLD", by_key["LINEAR_EQUATION×representation"]["status"])


if __name__ == "__main__":
    unittest.main()
