import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3');
const outputPath = path.join(outputDir, 'archive-db-source-evidence-intake-v1.json');
const consistencyPath = path.join(outputDir, 'archive-db-archive-consistency-v1.json');
const dRoot = 'D:\\';

const TEXT_EXTENSIONS = new Set(['.js', '.json', '.md', '.txt', '.csv', '.xml', '.html']);
const GENERIC_TOKENS = new Set([
  'types', 'similar', 'high', 'middle', 'h1', 'h2', 'm1', 'm2', 'm3', 'js',
  '고1', '고2', '중1', '중2', '중3', '유형', '유형심화', '유형확인', '유형변형',
  '모의고사', '중간', '기말', '대비', '단원', '평가', '대표문제', '다시풀기',
  '익힘책', '대단원', '중단원', '1학기', '2학기', '1회', '2회', '3회', '4회', '5회'
]);

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function normalize(value) {
  return String(value || '')
    .replaceAll('\\', '/')
    .replace(/^archive\/exams\//, '')
    .replace(/^exams\//, '')
    .replace(/^\.\//, '')
    .trim();
}

function loadWindow(filePath) {
  const context = { window: {}, console };
  vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context, { timeout: 10000, filename: filePath });
  return context.window;
}

function tokenize(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => token.length >= 2 && !GENERIC_TOKENS.has(token));
}

function walkFiles(root) {
  const files = [];
  if (!fs.existsSync(root)) return files;
  function walk(dir) {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name === '$RECYCLE.BIN' || entry.name === 'System Volume Information') continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else files.push(fullPath);
    }
  }
  walk(root);
  return files;
}

function scopeOf(file) {
  if (file.startsWith('original/')) return 'original';
  if (file.startsWith('types/')) return 'types';
  if (file.startsWith('similar/')) return 'similar';
  return 'other';
}

function missingFields(record) {
  return ['school', 'year', 'semester', 'examType']
    .filter(field => record[field] === undefined || record[field] === null || String(record[field]).trim() === '');
}

function directArchiveEvidence(file, examTitle, fields) {
  const titleTexts = [path.basename(file, '.js'), String(examTitle || '')];
  const text = titleTexts.join(' ');
  const evidence = {};
  if (fields.includes('year')) {
    // The archive convention permits YY_ only as a title prefix; numbers
    // embedded in RPM/part labels (e.g. _12_ or _2-1_) are not years.
    for (const candidate of titleTexts) {
      const match = candidate.match(/^(20\d{2}|[01]\d|2[0-6])_/);
      if (match) {
        evidence.year = { value: match[1].length === 2 ? `20${match[1]}` : match[1], source: 'file_or_examTitle_prefix' };
        break;
      }
    }
  }
  if (fields.includes('semester')) {
    const match = text.match(/([12])학기/);
    if (match) evidence.semester = { value: match[1], source: 'file_or_examTitle' };
  }
  if (fields.includes('examType')) {
    const match = text.match(/(중간|기말)/);
    if (match) evidence.examType = { value: match[1] === '중간' ? 'mid' : 'final', source: 'file_or_examTitle' };
  }
  // A school token is not inferred from a subject/book label. Only explicit
  // school/provider metadata would be eligible, and all missing-school rows
  // lack such a declaration in this queue.
  return evidence;
}

function buildDMatches(queue, dFiles, textHits) {
  const matchesByFile = new Map();
  for (const file of queue) {
    const base = path.basename(file, '.js');
    const queryTokens = [...new Set(tokenize(base))];
    const candidates = dFiles
      .map(candidate => {
        const candidateTokens = tokenize(path.basename(candidate));
        const hit = queryTokens.filter(token => candidateTokens.some(other => other.includes(token) || token.includes(other)));
        return { path: candidate, score: [...new Set(hit)].length, hit: [...new Set(hit)] };
      })
      .filter(candidate => candidate.score > 0)
      .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path, 'ko'))
      .slice(0, 8)
      .map(candidate => ({
        path: candidate.path,
        score: candidate.score,
        matchedTokens: candidate.hit,
        disposition: 'contextual_candidate_rejected'
      }));
    const exactBasename = dFiles.filter(candidate => path.basename(candidate, path.extname(candidate)) === base);
    matchesByFile.set(file, {
      exactBasename: exactBasename,
      textExact: textHits.filter(hit => hit.file === file).map(hit => hit.path),
      contextualCandidates: candidates
    });
  }
  return matchesByFile;
}

export function reviewSourceDependentDbMetadataV1() {
  if (!fs.existsSync(consistencyPath)) throw new Error(`Missing consistency report: ${consistencyPath}`);
  const consistency = JSON.parse(fs.readFileSync(consistencyPath, 'utf8'));
  const queue = [...consistency.emptySchool.map(item => item.file), ...consistency.requiredFieldGaps.map(item => item.file)]
    .filter((file, index, all) => all.indexOf(file) === index)
    .sort((a, b) => a.localeCompare(b, 'ko'));
  const db = loadWindow(path.join(archiveDir, 'db.js')).mainDB?.exams || [];
  const dbByFile = new Map(db.map(record => [normalize(record.file), record]));
  const archiveRows = queue.map(file => {
    const record = dbByFile.get(file);
    const sourcePath = path.join(archiveDir, 'exams', ...file.split('/'));
    const window = loadWindow(sourcePath);
    const fields = missingFields(record || {});
    const directEvidence = directArchiveEvidence(file, window.examTitle, fields);
    const nonSourceWindowKeys = Object.keys(window).filter(key => !['examTitle', 'questionBank'].includes(key));
    return {
      file,
      scope: scopeOf(file),
      missingFields: fields,
      examTitle: window.examTitle || '',
      db: {
        school: record?.school ?? '',
        year: record?.year ?? '',
        semester: record?.semester ?? '',
        examType: record?.examType ?? '',
        grade: record?.grade ?? '',
        subject: record?.subject ?? '',
        contentType: record?.contentType ?? '',
        qCount: record?.qCount ?? null
      },
      directArchiveEvidence: directEvidence,
      nonSourceWindowKeys,
      action: Object.keys(directEvidence).length ? 'field_review_required' : 'defer_source_dependent'
    };
  });

  const dFiles = walkFiles(dRoot);
  const textHits = [];
  const textNeedles = archiveRows.flatMap(row => [row.examTitle, path.basename(row.file, '.js')]).filter(value => value.length >= 5);
  for (const candidate of dFiles.filter(file => TEXT_EXTENSIONS.has(path.extname(file).toLowerCase()))) {
    let text = '';
    try {
      text = fs.readFileSync(candidate, 'utf8');
    } catch {
      continue;
    }
    for (const row of archiveRows) {
      const needles = [row.examTitle, path.basename(row.file, '.js')].filter(value => value.length >= 5);
      if (needles.some(needle => text.includes(needle))) textHits.push({ file: row.file, path: candidate });
    }
  }
  const dMatches = buildDMatches(queue, dFiles, textHits);
  for (const row of archiveRows) row.dDriveEvidence = dMatches.get(row.file);

  const promoted = archiveRows.flatMap(row => Object.entries(row.directArchiveEvidence).map(([field, evidence]) => ({ file: row.file, field, ...evidence })));
  const deferred = archiveRows.flatMap(row => row.missingFields.filter(field => !row.directArchiveEvidence[field]).map(field => ({ file: row.file, scope: row.scope, field, reason: 'no_direct_source_evidence' })));
  const contextualOnlyRows = archiveRows.filter(row => row.dDriveEvidence.contextualCandidates.length > 0 && !row.dDriveEvidence.exactBasename.length && !row.dDriveEvidence.textExact.length);
  const report = {
    generatedAt: new Date().toISOString(),
    schemaVersion: 'archive-db-source-evidence-intake-v1',
    policy: '직접 파일명·examTitle·명시 source metadata·1:1 source artifact만 승격하고, 교재/단원명/인접 파일/파일 날짜/교육과정 연도는 contextual evidence로 거부한다.',
    scope: {
      queueFiles: queue.length,
      emptySchoolRecords: consistency.emptySchool.length,
      requiredFieldGapRecords: consistency.requiredFieldGaps.length,
      dRoot,
      dDriveFilesScanned: dFiles.length,
      dDriveTextFilesScanned: dFiles.filter(file => TEXT_EXTENSIONS.has(path.extname(file).toLowerCase())).length,
      exactSourceBasenameMatches: archiveRows.reduce((sum, row) => sum + row.dDriveEvidence.exactBasename.length, 0),
      exactTextSourceMatches: archiveRows.reduce((sum, row) => sum + row.dDriveEvidence.textExact.length, 0),
      contextualCandidateRows: contextualOnlyRows.length
    },
    promotedFields: promoted,
    deferredFields: deferred,
    rows: archiveRows,
    decisions: {
      dbWrites: false,
      promotedFieldCount: promoted.length,
      deferredFieldCount: deferred.length,
      allDMatchesAreContextualOrEmpty: archiveRows.every(row => row.dDriveEvidence.exactBasename.length === 0 && row.dDriveEvidence.textExact.length === 0),
      sourceDependentOnly: promoted.length === 0,
      noInferenceFromContext: true
    },
    validation: {
      consistencyDigest: consistency.digest,
      dbRecords: db.length,
      queueMatchesConsistency: queue.length === consistency.requiredFieldGaps.length,
      noProductionWrites: true,
      noCommitOrPush: true
    }
  };
  const stable = { ...report };
  delete stable.generatedAt;
  report.digest = sha256(JSON.stringify(stable));
  return report;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = reviewSourceDependentDbMetadataV1();
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, scope: report.scope, decisions: report.decisions }, null, 2));
}
