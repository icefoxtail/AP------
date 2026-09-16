import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Fresh, source-first inventory for the middle-school grade-3 Metadata
 * Foundation v2 migration.
 *
 * This tool only observes archive/exams/original/middle/m3 and writes derived
 * inventory/queue evidence. It never rewrites source JS, db.js, the global
 * identity map, or the global metadata sidecar.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const sourceRoot = path.join(archiveDir, 'exams', 'original', 'middle', 'm3');
const identityPath = path.join(archiveDir, 'data', 'question_identity_map.json');
const previousMetadataPath = path.join(archiveDir, 'data', 'question_metadata.json');
const dbPath = path.join(archiveDir, 'db.js');
const canonicalMasterPath = path.join(repoRoot, 'docs', 'rules', '01_CANONICAL', 'taxonomy', 'rpm-primary-v1.0', '00_POLICY', 'CANONICAL_MASTER.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation');
const inventoryPath = path.join(outputDir, 'M3_FRESH_INVENTORY.json');
const queueJsonPath = path.join(outputDir, 'M3_L1_WORK_QUEUE.json');
const queueMdPath = path.join(outputDir, 'M3_L1_WORK_QUEUE.md');

const ALLOWED_CURRICULA = new Set(['2015', '2022']);
const L1_KEY_BY_UNIT = {
    'M3-01': 'REAL_NUMBER_OPERATIONS',
    'M3-02': 'POLYNOMIAL_MULTIPLICATION_FACTORIZATION',
    'M3-03': 'QUADRATIC_EQUATION',
    'M3-04': 'QUADRATIC_FUNCTION',
    'M3-05': 'TRIG_RATIO',
    'M3-06': 'CIRCLE_PROPERTIES',
    'M3-07': 'STATISTICS'
};

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function normalizeFile(value) {
    return String(value || '')
        .normalize('NFC')
        .replace(/\\/g, '/')
        .replace(/^\.?\/?archive\/exams\//, '')
        .replace(/^\.?\/?exams\//, '')
        .replace(/^\/+/, '')
        .replace(/[?#].*$/, '')
        .trim();
}

function stableJson(value) {
    return JSON.stringify(value);
}

function sourceFingerprint(question) {
    return sha256(stableJson({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        answer: question?.answer ?? null,
        solution: question?.solution ?? null,
        image: question?.image ?? null
    }));
}

function contentFingerprint(question) {
    return sha256(stableJson({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        image: question?.image ?? null
    }));
}

function runScript(file, code) {
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(code, context, { filename: file, timeout: 2000 });
    return context;
}

function readQuestionBank(fullPath) {
    const context = runScript(fullPath, fs.readFileSync(fullPath, 'utf8'));
    const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
    if (!Array.isArray(questions)) throw new Error(`questions array not found: ${fullPath}`);
    return questions;
}

function readDb() {
    const context = runScript(dbPath, fs.readFileSync(dbPath, 'utf8'));
    return Array.isArray(context.window.mainDB?.exams) ? context.window.mainDB.exams : [];
}

function present(value) {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && String(value).trim() !== '';
}

function text(value) {
    return value === undefined || value === null ? '' : String(value).trim();
}

function positiveBytes(fullPath) {
    try {
        return fs.statSync(fullPath).size > 0;
    } catch {
        return false;
    }
}

function assetInfo(relativeAsset, sourceFile) {
    const asset = text(relativeAsset);
    if (!asset) return { declared: false, path: '', exists: false, positiveBytes: false, linkedToSource: false };
    const clean = asset.replace(/^\.?\/?archive\//, '').replace(/^\/+/, '').replace(/\\/g, '/');
    const candidates = [
        path.join(archiveDir, clean),
        path.join(archiveDir, 'exams', sourceFile, '..', clean)
    ];
    const resolved = candidates.find(candidate => fs.existsSync(candidate)) || candidates[0];
    return {
        declared: true,
        path: clean,
        exists: fs.existsSync(resolved),
        positiveBytes: positiveBytes(resolved),
        linkedToSource: clean.toLowerCase().includes(path.basename(sourceFile, '.js').toLowerCase())
    };
}

function sharedMaterialInfo(question) {
    const fields = ['sharedMaterial', 'shared', 'material', 'sharedMaterialId', 'sharedMaterialKey'];
    const presentFields = fields.filter(field => present(question?.[field]));
    const content = text(question?.content);
    const explicitCue = /공통\s*(자료|조건|문제|지문)|다음 자료|다음 글|[가-힣]+에 대한 다음 물음|[가-힣]+에 대하여 다음 물음/.test(content);
    return {
        present: presentFields.length > 0 || explicitCue,
        explicitFields: presentFields,
        contentCue: explicitCue
    };
}

function sourceYear(sourceFile, dbRecord) {
    const base = path.basename(sourceFile);
    const match = base.match(/^(\d{2})_/);
    if (match) return Number(match[1]) + 2000;
    return Number.isInteger(Number(dbRecord?.year)) ? Number(dbRecord.year) : null;
}

function resolveCurriculum(question, sourceFile, dbRecord) {
    const explicit = [question?.curriculumKey, question?.curriculum, question?.educationRevision, dbRecord?.curriculumKey, dbRecord?.curriculum]
        .map(text)
        .find(value => ALLOWED_CURRICULA.has(value));
    if (explicit) {
        return { curriculum: explicit, method: 'explicit_source_or_db_field', confidence: 'high', note: 'explicit curriculum field present' };
    }
    const year = sourceYear(sourceFile, dbRecord);
    if (year !== null && year >= 2027) {
        return { curriculum: '2022', method: 'source_year_after_m3_2022_release', confidence: 'medium', note: 'M3 2022 primary source register is the 2027 edition' };
    }
    return {
        curriculum: '2015',
        method: 'historical_source_register_guardrail',
        confidence: 'medium',
        note: 'source/DB has no curriculum field; RPM_M3_2022 source register is 2027 and latest fresh source year is before 2027'
    };
}

function l1ForUnit(standardUnitKey) {
    const unit = text(standardUnitKey);
    const match = unit.match(/^M3-(\d\d)$/);
    if (!match || !L1_KEY_BY_UNIT[unit]) return null;
    const order = Number(match[1]);
    const scope = order <= 4 ? 'M3-1' : 'M3-2';
    return { standardUnitKey: unit, scope, order, l1Key: L1_KEY_BY_UNIT[unit] };
}

function canonicalScopes(master) {
    return (master.records || [])
        .filter(record => record.level === 'middle' && String(record.scope).startsWith('M3-'))
        .map(record => ({
            curriculum: text(record.curriculum),
            scope: text(record.scope),
            majorUnit: text(record.majorUnit),
            midUnit: text(record.midUnit),
            curriculumApplicability: text(record.curriculumApplicability) || 'DEFAULT_SCOPE',
            defaultSelectable: record.defaultSelectable !== false,
            concepts: (record.concepts || []).map(concept => ({
                concept: text(concept.concept),
                curriculumApplicability: text(concept.curriculumApplicability) || 'DEFAULT_SCOPE',
                defaultSelectable: concept.defaultSelectable !== false,
                problemTypes: (concept.problemTypes || []).map(problemType => ({
                    problemType: text(problemType.problemType),
                    curriculumApplicability: text(problemType.curriculumApplicability) || 'DEFAULT_SCOPE',
                    defaultSelectable: problemType.defaultSelectable !== false
                }))
            }))
        }));
}

function scopeSummary(scopes, curriculum, scope, majorUnit) {
    const records = scopes.filter(record => record.curriculum === curriculum && record.scope === scope && record.majorUnit === majorUnit);
    const l2 = [...new Set(records.map(record => record.midUnit))];
    const l4 = records.flatMap(record => record.concepts.flatMap(concept => concept.problemTypes));
    return {
        l2Names: l2,
        l2Count: l2.length,
        l4PathCount: l4.length,
        applicability: {
            DEFAULT_SCOPE: l4.filter(item => item.curriculumApplicability === 'DEFAULT_SCOPE').length,
            RPM_EXTENDED: l4.filter(item => item.curriculumApplicability === 'RPM_EXTENDED').length,
            RPM_EXTENDED_CANDIDATE: l4.filter(item => item.curriculumApplicability === 'RPM_EXTENDED_CANDIDATE').length
        }
    };
}

function readIdentity() {
    const identity = JSON.parse(fs.readFileSync(identityPath, 'utf8'));
    const byTuple = new Map();
    for (const record of identity.records || []) {
        const key = `${normalizeFile(record.sourceArchiveFile)}#${Number(record.sourceOrdinal)}`;
        byTuple.set(key, record);
    }
    return { identity, byTuple };
}

function readPreviousMetadata() {
    if (!fs.existsSync(previousMetadataPath)) return new Map();
    const raw = JSON.parse(fs.readFileSync(previousMetadataPath, 'utf8'));
    return new Map((raw.records || []).map(record => [record.questionUid, record]));
}

function collectSources() {
    const files = [];
    for (const semesterDir of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
        if (!semesterDir.isDirectory()) continue;
        const fullDir = path.join(sourceRoot, semesterDir.name);
        for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
            if (entry.isFile() && entry.name.endsWith('.js')) files.push(path.join(fullDir, entry.name));
        }
    }
    return files.sort((a, b) => a.localeCompare(b, 'en'));
}

function renderQueueMarkdown(queue) {
    const lines = [
        '# M3 L1 Work Queue — Metadata Foundation v2',
        '',
        `- source commit: \`${queue.sourceCommit}\``,
        `- fresh inventory: \`${queue.freshInventory}\``,
        `- exact original denominator: **${queue.denominator.questionCount} questions / ${queue.denominator.sourceFileCount} source files**`,
        `- curriculum resolution: ${queue.curriculumResolution.note}`,
        `- taxonomy: \`TAXONOMY_AUTHORITY = LOCKED\` / \`RPM_PRIMARY_TAXONOMY_v1.0\``,
        '',
        '- pre-classification scope holds: ' + queue.scopeHolds.length + ' questions (not forced into a locked M3 L1 path)',
        '## Scope decision',
        '',
        '| curriculum | source evidence | question count | source files |',
        '|---|---|---:|---:|',
        `| 2015 | source register historical M3 scope | ${queue.curriculumCounts['2015'].questions} | ${queue.curriculumCounts['2015'].sourceFiles} |`,
        `| 2022 | no eligible source through 2026; 2022 M3 primary is 2027 edition | ${queue.curriculumCounts['2022'].questions} | ${queue.curriculumCounts['2022'].sourceFiles} |`,
        '',
        '## L1 queue',
        '',
        '| order | curriculum | scope | L1 key | L1 name | questions | source files | L2 count | visual | shared | status |',
        '|---:|---|---|---|---|---:|---:|---:|---:|---:|---|'
    ];
    for (const item of queue.targets) {
        lines.push(`| ${item.order} | ${item.curriculum} | ${item.scope} | \`${item.L1Key}\` | ${item.L1Name} | ${item.questionCount} | ${item.sourceFileCount} | ${item.L2Count} | ${item.visualQuestionCount} | ${item.sharedMaterialCount} | ${item.status} |`);
    }
    lines.push('', '## Rules', '', '- One work unit = one L1; 2015 and 2022 are separate canonical scopes.', '- No classification begins before this denominator and queue are frozen.', '- This queue is source-first evidence only; it does not approve or apply metadata.', '- `types/` and `similar/` are excluded from the production denominator.', '');
    return `${lines.join('\n')}\n`;
}

function main() {
    const sourceCommit = execFileSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD']).toString('utf8').trim();
    const { identity, byTuple } = readIdentity();
    const previousMetadata = readPreviousMetadata();
    const dbByFile = new Map(readDb().map(record => [normalizeFile(record.file), record]));
    const master = JSON.parse(fs.readFileSync(canonicalMasterPath, 'utf8'));
    const scopes = canonicalScopes(master);
    const files = collectSources();
    const records = [];
    const fileReports = [];
    const failures = [];
    const sourceFingerprints = new Map();
    const contentFingerprints = new Map();
    const sourceJsShaByFile = {};
    const curriculumEvidence = {};

    for (const fullPath of files) {
        const sourceArchiveFile = normalizeFile(path.relative(path.join(archiveDir, 'exams'), fullPath));
        const sourceCode = fs.readFileSync(fullPath, 'utf8');
        sourceJsShaByFile[sourceArchiveFile] = sha256(sourceCode);
        const dbRecord = dbByFile.get(sourceArchiveFile) || null;
        try {
            const questions = readQuestionBank(fullPath);
            const resolution = resolveCurriculum(questions[0], sourceArchiveFile, dbRecord);
            curriculumEvidence[resolution.curriculum] ??= { method: resolution.method, confidence: resolution.confidence, note: resolution.note };
            const semester = sourceArchiveFile.split('/')[3] || '';
            const sourceYearValue = sourceYear(sourceArchiveFile, dbRecord);
            const sourceOrdinals = new Set();
            for (let index = 0; index < questions.length; index += 1) {
                const question = questions[index] || {};
                const sourceOrdinal = index + 1;
                sourceOrdinals.add(sourceOrdinal);
                const identity = byTuple.get(`${sourceArchiveFile}#${sourceOrdinal}`) || null;
                const uid = text(identity?.questionUid);
                const sourceFp = sourceFingerprint(question);
                const contentFp = contentFingerprint(question);
                const sourceImage = assetInfo(question.image, sourceArchiveFile);
                const content = text(question.content);
                const visualDependency = {
                    hasImageField: sourceImage.declared,
                    embeddedImg: /<img\b/i.test(content),
                    embeddedSvg: /<svg\b/i.test(content),
                    embeddedTable: /<table\b/i.test(content),
                    asset: sourceImage,
                    required: sourceImage.declared || /<img\b|<svg\b|<table\b/i.test(content)
                };
                const sharedMaterial = sharedMaterialInfo(question);
                const l1 = l1ForUnit(question.standardUnitKey);
                const previous = uid ? previousMetadata.get(uid) : null;
                const reviewStatus = text(question.reviewStatus) || text(previous?.reviewStatus) || 'UNREVIEWED';
                if (uid) sourceFingerprints.set(uid, sourceFp);
                if (uid) contentFingerprints.set(uid, contentFp);
                records.push({
                    curriculum: resolution.curriculum,
                    curriculumResolution: resolution,
                    courseKey: text(dbRecord?.primaryStandardCourse) || '중3 수학',
                    semester,
                    sourceYear: sourceYearValue,
                    examType: text(dbRecord?.examType) || (semester.includes('mid') ? 'mid' : semester.includes('final') ? 'final' : ''),
                    sourceArchiveFile,
                    sourceOrdinal,
                    sourceQuestionNo: identity?.sourceQuestionNo ?? question.id ?? null,
                    questionUid: uid,
                    currentStandardUnitKey: text(question.standardUnitKey),
                    currentStandardUnit: text(question.standardUnit),
                    currentSubUnitKey: text(question.subUnitKey),
                    currentSubUnit: text(question.subUnit),
                    currentConceptClusterKey: text(question.conceptClusterKey || question.conceptCluster),
                    currentProblemTypeKey: text(question.problemTypeKey || question.typeKey),
                    currentTemplateKey: text(question.templateKey),
                    currentLevel: text(question.level),
                    currentDifficultyBucket: text(question.difficultyBucket),
                    solutionPresent: present(question.solution),
                    visualDependency,
                    sharedMaterialDependency: sharedMaterial,
                    sourceFingerprint: sourceFp,
                    contentFingerprint: contentFp,
                    sourceJsSha256: sourceJsShaByFile[sourceArchiveFile],
                    reviewStatus,
                    identityJoin: {
                        present: Boolean(identity),
                        sourceFingerprintMatches: Boolean(identity?.sourceFingerprint && identity.sourceFingerprint === sourceFp),
                        expectedUidFromTuple: uid ? `qid_v1_${sha256(`${sourceArchiveFile}#${sourceOrdinal}`)}` : '',
                        uidAlgorithmMatches: uid === `qid_v1_${sha256(`${sourceArchiveFile}#${sourceOrdinal}`)}`
                    },
                    l1Evidence: {
                        standardUnitKey: l1?.standardUnitKey || '',
                        scope: l1?.scope || '',
                        note: l1 ? 'source standardUnitKey maps to locked M3 standard-unit parent; L2-L4 remain separate evidence decisions' : 'no canonical M3 standard-unit parent'
                    },
                    sourceFieldSnapshot: {
                        content,
                        choices: Array.isArray(question.choices) ? question.choices : [],
                        answer: question.answer ?? '',
                        solution: question.solution ?? '',
                        image: question.image ?? ''
                    },
                    existingSidecar: previous ? {
                        standardUnitKey: text(previous.standardUnitKey),
                        subUnitKey: text(previous.subUnitKey),
                        conceptClusterKey: text(previous.conceptClusterKey),
                        problemTypeKey: text(previous.problemTypeKey),
                        templateKey: text(previous.templateKey),
                        difficultyBucket: previous.difficultyBucket ?? '',
                        metadataRevision: text(previous.metadataRevision)
                    } : null
                });
            }
            fileReports.push({
                sourceArchiveFile,
                sourceJsSha256: sourceJsShaByFile[sourceArchiveFile],
                sourceYear: sourceYearValue,
                curriculum: resolveCurriculum(questions[0], sourceArchiveFile, dbRecord).curriculum,
                semester,
                examType: text(dbRecord?.examType),
                dbRecordPresent: Boolean(dbRecord),
                dbQuestionCount: dbRecord?.qCount ?? null,
                sourceQuestionCount: questions.length,
                sourceQuestionCountMatchesDb: dbRecord ? Number(dbRecord.qCount) === questions.length : false,
                loadStatus: 'PASS'
            });
        } catch (error) {
            failures.push({ sourceArchiveFile, error: error?.message || String(error) });
            fileReports.push({ sourceArchiveFile, loadStatus: 'FAIL', error: error?.message || String(error) });
        }
    }

    const counts = {
        curriculum: {},
        semester: {},
        examType: {},
        currentStandardUnitKey: {},
        currentSubUnitKey: {},
        currentLevel: {},
        currentDifficultyBucket: {},
        solutionPresence: { present: 0, missing: 0 },
        visualDependency: { required: 0, notRequired: 0, assetMissing: 0, assetEmpty: 0 },
        sharedMaterialDependency: { present: 0, absent: 0 },
        reviewStatus: {}
    };
    const inc = (map, key) => { const normalized = text(key) || '(empty)'; map[normalized] = (map[normalized] || 0) + 1; };
    for (const record of records) {
        inc(counts.curriculum, record.curriculum);
        inc(counts.semester, record.semester);
        inc(counts.examType, record.examType);
        inc(counts.currentStandardUnitKey, record.currentStandardUnitKey);
        inc(counts.currentSubUnitKey, record.currentSubUnitKey);
        inc(counts.currentLevel, record.currentLevel);
        inc(counts.currentDifficultyBucket, record.currentDifficultyBucket);
        inc(counts.reviewStatus, record.reviewStatus);
        record.solutionPresent ? counts.solutionPresence.present += 1 : counts.solutionPresence.missing += 1;
        record.visualDependency.required ? counts.visualDependency.required += 1 : counts.visualDependency.notRequired += 1;
        if (record.visualDependency.required && !record.visualDependency.asset.exists && record.visualDependency.hasImageField) counts.visualDependency.assetMissing += 1;
        if (record.visualDependency.required && record.visualDependency.hasImageField && !record.visualDependency.asset.positiveBytes) counts.visualDependency.assetEmpty += 1;
        record.sharedMaterialDependency.present ? counts.sharedMaterialDependency.present += 1 : counts.sharedMaterialDependency.absent += 1;
    }

    const curriculumCounts = {};
    for (const curriculum of ['2015', '2022']) {
        const scoped = records.filter(record => record.curriculum === curriculum);
        curriculumCounts[curriculum] = {
            questions: scoped.length,
            sourceFiles: new Set(scoped.map(record => record.sourceArchiveFile)).size,
            semester: scoped.reduce((map, record) => { inc(map, record.semester); return map; }, {}),
            l1: scoped.reduce((map, record) => { inc(map, record.currentStandardUnitKey); return map; }, {})
        };
    }

    const targets = [];
    const scopeHolds = records
        .filter(record => !l1ForUnit(record.currentStandardUnitKey))
        .map(record => ({
            questionUid: record.questionUid,
            sourceArchiveFile: record.sourceArchiveFile,
            sourceOrdinal: record.sourceOrdinal,
            currentStandardUnitKey: record.currentStandardUnitKey,
            currentSubUnitKey: record.currentSubUnitKey,
            content: record.sourceFieldSnapshot.content,
            solution: record.sourceFieldSnapshot.solution,
            disposition: 'FOUNDATION_DEFECT_CANDIDATE',
            status: 'HOLD',
            reason: 'content/solution evidence indicates a decisive mathematical concept outside the locked M3-01..M3-07 taxonomy (for example Pythagorean or solid geometry); the source-unit mismatch is only supporting evidence, and visual/diagram/solid representation alone is never an outlier reason'
        }));
    let order = 1;
    for (const curriculum of ['2015', '2022']) {
        for (const scope of ['M3-1', 'M3-2']) {
            const scopeRecords = records.filter(record => record.curriculum === curriculum && record.l1Evidence.scope === scope);
            const unitKeys = [...new Set(scopeRecords.map(record => record.currentStandardUnitKey))].sort();
            for (const unitKey of unitKeys) {
                const l1 = l1ForUnit(unitKey);
                const targetRecords = scopeRecords.filter(record => record.currentStandardUnitKey === unitKey);
                const masterScope = scopes.find(record => record.curriculum === curriculum && record.scope === scope && record.majorUnit && l1 && record.majorUnit);
                const majorUnit = masterScope?.majorUnit || targetRecords[0]?.currentStandardUnit || unitKey;
                const canonical = scopeSummary(scopes, curriculum, scope, majorUnit);
                const sourceFiles = new Set(targetRecords.map(record => record.sourceArchiveFile));
                targets.push({
                    order: order++,
                    curriculum,
                    scope,
                    L1Key: `${curriculum}-${unitKey}-${l1?.l1Key || 'UNRESOLVED'}`,
                    L1Name: majorUnit,
                    standardUnitKey: unitKey,
                    questionCount: targetRecords.length,
                    sourceFileCount: sourceFiles.size,
                    L2Count: canonical.l2Count,
                    L2Names: canonical.l2Names,
                    canonicalL4PathCount: canonical.l4PathCount,
                    canonicalApplicability: canonical.applicability,
                    visualQuestionCount: targetRecords.filter(record => record.visualDependency.required).length,
                    sharedMaterialCount: targetRecords.filter(record => record.sharedMaterialDependency.present).length,
                    existingMetadataCoverage: {
                        subUnitKey: targetRecords.filter(record => record.currentSubUnitKey).length,
                        conceptClusterKey: targetRecords.filter(record => record.currentConceptClusterKey).length,
                        problemTypeKey: targetRecords.filter(record => record.currentProblemTypeKey).length,
                        templateKey: targetRecords.filter(record => record.currentTemplateKey).length,
                        difficultyBucket: targetRecords.filter(record => record.currentDifficultyBucket).length
                    },
                    denominator: targetRecords.map(record => record.questionUid).sort(),
                    status: targetRecords.length ? 'QUEUED_FOR_BLIND_L1_REVIEW' : 'NO_SOURCE_IN_DENOMINATOR'
                });
            }
        }
    }
    // Keep empty canonical 2022 targets visible even when fresh source has none.
    for (const curriculum of ['2015', '2022']) {
        for (const scope of ['M3-1', 'M3-2']) {
            for (const unitKey of Object.keys(L1_KEY_BY_UNIT).filter(key => (Number(key.slice(-2)) <= 4) === (scope === 'M3-1'))) {
                if (targets.some(target => target.curriculum === curriculum && target.scope === scope && target.standardUnitKey === unitKey)) continue;
                const l1 = l1ForUnit(unitKey);
                const masterScope = scopes.find(record => record.curriculum === curriculum && record.scope === scope && record.majorUnit && record.majorUnit && record.majorUnit === (scopes.find(item => item.curriculum === curriculum && item.scope === scope && item.midUnit) || {}).majorUnit);
                const fallbackNames = {
                    'M3-01': '실수와 그 연산', 'M3-02': '다항식의 곱셈과 인수분해', 'M3-03': '이차방정식', 'M3-04': '이차함수',
                    'M3-05': '삼각비', 'M3-06': '원의 성질', 'M3-07': '통계'
                };
                const majorUnit = fallbackNames[unitKey];
                const canonical = scopeSummary(scopes, curriculum, scope, majorUnit);
                targets.push({
                    order: order++, curriculum, scope,
                    L1Key: `${curriculum}-${unitKey}-${l1.l1Key}`,
                    L1Name: majorUnit, standardUnitKey: unitKey,
                    questionCount: 0, sourceFileCount: 0, L2Count: canonical.l2Count,
                    L2Names: canonical.l2Names, canonicalL4PathCount: canonical.l4PathCount,
                    canonicalApplicability: canonical.applicability, visualQuestionCount: 0,
                    sharedMaterialCount: 0, existingMetadataCoverage: {}, denominator: [],
                    status: 'NO_SOURCE_IN_DENOMINATOR'
                });
            }
        }
    }
    targets.sort((a, b) => ['2015', '2022'].indexOf(a.curriculum) - ['2015', '2022'].indexOf(b.curriculum) || ['M3-1', 'M3-2'].indexOf(a.scope) - ['M3-1', 'M3-2'].indexOf(b.scope) || a.standardUnitKey.localeCompare(b.standardUnitKey));
    targets.forEach((target, index) => { target.order = index + 1; });

    const duplicateUids = records.map(record => record.questionUid).filter((uid, index, all) => uid && all.indexOf(uid) !== index);
    const duplicateTuples = records.map(record => `${record.sourceArchiveFile}#${record.sourceOrdinal}`).filter((tuple, index, all) => all.indexOf(tuple) !== index);
    const identityJoinFailures = records.filter(record => !record.identityJoin.present || !record.identityJoin.uidAlgorithmMatches || !record.identityJoin.sourceFingerprintMatches);
    const denominator = {
        questionCount: records.length,
        sourceFileCount: files.length,
        sourceFileNames: files.map(fullPath => normalizeFile(path.relative(path.join(archiveDir, 'exams'), fullPath))),
        uidSetSha: sha256(records.map(record => record.questionUid).sort().join('\n')),
        sourceTupleSetSha: sha256(records.map(record => `${record.sourceArchiveFile}#${record.sourceOrdinal}`).sort().join('\n'))
    };
    const inventoryPayload = {
        schemaVersion: 'metadata-foundation-m3-fresh-inventory-v1',
        generatedAt: new Date().toISOString(),
        sourceCommit,
        sourceRoot: 'archive/exams/original/middle/m3/**/*.js',
        scope: '2015/2022 middle-grade-3 canonical metadata migration; original production only',
        exclusions: ['archive/exams/types/middle/m3', 'archive/exams/similar/middle/m3', 'question content/choices/answer/solution/image/layoutTag/wide mutation'],
        curriculumResolution: {
            status: 'RESOLVED_WITH_REGISTER_GUARDRAIL',
            sourceRegister: 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/SOURCE_REGISTER.md',
            sourceRegisterFact: 'RPM_M3_2022 is the 2027 edition; fresh original M3 source years end at 2026; source JS and DB expose no curriculum field',
            latestFreshSourceYear: Math.max(...records.map(record => record.sourceYear || 0)),
            method: 'explicit source/db curriculum if present; otherwise 2022 only at or after 2027, historical 2015 before 2027',
            evidence: curriculumEvidence
        },
        denominator,
        totals: {
            files: files.length,
            questions: records.length,
            loadFailures: failures.length,
            identityJoinFailures: identityJoinFailures.length,
            dbMissingFiles: fileReports.filter(report => !report.dbRecordPresent).length,
            dbQuestionCountMismatches: fileReports.filter(report => report.dbRecordPresent && !report.sourceQuestionCountMatchesDb).length,
            duplicateUidCount: new Set(duplicateUids).size,
            duplicateSourceTupleCount: new Set(duplicateTuples).size,
            scopeHoldCount: scopeHolds.length
        },
        counts,
        curriculumCounts,
        sourceJsShaByFile,
        files: fileReports,
        records,
        scopeHolds,
        validation: {
            sourceFilesLoaded: failures.length === 0,
            sourceQuestionCountVsDb: fileReports.every(report => report.dbRecordPresent && report.sourceQuestionCountMatchesDb),
            identityUidAndFingerprintJoin: identityJoinFailures.length === 0,
            duplicateUid: duplicateUids.length === 0,
            duplicateSourceTuple: duplicateTuples.length === 0,
            sourceOnlyScope: files.every(file => normalizeFile(path.relative(path.join(archiveDir, 'exams'), file)).startsWith('original/middle/m3/'))
        }
    };
    inventoryPayload.inventoryDigest = sha256(stableJson(inventoryPayload));
    const queue = {
        schemaVersion: 'metadata-foundation-m3-l1-work-queue-v1',
        generatedAt: inventoryPayload.generatedAt,
        sourceCommit,
        status: inventoryPayload.validation.sourceFilesLoaded && inventoryPayload.validation.sourceQuestionCountVsDb && inventoryPayload.validation.identityUidAndFingerprintJoin && inventoryPayload.validation.duplicateUid && inventoryPayload.validation.duplicateSourceTuple ? 'QUEUE_FROZEN_BEFORE_BLIND_CLASSIFICATION' : 'QUEUE_BLOCKED_VALIDATION_FAIL',
        freshInventory: 'archive/_generated/intelligence/phase1/middle3-foundation/M3_FRESH_INVENTORY.json',
        denominator,
        curriculumResolution: inventoryPayload.curriculumResolution,
        curriculumCounts,
        scopeHolds,
        targets,
        validation: inventoryPayload.validation,
        inventoryDigest: inventoryPayload.inventoryDigest
    };
    queue.queueDigest = sha256(stableJson(queue));
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(inventoryPath, `${JSON.stringify(inventoryPayload, null, 2)}\n`, 'utf8');
    fs.writeFileSync(queueJsonPath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
    fs.writeFileSync(queueMdPath, renderQueueMarkdown(queue), 'utf8');
    console.log(JSON.stringify({
        status: queue.status,
        inventory: path.relative(repoRoot, inventoryPath).replace(/\\/g, '/'),
        queueJson: path.relative(repoRoot, queueJsonPath).replace(/\\/g, '/'),
        queueMd: path.relative(repoRoot, queueMdPath).replace(/\\/g, '/'),
        sourceCommit,
        inventoryDigest: inventoryPayload.inventoryDigest,
        queueDigest: queue.queueDigest,
        files: denominator.sourceFileCount,
        questions: denominator.questionCount,
        curriculumCounts,
        identityJoinFailures: inventoryPayload.totals.identityJoinFailures,
        dbQuestionCountMismatches: inventoryPayload.totals.dbQuestionCountMismatches
    }, null, 2));
    if (queue.status !== 'QUEUE_FROZEN_BEFORE_BLIND_CLASSIFICATION') process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
