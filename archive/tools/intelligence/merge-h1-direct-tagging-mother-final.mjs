import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const base = path.join(root, 'archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging');
const sourcePath = path.join(base, 'source_manifest.json');
const diffPath = path.join(base, 'mother-diff-manifest.json');
const outputPath = path.join(base, 'mother-final-candidate.json');
const sourceManifest = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const diffManifest = JSON.parse(fs.readFileSync(diffPath, 'utf8'));
const sourceRecords = sourceManifest.records;

function read(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function packetEntries(dirName) {
  const dir = path.join(base, dirName);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir).filter(value => value.endsWith('.json'))) {
    const file = path.join(dir, name);
    const packet = read(file);
    const records = Array.isArray(packet.records) ? packet.records : Number.isInteger(Number(packet.recordIndex)) ? [packet] : [];
    for (const record of records) out.push({ file: path.relative(root, file).replaceAll('\\', '/'), record });
  }
  return out;
}
function freezeLatest(dirs) {
  const map = new Map();
  for (const dir of dirs) for (const entry of packetEntries(dir)) {
    const uid = String(entry.record.manifestUid || entry.record.source?.manifestUid || '');
    if (uid) map.set(uid, entry);
  }
  return map;
}
function label(value) {
  if (!value || typeof value !== 'object') return String(value ?? '');
  return String(value.label ?? value.name ?? value.code ?? value.id ?? '');
}
function canonical(record) {
  const value = record?.canonical || {};
  return { L1: label(value.L1 || record?.L1), L2: label(value.L2 || record?.L2), L3: label(value.L3 || record?.L3), L4: label(value.L4 || record?.L4) };
}
function status(record) {
  const raw = String(record?.status || record?.tagStatus || record?.reviewStatus || '');
  if (raw === 'B_CHECKED') {
    const value = String(record?.tagStatus || record?.reviewStatus || 'DIRECT_TAGGED');
    return ['PASS', 'reviewed_pass', 'B_CHECKED'].includes(value) ? 'DIRECT_TAGGED' : value;
  }
  return ['PASS', 'reviewed_pass'].includes(raw) ? 'DIRECT_TAGGED' : raw;
}
function normalized(entry) {
  const record = entry?.record || {};
  return {
    canonical: canonical(record),
    primaryConcept: record.primaryConcept ?? null,
    secondaryConceptKeys: (Array.isArray(record.secondaryConceptKeys) ? record.secondaryConceptKeys : []).map(value => String(value).split('|').at(-1).trim()).sort(),
    difficultyBucket: record.difficultyBucket ?? null,
    status: status(record)
  };
}
function finalStatus(value) {
  return ['FROZEN', 'ACCEPTED', ''].includes(value) ? 'DIRECT_TAGGED' : value;
}
function fullCanonical(master, value) {
  const labels = value.canonical;
  if (Object.values(labels).some(labelValue => ['UNKNOWN', 'CANONICAL_NO_FIT'].includes(labelValue))) return 'EXPLICIT_NO_FIT_OR_UNKNOWN';
  for (const record of master.records || []) {
    for (const concept of record.concepts || []) {
      for (const problemType of concept.problemTypes || []) {
        if (String(record.majorUnit || '') === labels.L1 && String(record.midUnit || '') === labels.L2 && String(concept.concept || '') === labels.L3 && String(problemType.problemType || '') === labels.L4) return 'CANONICAL_PATH_MATCH';
      }
    }
  }
  if (['HOLD', 'CONFLICT', 'EVIDENCE_INSUFFICIENT', 'AMBIGUOUS_PRIMARY', 'FOUNDATION_DEFECT_CANDIDATE', 'SOURCE_DEFECT_CANDIDATE'].includes(value.status)) return 'EXPLICIT_NO_FIT_OR_UNKNOWN';
  return 'CANONICAL_PATH_UNMATCHED';
}

const aMap = freezeLatest(['a-full', 'a-full-repair']);
const bMap = freezeLatest(['b-full', 'b-full-repair']);
const diffByIndex = new Map(diffManifest.disagreements.map(record => [record.recordIndex, record]));
const motherDir = path.join(base, 'mother');
const motherByIndex = new Map();
for (const name of fs.readdirSync(motherDir).filter(value => value.startsWith('decisions-') || value.startsWith('picks-'))) {
  const packet = read(path.join(motherDir, name));
  for (const record of packet.records || []) motherByIndex.set(Number(record.recordIndex), { ...record, decision: record.decision || record.pick, ledgerFile: `archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/mother/${name}` });
}
const masterPath = path.join(root, 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json');
const master = read(masterPath);
const finalRecords = [];
const errors = [];
const decisionCounts = {};
const statusCounts = {};
const canonicalCounts = {};

for (let index = 0; index < sourceRecords.length; index++) {
  const source = sourceRecords[index];
  const recordIndex = index + 1;
  const uid = String(source.manifestUid);
  const a = aMap.get(uid);
  const b = bMap.get(uid);
  if (!a || !b) { errors.push(`PACKET_MISSING:${recordIndex}`); continue; }
  const av = normalized(a);
  const bv = normalized(b);
  const diff = diffByIndex.get(recordIndex);
  const mother = motherByIndex.get(recordIndex);
  if (diff && !mother) errors.push(`MOTHER_MISSING:${recordIndex}`);
  const abEqual = !diff;
  let finalValue;
  let decision;
  let directRead = false;
  let reason;
  let ledgerFile = null;
  if (mother?.canonical && mother.canonical.L1 !== undefined) {
    finalValue = {
      canonical: { L1: String(mother.canonical.L1), L2: String(mother.canonical.L2), L3: String(mother.canonical.L3), L4: String(mother.canonical.L4) },
      primaryConcept: mother.primaryConcept ?? null,
      secondaryConceptKeys: Array.isArray(mother.secondaryConceptKeys) ? mother.secondaryConceptKeys : [],
      difficultyBucket: mother.difficultyBucket ?? null,
      status: mother.status || 'DIRECT_TAGGED'
    };
    decision = mother.decision;
    directRead = true;
    reason = mother.reason || null;
    ledgerFile = mother.ledgerFile;
  } else {
    const selected = mother?.decision === 'B' ? b : a;
    finalValue = { ...normalized(selected), status: finalStatus(normalized(selected).status) };
    decision = mother?.decision || (abEqual ? 'AB_EQUAL_AUTO' : null);
    directRead = Boolean(mother);
    reason = mother?.reason || (abEqual ? 'A/B normalized fields are equal; common value selected for final candidate.' : null);
    ledgerFile = mother?.ledgerFile || null;
  }
  if (!decision) errors.push(`DECISION_MISSING:${recordIndex}`);
  const canonicalState = fullCanonical(master, finalValue);
  if (canonicalState === 'CANONICAL_PATH_UNMATCHED') errors.push(`CANONICAL_PATH_UNMATCHED:${recordIndex}`);
  if (!finalValue.status) errors.push(`FINAL_STATUS_MISSING:${recordIndex}`);
  decisionCounts[decision || 'UNSET'] = (decisionCounts[decision || 'UNSET'] || 0) + 1;
  statusCounts[finalValue.status || 'UNSET'] = (statusCounts[finalValue.status || 'UNSET'] || 0) + 1;
  canonicalCounts[canonicalState] = (canonicalCounts[canonicalState] || 0) + 1;
  finalRecords.push({
    recordIndex,
    manifestUid: uid,
    source: { sourceArchiveFile: source.sourceArchiveFile, sourceOrdinal: source.sourceOrdinal, curriculumKey: source.curriculumKey, sourceFingerprint: source.sourceFingerprint, contentFingerprint: source.contentFingerprint },
    a: { packetFile: a.file, value: av },
    b: { packetFile: b.file, value: bv },
    comparison: { abEqual, differingFields: diff?.differingFields || [] },
    mother: { decision, directRead, ledgerFile, reason },
    final: { ...finalValue, canonicalState }
  });
}

const recordIds = new Set(finalRecords.map(record => record.recordIndex));
if (finalRecords.length !== sourceRecords.length) errors.push(`FINAL_COUNT:${finalRecords.length}/${sourceRecords.length}`);
if (recordIds.size !== sourceRecords.length) errors.push(`FINAL_DUPLICATE:${finalRecords.length - recordIds.size}`);
const result = {
  schemaVersion: 'h1-direct-tagging-mother-final-candidate-v1',
  scope: 'HIGH1_ONLY',
  sourceManifestPath: 'archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/source_manifest.json',
  expectedCount: sourceRecords.length,
  aCount: aMap.size,
  bCount: bMap.size,
  motherLedgerUniqueCount: motherByIndex.size,
  disagreementCount: diffManifest.disagreementCount,
  finalizedDisagreementCount: [...diffByIndex.keys()].filter(index => motherByIndex.has(index)).length,
  unresolvedDisagreementCount: [...diffByIndex.keys()].filter(index => !motherByIndex.has(index)).length,
  decisionCounts,
  statusCounts,
  canonicalCounts,
  errors,
  readyForGate: errors.length === 0,
  records: finalRecords
};
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ output: path.relative(root, outputPath).replaceAll('\\', '/'), expectedCount: result.expectedCount, aCount: result.aCount, bCount: result.bCount, motherLedgerUniqueCount: result.motherLedgerUniqueCount, finalizedDisagreementCount: result.finalizedDisagreementCount, unresolvedDisagreementCount: result.unresolvedDisagreementCount, decisionCounts, statusCounts, canonicalCounts, errorCount: errors.length, readyForGate: result.readyForGate }, null, 2));
