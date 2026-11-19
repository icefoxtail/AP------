#!/usr/bin/env node
// 사용법: node archive/tools/similar-import/build-review-pack.mjs <stem.js> <judgmentDir> --out <dir> [--candidates <dir>] [--only 1,3,5]
// 검수자가 한 파일(REVIEW.md)만 읽으면 되게 시험지 요약 + 문항별 한 블록을 만든다. 맨 위에 "먼저 볼 문항"을 자동으로 뽑는다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_REPO_ROOT, readBank, readJson, pad2, stripWs, parseCli, itemHasImage } from './lib.mjs';
import { checkJudgments, reviewState, answerMatchesStored } from './check-judgment.mjs';

const SHORT = 20;
const CIRC = ['①', '②', '③', '④', '⑤'];

function stripEnv(text) {
  return String(text).replace(/\\begin\{([a-zA-Z*]+)\}[\s\S]*?\\end\{\1\}/g, ' ');
}
const hasBackslashPair = item => [item.content, item.solution, ...(item.choices || [])].some(s => /\\\\/.test(stripEnv(s)));

/** 풀이 과정에 정답 값이 나오는지: 정답 값의 숫자들이 모두 풀이 과정 글에 있어야 한다. */
export function solutionShowsAnswer(item, steps, solvedAnswer) {
  const norm = s => String(s).replace(/\$/g, '').replace(/\s+/g, '');
  const rawAnswer = item.questionType === '객관식'
    ? String(item.answer ?? '').split(/[,，、\s]+/).filter(Boolean).map(c => item.choices?.[CIRC.indexOf(c)] ?? '').join(' ')
    : item.answer;
  void solvedAnswer; // 작성자가 따로 적은 답이 아니라 풀이 과정 줄에 값이 나오는지 본다
  const text = norm(steps.join(' '));
  const nums = [...String(rawAnswer).replace(/\\[a-zA-Z]+/g, ' ').matchAll(/\d+(?:\.\d+)?/g)].map(m => m[0]);
  if (nums.length) return nums.every(n => text.includes(n));
  const a = norm(rawAnswer);
  return a ? text.includes(a) : true;
}

function pathOfRpm(unit, id) {
  return unit?.rpm?.find(r => r.id === id)?.path || '';
}

export function flagsFor({ item, j, c, check }) {
  const flags = [];
  const answerBad = j.answerMatches === false || (j.answerIssue || '').trim() || check.some(x => x.code === 'ANSWER_MISMATCH');
  if (answerBad) flags.push('정답 불일치 또는 answerIssue 있음');
  if (j.figureNeed === 'NEEDS_FIGURE') flags.push(`NEEDS_FIGURE${itemHasImage(item) ? '' : ' (image 없음 -> 시험지 보류)'}`);

  const unit = c.units.find(u => u.standardUnitKey === j.standardUnitKey);
  const src = c.source || {};
  const diffs = [];
  if (src.standardUnitKey && src.standardUnitKey !== j.standardUnitKey) diffs.push('단원');
  if (src.subUnitKey && src.subUnitKey !== j.subUnitKey) diffs.push('소단원');
  if (src.rpmPath) {
    const judged = pathOfRpm(unit, j.rpmRecordId);
    const srcPath = [src.rpmPath.majorUnit, src.rpmPath.midUnit, src.rpmPath.l3, src.rpmPath.l4].join(' > ');
    if (judged !== srcPath) diffs.push('RPM');
  }
  if (src.problemTypeKey && src.problemTypeKey !== j.problemTypeKey) diffs.push('PT');
  if (src.templateKey && src.templateKey !== j.templateKey) diffs.push('TPL');
  if (src.difficultyBucket != null && src.difficultyBucket !== '' && Number(src.difficultyBucket) !== j.difficultyBucket) diffs.push('난이도');
  if (diffs.length >= 2) flags.push(`원천 값과 다른 칸 ${diffs.length}개 (${diffs.join(', ')})`);

  const allPts = c.units.flatMap(u => u.problemTypes);
  const shortOf = (text, exempt) => !exempt && stripWs(text).length < SHORT;
  const shorts = [];
  if (shortOf(j.rpmReason, (unit?.rpm?.length ?? 0) <= 1)) shorts.push('rpmReason');
  if (shortOf(j.typeReason, allPts.length <= 1)) shorts.push('typeReason');
  if (shortOf(j.difficultyReason, false)) shorts.push('difficultyReason');
  if (shortOf(j.how, false)) shorts.push('how');
  if (shorts.length) flags.push(`이유가 ${SHORT}자 미만 (${shorts.join(', ')})`);

  if (j.newKeyProposal) flags.push(`새 키 제안 ${j.newKeyProposal.key}`);
  if (j.difficultyConfidence === 'low' || !['', 'NONE', undefined].includes(j.difficultyBoundaryFlag) || (src.boundary && !['NONE', 'false', false].includes(src.boundary))) flags.push(`난이도 경계 (confidence=${j.difficultyConfidence}${j.difficultyBoundaryFlag && j.difficultyBoundaryFlag !== 'NONE' ? `, 경계 ${j.difficultyBoundaryFlag}` : ''}${src.boundary && src.boundary !== 'NONE' ? `, 원천 경계 ${src.boundary}` : ''})`);
  if (hasBackslashPair(item)) flags.push('보기·인라인 수식 안 \\\\ 경고 (환경 밖)');
  if (!solutionShowsAnswer(item, (j.solveSteps || []).filter(Boolean), j.solvedAnswer)) flags.push('풀이 과정에 정답 값이 등장하지 않음');
  return flags;
}

const fmtSlot = list => (list.length ? list.map(e => `${e.term}${e.evidenceType ? `(${e.evidenceType})` : ''}←${e.src}:「${e.quote}」${e.justification ? ` — ${e.justification}` : ''}`).join('<br>') : '(없음)');
const q = t => String(t ?? '').replace(/\n/g, ' ');

export function buildReviewMarkdown({ jsPath, judgmentDir, candidatesDir = null, only = null, repoRoot = DEFAULT_REPO_ROOT }) {
  const { bank } = readBank(jsPath);
  const stem = path.basename(jsPath, '.js');
  const candDir = candidatesDir || path.join(path.dirname(judgmentDir), 'candidates');
  const check = checkJudgments({ jsPath, judgmentDir, candidatesDir: candDir, only, repoRoot });
  const targets = bank.filter(it => !only || only.includes(it.id));

  const blocks = [];
  const priority = [];
  const rv = reviewState(check.judgments, targets.length);
  const figureCounts = {};
  const bucketCounts = {};
  let noneType = 0;
  let newKeys = 0;

  for (const it of targets) {
    const row = check.items.find(r => r.qid === it.id);
    const jFile = path.join(judgmentDir, `q${pad2(it.id)}.json`);
    const cFile = path.join(candDir, `q${pad2(it.id)}.json`);
    if (!fs.existsSync(jFile) || !fs.existsSync(cFile)) {
      priority.push({ qid: it.id, why: ['판정 또는 후보 파일 없음'] });
      blocks.push(`## Q${it.id}\n(판정 또는 후보 파일이 없습니다)\n`);
      continue;
    }
    const j = readJson(jFile);
    const c = readJson(cFile);
    const flags = flagsFor({ item: it, j, c, check: row?.codes || [] });
    if (row?.codes?.length) flags.unshift(`검사 코드: ${row.codes.map(x => x.code).join(', ')}`);
    if (flags.length) priority.push({ qid: it.id, why: flags });
    figureCounts[j.figureNeed || '(비어 있음)'] = (figureCounts[j.figureNeed || '(비어 있음)'] || 0) + 1;
    bucketCounts[j.difficultyBucket ?? '(비어 있음)'] = (bucketCounts[j.difficultyBucket ?? '(비어 있음)'] || 0) + 1;
    if (j.problemTypeKey === 'NONE') noneType++;
    if (j.newKeyProposal) newKeys++;

    const unit = c.units.find(u => u.standardUnitKey === j.standardUnitKey);
    const sub = unit?.subUnits.find(s => s.subUnitKey === j.subUnitKey);
    const src = c.source || {};
    const arrow = (from, to) => (from == null || from === '' ? '' : String(from) === String(to) ? ' (원천과 같음)' : ` **원천→판정: ${from} → ${to}**`);
    const srcRpm = src.rpmPath ? [src.rpmPath.majorUnit, src.rpmPath.midUnit, src.rpmPath.l3, src.rpmPath.l4].join(' > ') : '';
    const judgedRpm = pathOfRpm(unit, j.rpmRecordId);
    const real = answerMatchesStored(it, j.solvedAnswer);

    blocks.push([
      `## Q${it.id} — ${it.questionType} ${it.points}점${flags.length ? '  ⚠ 먼저 볼 문항' : ''}`,
      flags.length ? flags.map(f => `- ⚠ ${f}`).join('\n') : '',
      '',
      `**발문**\n\n${it.content}`,
      it.choices?.length ? `\n**보기** ${it.choices.map((x, i) => `${CIRC[i]} ${x}`).join('  ')}` : '',
      `\n> 검수자: 여기까지만 보고 먼저 풀어 \`review.reviewerSolvedAnswer\` 에 적은 뒤 아래를 읽으세요.`,
      '',
      `**저장 정답** ${it.answer}   |   그림 파일(image): ${itemHasImage(it) ? '있음' : '없음'}${it.problemPlanRef ? ' (plan 있음)' : ''}`,
      '',
      `**작성자의 풀이 과정**`,
      ...(j.solveSteps || []).map((s, i) => `${i + 1}. ${s}`),
      `- 작성자 답: ${j.solvedAnswer || '(비어 있음)'} → 저장 정답과 ${real ? '일치' : '**불일치**'} (작성자 보고 answerMatches=${j.answerMatches}${j.answerIssue ? `, answerIssue: ${j.answerIssue}` : ''})`,
      '',
      `**그림 판단** ${j.figureNeed} — ${q(j.figureEvidence) || '(근거 없음)'}`,
      '',
      `**단원** ${j.standardUnitKey}(${unit?.label ?? '?'}) / ${j.subUnitKey}(${sub?.label ?? '?'})${arrow(src.standardUnitKey, j.standardUnitKey)}${arrow(src.subUnitKey, j.subUnitKey)}\n- 근거 인용: 「${q(j.unitEvidence)}」`,
      `**RPM** ${j.rpmRecordId} ${judgedRpm ? `[${judgedRpm}]` : ''}${srcRpm ? (srcRpm === judgedRpm ? ' (원천과 같음)' : ` **원천→판정: ${srcRpm} → ${judgedRpm || j.rpmRecordId}**`) : ''}\n- 이유: ${q(j.rpmReason)}`,
      `**유형** PT=${j.problemTypeKey} / TPL=${j.templateKey}${arrow(src.problemTypeKey, j.problemTypeKey)}${arrow(src.templateKey, j.templateKey)}\n- 이유: ${q(j.typeReason)}${j.newKeyProposal ? `\n- 새 키 제안: \`${j.newKeyProposal.key}\` (${j.newKeyProposal.label}) — ${q(j.newKeyProposal.why)}` : ''}`,
      `**난이도** ${j.difficultyBucket} (confidence=${j.difficultyConfidence}, 경계=${j.difficultyBoundaryFlag || '-'})${arrow(src.difficultyBucket, j.difficultyBucket)}\n- 이유: ${q(j.difficultyReason)}`,
      '',
      `**4칸**`,
      ...['given', 'goal', 'method', 'condition'].map(k => `- ${k}: ${fmtSlot(j.slots?.[k] || [])}`),
      '',
      `**how** ${q(j.how)}`,
      '',
      `<details><summary>저장 해설 (판정 검토용)</summary>\n\n${it.solution}\n\n</details>`,
      '',
      `**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=\`${j.review?.reviewerSolvedAnswer ?? ''}\`  verdict=\`${j.review?.verdict ?? ''}\`  fixes=${(j.review?.fixes || []).length}건${j.review?.note ? `  note: ${q(j.review.note)}` : ''}`,
      '',
      '---',
      '',
    ].filter(x => x !== undefined).join('\n'));
  }

  const holds = {};
  for (const r of check.items) for (const cc of r.codes) holds[cc.code] = (holds[cc.code] || 0) + 1;
  const statusLine = check.anyCode ? `CONVERTED (판정 검사 미통과: ${Object.entries(holds).map(([k, v]) => `${k} ${v}`).join(', ')})`
    : rv.complete ? 'REVIEWED (검수 기록 완료)' : 'JUDGED (검사 통과, 검수 대기)';

  const head = [
    `# 검수 묶음 — ${stem}`,
    '',
    `- 단계: **${statusLine}**${only ? `  (일부 문항만: Q${only.join(', Q')})` : ''}`,
    `- 문항 ${targets.length}개 / 검사 PASS ${check.summary.pass}, FAIL ${check.summary.fail}, 보류 ${check.summary.hold}`,
    `- 검수 기록: 입력된 verdict ${rv.rows.length - rv.missing.length}/${rv.rows.length}, HOLD ${rv.holds.length}, 풀이 답 비어 있음 ${rv.noAnswer.length}문항`,
    `- 그림 판단 분포: ${Object.entries(figureCounts).map(([k, v]) => `${k} ${v}`).join(', ') || '-'}`,
    `- 난이도 분포: ${Object.entries(bucketCounts).sort().map(([k, v]) => `${k}단계 ${v}`).join(', ') || '-'}`,
    `- 유형 NONE ${noneType}문항, 새 키 제안 ${newKeys}문항`,
    '- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.',
    '',
    '## 먼저 볼 문항',
    priority.length ? priority.map(p => `- **Q${p.qid}**: ${p.why.join(' / ')}`).join('\n') : '- (자동으로 뽑힌 문항 없음 — 그래도 모든 문항을 직접 푼다)',
    '',
    '---',
    '',
  ];
  return { markdown: head.join('\n') + blocks.join('\n'), priority, check, status: statusLine };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { pos, opt } = parseCli(process.argv.slice(2));
  if (pos.length < 2 || !opt('--out')) {
    console.error('Usage: node build-review-pack.mjs <stem.js> <judgmentDir> --out <dir> [--candidates <dir>] [--only 1,3,5]');
    process.exit(1);
  }
  try {
    const r = buildReviewMarkdown({
      jsPath: path.resolve(pos[0]), judgmentDir: path.resolve(pos[1]),
      candidatesDir: opt('--candidates') ? path.resolve(opt('--candidates')) : null, only: opt('--only') ? opt('--only').split(',').map(Number) : null,
    });
    const out = path.resolve(opt('--out'));
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'REVIEW.md'), r.markdown, 'utf8');
    console.log(`REVIEW.md 생성 -> ${path.join(out, 'REVIEW.md')}  (먼저 볼 문항 ${r.priority.length}개: ${r.priority.map(p => 'Q' + p.qid).join(', ') || '없음'})`);
    console.log(`단계: ${r.status}`);
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  }
}
