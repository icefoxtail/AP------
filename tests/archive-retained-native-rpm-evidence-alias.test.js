const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');

// These modules share a cyclic static import graph. Load the graph once before
// requesting its other entrypoints, rather than racing dynamic ESM loaders.
const modules = (async () => {
  const parts = [await import('./helpers/m2-current-renderer-fixture.mjs')];
  parts.push(await import('../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs'));
  parts.push(await import('../archive/tools/meta-foundation/reviewed-source-reassessment.mjs'));
  parts.push(await import('../archive/tools/meta-foundation/reviewed-native-retained-fields.mjs'));
  parts.push(await import('../archive/tools/meta-foundation/auto-register-merged-source.mjs'));
  parts.push(await import('../archive/tools/meta-foundation/reviewed-source-binding.mjs'));
  parts.push(await import('../tools/ci/archive-pr-native-preview.mjs'));
  return Object.assign({}, ...parts);
})();
const RPM = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
const HEADER = {
  schemaVersion: 'rpm-primary-active-crosswalk-v1', status: 'ACTIVE_REFERENCE', grade: 'M2',
  rpmAuthority: { version: 'RPM_PRIMARY_TAXONOMY_v1.0', status: 'LOCKED',
    source: 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json' },
  activeAuthority: { source: 'archive/data/meta-foundation/canonical/', packs: ['MIDDLE_GEOMETRY'] },
  policy: { syntheticFixtureOnly: true }, summary: { recordCount: 1 }, generatedAgainstMain: 'synthetic-original',
};

async function fixture(t) {
  const m = await modules, f = m.m2RendererWriterFixture(t, { rpmDocumentHeader: HEADER });
  const original = Buffer.from(execFileSync('git', ['show', f.patch.sourceReview.reviewCommit + ':' + RPM], { cwd: f.root }));
  const originalReview = m.stable(f.patch.sourceReview), originalAfter = m.stable(f.patch.after);
  const current = JSON.parse(original);
  current.records.push({ ...structuredClone(current.records[0]), id: 'M2-RPM-2', fixtureUnrelatedRow: true });
  current.summary.recordCount = 2; current.generatedAgainstMain = 'synthetic-later';
  f.put(RPM, current);
  const copyRef = f.put(`.archive-meta-register/evidence/retained-native-rpm/${f.patch.sourceReview.reviewCommit}/middle2.json`, original);
  f.patch.nativeRpmEvidenceAlias = {
    schemaVersion: m.NATIVE_RPM_EVIDENCE_ALIAS_SCHEMA,
    nativeCommit: f.patch.sourceReview.reviewCommit, nativePath: RPM, nativeSha256: m.sha(original), copyRef,
  };
  for (const owner of [f.request.approval, f.patch])
    owner.evidenceRefs = owner.evidenceRefs.map(ref => ref.path === RPM ? { ...copyRef } : ref);
  const requestPath = '.archive-meta-register/inbox/synthetic-m2-renderer.json';
  f.put('archive/data/meta-foundation/runtime/.gitkeep', '');
  f.put(requestPath, f.request);
  const head = f.commit();
  return Object.assign(f, { m, original, originalReview, originalAfter, copyRef, requestPath, head });
}

function changeCurrent(f, mutate, commit = true) {
  const current = f.read(RPM); mutate(current); f.put(RPM, current); if (commit) f.commit();
}
function bindCopy(f) {
  const marker = f.patch.nativeRpmEvidenceAlias;
  marker.nativeSha256 = f.m.sha(fs.readFileSync(path.join(f.root, marker.copyRef.path)));
  marker.copyRef.sha256 = marker.nativeSha256;
  for (const owner of [f.request.approval, f.patch])
    owner.evidenceRefs = owner.evidenceRefs.map(ref => ref.path === marker.copyRef.path ? { ...marker.copyRef } : ref);
}

test('alias preserves the original native authority and tolerates only unrelated current RPM rows', async t => {
  const f = await fixture(t), proof = f.m.validateReviewedSourceReassessment(f.args);
  const retained = proof.retainedNativeFields, alias = retained.nativeRpmEvidenceAlias;
  assert.equal(retained.nativeRpmRef.commit, f.patch.sourceReview.reviewCommit);
  assert.equal(retained.nativeRpmRef.path, RPM);
  assert.equal(retained.nativeRpmRef.sha256, f.m.sha(f.original));
  assert.equal(alias.selectedRecordSha256, retained.nativeRpmRef.recordSha256);
  assert.deepEqual(alias.copyRef, f.copyRef);
  assert.equal(alias.newMetadataApprovals, 0); assert.equal(alias.inferredValues, false);
  assert.equal(JSON.stringify(alias).includes(f.m.sha(fs.readFileSync(path.join(f.root, RPM)))), false);
  assert.equal(f.m.stable(f.patch.sourceReview), f.originalReview);
  assert.equal(f.m.stable(f.patch.after), f.originalAfter);
  changeCurrent(f, current => {
    current.records[1].fixtureUnrelatedRow = 'later unrelated change';
    current.records.push({ ...current.records[1], id: 'M2-RPM-3' });
    current.summary.recordCount = 3; current.generatedAgainstMain = 'another unrelated HEAD';
  });
  assert.deepEqual(f.m.validateReviewedSourceReassessment(f.args), proof);
});

const scopeChanges = [
  ['top-level marker', f => { f.request.nativeRpmEvidenceAlias = f.patch.nativeRpmEvidenceAlias; }],
  ['approval marker', f => { f.request.approval.nativeRpmEvidenceAlias = f.patch.nativeRpmEvidenceAlias; }],
  ['sourceReview marker', f => { f.patch.sourceReview.nativeRpmEvidenceAlias = f.patch.nativeRpmEvidenceAlias; }],
  ['retainedFields marker', f => { f.patch.sourceReview.retainedFields.nativeRpmEvidenceAlias = f.patch.nativeRpmEvidenceAlias; }],
  ['nonpartial scope', f => { f.request.scope = 'FULL_EXAM'; }],
  ['non FINAL_QA approval', f => { f.request.approval.type = 'REVIEW2'; }],
  ['unreviewed metadata', f => { f.request.approval.metadataReviewed = false; }],
  ['another registration mode', f => { f.request.registrationMode = 'IDENTITY_FINGERPRINT_ONLY'; }],
  ['source-only reuse', f => { f.request.approval.sourceRebind = {}; }],
  ['registry mutation', f => { f.request.registryChanges.push({ op: 'ADD' }); }],
  ['M3 source', f => { f.request.sourceArchiveFile = 'original/middle/m3/2final/synthetic.js'; }],
  ['M2 first semester source', f => { f.request.sourceArchiveFile = 'original/middle/m2/1final/synthetic.js'; }],
  ['fingerprint-only mode', f => { f.patch.rebind = {}; }],
  ['missing retained authority', f => { delete f.patch.sourceReview.retainedFields; }],
  ['proposal authority mixed in', f => { f.patch.sourceReview.proposalFinalization = {}; }],
  ['M3 renderer mixed in', f => { f.patch.sourceReview.rendererProof = {}; }],
  ['provider renderer mixed in', f => { f.patch.sourceReview.m2ProviderRendererProof = {}; }],
  ['unknown alias claim', f => { f.patch.nativeRpmEvidenceAlias.newQaApproval = true; }],
  ['foreign native commit', f => { f.patch.nativeRpmEvidenceAlias.nativeCommit = f.head; }],
  ['foreign native path', f => { f.patch.nativeRpmEvidenceAlias.nativePath = 'archive/data/other.json'; }],
  ['foreign alias path', f => { f.patch.nativeRpmEvidenceAlias.copyRef.path = '.archive-meta-register/evidence/other.json'; }],
  ['alias copy with a foreign commit field', f => { f.patch.nativeRpmEvidenceAlias.copyRef.commit = f.head; }],
  ['missing approval dependency', f => { f.request.approval.evidenceRefs = f.request.approval.evidenceRefs.filter(ref => ref.path !== f.copyRef.path); }],
  ['missing item dependency', f => { f.patch.evidenceRefs = f.patch.evidenceRefs.filter(ref => ref.path !== f.copyRef.path); }],
  ['duplicate alias dependency', f => { f.patch.evidenceRefs.push({ ...f.copyRef }); }],
  ['historical canonical ref retained', f => { f.patch.evidenceRefs.push({ path: RPM, sha256: f.m.sha(f.original) }); }],
];
test('alias rejects incompatible dispatch before any registrar work', async t => {
  const f = await fixture(t), pristineRequest = structuredClone(f.request);
  // These cases all reject before any data read/write. A fresh request object
  // per case is sufficient; the immutable Git fixture need not be rebuilt.
  for (const [label, mutate] of scopeChanges) await t.test(label, () => {
    f.request = structuredClone(pristineRequest); f.patch = f.request.items[0]; mutate(f);
    assert.throws(() => f.m.registerReviewedExamV2({ root: f.root, request: f.request }), /native RPM alias/);
    assert.equal(fs.existsSync(path.join(f.root, f.receiptPath)), false);
  });
});

const dataChanges = [
  ['removed alias marker', f => { delete f.patch.nativeRpmEvidenceAlias; }],
  ['missing alias bytes', f => { fs.unlinkSync(path.join(f.root, f.copyRef.path)); }],
  ['unsealed alias bytes', f => { fs.appendFileSync(path.join(f.root, f.copyRef.path), ' '); }],
  ['truthfully rehashed nonnative copy', f => { fs.appendFileSync(path.join(f.root, f.copyRef.path), ' '); bindCopy(f); }],
  ['alias symlink', f => {
    const target = f.put('alias-target.json', f.original); fs.unlinkSync(path.join(f.root, f.copyRef.path));
    fs.symlinkSync(path.join(f.root, target.path), path.join(f.root, f.copyRef.path));
  }],
  ['canonical symlink', f => {
    const target = f.put('current-target.json', fs.readFileSync(path.join(f.root, RPM)));
    fs.unlinkSync(path.join(f.root, RPM)); fs.symlinkSync(path.join(f.root, target.path), path.join(f.root, RPM));
  }],
  ['uncommitted current bytes', f => { fs.appendFileSync(path.join(f.root, RPM), ' '); }],
  ['committed selected row drift', f => { changeCurrent(f, doc => { doc.records[0].scope = 'M2-1'; }); }],
  ['committed missing selected row', f => { changeCurrent(f, doc => { doc.records.shift(); }); }],
  ['committed duplicate row', f => { changeCurrent(f, doc => { doc.records.push({ ...doc.records[0] }); }); }],
  ['committed ACTIVE status drift', f => { changeCurrent(f, doc => { doc.status = 'DRAFT'; }); }],
  ['committed grade drift', f => { changeCurrent(f, doc => { doc.grade = 'M3'; }); }],
  ['committed authority drift', f => { changeCurrent(f, doc => { doc.rpmAuthority.status = 'UNLOCKED'; }); }],
  ['committed policy drift', f => { changeCurrent(f, doc => { doc.policy = {}; }); }],
  ['changed sourceReview', f => { f.patch.sourceReview.reviewPath = 'docs/another-native.json'; }],
  ['changed retention selection', f => { f.patch.sourceReview.retainedFields.fields.pop(); }],
  ['changed semantic after', f => { f.patch.after.templateKey = 'TPL_OTHER'; f.args.final.templateKey = 'TPL_OTHER'; }],
  ['missing native review', f => { fs.unlinkSync(path.join(f.root, f.patch.sourceReview.reviewRef.path)); }],
  ['unavailable HEAD', f => { fs.writeFileSync(path.join(f.root, '.git', 'HEAD'), 'ref: refs/heads/missing\n'); }],
];
for (const [label, mutate] of dataChanges) test('fresh alias validation rejects ' + label + ' after warming its immutable inputs', async t => {
  const f = await fixture(t); f.m.validateReviewedSourceReassessment(f.args); mutate(f);
  assert.throws(() => f.m.validateReviewedSourceReassessment(f.args));
  assert.throws(() => f.m.validateReviewedSourceReassessment({ ...f.args, cache: new Map() }));
});

test('official dry/write/replay, unchanged cursors and immutable PR shadow use the original native authority', async t => {
  const f = await fixture(t), selected = f.m.selectNativeRequests({ root: f.root, baseSha: f.frozenCommit, headSha: f.head });
  assert.equal(selected.length, 1);
  assert(selected[0].evidence.some(ref => ref.path === f.copyRef.path && ref.sha256 === f.copyRef.sha256));
  assert.equal(selected[0].evidence.some(ref => ref.path === RPM), false);
  // The official shadow runs the real registrar against the selected immutable
  // source/data/evidence tree, not a stubbed plan or a mutable shared checkout.
  const registrarPath = 'archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs';
  const shadow = f.m.rederiveNativePlans({ root: f.root, requests: selected, run: (program, args, cwd) => {
    assert.equal(program, process.execPath);
    assert.equal(args[0], path.join(f.root, registrarPath));
    return f.m.nativeCommand(program, [path.resolve(__dirname, '..', registrarPath), ...args.slice(1)], cwd);
  } });
  assert.equal(shadow.plans.length, 1); assert(shadow.outputs.some(ref => ref.path === f.receiptPath));
  assert.equal(f.m.registerReviewedExamV2({ root: f.root, request: f.request }).status, 'PASS');
  assert.equal(f.m.registerReviewedExamV2({ root: f.root, request: f.request, write: true }).status, 'PASS');
  const replay = f.m.registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(replay.replay, true); assert.deepEqual(replay.plannedPaths, []);
  const c = f.runtimeContext(), issued = c.receipt.fingerprintRepairs[0].sourceReview.retainedNativeFields;
  assert.equal(issued.nativeRpmRef.sha256, f.m.sha(f.original));
  assert.deepEqual(issued.nativeRpmEvidenceAlias.copyRef, f.copyRef);
  for (const previous of [c.previous, c.question]) assert.equal(f.m.planQuestion({ ...c, previous }).status, 'ALREADY_REGISTERED');
  changeCurrent(f, doc => { doc.records[1].fixtureUnrelatedRow = 'new unrelated commit after issue'; });
  for (const previous of [c.previous, c.question]) assert.equal(f.m.planQuestion({ ...c, previous }).status, 'ALREADY_REGISTERED');
});

function resealIssuedSidecar(f, c, mutate) {
  const sidecar = f.read(c.bindingPath), request = sidecar.requestSnapshot;
  mutate(request, c.receipt);
  c.receipt.requestSha256 = f.m.sha(f.m.stable(request)); c.receipt.approval = structuredClone(request.approval);
  const bound = f.m.buildReviewedSourceBinding({ request, ...c.receipt });
  const ref = f.put(c.bindingPath, bound);
  c.receipt.outputDigests = c.receipt.outputDigests.map(row => row.path === c.bindingPath ? { ...row, sha256: ref.sha256 } : row);
}

function coldStatuses(f, c) {
  const input = { question: c.question, previous: c.previous, current: c.current, identity: c.identity,
    source: c.source, ordinal: c.ordinal, runtimeOwner: c.runtimeOwner,
    nativeSource: { ...c.nativeSource, bytes: c.nativeSource.bytes.toString('base64'), identityByJoin: [...c.nativeSource.identityByJoin] } };
  const ref = f.put('.tmp/cold-alias-context.json', input);
  const auto = pathToFileURL(path.resolve(__dirname, '../archive/tools/meta-foundation/auto-register-merged-source.mjs')).href;
  const active = pathToFileURL(path.resolve(__dirname, '../archive/tools/meta-foundation/active-registry.mjs')).href;
  const script = `import fs from 'node:fs';
    import {planQuestion} from ${JSON.stringify(auto)};
    import {loadActiveMetaRegistry,validateActiveMetaFields} from ${JSON.stringify(active)};
    const c=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));
    c.nativeSource.bytes=Buffer.from(c.nativeSource.bytes,'base64');
    c.nativeSource.identityByJoin=new Map(c.nativeSource.identityByJoin);
    c.registry=loadActiveMetaRegistry(c.nativeSource.root);c.validate=validateActiveMetaFields;
    process.stdout.write(JSON.stringify([c.previous,c.question].map(previous=>{
      const r=planQuestion({...c,previous});return {status:r.status,hasFinal:r.final!==undefined,hasReceipt:r.nativeReviewReceipt!==undefined};
    })));`;
  return JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', script, path.join(f.root, ref.path)], {
    cwd: f.root, stdio: ['ignore', 'pipe', 'pipe'], timeout: 15000,
  }).toString());
}

const issuedChanges = [
  ['alias deletion', (f, c) => { fs.unlinkSync(path.join(f.root, f.copyRef.path)); }],
  ['sealed marker removal with all hashes rebound', (f, c) => {
    resealIssuedSidecar(f, c, request => { delete request.items[0].nativeRpmEvidenceAlias; });
  }],
  ['issued alias proof removal with all hashes rebound', (f, c) => {
    resealIssuedSidecar(f, c, (_, receipt) => { delete receipt.fingerprintRepairs[0].sourceReview.retainedNativeFields.nativeRpmEvidenceAlias; });
  }],
  ['sidecar deletion', (f, c) => { fs.unlinkSync(path.join(f.root, c.bindingPath)); }],
  ['committed selected RPM drift after issue', (f, c) => { changeCurrent(f, doc => { doc.records[0].subUnitKey = 'UNREVIEWED'; }); }],
  ['committed combined alias/marker/proof deletion', (f, c) => {
    resealIssuedSidecar(f, c, (request, receipt) => {
      delete request.items[0].nativeRpmEvidenceAlias;
      delete receipt.fingerprintRepairs[0].sourceReview.retainedNativeFields.nativeRpmEvidenceAlias;
      for (const owner of [request.approval, request.items[0]]) owner.evidenceRefs = owner.evidenceRefs.filter(ref => ref.path !== f.copyRef.path);
    });
    fs.unlinkSync(path.join(f.root, f.copyRef.path)); f.put(c.receiptPath, c.receipt); f.commit();
  }],
  ['committed alias and all source-review/renderer claims stripped together', (f, c) => {
    delete c.receipt.fingerprintRepairs;
    c.receipt.outputDigests = c.receipt.outputDigests.filter(ref => ref.path !== c.bindingPath);
    c.receipt.approval.evidenceRefs = c.receipt.approval.evidenceRefs.filter(ref => ![f.copyRef.path, f.witnessPath].includes(ref.path));
    for (const row of [c.current, c.nativeSource.runtimeRecord, ...c.receipt.appliedRecords, ...c.receipt.runtimeRecords]) {
      row.approvalEvidence = row.approvalEvidence.filter(p => ![c.bindingPath, f.copyRef.path, f.witnessPath].includes(p));
      delete row.metadataRevision;
    }
    for (const relative of [c.bindingPath, f.copyRef.path, f.witnessPath, f.requestPath]) fs.unlinkSync(path.join(f.root, relative));
    f.put(c.receiptPath, c.receipt); f.commit();
  }],
];
for (const [label, mutate] of issuedChanges) test('issued alias remains mandatory for warm/cold old/current cursors: ' + label, async t => {
  const f = await fixture(t); f.m.registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const c = f.runtimeContext(); c.bindingPath = c.receipt.outputDigests.find(ref => ref.path.endsWith('.source-review-binding.json')).path;
  assert.equal(f.m.planQuestion(c).status, 'ALREADY_REGISTERED');
  mutate(f, c); f.put(c.receiptPath, c.receipt);
  for (const previous of [c.previous, c.question]) {
    const result = f.m.planQuestion({ ...c, previous });
    assert.equal(result.status, 'SUPPLEMENT_PENDING', JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt, undefined); assert.equal(result.final, undefined);
  }
  assert.deepEqual(coldStatuses(f, c), [
    { status: 'SUPPLEMENT_PENDING', hasFinal: false, hasReceipt: false },
    { status: 'SUPPLEMENT_PENDING', hasFinal: false, hasReceipt: false },
  ]);
});
