#!/usr/bin/env node
// 사용법: node pack-judgment.mjs <유사.js> <작업폴더> [--original <원본 저장소 경로>] [--curriculum 2022] [--lower] [--no-trim]
// 1) stage-similar: AI Studio JS → <작업폴더>/stage/ (curriculum·과목·등록 요청 틀을 붙인 스테이지)
// 2) build-candidates(하네스): <작업폴더>/candidates, judgment(빈 틀), selection (이미 있는 판정 틀은 덮지 않는다)
// 3) Gemini 에 올릴 묶음 하나를 만든다: <작업폴더>/pack/<stem>.judgment-pack.txt  + REQUEST_TEMPLATE.txt
// 묶음 내용: 요청·출력 규칙 / JUDGMENT_GUIDE 1절(작성자용)·3절(검사 코드) / 4칸 용어 목록 / 후보 단원·소단원·RPM·유형(공통 1벌) /
//            PT·TPL 정의 / 이 과목 선택표 / 빈 판정 틀 1개 / 문항별 발문·보기·정답·해설·용어 후보·그림 단서·원본 유형 힌트
// 문항마다 같은 단원 후보(약 8KB)를 되풀이하지 않고 한 번만 싣는다. 이 과목 선택표가 기본이고, 아래 학년 표까지 올리려면 --lower.
import fs from 'node:fs';
import path from 'node:path';
import { lib, harnessUrl, HARNESS, parseArgs, isMain, readBankFile } from './common.mjs';
import { stageSimilar } from './stage-similar.mjs';

const read = p => fs.readFileSync(p, 'utf8');
const readJ = p => JSON.parse(read(p));
const pad2 = n => String(n).padStart(2, '0');

/** stage + build-candidates (판정 틀은 덮지 않는다). */
export async function prepare({ simPath, workDir, originalPath = null, curriculum = null }) {
  const st = await stageSimilar({ simPath, workDir, originalPath, curriculum });
  const { buildCandidateSet } = await import(harnessUrl('build-candidates.mjs'));
  const r = buildCandidateSet({ jsPath: st.stageJs, outDir: workDir, force: false });
  return { ...st, build: r };
}

function guideParts() {
  const g = read(path.join(HARNESS, 'archive/tools/similar-import/JUDGMENT_GUIDE.md'));
  const i1 = g.indexOf('## 1. 작성자용');
  const i2 = g.indexOf('## 2. 검수자용');
  const i3 = g.indexOf('## 3. 검사 코드 요약');
  if (i1 < 0 || i2 < 0 || i3 < 0) throw new Error('JUDGMENT_GUIDE.md 의 절 제목을 찾지 못했습니다');
  return { author: g.slice(i1, i2).trim(), codes: g.slice(i3).trim() };
}

function questionBlock(c, fp, capTerms) {
  const lines = [`### Q${pad2(c.qid)} · ${c.questionType} · itemFingerprint=${fp}`, '[발문]', c.problem.content];
  if (c.problem.choices.length) lines.push('[보기]', ...c.problem.choices.map((x, i) => `${'①②③④⑤'[i] ?? i + 1} ${x}`));
  lines.push('[정답·해설 — 직접 푼 뒤에 본다]', `정답: ${c.reference.answer}`, c.reference.solution);
  const terms = [...new Map(c.termCandidates.map(t => [`${t.term}|${t.src}`, t])).values()].slice(0, capTerms);
  if (terms.length) lines.push(`[용어 후보(발문·해설에 나온 사전 용어)] ${terms.map(t => `${t.term}(${t.src})`).join(', ')}`);
  const f = c.figure;
  if (f && (f.cueWords.length || f.hasImage)) lines.push(`[그림 단서] 낱말: ${f.cueWords.map(w => w.word).join(', ') || '없음'} · 그림 파일 있음: ${f.hasImage}`);
  if (c.sourceExamHint) lines.push(`[원본 같은 번호 문항이 쓴 유형(참고만)] ${c.sourceExamHint.problemTypeKey} / ${c.sourceExamHint.templateKey || '-'}`);
  return lines.join('\n');
}

export async function buildPack({ simPath, workDir, originalPath = null, curriculum = null, lower = false, trim = true }) {
  const L = await lib();
  const prep = await prepare({ simPath, workDir, originalPath, curriculum });
  const stem = prep.stem;
  const ex = readJ(path.join(workDir, 'candidates/_exam.json'));
  const { emptyJudgment } = await import(harnessUrl('build-candidates.mjs'));
  const defs = readJ(path.join(workDir, 'candidates/_registry-defs.json'));
  const dict = L.loadTermDictionary();
  const n = ex.questionCount;
  const cands = Array.from({ length: n }, (_, i) => readJ(path.join(workDir, 'candidates', `q${pad2(i + 1)}.json`)));
  const fps = Array.from({ length: n }, (_, i) => readJ(path.join(workDir, 'judgment', `q${pad2(i + 1)}.json`)).itemFingerprint);
  const g = guideParts();

  const assemble = ({ capTerms, selectionTexts }) => {
    const skeleton = emptyJudgment(0, '(문항 블록 제목의 itemFingerprint 를 그대로)');
    delete skeleton.review;
    const termsByKind = {};
    for (const t of dict.terms) (termsByKind[t.kind || '기타'] ||= []).push(t.ko);
    const parts = [];
    parts.push(`# 유사 시험지 판정 묶음 — ${stem}
문항 ${n}개. 이 묶음으로 문항마다 판정 JSON(judgment)을 쓴다. 아래 "판정 안내"를 먼저 끝까지 읽는다.

## 출력 규칙 (이 묶음 전용)
- 요청받은 문항 범위의 judgment JSON 만 출력한다. 문항마다 \`\`\`json 코드 블록 하나, 블록 밖 설명은 쓰지 않는다.
- 먼저 발문·보기만 보고 직접 풀어 solveSteps·solvedAnswer 를 쓰고, 그 뒤에 저장 정답과 비교해 answerMatches 를 정직하게 쓴다. 다르면 false 와 answerIssue (맞는 척하지 않는다).
- 블록의 키는 "6. 판정 틀"과 같다. \`review\` 칸은 쓰지 않는다. qid 는 문항 번호(숫자), itemFingerprint 는 문항 블록 제목의 값을 그대로 복사한다.
- 수학 내용(발문·보기·정답·해설)은 고치지 않는다. 틀렸다고 생각하면 answerMatches:false 와 answerIssue 로만 알린다.
- JSON 안의 LaTeX 역슬래시는 \\\\ 로 쓴다 (예: "\\\\overline", "\\\\dfrac"). 인용(quote 등)은 문항 본문에서 한 글자도 바꾸지 않고 복사한다.
- 단원·소단원·RPM 행·PT/TPL 은 "3. 후보"와 "5. 선택표"에 있는 키만 쓴다. 맞는 것이 없을 때만 NONE (+ newKeyProposal).
- 4칸 slots 의 term 은 "4. 용어 목록"에서 고른다(문항 블록의 용어 후보가 우선). 목록에 없는 용어는 candidate:true, parent(목록의 용어), note 를 붙인다.
- 한 번에 많은 문항이면 문항마다 solveSteps 2~6줄을 유지하되 이유 문장은 짧게(한두 문장), 이 문항의 숫자·식을 넣는다.
`);
    parts.push(`# 판정 안내 (JUDGMENT_GUIDE 발췌)\n${g.author}\n\n${g.codes}\n`);
    parts.push(`# 3. 후보 (모든 문항 공통) — 단원 · 소단원 · RPM 행 · 유형(PT/TPL)\n과목: ${ex.courses.join(', ')} · 교육과정 ${ex.curriculum}\n\`\`\`json\n${JSON.stringify(cands[0].units)}\n\`\`\`\n\n## PT/TPL 정의\n\`\`\`json\n${JSON.stringify(defs)}\n\`\`\`\n`);
    parts.push(`# 4. 용어 목록 (4칸 term 에 쓸 수 있는 사전 용어)\n${Object.entries(termsByKind).map(([k, v]) => `## ${k}\n${v.join(', ')}`).join('\n\n')}\n`);
    parts.push(`# 5. 선택표 (유형은 개념 단어로 먼저 찾는다)\n${selectionTexts.join('\n\n')}\n`);
    parts.push(`# 6. 판정 틀 (문항마다 이 틀을 채운다)\n\`\`\`json\n${JSON.stringify(skeleton, null, 1)}\n\`\`\`\n`);
    parts.push(`# 7. 문항 ${n}개\n\n${cands.map((c, i) => questionBlock(c, fps[i], capTerms)).join('\n\n')}\n`);
    return parts.join('\n');
  };

  const selFiles = lower ? ex.selectionFiles : ex.selectionFiles.slice(0, 1);
  const selTexts = selFiles.map(f => read(path.join(workDir, f)));
  let text = assemble({ capTerms: 40, selectionTexts: selTexts });
  const notes = [];
  if (trim && Buffer.byteLength(text) > 400 * 1024) {
    const cut = selTexts.map(t => { const i = t.indexOf('## 아래 학년 유형'); return i > 0 ? t.slice(0, i) : t; });
    text = assemble({ capTerms: 20, selectionTexts: cut });
    notes.push('400KB 초과: 용어 후보 20개로 줄이고 선택표의 "아래 학년 유형" 절을 뺐다');
  }
  const packDir = path.join(workDir, 'pack');
  fs.mkdirSync(packDir, { recursive: true });
  const packPath = path.join(packDir, `${stem}.judgment-pack.txt`);
  fs.writeFileSync(packPath, text, 'utf8');
  const half = Math.ceil(n / 2);
  const tpl = `# 판정 요청 템플릿 (${stem}, ${n}문항) — 새 채팅에 묶음 .txt 를 올린 뒤 아래를 차례로 보낸다
## 전반
첨부한 판정 묶음으로 문항 1~${half}의 judgment JSON만 출력한다. 문항마다 \`\`\`json 블록 하나, 먼저 직접 풀고 answerMatches를 정직하게 쓴다.
## 후반
이어서 문항 ${half + 1}~${n}의 judgment JSON만 출력한다. 같은 방식(문항마다 \`\`\`json 블록 하나).
## 오류 되돌리기 (check-judgment 출력의 문항별 줄을 그대로 붙여 보낸다. 최대 2번)
qNN: <오류 코드와 메시지> 고쳐서 그 문항만 다시 (문항마다 \`\`\`json 블록 하나)
`;
  fs.writeFileSync(path.join(packDir, 'REQUEST_TEMPLATE.txt'), tpl, 'utf8');
  return { stem, packPath, bytes: Buffer.byteLength(text), questionCount: n, half, selection: selFiles, notes, stage: prep.stageJs, keptJudgments: prep.build.keptExistingJudgments };
}

if (isMain(import.meta.url)) {
  const { pos, opt } = parseArgs(process.argv.slice(2), ['--lower', '--no-trim']);
  if (pos.length < 2) { console.error('Usage: node pack-judgment.mjs <유사.js> <작업폴더> [--original <repo path>] [--curriculum 2022] [--lower] [--no-trim]'); process.exit(1); }
  try {
    const r = await buildPack({ simPath: path.resolve(pos[0]), workDir: path.resolve(pos[1]), originalPath: opt['--original'], curriculum: opt['--curriculum'], lower: Boolean(opt['--lower']), trim: !opt['--no-trim'] });
    console.log(JSON.stringify({ ...r, kb: Math.round(r.bytes / 1024) }, null, 1));
    console.log(`\n그다음: node check-judgment.mjs ${r.stage} ${path.join(path.resolve(pos[1]), 'judgment')} --no-status   (하네스: ${HARNESS})`);
  } catch (e) { console.error('ERROR:', e.message); process.exit(1); }
}
