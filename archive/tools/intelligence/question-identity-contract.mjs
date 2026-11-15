/**
 * Canonical question lookup contract.
 *
 * Consumers must resolve in this order:
 *   1. questionUid
 *   2. sourceArchiveFile + sourceOrdinal
 *   3. sourceArchiveFile + legacy sourceQuestionNo, only if unambiguous
 *
 * An ambiguous legacy id is deliberately never resolved to the first match.
 */

function normalizeSourceFile(value) {
    return String(value || '')
        .normalize('NFC')
        .replace(/\\/g, '/')
        .replace(/^exams\//, '')
        .replace(/^\.\//, '')
        .trim();
}

function positiveInteger(value) {
    const number = Number(value);
    return Number.isInteger(number) && number > 0 ? number : null;
}

function pickReferenceValue(reference, names) {
    for (const name of names) {
        const value = reference?.[name];
        if (value !== undefined && value !== null && String(value).trim() !== '') return value;
    }
    return null;
}

function resolved(status, questionUid, tuple, candidates = []) {
    return {
        status,
        questionUid,
        sourceArchiveFile: tuple.sourceArchiveFile,
        sourceOrdinal: tuple.sourceOrdinal,
        sourceQuestionNo: tuple.sourceQuestionNo,
        candidates
    };
}

function unresolved(status, candidates = []) {
    return {
        status,
        questionUid: null,
        sourceArchiveFile: null,
        sourceOrdinal: null,
        sourceQuestionNo: null,
        candidates
    };
}

export function normalizeIdentityReference(reference = {}) {
    return {
        questionUid: pickReferenceValue(reference, ['questionUid', 'question_uid', 'sourceQuestionUid', 'source_question_uid']),
        sourceArchiveFile: normalizeSourceFile(pickReferenceValue(reference, ['sourceArchiveFile', 'source_archive_file', 'sourceFile', '_sourceFile']) || ''),
        sourceOrdinal: positiveInteger(pickReferenceValue(reference, ['sourceOrdinal', 'source_ordinal', 'sourceQuestionOrdinal', 'source_question_ordinal'])),
        sourceQuestionNo: pickReferenceValue(reference, ['sourceQuestionNo', 'source_question_no', 'legacyQuestionNo', 'legacy_question_no', 'questionId', 'question_id', 'id'])
    };
}

export function createQuestionIdentityResolver(identityMap) {
    if (!identityMap || identityMap.schemaVersion !== 'question-identity-map-v1') {
        throw new Error('question-identity-map-v1 is required');
    }
    const byQuestionUid = identityMap.lookup?.byQuestionUid || {};
    const bySourceFileAndOrdinal = identityMap.lookup?.bySourceFileAndOrdinal || {};
    const bySourceFileAndQuestionNo = identityMap.lookup?.bySourceFileAndQuestionNo || {};

    return {
        resolve(reference = {}) {
            const normalized = normalizeIdentityReference(reference);
            if (normalized.questionUid) {
                const tuple = byQuestionUid[normalized.questionUid];
                return tuple
                    ? resolved('RESOLVED_CANONICAL_UID', normalized.questionUid, tuple)
                    : unresolved('UNKNOWN_QUESTION_UID');
            }

            if (normalized.sourceArchiveFile && normalized.sourceOrdinal) {
                const questionUid = bySourceFileAndOrdinal[normalized.sourceArchiveFile]?.[String(normalized.sourceOrdinal)];
                const tuple = questionUid ? byQuestionUid[questionUid] : null;
                return tuple
                    ? resolved('RESOLVED_SOURCE_ORDINAL', questionUid, tuple)
                    : unresolved('UNKNOWN_SOURCE_ORDINAL');
            }

            if (normalized.sourceArchiveFile && normalized.sourceQuestionNo !== null) {
                const candidates = bySourceFileAndQuestionNo[normalized.sourceArchiveFile]?.[String(normalized.sourceQuestionNo)] || [];
                if (candidates.length === 1) {
                    const questionUid = candidates[0];
                    return resolved('RESOLVED_LEGACY_UNAMBIGUOUS', questionUid, byQuestionUid[questionUid]);
                }
                if (candidates.length > 1) return unresolved('AMBIGUOUS_LEGACY_REFERENCE', candidates);
                return unresolved('UNKNOWN_LEGACY_REFERENCE');
            }

            return unresolved('INSUFFICIENT_IDENTITY_REFERENCE');
        }
    };
}

// Some original JS banks retained a display alias in questionUid before canonical
// UIDs existed. Only the historical "source basename|positive question number"
// form is eligible for this adapter. The resolver above deliberately continues
// to reject an unknown explicit UID; callers must opt into this narrower proof.
export function isUnambiguousLegacySourceUidAlias({ question, sourceArchiveFile, sourceOrdinal, identityRecord, identityMap, bank }) {
    if (identityMap?.schemaVersion !== 'question-identity-map-v1' || !Array.isArray(identityMap.records) ||
        !Array.isArray(bank) || !Number.isInteger(sourceOrdinal) || sourceOrdinal < 1 || sourceOrdinal > bank.length ||
        typeof sourceArchiveFile !== 'string' || !sourceArchiveFile.endsWith('.js') ||
        typeof question?.questionUid !== 'string' || !identityRecord?.questionUid ||
        identityRecord.sourceArchiveFile !== sourceArchiveFile || identityRecord.sourceOrdinal !== sourceOrdinal) return false;
    const number = String(question.sourceQuestionNo ?? question.sourceQid ?? question.id ?? '');
    if (!/^[1-9]\d*$/.test(number) || !Number.isSafeInteger(Number(number)) ||
        String(identityRecord.sourceQuestionNo) !== number ||
        question.questionUid !== sourceArchiveFile.split('/').at(-1).slice(0, -3) + '|' + number) return false;
    const boundQuestion = bank[sourceOrdinal - 1];
    if (boundQuestion?.questionUid !== question.questionUid) return false;
    for (const candidate of [question, boundQuestion]) {
        if (Object.hasOwn(candidate, 'sourceOrdinal') && candidate.sourceOrdinal !== sourceOrdinal) return false;
        for (const key of ['id', 'number', 'sourceQuestionNo', 'sourceQid'])
            if (Object.hasOwn(candidate, key) && String(candidate[key]) !== number) return false;
    }
    if (bank.filter(q => String(q.sourceQuestionNo ?? q.sourceQid ?? q.id ?? '') === number).length !== 1 ||
        bank.filter(q => q.questionUid === question.questionUid).length !== 1) return false;
    const sourceRows = identityMap.records.filter(r => r.sourceArchiveFile === sourceArchiveFile);
    if (identityMap.records.filter(r => r.questionUid === identityRecord.questionUid).length !== 1 ||
        sourceRows.filter(r => r.sourceOrdinal === sourceOrdinal).length !== 1 ||
        sourceRows.filter(r => String(r.sourceQuestionNo) === number).length !== 1) return false;
    const record = sourceRows.find(r => r.sourceOrdinal === sourceOrdinal);
    const legacyKey = sourceArchiveFile + '_' + number;
    const legacyUids = identityMap.lookup?.byLegacyQKey?.[legacyKey];
    if (record.questionUid !== identityRecord.questionUid || String(record.sourceQuestionNo) !== number ||
        record.legacyQKey !== legacyKey || identityRecord.legacyQKey !== legacyKey ||
        !Array.isArray(legacyUids) || legacyUids.length !== 1 || legacyUids[0] !== record.questionUid) return false;
    try {
        const resolver = createQuestionIdentityResolver(identityMap);
        const references = [
            [{ questionUid: record.questionUid }, 'RESOLVED_CANONICAL_UID'],
            [{ sourceArchiveFile, sourceOrdinal }, 'RESOLVED_SOURCE_ORDINAL'],
            [{ sourceArchiveFile, sourceQuestionNo: number }, 'RESOLVED_LEGACY_UNAMBIGUOUS'],
        ];
        return references.every(([reference, status]) => {
            const result = resolver.resolve(reference);
            return result.status === status && result.questionUid === record.questionUid &&
                result.sourceArchiveFile === sourceArchiveFile && result.sourceOrdinal === sourceOrdinal &&
                String(result.sourceQuestionNo) === number;
        });
    } catch { return false; }
}
