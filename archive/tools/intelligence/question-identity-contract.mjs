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
