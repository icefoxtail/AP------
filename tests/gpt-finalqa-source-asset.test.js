'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { inspectPlans, makeBlindPack, semanticFingerprint } = require('../tools/harness/verify-finalqa-evidence.cjs');

test('FIRST_FORMAL gate recognizes a source PNG without inventing an SVG plan', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gpt-finalqa-asset-'));
  const examRel = 'archive/exams/similar/sample.js';
  const assetPath = 'archive/assets/images/existing.png';
  const ledgerPath = path.join(root, 'archive/exams/similar/sample.svg-followup-ledger.json');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/mwAAAABJRU5ErkJggg==', 'base64');
  const blob = crypto.createHash('sha1').update('blob ' + png.length + '\0').update(png).digest('hex');
  const question = {
    id: 1, content: '그림 조건을 이용하시오.', choices: ['A', 'B'],
    answer: '①', solution: '그림 조건을 사용한다.',
    image: 'assets/images/existing.png',
  };
  try {
    fs.mkdirSync(path.dirname(path.join(root, assetPath)), { recursive: true });
    fs.mkdirSync(path.dirname(ledgerPath), { recursive: true });
    fs.writeFileSync(path.join(root, assetPath), png);
    fs.writeFileSync(ledgerPath, JSON.stringify({
      examUid: 'sample',
      axes: [
        { qid: 1, axis: 'problem', necessity: 'REQUIRED', reason: '기존 학생용 문제 그림을 그대로 사용',
          planStatus: 'EXISTING_SOURCE_ASSET_VERIFIED', assetPath, assetGitBlobSha1: blob },
        { qid: 1, axis: 'solution', necessity: 'EXEMPT', reason: '문자 풀이로 모든 계산을 재현할 수 있음',
          planStatus: 'EXEMPT' },
      ],
    }));
    const issues = [];
    const result = inspectPlans({ root, examRel, questions: [question], issues });
    assert.deepEqual(issues, []);
    assert.equal(result.assetBacked, 1);
    assert.equal(result.executable, 0);
    assert.equal(result.axes.get('1:problem').planDigest, crypto.createHash('sha256').update(png).digest('hex'));

    const blindFile = path.join(root, examRel);
    fs.writeFileSync(blindFile,
      'window.questionBank = [' + JSON.stringify(question) + '];');
    const pack = makeBlindPack({ root, examRel });
    assert.deepEqual(pack.questions[0].requiredProblemFigure, {
      status: 'SOURCE_ASSET', assetPath,
    });
    assert.equal(Object.hasOwn(pack.questions[0], 'answer'), false);
    assert.notEqual(semanticFingerprint(question),
      semanticFingerprint({ ...question, image: 'assets/images/different.png' }));

    fs.writeFileSync(path.join(root, assetPath), Buffer.concat([png, Buffer.from('changed')]));
    const changedIssues = [];
    inspectPlans({ root, examRel, questions: [question], issues: changedIssues });
    assert.ok(changedIssues.some(i => i.code === 'SOURCE_ASSET_BLOB_MISMATCH'));

    const unboundIssues = [];
    inspectPlans({ root, examRel, questions: [{ ...question, image: 'assets/images/other.png' }], issues: unboundIssues });
    assert.ok(unboundIssues.some(i => i.code === 'SOURCE_ASSET_NOT_REFERENCED_BY_QUESTION'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
