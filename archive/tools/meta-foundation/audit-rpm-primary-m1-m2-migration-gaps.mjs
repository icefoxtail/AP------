#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { questionUidForSource } from './rpm-active-resolver.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const EVIDENCE_DIR = 'archive/data/meta-foundation/evidence/rpm-primary-v1.0/m1-m2-normalization';
const M1_R2E_COMMIT = '92cf91b383d2e622c1c1aa22582e0903cc40da0a';
const M2_R2E_COMMIT = 'f5986c7a5317015bb9957bf3bb50be4a4f27852e';
const M1_BATCHES = new Set([21, 23, 27, 29]);
const M2_TARGETS = new Map([
  ['23_이수중_2학기_중간_중2_수학', new Map([[3, 'RHS_RHA_COMPARISON'], [4, 'RHA_REUSE']])],
  ['24_매산중_2학기_중간_중2_수학', new Map([[3, 'RHA_REUSE']])],
  ['24_신흥중_2학기_중간_중2_수학', new Map([[6, 'RHS_REUSE'], [7, 'RHS_REUSE']])],
  ['24_향림중_2학기_중간_중2_수학', new Map([[1, 'LINE_FAMILY_BINDING_GAP'], [2, 'LINE_FAMILY_BINDING_GAP'], [13, 'RHS_RHA_COMPARISON']])],
  ['23_향림중_2학기_중간_중2_수학', new Map([[2, 'LINE_FAMILY_BINDING_GAP'], [21, 'LINE_FAMILY_BINDING_GAP']])],
]);

const readJson = relative => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8').replace(/^\uFEFF/, ''));
const writeJson = (relative, value) => fs.writeFileSync(path.join(ROOT, relative), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitShow = (ref, file) => execFileSync('git', ['show', `${ref}:${file}`], { cwd: ROOT, encoding: 'utf8' });
const gitBlob = (ref, file) => execFileSync('git', ['rev-parse', `${ref}:${file}`], { cwd: ROOT, encoding: 'utf8' }).trim();
const gitPaths = (ref, directory) => execFileSync('git', ['ls-tree', '-rz', '-r', ref, directory], { cwd: ROOT, encoding: 'utf8' })
  .split('\0').filter(Boolean).map(entry => entry.slice(entry.indexOf('\t') + 1));

function makeM1GapRows() {
  const crosswalk = readJson('archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle1.json');
  const currentByPath = new Map(crosswalk.records.map(row => {
    const p = row.rpmPath;
    return [[row.curriculum, row.scope, p.majorUnit, p.midUnit, p.l3, p.l4].join('|'), row];
  }));
  const baseline = readJson(`${EVIDENCE_DIR}/baseline-snapshot.json`);
  const baselineByPath = new Map(baseline.crosswalks.M1.records.map(row => [row.semanticKey, row]));
  const completeness = readJson(`${EVIDENCE_DIR}/rpm-completeness-audit.json`);
  const semantic = readJson(`${EVIDENCE_DIR}/crosswalk-semantic-audit.json`);
  const auditById = new Map(semantic.records.map(row => [row.rpmRecordId, row]));
  const queue = JSON.parse(gitShow(M1_R2E_COMMIT, 'archive/data/r2e-input/middle1/INGEST_QUEUE.json'));
  const examByBatch = new Map(queue.items.filter(item => M1_BATCHES.has(item.B)).map(item => [item.B, item]));
  const selected = new Map();

  for (const file of gitPaths(M1_R2E_COMMIT, 'archive/data/r2e-input/middle1/evidence')
    .filter(file => /B(21|23|27|29)\/.*\.json$/.test(file))) {
    let parsed;
    try { parsed = JSON.parse(gitShow(M1_R2E_COMMIT, file)); } catch { continue; }
    const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed.rows) ? parsed.rows : [parsed];
    const batchNumber = Number(file.match(/\/B(\d+)\//)?.[1]);
    const batch = examByBatch.get(batchNumber);
    for (const item of rows) {
      const hold = item.rpmPrimaryCrosswalk;
      if (hold?.finalDisposition !== 'RPM_PRIMARY_MIGRATION_GAP') continue;
      const rp = (hold.rpmPrimaryPaths || []).find(p => p.role === 'PRIMARY') || hold.rpmPrimaryPaths?.[0];
      if (!rp) continue;
      const current = crosswalk.records.find(row => row.curriculum === rp.curriculum && row.scope === rp.scope
        && row.rpmPath.l3 === rp.l3LabelKo && row.rpmPath.l4 === rp.l4LabelKo);
      if (!current || current.mappingStatus !== 'RPM_ONLY') continue;
      const p = current.rpmPath;
      const key = [current.curriculum, current.scope, p.majorUnit, p.midUnit, p.l3, p.l4].join('|');
      const prior = baselineByPath.get(key);
      if (!prior || prior.mappingStatus === 'RPM_ONLY') continue;
      const uid = item.questionUid;
      if (!uid || selected.has(uid)) continue;
      const audit = auditById.get(current.id);
      const comp = completeness.records.find(row => row.rpmRecordId === current.id);
      selected.set(uid, {
        cohort: 'M1_R2E_EXISTING_GAP', grade: 'M1', examUid: batch?.examFile?.replace(/\.js$/i, '') || '',
        questionNo: item.sourceOrdinal ?? item.id ?? null, questionUid: uid,
        inputEvidence: { branch: 'work/m1-b01-b31-r2e', commit: M1_R2E_COMMIT, path: file, gitBlobSha: gitBlob(M1_R2E_COMMIT, file),
          sourceTextSha256: hold.sourceTextSha256 || '', finalSolutionSha256: hold.finalSolutionSha256 || '' },
        rpmRecordId: current.id, curriculum: current.curriculum, scope: current.scope,
        rpmL1: p.majorUnit, rpmL2: p.midUnit, rpmL3: p.l3, rpmL4: p.l4,
        existingMappingStatus: prior.mappingStatus,
        existingPTTPL: { problemTypeKey: prior.problemTypeKey || '', templateKey: prior.templateKey || '', templateCandidates: prior.templateCandidates || [] },
        semanticRelation: audit?.semanticRelation || comp?.semanticRelation || 'NO_SAFE_GLOBAL_ACTIVE_MATCH',
        curriculumPresence2015: comp?.curriculumPresence2015 ?? null,
        curriculumPresence2022: comp?.curriculumPresence2022 ?? null,
        activeBinding: audit?.activeBinding || comp?.activeBinding || null,
        defectType: audit?.defectType || 'RPM_ONLY_VALID',
        finalDisposition: 'RPM_PRIMARY_MIGRATION_GAP',
        finalCrosswalkStatus: current.mappingStatus,
        repairAction: 'KEEP_HOLD_REMOVE_PRIOR_NARROW_ACTIVE_CANDIDATE',
        evidence: 'The intake ledger remains an immutable record. The newly audited RPM L4 is broader than the former PT/TPL, the global ACTIVE review found no safe exact replacement, and RPM_ONLY correctly remains a migration gap for R2E.'
      });
    }
  }
  if (selected.size !== 10) throw new Error(`Expected 10 affected M1 migration-gap items; found ${selected.size}.`);
  return [...selected.values()].sort((a, b) => a.examUid.localeCompare(b.examUid, 'ko') || a.questionNo - b.questionNo);
}

function makeM2GapRows() {
  const crosswalk = readJson('archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json');
  const baseline = readJson(`${EVIDENCE_DIR}/baseline-snapshot.json`);
  const baselineById = new Map(baseline.crosswalks.M2.records.map(row => [row.id, row]));
  const crosswalkById = new Map(crosswalk.records.map(row => [row.id, row]));
  const rows = [];
  const seen = new Set();
  for (const file of gitPaths(M2_R2E_COMMIT, 'archive/data/r2e-intake/m2').filter(file => file.endsWith('.evidence.json'))) {
    const evidence = JSON.parse(gitShow(M2_R2E_COMMIT, file));
    const examTargets = M2_TARGETS.get(evidence.examUid);
    if (!examTargets) continue;
    for (const item of evidence.perQuestion || []) {
      const expectedAssessment = examTargets.get(item.questionNo);
      if (!expectedAssessment) continue;
      if (item.disposition !== 'RPM_PRIMARY_MIGRATION_GAP') throw new Error(`${evidence.examUid} q${item.questionNo} is no longer a prior migration gap.`);
      const token = `${evidence.examUid}:q${item.questionNo}`;
      if (seen.has(token)) throw new Error(`Duplicate M2 migration item ${token}`);
      seen.add(token);
      const old = item.rpmPrimary ? baselineById.get(item.rpmPrimary) || null : null;
      let finalRow = null;
      let finalCandidates = [];
      let finalDisposition;
      let defectType;
      let semanticRelation;
      let repairAction;
      let resultEvidence;
      if (expectedAssessment === 'RHS_REUSE') {
        finalRow = crosswalk.records.find(row => row.curriculum === '2015' && row.scope === 'M2-2' && row.rpmPath.l3 === '직각삼각형의 합동' && row.rpmPath.l4 === 'RHS');
        finalDisposition = 'EXISTING_REUSE'; defectType = 'SAFE_EXISTING_REUSE'; semanticRelation = 'DIRECT_EQUIVALENT';
        repairAction = 'ADD_2015_RPM_PATH_AND_REUSE_EXISTING_RHS_TEMPLATE_AND_BINDING';
        resultEvidence = 'The original verified method and decisive step are the RHS hypotenuse plus one leg. The exact 2015 M2-05 triangle-properties binding was ACTIVE before this repair.';
      } else if (expectedAssessment === 'RHA_REUSE') {
        finalRow = crosswalk.records.find(row => row.curriculum === '2015' && row.scope === 'M2-2' && row.rpmPath.l3 === '직각삼각형의 합동' && row.rpmPath.l4 === 'RHA');
        finalDisposition = 'EXISTING_REUSE'; defectType = item.templateKey === 'TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE' ? 'WRONG_TEMPLATE' : 'SAFE_EXISTING_REUSE';
        semanticRelation = 'DIRECT_EQUIVALENT'; repairAction = 'ADD_2015_RPM_PATH_AND_SELECT_EXISTING_RHA_TEMPLATE_AND_BINDING';
        resultEvidence = 'The verified decisive method uses the hypotenuse and one acute angle (RHA). The preexisting q4 RHS template label is stale and must not be carried forward.';
      } else if (expectedAssessment === 'RHS_RHA_COMPARISON') {
        const rhs = crosswalk.records.find(row => row.curriculum === '2015' && row.scope === 'M2-2' && row.rpmPath.l3 === '직각삼각형의 합동' && row.rpmPath.l4 === 'RHS');
        const rha = crosswalk.records.find(row => row.curriculum === '2015' && row.scope === 'M2-2' && row.rpmPath.l3 === '직각삼각형의 합동' && row.rpmPath.l4 === 'RHA');
        finalCandidates = [rhs, rha].filter(Boolean).map(row => ({ rpmRecordId: row.id, l4: row.rpmPath.l4, problemTypeKey: row.problemTypeKey, templateKey: row.templateKey, mappingStatus: row.mappingStatus }));
        finalDisposition = 'RPM_PRIMARY_MIGRATION_GAP'; defectType = 'WRONG_TEMPLATE'; semanticRelation = 'MULTI_SUBTYPE_SELECTION_NOT_EQUIVALENT_TO_ONE_LEAF';
        repairAction = 'KEEP_R2E_HOLD_NO_SINGLE_EXISTING_TEMPLATE_COVERS_THE_MULTI_CRITERION_SELECTION';
        resultEvidence = item.primaryMethod === 'RHS·RHA 조건 대조'
          ? 'The verified item compares multiple drawings under both RHS and RHA criteria and selects an unmatched triangle. The two criterion TPLs do not represent the whole multi-case selection skeleton as one exact L4.'
          : 'The verified item tests several right-triangle congruence alternatives (angle-only, RHS, two-leg, and RHA). An RHA-only TPL is too narrow for this comparison task, so the migration gap remains.';
      } else if (expectedAssessment === 'LINE_FAMILY_BINDING_GAP') {
        finalRow = crosswalkById.get('M2-RPM-048');
        finalDisposition = 'FAMILY_BINDING_GAP'; defectType = 'BINDING_ONLY_GAP'; semanticRelation = 'FAMILY_EQUIVALENT_AFTER_SUBTYPE_EXPANSION';
        repairAction = 'KEEP_COMPLETE_EXISTING_LINE_EQUATION_FAMILY_AND_WAIT_FOR_EXACT_2015_BINDING';
        resultEvidence = 'The listed four ACTIVE line-equation templates cover coefficient/graph reading, point-slope, two-point, and multi-condition decisive structures. The semantic family is complete for these cases; the exact 2015 curriculum binding remains absent.';
      } else throw new Error(`Unknown migration assessment ${expectedAssessment}`);

      const sourceArchiveFile = evidence.sourcePath.replace(/^archive\/exams\//, '');
      const priorStatus = old?.mappingStatus || 'NO_2015_RPM_ROW';
      const activeBinding = finalRow?.binding || null;
      const finalTemplateCandidates = finalRow?.templateCandidates || [];
      rows.push({
        cohort: 'M2_R2E_EXISTING_GAP', grade: 'M2', examUid: evidence.examUid, questionNo: item.questionNo,
        questionUid: questionUidForSource(sourceArchiveFile, item.questionNo),
        inputEvidence: { branch: 'work/intake/m2', branchTip: M2_R2E_COMMIT,
          inputCommit: evidence.authorityRefs?.inputCommit || '', path: file, gitBlobSha: gitBlob(M2_R2E_COMMIT, file),
          sourcePath: evidence.sourcePath, sourceBlobSha: evidence.sourceBlobSha },
        originalRPMRecordId: item.rpmPrimary || '', existingMappingStatus: priorStatus,
        existingPTTPL: { problemTypeKey: item.problemTypeKey || '', templateKey: item.templateKey || '',
          baselineProblemTypeKey: old?.problemTypeKey || '', baselineTemplateKey: old?.templateKey || '' },
        priorDisposition: item.disposition, primaryMethod: item.primaryMethod || '', decisiveStep: item.decisiveStep || '',
        rpmRecordId: finalRow?.id || '', rpmCandidates: finalCandidates,
        curriculum: '2015', scope: finalRow?.scope || 'M2-2',
        rpmL1: finalRow?.rpmPath.majorUnit || '삼각형의 성질', rpmL2: finalRow?.rpmPath.midUnit || '삼각형의 합동',
        rpmL3: finalRow?.rpmPath.l3 || '직각삼각형의 합동', rpmL4: finalRow?.rpmPath.l4 || '',
        semanticRelation, curriculumPresence2015: true, curriculumPresence2022: true,
        finalMappingStatus: finalRow?.mappingStatus || 'RPM_ONLY', problemTypeKey: finalRow?.problemTypeKey || '',
        templateKey: finalRow?.templateKey || '', templateCandidates: finalTemplateCandidates,
        activeBinding, exactBindingStatus: finalRow?.bindingStatus || (finalRow?.mappingStatus?.endsWith('BINDING_GAP') ? 'MISSING' : 'ACTIVE'),
        defectType, finalDisposition, repairAction, evidence: resultEvidence,
      });
    }
  }
  const expectedCount = [...M2_TARGETS.values()].reduce((sum, map) => sum + map.size, 0);
  if (seen.size !== expectedCount) throw new Error(`Expected ${expectedCount} affected M2 migration-gap items; found ${seen.size}.`);
  return rows.sort((a, b) => a.examUid.localeCompare(b.examUid, 'ko') || a.questionNo - b.questionNo);
}

function makeRelatedPreexistingReuse() {
  const file = 'archive/data/r2e-intake/m2/24_연향중_2학기_중간_중2_수학.evidence.json';
  const evidence = JSON.parse(gitShow(M2_R2E_COMMIT, file));
  const item = evidence.perQuestion?.find(row => row.questionNo === 21);
  if (!item || item.disposition !== 'EXISTING_REUSE' || item.rpmPrimary !== null
      || item.templateKey !== 'TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE') {
    throw new Error('Expected the related preexisting 24 Yeonhyang q21 RHS reuse with an empty RPM path reference.');
  }
  const row = readJson('archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json').records
    .find(candidate => candidate.curriculum === '2015' && candidate.scope === 'M2-2'
      && candidate.rpmPath.l3 === '직각삼각형의 합동' && candidate.rpmPath.l4 === 'RHS');
  if (!row || row.mappingStatus !== 'DIRECT_ACTIVE' || row.bindingStatus !== 'ACTIVE') throw new Error('The related q21 RHS target is not an ACTIVE exact path.');
  const sourceArchiveFile = evidence.sourcePath.replace(/^archive\/exams\//, '');
  return [{
    examUid: evidence.examUid, questionNo: item.questionNo,
    questionUid: questionUidForSource(sourceArchiveFile, item.questionNo),
    priorDisposition: item.disposition, priorRpmPrimary: item.rpmPrimary,
    problemTypeKey: row.problemTypeKey, templateKey: row.templateKey,
    rpmRecordId: row.id, exactBindingStatus: row.bindingStatus,
    inputEvidence: { branch: 'work/intake/m2', branchTip: M2_R2E_COMMIT,
      inputCommit: evidence.authorityRefs?.inputCommit || '', path: file, gitBlobSha: gitBlob(M2_R2E_COMMIT, file),
      sourcePath: evidence.sourcePath, sourceBlobSha: evidence.sourceBlobSha },
    correctionAction: 'FILL_RESTORED_RHS_RPM_PRIMARY_REFERENCE_IN_FRESH_R2E_EVIDENCE',
    note: 'Not part of the prior migration-gap denominator. The CREATE record already selected the correct RHS ACTIVE template but left rpmPrimary empty; R2E should emit fresh resolver evidence pointing to the restored 2015 path.'
  }];
}

function main() {
  const m1 = makeM1GapRows();
  const m2 = makeM2GapRows();
  const relatedPreexistingReuses = makeRelatedPreexistingReuse();
  const records = [...m1, ...m2];
  const counts = records.reduce((acc, row) => {
    const key = row.finalDisposition === 'EXISTING_REUSE' ? 'existingReuseRecovered'
      : row.finalDisposition.endsWith('BINDING_GAP') ? 'actualBindingOnlyGap' : 'remainingSemanticGap';
    acc[key]++;
    return acc;
  }, { existingReuseRecovered: 0, actualBindingOnlyGap: 0, remainingSemanticGap: 0 });
  if (records.length !== 20 || counts.existingReuseRecovered !== 4 || counts.actualBindingOnlyGap !== 4 || counts.remainingSemanticGap !== 12) {
    throw new Error(`Migration reconciliation denominator/count failure: ${JSON.stringify({ count: records.length, counts })}`);
  }
  const out = {
    schemaVersion: 'RPM_PRIMARY_M1_M2_MIGRATION_GAP_REASSESSMENT_AUTHORITY_v1',
    authority: {
      authorityId: 'RPM_PRIMARY_M1_M2_NORMALIZATION_2026-09-27',
      purpose: 'R2E re-assessment authority for migration gaps affected by the M1/M2 RPM and crosswalk normalization.',
      consumeAs: 'R2E authorityRefs[]',
      historyPolicy: 'Original CREATE/input branch artifacts remain immutable. R2E consumes this separate authority and emits fresh resolver evidence against the current RPM/crosswalk/ACTIVE snapshot.',
      sourceCommits: { m1R2e: M1_R2E_COMMIT, m2R2eBranchTip: M2_R2E_COMMIT },
      canonicalSnapshot: readJson(`${EVIDENCE_DIR}/AUDIT_SUMMARY.json`).summary.globalActive.registryFingerprint,
    },
    summary: {
      previousMigrationGapItems: records.length,
      ...counts,
      affectedM1Items: m1.length,
      affectedM2Items: m2.length,
      relatedPreexistingReuseCount: relatedPreexistingReuses.length,
      shinheungQ6Q7: records.filter(row => row.examUid === '24_신흥중_2학기_중간_중2_수학' && [6, 7].includes(row.questionNo))
        .map(row => ({ questionNo: row.questionNo, finalDisposition: row.finalDisposition, rpmRecordId: row.rpmRecordId, problemTypeKey: row.problemTypeKey, templateKey: row.templateKey, exactBindingStatus: row.exactBindingStatus })),
    },
    evidenceSources: [
      'archive/data/meta-foundation/evidence/rpm-primary-v1.0/m1-m2-normalization/rhs-rha-curriculum-evidence.json',
      `${EVIDENCE_DIR}/crosswalk-semantic-audit.json`,
      `${EVIDENCE_DIR}/rpm-completeness-audit.json`,
    ],
    relatedPreexistingReuses,
    records,
  };
  const file = `${EVIDENCE_DIR}/migration-gap-reassessment.json`;
  writeJson(file, out);
  const summary = readJson(`${EVIDENCE_DIR}/AUDIT_SUMMARY.json`);
  const artifactPaths = new Set(summary.artifactPaths || []);
  artifactPaths.add(file);
  summary.artifactPaths = [...artifactPaths].sort();
  summary.summary.migrationGapReassessment = out.summary;
  summary.summary.migrationGapAuthoritySha256 = sha256(fs.readFileSync(path.join(ROOT, file)));
  writeJson(`${EVIDENCE_DIR}/AUDIT_SUMMARY.json`, summary);
  console.log(JSON.stringify({ status: 'PASS', file, sha256: summary.summary.migrationGapAuthoritySha256, summary: out.summary }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
