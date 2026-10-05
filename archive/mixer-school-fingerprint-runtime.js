(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./mixer-school-fingerprint.js'));
    } else {
        root.ArchiveMixerSchoolFingerprintRuntime = factory(root.ArchiveMixerSchoolFingerprint);
    }
}(typeof globalThis !== 'undefined' ? globalThis : this, function (bridge) {
    'use strict';

    const CONTRACT_VERSION = 'archive-mixer-school-fingerprint-runtime-v1';
    const SOURCE_ROOT = 'archive/exams/original';
    const NON_OPERATIONAL_STATUS = 'candidate_v1_not_operational';

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function eligiblePresets(payload) {
        if (!payload || payload.schemaVersion !== 'school-fingerprint.v1') return [];
        if (payload.source?.root !== SOURCE_ROOT || payload.samplePolicy?.status !== NON_OPERATIONAL_STATUS) return [];
        return (Array.isArray(payload.schools) ? payload.schools : [])
            .filter(school => school && school.sampleEligible === true && school.mixerPreset && school.mixerPreset.sample?.eligible === true)
            .map(school => ({
                ...school.mixerPreset,
                schoolName: text(school.schoolName || school.schoolKey),
                sample: { ...school.mixerPreset.sample, policy: NON_OPERATIONAL_STATUS },
                exposure: 'not_operational'
            }))
            .filter(preset => preset.schoolName && Array.isArray(preset.schoolInclude) && preset.schoolInclude.length > 0)
            .sort((a, b) => a.schoolName.localeCompare(b.schoolName, 'ko') || String(a.presetId).localeCompare(String(b.presetId), 'en'));
    }

    function validatePayload(payload) {
        const errors = [];
        if (!payload || payload.schemaVersion !== 'school-fingerprint.v1') errors.push('fingerprint schema is unavailable');
        if (payload?.source?.root !== SOURCE_ROOT) errors.push('fingerprint source scope is not original exams');
        if (payload?.samplePolicy?.status !== NON_OPERATIONAL_STATUS) errors.push('fingerprint policy status is not candidate_v1_not_operational');
        const presets = eligiblePresets(payload);
        if (!presets.length) errors.push('no eligible fingerprint presets');
        return { ok: errors.length === 0, errors, presetCount: presets.length };
    }

    async function load(url = 'school-fingerprints.json', fetchImpl) {
        const fetcher = fetchImpl || (typeof fetch === 'function' ? fetch : null);
        if (!fetcher) return { ok: false, errors: ['fetch is unavailable'], presets: [] };
        try {
            const response = await fetcher(url, { cache: 'no-store' });
            if (!response || !response.ok) return { ok: false, errors: [`fingerprint request failed: ${response?.status || 'unknown'}`], presets: [] };
            const payload = await response.json();
            const validation = validatePayload(payload);
            return { ...validation, contractVersion: CONTRACT_VERSION, policyStatus: NON_OPERATIONAL_STATUS, presets: eligiblePresets(payload) };
        } catch (error) {
            return { ok: false, errors: [error instanceof Error ? error.message : String(error)], presets: [] };
        }
    }

    function toSelectorRequest(preset, options) {
        if (!bridge || typeof bridge.toSelectorRequest !== 'function') return { count: 0, includeSchools: [], error: 'fingerprint bridge is unavailable' };
        return bridge.toSelectorRequest(preset, options);
    }

    return { CONTRACT_VERSION, SOURCE_ROOT, NON_OPERATIONAL_STATUS, eligiblePresets, validatePayload, load, toSelectorRequest };
}));
