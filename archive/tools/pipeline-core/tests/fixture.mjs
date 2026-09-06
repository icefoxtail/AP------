import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { deflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { fileRef, objectSha } from '../canonical.mjs';
import { EVIDENCE_VERSION, RUN_VERSION, runInputSha, denominatorInput, profiles } from '../closure.mjs';
import { VISUAL_SPEC_SHA, structureFingerprint } from '../visual.mjs';
import { crc32 } from '../png.mjs';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
export const fact = (uid = 'fixture') => ({ schemaVersion: 'APMATH_VISUAL_FACT_v2', questionUid: uid, visualType: 'set-cardinality', semantic: { setIds: ['A', 'B'], universeId: 'U', universeCount: 45, aCount: 28, bCount: 23, maximumIntersection: 23, minimumIntersection: 6 } });

export function png(width, height) {
  const chunk = (type, data) => { const name = Buffer.from(type); const size = Buffer.alloc(4); size.writeUInt32BE(data.length); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([name, data]))); return Buffer.concat([size, name, data, crc]); };
  const header = Buffer.alloc(13); header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 2;
  const pixels = Buffer.alloc(height * (width * 3 + 1), 255); for (let i = 0; i < height; i++) pixels[i * (width * 3 + 1)] = 0;
  return Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), chunk('IHDR', header), chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0))]);
}

// Synthetic test-only independent-review envelopes. These are never emitted
// for real questions or interpreted as a calibration/release certification.
export function fixture(pipeline = 'logic-visual', { visual = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-core-test-'));
  const write = (relative, data) => { const file = path.join(root, relative); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, Buffer.isBuffer(data) || typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`); return fileRef(root, relative); };
  const sourcePath = 'source.js', candidatePath = 'candidate.js', uid = `${sourcePath}|fixture|1`;
  const question = { id: 1, content: '두 집합의 원소 수를 비교한다.', choices: ['1', '2', '3', '4', '5'], answer: '1', solution: '교집합의 상한과 하한을 계산한다.', ...(visual ? { solutionImage: 'assets/visual.svg', solutionImageAlt: '두 집합의 원소 수', solutionImageCaption: '최대와 최소' } : {}) };
  const source = 'window.examTitle="fixture";window.questionBank=' + JSON.stringify([question]) + ';';
  const run = { schemaVersion: RUN_VERSION, pipeline, runId: 'fixture', revision: 1, builderSessionId: 'builder', canonicalRecordId: 'fixture-r1', questions: [{ questionUid: uid, examId: 'fixture', qid: 1, sourcePath, candidatePath, sourceStatus: 'RESOLVED', visual: { requirement: visual ? 'VISUAL_OPTIONAL' : 'VISUAL_EXEMPT', exemptReason: visual ? null : 'NO_VISUAL_NEEDED', adjudicationId: 'test-adjudication', adjudicationStatus: 'RESOLVED', actualSolutionVisualAttached: visual, problemVisualMathDependency: false, sharedVisualMathDependency: false }, solutionAssetPaths: visual ? ['assets/visual.svg'] : [], problemAssetPaths: [], evidence: {} }], inputs: [], evidence: [], registry: [] };
  run.questions[0].visual.action = visual ? 'KEEP' : 'NONE';
  run.questions[0].visual.adjudicationId = profiles.pipelines[pipeline].visual ? visual ? 'v3' : 'v1' : 'test-adjudication';
  run.inputs.push({ ...write(sourcePath, source), role: 'source' }, { ...write(candidatePath, source), role: 'candidate' });
  if (visual) run.inputs.push({ ...write('assets/visual.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="320" viewBox="0 0 360 320"><title>Test fixture</title><desc>Not real review evidence</desc></svg>'), role: 'asset' });
  const manifest = fs.readFileSync(path.join(repository, 'docs/rules/MANIFEST.md'), 'utf8');
  write('docs/rules/MANIFEST.md', manifest);
  for (const match of manifest.matchAll(/^- (.+?) \|/gm)) run.inputs.push({ ...write(`docs/rules/${match[1]}`, fs.readFileSync(path.join(repository, 'docs/rules', match[1]))), role: 'rule' });
  run.inputs.push({ ...fileRef(root, 'docs/rules/MANIFEST.md'), role: 'rule' });
  run.inputs.push({ ...write('spec.json', { version: 'test' }), role: 'spec' }, { ...write('verifier.js', '// fixture verifier identity'), role: 'verifier' }, { ...write('engine.html', '<!doctype html><title>fixture</title>'), role: 'engine' });
  const v1Bundle = write('v1-input.json', { questionUid: uid, content: question.content, choices: question.choices, problemAssets: [] });
  const v2Bundle = visual ? write('v2-input.json', { questionUid: uid, artifact: fileRef(root, 'assets/visual.svg'), renderWitnesses: [] }) : null;
  run.inputSha = runInputSha(run);
  run.registry = [{ recordId: 'fixture-r1', batchId: 'fixture', revision: 1, supersedes: null, isCanonical: true, inputSha: run.inputSha, questionUids: [uid] }];
  run.denominator = { status: 'FROZEN', stale: false, ...denominatorInput(run) };
  const records = new Map();
  const add = (axis, payload, extra = {}) => {
    const id = extra.evidenceId || axis;
    const e = { schemaVersion: EVIDENCE_VERSION, evidenceId: id, runId: run.runId, revision: 1, questionUid: uid, axis, inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, status: 'PASS', validityStatus: 'FROZEN', reviewerId: `fixture-${id}`, reviewSessionId: `session-${id}`, reviewerModelOrAgent: 'SYNTHETIC_TEST_ONLY', priorReviewVisibility: 'NONE', startedAt: '2026-09-06T01:00:00Z', frozenAt: '2026-09-06T01:01:00Z', findings: [], payload, ...extra };
    const ref = write(`evidence/${id}.json`, e); records.set(id, e); run.evidence.push(ref);
    if (axis !== 'render') run.questions[0].evidence[axis] = id;
    return ref;
  };
  for (const axis of profiles.pipelines[pipeline].axes) add(axis, axis === 'math' ? { blindSolveFrozen: true, allChoicesChecked: true, answerUnique: true } : { testOnly: true });
  if (visual && profiles.pipelines[pipeline].visual) {
    const expected = add('v1', { freshBlind: true, visualRequirementSignal: 'MAY_BE_OPTIONAL', specSha: VISUAL_SPEC_SHA, fact: fact(uid), inputBundle: v1Bundle }, { inputVisibilityProfile: 'SOURCE_ONLY' });
    const observed = add('v2', { freshBlind: true, specSha: VISUAL_SPEC_SHA, fact: fact(uid), inputBundle: v2Bundle, artifactPath: 'assets/visual.svg', artifactSha: fileRef(root, 'assets/visual.svg').sha256, structureSha: structureFingerprint(fact(uid)) }, { inputVisibilityProfile: 'ARTIFACT_ONLY' });
    add('v3', { v1EvidenceSha: expected.sha256, v2EvidenceSha: observed.sha256, finalVisualRequirement: run.questions[0].visual.requirement, cDenominatorInputSha: run.denominator.inputSha, checks: Object.fromEntries(['necessity', 'decisiveStep', 'completeness', 'mediumFit', 'solutionParity', 'altCaptionParity', 'semanticsLocks', 'staticContract'].map(k => [k, 'PASS'])) }, { inputVisibilityProfile: 'FROZEN_V1_V2', startedAt: '2026-09-06T01:02:00Z', frozenAt: '2026-09-06T01:03:00Z' });
  }
  if (!visual && profiles.pipelines[pipeline].visual) add('v1', { freshBlind: true, visualRequirementSignal: 'SHOULD_BE_EXEMPT', specSha: VISUAL_SPEC_SHA, fact: null, inputBundle: v1Bundle }, { inputVisibilityProfile: 'SOURCE_ONLY' });
  for (const mode of profiles.pipelines[pipeline].modes) for (const vp of profiles.viewports) {
    const viewport = { profile: vp.profile, width: vp.minWidth, height: 844 };
    const screenshot = write(`screens/${mode}-${vp.profile}.png`, png(viewport.width, viewport.height));
    add('render', { actualBrowser: true, productionEngine: true, browserVersion: 'SYNTHETIC_TEST_ONLY', mode, viewport, candidatePath, questionUids: [uid], expectedQuestionCount: 1, observedQuestionCount: 1, lastQuestionId: 1, itemWitnesses: [{ questionUid: uid, screenshot, status: 'PASS' }], checks: Object.fromEntries(profiles.renderChecks.map(k => [k, 'PASS'])), screenshot, assetAssociations: visual && mode === 'solution' ? [{ questionUid: uid, path: 'assets/visual.svg', sha256: fileRef(root, 'assets/visual.svg').sha256, status: 'PASS' }] : [] }, { evidenceId: `${mode}-${vp.profile}` });
  }
  const rewriteEvidence = (id, change) => {
    const e = records.get(id); change(e); const ref = write(`evidence/${id}.json`, e); const index = run.evidence.findIndex(r => r.path === ref.path); run.evidence[index] = ref;
    return ref;
  };
  return { root, run, write, records, rewriteEvidence, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}
