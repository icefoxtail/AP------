import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const INDEX_PATH = path.join(ARCHIVE, 'question-index.js');
const DEFAULT_OUTPUT = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');

const TARGET_KEYS = [
  'H15-SB-03',
  'H15-SB-04',
  'H15-SB-05',
  'H22-C2-07',
  'H22-C2-08',
  'H22-C2-09',
];

const GRAPH_SUBUNIT_RE = /(?:RATIONAL_GRAPH|IRRATIONAL_GRAPH|IRRATIONAL_INVERSE|FUNCTION_INVERSE|COMPOSITE_FUNCTION)/;
const GRAPH_WORD_RE = /그래프|그림|도식|좌표평면|점근선|사분면|교점|접함|접점|시작점|정의역|치역|대응점|대칭|넓이|그리시오/;
const EXPLICIT_GRAPH_RE = /그래프\s*(?:를|와|의|가|는|에|상|개형|그리|나타|읽)|그래프를\s*그리|그래프에\s*대하여|그림(?:과|에서|은|이|을|처럼|같이)/;
const PLACEHOLDER_RE = /\[(?:그래프필요|판독불가|graph\s*needed)\]/i;

function sha(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value ?? null;
}

function jsonHash(value) {
  return sha(JSON.stringify(stable(value)));
}

function readIndex() {
  const raw = fs.readFileSync(INDEX_PATH, 'utf8');
  const marker = 'window.questionIndex=';
  const start = raw.indexOf(marker);
  if (start < 0) throw new Error('question-index marker not found');
  const json = raw.slice(start + marker.length, raw.lastIndexOf(']') + 1);
  return JSON.parse(json);
}

function loadBank(relativeSourcePath, cache) {
  if (cache.has(relativeSourcePath)) return cache.get(relativeSourcePath);
  const filePath = path.join(ARCHIVE, 'exams', relativeSourcePath.replaceAll('/', path.sep));
  if (!fs.existsSync(filePath)) throw new Error(`source file missing: ${relativeSourcePath}`);
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 5000 });
  const bank = Array.isArray(context.window.questionBank) ? context.window.questionBank : [];
  cache.set(relativeSourcePath, bank);
  return bank;
}

function assetInfo(ref) {
  if (!ref) return { status: 'ABSENT', sha256: null, bytes: null };
  const filePath = path.join(ARCHIVE, String(ref).replaceAll('/', path.sep));
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return { status: 'BROKEN', sha256: null, bytes: null };
  }
  const bytes = fs.statSync(filePath).size;
  return { status: 'PRESENT', sha256: sha(fs.readFileSync(filePath)), bytes };
}

function csvEscape(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(filePath, rows) {
  const keys = Object.keys(rows[0] || {});
  const body = [keys.join(',')];
  for (const row of rows) body.push(keys.map((key) => csvEscape(row[key])).join(','));
  fs.writeFileSync(filePath, `${body.join('\n')}\n`, 'utf8');
}

function disposition({ question, content, tags, subUnitKey }) {
  const hasPlaceholder = PLACEHOLDER_RE.test(content);
  const explicit = EXPLICIT_GRAPH_RE.test(content) || /그래프|도식/.test(tags);
  const structural = GRAPH_SUBUNIT_RE.test(subUnitKey || '');
  const relation = GRAPH_WORD_RE.test(content);
  const hasProblemImage = Boolean(question.image);
  if (hasPlaceholder) return { code: 'GRAPH_PLACEHOLDER', score: 99, reasons: 'placeholder-token' };
  if (question.solutionImage) return { code: 'SOLUTION_VISUAL_PRESENT', score: 0, reasons: 'solutionImage-present' };
  if (explicit && hasProblemImage) return { code: 'PRIORITY_1_GRAPH_GAP_CANDIDATE', score: 10, reasons: 'explicit-graph|problem-image' };
  if (explicit) return { code: 'PRIORITY_1_EXPLICIT_GRAPH_CANDIDATE', score: 8, reasons: 'explicit-graph' };
  if (structural && relation) return { code: 'PRIORITY_2_GRAPH_RELATION_CANDIDATE', score: 7, reasons: 'graph-subunit|graph-relation' };
  if (structural) return { code: 'PRIORITY_2_GRAPH_SUBUNIT_CANDIDATE', score: 5, reasons: 'graph-subunit' };
  return { code: 'TRIAGE_NO_GRAPH_SIGNAL', score: 0, reasons: '' };
}

function main() {
  const output = path.resolve(process.argv[2] || DEFAULT_OUTPUT);
  fs.mkdirSync(output, { recursive: true });
  const indexRows = readIndex();
  const targets = indexRows
    .filter((row) => row.sourceFile?.startsWith('original/') && TARGET_KEYS.includes(row.standardUnitKey))
    .sort((a, b) => a.qKey.localeCompare(b.qKey));
  const cache = new Map();
  const rows = [];
  for (const row of targets) {
    const bank = loadBank(row.sourceFile, cache);
    const question = bank.find((item) => Number(item.id) === Number(row.id));
    if (!question) throw new Error(`question id ${row.id} missing in ${row.sourceFile}`);
    const content = String(question.content || '');
    const choices = Array.isArray(question.choices) ? question.choices.join(' ') : String(question.choices || '');
    const solution = String(question.solution || '');
    const tags = Array.isArray(question.tags) ? question.tags.join('|') : String(question.tags || '');
    const problem = assetInfo(question.image);
    const solutionAsset = assetInfo(question.solutionImage);
    const allText = `${content} ${choices} ${solution} ${tags}`;
    const gap = disposition({ question, content: allText, tags, subUnitKey: row.subUnitKey });
    const canonical = {
      qKey: row.qKey,
      sourceJsPath: row.sourceFile,
      id: row.id,
      content,
      choices: Array.isArray(question.choices) ? question.choices : question.choices ?? null,
      answer: question.answer ?? null,
      solution,
      image: question.image ?? null,
      solutionImage: question.solutionImage ?? null,
    };
    rows.push({
      questionUid: `h1:${row.qKey}`,
      qKey: row.qKey,
      examId: row.sourceExamKey || row.sourceFile,
      sourceJsPath: row.sourceFile,
      id: row.id,
      displayNo: row.id,
      curriculumVersion: row.standardUnitKey.startsWith('H15-') ? '2015' : '2022',
      standardCourse: row.course,
      standardUnitKey: row.standardUnitKey,
      standardUnit: row.standardUnit,
      subUnitKey: row.subUnitKey || '',
      subUnit: row.subUnit || '',
      problemImageRef: question.image || '',
      problemImageStatus: problem.status,
      solutionImageRef: question.solutionImage || '',
      solutionImageStatus: solutionAsset.status,
      graphRequirement: 'UNADJUDICATED',
      graphRole: question.image ? 'PROBLEM_PRESENT_REVIEW' : 'SOLUTION_CANDIDATE',
      graphGapDisposition: gap.code,
      graphCandidateScore: gap.score,
      graphCandidateReasons: gap.reasons,
      qualityDisposition: 'PENDING_INDEPENDENT_TRIAGE',
      baselineContentHash: jsonHash({ content, choices: canonical.choices }),
      baselineAnswerHash: jsonHash(canonical.answer),
      baselineSolutionHash: jsonHash(solution),
      baselineProblemImageHash: problem.sha256 || '',
      baselineSolutionImageHash: solutionAsset.sha256 || '',
      placeholderFound: PLACEHOLDER_RE.test(allText) ? 'YES' : 'NO',
      contentPreview: content.replaceAll(/\s+/g, ' ').slice(0, 240),
    });
  }

  const summary = {
    reportType: 'FUNCTION_FAMILY_INITIAL_INVENTORY_AND_GRAPH_GAP_TRIAGE',
    generatedAt: new Date().toISOString(),
    source: 'archive/question-index.js + original production question banks',
    targetKeys: TARGET_KEYS,
    targetCount: rows.length,
    targetExamCount: new Set(rows.map((row) => row.examId)).size,
    problemImageCount: rows.filter((row) => row.problemImageStatus === 'PRESENT').length,
    solutionImageCount: rows.filter((row) => row.solutionImageStatus === 'PRESENT').length,
    brokenProblemImageCount: rows.filter((row) => row.problemImageStatus === 'BROKEN').length,
    brokenSolutionImageCount: rows.filter((row) => row.solutionImageStatus === 'BROKEN').length,
    candidateCounts: Object.fromEntries(
      [...new Set(rows.map((row) => row.graphGapDisposition))]
        .sort()
        .map((code) => [code, rows.filter((row) => row.graphGapDisposition === code).length]),
    ),
    countsByUnit: Object.fromEntries(
      TARGET_KEYS.map((key) => {
        const unitRows = rows.filter((row) => row.standardUnitKey === key);
        return [key, {
          count: unitRows.length,
          exams: new Set(unitRows.map((row) => row.examId)).size,
          problemImage: unitRows.filter((row) => row.problemImageStatus === 'PRESENT').length,
          solutionImage: unitRows.filter((row) => row.solutionImageStatus === 'PRESENT').length,
          priority1: unitRows.filter((row) => row.graphGapDisposition.startsWith('PRIORITY_1')).length,
          priority2: unitRows.filter((row) => row.graphGapDisposition.startsWith('PRIORITY_2')).length,
        }];
      }),
    ),
    note: 'graphGapDisposition is a deterministic candidate signal only; final VISUAL_REQUIRED/OPTIONAL/EXEMPT requires independent mathematical and pedagogical review.',
  };

  fs.writeFileSync(path.join(output, 'function_family_inventory.json'), JSON.stringify({ summary, rows }, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(output, 'function_family_summary.md'), [
    '# 함수·유리함수·무리함수 초기 전수 진단',
    '',
    `- 생성 시각: ${summary.generatedAt}`,
    `- 원본 target: ${summary.targetCount}문항` ,
    `- target 시험지: ${summary.targetExamCount}개`,
    `- 문제 이미지: ${summary.problemImageCount}개`,
    `- 해설 이미지: ${summary.solutionImageCount}개`,
    '',
    '## 그래프 누락 후보',
    '',
    ...Object.entries(summary.candidateCounts).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `- ${key}: ${value}`),
    '',
    '> 후보 코드는 자동 선별 결과이며 최종 `VISUAL_REQUIRED` 판정이 아니다. 독립 풀이·문제·해설·실제 SVG 렌더를 확인한 뒤 확정한다.',
    '',
    '## 단원별 수량',
    '',
    '| standardUnitKey | target | exams | problem image | solution image | priority 1 | priority 2 |',
    '|---|---:|---:|---:|---:|---:|---:|',
    ...Object.entries(summary.countsByUnit).map(([key, value]) => `| ${key} | ${value.count} | ${value.exams} | ${value.problemImage} | ${value.solutionImage} | ${value.priority1} | ${value.priority2} |`),
    '',
  ].join('\n'), 'utf8');

  writeCsv(path.join(output, 'function_family_quality_triage.csv'), rows.map((row) => ({
    questionUid: row.questionUid,
    qKey: row.qKey,
    standardUnitKey: row.standardUnitKey,
    subUnitKey: row.subUnitKey,
    problemImageStatus: row.problemImageStatus,
    solutionImageStatus: row.solutionImageStatus,
    graphGapDisposition: row.graphGapDisposition,
    graphCandidateScore: row.graphCandidateScore,
    graphCandidateReasons: row.graphCandidateReasons,
    graphRequirement: row.graphRequirement,
    qualityDisposition: row.qualityDisposition,
    placeholderFound: row.placeholderFound,
    contentPreview: row.contentPreview,
  })));
  writeCsv(path.join(output, 'function_family_visual_matrix.csv'), rows.map((row) => ({
    questionUid: row.questionUid,
    examId: row.examId,
    standardUnitKey: row.standardUnitKey,
    subUnitKey: row.subUnitKey,
    graphRequirement: row.graphRequirement,
    graphRole: row.graphRole,
    graphGapDisposition: row.graphGapDisposition,
    problemImageRef: row.problemImageRef,
    solutionImageRef: row.solutionImageRef,
    problemImageStatus: row.problemImageStatus,
    solutionImageStatus: row.solutionImageStatus,
    baselineProblemImageHash: row.baselineProblemImageHash,
    baselineSolutionImageHash: row.baselineSolutionImageHash,
  })));
  console.log(JSON.stringify(summary, null, 2));
}

main();
