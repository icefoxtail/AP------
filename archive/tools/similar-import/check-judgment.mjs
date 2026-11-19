#!/usr/bin/env node
// 사용법: node archive/tools/similar-import/check-judgment.mjs <stem.js> <judgmentDir> [--candidates <dir>] [--only 1,3,5] [--json <out.json>]
// 문항마다 판정 기록이 "정말 채워졌는지" 기계로 본다. 실패 코드가 하나라도 있으면 종료 코드 1.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_REPO_ROOT, DEFAULT_WORK_ROOT, readBank, readJson, writeJson, pad2, stripWs, CIRCLED, parseObjectiveAnswer, gitBlobSha1, parseCli, appendStatus, getPath,
  loadTermDictionary, findBrokenStrings, itemTokenSet, sharesItemToken, itemHasImage, itemFingerprint, loadGuideExample, BOUNDARY_FLAGS,
  buildAllSelections, selectionAccepts,
} from './lib.mjs';
import { analyzeChoiceOrder, answerDistribution, formatDistribution, leakWarnings } from './choice-order-lib.mjs'; // 기준: docs/agents/similar-choices.md

export const FIGURE_NEEDS = ['NONE', 'SELF_CONTAINED', 'NEEDS_FIGURE'];
export const SOLUTION_FIGURE_NEEDS = ['NONE', 'NEEDS_FIGURE'];
export const CODES_HOLD_CLASS = new Set(['FIGURE_MISSING']); // 판정은 맞지만 시험지를 내보낼 수 없는 사유
export function reviewState(judgments, total) {
  const rows = [...judgments.entries()].map(([qid, j]) => ({ qid, ...(j.review || {}) }));
  const missing = rows.filter(r => !['PASS', 'FIXED', 'HOLD'].includes(r.verdict)).map(r => r.qid);
  const holds = rows.filter(r => r.verdict === 'HOLD').map(r => r.qid);
  const noAnswer = rows.filter(r => !String(r.reviewerSolvedAnswer ?? '').trim()).map(r => r.qid);
  const complete = rows.length === total && rows.length > 0 && !missing.length && !holds.length && !noAnswer.length;
  return { rows, missing, holds, noAnswer, complete, anyReview: rows.some(r => ['PASS', 'FIXED', 'HOLD'].includes(r.verdict)) };
}
export const reviewCompleteness = reviewState;
const nonEmpty = v => typeof v === 'string' && v.trim().length > 0;

export function answerMatchesStored(item, solved) {
  const norm = s => stripWs(s).replace(/\$/g, '');
  const s = norm(solved);
  if (!s) return false;
  if (item.questionType === '객관식') {
    const stored = parseObjectiveAnswer(item.answer);
    if (!stored) return false;
    if (stored.length > 1) {
      // 복수 정답: "②, ④" / "2, 4" / "2번, 4번" 을 순서와 상관없이 같은 집합이면 일치로 본다.
      const got = String(solved ?? '').replace(/\$/g, '').split(/[,，、\s]+/).filter(Boolean)
        .map(p => (CIRCLED.includes(p) ? p : CIRCLED[Number(p.replace(/번$/, '')) - 1]));
      if (got.some(g => !g) || new Set(got).size !== got.length) return false;
      return got.length === stored.length && stored.every(x => got.includes(x));
    }
    const idx = CIRCLED.indexOf(stored[0]);
    if (s === CIRCLED[idx] || s === String(idx + 1) || s === `${idx + 1}번`) return true;
    return norm(item.choices?.[idx] ?? '') === s;
  }
  return norm(item.answer) === s;
}

function splitSentences(text) {
  return String(text ?? '').split(/[\n.!?。]+/).map(s => stripWs(s)).filter(s => s.length >= 15);
}

export function checkJudgments({ jsPath, judgmentDir, candidatesDir = null, only = null, repoRoot = DEFAULT_REPO_ROOT }) {
  const { bank, text: jsText } = readBank(jsPath);
  const candDir = candidatesDir || path.join(path.dirname(judgmentDir), 'candidates');
  const dictionary = loadTermDictionary(repoRoot);
  const example = loadGuideExample();
  const exampleTexts = example ? [example.how, example.typeReason, example.rpmReason, example.difficultyReason, ...(example.solveSteps || [])].map(stripWs).filter(Boolean) : [];
  const examCodes = [];
  const examMeta = fs.existsSync(path.join(candDir, '_exam.json')) ? readJson(path.join(candDir, '_exam.json')) : null;
  if (!examMeta) examCodes.push({ code: 'FIELD_EMPTY', msg: `후보 폴더가 없습니다: ${candDir}`, severity: 'FAIL' });
  else if (examMeta.jsBlobSha1 !== gitBlobSha1(jsText)) examCodes.push({ code: 'CANDIDATES_STALE', msg: '후보를 만든 뒤 시험지 JS가 바뀌었습니다. build-candidates 를 다시 돌리세요.', severity: 'FAIL' });

  // 선택표(등록부의 ACTIVE 유형)에 있는 이 과목·아래 학년의 유형은 후보 파일에 없어도 받는다 (후보를 만든 뒤 등록부가 자랐거나 아래 학년 유형일 때).
  const selected = examMeta ? selectionAccepts(examMeta.courses, buildAllSelections(repoRoot)) : new Map();
  const targets = bank.filter(it => !only || only.includes(it.id));
  const judgments = new Map();
  const items = [];
  const reasonSentences = new Map(); // sentence -> Set(qid)

  for (const it of targets) {
    const qid = it.id;
    const codes = [];
    const add = (code, msg, severity) => codes.push({ code, msg, severity: severity || (CODES_HOLD_CLASS.has(code) ? 'HOLD' : 'FAIL') });
    const jFile = path.join(judgmentDir, `q${pad2(qid)}.json`);
    const cFile = path.join(candDir, `q${pad2(qid)}.json`);
    if (!fs.existsSync(jFile) || !fs.existsSync(cFile)) {
      add('FIELD_EMPTY', `판정 또는 후보 파일이 없습니다 (${fs.existsSync(jFile) ? '' : 'judgment '}${fs.existsSync(cFile) ? '' : 'candidates'})`);
      items.push({ qid, codes, verdict: 'FAIL' });
      continue;
    }
    const j = readJson(jFile);
    const c = readJson(cFile);
    judgments.set(qid, j);
    const texts = { stem: it.content, choices: (it.choices || []).join('\n'), solution: it.solution };
    const strippedTexts = Object.fromEntries(Object.entries(texts).map(([k, v]) => [k, stripWs(v)]));
    const itemTokens = itemTokenSet([it.content, ...(it.choices || []), it.solution, it.answer]);

    // 0. 이 문항의 판정인가 (빈 틀을 만들 때의 문항 지문과 같고, 가이드 예시 글이 아니다)
    if (j.itemFingerprint !== itemFingerprint(it)) add('STALE_OR_EXAMPLE', '판정 틀의 itemFingerprint 가 현재 문항과 다르거나 없습니다. 이 문항의 틀이 아니거나 문항이 바뀐 뒤입니다. build-candidates --force 로 틀을 다시 만들어 처음부터 쓰세요.');
    else if ([j.how, j.typeReason, j.rpmReason, j.difficultyReason, ...(Array.isArray(j.solveSteps) ? j.solveSteps : [])].some(s => nonEmpty(s) && exampleTexts.includes(stripWs(s)))) add('STALE_OR_EXAMPLE', 'JUDGMENT_GUIDE.md 예시와 글자가 같은 문장이 있습니다. 예시를 베끼지 말고 이 문항을 읽고 쓰세요.');

    for (const b of findBrokenStrings(j)) if (b.kind === 'CTRL_CHAR') add('CTRL_CHAR', `${b.path} 에 깨진 제어문자(탭·폼피드·백스페이스 등)가 있습니다. 역슬래시를 \\\\ 로 쓰세요.`);

    const isQuote = (quote, srcs) => {
      const q = stripWs(quote);
      return q.length >= 4 && srcs.some(s => strippedTexts[s].includes(q));
    };

    // 1. 풀이
    const steps = Array.isArray(j.solveSteps) ? j.solveSteps.filter(nonEmpty) : [];
    if (steps.length < 2) add('SOLVE_TOO_SHORT', `solveSteps ${steps.length}줄 (2줄 이상 필요)`);
    if (!nonEmpty(j.solvedAnswer)) add('FIELD_EMPTY', 'solvedAnswer 가 비었습니다');

    // 2. 정답 비교
    if (typeof j.answerMatches !== 'boolean') add('FIELD_EMPTY', 'answerMatches 는 true/false 여야 합니다');
    if (nonEmpty(j.solvedAnswer)) {
      const real = answerMatchesStored(it, j.solvedAnswer);
      if (typeof j.answerMatches === 'boolean' && real !== j.answerMatches) {
        add('ANSWER_MISMATCH', `answerMatches=${j.answerMatches} 이지만 solvedAnswer "${j.solvedAnswer}" 와 저장 정답 "${it.answer}" 의 실제 비교는 ${real} 입니다`);
      } else if (!real && j.answerMatches === false) {
        if (!nonEmpty(j.answerIssue)) add('FIELD_EMPTY', 'answerMatches=false 인데 answerIssue(무엇이 다른지)가 비었습니다');
        else add('ANSWER_MISMATCH', `풀이 답 "${j.solvedAnswer}" ≠ 저장 정답 "${it.answer}" — 작성자가 저장 정답의 문제를 보고함. 시험지 보류`, 'HOLD');
      }
    }

    // 3. 그림
    if (!FIGURE_NEEDS.includes(j.figureNeed)) add('FIELD_EMPTY', `figureNeed 는 ${FIGURE_NEEDS.join('|')} 중 하나여야 합니다`);
    else if (j.figureNeed !== 'NONE') {
      if (!nonEmpty(j.figureEvidence)) add('FIELD_EMPTY', 'figureEvidence(발문 인용)가 비었습니다');
      else if (!isQuote(j.figureEvidence, ['stem', 'choices'])) add('QUOTE_NOT_SUBSTRING', 'figureEvidence 가 발문·보기에 그대로 있지 않거나 4자 미만입니다');
      if (j.figureNeed === 'NEEDS_FIGURE' && !itemHasImage(it)) add('FIGURE_MISSING', `그림이 필요한 문항인데 image 가 없습니다${it.problemPlanRef ? ' (plan 은 있으나 아직 그림 파일 없음)' : ''}`);
    }

    // 3b. 해설 그림 (NEEDS_FIGURE 여도 보류하지 않는다 — 해설 그림은 나중에 그림 줄에서 만든다)
    if (!SOLUTION_FIGURE_NEEDS.includes(j.solutionFigureNeed)) add('FIELD_EMPTY', `solutionFigureNeed 는 ${SOLUTION_FIGURE_NEEDS.join('|')} 중 하나여야 합니다`);
    else if (j.solutionFigureNeed === 'NEEDS_FIGURE') {
      if (!nonEmpty(j.solutionFigureEvidence)) add('FIELD_EMPTY', 'solutionFigureEvidence(해설 인용)가 비었습니다');
      else if (!isQuote(j.solutionFigureEvidence, ['solution'])) add('QUOTE_NOT_SUBSTRING', 'solutionFigureEvidence 가 해설에 그대로 있지 않거나 4자 미만입니다');
    }

    // 4. 단원
    const unit = (c.units || []).find(u => u.standardUnitKey === j.standardUnitKey);
    if (!nonEmpty(j.standardUnitKey)) add('FIELD_EMPTY', 'standardUnitKey 가 비었습니다');
    else if (!unit) add('KEY_NOT_IN_CANDIDATES', `standardUnitKey "${j.standardUnitKey}" 는 후보 단원이 아닙니다`);
    if (!nonEmpty(j.subUnitKey)) add('FIELD_EMPTY', 'subUnitKey 가 비었습니다');
    else if (unit && !unit.subUnits.some(s => s.subUnitKey === j.subUnitKey)) add('KEY_NOT_IN_CANDIDATES', `subUnitKey "${j.subUnitKey}" 는 단원 ${unit.standardUnitKey} 의 후보가 아닙니다`);
    if (!nonEmpty(j.unitEvidence)) add('FIELD_EMPTY', 'unitEvidence(발문·해설 인용)가 비었습니다');
    else if (!isQuote(j.unitEvidence, ['stem', 'solution', 'choices'])) add('QUOTE_NOT_SUBSTRING', 'unitEvidence 가 발문·해설·보기에 그대로 있지 않거나 4자 미만입니다');

    // 5. RPM
    if (!nonEmpty(j.rpmRecordId)) add('FIELD_EMPTY', 'rpmRecordId 가 비었습니다 (후보 id 또는 NONE)');
    else if (j.rpmRecordId !== 'NONE') {
      if (!unit) { /* 단원 오류가 먼저 보고됨 */ }
      else if (!unit.rpm.some(r => r.id === j.rpmRecordId)) add('KEY_NOT_IN_CANDIDATES', `rpmRecordId "${j.rpmRecordId}" 는 단원 ${unit.standardUnitKey} 의 RPM 후보가 아닙니다`);
    }
    if (!nonEmpty(j.rpmReason)) add('FIELD_EMPTY', 'rpmReason 이 비었습니다');

    // 6. 유형
    const ptAll = new Map((c.units || []).flatMap(u => u.problemTypes).map(p => [p.problemTypeKey, p]));
    if (!nonEmpty(j.problemTypeKey)) add('FIELD_EMPTY', 'problemTypeKey 가 비었습니다 (후보 키 또는 NONE)');
    else if (j.problemTypeKey !== 'NONE' && !ptAll.has(j.problemTypeKey) && !selected.has(j.problemTypeKey)) add('KEY_NOT_IN_CANDIDATES', `problemTypeKey "${j.problemTypeKey}" 는 후보와 선택표에 없습니다`);
    if (!nonEmpty(j.templateKey)) add('FIELD_EMPTY', 'templateKey 가 비었습니다 (후보 키 또는 NONE)');
    else if (j.templateKey !== 'NONE') {
      const pt = ptAll.get(j.problemTypeKey);
      const selTpls = selected.get(j.problemTypeKey);
      if (!pt && !selTpls) add('KEY_NOT_IN_CANDIDATES', `templateKey 를 쓰려면 후보·선택표 안의 problemTypeKey 가 먼저 있어야 합니다`);
      else if (!pt?.templates.some(t => t.templateKey === j.templateKey) && !selTpls?.has(j.templateKey)) add('KEY_NOT_IN_CANDIDATES', `templateKey "${j.templateKey}" 의 상위가 ${j.problemTypeKey} 가 아닙니다`);
    }
    if (!nonEmpty(j.typeReason)) add('FIELD_EMPTY', 'typeReason 이 비었습니다');
    if (j.problemTypeKey === 'NONE') {
      const p = j.newKeyProposal;
      if (!p || !nonEmpty(p.key) || !nonEmpty(p.label) || !nonEmpty(p.why)) add('FIELD_EMPTY', 'problemTypeKey=NONE 이면 newKeyProposal{key,label,why} 가 필요합니다');
    }

    // 7. 난이도
    if (![1, 2, 3, 4, 5].includes(j.difficultyBucket)) add('FIELD_EMPTY', 'difficultyBucket 은 1~5 정수여야 합니다');
    if (!['high', 'medium', 'low'].includes(j.difficultyConfidence)) add('FIELD_EMPTY', 'difficultyConfidence 는 high|medium|low 여야 합니다');
    if (!BOUNDARY_FLAGS.includes(j.difficultyBoundaryFlag)) add('FIELD_EMPTY', `difficultyBoundaryFlag 는 ${BOUNDARY_FLAGS.join('|')} 중 하나여야 합니다`);
    else if (/^B\d\d$/.test(j.difficultyBoundaryFlag) && ![Number(j.difficultyBoundaryFlag[1]), Number(j.difficultyBoundaryFlag[2])].includes(j.difficultyBucket)) add('FIELD_EMPTY', `difficultyBoundaryFlag ${j.difficultyBoundaryFlag} 는 difficultyBucket 이 ${j.difficultyBoundaryFlag[1]} 또는 ${j.difficultyBoundaryFlag[2]} 일 때만 쓸 수 있습니다`);
    if (!nonEmpty(j.difficultyReason)) add('FIELD_EMPTY', 'difficultyReason 이 비었습니다');

    // 8. 4칸
    const slots = j.slots || {};
    for (const slot of ['given', 'goal', 'method', 'condition']) {
      const arr = Array.isArray(slots[slot]) ? slots[slot] : null;
      if (!arr) { add('FIELD_EMPTY', `slots.${slot} 가 배열이 아닙니다`); continue; }
      if ((slot === 'goal' || slot === 'method') && !arr.length) add('FIELD_EMPTY', `slots.${slot} 는 비울 수 없습니다`);
      const seen = new Set();
      arr.forEach((e, i) => {
        const where = `slots.${slot}[${i}]`;
        if (!e || !nonEmpty(e.term)) { add('FIELD_EMPTY', `${where}.term 이 비었습니다`); return; }
        const dictTerm = dictionary.byName.get(stripWs(e.term));
        if (!dictTerm) {
          const okCandidate = e.candidate === true && nonEmpty(e.parent) && dictionary.byName.has(stripWs(e.parent)) && nonEmpty(e.note);
          if (!okCandidate) add('TERM_NOT_IN_DICT', `${where} "${e.term}" 는 사전에 없습니다 (신규 후보라면 candidate:true, parent(사전 용어), note 를 적으세요)`);
        }
        const key = dictTerm ? `id${dictTerm.id}` : stripWs(e.term);
        if (seen.has(key)) add('TERM_DUPLICATE_IN_SLOT', `${where} "${e.term}" 가 같은 칸에 중복입니다`);
        seen.add(key);
        if (!['stem', 'choices', 'solution'].includes(e.src)) add('FIELD_EMPTY', `${where}.src 는 stem|choices|solution 이어야 합니다`);
        else if (!nonEmpty(e.quote) || !isQuote(e.quote, [e.src])) add('QUOTE_NOT_SUBSTRING', `${where}.quote 가 ${e.src} 에 그대로 있지 않거나 4자 미만입니다`);
        if (slot === 'method') {
          if (!['NAMED', 'IMPLIED'].includes(e.evidenceType)) add('FIELD_EMPTY', `${where}.evidenceType 은 NAMED|IMPLIED 이어야 합니다`);
          else if (e.evidenceType === 'IMPLIED' && !nonEmpty(e.justification)) add('FIELD_EMPTY', `${where} IMPLIED 는 justification 이 필요합니다`);
        }
      });
    }

    // 9. how, 이유 문장이 이 문항을 읽고 쓴 것인지
    if (!nonEmpty(j.how) || j.how.trim().length < 15) add('FIELD_EMPTY', 'how 가 비었거나 15자 미만입니다');
    const tokenFields = { how: j.how, solveSteps: steps.join(' '), difficultyReason: j.difficultyReason, typeReason: j.typeReason, rpmReason: j.rpmReason };
    for (const [name, text] of Object.entries(tokenFields)) {
      if (nonEmpty(text) && !sharesItemToken(text, itemTokens)) add('REASON_NO_ITEM_TOKEN', `${name} 에 이 문항의 숫자·식 토큰이 하나도 없습니다. 이 중 하나 이상을 그대로 넣으세요: ${[...itemTokens].slice(0, 8).join(', ')}`);
    }
    for (const text of [j.how, j.difficultyReason, j.typeReason, j.rpmReason, ...Object.values(j.slotReasons || {})]) {
      for (const s of splitSentences(text)) {
        if (!reasonSentences.has(s)) reasonSentences.set(s, new Set());
        reasonSentences.get(s).add(qid);
      }
    }

    // 검수 기록 (검수자가 채운 경우에만 본다)
    const rev = j.review || {};
    if (rev.verdict) {
      if (!['PASS', 'FIXED', 'HOLD'].includes(rev.verdict)) add('FIELD_EMPTY', 'review.verdict 는 PASS|FIXED|HOLD 이어야 합니다');
      if (nonEmpty(rev.reviewerSolvedAnswer) && !answerMatchesStored(it, rev.reviewerSolvedAnswer) && rev.verdict !== 'HOLD') {
        add('REVIEW_ANSWER_MISMATCH', `검수자 풀이 답 "${rev.reviewerSolvedAnswer}" 이 저장 정답 "${it.answer}" 과 다른데 verdict 가 ${rev.verdict} 입니다 (HOLD 로 두세요)`);
      }
      if (rev.verdict === 'HOLD' && !nonEmpty(rev.note)) add('FIELD_EMPTY', 'review.verdict=HOLD 이면 note(왜 보류인지)가 필요합니다');
      if (rev.verdict === 'FIXED') {
        const fx = Array.isArray(rev.fixes) ? rev.fixes : [];
        if (!fx.length) add('FIELD_EMPTY', 'review.verdict=FIXED 이면 fixes 가 필요합니다');
        for (const f of fx) {
          if (!f || !nonEmpty(f.field) || !nonEmpty(f.why) || f.to === undefined || f.from === undefined) add('FIELD_EMPTY', 'fixes 항목은 field, from, to, why 가 모두 필요합니다');
          else if (JSON.stringify(getPath(j, f.field)) !== JSON.stringify(f.to)) add('REVIEW_FIX_NOT_APPLIED', `fixes 에 적은 ${f.field} 의 to 값이 판정 기록의 현재 값과 다릅니다 (판정 기록도 직접 고치세요)`);
        }
      }
    }

    items.push({ qid, codes, verdict: 'PASS' });
  }

  // 문항 간 같은 문장
  for (const [sentence, qids] of reasonSentences) {
    if (qids.size < 2) continue;
    for (const qid of qids) {
      const row = items.find(x => x.qid === qid);
      row.codes.push({ code: 'REASON_DUPLICATE', msg: `다른 문항(${[...qids].filter(x => x !== qid).map(x => 'Q' + x).join(',')})과 같은 문장: "${sentence.slice(0, 40)}…"`, severity: 'FAIL' });
    }
  }
  // 시험지 전체가 같은 값
  if (judgments.size >= 3) {
    const rpms = new Set([...judgments.values()].map(j => j.rpmRecordId));
    const diffs = new Set([...judgments.values()].map(j => j.difficultyBucket));
    if (rpms.size === 1 && diffs.size === 1 && [...rpms][0] && [...diffs][0]) examCodes.push({ code: 'ALL_SAME', msg: `전 문항이 같은 rpm(${[...rpms][0]})과 같은 난이도(${[...diffs][0]})입니다`, severity: 'FAIL' });
  }

  // 보기 크기순·정답 번호 분포·생김새 누설 (기준과 이유: docs/agents/similar-choices.md). 새 반입 시험지에만 적용된다.
  const warnings = [];
  for (const it of bank) {
    const row = items.find(x => x.qid === it.id);
    const a = analyzeChoiceOrder(it);
    if (row && (a.status === 'A' || a.status === 'B')) row.codes.push({ code: 'CHOICE_ORDER', msg: `수 보기가 크기순이 아닙니다(${a.status === 'A' ? '혼자 어긋난 보기가 정답' : '순서 어긋남'}): ${JSON.stringify(it.choices)} 정답 ${it.answer}. 정답 자리를 정하고 오답 값을 그 주위로 크기순으로 지으세요.`, severity: 'FAIL' });
    if (row && a.dup) row.codes.push({ code: 'CHOICE_DUPLICATE', msg: '같은 값의 보기가 있습니다', severity: 'FAIL' });
    for (const w of leakWarnings(it)) warnings.push({ qid: it.id, code: w });
  }
  if (!only) {
    const dist = answerDistribution(bank);
    if (dist.skewed) examCodes.push({ code: 'ANSWER_DISTRIBUTION', msg: `정답 번호 분포가 기준에 걸립니다: ${dist.reasons.join('; ')} (${formatDistribution(dist)}; 열 ${dist.sequence}). 정답 번호는 스크립트로 뽑은 목표 배열을 따르세요.`, severity: 'FAIL' });
  }

  for (const row of items) {
    row.verdict = !row.codes.length ? 'PASS' : row.codes.some(c => c.severity === 'FAIL') ? 'FAIL' : 'HOLD';
  }
  const holdReasons = {};
  for (const row of items) for (const c of row.codes) holdReasons[c.code] = (holdReasons[c.code] || 0) + 1;
  for (const c of examCodes) holdReasons[c.code] = (holdReasons[c.code] || 0) + 1;
  const passCount = items.filter(r => r.verdict === 'PASS').length;
  const anyCode = items.some(r => r.codes.length) || examCodes.length > 0;
  return {
    items,
    examCodes,
    judgments,
    warnings,
    summary: { total: items.length, pass: passCount, fail: items.filter(r => r.verdict === 'FAIL').length, hold: items.filter(r => r.verdict === 'HOLD').length, byCode: holdReasons },
    releasable: !anyCode && items.length === bank.length,
    anyCode,
    partial: items.length !== bank.length,
  };
}

export function printReport(r, out = console.log) {
  for (const row of r.items) {
    if (!row.codes.length) continue;
    out(`Q${row.qid} [${row.verdict}]`);
    for (const c of row.codes) out(`   ${c.code}${c.severity === 'HOLD' ? ' (보류)' : ''}: ${c.msg}`);
  }
  for (const c of r.examCodes) out(`시험지 ${c.code}: ${c.msg}`);
  if (r.warnings && r.warnings.length) {
    const by = {};
    for (const w of r.warnings) (by[w.code] ||= []).push('Q' + w.qid);
    for (const [code, qs] of Object.entries(by)) out(`경고 ${code} (${qs.length}건, 거절 아님): ${qs.join(', ')} — 정답만 꼴이 다른지 읽어 보세요`);
  }
  const s = r.summary;
  out(`\n요약: ${s.total}문항 중 PASS ${s.pass}, FAIL ${s.fail}, 보류 ${s.hold}`);
  if (Object.keys(s.byCode).length) out(`코드별: ${Object.entries(s.byCode).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  out(`시험지 판정: ${r.releasable ? '출고 가능 (JUDGED)' : '보류'}${r.partial ? ' (일부 문항만 검사함)' : ''}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { pos, opt, has } = parseCli(process.argv.slice(2), ['--no-status']);
  if (pos.length < 2) {
    console.error('Usage: node check-judgment.mjs <stem.js> <judgmentDir> [--candidates <dir>] [--only 1,3,5] [--json <out.json>] [--status-file <STATUS.tsv>] [--no-status]');
    process.exit(1);
  }
  const only = opt('--only') ? opt('--only').split(',').map(Number) : null;
  const jsPath = path.resolve(pos[0]);
  const r = checkJudgments({ jsPath, judgmentDir: path.resolve(pos[1]), candidatesDir: opt('--candidates') ? path.resolve(opt('--candidates')) : null, only });
  printReport(r);
  if (opt('--json')) writeJson(path.resolve(opt('--json')), { items: r.items, examCodes: r.examCodes, summary: r.summary, releasable: r.releasable });
  // 전 문항을 검사했을 때만 단계 표시를 남긴다.
  if (!only && !has('--no-status')) {
    const stem = path.basename(jsPath, '.js');
    const sf = opt('--status-file') || path.join(DEFAULT_WORK_ROOT, 'STATUS.tsv');
    if (r.anyCode) appendStatus(sf, stem, 'CONVERTED', `판정 검사 미통과: ${Object.entries(r.summary.byCode).map(([k, v]) => `${k} ${v}`).join(', ')}`);
    else {
      const rv = reviewCompleteness(r.judgments, r.items.length);
      appendStatus(sf, stem, rv.complete ? 'REVIEWED' : 'JUDGED', rv.complete ? '검수 기록 완료' : '검사 통과, 검수 대기');
    }
  }
  process.exit(r.anyCode ? 1 : 0);
}
