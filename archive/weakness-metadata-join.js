(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.ArchiveWeaknessMetadataJoin = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const CONTRACT_VERSION = 'archive-weakness-metadata-join-v1';
    const CANONICAL_UID_RE = /^qid_v1_[0-9a-f]{64}$/;
    const TYPE_FIELDS = ['problemTypeKey', 'typeKey', 'type_key'];
    const SOURCE_FIELDS = ['sourceArchiveFile', 'source_archive_file', 'archiveFile', 'archive_file'];
    const ORDINAL_FIELDS = ['sourceQuestionOrdinal', 'source_question_ordinal', 'sourceOrdinal', 'source_ordinal'];
    const NUMBER_FIELDS = ['sourceQuestionNo', 'source_question_no', 'questionNo', 'question_no', 'questionId', 'question_id'];

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function firstText(row, fields) {
        for (const field of fields) {
            const value = text(row && row[field]);
            if (value) return value;
        }
        return '';
    }

    function firstNumber(row, fields) {
        for (const field of fields) {
            const value = Number(row && row[field]);
            if (Number.isInteger(value) && value > 0) return value;
        }
        return null;
    }

    function normalizeSourceFile(value) {
        return text(value)
            .replace(/\\/g, '/')
            .replace(/^\.\//, '')
            .replace(/^https?:\/\/[^/]+\/archive\//i, '')
            .replace(/^archive\//, '')
            .replace(/^exams\//, '');
    }

    function canonicalUid(value) {
        const uid = text(value);
        return CANONICAL_UID_RE.test(uid) ? uid : '';
    }

    function mapRows(rows, keyFactory) {
        const map = new Map();
        for (const row of Array.isArray(rows) ? rows : []) {
            const key = keyFactory(row);
            if (key) map.set(key, row);
        }
        return map;
    }

    function sourceKeys(row) {
        const source = normalizeSourceFile(firstText(row, SOURCE_FIELDS));
        if (!source) return [];
        const ordinal = firstNumber(row, ORDINAL_FIELDS);
        const number = firstNumber(row, NUMBER_FIELDS);
        return [
            ordinal ? `${source}#ordinal:${ordinal}` : '',
            number ? `${source}#number:${number}` : '',
        ].filter(Boolean);
    }

    function buildContext({ identityRecords = [], blueprintRows = [], indexRecords = [] } = {}) {
        const identityBySource = new Map();
        for (const record of Array.isArray(identityRecords) ? identityRecords : []) {
            const source = normalizeSourceFile(record.sourceArchiveFile || record.source_archive_file);
            const ordinal = firstNumber(record, ['sourceOrdinal', 'source_ordinal']);
            const number = firstNumber(record, ['sourceQuestionNo', 'source_question_no']);
            if (!source) continue;
            const uid = canonicalUid(record.questionUid || record.question_uid);
            if (!uid) continue;
            if (ordinal) identityBySource.set(`${source}#ordinal:${ordinal}`, record);
            if (number) identityBySource.set(`${source}#number:${number}`, record);
        }
        const blueprintBySource = mapRows(blueprintRows, row => sourceKeys(row)[0] || '');
        for (const row of Array.isArray(blueprintRows) ? blueprintRows : []) {
            for (const key of sourceKeys(row)) blueprintBySource.set(key, row);
            const archive = normalizeSourceFile(row.archiveFile || row.archive_file);
            const number = firstNumber(row, ['questionNo', 'question_no']);
            if (archive && number) blueprintBySource.set(`${archive}#number:${number}`, row);
        }
        const indexBySource = mapRows(indexRecords, row => sourceKeys(row)[0] || '');
        for (const row of Array.isArray(indexRecords) ? indexRecords : []) {
            for (const key of sourceKeys(row)) indexBySource.set(key, row);
        }
        return { identityBySource, blueprintBySource, indexBySource };
    }

    function metadataFrom(row) {
        if (!row) return {};
        return {
            standardUnitKey: text(row.standardUnitKey || row.standard_unit_key),
            subUnitKey: text(row.subUnitKey || row.sub_unit_key),
            conceptClusterKey: text(row.conceptClusterKey || row.concept_cluster_key),
            problemTypeKey: firstText(row, TYPE_FIELDS),
            templateKey: text(row.templateKey || row.template_key),
            difficultyBucket: text(row.difficultyBucket || row.difficulty_bucket || row.difficulty || row.level),
        };
    }

    function mergeMetadata(...rows) {
        const output = {};
        for (const row of rows) {
            const metadata = metadataFrom(row);
            for (const [key, value] of Object.entries(metadata)) if (!output[key] && value) output[key] = value;
        }
        return output;
    }

    function sessionArchiveFile(item, sessionsById) {
        const sessionId = text(item && (item.sessionId || item.session_id));
        const session = sessionsById.get(sessionId) || {};
        return normalizeSourceFile(firstText(item, SOURCE_FIELDS) || firstText(session, SOURCE_FIELDS));
    }

    function resolveReference(item, { context, sessionsById = new Map() } = {}) {
        const direct = canonicalUid(item && (item.questionUid || item.question_uid || item.sourceQuestionUid || item.source_question_uid));
        const source = sessionArchiveFile(item, sessionsById);
        const ordinal = firstNumber(item, ORDINAL_FIELDS);
        const number = firstNumber(item, NUMBER_FIELDS);
        const keys = [
            ordinal && source ? `${source}#ordinal:${ordinal}` : '',
            number && source ? `${source}#number:${number}` : '',
        ].filter(Boolean);
        const blueprint = keys.map(key => context.blueprintBySource.get(key)).find(Boolean) || null;
        const identity = direct
            ? { questionUid: direct, source: 'direct_uid' }
            : (blueprint && canonicalUid(blueprint.sourceQuestionUid || blueprint.source_question_uid)
                ? { questionUid: canonicalUid(blueprint.sourceQuestionUid || blueprint.source_question_uid), source: 'blueprint_uid' }
                : (keys.map(key => context.identityBySource.get(key)).find(Boolean)
                    ? { questionUid: canonicalUid(keys.map(key => context.identityBySource.get(key)).find(Boolean).questionUid), source: 'identity_map' }
                    : null));
        const index = keys.map(key => context.indexBySource.get(key)).find(Boolean) || null;
        return {
            questionUid: identity?.questionUid || '',
            resolution: identity?.source || 'unresolved',
            sourceArchiveFile: source || normalizeSourceFile(firstText(blueprint || index, SOURCE_FIELDS)),
            sourceQuestionOrdinal: ordinal || firstNumber(blueprint || index, ORDINAL_FIELDS),
            sourceQuestionNo: number || firstNumber(blueprint || index, NUMBER_FIELDS),
            blueprint,
            identity,
            index,
        };
    }

    function enrichRow(item, options = {}) {
        const context = options.context || buildContext(options);
        const sessionsById = options.sessionsById || new Map();
        const reference = resolveReference(item, { context, sessionsById });
        const session = sessionsById.get(text(item && (item.sessionId || item.session_id))) || {};
        const metadata = mergeMetadata(item, reference.blueprint, reference.index);
        return {
            contractVersion: CONTRACT_VERSION,
            sessionId: text(item && (item.sessionId || item.session_id)),
            studentId: text(item && (item.studentId || item.student_id)) || text(session.studentId || session.student_id),
            resultAt: firstText(item, ['resultAt', 'result_at', 'examDate', 'exam_date', 'createdAt', 'created_at']) || firstText(session, ['examDate', 'exam_date', 'createdAt', 'created_at']),
            resultStatus: text(item && (item.resultStatus || item.result_status)) || (Number(item?.isCorrect ?? item?.is_correct) === 0 ? 'wrong' : Number(item?.isCorrect ?? item?.is_correct) === 1 ? 'correct' : 'unchecked'),
            isCorrect: item?.isCorrect ?? item?.is_correct ?? null,
            ...reference,
            ...metadata,
        };
    }

    function joinWrongItems({ assessmentResultItems = [], wrongAnswers = [], sessions = [], blueprintRows = [], identityRecords = [], indexRecords = [] } = {}) {
        const sessionsById = new Map((Array.isArray(sessions) ? sessions : []).map(row => [text(row.id || row.sessionId || row.session_id), row]));
        const context = buildContext({ identityRecords, blueprintRows, indexRecords });
        const resultRows = Array.isArray(assessmentResultItems) && assessmentResultItems.length
            ? assessmentResultItems
            : (Array.isArray(wrongAnswers) ? wrongAnswers : []);
        return resultRows.map(item => enrichRow(item, { context, sessionsById }));
    }

    return { CONTRACT_VERSION, CANONICAL_UID_RE, normalizeSourceFile, buildContext, resolveReference, enrichRow, joinWrongItems };
}));
