const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const LIMIT = 100;
const REPORT_PATH = path.join(ROOT, 'ARCHIVE_AUDIT_REPORT.md');

function toPosix(value) {
    return String(value || '').replace(/\\/g, '/');
}

function relFromRoot(targetPath) {
    return toPosix(path.relative(ROOT, targetPath));
}

function exists(targetPath) {
    try {
        fs.accessSync(targetPath, fs.constants.F_OK);
        return true;
    } catch (_) {
        return false;
    }
}

function readFileSafe(targetPath, warnings, label) {
    if (!exists(targetPath)) {
        warnings.push(`${label} 없음: \`${relFromRoot(targetPath)}\``);
        return '';
    }
    try {
        return fs.readFileSync(targetPath, 'utf8');
    } catch (error) {
        warnings.push(`${label} 읽기 실패: \`${relFromRoot(targetPath)}\` (${error.message})`);
        return '';
    }
}

function walkFiles(dirPath, predicate = () => true) {
    const results = [];
    if (!exists(dirPath)) return results;
    const stack = [dirPath];
    while (stack.length) {
        const current = stack.pop();
        const entries = fs.readdirSync(current, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) stack.push(fullPath);
            else if (predicate(fullPath)) results.push(fullPath);
        }
    }
    return results.sort((a, b) => relFromRoot(a).localeCompare(relFromRoot(b), 'ko'));
}

function pushIssue(section, level, message) {
    section[level].push(message);
}

function addSection(title) {
    return { title, PASS: [], WARN: [], FAIL: [] };
}

function formatItems(items) {
    if (!items.length) return ['- 없음'];
    const lines = items.slice(0, LIMIT).map(item => `- ${item}`);
    if (items.length > LIMIT) {
        lines.push(`- 외 ${items.length - LIMIT}개`);
    }
    return lines;
}

function formatSection(section) {
    const lines = [`## ${section.title}`];
    for (const level of ['FAIL', 'WARN', 'PASS']) {
        lines.push(`### ${level} (${section[level].length})`);
        lines.push(...formatItems(section[level]));
        lines.push('');
    }
    return lines;
}

function escapeRegExp(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractMainDb(dbText) {
    const match = dbText.match(/window\.mainDB\s*=\s*({[\s\S]*})\s*;?\s*$/);
    if (!match) return null;
    return JSON.parse(match[1]);
}

function normalizeDbFile(fileValue) {
    const text = toPosix(String(fileValue || '').trim()).replace(/^\.?\//, '');
    return text.startsWith('archive/') ? text.slice('archive/'.length) : text;
}

function normalizeComparePath(fileValue) {
    const raw = toPosix(String(fileValue || '').trim())
        .normalize('NFC')
        .replace(/^\.?\//, '')
        .replace(/^archive\/exams\//i, '')
        .replace(/^archive\//i, '');
    const parts = raw.split('/').map(part => part.trim()).filter(Boolean);
    if (!parts.length) return '';

    const semesterMap = {
        '1mid': '1mid',
        'mid1': '1mid',
        '1final': '1final',
        'final1': '1final',
        '2mid': '2mid',
        'mid2': '2mid',
        '2final': '2final',
        'final2': '2final'
    };

    const normalizedParts = parts.map((part, index) => {
        const lower = part.toLowerCase();
        if (index === 0 && (lower === 'types' || lower === 'similar')) return '__variant__';
        return semesterMap[lower] || lower;
    });

    const filename = normalizedParts.pop();
    const stem = filename.replace(/\.js$/i, '').replace(/_?c$/i, '');
    normalizedParts.push(`${stem}.js`);
    return normalizedParts.join('/');
}

function basenameKey(fileValue) {
    return path.basename(toPosix(String(fileValue || '').trim()).normalize('NFC')).toLowerCase();
}

function buildExamFileIndex(examFiles = []) {
    const exactSet = new Set(examFiles);
    const normalizedMap = new Map();
    const basenameMap = new Map();

    examFiles.forEach(file => {
        const normalized = normalizeComparePath(file);
        if (!normalizedMap.has(normalized)) normalizedMap.set(normalized, []);
        normalizedMap.get(normalized).push(file);

        const base = basenameKey(file);
        if (!basenameMap.has(base)) basenameMap.set(base, []);
        basenameMap.get(base).push(file);
    });

    return { exactSet, normalizedMap, basenameMap };
}

function uniqueSorted(values = []) {
    return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'ko'));
}

function extractQuestionBlocks(fileText) {
    const starts = [];
    const regex = /(^|\n)\s*\{\s*(?:"id"|id)\s*:/g;
    let match;
    while ((match = regex.exec(fileText))) {
        starts.push(match.index + match[1].length);
    }
    if (!starts.length) return [];
    starts.push(fileText.length);
    const blocks = [];
    for (let i = 0; i < starts.length - 1; i += 1) {
        blocks.push(fileText.slice(starts[i], starts[i + 1]));
    }
    return blocks;
}

function extractQuestionId(block, fallback) {
    const match = block.match(/(?:"id"|id)\s*:\s*("?[^,"\n}]+"?|\d+)/);
    if (!match) return String(fallback);
    return String(match[1]).replace(/^"|"$/g, '');
}

function hasField(block, fieldName) {
    const re = new RegExp(`(?:["']${escapeRegExp(fieldName)}["']|${escapeRegExp(fieldName)})\\s*:`);
    return re.test(block);
}

function extractQuotedValues(text, regex) {
    const values = [];
    let match;
    while ((match = regex.exec(text))) {
        values.push(match[1]);
    }
    return values;
}

function shouldCheckAsset(assetPath) {
    return !/\.svg(?:[?#].*)?$/i.test(assetPath);
}

function resolveArchiveAsset(assetPath) {
    const clean = toPosix(String(assetPath || '').trim())
        .replace(/^https?:\/\/[^/]+/i, '')
        .replace(/^\/+/, '')
        .replace(/^\.\//, '');
    return {
        raw: assetPath,
        normalized: clean
    };
}

function fileContainsAny(text, patterns) {
    return patterns.some(pattern => pattern.test(text));
}

function main() {
    const sections = [
        addSection('1. db.js ↔ exams 파일 정합성'),
        addSection('2. db.js 메타데이터 점검'),
        addSection('3. exams JS 구조 점검'),
        addSection('4. 이미지 연결 점검'),
        addSection('5. 표준단원키 / tags / 마커 점검'),
        addSection('6. 해설 상태 점검'),
        addSection('7. 믹서 원본 추적 점검'),
        addSection('8. AP Math OS 연결 파일 점검')
    ];

    const dbPath = path.join(ROOT, 'archive', 'db.js');
    const examsDir = path.join(ROOT, 'archive', 'exams');
    const archiveRoot = path.join(ROOT, 'archive');
    const imageRoot = path.join(ROOT, 'archive', 'assets', 'images');
    const mixerPath = path.join(ROOT, 'archive', 'mixer.html');
    const mixedEnginePath = path.join(ROOT, 'archive', 'mixed_engine.html');
    const enginePath = path.join(ROOT, 'archive', 'engine.html');
    const schemaPath = path.join(ROOT, 'schema.sql');

    const dbText = readFileSafe(dbPath, sections[0].WARN, 'db.js');
    let mainDb = null;
    if (dbText) {
        try {
            mainDb = extractMainDb(dbText);
            if (!mainDb || !Array.isArray(mainDb.exams)) {
                pushIssue(sections[0], 'FAIL', '`window.mainDB.exams` 배열을 해석하지 못함');
            } else {
                pushIssue(sections[0], 'PASS', `db.js 해석 성공: ${mainDb.exams.length}개 등록`);
            }
        } catch (error) {
            pushIssue(sections[0], 'FAIL', `db.js JSON 파싱 실패: ${error.message}`);
        }
    }

    const examFiles = walkFiles(examsDir, filePath => filePath.endsWith('.js'));
    const examRelPaths = examFiles.map(filePath => toPosix(path.relative(examsDir, filePath)));
    const examIndex = buildExamFileIndex(examRelPaths);
    if (!examFiles.length) {
        pushIssue(sections[0], 'WARN', '`archive/exams/` 아래 JS 파일이 없거나 읽을 수 없음');
    } else {
        pushIssue(sections[0], 'PASS', `실제 exam JS 파일 ${examFiles.length}개 확인`);
        pushIssue(
            sections[0],
            'PASS',
            'db.js ↔ exams 파일 정합성 점검은 경로 정규화 보정 적용 후 수행됨. 정규화 항목: types/similar 호환, 학기 축 디렉터리, c.js 접미사, basename fallback.'
        );
    }

    const dbExams = mainDb && Array.isArray(mainDb.exams) ? mainDb.exams : [];
    const dbFileEntries = [];
    const fileCounts = new Map();
    const requiredMetaFields = ['file', 'school', 'topic', 'grade', 'year', 'semester', 'examType', 'subject', 'contentType'];

    dbExams.forEach((exam, index) => {
        const rawFile = exam && Object.prototype.hasOwnProperty.call(exam, 'file') ? exam.file : '';
        const normalized = normalizeDbFile(rawFile);
        dbFileEntries.push({ exam, index, rawFile, normalized });
        const key = normalized || `__empty__${index}`;
        fileCounts.set(key, (fileCounts.get(key) || 0) + 1);

        const missing = requiredMetaFields.filter(field => {
            const value = exam ? exam[field] : undefined;
            return value === undefined || value === null || String(value).trim() === '';
        });
        if (missing.length) {
            pushIssue(
                sections[1],
                'WARN',
                `db[${index}] ${normalized || '(file 비어 있음)'}: 필수 메타 누락 -> ${missing.join(', ')}`
            );
        }
        ['contentType', 'grade', 'subject', 'year', 'examType'].forEach(field => {
            const value = exam ? exam[field] : undefined;
            if (value === undefined || value === null || String(value).trim() === '') {
                pushIssue(sections[1], 'WARN', `db[${index}] ${normalized || '(file 비어 있음)'}: ${field} 누락`);
            }
        });
    });

    for (const entry of dbFileEntries) {
        if (!entry.rawFile || !String(entry.rawFile).trim()) {
            pushIssue(sections[0], 'FAIL', `db[${entry.index}] file 값 비어 있음`);
            continue;
        }
        if (!/\.js$/i.test(entry.normalized)) {
            pushIssue(sections[0], 'FAIL', `db[${entry.index}] 확장자 비정상: \`${entry.rawFile}\``);
        }
        const exactCandidates = [];
        if (entry.normalized && examIndex.exactSet.has(entry.normalized)) exactCandidates.push(entry.normalized);
        const prefixed = entry.normalized.replace(/^archive\/exams\//i, '');
        if (prefixed && examIndex.exactSet.has(prefixed)) exactCandidates.push(prefixed);

        const normalizedKey = normalizeComparePath(entry.normalized);
        const normalizedCandidates = normalizedKey ? (examIndex.normalizedMap.get(normalizedKey) || []) : [];
        const basenameCandidates = examIndex.basenameMap.get(basenameKey(entry.normalized)) || [];

        if (!exactCandidates.length && !normalizedCandidates.length && !basenameCandidates.length) {
            pushIssue(sections[0], 'FAIL', `db 등록 파일 없음: \`${entry.normalized}\``);
        } else if (!exactCandidates.length && normalizedCandidates.length > 1) {
            pushIssue(
                sections[0],
                'WARN',
                `정규화 비교 다중 후보: \`${entry.normalized}\` -> ${uniqueSorted(normalizedCandidates).map(v => `\`${v}\``).join(', ')}`
            );
        }
    }

    for (const [file, count] of fileCounts.entries()) {
        if (count > 1 && !file.startsWith('__empty__')) {
            pushIssue(sections[0], 'WARN', `중복 file 등록: \`${file}\` (${count}회)`);
        }
    }

    const dbNormalizedSet = new Set(dbFileEntries.map(entry => normalizeComparePath(entry.normalized)).filter(Boolean));
    for (const file of examRelPaths) {
        if (!dbNormalizedSet.has(normalizeComparePath(file))) {
            pushIssue(sections[0], 'WARN', `db 미등록 실제 파일: \`${file}\``);
        }
    }

    let totalImagePathCount = 0;

    for (const examPath of examFiles) {
        const rel = relFromRoot(examPath);
        const text = readFileSafe(examPath, sections[3].WARN, 'exam JS');
        if (!text) continue;

        if (!/window\.examTitle\s*=/.test(text)) {
            pushIssue(sections[2], 'FAIL', `${rel}: window.examTitle 없음`);
        }
        if (!/window\.questionBank\s*=/.test(text)) {
            pushIssue(sections[2], 'FAIL', `${rel}: window.questionBank 없음`);
        }
        if (!/window\.questionBank\s*=\s*\[/.test(text)) {
            pushIssue(sections[2], 'FAIL', `${rel}: questionBank가 배열로 보이지 않음`);
        }

        const blocks = extractQuestionBlocks(text);
        if (!blocks.length) {
            pushIssue(sections[2], 'FAIL', `${rel}: 문항 블록을 찾지 못함`);
        }

        const requiredQuestionFields = ['id', 'content', 'choices', 'answer', 'solution', 'standardUnitKey'];
        const optionalQuestionFields = ['questionType', 'layoutTag', 'tags', 'wide'];

        blocks.forEach((block, blockIndex) => {
            const qid = extractQuestionId(block, blockIndex + 1);
            for (const field of requiredQuestionFields) {
                if (!hasField(block, field)) {
                    pushIssue(sections[2], 'FAIL', `${rel} q${qid}: ${field} 필드 없음`);
                }
            }
            for (const field of optionalQuestionFields) {
                if (!hasField(block, field)) {
                    pushIssue(sections[2], 'WARN', `${rel} q${qid}: ${field} 누락 가능성`);
                }
            }

            if (/(?:"standardUnitKey"|standardUnitKey)\s*:\s*""/.test(block)) {
                pushIssue(sections[5], 'WARN', `${rel} q${qid}: standardUnitKey 빈 문자열`);
            }
            if (/(?:"standardUnit"|standardUnit)\s*:\s*""/.test(block)) {
                pushIssue(sections[5], 'WARN', `${rel} q${qid}: standardUnit 빈 문자열`);
            }
            if (/(?:"standardUnitOrder"|standardUnitOrder)\s*:\s*0\b/.test(block)) {
                pushIssue(sections[5], 'WARN', `${rel} q${qid}: standardUnitOrder가 0`);
            }
            if (/RAW-/.test(block)) {
                pushIssue(sections[5], 'WARN', `${rel} q${qid}: RAW- 포함`);
            }
            if (/(?:["']tags["']|tags)\s*:\s*\[\s*\]/.test(block) && /<svg|<table|<img|\bimage\s*:/.test(block)) {
                pushIssue(sections[5], 'WARN', `${rel} q${qid}: tags가 빈 배열인데 시각 요소 포함`);
            }
            if (/\[(도형필요|그래프필요|표필요)\]/.test(block)) {
                pushIssue(sections[5], 'WARN', `${rel} q${qid}: 작업 마커 잔존`);
            }

            if (/(?:"solution"|solution)\s*:\s*""/.test(block)) {
                pushIssue(sections[6], 'WARN', `${rel} q${qid}: solution 빈 문자열`);
            } else {
                if (!/\[키포인트\]/.test(block)) {
                    pushIssue(sections[6], 'WARN', `${rel} q${qid}: solution에 [키포인트] 없음`);
                }
                if (/(cite|PASS|FAIL|WARN|검수 완료|내부 메모)/.test(block)) {
                    pushIssue(sections[6], 'WARN', `${rel} q${qid}: solution에 운영 흔적 의심 문자열`);
                }
            }
        });

        const imageFields = extractQuotedValues(text, /(?:["']image["']|image)\s*:\s*["']([^"']+)["']/g);
        const imgSrcs = extractQuotedValues(text, /<img\b[^>]*\bsrc=["']([^"']+)["']/g);
        totalImagePathCount += imageFields.length + imgSrcs.length;

        const blockTextById = new Map();
        blocks.forEach((block, blockIndex) => {
            blockTextById.set(String(blockIndex), block);
        });
        blocks.forEach((block, blockIndex) => {
            const qid = extractQuestionId(block, blockIndex + 1);
            const imagesInBlock = extractQuotedValues(block, /(?:["']image["']|image)\s*:\s*["']([^"']+)["']/g);
            const imgsInBlock = extractQuotedValues(block, /<img\b[^>]*\bsrc=["']([^"']+)["']/g);
            if (imagesInBlock.length && imgsInBlock.length) {
                pushIssue(sections[3], 'WARN', `${rel} q${qid}: image 필드와 content 내부 img가 동시에 존재`);
            }
        });

        for (const asset of [...imageFields, ...imgSrcs]) {
            const resolved = resolveArchiveAsset(asset);
            if (!resolved.normalized) continue;
            if (!resolved.normalized.startsWith('assets/images/')) {
                pushIssue(sections[3], 'WARN', `${rel}: assets/images/ 외 경로 사용 -> \`${resolved.normalized}\``);
            }
            if (!shouldCheckAsset(resolved.normalized)) continue;
            const assetPath = path.join(archiveRoot, resolved.normalized);
            if (!exists(assetPath)) {
                pushIssue(sections[3], 'FAIL', `${rel}: 이미지 파일 없음 -> \`${resolved.normalized}\``);
            }
        }
    }

    if (exists(imageRoot)) {
        pushIssue(sections[3], 'PASS', `이미지 루트 확인: \`${relFromRoot(imageRoot)}\``);
    } else {
        pushIssue(sections[3], 'WARN', `이미지 루트 없음: \`${relFromRoot(imageRoot)}\``);
    }

    const mixerText = readFileSafe(mixerPath, sections[6].WARN, 'mixer.html');
    const mixedText = readFileSafe(mixedEnginePath, sections[6].WARN, 'mixed_engine.html');
    const engineText = readFileSafe(enginePath, sections[6].WARN, 'engine.html');
    const schemaText = readFileSafe(schemaPath, sections[6].WARN, 'schema.sql');

    const mixerHasSourceTracking = /_sourceFile|_sourceTitle/.test(mixerText);
    const mixedHasBlueprintFlow = /exam_blueprints/.test(mixedText);
    const engineHasBlueprintFlow = /exam_blueprints/.test(engineText);
    const mixedUsesSourceTracking = /_sourceFile|_sourceTitle/.test(mixedText);
    const schemaHasBlueprints = /create\s+table[\s\S]*exam_blueprints|exam_blueprints/i.test(schemaText);
    const schemaHasAssignments = /create\s+table[\s\S]*class_exam_assignments|class_exam_assignments/i.test(schemaText);

    pushIssue(sections[6], mixerHasSourceTracking ? 'PASS' : 'WARN', `mixer.html _sourceFile/_sourceTitle ${mixerHasSourceTracking ? '흐름 확인' : '흐름 없음'}`);
    pushIssue(sections[6], mixedHasBlueprintFlow ? 'PASS' : 'WARN', `mixed_engine.html exam_blueprints ${mixedHasBlueprintFlow ? '흐름 확인' : '흐름 없음'}`);
    pushIssue(sections[6], engineHasBlueprintFlow ? 'PASS' : 'WARN', `engine.html exam_blueprints ${engineHasBlueprintFlow ? '흐름 확인' : '흐름 없음'}`);
    pushIssue(sections[6], schemaHasBlueprints ? 'PASS' : 'WARN', `schema.sql exam_blueprints ${schemaHasBlueprints ? '테이블 확인' : '테이블 미확인'}`);
    pushIssue(sections[6], schemaHasAssignments ? 'PASS' : 'WARN', `schema.sql class_exam_assignments ${schemaHasAssignments ? '테이블 확인' : '테이블 미확인'}`);

    if (engineHasBlueprintFlow && !mixedHasBlueprintFlow) {
        pushIssue(sections[6], 'WARN', 'engine.html에는 exam_blueprints 등록 흐름이 있으나 mixed_engine.html에는 없어 MIXED 원본 매핑 누락 위험');
    }
    if (mixerHasSourceTracking && !mixedUsesSourceTracking) {
        pushIssue(sections[6], 'WARN', 'mixer.html에는 _sourceFile/_sourceTitle 흐름이 있으나 mixed_engine.html에서 활용 흔적이 없어 믹서 원본 추적 연결 미완성 위험');
    }

    const apPaths = [
        'apmath/js/qr-omr.js',
        'apmath/js/clinic-print.js',
        'apmath/js/report.js',
        'apmath/js/student.js',
        'apmath/js/core.js',
        'apmath/worker-backup/worker/index.js',
        'apmath/worker-backup/worker/schema.sql',
        'schema.sql'
    ];
    for (const relPath of apPaths) {
        const fullPath = path.join(ROOT, ...relPath.split('/'));
        pushIssue(sections[7], exists(fullPath) ? 'PASS' : 'FAIL', `${relPath} ${exists(fullPath) ? '존재' : '없음'}`);
    }

    const failCount = sections.reduce((sum, section) => sum + section.FAIL.length, 0);
    const warnCount = sections.reduce((sum, section) => sum + section.WARN.length, 0);
    const overall = failCount > 0 ? 'FAIL' : warnCount > 0 ? 'WARN' : 'PASS';

    const summaryLines = [
        '# ARCHIVE_AUDIT_REPORT',
        '',
        '## 0. 요약',
        `- 점검 일시: ${new Date().toISOString()}`,
        `- 전체 판정: ${overall}`,
        `- db 등록 자료 수: ${dbExams.length}`,
        `- exams 실제 파일 수: ${examFiles.length}`,
        `- 이미지 경로 수: ${totalImagePathCount}`,
        `- 주요 WARN 수: ${warnCount}`,
        `- 주요 FAIL 수: ${failCount}`,
        ''
    ];

    const nextAction = [];
    if (failCount > 0) nextAction.push('- 1순위: FAIL 항목부터 정리해 db 등록 누락, 이미지 누락, 연결 파일 부재를 해소한다.');
    else nextAction.push('- 1순위: 치명적 FAIL은 없지만 WARN 상위 항목부터 운영 리스크를 줄인다.');
    nextAction.push('- 2순위: db 메타데이터 누락과 exam 구조 누락을 표준 스키마 기준으로 정리한다.');
    nextAction.push('- 3순위: mixed_engine 원본 추적과 schema 연결 여부를 실제 배포 흐름 기준으로 보강한다.');

    const reportLines = [
        ...summaryLines,
        ...sections.flatMap(formatSection),
        '## 9. 다음 조치 추천',
        ...nextAction,
        ''
    ];

    fs.writeFileSync(REPORT_PATH, reportLines.join('\n'), 'utf8');
    console.log(`ARCHIVE_AUDIT_REPORT.md 생성: ${overall} / FAIL ${failCount} / WARN ${warnCount}`);
}

main();
