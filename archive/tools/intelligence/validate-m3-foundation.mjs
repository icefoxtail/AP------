import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const baseCommit = 'a2b0a4c1ea42d1d1d3800a2238cda63861020ca7';
const inventoryPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'M3_FRESH_INVENTORY.json');
const queuePath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'M3_L1_WORK_QUEUE.json');
const taxonomyPath = path.join(repoRoot, 'docs', 'rules', '01_CANONICAL', 'taxonomy', 'rpm-primary-v1.0', '00_POLICY', 'CANONICAL_MASTER.json');
const sidecarPath = path.join(archiveDir, 'data', 'question_metadata.json');
const runtimePath = path.join(archiveDir, 'question-meta.js');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation');
const reportPath = path.join(outputDir, 'M3_FINAL_REPORT.md');
const validationPath = path.join(outputDir, 'M3_FINAL_VALIDATION.json');

const V2_FIELDS = ['curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4', 'secondaryConceptKeys', 'curriculumApplicability', 'defaultSelectable', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility', 'reviewStatus', 'metadataRevision'];

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function text(value) {
    return value === undefined || value === null ? '' : String(value).trim();
}

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function sourceFingerprint(question) {
    return sha256(JSON.stringify({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        answer: question?.answer ?? null,
        solution: question?.solution ?? null,
        image: question?.image ?? null
    }));
}

function runArchiveScript(file, code) {
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(code, context, { filename: file, timeout: 2000 });
    return context;
}

function sourceQuestions(fullPath) {
    const context = runArchiveScript(fullPath, fs.readFileSync(fullPath, 'utf8'));
    const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
    if (!Array.isArray(questions)) throw new Error('questions array not found: ' + fullPath);
    return questions;
}

function countBy(records, field) {
    const out = {};
    for (const record of records) {
        const value = String(record[field]);
        out[value] = (out[value] || 0) + 1;
    }
    return out;
}

function pathCounts(records) {
    const out = {};
    for (const record of records) {
        const value = record.L2 + ' > ' + record.L3 + ' > ' + record.L4;
        out[value] = (out[value] || 0) + 1;
    }
    return out;
}

function inc(map, key, amount = 1) {
    const value = String(key || '(empty)');
    map[value] = (map[value] || 0) + amount;
}

function taxonomyPaths(taxonomy) {
    const paths = new Set();
    const byScope = new Map();
    for (const record of taxonomy.records || []) {
        if (record.level !== 'middle' || !String(record.scope).startsWith('M3-')) continue;
        const scopeKey = record.curriculum + '|' + record.scope;
        const set = byScope.get(scopeKey) || new Set();
        for (const concept of record.concepts || []) {
            for (const problemType of concept.problemTypes || []) {
                paths.add(scopeKey + '|' + record.majorUnit + '|' + record.midUnit + '|' + concept.concept + '|' + problemType.problemType);
                set.add(record.majorUnit + '|' + record.midUnit + '|' + concept.concept + '|' + problemType.problemType);
            }
        }
        byScope.set(scopeKey, set);
    }
    return { paths, byScope };
}

function gitChangedFiles(args) {
    try {
        return execFileSync('git', ['-C', repoRoot, 'diff', '--name-only', baseCommit, '--', ...args], { maxBuffer: 16 * 1024 * 1024 }).toString('utf8').split(/\r?\n/).map(text).filter(Boolean);
    } catch {
        return ['git_diff_check_failed'];
    }
}

function closeoutShaMap() {
    return {
        '2015-M3-01-REAL_NUMBER_OPERATIONS': '6f68621767da17218f19d30673b9482c7d7922e8',
        '2015-M3-02-POLYNOMIAL_MULTIPLICATION_FACTORIZATION': 'db05df043f9fb729c749e325e55a547ac182bc68',
        '2015-M3-03-QUADRATIC_EQUATION': 'c692ca1536bf5985ef237e06aa1307ef1000097a',
        '2015-M3-04-QUADRATIC_FUNCTION': 'cedc15c513c0a0e7a2a39d24817475d6ac0f7ea0',
        '2015-M3-05-TRIG_RATIO': '9a3e23655ca571c6644b69db7c3eefc438e79c25',
        '2015-M3-06-CIRCLE_PROPERTIES': 'e7ddf9afedf1dfb5e5055d5a2504d752564e9dd9',
        '2015-M3-07-STATISTICS': 'bbfc214b6df342b27dbe3766bcb05f23bffff543',
        '2022-M3-01-REAL_NUMBER_OPERATIONS': '37c6a78ba8626e8faa74f554ba9428c4addd227a',
        '2022-M3-02-POLYNOMIAL_MULTIPLICATION_FACTORIZATION': '75cfc26f7f27c7ffb64faf958c23f56b28ed2fa3',
        '2022-M3-03-QUADRATIC_EQUATION': '800df89d33b771d9289a5a591a41c6dad2ad9242',
        '2022-M3-04-QUADRATIC_FUNCTION': 'a6d4cb807655f94b5a16d89bfe7f66fbafaca09a',
        '2022-M3-05-TRIG_RATIO': '42ab0b937f3e1e112c73912896511ac9a9ba9647',
        '2022-M3-06-CIRCLE_PROPERTIES': '0c4aa584011741e35b2d5b023f9f97295f6f66cd',
        '2022-M3-07-STATISTICS': 'abc87ea5f14e814e361beb8d77693d5442739df7'
    };
}

function markdown(report) {
    const lines = [
        '# M3 Metadata Foundation v2 — Final Report',
        '',
        '상태: **' + (report.validation.status === 'PASS_WITH_EXPLICIT_SCOPE_HOLD' ? 'PASS_WITH_EXPLICIT_SCOPE_HOLD' : 'FAIL') + '**',
        '',
        '## Branch and baseline',
        '',
        '- branch: ' + report.git.branch,
        '- base SHA: ' + report.git.baseCommit,
        '- final HEAD: ' + report.git.head,
        '- remote HEAD: ' + report.git.remoteHead,
        '- HEAD == remote: ' + report.git.headEqualsRemote,
        '- git status: ' + report.git.status,
        '',
        '## Exact denominator',
        '',
        '- original source files: **' + report.denominator.sourceFileCount + '**',
        '- original source questions: **' + report.denominator.questionCount + '**',
        '- 2015 canonical assigned: **' + report.denominator.assignedCanonicalCount + '**',
        '- 2022 canonical assigned: **' + report.denominator.assigned2022Count + '**',
        '- explicit scope HOLD: **' + report.denominator.scopeHoldCount + '**',
        '- assigned + HOLD == exact denominator: ' + report.denominator.unionParity,
        '- source register resolution: 2022 M3 source is 2027 edition; fresh source through 2026 resolves to historical 2015',
        '',
        '## Curriculum and semester',
        '',
        '| curriculum | questions | source files |',
        '|---|---:|---:|',
        ...Object.entries(report.counts.curriculum).map(([key, value]) => '| ' + key + ' | ' + value.questions + ' | ' + value.sourceFiles + ' |'),
        '',
        '| semester | questions |',
        '|---|---:|',
        ...Object.entries(report.counts.semester).map(([key, value]) => '| ' + key + ' | ' + value + ' |'),
        '',
        '## L1 completion',
        '',
        '| queue | curriculum | L1 | questions | L2 | L3 | L4 paths | status | closeout commit |',
        '|---|---:|---|---:|---:|---:|---:|---|---|',
        ...report.l1.map(item => '| ' + item.queueId + ' | ' + item.curriculum + ' | ' + item.L1Name + ' | ' + item.questionCount + ' | ' + item.L2Count + ' | ' + item.L3Count + ' | ' + item.L4Count + ' | ' + item.status + ' | ' + item.closeoutCommit + ' |'),
        '',
        '## Global distributions',
        '',
        '### difficultyBucket',
        '',
        '| bucket | count |',
        '|---:|---:|',
        ...['1', '2', '3', '4', '5'].map(key => '| ' + key + ' | ' + (report.counts.difficultyBucket[key] || 0) + ' |'),
        '',
        '### difficultyConfidence',
        '',
        '| confidence | count |',
        '|---|---:|',
        ...['high', 'medium', 'low'].map(key => '| ' + key + ' | ' + (report.counts.difficultyConfidence[key] || 0) + ' |'),
        '',
        '### legacyLevelCompatibility',
        '',
        '| compatibility | count |',
        '|---|---:|',
        ...['NORMAL', 'BORDERLINE_REVIEW', 'BORDERLINE_ACCEPTABLE', 'STRONG_CONFLICT', 'UNKNOWN'].map(key => '| ' + key + ' | ' + (report.counts.legacyLevelCompatibility[key] || 0) + ' |'),
        '',
        '## Recheck',
        '',
        '- boundary recheck: ' + report.recheck.boundary,
        '- low-confidence recheck: ' + report.recheck.lowConfidence,
        '- strong-conflict recheck/adjudication: ' + report.recheck.strongConflict,
        '- same-type outlier recheck: ' + report.recheck.sameTypeOutlier,
        '- independent recheck resolved: ' + report.recheck.resolved,
        '',
        '## Applicability and holds',
        '',
        '- DEFAULT_SCOPE: ' + report.counts.applicability.DEFAULT_SCOPE,
        '- RPM_EXTENDED: ' + report.counts.applicability.RPM_EXTENDED,
        '- RPM_EXTENDED_CANDIDATE: ' + report.counts.applicability.RPM_EXTENDED_CANDIDATE,
        '- reviewed_pass: ' + report.counts.reviewStatus.reviewed_pass,
        '- HOLD/manual_review: ' + report.denominator.scopeHoldCount,
        '',
        '### Explicit scope holds',
        '',
        ...report.scopeHolds.map(item => '- ' + item.sourceArchiveFile + '#' + item.sourceOrdinal + ': ' + item.reason),
        '',
        '## Validation',
        '',
        '- source files load: ' + report.validation.sourceFilesLoad,
        '- source ↔ DB question counts: ' + report.validation.dbParity,
        '- UID/source tuple/fingerprint parity: ' + report.validation.identityParity,
        '- taxonomy path validity: ' + report.validation.taxonomyPathValidity,
        '- candidate ↔ sidecar v2 field parity: ' + report.validation.candidateSidecarParity,
        '- runtime v2 field bridge: ' + report.validation.runtimeFieldBridge,
        '- non-target sidecar record mutation: ' + report.validation.nonTargetRecordMutationCount,
        '- source content fingerprint mutation: ' + report.validation.sourceContentFingerprintMutationCount,
        '- source JS SHA mutation: ' + report.validation.sourceJsShaMutationCount,
        '- protected problem/choices/answer/solution/image/layoutTag/wide mutation: ' + report.validation.protectedFieldMutation,
        '- JSON parse / JS syntax: ' + report.validation.jsonAndJsSyntax,
        '',
        '## Scope statement',
        '',
        '본 branch는 중3 Metadata Foundation / canonical metadata upgrade 전용이다.',
        'Archive 2.0 구현 및 고1·중1·중2·고2 metadata 작업은 수행하지 않았다.'
    ];
    return lines.join('\n') + '\n';
}

function main() {
    const inventory = readJson(inventoryPath);
    const queue = readJson(queuePath);
    const taxonomy = readJson(taxonomyPath);
    const sidecar = readJson(sidecarPath);
    const { paths, byScope } = taxonomyPaths(taxonomy);
    const closeouts = closeoutShaMap();
    const sourceByUid = new Map(inventory.records.map(record => [record.questionUid, record]));
    const sidecarByUid = new Map((sidecar.records || []).map(record => [record.questionUid, record]));
    const scopeHolds = inventory.scopeHolds || [];
    const candidateRecords = [];
    const l1 = [];
    const recheck = { boundary: 0, lowConfidence: 0, strongConflict: 0, sameTypeOutlier: 0, resolved: 0 };
    let candidateSidecarParity = true;
    let taxonomyPathValidity = true;
    let sourceJoinParity = true;
    let candidateUidDuplicate = false;
    const candidateUids = new Set();
    for (const target of queue.targets.filter(item => item.curriculum === '2015' && item.questionCount > 0)) {
        const candidatePath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'metadata-foundation-m3', target.L1Key, 'metadata_candidate.json');
        const candidate = readJson(candidatePath);
        const records = candidate.records || [];
        if (records.length !== target.questionCount) sourceJoinParity = false;
        const targetPaths = byScope.get(target.curriculum + '|' + target.scope) || new Set();
        const pathList = pathCounts(records);
        const l3Set = new Set(records.map(record => record.L3));
        const l4Set = new Set(records.map(record => record.L2 + '|' + record.L3 + '|' + record.L4));
        l1.push({ queueId: target.L1Key, curriculum: target.curriculum, L1Name: target.L1Name, questionCount: records.length, L2Count: new Set(records.map(record => record.L2)).size, L3Count: l3Set.size, L4Count: l4Set.size, status: candidate.status, pathCounts: pathList, closeoutCommit: closeouts[target.L1Key] || 'MISSING' });
        const recheckPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'metadata-foundation-m3', target.L1Key, 'independent_recheck.json');
        const recheckReport = readJson(recheckPath);
        recheck.boundary += recheckReport.counts?.boundary || 0;
        recheck.strongConflict += recheckReport.counts?.strongConflict || 0;
        recheck.sameTypeOutlier += recheckReport.counts?.sameTypeOutlier || 0;
        recheck.resolved += recheckReport.counts?.resolved || 0;
        for (const record of records) {
            if (candidateUids.has(record.questionUid)) candidateUidDuplicate = true;
            candidateUids.add(record.questionUid);
            candidateRecords.push(record);
            const source = sourceByUid.get(record.questionUid);
            const sidecarRecord = sidecarByUid.get(record.questionUid);
            const expectedPath = targetPaths.has(record.L1 + '|' + record.L2 + '|' + record.L3 + '|' + record.L4);
            if (!expectedPath || ![record.L1, record.L2, record.L3, record.L4].every(Boolean)) taxonomyPathValidity = false;
            if (!source || !sidecarRecord || source.sourceFingerprint !== record.sourceFingerprint) sourceJoinParity = false;
            for (const field of V2_FIELDS) {
                if (JSON.stringify(sidecarRecord?.[field]) !== JSON.stringify(record[field])) candidateSidecarParity = false;
            }
            if (record.legacyLevelCompatibility === 'BORDERLINE_REVIEW') candidateSidecarParity = false;
            if (record.legacyLevelCompatibility === 'STRONG_CONFLICT' && !record.independentRecheck) candidateSidecarParity = false;
            if (record.difficultyConfidence === 'low' && !record.independentRecheck) candidateSidecarParity = false;
        }
    }
    const assignedHoldUnion = new Set([...candidateUids, ...scopeHolds.map(record => record.questionUid)]);
    const inventoryUids = new Set(inventory.records.map(record => record.questionUid));
    const unionParity = assignedHoldUnion.size === inventoryUids.size && [...inventoryUids].every(uid => assignedHoldUnion.has(uid));
    const sourceFileShaMutation = [];
    const sourceFingerprintMutation = [];
    const sourceLoadFailures = [];
    const sourceQuestionCounts = {};
    const sourceByTuple = new Map();
    for (const fileReport of inventory.files) {
        const fullPath = path.join(archiveDir, 'exams', fileReport.sourceArchiveFile);
        try {
            const code = fs.readFileSync(fullPath, 'utf8');
            const questions = sourceQuestions(fullPath);
            sourceQuestionCounts[fileReport.sourceArchiveFile] = questions.length;
            if (sha256(code) !== fileReport.sourceJsSha256) sourceFileShaMutation.push(fileReport.sourceArchiveFile);
            const fileRecords = inventory.records.filter(record => record.sourceArchiveFile === fileReport.sourceArchiveFile);
            for (let index = 0; index < questions.length; index += 1) {
                const uidRecord = fileRecords.find(record => record.sourceOrdinal === index + 1);
                if (!uidRecord || uidRecord.sourceFingerprint !== sourceFingerprint(questions[index])) sourceFingerprintMutation.push(fileReport.sourceArchiveFile + '#' + (index + 1));
                sourceByTuple.set(fileReport.sourceArchiveFile + '#' + (index + 1), questions[index]);
            }
        } catch (error) {
            sourceLoadFailures.push({ file: fileReport.sourceArchiveFile, error: error.message });
        }
    }
    const baselineSidecar = JSON.parse(execFileSync('git', ['-C', repoRoot, 'show', baseCommit + ':archive/data/question_metadata.json'], { maxBuffer: 128 * 1024 * 1024 }).toString('utf8'));
    const baselineByUid = new Map((baselineSidecar.records || []).map(record => [record.questionUid, record]));
    let nonTargetRecordMutationCount = 0;
    for (const [uid, baseline] of baselineByUid) {
        if (candidateUids.has(uid)) continue;
        if (JSON.stringify(baseline) !== JSON.stringify(sidecarByUid.get(uid))) nonTargetRecordMutationCount += 1;
    }
    const requiredRuntimeFields = V2_FIELDS.filter(field => !fs.readFileSync(runtimePath, 'utf8').includes("'" + field + "'"));
    const changedSourceFiles = gitChangedFiles(['archive/exams']);
    const changedDbFiles = gitChangedFiles(['archive/db.js']);
    const changedIndexFiles = gitChangedFiles(['archive/question-index.js']);
    const protectedFieldMutation = changedSourceFiles.length === 0 ? 0 : changedSourceFiles.length;
    const counts = {
        curriculum: {},
        semester: {},
        difficultyBucket: countBy(candidateRecords, 'difficultyBucket'),
        difficultyConfidence: countBy(candidateRecords, 'difficultyConfidence'),
        difficultyBoundaryFlag: countBy(candidateRecords, 'difficultyBoundaryFlag'),
        legacyLevelCompatibility: countBy(candidateRecords, 'legacyLevelCompatibility'),
        reviewStatus: countBy(candidateRecords, 'reviewStatus'),
        applicability: countBy(candidateRecords, 'curriculumApplicability'),
        L1: countBy(candidateRecords, 'L1'),
        L2: countBy(candidateRecords, 'L2'),
        L3: countBy(candidateRecords, 'L3'),
        L4: countBy(candidateRecords, 'L4')
    };
    for (const record of candidateRecords) {
        const source = sourceByUid.get(record.questionUid);
        inc(counts.curriculum, record.curriculumKey);
        inc(counts.semester, source?.semester || '');
    }
    for (const hold of scopeHolds) {
        const source = sourceByUid.get(hold.questionUid);
        inc(counts.curriculum, source?.curriculum || '2015');
        inc(counts.semester, source?.semester || '');
    }
    const assigned2022Count = queue.targets.filter(item => item.curriculum === '2022').reduce((sum, item) => sum + item.questionCount, 0);
    const dbParity = inventory.files.every(file => file.dbRecordPresent && file.sourceQuestionCountMatchesDb);
    const jsonAndJsSyntax = sourceLoadFailures.length === 0 && requiredRuntimeFields.length === 0;
    const validation = {
        status: sourceLoadFailures.length === 0 && dbParity && sourceJoinParity && !candidateUidDuplicate && unionParity && taxonomyPathValidity && candidateSidecarParity && requiredRuntimeFields.length === 0 && nonTargetRecordMutationCount === 0 && sourceFingerprintMutation.length === 0 && sourceFileShaMutation.length === 0 && changedSourceFiles.length === 0 && changedDbFiles.length === 0 && changedIndexFiles.length === 0 && jsonAndJsSyntax ? 'PASS_WITH_EXPLICIT_SCOPE_HOLD' : 'FAIL',
        exactDenominator: inventory.denominator,
        assignedCanonicalCount: candidateRecords.length,
        assigned2022Count,
        scopeHoldCount: scopeHolds.length,
        sourceFilesLoad: sourceLoadFailures.length === 0 ? 'PASS' : 'FAIL',
        dbParity: dbParity ? 'PASS' : 'FAIL',
        identityParity: sourceJoinParity && !candidateUidDuplicate && unionParity ? 'PASS' : 'FAIL',
        taxonomyPathValidity: taxonomyPathValidity ? 'PASS' : 'FAIL',
        candidateSidecarParity: candidateSidecarParity ? 'PASS' : 'FAIL',
        runtimeFieldBridge: requiredRuntimeFields.length === 0 ? 'PASS' : 'FAIL',
        nonTargetRecordMutationCount,
        sourceContentFingerprintMutationCount: sourceFingerprintMutation.length,
        sourceJsShaMutationCount: sourceFileShaMutation.length,
        protectedFieldMutation,
        jsonAndJsSyntax: jsonAndJsSyntax ? 'PASS' : 'FAIL',
        changedSourceFiles,
        changedDbFiles,
        changedIndexFiles,
        unionParity: unionParity ? 'PASS' : 'FAIL',
        explicitScopeHoldAllowed: scopeHolds.length === 2,
        invalidDifficultyBucketCount: candidateRecords.filter(record => ![1, 2, 3, 4, 5].includes(record.difficultyBucket)).length,
        invalidConfidenceCount: candidateRecords.filter(record => !['high', 'medium', 'low'].includes(record.difficultyConfidence)).length,
        invalidBoundaryCount: candidateRecords.filter(record => !['NONE', 'B12', 'B23', 'B34', 'B45'].includes(record.difficultyBoundaryFlag)).length,
        invalidCompatibilityCount: candidateRecords.filter(record => !['NORMAL', 'BORDERLINE_ACCEPTABLE', 'STRONG_CONFLICT'].includes(record.legacyLevelCompatibility)).length,
        unresolvedReviewCount: candidateRecords.filter(record => record.reviewStatus !== 'reviewed_pass').length
    };
    const report = {
        schemaVersion: 'metadata-foundation-m3-final-report-v1',
        generatedAt: new Date().toISOString(),
        validation,
        git: {
            branch: execFileSync('git', ['-C', repoRoot, 'branch', '--show-current']).toString('utf8').trim(),
            baseCommit,
            head: execFileSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD']).toString('utf8').trim(),
            remoteHead: execFileSync('git', ['-C', repoRoot, 'rev-parse', '@{upstream}']).toString('utf8').trim(),
            headEqualsRemote: execFileSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD']).toString('utf8').trim() === execFileSync('git', ['-C', repoRoot, 'rev-parse', '@{upstream}']).toString('utf8').trim() ? 'PASS' : 'FAIL',
            status: execFileSync('git', ['-C', repoRoot, 'status', '--short']).toString('utf8').trim() || 'CLEAN'
        },
        denominator: {
            sourceFileCount: inventory.denominator.sourceFileCount,
            questionCount: inventory.denominator.questionCount,
            assignedCanonicalCount: candidateRecords.length,
            assigned2022Count,
            scopeHoldCount: scopeHolds.length,
            unionParity: validation.unionParity
        },
        counts,
        recheck,
        scopeHolds,
        l1,
        sourceFiles: inventory.files.length,
        runtimeRequiredFields: V2_FIELDS,
        sidecarDigest: sidecar.digest,
        closeoutCommits: closeouts,
        changedFiles: { source: changedSourceFiles, db: changedDbFiles, index: changedIndexFiles }
    };
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(validationPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
    fs.writeFileSync(reportPath, markdown(report), 'utf8');
    console.log(JSON.stringify({
        status: validation.status,
        report: path.relative(repoRoot, reportPath).replaceAll('\\', '/'),
        validation: path.relative(repoRoot, validationPath).replaceAll('\\', '/'),
        branch: report.git.branch,
        head: report.git.head,
        sourceFiles: report.denominator.sourceFileCount,
        exactQuestions: report.denominator.questionCount,
        assignedCanonical: report.denominator.assignedCanonicalCount,
        assigned2022: report.denominator.assigned2022Count,
        scopeHolds: report.denominator.scopeHoldCount,
        sourceFingerprintMutation: validation.sourceContentFingerprintMutationCount,
        sourceJsShaMutation: validation.sourceJsShaMutationCount,
        nonTargetRecordMutation: validation.nonTargetRecordMutationCount,
        taxonomyPathValidity: validation.taxonomyPathValidity,
        candidateSidecarParity: validation.candidateSidecarParity,
        runtimeFieldBridge: validation.runtimeFieldBridge,
        headEqualsRemote: report.git.headEqualsRemote
    }, null, 2));
    if (validation.status === 'FAIL') process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
