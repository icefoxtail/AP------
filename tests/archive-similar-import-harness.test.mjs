// 유사 시험지 가져오기 하네스: 후보 뽑기 → 판정 검사 → 검수 묶음 → 반영. 합성 2문항 시험지로 본다.
// 특정 RPM id·PT 키·개수를 고정하지 않는다 (후보에서 그때그때 고른다).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { convertSimilarExam } from '../archive/tools/similar-md-to-js.mjs';
import { buildCandidateSet } from '../archive/tools/similar-import/build-candidates.mjs';
import { checkJudgments, answerMatchesStored } from '../archive/tools/similar-import/check-judgment.mjs';
import { applyJudgments } from '../archive/tools/similar-import/apply-judgment.mjs';
import { buildReviewMarkdown } from '../archive/tools/similar-import/build-review-pack.mjs';
import { gitBlobSha1, readJson, writeJson, stripWs, loadCrosswalkRecords, loadCourseGroups, loadTermDictionary, loadTaxonomy, loadGuideExample, itemFingerprint, readBank, DEFAULT_REPO_ROOT } from '../archive/tools/similar-import/lib.mjs';
import { buildMd, hq1, hq2 } from './helpers/similar-md-fixture.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STEM = '99_하네스시험_1학기_중간_중2_유사';
const quiet = () => {};

function fresh() {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'sim-harness-'));
  const md = buildMd({ stem: STEM, questions: [hq1, hq2] });
  const mdPath = path.join(work, 'src.md');
  fs.writeFileSync(mdPath, md);
  const conv = convertSimilarExam({ mdContent: md, repoRoot, writeFiles: true, outDir: path.join(work, 'stage') });
  assert.equal(conv.validation.valid, true, conv.validation.errors.join('\n'));
  const jsPath = path.join(work, 'stage', `${STEM}.js`);
  const cand = buildCandidateSet({ jsPath, outDir: work, mdPath, repoRoot });
  return { work, mdPath, jsPath, cand, judgmentDir: path.join(work, 'judgment'), candDir: path.join(work, 'candidates'), cleanup: () => fs.rmSync(work, { recursive: true, force: true }) };
}

function pick(candDir) {
  const c = readJson(path.join(candDir, 'q01.json'));
  const unit = c.units.find(u => u.rpm.length && u.subUnits.length);
  assert.ok(unit, '후보 단원이 있어야 한다');
  const ptUnit = c.units.find(u => u.problemTypes.length);
  const pt = ptUnit?.problemTypes[0];
  return { unit, pt, tpl: pt?.templates[0] };
}

const review0 = () => ({ reviewerSolvedAnswer: '', verdict: '', fixes: [], note: '' });

function goodJudgments(candDir) {
  const { unit, pt, tpl } = pick(candDir);
  const fp = qid => { const c = readJson(path.join(candDir, `q${String(qid).padStart(2, '0')}.json`)); return itemFingerprint({ content: c.problem.content, choices: c.problem.choices, answer: c.reference.answer, solution: c.reference.solution }); };
  const j1 = {
    qid: 1, itemFingerprint: fp(1),
    solveSteps: ['양변에서 3 을 빼면 x=7-3 이다.', 'x=4 이므로 보기 ③ 4 가 답이다.'],
    solvedAnswer: '4', answerMatches: true, answerIssue: '',
    figureNeed: 'NONE', figureEvidence: '', solutionFigureNeed: 'NONE', solutionFigureEvidence: '',
    standardUnitKey: unit.standardUnitKey, subUnitKey: unit.subUnits[0].subUnitKey, unitEvidence: '방정식 $x+3=7$',
    rpmRecordId: unit.rpm[0].id, rpmReason: 'x+3=7 에서 양변에서 3 을 빼는 한 단계를 쓴다.',
    problemTypeKey: pt ? pt.problemTypeKey : 'NONE', templateKey: tpl ? tpl.templateKey : 'NONE',
    typeReason: 'x+3=7 에서 x=4 를 구하는 결정적 단계는 양변에서 3 을 빼는 것이다.',
    newKeyProposal: pt ? null : { key: 'PT_LINEAR_EQUATION_SOLVE', label: '일차방정식 풀이', why: '일차방정식의 해를 구하는 문항을 모은다.' },
    difficultyBucket: 1, difficultyConfidence: 'high', difficultyReason: 'x+3=7 을 푸는 한 단계 문항이다.', difficultyBoundaryFlag: 'NONE', format: '',
    slots: {
      given: [{ term: '방정식', src: 'stem', quote: '방정식 $x+3=7$' }],
      goal: [{ term: '해', src: 'stem', quote: '의 해는?' }],
      method: [{ term: '등식의성질', src: 'solution', quote: '등식의 성질로 양변에서', evidenceType: 'NAMED' }],
      condition: [],
    },
    slotReasons: {}, how: 'x+3=7 을 직접 풀어 x=4 를 얻고 보기 ③ 과 대조했다.', review: review0(),
  };
  const j2 = {
    qid: 2, itemFingerprint: fp(2),
    solveSteps: ['2x=12 의 양변을 2 로 나눈다.', 'x=12/2=6 이다.'],
    solvedAnswer: '6', answerMatches: true, answerIssue: '',
    figureNeed: 'NONE', figureEvidence: '', solutionFigureNeed: 'NONE', solutionFigureEvidence: '',
    standardUnitKey: unit.standardUnitKey, subUnitKey: unit.subUnits[0].subUnitKey, unitEvidence: '방정식 $2x=12$',
    rpmRecordId: unit.rpm[unit.rpm.length - 1].id, rpmReason: '2x=12 에서 12 를 2 로 나누는 풀이 단계에 해당한다.',
    problemTypeKey: 'NONE', templateKey: 'NONE',
    typeReason: '후보 유형 중 2x=12 처럼 계수로 나누어 12 에서 해를 구하는 것이 없어 NONE 으로 둔다.',
    newKeyProposal: { key: 'PT_LINEAR_EQUATION_SOLVE', label: '일차방정식 풀이', why: '일차방정식의 해를 구하는 문항을 모은다.' },
    difficultyBucket: 2, difficultyConfidence: 'medium', difficultyReason: '12 를 2 로 나누어 x=6 을 얻는 서답형이라 2단계로 본다.', difficultyBoundaryFlag: 'B12', format: '',
    slots: {
      given: [{ term: '방정식', src: 'stem', quote: '방정식 $2x=12$' }],
      goal: [{ term: '해', src: 'stem', quote: '해를 구하시오' }],
      method: [{ term: '등식의성질', src: 'solution', quote: '등식의 성질로 양변을', evidenceType: 'NAMED' }],
      condition: [],
    },
    slotReasons: {}, how: '2x=12 를 직접 풀어 x=6 을 얻고 저장 정답 6 과 같음을 확인했다. 12 를 2 로 나눈다.', review: review0(),
  };
  return { 1: j1, 2: j2 };
}
const writeJudgments = (dir, js) => { for (const j of Object.values(js)) writeJson(path.join(dir, `q${String(j.qid).padStart(2, '0')}.json`), j); };
const withReview = (js, patch = {}) => {
  const out = JSON.parse(JSON.stringify(js));
  out[1].review = { reviewerSolvedAnswer: '③', verdict: 'PASS', fixes: [], note: '직접 풀어 확인' };
  out[2].review = { reviewerSolvedAnswer: '6', verdict: 'PASS', fixes: [], note: '직접 풀어 확인' };
  for (const [q, r] of Object.entries(patch)) out[q].review = { ...out[q].review, ...r };
  return out;
};
const codesOf = (r, qid) => r.items.find(x => x.qid === qid).codes.map(c => c.code);
const check = (ctx, only = null) => checkJudgments({ jsPath: ctx.jsPath, judgmentDir: ctx.judgmentDir, only, repoRoot });
const loadBank = file => {
  const c = { window: {} };
  vm.createContext(c);
  new vm.Script(fs.readFileSync(file, 'utf8')).runInContext(c);
  return JSON.parse(JSON.stringify(c.window.questionBank));
};

test('build-candidates: 과목·교육과정으로 거른 후보, 원문 인용, 빈 판정 틀', () => {
  const ctx = fresh();
  try {
    assert.deepEqual(ctx.cand.courses, ['MIDDLE2']);
    const c = readJson(path.join(ctx.candDir, 'q01.json'));
    assert.deepEqual(Object.keys(c).slice(0, 5), ['qid', 'questionType', 'course', 'curriculum', 'problem']);
    assert.equal(c.reference.answer, '③');
    assert.ok(c.units.length > 0);
    // RPM 후보는 모두 같은 교육과정·같은 과목의 행이어야 한다
    const members = new Set(loadCourseGroups(repoRoot).find(g => g.id === 'MIDDLE2').members);
    const rows = new Map(loadCrosswalkRecords(repoRoot).map(r => [r.id, r]));
    for (const u of c.units) for (const r of u.rpm) {
      const row = rows.get(r.id);
      assert.equal(String(row.curriculum), '2022');
      assert.ok(members.has(row.scope) || members.has(row.standardCourse));
      assert.equal(row.standardUnitKey, u.standardUnitKey);
    }
    for (const u of c.units) assert.ok(u.standardUnitKey.startsWith('M2-'));
    // 사전 용어 인용은 원문에 그대로 있다
    const dict = loadTermDictionary(repoRoot);
    assert.ok(c.termCandidates.some(t => t.term === '방정식'));
    for (const t of c.termCandidates) {
      const text = { stem: c.problem.content, choices: c.problem.choices.join('\n'), solution: c.reference.solution }[t.src];
      assert.ok(stripWs(text).includes(stripWs(t.quote)), `${t.term}: ${t.quote}`);
      assert.ok(dict.byName.has(stripWs(t.term)));
    }
    assert.equal(c.source.standardUnitKey, 'M2-01');
    assert.equal('primaryMethod' in c.source || 'decisiveStep' in c.source, false, '풀기 전에 보는 source 구역에 풀이 요약이 없다');
    assert.ok(c.reference.sourcePrimaryMethod && c.reference.sourceDecisiveStep);
    // 빈 판정 틀이 있고, 다시 돌려도 작성 중인 판정을 덮어쓰지 않는다
    const jf = path.join(ctx.judgmentDir, 'q01.json');
    assert.equal(readJson(jf).solveSteps.length, 0);
    writeJson(jf, { ...readJson(jf), how: '작성 중' });
    const again = buildCandidateSet({ jsPath: ctx.jsPath, outDir: ctx.work, repoRoot });
    assert.deepEqual(again.keptExistingJudgments, [1, 2]);
    assert.equal(readJson(jf).how, '작성 중');
    assert.equal(readJson(path.join(ctx.judgmentDir, 'q02.json')).qid, 2);
  } finally { ctx.cleanup(); }
});

test('check-judgment: 빈 틀은 문항마다 실패하고 채운 판정은 통과한다', () => {
  const ctx = fresh();
  try {
    const empty = check(ctx);
    assert.equal(empty.anyCode, true);
    assert.ok(codesOf(empty, 1).includes('FIELD_EMPTY'));
    assert.ok(codesOf(empty, 1).includes('SOLVE_TOO_SHORT'));
    writeJudgments(ctx.judgmentDir, goodJudgments(ctx.candDir));
    const ok = check(ctx);
    assert.deepEqual(ok.items.flatMap(i => i.codes), [], JSON.stringify(ok.items));
    assert.equal(ok.releasable, true);
    assert.equal(ok.summary.pass, 2);
  } finally { ctx.cleanup(); }
});

test('check-judgment: 일부러 틀리게 채운 5종이 각각 해당 코드로 걸린다', () => {
  const ctx = fresh();
  try {
    const mutate = fn => { const js = goodJudgments(ctx.candDir); fn(js); writeJudgments(ctx.judgmentDir, js); return check(ctx); };

    let r = mutate(js => { js[1].slots.given[0].quote = '방정식 $x+3=8$'; });
    assert.ok(codesOf(r, 1).includes('QUOTE_NOT_SUBSTRING'), '인용 조작');

    r = mutate(js => { js[1].solvedAnswer = '5'; });
    assert.ok(codesOf(r, 1).includes('ANSWER_MISMATCH'), '답 불일치(answerMatches 는 true 그대로)');
    r = mutate(js => { js[1].solvedAnswer = '③'; js[2].solvedAnswer = '$6$'; });
    assert.deepEqual(r.items.flatMap(i => i.codes), [], '번호·값·$ 표기 차이는 허용');

    r = mutate(js => { js[1].rpmRecordId = 'ZZ-RPM-9999'; });
    assert.ok(codesOf(r, 1).includes('KEY_NOT_IN_CANDIDATES'), '후보 밖 키');
    r = mutate(js => { js[1].standardUnitKey = 'M3-01'; });
    assert.ok(codesOf(r, 1).includes('KEY_NOT_IN_CANDIDATES'), '다른 과목 단원');

    r = mutate(js => { js[2].how = js[1].how; js[2].difficultyReason = js[1].difficultyReason; });
    assert.ok(codesOf(r, 2).includes('REASON_DUPLICATE'), '문장 복사');
    assert.ok(codesOf(r, 1).includes('REASON_DUPLICATE'));

    r = mutate(js => { js[1].standardUnitKey = ''; });
    assert.ok(codesOf(r, 1).includes('FIELD_EMPTY'), '빈 칸');

    // 그 밖의 코드
    r = mutate(js => { js[1].how = '정말 열심히 읽고 신중하게 판정했습니다 아주 자세하게요'; });
    assert.ok(codesOf(r, 1).includes('REASON_NO_ITEM_TOKEN'));
    r = mutate(js => { js[1].solveSteps = ['x=4 이다.']; });
    assert.ok(codesOf(r, 1).includes('SOLVE_TOO_SHORT'));
    r = mutate(js => { js[1].slots.given[0].term = '없는용어xyz'; });
    assert.ok(codesOf(r, 1).includes('TERM_NOT_IN_DICT'));
    r = mutate(js => { js[1].slots.given.push({ term: '방정식', src: 'stem', quote: '방정식 $x+3=7$' }); });
    assert.ok(codesOf(r, 1).includes('TERM_DUPLICATE_IN_SLOT'));
    r = mutate(js => { js[1].how = 'x=4 \t 를 구했다 탭이 섞였다 x+3=7'; });
    assert.ok(codesOf(r, 1).includes('CTRL_CHAR'));
    r = mutate(js => { js[1].slots.method[0].evidenceType = 'IMPLIED'; });
    assert.ok(codesOf(r, 1).includes('FIELD_EMPTY'), 'IMPLIED 는 justification 필요');
    r = mutate(js => { js[1].problemTypeKey = 'NONE'; js[1].templateKey = 'NONE'; js[1].newKeyProposal = null; });
    assert.ok(codesOf(r, 1).includes('FIELD_EMPTY'), 'PT NONE 이면 newKeyProposal 필요');
    // 시험지 전체가 같은 값
    const js = goodJudgments(ctx.candDir);
    assert.equal(check(ctx).examCodes.length, 0);
  } finally { ctx.cleanup(); }
});

test('check-judgment: answerMatches=false 는 answerIssue 가 있어야 하고 시험지는 보류(FAIL 이 아님)', () => {
  const ctx = fresh();
  try {
    const js = goodJudgments(ctx.candDir);
    js[1].solvedAnswer = '5'; js[1].answerMatches = false;
    writeJudgments(ctx.judgmentDir, js);
    let r = check(ctx);
    assert.ok(codesOf(r, 1).includes('FIELD_EMPTY'));
    js[1].answerIssue = 'x+3=7 이면 x=4 인데 저장 정답은 보기 ④ 5 이다.';
    writeJudgments(ctx.judgmentDir, js);
    r = check(ctx);
    assert.deepEqual(codesOf(r, 1), ['ANSWER_MISMATCH']);
    assert.equal(r.items[0].verdict, 'HOLD');
    assert.equal(r.releasable, false);
  } finally { ctx.cleanup(); }
});

test('FIGURE_MISSING: NEEDS_FIGURE 인데 image 가 없으면 시험지를 내보내지 않고 HOLD.md 에 적는다', () => {
  const ctx = fresh();
  try {
    const js = goodJudgments(ctx.candDir);
    js[2].figureNeed = 'NEEDS_FIGURE';
    js[2].figureEvidence = '방정식 $2x=12$';
    writeJudgments(ctx.judgmentDir, js);
    const r = check(ctx);
    assert.deepEqual(codesOf(r, 2), ['FIGURE_MISSING']);
    const out = path.join(ctx.work, 'out');
    const holdFile = path.join(ctx.work, 'HOLD.md');
    const statusFile = path.join(ctx.work, 'STATUS.tsv');
    const ap = applyJudgments({ jsPath: ctx.jsPath, judgmentDir: ctx.judgmentDir, outDir: out, holdFile, statusFile, repoRoot, log: quiet });
    assert.equal(ap.written, false);
    assert.equal(ap.exitCode, 3);
    assert.equal(fs.existsSync(out), false, '그 문항만 빼지 않고 시험지 전체를 내보내지 않는다');
    assert.match(fs.readFileSync(holdFile, 'utf8'), /FIGURE_MISSING/);
    assert.match(fs.readFileSync(statusFile, 'utf8'), /\tHOLD\t/);
  } finally { ctx.cleanup(); }
});

test('apply-judgment: 검수 기록이 없으면 review_required, 영수증 없음. 본보기 형식과 해시가 맞는다', () => {
  const ctx = fresh();
  try {
    writeJudgments(ctx.judgmentDir, goodJudgments(ctx.candDir));
    const out = path.join(ctx.work, 'out');
    const statusFile = path.join(ctx.work, 'STATUS.tsv');
    const ap = applyJudgments({ jsPath: ctx.jsPath, judgmentDir: ctx.judgmentDir, outDir: out, statusFile, repoRoot, log: quiet });
    assert.equal(ap.written, true);
    assert.equal(ap.receipt, false);
    assert.equal(ap.reviewStatus, 'review_required');
    assert.equal(fs.existsSync(path.join(out, `${STEM}.review-receipt.json`)), false);

    const jsFile = path.join(out, `${STEM}.js`);
    const bank = loadBank(jsFile);
    const j = goodJudgments(ctx.candDir);
    assert.equal(bank[0].standardUnitKey, j[1].standardUnitKey);
    assert.equal(bank[0].subUnitKey, j[1].subUnitKey);
    assert.equal(bank[0].category, bank[0].subUnit);
    assert.deepEqual(bank[0].tags, ['객관식', bank[0].subUnit]);
    assert.equal(bank[0].rpmPrimaryRecordId, j[1].rpmRecordId);
    for (const b of bank) for (const k of ['originalCategory', 'rpmPrimaryL1', 'rpmPrimaryL2', 'rpmPrimaryL3', 'rpmPrimaryL4']) assert.equal(k in b, false, `사본 ${k} 를 쓰지 않는다`);
    assert.equal(bank[1].problemTypeKey, '');
    assert.equal(bank[1].difficultyBucket, 2);
    assert.equal(bank[0].content, hq1.content, '수학 내용은 그대로');
    for (const b of bank) assert.equal('level' in b, false, '하/중/상 칸은 산출물에 없다');
    // 키 순서는 변환기가 만든 본보기 순서를 따른다
    assert.equal(Object.keys(bank[0])[0], 'id');
    assert.ok(Object.keys(bank[0]).indexOf('rpmPrimaryRecordId') > Object.keys(bank[0]).indexOf('integrationPattern'));

    const metaFile = fs.readdirSync(out).find(f => /\.meta-q01-q02\.json$/.test(f));
    const reg = readJson(path.join(out, metaFile));
    assert.equal(reg.expectedSourceBlobSha1, gitBlobSha1(fs.readFileSync(jsFile)));
    assert.equal(reg.expectedSourceBlobSha1, execFileSync('git', ['hash-object', jsFile]).toString().trim());
    assert.equal(reg.approval.reviewStatus, 'review_required');
    assert.equal(reg.approval.reviewPassCount, 0);
    assert.equal(new Set(reg.items.map(i => i.questionUid)).size, 2);
    assert.match(reg.items[0].reason, /DRAFT_SINGLE_MODEL/);
    assert.equal(reg.items[1].after.metaRationale.draftTier, 'SINGLE_MODEL_DRAFT');
    assert.match(reg.items[1].reason, /PROPOSAL/);
    // 검수자가 손으로 붙이던 필수 필드를 도구가 만든다
    for (const [i, it] of reg.items.entries()) {
      assert.equal('level' in it.after, false);
      assert.equal('levelBasis' in it.after, false);
      assert.equal(it.after.difficultyBoundaryFlag, i === 0 ? 'NONE' : 'B12');
      for (const k of ['difficultyConfidence', 'difficultyBoundaryFlag', 'difficultyReason', 'ptTplCandidate']) assert.equal(k in it, false, `항목 위 사본 ${k} 를 쓰지 않는다`);
      for (const k of ['difficultyBasis', 'rpmPrimary', 'rpmPrimaryRecordIds', 'rpmPrimaryL1', 'rpmPrimaryL2', 'rpmPrimaryL3', 'rpmPrimaryL4']) assert.equal(k in it.after, false, `after 사본 ${k} 를 쓰지 않는다`);
      assert.equal(it.after.rpmPrimaryRecordId, j[i + 1].rpmRecordId);
      assert.equal(it.after.visualNecessity.problem, 'EXEMPT');
      assert.ok(it.after.visualNecessity.problemReason);
      assert.equal(it.after.visualNecessity.solution, 'EXEMPT');
      assert.ok(it.after.visualNecessity.solutionReason);
      assert.equal(it.after.metaRationale.crossConcept, 'NONE: 원천 마크다운 값, 재판정 안 함');
      assert.equal(it.after.metaRationale.integration, 'NONE: 원천 마크다운 값, 재판정 안 함');
      assert.match(it.after.metaRationale.condition, /^NONE:/);
      assert.equal(it.after.provenance.kind, 'SIMILAR_FROM_ORIGINAL');
      assert.equal(it.after.provenance.sourceExam, STEM.replace('_유사', '_기출'));
      assert.equal(it.after.provenance.sourceQid, i + 1);
      assert.equal(it.after.provenance.createdAt, '2026-11-18');
      assert.equal('generator' in it.after.provenance, false);
      assert.equal('variationNote' in it.after.provenance, false);
    }
    assert.deepEqual(reg.registryChanges, [], '새 키 제안은 registryChanges 로 만들지 않는다');

    const fs4 = readJson(path.join(out, `${STEM}.4slot.json`));
    assert.equal(fs4.schemaVersion, 'archive-meta-4slot-v0');
    assert.equal(fs4.sourceGitBlobSha, reg.expectedSourceBlobSha1);
    assert.equal(fs4.dictionaryVersion, loadTermDictionary(repoRoot).version);
    assert.equal(fs4.items.length, 2);
    assert.equal(fs4.items[0].format, '단일 정답');
    assert.equal(fs4.items[1].format, '단답');
    assert.equal(fs4.items[0].review.status, 'UNREVIEWED');
    assert.match(fs.readFileSync(statusFile, 'utf8'), /\tJUDGED\t/);
  } finally { ctx.cleanup(); }
});

test('apply-judgment: 모든 문항에 검수 기록이 있고 HOLD 0이면 영수증을 만들고 reviewStatus 를 올린다', () => {
  const ctx = fresh();
  try {
    writeJudgments(ctx.judgmentDir, withReview(goodJudgments(ctx.candDir)));
    const out = path.join(ctx.work, 'out');
    const statusFile = path.join(ctx.work, 'STATUS.tsv');
    const ap = applyJudgments({ jsPath: ctx.jsPath, judgmentDir: ctx.judgmentDir, outDir: out, statusFile, reviewer: 'tester', repoRoot, log: quiet });
    assert.equal(ap.written, true);
    assert.equal(ap.receipt, true);
    assert.equal(ap.reviewStatus, 'independent_review_passed');
    const receipt = readJson(path.join(out, `${STEM}.review-receipt.json`));
    assert.equal(receipt.schemaVersion, 'archive-independent-exam-review-receipt-v1');
    assert.equal(receipt.overallVerdict, 'PASS');
    assert.equal(receipt.blindFirstPass.totalSolved, 2);
    assert.equal(receipt.blindFirstPass.answerMismatches, 0);
    assert.equal(receipt.questionsReview.length, 2);
    assert.equal(receipt.candidateGitBlobSha1, gitBlobSha1(fs.readFileSync(path.join(out, `${STEM}.js`))));
    const reg = readJson(path.join(out, fs.readdirSync(out).find(f => /\.meta-q01-q02\.json$/.test(f))));
    assert.equal(reg.approval.reviewStatus, 'independent_review_passed');
    assert.equal(reg.approval.reviewPassCount, 1);
    const lines = fs.readFileSync(statusFile, 'utf8').trim().split('\n');
    assert.match(lines.at(-1), /\tREADY\t/);
  } finally { ctx.cleanup(); }
});

test('apply-judgment: HOLD 1건 / 검수 누락 / 풀이 답 비어 있음이면 영수증을 만들지 않는다 (가짜 통과 금지)', () => {
  const cases = [
    ['HOLD 1건', js => withReview(js, { 2: { verdict: 'HOLD', note: '정답 근거가 의심스러움' } })],
    ['검수 기록 없음 1문항', js => { const o = withReview(js); o[2].review.verdict = ''; return o; }],
    ['검수자 풀이 답이 빈 문항', js => withReview(js, { 2: { reviewerSolvedAnswer: '' } })],
  ];
  for (const [name, make] of cases) {
    const ctx = fresh();
    try {
      writeJudgments(ctx.judgmentDir, make(goodJudgments(ctx.candDir)));
      const out = path.join(ctx.work, 'out');
      const ap = applyJudgments({ jsPath: ctx.jsPath, judgmentDir: ctx.judgmentDir, outDir: out, statusFile: path.join(ctx.work, 's.tsv'), repoRoot, log: quiet });
      assert.equal(ap.written, true, name);
      assert.equal(ap.receipt, false, name);
      assert.equal(ap.reviewStatus, 'review_required', name);
      assert.equal(fs.existsSync(path.join(out, `${STEM}.review-receipt.json`)), false, name);
      assert.match(fs.readFileSync(path.join(ctx.work, 's.tsv'), 'utf8'), /\tJUDGED\t/, name);
    } finally { ctx.cleanup(); }
  }
});

test('apply-judgment: --only 반영은 일부 문항만 바꾸고 영수증은 출고 근거가 아닌 PARTIAL 표시', () => {
  const ctx = fresh();
  try {
    writeJudgments(ctx.judgmentDir, withReview(goodJudgments(ctx.candDir)));
    const out = path.join(ctx.work, 'out');
    const ap = applyJudgments({ jsPath: ctx.jsPath, judgmentDir: ctx.judgmentDir, outDir: out, only: [1], partialReceipt: true, repoRoot, log: quiet });
    assert.equal(ap.partial, true);
    assert.deepEqual(ap.appliedQids, [1]);
    const bank = loadBank(path.join(out, `${STEM}.js`));
    assert.equal(bank[0].difficultyBucket, 1);
    assert.equal(bank[1].difficultyBucket, 2, '반영 대상이 아닌 문항은 변환기 값 그대로');
    assert.equal('level' in bank[0], false);
    const receipt = readJson(path.join(out, `${STEM}.review-receipt.json`));
    assert.equal(receipt.overallVerdict, 'PARTIAL');
    assert.equal(receipt.signOffStatus, 'PARTIAL_NOT_FOR_RELEASE');
    assert.equal(ap.reviewStatus, 'review_required');
  } finally { ctx.cleanup(); }
});

test('apply-judgment: 검사에 실패하면 아무것도 쓰지 않는다', () => {
  const ctx = fresh();
  try {
    const js = goodJudgments(ctx.candDir);
    js[1].rpmRecordId = 'ZZ-RPM-9999';
    writeJudgments(ctx.judgmentDir, js);
    const out = path.join(ctx.work, 'out');
    const ap = applyJudgments({ jsPath: ctx.jsPath, judgmentDir: ctx.judgmentDir, outDir: out, repoRoot, log: quiet });
    assert.equal(ap.written, false);
    assert.equal(ap.exitCode, 1);
    assert.equal(fs.existsSync(out), false);
  } finally { ctx.cleanup(); }
});

test('검수 기록 점검: 풀이 답 불일치인데 PASS, 고친 값이 반영되지 않은 FIXED 는 코드가 난다', () => {
  const ctx = fresh();
  try {
    let js = withReview(goodJudgments(ctx.candDir), { 1: { reviewerSolvedAnswer: '④' } });
    writeJudgments(ctx.judgmentDir, js);
    assert.ok(codesOf(check(ctx), 1).includes('REVIEW_ANSWER_MISMATCH'));
    js = withReview(goodJudgments(ctx.candDir), { 1: { verdict: 'HOLD', reviewerSolvedAnswer: '④', note: '정답이 의심스럽다' } });
    writeJudgments(ctx.judgmentDir, js);
    assert.deepEqual(codesOf(check(ctx), 1), [], 'HOLD 이면 불일치를 그대로 기록할 수 있다');
    js = withReview(goodJudgments(ctx.candDir), { 2: { verdict: 'FIXED', fixes: [{ field: 'difficultyBucket', from: 2, to: 3, why: '단계가 더 많다' }] } });
    writeJudgments(ctx.judgmentDir, js);
    assert.ok(codesOf(check(ctx), 2).includes('REVIEW_FIX_NOT_APPLIED'));
    js[2].difficultyBucket = 3;
    js[2].difficultyBoundaryFlag = 'B23';
    writeJudgments(ctx.judgmentDir, js);
    assert.deepEqual(codesOf(check(ctx), 2), []);
  } finally { ctx.cleanup(); }
});

test('build-review-pack: 먼저 볼 문항을 자동으로 뽑고 원천→판정을 표시한다', () => {
  const ctx = fresh();
  try {
    const js = goodJudgments(ctx.candDir);
    js[1].solveSteps = ['양변에서 3 을 뺀다.', '풀이를 끝낸다.']; // 정답 값 4 가 풀이에 없음
    js[2].figureNeed = 'NEEDS_FIGURE';
    js[2].figureEvidence = '방정식 $2x=12$';
    js[2].difficultyConfidence = 'low';
    js[2].typeReason = '12 로 나눈다';                                  // 20자 미만
    writeJudgments(ctx.judgmentDir, js);
    const r = buildReviewMarkdown({ jsPath: ctx.jsPath, judgmentDir: ctx.judgmentDir, repoRoot });
    const top = r.markdown.split('## Q1')[0];
    assert.match(top, /먼저 볼 문항/);
    assert.match(top, /\*\*Q1\*\*: .*풀이 과정에 정답 값이 등장하지 않음/);
    const q2line = top.split('\n').find(l => l.startsWith('- **Q2**'));
    assert.match(q2line, /NEEDS_FIGURE/);
    assert.match(q2line, /이유가 20자 미만/);
    assert.match(q2line, /난이도 경계/);
    assert.match(q2line, /새 키 제안/);
    assert.match(r.markdown, /원천→판정/);
    assert.match(r.markdown, /저장 정답\*\* ③/);
    assert.match(r.markdown, /reviewerSolvedAnswer/);
    assert.match(r.status, /^(CONVERTED|JUDGED)/);
    // 검수가 끝나면 단계가 REVIEWED 로 보인다
    const clean = withReview(goodJudgments(ctx.candDir));
    writeJudgments(ctx.judgmentDir, clean);
    assert.match(buildReviewMarkdown({ jsPath: ctx.jsPath, judgmentDir: ctx.judgmentDir, repoRoot }).status, /^REVIEWED/);
  } finally { ctx.cleanup(); }
});

test('CLI: check-judgment 은 실패 코드가 있으면 종료 1, 없으면 0 이고 단계를 STATUS.tsv 에 남긴다', () => {
  const ctx = fresh();
  try {
    const cli = path.join(repoRoot, 'archive/tools/similar-import/check-judgment.mjs');
    const statusFile = path.join(ctx.work, 'STATUS.tsv');
    const bad = spawnSync(process.execPath, [cli, ctx.jsPath, ctx.judgmentDir, '--status-file', statusFile], { encoding: 'utf8' });
    assert.equal(bad.status, 1);
    assert.match(bad.stdout, /FIELD_EMPTY/);
    writeJudgments(ctx.judgmentDir, goodJudgments(ctx.candDir));
    const good = spawnSync(process.execPath, [cli, ctx.jsPath, ctx.judgmentDir, '--status-file', statusFile], { encoding: 'utf8' });
    assert.equal(good.status, 0, good.stdout + good.stderr);
    assert.match(good.stdout, /출고 가능/);
    const lines = fs.readFileSync(statusFile, 'utf8').trim().split('\n');
    assert.match(lines[0], /\tCONVERTED\t/);
    assert.match(lines.at(-1), /\tJUDGED\t/);
  } finally { ctx.cleanup(); }
});

test('build-candidates: 문항 주 단원의 등록된 ACTIVE 유형이 교육과정과 상관없이 모두 후보에 들어간다 (누락 0)', () => {
  const ctx = fresh();
  try {
    const c = readJson(path.join(ctx.candDir, 'q01.json'));
    const members = new Set(loadCourseGroups(repoRoot).find(g => g.id === 'MIDDLE2').members);
    const tax = loadTaxonomy(repoRoot);
    const unitKeys = new Set([c.source.standardUnitKey]); // 문항의 주 단원은 등록부의 유형 전부를 보인다
    assert.ok(unitKeys.has('M2-01'));
    const have = new Set(c.units.flatMap(u => u.problemTypes.map(p => `${u.standardUnitKey}|${p.problemTypeKey}`)));
    const missing = [];
    for (const b of tax.bindings) {
      if (b.status !== 'ACTIVE' || !b.problemTypeKey || !members.has(b.standardCourse) || !unitKeys.has(b.standardUnitKey)) continue;
      if (tax.pts.get(b.problemTypeKey)?.status !== 'ACTIVE') continue;
      if (!have.has(`${b.standardUnitKey}|${b.problemTypeKey}`)) missing.push(`${b.standardUnitKey}|${b.problemTypeKey}`);
    }
    assert.deepEqual(missing, []);
    // 후보 TPL 은 모두 상위 PT 아래에 있다
    for (const u of c.units) for (const p of u.problemTypes) for (const tp of p.templates) assert.equal(tax.tpls.get(tp.templateKey).parentProblemTypeKey, p.problemTypeKey);
  } finally { ctx.cleanup(); }
});

test('build-candidates: 원본 기출이 있으면 같은 번호 문항의 PT/TPL 을 sourceExamHint 로 주고 그 키는 후보에도 있다', () => {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'sim-hint-'));
  try {
    const stem = '26_팔마중_2학기_중간_중2_유사';
    const origRel = 'archive/exams/original/middle/m2/2mid/26_팔마중_2학기_중간_중2_기출.js';
    if (!fs.existsSync(path.join(repoRoot, origRel))) return; // 원본이 저장소에 없으면 건너뛴다
    const orig = readBank(path.join(repoRoot, origRel)).bank;
    const md = buildMd({ stem, questions: [hq1, hq2], sourceDir: 'original/middle/m2/2mid' });
    const mdPath = path.join(work, 'src.md');
    fs.writeFileSync(mdPath, md);
    const conv = convertSimilarExam({ mdContent: md, repoRoot, writeFiles: true, outDir: path.join(work, 'stage') });
    assert.equal(conv.validation.valid, true, conv.validation.errors.join('\n'));
    buildCandidateSet({ jsPath: path.join(work, 'stage', `${stem}.js`), outDir: work, mdPath, repoRoot });
    for (const qid of [1, 2]) {
      const c = readJson(path.join(work, 'candidates', `q0${qid}.json`));
      const o = orig.find(x => x.id === qid);
      if (!o.problemTypeKey) { assert.equal(c.sourceExamHint, null); continue; }
      assert.equal(c.sourceExamHint.exam, origRel);
      assert.equal(c.sourceExamHint.sourceQid, qid);
      assert.equal(c.sourceExamHint.problemTypeKey, o.problemTypeKey);
      const pt = c.units.flatMap(u => u.problemTypes).find(p => p.problemTypeKey === o.problemTypeKey);
      assert.ok(pt, '힌트 유형은 후보 안에 있어야 한다');
      if (c.sourceExamHint.templateKey) assert.ok(pt.templates.some(tp => tp.templateKey === c.sourceExamHint.templateKey));
    }
  } finally { fs.rmSync(work, { recursive: true, force: true }); }
});

test('build-candidates: 새 틀에는 값이 없고 하/중/상 칸이 없다 (문항 지문과 경계 칸만 있다)', () => {
  const ctx = fresh();
  try {
    const j = readJson(path.join(ctx.judgmentDir, 'q01.json'));
    assert.equal('level' in j, false);
    assert.equal(j.difficultyBoundaryFlag, '');
    assert.equal(j.problemTypeKey, '');
    assert.equal(j.how, '');
    assert.match(j.itemFingerprint, /^[0-9a-f]{16}$/);
    assert.equal('level' in readJson(path.join(ctx.candDir, 'q01.json')).source, false);
  } finally { ctx.cleanup(); }
});

test('check-judgment: 가이드 예시 글 그대로, 다른 문항의 틀, 지문이 바뀐 뒤의 판정은 STALE_OR_EXAMPLE', () => {
  const ctx = fresh();
  try {
    const example = loadGuideExample();
    assert.ok(example.how && example.typeReason);
    const mutate = fn => { const js = goodJudgments(ctx.candDir); fn(js); writeJudgments(ctx.judgmentDir, js); return check(ctx); };
    let r = mutate(js => { js[1].typeReason = example.typeReason; });
    assert.ok(codesOf(r, 1).includes('STALE_OR_EXAMPLE'), '예시 글 그대로');
    r = mutate(js => { js[1].itemFingerprint = js[2].itemFingerprint; });
    assert.ok(codesOf(r, 1).includes('STALE_OR_EXAMPLE'), '다른 문항의 틀');
    r = mutate(js => { delete js[2].itemFingerprint; });
    assert.ok(codesOf(r, 2).includes('STALE_OR_EXAMPLE'), '지문 표시 없음');
    r = mutate(() => {});
    assert.deepEqual(r.items.flatMap(i => i.codes), []);
    // 시험지 JS 의 문항이 바뀌면 같은 판정이라도 걸린다 (후보는 새로 만들고, 있는 판정 틀은 그대로 둔다)
    const jsText = fs.readFileSync(ctx.jsPath, 'utf8');
    fs.writeFileSync(ctx.jsPath, jsText.replace('방정식 $x+3=7$ 의 해는?', '방정식 $x+3=9$ 의 해는?'));
    buildCandidateSet({ jsPath: ctx.jsPath, outDir: ctx.work, repoRoot });
    r = check(ctx);
    assert.ok(codesOf(r, 1).includes('STALE_OR_EXAMPLE'), '지문이 바뀐 뒤');
    assert.ok(!codesOf(r, 2).includes('STALE_OR_EXAMPLE'));
  } finally { ctx.cleanup(); }
});

test('check-judgment: 경계 플래그는 목록 안의 값이고, Bxy 는 난이도가 x 또는 y 일 때만', () => {
  const ctx = fresh();
  try {
    const mutate = fn => { const js = goodJudgments(ctx.candDir); fn(js); writeJudgments(ctx.judgmentDir, js); return check(ctx); };
    let r = mutate(js => { js[1].difficultyBoundaryFlag = ''; });
    assert.ok(codesOf(r, 1).includes('FIELD_EMPTY'));
    r = mutate(js => { js[1].difficultyBoundaryFlag = 'B23'; }); // 난이도 1
    assert.ok(codesOf(r, 1).includes('FIELD_EMPTY'));
    r = mutate(js => { js[1].difficultyBoundaryFlag = 'B12'; });
    assert.deepEqual(codesOf(r, 1), []);
  } finally { ctx.cleanup(); }
});

test('apply-judgment: SELF_CONTAINED 그림 판단과 Condition 칸은 판정 기록에서 근거 문장을 만든다', () => {
  const ctx = fresh();
  try {
    const js = goodJudgments(ctx.candDir);
    js[2].figureNeed = 'SELF_CONTAINED';
    js[2].figureEvidence = '방정식 $2x=12$';
    js[2].slots.condition = [{ term: '방정식', src: 'stem', quote: '방정식 $2x=12$' }];
    js[2].slotReasons = { condition: '2x=12 가 해를 정한다' };
    writeJudgments(ctx.judgmentDir, js);
    const out = path.join(ctx.work, 'out');
    const ap = applyJudgments({ jsPath: ctx.jsPath, judgmentDir: ctx.judgmentDir, outDir: out, repoRoot, log: quiet });
    assert.equal(ap.written, true, JSON.stringify(ap.check?.items));
    const reg = readJson(path.join(out, fs.readdirSync(out).find(f => /\.meta-q01-q02\.json$/.test(f))));
    assert.match(reg.items[1].after.visualNecessity.problemReason, /방정식 \$2x=12\$/);
    assert.match(reg.items[1].after.metaRationale.condition, /^NONE: .*방정식/);
  } finally { ctx.cleanup(); }
});

test('check-judgment: 해설 그림 칸은 NONE|NEEDS_FIGURE 이고 NEEDS_FIGURE 는 해설 인용이 있어야 하며 시험지를 보류하지 않는다', () => {
  const ctx = fresh();
  try {
    const mutate = fn => { const js = goodJudgments(ctx.candDir); fn(js); writeJudgments(ctx.judgmentDir, js); return check(ctx); };
    let r = mutate(js => { js[1].solutionFigureNeed = ''; });
    assert.ok(codesOf(r, 1).includes('FIELD_EMPTY'));
    r = mutate(js => { js[1].solutionFigureNeed = 'NEEDS_FIGURE'; });
    assert.ok(codesOf(r, 1).includes('FIELD_EMPTY'), '인용 없음');
    r = mutate(js => { js[1].solutionFigureNeed = 'NEEDS_FIGURE'; js[1].solutionFigureEvidence = '해설에 없는 구절입니다'; });
    assert.ok(codesOf(r, 1).includes('QUOTE_NOT_SUBSTRING'));
    r = mutate(js => { js[1].solutionFigureNeed = 'NEEDS_FIGURE'; js[1].solutionFigureEvidence = '등식의 성질로 양변에서'; });
    assert.deepEqual(codesOf(r, 1), []);
    assert.equal(r.releasable, true);
    const out = path.join(ctx.work, 'out');
    const ap = applyJudgments({ jsPath: ctx.jsPath, judgmentDir: ctx.judgmentDir, outDir: out, repoRoot, log: quiet });
    assert.equal(ap.written, true);
    const reg = readJson(path.join(out, fs.readdirSync(out).find(f => /\.meta-q01-q02\.json$/.test(f))));
    assert.equal(reg.items[0].after.visualNecessity.solution, 'REQUIRED');
    assert.match(reg.items[0].after.visualNecessity.solutionReason, /등식의 성질로 양변에서/);
    assert.equal(reg.items[1].after.visualNecessity.solution, 'EXEMPT');
  } finally { ctx.cleanup(); }
});

test('apply-judgment: provenance 는 변환기만 만든다 — 스테이지에 없으면 다시 변환하라며 실패하고 아무것도 쓰지 않는다', () => {
  const ctx = fresh();
  try {
    writeJudgments(ctx.judgmentDir, goodJudgments(ctx.candDir));
    const regFile = path.join(path.dirname(ctx.jsPath), fs.readdirSync(path.dirname(ctx.jsPath)).find(f => /\.meta-q01-q02\.json$/.test(f)));
    const reg = readJson(regFile);
    for (const it of reg.items) delete it.after.provenance;
    writeJson(regFile, reg);
    const out = path.join(ctx.work, 'out');
    assert.throws(() => applyJudgments({ jsPath: ctx.jsPath, judgmentDir: ctx.judgmentDir, outDir: out, repoRoot, log: quiet }), /PROVENANCE_MISSING.*다시 변환/);
    assert.equal(fs.existsSync(out), false);
  } finally { ctx.cleanup(); }
});

// ---------- 선택표 (학교급·학년·과목별 메타 선택 문서) ----------
// 정확한 개수·키 이름을 고정하지 않는다. 결함 조건만 본다: 등록부 ACTIVE 키 누락·초과, 후보와의 불일치, 받아야 할 키를 거부함.
const selectionCli = path.join(repoRoot, 'archive/tools/similar-import/build-selection-tables.mjs');
const selTools = () => import('../archive/tools/similar-import/build-selection-tables.mjs');
const libTools = () => import('../archive/tools/similar-import/lib.mjs');
const KEY_RE = /`((?:PT|TPL)_[A-Za-z0-9_]+)`/g;

test('선택표: 등록부의 ACTIVE 유형·템플릿이 단원마다 빠짐없이 있고 ACTIVE 가 아닌 키는 없다', async () => {
  const { buildSelectionFiles } = await selTools();
  const { buildAllSelections } = await libTools();
  const all = buildAllSelections(repoRoot);
  const files = buildSelectionFiles(repoRoot, all);
  const tax = loadTaxonomy(repoRoot);
  const groups = loadCourseGroups(repoRoot);
  assert.ok(files.has('MIDDLE2.md') && files.has('MIDDLE1.md') && files.has('MIDDLE3.md'));
  for (const [name, text] of files) assert.ok(Buffer.byteLength(text) <= 300 * 1024, `${name} 가 너무 크다`);
  for (const sel of all.values()) {
    const text = files.get(`${sel.id}.md`);
    const members = new Set(groups.find(g => g.id === sel.id).members);
    // 단원 구역을 잘라 그 안에 이 단원에 묶인 ACTIVE 유형이 전부 있는지 본다
    for (const u of sel.units) {
      const start = text.indexOf(`\n## ${u.standardUnitKey} `);
      assert.ok(start >= 0, `${sel.id} ${u.standardUnitKey} 구역`);
      const end = text.indexOf('\n## ', start + 4);
      const section = text.slice(start, end < 0 ? undefined : end);
      const missing = [];
      for (const b of tax.bindings) {
        if ((b.status && b.status !== 'ACTIVE') || !members.has(b.standardCourse) || b.standardUnitKey !== u.standardUnitKey || !b.problemTypeKey) continue;
        const pt = tax.pts.get(b.problemTypeKey);
        if (!pt || (pt.status && pt.status !== 'ACTIVE')) continue;
        if (!section.includes(`\`${b.problemTypeKey}\``)) missing.push(b.problemTypeKey);
        for (const t of tax.tpls.values()) if (t.parentProblemTypeKey === b.problemTypeKey && (!t.status || t.status === 'ACTIVE') && !section.includes(`\`${t.templateKey}\``)) missing.push(t.templateKey);
      }
      assert.deepEqual(missing, [], `${sel.id} ${u.standardUnitKey}`);
    }
    // 실은 모든 키는 등록부에 ACTIVE 로 있다
    for (const m of text.matchAll(KEY_RE)) {
      const e = tax.pts.get(m[1]) || tax.tpls.get(m[1]);
      assert.ok(e && (!e.status || e.status === 'ACTIVE'), `${sel.id}: ${m[1]}`);
    }
    // 한글 이름이 있어 개념 단어로 찾을 수 있다
    if (sel.units.some(u => u.problemTypes.length)) assert.ok(/\*\*[가-힣]/.test(text), `${sel.id} 한글 유형 이름`);
  }
});

test('선택표: --write 로 만든 폴더는 --check 가 통과하고, 고치거나 지우면 종료 1', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sim-seltab-'));
  try {
    const w = spawnSync(process.execPath, [selectionCli, '--write', '--out', tmp], { encoding: 'utf8' });
    assert.equal(w.status, 0, w.stderr);
    assert.equal(spawnSync(process.execPath, [selectionCli, '--check', '--out', tmp], { encoding: 'utf8' }).status, 0);
    fs.appendFileSync(path.join(tmp, 'MIDDLE2.md'), '\n손으로 고침\n');
    const bad = spawnSync(process.execPath, [selectionCli, '--check', '--out', tmp], { encoding: 'utf8' });
    assert.equal(bad.status, 1);
    assert.match(bad.stderr, /MIDDLE2\.md/);
    fs.rmSync(path.join(tmp, 'MIDDLE1.md'));
    assert.match(spawnSync(process.execPath, [selectionCli, '--check', '--out', tmp], { encoding: 'utf8' }).stderr, /없음: MIDDLE1\.md/);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});

test('선택표: 저장소에 둔 사본에는 과목마다 파일이 있고 지금 등록부에서 ACTIVE 가 아닌 키가 없다 (새 키 누락은 --check 가 본다)', async () => {
  const { SELECTION_DIR } = await selTools();
  const tax = loadTaxonomy(repoRoot);
  for (const g of loadCourseGroups(repoRoot)) {
    const f = path.join(SELECTION_DIR, `${g.id}.md`);
    assert.ok(fs.existsSync(f), `${g.id}.md`);
    for (const m of fs.readFileSync(f, 'utf8').matchAll(KEY_RE)) {
      const e = tax.pts.get(m[1]) || tax.tpls.get(m[1]);
      assert.ok(e && (!e.status || e.status === 'ACTIVE'), `${g.id}.md 의 ${m[1]} 가 등록부에서 사라졌거나 ACTIVE 가 아니다. --write 로 다시 만드세요.`);
    }
  }
});

test('build-candidates: 모든 단원의 등록된 유형이 후보에 나오고, 선택표 파일 경로가 _exam.json 에 있고 파일이 작업 폴더에 있다', async () => {
  const ctx = fresh();
  try {
    const { buildAllSelections } = await libTools();
    const all = buildAllSelections(repoRoot);
    const c = readJson(path.join(ctx.candDir, 'q01.json'));
    // 문항의 주 단원이 아닌 단원도 좁히지 않는다
    for (const su of all.get('MIDDLE2').units) {
      const have = new Set(c.units.find(u => u.standardUnitKey === su.standardUnitKey).problemTypes.map(p => p.problemTypeKey));
      assert.deepEqual(su.problemTypes.map(p => p.problemTypeKey).filter(k => !have.has(k)), [], su.standardUnitKey);
    }
    const exam = readJson(path.join(ctx.candDir, '_exam.json'));
    assert.equal(exam.selectionFiles[0], 'selection/MIDDLE2.md');
    assert.ok(exam.selectionFiles.includes('selection/MIDDLE1.md'), '아래 학년 선택표');
    for (const rel of exam.selectionFiles) assert.ok(fs.existsSync(path.join(ctx.work, rel)), rel);
    // 모든 문항이 같은 단원 목록을 본다
    assert.deepEqual(readJson(path.join(ctx.candDir, 'q02.json')).units, c.units);
  } finally { ctx.cleanup(); }
});

test('check-judgment: 선택표에 있는 이 과목·아래 학년 유형은 후보에 없어도 받고, 선택표에 없는 키·남의 TPL·위 학년 키는 거부한다', async () => {
  const ctx = fresh();
  try {
    const { buildAllSelections, groupPts } = await libTools();
    const all = buildAllSelections(repoRoot);
    const inCands = new Set(readJson(path.join(ctx.candDir, 'q01.json')).units.flatMap(u => u.problemTypes.map(p => p.problemTypeKey)));
    const lower = groupPts(all.get('MIDDLE1')).find(p => !inCands.has(p.problemTypeKey) && p.templates.length);
    assert.ok(lower, '후보에 없는 아래 학년(중1) 유형이 있어야 한다');
    const mutate = fn => { const js = goodJudgments(ctx.candDir); fn(js); writeJudgments(ctx.judgmentDir, js); return check(ctx); };
    let r = mutate(js => { js[1].problemTypeKey = lower.problemTypeKey; js[1].templateKey = lower.templates[0].templateKey; js[1].newKeyProposal = null; });
    assert.deepEqual(codesOf(r, 1), [], '아래 학년 PT·TPL 은 선택표에 있으므로 받는다');
    r = mutate(js => { js[1].problemTypeKey = lower.problemTypeKey; js[1].templateKey = 'TPL_NO_SUCH_TEMPLATE'; js[1].newKeyProposal = null; });
    assert.ok(codesOf(r, 1).includes('KEY_NOT_IN_CANDIDATES'), '그 PT 의 것이 아닌 TPL');
    r = mutate(js => { js[1].problemTypeKey = 'PT_NO_SUCH_KEY_IN_REGISTRY'; js[1].templateKey = 'NONE'; js[1].newKeyProposal = null; });
    assert.ok(codesOf(r, 1).includes('KEY_NOT_IN_CANDIDATES'), '선택표에 없는 키');
    // 중2 시험지에 고2 과목(대수) 유형은 위 학년이라 거부한다
    const accepted = new Set([...all.get('MIDDLE2').units, ...all.get('MIDDLE1').units].flatMap(u => u.problemTypes.map(p => p.problemTypeKey)));
    const above = groupPts(all.get('H22_ALGEBRA')).find(p => !accepted.has(p.problemTypeKey) && !inCands.has(p.problemTypeKey));
    assert.ok(above, '중2 에서 받지 않는 고2 유형이 있어야 한다');
    r = mutate(js => { js[1].problemTypeKey = above.problemTypeKey; js[1].templateKey = 'NONE'; js[1].newKeyProposal = null; });
    assert.ok(codesOf(r, 1).includes('KEY_NOT_IN_CANDIDATES'), '위 학년 키');
  } finally { ctx.cleanup(); }
});

test('answerMatchesStored: 복수 정답은 순서·표기와 상관없이 같은 집합이면 일치', () => {
  const item = { questionType: '객관식', answer: '②, ④', choices: ['1', '2', '3', '4', '5'] };
  for (const ok of ['②, ④', '④,②', '2, 4', '2번, 4번']) assert.equal(answerMatchesStored(item, ok), true, ok);
  for (const no of ['②', '②, ③', '②, ④, ⑤', '2']) assert.equal(answerMatchesStored(item, no), false, no);
  const single = { questionType: '객관식', answer: '③', choices: ['1', '2', '7', '4', '5'] };
  for (const ok of ['③', '3', '3번', '7']) assert.equal(answerMatchesStored(single, ok), true, ok);
});
