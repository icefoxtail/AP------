import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Phase 0B: classify qKey collisions without changing source exam JS.
 * The output is provisional evidence for policy review; it is not a UID
 * migration and does not remove any legacy record.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const examsDir = path.join(archiveDir, 'exams');
const inventoryPath = path.join(archiveDir, '_generated', 'intelligence', 'phase0', 'inventory-latest.json');
const outputPath = path.join(archiveDir, '_generated', 'intelligence', 'phase0', 'qkey-collision-review.json');

function runArchiveScript(file, code) {
    const context = {
        window: {},
        console: { log() {}, warn() {}, error() {} }
    };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(code, context, { filename: file });
    return context;
}

function loadQuestions(sourceFile) {
    const fullPath = path.join(examsDir, sourceFile);
    const code = fs.readFileSync(fullPath, 'utf8');
    const context = runArchiveScript(fullPath, code);
    return context.window.questions || context.window.questionBank || context.questions || context.questionBank || [];
}

function fingerprint(question) {
    const canonical = JSON.stringify({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        answer: question?.answer ?? null,
        solution: question?.solution ?? null,
        image: question?.image ?? null
    });
    return crypto.createHash('sha256').update(canonical).digest('hex');
}

function classify(sourceFile, records, fingerprints) {
    const uniqueFingerprints = new Set(fingerprints);
    if (uniqueFingerprints.size === 1) {
        return {
            collisionType: 'A',
            typeLabel: '완전 중복 레코드',
            resolution: 'canonical_uid_only',
            notes: '문항 payload fingerprint가 동일하다. 레거시 qKey는 유지하고 canonical UID에서는 sourceOrdinal으로 구분한다.'
        };
    }
    if (/^(types|generated)\//i.test(sourceFile)) {
        return {
            collisionType: 'C',
            typeLabel: 'generated/type bank 내부 반복',
            resolution: 'canonical_uid_only',
            notes: '동일 type/generated 파일의 반복 묶음이 legacy id를 재사용한다. 두 문항 모두 보존하고 sourceOrdinal을 식별축으로 사용한다.'
        };
    }
    if (/^original\//i.test(sourceFile)) {
        return {
            collisionType: 'B',
            typeLabel: '같은 파일 + 같은 id + 다른 실제 문항',
            resolution: 'canonical_uid_only',
            notes: '학교 기출 원본에서 동일 id가 서로 다른 문항을 가리킨다. 원본 수정·삭제 없이 sourceOrdinal 포함 UID로 역추적한다.'
        };
    }
    return {
        collisionType: 'E',
        typeLabel: 'legacy 구조 오류',
        resolution: 'canonical_uid_only',
        notes: '예상 범위 밖 경로의 충돌이다. 자동 적용하지 않고 구조 검토 대기한다.'
    };
}

const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
const groups = [];
const flatRecords = [];
const errors = [];

for (const collision of inventory.collisions) {
    try {
        const questions = loadQuestions(collision.sourceFile);
        const fingerprints = collision.records.map(record => {
            const question = questions[Number(record.sourceOrdinal) - 1];
            return fingerprint(question);
        });
        const classification = classify(collision.sourceFile, collision.records, fingerprints);
        const group = {
            legacyQKey: collision.qKey,
            sourceFile: collision.sourceFile,
            sourceQuestionCount: collision.records.length,
            collisionType: classification.collisionType,
            typeLabel: classification.typeLabel,
            resolution: classification.resolution,
            resolutionStatus: 'provisional_review_pending',
            notes: classification.notes,
            fingerprints,
            fingerprintDistinct: new Set(fingerprints).size,
            records: collision.records.map((record, index) => ({
                sourceFile: collision.sourceFile,
                legacyQKey: collision.qKey,
                sourceOrdinal: record.sourceOrdinal,
                questionId: String(record.questionId),
                collisionType: classification.collisionType,
                resolution: classification.resolution,
                fingerprint: fingerprints[index],
                notes: classification.notes
            }))
        };
        groups.push(group);
        flatRecords.push(...group.records);
    } catch (error) {
        errors.push({ legacyQKey: collision.qKey, sourceFile: collision.sourceFile, error: error?.message || String(error) });
    }
}

groups.sort((a, b) => a.legacyQKey.localeCompare(b.legacyQKey, 'en'));
flatRecords.sort((a, b) => `${a.legacyQKey}#${a.sourceOrdinal}`.localeCompare(`${b.legacyQKey}#${b.sourceOrdinal}`, 'en'));

const typeCounts = {};
for (const group of groups) typeCounts[group.collisionType] = (typeCounts[group.collisionType] || 0) + 1;

const sourceCommit = execFileSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD']).toString('utf8').trim();
const stableOutput = {
    sourceCommit,
    inventoryDigest: inventory.digest,
    reviewStatus: errors.length ? 'blocked_by_evidence_errors' : 'provisional_review_pending',
    groupCount: groups.length,
    recordCount: flatRecords.length,
    typeCounts,
    errors,
    groups,
    records: flatRecords,
    policy: {
        legacyQKey: 'retain_for_compatibility_only',
        canonicalIdentity: 'sourceArchiveFile + sourceOrdinal + legacyQuestionNo',
        sourceMutation: 'none',
        nextReview: 'Terra or Sol must approve the provisional B/C resolutions before UID propagation.'
    }
};
const output = {
    schemaVersion: 'phase0-collision-review-v1',
    generatedAt: new Date().toISOString(),
    ...stableOutput,
    reviewDigest: crypto.createHash('sha256').update(JSON.stringify(stableOutput)).digest('hex'),
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
    output: path.relative(repoRoot, outputPath).replace(/\\/g, '/'),
    sourceCommit: output.sourceCommit,
    inventoryDigest: output.inventoryDigest,
    reviewDigest: output.reviewDigest,
    reviewStatus: output.reviewStatus,
    groupCount: output.groupCount,
    recordCount: output.recordCount,
    typeCounts: output.typeCounts,
    errors: output.errors.length
}, null, 2));
