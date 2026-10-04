#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { atomicWrite, blob, ensure, sha } from './common.mjs';
import { parseQuestionBank, sourceFingerprint } from '../meta-foundation/reviewed-apply-core.mjs';
import { checkGuard } from './guard.mjs';

const allowedActions = new Set([
  'EXISTING_L3_L4_MAPPING', 'SVG_REPAIR', 'JS_SOLUTION_REPAIR',
  'SOURCE_RECOVERY', 'UPPER_MODEL_REVIEW', 'TRUE_HOLD',
]);
function stableHash(value, length = 20) {
  return sha(Buffer.from(JSON.stringify(value))).slice(0, length);
}
function rootCause(finding) {
  const reason = String(finding.reasonCode || '').toUpperCase().replaceAll('-', '_').replaceAll(' ', '_');
  if (finding.category === 'META_MAPPING') {
    if (/DIRECT_BINDING_GAP/.test(reason)) return 'RPM_DIRECT_BINDING_GAP';
    if (/FAMILY_BINDING_GAP/.test(reason)) return 'RPM_FAMILY_BINDING_GAP';
    if (/L2_BINDING|EXACT_L2/.test(reason)) return 'RPM_L2_BINDING_MISMATCH';
    if (/RPM_ONLY|CROSSWALK/.test(reason)) return 'RPM_EXISTING_KEY_LOOKUP';
    if (/PROPOSED_NEW_L3/.test(reason)) return 'EXISTING_L3_LOOKUP';
    if (/PROPOSED_NEW_L4/.test(reason)) return 'EXISTING_L4_LOOKUP';
    if (/CROSS_CONCEPT/.test(reason)) return 'EXISTING_CROSS_CONCEPT_LOOKUP';
    return 'META_MAPPING_REVIEW';
  }
  if (finding.category === 'SVG_REPAIR') {
    if (/GEOMETRY|RATIO|PERP|INTERSECTION|ANGLE|LENGTH/.test(reason)) return 'SVG_GEOMETRY_PARITY';
    if (/LABEL|TEXT|GLYPH/.test(reason)) return 'SVG_LABEL_PARITY';
    return 'SVG_REPAIR';
  }
  if (finding.category === 'JS_OR_SOLUTION_REPAIR') {
    if (/ANSWER|KEY/.test(reason)) return 'ANSWER_REPAIR';
    if (/SOLUTION|LOGIC|CALC|REASONING/.test(reason)) return 'SOLUTION_REPAIR';
    return 'JS_FIELD_REPAIR';
  }
  return String(finding.category || 'UNCLASSIFIED_R1_FINDING').toUpperCase();
}
function groupDescriptor(finding) {
  const details = finding.details || [];
  const rpmPrimary = [...new Set(details.map(row => row.rpmPrimary).filter(Boolean))].sort();
  const problemTypeKeys = [...new Set(details.map(row => row.problemTypeKey).filter(Boolean))].sort();
  const templateKeys = [...new Set(details.map(row => row.templateKey).filter(Boolean))].sort();
  const standardUnitKeys = [...new Set(details.map(row => row.standardUnitKey).filter(Boolean))].sort();
  const subUnitKeys = [...new Set(details.map(row => row.subUnitKey).filter(Boolean))].sort();
  return {
    releaseEffect: finding.releaseEffect,
    category: finding.category,
    rootCauseCode: rootCause(finding),
    rpmPrimary: rpmPrimary.length <= 1 ? rpmPrimary[0] || null : rpmPrimary,
    problemTypeKeys,
    templateKeys,
    standardUnitKeys,
    subUnitKeys,
  };
}
function findIdentity(identityBySource, examFile, ordinal) {
  if (!ordinal) return null;
  const sourceArchiveFile = examFile.replace(/^archive\/exams\//, '');
  return identityBySource.get(sourceArchiveFile + '#' + ordinal) || null;
}
function readMetaLookups(repo, baseMainSha) {
  const taxonomyPath = 'archive/data/meta-foundation/compiled/taxonomy_registry.json';
  const taxonomyBytes = blob(repo, baseMainSha, taxonomyPath);
  const taxonomy = JSON.parse(taxonomyBytes.toString('utf8'));
  const bindingsPath = 'archive/data/meta-foundation/compiled/curriculum_bindings.json';
  const bindingsBytes = blob(repo, baseMainSha, bindingsPath);
  const bindings = JSON.parse(bindingsBytes.toString('utf8'));
  const activeKeyCatalog = {
    sourceRef: { path: taxonomyPath, sha256: sha(taxonomyBytes), inputCommit: baseMainSha },
    bindingsRef: { path: bindingsPath, sha256: sha(bindingsBytes), inputCommit: baseMainSha },
    problemTypes: (taxonomy.problemTypes || []).filter(row => row.status === 'ACTIVE').map(row => ({
      key: row.problemTypeKey, label: row.canonicalLabelKo, aliases: row.aliases || [],
      sourceUnit: row.sourceUnit || null, ownerPack: row.ownerPack || null,
    })),
    templates: (taxonomy.templates || []).filter(row => row.status === 'ACTIVE').map(row => ({
      key: row.templateKey, label: row.canonicalLabelKo, aliases: row.aliases || [],
      parentProblemTypeKey: row.parentProblemTypeKey, sourceUnit: row.sourceUnit || null, ownerPack: row.ownerPack || null,
    })),
    activeMiddleBindings: (bindings.bindings || []).filter(row => row.status === 'ACTIVE' && /^M[23]-/.test(String(row.standardUnitKey || ''))).map(row => ({
      problemTypeKey: row.problemTypeKey, curriculum: row.curriculum, standardCourse: row.standardCourse,
      standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey, ownerPack: row.ownerPack,
    })),
  };
  const crosswalks = {};
  for (const [grade, file] of [['m2', 'middle2.json'], ['m3', 'middle3.json']]) {
    const crosswalkPath = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/' + file;
    const bytes = blob(repo, baseMainSha, crosswalkPath);
    const data = JSON.parse(bytes.toString('utf8'));
    crosswalks[grade] = {
      sourceRef: { path: crosswalkPath, sha256: sha(bytes), inputCommit: baseMainSha },
      byRpmId: new Map((data.records || []).map(row => [row.id, row])),
    };
  }
  return { activeKeyCatalog, crosswalks };
}
function sourceQuestionSnapshot(candidate, ordinal, identity) {
  if (!ordinal) return null;
  const cacheKey = candidate.inputCommit + ':' + candidate.examFile;
  let bank = questionBankCache.get(cacheKey);
  if (!bank) {
    const bytes = blob(candidate.repo, candidate.inputCommit, candidate.examFile);
    bank = parseQuestionBank(bytes.toString('utf8'), candidate.examFile);
    questionBankCache.set(cacheKey, bank);
  }
  const q = bank[ordinal - 1];
  if (!q || Number(q.id) !== ordinal) return null;
  return {
    questionUid: identity && identity.questionUid || null,
    sourceOrdinal: ordinal,
    sourceFingerprint: sourceFingerprint(q),
    content: q.content || '',
    choices: q.choices || [],
    answer: q.answer || '',
    solution: q.solution || '',
    image: q.image || null,
    solutionImage: q.solutionImage || null,
  };
}
function indexIdentity(snapshot, repo) {
  const bytes = blob(repo, snapshot.baseMainSha, 'archive/data/question_identity_map.json');
  const identity = JSON.parse(bytes.toString('utf8'));
  const bySource = new Map(), byUid = new Map();
  for (const row of identity.records || []) {
    const key = String(row.sourceArchiveFile).replaceAll('\\', '/') + '#' + Number(row.sourceOrdinal);
    ensure(!bySource.has(key), 'IDENTITY_SOURCE_DUPLICATE:' + key);
    ensure(!byUid.has(row.questionUid), 'IDENTITY_UID_DUPLICATE:' + row.questionUid);
    bySource.set(key, row);
    byUid.set(row.questionUid, row);
  }
  return { bySource, byUid };
}
const questionBankCache = new Map();
function buildInventory(snapshot, repo) {
  ensure(snapshot.schemaVersion === 'R2E_REPAIR_RELEASE_SNAPSHOT_v2', 'R2E_V2_SNAPSHOT_REQUIRED');
  const identityMaps = indexIdentity(snapshot, repo);
  const metaLookups = readMetaLookups(repo, snapshot.baseMainSha);
  const exams = [];
  const itemsByKey = new Map();
  for (const candidate of snapshot.candidates || []) {
    const r1 = candidate.r1Authority;
    ensure(r1 && r1.readOnly === true && r1.examUid === candidate.examUid, 'R1_READ_ONLY_AUTHORITY_REQUIRED:' + candidate.examUid);
    const sourceArchiveFile = candidate.examFile.replace(/^archive\/exams\//, '');
    const identityFor = ordinal => findIdentity(identityMaps.bySource, candidate.examFile, ordinal);
    const normalizedFindings = [];
    for (const original of r1.findings || []) {
      let ordinal = Number.isSafeInteger(original.ordinal) && original.ordinal > 0 ? original.ordinal : null;
      const explicitUidRow = original.questionUid ? identityMaps.byUid.get(original.questionUid) : null;
      if (!ordinal && explicitUidRow) ordinal = Number(explicitUidRow.sourceOrdinal);
      const identity = identityFor(ordinal);
      const uidMismatch = Boolean(original.questionUid && identity && original.questionUid !== identity.questionUid);
      const questionUid = original.questionUid || identity && identity.questionUid || null;
      const details = original.details || [];
      const normalized = {
        ...original,
        questionUid,
        ordinal,
        identityStatus: questionUid ? 'VERIFIED_BY_SOURCE_FILE_AND_ORDINAL' : 'MISSING_UID',
        inputBranch: candidate.intakeBranch,
        inputCommit: candidate.inputCommit,
        examFile: candidate.examFile,
        examUid: candidate.examUid,
        groupId: null,
        upperModelCaseId: null,
        status: 'COLLECTED',
        question: ordinal ? sourceQuestionSnapshot({ ...candidate, repo }, ordinal, identity) : null,
        details,
      };
      if (!questionUid && normalized.category !== 'R1_AUTHORITY_INCOMPLETE') {
        normalized.releaseEffect = 'RELEASE_BLOCKING';
        normalized.category = 'UID_IDENTITY_MISSING';
        normalized.reasonCode = 'R1_FINDING_UID_CANNOT_BE_BOUND';
      } else if (uidMismatch) {
        normalized.releaseEffect = 'RELEASE_BLOCKING';
        normalized.category = 'UID_IDENTITY_CONFLICT';
        normalized.reasonCode = 'R1_UID_DISAGREES_WITH_SOURCE_FILE_ORDINAL';
      }
      const descriptor = groupDescriptor(normalized);
      const descriptorJson = JSON.stringify(descriptor);
      const groupId = 'grp_' + stableHash(descriptor);
      normalized.groupId = groupId;
      const key = [candidate.examUid, questionUid || 'NO_UID', ordinal || 'NO_ORDINAL', normalized.category, normalized.reasonCode].join('|');
      const existing = itemsByKey.get(key);
      if (existing) {
        existing.evidenceRefs = [...new Map([...existing.evidenceRefs, ...(normalized.evidenceRefs || [])].map(ref => [ref.path + '#' + ref.sha256, ref])).values()];
        existing.details.push(...details);
        continue;
      }
      normalized.descriptorJson = descriptorJson;
      normalized.findingId = normalized.findingId || 'hold_' + stableHash({ examUid: candidate.examUid, questionUid, ordinal, category: normalized.category, reasonCode: normalized.reasonCode });
      normalized.recommendedAction = normalized.releaseEffect === 'META_ONLY' ? 'BATCH_EXISTING_META_MAPPING'
        : normalized.category === 'SVG_REPAIR' ? 'SVG_REPAIR'
          : normalized.category === 'JS_OR_SOLUTION_REPAIR' ? 'MINIMAL_JS_SOLUTION_REPAIR'
            : normalized.category === 'UNCLASSIFIED_R1_FINDING' ? 'UPPER_MODEL_REVIEW' : 'TARGETED_SOURCE_REVIEW';
      if (normalized.category === 'R1_AUTHORITY_INCOMPLETE') {
        normalized.status = 'R1_AUTHORITY_INCOMPLETE';
      } else if (normalized.category === 'UNCLASSIFIED_R1_FINDING' || normalized.category === 'UID_IDENTITY_MISSING') {
        normalized.upperModelCaseId = 'case_' + stableHash({ examUid: candidate.examUid, questionUid, ordinal, findingId: normalized.findingId });
        normalized.status = 'UPPER_MODEL_REVIEW';
      } else {
        normalized.status = normalized.releaseEffect === 'META_ONLY' ? 'GROUP_REVIEW_REQUIRED' : 'REPAIR_REQUIRED';
      }
      itemsByKey.set(key, normalized);
      normalizedFindings.push(normalized.findingId);
    }
    exams.push({
      examUid: candidate.examUid, grade: candidate.grade, examFile: candidate.examFile,
      inputBranch: candidate.intakeBranch, inputCommit: candidate.inputCommit, intakeHead: candidate.intakeHead,
      denominator: candidate.denominator, examJsSha256: candidate.examJsSha256, inputSha256: candidate.inputSha256,
      r1Receipt: { path: r1.receiptPath, sha256: r1.receiptSha256, readerOnly: true },
      r1Evidence: r1.r1Evidence, metaAuthority: r1.metaAuthority, metaOnlyFindings: r1.metaOnlyFindings,
      metaDispositionSummary: r1.metaDispositionSummary || {},
      holdFindingIds: normalizedFindings,
    });
  }

  const items = [...itemsByKey.values()].sort((a, b) => a.examUid.localeCompare(b.examUid) || (a.ordinal || 0) - (b.ordinal || 0) || a.findingId.localeCompare(b.findingId));
  const itemByFindingId = new Map(items.map(item => [item.findingId, item]));
  const grouped = new Map();
  for (const item of items) {
    const key = item.groupId;
    if (!grouped.has(key)) grouped.set(key, {
      groupId: key, descriptor: JSON.parse(item.descriptorJson), status: 'NEEDS_BATCH_ADJUDICATION',
      findingIds: [], memberQuestionUids: [], memberExams: [],
      selectedExistingKeys: [], decisionId: null, uidApplications: [],
    });
    const group = grouped.get(key);
    group.findingIds.push(item.findingId);
    if (item.questionUid) group.memberQuestionUids.push(item.questionUid);
    group.memberExams.push(item.examUid);
    for (const detail of item.details) {
      for (const field of ['problemTypeKey', 'templateKey']) if (detail[field]) group.selectedExistingKeys.push(detail[field]);
    }
  }
  const groups = [...grouped.values()].map(group => ({
    ...group,
    memberQuestionUids: [...new Set(group.memberQuestionUids)].sort(),
    memberExams: [...new Set(group.memberExams)].sort(),
    selectedExistingKeys: [...new Set(group.selectedExistingKeys)].sort(),
    findingIds: [...new Set(group.findingIds)].sort(),
    rpmCrosswalkRecords: [...new Map(group.findingIds.flatMap(id => {
      const item = itemByFindingId.get(id);
      const crosswalk = item && metaLookups.crosswalks[item.inputBranch.replace('work/intake/', '')];
      return (item?.details || []).map(detail => detail.rpmPrimary).filter(Boolean).map(rpmId => {
        const row = crosswalk && crosswalk.byRpmId.get(rpmId);
        return row ? [rpmId, { ...row, evidenceRef: crosswalk.sourceRef }] : null;
      }).filter(Boolean);
    })).values()],
  })).sort((a, b) => a.groupId.localeCompare(b.groupId));
  const upperModelCases = items.filter(item => item.status === 'UPPER_MODEL_REVIEW').map(item => ({
    caseId: item.upperModelCaseId, examUid: item.examUid, examFile: item.examFile,
    questionUid: item.questionUid, ordinal: item.ordinal, releaseEffect: item.releaseEffect,
    category: item.category, reasonCode: item.reasonCode, reason: item.details.map(x => x.reason).filter(Boolean).join(' | '),
    evidenceRefs: item.evidenceRefs, question: item.question,
  }));
  const summary = {
    examCount: exams.length, denominator: exams.reduce((sum, exam) => sum + exam.denominator, 0),
    holdItemCount: items.length, groupCount: groups.length,
    releaseBlockingCount: items.filter(x => x.releaseEffect === 'RELEASE_BLOCKING').length,
    metaOnlyCount: items.filter(x => x.releaseEffect === 'META_ONLY').length,
    upperModelCaseCount: upperModelCases.length,
    ungroupedItemCount: items.filter(x => !x.groupId && !x.upperModelCaseId).length,
    undecidedGroupCount: groups.filter(x => x.status !== 'DECIDED').length,
    metaOnlyPendingCount: items.filter(x => x.releaseEffect === 'META_ONLY' && !x.outcome).length,
    holdBatchStatus: groups.length ? 'NEEDS_GROUP_DECISIONS' : 'CLASSIFIED',
  };
  return {
    schemaVersion: 'R2E_HOLD_INVENTORY_v2', runId: snapshot.runId || null,
    baseMainSha: snapshot.baseMainSha, intakeHeads: snapshot.heads, stateHead: snapshot.stateHead,
    authorityMode: 'R1_READ_ONLY', activeKeyCatalog: metaLookups.activeKeyCatalog, exams, items, groups, upperModelCases, summary,
  };
}
function validateDecisions(inventory, decisions, repo) {
  const errors = [], groupErrors = {};
  const pushError = (groupId, code) => {
    errors.push(code);
    if (groupId) { groupErrors[groupId] ||= []; groupErrors[groupId].push(code); }
  };
  const groupById = new Map(inventory.groups.map(group => [group.groupId, group]));
  const itemById = new Map(inventory.items.map(item => [item.findingId, item]));
  const seenItems = new Map();
  const seenGroups = new Set();
  if (decisions.schemaVersion !== 'R2E_HOLD_GROUP_DECISIONS_v2') errors.push('GROUP_DECISION_SCHEMA_INVALID');
  const taxonomy = JSON.parse(fs.readFileSync(path.join(repo, 'archive/data/meta-foundation/compiled/taxonomy_registry.json'), 'utf8'));
  const problemTypes = new Map((taxonomy.problemTypes || []).filter(row => row.status === 'ACTIVE').map(row => [row.problemTypeKey, row]));
  const templates = new Map((taxonomy.templates || []).filter(row => row.status === 'ACTIVE').map(row => [row.templateKey, row]));
  for (const decision of decisions.groups || []) {
    if (seenGroups.has(decision.groupId)) { pushError(decision.groupId, 'GROUP_DECISION_DUPLICATE:' + decision.groupId); continue; }
    seenGroups.add(decision.groupId);
    const group = groupById.get(decision.groupId);
    if (!group) { pushError(decision.groupId, 'UNKNOWN_GROUP:' + decision.groupId); continue; }
    if (!allowedActions.has(decision.action)) pushError(decision.groupId, 'GROUP_ACTION_INVALID:' + decision.groupId);
    const decisionId = String(decision.decisionId || '');
    if (!decisionId) pushError(decision.groupId, 'GROUP_DECISION_ID_REQUIRED:' + decision.groupId);
    if (!String(decision.reason || '').trim()) pushError(decision.groupId, 'GROUP_DECISION_REASON_REQUIRED:' + decision.groupId);
    if (!Array.isArray(decision.evidenceRefs) || !decision.evidenceRefs.length) pushError(decision.groupId, 'GROUP_EVIDENCE_REQUIRED:' + decision.groupId);
    const keys = decision.selectedExistingKeys || [];
    if (decision.action === 'EXISTING_L3_L4_MAPPING') {
      if (!keys.length) pushError(decision.groupId, 'EXISTING_KEYS_REQUIRED:' + decision.groupId);
      for (const key of keys) if (!problemTypes.has(key) && !templates.has(key)) pushError(decision.groupId, 'EXISTING_KEY_NOT_ACTIVE:' + decision.groupId + ':' + key);
      const selectedProblemTypes = new Set(keys.filter(key => problemTypes.has(key)));
      for (const key of keys) {
        const template = templates.get(key);
        if (template && template.parentProblemTypeKey && !problemTypes.has(template.parentProblemTypeKey)) pushError(decision.groupId, 'EXISTING_TEMPLATE_PARENT_INACTIVE:' + decision.groupId + ':' + key);
        if (template && selectedProblemTypes.size && !selectedProblemTypes.has(template.parentProblemTypeKey)) pushError(decision.groupId, 'EXISTING_TEMPLATE_PARENT_MISMATCH:' + decision.groupId + ':' + key);
      }
    }
    const applications = decision.uidApplications || [];
    const memberFindings = new Set(group.findingIds);
    const applied = new Set();
    for (const row of applications) {
      if (!memberFindings.has(row.findingId)) pushError(decision.groupId, 'UID_APPLICATION_OUTSIDE_GROUP:' + decision.groupId + ':' + row.findingId);
      if (applied.has(row.findingId)) pushError(decision.groupId, 'UID_APPLICATION_DUPLICATE:' + decision.groupId + ':' + row.findingId);
      applied.add(row.findingId);
      const item = itemById.get(row.findingId);
      if (!item || row.questionUid !== item.questionUid || Number(row.ordinal) !== item.ordinal) pushError(decision.groupId, 'UID_APPLICATION_IDENTITY_MISMATCH:' + row.findingId);
      if (!String(row.reason || '').trim()) pushError(decision.groupId, 'UID_APPLICATION_REASON_REQUIRED:' + row.findingId);
      if (!Array.isArray(row.evidenceRefs) || !row.evidenceRefs.length) pushError(decision.groupId, 'UID_APPLICATION_EVIDENCE_REQUIRED:' + row.findingId);
      if (decision.action === 'EXISTING_L3_L4_MAPPING') {
        const appliedKeys = row.appliedExistingKeys || [];
        if (row.outcome === 'MAPPED_EXISTING' && (!appliedKeys.length || appliedKeys.some(key => !keys.includes(key))) ) pushError(decision.groupId, 'UID_APPLICATION_KEY_MISMATCH:' + row.findingId);
        if (row.outcome !== 'MAPPED_EXISTING' && appliedKeys.length) pushError(decision.groupId, 'NONMAPPED_UID_HAS_SELECTED_KEYS:' + row.findingId);
      }
      if (!['MAPPED_EXISTING', 'GROUP_RESOLVED', 'REPAIRED', 'VERIFIED_NO_CHANGE', 'UPPER_MODEL_REVIEW', 'TRUE_HOLD'].includes(row.outcome)) pushError(decision.groupId, 'UID_APPLICATION_OUTCOME_INVALID:' + row.findingId);
      if (seenItems.has(row.findingId)) pushError(decision.groupId, 'UID_APPLICATION_MULTI_GROUP:' + row.findingId);
      seenItems.set(row.findingId, { decisionId, groupId: decision.groupId, outcome: row.outcome, appliedExistingKeys: row.appliedExistingKeys || [] });
    }
    const missing = group.findingIds.filter(id => !applied.has(id));
    if (missing.length) pushError(decision.groupId, 'GROUP_UID_APPLICATION_MISSING:' + decision.groupId + ':' + missing.join(','));
  }
  for (const group of inventory.groups) if (!seenGroups.has(group.groupId)) pushError(group.groupId, 'GROUP_DECISION_MISSING:' + group.groupId);
  if (decisions.schemaVersion !== 'R2E_HOLD_GROUP_DECISIONS_v2') for (const group of inventory.groups) {
    groupErrors[group.groupId] ||= [];
    groupErrors[group.groupId].push('GROUP_DECISION_SCHEMA_INVALID');
  }
  const groupStatusById = Object.fromEntries(inventory.groups.map(group => [group.groupId,
    seenGroups.has(group.groupId) ? groupErrors[group.groupId]?.length ? 'DECISION_INVALID' : 'DECIDED' : 'NEEDS_BATCH_ADJUDICATION']));
  return { status: errors.length ? 'FAIL' : 'PASS', errors, groupStatusById, applicationsByFindingId: Object.fromEntries(seenItems) };
}
function attachDecisions(inventory, decisions, repo) {
  const checked = validateDecisions(inventory, decisions, repo);
  const applications = checked.applicationsByFindingId || {};
  for (const group of inventory.groups) {
    const decision = (decisions.groups || []).find(row => row.groupId === group.groupId);
    if (decision) {
      group.status = checked.groupStatusById[group.groupId] || 'DECISION_INVALID';
      group.decisionId = decision.decisionId || null;
      group.action = decision.action || null;
      group.reason = decision.reason || null;
      group.evidenceRefs = decision.evidenceRefs || [];
      group.selectedExistingKeys = decision.selectedExistingKeys || [];
      group.uidApplications = decision.uidApplications || [];
    }
  }
  for (const item of inventory.items) {
    const application = applications[item.findingId];
    if (application) {
      item.groupId = application.groupId;
      item.decisionId = application.decisionId;
      item.outcome = application.outcome;
      item.appliedExistingKeys = application.appliedExistingKeys;
      item.status = application.outcome;
      if (application.outcome === 'UPPER_MODEL_REVIEW') {
        const caseId = 'case_' + stableHash({ findingId: item.findingId, decisionId: application.decisionId });
        item.upperModelCaseId = caseId;
        if (!inventory.upperModelCases.some(row => row.caseId === caseId)) inventory.upperModelCases.push({
          caseId, examUid: item.examUid, examFile: item.examFile, questionUid: item.questionUid,
          ordinal: item.ordinal, releaseEffect: item.releaseEffect, category: item.category,
          reasonCode: item.reasonCode, reason: item.details.map(x => x.reason).filter(Boolean).join(' | '),
          evidenceRefs: item.evidenceRefs, question: item.question, decisionId: application.decisionId,
        });
      } else item.upperModelCaseId = null;
    }
  }
  const referencedCases = new Set(inventory.items.map(item => item.upperModelCaseId).filter(Boolean));
  inventory.upperModelCases = inventory.upperModelCases.filter(row => referencedCases.has(row.caseId));
  inventory.decisionValidation = checked;
  inventory.summary.decidedCount = Object.keys(applications).length;
  inventory.summary.decisionStatus = checked.status;
  inventory.summary.undecidedGroupCount = inventory.groups.filter(group => group.status !== 'DECIDED').length;
  inventory.summary.metaOnlyPendingCount = inventory.items.filter(item => item.releaseEffect === 'META_ONLY' && !item.outcome).length;
  inventory.summary.upperModelPendingCount = inventory.items.filter(item => item.outcome === 'UPPER_MODEL_REVIEW').length;
  inventory.summary.holdBatchStatus = checked.status === 'PASS' ? 'CLASSIFIED' : inventory.summary.undecidedGroupCount ? 'NEEDS_GROUP_DECISIONS' : 'DECISION_INVALID';
  return inventory;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), opt = key => { const index = args.indexOf('--' + key); return index < 0 ? null : args[index + 1]; };
  try {
    const repo = path.resolve(opt('repo') || '.');
    const runId = opt('run-id');
    checkGuard(repo, runId);
    const snapshot = JSON.parse(fs.readFileSync(opt('snapshot'), 'utf8'));
    const inventory = buildInventory(snapshot, repo);
    const decisionPath = opt('decisions');
    const output = decisionPath ? attachDecisions(inventory, JSON.parse(fs.readFileSync(decisionPath, 'utf8')), repo) : inventory;
    ensure(opt('out'), 'HOLD_INVENTORY_OUTPUT_REQUIRED');
    atomicWrite(path.resolve(opt('out')), JSON.stringify(output, null, 2) + '\n');
    checkGuard(repo, runId);
    console.log(JSON.stringify({ status: output.decisionValidation ? output.decisionValidation.status : 'INVENTORY_READY', summary: output.summary, out: opt('out') }, null, 2));
    if (output.decisionValidation && output.decisionValidation.status !== 'PASS') process.exitCode = 1;
  } catch (error) { console.log(JSON.stringify({ status: 'FAIL', reason: error.message })); process.exitCode = 1; }
}
