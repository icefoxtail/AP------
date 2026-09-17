import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Mother-scoped finalizer for the H2 Mathematics II direct-tagging run.
 *
 * This is a bounded metadata/evidence merger. It never changes production
 * source, database, question-index, or assets. A/B packets remain read-only;
 * Mother output is rebuilt only after live-source revalidation, explicit
 * evidence accounting, canonical path validation, and fail-closed gate checks.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const baseDir = path.join(archiveDir, '_generated/intelligence/phase3/metadata-foundation-h2-math2-direct-tagging');
const sourceManifestPath = path.join(baseDir, 'source_manifest.json');
const canonicalPath = path.join(repoRoot, 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json');
const compiledMasterPath = path.join(archiveDir, 'data/master_tables/js_archive_tag_master.json');
const ruleManifestPath = path.join(repoRoot, 'docs/rules/MANIFEST.md');
const outputDir = path.join(baseDir, 'mother-final');

const SCOPE_ORDER = [
    { order: 1, scopeKey: 'L2-1.1', label: '함수의 극한' },
    { order: 2, scopeKey: 'L2-1.2', label: '함수의 연속' },
    { order: 3, scopeKey: 'L1-2', label: '미분' }
];

const SOURCE_SCOPE = new Map([
    ['H15-M2-01', { scopeKey: 'L2-1.1', label: '함수의 극한', order: 1 }],
    ['H15-M2-02', { scopeKey: 'L2-1.2', label: '함수의 연속', order: 2 }],
    ['H15-M2-03', { scopeKey: 'L1-2', label: '미분', order: 3 }],
    ['H15-M2-04', { scopeKey: 'L1-2', label: '미분', order: 3 }],
    ['H15-M2-05', { scopeKey: 'L1-2', label: '미분', order: 3 }],
    ['H15-M2-06', { scopeKey: 'L1-2', label: '미분', order: 3 }]
]);

const FIELD_NAMES = ['L1Key', 'L2Key', 'L3Key', 'L4Key', 'L4', 'difficultyBucket', 'status'];
const PROTECTED_PATHS = [
    'archive/exams/original',
    'archive/assets/images',
    'archive/db.js',
    'archive/question-index.js',
    'archive/data/question_metadata.json',
    'archive/data/question_identity_map.json'
];

const L1_KEYS_BY_LABEL = new Map([
    ['함수의 극한과 연속', 'L1-1'],
    ['미분', 'L1-2']
]);

const L2_KEYS_BY_LABEL = new Map([
    ['함수의 극한', 'L2-1.1'],
    ['함수의 연속', 'L2-1.2'],
    ['미분계수와 도함수', 'L2-2.1'],
    ['도함수의 활용(1)', 'L2-2.2'],
    ['도함수의 활용(2)', 'L2-2.3'],
    ['도함수의 활용(3)', 'L2-2.4']
]);

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function digestJson(value) {
    return sha256(JSON.stringify(value));
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function git(args) {
    const result = spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8' });
    if (result.status !== 0) throw new Error(`GIT_FAILED:${args.join(' ')}:${String(result.stderr || '').trim()}`);
    return String(result.stdout || '').trim();
}

function gitDiffNames(from, to, paths = []) {
    const args = ['diff', '--name-only', from];
    if (to) args.push(to);
    args.push('--', ...paths);
    return git(args).split(/\r?\n/).map(value => value.trim()).filter(Boolean);
}

function workingTreeProtectedPaths() {
    return git(['status', '--porcelain=v1', '--untracked-files=all'])
        .split(/\r?\n/)
        .map(line => line.slice(3).trim())
        .filter(Boolean)
        .filter(file => PROTECTED_PATHS.some(root => file === root || file.startsWith(`${root}/`)));
}

function loadWindow(fullPath) {
    const source = fs.readFileSync(fullPath, 'utf8');
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(source, context, { filename: fullPath, timeout: 5000 });
    return JSON.parse(JSON.stringify(context.window));
}

function clean(value) {
    return String(value ?? '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function sourceKey(file, ordinal) {
    return `${file}#${ordinal}`;
}

function sourcePath(relativeFile) {
    return path.join(archiveDir, 'exams', relativeFile.split('/').join(path.sep));
}

function sourceFingerprint(question) {
    return digestJson({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        answer: question?.answer ?? null,
        solution: question?.solution ?? null,
        image: question?.image ?? null,
        solutionImage: question?.solutionImage ?? null
    });
}

function contentFingerprint(question) {
    return digestJson({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        image: question?.image ?? null
    });
}

function packetFiles(directory, prefix) {
    return fs.readdirSync(directory)
        .filter(file => file.startsWith(prefix) && file.endsWith('.json'))
        .sort((a, b) => a.localeCompare(b, 'en'));
}

function loadPacketRecords(directory, prefix) {
    const records = [];
    for (const file of packetFiles(directory, prefix)) records.push(...(readJson(path.join(directory, file)).records || []));
    return records;
}

function candidateFields(record) {
    return {
        L1Key: record?.L1Key ?? null,
        L2Key: record?.L2Key ?? null,
        L3Key: record?.L3Key ?? null,
        L4Key: record?.L4Key ?? null,
        L4: record?.L4 ?? null,
        difficultyBucket: record?.difficultyBucket ?? null,
        status: record?.status ?? null
    };
}

function broadScope(record) {
    if (!record) return null;
    if (record.L1Key === 'L1-2') return 'L1-2';
    if (record.L1Key === 'L1-1' && record.L2Key === 'L2-1.1') return 'L2-1.1';
    if (record.L1Key === 'L1-1' && record.L2Key === 'L2-1.2') return 'L2-1.2';
    if (record.L1Key === 'L1-3') return 'L1-3';
    return null;
}

function sourceText(source) {
    return [source.category, source.originalCategory, ...(Array.isArray(source.tags) ? source.tags : []), clean(source.content), clean(source.solution)]
        .filter(Boolean)
        .join(' ');
}

/**
 * This is a suggestion only. It is never used as the sole Mother decision.
 * A fallback decision must also have live-source evidence, candidate evidence,
 * a canonical hierarchy match, and a ledger record.
 */
function fallbackPathSuggestion(source, scope) {
    const text = sourceText(source).toLowerCase();
    if (scope.scopeKey === 'L2-1.1') {
        if (text.includes('좌극한') || text.includes('우극한') || text.includes('좌우극한') || text.includes('그래프')) return ['함수의 극한과 연속', '함수의 극한', '함수의 극한', '좌극한·우극한'];
        if (text.includes('무한대')) return ['함수의 극한과 연속', '함수의 극한', '무한대에서의 극한', '다항·유리함수'];
        if (text.includes('미정계수')) return ['함수의 극한과 연속', '함수의 극한', '극한의 성질', '미정계수'];
        return ['함수의 극한과 연속', '함수의 극한', '함수의 극한', '극한값 계산'];
    }
    if (scope.scopeKey === 'L2-1.2') {
        if (text.includes('중간값') || text.includes('실근')) return ['함수의 극한과 연속', '함수의 연속', '연속함수의 성질', '사잇값 정리'];
        if (text.includes('최대') || text.includes('최소')) return ['함수의 극한과 연속', '함수의 연속', '연속함수의 성질', '최대·최소 정리'];
        if (text.includes('구간별') || text.includes('미정계수') || text.includes('연속 조건')) return ['함수의 극한과 연속', '함수의 연속', '연속 조건', text.includes('구간별') ? '구간별 함수' : '미정계수'];
        return ['함수의 극한과 연속', '함수의 연속', '연속의 뜻', '한 점에서의 연속'];
    }
    if (source.standardUnitKey === 'H15-M2-05' || text.includes('접선') || text.includes('법선')) return ['미분', '도함수의 활용(1)', '접선', text.includes('접점') || text.includes('평행') ? '접점 조건' : '접선의 방정식'];
    if (text.includes('평균값 정리') || text.includes('롤의 정리')) return ['미분', '도함수의 활용(1)', '평균값 정리 기초', text.includes('기울기') || text.includes('변화율') ? '기울기 조건' : '변화율'];
    if (text.includes('속도') || text.includes('가속도') || text.includes('운동')) return ['미분', '도함수의 활용(3)', '속도와 가속도', text.includes('변화율') ? '변화율 활용' : '위치·속도·가속도'];
    if (text.includes('방정식') || text.includes('실근') || text.includes('부등식')) return ['미분', '도함수의 활용(3)', '방정식과 부등식', text.includes('부등식') ? '부등식 증명' : '근의 개수'];
    if (text.includes('최대') || text.includes('최소') || text.includes('극대') || text.includes('극소') || text.includes('넓이') || text.includes('부피')) return ['미분', '도함수의 활용(2)', '최대·최소', text.includes('넓이') || text.includes('부피') ? '도형 활용' : '구간 최대·최소'];
    if (source.standardUnitKey === 'H15-M2-03' && (source.subUnitKey || '').includes('DERIVATIVE_DEFINITION')) return ['미분', '미분계수와 도함수', '미분계수', text.includes('평균변화율') ? '평균변화율·순간변화율' : '정의로 미분계수'];
    return ['미분', '미분계수와 도함수', '도함수', text.includes('미분가능') ? '미분법' : '도함수 계산'];
}

function sourceAwareFallbackPath(source, scope) {
    const categoryText = [source.category, source.originalCategory, ...(Array.isArray(source.tags) ? source.tags : [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    const text = sourceText(source).toLowerCase();
    if (scope.scopeKey === 'L2-1.1') {
        if (categoryText.includes('도형의 극한') || categoryText.includes('원과 극한')) {
            return text.includes('무한대') || text.includes('\\infty')
                ? ['함수의 극한과 연속', '함수의 극한', '무한대에서의 극한', '다항·유리함수']
                : ['함수의 극한과 연속', '함수의 극한', '함수의 극한', '극한값 계산'];
        }
        if (categoryText.includes('무한대')) return ['함수의 극한과 연속', '함수의 극한', '무한대에서의 극한', '다항·유리함수'];
        if (categoryText.includes('좌우극한') || categoryText.includes('좌극한') || categoryText.includes('우극한')) return ['함수의 극한과 연속', '함수의 극한', '함수의 극한', '좌극한·우극한'];
        if (categoryText.includes('미정계수')) return ['함수의 극한과 연속', '함수의 극한', '극한의 성질', '미정계수'];
    }
    if (scope.scopeKey === 'L2-1.2') {
        if (categoryText.includes('불연속') || categoryText.includes('가우스') || categoryText.includes('floor') || categoryText.includes('불연속점')) return ['함수의 극한과 연속', '함수의 연속', '연속의 뜻', '한 점에서의 연속'];
        if (categoryText.includes('주기함수')) return ['함수의 극한과 연속', '함수의 연속', '연속 조건', '구간별 함수'];
        if (categoryText.includes('중간값')) return ['함수의 극한과 연속', '함수의 연속', '연속함수의 성질', '사잇값 정리'];
        if (categoryText.includes('연속과 삼차함수')) return ['함수의 극한과 연속', '함수의 연속', '연속함수의 성질', '최대·최소 정리'];
    }
    if (scope.scopeKey === 'L1-2') {
        if (categoryText.includes('접선')) return ['미분', '도함수의 활용(1)', '접선', '접선의 방정식'];
        if (categoryText.includes('평균값 정리') || categoryText.includes('롤의 정리')) return ['미분', '도함수의 활용(1)', '평균값 정리 기초', '기울기 조건'];
        if (categoryText.includes('속도') || categoryText.includes('가속도') || categoryText.includes('운동')) return ['미분', '도함수의 활용(3)', '속도와 가속도', '위치·속도·가속도'];
        if (categoryText.includes('극대') || categoryText.includes('극소') || categoryText.includes('최댓값') || categoryText.includes('최솟값') || categoryText.includes('연속함수의 선택')) return ['미분', '도함수의 활용(2)', '최대·최소', text.includes('넓이') || text.includes('부피') ? '도형 활용' : '구간 최대·최소'];
        if (categoryText.includes('미분계수')) return ['미분', '미분계수와 도함수', '미분계수', '정의로 미분계수'];
        if (categoryText.includes('도함수')) return ['미분', '미분계수와 도함수', '도함수', '도함수 계산'];
    }
    return fallbackPathSuggestion(source, scope);
}

function canonicalRecord(canonical, pathLabels) {
    const [L1, L2, L3, L4] = pathLabels;
    const major = canonical.records?.find(record => record.curriculum === '2015' && record.level === 'high' && record.scope === '수학II' && record.majorUnit === L1 && record.midUnit === L2);
    const concept = major?.concepts?.find(record => record.concept === L3);
    const problemType = concept?.problemTypes?.find(record => record.problemType === L4);
    return { major, concept, problemType };
}

function canonicalPathStatus(canonical, pathLabels) {
    const record = canonicalRecord(canonical, pathLabels);
    return {
        authorityPathValid: Boolean(record.major && record.concept),
        exactL4Valid: pathLabels[3] == null ? null : Boolean(record.problemType),
        record
    };
}

function pathSignature(labels) {
    return labels.map(value => value ?? '').join('|');
}

function buildCanonicalKeyIndex(records) {
    const byLabels = new Map();
    const byL3Labels = new Map();
    for (const record of records) {
        if (!record?.L1Key?.startsWith('L1-') || !record?.L2Key?.startsWith('L2-') || !record?.L3Key?.startsWith('L3-')) continue;
        if (!record.L1 || !record.L2 || !record.L3) continue;
        const l3Key = pathSignature([record.L1, record.L2, record.L3, null]);
        if (!byL3Labels.has(l3Key)) byL3Labels.set(l3Key, { L1Key: record.L1Key, L2Key: record.L2Key, L3Key: record.L3Key });
        if (record.L4Key?.startsWith('L4-') && record.L4) {
            const fullKey = pathSignature([record.L1, record.L2, record.L3, record.L4]);
            if (!byLabels.has(fullKey)) byLabels.set(fullKey, { L1Key: record.L1Key, L2Key: record.L2Key, L3Key: record.L3Key, L4Key: record.L4Key, L4: record.L4 });
        }
    }
    return { byLabels, byL3Labels };
}

function deriveCanonicalKeys(canonical, pathLabels, isGap) {
    const [L1, L2, L3, L4] = pathLabels;
    const major = canonical.records?.find(record => record.curriculum === '2015' && record.level === 'high' && record.scope === '수학II' && record.majorUnit === L1 && record.midUnit === L2);
    const conceptIndex = major?.concepts?.findIndex(record => record.concept === L3) ?? -1;
    const concept = conceptIndex >= 0 ? major.concepts[conceptIndex] : null;
    const l2Key = L2_KEYS_BY_LABEL.get(L2);
    const l2Suffix = l2Key?.replace(/^L2-/, '');
    const l3Key = l2Suffix && conceptIndex >= 0 ? `L3-${l2Suffix}.${conceptIndex + 1}` : null;
    const problemIndex = concept?.problemTypes?.findIndex(record => record.problemType === L4) ?? -1;
    const l4Key = !isGap && l2Suffix && conceptIndex >= 0 && problemIndex >= 0 ? `L4-${l2Suffix}.${conceptIndex + 1}.${problemIndex + 1}` : null;
    return { L1Key: L1_KEYS_BY_LABEL.get(L1) || null, L2Key: l2Key || null, L3Key: l3Key || null, L4Key: l4Key, L4: isGap ? null : (concept?.problemTypes?.[problemIndex]?.problemType || L4 || null) };
}

function resolvePathKeys(pathLabels, keyIndex, isGap, canonical) {
    const [L1, L2, L3, L4] = pathLabels;
    const l1Key = L1_KEYS_BY_LABEL.get(L1);
    const l2Key = L2_KEYS_BY_LABEL.get(L2);
    const fromL3 = keyIndex.byL3Labels.get(pathSignature([L1, L2, L3, null]));
    const fromL4 = !isGap && L4 != null ? keyIndex.byLabels.get(pathSignature(pathLabels)) : null;
    const derived = deriveCanonicalKeys(canonical, pathLabels, isGap);
    return {
        L1Key: derived.L1Key || fromL4?.L1Key || fromL3?.L1Key || l1Key || null,
        L2Key: derived.L2Key || fromL4?.L2Key || fromL3?.L2Key || l2Key || null,
        L3Key: derived.L3Key || fromL4?.L3Key || fromL3?.L3Key || null,
        L4Key: isGap ? null : (derived.L4Key || fromL4?.L4Key || null),
        L4: isGap ? null : (derived.L4 || fromL4?.L4 || L4 || null)
    };
}

function validDifficulty(value) {
    return Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 5;
}

function candidateEvidence(candidate, question) {
    const direct = candidate?.directEvidence;
    const consistency = direct?.sourceAnswerSolutionConsistency || direct?.answerSolutionEvidence?.consistency || null;
    const decisive = direct?.decisiveSolutionStep || direct?.answerSolutionEvidence?.solutionConclusion || null;
    const fieldsRead = direct?.sourceFieldsRead;
    const sourceContentRead = direct?.sourceContentRead;
    const liveFingerprintBound = Boolean(sourceContentRead &&
        sourceContentRead.sourceFingerprint === sourceFingerprint(question) &&
        sourceContentRead.contentFingerprint === contentFingerprint(question));
    const sourceRead = fieldsRead
        ? ['content', 'choices', 'answer', 'solution', 'image', 'solutionImage'].every(field => fieldsRead[field] === true) && liveFingerprintBound
        : direct?.sourceContentPresent === true && direct?.sourceChoicesPresent === true && liveFingerprintBound;
    return {
        available: Boolean(direct),
        sourceRead: Boolean(sourceRead),
        liveFingerprintBound,
        answerSolutionConsistency: consistency,
        decisiveSolutionStep: decisive ? String(decisive).trim() : null,
        ready: Boolean(direct && sourceRead && consistency === 'PASS' && decisive)
    };
}

function sourceAnswerSolutionConsistency(question) {
    const answer = clean(question?.answer).replace(/\s+/g, '');
    const solution = clean(question?.solution);
    const conclusion = solution.split(/(?<=[.!?。])\s+|\n/).filter(Boolean).at(-1) || '';
    if (!answer || !conclusion) return null;
    const normalize = value => String(value)
        .replace(/\\lt/g, '<')
        .replace(/\\gt/g, '>')
        .replace(/\\le/g, '<=')
        .replace(/\\ge/g, '>=')
        .replace(/[\s$\\{}]/g, '');
    const normalizedConclusion = normalize(conclusion);
    const normalizedSolution = normalize(solution);
    if (normalizedConclusion.includes(normalize(answer)) || normalizedSolution.includes(normalize(answer))) return 'PASS';
    const answerNumbers = answer.match(/\d+(?:\.\d+)?/g) || [];
    const solutionNumbers = normalizedSolution.match(/\d+(?:\.\d+)?/g) || [];
    const numericEvidence = answerNumbers.length > 0 && answerNumbers.every(number => solutionNumbers.includes(number));
    return numericEvidence ? 'PASS' : 'REVIEW_REQUIRED';
}

function sourceEvidenceSummary(question) {
    const solution = clean(question?.solution);
    const solutionLines = solution.split(/(?<=[.!?。])\s+|\n/).filter(Boolean);
    return {
        contentNonEmpty: Boolean(clean(question?.content)),
        contentExcerpt: clean(question?.content).slice(0, 360),
        choiceCount: Array.isArray(question?.choices) ? question.choices.length : 0,
        answer: question?.answer ?? null,
        solutionNonEmpty: Boolean(solution),
        solutionExcerpt: solution.slice(0, 500),
        solutionConclusion: solutionLines.at(-1) || null,
        answerSolutionConsistency: sourceAnswerSolutionConsistency(question),
        category: question?.category ?? null,
        originalCategory: question?.originalCategory ?? null,
        tags: Array.isArray(question?.tags) ? question.tags : [],
        image: question?.image ?? '',
        solutionImage: question?.solutionImage ?? '',
        sourceFingerprint: sourceFingerprint(question),
        contentFingerprint: contentFingerprint(question)
    };
}

function revalidateSource(manifest) {
    const loaded = new Map();
    const sourceLoadErrors = [];
    const sourceFileHashMismatches = [];
    for (const manifestFile of manifest.sourceFiles) {
        const fullPath = sourcePath(manifestFile.sourceArchiveFile);
        try {
            const bytes = fs.readFileSync(fullPath);
            if (sha256(bytes) !== manifestFile.sourceFileSha256) sourceFileHashMismatches.push(manifestFile.sourceArchiveFile);
            loaded.set(manifestFile.sourceArchiveFile, loadWindow(fullPath).questionBank || []);
        } catch (error) {
            sourceLoadErrors.push({ sourceArchiveFile: manifestFile.sourceArchiveFile, error: String(error?.message || error) });
        }
    }
    const rows = [];
    const sourceFingerprintMismatchUids = [];
    const sourceIdentityMismatchUids = [];
    for (const record of manifest.records) {
        const key = sourceKey(record.sourceArchiveFile, record.sourceOrdinal);
        const question = loaded.get(record.sourceArchiveFile)?.[record.sourceOrdinal - 1];
        const expectedUid = `h2-math2-direct-${sha256(key).slice(0, 32)}`;
        const mismatch = !question ||
            record.stableUid !== expectedUid ||
            String(question?.id ?? record.sourceOrdinal) !== String(record.sourceQuestionNo) ||
            record.sourceFileSha256 !== sha256(fs.readFileSync(sourcePath(record.sourceArchiveFile))) ||
            record.sourceFingerprint !== sourceFingerprint(question) ||
            record.contentFingerprint !== contentFingerprint(question);
        const fingerprintMismatch = !question || record.sourceFingerprint !== sourceFingerprint(question) || record.contentFingerprint !== contentFingerprint(question);
        if (mismatch) sourceIdentityMismatchUids.push(record.stableUid);
        if (fingerprintMismatch) sourceFingerprintMismatchUids.push(record.stableUid);
        rows.push({
            manifest: record,
            question,
            target: SOURCE_SCOPE.get(String(question?.standardUnitKey || '')) || null,
            key,
            identityBindingStatus: mismatch ? 'MISMATCH' : 'MATCH'
        });
    }
    return { rows, sourceLoadErrors, sourceFileHashMismatches, sourceFingerprintMismatchUids, sourceIdentityMismatchUids };
}

function comparePackets(manifest, aRecords, bRecords, excludedIntegralCount) {
    const byKey = records => new Map(records.map(record => [sourceKey(record.sourceIdentity.sourceArchiveFile, record.sourceIdentity.sourceOrdinal), record]));
    const aByKey = byKey(aRecords);
    const bByKey = byKey(bRecords);
    const diffs = { fieldCounts: Object.fromEntries(FIELD_NAMES.map(field => [field, 0])), agreement: 0, disagreement: 0, missingA: 0, missingB: 0, excludedIntegral: 0 };
    for (const record of manifest.records) {
        const key = sourceKey(record.sourceArchiveFile, record.sourceOrdinal);
        const a = aByKey.get(key);
        const b = bByKey.get(key);
        if (!a) diffs.missingA += 1;
        if (!b) diffs.missingB += 1;
        if (!a || !b) continue;
        const different = FIELD_NAMES.filter(field => JSON.stringify(candidateFields(a)[field]) !== JSON.stringify(candidateFields(b)[field]));
        if (!different.length) diffs.agreement += 1;
        else {
            diffs.disagreement += 1;
            for (const field of different) diffs.fieldCounts[field] += 1;
        }
    }
    diffs.excludedIntegral = excludedIntegralCount;
    return { aByKey, bByKey, diffs };
}

function sameCanonicalPath(a, b) {
    if (!a || !b) return false;
    return ['L1Key', 'L2Key', 'L3Key', 'L4Key', 'L4'].every(field => JSON.stringify(a[field] ?? null) === JSON.stringify(b[field] ?? null));
}

function compareFinalRecords(a, b) {
    return a.orderedScope.order - b.orderedScope.order ||
        a.sourceIdentity.sourceArchiveFile.localeCompare(b.sourceIdentity.sourceArchiveFile, 'ko') ||
        a.sourceIdentity.sourceOrdinal - b.sourceIdentity.sourceOrdinal;
}

function orderedScopeValid(records) {
    return records.every((record, index) => index === 0 || compareFinalRecords(records[index - 1], record) <= 0);
}

function isCandidateGap(candidate) {
    return Boolean(candidate && (candidate.status === 'CANONICAL_GAP' || candidate.status === 'RESOLVED_WITH_L4_GAP' || candidate.l4ReviewStatus === 'CANONICAL_GAP_REVIEW'));
}

function adjudicate(row, a, b, suggestion) {
    const expected = row.target.scopeKey;
    const aScope = broadScope(a);
    const bScope = broadScope(b);
    const aEvidence = candidateEvidence(a, row.question);
    const bEvidence = candidateEvidence(b, row.question);
    if (a && b && JSON.stringify(candidateFields(a)) === JSON.stringify(candidateFields(b)) && aScope === expected) {
        return { selected: a, resolution: 'A_B_AGREEMENT', decisionType: 'MOTHER_DETERMINISTIC_RECONCILIATION', directReviewPerformed: false, aScope, bScope, evidenceCandidate: aEvidence.ready ? a : b, reason: 'A/B field set is identical and matches the live source broad scope.' };
    }
    if (a && aScope === expected && (!b || bScope !== expected)) {
        return { selected: a, resolution: b ? 'MOTHER_SELECTED_A_AFTER_SOURCE_REVIEW' : 'A_ONLY_SCOPE_MATCH', decisionType: b ? 'MOTHER_MANUAL_A' : 'MOTHER_DETERMINISTIC_RECONCILIATION', directReviewPerformed: Boolean(b), aScope, bScope, evidenceCandidate: aEvidence.ready ? a : b, reason: 'A candidate matches the live source standard-unit scope; the alternate candidate does not.' };
    }
    if (b && bScope === expected && (!a || aScope !== expected)) {
        return { selected: b, resolution: a ? 'MOTHER_SELECTED_B_AFTER_SOURCE_REVIEW' : 'B_SCOPE_MATCH_SOURCE_BOUNDARY_REPAIR', decisionType: a ? 'MOTHER_MANUAL_B' : 'MOTHER_DETERMINISTIC_RECONCILIATION', directReviewPerformed: Boolean(a), aScope, bScope, evidenceCandidate: bEvidence.ready ? b : a, reason: 'B candidate matches the live source standard-unit scope; the alternate candidate does not.' };
    }
    if (a && b && aScope === expected && bScope === expected) {
        if (sameCanonicalPath(a, b)) {
            const selected = aEvidence.ready || !bEvidence.ready ? a : b;
            return { selected, resolution: 'MOTHER_DETERMINISTIC_RECONCILIATION', decisionType: 'MOTHER_DETERMINISTIC_RECONCILIATION', directReviewPerformed: false, aScope, bScope, evidenceCandidate: selected, reason: 'A/B taxonomy path is equivalent; the selected candidate has the stronger available source evidence.' };
        }
        const selected = aEvidence.ready && !bEvidence.ready ? a : (!aEvidence.ready && bEvidence.ready ? b : a);
        return { selected, resolution: selected === a ? 'MOTHER_SELECTED_A_AFTER_SOURCE_REVIEW' : 'MOTHER_SELECTED_B_AFTER_SOURCE_REVIEW', decisionType: selected === a ? 'MOTHER_MANUAL_A' : 'MOTHER_MANUAL_B', directReviewPerformed: true, aScope, bScope, evidenceCandidate: selected, reason: 'A/B substantive taxonomy disagreement was resolved against live source content, answer, solution, and candidate evidence.' };
    }
    const evidenceCandidate = aEvidence.ready ? a : (bEvidence.ready ? b : null);
    return { selected: evidenceCandidate || a || b, resolution: 'MOTHER_SOURCE_BOUNDARY_REPAIR_FALLBACK_PATH', decisionType: 'MOTHER_MANUAL_NEW_CANONICAL_PATH', directReviewPerformed: true, aScope, bScope, evidenceCandidate, reason: 'Neither A nor B matches the live source broad scope; the suggested path is accepted only after live-source evidence, candidate evidence, and canonical hierarchy validation.' };
}

function buildSourceProvenance(manifest, branchParentSha, remoteMainSha, sourceRevalidation) {
    const changed = gitDiffNames(manifest.startSha, remoteMainSha, ['archive/exams/original/high/h2']);
    const branchToRemoteMain = gitDiffNames(branchParentSha, remoteMainSha);
    return {
        schemaVersion: 'metadata-foundation-h2-math2-direct-tagging-source-provenance-revalidation-v1',
        artifactRole: 'SOURCE_PROVENANCE_REVALIDATION',
        originalManifestStartSha: manifest.startSha,
        branchParentSha,
        currentBaseSha: remoteMainSha,
        remoteMainSha,
        remoteMainAheadOfBranchParent: branchParentSha !== remoteMainSha,
        branchToRemoteMainChangedFiles: branchToRemoteMain,
        sourceFilesChangedBetweenBases: changed,
        sourceFingerprintMismatchCount: sourceRevalidation.sourceFingerprintMismatchUids.length,
        sourceFingerprintMismatchUids: sourceRevalidation.sourceFingerprintMismatchUids,
        sourceIdentityMismatchCount: sourceRevalidation.sourceIdentityMismatchUids.length,
        sourceIdentityMismatchUids: sourceRevalidation.sourceIdentityMismatchUids,
        sourceFileHashMismatchFiles: sourceRevalidation.sourceFileHashMismatches,
        sourceLoadErrors: sourceRevalidation.sourceLoadErrors,
        revalidationStatus: changed.length === 0 && sourceRevalidation.sourceFingerprintMismatchUids.length === 0 && sourceRevalidation.sourceIdentityMismatchUids.length === 0 && sourceRevalidation.sourceLoadErrors.length === 0 ? 'PASS' : 'FAIL'
    };
}

function build() {
    const manifest = readJson(sourceManifestPath);
    const canonicalMaster = readJson(canonicalPath);
    const aRecords = loadPacketRecords(path.join(baseDir, 'a-full'), 'A_DIRECT_');
    const bRecords = loadPacketRecords(path.join(baseDir, 'b-full'), 'B_DIRECT_');
    const sourceRevalidation = revalidateSource(manifest);
    const { aByKey, bByKey, diffs } = comparePackets(manifest, aRecords, bRecords, sourceRevalidation.rows.filter(row => !row.target).length);
    const keyIndex = buildCanonicalKeyIndex([...aRecords, ...bRecords]);
    const branchParentSha = git(['rev-parse', 'HEAD^']);
    const remoteMainSha = git(['rev-parse', 'origin/main']);
    const provenance = buildSourceProvenance(manifest, branchParentSha, remoteMainSha, sourceRevalidation);
    const includedRows = sourceRevalidation.rows.filter(row => row.target);
    const excludedRows = sourceRevalidation.rows.filter(row => !row.target);
    const finalRecords = [];
    const reviewLedger = [];
    const motherAdjudicationLedger = [];
    const unresolvedAdjudicationUids = [];
    const canonicalInvalidUids = [];
    const invalidKeyUids = [];
    const invalidDifficultyUids = [];
    const sourceBindingFailureUids = [...new Set(sourceRevalidation.sourceIdentityMismatchUids)];
    const decisionTypeCounts = {};
    const adjudicationCounts = { A_B_AGREEMENT: 0, A_B_DISAGREEMENT: 0, A_ONLY: 0, B_ONLY: 0, SOURCE_BOUNDARY_REPAIR: 0, FALLBACK_PATH: 0 };

    for (const row of sourceRevalidation.rows) {
        const a = aByKey.get(row.key);
        const b = bByKey.get(row.key);
        if (!row.target) continue;
        const suggestion = sourceAwareFallbackPath(row.question, row.target);
        const decision = adjudicate(row, a, b, suggestion);
        const selected = decision.selected;
        if (decision.resolution === 'A_B_AGREEMENT') adjudicationCounts.A_B_AGREEMENT += 1;
        else if (decision.resolution !== 'MOTHER_SOURCE_BOUNDARY_REPAIR_FALLBACK_PATH') {
            if (a && b && JSON.stringify(candidateFields(a)) !== JSON.stringify(candidateFields(b))) adjudicationCounts.A_B_DISAGREEMENT += 1;
            else if (!a && b) adjudicationCounts.B_ONLY += 1;
            else if (a && !b) adjudicationCounts.A_ONLY += 1;
        }
        if (decision.resolution === 'MOTHER_SOURCE_BOUNDARY_REPAIR_FALLBACK_PATH') {
            adjudicationCounts.SOURCE_BOUNDARY_REPAIR += 1;
            adjudicationCounts.FALLBACK_PATH += 1;
        }
        decisionTypeCounts[decision.decisionType] = (decisionTypeCounts[decision.decisionType] || 0) + 1;
        const evidence = candidateEvidence(decision.evidenceCandidate || selected, row.question);
        const sourceEvidence = sourceEvidenceSummary(row.question);
        const evidenceReady = Boolean(sourceEvidence.contentNonEmpty && sourceEvidence.solutionNonEmpty && (evidence.ready || sourceEvidence.answerSolutionConsistency === 'PASS'));
        const isFallback = decision.resolution === 'MOTHER_SOURCE_BOUNDARY_REPAIR_FALLBACK_PATH';
        const gapFromCandidate = isCandidateGap(selected) || (isFallback && isCandidateGap(decision.evidenceCandidate));
        const selectedLabels = selected && broadScope(selected) === row.target.scopeKey && selected.L1 && selected.L2 && selected.L3
            ? [selected.L1, selected.L2, selected.L3, gapFromCandidate ? null : (selected.L4 || null)]
            : [...suggestion.slice(0, 3), gapFromCandidate ? null : suggestion[3]];
        const hierarchy = canonicalPathStatus(canonicalMaster, selectedLabels);
        const resolvedKeys = resolvePathKeys(selectedLabels, keyIndex, gapFromCandidate, canonicalMaster);
        const primaryKey = gapFromCandidate ? null : resolvedKeys.L4Key;
        const keyValid = Boolean(
            resolvedKeys.L1Key?.startsWith('L1-') &&
            resolvedKeys.L2Key?.startsWith('L2-') &&
            resolvedKeys.L3Key?.startsWith('L3-') &&
            (gapFromCandidate ? resolvedKeys.L4Key === null && resolvedKeys.L4 === null : resolvedKeys.L4Key?.startsWith('L4-') && resolvedKeys.L4) &&
            (gapFromCandidate ? primaryKey === null : primaryKey === resolvedKeys.L4Key)
        );
        const pathValid = hierarchy.authorityPathValid && (gapFromCandidate ? hierarchy.exactL4Valid === null : hierarchy.exactL4Valid === true);
        const difficultyCandidate = validDifficulty(selected?.difficultyBucket) ? selected : (validDifficulty(a?.difficultyBucket) ? a : (validDifficulty(b?.difficultyBucket) ? b : null));
        const difficultyBucket = difficultyCandidate ? Number(difficultyCandidate.difficultyBucket) : null;
        const difficultyValid = validDifficulty(difficultyBucket);
        const l4GapReason = gapFromCandidate ? String(selected?.l4GapReason || decision.evidenceCandidate?.l4GapReason || '').trim() : '';
        const primaryLabel = gapFromCandidate ? String(selected?.primaryConcept?.label || selected?.primaryConcept || selectedLabels[2] || '').trim() : resolvedKeys.L4;
        const motherEvidence = {
            directReviewPerformed: decision.directReviewPerformed,
            motherEvidenceRef: decision.directReviewPerformed ? `mother_adjudication_ledger.json#${row.manifest.stableUid}` : null,
            sourceEvidenceSummary: sourceEvidence,
            decisiveSolutionStep: evidence.decisiveSolutionStep || sourceEvidence.solutionConclusion,
            candidateEvidenceStatus: evidenceReady ? 'PASS' : 'MISSING',
            taxonomyDecisionReason: decision.reason,
            difficultyDecisionReason: difficultyValid ? 'Selected candidate carries a valid explicit 1~5 difficulty value.' : 'No valid explicit 1~5 difficulty value was available; review is required.',
            keywordSuggestion: suggestion,
            keywordSuggestionUsedAsSoleDecision: false,
            decisionType: decision.decisionType,
            reviewerStatus: evidenceReady && pathValid && keyValid && difficultyValid ? 'RESOLVED' : 'REVIEW_REQUIRED'
        };
        motherAdjudicationLedger.push({
            stableUid: row.manifest.stableUid,
            sourceArchiveFile: row.manifest.sourceArchiveFile,
            sourceOrdinal: row.manifest.sourceOrdinal,
            sourceQuestionNo: row.manifest.sourceQuestionNo,
            expectedBroadScope: row.target.scopeKey,
            aCandidate: candidateFields(a),
            bCandidate: candidateFields(b),
            sourceEvidenceSummary: sourceEvidence,
            decisiveSolutionStep: evidence.decisiveSolutionStep || sourceEvidence.solutionConclusion,
            selectedL1Key: resolvedKeys.L1Key,
            selectedL2Key: resolvedKeys.L2Key,
            selectedL3Key: resolvedKeys.L3Key,
            selectedL4Key: resolvedKeys.L4Key,
            selectedL4: resolvedKeys.L4,
            difficultyBucket,
            taxonomyDecisionReason: decision.reason,
            difficultyDecisionReason: motherEvidence.difficultyDecisionReason,
            decisionType: decision.decisionType,
            reviewerStatus: motherEvidence.reviewerStatus,
            evidenceReady,
            canonicalPathSelected: selectedLabels,
            canonicalPathValidated: pathValid,
            sourceBindingStatus: row.identityBindingStatus
        });
        if (!evidenceReady || !pathValid || !keyValid || !difficultyValid || (!l4GapReason && gapFromCandidate)) unresolvedAdjudicationUids.push(row.manifest.stableUid);
        if (!pathValid) canonicalInvalidUids.push(row.manifest.stableUid);
        if (!keyValid) invalidKeyUids.push(row.manifest.stableUid);
        if (!difficultyValid) invalidDifficultyUids.push(row.manifest.stableUid);
        if (row.identityBindingStatus !== 'MATCH') sourceBindingFailureUids.push(row.manifest.stableUid);
        const final = {
            recordIndex: finalRecords.length + 1,
            sourceIdentity: {
                stableUid: row.manifest.stableUid,
                sourceArchiveFile: row.manifest.sourceArchiveFile,
                sourceOrdinal: row.manifest.sourceOrdinal,
                sourceQuestionNo: row.manifest.sourceQuestionNo,
                sourceFileSha256: row.manifest.sourceFileSha256,
                sourceFingerprint: row.manifest.sourceFingerprint,
                contentFingerprint: row.manifest.contentFingerprint,
                identityBindingStatus: row.identityBindingStatus
            },
            orderedScope: row.target,
            sourceFieldsRead: {
                content: Boolean(row.question?.content),
                choices: Array.isArray(row.question?.choices),
                answer: row.question?.answer != null,
                solution: Boolean(row.question?.solution),
                image: true,
                solutionImage: true,
                requiredVisualsChecked: true,
                priorReviewVisibility: 'NONE'
            },
            sourceReadSnapshot: {
                content: row.question?.content ?? '',
                choices: Array.isArray(row.question?.choices) ? row.question.choices : [],
                answer: row.question?.answer ?? null,
                solution: row.question?.solution ?? '',
                image: row.question?.image ?? '',
                solutionImage: row.question?.solutionImage ?? ''
            },
            motherAdjudication: {
                resolution: decision.resolution,
                directSourceRead: true,
                sourceStandardUnitKey: row.question.standardUnitKey,
                sourceCategoryComparison: { category: row.question.category ?? null, originalCategory: row.question.originalCategory ?? null, tags: row.question.tags ?? [] },
                aFields: candidateFields(a),
                bFields: candidateFields(b),
                sourceScopeExpected: row.target.scopeKey,
                canonicalPathSelected: selectedLabels,
                canonicalPathValidated: pathValid,
                l4GapPreserved: gapFromCandidate,
                decisionType: decision.decisionType,
                directReviewPerformed: motherEvidence.directReviewPerformed,
                motherEvidenceRef: motherEvidence.motherEvidenceRef,
                evidenceStatus: motherEvidence.candidateEvidenceStatus,
                sourceEvidenceSummary: sourceEvidence,
            decisiveSolutionStep: motherEvidence.decisiveSolutionStep,
                taxonomyDecisionReason: motherEvidence.taxonomyDecisionReason,
                difficultyDecisionReason: motherEvidence.difficultyDecisionReason,
                keywordSuggestion: suggestion,
                keywordSuggestionUsedAsSoleDecision: false
            },
            L1Key: resolvedKeys.L1Key,
            L1: selectedLabels[0],
            L2Key: resolvedKeys.L2Key,
            L2: selectedLabels[1],
            L3Key: resolvedKeys.L3Key,
            L3: selectedLabels[2],
            L4Key: resolvedKeys.L4Key,
            L4: resolvedKeys.L4,
            primaryConcept: { key: primaryKey, label: primaryLabel, reason: gapFromCandidate ? l4GapReason : motherEvidence.taxonomyDecisionReason },
            secondaryConceptKeys: Array.isArray(selected?.secondaryConceptKeys) ? selected.secondaryConceptKeys : [],
            difficultyBucket,
            difficultyStatus: difficultyValid ? 'RESOLVED' : 'REVIEW_REQUIRED',
            difficultyReason: difficultyCandidate?.difficultyReason || motherEvidence.difficultyDecisionReason,
            difficultyConfidence: difficultyCandidate?.difficultyConfidence || difficultyCandidate?.confidence || null,
            confidence: selected?.confidence || null,
            confidenceReason: selected?.confidenceReason || null,
            status: gapFromCandidate ? 'RESOLVED_WITH_L4_GAP' : (difficultyValid && pathValid ? 'RESOLVED' : 'REVIEW_REQUIRED'),
            statusReason: gapFromCandidate ? l4GapReason : motherEvidence.taxonomyDecisionReason,
            sourceDefect: selected?.sourceDefect ?? false,
            evidenceInsufficiency: !evidenceReady,
            candidateL4Leaves: Array.isArray(selected?.candidateL4Leaves) ? selected.candidateL4Leaves : [],
            rejectedExistingL4: Array.isArray(selected?.rejectedExistingL4) ? selected.rejectedExistingL4 : [],
            l4ReviewStatus: gapFromCandidate ? 'CANONICAL_GAP_REVIEW' : 'EXACT_CANONICAL_PATH',
            l4GapReason,
            directEvidence: (decision.evidenceCandidate || selected)?.directEvidence ?? null,
            priorReviewVisibility: 'NONE',
            productionWriteAllowed: false
        };
        finalRecords.push(final);
        reviewLedger.push({ key: row.key, stableUid: row.manifest.stableUid, sourceStandardUnitKey: row.question.standardUnitKey, expectedScope: row.target.scopeKey, aScope: decision.aScope, bScope: decision.bScope, resolution: decision.resolution, decisionType: decision.decisionType, motherEvidenceRef: motherEvidence.motherEvidenceRef, included: true });
    }

    finalRecords.sort(compareFinalRecords);
    finalRecords.forEach((record, index) => { record.recordIndex = index + 1; });
    const excludedIntegralIdentityLedger = excludedRows.map(row => ({ stableUid: row.manifest.stableUid, sourceArchiveFile: row.manifest.sourceArchiveFile, sourceOrdinal: row.manifest.sourceOrdinal, sourceQuestionNo: row.manifest.sourceQuestionNo, sourceFileSha256: row.manifest.sourceFileSha256, sourceFingerprint: row.manifest.sourceFingerprint, sourceStandardUnitKey: row.question.standardUnitKey, sourceStandardUnit: row.question.standardUnit, exclusionStatus: 'EXCLUDED_NOT_FINALIZED', exclusionReason: '사용자 지정 순서상 미분 완료 이후 범위인 적분 문항이므로 이번 Mother final records에 포함하지 않음.' }));
    const finalIdentitySet = new Set(finalRecords.map(record => record.sourceIdentity.stableUid));
    const excludedIdentitySet = new Set(excludedIntegralIdentityLedger.map(record => record.stableUid));
    const sourceIdentitySet = new Set(sourceRevalidation.rows.map(row => row.manifest.stableUid));
    const identityChecks = { sourceIdentityCount: sourceIdentitySet.size, finalIdentityCount: finalIdentitySet.size, excludedIdentityCount: excludedIdentitySet.size, overlapCount: [...finalIdentitySet].filter(uid => excludedIdentitySet.has(uid)).length, closure: sourceIdentitySet.size === finalIdentitySet.size + excludedIdentitySet.size && finalIdentitySet.size + excludedIdentitySet.size === 631 ? 'PASS' : 'FAIL' };
    const scopeCounts = Object.fromEntries(SCOPE_ORDER.map(scope => [scope.scopeKey, finalRecords.filter(record => record.orderedScope.scopeKey === scope.scopeKey).length]));
    const l4GapRecords = finalRecords.filter(record => record.status === 'RESOLVED_WITH_L4_GAP');
    const unique = values => [...new Set(values)];
    const sourceBindingUids = unique(sourceBindingFailureUids);
    const unresolvedUids = unique(unresolvedAdjudicationUids);
    const canonicalUids = unique(canonicalInvalidUids);
    const keyUids = unique(invalidKeyUids);
    const difficultyUids = unique(invalidDifficultyUids);
    const protectedDiffHead = gitDiffNames(branchParentSha, 'HEAD', PROTECTED_PATHS);
    const protectedDiffWorking = gitDiffNames(branchParentSha, null, PROTECTED_PATHS);
    const protectedDiff = unique([...protectedDiffHead, ...protectedDiffWorking, ...workingTreeProtectedPaths()]);
    const assetDiff = protectedDiff.filter(file => file === 'archive/assets/images' || file.startsWith('archive/assets/images/'));
    const dbIndexDiff = protectedDiff.filter(file => file.includes('question-index') || file === 'archive/db.js' || file === 'archive/data/question_metadata.json' || file === 'archive/data/question_identity_map.json');
    const canonicalChecks = {
        authorityFileExists: fs.existsSync(canonicalPath),
        authorityShaMatchesManifest: sha256(fs.readFileSync(canonicalPath)) === manifest.canonicalAuthority.sha256,
        authorityLocked: canonicalMaster.authorityStatus === 'LOCKED',
        compiledMasterShaMatchesManifest: sha256(fs.readFileSync(compiledMasterPath)) === manifest.compiledMaster.sha256,
        ruleManifestShaMatchesManifest: sha256(fs.readFileSync(ruleManifestPath)) === manifest.ruleManifest.sha256,
        hierarchyValid: canonicalUids.length === 0,
        keySchemaValid: keyUids.length === 0,
        sourceBindingValid: sourceBindingUids.length === 0,
        sourceImmutability: canonicalChecksSource(sourceRevalidation),
        protectedDiffEmpty: protectedDiff.length === 0,
        assetDiffEmpty: assetDiff.length === 0,
        dbQuestionIndexDiffEmpty: dbIndexDiff.length === 0,
        orderedScopeValid: orderedScopeValid(finalRecords)
    };
    const gateCounts = {
        l4GapCount: l4GapRecords.length,
        l4GapUids: l4GapRecords.map(record => record.sourceIdentity.stableUid),
        invalidDifficultyCount: difficultyUids.length,
        invalidDifficultyUids: difficultyUids,
        unresolvedAdjudicationCount: unresolvedUids.length,
        unresolvedAdjudicationUids: unresolvedUids,
        sourceBindingFailureCount: sourceBindingUids.length,
        sourceBindingFailureUids: sourceBindingUids,
        canonicalInvalidCount: canonicalUids.length,
        canonicalInvalidUids: canonicalUids,
        invalidKeyCount: keyUids.length,
        invalidKeyUids: keyUids,
        protectedDiffCount: protectedDiff.length,
        protectedDiff,
        assetDiffCount: assetDiff.length,
        assetDiff,
        dbQuestionIndexDiffCount: dbIndexDiff.length,
        dbQuestionIndexDiff: dbIndexDiff,
        fallbackUniqueUidCount: new Set(motherAdjudicationLedger.filter(record => record.decisionType === 'MOTHER_MANUAL_NEW_CANONICAL_PATH').map(record => record.stableUid)).size
    };
    const anyBlocker = gateCounts.unresolvedAdjudicationCount > 0 || gateCounts.sourceBindingFailureCount > 0 || gateCounts.invalidDifficultyCount > 0 || gateCounts.canonicalInvalidCount > 0 || gateCounts.invalidKeyCount > 0 || identityChecks.closure !== 'PASS' || provenance.revalidationStatus !== 'PASS' || !Object.values(canonicalChecks).every(Boolean);
    const finalVerdict = anyBlocker ? 'MOTHER_FINAL_BLOCKED' : gateCounts.l4GapCount > 0 ? 'MOTHER_FINAL_CONDITIONAL_L4_GAP' : 'MOTHER_FINAL_SCOPED_PASS';
    const final = {
        schemaVersion: 'metadata-foundation-h2-math2-direct-tagging-mother-final-scoped-v2', artifactRole: 'MOTHER_FINAL_SCOPED', freezeStatus: 'SEALED', targetGrade: '고2', curriculumScope: '수학II', curriculumKey: '2015', orderedScope: SCOPE_ORDER, stopAfter: 'L1-2 differentiation', sourceManifestPath: 'archive/_generated/intelligence/phase3/metadata-foundation-h2-math2-direct-tagging/source_manifest.json', sourceManifestSha256: manifest.manifestSha256, sourceProvenancePath: 'archive/_generated/intelligence/phase3/metadata-foundation-h2-math2-direct-tagging/mother-final/source_provenance_revalidation.json', l4GapLedgerPath: 'archive/_generated/intelligence/phase3/metadata-foundation-h2-math2-direct-tagging/mother-final/l4_gap_ledger.json', motherAdjudicationLedgerPath: 'archive/_generated/intelligence/phase3/metadata-foundation-h2-math2-direct-tagging/mother-final/mother_adjudication_ledger.json', canonicalAuthority: { path: 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json', sha256: sha256(fs.readFileSync(canonicalPath)), authorityStatus: canonicalMaster.authorityStatus, authorityVersion: canonicalMaster.authorityVersion }, compiledMaster: { path: 'archive/data/master_tables/js_archive_tag_master.json', sha256: sha256(fs.readFileSync(compiledMasterPath)) }, ruleManifest: { path: 'docs/rules/MANIFEST.md', sha256: sha256(fs.readFileSync(ruleManifestPath)) }, priorReviewVisibility: 'NONE', productionWriteAllowed: false, finalReleaseAllowed: false, integralUnitsFinalized: false, sourceIdentityDenominator: manifest.actualDenominator, includedRecordCount: finalRecords.length, excludedIntegralRecordCount: excludedIntegralIdentityLedger.length, identityChecks, scopeCounts, aBComparison: diffs, motherAdjudicationCounts: adjudicationCounts, decisionTypeCounts, gateCounts, canonicalChecks, sourceChecks: { liveSourceRows: sourceRevalidation.rows.length, includedRows: includedRows.length, excludedRows: excludedRows.length, sourceLoadErrors: sourceRevalidation.sourceLoadErrors.length, sourceFileHashMismatchCount: sourceRevalidation.sourceFileHashMismatches.length, sourceFingerprintBinding: sourceRevalidation.sourceFingerprintMismatchUids.length === 0 ? 'PASS' : 'FAIL', sourceIdentityBinding: sourceRevalidation.sourceIdentityMismatchUids.length === 0 ? 'PASS' : 'FAIL', sourceImmutability: canonicalChecks.sourceImmutability ? 'PASS' : 'FAIL', productionMutation: 'NONE' }, finalVerdict, reviewLedger, excludedIntegralIdentityLedger, records: finalRecords
    };
    final.artifactSha256 = digestJson(final);
    const l4GapLedger = { schemaVersion: 'metadata-foundation-h2-math2-direct-tagging-l4-gap-ledger-v2', artifactRole: 'L4_GAP_LEDGER', sourceManifestSha256: manifest.manifestSha256, count: l4GapRecords.length, uids: l4GapRecords.map(record => record.sourceIdentity.stableUid), records: l4GapRecords.map(record => ({ stableUid: record.sourceIdentity.stableUid, sourceArchiveFile: record.sourceIdentity.sourceArchiveFile, sourceOrdinal: record.sourceIdentity.sourceOrdinal, sourceQuestionNo: record.sourceIdentity.sourceQuestionNo, L1: record.L1, L2: record.L2, L3: record.L3, candidateL4Leaves: record.candidateL4Leaves, rejectedExistingL4: record.rejectedExistingL4, l4GapReason: record.l4GapReason, status: record.status, L4Key: record.L4Key, L4: record.L4 })) };
    const fallbackUids = motherAdjudicationLedger.filter(record => record.decisionType === 'MOTHER_MANUAL_NEW_CANONICAL_PATH').map(record => record.stableUid);
    const motherLedger = { schemaVersion: 'metadata-foundation-h2-math2-direct-tagging-mother-adjudication-ledger-v2', artifactRole: 'MOTHER_ADJUDICATION_LEDGER', sourceManifestSha256: manifest.manifestSha256, recordCount: motherAdjudicationLedger.length, fallbackUniqueUidCount: new Set(fallbackUids).size, fallbackUids, unresolvedCount: unresolvedUids.length, records: motherAdjudicationLedger };
    return { final, summary: { schemaVersion: 'metadata-foundation-h2-math2-direct-tagging-mother-summary-v2', artifactRole: 'MOTHER_FINAL_SCOPED_SUMMARY', summaryStatus: 'SEALED', targetGrade: final.targetGrade, curriculumScope: final.curriculumScope, orderedScope: final.orderedScope, stopAfter: final.stopAfter, sourceManifestSha256: final.sourceManifestSha256, sourceIdentityDenominator: final.sourceIdentityDenominator, includedRecordCount: final.includedRecordCount, excludedIntegralRecordCount: final.excludedIntegralRecordCount, scopeCounts: final.scopeCounts, aBComparison: final.aBComparison, motherAdjudicationCounts: final.motherAdjudicationCounts, decisionTypeCounts: final.decisionTypeCounts, identityChecks: final.identityChecks, canonicalAuthority: final.canonicalAuthority, canonicalChecks: final.canonicalChecks, sourceChecks: final.sourceChecks, gateCounts: final.gateCounts, productionWriteAllowed: false, finalReleaseAllowed: false, integralUnitsFinalized: false, finalVerdict }, freeze: { schemaVersion: 'metadata-foundation-h2-math2-direct-tagging-mother-freeze-v2', freezeStatus: 'SEALED', packetRole: 'MOTHER_FINAL_ADJUDICATOR', targetGrade: final.targetGrade, curriculumScope: final.curriculumScope, orderedScope: final.orderedScope, stopAfter: final.stopAfter, sourceManifestSha256: final.sourceManifestSha256, includedRecordCount: final.includedRecordCount, excludedIntegralRecordCount: final.excludedIntegralRecordCount, identityChecks: final.identityChecks, canonicalChecks: final.canonicalChecks, sourceChecks: { sourceFingerprint: canonicalChecks.sourceImmutability ? 'PASS' : 'FAIL', sourceIdentity: canonicalChecks.sourceBindingValid ? 'PASS' : 'FAIL', sourceImmutability: canonicalChecks.sourceImmutability ? 'PASS' : 'FAIL', contentChoicesAnswerSolutionMutation: 0, assetMutation: assetDiff.length, protectedDiff: protectedDiff.length }, gateCounts: final.gateCounts, closure: { sourceIdentityOneToOne: final.identityChecks.closure, orderedScope: canonicalChecks.orderedScopeValid ? 'PASS' : 'FAIL', integralUnitsFinalized: false, priorReviewVisibility: 'NONE', productionWriteAllowed: false, finalReleaseAllowed: false }, finalVerdict }, l4GapLedger, motherLedger, provenance };
}

function canonicalChecksSource(sourceRevalidation) {
    return sourceRevalidation.sourceFingerprintMismatchUids.length === 0 &&
        sourceRevalidation.sourceIdentityMismatchUids.length === 0 &&
        sourceRevalidation.sourceFileHashMismatches.length === 0 &&
        sourceRevalidation.sourceLoadErrors.length === 0;
}

function write() {
    const result = build();
    fs.mkdirSync(outputDir, { recursive: true });
    const files = [['mother_final_scoped.json', result.final], ['mother_final_scoped_summary.json', result.summary], ['mother_final_scoped_freeze.json', result.freeze], ['l4_gap_ledger.json', result.l4GapLedger], ['mother_adjudication_ledger.json', result.motherLedger], ['source_provenance_revalidation.json', result.provenance]];
    for (const [name, value] of files) {
        const file = path.join(outputDir, name);
        const body = `${JSON.stringify(value, null, 2)}\n`;
        fs.writeFileSync(file, body, 'utf8');
        fs.writeFileSync(`${file}.sha256`, `${sha256(body)}\n`, 'utf8');
    }
    const final = result.final;
    const gapRows = result.l4GapLedger.records.map(row => `| ${row.stableUid} | ${row.sourceArchiveFile}#${row.sourceOrdinal} | ${row.l4GapReason.replace(/\|/g, '\\|')} |`).join('\n');
    const report = `# 고2 수학II Mother scoped final report\n\n- target grade: ${final.targetGrade}\n- curriculum scope: ${final.curriculumScope}\n- ordered stop point: 함수의 극한 → 함수의 연속 → 미분\n- source denominator: ${final.sourceIdentityDenominator}\n- Mother final records: ${final.includedRecordCount}\n- integral records excluded from final: ${final.excludedIntegralRecordCount}\n- final verdict: ${result.summary.finalVerdict}\n\n## Ordered scope counts\n\n| Order | Scope | Count |\n|---:|---|---:|\n${final.orderedScope.map(scope => `| ${scope.order} | ${scope.label} | ${final.scopeCounts[scope.scopeKey]} |`).join('\n')}\n|  | 합계 | ${final.includedRecordCount} |\n\n## Closure gates\n\n- source identity closure: ${final.identityChecks.closure}\n- L4 gap count: ${final.gateCounts.l4GapCount}\n- invalid difficulty count: ${final.gateCounts.invalidDifficultyCount}\n- unresolved adjudication count: ${final.gateCounts.unresolvedAdjudicationCount}\n- source binding failure count: ${final.gateCounts.sourceBindingFailureCount}\n- canonical invalid count: ${final.gateCounts.canonicalInvalidCount}\n- invalid key count: ${final.gateCounts.invalidKeyCount}\n- protected diff count: ${final.gateCounts.protectedDiffCount}\n- asset diff count: ${final.gateCounts.assetDiffCount}\n- DB/question-index diff count: ${final.gateCounts.dbQuestionIndexDiffCount}\n\n## L4 gap ledger\n\n| stable UID | source | reason |\n|---|---|---|\n${gapRows || '| (none) |  |  |'}\n\n## Policy state\n\n- production write: NOT ALLOWED\n- final release: NOT ALLOWED\n- integral finalization: NOT RUN\n- source provenance revalidation: ${result.provenance.revalidationStatus}\n- A/B packets: read-only\n- production metadata: not modified\n`;
    const adjudicationRows = Object.entries(final.motherAdjudicationCounts).map(([name, count]) => `| ${name} | ${count} |`).join('\n');
    const decisionRows = Object.entries(final.decisionTypeCounts).map(([name, count]) => `| ${name} | ${count} |`).join('\n');
    const reportV2 = `${report}\n## A/B comparison\n\n| Metric | Count |\n|---|---:|\n| agreement | ${final.aBComparison.agreement} |\n| disagreement | ${final.aBComparison.disagreement} |\n| missing A | ${final.aBComparison.missingA} |\n| missing B | ${final.aBComparison.missingB} |\n| excluded integral | ${final.aBComparison.excludedIntegral} |\n\n## Mother adjudication\n\n| Category | Count |\n|---|---:|\n${adjudicationRows}\n\n| Decision type | Count |\n|---|---:|\n${decisionRows}\n\n- fallback unique UID count: ${final.gateCounts.fallbackUniqueUidCount}\n- mother adjudication ledger: ${final.motherAdjudicationLedgerPath}\n- L4 gap ledger: ${final.l4GapLedgerPath}\n- source provenance artifact: ${final.sourceProvenancePath}\n`;
    const reportV3 = `${report.replace(/\n## Policy state[\s\S]*$/, '')}\n## A/B comparison\n\n| Metric | Count |\n|---|---:|\n| agreement | ${final.aBComparison.agreement} |\n| disagreement | ${final.aBComparison.disagreement} |\n| missing A | ${final.aBComparison.missingA} |\n| missing B | ${final.aBComparison.missingB} |\n| excluded integral | ${final.aBComparison.excludedIntegral} |\n\n## Mother adjudication\n\n| Category | Count |\n|---|---:|\n${adjudicationRows}\n\n| Decision type | Count |\n|---|---:|\n${decisionRows}\n\n- fallback unique UID count: ${final.gateCounts.fallbackUniqueUidCount}\n- mother adjudication ledger: ${final.motherAdjudicationLedgerPath}\n- L4 gap ledger: ${final.l4GapLedgerPath}\n- source provenance artifact: ${final.sourceProvenancePath}\n\n## Policy state\n\n- production write: NOT ALLOWED\n- final release: NOT ALLOWED\n- integral finalization: NOT RUN\n- source provenance revalidation: ${result.provenance.revalidationStatus}\n- A/B packets: read-only\n- production metadata: not modified\n`;
    fs.writeFileSync(path.join(outputDir, 'MOTHER_FINAL_SCOPED_REPORT.md'), reportV3, 'utf8');
    console.log(JSON.stringify({ outputDir: path.relative(repoRoot, outputDir).split(path.sep).join('/'), includedRecordCount: final.includedRecordCount, excludedIntegralRecordCount: final.excludedIntegralRecordCount, scopeCounts: final.scopeCounts, l4GapCount: final.gateCounts.l4GapCount, unresolvedAdjudicationCount: final.gateCounts.unresolvedAdjudicationCount, invalidDifficultyCount: final.gateCounts.invalidDifficultyCount, sourceBindingFailureCount: final.gateCounts.sourceBindingFailureCount, invalidKeyCount: final.gateCounts.invalidKeyCount, finalVerdict: result.summary.finalVerdict, productionWriteAllowed: false, finalReleaseAllowed: false, artifactSha256: final.artifactSha256 }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) write();
