import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { canonicalJson } from '../../pipeline-core/canonical.mjs';
import { computeV2AxisInputShas } from '../../pipeline-core/v2-audit.mjs';
import { packetInputs } from '../resume-past-exam.mjs';
import { recoveryFixture } from '../../pipeline-core/tests/recovery-fixture.mjs';
import { freezeWorkBatch, readWorkBatch } from '../../pipeline-core/work-batch.mjs';
import { canonicalExamIdentity } from '../lib/exam-id.mjs';
import { indexProductionCandidates, existingExamPreflight } from '../lib/existing-exam.mjs';
import { buildInventory } from '../run-batch.mjs';

const REQUIRED_CASES = Object.freeze(['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile']);
const SHA = 'sha256:' + 'a'.repeat(64);

function withReadCounter(watchedPath, callback) {
  const original = fs.readFileSync;
  let count = 0;
  fs.readFileSync = function countedRead(target, ...args) {
    if (typeof target === 'string' && path.resolve(target) === path.resolve(watchedPath)) count += 1;
    return original.call(this, target, ...args);
  };
  try {
    return { result: callback(), get count() { return count; } };
  } finally {
    fs.readFileSync = original;
  }
}

async function targetedPacketFixture(t) {
  const fixture = recoveryFixture(t, { pipeline: 'past-exam', questionCount: 2 });
  const generated = fixture.makeRun(1);
  freezeWorkBatch(fixture.root, 'job', [generated.ref]);
  const state = readWorkBatch(fixture.root, 'job');
  return {
    fixture,
    state,
    plan: {
      freezeSha: state.freezes.at(-1).freezeSha,
      scope: generated.run.questions.map(question => ({ runId: generated.run.runId, questionUid: question.questionUid })),
      axisScope: {
        U1: [],
        U2: [],
        U3: [
          { runId: generated.run.runId, questionUid: 'recovery|1', axes: ['SOLUTION'] },
          { runId: generated.run.runId, questionUid: 'recovery|2', axes: ['MATH_A2'] },
        ],
      },
      auditorId: 'targeted-auditor',
      contexts: { U3: { sessionId: 'targeted-u3-session', contextId: 'targeted-u3-context' } },
      launchId: 'job:1',
      externalId: 'external-targeted',
    },
  };
}

test('targeted packet preserves exact UID-axis scope instead of a phase-wide union', async t => {
  const { fixture, state, plan } = await targetedPacketFixture(t);
  const module = await import('../resume-past-exam.mjs');
  assert.equal(typeof module.buildPackets, 'function', 'buildPackets must expose the sealed packet construction boundary');
  const refs = module.buildPackets(fixture.root, state, plan, 'alive/runtime/provider-bridge/job/launch-1');
  const packetRef = refs.find(row => row.phase === 'U3').ref;
  const packet = JSON.parse(fs.readFileSync(path.join(fixture.root, packetRef.path), 'utf8'));
  assert.deepEqual(packet.targetedAxesByQuestionUid, { 'recovery|1': ['SOLUTION'], 'recovery|2': ['MATH_A2'] });
  assert.equal(packet.targetedAxes, undefined);
  const { packetSha, ...payload } = packet;
  assert.equal(packetSha, (await import('../../pipeline-core/canonical.mjs')).objectSha(payload));
});

test('provider rejects evidence outside the requested UID-axis pairs', async () => {
  const module = await import('../../pipeline-core/provider-bridge.mjs');
  assert.equal(typeof module.validateProviderEvidenceScope, 'function', 'provider scope validator must be explicit');
  const packet = {
    phase: 'U3',
    questionUids: ['recovery|1', 'recovery|2'],
    targetedAxesByQuestionUid: { 'recovery|1': ['SOLUTION'], 'recovery|2': ['MATH_A2'] },
  };
  assert.throws(
    () => module.validateProviderEvidenceScope([{ questionUid: 'recovery|1', axis: 'MATH_A2' }], packet),
    /PROVIDER_UNREQUESTED_EVIDENCE_SCOPE/,
  );
});

test('V2 axis input calculation reads one shared asset per invocation and does not retain a global cache', t => {
  const fixture = recoveryFixture(t, {
    pipeline: 'past-exam',
    questionCount: 2,
    candidateOverrides: { solutionImage: 'assets/shared.svg' },
    assetFiles: { 'assets/shared.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8"/></svg>' },
  });
  const generated = fixture.makeRun(1);
  const assetPath = path.join(fixture.root, 'assets/shared.svg');
  const first = withReadCounter(assetPath, () => computeV2AxisInputShas(fixture.root, generated.run));
  const second = withReadCounter(assetPath, () => computeV2AxisInputShas(fixture.root, generated.run));
  assert.equal(first.count, 1, `first invocation read the immutable asset ${first.count} times`);
  assert.equal(second.count, 1, `second invocation must receive a fresh operation-local snapshot, got ${second.count}`);
});

test('packet build indexes evidence once and computes a bound solution asset once per invocation', t => {
  const fixture = recoveryFixture(t, {
    pipeline: 'past-exam',
    questionCount: 2,
    candidateOverrides: { solutionImage: 'assets/shared.svg' },
    assetFiles: { 'assets/shared.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8"/></svg>' },
  });
  const generated = fixture.makeRun(1);
  const evidenceRefs = REQUIRED_CASES.slice(0, 2).map((_, index) => fixture.write(`evidence/render-${index + 1}.json`, {
    schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2',
    evidenceId: `render-${index + 1}`,
    runId: generated.run.runId,
    revision: generated.run.revision,
    axis: 'RENDER_CAPTURE',
    inputSha: generated.run.inputSha,
    payload: { itemWitnesses: [] },
  }));
  generated.run.evidence = evidenceRefs;
  const runRef = fixture.write('packet/run-with-evidence.json', generated.run);
  const state = { builderId: 'builder', builderSessionId: 'builder-session', freezes: [{ freezeSha: 'sha256:' + 'b'.repeat(64), runRefs: [runRef], targets: generated.run.questions.map(question => ({ runId: generated.run.runId, questionUid: question.questionUid })) }] };
  const plan = {
    freezeSha: state.freezes.at(-1).freezeSha,
    scope: generated.run.questions.map(question => ({ runId: generated.run.runId, questionUid: question.questionUid })),
    axisScope: {
      U1: [],
      U2: generated.run.questions.map(question => ({ runId: generated.run.runId, questionUid: question.questionUid, axes: ['V2'] })),
      U3: [],
    },
  };
  const assetPath = path.join(fixture.root, 'assets/shared.svg');
  const first = withReadCounter(assetPath, () => packetInputs(fixture.root, state, plan));
  const second = withReadCounter(assetPath, () => packetInputs(fixture.root, state, plan));
  assert.equal(first.count, 1, `packet build read the shared asset ${first.count} times`);
  assert.equal(second.count, 1, `a second packet build must use a new local cache, got ${second.count}`);
  const evidencePath = path.join(fixture.root, evidenceRefs[0].path);
  const evidenceRead = withReadCounter(evidencePath, () => packetInputs(fixture.root, state, { ...plan, axisScope: { U1: [], U2: [], U3: generated.run.questions.map(question => ({ runId: generated.run.runId, questionUid: question.questionUid, axes: ['SOLUTION'] })) } }));
  assert.equal(evidenceRead.count, 1, `evidence index should read each evidence ref once, got ${evidenceRead.count}`);
});

test('batch inventory performs one production scan and shares one preflight per canonical source identity', async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-inventory-performance-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const sourceRoot = path.join(root, 'source');
  const batchDir = path.join(root, 'batch');
  const pdfs = [
    { file: path.join(sourceRoot, '25_강남여고_2학기_기말_고2_수학II.pdf'), size: 1 },
    { file: path.join(sourceRoot, '25_강남여고_2학기_기말_고2_수학II_정답.pdf'), size: 1 },
    { file: path.join(sourceRoot, '25_강남여고_2학기_기말_고2_수학II_해설.pdf'), size: 1 },
  ];
  let scanCalls = 0;
  let preflightCalls = 0;
  const cfg = { sourceRoot, archiveRoot: path.join(root, 'archive'), batchDir, args: { years: [], recentYears: 0, grade: '', semester: '', examType: '', forceExisting: false, limit: 0 }, defaultRecentYears: 0, existingExamMode: 'NEW_EXAM_ONLY' };
  const inventory = await buildInventory(cfg, {
    listPdfFiles: async () => pdfs,
    scanProductionCandidates: () => { scanCalls += 1; return { candidates: [], scannedFileCount: 0 }; },
    indexProductionCandidates: candidates => ({ candidates, exact: new Map(), base: new Map() }),
    existingExamPreflight: ({ examIdentity }) => { preflightCalls += 1; return { status: 'NEW_EXAM', skip: false, identity: examIdentity }; },
  });
  assert.equal(inventory.items.length, 3);
  assert.equal(scanCalls, 1);
  assert.equal(preflightCalls, 1);
});

test('production candidate index preserves collisions and standalone boundary revalidation sees new files', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-inventory-index-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const identity = canonicalExamIdentity({ year: 2025, school: '강남여고', grade: '고2', semester: '2', examType: 'final', course: '수학II' });
  const candidate = relative => ({ file: relative, identity, sha256: SHA, bytes: 1, discovery: 'DATABASE' });
  const index = indexProductionCandidates([candidate('original/a.js'), candidate('original/b.js')]);
  const key = canonicalJson(identity);
  assert.equal(index.exact.get(key).length, 2);

  const file = path.join(root, 'archive/exams/original/high/h2/2final/25_강남여고_2학기_기말_고2_수학II.js');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, 'window.questionBank=[];');
  const result = existingExamPreflight({ archiveRoot: path.join(root, 'archive'), examIdentity: identity });
  assert.equal(result.status, 'SKIP_EXISTING_EXAM');
});
