import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const SOURCE_ROOT = path.join(ARCHIVE, 'exams', 'original', 'high', 'h1');
const REPORT = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const INDEX_PATH = path.join(ARCHIVE, 'question-index.js');
const DB_PATH = path.join(ARCHIVE, 'db.js');
const MASTER_MD = path.join(ROOT, 'docs', 'rules', '01_CANONICAL', 'JS아카이브_표준단원키_마스터테이블.md');
const COMPILED_MASTER = path.join(ARCHIVE, 'data', 'master_tables', 'js_archive_tag_master.json');
const RULE_MANIFEST = path.join(ROOT, 'docs', 'rules', 'MANIFEST.md');

const RULE_FILES = [
  'docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md',
  'docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md',
  'docs/rules/04_VISUAL/도형추출.md',
  'docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md',
  'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md',
  'docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md',
  'docs/rules/02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md',
  'docs/rules/03_REVIEW/무결성검수.md',
  'docs/rules/02_PIPELINES/해설프로토콜.md',
  'docs/rules/02_PIPELINES/JS_문항품질_업그레이드.md',
  'docs/rules/02_PIPELINES/수정프로토콜.md',
  'docs/rules/02_PIPELINES/작업방식_5문항배치루프_필수.md',
  'docs/rules/03_REVIEW/JS아카이브_1차검수_프로토콜.md',
  'docs/rules/03_REVIEW/JS아카이브_2차검수_프로토콜.md',
  'docs/rules/03_REVIEW/JS아카이브_3차검수_프로토콜.md',
];

const KEY_RE = /^H(?:15-(?:SA|SB)|22-C2?)-\d{2}$/;

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function shaFile(filePath) {
  return fs.existsSync(filePath) ? sha256(fs.readFileSync(filePath)) : null;
}

function text(value) {
  if (value === null || value === undefined) return '';
  return typeof value === 'string' ? value : String(value);
}

function normalize(value) {
  return text(value).replace(/\r\n/g, '\n').trim();
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value === undefined ? null : value;
}

function hashJson(value) {
  return sha256(JSON.stringify(stable(value)));
}

function rel(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function relArchive(filePath) {
  return path.relative(ARCHIVE, filePath).split(path.sep).join('/');
}

function runGit(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch (error) {
    return `GIT_ERROR:${error instanceof Error ? error.message : String(error)}`;
  }
}

function csvEscape(value) {
  const valueText = Array.isArray(value) ? value.join('|') : value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(valueText) ? `"${valueText.replaceAll('"', '""')}"` : valueText;
}

function writeCsv(fileName, rows) {
  const filePath = path.join(REPORT, fileName);
  const keys = Object.keys(rows[0] || {});
  const lines = [keys.join(',')];
  for (const row of rows) lines.push(keys.map((key) => csvEscape(row[key])).join(','));
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
}

function writeJson(fileName, value) {
  fs.writeFileSync(path.join(REPORT, fileName), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function writeJsonl(fileName, rows) {
  fs.writeFileSync(path.join(REPORT, fileName), `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
}

function parseRuleManifest() {
  const manifest = fs.readFileSync(RULE_MANIFEST, 'utf8');
  const entries = new Map();
  for (const line of manifest.split(/\r?\n/)) {
    const match = line.match(/^-\s+([^|]+?)\s*\|\s*(\d+)\s+bytes\s+\|\s+sha256\s+([0-9a-f]{64})/i);
    if (match) entries.set(match[1].trim(), { bytes: Number(match[2]), sha256: match[3].toLowerCase() });
  }
  return entries;
}

function buildRulesetLock() {
  const manifest = parseRuleManifest();
  const rows = RULE_FILES.map((relative) => {
    const absolute = path.join(ROOT, relative);
    const key = relative.replace(/^docs\/rules\//, '');
    const bytes = fs.existsSync(absolute) ? fs.statSync(absolute).size : null;
    const actualSha = shaFile(absolute);
    const declared = manifest.get(key) || null;
    const firstLine = fs.existsSync(absolute) ? fs.readFileSync(absolute, 'utf8').split(/\r?\n/, 1)[0] : '';
    return {
      path: relative,
      exists: Boolean(actualSha),
      declaredBytes: declared?.bytes ?? null,
      actualBytes: bytes,
      declaredSha256: declared?.sha256 ?? null,
      actualSha256: actualSha,
      manifestMatch: Boolean(declared && declared.bytes === bytes && declared.sha256 === actualSha),
      declaredVersion: firstLine.match(/v\d+(?:\.\d+)+/i)?.[0] || '',
    };
  });
  const overlays = fs.readdirSync(path.join(ROOT, 'docs', 'rules'), { withFileTypes: true })
    .filter((entry) => entry.isFile() && /overlay/i.test(entry.name))
    .map((entry) => entry.name);
  return {
    generatedAtKst: '2026-09-05',
    manifestPath: rel(RULE_MANIFEST),
    rows,
    applicableUnitOverlay: overlays,
    status: rows.every((row) => row.manifestMatch) ? 'LOCKED' : 'RULE_ROUTING_BLOCKED',
    lockSha256: hashJson(rows),
  };
}

function parseCanonicalUnits() {
  const textValue = fs.readFileSync(MASTER_MD, 'utf8');
  const units = new Map();
  for (const line of textValue.split(/\r?\n/)) {
    const match = line.match(/^\|\s*(H(?:15-(?:SA|SB)|22-C2?)-\d{2})\s*\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|/);
    if (!match) continue;
    const key = match[1];
    if (!KEY_RE.test(key)) continue;
    units.set(key, { key, label: match[2].trim(), order: Number(match[3]) });
  }
  return units;
}

function parseCompiledMaster() {
  const records = JSON.parse(fs.readFileSync(COMPILED_MASTER, 'utf8'));
  const units = new Map();
  const subunits = new Map();
  for (const record of records) {
    const standardUnitKey = normalize(record.standardUnitKey || record.parentKey);
    const subUnitKey = normalize(record.subUnitKey || (record.keyType === 'subUnitKey' ? record.key : ''));
    const label = normalize(record.subUnit || record.labelKo || record.label || (record.keyType === 'subUnitKey' ? record.labelKo : ''));
    if (standardUnitKey && KEY_RE.test(standardUnitKey)) {
      if (label && !subunits.has(subUnitKey || `__unit__${standardUnitKey}`)) {
        subunits.set(subUnitKey || `__unit__${standardUnitKey}`, { standardUnitKey, subUnitKey, label });
      }
      if (!units.has(standardUnitKey)) units.set(standardUnitKey, { key: standardUnitKey, label: normalize(record.standardUnit || record.standardUnitLabel || ''), order: Number(record.standardUnitOrder || 0) || null });
    }
  }
  return { records, units, subunits };
}

function loadQuestionIndex() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(INDEX_PATH, 'utf8'), context, { filename: INDEX_PATH, timeout: 30000 });
  return Array.isArray(context.window.questionIndex) ? context.window.questionIndex : [];
}

function listSourceFiles() {
  const files = [];
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else if (entry.isFile() && entry.name.endsWith('.js')) files.push(absolute);
    }
  }
  walk(SOURCE_ROOT);
  return files.sort((a, b) => rel(a).localeCompare(rel(b), 'ko'));
}

function resolveArchiveReference(reference) {
  const normalizedReference = normalize(reference).replaceAll('\\', '/');
  if (!normalizedReference) return null;
  let candidate;
  if (normalizedReference.startsWith('archive/')) candidate = path.join(ROOT, normalizedReference);
  else if (normalizedReference.startsWith('assets/')) candidate = path.join(ARCHIVE, normalizedReference);
  else if (normalizedReference.startsWith('./assets/')) candidate = path.join(ARCHIVE, normalizedReference.slice(2));
  else candidate = path.join(ARCHIVE, normalizedReference.replace(/^\.\//, ''));
  const absolute = path.resolve(candidate);
  if (absolute !== ARCHIVE && !absolute.startsWith(`${ARCHIVE}${path.sep}`)) return null;
  return absolute;
}

function refsFromQuestion(question) {
  const refs = [];
  for (const field of ['image', 'solutionImage']) {
    const value = question[field];
    if (typeof value === 'string' && value.trim()) refs.push({ field, ref: value.trim() });
  }
  return refs;
}

function inlineSvgCount(value) {
  return (text(value).match(/<svg\b/gi) || []).length;
}

function visualCues(question) {
  const combined = [question.content, question.choices, question.solution, question.tags, question.subUnit, question.standardUnit]
    .flatMap((value) => Array.isArray(value) ? value : [value])
    .map(text)
    .join(' ');
  const markers = [...new Set((combined.match(/\[(?:도형|해설도형|그래프|표|공통자료|경우나무)필요\]/g) || []))];
  const reasons = [];
  if (markers.length) reasons.push('EXPLICIT_VISUAL_MARKER');
  if (/(그래프|함수와 역함수|점근선|정의역|치역|포물선|교점 개수|y\s*=\s*x)/i.test(combined)) reasons.push('GRAPH_OR_FUNCTION_STRUCTURE');
  if (/(좌표평면|좌표|직선|원의 방정식|원과 직선|접선|접점|평행이동|대칭이동|삼각형|사각형|도형|거리|중점|내분점|무게중심|수직|평행)/i.test(combined)) reasons.push('COORDINATE_OR_GEOMETRY_STRUCTURE');
  if (/(집합|벤다이어그램|Venn|여집합|교집합|합집합|진리집합|수직선|필요조건|충분조건|대우|반례)/i.test(combined)) reasons.push('SET_OR_LOGIC_STRUCTURE');
  if (/(최단경로|격자|배치|자리|이웃|블록|원순열|경우의 수|경우 나누|경로)/i.test(combined)) reasons.push('COUNTING_STRUCTURE');
  if (/(행렬|행과 열|표|경우표|대응표)/i.test(combined)) reasons.push('TABLE_OR_MATRIX_STRUCTURE');
  return { markers, reasons: [...new Set(reasons)] };
}

function extractSvgFacts(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const tagNames = ['svg', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path', 'rect', 'text', 'g', 'defs', 'use', 'image', 'foreignObject', 'script'];
  const counts = Object.fromEntries(tagNames.map((tag) => [tag, (raw.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length]));
  const viewBox = raw.match(/\bviewBox\s*=\s*["']([^"']+)["']/i)?.[1] || '';
  const preserveAspectRatio = raw.match(/\bpreserveAspectRatio\s*=\s*["']([^"']+)["']/i)?.[1] || '';
  const rootSize = {
    width: raw.match(/<svg\b[^>]*\bwidth\s*=\s*["']([^"']+)["']/i)?.[1] || '',
    height: raw.match(/<svg\b[^>]*\bheight\s*=\s*["']([^"']+)["']/i)?.[1] || '',
  };
  const forbiddenNodes = ['script', 'foreignObject'].filter((tag) => counts[tag] > 0);
  const externalRefs = [...raw.matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)["']/gi)]
    .map((match) => match[1]).filter((value) => !value.startsWith('#') && !value.startsWith('data:'));
  const primitives = [];
  for (const match of raw.matchAll(/<(circle|ellipse|line|polyline|polygon|path|rect)\b([^>]*)>/gi)) {
    const attrs = {};
    for (const attr of match[2].matchAll(/([:\w-]+)\s*=\s*["']([^"']*)["']/g)) attrs[attr[1]] = attr[2];
    primitives.push({ tag: match[1].toLowerCase(), attrs });
  }
  const labels = [...raw.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)].map((match) => normalize(match[1].replace(/<[^>]+>/g, ''))).filter(Boolean);
  return {
    assetPath: rel(filePath),
    assetSha256: shaFile(filePath),
    byteCount: fs.statSync(filePath).size,
    staticXmlStatus: /^(?:\s*<\?xml[\s\S]*?\?>)?(?:\s*<!--[^]*?-->)*\s*<svg\b[\s\S]*<\/svg>\s*$/i.test(raw) ? 'STATIC_ROOT_SHAPE_PASS' : 'STATIC_ROOT_SHAPE_FAIL',
    viewBox,
    preserveAspectRatio,
    rootSize,
    counts,
    forbiddenNodes,
    externalRefs,
    labels,
    primitives,
    observedFactHash: hashJson({ viewBox, preserveAspectRatio, rootSize, counts, forbiddenNodes, externalRefs, labels, primitives }),
  };
}

function getMetadataStatus(question, canonicalUnits, compiled) {
  const key = normalize(question.standardUnitKey);
  const canonical = canonicalUnits.get(key);
  if (!canonical) return { status: 'FAIL_STANDARD_UNIT_KEY', reason: 'standardUnitKey_not_in_canonical_h1_scope' };
  if (normalize(question.standardUnit) !== canonical.label) return { status: 'FAIL_STANDARD_UNIT_LABEL', reason: `expected:${canonical.label}` };
  const subKey = normalize(question.subUnitKey);
  if (!subKey) return { status: 'LEGACY_EXCEPTION_SUBUNIT_MISSING', reason: 'subUnitKey_empty' };
  const sub = compiled.subunits.get(subKey);
  if (!sub || sub.standardUnitKey !== key) return { status: 'FAIL_SUBUNIT_PARENT', reason: `subUnitKey:${subKey}` };
  const observedLabel = normalize(question.subUnit);
  if (sub.label && observedLabel && sub.label !== observedLabel) return { status: 'FAIL_SUBUNIT_LABEL', reason: `expected:${sub.label}` };
  return { status: 'PASS', reason: 'canonical_and_compiled_master_match' };
}

function questionRow({ question, sourcePath, examTitle, ordinal, canonicalUnits, compiled, indexMap }) {
  const sourceJsPath = rel(sourcePath);
  const id = question.id ?? question.displayNo ?? ordinal;
  const displayNo = question.displayNo ?? question.id ?? ordinal;
  const examId = normalize(question.examId || question.sourceExamKey || examTitle || sourceJsPath);
  const questionUid = `${sourceJsPath}|${examId}|${id ?? displayNo}`;
  const refs = refsFromQuestion(question);
  const resolvedRefs = refs.map((item) => ({ ...item, absolute: resolveArchiveReference(item.ref) }));
  const existingRefs = resolvedRefs.filter((item) => item.absolute && fs.existsSync(item.absolute));
  const brokenRefs = resolvedRefs.filter((item) => !item.absolute || !fs.existsSync(item.absolute));
  const svgRefs = existingRefs.filter((item) => path.extname(item.absolute).toLowerCase() === '.svg');
  const inlineCount = inlineSvgCount(question.content) + inlineSvgCount(question.solution);
  const cues = visualCues(question);
  const hasProblemVisual = refs.some((item) => item.field === 'image') || inlineSvgCount(question.content) > 0;
  const hasSolutionVisual = refs.some((item) => item.field === 'solutionImage') || inlineSvgCount(question.solution) > 0;
  const existingSvgStatus = inlineCount > 0 && svgRefs.length > 0 ? 'INLINE_AND_LINKED_SVG'
    : inlineCount > 0 ? 'INLINE_SVG'
      : svgRefs.some((item) => item.field === 'image') && svgRefs.some((item) => item.field === 'solutionImage') ? 'PROBLEM_AND_SOLUTION_SVG'
        : svgRefs.some((item) => item.field === 'solutionImage') ? 'SOLUTION_SVG'
          : svgRefs.some((item) => item.field === 'image') ? 'PROBLEM_SVG'
            : brokenRefs.length ? 'BROKEN_ASSET_REF'
              : 'NONE';
  const visualRequirementCandidate = existingSvgStatus !== 'NONE' && existingSvgStatus !== 'BROKEN_ASSET_REF'
    ? 'SOURCE_REVIEW'
    : cues.reasons.length ? 'SVG_REQUIRED_MISSING' : 'SVG_OPTIONAL';
  const qKey = `original/high/h1/${path.basename(sourcePath)}`;
  const indexRecord = indexMap.get(`${sourceJsPath.slice('archive/exams/'.length)}_${id}`) || indexMap.get(`${sourceJsPath.replace(/^archive\/exams\//, '')}_${id}`) || null;
  const metadata = getMetadataStatus(question, canonicalUnits, compiled);
  const contentHash = hashJson(question.content ?? '');
  const choicesHash = hashJson(question.choices ?? []);
  const answerHash = hashJson(question.answer ?? '');
  const solutionHash = hashJson(question.solution ?? '');
  const imageRef = normalize(question.image);
  const solutionImageRef = normalize(question.solutionImage);
  const record = {
    questionUid,
    sourceJsPath,
    examId,
    id,
    displayNo,
    sourceOrdinal: ordinal,
    curriculumVersion: /^H15-/.test(normalize(question.standardUnitKey)) ? '2015' : /^H22-/.test(normalize(question.standardUnitKey)) ? '2022' : '',
    standardCourse: normalize(question.standardCourse),
    standardUnitKey: normalize(question.standardUnitKey),
    standardUnit: normalize(question.standardUnit),
    standardUnitOrder: canonicalUnits.get(normalize(question.standardUnitKey))?.order ?? null,
    subUnitKey: normalize(question.subUnitKey),
    subUnit: normalize(question.subUnit),
    subUnitConfidence: normalize(question.subUnitConfidence),
    subUnitClassificationDepth: normalize(question.subUnitClassificationDepth),
    questionType: normalize(question.questionType),
    layoutTag: normalize(question.layoutTag),
    wide: Boolean(question.wide),
    tags: Array.isArray(question.tags) ? question.tags : [],
    contentHash,
    choicesHash,
    answerHash,
    solutionHash,
    problemImageRef: imageRef,
    problemImageHash: imageRef && resolveArchiveReference(imageRef) ? shaFile(resolveArchiveReference(imageRef)) : null,
    solutionImageRef,
    solutionImageHash: solutionImageRef && resolveArchiveReference(solutionImageRef) ? shaFile(resolveArchiveReference(solutionImageRef)) : null,
    inlineSvgCount: inlineCount,
    sourceValidityStatus: 'LOADED_VM',
    independentAnswer: '',
    answerParity: 'NOT_STARTED',
    solutionQualityStatus: 'NOT_STARTED',
    curriculumStatus: 'NOT_STARTED',
    visualRequirement: visualRequirementCandidate,
    visualRequirementCandidate,
    visualReasonCode: cues.reasons.join('|'),
    visualMarkers: cues.markers,
    visualType: inlineCount || svgRefs.length ? 'SVG' : cues.reasons.includes('GRAPH_OR_FUNCTION_STRUCTURE') ? 'GRAPH_CANDIDATE' : cues.reasons.length ? 'VISUAL_CANDIDATE' : 'NONE',
    problemVisualSufficiency: hasProblemVisual ? 'PROBLEM_VISUAL_PRESENT' : 'NO_PROBLEM_VISUAL',
    scalePolicy: cues.reasons.some((reason) => ['GRAPH_OR_FUNCTION_STRUCTURE', 'COORDINATE_OR_GEOMETRY_STRUCTURE'].includes(reason)) ? 'REVIEW_REQUIRED' : cues.reasons.length ? 'SCHEMATIC_OR_REVIEW' : 'N/A',
    existingSvgStatus,
    svgRepairStatus: existingSvgStatus === 'BROKEN_ASSET_REF' ? 'BROKEN_REF' : 'NOT_STARTED',
    factObligationSet: [],
    expectedFactHash: null,
    observedFactHash: svgRefs.length ? hashJson(svgRefs.map((item) => shaFile(item.absolute))) : null,
    numericParity: 'NOT_STARTED',
    semanticParity: 'NOT_STARTED',
    styleLintStatus: 'NOT_STARTED',
    renderStatus: 'NOT_TESTED',
    metadataStatus: metadata.status,
    metadataReason: metadata.reason,
    finalVerdict: 'INVENTORY_PENDING',
    evidenceRef: `01_scope_inventory.csv#${questionUid}`,
    assetRefs: resolvedRefs.map((item) => ({ field: item.field, ref: item.ref, resolvedPath: item.absolute ? rel(item.absolute) : '', exists: Boolean(item.absolute && fs.existsSync(item.absolute)) })),
    questionIndexParity: indexRecord ? 'INDEX_RECORD_PRESENT' : 'INDEX_RECORD_MISSING',
    qKey: indexRecord?.qKey || `${sourceJsPath.replace(/^archive\/exams\//, '')}_${id}`,
    sourceFileSha256: shaFile(sourcePath),
    solutionPresent: Boolean(normalize(question.solution)),
    answerValue: question.answer ?? null,
  };
  record.scopeStatus = canonicalUnits.has(record.standardUnitKey)
    ? 'IN_SCOPE_FORWARD'
    : /^M3-/.test(record.standardUnitKey)
      ? 'RECLASSIFIED_CANDIDATE'
      : 'SOURCE_REVIEW';
  return { record, question, indexRecord, svgRefs, cues };
}

function buildMarkdown(summary, ruleLock, canonicalUnits, unitRows, reverseRows, sourceFiles) {
  const lines = [
    '# 고1 전 단원 SVG 전수조사 실행 보고서',
    '',
    `- 상태: **${summary.status}**`,
    `- 기준일(KST): 2026-09-05`,
    `- 시작 origin/main SHA: \`${summary.originMainSha}\``,
    `- 기준 HEAD SHA: \`${summary.baselineHeadSha}\``,
    `- 작업 브랜치: \`${summary.branch}\``,
    `- 작업 트리 baseline: \`${summary.worktreeStatus}\``,
    `- 원본 JS 파일: **${sourceFiles}**`,
    `- 원본 고1 문항: **${summary.totalOriginalQuestionCount}**`,
    `- 정방향 scope 문항: **${summary.forwardScopeCount}**`,
    `- 역방향 candidate: **${summary.reverseScopeCandidateCount}**`,
    `- existing SVG 문항: **${summary.existingSvgQuestionCount}**`,
    `- unique SVG asset: **${summary.existingUniqueSvgAssetCount}**`,
    `- SVG_REQUIRED_MISSING 후보: **${summary.svgRequiredMissingCandidateCount}**`,
    '',
    '## 규칙 잠금',
    '',
    `- ruleset status: **${ruleLock.status}**`,
    `- ruleset lock SHA: \`${ruleLock.lockSha256}\``,
    `- applicable unit overlay: ${ruleLock.applicableUnitOverlay.length ? ruleLock.applicableUnitOverlay.join(', ') : 'NONE'}`,
    '',
    '## 단원별 초기 분모',
    '',
    '| key | label | total | existing SVG | missing-required candidate | metadata fail/legacy |',
    '|---|---|---:|---:|---:|---:|',
  ];
  for (const row of unitRows) lines.push(`| ${row.standardUnitKey} | ${row.standardUnit} | ${row.total} | ${row.existingSvgQuestionCount} | ${row.svgRequiredMissingCandidateCount} | ${row.metadataIssueCount} |`);
  lines.push('', '## 역방향 scan 상태', '', `- candidate rows: **${reverseRows.length}**`, `- unexplained by forward scope: **${summary.forwardReverseUnexplainedCount}**`, '', '## 현재 판정 범위', '', '- 이 문서는 전수 inventory와 정적 asset observation을 동결한 초기 산출물이다.', '- 아직 문항별 source-only 독립 풀이, SVG semantic parity, 브라우저 3-mode render, 확정 결함 수정 및 독립검수는 완료되지 않았다.', '- 따라서 최종 PASS/SEALED를 선언하지 않는다.', '', '## 39개 포함 키', '', [...canonicalUnits.keys()].join(', '), '');
  return lines.join('\n');
}

function main() {
  fs.mkdirSync(REPORT, { recursive: true });
  const ruleLock = buildRulesetLock();
  const canonicalUnits = parseCanonicalUnits();
  const compiled = parseCompiledMaster();
  const index = loadQuestionIndex();
  const indexMap = new Map(index.filter((row) => String(row.sourceFile || '').startsWith('original/high/h1/')).map((row) => [row.qKey, row]));
  const sourceFiles = listSourceFiles();
  const allRows = [];
  const reverseByUid = new Map();
  const assetPaths = new Map();
  const examRows = [];
  const parseErrors = [];
  const questionByUid = new Map();

  for (const sourcePath of sourceFiles) {
    const sourceJsPath = rel(sourcePath);
    const context = { window: {} };
    try {
      vm.createContext(context);
      vm.runInContext(fs.readFileSync(sourcePath, 'utf8'), context, { filename: sourcePath, timeout: 10000 });
    } catch (error) {
      parseErrors.push({ sourceJsPath, error: error instanceof Error ? error.message : String(error) });
      continue;
    }
    const bank = Array.isArray(context.window.questionBank) ? context.window.questionBank : [];
    const examTitle = normalize(context.window.examTitle || context.window.examName || bank[0]?.examTitle || sourceJsPath);
    const examRecord = { examId: examTitle, sourceJsPath, questionCount: bank.length, targetQuestionUids: [], existingSvgQuestionUids: [], svgRequiredMissingCandidateUids: [], renderModes: { exam: 'NOT_TESTED', solution: 'NOT_TESTED', answer: 'NOT_TESTED' } };
    const imageGroups = new Map();
    for (const question of bank) for (const item of refsFromQuestion(question)) if (item.ref) {
      const key = `${item.field}|${item.ref}`;
      if (!imageGroups.has(key)) imageGroups.set(key, []);
      imageGroups.get(key).push(question.id ?? question.displayNo);
    }
    bank.forEach((question, indexInBank) => {
      const ordinal = indexInBank + 1;
      const built = questionRow({ question, sourcePath, examTitle, ordinal, canonicalUnits, compiled, indexMap });
      const { record } = built;
      record.sharedAssetUid = '';
      record.dependencyQuestionUids = [];
      for (const item of record.assetRefs) {
        const assetGroup = imageGroups.get(`${item.field}|${item.ref}`) || [];
        if (assetGroup.length > 1) {
          record.sharedAssetUid = `${sourceJsPath}#${item.field}:${item.ref}`;
          record.dependencyQuestionUids = assetGroup.filter((id) => String(id) !== String(record.id)).map((id) => `${sourceJsPath}|${examTitle}|${id}`);
        }
        if (item.resolvedPath && item.exists && path.extname(item.resolvedPath).toLowerCase() === '.svg') assetPaths.set(item.resolvedPath, path.join(ROOT, item.resolvedPath));
      }
      record.dependencyClosureStatus = record.dependencyQuestionUids.length ? 'CLOSED_SHARED_ASSET' : 'CLOSED_NO_SHARED_ASSET';
      allRows.push(record);
      questionByUid.set(record.questionUid, question);
      examRecord.targetQuestionUids.push(record.questionUid);
      if (record.existingSvgStatus !== 'NONE' && record.existingSvgStatus !== 'BROKEN_ASSET_REF') examRecord.existingSvgQuestionUids.push(record.questionUid);
      if (record.visualRequirementCandidate === 'SVG_REQUIRED_MISSING') examRecord.svgRequiredMissingCandidateUids.push(record.questionUid);
      const reverseReasons = [];
      if (record.standardUnitKey && !canonicalUnits.has(record.standardUnitKey)) reverseReasons.push('FORWARD_KEY_OUTSIDE_CANONICAL_H1_SCOPE');
      if (record.visualMarkers.length) reverseReasons.push('EXPLICIT_VISUAL_MARKER');
      if (record.existingSvgStatus !== 'NONE') reverseReasons.push('EXISTING_VISUAL_ASSET_OR_BROKEN_REF');
      if (record.visualReasonCode) reverseReasons.push(record.visualReasonCode);
      if (reverseReasons.length) reverseByUid.set(record.questionUid, {
        questionUid: record.questionUid,
        sourceJsPath,
        id: record.id,
        standardUnitKey: record.standardUnitKey,
        scopeStatus: record.scopeStatus,
        visualMarkers: record.visualMarkers,
        visualReasonCode: record.visualReasonCode,
        existingSvgStatus: record.existingSvgStatus,
        includedByForwardScope: canonicalUnits.has(record.standardUnitKey),
        reasonCodes: [...new Set(reverseReasons)],
        status: canonicalUnits.has(record.standardUnitKey) ? 'FORWARD_CONFIRMATION' : 'REVIEW_REQUIRED',
      });
    });
    examRows.push(examRecord);
  }

  const reverseRows = [...reverseByUid.values()].sort((a, b) => a.questionUid.localeCompare(b.questionUid, 'ko'));
  const includedRows = allRows.filter((row) => row.scopeStatus === 'IN_SCOPE_FORWARD');
  const uniqueUids = new Set(allRows.map((row) => row.questionUid));
  const targetAssets = [...assetPaths.values()].sort((a, b) => rel(a).localeCompare(rel(b), 'ko')).map((filePath) => extractSvgFacts(filePath));
  const assetByPath = new Map(targetAssets.map((asset) => [asset.assetPath, asset]));
  const unitRows = [...canonicalUnits.values()].sort((a, b) => a.order - b.order || a.key.localeCompare(b.key)).map((unit) => {
    const rows = includedRows.filter((row) => row.standardUnitKey === unit.key);
    return {
      standardUnitKey: unit.key,
      standardUnit: unit.label,
      standardUnitOrder: unit.order,
      total: rows.length,
      existingSvgQuestionCount: rows.filter((row) => row.existingSvgStatus !== 'NONE' && row.existingSvgStatus !== 'BROKEN_ASSET_REF').length,
      existingUniqueSvgAssetCount: new Set(rows.flatMap((row) => row.assetRefs.filter((item) => item.exists && item.resolvedPath.endsWith('.svg')).map((item) => item.resolvedPath))).size,
      svgRequiredMissingCandidateCount: rows.filter((row) => row.visualRequirementCandidate === 'SVG_REQUIRED_MISSING').length,
      metadataIssueCount: rows.filter((row) => row.metadataStatus !== 'PASS').length,
      sourceOnlyReviewCoverage: 0,
      factObligationCoverage: 0,
      renderCoverage: 0,
      status: 'INVENTORY_FROZEN_ONLY',
    };
  });

  const rawWorktreeStatus = runGit(['status', '--porcelain=v1']);
  const preexistingWorktreeStatus = rawWorktreeStatus.split(/\r?\n/).filter((line) => line && !line.includes('archive/tools/high1-svg-audit/') && !line.includes('docs/reports/high1-svg-exhaustive-20260905/')).join('\n');
  const baseline = {
    repoRoot: ROOT,
    currentBranch: runGit(['branch', '--show-current']),
    localHeadSha: runGit(['rev-parse', 'HEAD']),
    originMainSha: runGit(['rev-parse', 'origin/main']),
    worktreeStatus: preexistingWorktreeStatus || 'CLEAN',
    postInventoryWorktreeStatus: rawWorktreeStatus || 'CLEAN',
    baselineTreeSha: sha256(`${runGit(['rev-parse', 'HEAD'])}\n${preexistingWorktreeStatus}`),
    baselineDateKst: '2026-09-05',
    ruleLock,
    canonicalUnitCount: canonicalUnits.size,
    canonicalUnitKeys: [...canonicalUnits.keys()],
    compiledMasterRecordCount: compiled.records.length,
    compiledMasterUnitCount: compiled.units.size,
    questionIndexH1Count: index.filter((row) => String(row.sourceFile || '').startsWith('original/high/h1/')).length,
    dbSha256: shaFile(DB_PATH),
    questionIndexSha256: shaFile(INDEX_PATH),
    sourceRoot: rel(SOURCE_ROOT),
    sourceFileCount: sourceFiles.length,
  };

  const scopeRows = includedRows;
  const priorExpectedFactsPath = path.join(REPORT, '05_expected_facts.jsonl');
  const priorExpectedFacts = new Map();
  if (fs.existsSync(priorExpectedFactsPath)) {
    for (const line of fs.readFileSync(priorExpectedFactsPath, 'utf8').split(/\r?\n/).filter(Boolean)) {
      try {
        const row = JSON.parse(line);
        if (row.questionUid) priorExpectedFacts.set(row.questionUid, row);
      } catch {
        // Ignore an incomplete prior line; the current inventory remains authoritative.
      }
    }
  }
  const visualRows = allRows.map((row) => ({
    questionUid: row.questionUid,
    sourceJsPath: row.sourceJsPath,
    id: row.id,
    standardUnitKey: row.standardUnitKey,
    standardUnit: row.standardUnit,
    visualRequirementCandidate: row.visualRequirementCandidate,
    existingSvgStatus: row.existingSvgStatus,
    visualReasonCode: row.visualReasonCode,
    visualMarkers: row.visualMarkers,
    visualType: row.visualType,
    problemVisualSufficiency: row.problemVisualSufficiency,
    scalePolicyCandidate: row.scalePolicy,
    assetRefs: row.assetRefs,
    status: 'TRIAGE_NOT_INDEPENDENTLY_REVIEWED',
  }));
  const svgParityRows = scopeRows.filter((row) => row.existingSvgStatus !== 'NONE' || row.inlineSvgCount > 0).map((row) => ({
    questionUid: row.questionUid,
    sourceJsPath: row.sourceJsPath,
    id: row.id,
    assetRefs: row.assetRefs,
    expectedFactHash: row.expectedFactHash,
    observedFactHash: row.observedFactHash,
    numericParity: 'NOT_STARTED',
    semanticParity: 'NOT_STARTED',
    styleLintStatus: 'STATIC_OBSERVATION_PENDING',
    renderStatus: 'NOT_TESTED',
    finalVerdict: 'NOT_REVIEWED',
  }));
  const expectedFacts = includedRows.map((row) => priorExpectedFacts.get(row.questionUid) || ({ questionUid: row.questionUid, standardUnitKey: row.standardUnitKey, factObligationSet: [], independentAnswer: '', expectedFactHash: null, status: 'SOURCE_ONLY_NOT_STARTED' }));
  const observedFacts = targetAssets.map((asset) => ({ assetPath: asset.assetPath, assetSha256: asset.assetSha256, staticXmlStatus: asset.staticXmlStatus, observedFacts: asset, status: 'STATIC_PRIMITIVE_OBSERVED_NOT_SEMANTICALLY_VERIFIED' }));
  const repairRows = [];
  const renderRows = examRows.map((row) => ({
    examId: row.examId,
    sourceJsPath: row.sourceJsPath,
    questionCount: row.questionCount,
    targetQuestionCount: row.targetQuestionUids.length,
    existingSvgQuestionCount: row.existingSvgQuestionUids.length,
    svgRequiredMissingCandidateCount: row.svgRequiredMissingCandidateUids.length,
    modes: 'exam=NOT_TESTED|solution=NOT_TESTED|answer=NOT_TESTED',
    renderStatus: 'NOT_TESTED',
  }));
  const protectedDiff = {
    baselineTreeSha: baseline.baselineTreeSha,
    outOfScopeDiffCount: 0,
    unauthorizedFieldDiff: 0,
    untouchedAssetHashChange: 0,
    note: 'No production mutation was performed during inventory generation.',
  };

  const summary = {
    status: ruleLock.status === 'LOCKED' && baseline.currentBranch === 'main' && baseline.localHeadSha === baseline.originMainSha ? 'INVENTORY_FROZEN_REVIEW_PENDING' : 'BASELINE_GATE_FAIL',
    branch: baseline.currentBranch,
    baselineHeadSha: baseline.localHeadSha,
    originMainSha: baseline.originMainSha,
    worktreeStatus: baseline.worktreeStatus || 'CLEAN',
    sourceFileCount: sourceFiles.length,
    totalOriginalQuestionCount: allRows.length,
    forwardScopeCount: scopeRows.length,
    totalByCurriculumAndUnitKey: Object.fromEntries(unitRows.map((row) => [row.standardUnitKey, row.total])),
    reverseScopeCandidateCount: reverseRows.length,
    forwardReverseUnexplainedCount: reverseRows.filter((row) => row.status === 'REVIEW_REQUIRED' && !row.includedByForwardScope).length,
    reconciledScopeCount: includedRows.length,
    reclassifiedCandidateCount: allRows.filter((row) => row.scopeStatus === 'RECLASSIFIED_CANDIDATE').length,
    existingSvgQuestionCount: includedRows.filter((row) => row.existingSvgStatus !== 'NONE' && row.existingSvgStatus !== 'BROKEN_ASSET_REF').length,
    existingUniqueSvgAssetCount: targetAssets.length,
    svgRequiredMissingCandidateCount: includedRows.filter((row) => row.visualRequirementCandidate === 'SVG_REQUIRED_MISSING').length,
    svgOptionalCount: includedRows.filter((row) => row.visualRequirementCandidate === 'SVG_OPTIONAL').length,
    svgExemptCount: 0,
    nonSvgVisualPreferredCount: 0,
    targetSvgReviewQuestionCount: svgParityRows.length,
    targetSvgAssetCount: targetAssets.length,
    targetRenderExamCount: renderRows.length,
    duplicateQuestionUid: allRows.length - uniqueUids.size,
    unresolvedIdentity: allRows.filter((row) => !row.questionUid || !row.id).length,
    missingSourcePath: allRows.filter((row) => !row.sourceJsPath).length,
    unresolvedDependency: allRows.filter((row) => row.dependencyClosureStatus.startsWith('UNRESOLVED')).length,
    parseErrorCount: parseErrors.length,
    missingIndexRecordCount: allRows.filter((row) => row.questionIndexParity === 'INDEX_RECORD_MISSING').length,
    metadataIssueCount: scopeRows.filter((row) => row.metadataStatus !== 'PASS').length,
    visualTriageCoverage: allRows.length ? visualRows.length / allRows.length : 0,
    sourceOnlyReviewCoverage: expectedFacts.filter((row) => row.status === 'SOURCE_ONLY_REVIEWED').length / Math.max(1, includedRows.length),
    existingSvgQuestionCoverage: 0,
    uniqueSvgAssetCoverage: 0,
    svgRequiredMissingDecisionCoverage: 0,
    factObligationCoverage: expectedFacts.filter((row) => row.status === 'SOURCE_ONLY_REVIEWED').length / Math.max(1, includedRows.length),
    observedFactCoverage: targetAssets.length ? 1 : 0,
    renderCoverage: 0,
    notes: ['Initial deterministic inventory and static SVG observation only. No final PASS/SEALED claim.'],
  };

  writeJson('00_baseline_and_ruleset_lock.json', { baseline, summary });
  writeCsv('01_scope_inventory.csv', scopeRows);
  writeCsv('02_reverse_scan_candidates.csv', reverseRows);
  writeCsv('03_visual_triage.csv', visualRows);
  writeCsv('04_svg_asset_manifest.csv', targetAssets.map((asset) => ({
    assetPath: asset.assetPath,
    assetSha256: asset.assetSha256,
    byteCount: asset.byteCount,
    staticXmlStatus: asset.staticXmlStatus,
    viewBox: asset.viewBox,
    preserveAspectRatio: asset.preserveAspectRatio,
    primitiveCounts: JSON.stringify(asset.counts),
    forbiddenNodes: asset.forbiddenNodes,
    externalRefs: asset.externalRefs,
    labelCount: asset.labels.length,
    observedFactHash: asset.observedFactHash,
  })));
  writeJsonl('05_expected_facts.jsonl', expectedFacts);
  writeJsonl('06_observed_facts.jsonl', observedFacts);
  writeCsv('07_svg_parity.csv', svgParityRows);
  writeCsv('08_repair_ledger.csv', repairRows);
  writeCsv('09_render_matrix.csv', renderRows);
  writeJson('10_unit_status.json', { status: 'INVENTORY_FROZEN_REVIEW_PENDING', rows: unitRows });
  writeJson('11_protected_diff.json', protectedDiff);
  fs.writeFileSync(path.join(REPORT, 'FINAL_REPORT.md'), buildMarkdown(summary, ruleLock, canonicalUnits, unitRows, reverseRows, sourceFiles.length), 'utf8');
  writeJson('inventory_internal.json', { summary, baseline, parseErrors, allRows, examRows, assets: targetAssets });
  console.log(JSON.stringify(summary, null, 2));
}

main();
