import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '..');
const examsDir = path.join(archiveDir, 'exams');
const dbPath = path.join(archiveDir, 'db.js');
const indexPath = path.join(archiveDir, 'question-index.js');
const reportPath = path.join(archiveDir, 'question-index-report.md');

function walkJsFiles(dir) {
    const files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...walkJsFiles(full));
        else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
    }
    return files;
}

function normalizePath(value) {
    return String(value || '').replace(/\\/g, '/').replace(/^exams\//, '').trim();
}

function runArchiveScript(file, code) {
    const context = {
        window: {},
        console: {
            log() {},
            warn() {},
            error() {}
        }
    };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(code, context, { filename: file });
    return context;
}

function stripHtml(value) {
    return String(value || '')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeTags(value) {
    if (Array.isArray(value)) return value.map(v => String(v || '').trim()).filter(Boolean);
    if (typeof value === 'string') {
        return value.split(/[,\s]+/).map(v => v.trim()).filter(Boolean);
    }
    return [];
}

function addExample(bucket, sourceFile, q, slot) {
    if (bucket.length >= 5) return;
    const id = q && typeof q === 'object' && q.id !== undefined && q.id !== null && q.id !== '' ? q.id : `slot${slot}`;
    bucket.push(`${sourceFile}#${id}`);
}

function loadMainDb() {
    const dbCode = fs.readFileSync(dbPath, 'utf8');
    const context = runArchiveScript(dbPath, dbCode);
    const exams = context.window.mainDB && Array.isArray(context.window.mainDB.exams)
        ? context.window.mainDB.exams
        : [];
    return { exams, bytes: Buffer.byteLength(dbCode, 'utf8') };
}

const startedAt = new Date();
const db = loadMainDb();
const metaByFile = new Map(db.exams.map(ex => [normalizePath(ex.file), ex]));
const examFiles = walkJsFiles(examsDir);
const index = [];
const report = {
    generatedAt: startedAt.toISOString(),
    dbExamCount: db.exams.length,
    dbBytes: db.bytes,
    examFileCount: examFiles.length,
    examBytes: 0,
    questionCount: 0,
    skippedUndefined: 0,
    missing: {
        id: 0,
        content: 0,
        choices: 0,
        level: 0,
        standardUnit: 0,
        tags: 0
    },
    examples: {
        id: [],
        content: [],
        choices: [],
        level: [],
        standardUnit: [],
        tags: [],
        skippedUndefined: []
    },
    failures: []
};

for (const file of examFiles) {
    const sourceFile = normalizePath(path.relative(examsDir, file));
    try {
        const code = fs.readFileSync(file, 'utf8');
        report.examBytes += Buffer.byteLength(code, 'utf8');
        const context = runArchiveScript(file, code);
        const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
        if (!Array.isArray(questions)) {
            report.failures.push({ sourceFile, error: 'questions array not found' });
            continue;
        }

        const meta = metaByFile.get(sourceFile) || {};
        for (let slot = 0; slot < questions.length; slot += 1) {
            const q = questions[slot];
            if (!q || typeof q !== 'object') {
                report.skippedUndefined += 1;
                addExample(report.examples.skippedUndefined, sourceFile, q, slot);
                continue;
            }

            const id = q.id ?? '';
            const contentText = stripHtml(q.content);
            const choices = Array.isArray(q.choices) ? q.choices : [];
            const choicesText = stripHtml(choices.map(choice => String(choice || '')).join(' '));
            const standardUnit = String(q.standardUnit || '').trim();
            const standardUnitKey = String(q.standardUnitKey || '').trim();
            const course = String(q.standardCourse || meta.primaryStandardCourse || '').trim();
            const level = String(q.level || '').trim();
            const tags = normalizeTags(q.tags);

            if (id === '') { report.missing.id += 1; addExample(report.examples.id, sourceFile, q, slot); }
            if (!contentText) { report.missing.content += 1; addExample(report.examples.content, sourceFile, q, slot); }
            if (!Array.isArray(q.choices)) { report.missing.choices += 1; addExample(report.examples.choices, sourceFile, q, slot); }
            if (!level) { report.missing.level += 1; addExample(report.examples.level, sourceFile, q, slot); }
            if (!standardUnit) { report.missing.standardUnit += 1; addExample(report.examples.standardUnit, sourceFile, q, slot); }
            if (q.tags === undefined || q.tags === null || q.tags === '') {
                report.missing.tags += 1;
                addExample(report.examples.tags, sourceFile, q, slot);
            }

            report.questionCount += 1;
            index.push({
                qKey: `${sourceFile}_${id}`,
                sourceFile,
                grade: String(meta.grade || '').trim(),
                subject: String(meta.subject || '').trim(),
                id,
                standardUnit,
                standardUnitKey,
                course,
                level,
                tags,
                hasImage: Boolean(q.image),
                contentText,
                choicesText
            });
        }
    } catch (error) {
        report.failures.push({ sourceFile, error: error && error.message ? error.message : String(error) });
    }
}

const indexJs = `// Generated by archive/tools/build-question-index.mjs\n// Generated at ${report.generatedAt}\nwindow.questionIndex=${JSON.stringify(index)};\n`;
fs.writeFileSync(indexPath, indexJs, 'utf8');
report.indexBytes = Buffer.byteLength(indexJs, 'utf8');

function listExamples(items) {
    return items.length ? items.map(item => `  - ${item}`).join('\n') : '  - 없음';
}

const reportMd = `# question-index 생성 리포트

- 생성 시각: ${report.generatedAt}
- 시험지 수(db.js): ${report.dbExamCount}
- 시험지 파일 수: ${report.examFileCount}
- 문항 수: ${report.questionCount}
- undefined/비객체 문항 skip: ${report.skippedUndefined}
- 누락 id: ${report.missing.id}
- 누락 content: ${report.missing.content}
- 누락 choices: ${report.missing.choices}
- 누락 level: ${report.missing.level}
- 누락 standardUnit: ${report.missing.standardUnit}
- 누락 tags: ${report.missing.tags}
- db.js 크기: ${report.dbBytes} bytes
- 시험지 JS 총 크기: ${report.examBytes} bytes
- 인덱스 크기: ${report.indexBytes} bytes
- 로드 실패 파일: ${report.failures.length}

## 누락 예시

### id
${listExamples(report.examples.id)}

### content
${listExamples(report.examples.content)}

### choices
${listExamples(report.examples.choices)}

### level
${listExamples(report.examples.level)}

### standardUnit
${listExamples(report.examples.standardUnit)}

### tags
${listExamples(report.examples.tags)}

### undefined/비객체 문항
${listExamples(report.examples.skippedUndefined)}

## 실패 파일

${report.failures.length ? report.failures.map(item => `- ${item.sourceFile}: ${item.error}`).join('\n') : '- 없음'}
`;

fs.writeFileSync(reportPath, reportMd, 'utf8');
console.log(`question-index generated: ${index.length} questions, ${report.indexBytes} bytes`);
