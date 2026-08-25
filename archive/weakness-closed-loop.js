(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.ArchiveWeaknessClosedLoop = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const CONTRACT_VERSION = 'archive-weakness-closed-loop-v1';
    const CANONICAL_UID_RE = /^qid_v1_[0-9a-f]{64}$/;

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function positiveInteger(value, fallback = null) {
        const number = Number(value);
        return Number.isInteger(number) && number > 0 ? number : fallback;
    }

    function sourceFileOf(row) {
        return text(row?.sourceFile || row?.sourceArchiveFile || row?.source_archive_file || row?._sourceFile);
    }

    function sourceUidOf(row) {
        return text(row?.questionUid || row?.question_uid || row?._sourceQuestionUid || row?.source_question_uid);
    }

    function sourceOrdinalOf(row) {
        return positiveInteger(row?.sourceOrdinal || row?.sourceQuestionOrdinal || row?.source_question_ordinal || row?._sourceQuestionOrdinal);
    }

    function sourceQuestionNoOf(row) {
        return positiveInteger(row?.sourceQuestionNo || row?.source_question_no || row?._sourceQuestionNo || row?.questionNo || row?.question_no || row?.id);
    }

    function metadataOf(row) {
        return {
            standardUnitKey: text(row?.standardUnitKey || row?.standard_unit_key),
            standardUnit: text(row?.standardUnit || row?.standard_unit),
            standardCourse: text(row?.standardCourse || row?.standard_course),
            subUnitKey: text(row?.subUnitKey || row?.sub_unit_key),
            conceptClusterKey: text(row?.conceptClusterKey || row?.concept_cluster_key),
            problemTypeKey: text(row?.problemTypeKey || row?.problem_type_key || row?.typeKey || row?.type_key),
            templateKey: text(row?.templateKey || row?.template_key),
            difficultyBucket: text(row?.difficultyBucket || row?.difficulty_bucket || row?.difficulty || row?.level),
        };
    }

    function buildMixedPayload(selected, { mixedKey = 'phase5-closed-loop', title = 'Phase 5 보충시험 fixture' } = {}) {
        const source = Array.isArray(selected) ? selected : [];
        const errors = [];
        const questions = source.map((row, index) => {
            const questionUid = sourceUidOf(row);
            const sourceFile = sourceFileOf(row);
            const sourceOrdinal = sourceOrdinalOf(row);
            const sourceQuestionNo = sourceQuestionNoOf(row) || sourceOrdinal;
            if (!CANONICAL_UID_RE.test(questionUid)) errors.push(`question ${index + 1}: canonical UID is missing or invalid`);
            if (!sourceFile) errors.push(`question ${index + 1}: source archive file is missing`);
            if (!sourceOrdinal) errors.push(`question ${index + 1}: source ordinal is missing`);
            const metadata = metadataOf(row);
            return {
                ...row,
                id: index + 1,
                questionUid,
                _sourceFile: sourceFile,
                _sourceQuestionUid: questionUid,
                _sourceQuestionOrdinal: sourceOrdinal,
                _sourceQuestionNo: sourceQuestionNo,
                ...metadata,
            };
        });
        const key = text(mixedKey);
        if (!key) errors.push('mixed key is required');
        const payload = {
            archiveFile: key ? `MIXED:${key}` : '',
            questions,
            meta: {
                title: text(title) || 'Phase 5 보충시험 fixture',
                source: 'weakness-supplement-preset',
                contractVersion: CONTRACT_VERSION,
            },
        };
        return { ok: errors.length === 0, errors, payload };
    }

    function buildBlueprintRows(payload) {
        const archiveFile = text(payload?.archiveFile);
        const questions = Array.isArray(payload?.questions) ? payload.questions : [];
        return questions.map((question, index) => {
            const metadata = metadataOf(question);
            return {
                archive_file: archiveFile,
                question_no: index + 1,
                source_archive_file: sourceFileOf(question),
                source_question_no: sourceQuestionNoOf(question),
                source_question_uid: sourceUidOf(question),
                source_question_ordinal: sourceOrdinalOf(question),
                standard_unit_key: metadata.standardUnitKey,
                standard_unit: metadata.standardUnit,
                standard_course: metadata.standardCourse,
                sub_unit_key: metadata.subUnitKey,
                concept_cluster_key: metadata.conceptClusterKey,
                type_key: metadata.problemTypeKey,
                template_key: metadata.templateKey,
                difficulty: metadata.difficultyBucket,
                metadata_revision: text(question?.metadataRevision || question?.metadata_revision) || 'archive-metadata-v1',
            };
        });
    }

    function buildAssessmentResultItems({ blueprintRows = [], sessionId = 'phase5-session', studentId = 'phase5-student', wrongQuestionNos = [], resultAt = '2026-08-25T00:00:00.000Z' } = {}) {
        const wrongSet = new Set((Array.isArray(wrongQuestionNos) ? wrongQuestionNos : []).map(value => positiveInteger(value)).filter(Boolean));
        return (Array.isArray(blueprintRows) ? blueprintRows : []).map((blueprint, index) => {
            const orderNo = positiveInteger(blueprint?.question_no, index + 1);
            const isWrong = wrongSet.has(orderNo);
            return {
                session_id: text(sessionId),
                student_id: text(studentId),
                order_no: orderNo,
                question_no: orderNo,
                result_status: isWrong ? 'wrong' : 'correct',
                is_correct: isWrong ? 0 : 1,
                source_archive_file: text(blueprint?.source_archive_file),
                source_question_no: positiveInteger(blueprint?.source_question_no),
                standard_unit_key: text(blueprint?.standard_unit_key),
                sub_unit_key: text(blueprint?.sub_unit_key),
                concept_cluster_key: text(blueprint?.concept_cluster_key),
                type_key: text(blueprint?.type_key),
                template_key: text(blueprint?.template_key),
                difficulty: text(blueprint?.difficulty),
                created_at: text(resultAt),
            };
        });
    }

    function selectorReplay({ preset, selector, candidates }) {
        const errors = [];
        const selected = [];
        const requests = Array.isArray(preset?.selectorRequests) ? preset.selectorRequests : [];
        if (!selector || typeof selector.selectCandidates !== 'function') errors.push('selector contract is unavailable');
        for (const row of requests) {
            const used = new Set(selected.map(item => sourceUidOf(item)));
            const pool = (Array.isArray(candidates) ? candidates : []).filter(item => !used.has(sourceUidOf(item)));
            const request = row?.selectorRequest || {};
            const result = selector.selectCandidates(pool, request, { selectionSeed: request.selectionSeed });
            if (!result?.ok) {
                errors.push(`${text(row?.dimension)}:${text(row?.targetKey)} selector failed: ${(result?.errors || []).join(', ') || 'unknown error'}`);
                continue;
            }
            if (result.selected.length !== Number(row.requestedCount)) errors.push(`${text(row?.dimension)}:${text(row?.targetKey)} selected count mismatch`);
            selected.push(...result.selected);
        }
        const uids = selected.map(sourceUidOf);
        if (new Set(uids).size !== uids.length) errors.push('closed-loop selection contains duplicate canonical UIDs');
        return { ok: errors.length === 0, errors, selected };
    }

    function runClosedLoop({ preset, selector, candidates = [], wrongQuestionNos = [], priorAssessmentResultItems = [], priorBlueprintRows = [], identityRecords = [], indexRecords = [], sessions = [], joiner, aggregator, sessionId = 'phase5-session', studentId = 'phase5-student', resultAt = '2026-08-25T00:00:00.000Z', asOf = resultAt } = {}) {
        const errors = [];
        if (!preset || preset.status !== 'candidate_non_operational') errors.push('supplement preset is not an eligible candidate');
        const replay = selectorReplay({ preset, selector, candidates });
        errors.push(...replay.errors);
        const mixed = buildMixedPayload(replay.selected, { mixedKey: `phase5-${text(sessionId) || 'closed-loop'}` });
        errors.push(...mixed.errors);
        const blueprints = buildBlueprintRows(mixed.payload);
        const resultItems = buildAssessmentResultItems({ blueprintRows: blueprints, sessionId, studentId, wrongQuestionNos, resultAt });
        const assessmentResultItems = [...(Array.isArray(priorAssessmentResultItems) ? priorAssessmentResultItems : []), ...resultItems];
        let joined = [];
        let weakness = null;
        if (!joiner || typeof joiner.joinWrongItems !== 'function') errors.push('weakness metadata join contract is unavailable');
        else joined = joiner.joinWrongItems({ assessmentResultItems, blueprintRows: [...(Array.isArray(priorBlueprintRows) ? priorBlueprintRows : []), ...blueprints], identityRecords, indexRecords, sessions });
        if (joined.some(row => !row.questionUid)) errors.push('result item could not recover canonical UID from blueprint');
        if (!aggregator || typeof aggregator.aggregateWeakness !== 'function') errors.push('weakness aggregator contract is unavailable');
        else weakness = aggregator.aggregateWeakness(joined, { asOf, recoveryCapable: true, sourceMode: 'assessment_result_items' });
        const omr = {
            archive_file: mixed.payload.archiveFile,
            question_count: blueprints.length,
            wrong_ids: (Array.isArray(wrongQuestionNos) ? wrongQuestionNos : []).map(value => positiveInteger(value)).filter(Boolean),
            session_id: text(sessionId),
            writeMode: 'fixture_only',
        };
        return {
            contractVersion: CONTRACT_VERSION,
            status: errors.length === 0 ? 'CLOSED_LOOP_PASS_NON_OPERATIONAL' : 'CLOSED_LOOP_FAIL',
            operationalExposure: 'HOLD',
            writes: 0,
            networkCalls: 0,
            preset,
            replay: { ok: replay.ok, errors: replay.errors, selectedCount: replay.selected.length, selectedUids: replay.selected.map(sourceUidOf) },
            mixed: { ok: mixed.ok, archiveFile: mixed.payload.archiveFile, questionCount: mixed.payload.questions.length, payload: mixed.payload },
            blueprints: { count: blueprints.length, rows: blueprints },
            omr,
            result: { count: resultItems.length, wrongCount: resultItems.filter(row => row.result_status === 'wrong').length, rows: resultItems },
            join: { count: joined.length, resolvedCount: joined.filter(row => Boolean(row.questionUid)).length, rows: joined },
            weakness,
            errors: Array.from(new Set(errors)),
        };
    }

    return { CONTRACT_VERSION, CANONICAL_UID_RE, buildMixedPayload, buildBlueprintRows, buildAssessmentResultItems, selectorReplay, runClosedLoop };
}));
