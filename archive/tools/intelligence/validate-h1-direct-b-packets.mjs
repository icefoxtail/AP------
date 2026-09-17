import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const base = path.join(root, 'archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging');
const manifest = JSON.parse(fs.readFileSync(path.join(base, 'source_manifest.json'), 'utf8'));
const packetDirs = [path.join(base, 'b-full'), path.join(base, 'b-full-repair')];
const expected = manifest.records;
const byIndex = new Map();
const entriesByIndex = new Map();
const mismatches = [];
const duplicates = [];

for (const packetDir of packetDirs) for (const name of fs.readdirSync(packetDir).filter(value => value.endsWith('.json'))) {
  const packet = JSON.parse(fs.readFileSync(path.join(packetDir, name), 'utf8'));
  const records = Array.isArray(packet.records) ? packet.records : (Number.isInteger(Number(packet.recordIndex)) ? [packet] : []);
  for (const record of records) {
    const identity = record.source || record.sourceIdentity || {};
    const fingerprints = record.sourceFingerprints || {};
    const actual = {
      manifestUid: record.manifestUid || record.questionUid || identity.manifestUid || identity.questionUid,
      sourceArchiveFile: record.sourceArchiveFile || identity.sourceArchiveFile,
      sourceOrdinal: Number(record.sourceOrdinal ?? identity.sourceOrdinal),
      sourceFingerprint: record.sourceFingerprint || identity.sourceFingerprint || fingerprints.sourceFingerprint,
      contentFingerprint: record.contentFingerprint || identity.contentFingerprint || fingerprints.contentFingerprint,
    };
    const manifestIndex = expected.findIndex(value => value.manifestUid === actual.manifestUid);
    const declaredIndex = Number(record.recordIndex);
    const index = Number.isInteger(declaredIndex) ? declaredIndex : manifestIndex + 1;
    if (!Number.isInteger(index) || index < 1 || index > expected.length) continue;
    const wantedRecord = expected[index - 1];
    const wanted = wantedRecord && {
      manifestUid: wantedRecord.manifestUid,
      sourceArchiveFile: wantedRecord.sourceArchiveFile,
      sourceOrdinal: Number(wantedRecord.sourceOrdinal),
      sourceFingerprint: wantedRecord.sourceFingerprint,
      contentFingerprint: wantedRecord.contentFingerprint,
    };
    const fields = Object.keys(wanted || {}).filter(field => actual[field] !== wanted[field]);
    if (Number.isInteger(declaredIndex) && declaredIndex !== manifestIndex + 1) fields.push('recordIndex');
    const entry = { index, file: path.relative(root, path.join(packetDir, name)).replaceAll('\\', '/'), actual, fields };
    if (!entriesByIndex.has(index)) entriesByIndex.set(index, []);
    entriesByIndex.get(index).push(entry);
    if (!wanted || fields.length) mismatches.push({ index, file: name, fields, actual, wanted });
  }
}

const missing = [];
const validByIndex = new Map();
for (const [index, entries] of entriesByIndex) {
  const valid = entries.filter(entry => entry.fields.length === 0);
  if (valid.length) validByIndex.set(index, valid.at(-1));
  if (entries.length > 1) duplicates.push({ index, files: entries.map(entry => entry.file), validFiles: valid.map(entry => entry.file) });
}
for (let index = 1; index <= expected.length; index++) if (!validByIndex.has(index)) missing.push(index);
const result = {
  schemaVersion: 'h1-direct-b-packet-validation-v1',
  generatedAt: new Date().toISOString(),
  expectedCount: expected.length,
  packetRecordCount: entriesByIndex.size,
  validCoverageCount: validByIndex.size,
  missingCount: missing.length,
  missing,
  mismatchCount: mismatches.length,
  mismatches,
  duplicateCount: duplicates.length,
  duplicates,
};
fs.writeFileSync(path.join(base, 'b-packet-validation.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ expectedCount: result.expectedCount, packetRecordCount: result.packetRecordCount, missingCount: result.missingCount, mismatchCount: result.mismatchCount, duplicateCount: result.duplicateCount, mismatches, duplicates }, null, 2));
