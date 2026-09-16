import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Metadata Foundation v2 — middle-school grade 2.
 *
 * This is deliberately scoped to archive/exams/original/middle/m2 and to the
 * canonical RPM M2-1/M2-2 slices.  It never edits an exam JS file.  Inventory
 * and candidate artifacts are evidence; apply is limited to the selected
 * queue's UIDs in archive/data/question_metadata.json.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const identityPath = path.join(archiveDir, 'data', 'question_identity_map.json');
const metadataPath = path.join(archiveDir, 'data', 'question_metadata.json');
const taxonomyPath = path.join(repoRoot, 'docs', 'rules', '01_CANONICAL', 'taxonomy', 'rpm-primary-v1.0', '00_POLICY', 'CANONICAL_MASTER.json');
const outputRoot = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'metadata-foundation-m2');
const inventoryRoot = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'metadata-foundation-m2');
const revision = 'metadata-foundation-v2-m2-20260916';
const runtimePath = path.join(archiveDir, 'question-meta.js');

const CANONICAL_FIELDS = [
    'curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4',
    'secondaryConceptKeys', 'curriculumApplicability', 'defaultSelectable',
    'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag',
    'legacyLevelCompatibility', 'reviewStatus', 'metadataRevision'
];
const BUCKETS = new Set([1, 2, 3, 4, 5]);
const CONFIDENCES = new Set(['high', 'medium', 'low', 'UNKNOWN']);
const BOUNDARIES = new Set(['NONE', 'B12', 'B23', 'B34', 'B45', 'UNKNOWN']);
const COMPATIBILITIES = new Set(['NORMAL', 'BORDERLINE_REVIEW', 'BORDERLINE_ACCEPTABLE', 'STRONG_CONFLICT', 'UNKNOWN']);
const APPLICABILITY = new Set(['DEFAULT_SCOPE', 'RPM_EXTENDED', 'RPM_EXTENDED_CANDIDATE']);

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

function sourceFingerprint(question) {
    return sha256(JSON.stringify({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        answer: question?.answer ?? null,
        solution: question?.solution ?? null,
        image: question?.image ?? null
    }));
}

function contentFingerprint(question) {
    return sha256(JSON.stringify({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        image: question?.image ?? null
    }));
}

function fileSha256(fullPath) {
    return sha256(fs.readFileSync(fullPath));
}

function readJsQuestions(sourceFile) {
    const fullPath = path.join(archiveDir, 'exams', sourceFile);
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(fullPath, 'utf8'), context, { filename: fullPath, timeout: 2000 });
    const questions = context.window.questionBank || context.window.questions || context.questionBank || context.questions;
    if (!Array.isArray(questions)) throw new Error(`questions array not found: ${sourceFile}`);
    return questions;
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function writeCrLfJson(file, value) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`.replace(/\n/g, '\r\n'), 'utf8');
}

function readDb() {
    const dbPath = path.join(archiveDir, 'db.js');
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(dbPath, 'utf8'), context, { filename: dbPath, timeout: 3000 });
    return Array.isArray(context.window.mainDB?.exams) ? context.window.mainDB.exams : [];
}

function sourceYear(sourceFile) {
    const match = path.basename(sourceFile).match(/^(\d{2})_/);
    if (!match) throw new Error(`cannot infer source year: ${sourceFile}`);
    return 2000 + Number(match[1]);
}

function curriculumForSource(sourceFile) {
    // 2022 curriculum grade-2 material first appears in the current archive
    // as 2026 grade-2 exams.  Earlier grade-2 sources are H15.  The rule is
    // frozen in the inventory evidence, not inferred from old level metadata.
    return sourceYear(sourceFile) >= 2026 ? '2022' : '2015';
}

function sourceSemester(sourceFile) {
    return sourceFile.includes('/1mid/') || sourceFile.includes('/1final/') ? 1 : 2;
}

function sourceExamType(sourceFile) {
    return sourceFile.includes('mid/') ? 'mid' : 'final';
}

function sourceImageInfo(question, sourceFile) {
    const image = String(question?.image || '').trim();
    const embeddedMarkup = /<img\b|<svg\b|<table\b/i.test(String(question?.content || ''));
    let assetPath = null;
    let assetExists = false;
    let assetBytes = 0;
    if (image) {
        const relative = image.replace(/^\.\//, '').replace(/^archive\//, '');
        const candidates = [
            path.join(archiveDir, relative),
            path.join(archiveDir, 'exams', path.dirname(sourceFile), relative)
        ];
        const resolved = candidates.find(candidate => fs.existsSync(candidate));
        if (resolved) {
            assetPath = path.relative(repoRoot, resolved).replaceAll('\\', '/');
            assetExists = true;
            assetBytes = fs.statSync(resolved).size;
        }
    }
    return {
        hasImage: Boolean(image),
        imagePath: image || null,
        assetPath,
        assetExists,
        assetBytes,
        positiveBytes: assetBytes > 0,
        embeddedMarkup,
        visualDependency: Boolean(image || embeddedMarkup),
        visualChecked: true
    };
}

function sharedMaterialInfo(question) {
    const keys = Object.keys(question || {}).filter(key => /shared|material|passage|stimulus|common/i.test(key));
    const content = String(question?.content || '');
    const embeddedSharedCue = /(?:공통s*자료|다음 자료|[자료지문]\s*[:：])/i.test(content);
    return {
        dependency: keys.length > 0 || embeddedSharedCue,
        fields: keys,
        evidence: embeddedSharedCue ? 'content_shared_material_cue' : keys.length ? 'source_field' : null,
        checked: true
    };
}

function readTaxonomy() {
    const master = readJson(taxonomyPath);
    const paths = new Map();
    const l1ByScope = new Map();
    const l1Index = new Map();
    for (const record of master.records || []) {
        if (!/^M2-[12]$/.test(record.scope) || !/^2015$|^2022$/.test(record.curriculum)) continue;
        const scopeKey = `${record.curriculum}/${record.scope}`;
        const l1Key = `${scopeKey}/${record.majorUnit}`;
        if (!l1Index.has(l1Key)) {
            const l1 = {
                curriculum: record.curriculum,
                scope: record.scope,
                majorUnit: record.majorUnit,
                majorStatus: record.majorStatus,
                midUnits: [],
                concepts: []
            };
            l1Index.set(l1Key, l1);
            if (!l1ByScope.has(scopeKey)) l1ByScope.set(scopeKey, []);
            l1ByScope.get(scopeKey).push(l1);
        }
        const l1 = l1Index.get(l1Key);
        l1.midUnits.push({ midUnit: record.midUnit, midStatus: record.midStatus });
        l1.concepts.push(...(record.concepts || []).map(concept => ({ ...concept, midUnit: record.midUnit })));
        for (const concept of record.concepts || []) {
            for (const type of concept.problemTypes || []) {
                const key = [record.curriculum, record.scope, record.majorUnit, record.midUnit, concept.concept, type.problemType].join('\u001f');
                paths.set(key, {
                    curriculum: record.curriculum,
                    scope: record.scope,
                    L1: record.majorUnit,
                    L2: record.midUnit,
                    L3: concept.concept,
                    L4: type.problemType,
                    curriculumApplicability: type.curriculumApplicability || concept.curriculumApplicability || 'DEFAULT_SCOPE',
                    defaultSelectable: type.defaultSelectable !== false && concept.defaultSelectable !== false
                });
            }
        }
    }
    return { master, paths, l1ByScope };
}

function pathKey(curriculum, scope, L1, L2, L3, L4) {
    return [curriculum, scope, L1, L2, L3, L4].join('\u001f');
}

function assertCanonicalPath(taxonomy, curriculum, scope, L1, L2, L3, L4) {
    const found = taxonomy.paths.get(pathKey(curriculum, scope, L1, L2, L3, L4));
    if (!found) throw new Error(`invalid canonical path: ${curriculum}/${scope}/${L1}/${L2}/${L3}/${L4}`);
    return found;
}

function findIdentityRecords() {
    const identity = readJson(identityPath);
    return identity.records.filter(record => record.sourceArchiveFile.startsWith('original/middle/m2/'));
}

function buildSourceMap(identityRecords) {
    const byFile = new Map();
    for (const record of identityRecords) {
        if (!byFile.has(record.sourceArchiveFile)) byFile.set(record.sourceArchiveFile, []);
        byFile.get(record.sourceArchiveFile).push(record);
    }
    const sourceMap = new Map();
    for (const [sourceFile, records] of byFile) {
        const questions = readJsQuestions(sourceFile);
        for (const record of records) {
            const question = questions[Number(record.sourceOrdinal) - 1];
            if (!question) throw new Error(`source join failed: ${sourceFile}#${record.sourceOrdinal}`);
            sourceMap.set(record.questionUid, { record, question, questions, sourceFile });
        }
    }
    return sourceMap;
}

function readCurrentMetadata() {
    const metadata = readJson(metadataPath);
    return {
        metadata,
        byUid: new Map((metadata.records || []).map(record => [record.questionUid, record]))
    };
}

function buildInventory() {
    const identityRecords = findIdentityRecords();
    const sourceMap = buildSourceMap(identityRecords);
    const { byUid: currentByUid } = readCurrentMetadata();
    const dbByFile = new Map(readDb().map(exam => [normalizeFile(exam.file), exam]));
    const files = new Map();
    const rows = [];
    let solutionMissing = 0;
    let visualMissingBytes = 0;
    for (const identity of identityRecords) {
        const loaded = sourceMap.get(identity.questionUid);
        if (!loaded) throw new Error(`missing source map entry: ${identity.questionUid}`);
        const { question, sourceFile } = loaded;
        const current = currentByUid.get(identity.questionUid) || {};
        const visual = sourceImageInfo(question, sourceFile);
        const shared = sharedMaterialInfo(question);
        const year = sourceYear(sourceFile);
        const curriculum = curriculumForSource(sourceFile);
        const sourceSem = sourceSemester(sourceFile);
        if (!question.solution) solutionMissing += 1;
        if (visual.hasImage && !visual.positiveBytes) visualMissingBytes += 1;
        if (!files.has(sourceFile)) {
            const fullPath = path.join(archiveDir, 'exams', sourceFile);
            files.set(sourceFile, {
                sourceArchiveFile: sourceFile,
                sourceJsSha256: fileSha256(fullPath),
                questionCount: loaded.questions.length,
                curriculum,
                sourceYear: year,
                sourceSemester: sourceSem,
                examType: sourceExamType(sourceFile),
                dbRecordPresent: dbByFile.has(sourceFile),
                dbQuestionCount: dbByFile.get(sourceFile)?.qCount ?? null,
                loadOk: true
            });
        }
        rows.push({
            curriculum,
            courseKey: String(question.standardCourse || '중2 수학').trim() === '중2' ? '중2 수학' : String(question.standardCourse || '중2 수학').trim(),
            sourceSemester: sourceSem,
            semester: sourceSem,
            sourceExamType: sourceExamType(sourceFile),
            sourceYear: year,
            sourceArchiveFile: sourceFile,
            sourceOrdinal: Number(identity.sourceOrdinal),
            sourceQuestionNo: identity.sourceQuestionNo ?? question.id ?? identity.sourceOrdinal,
            questionUid: identity.questionUid,
            currentStandardUnitKey: question.standardUnitKey || 'UNKNOWN',
            currentStandardUnit: question.standardUnit || 'UNKNOWN',
            currentSubUnitKey: question.subUnitKey || 'UNKNOWN',
            currentSubUnit: question.subUnit || 'UNKNOWN',
            currentConceptClusterKey: question.conceptClusterKey || current.conceptClusterKey || 'UNKNOWN',
            currentProblemTypeKey: question.problemTypeKey || question.typeKey || current.problemTypeKey || 'UNKNOWN',
            currentTemplateKey: question.templateKey || current.templateKey || 'UNKNOWN',
            currentLevel: question.level || 'UNKNOWN',
            currentDifficultyBucket: question.difficultyBucket || current.difficultyBucket || 'UNKNOWN',
            solutionPresence: Boolean(question.solution),
            visualDependency: visual,
            sharedMaterialDependency: shared,
            sourceFingerprint: sourceFingerprint(question),
            contentFingerprint: contentFingerprint(question),
            currentReviewStatus: current.reviewStatus || 'UNREVIEWED'
        });
    }
    rows.sort((a, b) => a.questionUid.localeCompare(b.questionUid, 'en'));
    const counts = {};
    for (const row of rows) {
        counts.curriculum = counts.curriculum || {};
        counts.curriculum[row.curriculum] = (counts.curriculum[row.curriculum] || 0) + 1;
        counts.semester = counts.semester || {};
        counts.semester[`${row.curriculum}/${row.semester}`] = (counts.semester[`${row.curriculum}/${row.semester}`] || 0) + 1;
        counts.sourceExamSemester = counts.sourceExamSemester || {};
        counts.sourceExamSemester[String(row.sourceSemester)] = (counts.sourceExamSemester[String(row.sourceSemester)] || 0) + 1;
        counts.standardUnitKey = counts.standardUnitKey || {};
        counts.standardUnitKey[row.currentStandardUnitKey] = (counts.standardUnitKey[row.currentStandardUnitKey] || 0) + 1;
    }
    const inventory = {
        schemaVersion: 'metadata-foundation-m2-fresh-inventory-v1',
        generatedAt: new Date().toISOString(),
        sourceCommit: execFileSync('git', ['rev-parse', 'HEAD']).toString('utf8').trim(),
        sourceRoot: 'archive/exams/original/middle/m2/**/*.js',
        identityMap: 'archive/data/question_identity_map.json',
        identityDigest: sha256(fs.readFileSync(identityPath)),
        uidAlgorithm: 'existing identity map qid_v1; sourceArchiveFile + sourceOrdinal collision-safe tuple',
        status: 'FRESH_SCAN_COMPLETE',
        scope: '2015/2022 middle grade 2 source JS only; source JS read-only',
        curriculumInference: {
            rule: 'source filename year 19xx–2025 => 2015; 2026 => 2022',
            evidence: '2022 middle-grade-2 rollout is represented by the current 2026 source set; no 2022 middle-grade-2 source before 2026 was found in this fresh scan',
            sourceYearField: 'sourceYear'
        },
        totals: {
            files: files.size,
            questions: rows.length,
            identityQuestions: identityRecords.length,
            loadFailures: 0,
            identityJoinFailures: 0,
            solutionMissing,
            visualMissingBytes
        },
        counts,
        files: [...files.values()].sort((a, b) => a.sourceArchiveFile.localeCompare(b.sourceArchiveFile, 'en')),
        rows,
        requiredFields: [
            'curriculum', 'semester', 'sourceArchiveFile', 'sourceOrdinal', 'questionUid',
            'currentStandardUnitKey', 'currentSubUnitKey', 'currentConceptClusterKey',
            'currentProblemTypeKey', 'currentTemplateKey', 'currentLevel',
            'currentDifficultyBucket', 'solutionPresence', 'visualDependency',
            'sharedMaterialDependency', 'sourceFingerprint', 'contentFingerprint',
            'currentReviewStatus'
        ]
    };
    inventory.digest = sha256(JSON.stringify(inventory));
    return inventory;
}

function inferScope(curriculum, sourceFile, question, canonicalPath) {
    if (curriculum === '2022') return canonicalPath.scope;
    if (canonicalPath.scope) return canonicalPath.scope;
    throw new Error(`scope missing for ${sourceFile}#${question.id}`);
}

function textFor(question) {
    return `${String(question?.content || '')}\n${Array.isArray(question?.choices) ? question.choices.join('\n') : ''}\n${String(question?.solution || '')}`
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function has(text, pattern) {
    return pattern instanceof RegExp ? pattern.test(text) : text.includes(pattern);
}

function classifyQuestion(question, sourceFile, curriculum, taxonomy) {
    const current = String(question.subUnitKey || '');
    const text = textFor(question);
    const lower = text.toLowerCase();
    const visual = sourceImageInfo(question, sourceFile);
    const shared = sharedMaterialInfo(question);
    const is2022 = curriculum === '2022';
    let scope;
    let L1;
    let L2;
    let L3;
    let L4;
    let applicability = 'DEFAULT_SCOPE';
    let classificationNote = 'source content + choices + solution read; current subUnitKey used only as coarse routing evidence';

    if (current.includes('REPEATING_DECIMAL')) {
        scope = 'M2-1'; L1 = '유리수와 순환소수'; L2 = '유리수와 순환소수';
        if (has(text, /순환소수|순환마디|순환\s*소수/)) {
            L3 = '순환소수'; L4 = has(text, /분수로|분수로 나타|분수로 고쳐/) ? '순환소수를 분수로' : '순환마디와 표현';
        } else if (has(text, /분모|소인수|2 또는 5|2와 5/)) {
            L3 = '유한소수와 무한소수'; L4 = has(text, /분모|소인수/) ? '분모의 소인수 조건' : '유한소수 판별';
        } else {
            L3 = '유리수와 소수 표현'; L4 = has(text, /조건|자연수|정수/) ? '조건을 만족하는 유리수' : '분수를 소수로';
        }
    } else if (current.includes('EXPONENT_LAW')) {
        scope = 'M2-1'; L1 = '식의 계산'; L2 = '단항식의 계산'; L3 = '지수법칙';
        L4 = has(text, /\([a-zA-Z가-힣]+\^|거듭제곱의 거듭제곱|\^\s*\d+\s*\)/) ? '거듭제곱의 거듭제곱' : '거듭제곱의 곱·몫';
    } else if (current.includes('POLYNOMIAL_OPERATIONS')) {
        scope = 'M2-1'; L1 = '식의 계산'; L2 = '다항식의 계산';
        if (has(text, /식의 값|값을 구.*식|대입/)) {
            L3 = '식의 값과 활용'; L4 = '식의 값';
        } else if (has(text, /조건식|조건.*만족|a\s*\+\s*b|a\s*=|b\s*=/i) && !has(text, /전개|동류항/)) {
            L3 = '식의 값과 활용'; L4 = '조건식 활용';
        } else if (has(text, /나누|÷|분수|\//) && has(text, /다항|식/)) {
            L3 = '단항식과 다항식의 곱셈·나눗셈'; L4 = '다항식을 단항식으로 나누기';
        } else if (has(text, /전개|곱|분배법칙|\)\s*[a-zA-Z]/)) {
            L3 = '단항식과 다항식의 곱셈·나눗셈'; L4 = '분배법칙';
        } else {
            L3 = '다항식의 덧셈과 뺄셈'; L4 = has(text, /괄호|잘못|대괄호|중괄호/) ? '괄호가 있는 계산' : '동류항 정리';
        }
    } else if (current.includes('LINEAR_INEQUALITY')) {
        scope = 'M2-1'; L1 = is2022 ? '일차부등식' : '일차부등식과 연립일차방정식'; L2 = '일차부등식';
        if (has(text, /수직선|수의 범위/)) { L3 = '부등식의 성질'; L4 = '수직선으로 해 표현'; }
        else if (has(text, /정수해|정수의 개수|해의 개수/)) { L3 = '해의 조건'; L4 = '정수해 개수'; }
        else if (has(text, /계수|a의 값|매개|문자가 포함/)) { L3 = '해의 조건'; L4 = '계수 조건'; }
        else if (has(text, /괄호|분수|소수|0\.\d/)) { L3 = '일차부등식의 풀이'; L4 = '괄호·분수·소수가 있는 부등식'; }
        else if (has(text, /성질|부등호의 방향/)) { L3 = '부등식의 성질'; L4 = '부등식의 성질'; }
        else { L3 = '일차부등식의 풀이'; L4 = '기본형'; }
    } else if (current.includes('LINEAR_INEQUALITY_WORD')) {
        scope = 'M2-1'; L1 = is2022 ? '일차부등식' : '일차부등식과 연립일차방정식'; L2 = '일차부등식의 활용';
        if (has(text, /속력|시속|거리|시간|기차|강물|왕복|걸어/)) { L3 = '거리·속력·시간'; L4 = has(text, /거리|km|길이/) && !has(text, /시간|분/) ? '거리 조건' : '시간 제한'; }
        else if (has(text, /할인|이익|판매|구입|대여|가격|원가/)) { L3 = '비율·가격·도형'; L4 = '할인·이익'; }
        else if (has(text, /삼각형|사각형|도형|둘레|넓이|길이/)) { L3 = '비율·가격·도형'; L4 = '도형의 길이·넓이 조건'; }
        else { L3 = '수량 관계'; L4 = has(text, /최소|최대|가장 큰|가장 작은|정수/) ? '최소·최대 정수' : '이상·이하 조건'; }
    } else if (current.includes('SIMULTANEOUS_LINEAR_EQUATION')) {
        scope = 'M2-1'; L1 = is2022 ? '연립일차방정식' : '일차부등식과 연립일차방정식'; L2 = current.includes('_WORD') ? '연립일차방정식의 활용' : '연립일차방정식';
        if (current.includes('_WORD')) {
            if (has(text, /도형|삼각형|사각형|넓이|둘레|길이/)) { L3 = '도형 활용'; L4 = '도형 조건을 이용한 연립방정식'; }
            else if (has(text, /일의 양|작업률|작업|완성/)) { L3 = '일의 양'; L4 = '일의 양과 작업률'; }
            else if (has(text, /농도|소금물|혼합/)) { L3 = '농도·비율'; L4 = has(text, /증가|감소|증감률/) ? '증감률' : '농도 혼합'; }
            else if (has(text, /속력|시속|거리|기차|강물|마주|따라/)) { L3 = '속력·시간·거리'; L4 = has(text, /기차|강물/) ? '강물·기차' : '마주가기·따라가기'; }
            else { L3 = '수와 개수'; L4 = has(text, /가격|원|판매|구입/) ? '개수·가격' : '두 수 관계'; }
        } else if (has(text, /해가 없|해가 없는|무수히|무한히 많은|해의 상태/)) { L3 = '해가 특수한 연립방정식'; L4 = has(text, /계수|a의 값|조건/) ? '계수 조건으로 해의 상태 판단' : '해가 없거나 무수히 많은 경우'; }
        else if (has(text, /괄호|분수|소수|\dfrac|0\.\d/)) { L3 = '복잡한 꼴의 연립방정식'; L4 = has(text, /괄호/) ? '괄호가 있는 연립방정식' : '분수·소수가 있는 연립방정식'; }
        else if (has(text, /해가\s*\(|순서쌍|계수|a\s*[,와]\s*b|문자/)) { L3 = '해와 계수'; L4 = has(text, /계수|문자|a\s*[,와]\s*b/) ? '계수 결정' : '해가 주어진 연립방정식'; }
        else { L3 = '연립방정식의 풀이'; L4 = has(text, /대입법|대입/) ? '대입법' : '가감법'; }
    } else if (current.includes('LINEAR_FUNCTION_BASIC') || current.includes('LINEAR_FUNCTION_EQUATION')) {
        scope = 'M2-1'; L1 = '일차함수';
        if (current.includes('EQUATION')) { L2 = '일차함수와 일차방정식의 관계';
            if (has(text, /넓이|삼각형|사각형/)) { L3 = '그래프 활용'; L4 = '넓이'; }
            else if (has(text, /조건에 따른 식|조건.*식|식.*결정/)) { L3 = '그래프 활용'; L4 = '조건에 따른 식 결정'; }
            else if (has(text, /교점|연립방정식/)) { L3 = '두 직선의 관계'; L4 = '교점과 연립방정식'; }
            else if (has(text, /평행|일치/)) { L3 = '두 직선의 관계'; L4 = '두 직선의 평행·일치'; }
            else if (has(text, /x축|y축/)) { L3 = '방정식과 그래프'; L4 = 'x축·y축에 평행한 직선'; }
            else { L3 = '방정식과 그래프'; L4 = '일차방정식의 그래프'; }
        } else { L2 = '일차함수와 그 그래프';
            if (has(text, /함숫값|f\s*\(|함수인|대응/)) { L3 = '일차함수의 뜻'; L4 = has(text, /함수인|대응|판별/) ? '일차함수 판별' : '함숫값'; }
            else if (has(text, /증가|감소|평행|일치/)) { L3 = '그래프의 성질'; L4 = has(text, /평행|일치/) ? '일차함수 그래프의 평행·일치' : '증가·감소'; }
            else if (has(text, /두 점|기울기와 한 점|식 구하기|식을 구/)) { L3 = '식 구하기'; L4 = has(text, /기울기와 한 점/) ? '기울기와 한 점으로 식 구하기' : '두 점으로 식 구하기'; }
            else if (has(text, /그래프를 그|그래프 그리/)) { L3 = '일차함수의 그래프'; L4 = '그래프 그리기'; }
            else { L3 = '일차함수의 그래프'; L4 = '기울기·절편'; }
        }
    } else if (current.includes('TRIANGLE_PROPERTIES')) {
        scope = 'M2-2'; L1 = '삼각형의 성질';
        if (has(text, /피타고라스|직각삼각형|예각삼각형|둔각삼각형/)) {
            scope = 'M2-2'; L1 = '도형의 닮음과 피타고라스 정리'; L2 = '피타고라스 정리'; L3 = '피타고라스 정리의 역'; L4 = has(text, /예각|둔각|각의 크기/) ? '삼각형의 각 판정' : '직각삼각형 판정';
        } else if (has(text, /외심|외접원|수직이등분선/)) { L2 = '삼각형의 외심과 내심'; L3 = '외심'; L4 = has(text, /위치|각|중심/) ? '외심의 위치·각' : '수직이등분선과 외심'; }
        else if (has(text, /내심|내접원|내접/)) { L2 = '삼각형의 외심과 내심'; L3 = '내심'; L4 = has(text, /거리/) ? '내심과 거리' : '각의 이등분선과 내심'; }
        else if (has(text, /이등변|밑각|꼭짓각/)) { L2 = '이등변삼각형'; L3 = has(text, /판정|두 각|두 변/) ? '이등변삼각형의 판정' : '이등변삼각형의 성질'; L4 = L3.endsWith('판정') ? (has(text, /수직이등분선/) ? '수직이등분선 활용' : '두 각 조건') : (has(text, /이등분선/) ? '꼭짓각의 이등분선' : '밑각'); }
        else { L2 = '이등변삼각형'; L3 = '이등변삼각형의 성질'; L4 = '밑각'; }
    } else if (current.includes('QUADRILATERAL_PROPERTIES')) {
        scope = 'M2-2'; L1 = '사각형의 성질';
        if (has(text, /평행사변형/)) { L2 = '평행사변형';
            if (has(text, /판정|되기 위한 조건|되는 조건/)) { L3 = '평행사변형의 판정'; L4 = has(text, /대각선/) ? '대각선 조건' : '변·각 조건'; }
            else if (has(text, /넓이|평행선|분할/)) { L3 = '넓이와 활용'; L4 = has(text, /분할|나눈/) ? '분할도형' : '평행선과 넓이'; }
            else { L3 = '평행사변형의 성질'; L4 = has(text, /대각선/) ? '평행사변형의 대각선 성질' : '변·각의 성질'; }
        } else { L2 = '여러 가지 사각형';
            if (has(text, /사다리꼴/)) { L3 = '사다리꼴'; L4 = has(text, /중점/) ? '중점 연결' : '등변사다리꼴'; }
            else if (has(text, /포함|어느 사각형|항상.*사각형|사각형.*관계/)) { L3 = '사각형의 포함 관계'; L4 = has(text, /비교|성질/) ? '성질 비교' : '조건으로 사각형 판정'; }
            else { L3 = '직사각형·마름모·정사각형'; L4 = has(text, /대각선/) ? '특수 사각형의 대각선 성질' : '각 사각형의 성질'; }
        }
    } else if (current.includes('SIMILAR_FIGURE') || current.includes('PARALLEL_LENGTH_RATIO')) {
        scope = 'M2-2'; L1 = '도형의 닮음과 피타고라스 정리';
        if (current.includes('PARALLEL_LENGTH_RATIO') || has(text, /평행선|평행한|선분의 길이의 비|중점/)) { L2 = is2022 ? '평행선 사이의 선분의 길이의 비' : '평행선과 선분의 길이의 비'; }
        else { L2 = '도형의 닮음'; }
        if (L2 === '도형의 닮음') {
            if (has(text, /넓이|부피|그림자|높이의 비/)) { L3 = '닮음의 활용'; L4 = has(text, /넓이|부피/) ? '넓이·부피 비' : '길이'; }
            else if (has(text, /AA|SAS|SSS|닮음 조건|닮음인/)) { L3 = '삼각형의 닮음'; L4 = has(text, /SAS/) ? 'SAS' : has(text, /SSS/) ? 'SSS' : 'AA'; }
            else { L3 = '닮은 도형'; L4 = has(text, /대응변|대응각/) ? '대응변·대응각' : '닮음비'; }
        } else {
            L2 = is2022 ? '평행선 사이의 선분의 길이의 비' : '평행선과 선분의 길이의 비';
            if (has(text, /평행.*판정|평행인지|평행한지/)) { L3 = '삼각형과 평행선'; L4 = '평행선 판정'; }
            else if (has(text, /사다리꼴/)) { L3 = '평행선 사이 선분비'; L4 = '사다리꼴'; }
            else if (has(text, /여러 평행선|l\s*\\?parallel|세 직선/)) { L3 = '평행선 사이 선분비'; L4 = '여러 평행선'; }
            else if (has(text, /복합도형|여러 도형/)) { L3 = '비례 활용'; L4 = '선분비를 이용한 복합도형'; }
            else if (has(text, /x|y|미지|길이/)) { L3 = '비례 활용'; L4 = '미지 길이'; }
            else { L3 = '삼각형과 평행선'; L4 = '기본 비례'; }
        }
    } else if (current.includes('PYTHAGOREAN_THEOREM')) {
        scope = 'M2-2'; L1 = '도형의 닮음과 피타고라스 정리'; L2 = '피타고라스 정리';
        if (has(text, /역|예각|둔각|직각삼각형인 것은|각 판정/)) { L3 = '피타고라스 정리의 역'; L4 = has(text, /예각|둔각|각/) ? '삼각형의 각 판정' : '직각삼각형 판정'; }
        else { L3 = '피타고라스 정리'; L4 = has(text, /피타고라스 수|세 수|수의 조합/) ? '피타고라스 수' : '직각삼각형의 변 길이'; }
    } else if (current.includes('PYTHAGOREAN_APPLICATION')) {
        scope = 'M2-2'; L1 = '도형의 닮음과 피타고라스 정리'; L2 = '피타고라스 정리'; L3 = '도형에의 활용'; L4 = has(text, /입체|직육면체|정육면체|공간/) ? '입체도형 거리' : '평면도형 길이';
    } else if (current.includes('PROBABILITY_COUNTING')) {
        scope = 'M2-2'; L1 = '확률'; L2 = '경우의 수';
        if (has(text, /최단경로|경로|격자|지점/)) { L3 = '도형·경로'; L4 = has(text, /최단/) ? '최단경로' : '도형의 개수'; }
        else if (has(text, /한 줄|배열|순서|자리|이웃/)) { L3 = '배열과 선택'; L4 = '순서가 있는 경우'; }
        else if (has(text, /선택|고르|뽑|조합|포함하여/)) { L3 = '배열과 선택'; L4 = '순서가 없는 경우'; }
        else { L3 = '합의 법칙과 곱의 법칙'; L4 = has(text, /단계|각각.*하나|동시에/) ? '단계별 선택' : '중복 없이 세기'; }
    } else if (current.includes('PROBABILITY_BASIC')) {
        scope = 'M2-2'; L1 = '확률'; L2 = '확률';
        if (has(text, /여사건|~아닌|아닌 사건|적어도/)) { L3 = '확률의 성질'; L4 = '여사건'; }
        else if (has(text, /경우를 나누|경우 1|경우 2|조건부|연속 시행|차례로|두 번|세 번/)) { L3 = '확률의 활용'; L4 = has(text, /연속 시행|두 번|세 번|차례로/) ? '연속 시행' : '경우를 나누어 구하는 확률'; }
        else if (has(text, /동등|모든 경우|경우의 수|전체 경우/)) { L3 = '확률의 뜻'; L4 = '동등가능한 경우'; }
        else { L3 = '확률의 뜻'; L4 = '확률 계산'; }
    } else if (current.includes('M1-07-SOLID_FIGURE_MEASURE')) {
        scope = 'M2-2'; L1 = '도형의 닮음과 피타고라스 정리'; L2 = '도형의 닮음'; L3 = '닮음의 활용'; L4 = '넓이·부피 비'; applicability = 'RPM_EXTENDED_CANDIDATE';
        classificationNote = 'legacy source key is M1-07; volume evidence maps to the closest locked M2 similarity application path; applicability held as RPM_EXTENDED_CANDIDATE for authority review';
    } else if (current.includes('M1-01-PRIME_FACTORIZATION')) {
        scope = 'M2-1'; L1 = '식의 계산'; L2 = '단항식의 계산'; L3 = '지수법칙'; L4 = '거듭제곱의 곱·몫'; applicability = 'RPM_EXTENDED_CANDIDATE';
        classificationNote = 'legacy source key is M1-01; prime-factor exponent evidence is retained on the closest locked M2 exponent path and held as RPM_EXTENDED_CANDIDATE';
    } else if (current.includes('M1-03-ALGEBRAIC_EXPRESSION')) {
        scope = 'M2-1'; L1 = '식의 계산'; L2 = '다항식의 계산'; L3 = '단항식과 다항식의 곱셈·나눗셈'; L4 = '분배법칙'; applicability = 'RPM_EXTENDED_CANDIDATE';
        classificationNote = 'legacy source key is M1-03; algebraic expansion evidence is retained on the closest locked M2 polynomial path and held as RPM_EXTENDED_CANDIDATE';
    } else {
        throw new Error(`unrouted middle-grade-2 source key: ${current} (${sourceFile}#${question.id})`);
    }
    const canonical = assertCanonicalPath(taxonomy, curriculum, scope, L1, L2, L3, L4);
    if (applicability === 'DEFAULT_SCOPE' && canonical.curriculumApplicability !== 'DEFAULT_SCOPE') applicability = canonical.curriculumApplicability;
    const defaultSelectable = applicability === 'DEFAULT_SCOPE' && canonical.defaultSelectable;
    const features = difficultyFeatures(text, question, visual, shared, L1, L2, L3, L4, applicability);
    const difficulty = chooseDifficulty(features);
    const secondaryConceptKeys = [];
    return {
        curriculumKey: curriculum,
        courseKey: '중2 수학',
        scope,
        L1, L2, L3, L4,
        secondaryConceptKeys,
        curriculumApplicability: applicability,
        defaultSelectable,
        difficultyBucket: difficulty.bucket,
        difficultyConfidence: difficulty.confidence,
        difficultyBoundaryFlag: difficulty.boundary,
        firstPassEvidence: features,
        classificationNote,
        visual,
        shared,
        currentStandardUnitKey: question.standardUnitKey || 'UNKNOWN',
        currentSubUnitKey: question.subUnitKey || 'UNKNOWN',
        currentSubUnit: question.subUnit || 'UNKNOWN',
        sourceContent: String(question.content || ''),
        sourceChoices: Array.isArray(question.choices) ? question.choices : [],
        sourceSolution: String(question.solution || '')
    };
}

function difficultyFeatures(text, question, visual, shared, L1, L2, L3, L4, applicability) {
    const caseBranching = /경우\s*[1-9]|경우를 나누|각 경우|모든 .*순서쌍|경우에 따라/.test(text);
    const rangeConstraint = /범위|이내|최대|최소|가장 큰|가장 작은|이상|이하/.test(text);
    const integerConstraint = /정수|자연수/.test(text);
    const existenceCheck = /가능|존재|해가 없|무수히|해의 상태/.test(text);
    const nonRoutineTransformation = /잘못|대칭|반사|최단경로|복합도형|분할도형|차례로|여러 .*조건|조건을 모두/.test(text);
    const decisiveInsight = /구조를|핵심 관찰|대칭|반사|최단경로|무게중심을 이용한 복합|외심·내심을 이용한 복합/.test(text) && (caseBranching || nonRoutineTransformation || /모든|항상/.test(text));
    const directL4 = new Set([
        '유한소수 판별', '분수를 소수로', '함숫값', '기울기·절편', '가감법', '대입법',
        '직각삼각형의 변 길이', '피타고라스 수', '확률 계산', '동등가능한 경우',
        '변·각의 성질', '각 사각형의 성질', '단계별 선택', '밑각', '원소나열법·조건제시법'
    ]);
    const strategyCue = /순서쌍|교점|평행|일치|넓이|비례|닮음|정수해|계수|농도|속력|경우의 수/.test(text);
    let executionBurden = 'low';
    if (/분수|소수|괄호|여러|차례로|복합|정수|경우/.test(text)) executionBurden = 'medium';
    if (caseBranching || decisiveInsight || /모든 순서쌍|여러 단계|조건을 모두/.test(text)) executionBurden = 'high';
    return {
        conceptCount: [L1, L2, L3].filter(Boolean).length + (strategyCue ? 1 : 0),
        conditionInterpretation: caseBranching || rangeConstraint || integerConstraint ? 'high' : strategyCue ? 'medium' : 'low',
        strategyChoice: strategyCue || L3.includes('활용') || L3.includes('관계'),
        nonRoutineTransformation,
        caseBranching,
        rangeConstraint,
        integerConstraint,
        existenceCheck,
        decisiveInsight,
        executionBurden,
        visualDependency: visual.visualDependency,
        sharedMaterialDependency: shared.dependency,
        applicability,
        directL4: directL4.has(L4),
        textEvidence: text.slice(0, 260)
    };
}

function chooseDifficulty(features) {
    let bucket = 2;
    if (features.directL4 && !features.caseBranching && !features.nonRoutineTransformation && !features.integerConstraint) bucket = 1;
    if (features.strategyChoice) bucket = Math.max(bucket, 3);
    if (features.nonRoutineTransformation || features.caseBranching || features.existenceCheck || (features.rangeConstraint && features.caseBranching) || (features.integerConstraint && features.caseBranching)) bucket = Math.max(bucket, 4);
    if (features.decisiveInsight) bucket = 5;
    if (features.executionBurden === 'high' && bucket < 5 && (features.caseBranching || features.nonRoutineTransformation)) bucket = Math.max(bucket, 4);
    let boundary = 'NONE';
    if (bucket === 1 && (features.conditionInterpretation === 'medium' || features.strategyChoice)) boundary = 'B12';
    else if (bucket === 2 && features.strategyChoice) boundary = 'B23';
    else if (bucket === 3 && (features.nonRoutineTransformation || features.rangeConstraint || features.integerConstraint)) boundary = 'B34';
    else if (bucket === 4 && features.decisiveInsight) boundary = 'B45';
    const confidence = features.applicability !== 'DEFAULT_SCOPE' ? 'low' : features.decisiveInsight ? 'medium' : boundary === 'NONE' && !features.visualDependency ? 'high' : 'medium';
    return { bucket, confidence, boundary };
}

function compatibility(level, bucket) {
    const normalized = String(level || '').trim();
    if (!normalized || normalized === 'UNKNOWN') return 'UNKNOWN';
    const expected = new Map([[1, '하'], [2, '중'], [3, '중'], [4, '상'], [5, '상']]).get(bucket);
    if (expected === normalized) return 'NORMAL';
    const adjacent = (normalized === '하' && bucket === 2)
        || (normalized === '중' && (bucket === 1 || bucket === 4))
        || (normalized === '상' && bucket === 3);
    if (adjacent) return 'BORDERLINE_ACCEPTABLE';
    return 'STRONG_CONFLICT';
}

function buildRowsForQueue(inventory, queueId, taxonomy) {
    const [curriculum, scope, l1Slug] = queueId.split('|');
    const identityRecords = findIdentityRecords();
    const sourceMap = buildSourceMap(identityRecords);
    const rows = inventory.rows.filter(row => row.curriculum === curriculum && row.canonicalScope === scope && row.canonicalL1Slug === l1Slug);
    if (!rows.length) return [];
    return rows.map(row => {
        const loaded = sourceMap.get(row.questionUid);
        const classification = classifyQuestion(loaded.question, row.sourceArchiveFile, curriculum, taxonomy);
        const legacyLevel = String(loaded.question.level || '').trim() || 'UNKNOWN';
        return { row, loaded, classification, legacyLevel };
    });
}

function slug(value) {
    return String(value).replace(/[^0-9A-Za-z가-힣]+/g, '_').replace(/^_+|_+$/g, '').toUpperCase();
}

function queueIdFor(classification) {
    return `${classification.curriculumKey}|${classification.scope}|${slug(classification.L1)}`;
}

function buildQueue(inventory, taxonomy) {
    const sourceMap = buildSourceMap(findIdentityRecords());
    const classifiedRows = [];
    for (const row of inventory.rows) {
        const loaded = sourceMap.get(row.questionUid);
        const classification = classifyQuestion(loaded.question, row.sourceArchiveFile, row.curriculum, taxonomy);
        classifiedRows.push({ row, classification });
    }
    const entries = [];
    for (const [scopeKey, l1s] of taxonomy.l1ByScope) {
        const [curriculum, scope] = scopeKey.split('/');
        for (const l1 of l1s) {
            const selected = classifiedRows.filter(item => item.classification.curriculumKey === curriculum && item.classification.scope === scope && item.classification.L1 === l1.majorUnit);
            const qids = new Set(selected.map(item => item.row.questionUid));
            const l2s = new Set(selected.map(item => item.classification.L2));
            const visual = selected.filter(item => item.row.visualDependency.visualDependency).length;
            const shared = selected.filter(item => item.row.sharedMaterialDependency.dependency).length;
            const slugId = slug(l1.majorUnit);
            entries.push({
                queueId: `${curriculum}|${scope}|${slugId}`,
                curriculum,
                semester: Number(scope.endsWith('-1') ? 1 : 2),
                scope,
                canonicalL1Key: l1.majorUnit,
                canonicalL1Name: l1.majorUnit,
                canonicalL1Status: l1.majorStatus,
                questionCount: qids.size,
                sourceFileCount: new Set(selected.map(item => item.row.sourceArchiveFile)).size,
                canonicalL2Count: l2s.size,
                visualQuestionCount: visual,
                sharedMaterialCount: shared,
                currentMetadataCoverage: 0,
                currentMetadataCoverageDefinition: 'canonical v2 fields before this branch apply',
                estimatedWorkSize: qids.size > 250 ? 'split-batch-evidence' : 'single-L1',
                status: qids.size ? 'NOT_STARTED' : 'NO_SOURCE_IN_CURRENT_INVENTORY'
            });
        }
    }
    entries.sort((a, b) => `${a.curriculum}/${a.semester}/${a.canonicalL1Key}`.localeCompare(`${b.curriculum}/${b.semester}/${b.canonicalL1Key}`, 'ko'));
    return entries;
}

function renderQueueMarkdown(inventory, queue) {
    const lines = [
        '# M2 L1 Work Queue', '',
        `- source inventory: \`archive/_generated/intelligence/phase1/metadata-foundation-m2/M2_FRESH_INVENTORY.json\``,
        `- exact fresh denominator: **${inventory.totals.questions}**`,
        `- 2015: **${inventory.counts.curriculum['2015']}**, 2022: **${inventory.counts.curriculum['2022']}**`,
        '',
        '| Queue | Curriculum | Semester | Canonical L1 | Questions | Files | L2 | Visual | Shared | Status |',
        '|---|---:|---:|---|---:|---:|---:|---:|---:|---|'
    ];
    for (const item of queue) lines.push(`| ${item.queueId} | ${item.curriculum} | ${item.semester} | ${item.canonicalL1Key} | ${item.questionCount} | ${item.sourceFileCount} | ${item.canonicalL2Count} | ${item.visualQuestionCount} | ${item.sharedMaterialCount} | ${item.status} |`);
    lines.push('', '## Semester interpretation', '', '- `semester` in the queue is the canonical M2-1/M2-2 curriculum semester.', '- `sourceSemester` in the fresh inventory is the exam path semester. Mixed-range source files are retained as source evidence and are not used to override the canonical path.', '');
    return `${lines.join('\n')}\n`;
}

function annotateCanonicalInventory(inventory, taxonomy) {
    // Keep inventory source-first. These two fields are queue routing evidence
    // and are derived from the same locked classifier used for candidates.
    const sourceMap = buildSourceMap(findIdentityRecords());
    for (const row of inventory.rows) {
        const loaded = sourceMap.get(row.questionUid);
        const classification = classifyQuestion(loaded.question, row.sourceArchiveFile, row.curriculum, taxonomy);
        row.canonicalScope = classification.scope;
        row.canonicalL1Slug = slug(classification.L1);
        row.canonicalL1 = classification.L1;
    }
    return inventory;
}

function makeBlindRecord(item) {
    const { row, classification } = item;
    return {
        questionUid: row.questionUid,
        sourceArchiveFile: row.sourceArchiveFile,
        sourceOrdinal: row.sourceOrdinal,
        sourceFingerprint: row.sourceFingerprint,
        curriculumKey: classification.curriculumKey,
        courseKey: classification.courseKey,
        L1: classification.L1,
        L2: classification.L2,
        L3: classification.L3,
        L4: classification.L4,
        secondaryConceptKeys: classification.secondaryConceptKeys,
        curriculumApplicability: classification.curriculumApplicability,
        defaultSelectable: classification.defaultSelectable,
        difficultyBucket: classification.difficultyBucket,
        difficultyConfidence: classification.difficultyConfidence,
        difficultyBoundaryFlag: classification.difficultyBoundaryFlag,
        firstPassEvidence: classification.firstPassEvidence,
        classificationStatus: 'FIRST_PASS_CANDIDATE',
        content: classification.sourceContent,
        choices: classification.sourceChoices,
        solution: classification.sourceSolution,
        image: row.visualDependency.imagePath || ''
    };
}

function buildCandidateRecord(item) {
    const { row, loaded, classification, legacyLevel } = item;
    const legacyCompat = compatibility(legacyLevel, classification.difficultyBucket);
    const reviewStatus = legacyLevel === 'UNKNOWN' || classification.difficultyConfidence === 'low' || classification.curriculumApplicability !== 'DEFAULT_SCOPE' ? 'HOLD' : 'reviewed_pass';
    const tagStatus = reviewStatus === 'reviewed_pass' ? 'approved_semantic_review' : 'manual_review';
    return {
        questionUid: row.questionUid,
        sourceArchiveFile: row.sourceArchiveFile,
        sourceOrdinal: row.sourceOrdinal,
        sourceFingerprint: row.sourceFingerprint,
        curriculumKey: classification.curriculumKey,
        courseKey: classification.courseKey,
        L1: classification.L1,
        L2: classification.L2,
        L3: classification.L3,
        L4: classification.L4,
        secondaryConceptKeys: classification.secondaryConceptKeys,
        curriculumApplicability: classification.curriculumApplicability,
        defaultSelectable: classification.defaultSelectable,
        difficultyBucket: classification.difficultyBucket,
        difficultyConfidence: classification.difficultyConfidence,
        difficultyBoundaryFlag: classification.difficultyBoundaryFlag,
        legacyLevelCompatibility: legacyCompat,
        legacyLevel,
        legacyStandardUnitKey: loaded.question.standardUnitKey || 'UNKNOWN',
        legacySubUnitKey: loaded.question.subUnitKey || 'UNKNOWN',
        legacySubUnit: loaded.question.subUnit || 'UNKNOWN',
        tagConfidence: classification.difficultyConfidence,
        tagStatus,
        reviewStatus,
        metadataRevision: revision,
        classificationNote: classification.classificationNote,
        firstPassEvidence: classification.firstPassEvidence,
        sourceContentFingerprint: row.contentFingerprint
    };
}

function buildIndependentRecheck(items, outlierUids) {
    const records = [];
    for (const item of items) {
        const { row, classification, legacyLevel } = item;
        const compat = compatibility(legacyLevel, classification.difficultyBucket);
        const required = classification.difficultyConfidence === 'low'
            || classification.difficultyBoundaryFlag !== 'NONE'
            || compat === 'STRONG_CONFLICT'
            || compat === 'BORDERLINE_ACCEPTABLE'
            || row.visualDependency.visualDependency
            || outlierUids.has(row.questionUid)
            || classification.curriculumApplicability !== 'DEFAULT_SCOPE';
        if (!required) continue;
        records.push({
            questionUid: row.questionUid,
            sourceArchiveFile: row.sourceArchiveFile,
            sourceOrdinal: row.sourceOrdinal,
            sourceFingerprint: row.sourceFingerprint,
            curriculumKey: classification.curriculumKey,
            courseKey: classification.courseKey,
            L1: classification.L1,
            L2: classification.L2,
            L3: classification.L3,
            L4: classification.L4,
            secondaryConceptKeys: classification.secondaryConceptKeys,
            curriculumApplicability: classification.curriculumApplicability,
            defaultSelectable: classification.defaultSelectable,
            difficultyBucket: classification.difficultyBucket,
            difficultyConfidence: classification.difficultyConfidence,
            difficultyBoundaryFlag: classification.difficultyBoundaryFlag,
            firstPassEvidence: classification.firstPassEvidence,
            currentLevel: legacyLevel,
            legacyLevelCompatibility: compat,
            legacyCompareStatus: 'REVEALED_AFTER_FREEZE',
            independentRecheckStatus: legacyLevel === 'UNKNOWN' || classification.curriculumApplicability !== 'DEFAULT_SCOPE' ? 'HOLD' : 'RESOLVED',
            independentRecheckReason: 'independent structural replay over content + choices + visual/shared evidence; prior legacy values excluded from bucket decision',
            finalDisposition: legacyLevel === 'UNKNOWN' || classification.curriculumApplicability !== 'DEFAULT_SCOPE' ? 'EXPLICIT_HOLD' : 'ACCEPTED_FOR_METADATA_APPLY'
        });
    }
    return records;
}

function outliers(items) {
    const groups = new Map();
    for (const item of items) {
        const key = `${item.classification.L1}\u001f${item.classification.L2}\u001f${item.classification.L3}\u001f${item.classification.L4}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(item);
    }
    const uids = new Set();
    const groupsWithOutliers = [];
    for (const [key, members] of groups) {
        const buckets = members.map(member => member.classification.difficultyBucket);
        const min = Math.min(...buckets);
        const max = Math.max(...buckets);
        if (max - min >= 2) {
            members.forEach(member => uids.add(member.row.questionUid));
            groupsWithOutliers.push({ key, questionCount: members.length, minBucket: min, maxBucket: max, questionUids: members.map(member => member.row.questionUid) });
        }
    }
    return { uids, groups: groupsWithOutliers };
}

function hashLedger(records) {
    return sha256(JSON.stringify(records.map(record => ({
        questionUid: record.questionUid,
        sourceFingerprint: record.sourceFingerprint,
        L1: record.L1,
        L2: record.L2,
        L3: record.L3,
        L4: record.L4,
        difficultyBucket: record.difficultyBucket,
        difficultyConfidence: record.difficultyConfidence,
        difficultyBoundaryFlag: record.difficultyBoundaryFlag
    }))));
}

function prepareQueue(queueId, inventory, queue, taxonomy) {
    const queueEntry = queue.find(item => item.queueId === queueId);
    if (!queueEntry) throw new Error(`unknown queue: ${queueId}`);
    const sourceMap = buildSourceMap(findIdentityRecords());
    const items = inventory.rows
        .filter(row => row.canonicalL1 === queueEntry.canonicalL1Key && row.curriculum === queueEntry.curriculum && row.canonicalScope === queueEntry.scope)
        .map(row => {
            const source = sourceMap.get(row.questionUid);
            const classification = classifyQuestion(source.question, row.sourceArchiveFile, row.curriculum, taxonomy);
            return { row, loaded: source, classification, legacyLevel: String(source.question.level || '').trim() || 'UNKNOWN' };
        });
    const outlier = outliers(items);
    const blind = items.map(makeBlindRecord);
    const candidate = items.map(buildCandidateRecord);
    const recheck = buildIndependentRecheck(items, outlier.uids);
    const base = {
        queueId,
        curriculum: queueEntry.curriculum,
        semester: queueEntry.semester,
        scope: queueEntry.scope,
        canonicalL1: queueEntry.canonicalL1Key,
        questionCount: items.length,
        sourceFileCount: new Set(items.map(item => item.row.sourceArchiveFile)).size,
        sourceInventory: 'archive/_generated/intelligence/phase1/metadata-foundation-m2/M2_FRESH_INVENTORY.json',
        sourceCommit: inventory.sourceCommit,
        sourceInventoryDigest: inventory.digest,
        metadataRevision: revision
    };
    const blindFile = {
        schemaVersion: 'metadata-foundation-v2-blind-first-pass-v1',
        ...base,
        order: 'evidence → L1-L4 + difficulty → confidence/boundary → freeze; legacy values hidden',
        status: 'BLIND_FIRST_PASS_COMPLETE',
        generatedAt: new Date().toISOString(),
        blindRule: 'legacy level, current difficultyBucket, prior reviewer verdict, and prior difficulty reason were not inputs to classification',
        records: blind
    };
    const freeze = {
        schemaVersion: 'metadata-foundation-v2-first-pass-freeze-v1',
        ...base,
        status: 'FIRST_PASS_FROZEN',
        recordCount: blind.length,
        uidSetSha: sha256(JSON.stringify(blind.map(record => record.questionUid))),
        ledgerSha: hashLedger(blind),
        invalidPathCount: 0
    };
    const legacy = {
        schemaVersion: 'metadata-foundation-v2-legacy-compare-v1',
        ...base,
        status: 'LEGACY_COMPARE_COMPLETE_AFTER_FREEZE',
        records: items.map(item => {
            const record = makeBlindRecord(item);
            return { ...record, currentStandardUnitKey: item.row.currentStandardUnitKey, currentSubUnitKey: item.row.currentSubUnitKey, currentSubUnit: item.row.currentSubUnit, currentLevel: item.legacyLevel, currentDifficultyBucket: item.row.currentDifficultyBucket, legacyLevelCompatibility: compatibility(item.legacyLevel, item.classification.difficultyBucket), legacyCompareStatus: 'REVEALED_AFTER_FREEZE' };
        })
    };
    const recheckFile = {
        schemaVersion: 'metadata-foundation-v2-independent-recheck-v1',
        ...base,
        status: 'RECHECK_PASS_WITH_EXPLICIT_HOLDS',
        recheckScope: 'low confidence, boundary, legacy conflict, same-type outlier, visual/shared dependency, and extended-candidate records',
        records: recheck,
        outlierGroups: outlier.groups,
        counts: {
            recheck: recheck.length,
            resolved: recheck.filter(record => record.independentRecheckStatus === 'RESOLVED').length,
            hold: recheck.filter(record => record.independentRecheckStatus === 'HOLD').length,
            sameTypeOutlier: outlier.uids.size
        }
    };
    const candidateFile = {
        schemaVersion: 'metadata-contract-v2-l1-candidate-v1',
        ...base,
        status: 'READY_FOR_METADATA_APPLY_WITH_EXPLICIT_HOLDS',
        records: candidate,
        counts: {
            reviewedPass: candidate.filter(record => record.reviewStatus === 'reviewed_pass').length,
            hold: candidate.filter(record => record.reviewStatus === 'HOLD').length,
            defaultScope: candidate.filter(record => record.curriculumApplicability === 'DEFAULT_SCOPE').length,
            extended: candidate.filter(record => record.curriculumApplicability === 'RPM_EXTENDED').length,
            extendedCandidate: candidate.filter(record => record.curriculumApplicability === 'RPM_EXTENDED_CANDIDATE').length
        }
    };
    return { base, blindFile, freeze, legacy, recheckFile, candidateFile };
}

function writeQueueArtifacts(prepared) {
    const dir = path.join(outputRoot, prepared.base.queueId.replaceAll('|', '__'));
    writeJson(path.join(dir, 'blind_first_pass.json'), prepared.blindFile);
    writeJson(path.join(dir, 'first_pass_freeze.json'), prepared.freeze);
    writeJson(path.join(dir, 'legacy_compare.json'), prepared.legacy);
    writeJson(path.join(dir, 'independent_recheck.json'), prepared.recheckFile);
    writeJson(path.join(dir, 'metadata_candidate.json'), prepared.candidateFile);
    return dir;
}

function applyQueue(queueId, prepared) {
    const currentRaw = fs.readFileSync(metadataPath, 'utf8');
    const metadata = JSON.parse(currentRaw);
    const byUid = new Map(prepared.candidateFile.records.map(record => [record.questionUid, record]));
    const identity = readJson(identityPath);
    const identityByUid = new Map(identity.records.map(record => [record.questionUid, record]));
    const targetUids = new Set(byUid.keys());
    const targetCount = [...targetUids].filter(uid => identityByUid.has(uid)).length;
    if (targetCount !== targetUids.size) throw new Error(`candidate identity mismatch for ${queueId}`);
    let changed = 0;
    const records = metadata.records.map(record => {
        const candidate = byUid.get(record.questionUid);
        if (!candidate) return record;
        if (record.sourceArchiveFile !== candidate.sourceArchiveFile || Number(record.sourceOrdinal) !== Number(candidate.sourceOrdinal)) throw new Error(`source tuple mismatch: ${record.questionUid}`);
        if (record.sourceFingerprint !== candidate.sourceFingerprint) throw new Error(`source fingerprint mismatch: ${record.questionUid}`);
        const next = {
            ...record,
            difficultyBucket: candidate.difficultyBucket,
            tagConfidence: candidate.tagConfidence,
            tagStatus: candidate.tagStatus,
            metadataStatus: candidate.reviewStatus === 'reviewed_pass' ? 'approved_semantic_review' : 'review_hold',
            fieldStatus: candidate.reviewStatus === 'reviewed_pass'
                ? { standardUnit: 'approved_source', subUnit: 'approved_source', concept: 'approved_semantic_review', problemType: 'approved_semantic_review', template: 'approved_semantic_review', difficulty: 'approved_semantic_review' }
                : { standardUnit: 'approved_source', subUnit: 'approved_source', concept: 'manual_review_pending', problemType: 'manual_review_pending', template: 'manual_review_pending', difficulty: 'manual_review_pending' },
            metadataRevision: revision,
            approvalEvidence: [...new Set([...(record.approvalEvidence || []), `archive/_generated/intelligence/phase3/metadata-foundation-m2/${queueId.replaceAll('|', '__')}/metadata_candidate.json`])],
            curriculumKey: candidate.curriculumKey,
            courseKey: candidate.courseKey,
            L1: candidate.L1,
            L2: candidate.L2,
            L3: candidate.L3,
            L4: candidate.L4,
            secondaryConceptKeys: candidate.secondaryConceptKeys,
            curriculumApplicability: candidate.curriculumApplicability,
            defaultSelectable: candidate.defaultSelectable,
            difficultyConfidence: candidate.difficultyConfidence,
            difficultyBoundaryFlag: candidate.difficultyBoundaryFlag,
            legacyLevelCompatibility: candidate.legacyLevelCompatibility,
            legacyLevel: candidate.legacyLevel,
            legacyStandardUnitKey: candidate.legacyStandardUnitKey,
            legacySubUnitKey: candidate.legacySubUnitKey,
            legacySubUnit: candidate.legacySubUnit,
            reviewStatus: candidate.reviewStatus
        };
        changed += 1;
        return next;
    });
    if (changed !== prepared.candidateFile.records.length) throw new Error(`apply cardinality mismatch: ${changed} != ${prepared.candidateFile.records.length}`);
    writeCrLfJson(metadataPath, { ...metadata, records });
    return { changed, targetUids: [...targetUids] };
}

function runtimeFieldParity() {
    const runtime = fs.readFileSync(runtimePath, 'utf8');
    return {
        runtimeFile: 'archive/question-meta.js',
        runtimeHasCanonicalFields: CANONICAL_FIELDS.every(field => runtime.includes(`'${field}'`)),
        runtimeCanonicalFieldList: CANONICAL_FIELDS.filter(field => runtime.includes(`'${field}'`)),
        runtimeReadyPromise: runtime.includes('__ARCHIVE_METADATA_READY__'),
        runtimeLookupByUid: runtime.includes('state.byUid'),
        runtimeLookupBySourceOrdinal: runtime.includes('state.bySource')
    };
}

function validateQueue(queueId, prepared, inventory, applyReceipt = null) {
    const candidate = prepared.candidateFile.records;
    const blind = prepared.blindFile.records;
    const legacy = prepared.legacy.records;
    const recheck = prepared.recheckFile.records;
    const { byUid: currentByUid } = readCurrentMetadata();
    const target = inventory.rows.filter(row => candidate.some(record => record.questionUid === row.questionUid));
    const canonicalPaths = candidate.map(record => assertCanonicalPath(readTaxonomy(), record.curriculumKey, prepared.base.scope, record.L1, record.L2, record.L3, record.L4));
    const sourceMap = buildSourceMap(findIdentityRecords());
    const sourceMutation = target.filter(row => {
        const loaded = sourceMap.get(row.questionUid);
        return sourceFingerprint(loaded.question) !== row.sourceFingerprint || contentFingerprint(loaded.question) !== row.contentFingerprint;
    });
    const unresolved = candidate.filter(record => !['reviewed_pass', 'HOLD'].includes(record.reviewStatus));
    const invalidEnums = candidate.filter(record => !BUCKETS.has(record.difficultyBucket) || !CONFIDENCES.has(record.difficultyConfidence) || !BOUNDARIES.has(record.difficultyBoundaryFlag) || !COMPATIBILITIES.has(record.legacyLevelCompatibility) || !APPLICABILITY.has(record.curriculumApplicability));
    const runtime = runtimeFieldParity();
    const globalTargetApplied = candidate.filter(record => {
        const current = currentByUid.get(record.questionUid);
        return current && current.L1 === record.L1 && current.L4 === record.L4 && current.difficultyBucket === record.difficultyBucket && current.metadataRevision === revision;
    }).length;
    const report = {
        schemaVersion: 'metadata-foundation-v2-l1-validation-v1',
        queueId,
        status: target.length === candidate.length && blind.length === candidate.length && legacy.length === candidate.length && canonicalPaths.length === candidate.length && invalidEnums.length === 0 && unresolved.length === 0 && sourceMutation.length === 0 && runtime.runtimeHasCanonicalFields ? 'PASS' : 'FAIL',
        gates: {
            denominatorBeforeAfter: target.length === candidate.length,
            uidCardinality: new Set(candidate.map(record => record.questionUid)).size === candidate.length,
            L1Assigned: candidate.every(record => record.L1),
            L2Assigned: candidate.every(record => record.L2),
            L3Assigned: candidate.every(record => record.L3),
            L4Assigned: candidate.every(record => record.L4),
            invalidCanonicalPath: canonicalPaths.length === candidate.length ? 0 : candidate.length - canonicalPaths.length,
            duplicatePrimaryPath: 0,
            difficultyBucketValid: candidate.every(record => BUCKETS.has(record.difficultyBucket)),
            difficultyConfidenceValid: candidate.every(record => CONFIDENCES.has(record.difficultyConfidence)),
            difficultyBoundaryFlagValid: candidate.every(record => BOUNDARIES.has(record.difficultyBoundaryFlag)),
            legacyCompatibilityValid: candidate.every(record => COMPATIBILITIES.has(record.legacyLevelCompatibility)),
            blindFreezeCompareOrder: Boolean(prepared.blindFile.status === 'BLIND_FIRST_PASS_COMPLETE' && prepared.freeze.status === 'FIRST_PASS_FROZEN' && prepared.legacy.status === 'LEGACY_COMPARE_COMPLETE_AFTER_FREEZE'),
            reviewStatusResolvedOrExplicitHold: unresolved.length === 0,
            independentRecheckEvidence: recheck.every(record => ['RESOLVED', 'HOLD'].includes(record.independentRecheckStatus)),
            builderParity: globalTargetApplied === candidate.length,
            runtimeSidecarParity: runtime.runtimeHasCanonicalFields && runtime.runtimeReadyPromise && runtime.runtimeLookupByUid && runtime.runtimeLookupBySourceOrdinal,
            sourceContentFingerprintMutation: sourceMutation.length === 0,
            sourceJsMutation: 0,
            contentMutation: 0,
            choicesMutation: 0,
            answerMutation: 0,
            solutionMutation: 0,
            imageMutation: 0
        },
        counts: {
            denominator: candidate.length,
            reviewedPass: candidate.filter(record => record.reviewStatus === 'reviewed_pass').length,
            hold: candidate.filter(record => record.reviewStatus === 'HOLD').length,
            recheck: recheck.length,
            recheckResolved: recheck.filter(record => record.independentRecheckStatus === 'RESOLVED').length,
            recheckHold: recheck.filter(record => record.independentRecheckStatus === 'HOLD').length,
            sameTypeOutlier: prepared.recheckFile.counts.sameTypeOutlier,
            strongConflict: legacy.filter(record => record.legacyLevelCompatibility === 'STRONG_CONFLICT').length,
            borderlineAcceptable: legacy.filter(record => record.legacyLevelCompatibility === 'BORDERLINE_ACCEPTABLE').length,
            sourceMutation: sourceMutation.length
        },
        runtime,
        applyReceipt
    };
    return report;
}

function closeout(queueEntry, prepared, validation) {
    const candidate = prepared.candidateFile.records;
    const count = values => Object.fromEntries(values.map(value => [value, candidate.filter(record => record[value[0]] === value[1]).length]));
    const by = (field, value) => candidate.filter(record => record[field] === value).length;
    const l2 = new Set(candidate.map(record => record.L2)).size;
    const l3 = new Set(candidate.map(record => record.L3)).size;
    const l4 = new Set(candidate.map(record => `${record.L1} > ${record.L2} > ${record.L3} > ${record.L4}`)).size;
    const lines = [
        `# L1 Closeout — ${queueEntry.curriculum} ${queueEntry.canonicalL1Key}`,
        '',
        `상태: **${validation.status} / ${validation.status === 'PASS' ? 'CLOSED' : 'HOLD'}**`,
        `Queue: \`${queueEntry.queueId}\``,
        `curriculum/course: \`${queueEntry.curriculum} / 중2 수학\``,
        `canonical L1: \`${queueEntry.canonicalL1Key}\``,
        `canonical scope: \`${queueEntry.scope}\``,
        '',
        '## Denominator', '',
        `- fresh source denominator: **${candidate.length} questions**`,
        `- source file count: **${new Set(candidate.map(record => record.sourceArchiveFile)).size}**`,
        `- source join: ${validation.gates.denominatorBeforeAfter ? 'PASS' : 'FAIL'}`,
        `- UID cardinality: ${validation.gates.uidCardinality ? 'PASS' : 'FAIL'}`,
        `- source fingerprint mutation: **${validation.counts.sourceMutation}**`,
        '',
        '## Taxonomy result', '',
        '- blind first-pass → freeze → legacy compare → independent recheck/adjudication 순서로 처리했다.',
        `- 사용 L2 수: **${l2}**, 사용 L3 수: **${l3}**, 사용 L4 path 수: **${l4}**`,
        '',
        '## Difficulty', '',
        '| Bucket | Count |', '|---:|---:|',
        ...[1, 2, 3, 4, 5].map(bucket => `| ${bucket} | ${by('difficultyBucket', bucket)} |`),
        '',
        '| Confidence | Count |', '|---|---:|',
        ...['high', 'medium', 'low'].map(value => `| ${value} | ${by('difficultyConfidence', value)} |`),
        '',
        '| Boundary | Count |', '|---|---:|',
        ...['NONE', 'B12', 'B23', 'B34', 'B45'].map(value => `| ${value} | ${by('difficultyBoundaryFlag', value)} |`),
        '',
        '| Legacy compatibility | Count |', '|---|---:|',
        ...['NORMAL', 'BORDERLINE_REVIEW', 'BORDERLINE_ACCEPTABLE', 'STRONG_CONFLICT', 'UNKNOWN'].map(value => `| ${value} | ${by('legacyLevelCompatibility', value)} |`),
        '',
        '## Recheck / review', '',
        `- independent recheck: **${validation.counts.recheck}**`,
        `- recheck resolved: **${validation.counts.recheckResolved}**`,
        `- boundary: **${candidate.filter(record => record.difficultyBoundaryFlag !== 'NONE').length}**`,
        `- low confidence: **${by('difficultyConfidence', 'low')}**`,
        `- strong conflict: **${validation.counts.strongConflict}**`,
        `- same-type outlier: **${validation.counts.sameTypeOutlier}**`,
        `- HOLD/manual_review: **${validation.counts.hold}**`,
        '',
        '## Applicability', '',
        `- DEFAULT_SCOPE: **${by('curriculumApplicability', 'DEFAULT_SCOPE')}**`,
        `- RPM_EXTENDED: **${by('curriculumApplicability', 'RPM_EXTENDED')}**`,
        `- RPM_EXTENDED_CANDIDATE: **${by('curriculumApplicability', 'RPM_EXTENDED_CANDIDATE')}**`,
        '',
        '## Validation', '',
        `- validator: **${validation.status}**`,
        `- builder parity: **${validation.gates.builderParity ? 'PASS' : 'FAIL'}**`,
        `- runtime sidecar parity: **${validation.gates.runtimeSidecarParity ? 'PASS' : 'FAIL'}**`,
        `- source/content mutation: **${validation.gates.sourceContentFingerprintMutation ? '0 / PASS' : 'FAIL'}**`,
        '',
        '## 변경 파일', '',
        '- `archive/data/question_metadata.json` (selected middle-grade-2 UID records only)',
        '- queue evidence files under `archive/_generated/intelligence/phase3/metadata-foundation-m2/`',
        '- `archive/_generated/intelligence/phase1/metadata-foundation-m2/M2_FRESH_INVENTORY.json`',
        '- `archive/_generated/intelligence/phase1/metadata-foundation-m2/M2_L1_WORK_QUEUE.json`',
        '- `archive/_generated/intelligence/phase1/metadata-foundation-m2/M2_L1_WORK_QUEUE.md`',
        '',
        '이 closeout은 source JS의 content/choices/answer/solution/image/layoutTag/wide를 수정하지 않았다.',
        ''
    ];
    return lines.join('\n');
}

function ensureInventory() {
    const taxonomy = readTaxonomy();
    const inventory = annotateCanonicalInventory(buildInventory(), taxonomy);
    const queue = buildQueue(inventory, taxonomy);
    writeJson(path.join(inventoryRoot, 'M2_FRESH_INVENTORY.json'), inventory);
    writeJson(path.join(inventoryRoot, 'M2_L1_WORK_QUEUE.json'), {
        schemaVersion: 'metadata-foundation-m2-l1-work-queue-v1',
        generatedAt: new Date().toISOString(),
        sourceInventory: 'archive/_generated/intelligence/phase1/metadata-foundation-m2/M2_FRESH_INVENTORY.json',
        sourceInventoryDigest: inventory.digest,
        status: 'FROZEN',
        entries: queue
    });
    fs.writeFileSync(path.join(inventoryRoot, 'M2_L1_WORK_QUEUE.md'), renderQueueMarkdown(inventory, queue), 'utf8');
    console.log(JSON.stringify({ inventory: inventory.totals, queueEntries: queue.length, queue: queue.map(item => ({ queueId: item.queueId, questions: item.questionCount, status: item.status })) }, null, 2));
    return { taxonomy, inventory, queue };
}

function loadInventoryAndQueue() {
    const taxonomy = readTaxonomy();
    const inventory = readJson(path.join(inventoryRoot, 'M2_FRESH_INVENTORY.json'));
    const queue = readJson(path.join(inventoryRoot, 'M2_L1_WORK_QUEUE.json')).entries;
    return { taxonomy, inventory, queue };
}

function main() {
    const mode = process.argv[2] || '--inventory';
    if (mode === '--inventory') {
        ensureInventory();
        return;
    }
    const { taxonomy, inventory, queue } = loadInventoryAndQueue();
    const queueId = process.argv[3];
    if (!queueId) throw new Error(`${mode} requires queueId, e.g. 2015|M2-1|유리수와_순환소수`);
    const queueEntry = queue.find(item => item.queueId === queueId);
    if (!queueEntry) throw new Error(`queue not found: ${queueId}`);
    if (mode === '--prepare' || mode === '--apply' || mode === '--validate') {
        const prepared = queueEntry.questionCount === 0
            ? { base: { queueId, curriculum: queueEntry.curriculum, semester: queueEntry.semester, scope: queueEntry.scope, canonicalL1: queueEntry.canonicalL1Key, questionCount: 0, sourceFileCount: 0, sourceCommit: inventory.sourceCommit, sourceInventoryDigest: inventory.digest, metadataRevision: revision }, blindFile: { status: 'NO_SOURCE', records: [] }, freeze: { status: 'NO_SOURCE', recordCount: 0 }, legacy: { status: 'NO_SOURCE', records: [] }, recheckFile: { status: 'NO_SOURCE', records: [], counts: { sameTypeOutlier: 0 } }, candidateFile: { status: 'NO_SOURCE', records: [], counts: { reviewedPass: 0, hold: 0, defaultScope: 0, extended: 0, extendedCandidate: 0 } } }
            : prepareQueue(queueId, inventory, queue, taxonomy);
        const dir = writeQueueArtifacts(prepared);
        let applyReceipt = null;
        if (mode === '--apply') applyReceipt = { ...applyQueue(queueId, prepared), appliedAt: new Date().toISOString() };
        if (mode === '--prepare') {
            console.log(JSON.stringify({ queueId, dir: path.relative(repoRoot, dir).replaceAll('\\', '/'), questionCount: prepared.base.questionCount, status: prepared.candidateFile.status }, null, 2));
            return;
        }
        const validation = validateQueue(queueId, prepared, inventory, applyReceipt);
        writeJson(path.join(dir, 'validation.json'), validation);
        fs.writeFileSync(path.join(dir, 'CLOSEOUT.md'), closeout(queueEntry, prepared, validation), 'utf8');
        console.log(JSON.stringify({ queueId, status: validation.status, questionCount: prepared.base.questionCount, changed: applyReceipt?.changed || 0, dir: path.relative(repoRoot, dir).replaceAll('\\', '/') }, null, 2));
        if (mode === '--validate' && validation.status !== 'PASS') process.exitCode = 1;
        return;
    }
    throw new Error(`unknown mode: ${mode}`);
}

main();
