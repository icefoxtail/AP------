#!/usr/bin/env node
// 사용법: node stage-similar.mjs <유사.js> <작업폴더> [--original <원본 저장소 경로>] [--curriculum 2022|2015]
// AI Studio 가 만든 유사 JS(메타 없음)를 하네스가 읽는 스테이지로 만든다:
//   <작업폴더>/stage/<stem>.js                    (원본에서 과목·교육과정 등 최소 필드를 붙인 문항 은행)
//   <작업폴더>/stage/<stem>.meta-q01-qNN.json     (apply-judgment 가 요구하는 등록 요청 틀 + provenance)
// 이유: build-candidates 는 문항에 curriculum·standardCourse 가 있어야 하고(없으면 CURRICULUM_UNKNOWN),
//       apply-judgment 는 stem.js 옆의 .meta-qNN.json(변환기 산출물)이 있어야 한다. AI Studio JS 에는 둘 다 없다.
// 문항 내용(발문·보기·정답·해설)은 한 글자도 바꾸지 않는다. 판정 틀의 itemFingerprint 가 이 내용에서 계산된다.
import fs from 'node:fs';
import path from 'node:path';
import { lib, gitShow, bankFromText, readBankFile, stemOf, findOriginalPath, parseArgs, isMain } from './common.mjs';

export function defaultCurriculum(stem, grade) {
  const year = Number((stem.match(/^(\d{2})_/) || [])[1]);
  const need = { 고1: 25, 고2: 26, 고3: 27 }[grade];
  return need && year >= need ? '2022' : '2015';
}

export async function stageSimilar({ simPath, workDir, originalPath = null, curriculum = null }) {
  const L = await lib();
  const stem = stemOf(simPath);
  const orig = originalPath || findOriginalPath(stem);
  const { bank: origBank, examDisplayTitle: origDisplay } = bankFromText(gitShow(orig), orig);
  const { bank } = readBankFile(simPath);
  const grade = (stem.match(/_(중[123]|고[123])_/) || [])[1] || '';
  const curr = curriculum || defaultCurriculum(stem, grade);
  const course = origBank.find(q => q.standardCourse)?.standardCourse || '';
  const targetJs = orig.replace('archive/exams/original/', 'archive/exams/similar/').replace(/[^/]+$/, `${stem}.js`);

  const stageBank = bank.map(q => {
    const sourceQid = Number(q.sourceQid) || q.id;
    return L.orderItem({
      id: q.id, standardCourse: course, curriculum: curr, curriculumKey: curr, courseKey: course,
      questionType: q.questionType, layoutTag: 'grid', tags: [q.questionType], wide: false,
      content: q.content, choices: q.choices || [], answer: q.answer, solution: q.solution,
      score: q.score, points: q.score, sourceQid, variationType: 'STRICT_VARIANT',
    });
  });
  const js = L.serializeBank(stem, origDisplay || stem, stageBank);
  const sha = L.gitBlobSha1(js);
  const items = stageBank.map(q => {
    const after = {};
    for (const f of ['standardCourse', 'curriculum', 'curriculumKey', 'courseKey']) after[f] = q[f];
    Object.assign(after, {
      standardUnitKey: '', standardUnit: '', standardUnitOrder: null, subUnitKey: '', subUnit: '', conceptClusterKey: '',
      problemTypeKey: '', templateKey: '', crossConceptKeys: [], conditionKeys: [], integrationPattern: '', difficultyBucket: null,
      difficultyConfidence: '', difficultyBoundaryFlag: '', sourceQid: q.sourceQid, variationType: q.variationType,
    });
    after.provenance = {
      kind: 'SIMILAR_FROM_ORIGINAL', sourceExam: path.basename(orig, '.js'), sourceArchiveFile: orig,
      sourceQid: q.sourceQid, variationType: q.variationType,
    };
    const note = bank.find(b => b.id === q.id)?.variantNote;
    if (note) after.provenance.variationNote = String(note); // AI Studio 가 문항마다 적은 변형 설명(원천이 적은 값)
    return {
      questionUid: L.questionUidForSource(targetJs, q.id), sourceOrdinal: q.id, sourceQid: q.sourceQid, before: null, after,
      primaryMethod: '', decisiveStep: '', difficultyConfidence: '', difficultyBoundaryFlag: '', difficultyReason: '',
      ptTplCandidate: { problemTypeKey: null, templateKey: null }, hold: '',
      reason: 'SOURCE CANDIDATE: AI Studio 유사 JS 에서 만든 스테이지 (단원·유형·난이도·4칸은 판정 전)',
    };
  });
  const register = {
    schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', requestId: `${stem}-candidate-v1`, examUid: stem,
    sourceArchiveFile: targetJs, expectedSourceBlobSha1: sha, expectedQuestionCount: stageBank.length,
    approval: { type: 'CANDIDATE_CREATION_GATE', metadataReviewed: false, reviewStatus: 'review_required', reviewPassCount: 0, evidenceRefs: [] },
    registryChanges: [], items,
  };
  const stageDir = path.join(workDir, 'stage');
  fs.mkdirSync(stageDir, { recursive: true });
  for (const f of fs.readdirSync(stageDir)) if (f.startsWith(stem + '.')) fs.rmSync(path.join(stageDir, f));
  const stageJs = path.join(stageDir, `${stem}.js`);
  fs.writeFileSync(stageJs, js, 'utf8');
  const nn = String(stageBank.length).padStart(2, '0');
  fs.writeFileSync(path.join(stageDir, `${stem}.meta-q01-q${nn}.json`), JSON.stringify(register, null, 2) + '\n', 'utf8');
  return { stem, stageJs, original: orig, targetJs, curriculum: curr, course, count: stageBank.length };
}

if (isMain(import.meta.url)) {
  const { pos, opt } = parseArgs(process.argv.slice(2));
  if (pos.length < 2) { console.error('Usage: node stage-similar.mjs <유사.js> <작업폴더> [--original <repo path>] [--curriculum 2022]'); process.exit(1); }
  try {
    const r = await stageSimilar({ simPath: path.resolve(pos[0]), workDir: path.resolve(pos[1]), originalPath: opt['--original'], curriculum: opt['--curriculum'] });
    console.log(JSON.stringify(r));
  } catch (e) { console.error('ERROR:', e.message); process.exit(1); }
}
