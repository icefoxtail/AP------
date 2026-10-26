(function (root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.ClinicRepeat = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
    'use strict';

    // Teacher-confirmed repeat operations for recommended clinic follow-ups.
    //
    // This controller is deliberately transport-only. It never creates an exam,
    // never selects candidates and never decides mastery. A teacher must confirm
    // before a round is reserved, and the existing confirmed recommendation flow
    // performs the actual assignment issue.
    //
    // request contract (same shape as clinic-print's assessment transport):
    //   async ({ method, path, body }) => ({ status: number, data: object })
    //
    // The server is the only authority for settings validation, evidence,
    // revision, round identity and stale guards. The local checks exist only to
    // give immediate form feedback.

    const CONTRACT_VERSION = 'apms-clinic-repeat-client-v1';
    const FEATURE = 'clinic-repeat';
    const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const MAX_CADENCE_DAYS = 365;
    const MAX_ROUNDS = 50;
    const MAX_QUESTIONS = 400;
    const SETTINGS_KEYS = Object.freeze([
        'cadenceDays', 'maxRounds', 'stopOnCompleteNoObservedWrongs',
        'questionCount', 'difficultyBuckets', 'includeSeenQuestionUids', 'note'
    ]);
    const CLOSE_REASONS = Object.freeze(['MANUAL_STOP', 'SOURCE_INELIGIBLE']);
    const UNRESOLVED_REASONS = Object.freeze([
        'ISSUE_OUTCOME_UNKNOWN', 'PARTIAL_ISSUE', 'CLIENT_TIMEOUT', 'OTHER'
    ]);

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function plainObject(value) {
        return Boolean(value && typeof value === 'object' && !Array.isArray(value));
    }

    function integerInRange(value, min, max) {
        const number = Number(value);
        return Number.isInteger(number) && number >= min && number <= max ? number : null;
    }

    function controllerError(code, message, extra = {}) {
        const error = new Error(message);
        error.name = 'ClinicRepeatError';
        error.code = code;
        error.extra = extra;
        return error;
    }

    function isClinicRepeatError(error) {
        return Boolean(error && error.name === 'ClinicRepeatError');
    }

    function isFeatureUnavailable(error) {
        return Boolean(error && error.code === 'FEATURE_UNAVAILABLE');
    }

    function generateUuid() {
        const cryptoProvider = root?.crypto || (typeof globalThis !== 'undefined' ? globalThis.crypto : null);
        if (cryptoProvider && typeof cryptoProvider.randomUUID === 'function') return cryptoProvider.randomUUID();
        if (!cryptoProvider || typeof cryptoProvider.getRandomValues !== 'function') {
            throw controllerError('UUID_UNAVAILABLE', '회차 작업 번호를 만들 수 없습니다.');
        }
        const bytes = new Uint8Array(16);
        cryptoProvider.getRandomValues(bytes);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }

    function readDifficultyBuckets(input, errors) {
        if (!Array.isArray(input) || !input.length) {
            errors.push({ field: 'difficultyBuckets', code: 'INVALID_DIFFICULTY_BUCKETS', message: '난이도는 1~5 중 하나 이상 선택하세요.' });
            return null;
        }
        const buckets = [];
        for (const value of input) {
            const bucket = integerInRange(value, 1, 5);
            if (bucket === null) {
                errors.push({ field: 'difficultyBuckets', code: 'INVALID_DIFFICULTY_BUCKETS', message: '난이도는 1~5 중에서 선택하세요.' });
                return null;
            }
            buckets.push(bucket);
        }
        const sorted = [...new Set(buckets)].sort((a, b) => a - b);
        if (sorted.length !== buckets.length) {
            errors.push({ field: 'difficultyBuckets', code: 'INVALID_DIFFICULTY_BUCKETS', message: '난이도 선택에 중복된 값이 있습니다.' });
            return null;
        }
        return sorted;
    }

    function validateSettings(input) {
        const errors = [];
        if (!plainObject(input)) {
            return {
                valid: false,
                settings: null,
                errors: [{ field: 'settings', code: 'SETTINGS_REQUIRED', message: '반복 설정이 필요합니다.' }]
            };
        }
        for (const key of Object.keys(input)) {
            if (!SETTINGS_KEYS.includes(key)) {
                errors.push({ field: key, code: 'SETTINGS_UNKNOWN_KEY', message: `허용되지 않은 설정 항목입니다: ${key}` });
            }
        }
        const cadenceDays = integerInRange(input.cadenceDays, 1, MAX_CADENCE_DAYS);
        if (cadenceDays === null) {
            errors.push({
                field: 'cadenceDays',
                code: 'INVALID_CADENCE_DAYS',
                message: `재추천 간격은 1~${MAX_CADENCE_DAYS}일 사이 정수로 직접 선택하세요.`
            });
        }
        const maxRounds = integerInRange(input.maxRounds, 1, MAX_ROUNDS);
        if (maxRounds === null) {
            errors.push({
                field: 'maxRounds',
                code: 'INVALID_MAX_ROUNDS',
                message: `최대 회차는 1~${MAX_ROUNDS} 사이 정수로 직접 선택하세요.`
            });
        }
        if (typeof input.stopOnCompleteNoObservedWrongs !== 'boolean') {
            errors.push({
                field: 'stopOnCompleteNoObservedWrongs',
                code: 'INVALID_STOP_ON_NO_WRONGS',
                message: '관측 오답 0일 때 종료할지 직접 선택하세요.'
            });
        }
        const settings = { cadenceDays, maxRounds, stopOnCompleteNoObservedWrongs: input.stopOnCompleteNoObservedWrongs };
        if (input.questionCount !== undefined) {
            const questionCount = integerInRange(input.questionCount, 1, MAX_QUESTIONS);
            if (questionCount === null) {
                errors.push({
                    field: 'questionCount',
                    code: 'INVALID_QUESTION_COUNT',
                    message: `문항 수는 1~${MAX_QUESTIONS} 사이 정수로 입력하세요.`
                });
            } else {
                settings.questionCount = questionCount;
            }
        }
        if (input.difficultyBuckets !== undefined) {
            const buckets = readDifficultyBuckets(input.difficultyBuckets, errors);
            if (buckets) settings.difficultyBuckets = buckets;
        }
        if (input.includeSeenQuestionUids !== undefined) {
            if (typeof input.includeSeenQuestionUids !== 'boolean') {
                errors.push({
                    field: 'includeSeenQuestionUids',
                    code: 'INVALID_INCLUDE_SEEN',
                    message: '이미 푼 문항 포함 여부를 직접 선택하세요.'
                });
            } else {
                settings.includeSeenQuestionUids = input.includeSeenQuestionUids;
            }
        }
        if (input.note !== undefined) {
            const note = text(input.note);
            if (note.length > 500) {
                errors.push({ field: 'note', code: 'INVALID_NOTE', message: '메모는 500자 이내로 입력하세요.' });
            } else if (note) {
                settings.note = note;
            }
        }
        const valid = errors.length === 0;
        return { valid, settings: valid ? Object.freeze(settings) : null, errors };
    }

    function settingsSummary(settings) {
        if (!plainObject(settings)) return '반복 설정 없음';
        const parts = [];
        if (settings.cadenceDays) parts.push(`재추천 ${settings.cadenceDays}일`);
        if (settings.maxRounds) parts.push(`최대 ${settings.maxRounds}회`);
        parts.push(settings.stopOnCompleteNoObservedWrongs
            ? '관측 오답 0이면 종료'
            : '관측 오답 0이어도 계속');
        if (settings.questionCount) parts.push(`검토 문항 ${settings.questionCount}개`);
        if (Array.isArray(settings.difficultyBuckets) && settings.difficultyBuckets.length) {
            parts.push(`난이도 ${settings.difficultyBuckets.join('·')}`);
        }
        if (settings.includeSeenQuestionUids === true) parts.push('이미 푼 문항 포함');
        if (settings.includeSeenQuestionUids === false) parts.push('이미 푼 문항 제외');
        return parts.join(' · ');
    }

    function stateTone(evaluation) {
        const state = text(evaluation?.state);
        if (state === 'CONFIRMATION_NEEDED') return 'ready';
        if (state === 'WAITING_CADENCE') return 'waiting';
        if (state === 'CLOSED') return 'closed';
        return 'check';
    }

    function evaluationLabel(evaluation) {
        if (!plainObject(evaluation)) return '상태 확인 필요';
        return text(evaluation.label) || '상태 확인 필요';
    }

    function findOpenRound(result) {
        const rounds = Array.isArray(result?.rounds) ? result.rounds : [];
        return rounds.find(round => round?.status === 'RESERVED' || round?.status === 'UNRESOLVED') || null;
    }

    function roundLabel(round) {
        if (!plainObject(round)) return '';
        const no = Number(round.roundNo || 0);
        const status = text(round.status);
        const label = status === 'RESERVED' ? '배정 확인 대기'
            : status === 'UNRESOLVED' ? '배정 결과 미확정'
                : status === 'ISSUED' ? '배정 확정'
                    : status === 'RELEASED' ? '해제됨' : status;
        return `${no ? `${no}회차` : '회차'} · ${label}`;
    }

    function scopeKey(scope) {
        return `${text(scope?.classId)}|${text(scope?.studentId)}`;
    }

    function create(options = {}) {
        const request = options.request;
        if (typeof request !== 'function') {
            throw controllerError('REQUEST_REQUIRED', 'API 요청 함수가 필요합니다.');
        }
        const now = typeof options.now === 'function' ? options.now : () => Date.now();
        const onRoundReserved = typeof options.onRoundReserved === 'function' ? options.onRoundReserved : null;
        const generations = new Map();
        const lastRequestIds = new Map();
        // Round -> operation id, used to confirm/mark/release the exact round.
        // It is deliberately NOT used to seed a new reservation: a terminal id
        // must never be re-sent, otherwise a policy becomes single-round per
        // page session and post-release reservations silently fail.
        const operationByRound = new Map();

        function keyOf(kind, scope) {
            return `${kind}|${scopeKey(scope)}`;
        }

        function bump(key) {
            const next = (generations.get(key) || 0) + 1;
            generations.set(key, next);
            return next;
        }

        function isCurrent(key, generation) {
            return (generations.get(key) || 0) === generation;
        }

        function scopeMatches(data, scope) {
            if (!plainObject(data)) return true;
            const dataClass = text(data.classId || data.policy?.classId);
            const dataStudent = text(data.studentId || data.policy?.studentId);
            if (scope.classId && dataClass && dataClass !== text(scope.classId)) return false;
            if (scope.studentId && dataStudent && dataStudent !== text(scope.studentId)) return false;
            return true;
        }

        function rememberRound(policyId, round) {
            const roundId = text(round?.roundId);
            const operationId = text(round?.operationId);
            if (!roundId || !operationId) return null;
            const previous = operationByRound.get(roundId);
            const record = {
                roundId,
                operationId,
                policyId: text(policyId) || previous?.policyId || '',
                status: text(round?.status) || previous?.status || 'RESERVED'
            };
            operationByRound.set(roundId, record);
            return record;
        }

        function operationRecordFor(roundId) {
            return operationByRound.get(text(roundId)) || null;
        }

        async function call({ kind, scope, method, path, body, requestId }) {
            const key = keyOf(kind, scope);
            // Reject an out-of-order request *before* bumping the generation:
            // otherwise a late lower-requestId response would invalidate the
            // newer request that is still in flight and hide fresh data.
            if (requestId !== undefined && requestId !== null) {
                const numeric = Number(requestId);
                if (Number.isFinite(numeric)) {
                    const previous = lastRequestIds.get(key) || 0;
                    if (numeric < previous) return { stale: true, data: null };
                    lastRequestIds.set(key, numeric);
                }
            }
            const generation = bump(key);
            let response;
            try {
                response = await request({ method, path, body });
            } catch (transportError) {
                if (!isCurrent(key, generation)) return { stale: true, data: null };
                throw controllerError('NETWORK_ERROR', '서버에 연결하지 못했습니다. 잠시 후 다시 시도하세요.', {
                    cause: transportError
                });
            }
            if (!isCurrent(key, generation)) return { stale: true, data: null };
            const data = plainObject(response?.data) ? response.data : {};
            const status = Number(response?.status || 0);
            if (status >= 400 || data.success === false) {
                throw controllerError(
                    text(data.code) || 'REQUEST_FAILED',
                    text(data.message) || '요청을 처리하지 못했습니다.',
                    { status, data, available: data.available }
                );
            }
            if (!scopeMatches(data, scope)) {
                return { stale: true, mismatch: true, data: null };
            }
            return { stale: false, data };
        }

        async function list(scope = {}, options = {}) {
            const normalized = { classId: text(scope.classId), studentId: text(scope.studentId) };
            if (!normalized.classId || !normalized.studentId) {
                throw controllerError('SCOPE_REQUIRED', '반과 학생을 선택하세요.');
            }
            const query = `?classId=${encodeURIComponent(normalized.classId)}&studentId=${encodeURIComponent(normalized.studentId)}`;
            const result = await call({
                kind: 'list',
                scope: normalized,
                method: 'GET',
                path: `${FEATURE}/policies${query}`,
                requestId: options.requestId
            });
            return result;
        }

        async function status(scope = {}, options = {}) {
            const normalized = { classId: text(scope.classId), studentId: text(scope.studentId) };
            if (!normalized.classId || !normalized.studentId) {
                throw controllerError('SCOPE_REQUIRED', '반과 학생을 선택하세요.');
            }
            const query = `?classId=${encodeURIComponent(normalized.classId)}&studentId=${encodeURIComponent(normalized.studentId)}`;
            const result = await call({
                kind: 'status',
                scope: normalized,
                method: 'GET',
                path: `${FEATURE}/status${query}`,
                requestId: options.requestId
            });
            return result;
        }

        async function createPolicy(input = {}, options = {}) {
            const scope = { classId: text(input.classId), studentId: text(input.studentId) };
            if (!scope.classId || !scope.studentId) {
                throw controllerError('SCOPE_REQUIRED', '반과 학생을 선택하세요.');
            }
            const sourceAssignmentId = text(input.sourceAssignmentId);
            if (!sourceAssignmentId) {
                throw controllerError('SOURCE_ASSIGNMENT_REQUIRED', '기준 시험 배정을 선택하세요.');
            }
            const validation = validateSettings(input.settings);
            if (!validation.valid) {
                throw controllerError('INVALID_SETTINGS', validation.errors[0]?.message || '반복 설정을 확인하세요.', {
                    errors: validation.errors
                });
            }
            const body = {
                classId: scope.classId,
                studentId: scope.studentId,
                sourceAssignmentId,
                settings: validation.settings
            };
            const sourceSessionId = text(input.sourceSessionId);
            if (sourceSessionId) body.sourceSessionId = sourceSessionId;
            return await call({
                kind: 'policy-create',
                scope,
                method: 'POST',
                path: `${FEATURE}/policies`,
                body,
                requestId: options.requestId
            });
        }

        async function updatePolicy(input = {}, options = {}) {
            const policyId = text(input.policyId);
            const scope = { classId: text(input.classId), studentId: text(input.studentId) };
            if (!policyId) throw controllerError('POLICY_REQUIRED', '반복 정책을 선택하세요.');
            const expectedRevision = integerInRange(input.expectedRevision, 1, Number.MAX_SAFE_INTEGER);
            if (expectedRevision === null) {
                throw controllerError('REVISION_REQUIRED', '정책 revision을 확인할 수 없습니다. 화면을 새로고침하세요.');
            }
            const validation = validateSettings(input.settings);
            if (!validation.valid) {
                throw controllerError('INVALID_SETTINGS', validation.errors[0]?.message || '반복 설정을 확인하세요.', {
                    errors: validation.errors
                });
            }
            return await call({
                kind: `policy:${policyId}`,
                scope,
                method: 'PATCH',
                path: `${FEATURE}/policies/${encodeURIComponent(policyId)}`,
                body: { expectedRevision, settings: validation.settings },
                requestId: options.requestId
            });
        }

        async function closePolicy(input = {}, options = {}) {
            const policyId = text(input.policyId);
            const scope = { classId: text(input.classId), studentId: text(input.studentId) };
            const reason = text(input.reason).toUpperCase() || 'MANUAL_STOP';
            if (!policyId) throw controllerError('POLICY_REQUIRED', '반복 정책을 선택하세요.');
            if (!CLOSE_REASONS.includes(reason)) {
                throw controllerError('INVALID_CLOSE_REASON', '종료 사유를 선택하세요.');
            }
            const expectedRevision = integerInRange(input.expectedRevision, 1, Number.MAX_SAFE_INTEGER);
            if (expectedRevision === null) {
                throw controllerError('REVISION_REQUIRED', '정책 revision을 확인할 수 없습니다. 화면을 새로고침하세요.');
            }
            return await call({
                kind: `policy:${policyId}`,
                scope,
                method: 'POST',
                path: `${FEATURE}/policies/${encodeURIComponent(policyId)}/close`,
                body: { expectedRevision, reason },
                requestId: options.requestId
            });
        }

        async function reopenPolicy(input = {}, options = {}) {
            const policyId = text(input.policyId);
            const scope = { classId: text(input.classId), studentId: text(input.studentId) };
            if (!policyId) throw controllerError('POLICY_REQUIRED', '반복 정책을 선택하세요.');
            const expectedRevision = integerInRange(input.expectedRevision, 1, Number.MAX_SAFE_INTEGER);
            if (expectedRevision === null) {
                throw controllerError('REVISION_REQUIRED', '정책 revision을 확인할 수 없습니다. 화면을 새로고침하세요.');
            }
            return await call({
                kind: `policy:${policyId}`,
                scope,
                method: 'POST',
                path: `${FEATURE}/policies/${encodeURIComponent(policyId)}/reopen`,
                body: { expectedRevision },
                requestId: options.requestId
            });
        }

        async function reserveRound(input = {}, options = {}) {
            const policyId = text(input.policyId);
            const scope = { classId: text(input.classId), studentId: text(input.studentId) };
            if (!policyId) throw controllerError('POLICY_REQUIRED', '반복 정책을 선택하세요.');
            if (input.confirmed !== true) {
                throw controllerError('CONFIRMATION_REQUIRED', '선생님 확인 후에만 다음 회차를 준비할 수 있습니다.');
            }
            const expectedRevision = integerInRange(input.expectedRevision, 1, Number.MAX_SAFE_INTEGER);
            if (expectedRevision === null) {
                throw controllerError('REVISION_REQUIRED', '정책 revision을 확인할 수 없습니다. 화면을 새로고침하세요.');
            }
            const evidenceSignature = text(input.evidenceSignature).toLowerCase();
            if (!/^[0-9a-f]{64}$/.test(evidenceSignature)) {
                throw controllerError('EVIDENCE_REQUIRED', '결과 근거를 먼저 새로고침하세요.');
            }
            const requestedOperationId = UUID_V4.test(text(input.operationId)) ? text(input.operationId) : '';
            // Never reuse a locally cached round id for a new reservation. The
            // server only accepts a reservation when no open round exists, so a
            // cached id is either terminal (2회차/해제 후 차단) or stale in
            // another tab. A caller-supplied id is still honored for explicit
            // idempotent retries.
            const operationId = requestedOperationId || generateUuid();
            const body = {
                confirmed: true,
                expectedRevision,
                expectedEvidenceSignature: evidenceSignature,
                operationId
            };
            if (plainObject(input.candidate)) body.candidate = input.candidate;
            const result = await call({
                kind: `policy:${policyId}`,
                scope,
                method: 'POST',
                path: `${FEATURE}/policies/${encodeURIComponent(policyId)}/rounds`,
                body,
                requestId: options.requestId
            });
            if (result.stale || !result.data) return result;
            const round = result.data.round || null;
            rememberRound(policyId, round);
            if (round && (round.status === 'RESERVED' || round.status === 'UNRESOLVED') && typeof onRoundReserved === 'function') {
                // Only reached after an explicit confirmed reservation. This is
                // the hook for the existing recommendation selection UI; the
                // controller never issues the exam itself. Idempotent/UNRESOLVED
                // responses carry assignment discovery so the UI can reconcile
                // before it opens any issue flow.
                try {
                    onRoundReserved(round, {
                        policy: result.data.policy || null,
                        evaluation: result.data.evaluation || null,
                        candidate: plainObject(input.candidate) ? input.candidate : {},
                        idempotent: result.data.idempotent === true,
                        existingAssignmentIds: Array.isArray(result.data.existingAssignmentIds)
                            ? result.data.existingAssignmentIds.map(text).filter(Boolean)
                            : null,
                        assignmentDiscoverySupported: result.data.assignmentDiscoverySupported !== false
                    });
                } catch (callbackError) {
                    // A UI callback failure must not turn a real reservation into
                    // a client-side failure that invites a duplicate round.
                    if (typeof console !== 'undefined' && console.warn) {
                        console.warn('[clinic-repeat] onRoundReserved failed:', callbackError);
                    }
                }
            }
            return result;
        }

        function operationIdFor(roundId) {
            return operationRecordFor(roundId)?.operationId || '';
        }

        async function confirmRound(input = {}, options = {}) {
            const roundId = text(input.roundId);
            if (!roundId) throw controllerError('ROUND_REQUIRED', '반복 회차를 선택하세요.');
            const record = operationRecordFor(roundId);
            const operationId = text(input.operationId) || record?.operationId || '';
            if (!UUID_V4.test(operationId)) {
                throw controllerError('OPERATION_REQUIRED', '회차 작업 번호를 확인할 수 없습니다. 화면을 새로고침하세요.');
            }
            const assignmentIds = Array.isArray(input.assignmentIds)
                ? Array.from(new Set(input.assignmentIds.map(text).filter(Boolean)))
                : [];
            if (!assignmentIds.length) {
                throw controllerError('ASSIGNMENT_REQUIRED', '확인할 배정을 선택하세요.');
            }
            const result = await call({
                kind: `round:${roundId}`,
                scope: { classId: text(input.classId), studentId: text(input.studentId) },
                method: 'POST',
                path: `${FEATURE}/rounds/${encodeURIComponent(roundId)}/confirm`,
                body: { operationId, assignmentIds },
                requestId: options.requestId
            });
            if (!result.stale && result.data?.round?.roundId) {
                rememberRound(text(input.policyId) || record?.policyId || '', result.data.round);
            }
            return result;
        }

        async function markRoundUnresolved(input = {}, options = {}) {
            const roundId = text(input.roundId);
            if (!roundId) throw controllerError('ROUND_REQUIRED', '반복 회차를 선택하세요.');
            const record = operationRecordFor(roundId);
            const operationId = text(input.operationId) || record?.operationId || '';
            if (!UUID_V4.test(operationId)) {
                throw controllerError('OPERATION_REQUIRED', '회차 작업 번호를 확인할 수 없습니다. 화면을 새로고침하세요.');
            }
            const reason = text(input.reason).toUpperCase() || 'ISSUE_OUTCOME_UNKNOWN';
            if (!UNRESOLVED_REASONS.includes(reason)) {
                throw controllerError('INVALID_UNRESOLVED_REASON', '미확정 사유를 확인하세요.');
            }
            const result = await call({
                kind: `round:${roundId}`,
                scope: { classId: text(input.classId), studentId: text(input.studentId) },
                method: 'POST',
                path: `${FEATURE}/rounds/${encodeURIComponent(roundId)}/unresolved`,
                body: { operationId, reason },
                requestId: options.requestId
            });
            if (!result.stale && result.data?.round?.roundId) {
                rememberRound(text(input.policyId) || record?.policyId || '', result.data.round);
            }
            return result;
        }

        async function releaseRound(input = {}, options = {}) {
            const roundId = text(input.roundId);
            if (!roundId) throw controllerError('ROUND_REQUIRED', '반복 회차를 선택하세요.');
            const record = operationRecordFor(roundId);
            const operationId = text(input.operationId) || record?.operationId || '';
            if (!UUID_V4.test(operationId)) {
                throw controllerError('OPERATION_REQUIRED', '회차 작업 번호를 확인할 수 없습니다. 화면을 새로고침하세요.');
            }
            const result = await call({
                kind: `round:${roundId}`,
                scope: { classId: text(input.classId), studentId: text(input.studentId) },
                method: 'POST',
                path: `${FEATURE}/rounds/${encodeURIComponent(roundId)}/release`,
                body: { operationId },
                requestId: options.requestId
            });
            if (!result.stale && result.data?.round?.roundId) {
                rememberRound(text(input.policyId) || record?.policyId || '', result.data.round);
            }
            return result;
        }

        async function listRoundCandidates(input = {}, options = {}) {
            const roundId = text(input.roundId);
            if (!roundId) throw controllerError('ROUND_REQUIRED', '반복 회차를 선택하세요.');
            const scope = { classId: text(input.classId), studentId: text(input.studentId) };
            if (!scope.classId || !scope.studentId) {
                throw controllerError('SCOPE_REQUIRED', '반과 학생을 선택하세요.');
            }
            const result = await call({
                kind: `round-candidates:${roundId}`,
                scope,
                method: 'GET',
                path: `${FEATURE}/rounds/${encodeURIComponent(roundId)}/candidates`,
                requestId: options.requestId
            });
            const discoveredOperation = text(result.data?.operationId);
            if (!result.stale && UUID_V4.test(discoveredOperation)) {
                const previous = operationRecordFor(roundId);
                rememberRound(previous?.policyId || '', {
                    roundId,
                    operationId: discoveredOperation,
                    status: text(result.data?.status) || previous?.status || 'RESERVED'
                });
            }
            return result;
        }

        return Object.freeze({
            contractVersion: CONTRACT_VERSION,
            feature: FEATURE,
            now,
            list,
            status,
            createPolicy,
            updatePolicy,
            closePolicy,
            reopenPolicy,
            reserveRound,
            confirmRound,
            markRoundUnresolved,
            releaseRound,
            listRoundCandidates,
            operationIdFor,
            // Refresh-safe recovery: the open round's operation id comes from
            // the server response, not from local storage.
            openRound: findOpenRound
        });
    }

    return Object.freeze({
        CONTRACT_VERSION,
        FEATURE,
        MAX_CADENCE_DAYS,
        MAX_ROUNDS,
        MAX_QUESTIONS,
        SETTINGS_KEYS,
        CLOSE_REASONS,
        UNRESOLVED_REASONS,
        create,
        validateSettings,
        settingsSummary,
        stateTone,
        evaluationLabel,
        findOpenRound,
        roundLabel,
        isClinicRepeatError,
        isFeatureUnavailable
    });
}));
