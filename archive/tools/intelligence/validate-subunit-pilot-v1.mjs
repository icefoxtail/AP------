import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';

/**
 * Validate promoted sub-unit pilots without assigning production tags.
 * Evidence is deliberately diagnostic: it measures whether the label and
 * the question/solution text have enough lexical support for a later Luna
 * review. It is not a classifier and cannot approve a key by itself.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const promotionPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-promotion', 'archive-subunit-promotion-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-validation');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const compact = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, '').replace(/[·,\.()[\]{}:;!?/\\+*=<>~%\-]/g, '');
const stopTerms = new Set(['의', '와', '과', '을', '를', '에', '에서', '대한', '구하기', '활용', '뜻', '성질', '계산', '문제', '값']);

function labelTerms(label) {
    const terms = new Set();
    for (const word of String(label ?? '').match(/[가-힣]{2,}/g) ?? []) {
        if (stopTerms.has(word)) continue;
        const compactWord = compact(word);
        terms.add(compactWord);
        for (let size = 2; size <= Math.min(4, compactWord.length); size += 1) {
            for (let index = 0; index <= compactWord.length - size; index += 1) terms.add(compactWord.slice(index, index + size));
        }
    }
    return [...terms].filter(term => term.length >= 2);
}

function termHit(text, terms) {
    const normalized = compact(text);
    return terms.some(term => normalized.includes(term));
}

function ngrams(value, size = 2) {
    const text = compact(value);
    const result = new Set();
    for (let index = 0; index <= text.length - size; index += 1) result.add(text.slice(index, index + size));
    return result;
}

function similarity(leftText, rightText) {
    const left = ngrams(leftText);
    const right = ngrams(rightText);
    if (!left.size || !right.size) return 0;
    let overlap = 0;
    for (const item of left) if (right.has(item)) overlap += 1;
    return overlap / (left.size + right.size - overlap);
}

function sourceLookup() {
    const lookup = new Map();
    for (const file of scanExamBank().files) {
        const sourceArchiveFile = file.sourceFile.replace(/^archive\/exams\//, '');
        for (const question of file.questions) lookup.set(`${sourceArchiveFile}#${question.originalIndex + 1}`, question);
    }
    return lookup;
}

function validateEntry(entry, records, sources) {
    const candidates = records.filter(record => record.standardUnitKey === entry.standardUnitKey);
    const sample = candidates.slice(0, 100);
    const terms = labelTerms(entry.subUnit);
    const scored = sample.map(record => {
        const source = sources.get(`${record.sourceArchiveFile}#${record.sourceOrdinal}`) ?? {};
        const content = `${source.content ?? ''} ${(source.choices ?? []).join(' ')}`;
        const solution = source.solution ?? '';
        return {
            questionUid: record.questionUid,
            contentScore: similarity(entry.subUnit, content),
            solutionScore: similarity(entry.subUnit, solution),
            contentTermHit: termHit(content, terms),
            solutionTermHit: termHit(solution, terms)
        };
    });
    const evidenceHits = scored.filter(item => item.contentTermHit || item.solutionTermHit || Math.max(item.contentScore, item.solutionScore) >= 0.18);
    const independentHits = scored.filter(item => item.contentTermHit && item.solutionTermHit);
    const evidenceRate = sample.length ? evidenceHits.length / sample.length : 0;
    const independentRate = sample.length ? independentHits.length / sample.length : 0;
    return {
        standardUnitKey: entry.standardUnitKey,
        subUnitKey: entry.subUnitKey,
        subUnit: entry.subUnit,
        sampleCount: sample.length,
        evidenceHitCount: evidenceHits.length,
        independentSupportCount: independentHits.length,
        evidenceRate: Number(evidenceRate.toFixed(4)),
        independentSupportRate: Number(independentRate.toFixed(4)),
        status: sample.length >= 50 && independentRate >= 0.35 ? 'PILOT_EVIDENCE_READY' : 'PILOT_REVIEW_REQUIRED',
        productionUsable: false
    };
}

export function validateSubunitPilotV1() {
    const promotion = JSON.parse(fs.readFileSync(promotionPath, 'utf8'));
    const sources = sourceLookup();
    const records = JSON.parse(fs.readFileSync(path.join(archiveDir, '_generated', 'intelligence', 'phase2', 'archive-classification', 'archive-hierarchical-classification-v1.json'), 'utf8')).records;
    const stages = promotion.stages.map(stage => {
        if (stage.stageId === 'high-first-wave') {
            return {
                stageId: stage.stageId,
                status: 'PILOT_REVIEW_REQUIRED',
                entries: stage.entries.map(entry => ({ ...entry, sampleCount: 0, productionUsable: false }))
            };
        }
        const entries = stage.entries.map(entry => validateEntry(entry, records, sources));
        return {
            stageId: stage.stageId,
            status: entries.every(entry => entry.status === 'PILOT_EVIDENCE_READY') ? 'PILOT_EVIDENCE_READY' : 'PILOT_REVIEW_REQUIRED',
            entries
        };
    });
    const stableReport = {
        schemaVersion: 'archive-subunit-pilot-validation-v1',
        promotionDigest: promotion.digest,
        productionWriteAllowed: false,
        sourcePolicy: {
            curriculum: 'NCIC 2022 개정 교육과정 자료',
            textbookReferences: [
                'https://m.book.visang.com/books/info/5967?tab=3',
                'https://thub.kumsung.co.kr/upfiles/cd-rom/middle/15re/original/M_math3/study_library.html'
            ],
            note: '교재 목차 근거와 문항 텍스트 근거는 분리 기록하며, 이 리포트만으로 APPROVED 승격하지 않음'
        },
        totals: {
            stages: stages.length,
            evidenceReadyStages: stages.filter(stage => stage.status === 'PILOT_EVIDENCE_READY').length,
            reviewRequiredStages: stages.filter(stage => stage.status === 'PILOT_REVIEW_REQUIRED').length,
            entries: stages.reduce((sum, stage) => sum + stage.entries.length, 0),
            evidenceReadyEntries: stages.reduce((sum, stage) => sum + stage.entries.filter(entry => entry.status === 'PILOT_EVIDENCE_READY').length, 0)
        },
        stages
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function summaryMarkdown(report) {
    const rows = report.stages.map(stage => `| ${stage.stageId} | ${stage.status} | ${stage.entries.length} | ${stage.entries.filter(entry => entry.status === 'PILOT_EVIDENCE_READY').length} |`).join('\n');
    return `# Archive Sub-unit Pilot Validation v1\n\n- Production write: none\n- Evidence-ready entries: ${report.totals.evidenceReadyEntries}\n\n| Stage | Status | Entries | Evidence-ready |\n|---|---|---:|---:|\n${rows}\n\nThis report is a gate diagnostic, not an automatic approval. Textbook TOC alignment, sample review, and Luna review are still required before APPROVED.\n`;
}

function main() {
    const report = validateSubunitPilotV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-pilot-validation-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-pilot-validation-v1.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/subunit-validation/archive-subunit-pilot-validation-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
