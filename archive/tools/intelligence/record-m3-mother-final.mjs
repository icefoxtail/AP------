import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Recording-only helper.  It does not infer a taxonomy decision: Mother
// decisions are supplied in a separate, human-readable decision artifact.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const root = path.resolve(archiveDir, '..');
const base = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging');

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJson(file, value) { fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8'); }
function identity(record) { return { ...(record || {}), ...(record?.sourceIdentity || {}) }; }
function identityKey(record) {
    const value = identity(record);
    return `${value.sourceArchiveFile || ''}#${value.sourceOrdinal ?? ''}`;
}
function keyLabelMap(markdown) {
    const map = {};
    for (const line of markdown.split(/\r?\n/)) {
        let match = line.match(/^#{2,4}\s+(L[1-3]-[0-9.]+)\.\s+(.+)$/);
        if (!match) match = line.match(/^[-*]\s+\*\*(L4-[0-9.]+)\*\*\s+(.+)$/);
        if (match) map[match[1]] = match[2].trim();
    }
    return map;
}
function first(value, fallback = '') { return value === undefined || value === null || value === '' ? fallback : value; }
function list(value) { return Array.isArray(value) ? value : value ? [value] : []; }
function solveText(raw) {
    const solve = raw.directSolveEvidence || raw.substantiveEvidence?.directSolve || raw.evidence?.independentSolve || {};
    if (typeof solve.reasoning === 'string' && solve.reasoning) return solve.reasoning;
    if (typeof solve.work === 'string' && solve.work) return solve.work;
    if (typeof solve.calculation === 'string' && solve.calculation) return solve.calculation;
    if (solve.optionChecks && typeof solve.optionChecks === 'object') return Object.values(solve.optionChecks).join('; ');
    if (solve.statementChecks && typeof solve.statementChecks === 'object') return Object.entries(solve.statementChecks).map(([key, value]) => `${key}: ${value.work || value.reason || value.status || ''}`).join('; ');
    return '';
}
function evidenceReason(raw) {
    const candidates = [
        raw.primaryReason, raw.primaryConceptReason, raw.directSolveEvidence?.reasoning,
        raw.substantiveEvidence?.directSolve?.reasoning, raw.evidence?.independentCheck?.calculation,
        solveText(raw), raw.directTaxonomy?.basis,
        raw.primaryCanonical?.decisiveStrategy, raw.taxonomy?.rationale,
        raw.canonicalDecision?.canonicalBasis
    ];
    return candidates.find(value => value !== undefined && value !== null && value !== '') || 'direct source evidence supports the selected path.';
}
function taxonomyReason(raw) {
    const candidates = [
        raw.taxonomyReason, raw.directTaxonomy?.basis, raw.taxonomy?.selectionBasis,
        raw.taxonomy?.rationale, solveText(raw),
        raw.primaryCanonical?.decisiveStrategy, raw.canonicalDecision?.canonicalBasis,
        raw.canonicalDecision?.basis
    ];
    return candidates.find(value => value !== undefined && value !== null && value !== '') || 'direct source evidence was mapped to the supplied Mother decision.';
}
function rejected(raw) {
    return list(raw.rejectedAlternativeConcepts || raw.rejectedAlternatives).map(item => {
        if (typeof item === 'string') return item;
        return `${item.key || item.conceptKey || ''}: ${item.reason || ''}`.trim();
    });
}

function main() {
    const semester = String(process.argv[2] || '2H');
    const batchNo = String(process.argv[3] || '001').padStart(3, '0');
    const dir = path.join(base, semester);
    const source = readJson(path.join(dir, `DIRECT_${semester}_BATCH_${batchNo}.json`));
    const a = readJson(path.join(dir, `A_DIRECT_${semester}_BATCH_${batchNo}.json`));
    const decisions = readJson(path.join(dir, `M3_DIRECT_${semester}_BATCH_${batchNo}_MOTHER_DECISIONS.json`));
    const canonical = fs.readFileSync(path.join(root, 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/MIDDLE/M3-2.md'), 'utf8');
    const labels = keyLabelMap(canonical);
    const sourceByKey = new Map(source.records.map(record => [identityKey(record), record]));
    const aByKey = new Map(a.records.map(record => [identityKey(record), record]));
    if (decisions.records.length !== source.records.length) throw new Error('Mother decision count does not match source count');
    const records = decisions.records.map(decision => {
        const decisionKey = `${decision.sourceArchiveFile || ''}#${decision.sourceOrdinal ?? ''}`;
        const fallbackByOrdinal = source.records.filter(record => record.sourceOrdinal === decision.sourceOrdinal);
        const src = decision.sourceArchiveFile
            ? sourceByKey.get(decisionKey)
            : fallbackByOrdinal.length === 1 ? fallbackByOrdinal[0] : undefined;
        const raw = src ? aByKey.get(identityKey(src)) : undefined;
        if (!raw || !src) throw new Error(`missing source/A ordinal ${decision.sourceOrdinal}`);
        const i = identity(raw);
        if (i.questionUid !== src.questionUid || i.sourceArchiveFile !== src.sourceArchiveFile) throw new Error(`identity mismatch ordinal ${decision.sourceOrdinal}`);
        const p = decision.path;
        const gap = !Array.isArray(p);
        const secondary = decision.secondaryConceptKeys ?? raw.secondaryConceptKeys ?? raw.secondaryCanonicalKey ?? raw.directTaxonomy?.secondaryCanonicalKey ?? raw.primaryCanonical?.supportingCanonicalIds ?? raw.taxonomy?.supportingCanonicalIds ?? [];
        const finalDecision = {
            L1Key: gap ? '' : p[0], L1: gap ? '' : labels[p[0]],
            L2Key: gap ? '' : p[1], L2: gap ? '' : labels[p[1]],
            L3Key: gap ? '' : p[2], L3: gap ? '' : labels[p[2]],
            L4Key: gap ? '' : p[3], L4: gap ? '' : labels[p[3]],
            primaryConcept: first(decision.primaryConcept, raw.primaryConcept || raw.primaryConceptLabel || raw.primaryCanonical?.l4Label || raw.taxonomy?.primary?.L4?.label || raw.primaryCanonical?.decisiveStrategy || labels[p?.[3]] || ''),
            primaryConceptReason: first(decision.primaryConceptReason, evidenceReason(raw)),
            rejectedAlternativeConcepts: rejected(raw),
            secondaryConceptKeys: gap ? [] : list(secondary),
            decisiveSolutionStep: first(decision.decisiveSolutionStep, raw.decisiveSolutionStep || solveText(raw) || raw.evidence?.decisiveStrategy || raw.primaryCanonical?.decisiveStrategy || ''),
            taxonomyReason: first(decision.taxonomyReason, taxonomyReason(raw)),
            difficultyBucket: decision.difficultyBucket,
            difficultyReason: first(decision.difficultyReason, first(raw.difficultyReason, first(raw.difficultyRationale, first(raw.difficultyEvidence?.basis, raw.difficulty?.rationale)))),
            curriculumApplicability: gap ? 'UNKNOWN' : 'DEFAULT_SCOPE',
            defaultSelectable: true,
            advancedCapabilityStatus: gap ? 'INCOMPLETE' : 'AVAILABLE',
            status: gap ? 'FOUNDATION_DEFECT_CANDIDATE' : 'RESOLVED',
            hold: false,
            holdReason: gap ? 'evidence sufficient; HOLD is not used for a canonical gap' : '',
            foundationDefectCandidate: gap,
            foundationDefectReason: gap ? decision.foundationDefectReason : '',
            conflictStatus: 'NONE',
            sourceDefectCandidate: false,
            sourceDefectReason: ''
        };
        if (!finalDecision.primaryConceptReason || !finalDecision.decisiveSolutionStep || !finalDecision.taxonomyReason || !finalDecision.difficultyReason) {
            throw new Error(`substantive evidence missing ordinal ${decision.sourceOrdinal}`);
        }
        return {
            questionUid: src.questionUid,
            sourceArchiveFile: src.sourceArchiveFile,
            sourceOrdinal: src.sourceOrdinal,
            finalDecision,
            motherAdjudication: gap
                ? 'A/B disagreement was adjudicated as an evidence-sufficient canonical gap; blank path retained and nearest fallback rejected.'
                : 'A/B evidence was adjudicated by decisive solution strategy and canonical exact-path contract.'
        };
    });
    const output = path.join(dir, `M3_DIRECT_${semester}_BATCH_${batchNo}_MOTHER_FINAL.json`);
    writeJson(output, {
        schemaVersion: 'm3-direct-canonical-tagging-mother-final-v1',
        status: 'MOTHER_FINALIZED', targetGrade: 'MIDDLE3', semester, batchNo,
        sourceA: `A_DIRECT_${semester}_BATCH_${batchNo}.json`,
        sourceB: `B_DIRECT_${semester}_BATCH_${batchNo}.json`,
        sourceMotherDecision: `M3_DIRECT_${semester}_BATCH_${batchNo}_MOTHER_DECISIONS.json`,
        recordCount: records.length, finalizedCount: records.length,
        adjudicationMode: 'MOTHER_DIRECT_DECISION_AFTER_A_B_FREEZE', records
    });
    console.log(JSON.stringify({ output: path.relative(root, output).replaceAll('\\', '/'), records: records.length, unique: new Set(records.map(r => r.questionUid)).size, foundation: records.filter(r => r.finalDecision.foundationDefectCandidate).map(r => r.sourceOrdinal) }, null, 2));
}

main();
