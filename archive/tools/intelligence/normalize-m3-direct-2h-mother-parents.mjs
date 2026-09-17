import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Structural normalization only. Existing 001-028 Mother L4-gap decisions
// are retained verbatim; this helper fills only missing parent L1/L2/L3
// fields so the final contract can validate them. No L4 or difficulty is ever
// selected here.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const root = path.resolve(archiveDir, '..');
const dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging', '2H');
const taxonomyPath = path.join(root, 'docs', 'rules', '01_CANONICAL', 'taxonomy', 'rpm-primary-v1.0', '01_2015', 'MIDDLE', 'M3-2.md');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
const recordsOf = packet => Array.isArray(packet) ? packet : (packet?.records || packet?.results || []);
const identityKey = record => `${record?.sourceArchiveFile || ''}#${record?.sourceOrdinal ?? record?.sourceIdentity?.sourceOrdinal ?? ''}`;

function parseLabels(markdown) {
    const labels = new Map();
    for (const line of markdown.split(/\r?\n/)) {
        let match = line.match(/^#{2,4}\s+(L[1-4]-[0-9.]+)\.\s+(.+)$/);
        if (!match) match = line.match(/^[-*]\s+\*\*(L4-[0-9.]+)\*\*\s+(.+)$/);
        if (match) labels.set(match[1], match[2].trim());
    }
    return labels;
}

const labels = parseLabels(fs.readFileSync(taxonomyPath, 'utf8'));
const labelToKeys = new Map();
for (const [key, label] of labels) {
    if (!labelToKeys.has(label)) labelToKeys.set(label, []);
    labelToKeys.get(label).push(key);
}

function keyFrom(value, level) {
    if (value && typeof value === 'object') value = value.key || value.code || value.label || '';
    const text = String(value ?? '').trim();
    const match = text.match(new RegExp(`(?:M3-2-)?(L${level}-\\d(?:\\.\\d+)*)\\b`));
    if (match) return match[1];
    return (labelToKeys.get(text) || []).find(key => key.startsWith(`L${level}-`)) || '';
}

function parentPath(candidate) {
    const p = [1, 2, 3].map(level => keyFrom(candidate?.[`L${level}`] || candidate?.[`L${level}Key`] || candidate?.[`l${level}`] || candidate?.[`l${level}Key`], level));
    return p;
}

function validParent(p) {
    if (!p.every(Boolean) || !p.every(key => labels.has(key))) return false;
    const l2 = p[1].split('-')[1].split('.');
    const l3 = p[2].split('-')[1].split('.');
    return p[0] === `L1-${l2[0]}` && p[1] === `L2-${l3.slice(0, 2).join('.')}`;
}

function fallbackParent(source, finalDecision) {
    const text = [source?.sourceEvidence?.content, source?.sourceEvidence?.solution, finalDecision?.primaryConcept, finalDecision?.primaryConceptReason, finalDecision?.foundationDefectReason].filter(Boolean).join(' ');
    if (/산포도|분산|표준편차|편차|평균|중앙값|최빈값|상관관계|산점도/.test(text)) {
        if (/상관관계|산점도/.test(text)) return ['L1-3', 'L2-3.2', /산점도/.test(text) ? 'L3-3.2.1' : 'L3-3.2.2'];
        if (/분산|표준편차|편차|산포도/.test(text)) return ['L1-3', 'L2-3.1', 'L3-3.1.2'];
        return ['L1-3', 'L2-3.1', 'L3-3.1.1'];
    }
    if (/원|현|접선|원주각|지름|호/.test(text)) {
        if (/원주각|교차현|내접사각형|호의|호 /.test(text)) {
            if (/교차현|두 현|할선|호의 합|호의 차/.test(text)) return ['L1-2', 'L2-2.2', 'L3-2.2.2'];
            return ['L1-2', 'L2-2.2', 'L3-2.2.1'];
        }
        if (/접선/.test(text)) return ['L1-2', 'L2-2.1', 'L3-2.1.2'];
        return ['L1-2', 'L2-2.1', 'L3-2.1.1'];
    }
    if (/넓이|면적/.test(text)) return ['L1-1', 'L2-1.2', 'L3-1.2.1'];
    if (/높이|거리|앙각|부각|건물|나무|산|터널/.test(text)) return ['L1-1', 'L2-1.2', 'L3-1.2.2'];
    if (/삼각비 표|표 lookup|표에서|표를 이용/.test(text)) return ['L1-1', 'L2-1.1', 'L3-1.1.2'];
    if (/직선|기울기|절편/.test(text)) return ['L1-1', 'L2-1.1', 'L3-1.1.2'];
    return ['L1-1', 'L2-1.1', 'L3-1.1.3'];
}

function main() {
    const changed = [];
    const usedFallback = [];
    for (let n = 1; n <= 28; n += 1) {
        const batchNo = String(n).padStart(3, '0');
        const source = read(path.join(dir, `DIRECT_2H_BATCH_${batchNo}.json`));
        const diff = read(path.join(dir, `M3_DIRECT_2H_BATCH_${batchNo}_AB_DIFF.json`));
        const motherPath = path.join(dir, `M3_DIRECT_2H_BATCH_${batchNo}_MOTHER_FINAL.json`);
        const mother = read(motherPath);
        const sourceByKey = new Map(recordsOf(source).map(record => [identityKey(record), record]));
        const diffByKey = new Map(recordsOf(diff).map(record => [identityKey(record), record]));
        for (const record of mother.records || []) {
            const d = record.finalDecision || {};
            if (d.L1Key && d.L2Key && d.L3Key) continue;
            if (d.L4Key || d.foundationDefectCandidate !== true) throw new Error(`parent normalization precondition failed ${batchNo}#${record.sourceOrdinal}`);
            const diffRecord = diffByKey.get(identityKey(record));
            const candidates = [parentPath(diffRecord?.b), parentPath(diffRecord?.a)].filter(validParent);
            const selected = candidates[0] || fallbackParent(sourceByKey.get(identityKey(record)), d);
            if (!validParent(selected)) throw new Error(`parent normalization produced invalid path ${batchNo}#${record.sourceOrdinal}`);
            if (!candidates.length) usedFallback.push(`${batchNo}#${record.sourceOrdinal}`);
            [d.L1Key, d.L2Key, d.L3Key] = selected;
            [d.L1, d.L2, d.L3] = selected.map(key => labels.get(key));
            d.normalizationNote = 'L1/L2/L3 parent path schema-normalized from frozen AB_DIFF or source domain only; existing Mother L4 gap, difficulty, and semantic decision preserved without reclassification.';
            record.finalDecision = d;
            record.schemaNormalization = 'PARENT_PATH_REBOUND_ONLY_NO_SEMANTIC_RECLASSIFICATION';
            record.motherAdjudication = `${record.motherAdjudication || 'Existing Mother decision retained.'} Parent path schema-normalized; no L4 or difficulty change.`;
            changed.push(`${batchNo}#${record.sourceOrdinal}`);
        }
        write(motherPath, mother);
    }
    console.log(JSON.stringify({ status: 'PASS', changedCount: changed.length, changed, fallbackCount: usedFallback.length, fallbacks: usedFallback }, null, 2));
}

main();
