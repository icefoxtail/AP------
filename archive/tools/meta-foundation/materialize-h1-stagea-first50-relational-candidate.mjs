#!/usr/bin/env node
/** Working A/B/C field consensus for H1 queue 1-50. Never declares final taxonomy. */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const comparison = JSON.parse(fs.readFileSync(path.join(dir, 'H1_STAGEA_FIRST50_AB_WORKING_COMPARISON_CURRENT.json'), 'utf8'));
const q31DirectFile = 'H1_SOL_Q031_FACTOR_NORMALIZATION_ADJUDICATION.json';
const q31Direct = JSON.parse(fs.readFileSync(path.join(dir, q31DirectFile), 'utf8'));
const q4IpFile = 'H1_SOL_IP_Q004_PERFECT_SQUARE_PRIMARY.json';
const q4Ip = JSON.parse(fs.readFileSync(path.join(dir, q4IpFile), 'utf8'));
const q7HoldFile = 'H1_SOL_Q007_UNNORMALIZED_SQUARE_ROOT_HOLD.json';
const q7Hold = JSON.parse(fs.readFileSync(path.join(dir, q7HoldFile), 'utf8'));
const q26HoldFile = 'H1_SOL_Q026_SOURCE_NONUNIQUENESS_HOLD.json';
const q26Hold = JSON.parse(fs.readFileSync(path.join(dir, q26HoldFile), 'utf8'));
const q10DirectFile = 'H1_SOL_Q010_SOLUTION_WRONG_ITEM_ADJUDICATION.json';
const q10Direct = JSON.parse(fs.readFileSync(path.join(dir, q10DirectFile), 'utf8'));
const q14DirectFile = 'H1_SOL_Q014_CUBOID_CURRICULUM_MISMATCH_HOLD.json';
const q14Direct = JSON.parse(fs.readFileSync(path.join(dir, q14DirectFile), 'utf8'));
const q37DirectFile = 'H1_SOL_Q037_UNATTAINED_MINIMUM_HOLD.json';
const q37Direct = JSON.parse(fs.readFileSync(path.join(dir, q37DirectFile), 'utf8'));
const q38DirectFile = 'H1_SOL_Q038_TANGENT_TRIANGLE_RATIO_ADJUDICATION.json';
const q38Direct = JSON.parse(fs.readFileSync(path.join(dir, q38DirectFile), 'utf8'));
const passDirectFiles = new Map([[43, 'H1_SOL_Q043_COMPLEX_RADICAL_BRANCH_PASS.json'],
  [50, 'H1_SOL_Q050_COMPLEX_TRUTH_COUNT_PASS.json']]);
const passDirect = new Map([...passDirectFiles].map(([queueIndex, file]) =>
  [queueIndex, JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))]));
const q47DirectFile = 'H1_SOL_Q047_COMPLEX_ROOT_BRANCH_PASS.json';
const q47Direct = JSON.parse(fs.readFileSync(path.join(dir, q47DirectFile), 'utf8'));
const q2DirectFile = 'H1_SOL_Q002_DIVISION_INTEGER_ROOT_BRANCH.json';
const q2Direct = JSON.parse(fs.readFileSync(path.join(dir, q2DirectFile), 'utf8'));
const q16DirectFile = 'H1_SOL_Q016_POLY_IDENTITY_FACTOR_THEOREM.json';
const q16Direct = JSON.parse(fs.readFileSync(path.join(dir, q16DirectFile), 'utf8'));
const q25DirectFile = 'H1_SOL_Q025_PRIME_FACTOR_REMAINDER.json';
const q25Direct = JSON.parse(fs.readFileSync(path.join(dir, q25DirectFile), 'utf8'));
const q29DirectFile = 'H1_SOL_Q029_SIGN_BRANCH_INTEGRATION.json';
const q29Direct = JSON.parse(fs.readFileSync(path.join(dir, q29DirectFile), 'utf8'));
const q32DirectFile = 'H1_SOL_Q032_INTERSECTION_COUNT_FUNCTION.json';
const q32Direct = JSON.parse(fs.readFileSync(path.join(dir, q32DirectFile), 'utf8'));
const q34DirectFile = 'H1_SOL_Q034_PERPENDICULAR_TANGENTS_PASS.json';
const q34Direct = JSON.parse(fs.readFileSync(path.join(dir, q34DirectFile), 'utf8'));
const q42DirectFile = 'H1_SOL_Q042_TANGENT_CONTACT_PARENT.json';
const q42Direct = JSON.parse(fs.readFileSync(path.join(dir, q42DirectFile), 'utf8'));
const q49DirectFile = 'H1_SOL_Q049_CONJUGATE_ROOT_MINIMUM.json';
const q49Direct = JSON.parse(fs.readFileSync(path.join(dir, q49DirectFile), 'utf8'));
const q45HoldFile = 'H1_SOL_Q045_HWP_CONDITIONS_UNVERIFIED_HOLD.json';
const q45Hold = JSON.parse(fs.readFileSync(path.join(dir, q45HoldFile), 'utf8'));
const q41CrossFile = 'H1_SOL_Q041_EXTREMUM_CROSS_CONCEPT_CUT.json';
const q41Cross = JSON.parse(fs.readFileSync(path.join(dir, q41CrossFile), 'utf8'));
if (comparison.summary.counts.currentDual !== 50 || comparison.summary.counts.unreviewedConflict !== 0)
  throw new Error('first50 A/B/C coverage gate is not closed');
const read = file => fs.readFileSync(path.join(dir, file), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const cCache = new Map();
const fields = ['l3', 'crossConcepts', 'conditions', 'integrationPattern', 'sourceIssue', 'reviewStatus'];
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const label = value => typeof value === 'string' ? value : value?.key ?? value?.status ?? value?.issue ?? value?.issueCode ?? null;
const issue = value => {
  const raw = label(value);
  if (['CLEAR', 'NO_ISSUE', 'OK', 'PASS'].includes(raw) || raw?.startsWith('UPSTREAM_L')) return 'NONE';
  if (['SOLUTION_GENERIC_FILLER', 'SOLUTION_PLACEHOLDER', 'SOLUTION_BLOCKER',
    'SOLUTION_WRONG_ITEM', 'SOLUTION_TOPIC_MISMATCH', 'SOLUTION_NOT_ITEM_SPECIFIC',
    'SOLUTION_GENERIC_NO_MATH'].includes(raw)) return 'SOLUTION_BLOCKER';
  if (['SOLUTION_INTERMEDIATE_TYPO', 'SOLUTION_IMAGINARY_UNIT_TRANSCRIPTION',
    'NONBLOCKING_SOLUTION_TYPO'].includes(raw)) return 'SOLUTION_MINOR_TYPO';
  if (['MINOR_EDITORIAL', 'MINOR_TEXT_ONLY', 'MINOR'].includes(raw)) return 'MINOR_EDITORIAL';
  if (['SOLUTION_PROOF_GAP', 'SOLUTION_REASON_GAP', 'NONBLOCKING_SOLUTION_GAP'].includes(raw)) return 'SOLUTION_REASON_GAP';
  return raw;
};
const keys = values => [...new Set((Array.isArray(values) ? values : [])
  .map(value => typeof value === 'string' ? value : value?.key).filter(Boolean))].sort();
function cFor(row) {
  if (!row.currentCFile) return null;
  if (!cCache.has(row.currentCFile)) cCache.set(row.currentCFile, read(row.currentCFile));
  return cCache.get(row.currentCFile).find(c => c.questionUid === row.questionUid
    && c.sourceFingerprint === row.currentSourceFingerprint) ?? null;
}
function normalizedC(c) {
  if (!c) return null;
  const l3Review = c.l3IndependentJudgment ?? c.frozenL3IndependentReview ?? c.frozenL3Review ?? {};
  const key = l3Review.recommendedPrimaryKey ?? l3Review.suggestedL3
    ?? (l3Review.independentProblemTypeKeys?.length === 1 ? l3Review.independentProblemTypeKeys[0] : null)
    ?? l3Review.key ?? c.l3UpstreamKey ?? null;
  const verdict = c.verdict ?? c.reviewStatus ?? c.status ?? null;
  return { l3: key, crossConcepts: keys(c.crossConceptKeys ?? c.crossConcepts),
    conditions: keys(c.conditionKeys ?? c.conditions), integrationPattern: label(c.integrationPattern),
    sourceIssue: issue(c.sourceIssue), reviewStatus: verdict === 'COMPLETE' || verdict === 'REVIEWED'
      ? (c.hold || c.holdReason ? 'HOLD' : 'PASS') : verdict };
}
const candidate = [];
const solQueue = [];
const counts = { items: 0, fieldsDualMatch: 0, fieldsTwoOfThree: 0, fieldsSolDirectOverride: 0, fieldsPendingSol: 0,
  itemsPendingSol: 0, itemsAllFieldsResolvedWorking: 0 };
for (const row of comparison.rows) {
  if (!row.a || !row.b) throw new Error(`missing A/B q${row.queueIndex}`);
  const c = normalizedC(cFor(row));
  if (row.fullConflict && !c) throw new Error(`missing current C q${row.queueIndex}`);
  const fieldDecisions = {};
  const pending = [];
  for (const field of fields) {
    const a = row.a[field] ?? null, b = row.b[field] ?? null;
    if (same(a, b)) {
      fieldDecisions[field] = { value: a, provenance: 'DUAL_LUNA_MATCH' };
      counts.fieldsDualMatch++;
    } else if (c?.[field] == null) {
      fieldDecisions[field] = { value: null, provenance: 'SOL_DIRECT_ADJUDICATION_PENDING', reason: 'C_FIELD_MISSING', competingValues: { a, b } };
      counts.fieldsPendingSol++; pending.push(field);
    } else if (same(a, c[field]) || same(b, c[field])) {
      fieldDecisions[field] = { value: c[field], provenance: 'LUNA_2_OF_3_CONSENSUS',
        agreeingPair: same(a, c[field]) ? ['A', 'C'] : ['B', 'C'] };
      counts.fieldsTwoOfThree++;
    } else {
      fieldDecisions[field] = { value: null, provenance: 'SOL_DIRECT_ADJUDICATION_PENDING', reason: 'THREE_WAY_SPLIT',
        competingValues: { a, b, c: c[field] } };
      counts.fieldsPendingSol++; pending.push(field);
    }
  }
  if (row.queueIndex === 31) {
    if (row.questionUid !== q31Direct.questionUid || row.currentSourceFingerprint !== q31Direct.sourceFingerprint)
      throw new Error('q31 Sol direct evidence/source drift');
    for (const [field, value] of [['l3', null], ['reviewStatus', 'HOLD'], ['sourceIssue', 'SOURCE_UNRESOLVED_HOLD']]) {
      const previous = fieldDecisions[field];
      if (previous.provenance === 'DUAL_LUNA_MATCH') counts.fieldsDualMatch--;
      else if (previous.provenance === 'LUNA_2_OF_3_CONSENSUS') counts.fieldsTwoOfThree--;
      else if (previous.provenance === 'SOL_DIRECT_ADJUDICATION_PENDING') {
        counts.fieldsPendingSol--;
        pending.splice(pending.indexOf(field), 1);
      }
      fieldDecisions[field] = { value, provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q31DirectFile, reason: field === 'l3'
          ? 'The source ambiguity changes the admissible factor interpretation; defer L3 freeze under this UID HOLD.'
          : 'Printed question leaves factor normalization and signs unconstrained.' };
      counts.fieldsSolDirectOverride++;
    }
  }
  if (row.queueIndex === 4) {
    if (row.questionUid !== q4Ip.questionUid || row.currentSourceFingerprint !== q4Ip.sourceFingerprint)
      throw new Error('q4 Sol integration evidence/source drift');
    if (fieldDecisions.integrationPattern.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error('q4 integration expected pending');
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf('integrationPattern'), 1);
    fieldDecisions.integrationPattern = { value: 'NONE', provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: q4IpFile, reason: q4Ip.reason };
    counts.fieldsSolDirectOverride++;
  }
  if (row.queueIndex === 7) {
    if (row.questionUid !== q7Hold.questionUid || row.currentSourceFingerprint !== q7Hold.sourceFingerprint)
      throw new Error('q7 Sol HOLD evidence/source drift');
    for (const field of ['integrationPattern', 'sourceIssue', 'reviewStatus']) {
      const previous = fieldDecisions[field];
      if (previous.provenance === 'SOL_DIRECT_ADJUDICATION_PENDING') {
        counts.fieldsPendingSol--;
        pending.splice(pending.indexOf(field), 1);
      } else if (previous.provenance === 'DUAL_LUNA_MATCH') counts.fieldsDualMatch--;
      else if (previous.provenance === 'LUNA_2_OF_3_CONSENSUS') counts.fieldsTwoOfThree--;
      else throw new Error(`q7 unexpected ${field} provenance`);
      fieldDecisions[field] = { ...q7Hold.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q7HoldFile };
      counts.fieldsSolDirectOverride++;
    }
  }
  if (row.queueIndex === 26) {
    if (row.questionUid !== q26Hold.questionUid || row.currentSourceFingerprint !== q26Hold.sourceFingerprint)
      throw new Error('q26 Sol HOLD evidence/source drift');
    const field = 'crossConcepts';
    const previous = fieldDecisions[field];
    if (previous.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error('q26 cross-concept expected pending');
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf(field), 1);
    fieldDecisions[field] = { value: null, provenance: 'HOLD', evidenceFile: q26HoldFile,
      reason: 'The printed stem allows two factor allocations with different answers; defer cross-concept freeze until correction protocol resolves the source.' };
    counts.fieldsSolDirectOverride++;
  }
  if (row.queueIndex === 10) {
    if (row.questionUid !== q10Direct.questionUid || row.currentSourceFingerprint !== q10Direct.sourceFingerprint)
      throw new Error('q10 Sol evidence/source drift');
    for (const field of ['sourceIssue', 'integrationPattern']) {
      const previous = fieldDecisions[field];
      if (previous.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
        throw new Error(`q10 ${field} expected pending`);
      counts.fieldsPendingSol--;
      pending.splice(pending.indexOf(field), 1);
      fieldDecisions[field] = { ...q10Direct.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q10DirectFile };
      counts.fieldsSolDirectOverride++;
    }
  }
  if (row.queueIndex === 14) {
    if (row.questionUid !== q14Direct.questionUid || row.currentSourceFingerprint !== q14Direct.sourceFingerprint)
      throw new Error('q14 Sol evidence/source drift');
    for (const field of ['l3', 'integrationPattern', 'sourceIssue']) {
      const previous = fieldDecisions[field];
      if (previous.provenance === 'SOL_DIRECT_ADJUDICATION_PENDING') {
        counts.fieldsPendingSol--;
        pending.splice(pending.indexOf(field), 1);
      } else if (previous.provenance === 'DUAL_LUNA_MATCH') counts.fieldsDualMatch--;
      else throw new Error(`q14 ${field} unexpected provenance`);
      fieldDecisions[field] = { ...q14Direct.fieldDecisions[field], evidenceFile: q14DirectFile };
      counts.fieldsSolDirectOverride++;
    }
  }
  if (row.queueIndex === 37) {
    if (row.questionUid !== q37Direct.questionUid || row.currentSourceFingerprint !== q37Direct.sourceFingerprint)
      throw new Error('q37 Sol evidence/source drift');
    for (const field of ['l3', 'sourceIssue']) {
      const previous = fieldDecisions[field];
      if (previous.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
        throw new Error(`q37 ${field} expected pending`);
      counts.fieldsPendingSol--;
      pending.splice(pending.indexOf(field), 1);
      fieldDecisions[field] = { ...q37Direct.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q37DirectFile };
      counts.fieldsSolDirectOverride++;
    }
  }
  if (row.queueIndex === 38) {
    if (row.questionUid !== q38Direct.questionUid || row.currentSourceFingerprint !== q38Direct.sourceFingerprint)
      throw new Error('q38 Sol evidence/source drift');
    for (const field of ['l3', 'crossConcepts', 'integrationPattern', 'sourceIssue']) {
      const previous = fieldDecisions[field];
      if (previous.provenance === 'SOL_DIRECT_ADJUDICATION_PENDING') {
        counts.fieldsPendingSol--;
        pending.splice(pending.indexOf(field), 1);
      } else if (field === 'l3' && previous.provenance === 'DUAL_LUNA_MATCH' && previous.value === null)
        counts.fieldsDualMatch--;
      else throw new Error(`q38 ${field} unexpected provenance`);
      fieldDecisions[field] = { ...q38Direct.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q38DirectFile };
      counts.fieldsSolDirectOverride++;
    }
  }
  if (passDirect.has(row.queueIndex)) {
    const decision = passDirect.get(row.queueIndex);
    const evidenceFile = passDirectFiles.get(row.queueIndex);
    if (row.questionUid !== decision.questionUid || row.currentSourceFingerprint !== decision.sourceFingerprint)
      throw new Error(`q${row.queueIndex} Sol PASS evidence/source drift`);
    for (const field of ['sourceIssue', 'reviewStatus']) {
      const previous = fieldDecisions[field];
      if (previous.provenance === 'SOL_DIRECT_ADJUDICATION_PENDING') {
        counts.fieldsPendingSol--;
        pending.splice(pending.indexOf(field), 1);
      } else if (field === 'reviewStatus' && previous.provenance === 'DUAL_LUNA_MATCH'
        && previous.value === 'HOLD') counts.fieldsDualMatch--;
      else throw new Error(`q${row.queueIndex} ${field} unexpected provenance`);
      fieldDecisions[field] = { ...decision.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile };
      counts.fieldsSolDirectOverride++;
    }
  }
  if (row.queueIndex === 47) {
    if (row.questionUid !== q47Direct.questionUid || row.currentSourceFingerprint !== q47Direct.sourceFingerprint)
      throw new Error('q47 Sol evidence/source drift');
    for (const field of ['sourceIssue', 'integrationPattern']) {
      const previous = fieldDecisions[field];
      if (previous.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
        throw new Error(`q47 ${field} expected pending`);
      counts.fieldsPendingSol--;
      pending.splice(pending.indexOf(field), 1);
      fieldDecisions[field] = { ...q47Direct.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q47DirectFile };
      counts.fieldsSolDirectOverride++;
    }
  }
  if (row.queueIndex === 2) {
    if (row.questionUid !== q2Direct.questionUid || row.currentSourceFingerprint !== q2Direct.sourceFingerprint)
      throw new Error('q2 Sol evidence/source drift');
    for (const field of ['crossConcepts', 'integrationPattern']) {
      const previous = fieldDecisions[field];
      if (previous.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
        throw new Error(`q2 ${field} expected pending`);
      counts.fieldsPendingSol--;
      pending.splice(pending.indexOf(field), 1);
      fieldDecisions[field] = { ...q2Direct.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q2DirectFile };
      counts.fieldsSolDirectOverride++;
    }
  }
  if (row.queueIndex === 16) {
    if (row.questionUid !== q16Direct.questionUid || row.currentSourceFingerprint !== q16Direct.sourceFingerprint)
      throw new Error('q16 Sol evidence/source drift');
    for (const field of ['crossConcepts', 'integrationPattern']) {
      const previous = fieldDecisions[field];
      if (previous.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
        throw new Error(`q16 ${field} expected pending`);
      counts.fieldsPendingSol--;
      pending.splice(pending.indexOf(field), 1);
      fieldDecisions[field] = { ...q16Direct.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q16DirectFile };
      counts.fieldsSolDirectOverride++;
    }
  }
  if (row.queueIndex === 25) {
    if (row.questionUid !== q25Direct.questionUid || row.currentSourceFingerprint !== q25Direct.sourceFingerprint)
      throw new Error('q25 Sol evidence/source drift');
    const field = 'crossConcepts';
    const previous = fieldDecisions[field];
    if (previous.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error('q25 cross-concepts expected pending');
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf(field), 1);
    fieldDecisions[field] = { ...q25Direct.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: q25DirectFile };
    counts.fieldsSolDirectOverride++;
  }
  if (row.queueIndex === 29) {
    if (row.questionUid !== q29Direct.questionUid || row.currentSourceFingerprint !== q29Direct.sourceFingerprint)
      throw new Error('q29 Sol integration evidence/source drift');
    const field = 'integrationPattern';
    const previous = fieldDecisions[field];
    if (previous.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error('q29 integration expected pending');
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf(field), 1);
    fieldDecisions[field] = { ...q29Direct.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: q29DirectFile };
    counts.fieldsSolDirectOverride++;
  }
  if (row.queueIndex === 32) {
    if (row.questionUid !== q32Direct.questionUid || row.currentSourceFingerprint !== q32Direct.sourceFingerprint)
      throw new Error('q32 Sol evidence/source drift');
    for (const field of ['crossConcepts', 'integrationPattern']) {
      const previous = fieldDecisions[field];
      if (previous.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
        throw new Error(`q32 ${field} expected pending`);
      counts.fieldsPendingSol--;
      pending.splice(pending.indexOf(field), 1);
      fieldDecisions[field] = { ...q32Direct.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q32DirectFile };
      counts.fieldsSolDirectOverride++;
    }
  }
  if (row.queueIndex === 34) {
    if (row.questionUid !== q34Direct.questionUid || row.currentSourceFingerprint !== q34Direct.sourceFingerprint)
      throw new Error('q34 Sol evidence/source drift');
    for (const field of ['crossConcepts', 'reviewStatus']) {
      const previous = fieldDecisions[field];
      if (previous.provenance === 'SOL_DIRECT_ADJUDICATION_PENDING') {
        counts.fieldsPendingSol--;
        pending.splice(pending.indexOf(field), 1);
      } else if (field === 'reviewStatus' && previous.provenance === 'LUNA_2_OF_3_CONSENSUS'
        && previous.value === 'HOLD') counts.fieldsTwoOfThree--;
      else throw new Error(`q34 ${field} unexpected provenance`);
      fieldDecisions[field] = { ...q34Direct.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q34DirectFile };
      counts.fieldsSolDirectOverride++;
    }
  }
  if (row.queueIndex === 42) {
    if (row.questionUid !== q42Direct.questionUid || row.currentSourceFingerprint !== q42Direct.sourceFingerprint)
      throw new Error('q42 Sol evidence/source drift');
    for (const field of ['l3', 'crossConcepts']) {
      const previous = fieldDecisions[field];
      if (previous.provenance === 'SOL_DIRECT_ADJUDICATION_PENDING') {
        counts.fieldsPendingSol--;
        pending.splice(pending.indexOf(field), 1);
      } else if (field === 'l3' && previous.provenance === 'DUAL_LUNA_MATCH') counts.fieldsDualMatch--;
      else throw new Error(`q42 ${field} unexpected provenance`);
      fieldDecisions[field] = { ...q42Direct.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q42DirectFile };
      counts.fieldsSolDirectOverride++;
    }
  }
  if (row.queueIndex === 49) {
    if (row.questionUid !== q49Direct.questionUid || row.currentSourceFingerprint !== q49Direct.sourceFingerprint)
      throw new Error('q49 Sol evidence/source drift');
    const field = 'crossConcepts';
    const previous = fieldDecisions[field];
    if (previous.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error('q49 cross-concepts expected pending');
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf(field), 1);
    fieldDecisions[field] = { ...q49Direct.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: q49DirectFile };
    counts.fieldsSolDirectOverride++;
  }
  if (row.queueIndex === 45) {
    if (row.questionUid !== q45Hold.questionUid || row.currentSourceFingerprint !== q45Hold.sourceFingerprint)
      throw new Error('q45 Sol HOLD evidence/source drift');
    const field = 'sourceIssue';
    const previous = fieldDecisions[field];
    if (previous.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error('q45 source issue expected pending');
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf(field), 1);
    fieldDecisions[field] = { ...q45Hold.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: q45HoldFile };
    counts.fieldsSolDirectOverride++;
  }
  if (row.queueIndex === 41) {
    if (row.questionUid !== q41Cross.questionUid || row.currentSourceFingerprint !== q41Cross.sourceFingerprint)
      throw new Error('q41 Sol cross-concept evidence/source drift');
    const field = 'crossConcepts';
    const previous = fieldDecisions[field];
    if (previous.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error('q41 cross-concepts expected pending');
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf(field), 1);
    fieldDecisions[field] = { ...q41Cross.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: q41CrossFile };
    counts.fieldsSolDirectOverride++;
  }
  counts.items++;
  if (pending.length) {
    counts.itemsPendingSol++;
    solQueue.push({ queueIndex: row.queueIndex, questionUid: row.questionUid,
      sourceIdentity: row.sourceIdentity, sourceFingerprint: row.currentSourceFingerprint,
      pendingFields: pending, aFile: row.aFile, bFile: row.bFile, cFile: row.currentCFile });
  } else counts.itemsAllFieldsResolvedWorking++;
  candidate.push({ schemaVersion: 1, status: 'WORKING_NOT_FINAL', queueIndex: row.queueIndex,
    questionUid: row.questionUid, sourceIdentity: row.sourceIdentity,
    sourceFingerprint: row.currentSourceFingerprint,
    evidenceFiles: { a: row.aFile, b: row.bFile, c: row.currentCFile },
    fieldDecisions, pendingSolFields: pending, globalTaxonomyReviewPending: true, difficultyPending: true });
}
const writeJsonl = (file, rows) => fs.writeFileSync(path.join(dir, file), rows.map(row => JSON.stringify(row)).join('\n') + '\n');
writeJsonl('H1_STAGEA_FIRST50_WORKING_RELATIONAL_CANDIDATE.jsonl', candidate);
writeJsonl('H1_STAGEA_FIRST50_SOL_DIRECT_FIELD_QUEUE.jsonl', solQueue);
fs.writeFileSync(path.join(dir, 'H1_STAGEA_FIRST50_WORKING_RELATIONAL_SUMMARY.json'),
  JSON.stringify({ schemaVersion: 1, status: 'WORKING_NOT_FINAL', denominator: 50, counts,
    sourceComparison: 'H1_STAGEA_FIRST50_AB_WORKING_COMPARISON_CURRENT.json' }, null, 2) + '\n');
console.log(JSON.stringify(counts, null, 2));
