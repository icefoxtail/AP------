#!/usr/bin/env node

/**
 * Audit the Phase 4 alias and sample-threshold policy without enabling UI
 * exposure. The policy remains candidate_v1_not_operational until Gate 4.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSchoolFingerprints, SAMPLE_POLICY } from './build-school-fingerprints.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVE_ROOT = path.resolve(HERE, '..');
const ALIAS_PATH = path.join(ARCHIVE_ROOT, 'data', 'master_tables', 'school_alias_master.json');
const OUTPUT_PATH = path.join(ARCHIVE_ROOT, 'data', 'school-fingerprint-policy-audit.json');

export const SCHEMA_VERSION = 'school-fingerprint-policy-audit.v1';

function normalize(value) {
  return String(value || '').normalize('NFC').trim().replace(/\s+/g, ' ');
}

function loadAliasMaster() {
  return JSON.parse(fs.readFileSync(ALIAS_PATH, 'utf8'));
}

function sorted(values) {
  return [...values].sort((a, b) => String(a).localeCompare(String(b), 'ko'));
}

export function auditSchoolFingerprintPolicy({ fingerprints = buildSchoolFingerprints(), aliasMaster = loadAliasMaster() } = {}) {
  const aliasEntries = Object.entries(aliasMaster.aliases || {});
  const aliasOwners = new Map();
  const aliasCollisions = [];
  for (const [canonical, aliases] of aliasEntries) {
    const names = [canonical, ...(Array.isArray(aliases) ? aliases : [])].map(normalize).filter(Boolean);
    for (const name of names) {
      const prior = aliasOwners.get(name);
      if (prior && prior !== normalize(canonical)) aliasCollisions.push({ sourceName: name, canonicalKeys: sorted([prior, normalize(canonical)]) });
      else aliasOwners.set(name, normalize(canonical));
    }
  }

  const sourceNames = sorted(fingerprints.aliasAudit.implicitCanonicalSourceNames.concat(fingerprints.aliasAudit.explicitAliasSourceNames));
  const canonicalNames = sorted(fingerprints.schools.map(school => school.schoolKey));
  const eligible = fingerprints.schools.filter(school => school.sampleEligible).map(school => school.schoolKey);
  const hidden = fingerprints.schools.filter(school => !school.sampleEligible).map(school => ({
    schoolKey: school.schoolKey,
    examCount: school.examCount,
    questionCount: school.questionCount,
    reason: `examCount < ${SAMPLE_POLICY.minExamCount} AND questionCount < ${SAMPLE_POLICY.minQuestionCount}`,
  }));
  hidden.sort((a, b) => a.schoolKey.localeCompare(b.schoolKey, 'ko'));
  const decisions = fingerprints.schools.map(school => ({
    schoolKey: school.schoolKey,
    examCount: school.examCount,
    questionCount: school.questionCount,
    eligible: school.sampleEligible,
    decision: school.sampleEligible ? 'candidate' : 'hidden_below_threshold',
  })).sort((a, b) => a.schoolKey.localeCompare(b.schoolKey, 'ko'));

  return {
    schemaVersion: SCHEMA_VERSION,
    policyStatus: SAMPLE_POLICY.status,
    exposure: 'not_operational',
    aliasPolicy: {
      master: 'archive/data/master_tables/school_alias_master.json',
      normalization: aliasMaster.normalization,
      sourceNameCount: sourceNames.length,
      canonicalNameCount: canonicalNames.length,
      explicitAliasCount: fingerprints.aliasAudit.explicitAliasSourceNames.length,
      collisionCount: aliasCollisions.length,
      allSourceNamesCanonicalized: sourceNames.every(name => aliasOwners.has(name) || canonicalNames.includes(name)),
    },
    samplePolicy: {
      operator: SAMPLE_POLICY.operator,
      minExamCount: SAMPLE_POLICY.minExamCount,
      minQuestionCount: SAMPLE_POLICY.minQuestionCount,
      candidateCount: eligible.length,
      hiddenCount: hidden.length,
      candidateKeys: sorted(eligible),
      hidden,
    },
    decisions,
    audit: {
      aliasAuditPass: aliasCollisions.length === 0 && sourceNames.length === canonicalNames.length,
      thresholdAuditPass: eligible.length + hidden.length === fingerprints.schools.length,
      deterministicInput: fingerprints.source.root === 'archive/exams/original' && fingerprints.source.parseErrorCount === 0,
    },
    collisions: aliasCollisions,
  };
}

export function writeAudit(outputPath = OUTPUT_PATH) {
  const audit = auditSchoolFingerprintPolicy();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
  return audit;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const audit = writeAudit();
  console.log(`school fingerprint policy audit: candidates ${audit.samplePolicy.candidateCount}, hidden ${audit.samplePolicy.hiddenCount}, alias collisions ${audit.aliasPolicy.collisionCount}`);
}
