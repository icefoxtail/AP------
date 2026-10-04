(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.ArchiveMixerSelector = factory();
    }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const CONTRACT_VERSION = 'archive-mixer-selector-v1';
    const CANONICAL_UID_RE = /^qid_v1_[0-9a-f]{64}$/;

    const REASON_KEYS = [
        'invalid_identity',
        'duplicate_uid',
        'grade',
        'subject',
        'course',
        'unit',
        'sub_unit',
        'concept',
        'problem_type',
        'difficulty',
        'school',
        'year',
        'recent',
        'source_file',
        'tags'
    ];

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function key(value) {
        return text(value).toLowerCase();
    }

    function list(value) {
        if (value == null || value === '') return [];
        const values = Array.isArray(value) ? value : [value];
        return values.map(text).filter(Boolean);
    }

    function keySet(value) {
        return new Set(list(value).map(key));
    }

    function unique(values) {
        return Array.from(new Set(values));
    }

    function firstValue(candidate, names) {
        for (const name of names) {
            const value = candidate && candidate[name];
            if (value != null && text(value)) return value;
        }
        return '';
    }

    function valuesOf(candidate, names) {
        for (const name of names) {
            const value = candidate && candidate[name];
            if (value == null || value === '') continue;
            return Array.isArray(value) ? value.map(text).filter(Boolean) : [text(value)];
        }
        return [];
    }

    function canonicalUidOf(candidate) {
        return text(firstValue(candidate, ['questionUid', 'question_uid', 'uid', 'canonicalUid']));
    }

    function sourceFileOf(candidate) {
        return text(firstValue(candidate, ['sourceFile', 'sourceArchiveFile', 'source_archive_file', '_sourceFile']));
    }

    function sourceOrdinalOf(candidate) {
        const value = firstValue(candidate, ['sourceOrdinal', 'sourceQuestionOrdinal', 'source_question_ordinal', '_sourceQuestionOrdinal']);
        const ordinal = Number(value);
        return Number.isInteger(ordinal) && ordinal > 0 ? ordinal : null;
    }

    function normalizeRequest(input) {
        const source = input && typeof input === 'object' ? input : {};
        const count = Number(source.count);
        const errors = [];
        if (!Number.isInteger(count) || count <= 0) errors.push('count must be a positive integer');

        const yearFrom = source.yearFrom == null || source.yearFrom === '' ? null : Number(source.yearFrom);
        const yearTo = source.yearTo == null || source.yearTo === '' ? null : Number(source.yearTo);
        if (yearFrom != null && !Number.isFinite(yearFrom)) errors.push('yearFrom must be numeric');
        if (yearTo != null && !Number.isFinite(yearTo)) errors.push('yearTo must be numeric');
        if (yearFrom != null && yearTo != null && yearFrom > yearTo) errors.push('yearFrom must not exceed yearTo');

        const minUnitOrder = source.minUnitOrder == null || source.minUnitOrder === '' ? null : Number(source.minUnitOrder);
        const maxUnitOrder = source.maxUnitOrder == null || source.maxUnitOrder === '' ? null : Number(source.maxUnitOrder);
        const maxTemplateCount = source.maxTemplateCount == null || source.maxTemplateCount === '' ? null : Number(source.maxTemplateCount);
        const essayCount = source.essayCount == null || source.essayCount === '' ? null : Number(source.essayCount);
        if (minUnitOrder != null && !Number.isFinite(minUnitOrder)) errors.push('minUnitOrder must be numeric');
        if (maxUnitOrder != null && !Number.isFinite(maxUnitOrder)) errors.push('maxUnitOrder must be numeric');
        if (minUnitOrder != null && maxUnitOrder != null && minUnitOrder > maxUnitOrder) errors.push('minUnitOrder must not exceed maxUnitOrder');
        if (maxTemplateCount != null && (!Number.isInteger(maxTemplateCount) || maxTemplateCount < 1)) errors.push('maxTemplateCount must be a positive integer');
        if (essayCount != null && (!Number.isInteger(essayCount) || essayCount < 0)) errors.push('essayCount must be a non-negative integer');

        return {
            count,
            grades: keySet(source.grades ?? source.grade),
            subjects: keySet(source.subjects ?? source.subject),
            courses: keySet(source.courses ?? source.course),
            unitKeys: keySet(source.unitKeys ?? source.standardUnitKeys ?? source.standardUnitKey),
            subUnitKeys: keySet(source.subUnitKeys ?? source.subUnitKey),
            conceptKeys: keySet(source.conceptKeys ?? source.conceptClusterKeys ?? source.conceptClusterKey),
            problemTypeKeys: keySet(source.problemTypeKeys ?? source.problemTypeKey ?? source.typeKeys),
            difficulties: keySet(source.difficulties ?? source.difficultyBuckets ?? source.difficultyBucket ?? source.level),
            includeSchools: keySet(source.includeSchools ?? source.schools ?? source.school),
            excludeSchools: keySet(source.excludeSchools),
            includeSourceFiles: keySet(source.includeSourceFiles),
            excludeSourceFiles: keySet(source.excludeSourceFiles),
            excludeYears: keySet(source.excludeYears),
            recentQuestionUids: keySet(source.recentQuestionUids ?? source.excludeQuestionUids),
            tagsAll: keySet(source.tagsAll ?? source.tags),
            yearFrom,
            yearTo,
            minUnitOrder,
            maxUnitOrder,
            maxTemplateCount,
            essayCount,
            errors
        };
    }

    function validateSelectionRequest(input) {
        const request = normalizeRequest(input);
        return {
            contractVersion: CONTRACT_VERSION,
            ok: request.errors.length === 0,
            errors: request.errors.slice(),
            request
        };
    }

    function candidateIdentity(candidate) {
        const questionUid = canonicalUidOf(candidate);
        const sourceFile = sourceFileOf(candidate);
        const sourceOrdinal = sourceOrdinalOf(candidate);
        return {
            questionUid,
            sourceFile,
            sourceOrdinal,
            valid: CANONICAL_UID_RE.test(questionUid) && Boolean(sourceFile) && sourceOrdinal != null
        };
    }

    function scalarMatches(candidate, names, allowed) {
        if (!allowed.size) return true;
        const values = valuesOf(candidate, names).map(key);
        return values.some(value => allowed.has(value));
    }

    function numericYear(candidate) {
        const value = firstValue(candidate, ['year', 'examYear', 'sourceYear']);
        const match = text(value).match(/(?:19|20)\d{2}/);
        return match ? Number(match[0]) : null;
    }

    function numericUnitOrder(candidate) {
        const value = firstValue(candidate, ['unitOrder', 'standardUnitOrder']);
        const order = Number(value);
        return Number.isFinite(order) ? order : null;
    }

    function isEssayCandidate(candidate) {
        const type = key(firstValue(candidate, ['problemTypeKey', 'typeKey', 'problemType']));
        const tags = valuesOf(candidate, ['tags']).map(key);
        return type.includes('서술') || type.includes('논술') || tags.some(tag => tag.includes('서술') || tag.includes('논술'));
    }

    function matchesRequest(candidate, request) {
        const reasons = [];
        const identity = candidateIdentity(candidate);
        if (!identity.valid) reasons.push('invalid_identity');
        if (!scalarMatches(candidate, ['grade'], request.grades)) reasons.push('grade');
        if (!scalarMatches(candidate, ['subject', 'rawSubject'], request.subjects)) reasons.push('subject');
        if (!scalarMatches(candidate, ['course', 'standardCourse'], request.courses)) reasons.push('course');
        if (!scalarMatches(candidate, ['standardUnitKey', 'unitKey'], request.unitKeys)) reasons.push('unit');
        if (!scalarMatches(candidate, ['subUnitKey'], request.subUnitKeys)) reasons.push('sub_unit');
        if (!scalarMatches(candidate, ['conceptClusterKey', 'conceptKey'], request.conceptKeys)) reasons.push('concept');
        if (!scalarMatches(candidate, ['problemTypeKey', 'typeKey', 'problemType'], request.problemTypeKeys)) reasons.push('problem_type');
        if (!scalarMatches(candidate, ['difficultyBucket', 'difficulty', 'normalizedLevel', 'level'], request.difficulties)) reasons.push('difficulty');

        const school = key(firstValue(candidate, ['school', 'sourceSchool', 'sourceTitle']));
        if (request.includeSchools.size && !request.includeSchools.has(school)) reasons.push('school');
        if (request.excludeSchools.has(school)) reasons.push('school');

        const sourceFile = key(identity.sourceFile);
        if (request.includeSourceFiles.size && !request.includeSourceFiles.has(sourceFile)) reasons.push('source_file');
        if (request.excludeSourceFiles.has(sourceFile)) reasons.push('source_file');

        const year = numericYear(candidate);
        if (request.yearFrom != null && (year == null || year < request.yearFrom)) reasons.push('year');
        if (request.yearTo != null && (year == null || year > request.yearTo)) reasons.push('year');
        if (year != null && request.excludeYears.has(String(year))) reasons.push('year');

        if (request.minUnitOrder != null || request.maxUnitOrder != null) {
            const order = numericUnitOrder(candidate);
            if (order == null || (request.minUnitOrder != null && order < request.minUnitOrder) || (request.maxUnitOrder != null && order > request.maxUnitOrder)) reasons.push('unit');
        }

        if (request.recentQuestionUids.has(key(identity.questionUid))) reasons.push('recent');
        if (request.tagsAll.size) {
            const tags = new Set(valuesOf(candidate, ['tags']).map(key));
            if (!Array.from(request.tagsAll).every(tag => tags.has(tag))) reasons.push('tags');
        }
        return { identity, reasons: unique(reasons) };
    }

    function emptyReasonCounts() {
        return Object.fromEntries(REASON_KEYS.map(reason => [reason, 0]));
    }

    function hashSeed(seed, value) {
        let hash = 2166136261;
        const input = `${text(seed)}\u0000${text(value)}`;
        for (let index = 0; index < input.length; index += 1) {
            hash ^= input.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function asSet(value) {
        return value instanceof Set ? value : keySet(value);
    }

    function countFor(map, value) {
        if (!map) return 0;
        if (map instanceof Map) return Number(map.get(value) || 0);
        return Number(map[value] || 0);
    }

    /**
     * Rule-based score for Phase 3B/3C. It is intentionally deterministic and
     * has no model/network dependency; set-level counts are supplied by the
     * caller so the same candidate can be rescored as the set is assembled.
     */
    function scoreCandidate(candidate, context = {}) {
        const identity = candidateIdentity(candidate);
        const uid = key(identity.questionUid);
        const school = key(firstValue(candidate, ['school', 'sourceSchool', 'sourceTitle']));
        const sourceFile = key(identity.sourceFile);
        const template = key(firstValue(candidate, ['templateKey', 'template_key']));
        const problemType = key(firstValue(candidate, ['problemTypeKey', 'typeKey', 'problemType']));
        const difficulty = key(firstValue(candidate, ['difficultyBucket', 'difficulty', 'normalizedLevel', 'level']));
        const weights = { difficulty: 30, concept: 30, problemType: 20, school: 15, recentYear: 10, sourceDiversity: 10, templateRepeat: -35, schoolRepeat: -20, sourceRepeat: -20, typeRepeat: -10, recentlyUsed: -50, ...(context.weights || {}) };
        const breakdown = {};
        let score = 0;

        const add = (name, enabled, weight) => {
            if (!enabled) return;
            breakdown[name] = Number(weight);
            score += Number(weight);
        };
        add('difficulty', context.targetDifficulty != null && difficulty === key(context.targetDifficulty), weights.difficulty);
        add('concept', context.targetConceptKeys && scalarMatches(candidate, ['conceptClusterKey', 'conceptKey'], asSet(context.targetConceptKeys)), weights.concept);
        add('problemType', context.targetProblemTypeKeys && scalarMatches(candidate, ['problemTypeKey', 'typeKey', 'problemType'], asSet(context.targetProblemTypeKeys)), weights.problemType);
        add('school', context.targetSchool != null && school === key(context.targetSchool), weights.school);

        const year = numericYear(candidate);
        add('recentYear', context.recentYearFrom != null && year != null && year >= Number(context.recentYearFrom), weights.recentYear);
        add('sourceDiversity', sourceFile && countFor(context.sourceCounts, sourceFile) === 0, weights.sourceDiversity);
        add('templateRepeat', template && countFor(context.templateCounts, template) > 0, weights.templateRepeat);
        add('schoolRepeat', school && countFor(context.schoolCounts, school) > 0, weights.schoolRepeat);
        add('sourceRepeat', sourceFile && countFor(context.sourceCounts, sourceFile) > 0, weights.sourceRepeat);
        add('typeRepeat', problemType && key(context.lastProblemType) === problemType, weights.typeRepeat);
        add('recentlyUsed', uid && asSet(context.recentQuestionUids).has(uid), weights.recentlyUsed);

        return { score, breakdown, questionUid: identity.questionUid, tieBreak: hashSeed(context.selectionSeed || 'archive-mixer-selector-v1', identity.questionUid) };
    }

    function rankCandidates(candidates, context = {}) {
        return (Array.isArray(candidates) ? candidates : [])
            .map((candidate, index) => ({ candidate, index, scored: scoreCandidate(candidate, context) }))
            .sort((a, b) => b.scored.score - a.scored.score || a.scored.tieBreak - b.scored.tieBreak || a.scored.questionUid.localeCompare(b.scored.questionUid, 'en') || a.index - b.index)
            .map(item => ({ ...item.candidate, _selectorScore: item.scored.score, _selectorScoreBreakdown: item.scored.breakdown, _selectorTieBreak: item.scored.tieBreak }));
    }

    /**
     * Deterministic greedy set selection. It performs no random shuffle and
     * preserves the hard-constraint result when the requested count is met.
     */
    function selectCandidates(candidates, input, options = {}) {
        const hard = evaluateHardConstraints(candidates, input);
        const validation = validateSelectionRequest(input);
        if (!validation.ok) return { contractVersion: CONTRACT_VERSION, ok: false, errors: validation.errors, selected: [], diagnostics: hard.diagnostics };

        const request = validation.request;
        const selected = [];
        const selectedUids = new Set();
        const sourceCounts = new Map();
        const schoolCounts = new Map();
        const templateCounts = new Map();
        let lastProblemType = '';
        const selectionSeed = text(options.selectionSeed || 'archive-mixer-selector-v1');
        const scored = [];
        const available = hard.eligible.slice();

        while (selected.length < request.count && available.length) {
            const essaySelected = selected.filter(isEssayCandidate).length;
            const essayRemaining = request.essayCount == null ? null : request.essayCount - essaySelected;
            const slotsRemaining = request.count - selected.length;
            let eligibleForRound = available;
            if (essayRemaining != null && essayRemaining > 0 && slotsRemaining === essayRemaining) eligibleForRound = available.filter(isEssayCandidate);
            if (essayRemaining != null && essayRemaining <= 0) eligibleForRound = available.filter(candidate => !isEssayCandidate(candidate));
            eligibleForRound = eligibleForRound.filter(candidate => {
                if (request.maxTemplateCount == null) return true;
                const template = key(firstValue(candidate, ['templateKey', 'template_key']));
                return !template || countFor(templateCounts, template) < request.maxTemplateCount;
            });
            const ranked = rankCandidates(eligibleForRound, {
                ...options,
                selectionSeed,
                sourceCounts,
                schoolCounts,
                templateCounts,
                lastProblemType,
                recentQuestionUids: request.recentQuestionUids,
                targetDifficulty: options.targetDifficulty,
                targetConceptKeys: options.targetConceptKeys,
                targetProblemTypeKeys: options.targetProblemTypeKeys,
                targetSchool: options.targetSchool
            });
            const chosen = ranked[0];
            if (!chosen) break;
            const uid = canonicalUidOf(chosen);
            if (selectedUids.has(uid)) break;
            selected.push(chosen);
            selectedUids.add(uid);
            scored.push({ questionUid: uid, score: chosen._selectorScore, breakdown: chosen._selectorScoreBreakdown });
            const source = key(sourceFileOf(chosen));
            const school = key(firstValue(chosen, ['school', 'sourceSchool', 'sourceTitle']));
            const template = key(firstValue(chosen, ['templateKey', 'template_key']));
            const type = key(firstValue(chosen, ['problemTypeKey', 'typeKey', 'problemType']));
            if (source) sourceCounts.set(source, countFor(sourceCounts, source) + 1);
            if (school) schoolCounts.set(school, countFor(schoolCounts, school) + 1);
            if (template) templateCounts.set(template, countFor(templateCounts, template) + 1);
            lastProblemType = type;
            const chosenIndex = available.findIndex(candidate => canonicalUidOf(candidate) === uid);
            if (chosenIndex >= 0) available.splice(chosenIndex, 1);
        }

        const finalValidation = validateSelection(selected, input);
        return {
            contractVersion: CONTRACT_VERSION,
            ok: finalValidation.ok && hard.diagnostics.duplicateUids.length === 0,
            errors: finalValidation.errors,
            selected,
            diagnostics: {
                ...hard.diagnostics,
                selectedCount: selected.length,
                selectionSeed,
                scores: scored
            }
        };
    }

    function countValues(items, getter) {
        const counts = new Map();
        items.forEach(item => {
            const value = key(getter(item));
            if (!value) return;
            counts.set(value, (counts.get(value) || 0) + 1);
        });
        return Object.fromEntries(Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b, 'en')));
    }

    /**
     * Validate the assembled set after per-row selection. This is the Phase 3E
     * pre-print contract; it does not mutate the cart or candidates.
     */
    function validateBlueprintSet(selected, rows, options = {}) {
        const items = Array.isArray(selected) ? selected : [];
        const blueprintRows = Array.isArray(rows) ? rows : [];
        const expectedCount = blueprintRows.reduce((sum, row) => sum + Math.max(0, Number(row?.count) || 0), 0);
        const seen = new Set();
        const duplicateUids = [];
        let invalidUidCount = 0;
        items.forEach(item => {
            const identity = candidateIdentity(item);
            if (!identity.valid) { invalidUidCount += 1; return; }
            if (seen.has(identity.questionUid)) duplicateUids.push(identity.questionUid);
            seen.add(identity.questionUid);
        });
        const rowDistribution = blueprintRows.map((row, index) => {
            const requested = Math.max(0, Number(row?.count) || 0);
            const actual = items.filter(item => Number(item?._blueprintRowIndex) === index).length;
            return { rowIndex: index, requested, actual, ok: requested === actual };
        });
        const templateCounts = countValues(items, item => firstValue(item, ['templateKey', 'template_key']));
        const sourceCounts = countValues(items, item => sourceFileOf(item));
        const unitCounts = countValues(items, item => firstValue(item, ['standardUnitKey', 'unitKey']));
        const subUnitCounts = countValues(items, item => firstValue(item, ['subUnitKey']));
        const difficultyCounts = countValues(items, item => firstValue(item, ['difficultyBucket', 'difficulty', 'normalizedLevel', 'level']));
        const schoolCounts = countValues(items, item => firstValue(item, ['school', 'sourceSchool', 'sourceTitle']));
        const templateDuplicateCount = Object.values(templateCounts).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
        const sourceDuplicateCount = Object.values(sourceCounts).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
        const maxTemplateCount = options.maxTemplateCount == null || options.maxTemplateCount === '' ? null : Number(options.maxTemplateCount);
        const essayCount = options.essayCount == null || options.essayCount === '' ? null : Number(options.essayCount);
        const essayActual = items.filter(isEssayCandidate).length;
        const templateLimitOk = maxTemplateCount == null || Object.values(templateCounts).every(count => count <= maxTemplateCount);
        const essayCountOk = essayCount == null || essayActual === essayCount;
        const ok = items.length === expectedCount && invalidUidCount === 0 && duplicateUids.length === 0 && rowDistribution.every(row => row.ok) && templateLimitOk && essayCountOk;
        return {
            contractVersion: CONTRACT_VERSION,
            ok,
            expectedCount,
            actualCount: items.length,
            invalidUidCount,
            duplicateUids: unique(duplicateUids),
            rowDistribution,
            distributions: { unit: unitCounts, subUnit: subUnitCounts, difficulty: difficultyCounts, school: schoolCounts },
            templateCounts,
            sourceCounts,
            templateDuplicateCount,
            sourceDuplicateCount,
            limits: { maxTemplateCount, templateLimitOk, essayCount, essayActual, essayCountOk }
        };
    }

    /**
     * Apply only hard constraints. This function deliberately does not score,
     * shuffle, or truncate candidates; deterministic selection is Phase 3B.
     */
    function evaluateHardConstraints(candidates, input) {
        const validation = validateSelectionRequest(input);
        const pool = Array.isArray(candidates) ? candidates : [];
        if (!validation.ok) {
            return {
                contractVersion: CONTRACT_VERSION,
                ok: false,
                errors: validation.errors,
                eligible: [],
                diagnostics: { inputCount: pool.length, eligibleCount: 0, requestedCount: validation.request.count, shortfall: validation.request.count, rejectedByReason: emptyReasonCounts(), duplicateUids: [] }
            };
        }

        const request = validation.request;
        const seen = new Set();
        const eligible = [];
        const rejectedByReason = emptyReasonCounts();
        const duplicateUids = [];

        pool.forEach(candidate => {
            const result = matchesRequest(candidate, request);
            const uid = result.identity.questionUid;
            if (result.identity.valid && seen.has(uid)) {
                result.reasons.push('duplicate_uid');
                duplicateUids.push(uid);
            }
            if (result.identity.valid) seen.add(uid);
            if (result.reasons.length) {
                unique(result.reasons).forEach(reason => { rejectedByReason[reason] += 1; });
                return;
            }
            eligible.push(candidate);
        });

        const shortfall = Math.max(0, request.count - eligible.length);
        return {
            contractVersion: CONTRACT_VERSION,
            ok: duplicateUids.length === 0 && shortfall === 0,
            errors: duplicateUids.length ? ['candidate pool contains duplicate canonical UIDs'] : [],
            eligible,
            diagnostics: {
                inputCount: pool.length,
                eligibleCount: eligible.length,
                requestedCount: request.count,
                shortfall,
                rejectedByReason,
                duplicateUids: unique(duplicateUids)
            }
        };
    }

    function validateSelection(selected, input) {
        const validation = validateSelectionRequest(input);
        const items = Array.isArray(selected) ? selected : [];
        if (!validation.ok) return { contractVersion: CONTRACT_VERSION, ok: false, errors: validation.errors, diagnostics: { selectedCount: items.length, duplicateUids: [] } };

        const request = validation.request;
        const seen = new Set();
        const errors = [];
        const rejectedByReason = emptyReasonCounts();
        items.forEach(candidate => {
            const result = matchesRequest(candidate, request);
            const uid = result.identity.questionUid;
            if (result.identity.valid && seen.has(uid)) {
                result.reasons.push('duplicate_uid');
            }
            if (result.identity.valid) seen.add(uid);
            unique(result.reasons).forEach(reason => { rejectedByReason[reason] += 1; });
        });
        if (items.length !== request.count) errors.push(`selected count ${items.length} does not equal requested count ${request.count}`);
        if (rejectedByReason.invalid_identity) errors.push('selection contains invalid source identity');
        if (rejectedByReason.duplicate_uid) errors.push('selection contains duplicate canonical UID');
        if (Object.entries(rejectedByReason).some(([reason, count]) => count > 0 && !['invalid_identity', 'duplicate_uid'].includes(reason))) errors.push('selection violates hard constraints');
        if (request.essayCount != null && items.filter(isEssayCandidate).length !== request.essayCount) errors.push(`essay count does not equal requested count ${request.essayCount}`);
        return {
            contractVersion: CONTRACT_VERSION,
            ok: errors.length === 0,
            errors,
            diagnostics: { selectedCount: items.length, requestedCount: request.count, uniqueUidCount: seen.size, rejectedByReason, duplicateUids: Array.from(seen).filter(uid => items.filter(item => canonicalUidOf(item) === uid).length > 1) }
        };
    }

    return {
        CONTRACT_VERSION,
        CANONICAL_UID_RE,
        validateSelectionRequest,
        evaluateHardConstraints,
        validateSelection,
        scoreCandidate,
        rankCandidates,
        selectCandidates,
        validateBlueprintSet,
        candidateIdentity
    };
}));
