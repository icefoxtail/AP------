#!/usr/bin/env node
// 사용법: node archive/tools/similar-import/apply-judgment.mjs <stem.js> <judgmentDir>
//        [--out-dir <dir>] [--only 1,3,5] [--partial-receipt] [--judge <이름>] [--reviewer <이름>]
//        [--hold-file <HOLD.md>] [--status-file <STATUS.tsv>] [--no-status] [--date YYYY-MM-DD]
// 검사(check-judgment)를 통과한 판정만 시험지 JS · .meta-q01-qNN.json · .4slot.json 에 반영한다.
// - 실패 코드가 있으면 아무것도 쓰지 않는다(종료 1).
// - 그림이 필요한데 image 가 없는 문항 등 보류 사유가 있으면 시험지를 내보내지 않고 HOLD.md 에 적는다(종료 3). 그 문항만 빼지 않는다.
// - 모든 문항에 검수 기록(review.verdict)이 있고 HOLD 가 0, 검수자 풀이 답이 모두 채워졌을 때만 .review-receipt.json 을 만들고 reviewStatus 를 올린다.
// 기본 출력 위치: stem.js 가 저장소 archive/exams 안이면 그 자리, 밖(스테이징)이면 register 의 sourceArchiveFile 이 가리키는 저장소 경로.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_REPO_ROOT, DEFAULT_WORK_ROOT, parseCli, readBank, readJson, writeJson, pad2, gitBlobSha1, findSibling, orderItem, serializeBank,
  loadMasters, loadCrosswalkRecords, loadTermDictionary, stripWs, questionUidForSource, appendStatus,
} from './lib.mjs';
import { checkJudgments, printReport, answerMatchesStored, reviewState } from './check-judgment.mjs';
export { reviewState };

const slotFormat = item => ({ 객관식: '단일 정답', 단답형: '단답', 서술형: '서술' }[item.questionType] || '단일 정답');

/** 그림 판단 NONE/SELF_CONTAINED 는 문제 그림 EXEMPT 와 근거. NEEDS_FIGURE 는 쓰지 않는다(그림 파일이 없으면 시험지가 보류된다). */
export function problemVisual(j) {
  if (j.figureNeed === 'NONE') return { problem: 'EXEMPT', problemReason: '발문에 그림을 가리키는 말이 없고 글만으로 완결되어 그림이 필요 없다.' };
  if (j.figureNeed === 'SELF_CONTAINED') return { problem: 'EXEMPT', problemReason: `그림을 가리키는 말(「${String(j.figureEvidence).trim()}」)이 있으나 글만으로 풀려 그림이 필요 없다.` };
  return null;
}
/** 해설 그림 판단: NONE 은 불필요(EXEMPT), NEEDS_FIGURE 는 값만 기록한다(보류 없음). */
export function solutionVisual(j) {
  if (j.solutionFigureNeed === 'NONE') return { solution: 'EXEMPT', solutionReason: '해설이 글만으로 완결되어 그림 없이 따라갈 수 있다.' };
  if (j.solutionFigureNeed === 'NEEDS_FIGURE') return { solution: 'REQUIRED', solutionReason: `해설을 따라가려면 그림이 필요하다(「${String(j.solutionFigureEvidence).trim()}」).` };
  return null;
}
const SOURCE_MD_VALUE = '원천 마크다운 값, 재판정 안 함';
/** Condition 키가 있으면 키와 4칸 condition 근거, 없으면 NONE 과 4칸 condition 에 적힌 것. */
export function conditionRationale(j, conditionKeys) {
  const terms = (j.slots?.condition || []).map(e => e.term);
  const why = j.slotReasons?.condition || (terms.length ? `4칸 condition: ${terms.join(', ')}` : '');
  if (Array.isArray(conditionKeys) && conditionKeys.length) return `${conditionKeys.join(', ')}: ${why || '4칸 condition 칸이 비어 있다.'}`;
  return `NONE: 풀이에 쓰이는 별도 Condition 키가 없다${terms.length ? ` (4칸 condition 에는 ${terms.join(', ')} 이 있다)` : ''}.`;
}

export function buildReceipt({ stem, targetJsPath, targetMetaPath, blob, bank, judgments, date, reviewer, partialOf = null }) {
  const rows = [...judgments.entries()].sort((a, b) => a[0] - b[0]).map(([qid, j]) => {
    const item = bank.find(b => b.id === qid);
    const match = answerMatchesStored(item, j.review.reviewerSolvedAnswer);
    return { qid, blindFrozenAnswer: j.review.reviewerSolvedAnswer, candidateAnswer: item.answer, match, method: (j.review.note || j.how || '').slice(0, 200), verdict: j.review.verdict };
  });
  const fixes = [...judgments.entries()].flatMap(([qid, j]) => (j.review.fixes || []).map(f => `Q${qid} ${f.field}: ${JSON.stringify(f.from)} -> ${JSON.stringify(f.to)} (${f.why})`));
  const mismatches = rows.filter(r => !r.match).length;
  const receipt = {
    schemaVersion: 'archive-independent-exam-review-receipt-v1',
    examUid: stem,
    candidateJsPath: targetJsPath,
    candidateMetaPath: targetMetaPath,
    candidateGitBlobSha1: blob,
    reviewTimestamp: `${date}T00:00:00+09:00`,
    reviewerRole: 'INDEPENDENT_EXAM_AUDITOR_AND_TEACHER',
    reviewRound: 1,
    overallVerdict: partialOf ? 'PARTIAL' : 'PASS',
    signOffStatus: partialOf ? 'PARTIAL_NOT_FOR_RELEASE' : 'PASS',
    reviewer: reviewer || '',
    blindFirstPass: {
      totalSolved: rows.length,
      answerMatches: rows.length - mismatches,
      answerMismatches: mismatches,
      ambiguousStems: 0,
      freezeFile: '판정 기록 judgment/qNN.json 의 review.reviewerSolvedAnswer (저장소 밖 보관)',
      method: '검수자가 각 문항을 직접 풀어 reviewerSolvedAnswer 를 적은 뒤 저장 정답과 대조했다. 풀이 답이 비어 있으면 이 영수증을 만들지 않는다.',
    },
    questionsReview: rows.map(({ verdict, ...r }) => r),
    metaReview: {
      note: `검수 문항 ${rows.length}개: PASS ${rows.filter(r => r.verdict === 'PASS').length}, FIXED ${rows.filter(r => r.verdict === 'FIXED').length}, HOLD 0. approval.reviewStatus=independent_review_passed, reviewPassCount=1.`,
    },
    reviewerEdits: fixes,
    defects: [],
    unresolvedDefects: [],
    NOT_RUN: ['Chrome 렌더 확인', 'tools/run-tests.js 전체 및 check-archive2-runtime (병합 직전)', '수학 내용 이중 독립 검수'],
  };
  if (partialOf) receipt.partial = { reviewedQids: rows.map(r => r.qid), totalQuestions: partialOf, note: '일부 문항만 검수한 시험 기록이다. 출고 근거로 쓰지 않는다.' };
  return receipt;
}

export function applyJudgments({
  jsPath, judgmentDir, candidatesDir = null, outDir = null, only = null, partialReceipt = false, judge = 'similar-import-draft', reviewer = 'similar-import-reviewer',
  holdFile = path.join(DEFAULT_WORK_ROOT, 'HOLD.md'), statusFile = null, date = new Date().toISOString().slice(0, 10), repoRoot = DEFAULT_REPO_ROOT, log = console.log,
}) {
  const { bank, examDisplayTitle, text: jsText } = readBank(jsPath);
  const stem = path.basename(jsPath, '.js');
  const regPath = findSibling(jsPath, /^\.meta-q\d+-q\d+\.json$/);
  if (!regPath) throw new Error('META_REGISTER_NOT_FOUND: 변환기가 만든 .meta-q01-qNN.json 이 stem.js 옆에 있어야 합니다');
  const register = readJson(regPath);
  const partial = Boolean(only);

  const check = checkJudgments({ jsPath, judgmentDir, candidatesDir, only, repoRoot });
  printReport(check, log);
  const status = (s, detail) => { if (statusFile) appendStatus(statusFile, stem, s, detail); };

  const failures = check.items.filter(r => r.verdict === 'FAIL').length + check.examCodes.filter(c => c.severity === 'FAIL').length;
  if (failures) {
    status('CONVERTED', `판정 검사 실패 ${failures}건`);
    return { written: false, reason: 'CHECK_FAILED', exitCode: 1, check };
  }
  const holdItems = check.items.filter(r => r.verdict === 'HOLD');
  if (holdItems.length && !partial) {
    const lines = holdItems.flatMap(r => r.codes.map(c => `- Q${r.qid}: ${c.code} — ${c.msg}`));
    fs.mkdirSync(path.dirname(holdFile), { recursive: true });
    fs.appendFileSync(holdFile, `\n## ${stem} (${date})\n시험지를 내보내지 않았습니다. 문항을 빼지 않고 전체를 보류합니다.\n${lines.join('\n')}\n`, 'utf8');
    status('HOLD', [...new Set(holdItems.flatMap(r => r.codes.map(c => c.code)))].join(','));
    log(`\n보류: ${holdFile} 에 기록했습니다. 파일을 내보내지 않았습니다.`);
    return { written: false, reason: 'HOLD', exitCode: 3, check };
  }

  const masters = loadMasters(repoRoot);
  const crosswalk = new Map(loadCrosswalkRecords(repoRoot).map(r => [r.id, r]));
  const dictionary = loadTermDictionary(repoRoot);

  const appliedQids = check.items.filter(r => r.verdict === 'PASS').map(r => r.qid);
  const newBank = bank.map(item => {
    if (!appliedQids.includes(item.id)) return item;
    const j = check.judgments.get(item.id);
    const unit = masters.unitOrders.get(j.standardUnitKey);
    const sub = masters.subUnits.get(j.subUnitKey);
    const next = {
      ...item,
      category: sub.labelKo,
      standardUnitKey: unit.key,
      standardUnit: unit.label,
      standardUnitOrder: unit.order,
      subUnitKey: sub.subUnitKey,
      subUnit: sub.labelKo,
      subUnitConfidence: 'candidate_evidence',
      subUnitClassificationDepth: 'complete_candidate',
      conceptClusterKey: sub.conceptClusterKey || item.conceptClusterKey || '',
      tags: [item.questionType, sub.labelKo],
      difficultyBucket: j.difficultyBucket,
      problemTypeKey: j.problemTypeKey === 'NONE' ? '' : j.problemTypeKey,
      templateKey: j.templateKey === 'NONE' ? '' : j.templateKey,
    };
    for (const k of ['level', 'rpmPrimaryL1', 'rpmPrimaryL2', 'rpmPrimaryL3', 'rpmPrimaryL4', 'rpmPrimaryRecordId']) delete next[k];
    if (j.rpmRecordId !== 'NONE') {
      const r = crosswalk.get(j.rpmRecordId);
      next.rpmPrimaryRecordId = r.id;
    }
    return orderItem(next);
  });

  const targetSourceJsPath = register.sourceArchiveFile;
  const jsContent = serializeBank(stem, examDisplayTitle, newBank);
  const blob = gitBlobSha1(jsContent);

  // 출력 위치
  const inRepoExams = path.resolve(path.dirname(jsPath)).startsWith(path.resolve(repoRoot, 'archive/exams'));
  const destDir = outDir ? path.resolve(outDir) : inRepoExams ? path.dirname(path.resolve(jsPath)) : path.resolve(repoRoot, path.dirname(targetSourceJsPath));

  // 검수 상태
  const rv = reviewState(new Map([...check.judgments].filter(([qid]) => appliedQids.includes(qid))), newBank.length);
  const reviewedFull = rv.complete && !partial;
  const reviewedPartialOk = partial && partialReceipt && rv.rows.length > 0 && !rv.missing.length && !rv.holds.length && !rv.noAnswer.length;

  // 등록 요청
  const regItems = register.items.map(it => {
    if (!appliedQids.includes(it.sourceOrdinal)) return it;
    const q = newBank.find(b => b.id === it.sourceOrdinal);
    const j = check.judgments.get(q.id);
    const after = { ...it.after };
    for (const f of ['standardCourse', 'curriculum', 'courseKey', 'standardUnitKey', 'standardUnit', 'standardUnitOrder', 'subUnitKey', 'subUnit', 'conceptClusterKey', 'problemTypeKey', 'templateKey', 'difficultyBucket']) after[f] = q[f];
    delete after.level;
    for (const k of ['curriculumKey', 'difficultyBasis', 'rpmPrimaryRecordIds', 'rpmPrimary', 'rpmPrimaryL1', 'rpmPrimaryL2', 'rpmPrimaryL3', 'rpmPrimaryL4', 'rpmPrimaryRecordId']) delete after[k];
    if (q.rpmPrimaryRecordId) after.rpmPrimaryRecordId = q.rpmPrimaryRecordId;
    after.difficultyConfidence = j.difficultyConfidence;
    after.difficultyBoundaryFlag = j.difficultyBoundaryFlag;
    after.metaRationale = {
      draftTier: 'SINGLE_MODEL_DRAFT',
      unit: `${q.standardUnitKey} / ${q.subUnitKey}: ${j.unitEvidence}`,
      curriculum: `${j.rpmRecordId}: ${j.rpmReason}`,
      problemType: j.typeReason,
      difficulty: j.difficultyReason,
      condition: conditionRationale(j, after.conditionKeys),
    };
    // 판정 기록에서 만들 수 있는 필수 메타. 근거가 없는 칸(visualNecessity.solution, provenance.generator, variationNote)은 비워 둔다.
    after.visualNecessity = { ...(after.visualNecessity || {}), ...problemVisual(j), ...solutionVisual(j) };
    // CrossConcept·Integration 은 변환기가 원천 마크다운에서 옮긴 값이다. 판정 대상이 아니므로 근거 문장만 고정 문구로 둔다.
    if (after.integrationPattern) {
      const keys = Array.isArray(after.crossConceptKeys) ? after.crossConceptKeys : [];
      after.metaRationale.crossConcept = `${keys.length ? keys.join(', ') : 'NONE'}: ${SOURCE_MD_VALUE}`;
      after.metaRationale.integration = `${after.integrationPattern}: ${SOURCE_MD_VALUE}`;
    }
    // provenance 는 변환기만 만든다. 없으면 옛 변환기로 만든 스테이지이므로 다시 변환하게 한다.
    if (!after.provenance) throw new Error(`PROVENANCE_MISSING: Q${q.id} 스테이지 등록 요청에 provenance 가 없습니다 (md 머리글에 sourceArchiveFile 이 없거나 옛 변환 산출물). similar-md-to-js 로 다시 변환하세요.`);
    const proposal = j.newKeyProposal ? `; PROPOSAL: ${JSON.stringify(j.newKeyProposal)}` : '';
    // 난이도 확신·경계·이유와 유형 후보 사본은 항목 위에 쓰지 않는다 (after 와 metaRationale 에 이미 있다).
    const { difficultyConfidence, difficultyBoundaryFlag, difficultyReason, ptTplCandidate, ...itemRest } = it;
    return {
      ...itemRest,
      after,
      reason: `DRAFT_SINGLE_MODEL (${judge})${proposal}`,
    };
  });
  const approval = { ...register.approval };
  if (reviewedFull) Object.assign(approval, { approvedBy: reviewer, reviewStatus: 'independent_review_passed', reviewPassCount: 1 });
  else Object.assign(approval, { reviewStatus: 'review_required', reviewPassCount: 0 });
  const newRegister = { ...register, approval, expectedSourceBlobSha1: blob, expectedQuestionCount: newBank.length, items: regItems };

  // 4칸
  const candidates = [];
  const fourSlotItems = appliedQids.map(qid => {
    const j = check.judgments.get(qid);
    const item = newBank.find(b => b.id === qid);
    const slots = {};
    for (const slot of ['given', 'goal', 'method', 'condition']) {
      slots[slot] = j.slots[slot].map(e => {
        const t = dictionary.byName.get(stripWs(e.term));
        const out = { term: t ? t.ko : e.term, src: e.src, quote: e.quote };
        if (slot === 'method') { out.evidenceType = e.evidenceType; if (e.justification) out.justification = e.justification; }
        if (!t) candidates.push({ term: e.term, parent: e.parent, note: e.note, usedIn: [qid], status: 'CANDIDATE' });
        return out;
      });
    }
    return { sourceOrdinal: qid, format: j.format || slotFormat(item), slots, steps: [], scenarioNote: '', reasons: j.slotReasons || {}, review: { status: 'UNREVIEWED' } };
  });
  const fourSlot = {
    schemaVersion: 'archive-meta-4slot-v0',
    sourceArchiveFile: targetSourceJsPath.replace(/^archive\/exams\//, ''),
    sourceGitBlobSha: blob,
    dictionaryVersion: dictionary.version,
    judgedBy: { agent: judge, at: date },
    candidates,
    selfCheck: { note: `단일 모델 초안(UNREVIEWED). 인용은 check-judgment 로 원문 포함을 확인했다.${partial ? ` 일부 문항만 반영함(Q${appliedQids.join(', Q')}).` : ''}` },
    items: fourSlotItems,
  };

  // 영수증
  let receipt = null;
  const receiptName = `${stem}.review-receipt.json`;
  const metaName = path.basename(regPath);
  if (reviewedFull || reviewedPartialOk) {
    const judged = new Map([...check.judgments].filter(([qid]) => appliedQids.includes(qid)));
    receipt = buildReceipt({
      stem, targetJsPath: targetSourceJsPath, targetMetaPath: path.join(path.dirname(targetSourceJsPath), metaName).replaceAll('\\', '/'),
      blob, bank: newBank, judgments: judged, date, reviewer, partialOf: partial ? newBank.length : null,
    });
  }

  fs.mkdirSync(destDir, { recursive: true });
  const written = [];
  const put = (name, text) => { const p = path.join(destDir, name); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text, 'utf8'); written.push(p); };
  put(`${stem}.js`, jsContent);
  put(metaName, JSON.stringify(newRegister, null, 2) + '\n');
  put(`${stem}.4slot.json`, JSON.stringify(fourSlot, null, 2) + '\n');
  if (receipt) put(receiptName, JSON.stringify(receipt, null, 2) + '\n');
  const plansDir = path.join(path.dirname(jsPath), `${stem}_plans`);
  if (fs.existsSync(plansDir) && path.resolve(plansDir) !== path.resolve(destDir, `${stem}_plans`)) {
    for (const f of fs.readdirSync(plansDir)) put(path.join(`${stem}_plans`, f), fs.readFileSync(path.join(plansDir, f), 'utf8'));
  }

  const finalStatus = receipt && reviewedFull ? 'READY' : 'JUDGED';
  status(finalStatus, receipt && reviewedFull ? '검수 영수증 생성, 운영 병합 가능' : `판정 반영(검수 대기: ${rv.missing.length ? '검수 기록 없음 Q' + rv.missing.join(',Q') : rv.holds.length ? 'HOLD Q' + rv.holds.join(',Q') : rv.noAnswer.length ? '검수자 풀이 답 비어 있음' : ''})`);
  return {
    written: true, exitCode: 0, destDir, files: written, receipt: Boolean(receipt), reviewedFull, partial, appliedQids,
    reviewStatus: approval.reviewStatus, review: rv, check, status: finalStatus,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const { pos, opt } = parseCli(a, ['--partial-receipt', '--no-status']);
  if (pos.length < 2) {
    console.error('Usage: node apply-judgment.mjs <stem.js> <judgmentDir> [--out-dir <dir>] [--only 1,3,5] [--partial-receipt] [--judge <이름>] [--reviewer <이름>] [--hold-file <path>] [--status-file <path>] [--no-status]');
    process.exit(1);
  }
  try {
    const r = applyJudgments({
      jsPath: path.resolve(pos[0]), judgmentDir: path.resolve(pos[1]),
      outDir: opt('--out-dir'), only: opt('--only') ? opt('--only').split(',').map(Number) : null, partialReceipt: a.includes('--partial-receipt'),
      judge: opt('--judge') || undefined, reviewer: opt('--reviewer') || undefined, holdFile: opt('--hold-file') || undefined,
      statusFile: a.includes('--no-status') ? null : (opt('--status-file') || path.join(DEFAULT_WORK_ROOT, 'STATUS.tsv')), date: opt('--date') || undefined,
    });
    if (r.written) {
      console.log(`\n반영 완료 (${r.partial ? '일부 문항 Q' + r.appliedQids.join(',Q') : '전 문항'}) -> ${r.destDir}`);
      for (const f of r.files) console.log('  -', f);
      console.log(`reviewStatus=${r.reviewStatus}  영수증=${r.receipt ? '생성' : '없음'}  단계=${r.status}`);
    }
    process.exit(r.exitCode);
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  }
}
