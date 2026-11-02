"""Targeted tests for tools/main_merge_master.py inbox-request generation (issue #1183 item 4).

Run: python3 -m unittest tests.test_main_merge_master   (or python3 tests/test_main_merge_master.py)
"""
import importlib.util
import io
import json
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("main_merge_master", ROOT / "tools" / "main_merge_master.py")
mm = importlib.util.module_from_spec(spec)
original_stdout = sys.stdout
spec.loader.exec_module(mm)
sys.stdout = original_stdout

SOURCE = "similar/high/h2/2final/x_유사.js"
JS = """window.questionBank = [
  {"standardCourse":"수학II","standardUnitKey":"U1","problemTypeKey":"PT_A","crossConceptKeys":%s,"conditionKeys":[]},
  {"standardCourse":"수학II","standardUnitKey":"U1","problemTypeKey":"PT_A","crossConceptKeys":["CC_A"],"conditionKeys":[]}
];
"""


def build_tree(root: Path, cross_keys='["CC_A"]', meta_rows=2, identity_rows=2, register_changes=None, extension_defs=None):
    exam_dir = root / "archive" / "exams" / "similar" / "high" / "h2" / "2final"
    exam_dir.mkdir(parents=True)
    js = exam_dir / "x_유사.js"
    js.write_text(JS % cross_keys, encoding="utf-8")
    receipt = exam_dir / "x_유사.review-receipt.json"
    receipt.write_text("{}", encoding="utf-8")
    meta = exam_dir / "x_유사.meta-q01-q02.json"
    meta.write_text(json.dumps({
        "registryChanges": register_changes or [],
        "items": [{"after": {"standardCourse": "수학II", "courseKey": "수학II", "L3": "n/a"}, "reason": "r1"},
                  {"after": {"standardCourse": "수학II"}, "reason": "r2"}],
    }), encoding="utf-8")
    data = root / "archive" / "data"
    data.mkdir(parents=True)
    rows = [{"questionUid": f"qid_v1_{i}", "sourceArchiveFile": SOURCE, "sourceOrdinal": i,
             "standardCourse": "수학II", "standardUnitKey": "U-PLACEHOLDER", "problemTypeKey": None}
            for i in range(1, meta_rows + 1)]
    (data / "question_metadata.json").write_text(json.dumps({"records": rows}), encoding="utf-8")
    ids = [{"questionUid": f"qid_v1_{i}", "sourceArchiveFile": SOURCE, "sourceOrdinal": i} for i in range(1, identity_rows + 1)]
    (data / "question_identity_map.json").write_text(json.dumps({"records": ids}), encoding="utf-8")
    canon = data / "meta-foundation" / "canonical"
    (canon / "concepts").mkdir(parents=True)
    (canon / "concepts" / "algebra.json").write_text(json.dumps({"concepts": [
        {"conceptKey": "CC_A", "status": "ACTIVE"}, {"conceptKey": "CC_OLD", "status": "RETIRED"}]}), encoding="utf-8")
    (canon / "condition_registry.json").write_text(json.dumps({"conditions": []}), encoding="utf-8")
    if extension_defs is not None:
        (data / "archive2-extension-keys.json").write_text(json.dumps(
            {"schemaVersion": "archive2-extension-keys-v1", "definitions": extension_defs}), encoding="utf-8")
    return {"stem": "x_유사", "js": js, "receipt": receipt, "meta": meta, "plans": None, "assets": None}


class GenerateInboxRequestTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.addCleanup(self.tmp.cleanup)
        patcher = mock.patch.multiple(mm, REPO_ROOT=self.root, CANON_DIR=self.root / "archive/data/meta-foundation/canonical",
                                      EXTENSION_INDEX=self.root / "archive/data/archive2-extension-keys.json")
        patcher.start()
        self.addCleanup(patcher.stop)

    def generate(self, **kwargs):
        files = build_tree(self.root, **kwargs)
        with redirect_stdout(io.StringIO()):
            return mm.generate_inbox_request(files)

    def test_before_comes_from_current_rows_and_uids_are_registered_ones(self):
        req = self.generate()
        self.assertEqual([i["questionUid"] for i in req["items"]], ["qid_v1_1", "qid_v1_2"])
        self.assertEqual(req["items"][0]["before"]["standardUnitKey"], "U-PLACEHOLDER")
        self.assertIsNone(req["items"][0]["before"]["problemTypeKey"])
        self.assertEqual(req["items"][0]["after"]["standardUnitKey"], "U1")

    def test_missing_metadata_rows_refuse_instead_of_emitting_stale_request(self):
        # Root cause of `UID denominator mismatch`: rows do not exist yet when the request is built.
        with self.assertRaisesRegex(mm.RequestGenerationError, "UID denominator mismatch"):
            self.generate(meta_rows=0, identity_rows=0)

    def test_missing_identity_rows_refuse(self):
        with self.assertRaisesRegex(mm.RequestGenerationError, "identity_map records=1"):
            self.generate(identity_rows=1)

    def test_unregistered_extension_key_is_refused_not_rewritten(self):
        with self.assertRaisesRegex(mm.RequestGenerationError, "EXT-CROSS-NEW"):
            self.generate(cross_keys='["EXT-CROSS-NEW"]')

    def _refused_extension(self, **definition):
        with self.assertRaisesRegex(mm.RequestGenerationError, "EXT-CROSS-NEW"):
            self.generate(cross_keys='["EXT-CROSS-NEW"]', extension_defs=[
                {"key": "EXT-CROSS-NEW", "kind": "cross", "status": "GENERATED_ACTIVE", "canonicalPromoted": False, **definition}])

    def test_extension_key_that_is_not_generated_active_is_refused(self):
        self._refused_extension(status="GENERATED_CANDIDATE_BRANCH_ONLY")

    def test_extension_key_claiming_canonical_promotion_is_refused(self):
        self._refused_extension(canonicalPromoted=True)

    def test_extension_key_of_the_wrong_kind_is_refused(self):
        self._refused_extension(kind="cond")

    def test_registered_generated_active_extension_key_is_carried_unchanged(self):
        req = self.generate(cross_keys='["EXT-CROSS-NEW"]', extension_defs=[
            {"key": "EXT-CROSS-NEW", "kind": "cross", "status": "GENERATED_ACTIVE", "canonicalPromoted": False}])
        self.assertEqual(req["items"][0]["after"]["crossConceptKeys"], ["EXT-CROSS-NEW"])
        self.assertEqual(req["registryChanges"], [], "an extension is never turned into a canonical registry change")

    def test_retired_canonical_key_is_refused(self):
        with self.assertRaisesRegex(mm.RequestGenerationError, "CC_OLD"):
            self.generate(cross_keys='["CC_OLD"]')

    def test_extension_sidecar_registry_changes_are_not_forwarded(self):
        # `unsafe path: undefined` root cause: {registryPath, registrySha256, ...} has no `path`.
        sidecar = [{"registryPath": "archive/data/meta-foundation/extensions/x.registry.json", "registrySha256": "0" * 64, "keys": []},
                   {"key": "EXT-COND-1", "status": "GENERATED_ACTIVE"}]
        req = self.generate(register_changes=sidecar)
        self.assertEqual(req["registryChanges"], [])

    def test_registrar_schema_registry_change_is_forwarded_with_evidence(self):
        native = {"path": "archive/data/meta-foundation/canonical/concepts/algebra.json", "collection": "concepts",
                  "match": {"conceptKey": "CC_NEW"}, "before": None, "after": {"conceptKey": "CC_NEW"}}
        req = self.generate(register_changes=[native, {"registryPath": "x"}])
        self.assertEqual(len(req["registryChanges"]), 1)
        self.assertEqual(req["registryChanges"][0]["path"], native["path"])
        self.assertIn("evidenceRefs", req["registryChanges"][0])


class ParentAssignmentTests(unittest.TestCase):
    """The registrar fills L1/L2 from standard-unit labels unless the request carries an evidence-bound parent
    reference; `parentAssignment` in the small meta is turned into `targetParentRef` (+ evidence)."""
    MASTER = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json"
    CROSS = "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math2-calculus1.json"

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.addCleanup(self.tmp.cleanup)
        patcher = mock.patch.multiple(mm, REPO_ROOT=self.root, CANON_DIR=self.root / "archive/data/meta-foundation/canonical")
        patcher.start()
        self.addCleanup(patcher.stop)

    def generate(self, assignment, cross_record_parent=("미분", "도함수의 활용(2)")):
        files = build_tree(self.root)
        master = self.root / self.MASTER
        master.parent.mkdir(parents=True)
        master.write_text(json.dumps({"records": [
            {"curriculum": "2015", "scope": "수학II", "majorUnit": "미분", "midUnit": "도함수의 활용(2)"},
            {"curriculum": "2015", "scope": "수학II", "majorUnit": "적분", "midUnit": "정적분"}]}), encoding="utf-8")
        cross = self.root / self.CROSS
        cross.parent.mkdir(parents=True)
        cross.write_text(json.dumps({"records": [{"id": "H2-M2-RPM-023", "rpmPath": {
            "majorUnit": cross_record_parent[0], "midUnit": cross_record_parent[1]}}]}), encoding="utf-8")
        meta = json.loads(files["meta"].read_text(encoding="utf-8"))
        meta["items"][0]["parentAssignment"] = assignment
        meta["items"][0]["after"].update({"L1": "도함수의 활용", "L2": "도함수의 활용"})
        files["meta"].write_text(json.dumps(meta), encoding="utf-8")
        with redirect_stdout(io.StringIO()):
            return mm.generate_inbox_request(files)

    def assignment(self, **kwargs):
        base = {"L1": "미분", "L2": "도함수의 활용(2)", "curriculum": "2015", "scope": "수학II",
                "parentRefMode": "CROSSWALK_EXACT", "crosswalkRecordId": "H2-M2-RPM-023"}
        base.update(kwargs)
        return base

    def test_assignment_sets_l1_l2_and_a_sha_bound_parent_reference(self):
        req = self.generate(self.assignment())
        item = req["items"][0]
        self.assertEqual((item["after"]["L1"], item["after"]["L2"]), ("미분", "도함수의 활용(2)"))
        ref = item["targetParentRef"]
        self.assertEqual((ref["path"], ref["scope"], ref["majorUnit"], ref["midUnit"]), (self.MASTER, "수학II", "미분", "도함수의 활용(2)"))
        self.assertEqual(ref["crosswalkRef"]["recordId"], "H2-M2-RPM-023")
        evidence = {e["path"]: e["sha256"] for e in item["evidenceRefs"]}
        self.assertEqual(evidence[self.MASTER], mm.sha256_file(self.root / self.MASTER))
        self.assertEqual(evidence[self.CROSS], ref["crosswalkRef"]["sha256"])
        self.assertNotIn("targetParentRef", req["items"][1])

    def test_unit_label_mode_has_no_crosswalk_reference(self):
        req = self.generate(self.assignment(L1="적분", L2="정적분", parentRefMode="UNIT_LABEL", crosswalkRecordId=None))
        self.assertNotIn("crosswalkRef", req["items"][0]["targetParentRef"])
        self.assertEqual(req["items"][0]["after"]["L2"], "정적분")

    def test_parent_missing_from_canonical_master_is_refused(self):
        with self.assertRaisesRegex(mm.RequestGenerationError, "not exactly one canonical RPM master parent"):
            self.generate(self.assignment(L2="도함수 그 자체", parentRefMode="UNIT_LABEL", crosswalkRecordId=None))

    def test_crosswalk_record_pointing_elsewhere_is_refused(self):
        with self.assertRaisesRegex(mm.RequestGenerationError, "points at"):
            self.generate(self.assignment(), cross_record_parent=("적분", "정적분"))


class SplitRegistryChangesTests(unittest.TestCase):
    def test_requires_path_before_after(self):
        native, sidecar = mm.split_registry_changes([
            {"path": "p", "before": None, "after": {}},
            {"path": "p", "after": {}},
            {"registryPath": "p"},
        ])
        self.assertEqual(len(native), 1)
        self.assertEqual(len(sidecar), 2)


class ValidateCandidateTests(unittest.TestCase):
    def test_default_still_runs_the_harness(self):
        with mock.patch.object(mm.subprocess, "run") as run:
            run.return_value = mock.Mock(returncode=1, stderr="harness failed", stdout="")
            ok, errors = mm.validate_candidate({"stem": "x"})
        self.assertFalse(ok)
        self.assertEqual(errors, ["harness failed"])
        self.assertTrue(run.called)

    def test_skip_harness_is_explicit_and_reported_as_not_run(self):
        buf = io.StringIO()
        with mock.patch.object(mm.subprocess, "run") as run, redirect_stdout(buf):
            ok, errors = mm.validate_candidate({"stem": "x"}, skip_harness=True)
        self.assertTrue(ok)
        self.assertEqual(errors, [])
        run.assert_not_called()
        self.assertIn("NOT_RUN", buf.getvalue())


if __name__ == "__main__":
    unittest.main()
