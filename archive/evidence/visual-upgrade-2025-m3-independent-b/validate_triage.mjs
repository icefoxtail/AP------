#!/usr/bin/env node
import fs from 'node:fs';

const E = 'archive/evidence/visual-upgrade-2025-m3-independent-b';
const triage = JSON.parse(fs.readFileSync(`${E}/triage.json`, 'utf8'));
const expectedCounts = { KEEP: 54, POLISH: 0, REBUILD: 1, ADD: 16, REMOVE: 4, EXEMPT: 45 };
const allowedActions = new Set(Object.keys(expectedCounts));
const rows = triage.triage ?? [];
const counts = {};
const results = [];

for (const row of rows) {
  const errors = [];
  const fail = (code, detail) => errors.push({ code, detail });
  counts[row.action] = (counts[row.action] ?? 0) + 1;
  if (!row.questionUid || !Number.isInteger(row.qid)) fail('QUESTION_ID_MISSING');
  if (!allowedActions.has(row.action)) fail('ACTION_INVALID', row.action);
  if (!['VISUAL_REQUIRED', 'VISUAL_OPTIONAL', 'VISUAL_EXEMPT'].includes(row.visualRequirement))
    fail('VISUAL_REQUIREMENT_INVALID', row.visualRequirement);
  if (!row.baselineSolutionImage && row.baselineSolutionImagePath !== null)
    fail('BASELINE_IMAGE_PATH_INCONSISTENT', row.baselineSolutionImagePath);
  if (row.baselineSolutionImage && row.baselineSolutionImage.path !== row.baselineSolutionImagePath)
    fail('BASELINE_IMAGE_IDENTITY_MISMATCH');
  for (const key of ['sourceExamSha', 'solutionSha']) {
    if (typeof row[key] !== 'string' || !row[key].startsWith('sha256:')) fail('SOURCE_HASH_MISSING', key);
  }
  for (const key of ['oneLineReason', 'decisiveRelation', 'sourceFigurePresence', 'sourceFigureSufficiency']) {
    if (typeof row[key] !== 'string' || !row[key].trim()) fail('TRIAGE_EVIDENCE_MISSING', key);
  }

  if (['KEEP', 'REBUILD'].includes(row.action)) {
    if (!row.baselineSolutionImagePath || !row.finalSolutionImagePath) fail('EXISTING_IMAGE_LINK_MISSING');
    else if (row.baselineSolutionImagePath.replace(/^archive\//, '') !== row.finalSolutionImagePath)
      fail('EXISTING_IMAGE_LINK_CHANGED', { baseline: row.baselineSolutionImagePath, final: row.finalSolutionImagePath });
  }
  if (row.action === 'ADD') {
    if (row.baselineSolutionImagePath !== null) fail('ADD_ALREADY_HAD_BASELINE_IMAGE');
    if (!row.finalSolutionImagePath) fail('ADD_FINAL_IMAGE_LINK_MISSING');
    const mb = row.marginalBenefitEvidence;
    if (!mb) fail('ADD_MARGINAL_BENEFIT_EVIDENCE_MISSING');
    else {
      if (!['PRESENT', 'ABSENT'].includes(mb.sourceFigurePresence)) fail('ADD_SOURCE_FIGURE_PRESENCE_INVALID');
      if (typeof mb.sourceFigureSufficiency !== 'string' || !mb.sourceFigureSufficiency.trim()) fail('ADD_SOURCE_FIGURE_SUFFICIENCY_MISSING');
      if (!Array.isArray(mb.newVisualInformation) || mb.newVisualInformation.length === 0) fail('ADD_NEW_INFORMATION_MISSING');
      else if (mb.newVisualInformation.some(x => typeof x !== 'string' || x.trim().length < 20)) fail('ADD_NEW_INFORMATION_TOO_VAGUE');
      if (typeof mb.marginalBenefitReason !== 'string' || mb.marginalBenefitReason.trim().length < 30) fail('ADD_MARGINAL_BENEFIT_REASON_TOO_VAGUE');
    }
  }
  if (row.action === 'REMOVE') {
    if (row.finalSolutionImagePath !== null) fail('REMOVE_FINAL_IMAGE_NOT_WITHDRAWN');
    if (!row.withdrawnPilotAsset?.path || !row.withdrawnPilotAsset?.reason) fail('REMOVE_PROVENANCE_MISSING');
    if (!/SUFFICIENT/i.test(row.sourceFigureSufficiency)) fail('REMOVE_SOURCE_FIGURE_NOT_PROVEN_SUFFICIENT');
  }
  if (row.action === 'EXEMPT' && row.visualRequirement !== 'VISUAL_EXEMPT') fail('EXEMPT_REQUIREMENT_MISMATCH');
  if (row.action !== 'EXEMPT' && row.visualRequirement === 'VISUAL_EXEMPT' && row.action !== 'REMOVE') fail('NONEXEMPT_REQUIREMENT_MISMATCH');

  if (row.sourceFigureAudit?.visualSemanticType === 'COORDINATE_GRAPH') {
    const a = row.sourceFigureAudit;
    const f = a.physicalMeasurement ?? {};
    if (a.result !== 'PASS' || a.xAxisHorizontal !== true || a.yAxisVertical !== true || a.axesOrthogonal !== true ||
        a.intendedOriginIntersection !== true || a.sameCoordinateFrame !== true ||
        Number(a.originIntersectionDeltaPx) > Number(a.originTolerancePx ?? 1) ||
        Number(f.axisScaleRelativeDelta) > 0.01 || !a.sourceProblemImageSha256)
      fail('COORDINATE_GRAPH_SOURCE_FRAME_AUDIT_FAIL');
  }
  results.push({ questionUid: row.questionUid, qid: row.qid, action: row.action, status: errors.length ? 'FAIL' : 'PASS', errors });
}

for (const [action, expected] of Object.entries(expectedCounts)) {
  if ((counts[action] ?? 0) !== expected) results.push({ questionUid: null, qid: null, action, status: 'FAIL', errors: [{ code: 'ACTION_COUNT_MISMATCH', expected, actual: counts[action] ?? 0 }] });
}
if (triage.denominator !== 120 || rows.length !== 120) results.push({ questionUid: null, qid: null, action: null, status: 'FAIL', errors: [{ code: 'TRIAGE_DENOMINATOR_FAIL', declared: triage.denominator, actual: rows.length }] });

const failed = results.filter(x => x.status !== 'PASS');
const out = { schemaVersion: 'M3_STRENGTHENED_TRIAGE_VALIDATION_v1', denominator: rows.length,
  passCount: results.length - failed.length, failCount: failed.length, counts, results };
fs.writeFileSync(`${E}/v1-validation.json`, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ denominator: out.denominator, passCount: out.passCount, failCount: out.failCount, counts, failures: failed.slice(0, 10) }));
if (failed.length) process.exit(1);
