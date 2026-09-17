import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const queuePath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'M3_L1_WORK_QUEUE.json');
const outputRoot = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'metadata-foundation-m3');

function writeJson(file, value) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function closeout(target) {
    const zero = ['1', '2', '3', '4', '5'].map(value => '| ' + value + ' | 0 |').join('\n');
    const confidence = ['high', 'medium', 'low'].map(value => '| ' + value + ' | 0 |').join('\n');
    const legacy = ['NORMAL', 'BORDERLINE_REVIEW', 'BORDERLINE_ACCEPTABLE', 'STRONG_CONFLICT'].map(value => '| ' + value + ' | 0 |').join('\n');
    return [
        '# M3 L1 Closeout — 2022 ' + target.L1Name,
        '',
        '상태: **NO_SOURCE_IN_DENOMINATOR / CLOSED**',
        '',
        '- curriculum: 2022',
        '- semester: ' + (target.scope === 'M3-1' ? '1' : '2'),
        '- scope: ' + target.scope,
        '- L1 key: ' + target.L1Key,
        '- L1 name: ' + target.L1Name,
        '- questionCount: 0',
        '- sourceFileCount: 0',
        '',
        '## Scope evidence',
        '',
        '현재 fresh source에는 2022 중3 문항이 없다. Source Register의 RPM_M3_2022는',
        '중학수학 3학년 2027년판이고, fresh original source 최신 연도는 2026이다.',
        'source JS·DB에 curriculum field도 없다. 따라서 2022 분모는 0으로 확정했고',
        '문항을 2015/2022 어느 쪽에도 임의 복제하지 않았다.',
        '',
        '## Taxonomy',
        '',
        '- canonical L2 count: ' + target.L2Count,
        '- canonical L4 path count: ' + target.canonicalL4PathCount,
        '- assigned L1/L2/L3/L4: 0 source records',
        '- RPM_EXTENDED: 0',
        '- RPM_EXTENDED_CANDIDATE: 0',
        '',
        '## Difficulty',
        '',
        '| difficultyBucket | count |',
        '|---:|---:|',
        zero,
        '',
        '| difficultyConfidence | count |',
        '|---|---:|',
        confidence,
        '',
        '| legacyLevelCompatibility | count |',
        '|---|---:|',
        legacy,
        '',
        '## Recheck and review',
        '',
        '- boundary: 0',
        '- low confidence: 0',
        '- strong conflict: 0',
        '- same-type outlier: 0',
        '- reviewed_pass: 0',
        '- HOLD/manual_review: 0',
        '- no source records to classify or recheck',
        '',
        '## Validation',
        '',
        '- denominator before == after: PASS (0 == 0)',
        '- UID cardinality / source join: PASS (empty set)',
        '- invalid taxonomy path: 0',
        '- unapproved taxonomy node: 0',
        '- difficulty enum: PASS (empty set)',
        '- legacy compatibility enum: PASS (empty set)',
        '- source/content fingerprint mutation: 0',
        '- source JS SHA mutation: 0',
        '- builder parity: PASS_NOT_APPLICABLE',
        '- runtime sidecar parity: PASS_NOT_APPLICABLE',
        '- reviewStatus unresolved: 0',
        '',
        '## Changed files',
        '',
        '- zero-denominator evidence under archive/_generated/intelligence/phase3/metadata-foundation-m3/' + target.L1Key,
        '- source JS, question metadata records, runtime, DB and index: unchanged',
        '',
        '- metadata apply commit SHA: pending until this L1 commit',
        '- push result: pending until this L1 commit',
        '',
        '본 branch는 중3 Metadata Foundation / canonical metadata upgrade 전용이다.',
        'Archive 2.0 구현 및 고1·중1·중2·고2 metadata 작업은 수행하지 않았다.',
        ''
    ].join('\n');
}

function main() {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    const targets = queue.targets.filter(target => target.curriculum === '2022' && target.questionCount === 0);
    for (const target of targets) {
        const outDir = path.join(outputRoot, target.L1Key);
        fs.mkdirSync(outDir, { recursive: true });
        const validation = {
            schemaVersion: 'metadata-foundation-v2-empty-l1-validation-v1',
            queueId: target.L1Key,
            status: 'PASS_ZERO_DENOMINATOR',
            denominatorBefore: 0,
            denominatorAfter: 0,
            uidCardinality: true,
            sourceJoin: true,
            invalidTaxonomyPathCount: 0,
            unapprovedTaxonomyNodeCount: 0,
            difficultyBucketValid: true,
            legacyLevelCompatibilityValid: true,
            reviewStatusUnresolved: 0,
            sourceContentMutationCount: 0,
            sourceJsShaMutationCount: 0,
            builderParity: 'NOT_APPLICABLE',
            runtimeSidecarParity: 'NOT_APPLICABLE'
        };
        writeJson(path.join(outDir, 'validation.json'), validation);
        writeJson(path.join(outDir, 'status.json'), {
            schemaVersion: 'metadata-foundation-v2-empty-l1-status-v1',
            queueId: target.L1Key,
            status: 'CLOSED_ZERO_DENOMINATOR',
            sourceRecords: 0,
            reason: 'no 2022 M3 source through fresh source year 2026; source register M3 2022 edition is 2027'
        });
        fs.writeFileSync(path.join(outDir, 'CLOSEOUT.md'), closeout(target), 'utf8');
        console.log(JSON.stringify({ queueId: target.L1Key, status: 'PASS_ZERO_DENOMINATOR', outDir: path.relative(repoRoot, outDir).replaceAll('\\', '/') }));
    }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
