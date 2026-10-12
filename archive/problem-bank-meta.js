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
    const registrationReview = meta.registrationUpdateState;
    const registrationPending = meta.metadataStatus === 'registration_pending_semantic_review' &&
      ['standardUnit', 'subUnit'].every(field => meta.fieldStatus?.[field] === 'manual_review_pending') &&
      registrationReview?.schemaVersion === 'JS_ARCHIVE_EXISTING_TARGET_META_DELTA_POLICY_V1' &&
      ['PHYSICAL_META_UPDATED_REVIEW_RESET_PENDING', 'R1_RPM_DEBT_EVIDENCE_BOUND_REVIEW_PENDING'].includes(registrationReview?.disposition) &&
      registrationReview?.r1MetaPass === true && typeof registrationReview?.r1EvidenceRef === 'string' &&
      /^[a-f0-9]{64}$/i.test(String(registrationReview?.r1EvidenceSha256 || '')) &&
      /^[a-f0-9]{64}$/i.test(String(registrationReview?.currentPhysicalMetaSha256 || ''));
    const approvedCurrentFields = String(meta.metadataStatus || '').startsWith('approved_') &&
      approved(meta.fieldStatus?.standardUnit) && approved(meta.fieldStatus?.subUnit) &&
      Array.isArray(meta.approvalEvidence) && meta.approvalEvidence.some(value => typeof value === 'string' && value.trim());
    if (!approvedCurrentFields && !registrationPending)
      return fail('DISPLAY_PROJECTION_CORE_APPROVAL_MISSING');
    for (const field of ['standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit'])
      if (typeof meta[field] !== 'string' || !meta[field].trim()) return fail('DISPLAY_PROJECTION_CORE_FIELD_MISSING');

    const courseIdentity = value => String(value || '').normalize('NFC').replace(/\s+/g, '').trim();
    const curriculumIdentity = String(meta.rpmCurriculum || meta.curriculumKey || '').trim();
    const matchingCourses = gradeCourseAllowlist.filter(row => row.grade === sourceGrade && courseIdentity(row.courseKey) === courseIdentity(meta.standardCourse));
    let allowed = curriculumIdentity ? matchingCourses.filter(row => row.curriculumKey === curriculumIdentity) : matchingCourses;
    if (!curriculumIdentity && allowed.length > 1) {
      const exactScope = scopeParents.filter(row => row.grade === sourceGrade && row.standardUnitKey === meta.standardUnitKey
        && (meta.subUnitKey ? row.subUnitKey === meta.subUnitKey : true)
        && matchingCourses.some(course => course.curriculumKey === row.curriculumKey && course.courseKey === row.courseKey));
      const exactCoursePairs = [...new Map(exactScope.map(row => [[row.curriculumKey, row.courseKey].join('\u0000'), row])).values()];
      if (exactCoursePairs.length === 1) allowed = matchingCourses.filter(row => row.curriculumKey === exactCoursePairs[0].curriculumKey && row.courseKey === exactCoursePairs[0].courseKey);
    }
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
    const rpmSourceProjection = meta.rpmProjectionRevision === 'archive-registration-target-source-rpm-projection-v1';
    const rpmDebtProjection = meta.rpmProjectionRevision === 'archive-registration-target-r1-rpm-debt-v1';
    const rpmReviewProjection = rpmSourceProjection || rpmDebtProjection;
    const canonicalMatches = canonicalParents.filter(row => row.curriculumKey === curriculumKey &&
      row.courseKey === courseKey && row.L1 === canonical.L1 && row.L2 === canonical.L2);
    if (!canonicalMatches.length) return fail('DISPLAY_PROJECTION_CANONICAL_PARENT_MISSING');
    if (new Set(canonicalMatches.map(row => JSON.stringify([row.curriculumKey, row.courseKey, row.L1, row.L2]))).size !== 1)
      return fail('DISPLAY_PROJECTION_CANONICAL_PARENT_AMBIGUOUS');

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
        ...(rpmSourceProjection ? Object.fromEntries(FIELDS.filter(field => /^rpmL[1-4]$/.test(field) && own(meta, field)).map(field => [field, meta[field]])) : {}),
        ...(rpmSourceProjection && own(meta, 'rpmCurriculum') ? { rpmCurriculum: meta.rpmCurriculum } : {}),
        ...(rpmReviewProjection && own(meta, 'rpmSemanticStatus') ? { rpmSemanticStatus: meta.rpmSemanticStatus } : {}),
        ...(rpmReviewProjection && own(meta, 'rpmSemanticReason') ? { rpmSemanticReason: meta.rpmSemanticReason } : {}),
        ...(rpmDebtProjection && own(meta, 'rpmEvidenceDebtFields') ? { rpmEvidenceDebtFields: meta.rpmEvidenceDebtFields } : {}),
        ...(rpmReviewProjection ? { rpmProjectionRevision: meta.rpmProjectionRevision } : {}),
        L1: canonical.L1,
        L2: canonical.L2,
        evidenceByField: {
          ...(rpmSourceProjection ? Object.fromEntries(FIELDS.filter(field => /^rpmL[1-4]$/.test(field) && own(meta, field)).map(field => {
            const value = meta[field];
            const semanticStatus = String(meta.rpmSemanticStatus || '').toUpperCase();
            const status = registrationPending && meta.fieldStatus?.rpm === 'manual_review_pending'
              ? ((semanticStatus === 'EVIDENCE_DEBT' && (value === null || value === undefined || String(value).trim() === '')) ? 'EVIDENCE_DEBT' : 'PENDING')
              : value !== null && value !== undefined && String(value).trim() !== ''
                ? (semanticStatus === 'HOLD' ? 'HOLD' : 'CONFIRMED')
              : (semanticStatus === 'EVIDENCE_DEBT' ? 'EVIDENCE_DEBT' : (semanticStatus === 'HOLD' ? 'HOLD' : 'UNKNOWN'));
            return [field, { status, ...(meta.rpmSemanticReason ? { reason: meta.rpmSemanticReason } : {}) }];
          })) : {}),
          ...(rpmDebtProjection ? Object.fromEntries(FIELDS.filter(field => /^rpmL[1-4]$/.test(field)).map(field => {
            const level = field.slice(4);
            const isDebt = (meta.rpmEvidenceDebtFields || []).includes(level);
            const status = isDebt ? 'EVIDENCE_DEBT' : (registrationPending && meta.fieldStatus?.rpm === 'manual_review_pending' ? 'PENDING' : 'UNKNOWN');
            return [field, { status, ...(isDebt && meta.rpmSemanticReason ? { reason: meta.rpmSemanticReason } : {}) }];
          })) : {}),
          standardCourse: { status: registrationPending ? 'PENDING' : meta.fieldStatus.standardUnit },
          standardUnitKey: { status: registrationPending ? 'PENDING' : meta.fieldStatus.standardUnit },
          standardUnit: { status: registrationPending ? 'PENDING' : meta.fieldStatus.standardUnit },
          subUnitKey: { status: registrationPending ? 'PENDING' : meta.fieldStatus.subUnit },
          subUnit: { status: registrationPending ? 'PENDING' : meta.fieldStatus.subUnit },
        },
        sourceBinding: {
          questionUid: meta.questionUid,
          sourceFile: file,
          sourceOrdinal: ordinal,
          sourceFingerprint,
          assignmentFingerprint,
          metadataRevision: String(meta.metadataRevision || ''),
          evidenceRefs: [...(Array.isArray(meta.approvalEvidence) ? meta.approvalEvidence : []), ...(registrationPending ? [registrationReview.r1EvidenceRef] : [])],
          ...(registrationPending ? { registrationReview: { disposition: registrationReview.disposition, r1MetaPass: true, r1EvidenceRef: registrationReview.r1EvidenceRef, r1EvidenceSha256: registrationReview.r1EvidenceSha256, currentPhysicalMetaSha256: registrationReview.currentPhysicalMetaSha256 } } : {}),
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
    const rpmMeta = m.rpmSemanticStatus || m.rpmProjectionRevision ? m : (record.metadataAssignmentEvidence?.rpmMetadata || {});
    const view = {...record};
    view.uid = generated ? record.uid : record.questionUid;
    view.questionUid = view.uid;
    view.sourceKind = generated ? 'generated' : record.sourceKind ||
      (String(record.sourceFile || '').startsWith('original/') ? 'original' : 'archive');
    view.storageBucketKey = generated ? record.l2 : null;
    view.metaStatus = {};
    view.rpmCurriculum = m.rpmCurriculum ?? rpmMeta.rpmCurriculum ?? record.rpmCurriculum ?? q.rpmCurriculum ?? null;
    view.rpmSemanticStatus = m.rpmSemanticStatus ?? rpmMeta.rpmSemanticStatus ?? record.rpmSemanticStatus ?? q.rpmSemanticStatus ?? null;
    view.rpmSemanticReason = m.rpmSemanticReason ?? rpmMeta.rpmSemanticReason ?? record.rpmSemanticReason ?? q.rpmSemanticReason ?? null;
    view.rpmEvidenceDebtFields = m.rpmEvidenceDebtFields ?? rpmMeta.rpmEvidenceDebtFields ?? record.rpmEvidenceDebtFields ?? null;
    const evidence = m.evidenceByField || record.metaFieldEvidence || {};
    for (const field of FIELDS) {
      const alias = /^rpmL[1-4]$/.test(field) ? field.slice(3) : field;
      let value;
      if (generated) value = own(m, field) ? m[field] : own(q, field) ? q[field] : record[field];
      else value = own(m, field) ? m[field] : own(m, alias) ? m[alias] : own(rpmMeta, field) ? rpmMeta[field] : own(record, field) ? record[field] : record[alias];
      if (field === 'difficultyBucket') value = bucket(value);
      else if (field.endsWith('Keys')) {
        if (!Array.isArray(value) || value.some(v => typeof v !== 'string' || !v.trim()) ||
            new Set(value).size !== value.length) value = null;
      } else if (typeof value !== 'string' || !value.trim()) value = null;
      if (!known(value)) value = null;
      view[field] = value;
      if (alias !== field) view[alias] = value;
      const status = evidence[field]?.status;
      const groupByField = {
        standardCourse: 'standardUnit', standardUnitKey: 'standardUnit', standardUnit: 'standardUnit',
        subUnitKey: 'subUnit', subUnit: 'subUnit', difficultyBucket: 'difficulty',
        problemTypeKey: 'problemType', templateKey: 'template', crossConceptKeys: 'crossConcept', conditionKeys: 'condition',
        integrationPattern: 'integrationPattern', secondaryConceptKeys: 'secondaryConcept',
      };
      const pendingGroup = /^rpmL[1-4]$/.test(field) ? 'rpm' : groupByField[field];
      const registrationPending = pendingGroup && record.metadataAssignmentEvidence?.fieldStatus?.[pendingGroup] === 'manual_review_pending';
      const debtLevel = /^rpmL([1-4])$/.exec(field)?.[1];
      const hasExplicitDebtLevels = Array.isArray(view.rpmEvidenceDebtFields);
      const sourceDebt = Boolean(debtLevel && hasExplicitDebtLevels && view.rpmEvidenceDebtFields.includes(`L${debtLevel}`)) ||
        Boolean(debtLevel && !hasExplicitDebtLevels && view.rpmSemanticStatus === 'EVIDENCE_DEBT' && !known(value));
      view.metaStatus[field] = ['STALE', 'INVALID', 'EVIDENCE_DEBT', 'HOLD'].includes(status) ? status : sourceDebt ? 'EVIDENCE_DEBT' : registrationPending ? 'PENDING' : !known(value) ? 'UNKNOWN' :
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
    view.metaCompleteness = FIELDS.every(k => known(view[k])) &&
      !Object.values(view.metaStatus).some(status => ['STALE', 'INVALID', 'EVIDENCE_DEBT', 'HOLD', 'PENDING'].includes(status))
      ? 'RECORDED_COMPLETE' : 'EVIDENCE_DEBT';
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
        .some(s => ['UNKNOWN', 'STALE', 'INVALID', 'EVIDENCE_DEBT', 'HOLD', 'PENDING'].includes(s));
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
      for (const field of ['sourceKind', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'rpmSemanticStatus',
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
