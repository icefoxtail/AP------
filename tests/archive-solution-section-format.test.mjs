import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const enginePaths = [
    path.join(root, 'archive', 'engine.html'),
    path.join(root, 'archive', 'mixed_engine.html'),
    path.join(root, 'apmath', 'wrong_print_engine.html')
];

function loadFormatter(enginePath) {
    const source = fs.readFileSync(enginePath, 'utf8');
    const wrapStart = source.indexOf(
        enginePath.endsWith('mixed_engine.html')
            ? 'function wrapLatexPreserveBlocks(text)'
            : 'function wrapLatex(text)'
    );
    const end = source.indexOf('function autoCompress', wrapStart);
    assert.ok(wrapStart >= 0 && end > wrapStart, `formatter functions not found: ${enginePath}`);
    const functions = source.slice(wrapStart, end);
    return new Function(`${functions}\nreturn { wrapLatex, formatSolutionHtml };`)();
}

const formatters = enginePaths.map(loadFormatter);
const escapedNewlines = '[키포인트] 핵심\\n조건 정리: 조건\\n풀이 방향: 방향\\n정석 풀이: 풀이';
const actualNewlines = '[키포인트] 핵심\n조건 정리: 조건\n풀이 방향: 방향\n정석 풀이: 풀이';
const legacyHeadings = '[키포인트]\n핵심\n\n조건 정리\n조건\n풀이 과정\n과정\n결론\n정답';
const unlabeled = '첫 문장\\n둘째 문장';
const unlabeledConclusion = '이 결론은 중요하다.\\n다음 문장';

for (const formatter of formatters) {
    const escapedHtml = formatter.formatSolutionHtml(escapedNewlines);
    const actualHtml = formatter.formatSolutionHtml(actualNewlines);
    assert.equal(escapedHtml, actualHtml, 'escaped and actual newlines must render identically');
    assert.equal((escapedHtml.match(/class="sol-sec-label"/g) || []).length, 4);
    assert.equal((escapedHtml.match(/<br>/g) || []).length, 3);
    assert.match(escapedHtml, /^<span class="sol-sec-label">\[키포인트\]<\/span> 핵심/);
    assert.match(escapedHtml, /<br><span class="sol-sec-label">조건 정리:<\/span> 조건/);
    assert.match(escapedHtml, /<br><span class="sol-sec-label">풀이 방향:<\/span> 방향/);
    assert.match(escapedHtml, /<br><span class="sol-sec-label">정석 풀이:<\/span> 풀이$/);
    assert.ok(!escapedHtml.includes('$\\n$'), 'newline markers must not become MathJax input');

    const legacyHtml = formatter.formatSolutionHtml(legacyHeadings);
    assert.match(legacyHtml, /^<span class="sol-sec-label">\[키포인트\]<\/span> 핵심/);
    assert.match(legacyHtml, /<br><span class="sol-sec-label">조건 정리:<\/span> 조건/);
    assert.match(legacyHtml, /<br><span class="sol-sec-label">풀이 과정:<\/span> 과정/);
    assert.match(legacyHtml, /<br><span class="sol-sec-label">결론:<\/span> 정답$/);
    assert.ok(!legacyHtml.includes('<br><br>'), 'section normalization must not double line breaks');

    assert.equal(
        formatter.formatSolutionHtml(unlabeled),
        formatter.wrapLatex(unlabeled),
        'unlabeled legacy solutions must remain on the old rendering path'
    );
    assert.equal(
        formatter.formatSolutionHtml(unlabeledConclusion),
        formatter.wrapLatex(unlabeledConclusion),
        'ordinary sentences containing a label word must not activate section formatting'
    );
    const latexHtml = formatter.formatSolutionHtml('[키포인트] $x \\neq y$');
    assert.ok(latexHtml.includes('\\neq'), 'real LaTeX commands beginning with n must be preserved');
}

assert.equal(
    formatters[0].formatSolutionHtml(escapedNewlines),
    formatters[1].formatSolutionHtml(escapedNewlines),
    'archive and mixed engines must produce identical solution HTML'
);
assert.equal(
    formatters[0].formatSolutionHtml(escapedNewlines),
    formatters[2].formatSolutionHtml(escapedNewlines),
    'archive and wrong-answer engines must produce identical solution HTML'
);

const wrongEngineSource = fs.readFileSync(enginePaths[2], 'utf8');
assert.equal(
    (wrongEngineSource.match(/formatSolutionHtml\(getQuestionSolution\(q\)/g) || []).length,
    2,
    'both wrong-answer solution render paths must use the shared formatter contract'
);

const examRoots = [
    path.join(root, 'archive', 'exams', 'original', 'high', 'h1', '1final'),
    path.join(root, 'archive', 'exams', 'original', 'high', 'h2', '1final')
];
const examFiles = examRoots.flatMap(dir =>
    fs.readdirSync(dir, { withFileTypes: true })
        .filter(entry => entry.isFile() && entry.name.endsWith('.js'))
        .map(entry => path.join(dir, entry.name))
);

let questionCount = 0;
let structuredCount = 0;
let unlabeledCount = 0;
for (const examFile of examFiles) {
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(examFile, 'utf8'), context, { filename: examFile, timeout: 2000 });
    for (const question of context.window.questionBank || []) {
        questionCount += 1;
        const solution = String(question.solution || question.explanation || question.sol || '');
        const isStandard = ['[키포인트]', '조건 정리', '풀이 방향', '정석 풀이']
            .every(label => solution.includes(label));
        const html = formatters[0].formatSolutionHtml(solution);
        if (isStandard) {
            structuredCount += 1;
            for (const label of ['[키포인트]', '조건 정리:', '풀이 방향:', '정석 풀이:']) {
                assert.ok(
                    html.includes(`<span class="sol-sec-label">${label}</span>`),
                    `standard solution must render ${label}: ${examFile} #${question.id}`
                );
            }
        }
        if (!/\[키포인트\]|조건 정리|풀이 방향|풀이 과정|정석 풀이|결론/.test(solution)) {
            unlabeledCount += 1;
            assert.equal(html, formatters[0].wrapLatex(solution));
        }
    }
}

assert.ok(examFiles.length > 0);
assert.ok(questionCount > 0);
assert.ok(structuredCount > 0);
console.log(`archive solution section format test passed (${examFiles.length} files, ${questionCount} questions, ${structuredCount} standard, ${unlabeledCount} unlabeled)`);
