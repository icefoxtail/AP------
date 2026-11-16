"""Request-only add-only binding proposals. No operational registry writes."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('binding_builder', ROOT / 'tools/main_merge_master.py')
mm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mm)


class TypeBindingChangesTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.canon = self.root / 'archive/data/meta-foundation/canonical'
        patcher = mock.patch.multiple(mm, REPO_ROOT=self.root, CANON_DIR=self.canon)
        patcher.start()
        self.addCleanup(patcher.stop)
        self.base = 'archive/data/meta-foundation/canonical/packs/test'
        self.put('archive/data/meta-foundation/canonical/registry_index.json', {'activePacks': [{'id': 'TEST', 'status': 'ACTIVE'}]})
        self.put(self.base + '/pack.json', {'packId': 'TEST', 'canonicalStatus': 'ACTIVE', 'curricula': ['2015'], 'standardCourses': ['Math']})
        self.taxonomy = {'problemTypes': [{'problemTypeKey': 'PT_A', 'status': 'ACTIVE'}, {'problemTypeKey': 'PT_PEER', 'status': 'ACTIVE'}],
                         'templates': [{'templateKey': 'TPL_A', 'status': 'ACTIVE', 'parentProblemTypeKey': 'PT_A'}]}
        self.put(self.base + '/taxonomy.json', self.taxonomy)
        self.peer = {'curriculum': '2015', 'standardCourse': 'Math', 'standardUnitKey': 'U', 'subUnitKey': 'S',
                     'problemTypeKey': 'PT_PEER', 'status': 'ACTIVE', 'L1': 'Numbers', 'L2': 'Roots', 'ownerPack': 'TEST'}
        self.bindings = {'bindings': [self.peer]}
        self.put(self.base + '/bindings.json', self.bindings)
        self.put('archive/data/master_tables/js_archive_tag_master.json', [
            {'key': 'U', 'keyType': 'standardUnitKey', 'status': 'ACTIVE', 'labelKo': 'Numbers'},
            {'key': 'S', 'keyType': 'subUnitKey', 'status': 'ACTIVE', 'parentKey': 'U', 'labelKo': 'Roots'}])
        self.row = {'questionUid': 'uid1', 'sourceOrdinal': 1, 'sourceArchiveFile': 'original/test.js', 'curriculum': '2015',
                    'standardCourse': 'Math', 'standardUnitKey': 'U', 'subUnitKey': 'S'}
        self.after = {'problemTypeKey': 'PT_A', 'templateKey': 'TPL_A', 'decisiveStep': 'Take the positive root.'}
        self.request = {'sourceArchiveFile': 'original/test.js', 'registryChanges': [], 'items': [
            {'questionUid': 'uid1', 'sourceOrdinal': 1, 'after': self.after}]}
        self.judgments = [{'questionUid': 'uid1', 'sourceOrdinal': 1, **self.after, 'sourceExcerpt': 'positive root'}]
        self.bank = [{'content': 'Find the positive root.', 'solution': 'Take the root.'}]
        self.ids = [{'questionUid': 'uid1', 'sourceOrdinal': 1, 'sourceArchiveFile': 'original/test.js'}]

    def put(self, path, value):
        full = self.root / path
        full.parent.mkdir(parents=True, exist_ok=True)
        full.write_text(json.dumps(value), encoding='utf-8')

    def plan(self):
        self.put('ledger.json', {'typeBindingJudgments': self.judgments})
        ref = {'path': 'ledger.json', 'sha256': mm.sha256_file(self.root / 'ledger.json')}
        return mm.plan_type_binding_changes(self.request, self.judgments, self.bank, [self.row], self.ids, ref)

    def test_add_only_evidence_bound_proposal_without_input_or_file_mutation(self):
        before = copy.deepcopy((self.request, self.row, self.ids, self.bank))
        changes = self.plan()
        self.assertEqual(len(changes), 1)
        change = changes[0]
        self.assertIsNone(change['before'])
        self.assertEqual(change['collection'], 'bindings')
        self.assertEqual(change['after']['supportingQuestionUids'], ['uid1'])
        self.assertEqual(change['after']['supportingJudgments'], self.judgments)
        self.assertEqual(change['evidenceRefs'][0]['sha256'], mm.sha256_file(self.root / 'ledger.json'))
        self.assertEqual(json.loads((self.root / (self.base + '/bindings.json')).read_text()), self.bindings)
        self.assertEqual((self.request, self.row, self.ids, self.bank), before)

    def test_current_generator_adds_the_evidence_bound_change(self):
        from contextlib import redirect_stdout
        import io
        self.put('archive/data/question_metadata.json', {'records': [self.row]})
        self.put('archive/data/question_identity_map.json', {'records': self.ids})
        self.put('archive/data/meta-foundation/canonical/condition_registry.json', {'conditions': []})
        source = self.root / 'archive/exams/original/test.js'
        source.parent.mkdir(parents=True)
        question = {**self.bank[0], 'standardCourse': 'Math', 'standardUnitKey': 'U', 'subUnitKey': 'S',
                    'problemTypeKey': 'PT_A', 'templateKey': 'TPL_A', 'crossConceptKeys': [], 'conditionKeys': []}
        source.write_text('window.questionBank = ' + json.dumps([question]) + ';', encoding='utf-8')
        self.put('docs/approval.json', {'reviewed': True})
        small = {'typeBindingJudgments': self.judgments, 'items': [{'after': {**self.after, 'curriculum': '2015'}, 'reason': 'reviewed'}]}
        self.put('docs/small-meta.json', small)
        files = {'stem': 'test', 'js': source, 'receipt': self.root / 'docs/approval.json', 'meta': self.root / 'docs/small-meta.json'}
        with redirect_stdout(io.StringIO()):
            request = mm.generate_inbox_request(files)
        self.assertEqual(len(request['registryChanges']), 1)
        self.assertEqual(request['registryChanges'][0]['after']['supportingJudgments'], self.judgments)
        self.assertEqual(request['registryChanges'][0]['evidenceRefs'][0]['path'], 'docs/small-meta.json')
        del small['typeBindingJudgments']
        self.put('docs/small-meta.json', small)
        with redirect_stdout(io.StringIO()):
            legacy = mm.generate_inbox_request(files)
        self.assertEqual(legacy['registryChanges'], [])

    def test_two_supported_uids_share_one_add_only_binding(self):
        self.request['items'].append({'questionUid': 'uid2', 'sourceOrdinal': 2, 'after': copy.deepcopy(self.after)})
        self.judgments.append({**self.judgments[0], 'questionUid': 'uid2', 'sourceOrdinal': 2})
        self.put('ledger.json', {'typeBindingJudgments': self.judgments})
        changes = mm.plan_type_binding_changes(self.request, self.judgments, self.bank * 2,
            [self.row, {**self.row, 'questionUid': 'uid2', 'sourceOrdinal': 2}],
            [*self.ids, {**self.ids[0], 'questionUid': 'uid2', 'sourceOrdinal': 2}],
            {'path': 'ledger.json', 'sha256': mm.sha256_file(self.root / 'ledger.json')})
        self.assertEqual(len(changes), 1)
        self.assertEqual(changes[0]['after']['supportingQuestionUids'], ['uid1', 'uid2'])
        self.assertEqual(changes[0]['after']['supportingItemCount'], 2)

    def test_existing_active_binding_is_never_rewritten(self):
        self.bindings['bindings'].append({**self.peer, 'problemTypeKey': 'PT_A', 'customEvidence': 'keep'})
        self.put(self.base + '/bindings.json', self.bindings)
        self.assertEqual(self.plan(), [])

    def test_existing_inactive_binding_is_not_promoted(self):
        self.bindings['bindings'].append({**self.peer, 'problemTypeKey': 'PT_A', 'status': 'HOLD'})
        self.put(self.base + '/bindings.json', self.bindings)
        with self.assertRaisesRegex(mm.RequestGenerationError, 'existing binding conflict'):
            self.plan()

    def test_parent_and_active_keys_are_required(self):
        for patch in ({'status': 'RETIRED'}, {'parentProblemTypeKey': 'PT_PEER'}):
            with self.subTest(patch=patch):
                tax = copy.deepcopy(self.taxonomy)
                tax['templates'][0].update(patch)
                self.put(self.base + '/taxonomy.json', tax)
                with self.assertRaises(mm.RequestGenerationError):
                    self.plan()

    def test_uid_ordinal_and_source_excerpt_are_bound(self):
        for patch in ({'questionUid': 'other'}, {'sourceOrdinal': 2}, {'sourceExcerpt': 'not in source'}, {'decisiveStep': 'invented'}):
            with self.subTest(patch=patch):
                old = copy.deepcopy(self.judgments)
                self.judgments[0].update(patch)
                with self.assertRaises(mm.RequestGenerationError):
                    self.plan()
                self.judgments = old
        self.ids[0]['questionUid'] = 'other'
        with self.assertRaisesRegex(mm.RequestGenerationError, 'identity join'):
            self.plan()

    def test_missing_or_ambiguous_scope_parent_is_not_invented(self):
        for rows in ([], [self.peer, {**self.peer, 'L2': 'Another'}], [{**self.peer, 'curriculum': '2022'}]):
            self.put(self.base + '/bindings.json', {'bindings': rows})
            with self.assertRaisesRegex(mm.RequestGenerationError, 'parent/owner missing or ambiguous'):
                self.plan()

    def test_owner_scope_is_not_expanded(self):
        self.put(self.base + '/pack.json', {'packId': 'TEST', 'canonicalStatus': 'ACTIVE', 'curricula': ['2022'], 'standardCourses': ['Math']})
        with self.assertRaisesRegex(mm.RequestGenerationError, 'does not cover'):
            self.plan()

    def test_existing_proposed_binding_has_one_writer(self):
        self.request['registryChanges'] = self.plan()
        with self.assertRaisesRegex(mm.RequestGenerationError, 'explicit registry change'):
            self.plan()

    def test_duplicate_judgment_is_refused(self):
        self.judgments.append(copy.deepcopy(self.judgments[0]))
        with self.assertRaisesRegex(mm.RequestGenerationError, 'duplicate'):
            self.plan()

    def test_ledger_hash_and_content_cannot_be_substituted(self):
        self.put('ledger.json', {'typeBindingJudgments': []})
        for digest in ('a' * 64, mm.sha256_file(self.root / 'ledger.json')):
            with self.assertRaises(mm.RequestGenerationError):
                mm.plan_type_binding_changes(self.request, self.judgments, self.bank, [self.row], self.ids,
                                             {'path': 'ledger.json', 'sha256': digest})


if __name__ == '__main__':
    unittest.main()
