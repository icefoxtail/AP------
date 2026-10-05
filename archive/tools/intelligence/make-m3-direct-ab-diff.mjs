import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function difficultyNumber(value) {
    if (Number.isInteger(value)) return value;
    if (/^[1-5]$/.test(String(value))) return Number(value);
    return { EASY: 1, MEDIUM: 3, HARD: 4 }[value] ?? 'UNKNOWN';
}

function keyToken(value) {
    const match = String(value ?? '').match(/(L\d-\d(?:\.\d+)*)\b/);
    return match ? match[1] : value;
}

function identityOf(record) {
    const merged = { ...(record || {}), ...(record?.sourceIdentity || {}) };
    // A normalized packet may retain an older nested sourceIdentity while the
    // top-level identity was mechanically rebound to the current manifest.
    // Prefer explicit top-level identity fields; use nested identity only as a
    // fallback for legacy packets that have no top-level binding.
    if (record?.questionUid) merged.questionUid = record.questionUid;
    if (record?.sourceArchiveFile) merged.sourceArchiveFile = record.sourceArchiveFile;
    if (record?.sourceOrdinal !== undefined && record?.sourceOrdinal !== null) merged.sourceOrdinal = record.sourceOrdinal;
    return merged;
}

function semanticDecision(record, source) {
    // v1.1 packets place the resolved decision in decision/finalDecision.
    // Legacy B packets use independentDecision and are normalized by the
    // dedicated compatibility branch below.
    const directDecision = record?.finalDecision || record?.decision;
    if (directDecision && typeof directDecision === 'object' && (directDecision.L1 || directDecision.L2 || directDecision.L3 || directDecision.primaryConcept || directDecision.difficultyBucket !== undefined)) {
        const l4Resolution = directDecision.L4Resolution || directDecision.l4Resolution || {};
        return {
            ...record,
            ...directDecision,
            L1: keyToken(directDecision.L1Key || directDecision.L1 || ''),
            L2: keyToken(directDecision.L2Key || directDecision.L2 || ''),
            L3: keyToken(directDecision.L3Key || directDecision.L3 || ''),
            L4: keyToken(directDecision.L4Key || directDecision.L4 || l4Resolution.L4Key || l4Resolution.L4 || l4Resolution.label || ''),
            primaryConcept: directDecision.primaryConcept || '',
            primaryConceptReason: directDecision.primaryConceptReason || '',
            secondaryConceptKeys: directDecision.secondaryConceptKeys || [],
            decisiveSolutionStep: directDecision.decisiveSolutionStep || '',
            difficultyBucket: difficultyNumber(directDecision.difficultyBucket),
            difficultyReason: directDecision.difficultyReason || '',
            status: directDecision.status || record.status || '',
            hold: directDecision.hold === true,
            holdReason: directDecision.holdReason || '',
            foundationDefectCandidate: directDecision.foundationDefectCandidate === true,
            sourceDefectCandidate: directDecision.sourceDefectCandidate === true,
            sourceDefectReason: directDecision.sourceDefectReason || ''
        };
    }
    if (record?.taxonomy?.primary || record?.taxonomy?.canonicalPath || record?.primaryCanonical || record?.directTaxonomy || record?.canonicalPath || record?.canonical || record?.L1Key || record?.primaryCanonicalTag) {
        const pathNodes = record.canonicalPath || record.taxonomy?.canonicalPath;
        const canonical = record.taxonomy?.primary || record.primaryCanonical || record.directTaxonomy || record.canonical || (!Array.isArray(pathNodes) ? (pathNodes || {}) : {});
        const pathCode = level => Array.isArray(pathNodes) ? pathNodes.find(node => node.level === level)?.key || '' : '';
        const code = value => keyToken(typeof value === 'string' ? value : value?.code || value?.key || '');
        const solve = record.substantiveEvidence?.directSolve || record.evidence?.directSolve || record.directSolveEvidence || {};
        const difficulty = record.difficultyBucket ?? record.difficulty?.difficultyBucket ?? record.difficulty?.level ?? record.difficulty?.bucket ?? record.difficultyEvidence?.bucket ?? record.currentDifficultyBucket;
        return {
            ...record,
            L1: code(canonical.L1Key || canonical.l1Key || record.L1Key || canonical.L1 || canonical.l1 || record.L1 || pathCode('L1')),
            L2: code(canonical.L2Key || canonical.l2Key || record.L2Key || canonical.L2 || canonical.l2 || record.L2 || pathCode('L2')),
            L3: code(canonical.L3Key || canonical.l3Key || record.L3Key || canonical.L3 || canonical.l3 || record.L3 || pathCode('L3')),
            L4: code(canonical.L4Key || canonical.l4Key || record.L4Key || canonical.L4 || canonical.l4 || record.L4 || record.primaryCanonicalTag || pathCode('L4')),
            primaryConcept: record.primaryConcept || canonical.primaryConcept || record.primaryCanonicalLabel || canonical.L4?.label || canonical.L4 || canonical.l4Label || record.L4 || '',
            primaryConceptReason: record.primaryConceptReason || record.primaryReason || solve.reasoning || record.taxonomy?.selectionBasis || record.primaryCanonical?.decisiveStrategy || '',
            secondaryConceptKeys: record.secondaryConceptKeys || record.secondaryCanonicalKey || canonical.supportingCanonicalIds || [],
            decisiveSolutionStep: record.decisiveSolutionStep || solve.reasoning || record.evidence?.decisiveStrategy || record.primaryCanonical?.decisiveStrategy || '',
            difficultyBucket: difficultyNumber(difficulty),
            difficultyReason: record.difficultyReason || record.difficultyRationale || record.difficultyEvidence?.basis || record.difficulty?.rationale || '',
            status: record.status || record.taggingStatus || record.taxonomy?.status || '',
            hold: record.hold === true || record.HOLD?.status === 'HOLD' || record.hold?.status === 'HOLD',
            holdReason: record.holdReason || record.HOLD?.reason || '',
            foundationDefectCandidate: record.foundationDefectCandidate === true || record.foundation?.candidate === true || record.canonicalGap?.foundationCandidate === true || record.canonicalGap?.status === 'FOUNDATION_CANDIDATE' || record.taxonomy?.status === 'FOUNDATION_CANDIDATE',
            sourceDefectCandidate: record.sourceDefectCandidate === true || record.sourceDefect === true,
            sourceDefectReason: record.sourceDefectReason || ''
        };
    }
    if (record?.canonicalDecision) {
        const canonical = record.canonicalDecision;
        if (canonical.primaryCanonicalId || canonical.foundationCandidate === true || canonical.canonicalGap === true) {
            const primaryKey = canonical.primaryCanonicalId || '';
            const parts = primaryKey ? primaryKey.split('-')[1].split('.') : [];
            const level = primaryKey.match(/^L(\d)-/);
            const depth = Number(level?.[1] || 4);
            const l1 = primaryKey ? `L1-${parts[0]}` : '';
            const l2 = primaryKey ? (depth <= 2 ? primaryKey : `L2-${parts.slice(0, 2).join('.')}`) : '';
            const l3 = primaryKey ? (depth <= 3 ? primaryKey : `L3-${parts.slice(0, 3).join('.')}`) : '';
            const l4 = primaryKey && depth === 4 ? primaryKey : '';
            const difficulty = record.difficultyBucket ?? record.difficultyEvidence?.bucket ?? record.difficultyAssessment?.bucket ?? record.currentDifficultyBucket;
            return {
                ...record,
                L1: record.L1 || l1,
                L2: record.L2 || l2,
                L3: record.L3 || l3,
                L4: record.L4 || l4,
                primaryConcept: record.primaryConcept || canonical.primaryCanonicalLabel || primaryKey,
                primaryConceptReason: record.primaryConceptReason || canonical.decisionBasis || canonical.textualEvidence || '',
                secondaryConceptKeys: record.secondaryConceptKeys || canonical.supportingCanonicalIds || [],
                decisiveSolutionStep: record.decisiveSolutionStep || record.directSolveEvidence?.reasoning || canonical.decisionBasis || '',
                difficultyBucket: difficultyNumber(difficulty),
                difficultyReason: record.difficultyReason || record.difficultyEvidence?.basis || '',
                status: record.status || 'B_DIRECT_FROZEN',
                hold: record.hold === true || canonical.hold === true,
                holdReason: record.holdReason || canonical.textualEvidence || '',
                foundationDefectCandidate: canonical.foundationCandidate === true || canonical.canonicalGap === true || record.foundationDefectCandidate === true,
                sourceDefectCandidate: record.sourceDefect === true || record.sourceDefectCandidate === true,
                sourceDefectReason: record.sourceDefectReason || ''
            };
        }
        const solve = record.directSolveEvidence || {};
        return {
            ...record,
            L1: canonical.currentStandardUnitKey || record.L1 || '',
            L2: canonical.currentSubUnitKey || record.L2 || '',
            L3: canonical.currentConceptClusterKey || record.L3 || '',
            L4: canonical.currentProblemTypeKey || record.L4 || '',
            primaryConcept: record.primaryConcept || record.primaryConceptLabel || canonical.currentProblemTypeKey || '',
            primaryConceptReason: record.primaryReason || solve.reasoning || record.primaryConceptReason || '',
            secondaryConceptKeys: record.secondaryConceptKeys || canonical.secondaryCanonicalKey ? [record.secondaryConceptKeys || canonical.secondaryCanonicalKey].flat() : [],
            decisiveSolutionStep: record.decisiveSolutionStep || solve.reasoning || '',
            difficultyBucket: difficultyNumber(record.difficultyBucket ?? record.currentDifficultyBucket ?? record.currentLevel),
            difficultyReason: record.difficultyReason || record.primaryReason || '',
            status: record.status || canonical.status || '',
            hold: record.hold === true,
            holdReason: record.holdReason || '',
            foundationDefectCandidate: canonical.status === 'FOUNDATION_CANDIDATE' || record.foundationDefectCandidate === true,
            sourceDefectCandidate: record.sourceDefect === true || record.sourceDefectCandidate === true,
            sourceDefectReason: record.sourceDefectReason || ''
        };
    }
    const raw = record?.decision || record?.independentDecision || source || record || {};
    const bFormat = Boolean(record?.independentDecision);
    if (!bFormat) return raw;
    const canonical = raw.canonical || {};
    const outer = record || {};
    return {
        ...raw,
        L1: keyToken(raw.L1 || canonical.L1),
        L2: keyToken(raw.L2 || canonical.L2),
        L3: keyToken(raw.L3 || canonical.L3),
        L4: keyToken(raw.L4 || canonical.L4),
        primaryConcept: raw.primary || raw.primaryConcept || outer.primaryConcept || raw.L4,
        secondaryConceptKeys: (raw.secondary ? (Array.isArray(raw.secondary) ? raw.secondary : [raw.secondary]) : (raw.secondaryConceptKeys || outer.secondaryConceptKeys || [])).map(keyToken),
        decisiveSolutionStep: raw.decisiveStep || raw.decisiveSolutionStep || outer.decisiveStep || '',
        primaryConceptReason: raw.reason || raw.primaryConceptReason || outer.reason || '',
        difficultyBucket: difficultyNumber(raw.difficultyBucket ?? raw.difficulty ?? outer.difficultyBucket ?? outer.difficulty),
        difficultyReason: raw.difficultyReason || raw.reason || outer.difficultyReason || '',
        status: raw.status === 'TAGGED' || raw.status === 'B_DIRECT_FROZEN' || outer.status === 'B_DIRECT_FROZEN' ? 'RESOLVED' : (raw.status || outer.status),
        hold: raw.HOLD === true || raw.hold === true || raw.hold?.isHold === true || outer.hold === true,
        holdReason: raw.holdReason || raw.hold?.reason || raw.sourceDefect?.note || outer.holdReason || outer.sourceDefectReason || '',
        foundationDefectCandidate: raw.foundation === 'FOUNDATION_DEFECT_CANDIDATE' || raw.foundation?.status === 'FOUNDATION_DEFECT_CANDIDATE' || raw.foundationStatus === 'FOUNDATION_DEFECT_CANDIDATE' || raw.foundationDefectCandidate === true || outer.foundationDefectCandidate === true,
        sourceDefectCandidate: raw.sourceDefect?.present === true || raw.sourceDefectCandidate === true || raw.sourceDefect === true || outer.sourceDefectCandidate === true || outer.sourceDefect === true,
        sourceDefectReason: raw.sourceDefect?.note || raw.sourceDefectReason || outer.sourceDefectReason || ''
    };
}

function main() {
    const semester = process.argv[2] || '2H';
    const batchNo = String(process.argv[3] || '001').padStart(3, '0');
    const dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging', semester);
    const a = readJson(path.join(dir, `A_DIRECT_${semester}_BATCH_${batchNo}.json`));
    const b = readJson(path.join(dir, `B_DIRECT_${semester}_BATCH_${batchNo}.json`));
    const aRecords = Array.isArray(a) ? a : (a.records || a.results || []);
    const bRecords = Array.isArray(b) ? b : (b.records || b.results || []);
    const bByUid = new Map(bRecords.map(record => [identityOf(record).questionUid, record]));
    const compareFields = ['L1', 'L2', 'L3', 'L4', 'secondaryConceptKeys', 'hold', 'foundationDefectCandidate', 'sourceDefectCandidate'];
    const records = aRecords.map(aRecord => {
        const aIdentity = identityOf(aRecord);
        const bRecord = bByUid.get(aIdentity.questionUid);
        const aRaw = semanticDecision(aRecord);
        const bRaw = semanticDecision(bRecord || {});
        const aDecision = { ...aRaw, difficultyBucket: difficultyNumber(aRaw.difficultyBucket), status: aRaw.status === 'DIRECT_TAGGED' ? 'RESOLVED' : aRaw.status, hold: aRaw.hold === true, foundationDefectCandidate: aRaw.foundationDefectCandidate === true, sourceDefectCandidate: aRaw.sourceDefectCandidate === true };
        const bDecision = bRaw;
        const rawDifferences = compareFields.filter(field => JSON.stringify(aDecision[field]) !== JSON.stringify(bDecision[field]));
        const difficultyDifference = aDecision.difficultyBucket !== bDecision.difficultyBucket;
        const primaryConceptFormatOnly = aDecision.primaryConcept === aDecision.L4 || aDecision.primaryConcept === aDecision.L4Label;
        const bPrimaryLabel = bDecision.primaryConcept || bDecision.L4Label;
        const primaryConceptDifference = !primaryConceptFormatOnly && aDecision.primaryConcept !== bPrimaryLabel;
        return {
            questionUid: aIdentity.questionUid,
            sourceArchiveFile: aIdentity.sourceArchiveFile,
            sourceOrdinal: aIdentity.sourceOrdinal,
            sourceFingerprint: aIdentity.sourceFingerprint,
            a: aDecision,
            b: bDecision,
            rawDifferences,
            normalizedDifferences: {
                path: rawDifferences.filter(field => ['L1', 'L2', 'L3', 'L4'].includes(field)),
                secondary: rawDifferences.includes('secondaryConceptKeys'),
                difficulty: difficultyDifference,
                status: rawDifferences.filter(field => ['hold', 'foundationDefectCandidate', 'sourceDefectCandidate'].includes(field)),
                primaryConcept: primaryConceptDifference
            },
            motherStatus: 'PENDING'
        };
    });
    const report = {
        schemaVersion: 'm3-direct-canonical-tagging-ab-diff-v1',
        status: 'A_B_PACKETS_FROZEN_MOTHER_PENDING',
        targetGrade: 'MIDDLE3',
        semester,
        batchNo,
        sourceA: `A_DIRECT_${semester}_BATCH_${batchNo}.json`,
        sourceB: `B_DIRECT_${semester}_BATCH_${batchNo}.json`,
        recordCount: records.length,
        identityMatch: records.length === bRecords.length && records.every(record => bByUid.has(record.questionUid)),
        normalizedDisagreementCount: records.filter(record => record.normalizedDifferences.path.length || record.normalizedDifferences.secondary || record.normalizedDifferences.difficulty || record.normalizedDifferences.status.length || record.normalizedDifferences.primaryConcept).length,
        records
    };
    const output = path.join(dir, `M3_DIRECT_${semester}_BATCH_${batchNo}_AB_DIFF.json`);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', 'utf8');
    console.log(JSON.stringify({ output: path.relative(repoRoot, output).replaceAll('\\', '/'), recordCount: records.length, normalizedDisagreementCount: report.normalizedDisagreementCount, identityMatch: report.identityMatch }, null, 2));
}

main();
