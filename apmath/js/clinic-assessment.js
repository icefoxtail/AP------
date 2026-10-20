(function (root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.ClinicAssessment = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
    'use strict';

    const CONTRACT_VERSION = 'apms-clinic-recommendation-assessment-v1';
    const SAVED_PAPER_SCHEMA = 'archive-saved-paper-v1';
    const RECOVERY_SCHEMA = 'apms-clinic-assessment-recovery-v1';
    const RECOVERY_STORAGE_KEY = 'APMS_CLINIC_ASSESSMENT_PENDING_V1';
    const MAX_RECOVERY_RECEIPT_BYTES = 500000;
    const ARCHIVE2_CONTRACT = 'archive2-v1';
    const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const QUESTION_UID = /^qid_v1_[a-f0-9]{64}$/;
    const MAX_PAPER_QUESTIONS = 50;
    const MAX_PAPERS_PER_BATCH = 8;
    const MAX_QUESTIONS_PER_STUDENT = MAX_PAPER_QUESTIONS * MAX_PAPERS_PER_BATCH;

    function plainObject(value) {
        return Boolean(value && typeof value === 'object' && !Array.isArray(value));
    }

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function unique(values) {
        return Array.from(new Set((Array.isArray(values) ? values : [])
            .map(value => text(value)).filter(Boolean)));
    }

    function stableStringify(value) {
        if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
        if (plainObject(value)) return `{${Object.keys(value).sort()
            .map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
        return JSON.stringify(value);
    }

    function clone(value) {
        if (typeof structuredClone === 'function') return structuredClone(value);
        return JSON.parse(JSON.stringify(value));
    }

    function freezeDeep(value) {
        if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
        Object.freeze(value);
        Object.keys(value).forEach(key => freezeDeep(value[key]));
        return value;
    }

    function packUidOrder(uids) {
        let binary = '';
        for (const uid of Array.isArray(uids) ? uids : []) {
            if (!QUESTION_UID.test(text(uid))) throw error('INVALID_UID_ORDER', '추천 문항 UID 순서를 저장할 수 없습니다.');
            const digest = text(uid).slice(7);
            for (let index = 0; index < digest.length; index += 2) binary += String.fromCharCode(parseInt(digest.slice(index, index + 2), 16));
        }
        if (typeof btoa === 'function') return btoa(binary);
        if (typeof Buffer !== 'undefined') return Buffer.from(binary, 'binary').toString('base64');
        throw error('RECOVERY_ENCODING_UNAVAILABLE', '작업 확인 정보를 저장할 수 없습니다.');
    }

    function unpackUidOrder(packed, count) {
        const expectedCount = Number(count);
        if (!Number.isInteger(expectedCount) || expectedCount < 1 || expectedCount > MAX_QUESTIONS_PER_STUDENT) return null;
        let binary;
        try {
            binary = typeof atob === 'function'
                ? atob(String(packed || ''))
                : (typeof Buffer !== 'undefined' ? Buffer.from(String(packed || ''), 'base64').toString('binary') : '');
        } catch { return null; }
        if (binary.length !== expectedCount * 32) return null;
        const uids = [];
        for (let offset = 0; offset < binary.length; offset += 32) {
            let digest = '';
            for (let index = 0; index < 32; index++) digest += binary.charCodeAt(offset + index).toString(16).padStart(2, '0');
            uids.push(`qid_v1_${digest}`);
        }
        return uids;
    }

    function byteLength(value) {
        return new TextEncoder().encode(String(value)).byteLength;
    }

    async function sha256Hex(value, cryptoProvider = globalThis.crypto) {
        if (!cryptoProvider?.subtle || typeof TextEncoder === 'undefined') {
            throw error('RECOVERY_SIGNATURE_UNAVAILABLE', '작업 확인용 보안 서명을 만들 수 없습니다.');
        }
        const digest = new Uint8Array(await cryptoProvider.subtle.digest('SHA-256', new TextEncoder().encode(String(value))));
        return Array.from(digest, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function safeCoverage(value) {
        const source = plainObject(value) ? value : {};
        const sessionLimit = Number(source.sessionLimit);
        return {
            scope: text(source.scope) || 'class',
            from: text(source.from),
            to: text(source.to),
            limited: source.limited === true,
            sessionLimit: Number.isInteger(sessionLimit) && sessionLimit > 0 ? sessionLimit : null,
        };
    }

    function validRecoveryOperation(operation) {
        if (!plainObject(operation) || operation.schemaVersion !== RECOVERY_SCHEMA || !UUID_V4.test(text(operation.operationId)) ||
            !/^[0-9a-f]{64}$/i.test(text(operation.signature)) || !text(operation.title) ||
            !dateString(operation.examDate) || !text(operation.indexVersion) ||
            (operation.recommendationMode != null && !['same_uid', 'similar_uid'].includes(text(operation.recommendationMode))) ||
            !Array.isArray(operation.cohorts) || !operation.cohorts.length) return false;
        const batchIds = new Set();
        const assignmentBatchIds = new Set();
        for (const cohort of operation.cohorts) {
            if (!plainObject(cohort) || !Number.isInteger(Number(cohort.cohortIndex)) || !text(cohort.classId) ||
                !/^[0-9a-f]{64}$/i.test(text(cohort.recipientSignature)) ||
                !unpackUidOrder(cohort.uidOrderPacked, cohort.uidCount) ||
                !Array.isArray(cohort.contentBatches) || !cohort.contentBatches.length) return false;
            let paperCount = 0;
            const orderedPapers = [];
            for (const batch of cohort.contentBatches) {
                if (!plainObject(batch) || !UUID_V4.test(text(batch.saveBatchId)) || batchIds.has(text(batch.saveBatchId)) ||
                    !text(batch.contentGrade) || !Array.isArray(batch.papers) ||
                    batch.papers.length < 1 || batch.papers.length > MAX_PAPERS_PER_BATCH) return false;
                batchIds.add(text(batch.saveBatchId));
                for (let partIndex = 0; partIndex < batch.papers.length; partIndex++) {
                    const paper = batch.papers[partIndex];
                    if (!plainObject(paper) || Number(paper.partIndex) !== partIndex ||
                        !Number.isInteger(Number(paper.paperIndex)) || !Number.isInteger(Number(paper.paperCount)) ||
                        !Number.isInteger(Number(paper.questionCount)) || Number(paper.questionCount) < 1 || Number(paper.questionCount) > MAX_PAPER_QUESTIONS ||
                        !Number.isInteger(Number(paper.sequenceStart)) || !Number.isInteger(Number(paper.sequenceEnd)) ||
                        Number(paper.sequenceStart) < 1 || Number(paper.sequenceEnd) < Number(paper.sequenceStart) ||
                        Number(paper.sequenceEnd) - Number(paper.sequenceStart) + 1 !== Number(paper.questionCount) ||
                        Number(paper.sequenceEnd) > Number(cohort.uidCount) ||
                        !UUID_V4.test(text(paper.assignmentBatchId)) || assignmentBatchIds.has(text(paper.assignmentBatchId)) ||
                        !text(paper.title) || !dateString(paper.examDate) || text(paper.examDate) !== text(operation.examDate)) return false;
                    assignmentBatchIds.add(text(paper.assignmentBatchId));
                    orderedPapers.push(paper);
                    paperCount++;
                }
            }
            orderedPapers.sort((a, b) => Number(a.paperIndex) - Number(b.paperIndex));
            let nextSequenceNo = 1;
            for (let index = 0; index < orderedPapers.length; index++) {
                const paper = orderedPapers[index];
                if (Number(paper.paperIndex) !== index + 1 || Number(paper.sequenceStart) !== nextSequenceNo) return false;
                nextSequenceNo = Number(paper.sequenceEnd) + 1;
            }
            if (nextSequenceNo !== Number(cohort.uidCount) + 1) return false;
            for (const batch of cohort.contentBatches) {
                for (const paper of batch.papers) if (Number(paper.paperCount) !== paperCount ||
                    Number(paper.paperIndex) < 1 || Number(paper.paperIndex) > paperCount) return false;
            }
        }
        return true;
    }

    function error(code, message, details = {}) {
        const result = new Error(message || code);
        result.code = code;
        Object.assign(result, details);
        return result;
    }

    function makeUuid(createId) {
        const value = typeof createId === 'function'
            ? String(createId())
            : (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function'
                ? globalThis.crypto.randomUUID()
                : '');
        if (!UUID_V4.test(value)) throw error('UUID_UNAVAILABLE', '안전한 작업 ID를 만들 수 없습니다.');
        return value.toLowerCase();
    }

    function dateString(value) {
        const date = text(value);
        return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '';
    }

    function normalizedRecommendationOptions(value) {
        const source = plainObject(value) ? value : {};
        const countPerStudent = Number(source.countPerStudent);
        if (!Number.isInteger(countPerStudent) || countPerStudent < 1 || countPerStudent > MAX_QUESTIONS_PER_STUDENT) {
            throw error('INVALID_RECOMMENDATION_OPTIONS', '학생별 추천 문항 수는 1~400 사이 정수여야 합니다.');
        }
        const difficultyMode = text(source.difficultyMode || 'match_wrong');
        if (!['match_wrong', 'selected'].includes(difficultyMode)) {
            throw error('INVALID_RECOMMENDATION_OPTIONS', '난이도 선택 값이 올바르지 않습니다.');
        }
        const selectedDifficultyBuckets = unique((source.selectedDifficultyBuckets || [])
            .map(value => Number(value)).filter(value => Number.isInteger(value) && value >= 1 && value <= 5))
            .map(Number).sort((a, b) => a - b);
        if (difficultyMode === 'selected' && !selectedDifficultyBuckets.length) {
            throw error('INVALID_RECOMMENDATION_OPTIONS', '직접 난이도를 고를 때는 1~5 중 하나 이상 선택해야 합니다.');
        }
        return {
            countPerStudent,
            difficultyMode,
            selectedDifficultyBuckets: difficultyMode === 'selected' ? selectedDifficultyBuckets : []
        };
    }

    function canonicalResultStatus(row) {
        const resultStatus = text(row?.result_status || row?.resultStatus).toLowerCase();
        const rawCorrect = row?.is_correct ?? row?.isCorrect;
        const isCorrect = rawCorrect === 0 || rawCorrect === '0' ? false
            : rawCorrect === 1 || rawCorrect === '1' ? true : null;
        if ((resultStatus === 'wrong' && isCorrect === true) ||
            (resultStatus === 'correct' && isCorrect === false)) return { status: 'unresolved', isCorrect: null, reason: 'result_status_conflict' };
        if (['partial', 'unchecked'].includes(resultStatus)) {
            if (isCorrect !== null) return { status: 'unresolved', isCorrect: null, reason: 'result_status_conflict' };
            return { status: resultStatus, isCorrect: null, reason: '' };
        }
        if (resultStatus === 'correct' || isCorrect === true) return { status: 'correct', isCorrect: true, reason: '' };
        if (resultStatus === 'wrong' || isCorrect === false) return { status: 'wrong', isCorrect: false, reason: '' };
        return { status: 'unresolved', isCorrect: null, reason: 'result_status_missing' };
    }

    function parseAssignmentPayload(assignment) {
        const raw = assignment?.mixed_payload_json;
        if (plainObject(raw)) return raw;
        if (typeof raw !== 'string' || !raw.trim()) return {};
        try {
            const value = JSON.parse(raw);
            return plainObject(value) ? value : {};
        } catch {
            return {};
        }
    }

    function assignmentMarker(assignment) {
        const payload = parseAssignmentPayload(assignment);
        const meta = plainObject(payload.meta) ? payload.meta : {};
        const marker = plainObject(meta.clinicRecommendationAssessment) ? meta.clinicRecommendationAssessment : null;
        const markerKind = text(marker?.kind).toUpperCase();
        const markerMode = text(marker?.recommendationMode).toLowerCase();
        const recommendationMode = markerKind === 'TRANSFER' && (!markerMode || markerMode === 'similar_uid') ? 'similar_uid'
            : markerKind === 'FOLLOW_UP' && ['same_uid', 'similar_uid'].includes(markerMode) ? markerMode : '';
        if (!marker || marker.schemaVersion !== CONTRACT_VERSION || !recommendationMode ||
            !/^[0-9a-f]{64}$/i.test(text(marker.signature))) return null;
        const markerUids = Array.isArray(marker.questionUids) ? marker.questionUids.map(text) : [];
        const metaUids = Array.isArray(meta.questionUids) ? meta.questionUids.map(text)
            : (Array.isArray(payload.questions) ? payload.questions.map(question => text(question?.questionUid)) : []);
        const assignmentCount = Number(assignment.question_count);
        if (!markerUids.length || markerUids.some(uid => !QUESTION_UID.test(uid)) ||
            markerUids.length !== assignmentCount ||
            stableStringify(markerUids) !== stableStringify(metaUids)) return null;
        return { payload, meta, marker, recommendationMode, questionUids: markerUids };
    }

    function sortByDateNewest(rows) {
        return [...(Array.isArray(rows) ? rows : [])].sort((a, b) =>
            text(b.updated_at || b.updatedAt || b.exam_date || b.examDate || b.created_at)
                .localeCompare(text(a.updated_at || a.updatedAt || a.exam_date || a.examDate || a.created_at)) ||
            text(b.id).localeCompare(text(a.id)));
    }

    function questionResultsForSession(session, expectedUids, resultRows, bridgeVerified) {
        if (!bridgeVerified) {
            return {
                questionResults: expectedUids.map((questionUid, index) => ({
                    orderNo: index + 1, questionUid, status: 'unresolved', isCorrect: null, reason: 'assignment_question_snapshot_unverified'
                })),
                status: 'unresolved'
            };
        }
        const sessionCount = Number(session?.question_count);
        const count = Math.max(Number.isInteger(sessionCount) && sessionCount > 0 ? sessionCount : 0, expectedUids.length);
        if (!Number.isInteger(sessionCount) || sessionCount <= 0 || sessionCount !== expectedUids.length) {
            return {
                questionResults: expectedUids.map((questionUid, index) => ({
                    orderNo: index + 1, questionUid, status: 'unresolved', isCorrect: null, reason: 'session_question_count_mismatch'
                })),
                status: 'unresolved'
            };
        }
        const byOrder = new Map();
        for (const row of Array.isArray(resultRows) ? resultRows : []) {
            if (text(row?.session_id || row?.sessionId) !== text(session?.id)) continue;
            const orderNo = Number(row?.order_no ?? row?.question_no);
            if (!Number.isInteger(orderNo) || orderNo < 1 || orderNo > count) continue;
            if (!byOrder.has(orderNo)) byOrder.set(orderNo, []);
            byOrder.get(orderNo).push(row);
        }
        const results = [];
        for (let orderNo = 1; orderNo <= count; orderNo++) {
            const rows = byOrder.get(orderNo) || [];
            const row = rows.length === 1 ? rows[0] : null;
            const expectedUid = text(expectedUids[orderNo - 1]) || null;
            const storedUid = text(row?.source_question_uid || row?.sourceQuestionUid) || null;
            if (rows.length > 1) {
                results.push({ orderNo, questionUid: expectedUid, status: 'unresolved', isCorrect: null, reason: 'duplicate_result_item' });
                continue;
            }
            if (!row) {
                results.push({ orderNo, questionUid: expectedUid, status: 'unresolved', isCorrect: null, reason: 'result_item_missing' });
                continue;
            }
            if (storedUid && expectedUid && storedUid !== expectedUid) {
                results.push({ orderNo, questionUid: expectedUid, status: 'unresolved', isCorrect: null, reason: 'result_uid_mismatch' });
                continue;
            }
            const outcome = canonicalResultStatus(row);
            results.push({ orderNo, questionUid: expectedUid, status: outcome.status, isCorrect: outcome.isCorrect, reason: outcome.reason });
        }
        const hasConflict = results.some(row => ['result_status_conflict', 'result_uid_mismatch', 'duplicate_result_item'].includes(row.reason));
        const hasBinary = results.some(row => row.status === 'correct' || row.status === 'wrong');
        const allBinary = results.length > 0 && results.every(row => row.status === 'correct' || row.status === 'wrong');
        return {
            questionResults: results,
            status: hasConflict ? 'unresolved' : allBinary ? 'result' : hasBinary ? 'partial' : 'unresolved'
        };
    }

    function classOf(selection) {
        return {
            classId: text(selection?.classId || selection?.class_id),
            className: text(selection?.className || selection?.class_name),
            grade: text(selection?.grade || selection?.classGrade || selection?.class_grade)
        };
    }

    function itemFacts(entry, archive2Core, targetGradeRank) {
        const candidate = plainObject(entry?.candidate) ? entry.candidate : {};
        const verifiedRecord = plainObject(entry?.record) ? entry.record :
            (plainObject(entry?.verification?.record) ? entry.verification.record : {});
        const question = plainObject(entry?.question) ? entry.question :
            (plainObject(entry?.verification?.question) ? entry.verification.question : {});
        const uid = text(candidate.sourceQuestionUid || candidate.questionUid);
        const questionUid = text(question.questionUid || question.sourceQuestionUid);
        const sourceFile = text(candidate.sourceArchiveFile || candidate.archiveFile || verifiedRecord.sourceFile || question.sourceArchiveFile || question.sourceFile);
        const questionFile = text(question.sourceArchiveFile || question.sourceFile || question._sourceFile || sourceFile);
        const sourceOrdinal = Number(candidate.sourceQuestionOrdinal || candidate.sourceOrdinal || verifiedRecord.sourceOrdinal || question.sourceOrdinal || question._sourceQuestionOrdinal);
        const questionOrdinal = Number(question.sourceOrdinal || question._sourceQuestionOrdinal || sourceOrdinal);
        const sourceFingerprint = text(candidate.sourceFingerprint || verifiedRecord.sourceFingerprint || question.sourceFingerprint);
        const questionFingerprint = text(question.sourceFingerprint || sourceFingerprint);
        const sourceStatus = text(candidate.sourceIdentityStatus || candidate.sourceVerification?.status || verifiedRecord.identityStatus).toUpperCase();
        const integrityStatus = text(candidate.sourceIntegrityStatus || verifiedRecord.sourceIntegrityStatus).toUpperCase();
        const catalogSourceStatus = text(candidate.sourceStatus || verifiedRecord.sourceStatus).toUpperCase();
        const contentStatus = text(candidate.sourceContentVerificationStatus).toUpperCase();
        if (!QUESTION_UID.test(uid) || questionUid !== uid || sourceStatus !== 'VERIFIED' ||
            integrityStatus !== 'VERIFIED' || catalogSourceStatus !== 'VERIFIED' || contentStatus !== 'VERIFIED' ||
            !sourceFile || sourceFile !== questionFile || !Number.isInteger(sourceOrdinal) || sourceOrdinal < 1 ||
            sourceOrdinal !== questionOrdinal || !sourceFingerprint || questionFingerprint !== sourceFingerprint) {
            throw error('UNVERIFIED_RECOMMENDATION_ITEM', '추천 문항의 UID·원본 위치·fingerprint를 확인할 수 없습니다. 후보를 다시 불러오세요.');
        }
        const sourceGrade = text(entry?.sourceGrade || verifiedRecord.sourceGrade || candidate.sourceGrade || question.sourceGrade);
        const sourceGradeRank = typeof archive2Core?.gradeRank === 'function' ? archive2Core.gradeRank(sourceGrade) : null;
        if (!sourceGrade || !Number.isFinite(sourceGradeRank) || sourceGradeRank <= 0) {
            throw error('SOURCE_GRADE_UNRESOLVED', '추천 문항의 canonical 학년을 확인할 수 없어 시험으로 배정할 수 없습니다.');
        }
        if (sourceGradeRank > targetGradeRank) {
            throw error('SOURCE_GRADE_EXCEEDS_TARGET', '받는 반보다 높은 학년의 문항은 유형 보충 시험에 넣을 수 없습니다.');
        }
        const meta = plainObject(candidate.canonicalMeta) ? candidate.canonicalMeta : candidate;
        const requiredPath = ['curriculumKey', 'courseKey', 'L1', 'L2'];
        if (requiredPath.some(field => !text(meta[field]))) {
            throw error('CANONICAL_PATH_UNRESOLVED', '추천 문항의 canonical 단원 경로를 확인할 수 없습니다.');
        }
        const pathKey = typeof archive2Core?.pathKey === 'function'
            ? archive2Core.pathKey(meta, 4)
            : JSON.stringify(requiredPath.map(field => text(meta[field])));
        if (!text(pathKey)) throw error('CANONICAL_PATH_UNRESOLVED', '추천 문항의 canonical 단원 경로를 확인할 수 없습니다.');
        const normalizedFile = typeof archive2Core?.normalizeFile === 'function'
            ? archive2Core.normalizeFile(sourceFile)
            : sourceFile.normalize('NFC').replace(/\\/g, '/').replace(/^archive\//, '').replace(/^\/+/, '');
        const questionCopy = clone(question);
        return {
            uid,
            sourceFile: normalizedFile,
            sourceOrdinal,
            sourceGrade,
            pathKey,
            candidate,
            question: questionCopy,
        };
    }

    function sourceRuns(items) {
        const runs = [];
        for (const item of items) {
            const previous = runs[runs.length - 1];
            if (!previous || previous.grade !== item.sourceGrade) {
                runs.push({ grade: item.sourceGrade, items: [item] });
            } else previous.items.push(item);
        }
        return runs;
    }

    function sameSorted(left, right) {
        return stableStringify(unique(left).sort()) === stableStringify(unique(right).sort());
    }

    function summaryState(plan, state) {
        const cohorts = plan.cohorts.map((cohort, cohortIndex) => {
            const cohortState = state.cohorts[cohortIndex];
            return {
                cohortIndex,
                classId: cohort.classId,
                className: cohort.className,
                grade: cohort.grade,
                studentIds: [...cohort.studentIds],
                questionUids: [...cohort.questionUids],
                requestedCount: plan.recommendationOptions.countPerStudent,
                returnedCount: cohort.questionUids.length,
                saveBatches: cohort.contentBatches.map((batch, batchIndex) => ({
                    batchIndex,
                    contentGrade: batch.contentGrade,
                    saveBatchId: batch.saveBatchId,
                    status: cohortState.saveBatches[batchIndex].status,
                    error: cohortState.saveBatches[batchIndex].error || '',
                    papers: batch.papers.map((paper, paperIndex) => ({
                        paperIndex: paper.paperIndex,
                        paperCount: paper.paperCount,
                        sequenceStart: paper.sequenceStart,
                        sequenceEnd: paper.sequenceEnd,
                        questionUids: [...paper.questionUids],
                        savedPaperId: cohortState.saveBatches[batchIndex].paperIds[paperIndex] || null,
                        assignmentBatchId: paper.assignmentBatchId,
                        assignmentId: cohortState.saveBatches[batchIndex].assignments[paperIndex].assignmentId,
                        status: cohortState.saveBatches[batchIndex].assignments[paperIndex].status,
                        pdfFailure: cohortState.saveBatches[batchIndex].assignments[paperIndex].pdfFailure || '',
                        error: cohortState.saveBatches[batchIndex].assignments[paperIndex].error || '',
                    }))
                }))
            };
        });
        const allAssignments = cohorts.flatMap(cohort => cohort.saveBatches.flatMap(batch => batch.papers));
        const statuses = allAssignments.map(row => row.status);
        const batchStatuses = cohorts.flatMap(cohort => cohort.saveBatches.map(batch => batch.status));
        const status = statuses.length && statuses.every(value => value === 'ASSIGNED') ? 'ASSIGNED'
            : statuses.some(value => value === 'ASSIGNMENT_OUTCOME_UNKNOWN' || value === 'SAVE_OUTCOME_UNKNOWN') ||
                batchStatuses.includes('SAVE_OUTCOME_UNKNOWN') ? 'OUTCOME_UNKNOWN'
            : statuses.some(value => value === 'FAILED') || batchStatuses.includes('FAILED') ? 'FAILED'
            : 'IN_PROGRESS';
        return {
            contractVersion: CONTRACT_VERSION,
            operationId: plan.operationId,
            signature: plan.signature,
            ...(plan.recommendationMode ? { recommendationMode: plan.recommendationMode } : {}),
            status,
            cohorts,
        };
    }

    function create(options = {}) {
        if (typeof options.request !== 'function') throw new TypeError('request transport is required');
        const requestTransport = options.request;
        const archive2Core = options.archive2Core || null;
        const clinicRecommendations = options.clinicRecommendations || root?.ClinicRecommendations || null;
        const isOnline = typeof options.isOnline === 'function' ? options.isOnline : () => true;
        const createId = options.createId;
        const states = new WeakMap();

        function recoveryStorage() {
            if (Object.prototype.hasOwnProperty.call(options, 'storage')) return options.storage;
            try { return globalThis.localStorage || null; }
            catch { return null; }
        }

        function readRecoveryOperations() {
            const storage = recoveryStorage();
            if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
                throw error('RECOVERY_STORAGE_UNAVAILABLE', '미확정 배정 확인 정보를 안전하게 저장할 수 없습니다. 브라우저 저장소를 확인하세요.');
            }
            let raw;
            try { raw = storage.getItem(RECOVERY_STORAGE_KEY); }
            catch (cause) { throw error('RECOVERY_STORAGE_UNAVAILABLE', '미확정 배정 확인 정보를 읽을 수 없습니다.', { cause }); }
            if (!raw) return [];
            try {
                const parsed = JSON.parse(raw);
                if (parsed?.schemaVersion !== RECOVERY_SCHEMA || !Array.isArray(parsed.operations) ||
                    parsed.operations.some(operation => !validRecoveryOperation(operation))) throw new Error('invalid receipt schema or operation identity');
                return parsed.operations;
            } catch (cause) {
                throw error('RECOVERY_RECEIPT_INVALID', '미확정 배정 확인 정보가 손상되어 새 시험을 안전하게 시작할 수 없습니다.', { cause });
            }
        }

        function writeRecoveryOperations(operations) {
            const storage = recoveryStorage();
            if (!storage || typeof storage.setItem !== 'function') {
                throw error('RECOVERY_STORAGE_UNAVAILABLE', '미확정 배정 확인 정보를 안전하게 저장할 수 없습니다.');
            }
            try {
                if (!operations.length && typeof storage.removeItem === 'function') {
                    storage.removeItem(RECOVERY_STORAGE_KEY);
                    return;
                }
                const value = JSON.stringify({ schemaVersion: RECOVERY_SCHEMA, operations });
                if (byteLength(value) > MAX_RECOVERY_RECEIPT_BYTES) {
                    throw error('RECOVERY_RECEIPT_TOO_LARGE', '미확정 배정 확인 정보가 너무 커 새 시험을 안전하게 시작할 수 없습니다.');
                }
                storage.setItem(RECOVERY_STORAGE_KEY, value);
            } catch (cause) {
                if (cause?.code) throw cause;
                throw error('RECOVERY_STORAGE_UNAVAILABLE', '미확정 배정 확인 정보를 저장하지 못해 시험을 배정하지 않았습니다.', { cause });
            }
        }

        function recoveryReceiptFor(plan) {
            return {
                schemaVersion: RECOVERY_SCHEMA,
                operationId: plan.operationId,
                signature: plan.signature,
                ...(plan.recommendationMode ? { recommendationMode: plan.recommendationMode } : {}),
                title: plan.title,
                examDate: plan.examDate,
                indexVersion: plan.indexVersion,
                createdAt: plan.createdAt,
                cohorts: plan.cohorts.map(cohort => ({
                    cohortIndex: cohort.cohortIndex,
                    classId: cohort.classId,
                    grade: cohort.grade,
                    recipientSignature: cohort.recipientSignature,
                    uidCount: cohort.questionUids.length,
                    uidOrderPacked: packUidOrder(cohort.questionUids),
                    contentBatches: cohort.contentBatches.map(batch => ({
                        contentGrade: batch.contentGrade,
                        saveBatchId: batch.saveBatchId,
                        papers: batch.papers.map((paper, partIndex) => ({
                            partIndex,
                            paperIndex: paper.paperIndex,
                            paperCount: paper.paperCount,
                            sequenceStart: paper.sequenceStart,
                            sequenceEnd: paper.sequenceEnd,
                            assignmentBatchId: paper.assignmentBatchId,
                            title: paper.title,
                            examDate: paper.examDate,
                            questionCount: paper.questionUids.length,
                        })),
                    })),
                })),
            };
        }

        function saveOperationReceipt(plan) {
            const operations = readRecoveryOperations();
            const classIds = new Set(plan.cohorts.map(cohort => cohort.classId));
            const conflict = operations.find(operation => operation.operationId !== plan.operationId &&
                (operation.cohorts || []).some(cohort => classIds.has(text(cohort.classId))));
            if (conflict) {
                throw error('RECOVERY_REQUIRED', '이 반에 미확정 배정이 있습니다. 먼저 미확정 배정을 확인하세요.', {
                    operationId: conflict.operationId,
                    classIds: [...new Set((conflict.cohorts || []).map(cohort => text(cohort.classId)).filter(Boolean))],
                });
            }
            const receipt = recoveryReceiptFor(plan);
            const next = operations.filter(operation => operation.operationId !== plan.operationId);
            next.push(receipt);
            writeRecoveryOperations(next);
        }

        function clearOperationReceipts(operationIds) {
            const clear = new Set(operationIds);
            const operations = readRecoveryOperations().filter(operation => !clear.has(operation.operationId));
            writeRecoveryOperations(operations);
        }

        async function requestJson({ method, path, body, headers }) {
            if (!isOnline()) throw error('OFFLINE', '인터넷 연결을 확인한 뒤 같은 작업에서 다시 시도하세요.', { status: 0, offline: true });
            let response;
            try {
                response = await requestTransport({ method, path, body, headers: headers || {} });
            } catch (cause) {
                if (cause?.code || cause?.status) throw cause;
                throw error('TRANSPORT_ERROR', cause?.message || '서버 요청 결과를 확인할 수 없습니다.', { cause });
            }
            if (response && typeof response.json === 'function') {
                const status = Number(response.status || 0);
                const payload = await response.json().catch(() => ({}));
                if (!response.ok) throw error(payload?.error ? 'HTTP_ERROR' : 'HTTP_ERROR', payload?.error || `HTTP ${status}`, { status, data: payload });
                return payload;
            }
            if (plainObject(response) && Number.isInteger(Number(response.status)) && plainObject(response.data)) {
                const status = Number(response.status);
                if (status < 200 || status >= 300) throw error('HTTP_ERROR', response.data.error || `HTTP ${status}`, { status, data: response.data });
                return response.data;
            }
            if (plainObject(response) && response.success === false && response.saved !== true) {
                throw error('REQUEST_REJECTED', response.error || response.message || '서버 요청에 실패했습니다.', { status: Number(response.status || 400), data: response });
            }
            return response || {};
        }

        function operationState(plan) {
            if (!plainObject(plan) || plan.contractVersion !== CONTRACT_VERSION || !UUID_V4.test(text(plan.operationId))) {
                throw error('INVALID_PLAN', '클리닉 시험 배정 계획을 확인할 수 없습니다.');
            }
            let state = states.get(plan);
            if (state) return state;
            state = {
                cohorts: plan.cohorts.map(cohort => ({
                    saveBatches: cohort.contentBatches.map(batch => ({
                        status: 'PLANNED', paperIds: [],
                        assignments: batch.papers.map(() => ({ status: 'PLANNED', assignmentId: null, pdfFailure: '' }))
                    }))
                }))
            };
            states.set(plan, state);
            return state;
        }

        function planSelections(input) {
            const title = text(input.title);
            const examDate = dateString(input.examDate);
            const indexVersion = text(input.indexVersion);
            if (!title || title.length > 150) throw error('INVALID_TITLE', '시험 제목은 1~150자로 입력하세요.');
            if (!examDate) throw error('INVALID_EXAM_DATE', '시험 날짜를 확인해 주세요.');
            if (!indexVersion || indexVersion.length > 2000) throw error('INVALID_INDEX_VERSION', '현재 Archive 2.0 문항 목록 버전을 확인할 수 없습니다.');
            if (typeof archive2Core?.gradeRank !== 'function' || typeof archive2Core?.pathKey !== 'function') {
                throw error('ARCHIVE2_CORE_UNAVAILABLE', 'Archive 2.0 canonical helper를 불러오지 못했습니다.');
            }
            const recommendationMode = text(input.recommendationMode).toLowerCase();
            if (recommendationMode && !['same_uid', 'similar_uid'].includes(recommendationMode)) {
                throw error('INVALID_RECOMMENDATION_MODE', '후속 추천 방식이 올바르지 않습니다.');
            }
            const recommendationOptions = normalizedRecommendationOptions(input.recommendationOptions);
            const rawSelections = Array.isArray(input.selections) ? input.selections : [];
            const grouped = new Map();
            const studentSequenceByClass = new Map();
            const studentsSeen = new Set();
            for (const selection of rawSelections) {
                const cls = classOf(selection);
                const studentId = text(selection?.studentId || selection?.student_id);
                if (!cls.classId || !studentId) throw error('INVALID_RECIPIENT', '반과 수신 학생을 모두 확인해 주세요.');
                const targetGradeRank = archive2Core.gradeRank(cls.grade);
                if (!Number.isFinite(targetGradeRank) || targetGradeRank <= 0) {
                    throw error('TARGET_GRADE_UNRESOLVED', '받는 반의 학년을 확인할 수 없어 시험으로 배정할 수 없습니다.');
                }
                const rawItems = Array.isArray(selection.items) ? selection.items : [];
                const itemModes = rawItems.map(entry => text(entry?.candidate?.followUpMode || entry?.followUpMode).toLowerCase());
                if (recommendationMode
                    ? itemModes.length !== rawItems.length || itemModes.some(itemMode => itemMode !== recommendationMode)
                    : itemModes.some(Boolean)) {
                    throw error('FOLLOW_UP_MODE_MISMATCH', '선택한 후속 추천 방식과 문항 정보가 일치하지 않습니다.');
                }
                const items = rawItems.map(entry => itemFacts(entry, archive2Core, targetGradeRank));
                if (!items.length) continue;
                const studentKey = `${cls.classId}|${studentId}`;
                if (studentsSeen.has(studentKey)) throw error('DUPLICATE_RECIPIENT', '한 학생이 같은 배정에 두 번 포함되어 있습니다.');
                studentsSeen.add(studentKey);
                const uids = items.map(item => item.uid);
                if (new Set(uids).size !== uids.length) throw error('DUPLICATE_QUESTION_UID', '선택 문항에 같은 UID가 두 번 들어 있습니다.');
                const key = `${cls.classId}|${stableStringify(uids)}`;
                const previousSequence = studentSequenceByClass.get(studentKey);
                if (previousSequence && previousSequence !== key) {
                    throw error('RECIPIENT_SEQUENCE_CONFLICT', '같은 학생에게 서로 다른 추천 문항 순서가 들어왔습니다. 선택을 다시 확인하세요.');
                }
                studentSequenceByClass.set(studentKey, key);
                if (!grouped.has(key)) grouped.set(key, {
                    classId: cls.classId, className: cls.className, grade: cls.grade,
                    questionUids: uids, items, studentIds: new Set()
                });
                const cohort = grouped.get(key);
                if (cohort.grade !== cls.grade) throw error('RECIPIENT_GRADE_CONFLICT', '같은 반의 학년 정보가 일치하지 않습니다.');
                cohort.studentIds.add(studentId);
            }
            if (!grouped.size) throw error('NO_SELECTED_RECOMMENDATIONS', '시험으로 배정할 추천 문항을 선택하세요.');

            const operationId = makeUuid(createId);
            const coverage = safeCoverage(input.coverage);
            const cohorts = [];
            let cohortIndex = 0;
            for (const group of grouped.values()) {
                const studentIds = [...group.studentIds].sort();
                if (group.items.length > MAX_QUESTIONS_PER_STUDENT) {
                    throw error('PAPER_LIMIT_EXCEEDED', '학생별 유형 보충 시험은 최대 400문항까지 준비할 수 있습니다.');
                }
                const gradeRuns = sourceRuns(group.items);
                const contentBatches = [];
                let globalPaperIndex = 0;
                const allPaperSpecs = [];
                let sequenceStart = 1;
                for (const run of gradeRuns) {
                    const papers = [];
                    for (let offset = 0; offset < run.items.length; offset += MAX_PAPER_QUESTIONS) {
                        const part = run.items.slice(offset, offset + MAX_PAPER_QUESTIONS);
                        papers.push({
                            items: part,
                            sequenceStart: sequenceStart + offset,
                            sequenceEnd: sequenceStart + offset + part.length - 1,
                        });
                    }
                    if (!papers.length || papers.length > MAX_PAPERS_PER_BATCH) {
                        throw error('PAPER_LIMIT_EXCEEDED', '한 학년 범위의 보충 시험은 최대 400문항까지 저장할 수 있습니다.');
                    }
                    const filters = {
                        grade: run.grade,
                        primaryPaths: unique(run.items.map(item => item.pathKey)),
                        sourceFiles: unique(run.items.map(item => item.sourceFile)),
                        scopeQuestionUids: run.items.map(item => item.uid),
                    };
                    const saveBatchId = makeUuid(createId);
                    const batchPaperSpecs = papers.map(part => {
                        globalPaperIndex++;
                        const paper = {
                            paperIndex: globalPaperIndex,
                            items: part.items,
                            questionUids: part.items.map(item => item.uid),
                            recommendationMode: recommendationMode || 'similar_uid',
                            sequenceStart: part.sequenceStart,
                            sequenceEnd: part.sequenceEnd,
                            contentGrade: run.grade,
                            filters: clone(filters),
                            assignmentBatchId: makeUuid(createId),
                        };
                        allPaperSpecs.push(paper);
                        return paper;
                    });
                    contentBatches.push({ contentGrade: run.grade, saveBatchId, papers: batchPaperSpecs });
                    sequenceStart += run.items.length;
                }
                const paperCount = allPaperSpecs.length;
                for (const batch of contentBatches) {
                    for (const paper of batch.papers) {
                        const suffix = paperCount > 1 ? ` · ${paper.paperIndex}/${paperCount}` : '';
                        paper.title = `${title.slice(0, Math.max(1, 150 - suffix.length))}${suffix}`;
                        paper.examDate = examDate;
                        paper.operationId = operationId;
                        paper.cohortIndex = cohortIndex;
                        paper.paperCount = paperCount;
                    }
                }
                const summary = {
                    schemaVersion: CONTRACT_VERSION,
                    kind: recommendationMode ? 'FOLLOW_UP' : 'TRANSFER',
                    ...(recommendationMode ? { recommendationMode } : {}),
                    operationId,
                    cohortIndex,
                    paperCount,
                    requestedCount: recommendationOptions.countPerStudent,
                    returnedCount: group.items.length,
                    recommendationOptions: clone(recommendationOptions),
                    candidateCatalogVersion: indexVersion,
                    coverage: clone(coverage),
                    questionUids: [],
                };
                for (const batch of contentBatches) {
                    const saveBody = {
                        schema_version: SAVED_PAPER_SCHEMA,
                        save_batch_id: batch.saveBatchId,
                        index_version: indexVersion,
                        selection_filters: batch.papers[0].filters,
                        include_extended: true,
                        papers: batch.papers.map(paper => {
                            const questionUids = paper.items.map(item => item.uid);
                            const marker = {
                                ...summary,
                                paperIndex: paper.paperIndex,
                                sequenceStart: paper.sequenceStart,
                                sequenceEnd: paper.sequenceEnd,
                                contentGrade: paper.contentGrade,
                                returnedCount: group.items.length,
                                questionUids,
                            };
                            const paperTitle = paper.title;
                            const filters = paper.filters;
                            const subject = typeof archive2Core.subjectProjectionLabel === 'function'
                                ? archive2Core.subjectProjectionLabel(filters)
                                : text(filters.courseKey || paper.items[0]?.candidate?.courseKey || '수학');
                            const meta = {
                                title: paperTitle,
                                customTitle: title,
                                identityTitle: paperTitle,
                                count: paper.items.length,
                                grade: paper.contentGrade,
                                subject,
                                questionUids,
                                printHeaderOptions: {
                                    title: paperTitle,
                                    subtitle: recommendationMode === 'same_uid' ? '같은 문항 다시 연습'
                                        : recommendationMode === 'similar_uid' ? '다른 유사 문항 보충' : '유형 보충 시험',
                                },
                                includeQr: true,
                                qpp: 4,
                                sourceType: 'mixed',
                                indexVersion,
                                clinicRecommendationAssessment: marker,
                            };
                            return {
                                part_index: paper.paperIndex - (batch.papers[0].paperIndex),
                                questions: paper.items.map(item => clone(item.question)),
                                meta,
                            };
                        }),
                    };
                    batch.saveBody = saveBody;
                }
                cohorts.push({
                    cohortIndex,
                    classId: group.classId,
                    className: group.className,
                    grade: group.grade,
                    studentIds,
                    questionUids: [...group.questionUids],
                    contentBatches,
                });
                cohortIndex++;
            }
            const plan = {
                contractVersion: CONTRACT_VERSION,
                operationId,
                title,
                examDate,
                indexVersion,
                recommendationOptions,
                ...(recommendationMode ? { recommendationMode } : {}),
                coverage,
                cohorts,
                createdAt: new Date().toISOString(),
            };
            return plan;
        }

        function verifySavedBatch(data, batch) {
            if (data?.saved !== true || !Array.isArray(data.papers) || data.papers.length !== batch.papers.length) {
                throw error('SAVED_PAPER_RECEIPT_MISMATCH', '저장된 시험지 묶음의 문항 수를 확인할 수 없습니다.');
            }
            const rows = [...data.papers].sort((a, b) => Number(a.part_index) - Number(b.part_index));
            for (let index = 0; index < rows.length; index++) {
                if (Number(rows[index].part_index) !== index || Number(rows[index].part_count) !== rows.length ||
                    Number(rows[index].question_count) !== batch.papers[index].items.length || !text(rows[index].id)) {
                    throw error('SAVED_PAPER_RECEIPT_MISMATCH', '저장된 시험지와 현재 선택 문항 순서가 일치하지 않습니다.');
                }
            }
            return rows.map(row => text(row.id));
        }

        async function readSaveBatch(batch) {
            const path = `archive-saved-papers/save-batches/${encodeURIComponent(batch.saveBatchId)}`;
            return requestJson({ method: 'GET', path });
        }

        async function resolveSavedBatch(batch, state) {
            try {
                const data = await readSaveBatch(batch);
                if (data?.saved === true) {
                    state.paperIds = verifySavedBatch(data, batch);
                    state.status = 'SAVED';
                    return 'saved';
                }
                if (data?.found === false && data?.saved !== true) return 'absent';
                return 'unknown';
            } catch {
                return 'unknown';
            }
        }

        async function saveBatch(batch, state, onProgress) {
            if (state.status === 'SAVED') return true;
            const hadUncertainOutcome = state.status === 'SAVE_OUTCOME_UNKNOWN';
            if (state.status === 'SAVE_OUTCOME_UNKNOWN') {
                const recovery = await resolveSavedBatch(batch, state);
                if (recovery === 'saved') { onProgress?.(); return true; }
                if (recovery === 'unknown') return false;
            }
            state.status = 'SAVING';
            onProgress?.();
            try {
                const data = await requestJson({ method: 'POST', path: 'archive-saved-papers', body: batch.saveBody });
                state.paperIds = verifySavedBatch(data, batch);
                state.status = 'SAVED';
                onProgress?.();
                return true;
            } catch (firstError) {
                if (firstError?.code === 'OFFLINE') {
                    state.status = hadUncertainOutcome ? 'SAVE_OUTCOME_UNKNOWN' : 'FAILED';
                    state.error = firstError.message;
                    onProgress?.();
                    return false;
                }
                if (Number(firstError?.status) >= 400 && Number(firstError?.status) < 500) {
                    state.status = 'FAILED';
                    state.error = firstError.message;
                    onProgress?.();
                    return false;
                }
                state.status = 'SAVE_OUTCOME_UNKNOWN';
                onProgress?.();
                const recovery = await resolveSavedBatch(batch, state);
                if (recovery === 'saved') { onProgress?.(); return true; }
                if (recovery === 'unknown') return false;
                // The exact same body and save_batch_id make this retry idempotent.
                try {
                    const data = await requestJson({ method: 'POST', path: 'archive-saved-papers', body: batch.saveBody });
                    state.paperIds = verifySavedBatch(data, batch);
                    state.status = 'SAVED';
                    onProgress?.();
                    return true;
                } catch (retryError) {
                    if (retryError?.code === 'OFFLINE') {
                        state.status = 'SAVE_OUTCOME_UNKNOWN';
                        state.error = retryError.message;
                        onProgress?.();
                        return false;
                    }
                    if (Number(retryError?.status) >= 400 && Number(retryError?.status) < 500) {
                        state.status = 'FAILED';
                        state.error = retryError.message;
                        onProgress?.();
                        return false;
                    }
                    state.status = 'SAVE_OUTCOME_UNKNOWN';
                    onProgress?.();
                    const finalRecovery = await resolveSavedBatch(batch, state);
                    return finalRecovery === 'saved';
                }
            }
        }

        function assignmentFile(paperId, assignmentBatchId) {
            return `MIXED:archive2-saved-${paperId}-${assignmentBatchId}`;
        }

        function assignmentPayload(assignment) {
            const parsed = parseAssignmentPayload(assignment);
            return parsed;
        }

        async function resolveAssignment(cohort, paper, paperId, state) {
            const query = new URLSearchParams({ class: cohort.classId, exam_title: paper.title });
            // The existing by-class route accepts `exam`, and leaves assignments complete.
            query.delete('exam_title');
            query.set('exam', paper.title);
            const data = await requestJson({ method: 'GET', path: `exam-sessions/by-class?${query.toString()}` });
            if (data?.success !== true || !Array.isArray(data.assignments)) return { status: 'unknown' };
            const file = assignmentFile(paperId, paper.assignmentBatchId);
            const matches = data.assignments.filter(row =>
                text(row.id) && text(row.class_id) === cohort.classId &&
                text(row.exam_date) === paper.examDate && text(row.exam_title) === paper.title &&
                text(row.archive_file) === file && text(row.saved_paper_id) === paperId &&
                Number(row.question_count) === paper.questionUids.length);
            if (matches.length > 1) return { status: 'conflict' };
            if (!matches.length) return { status: 'absent' };
            const assignment = matches[0];
            const parsed = assignmentMarker(assignment);
            if (!parsed || stableStringify(parsed.questionUids) !== stableStringify(paper.questionUids) ||
                parsed.recommendationMode !== (paper.recommendationMode || 'similar_uid') ||
                text(parsed.marker.operationId) !== paper.operationId ||
                Number(parsed.marker.cohortIndex) !== paper.cohortIndex ||
                Number(parsed.marker.paperIndex) !== paper.paperIndex ||
                Number(parsed.marker.paperCount) !== paper.paperCount ||
                text(parsed.marker.signature) !== paper.operationSignature) return { status: 'conflict' };
            const status = await requestJson({ method: 'GET', path: `class-exam-assignments/${encodeURIComponent(assignment.id)}/status` });
            if (status?.success !== true || !Array.isArray(status.students) ||
                !text(status.assignment?.id) || text(status.assignment.id) !== text(assignment.id)) return { status: 'unknown' };
            const activeIds = status.students.filter(row => Number(row.excluded || 0) === 0).map(row => text(row.student_id)).filter(Boolean);
            if (!sameSorted(activeIds, cohort.studentIds)) return { status: 'conflict' };
            state.assignmentId = text(assignment.id);
            state.pdfFailure = text(assignment.pdf_error || '');
            return { status: 'assigned', assignment, recovered: true };
        }

        function assignmentBody(cohort, paper, paperId, examDate) {
            return {
                contract_version: ARCHIVE2_CONTRACT,
                saved_paper_id: paperId,
                assignment_batch_id: paper.assignmentBatchId,
                class_id: cohort.classId,
                student_ids: [...cohort.studentIds],
                exam_date: examDate,
            };
        }

        function assignmentCommitted(data, cohort, paper, paperId, state) {
            const assignment = data?.assignment;
            const id = text(assignment?.id);
            const questionUids = Array.isArray(data?.question_uids) ? data.question_uids.map(text) : [];
            const parsed = assignmentMarker(assignment);
            if (data?.saved !== true || !id || text(assignment.class_id) !== cohort.classId ||
                text(assignment.exam_title) !== paper.title || text(assignment.exam_date) !== paper.examDate ||
                text(assignment.saved_paper_id) !== paperId ||
                text(assignment.archive_file) !== assignmentFile(paperId, paper.assignmentBatchId) ||
                Number(assignment.question_count) !== paper.questionUids.length ||
                questionUids.length !== paper.questionUids.length ||
                stableStringify(questionUids) !== stableStringify(paper.questionUids) ||
                !parsed || parsed.recommendationMode !== (paper.recommendationMode || 'similar_uid') ||
                stableStringify(parsed.questionUids) !== stableStringify(paper.questionUids) ||
                text(parsed.marker.operationId) !== paper.operationId ||
                Number(parsed.marker.cohortIndex) !== paper.cohortIndex ||
                Number(parsed.marker.paperIndex) !== paper.paperIndex ||
                Number(parsed.marker.paperCount) !== paper.paperCount ||
                text(parsed.marker.signature) !== paper.operationSignature) return false;
            state.assignmentId = id;
            state.pdfFailure = text(data.pdfFailure || assignment.pdf_error || data.error || '');
            state.status = 'ASSIGNED';
            return true;
        }

        async function postAssignment(cohort, paper, paperId, plan, state, onProgress) {
            if (state.status === 'ASSIGNED') return true;
            const hadUncertainOutcome = state.status === 'ASSIGNMENT_OUTCOME_UNKNOWN';
            if (state.status === 'ASSIGNMENT_OUTCOME_UNKNOWN') {
                let recovery;
                try { recovery = await resolveAssignment(cohort, paper, paperId, state); }
                catch { return false; }
                if (recovery.status === 'assigned') { state.status = 'ASSIGNED'; onProgress?.(); return true; }
                if (recovery.status !== 'absent') return false;
            }
            const body = assignmentBody(cohort, paper, paperId, plan.examDate);
            const send = async () => requestJson({
                method: 'POST',
                path: 'class-exam-assignments',
                headers: { 'X-Archive2-Contract': ARCHIVE2_CONTRACT },
                body,
            });
            state.status = 'ASSIGNING';
            onProgress?.();
            try {
                const data = await send();
                if (assignmentCommitted(data, cohort, paper, paperId, state)) {
                    onProgress?.();
                    return true;
                }
                throw error('ASSIGNMENT_RECEIPT_MISMATCH', data?.error || '시험 배정 결과를 확인할 수 없습니다.', { data });
            } catch (firstError) {
                const firstData = firstError?.data;
                if (firstData?.saved === true && assignmentCommitted(firstData, cohort, paper, paperId, state)) {
                    onProgress?.();
                    return true;
                }
                if (firstError?.code === 'OFFLINE') {
                    state.status = hadUncertainOutcome ? 'ASSIGNMENT_OUTCOME_UNKNOWN' : 'FAILED';
                    state.error = firstError.message;
                    onProgress?.();
                    return false;
                }
                if (Number(firstError?.status) >= 400 && Number(firstError?.status) < 500) {
                    state.status = 'FAILED';
                    state.error = firstError.message;
                    onProgress?.();
                    return false;
                }
                state.status = 'ASSIGNMENT_OUTCOME_UNKNOWN';
                onProgress?.();
                let recovery;
                try { recovery = await resolveAssignment(cohort, paper, paperId, state); }
                catch { return false; }
                if (recovery.status === 'assigned') {
                    state.status = 'ASSIGNED';
                    onProgress?.();
                    return true;
                }
                if (recovery.status !== 'absent') return false;
                try {
                    const data = await send();
                    if (assignmentCommitted(data, cohort, paper, paperId, state)) { onProgress?.(); return true; }
                    throw error('ASSIGNMENT_RECEIPT_MISMATCH', data?.error || '시험 배정 결과를 확인할 수 없습니다.', { data });
                } catch (retryError) {
                    if (retryError?.data?.saved === true && assignmentCommitted(retryError.data, cohort, paper, paperId, state)) {
                        onProgress?.();
                        return true;
                    }
                    if (retryError?.code === 'OFFLINE') {
                        state.status = 'ASSIGNMENT_OUTCOME_UNKNOWN';
                        state.error = retryError.message;
                        onProgress?.();
                        return false;
                    }
                    if (Number(retryError?.status) >= 400 && Number(retryError?.status) < 500) {
                        state.status = 'FAILED';
                        state.error = retryError.message;
                        onProgress?.();
                        return false;
                    }
                    state.status = 'ASSIGNMENT_OUTCOME_UNKNOWN';
                    onProgress?.();
                    try {
                        const finalRecovery = await resolveAssignment(cohort, paper, paperId, state);
                        if (finalRecovery.status === 'assigned') {
                            state.status = 'ASSIGNED';
                            onProgress?.();
                            return true;
                        }
                    } catch { /* preserve outcome unknown */ }
                    return false;
                }
            }
        }

        async function createPlan(input = {}) {
            const requestedClassIds = unique((Array.isArray(input.selections) ? input.selections : [])
                .map(selection => classOf(selection).classId));
            const existingReceipts = readRecoveryOperations();
            const blocked = existingReceipts.find(operation =>
                (operation.cohorts || []).some(cohort => requestedClassIds.includes(text(cohort.classId))));
            if (blocked) {
                throw error('RECOVERY_REQUIRED', '이 반에 미확정 배정이 있습니다. 먼저 미확정 배정을 확인하세요.', {
                    operationId: blocked.operationId,
                    classIds: [...new Set((blocked.cohorts || []).map(cohort => text(cohort.classId)).filter(Boolean))],
                });
            }
            const rawPlan = planSelections(input);
            for (const cohort of rawPlan.cohorts) {
                cohort.recipientSignature = await sha256Hex(stableStringify([...cohort.studentIds].sort()), options.crypto || globalThis.crypto);
            }
            const signatureInput = {
                contractVersion: rawPlan.contractVersion,
                operationId: rawPlan.operationId,
                title: rawPlan.title,
                examDate: rawPlan.examDate,
                indexVersion: rawPlan.indexVersion,
                recommendationOptions: rawPlan.recommendationOptions,
                coverage: rawPlan.coverage,
                cohorts: rawPlan.cohorts.map(cohort => ({
                    cohortIndex: cohort.cohortIndex,
                    classId: cohort.classId,
                    grade: cohort.grade,
                    recipientSignature: cohort.recipientSignature,
                    questionUids: cohort.questionUids,
                    contentBatches: cohort.contentBatches.map(batch => ({
                        saveBatchId: batch.saveBatchId,
                        contentGrade: batch.contentGrade,
                        papers: batch.papers.map(paper => ({
                            assignmentBatchId: paper.assignmentBatchId,
                            paperIndex: paper.paperIndex,
                            paperCount: paper.paperCount,
                            sequenceStart: paper.sequenceStart,
                            sequenceEnd: paper.sequenceEnd,
                            title: paper.title,
                            examDate: paper.examDate,
                            selectionFilters: paper.filters,
                            items: paper.items.map(item => [
                                item.uid, item.sourceFile, item.sourceOrdinal, item.sourceGrade, item.pathKey,
                                text(item.candidate.sourceFingerprint),
                                plainObject(item.candidate.canonicalMeta) ? item.candidate.canonicalMeta : {},
                            ]),
                        })),
                    })),
                })),
            };
            if (rawPlan.recommendationMode) signatureInput.recommendationMode = rawPlan.recommendationMode;
            rawPlan.signature = await sha256Hex(stableStringify(signatureInput), options.crypto || globalThis.crypto);
            for (const cohort of rawPlan.cohorts) {
                for (const batch of cohort.contentBatches) {
                    for (const paper of batch.saveBody.papers) {
                        paper.meta.clinicRecommendationAssessment.signature = rawPlan.signature;
                    }
                    for (const paper of batch.papers) paper.operationSignature = rawPlan.signature;
                }
            }
            // Date, recipient, and assignment IDs are frozen in this object and never regenerated by issue().
            return freezeDeep(rawPlan);
        }

        async function issue(plan, issueOptions = {}) {
            const state = operationState(plan);
            // Persist only operation identity before the first write. Question bodies and recipient IDs stay in memory.
            saveOperationReceipt(plan);
            const onProgress = typeof issueOptions.onProgress === 'function'
                ? () => issueOptions.onProgress(summaryState(plan, state)) : null;
            let stop = false;
            for (let cohortIndex = 0; cohortIndex < plan.cohorts.length && !stop; cohortIndex++) {
                const cohort = plan.cohorts[cohortIndex];
                const cohortState = state.cohorts[cohortIndex];
                for (let batchIndex = 0; batchIndex < cohort.contentBatches.length && !stop; batchIndex++) {
                    const batch = cohort.contentBatches[batchIndex];
                    const batchState = cohortState.saveBatches[batchIndex];
                    const saved = await saveBatch(batch, batchState, onProgress);
                    if (!saved) { stop = true; break; }
                    for (let paperIndex = 0; paperIndex < batch.papers.length; paperIndex++) {
                        const paper = batch.papers[paperIndex];
                        const assignmentState = batchState.assignments[paperIndex];
                        if (assignmentState.status === 'ASSIGNED') continue;
                        const assigned = await postAssignment(cohort, paper, batchState.paperIds[paperIndex], plan, assignmentState, onProgress);
                        if (!assigned) { stop = true; break; }
                    }
                }
            }
            const result = summaryState(plan, state);
            if (result.status === 'ASSIGNED') {
                try {
                    clearOperationReceipts([plan.operationId]);
                    result.recoveryReceiptPending = false;
                } catch (recoveryError) {
                    result.recoveryReceiptPending = true;
                    result.recoveryError = recoveryError.message;
                }
            } else result.recoveryReceiptPending = true;
            return result;
        }

        async function reconcile(input = {}) {
            const classId = text(input.classId || input.class_id);
            if (!classId) throw error('CLASS_REQUIRED', '반을 확인할 수 없습니다.');
            const stored = readRecoveryOperations();
            const matching = stored.filter(operation =>
                (operation.cohorts || []).some(cohort => text(cohort.classId) === classId));
            if (!matching.length) return { classId, status: 'CLEAR', unlocked: true, operations: [] };

            const clearIds = [];
            const operations = [];
            for (const operation of matching) {
                let committed = 0;
                let absent = 0;
                let unknown = 0;
                let savedPaperOnlyCount = 0;
                const cohorts = [];
                for (const cohort of operation.cohorts || []) {
                    const orderedUids = unpackUidOrder(cohort.uidOrderPacked, cohort.uidCount);
                    const papers = [];
                    if (!orderedUids || !text(cohort.classId) || !/^[0-9a-f]{64}$/i.test(text(cohort.recipientSignature))) {
                        unknown++;
                        cohorts.push({ classId: text(cohort.classId), cohortIndex: cohort.cohortIndex, status: 'UNRESOLVED', papers });
                        continue;
                    }
                    for (const batch of cohort.contentBatches || []) {
                        let savedBatch;
                        try {
                            savedBatch = await requestJson({
                                method: 'GET',
                                path: `archive-saved-papers/save-batches/${encodeURIComponent(batch.saveBatchId)}`,
                            });
                        } catch {
                            unknown += (batch.papers || []).length;
                            papers.push(...(batch.papers || []).map(paper => ({
                                paperIndex: paper.paperIndex,
                                assignmentBatchId: paper.assignmentBatchId,
                                status: 'UNRESOLVED',
                                reason: 'save_batch_query_unavailable',
                            })));
                            continue;
                        }
                        if (savedBatch?.found === false && savedBatch?.saved !== true) {
                            for (const paper of batch.papers || []) {
                                absent++;
                                papers.push({ paperIndex: paper.paperIndex, assignmentBatchId: paper.assignmentBatchId, status: 'ABSENT', reason: 'save_batch_absent' });
                            }
                            continue;
                        }
                        const savedRows = [...(Array.isArray(savedBatch?.papers) ? savedBatch.papers : [])]
                            .sort((a, b) => Number(a.part_index) - Number(b.part_index));
                        const rowsValid = savedBatch?.saved === true && savedRows.length === (batch.papers || []).length &&
                            savedRows.every((row, index) => Number(row.part_index) === index &&
                                Number(row.part_count) === savedRows.length &&
                                Number(row.question_count) === Number(batch.papers[index]?.questionCount) && text(row.id));
                        if (!rowsValid) {
                            unknown += (batch.papers || []).length;
                            papers.push(...(batch.papers || []).map(paper => ({
                                paperIndex: paper.paperIndex,
                                assignmentBatchId: paper.assignmentBatchId,
                                status: 'UNRESOLVED',
                                reason: 'save_batch_receipt_mismatch',
                            })));
                            continue;
                        }
                        for (const paper of batch.papers || []) {
                            const savedPaperId = text(savedRows[Number(paper.partIndex)]?.id);
                            const start = Number(paper.sequenceStart);
                            const end = Number(paper.sequenceEnd);
                            const questionUids = Number.isInteger(start) && Number.isInteger(end) && start >= 1 && end >= start
                                ? orderedUids.slice(start - 1, end) : [];
                            const paperResult = {
                                paperIndex: Number(paper.paperIndex),
                                assignmentBatchId: text(paper.assignmentBatchId),
                                savedPaperId,
                                status: 'UNRESOLVED',
                            };
                            if (!savedPaperId || questionUids.length !== Number(paper.questionCount)) {
                                unknown++;
                                paperResult.reason = 'receipt_uid_order_mismatch';
                                papers.push(paperResult);
                                continue;
                            }
                            let matches;
                            try {
                                const query = new URLSearchParams({ class: cohort.classId, exam: paper.title });
                                const rows = await requestJson({ method: 'GET', path: `exam-sessions/by-class?${query.toString()}` });
                                if (rows?.success !== true || !Array.isArray(rows.assignments)) throw new Error('assignment rows unavailable');
                                const file = assignmentFile(savedPaperId, paper.assignmentBatchId);
                                matches = rows.assignments.filter(row => text(row.class_id) === text(cohort.classId) &&
                                    text(row.exam_title) === text(paper.title) && text(row.exam_date) === text(paper.examDate) &&
                                    text(row.archive_file) === file && text(row.saved_paper_id) === savedPaperId &&
                                    Number(row.question_count) === Number(paper.questionCount));
                            } catch {
                                unknown++;
                                paperResult.reason = 'assignment_query_unavailable';
                                papers.push(paperResult);
                                continue;
                            }
                            if (!matches.length) {
                                absent++;
                                savedPaperOnlyCount++;
                                paperResult.status = 'ABSENT';
                                paperResult.reason = 'assignment_not_found';
                                papers.push(paperResult);
                                continue;
                            }
                            if (matches.length !== 1) {
                                unknown++;
                                paperResult.reason = 'duplicate_assignment_identity';
                                papers.push(paperResult);
                                continue;
                            }
                            const assignment = matches[0];
                            const parsed = assignmentMarker(assignment);
                            if (!parsed || stableStringify(parsed.questionUids) !== stableStringify(questionUids) ||
                                parsed.recommendationMode !== (operation.recommendationMode || 'similar_uid') ||
                                text(parsed.marker.operationId) !== operation.operationId ||
                                text(parsed.marker.signature) !== operation.signature ||
                                Number(parsed.marker.cohortIndex) !== Number(cohort.cohortIndex) ||
                                Number(parsed.marker.paperIndex) !== Number(paper.paperIndex) ||
                                Number(parsed.marker.paperCount) !== Number(paper.paperCount) ||
                                Number(parsed.marker.sequenceStart) !== start || Number(parsed.marker.sequenceEnd) !== end) {
                                unknown++;
                                paperResult.assignmentId = text(assignment.id);
                                paperResult.reason = 'assignment_marker_mismatch';
                                papers.push(paperResult);
                                continue;
                            }
                            try {
                                const status = await requestJson({ method: 'GET', path: `class-exam-assignments/${encodeURIComponent(assignment.id)}/status` });
                                if (status?.success !== true || !Array.isArray(status.students) || text(status.assignment?.id) !== text(assignment.id)) {
                                    throw new Error('assignment status unavailable');
                                }
                                const activeIds = status.students.filter(row => Number(row.excluded || 0) === 0)
                                    .map(row => text(row.student_id)).filter(Boolean).sort();
                                const signature = await sha256Hex(stableStringify(activeIds), options.crypto || globalThis.crypto);
                                if (signature !== text(cohort.recipientSignature)) throw new Error('recipient snapshot mismatch');
                            } catch {
                                unknown++;
                                paperResult.assignmentId = text(assignment.id);
                                paperResult.reason = 'recipient_snapshot_unavailable_or_mismatch';
                                papers.push(paperResult);
                                continue;
                            }
                            committed++;
                            paperResult.assignmentId = text(assignment.id);
                            paperResult.status = 'COMMITTED';
                            papers.push(paperResult);
                        }
                    }
                    const cohortStatuses = papers.map(paper => paper.status);
                    const cohortStatus = cohortStatuses.length && cohortStatuses.every(status => status === 'COMMITTED') ? 'COMPLETE'
                        : cohortStatuses.length && cohortStatuses.every(status => status === 'ABSENT') ? 'UNWRITTEN'
                        : cohortStatuses.some(status => status === 'COMMITTED') && cohortStatuses.some(status => status === 'ABSENT') ? 'PARTIAL'
                        : 'UNRESOLVED';
                    cohorts.push({ classId: text(cohort.classId), cohortIndex: Number(cohort.cohortIndex), status: cohortStatus, papers });
                }
                const totalPapers = cohorts.reduce((sum, cohort) => sum + cohort.papers.length, 0);
                const operationStatus = unknown ? 'UNRESOLVED'
                    : totalPapers > 0 && committed === totalPapers ? 'COMPLETE'
                    : totalPapers > 0 && absent === totalPapers ? 'UNWRITTEN'
                    : committed && absent ? 'PARTIAL' : 'UNRESOLVED';
                if (operationStatus === 'COMPLETE' || operationStatus === 'UNWRITTEN') clearIds.push(operation.operationId);
                operations.push({
                    operationId: operation.operationId,
                    signature: operation.signature,
                    recommendationMode: operation.recommendationMode || 'similar_uid',
                    title: operation.title,
                    examDate: operation.examDate,
                    status: operationStatus,
                    savedPaperOnlyCount,
                    cohorts,
                });
            }
            if (clearIds.length) clearOperationReceipts(clearIds);
            const stillPending = readRecoveryOperations().some(operation =>
                (operation.cohorts || []).some(cohort => text(cohort.classId) === classId));
            const statuses = operations.map(operation => operation.status);
            const status = !stillPending && statuses.includes('COMPLETE') && statuses.includes('UNWRITTEN') ? 'RESOLVED'
                : !stillPending && statuses.includes('COMPLETE') ? 'COMPLETE'
                : !stillPending && statuses.includes('UNWRITTEN') ? 'UNWRITTEN'
                : statuses.includes('PARTIAL') ? 'PARTIAL' : 'UNRESOLVED';
            return { classId, status, unlocked: !stillPending, operations };
        }

        async function discover(input = {}) {
            const classId = text(input.classId || input.class_id);
            if (!classId) throw error('CLASS_REQUIRED', '반을 확인할 수 없습니다.');
            let assignments = Array.isArray(input.assignments) ? input.assignments : null;
            if (!assignments) {
                const data = await requestJson({ method: 'GET', path: `exam-sessions/by-class?class=${encodeURIComponent(classId)}` });
                if (data?.success !== true || !Array.isArray(data.assignments)) {
                    throw error('ASSIGNMENT_LOOKUP_FAILED', data?.error || '기존 시험 배정 내역을 불러오지 못했습니다.');
                }
                assignments = data.assignments;
            }
            const found = assignments.map(assignment => {
                if (text(assignment.class_id) !== classId) return null;
                const parsed = assignmentMarker(assignment);
                if (!parsed || !text(assignment.saved_paper_id)) return null;
                return {
                    assignmentId: text(assignment.id),
                    classId,
                    examTitle: text(assignment.exam_title),
                    examDate: text(assignment.exam_date),
                    savedPaperId: text(assignment.saved_paper_id),
                    archiveFile: text(assignment.archive_file),
                    questionCount: Number(assignment.question_count),
                    questionUids: [...parsed.questionUids],
                    operationId: text(parsed.marker.operationId),
                    operationSignature: text(parsed.marker.signature),
                    recommendationMode: parsed.recommendationMode,
                    cohortIndex: Number(parsed.marker.cohortIndex),
                    paperIndex: Number(parsed.marker.paperIndex),
                    paperCount: Number(parsed.marker.paperCount),
                    sequenceStart: Number(parsed.marker.sequenceStart),
                    sequenceEnd: Number(parsed.marker.sequenceEnd),
                    requestedCount: Number(parsed.marker.requestedCount),
                    returnedCount: Number(parsed.marker.returnedCount),
                    recommendationOptions: clone(parsed.marker.recommendationOptions || {}),
                    candidateCatalogVersion: text(parsed.marker.candidateCatalogVersion),
                    coverage: clone(parsed.marker.coverage || {}),
                };
            }).filter(Boolean).sort((a, b) =>
                a.examDate.localeCompare(b.examDate) || a.operationId.localeCompare(b.operationId) ||
                a.cohortIndex - b.cohortIndex || a.paperIndex - b.paperIndex || a.assignmentId.localeCompare(b.assignmentId));
            return {
                classId,
                assignments: found,
                coverage: { status: 'complete', source: 'existing_assignment_rows', assignmentCount: assignments.length },
            };
        }

        async function loadResults(input = {}) {
            const classId = text(input.classId || input.class_id);
            const assignmentId = text(input.assignmentId || input.assignment_id);
            if (!classId || !assignmentId) throw error('ASSIGNMENT_REQUIRED', '반과 시험 배정 ID를 확인할 수 없습니다.');
            const path = `exam-sessions/by-class?class=${encodeURIComponent(classId)}&assignment=${encodeURIComponent(assignmentId)}`;
            const data = await requestJson({ method: 'GET', path });
            if (data?.success !== true || !Array.isArray(data.assignments) || !Array.isArray(data.sessions) ||
                !Array.isArray(data.students) || !Array.isArray(data.result_items) || !Array.isArray(data.assignment_questions)) {
                throw error('RESULT_LOOKUP_FAILED', data?.error || '시험 결과 조회 응답을 확인할 수 없습니다.');
            }
            const assignment = data.assignments.find(row => text(row.id) === assignmentId && text(row.class_id) === classId);
            if (!assignment) throw error('ASSIGNMENT_NOT_FOUND', '해당 반의 시험 배정을 찾을 수 없습니다.');
            const parsed = assignmentMarker(assignment);
            if (!parsed) throw error('ASSESSMENT_MARKER_MISSING', '이 시험은 추천 유형 보충 시험 메타데이터가 없습니다.');
            const exclusions = Array.isArray(data.exclusions) ? data.exclusions.filter(row => text(row.assignment_id) === assignmentId) : [];
            const excludedIds = new Set(exclusions.map(row => text(row.student_id)).filter(Boolean));
            const questionRows = data.assignment_questions
                .filter(row => text(row.assignment_id) === assignmentId)
                .sort((a, b) => Number(a.order_no) - Number(b.order_no));
            const expectedUids = parsed.questionUids;
            const assignmentRowsByOrder = new Map();
            for (const row of questionRows) {
                const orderNo = Number(row.order_no);
                if (!Number.isInteger(orderNo) || orderNo < 1) continue;
                if (!assignmentRowsByOrder.has(orderNo)) assignmentRowsByOrder.set(orderNo, []);
                assignmentRowsByOrder.get(orderNo).push(row);
            }
            const bridgeVerified = questionRows.length === expectedUids.length &&
                questionRows.every((row, index) => Number(row.order_no) === index + 1 &&
                    text(row.question_uid) === expectedUids[index] &&
                    text(row.resolution_status).toUpperCase() === 'VERIFIED');
            const resultItemsBySession = new Map();
            for (const row of data.result_items) {
                const sessionId = text(row.session_id || row.sessionId);
                if (!sessionId) continue;
                if (!resultItemsBySession.has(sessionId)) resultItemsBySession.set(sessionId, []);
                resultItemsBySession.get(sessionId).push(row);
            }
            const sessionsByStudent = new Map();
            for (const session of data.sessions.filter(row => text(row.assignment_id) === assignmentId && text(row.class_id) === classId)) {
                const studentId = text(session.student_id);
                if (!studentId) continue;
                if (!sessionsByStudent.has(studentId)) sessionsByStudent.set(studentId, []);
                sessionsByStudent.get(studentId).push(session);
            }
            const students = data.students.map(student => {
                const studentId = text(student.id || student.student_id);
                const excluded = excludedIds.has(studentId);
                const studentSessions = sortByDateNewest(sessionsByStudent.get(studentId) || []);
                const attempts = studentSessions.map(session => {
                    const sessionRows = resultItemsBySession.get(text(session.id)) || [];
                    const result = questionResultsForSession(session, expectedUids, sessionRows, bridgeVerified);
                    const scorePresent = session.score !== null && session.score !== undefined && text(session.score) !== '' && Number.isFinite(Number(session.score));
                    return {
                        sessionId: text(session.id),
                        examDate: text(session.exam_date),
                        updatedAt: text(session.updated_at),
                        score: result.status === 'result' && scorePresent ? Number(session.score) : null,
                        scoreAvailable: result.status === 'result' && scorePresent,
                        questionResults: result.questionResults,
                        status: result.status,
                    };
                });
                const latest = attempts[0] || null;
                const latestSession = studentSessions[0] || null;
                const studentResult = {
                    studentId,
                    studentName: text(student.name),
                    excluded,
                    status: latest ? latest.status : excluded ? 'excluded' : 'pending',
                    sessionId: latest?.sessionId || null,
                    score: latest?.score ?? null,
                    scoreAvailable: latest?.scoreAvailable === true,
                    questionResults: latest?.questionResults || expectedUids.map((questionUid, index) => ({
                        orderNo: index + 1, questionUid, status: 'unresolved', isCorrect: null, reason: 'session_missing'
                    })),
                    attempts,
                };
                if (typeof clinicRecommendations?.buildFollowUpContext === 'function') {
                    studentResult.followUpContext = clinicRecommendations.buildFollowUpContext({
                        student: studentResult,
                        studentId,
                        classId,
                        assignmentId,
                        latestSession,
                        questionResults: studentResult.questionResults,
                        expectedQuestionUids: expectedUids,
                        resultRows: latestSession ? resultItemsBySession.get(text(latestSession.id)) || [] : [],
                        assignmentRowsByOrder,
                        bridgeVerified,
                    });
                } else {
                    studentResult.followUpContext = null;
                }
                return studentResult;
            });
            const resultItemSessionIds = new Set(data.result_items.map(row => text(row.session_id)).filter(Boolean));
            const sessionIds = new Set(data.sessions.map(row => text(row.id)).filter(Boolean));
            const expectedSessionCount = data.sessions.length;
            const missingResultSessionCount = [...sessionIds].filter(id => !resultItemSessionIds.has(id)).length;
            const loaderCoverage = plainObject(data.coverage) ? data.coverage : {};
            const partialAttemptCount = students.reduce((sum, student) =>
                sum + student.attempts.filter(attempt => attempt.status !== 'result').length, 0);
            return {
                assignment: {
                    assignmentId,
                    classId,
                    examTitle: text(assignment.exam_title),
                    examDate: text(assignment.exam_date),
                    savedPaperId: text(assignment.saved_paper_id),
                    questionCount: Number(assignment.question_count),
                    questionUids: [...expectedUids],
                    operationId: text(parsed.marker.operationId),
                    operationSignature: text(parsed.marker.signature),
                    recommendationMode: parsed.recommendationMode,
                    cohortIndex: Number(parsed.marker.cohortIndex),
                    paperIndex: Number(parsed.marker.paperIndex),
                    paperCount: Number(parsed.marker.paperCount),
                    sequenceStart: Number(parsed.marker.sequenceStart),
                    sequenceEnd: Number(parsed.marker.sequenceEnd),
                    requestedCount: Number(parsed.marker.requestedCount),
                    returnedCount: Number(parsed.marker.returnedCount),
                    recommendationOptions: clone(parsed.marker.recommendationOptions || {}),
                },
                students,
                coverage: {
                    status: loaderCoverage.complete === true && bridgeVerified ? 'complete' : 'partial',
                    resultCoverage: bridgeVerified && missingResultSessionCount === 0 && partialAttemptCount === 0 ? 'complete' : 'partial',
                    source: 'exam-sessions/by-class?assignment',
                    exactAssignment: true,
                    sessionLimit: null,
                    sessionCount: expectedSessionCount,
                    resultItemCount: data.result_items.length,
                    missingResultSessionCount,
                    frozenQuestionCount: questionRows.length,
                    expectedQuestionCount: expectedUids.length,
                    frozenQuestionBridgeVerified: bridgeVerified,
                    partialAttemptCount,
                    queryCoverage: loaderCoverage,
                },
            };
        }

        return Object.freeze({
            contractVersion: CONTRACT_VERSION,
            createPlan,
            issue,
            reconcile,
            discover,
            loadResults,
            canonicalResultStatus,
        });
    }

    return Object.freeze({
        CONTRACT_VERSION,
        SAVED_PAPER_SCHEMA,
        MAX_PAPER_QUESTIONS,
        MAX_PAPERS_PER_BATCH,
        MAX_QUESTIONS_PER_STUDENT,
        create,
        canonicalResultStatus,
        assignmentMarker,
        stableStringify,
    });
}));
