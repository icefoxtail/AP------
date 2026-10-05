import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const promotionPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-promotion', 'archive-subunit-promotion-v1.json');
const exclusionsPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'source-exclusions.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'high-first-wave-validation');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const excerpt = value => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, 700);

function excludedSources() {
    const exclusions = JSON.parse(fs.readFileSync(exclusionsPath, 'utf8'));
    return new Set([...(exclusions.excludedSourceArchiveFiles ?? []), ...(exclusions.bulkOnlyExcludedSourceArchiveFiles ?? [])]);
}

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

function records() {
    const excluded = excludedSources();
    const result = [];
    for (const file of scanExamBank().files) {
        const sourceArchiveFile = file.sourceFile.replace('archive/exams/', '');
        if (excluded.has(sourceArchiveFile) || !sourceArchiveFile.startsWith('original/high/')) continue;
        for (const question of file.questions) {
            result.push({
                questionUid: `${sourceArchiveFile}#${question.originalIndex + 1}`,
                sourceArchiveFile,
                sourceOrdinal: question.originalIndex + 1,
                standardUnitKey: question.standardUnitKey,
                standardUnit: question.standardUnit,
                contentExcerpt: excerpt(`${question.content ?? ''} ${(question.choices ?? []).join(' ')}`),
                solutionExcerpt: excerpt(question.solution ?? '')
            });
        }
    }
    return result;
}

function selectDiverse(pool, limit) {
    const selected = [];
    const sourceCounts = new Map();
    const ordered = [...pool].sort((a, b) => a.questionUid.localeCompare(b.questionUid));
    for (const record of ordered) {
        if (selected.length >= limit) break;
        const count = sourceCounts.get(record.sourceArchiveFile) ?? 0;
        if (count >= 2) continue;
        selected.push(record);
        sourceCounts.set(record.sourceArchiveFile, count + 1);
    }
    for (const record of ordered) {
        if (selected.length >= limit) break;
        if (selected.some(sample => sample.questionUid === record.questionUid)) continue;
        selected.push(record);
        sourceCounts.set(record.sourceArchiveFile, (sourceCounts.get(record.sourceArchiveFile) ?? 0) + 1);
    }
    return selected;
}

export function validateHighFirstWavePilotV1() {
    const promotion = JSON.parse(fs.readFileSync(promotionPath, 'utf8'));
    const highStage = promotion.stages.find(stage => stage.stageId === 'high-first-wave');
    const all = records();
    const domains = highStage.entries.map(entry => {
        const pool = all.filter(record => keyMatches(record.standardUnitKey, entry.standardUnitKey));
        const samples = selectDiverse(pool, 100);
        const sampleSources = new Set(samples.map(sample => sample.sourceArchiveFile));
        const coverageStatus = samples.length >= 50 ? 'COVERAGE_READY' : 'COVERAGE_SHORTFALL';
        return {
            curriculumVersion: entry.curriculumVersion,
            standardUnitKey: entry.standardUnitKey,
            standardUnit: entry.standardUnit,
            candidates: entry.candidates,
            poolCount: pool.length,
            sampleCount: samples.length,
            sampleSourceCount: sampleSources.size,
            coverageStatus,
            candidateReviewStatus: 'NOT_STARTED',
            productionUsable: false,
            samples
        };
    });
    const stableReport = {
        schemaVersion: 'archive-high-first-wave-validation-v1',
        promotionDigest: promotion.digest,
        productionWriteAllowed: false,
        policy: { minimumQuestionsPerDomain: 50, targetQuestionsPerDomain: 100, diversityPassPerSource: 2 },
        totals: {
            domains: domains.length,
            coverageReady: domains.filter(domain => domain.coverageStatus === 'COVERAGE_READY').length,
            coverageShortfall: domains.filter(domain => domain.coverageStatus === 'COVERAGE_SHORTFALL').length,
            candidateReviewStarted: 0
        },
        domains
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = validateHighFirstWavePilotV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-high-first-wave-validation-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/high-first-wave-validation/archive-high-first-wave-validation-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
