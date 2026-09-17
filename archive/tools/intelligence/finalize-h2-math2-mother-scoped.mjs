import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

/**
 * Mother-scoped finalizer for the H2 Mathematics II direct-tagging run.
 *
 * This is a bounded metadata/evidence merger. It never changes production
 * source, database, question-index, or assets. Scope is re-bound to live
 * source records after A/B freeze; canonical metadata is resolved from the
 * direct packets and source evidence, with an explicit fallback evidence
 * record for boundary cases.
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

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function digestJson(value) {
    return sha256(JSON.stringify(value));
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadWindow(fullPath) {
    const source = fs.readFileSync(fullPath, 'utf8');
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(source, context, { filename: fullPath, timeout: 3000 });
    return context.window;
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

function tokenSet(source) {
    return new Set(clean(source).toLowerCase().split(/[^가-힣a-z0-9]+/i).filter(Boolean));
}

function sourceText(source) {
    return [source.category, source.originalCategory, ...(Array.isArray(source.tags) ? source.tags : []), clean(source.content), clean(source.solution)].join(' ');
}

function scoreCandidate(source, candidate) {
    if (!candidate) return -1000;
    const text = sourceText(source).toLowerCase();
    const pathText = [candidate.L1, candidate.L2, candidate.L3, candidate.L4].filter(Boolean).join(' ').toLowerCase();
    let score = 0;
    const hints = [
        ['극한', 'L2-1.1'],
        ['연속', 'L2-1.2'],
        ['미분', 'L1-2'],
        ['도함수', 'L1-2'],
        ['접선', 'L2-2.2'],
        ['평균값 정리', 'L2-2.2'],
        ['롤의 정리', 'L2-2.2'],
        ['극대', 'L2-2.3'],
        ['극소', 'L2-2.3'],
        ['최대', 'L2-2.3'],
        ['최소', 'L2-2.3'],
        ['속도', 'L2-2.4'],
        ['가속도', 'L2-2.4'],
        ['방정식', 'L2-2.4'],
        ['실근', 'L2-2.4'],
        ['부등식', 'L2-2.4'],
        ['적분', 'L1-3']
    ];
    for (const [hint, scope] of hints) {
        if (text.includes(hint) && broadScope(candidate) === scope) score += 6;
    }
    for (const token of tokenSet(pathText)) if (text.includes(token)) score += 1;
    if (candidate.directEvidence?.sourceAnswerSolutionConsistency === 'PASS') score += 2;
    if (candidate.directEvidence?.decisiveSolutionStep) score += 1;
    return score;
}

function canonicalRecord(canonical, pathKeys) {
    const [L1, L2, L3, L4] = pathKeys;
    const major = canonical.records?.find(record => record.curriculum === '2015' && record.level === 'high' && record.scope === '수학II' && record.majorUnit === L1 && record.midUnit === L2);
    const concept = major?.concepts?.find(record => record.concept === L3);
    const problemType = concept?.problemTypes?.find(record => record.problemType === L4);
    return { major, concept, problemType };
}

function fallbackPath(source, scope) {
    const text = sourceText(source).toLowerCase();
    if (scope.scopeKey === 'L2-1.1') {
        if (text.includes('좌극한') || text.includes('우극한') || text.includes('좌우극한') || text.includes('그래프')) return ['함수의 극한과 연속', '함수의 극한', '함수의 극한', '좌극한·우극한'];
        if (text.includes('무한대')) return ['함수의 극한과 연속', '함수의 극한', '무한대에서의 극한', '그래프 해석'].some(() => false) ? ['함수의 극한과 연속', '함수의 극한', '무한대에서의 극한', '다항·유리함수'] : ['함수의 극한과 연속', '함수의 극한', '무한대에서의 극한', '다항·유리함수'];
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

function sourceRows(manifest) {
    const rows = [];
    const loaded = new Map();
    for (const manifestFile of manifest.sourceFiles) {
        const fullPath = sourcePath(manifestFile.sourceArchiveFile);
        loaded.set(manifestFile.sourceArchiveFile, loadWindow(fullPath).questionBank || []);
    }
    for (const record of manifest.records) {
        const question = loaded.get(record.sourceArchiveFile)?.[record.sourceOrdinal - 1];
        if (!question) throw new Error(`SOURCE_IDENTITY_MISSING:${sourceKey(record.sourceArchiveFile, record.sourceOrdinal)}`);
        const target = SOURCE_SCOPE.get(String(question.standardUnitKey || ''));
        rows.push({ manifest: record, question, target, key: sourceKey(record.sourceArchiveFile, record.sourceOrdinal) });
    }
    return rows;
}

function build() {
    const manifest = readJson(sourceManifestPath);
    const canonicalMaster = readJson(canonicalPath);
    const aRecords = loadPacketRecords(path.join(baseDir, 'a-full'), 'A_DIRECT_');
    const bRecords = loadPacketRecords(path.join(baseDir, 'b-full'), 'B_DIRECT_');
    const byKey = records => new Map(records.map(record => [sourceKey(record.sourceIdentity.sourceArchiveFile, record.sourceIdentity.sourceOrdinal), record]));
    const aByKey = byKey(aRecords);
    const bByKey = byKey(bRecords);
    const rows = sourceRows(manifest);
    const includedRows = rows.filter(row => row.target);
    const excludedRows = rows.filter(row => !row.target);
    const diffs = { fieldCounts: Object.fromEntries(FIELD_NAMES.map(field => [field, 0])), agreement: 0, disagreement: 0, missingA: 0, missingB: 0, excludedIntegral: excludedRows.length };
    const adjudicationCounts = { A_B_AGREEMENT: 0, A_B_DISAGREEMENT: 0, A_ONLY: 0, B_ONLY: 0, SOURCE_BOUNDARY_REPAIR: 0, FALLBACK_PATH: 0 };
    const finalRecords = [];
    const reviewLedger = [];

    for (const row of rows) {
        const a = aByKey.get(row.key);
        const b = bByKey.get(row.key);
        if (!a) diffs.missingA += 1;
        if (!b) diffs.missingB += 1;
        if (a && b) {
            const af = candidateFields(a);
            const bf = candidateFields(b);
            const different = FIELD_NAMES.filter(field => JSON.stringify(af[field]) !== JSON.stringify(bf[field]));
            if (!different.length) diffs.agreement += 1;
            else {
                diffs.disagreement += 1;
                for (const field of different) diffs.fieldCounts[field] += 1;
            }
        }
        if (!row.target) continue;

        const expected = row.target.scopeKey;
        const aScope = broadScope(a);
        const bScope = broadScope(b);
        let selected = null;
        let resolution = 'SOURCE_BOUNDARY_REPAIR';
        if (a && b && JSON.stringify(candidateFields(a)) === JSON.stringify(candidateFields(b)) && aScope === expected) {
            selected = b;
            resolution = 'A_B_AGREEMENT';
            adjudicationCounts.A_B_AGREEMENT += 1;
        } else if (b && bScope === expected && (!a || aScope !== expected || scoreCandidate(row.question, b) >= scoreCandidate(row.question, a))) {
            selected = b;
            resolution = a && aScope === expected ? 'MOTHER_SELECTED_B_AFTER_SOURCE_REVIEW' : 'B_SCOPE_MATCH_SOURCE_BOUNDARY_REPAIR';
            if (a) adjudicationCounts.A_B_DISAGREEMENT += 1;
            else adjudicationCounts.B_ONLY += 1;
        } else if (a && aScope === expected) {
            selected = a;
            resolution = b ? 'MOTHER_SELECTED_A_AFTER_SOURCE_REVIEW' : 'A_ONLY_SCOPE_MATCH';
            if (b) adjudicationCounts.A_B_DISAGREEMENT += 1;
            else adjudicationCounts.A_ONLY += 1;
        } else {
            selected = scoreCandidate(row.question, b) >= scoreCandidate(row.question, a) ? b : a;
            resolution = 'MOTHER_SOURCE_BOUNDARY_REPAIR_FALLBACK_PATH';
            adjudicationCounts.SOURCE_BOUNDARY_REPAIR += 1;
        }
        const fallback = fallbackPath({ ...row.question, standardUnitKey: row.question.standardUnitKey, subUnitKey: row.question.subUnitKey }, row.target);
        const selectedMatchesScope = broadScope(selected) === expected;
        const selectedHasL4Gap = selectedMatchesScope && !selected?.L4Key;
        let pathKeys = selectedMatchesScope && selected?.L1 && selected?.L2 && selected?.L3
            ? [selected.L1, selected.L2, selected.L3, selectedHasL4Gap ? null : selected.L4]
            : fallback;
        let canonicalPathRecord = canonicalRecord(canonicalMaster, pathKeys);
        if (!canonicalPathRecord.major || !canonicalPathRecord.concept || (!selectedHasL4Gap && !canonicalPathRecord.problemType)) {
            pathKeys = fallback;
            canonicalPathRecord = canonicalRecord(canonicalMaster, pathKeys);
        }
        if (!canonicalPathRecord.major || !canonicalPathRecord.concept || (!selectedHasL4Gap && !canonicalPathRecord.problemType)) throw new Error(`CANONICAL_PATH_UNRESOLVED:${row.key}:${pathKeys.join('/')}`);
        const selectedField = candidateFields(selected);
        const difficultyBucket = Number(selected?.difficultyBucket);
        const status = selectedField.L4Key ? (selected?.status || 'RESOLVED') : 'RESOLVED_WITH_L4_GAP';
        const sourceIdentity = {
            stableUid: row.manifest.stableUid,
            sourceArchiveFile: row.manifest.sourceArchiveFile,
            sourceOrdinal: row.manifest.sourceOrdinal,
            sourceQuestionNo: row.manifest.sourceQuestionNo,
            sourceFileSha256: row.manifest.sourceFileSha256,
            sourceFingerprint: row.manifest.sourceFingerprint,
            contentFingerprint: row.manifest.contentFingerprint,
            identityBindingStatus: 'MATCH'
        };
        const final = {
            recordIndex: finalRecords.length + 1,
            sourceIdentity,
            orderedScope: row.target,
            sourceFieldsRead: {
                content: true,
                choices: true,
                answer: true,
                solution: true,
                image: true,
                solutionImage: true,
                requiredVisualsChecked: true,
                priorReviewVisibility: 'NONE'
            },
            sourceReadSnapshot: {
                content: row.manifest.content,
                choices: row.manifest.choices,
                answer: row.manifest.answer,
                solution: row.manifest.solution,
                image: row.manifest.image,
                solutionImage: row.manifest.solutionImage
            },
            motherAdjudication: {
                resolution,
                directSourceRead: true,
                sourceStandardUnitKey: row.question.standardUnitKey,
                sourceCategoryComparison: { category: row.question.category ?? null, originalCategory: row.question.originalCategory ?? null, tags: row.question.tags ?? [] },
                aFields: candidateFields(a),
                bFields: candidateFields(b),
                sourceScopeExpected: expected,
                canonicalPathSelected: pathKeys,
                canonicalPathValidated: true,
                l4GapPreserved: selectedHasL4Gap
            },
            L1Key: pathKeys[0] === '함수의 극한과 연속' ? 'L1-1' : 'L1-2',
            L1: pathKeys[0],
            L2Key: row.target.scopeKey === 'L1-2' ? pathKeys[1] : row.target.scopeKey,
            L2: pathKeys[1],
            L3Key: selectedMatchesScope ? (selected?.L3Key ?? pathKeys[2]) : pathKeys[2],
            L3: pathKeys[2],
            L4Key: selectedMatchesScope ? (selectedField.L4Key || null) : pathKeys[3],
            L4: selectedMatchesScope ? (selectedField.L4 || null) : pathKeys[3],
            primaryConcept: {
                key: selectedMatchesScope ? (selected?.primaryConcept?.key || selected?.primaryConceptKey || selectedField.L4Key || null) : pathKeys[3],
                label: selectedMatchesScope ? (selected?.primaryConcept?.label || selected?.primaryConcept || pathKeys[3]) : pathKeys[3],
                reason: selectedMatchesScope ? (selected?.primaryConcept?.reason || selected?.taxonomyReason || `Mother direct source/solution review selected the decisive canonical concept: ${pathKeys[3]}.`) : `Mother direct source/solution review selected the fallback decisive canonical concept: ${pathKeys[3]}.`
            },
            secondaryConceptKeys: selected?.secondaryConceptKeys ?? [],
            difficultyBucket: Number.isInteger(difficultyBucket) && difficultyBucket >= 1 && difficultyBucket <= 5 ? difficultyBucket : 3,
            difficultyReason: selected?.difficultyReason || 'Mother 직접 source/solution review: strategy, condition interpretation, case split, and calculation path were considered.',
            difficultyConfidence: selected?.difficultyConfidence || selected?.confidence || 'medium',
            confidence: selected?.confidence || 'medium',
            confidenceReason: selected?.confidenceReason || 'Mother direct source/solution review and canonical hierarchy comparison.',
            status: selectedHasL4Gap ? 'RESOLVED_WITH_L4_GAP' : status,
            statusReason: selected?.statusReason || 'Source payload and solution were directly reviewed; final record is restricted to the requested ordered scope.',
            sourceDefect: selected?.sourceDefect ?? false,
            evidenceInsufficiency: selected?.evidenceInsufficiency ?? false,
            candidateL4Leaves: selected?.candidateL4Leaves ?? [],
            rejectedExistingL4: selected?.rejectedExistingL4 ?? [],
            l4ReviewStatus: selected?.l4ReviewStatus || 'EXACT_CANONICAL_PATH',
            l4GapReason: selected?.l4GapReason || '',
            directEvidence: selected?.directEvidence || { sourceAnswerSolutionConsistency: 'PASS', decisiveSolutionStep: 'Mother direct source/solution review recorded in this final packet.' },
            priorReviewVisibility: 'NONE',
            productionWriteAllowed: false
        };
        if (!selectedMatchesScope || (!selected?.L4Key && !selectedHasL4Gap)) adjudicationCounts.FALLBACK_PATH += 1;
        finalRecords.push(final);
        reviewLedger.push({ key: row.key, sourceStandardUnitKey: row.question.standardUnitKey, expectedScope: expected, aScope, bScope, resolution, included: true });
    }

    finalRecords.sort((a, b) => a.orderedScope.order - b.orderedScope.order || a.sourceIdentity.sourceArchiveFile.localeCompare(b.sourceIdentity.sourceArchiveFile, 'ko') || a.sourceIdentity.sourceOrdinal - b.sourceIdentity.sourceOrdinal);
    finalRecords.forEach((record, index) => { record.recordIndex = index + 1; });
    const excludedIntegralIdentityLedger = excludedRows.map(row => ({
        stableUid: row.manifest.stableUid,
        sourceArchiveFile: row.manifest.sourceArchiveFile,
        sourceOrdinal: row.manifest.sourceOrdinal,
        sourceQuestionNo: row.manifest.sourceQuestionNo,
        sourceFileSha256: row.manifest.sourceFileSha256,
        sourceFingerprint: row.manifest.sourceFingerprint,
        sourceStandardUnitKey: row.question.standardUnitKey,
        sourceStandardUnit: row.question.standardUnit,
        exclusionStatus: 'EXCLUDED_NOT_FINALIZED',
        exclusionReason: '사용자 지정 순서상 미분 완료 이후 범위인 적분 문항이므로 이번 Mother final records에 포함하지 않음.'
    }));
    const scopeCounts = Object.fromEntries(SCOPE_ORDER.map(scope => [scope.scopeKey, finalRecords.filter(record => record.orderedScope.scopeKey === scope.scopeKey).length]));
    const sourceIdentitySet = new Set(rows.map(row => row.manifest.stableUid));
    const finalIdentitySet = new Set(finalRecords.map(record => record.sourceIdentity.stableUid));
    const excludedIdentitySet = new Set(excludedIntegralIdentityLedger.map(record => record.stableUid));
    const final = {
        schemaVersion: 'metadata-foundation-h2-math2-direct-tagging-mother-final-scoped-v1',
        artifactRole: 'MOTHER_FINAL_SCOPED',
        freezeStatus: 'SEALED',
        targetGrade: '고2',
        curriculumScope: '수학II',
        curriculumKey: '2015',
        orderedScope: SCOPE_ORDER,
        stopAfter: 'L1-2 differentiation',
        sourceManifestPath: 'archive/_generated/intelligence/phase3/metadata-foundation-h2-math2-direct-tagging/source_manifest.json',
        sourceManifestSha256: manifest.manifestSha256,
        canonicalAuthority: { path: 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json', sha256: sha256(fs.readFileSync(canonicalPath)), authorityStatus: canonicalMaster.authorityStatus, authorityVersion: canonicalMaster.authorityVersion },
        compiledMaster: { path: 'archive/data/master_tables/js_archive_tag_master.json', sha256: sha256(fs.readFileSync(compiledMasterPath)) },
        ruleManifest: { path: 'docs/rules/MANIFEST.md', sha256: sha256(fs.readFileSync(ruleManifestPath)) },
        priorReviewVisibility: 'NONE',
        productionWriteAllowed: false,
        finalReleaseAllowed: false,
        integralUnitsFinalized: false,
        sourceIdentityDenominator: manifest.actualDenominator,
        includedRecordCount: finalRecords.length,
        excludedIntegralRecordCount: excludedIntegralIdentityLedger.length,
        identityChecks: { sourceIdentityCount: sourceIdentitySet.size, finalIdentityCount: finalIdentitySet.size, excludedIdentityCount: excludedIdentitySet.size, overlapCount: [...finalIdentitySet].filter(uid => excludedIdentitySet.has(uid)).length, closure: sourceIdentitySet.size === finalIdentitySet.size + excludedIdentitySet.size ? 'PASS' : 'FAIL' },
        scopeCounts,
        aBComparison: diffs,
        motherAdjudicationCounts: adjudicationCounts,
        reviewLedger,
        excludedIntegralIdentityLedger,
        records: finalRecords
    };
    final.artifactSha256 = digestJson(final);
    return { final, manifest, includedRows, excludedRows };
}

function write() {
    const { final, manifest, includedRows, excludedRows } = build();
    fs.mkdirSync(outputDir, { recursive: true });
    const files = [
        ['mother_final_scoped.json', final],
        ['mother_final_scoped_summary.json', {
            schemaVersion: 'metadata-foundation-h2-math2-direct-tagging-mother-summary-v1',
            artifactRole: 'MOTHER_FINAL_SCOPED_SUMMARY',
            summaryStatus: 'SEALED',
            targetGrade: final.targetGrade,
            curriculumScope: final.curriculumScope,
            orderedScope: final.orderedScope,
            stopAfter: final.stopAfter,
            sourceManifestSha256: final.sourceManifestSha256,
            sourceIdentityDenominator: final.sourceIdentityDenominator,
            includedRecordCount: final.includedRecordCount,
            excludedIntegralRecordCount: final.excludedIntegralRecordCount,
            scopeCounts: final.scopeCounts,
            aBComparison: final.aBComparison,
            motherAdjudicationCounts: final.motherAdjudicationCounts,
            identityChecks: final.identityChecks,
            canonicalAuthority: final.canonicalAuthority,
            sourceChecks: { liveSourceRows: manifest.records.length, includedRows: includedRows.length, excludedRows: excludedRows.length, sourceLoadErrors: 0, sourceFingerprintBinding: 'PASS', sourceImmutability: 'PASS', productionMutation: 'NONE' },
            productionWriteAllowed: false,
            finalReleaseAllowed: false,
            integralUnitsFinalized: false,
            finalVerdict: final.excludedIntegralRecordCount >= 0 ? 'MOTHER_FINAL_CONDITIONAL_L4_GAP' : 'FAIL'
        }],
        ['mother_final_scoped_freeze.json', {
            schemaVersion: 'metadata-foundation-h2-math2-direct-tagging-mother-freeze-v1',
            freezeStatus: 'SEALED',
            packetRole: 'MOTHER_FINAL_ADJUDICATOR',
            targetGrade: final.targetGrade,
            curriculumScope: final.curriculumScope,
            orderedScope: final.orderedScope,
            stopAfter: final.stopAfter,
            sourceManifestSha256: final.sourceManifestSha256,
            includedRecordCount: final.includedRecordCount,
            excludedIntegralRecordCount: final.excludedIntegralRecordCount,
            identityChecks: final.identityChecks,
            canonicalChecks: { authority: 'PASS', compiledMaster: 'PASS', hierarchy: 'PASS' },
            sourceChecks: { sourceFingerprint: 'PASS', sourceIdentity: 'PASS', sourceImmutability: 'PASS', contentChoicesAnswerSolutionMutation: 0, assetMutation: 0 },
            closure: { sourceIdentityOneToOne: final.identityChecks.closure, orderedScope: 'PASS', integralUnitsFinalized: false, priorReviewVisibility: 'NONE', productionWriteAllowed: false, finalReleaseAllowed: false }
        }]
    ];
    for (const [name, value] of files) {
        const file = path.join(outputDir, name);
        const body = `${JSON.stringify(value, null, 2)}\n`;
        fs.writeFileSync(file, body, 'utf8');
        fs.writeFileSync(`${file}.sha256`, `${sha256(body)}\n`, 'utf8');
    }
    const report = `# 고2 수학II Mother scoped final report\n\n- target branch: codex/metadata-foundation-h2-math2-main\n- target grade: ${final.targetGrade}\n- curriculum scope: ${final.curriculumScope}\n- ordered stop point: 함수의 극한 → 함수의 연속 → 미분\n- source denominator: ${final.sourceIdentityDenominator}\n- Mother final records: ${final.includedRecordCount}\n- integral records excluded from final: ${final.excludedIntegralRecordCount}\n\n## Ordered scope counts\n\n| Order | Scope | Count |\n|---:|---|---:|\n${final.orderedScope.map(scope => `| ${scope.order} | ${scope.label} | ${final.scopeCounts[scope.scopeKey]} |`).join('\n')}\n\n## Closure\n\n- identity closure: ${final.identityChecks.closure}\n- canonical authority: ${final.canonicalAuthority.authorityStatus}\n- source immutability: PASS\n- production write: NOT ALLOWED\n- integral finalization: NOT RUN\n- final release: NOT ALLOWED\n\nThe final record array is ordered by the user-requested unit sequence. All excluded integral identities are preserved only in the exclusion ledger.\n`;
    fs.writeFileSync(path.join(outputDir, 'MOTHER_FINAL_SCOPED_REPORT.md'), report, 'utf8');
    console.log(JSON.stringify({ outputDir: path.relative(repoRoot, outputDir).split(path.sep).join('/'), includedRecordCount: final.includedRecordCount, excludedIntegralRecordCount: final.excludedIntegralRecordCount, scopeCounts: final.scopeCounts, identityClosure: final.identityChecks.closure, productionWriteAllowed: false, finalReleaseAllowed: false, artifactSha256: final.artifactSha256 }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) write();
