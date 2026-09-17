import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const base = path.join(root, 'archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging');
const sourcePath = path.join(base, 'source_manifest.json');
const outputPath = path.join(base, 'mother-diff-manifest.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function packetFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
    .map(entry => path.join(dir, entry.name));
}

function recordsFrom(dir) {
  const records = [];
  for (const file of packetFiles(dir)) {
    const packet = readJson(file);
    const packetRecords = Array.isArray(packet.records) ? packet.records : (Number.isInteger(Number(packet.recordIndex)) ? [packet] : []);
    for (const record of packetRecords) records.push({ packetFile: path.relative(root, file).replaceAll('\\', '/'), record });
  }
  return records;
}

function key(record) {
  return String(record.manifestUid || record.source?.manifestUid || '');
}

function label(value) {
  if (!value || typeof value !== 'object') return String(value ?? '');
  return String(value.label ?? value.name ?? value.code ?? value.id ?? '');
}

function canonical(record) {
  const value = record.canonical || {};
  const a = record.source ? record : null;
  const curriculumKey = String(record.curriculumKey || record.source?.curriculumKey || '');
  const scope = String(value.scope || record.courseKey || record.canonicalScope || '');
  const l1 = label(value.L1 || record.L1);
  const l2 = label(value.L2 || record.L2);
  const l3 = label(value.L3 || record.L3);
  const l4 = label(value.L4 || record.L4);
  // A's packet carries canonical ids and scope; the older B packet carries
  // only the locked hierarchy labels. Compare the hierarchy itself and do
  // not call a missing B scope a semantic disagreement.
  return { L1: l1, L2: l2, L3: l3, L4: l4 };
}

function semanticStatus(record) {
  const raw = String(record.status || record.tagStatus || record.reviewStatus || '');
  if (raw === 'B_CHECKED') {
    const value = String(record.tagStatus || record.reviewStatus || 'DIRECT_TAGGED');
    return value === 'PASS' || value === 'reviewed_pass' || value === 'B_CHECKED' ? 'DIRECT_TAGGED' : value;
  }
  if (raw === 'PASS' || raw === 'reviewed_pass') return 'DIRECT_TAGGED';
  return raw;
}

function conceptList(record) {
  return (Array.isArray(record.secondaryConceptKeys) ? record.secondaryConceptKeys : [])
    .map(value => String(value).split('|').at(-1).trim())
    .sort();
}

function sourceIdentity(record) {
  return record.source || record;
}

function normalized(record) {
  const source = sourceIdentity(record);
  const status = String(record.status || record.tagStatus || record.reviewStatus || '');
  return {
    canonical: canonical(record),
    primaryConcept: record.primaryConcept ?? null,
    secondaryConceptKeys: conceptList(record),
    difficultyBucket: record.difficultyBucket ?? null,
    status: semanticStatus(record),
    sourceFingerprint: source.sourceFingerprint || null,
    contentFingerprint: source.contentFingerprint || null,
  };
}

function sourceExcerpt(source) {
  return {
    sourceArchiveFile: source.sourceArchiveFile,
    sourceOrdinal: Number(source.sourceOrdinal),
    content: String(source.content ?? source.sourceEvidence?.contentExcerpt ?? '').slice(0, 1800),
    choices: Array.isArray(source.choices) ? source.choices : undefined,
    answer: source.answer ?? source.sourceEvidence?.answer ?? null,
    solution: String(source.solution ?? source.sourceEvidence?.solutionExcerpt ?? '').slice(0, 1800),
    image: source.image ?? source.sourceEvidence?.image ?? '',
    solutionImage: source.solutionImage ?? source.sourceEvidence?.solutionImage ?? '',
  };
}

const sourceManifest = readJson(sourcePath);
const sourceByUid = new Map(sourceManifest.records.map(record => [key(record), record]));
const aEntries = [...recordsFrom(path.join(base, 'a-full')), ...recordsFrom(path.join(base, 'a-full-repair'))];
const bEntries = [...recordsFrom(path.join(base, 'b-full')), ...recordsFrom(path.join(base, 'b-full-repair'))];

function freezeLatest(entries) {
  const map = new Map();
  for (const entry of entries) map.set(key(entry.record), entry);
  return map;
}

const a = freezeLatest(aEntries);
const b = freezeLatest(bEntries);
const disagreements = [];
const missingA = [];
const missingB = [];
const fieldCounts = { canonical: 0, primaryConcept: 0, primaryConceptKey: 0, secondaryConceptKeys: 0, difficultyBucket: 0, status: 0 };

for (const [uid, source] of sourceByUid) {
  const ae = a.get(uid);
  const be = b.get(uid);
  if (!ae) { missingA.push(uid); continue; }
  if (!be) { missingB.push(uid); continue; }
  const av = normalized(ae.record);
  const bv = normalized(be.record);
  const fields = Object.keys(fieldCounts).filter(field => JSON.stringify(av[field]) !== JSON.stringify(bv[field]));
  for (const field of fields) fieldCounts[field] += 1;
  if (fields.length) {
    disagreements.push({
      recordIndex: sourceManifest.records.findIndex(item => key(item) === uid) + 1,
      manifestUid: uid,
      source: sourceExcerpt(source),
      a: { packetFile: ae.packetFile, value: av, raw: ae.record },
      b: { packetFile: be.packetFile, value: bv, raw: be.record },
      differingFields: fields,
      mother: { status: 'PENDING_MOTHER_DIRECT_READ' },
    });
  }
}

const result = {
  schemaVersion: 'h1-direct-tagging-mother-diff-v1',
  generatedAt: new Date().toISOString(),
  sourceManifestPath: path.relative(root, sourcePath).replaceAll('\\', '/'),
  sourceManifestSha256: sourceManifest.sha256 || null,
  expectedCount: sourceManifest.records.length,
  aCount: a.size,
  bCount: b.size,
  missingA,
  missingB,
  fieldCounts,
  disagreementCount: disagreements.length,
  disagreements,
};
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ expectedCount: result.expectedCount, aCount: result.aCount, bCount: result.bCount, missingA: missingA.length, missingB: missingB.length, disagreementCount: disagreements.length, fieldCounts }, null, 2));
