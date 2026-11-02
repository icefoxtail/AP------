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

    def generate(self, assignment, cross_record_parent=("미분", "도함수의 활용(2)"), cross_records=None):
        files = build_tree(self.root)
        master = self.root / self.MASTER
        master.parent.mkdir(parents=True)
        master.write_text(json.dumps({"records": [
            {"curriculum": "2015", "scope": "수학II", "majorUnit": "미분", "midUnit": "도함수의 활용(2)"},
            {"curriculum": "2015", "scope": "수학II", "majorUnit": "적분", "midUnit": "정적분"}]}), encoding="utf-8")
        cross = self.root / self.CROSS
        cross.parent.mkdir(parents=True)
        records = cross_records if cross_records is not None else [self.cross_row("H2-M2-RPM-023", cross_record_parent)]
        cross.write_text(json.dumps({"status": "ACTIVE_REFERENCE", "records": records}), encoding="utf-8")
        meta = json.loads(files["meta"].read_text(encoding="utf-8"))
        meta["items"][0]["parentAssignment"] = assignment
        meta["items"][0]["after"].update({"L1": "도함수의 활용", "L2": "도함수의 활용"})
        files["meta"].write_text(json.dumps(meta), encoding="utf-8")
        with redirect_stdout(io.StringIO()):
            return mm.generate_inbox_request(files)

    @staticmethod
    def cross_row(record_id, parent=("미분", "도함수의 활용(2)"), **kwargs):
        row = {"id": record_id, "curriculum": "2015", "scope": "수학II", "bindingStatus": "ACTIVE",
               "problemTypeKey": "PT_A", "templateKey": None,
               "rpmPath": {"majorUnit": parent[0], "midUnit": parent[1]}}
        row.update(kwargs)
        return row

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

    def test_recorded_row_with_other_pt_tpl_is_not_used_as_crosswalk_ref(self):
        # The registrar refuses a crosswalkRef whose PT/TPL differs from the question's; carry the master parent only.
        req = self.generate(self.assignment(), cross_records=[self.cross_row("H2-M2-RPM-023", problemTypeKey="PT_OTHER")])
        ref = req["items"][0]["targetParentRef"]
        self.assertNotIn("crosswalkRef", ref)
        self.assertEqual((ref["majorUnit"], ref["midUnit"]), ("미분", "도함수의 활용(2)"))
        self.assertEqual(req["items"][0]["after"]["L2"], "도함수의 활용(2)")
        self.assertEqual([e["path"] for e in req["items"][0]["evidenceRefs"] if "crosswalks" in e["path"]], [])

    def test_recorded_row_with_missing_binding_is_not_used_as_crosswalk_ref(self):
        req = self.generate(self.assignment(), cross_records=[self.cross_row("H2-M2-RPM-023", bindingStatus="MISSING")])
        self.assertNotIn("crosswalkRef", req["items"][0]["targetParentRef"])

    def test_exact_active_row_for_same_parent_replaces_a_non_matching_recorded_row(self):
        req = self.generate(self.assignment(), cross_records=[
            self.cross_row("H2-M2-RPM-023", problemTypeKey="PT_OTHER"),
            self.cross_row("H2-M2-RPM-099"),
            self.cross_row("H2-M2-RPM-098", curriculum="2022"),
            self.cross_row("H2-M2-RPM-097", ("적분", "정적분"))])
        self.assertEqual(req["items"][0]["targetParentRef"]["crosswalkRef"]["recordId"], "H2-M2-RPM-099")


class RpmPrimaryPathTests(unittest.TestCase):
    """The registrar only reads `rpmPrimaryPath`; small metas that name the crosswalk record as `rpmPrimary {recordId}` /
    `rpmPrimaryRecordId` lost their RPM path in registration (search card: "RPM L1~L4 미지정"). The path is taken from the
    official crosswalk only; a question whose record cannot be decided keeps none (EVIDENCE_DEBT)."""
    CROSS = "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math2-calculus1.json"

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.addCleanup(self.tmp.cleanup)
        patcher = mock.patch.multiple(mm, REPO_ROOT=self.root, CANON_DIR=self.root / "archive/data/meta-foundation/canonical")
        patcher.start()
        self.addCleanup(patcher.stop)

    @staticmethod
    def row(record_id, l3, l4, **kwargs):
        row = {"id": record_id, "curriculum": "2015", "scope": "수학II", "bindingStatus": "ACTIVE",
               "problemTypeKey": "PT_A", "templateKey": "TPL_A",
               "rpmPath": {"majorUnit": "미분", "midUnit": "도함수의 활용(2)", "l3": l3, "l4": l4}}
        row.update(kwargs)
        return row

    def build(self, rows, hint, registered_path=None, second_pt="PT_A"):
        files = build_tree(self.root)
        cross = self.root / self.CROSS
        cross.parent.mkdir(parents=True)
        cross.write_text(json.dumps({"status": "ACTIVE_REFERENCE", "records": rows}), encoding="utf-8")
        meta = json.loads(files["meta"].read_text(encoding="utf-8"))
        meta["items"][0]["after"].update(hint)
        files["meta"].write_text(json.dumps(meta), encoding="utf-8")
        metadata = self.root / "archive/data/question_metadata.json"
        doc = json.loads(metadata.read_text(encoding="utf-8"))
        for record in doc["records"]:
            record.update({"curriculum": "2015", "courseKey": "수학II", "problemTypeKey": "PT_A", "templateKey": "TPL_A",
                           "L1": "미분", "L2": "도함수의 활용(2)"})
        doc["records"][1]["problemTypeKey"] = second_pt
        if registered_path:
            doc["records"][0]["rpmPrimaryPath"] = registered_path
        metadata.write_text(json.dumps(doc), encoding="utf-8")
        return files

    def delta(self, *args, **kwargs):
        files = self.build(*args, **kwargs)
        with redirect_stdout(io.StringIO()):
            return mm.generate_inbox_request(files, rpm_path_delta=True)

    def resolve_in(self, rows, course, curriculum="2015"):
        cross = self.root / "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json"
        cross.parent.mkdir(parents=True, exist_ok=True)
        cross.write_text(json.dumps({"status": "ACTIVE_REFERENCE", "records": rows}), encoding="utf-8")
        notes = []
        path, _ = mm.resolve_rpm_primary_path({}, {"problemTypeKey": "PT_A", "templateKey": "TPL_A"}, curriculum, course, notes, "#1")
        return path, notes

    def test_row_scope_alias_and_standard_course_name_the_same_course(self):
        # 2015 high-1 rows: scope `수학_하`, standardCourse `수학(하)`; the small meta's courseKey is `수학(하)`.
        row = self.row("H1-A", "가", "나", scope="수학_하", standardCourse="수학(하)")
        for course in ("수학(하)", "수학_하", "수학 (하)"):
            path, notes = self.resolve_in([row], course)
            self.assertIsNotNone(path, course)
            self.assertEqual(path["crosswalkRecordIds"], ["H1-A"])
            self.assertEqual(notes, [])

    def test_other_course_is_not_a_candidate_through_either_spelling(self):
        rows = [self.row("H1-A", "가", "나", scope="수학_하", standardCourse="수학(하)"),
                self.row("H1-B", "다", "라", scope="수학_상", standardCourse="수학(상)")]
        path, notes = self.resolve_in(rows[:1], "수학(상)")
        self.assertIsNone(path)
        self.assertTrue(any("EVIDENCE_DEBT" in n for n in notes))
        path, _ = self.resolve_in(rows, "수학(상)")
        self.assertEqual(path["crosswalkRecordIds"], ["H1-B"])
        path, notes = self.resolve_in(rows, "")
        self.assertIsNone(path)

    def test_course_alias_does_not_relax_curriculum_or_binding(self):
        rows = [self.row("H1-A", "가", "나", scope="수학_하", standardCourse="수학(하)", curriculum="2022"),
                self.row("H1-B", "다", "라", scope="수학_하", standardCourse="수학(하)", bindingStatus="MISSING")]
        path, _ = self.resolve_in(rows, "수학(하)")
        self.assertIsNone(path)

    def test_named_record_among_the_exact_candidates_decides_the_path(self):
        req = self.delta([self.row("R1", "가", "나"), self.row("R2", "다", "라")],
                         {"rpmPrimary": {"l1": "미분", "l2": "도함수의 활용(2)", "l3": "다", "l4": "라", "recordId": "R2"}})
        item = req["items"][0]
        self.assertEqual(item["before"], {"rpmPrimaryPath": None})
        self.assertEqual(item["after"], {"rpmPrimaryPath": {
            "L1": "미분", "L2": "도함수의 활용(2)", "L3": "다", "L4": "라",
            "parentChain": ["미분", "도함수의 활용(2)", "다", "라"], "crosswalkRecordIds": ["R2"]}})
        evidence = {e["path"]: e["sha256"] for e in item["evidenceRefs"]}
        self.assertEqual(evidence[self.CROSS], mm.sha256_file(self.root / self.CROSS))

    def test_delta_changes_no_other_value_and_is_a_separate_request(self):
        req = self.delta([self.row("R1", "가", "나")], {}, second_pt="PT_NO_CROSSWALK_ROW")
        self.assertTrue(req["requestId"].startswith("req-rpmpath-"))
        self.assertEqual(req["registryChanges"], [])
        self.assertEqual(list(req["items"][0]["after"]), ["rpmPrimaryPath"])
        # A row without a decidable record is carried with an empty patch (the registrar needs every question).
        self.assertEqual(req["items"][1]["before"], {})
        self.assertEqual(req["items"][1]["after"], {})
        self.assertIn("EVIDENCE_DEBT", req["items"][1]["reason"])

    def test_request_tag_makes_a_second_delta_a_new_request_and_binds_extra_evidence(self):
        files = self.build([self.row("R1", "가", "나")], {})
        decision = self.root / "decision.review.json"
        decision.write_text("{}", encoding="utf-8")
        ref = {"path": "decision.review.json", "sha256": mm.sha256_file(decision)}
        with redirect_stdout(io.StringIO()):
            first = mm.generate_inbox_request(files, rpm_path_delta=True)
            second = mm.generate_inbox_request(files, rpm_path_delta=True, request_tag="r2", extra_evidence=[ref])
        self.assertNotEqual(first["requestId"], second["requestId"])
        self.assertTrue(second["requestId"].startswith("req-rpmpath-"))
        self.assertIn(ref, second["approval"]["evidenceRefs"])
        self.assertIn(ref, second["items"][0]["evidenceRefs"])
        self.assertNotIn(ref, first["approval"]["evidenceRefs"])

    def test_single_exact_candidate_decides_without_a_named_record(self):
        req = self.delta([self.row("R1", "가", "나"), self.row("R9", "다", "라", problemTypeKey="PT_OTHER")], {})
        self.assertEqual(req["items"][0]["after"]["rpmPrimaryPath"]["crosswalkRecordIds"], ["R1"])

    def test_several_paths_without_a_named_record_is_evidence_debt_not_a_guess(self):
        with self.assertRaisesRegex(mm.RequestGenerationError, "no question gained an RPM Primary path"):
            self.delta([self.row("R1", "가", "나"), self.row("R2", "다", "라")], {})

    def test_named_record_that_is_not_an_exact_pt_tpl_row_is_not_used(self):
        # Question 1 names R2, whose TPL differs: it keeps no path although R1 would fit (nothing is substituted);
        # question 2 names nothing and has exactly one candidate path.
        req = self.delta([self.row("R1", "가", "나"), self.row("R2", "다", "라", templateKey="TPL_OTHER")],
                         {"rpmPrimaryRecordId": "R2"})
        self.assertEqual(req["items"][0]["after"], {})
        self.assertEqual(req["items"][1]["after"]["rpmPrimaryPath"]["crosswalkRecordIds"], ["R1"])

    def test_declared_labels_that_disagree_with_the_record_are_not_used(self):
        with self.assertRaisesRegex(mm.RequestGenerationError, "no question gained"):
            self.delta([self.row("R1", "가", "나"), self.row("R2", "다", "라")],
                       {"rpmPrimaryRecordId": "R2", "rpmPrimaryL1": "미분", "rpmPrimaryL2": "도함수의 활용(2)",
                        "rpmPrimaryL3": "가", "rpmPrimaryL4": "나"})

    def test_other_curriculum_or_inactive_rows_are_not_candidates(self):
        with self.assertRaisesRegex(mm.RequestGenerationError, "no question gained"):
            self.delta([self.row("R1", "가", "나", curriculum="2022"), self.row("R2", "다", "라", bindingStatus="MISSING")], {})

    def test_already_registered_path_is_left_alone(self):
        registered = {"L1": "미분", "L2": "도함수의 활용(2)", "L3": "가", "L4": "나"}
        req = self.delta([self.row("R1", "가", "나")], {}, registered_path=registered)
        self.assertEqual(req["items"][0]["after"], {})
        self.assertEqual(req["items"][1]["after"], {"rpmPrimaryPath": {
            "L1": "미분", "L2": "도함수의 활용(2)", "L3": "가", "L4": "나",
            "parentChain": ["미분", "도함수의 활용(2)", "가", "나"], "crosswalkRecordIds": ["R1"]}})

    def test_full_request_does_not_overwrite_an_already_registered_path(self):
        registered = {"L1": "미분", "L2": "도함수의 활용(2)", "L3": "기존", "L4": "경로"}
        files = self.build([self.row("R1", "가", "나")], {"rpmPrimaryRecordIds": ["R1"], "templateKey": "TPL_A",
                                                          "curriculum": "2015", "courseKey": "수학II"}, registered_path=registered)
        with redirect_stdout(io.StringIO()):
            req = mm.generate_inbox_request(files)
        self.assertNotIn("rpmPrimaryPath", req["items"][0]["after"])

    def test_full_request_also_carries_the_path_from_the_small_meta_record(self):
        files = self.build([self.row("R1", "가", "나")], {"rpmPrimaryRecordIds": ["R1"], "templateKey": "TPL_A",
                                                          "curriculum": "2015", "courseKey": "수학II"})
        with redirect_stdout(io.StringIO()):
            req = mm.generate_inbox_request(files)
        self.assertEqual(req["requestId"], "req-similar-" + req["requestId"].split("-")[-1])
        self.assertEqual(req["items"][0]["after"]["rpmPrimaryPath"]["L4"], "나")


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
