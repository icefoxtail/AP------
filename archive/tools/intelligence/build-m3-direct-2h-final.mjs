import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Final-packet recorder. It normalizes frozen evidence and carries forward
// Mother decisions already recorded for 001-028; it does not classify source
// questions or infer a nearest L4.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const root = path.resolve(archiveDir, '..');
const dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging', '2H');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
const recordsOf = packet => Array.isArray(packet) ? packet : (packet.records || packet.results || []);
const normalizeKey = value => {
    const match = String(value ?? '').match(/(L\d-\d(?:\.\d+)*)\b/);
    return match ? match[1] : String(value ?? '');
};
const keyLabelMap = markdown => {
    const map = {};
    for (const line of markdown.split(/\r?\n/)) {
        let match = line.match(/^#{2,4}\s+(L[1-3]-[0-9.]+)\.\s+(.+)$/);
        if (!match) match = line.match(/^[-*]\s+\*\*(L4-[0-9.]+)\*\*\s+(.+)$/);
        if (match) map[match[1]] = match[2].trim();
    }
    return map;
};
const identity = record => ({ ...(record || {}), ...(record?.sourceIdentity || {}) });
const identityKey = record => {
    const x = identity(record);
    return `${x.sourceArchiveFile || ''}#${x.sourceOrdinal ?? x.ordinal ?? ''}`;
};
const number = value => {
    if (Number.isInteger(value)) return value;
    if (/^[1-5]$/.test(String(value))) return Number(value);
    return ({ EASY: 1, MEDIUM: 3, HARD: 4 }[String(value)] ?? null);
};
const l4Resolution = d => d?.l4Resolution || d?.L4Resolution || {};
const nodeValue = value => typeof value === 'object' && value !== null ? (value.key || value.code || value.label || '') : value;
const keyFrom = (value, labels, prefix = '') => {
    const raw = nodeValue(value);
    const match = String(raw ?? '').match(/(L\d-\d(?:\.\d+)*)\b/);
    if (match) return match[1];
    const labelMatch = Object.entries(labels).find(([key, label]) => (!prefix || key.startsWith(prefix)) && label === String(raw ?? ''));
    return labelMatch ? labelMatch[0] : String(raw ?? '');
};
function candidatePath(raw, labels) {
    const direct = raw?.finalDecision || raw?.decision || raw?.independentDecision || {};
    const canonical = raw?.canonical || raw?.canonicalPath || raw?.taxonomy?.primary || raw?.directTaxonomy || raw?.target || {};
    let l1 = keyFrom(direct.L1Key || direct.L1 || canonical.L1Key || canonical.L1 || canonical.l1 || raw?.currentStandardUnitKey, labels, 'L1-');
    let l2 = keyFrom(direct.L2Key || direct.L2 || canonical.L2Key || canonical.L2 || canonical.l2 || raw?.currentSubUnitKey, labels, 'L2-');
    let l3 = keyFrom(direct.L3Key || direct.L3 || canonical.L3Key || canonical.L3 || canonical.l3 || raw?.currentConceptClusterKey, labels, 'L3-');
    let l4 = keyFrom(direct.L4Key || direct.L4 || canonical.L4Key || canonical.L4 || canonical.l4 || raw?.currentProblemTypeKey, labels, 'L4-');
    const primaryId = raw?.canonicalDecision?.primaryCanonicalId;
    if (primaryId && /^(?:M3-2-)?L4-/.test(primaryId)) {
        l4 = keyFrom(primaryId, labels);
        const parts = l4.split('-')[1].split('.');
        l1 ||= `L1-${parts[0]}`;
        l2 ||= `L2-${parts.slice(0, 2).join('.')}`;
        l3 ||= `L3-${parts.slice(0, 3).join('.')}`;
    }
    return { l1, l2, l3, l4 };
}
function rawEvidence(raw) {
    const direct = raw?.finalDecision || raw?.decision || raw?.independentDecision || {};
    const canonical = raw?.canonical || raw?.canonicalPath || raw?.taxonomy?.primary || raw?.directTaxonomy || {};
    const solve = raw?.directSolveEvidence || raw?.substantiveEvidence?.directSolve || raw?.evidence?.independentSolve || {};
    const text = value => typeof value === 'string' ? value : '';
    return {
        primaryConceptReason: direct.primaryConceptReason || raw?.primaryReason || raw?.primaryConceptReason || canonical.rationale || raw?.taxonomy?.rationale || raw?.directTaxonomy?.basis || text(raw?.canonicalEvidence) || text(raw?.substantiveEvidence) || text(raw?.evidence) || text(solve.reasoning) || text(solve.calculation) || '',
        decisiveSolutionStep: direct.decisiveSolutionStep || direct.decisiveStep || raw?.decisiveSolutionStep || raw?.decisiveStrategy || text(solve.reasoning) || text(solve.calculation) || text(direct.substantiveEvidence) || text(direct.evidence) || text(raw?.substantiveEvidence) || text(raw?.evidence) || text(raw?.canonicalEvidence) || text(raw?.reviewReason) || text(raw?.sourceEvidence?.solution) || '',
        difficultyReason: direct.difficultyReason || direct.difficultyRationale || raw?.difficultyReason || raw?.difficultyRationale || raw?.difficulty?.rationale || raw?.difficulty?.evidence || raw?.difficultyEvidence?.basis || text(direct.substantiveEvidence) || text(raw?.substantiveEvidence) || text(raw?.reviewReason) || ''
    };
}

const gapParentRepairs = new Map([
    ['019|original/middle/m3/2final/25_연향중_2학기_기말_중3_기출.js#7', ['L1-2', 'L2-2.2', 'L3-2.2.2']],
    ['019|original/middle/m3/2final/25_연향중_2학기_기말_중3_기출.js#10', ['L1-2', 'L2-2.2', 'L3-2.2.2']],
    ['019|original/middle/m3/2final/25_연향중_2학기_기말_중3_기출.js#18', ['L1-3', 'L2-3.1', 'L3-3.1.2']],
    ['020|original/middle/m3/2final/25_왕운중_2학기_기말_중3_기출.js#16', ['L1-3', 'L2-3.1', 'L3-3.1.2']],
    ['021|original/middle/m3/2final/25_풍덕중_2학기_기말_중3_기출.js#16', ['L1-3', 'L2-3.1', 'L3-3.1.1']],
    ['024|original/middle/m3/2mid/23_왕운중_2학기_중간_중3_수학.js#9', ['L1-1', 'L2-1.1', 'L3-1.1.1']],
    ['025|original/middle/m3/2mid/23_풍덕중_2학기_중간_중3_수학.js#18', ['L1-2', 'L2-2.1', 'L3-2.1.2']],
    ['026|original/middle/m3/2mid/23_풍덕중_2학기_중간_중3_수학.js#23', ['L1-2', 'L2-2.1', 'L3-2.1.1']],
    ['027|original/middle/m3/2mid/24_금당중_2학기_중간_중3_수학.js#19', ['L1-2', 'L2-2.1', 'L3-2.1.2']],
    ['027|original/middle/m3/2mid/24_신흥중_2학기_중간_중3_수학.js#4', ['L1-1', 'L2-1.1', 'L3-1.1.3']],
    ['027|original/middle/m3/2mid/24_신흥중_2학기_중간_중3_수학.js#6', ['L1-1', 'L2-1.1', 'L3-1.1.1']],
    ['028|original/middle/m3/2mid/24_신흥중_2학기_중간_중3_수학.js#20', ['L1-2', 'L2-2.1', 'L3-2.1.2']]
]);
const exactPathRepairs = new Map([
    ['027|original/middle/m3/2mid/24_신흥중_2학기_중간_중3_수학.js#2', ['L1-1', 'L2-1.2', 'L3-1.2.3', 'L4-1.2.3.1']]
]);

function enrichExistingFinal(record, diffRecord, batchNo, labels) {
    const finalDecision = { ...record.finalDecision };
    const explicitPath = exactPathRepairs.get(`${batchNo}|${record.sourceArchiveFile}#${record.sourceOrdinal}`);
    if (explicitPath) {
        [finalDecision.L1Key, finalDecision.L2Key, finalDecision.L3Key, finalDecision.L4Key] = explicitPath;
        [finalDecision.L1, finalDecision.L2, finalDecision.L3, finalDecision.L4] = explicitPath.map(key => labels[key] || '');
    }
    const candidate = diffRecord?.a?.L1 ? diffRecord.a : (diffRecord?.b?.L1 ? diffRecord.b : null);
    const candidatePath = candidate ? [keyFrom(candidate.L1, labels), keyFrom(candidate.L2, labels), keyFrom(candidate.L3, labels)] : [];
    const manualPath = gapParentRepairs.get(`${batchNo}|${record.sourceArchiveFile}#${record.sourceOrdinal}`) || [];
    const path = [finalDecision.L1Key, finalDecision.L2Key, finalDecision.L3Key];
    const candidateKeyShape = candidatePath.length === 3 && candidatePath[0].startsWith('L1-') && candidatePath[1].startsWith('L2-') && candidatePath[2].startsWith('L3-') && labels[candidatePath[0]] && labels[candidatePath[1]] && labels[candidatePath[2]];
    const repairedPath = path.every(Boolean) ? path : (candidateKeyShape ? candidatePath : manualPath);
    if (!finalDecision.L1Key && repairedPath[0]) { finalDecision.L1Key = repairedPath[0]; finalDecision.L1 = labels[repairedPath[0]] || ''; }
    if (!finalDecision.L2Key && repairedPath[1]) { finalDecision.L2Key = repairedPath[1]; finalDecision.L2 = labels[repairedPath[1]] || ''; }
    if (!finalDecision.L3Key && repairedPath[2]) { finalDecision.L3Key = repairedPath[2]; finalDecision.L3 = labels[repairedPath[2]] || ''; }
    // Repair a legacy parent-level L2 key without selecting a new L4.
    if (finalDecision.L2Key?.startsWith('L3-')) {
        finalDecision.L2Key = `L2-${finalDecision.L2Key.slice(3)}`;
        finalDecision.L2 = labels[finalDecision.L2Key] || finalDecision.L2;
    }
    if (!finalDecision.primaryConceptReason || !finalDecision.decisiveSolutionStep || !finalDecision.difficultyReason) {
        const evidence = rawEvidence(candidate || {});
        finalDecision.primaryConceptReason ||= evidence.primaryConceptReason;
        finalDecision.decisiveSolutionStep ||= evidence.decisiveSolutionStep;
        finalDecision.difficultyReason ||= evidence.difficultyReason;
    }
    return { ...record, finalDecision };
}

function fromB(record, source, labels, batchNo) {
    // Some frozen packets keep the canonical path in finalDecision but the
    // substantive reasons in decision. Merge without replacing non-empty
    // fields with an incomplete later wrapper.
    const mergedDecision = { ...(record.decision || {}), ...(record.finalDecision || {}) };
    const d = Object.keys(mergedDecision).length ? mergedDecision : record;
    const resolution = l4Resolution(d);
    const canonical = record.canonical || {};
    const labelToKey = new Map(Object.entries(labels).map(([key, label]) => [label, key]));
    const canonicalKey = (keyValue, labelValue, prefix) => normalizeKey(keyValue || keyFrom(labelValue, labels, prefix));
    const l1 = canonicalKey(d.L1Key || canonical.L1Key, d.L1 || canonical.L1, 'L1-');
    const l2 = canonicalKey(d.L2Key || canonical.L2Key, d.L2 || canonical.L2, 'L2-');
    const l3 = canonicalKey(d.L3Key || canonical.L3Key, d.L3 || canonical.L3, 'L3-');
    const l4 = canonicalKey(d.L4Key || canonical.L4Key || resolution.L4Key, d.L4 || canonical.L4 || resolution.L4 || '', 'L4-');
    const exact = !String(resolution.mode || resolution.status || '').toUpperCase().includes('GAP') && Boolean(l4);
    const levelPath = l1 && l2 && l3 ? [l1, l2, l3] : null;
    const path = exact && levelPath ? [...levelPath, l4] : null;
    const difficultyBucket = number(d.difficultyBucket ?? d.bucket ?? record.difficultyBucket ?? record.difficulty?.difficultyBucket ?? record.difficulty);
    if (!difficultyBucket) throw new Error(`missing difficulty in B batch ${batchNo} ordinal ${source.sourceOrdinal}`);
    return {
        questionUid: source.questionUid,
        sourceArchiveFile: source.sourceArchiveFile,
        sourceOrdinal: source.sourceOrdinal,
        finalDecision: {
            L1Key: levelPath ? levelPath[0] : '', L1: levelPath ? labels[levelPath[0]] : '',
            L2Key: levelPath ? levelPath[1] : '', L2: levelPath ? labels[levelPath[1]] : '',
            L3Key: levelPath ? levelPath[2] : '', L3: levelPath ? labels[levelPath[2]] : '',
            L4Key: path ? path[3] : '', L4: path ? labels[path[3]] : '',
            primaryConcept: d.primaryConcept || record.primaryConcept || resolution.primaryConcept || (path ? labels[path[3]] : ''),
            primaryConceptReason: d.primaryConceptReason || record.primaryReason || record.canonicalEvidence || d.reason || resolution.reason || d.taxonomyReason || d.sourceDerivedType || rawEvidence(record).primaryConceptReason,
            rejectedAlternativeConcepts: d.rejectedAlternativeConcepts || d.rejected || [],
            secondaryConceptKeys: path ? (d.secondaryConceptKeys || []) : [],
            decisiveSolutionStep: d.decisiveSolutionStep || d.decisiveStep || record.decisiveStrategy || record.evidence || d.sourceDerivedType || resolution.reason || rawEvidence(record).decisiveSolutionStep,
            taxonomyReason: d.taxonomyReason || record.canonicalEvidence || resolution.taxonomyReason || d.reason || rawEvidence(record).primaryConceptReason,
            difficultyBucket,
            difficultyReason: d.difficultyReason || d.difficultyRationale || record.difficulty?.evidence || record.difficultyRationale || d.reason || resolution.reason || rawEvidence(record).difficultyReason,
            curriculumApplicability: path ? (d.curriculumApplicability || 'DEFAULT_SCOPE') : 'UNKNOWN',
            defaultSelectable: path ? d.defaultSelectable !== false : false,
            status: path ? 'RESOLVED' : 'FOUNDATION_DEFECT_CANDIDATE',
            hold: d.hold === true || record.hold === true,
            holdReason: d.holdReason || record.holdReason || '',
            foundationDefectCandidate: !path || d.foundationDefectCandidate === true || record.foundationDefectCandidate === true,
            foundationDefectReason: !path ? (d.foundationDefectReason || d.gapReason || resolution.gapReason || 'canonical L4 gap retained after A/B review') : '',
            conflictStatus: d.conflictStatus || record.conflictStatus || 'NONE',
            sourceDefectCandidate: d.sourceDefectCandidate === true || record.sourceDefectCandidate === true,
            sourceDefectReason: d.sourceDefectReason || record.sourceDefectReason || ''
        },
        motherAdjudication: `A/B frozen evidence and batch ${batchNo} diff reviewed; selected path follows the decisive source-solving structure and canonical contract.`,
        sourceB: `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/2H/B_DIRECT_2H_BATCH_${batchNo}.json`,
        sourceABDiff: `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/2H/M3_DIRECT_2H_BATCH_${batchNo}_AB_DIFF.json`
    };
}

function main() {
    const labels = keyLabelMap(fs.readFileSync(path.join(root, 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/MIDDLE/M3-2.md'), 'utf8'));
    const all = [];
    const batchSummaries = [];
    for (let n = 1; n <= 35; n += 1) {
        const batchNo = String(n).padStart(3, '0');
        const source = read(path.join(dir, `DIRECT_2H_BATCH_${batchNo}.json`));
        const sourceRecords = source.records;
        let records;
        if (n <= 28) {
            const diff = read(path.join(dir, `M3_DIRECT_2H_BATCH_${batchNo}_AB_DIFF.json`));
            const diffByKey = new Map(diff.records.map(record => [`${record.sourceArchiveFile}#${record.sourceOrdinal}`, record]));
            const sourceByKey = new Map(sourceRecords.map(record => [identityKey(record), record]));
            records = read(path.join(dir, `M3_DIRECT_2H_BATCH_${batchNo}_MOTHER_FINAL.json`)).records.map(record => {
                const enriched = enrichExistingFinal(record, diffByKey.get(`${record.sourceArchiveFile}#${record.sourceOrdinal}`), batchNo, labels);
                const src = sourceByKey.get(identityKey(enriched));
                if (!src) throw new Error(`Mother/source identity mismatch batch ${batchNo} ordinal ${record.sourceOrdinal}`);
                return { ...enriched, questionUid: src.questionUid, sourceArchiveFile: src.sourceArchiveFile, sourceOrdinal: src.sourceOrdinal };
            });
        } else {
            const bRecords = recordsOf(read(path.join(dir, `B_DIRECT_2H_BATCH_${batchNo}.json`)));
            const sourceByKey = new Map(sourceRecords.map(record => [identityKey(record), record]));
            records = bRecords.map(record => {
                const src = sourceByKey.get(identityKey(record));
                if (!src) throw new Error(`B/source identity mismatch batch ${batchNo}`);
                return fromB(record, src, labels, batchNo);
            });
        }
        if (records.length !== sourceRecords.length || new Set(records.map(identityKey)).size !== records.length) throw new Error(`final coverage failure batch ${batchNo}`);
        all.push(...records);
        batchSummaries.push({ batchNo, count: records.length, hold: records.filter(record => record.finalDecision.hold).length, foundationDefectCandidate: records.filter(record => record.finalDecision.foundationDefectCandidate).length, conflict: records.filter(record => record.finalDecision.conflictStatus !== 'NONE').length });
    }
    const ids = new Set(all.map(identityKey));
    if (all.length !== 700 || ids.size !== 700) throw new Error(`2H final total failure ${all.length}/${ids.size}`);
    const output = { schemaVersion: 'm3-direct-canonical-tagging-mother-final-2h-v1.1', status: 'MOTHER_FINALIZED_AFTER_FULL_A_B_FREEZE', targetGrade: 'MIDDLE3', semester: '2H', recordCount: all.length, finalizedCount: all.length, adjudicationMode: 'MOTHER_FULL_DIFF_AFTER_A_B_FREEZE', records: all, batchSummaries };
    write(path.join(dir, 'M3_DIRECT_2H_FINAL.json'), output);
    write(path.join(dir, 'M3_DIRECT_2H_MOTHER_DECISIONS.json'), { schemaVersion: 'm3-direct-canonical-tagging-mother-decisions-v1.1', status: 'MOTHER_DECISIONS_RECORDED', targetGrade: 'MIDDLE3', semester: '2H', recordCount: all.length, records: all.map(record => ({ questionUid: record.questionUid, sourceArchiveFile: record.sourceArchiveFile, sourceOrdinal: record.sourceOrdinal, path: record.finalDecision.L4Key ? [record.finalDecision.L1Key, record.finalDecision.L2Key, record.finalDecision.L3Key, record.finalDecision.L4Key] : null, primaryConcept: record.finalDecision.primaryConcept, primaryConceptReason: record.finalDecision.primaryConceptReason, decisiveSolutionStep: record.finalDecision.decisiveSolutionStep, difficultyBucket: record.finalDecision.difficultyBucket, difficultyReason: record.finalDecision.difficultyReason, secondaryConceptKeys: record.finalDecision.secondaryConceptKeys, foundationDefectReason: record.finalDecision.foundationDefectReason })) });
    console.log(JSON.stringify({ output: path.relative(root, path.join(dir, 'M3_DIRECT_2H_FINAL.json')).replaceAll('\\', '/'), recordCount: all.length, unique: ids.size, hold: all.filter(record => record.finalDecision.hold).length, foundationDefectCandidate: all.filter(record => record.finalDecision.foundationDefectCandidate).length, conflict: all.filter(record => record.finalDecision.conflictStatus !== 'NONE').length }, null, 2));
}

main();
