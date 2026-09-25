#!/usr/bin/env node
/**
 * Blind-input and A/B ledger audit for the H1 80-item one-pass pilot.
 * Deliberately does not open the Sol-only hidden manifest or old metadata.
 * Run only after both workers have submitted all 80 records.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const base = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/one-pass-pilot');
const inputDir = path.join(base, 'worker-input');
const outputDir = path.join(base, 'worker-output');
const issues = [];

function readJsonl(file) {
  return fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).map((line, index) => {
    try { return JSON.parse(line); }
    catch (error) { throw new Error(`${path.basename(file)}:${index + 1}: ${error.message}`); }
  });
}
function workerRows(letter) {
  const names = fs.readdirSync(outputDir);
  const files = names
    .filter(name => new RegExp(`^H1_ONE_PASS_PILOT_LUNA_${letter}_CLEAN_BATCH0[1-4]_.*\\.jsonl$`).test(name))
    .filter(name => !name.includes('.scratch.'))
    .filter(name => letter !== 'A' || !name.includes('BATCH04_'))
    .sort();
  if (letter === 'A') {
    const replacement = names.find(name => /^H1_ONE_PASS_PILOT_LUNA_A_REPLACEMENT_BATCH04_061_080\.jsonl$/.test(name));
    if (replacement) files.push(replacement);
    else issues.push('A: rejected original batch04 has no blind replacement');
  }
  if (files.length !== 4) issues.push(`${letter}: expected 4 completed batch files, found ${files.length}`);
  return files.flatMap(name => readJsonl(path.join(outputDir, name)));
}
function sorted(values) { return [...new Set(values)].sort(); }
function candidate(value, marker, description) {
  if (value === marker) return `NEW:${description ?? ''}`;
  return value ?? null;
}
function normalized(row, letter) {
  if (letter === 'A') return {
    l1: row.L1?.standardUnitKey ?? null,
    l2: row.L2?.subUnitKey ?? null,
    l3: candidate(row.L3?.problemTypeKey, 'NEW_L3_CANDIDATE', row.L3?.candidateDescription),
    l4: candidate(row.L4?.templateKey, 'NEW_L4_CANDIDATE', row.L4?.candidateDescription),
    crossConcepts: sorted((row.crossConcepts ?? []).map(x => x.conceptKey)),
    conditions: sorted((row.conditions ?? []).map(x => x.conditionKey)),
    integrationPattern: row.integrationPattern?.key ?? null,
    reviewStatus: row.reviewStatus ?? null,
  };
  return {
    l1: row.primary?.standardUnitKey ?? null,
    l2: row.primary?.subUnitKey ?? null,
    l3: row.l3?.kind === 'NEW_L3_CANDIDATE' ? `NEW:${row.l3.candidate ?? ''}` : row.l3?.key ?? null,
    l4: row.l4?.kind === 'NEW_L4_SKELETON_CANDIDATE' ? `NEW:${row.l4.candidate ?? ''}` : row.l4?.key ?? null,
    crossConcepts: sorted((row.crossConcepts?.considered ?? []).filter(x => x.decision === 'include').map(x => x.key)),
    conditions: sorted((row.conditionKeys ?? []).map(x => x.key ?? x)),
    integrationPattern: row.integrationPattern ?? null,
    reviewStatus: row.reviewStatus ?? null,
  };
}
function keySets(vocab) {
  return {
    l1: new Set(vocab.standardUnits.map(x => x.key)),
    l2: new Set(vocab.subUnits.map(x => x.key)),
    l3: new Set(vocab.problemTypes.map(x => x.problemTypeKey)),
    l4: new Set(vocab.templates.map(x => x.templateKey)),
    crossConcepts: new Set(vocab.crossConcepts.map(x => x.conceptKey)),
    conditions: new Set(vocab.conditions.map(x => x.conditionKey)),
    integrationPattern: new Set(vocab.integrationPatterns),
  };
}
function validate(input, rows, letter, keys, vocab) {
  if (rows.length !== 80) issues.push(`${letter}: coverage ${rows.length}/80`);
  const seen = new Set();
  rows.forEach((row, index) => {
    const expected = input[index];
    const n = row.row ?? row.batchSequence;
    if (!expected) { issues.push(`${letter}: extra row ${index + 1}`); return; }
    if (n !== index + 1) issues.push(`${letter}:${index + 1}: row index ${n}`);
    if (seen.has(row.questionUid)) issues.push(`${letter}:${n}: duplicate UID`);
    seen.add(row.questionUid);
    for (const field of ['questionUid', 'sourceIdentity', 'sourceFingerprint', 'contentHash', 'solutionHash', 'inputBundleSha']) {
      if (row[field] !== expected[field]) issues.push(`${letter}:${n}: ${field} mismatch`);
    }
    if ((row.sourceImagePath ?? null) !== (expected.sourceImagePath ?? null)) issues.push(`${letter}:${n}: sourceImagePath mismatch`);
    if (letter === 'B' && (row.forbiddenPriorAssignmentRefs ?? []).length) issues.push(`${letter}:${n}: forbidden prior reference`);
    const norm = normalized(row, letter);
    for (const layer of ['l1', 'l2', 'l3', 'l4']) {
      const value = norm[layer];
      if (!value || (!value.startsWith('NEW:') && !keys[layer].has(value))) issues.push(`${letter}:${n}: invalid ${layer} ${value}`);
      if (value?.startsWith('NEW:') && value.length < 12) issues.push(`${letter}:${n}: vague ${layer} candidate`);
    }
    const parent = vocab.subUnits.find(x => x.key === norm.l2)?.standardUnitKey;
    if (parent && parent !== norm.l1) issues.push(`${letter}:${n}: L2 parent ${parent} differs from L1 ${norm.l1}`);
    for (const layer of ['crossConcepts', 'conditions']) {
      for (const value of norm[layer]) if (!keys[layer].has(value)) issues.push(`${letter}:${n}: invalid ${layer} ${value}`);
    }
    if (!keys.integrationPattern.has(norm.integrationPattern)) issues.push(`${letter}:${n}: invalid integration ${norm.integrationPattern}`);
    if (!['REVIEWED', 'HOLD'].includes(norm.reviewStatus)) issues.push(`${letter}:${n}: invalid status ${norm.reviewStatus}`);
    if (letter === 'A') {
      for (const field of ['L1', 'L2', 'L3', 'L4']) if ((row[field]?.reason ?? '').length < 20) issues.push(`${letter}:${n}: weak ${field} reason`);
      if ((row.primaryMethod?.reason ?? '').length < 20 || (row.decisiveStep?.reason ?? '').length < 20) issues.push(`${letter}:${n}: weak method/step reason`);
    } else {
      for (const field of ['standardUnitReason', 'subUnitReason', 'primaryMethodReason', 'decisiveStepReason']) {
        const value = row.primary?.[field] ?? row[field];
        if ((value ?? '').length < 20) issues.push(`${letter}:${n}: weak ${field}`);
      }
      if ((row.l3?.reason ?? '').length < 20 || (row.l4?.reason ?? '').length < 20) issues.push(`${letter}:${n}: weak L3/L4 reason`);
    }
  });
}

const input = readJsonl(path.join(inputDir, 'H1_ONE_PASS_PILOT_BLIND_INPUT_80.jsonl'));
const vocab = JSON.parse(fs.readFileSync(path.join(inputDir, 'H1_ONE_PASS_ACTIVE_VOCAB_SANITIZED.json'), 'utf8'));
const a = workerRows('A');
const b = workerRows('B');
const keys = keySets(vocab);
if (input.length !== 80) issues.push(`blind input coverage ${input.length}/80`);
validate(input, a, 'A', keys, vocab);
validate(input, b, 'B', keys, vocab);
if (issues.length) {
  console.error(JSON.stringify({ status: 'FAIL', issueCount: issues.length, issues }, null, 2));
  process.exitCode = 1;
} else {
  const layers = ['l1', 'l2', 'l3', 'l4', 'crossConcepts', 'conditions', 'integrationPattern', 'reviewStatus'];
  const counts = Object.fromEntries(layers.map(layer => [layer, 0]));
  const rows = input.map((source, index) => {
    const an = normalized(a[index], 'A');
    const bn = normalized(b[index], 'B');
    const agreements = Object.fromEntries(layers.map(layer => {
      const same = JSON.stringify(an[layer]) === JSON.stringify(bn[layer]);
      if (same) counts[layer]++;
      return [layer, same];
    }));
    return { row: index + 1, questionUid: source.questionUid, sourceIdentity: source.sourceIdentity,
      sourceFingerprint: source.sourceFingerprint, a: an, b: bn, agreements,
      fullSemanticAgreement: layers.every(layer => agreements[layer]) };
  });
  const summary = {
    status: 'PASS_BLIND_A_B_ONLY', denominator: 80, aCoverage: a.length, bCoverage: b.length,
    layerAgreements: counts, fullSemanticAgreement: rows.filter(x => x.fullSemanticAgreement).length,
    aHold: a.filter(x => x.reviewStatus === 'HOLD').length,
    bHold: b.filter(x => x.reviewStatus === 'HOLD').length,
    aNewL3ItemProposals: rows.filter(x => x.a.l3?.startsWith('NEW:')).length,
    bNewL3ItemProposals: rows.filter(x => x.b.l3?.startsWith('NEW:')).length,
    aNewL4ItemProposals: rows.filter(x => x.a.l4?.startsWith('NEW:')).length,
    bNewL4ItemProposals: rows.filter(x => x.b.l4?.startsWith('NEW:')).length,
    hiddenReferenceOpened: false,
  };
  const destination = process.argv[2];
  if (destination) fs.writeFileSync(destination, JSON.stringify({ summary, rows }, null, 2) + '\n');
  console.log(JSON.stringify(summary, null, 2));
}
