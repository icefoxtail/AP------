/**
 * AP Math OS [clinic-print.js]
 * 오답 클리닉 출력 센터 1차 구현
 */

const AP_CLINIC_PRINT_STORAGE_KEY = 'AP_CLINIC_PRINT_PAYLOAD';
const AP_CLINIC_PRINT_ASSIGNMENT_FROM_DATE = '2026-06-01';
const AP_CLINIC_EXAM_PERIODS = [
    ['all', '전체'], ['1mid', '1학기 중간'], ['1final', '1학기 기말'],
    ['2mid', '2학기 중간'], ['2final', '2학기 기말'], ['other', '기타 시험']
];
const clinicPrintExamPeriodFilters = new Map();
const clinicPrintExamYearFilters = new Map();
const clinicPrintGradeData = new Map();
const clinicPrintClassClinicData = new Map();
const clinicPrintArchive2ScriptPromises = new Map();
let clinicPrintArchive2CatalogPromise = null;
let clinicPrintArchive2CatalogCache = null;
let clinicPrintRecommendationSettings = {
    countPerStudent: '5',
    difficultyMode: 'match_wrong',
    selectedDifficultyBuckets: [],
    includeSeenQuestionUids: false
};
let clinicPrintAssessmentClient = null;
let clinicPrintAssessmentFormValues = { classId: '', title: '', examDate: '' };
const clinicPrintRecommendationAssessmentStates = new Map();
let clinicPrintRecommendationState = {
    scope: 'class',
    status: 'idle',
    requestId: 0,
    classId: '',
    contextKey: '',
    result: null,
    selectedKeys: new Set(),
    pendingKeys: new Set(),
    validationErrors: new Map(),
    verifiedByKey: new Map(),
    followUpAction: null,
    error: ''
};

function clinicPrintGetArchiveBaseUrl() {
    return new URL('../archive/', window.location.href).href;
}

function clinicPrintLoadArchive2Script(name, relativeUrl, globalName) {
    if (window[globalName]) return Promise.resolve(window[globalName]);
    if (!clinicPrintArchive2ScriptPromises.has(name)) {
        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            const timeoutId = setTimeout(() => {
                script.remove();
                reject(new Error(`${name} 스크립트 요청 시간이 초과되었습니다.`));
            }, 20000);
            script.src = new URL(relativeUrl, document.baseURI).href;
            script.async = true;
            script.onload = () => {
                clearTimeout(timeoutId);
                window[globalName]
                    ? resolve(window[globalName])
                    : reject(new Error(`${name} 로더를 초기화하지 못했습니다.`));
            };
            script.onerror = () => {
                clearTimeout(timeoutId);
                reject(new Error(`${name} 스크립트를 불러오지 못했습니다.`));
            };
            document.head.appendChild(script);
        }).catch(error => {
            clinicPrintArchive2ScriptPromises.delete(name);
            throw error;
        });
        clinicPrintArchive2ScriptPromises.set(name, promise);
    }
    return clinicPrintArchive2ScriptPromises.get(name);
}

async function clinicPrintLoadArchive2CandidateCatalog() {
    if (clinicPrintArchive2CatalogCache) return clinicPrintArchive2CatalogCache;
    if (!clinicPrintArchive2CatalogPromise) {
        clinicPrintArchive2CatalogPromise = (async () => {
            await clinicPrintLoadArchive2Script('mixer-selector', '../archive/mixer-selector.js?v=20261016-clinic-rec-1', 'ArchiveMixerSelector');
            await clinicPrintLoadArchive2Script('archive2-canonical', '../archive/archive2-canonical.js?v=20261016-clinic-rec-1', 'Archive2Canonical');
            await clinicPrintLoadArchive2Script('archive2-core', '../archive/archive2-core.js?v=20261016-clinic-rec-1', 'Archive2Core');
            const archiveBase = clinicPrintGetArchiveBaseUrl();
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 90000);
            let bundle;
            try {
                bundle = await window.Archive2Canonical.loadInputBundle(
                    url => fetch(url, { cache: 'no-cache', signal: controller.signal }),
                    archiveBase
                );
            } catch (error) {
                if (controller.signal.aborted) throw new Error('Archive 2.0 후보 목록 조회 시간이 초과되었습니다.');
                throw error;
            } finally {
                clearTimeout(timeoutId);
            }
            const catalog = window.Archive2Canonical.resolveCatalog({ versionBundle: bundle });
            if (!Array.isArray(catalog?.records) || !catalog.records.length) {
                throw new Error('Archive 2.0 추천 후보 목록이 비어 있습니다.');
            }
            clinicPrintArchive2CatalogCache = {
                version: String(catalog.indexVersion || bundle.projectionVersion || ''),
                catalog,
                records: catalog.records
            };
            return clinicPrintArchive2CatalogCache;
        })().catch(error => {
            clinicPrintArchive2CatalogPromise = null;
            throw error;
        });
    }
    return clinicPrintArchive2CatalogPromise;
}

function clinicPrintGetGradeWindow(classId) {
    const loaded = clinicPrintGradeData.get(String(classId));
    if (loaded?.status === 'ready') return { from: loaded.from, to: loaded.to };
    const to = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const date = new Date(`${to}T00:00:00Z`);
    const day = date.getUTCDate();
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() - 1);
    const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(day, lastDay));
    return { from: date.toISOString().slice(0, 10), to };
}

function clinicPrintGradeDataUnavailable(classId) {
    const status = clinicPrintGradeData.get(String(classId))?.status;
    return status === 'loading' || status === 'error';
}

function clinicPrintIsInGradeWindow(row, classId) {
    const { from, to } = clinicPrintGetGradeWindow(classId);
    const date = String(row.exam_date || row.created_at || row.updated_at || '').slice(0, 10);
    return !!date && date >= from && date <= to;
}

function clinicPrintGetGradeDataMessage(classId) {
    const data = clinicPrintGradeData.get(String(classId));
    if (data?.status === 'loading') return '학년 전체 기록을 불러오는 중입니다.';
    if (data?.status === 'error') return '학년 전체 기록을 불러오지 못했습니다. 다시 불러오기를 눌러 주세요.';
    const { from, to } = clinicPrintGetGradeWindow(classId);
    return `모든 선생님 반 · 최근 1개월 (${from} ~ ${to})`;
}

function clinicPrintRecommendationKey(studentId, questionUid) {
    return JSON.stringify([String(studentId || ''), String(questionUid || '')]);
}

function clinicPrintBuildFollowUpResultSignature(assignment, student) {
    const context = student?.followUpContext || {};
    const targets = Array.isArray(context.recommendationInput?.targets) ? context.recommendationInput.targets : [];
    return JSON.stringify([
        String(assignment?.classId || assignment?.class_id || ''),
        String(assignment?.assignmentId || assignment?.id || ''),
        String(student?.studentId || student?.student_id || ''),
        String(student?.sessionId || ''),
        String(student?.status || ''),
        String(context.status || ''),
        String(context.coverage?.metaCoverageStatus || ''),
        context.coverage?.recommendationEligible === true,
        Number(context.coverage?.unclassifiedCount || 0),
        (Array.isArray(student?.questionResults) ? student.questionResults : []).map(row => [
            Number(row?.orderNo || 0), String(row?.questionUid || ''), String(row?.status || '')
        ]),
        targets.map(target => [
            String(target?.pathKey || ''), target?.difficultyBucket ?? null,
            Array.isArray(target?.questionOrderNos) ? target.questionOrderNos.map(Number) : [],
            (Array.isArray(target?.questionRefs) ? target.questionRefs : []).map(ref => [
                Number(ref?.orderNo || 0), String(ref?.sourceQuestionUid || ''),
                String(ref?.sourceArchiveFile || ''), Number(ref?.sourceQuestionOrdinal || 0),
                String(ref?.sourceFingerprint || '')
            ])
        ])
    ]);
}

function clinicPrintGetRecommendationContextKey(classId, scope = clinicPrintRecommendationState.scope) {
    const settings = clinicPrintReadRecommendationSettings();
    return JSON.stringify([
        String(classId || ''),
        document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student',
        String(scope || 'class'),
        clinicPrintGetCheckedValues('clinic-print-exam').map(String).sort(),
        clinicPrintGetCheckedValues('clinic-print-student').map(String).sort(),
        settings.countPerStudentRaw,
        settings.difficultyMode,
        settings.selectedDifficultyBuckets,
        settings.includeSeenQuestionUids === true,
        clinicPrintRecommendationState.followUpAction ? [
            String(clinicPrintRecommendationState.followUpAction.classId || ''),
            String(clinicPrintRecommendationState.followUpAction.assignmentId || ''),
            String(clinicPrintRecommendationState.followUpAction.studentId || ''),
            String(clinicPrintRecommendationState.followUpAction.sessionId || ''),
            String(clinicPrintRecommendationState.followUpAction.mode || ''),
            String(clinicPrintRecommendationState.followUpAction.resultSignature || ''),
            clinicPrintRecommendationState.followUpAction.targetScope || null,
            String(clinicPrintRecommendationState.followUpAction.sourceSessionId || ''),
            Number(clinicPrintRecommendationState.followUpAction.historyRefreshRequestId || 0),
            Number(clinicPrintRecommendationState.followUpAction.targetUidCount || 0),
            Number(clinicPrintRecommendationState.followUpAction.typeObservedWrongCount || 0),
            String(clinicPrintRecommendationState.followUpAction.sourceExamDate || ''),
            String(clinicPrintRecommendationState.followUpAction.sourceExamTitle || '')
        ] : null
    ]);
}

function clinicPrintReadRecommendationSettings() {
    const countInput = document.getElementById('clinic-print-recommendation-count');
    const countPerStudentRaw = String(countInput?.value ?? clinicPrintRecommendationSettings.countPerStudent ?? '5').trim();
    const difficultyMode = document.querySelector('input[name="clinic-print-recommendation-difficulty-mode"]:checked')?.value || clinicPrintRecommendationSettings.difficultyMode || 'match_wrong';
    const selectedDifficultyBuckets = Array.from(document.querySelectorAll('input[name="clinic-print-recommendation-bucket"]:checked'))
        .map(input => Number(input.value)).filter(bucket => Number.isInteger(bucket) && bucket >= 1 && bucket <= 5).sort((a, b) => a - b);
    const includeSeenQuestionUids = document.getElementById('clinic-print-recommendation-include-seen')?.checked === true ||
        (!document.getElementById('clinic-print-recommendation-include-seen') && clinicPrintRecommendationSettings.includeSeenQuestionUids === true);
    const count = Number(countPerStudentRaw);
    const errors = [];
    if (!/^\d+$/.test(countPerStudentRaw) || !Number.isInteger(count) || count < 1 || count > 400) {
        errors.push({ field: 'countPerStudent', message: '학생별 문항 수는 1~400 사이의 정수로 입력하세요.' });
    }
    if (difficultyMode === 'selected' && !selectedDifficultyBuckets.length) {
        errors.push({ field: 'selectedDifficultyBuckets', message: '난이도를 직접 고를 때는 1~5 중 하나 이상 선택하세요.' });
    }
    return {
        countPerStudentRaw,
        difficultyMode,
        selectedDifficultyBuckets,
        includeSeenQuestionUids,
        errors,
        recommendationOptions: errors.length ? null : {
            countPerStudent: count,
            difficultyMode,
            selectedDifficultyBuckets: difficultyMode === 'selected' ? selectedDifficultyBuckets : []
        }
    };
}

function clinicPrintRenderRecommendationOptions(classId) {
    const settings = clinicPrintRecommendationSettings;
    const mode = settings.difficultyMode || 'match_wrong';
    const checkedBuckets = new Set((settings.selectedDifficultyBuckets || []).map(Number));
    const buckets = [1, 2, 3, 4, 5].map(bucket => `
        <label style="display:inline-flex;align-items:center;gap:4px;margin-right:10px;font-size:12px;">
            <input type="checkbox" name="clinic-print-recommendation-bucket" value="${bucket}" ${checkedBuckets.has(bucket) ? 'checked' : ''} ${mode !== 'selected' ? 'disabled' : ''} onchange="clinicPrintOnRecommendationOptionsChange('${clinicPrintEscapeJsString(classId)}')">
            ${bucket}
        </label>`).join('');
    return `<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin:8px 0 10px;">
        <label style="display:flex;align-items:center;gap:7px;font-size:12px;font-weight:700;">학생별 문항 수
            <input id="clinic-print-recommendation-count" type="number" min="1" max="400" step="1" value="${clinicPrintEscapeAttr(settings.countPerStudent || '5')}" aria-label="학생별 추천 문항 수" style="width:76px;" oninput="clinicPrintOnRecommendationOptionsChange('${clinicPrintEscapeJsString(classId)}')">
        </label>
        <span style="font-size:12px;color:var(--secondary);">1~400개</span>
    </div>
    <div style="font-size:12px;font-weight:700;margin-bottom:5px;">난이도</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
        <label style="display:flex;gap:6px;align-items:flex-start;font-size:12px;">
            <input type="radio" name="clinic-print-recommendation-difficulty-mode" value="match_wrong" ${mode === 'match_wrong' ? 'checked' : ''} onchange="clinicPrintOnRecommendationOptionsChange('${clinicPrintEscapeJsString(classId)}')">
            <span>오답 난이도에 맞춤</span>
        </label>
        <label style="display:flex;gap:6px;align-items:flex-start;font-size:12px;">
            <input type="radio" name="clinic-print-recommendation-difficulty-mode" value="selected" ${mode === 'selected' ? 'checked' : ''} onchange="clinicPrintOnRecommendationOptionsChange('${clinicPrintEscapeJsString(classId)}')">
            <span>난이도 직접 선택</span>
        </label>
    </div>
    <div aria-label="추천 난이도 선택">${buckets}</div>
    <div style="font-size:11px;color:var(--secondary);margin-top:3px;">오답 난이도 맞춤을 선택하면 직접 고른 단계는 보관되지만 적용되지 않습니다.</div>
    <label id="clinic-print-recommendation-include-seen-wrap" style="display:flex;align-items:flex-start;gap:6px;margin-top:8px;font-size:12px;">
        <input id="clinic-print-recommendation-include-seen" type="checkbox" ${settings.includeSeenQuestionUids === true ? 'checked' : ''} onchange="clinicPrintOnRecommendationOptionsChange('${clinicPrintEscapeJsString(classId)}')">
        <span><strong>이미 푼 문항도 후보에 포함</strong><span style="display:block;font-size:10px;color:var(--secondary);margin-top:2px;">현재 조회 범위에서 확인된 응시 UID를 기준으로 합니다.</span></span>
    </label>`;
}

function clinicPrintOnRecommendationOptionsChange(classId) {
    const assessmentState = clinicPrintGetRecommendationAssessmentState(classId);
    const typePlanLock = clinicPrintGetTypeFollowUpPlanLock(assessmentState);
    const followUpAction = clinicPrintRecommendationState.followUpAction;
    const hasTypeContext = !!typePlanLock ||
        !!(followUpAction?.targetScope && String(followUpAction.classId || '') === String(classId || ''));
    if (hasTypeContext && clinicPrintIsTypeFollowUpContextLocked(classId, assessmentState)) {
        const previous = clinicPrintRecommendationSettings;
        const countInput = document.getElementById('clinic-print-recommendation-count');
        if (countInput) countInput.value = String(previous.countPerStudent || '5');
        document.querySelectorAll('input[name="clinic-print-recommendation-difficulty-mode"]').forEach(input => {
            input.checked = input.value === previous.difficultyMode;
        });
        document.querySelectorAll('input[name="clinic-print-recommendation-bucket"]').forEach(input => {
            input.checked = (previous.selectedDifficultyBuckets || []).map(Number).includes(Number(input.value));
            input.disabled = previous.difficultyMode !== 'selected';
        });
        const includeSeenInput = document.getElementById('clinic-print-recommendation-include-seen');
        if (includeSeenInput) includeSeenInput.checked = previous.includeSeenQuestionUids === true;
        clinicPrintRenderRecommendationAssessmentPanel(classId);
        toast('시험 배정 확인 중에는 추천 조건을 바꿀 수 없습니다.', 'warn');
        return;
    }
    const settings = clinicPrintReadRecommendationSettings();
    clinicPrintRecommendationSettings = {
        countPerStudent: settings.countPerStudentRaw,
        difficultyMode: settings.difficultyMode,
        selectedDifficultyBuckets: settings.selectedDifficultyBuckets,
        includeSeenQuestionUids: settings.includeSeenQuestionUids === true
    };
    document.querySelectorAll('input[name="clinic-print-recommendation-bucket"]').forEach(input => {
        input.disabled = settings.difficultyMode !== 'selected';
    });
    clinicPrintInvalidateRecommendations(classId);
    clinicPrintSchedulePreviewPush(classId);
}

function clinicPrintResetRecommendationState(scope = 'class', classId = clinicPrintActiveClassId) {
    const requestId = Number(clinicPrintRecommendationState.requestId || 0) + 1;
    clinicPrintRecommendationState = {
        scope: scope === 'grade' ? 'grade' : 'class',
        status: 'idle',
        requestId,
        classId: String(classId || ''),
        contextKey: '',
        result: null,
        selectedKeys: new Set(),
        pendingKeys: new Set(),
        validationErrors: new Map(),
        verifiedByKey: new Map(),
        followUpAction: null,
        error: ''
    };
}

function clinicPrintInvalidateRecommendations(classId = clinicPrintActiveClassId) {
    const scope = clinicPrintRecommendationState.scope || 'class';
    clinicPrintResetRecommendationState(scope, classId);
    const body = document.getElementById('clinic-print-recommendation-body');
    if (body) clinicPrintRenderRecommendationPanel(classId);
}

function clinicPrintIsRecommendationRequestCurrent(classId, requestId, contextKey) {
    return Number(clinicPrintRecommendationState.requestId) === Number(requestId) &&
        String(clinicPrintActiveClassId || '') === String(classId || '') &&
        !!document.getElementById('clinic-print-recommendation-body') &&
        clinicPrintGetRecommendationContextKey(classId, clinicPrintRecommendationState.scope) === contextKey;
}

function clinicPrintRecommendationPathLabel(item = {}) {
    const reason = item.recommendationReason && typeof item.recommendationReason === 'object'
        ? item.recommendationReason : {};
    const path = item.matchedTarget || item.targetPath || reason.targetPath || reason.path || reason.target || item.canonicalMeta || item;
    return ['L1', 'L2', 'L3', 'L4'].map(key => String(path?.[key] || '').trim()).filter(Boolean).join(' › ');
}

function clinicPrintRecommendationReasonLabel(item = {}) {
    const reason = item.recommendationReason;
    if (!reason || typeof reason !== 'object') return String(reason || '기존 오답의 정본 Meta 경로와 연결');
    if (reason.basis === 'follow_up_same_uid') return '이번 완결 응시에서 확정 오답으로 확인된 UID';
    if (reason.basis === 'follow_up_similar_uid') return '이번 완결 응시의 동결 정본 유형 경로와 연결';
    const wrongCount = Number(reason.wrongCount || 0);
    const sessionCount = Number(reason.sessionCount || 0);
    return `조회 이력 오답 ${wrongCount}회 · ${sessionCount}개 세션의 정본 Meta 경로와 연결`;
}

function clinicPrintRecommendationErrorLabel(error = {}) {
    const code = String(error?.code || '');
    const labels = {
        invalid_recommendation_options: '추천 설정 형식을 확인해 주세요.',
        invalid_count_per_student: '학생별 문항 수는 1~400 사이의 정수로 입력하세요.',
        invalid_target_grade: '반 학년 정보를 확인한 뒤 추천 범위를 다시 불러오세요.',
        invalid_difficulty_mode: '난이도 선택을 다시 확인해 주세요.',
        selected_difficulty_buckets_required: '난이도를 직접 고를 때는 1~5 중 하나 이상 선택하세요.',
        invalid_selected_difficulty_bucket: '난이도는 1~5 중에서 선택해 주세요.',
        invalid_selected_difficulty_buckets: '난이도 선택을 다시 확인해 주세요.'
    };
    return labels[code] || '추천 조건을 확인해 주세요.';
}

function clinicPrintCreateAssessmentTransport() {
    if (typeof CONFIG === 'undefined' || !CONFIG.API_BASE) throw new Error('시험 배정 서버 주소를 확인할 수 없습니다.');
    return async ({ method = 'GET', path = '', body, headers = {} } = {}) => {
        if (navigator.onLine === false) throw new Error('오프라인에서는 시험을 배정할 수 없습니다. 인터넷 연결 후 다시 시도하세요.');
        const apiBase = String(CONFIG.API_BASE).replace(/\/+$/, '');
        const requestPath = String(path || '').replace(/^\/+/, '');
        if (!requestPath) throw new Error('시험 배정 요청 경로가 비어 있습니다.');
        const requestHeaders = {
            'Content-Type': 'application/json',
            ...(typeof getAuthHeader === 'function' ? getAuthHeader() : {}),
            ...(headers && typeof headers === 'object' ? headers : {})
        };
        const requestMethod = String(method || 'GET').toUpperCase();
        const controller = new AbortController();
        const timeoutMs = requestMethod === 'POST' ? 120000 : 45000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(`${apiBase}/${requestPath}`, {
                method: requestMethod,
                headers: requestHeaders,
                body: body == null ? undefined : JSON.stringify(body),
                signal: controller.signal
            });
            const data = await response.json().catch(() => ({}));
            return { status: response.status, data };
        } finally {
            clearTimeout(timeoutId);
        }
    };
}

function clinicPrintGetAssessmentClient() {
    if (clinicPrintAssessmentClient) return clinicPrintAssessmentClient;
    if (!window.ClinicAssessment || typeof window.ClinicAssessment.create !== 'function') {
        throw new Error('일반 시험 배정 모듈을 불러오지 못했습니다.');
    }
    clinicPrintAssessmentClient = window.ClinicAssessment.create({
        request: clinicPrintCreateAssessmentTransport(),
        archive2Core: window.Archive2Core,
        isOnline: () => navigator.onLine !== false
    });
    return clinicPrintAssessmentClient;
}

function clinicPrintGetAssessmentDateToday() {
    return new Date().toLocaleDateString('sv-SE');
}

function clinicPrintGetRecommendationAssessmentState(classId = clinicPrintActiveClassId) {
    const key = String(classId || '');
    if (!clinicPrintRecommendationAssessmentStates.has(key)) {
        clinicPrintRecommendationAssessmentStates.set(key, {
            classId: key,
            status: 'idle',
            plan: null,
            typeFollowUpPlanLock: null,
            typeFollowUpControlsLocked: false,
            result: null,
            error: '',
            selectionSummary: [],
            discoveryLoaded: false,
            discoveryError: '',
            historySummary: null,
            historySummaryStatus: 'idle',
            historySummaryError: '',
            historyExpandedStudents: new Map(),
            attemptComparisonIndex: null,
            attemptComparisonIndexRefreshRequestId: 0,
            attemptComparisonSelections: new Map(),
            typeFollowUpSourceSelections: new Map(),
            refreshRequestId: 0,
            reconcileRequestId: 0,
            reconciliation: null,
            discovered: [],
            outcomes: []
        });
    }
    return clinicPrintRecommendationAssessmentStates.get(key);
}

function clinicPrintGetAssessmentDefaultTitle(classId = clinicPrintActiveClassId) {
    const className = clinicPrintGetClass(classId)?.name || '반';
    return `${className} 유형 보충 시험`;
}

function clinicPrintAssessmentStatusLabel(status) {
    const labels = {
        PLANNED: '배정 준비',
        SAVING: '시험지 저장 중',
        SAVED: '시험지 저장 완료',
        ASSIGNING: '학생 배정 중',
        ASSIGNED: '배정 완료',
        FAILED: '실패',
        SAVE_OUTCOME_UNKNOWN: '시험지 저장 결과 확인 필요',
        ASSIGNMENT_OUTCOME_UNKNOWN: '학생 배정 결과 확인 필요',
        COMMITTED: '기존 배정 확인',
        ABSENT: '미배정 확인',
        UNRESOLVED: '미확정',
        UNWRITTEN: '배정되지 않음 확인',
        PARTIAL: '일부만 확인',
        pending: '응시 대기',
        result: '응시 결과 확인',
        complete_result: '응시 결과 확인',
        partial: '일부 결과 미확인',
        unresolved: '결과 확인 필요',
        excluded: '배정 제외',
        cancelled: '응시 취소',
        cancelled_pending: '취소로 미응시'
    };
    return labels[String(status || '')] || '상태 확인 필요';
}

function clinicPrintRenderRecommendationAssessmentPanel(classId = clinicPrintActiveClassId) {
    if (String(clinicPrintActiveClassId || '') !== String(classId || '')) return;
    const body = document.getElementById('clinic-print-recommendation-assessment-body');
    const button = document.getElementById('clinic-print-recommendation-assessment-submit');
    if (!body) return;
    const state = clinicPrintGetRecommendationAssessmentState(classId);
    const followUpAction = clinicPrintRecommendationState.followUpAction || null;
    const typePlanLock = clinicPrintGetTypeFollowUpPlanLock(state);
    const typeMode = followUpAction?.mode || typePlanLock?.recommendationMode || state.plan?.recommendationMode || '';
    const softTitle = document.querySelector('#clinic-print-recommendation-assessment-section .clinic-print-section-title--soft');
    if (softTitle) softTitle.textContent = typeMode
        ? (typeMode === 'same_uid' ? '같은 UID · 현재 검증 원본 재연습' : '이번 오답 UID와 다른 유사문항')
        : '유형 보충 시험 · 선택한 추천 문항';
    const busy = ['planning', 'issuing', 'refreshing', 'reconciling'].includes(state.status);
    if (button) button.disabled = busy;
    const refreshButton = document.getElementById('clinic-print-recommendation-assessment-refresh');
    const reconcileButton = document.getElementById('clinic-print-recommendation-assessment-reconcile');
    if (refreshButton) refreshButton.disabled = busy;
    if (reconcileButton) reconcileButton.disabled = busy;
    const hasTypeFollowUpContext = !!typePlanLock ||
        !!(followUpAction?.targetScope && String(followUpAction.classId || '') === String(classId || '')) ||
        state.typeFollowUpControlsLocked === true;
    if (hasTypeFollowUpContext) {
        const lockContext = clinicPrintIsTypeFollowUpContextLocked(classId, state);
        const refreshLocked = !!state.plan && state.status !== 'complete';
        state.typeFollowUpControlsLocked = lockContext;
        if (refreshButton) refreshButton.disabled = busy || refreshLocked;
        ['clinic-print-recommendation-assessment-title', 'clinic-print-recommendation-assessment-date'].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.disabled = lockContext;
        });
        if (lockContext) {
            document.querySelectorAll('#clinic-print-recommendation-options input').forEach(input => { input.disabled = true; });
        } else {
            document.querySelectorAll('#clinic-print-recommendation-options input').forEach(input => { input.disabled = false; });
            const optionSettings = clinicPrintReadRecommendationSettings();
            document.querySelectorAll('input[name="clinic-print-recommendation-bucket"]').forEach(input => {
                input.disabled = optionSettings.difficultyMode !== 'selected';
            });
        }
    }
    const statusText = state.status === 'planning' ? '선택 문항과 배정 구성을 확인하고 있습니다.'
        : state.status === 'issuing' ? '시험지를 저장하고 선택 학생에게 배정하고 있습니다.'
        : state.status === 'refreshing' ? '기존 시험 배정과 실제 응시 결과를 조회하고 있습니다.'
        : state.status === 'reconciling' ? '기존 저장·배정 기록을 읽어 미확정 작업을 확인하고 있습니다.'
        : state.status === 'partial' ? (state.result?.status === 'OUTCOME_UNKNOWN'
            ? '배정 결과가 모두 확정되지 않았습니다. 같은 작업 ID로 상태를 확인하고 미완료 항목만 이어서 처리할 수 있습니다.'
            : '모든 시험 배정을 완료하지 못했습니다. 이미 완료된 항목은 건너뛰고 미완료만 이어서 처리할 수 있습니다.')
        : state.status === 'complete' ? '시험 배정이 완료됐습니다. 응시 결과는 학생이 제출한 실제 기록만 표시합니다.'
        : state.status === 'error' ? `시험 배정 상태를 확인하지 못했습니다: ${clinicPrintEscapeHtml(state.error || '오류')}`
        : state.status === 'cancelled' ? '시험 배정을 취소했습니다. 저장이나 학생 배정은 진행하지 않았습니다.'
        : state.status === 'plan_ready' ? '배정 계획을 만들었습니다. 학생·문항 수를 확인한 뒤 다시 눌러 배정하세요.'
        : '';
    const summary = Array.isArray(state.selectionSummary) && state.selectionSummary.length
        ? `<div style="margin:6px 0;">${state.selectionSummary.map(row => `<div>${clinicPrintEscapeHtml(row.studentName)} · 선택 ${Number(row.selectedCount || 0)}문항 · 추천된 ${Number(row.returnedCount || 0)} / 요청 ${Number(row.requestedCount || 0)}문항</div>`).join('')}</div>`
        : '';
    const error = [state.error && state.status !== 'error' ? state.error : '', state.discoveryError].filter(Boolean)
        .map(message => `<div style="color:var(--error);">${clinicPrintEscapeHtml(message)}</div>`).join('');
    const retry = state.plan && ['partial', 'error'].includes(state.status)
        ? `<button type="button" class="clinic-print-mini-btn" onclick="clinicPrintRetryRecommendationAssessment('${clinicPrintEscapeJsString(classId)}')">미완료 배정 이어서 처리</button>` : '';
    const reconciliation = clinicPrintRenderAssessmentReconciliation(state);
    const operationDetails = clinicPrintRenderAssessmentOperationDetails(state);
    const discoveredDetails = clinicPrintRenderAssessmentDiscovery(state);
    body.innerHTML = `${statusText ? `<div class="clinic-print-note" aria-live="polite">${statusText}</div>` : ''}${summary}${error}${retry}${reconciliation}${operationDetails}${discoveredDetails}`;
}

function clinicPrintRenderAssessmentReconciliation(state) {
    const result = state?.reconciliation;
    if (!result) return '';
    const messageByStatus = {
        clear: '확인할 미확정 작업이 없습니다.',
        complete: '기존 시험 배정이 서버 기록과 일치합니다. 새 배정을 준비할 수 있습니다.',
        unwritten: '기존 학생 배정이 없음을 확인했습니다. 새 배정을 준비할 수 있습니다.',
        resolved: '기존 작업의 완료·미배정 상태를 모두 확인했습니다. 새 배정을 준비할 수 있습니다.',
        partial: '일부 저장·배정 결과만 확인했습니다. 미확정 상태가 남아 있어 새 배정은 보류됩니다.',
        unresolved: '기존 저장·배정 결과를 확인할 수 없습니다. 새 배정을 시작하지 말고 나중에 다시 확인하세요.'
    };
    const status = String(result.status || '').toLowerCase();
    const safeToCreate = result.unlocked === true;
    const message = String(result.message || messageByStatus[status] || '기존 저장·배정 기록을 확인했습니다.') +
        (safeToCreate ? '' : ' 새 배정은 잠겨 있습니다.');
    const operationDetails = (result.operations || []).map(operation => {
        const savedOnly = Number(operation.savedPaperOnlyCount || 0);
        const paperRows = (operation.cohorts || []).flatMap(cohort => cohort.papers || []);
        return `<div style="font-size:11px;margin-top:5px;"><strong>${clinicPrintEscapeHtml(operation.title || '기존 작업')} · ${clinicPrintEscapeHtml(operation.examDate || '')}</strong>${savedOnly ? ` · 학생 배정 전 저장된 시험지 ${savedOnly}개` : ''}
            ${paperRows.map(paper => `<div>${clinicPrintEscapeHtml(clinicPrintAssessmentStatusLabel(paper.status))}${paper.paperIndex ? ` · 시험 ${Number(paper.paperIndex)}` : ''}${paper.reason ? ` · ${clinicPrintEscapeHtml(clinicPrintAssessmentReconcileReasonLabel(paper.reason))}` : ''}</div>`).join('')}
        </div>`;
    }).join('');
    return `<div class="clinic-print-note" aria-live="polite" style="margin-top:7px;">${clinicPrintEscapeHtml(message)}${operationDetails}</div>`;
}

function clinicPrintAssessmentReconcileReasonLabel(reason) {
    return ({
        save_batch_query_unavailable: '시험지 저장 기록 조회 실패',
        save_batch_absent: '시험지 저장 기록 없음',
        save_batch_receipt_mismatch: '시험지 저장 확인 정보 불일치',
        receipt_uid_order_mismatch: '문항 순서 확인 실패',
        assignment_query_unavailable: '시험 배정 기록 조회 실패',
        assignment_not_found: '학생 배정 기록 없음',
        duplicate_assignment_identity: '중복 시험 배정 기록',
        assignment_marker_mismatch: '시험 출처 확인 불일치',
        recipient_snapshot_unavailable_or_mismatch: '수신 학생 기록 확인 실패'
    })[String(reason || '')] || '기록 확인 필요';
}

function clinicPrintGetRecommendationAssessmentSelections(classId, selectedStudentIds) {
    const classInfo = clinicPrintGetClass(classId);
    const className = String(classInfo?.name || '');
    const grade = clinicPrintGetClassGrade(classId);
    const students = new Map(clinicPrintGetClassStudents(classId).map(student => [String(student.id), student]));
    return selectedStudentIds.map(studentId => {
        const selectedItems = clinicPrintGetSelectedRecommendationItems(studentId);
        const group = (clinicPrintRecommendationState.result?.candidates || [])
            .find(row => String(row.studentId || '') === String(studentId));
        const verificationByUid = new Map(selectedItems.map(candidate => {
            const key = clinicPrintRecommendationKey(studentId, candidate.sourceQuestionUid);
            return [String(candidate.sourceQuestionUid || ''), clinicPrintRecommendationState.verifiedByKey?.get(key)];
        }));
        const items = selectedItems.map(candidate => {
            const verification = verificationByUid.get(String(candidate.sourceQuestionUid || ''));
            const record = verification?.record || {};
            const sourceGrade = String(record.sourceGrade || candidate.sourceGrade || verification?.question?.sourceGrade || '').trim();
            return {
                candidate: { ...candidate, sourceGrade },
                question: verification?.question,
                record,
                sourceGrade
            };
        });
        const student = students.get(String(studentId));
        return {
            selection: { classId: String(classId), className, grade, studentId: String(studentId), items },
            summary: {
                studentId: String(studentId),
                studentName: String(student?.name || studentId),
                selectedCount: items.length,
                returnedCount: Array.isArray(group?.items) ? group.items.length : 0,
                requestedCount: clinicPrintRecommendationState.followUpAction?.mode === 'same_uid'
                    ? Number(group?.requestedCount || group?.returnedCount || items.length)
                    : Number(clinicPrintRecommendationSettings.countPerStudent || 5)
            }
        };
    });
}

function clinicPrintGetRecommendationSelectionSignature(studentIds) {
    const action = clinicPrintRecommendationState.followUpAction;
    return JSON.stringify({
        selections: (studentIds || []).map(studentId => [
            String(studentId),
            clinicPrintGetSelectedRecommendationItems(studentId).map(item => String(item.sourceQuestionUid || ''))
        ]),
        followUp: action ? [
            action.classId, action.assignmentId, action.studentId, action.sessionId, action.mode,
            action.resultSignature, action.targetScope || null, action.sourceSessionId || '',
            Number(action.historyRefreshRequestId || 0), Number(action.targetUidCount || 0),
            Number(action.typeObservedWrongCount || 0), action.sourceExamDate || '', action.sourceExamTitle || ''
        ] : null
    });
}

function clinicPrintAssessmentErrorMessage(error) {
    const messages = {
        OFFLINE: '오프라인 상태입니다. 연결 후 같은 배정 계획을 이어서 처리하세요.',
        RECOVERY_REQUIRED: '이전 배정의 저장·배정 결과가 미확정입니다. 먼저 “미확정 배정 확인”을 실행하세요.',
        RECONCILE_UNAVAILABLE: '미확정 배정 확인 기능을 불러오지 못했습니다. 화면을 새로고침한 뒤 다시 시도하세요.',
        RECOVERY_RECEIPT_INVALID: '이전 작업 확인 정보가 손상되어 새 배정을 잠갔습니다. 미확정 배정을 확인해 주세요.',
        RECOVERY_STORAGE_UNAVAILABLE: '브라우저에 이전 작업 확인 정보를 저장하거나 읽을 수 없습니다. 저장소를 확인한 뒤 다시 시도하세요.',
        TRANSPORT_ERROR: '서버 응답이 끊겨 저장·배정 결과가 미확정입니다. 미확정 배정 확인을 실행하세요.',
        HTTP_ERROR: '서버가 시험 배정 요청을 확인하지 못했습니다. 배정 상태를 확인한 뒤 다시 시도하세요.',
        ASSIGNMENT_LOOKUP_FAILED: '기존 시험 배정 내역을 불러오지 못했습니다. 다시 새로고침하세요.',
        RESULT_LOOKUP_FAILED: '기존 응시 결과를 불러오지 못했습니다. 다시 새로고침하세요.',
        TARGET_GRADE_UNRESOLVED: '받는 반의 학년 정보를 확인할 수 없습니다. 반 정보를 수정한 뒤 다시 시도하세요.',
        SOURCE_GRADE_UNRESOLVED: '일부 추천 문항의 원본 학년을 확인할 수 없습니다. 해당 문항을 해제하고 다시 시도하세요.',
        SOURCE_GRADE_EXCEEDS_TARGET: '받는 반보다 높은 학년의 문항이 포함되어 있습니다. 추천 선택을 다시 확인하세요.',
        UNVERIFIED_RECOMMENDATION_ITEM: '추천 문항의 원본 확인이 끝나지 않았습니다. 후보를 다시 불러오세요.',
        NO_SELECTED_RECOMMENDATIONS: '시험으로 배정할 추천 문항을 선택하세요.',
        RECIPIENT_SEQUENCE_CONFLICT: '같은 학생에게 서로 다른 문항 순서가 지정되었습니다. 선택을 다시 확인하세요.',
        PAPER_LIMIT_EXCEEDED: '학생별 선택 문항이 허용 범위를 넘었습니다. 문항 수를 줄여 주세요.',
        INVALID_EXAM_DATE: '시험 날짜를 확인해 주세요.',
        INVALID_TITLE: '시험 제목을 1~100자로 입력하세요.'
    };
    return messages[String(error?.code || '')] || String(error?.message || '시험 배정 계획을 만들지 못했습니다. 입력과 선택 문항을 확인하세요.');
}

function clinicPrintAssessmentSelectionConfirmation(plan, selections, summaries, followUpAction = null) {
    const recommendationMode = typeof followUpAction === 'string'
        ? followUpAction : String(followUpAction?.mode || plan?.recommendationMode || '');
    const paperCount = (plan?.cohorts || []).reduce((count, cohort) => count +
        (cohort.contentBatches || []).reduce((batchCount, batch) => batchCount + (batch.papers || []).length, 0), 0);
    const selectedStudentCount = selections.length;
    const rows = summaries.map(row => `• ${row.studentName} · 선택 ${row.selectedCount}문항 (추천된 ${row.returnedCount} / 요청 ${row.requestedCount}문항)`);
    const lead = followUpAction?.targetScope
        ? `선택한 ${followUpAction.typeLabel || '유형'}의 ${recommendationMode === 'same_uid' ? '같은 UID 재연습' : '다른 유사문항'} 시험을 다음 학생에게 배정합니다.`
        : recommendationMode === 'same_uid' ? '같은 UID 재연습 시험을 다음 학생에게 배정합니다.'
        : recommendationMode === 'similar_uid' ? '다른 유사문항 후속 시험을 다음 학생에게 배정합니다.'
            : '유형 보충 시험을 다음 학생에게 배정합니다.';
    const basis = followUpAction?.targetScope
        ? `\n기준시험: ${followUpAction.sourceExamDate || '날짜 미상'} · ${followUpAction.sourceExamTitle || '추천 보충시험'}\n기준시험의 선택 유형 오답 UID: ${Number(followUpAction.targetUidCount || 0)}개 · 누적 관측 오답: ${Number(followUpAction.typeObservedWrongCount || 0)}회`
        : '';
    const seenPolicy = plan?.coverage?.includeSeenQuestionUids === true
        ? '\n이미 푼 문항 포함: 켬 (현재 조회 범위에서 확인된 응시 UID 기준)'
        : '';
    return `${lead}\n시험: ${plan.title}\n날짜: ${plan.examDate}${basis}${seenPolicy}\n대상: ${selectedStudentCount}명 · 시험지 ${paperCount}개\n${rows.join('\n')}\n\n학생별 선택 문항이 정확히 반영됩니다. 문항은 최대 50개씩 나누어 배정합니다. 이 수신 학생과 시험 내용을 확인하고 진행할까요?`;
}

function clinicPrintIsRecommendationAssessmentFormCurrent(title, examDate) {
    return clinicPrintClampText(document.getElementById('clinic-print-recommendation-assessment-title')?.value || '', 100) === String(title || '') &&
        String(document.getElementById('clinic-print-recommendation-assessment-date')?.value || '').trim() === String(examDate || '');
}

async function clinicPrintVerifyFollowUpStillLatest(action, state, requestId, contextKey, selectionSignature, title, examDate) {
    try {
        if (!clinicPrintIsFollowUpActionCurrent(action, state, requestId) || state.contextKey !== contextKey ||
            clinicPrintGetRecommendationSelectionSignature([action.studentId]) !== selectionSignature ||
            !clinicPrintIsRecommendationAssessmentFormCurrent(title, examDate)) return false;
        const result = await clinicPrintGetAssessmentClient().loadResults({
            classId: action.classId,
            assignmentId: action.assignmentId
        });
        if (!clinicPrintIsFollowUpActionCurrent(action, state, requestId) || state.contextKey !== contextKey ||
            clinicPrintGetRecommendationSelectionSignature([action.studentId]) !== selectionSignature ||
            !clinicPrintIsRecommendationAssessmentFormCurrent(title, examDate)) return false;
        const student = (result?.students || []).find(row => String(row.studentId || '') === String(action.studentId || ''));
        const studentCurrent = !!student && student.status === 'result' && student.followUpContext?.recommendationInput?.eligible === true &&
            String(student.sessionId || '') === String(action.sessionId || '') &&
            clinicPrintBuildFollowUpResultSignature(result.assignment || {}, student) === action.resultSignature;
        if (!studentCurrent || !action.targetScope) return studentCurrent;
        if (result?.coverage?.exactAssignment !== true || result?.coverage?.queryCoverage?.complete !== true) return false;
        const assessmentState = clinicPrintGetRecommendationAssessmentState(action.classId);
        const sourceAssignment = (assessmentState.discovered || []).find(row => String(row.assignmentId || '') === String(action.assignmentId || '') &&
            String(row.classId || '') === String(action.classId || ''));
        if (!sourceAssignment || Number(assessmentState.refreshRequestId || 0) !== Number(action.historyRefreshRequestId)) return false;
        const summarizeHistory = window.ClinicAssessment?.summarizeHistory;
        if (typeof summarizeHistory !== 'function') return false;
        const summary = summarizeHistory({
            classId: String(action.classId),
            assignments: [sourceAssignment],
            outcomes: [{ assignmentId: String(action.assignmentId), result }]
        });
        const latestStudent = (summary?.students || []).find(row => String(row.studentId || '') === String(action.studentId || ''));
        const latestType = (latestStudent?.types || []).find(row => String(row.pathKey || '') === String(action.targetScope.pathKey || '') &&
            row.difficultyBucket === action.targetScope.difficultyBucket);
        return !!latestType && (latestType.followUpSources || []).some(source =>
            String(source.assignmentId || '') === String(action.assignmentId || '') &&
            String(source.sessionId || '') === String(action.sourceSessionId || '') &&
            Number(source.targetUidCount) === Number(action.targetUidCount));
    } catch {
        return false;
    }
}

async function clinicPrintCreateRecommendationAssessment(classId) {
    const state = clinicPrintGetRecommendationAssessmentState(classId);
    if (['planning', 'issuing', 'refreshing', 'reconciling'].includes(state.status)) return;
    if (state.reconciliation && state.reconciliation.unlocked !== true) {
        toast('이전 저장·배정 결과를 먼저 확인하세요. 미확정 상태에서는 새 시험을 만들 수 없습니다.', 'warn');
        return;
    }
    if (state.plan && state.status !== 'complete') {
        toast('이전 배정의 미완료 항목을 먼저 이어서 처리하세요.', 'warn');
        return;
    }
    if (document.querySelector('input[name="clinic-print-mode"]:checked')?.value !== 'student') {
        toast('학생별 추천 문항 시험은 학생별 오답 모드에서 배정할 수 있습니다.', 'warn');
        return;
    }
    const selectedStudentIds = clinicPrintGetCheckedValues('clinic-print-student').map(String).sort();
    const followUpAction = clinicPrintRecommendationState.followUpAction || null;
    if (!selectedStudentIds.length) {
        toast('시험을 받을 학생을 선택하세요.', 'warn');
        return;
    }
    if (followUpAction && (selectedStudentIds.length !== 1 || selectedStudentIds[0] !== String(followUpAction.studentId || '') ||
        String(followUpAction.classId || '') !== String(classId || ''))) {
        toast('후속 시험에는 결과 카드의 학생 한 명만 수신자로 선택해야 합니다.', 'warn');
        return;
    }
    const targetGrade = clinicPrintGetClassGrade(classId);
    if (!window.Archive2Core || typeof window.Archive2Core.gradeRank !== 'function' || window.Archive2Core.gradeRank(targetGrade) <= 0) {
        toast('받는 반의 학년 정보를 확인할 수 없습니다. 반 정보를 확인한 뒤 시험을 배정하세요.', 'warn');
        return;
    }
    const formTitle = document.getElementById('clinic-print-recommendation-assessment-title');
    const formDate = document.getElementById('clinic-print-recommendation-assessment-date');
    const title = clinicPrintClampText(formTitle?.value || '', 100);
    const examDate = String(formDate?.value || '').trim();
    if (!title) {
        toast('시험 제목을 입력하세요.', 'warn');
        formTitle?.focus();
        return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(examDate) || !Number.isFinite(new Date(`${examDate}T00:00:00`).getTime())) {
        toast('시험 날짜를 확인하세요.', 'warn');
        formDate?.focus();
        return;
    }
    const currentRecommendationState = clinicPrintRecommendationState;
    const contextKey = clinicPrintGetRecommendationContextKey(classId, currentRecommendationState.scope);
    const selectedRecommendationSignature = clinicPrintGetRecommendationSelectionSignature(selectedStudentIds);
    const rawSelections = clinicPrintGetRecommendationAssessmentSelections(classId, selectedStudentIds);
    const selectedCount = rawSelections.reduce((count, row) => count + row.selection.items.length, 0);
    if (currentRecommendationState.status !== 'ready' || !selectedCount) {
        toast('추천 후보를 불러온 뒤 시험에 넣을 추천 문항을 체크하세요.', 'warn');
        return;
    }
    const selections = rawSelections.filter(row => row.selection.items.length).map(row => row.selection);
    const summaries = rawSelections.filter(row => row.selection.items.length).map(row => row.summary);
    clinicPrintAssessmentFormValues = { classId: String(classId), title, examDate };
    state.classId = String(classId);
    state.status = 'planning';
    state.error = '';
    state.plan = null;
    state.result = null;
    state.selectionSummary = summaries;
    clinicPrintRenderRecommendationAssessmentPanel(classId);
    try {
        const validated = await clinicPrintValidateSelectedRecommendations(classId);
        if (!validated) throw new Error('추천 문항 원본 확인을 완료하지 못했습니다.');
        if (clinicPrintRecommendationState !== currentRecommendationState ||
            clinicPrintGetRecommendationContextKey(classId, currentRecommendationState.scope) !== contextKey ||
            clinicPrintGetRecommendationSelectionSignature(selectedStudentIds) !== selectedRecommendationSignature ||
            JSON.stringify(clinicPrintGetCheckedValues('clinic-print-student').map(String).sort()) !== JSON.stringify(selectedStudentIds)) {
            throw new Error('검증 중 수신 학생 또는 추천 조건이 바뀌었습니다. 다시 확인해 주세요.');
        }
        const verifiedSelections = clinicPrintGetRecommendationAssessmentSelections(classId, selectedStudentIds)
            .filter(row => row.selection.items.length);
        const recommendationSettings = clinicPrintReadRecommendationSettings();
        const recommendationOptions = followUpAction?.mode === 'same_uid'
            ? clinicPrintRecommendationState.result?.recommendationOptions
            : recommendationSettings.recommendationOptions;
        if (!recommendationOptions) {
            throw new Error(recommendationSettings.errors.map(row => row.message).join(' '));
        }
        const historyCoverage = clinicPrintRecommendationState.result?.coverage || {};
        const candidateCatalog = await clinicPrintWithTimeout(
            clinicPrintLoadArchive2CandidateCatalog(), 95000, 'Archive 2.0 문항 목록 조회 시간이 초과되었습니다.'
        );
        if (clinicPrintRecommendationState !== currentRecommendationState ||
            clinicPrintGetRecommendationContextKey(classId, currentRecommendationState.scope) !== contextKey ||
            clinicPrintGetRecommendationSelectionSignature(selectedStudentIds) !== selectedRecommendationSignature ||
            JSON.stringify(clinicPrintGetCheckedValues('clinic-print-student').map(String).sort()) !== JSON.stringify(selectedStudentIds)) {
            throw new Error('시험 계획을 만드는 동안 수신 학생 또는 추천 문항 선택이 바뀌었습니다. 다시 확인해 주세요.');
        }
        const client = clinicPrintGetAssessmentClient();
        const plan = await client.createPlan({
            title,
            examDate,
            indexVersion: candidateCatalog.version,
            recommendationOptions,
            recommendationMode: followUpAction?.mode || undefined,
            coverage: historyCoverage,
            selections: verifiedSelections.map(row => ({
                ...row.selection,
                items: row.selection.items.map(item => ({
                    ...item,
                    candidate: { ...item.candidate, sourceGrade: item.sourceGrade }
                }))
            }))
        });
        if (clinicPrintRecommendationState !== currentRecommendationState ||
            clinicPrintGetRecommendationContextKey(classId, currentRecommendationState.scope) !== contextKey ||
            clinicPrintGetRecommendationSelectionSignature(selectedStudentIds) !== selectedRecommendationSignature ||
            JSON.stringify(clinicPrintGetCheckedValues('clinic-print-student').map(String).sort()) !== JSON.stringify(selectedStudentIds)) {
            throw new Error('시험 계획을 만드는 동안 수신 학생 또는 추천 조건이 바뀌었습니다. 다시 확인해 주세요.');
        }
        const plannedRecipientIds = new Set((plan.cohorts || []).flatMap(cohort => (cohort.studentIds || []).map(String)));
        const plannedSelections = verifiedSelections.filter(row => plannedRecipientIds.has(String(row.selection.studentId)));
        const plannedSummaries = summaries.filter(row => plannedRecipientIds.has(String(row.studentId)));
        if (!plannedSelections.length || plannedSelections.length !== plannedSummaries.length) {
            throw new Error('시험 계획의 실제 수신 학생을 확인할 수 없습니다. 선택을 다시 확인하세요.');
        }
        state.selectionSummary = plannedSummaries;
        clinicPrintRenderRecommendationAssessmentPanel(classId);
        if (!window.confirm(clinicPrintAssessmentSelectionConfirmation(plan, plannedSelections, plannedSummaries, followUpAction))) {
            state.status = 'cancelled';
            state.plan = null;
            clinicPrintRenderRecommendationAssessmentPanel(classId);
            return;
        }
        if (followUpAction && !await clinicPrintVerifyFollowUpStillLatest(
            followUpAction,
            currentRecommendationState,
            currentRecommendationState.requestId,
            contextKey,
            selectedRecommendationSignature,
            title,
            examDate
        )) {
            clinicPrintResetRecommendationState('class', classId);
            state.plan = null;
            state.status = 'cancelled';
            state.error = '';
            clinicPrintRenderRecommendationPanel(classId);
            clinicPrintRenderRecommendationAssessmentPanel(classId);
            clinicPrintSchedulePreviewPush(classId);
            toast('후속 응시 결과 또는 선택이 바뀌었거나 다시 확인할 수 없습니다. 후보를 다시 불러오세요. 시험지는 저장하지 않았습니다.', 'warn');
            return;
        }
        state.plan = plan;
        state.typeFollowUpPlanLock = clinicPrintCreateTypeFollowUpPlanLock(followUpAction, plan);
        state.result = null;
        state.status = 'issuing';
        clinicPrintRenderRecommendationAssessmentPanel(classId);
        state.result = await client.issue(plan, {
            onProgress: progress => {
                if (state.plan !== plan) return;
                state.result = progress;
                clinicPrintRenderRecommendationAssessmentPanel(classId);
            }
        });
        state.status = state.result?.status === 'ASSIGNED' ? 'complete' : 'partial';
        clinicPrintRenderRecommendationAssessmentPanel(classId);
        await clinicPrintRefreshRecommendationAssessment(classId, { quiet: true });
    } catch (error) {
        state.status = 'error';
        state.error = clinicPrintAssessmentErrorMessage(error);
        if (String(error?.code || '').startsWith('RECOVERY_')) {
            state.reconciliation = { status: 'UNRESOLVED', unlocked: false };
        }
        clinicPrintRenderRecommendationAssessmentPanel(classId);
        toast(state.error, 'warn');
    }
}

async function clinicPrintRetryRecommendationAssessment(classId) {
    const state = clinicPrintGetRecommendationAssessmentState(classId);
    if (!state.plan || ['planning', 'issuing', 'refreshing', 'reconciling'].includes(state.status)) return;
    state.status = 'issuing';
    state.error = '';
    clinicPrintRenderRecommendationAssessmentPanel(classId);
    try {
        const client = clinicPrintGetAssessmentClient();
        state.result = await client.issue(state.plan, {
            onProgress: progress => {
                if (!state.plan) return;
                state.result = progress;
                clinicPrintRenderRecommendationAssessmentPanel(classId);
            }
        });
        state.status = state.result?.status === 'ASSIGNED' ? 'complete' : 'partial';
        clinicPrintRenderRecommendationAssessmentPanel(classId);
        await clinicPrintRefreshRecommendationAssessment(classId, { quiet: true });
    } catch (error) {
        state.status = 'error';
        state.error = clinicPrintAssessmentErrorMessage(error);
        clinicPrintRenderRecommendationAssessmentPanel(classId);
        toast(state.error, 'warn');
    }
}

async function clinicPrintReconcileRecommendationAssessment(classId) {
    const state = clinicPrintGetRecommendationAssessmentState(classId);
    if (['planning', 'issuing', 'refreshing', 'reconciling'].includes(state.status)) return;
    let restoreStatus = state.status;
    const requestId = Number(state.reconcileRequestId || 0) + 1;
    state.reconcileRequestId = requestId;
    state.status = 'reconciling';
    clinicPrintRenderRecommendationAssessmentPanel(classId);
    const isCurrent = () => Number(state.reconcileRequestId) === requestId &&
        String(clinicPrintActiveClassId || '') === String(classId || '') &&
        !!document.getElementById('clinic-print-recommendation-assessment-body');
    try {
        const client = clinicPrintGetAssessmentClient();
        if (typeof client.reconcile !== 'function') {
            throw Object.assign(new Error('미확정 배정 확인 기능을 불러오지 못했습니다.'), { code: 'RECONCILE_UNAVAILABLE' });
        }
        const result = await client.reconcile({ classId: String(classId || '') });
        if (!isCurrent()) return;
        state.reconciliation = result;
        if (result?.unlocked === true) {
            state.plan = null;
            state.result = null;
            state.error = '';
            state.selectionSummary = [];
            restoreStatus = 'idle';
        }
        await clinicPrintRefreshRecommendationAssessment(classId, { quiet: true, internal: true });
    } catch (error) {
        if (!isCurrent()) return;
        state.reconciliation = {
            status: 'UNRESOLVED',
            unlocked: false,
            message: clinicPrintAssessmentErrorMessage(error)
        };
        toast(clinicPrintAssessmentErrorMessage(error), 'warn');
    } finally {
        state.status = restoreStatus;
        if (isCurrent()) clinicPrintRenderRecommendationAssessmentPanel(classId);
    }
}

async function clinicPrintRefreshRecommendationAssessment(classId, options = {}) {
    const state = clinicPrintGetRecommendationAssessmentState(classId);
    if (String(clinicPrintActiveClassId || '') !== String(classId || '') ||
        !document.getElementById('clinic-print-recommendation-assessment-body')) return;
    if (['planning', 'issuing', 'refreshing', 'reconciling'].includes(state.status) && !options.internal) return;
    if (state.status === 'refreshing') return;
    const previousStatus = state.status;
    const requestId = Number(state.refreshRequestId || 0) + 1;
    state.refreshRequestId = requestId;
    state.classId = String(classId || '');
    state.status = 'refreshing';
    state.discoveryError = '';
    state.historyExpandedStudents = new Map();
    state.attemptComparisonIndex = null;
    state.attemptComparisonIndexRefreshRequestId = 0;
    state.attemptComparisonSelections = new Map();
    state.typeFollowUpSourceSelections = new Map();
    if (String(clinicPrintRecommendationState.followUpAction?.classId || '') === String(classId || '') &&
        clinicPrintRecommendationState.followUpAction?.targetScope) clinicPrintInvalidateRecommendations(classId);
    state.historySummary = null;
    state.historySummaryStatus = 'loading';
    state.historySummaryError = '';
    clinicPrintRenderRecommendationAssessmentPanel(classId);
    const isCurrent = () => Number(state.refreshRequestId) === requestId &&
        String(clinicPrintActiveClassId || '') === String(classId || '') &&
        !!document.getElementById('clinic-print-recommendation-assessment-body');
    try {
        const refreshed = await clinicPrintWithTimeout(clinicPrintRefreshClassAssignments(classId), 45000, '기존 배정 조회 시간이 초과되었습니다.');
        if (!isCurrent()) return;
        if (!refreshed) throw new Error('기존 시험 배정을 불러오지 못했습니다.');
        const classData = clinicPrintClassClinicData.get(String(classId));
        const assignments = (Array.isArray(classData?.assignments) ? classData.assignments : [])
            .filter(row => String(row.class_id || '') === String(classId || ''));
        const client = clinicPrintGetAssessmentClient();
        const discovered = await client.discover({ classId: String(classId || ''), assignments });
        if (!isCurrent()) return;
        const outcomes = [];
        for (const assignment of (discovered.assignments || [])) {
            try {
                const result = await client.loadResults({ classId: String(classId || ''), assignmentId: assignment.assignmentId });
                outcomes.push({ assignmentId: assignment.assignmentId, result });
            } catch (error) {
                outcomes.push({ assignmentId: assignment.assignmentId, error: clinicPrintAssessmentErrorMessage(error) });
            }
            if (!isCurrent()) return;
        }
        state.discovered = discovered.assignments || [];
        state.outcomes = outcomes;
        state.discoveryLoaded = true;
        state.discoveryError = outcomes.some(row => row.error) ? '일부 시험의 실제 응시 결과를 조회하지 못했습니다. 다시 새로고침할 수 있습니다.' : '';
        const summarizeHistory = window.ClinicAssessment?.summarizeHistory;
        if (typeof summarizeHistory !== 'function') throw new Error('누적 보충 이력 요약 모듈을 불러오지 못했습니다.');
        state.historySummary = summarizeHistory({ classId: String(classId || ''), assignments: state.discovered, outcomes: state.outcomes });
        state.historySummaryStatus = state.historySummary?.status === 'ready' || state.historySummary?.status === 'partial' || state.historySummary?.status === 'empty'
            ? state.historySummary.status : 'error';
        try {
            const buildIndex = window.ClinicAssessment?.buildAttemptComparisonIndex;
            if (typeof buildIndex === 'function') {
                state.attemptComparisonIndex = buildIndex({ classId: String(classId || ''), assignments: state.discovered, outcomes: state.outcomes });
                state.attemptComparisonIndexRefreshRequestId = requestId;
            }
        } catch {
            state.attemptComparisonIndex = null;
            state.attemptComparisonIndexRefreshRequestId = 0;
        }
        if (state.historySummaryStatus === 'error') {
            state.historySummary = null;
            state.historySummaryError = '누적 보충 이력 요약을 만들지 못했습니다.';
            state.attemptComparisonIndex = null;
            state.attemptComparisonIndexRefreshRequestId = 0;
            state.attemptComparisonSelections = new Map();
        }
    } catch (error) {
        if (isCurrent()) {
            state.discoveryError = clinicPrintAssessmentErrorMessage(error);
            state.discoveryLoaded = true;
            state.historySummary = null;
            state.historySummaryStatus = 'error';
            state.historySummaryError = clinicPrintAssessmentErrorMessage(error);
            state.attemptComparisonIndex = null;
            state.attemptComparisonIndexRefreshRequestId = 0;
            state.attemptComparisonSelections = new Map();
            if (!options.quiet) toast(state.discoveryError, 'warn');
        }
    } finally {
        state.status = previousStatus === 'refreshing' ? 'idle' : previousStatus;
        if (isCurrent()) clinicPrintRenderRecommendationAssessmentPanel(classId);
    }
}

function clinicPrintRenderAssessmentOperationDetails(state = clinicPrintGetRecommendationAssessmentState()) {
    const cohorts = Array.isArray(state.result?.cohorts) ? state.result.cohorts : [];
    if (!cohorts.length) return '';
    const studentsById = new Map(clinicPrintGetClassStudents(state.classId).map(student => [String(student.id), student]));
    return cohorts.map(cohort => {
        const recipientNames = (cohort.studentIds || []).map(id => studentsById.get(String(id))?.name || String(id));
        const batches = Array.isArray(cohort.saveBatches) ? cohort.saveBatches : [];
        const paperRows = batches.flatMap(batch => (batch.papers || []).map(paper => ({
            batchStatus: batch.status,
            batchError: batch.error || '',
            ...paper
        })));
        return `<div style="border-top:1px solid var(--border);margin-top:9px;padding-top:8px;">
            <div style="font-size:12px;font-weight:700;">${clinicPrintEscapeHtml(cohort.className || '반')} · ${clinicPrintEscapeHtml(recipientNames.join(', '))} · ${Number(cohort.returnedCount || cohort.questionUids?.length || 0)}문항</div>
            ${paperRows.map(paper => {
                const error = paper.error || paper.batchError || '';
                return `<div style="font-size:11px;margin-top:4px;">시험 ${Number(paper.paperIndex || 0)}/${Number(paper.paperCount || 0)} · ${Number(paper.sequenceStart || 0)}–${Number(paper.sequenceEnd || 0)}번 · ${clinicPrintEscapeHtml(clinicPrintAssessmentStatusLabel(paper.batchStatus))} · 학생 배정 ${clinicPrintEscapeHtml(clinicPrintAssessmentStatusLabel(paper.status))}${paper.pdfFailure ? ` <span style="color:var(--error);">(PDF 준비 실패: ${clinicPrintEscapeHtml(paper.pdfFailure)})</span>` : ''}${error ? `<div style="color:var(--error);margin-top:2px;">${clinicPrintEscapeHtml(error)}</div>` : ''}</div>`;
            }).join('')}
        </div>`;
    }).join('');
}

function clinicPrintAssessmentQuestionStatusLabel(status) {
    return ({ correct: '정답', wrong: '오답', partial: '부분 채점', unchecked: '미채점', unresolved: '미확인' })[String(status || '')] || '미확인';
}

function clinicPrintHistoryCount(value) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? Math.floor(number) : 0;
}

function clinicPrintHistoryCountsPresent(row, keys) {
    return !!row && keys.every(key => Object.prototype.hasOwnProperty.call(row, key) &&
        Number.isFinite(Number(row[key])) && Number(row[key]) >= 0);
}

function clinicPrintHistorySummaryShapeValid(summary) {
    const coverageKeys = [
        'assignmentCount', 'processedAssignmentCount', 'cancelledAssignmentCount', 'failedOutcomeLookupCount',
        'missingOutcomeCount', 'duplicateAssignmentCount', 'duplicateOutcomeCount', 'foreignClassCount',
        'assignmentOutcomeMismatchCount', 'duplicateStudentCount', 'sessionIdentityConflictCount',
        'queryPartialAssignmentCount', 'completeResultCount', 'partialResultCount', 'unresolvedResultCount',
        'pendingCount', 'excludedCount', 'cancelledPendingCount', 'unclassifiedWrongCount', 'invalidMetaRefCount'
    ];
    if (!['ready', 'partial', 'empty'].includes(summary?.status) || !clinicPrintHistoryCountsPresent(summary?.coverage, coverageKeys) ||
        !['complete', 'partial', 'empty'].includes(summary?.coverage?.queryStatus) ||
        !['complete', 'partial', 'unresolved', 'not_observed'].includes(summary?.coverage?.latestResultStatus) ||
        !['complete', 'partial', 'unresolved', 'not_observed'].includes(summary?.coverage?.frozenMetaStatus) ||
        !Array.isArray(summary.students)) return false;
    const statusKeys = ['completeResult', 'partial', 'unresolved', 'pending', 'excluded', 'cancelledPending'];
    const countKeys = ['observedWrongCount', 'distinctQuestionUidCount', 'repeatUidCount', 'repeatUidObservationCount'];
    return summary.students.every(student => clinicPrintHistoryCountsPresent(student, countKeys) &&
        clinicPrintHistoryCountsPresent(student?.coverage?.statusCounts, statusKeys) &&
        clinicPrintHistoryCountsPresent(student?.coverage, ['unclassifiedWrongCount']) &&
        Array.isArray(student.types) && Array.isArray(student.history) && student.types.every(type =>
            typeof type.pathKey === 'string' && !!type.pathKey &&
            (type.difficultyBucket === null || Number.isInteger(type.difficultyBucket) && type.difficultyBucket >= 1 && type.difficultyBucket <= 5) &&
            clinicPrintHistoryCountsPresent(type, [...countKeys, 'assignmentCount']) &&
            Array.isArray(type.followUpSources) && type.followUpSources.every(source =>
                typeof source.assignmentId === 'string' && !!source.assignmentId &&
                typeof source.sessionId === 'string' && !!source.sessionId &&
                Number.isInteger(source.targetUidCount) && source.targetUidCount > 0) &&
            ['same_uid', 'similar_uid', 'legacy_transfer'].every(mode =>
                clinicPrintHistoryCountsPresent(type.provenanceCounts?.[mode], [...countKeys, 'assignmentCount']))));
}

function clinicPrintHistoryCoverageLine(coverage = {}) {
    return `배정 ${clinicPrintHistoryCount(coverage.assignmentCount)}건 · 조회 ${clinicPrintHistoryCount(coverage.processedAssignmentCount)}/${clinicPrintHistoryCount(coverage.assignmentCount)}건 · 응시 완결 ${clinicPrintHistoryCount(coverage.completeResultCount)} · 부분 ${clinicPrintHistoryCount(coverage.partialResultCount)} · 미확인 ${clinicPrintHistoryCount(coverage.unresolvedResultCount)} · 대기 ${clinicPrintHistoryCount(coverage.pendingCount)} · 제외 ${clinicPrintHistoryCount(coverage.excludedCount)} · 취소 배정 ${clinicPrintHistoryCount(coverage.cancelledAssignmentCount)} · 취소로 미응시 ${clinicPrintHistoryCount(coverage.cancelledPendingCount)} · 미분류 오답 ${clinicPrintHistoryCount(coverage.unclassifiedWrongCount)}`;
}

function clinicPrintHistoryCoverageDetails(coverage = {}) {
    const issues = [
        ['결과 조회 실패', coverage.failedOutcomeLookupCount],
        ['결과 누락', coverage.missingOutcomeCount],
        ['부분 조회', coverage.queryPartialAssignmentCount],
        ['중복 배정', coverage.duplicateAssignmentCount],
        ['중복 결과', coverage.duplicateOutcomeCount],
        ['반 외 배정', coverage.foreignClassCount],
        ['배정·결과 불일치', coverage.assignmentOutcomeMismatchCount],
        ['중복 학생', coverage.duplicateStudentCount],
        ['응시 정보 충돌', coverage.sessionIdentityConflictCount],
        ['유형 근거 미확인', coverage.invalidMetaRefCount]
    ].filter(([, value]) => clinicPrintHistoryCount(value) > 0);
    if (!issues.length) return '';
    return `<details style="margin-top:4px;"><summary style="cursor:pointer;font-size:10px;color:var(--secondary);">조회 오류·불일치 ${issues.length}종 자세히</summary><div style="font-size:10px;color:var(--secondary);margin-top:3px;">${issues.map(([label, value]) => `${label} ${clinicPrintHistoryCount(value)}`).join(' · ')}</div></details>`;
}

function clinicPrintHistoryPathLabel(type = {}) {
    const path = type.path && typeof type.path === 'object' ? type.path : {};
    const levels = ['L1', 'L2', 'L3', 'L4'].map(level => String(path[level] || '').trim()).filter(Boolean);
    const pathLabel = levels.join(' › ') || String(type.pathKey || '').trim() || '정본 유형 경로 미확인';
    return `${pathLabel}${Number.isInteger(type.difficultyBucket) ? ` · 난이도 ${type.difficultyBucket}` : ' · 난이도 미확인'}`;
}

function clinicPrintTypeScopeBucketToken(value) {
    return value === null ? 'null' : String(value);
}

function clinicPrintParseTypeScopeBucketToken(token) {
    if (token === 'null') return { valid: true, value: null };
    const number = Number(token);
    return { valid: Number.isInteger(number) && number >= 1 && number <= 5, value: number };
}

function clinicPrintTypeFollowUpSourceSelectionKey(classId, studentId, pathKey, difficultyBucket) {
    return JSON.stringify([String(classId || ''), String(studentId || ''), String(pathKey || ''), difficultyBucket]);
}

function clinicPrintIsTypeFollowUpContextLocked(classId, assessmentState = clinicPrintGetRecommendationAssessmentState(classId)) {
    const typePlanLock = clinicPrintGetTypeFollowUpPlanLock(assessmentState);
    return !!typePlanLock || ['planning', 'issuing', 'refreshing', 'reconciling'].includes(assessmentState.status) ||
        !!assessmentState.plan && assessmentState.status !== 'complete';
}

function clinicPrintBuildTypeFollowUpPlanSignature(plan) {
    return JSON.stringify([
        String(plan?.operationId || ''),
        String(plan?.signature || ''),
        String(plan?.recommendationMode || '')
    ]);
}

function clinicPrintCreateTypeFollowUpPlanLock(action, plan) {
    if (!action?.targetScope || !plan?.operationId || !plan?.signature) return null;
    return {
        operationId: String(plan.operationId),
        planSignature: clinicPrintBuildTypeFollowUpPlanSignature(plan),
        recommendationMode: String(plan.recommendationMode || action.mode || ''),
        targetScope: { pathKey: String(action.targetScope.pathKey), difficultyBucket: action.targetScope.difficultyBucket },
        typeLabel: String(action.typeLabel || ''),
        sourceExamDate: String(action.sourceExamDate || ''),
        sourceExamTitle: String(action.sourceExamTitle || ''),
        sourceTargetUidCount: Number(action.targetUidCount || 0),
        typeObservedWrongCount: Number(action.typeObservedWrongCount || 0)
    };
}

function clinicPrintGetTypeFollowUpPlanLock(assessmentState) {
    const lock = assessmentState?.typeFollowUpPlanLock;
    if (!lock) return null;
    const plan = assessmentState.plan;
    if (plan && (String(plan.operationId || '') !== lock.operationId ||
        clinicPrintBuildTypeFollowUpPlanSignature(plan) !== lock.planSignature)) {
        assessmentState.typeFollowUpPlanLock = null;
        return null;
    }
    const safelyReleased = assessmentState.status === 'complete' ||
        assessmentState.status === 'cancelled' && !plan ||
        assessmentState.reconciliation?.unlocked === true && !plan;
    if (safelyReleased) {
        assessmentState.typeFollowUpPlanLock = null;
        return null;
    }
    return lock;
}

function clinicPrintOnRecommendationAssessmentFormChange(classId) {
    const action = clinicPrintRecommendationState.followUpAction;
    const state = clinicPrintGetRecommendationAssessmentState(classId);
    const typePlanLock = clinicPrintGetTypeFollowUpPlanLock(state);
    const hasTypeContext = !!typePlanLock ||
        !!(action?.targetScope && String(action.classId || '') === String(classId || ''));
    if (!hasTypeContext) return;
    if (clinicPrintIsTypeFollowUpContextLocked(classId, state)) {
        if (clinicPrintAssessmentFormValues.classId === String(classId || '')) {
            const title = document.getElementById('clinic-print-recommendation-assessment-title');
            const date = document.getElementById('clinic-print-recommendation-assessment-date');
            if (title) title.value = clinicPrintAssessmentFormValues.title;
            if (date) date.value = clinicPrintAssessmentFormValues.examDate;
        }
        toast('시험 배정 확인 중에는 시험 제목과 날짜를 바꿀 수 없습니다.', 'warn');
    }
}

function clinicPrintGetTypeFollowUpSourceSelection(assessmentState, studentId, type) {
    const key = clinicPrintTypeFollowUpSourceSelectionKey(assessmentState.classId, studentId, type.pathKey, type.difficultyBucket);
    const selection = assessmentState.typeFollowUpSourceSelections?.get(key);
    if (!selection || Number(selection.refreshRequestId) !== Number(assessmentState.refreshRequestId || 0)) return null;
    return selection;
}

function clinicPrintIsTypeFollowUpSourceCurrent(action) {
    if (!action?.targetScope) return true;
    const assessmentState = clinicPrintGetRecommendationAssessmentState(action.classId);
    const selected = assessmentState.typeFollowUpSourceSelections?.get(action.typeSourceKey);
    return Number(assessmentState.refreshRequestId || 0) === Number(action.historyRefreshRequestId) && !!selected &&
        Number(selected.refreshRequestId) === Number(action.historyRefreshRequestId) &&
        String(selected.assignmentId || '') === String(action.assignmentId || '') &&
        String(selected.sessionId || '') === String(action.sourceSessionId || '') &&
        Number(selected.targetUidCount) === Number(action.targetUidCount);
}

function clinicPrintSetTypeFollowUpSourceSelection(classId, studentId, pathKey, bucketToken, sourceIndex, selectElement) {
    const bucket = clinicPrintParseTypeScopeBucketToken(String(bucketToken || ''));
    if (!bucket.valid || String(clinicPrintActiveClassId || '') !== String(classId || '')) return;
    const state = clinicPrintGetRecommendationAssessmentState(classId);
    const student = (state.historySummary?.students || []).find(row => String(row.studentId || '') === String(studentId || ''));
    const type = (student?.types || []).find(row => String(row.pathKey || '') === String(pathKey || '') && row.difficultyBucket === bucket.value);
    const sources = Array.isArray(type?.followUpSources) ? type.followUpSources : [];
    const index = Number(sourceIndex);
    const source = Number.isInteger(index) && index >= 0 ? sources[index] : null;
    const key = clinicPrintTypeFollowUpSourceSelectionKey(classId, studentId, pathKey, bucket.value);
    if (clinicPrintIsTypeFollowUpContextLocked(classId, state)) {
        const previous = state.typeFollowUpSourceSelections?.get(key);
        const previousIndex = previous ? sources.findIndex(row => String(row.assignmentId) === previous.assignmentId && String(row.sessionId) === previous.sessionId) : -1;
        if (selectElement) selectElement.value = previousIndex >= 0 ? String(previousIndex) : '';
        toast('시험 배정 확인 중에는 기준 시험을 바꿀 수 없습니다.', 'warn');
        return;
    }
    if (sourceIndex === '' || !source || !source.assignmentId || !source.sessionId || !Number.isInteger(source.targetUidCount) || source.targetUidCount <= 0) {
        state.typeFollowUpSourceSelections?.delete(key);
    } else {
        state.typeFollowUpSourceSelections.set(key, {
            assignmentId: String(source.assignmentId),
            sessionId: String(source.sessionId),
            targetUidCount: source.targetUidCount,
            refreshRequestId: Number(state.refreshRequestId || 0)
        });
    }
    if (String(clinicPrintRecommendationState.followUpAction?.classId || '') === String(classId || '')) {
        clinicPrintInvalidateRecommendations(classId);
    }
    const controls = selectElement?.closest('[data-type-followup-control]');
    const selectedForDisplay = sourceIndex === '' ? null : source;
    controls?.querySelectorAll('[data-type-followup-mode]').forEach(button => { button.disabled = !selectedForDisplay; });
    const uidCount = controls?.querySelector('[data-type-followup-source-count]');
    if (uidCount) uidCount.textContent = selectedForDisplay ? `선택 기준 이 유형 오답 UID ${clinicPrintHistoryCount(selectedForDisplay.targetUidCount)}개` : '';
}

function clinicPrintRenderTypeFollowUpControls(classId, student, type, studentIndex, typeIndex, state) {
    const sources = Array.isArray(type.followUpSources) ? type.followUpSources : [];
    if (!sources.length) return '<div style="font-size:10px;color:var(--secondary);margin-top:4px;">완결된 응시에서 확인된 이 유형의 후속 근거가 없습니다.</div>';
    const selection = clinicPrintGetTypeFollowUpSourceSelection(state, student.studentId, type);
    const selectedIndex = selection ? sources.findIndex(source =>
        String(source.assignmentId) === selection.assignmentId && String(source.sessionId) === selection.sessionId) : -1;
    const selected = selectedIndex >= 0 ? sources[selectedIndex] : null;
    const selectId = `clinic-print-followup-source-${studentIndex}-${typeIndex}`;
    const disabled = clinicPrintIsTypeFollowUpContextLocked(classId, state);
    const options = sources.map((source, index) => {
        const assignment = (state.discovered || []).find(row => String(row.assignmentId || '') === String(source.assignmentId || '')) || {};
        const label = `${assignment.examDate || assignment.exam_date || '날짜 미상'} · ${assignment.examTitle || assignment.exam_title || '추천 보충시험'} · 이 유형 오답 UID ${clinicPrintHistoryCount(source.targetUidCount)}개`;
        return `<option value="${index}" ${index === selectedIndex ? 'selected' : ''}>${clinicPrintEscapeHtml(label)}</option>`;
    }).join('');
    const jsArgs = `'${clinicPrintEscapeJsString(classId)}','${clinicPrintEscapeJsString(student.studentId)}','${clinicPrintEscapeJsString(type.pathKey)}','${clinicPrintEscapeJsString(clinicPrintTypeScopeBucketToken(type.difficultyBucket))}'`;
    return `<div data-type-followup-control style="margin-top:6px;padding:6px;border-left:2px solid var(--border);"><div style="font-size:10px;font-weight:700;">기준시험 선택</div><select id="${selectId}" aria-label="${clinicPrintEscapeAttr(`${student.studentName || '학생'} ${clinicPrintHistoryPathLabel(type)} 기준 시험`)}" style="max-width:100%;margin-top:3px;" ${disabled ? 'disabled' : ''} onchange="clinicPrintSetTypeFollowUpSourceSelection(${jsArgs},this.value,this)"><option value="" ${selectedIndex < 0 ? 'selected' : ''}>기준 보충시험 선택…</option>${options}</select><div style="font-size:10px;color:var(--secondary);margin-top:3px;">누적 관측 오답 ${clinicPrintHistoryCount(type.observedWrongCount)}회 · 고유 UID ${clinicPrintHistoryCount(type.distinctQuestionUidCount)}개</div><div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:5px;"><button type="button" data-type-followup-mode="same_uid" class="clinic-print-mini-btn" ${!selected || disabled ? 'disabled' : ''} onclick="clinicPrintStartTypeFollowUpRecommendations(${jsArgs},'same_uid')">같은 UID 재연습 후보</button><button type="button" data-type-followup-mode="similar_uid" class="clinic-print-mini-btn" ${!selected || disabled ? 'disabled' : ''} onclick="clinicPrintStartTypeFollowUpRecommendations(${jsArgs},'similar_uid')">다른 유사문항 후보</button></div><div data-type-followup-source-count style="font-size:10px;color:var(--secondary);margin-top:3px;">${selected ? `선택 기준 이 유형 오답 UID ${clinicPrintHistoryCount(selected.targetUidCount)}개` : ''}</div></div>`;
}

function clinicPrintHistoryPurposeLabel(mode) {
    return ({ same_uid: '같은 UID 재연습', similar_uid: '다른 유사문항', legacy_transfer: '일반 추천 보충시험' })[String(mode || '')] || '목적 미상 이력';
}

function clinicPrintHistoryMetaCoverageLabel(status) {
    return ({ complete: '유형 분류 확인', partial: '유형 분류 일부 확인', unresolved: '유형 분류 확인 불가', not_observed: '유형 미관측' })[String(status || '')] || '유형 분류 확인 불가';
}

function clinicPrintHistoryResultCoverageLabel(status) {
    return ({ complete: '응시 결과 확인', partial: '응시 결과 일부 확인', unresolved: '응시 결과 확인 불가', not_observed: '응시 결과 미관측' })[String(status || '')] || '응시 결과 확인 불가';
}

function clinicPrintAssessmentHistoryExpanded(state, studentId) {
    const entry = state.historyExpandedStudents?.get(String(studentId || ''));
    return !!entry && Number(entry.refreshRequestId) === Number(state.refreshRequestId || 0) && entry.expanded === true;
}

function clinicPrintRenderAssessmentHistoryEventRow(state, student, row) {
    const classId = String(state.classId || '');
    const assignmentId = String(row.assignmentId || '');
    const studentId = String(student.studentId || '');
    const navigateButton = classId && assignmentId && studentId
        ? `<button type="button" class="clinic-print-mini-btn" style="margin-top:3px;" aria-label="${clinicPrintEscapeAttr(`${student.studentName || '학생'} ${row.examDate || ''} ${row.examTitle || '추천 보충시험'} 응시 결과 보기`)}" onclick="clinicPrintNavigateToAssessmentResult('${clinicPrintEscapeJsString(classId)}','${clinicPrintEscapeJsString(assignmentId)}','${clinicPrintEscapeJsString(studentId)}',${Number(state.refreshRequestId || 0)})">응시 결과 보기</button>`
        : '';
    return `<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-top:3px;"><span>${clinicPrintEscapeHtml(row.examDate || '날짜 미상')} · ${clinicPrintEscapeHtml(row.examTitle || '추천 보충시험')} · ${clinicPrintEscapeHtml(clinicPrintHistoryPurposeLabel(row.mode))} · ${clinicPrintEscapeHtml(clinicPrintAssessmentStatusLabel(row.attemptStatus))} · 관측 오답 ${clinicPrintHistoryCount(row.observedWrongCount)}회 · 미분류 ${clinicPrintHistoryCount(row.unclassifiedWrongCount)}${row.cancelled ? ' · 취소된 배정' : ''}${clinicPrintEscapeHtml(row.metaCoverageStatus && row.metaCoverageStatus !== 'complete' ? ` · ${clinicPrintHistoryMetaCoverageLabel(row.metaCoverageStatus)}` : '')}</span>${navigateButton}</div>`;
}

function clinicPrintAssessmentComparisonKey(attempt) {
    return JSON.stringify([String(attempt?.assignmentId || ''), String(attempt?.sessionId || '')]);
}

function clinicPrintGetAssessmentComparisonSelection(state, studentId) {
    const selection = state.attemptComparisonSelections?.get(String(studentId || ''));
    return selection && selection.classId === String(state.classId || '') &&
        Number(selection.refreshRequestId) === Number(state.refreshRequestId || 0) ? selection : null;
}

function clinicPrintAssessmentComparisonModeLabel(mode) {
    return ({ same_uid: '같은 UID 재연습', similar_uid: '다른 유사문항 보충', legacy: '기존 추천' })[String(mode || '')] || '추천 방식 확인 불가';
}

function clinicPrintAssessmentComparisonResultHtml(state, studentId) {
    const unavailable = '<div style="margin-top:6px;color:var(--secondary);">같은 반·학생의 서로 다른 제출 완료 응시를 기준 응시와 비교 응시에 각각 선택해 주세요. 현재 조회 범위에서 선택한 두 응시의 기록 결과를 나란히 보여줍니다.</div>';
    const selection = clinicPrintGetAssessmentComparisonSelection(state, studentId);
    if (!selection?.baselineKey || !selection?.comparisonKey) return unavailable;
    const compare = window.ClinicAssessment?.compareAssessmentAttempts;
    if (typeof compare !== 'function' || Number(state.attemptComparisonIndexRefreshRequestId) !== Number(state.refreshRequestId || 0)) {
        return '<div style="margin-top:6px;color:var(--secondary);">현재 조회의 비교 데이터를 확인할 수 없습니다. 새로고침해 주세요.</div>';
    }
    const result = compare({
        index: state.attemptComparisonIndex,
        classId: state.classId,
        studentId,
        baselineKey: selection.baselineKey,
        comparisonKey: selection.comparisonKey,
    });
    if (result?.status !== 'ready') return `<div style="margin-top:6px;color:var(--secondary);">${clinicPrintEscapeHtml(result?.reason || '두 응시를 확인할 수 없습니다. 다시 선택해 주세요.')}</div>`;
    const attemptSummary = attempt => `<div><strong>${clinicPrintEscapeHtml(attempt.examDate || '날짜 미상')} · ${clinicPrintEscapeHtml(attempt.examTitle || '추천 보충시험')}</strong><div>${clinicPrintEscapeHtml(clinicPrintAssessmentComparisonModeLabel(attempt.recommendationMode))} · 응시 ID ${clinicPrintEscapeHtml(attempt.sessionId)}</div><div>관측 문항 ${clinicPrintHistoryCount(attempt.observed.questionCount)}개 · 정답 ${clinicPrintHistoryCount(attempt.observed.correctCount)} · 오답 ${clinicPrintHistoryCount(attempt.observed.wrongCount)}${attempt.observed.scoreAvailable ? ` · 기록 점수 ${clinicPrintEscapeHtml(attempt.observed.score)}` : ' · 기록 점수 없음'}</div></div>`;
    const comparedUids = result.overlappingUids.length
        ? result.overlappingUids.map(uid => {
            const left = result.baseline.questionResults.find(row => row.questionUid === uid);
            const right = result.comparison.questionResults.find(row => row.questionUid === uid);
            const leftLabel = left?.status === 'correct' ? '정답' : '오답';
            const rightLabel = right?.status === 'correct' ? '정답' : '오답';
            return `<tr><td style="word-break:break-all;">${clinicPrintEscapeHtml(uid)}</td><td>${leftLabel}</td><td>${rightLabel}</td>${result.sameAssignment ? `<td>${leftLabel} → ${rightLabel}</td>` : ''}</tr>`;
        }).join('')
        : '<div style="margin-top:5px;color:var(--secondary);">두 응시에서 UID가 겹치지 않습니다. 각 문항 결과는 서로 다른 관측입니다.</div>';
    const comparisonRows = result.overlappingUids.length
        ? `<div style="overflow-x:auto;margin-top:5px;"><table style="border-collapse:collapse;width:100%;font-size:10px;"><thead><tr><th style="text-align:left;">실제 겹치는 UID</th><th>기준 응시</th><th>비교 응시</th>${result.sameAssignment ? '<th>같은 배정 내 응답 변화(관측)</th>' : ''}</tr></thead><tbody>${comparedUids}</tbody></table></div>`
        : comparedUids;
    const onlyList = (label, uids) => `<div style="margin-top:4px;"><strong>${label}만 포함된 UID ${uids.length}개</strong>${uids.length ? `<ul style="margin:2px 0 0;padding-left:18px;">${uids.map(uid => `<li style="word-break:break-all;">${clinicPrintEscapeHtml(uid)}</li>`).join('')}</ul>` : ''}</div>`;
    const transitionNote = result.sameAssignment
        ? '<div style="margin-top:5px;color:var(--secondary);">같은 동결 배정의 공통 UID에 기록된 두 응답을 나란히 표시합니다.</div>'
        : '<div style="margin-top:5px;color:var(--secondary);">서로 다른 시험의 같은 UID는 문항 내용 버전이 확인되지 않습니다. 각 응시의 기록 결과를 나란히 표시합니다.</div>';
    return `<div style="margin-top:7px;padding:7px;border-top:1px solid var(--border);"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px;">${attemptSummary(result.baseline)}${attemptSummary(result.comparison)}</div><div style="margin-top:7px;font-weight:700;">UID 겹침별 관측</div>${comparisonRows}${onlyList('기준 응시', result.baselineOnlyUids)}${onlyList('비교 응시', result.comparisonOnlyUids)}<div style="margin-top:5px;color:var(--secondary);">한쪽 응시에만 있는 UID는 해당 응시에서만 관측되었습니다.</div>${transitionNote}</div>`;
}

function clinicPrintRenderAssessmentAttemptComparison(state, student) {
    const classId = String(state.classId || '');
    const studentId = String(student?.studentId || '');
    const generation = Number(state.refreshRequestId || 0);
    const candidates = state.attemptComparisonIndexRefreshRequestId === generation
        ? state.attemptComparisonIndex?.candidatesByStudent?.[studentId] || [] : [];
    const availability = state.attemptComparisonIndexRefreshRequestId === generation
        ? state.attemptComparisonIndex?.unavailableByStudent?.[studentId] || {} : {};
    const selection = clinicPrintGetAssessmentComparisonSelection(state, studentId) || {};
    const renderOptions = selectedKey => candidates.map(candidate => {
        const key = clinicPrintAssessmentComparisonKey(candidate);
        const label = `${candidate.examDate || '날짜 미상'} · ${candidate.examTitle || '추천 보충시험'} · 응시 ID ${candidate.sessionId} · ${clinicPrintAssessmentComparisonModeLabel(candidate.recommendationMode)}`;
        return `<option value="${clinicPrintEscapeAttr(key)}" ${selectedKey === key ? 'selected' : ''}>${clinicPrintEscapeHtml(label)}</option>`;
    }).join('');
    const args = `'${clinicPrintEscapeJsString(classId)}','${clinicPrintEscapeJsString(studentId)}',${generation}`;
    const current = Number(state.attemptComparisonIndexRefreshRequestId) === generation && state.attemptComparisonIndex;
    const unavailableCount = Object.values(availability).reduce((sum, count) => sum + Number(count || 0), 0);
    const note = !current
        ? '현재 조회 범위에서 비교 가능한 응시를 확인할 수 없습니다. 새로고침 후 다시 확인해 주세요.'
        : candidates.length
            ? `현재 조회 범위의 제출이 확인된 완결 응시 ${candidates.length}건을 선택할 수 있습니다. 미제출 ${clinicPrintHistoryCount(availability.unsubmitted)} · 제출 상태 미확인 ${clinicPrintHistoryCount(availability.submissionNotReported)} · 부분 ${clinicPrintHistoryCount(availability.partial)} · 미확인 ${clinicPrintHistoryCount(availability.unresolved + availability.malformed)} · 대기 ${clinicPrintHistoryCount(availability.pending)} · 제외 ${clinicPrintHistoryCount(availability.excluded)} · 취소 ${clinicPrintHistoryCount(availability.cancelled)} 응시는 비교 대상에서 제외합니다. 정확한 결과 조회를 확인하지 못한 배정 ${clinicPrintHistoryCount(state.attemptComparisonIndex.coverage?.unavailableAssignmentCount)}건은 선택 목록에서 제외했습니다.`
            : `현재 조회 범위에서 제출 확인된 완결 응시가 없습니다. 미제출 ${clinicPrintHistoryCount(availability.unsubmitted)} · 제출 상태 미확인 ${clinicPrintHistoryCount(availability.submissionNotReported)} · 부분·미확인·대기·제외·취소 응시는 비교 대상에서 제외합니다. 누락된 결과를 0점으로 채우지 않습니다.${unavailableCount ? ` 제외 관측 ${unavailableCount}건.` : ''}${current && state.attemptComparisonIndex.coverage?.unavailableAssignmentCount ? ` 정확한 결과 조회 미확인 배정 ${clinicPrintHistoryCount(state.attemptComparisonIndex.coverage.unavailableAssignmentCount)}건.` : ''}`;
    const disabled = !current || candidates.length === 0;
    const select = (role, label, key) => `<label style="display:block;margin-top:5px;">${label}<select data-clinic-comparison-role="${role}" aria-label="${clinicPrintEscapeAttr(`${student.studentName || studentId} ${label}`)}" style="display:block;width:100%;margin-top:2px;" ${disabled ? 'disabled' : ''} onchange="clinicPrintSetAssessmentComparisonAttempt(${args},'${role}',this.value,this)"><option value="" ${key ? '' : 'selected'}>${label} 선택…</option>${renderOptions(key)}</select></label>`;
    const baselineKey = selection.baselineKey || '';
    const comparisonKey = selection.comparisonKey || '';
    return `<details data-clinic-attempt-comparison-container data-clinic-comparison-class-id="${clinicPrintEscapeAttr(classId)}" data-clinic-comparison-student-id="${clinicPrintEscapeAttr(studentId)}" data-clinic-comparison-refresh-id="${generation}" style="margin-top:7px;padding:6px;border:1px solid var(--border);border-radius:7px;"><summary style="cursor:pointer;font-weight:700;">응시 결과 비교</summary><div style="margin-top:5px;font-size:10px;color:var(--secondary);">${clinicPrintEscapeHtml(note)} 각 응시의 기록 점수는 있는 경우에만 표시합니다.</div>${select('baseline', '기준 응시', baselineKey)}${select('comparison', '비교 응시', comparisonKey)}<div data-clinic-attempt-comparison-output>${clinicPrintAssessmentComparisonResultHtml(state, studentId)}</div></details>`;
}

function clinicPrintSetAssessmentComparisonAttempt(classId, studentId, refreshRequestId, role, key, selectElement) {
    const unavailable = () => toast('현재 조회의 같은 반·학생 응시 두 건을 하나로 확인할 수 없습니다. 이력을 새로고침해 주세요.', 'warn');
    const wantedClassId = String(classId || '');
    const wantedStudentId = String(studentId || '');
    const generation = Number(refreshRequestId);
    const roleName = String(role || '');
    if (!wantedClassId || !wantedStudentId || !['baseline', 'comparison'].includes(roleName) ||
        String(clinicPrintActiveClassId || '') !== wantedClassId) return unavailable(), false;
    const state = clinicPrintRecommendationAssessmentStates.get(wantedClassId);
    if (!state || String(state.classId || '') !== wantedClassId || Number(state.refreshRequestId || 0) !== generation ||
        Number(state.attemptComparisonIndexRefreshRequestId || 0) !== generation ||
        !['ready', 'partial'].includes(String(state.historySummaryStatus || '')) ||
        !(state.attemptComparisonSelections instanceof Map) || !selectElement || !document.documentElement.contains(selectElement)) return unavailable(), false;
    const students = (state.historySummary?.students || []).filter(row => String(row.studentId || '') === wantedStudentId);
    const containers = Array.from(document.querySelectorAll('[data-clinic-attempt-comparison-container]')).filter(node =>
        node.getAttribute('data-clinic-comparison-class-id') === wantedClassId &&
        node.getAttribute('data-clinic-comparison-student-id') === wantedStudentId &&
        node.getAttribute('data-clinic-comparison-refresh-id') === String(generation));
    if (students.length !== 1 || containers.length !== 1 || selectElement.closest('[data-clinic-attempt-comparison-container]') !== containers[0]) return unavailable(), false;
    const container = containers[0];
    const roleSelects = container.querySelectorAll(`select[data-clinic-comparison-role="${roleName}"]`);
    const outputNodes = container.querySelectorAll('[data-clinic-attempt-comparison-output]');
    const candidates = state.attemptComparisonIndex?.candidatesByStudent?.[wantedStudentId] || [];
    if (roleSelects.length !== 1 || roleSelects[0] !== selectElement || outputNodes.length !== 1 ||
        key && candidates.filter(candidate => clinicPrintAssessmentComparisonKey(candidate) === String(key)).length !== 1) return unavailable(), false;
    const previous = clinicPrintGetAssessmentComparisonSelection(state, wantedStudentId) || {
        classId: wantedClassId, studentId: wantedStudentId, refreshRequestId: generation,
        baselineKey: '', comparisonKey: '',
    };
    state.attemptComparisonSelections.set(wantedStudentId, {
        ...previous,
        ...(roleName === 'baseline' ? { baselineKey: String(key || '') } : { comparisonKey: String(key || '') }),
        classId: wantedClassId, studentId: wantedStudentId, refreshRequestId: generation,
    });
    outputNodes[0].innerHTML = clinicPrintAssessmentComparisonResultHtml(state, wantedStudentId);
    return true;
}

function clinicPrintRenderAssessmentHistorySummary(state = clinicPrintGetRecommendationAssessmentState()) {
    const status = String(state.historySummaryStatus || 'idle');
    const title = '<div style="font-size:12px;font-weight:800;">이 반에서 조회한 추천 보충시험 기준</div><div style="font-size:11px;font-weight:700;margin-top:2px;">누적 관측 오답 유형</div>';
    if (status === 'loading') {
        return `<section style="border:1px solid var(--border);border-radius:9px;padding:8px;margin-top:9px;">${title}<div class="clinic-print-note" aria-live="polite" style="margin-top:4px;">현재 반의 추천 보충시험 응시 결과를 조회하고 있습니다.</div></section>`;
    }
    if (status === 'error') {
        return `<section style="border:1px solid var(--border);border-radius:9px;padding:8px;margin-top:9px;">${title}<div style="font-size:11px;color:var(--error);margin-top:4px;" aria-live="polite">누적 보충 이력 조회 실패: ${clinicPrintEscapeHtml(state.historySummaryError || '결과를 확인할 수 없습니다. 다시 새로고침해 주세요.')}</div></section>`;
    }
    if (status === 'idle') {
        return state.discoveryLoaded ? '' : `<section style="border:1px solid var(--border);border-radius:9px;padding:8px;margin-top:9px;">${title}<div class="clinic-print-note" style="margin-top:4px;">새로고침하면 이 반에서 조회된 추천 보충시험 이력을 표시합니다.</div></section>`;
    }
    const summary = state.historySummary;
    if (!clinicPrintHistorySummaryShapeValid(summary)) {
        return `<section style="border:1px solid var(--border);border-radius:9px;padding:8px;margin-top:9px;">${title}<div style="font-size:11px;color:var(--error);margin-top:4px;">누적 이력 데이터 형식을 확인할 수 없습니다. 다시 새로고침해 주세요.</div></section>`;
    }
    const coverage = summary.coverage || {};
    const students = Array.isArray(summary.students) ? summary.students : [];
    const statusNote = '<div style="font-size:10px;color:var(--secondary);margin-top:4px;">조회된 시험별 최신 응시를 합산하며, 같은 UID도 다시 풀면 관측 횟수에 포함됩니다. 고유 UID 수는 문항 식별자 기준이며 문항 내용의 버전 수를 뜻하지 않습니다.</div>' + (summary.status === 'partial' ? '<div style="font-size:11px;color:var(--secondary);margin-top:4px;">일부 결과 또는 조회 범위가 미확인입니다. 아래 조회 범위의 분모를 함께 확인하세요.</div>' : '');
    const queryStatusLabel = coverage.queryStatus === 'complete' ? '조회 범위 확인'
        : coverage.queryStatus === 'empty' ? '조회 기록 없음' : '조회 범위 일부 확인';
    const resultStatusLabel = clinicPrintHistoryResultCoverageLabel(coverage.latestResultStatus);
    const metaStatusLabel = clinicPrintHistoryMetaCoverageLabel(coverage.frozenMetaStatus);
    const coverageStatus = `<div style="font-size:10px;color:var(--secondary);margin-top:4px;">${queryStatusLabel} · ${resultStatusLabel} · ${metaStatusLabel}</div>`;
    if (summary.status === 'empty' && !students.length) {
        return `<section style="border:1px solid var(--border);border-radius:9px;padding:8px;margin-top:9px;">${title}${statusNote}${coverageStatus}<div style="font-size:11px;color:var(--secondary);margin-top:4px;">이 반에서 조회된 추천 보충시험 응시 이력이 없습니다.</div><div style="font-size:10px;color:var(--secondary);margin-top:3px;">${clinicPrintEscapeHtml(clinicPrintHistoryCoverageLine(coverage))}</div>${clinicPrintHistoryCoverageDetails(coverage)}</section>`;
    }
    const studentRows = students.map((student, studentIndex) => {
        const types = Array.isArray(student.types) ? student.types : [];
        const history = Array.isArray(student.history) ? student.history : [];
        const studentCoverage = student.coverage || {};
        const studentStatuses = studentCoverage.statusCounts || {};
        const typesHtml = types.length ? types.map((type, typeIndex) => {
            const purposes = Object.entries(type.provenanceCounts || {})
                .filter(([, counts]) => clinicPrintHistoryCount(counts?.observedWrongCount) || clinicPrintHistoryCount(counts?.distinctQuestionUidCount))
                .map(([mode, counts]) => `<div style="margin:2px 0 0 12px;">${clinicPrintEscapeHtml(clinicPrintHistoryPurposeLabel(mode))}: 관측 ${clinicPrintHistoryCount(counts.observedWrongCount)}회 · 고유 UID ${clinicPrintHistoryCount(counts.distinctQuestionUidCount)}개 · 반복 UID ${clinicPrintHistoryCount(counts.repeatUidCount)}개 · 반복 관측 ${clinicPrintHistoryCount(counts.repeatUidObservationCount)}회</div>`).join('');
            return `<div style="margin-top:5px;"><strong>${clinicPrintEscapeHtml(clinicPrintHistoryPathLabel(type))}</strong><div style="margin-left:12px;">관측 오답 ${clinicPrintHistoryCount(type.observedWrongCount)}회 · 고유 UID ${clinicPrintHistoryCount(type.distinctQuestionUidCount)}개 · 반복 UID ${clinicPrintHistoryCount(type.repeatUidCount)}개 · 반복 관측 ${clinicPrintHistoryCount(type.repeatUidObservationCount)}회${purposes}</div>${clinicPrintRenderTypeFollowUpControls(state.classId, student, type, studentIndex, typeIndex, state)}</div>`;
        }).join('') : '<div style="margin-top:4px;color:var(--secondary);">분류된 관측 오답 유형이 없습니다.</div>';
        const historyStudentId = String(student.studentId || '');
        const expanded = clinicPrintAssessmentHistoryExpanded(state, historyStudentId);
        const visibleHistory = expanded ? history : history.slice(0, 5);
        const historyHtml = visibleHistory.length
            ? visibleHistory.map(row => clinicPrintRenderAssessmentHistoryEventRow(state, student, row)).join('')
            : '<div style="margin-top:3px;color:var(--secondary);">표시할 보충시험 이력이 없습니다.</div>';
        const historyTitle = expanded
            ? `현재 조회 범위에서 확인된 이력 ${history.length}건`
            : `최근 ${visibleHistory.length}건 · 현재 조회 범위 ${history.length}건`;
        const historyClassId = String(state.classId || '');
        const historyGeneration = Number(state.refreshRequestId || 0);
        const toggleButton = history.length > 5
            ? `<button type="button" class="clinic-print-mini-btn" style="margin-top:4px;" aria-expanded="${expanded}" onclick="clinicPrintToggleAssessmentHistory('${clinicPrintEscapeJsString(historyClassId)}','${clinicPrintEscapeJsString(historyStudentId)}',${historyGeneration})">${expanded ? '최근 5건만 보기' : `조회된 이력 ${history.length}건 모두 보기`}</button>`
            : '';
        return `<details style="border-top:1px solid var(--border);padding-top:6px;margin-top:6px;"><summary style="cursor:pointer;font-size:11px;font-weight:700;">${clinicPrintEscapeHtml(student.studentName || student.studentId || '학생')} · 관측 오답 ${clinicPrintHistoryCount(student.observedWrongCount)}회 · 고유 UID ${clinicPrintHistoryCount(student.distinctQuestionUidCount)}개 · 반복 관측 ${clinicPrintHistoryCount(student.repeatUidObservationCount)}회</summary><div style="font-size:11px;margin-top:5px;"><div style="color:var(--secondary);">완결 ${clinicPrintHistoryCount(studentStatuses.completeResult)} · 부분 ${clinicPrintHistoryCount(studentStatuses.partial)} · 미확인 ${clinicPrintHistoryCount(studentStatuses.unresolved)} · 대기 ${clinicPrintHistoryCount(studentStatuses.pending)} · 제외 ${clinicPrintHistoryCount(studentStatuses.excluded)} · 취소로 미응시 ${clinicPrintHistoryCount(studentStatuses.cancelledPending)} · 미분류 오답 ${clinicPrintHistoryCount(studentCoverage.unclassifiedWrongCount)}</div><div style="margin-top:5px;font-weight:700;">유형별 누적 관측</div>${typesHtml}<div data-clinic-history-student-container data-clinic-history-class-id="${clinicPrintEscapeAttr(historyClassId)}" data-clinic-history-student-id="${clinicPrintEscapeAttr(historyStudentId)}" data-clinic-history-refresh-id="${historyGeneration}" style="margin-top:7px;"><div data-clinic-history-title style="font-weight:700;">${clinicPrintEscapeHtml(historyTitle)}</div><div data-clinic-history-list>${historyHtml}</div>${toggleButton}${clinicPrintRenderAssessmentAttemptComparison(state, student)}</div></div></details>`;
    }).join('');
    return `<section style="border:1px solid var(--border);border-radius:9px;padding:8px;margin-top:9px;">${title}${statusNote}${coverageStatus}<div style="font-size:10px;color:var(--secondary);margin-top:4px;">${clinicPrintEscapeHtml(clinicPrintHistoryCoverageLine(coverage))}</div>${clinicPrintHistoryCoverageDetails(coverage)}${studentRows || '<div style="font-size:11px;color:var(--secondary);margin-top:5px;">표시할 학생별 누적 이력이 없습니다.</div>'}</section>`;
}

function clinicPrintToggleAssessmentHistory(classId, studentId, refreshRequestId) {
    const unavailable = () => toast('현재 조회된 학생별 이력을 찾을 수 없습니다. 기존 배정·응시 결과를 새로고침해 주세요.', 'warn');
    const wantedClassId = String(classId || '');
    const wantedStudentId = String(studentId || '');
    const generation = Number(refreshRequestId);
    if (!wantedClassId || !wantedStudentId || String(clinicPrintActiveClassId || '') !== wantedClassId) {
        unavailable();
        return false;
    }
    const state = clinicPrintRecommendationAssessmentStates.get(wantedClassId);
    if (!state || String(state.classId || '') !== wantedClassId ||
        Number(state.refreshRequestId || 0) !== generation ||
        !['ready', 'partial'].includes(String(state.historySummaryStatus || '')) ||
        !['ready', 'partial'].includes(String(state.historySummary?.status || '')) ||
        !(state.historyExpandedStudents instanceof Map)) {
        unavailable();
        return false;
    }
    const matchingStudents = (state.historySummary.students || []).filter(row => String(row.studentId || '') === wantedStudentId);
    if (matchingStudents.length !== 1 || !Array.isArray(matchingStudents[0].history) || matchingStudents[0].history.length <= 5) {
        unavailable();
        return false;
    }
    const containers = Array.from(document.querySelectorAll('[data-clinic-history-student-container]')).filter(node =>
        node.getAttribute('data-clinic-history-class-id') === wantedClassId &&
        node.getAttribute('data-clinic-history-student-id') === wantedStudentId &&
        node.getAttribute('data-clinic-history-refresh-id') === String(generation));
    if (containers.length !== 1) {
        unavailable();
        return false;
    }
    const container = containers[0];
    const titleNodes = container.querySelectorAll('[data-clinic-history-title]');
    const listNodes = container.querySelectorAll('[data-clinic-history-list]');
    const toggleButtons = container.querySelectorAll('button[aria-expanded]');
    if (titleNodes.length !== 1 || listNodes.length !== 1 || toggleButtons.length !== 1) {
        unavailable();
        return false;
    }

    const previous = state.historyExpandedStudents.get(wantedStudentId);
    const wasExpanded = !!previous && Number(previous.refreshRequestId) === generation && previous.expanded === true;
    const expanded = !wasExpanded;
    const student = matchingStudents[0];
    const displayedHistory = expanded ? student.history : student.history.slice(0, 5);
    titleNodes[0].textContent = expanded
        ? `현재 조회 범위에서 확인된 이력 ${student.history.length}건`
        : `최근 ${displayedHistory.length}건 · 현재 조회 범위 ${student.history.length}건`;
    listNodes[0].innerHTML = displayedHistory.map(row => clinicPrintRenderAssessmentHistoryEventRow(state, student, row)).join('');
    toggleButtons[0].textContent = expanded ? '최근 5건만 보기' : `조회된 이력 ${student.history.length}건 모두 보기`;
    toggleButtons[0].setAttribute('aria-expanded', String(expanded));
    state.historyExpandedStudents.set(wantedStudentId, { refreshRequestId: generation, expanded });
    return true;
}

function clinicPrintRenderFollowUpContext(student = {}, classId = '', assignment = {}) {
    const context = student?.followUpContext;
    if (!context || typeof context !== 'object' || !context.coverage || typeof context.coverage !== 'object') {
        return '<div style="color:var(--secondary);margin-top:3px;">후속 유형 근거를 확인할 수 없습니다.</div>';
    }
    const coverage = context.coverage;
    const status = String(context.status || coverage.attemptStatus || '').toLowerCase();
    const groups = Array.isArray(context.confirmedWrongByMeta) ? context.confirmedWrongByMeta : [];
    const count = value => Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : 0;
    const coverageLine = [
        `배정 문항 ${count(coverage.questionCount)}`,
        `정답 ${count(coverage.correctCount)}`,
        `오답 ${count(coverage.wrongCount)}`,
        `미분류 ${count(coverage.unclassifiedCount)}`,
        `부분·미채점 ${count(coverage.partialCount)}`,
        `미확인 ${count(coverage.unresolvedCount)}`
    ].join(' · ');
    const evidenceNotes = [
        count(coverage.missingSnapshotCount) ? `동결 문항 스냅샷 누락 ${count(coverage.missingSnapshotCount)}개` : '',
        count(coverage.unresolvedSnapshotCount) ? `동결 문항 스냅샷 미확정 ${count(coverage.unresolvedSnapshotCount)}개` : '',
        count(coverage.unresolvedIdentityCount) ? `문항 identity 미확인 ${count(coverage.unresolvedIdentityCount)}개` : '',
        count(coverage.missingPathCount) ? `정본 유형 경로 미확인 ${count(coverage.missingPathCount)}개` : '',
        count(coverage.missingBucketCount) ? `난이도 미확인 ${count(coverage.missingBucketCount)}개` : '',
        coverage.metaCoverageStatus === 'partial' ? '정본 유형 분류 일부 확인' : '',
        coverage.metaCoverageStatus === 'unresolved' ? '정본 유형 분류 확인 불가' : ''
    ].filter(Boolean);
    const statusNote = status === 'pending' ? '응시 전입니다.'
        : status === 'excluded' ? '이 학생은 배정에서 제외되었습니다.'
            : status === 'partial' ? '일부 결과만 확인되어 관측 오답은 표시하며 후속 추천 근거로 확정하지 않습니다.'
                : status === 'unresolved' ? '결과 또는 동결 근거를 확인할 수 없어 후속 추천 근거로 확정하지 않습니다.'
                    : '';
    const targetRows = groups.map(group => {
        const path = group?.path && typeof group.path === 'object' ? group.path : {};
        const pathLabel = ['L1', 'L2', 'L3', 'L4'].map(level => String(path[level] || '').trim()).filter(Boolean).join(' › ');
        if (!pathLabel) return '';
        const bucket = Number.isInteger(group.difficultyBucket) && group.difficultyBucket >= 1 && group.difficultyBucket <= 5
            ? `난이도 ${group.difficultyBucket}` : '난이도 미확인';
        const orderNos = Array.isArray(group.questionOrderNos)
            ? [...new Set(group.questionOrderNos.map(Number).filter(value => Number.isInteger(value) && value > 0))].sort((a, b) => a - b)
            : [];
        const orders = orderNos.length ? ` · 문항 ${orderNos.map(value => `${value}번`).join(', ')}` : '';
        return `<div style="margin-top:3px;">${clinicPrintEscapeHtml(pathLabel)} · ${clinicPrintEscapeHtml(bucket)} · 문항 ${count(group.questionCount)}개 · 관측 오답 ${count(group.observedWrongCount)}건 · 후속 추천 근거 ${count(group.recommendationEligibleCount)}개${orders}</div>`;
    }).filter(Boolean).join('');
    const noWrongNote = status === 'result' && !groups.length && count(coverage.wrongCount) === 0
        ? '동결 정본 Meta에서 확인된 확정 오답 유형이 없습니다.' : '';
    const followUpTargetUidCount = new Set((Array.isArray(context.recommendationInput?.targets) ? context.recommendationInput.targets : [])
        .flatMap(target => Array.isArray(target?.questionRefs) ? target.questionRefs.map(ref => String(ref?.sourceQuestionUid || '')).filter(Boolean) : [])).size;
    const actionButtons = status === 'result' && context.recommendationInput?.eligible === true &&
        Array.isArray(context.recommendationInput?.targets) && context.recommendationInput.targets.length
        ? `<div style="margin-top:5px;">이번 결과의 후속 대상 UID ${followUpTargetUidCount}개</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
            <button type="button" class="clinic-print-mini-btn" onclick="clinicPrintStartFollowUpRecommendations('${clinicPrintEscapeJsString(classId)}','${clinicPrintEscapeJsString(assignment?.assignmentId || assignment?.id || '')}','${clinicPrintEscapeJsString(student?.studentId || student?.student_id || '')}','same_uid')">같은 UID 재연습 후보</button>
            <button type="button" class="clinic-print-mini-btn" onclick="clinicPrintStartFollowUpRecommendations('${clinicPrintEscapeJsString(classId)}','${clinicPrintEscapeJsString(assignment?.assignmentId || assignment?.id || '')}','${clinicPrintEscapeJsString(student?.studentId || student?.student_id || '')}','similar_uid')">다른 유사 문항 후보</button>
        </div>` : '';
    return `<div style="font-size:11px;color:var(--secondary);margin-top:3px;"><strong>후속 보충 대상 유형 요약</strong><div style="margin-top:2px;">${clinicPrintEscapeHtml(coverageLine)}</div>${statusNote ? `<div style="margin-top:2px;">${clinicPrintEscapeHtml(statusNote)}</div>` : ''}${noWrongNote ? `<div style="margin-top:2px;">${clinicPrintEscapeHtml(noWrongNote)}</div>` : ''}${targetRows}${evidenceNotes.length ? `<div style="margin-top:2px;">${clinicPrintEscapeHtml(evidenceNotes.join(' · '))}</div>` : ''}<div style="margin-top:2px;">이 요약은 이번 보충시험 응답의 유형별 관측이며, 기존 문항의 회복률을 뜻하지 않습니다.</div>${actionButtons}</div>`;
}

function clinicPrintRenderAssessmentDiscovery(state = clinicPrintGetRecommendationAssessmentState()) {
    const assignments = Array.isArray(state.discovered) ? state.discovered : [];
    const historySummary = clinicPrintRenderAssessmentHistorySummary(state);
    const outcomesById = new Map((Array.isArray(state.outcomes) ? state.outcomes : [])
        .map(row => [String(row.assignmentId || row.result?.assignment?.assignmentId || ''), row]).filter(([id]) => id));
    if (!assignments.length) {
        return `${historySummary}${state.discoveryLoaded && !state.discoveryError ? '<div class="clinic-print-note" style="margin-top:8px;">추천 유형 보충 시험 배정이 없습니다.</div>' : ''}`;
    }
    return `${historySummary}<div style="border-top:1px solid var(--border);margin-top:10px;padding-top:8px;">
        <div style="font-size:12px;font-weight:800;">기존 추천 시험 배정·응시 기록</div>
        ${assignments.map(assignment => {
            const outcomeRow = outcomesById.get(String(assignment.assignmentId || ''));
            const outcome = outcomeRow?.result;
            const students = Array.isArray(outcome?.students) ? outcome.students : [];
            const assignmentModeLabel = assignment.provenanceKind === 'legacy_transfer' ? '일반 추천 보충시험'
                : assignment.recommendationMode === 'same_uid' ? '같은 UID 재연습'
                    : assignment.recommendationMode === 'similar_uid' ? '다른 유사문항' : '';
            const requested = Number(assignment.requestedCount || assignment.questionCount || 0);
            const coverage = outcome?.coverage || {};
            const snapshotMismatch = coverage.frozenQuestionBridgeVerified === false ||
                (coverage.frozenQuestionCount != null && coverage.expectedQuestionCount != null &&
                    Number(coverage.frozenQuestionCount) !== Number(coverage.expectedQuestionCount));
            const resultCoverageNotes = [
                coverage.status === 'partial' ? '응시 조회 범위 일부 확인' : '',
                coverage.resultCoverage === 'partial' ? '응시 결과 일부 또는 미확인' : '',
                Number(coverage.missingResultSessionCount || 0) > 0 ? `결과 문항 누락 세션 ${Number(coverage.missingResultSessionCount)}건` : '',
                snapshotMismatch ? `동결 문항 snapshot ${Number(coverage.frozenQuestionCount || 0)}/${Number(coverage.expectedQuestionCount || 0)}개` : ''
            ].filter(Boolean);
            return `<div style="border:1px solid var(--border);border-radius:9px;padding:8px;margin-top:7px;">
                <div style="font-size:12px;font-weight:700;">${clinicPrintEscapeHtml(assignment.examTitle || '유형 보충 시험')} · ${clinicPrintEscapeHtml(assignment.examDate || '')} · ${assignmentModeLabel ? `${clinicPrintEscapeHtml(assignmentModeLabel)} · ` : ''}시험 ${Number(assignment.paperIndex || 0)}/${Number(assignment.paperCount || 1)}</div>
                <div style="font-size:11px;color:var(--secondary);margin-top:3px;">배정 ${Number(assignment.questionCount || 0)}문항 · 추천 요청 ${requested}문항${outcome?.coverage ? ` · 실제 응시 ${Number(coverage.sessionCount || 0)}건 · 결과 문항 ${Number(coverage.resultItemCount || 0)}건` : ''}${resultCoverageNotes.length ? ` · ${clinicPrintEscapeHtml(resultCoverageNotes.join(' · '))}` : ''}</div>
                ${outcomeRow?.error ? `<div style="font-size:11px;color:var(--error);margin-top:4px;">응시 결과를 확인하지 못했습니다: ${clinicPrintEscapeHtml(outcomeRow.error)}</div>` : ''}
                ${students.map(student => {
                    const resultClassId = String(state.classId || '');
                    const resultAssignmentId = String(assignment.assignmentId || assignment.id || '');
                    const resultStudentId = String(student.studentId || student.student_id || '');
                    const score = student.scoreAvailable === true && student.score != null ? ` · 실제 점수 ${clinicPrintEscapeHtml(student.score)}` : '';
                    const questionResults = student.sessionId
                        ? (student.questionResults || []).map(row => `${Number(row.orderNo || 0)}번 ${clinicPrintAssessmentQuestionStatusLabel(row.status)}`).join(' · ')
                        : '';
                    return `<div data-clinic-assessment-result-row data-clinic-class-id="${clinicPrintEscapeAttr(resultClassId)}" data-clinic-assignment-id="${clinicPrintEscapeAttr(resultAssignmentId)}" data-clinic-student-id="${clinicPrintEscapeAttr(resultStudentId)}" tabindex="-1" style="font-size:11px;margin-top:5px;"><strong>${clinicPrintEscapeHtml(student.studentName || student.studentId || '학생')}</strong> · ${clinicPrintEscapeHtml(clinicPrintAssessmentStatusLabel(student.status))}${score}${questionResults ? `<div style="color:var(--secondary);margin-top:2px;">${clinicPrintEscapeHtml(questionResults)}</div>` : ''}${clinicPrintRenderFollowUpContext(student, state.classId, assignment)}</div>`;
                }).join('')}
            </div>`;
        }).join('')}
    </div>`;
}

function clinicPrintNavigateToAssessmentResult(classId, assignmentId, studentId, refreshRequestId) {
    const unavailable = () => toast('현재 조회된 응시 결과를 하나로 확인할 수 없습니다. 기존 배정·응시 결과를 새로고침해 주세요.', 'warn');
    const wantedClassId = String(classId || '');
    const wantedAssignmentId = String(assignmentId || '');
    const wantedStudentId = String(studentId || '');
    if (!wantedClassId || !wantedAssignmentId || !wantedStudentId ||
        String(clinicPrintActiveClassId || '') !== wantedClassId) {
        unavailable();
        return false;
    }
    const state = clinicPrintRecommendationAssessmentStates.get(wantedClassId);
    if (!state) {
        unavailable();
        return false;
    }
    const currentGeneration = Number(state.refreshRequestId || 0);
    if (String(state.classId || '') !== wantedClassId || currentGeneration !== Number(refreshRequestId) ||
        !['ready', 'partial'].includes(String(state.historySummaryStatus || '')) ||
        !['ready', 'partial'].includes(String(state.historySummary?.status || ''))) {
        unavailable();
        return false;
    }

    const matchingStudents = (state.historySummary.students || []).filter(row => String(row.studentId || '') === wantedStudentId);
    if (matchingStudents.length !== 1) {
        unavailable();
        return false;
    }
    const matchingHistoryRows = (matchingStudents[0].history || []).filter(row => String(row.assignmentId || '') === wantedAssignmentId);
    if (matchingHistoryRows.length !== 1) {
        unavailable();
        return false;
    }

    const matchingAssignments = (state.discovered || []).filter(row =>
        String(row.classId || row.class_id || '') === wantedClassId &&
        String(row.assignmentId || row.id || '') === wantedAssignmentId);
    if (matchingAssignments.length !== 1) {
        unavailable();
        return false;
    }
    const matchingOutcomes = (state.outcomes || []).filter(row =>
        String(row.assignmentId || row.assignment_id || row.result?.assignment?.assignmentId || row.result?.assignment?.id || '') === wantedAssignmentId);
    if (matchingOutcomes.length !== 1 || matchingOutcomes[0].error || !matchingOutcomes[0].result || typeof matchingOutcomes[0].result !== 'object') {
        unavailable();
        return false;
    }
    const result = matchingOutcomes[0].result;
    const resultAssignment = result.assignment || {};
    if (String(resultAssignment.classId || resultAssignment.class_id || '') !== wantedClassId ||
        String(resultAssignment.assignmentId || resultAssignment.id || '') !== wantedAssignmentId) {
        unavailable();
        return false;
    }
    const matchingResultStudents = (Array.isArray(result.students) ? result.students : []).filter(row =>
        String(row.studentId || row.student_id || '') === wantedStudentId);
    if (matchingResultStudents.length !== 1) {
        unavailable();
        return false;
    }

    const targetRows = Array.from(document.querySelectorAll('[data-clinic-assessment-result-row]')).filter(row =>
        row.getAttribute('data-clinic-class-id') === wantedClassId &&
        row.getAttribute('data-clinic-assignment-id') === wantedAssignmentId &&
        row.getAttribute('data-clinic-student-id') === wantedStudentId);
    if (targetRows.length !== 1) {
        unavailable();
        return false;
    }
    const target = targetRows[0];
    target.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    try {
        target.focus({ preventScroll: true });
    } catch {
        target.focus?.();
    }
    return true;
}

function clinicPrintSetFollowUpRecipient(classId, studentId) {
    const classStudents = clinicPrintGetClassStudents(classId);
    const student = classStudents.find(row => String(row.id || '') === String(studentId || ''));
    if (!student) return false;
    const root = document.getElementById('clinic-print-student-list');
    if (!root) return false;
    let target = Array.from(root.querySelectorAll('input[name="clinic-print-student"]'))
        .find(input => String(input.value || '') === String(studentId || ''));
    if (!target) {
        const label = document.createElement('label');
        label.className = 'clinic-print-student-row';
        label.innerHTML = `<span class="clinic-print-student-row__main"><input type="checkbox" name="clinic-print-student" value="${clinicPrintEscapeAttr(studentId)}" onchange="clinicPrintOnRecipientChange('${clinicPrintEscapeJsString(classId)}')"><span class="clinic-print-student-row__name">${clinicPrintEscapeHtml(student.name || studentId)}${student.className ? ` · ${clinicPrintEscapeHtml(student.className)}` : ''}</span></span><span class="clinic-print-student-row__count">후속 결과 대상</span>`;
        root.prepend(label);
        target = label.querySelector('input[name="clinic-print-student"]');
    }
    if (!target) return false;
    root.querySelectorAll('input[name="clinic-print-student"]').forEach(input => { input.checked = input === target; });
    target.checked = true;
    return true;
}

function clinicPrintIsFollowUpActionCurrent(action, state, requestId = state?.requestId) {
    return !!action && clinicPrintRecommendationState === state && state?.followUpAction === action &&
        String(clinicPrintActiveClassId || '') === String(action.classId || '') &&
        String(state.classId || '') === String(action.classId || '') &&
        Number(state.requestId) === Number(requestId) &&
        document.querySelector('input[name="clinic-print-mode"]:checked')?.value === 'student' &&
        JSON.stringify(clinicPrintGetCheckedValues('clinic-print-student').map(String).sort()) === JSON.stringify([String(action.studentId || '')]) &&
        clinicPrintIsTypeFollowUpSourceCurrent(action) &&
        clinicPrintGetRecommendationContextKey(action.classId, state.scope) === state.contextKey;
}

async function clinicPrintStartTypeFollowUpRecommendations(classId, studentId, pathKey, bucketToken, mode) {
    const bucket = clinicPrintParseTypeScopeBucketToken(String(bucketToken || ''));
    if (!bucket.valid || String(clinicPrintActiveClassId || '') !== String(classId || '')) return;
    const assessmentState = clinicPrintGetRecommendationAssessmentState(classId);
    if (clinicPrintIsTypeFollowUpContextLocked(classId, assessmentState)) {
        toast('진행 중이거나 미확정인 시험 배정 작업을 먼저 확인하세요.', 'warn');
        return;
    }
    const typeSourceKey = clinicPrintTypeFollowUpSourceSelectionKey(classId, studentId, pathKey, bucket.value);
    const selectedSource = assessmentState.typeFollowUpSourceSelections?.get(typeSourceKey);
    const generation = Number(assessmentState.refreshRequestId || 0);
    if (!selectedSource || Number(selectedSource.refreshRequestId) !== generation) {
        toast('기준 보충시험을 선택하고 결과를 새로고침해 주세요.', 'warn');
        return;
    }
    const studentSummary = (assessmentState.historySummary?.students || []).find(row => String(row.studentId || '') === String(studentId || ''));
    const type = (studentSummary?.types || []).find(row => String(row.pathKey || '') === String(pathKey || '') && row.difficultyBucket === bucket.value);
    const source = (type?.followUpSources || []).find(row => String(row.assignmentId || '') === String(selectedSource.assignmentId) &&
        String(row.sessionId || '') === String(selectedSource.sessionId) && Number(row.targetUidCount) === Number(selectedSource.targetUidCount));
    if (!source) {
        assessmentState.typeFollowUpSourceSelections.delete(typeSourceKey);
        clinicPrintRenderRecommendationAssessmentPanel(classId);
        toast('선택한 기준시험의 완결된 유형 근거가 더 이상 확인되지 않습니다. 새로고침 후 다시 선택하세요.', 'warn');
        return;
    }
    const assignment = (assessmentState.discovered || []).find(row => String(row.assignmentId || '') === String(source.assignmentId || ''));
    const typeLabel = clinicPrintHistoryPathLabel(type);
    const sourceExamDate = String(assignment?.examDate || assignment?.exam_date || '');
    const sourceExamTitle = String(assignment?.examTitle || assignment?.exam_title || '추천 보충시험');
    await clinicPrintStartFollowUpRecommendations(classId, source.assignmentId, studentId, mode, {
        typeScope: { pathKey: String(type.pathKey || ''), difficultyBucket: bucket.value },
        typeSourceKey,
        source,
        historyRefreshRequestId: generation,
        typeLabel,
        typeObservedWrongCount: Number(type.observedWrongCount || 0),
        sourceExamDate,
        sourceExamTitle
    });
}

async function clinicPrintStartFollowUpRecommendations(classId, assignmentId, studentId, mode, typeContext = null) {
    const normalizedMode = mode === 'same_uid' || mode === 'similar_uid' ? mode : '';
    if (!normalizedMode || String(clinicPrintActiveClassId || '') !== String(classId || '')) return;
    if (document.querySelector('input[name="clinic-print-mode"]:checked')?.value !== 'student') {
        toast('후속 추천을 시작하려면 학생별 오답 모드로 전환하세요.', 'warn');
        return;
    }
    const assessmentState = clinicPrintGetRecommendationAssessmentState(classId);
    if (['planning', 'issuing', 'refreshing', 'reconciling'].includes(assessmentState.status) ||
        assessmentState.plan && assessmentState.status !== 'complete') {
        toast('진행 중이거나 미확정인 배정 작업을 먼저 확인하세요.', 'warn');
        return;
    }
    const assignment = (assessmentState.discovered || []).find(row =>
        String(row.assignmentId || '') === String(assignmentId || '') && String(row.classId || '') === String(classId || ''));
    const outcome = (assessmentState.outcomes || []).find(row =>
        String(row.assignmentId || row.result?.assignment?.assignmentId || '') === String(assignmentId || ''))?.result;
    const student = (outcome?.students || []).find(row => String(row.studentId || '') === String(studentId || ''));
    if (!assignment || !student || student.status !== 'result' || student.followUpContext?.recommendationInput?.eligible !== true) {
        toast('후속 결과가 최신 완결 응시인지 다시 확인하세요.', 'warn');
        return;
    }
    const currentTypeSourceSelection = typeContext ? assessmentState.typeFollowUpSourceSelections?.get(typeContext.typeSourceKey) : null;
    if (typeContext && (String(student.sessionId || '') !== String(typeContext.source?.sessionId || '') ||
        Number(assessmentState.refreshRequestId || 0) !== Number(typeContext.historyRefreshRequestId) ||
        String(currentTypeSourceSelection?.assignmentId || '') !== String(assignmentId || '') ||
        String(currentTypeSourceSelection?.sessionId || '') !== String(typeContext.source?.sessionId || '') ||
        Number(currentTypeSourceSelection?.targetUidCount) !== Number(typeContext.source?.targetUidCount))) {
        toast('선택한 기준시험의 응시 결과가 현재 조회본과 다릅니다. 새로고침 후 다시 선택하세요.', 'warn');
        return;
    }
    if (!clinicPrintGetClassStudents(classId).some(row => String(row.id || '') === String(studentId || ''))) {
        toast('현재 반의 수신 학생인지 확인할 수 없습니다.', 'warn');
        return;
    }
    if (!clinicPrintSetFollowUpRecipient(classId, studentId)) {
        toast('후속 결과 학생을 수신자 목록에 설정할 수 없습니다.', 'warn');
        return;
    }

    clinicPrintResetRecommendationState('class', classId);
    const state = clinicPrintRecommendationState;
    const action = {
        classId: String(classId),
        assignmentId: String(assignmentId),
        studentId: String(studentId),
        studentName: String(student.studentName || ''),
        sessionId: String(student.sessionId || ''),
        mode: normalizedMode,
        resultSignature: clinicPrintBuildFollowUpResultSignature(assignment, student),
        followUpContext: student.followUpContext,
        targetUidCount: typeContext ? Number(typeContext.source.targetUidCount) : new Set((student.followUpContext?.recommendationInput?.targets || [])
            .flatMap(target => Array.isArray(target?.questionRefs) ? target.questionRefs.map(ref => String(ref?.sourceQuestionUid || '')).filter(Boolean) : [])).size,
        sourceTargetUidCount: new Set((student.followUpContext?.recommendationInput?.targets || [])
            .flatMap(target => Array.isArray(target?.questionRefs) ? target.questionRefs.map(ref => String(ref?.sourceQuestionUid || '')).filter(Boolean) : [])).size,
        targetScope: typeContext?.typeScope || null,
        sourceSessionId: typeContext ? String(typeContext.source.sessionId) : '',
        typeSourceKey: typeContext?.typeSourceKey || '',
        historyRefreshRequestId: typeContext ? Number(typeContext.historyRefreshRequestId) : 0,
        typeLabel: typeContext?.typeLabel || '',
        typeObservedWrongCount: typeContext ? Number(typeContext.typeObservedWrongCount) : 0,
        sourceExamDate: typeContext?.sourceExamDate || '',
        sourceExamTitle: typeContext?.sourceExamTitle || '',
        questionResults: student.questionResults,
        coverage: outcome.coverage || {}
    };
    state.followUpAction = action;
    state.classId = String(classId);
    state.scope = 'class';
    state.status = 'loading';
    state.requestId = Number(state.requestId || 0) + 1;
    const requestId = state.requestId;
    state.contextKey = clinicPrintGetRecommendationContextKey(classId, state.scope);
    const contextKey = state.contextKey;
    clinicPrintSchedulePreviewPush(classId);
    clinicPrintRenderRecommendationPanel(classId);
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
        const settings = clinicPrintReadRecommendationSettings();
        if (normalizedMode === 'similar_uid' && !settings.recommendationOptions) {
            throw new Error(settings.errors.map(row => row.message).join(' '));
        }
        const catalog = await clinicPrintWithTimeout(
            clinicPrintLoadArchive2CandidateCatalog(),
            95000,
            'Archive 2.0 후보 목록 조회 시간이 초과되었습니다.'
        );
        if (!clinicPrintIsFollowUpActionCurrent(action, state, requestId) || contextKey !== state.contextKey) return;
        if (!window.ClinicRecommendations || typeof window.ClinicRecommendations.buildFollowUpCandidates !== 'function') {
            throw new Error('후속 추천 모듈을 불러오지 못했습니다.');
        }
        const recommendationOptions = settings.recommendationOptions || {
            countPerStudent: 5,
            difficultyMode: 'match_wrong',
            selectedDifficultyBuckets: []
        };
        const result = window.ClinicRecommendations.buildFollowUpCandidates({
            studentId: action.studentId,
            followUpContext: action.followUpContext,
            questionResults: action.questionResults,
            mode: action.mode,
            candidateRecords: clinicPrintPrepareArchive2CandidateRecords(catalog.records),
            archive2Core: window.Archive2Core,
            canonicalAuthority: catalog.catalog.canonicalAuthority,
            targetGrade: clinicPrintGetClassGrade(classId),
            recommendationOptions,
            ...(action.targetScope ? { targetScope: action.targetScope } : {})
        });
        if (!clinicPrintIsFollowUpActionCurrent(action, state, requestId) || contextKey !== state.contextKey) return;
        state.result = result;
        state.status = result?.status === 'invalid_context' ? 'stale'
            : result?.status === 'invalid_options' ? 'invalid_options'
                : Array.isArray(result?.candidates) && result.candidates.some(group => Array.isArray(group.items) && group.items.length)
                    ? 'ready' : 'empty';
        state.error = result?.status === 'invalid_context'
            ? (result.errors || []).map(row => row.message).filter(Boolean).join(' ') : '';
        clinicPrintRenderRecommendationPanel(classId);
        document.getElementById('clinic-print-recommendation-body')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
        if (!clinicPrintIsFollowUpActionCurrent(action, state, requestId)) return;
        state.status = 'error';
        state.error = String(error?.message || error || '후속 후보 조회 실패');
        clinicPrintRenderRecommendationPanel(classId);
    }
}

function clinicPrintClearFollowUpRecommendations(classId) {
    if (!clinicPrintRecommendationState.followUpAction) return;
    const assessmentState = clinicPrintGetRecommendationAssessmentState(classId);
    if (['planning', 'issuing', 'refreshing', 'reconciling'].includes(assessmentState.status) ||
        assessmentState.plan && assessmentState.status !== 'complete') {
        toast('진행 중이거나 미확정인 배정 작업을 먼저 확인하세요.', 'warn');
        return;
    }
    clinicPrintResetRecommendationState('class', classId);
    clinicPrintRenderRecommendationPanel(classId);
    clinicPrintSchedulePreviewPush(classId);
}

function clinicPrintPrepareArchive2CandidateRecords(records = []) {
    const core = window.Archive2Core;
    const fields = [...new Set([
        ...(Array.isArray(core?.META_FIELDS) ? core.META_FIELDS : []),
        ...(Array.isArray(core?.OPTIONAL_METADATA_FIELDS) ? core.OPTIONAL_METADATA_FIELDS : [])
    ])];
    return records.map(record => {
        const canonicalMeta = record.canonicalMeta && typeof record.canonicalMeta === 'object'
            ? { ...record.canonicalMeta }
            : {};
        fields.forEach(field => {
            if (Object.prototype.hasOwnProperty.call(record, field)) canonicalMeta[field] = record[field];
        });
        return {
            ...record,
            canonicalMeta,
            canonicalMetaFields: fields
        };
    });
}

function clinicPrintRecommendationCoverageLabel(scope, coverage = {}, classId = '') {
    const sessions = Number(coverage.sessionCount || 0);
    if (scope === 'grade') {
        const from = String(coverage.from || clinicPrintGradeData.get(String(classId))?.from || '').trim();
        const to = String(coverage.to || clinicPrintGradeData.get(String(classId))?.to || '').trim();
        return `같은 학년 최근 1개월${from && to ? ` (${from} ~ ${to})` : ''} · 조회 세션 ${sessions}개`;
    }
    const limited = coverage.limited === true || sessions >= 200;
    return `현재 반 최근 최대 200개 세션 · 대상 학생 조회 ${sessions}개${limited ? ' · 전체 이력은 아님' : ''}`;
}

function clinicPrintRecommendationCoverageNotes(coverage = {}) {
    const notes = [];
    const unknown = Number(coverage.unknownResultStatusCount || 0);
    const missing = Number(coverage.wrongEvidenceWithoutSnapshot || 0);
    const unresolved = Number(coverage.unresolvedWrongEvidenceCount || 0);
    const legacySessions = Number(coverage.legacyWrongAnswerSessionCount || 0);
    if (unknown) notes.push(`결과 상태 미확인 ${unknown}건 제외`);
    if (missing) notes.push(`동결 문항 snapshot 누락 ${missing}건`);
    if (unresolved) notes.push(`근거 미해결 ${unresolved}건 제외`);
    if (legacySessions) notes.push(`result item 없는 ${legacySessions}개 세션은 기존 오답행의 빈도만 사용`);
    return notes;
}

function clinicPrintRenderRecommendationPanel(classId = clinicPrintActiveClassId) {
    const body = document.getElementById('clinic-print-recommendation-body');
    if (!body) return;
    const state = clinicPrintRecommendationState;
    const followUpAction = state.followUpAction || null;
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    const optionRoot = document.getElementById('clinic-print-recommendation-options');
    const includeSeenOption = document.getElementById('clinic-print-recommendation-include-seen-wrap');
    const sectionTitle = document.querySelector('#clinic-print-recommendation-section .clinic-print-section-title');
    const sectionSoftTitle = document.querySelector('#clinic-print-recommendation-section .clinic-print-section-title--soft');
    if (optionRoot) optionRoot.style.display = followUpAction?.mode === 'same_uid' ? 'none' : '';
    if (includeSeenOption) includeSeenOption.style.display = followUpAction ? 'none' : '';
    if (sectionTitle) sectionTitle.textContent = followUpAction ? '후속 보충 후보' : '유사 문항 추천';
    if (sectionSoftTitle) sectionSoftTitle.textContent = followUpAction
        ? (followUpAction.mode === 'same_uid' ? '같은 UID 재연습' : '다른 유사문항')
        : '학생별 후보';
    const classActive = state.scope !== 'grade';
    const gradeActive = state.scope === 'grade';
    const scopeButtons = followUpAction ? '' : `
        <div style="display:flex;gap:8px;margin:8px 0 10px;">
            <button type="button" class="clinic-print-mini-btn" aria-pressed="${classActive}" style="${classActive ? 'border-color:var(--primary);color:var(--primary);' : ''}" onclick="clinicPrintSetRecommendationScope('${clinicPrintEscapeJsString(classId)}','class')">현재 반</button>
            <button type="button" class="clinic-print-mini-btn" aria-pressed="${gradeActive}" style="${gradeActive ? 'border-color:var(--primary);color:var(--primary);' : ''}" onclick="clinicPrintSetRecommendationScope('${clinicPrintEscapeJsString(classId)}','grade')">같은 학년</button>
        </div>`;
    const scopeLabel = state.scope === 'grade'
        ? '같은 학년 최근 1개월'
        : '현재 반 최근 최대 200개 세션';
    const disabled = mode !== 'student' || state.status === 'loading';
    const buttonText = mode !== 'student'
        ? '학생별 오답 모드에서 이용'
        : state.status === 'loading' ? '추천 기준을 불러오는 중…' : '유사 문항 후보 찾기';
    const optionSettings = clinicPrintReadRecommendationSettings();
    const typeBasisText = followUpAction?.targetScope
        ? `기준시험 ${followUpAction.sourceExamDate || '날짜 미상'} · ${followUpAction.sourceExamTitle || '추천 보충시험'} · ${followUpAction.typeLabel || '선택 유형'} · 누적 관측 오답 ${Number(followUpAction.typeObservedWrongCount || 0)}회 · 기준시험의 이 유형 오답 UID ${Number(followUpAction.targetUidCount || 0)}개`
        : '';
    let message = followUpAction
        ? `${followUpAction.mode === 'same_uid' ? '같은 UID 재연습' : '다른 유사 UID 추천'} · ${clinicPrintEscapeHtml(followUpAction.studentName || followUpAction.studentId)} 학생의 선택 후보입니다. ${typeBasisText ? `${clinicPrintEscapeHtml(typeBasisText)}. ` : ''}수신 학생은 이 학생 한 명으로 유지됩니다.`
        : optionSettings.errors.length
        ? optionSettings.errors.map(error => clinicPrintEscapeHtml(error.message)).join(' ')
        : '조회된 오답 빈도를 기준으로 후보를 찾습니다. 정답률이나 회복률을 뜻하지 않습니다.';
    if (followUpAction && state.status === 'loading') message = `${typeBasisText ? `${clinicPrintEscapeHtml(typeBasisText)} · ` : ''}${followUpAction.mode === 'same_uid' ? '같은 UID 재연습' : '다른 유사 UID 추천'} 후보의 문항 원본과 정본 유형을 확인하고 있습니다.`;
    else if (followUpAction && state.status === 'error') message = `후속 후보를 불러오지 못했습니다: ${clinicPrintEscapeHtml(state.error || '조회 오류')}. ${typeBasisText ? '기준시험과 유형을 다시 선택하세요.' : '결과 행에서 다시 선택하세요.'}`;
    else if (followUpAction && state.status === 'stale') message = `${typeBasisText ? '선택한 기준시험의 최신 결과 또는 유형 근거가 바뀌었습니다.' : '후속 응시 결과의 문항 UID 또는 동결 Meta가 바뀌었습니다.'} 결과를 새로고침한 뒤 다시 선택하세요.`;
    else if (followUpAction && state.status === 'empty') message = `${typeBasisText ? `${clinicPrintEscapeHtml(typeBasisText)} · 선택 범위 오답 UID ${Number(state.result?.coverage?.targetUidCount || 0)}개` : `이번 결과의 후속 대상 UID ${Number(followUpAction.targetUidCount || 0)}개`}에 대한 ${clinicPrintEscapeHtml(followUpAction.mode === 'same_uid' ? '같은 UID' : '다른 유사 UID')} 후보를 확인하지 못했습니다. 기존 결과는 유지됩니다.`;
    else if (followUpAction && state.status === 'ready') message = `${typeBasisText ? `${clinicPrintEscapeHtml(typeBasisText)} · 선택 범위 오답 UID ${Number(state.result?.coverage?.targetUidCount || 0)}개` : `이번 결과의 후속 대상 UID ${Number(state.result?.coverage?.targetUidCount || 0)}개`}를 기준으로 만든 ${clinicPrintEscapeHtml(followUpAction.mode === 'same_uid' ? '같은 UID 재연습' : '다른 유사 UID 추천')} 후보입니다. 항목을 확인하고 체크한 뒤 아래 배정 절차를 사용하세요.`;
    else if (mode !== 'student') message = '학생별 추천 문항을 미리보고 배정하려면 출제 기준에서 학생을 선택하세요.';
    else if (state.status === 'loading') message = `${scopeLabel}의 오답·동결 문항 정보를 확인하고 Archive 2.0 후보를 불러옵니다. 첫 조회에는 준비 시간이 걸릴 수 있습니다.`;
    else if (state.status === 'error') message = `추천을 불러오지 못했습니다: ${clinicPrintEscapeHtml(state.error || '조회 오류')}. 현재 오답 클리닉은 계속 이용할 수 있습니다.`;
    else if (state.status === 'stale') message = '학생, 시험 또는 추천 범위가 바뀌었습니다. 새 조건으로 후보를 다시 찾으세요.';
    else if (state.status === 'empty') {
        const noEvidence = state.result?.status === 'no_canonical_evidence';
        const coverage = state.result?.coverage || {};
        const notes = clinicPrintRecommendationCoverageNotes(coverage);
        const seenPolicyNote = coverage.includeSeenQuestionUids === true ? ' · 이미 푼 문항 포함 (현재 조회 범위에서 확인된 응시 UID 기준)' : '';
        message = `${clinicPrintEscapeHtml(clinicPrintRecommendationCoverageLabel(state.scope, coverage, classId))} · ${noEvidence ? '정본 Meta 경로를 확인한 오답 근거가 없습니다.' : '연결되는 정본 추천 후보가 없습니다.'}${notes.length ? ` · ${clinicPrintEscapeHtml(notes.join(' · '))}` : ''}${seenPolicyNote} 현재 오답 클리닉은 계속 이용할 수 있습니다.`;
    } else if (state.status === 'invalid_options') {
        const errors = Array.isArray(state.result?.errors) ? state.result.errors : [];
        const guidance = [...new Set(errors.map(clinicPrintRecommendationErrorLabel))].join(' ');
        message = clinicPrintEscapeHtml(guidance || '추천 조건을 확인해 주세요.');
    } else if (state.status === 'ready') {
        const coverage = state.result?.coverage || {};
        const notes = clinicPrintRecommendationCoverageNotes(coverage);
        const difficultyLabel = optionSettings.difficultyMode === 'selected'
            ? `난이도 ${optionSettings.selectedDifficultyBuckets.join(', ')}단계`
            : '오답 난이도에 맞춤';
        const seenPolicyNote = coverage.includeSeenQuestionUids === true ? ' · 이미 푼 문항 포함 (현재 조회 범위에서 확인된 응시 UID 기준)' : '';
        message = `${clinicPrintEscapeHtml(clinicPrintRecommendationCoverageLabel(state.scope, coverage, classId))} · 오답 빈도 기반 추천 · ${optionSettings.countPerStudentRaw}개씩 · ${difficultyLabel}${seenPolicyNote}${notes.length ? ` · ${clinicPrintEscapeHtml(notes.join(' · '))}` : ''}.`;
    }
    if (followUpAction) message += ' 후속 후보에는 “이미 푼 문항도 후보에 포함” 설정을 적용하지 않습니다.';

    let candidatesHtml = '';
    if (state.status === 'ready' && Array.isArray(state.result?.candidates)) {
        const students = new Map(clinicPrintGetClassStudents(classId).map(student => [String(student.id), student]));
        const groups = state.result.candidates;
        candidatesHtml = groups.map(group => {
            const studentId = String(group.studentId || '');
            const student = students.get(studentId);
            const items = Array.isArray(group.items) ? group.items : [];
            if (!items.length) return '';
            return `<div style="border-top:1px solid var(--border);padding-top:10px;margin-top:10px;">
                <div style="font-size:12px;font-weight:800;margin-bottom:7px;">${clinicPrintEscapeHtml(student?.name || studentId)}${student?.className ? ` · ${clinicPrintEscapeHtml(student.className)}` : ''}<span style="font-weight:500;color:var(--secondary);"> · ${items.length}/${Number.isInteger(Number(group.requestedCount)) ? Number(group.requestedCount) : items.length}개</span></div>
                ${items.map(item => {
                    const uid = String(item.sourceQuestionUid || '');
                    const key = clinicPrintRecommendationKey(studentId, uid);
                    const checked = state.selectedKeys?.has(key) || state.pendingKeys?.has(key);
                    const pending = state.pendingKeys?.has(key);
                    const source = item.sourceArchiveFile || item.archiveFile || '';
                    const title = clinicPrintGetArchiveDisplayTitle(source) || '아카이브 문항';
                    const questionNo = item.sourceQuestionNo || item.questionNo || '';
                    const path = clinicPrintRecommendationPathLabel(item);
                    const currentCanonicalPath = ['L1', 'L2', 'L3', 'L4'].map(level => String(item.canonicalMeta?.[level] || '').trim()).filter(Boolean).join(' › ');
                    const pathDetails = item.followUpMode === 'same_uid' && path && currentCanonicalPath && path !== currentCanonicalPath
                        ? `이전 응시 유형: ${path} · 현재 원본 유형: ${currentCanonicalPath}` : path;
                    const reason = clinicPrintRecommendationReasonLabel(item);
                    const error = state.validationErrors?.get(key) || '';
                    const followUpLabel = item.followUpMode === 'same_uid'
                        ? `같은 UID · 현재 검증 원본${item.sourceFingerprintRelation === 'fingerprint_changed' ? ' · 이전 내용 지문과 다름' : item.sourceFingerprintRelation === 'fingerprint_match' ? ' · 비교한 내용 지문 일치' : ' · 이전 내용 지문 비교 불가'}`
                        : item.followUpMode === 'similar_uid' ? '이번 오답 UID와 다른 유사 문항' : '';
                    return `<label style="display:flex;gap:9px;align-items:flex-start;border:1px solid var(--border);border-radius:10px;padding:9px;margin:6px 0;">
                        <input type="checkbox" ${checked ? 'checked' : ''} ${pending ? 'disabled' : ''} onchange="clinicPrintToggleRecommendation('${clinicPrintEscapeJsString(classId)}','${clinicPrintEscapeJsString(studentId)}','${clinicPrintEscapeJsString(uid)}',this.checked)">
                        <span style="min-width:0;flex:1;">
                            <span style="display:block;font-size:12px;font-weight:700;">${clinicPrintEscapeHtml(title)}${questionNo ? ` · 원문 ${clinicPrintEscapeHtml(questionNo)}번` : ''}</span>
                            ${pathDetails ? `<span style="display:block;font-size:11px;color:var(--secondary);margin-top:3px;">${clinicPrintEscapeHtml(pathDetails)}${Number.isInteger(Number(item.difficultyBucket)) && Number(item.difficultyBucket) >= 1 && Number(item.difficultyBucket) <= 5 ? ` · 난이도 ${Number(item.difficultyBucket)}/5` : ''}</span>` : ''}
                            ${followUpLabel ? `<span style="display:block;font-size:11px;color:var(--secondary);margin-top:3px;">${clinicPrintEscapeHtml(followUpLabel)}</span>` : ''}
                            <span style="display:block;font-size:11px;color:var(--secondary);margin-top:3px;">${clinicPrintEscapeHtml(pending ? '원본 UID·파일·문항 위치를 확인 중입니다.' : reason)}</span>
                            ${error ? `<span style="display:block;font-size:11px;color:var(--error);margin-top:3px;">원본 확인 실패: ${clinicPrintEscapeHtml(error)}</span>` : ''}
                        </span>
                    </label>`;
                }).join('')}
            </div>`;
        }).join('');
        if (!candidatesHtml) candidatesHtml = '<div class="clinic-print-empty">선택 학생에게 연결된 후보가 없습니다.</div>';
    }

    body.innerHTML = `${scopeButtons}<div class="clinic-print-note" aria-live="polite">${message}</div>
        ${followUpAction ? `<button type="button" class="clinic-print-mini-btn" style="margin-top:8px;" onclick="clinicPrintClearFollowUpRecommendations('${clinicPrintEscapeJsString(classId)}')">후속 후보 닫기</button>` : `<button type="button" class="clinic-print-mini-btn" style="margin-top:8px;" ${disabled ? 'disabled' : ''} onclick="clinicPrintLoadRecommendations('${clinicPrintEscapeJsString(classId)}')">${buttonText}</button>`}
        ${candidatesHtml}`;
}

function clinicPrintSetRecommendationScope(classId, scope) {
    clinicPrintResetRecommendationState(scope, classId);
    clinicPrintRenderRecommendationPanel(classId);
    clinicPrintSchedulePreviewPush(classId);
}

function clinicPrintWithTimeout(promise, timeoutMs, message) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
        Promise.resolve(promise).then(value => {
            clearTimeout(timeoutId);
            resolve(value);
        }, error => {
            clearTimeout(timeoutId);
            reject(error);
        });
    });
}

async function clinicPrintGetRecommendationHistory(classId, scope, studentIds) {
    if (scope === 'grade') {
        let gradeData = clinicPrintGradeData.get(String(classId));
        if (gradeData?.status !== 'ready') {
            const refreshed = await clinicPrintWithTimeout(
                clinicPrintRefreshGradeClinicData(classId),
                45000,
                '학년 기록 조회 시간이 초과되었습니다.'
            );
            if (!refreshed) throw new Error(clinicPrintGetGradeDataMessage(classId));
            gradeData = clinicPrintGradeData.get(String(classId));
        }
        if (gradeData?.status !== 'ready') throw new Error(clinicPrintGetGradeDataMessage(classId));
        return {
            sessions: Array.isArray(gradeData.sessions) ? gradeData.sessions : [],
            resultItems: Array.isArray(gradeData.result_items) ? gradeData.result_items : [],
            assignmentQuestions: Array.isArray(gradeData.assignment_questions) ? gradeData.assignment_questions : [],
            wrongAnswers: Array.isArray(gradeData.wrong_answers) ? gradeData.wrong_answers : [],
            from: gradeData.from,
            to: gradeData.to
        };
    }

    let classData = clinicPrintClassClinicData.get(String(classId));
    if (classData?.status !== 'ready') {
        const refreshed = await clinicPrintWithTimeout(
            clinicPrintRefreshClassAssignments(classId),
            45000,
            '현재 반 기록 조회 시간이 초과되었습니다.'
        );
        if (!refreshed) throw new Error('현재 반 응시 기록을 불러오지 못했습니다.');
        classData = clinicPrintClassClinicData.get(String(classId));
    }
    if (classData?.status !== 'ready') throw new Error('현재 반 응시 기록을 불러오지 못했습니다.');
    const sessions = Array.isArray(classData.sessions) ? classData.sessions : [];
    const sessionIds = new Set(sessions.map(row => String(row.id || '')).filter(Boolean));
    const assignmentIds = new Set(sessions.map(row => String(row.assignment_id || '')).filter(Boolean));
    return {
        sessions,
        resultItems: (classData.result_items || []).filter(row => sessionIds.has(String(row.session_id || ''))),
        assignmentQuestions: (classData.assignment_questions || []).filter(row => assignmentIds.has(String(row.assignment_id || ''))),
        wrongAnswers: (classData.wrong_answers || []).filter(row => sessionIds.has(String(row.session_id || ''))),
        from: '',
        to: ''
    };
}

async function clinicPrintLoadRecommendations(classId) {
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    const selectedStudentIds = clinicPrintGetCheckedValues('clinic-print-student').map(String);
    if (mode !== 'student') {
        toast('학생별 유사문항 추천은 학생 모드에서 이용할 수 있습니다.', 'info');
        return;
    }
    if (!selectedStudentIds.length) {
        toast('추천을 받을 학생을 선택하세요.', 'warn');
        return;
    }

    const settings = clinicPrintReadRecommendationSettings();
    clinicPrintRecommendationSettings = {
        countPerStudent: settings.countPerStudentRaw,
        difficultyMode: settings.difficultyMode,
        selectedDifficultyBuckets: settings.selectedDifficultyBuckets,
        includeSeenQuestionUids: settings.includeSeenQuestionUids === true
    };
    if (!settings.recommendationOptions) {
        clinicPrintResetRecommendationState(clinicPrintRecommendationState.scope || 'class', classId);
        clinicPrintRecommendationState.status = 'invalid_options';
        clinicPrintRecommendationState.result = { status: 'invalid_options', errors: settings.errors };
        clinicPrintRecommendationState.contextKey = clinicPrintGetRecommendationContextKey(classId, clinicPrintRecommendationState.scope);
        clinicPrintRenderRecommendationPanel(classId);
        return;
    }

    const scope = clinicPrintRecommendationState.scope || 'class';
    const contextKey = clinicPrintGetRecommendationContextKey(classId, scope);
    const requestId = Number(clinicPrintRecommendationState.requestId || 0) + 1;
    clinicPrintRecommendationState = {
        scope,
        status: 'loading',
        requestId,
        classId: String(classId || ''),
        contextKey,
        result: null,
        selectedKeys: new Set(),
        pendingKeys: new Set(),
        validationErrors: new Map(),
        verifiedByKey: new Map(),
        error: ''
    };
    clinicPrintRenderRecommendationPanel(classId);
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
        const history = await clinicPrintGetRecommendationHistory(classId, scope, selectedStudentIds);
        if (!clinicPrintIsRecommendationRequestCurrent(classId, requestId, contextKey)) return;

        const candidateCatalog = await clinicPrintWithTimeout(
            clinicPrintLoadArchive2CandidateCatalog(),
            95000,
            'Archive 2.0 후보 목록 조회 시간이 초과되었습니다.'
        );
        if (!clinicPrintIsRecommendationRequestCurrent(classId, requestId, contextKey)) return;

        if (!window.ClinicRecommendations || typeof window.ClinicRecommendations.build !== 'function') {
            throw new Error('클리닉 추천 모듈을 불러오지 못했습니다.');
        }
        const archive2Core = window.Archive2Core;
        const result = window.ClinicRecommendations.build({
            sessions: history.sessions,
            resultItems: history.resultItems,
            assignmentQuestions: history.assignmentQuestions,
            wrongAnswers: history.wrongAnswers,
            studentIds: selectedStudentIds,
            candidateRecords: clinicPrintPrepareArchive2CandidateRecords(candidateCatalog.records),
            archive2Core,
            canonicalAuthority: candidateCatalog.catalog.canonicalAuthority,
            targetGrade: clinicPrintGetClassGrade(classId),
            coverage: {
                scope: scope === 'grade' ? 'grade' : 'class',
                from: history.from || '',
                to: history.to || '',
                limited: true,
                sessionLimit: scope === 'class' ? 200 : null
            },
            asOf: new Date().toISOString(),
            countPerStudent: settings.recommendationOptions.countPerStudent,
            recommendationOptions: settings.recommendationOptions,
            ...(settings.includeSeenQuestionUids === true ? { includeSeenQuestionUids: true } : {})
        });
        if (!clinicPrintIsRecommendationRequestCurrent(classId, requestId, contextKey)) return;

        const hasCandidates = Array.isArray(result?.candidates) && result.candidates.some(group => Array.isArray(group.items) && group.items.length);
        clinicPrintRecommendationState.result = result;
        clinicPrintRecommendationState.status = result?.status === 'invalid_options' ? 'invalid_options' : hasCandidates ? 'ready' : 'empty';
        clinicPrintRenderRecommendationPanel(classId);
    } catch (error) {
        if (!clinicPrintIsRecommendationRequestCurrent(classId, requestId, contextKey)) return;
        clinicPrintRecommendationState.status = 'error';
        clinicPrintRecommendationState.error = String(error?.message || error || '추천 조회 실패');
        clinicPrintRenderRecommendationPanel(classId);
    }
}

function clinicPrintFindRecommendationRecord(candidate, catalog) {
    const uid = String(candidate?.sourceQuestionUid || '').trim();
    const file = clinicPrintNormalizeArchiveFile(candidate?.sourceArchiveFile || candidate?.sourceFile || '');
    const ordinal = Number(candidate?.sourceQuestionOrdinal);
    const rows = (catalog?.records || []).filter(record =>
        String(record.questionUid || '') === uid &&
        clinicPrintNormalizeArchiveFile(record.sourceFile || '') === file &&
        Number(record.sourceOrdinal) === ordinal
    );
    if (rows.length !== 1) throw new Error('후보 UID와 원본 파일·문항 위치가 일치하지 않습니다.');
    const record = rows[0];
    if (record.identityStatus !== 'VERIFIED' || record.sourceIntegrityStatus !== 'VERIFIED' || record.sourceStatus !== 'VERIFIED') {
        throw new Error('후보 원본 identity 또는 무결성을 확인할 수 없습니다.');
    }
    if (candidate.sourceFingerprint && String(candidate.sourceFingerprint) !== String(record.sourceFingerprint || '')) {
        throw new Error('후보 원본 fingerprint가 현재 Archive 2.0 목록과 다릅니다.');
    }
    if (candidate.sourceQuestionNo != null && String(candidate.sourceQuestionNo) !== String(record.sourceQuestionNo ?? '')) {
        throw new Error('후보의 원문 번호가 현재 Archive 2.0 목록과 다릅니다.');
    }
    return record;
}

async function clinicPrintEnsureArchive2Source() {
    await clinicPrintLoadArchive2Script('problem-bank-meta', '../archive/problem-bank-meta.js?v=20261011-rpm-debt-projection1', 'ProblemBankMeta');
    await clinicPrintLoadArchive2Script('archive2-source', '../archive/archive2-source.js?v=20261016-clinic-source-base-1', 'Archive2Source');
    if (typeof window.Archive2Source?.restore !== 'function') throw new Error('Archive 2.0 원본 검증기를 불러오지 못했습니다.');
}

async function clinicPrintRestoreRecommendationSources(records, catalog, timeoutMs, timeoutMessage) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await clinicPrintWithTimeout(
            window.Archive2Source.restore(records, catalog, {
                baseUrl: clinicPrintGetArchiveBaseUrl(),
                requireSourceHash: true,
                fetcher: url => fetch(url, { signal: controller.signal })
            }),
            timeoutMs,
            timeoutMessage
        );
    } catch (error) {
        if (controller.signal.aborted) throw new Error(timeoutMessage);
        throw error;
    } finally {
        clearTimeout(timeoutId);
        controller.abort();
    }
}

async function clinicPrintValidateRecommendationItem(candidate, catalog) {
    const record = clinicPrintFindRecommendationRecord(candidate, catalog);
    await clinicPrintEnsureArchive2Source();
    const restored = await clinicPrintRestoreRecommendationSources(
        [record], catalog.catalog,
        45000,
        '추천 문항 원본 확인 시간이 초과되었습니다.'
    );
    if (!Array.isArray(restored) || restored.length !== 1) throw new Error('추천 문항 원본 확인이 완료되지 않았습니다.');
    return { record, question: restored[0], status: 'VERIFIED' };
}

function clinicPrintMarkRecommendationVerified(candidate, verification) {
    const record = verification?.record || {};
    const restoredQuestion = verification?.question || {};
    const legacyDifficulty = {};
    ['level', 'difficulty', 'difficulty_bucket'].forEach(field => {
        if (Object.prototype.hasOwnProperty.call(restoredQuestion, field) && restoredQuestion[field] != null) {
            legacyDifficulty[field] = restoredQuestion[field];
        }
    });
    candidate.archiveFile = record.sourceFile || candidate.archiveFile || '';
    candidate.sourceArchiveFile = record.sourceFile || candidate.sourceArchiveFile || '';
    candidate.sourceQuestionUid = record.questionUid || candidate.sourceQuestionUid || '';
    candidate.sourceQuestionOrdinal = Number(record.sourceOrdinal || candidate.sourceQuestionOrdinal || 0);
    candidate.sourceQuestionNo = record.sourceQuestionNo ?? candidate.sourceQuestionNo ?? null;
    candidate.questionNo = candidate.sourceQuestionNo;
    candidate.sourceIdentityStatus = record.identityStatus || 'VERIFIED';
    candidate.sourceIntegrityStatus = record.sourceIntegrityStatus || '';
    candidate.sourceStatus = record.sourceStatus || '';
    candidate.sourceFingerprint = record.sourceFingerprint || candidate.sourceFingerprint || '';
    candidate.currentSourceJsSha256 = record.currentSourceJsSha256 || '';
    candidate.canonicalProjectionVersion = record.canonicalProjectionVersion || '';
    candidate.sourceContentVerificationStatus = 'VERIFIED';
    candidate.sourceOriginRefs = [];
    candidate.legacyDifficulty = legacyDifficulty;
    candidate.sourceVerification = {
        status: 'VERIFIED',
        sourceArchiveFile: candidate.sourceArchiveFile,
        sourceQuestionUid: candidate.sourceQuestionUid,
        sourceQuestionOrdinal: candidate.sourceQuestionOrdinal,
        sourceQuestionNo: candidate.sourceQuestionNo,
        sourceFingerprint: candidate.sourceFingerprint,
        currentSourceJsSha256: candidate.currentSourceJsSha256,
        canonicalProjectionVersion: candidate.canonicalProjectionVersion
    };
    try {
        const metadata = typeof candidate.metadataJson === 'string'
            ? JSON.parse(candidate.metadataJson)
            : (candidate.metadataJson && typeof candidate.metadataJson === 'object' ? { ...candidate.metadataJson } : {});
        metadata.sourceContentVerificationStatus = 'VERIFIED';
        metadata.currentSourceJsSha256 = candidate.currentSourceJsSha256 || null;
        metadata.sourceProjectionVersion = candidate.canonicalProjectionVersion || null;
        metadata.legacyDifficulty = legacyDifficulty;
        metadata.sourceIdentity = {
            ...(metadata.sourceIdentity || {}),
            status: 'VERIFIED',
            sourceArchiveFile: candidate.sourceArchiveFile,
            normalizedSourceFile: candidate.sourceArchiveFile,
            sourceQuestionUid: candidate.sourceQuestionUid,
            sourceQuestionOrdinal: candidate.sourceQuestionOrdinal,
            sourceQuestionNo: candidate.sourceQuestionNo,
            sourceFingerprint: candidate.sourceFingerprint,
            currentSourceJsSha256: candidate.currentSourceJsSha256 || null
        };
        candidate.metadataJson = JSON.stringify(metadata);
    } catch (error) {
        throw new Error('추천 후보 Meta 근거를 저장할 수 없습니다.');
    }
}

async function clinicPrintToggleRecommendation(classId, studentId, questionUid, checked) {
    const state = clinicPrintRecommendationState;
    if (state.status !== 'ready' || !state.result || state.classId !== String(classId || '')) return;
    const key = clinicPrintRecommendationKey(studentId, questionUid);
    if (!checked) {
        state.pendingKeys?.delete(key);
        state.selectedKeys?.delete(key);
        state.verifiedByKey?.delete(key);
        state.validationErrors?.delete(key);
        clinicPrintRenderRecommendationPanel(classId);
        clinicPrintSchedulePreviewPush(classId);
        return;
    }

    const group = (state.result.candidates || []).find(row => String(row.studentId || '') === String(studentId || ''));
    const candidate = (group?.items || []).find(item => String(item.sourceQuestionUid || '') === String(questionUid || ''));
    if (!candidate) return;
    const contextKey = state.contextKey;
    state.pendingKeys.add(key);
    state.validationErrors.delete(key);
    clinicPrintRenderRecommendationPanel(classId);
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
        const catalog = await clinicPrintWithTimeout(
            clinicPrintLoadArchive2CandidateCatalog(),
            95000,
            'Archive 2.0 후보 목록 조회 시간이 초과되었습니다.'
        );
        if (clinicPrintRecommendationState !== state || !state.pendingKeys.has(key) ||
            !clinicPrintIsRecommendationRequestCurrent(classId, state.requestId, contextKey)) return;
        const verification = await clinicPrintValidateRecommendationItem(candidate, catalog);
        if (clinicPrintRecommendationState !== state || !state.pendingKeys.has(key) ||
            !clinicPrintIsRecommendationRequestCurrent(classId, state.requestId, contextKey)) return;
        clinicPrintMarkRecommendationVerified(candidate, verification);
        state.verifiedByKey.set(key, verification);
        state.selectedKeys.add(key);
    } catch (error) {
        if (clinicPrintRecommendationState === state && state.pendingKeys.has(key) &&
            clinicPrintIsRecommendationRequestCurrent(classId, state.requestId, contextKey)) {
            state.validationErrors.set(key, String(error?.message || error || '원본 확인 실패'));
        }
    } finally {
        if (clinicPrintRecommendationState === state && state.pendingKeys.has(key)) {
            state.pendingKeys.delete(key);
            clinicPrintRenderRecommendationPanel(classId);
            clinicPrintSchedulePreviewPush(classId);
        }
    }
}

function clinicPrintGetSelectedRecommendationItems(studentId) {
    const state = clinicPrintRecommendationState;
    if (state.status !== 'ready' || !state.result || !state.contextKey ||
        clinicPrintGetRecommendationContextKey(state.classId, state.scope) !== state.contextKey) return [];
    const group = (state.result.candidates || []).find(row => String(row.studentId || '') === String(studentId || ''));
    return (group?.items || []).filter(item => state.selectedKeys.has(
        clinicPrintRecommendationKey(studentId, item.sourceQuestionUid)
    ));
}

function clinicPrintBuildRecommendationPrintItem(studentId, candidate) {
    const key = clinicPrintRecommendationKey(studentId, candidate?.sourceQuestionUid);
    const verification = clinicPrintRecommendationState.verifiedByKey?.get(key);
    const record = verification?.record;
    if (verification?.status !== 'VERIFIED' || !record) return null;
    const sourceFile = clinicPrintNormalizeArchiveFile(record.sourceFile || candidate.sourceArchiveFile || '');
    const sourceQuestionNo = record.sourceQuestionNo ?? candidate.sourceQuestionNo ?? null;
    const sourceOrdinal = Number(record.sourceOrdinal || candidate.sourceQuestionOrdinal || 0);
    const sourceUid = String(record.questionUid || candidate.sourceQuestionUid || '');
    if (!sourceFile || !sourceOrdinal || !sourceUid || sourceQuestionNo == null) return null;
    const canonicalMetaFields = Array.isArray(candidate.canonicalMetaFields)
        ? candidate.canonicalMetaFields
        : [...new Set([...(window.Archive2Core?.META_FIELDS || []), ...(window.Archive2Core?.OPTIONAL_METADATA_FIELDS || [])])];
    const title = clinicPrintGetArchiveDisplayTitle(sourceFile) || 'Archive 2.0 문항';
    return {
        examKey: `recommendation|${sourceUid}`,
        examTitle: candidate.followUpMode === 'same_uid' ? `같은 UID 재연습 · ${title}`
            : candidate.followUpMode === 'similar_uid' ? `다른 유사문항 · ${title}` : `유사 추천 · ${title}`,
        examDate: '',
        archiveFile: sourceFile,
        questionNo: sourceQuestionNo,
        displayArchiveFile: sourceFile,
        displayQuestionNo: sourceQuestionNo,
        sourceArchiveFile: sourceFile,
        sourceQuestionNo,
        sourceQuestionOrdinal: sourceOrdinal,
        sourceQuestionUid: sourceUid,
        sourceIdentityStatus: 'VERIFIED',
        sourceIntegrityStatus: record.sourceIntegrityStatus,
        sourceStatus: record.sourceStatus,
        sourceFingerprint: record.sourceFingerprint,
        sourceContentVerificationStatus: 'VERIFIED',
        currentSourceJsSha256: record.currentSourceJsSha256 || '',
        canonicalProjectionVersion: record.canonicalProjectionVersion || '',
        sourceVerification: candidate.sourceVerification || {
            status: 'VERIFIED',
            sourceArchiveFile: sourceFile,
            sourceQuestionUid: sourceUid,
            sourceQuestionOrdinal: sourceOrdinal,
            sourceQuestionNo,
            sourceFingerprint: record.sourceFingerprint,
            currentSourceJsSha256: record.currentSourceJsSha256 || '',
            canonicalProjectionVersion: record.canonicalProjectionVersion || ''
        },
        metadataJson: candidate.metadataJson || null,
        metadataRevision: candidate.metadataRevision || record.metadataRevision || null,
        metadataHash: candidate.metadataHash || null,
        metadataContentHash: candidate.metadataContentHash || null,
        metadataSnapshotStatus: candidate.metadataSnapshotStatus || 'CAPTURED',
        sourceOriginRefs: [],
        recommendationReason: candidate.recommendationReason || {},
        canonicalMeta: candidate.canonicalMeta || {},
        canonicalMetaFields,
        legacyDifficulty: candidate.legacyDifficulty || {},
        difficultyBucket: candidate.difficultyBucket ?? null,
        wrongCount: 0,
        totalCount: 0,
        correctRate: null,
        wrongStudents: []
    };
}

function clinicPrintApplySelectedRecommendations(payload, classId) {
    if (!payload || payload.mode !== 'student' ||
        clinicPrintRecommendationState.status !== 'ready' ||
        clinicPrintGetRecommendationContextKey(classId, clinicPrintRecommendationState.scope) !== clinicPrintRecommendationState.contextKey) return payload;
    let addedCount = 0;
    const addedByStudent = {};
    (payload.students || []).forEach(student => {
        const studentId = String(student.studentId || '');
        const existing = new Set((student.wrongItems || []).map(item => String(item.sourceQuestionUid || '')).filter(Boolean));
        const additions = clinicPrintGetSelectedRecommendationItems(studentId)
            .filter(item => !existing.has(String(item.sourceQuestionUid || '')))
            .map(item => clinicPrintBuildRecommendationPrintItem(studentId, item))
            .filter(Boolean);
        if (!additions.length) return;
        student.wrongItems = [...(student.wrongItems || []), ...additions];
        student.recommendedItemCount = additions.length;
        addedCount += additions.length;
        addedByStudent[studentId] = additions.length;
    });
    if (addedCount) {
        const result = clinicPrintRecommendationState.result || {};
        payload.recommendationInfo = {
            source: 'archive2_canonical_catalog_verified_candidates',
            scope: clinicPrintRecommendationState.scope,
            coverage: result.coverage || {},
            candidateCatalogVersion: clinicPrintArchive2CatalogCache?.version || '',
            selectedCount: addedCount,
            selectedByStudent: addedByStudent,
            selectionConfirmed: false
        };
    }
    return payload;
}

async function clinicPrintValidateSelectedRecommendations(classId) {
    const state = clinicPrintRecommendationState;
    const selectedIds = clinicPrintGetCheckedValues('clinic-print-student').map(String).sort();
    const selected = selectedIds.flatMap(studentId => clinicPrintGetSelectedRecommendationItems(studentId)
        .map(item => ({ studentId, item, key: clinicPrintRecommendationKey(studentId, item.sourceQuestionUid) })));
    if (!selected.length) return true;
    const contextKey = state.contextKey;
    const selectedKeys = selected.map(row => row.key).sort();
    const isStillSameSelection = () => clinicPrintRecommendationState === state &&
        clinicPrintRecommendationState.status === 'ready' &&
        clinicPrintGetRecommendationContextKey(classId, state.scope) === contextKey &&
        JSON.stringify(clinicPrintGetCheckedValues('clinic-print-student').map(String).sort()) === JSON.stringify(selectedIds) &&
        JSON.stringify(selectedIds.flatMap(studentId => clinicPrintGetSelectedRecommendationItems(studentId)
            .map(item => clinicPrintRecommendationKey(studentId, item.sourceQuestionUid))).sort()) === JSON.stringify(selectedKeys);
    if (!isStillSameSelection()) {
        clinicPrintInvalidateRecommendations(classId);
        toast('추천 조건이 바뀌어 선택을 지웠습니다. 후보를 다시 불러오세요.', 'warn');
        return false;
    }

    try {
        const catalog = await clinicPrintWithTimeout(
            clinicPrintLoadArchive2CandidateCatalog(),
            95000,
            'Archive 2.0 후보 목록 조회 시간이 초과되었습니다.'
        );
        await clinicPrintEnsureArchive2Source();
        const records = selected.map(row => clinicPrintFindRecommendationRecord(row.item, catalog));
        const restored = await clinicPrintRestoreRecommendationSources(
            records, catalog.catalog,
            90000,
            '선택 추천 문항의 원본 확인 시간이 초과되었습니다.'
        );
        if (!Array.isArray(restored) || restored.length !== selected.length) throw new Error('선택 추천 문항 원본 확인이 완료되지 않았습니다.');
        if (!isStillSameSelection()) {
            clinicPrintInvalidateRecommendations(classId);
            toast('검증 중 수신 학생이나 추천 선택이 바뀌었습니다. 후보를 다시 불러오세요.', 'warn');
            return false;
        }
        selected.forEach((row, index) => {
            const verification = { record: records[index], question: restored[index], status: 'VERIFIED' };
            clinicPrintMarkRecommendationVerified(row.item, verification);
            state.verifiedByKey.set(row.key, verification);
        });
        return true;
    } catch (error) {
        if (clinicPrintRecommendationState === state && isStillSameSelection()) {
            selected.forEach(row => {
                state.selectedKeys.delete(row.key);
                state.verifiedByKey.delete(row.key);
                state.validationErrors.set(row.key, String(error?.message || error || '원본 확인 실패'));
            });
            clinicPrintRenderRecommendationPanel(classId);
        }
        toast(`추천 문항 원본 확인 실패: ${String(error?.message || error || '오류')}`, 'warn');
        return false;
    }
}

async function clinicPrintRetryGradeData(classId) {
    const pending = clinicPrintRefreshGradeClinicData(classId);
    clinicPrintUpdateExamList(classId);
    if (document.querySelector('input[name="clinic-print-mode"]:checked')?.value === 'type') clinicPrintRenderTypePanel(classId);
    clinicPrintUpdateStudentList(classId);
    await pending;
    clinicPrintUpdateExamList(classId);
    if (document.querySelector('input[name="clinic-print-mode"]:checked')?.value === 'type') clinicPrintRenderTypePanel(classId);
    clinicPrintUpdateStudentList(classId);
}

function clinicPrintEscapeHtml(value) {
    if (typeof apEscapeHtml === 'function') return apEscapeHtml(value);
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[ch]));
}

function clinicPrintEscapeAttr(value) {
    return clinicPrintEscapeHtml(value).replace(/`/g, '&#96;');
}

function clinicPrintEscapeJsString(value) {
    return String(value ?? '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, '\\x27')
        .replace(/"/g, '\\x22')
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n')
        .replace(/</g, '\\x3C')
        .replace(/>/g, '\\x3E')
        .replace(/&/g, '\\x26')
        .replace(/`/g, '\\x60');
}

function clinicPrintClampText(value, maxLength) {
    return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function clinicPrintGetTypeLabel(typeMode) {
    if (typeMode === 'unit') return '단원별 오답';
    if (typeMode === 'mostWrong') return '최다오답';
    return '최다빈출 오답';
}

function clinicPrintGetHeaderDefaultTitle(classId) {
    const cls = clinicPrintGetClass(classId);
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    const className = cls?.name || '반';
    const gradeName = String(cls?.grade || '').trim() || '학년';
    if (mode === 'class') return `${className} 반별 공통 오답지`;
    if (mode === 'grade') return `${gradeName} 공통 오답지`;
    if (mode === 'type') {
        const scope = document.getElementById('clinic-print-type-scope')?.value || 'class';
        const typeMode = document.getElementById('clinic-print-type-mode')?.value || 'frequent';
        return `${scope === 'grade' ? gradeName : className} ${clinicPrintGetTypeLabel(typeMode)}`;
    }
    return `${className} 학생별 오답 클리닉`;
}

function clinicPrintSetHeaderTitleDirty(dirty = true) {
    const input = document.getElementById('clinic-print-header-title-dirty');
    if (input) input.value = dirty ? '1' : '0';
}

function clinicPrintRefreshHeaderDefault(classId) {
    const titleInput = document.getElementById('clinic-print-header-title');
    const dirty = document.getElementById('clinic-print-header-title-dirty')?.value === '1';
    if (titleInput && !dirty) titleInput.value = clinicPrintGetHeaderDefaultTitle(classId);
}

function clinicPrintGetHeaderOptions(classId) {
    const titleDefault = clinicPrintGetHeaderDefaultTitle(classId);
    const title = clinicPrintClampText(document.getElementById('clinic-print-header-title')?.value || titleDefault, 80) || titleDefault;
    return {
        title,
        metaRight: '',
        subtitle: clinicPrintClampText(document.getElementById('clinic-print-header-subtitle')?.value || '', 120),
        showNameLine: document.getElementById('clinic-print-header-name')?.checked !== false,
        showScoreLine: document.getElementById('clinic-print-header-score')?.checked !== false,
        showDate: document.getElementById('clinic-print-header-date')?.checked === true,
        applyToSolution: document.getElementById('clinic-print-header-sol')?.checked !== false,
        applyToAnswer: document.getElementById('clinic-print-header-ans')?.checked !== false
    };
}

function clinicPrintNormalizeArchiveFile(file) {
    const raw = String(file || '').trim();
    if (!raw) return '';
    if (/^MIXED:/i.test(raw)) return raw;
    if (/^https?:\/\//i.test(raw)) return raw;
    let path = raw.replace(/^archive\//, '').replace(/^\.\//, '').replace(/^\//, '');
    if (!path.endsWith('.js')) path += '.js';
    if (!/^(exams|assets|data)\//.test(path)) path = `exams/${path}`;
    return path;
}

function clinicPrintGetArchiveDisplayTitle(file) {
    const raw = String(file || '').trim();
    if (!raw) return '';
    const compact = raw.replace(/^MIXED:/i, '');
    const leaf = compact.split(/[\\/]/).pop() || compact;
    return leaf
        .replace(/\.js(?:\?.*)?$/i, '')
        .replace(/^exams\//i, '')
        .replace(/^archive\//i, '')
        .trim();
}

function clinicPrintGetExamGroupDisplayTitle(group = {}) {
    const archiveTitle = clinicPrintGetArchiveDisplayTitle(group.archiveFile || group.archive_file || '');
    if (archiveTitle) return archiveTitle;
    return `${group.examDate || group.exam_date || ''} ${group.examTitle || group.exam_title || '시험명 없음'}`.trim();
}

function clinicPrintMakeExamKey(examDate, examTitle, archiveFile, questionCount) {
    return [
        String(examDate || ''),
        String(examTitle || ''),
        clinicPrintNormalizeArchiveFile(archiveFile || ''),
        String(questionCount || 0)
    ].join('|');
}

function clinicPrintParseExamKey(key) {
    const parts = String(key || '').split('|');
    return {
        examDate: parts[0] || '',
        examTitle: parts[1] || '',
        archiveFile: parts[2] || '',
        questionCount: Number(parts[3] || 0)
    };
}

function clinicPrintGetClass(classId) {
    return (state.db.classes || []).find(c => String(c.id) === String(classId)) || null;
}

function clinicPrintGetActiveClasses() {
    return (state.db.classes || [])
        .filter(cls => Number(cls.is_active ?? 1) !== 0)
        .sort((a, b) =>
            String(a.grade || '').localeCompare(String(b.grade || ''), 'ko') ||
            String(a.name || '').localeCompare(String(b.name || ''), 'ko')
        );
}

function clinicPrintGetClassStudents(classId) {
    if (typeof apmsGetStudentsForClass === 'function') {
        return apmsGetStudentsForClass(classId)
            .filter(student => String(student.status || '재원') === '재원')
            .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
    }

    const ids = new Set((state.db.class_students || [])
        .filter(row => String(row.class_id) === String(classId))
        .map(row => String(row.student_id)));

    return (state.db.students || [])
        .filter(student => ids.has(String(student.id)) && String(student.status || '재원') === '재원')
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
}

function clinicPrintGetClassGrade(classId) {
    return String(clinicPrintGetClass(classId)?.grade || '').trim();
}

function clinicPrintGetGradeClasses(classId) {
    if (clinicPrintGradeDataUnavailable(classId)) return [];
    const grade = clinicPrintGetClassGrade(classId);
    if (!grade) return [];
    const classes = clinicPrintGradeData.get(String(classId))?.classes || clinicPrintGetActiveClasses();
    return classes.filter(cls => Number(cls.is_active ?? 1) !== 0 &&
        String(cls.grade || '').replace(/\s+/g, '') === grade.replace(/\s+/g, ''));
}

function clinicPrintGetGradeStudents(classId) {
    const classes = clinicPrintGetGradeClasses(classId);
    const byStudent = new Map();
    const loaded = clinicPrintGradeData.get(String(classId));
    const loadedStudents = loaded?.status === 'ready'
        ? new Map(loaded.students.map(student => [String(student.id), student])) : null;

    classes.forEach(cls => {
        const students = loadedStudents
            ? loaded.class_students.filter(row => String(row.class_id) === String(cls.id))
                .map(row => loadedStudents.get(String(row.student_id))).filter(Boolean)
            : clinicPrintGetClassStudents(cls.id);
        students.forEach(student => {
            if (!['재원', 'active'].includes(String(student.status || '재원'))) return;
            const studentId = String(student.id || '');
            if (!studentId || byStudent.has(studentId)) return;
            byStudent.set(studentId, {
                ...student,
                classId: cls.id,
                className: cls.name || '',
                teacherName: cls.teacher_name || ''
            });
        });
    });

    return [...byStudent.values()]
        .sort((a, b) =>
            String(a.className || '').localeCompare(String(b.className || ''), 'ko') ||
            String(a.name || '').localeCompare(String(b.name || ''), 'ko')
        );
}

function clinicPrintGetSessionArchiveFile(session) {
    return clinicPrintNormalizeArchiveFile(session?.archive_file || '');
}

function clinicPrintIsOnOrAfterFromDate(value) {
    const date = String(value || '').slice(0, 10);
    if (!date) return true;
    return date >= AP_CLINIC_PRINT_ASSIGNMENT_FROM_DATE;
}

function clinicPrintMergeClassAssignments(rows) {
    if (!Array.isArray(rows) || !rows.length) return;
    if (!state.db) state.db = {};
    const current = Array.isArray(state.db.class_exam_assignments) ? state.db.class_exam_assignments : [];
    const byKey = new Map(current.map(row => [
        String(row.id || `${row.class_id}|${row.exam_date}|${row.exam_title}|${row.archive_file || ''}`),
        row
    ]));
    rows.forEach(row => {
        const key = String(row.id || `${row.class_id}|${row.exam_date}|${row.exam_title}|${row.archive_file || ''}`);
        byKey.set(key, row);
    });
    state.db.class_exam_assignments = [...byKey.values()];
}

function clinicPrintReplaceClassAssignments(classId, rows) {
    if (!state.db) state.db = {};
    const incoming = Array.isArray(rows) ? rows : [];
    const keep = (state.db.class_exam_assignments || state.db.exam_assignments || [])
        .filter(row => String(row.class_id || '') !== String(classId || ''));
    state.db.class_exam_assignments = [...keep, ...incoming];
}

function clinicPrintMergeClassAssignmentExclusions(rows) {
    if (!Array.isArray(rows)) return;
    if (!state.db) state.db = {};
    const current = Array.isArray(state.db.class_exam_assignment_exclusions) ? state.db.class_exam_assignment_exclusions : [];
    const byKey = new Map(current.map(row => [
        `${row.assignment_id || ''}|${row.student_id || ''}`,
        row
    ]));
    rows.forEach(row => {
        const assignmentId = String(row.assignment_id || '').trim();
        const studentId = String(row.student_id || '').trim();
        if (!assignmentId || !studentId) return;
        byKey.set(`${assignmentId}|${studentId}`, row);
    });
    state.db.class_exam_assignment_exclusions = [...byKey.values()];
}

function clinicPrintReplaceClassAssignmentExclusions(rows) {
    if (!Array.isArray(rows)) return;
    if (!state.db) state.db = {};
    const assignmentIds = new Set(rows.map(row => String(row.assignment_id || '').trim()).filter(Boolean));
    const keep = (state.db.class_exam_assignment_exclusions || [])
        .filter(row => !assignmentIds.has(String(row.assignment_id || '').trim()));
    state.db.class_exam_assignment_exclusions = [...keep, ...rows];
}

function clinicPrintMergeDbRows(tableName, rows) {
    if (!Array.isArray(rows) || !rows.length) return;
    if (!state.db) state.db = {};
    const getKey = row => {
        if (row?.id) return String(row.id);
        if (tableName === 'class_students') return `${row.class_id || ''}|${row.student_id || ''}`;
        if (tableName === 'wrong_answers') return `${row.session_id || ''}|${row.student_id || ''}|${row.question_id || ''}`;
        if (tableName === 'exam_blueprints') return `${row.archive_file || ''}|${row.question_no || ''}`;
        if (tableName === 'assessment_result_items') return `${row.session_id || ''}|${row.order_no || row.question_no || ''}`;
        if (tableName === 'class_exam_assignment_questions') return `${row.assignment_id || ''}|${row.order_no || ''}`;
        return `${row.session_id || ''}|${row.student_id || ''}|${row.question_id || ''}`;
    };
    const current = Array.isArray(state.db[tableName]) ? state.db[tableName] : [];
    const byKey = new Map(current.map(row => [
        getKey(row),
        row
    ]));
    rows.forEach(row => {
        const key = getKey(row);
        if (!key.replace(/\|/g, '').trim()) return;
        byKey.set(key, row);
    });
    state.db[tableName] = [...byKey.values()];
}

function clinicPrintReplaceSessionIdentityRows(tableName, sessionIds, rows) {
    if (!state.db) state.db = {};
    const ids = new Set(Array.from(sessionIds || []).map(value => String(value || '')).filter(Boolean));
    const current = Array.isArray(state.db[tableName]) ? state.db[tableName] : [];
    const keyFor = row => String(tableName === 'exam_sessions' ? row.id || '' : row.session_id || '');
    const keep = current.filter(row => !ids.has(keyFor(row)));
    state.db[tableName] = [...keep, ...(Array.isArray(rows) ? rows : []).filter(row => ids.has(keyFor(row)))];
}

function clinicPrintReplaceAssignmentQuestionRows(assignmentIds, rows) {
    if (!state.db) state.db = {};
    const ids = new Set(Array.from(assignmentIds || []).map(value => String(value || '')).filter(Boolean));
    const current = Array.isArray(state.db.class_exam_assignment_questions) ? state.db.class_exam_assignment_questions : [];
    const keep = current.filter(row => !ids.has(String(row.assignment_id || '')));
    state.db.class_exam_assignment_questions = [...keep, ...(Array.isArray(rows) ? rows : []).filter(row => ids.has(String(row.assignment_id || '')))];
}

async function clinicPrintRefreshClassAssignments(classId) {
    const key = String(classId || '');
    if (!classId || typeof api === 'undefined' || typeof api.get !== 'function') {
        clinicPrintClassClinicData.set(key, { status: 'error' });
        return false;
    }
    clinicPrintClassClinicData.set(key, { status: 'loading' });
    try {
        const res = await api.get(`exam-sessions/by-class?class=${encodeURIComponent(classId)}`);
        if (!res || res.success !== true || res.error) throw new Error(res?.error || '반 시험 기록 조회를 확인할 수 없습니다.');
        const incomingSessions = Array.isArray(res.sessions) ? res.sessions : [];
        const incomingAssignments = Array.isArray(res.assignments) ? res.assignments : [];
        const sessionIds = new Set(incomingSessions.map(row => String(row.id || '')).filter(Boolean));
        const assignmentIds = new Set(incomingSessions.map(row => String(row.assignment_id || '')).filter(Boolean));
        const allowedSessionIds = sessionIds;
        const wrongAnswers = (Array.isArray(res.wrong_answers) ? res.wrong_answers : []).filter(row => allowedSessionIds.has(String(row.session_id || '')));
        clinicPrintReplaceClassAssignments(classId, incomingAssignments);
        clinicPrintReplaceClassAssignmentExclusions(res.exclusions || []);
        clinicPrintReplaceSessionIdentityRows('exam_sessions', sessionIds, incomingSessions);
        clinicPrintReplaceSessionIdentityRows('wrong_answers', sessionIds, wrongAnswers);
        if (Array.isArray(res.result_items)) clinicPrintReplaceSessionIdentityRows('assessment_result_items', sessionIds, res.result_items);
        if (Array.isArray(res.assignment_questions)) clinicPrintReplaceAssignmentQuestionRows(assignmentIds, res.assignment_questions);
        clinicPrintMergeDbRows('exam_blueprints', res.blueprints || []);
        clinicPrintClassClinicData.set(key, {
            status: 'ready',
            assignments: incomingAssignments,
            sessions: incomingSessions,
            result_items: Array.isArray(res.result_items) ? res.result_items : [],
            assignment_questions: Array.isArray(res.assignment_questions) ? res.assignment_questions : [],
            wrong_answers: wrongAnswers
        });
        return true;
    } catch (e) {
        clinicPrintClassClinicData.set(key, { status: 'error', error: String(e?.message || e) });
        console.warn('[clinic-print] class exam assignment refresh failed:', e);
        return false;
    }
}

async function clinicPrintRefreshGradeClinicData(classId) {
    const grade = clinicPrintGetClassGrade(classId);
    const key = String(classId);
    if (!grade || typeof api === 'undefined' || typeof api.get !== 'function') {
        clinicPrintGradeData.set(key, { status: 'error' });
        return false;
    }
    clinicPrintGradeData.delete(key);
    const range = clinicPrintGetGradeWindow(classId);
    clinicPrintGradeData.set(key, { status: 'loading', ...range });
    try {
        const params = new URLSearchParams({
            class: String(classId || ''),
            grade,
            ...range
        });
        const res = await api.get(`exam-sessions/by-grade?${params.toString()}`);
        const tables = ['classes', 'class_students', 'students', 'assignments', 'sessions', 'wrong_answers', 'blueprints', 'exclusions'];
        if (!res || res.success !== true || res.error || !tables.every(name => Array.isArray(res[name]))) {
            throw new Error(res?.error || res?.message || '학년 전체 조회 응답을 확인할 수 없습니다.');
        }
        clinicPrintMergeDbRows('classes', res.classes || []);
        clinicPrintMergeDbRows('class_students', res.class_students || []);
        clinicPrintMergeDbRows('students', res.students || []);
        clinicPrintMergeClassAssignments(res.assignments || []);
        clinicPrintMergeDbRows('exam_sessions', res.sessions || []);
        clinicPrintMergeDbRows('wrong_answers', res.wrong_answers || []);
        clinicPrintMergeDbRows('exam_blueprints', res.blueprints || []);
        clinicPrintMergeDbRows('assessment_result_items', res.result_items || []);
        clinicPrintMergeDbRows('class_exam_assignment_questions', res.assignment_questions || []);
        clinicPrintMergeClassAssignmentExclusions(res.exclusions || []);
        clinicPrintGradeData.set(key, { ...res, ...range, status: 'ready' });
        return true;
    } catch (e) {
        clinicPrintGradeData.set(key, { ...range, status: 'error', error: String(e?.message || e) });
        console.warn('[clinic-print] grade clinic data refresh failed:', e);
        return false;
    }
}

async function clinicPrintDeleteExamGroup(classId, examKey) {
    const groups = clinicPrintGetClassExamGroups(classId);
    const group = groups.find(row => String(row.examKey || '') === String(examKey || ''));
    if (!group) {
        toast('삭제할 시험을 찾을 수 없습니다.', 'warn');
        return;
    }

    const label = clinicPrintGetExamGroupDisplayTitle(group);
    const submittedCount = Number(group.sessions?.length || 0);
    const detail = submittedCount
        ? `제출 ${submittedCount}명, 오답 ${Number(group.wrongCount || 0)}문항 기록도 함께 삭제됩니다.`
        : '제출 기록이 없어서 출제 기록만 삭제됩니다.';
    if (!confirm(`${label}\n이 시험을 삭제할까요?\n${detail}`)) return;

    try {
        const archiveQuery = group.archiveFile ? `&archive=${encodeURIComponent(group.archiveFile)}` : '';
        const assignmentQuery = group.assignment?.id ? `&assignment=${encodeURIComponent(group.assignment.id)}` : '';
        const url = `${CONFIG.API_BASE}/exam-sessions/by-exam?class=${encodeURIComponent(classId)}&exam=${encodeURIComponent(group.examTitle || '')}&date=${encodeURIComponent(group.examDate || '')}${archiveQuery}${assignmentQuery}`;
        const res = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
        if (res.status === 401 && typeof handleUnauthorizedResponse === 'function') {
            handleUnauthorizedResponse();
            return;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
            toast(data.message || data.error || '시험 삭제에 실패했습니다.', 'warn');
            return;
        }
        toast('시험 기록을 삭제했습니다.', 'info');
        if (typeof refreshDataOnly === 'function') await refreshDataOnly();
        await openClinicPrintCenter(classId);
    } catch (e) {
        console.warn('[clinic-print] delete exam failed:', e);
        toast('시험 삭제 중 오류가 발생했습니다.', 'error');
    }
}

function clinicPrintIsAssignmentFullyExcluded(classId, assignment, gradeData = null) {
    const assignmentId = String(assignment?.id || '').trim();
    if (!assignmentId) return false;
    const activeIds = gradeData?.status === 'ready' ? new Set(gradeData.students.map(row => String(row.id))) : null;
    const studentIds = activeIds
        ? gradeData.class_students.filter(row => String(row.class_id) === String(classId) && activeIds.has(String(row.student_id))).map(row => String(row.student_id || '')).filter(Boolean)
        : clinicPrintGetClassStudents(classId).map(student => String(student.id || '')).filter(Boolean);
    if (!studentIds.length) return false;
    const excludedIds = new Set((gradeData?.status === 'ready' ? gradeData.exclusions : (state.db.class_exam_assignment_exclusions || []))
        .filter(row => String(row.assignment_id || '') === assignmentId)
        .map(row => String(row.student_id || ''))
        .filter(Boolean));
    return studentIds.every(studentId => excludedIds.has(studentId));
}

function clinicPrintGetClassExamAssignments(classId) {
    return (state.db.class_exam_assignments || state.db.exam_assignments || [])
        .filter(row => String(row.class_id || '') === String(classId || ''))
        .filter(row => !clinicPrintIsAssignmentFullyExcluded(classId, row))
        .filter(row => clinicPrintIsOnOrAfterFromDate(row.exam_date || row.created_at || row.updated_at));
}

function clinicPrintGetGradeExamAssignments(classId) {
    const classIds = new Set(clinicPrintGetGradeClasses(classId).map(cls => String(cls.id)));
    const loaded = clinicPrintGradeData.get(String(classId));
    return (loaded?.status === 'ready' ? loaded.assignments : (state.db.class_exam_assignments || state.db.exam_assignments || []))
        .filter(row => classIds.has(String(row.class_id || '')))
        .filter(row => !clinicPrintIsAssignmentFullyExcluded(row.class_id || '', row, loaded))
        .filter(row => clinicPrintIsInGradeWindow(row, classId));
}

function clinicPrintGetMatchingExamGroup(grouped, examDate, examTitle, archiveFile, questionCount) {
    const normalizedArchive = clinicPrintNormalizeArchiveFile(archiveFile || '');
    const exactKey = clinicPrintMakeExamKey(examDate, examTitle, normalizedArchive, questionCount);
    if (grouped[exactKey]) return grouped[exactKey];

    if (normalizedArchive) {
        const qCount = Number(questionCount || 0);
        const archiveMatch = Object.values(grouped).find(group => {
            const groupCount = Number(group.questionCount || 0);
            const countsCompatible = !qCount || !groupCount || qCount === groupCount;
            return String(group.examDate || '') === String(examDate || '') &&
                clinicPrintNormalizeArchiveFile(group.archiveFile || '') === normalizedArchive &&
                countsCompatible;
        });
        if (archiveMatch) return archiveMatch;
    }

    return Object.values(grouped).find(group =>
        String(group.examDate || '') === String(examDate || '') &&
        String(group.examTitle || '') === String(examTitle || '') &&
        clinicPrintNormalizeArchiveFile(group.archiveFile || '') === normalizedArchive
    ) || null;
}

function clinicPrintEnsureExamGroup(grouped, source, options = {}) {
    const archiveFile = clinicPrintNormalizeArchiveFile(source.archiveFile || source.archive_file || '');
    const questionCount = Number(source.questionCount || source.question_count || 0);
    const examDate = source.examDate || source.exam_date || '';
    const examTitle = source.examTitle || source.exam_title || '시험명 없음';
    const matched = options.ignoreDate && archiveFile
        ? Object.values(grouped).find(group => group.archiveFile === archiveFile &&
            (!group.questionCount || !questionCount || group.questionCount === questionCount))
        : clinicPrintGetMatchingExamGroup(grouped, examDate, examTitle, archiveFile, questionCount);
    if (matched) {
        if (options.ignoreDate && String(examDate) > String(matched.examDate)) matched.examDate = examDate;
        if (!matched.archiveFile && archiveFile) matched.archiveFile = archiveFile;
        if (!Number(matched.questionCount || 0) && questionCount) matched.questionCount = questionCount;
        if (source.assignment) {
            matched.assignment = matched.assignment || source.assignment;
            matched.assignments = matched.assignments || [];
            if (!matched.assignments.some(row => String(row.id || '') === String(source.assignment.id || ''))) {
                matched.assignments.push(source.assignment);
            }
        }
        const sourceClassId = String(source.classId || source.assignment?.class_id || source.session?.class_id || '').trim();
        if (sourceClassId && !matched.sourceClassIds.includes(sourceClassId)) matched.sourceClassIds.push(sourceClassId);
        matched.printable = !!matched.archiveFile;
        return matched;
    }

    const key = clinicPrintMakeExamKey(options.ignoreDate ? '' : examDate,
        options.ignoreDate && archiveFile ? '' : examTitle, archiveFile, questionCount);
    grouped[key] = {
        examKey: key,
        examTitle,
        examDate,
        archiveFile,
        questionCount,
        sessions: [],
        wrongCount: 0,
        printable: !!archiveFile,
        assignment: source.assignment || null,
        assignments: source.assignment ? [source.assignment] : [],
        sourceClassIds: [source.classId || source.assignment?.class_id || source.session?.class_id || ''].map(String).filter(Boolean)
    };
    return grouped[key];
}

function clinicPrintGetClassExamGroups(classId, scope = 'class') {
    const isGradeScope = scope === 'grade';
    const studentIds = new Set((isGradeScope ? clinicPrintGetGradeStudents(classId) : clinicPrintGetClassStudents(classId)).map(student => String(student.id)));
    const grouped = {};

    (isGradeScope ? clinicPrintGetGradeExamAssignments(classId) : clinicPrintGetClassExamAssignments(classId)).forEach(assignment => {
        clinicPrintEnsureExamGroup(grouped, {
            examTitle: assignment.exam_title || '',
            examDate: assignment.exam_date || '',
            archiveFile: assignment.archive_file || '',
            questionCount: Number(assignment.question_count || 0),
            assignment,
            classId: assignment.class_id || ''
        }, { ignoreDate: isGradeScope });
    });

    const loaded = clinicPrintGradeData.get(String(classId));
    const sessions = isGradeScope && loaded?.status === 'ready' ? loaded.sessions : (state.db.exam_sessions || []);
    sessions.forEach(session => {
        if (!studentIds.has(String(session.student_id))) return;
        if (isGradeScope ? !clinicPrintIsInGradeWindow(session, classId)
            : !clinicPrintIsOnOrAfterFromDate(session.exam_date || session.created_at || session.updated_at)) return;

        const archiveFile = clinicPrintGetSessionArchiveFile(session);
        const questionCount = Number(session.question_count || 0);
        const group = clinicPrintEnsureExamGroup(grouped, {
            examTitle: session.exam_title || '',
            examDate: session.exam_date || '',
            archiveFile,
            questionCount,
            session,
            classId: session.class_id || ''
        }, { ignoreDate: isGradeScope });

        group.sessions.push(session);
        group.wrongCount += clinicPrintGetWrongIdsBySession(session.id, isGradeScope ? classId : null).length;
    });

    if (isGradeScope) Object.values(grouped).forEach(group => {
        group.sessions = clinicPrintDedupeLatestSessionByStudent(group.sessions);
        group.wrongCount = group.sessions.reduce((total, session) => total + clinicPrintGetWrongIdsBySession(session.id, classId).length, 0);
    });

    return Object.values(grouped)
        .filter(group => group.printable || group.sessions.length > 0)
        .sort((a, b) => String(b.examDate || '').localeCompare(String(a.examDate || '')) || String(b.examTitle || '').localeCompare(String(a.examTitle || ''), 'ko'));
}

function clinicPrintGetSessionsForExamGroup(classId, examGroupKey) {
    const studentIds = new Set(clinicPrintGetClassStudents(classId).map(student => String(student.id)));
    const group = clinicPrintParseExamKey(examGroupKey);

    const sessions = (state.db.exam_sessions || []).filter(session => {
        if (!studentIds.has(String(session.student_id))) return false;
        if (!group.examDate && !clinicPrintIsInGradeWindow(session, classId)) return false;
        const key = clinicPrintMakeExamKey(session.exam_date, session.exam_title, clinicPrintGetSessionArchiveFile(session), Number(session.question_count || 0));
        const sessionQuestionCount = Number(session.question_count || 0);
        const countsCompatible = !group.questionCount || !sessionQuestionCount || sessionQuestionCount === group.questionCount;
        return key === examGroupKey || (
            !!group.archiveFile &&
            (!group.examDate || String(session.exam_date || '') === group.examDate) &&
            String(clinicPrintGetSessionArchiveFile(session) || '') === String(group.archiveFile || '') &&
            countsCompatible
        );
    });
    return group.examDate ? sessions : clinicPrintDedupeLatestSessionByStudent(sessions);
}

function clinicPrintGetGradeSessionsForExamGroup(classId, examGroupKey) {
    const studentIds = new Set(clinicPrintGetGradeStudents(classId).map(student => String(student.id)));
    const group = clinicPrintParseExamKey(examGroupKey);
    const groupArchive = clinicPrintNormalizeArchiveFile(group.archiveFile || '');

    const loaded = clinicPrintGradeData.get(String(classId));
    return (loaded?.status === 'ready' ? loaded.sessions : (state.db.exam_sessions || [])).filter(session => {
        if (!studentIds.has(String(session.student_id))) return false;
        if (!clinicPrintIsInGradeWindow(session, classId)) return false;
        const sessionArchive = clinicPrintNormalizeArchiveFile(clinicPrintGetSessionArchiveFile(session));
        const sessionQuestionCount = Number(session.question_count || 0);
        const countsCompatible = !group.questionCount || !sessionQuestionCount || sessionQuestionCount === group.questionCount;
        return !!groupArchive && sessionArchive === groupArchive && countsCompatible;
    });
}

function clinicPrintDedupeLatestSessionByStudent(sessions) {
    const sessionSortValue = session => String(
        session?.updated_at ||
        session?.created_at ||
        session?.submitted_at ||
        session?.completed_at ||
        session?.exam_date ||
        ''
    );
    const sorted = [...(sessions || [])].sort((a, b) =>
        sessionSortValue(b).localeCompare(sessionSortValue(a)) ||
        String(b.id || '').localeCompare(String(a.id || ''))
    );
    const byStudent = new Map();
    sorted.forEach(session => {
        const studentId = String(session.student_id || '');
        if (studentId && !byStudent.has(studentId)) byStudent.set(studentId, session);
    });
    return [...byStudent.values()];
}

function clinicPrintGetWrongIdsBySession(sessionId, gradeClassId = null) {
    const loaded = gradeClassId == null ? null : clinicPrintGradeData.get(String(gradeClassId));
    const rows = loaded?.status === 'ready'
        ? loaded.wrong_answers.filter(row => String(row.session_id) === String(sessionId))
        : typeof apmsGetWrongAnswersForSession === 'function'
        ? apmsGetWrongAnswersForSession(sessionId)
        : (state.db.wrong_answers || []).filter(row => String(row.session_id) === String(sessionId));

    return rows
        .map(row => Number(row.question_id))
        .filter(no => Number.isFinite(no) && no > 0)
        .sort((a, b) => a - b);
}

function clinicPrintFindBlueprint(session, questionNo) {
    const archiveFile = clinicPrintGetSessionArchiveFile(session);
    if (!archiveFile) return null;

    if (typeof apmsGetExamBlueprintByArchiveQuestion === 'function') {
        const direct = apmsGetExamBlueprintByArchiveQuestion(archiveFile, questionNo);
        if (direct) return direct;
    }

    return (state.db.exam_blueprints || []).find(bp => {
        const bpFile = clinicPrintNormalizeArchiveFile(bp.archive_file || '');
        return bpFile === archiveFile && Number(bp.question_no) === Number(questionNo);
    }) || null;
}

function clinicPrintFindQuestionSnapshot(session, questionNo, gradeData = null) {
    const sessionId = String(session?.id || '');
    const assignmentId = String(session?.assignment_id || '');
    const resultRows = gradeData?.status === 'ready'
        ? (gradeData.result_items || [])
        : (state.db?.assessment_result_items || []);
    const resultItem = resultRows.find(row => String(row.session_id || '') === sessionId &&
        Number(row.order_no || row.question_no) === Number(questionNo)) || null;
    const hasResultSnapshot = !!resultItem && !!(
        resultItem.source_identity_status || resultItem.metadata_snapshot_status || resultItem.source_question_uid ||
        resultItem.metadata_revision || resultItem.metadata_hash || resultItem.metadata_json
    );
    if (hasResultSnapshot) return resultItem;

    const assignmentRows = gradeData?.status === 'ready'
        ? (gradeData.assignment_questions || [])
        : (state.db?.class_exam_assignment_questions || []);
    const assignmentQuestion = assignmentRows.find(row => String(row.assignment_id || '') === assignmentId &&
        Number(row.order_no) === Number(questionNo)) || null;
    if (assignmentQuestion) return assignmentQuestion;
    return resultItem;
}

function clinicPrintReadQuestionMetadata(snapshot) {
    const raw = snapshot?.metadata_json || snapshot?.metadataJson;
    if (!raw) return {};
    try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (!parsed || typeof parsed !== 'object') return {};
        const isSnapshotEnvelope = parsed.schemaVersion === 'apms-blueprint-meta-snapshot-v1';
        if (isSnapshotEnvelope) {
            return {
                canonicalMeta: parsed.canonicalMeta && typeof parsed.canonicalMeta === 'object' ? parsed.canonicalMeta : {},
                archiveMetadata: parsed.archiveMetadata && typeof parsed.archiveMetadata === 'object' ? parsed.archiveMetadata : {},
                authoringMeta: parsed.authoringMeta && typeof parsed.authoringMeta === 'object' ? parsed.authoringMeta : {},
                legacyDifficulty: parsed.legacyDifficulty ?? parsed.archiveMetadata?.difficulty ?? null,
                captureSource: parsed.captureSource || '',
                metadataRevision: parsed.metadataRevision || null,
                metadataHash: parsed.metadataHash || null,
                metadataContentHash: parsed.metadataContentHash || null,
                metadataSnapshotStatus: parsed.metadataSnapshotStatus || parsed.captureStatus || null
            };
        }
        return {
            canonicalMeta: {},
            archiveMetadata: parsed.archiveMetadata && typeof parsed.archiveMetadata === 'object'
                ? parsed.archiveMetadata
                : parsed,
            authoringMeta: parsed.authoringMeta && typeof parsed.authoringMeta === 'object' ? parsed.authoringMeta : {},
            legacyDifficulty: parsed.legacyDifficulty ?? parsed.archiveMetadata?.difficulty ?? parsed.difficulty ?? null,
            captureSource: parsed.captureSource || '',
            metadataRevision: parsed.metadataRevision || null,
            metadataHash: parsed.metadataHash || null,
            metadataContentHash: parsed.metadataContentHash || null,
            metadataSnapshotStatus: parsed.metadataSnapshotStatus || parsed.captureStatus || null
        };
    } catch (e) {
        return {};
    }
}

function clinicPrintReadMetaContentHash(snapshot) {
    const raw = snapshot?.metadata_json || snapshot?.metadataJson;
    if (!raw) return '';
    try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return String(parsed?.metadataContentHash || '').trim();
    } catch (e) {
        return '';
    }
}

// Identity comes only from the result row or the frozen assignment bridge.
// Display order is kept separately and is never promoted to source question no.
function clinicPrintGetSourceIdentity(snapshot) {
    const metadata = clinicPrintReadQuestionMetadata(snapshot);
    const archiveMetadata = metadata.archiveMetadata || {};
    const canonicalMeta = metadata.canonicalMeta || {};
    const legacyDifficulty = ['string', 'number'].includes(typeof metadata.legacyDifficulty)
        ? metadata.legacyDifficulty : null;
    const sourceArchiveFile = clinicPrintNormalizeArchiveFile(snapshot?.source_archive_file || snapshot?.sourceArchiveFile || '') || null;
    const sourceQuestionNoValue = Number(snapshot?.source_question_no ?? snapshot?.sourceQuestionNo);
    const sourceQuestionOrdinalValue = Number(snapshot?.source_question_ordinal ?? snapshot?.sourceQuestionOrdinal);
    const sourceQuestionUid = String(snapshot?.source_question_uid || snapshot?.question_uid || snapshot?.sourceQuestionUid || '').trim();
    const sourceIdentityStatus = String(snapshot?.source_identity_status || snapshot?.resolution_status || snapshot?.sourceIdentityStatus || 'UNRESOLVED').toUpperCase();
    const metadataRevision = snapshot?.metadata_revision || snapshot?.metadataRevision || metadata.metadataRevision || archiveMetadata.metadataRevision || canonicalMeta.metadataRevision || null;
    const metadataHash = snapshot?.metadata_hash || snapshot?.metadataHash || metadata.metadataHash || archiveMetadata.metadataHash || canonicalMeta.metadataHash || null;
    const metadataJson = snapshot?.metadata_json ?? snapshot?.metadataJson ?? null;
    const metadataContentHash = clinicPrintReadMetaContentHash(snapshot) || null;
    const metadataSnapshotStatus = snapshot?.metadata_snapshot_status || snapshot?.metadataSnapshotStatus || metadata.metadataSnapshotStatus || archiveMetadata.metadataSnapshotStatus ||
        (metadataRevision && metadataHash && metadataJson ? 'CAPTURED' : (metadataRevision || metadataHash || metadataJson ? 'PARTIAL' : 'UNRESOLVED'));
    return {
        sourceArchiveFile,
        sourceQuestionNo: Number.isFinite(sourceQuestionNoValue) && sourceQuestionNoValue > 0 ? sourceQuestionNoValue : null,
        sourceQuestionOrdinal: Number.isFinite(sourceQuestionOrdinalValue) && sourceQuestionOrdinalValue > 0 ? sourceQuestionOrdinalValue : null,
        sourceQuestionUid: sourceIdentityStatus === 'UNRESOLVED' ? '' : sourceQuestionUid,
        sourceIdentityStatus,
        sourceFingerprint: snapshot?.source_fingerprint || snapshot?.sourceFingerprint || null,
        metadataRevision,
        metadataHash,
        metadataJson,
        metadataContentHash,
        metadataSnapshotStatus,
        unitKey: snapshot?.standard_unit_key || snapshot?.standardUnitKey || archiveMetadata.standardUnitKey || null,
        unit: snapshot?.standard_unit || snapshot?.standardUnit || archiveMetadata.standardUnit || null,
        course: snapshot?.standard_course || snapshot?.standardCourse || archiveMetadata.standardCourse || null,
        cluster: snapshot?.concept_cluster_key || snapshot?.conceptClusterKey || archiveMetadata.conceptClusterKey || null,
        typeKey: snapshot?.type_key || snapshot?.typeKey || archiveMetadata.typeKey || null,
        difficulty: snapshot?.difficulty || snapshot?.difficulty_at_assignment || legacyDifficulty || archiveMetadata.difficulty || null,
        canonicalMeta,
        legacyDifficulty: metadata.legacyDifficulty ?? null
    };
}

function clinicPrintBuildWrongItemFromSession(session, examKey, questionNo, gradeData = null) {
    const archiveFile = clinicPrintGetSessionArchiveFile(session);
    const snapshot = clinicPrintFindQuestionSnapshot(session, questionNo, gradeData);
    const identity = clinicPrintGetSourceIdentity(snapshot);
    const originRef = {
        sessionId: String(session?.id || ''),
        assignmentId: String(session?.assignment_id || ''),
        orderNo: Number(questionNo),
        examTitle: String(session?.exam_title || ''),
        examDate: String(session?.exam_date || ''),
        archiveFile
    };
    return {
        examKey,
        examTitle: session?.exam_title || '',
        examDate: session?.exam_date || '',
        archiveFile,
        questionNo: Number(questionNo),
        displayArchiveFile: archiveFile,
        displayQuestionNo: Number(questionNo),
        ...identity,
        sourceOriginRefs: originRef.sessionId || originRef.assignmentId ? [originRef] : []
    };
}

function clinicPrintGetWrongItemSourceKey(item) {
    const file = clinicPrintNormalizeArchiveFile(item?.sourceArchiveFile || item?.archiveFile || '');
    const ordinal = Number(item?.sourceQuestionOrdinal || 0);
    const no = Number(item?.sourceQuestionNo || item?.questionNo || 0);
    const revision = String(item?.metadataRevision || '');
    const hash = String(item?.metadataHash || '');
    const contentHash = String(item?.metadataContentHash || clinicPrintReadMetaContentHash(item) || '').trim();
    const metadataKey = contentHash ? `content:${contentHash}` : `${revision}|${hash}`;
    const uid = String(item?.sourceQuestionUid || '').trim();
    if (uid) return `uid:${uid}|meta:${metadataKey}`;
    if (file && ordinal > 0 && item?.sourceIdentityStatus !== 'UNRESOLVED') return `${file}|ordinal:${ordinal}|meta:${metadataKey}`;
    if (file && no > 0 && item?.sourceIdentityStatus && item.sourceIdentityStatus !== 'UNRESOLVED') return `${file}|source-no:${no}|meta:${metadataKey}`;
    const origin = (item?.sourceOriginRefs || [])[0] || {};
    if (origin.assignmentId || origin.sessionId) return `origin:${origin.assignmentId || origin.sessionId}|order:${origin.orderNo || item?.displayQuestionNo || item?.questionNo || 0}`;
    return `legacy:${file}|${Number(item?.displayQuestionNo || item?.questionNo || 0)}`;
}

function clinicPrintDedupeWrongItemsBySource(items) {
    const byKey = new Map();
    (items || []).forEach(item => {
        const key = clinicPrintGetWrongItemSourceKey(item);
        const existing = byKey.get(key);
        if (!existing) byKey.set(key, { ...item, sourceOriginRefs: [...(item.sourceOriginRefs || [])] });
        else {
            const refs = new Map((existing.sourceOriginRefs || []).map(ref => [`${ref.assignmentId || ''}|${ref.sessionId || ''}|${ref.orderNo || ''}`, ref]));
            (item.sourceOriginRefs || []).forEach(ref => refs.set(`${ref.assignmentId || ''}|${ref.sessionId || ''}|${ref.orderNo || ''}`, ref));
            existing.sourceOriginRefs = [...refs.values()];
        }
    });
    return [...byKey.values()];
}

function clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, selectedStudentIds, options = {}) {
    const selectedExams = new Set(selectedExamKeys || []);
    const selectedStudents = new Set((selectedStudentIds || []).map(id => String(id)));
    const classStudents = clinicPrintGetClassStudents(classId);
    const studentMap = new Map(classStudents.map(student => [String(student.id), student]));
    const rowsByStudent = {};

    selectedExams.forEach(examKey => {
        clinicPrintGetSessionsForExamGroup(classId, examKey).forEach(session => {
            const studentId = String(session.student_id || '');
            const student = studentMap.get(studentId);
            if (!student || (selectedStudents.size && !selectedStudents.has(studentId))) return;

            const archiveFile = clinicPrintGetSessionArchiveFile(session);
            if (!archiveFile) return;

            const wrongItems = clinicPrintGetWrongIdsBySession(session.id,
                clinicPrintParseExamKey(examKey).examDate ? null : classId).map(questionNo =>
                clinicPrintBuildWrongItemFromSession(session, examKey, questionNo));

            if (!wrongItems.length && options.excludeEmpty !== false) return;

            if (!rowsByStudent[studentId]) {
                rowsByStudent[studentId] = {
                    studentId,
                    studentName: student.name || '이름 없음',
                    wrongItems: []
                };
            }
            rowsByStudent[studentId].wrongItems.push(...wrongItems);
        });
    });

    return Object.values(rowsByStudent)
        .map(row => ({
            ...row,
            wrongItems: clinicPrintDedupeWrongItemsBySource(row.wrongItems.sort((a, b) =>
                String(b.examDate || '').localeCompare(String(a.examDate || '')) ||
                String(a.examTitle || '').localeCompare(String(b.examTitle || ''), 'ko') ||
                Number(a.questionNo) - Number(b.questionNo)
            ))
        }))
        .filter(row => options.excludeEmpty === false || row.wrongItems.length > 0)
        .sort((a, b) => String(a.studentName || '').localeCompare(String(b.studentName || ''), 'ko'));
}

function clinicPrintBuildExamCohortCounts(classId, selectedExamKeys, selectedStudentIds) {
    const selectedStudents = new Set((selectedStudentIds || []).map(id => String(id)));
    const counts = {};

    (selectedExamKeys || []).forEach(examKey => {
        const studentIds = new Set();
        clinicPrintGetSessionsForExamGroup(classId, examKey).forEach(session => {
            const studentId = String(session.student_id || '');
            if (!studentId || (selectedStudents.size && !selectedStudents.has(studentId))) return;
            studentIds.add(studentId);
        });
        counts[examKey] = studentIds.size;
    });

    return counts;
}

function clinicPrintBuildGradeWrongSource(classId, selectedExamKeys) {
    const gradeStudents = clinicPrintGetGradeStudents(classId);
    const studentMap = new Map(gradeStudents.map(student => [String(student.id), student]));
    const rowsByStudent = {};
    const cohortCounts = {};
    const sourceCohorts = new Map();

    (selectedExamKeys || []).forEach(examKey => {
        const sessions = clinicPrintDedupeLatestSessionByStudent(clinicPrintGetGradeSessionsForExamGroup(classId, examKey));
        cohortCounts[examKey] = sessions.length;

        // Count each student's exposure against that session's frozen question
        // identity. Same-title reissues may carry a different Meta snapshot.
        const gradeData = clinicPrintGradeData.get(String(classId));
        sessions.forEach(session => {
            const studentId = String(session.student_id || '');
            if (!studentId || !studentMap.has(studentId)) return;
            const questionCount = Math.max(0, Number(session.question_count || 0));
            for (let questionNo = 1; questionNo <= questionCount; questionNo++) {
                const snapshot = clinicPrintFindQuestionSnapshot(session, questionNo, gradeData);
                const identity = clinicPrintGetSourceIdentity(snapshot);
                const key = clinicPrintGetWrongItemSourceKey({
                    archiveFile: clinicPrintGetSessionArchiveFile(session),
                    questionNo,
                    displayQuestionNo: questionNo,
                    ...identity,
                    sourceOriginRefs: [{ sessionId: session.id, assignmentId: session.assignment_id, orderNo: questionNo }]
                });
                if (!sourceCohorts.has(key)) sourceCohorts.set(key, new Set());
                sourceCohorts.get(key).add(studentId);
            }
        });

        sessions.forEach(session => {
            const studentId = String(session.student_id || '');
            const student = studentMap.get(studentId);
            if (!student) return;

            const archiveFile = clinicPrintGetSessionArchiveFile(session);
            if (!archiveFile) return;

            const wrongItems = clinicPrintGetWrongIdsBySession(session.id, classId).map(questionNo =>
                clinicPrintBuildWrongItemFromSession(session, examKey, questionNo, clinicPrintGradeData.get(String(classId))));

            if (!wrongItems.length) return;

            if (!rowsByStudent[studentId]) {
                rowsByStudent[studentId] = {
                    studentId,
                    studentName: student.name || '이름 없음',
                    classId: student.classId || '',
                    className: student.className || '',
                    wrongItems: []
                };
            }
            rowsByStudent[studentId].wrongItems.push(...wrongItems);
        });
    });

    return {
        cohortCounts,
        sourceCohorts,
        studentWrongItems: Object.values(rowsByStudent)
            .map(row => ({
                ...row,
                wrongItems: clinicPrintDedupeWrongItemsBySource(row.wrongItems.sort((a, b) =>
                    String(b.examDate || '').localeCompare(String(a.examDate || '')) ||
                    String(a.examTitle || '').localeCompare(String(b.examTitle || ''), 'ko') ||
                    Number(a.questionNo) - Number(b.questionNo)
                ))
            }))
            .sort((a, b) =>
                String(a.className || '').localeCompare(String(b.className || ''), 'ko') ||
                String(a.studentName || '').localeCompare(String(b.studentName || ''), 'ko')
            )
    };
}

function clinicPrintBuildClassWrongItems(studentWrongItems, examCohortCounts = {}, sourceCohorts = null) {
    const map = {};

    (studentWrongItems || []).forEach(student => {
        (student.wrongItems || []).forEach(item => {
            const key = clinicPrintGetWrongItemSourceKey(item);
            const totalCount = Number(examCohortCounts[item.examKey] || 0);
            if (!map[key]) {
                map[key] = {
                    itemKey: key,
                    examTitle: item.examTitle || '',
                    examDate: item.examDate || '',
                    examKey: item.examKey || '',
                    archiveFile: clinicPrintNormalizeArchiveFile(item.archiveFile),
                    questionNo: Number(item.questionNo),
                    displayArchiveFile: item.displayArchiveFile || item.archiveFile || '',
                    displayQuestionNo: Number(item.displayQuestionNo || item.questionNo),
                    sourceArchiveFile: item.sourceArchiveFile || null,
                    sourceQuestionNo: item.sourceQuestionNo || null,
                    sourceQuestionOrdinal: item.sourceQuestionOrdinal || null,
                    sourceQuestionUid: item.sourceQuestionUid || '',
                    sourceIdentityStatus: item.sourceIdentityStatus || 'UNRESOLVED',
                    sourceFingerprint: item.sourceFingerprint || null,
                    metadataRevision: item.metadataRevision || null,
                    metadataHash: item.metadataHash || null,
                    metadataJson: item.metadataJson ?? null,
                    metadataContentHash: item.metadataContentHash || null,
                    metadataSnapshotStatus: item.metadataSnapshotStatus || 'UNRESOLVED',
                    sourceOriginRefs: [...(item.sourceOriginRefs || [])],
                    wrongCount: 0,
                    totalCount,
                    correctRate: null,
                    wrongStudents: [],
                    unitKey: item.unitKey || '',
                    unit: item.unit || '',
                    course: item.course || '',
                    cluster: item.cluster || '',
                    typeKey: item.typeKey || '',
                    difficulty: item.difficulty || ''
                };
            }

            const originRefs = new Map((map[key].sourceOriginRefs || []).map(ref => [`${ref.assignmentId || ''}|${ref.sessionId || ''}|${ref.orderNo || ''}`, ref]));
            (item.sourceOriginRefs || []).forEach(ref => originRefs.set(`${ref.assignmentId || ''}|${ref.sessionId || ''}|${ref.orderNo || ''}`, ref));
            map[key].sourceOriginRefs = [...originRefs.values()];

            if (totalCount && totalCount > Number(map[key].totalCount || 0)) {
                map[key].totalCount = totalCount;
            }

            if (!map[key].wrongStudents.some(row => String(row.studentId) === String(student.studentId))) {
                map[key].wrongStudents.push({
                    studentId: student.studentId,
                    studentName: student.studentName
                });
                map[key].wrongCount += 1;
            }
        });
    });

    return Object.values(map).map(item => {
        const total = sourceCohorts?.has(item.itemKey)
            ? sourceCohorts.get(item.itemKey).size : Number(item.totalCount || 0);
        return {
            ...item,
            totalCount: total,
            correctRate: total ? Math.max(0, Math.min(100, Math.round(((total - Number(item.wrongCount || 0)) / total) * 100))) : null
        };
    }).sort((a, b) => {
        const aRate = a.correctRate !== null ? a.correctRate : -1;
        const bRate = b.correctRate !== null ? b.correctRate : -1;
        return (bRate - aRate) ||
            String(b.examDate || '').localeCompare(String(a.examDate || '')) ||
            Number(a.questionNo) - Number(b.questionNo);
    });
}

function clinicPrintBuildPayload(classId, config) {
    const cls = clinicPrintGetClass(classId);
    const selectedExamKeys = config.selectedExamKeys || [];
    const selectedStudentIds = config.selectedStudentIds || [];
    const mode = config.mode || 'student';
    const studentWrongItems = clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, selectedStudentIds, { excludeEmpty: true });

    // 반 공통 오답 통계는 배포 대상 선택과 무관하게 반 전체 모집단 기준으로 계산한다.
    // (선택한 학생은 "누구에게 배포할지"만 결정하며, "공통 오답이 무엇인지" 통계는 좁히지 않는다)
    const allClassStudentIds = clinicPrintGetClassStudents(classId).map(student => String(student.id));
    const classCohortWrongItems = clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, allClassStudentIds, { excludeEmpty: true });
    const classCohortCounts = clinicPrintBuildExamCohortCounts(classId, selectedExamKeys, allClassStudentIds);
    const classWrongItems = clinicPrintBuildClassWrongItems(classCohortWrongItems, classCohortCounts);
    const gradeSource = mode === 'grade'
        ? clinicPrintBuildGradeWrongSource(classId, selectedExamKeys)
        : { cohortCounts: {}, studentWrongItems: [] };
    const gradeWrongItems = mode === 'grade'
        ? clinicPrintBuildClassWrongItems(gradeSource.studentWrongItems, gradeSource.cohortCounts, gradeSource.sourceCohorts)
        : [];
    const examMap = new Map(clinicPrintGetClassExamGroups(classId, mode === 'grade' ? 'grade' : 'class').map(group => [group.examKey, group]));
    const today = new Date().toLocaleDateString('sv-SE');
    const gradeName = String(cls?.grade || '').trim();

    return {
        version: '1.0',
        mode,
        printTitle: mode === 'grade' ? `${gradeName || '학년'} 오답 클리닉` : `${cls?.name || '반'} 오답 클리닉`,
        classId,
        className: cls?.name || '',
        gradeName,
        range: {
            type: selectedExamKeys.length > 1 ? 'multi_exam' : 'single_exam',
            from: mode === 'grade' ? clinicPrintGetGradeWindow(classId).from : '',
            to: mode === 'grade' ? clinicPrintGetGradeWindow(classId).to : ''
        },
        options: {
            groupByStudent: mode === 'student',
            groupByExam: true,
            dedupeByQuestion: mode === 'class' || mode === 'grade',
            showWrongStudents: true,
            pageBreakByStudent: true,
            includeAnswer: false,
            includeSolution: false,
            includeHomeworkCheckBox: true
        },
        headerOptions: config.headerOptions || null,
        exams: selectedExamKeys.map(key => {
            const group = examMap.get(key) || clinicPrintParseExamKey(key);
            return {
                examKey: key,
                examTitle: group.examTitle || '',
                examDate: group.examDate || '',
                archiveFile: group.archiveFile || '',
                questionCount: Number(group.questionCount || 0)
            };
        }),
        students: studentWrongItems,
        classWrongItems,
        gradeWrongItems,
        createdAt: new Date().toISOString(),
        createdDate: today
    };
}

function clinicPrintOpenEngine(payload) {
    try {
        const payloadJson = JSON.stringify(payload);
        sessionStorage.setItem('AP_CLINIC_PRINT_PAYLOAD', payloadJson);
        localStorage.setItem('AP_CLINIC_PRINT_PAYLOAD', payloadJson);
    } catch (e) {
        toast('오답지 데이터를 저장하지 못했습니다.', 'error');
        return;
    }

    const engineUrl = new URL('wrong_print_engine.html', window.location.href).toString();
    const win = window.open(engineUrl, '_blank', 'noopener');
    if (!win) {
        toast('팝업 차단을 해제하세요', 'warn');
    }
}

function clinicPrintOpenEngineUrl(url) {
    const absoluteUrl = new URL(url, window.location.href).toString();
    const win = window.open(absoluteUrl, '_blank', 'noopener');
    if (!win) {
        toast('팝업 차단을 해제하세요', 'warn');
    }
}

// 모드/범위와 무관하게 배포 대상은 항상 화면에서 선택한 학생으로만 제한한다.
// (반/학년 전체에 자동 배포되지 않도록 - 통계 모집단과 배포 대상을 분리)
function clinicPrintBuildWrongClinicTargets(classId, payload, selectedStudentIds = []) {
    const mode = payload?.mode || 'student';
    const selected = new Set((selectedStudentIds || []).map(String));
    const isGradeScope = mode === 'grade' || (mode === 'type' && payload.scope === 'grade');

    if (isGradeScope) {
        return clinicPrintGetGradeStudents(classId)
            .filter(student => selected.has(String(student.id)))
            .map(student => ({
                type: 'student',
                student_id: student.id,
                student_name: student.name || '',
                class_id: student.classId || '',
                class_name: student.className || ''
            }));
    }

    return clinicPrintGetClassStudents(classId)
        .filter(student => selected.has(String(student.id)))
        .map(student => ({
            type: 'student',
            student_id: student.id,
            student_name: student.name || '',
            class_id: classId,
            class_name: clinicPrintGetClass(classId)?.name || ''
        }));
}

async function clinicPrintSaveAndOpen(classId, payload, selectedStudentIds = []) {
    const cls = clinicPrintGetClass(classId);
    const targets = clinicPrintBuildWrongClinicTargets(classId, payload, selectedStudentIds);
    const result = await api.post('wrong-clinics', {
        title: payload.headerOptions?.title || payload.printTitle || clinicPrintGetHeaderDefaultTitle(classId),
        mode: payload.mode || 'student',
        source: {
            scope_type: payload.mode === 'grade' || payload.scope === 'grade' ? 'grade' : 'class',
            class_id: classId,
            class_name: cls?.name || '',
            grade: payload.gradeName || cls?.grade || ''
        },
        targets,
        payload
    });
    if (result?.success === false || result?.error || result?.message === 'Forbidden' || !result?.public_set_key) {
        throw new Error(result.message || result.error || '저장형 오답 클리닉 생성 실패');
    }
    const engineUrl = result?.print?.engine_url || `wrong_print_engine.html?set=${encodeURIComponent(result.public_set_key || '')}`;
    clinicPrintOpenEngineUrl(engineUrl);
    toast(`오답 클리닉 저장 완료 · ${Number(result.packet_count || 0)}명`, 'success');
    if (state.ui?.classroomWrongClinicStatus?.[String(classId || '')]) state.ui.classroomWrongClinicStatus[String(classId || '')].loadedAt = 0;
    if (typeof updateClassroomMonthlyStatusBoardDOM === 'function') updateClassroomMonthlyStatusBoardDOM(classId);
    return result;
}

async function clinicPrintOpenStoredOrFallback(classId, payload, selectedStudentIds = []) {
    try {
        await clinicPrintSaveAndOpen(classId, payload, selectedStudentIds);
    } catch (e) {
        console.warn('[clinic-print] stored wrong clinic failed; fallback to storage payload:', e);
        toast('저장형 오답 클리닉 생성 실패. 임시 출력으로 진행합니다.', 'warn');
        clinicPrintOpenEngine(payload);
    }
}

function clinicPrintGetCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);
}

function clinicPrintOnRecipientChange(classId) {
    clinicPrintInvalidateRecommendations(classId);
    clinicPrintSchedulePreviewPush(classId);
}

function clinicPrintSetAllRecipients(classId, checked) {
    document.querySelectorAll('input[name="clinic-print-student"]').forEach(input => { input.checked = !!checked; });
    clinicPrintOnRecipientChange(classId);
}

let clinicPrintPreviewPushTimer = null;
let clinicPrintActiveClassId = null;

// 미리보기 헤더 인라인 편집(iframe) → 좌측 입력칸 반영 → 재동기화.
// 리스너는 1회만 등록하고, 대상 반은 clinicPrintActiveClassId 로 추적한다.
if (typeof window !== 'undefined' && !window.__clinicPrintHeaderEditBound) {
    window.__clinicPrintHeaderEditBound = true;
    window.addEventListener('message', event => {
        if (event.origin !== window.location.origin) return;
        const msg = event.data || {};
        if ((msg.type !== 'AP_PRINT_HEADER_EDIT' && msg.type !== 'AP_CLINIC_HEADER_EDIT') || !clinicPrintActiveClassId) return;
        const fieldToId = {
            title: 'clinic-print-header-title',
            subtitle: 'clinic-print-header-subtitle'
        };
        const input = document.getElementById(fieldToId[msg.field] || '');
        if (!input) return;
        input.value = msg.value || '';
        if (msg.field === 'title') clinicPrintSetHeaderTitleDirty(true);
        clinicPrintSchedulePreviewPush(clinicPrintActiveClassId);
    });
}

function clinicPrintGetPreviewEngineMode() {
    const frame = document.getElementById('clinic-print-preview-frame');
    try {
        return frame?.contentDocument?.querySelector('.mode-tab.active')?.dataset?.mode || '';
    } catch (e) {
        return '';
    }
}

function clinicPrintPushPreview(classId) {
    const frame = document.getElementById('clinic-print-preview-frame');
    if (!frame?.contentWindow) return;

    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    let payload = null;
    try {
        payload = mode === 'type'
            ? clinicPrintBuildTypePayload(classId)
            : clinicPrintBuildPayload(classId, {
                selectedExamKeys: clinicPrintGetCheckedValues('clinic-print-exam'),
                selectedStudentIds: clinicPrintGetCheckedValues('clinic-print-student'),
                mode,
                headerOptions: clinicPrintGetHeaderOptions(classId)
            });
    } catch (e) {
        console.warn('[clinic-print] preview payload build failed:', e);
    }

    if (!payload) return;
    payload = clinicPrintApplySelectedRecommendations(payload, classId);
    const engineMode = clinicPrintGetPreviewEngineMode();
    frame.contentWindow.postMessage({
        type: 'AP_PRINT_PREVIEW',
        payload,
        mode: engineMode || undefined
    }, window.location.origin);
}

function clinicPrintSchedulePreviewPush(classId, delay = 150) {
    clearTimeout(clinicPrintPreviewPushTimer);
    clinicPrintPreviewPushTimer = setTimeout(() => {
        clinicPrintPushPreview(classId);
    }, delay);
}

function clinicPrintSwitchMode(classId) {
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    clinicPrintInvalidateRecommendations(classId);

    document.querySelectorAll('#clinic-print-mode-cards .clinic-print-mode-card').forEach(card => {
        const active = card.getAttribute('data-mode') === mode;
        card.classList.toggle('clinic-print-mode-card--active', active);
    });

    const isType = mode === 'type';
    const studentSection = document.getElementById('clinic-print-student-section');
    const typePanel = document.getElementById('clinic-print-type-panel');
    const submitBtn = document.getElementById('clinic-print-submit-btn');
    // 학생 선택 영역은 모드와 무관하게 항상 노출한다(반/학년/유형 모드도 배포 대상을 직접 골라야 함).
    if (studentSection) studentSection.style.display = '';
    if (typePanel) typePanel.style.display = isType ? 'flex' : 'none';
    if (submitBtn) submitBtn.style.display = '';
    clinicPrintUpdateExamList(classId);
    clinicPrintRefreshHeaderDefault(classId);

    if (isType) clinicPrintRenderTypePanel(classId);
    clinicPrintUpdateStudentList(classId);
    clinicPrintSchedulePreviewPush(classId);
}

// ---- 유형 카드 (최다빈출 / 최다오답 / 단원별) ----

// scope 범위의 dedupe된 공통 오답 문항 목록(정답률·오답수 포함)을 만든다.
// 기존 학생/반/학년 집계 함수를 그대로 재사용한다(신규 마스터 없음).
function clinicPrintGetScopeWrongItems(classId, selectedExamKeys, scope) {
    if (scope === 'grade') {
        const gradeSource = clinicPrintBuildGradeWrongSource(classId, selectedExamKeys);
        return clinicPrintBuildClassWrongItems(gradeSource.studentWrongItems, gradeSource.cohortCounts, gradeSource.sourceCohorts);
    }
    const allStudentIds = clinicPrintGetClassStudents(classId).map(student => String(student.id));
    const studentWrongItems = clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, allStudentIds, { excludeEmpty: true });
    const examCohortCounts = clinicPrintBuildExamCohortCounts(classId, selectedExamKeys, allStudentIds);
    return clinicPrintBuildClassWrongItems(studentWrongItems, examCohortCounts);
}

// 배포 대상 선택 목록의 모집단(반 또는 학년)을 반환한다.
// mode='student': 개인 오답 콘텐츠라 본인 오답이 없는 학생은 어차피 출력할 게 없으므로 목록에서 제외한다.
// mode='class'/'grade'/'type': 콘텐츠가 "반·학년 공통 오답"이라 그 학생 개인의 오답 유무와 무관하다.
// 본인 오답이 0건이어도 복습용으로 줄 수 있어야 하므로 전체 명단을 보여주고, 오답수는 참고용으로만 표시한다.
function clinicPrintGetDeliveryPoolStudents(classId, selectedExamKeys, scope, mode) {
    if (mode === 'student') {
        const allStudentIds = clinicPrintGetClassStudents(classId).map(student => String(student.id));
        return clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, allStudentIds, { excludeEmpty: true });
    }
    if (scope === 'grade') {
        const gradeStudents = clinicPrintGetGradeStudents(classId);
        const wrongByStudent = new Map(
            clinicPrintBuildGradeWrongSource(classId, selectedExamKeys).studentWrongItems
                .map(row => [String(row.studentId), row.wrongItems])
        );
        return gradeStudents.map(student => ({
            studentId: student.id,
            studentName: student.name || '이름 없음',
            classId: student.classId || '',
            className: student.className || '',
            wrongItems: wrongByStudent.get(String(student.id)) || []
        }));
    }
    const classStudents = clinicPrintGetClassStudents(classId);
    const allStudentIds = classStudents.map(student => String(student.id));
    const wrongByStudent = new Map(
        clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, allStudentIds, { excludeEmpty: false })
            .map(row => [String(row.studentId), row.wrongItems])
    );
    return classStudents.map(student => ({
        studentId: student.id,
        studentName: student.name || '이름 없음',
        wrongItems: wrongByStudent.get(String(student.id)) || []
    }));
}

function clinicPrintGetDeliveryScope(mode) {
    if (mode === 'grade') return 'grade';
    if (mode === 'type') return document.getElementById('clinic-print-type-scope')?.value || 'class';
    return 'class';
}

// 시험 선택이 바뀌면 유형 모드는 문항 미리보기를, 그 외 모드는 학생 목록을 갱신해야 한다.
function clinicPrintOnExamChange(classId) {
    clinicPrintInvalidateRecommendations(classId);
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    if (mode === 'type') clinicPrintRenderTypePanel(classId);
    clinicPrintUpdateStudentList(classId);
}

// 최다빈출 = 정답률 50% 초과 / 최다오답 = 정답률 50% 이하 (2단계, 유형 카드용).
// 단원별 오답은 3단계: 75%초과 / 50~75% / 50%이하. 둘 다 오답수 내림차순.
function clinicPrintFilterTypeItems(items, rateRule) {
    return (items || [])
        .filter(item => {
            const rate = item.correctRate;
            if (rate === null || rate === undefined) return false;
            if (rateRule === 'gte75') return rate > 75;
            if (rateRule === 'mid5075') return rate > 50 && rate <= 75;
            if (rateRule === 'lte50') return rate <= 50;
            return rateRule === 'gte50' ? rate > 50 : rate <= 50;
        })
        .sort((a, b) =>
            Number(b.wrongCount || 0) - Number(a.wrongCount || 0) ||
            (rateRule === 'gte50' || rateRule === 'gte75'
                ? Number(b.correctRate || 0) - Number(a.correctRate || 0)
                : Number(a.correctRate || 0) - Number(b.correctRate || 0)) ||
            Number(a.questionNo || 0) - Number(b.questionNo || 0)
        );
}

function clinicPrintBuildTypePayload(classId) {
    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const scope = document.getElementById('clinic-print-type-scope')?.value || 'class';
    const typeMode = document.getElementById('clinic-print-type-mode')?.value || 'frequent';
    const rateRule = typeMode === 'unit'
        ? clinicPrintTypeState.unitRate
        : (typeMode === 'frequent' ? 'gte50' : 'lt50');
    const sourceItems = clinicPrintGetScopeWrongItems(classId, selectedExamKeys, scope);
    let typeItems = clinicPrintFilterTypeItems(sourceItems, rateRule);
    const selectedUnitKeys = typeMode === 'unit' ? [...clinicPrintTypeState.unitSelection] : [];
    const unitOrder = [...selectedUnitKeys];

    if (typeMode === 'unit') {
        const orderIndex = new Map(unitOrder.map((key, idx) => [key, idx]));
        typeItems = typeItems
            .filter(item => orderIndex.has(item.unitKey || '__UNCLASSIFIED__'))
            .sort((a, b) => {
                const ak = a.unitKey || '__UNCLASSIFIED__';
                const bk = b.unitKey || '__UNCLASSIFIED__';
                return (orderIndex.get(ak) - orderIndex.get(bk)) ||
                    Number(b.correctRate || 0) - Number(a.correctRate || 0) ||
                    Number(b.wrongCount || 0) - Number(a.wrongCount || 0) ||
                    Number(a.questionNo || 0) - Number(b.questionNo || 0);
            });
    }

    const payload = clinicPrintBuildPayload(classId, {
        selectedExamKeys,
        selectedStudentIds: clinicPrintGetClassStudents(classId).map(student => String(student.id)),
        mode: scope === 'grade' ? 'grade' : 'class',
        headerOptions: clinicPrintGetHeaderOptions(classId)
    });
    const cls = clinicPrintGetClass(classId);
    const gradeName = String(cls?.grade || '').trim();
    const typeTitle = typeMode === 'unit'
        ? '단원별 오답'
        : (typeMode === 'frequent' ? '최다빈출 오답' : '최다오답');

    return {
        ...payload,
        mode: 'type',
        typeMode,
        scope,
        rateRule,
        selectedUnitKeys,
        unitOrder,
        typeItems,
        classWrongItems: scope === 'class' ? typeItems : [],
        gradeWrongItems: scope === 'grade' ? typeItems : [],
        printTitle: `${scope === 'grade' ? (gradeName || '학년') : (cls?.name || '반')} ${typeTitle}`
    };
}

function clinicPrintSetTypeScope(classId, scope) {
    clinicPrintInvalidateRecommendations(classId);
    const input = document.getElementById('clinic-print-type-scope');
    if (input) input.value = scope;
    document.querySelectorAll('#clinic-print-type-scope-toggle .clinic-print-scope-btn').forEach(btn => {
        const active = btn.getAttribute('data-scope') === scope;
        btn.classList.toggle('clinic-print-scope-btn--active', active);
    });
    clinicPrintUpdateExamList(classId);
    clinicPrintRefreshHeaderDefault(classId);
    clinicPrintRenderTypePanel(classId);
    clinicPrintUpdateStudentList(classId); // 범위(반/학년)가 바뀌면 배포 대상 모집단도 바뀐다
    clinicPrintSchedulePreviewPush(classId);
}

function clinicPrintSetTypeMode(classId, typeMode) {
    clinicPrintInvalidateRecommendations(classId);
    const input = document.getElementById('clinic-print-type-mode');
    if (input) input.value = typeMode;
    document.querySelectorAll('#clinic-print-type-cards .clinic-print-type-card').forEach(card => {
        const active = card.getAttribute('data-type-mode') === typeMode;
        card.classList.toggle('clinic-print-type-card--active', active);
    });
    clinicPrintRefreshHeaderDefault(classId);
    clinicPrintRenderTypePanel(classId);
    clinicPrintSchedulePreviewPush(classId);
}

function clinicPrintRenderTypePanel(classId) {
    const root = document.getElementById('clinic-print-type-result');
    const summaryEl = document.getElementById('clinic-print-summary');
    if (!root) return;

    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const scope = document.getElementById('clinic-print-type-scope')?.value || 'class';
    const typeMode = document.getElementById('clinic-print-type-mode')?.value || 'frequent';
    const scopeLabel = scope === 'grade' ? (clinicPrintGetClassGrade(classId) || '학년') + ' 전체' : '현재 반';

    const emptyBox = msg => `<div class="clinic-print-empty">${clinicPrintEscapeHtml(msg)}</div>`;

    if (scope === 'grade' && clinicPrintGradeDataUnavailable(classId)) {
        root.innerHTML = emptyBox(clinicPrintGetGradeDataMessage(classId));
        if (summaryEl) summaryEl.textContent = clinicPrintGetGradeDataMessage(classId);
        return;
    }

    if (!selectedExamKeys.length) {
        root.innerHTML = emptyBox('시험을 선택하세요.');
        if (summaryEl) summaryEl.textContent = `${scopeLabel} · 시험 미선택`;
        return;
    }

    const scopeItems = clinicPrintGetScopeWrongItems(classId, selectedExamKeys, scope);

    if (typeMode === 'unit') {
        clinicPrintRenderUnitMode(classId, scopeLabel);
        return;
    }

    const rateRule = typeMode === 'frequent' ? 'gte50' : 'lt50';
    const filtered = clinicPrintFilterTypeItems(scopeItems, rateRule);
    const typeLabel = typeMode === 'frequent' ? '최다빈출 (정답률 50% 초과)' : '최다오답 (정답률 50% 이하)';

    if (summaryEl) summaryEl.textContent = `${scopeLabel} · ${typeMode === 'frequent' ? '최다빈출' : '최다오답'} · ${filtered.length}문항`;

    if (!filtered.length) {
        root.innerHTML = `<div class="clinic-print-result"><div class="clinic-print-subtitle">${clinicPrintEscapeHtml(typeLabel)} · ${clinicPrintEscapeHtml(scopeLabel)}</div>${emptyBox('해당 조건의 오답 문항이 없습니다.')}</div>`;
        return;
    }

    const previewLimit = 12;
    const rows = filtered.slice(0, previewLimit).map(item => {
        const unitText = item.unitKey ? (item.unit || item.unitKey) : '기타 / 단원 미분류';
        const rateText = item.correctRate === null || item.correctRate === undefined ? '-' : `${item.correctRate}%`;
        return `
            <div class="clinic-print-preview-row">
                <span class="clinic-print-preview-row__main">
                    <span class="clinic-print-preview-row__title">${clinicPrintEscapeHtml(item.examTitle || '시험')} · ${item.questionNo}번</span>
                    <span class="clinic-print-preview-row__meta">${clinicPrintEscapeHtml(unitText)}</span>
                </span>
                <span class="clinic-print-preview-row__stat">
                    <span class="clinic-print-preview-row__rate">정답률 ${rateText}</span>
                    <span class="clinic-print-preview-row__wrong">오답 ${item.wrongCount}명</span>
                </span>
            </div>
        `;
    }).join('');

    const moreText = filtered.length > previewLimit ? `<div class="clinic-print-more">외 ${filtered.length - previewLimit}문항</div>` : '';

    root.innerHTML = `
        <div class="clinic-print-result">
            <div class="clinic-print-subtitle">${clinicPrintEscapeHtml(typeLabel)} · ${clinicPrintEscapeHtml(scopeLabel)} · 오답수 많은 순</div>
            ${rows}
            ${moreText}
            <div class="clinic-print-note">오답지 만들기를 누르면 위 조건으로 출력됩니다.</div>
        </div>
    `;
}

// ---- 단원별 오답 드래그 UI (Loop 3) ----

// 유형 패널의 단원 선택/순서 상태. 모달 재생성 시 초기화되며, root 재렌더에는 영향받지 않는다.
const clinicPrintTypeState = { unitSelection: [], unitRate: 'lte50', dragKey: null };

// 과목 prefix 정렬 우선순위. 표준단원키 접두로 마스터 과목 순서를 부여한다(JS아카이브 마스터 테이블 순서 기준).
const CLINIC_COURSE_RANK = {
    'M1': 1, 'M2': 2, 'M3': 3,
    'H22-C': 4, 'H22-C2': 5, 'H22-A': 6, 'H22-M1': 7, 'H22-M2': 8, 'H22-PS': 9, 'H22-GE': 10,
    'H15-SA': 11, 'H15-SB': 12, 'H15-M1': 13, 'H15-M2': 14, 'H15-CALC': 15, 'H15-PS': 16, 'H15-GV': 17
};

// 표준단원키의 숫자 접미(=마스터 Order)와 과목 rank를 추출하는 어댑터.
// 예: "H22-C-06" → { rank:4, num:6 }, "M3-04" → { rank:3, num:4 }
function clinicPrintUnitOrder(unitKey) {
    if (!unitKey) return { rank: 999, num: 999 };
    const parts = String(unitKey).split('-');
    const num = Number(parts[parts.length - 1]);
    const prefix = parts.slice(0, -1).join('-');
    const rank = CLINIC_COURSE_RANK[prefix] != null ? CLINIC_COURSE_RANK[prefix] : 900;
    return { rank, num: Number.isFinite(num) ? num : 999 };
}

function clinicPrintTypeEmptyBox(msg) {
    return `<div class="clinic-print-empty clinic-print-empty--sm">${clinicPrintEscapeHtml(msg)}</div>`;
}

// 현재 범위/정답률 규칙으로 단원 목록을 만든다.
// unitKey 기준으로 그룹핑하고, 마스터 순서로 정렬하며, unitKey 없는 문항은 "기타 / 단원 미분류" 버킷으로 모은다.
function clinicPrintComputeScopeUnits(classId) {
    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const scope = document.getElementById('clinic-print-type-scope')?.value || 'class';
    const scopeItems = clinicPrintGetScopeWrongItems(classId, selectedExamKeys, scope);
    const filtered = clinicPrintFilterTypeItems(scopeItems, clinicPrintTypeState.unitRate);
    const map = new Map();
    filtered.forEach(item => {
        const key = item.unitKey || '__UNCLASSIFIED__';
        if (!map.has(key)) {
            const ord = item.unitKey ? clinicPrintUnitOrder(item.unitKey) : { rank: 999, num: 999 };
            map.set(key, {
                key,
                label: item.unitKey ? (item.unit || item.unitKey) : '기타 / 단원 미분류',
                rank: ord.rank,
                num: ord.num,
                count: 0
            });
        }
        map.get(key).count += 1;
    });
    const units = Array.from(map.values()).sort((a, b) =>
        a.rank - b.rank || a.num - b.num || String(a.label).localeCompare(String(b.label), 'ko')
    );
    return { units, totalFiltered: filtered.length };
}

function clinicPrintRenderUnitMode(classId, scopeLabel) {
    const root = document.getElementById('clinic-print-type-result');
    if (!root) return;

    const safeClassId = clinicPrintEscapeJsString(classId);
    const activeCls = rate => rate === clinicPrintTypeState.unitRate ? ' clinic-print-rate-btn--active' : '';
    root.innerHTML = `
        <div class="clinic-print-type-panel">
            <div class="clinic-print-field">
                <div class="clinic-print-section-title">정답률 기준</div>
                <div id="clinic-print-unit-rate-toggle" class="clinic-print-rate-grid">
                    <button type="button" class="clinic-print-rate-btn${activeCls('gte75')}" data-rate="gte75" onclick="clinicPrintSetUnitRate('${safeClassId}','gte75')">최다빈출 (75%초과)</button>
                    <button type="button" class="clinic-print-rate-btn${activeCls('mid5075')}" data-rate="mid5075" onclick="clinicPrintSetUnitRate('${safeClassId}','mid5075')">중간 (50~75%)</button>
                    <button type="button" class="clinic-print-rate-btn${activeCls('lte50')}" data-rate="lte50" onclick="clinicPrintSetUnitRate('${safeClassId}','lte50')">최다오답 (50%이하)</button>
                </div>
            </div>
            <div class="clinic-print-field">
                <div class="clinic-print-section-title">마스터 단원</div>
                <div id="clinic-print-unit-master" class="clinic-print-unit-list clinic-print-unit-list--master"></div>
            </div>
            <div class="clinic-print-field">
                <div class="clinic-print-section-title">출력할 단원 <span class="clinic-print-section-title--soft">(드래그 또는 ↑↓로 순서 변경)</span></div>
                <div id="clinic-print-unit-selected" class="clinic-print-unit-list clinic-print-unit-list--selected"></div>
            </div>
            <div class="clinic-print-note">오답지 만들기를 누르면 선택한 단원 순서대로 출력됩니다.</div>
        </div>
    `;
    clinicPrintRenderUnitLists(classId);
}

function clinicPrintSetUnitRate(classId, rate) {
    clinicPrintTypeState.unitRate = rate;
    document.querySelectorAll('#clinic-print-unit-rate-toggle .clinic-print-rate-btn').forEach(btn => {
        const active = btn.getAttribute('data-rate') === rate;
        btn.classList.toggle('clinic-print-rate-btn--active', active);
    });
    clinicPrintRenderUnitLists(classId);
    clinicPrintSchedulePreviewPush(classId);
}

function clinicPrintRenderUnitLists(classId) {
    const masterEl = document.getElementById('clinic-print-unit-master');
    const selEl = document.getElementById('clinic-print-unit-selected');
    if (!masterEl || !selEl) return;

    const { units, totalFiltered } = clinicPrintComputeScopeUnits(classId);
    const byKey = new Map(units.map(u => [u.key, u]));

    // 현재 범위/규칙에 더 이상 존재하지 않는 선택 단원은 정리(누락 방지: 존재하는 것만 유지)
    clinicPrintTypeState.unitSelection = clinicPrintTypeState.unitSelection.filter(k => byKey.has(k));
    const selectedKeys = clinicPrintTypeState.unitSelection;
    const selectedSet = new Set(selectedKeys);
    const available = units.filter(u => !selectedSet.has(u.key));

    const summaryEl = document.getElementById('clinic-print-summary');
    const scope = document.getElementById('clinic-print-type-scope')?.value || 'class';
    const scopeLabel = scope === 'grade' ? (clinicPrintGetClassGrade(classId) || '학년') + ' 전체' : '현재 반';
    const rateLabel = clinicPrintTypeState.unitRate === 'gte75' ? '최다빈출'
        : (clinicPrintTypeState.unitRate === 'mid5075' ? '중간' : '최다오답');
    if (summaryEl) summaryEl.textContent = `${scopeLabel} · 단원별(${rateLabel}) · 선택 ${selectedKeys.length}/${units.length}단원 · ${totalFiltered}문항`;

    masterEl.innerHTML = available.length
        ? available.map(u => {
            const k = clinicPrintEscapeJsString(u.key);
            return `
                <div class="clinic-print-unit-row">
                    <span class="clinic-print-unit-row__main">
                        <span class="clinic-print-unit-row__label">${clinicPrintEscapeHtml(u.label)}</span>
                        <span class="clinic-print-unit-row__count">${u.count}문항</span>
                    </span>
                    <button type="button" class="clinic-print-unit-action clinic-print-unit-action--add" aria-label="추가" onclick="clinicPrintUnitAdd('${clinicPrintEscapeJsString(classId)}','${k}')">+</button>
                </div>
            `;
        }).join('')
        : clinicPrintTypeEmptyBox(units.length ? '모든 단원을 선택했습니다.' : '해당 조건의 단원이 없습니다.');

    selEl.innerHTML = selectedKeys.length
        ? selectedKeys.map((key, i) => {
            const u = byKey.get(key);
            const k = clinicPrintEscapeJsString(key);
            const cid = clinicPrintEscapeJsString(classId);
            return `
                <div data-unit-row data-key="${clinicPrintEscapeAttr(key)}" class="clinic-print-unit-row clinic-print-unit-row--selected">
                    <span class="clinic-print-unit-handle" title="드래그로 순서 변경">≡</span>
                    <span class="clinic-print-unit-row__main">
                        <span class="clinic-print-unit-row__label">${i + 1}. ${clinicPrintEscapeHtml(u.label)}</span>
                        <span class="clinic-print-unit-row__count">${u.count}문항</span>
                    </span>
                    <span class="clinic-print-unit-actions">
                        <button type="button" class="clinic-print-unit-action" aria-label="위로" ${i === 0 ? 'disabled' : ''} onclick="clinicPrintUnitMove('${cid}',${i},-1)">↑</button>
                        <button type="button" class="clinic-print-unit-action" aria-label="아래로" ${i === selectedKeys.length - 1 ? 'disabled' : ''} onclick="clinicPrintUnitMove('${cid}',${i},1)">↓</button>
                        <button type="button" class="clinic-print-unit-action clinic-print-unit-action--remove" aria-label="제거" onclick="clinicPrintUnitRemove('${cid}','${k}')">×</button>
                    </span>
                </div>
            `;
        }).join('')
        : clinicPrintTypeEmptyBox('상단 마스터 단원에서 + 로 추가하세요.');

    clinicPrintAttachUnitDnD(classId);
}

function clinicPrintUnitAdd(classId, key) {
    if (!clinicPrintTypeState.unitSelection.includes(key)) clinicPrintTypeState.unitSelection.push(key);
    clinicPrintRenderUnitLists(classId);
    clinicPrintSchedulePreviewPush(classId);
}

function clinicPrintUnitRemove(classId, key) {
    clinicPrintTypeState.unitSelection = clinicPrintTypeState.unitSelection.filter(k => k !== key);
    clinicPrintRenderUnitLists(classId);
    clinicPrintSchedulePreviewPush(classId);
}

function clinicPrintUnitMove(classId, index, dir) {
    const arr = clinicPrintTypeState.unitSelection;
    const j = index + dir;
    if (j < 0 || j >= arr.length) return;
    const tmp = arr[index];
    arr[index] = arr[j];
    arr[j] = tmp;
    clinicPrintRenderUnitLists(classId);
    clinicPrintSchedulePreviewPush(classId);
}

// 포인터 기반 드래그(마우스·터치·펜 공통). 드래그 중에는 DOM 노드만 이동하고, 놓을 때 순서를 확정한다.
function clinicPrintAttachUnitDnD(classId) {
    const selEl = document.getElementById('clinic-print-unit-selected');
    if (!selEl) return;
    selEl.querySelectorAll('[data-unit-row] .clinic-print-unit-handle').forEach(handle => {
        handle.addEventListener('pointerdown', e => {
            e.preventDefault();
            const row = handle.closest('[data-unit-row]');
            if (!row) return;
            row.style.opacity = '0.6';
            handle.style.cursor = 'grabbing';

            const onMove = ev => {
                const rows = Array.from(selEl.querySelectorAll('[data-unit-row]'));
                const after = rows.find(other => {
                    if (other === row) return false;
                    const rect = other.getBoundingClientRect();
                    return ev.clientY < rect.top + rect.height / 2;
                });
                if (after) {
                    if (after.previousElementSibling !== row) selEl.insertBefore(row, after);
                } else if (selEl.lastElementChild !== row) {
                    selEl.appendChild(row);
                }
            };
            const onUp = () => {
                document.removeEventListener('pointermove', onMove);
                document.removeEventListener('pointerup', onUp);
                row.style.opacity = '1';
                handle.style.cursor = 'grab';
                clinicPrintTypeState.unitSelection = Array.from(selEl.querySelectorAll('[data-unit-row]'))
                    .map(r => r.getAttribute('data-key'));
                clinicPrintRenderUnitLists(classId);
                clinicPrintSchedulePreviewPush(classId);
            };
            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onUp);
        });
    });
}

// 배포 대상 학생 체크리스트. 반/학년/유형 모드 모두 여기서 "실제로 인쇄물을 받을 학생"을 고른다.
// 공통 오답 통계(정답률 등)는 항상 반/학년 전체 모집단 기준으로 별도 계산되며, 이 목록은 배포 범위만 좁힌다.
function clinicPrintUpdateStudentList(classId) {
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    const scope = clinicPrintGetDeliveryScope(mode);
    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const root = document.getElementById('clinic-print-student-list');
    const countEl = document.getElementById('clinic-print-summary');
    if (!root) return;

    if (scope === 'grade' && clinicPrintGradeDataUnavailable(classId)) {
        root.innerHTML = `<div class="clinic-print-empty">${clinicPrintEscapeHtml(clinicPrintGetGradeDataMessage(classId))}</div>`;
        if (countEl) countEl.textContent = clinicPrintGetGradeDataMessage(classId);
        clinicPrintSchedulePreviewPush(classId);
        return;
    }

    if (!selectedExamKeys.length) {
        root.innerHTML = '<div class="clinic-print-empty">시험을 선택하세요.</div>';
        if (countEl && mode !== 'type') countEl.textContent = '시험을 선택하세요.';
        clinicPrintSchedulePreviewPush(classId);
        return;
    }

    const poolItems = clinicPrintGetDeliveryPoolStudents(classId, selectedExamKeys, scope, mode);

    if (countEl && mode !== 'type') {
        const totalWrong = poolItems.reduce((sum, row) => sum + row.wrongItems.length, 0);
        const scopeLabel = mode === 'student'
            ? '오답 학생'
            : (scope === 'grade' ? '학년 전체 학생' : '반 전체 학생');
        countEl.textContent = `선택 시험 ${selectedExamKeys.length}개 · ${scopeLabel} ${poolItems.length}명 · 오답 ${totalWrong}문항`;
    }

    if (!poolItems.length) {
        root.innerHTML = '<div class="clinic-print-empty">선택한 시험에 출력 가능한 오답이 없습니다.</div>';
        clinicPrintSchedulePreviewPush(classId);
        return;
    }

    // 시험/범위를 바꿀 때마다 이 목록 전체가 다시 그려지므로, 재렌더 전에 사용자가 직접 해제한 학생을
    // 기억해뒀다가 그대로 유지한다. 그렇지 않으면 exam 체크박스 하나만 건드려도 선택이 전부 초기화된다.
    const previouslyUnchecked = new Set(
        Array.from(root.querySelectorAll('input[name="clinic-print-student"]:not(:checked)')).map(el => el.value)
    );

    root.innerHTML = poolItems.map(row => {
        const checked = previouslyUnchecked.has(String(row.studentId)) ? '' : 'checked';
        return `
        <label class="clinic-print-student-row">
            <span class="clinic-print-student-row__main">
                <input type="checkbox" name="clinic-print-student" value="${clinicPrintEscapeAttr(row.studentId)}" ${checked} onchange="clinicPrintOnRecipientChange('${clinicPrintEscapeJsString(classId)}')">
                <span class="clinic-print-student-row__name">${clinicPrintEscapeHtml(row.studentName)}${row.className ? ` · ${clinicPrintEscapeHtml(row.className)}` : ''}</span>
            </span>
            <span class="clinic-print-student-row__count">${row.wrongItems.length}문항</span>
        </label>
    `;
    }).join('');
    clinicPrintSchedulePreviewPush(classId);
}

// "미리보기"는 새 창을 띄우지 않고 우측에 이미 떠 있는 임베드 미리보기 패널(clinic-print-preview-frame)을
// 갱신해서 보여준다. 설정이 바뀔 때마다 이 패널은 어차피 자동 갱신되므로, 이 버튼은 시험/단원/학생 선택이
// 빠졌는지 확인해 안내 토스트를 띄우고, 패널을 최신 상태로 강제 갱신 + 화면에 보이도록 스크롤만 해준다.
async function clinicPrintPreview(classId) {
    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';

    if (clinicPrintGetDeliveryScope(mode) === 'grade' && clinicPrintGradeDataUnavailable(classId)) {
        toast(clinicPrintGetGradeDataMessage(classId), 'warn');
        return;
    }
    if (!selectedExamKeys.length) {
        toast('출력할 시험을 선택하세요.', 'warn');
        return;
    }

    if (mode === 'student' && clinicPrintGetCheckedValues('clinic-print-student').some(studentId =>
        clinicPrintGetSelectedRecommendationItems(studentId).length)) {
        const verified = await clinicPrintValidateSelectedRecommendations(classId);
        if (!verified) {
            clinicPrintPushPreview(classId);
            return;
        }
    }

    if (mode === 'type') {
        const typePayload = clinicPrintBuildTypePayload(classId);
        if (typePayload.typeMode === 'unit' && !(typePayload.unitOrder || []).length) {
            toast('출력할 단원을 선택하세요.', 'warn');
            return;
        }
        if (!(typePayload.typeItems || []).length) {
            toast('출력 가능한 오답 문항이 없습니다.', 'warn');
            return;
        }
    } else {
        const selectedStudentIds = clinicPrintGetCheckedValues('clinic-print-student');
        if (mode === 'student' && !selectedStudentIds.length) {
            toast('미리볼 학생을 선택하세요.', 'warn');
            return;
        }

        let payload = clinicPrintBuildPayload(classId, {
            selectedExamKeys,
            selectedStudentIds,
            mode,
            headerOptions: clinicPrintGetHeaderOptions(classId)
        });
        payload = clinicPrintApplySelectedRecommendations(payload, classId);
        const itemCount = mode === 'grade'
            ? payload.gradeWrongItems.length
            : mode === 'class'
            ? payload.classWrongItems.length
            : payload.students.reduce((sum, row) => sum + row.wrongItems.length, 0);

        if (!itemCount) {
            toast('출력 가능한 오답 문항이 없습니다.', 'warn');
            return;
        }
    }

    clinicPrintPushPreview(classId);
    document.getElementById('clinic-print-preview-frame')?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
}

function clinicPrintConfirmRecommendationRecipients(classId, payload, selectedStudentIds) {
    const recommendationCount = Number(payload?.recommendationInfo?.selectedCount || 0);
    if (!recommendationCount) return true;
    const targets = clinicPrintBuildWrongClinicTargets(classId, payload, selectedStudentIds);
    if (!targets.length) {
        toast('추천 오답지 수신 학생을 확인할 수 없습니다.', 'warn');
        return false;
    }
    const recommendationCounts = payload.recommendationInfo.selectedByStudent || {};
    const rows = targets.map(target => {
        const className = target.class_name ? ` · ${target.class_name}` : '';
        const count = Number(recommendationCounts[String(target.student_id)] || 0);
        return `• ${target.student_name || '이름 없음'}${className}${count ? ` · 추천 ${count}문항` : ''}`;
    });
    const confirmed = confirm(`다음 ${targets.length}명에게 저장형 오답 클리닉을 보냅니다.\n${rows.join('\n')}\n\n이 수신 대상을 확인하고 저장할까요?`);
    if (confirmed) {
        payload.recommendationInfo.selectionConfirmed = true;
        payload.recommendationInfo.confirmedRecipientIds = targets.map(target => String(target.student_id));
    }
    return confirmed;
}

async function clinicPrintSubmit(classId) {
    let selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    let selectedStudentIds = clinicPrintGetCheckedValues('clinic-print-student');
    const modeEl = document.querySelector('input[name="clinic-print-mode"]:checked');
    const mode = modeEl?.value || 'student';

    if (clinicPrintGetDeliveryScope(mode) === 'grade' && clinicPrintGradeDataUnavailable(classId)) {
        toast(clinicPrintGetGradeDataMessage(classId), 'warn');
        return;
    }

    if (!selectedExamKeys.length) {
        toast('출력할 시험을 선택하세요.', 'warn');
        return;
    }

    // 모드/범위와 무관하게 출제할 학생은 반드시 직접 선택해야 한다(반·학년 전체 자동 배포 금지).
    if (!selectedStudentIds.length) {
        toast('출제할 학생을 선택하세요.', 'warn');
        return;
    }

    if (mode === 'student' && selectedStudentIds.some(studentId =>
        clinicPrintGetSelectedRecommendationItems(studentId).length)) {
        const expectedContextKey = clinicPrintGetRecommendationContextKey(classId, clinicPrintRecommendationState.scope);
        const verified = await clinicPrintValidateSelectedRecommendations(classId);
        if (!verified) return;
        if (clinicPrintGetRecommendationContextKey(classId, clinicPrintRecommendationState.scope) !== expectedContextKey) {
            clinicPrintInvalidateRecommendations(classId);
            toast('검증 중 학생·시험·추천 선택이 바뀌었습니다. 다시 확인해 주세요.', 'warn');
            return;
        }
        selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
        selectedStudentIds = clinicPrintGetCheckedValues('clinic-print-student');
        if (!selectedExamKeys.length || !selectedStudentIds.length) {
            toast('시험과 수신 학생을 다시 선택하세요.', 'warn');
            return;
        }
    }

    if (mode === 'type') {
        const typePayload = clinicPrintBuildTypePayload(classId);
        if (typePayload.typeMode === 'unit' && !(typePayload.unitOrder || []).length) {
            toast('출력할 단원을 선택하세요.', 'warn');
            return;
        }
        if (!(typePayload.typeItems || []).length) {
            toast('출력 가능한 오답 문항이 없습니다.', 'warn');
            return;
        }
        await clinicPrintOpenStoredOrFallback(classId, typePayload, selectedStudentIds);
        return;
    }

    let payload = clinicPrintBuildPayload(classId, {
        selectedExamKeys,
        selectedStudentIds,
        mode,
        headerOptions: clinicPrintGetHeaderOptions(classId)
    });
    payload = clinicPrintApplySelectedRecommendations(payload, classId);
    const itemCount = mode === 'grade'
        ? payload.gradeWrongItems.length
        : mode === 'class'
        ? payload.classWrongItems.length
        : payload.students.reduce((sum, row) => sum + row.wrongItems.length, 0);

    if (!itemCount) {
        toast('출력 가능한 오답 문항이 없습니다.', 'warn');
        return;
    }

    if (!clinicPrintConfirmRecommendationRecipients(classId, payload, selectedStudentIds)) return;

    await clinicPrintOpenStoredOrFallback(classId, payload, selectedStudentIds);
}

function openClinicCenter(classId = '') {
    const hasClassId = !!String(classId || '').trim();
    const safeClassIdForJs = clinicPrintEscapeJsString(classId);

    if (!hasClassId) {
        openClinicClassPicker();
        return;
    }

    showModal('클리닉', `
        <div class="clinic-print-menu-grid">
            <button class="btn apms-button apms-button--quiet clinic-print-menu-btn" onclick="if('${safeClassIdForJs}'){ openClinicPrintCenter('${safeClassIdForJs}'); } else { toast('반 화면에서 이용하세요.', 'info'); }">오답</button>
            <button class="btn apms-button apms-button--quiet clinic-print-menu-btn" onclick="clinicPrintOpenSimilarMenu('${safeClassIdForJs}')">유사문항</button>
        </div>
    `);
}

function openClinicClassPicker() {
    const classes = clinicPrintGetActiveClasses();
    const currentClassId = String(state.ui?.currentClassId || '');

    if (!classes.length) {
        toast('선택할 반이 없습니다.', 'warn');
        return;
    }

    const classRows = classes.map(cls => {
        const safeClassId = clinicPrintEscapeJsString(cls.id);
        const selected = String(cls.id) === currentClassId;
        const meta = [cls.grade, cls.teacher_name, cls.schedule_days || cls.day_group, cls.time_label]
            .filter(Boolean)
            .join(' · ');
        return `
            <button type="button" class="btn apms-button apms-button--quiet clinic-print-class-btn${selected ? ' clinic-print-class-btn--current' : ''}" onclick="openClinicCenter('${safeClassId}')">
                <span class="clinic-print-class-btn__name">${clinicPrintEscapeHtml(cls.name || '반 이름 없음')}</span>
                <span class="clinic-print-class-btn__meta">${clinicPrintEscapeHtml(meta || '반 정보 없음')}</span>
            </button>
        `;
    }).join('');

    showModal('클리닉 반 선택', `
        <div class="clinic-print-class-list">
            ${classRows}
        </div>
    `);
}

function clinicPrintOpenSimilarMenu(classId = '') {
    const hasClassId = !!String(classId || '').trim();

    if (hasClassId) {
        if (typeof openClinicSimilarForClass === 'function') {
            openClinicSimilarForClass(classId);
            return;
        }
        if (typeof openClinicBasketForClass === 'function') {
            openClinicBasketForClass(classId);
            return;
        }
        toast('준비 중입니다.', 'info');
        return;
    }

    if (typeof openClinicBasket === 'function') {
        openClinicBasket();
        return;
    }

    toast('준비 중입니다.', 'info');
}

function clinicPrintGetExamListScope() {
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    if (mode === 'grade') return 'grade';
    if (mode === 'type') return (document.getElementById('clinic-print-type-scope')?.value || 'class') === 'grade' ? 'grade' : 'class';
    return 'class';
}

function clinicPrintGetExamPeriod(group = {}) {
    // The paper's academic period is independent of the day students submitted OMR.
    const source = [group.archiveFile, group.examTitle].filter(Boolean).join(' ');
    const path = source.match(/(?:^|\/)([12])(mid|final)(?:\/|$)/i);
    if (path) return path[1] + path[2].toLowerCase();
    const semester = source.match(/([12])\s*학기/);
    const kind = /중간/.test(source) ? 'mid' : /기말/.test(source) ? 'final' : '';
    if (semester && kind) return semester[1] + kind;
    for (const assignment of group.assignments || []) {
        try {
            const payload = JSON.parse(assignment.mixed_payload_json || '{}');
            const meta = payload.meta || {};
            const term = String(meta.semester || '').replace(/\D/g, '');
            const exam = String(meta.examType || meta.exam_type || '');
            const type = /^(mid|중간)$/.test(exam) ? 'mid' : /^(final|기말)$/.test(exam) ? 'final' : '';
            if (/^[12]$/.test(term) && type) return term + type;
        } catch (error) { /* Legacy assignments can have no saved paper metadata. */ }
    }
    return 'other';
}

function clinicPrintGetExamPeriodFilter(classId) {
    const key = String(classId);
    if (clinicPrintExamPeriodFilters.has(key)) return clinicPrintExamPeriodFilters.get(key);
    let stored = '';
    try { stored = localStorage.getItem(`AP_CLINIC_EXAM_PERIOD:${key}`) || ''; } catch (error) {}
    const groups = clinicPrintGetClassExamGroups(classId, 'grade');
    const month = new Date().getMonth() + 1;
    const current = month <= 5 ? '1mid' : month <= 7 ? '1final' : month <= 10 ? '2mid' : '2final';
    const value = AP_CLINIC_EXAM_PERIODS.some(([id]) => id === stored) ? stored
        : groups.some(group => clinicPrintGetExamPeriod(group) === current) ? current
        : groups.length ? clinicPrintGetExamPeriod(groups[0]) : 'all';
    clinicPrintExamPeriodFilters.set(key, value);
    return value;
}

function clinicPrintRenderExamPeriodFilters(classId, scope = 'class') {
    const year = clinicPrintGetExamYearFilter(classId);
    const groups = clinicPrintGetClassExamGroups(classId, scope)
        .filter(group => year === 'all' || clinicPrintGetExamYear(group) === year);
    const selected = clinicPrintGetExamPeriodFilter(classId);
    const safeClassId = clinicPrintEscapeJsString(classId);
    return AP_CLINIC_EXAM_PERIODS.map(([period, label]) => {
        const count = groups.filter(group => period === 'all' || clinicPrintGetExamPeriod(group) === period).length;
        if (period === 'other' && !count && selected !== 'other') return '';
        return `<button type="button" class="clinic-print-period-card${selected === period ? ' clinic-print-period-card--active' : ''}" data-exam-period="${period}" aria-pressed="${selected === period}" onclick="clinicPrintSetExamPeriodFilter('${safeClassId}','${period}')"><span>${label}</span><small>${count}개</small></button>`;
    }).join('');
}

function clinicPrintGetExamYear(group = {}) {
    for (const value of [String(group.archiveFile || '').split(/[\\/]/).pop(), group.examTitle]) {
        const match = String(value || '').match(/^(20\d{2}|\d{2})(?=[_\s])/);
        if (match) return match[1].length === 2 ? '20' + match[1] : match[1];
    }
    return String(group.examDate || '').slice(0, 4);
}

function clinicPrintGetExamYearFilter(classId) {
    const key = String(classId);
    if (clinicPrintExamYearFilters.has(key)) return clinicPrintExamYearFilters.get(key);
    let stored = '';
    try { stored = localStorage.getItem(`AP_CLINIC_EXAM_YEAR:${key}`) || ''; } catch (error) {}
    const groups = clinicPrintGetClassExamGroups(classId, 'grade');
    const period = clinicPrintGetExamPeriodFilter(classId);
    const matching = groups.filter(group => period === 'all' || clinicPrintGetExamPeriod(group) === period);
    const years = [...new Set((matching.length ? matching : groups).map(clinicPrintGetExamYear).filter(year => /^20\d{2}$/.test(year)))].sort().reverse();
    const value = stored === 'all' || /^20\d{2}$/.test(stored) ? stored : years[0] || 'all';
    clinicPrintExamYearFilters.set(key, value);
    return value;
}

function clinicPrintRenderExamYearOptions(classId) {
    const selected = clinicPrintGetExamYearFilter(classId);
    const years = [...new Set(clinicPrintGetClassExamGroups(classId, 'grade').map(clinicPrintGetExamYear).filter(year => /^20\d{2}$/.test(year)))].sort().reverse();
    if (selected !== 'all' && !years.includes(selected)) years.unshift(selected);
    return ['all', ...years].map(year => `<option value="${year}"${year === selected ? ' selected' : ''}>${year === 'all' ? '전체 연도' : year + '년'}</option>`).join('');
}

function clinicPrintSetExamYearFilter(classId, year) {
    if (year !== 'all' && !/^20\d{2}$/.test(year)) return;
    clinicPrintExamYearFilters.set(String(classId), year);
    try { localStorage.setItem(`AP_CLINIC_EXAM_YEAR:${classId}`, year); } catch (error) {}
    clinicPrintUpdateExamList(classId);
    clinicPrintOnExamChange(classId);
}

function clinicPrintSetExamPeriodFilter(classId, period) {
    if (!AP_CLINIC_EXAM_PERIODS.some(([id]) => id === period)) return;
    clinicPrintExamPeriodFilters.set(String(classId), period);
    try { localStorage.setItem(`AP_CLINIC_EXAM_PERIOD:${classId}`, period); } catch (error) {}
    clinicPrintUpdateExamList(classId);
    clinicPrintOnExamChange(classId);
}

function clinicPrintRenderExamListHtml(classId, scope = 'class') {
    if (scope === 'grade' && clinicPrintGradeDataUnavailable(classId)) {
        return `<div class="clinic-print-empty">${clinicPrintEscapeHtml(clinicPrintGetGradeDataMessage(classId))}</div>`;
    }
    const period = clinicPrintGetExamPeriodFilter(classId);
    const year = clinicPrintGetExamYearFilter(classId);
    const groups = clinicPrintGetClassExamGroups(classId, scope)
        .filter(group => (period === 'all' || clinicPrintGetExamPeriod(group) === period) && (year === 'all' || clinicPrintGetExamYear(group) === year));
    const printableGroups = groups.filter(group => group.printable);
    const currentClassPrintableGroups = printableGroups.filter(group => (group.sourceClassIds || []).map(String).includes(String(classId)));
    const initialSource = scope === 'grade' ? printableGroups : (currentClassPrintableGroups.length ? currentClassPrintableGroups : printableGroups);
    const groupKeys = new Set(groups.map(group => group.examKey));
    const currentChecked = new Set(clinicPrintGetCheckedValues('clinic-print-exam').filter(key => groupKeys.has(key)));
    const initialKeys = currentChecked.size ? currentChecked : new Set(scope === 'grade'
        ? initialSource.map(group => group.examKey) : (initialSource.length ? [initialSource[0].examKey] : []));
    const safeClassIdForJs = clinicPrintEscapeJsString(classId);

    if (!groups.length) return '<div class="clinic-print-empty">선택한 기간의 시험이 없습니다. 다른 기간 또는 전체를 선택하세요.</div>';

    return groups.map(group => {
        const disabled = group.printable ? '' : 'disabled';
        const checked = initialKeys.has(group.examKey) ? 'checked' : '';
        const safeExamKey = clinicPrintEscapeJsString(group.examKey || '');
        const displayTitle = clinicPrintGetExamGroupDisplayTitle(group);
        // 학년 행은 여러 반/날짜를 합친 통계다. 개별 시험 삭제는 반 범위에서 처리한다.
        const currentClassAssignment = scope === 'class' ? (group.assignments || [])
            .find(row => String(row.class_id || '') === String(classId || '') && row.can_manage !== false) : null;
        const deleteDisplay = currentClassAssignment ? '' : ' style="--clinic-print-delete-display:none;"';
        const status = group.printable
            ? `${group.questionCount || '-'}문항 · 제출 ${group.sessions.length}명 · 오답 ${group.wrongCount}문항`
            : '원문 연결 불가';
        const metaCls = group.printable ? 'clinic-print-exam-row__meta' : 'clinic-print-exam-row__meta clinic-print-exam-row__meta--error';
        return `
            <label class="clinic-print-exam-row${group.printable ? '' : ' clinic-print-exam-row--disabled'}"${deleteDisplay}>
                <input type="checkbox" class="clinic-print-exam-row__check" name="clinic-print-exam" value="${clinicPrintEscapeAttr(group.examKey)}" ${checked} ${disabled} onchange="clinicPrintOnExamChange('${safeClassIdForJs}')">
                <span class="clinic-print-exam-row__main">
                    <span class="clinic-print-exam-row__title">${clinicPrintEscapeHtml(displayTitle)}</span>
                    <span class="${metaCls}">${clinicPrintEscapeHtml(status)}</span>
                </span>
                <button type="button" class="btn apms-button apms-button--quiet btn-danger clinic-print-exam-row__delete" title="시험 삭제" onclick="event.preventDefault(); event.stopPropagation(); clinicPrintDeleteExamGroup('${safeClassIdForJs}','${safeExamKey}')">삭제</button>
            </label>
        `;
    }).join('');
}

function clinicPrintUpdateExamList(classId) {
    const root = document.getElementById('clinic-print-exam-list');
    if (!root) return;
    root.innerHTML = clinicPrintRenderExamListHtml(classId, clinicPrintGetExamListScope());
    const gradeWindow = document.getElementById('clinic-print-grade-window');
    if (gradeWindow) {
        gradeWindow.hidden = clinicPrintGetExamListScope() !== 'grade';
        gradeWindow.innerHTML = clinicPrintEscapeHtml(clinicPrintGetGradeDataMessage(classId)) +
            (clinicPrintGradeData.get(String(classId))?.status === 'error'
                ? ` <button type="button" class="clinic-print-mini-btn" onclick="clinicPrintRetryGradeData('${clinicPrintEscapeJsString(classId)}')">다시 불러오기</button>` : '');
    }
    const filters = document.getElementById('clinic-print-exam-period-filters');
    if (filters) filters.innerHTML = clinicPrintRenderExamPeriodFilters(classId, clinicPrintGetExamListScope());
    const year = document.getElementById('clinic-print-exam-year');
    if (year) year.innerHTML = clinicPrintRenderExamYearOptions(classId);
}

async function openClinicPrintCenter(classId, options = {}) {
    const previousClassId = String(clinicPrintActiveClassId || '');
    if (previousClassId !== String(classId || '')) {
        for (const assessmentState of clinicPrintRecommendationAssessmentStates.values()) {
            assessmentState.attemptComparisonSelections = new Map();
        }
    }
    clinicPrintActiveClassId = classId;
    if (clinicPrintAssessmentFormValues.classId !== String(classId || '')) {
        clinicPrintAssessmentFormValues = {
            classId: String(classId || ''),
            title: clinicPrintGetAssessmentDefaultTitle(classId),
            examDate: clinicPrintGetAssessmentDateToday()
        };
    }
    clinicPrintResetRecommendationState('class', classId);
    clinicPrintTypeState.unitSelection = [];
    clinicPrintTypeState.dragKey = null;
    const cls = clinicPrintGetClass(classId);
    if (!options.skipAssignmentRefresh) {
        await clinicPrintRefreshClassAssignments(classId);
        await clinicPrintRefreshGradeClinicData(classId);
    }
    const safeClassIdForJs = clinicPrintEscapeJsString(classId);
    const examHtml = clinicPrintRenderExamListHtml(classId, 'class');

    showModal('오답 클리닉 출력 센터', `
        <div class="clinic-print-layout">
        <div class="clinic-print-layout__controls">
        <div class="clinic-print-shell">
            <div class="clinic-print-summary-card">
                <div class="clinic-print-summary-card__title">${clinicPrintEscapeHtml(cls?.name || '반')}</div>
                <div id="clinic-print-summary" class="clinic-print-summary-card__meta">선택 시험 0개 · 오답 학생 0명 · 오답 0문항</div>
            </div>

            <section class="clinic-print-section">
                <div class="clinic-print-section-title">출제 기준</div>
                <div id="clinic-print-mode-cards" class="clinic-print-mode-grid">
                    <label class="clinic-print-mode-card clinic-print-mode-card--active" data-mode="student">
                        <input type="radio" class="clinic-print-mode-card__radio" name="clinic-print-mode" value="student" checked onchange="clinicPrintSwitchMode('${safeClassIdForJs}')">
                        <span class="clinic-print-mode-card__title">학생</span>
                        <span class="clinic-print-mode-card__sub">학생별 오답</span>
                    </label>
                    <label class="clinic-print-mode-card" data-mode="class">
                        <input type="radio" class="clinic-print-mode-card__radio" name="clinic-print-mode" value="class" onchange="clinicPrintSwitchMode('${safeClassIdForJs}')">
                        <span class="clinic-print-mode-card__title">반</span>
                        <span class="clinic-print-mode-card__sub">반별 공통 오답</span>
                    </label>
                    <label class="clinic-print-mode-card" data-mode="grade">
                        <input type="radio" class="clinic-print-mode-card__radio" name="clinic-print-mode" value="grade" onchange="clinicPrintSwitchMode('${safeClassIdForJs}')">
                        <span class="clinic-print-mode-card__title">학년</span>
                        <span class="clinic-print-mode-card__sub">학년별 공통 오답</span>
                    </label>
                    <label class="clinic-print-mode-card" data-mode="type">
                        <input type="radio" class="clinic-print-mode-card__radio" name="clinic-print-mode" value="type" onchange="clinicPrintSwitchMode('${safeClassIdForJs}')">
                        <span class="clinic-print-mode-card__title">유형</span>
                        <span class="clinic-print-mode-card__sub">최다빈출·단원별</span>
                    </label>
                </div>
            </section>

            <section class="clinic-print-section">
                <div id="clinic-print-grade-window" class="clinic-print-note" aria-live="polite" hidden></div>
                <div class="clinic-print-period-heading">
                    <div class="clinic-print-section-title">학기별 시험 선택</div>
                    <select id="clinic-print-exam-year" aria-label="시험 연도" onchange="clinicPrintSetExamYearFilter('${safeClassIdForJs}',this.value)">${clinicPrintRenderExamYearOptions(classId)}</select>
                </div>
                <div id="clinic-print-exam-period-filters" class="clinic-print-period-grid" role="group" aria-label="학기별 시험 필터">${clinicPrintRenderExamPeriodFilters(classId, 'class')}</div>
                <div class="clinic-print-section-head">
                    <div class="clinic-print-section-title">시험 목록</div>
                    <button type="button" class="clinic-print-mini-btn" onclick="document.querySelectorAll('input[name=\\'clinic-print-exam\\']:not(:disabled)').forEach(el=>el.checked=true); clinicPrintOnExamChange('${safeClassIdForJs}');">전체 선택</button>
                </div>
                <div id="clinic-print-exam-list" class="clinic-print-exam-list">${examHtml}</div>
            </section>

            <section id="clinic-print-type-panel" class="clinic-print-type-panel" style="display:none;">
                <input type="hidden" id="clinic-print-type-mode" value="frequent">
                <input type="hidden" id="clinic-print-type-scope" value="class">

                <div class="clinic-print-field">
                    <div class="clinic-print-section-title">범위</div>
                    <div id="clinic-print-type-scope-toggle" class="clinic-print-scope-grid">
                        <button type="button" class="clinic-print-scope-btn clinic-print-scope-btn--active" data-scope="class" onclick="clinicPrintSetTypeScope('${safeClassIdForJs}','class')">현재 반</button>
                        <button type="button" class="clinic-print-scope-btn" data-scope="grade" onclick="clinicPrintSetTypeScope('${safeClassIdForJs}','grade')">같은 학년 전체</button>
                    </div>
                </div>

                <div class="clinic-print-field">
                    <div class="clinic-print-section-title">유형 선택</div>
                    <div id="clinic-print-type-cards" class="clinic-print-type-grid">
                        <button type="button" class="clinic-print-type-card clinic-print-type-card--active" data-type-mode="frequent" onclick="clinicPrintSetTypeMode('${safeClassIdForJs}','frequent')">
                            <span class="clinic-print-type-card__title">최다빈출</span>
                            <span class="clinic-print-type-card__sub">정답률 50% 초과<br>반복 오답 문항</span>
                        </button>
                        <button type="button" class="clinic-print-type-card" data-type-mode="mostWrong" onclick="clinicPrintSetTypeMode('${safeClassIdForJs}','mostWrong')">
                            <span class="clinic-print-type-card__title">최다오답</span>
                            <span class="clinic-print-type-card__sub">정답률 50% 이하<br>다수 취약 문항</span>
                        </button>
                        <button type="button" class="clinic-print-type-card" data-type-mode="unit" onclick="clinicPrintSetTypeMode('${safeClassIdForJs}','unit')">
                            <span class="clinic-print-type-card__title">단원별 오답</span>
                            <span class="clinic-print-type-card__sub">마스터 단원 기준<br>선택 출력</span>
                        </button>
                    </div>
                </div>

                <div id="clinic-print-type-result"></div>
            </section>

            <section id="clinic-print-student-section" class="clinic-print-section">
                <div class="clinic-print-section-head">
                    <div class="clinic-print-section-title">출제할 학생 선택</div>
                    <div class="clinic-print-mini-btn-group">
                        <button type="button" class="clinic-print-mini-btn" onclick="clinicPrintSetAllRecipients('${safeClassIdForJs}',true)">전체 선택</button>
                        <button type="button" class="clinic-print-mini-btn" onclick="clinicPrintSetAllRecipients('${safeClassIdForJs}',false)">전체 해제</button>
                    </div>
                </div>
                <div id="clinic-print-student-list" class="clinic-print-student-list"></div>
            </section>

            <section id="clinic-print-recommendation-section" class="clinic-print-section" style="border:1px solid var(--border);border-radius:12px;padding:12px;">
                <div class="clinic-print-section-head">
                    <div class="clinic-print-section-title">유사 문항 추천</div>
                    <span class="clinic-print-section-title--soft">학생별 후보</span>
                </div>
                <div id="clinic-print-recommendation-options">${clinicPrintRenderRecommendationOptions(classId)}</div>
                <div id="clinic-print-recommendation-body"></div>
            </section>

            <section id="clinic-print-recommendation-assessment-section" class="clinic-print-section" style="border:1px solid var(--border);border-radius:12px;padding:12px;">
                <div class="clinic-print-section-head">
                    <div class="clinic-print-section-title">선택 추천 문항으로 시험 배정</div>
                    <span class="clinic-print-section-title--soft">유형 보충 시험 · 다른 문항 적용</span>
                </div>
                <div class="clinic-print-note">체크한 추천 문항만 일반 시험으로 배정합니다. 결과는 기존 시험 응시·OMR 기록에 연결됩니다. 학생별 문항 구성이 다르면 별도 시험으로 묶고, 50문항을 넘으면 나누어 배정합니다. 미확정 배정 확인은 기존 기록만 조회하며 새 배정을 만들지 않습니다.${clinicPrintGetClassGrade(classId) ? '' : ' 반 학년을 확인할 수 없어 시험 배정은 사용할 수 없습니다. 반 정보를 확인해 주세요.'}</div>
                <label class="clinic-print-header-field" style="margin-top:9px;">
                    <span>시험 제목</span>
                    <input id="clinic-print-recommendation-assessment-title" class="clinic-print-header-input" type="text" maxlength="100" value="${clinicPrintEscapeAttr(clinicPrintAssessmentFormValues.classId === String(classId) ? clinicPrintAssessmentFormValues.title : clinicPrintGetAssessmentDefaultTitle(classId))}" oninput="clinicPrintOnRecommendationAssessmentFormChange('${safeClassIdForJs}')">
                </label>
                <label class="clinic-print-header-field" style="margin-top:8px;">
                    <span>시험 날짜</span>
                    <input id="clinic-print-recommendation-assessment-date" class="clinic-print-header-input" type="date" value="${clinicPrintEscapeAttr(clinicPrintAssessmentFormValues.classId === String(classId) ? clinicPrintAssessmentFormValues.examDate : clinicPrintGetAssessmentDateToday())}" oninput="clinicPrintOnRecommendationAssessmentFormChange('${safeClassIdForJs}')">
                </label>
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
                    <button id="clinic-print-recommendation-assessment-submit" type="button" class="btn apms-button apms-button--primary btn-primary" onclick="clinicPrintCreateRecommendationAssessment('${safeClassIdForJs}')">선택 문항 시험 배정</button>
                    <button id="clinic-print-recommendation-assessment-refresh" type="button" class="clinic-print-mini-btn" onclick="clinicPrintRefreshRecommendationAssessment('${safeClassIdForJs}')">기존 배정·응시 결과 새로고침</button>
                    <button id="clinic-print-recommendation-assessment-reconcile" type="button" class="clinic-print-mini-btn" onclick="clinicPrintReconcileRecommendationAssessment('${safeClassIdForJs}')">미확정 배정 확인</button>
                </div>
                <div id="clinic-print-recommendation-assessment-body" style="margin-top:9px;"></div>
            </section>

            <section class="clinic-print-section clinic-print-header-card">
                <input type="hidden" id="clinic-print-header-title-dirty" value="0">
                <div class="clinic-print-section-title">인쇄 설정</div>
                <label class="clinic-print-header-field">
                    <span>제목</span>
                    <input id="clinic-print-header-title" class="clinic-print-header-input" type="text" maxlength="80" value="${clinicPrintEscapeAttr(clinicPrintGetHeaderDefaultTitle(classId))}" oninput="clinicPrintSetHeaderTitleDirty(true)">
                </label>
                <label class="clinic-print-header-field">
                    <span>부제목 <span class="clinic-print-section-title--soft">(비우면 반·시험 자동 입력)</span></span>
                    <input id="clinic-print-header-subtitle" class="clinic-print-header-input" type="text" maxlength="120" placeholder="선택 입력">
                </label>
                <div class="clinic-print-note">제목·보조 문구는 우측 미리보기 헤더를 직접 클릭해서도 수정할 수 있어요. 이름·점수·날짜는 1페이지 헤더에 자동 입력되고, 2페이지부터는 작은 이름표가 붙습니다.</div>
                <div class="clinic-print-header-checks">
                    <label><input id="clinic-print-header-name" type="checkbox" checked> 이름칸</label>
                    <label><input id="clinic-print-header-score" type="checkbox" checked> 점수칸</label>
                    <label><input id="clinic-print-header-date" type="checkbox"> 날짜</label>
                    <label><input id="clinic-print-header-sol" type="checkbox" checked> 해설지 포함</label>
                    <label><input id="clinic-print-header-ans" type="checkbox" checked> 정답표 포함</label>
                </div>
            </section>

            <div class="clinic-print-actions">
                <button id="clinic-print-preview-btn" type="button" class="btn apms-button apms-button--quiet clinic-print-submit" onclick="clinicPrintPreview('${safeClassIdForJs}')">미리보기</button>
                <button id="clinic-print-submit-btn" type="button" class="btn apms-button apms-button--primary btn-primary clinic-print-submit" onclick="clinicPrintSubmit('${safeClassIdForJs}')">출제하기</button>
            </div>
        </div>
        </div>
        <div class="clinic-print-layout__preview" aria-label="출력 미리보기">
            <iframe id="clinic-print-preview-frame" title="출력 미리보기" src="wrong_print_engine.html?preview=1"></iframe>
        </div>
        </div>
    `);

    document.getElementById('modal-content')?.classList.add('clinic-print-fullscreen');
    clinicPrintRenderRecommendationPanel(classId);
    clinicPrintRenderRecommendationAssessmentPanel(classId);
    document.getElementById('clinic-print-preview-frame')?.addEventListener('load', () => {
        clinicPrintSchedulePreviewPush(classId, 0);
    });
    document.querySelectorAll('#clinic-print-header-title, #clinic-print-header-subtitle').forEach(input => {
        input.addEventListener('input', () => clinicPrintSchedulePreviewPush(classId));
    });
    document.querySelectorAll('#clinic-print-header-name, #clinic-print-header-score, #clinic-print-header-date, #clinic-print-header-sol, #clinic-print-header-ans').forEach(input => {
        input.addEventListener('change', () => clinicPrintSchedulePreviewPush(classId));
    });
    setTimeout(() => clinicPrintSwitchMode(classId), 0);
}
