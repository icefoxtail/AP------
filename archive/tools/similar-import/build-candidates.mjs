#!/usr/bin/env node
// 사용법: node archive/tools/similar-import/build-candidates.mjs <stem.js> --out <dir> [--md <일체형.md>] [--course <과목명>] [--force]
// 문항마다 <dir>/candidates/qNN.json (읽을 자료와 후보) 과 <dir>/judgment/qNN.json (빈 판정 틀)을 만든다.
// 판정 틀이 이미 있으면 --force 없이는 덮어쓰지 않는다 (작성 중인 판정을 지우지 않기 위해서).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_REPO_ROOT, DEFAULT_WORK_ROOT, parseCli, appendStatus, readBank, readJson, writeJson, pad2, gitBlobSha1, findSibling,
  loadMasters, loadCrosswalkRecords, loadTaxonomy, loadTermDictionary, loadCourseGroups, resolveCourseGroups,
  buildCourseTables, buildAllSelections, lowerGroupIds, itemHasImage, FIGURE_CUE_RE, findOriginalExamFile, itemFingerprint,
} from './lib.mjs';
import { parseSimilarMd } from '../similar-md-to-js.mjs';
import { buildSelectionFiles, writeSelectionFiles, selectionFileName } from './build-selection-tables.mjs';

export function emptyJudgment(qid, fingerprint = '') {
  return {
    qid,
    // 도구가 채운다. 건드리지 않는다 (문항 지문이 바뀌었는지 검사기가 본다)
    itemFingerprint: fingerprint,
    // 1. 직접 풀이 (저장된 정답·해설을 보기 전에 푼다)
    solveSteps: [],
    solvedAnswer: '',
    // 2. 저장 정답과 비교
    answerMatches: null,
    answerIssue: '',
    // 3. 그림
    figureNeed: '',
    figureEvidence: '',
    solutionFigureNeed: '',
    solutionFigureEvidence: '',
    // 4. 단원
    standardUnitKey: '',
    subUnitKey: '',
    unitEvidence: '',
    // 5. RPM
    rpmRecordId: '',
    rpmReason: '',
    // 6. 유형
    problemTypeKey: '',
    templateKey: '',
    typeReason: '',
    newKeyProposal: null,
    // 7. 난이도
    difficultyBucket: null,
    difficultyConfidence: '',
    difficultyReason: '',
    difficultyBoundaryFlag: '',
    // 8. 4칸
    format: '',
    slots: { given: [], goal: [], method: [], condition: [] },
    slotReasons: {},
    // 9. 어떻게 판정했는지
    how: '',
    // 검수자가 채우는 칸 (작성자는 건드리지 않는다)
    review: { reviewerSolvedAnswer: '', verdict: '', fixes: [], note: '' },
  };
}

function snippet(text, idx, len, pad = 8) {
  return text.slice(Math.max(0, idx - pad), Math.min(text.length, idx + len + pad)).replace(/\n+/g, ' ').trim();
}

export function termCandidates(dictionary, texts) {
  const order = { stem: 0, solution: 1, choices: 2 };
  const found = new Map();
  for (const t of dictionary.terms) {
    for (const name of [t.ko, ...(t.synonyms || [])]) {
      if (!name || name.length < 2) continue;
      for (const [src, text] of Object.entries(texts)) {
        const idx = text.indexOf(name);
        if (idx < 0) continue;
        const key = `${t.id}|${src}`;
        if (found.has(key)) continue;
        found.set(key, { term: t.ko, matchedAs: name, kind: t.kind, src, quote: snippet(text, idx, name.length) });
      }
    }
  }
  return [...found.values()]
    .sort((a, b) => order[a.src] - order[b.src] || b.matchedAs.length - a.matchedAs.length || a.term.localeCompare(b.term))
    .slice(0, 100);
}

export function figureClues(content, choices, item, sourcePlan) {
  const text = `${content}\n${choices.join('\n')}`;
  const cues = [];
  for (const m of text.matchAll(FIGURE_CUE_RE)) {
    cues.push({ word: m[0], quote: snippet(text, m.index, m[0].length, 12) });
    if (cues.length >= 8) break;
  }
  return {
    cueWords: cues,
    hasPlan: Boolean(item.problemPlanRef),
    problemPlanRef: item.problemPlanRef || null,
    hasImage: itemHasImage(item),
    sourcePlan,
    note: '그림 낱말이 있어도 글만으로 풀리면 SELF_CONTAINED, 그림의 값·모양을 읽어야 하면 NEEDS_FIGURE. hasImage가 false인데 NEEDS_FIGURE이면 시험지는 보류된다.',
  };
}

export function buildCandidateSet({ jsPath, outDir, mdPath = null, course = null, repoRoot = DEFAULT_REPO_ROOT, force = false }) {
  const { bank, text: jsText } = readBank(jsPath);
  const regPath = findSibling(jsPath, /^\.meta-q\d+-q\d+\.json$/);
  const register = regPath ? readJson(regPath) : null;
  const stem = path.basename(jsPath, '.js');

  let md = null;
  if (mdPath) md = parseSimilarMd(fs.readFileSync(mdPath, 'utf8'));
  const curriculum = String(bank[0]?.curriculum || md?.exam?.curriculum || '');
  if (!curriculum) throw new Error('CURRICULUM_UNKNOWN: 문항에 curriculum 이 없습니다. --md 로 원천을 주세요.');
  const mdSourceFile = md?.exam?.sourceArchiveFile || null;
  const grade = md?.exam?.grade || (stem.match(/_(중[123]|고[123])_/) || [])[1] || '';

  const masters = loadMasters(repoRoot);
  const crosswalk = loadCrosswalkRecords(repoRoot);
  const groups = loadCourseGroups(repoRoot);
  const courseGroups = resolveCourseGroups({ bank, explicitCourse: course, grade, curriculum, groups });
  const taxonomy = loadTaxonomy(repoRoot);

  // 같은 시험의 원본 기출이 있으면 같은 번호 문항이 쓴 PT/TPL 을 힌트로 모은다 (후보에 없으면 그 단원에 더한다).
  const originalFile = findOriginalExamFile({ repoRoot, stem, targetSourceFile: register?.sourceArchiveFile, mdSourceFile });
  const originalBank = originalFile ? readBank(path.join(repoRoot, originalFile)).bank : null;
  const hints = new Map();
  for (const item of bank) {
    const srcQid = Number(item.sourceQid ?? md?.questions?.[item.id - 1]?.meta?.sourceQid ?? register?.items?.[item.id - 1]?.sourceQid) || item.id;
    const o = originalBank?.find(x => x.id === srcQid);
    const pt = o?.problemTypeKey && taxonomy.pts.get(o.problemTypeKey)?.status === 'ACTIVE' ? o.problemTypeKey : '';
    if (!pt) continue;
    const tpl = o.templateKey && taxonomy.tpls.get(o.templateKey)?.parentProblemTypeKey === pt ? o.templateKey : '';
    hints.set(item.id, { exam: originalFile, sourceQid: srcQid, problemTypeKey: pt, templateKey: tpl, standardUnitKey: o.standardUnitKey || '' });
  }
  const tables = buildCourseTables({
    repoRoot, courseGroups, curriculum, masters, crosswalk, taxonomy,
    extraPts: [...hints.values()].map(h => ({ problemTypeKey: h.problemTypeKey, standardUnitKey: h.standardUnitKey })),
  });
  const dictionary = loadTermDictionary(repoRoot);

  // 단원 목록은 모든 문항이 같다: 단원마다 등록부의 같은 과목·단원 ACTIVE 유형 전부 (유형을 좁혀 보여 주지 않는다).
  const unitsOut = tables.units.map(u => {
    const pts = [...(tables.ptByUnit.get(u.key) || new Map()).values()];
    return {
      standardUnitKey: u.key,
      label: u.label,
      order: u.order,
      subUnits: (masters.subUnitsByUnit.get(u.key) || []).map(s => ({ subUnitKey: s.subUnitKey, label: s.labelKo })),
      rpm: tables.rpmRows.filter(r => r.standardUnitKey === u.key).map(r => ({
        id: r.id,
        path: [r.rpmPath.majorUnit, r.rpmPath.midUnit, r.rpmPath.l3, r.rpmPath.l4].join(' > '),
        subUnitKey: r.subUnitKey || '',
        mappingStatus: r.mappingStatus || '',
      })),
      problemTypes: pts.map(p => ({
        problemTypeKey: p.problemTypeKey,
        label: p.canonicalLabelKo,
        templates: (tables.tplByPt.get(p.problemTypeKey) || []).map(t => ({ templateKey: t.templateKey, label: t.canonicalLabelKo })),
      })),
    };
  });
  const rpmOutsideUnits = tables.rpmRows.filter(r => !r.standardUnitKey).map(r => r.id);

  const defs = {
    note: 'PT/TPL 정의. 라벨만으로 모호할 때 본다.',
    problemTypes: Object.fromEntries([...tables.ptAll.values()].map(p => [p.problemTypeKey, p.definition || ''])),
    templates: Object.fromEntries([...tables.tplByPt.values()].flat().map(t => [t.templateKey, t.definition || t.internalSkeleton || ''])),
  };

  // 선택표: 이 시험 과목과 아래 학년 과목의 선택표를 같은 등록부에서 새로 만들어 작업 폴더에 둔다 (후보와 같은 시점의 등록부).
  const allSelections = buildAllSelections(repoRoot, { masters, crosswalk, taxonomy });
  const selectionIds = [...new Set(courseGroups.flatMap(g => (allSelections.has(g.id) ? [g.id, ...lowerGroupIds(allSelections.get(g.id), allSelections)] : [])))];
  const allFiles = buildSelectionFiles(repoRoot, allSelections);
  const selectionFiles = new Map(selectionIds.map(id => [selectionFileName(id), allFiles.get(selectionFileName(id))]));
  writeSelectionFiles(path.join(outDir, 'selection'), selectionFiles);

  fs.mkdirSync(path.join(outDir, 'candidates'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'judgment'), { recursive: true });
  writeJson(path.join(outDir, 'candidates', '_exam.json'), {
    stem,
    jsBlobSha1: gitBlobSha1(jsText),
    curriculum,
    grade,
    courses: courseGroups.map(g => g.id),
    // 개념 단어로 유형을 찾는 선택표 (작업 폴더 기준 경로, 이 시험 과목이 먼저)
    selectionFiles: [...selectionFiles.keys()].map(n => `selection/${n}`),
    dictionaryVersion: dictionary.version,
    unitCount: tables.units.length,
    rpmWithoutUnit: rpmOutsideUnits,
    questionCount: bank.length,
  });
  writeJson(path.join(outDir, 'candidates', '_registry-defs.json'), defs);

  const kept = [];
  for (const item of bank) {
    const qid = item.id;
    const mdQ = md?.questions?.[qid - 1];
    const regItem = register?.items?.[qid - 1];
    const sourceMeta = mdQ?.meta || null;
    const source = {
      note: '원천 마크다운이 적어 온 값. 참고용이며 틀릴 수 있다. 판정은 문항을 읽고 직접 한다.',
      standardUnitKey: sourceMeta?.standardUnitKey ?? item.standardUnitKey ?? null,
      subUnitKey: sourceMeta?.subUnitKey ?? item.subUnitKey ?? null,
      rpmPath: sourceMeta?.rpm ?? null,
      problemTypeKey: sourceMeta?.ptTplCandidate?.problemTypeKey ?? regItem?.ptTplCandidate?.problemTypeKey ?? null,
      templateKey: sourceMeta?.ptTplCandidate?.templateKey ?? regItem?.ptTplCandidate?.templateKey ?? null,
      difficultyBucket: sourceMeta?.difficultyBucket ?? item.difficultyBucket ?? null,
      newKeyProposal: sourceMeta?.newKeyProposal ?? null,
      item4slot: sourceMeta?.item4slot ?? null,
      boundary: sourceMeta?.difficultyBoundaryFlag ?? regItem?.difficultyBoundaryFlag ?? '',
    };
    const sourcePlan = mdQ ? (mdQ.plan && typeof mdQ.plan === 'object' ? (mdQ.plan.exempt ? { exempt: mdQ.plan.reason || true } : { plan: true }) : { exempt: 'NONE' }) : null;
    const texts = { stem: item.content, choices: (item.choices || []).join('\n'), solution: item.solution };

    writeJson(path.join(outDir, 'candidates', `q${pad2(qid)}.json`), {
      qid,
      questionType: item.questionType,
      course: courseGroups.map(g => g.id),
      curriculum,
      problem: { content: item.content, choices: item.choices || [], points: item.points },
      // 직접 푼 뒤에 본다
      reference: {
        answer: item.answer,
        solution: item.solution,
        // 원천 마크다운이 적어 온 풀이 요약 (풀기 전에 보지 않는다)
        sourcePrimaryMethod: sourceMeta?.primaryMethod ?? regItem?.primaryMethod ?? '',
        sourceDecisiveStep: sourceMeta?.decisiveStep ?? regItem?.decisiveStep ?? '',
      },
      source,
      units: unitsOut,
      termCandidates: termCandidates(dictionary, texts),
      figure: figureClues(item.content, item.choices || [], item, sourcePlan),
      // 원본 기출의 같은 번호 문항이 쓴 유형. 참고만 한다 (해설의 결정적 풀이 단계가 다르면 따르지 않는다).
      sourceExamHint: hints.has(qid) ? (({ standardUnitKey, ...h }) => h)(hints.get(qid)) : null,
      guide: 'JUDGMENT_GUIDE.md 를 먼저 읽는다. 후보 밖 키는 쓸 수 없다. 모든 이유 문장에는 이 문항의 숫자·식을 넣는다.',
    });

    const jPath = path.join(outDir, 'judgment', `q${pad2(qid)}.json`);
    if (force || !fs.existsSync(jPath)) writeJson(jPath, emptyJudgment(qid, itemFingerprint(item)));
    else kept.push(qid);
  }
  return { stem, questionCount: bank.length, units: tables.units.length, keptExistingJudgments: kept, outDir, courses: courseGroups.map(g => g.id) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const { pos, opt } = parseCli(a, ['--force', '--no-status']);
  const jsPath = pos[0];
  const outDir = opt('--out');
  if (!jsPath || !outDir) {
    console.error('Usage: node build-candidates.mjs <stem.js> --out <dir> [--md <일체형.md>] [--course <과목명>] [--force]');
    process.exit(1);
  }
  try {
    const r = buildCandidateSet({ jsPath: path.resolve(jsPath), outDir: path.resolve(outDir), mdPath: opt('--md'), course: opt('--course'), force: a.includes('--force') });
    if (!a.includes('--no-status')) appendStatus(opt('--status-file') || path.join(DEFAULT_WORK_ROOT, 'STATUS.tsv'), r.stem, 'CONVERTED', `후보 ${r.questionCount}문항 생성`);
    console.log(`후보 ${r.questionCount}문항 생성 (과목 ${r.courses.join(',')}, 단원 ${r.units}개) -> ${r.outDir}`);
    if (r.keptExistingJudgments.length) console.log(`이미 있는 판정 틀 유지: Q${r.keptExistingJudgments.join(', Q')} (덮으려면 --force)`);
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  }
}
