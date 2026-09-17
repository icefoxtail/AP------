import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Final-packet recorder. This helper only assembles frozen evidence and
// Mother decisions. It deliberately has no A/B-to-final fallback: every
// batch, including 029-035, must have an explicit Mother Final artifact.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const root = path.resolve(archiveDir, '..');
const dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging', '2H');
const taxonomyPath = path.join(root, 'docs', 'rules', '01_CANONICAL', 'taxonomy', 'rpm-primary-v1.0', '01_2015', 'MIDDLE', 'M3-2.md');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
const recordsOf = packet => Array.isArray(packet) ? packet : (packet?.records || packet?.results || []);

function identityOf(record) {
    const nested = record?.sourceIdentity && typeof record.sourceIdentity === 'object' ? record.sourceIdentity : {};
    return {
        questionUid: record?.questionUid || nested.questionUid || '',
        sourceArchiveFile: record?.sourceArchiveFile || nested.sourceArchiveFile || '',
        sourceOrdinal: record?.sourceOrdinal ?? nested.sourceOrdinal ?? ''
    };
}

const identityKey = record => {
    const x = identityOf(record);
    return `${x.sourceArchiveFile}#${x.sourceOrdinal}`;
};

function parseLabels(markdown) {
    const labels = new Map();
    for (const line of markdown.split(/\r?\n/)) {
        let match = line.match(/^#{2,4}\s+(L[1-4]-[0-9.]+)\.\s+(.+)$/);
        if (!match) match = line.match(/^[-*]\s+\*\*(L4-[0-9.]+)\*\*\s+(.+)$/);
        if (match) labels.set(match[1], match[2].trim());
    }
    return labels;
}

function keyFrom(value, labels, level) {
    if (value && typeof value === 'object') value = value.key || value.code || value.label || '';
    const text = String(value ?? '').trim();
    const match = text.match(new RegExp(`(?:M3-2-)?(L${level}-\\d(?:\\.\\d+)*)\\b`));
    if (match) return match[1];
    for (const [key, label] of labels) {
        if (key.startsWith(`L${level}-`) && label === text) return key;
    }
    return '';
}

function pathFromRecord(record, labels) {
    const candidates = [
        record?.finalDecision,
        record?.decision,
        record?.independentDecision,
        record?.canonical,
        record?.taxonomy?.primary,
        record?.directTaxonomy,
        record
    ].filter(candidate => candidate && typeof candidate === 'object');
    const values = level => candidates.flatMap(candidate => [
        candidate[`L${level}Key`], candidate[`L${level}`],
        candidate[`L${level}Label`],
        candidate[`l${level}`], candidate[`l${level}Key`],
        candidate[`level${level}`]
    ]);
    const pathNodes = Array.isArray(record?.canonicalPath) ? record.canonicalPath : [];
    return [1, 2, 3, 4].map(level => {
        const node = pathNodes.find(item => item?.level === `L${level}` || item?.level === level);
        return keyFrom(node?.key || node?.code || node?.label || values(level).find(Boolean), labels, level);
    });
}

function bSnapshot(record, labels) {
    const decision = record?.finalDecision || record?.decision || {};
    const p = pathFromRecord(record, labels);
    const difficulty = record?.difficultyBucket ?? decision.difficultyBucket ?? record?.difficulty?.difficultyBucket ?? record?.difficulty?.bucket ?? record?.difficulty ?? null;
    return {
        sourceArchiveFile: record?.sourceArchiveFile || record?.sourceIdentity?.sourceArchiveFile || '',
        sourceOrdinal: record?.sourceOrdinal ?? record?.sourceIdentity?.sourceOrdinal ?? null,
        path: p.some(Boolean) ? p : null,
        difficultyBucket: Number.isInteger(difficulty) ? difficulty : null,
        status: record?.status || record?.reviewStatus || decision.status || '',
        reviewOutcome: record?.reviewOutcome || record?.reviewStatus || '',
        hold: record?.hold === true || decision.hold === true,
        holdReason: record?.holdReason || decision.holdReason || '',
        foundationDefectCandidate: record?.foundationDefectCandidate === true || decision.foundationDefectCandidate === true,
        foundationDefectReason: record?.foundationDefectReason || decision.foundationDefectReason || '',
        sourceDefectCandidate: record?.sourceDefectCandidate === true || decision.sourceDefectCandidate === true,
        sourceDefectReason: record?.sourceDefectReason || decision.sourceDefectReason || '',
        reason: record?.reviewReason || record?.reason || decision.primaryConceptReason || decision.reason || record?.reviewEvidence?.substantiveEvidence || '',
        evidence: record?.independentEvidence || record?.reviewEvidence || record?.sourceReadAudit || { independentDecision: record?.independentDecision || null },
        reviewedBy: 'B_INDEPENDENT_REVIEWER'
    };
}

function validateSourcePacket(source, batchNo) {
    const records = recordsOf(source);
    if (records.length !== 20) throw new Error(`source batch ${batchNo} count ${records.length}/20`);
    const keys = new Set(records.map(identityKey));
    if (keys.size !== records.length || records.some(record => !identityOf(record).questionUid)) throw new Error(`source batch ${batchNo} identity failure`);
    return records;
}

function validateFrozenPacket(packet, sourceRecords, role, batchNo, labels) {
    const records = recordsOf(packet);
    if (records.length !== sourceRecords.length) throw new Error(`${role} batch ${batchNo} count mismatch`);
    const byKey = new Map(sourceRecords.map(record => [identityKey(record), record]));
    const seen = new Set();
    for (const record of records) {
        const id = identityOf(record);
        const key = identityKey(record);
        if (!id.questionUid || !byKey.has(key) || seen.has(key)) throw new Error(`${role} batch ${batchNo} identity mismatch ${key}`);
        const source = byKey.get(key);
        if (id.questionUid !== source.questionUid || record.sourceFingerprint && record.sourceFingerprint !== source.sourceFingerprint) throw new Error(`${role} batch ${batchNo} source identity mismatch ${key}`);
        seen.add(key);
    }
    return new Map(records.map(record => [identityKey(record), bSnapshot(record, labels)]));
}

function validateDiff(diff, sourceRecords, batchNo) {
    const records = recordsOf(diff);
    if (records.length !== sourceRecords.length || diff.identityMatch !== true) throw new Error(`AB_DIFF batch ${batchNo} identity/count failure`);
    const expected = new Set(sourceRecords.map(identityKey));
    const seen = new Set();
    for (const record of records) {
        const key = identityKey(record);
        if (!expected.has(key) || seen.has(key)) throw new Error(`AB_DIFF batch ${batchNo} identity mismatch ${key}`);
        seen.add(key);
    }
    const actual = records.filter(record => {
        const d = record.normalizedDifferences || {};
        return d.path?.length || d.secondary || d.difficulty || d.status?.length || d.primaryConcept;
    }).length;
    if (actual !== diff.normalizedDisagreementCount) throw new Error(`AB_DIFF batch ${batchNo} count is not computed from records`);
    return new Map(records.map(record => [identityKey(record), record]));
}

function validateTaxonomyPath(finalDecision, labels, batchNo, ordinal) {
    const d = finalDecision || {};
    for (const [level, field] of [[1, 'L1Key'], [2, 'L2Key'], [3, 'L3Key']]) {
        if (!d[field] || !labels.has(d[field]) || !d[`L${level}`]) throw new Error(`Mother Final hard path failure batch ${batchNo} ordinal ${ordinal}`);
    }
    if (d.L4Key) {
        if (!labels.has(d.L4Key) || !d.L4) throw new Error(`Mother Final invalid L4 batch ${batchNo} ordinal ${ordinal}`);
        const parts = d.L4Key.split('-')[1].split('.');
        if (d.L1Key !== `L1-${parts[0]}` || d.L2Key !== `L2-${parts.slice(0, 2).join('.')}` || d.L3Key !== `L3-${parts.slice(0, 3).join('.')}`) throw new Error(`Mother Final parent violation batch ${batchNo} ordinal ${ordinal}`);
        if (d.foundationDefectCandidate === true && !d.foundationDefectReason) throw new Error(`exact L4 marked as unexplained foundation gap batch ${batchNo} ordinal ${ordinal}`);
    } else {
        if (d.foundationDefectCandidate !== true || !d.foundationDefectReason) throw new Error(`L4 gap without FOUNDATION_DEFECT_CANDIDATE batch ${batchNo} ordinal ${ordinal}`);
    }
    if (!Number.isInteger(d.difficultyBucket) || d.difficultyBucket < 1 || d.difficultyBucket > 5) throw new Error(`Mother Final difficulty failure batch ${batchNo} ordinal ${ordinal}`);
    if (!d.primaryConceptReason || !d.decisiveSolutionStep || !d.difficultyReason) throw new Error(`Mother Final evidence failure batch ${batchNo} ordinal ${ordinal}`);
}

function validateMotherFinal(packet, sourceRecords, batchNo, labels, requireDecisionArtifact) {
    const acceptedStatus = requireDecisionArtifact
        ? packet?.status === 'MOTHER_FINALIZED_AFTER_FULL_A_B_FREEZE'
        : ['MOTHER_FINALIZED', 'MOTHER_FINALIZED_AFTER_FULL_A_B_FREEZE'].includes(packet?.status);
    if (!packet || !acceptedStatus) throw new Error(`Mother Final status failure batch ${batchNo}`);
    if (packet.sourceMotherDecision !== `M3_DIRECT_2H_BATCH_${batchNo}_MOTHER_DECISIONS.json` && requireDecisionArtifact) throw new Error(`Mother decision provenance failure batch ${batchNo}`);
    const records = recordsOf(packet);
    if (records.length !== sourceRecords.length || packet.finalizedCount !== records.length) throw new Error(`Mother Final count failure batch ${batchNo}`);
    const sourceByKey = new Map(sourceRecords.map(record => [identityKey(record), record]));
    const seen = new Set();
    for (const record of records) {
        const id = identityOf(record);
        const key = identityKey(record);
        const source = sourceByKey.get(key);
        if (!source || seen.has(key) || (requireDecisionArtifact && id.questionUid !== source.questionUid)) throw new Error(`Mother Final identity failure batch ${batchNo} ${key}`);
        validateTaxonomyPath(record.finalDecision, labels, batchNo, id.sourceOrdinal);
        if (!record.motherAdjudication || typeof record.motherAdjudication !== 'string') throw new Error(`Mother adjudication provenance missing batch ${batchNo} ordinal ${id.sourceOrdinal}`);
        if (requireDecisionArtifact) {
            const evidence = record.motherEvidence;
            if (!evidence?.sourceFieldsRead?.content || !evidence?.sourceFieldsRead?.choices || !evidence?.sourceFieldsRead?.answer || !evidence?.sourceFieldsRead?.solution) throw new Error(`Mother source evidence missing batch ${batchNo} ordinal ${id.sourceOrdinal}`);
            if (evidence.sourceIdentity !== key) throw new Error(`Mother evidence identity mismatch batch ${batchNo} ordinal ${id.sourceOrdinal}`);
            if (!evidence.abDiff || !evidence.frozenA || !evidence.frozenB) throw new Error(`Mother A/B provenance missing batch ${batchNo} ordinal ${id.sourceOrdinal}`);
        }
        seen.add(key);
    }
    return records;
}

function main() {
    const labels = parseLabels(fs.readFileSync(taxonomyPath, 'utf8'));
    const all = [];
    const batchSummaries = [];
    for (let n = 1; n <= 35; n += 1) {
        const batchNo = String(n).padStart(3, '0');
        const sourceRecords = validateSourcePacket(read(path.join(dir, `DIRECT_2H_BATCH_${batchNo}.json`)), batchNo);
        const bMap = validateFrozenPacket(read(path.join(dir, `B_DIRECT_2H_BATCH_${batchNo}.json`)), sourceRecords, 'B', batchNo, labels);
        validateFrozenPacket(read(path.join(dir, `A_DIRECT_2H_BATCH_${batchNo}.json`)), sourceRecords, 'A', batchNo, labels);
        const diffMap = validateDiff(read(path.join(dir, `M3_DIRECT_2H_BATCH_${batchNo}_AB_DIFF.json`)), sourceRecords, batchNo);
        const motherFile = path.join(dir, `M3_DIRECT_2H_BATCH_${batchNo}_MOTHER_FINAL.json`);
        if (!fs.existsSync(motherFile)) throw new Error(`Mother Final missing batch ${batchNo}`);
        const mother = read(motherFile);
        const records = validateMotherFinal(mother, sourceRecords, batchNo, labels, n >= 29);
        const sourceByKey = new Map(sourceRecords.map(record => [identityKey(record), record]));
        const motherDecisionRef = fs.existsSync(path.join(dir, `M3_DIRECT_2H_BATCH_${batchNo}_MOTHER_DECISIONS.json`))
            ? `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/2H/M3_DIRECT_2H_BATCH_${batchNo}_MOTHER_DECISIONS.json`
            : `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/2H/M3_DIRECT_2H_BATCH_${batchNo}_MOTHER_FINAL.json`;
        const normalized = records.map(record => {
            const key = identityKey(record);
            const source = sourceByKey.get(key);
            return {
                ...record,
                batchNo,
                questionUid: source.questionUid,
                sourceArchiveFile: source.sourceArchiveFile,
                sourceOrdinal: source.sourceOrdinal,
                sourceQuestionNo: source.sourceQuestionNo,
                sourceJsSha256: source.sourceJsSha256,
                sourceFingerprint: source.sourceFingerprint,
                sourceB: `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/2H/B_DIRECT_2H_BATCH_${batchNo}.json`,
                sourceABDiff: `archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/2H/M3_DIRECT_2H_BATCH_${batchNo}_AB_DIFF.json`,
                sourceMotherDecision: motherDecisionRef,
                independentB: bMap.get(key),
                abDiff: diffMap.get(key)
            };
        });
        const keys = new Set(normalized.map(identityKey));
        if (keys.size !== normalized.length) throw new Error(`duplicate final identity batch ${batchNo}`);
        all.push(...normalized);
        batchSummaries.push({
            batchNo,
            count: normalized.length,
            normalizedDisagreementCount: [...diffMap.values()].filter(record => {
                const d = record.normalizedDifferences || {};
                return d.path?.length || d.secondary || d.difficulty || d.status?.length || d.primaryConcept;
            }).length,
            hold: normalized.filter(record => record.finalDecision.hold === true).length,
            foundationDefectCandidate: normalized.filter(record => record.finalDecision.foundationDefectCandidate === true).length,
            conflict: normalized.filter(record => record.finalDecision.conflictStatus && record.finalDecision.conflictStatus !== 'NONE').length,
            sourceDefectCandidate: normalized.filter(record => record.finalDecision.sourceDefectCandidate === true).length
        });
    }
    const ids = new Set(all.map(identityKey));
    const uids = new Set(all.map(record => record.questionUid));
    if (all.length !== 700 || ids.size !== 700 || uids.size !== 700) throw new Error(`2H final total failure ${all.length}/${ids.size}/${uids.size}`);
    const output = {
        schemaVersion: 'm3-direct-canonical-tagging-mother-final-2h-v1.2',
        status: 'MOTHER_FINALIZED_AFTER_FULL_A_B_FREEZE',
        targetGrade: 'MIDDLE3',
        semester: '2H',
        recordCount: all.length,
        finalizedCount: all.length,
        adjudicationMode: 'MOTHER_FULL_SOURCE_EVIDENCE_ADJUDICATION_AFTER_A_B_FREEZE',
        records: all,
        batchSummaries
    };
    write(path.join(dir, 'M3_DIRECT_2H_FINAL.json'), output);
    write(path.join(dir, 'M3_DIRECT_2H_MOTHER_DECISIONS.json'), {
        schemaVersion: 'm3-direct-canonical-tagging-mother-decisions-v1.2',
        status: 'MOTHER_DECISIONS_RECORDED_AFTER_SOURCE_ADJUDICATION',
        targetGrade: 'MIDDLE3',
        semester: '2H',
        recordCount: all.length,
        records: all.map(record => ({
            questionUid: record.questionUid,
            sourceArchiveFile: record.sourceArchiveFile,
            sourceOrdinal: record.sourceOrdinal,
            batchNo: record.batchNo,
            path: record.finalDecision.L4Key ? [record.finalDecision.L1Key, record.finalDecision.L2Key, record.finalDecision.L3Key, record.finalDecision.L4Key] : [record.finalDecision.L1Key, record.finalDecision.L2Key, record.finalDecision.L3Key],
            primaryConcept: record.finalDecision.primaryConcept,
            primaryConceptReason: record.finalDecision.primaryConceptReason,
            decisiveSolutionStep: record.finalDecision.decisiveSolutionStep,
            difficultyBucket: record.finalDecision.difficultyBucket,
            difficultyReason: record.finalDecision.difficultyReason,
            secondaryConceptKeys: record.finalDecision.secondaryConceptKeys,
            foundationDefectCandidate: record.finalDecision.foundationDefectCandidate,
            foundationDefectReason: record.finalDecision.foundationDefectReason,
            motherAdjudication: record.motherAdjudication,
            motherEvidence: record.motherEvidence,
            sourceB: record.sourceB,
            sourceABDiff: record.sourceABDiff
        }))
    });
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase1/middle3-foundation/direct-canonical-tagging/2H/M3_DIRECT_2H_FINAL.json', recordCount: all.length, uniqueIdentityCount: ids.size, uniqueQuestionUidCount: uids.size, hold: all.filter(record => record.finalDecision.hold === true).length, foundationDefectCandidate: all.filter(record => record.finalDecision.foundationDefectCandidate === true).length, conflict: all.filter(record => record.finalDecision.conflictStatus !== 'NONE').length }, null, 2));
}

main();
