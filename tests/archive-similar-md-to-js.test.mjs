import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

import {
  unescapeMarkdown,
  parseChoices,
  parseSimilarMd,
  parseJsonBlock,
  convertSimilarExam,
  gitBlobSha1,
} from '../archive/tools/similar-md-to-js.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

import { googleEscape, buildMd, baseMeta, q1, q2 } from './helpers/similar-md-fixture.mjs';

function convertTo(md, extra = {}) {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sim-md-'));
  const result = convertSimilarExam({ mdContent: md, repoRoot, writeFiles: true, outDir, ...extra });
  return { result, outDir };
}
const loadBank = file => {
  const ctx = { window: {} };
  vm.createContext(ctx);
  new vm.Script(fs.readFileSync(file, 'utf8')).runInContext(ctx);
  return JSON.parse(JSON.stringify(ctx.window.questionBank));
};

test('unescapeMarkdown: 구글 원형 입력(\\$ \\= \\+ \\_ \\\\frac)을 한 겹만 벗긴다', () => {
  assert.equal(unescapeMarkdown('\\$x \\+ y \\= 2\\$ \\_a \\[3점\\] \\- \\# \\< \\>'), '$x + y = 2$ _a [3점] - # < >');
  assert.equal(unescapeMarkdown('\\$\\\\frac{1}{2}\\$'), '$\\frac{1}{2}$');
  assert.equal(unescapeMarkdown('\\$\\\\overline{AB}\\$'), '$\\overline{AB}$');
  // 행렬 줄바꿈 \\ 는 구글에서 \\\\ 로 나온다
  assert.equal(unescapeMarkdown('1\\&2\\\\\\\\3'), '1\\&2\\\\3');
  // 이미 벗은 글은 건드리지 않는다 (\o 같은 명령은 그대로)
  assert.equal(unescapeMarkdown('\\overline{AB}'), '\\overline{AB}');
  assert.equal(googleEscape('$\\frac{1}{2}=x$'), '\\$\\\\frac\\{1\\}\\{2\\}\\=x\\$');
  assert.equal(unescapeMarkdown(googleEscape('$a_1\\neq b+c-d$ [3점] (1). x<y|z!')), '$a_1\\neq b+c-d$ [3점] (1). x<y|z!');
});

test('parseChoices: 보기 5개, 서답형은 빈 배열', () => {
  assert.deepEqual(parseChoices('① $x+1$ ② $x-1$ ③ $2x$ ④ $3x$ ⑤ $4x$'), ['$x+1$', '$x-1$', '$2x$', '$3x$', '$4x$']);
  assert.deepEqual(parseChoices('\n① $1$\n② $2$\n③ $3$\n④ $4$\n⑤ $5$\n'), ['$1$', '$2$', '$3$', '$4$', '$5$']);
  assert.deepEqual(parseChoices('없음'), []);
  assert.deepEqual(parseChoices(''), []);
});

test('parseJsonBlock: 한 번만 읽고, 깨진 LaTeX는 고치지 않고 던진다', () => {
  assert.deepEqual(parseJsonBlock('{"a": "$\\\\frac{1}{2}$"}'), { a: '$\\frac{1}{2}$' });
  // 구글이 코드 블록 안까지 이스케이프한 경우: \$ 와 \\\\frac
  assert.deepEqual(parseJsonBlock('{"a": "\\$\\\\\\\\frac{1}{2}\\$"}'), { a: '$\\frac{1}{2}$' });
  // 역슬래시를 하나만 쓴 \frac \times \neq \beta 는 JSON 에서 폼피드·탭·줄바꿈·백스페이스로 둔갑하므로 실패해야 한다
  for (const bad of ['{"a": "$\\frac{1}{2}$"}', '{"a": "$2\\times 3$"}', '{"a": "$a \\neq b$"}', '{"a": "$\\beta$"}', '{"a": "$\\alpha$"}']) {
    assert.throws(() => parseJsonBlock(bad), /JSON|LaTeX/, bad);
  }
});

test('convertSimilarExam: 구글 원형 입력을 원문 그대로 복원하고 형식을 지킨다', () => {
  const md = buildMd({ stem: '99_테스트중_1학기_중간_중2_유사', questions: [q1, q2] });
  assert.ok(md.includes('\\$'), '입력이 구글 이스케이프 형태여야 한다');
  const { result, outDir } = convertTo(md);
  try {
    assert.equal(result.validation.valid, true, result.validation.errors.join('\n'));
    assert.equal(result.questionCount, 2);
    assert.equal(result.totalScore, 10);
    const bank = loadBank(path.join(outDir, '99_테스트중_1학기_중간_중2_유사.js'));
    assert.equal(bank.length, 2);
    // 본문은 원문과 한 글자도 다르지 않아야 한다
    assert.equal(bank[0].content, q1.content);
    assert.equal(bank[0].solution, q1.solution);
    assert.deepEqual(bank[0].choices, q1.choices);
    assert.equal(bank[0].answer, '③');
    assert.equal(bank[1].questionType, '단답형');
    assert.deepEqual(bank[1].choices, []);
    assert.equal(bank[0].layoutTag, 'grid');
    assert.equal(bank[0].wide, false);
    assert.equal(bank[0].problemPlanRef, undefined);
    for (const q of bank) assert.doesNotMatch(JSON.stringify(q), /[\u0000-\u0009\u000b-\u001f]/);

    // RPM 은 변환기가 정하지 않는다
    assert.equal(Object.keys(bank[0]).some(k => k.startsWith('rpmPrimary')), false);
    // 같은 값을 여러 칸에 쓰지 않는다
    assert.equal(Object.keys(bank[0]).some(k => k === 'originalCategory'), false);

    const metaDoc = JSON.parse(fs.readFileSync(path.join(outDir, '99_테스트중_1학기_중간_중2_유사.meta-q01-q02.json'), 'utf8'));
    assert.equal(metaDoc.schemaVersion, 'archive-reviewed-exam-meta-register-request-v2');
    assert.equal(metaDoc.expectedSourceBlobSha1, gitBlobSha1(fs.readFileSync(path.join(outDir, '99_테스트중_1학기_중간_중2_유사.js'))));
    assert.equal(metaDoc.approval.reviewStatus, 'review_required');
    assert.equal(metaDoc.approval.reviewPassCount, 0);
    assert.equal(new Set(metaDoc.items.map(i => i.questionUid)).size, 2);
    for (const it of metaDoc.items) {
      for (const k of ['primaryMethod', 'decisiveStep', 'ptTplCandidate']) assert.equal(k in it, false, `항목 위 사본 ${k} 를 쓰지 않는다`);
    }
    assert.equal(result.examStatus.releasable, true);
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});

test('convertSimilarExam: 없는 값에 기본값을 만들어 넣지 않고 미완 칸으로 센다', () => {
  const bare = { ...q2, meta: { sourceQid: '2', standardUnitKey: 'M2-01', subUnitKey: 'M2-01-EXPONENT_LAW' } };
  const { result, outDir } = convertTo(buildMd({ stem: '99_테스트중_1학기_중간_중2_유사', questions: [q1, bare] }));
  try {
    const bank = loadBank(path.join(outDir, '99_테스트중_1학기_중간_중2_유사.js'));
    const b = bank[1];
    assert.equal('level' in b, false, '하/중/상 칸은 만들지 않는다');
    assert.equal(b.difficultyBucket, null);
    assert.equal(b.integrationPattern, '');
    assert.equal(b.variationType, '');
    assert.equal(b.standardCourse, '');
    assert.equal(b.courseKey, '');
    assert.ok(result.stats.incompleteFields.difficultyBucket >= 1);
    const reg = JSON.parse(fs.readFileSync(path.join(outDir, '99_테스트중_1학기_중간_중2_유사.meta-q01-q02.json'), 'utf8'));
    assert.equal(reg.items[1].after.difficultyConfidence, '');
    assert.equal(reg.items[1].after.difficultyBoundaryFlag, '');
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});

test('convertSimilarExam: 원천에 하/중/상(level)이 있어도 옮기지 않고, 머리글 사실로 provenance 만 만든다', () => {
  const { outDir } = convertTo(buildMd({ stem: '99_테스트중_1학기_중간_중2_유사', questions: [q1, q2] }));
  try {
    const stem = '99_테스트중_1학기_중간_중2_유사';
    const bank = loadBank(path.join(outDir, `${stem}.js`));
    for (const b of bank) assert.equal('level' in b, false);
    const reg = JSON.parse(fs.readFileSync(path.join(outDir, `${stem}.meta-q01-q02.json`), 'utf8'));
    for (const [i, it] of reg.items.entries()) {
      assert.equal('level' in it.after, false);
      assert.deepEqual(it.after.provenance, {
        kind: 'SIMILAR_FROM_ORIGINAL', sourceExam: '99_테스트중_1학기_중간_중2_기출', sourceArchiveFile: 'archive/exams/original/middle/m2/1mid/99_테스트중_1학기_중간_중2_기출.js',
        sourceQid: i + 1, variationType: 'NUMERIC', createdAt: '2026-11-18', createdAtSource: '변환 마크다운 헤더의 generatedAt',
      });
    }
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});

test('convertSimilarExam: 단원 키가 null 이면 변환은 하되 출고 보류', () => {
  const nullUnit = { ...q2, meta: baseMeta(2, { standardUnitKey: null, subUnitKey: null }) };
  const { result, outDir } = convertTo(buildMd({ stem: '99_테스트중_1학기_중간_중2_유사', questions: [q1, nullUnit] }));
  try {
    assert.equal(result.validation.valid, true);
    assert.equal(result.examStatus.releasable, false);
    assert.equal(result.examStatus.status, '출고 보류');
    assert.match(result.examStatus.holdReasons[0], /UNIT_KEY_MISSING/);
    assert.equal(result.writtenFiles.length > 0, true);
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});

test('convertSimilarExam: 읽을 수 없는 원천 메타는 실패하고, 옵션을 줘야만 그 문항을 비운 채 진행한다', () => {
  // 역슬래시 하나짜리 LaTeX (JSON 으로 읽을 수 없음)
  const raw = '{"sourceQid": "2", "standardUnitKey": "M2-01", "primaryMethod": "$\\alpha + \\beta$"}';
  const broken = { ...q2, metaRaw: raw };
  const md = buildMd({ stem: '99_테스트중_1학기_중간_중2_유사', questions: [q1, broken] });
  const strict = convertSimilarExam({ mdContent: md, repoRoot, writeFiles: false });
  assert.equal(strict.validation.valid, false);
  assert.ok(strict.validation.errors.some(e => e.startsWith('META_UNREADABLE: Q2')));
  const lenient = convertSimilarExam({ mdContent: md, repoRoot, writeFiles: false, allowUnreadableSourceMeta: true });
  assert.equal(lenient.validation.valid, true);
  assert.deepEqual(lenient.stats.sourceMetaUnreadable.map(s => s.qid), [2]);
  assert.match(lenient.examStatus.holdReasons.join(' '), /SOURCE_META_UNREADABLE/);
  // 탭·폼피드로 둔갑하는 명령도 마찬가지
  const tabbed = convertSimilarExam({ mdContent: buildMd({ stem: '99_테스트중_1학기_중간_중2_유사', questions: [q1, { ...q2, metaRaw: '{"sourceQid": "2", "decisiveStep": "$2\\times 3$"}' }] }), repoRoot, writeFiles: false });
  assert.ok(tabbed.validation.errors.some(e => e.startsWith('META_UNREADABLE: Q2')));
});

test('convertSimilarExam: 이스케이프 찌꺼기와 짝이 안 맞는 $ 는 실패, 환경 밖 \\\\ 는 경고만', () => {
  const residue = { ...q2, solution: '$x = 6$ 이고 \\$ 5 이다 \\+ 4' };
  // googleEscape 를 거치면 \\$ 가 되어 한 겹 벗겨도 \$ 가 남는다
  const r1 = convertSimilarExam({ mdContent: buildMd({ stem: '99_테스트중_1학기_중간_중2_유사', questions: [q1, residue] }), repoRoot, writeFiles: false });
  assert.ok(r1.validation.errors.some(e => e.startsWith('ESCAPE_RESIDUAL: qid 2')), r1.validation.errors.join('\n'));

  const odd = { ...q2, solution: '$x = 6 이다.' };
  const r2 = convertSimilarExam({ mdContent: buildMd({ stem: '99_테스트중_1학기_중간_중2_유사', questions: [q1, odd] }), repoRoot, writeFiles: false });
  assert.ok(r2.validation.errors.some(e => e.startsWith('UNBALANCED_DOLLARS: qid 2')));

  const brk = { ...q2, solution: '$a = 1 \\\\ b = 2$ 이다.' };
  const r3 = convertSimilarExam({ mdContent: buildMd({ stem: '99_테스트중_1학기_중간_중2_유사', questions: [q1, brk] }), repoRoot, writeFiles: false });
  assert.equal(r3.validation.valid, true, r3.validation.errors.join('\n'));
  assert.ok(r3.validation.warnings.some(w => w.startsWith('LATEX_BACKSLASH_PAIR_OUTSIDE_ENV: qid 2')));
  assert.equal(r3.artifacts.jsContent.includes('a = 1 \\\\\\\\ b = 2'), true, '내용은 바꾸지 않는다');
});

test('parseSimilarMd: plan 객체가 있는 문항은 plan 파일과 problemPlanRef 를 만든다', () => {
  const withPlan = { ...q2, plan: { type: 'geometry', description: '직각삼각형', elements: [] } };
  const md = buildMd({ stem: '99_테스트중_1학기_중간_중2_유사', questions: [q1, withPlan] });
  assert.equal(parseSimilarMd(md).questions[1].plan.type, 'geometry');
  const { result, outDir } = convertTo(md);
  try {
    const bank = loadBank(path.join(outDir, '99_테스트중_1학기_중간_중2_유사.js'));
    assert.match(bank[1].problemPlanRef, /q02-problem\.plan\.json$/);
    assert.equal(fs.existsSync(path.join(outDir, '99_테스트중_1학기_중간_중2_유사_plans/q02-problem.plan.json')), true);
    assert.equal(result.validation.valid, true);
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});

test('복수 정답 "②, ④" 는 받고 기출과 같은 형식으로 저장한다, 백틱이 이스케이프된 코드 블록도 읽는다', () => {
  const multi = { ...q1, answer: '④,②' };
  const md = buildMd({ stem: '26_테스트중_1학기_중간_중2_유사', questions: [multi, q2] });
  const { result, outDir } = convertTo(md);
  assert.deepEqual(result.validation.errors, []);
  const bank = loadBank(path.join(outDir, '26_테스트중_1학기_중간_중2_유사.js'));
  assert.equal(bank[0].answer, '②, ④');

  // 구글 문서가 코드 블록 줄까지 \`\`\` 로 내보낸 경우
  const escapedMd = md.replace(/^```/gm, '\`\`\`');
  const parsed = parseSimilarMd(escapedMd);
  assert.equal(parsed.exam.stem, '26_테스트중_1학기_중간_중2_유사');
  assert.equal(parsed.questions.length, 2);
  assert.ok(parsed.questions[0].meta, 'meta 블록도 읽힌다');

  // 보기 번호가 아닌 것·중복은 여전히 실패
  for (const bad of ['②, ②', '⑥', '2, 4', '']) {
    const r = convertTo(buildMd({ stem: '26_테스트중_1학기_중간_중2_유사', questions: [{ ...q1, answer: bad }, q2] })).result;
    assert.ok(r.validation.errors.some(e => e.startsWith('OBJECTIVE_ANSWER_INVALID')), bad);
  }
});
