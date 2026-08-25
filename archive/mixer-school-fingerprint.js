(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.ArchiveMixerSchoolFingerprint = factory();
    }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const CONTRACT_VERSION = 'archive-mixer-school-fingerprint-v1';
    const CANONICAL_UID_RE = /^qid_v1_[0-9a-f]{64}$/;
    const DISTRIBUTION_FIELDS = {
        unit: ['standardUnitKey', 'unitKey'],
        subunit: ['subUnitKey'],
        difficulty: ['difficultyBucket', 'difficulty', 'normalizedLevel', 'level'],
        problemType: ['problemTypeKey', 'typeKey', 'problemType']
    };

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function key(value) {
        return text(value).toLowerCase();
    }

    function sourcePath(value) {
        return text(value).replace(/\\/g, '/').replace(/^\.\//, '').replace(/^archive\/exams\//, '').replace(/^exams\//, '');
    }

    function asList(value) {
        if (Array.isArray(value)) return value.map(text).filter(Boolean);
        if (value == null || value === '') return [];
        return [text(value)];
    }

    function ratioMap(distribution) {
        const total = (distribution || []).reduce((sum, row) => sum + Number(row.count || 0), 0);
        return new Map((distribution || []).map(row => [text(row.key), total ? Number(row.count || 0) / total : 0]));
    }

    function valuesOf(candidate, fields) {
        for (const field of fields) {
            const value = candidate && candidate[field];
            if (Array.isArray(value) && value.length) return value.map(text).filter(Boolean);
            if (value != null && text(value)) return [text(value)];
        }
        return [];
    }

    function targetRows(preset, dimension) {
        return Array.isArray(preset?.targetDistribution?.[dimension]) ? preset.targetDistribution[dimension] : [];
    }

    function validatePresetDistribution(selected, preset, tolerance) {
        const items = Array.isArray(selected) ? selected : [];
        const baseTolerance = Number.isFinite(Number(tolerance)) ? Number(tolerance) : Number(preset?.constraints?.maxDistributionDelta || 0.10);
        // For small sets, a two-item correction covers rounding in a small cart
        // while retaining
        // the nominal ±10%p limit for normal-sized sets.
        const effectiveTolerance = items.length ? Math.max(baseTolerance, 2 / items.length) : baseTolerance;
        const checks = [];
        Object.entries(DISTRIBUTION_FIELDS).forEach(([dimension, fields]) => {
            const expected = ratioMap(targetRows(preset, dimension));
            const counts = new Map();
            items.forEach(item => {
                const value = valuesOf(item, fields)[0] || 'UNSPECIFIED';
                counts.set(value, (counts.get(value) || 0) + 1);
            });
            const actualTotal = items.length;
            const keys = new Set([...expected.keys(), ...counts.keys()]);
            let maxDelta = 0;
            for (const candidateKey of keys) {
                const actual = actualTotal ? Number(counts.get(candidateKey) || 0) / actualTotal : 0;
                maxDelta = Math.max(maxDelta, Math.abs((expected.get(candidateKey) || 0) - actual));
            }
            checks.push({ dimension, maxDelta, tolerance: effectiveTolerance, ok: maxDelta <= effectiveTolerance });
        });
        return { ok: checks.every(check => check.ok), checks, tolerance: effectiveTolerance };
    }

    function toSelectorRequest(preset, options) {
        const config = options && typeof options === 'object' ? options : {};
        const count = Number(config.count ?? preset?.count);
        const request = {
            count,
            includeSchools: asList(config.includeSchools ?? preset?.schoolInclude),
            excludeSchools: asList(config.excludeSchools),
            grades: asList(config.grades),
            courses: asList(config.courses),
            yearFrom: config.yearFrom ?? null,
            yearTo: config.yearTo ?? null,
            selectionSeed: text(config.selectionSeed || preset?.selectionSeed || 'school-fingerprint-v1'),
            targetDistribution: preset?.targetDistribution || {},
            maxDistributionDelta: Number(config.maxDistributionDelta ?? preset?.constraints?.maxDistributionDelta ?? 0.10)
        };
        return request;
    }

    function selectSchoolFingerprint(selector, candidates, preset, options) {
        const pool = Array.isArray(candidates) ? candidates : [];
        const request = toSelectorRequest(preset, options);
        const errors = [];
        if (!selector || typeof selector.selectCandidates !== 'function') errors.push('selector contract is unavailable');
        if (!Number.isInteger(request.count) || request.count <= 0) errors.push('count must be a positive integer');
        if (!request.includeSchools.length) errors.push('school fingerprint must supply includeSchools');
        let selected = [];
        const unitTargets = targetRows(preset, 'unit');
        const allocate = (rows, count) => {
            const normalized = rows.map(row => ({ ...row, ratio: Number(row.ratio || 0) })).filter(row => row.key && row.ratio > 0);
            const raw = normalized.map(row => ({ ...row, target: row.ratio * count, count: Math.floor(row.ratio * count) }));
            let remaining = Math.max(0, count - raw.reduce((sum, row) => sum + row.count, 0));
            raw.sort((a, b) => (b.target - b.count) - (a.target - a.count) || a.key.localeCompare(b.key));
            for (const row of raw) {
                if (remaining <= 0) break;
                row.count += 1;
                remaining -= 1;
            }
            return raw;
        };
        const buildSelection = seed => {
            const picked = [];
            const used = new Set();
            const seededRequest = { ...request, selectionSeed: seed };
            allocate(unitTargets, request.count).forEach((target, index) => {
                if (!target.count) return;
                const result = selector.selectCandidates(pool.filter(candidate => !used.has(text(candidate.questionUid || candidate.uid))), {
                    ...seededRequest,
                    count: target.count,
                    unitKeys: [target.key]
                }, { selectionSeed: `${seed}:unit:${target.key}:${index}` });
                (result?.selected || []).forEach(candidate => {
                    const uid = text(candidate.questionUid || candidate.uid);
                    if (!uid || used.has(uid) || picked.length >= request.count) return;
                    used.add(uid);
                    picked.push(candidate);
                });
            });
            if (picked.length < request.count) {
                const result = selector.selectCandidates(pool.filter(candidate => !used.has(text(candidate.questionUid || candidate.uid))), {
                    ...seededRequest,
                    count: request.count - picked.length
                }, { selectionSeed: `${seed}:fill` });
                (result?.selected || []).forEach(candidate => {
                    const uid = text(candidate.questionUid || candidate.uid);
                    if (!uid || used.has(uid) || picked.length >= request.count) return;
                    used.add(uid);
                    picked.push(candidate);
                });
            }
            return picked;
        };
        if (!errors.length) selected = buildSelection(request.selectionSeed);
        let distribution = validatePresetDistribution(selected, preset, request.maxDistributionDelta);
        // A unit quota alone can drift on the other fingerprint dimensions for
        // small samples. Retry deterministic seed variants and keep the first
        // passing set (or the closest set when no variant can pass).
        if (!errors.length && !distribution.ok) {
            let best = { selected, distribution };
            for (let retry = 0; retry < 64 && !distribution.ok; retry += 1) {
                const candidateSet = buildSelection(`${request.selectionSeed}:retry:${retry}`);
                const candidateDistribution = validatePresetDistribution(candidateSet, preset, request.maxDistributionDelta);
                const candidateScore = Math.max(...candidateDistribution.checks.map(check => check.maxDelta), 0);
                const bestScore = Math.max(...best.distribution.checks.map(check => check.maxDelta), 0);
                if (candidateScore < bestScore) best = { selected: candidateSet, distribution: candidateDistribution };
                if (candidateDistribution.ok) {
                    best = { selected: candidateSet, distribution: candidateDistribution };
                    break;
                }
            }
            selected = best.selected;
            distribution = best.distribution;
        }
        const hardValidation = selector && typeof selector.validateSelection === 'function'
            ? selector.validateSelection(selected, request)
            : { ok: false, errors: ['selector validateSelection is unavailable'] };
        if (!hardValidation.ok) errors.push(...(hardValidation.errors || ['hard constraint validation failed']));
        if (!distribution.ok) errors.push('selected distribution is outside the fingerprint tolerance');
        return {
            contractVersion: CONTRACT_VERSION,
            ok: errors.length === 0,
            request,
            selected,
            errors: Array.from(new Set(errors)),
            hardValidation,
            distribution
        };
    }

    function enrichIndexRecords(indexRecords, identityRecords, examRecords) {
        const identityMap = new Map((Array.isArray(identityRecords) ? identityRecords : []).map(record => [
            `${sourcePath(record.sourceArchiveFile)}#${Number(record.sourceOrdinal)}`,
            record
        ]));
        const examMap = new Map((Array.isArray(examRecords) ? examRecords : []).map(exam => [sourcePath(exam.sourcePath || exam.sourceFile), exam]));
        return (Array.isArray(indexRecords) ? indexRecords : []).map(record => {
            const file = sourcePath(record.sourceFile);
            const identity = identityMap.get(`${file}#${Number(record.sourceOrdinal)}`) || {};
            const exam = examMap.get(file) || {};
            const taggedProblemType = Array.isArray(record.tags)
                ? record.tags.map(text).find(tag => /객관식|주관식|서술형|논술형|단답형/.test(tag)) || ''
                : '';
            const inferredProblemType = Object.prototype.hasOwnProperty.call(record, 'questionType')
                ? text(record.questionType)
                : (taggedProblemType || (text(record.choicesText) ? '객관식' : ''));
            return {
                ...record,
                sourceFile: file,
                sourceOrdinal: Number(record.sourceOrdinal),
                questionUid: record.questionUid || identity.questionUid || '',
                sourceSchool: exam.sourceSchool || exam.canonicalSchool || '',
                school: exam.canonicalSchool || exam.sourceSchool || '',
                year: record.year || exam.year || '',
                grade: record.grade || exam.grade || '',
                standardCourse: record.standardCourse || exam.standardCourse || record.course || '',
                course: record.course || record.standardCourse || exam.standardCourse || '',
                unitOrder: record.unitOrder || record.standardUnitOrder || 999,
                difficultyBucket: record.difficultyBucket || record.normalizedLevel || record.level || '',
                problemTypeKey: record.problemTypeKey || record.typeKey || record.questionType || inferredProblemType
            };
        });
    }

    return {
        CONTRACT_VERSION,
        CANONICAL_UID_RE,
        toSelectorRequest,
        validatePresetDistribution,
        selectSchoolFingerprint,
        enrichIndexRecords
    };
}));
