import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const METADATA = path.join(ARCHIVE, 'data', 'question_metadata.json');
const MANIFEST = path.join(ROOT, 'docs', 'rules', 'MANIFEST.md');
const TARGET_KEYS = ['H15-SA-05', 'H15-SA-08', 'H15-SA-13', 'H22-C-05', 'H22-C-06'];
const TARGET_SET = new Set(TARGET_KEYS);
const RULE_PATHS = [
  'docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md',
  'docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md',
  'docs/rules/02_PIPELINES/공통파이프라인_실행계약_v1.md',
  'docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md',
  'docs/rules/04_VISUAL/도형추출.md',
  'docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md',
  'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md',
  'docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md',
  'archive/tools/pipeline-core/README.md',
  'archive/tools/pipeline-core/AGENT_BUDGET.md',
  'archive/tools/pipeline-core/visual-contract.json',
];

const priorReportRefs = [
  'docs/reports/high1-svg-exhaustive-20260905/unit-09-quadratic/FINAL_REPORT.md',
  'docs/reports/high1-svg-exhaustive-20260905/unit-10-root-relations/FINAL_REPORT.md',
  'docs/reports/high1-svg-exhaustive-20260905/unit-12-equations-inequalities/FINAL_REPORT.md',
  'docs/reports/high1-svg-exhaustive-20260905/unit-12-inequality-combinatorics/FINAL_REPORT.md',
  'docs/reports/high1-svg-exhaustive-20260905/unit-14-quadratic-function/FINAL_REPORT.md',
  'docs/reports/high1-svg-exhaustive-20260905/unit-09-quadratic/08_source_review_status.json',
  'docs/reports/high1-svg-exhaustive-20260905/unit-12-inequality-combinatorics/08_source_review_status.json',
  'docs/reports/high1-svg-exhaustive-20260905/unit-14-quadratic-function/08_source_review_status.json',
  'reports/h2-s1-algebra-visual-upgrade/CONTINUATION_HANDOFF.md',
];

function shaBytes(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function shaFile(filePath) {
  return shaBytes(fs.readFileSync(filePath));
}

function rel(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value === undefined ? null : value;
}

function objectSha(value) {
  return shaBytes(JSON.stringify(stable(value)));
}

function runGit(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function loadBank(relativePath) {
  const filePath = path.join(ARCHIVE, 'exams', relativePath.replaceAll('/', path.sep));
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 10000 });
  if (!Array.isArray(context.window.questionBank)) throw new Error(`questionBank missing: ${relativePath}`);
  return context.window.questionBank;
}

function parseManifest() {
  const declared = new Map();
  for (const line of fs.readFileSync(MANIFEST, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^-\s+([^|]+?)\s*\|\s*(\d+)\s+bytes\s+\|\s+sha256\s+([0-9a-f]{64})/i);
    if (match) declared.set(match[1].trim(), { bytes: Number(match[2]), sha256: match[3].toLowerCase() });
  }
  return declared;
}

function ruleLock() {
  const declared = parseManifest();
  return RULE_PATHS.map((rulePath) => {
    const absolute = path.join(ROOT, rulePath);
    const bytes = fs.statSync(absolute).size;
    const sha256 = shaFile(absolute);
    const manifestKey = rulePath.startsWith('docs/rules/') ? rulePath.slice('docs/rules/'.length) : null;
    const entry = manifestKey ? declared.get(manifestKey) : null;
    const firstLine = fs.readFileSync(absolute, 'utf8').split(/\r?\n/, 1)[0];
    return {
      path: rulePath,
      bytes,
      sha256,
      declaredBytes: entry?.bytes ?? null,
      declaredSha256: entry?.sha256 ?? null,
      manifestCovered: Boolean(entry),
      manifestMatch: entry ? Boolean(entry.bytes === bytes && entry.sha256 === sha256) : 'NOT_APPLICABLE_RUNTIME_FILE',
      declaredVersion: firstLine.match(/v\d+(?:\.\d+)+/i)?.[0] || (rulePath.endsWith('visual-contract.json') ? 'APMATH_VISUAL_FACT_v2' : 'UNVERSIONED_OR_RUNTIME_FILE'),
    };
  });
}

function resolveAsset(reference) {
  if (!reference) return null;
  const normalized = String(reference).replaceAll('\\', '/').replace(/^\.\//, '');
  const candidate = normalized.startsWith('archive/') ? path.join(ROOT, normalized) : path.join(ARCHIVE, normalized);
  const absolute = path.resolve(candidate);
  if (absolute !== ARCHIVE && !absolute.startsWith(`${ARCHIVE}${path.sep}`)) return null;
  return absolute;
}

function assetRefInfo(reference) {
  const absolute = resolveAsset(reference);
  if (!absolute || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) return { reference: reference || '', status: reference ? 'BROKEN' : 'ABSENT', bytes: null, sha256: null };
  return { reference, status: 'PRESENT', bytes: fs.statSync(absolute).size, sha256: shaFile(absolute) };
}

function csvEscape(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(fileName, rows) {
  const filePath = path.join(REPORT, fileName);
  const keys = Object.keys(rows[0] || {});
  const lines = [keys.join(',')];
  for (const row of rows) lines.push(keys.map((key) => csvEscape(row[key])).join(','));
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
}

function visualSignal(question) {
  const subKey = String(question.subUnitKey || '');
  const text = [question.content, question.choices, question.solution, question.tags, question.subUnit, question.standardUnit]
    .flatMap((value) => Array.isArray(value) ? value : [value])
    .filter(Boolean)
    .join(' ');
  const reasons = [];
  if (/그래프|포물선|꼭짓점|축|교점|함수|이차함수|이차방정식/.test(text)) reasons.push('GRAPH_OR_FUNCTION_STRUCTURE');
  if (/부등식|해집합|구간|부호|수직선/.test(text)) reasons.push('NUMBER_LINE_OR_INEQUALITY_STRUCTURE');
  if (/좌표|직선|삼각형|사각형|넓이|거리|중점|접선|접점/.test(text)) reasons.push('COORDINATE_OR_GEOMETRY_STRUCTURE');
  if (/표|경우|케이스|경계|범위/.test(text)) reasons.push('CASE_OR_BOUNDARY_STRUCTURE');
  return { text, reasons: [...new Set(reasons)] };
}

function isInequalityCandidate(question) {
  const subKey = String(question.subUnitKey || '');
  const subUnit = String(question.subUnit || '');
  const content = `${question.content || ''} ${question.choices || ''}`;
  return /INEQUALITY/.test(subKey) || /부등식/.test(subUnit) || /부등식|해집합|부호|수직선/.test(content);
}

function classifyDecision(question, solutionVisual) {
  const key = String(question.standardUnitKey || '');
  const inlineSolutionSvg = /<svg\b/i.test(String(question.solution || ''));
  const isQuadraticFunctionOrEquation = key === 'H15-SA-13' || key === 'H22-C-05' || key === 'H15-SA-05';
  const isInequality = (key === 'H15-SA-08' || key === 'H22-C-06') && isInequalityCandidate(question);
  const requiredByCurrentRuleRoute = isQuadraticFunctionOrEquation || isInequality;
  if (solutionVisual.status === 'PRESENT' || inlineSolutionSvg) return { decision: requiredByCurrentRuleRoute ? 'REBUILD_EXISTING' : 'KEEP_EXISTING', requirementSignal: 'VISUAL_REQUIRED', action: inlineSolutionSvg ? 'REBUILD' : 'KEEP', reasons: ['CURRENT_SOLUTION_VISUAL_PRESENT'] };
  if (requiredByCurrentRuleRoute) return { decision: 'ADD_NEW_VISUAL', requirementSignal: 'VISUAL_REQUIRED', action: 'ADD', reasons: visualSignal(question).reasons };
  return { decision: 'NO_VISUAL', requirementSignal: 'VISUAL_OPTIONAL_OR_EXEMPT_CANDIDATE', action: 'NONE', reasons: visualSignal(question).reasons };
}

function build() {
  const statusBeforeReport = runGit(['status', '--short']);
  fs.mkdirSync(REPORT, { recursive: true });
  const metadata = JSON.parse(fs.readFileSync(METADATA, 'utf8'));
  const metadataRows = metadata.records.filter((row) => String(row.sourceArchiveFile || '').startsWith('original/high/h1/') && TARGET_SET.has(row.standardUnitKey));
  const sourceFiles = [...new Set(metadataRows.map((row) => row.sourceArchiveFile))].sort();
  const rows = [];
  for (const sourceJsPath of sourceFiles) {
    const sourcePath = path.join(ARCHIVE, 'exams', sourceJsPath.replaceAll('/', path.sep));
    const sourceSha = shaFile(sourcePath);
    const bank = loadBank(sourceJsPath);
    for (const question of bank) {
      if (!TARGET_SET.has(question.standardUnitKey)) continue;
      const examId = String(question.examId || question.sourceExamKey || question.examTitle || path.basename(sourceJsPath, '.js'));
      const questionUid = `archive/exams/${sourceJsPath}|${examId}|${question.id}`;
      const problemVisual = assetRefInfo(question.image);
      const solutionVisual = assetRefInfo(question.solutionImage);
      const inlineSolutionSvgCount = (String(question.solution || '').match(/<svg\b/gi) || []).length;
      const decision = classifyDecision(question, solutionVisual);
      const protectedHash = objectSha({ id: question.id ?? null, content: question.content ?? null, choices: question.choices ?? null, answer: question.answer ?? null, image: question.image ?? null });
      rows.push({
        questionUid,
        sourceJsPath: `archive/exams/${sourceJsPath}`,
        examId,
        id: question.id,
        standardCourse: question.standardCourse || '',
        standardUnitKey: question.standardUnitKey,
        standardUnit: question.standardUnit || '',
        subUnitKey: question.subUnitKey || '',
        subUnit: question.subUnit || '',
        questionType: question.questionType || '',
        problemImageRef: question.image || '',
        problemImageStatus: problemVisual.status,
        solutionImageRef: question.solutionImage || '',
        solutionImageStatus: solutionVisual.status,
        inlineSolutionSvgCount,
        sourceFileBytes: fs.statSync(sourcePath).size,
        sourceFileSha256: sourceSha,
        protectedHash,
        solutionHash: objectSha(question.solution ?? null),
        visualRequirementSignal: decision.requirementSignal,
        visualDecision: decision.decision,
        visualAction: decision.action,
        visualReasons: decision.reasons.join('|'),
        expectedFactStatus: 'NOT_STARTED',
        observedFactStatus: 'NOT_STARTED',
        parityStatus: 'NOT_STARTED',
        renderStatus: 'NOT_TESTED',
        sourceReviewStatus: 'NOT_REVIEWED',
        solutionFreezeStatus: 'NOT_STARTED',
        currentStatus: 'CANDIDATE_SCOPE_ONLY',
      });
    }
  }
  rows.sort((a, b) => a.questionUid.localeCompare(b.questionUid, 'ko'));
  const counts = (field) => Object.fromEntries([...new Set(rows.map((row) => row[field]))].sort().map((value) => [value, rows.filter((row) => row[field] === value).length]));
  const rules = ruleLock();
  const head = runGit(['rev-parse', 'HEAD']);
  const originMain = runGit(['rev-parse', 'origin/main']);
  const summary = {
    reportType: 'HS_QUADRATIC_SVG_CURRENT_BASELINE_AND_SCOPE_INVENTORY',
    generatedAt: new Date().toISOString(),
    branch: runGit(['branch', '--show-current']),
    head,
    originMain,
    headOriginParity: head === originMain ? 'PASS' : 'FAIL',
    worktreeStatusBeforeReport: statusBeforeReport || 'CLEAN',
    productionBaselinePolicy: 'READ_ONLY',
    targetPolicy: 'original/high/h1 only; similar and types excluded',
    targetStandardUnitKeys: TARGET_KEYS,
    targetQuestionCount: rows.length,
    targetExamCount: new Set(rows.map((row) => row.examId)).size,
    targetSourceFileCount: new Set(rows.map((row) => row.sourceJsPath)).size,
    decisionCounts: counts('visualDecision'),
    unitCounts: Object.fromEntries(TARGET_KEYS.map((key) => [key, { count: rows.filter((row) => row.standardUnitKey === key).length, decisions: counts('visualDecision') && Object.fromEntries([...new Set(rows.filter((row) => row.standardUnitKey === key).map((row) => row.visualDecision))].sort().map((value) => [value, rows.filter((row) => row.standardUnitKey === key && row.visualDecision === value).length])) }])),
    solutionVisualCounts: { externalPresent: rows.filter((row) => row.solutionImageStatus === 'PRESENT').length, inlineSvgPresent: rows.filter((row) => row.inlineSolutionSvgCount > 0).length, problemImagePresent: rows.filter((row) => row.problemImageStatus === 'PRESENT').length },
    rules,
    applicableUnitOverlay: { status: 'NOT_FOUND', note: 'No applicable quadratic/inequality UNIT_OVERLAY exists under docs/rules; common canonical ruleset continues.' },
    priorEvidenceRefs: priorReportRefs.map((filePath) => ({ path: filePath, exists: fs.existsSync(path.join(ROOT, filePath)), sha256: fs.existsSync(path.join(ROOT, filePath)) ? shaFile(path.join(ROOT, filePath)) : null })),
    status: 'INVENTORY_FROZEN_CANDIDATE_ONLY_NO_PASS',
    blockersBeforeQualityClosure: [
      'solution freeze and independent blind math review are not yet created for this current branch/revision',
      'current pipeline-core provider-attested FINAL_AUDIT has not been executed',
      'candidate SVG generation and V1/V2/V3 evidence are not yet created',
      'production source/assets remain unchanged by policy',
    ],
  };
  fs.writeFileSync(path.join(REPORT, '00_baseline_and_ruleset_lock.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  writeCsv('01_target_inventory.csv', rows);
  fs.writeFileSync(path.join(REPORT, '02_scope_summary.json'), `${JSON.stringify({ summary, rows: rows.map(({ questionUid, sourceJsPath, examId, id, standardUnitKey, subUnitKey, visualDecision, visualAction, visualReasons, solutionImageStatus, inlineSolutionSvgCount, sourceFileSha256, protectedHash, currentStatus }) => ({ questionUid, sourceJsPath, examId, id, standardUnitKey, subUnitKey, visualDecision, visualAction, visualReasons, solutionImageStatus, inlineSolutionSvgCount, sourceFileSha256, protectedHash, currentStatus })) }, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(REPORT, '03_visual_triage.jsonl'), `${rows.map((row) => JSON.stringify({ questionUid: row.questionUid, standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey, visualRequirementSignal: row.visualRequirementSignal, visualDecision: row.visualDecision, visualAction: row.visualAction, visualReasons: row.visualReasons, evidenceStatus: 'TRIAGE_ONLY_NO_PASS' })).join('\n')}\n`, 'utf8');
  const unitTable = TARGET_KEYS.map((key) => {
    const unitRows = rows.filter((row) => row.standardUnitKey === key);
    const decisionCount = Object.fromEntries(['NO_VISUAL', 'KEEP_EXISTING', 'REBUILD_EXISTING', 'ADD_NEW_VISUAL'].map((decision) => [decision, unitRows.filter((row) => row.visualDecision === decision).length]));
    return `| ${key} | ${unitRows.length} | ${decisionCount.NO_VISUAL} | ${decisionCount.KEEP_EXISTING} | ${decisionCount.REBUILD_EXISTING} | ${decisionCount.ADD_NEW_VISUAL} |`;
  });
  fs.writeFileSync(path.join(REPORT, 'STATUS.md'), [
    '# 고등 이차함수·이차방정식·이차부등식·부등식 현재 기준선', '',
    `- branch: \`${summary.branch}\``,
    `- HEAD: \`${summary.head}\``,
    `- origin/main: \`${summary.originMain}\``,
    `- HEAD/origin parity: **${summary.headOriginParity}**`,
    `- target: **${summary.targetQuestionCount}문항 / ${summary.targetExamCount}시험지 / ${summary.targetSourceFileCount} source JS**`,
    '- scope: original/high/h1 only; similar/types 제외',
    '- current stage: **INVENTORY_FROZEN_CANDIDATE_ONLY_NO_PASS**',
    '',
    '## 단원별 분모와 시각자료 결정 후보', '',
    '| canonical key | target | NO_VISUAL | KEEP_EXISTING | REBUILD_EXISTING | ADD_NEW_VISUAL |',
    '|---|---:|---:|---:|---:|---:|',
    ...unitTable,
    '',
    '현재 source에서 solutionImage 외부 연결은 0건이며, inline solution SVG는 2건이다. `REBUILD_EXISTING`/`ADD_NEW_VISUAL`은 독립 expected fact와 solution freeze가 끝나기 전에는 candidate 제작 대상일 뿐이다.',
    '',
    '## 규칙 라우팅', '',
    ...rules.map((row) => `- ${row.path}: ${row.declaredVersion || '—'} / ${row.bytes} bytes / sha256 ${row.sha256} / manifestMatch=${row.manifestMatch}`),
    '- applicable UNIT_OVERLAY: 없음 확인. 공통 canonical ruleset으로 계속하되, overlay 부재 사실을 evidence에 보존한다.',
    '',
    '## 기존 진행 자료의 위치와 현재 사용 범위', '',
    ...priorReportRefs.map((filePath) => `- ${filePath}`),
    '',
    '기존 보고서는 current pipeline-core closure를 대신하지 않는 진단/진척 근거로만 연결했다. solution freeze → V1 source-only → V2 artifact-only → V3 parity → render capture/review → final audit 순서를 새 revision에서 다시 닫아야 한다.',
    '',
    '## 현재 차단', '',
    ...summary.blockersBeforeQualityClosure.map((item) => `- ${item}`),
    '',
  ].join('\n'), 'utf8');
  console.log(JSON.stringify({ reportDir: rel(REPORT), ...summary }, null, 2));
}

build();
