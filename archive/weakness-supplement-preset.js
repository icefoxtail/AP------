(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.ArchiveWeaknessSupplementPreset = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const CONTRACT_VERSION = 'archive-weakness-supplement-preset-v1';
    const DIMENSIONS = Object.freeze(['concept', 'problemType', 'template', 'standardUnit']);
    const DIMENSION_PRIORITY = Object.freeze({ concept: 1.00, problemType: 0.90, template: 0.80, standardUnit: 0.65 });
    const CANONICAL_UID_RE = /^qid_v1_[0-9a-f]{64}$/;

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function finiteNumber(value, fallback = 0) {
        const number = Number(value);
        return Number.isFinite(number) ? number : fallback;
    }

    function integer(value, fallback) {
        const number = Math.trunc(finiteNumber(value, fallback));
        return Number.isFinite(number) ? number : fallback;
    }

    function round(value, digits = 6) {
        const factor = 10 ** digits;
        return Math.round((finiteNumber(value) + Number.EPSILON) * factor) / factor;
    }

    function normalizeDimension(value) {
        const source = text(value);
        return DIMENSIONS.includes(source) ? source : '';
    }

    function hashSeed(value) {
        let hash = 2166136261;
        const source = text(value);
        for (let index = 0; index < source.length; index += 1) {
            hash ^= source.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0).toString(16).padStart(8, '0');
    }

    function groupsOf(input) {
        if (input?.groups && typeof input.groups === 'object') return input.groups;
        if (input?.weakness?.dimensions && typeof input.weakness.dimensions === 'object') return input.weakness.dimensions;
        return {};
    }

    function normalizeTarget(row, dimension, minScore) {
        const key = text(row?.key);
        const score = finiteNumber(row?.weaknessScore);
        if (!key || key === 'UNSPECIFIED' || score < minScore) return null;
        const recoveryStatus = text(row?.recoveryStatus) || 'limited_fallback';
        return {
            dimension,
            key,
            keySource: text(row?.keySource) || 'unknown',
            label: text(row?.label) || key,
            weaknessScore: round(score),
            priorityScore: round(score * (DIMENSION_PRIORITY[dimension] || 1)),
            attemptCount: Math.max(0, integer(row?.attemptCount, 0)),
            wrongCount: Math.max(0, integer(row?.wrongCount, 0)),
            recoveryStatus,
            latestResultAt: text(row?.latestResultAt),
        };
    }

    function collectTargets(input, { minScore, maxTargetsPerDimension }) {
        const groups = groupsOf(input);
        const targets = [];
        for (const dimension of DIMENSIONS) {
            const rows = Array.isArray(groups[dimension]) ? groups[dimension] : [];
            rows
                .map(row => normalizeTarget(row, dimension, minScore))
                .filter(Boolean)
                .sort((a, b) => b.priorityScore - a.priorityScore || b.weaknessScore - a.weaknessScore || a.key.localeCompare(b.key, 'en'))
                .slice(0, maxTargetsPerDimension)
                .forEach(target => targets.push(target));
        }
        return targets.sort((a, b) => b.priorityScore - a.priorityScore || a.dimension.localeCompare(b.dimension, 'en') || a.key.localeCompare(b.key, 'en'));
    }

    function allocateTargets(targets, count) {
        if (!targets.length || count <= 0) return [];
        const totalWeight = targets.reduce((sum, target) => sum + Math.max(0.000001, target.priorityScore), 0);
        const allocations = targets.map(target => ({
            target,
            raw: count * Math.max(0.000001, target.priorityScore) / totalWeight,
            count: 0,
        }));
        allocations.forEach(row => { row.count = Math.floor(row.raw); });
        let remaining = count - allocations.reduce((sum, row) => sum + row.count, 0);
        allocations
            .slice()
            .sort((a, b) => (b.raw - Math.floor(b.raw)) - (a.raw - Math.floor(a.raw)) || b.target.priorityScore - a.target.priorityScore || a.target.key.localeCompare(b.target.key, 'en'))
            .forEach(row => {
                if (remaining > 0) {
                    row.count += 1;
                    remaining -= 1;
                }
            });
        return allocations.filter(row => row.count > 0);
    }

    function requestForTarget(target, count, { seed, recentQuestionUids, maxTemplateCount }) {
        const request = {
            count,
            selectionSeed: `${seed}:${target.dimension}:${target.key}`,
            unitKeys: [],
            subUnitKeys: [],
            conceptKeys: [],
            problemTypeKeys: [],
            difficulties: [],
            recentQuestionUids: Array.isArray(recentQuestionUids) ? recentQuestionUids.map(text).filter(Boolean) : [],
            maxTemplateCount,
        };
        if (target.dimension === 'concept') {
            if (target.keySource === 'standardUnitKey') request.unitKeys = [target.key];
            else if (target.keySource === 'subUnitKey') request.subUnitKeys = [target.key];
            else request.conceptKeys = [target.key];
        }
        if (target.dimension === 'problemType') request.problemTypeKeys = [target.key];
        if (target.dimension === 'standardUnit') request.unitKeys = [target.key];
        // The current selector has no hard template-key filter. Keep the target
        // in provenance while limiting repeated templates during assembly.
        return request;
    }

    function buildSupplementPreset({ weaknessReport = {}, studentView = null, count = 10, minScore = 0.35, maxTargetsPerDimension = 3, recentQuestionUids = [], maxTemplateCount = 1, selectionSeed = '' } = {}) {
        const input = studentView || weaknessReport || {};
        const requestedCount = Math.max(1, Math.min(30, integer(count, 10)));
        const scoreFloor = Math.max(0, finiteNumber(minScore, 0.35));
        const targetLimit = Math.max(1, Math.min(10, integer(maxTargetsPerDimension, 3)));
        const targets = collectTargets(input, { minScore: scoreFloor, maxTargetsPerDimension: targetLimit });
        const seedSource = selectionSeed || `${text(input?.asOf) || 'unknown'}:${targets.map(target => `${target.dimension}:${target.key}:${target.weaknessScore}`).join('|')}`;
        const seed = `weakness-supplement-v1:${hashSeed(seedSource)}`;
        const allocations = allocateTargets(targets, requestedCount);
        const selectorRequests = allocations.map(({ target, count: allocatedCount }) => ({
            dimension: target.dimension,
            targetKey: target.key,
            targetLabel: target.label,
            requestedCount: allocatedCount,
            targetWeaknessScore: target.weaknessScore,
            selectorRequest: requestForTarget(target, allocatedCount, {
                seed,
                recentQuestionUids,
                maxTemplateCount: Math.max(1, integer(maxTemplateCount, 1)),
            }),
        }));
        const fallbackRecovery = input?.recoveryCapable === false
            || targets.some(target => target.recoveryStatus === 'limited_fallback');
        const status = selectorRequests.length ? 'candidate_non_operational' : 'blocked_no_eligible_targets';
        return {
            contractVersion: CONTRACT_VERSION,
            exposure: 'non_operational',
            status,
            readOnly: true,
            count: requestedCount,
            selectionSeed: seed,
            source: {
                contractVersion: text(input?.contractVersion),
                sourceMode: text(input?.sourceMode) || 'unknown',
                asOf: text(input?.asOf),
                recoveryStatus: fallbackRecovery ? 'limited_fallback' : 'available',
            },
            targets,
            selectorRequests,
            constraints: {
                canonicalUidRequired: true,
                dedupeAcrossRequestsBy: 'questionUid',
                preserveExistingWrongClinic: true,
                approvedMetadataOnly: true,
                maxTemplateCount: Math.max(1, integer(maxTemplateCount, 1)),
                noDbWrite: true,
                noStudentExposure: true,
            },
            roundtrip: {
                mixer: 'not_run',
                mixedEngine: 'not_run',
                omr: 'not_run',
                resultRecalculate: 'not_run',
            },
        };
    }

    function validatePreset(preset) {
        const source = preset && typeof preset === 'object' ? preset : {};
        const errors = [];
        if (source.contractVersion !== CONTRACT_VERSION) errors.push('contractVersion mismatch');
        if (source.exposure !== 'non_operational' || source.readOnly !== true) errors.push('preset must remain non-operational and read-only');
        if (!source.constraints?.canonicalUidRequired) errors.push('canonical UID constraint is required');
        if (source.constraints?.noDbWrite !== true || source.constraints?.noStudentExposure !== true) errors.push('operational writes/exposure must remain disabled');
        const requests = Array.isArray(source.selectorRequests) ? source.selectorRequests : [];
        const requestCount = requests.reduce((sum, row) => sum + Math.max(0, integer(row?.requestedCount, 0)), 0);
        if (source.status === 'candidate_non_operational' && requestCount !== integer(source.count, 0)) errors.push('selector request allocation does not equal preset count');
        if (requests.some(row => !normalizeDimension(row?.dimension) || !text(row?.targetKey) || !row?.selectorRequest)) errors.push('selector request target is incomplete');
        return { ok: errors.length === 0, errors, requestCount };
    }

    return { CONTRACT_VERSION, DIMENSIONS, CANONICAL_UID_RE, buildSupplementPreset, validatePreset };
}));
