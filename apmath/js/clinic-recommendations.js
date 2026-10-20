(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.ClinicRecommendations = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const CONTRACT_VERSION = 'apms-clinic-recommendations-v1';
    const META_SCHEMA_VERSION = 'apms-blueprint-meta-snapshot-v1';
    const CANONICAL_UID_RE = /^qid_v1_[0-9a-f]{64}$/;
    const PATH_FIELDS = Object.freeze(['curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4']);
    const REQUIRED_PATH_FIELDS = Object.freeze(['curriculumKey', 'courseKey', 'L1', 'L2']);
    const followUpFactsBySnapshot = new WeakMap();
    const CANONICAL_META_FIELDS = Object.freeze([
        ...PATH_FIELDS,
        'secondaryConceptKeys', 'problemTypeKey', 'templateKey', 'crossConceptKeys',
        'conditionKeys', 'integrationPattern', 'foundationTaxonomyStatus', 'rpmPathStatus',
        'metaFoundationHoldReason', 'metaFoundationPackVersion', 'curriculumApplicability',
        'defaultSelectable', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag',
        'legacyLevelCompatibility', 'tagConfidence', 'tagStatus', 'reviewStatus',
        'sourceQualityDisposition', 'sourceIssueHold', 'sourceDefectCandidate',
        'basicSemanticDisposition', 'semanticDisposition', 'metadataRevision',
    ]);
    const PRE_ENVELOPE_FROZEN_META_FIELDS = Object.freeze([
        ...PATH_FIELDS,
        'secondaryConceptKeys', 'curriculumApplicability', 'defaultSelectable',
        'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag',
        'legacyLevelCompatibility', 'reviewStatus', 'metadataRevision', 'archiveMetadata',
    ]);

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function positiveInteger(value) {
        const number = Number(value);
        return Number.isInteger(number) && number > 0 ? number : null;
    }

    function recommendationOptionsOf(input) {
        const hasOptions = own(input, 'recommendationOptions');
        const options = object(input?.recommendationOptions);
        const hasNestedCount = own(options, 'countPerStudent');
        const hasLegacyCount = own(input, 'countPerStudent');
        const requestedCount = hasNestedCount ? options.countPerStudent
            : hasLegacyCount ? input.countPerStudent : 5;
        const countPerStudent = Number(requestedCount);
        const errors = [];
        if (hasOptions && (!input.recommendationOptions || typeof input.recommendationOptions !== 'object' || Array.isArray(input.recommendationOptions))) {
            errors.push({
                code: 'invalid_recommendation_options',
                field: 'recommendationOptions',
                message: 'recommendationOptions must be an object.',
            });
        }
        if (!Number.isInteger(countPerStudent) || countPerStudent < 1 || countPerStudent > 400) {
            errors.push({
                code: 'invalid_count_per_student',
                field: hasNestedCount ? 'recommendationOptions.countPerStudent' : 'countPerStudent',
                message: 'countPerStudent must be an integer from 1 to 400.',
            });
        }

        const hasDifficultyMode = own(options, 'difficultyMode');
        const difficultyMode = hasDifficultyMode ? text(options.difficultyMode) : 'match_wrong';
        if (difficultyMode !== 'match_wrong' && difficultyMode !== 'selected') {
            errors.push({
                code: 'invalid_difficulty_mode',
                field: 'recommendationOptions.difficultyMode',
                message: 'difficultyMode must be match_wrong or selected.',
            });
        }

        const rawBuckets = options.selectedDifficultyBuckets;
        const selectedDifficultyBuckets = [];
        if (difficultyMode === 'selected') {
            if (!Array.isArray(rawBuckets) || rawBuckets.length === 0) {
                errors.push({
                    code: 'selected_difficulty_buckets_required',
                    field: 'recommendationOptions.selectedDifficultyBuckets',
                    message: 'selected mode requires one or more difficulty buckets from 1 to 5.',
                });
            } else {
                for (const bucket of rawBuckets) {
                    if (!Number.isInteger(bucket) || bucket < 1 || bucket > 5) {
                        errors.push({
                            code: 'invalid_selected_difficulty_bucket',
                            field: 'recommendationOptions.selectedDifficultyBuckets',
                            value: bucket,
                            message: 'Selected difficulty buckets must be integers from 1 to 5.',
                        });
                        continue;
                    }
                    if (!selectedDifficultyBuckets.includes(bucket)) selectedDifficultyBuckets.push(bucket);
                }
                if (!selectedDifficultyBuckets.length && !errors.some(error => error.code === 'invalid_selected_difficulty_bucket')) {
                    errors.push({
                        code: 'selected_difficulty_buckets_required',
                        field: 'recommendationOptions.selectedDifficultyBuckets',
                        message: 'selected mode requires one or more difficulty buckets from 1 to 5.',
                    });
                }
            }
        } else if (own(options, 'selectedDifficultyBuckets') && !Array.isArray(rawBuckets)) {
            errors.push({
                code: 'invalid_selected_difficulty_buckets',
                field: 'recommendationOptions.selectedDifficultyBuckets',
                message: 'selectedDifficultyBuckets must be an array.',
            });
        }

        return {
            normalized: {
                countPerStudent: Number.isInteger(countPerStudent) && countPerStudent >= 1 && countPerStudent <= 400
                    ? countPerStudent : null,
                difficultyMode,
                selectedDifficultyBuckets,
            },
            errors,
        };
    }

    function object(value) {
        return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    }

    function parseJson(value) {
        if (value && typeof value === 'object' && !Array.isArray(value)) return value;
        if (typeof value !== 'string' || !value.trim()) return {};
        try {
            return object(JSON.parse(value));
        } catch {
            return {};
        }
    }

    function normalizeFile(value) {
        return text(value)
            .normalize('NFC')
            .replace(/\\/g, '/')
            .replace(/^\.\//, '')
            .replace(/^archive\//, '')
            .replace(/^\/+/, '');
    }

    function own(row, key) {
        return Object.prototype.hasOwnProperty.call(row || {}, key);
    }

    function firstValue(row, keys) {
        for (const key of keys) {
            if (row && row[key] != null && text(row[key])) return row[key];
        }
        return null;
    }

    function metadataJsonOf(row) {
        return row?.metadata_json ?? row?.metadataJson ?? null;
    }

    function envelopeOf(row) {
        const envelope = parseJson(metadataJsonOf(row));
        return envelope.schemaVersion === META_SCHEMA_VERSION ? envelope : {};
    }

    function isRecognizedPreEnvelopeSnapshot(row, raw) {
        // Exact compatibility for the frozen flat writer at
        // 3c8324e9^:apmath/worker-backup/worker/helpers/archive2-questions.js::buildQuestionSnapshot.
        // That writer emitted this bounded field set and row-level identity,
        // revision, and hash provenance. Arbitrary unversioned JSON is not canonical.
        if (raw.schemaVersion || !REQUIRED_PATH_FIELDS.every(field => text(raw[field]))) return false;
        if (!Object.keys(raw).every(field => PRE_ENVELOPE_FROZEN_META_FIELDS.includes(field))) return false;
        const archiveMetadata = raw.archiveMetadata;
        if (!archiveMetadata || typeof archiveMetadata !== 'object' || Array.isArray(archiveMetadata) || !Object.keys(archiveMetadata).length)
            return false;
        if (!firstValue(row, ['metadata_revision', 'metadataRevision']) ||
            !firstValue(row, ['metadata_hash', 'metadataHash'])) return false;
        return identityOf(row).verified;
    }

    function canonicalMetaOf(row, { candidate = false } = {}) {
        const raw = parseJson(metadataJsonOf(row));
        const envelope = raw.schemaVersion === META_SCHEMA_VERSION ? raw : {};
        if (Object.keys(object(envelope.canonicalMeta)).length) return object(envelope.canonicalMeta);
        if (Object.keys(object(row?.canonicalMeta)).length) return object(row.canonicalMeta);
        if (!candidate && isRecognizedPreEnvelopeSnapshot(row, raw)) {
            const output = {};
            for (const field of PRE_ENVELOPE_FROZEN_META_FIELDS) {
                if (field !== 'archiveMetadata' && own(raw, field)) output[field] = raw[field];
            }
            return output;
        }
        if (!candidate) return {};
        // Archive2 candidate records carry canonical fields directly. Do not
        // project archiveMetadata, authoringMeta, difficulty, or level here.
        const output = {};
        for (const field of CANONICAL_META_FIELDS) if (own(row, field)) output[field] = row[field];
        return output;
    }

    function identityOf(row) {
        const envelope = envelopeOf(row);
        const envelopeIdentity = object(envelope.sourceIdentity);
        const sourceFile = normalizeFile(firstValue(row, [
            'source_archive_file', 'sourceArchiveFile', 'sourceFile', 'source_file'
        ]) || firstValue(envelopeIdentity, ['sourceArchiveFile', 'normalizedSourceFile']));
        const sourceOrdinal = positiveInteger(firstValue(row, [
            'source_question_ordinal', 'sourceQuestionOrdinal', 'sourceOrdinal', 'source_ordinal'
        ]) ?? firstValue(envelopeIdentity, ['sourceQuestionOrdinal']));
        const sourceQuestionNo = positiveInteger(firstValue(row, [
            'source_question_no', 'sourceQuestionNo', 'questionNo', 'question_no'
        ]) ?? firstValue(envelopeIdentity, ['sourceQuestionNo']));
        const questionUid = text(firstValue(row, [
            'source_question_uid', 'sourceQuestionUid', 'question_uid', 'questionUid', 'uid'
        ]) || firstValue(envelopeIdentity, ['sourceQuestionUid']));
        const status = text(firstValue(row, [
            'source_identity_status', 'sourceIdentityStatus', 'identityStatus', 'resolution_status'
        ]) || envelopeIdentity.status).toUpperCase();
        const fingerprint = text(firstValue(row, [
            'source_fingerprint', 'sourceFingerprint'
        ]) || envelopeIdentity.sourceFingerprint);
        const envelopeFile = normalizeFile(firstValue(envelopeIdentity, ['normalizedSourceFile', 'sourceArchiveFile']));
        const envelopeOrdinal = positiveInteger(envelopeIdentity.sourceQuestionOrdinal);
        const envelopeUid = text(envelopeIdentity.sourceQuestionUid);
        const envelopeMatches = !envelopeFile || envelopeFile === sourceFile;
        const envelopeOrdinalMatches = envelopeOrdinal == null || envelopeOrdinal === sourceOrdinal;
        const envelopeUidMatches = !envelopeUid || envelopeUid === questionUid;
        const verified = status === 'VERIFIED' &&
            CANONICAL_UID_RE.test(questionUid) && Boolean(sourceFile) &&
            sourceOrdinal != null &&
            envelopeMatches && envelopeOrdinalMatches && envelopeUidMatches;
        return {
            sourceFile,
            sourceOrdinal,
            sourceQuestionNo,
            questionUid,
            fingerprint,
            status: verified ? 'VERIFIED' : 'UNRESOLVED',
            verified,
        };
    }

    function canonicalPath(meta) {
        const path = {};
        for (const field of PATH_FIELDS) {
            const value = text(meta?.[field]);
            if (value) path[field] = value;
        }
        if (REQUIRED_PATH_FIELDS.some(field => !path[field])) return null;
        if (path.L4 && !path.L3) return null;
        const depth = path.L4 ? 6 : path.L3 ? 5 : 4;
        return {
            path,
            depth,
            key: JSON.stringify(PATH_FIELDS.slice(0, depth).map(field => path[field] || '')),
        };
    }

    function canonicalBucket(meta) {
        const value = meta?.difficultyBucket;
        return Number.isInteger(value) && value >= 1 && value <= 5 ? value : null;
    }

    function metadataSnapshotStatusOf(row) {
        const explicit = text(firstValue(row, ['metadata_snapshot_status', 'metadataSnapshotStatus'])).toUpperCase();
        const snapshot = parseJson(metadataJsonOf(row));
        const snapshotStatus = text(snapshot.metadataSnapshotStatus || snapshot.captureStatus).toUpperCase();
        if (explicit && snapshotStatus && explicit !== snapshotStatus) return 'UNRESOLVED';
        if (explicit || snapshotStatus) return explicit || snapshotStatus;
        return isRecognizedPreEnvelopeSnapshot(row, snapshot) ? 'CAPTURED' : 'UNRESOLVED';
    }

    function followUpSnapshotFactsOf(row) {
        if (row && typeof row === 'object' && followUpFactsBySnapshot.has(row)) return followUpFactsBySnapshot.get(row);
        const meta = canonicalMetaOf(row);
        const facts = {
            identity: identityOf(row),
            path: canonicalPath(meta),
            difficultyBucket: canonicalBucket(meta),
            metadataSnapshotStatus: metadataSnapshotStatusOf(row),
        };
        if (row && typeof row === 'object') followUpFactsBySnapshot.set(row, facts);
        return facts;
    }

    function freezeDeep(value) {
        if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
        Object.freeze(value);
        Object.keys(value).forEach(key => freezeDeep(value[key]));
        return value;
    }

    function sessionDate(session) {
        return text(session?.exam_date || session?.examDate || session?.created_at || session?.createdAt || session?.updated_at || session?.updatedAt);
    }

    function sessionIdOf(row) {
        return text(row?.session_id || row?.sessionId || row?.id);
    }

    function studentIdOf(row) {
        return text(row?.student_id || row?.studentId);
    }

    function orderNoOf(row) {
        return positiveInteger(row?.order_no ?? row?.orderNo ?? row?.question_no ?? row?.questionNo ?? row?.question_id);
    }

    function resultOutcome(row) {
        const status = text(row?.result_status || row?.resultStatus).toLowerCase();
        const rawFlag = row?.is_correct ?? row?.isCorrect;
        const correctFlag = rawFlag === 0 || rawFlag === '0' ? 0
            : rawFlag === 1 || rawFlag === '1' ? 1 : null;
        if ((status === 'wrong' && correctFlag === 1) ||
            (status === 'correct' && correctFlag === 0) ||
            (['partial', 'unchecked'].includes(status) && correctFlag != null)) return 'conflict';
        if (status === 'wrong' || correctFlag === 0) return 'wrong';
        if (status === 'correct' || correctFlag === 1) return 'correct';
        if (status === 'partial' || status === 'unchecked') return status;
        return 'unknown';
    }

    function hasFrozenSnapshot(row) {
        if (!row) return false;
        const envelope = envelopeOf(row);
        return Boolean(
            row.source_identity_status || row.sourceIdentityStatus || row.resolution_status ||
            row.source_question_uid || row.sourceQuestionUid || row.question_uid ||
            row.metadata_snapshot_status || row.metadataSnapshotStatus ||
            row.metadata_revision || row.metadataRevision || row.metadata_hash || row.metadataHash ||
            metadataJsonOf(row) || Object.keys(envelope).length
        );
    }

    function snapshotFor(session, orderNo, resultByOrder, assignmentByOrder) {
        const result = resultByOrder.get(orderNo) || null;
        if (hasFrozenSnapshot(result)) return { row: result, source: 'result_snapshot' };
        const assignment = assignmentByOrder.get(orderNo) || null;
        if (assignment) return { row: assignment, source: 'assignment_snapshot' };
        return { row: null, source: 'missing_snapshot' };
    }

    function resultRowsBySession(rows) {
        const map = new Map();
        for (const row of Array.isArray(rows) ? rows : []) {
            const sessionId = sessionIdOf(row);
            const orderNo = orderNoOf(row);
            if (!sessionId || !orderNo) continue;
            if (!map.has(sessionId)) map.set(sessionId, new Map());
            const byOrder = map.get(sessionId);
            if (!byOrder.has(orderNo)) byOrder.set(orderNo, []);
            byOrder.get(orderNo).push(row);
        }
        return map;
    }

    function assignmentRowsById(rows) {
        const map = new Map();
        for (const row of Array.isArray(rows) ? rows : []) {
            const assignmentId = text(row?.assignment_id || row?.assignmentId);
            const orderNo = orderNoOf(row);
            if (!assignmentId || !orderNo) continue;
            if (!map.has(assignmentId)) map.set(assignmentId, new Map());
            const byOrder = map.get(assignmentId);
            if (!byOrder.has(orderNo)) byOrder.set(orderNo, []);
            byOrder.get(orderNo).push(row);
        }
        return map;
    }

    function uniqueRow(rows) {
        return Array.isArray(rows) && rows.length === 1 ? rows[0] : null;
    }

    function addRef(refs, session, orderNo, identity) {
        const key = `${sessionIdOf(session)}|${text(session?.assignment_id || session?.assignmentId)}|${orderNo}`;
        if (refs.has(key)) return;
        refs.set(key, {
            sessionId: sessionIdOf(session),
            assignmentId: text(session?.assignment_id || session?.assignmentId),
            orderNo,
            examTitle: text(session?.exam_title || session?.examTitle),
            examDate: sessionDate(session),
            archiveFile: text(session?.archive_file || session?.archiveFile),
            sourceQuestionUid: identity?.verified ? identity.questionUid : null,
            sourceIdentityStatus: identity?.verified ? 'VERIFIED' : 'UNRESOLVED',
        });
    }

    function strictDifficultyEligible(record, archive2Core) {
        if (typeof archive2Core?.difficultyEligible === 'function') return archive2Core.difficultyEligible(record);
        return record?.sourceStatus === 'VERIFIED' &&
            Number.isInteger(record?.difficultyBucket) && record.difficultyBucket >= 1 && record.difficultyBucket <= 5 &&
            ['high', 'medium', 'low'].includes(record?.difficultyConfidence) &&
            ['NONE', 'B12', 'B23', 'B34', 'B45'].includes(record?.difficultyBoundaryFlag) &&
            ['NORMAL', 'BORDERLINE_ACCEPTABLE', 'STRONG_CONFLICT'].includes(record?.legacyLevelCompatibility) &&
            !(Array.isArray(record?.metadataConflicts) && record.metadataConflicts.some(field => [
                'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility'
            ].includes(field)));
    }

    function generalUseEligible(record, archive2Core) {
        if (typeof archive2Core?.generalUseEligibility === 'function') {
            return archive2Core.generalUseEligibility(record).ok === true;
        }
        const identity = identityOf(record);
        return identity.verified && record?.identityStatus === 'VERIFIED' &&
            record?.sourceIntegrityStatus === 'VERIFIED' && record?.sourceStatus === 'VERIFIED' &&
            Boolean(identity.fingerprint) &&
            !['SOURCE_BLOCKED', 'SOURCE_REPAIR_REQUIRED', 'SOLUTION_REPAIR_REQUIRED', 'ANSWER_REPAIR_REQUIRED'].includes(record?.sourceQualityDisposition) &&
            record?.sourceIssueHold !== true && record?.sourceDefectCandidate !== true;
    }

    function advancedPathEligible(record, archive2Core, canonicalAuthority) {
        return typeof archive2Core?.advancedEligible === 'function' &&
            archive2Core.advancedEligible(record, { canonicalAuthority }) === true;
    }

    function candidateMeta(record) {
        return canonicalMetaOf(record, { candidate: true });
    }

    function candidateMetadataJson(record, identity, meta, revision) {
        const fields = Object.keys(meta).filter(field => meta[field] !== undefined);
        const metaContentHash = text(record?.metadataContentHash || record?.metadata_content_hash) || null;
        const projectionVersion = text(record?.canonicalProjectionVersion || record?.sourceProjectionVersion || record?.projectionVersion) || null;
        const sourceJsSha256 = text(record?.currentSourceJsSha256 || record?.sourceJsSha256 || record?.sourceFileHash) || null;
        const snapshot = {
            ...meta,
            schemaVersion: META_SCHEMA_VERSION,
            snapshotScope: 'RECOMMENDATION_CANDIDATE_CANONICAL_META',
            captureStatus: 'CAPTURED',
            captureSource: 'RECOMMENDATION_VERIFIED_CATALOG',
            authoredFidelity: 'UNKNOWN',
            sourceProjectionVersion: projectionVersion,
            sourceContentVerificationStatus: text(record?.sourceContentVerificationStatus || record?.sourceRestoreStatus) || 'NOT_RUN',
            currentSourceJsSha256: sourceJsSha256,
            ...(metaContentHash ? { metadataContentHash: metaContentHash } : {}),
            sourceIdentity: {
                status: 'VERIFIED',
                sourceArchiveFile: identity.sourceFile,
                normalizedSourceFile: identity.sourceFile,
                sourceQuestionUid: identity.questionUid,
                sourceQuestionOrdinal: identity.sourceOrdinal,
                sourceQuestionNo: identity.sourceQuestionNo,
                sourceFingerprint: identity.fingerprint,
                currentSourceJsSha256: sourceJsSha256,
            },
            archiveMetadata: null,
            canonicalMeta: { ...meta },
            authoringMeta: {},
            legacyDifficulty: {},
            metadataRevision: revision,
            capturedCanonicalFields: fields,
            unavailableCanonicalFields: (Array.isArray(record?.canonicalMetaFields)
                ? record.canonicalMetaFields
                : PATH_FIELDS.concat(['difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility']))
                .filter(field => !Object.prototype.hasOwnProperty.call(meta, field)),
        };
        return JSON.stringify(snapshot);
    }

    function pathKeyAtDepth(record, meta, depth, archive2Core) {
        return typeof archive2Core?.pathKey === 'function'
            ? archive2Core.pathKey({ ...record, ...meta }, depth)
            : JSON.stringify(PATH_FIELDS.slice(0, depth).map(field => text(meta[field])));
    }

    function buildCandidateIndex(records, archive2Core, canonicalAuthority, exclusions, targetGrade = '') {
        const prepared = (Array.isArray(records) ? records : []).map(record => ({
            record,
            identity: identityOf(record),
            meta: candidateMeta(record),
        }));
        const uidCounts = new Map();
        for (const fact of prepared) {
            if (fact.identity.verified) uidCounts.set(fact.identity.questionUid, (uidCounts.get(fact.identity.questionUid) || 0) + 1);
        }
        const index = new Map();
        for (const fact of prepared) {
            const { record, identity, meta } = fact;
            if (!identity.verified) {
                exclusions.invalidCandidateIdentity++;
                continue;
            }
            if ((uidCounts.get(identity.questionUid) || 0) !== 1) {
                exclusions.duplicateCandidateUid++;
                continue;
            }
            if (identity.sourceQuestionNo == null) {
                exclusions.candidateMissingQuestionNo++;
                continue;
            }
            const path = canonicalPath(meta);
            if (!path) {
                exclusions.candidateMissingCanonicalPath++;
                continue;
            }
            if (!generalUseEligible(record, archive2Core)) {
                exclusions.candidateSourceIneligible++;
                continue;
            }
            if (targetGrade) {
                const sourceRank = archive2Core?.gradeRank?.(text(record.sourceGrade)) || 0;
                const targetRank = archive2Core?.gradeRank?.(targetGrade) || 0;
                if (!sourceRank || !targetRank || sourceRank > targetRank) {
                    exclusions.candidateGradeIneligible++;
                    continue;
                }
            }
            const bucket = canonicalBucket(meta);
            const difficultyRecord = { ...record, ...meta };
            fact.path = path;
            fact.bucket = bucket;
            fact.difficultyEligible = bucket != null && strictDifficultyEligible(difficultyRecord, archive2Core);
            fact.advancedPathEligible = path.depth <= 4 || advancedPathEligible(difficultyRecord, archive2Core, canonicalAuthority);
            for (let depth = 4; depth <= path.depth; depth++) {
                const pathKey = pathKeyAtDepth(record, meta, depth, archive2Core);
                const indexKey = `${depth}|${pathKey}`;
                let group = index.get(indexKey);
                if (!group) {
                    group = { anyBucket: [], byBucket: new Map() };
                    index.set(indexKey, group);
                }
                group.anyBucket.push(fact);
                if (bucket != null) {
                    if (!group.byBucket.has(bucket)) group.byBucket.set(bucket, []);
                    group.byBucket.get(bucket).push(fact);
                }
            }
        }
        return index;
    }

    function clinicItemForCandidate(record, identity, target, meta, requestedBucket, filterMode) {
        const candidateCanonicalMeta = meta || candidateMeta(record);
        const revision = firstValue(record, ['metadataRevision', 'metadata_revision']) || candidateCanonicalMeta.metadataRevision || null;
        const metadataJson = candidateMetadataJson(record, identity, candidateCanonicalMeta, revision);
        const explicitSnapshotStatus = text(firstValue(record, ['metadataSnapshotStatus', 'metadata_snapshot_status'])).toUpperCase();
        const snapshotStatus = explicitSnapshotStatus || (Object.keys(candidateCanonicalMeta).length ? 'CAPTURED' : 'UNRESOLVED');
        return {
            archiveFile: identity.sourceFile,
            questionNo: identity.sourceQuestionNo,
            displayArchiveFile: identity.sourceFile,
            displayQuestionNo: identity.sourceQuestionNo,
            sourceArchiveFile: identity.sourceFile,
            sourceQuestionNo: identity.sourceQuestionNo,
            sourceQuestionOrdinal: identity.sourceOrdinal,
            sourceQuestionUid: identity.questionUid,
            sourceFingerprint: identity.fingerprint,
            sourceIdentityStatus: 'VERIFIED',
            sourceContentVerificationStatus: text(record?.sourceContentVerificationStatus || record?.sourceRestoreStatus) || 'NOT_RUN',
            currentSourceJsSha256: text(record?.currentSourceJsSha256 || record?.sourceJsSha256 || record?.sourceFileHash) || null,
            canonicalProjectionVersion: text(record?.canonicalProjectionVersion || record?.sourceProjectionVersion || record?.projectionVersion) || null,
            metadataRevision: revision,
            metadataJson,
            metadataSnapshotStatus: snapshotStatus,
            ...candidateCanonicalMeta,
            canonicalMeta: { ...candidateCanonicalMeta },
            canonicalMetaFields: Array.isArray(record?.canonicalMetaFields)
                ? [...record.canonicalMetaFields]
                : Object.keys(candidateCanonicalMeta),
            sourceOriginRefs: [],
            recommendationReason: {
                basis: 'wrong_frequency',
                wrongCount: target.wrongCount,
                sessionCount: target.sessionCount,
                path: { ...target.path },
                pathDepth: target.pathDepth,
                observedWrongBucket: target.difficultyBucket,
                requestedBucket,
                filterMode,
                difficultyBucket: target.difficultyBucket,
                outcomeSources: [...target.outcomeSources],
                evidenceRefs: [...target.sourceOriginRefs],
            },
        };
    }

    function build(input = {}) {
        const sessions = Array.isArray(input.sessions) ? input.sessions : [];
        const resultItems = Array.isArray(input.resultItems) ? input.resultItems : [];
        const assignmentQuestions = Array.isArray(input.assignmentQuestions) ? input.assignmentQuestions : [];
        const wrongAnswers = Array.isArray(input.wrongAnswers) ? input.wrongAnswers : [];
        const candidateRecords = Array.isArray(input.candidateRecords) ? input.candidateRecords : [];
        const selectedIds = new Set((Array.isArray(input.studentIds) ? input.studentIds : [])
            .map(value => text(value?.id || value?.studentId || value)).filter(Boolean));
        const includeSeenQuestionUids = input.includeSeenQuestionUids === true;
        const archive2Core = input.archive2Core || null;
        const recommendationConfig = recommendationOptionsOf(input);
        const limit = recommendationConfig.normalized.countPerStudent;
        const targetGrade = text(input.targetGrade);
        if (targetGrade && !archive2Core?.gradeRank?.(targetGrade)) {
            recommendationConfig.errors.push({
                code: 'invalid_target_grade',
                field: 'targetGrade',
                message: 'The recipient class grade could not be confirmed.',
            });
        }
        const sessionsById = new Map(sessions.map(row => [sessionIdOf(row), row]).filter(([id]) => id));
        const resultsBySession = resultRowsBySession(resultItems);
        const resultItemSessions = new Set(resultItems.map(sessionIdOf).filter(Boolean));
        const assignmentsById = assignmentRowsById(assignmentQuestions);
        const exclusions = {
            wrongRowsWithoutSession: 0,
            wrongRowsOutsideSelection: 0,
            wrongRowsStudentMismatch: 0,
            invalidQuestionNumber: 0,
            invalidResultQuestionNumber: 0,
            duplicateWrongRows: 0,
            missingSnapshot: 0,
            ambiguousSnapshot: 0,
            missingResultStatus: 0,
            conflictingResultStatus: 0,
            nonBinaryResultStatus: 0,
            resultItemMissingForWrongAnswer: 0,
            resultOutcomeMismatch: 0,
            missingCanonicalPath: 0,
            unresolvedHistoryIdentity: 0,
            invalidCandidateIdentity: 0,
            duplicateCandidateUid: 0,
            candidateMissingQuestionNo: 0,
            candidateMissingCanonicalPath: 0,
            candidateSourceIneligible: 0,
            candidateAdvancedIneligible: 0,
            candidateRecentUid: 0,
            candidateNoPathMatch: 0,
            candidateSelectedBucketMismatch: 0,
            candidateGradeIneligible: 0,
            candidateDifficultyIneligible: 0,
        };
        const students = new Map();
        const seenQuestionUids = new Map();
        const sourceKindCounts = { result_snapshot: 0, assignment_snapshot: 0 };
        const legacyEvidenceSessions = new Set();
        const unresolvedEvidence = [];
        for (const studentId of selectedIds) {
            students.set(studentId, new Map());
            seenQuestionUids.set(studentId, new Set());
        }
        const selectedSessions = sessions.filter(session => selectedIds.has(studentIdOf(session)));
        for (const session of selectedSessions) {
            const studentId = studentIdOf(session);
            if (!students.has(studentId)) students.set(studentId, new Map());
            if (!seenQuestionUids.has(studentId)) seenQuestionUids.set(studentId, new Set());
            const resultRows = resultsBySession.get(sessionIdOf(session)) || new Map();
            const assignmentRows = assignmentsById.get(text(session?.assignment_id || session?.assignmentId)) || new Map();
            const questionCount = Math.max(0, Number.parseInt(session?.question_count ?? session?.questionCount, 10) || 0);
            for (let orderNo = 1; orderNo <= questionCount; orderNo++) {
                const resultList = resultRows.get(orderNo) || [];
                const assignmentList = assignmentRows.get(orderNo) || [];
                const result = uniqueRow(resultList);
                const assignment = uniqueRow(assignmentList);
                const selected = snapshotFor(session, orderNo, new Map([[orderNo, result]]), new Map([[orderNo, assignment]]));
                if (selected.row) {
                    const identity = identityOf(selected.row);
                    if (identity.verified) seenQuestionUids.get(studentId).add(identity.questionUid);
                }
            }
        }

        const seenWrongKeys = new Set();
        const wrongEvidenceRows = [];
        const selectedSessionIds = new Set(selectedSessions.map(sessionIdOf));
        for (const wrong of wrongAnswers) {
            const sessionId = text(wrong?.session_id || wrong?.sessionId);
            const session = sessionsById.get(sessionId);
            if (!session) {
                exclusions.wrongRowsWithoutSession++;
                continue;
            }
            const sessionStudentId = studentIdOf(session);
            const wrongStudentId = text(wrong?.student_id || wrong?.studentId);
            if (sessionStudentId && wrongStudentId && sessionStudentId !== wrongStudentId) {
                exclusions.wrongRowsStudentMismatch++;
                continue;
            }
            const studentId = sessionStudentId || wrongStudentId;
            if (!selectedIds.has(studentId)) {
                exclusions.wrongRowsOutsideSelection++;
                continue;
            }
            // A session with any result-item rows uses those statuses as its
            // outcome source. Never mix in its wrong_answers fallback rows.
            if (resultItemSessions.has(sessionId)) {
                const orderNo = orderNoOf(wrong);
                const resultList = resultsBySession.get(sessionId)?.get(orderNo) || [];
                if (orderNo && !resultList.length) {
                    exclusions.resultItemMissingForWrongAnswer++;
                    unresolvedEvidence.push({ sessionId, studentId, orderNo, reason: 'result_item_missing_for_wrong_answer', countBasis: 'wrong_frequency' });
                } else if (resultList.length === 1 && resultOutcome(resultList[0]) === 'correct') {
                    exclusions.resultOutcomeMismatch++;
                    unresolvedEvidence.push({ sessionId, studentId, orderNo, reason: 'wrong_answer_conflicts_with_result_item', countBasis: 'wrong_frequency' });
                }
                continue;
            }
            const orderNo = orderNoOf(wrong);
            if (!orderNo || (Number(session?.question_count || 0) > 0 && orderNo > Number(session.question_count))) {
                exclusions.invalidQuestionNumber++;
                continue;
            }
            legacyEvidenceSessions.add(sessionId);
            wrongEvidenceRows.push({ session, sessionId, studentId, orderNo, outcomeSource: 'legacy_wrong_answers' });
        }

        for (const row of resultItems) {
            const sessionId = sessionIdOf(row);
            if (!selectedSessionIds.has(sessionId)) continue;
            const session = sessionsById.get(sessionId);
            const orderNo = orderNoOf(row);
            const questionCount = Math.max(0, Number.parseInt(session?.question_count ?? session?.questionCount, 10) || 0);
            if (!orderNo || (questionCount > 0 && orderNo > questionCount)) {
                exclusions.invalidResultQuestionNumber++;
                unresolvedEvidence.push({
                    sessionId,
                    studentId: studentIdOf(session),
                    orderNo,
                    reason: 'result_item_question_number_invalid',
                    countBasis: 'wrong_frequency',
                });
            }
        }

        for (const [sessionId, byOrder] of resultsBySession) {
            if (!selectedSessionIds.has(sessionId)) continue;
            const session = sessionsById.get(sessionId);
            const studentId = studentIdOf(session);
            for (const [orderNo, rows] of byOrder) {
                const questionCount = Math.max(0, Number.parseInt(session?.question_count ?? session?.questionCount, 10) || 0);
                if (questionCount > 0 && orderNo > questionCount) continue;
                if (rows.length !== 1) {
                    exclusions.ambiguousSnapshot++;
                    unresolvedEvidence.push({ sessionId, studentId, orderNo, reason: 'result_item_order_ambiguous', countBasis: 'wrong_frequency' });
                    continue;
                }
                const outcome = resultOutcome(rows[0]);
                if (outcome === 'unknown') {
                    exclusions.missingResultStatus++;
                    unresolvedEvidence.push({ sessionId, studentId, orderNo, reason: 'result_status_unknown', countBasis: 'wrong_frequency' });
                    continue;
                }
                if (outcome === 'conflict') {
                    exclusions.conflictingResultStatus++;
                    unresolvedEvidence.push({ sessionId, studentId, orderNo, reason: 'result_status_conflict', countBasis: 'wrong_frequency' });
                    continue;
                }
                if (outcome === 'partial' || outcome === 'unchecked') {
                    exclusions.nonBinaryResultStatus++;
                    unresolvedEvidence.push({ sessionId, studentId, orderNo, reason: `result_status_${outcome}`, countBasis: 'wrong_frequency' });
                    continue;
                }
                if (outcome === 'wrong') {
                    wrongEvidenceRows.push({ session, sessionId, studentId, orderNo, outcomeSource: 'result_items' });
                }
            }
        }

        for (const evidenceRow of wrongEvidenceRows) {
            const { session, sessionId, studentId, orderNo, outcomeSource } = evidenceRow;
            const occurrenceKey = `${sessionId}|${orderNo}`;
            if (seenWrongKeys.has(occurrenceKey)) {
                exclusions.duplicateWrongRows++;
                continue;
            }
            seenWrongKeys.add(occurrenceKey);
            const resultRowsForSession = resultsBySession.get(sessionId) || new Map();
            const assignmentRowsForSession = assignmentsById.get(text(session?.assignment_id || session?.assignmentId)) || new Map();
            const resultList = resultRowsForSession.get(orderNo) || [];
            const assignmentList = assignmentRowsForSession.get(orderNo) || [];
            const result = uniqueRow(resultList);
            const assignment = uniqueRow(assignmentList);
            if (resultList.length > 1 || assignmentList.length > 1) exclusions.ambiguousSnapshot++;
            const selected = snapshotFor(session, orderNo, new Map([[orderNo, result]]), new Map([[orderNo, assignment]]));
            if (!selected.row) {
                exclusions.missingSnapshot++;
                unresolvedEvidence.push({
                    sessionId,
                    studentId,
                    orderNo,
                    outcomeSource,
                    reason: 'frozen_snapshot_missing',
                    countBasis: 'wrong_frequency',
                });
                continue;
            }
            sourceKindCounts[selected.source] = (sourceKindCounts[selected.source] || 0) + 1;
            const meta = canonicalMetaOf(selected.row);
            const path = canonicalPath(meta);
            if (!path) {
                exclusions.missingCanonicalPath++;
                unresolvedEvidence.push({
                    sessionId,
                    studentId,
                    orderNo,
                    outcomeSource,
                    snapshotSource: selected.source,
                    reason: 'canonical_path_missing',
                    countBasis: 'wrong_frequency',
                });
                continue;
            }
            const identity = identityOf(selected.row);
            if (!identity.verified) exclusions.unresolvedHistoryIdentity++;
            const bucket = canonicalBucket(meta);
            const targetKey = JSON.stringify([path.key, bucket]);
            const targetMap = students.get(studentId);
            if (!targetMap.has(targetKey)) {
                targetMap.set(targetKey, {
                    path: path.path,
                    pathDepth: path.depth,
                    pathKey: path.key,
                    difficultyBucket: bucket,
                    wrongCount: 0,
                    verifiedIdentityCount: 0,
                    unresolvedIdentityCount: 0,
                    sessionIds: new Set(),
                    sourceKinds: new Set(),
                    outcomeSources: new Set(),
                    sourceOriginRefs: new Map(),
                    lastWrongAt: '',
                });
            }
            const target = targetMap.get(targetKey);
            target.wrongCount++;
            target.sessionIds.add(sessionId);
            target.sourceKinds.add(selected.source);
            target.outcomeSources.add(outcomeSource);
            addRef(target.sourceOriginRefs, session, orderNo, identity);
            if (identity.verified) target.verifiedIdentityCount++;
            else target.unresolvedIdentityCount++;
            const date = sessionDate(session);
            if (date && date > target.lastWrongAt) target.lastWrongAt = date;
        }

        const evidence = [];
        for (const [studentId, targetMap] of students) {
            const targets = [...targetMap.values()]
                .map(target => ({
                    path: { ...target.path },
                    pathDepth: target.pathDepth,
                    pathKey: target.pathKey,
                    difficultyBucket: target.difficultyBucket,
                    wrongCount: target.wrongCount,
                    verifiedIdentityCount: target.verifiedIdentityCount,
                    unresolvedIdentityCount: target.unresolvedIdentityCount,
                    sessionCount: target.sessionIds.size,
                    sessionIds: [...target.sessionIds],
                    sourceKinds: [...target.sourceKinds],
                    outcomeSources: [...target.outcomeSources],
                    sourceOriginRefs: [...target.sourceOriginRefs.values()],
                    lastWrongAt: target.lastWrongAt,
                    countBasis: 'wrong_frequency',
                }))
                .sort((a, b) => b.wrongCount - a.wrongCount || b.lastWrongAt.localeCompare(a.lastWrongAt) || a.pathKey.localeCompare(b.pathKey));
            evidence.push({ studentId, targets });
        }

        const candidatesByStudent = [];
        const hasTargets = evidence.some(student => student.targets.length > 0);
        const candidateIndex = hasTargets && !recommendationConfig.errors.length
            ? buildCandidateIndex(candidateRecords, archive2Core, input.canonicalAuthority || null, exclusions, targetGrade)
            : new Map();
        for (const row of evidence) {
            if (recommendationConfig.errors.length) {
                candidatesByStudent.push({
                    studentId: row.studentId,
                    requestedCount: recommendationConfig.normalized.countPerStudent,
                    returnedCount: 0,
                    shortfall: recommendationConfig.normalized.countPerStudent,
                    items: [],
                });
                continue;
            }
            const recent = seenQuestionUids.get(row.studentId) || new Set();
            const used = new Set();
            const countedRecent = new Set();
            const availableItems = [];
            for (const target of row.targets) {
                if (availableItems.length >= limit) break;
                const group = candidateIndex.get(`${target.pathDepth}|${target.pathKey}`);
                const filterMode = recommendationConfig.normalized.difficultyMode;
                const buckets = filterMode === 'selected'
                    ? recommendationConfig.normalized.selectedDifficultyBuckets
                    : target.difficultyBucket == null ? null : [target.difficultyBucket];
                const pool = buckets == null
                    ? (group?.anyBucket || [])
                    : buckets.flatMap(bucket => group?.byBucket.get(bucket) || []);
                if (!pool.length) {
                    if (!group) exclusions.candidateNoPathMatch++;
                    else if (filterMode === 'selected') exclusions.candidateSelectedBucketMismatch++;
                    continue;
                }
                for (const fact of pool) {
                    if (availableItems.length >= limit) break;
                    const { record: candidate, identity, meta } = fact;
                    if (target.pathDepth > 4 && !fact.advancedPathEligible) {
                        exclusions.candidateAdvancedIneligible++;
                        continue;
                    }
                    if (buckets != null && !fact.difficultyEligible) {
                        exclusions.candidateDifficultyIneligible++;
                        continue;
                    }
                    if (!includeSeenQuestionUids && recent.has(identity.questionUid)) {
                        if (!countedRecent.has(identity.questionUid)) {
                            countedRecent.add(identity.questionUid);
                            exclusions.candidateRecentUid++;
                        }
                        continue;
                    }
                    if (used.has(identity.questionUid)) continue;
                    used.add(identity.questionUid);
                    const requestedBucket = filterMode === 'selected' ? fact.bucket : target.difficultyBucket;
                    availableItems.push(clinicItemForCandidate(candidate, identity, target, meta, requestedBucket, filterMode));
                }
            }
            const items = availableItems;
            candidatesByStudent.push({
                studentId: row.studentId,
                requestedCount: limit,
                returnedCount: availableItems.length,
                shortfall: limit == null ? null : Math.max(0, limit - availableItems.length),
                items,
            });
        }

        const coverageInput = object(input.coverage);
        const fromDates = selectedSessions.map(sessionDate).filter(Boolean).sort();
        const hasEvidence = evidence.some(row => row.targets.length);
        const hasCandidates = candidatesByStudent.some(row => row.items.length);
        const status = recommendationConfig.errors.length ? 'invalid_options'
            : !selectedIds.size ? 'no_selected_students'
            : !hasEvidence ? 'no_canonical_evidence'
            : !hasCandidates ? 'no_candidates' : 'ready';
        return {
            contractVersion: CONTRACT_VERSION,
            status,
            countBasis: 'wrong_frequency',
            recommendationOptions: recommendationConfig.normalized,
            coverage: {
                scope: text(coverageInput.scope) || 'unspecified',
                from: text(coverageInput.from) || fromDates[0] || '',
                to: text(coverageInput.to) || fromDates[fromDates.length - 1] || '',
                limited: coverageInput.limited === true,
                sessionLimit: positiveInteger(coverageInput.sessionLimit),
                selectedStudentCount: selectedIds.size,
                sessionCount: selectedSessions.length,
                resultItemCount: resultItems.length,
                assignmentQuestionCount: assignmentQuestions.length,
                wrongAnswerCount: seenWrongKeys.size,
                wrongEvidenceFromResultSnapshots: sourceKindCounts.result_snapshot || 0,
                wrongEvidenceFromAssignmentSnapshots: sourceKindCounts.assignment_snapshot || 0,
                wrongEvidenceWithoutSnapshot: exclusions.missingSnapshot,
                unresolvedWrongEvidenceCount: unresolvedEvidence.length,
                unknownResultStatusCount: exclusions.missingResultStatus,
                conflictingResultStatusCount: exclusions.conflictingResultStatus,
                nonBinaryResultStatusCount: exclusions.nonBinaryResultStatus,
                candidateRecordCount: candidateRecords.length,
                resultSnapshotSessionCount: new Set(resultItems.map(sessionIdOf).filter(id => selectedSessionIds.has(id))).size,
                legacyWrongAnswerSessionCount: legacyEvidenceSessions.size,
                ...(includeSeenQuestionUids ? { includeSeenQuestionUids: true } : {}),
            },
            evidence,
            candidates: candidatesByStudent,
            unresolvedEvidence,
            exclusions,
            errors: recommendationConfig.errors,
        };
    }

    function explicitlyUnsubmitted(session) {
        const value = session?.is_submitted ?? session?.isSubmitted;
        return value === false || value === 0 || ['false', '0'].includes(text(value).toLowerCase());
    }

    function explicitlySubmitted(session) {
        const value = session?.is_submitted ?? session?.isSubmitted;
        return value === true || value === 1 || ['true', '1'].includes(text(value).toLowerCase());
    }

    function buildFollowUpContext(input = {}) {
        const student = object(input.student);
        const session = object(input.latestSession);
        const sessionId = sessionIdOf(session);
        const assignmentId = text(input.assignmentId);
        const classId = text(input.classId);
        const studentId = text(input.studentId || student.studentId);
        const expectedUids = Array.isArray(input.expectedQuestionUids) ? input.expectedQuestionUids.map(text) : [];
        const questionResults = Array.isArray(input.questionResults) ? input.questionResults : [];
        const excluded = student.excluded === true;
        const hasSession = Boolean(sessionId);
        const exactSession = hasSession && Boolean(assignmentId && classId && studentId) &&
            text(session.assignment_id || session.assignmentId) === assignmentId &&
            text(session.class_id || session.classId) === classId &&
            studentIdOf(session) === studentId;
        const unsubmitted = explicitlyUnsubmitted(session);
        const rawStatus = text(student.status).toLowerCase();
        const status = excluded ? 'excluded' : !hasSession ? 'pending'
            : unsubmitted || !exactSession || !['result', 'partial', 'unresolved'].includes(rawStatus) ? 'unresolved'
                : rawStatus;
        const bridgeVerified = input.bridgeVerified === true;
        const questionCount = expectedUids.length || questionResults.length;
        const counts = { correctCount: 0, wrongCount: 0, partialCount: 0, unresolvedCount: 0 };
        if (hasSession) {
            if (!exactSession || !bridgeVerified) counts.unresolvedCount = questionCount;
            else {
                for (const row of questionResults) {
                    const outcome = text(row?.status).toLowerCase();
                    if (outcome === 'correct') counts.correctCount++;
                    else if (outcome === 'wrong') counts.wrongCount++;
                    else if (outcome === 'partial' || outcome === 'unchecked') counts.partialCount++;
                    else counts.unresolvedCount++;
                }
            }
        }

        const resultRowsByOrder = new Map();
        for (const row of Array.isArray(input.resultRows) ? input.resultRows : []) {
            if (sessionIdOf(row) !== sessionId) continue;
            const rowAssignmentId = text(row?.assignment_id || row?.assignmentId);
            const rowStudentId = studentIdOf(row);
            const rowClassId = text(row?.class_id || row?.classId);
            if ((rowAssignmentId && rowAssignmentId !== assignmentId) ||
                (rowStudentId && rowStudentId !== studentId) || (rowClassId && rowClassId !== classId)) continue;
            const orderNo = orderNoOf(row);
            if (!orderNo) continue;
            if (!resultRowsByOrder.has(orderNo)) resultRowsByOrder.set(orderNo, []);
            resultRowsByOrder.get(orderNo).push(row);
        }

        const groups = new Map();
        let verifiedSnapshotCount = 0;
        let missingSnapshotCount = 0;
        let unresolvedSnapshotCount = 0;
        let unresolvedIdentityCount = 0;
        let missingPathCount = 0;
        let missingBucketCount = 0;
        let unresolvedEvidenceCount = 0;
        let resultSnapshotCount = 0;
        let assignmentSnapshotCount = 0;
        const canSummarize = !excluded && !unsubmitted && exactSession && bridgeVerified;
        const assignmentRowsByOrder = input.assignmentRowsByOrder instanceof Map ? input.assignmentRowsByOrder : new Map();

        if (canSummarize) {
            for (const result of questionResults) {
                if (text(result?.status).toLowerCase() !== 'wrong') continue;
                const orderNo = positiveInteger(result?.orderNo);
                const questionUid = text(result?.questionUid);
                if (!orderNo || !CANONICAL_UID_RE.test(questionUid) || expectedUids[orderNo - 1] !== questionUid) {
                    unresolvedEvidenceCount++;
                    continue;
                }
                const resultRows = resultRowsByOrder.get(orderNo) || [];
                if (resultRows.length !== 1 || resultOutcome(resultRows[0]) !== 'wrong') {
                    unresolvedEvidenceCount++;
                    continue;
                }
                const resultRow = uniqueRow(resultRows);
                const assignmentRow = uniqueRow(assignmentRowsByOrder.get(orderNo) || []);
                const selected = snapshotFor(session, orderNo,
                    new Map([[orderNo, resultRow]]), new Map([[orderNo, assignmentRow]]));
                if (!selected.row) {
                    missingSnapshotCount++;
                    continue;
                }
                if (selected.source === 'result_snapshot') resultSnapshotCount++;
                else if (selected.source === 'assignment_snapshot') assignmentSnapshotCount++;
                const facts = followUpSnapshotFactsOf(selected.row);
                const unresolvedSnapshot = facts.metadataSnapshotStatus !== 'CAPTURED';
                if (unresolvedSnapshot) unresolvedSnapshotCount++;
                if (!facts.identity.verified || facts.identity.questionUid !== questionUid) {
                    unresolvedIdentityCount++;
                    continue;
                }
                verifiedSnapshotCount++;
                if (unresolvedSnapshot) continue;
                if (!facts.path) {
                    missingPathCount++;
                    continue;
                }
                if (facts.difficultyBucket == null) missingBucketCount++;
                const groupKey = JSON.stringify([facts.path.key, facts.difficultyBucket]);
                if (!groups.has(groupKey)) {
                    groups.set(groupKey, {
                        path: { ...facts.path.path },
                        pathDepth: facts.path.depth,
                        pathKey: facts.path.key,
                        difficultyBucket: facts.difficultyBucket,
                        observedWrongCount: 0,
                        questionUids: new Set(),
                        questionOrderNos: new Set(),
                        questionRefs: new Map(),
                    });
                }
                const group = groups.get(groupKey);
                group.observedWrongCount++;
                group.questionUids.add(questionUid);
                group.questionOrderNos.add(orderNo);
                group.questionRefs.set(orderNo, {
                    orderNo,
                    sourceQuestionUid: facts.identity.questionUid,
                    sourceArchiveFile: facts.identity.sourceFile,
                    sourceQuestionOrdinal: facts.identity.sourceOrdinal,
                    sourceFingerprint: facts.identity.fingerprint || null,
                });
            }
        }

        const completeAttempt = !excluded && status === 'result' && exactSession && bridgeVerified && !unsubmitted &&
            questionCount > 0 && questionResults.length === questionCount &&
            questionResults.every(row => ['correct', 'wrong'].includes(text(row?.status).toLowerCase()));
        const confirmedWrongByMeta = [...groups.values()].map(group => {
            const questionCountForMeta = group.questionUids.size;
            const recommendationEligibleCount = completeAttempt ? questionCountForMeta : 0;
            return {
                path: { ...group.path },
                pathDepth: group.pathDepth,
                pathKey: group.pathKey,
                difficultyBucket: group.difficultyBucket,
                questionCount: questionCountForMeta,
                questionOrderNos: [...group.questionOrderNos].sort((a, b) => a - b),
                questionRefs: [...group.questionRefs.values()].sort((a, b) => a.orderNo - b.orderNo),
                observedWrongCount: group.observedWrongCount,
                recommendationEligibleCount,
            };
        }).sort((a, b) => b.observedWrongCount - a.observedWrongCount || a.pathKey.localeCompare(b.pathKey) ||
            Number(a.difficultyBucket || 0) - Number(b.difficultyBucket || 0));
        const classifiedWrongCount = confirmedWrongByMeta.reduce((sum, row) => sum + row.observedWrongCount, 0);
        const unclassifiedCount = Math.max(0, counts.wrongCount - classifiedWrongCount);
        const contextStatus = status === 'result' && !completeAttempt ? 'unresolved' : status;
        const unresolvedMetaCount = missingSnapshotCount + unresolvedSnapshotCount + unresolvedIdentityCount + missingPathCount;
        const hasMetadataGaps = unclassifiedCount > 0 || unresolvedEvidenceCount > 0 || unresolvedMetaCount > 0 || missingBucketCount > 0;
        const metaCoverageStatus = contextStatus === 'pending' || contextStatus === 'excluded' ? 'not_observed'
            : !exactSession || !bridgeVerified || unsubmitted ? 'unresolved'
                : contextStatus === 'unresolved' ? 'unresolved'
                    : contextStatus === 'partial' ? 'partial'
                        : counts.wrongCount === 0 ? 'complete'
                            : hasMetadataGaps ? confirmedWrongByMeta.length ? 'partial' : 'unresolved' : 'complete';
        const recommendationTargets = confirmedWrongByMeta.filter(row => row.recommendationEligibleCount > 0).map(row => ({
            path: { ...row.path },
            pathDepth: row.pathDepth,
            pathKey: row.pathKey,
            difficultyBucket: row.difficultyBucket,
            questionCount: row.questionCount,
            questionOrderNos: [...row.questionOrderNos],
            questionRefs: row.questionRefs.map(ref => ({ ...ref })),
            observedWrongCount: row.observedWrongCount,
            recommendationEligibleCount: row.recommendationEligibleCount,
        }));
        const recommendationEligible = completeAttempt && recommendationTargets.length > 0;
        return freezeDeep({
            status: contextStatus,
            coverage: {
                attemptStatus: contextStatus,
                submissionStatus: unsubmitted ? 'unsubmitted' : explicitlySubmitted(session) ? 'submitted' : 'not_reported',
                questionCount,
                ...counts,
                unclassifiedCount,
                verifiedSnapshotCount,
                missingSnapshotCount,
                unresolvedSnapshotCount,
                unresolvedIdentityCount,
                missingPathCount,
                missingBucketCount,
                unresolvedEvidenceCount,
                resultSnapshotCount,
                assignmentSnapshotCount,
                metaCoverageStatus,
                recommendationEligible,
            },
            confirmedWrongByMeta,
            recommendationInput: {
                basis: 'latest_actual_attempt',
                eligible: recommendationEligible,
                targets: recommendationTargets,
            },
        });
    }

    function buildFollowUpCandidates(input = {}) {
        const mode = text(input.mode).toLowerCase();
        const studentId = text(input.studentId);
        const followUpContext = object(input.followUpContext);
        const questionResults = Array.isArray(input.questionResults) ? input.questionResults : [];
        const recommendationInput = object(followUpContext.recommendationInput);
        const rawTargets = Array.isArray(recommendationInput.targets) ? recommendationInput.targets : [];
        const targetScopeSupplied = own(input, 'targetScope');
        const targetScope = input.targetScope;
        const optionsInput = own(input, 'recommendationOptions')
            ? { recommendationOptions: input.recommendationOptions }
            : own(input, 'countPerStudent') ? { countPerStudent: input.countPerStudent } : {};
        const rawTargetUidCount = new Set(rawTargets.flatMap(target =>
            (Array.isArray(target?.questionRefs) ? target.questionRefs : []).map(ref => text(ref?.sourceQuestionUid)).filter(Boolean)
        )).size;
        const recommendationConfig = mode === 'same_uid'
            ? { normalized: {
                countPerStudent: Math.max(1, Math.min(400, rawTargetUidCount)),
                difficultyMode: 'match_wrong',
                selectedDifficultyBuckets: [],
            }, errors: [] }
            : recommendationOptionsOf(optionsInput);
        const limit = recommendationConfig.normalized.countPerStudent;
        const targetGrade = text(input.targetGrade);
        const archive2Core = input.archive2Core || null;
        const candidateRecords = Array.isArray(input.candidateRecords) ? input.candidateRecords : [];
        const errors = recommendationConfig.errors;
        if (!['same_uid', 'similar_uid'].includes(mode)) {
            errors.push({ code: 'invalid_follow_up_mode', field: 'mode', message: 'mode must be same_uid or similar_uid.' });
        }
        if (!studentId) errors.push({ code: 'invalid_follow_up_student', field: 'studentId', message: 'studentId is required.' });
        if (followUpContext.status !== 'result' || followUpContext.coverage?.attemptStatus !== 'result' ||
            followUpContext.coverage?.recommendationEligible !== true || recommendationInput.eligible !== true || !rawTargets.length) {
            errors.push({ code: 'follow_up_result_not_eligible', field: 'followUpContext', message: 'A complete latest result with canonical follow-up evidence is required.' });
        }
        if (!targetGrade || !archive2Core?.gradeRank?.(targetGrade)) {
            errors.push({ code: 'invalid_target_grade', field: 'targetGrade', message: 'The recipient class grade could not be confirmed.' });
        }

        const emptyCandidates = () => [{
            studentId,
            requestedCount: mode === 'same_uid' ? 0 : limit,
            returnedCount: 0,
            shortfall: mode === 'same_uid' ? 0 : Math.max(0, limit || 0),
            items: [],
        }];
        const emptyCoverage = {
            scope: 'follow_up',
            mode,
            attemptStatus: text(followUpContext.coverage?.attemptStatus),
            targetMetaCount: targetScopeSupplied ? 0 : rawTargets.length,
            targetUidCount: 0,
            candidateRecordCount: candidateRecords.length,
            ...(targetScopeSupplied ? { sourceTargetMetaCount: rawTargets.length, sourceTargetUidCount: rawTargetUidCount } : {}),
        };
        const earlyContextError = errors.some(row => ['follow_up_result_not_eligible', 'invalid_follow_up_mode', 'invalid_follow_up_student']
            .includes(row.code));
        if (errors.length && (!targetScopeSupplied || earlyContextError)) {
            return {
                contractVersion: CONTRACT_VERSION,
                status: errors.some(row => row.code === 'follow_up_result_not_eligible' || row.code === 'invalid_follow_up_mode' || row.code === 'invalid_follow_up_student')
                    ? 'invalid_context' : 'invalid_options',
                countBasis: 'latest_attempt_follow_up',
                recommendationMode: mode,
                recommendationOptions: recommendationConfig.normalized,
                coverage: emptyCoverage,
                evidence: [],
                candidates: emptyCandidates(),
                exclusions: {},
                errors,
            };
        }

        const questionResultsByOrder = new Map();
        for (const row of questionResults) {
            const orderNo = orderNoOf(row);
            if (!orderNo) continue;
            if (!questionResultsByOrder.has(orderNo)) questionResultsByOrder.set(orderNo, []);
            questionResultsByOrder.get(orderNo).push(row);
        }
        const normalizedTargets = [];
        const targetUids = new Set();
        let invalidTargetReferenceCount = 0;
        for (const target of rawTargets) {
            const canonical = canonicalPath(target?.path);
            const difficultyBucket = target?.difficultyBucket == null ? null : canonicalBucket({ difficultyBucket: target.difficultyBucket });
            const orderNos = Array.isArray(target?.questionOrderNos)
                ? target.questionOrderNos.map(positiveInteger).filter(Boolean) : [];
            const refs = Array.isArray(target?.questionRefs) ? target.questionRefs : [];
            const seenOrders = new Set();
            const targetRefs = [];
            let valid = Boolean(canonical) && canonical.depth === Number(target.pathDepth) &&
                canonical.key === text(target.pathKey) && (target.difficultyBucket == null || difficultyBucket != null) &&
                orderNos.length > 0 && refs.length === orderNos.length;
            for (const ref of refs) {
                const orderNo = positiveInteger(ref?.orderNo);
                const questionUid = text(ref?.sourceQuestionUid);
                const identity = identityOf({
                    source_identity_status: 'VERIFIED',
                    source_question_uid: questionUid,
                    source_archive_file: ref?.sourceArchiveFile,
                    source_question_ordinal: ref?.sourceQuestionOrdinal,
                    source_fingerprint: ref?.sourceFingerprint,
                });
                const resultRows = orderNo ? questionResultsByOrder.get(orderNo) || [] : [];
                const result = uniqueRow(resultRows);
                const resultMatches = resultRows.length === 1 && text(result?.status).toLowerCase() === 'wrong' &&
                    text(result?.questionUid) === questionUid;
                if (!orderNo || seenOrders.has(orderNo) || !orderNos.includes(orderNo) ||
                    !CANONICAL_UID_RE.test(questionUid) || !identity.verified || !resultMatches) {
                    valid = false;
                    invalidTargetReferenceCount++;
                    continue;
                }
                seenOrders.add(orderNo);
                targetRefs.push({
                    orderNo,
                    sourceQuestionUid: identity.questionUid,
                    sourceArchiveFile: identity.sourceFile,
                    sourceQuestionOrdinal: identity.sourceOrdinal,
                    sourceFingerprint: identity.fingerprint || null,
                });
            }
            if (seenOrders.size !== orderNos.length || targetRefs.length !== refs.length ||
                new Set(targetRefs.map(ref => ref.sourceQuestionUid)).size !== Number(target.questionCount)) valid = false;
            if (!valid) {
                invalidTargetReferenceCount++;
                continue;
            }
            const normalizedTarget = {
                path: { ...canonical.path },
                pathDepth: canonical.depth,
                pathKey: canonical.key,
                difficultyBucket,
                questionCount: Number(target.questionCount),
                questionOrderNos: [...seenOrders].sort((a, b) => a - b),
                questionRefs: targetRefs.sort((a, b) => a.orderNo - b.orderNo),
                observedWrongCount: Math.max(0, Number(target.observedWrongCount) || 0),
            };
            normalizedTargets.push(normalizedTarget);
            normalizedTarget.questionRefs.forEach(ref => targetUids.add(ref.sourceQuestionUid));
        }
        if (invalidTargetReferenceCount || normalizedTargets.length !== rawTargets.length) {
            errors.push({ code: 'follow_up_target_reference_mismatch', field: 'followUpContext.recommendationInput.targets', message: 'Follow-up question references no longer match the latest result.' });
            return {
                contractVersion: CONTRACT_VERSION,
                status: 'invalid_context',
                countBasis: 'latest_attempt_follow_up',
                recommendationMode: mode,
                recommendationOptions: recommendationConfig.normalized,
                coverage: {
                    ...emptyCoverage,
                    targetUidCount: targetScopeSupplied ? 0 : targetUids.size,
                    invalidTargetReferenceCount,
                },
                evidence: [],
                candidates: emptyCandidates(),
                exclusions: { invalidTargetReferenceCount },
                errors,
            };
        }

        const sourceTargetMetaCount = normalizedTargets.length;
        const sourceTargetUidCount = targetUids.size;
        if (targetScopeSupplied) {
            const scopeObject = object(targetScope);
            const scopeBucket = scopeObject.difficultyBucket;
            const validScope = targetScope && typeof targetScope === 'object' && !Array.isArray(targetScope) &&
                typeof scopeObject.pathKey === 'string' && scopeObject.pathKey.length > 0 && text(scopeObject.pathKey) === scopeObject.pathKey &&
                own(scopeObject, 'difficultyBucket') &&
                (scopeBucket === null || (Number.isInteger(scopeBucket) && scopeBucket >= 1 && scopeBucket <= 5));
            const invalidScopeResult = (code, message) => {
                const scopeError = { code, field: 'targetScope', message };
                return {
                    contractVersion: CONTRACT_VERSION,
                    status: 'invalid_context',
                    countBasis: 'latest_attempt_follow_up',
                    recommendationMode: mode,
                    recommendationOptions: recommendationConfig.normalized,
                    coverage: {
                        ...emptyCoverage,
                        targetMetaCount: 0,
                        targetUidCount: 0,
                        sourceTargetMetaCount,
                        sourceTargetUidCount,
                    },
                    evidence: [],
                    candidates: emptyCandidates(),
                    exclusions: { invalidTargetScope: 1 },
                    errors: [...errors, scopeError],
                };
            };
            if (!validScope) {
                return invalidScopeResult('invalid_follow_up_target_scope', 'targetScope must identify one canonical path and a null or integer difficulty bucket.');
            }
            const scopedTargets = normalizedTargets.filter(target => target.pathKey === scopeObject.pathKey &&
                target.difficultyBucket === scopeBucket);
            if (scopedTargets.length !== 1) {
                return invalidScopeResult('follow_up_target_scope_unmatched', 'targetScope must match exactly one verified target type.');
            }
            normalizedTargets.splice(0, normalizedTargets.length, scopedTargets[0]);
            targetUids.clear();
            normalizedTargets[0].questionRefs.forEach(ref => targetUids.add(ref.sourceQuestionUid));
            if (mode === 'same_uid') recommendationConfig.normalized.countPerStudent = targetUids.size;
        }

        if (errors.length) {
            return {
                contractVersion: CONTRACT_VERSION,
                status: errors.some(row => row.code === 'invalid_follow_up_mode' || row.code === 'invalid_follow_up_student')
                    ? 'invalid_context' : 'invalid_options',
                countBasis: 'latest_attempt_follow_up',
                recommendationMode: mode,
                recommendationOptions: recommendationConfig.normalized,
                coverage: {
                    ...emptyCoverage,
                    targetMetaCount: normalizedTargets.length,
                    targetUidCount: targetUids.size,
                    ...(targetScopeSupplied ? { sourceTargetMetaCount, sourceTargetUidCount } : {}),
                },
                evidence: [],
                candidates: emptyCandidates(),
                exclusions: {},
                errors,
            };
        }

        const exclusions = {
            invalidCandidateIdentity: 0,
            duplicateCandidateUid: 0,
            candidateMissingQuestionNo: 0,
            candidateMissingCanonicalPath: 0,
            candidateSourceIneligible: 0,
            candidateAdvancedIneligible: 0,
            candidateNoPathMatch: 0,
            candidateSelectedBucketMismatch: 0,
            candidateGradeIneligible: 0,
            candidateDifficultyIneligible: 0,
            candidateCurrentTargetUid: 0,
            sameUidCandidateMissing: 0,
            sameUidCandidateIdentityMismatch: 0,
        };
        const candidateIndex = buildCandidateIndex(
            candidateRecords,
            archive2Core,
            input.canonicalAuthority || null,
            exclusions,
            targetGrade
        );
        const factsByUid = new Map();
        for (const group of candidateIndex.values()) {
            for (const fact of group.anyBucket) factsByUid.set(fact.identity.questionUid, fact);
        }
        const used = new Set();
        const items = [];
        const requestedCount = mode === 'same_uid' ? targetUids.size : limit;
        const selectedBuckets = recommendationConfig.normalized.selectedDifficultyBuckets;
        const filterMode = recommendationConfig.normalized.difficultyMode;
        const requestedLimit = mode === 'same_uid' ? targetUids.size : limit;
        const addCandidate = (fact, target, requestedBucket, candidateMode, refs = []) => {
            const { record, identity, meta } = fact;
            const item = clinicItemForCandidate(record, identity, {
                path: target.path,
                pathDepth: target.pathDepth,
                pathKey: target.pathKey,
                difficultyBucket: target.difficultyBucket,
                wrongCount: target.observedWrongCount,
                sessionCount: 1,
                sourceOriginRefs: [],
                outcomeSources: ['result_items'],
            }, meta, requestedBucket, candidateMode === 'same_uid' ? 'same_uid' : filterMode);
            item.recommendationReason = {
                basis: candidateMode === 'same_uid' ? 'follow_up_same_uid' : 'follow_up_similar_uid',
                recommendationMode: candidateMode,
                path: { ...target.path },
                pathDepth: target.pathDepth,
                difficultyBucket: target.difficultyBucket,
                requestedBucket,
                filterMode: candidateMode === 'same_uid' ? 'unfiltered' : filterMode,
            };
            item.followUpMode = candidateMode;
            if (candidateMode === 'same_uid') {
                const fingerprints = [...new Set(refs.map(ref => text(ref.sourceFingerprint)).filter(Boolean))];
                const currentFingerprint = text(identity.fingerprint);
                item.questionOrderNos = [...new Set(refs.map(ref => ref.orderNo))].sort((a, b) => a - b);
                item.sourceFingerprintRelation = !currentFingerprint || !fingerprints.length ? 'unknown'
                    : fingerprints.every(fingerprint => fingerprint === currentFingerprint) ? 'fingerprint_match' : 'fingerprint_changed';
            }
            items.push(item);
            used.add(identity.questionUid);
        };

        if (mode === 'same_uid') {
            const refsByUid = new Map();
            for (const target of normalizedTargets) {
                for (const ref of target.questionRefs) {
                    if (!refsByUid.has(ref.sourceQuestionUid)) refsByUid.set(ref.sourceQuestionUid, []);
                    refsByUid.get(ref.sourceQuestionUid).push({ ...ref, target });
                }
            }
            for (const [questionUid, refs] of refsByUid) {
                const fact = factsByUid.get(questionUid);
                if (!fact) {
                    exclusions.sameUidCandidateMissing++;
                    continue;
                }
                if (refs.some(ref => fact.identity.sourceFile !== ref.sourceArchiveFile ||
                    fact.identity.sourceOrdinal !== ref.sourceQuestionOrdinal)) {
                    exclusions.sameUidCandidateIdentityMismatch++;
                    continue;
                }
                if (used.has(questionUid)) continue;
                const firstTarget = refs[0].target;
                const targetsForUid = [...new Map(refs.map(ref => [ref.target.pathKey + '|' + String(ref.target.difficultyBucket), ref.target])).values()];
                const target = { ...firstTarget, observedWrongCount: refs.length };
                target.path = targetsForUid.length === 1 ? firstTarget.path : {
                    L1: firstTarget.path.L1,
                    L2: firstTarget.path.L2,
                    ...(firstTarget.path.L3 ? { L3: firstTarget.path.L3 } : {}),
                    ...(firstTarget.path.L4 ? { L4: firstTarget.path.L4 } : {}),
                };
                if (items.length >= requestedLimit) break;
                addCandidate(fact, target, fact.bucket, 'same_uid', refs);
            }
        } else {
            for (const target of normalizedTargets) {
                if (items.length >= requestedLimit) break;
                const group = candidateIndex.get(`${target.pathDepth}|${target.pathKey}`);
                const buckets = filterMode === 'selected'
                    ? selectedBuckets
                    : target.difficultyBucket == null ? null : [target.difficultyBucket];
                const pool = buckets == null ? (group?.anyBucket || [])
                    : buckets.flatMap(bucket => group?.byBucket.get(bucket) || []);
                if (!pool.length) {
                    if (!group) exclusions.candidateNoPathMatch++;
                    else if (filterMode === 'selected') exclusions.candidateSelectedBucketMismatch++;
                    continue;
                }
                for (const fact of pool) {
                    if (items.length >= requestedLimit) break;
                    const { identity } = fact;
                    if (target.pathDepth > 4 && !fact.advancedPathEligible) {
                        exclusions.candidateAdvancedIneligible++;
                        continue;
                    }
                    if (buckets != null && !fact.difficultyEligible) {
                        exclusions.candidateDifficultyIneligible++;
                        continue;
                    }
                    if (targetUids.has(identity.questionUid)) {
                        exclusions.candidateCurrentTargetUid++;
                        continue;
                    }
                    if (used.has(identity.questionUid)) continue;
                    addCandidate(fact, target, filterMode === 'selected' ? fact.bucket : target.difficultyBucket, 'similar_uid');
                }
            }
        }

        const returnedCount = items.length;
        return {
            contractVersion: CONTRACT_VERSION,
            status: returnedCount ? 'ready' : mode === 'same_uid' ? 'no_candidates' : 'no_candidates',
            countBasis: 'latest_attempt_follow_up',
            recommendationMode: mode,
            recommendationOptions: recommendationConfig.normalized,
            coverage: {
                scope: 'follow_up',
                mode,
                attemptStatus: 'result',
                targetMetaCount: normalizedTargets.length,
                targetUidCount: targetUids.size,
                ...(targetScopeSupplied ? { sourceTargetMetaCount, sourceTargetUidCount } : {}),
                candidateRecordCount: candidateRecords.length,
                requestedCount,
                returnedCount,
            },
            evidence: [{
                studentId,
                targets: normalizedTargets.map(target => ({
                    path: { ...target.path },
                    pathDepth: target.pathDepth,
                    pathKey: target.pathKey,
                    difficultyBucket: target.difficultyBucket,
                    questionCount: target.questionCount,
                    questionOrderNos: [...target.questionOrderNos],
                    observedWrongCount: target.observedWrongCount,
                    countBasis: 'latest_attempt_confirmed_wrong',
                })),
            }],
            candidates: [{
                studentId,
                requestedCount,
                returnedCount,
                shortfall: Math.max(0, requestedCount - returnedCount),
                items,
            }],
            exclusions,
            errors: [],
        };
    }

    return {
        CONTRACT_VERSION,
        META_SCHEMA_VERSION,
        PATH_FIELDS,
        CANONICAL_META_FIELDS,
        build,
        buildFollowUpContext,
        buildFollowUpCandidates,
        canonicalMetaOf,
        identityOf,
        canonicalPath,
    };
}));
