import { canonicalJson, nonempty, objectSha } from './canonical.mjs';

export const CONTINUATION_DENOMINATOR_VERSION = 'APMATH_CONTINUATION_DENOMINATOR_v1';

export function createContinuationDenominator({ questionUid, cases = [], blocks = [], required = true }) {
  const normalizedCases = [...new Set(cases.map(value => typeof value === 'string' ? value : `${value.mode}/${value.viewport}`))].sort();
  const normalizedBlocks = blocks.map(block => ({ questionUid: block.questionUid || questionUid, caseKey: block.caseKey || `${block.mode}/${block.viewportProfile || block.viewport}`, blockId: block.blockId || null, placementSha: block.placementSha || null, screenshotSha: block.screenshot?.sha256 || block.screenshotSha || null, final: block.final === true })).sort((a, b) => `${a.caseKey}:${a.blockId}`.localeCompare(`${b.caseKey}:${b.blockId}`));
  const payload = { schemaVersion: CONTINUATION_DENOMINATOR_VERSION, questionUid, expectedCaseSet: normalizedCases, expectedBlockSet: normalizedBlocks, expectedContinuationCaseSetSha: objectSha(normalizedCases), expectedContinuationBlockSetSha: objectSha(normalizedBlocks) };
  const errors = [];
  if (required && (!normalizedBlocks.length || normalizedCases.some(key => normalizedBlocks.filter(block => block.caseKey === key && block.final).length !== 1))) errors.push('CONTINUATION_FINAL_BLOCK_REQUIRED');
  if (!nonempty(questionUid) || !normalizedCases.length) errors.push('CONTINUATION_DENOMINATOR_IDENTITY_INVALID');
  if (normalizedBlocks.some(block => block.questionUid !== questionUid || !normalizedCases.includes(block.caseKey) || !nonempty(block.blockId) || !nonempty(block.placementSha))) errors.push('CONTINUATION_BLOCK_INVALID');
  return { ...payload, status: errors.length ? 'BLOCKED' : 'PASS', errors, denominatorSha: objectSha(payload) };
}

export function validateContinuationDenominator(denominator, { questionUid, cases = null, reviewedBlocks = [] } = {}) {
  const errors = [];
  if (denominator?.schemaVersion !== CONTINUATION_DENOMINATOR_VERSION) errors.push('CONTINUATION_DENOMINATOR_SCHEMA_INVALID');
  if (questionUid !== undefined && denominator?.questionUid !== questionUid) errors.push('CONTINUATION_DENOMINATOR_UID_MISMATCH');
  if (cases && canonicalJson(denominator?.expectedCaseSet || []) !== canonicalJson([...new Set(cases)].sort())) errors.push('CONTINUATION_CASE_SET_MISMATCH');
  if (denominator?.status !== 'PASS') errors.push('CONTINUATION_DENOMINATOR_NOT_PASS');
  const expected = new Set((denominator?.expectedBlockSet || []).map(block => `${block.caseKey}\u0000${block.blockId}`));
  if (!expected.size || expected.size !== denominator?.expectedBlockSet?.length) errors.push('CONTINUATION_EMPTY_OR_DUPLICATE');
  for (const key of denominator?.expectedCaseSet || []) if (denominator.expectedBlockSet.filter(block => block.caseKey === key && block.final).length !== 1) errors.push('CONTINUATION_FINAL_BLOCK_REQUIRED');
  for (const block of denominator?.expectedBlockSet || []) {
    const matches = reviewedBlocks.filter(row => row.caseKey === block.caseKey && row.blockId === block.blockId);
    if (matches.length !== 1 || matches[0].status !== 'PASS' || matches[0].placementSha !== block.placementSha || matches[0].screenshotSha !== block.screenshotSha) errors.push(`CONTINUATION_REVIEW_BINDING:${block.blockId}`);
  }
  if (reviewedBlocks.length !== expected.size) errors.push('CONTINUATION_REVIEW_EXTRA_OR_DUPLICATE');
  const { status, errors: ignored, denominatorSha, ...payload } = denominator || {};
  if (denominatorSha !== objectSha(payload) || payload.expectedContinuationBlockSetSha !== objectSha(payload.expectedBlockSet || []) || payload.expectedContinuationCaseSetSha !== objectSha(payload.expectedCaseSet || [])) errors.push('CONTINUATION_HASH_MISMATCH');
  const reviewed = new Set(reviewedBlocks.map(block => `${block.caseKey || `${block.mode}/${block.viewport}`}\u0000${block.blockId}`));
  for (const key of expected) if (!reviewed.has(key)) errors.push(`CONTINUATION_BLOCK_UNREVIEWED:${key}`);
  return { status: errors.length ? 'BLOCKED' : 'PASS', errors };
}
