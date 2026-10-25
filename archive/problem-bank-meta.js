(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ProblemBankMeta = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  // A derived view of existing authorities, never a new taxonomy or approval ledger.
  const VERSION = 'PROBLEM_BANK_META_VIEW_V1';
  const queryCandidatesByIndex = new WeakMap();
  const FIELDS = Object.freeze(['rpmL1', 'rpmL2', 'rpmL3', 'rpmL4',
    'secondaryConceptKeys', 'crossConceptKeys', 'conditionKeys', 'integrationPattern',
    'problemTypeKey', 'templateKey', 'difficultyBucket', 'nativeCurriculum', 'nativeL1', 'nativeL2', 'nativeL3', 'nativeL4']);
  const GENERATED_FIELDS = Object.freeze(FIELDS.filter(field =>
    !['nativeCurriculum', 'nativeL1', 'nativeL2', 'nativeL3', 'nativeL4'].includes(field)));
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o || {}, k);
  const known = v => v !== undefined && v !== null && v !== '' && v !== 'UNKNOWN';
  const bucket = v => Number.isInteger(v) && v >= 1 && v <= 5 ? v : null;
  const sourcePath = value => String(value ?? '').normalize('NFC').replace(/\\/g, '/').replace(/^\/?(?:archive\/)?exams\//, '').replace(/^\/+/, '');
  const approved = value => /^approved(?:_|$)/i.test(String(value || ''));
  const ORIGINAL_H1_META_FIELDS = Object.freeze([
    'curriculum', 'standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit',
    'problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys',
    'integrationPattern', 'level', 'difficultyBucket', 'nativeL1', 'nativeL2',
    'nativeCurriculum', 'nativeL3', 'nativeL4', 'nativeTaxonomyPath', 'nativeTaxonomyAuthority', 'rpmMapping',
    'registrationPackId', 'registrationPackVersion', 'sourceJsSha256', 'difficultyConfidence', 'difficultyReason', 'classificationEvidence',
  ]);
  const ORIGINAL_H1_REVIEW_FIELD_ALIASES = Object.freeze({
    'nativeL1-L4': ['nativeL1', 'nativeL2', 'nativeL3', 'nativeL4'],
    'RPM L1-L4': ['rpmMapping'], 'RPM mapping status': ['rpmMapping'],
    'positive/negative criteria': ['classificationEvidence'],
    'authority pack and binding': ['nativeTaxonomyAuthority'],
  });
  const RPM_LOCKED_MASTER_SHA256 = 'c8de39f9946e221538100880e3e0932fcfa10ac907c6a68079e560feb16c394c';
  const ORIGINAL_H1_OWNER_PACKS = Object.freeze({
    FUNCTIONS_GRAPHS: '1.0.2', H1_FOUNDATION: '1.0.0', H1_ORIGINAL_SOURCE: '1.0.0', MIDDLE1: '1.0.1',
    GEOMETRY_EQUATIONS: '1.0.2', SETS_PROPOSITIONS: '1.0.0', PROBABILITY_STATISTICS: '1.0.0',
  });
  const sha256 = value => /^[a-f0-9]{64}$/i.test(String(value || ''));
  function hasReviewedOriginalH1Evidence(meta, identity, file, ordinal, sourceFingerprint, assignmentFingerprint) {
    const evidence = meta?.reviewedOriginalMetaEvidence;
    if (!evidence || evidence.schemaVersion !== 'reviewed-original-exam-meta-v1' ||
        evidence.metadataRevision !== 'meta-foundation:H1_ORIGINAL_SOURCE@1.0.0:reviewed-v1' ||
        meta.metadataRevision !== evidence.metadataRevision || meta.metaFoundationStatus !== 'ACTIVE' ||
        meta.registrationPackId !== 'H1_ORIGINAL_SOURCE' || String(meta.registrationPackVersion) !== '1.0.0' ||
        !/^archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/.+\.json$/.test(evidence.manifestPath || '') ||
        !sha256(evidence.manifestSha256) || !sha256(evidence.sourceJsSha256) ||
        evidence.sourceJsSha256 !== meta.sourceJsSha256 ||
        meta.reviewStatus !== 'reviewed_pass' || meta.metadataStatus !== 'approved_exam_meta_source' ||
        identity?.questionUid !== meta.questionUid || sourcePath(identity?.sourceArchiveFile) !== file ||
        sourcePath(meta.sourceArchiveFile) !== file || Number(identity?.sourceOrdinal) !== ordinal || Number(meta.sourceOrdinal) !== ordinal ||
        !sourceFingerprint || meta.sourceFingerprint !== sourceFingerprint || !assignmentFingerprint ||
        meta.contentFingerprint !== assignmentFingerprint || evidence.reviewWitnesses?.length !== 2 ||
        !Array.isArray(meta.crossConceptKeys) || !Array.isArray(meta.conditionKeys) ||
        !['NONE', 'SEQUENTIAL', 'INTERDEPENDENT', 'REINTERPRETATION', 'CASE_BRANCH', 'DEEP_COMPOSITE'].includes(meta.integrationPattern) ||
        !['CONFIRMED', 'EVIDENCE_DEBT'].includes(meta.nativeMetaStatus) ||
        !meta.classificationEvidence || !String(meta.classificationEvidence.positiveCriterion || '').trim() ||
        !String(meta.classificationEvidence.negativeCriterion || '').trim() ||
        (meta.nativeMetaStatus === 'CONFIRMED' && (
          !['하', '중', '상'].includes(meta.level) || !Number.isInteger(meta.difficultyBucket) || meta.difficultyBucket < 1 || meta.difficultyBucket > 5 ||
          !['nativeL1', 'nativeL2', 'nativeL3', 'nativeL4', 'nativeTaxonomyPath'].every(field => String(meta[field] || '').trim()) ||
          !String(meta.difficultyConfidence || '').trim()
        )) ||
        !meta.nativeTaxonomyAuthority || meta.nativeTaxonomyAuthority.registrationPackId !== 'H1_ORIGINAL_SOURCE' ||
        String(meta.nativeTaxonomyAuthority.registrationPackVersion) !== '1.0.0' ||
        !Object.hasOwn(ORIGINAL_H1_OWNER_PACKS, meta.nativeTaxonomyAuthority.packId) ||
        String(meta.nativeTaxonomyAuthority.packVersion) !== ORIGINAL_H1_OWNER_PACKS[meta.nativeTaxonomyAuthority.packId] ||
        !Object.hasOwn(ORIGINAL_H1_OWNER_PACKS, meta.nativeTaxonomyAuthority.ownerPack) ||
        String(meta.nativeTaxonomyAuthority.ownerPackVersion) !== ORIGINAL_H1_OWNER_PACKS[meta.nativeTaxonomyAuthority.ownerPack] ||
        meta.nativeTaxonomyAuthority.taxonomyOwnerPack !== meta.nativeTaxonomyAuthority.ownerPack ||
        String(meta.nativeTaxonomyAuthority.taxonomyOwnerPackVersion) !== ORIGINAL_H1_OWNER_PACKS[meta.nativeTaxonomyAuthority.taxonomyOwnerPack] ||
        (meta.templateKey && (!Object.hasOwn(ORIGINAL_H1_OWNER_PACKS, meta.nativeTaxonomyAuthority.templateOwnerPack) ||
          String(meta.nativeTaxonomyAuthority.templateOwnerPackVersion) !== ORIGINAL_H1_OWNER_PACKS[meta.nativeTaxonomyAuthority.templateOwnerPack])) ||
        !Object.hasOwn(ORIGINAL_H1_OWNER_PACKS, meta.nativeTaxonomyAuthority.bindingOwnerPack) ||
        String(meta.nativeTaxonomyAuthority.bindingOwnerPackVersion) !== ORIGINAL_H1_OWNER_PACKS[meta.nativeTaxonomyAuthority.bindingOwnerPack] ||
        !['EXISTING_ACTIVE_BINDING', 'SOURCE_EXTENSION_ACTIVE_BINDING'].includes(meta.nativeTaxonomyAuthority.bindingDisposition) ||
        meta.nativeTaxonomyAuthority.standardUnitKey !== meta.standardUnitKey ||
        meta.nativeTaxonomyAuthority.subUnitKey !== meta.subUnitKey ||
        meta.nativeTaxonomyAuthority.problemTypeKey !== meta.problemTypeKey ||
        meta.nativeTaxonomyAuthority.templateKey !== meta.templateKey ||
        !meta.rpmMapping || meta.rpmMapping.authority !== 'RPM_LOCKED' ||
        (meta.rpmMapping.lockedMasterSha256 || meta.rpmMapping.masterSha256) !== RPM_LOCKED_MASTER_SHA256 ||
        !Array.isArray(meta.rpmMapping.lockedRowIds) || !String(meta.rpmMapping.status || '').trim()) return false;
    const roles = new Set();
    for (const witness of evidence.reviewWitnesses) {
      if (!witness || !['AUTHOR_META_REVIEW', 'INDEPENDENT_META'].includes(witness.role) || witness.status !== 'PASS' ||
          roles.has(witness.role) || !String(witness.reviewerIdentity || '').trim() || !String(witness.ref || '').trim() ||
          !sha256(witness.sha256) || !sha256(witness.artifactRawSha256) || witness.questionUid !== meta.questionUid ||
          witness.sourceJsSha256 !== evidence.sourceJsSha256 ||
          witness.sourceFingerprint !== sourceFingerprint || witness.contentFingerprint !== assignmentFingerprint ||
          !Array.isArray(witness.fieldsReviewed)) return false;
      const coveredFields = new Set();
      for (const field of witness.fieldsReviewed) {
        if (ORIGINAL_H1_META_FIELDS.includes(field)) coveredFields.add(field);
        for (const expanded of ORIGINAL_H1_REVIEW_FIELD_ALIASES[field] || []) coveredFields.add(expanded);
      }
      if (!ORIGINAL_H1_META_FIELDS.every(field => coveredFields.has(field))) return false;
      roles.add(witness.role);
    }
    return roles.size === 2;
  }
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
    const reviewedH1 = hasReviewedOriginalH1Evidence(meta, identity, file, ordinal, sourceFingerprint, assignmentFingerprint);
    if (!approvedCurrentFields && !registrationPending && !reviewedH1)
      return fail('DISPLAY_PROJECTION_CORE_APPROVAL_MISSING');
    for (const field of ['standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit'])
      if (typeof meta[field] !== 'string' || !meta[field].trim()) return fail('DISPLAY_PROJECTION_CORE_FIELD_MISSING');

    const courseIdentity = value => String(value || '').normalize('NFC').replace(/\s+/g, '').trim();
    const curriculumIdentity = String(meta.rpmCurriculum || meta.curriculumKey || meta.curriculum || '').trim();
    const matchingCourses = gradeCourseAllowlist.filter(row => row.grade === sourceGrade && courseIdentity(row.courseKey) === courseIdentity(meta.standardCourse));
    let allowed = curriculumIdentity ? matchingCourses.filter(row => row.curriculumKey === curriculumIdentity) : matchingCourses;
    // Original H1 source classifications may use an active native course whose
    // basic RPM browse-parent table has no exact row. The reviewed source pack
    // explicitly owns these course names; this fallback grants only the
    // source-bound native display projection and never fills legacy L1-L4.
    if (!allowed.length && reviewedH1 && meta.curriculum === '2015' &&
        ['수학(상)', '수학(하)', '중1 수학'].includes(meta.standardCourse)) {
      allowed = [{ curriculumKey: '2015', courseKey: meta.standardCourse }];
    }
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
    if (!reviewedH1 && !candidates.length) return fail('DISPLAY_PROJECTION_PARENT_MISSING');
    if (!reviewedH1 && candidates.length !== 1) return fail('DISPLAY_PROJECTION_PARENT_AMBIGUOUS');
    const canonical = candidates.length === 1 ? candidates[0] : null;
    const rpmSourceProjection = meta.rpmProjectionRevision === 'archive-registration-target-source-rpm-projection-v1';
    const rpmDebtProjection = meta.rpmProjectionRevision === 'archive-registration-target-r1-rpm-debt-v1';
    const rpmReviewProjection = rpmSourceProjection || rpmDebtProjection;
    const canonicalMatches = reviewedH1 ? [] : canonicalParents.filter(row => row.curriculumKey === curriculumKey &&
      row.courseKey === courseKey && row.L1 === canonical.L1 && row.L2 === canonical.L2);
    if (!reviewedH1 && !canonicalMatches.length) return fail('DISPLAY_PROJECTION_CANONICAL_PARENT_MISSING');
    if (!reviewedH1 && new Set(canonicalMatches.map(row => JSON.stringify([row.curriculumKey, row.courseKey, row.L1, row.L2]))).size !== 1)
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
        ...(reviewedH1 ? {
          problemTypeKey: meta.problemTypeKey, templateKey: meta.templateKey,
          crossConceptKeys: meta.crossConceptKeys, conditionKeys: meta.conditionKeys,
          integrationPattern: meta.integrationPattern, difficultyBucket: meta.difficultyBucket,
          level: meta.level, nativeCurriculum: meta.curriculum,
          nativeL1: meta.nativeL1, nativeL2: meta.nativeL2, nativeL3: meta.nativeL3, nativeL4: meta.nativeL4,
          nativeTaxonomyPath: meta.nativeTaxonomyPath,
          nativeTaxonomyAuthority: meta.nativeTaxonomyAuthority,
          nativeMetaStatus: meta.nativeMetaStatus,
          difficultyConfidence: meta.difficultyConfidence || '',
          difficultyReason: meta.difficultyReason || '',
          rpmMapping: meta.rpmMapping,
          reviewedOriginalMetaEvidence: meta.reviewedOriginalMetaEvidence,
        } : {}),
        ...(rpmSourceProjection ? Object.fromEntries(FIELDS.filter(field => /^rpmL[1-4]$/.test(field) && own(meta, field)).map(field => [field, meta[field]])) : {}),
        ...(rpmSourceProjection && own(meta, 'rpmCurriculum') ? { rpmCurriculum: meta.rpmCurriculum } : {}),
        ...(rpmReviewProjection && own(meta, 'rpmSemanticStatus') ? { rpmSemanticStatus: meta.rpmSemanticStatus } : {}),
        ...(rpmReviewProjection && own(meta, 'rpmSemanticReason') ? { rpmSemanticReason: meta.rpmSemanticReason } : {}),
        ...(rpmDebtProjection && own(meta, 'rpmEvidenceDebtFields') ? { rpmEvidenceDebtFields: meta.rpmEvidenceDebtFields } : {}),
        ...(rpmReviewProjection ? { rpmProjectionRevision: meta.rpmProjectionRevision } : {}),
        ...(!reviewedH1 ? { L1: canonical.L1, L2: canonical.L2 } : {}),
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
          ...(reviewedH1 ? Object.fromEntries(ORIGINAL_H1_META_FIELDS.map(field => [field, {
            status: ['crossConceptKeys', 'conditionKeys'].includes(field) && meta[field].length === 0
              ? 'RECORDED_NOT_APPLICABLE' : (meta[field] === '' || meta[field] == null ? 'UNKNOWN' : 'CONFIRMED'),
          }])) : {}),
        },
        sourceBinding: {
          questionUid: meta.questionUid,
          sourceFile: file,
          sourceOrdinal: ordinal,
          sourceFingerprint,
          assignmentFingerprint,
          metadataRevision: String(meta.metadataRevision || ''),
          evidenceRefs: [...(Array.isArray(meta.approvalEvidence) ? meta.approvalEvidence : []),
            ...(reviewedH1 ? meta.reviewedOriginalMetaEvidence.reviewWitnesses.map(witness => witness.ref) : []),
            ...(registrationPending ? [registrationReview.r1EvidenceRef] : [])],
          ...(reviewedH1 ? {
            sourceJsSha256: meta.reviewedOriginalMetaEvidence.sourceJsSha256,
            catalogSourceJsSha256: meta.catalogSourceJsSha256 || '',
            manifestPath: meta.reviewedOriginalMetaEvidence.manifestPath,
            manifestSha256: meta.reviewedOriginalMetaEvidence.manifestSha256,
            reviewWitnesses: meta.reviewedOriginalMetaEvidence.reviewWitnesses,
          } : {}),
          ...(registrationPending ? { registrationReview: { disposition: registrationReview.disposition, r1MetaPass: true, r1EvidenceRef: registrationReview.r1EvidenceRef, r1EvidenceSha256: registrationReview.r1EvidenceSha256, currentPhysicalMetaSha256: registrationReview.currentPhysicalMetaSha256 } } : {}),
        },
        parentBinding: {
          standardUnitKey: meta.standardUnitKey,
          matchedSubUnitKey: exact.length ? meta.subUnitKey : '',
          resolution: reviewedH1 ? 'SOURCE_BOUND_NATIVE_TAXONOMY' : exact.length ? 'EXACT_CANONICAL_SUBUNIT' : 'CANONICAL_PARENT_LABEL_ONLY',
          ...(reviewedH1 ? { nativeL1: meta.nativeL1, nativeL2: meta.nativeL2 } : { L1: canonical.L1, L2: canonical.L2 }),
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
    const typedDisplayProjection = record.metaProjection?.projectionStatus === 'DISPLAY_ONLY_SOURCE_BOUND' &&
      record.metaProjection?.displayOnly === true ? record.metaProjection : null;
    const nativeSourceProjection = typedDisplayProjection?.nativeTaxonomyAuthority?.registrationPackId === 'H1_ORIGINAL_SOURCE';
    const reviewedOriginalSourceRecord = String(record.metadataAssignmentEvidence?.metadataRevision || record.metadataRevision || '') ===
      'meta-foundation:H1_ORIGINAL_SOURCE@1.0.0:reviewed-v1';
    const staleNativeSourceProjection = Boolean(reviewedOriginalSourceRecord && (!nativeSourceProjection ||
      !sha256(record.currentSourceJsSha256) ||
      !sha256(typedDisplayProjection.sourceBinding?.catalogSourceJsSha256) ||
      record.currentSourceJsSha256 !== typedDisplayProjection.sourceBinding?.catalogSourceJsSha256));
    const displayProjection = staleNativeSourceProjection ? null : typedDisplayProjection;
    const m = generated
      ? record.meta || record.metaProjection || consumer?.meta || consumer?.metaProjection || {}
      : displayProjection || {};
    const rpmMeta = m.rpmSemanticStatus || m.rpmProjectionRevision ? m : (record.metadataAssignmentEvidence?.rpmMetadata || {});
    const registeredProjection = record.reviewedExamRegistration?.schemaVersion === 'archive-reviewed-exam-registration-projection-v2' &&
      record.reviewedExamRegistration.sourceJsSha256 === record.currentSourceJsSha256 &&
      record.reviewedExamRegistration.metadataRevision === record.metadataRevision &&
      record.assignmentEvidence?.reviewEvidence?.reference === record.reviewedExamRegistration.reference &&
      record.assignmentEvidence?.reviewEvidence?.sha256 === record.reviewedExamRegistration.sha256;
    const metaPipelineRegistration = registeredProjection && record.reviewedExamRegistration?.approvalType === 'META_PIPELINE_AUDIT';
    const nativeOriginalProjection = registeredProjection || (displayProjection?.nativeTaxonomyAuthority?.registrationPackId === 'H1_ORIGINAL_SOURCE' &&
      String(displayProjection.nativeTaxonomyAuthority.registrationPackVersion) === '1.0.0');
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
      else if (staleNativeSourceProjection) value = null;
      else value = own(m, field) ? m[field] : (!nativeOriginalProjection && own(m, alias)) ? m[alias] :
        own(rpmMeta, field) ? rpmMeta[field] : own(record, field) ? record[field] : (!nativeOriginalProjection ? record[alias] : undefined);
      if (field === 'difficultyBucket') value = bucket(value);
      else if (field.endsWith('Keys')) {
        if (!Array.isArray(value) || value.some(v => typeof v !== 'string' || !v.trim()) ||
            new Set(value).size !== value.length) value = null;
      } else if (typeof value !== 'string' || !value.trim()) value = null;
      if (!known(value)) value = null;
      view[field] = value;
      if (alias !== field) view[alias] = metaPipelineRegistration
        ? (known(record[alias]) ? record[alias] : known(m[alias]) ? m[alias] : value)
        : value;
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
      view.metaStatus[field] = staleNativeSourceProjection ? 'STALE' : ['STALE', 'INVALID', 'EVIDENCE_DEBT', 'HOLD'].includes(status) ? status : sourceDebt ? 'EVIDENCE_DEBT' : registrationPending ? 'PENDING' : !known(value) ? 'UNKNOWN' :
        status === 'CONFIRMED' ? 'CONFIRMED' :
        Array.isArray(value) && value.length === 0 || value === 'NONE' ? 'RECORDED_NOT_APPLICABLE' : 'RECORDED';
    }
    for (const field of ['standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit', 'rpmL4Namespace',
      'rpmPrimaryRecordId', 'familyKey', 'variantGroupKey', 'templateFamilyKey']) {
      view[field] = m[field] ?? record[field] ?? q[field] ?? null;
    }
    for (const field of ['nativeTaxonomyPath', 'nativeTaxonomyAuthority', 'nativeMetaStatus',
      'difficultyConfidence', 'difficultyReason', 'rpmMapping', 'reviewedOriginalMetaEvidence', 'level']) {
      view[field] = m[field] ?? (registeredProjection ? record[field] : null) ?? null;
    }
    if (staleNativeSourceProjection) {
      for (const field of ['standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit',
        'nativeCurriculum', 'nativeTaxonomyPath', 'nativeTaxonomyAuthority', 'nativeMetaStatus', 'difficultyConfidence',
        'difficultyReason', 'rpmMapping', 'reviewedOriginalMetaEvidence', 'level']) view[field] = null;
      view.metaProjectionStatus = 'SOURCE_META_STALE_OR_UNAVAILABLE';
    }
    view.sourceRelation = generated ? {
      sourceExamPath: record.sourceExamPath ?? consumer?.sourceExamPath ?? null,
      sourceExamBlobSha: record.sourceExamBlobSha ?? consumer?.sourceExamBlobSha ?? null,
      sourceQid: record.sourceQid ?? consumer?.sourceQid ?? null,
      status: (record.sourceExamBlobSha ?? consumer?.sourceExamBlobSha) &&
        (record.sourceQid ?? consumer?.sourceQid) != null ? 'RECORDED' : 'UNKNOWN',
    } : {sourceFile: record.sourceFile ?? null, sourceOrdinal: record.sourceOrdinal ?? null,
      sourceFingerprint: record.sourceFingerprint ?? null, status: record.sourceFingerprint ? 'RECORDED' : 'UNKNOWN'};
    const completenessFields = generated ? GENERATED_FIELDS : FIELDS;
    view.metaCompleteness = completenessFields.every(k => known(view[k])) &&
      !completenessFields.some(field => ['STALE', 'INVALID', 'EVIDENCE_DEBT', 'HOLD', 'PENDING'].includes(view.metaStatus[field]))
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
      verification?.reviewBytesBound === true && verificationBindingsCurrent && !completenessFields
        .some(field => ['UNKNOWN', 'STALE', 'INVALID', 'EVIDENCE_DEBT', 'HOLD', 'PENDING'].includes(view.metaStatus[field]));
    view.metaViewVersion = VERSION;
    return view;
  }
  const projectOriginal = record => project(record, false, null, []);
  const projectGenerated = (row, consumer = null, holds = []) => project(row, true, consumer, holds);
  // A projection failure must name the source row, not only the UID: an empty UID
  // otherwise hides which exam question broke identity inclusion.
  const sourceRowLocator = row => {
    const file = sourcePath(row?.sourceFile ?? row?.sourceArchiveFile ?? row?.sourceExamPath);
    const ordinal = Number(row?.sourceOrdinal);
    if (!file) return 'source:unavailable';
    return Number.isInteger(ordinal) && ordinal > 0 ? `${file}#${ordinal}` : file;
  };
  function buildIndex(originalRows = [], generatedRows = [], options = {}) {
    const sources = [...originalRows, ...generatedRows];
    const seenAt = new Map();
    const rows = [...originalRows.map(projectOriginal), ...generatedRows.map(r =>
      projectGenerated(r, null, options.excludedHoldUids || []))].map((r, index) => {
      const locator = sourceRowLocator(sources[index]);
      if (!r.uid)
        throw new Error(`PROBLEM_BANK_DUPLICATE_OR_MISSING_UID:EMPTY_UID@${locator}`);
      if (seenAt.has(r.uid))
        throw new Error(`PROBLEM_BANK_DUPLICATE_OR_MISSING_UID:${r.uid}@${locator} (already indexed at ${seenAt.get(r.uid)})`);
      seenAt.set(r.uid, locator);
      return r;
    });
    const byField = new Map();
    for (const field of ['L1', 'L2', 'L3', 'L4', 'rpmL1', 'rpmL2', 'rpmL3', 'rpmL4', 'difficultyBucket']) {
      const values = new Map();
      for (const row of rows) {
        const value = row[field];
        if (value === undefined || value === null) continue;
        let candidates = values.get(value);
        if (!candidates) values.set(value, candidates = []);
        candidates.push(row);
      }
      byField.set(field, values);
    }
    queryCandidatesByIndex.set(rows, byField);
    return rows;
  }
  function query(records, filters = {}, options = {}) {
    const profile = options.profile || 'DIRECT';
    if (!['DIRECT', 'VERIFIED'].includes(profile)) throw new Error('UNKNOWN_META_PROFILE');
    const byField = queryCandidatesByIndex.get(records);
    let candidates = records;
    if (byField) {
      let smallest = null;
      for (const field of ['L1', 'L2', 'L3', 'L4', 'rpmL1', 'rpmL2', 'rpmL3', 'rpmL4', 'difficultyBucket']) {
        const value = filters[field];
        if (!known(value)) continue;
        const indexed = byField.get(field)?.get(value) || [];
        if (!indexed.length) return [];
        if (!smallest || indexed.length < smallest.length) smallest = indexed;
      }
      const buckets = filters.difficultyBuckets;
      if (Array.isArray(buckets) && buckets.length) {
        const indexed = [...new Set(buckets.flatMap(value => byField.get('difficultyBucket')?.get(value) || []))];
        if (!indexed.length) return [];
        if (!smallest || indexed.length < smallest.length) smallest = indexed;
      }
      if (smallest) candidates = smallest;
    }
    return candidates.filter(r => {
      if (profile === 'VERIFIED' ? !r.verifiedEligible : !r.directSelectable) return false;
      for (const field of ['sourceKind', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'rpmSemanticStatus',
        'storageBucketKey', 'L1', 'L2', 'L3', 'L4', 'rpmL1', 'rpmL2', 'rpmL3', 'rpmL4',
        'problemTypeKey', 'templateKey', 'integrationPattern', 'level', 'nativeCurriculum', 'nativeL1', 'nativeL2', 'nativeL3', 'nativeL4']) {
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
