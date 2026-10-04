import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..', '..');
const evidenceDir = path.join(repoRoot, 'archive', 'data', 'meta-foundation', 'evidence', 'middle-geometry', 'v1');
const ledgerPath = path.join(evidenceDir, 'item_level_assignment_928.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

function expectedLegacyLevel(bucket) {
  if (bucket === 1) return '하';
  if (bucket === 2 || bucket === 3) return '중';
  if (bucket === 4 || bucket === 5) return '상';
  return null;
}

function compatibility(legacyLevel, bucket) {
  const expected = expectedLegacyLevel(bucket);
  if (!expected || !legacyLevel) return { expected, value: 'UNKNOWN', class: 'UNKNOWN' };
  if (legacyLevel === expected) return { expected, value: 'NORMAL', class: 'NORMAL' };
  const adjacent = (legacyLevel === '하' && bucket === 2) ||
    (legacyLevel === '중' && (bucket === 1 || bucket === 4)) ||
    (legacyLevel === '상' && bucket === 3);
  if (adjacent) return { expected, value: 'BORDERLINE_REVIEW', class: 'BORDERLINE_REVIEW' };
  return { expected, value: 'STRONG_CONFLICT', class: 'STRONG_CONFLICT' };
}

function buildReviewTargets(records) {
  const triggers = new Map();
  const add = (record, reason) => {
    const reasons = triggers.get(record.questionUid) || new Set();
    reasons.add(reason);
    triggers.set(record.questionUid, reasons);
  };
  const groups = new Map();
  const candidateL4Usage = {};
  for (const record of records) {
    if (record.problemTypeKey && Number.isInteger(record.difficultyBucket)) {
      const key = `${record.problemTypeKey}|${record.templateKey || '(none)'}`;
      const group = groups.get(key) || [];
      group.push(record);
      groups.set(key, group);
    }
    if (record.templateKey && record.l4Status === 'CANDIDATE_SUGGESTION') {
      candidateL4Usage[record.templateKey] = (candidateL4Usage[record.templateKey] || 0) + 1;
    }
  }
  for (const record of records) {
    if (record.l3Status === 'OUT_OF_SCOPE') add(record, 'route_out_or_source_hold');
    if (record.difficultyBoundaryFlag !== 'NONE') add(record, 'difficulty_boundary_or_unresolved');
    if (record.difficultyConfidence === 'low') add(record, 'low_confidence');
    if (record.legacyLevelCompatibility === 'STRONG_CONFLICT') add(record, 'strong_legacy_conflict');
    if (record.legacyLevelCompatibility === 'BORDERLINE_REVIEW') add(record, 'legacy_borderline_mismatch');
    if (record.visualRisk) add(record, 'visual_or_direct_source_high_risk');
    if (record.evidence.sourceDefectEvidence) add(record, 'source_or_solution_defect');
    if (record.templateKey && record.l4Status === 'CANDIDATE_SUGGESTION' && candidateL4Usage[record.templateKey] <= 1) {
      add(record, 'semantic_outlier_or_singleton_l4_suggestion');
    }
  }
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const buckets = group.map(record => record.difficultyBucket);
    const min = Math.min(...buckets);
    const max = Math.max(...buckets);
    if (max - min < 2) continue;
    for (const record of group.filter(item => item.difficultyBucket === min || item.difficultyBucket === max)) {
      add(record, 'same_type_difficulty_span_endpoint');
    }
  }
  return [...triggers.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([questionUid, reasons]) => ({ questionUid, triggerReasons: [...reasons].sort() }));
}

function apply() {
  const ledger = readJson(ledgerPath);
  const mapped = ledger.records.filter(record => Boolean(record.problemTypeKey));
  const compatibilityCounts = {};
  const relationCounts = {};
  const conflicts = [];
  for (const record of ledger.records) {
    if (!record.problemTypeKey) {
      record.legacyLevelCompatibility = 'UNKNOWN';
      continue;
    }
    const result = compatibility(record.legacyLevel, record.difficultyBucket);
    record.legacyLevelCompatibility = result.value;
    compatibilityCounts[result.value] = (compatibilityCounts[result.value] || 0) + 1;
    relationCounts[`${record.legacyLevel}→${result.expected}`] = (relationCounts[`${record.legacyLevel}→${result.expected}`] || 0) + 1;
    record.evidence.legacyCompare = {
      status: 'COMPARED_AFTER_BLIND_FREEZE',
      legacyLevel: record.legacyLevel,
      blindBucket: record.difficultyBucket,
      expectedLegacyLevel: result.expected,
      compatibility: result.value,
      legacyHiddenDuringBlind: true,
      independentRecheckRequired: result.value !== 'NORMAL'
    };
    if (result.value !== 'NORMAL') {
      conflicts.push({
        questionUid: record.questionUid,
        source: `${record.sourceArchiveFile}#${record.sourceOrdinal}`,
        legacyLevel: record.legacyLevel,
        blindBucket: record.difficultyBucket,
        expectedLegacyLevel: result.expected,
        compatibility: result.value
      });
    }
  }
  const targets = buildReviewTargets(ledger.records);
  ledger.reviewTargets = targets;
  ledger.blindReview.nextStart = 'independent recheck/adjudication → L4/CrossConcept/Condition/Integration semantic review';
  ledger.status = 'CANDIDATE_LEGACY_COMPARE_COMPLETE_RECHECK_PENDING';
  ledger.legacyCompare = {
    status: 'COMPLETE_RECHECK_PENDING',
    denominator: ledger.records.length,
    mappedCount: mapped.length,
    routeOutHoldCount: ledger.records.length - mapped.length,
    legacyUsedDuringBlind: false,
    comparedAfterBlindFreeze: true,
    compatibilityCounts,
    relationCounts,
    conflictCount: conflicts.length,
    independentRecheckTargetCount: targets.length
  };
  writeJson(ledgerPath, ledger);
  for (const file of ['m2_item_level_l3_ledger_402.json', 'm3_stage2_l3_fresh_assignment_526.json']) {
    const mirrorPath = path.join(evidenceDir, file);
    const mirror = readJson(mirrorPath);
    const byUid = new Map(ledger.records.map(record => [record.questionUid, record]));
    mirror.records = mirror.records.map(record => byUid.get(record.questionUid) || record);
    mirror.reviewTargets = targets;
    mirror.blindReview = ledger.blindReview;
    mirror.legacyCompare = ledger.legacyCompare;
    writeJson(mirrorPath, mirror);
  }
  writeJson(path.join(evidenceDir, 'difficulty_legacy_compare_928.json'), {
    schemaVersion: 'middle-geometry-legacy-compare-v1',
    status: 'LEGACY_COMPARE_COMPLETE_RECHECK_PENDING',
    denominator: ledger.records.length,
    mappedCount: mapped.length,
    routeOutHoldCount: ledger.records.length - mapped.length,
    mapping: { '1': '하', '2': '중', '3': '중', '4': '상', '5': '상' },
    legacyUsedDuringBlind: false,
    comparedAfterBlindFreeze: true,
    compatibilityCounts,
    relationCounts,
    conflictCount: conflicts.length,
    conflicts,
    triggerUnionCount: targets.length,
    triggerReasonCounts: Object.fromEntries(Object.entries(targets.flatMap(target => target.triggerReasons).reduce((out, reason) => {
      out[reason] = (out[reason] || 0) + 1;
      return out;
    }, {})).sort(([left], [right]) => left.localeCompare(right))),
    productionPromotion: 'NOT_ATTEMPTED',
    mainMerge: 'FORBIDDEN'
  });
  console.log(JSON.stringify({ status: ledger.legacyCompare.status, mappedCount: mapped.length, compatibilityCounts, conflictCount: conflicts.length, triggerUnionCount: targets.length }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) apply();
