import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const EXAMS = path.join(ARCHIVE, 'exams');
const INDEX_PATH = path.join(ARCHIVE, 'question-index.js');
const OUTPUT = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const require = createRequire(import.meta.url);
const core = require(path.join(ARCHIVE, 'unit-past-exams-core.js'));

const RAW_KEYS = [
  'H15-SA-09', 'H15-SA-10', 'H15-SA-11', 'H15-SA-12',
  'H22-C2-01', 'H22-C2-02', 'H22-C2-03', 'H22-C2-04',
];
const MAPPED_KEYS = new Set(['H22-C2-01', 'H22-C2-02', 'H22-C2-03', 'H22-C2-04']);
const FORWARD_SOURCE_PREFIX = 'original/high/h1/';
const REVERSE_TERMS = [
  ['평면좌표', /좌표평면|좌표상|두 점 사이의 거리|내분점|외분점|중점|무게중심|삼각형의 넓이/],
  ['직선의 방정식', /직선의 방정식|기울기|두 직선|점과 직선|직선과 직선|평행|수직|절편|교점/],
  ['원의 방정식', /원의 방정식|원과 직선|원의 중심|반지름|두 원|원 위의 점|접선|접점|자취/],
  ['도형의 이동', /도형의 이동|평행이동|대칭이동|대칭하여|대칭인 점|이동한 도형/],
];

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function fileSha(filePath) {
  return fs.existsSync(filePath) ? sha256(fs.readFileSync(filePath)) : null;
}

function normalized(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') return value.replace(/\r\n/g, '\n').trim();
  return value;
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return normalized(value);
}

function hashJson(value) {
  return sha256(JSON.stringify(stable(value)));
}

function relativeArchive(filePath) {
  return path.relative(ARCHIVE, filePath).split(path.sep).join('/');
}

function relativeExam(filePath) {
  return path.relative(EXAMS, filePath).split(path.sep).join('/');
}

function loadQuestionIndex() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(INDEX_PATH, 'utf8'), context, { filename: INDEX_PATH });
  return context.window.questionIndex || [];
}

function loadBanks() {
  const banks = new Map();
  const root = path.join(EXAMS, 'original', 'high', 'h1');
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else if (entry.isFile() && entry.name.endsWith('.js')) files.push(absolute);
    }
  }
  walk(root);
  for (const file of files.sort()) {
    const context = { window: {} };
    try {
      vm.createContext(context);
      vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 4000 });
      const bank = context.window.questionBank || [];
      const sourceFile = relativeExam(file);
      for (const question of bank) {
        const qKey = `${sourceFile}_${question.id}`;
        banks.set(qKey, { ...question, qKey, sourceFile, sourceFileSha256: fileSha(file) });
      }
    } catch (error) {
      banks.set(`__PARSE_ERROR__${relativeExam(file)}`, {
        qKey: `__PARSE_ERROR__${relativeExam(file)}`,
        sourceFile: relativeExam(file),
        parseError: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return banks;
}

function getCatalogRecords(index) {
  const catalog = core.buildCatalog(index);
  const records = catalog.units
    .filter((unit) => MAPPED_KEYS.has(unit.key))
    .flatMap((unit) => unit.records)
    .sort(core.compareRecords);
  return { catalog, records };
}

function inferVisualRequirement(question, mappedUnitKey) {
  const combined = [
    question.content || '',
    question.subUnit || '',
    ...(question.tags || []),
  ].join(' ');
  if (mappedUnitKey === 'H22-C2-03') {
    if (/r\s*\^?\s*2\s*[<＝=]\s*0|반지름.{0,8}(0|허수|없)/.test(combined)) return 'REVIEW_REQUIRED';
    return 'VISUAL_REQUIRED';
  }
  if (mappedUnitKey === 'H22-C2-02' && /두 직선|평행|수직|교점|점과 직선|거리|절편/.test(combined)) return 'VISUAL_REQUIRED';
  if (mappedUnitKey === 'H22-C2-04' && /두 단계|합성|도형|직선|원|대칭|평행이동/.test(combined)) return 'VISUAL_REQUIRED';
  if (mappedUnitKey === 'H22-C2-01' && /내분|외분|중점|무게중심|넓이|대칭|도형/.test(combined)) return 'VISUAL_REQUIRED';
  return 'REVIEW_REQUIRED';
}

function buildProtectedPayload(question, record) {
  return {
    content: question.content,
    choices: question.choices || [],
    answer: question.answer,
    image: question.image || null,
    id: question.id,
    displayNo: question.displayNo || question.id,
    sourceIdentity: {
      qKey: record.qKey,
      sourceFile: record.sourceFile,
      sourceOrdinal: record.sourceOrdinal,
    },
  };
}

function resolveAsset(solutionImage) {
  if (!solutionImage || typeof solutionImage !== 'string') return null;
  const normalizedPath = solutionImage.replaceAll('\\', '/').replace(/^\.\//, '');
  const absolute = path.resolve(ARCHIVE, normalizedPath);
  const insideArchive = absolute === ARCHIVE || absolute.startsWith(`${ARCHIVE}${path.sep}`);
  return {
    ref: solutionImage,
    archivePath: insideArchive ? relativeArchive(absolute) : null,
    exists: insideArchive && fs.existsSync(absolute),
    sha256: insideArchive && fs.existsSync(absolute) ? fileSha(absolute) : null,
  };
}

function makeQuestionRow(record, question) {
  const rawKey = record.standardUnitKey || question.standardUnitKey || '';
  const mappedKey = record.mappedUnitKey;
  const protectedPayload = buildProtectedPayload(question, record);
  const asset = resolveAsset(question.solutionImage);
  const solution = question.solution || '';
  const uid = `h1:${record.qKey}`;
  return {
    questionUid: uid,
    qKey: record.qKey,
    examId: record.sourceExamKey,
    sourceJsPath: record.sourceFile,
    sourceOrdinal: record.sourceOrdinal,
    id: record.id,
    displayNo: question.displayNo || record.id,
    examYear: record.examYear,
    semester: record.semester,
    examType: record.examType,
    school: record.school,
    curriculumVersion: rawKey.startsWith('H15-') ? '2015' : '2022',
    standardCourse: question.standardCourse || record.course,
    standardUnitKey: rawKey,
    standardUnit: question.standardUnit || record.standardUnit,
    mappedUnitKey: mappedKey,
    mappedUnit: record.mappedUnit,
    subUnitKey: question.subUnitKey || record.subUnitKey || '',
    subUnit: question.subUnit || record.subUnit || '',
    scopeReason: RAW_KEYS.includes(rawKey) ? 'forward_standard_key' : 'mapped_unit_key',
    scopeSource: 'archive/question-index.js + archive/exams/original/high/h1/**/*.js',
    scopeStatus: 'INCLUDED',
    contentHash: hashJson({ content: question.content, choices: question.choices || [] }),
    protectedCoreHash: hashJson(protectedPayload),
    baselineJsSha256: fileSha(path.join(ARCHIVE, record.sourceFile)),
    baselineQuestionHash: hashJson(question),
    baselineSolutionHash: hashJson(solution),
    solutionPresent: Boolean(solution.trim()),
    solutionLength: solution.length,
    solutionImageRef: question.solutionImage || '',
    solutionImageStatus: asset ? (asset.exists ? 'EXISTS' : 'MISSING') : 'NONE',
    solutionImageSha256: asset?.sha256 || null,
    visualRequirement: inferVisualRequirement(question, mappedKey),
    visualRequirementStatus: 'INITIAL_TRIAGE_ONLY',
    visualExceptionCode: '',
    builderStatus: 'INVENTORIED',
    selfCheckStatus: 'NOT_STARTED',
    mathReviewStatus: 'NOT_TESTED',
    educationReviewStatus: 'NOT_TESTED',
    svgReviewStatus: 'NOT_TESTED',
    renderReviewStatus: 'NOT_TESTED',
    sourceDefectStatus: 'NOT_TESTED',
    metadataDefectStatus: 'NOT_TESTED',
    currentArtifactSha: fileSha(path.join(ARCHIVE, record.sourceFile)),
    finalArtifactSha: null,
  };
}

function textForReverse(record) {
  return [record.contentText, record.choicesText, record.standardUnit, record.subUnit, ...(record.tags || [])]
    .filter(Boolean).join(' ');
}

function buildReverseScan(index, included) {
  const rows = [];
  const includedKeys = new Set(included.map((row) => row.qKey));
  for (const record of index.filter((item) => String(item.sourceFile || '').startsWith(FORWARD_SOURCE_PREFIX))) {
    const matchedTerms = REVERSE_TERMS.filter(([, pattern]) => pattern.test(textForReverse(record))).map(([term]) => term);
    if (!matchedTerms.length) continue;
    rows.push({
      questionUid: `h1:${record.qKey}`,
      qKey: record.qKey,
      sourceJsPath: record.sourceFile,
      id: record.id,
      standardUnitKey: record.standardUnitKey || '',
      mappedUnitKey: includedKeys.has(record.qKey)
        ? included.find((row) => row.qKey === record.qKey)?.mappedUnitKey || ''
        : '',
      matchedTerms,
      includedByForwardScan: includedKeys.has(record.qKey),
      status: includedKeys.has(record.qKey) ? 'INCLUDED_CONFIRMATION' : 'REVIEW_REQUIRED',
    });
  }
  return rows;
}

function fingerprintFiles() {
  const files = [
    'docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md',
    'docs/rules/02_PIPELINES/수정프로토콜.md',
    'docs/rules/03_REVIEW/무결성검수.md',
    'docs/rules/03_REVIEW/수학_문항오류_검증_프로토콜_v2.1.md',
    'docs/rules/02_PIPELINES/작업방식_5문항배치루프_필수.md',
    'docs/rules/02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md',
    'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md',
    'docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md',
    'docs/plans/고1_도형의방정식_전수업그레이드_다중독립검수_최종봉인프로토콜_v2.2.md',
    'archive/unit-past-exams-core.js',
    'archive/question-index.js',
    'archive/db.js',
    'archive/engine.html',
    'archive/mixed_engine.html',
  ];
  const rows = files.map((relative) => ({
    path: relative,
    exists: fs.existsSync(path.join(ROOT, relative)),
    sha256: fileSha(path.join(ROOT, relative)),
  }));
  return {
    files: rows,
    rulesetSha: hashJson(rows.filter((row) => row.path.startsWith('docs/'))),
    masterMdSha: fileSha(path.join(ROOT, 'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md')),
    masterJsonSha: fileSha(path.join(ROOT, 'archive/data/master_tables/subunit_conflict_rules_v1.json')),
    engineSha: hashJson(rows.filter((row) => row.path.includes('engine.html'))),
    dbSha: fileSha(path.join(ROOT, 'archive/db.js')),
    questionIndexSha: fileSha(INDEX_PATH),
  };
}

function treeSha(rows) {
  return sha256(rows.filter(Boolean).sort((a, b) => a.path.localeCompare(b.path)).map((row) => `${row.path}\t${row.sha256}`).join('\n'));
}

function writeCsv(filePath, rows) {
  if (!rows.length) {
    fs.writeFileSync(filePath, '\n', 'utf8');
    return;
  }
  const keys = Object.keys(rows[0]);
  const escape = (value) => {
    const text = Array.isArray(value) ? value.join('|') : value === null || value === undefined ? '' : String(value);
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  const lines = [keys.join(',')];
  for (const row of rows) lines.push(keys.map((key) => escape(row[key])).join(','));
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
}

function buildMarkdown(summary, rows, reverseScan, fingerprints) {
  const lines = [
    '# 고1 도형의 방정식 전수 Inventory / Manifest 보고서\n\n',
    '- 생성 상태: `MANIFEST_FROZEN`\n',
    `- 생성 시각: ${new Date().toISOString()}\n`,
    '- 기준: 프로토콜 v2.2, H15·H22 고1 원본 production 문항\n',
    `- 정방향 unique target: **${rows.length}**\n`,
    `- 역방향 내용 스캔 candidate: **${reverseScan.length}**\n`,
    `- 역방향 추가 candidate: **${reverseScan.filter((row) => !row.includedByForwardScan).length}**\n\n`,
    '## 단원별 집계\n\n',
    '| raw standardUnitKey | mapped unit | 문항 수 | 해설 있음 | SVG 존재 | SVG 누락 |\n',
    '|---|---|---:|---:|---:|---:|\n',
  ];
  const groups = new Map();
  for (const row of rows) {
    const key = `${row.standardUnitKey}|${row.mappedUnitKey}`;
    const group = groups.get(key) || { total: 0, solution: 0, svg: 0, missing: 0 };
    group.total += 1;
    group.solution += row.solutionPresent ? 1 : 0;
    group.svg += row.solutionImageStatus === 'EXISTS' ? 1 : 0;
    group.missing += row.solutionImageStatus === 'MISSING' ? 1 : 0;
    groups.set(key, group);
  }
  for (const [key, group] of [...groups.entries()].sort()) {
    const [raw, mapped] = key.split('|');
    lines.push(`| ${raw} | ${mapped} | ${group.total} | ${group.solution} | ${group.svg} | ${group.missing} |\n`);
  }
  lines.push('\n## Fingerprint\n\n');
  lines.push(`- RULESET_SHA: \`${fingerprints.rulesetSha}\`\n`);
  lines.push(`- MASTER_MD_SHA: \`${fingerprints.masterMdSha || 'MISSING'}\`\n`);
  lines.push(`- MASTER_JSON_SHA: \`${fingerprints.masterJsonSha || 'MISSING'}\`\n`);
  lines.push(`- ENGINE_SHA: \`${fingerprints.engineSha}\`\n`);
  lines.push(`- DB_SHA: \`${fingerprints.dbSha || 'MISSING'}\`\n`);
  lines.push(`- QUESTION_INDEX_SHA: \`${fingerprints.questionIndexSha || 'MISSING'}\`\n`);
  lines.push(`- MANIFEST_SHA: \`${summary.manifestSha}\`\n`);
  lines.push(`- BASELINE_TREE_SHA: \`${summary.baselineTreeSha}\`\n\n`);
  lines.push('## 정방향 문항 목록\n\n');
  lines.push('| questionUid | raw key | mapped key | source | id | subUnit | solution | SVG |\n');
  lines.push('|---|---|---|---|---:|---|---|---|\n');
  for (const row of rows) {
    lines.push(`| ${row.questionUid} | ${row.standardUnitKey} | ${row.mappedUnitKey} | ${row.sourceJsPath} | ${row.id} | ${row.subUnitKey} | ${row.solutionPresent ? 'YES' : 'NO'} | ${row.solutionImageStatus} |\n`);
  }
  lines.push('\n## 역방향 내용 스캔\n\n');
  lines.push('| questionUid | source | id | metadata key | matched terms | status |\n');
  lines.push('|---|---|---:|---|---|---|\n');
  for (const row of reverseScan) lines.push(`| ${row.questionUid} | ${row.sourceJsPath} | ${row.id} | ${row.standardUnitKey} | ${row.matchedTerms.join(', ')} | ${row.status} |\n`);
  return lines.join('');
}

function main() {
  fs.mkdirSync(OUTPUT, { recursive: true });
  const index = loadQuestionIndex();
  const banks = loadBanks();
  const { catalog, records } = getCatalogRecords(index);
  const rows = [];
  const missingBanks = [];
  for (const record of records) {
    const question = banks.get(record.qKey);
    if (!question || question.parseError) {
      missingBanks.push({ qKey: record.qKey, sourceFile: record.sourceFile, id: record.id, error: question?.parseError || 'bank_not_found' });
      continue;
    }
    rows.push(makeQuestionRow(record, question));
  }
  const reverseScan = buildReverseScan(index, rows);
  const fingerprints = fingerprintFiles();
  const sourceRows = [...new Map(rows.map((row) => [row.sourceJsPath, row.baselineJsSha256])).entries()]
    .map(([file, sha256Value]) => ({ path: `archive/${file}`, sha256: sha256Value }));
  const assetRows = rows.filter((row) => row.solutionImageRef && row.solutionImageStatus === 'EXISTS')
    .map((row) => ({ path: `archive/${row.solutionImageRef.replaceAll('\\', '/')}`, sha256: row.solutionImageSha256 }));
  const baselineTreeSha = treeSha([...sourceRows, ...assetRows]);
  const manifestPayload = {
    protocol: '고1 도형의 방정식 전수 업그레이드 및 다중 독립 검수·최종 봉인 프로토콜 v2.2',
    generatedAt: new Date().toISOString(),
    rawKeys: RAW_KEYS,
    mappedKeys: [...MAPPED_KEYS],
    targetCount: rows.length,
    rows,
  };
  const manifestSha = hashJson(manifestPayload);
  const summary = {
    generatedAt: manifestPayload.generatedAt,
    status: 'MANIFEST_FROZEN',
    rawKeys: RAW_KEYS,
    mappedKeys: [...MAPPED_KEYS],
    indexCount: index.length,
    catalogScannedCount: catalog.scannedCount,
    catalogClassifiedCount: catalog.classifiedCount,
    catalogReviewCount: catalog.review.length,
    catalogInvalidCount: catalog.invalid.length,
    targetCount: rows.length,
    missingBankCount: missingBanks.length,
    reverseScanCount: reverseScan.length,
    reverseAdditionalCandidateCount: reverseScan.filter((row) => !row.includedByForwardScan).length,
    duplicateUidCount: rows.length - new Set(rows.map((row) => row.questionUid)).size,
    duplicateContentHashCount: rows.length - new Set(rows.map((row) => row.contentHash)).size,
    solutionPresentCount: rows.filter((row) => row.solutionPresent).length,
    solutionImageExistsCount: rows.filter((row) => row.solutionImageStatus === 'EXISTS').length,
    solutionImageMissingCount: rows.filter((row) => row.solutionImageStatus === 'MISSING').length,
    solutionImageNoneCount: rows.filter((row) => row.solutionImageStatus === 'NONE').length,
    initialVisualRequiredCount: rows.filter((row) => row.visualRequirement === 'VISUAL_REQUIRED').length,
    baselineTreeSha,
    manifestSha,
    fingerprints,
  };
  fs.writeFileSync(path.join(OUTPUT, 'geometry_equation_inventory.json'), JSON.stringify({ summary, rows, reverseScan, missingBanks }, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(OUTPUT, 'geometry_equation_manifest.json'), JSON.stringify(manifestPayload, null, 2) + '\n', 'utf8');
  writeCsv(path.join(OUTPUT, 'geometry_equation_inventory.csv'), rows);
  writeCsv(path.join(OUTPUT, 'geometry_equation_scope_reverse_scan.csv'), reverseScan);
  fs.writeFileSync(path.join(OUTPUT, 'geometry_equation_fingerprint.json'), JSON.stringify({ ...fingerprints, baselineTreeSha, manifestSha }, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(OUTPUT, 'geometry_equation_manifest.md'), buildMarkdown(summary, rows, reverseScan, fingerprints), 'utf8');
  fs.writeFileSync(path.join(OUTPUT, 'geometry_equation_summary.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(summary, null, 2));
}

main();
