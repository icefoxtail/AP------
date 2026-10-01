#!/usr/bin/env node
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validatePhysicalEvidence } from './review-evidence-gate.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'physical-evidence-gate-'));
const examDir = path.join(root, 'archive/exams/original/high/h1/2mid');
const assetDir = path.join(root, 'archive/assets/images/test');
fs.mkdirSync(examDir, { recursive: true });
fs.mkdirSync(assetDir, { recursive: true });
const examFile = path.join(examDir, 'test.js');
const assetFile = path.join(assetDir, 'q1.svg');
fs.writeFileSync(assetFile, '<svg xmlns="http://www.w3.org/2000/svg"><line id="l" x1="0" y1="0" x2="1" y2="1"/></svg>\n');
const goodExam = `window.examTitle="test";window.questionBank=[{"id":1,"content":"<br>ㄱ. A<br>ㄴ. B","choices":["1","2"],"answer":"①","solution":"ㄱ. 참\\n\\nㄴ. 거짓","standardCourse":"공통수학2","standardUnitKey":"H22-C2-02","subUnitKey":"H22-C2-02-RELATION","problemTypeKey":"PT_LINE_RELATION","templateKey":"TPL_RELATION","solutionImage":"assets/images/test/q1.svg"}];\n`;
const hash = value => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;

function evidence(examSource = goodExam) {
  return {
    schemaVersion: 'JS_ARCHIVE_PHYSICAL_REVIEW_EVIDENCE_v1',
    stage: 'R3',
    examPath: 'archive/exams/original/high/h1/2mid/test.js',
    examSha256: hash(examSource),
    questionCount: 1,
    independence: { freshFromArtifactBytes: true, priorStageCountsUsedAsEvidence: false },
    questionRows: [{
      qid: 1,
      sourceExact: { status: 'PASS', evidence: 'source' },
      answerMath: { status: 'PASS', evidence: 'solve' },
      solutionMath: { status: 'PASS', evidence: 'solve' },
      smallBoard: { status: 'PASS', evidence: 'blocks' },
      curriculum: { status: 'PASS', evidence: 'authority' },
      visualNecessity: { status: 'PASS', evidence: 'required' },
      meta: { status: 'PASS', evidence: 'resolver' },
      difficulty: { status: 'PASS', evidence: 'blind' },
      runtimeString: { status: 'PASS', evidence: 'runtime' },
    }],
    visualRows: [{
      qid: 1,
      assetPath: 'assets/images/test/q1.svg',
      assetSha256: hash(fs.readFileSync(assetFile)),
      expectedFacts: ['slope=1'],
      observedFacts: ['slope=1'],
      checks: [{ predicate: 'slope', expected: 1, observed: 1, result: 'PASS', method: 'COORDINATE_COMPUTE' }],
      result: 'PASS',
    }],
    metaRows: [{
      qid: 1,
      result: 'PASS',
      primaryMethod: 'line relation',
      decisiveStep: 'slope',
      rpmDisposition: 'RPM_SEMANTIC_FINAL',
      projectionDisposition: 'PROJECTION_REUSE',
      lookupRefs: ['resolver'],
      problemTypeKey: 'PT_LINE_RELATION',
      templateKey: 'TPL_RELATION',
    }],
    summary: {
      questionCount: 1,
      questionEvidenceRows: 1,
      linkedSolutionVisualCount: 1,
      visualEvidenceRows: 1,
      metaEvidenceRows: 1,
    },
  };
}

function run(examSource, ev) {
  fs.writeFileSync(examFile, examSource);
  const evidenceFile = path.join(root, 'evidence.json');
  fs.writeFileSync(evidenceFile, JSON.stringify(ev, null, 2));
  return validatePhysicalEvidence({ examFile, evidenceFile, stage: 'R3' });
}

let report = run(goodExam, evidence());
assert.equal(report.ok, true, JSON.stringify(report));

const layoutBad = goodExam.replace('ㄱ. 참\\n\\nㄴ. 거짓', 'ㄱ. 참. ㄴ. 거짓');
report = run(layoutBad, evidence(layoutBad));
assert.equal(report.ok, false);
assert(report.issues.some(x => x.startsWith('SMALLBOARD_ENUMERATION_FAIL')));

const visualBad = evidence();
visualBad.visualRows[0].checks[0].method = 'TEXT_LABEL_ONLY';
report = run(goodExam, visualBad);
assert.equal(report.ok, false);
assert(report.issues.some(x => x.startsWith('VISUAL_PHYSICAL_METHOD_MISSING')));

const metaExam = goodExam.replace(
  '"problemTypeKey":"PT_LINE_RELATION","templateKey":"TPL_RELATION"',
  '"problemTypeKey":null,"templateKey":null',
);
const metaBad = evidence(metaExam);
metaBad.metaRows[0] = {
  ...metaBad.metaRows[0],
  problemTypeKey: null,
  templateKey: null,
  projectionDisposition: 'EXACT_ACTIVE',
  nullReason: 'left null',
};
report = run(metaExam, metaBad);
assert.equal(report.ok, false);
assert(report.issues.some(x => x.startsWith('META_NULL_BUT_RESOLVABLE')));

console.log('review-evidence-gate.test.mjs PASS');
