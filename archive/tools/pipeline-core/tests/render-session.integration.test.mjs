import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { fileRef } from '../canonical.mjs';
import { RUN_VERSION, runInputSha } from '../closure.mjs';
import { captureRender } from '../render.mjs';
import { runtimeDependencyBundle } from '../runtime.mjs';

test('production Fast Runtime reuses viewport sessions while preserving six-case captures', async t => {
  const root = path.resolve(process.cwd());
  const fixtureDirectory = fs.mkdtempSync(path.join(root, 'archive/_generated/render-session-fixture-'));
  t.after(() => fs.rmSync(fixtureDirectory, { recursive: true, force: true }));
  const relative = file => path.relative(root, file).split(path.sep).join('/');
  const sourceFile = path.join(fixtureDirectory, 'source.js');
  const candidateFile = path.join(fixtureDirectory, 'candidate.js');
  const bank = [
    { id: 1, content: '2+2를 계산한다.', choices: ['3', '4'], answer: '2', solution: '2+2=4이다.' },
    { id: 2, content: '3+3을 계산한다.', choices: ['5', '6'], answer: '2', solution: '3+3=6이다.' },
  ];
  const sourceText = 'window.examTitle=\"render-session-fixture\";window.questionBank=' + JSON.stringify(bank) + ';';
  fs.writeFileSync(sourceFile, sourceText);
  fs.writeFileSync(candidateFile, sourceText);
  const sourcePath = relative(sourceFile);
  const candidatePath = relative(candidateFile);
  const sourceRef = { ...fileRef(root, sourcePath), role: 'source' };
  const candidateRef = { ...fileRef(root, candidatePath), role: 'candidate' };
  const runtime = runtimeDependencyBundle(root, 'archive/engine.html');
  const inputs = [sourceRef, candidateRef, ...runtime.localFiles.map(ref => ({ ...ref, role: ref.path === runtime.enginePath ? 'engine' : 'runtime' }))];
  const questions = bank.map(question => ({
    questionUid: sourcePath + '|render-session-fixture|' + question.id,
    examId: 'render-session-fixture',
    qid: question.id,
    sourcePath,
    candidatePath,
    sourceStatus: 'RESOLVED',
    visual: { requirement: 'VISUAL_EXEMPT', action: 'NONE', exemptReason: 'NO_VISUAL_NEEDED', adjudicationId: 'render-session-fixture', adjudicationStatus: 'RESOLVED', actualSolutionVisualAttached: false, problemVisualMathDependency: false, sharedVisualMathDependency: false },
    solutionAssetPaths: [],
    problemAssetPaths: [],
    evidence: {},
  }));
  const run = {
    schemaVersion: RUN_VERSION,
    pipeline: 'logic-visual',
    runId: 'render-session-fixture',
    revision: 1,
    builderSessionId: 'render-session-builder',
    canonicalRecordId: 'render-session-fixture-r1',
    publicationIntent: 'FULL_EXAM',
    renderRuntime: runtime,
    questions,
    inputs,
    evidence: [],
    registry: [],
  };
  run.inputSha = runInputSha(run);
  const output = relative(path.join(fixtureDirectory, 'captures'));
  const report = await captureRender(root, run, output, { channel: 'chrome' });
  assert.equal(report.status, 'CAPTURED_REVIEW_REQUIRED');
  assert.equal(report.captures.length, 6);
  const captures = report.captures.map(ref => JSON.parse(fs.readFileSync(path.join(root, ref.path), 'utf8')));
  const required = ['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile'];
  assert.deepEqual(captures.map(capture => capture.payload.mode + '/' + capture.payload.viewport.profile).sort(), required.sort());
  assert.ok(captures.every(capture => capture.payload.runtimeReadiness.runtimePresent === true));
  assert.ok(captures.every(capture => capture.payload.runtimeReadiness.snapshotStatus === 'ACTIVE'));
  assert.ok(captures.every(capture => capture.payload.captureSession.parity.status === 'PASS'));
  assert.equal(captures.filter(capture => capture.payload.captureSession.contextReused === true).length, 4);
  assert.equal(captures.filter(capture => capture.payload.captureSession.action === 'MODE_CHANGE').length, 4);
});
