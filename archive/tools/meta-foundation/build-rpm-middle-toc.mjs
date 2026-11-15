import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import MiddleToc from '../../rpm-middle-toc.js';

export const PARENT_AUTHORITY_PATH = 'archive/data/meta-foundation/canonical/rpm-middle-2022-parents.json';
export const HELPER_PATH = 'archive/rpm-middle-toc.js';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const tuple = (parent, concept, leaf) => [parent.curriculum, parent.scope, parent.majorUnit, parent.midUnit, concept.concept, leaf.problemType];

export function validateParentAuthority(authority, root = ROOT) {
  if (authority?.schemaVersion !== 'rpm-middle-2022-parents-v1') throw new Error('RPM_MIDDLE_PARENT_AUTHORITY_SCHEMA');
  if (authority.authorityStatus !== 'ACTIVE' || authority.sourceVerification !== 'PUBLISHER_SIX_BOOK_CHAPTER_HEADINGS_VERIFIED')
    throw new Error('RPM_MIDDLE_PARENT_AUTHORITY_UNVERIFIED');
  MiddleToc.createAuthority(authority);
  const base = authority.baseAuthority;
  if (base?.path !== 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json')
    throw new Error('RPM_MIDDLE_BASE_AUTHORITY_PATH');
  const bytes = fs.readFileSync(path.join(root, base.path));
  if (sha256(bytes) !== base.sha256) throw new Error('RPM_MIDDLE_BASE_AUTHORITY_SHA');
  const master = JSON.parse(bytes.toString('utf8'));
  const leaves = new Map();
  for (const parent of master.records || []) {
    if (parent.curriculum !== '2022' || !/^M[123]-[12]$/.test(parent.scope)) continue;
    for (const concept of parent.concepts || []) for (const leaf of concept.problemTypes || []) {
      const key = JSON.stringify(tuple(parent, concept, leaf));
      if (leaves.has(key)) throw new Error('RPM_MIDDLE_BASE_LEAF_DUPLICATE');
      leaves.set(key, { concept, leaf });
    }
  }
  const mappings = new Map();
  for (const mapping of authority.leafMappings || []) {
    const key = JSON.stringify(mapping.basePath);
    if (mappings.has(key)) throw new Error('RPM_MIDDLE_MAPPING_DUPLICATE');
    if (!leaves.has(key)) throw new Error('RPM_MIDDLE_MAPPING_UNKNOWN_LEAF');
    mappings.set(key, mapping);
  }
  if (mappings.size !== leaves.size || [...leaves.keys()].some(key => !mappings.has(key)))
    throw new Error('RPM_MIDDLE_MAPPING_COVERAGE');
  const parentKeys = new Set((authority.parents || []).map(parent => parent.key));
  if ([...mappings.values()].some(mapping => !parentKeys.has(mapping.effectiveParentKey)))
    throw new Error('RPM_MIDDLE_MAPPING_UNKNOWN_PARENT');
  const used = new Set([...mappings.values()].map(mapping => mapping.effectiveParentKey));
  if ([...parentKeys].some(key => !used.has(key))) throw new Error('RPM_MIDDLE_PARENT_WITHOUT_LEAF');
  const legacy = new Map();
  const crosswalkIds = new Map();
  for (const name of ['middle1', 'middle2', 'middle3']) {
    const crosswalk = JSON.parse(fs.readFileSync(path.join(root,
      `archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/${name}.json`), 'utf8'));
    for (const row of crosswalk.records || []) {
      if (row.curriculum !== '2022' || !/^M[123]-[12]$/.test(row.scope)) continue;
      const rpm = row.rpmPath || {};
      const mapping = mappings.get(JSON.stringify([row.curriculum, row.scope, rpm.majorUnit, rpm.midUnit, rpm.l3, rpm.l4]));
      if (!mapping) throw new Error('RPM_MIDDLE_CROSSWALK_LEAF_MISSING');
      const leafKey = JSON.stringify(mapping.basePath);
      if (!crosswalkIds.has(leafKey)) crosswalkIds.set(leafKey, []);
      crosswalkIds.get(leafKey).push(row.id);
      if (!row.subUnitKey) continue;
      if (!legacy.has(row.subUnitKey)) legacy.set(row.subUnitKey, new Set());
      legacy.get(row.subUnitKey).add(mapping.effectiveParentKey);
    }
  }
  const expectedLegacy = [...legacy.keys()].sort().map(subUnitKey => ({
    curriculumKey: '2022', subUnitKey, parentKeys: [...legacy.get(subUnitKey)].sort(),
  }));
  if (JSON.stringify(authority.legacySubUnitMappings) !== JSON.stringify(expectedLegacy))
    throw new Error('RPM_MIDDLE_LEGACY_SUBUNIT_PARENT_DRIFT');
  for (const [key, mapping] of mappings) {
    if (JSON.stringify([...(mapping.crosswalkRecordIds || [])].sort()) !== JSON.stringify((crosswalkIds.get(key) || []).sort()))
      throw new Error('RPM_MIDDLE_CROSSWALK_ID_DRIFT');
  }
  const expectedBookCounts = { 'M1-1': 9, 'M1-2': 9, 'M2-1': 10, 'M2-2': 10, 'M3-1': 9, 'M3-2': 7 };
  const sources = new Map();
  const sourceParents = new Set();
  const headingIdentity = label => label.replace(/\s+\(([12])\)/g, '($1)');
  for (const source of authority.sourceEvidence || []) {
    if (!expectedBookCounts[source.book] || sources.has(source.book) || !/^[a-f0-9]{64}$/.test(source.pdfSha256 || '') ||
        source.publicAccess !== 'ANONYMOUS' || !source.officialPdfUrl || !source.officialBoardUrl ||
        source.normalizedHeadingTable?.length !== expectedBookCounts[source.book])
      throw new Error('RPM_MIDDLE_PUBLISHER_BOOK_EVIDENCE');
    sources.set(source.book, source);
    for (const heading of source.normalizedHeadingTable) {
      const key = JSON.stringify(['2022', source.book, heading.L1, headingIdentity(heading.L2)]);
      if (sourceParents.has(key) || !parentKeys.has(key) || !Number.isInteger(heading.pdfPage1based) || heading.pdfPage1based < 1)
        throw new Error('RPM_MIDDLE_PUBLISHER_PARENT_MISMATCH');
      sourceParents.add(key);
    }
  }
  if (sources.size !== 6 || sourceParents.size !== 54 || parentKeys.size !== 54 || (authority.units || []).length !== 24 ||
      [...parentKeys].some(key => !sourceParents.has(key))) throw new Error('RPM_MIDDLE_PUBLISHER_COVERAGE');
  const concepts = new Set([...leaves.keys()].map(key => JSON.stringify(JSON.parse(key).slice(0, 5))));
  if (authority.counts?.L1 !== 24 || authority.counts?.L2 !== 54 || authority.counts?.baseL3 !== concepts.size ||
      authority.counts?.baseL4 !== leaves.size) throw new Error('RPM_MIDDLE_PARENT_AUTHORITY_COUNTS');
  return { unitCount: 24, parentCount: parentKeys.size, conceptCount: concepts.size, leafCount: leaves.size, baseSha256: base.sha256 };
}

export function buildMiddleToc({ root = ROOT, check = false } = {}) {
  const authority = JSON.parse(fs.readFileSync(path.join(root, PARENT_AUTHORITY_PATH), 'utf8'));
  const summary = validateParentAuthority(authority, root);
  const target = path.join(root, HELPER_PATH);
  const before = fs.readFileSync(target, 'utf8');
  const pattern = /\/\* BEGIN GENERATED RPM MIDDLE AUTHORITY \*\/[\s\S]*?\/\* END GENERATED RPM MIDDLE AUTHORITY \*\//;
  if (!pattern.test(before)) throw new Error('RPM_MIDDLE_HELPER_GENERATED_MARKER');
  const payload = JSON.stringify(authority).replaceAll('<', '\\u003c');
  const after = before.replace(pattern, `/* BEGIN GENERATED RPM MIDDLE AUTHORITY */\n  const DEFAULT_AUTHORITY = ${payload};\n  /* END GENERATED RPM MIDDLE AUTHORITY */`);
  if (check && before !== after) throw new Error('RPM_MIDDLE_HELPER_STALE');
  if (!check && before !== after) fs.writeFileSync(target, after, 'utf8');
  return { ...summary, authoritySha256: sha256(fs.readFileSync(path.join(root, PARENT_AUTHORITY_PATH))), helperSha256: sha256(after), changed: before !== after };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  console.log(JSON.stringify(buildMiddleToc({ check: process.argv.includes('--check') })));
