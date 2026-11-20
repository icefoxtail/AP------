import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_REPO_ROOT,
  gitBlobSha1,
  questionUidForSource,
  loadMasters,
  loadTaxonomy,
  loadTermDictionary,
  findBrokenStrings,
  orderItem,
  serializeBank,
  CIRCLED,
  parseObjectiveAnswer,
  formatObjectiveAnswer,
} from './similar-import/lib.mjs';

export { gitBlobSha1 };

const __filename = fileURLToPath(import.meta.url);

// ---------------------------------------------------------------------------
// 이스케이프 벗기기 (구글 문서 마크다운 내보내기)
// ---------------------------------------------------------------------------
// 구글 문서는 본문(코드 블록 밖)에서 마크다운 특수문자 앞에 역슬래시를 붙이고, 역슬래시 자신은 \\ 로 내보낸다.
// 그래서 한 겹만 벗기면 된다:  \$ -> $,  \= -> =,  \\overline -> \overline,  \\\\ -> \\
const ESCAPABLE = '\\\\`*_{}\\[\\]()#+\\-.!$=<>|~';
const UNESCAPE_RE = new RegExp(`\\\\([${ESCAPABLE}])`, 'g');

export function unescapeMarkdown(content) {
  if (typeof content !== 'string') return '';
  return content.replace(UNESCAPE_RE, '$1');
}

/** 코드 블록(JSON) 안에도 구글이 이스케이프를 붙였는지: 홀수 개의 역슬래시 뒤에 마크다운 문장부호가 오면 그렇다. */
export function fenceIsMarkdownEscaped(body) {
  return /(?<!\\)(?:\\\\)*\\[$_=+\-#<>[\]()~*`|!.]/.test(body);
}

/** 제어문자·수식 안 줄바꿈이 있으면 던진다. 조용히 고치지 않는다. */
function assertNoBrokenText(value, label) {
  const broken = findBrokenStrings(value);
  if (broken.length) {
    throw new Error(`${label}: LaTeX가 JSON 이스케이프로 깨졌습니다 (${broken.slice(0, 3).map(b => `${b.kind}@${b.path}`).join(', ')}). 원천에서 역슬래시를 \\\\ 로 써야 합니다.`);
  }
}

/** JSON 블록을 한 번만 읽는다. 못 읽으면 던진다(고쳐 읽지 않는다). */
export function parseJsonBlock(body, label = 'json') {
  const text = fenceIsMarkdownEscaped(body) ? unescapeMarkdown(body) : body;
  let value;
  try {
    value = JSON.parse(text);
  } catch (err) {
    throw new Error(`${label}: JSON을 읽을 수 없습니다 (${err.message})`);
  }
  assertNoBrokenText(value, label);
  return value;
}

// ---------------------------------------------------------------------------
// 마스터 표 / 레지스트리 (옛 이름 유지)
// ---------------------------------------------------------------------------
export function loadMasterTables(repoRoot = DEFAULT_REPO_ROOT) {
  const m = loadMasters(repoRoot);
  return { unitOrders: m.unitOrders, subUnits: m.subUnits };
}

export function loadTaxonomyRegistry(repoRoot = DEFAULT_REPO_ROOT) {
  const t = loadTaxonomy(repoRoot);
  return { activeProblemTypes: new Set(t.pts.keys()), activeTemplates: new Set(t.tpls.keys()) };
}

// ---------------------------------------------------------------------------
// 파싱
// ---------------------------------------------------------------------------
/** 객관식 보기 ①~⑤를 5개 문자열로. 5개가 순서대로 없으면 빈 배열. */
export function parseChoices(raw) {
  const text = String(raw || '').trim();
  if (!text || text === '없음' || text === 'None' || text === '-') return [];
  if (!CIRCLED.every(n => text.includes(n))) return [];
  const idx = CIRCLED.map(n => text.indexOf(n));
  for (let i = 0; i < idx.length - 1; i++) if (idx[i] >= idx[i + 1]) return [];
  return CIRCLED.map((n, i) => text.slice(idx[i] + n.length, i < 4 ? idx[i + 1] : text.length).trim());
}

export function formatExamDisplayTitle(stem, exam = {}) {
  const m = stem.match(/^(\d{2})_([^_]+)_(\d학기)_(중간|기말|1차|2차)(?:_([^_]+))?(?:_유사.*)?$/);
  if (m) {
    const [, yy, school, sem, examName, rest] = m;
    const grade = exam.grade || (rest && (rest.startsWith('고') || rest.startsWith('중')) ? rest : '');
    const subject = rest && !rest.startsWith('고') && !rest.startsWith('중') ? ` ${rest}` : '';
    return `${yy}년 ${school}${grade ? ` ${grade}` : ''} ${sem} ${examName}${subject} 유사문제`;
  }
  const parts = stem.split('_');
  if (parts.length > 0 && /^\d{2}$/.test(parts[0])) parts[0] += '년';
  let s = parts.join(' ');
  if (s.endsWith('유사')) s += '문제';
  return s;
}

function splitFences(md) {
  const parts = [];
  // 구글 문서 내보내기는 코드 블록 줄도 \`\`\`json:exam 처럼 백틱마다 역슬래시를 붙일 때가 있다. 시작·끝 줄 모두 그 형태를 받는다.
  const re = /(?:\\?`){3}([A-Za-z0-9_:\\-]*)[ \t]*\n([\s\S]*?)\n(?:\\?`){3}/g;
  let last = 0;
  let m;
  while ((m = re.exec(md)) !== null) {
    if (m.index > last) parts.push({ type: 'text', text: md.slice(last, m.index) });
    parts.push({ type: 'fence', tag: m[1].replace(/\\/g, ''), body: m[2] });
    last = m.index + m[0].length;
  }
  if (last < md.length) parts.push({ type: 'text', text: md.slice(last) });
  return parts;
}

const META_KEYS = ['sourceQid', 'standardUnitKey', 'variationType', 'subUnitKey'];

function classifyFence(fence, label) {
  // returns {kind:'plan'|'meta', value?, error?}
  const tag = fence.tag || '';
  let value;
  try {
    value = parseJsonBlock(fence.body, label);
  } catch (err) {
    const isMeta = tag === 'json:meta' || (!tag.includes('plan') && /"(?:sourceQid|standardUnitKey|variationType)"/.test(fence.body));
    return { kind: isMeta ? 'meta' : 'plan', error: err.message };
  }
  if (tag === 'json:meta') return { kind: 'meta', value };
  if (tag === 'json:plan') return { kind: 'plan', value };
  if (value && typeof value === 'object' && !Array.isArray(value) && META_KEYS.some(k => k in value)) return { kind: 'meta', value };
  return { kind: 'plan', value };
}

/**
 * 일체형 마크다운을 읽어 시험지 정보와 문항 원자료로 나눈다.
 * 본문(코드 블록 밖)은 한 겹 이스케이프를 벗기고, 코드 블록은 parseJsonBlock 으로 한 번만 읽는다.
 */
export function parseSimilarMd(mdText) {
  const normalized = mdText.replace(/\r\n/g, '\n');
  const parts = splitFences(normalized);
  const examIdx = parts.findIndex(p => p.type === 'fence');
  if (examIdx < 0) throw new Error('MD_PARSE_ERROR: 시험지 정보 JSON 블록이 없습니다');
  let exam;
  try {
    exam = parseJsonBlock(parts[examIdx].body, 'exam');
  } catch (err) {
    throw new Error(`MD_PARSE_ERROR: ${err.message}`);
  }
  if (!exam || typeof exam !== 'object' || !exam.stem) throw new Error('MD_PARSE_ERROR: 시험지 정보에 stem 이 없습니다');

  const sections = [];
  let cur = null;
  for (const p of parts.slice(examIdx + 1)) {
    if (p.type === 'text') {
      const text = unescapeMarkdown(p.text);
      const re = /^## Q(\d+)[ \t]*$/gm;
      let last = 0;
      let m;
      while ((m = re.exec(text)) !== null) {
        if (cur) cur.text += text.slice(last, m.index);
        cur = { qidNum: Number(m[1]), text: '', fences: [] };
        sections.push(cur);
        last = m.index + m[0].length;
      }
      if (cur) cur.text += text.slice(last);
    } else if (cur) {
      cur.fences.push(p);
    }
  }
  if (!sections.length) throw new Error('MD_PARSE_ERROR: 문항 블록(## QNN)이 없습니다');

  const questions = sections.map(sec => {
    const { qidNum } = sec;
    const label = `Q${qidNum}`;
    const formatMatch = sec.text.match(/^-\s*형식:\s*([^\n]+)/m);
    const scoreMatch = sec.text.match(/^-\s*배점:\s*([0-9.]+)/m);
    const fields = {};
    for (const chunk of sec.text.split(/^###\s*/m).slice(1)) {
      const nl = chunk.indexOf('\n');
      const name = (nl < 0 ? chunk : chunk.slice(0, nl)).trim();
      fields[name] = (nl < 0 ? '' : chunk.slice(nl + 1)).trim();
    }
    let plan = null;
    let meta = null;
    let metaError = null;
    let planError = null;
    sec.fences.forEach((fence, i) => {
      const r = classifyFence(fence, `${label} 블록${i + 1}`);
      if (r.kind === 'meta') {
        if (r.error) metaError = r.error;
        else meta = r.value;
      } else if (r.error) planError = r.error;
      else plan = r.value;
    });
    return {
      qidNum,
      rawFormat: formatMatch ? formatMatch[1].trim() : '',
      score: scoreMatch ? Number(scoreMatch[1]) : null,
      content: fields['발문'] ?? '',
      rawChoices: fields['선지'] ?? '',
      choices: parseChoices(fields['선지'] ?? ''),
      answer: fields['정답'] ?? '',
      solution: fields['해설'] ?? '',
      plan,
      meta,
      metaError,
      planError,
    };
  });
  return { exam, questions };
}

// ---------------------------------------------------------------------------
// 검증
// ---------------------------------------------------------------------------
function stripEnvironments(text) {
  return String(text).replace(/\\begin\{([a-zA-Z*]+)\}[\s\S]*?\\end\{\1\}/g, ' ');
}

export function validateConvertedExam({ exam, questionBank, metaRegisterDoc, fourSlotDoc, plans, repoRoot = DEFAULT_REPO_ROOT }) {
  const errors = [];
  const warnings = [];

  if (questionBank.length !== exam.questionCount) errors.push(`QUESTION_COUNT_MISMATCH: expected ${exam.questionCount}, got ${questionBank.length}`);
  const totalScore = questionBank.reduce((a, q) => a + (q.points || 0), 0);
  if (Math.abs(totalScore - exam.totalScore) > 0.01) errors.push(`TOTAL_SCORE_MISMATCH: expected ${exam.totalScore}, got ${totalScore}`);
  questionBank.forEach((q, i) => {
    if (q.id !== i + 1) errors.push(`NON_SEQUENTIAL_ID: index ${i} has id ${q.id}, expected ${i + 1}`);
  });

  for (const q of questionBank) {
    if (q.questionType === '객관식') {
      if (!Array.isArray(q.choices) || q.choices.length !== 5) errors.push(`OBJECTIVE_CHOICES_INVALID: qid ${q.id} has ${q.choices?.length ?? 0} choices`);
      if (!parseObjectiveAnswer(q.answer)) errors.push(`OBJECTIVE_ANSWER_INVALID: qid ${q.id} answer "${q.answer}" is not ①~⑤ (복수 정답은 "②, ④")`);
    } else {
      if (Array.isArray(q.choices) && q.choices.length > 0) errors.push(`SUBJECTIVE_CHOICES_NOT_EMPTY: qid ${q.id}`);
      if (!q.answer || String(q.answer).trim() === '') errors.push(`SUBJECTIVE_ANSWER_EMPTY: qid ${q.id}`);
    }
    if (!q.content) errors.push(`CONTENT_EMPTY: qid ${q.id}`);
    if (!q.solution) errors.push(`SOLUTION_EMPTY: qid ${q.id}`);

    const text = [q.content, q.solution, q.answer, ...(q.choices || [])].join('\n');
    const dollars = (text.match(/(?<!\\)\$/g) || []).length;
    if (dollars % 2 !== 0) errors.push(`UNBALANCED_DOLLARS: qid ${q.id} has odd number of $ (${dollars})`);
    if (/\\\(|\\\)/.test(text)) errors.push(`INVALID_PAREN_MATH_DELIMITER: qid ${q.id} contains \\( or \\)`);
    if (/(?<!\\)\\[$_#=+<>~*`[\]]/.test(text)) errors.push(`ESCAPE_RESIDUAL: qid ${q.id} 이스케이프 찌꺼기(\\$ \\_ \\# \\= \\+ \\< \\> 등)가 남았습니다`);
    // 환경(\begin..\end) 밖의 \\ 는 내용을 바꾸지 않고 경고만 한다.
    const inlineBreaks = [q.content, q.solution, ...(q.choices || [])].filter(s => /\\\\/.test(stripEnvironments(s))).length;
    if (inlineBreaks) warnings.push(`LATEX_BACKSLASH_PAIR_OUTSIDE_ENV: qid ${q.id} (${inlineBreaks}곳의 글, 내용은 그대로 둠)`);
  }

  for (const [name, doc] of [['questionBank', questionBank], ['metaRegister', metaRegisterDoc], ['fourSlot', fourSlotDoc], ['plans', plans?.map(p => p.content)]]) {
    if (!doc) continue;
    for (const b of findBrokenStrings(doc, name)) errors.push(`${b.kind}: ${b.path}`);
  }

  if (metaRegisterDoc.items.length !== questionBank.length) errors.push(`META_REGISTER_ITEM_COUNT_MISMATCH: expected ${questionBank.length}, got ${metaRegisterDoc.items.length}`);
  const seen = new Set();
  for (const item of metaRegisterDoc.items) {
    if (!item.questionUid) errors.push(`META_REGISTER_UID_MISSING: ordinal ${item.sourceOrdinal}`);
    else if (seen.has(item.questionUid)) errors.push(`DUPLICATE_QUESTION_UID: ${item.questionUid}`);
    else seen.add(item.questionUid);
  }

  if (exam.sourceArchiveFile) {
    const orig = path.resolve(repoRoot, 'archive/exams', exam.sourceArchiveFile);
    if (fs.existsSync(orig)) {
      try {
        const ctx = { window: {} };
        vm.createContext(ctx);
        new vm.Script(fs.readFileSync(orig, 'utf8')).runInContext(ctx);
        const n = (ctx.window.questionBank || []).length;
        if (n !== questionBank.length) warnings.push(`ORIGINAL_QUESTION_COUNT_DIFFERENCE: original has ${n}, similar has ${questionBank.length}`);
      } catch (err) {
        warnings.push(`ORIGINAL_EVAL_FAILED: ${err.message}`);
      }
    } else {
      warnings.push(`ORIGINAL_SOURCE_FILE_NOT_FOUND: ${exam.sourceArchiveFile}`);
    }
  }
  return { valid: errors.length === 0, errors, warnings };
}

// ---------------------------------------------------------------------------
// 변환
// ---------------------------------------------------------------------------
const TRACKED_FIELDS = ['standardCourse', 'curriculum', 'courseKey', 'standardUnitKey', 'subUnitKey', 'conceptClusterKey',
  'difficultyBucket', 'problemTypeKey', 'templateKey', 'integrationPattern', 'sourceQid', 'variationType', 'difficultyConfidence'];

const empty = v => v === undefined || v === null || v === '';

/**
 * 한 시험지를 변환한다. 변환기는 원천의 값을 "있으면 쓰고, 없으면 빈 채로" 옮긴다. 기본값을 만들어 넣지 않는다.
 * 단원·RPM·유형·난이도·4칸의 최종 값은 문항별 판정 기록(similar-import)이 정한다.
 */
export function convertSimilarExam({
  mdPath,
  mdContent,
  repoRoot = DEFAULT_REPO_ROOT,
  writeFiles = true,
  outDir = null,
  allowUnreadableSourceMeta = false,
}) {
  const rawText = mdContent !== undefined ? mdContent : fs.readFileSync(mdPath, 'utf8');
  const { exam, questions } = parseSimilarMd(rawText);

  const masters = loadMasters(repoRoot);
  const taxonomy = loadTaxonomyRegistry(repoRoot);
  const dictionary = loadTermDictionary(repoRoot);

  const stem = exam.stem;
  const examDisplayTitle = formatExamDisplayTitle(stem, exam);
  const relSourceDir = path.dirname(exam.sourceArchiveFile || '').replace(/^archive\/exams\//, '').replace(/^original\//, 'similar/');
  const targetDir = outDir ? path.resolve(outDir) : path.resolve(repoRoot, 'archive/exams', relSourceDir);

  const jsFileName = `${stem}.js`;
  const metaRegisterFileName = `${stem}.meta-q01-q${String(questions.length).padStart(2, '0')}.json`;
  const fourSlotFileName = `${stem}.4slot.json`;
  const plansSubdirName = `${stem}_plans`;
  const targetSourceJsPath = path.join('archive/exams', relSourceDir, jsFileName).replaceAll('\\', '/');

  const preErrors = [];
  const questionBank = [];
  const registerItems = [];
  const fourSlotItems = [];
  const plansToWrite = [];
  const incomplete = {};
  const incompleteByQid = {};
  const sourceMetaUnreadable = [];
  const figureMentions = [];
  const unitHoldQids = [];
  let countPtTplMatched = 0;
  let countPtTplCleared = 0;
  let countNewKeyProposals = 0;

  questions.forEach((q, idx) => {
    const qid = idx + 1;
    if (q.qidNum !== qid) preErrors.push(`QID_SEQUENCE: ## Q${q.qidNum} 이(가) ${qid}번째 블록입니다`);
    if (q.planError) preErrors.push(`PLAN_UNREADABLE: Q${qid}: ${q.planError}`);
    if (q.score === null) preErrors.push(`SCORE_MISSING: Q${qid}`);
    let meta = q.meta;
    if (!meta) {
      if (q.metaError && allowUnreadableSourceMeta) {
        sourceMetaUnreadable.push({ qid, reason: q.metaError });
        meta = {};
      } else {
        preErrors.push(`META_UNREADABLE: Q${qid}: ${q.metaError || '메타 블록이 없습니다'}`);
        meta = {};
      }
    }

    const suKey = meta.standardUnitKey ?? '';
    const unitRow = masters.unitOrders.get(suKey);
    if (!unitRow) unitHoldQids.push({ qid, key: suKey || null, type: 'standardUnitKey' });
    const subKey = meta.subUnitKey ?? '';
    const subRow = masters.subUnits.get(subKey);
    const standardUnit = unitRow ? unitRow.label : '';
    const standardUnitOrder = unitRow ? unitRow.order : null;
    const subUnit = subRow ? subRow.labelKo : '';
    const category = subUnit || standardUnit;

    let questionType;
    if (q.rawFormat.includes('객관식')) questionType = '객관식';
    else if (/서답|단답|서술/.test(q.rawFormat)) questionType = /풀이\s*과정|서술|과정을\s*쓰시오|증명/.test(q.content) ? '서술형' : '단답형';
    else {
      preErrors.push(`FORMAT_UNKNOWN: Q${qid} 형식 "${q.rawFormat}"`);
      questionType = '';
    }

    if (/그림|그래프|도형|표\b/.test(q.content)) {
      const hasPlan = Boolean(q.plan && typeof q.plan === 'object' && !q.plan.exempt);
      if (!hasPlan) figureMentions.push({ stem, qid, wording: q.content.slice(0, 80) });
    }

    const candPt = meta.ptTplCandidate?.problemTypeKey || meta.problemTypeKey || '';
    const candTpl = meta.ptTplCandidate?.templateKey || meta.templateKey || '';
    const problemTypeKey = candPt && taxonomy.activeProblemTypes.has(candPt) ? candPt : '';
    const templateKey = candTpl && taxonomy.activeTemplates.has(candTpl) ? candTpl : '';
    if (candPt || candTpl) (problemTypeKey || templateKey ? countPtTplMatched++ : countPtTplCleared++);
    if (meta.newKeyProposal) countNewKeyProposals++;

    const hasPlan = Boolean(q.plan && typeof q.plan === 'object' && !q.plan.exempt);
    let problemPlanRef;
    if (hasPlan) {
      const fileName = `q${String(qid).padStart(2, '0')}-problem.plan.json`;
      problemPlanRef = path.join('archive/exams', relSourceDir, plansSubdirName, fileName).replaceAll('\\', '/');
      plansToWrite.push({ fileName, content: JSON.stringify(q.plan, null, 2) });
    }

    const curriculum = meta.curriculum ?? exam.curriculum ?? '';
    const qItem = {
      id: qid,
      category,
      standardCourse: meta.standardCourse ?? '',
      curriculum,
      curriculumKey: meta.curriculumKey ?? curriculum,
      courseKey: meta.courseKey ?? '',
      standardUnitKey: suKey,
      standardUnit,
      standardUnitOrder,
      subUnitKey: subKey,
      subUnit,
      subUnitConfidence: 'candidate_evidence',
      subUnitClassificationDepth: 'complete_candidate',
      conceptClusterKey: meta.conceptClusterKey ?? '',
      questionType,
      layoutTag: 'grid',
      tags: [questionType, subUnit].filter(Boolean),
      wide: false,
      content: q.content,
      choices: q.choices,
      answer: questionType === '객관식' && parseObjectiveAnswer(q.answer) ? formatObjectiveAnswer(parseObjectiveAnswer(q.answer)) : q.answer,
      solution: q.solution,
      score: q.score,
      points: q.score,
      difficultyBucket: meta.difficultyBucket === undefined || meta.difficultyBucket === '' ? null : Number(meta.difficultyBucket),
      problemTypeKey,
      templateKey,
      crossConceptKeys: meta.crossConceptKeys ?? [],
      conditionKeys: meta.conditionKeys ?? [],
      integrationPattern: meta.integrationPattern ?? '',
      sourceQid: meta.sourceQid === undefined || meta.sourceQid === '' ? null : Number(meta.sourceQid),
      variationType: meta.variationType ?? '',
    };
    if (problemPlanRef) qItem.problemPlanRef = problemPlanRef;
    questionBank.push(orderItem(qItem));

    const missing = TRACKED_FIELDS.filter(f => empty(f === 'difficultyConfidence' ? meta.difficultyConfidence : qItem[f]));
    for (const f of missing) incomplete[f] = (incomplete[f] || 0) + 1;
    if (missing.length) incompleteByQid[qid] = missing;

    const after = {};
    for (const f of ['standardCourse', 'curriculum', 'curriculumKey', 'courseKey', 'standardUnitKey', 'standardUnit', 'standardUnitOrder',
      'subUnitKey', 'subUnit', 'conceptClusterKey', 'problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys',
      'integrationPattern', 'difficultyBucket']) after[f] = qItem[f];
    after.difficultyConfidence = meta.difficultyConfidence ?? '';
    after.difficultyBoundaryFlag = meta.difficultyBoundaryFlag ?? '';
    after.sourceQid = qItem.sourceQid;
    after.variationType = qItem.variationType;
    // 원천 마크다운 머리글이 알려 주는 사실만 옮긴다 (generator·variationNote 는 근거가 없으면 만들지 않는다).
    if (exam.sourceArchiveFile) {
      after.provenance = {
        kind: 'SIMILAR_FROM_ORIGINAL',
        sourceExam: path.basename(exam.sourceArchiveFile, '.js'),
        sourceArchiveFile: exam.sourceArchiveFile.startsWith('archive/') ? exam.sourceArchiveFile : `archive/exams/${exam.sourceArchiveFile}`,
        sourceQid: qItem.sourceQid,
        variationType: qItem.variationType,
        ...(exam.generatedAt ? { createdAt: String(exam.generatedAt).slice(0, 10), createdAtSource: '변환 마크다운 헤더의 generatedAt' } : {}),
      };
    }

    registerItems.push({
      questionUid: questionUidForSource(targetSourceJsPath, qid),
      sourceOrdinal: qid,
      sourceQid: qItem.sourceQid,
      before: null,
      after,
      difficultyConfidence: after.difficultyConfidence,
      difficultyBoundaryFlag: after.difficultyBoundaryFlag,
      difficultyReason: meta.difficultyReason ?? '',
      hold: meta.hold ?? '',
      reason: meta.hold
        ? `HOLD: ${meta.hold}`
        : meta.newKeyProposal
          ? `PROPOSAL: ${JSON.stringify(meta.newKeyProposal)}`
          : 'SOURCE CANDIDATE: converted from markdown (단원·유형·난이도·4칸은 문항별 판정 전 원천 값)',
    });

    if (meta.item4slot) {
      const i4 = meta.item4slot;
      const slots = i4.slots || { given: i4.given || [], goal: i4.goal || [], method: i4.method || [], condition: i4.condition || [] };
      fourSlotItems.push({
        sourceOrdinal: qid,
        format: i4.format ?? '',
        slots,
        steps: i4.steps || [],
        scenarioNote: i4.scenarioNote || '',
        reasons: i4.reasons || {},
        review: { status: 'UNREVIEWED' },
      });
    }
  });

  const jsContent = serializeBank(stem, examDisplayTitle, questionBank);
  const sourceBlobSha1 = gitBlobSha1(jsContent);

  const metaRegisterDoc = {
    schemaVersion: 'archive-reviewed-exam-meta-register-request-v2',
    requestId: `${stem}-candidate-v1`,
    examUid: stem,
    sourceArchiveFile: targetSourceJsPath,
    expectedSourceBlobSha1: sourceBlobSha1,
    expectedQuestionCount: questionBank.length,
    approval: { type: 'CANDIDATE_CREATION_GATE', metadataReviewed: false, reviewStatus: 'review_required', reviewPassCount: 0, evidenceRefs: [] },
    registryChanges: [],
    items: registerItems,
  };

  // 4칸은 용어만 있고 출처 인용이 없으면 만들지 않는다 (지어내서 채우지 않는다).
  let fourSlotDoc = null;
  let isFourSlotComplete = fourSlotItems.length === questionBank.length && fourSlotItems.length > 0;
  if (isFourSlotComplete) {
    for (const item of fourSlotItems) {
      const all = ['given', 'goal', 'method', 'condition'].flatMap(k => item.slots[k] || []);
      if (!item.format || !all.length || !all.every(s => s && typeof s === 'object' && s.src && s.quote)) { isFourSlotComplete = false; break; }
    }
  }
  if (isFourSlotComplete) {
    fourSlotDoc = {
      schemaVersion: 'archive-meta-4slot-v0',
      sourceArchiveFile: targetSourceJsPath.replace(/^archive\/exams\//, ''),
      sourceGitBlobSha: sourceBlobSha1,
      dictionaryVersion: dictionary.version,
      judgedBy: { agent: 'similar-md-importer', at: exam.generatedAt || '' },
      candidates: [],
      selfCheck: { note: '일체형 마크다운 변환 산출물(UNREVIEWED)' },
      items: fourSlotItems,
    };
  }

  const validation = validateConvertedExam({ exam, questionBank, metaRegisterDoc, fourSlotDoc, plans: plansToWrite, repoRoot });
  validation.errors.unshift(...preErrors);
  validation.valid = validation.errors.length === 0;

  const holdReasons = [];
  if (unitHoldQids.length) holdReasons.push(`UNIT_KEY_MISSING_OR_UNKNOWN: ${unitHoldQids.map(k => `Q${k.qid}=${k.key}`).join(', ')}`);
  if (sourceMetaUnreadable.length) holdReasons.push(`SOURCE_META_UNREADABLE: Q${sourceMetaUnreadable.map(s => s.qid).join(', Q')}`);
  const examStatus = { releasable: holdReasons.length === 0, status: holdReasons.length ? '출고 보류' : '변환 완료', holdReasons };

  const writtenFiles = [];
  if (validation.valid && writeFiles) {
    fs.mkdirSync(targetDir, { recursive: true });
    const put = (name, text) => {
      const p = path.join(targetDir, name);
      fs.writeFileSync(p, text, 'utf8');
      writtenFiles.push(p);
    };
    put(jsFileName, jsContent);
    put(metaRegisterFileName, JSON.stringify(metaRegisterDoc, null, 2) + '\n');
    if (fourSlotDoc) put(fourSlotFileName, JSON.stringify(fourSlotDoc, null, 2) + '\n');
    if (plansToWrite.length) {
      fs.mkdirSync(path.join(targetDir, plansSubdirName), { recursive: true });
      for (const p of plansToWrite) put(path.join(plansSubdirName, p.fileName), p.content + '\n');
    }
  }

  return {
    stem,
    exam,
    questionCount: questionBank.length,
    totalScore: Math.round(questionBank.reduce((a, b) => a + (b.points || 0), 0) * 100) / 100,
    validation,
    examStatus,
    writtenFiles,
    stats: {
      incompleteFields: incomplete,
      incompleteByQid,
      sourceMetaUnreadable,
      countPtTplMatched,
      countPtTplCleared,
      countNewKeyProposals,
      isFourSlotComplete,
      figureMentionsWithoutPlan: figureMentions,
    },
    artifacts: { jsContent, metaRegisterDoc, fourSlotDoc, plansToWrite },
  };
}

// CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const args = process.argv.slice(2);
  let mdPath = null;
  let outDir = null;
  let dryRun = false;
  let allow = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--out-dir' && args[i + 1]) outDir = args[++i];
    else if (args[i] === '--dry-run') dryRun = true;
    else if (args[i] === '--allow-unreadable-source-meta') allow = true;
    else if (!args[i].startsWith('--') && !mdPath) mdPath = args[i];
  }
  if (!mdPath) {
    console.error('Usage: node similar-md-to-js.mjs <md-file> [--out-dir <dir>] [--dry-run] [--allow-unreadable-source-meta]');
    process.exit(1);
  }
  try {
    const r = convertSimilarExam({ mdPath, writeFiles: !dryRun, outDir, allowUnreadableSourceMeta: allow });
    console.log(`Converted: ${r.stem}`);
    console.log(`  Questions: ${r.questionCount}, Total score: ${r.totalScore}`);
    console.log(`  Validation: ${r.validation.valid ? 'PASS' : 'FAIL'}   Status: ${r.examStatus.status}`);
    if (r.examStatus.holdReasons.length) console.log('  Hold reasons:', r.examStatus.holdReasons);
    if (Object.keys(r.stats.incompleteFields).length) console.log('  미완 칸(문항 수):', r.stats.incompleteFields);
    if (r.validation.errors.length) console.error('  Errors:', r.validation.errors);
    if (r.validation.warnings.length) console.warn('  Warnings:', r.validation.warnings);
    for (const f of r.writtenFiles) console.log(`    - ${f}`);
    if (!r.validation.valid) process.exit(2);
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    process.exit(1);
  }
}
