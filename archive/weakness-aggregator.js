(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.ArchiveWeaknessAggregator = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const CONTRACT_VERSION = 'archive-weakness-aggregator-v1';
    const RECENCY_WEIGHTS = Object.freeze([
        { maxDays: 14, weight: 1.00 },
        { maxDays: 30, weight: 0.85 },
        { maxDays: 60, weight: 0.65 },
        { maxDays: 90, weight: 0.45 },
        { maxDays: Infinity, weight: 0.30 },
    ]);
    const DIFFICULTY_WEIGHTS = Object.freeze({
        하: 1.30,
        중: 1.15,
        상: 1.00,
        basic: 1.30,
        standard: 1.15,
        advanced: 1.00,
        challenge: 0.85,
    });

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function parseDate(value) {
        const time = Date.parse(text(value));
        return Number.isFinite(time) ? time : null;
    }

    function recencyWeight(resultAt, asOfTime) {
        const time = parseDate(resultAt);
        if (time == null || time > asOfTime) return 1;
        const days = Math.max(0, (asOfTime - time) / 86400000);
        return RECENCY_WEIGHTS.find(row => days <= row.maxDays)?.weight || 0.30;
    }

    function difficultyWeight(value) {
        return DIFFICULTY_WEIGHTS[text(value).toLowerCase()] || 1.00;
    }

    function groupKey(row, dimension) {
        if (dimension === 'concept') return text(row.conceptClusterKey) || text(row.subUnitKey) || text(row.standardUnitKey) || 'UNSPECIFIED';
        if (dimension === 'problemType') return text(row.problemTypeKey) || 'UNSPECIFIED';
        if (dimension === 'template') return text(row.templateKey) || 'UNSPECIFIED';
        return text(row.standardUnitKey) || 'UNSPECIFIED';
    }

    function groupKeySource(row, dimension) {
        if (dimension === 'concept') {
            if (text(row.conceptClusterKey)) return 'conceptClusterKey';
            if (text(row.subUnitKey)) return 'subUnitKey';
            if (text(row.standardUnitKey)) return 'standardUnitKey';
            return 'unspecified';
        }
        if (dimension === 'problemType') return text(row.problemTypeKey) ? 'problemTypeKey' : 'unspecified';
        if (dimension === 'template') return text(row.templateKey) ? 'templateKey' : 'unspecified';
        return text(row.standardUnitKey) ? 'standardUnitKey' : 'unspecified';
    }

    function sortRows(rows) {
        return rows.slice().sort((a, b) => parseDate(a.resultAt) - parseDate(b.resultAt) || String(a.questionUid || '').localeCompare(String(b.questionUid || '')));
    }

    function summarize(rows, key, dimension) {
        const attempts = rows.length;
        const wrongRows = rows.filter(row => row.resultStatus === 'wrong' || Number(row.isCorrect) === 0);
        const correctRows = rows.filter(row => row.resultStatus === 'correct' || Number(row.isCorrect) === 1);
        const ordered = sortRows(rows);
        let recoveredWrongCount = 0;
        wrongRows.forEach(wrong => {
            const wrongTime = parseDate(wrong.resultAt);
            const laterCorrect = ordered.some(correct => {
                if (!(correct.resultStatus === 'correct' || Number(correct.isCorrect) === 1)) return false;
                const correctTime = parseDate(correct.resultAt);
                return correctTime != null && (wrongTime == null || correctTime > wrongTime);
            });
            if (laterCorrect) recoveredWrongCount += 1;
        });
        const latestAt = ordered.reduce((latest, row) => {
            const time = parseDate(row.resultAt);
            return time != null && (latest == null || time > latest) ? time : latest;
        }, null);
        const asOfTime = rows._asOfTime;
        const weightedWrongRate = attempts ? wrongRows.length / attempts : 0;
        const latestRecency = latestAt == null ? 1 : recencyWeight(new Date(latestAt).toISOString(), asOfTime);
        const repeatedFailureWeight = 1 + Math.min(0.75, Math.max(0, wrongRows.length - 1) * 0.25);
        const difficultyAdjustment = wrongRows.length
            ? wrongRows.reduce((sum, row) => sum + difficultyWeight(row.difficultyBucket), 0) / wrongRows.length
            : 1;
        const recoveryCapable = rows._recoveryCapable !== false;
        const recoveryRate = wrongRows.length ? recoveredWrongCount / wrongRows.length : 0;
        const recoveryFactor = recoveryCapable ? 1 - Math.min(0.80, recoveryRate * 0.50) : 1;
        const keySources = Array.from(new Set(rows.map(row => groupKeySource(row, dimension))));
        return {
            key,
            keySource: keySources.length === 1 ? keySources[0] : 'mixed',
            attemptCount: attempts,
            wrongCount: wrongRows.length,
            correctCount: correctRows.length,
            recoveredWrongCount,
            weightedWrongRate,
            recencyWeight: latestRecency,
            repeatedFailureWeight,
            difficultyAdjustment,
            recoveryRate,
            recoveryFactor,
            recoveryStatus: recoveryCapable ? 'available' : 'limited_fallback',
            weaknessScore: weightedWrongRate * latestRecency * repeatedFailureWeight * difficultyAdjustment * recoveryFactor,
            latestResultAt: latestAt == null ? '' : new Date(latestAt).toISOString(),
        };
    }

    function aggregateWeakness(rows, { asOf = new Date().toISOString(), recoveryCapable = true, sourceMode = 'assessment_result_items' } = {}) {
        const list = Array.isArray(rows) ? rows.filter(Boolean) : [];
        const asOfTime = parseDate(asOf) ?? Date.now();
        const dimensions = { concept: new Map(), problemType: new Map(), template: new Map(), standardUnit: new Map() };
        for (const dimension of Object.keys(dimensions)) {
            for (const row of list) {
                const key = groupKey(row, dimension);
                if (!dimensions[dimension].has(key)) dimensions[dimension].set(key, []);
                dimensions[dimension].get(key).push(row);
            }
        }
        const output = {};
        for (const [dimension, groups] of Object.entries(dimensions)) {
            output[dimension] = [...groups.entries()]
                .map(([key, group]) => { group._asOfTime = asOfTime; group._recoveryCapable = recoveryCapable; return summarize(group, key, dimension); })
                .filter(row => row.attemptCount > 0)
                .sort((a, b) => b.weaknessScore - a.weaknessScore || a.key.localeCompare(b.key, 'en'));
        }
        return {
            contractVersion: CONTRACT_VERSION,
            sourceMode,
            recoveryCapable,
            asOf: new Date(asOfTime).toISOString(),
            itemCount: list.length,
            wrongItemCount: list.filter(row => row.resultStatus === 'wrong' || Number(row.isCorrect) === 0).length,
            groups: output,
        };
    }

    return { CONTRACT_VERSION, RECENCY_WEIGHTS, DIFFICULTY_WEIGHTS, aggregateWeakness };
}));
