(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ProblemBankMeta = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  // A derived view of existing authorities, never a new taxonomy or approval ledger.
  const VERSION = 'PROBLEM_BANK_META_VIEW_V1';
  const FIELDS = Object.freeze(['rpmL1', 'rpmL2', 'rpmL3', 'rpmL4',
    'secondaryConceptKeys', 'crossConceptKeys', 'conditionKeys', 'integrationPattern',
    'problemTypeKey', 'templateKey', 'difficultyBucket']);
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o || {}, k);
  const known = v => v !== undefined && v !== null && v !== '' && v !== 'UNKNOWN';
  const bucket = v => Number.isInteger(v) && v >= 1 && v <= 5 ? v : null;
  function isGeneratedSelectable(row, holds = []) {
    if (!row || row.sourceKind !== 'generated' || row.consumerSelectable !== true ||
        new Set(holds).has(row.uid || row.questionUid)) return false;
    const reviewed = row.approval === 'REVIEW_APPROVED' && row.reviewStatus === 'REVIEW_PASS';
    const directed = row.approval === 'USER_DIRECTED_OPERATING_APPROVED' &&
      (String(row.reviewApprovalBasis || '').startsWith('USER_DIRECTED_OPERATING_APPROVAL_') ||
       row.reviewApprovalBasis === 'USER_EXPLICIT_FIX_AND_MAIN_MERGE_20261008');
    const userQuality = row.approval === 'USER_DIRECTED_QUALITY_APPROVED' &&
      String(row.reviewApprovalBasis || '').startsWith('USER_DIRECTED_QUALITY_APPROVED');
    return reviewed || directed || userQuality;
  }
  function project(record, generated, consumer, holds) {
    const q = consumer?.question || {};
    const m = record.meta || record.metaProjection || consumer?.meta || consumer?.metaProjection || {};
    const view = {...record};
    view.uid = generated ? record.uid : record.questionUid;
    view.questionUid = view.uid;
    view.sourceKind = generated ? 'generated' : record.sourceKind ||
      (String(record.sourceFile || '').startsWith('original/') ? 'original' : 'archive');
    view.storageBucketKey = generated ? record.l2 : null;
    view.metaStatus = {};
    const evidence = m.evidenceByField || record.metaFieldEvidence || {};
    for (const field of FIELDS) {
      const alias = /^rpmL[1-4]$/.test(field) ? field.slice(3) : field;
      let value;
      if (generated) value = own(m, field) ? m[field] : own(q, field) ? q[field] : record[field];
      else value = record[alias];
      if (field === 'difficultyBucket') value = bucket(value);
      else if (field.endsWith('Keys')) {
        if (!Array.isArray(value) || value.some(v => typeof v !== 'string' || !v.trim()) ||
            new Set(value).size !== value.length) value = null;
      } else if (typeof value !== 'string' || !value.trim()) value = null;
      if (!known(value)) value = null;
      view[field] = value;
      if (alias !== field) view[alias] = value;
      const status = evidence[field]?.status;
      view.metaStatus[field] = !known(value) ? 'UNKNOWN' :
        ['STALE', 'INVALID', 'EVIDENCE_DEBT'].includes(status) ? status :
        status === 'CONFIRMED' ? 'CONFIRMED' :
        Array.isArray(value) && value.length === 0 || value === 'NONE' ? 'RECORDED_NOT_APPLICABLE' : 'RECORDED';
    }
    for (const field of ['standardCourse', 'standardUnitKey', 'subUnitKey', 'rpmL4Namespace',
      'rpmPrimaryRecordId', 'familyKey', 'variantGroupKey', 'templateFamilyKey']) {
      view[field] = m[field] ?? record[field] ?? q[field] ?? null;
    }
    view.sourceRelation = generated ? {
      sourceExamPath: record.sourceExamPath ?? consumer?.sourceExamPath ?? null,
      sourceExamBlobSha: record.sourceExamBlobSha ?? consumer?.sourceExamBlobSha ?? null,
      sourceQid: record.sourceQid ?? consumer?.sourceQid ?? null,
      status: (record.sourceExamBlobSha ?? consumer?.sourceExamBlobSha) &&
        (record.sourceQid ?? consumer?.sourceQid) != null ? 'RECORDED' : 'UNKNOWN',
    } : {sourceFile: record.sourceFile ?? null, sourceOrdinal: record.sourceOrdinal ?? null,
      sourceFingerprint: record.sourceFingerprint ?? null, status: record.sourceFingerprint ? 'RECORDED' : 'UNKNOWN'};
    view.metaCompleteness = FIELDS.every(k => known(view[k])) ? 'RECORDED_COMPLETE' : 'EVIDENCE_DEBT';
    const browse = generated && record.metaBrowsePath;
    if (browse?.status === 'EXACT_AUTHORITY_ALIAS' &&
        browse.metaFinalSha256 === record.metaFinalSha256 && record.metaFinalSha256) {
      for (const key of ['L1', 'L2', 'L3', 'L4']) {
        if (typeof browse[key] === 'string' && browse[key].trim()) view[key] = browse[key];
      }
    }
    view.directSelectable = generated ? isGeneratedSelectable(record, holds) : true;
    // Completeness, recorded approval and hash strings alone never certify a paper.
    const verification = record.metaVerification;
    const verificationBindingsCurrent = verification?.metaFinalSha256 === record.metaFinalSha256 &&
      verification?.sourceShardGitSha === record.sourceShardGitSha &&
      verification?.reviewEvidenceSha256 === record.metaReviewEvidenceSha256;
    view.verifiedEligible = view.directSelectable && view.metaCompleteness === 'RECORDED_COMPLETE' &&
      verification?.status === 'VERIFIED_CURRENT_SOURCE' && verification?.sourceBound === true &&
      verification?.reviewBytesBound === true && verificationBindingsCurrent && !Object.values(view.metaStatus)
        .some(s => ['UNKNOWN', 'STALE', 'INVALID', 'EVIDENCE_DEBT'].includes(s));
    view.metaViewVersion = VERSION;
    return view;
  }
  const projectOriginal = record => project(record, false, null, []);
  const projectGenerated = (row, consumer = null, holds = []) => project(row, true, consumer, holds);
  function buildIndex(originalRows = [], generatedRows = [], options = {}) {
    const seen = new Set();
    return [...originalRows.map(projectOriginal), ...generatedRows.map(r =>
      projectGenerated(r, null, options.excludedHoldUids || []))].map(r => {
      if (!r.uid || seen.has(r.uid)) throw new Error('PROBLEM_BANK_DUPLICATE_OR_MISSING_UID:' + r.uid);
      seen.add(r.uid);
      return r;
    });
  }
  function query(records, filters = {}, options = {}) {
    const profile = options.profile || 'DIRECT';
    if (!['DIRECT', 'VERIFIED'].includes(profile)) throw new Error('UNKNOWN_META_PROFILE');
    return records.filter(r => {
      if (profile === 'VERIFIED' ? !r.verifiedEligible : !r.directSelectable) return false;
      for (const field of ['sourceKind', 'standardCourse', 'standardUnitKey', 'subUnitKey',
        'storageBucketKey', 'L1', 'L2', 'L3', 'L4', 'rpmL1', 'rpmL2', 'rpmL3', 'rpmL4',
        'problemTypeKey', 'templateKey']) {
        if (known(filters[field]) && r[field] !== filters[field]) return false;
      }
      if (filters.difficultyBucket === 'UNKNOWN' && r.difficultyBucket !== null) return false;
      if (filters.difficultyBucket !== undefined && filters.difficultyBucket !== 'UNKNOWN' &&
          r.difficultyBucket !== filters.difficultyBucket) return false;
      if (Array.isArray(filters.difficultyBuckets) && filters.difficultyBuckets.length &&
          !filters.difficultyBuckets.includes(r.difficultyBucket ?? 'UNKNOWN')) return false;
      for (const field of ['crossConceptKeys', 'conditionKeys', 'secondaryConceptKeys']) {
        if (Array.isArray(filters[field]) && !filters[field].every(k => r[field]?.includes(k))) return false;
      }
      return true;
    });
  }
  return Object.freeze({VERSION, FIELDS, projectOriginal, projectGenerated, buildIndex, query,
    isGeneratedSelectable});
});
