import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

/**
 * Builds a deterministic, review-only Phase 1 metadata pilot.
 * Selection is stratified; candidates remain pending until semantic review.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot');
const metadataInventoryPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'metadata-inventory-latest.json');
const candidatePath = path.join(archiveDir, '_generated', 'tag-enrichment', 'reports', 'tag-candidates.json');
const masterAuditPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'master-audit', 'master-key-integrity-report.json');
const PILOT_SEED = '20260820';

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function sourceTrack(sourceFile) {
    return String(sourceFile || '').split('/')[2] || '(unknown)';
}

function candidateKey(sourceFile, sourceOrdinal) {
    return `${String(sourceFile).replace(/^archive\/exams\//, '')}#${sourceOrdinal}`;
}

function readQuestion(fullPath, sourceOrdinal) {
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(fullPath, 'utf8'), context, { filename: fullPath, timeout: 1000 });
    const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
    if (!Array.isArray(questions)) throw new Error(`questions array not found: ${fullPath}`);
    const question = questions[sourceOrdinal - 1];
    if (!question) throw new Error(`question ordinal ${sourceOrdinal} missing: ${fullPath}`);
    return question;
}

function rank(cohort, questionUid) {
    return sha256(`${PILOT_SEED}:${cohort}:${questionUid}`);
}

function choose(records, selected, cohort, quota, predicate) {
    const candidates = records
        .filter(record => !selected.has(record.questionUid) && predicate(record))
        .sort((a, b) => rank(cohort, a.questionUid).localeCompare(rank(cohort, b.questionUid), 'en'));
    if (candidates.length < quota) throw new Error(`${cohort} requires ${quota} records but only ${candidates.length} are available`);
    const chosen = candidates.slice(0, quota);
    for (const record of chosen) selected.set(record.questionUid, cohort);
    return chosen;
}

function candidateSummary(candidate) {
    return {
        subUnitKeyCandidate: candidate.subUnitKeyCandidate,
        subUnitCandidate: candidate.subUnitCandidate,
        conceptClusterKeyCandidate: candidate.conceptClusterKeyCandidate,
        problemTypeKeyCandidate: candidate.problemTypeKeyCandidate,
        templateKeyCandidate: candidate.templateKeyCandidate,
        difficultyBucketCandidate: candidate.difficultyBucketCandidate,
        tagConfidence: candidate.tagConfidence,
        tagStatus: candidate.tagStatus,
        reasons: candidate.reasons,
        conflicts: candidate.conflicts,
        reviewNotes: candidate.reviewNotes
    };
}

function sourceContext(question) {
    return {
        content: question.content ?? '',
        choices: Array.isArray(question.choices) ? question.choices : [],
        answer: question.answer ?? '',
        solution: question.solution ?? '',
        image: question.image ?? '',
        layoutTag: question.layoutTag ?? '',
        wide: question.wide === true
    };
}

function countBy(items, property) {
    const counts = {};
    for (const item of items) counts[item[property]] = (counts[item[property]] || 0) + 1;
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function renderSummary(report) {
    const cohortRows = Object.entries(report.cohortCounts).map(([name, count]) => `| ${name} | ${count} |`).join('\n');
    const statusRows = Object.entries(report.candidateStatusCounts).map(([name, count]) => `| ${name} | ${count} |`).join('\n');
    return `# Phase 1 Metadata Pilot Review\n\n- Seed: ${report.seed}\n- Records: ${report.items.length}\n- Review-only: yes\n- Master audit gate ready: ${report.masterAudit.gateReady ? 'yes' : 'no'}\n\n## Cohorts\n\n| Cohort | Count |\n|---|---:|\n${cohortRows}\n\n## Candidate Status\n\n| Candidate status | Count |\n|---|---:|\n${statusRows}\n\n## Review protocol\n\nFor every item, verify the existing standard unit against the source context first. Then review each candidate in order: sub-unit, concept, problem type, and template. Mark unknown or manual_review whenever the source does not support a confident decision. No pending candidate may be applied to source JS or runtime metadata.\n\n## Quality gate\n\n- standard/subUnit: at least 98%\n- conceptCluster: at least 97%\n- problemType: at least 95%\n- templateKey: at least 92%\n\nA failed threshold blocks bulk approval; it does not permit lowering the status of source evidence.\n`;
}

export function buildMetadataPilot() {
    const inventory = JSON.parse(fs.readFileSync(metadataInventoryPath, 'utf8'));
    const candidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
    const masterAudit = JSON.parse(fs.readFileSync(masterAuditPath, 'utf8'));
    const candidateByKey = new Map();
    for (const candidate of candidates.candidates || []) {
        const key = candidateKey(candidate.sourceFile, Number(candidate.originalIndex) + 1);
        if (candidateByKey.has(key)) throw new Error(`duplicate tag candidate identity: ${key}`);
        candidateByKey.set(key, candidate);
    }
    const selected = new Map();
    const cohorts = [];
    for (const track of ['m1', 'm2', 'm3', 'h1', 'h2']) {
        cohorts.push(...choose(inventory.records, selected, `track_${track}`, 50, record => sourceTrack(record.sourceArchiveFile) === track));
    }
    cohorts.push(...choose(inventory.records, selected, 'visual', 50, record => record.hasImage));
    cohorts.push(...choose(inventory.records, selected, 'subjective', 50, record => /주관|서답|서술/.test(record.questionType) || !record.choicesPresent));
    cohorts.push(...choose(inventory.records, selected, 'advanced', 50, record => /(?:^|\[)상(?:\]|$)/.test(record.level)));
    if (cohorts.length !== 400) throw new Error(`pilot size must be 400, got ${cohorts.length}`);

    const questionCache = new Map();
    const items = cohorts
        .sort((a, b) => a.questionUid.localeCompare(b.questionUid, 'en'))
        .map(record => {
            const key = candidateKey(record.sourceArchiveFile, record.sourceOrdinal);
            const candidate = candidateByKey.get(key);
            if (!candidate) throw new Error(`candidate missing for ${key}`);
            const fullPath = path.join(archiveDir, 'exams', record.sourceArchiveFile);
            let question = questionCache.get(key);
            if (!question) {
                question = readQuestion(fullPath, record.sourceOrdinal);
                questionCache.set(key, question);
            }
            return {
                questionUid: record.questionUid,
                sourceArchiveFile: record.sourceArchiveFile,
                sourceOrdinal: record.sourceOrdinal,
                sourceQuestionNo: record.sourceQuestionNo,
                cohort: selected.get(record.questionUid),
                existingMetadata: record.metadata,
                existingStatus: {
                    standardKeyClass: record.standardKeyClass,
                    metadataStatus: record.metadataStatus,
                    questionType: record.questionType,
                    level: record.level,
                    hasImage: record.hasImage,
                    choicesPresent: record.choicesPresent
                },
                candidate: candidateSummary(candidate),
                sourceContext: sourceContext(question),
                review: {
                    status: 'pending',
                    standardUnitVerified: null,
                    subUnitDecision: '',
                    conceptDecision: '',
                    problemTypeDecision: '',
                    templateDecision: '',
                    reviewerNote: '',
                    finalDisposition: 'pending'
                }
            };
        });
    const stableReport = {
        schemaVersion: 'phase1-metadata-pilot-v1',
        seed: PILOT_SEED,
        inventoryDigest: inventory.digest,
        candidateSource: 'archive/_generated/tag-enrichment/reports/tag-candidates.json',
        masterAudit: {
            digest: masterAudit.digest,
            gateReady: masterAudit.gateReady,
            findings: masterAudit.findings
        },
        reviewOnly: true,
        cohortCounts: countBy(items, 'cohort'),
        candidateStatusCounts: countBy(items.map(item => ({ status: item.candidate.tagStatus })), 'status'),
        items
    };
    const digest = sha256(JSON.stringify(stableReport));
    return { generatedAt: new Date().toISOString(), digest, ...stableReport };
}

function main() {
    const report = buildMetadataPilot();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'metadata-pilot-20260820.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'metadata-pilot-20260820.summary.md'), renderSummary(report), 'utf8');
    console.log(JSON.stringify({
        output: 'archive/_generated/intelligence/phase1/pilot/metadata-pilot-20260820.json',
        digest: report.digest,
        records: report.items.length,
        cohortCounts: report.cohortCounts,
        candidateStatusCounts: report.candidateStatusCounts,
        masterGateReady: report.masterAudit.gateReady
    }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
