#!/usr/bin/env node
/** Pilot-only Sol grouping of proposed labels; never promotes canonical metadata. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const base = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation');
const hidden = path.join(base, 'sol-checkpoint/pilot-hidden');
const sol = path.join(base, 'one-pass-pilot/sol-analysis');
const raw = JSON.parse(fs.readFileSync(path.join(hidden, 'H1_ONE_PASS_HIDDEN_L3_RAW_COMPARISON_80.json'))).rows;
const norm = JSON.parse(fs.readFileSync(path.join(sol, 'H1_ONE_PASS_SOL_AB_SEMANTIC_NORMALIZATION_WORKING.json')));
const l3Override = {
  22: 'PT_H1_QUADRATIC_DISCRIMINANT',
  26: 'PT_H1_GEOMETRIC_PRODUCT_RECOVERY_REVIEW',
  34: 'PT_H1_POLY_FACTORIZATION',
  37: 'PT_H1_ROOT_COEFFICIENT_RELATION',
  38: 'PT_FUNCTION_EXTREMUM',
  41: 'PT_FUNCTION_GRAPH_INTERSECTION',
  47: 'PT_FUNCTION_GRAPH_TRANSFORM',
  48: 'PT_FUNCTION_GRAPH_PROPERTIES',
  50: 'PT_H1_LINEAR_SYSTEM_INEQUALITY',
  53: 'PT_FUNCTION_GRAPH_INTERSECTION',
  57: 'PT_FUNCTION_EXTREMUM',
  58: 'PT_FUNCTION_EXTREMUM',
  59: 'PT_COUNTING_ARRANGEMENT',
  61: 'PT_COUNTING_SELECTION_DISTRIBUTION',
  63: 'PT_COUNTING_REPEATED_ASSIGNMENT',
  64: 'PT_COUNTING_REPEATED_ASSIGNMENT',
  66: 'PT_H1_COUNTING_PRINCIPLE_GENERAL',
  69: 'PT_COUNTING_REPEATED_ASSIGNMENT',
  73: 'PT_COUNTING_ARRANGEMENT',
  79: 'PT_H1_MATRIX_QUADRATIC_OPTIMIZATION_REVIEW',
};
if (raw.length !== 80) throw new Error('80-row gate failed');
const rows = raw.map(x => ({
  row: x.row,
  questionUid: x.questionUid,
  aNewL3Label: x.a.l3?.startsWith('NEW:') ? x.a.l3.slice(4) : null,
  bNewL3Label: x.b.l3?.startsWith('NEW:') ? x.b.l3.slice(4) : null,
  aNewL4Label: x.a.l4?.startsWith('NEW:') ? x.a.l4.slice(4) : null,
  bNewL4Label: x.b.l4?.startsWith('NEW:') ? x.b.l4.slice(4) : null,
  sourceHold: x.row === 7,
  pilotOnlyL3Family: x.row === 7 ? null : l3Override[x.row] ?? x.hiddenExisting.candidateL3,
  pilotOnlyL4Family: x.row === 7 ? null : x.hiddenExisting.candidateL4,
  l3MaterialABConflict: norm.materialL3ConflictRows.includes(x.row),
  l4MaterialABConflict: norm.materialL4SkeletonConflictRows.includes(x.row),
  oldCandidateUsedOnlyAsReviewReference: true,
}));
const unique = values => new Set(values.filter(Boolean));
const eligible = rows.filter(x => !x.sourceHold);
const l3Labels = unique(eligible.flatMap(x => [x.aNewL3Label, x.bNewL3Label]));
const l4Labels = unique(eligible.flatMap(x => [x.aNewL4Label, x.bNewL4Label]));
const l3Families = unique(eligible.filter(x => x.aNewL3Label || x.bNewL3Label).map(x => x.pilotOnlyL3Family));
const l4Families = unique(eligible.filter(x => x.aNewL4Label || x.bNewL4Label).map(x => x.pilotOnlyL4Family));
const summary = {
  status: 'PILOT_ONLY_SOL_GROUPING_NOT_CANONICAL_PROMOTION',
  denominator: 80,
  sourceHoldWithNoExistingFamily: [7],
  l3: { eligibleUniqueRawLabels: l3Labels.size, pilotOnlyFamilies: l3Families.size, groupedOrMergedLabelCount: l3Labels.size - l3Families.size },
  l4: { eligibleUniqueRawLabels: l4Labels.size, pilotOnlyFamilies: l4Families.size, groupedOrMergedLabelCount: l4Labels.size - l4Families.size },
  newCrossConceptCandidateCount: 0,
  productionCanonicalMutations: 0,
  method: 'Sol reviewed source-based candidate descriptions and placed them in pilot-only method/skeleton families. Existing Stage3/L4 candidates are references, not automatic truths; L3 source-supported corrections use explicit overrides. L4 families are provisional while material A/B skeleton conflicts remain listed in the AB normalization artifact.',
};
fs.writeFileSync(path.join(sol, 'H1_ONE_PASS_SOL_CANDIDATE_COMPRESSION_WORKING_80.json'), JSON.stringify({ summary, rows }, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
