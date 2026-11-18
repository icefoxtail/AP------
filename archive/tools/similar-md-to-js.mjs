import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { loadUnitOrders } from './archive-unit-order.mjs';
import { questionUidForSource } from './meta-foundation/rpm-active-resolver.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_REPO_ROOT = path.resolve(__dirname, '../..');

export function gitBlobSha1(content) {
  const buf = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
  const header = Buffer.from(`blob ${buf.length}\0`);
  return crypto.createHash('sha1').update(Buffer.concat([header, buf])).digest('hex');
}

/**
 * Unescapes Google Docs markdown export backslash escapes by one layer.
 * Specifically:
 * - \_ -> _
 * - \# -> #
 * - \[ -> [
 * - \] -> ]
 * - \- -> -
 * - \` -> `
 * - \* -> *
 * - \~ -> ~
 * - \+ -> +
 * - \. -> .
 * - \\ -> \ (e.g. \\overline -> \overline, \\\\ -> \\)
 */
export function unescapeMarkdown(content) {
  if (typeof content !== 'string') return '';
  // 1. Google Docs markdown export escapes punctuation
  let res = content.replace(/\\([$#_~*`+=\-[\]()<>{}.|!])/g, '$1');
  // 2. Google Docs escapes LaTeX command backslashes: \\frac -> \frac, \\overline -> \overline, etc.
  // When a double backslash is followed by an alphabetic character, unescape to single backslash.
  res = res.replace(/\\\\([a-zA-Z])/g, '\\$1');
  return res;
}

/**
 * Loads master table data:
 * - Unit orders & labels from docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md
 * - SubUnit details from archive/data/master_tables/js_archive_tag_master.json
 */
export function loadMasterTables(repoRoot = DEFAULT_REPO_ROOT) {
  const unitOrderData = loadUnitOrders(repoRoot);
  const tagMasterPath = path.resolve(repoRoot, 'archive/data/master_tables/js_archive_tag_master.json');
  const tagMaster = JSON.parse(fs.readFileSync(tagMasterPath, 'utf8'));

  const subUnits = new Map();
  for (const row of tagMaster) {
    if (row.key && (row.keyType === 'subUnitKey' || row.subUnitKey || row.keyType === 'conceptClusterKey')) {
      subUnits.set(row.key, {
        subUnitKey: row.key,
        labelKo: row.labelKo || row.subUnit || '',
        parentKey: row.parentKey || row.standardUnitKey || '',
        standardUnitKey: row.standardUnitKey || '',
      });
    }
  }

  return {
    unitOrders: unitOrderData.orders,
    subUnits,
  };
}

/**
 * Loads compiled active taxonomy registry:
 * Returns sets of active problemTypeKeys and templateKeys.
 */
export function loadTaxonomyRegistry(repoRoot = DEFAULT_REPO_ROOT) {
  const taxPath = path.resolve(repoRoot, 'archive/data/meta-foundation/compiled/taxonomy_registry.json');
  const taxonomy = JSON.parse(fs.readFileSync(taxPath, 'utf8'));

  const activeProblemTypes = new Set();
  const activeTemplates = new Set();

  const ptRows = Array.isArray(taxonomy.problemTypes)
    ? taxonomy.problemTypes
    : Object.values(taxonomy.problemTypes || {});
  for (const pt of ptRows) {
    if (pt && pt.problemTypeKey) activeProblemTypes.add(pt.problemTypeKey);
  }

  const tplRows = Array.isArray(taxonomy.templates)
    ? taxonomy.templates
    : Object.values(taxonomy.templates || {});
  for (const tpl of tplRows) {
    if (tpl && tpl.templateKey) activeTemplates.add(tpl.templateKey);
  }

  return { activeProblemTypes, activeTemplates };
}

/**
 * Loads all crosswalk records from archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/
 */
export function loadCrosswalkRecords(repoRoot = DEFAULT_REPO_ROOT) {
  const cwDir = path.resolve(repoRoot, 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0');
  const records = [];

  if (fs.existsSync(cwDir)) {
    const files = fs.readdirSync(cwDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(cwDir, f), 'utf8'));
        const rows = Array.isArray(data.records)
          ? data.records
          : Array.isArray(data.rows)
          ? data.rows
          : [];
        for (const r of rows) {
          if (r && r.rpmPath && r.id) {
            records.push(r);
          }
        }
      } catch {
        // ignore broken optional files
      }
    }
  }

  return records;
}

const CIRCLED_NUMS = ['①', '②', '③', '④', '⑤'];

/**
 * Parses choices section:
 * Extracts ①~⑤ into 5 strings without the circled numbers.
 */
export function parseChoices(raw) {
  const text = String(raw || '').trim();
  if (!text || text === '없음' || text === 'None' || text === '-') {
    return [];
  }

  const hasAllCircled = CIRCLED_NUMS.every(num => text.includes(num));
  if (!hasAllCircled) {
    return [];
  }

  const indices = CIRCLED_NUMS.map(num => text.indexOf(num));
  // Verify strict ordering
  for (let i = 0; i < indices.length - 1; i++) {
    if (indices[i] >= indices[i + 1]) {
      return [];
    }
  }

  const choices = [];
  for (let i = 0; i < CIRCLED_NUMS.length; i++) {
    const start = indices[i] + CIRCLED_NUMS[i].length;
    const end = i < CIRCLED_NUMS.length - 1 ? indices[i + 1] : text.length;
    choices.push(text.slice(start, end).trim());
  }

  return choices;
}

/**
 * Formats user-facing examDisplayTitle from stem and exam info.
 */
export function formatExamDisplayTitle(stem, exam = {}) {
  const m = stem.match(/^(\d{2})_([^_]+)_(\d학기)_(중간|기말|1차|2차)(?:_([^_]+))?(?:_유사.*)?$/);
  if (m) {
    const [, yy, school, sem, examName, rest] = m;
    const grade = exam.grade || (rest && (rest.startsWith('고') || rest.startsWith('중')) ? rest : '');
    const subject = rest && !rest.startsWith('고') && !rest.startsWith('중') ? ` ${rest}` : '';
    const gradePart = grade ? ` ${grade}` : '';
    return `${yy}년 ${school}${gradePart} ${sem} ${examName}${subject} 유사문제`;
  }

  const parts = stem.split('_');
  if (parts.length > 0 && /^\d{2}$/.test(parts[0])) {
    parts[0] = parts[0] + '년';
  }
  let s = parts.join(' ');
  if (s.endsWith('유사')) s += '문제';
  return s;
}

/**
 * Parses the raw Markdown text into exam metadata and an array of raw question blocks.
 */
export function safeJsonParse(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch (firstErr) {
    let repaired = jsonStr
      .replace(/\\(bar|begin|beta)/g, '\\\\$1')
      .replace(/\\(frac)/g, '\\\\$1')
      .replace(/\\(times|text|tan|theta)/g, '\\\\$1')
      .replace(/\\(quad|qquad)/g, '\\\\$1')
      .replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\');
    return JSON.parse(repaired);
  }
}

/**
 * Parses a similar exam markdown file into structured exam and question objects.
 * Supports both explicit code fence tags (```json:exam, ```json:meta, ```json:plan)
 * and generic/bare code fence tags produced by Google Docs markdown export (```).
 */
export function parseSimilarMd(mdText) {
  const normalized = mdText.replace(/\r\n/g, '\n');

  // 1. Extract exam json block
  const examBlockMatch = normalized.match(/```(?:json:exam|json)?\s*\n([\s\S]*?)\n```/);
  if (!examBlockMatch) {
    throw new Error('MD_PARSE_ERROR: Missing ```json:exam``` block');
  }

  let exam;
  try {
    exam = safeJsonParse(examBlockMatch[1]);
  } catch (err) {
    throw new Error(`MD_PARSE_ERROR: Invalid json:exam block: ${err.message}`);
  }

  // 2. Split questions by '## Q'
  const questionRegex = /\n## Q(\d+)\s*\n([\s\S]*?)(?=\n## Q\d+\s*\n|$)/g;
  const rawQuestions = [];
  let m;

  // Search after exam block
  const bodyText = normalized.slice(examBlockMatch.index + examBlockMatch[0].length);
  const fullSearchText = '\n' + bodyText;

  while ((m = questionRegex.exec(fullSearchText)) !== null) {
    const qidNum = Number(m[1]);
    const blockContent = m[2];
    rawQuestions.push({ qidNum, blockContent });
  }

  if (rawQuestions.length === 0) {
    throw new Error('MD_PARSE_ERROR: No question blocks (## QNN) found');
  }

  const questions = [];
  for (const rq of rawQuestions) {
    const { qidNum, blockContent } = rq;

    // Header info: - 형식: ..., - 배점: ...
    const formatMatch = blockContent.match(/^-\s*형식:\s*([^\n]+)/m);
    const scoreMatch = blockContent.match(/^-\s*배점:\s*([0-9.]+)/m);

    const rawFormat = formatMatch ? formatMatch[1].trim() : '객관식';
    const score = scoreMatch ? Number(scoreMatch[1]) : 0;

    // Subsections: 발문, 선지, 정답, 해설
    const stemMatch = blockContent.match(/###\s*발문\s*\n([\s\S]*?)(?=\n###\s*선지|\n###\s*정답|\n```)/);
    const choicesMatch = blockContent.match(/###\s*선지\s*\n([\s\S]*?)(?=\n###\s*정답|\n```)/);
    const answerMatch = blockContent.match(/###\s*정답\s*\n([\s\S]*?)(?=\n###\s*해설|\n```)/);
    const solutionMatch = blockContent.match(/###\s*해설\s*\n([\s\S]*?)(?=\n```|$)/);

    const content = stemMatch ? stemMatch[1].trim() : '';
    const rawChoices = choicesMatch ? choicesMatch[1].trim() : '';
    const answer = answerMatch ? answerMatch[1].trim() : '';
    const solution = solutionMatch ? solutionMatch[1].trim() : '';

    // Code blocks: can be tagged (```json:plan, ```json:meta) or generic (```)
    let plan = null;
    let meta = null;
    const codeBlocks = [...blockContent.matchAll(/```(?:[a-zA-Z0-9_:-]+)?\s*\n([\s\S]*?)\n```/g)];
    for (const cb of codeBlocks) {
      const rawBlock = cb[1].trim();
      if (rawBlock === 'NONE' || rawBlock === '"NONE"') {
        continue;
      }
      try {
        const parsed = safeJsonParse(rawBlock);
        if (parsed.sourceQid !== undefined || parsed.standardUnitKey !== undefined || parsed.variationType !== undefined) {
          meta = parsed;
        } else {
          plan = parsed;
        }
      } catch {
        // Ignored
      }
    }

    if (!meta) {
      throw new Error(`MD_PARSE_ERROR: Question Q${qidNum} is missing valid meta block`);
    }

    const choices = parseChoices(rawChoices);

    questions.push({
      qidNum,
      rawFormat,
      score,
      content,
      choices,
      answer,
      solution,
      plan,
      meta,
    });
  }

  return { exam, questions };
}

/**
 * Validates the converted exam artifact in accordance with section 7 rules.
 */
export function validateConvertedExam({
  exam,
  questions,
  questionBank,
  metaRegisterDoc,
  fourSlotDoc,
  plans,
  repoRoot = DEFAULT_REPO_ROOT,
}) {
  const errors = [];
  const warnings = [];

  // 1. Question count and score check
  if (questionBank.length !== exam.questionCount) {
    errors.push(`QUESTION_COUNT_MISMATCH: expected ${exam.questionCount}, got ${questionBank.length}`);
  }

  const totalScore = questionBank.reduce((acc, q) => acc + (q.points || q.score || 0), 0);
  if (Math.abs(totalScore - exam.totalScore) > 0.01) {
    errors.push(`TOTAL_SCORE_MISMATCH: expected ${exam.totalScore}, got ${totalScore}`);
  }

  // 2. Sequential IDs from 1
  for (let i = 0; i < questionBank.length; i++) {
    if (questionBank[i].id !== i + 1) {
      errors.push(`NON_SEQUENTIAL_ID: index ${i} has id ${questionBank[i].id}, expected ${i + 1}`);
    }
  }

  // 3. Choices & answers check
  for (const q of questionBank) {
    if (q.questionType === '객관식') {
      if (!Array.isArray(q.choices) || q.choices.length !== 5) {
        errors.push(`OBJECTIVE_CHOICES_INVALID: qid ${q.id} has ${q.choices?.length ?? 0} choices`);
      }
      if (!CIRCLED_NUMS.includes(q.answer)) {
        errors.push(`OBJECTIVE_ANSWER_INVALID: qid ${q.id} answer "${q.answer}" is not ①~⑤`);
      }
    } else {
      if (Array.isArray(q.choices) && q.choices.length > 0) {
        errors.push(`SUBJECTIVE_CHOICES_NOT_EMPTY: qid ${q.id} has choices for non-objective question`);
      }
      if (!q.answer || typeof q.answer !== 'string' || q.answer.trim() === '') {
        errors.push(`SUBJECTIVE_ANSWER_EMPTY: qid ${q.id} has empty answer`);
      }
    }

    // 4. Latex dollar matching and escape residuals check
    const textToCheck = `${q.content}\n${q.solution}\n${(q.choices || []).join('\n')}`;
    const dollarCount = (textToCheck.match(/(?<!\\)\$/g) || []).length;
    if (dollarCount % 2 !== 0) {
      errors.push(`UNBALANCED_DOLLARS: qid ${q.id} has odd number of $ (${dollarCount})`);
    }

    if (/\\\(|\\\)/.test(textToCheck)) {
      errors.push(`INVALID_PAREN_MATH_DELIMITER: qid ${q.id} contains \\( or \\)`);
    }

    // Check for obvious Google Docs markdown escape leftovers
    if (/\\[_#[\]`~]/.test(textToCheck)) {
      warnings.push(`POSSIBLE_ESCAPE_RESIDUAL: qid ${q.id} contains backslash-escaped punctuation`);
    }
  }

  // 5. Registration doc checks
  if (metaRegisterDoc.items.length !== questionBank.length) {
    errors.push(`META_REGISTER_ITEM_COUNT_MISMATCH: expected ${questionBank.length}, got ${metaRegisterDoc.items.length}`);
  }

  const seenUids = new Set();
  for (const item of metaRegisterDoc.items) {
    if (!item.questionUid) {
      errors.push(`META_REGISTER_UID_MISSING: ordinal ${item.sourceOrdinal}`);
    } else if (seenUids.has(item.questionUid)) {
      errors.push(`DUPLICATE_QUESTION_UID: ${item.questionUid}`);
    } else {
      seenUids.add(item.questionUid);
    }
  }

  // 6. Original exam comparison check
  if (exam.sourceArchiveFile) {
    const origPath = path.resolve(repoRoot, 'archive/exams', exam.sourceArchiveFile);
    if (fs.existsSync(origPath)) {
      try {
        const origContent = fs.readFileSync(origPath, 'utf8');
        const origCtx = { window: {} };
        vm.createContext(origCtx);
        new vm.Script(origContent).runInContext(origCtx);
        const origBank = origCtx.window.questionBank || [];
        if (origBank.length !== questionBank.length) {
          warnings.push(`ORIGINAL_QUESTION_COUNT_DIFFERENCE: original has ${origBank.length}, similar has ${questionBank.length}`);
        }
      } catch (err) {
        warnings.push(`ORIGINAL_EVAL_FAILED: ${err.message}`);
      }
    } else {
      warnings.push(`ORIGINAL_SOURCE_FILE_NOT_FOUND: ${exam.sourceArchiveFile}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Main conversion routine for a single similar exam markdown file.
 */
export function convertSimilarExam({
  mdPath,
  mdContent,
  repoRoot = DEFAULT_REPO_ROOT,
  writeFiles = true,
  outDir = null,
  unescape = false,
}) {
  const rawText = mdContent !== undefined
    ? mdContent
    : fs.readFileSync(mdPath, 'utf8');

  const processedText = unescape ? unescapeMarkdown(rawText) : rawText;

  // 1. Parse markdown
  const { exam, questions } = parseSimilarMd(processedText);

  // 2. Load masters and registries
  const masterTables = loadMasterTables(repoRoot);
  const taxonomy = loadTaxonomyRegistry(repoRoot);
  const crosswalkRecords = loadCrosswalkRecords(repoRoot);

  const stem = exam.stem;
  const examDisplayTitle = formatExamDisplayTitle(stem, exam);

  // Destination directory
  // exam.sourceArchiveFile e.g. "original/high/h1/1final/26_효천고_1학기_기말_고1_기출.js"
  const relSourceDir = path.dirname(exam.sourceArchiveFile).replace(/^archive\/exams\//, '').replace(/^original\//, 'similar/');
  const targetDir = outDir
    ? path.resolve(outDir)
    : path.resolve(repoRoot, 'archive/exams', relSourceDir);

  const jsFileName = `${stem}.js`;
  const metaRegisterFileName = `${stem}.meta-q01-q${String(questions.length).padStart(2, '0')}.json`;
  const fourSlotFileName = `${stem}.4slot.json`;
  const plansSubdirName = `${stem}_plans`;

  const questionBank = [];
  const registerItems = [];
  const fourSlotItems = [];
  const plansToWrite = [];

  let countRpmMatched = 0;
  let countRpmUnmatched = 0;
  let countPtTplMatched = 0;
  let countPtTplCleared = 0;
  let countNewKeyProposals = 0;
  const missingMasterKeys = [];
  const figureRequiredQuestions = [];

  for (let idx = 0; idx < questions.length; idx++) {
    const q = questions[idx];
    const qid = idx + 1;
    const meta = q.meta || {};

    // Standard Unit & Order
    const suKey = meta.standardUnitKey;
    const unitOrderObj = masterTables.unitOrders.get(suKey);
    if (!unitOrderObj) {
      missingMasterKeys.push({ qid, key: suKey, type: 'standardUnitKey' });
    }
    const standardUnit = unitOrderObj ? unitOrderObj.label : (meta.standardUnit || '');
    const standardUnitOrder = unitOrderObj ? unitOrderObj.order : (meta.standardUnitOrder ?? 999);

    // SubUnit
    const subUnitKey = meta.subUnitKey;
    const subUnitObj = masterTables.subUnits.get(subUnitKey);
    if (!subUnitObj) {
      missingMasterKeys.push({ qid, key: subUnitKey, type: 'subUnitKey' });
    }
    const subUnit = subUnitObj ? subUnitObj.labelKo : (meta.subUnit || '');

    const category = subUnit || standardUnit;
    const originalCategory = category;

    // Question type
    let questionType = '객관식';
    if (q.rawFormat.includes('서답형') || q.rawFormat.includes('단답') || q.rawFormat.includes('서술')) {
      const isProofOrProcess = /풀이\s*과정|서술|과정을\s*쓰시오|증명/.test(q.content);
      questionType = isProofOrProcess ? '서술형' : '단답형';
    }

    // Tags
    const tags = [questionType, subUnit].filter(Boolean);
    if (/도형|그림|삼각형|사각형|원\b|부채꼴/.test(q.content) && !tags.includes('도형')) tags.push('도형');
    if (/그래프/.test(q.content) && !tags.includes('그래프')) tags.push('그래프');
    if (/\[표\]|표를\s*참고|다음\s*표/.test(q.content) && !tags.includes('표')) tags.push('표');

    // Figure need check (Section 6)
    const hasVisualMention = /그림|그래프|도형|표/.test(q.content);
    const hasPlan = Boolean(q.plan && !q.plan.exempt && typeof q.plan === 'object');
    if (hasVisualMention && !hasPlan) {
      figureRequiredQuestions.push({
        stem,
        qid,
        wording: q.content.slice(0, 80),
        judgment: /길이|각도|점|그래프\s*를\s*보고|그림과\s*같이/.test(q.content)
          ? '그림의 수치/형상을 읽어야 함'
          : '글과 조건만으로 풀이 가능',
      });
    }

    // Problem Type & Template Key check against active taxonomy
    const candidatePt = meta.ptTplCandidate?.problemTypeKey || meta.problemTypeKey;
    const candidateTpl = meta.ptTplCandidate?.templateKey || meta.templateKey;

    let problemTypeKey = '';
    let templateKey = '';

    if (candidatePt && taxonomy.activeProblemTypes.has(candidatePt)) {
      problemTypeKey = candidatePt;
    }
    if (candidateTpl && taxonomy.activeTemplates.has(candidateTpl)) {
      templateKey = candidateTpl;
    }

    if (candidatePt || candidateTpl) {
      if (problemTypeKey || templateKey) {
        countPtTplMatched++;
      } else {
        countPtTplCleared++;
      }
    }

    if (meta.newKeyProposal) {
      countNewKeyProposals++;
    }

    // RPM Primary matching
    let matchedRpmRow = null;
    if (meta.rpm && meta.rpm.majorUnit && meta.rpm.midUnit && meta.rpm.l3 && meta.rpm.l4) {
      const matches = crosswalkRecords.filter(r =>
        r.rpmPath &&
        r.rpmPath.majorUnit === meta.rpm.majorUnit &&
        r.rpmPath.midUnit === meta.rpm.midUnit &&
        r.rpmPath.l3 === meta.rpm.l3 &&
        r.rpmPath.l4 === meta.rpm.l4
      );
      if (matches.length === 1) {
        matchedRpmRow = matches[0];
        countRpmMatched++;
      } else {
        countRpmUnmatched++;
      }
    } else {
      countRpmUnmatched++;
    }

    // Plan reference
    let problemPlanRef = undefined;
    if (hasPlan) {
      const planRelPath = path.join(
        'archive/exams',
        relSourceDir,
        plansSubdirName,
        `q${String(qid).padStart(2, '0')}-problem.plan.json`
      ).replaceAll('\\', '/');

      problemPlanRef = planRelPath;
      plansToWrite.push({
        fileName: `q${String(qid).padStart(2, '0')}-problem.plan.json`,
        content: JSON.stringify(q.plan, null, 2),
      });
    }

    // Construct Question Bank Item (Strict field order matching canonical example)
    const qItem = {
      id: qid,
      level: meta.level || '중',
      category,
      originalCategory,
      standardCourse: meta.standardCourse || exam.grade || '',
      curriculum: meta.curriculum || exam.curriculum || '2022',
      curriculumKey: meta.curriculumKey || meta.curriculum || exam.curriculum || '2022',
      courseKey: meta.courseKey || meta.standardCourse || exam.grade || '',
      standardUnitKey: suKey,
      standardUnit,
      standardUnitOrder,
      subUnitKey,
      subUnit,
      subUnitConfidence: 'candidate_evidence',
      subUnitClassificationDepth: 'complete_candidate',
      conceptClusterKey: meta.conceptClusterKey || '',
      questionType,
      layoutTag: 'grid',
      tags,
      wide: false,
      content: q.content,
      choices: q.choices || [],
      answer: q.answer,
      solution: q.solution,
      score: q.score,
      points: q.score,
      difficultyBucket: Number(meta.difficultyBucket || 1),
      problemTypeKey,
      templateKey,
      crossConceptKeys: meta.crossConceptKeys || [],
      conditionKeys: meta.conditionKeys || [],
      integrationPattern: meta.integrationPattern || 'NONE',
    };

    if (matchedRpmRow) {
      qItem.rpmPrimaryL1 = matchedRpmRow.rpmPath.majorUnit;
      qItem.rpmPrimaryL2 = matchedRpmRow.rpmPath.midUnit;
      qItem.rpmPrimaryL3 = matchedRpmRow.rpmPath.l3;
      qItem.rpmPrimaryL4 = matchedRpmRow.rpmPath.l4;
      qItem.rpmPrimaryRecordId = matchedRpmRow.id;
    }

    qItem.sourceQid = Number(meta.sourceQid || qid);
    qItem.variationType = meta.variationType || 'STRICT_VARIANT';

    if (problemPlanRef) {
      qItem.problemPlanRef = problemPlanRef;
    }

    questionBank.push(qItem);

    // Register Request Item
    const targetSourceJsPath = path.join('archive/exams', relSourceDir, jsFileName).replaceAll('\\', '/');
    const questionUid = questionUidForSource(targetSourceJsPath, qid);

    const afterBlock = {
      standardCourse: qItem.standardCourse,
      curriculum: qItem.curriculum,
      curriculumKey: qItem.curriculumKey,
      courseKey: qItem.courseKey,
      standardUnitKey: qItem.standardUnitKey,
      standardUnit: qItem.standardUnit,
      standardUnitOrder: qItem.standardUnitOrder,
      subUnitKey: qItem.subUnitKey,
      subUnit: qItem.subUnit,
      conceptClusterKey: qItem.conceptClusterKey,
      problemTypeKey: qItem.problemTypeKey,
      templateKey: qItem.templateKey,
      crossConceptKeys: qItem.crossConceptKeys,
      conditionKeys: qItem.conditionKeys,
      integrationPattern: qItem.integrationPattern,
      level: qItem.level,
      difficultyBucket: qItem.difficultyBucket,
      difficultyConfidence: meta.difficultyConfidence || 'high',
      difficultyBoundaryFlag: meta.difficultyBoundaryFlag || 'NONE',
    };

    if (matchedRpmRow) {
      afterBlock.rpmPrimaryL1 = qItem.rpmPrimaryL1;
      afterBlock.rpmPrimaryL2 = qItem.rpmPrimaryL2;
      afterBlock.rpmPrimaryL3 = qItem.rpmPrimaryL3;
      afterBlock.rpmPrimaryL4 = qItem.rpmPrimaryL4;
      afterBlock.rpmPrimaryRecordId = qItem.rpmPrimaryRecordId;
    }

    afterBlock.sourceQid = qItem.sourceQid;
    afterBlock.variationType = qItem.variationType;

    const regItem = {
      questionUid,
      sourceOrdinal: qid,
      sourceQid: qItem.sourceQid,
      before: null,
      after: afterBlock,
      primaryMethod: meta.primaryMethod || '',
      decisiveStep: meta.decisiveStep || '',
      difficultyConfidence: meta.difficultyConfidence || 'high',
      difficultyBoundaryFlag: meta.difficultyBoundaryFlag || 'NONE',
      difficultyReason: meta.difficultyReason || '',
      ptTplCandidate: meta.ptTplCandidate || {
        problemTypeKey: candidatePt || null,
        templateKey: candidateTpl || null,
      },
      hold: meta.hold || '',
      reason: meta.hold
        ? `HOLD: ${meta.hold}`
        : meta.newKeyProposal
        ? `PROPOSAL: ${JSON.stringify(meta.newKeyProposal)}`
        : 'SOURCE CANDIDATE: converted from markdown',
    };

    registerItems.push(regItem);

    // 4Slot Item
    if (meta.item4slot) {
      const i4 = meta.item4slot;
      const slots = i4.slots || (i4.given || i4.goal || i4.method || i4.condition ? {
        given: i4.given || [],
        goal: i4.goal || [],
        method: i4.method || [],
        condition: i4.condition || [],
      } : { given: [], goal: [], method: [], condition: [] });

      fourSlotItems.push({
        sourceOrdinal: qid,
        format: i4.format || (questionType === '객관식' ? '단일 정답' : '단답'),
        slots,
        steps: i4.steps || [],
        scenarioNote: i4.scenarioNote || '',
        reasons: i4.reasons || {},
        review: { status: 'UNREVIEWED' },
      });
    }
  }

  // Generate JS code
  const jsLines = [
    `window.examTitle = ${JSON.stringify(stem)};`,
    `window.examDisplayTitle = ${JSON.stringify(examDisplayTitle)};`,
    '',
    'window.questionBank = [',
    questionBank
      .map(q => JSON.stringify(q, null, 2).split('\n').map(l => '  ' + l).join('\n'))
      .join(',\n'),
    '];\n',
  ];
  const jsContent = jsLines.join('\n').replace(/\r\n/g, '\n');
  const sourceBlobSha1 = gitBlobSha1(jsContent);

  // Generate Register Request doc
  const targetSourceJsPath = path.join('archive/exams', relSourceDir, jsFileName).replaceAll('\\', '/');
  const metaRegisterDoc = {
    schemaVersion: 'archive-reviewed-exam-meta-register-request-v2',
    requestId: `${stem}-candidate-v1`,
    examUid: stem,
    sourceArchiveFile: targetSourceJsPath,
    expectedSourceBlobSha1: sourceBlobSha1,
    expectedQuestionCount: questionBank.length,
    approval: {
      type: 'CANDIDATE_CREATION_GATE',
      metadataReviewed: false,
      reviewStatus: 'review_required',
      reviewPassCount: 0,
      evidenceRefs: [],
    },
    registryChanges: [],
    items: registerItems,
  };

  // Check 4Slot completeness
  let fourSlotDoc = null;
  let isFourSlotComplete = true;
  if (fourSlotItems.length === questionBank.length) {
    for (const item of fourSlotItems) {
      const allSlots = [
        ...(item.slots.given || []),
        ...(item.slots.goal || []),
        ...(item.slots.method || []),
        ...(item.slots.condition || []),
      ];
      // Check if slot items have quote/src and are not empty
      const hasQuotes = allSlots.length > 0 && allSlots.every(s => s && s.src && s.quote);
      if (!hasQuotes || !item.format) {
        isFourSlotComplete = false;
        break;
      }
    }
  } else {
    isFourSlotComplete = false;
  }

  if (isFourSlotComplete) {
    fourSlotDoc = {
      schemaVersion: 'archive-meta-4slot-v0',
      sourceArchiveFile: targetSourceJsPath,
      sourceGitBlobSha: sourceBlobSha1,
      dictionaryVersion: 'term-dict-v1.6-2026-11-04',
      judgedBy: {
        agent: 'similar-md-importer',
        at: exam.generatedAt || new Date().toISOString().slice(0, 10),
      },
      candidates: [],
      selfCheck: {
        note: '일체형 마크다운 변환 산출물(UNREVIEWED)',
      },
      items: fourSlotItems,
    };
  }

  // 3. Validation
  const validation = validateConvertedExam({
    exam,
    questions,
    questionBank,
    metaRegisterDoc,
    fourSlotDoc,
    plans: plansToWrite,
    repoRoot,
  });

  if (missingMasterKeys.length > 0) {
    validation.warnings.push(
      `MISSING_MASTER_KEYS: ${missingMasterKeys.map(k => `Q${k.qid}:${k.type}=${k.key}`).join(', ')}`
    );
  }

  // 4. Write files if valid and requested
  const writtenFiles = [];
  if (validation.valid && writeFiles) {
    fs.mkdirSync(targetDir, { recursive: true });

    // 1. JS file
    const jsPath = path.join(targetDir, jsFileName);
    fs.writeFileSync(jsPath, jsContent, 'utf8');
    writtenFiles.push(jsPath);

    // 2. Meta register json
    const metaPath = path.join(targetDir, metaRegisterFileName);
    fs.writeFileSync(metaPath, JSON.stringify(metaRegisterDoc, null, 2) + '\n', 'utf8');
    writtenFiles.push(metaPath);

    // 3. 4Slot json (if complete)
    if (fourSlotDoc) {
      const fourSlotPath = path.join(targetDir, fourSlotFileName);
      fs.writeFileSync(fourSlotPath, JSON.stringify(fourSlotDoc, null, 2) + '\n', 'utf8');
      writtenFiles.push(fourSlotPath);
    }

    // 4. Plans
    if (plansToWrite.length > 0) {
      const plansDir = path.join(targetDir, plansSubdirName);
      fs.mkdirSync(plansDir, { recursive: true });
      for (const p of plansToWrite) {
        const pPath = path.join(plansDir, p.fileName);
        fs.writeFileSync(pPath, p.content + '\n', 'utf8');
        writtenFiles.push(pPath);
      }
    }
  }

  return {
    stem,
    exam,
    questionCount: questionBank.length,
    totalScore: questionBank.reduce((a, b) => a + (b.points || b.score || 0), 0),
    validation,
    writtenFiles,
    stats: {
      countRpmMatched,
      countRpmUnmatched,
      countPtTplMatched,
      countPtTplCleared,
      countNewKeyProposals,
      isFourSlotComplete,
      figureRequiredQuestions,
    },
    artifacts: {
      jsContent,
      metaRegisterDoc,
      fourSlotDoc,
      plansToWrite,
    },
  };
}

// CLI entry point
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const args = process.argv.slice(2);
  let mdPath = null;
  let outDir = null;
  let unescape = false;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--out-dir' && args[i + 1]) {
      outDir = args[++i];
    } else if (args[i] === '--unescape') {
      unescape = true;
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    } else if (!args[i].startsWith('--') && !mdPath) {
      mdPath = args[i];
    }
  }

  if (!mdPath) {
    console.error('Usage: node similar-md-to-js.mjs <md-file> [--out-dir <dir>] [--unescape] [--dry-run]');
    process.exit(1);
  }

  try {
    const result = convertSimilarExam({
      mdPath,
      writeFiles: !dryRun,
      outDir,
      unescape,
    });

    console.log(`Converted: ${result.stem}`);
    console.log(`  Questions: ${result.questionCount}, Total score: ${result.totalScore}`);
    console.log(`  Validation: ${result.validation.valid ? 'PASS' : 'FAIL'}`);
    if (result.validation.errors.length) {
      console.error('  Errors:', result.validation.errors);
    }
    if (result.validation.warnings.length) {
      console.warn('  Warnings:', result.validation.warnings);
    }
    if (result.writtenFiles.length) {
      console.log('  Written files:');
      for (const f of result.writtenFiles) console.log(`    - ${f}`);
    }
    if (!result.validation.valid) {
      process.exit(2);
    }
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    process.exit(1);
  }
}
