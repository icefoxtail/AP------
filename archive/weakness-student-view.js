(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.ArchiveWeaknessStudentView = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const CONTRACT_VERSION = 'archive-weakness-student-view-v1';
    const DIMENSIONS = Object.freeze(['concept', 'problemType', 'template', 'standardUnit']);

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function finiteNumber(value, fallback = 0) {
        const number = Number(value);
        return Number.isFinite(number) ? number : fallback;
    }

    function round(value, digits = 6) {
        const factor = 10 ** digits;
        return Math.round((finiteNumber(value) + Number.EPSILON) * factor) / factor;
    }

    function scoreLevel(score) {
        const value = finiteNumber(score);
        if (value >= 0.65) return 'high';
        if (value >= 0.35) return 'medium';
        return 'low';
    }

    function clone(value) {
        if (Array.isArray(value)) return value.map(clone);
        if (!value || typeof value !== 'object') return value;
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)]));
    }

    function normalizeWeaknessRow(row, dimension) {
        const source = row && typeof row === 'object' ? row : {};
        const key = text(source.key) || 'UNSPECIFIED';
        const score = finiteNumber(source.weaknessScore);
        return {
            dimension,
            key,
            keySource: text(source.keySource) || 'unknown',
            label: text(source.label) || key,
            severity: scoreLevel(score),
            weaknessScore: round(score),
            attemptCount: Math.max(0, Math.trunc(finiteNumber(source.attemptCount))),
            wrongCount: Math.max(0, Math.trunc(finiteNumber(source.wrongCount))),
            correctCount: Math.max(0, Math.trunc(finiteNumber(source.correctCount))),
            recoveredWrongCount: Math.max(0, Math.trunc(finiteNumber(source.recoveredWrongCount))),
            recoveryRate: round(source.recoveryRate),
            recoveryFactor: round(source.recoveryFactor, 4),
            recoveryStatus: text(source.recoveryStatus) || 'limited_fallback',
            latestResultAt: text(source.latestResultAt),
        };
    }

    function normalizeDimension(groups, dimension, maxItems) {
        const list = Array.isArray(groups?.[dimension]) ? groups[dimension] : [];
        return list
            .filter(Boolean)
            .slice(0, maxItems)
            .map(row => normalizeWeaknessRow(row, dimension));
    }

    function buildNotices(weaknessReport, rows) {
        const fallback = weaknessReport?.recoveryCapable === false
            || rows.some(row => row.recoveryStatus === 'limited_fallback');
        const notices = [];
        if (fallback) {
            notices.push({
                code: 'RECOVERY_LIMITED',
                level: 'info',
                message: '정답 이력 연결이 제한되어 회복 여부는 제한적으로 반영되었습니다.',
            });
        }
        if (!rows.length) {
            notices.push({
                code: 'NO_WEAKNESS_DATA',
                level: 'info',
                message: '현재 조회 가능한 취약도 데이터가 없습니다.',
            });
        }
        return notices;
    }

    /**
     * Build a read-only student-facing view contract.
     *
     * This adapter deliberately does not fetch, write, or replace Wrong Clinic
     * data. Existing packets are cloned into the output so a future consumer
     * can render weakness summaries beside the current Wrong Clinic flow.
     */
    function buildStudentWeaknessView({ weaknessReport = {}, wrongClinicPackets = [], maxItems = 5 } = {}) {
        const itemLimit = Math.max(0, Math.min(20, Math.trunc(finiteNumber(maxItems, 5))));
        const groups = weaknessReport?.groups && typeof weaknessReport.groups === 'object'
            ? weaknessReport.groups
            : {};
        const dimensions = {};
        const allRows = [];
        for (const dimension of DIMENSIONS) {
            dimensions[dimension] = normalizeDimension(groups, dimension, itemLimit);
            allRows.push(...dimensions[dimension]);
        }
        const packets = Array.isArray(wrongClinicPackets) ? wrongClinicPackets.map(clone) : [];
        return {
            contractVersion: CONTRACT_VERSION,
            exposure: 'non_operational',
            readOnly: true,
            asOf: text(weaknessReport?.asOf),
            sourceMode: text(weaknessReport?.sourceMode) || 'unknown',
            weakness: {
                available: allRows.length > 0,
                itemCount: Math.max(0, Math.trunc(finiteNumber(weaknessReport?.itemCount))),
                wrongItemCount: Math.max(0, Math.trunc(finiteNumber(weaknessReport?.wrongItemCount))),
                dimensions,
            },
            wrongClinic: {
                preserved: true,
                packetCount: packets.length,
                packets,
            },
            notices: buildNotices(weaknessReport, allRows),
        };
    }

    return { CONTRACT_VERSION, DIMENSIONS, buildStudentWeaknessView, scoreLevel };
}));
