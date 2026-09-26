#!/usr/bin/env node
// Rebuild BASIC projections without semantic reclassification or source mutation.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import core from '../../archive2-core.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const write = process.argv.includes('--write');
const check = process.argv.includes('--check');
if (write === check) throw new Error('Use --write or --check');
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const json = value => JSON.stringify(value, null, 2) + '\n';
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const catalog = core.decodeCatalog(read('archive/data/archive2-catalog.json'));
const byUid = new Map(catalog.records.map(row => [row.questionUid, row]));
const master = new Map(read('archive/data/master_tables/js_archive_tag_master.json').map(row => [row.key, row]));
const compiled = read('archive/data/meta-foundation/compiled/taxonomy_registry.json');
const types = new Map(compiled.problemTypes.map(row => [row.problemTypeKey, row]));
const templates = new Map(compiled.templates.map(row => [row.templateKey, row]));
const bindings = read('archive/data/meta-foundation/compiled/curriculum_bindings.json').bindings;
const bindingSet = new Set(bindings.map(row => [row.curriculum, row.standardUnitKey, row.subUnitKey, row.problemTypeKey].join('|')));
const outputs = new Map();
const migrated = new Map();
const seen = new Set(), sourceSeen = new Set();
let joins = 0;
const failures = [];
const runtimeDir = 'archive/data/meta-foundation/runtime';
const loader = fs.readFileSync(path.join(root, 'archive/meta-foundation-runtime.js'), 'utf8');
const runtimeFiles = [...loader.matchAll(/"data\/meta-foundation\/runtime\/([^"\n]+\.json)"/g)].map(match => `${runtimeDir}/${match[1]}`);
const packs = [];
for (const file of runtimeFiles) {
  const pack = read(file);
  pack.records = pack.records.map(original => {
    let row = core.projectBasicEligibility(original);
    const base = byUid.get(row.questionUid);
    const sourceKey = core.normalizeFile(row.sourceArchiveFile) + '#' + Number(row.sourceOrdinal);
    if (seen.has(row.questionUid) || sourceSeen.has(sourceKey)) failures.push(`duplicate:${row.questionUid}`);
    seen.add(row.questionUid); sourceSeen.add(sourceKey);
    if (!base || core.normalizeFile(base.sourceFile) + '#' + Number(base.sourceOrdinal) !== sourceKey) {
      failures.push(`join:${row.questionUid}`); return row;
    }
    joins++;
    for (const field of ['curriculumKey','courseKey','L1','L2']) {
      if (!row[field] && base[field]) row[field] = base[field];
    }
    // L1/L2 key parent is independent of L3 bindings. Labels-only RPM paths
    // remain supported; STANDARD_UNIT_DIRECT records retain their approved L2 label.
    const l1 = master.get(row.standardUnitKey), l2 = master.get(row.subUnitKey);
    const keyedParent = l1?.keyType === 'standardUnitKey' && l2?.keyType === 'subUnitKey' &&
      (l2.parentKey === row.standardUnitKey || l2.standardUnitKey === row.standardUnitKey);
    const directParent = !row.subUnitKey && bindings.some(binding => binding.bindingMode === 'STANDARD_UNIT_DIRECT' &&
      binding.curriculum === (row.curriculumKey || row.curriculum) && binding.standardUnitKey === row.standardUnitKey &&
      binding.subUnitLabelKo === row.L2);
    const parentPass = Boolean(row.L1 && row.L2 && (keyedParent || directParent || base.basicTaxonomyStatus === 'CONFIRMED'));
    // Explicit key mismatch is never rescued by a label fallback.
    const keyMismatch = Boolean(l1 && l2 && l2.parentKey !== row.standardUnitKey && l2.standardUnitKey !== row.standardUnitKey);
    row.basicTaxonomyStatus = parentPass && !keyMismatch ? 'CONFIRMED' : 'UNKNOWN';
    row.l3CapabilityValid = Boolean(types.get(row.problemTypeKey)?.status === 'ACTIVE' &&
      bindingSet.has([row.curriculumKey || row.curriculum, row.standardUnitKey, row.subUnitKey, row.problemTypeKey].join('|')));
    row.l4CapabilityValid = Boolean(row.l3CapabilityValid && templates.get(row.templateKey)?.status === 'ACTIVE' &&
      templates.get(row.templateKey)?.parentProblemTypeKey === row.problemTypeKey);
    const effective = { ...base, ...row,
      identityStatus: base.identityStatus, sourceStatus: base.sourceStatus, gradeConflict: base.gradeConflict,
      sourceFingerprint: base.sourceFingerprint, approvedSourceFingerprint: base.approvedSourceFingerprint,
      // Source correctness is never cleared by a runtime projection.
      sourceIssueHold: base.sourceIssueHold === true || row.sourceIssueHold === true,
      metadataConflicts: []
    };
    row.runtimeSelectable = core.basicEligibility(effective).ok;
    if (row.runtimeSelectable && row.defaultSelectable === false) {
      row.legacyDefaultSelectable = false;
      row.defaultSelectable = true;
    }
    row.basicEligibilityStatus = row.runtimeSelectable ? 'PASS' : 'BLOCKED';
    row.basicBlockReasons = core.basicEligibility(effective).reasons;
    migrated.set(row.questionUid, row);
    return row;
  });
  const selectable = pack.records.filter(row => row.runtimeSelectable).length;
  pack.counts = { ...pack.counts,
    runtimeSelectable: selectable, automaticEligibleExpected: selectable,
    basicSelectable: selectable, basicBlocked: pack.records.length - selectable,
    defaultSelectable: pack.records.filter(row => row.defaultSelectable === true).length
  };
  pack.basicEligibilityContract = 'inclusive-basic-v1';
  outputs.set(file, json(pack)); packs.push(pack);
}
// Only known advanced-only pollution is migrated in metadata and H1 assignments.
// No taxonomy values, difficulty values, source fingerprints or source JS are created.
const metadataFile = 'archive/data/question_metadata.json';
const metadata = read(metadataFile);
const statusFields = ['reviewStatus','semanticDisposition','curriculumApplicability','defaultSelectable','metaFoundationStatus','advancedHoldReasons','advancedCapabilityStatus'];
let metadataMigrationCount = 0;
for (const original of metadata.records) {
  const authority = migrated.get(original.questionUid) || byUid.get(original.questionUid);
  const projected = core.projectBasicEligibility(original, { basicScope: byUid.get(original.questionUid) });
  if (!authority || JSON.stringify(projected) === JSON.stringify(original)) continue;
  if (!migrated.has(original.questionUid) && (authority.identityStatus !== 'VERIFIED' || authority.sourceStatus !== 'VERIFIED')) continue;
  for (const field of statusFields) if (projected[field] !== undefined) original[field] = projected[field];
  metadataMigrationCount++;
}
outputs.set(metadataFile, json(metadata));
for (const [index, pack] of packs.entries()) {
  if (pack.generatedFrom && Object.hasOwn(pack.generatedFrom, 'questionMetadataSha256'))
    pack.generatedFrom.questionMetadataSha256 = hash(json(metadata));
  outputs.set(runtimeFiles[index], json(pack));
}
const h1File = 'archive/data/meta-foundation/evidence/high1/v1/item_metadata_assignments_1170.json';
const assignments = read(h1File);
for (const original of assignments.items) {
  const authority = migrated.get(original.questionUid);
  if (!authority) throw new Error(`H1 assignment join lost: ${original.questionUid}`);
  for (const field of [...statusFields, 'runtimeSelectable','basicEligibilityStatus','basicBlockReasons','basicTaxonomyStatus','l3CapabilityValid','l4CapabilityValid'])
    if (authority[field] !== undefined) original[field] = authority[field];
}
if (assignments.counts) {
  assignments.counts.runtimeSelectable = assignments.items.filter(row => row.runtimeSelectable).length;
  assignments.counts.defaultSelectable = assignments.items.filter(row => row.defaultSelectable).length;
  assignments.counts.explicitHold = assignments.items.filter(row => row.reviewStatus === 'HOLD').length;
}
outputs.set(h1File, json(assignments));
if (failures.length) throw new Error(JSON.stringify(failures));
const changed = [...outputs].filter(([file, content]) => fs.readFileSync(path.join(root, file), 'utf8').replaceAll('\r\n','\n') !== content).map(([file]) => file);
if (check && changed.length) throw new Error(`BASIC projections stale: ${changed.join(', ')}`);
if (write) for (const file of changed) fs.writeFileSync(path.join(root, file), outputs.get(file));
console.log(JSON.stringify({status:'PASS',contract:'inclusive-basic-v1',packs:packs.length,records:seen.size,joins,
  duplicateUid:0,duplicateSource:0,joinLoss:0,metadataMigrationCount,changed,
  runtimeCounts:packs.map(pack=>({packId:pack.packId,...pack.counts})),
  sourceMutation:0,projectionDigest:hash([...outputs.values()].join('\n'))},null,2));
