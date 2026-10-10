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
  const sourcePath = value => String(value ?? '').normalize('NFC').replace(/\\/g, '/').replace(/^\/?(?:archive\/)?exams\//, '').replace(/^\/+/, '');
  const approved = value => /^approved(?:_|$)/i.test(String(value || ''));
  function createSourceBoundDisplayProjection({
    meta = null, identity = null, sourceFile = '', sourceOrdinal = 0, sourceGrade = '',
    sourceFingerprint = '', assignmentFingerprint = '', gradeCourseAllowlist = [],
    scopeParents = [], canonicalParents = [],
  } = {}) {
    const fail = reason => ({ projection: null, reason });
    const file = sourcePath(sourceFile), ordinal = Number(sourceOrdinal);
    if (!meta || !identity || !file || !Number.isInteger(ordinal) || ordinal < 1 || !sourceGrade)
      return fail('DISPLAY_PROJECTION_INPUT_MISSING');
    if (identity.questionUid !== meta.questionUid || !/^qid_v1_[a-f0-9]{64}$/.test(String(meta.questionUid || '')) ||
        sourcePath(identity.sourceArchiveFile) !== file || sourcePath(meta.sourceArchiveFile) !== file ||
        Number(identity.sourceOrdinal) !== ordinal || Number(meta.sourceOrdinal) !== ordinal)
      return fail('DISPLAY_PROJECTION_IDENTITY_MISMATCH');
    if (!sourceFingerprint || meta.sourceFingerprint !== sourceFingerprint ||
        !assignmentFingerprint || meta.contentFingerprint !== assignmentFingerprint)
      return fail('DISPLAY_PROJECTION_FINGERPRINT_MISMATCH');
    if (!String(meta.metadataStatus || '').startsWith('approved_') ||
        !approved(meta.fieldStatus?.standardUnit) || !approved(meta.fieldStatus?.subUnit) ||
        !Array.isArray(meta.approvalEvidence) || !meta.approvalEvidence.some(value => typeof value === 'string' && value.trim()))
      return fail('DISPLAY_PROJECTION_CORE_APPROVAL_MISSING');
    for (const field of ['standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit'])
      if (typeof meta[field] !== 'string' || !meta[field].trim()) return fail('DISPLAY_PROJECTION_CORE_FIELD_MISSING');

    const allowed = gradeCourseAllowlist.filter(row => row.grade === sourceGrade && row.courseKey === meta.standardCourse);
    if (allowed.length !== 1) return fail(allowed.length ? 'DISPLAY_PROJECTION_COURSE_AMBIGUOUS' : 'DISPLAY_PROJECTION_COURSE_NOT_ALLOWED');
    const { curriculumKey, courseKey } = allowed[0];
    const matchingUnit = scopeParents.filter(row => row.grade === sourceGrade &&
      row.curriculumKey === curriculumKey && row.courseKey === courseKey &&
      row.standardUnitKey === meta.standardUnitKey);
    const exact = matchingUnit.filter(row => row.subUnitKey === meta.subUnitKey);
    const parent = matchingUnit.filter(row => !row.subUnitKey);
    const candidates = exact.length ? exact : parent;
    if (!candidates.length) return fail('DISPLAY_PROJECTION_PARENT_MISSING');
    if (candidates.length !== 1) return fail('DISPLAY_PROJECTION_PARENT_AMBIGUOUS');
    const canonical = candidates[0];
    const canonicalMatches = canonicalParents.filter(row => row.curriculumKey === curriculumKey &&
      row.courseKey === courseKey && row.L1 === canonical.L1 && row.L2 === canonical.L2);
    if (canonicalMatches.length !== 1) return fail(canonicalMatches.length ? 'DISPLAY_PROJECTION_CANONICAL_PARENT_AMBIGUOUS' : 'DISPLAY_PROJECTION_CANONICAL_PARENT_MISSING');

    return {
      reason: '',
      projection: {
        projectionStatus: 'DISPLAY_ONLY_SOURCE_BOUND',
        displayOnly: true,
        curriculumKey,
        courseKey,
        standardCourse: meta.standardCourse,
        standardUnitKey: meta.standardUnitKey,
        standardUnit: meta.standardUnit,
        subUnitKey: meta.subUnitKey,
        subUnit: meta.subUnit,
        L1: canonical.L1,
        L2: canonical.L2,
        evidenceByField: {
          rpmL1: { status: 'CONFIRMED' },
          rpmL2: { status: 'CONFIRMED' },
          standardCourse: { status: meta.fieldStatus.standardUnit },
          standardUnitKey: { status: meta.fieldStatus.standardUnit },
          standardUnit: { status: meta.fieldStatus.standardUnit },
          subUnitKey: { status: meta.fieldStatus.subUnit },
          subUnit: { status: meta.fieldStatus.subUnit },
        },
        sourceBinding: {
          questionUid: meta.questionUid,
          sourceFile: file,
          sourceOrdinal: ordinal,
          sourceFingerprint,
          assignmentFingerprint,
          metadataRevision: String(meta.metadataRevision || ''),
          evidenceRefs: [...meta.approvalEvidence],
        },
        parentBinding: {
          standardUnitKey: meta.standardUnitKey,
          matchedSubUnitKey: exact.length ? meta.subUnitKey : '',
          resolution: exact.length ? 'EXACT_CANONICAL_SUBUNIT' : 'CANONICAL_PARENT_LABEL_ONLY',
          L1: canonical.L1,
          L2: canonical.L2,
        },
      },
    };
  }
  function isGeneratedSelectable(row, disabledUids = []) {
    if (!row || row.sourceKind !== 'generated' || (row.consumerSelectable === false && row.mainSourceAvailable !== true) ||
        row.technicalStatus === 'ERROR' || new Set(disabledUids).has(row.uid || row.questionUid)) return false;
    // Main-resident question JS is usable even while its review history is pending.
    // `verifiedEligible` below remains a separate, evidence-backed quality signal.
    return true;
  }
  function project(record, generated, consumer, holds) {
    const q = consumer?.question || {};
    const displayProjection = record.metaProjection?.projectionStatus === 'DISPLAY_ONLY_SOURCE_BOUND' &&
      record.metaProjection?.displayOnly === true ? record.metaProjection : null;
    const m = generated
      ? record.meta || record.metaProjection || consumer?.meta || consumer?.metaProjection || {}
      : displayProjection || {};
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
      else value = own(m, field) ? m[field] : own(m, alias) ? m[alias] : record[alias];
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
    for (const field of ['standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit', 'rpmL4Namespace',
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
    createSourceBoundDisplayProjection,
    isGeneratedSelectable});
});
