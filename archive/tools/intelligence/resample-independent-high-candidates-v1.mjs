import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const cuesPath = path.join(archiveDir, 'data', 'master_tables', 'high_first_wave_candidate_cues_v1.json');
const validationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'high-first-wave-validation', 'archive-high-first-wave-validation-v1.json');
const exclusionsPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'source-exclusions.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'independent-high-candidate-resamples');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const excerpt = value => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, 700);

function keyMatches(recordKey, targetKey) {
    if (targetKey.includes('~')) {
        const [prefix, range] = targetKey.split('~');
        const start = Number(prefix.split('-').at(-1));
        const end = Number(range.split('-').at(-1));
        const base = prefix.split('-').slice(0, -1).join('-');
        const match = recordKey.match(new RegExp(`^${base}-(\\d+)$`));
        return Boolean(match && Number(match[1]) >= start && Number(match[1]) <= end);
    }
    return recordKey === targetKey;
}

function excludedSources() {
    const exclusions = JSON.parse(fs.readFileSync(exclusionsPath, 'utf8'));
    return new Set([...(exclusions.excludedSourceArchiveFiles ?? []), ...(exclusions.bulkOnlyExcludedSourceArchiveFiles ?? [])]);
}

function records() {
    const excluded = excludedSources();
    const result = [];
    for (const file of scanExamBank().files) {
        const sourceArchiveFile = file.sourceFile.replace('archive/exams/', '');
        if (excluded.has(sourceArchiveFile) || !sourceArchiveFile.startsWith('original/high/')) continue;
        for (const question of file.questions) result.push({
            questionUid: `${sourceArchiveFile}#${question.originalIndex + 1}`,
            sourceArchiveFile,
            sourceOrdinal: question.originalIndex + 1,
            standardUnitKey: question.standardUnitKey,
            contentExcerpt: excerpt(`${question.content ?? ''} ${(question.choices ?? []).join(' ')}`),
            solutionExcerpt: excerpt(question.solution ?? '')
        });
    }
    return result;
}

function selectDiverse(pool, limit) {
    const selected = [];
    const used = new Set();
    const sourceCounts = new Map();
    const ordered = [...pool].sort((a, b) => a.questionUid.localeCompare(b.questionUid));
    for (const record of ordered) {
        if (selected.length >= limit) break;
        const count = sourceCounts.get(record.sourceArchiveFile) ?? 0;
        if (count >= 2) continue;
        selected.push(record);
        used.add(record.questionUid);
        sourceCounts.set(record.sourceArchiveFile, count + 1);
    }
    for (const record of ordered) {
        if (selected.length >= limit || used.has(record.questionUid)) continue;
        selected.push(record);
        used.add(record.questionUid);
    }
    return selected;
}

export function resampleIndependentHighCandidatesV1() {
    const cues = JSON.parse(fs.readFileSync(cuesPath, 'utf8'));
    const validation = JSON.parse(fs.readFileSync(validationPath, 'utf8'));
    const oldUids = new Set(validation.domains.flatMap(domain => domain.samples.map(sample => sample.questionUid)));
    const all = records();
    const domains = cues.domains.map(cueDomain => {
        const pool = all.filter(record => keyMatches(record.standardUnitKey, cueDomain.standardUnitKey) && !oldUids.has(record.questionUid));
        const samples = selectDiverse(pool, 50).map(record => ({ ...record, adjudication: 'PENDING_REVIEW' }));
        return {
            standardUnitKey: cueDomain.standardUnitKey,
            candidateKeys: Object.keys(cueDomain.candidates),
            remainingPoolCount: pool.length,
            sampleCount: samples.length,
            sourceCount: new Set(samples.map(sample => sample.sourceArchiveFile)).size,
            coverageStatus: samples.length >= 50 ? 'INDEPENDENT_READY' : 'INDEPENDENT_SHORTFALL',
            samples
        };
    });
    const stableReport = {
        schemaVersion: 'archive-independent-high-candidate-resamples-v1',
        cuesDigest: sha256(JSON.stringify(cues)),
        validationDigest: validation.digest,
        productionWriteAllowed: false,
        policy: { targetQuestionsPerDomain: 50, excludePriorValidationUids: true },
        totals: {
            domains: domains.length,
            independentReady: domains.filter(domain => domain.coverageStatus === 'INDEPENDENT_READY').length,
            independentShortfall: domains.filter(domain => domain.coverageStatus === 'INDEPENDENT_SHORTFALL').length,
            uniqueSamples: new Set(domains.flatMap(domain => domain.samples.map(sample => sample.questionUid))).size
        },
        domains
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = resampleIndependentHighCandidatesV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-independent-high-candidate-resamples-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/independent-high-candidate-resamples/archive-independent-high-candidate-resamples-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
