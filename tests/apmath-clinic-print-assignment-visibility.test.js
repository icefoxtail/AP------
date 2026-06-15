const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const clinicPrint = fs.readFileSync(path.join(root, 'apmath', 'js', 'clinic-print.js'), 'utf8');
const core = fs.readFileSync(path.join(root, 'apmath', 'js', 'core.js'), 'utf8');
const worker = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'index.js'), 'utf8');
const wrongEngine = fs.readFileSync(path.join(root, 'apmath', 'wrong_print_engine.html'), 'utf8');

assert(
  clinicPrint.includes('function clinicPrintGetClassExamAssignments') &&
    clinicPrint.includes('state.db.class_exam_assignments || state.db.exam_assignments'),
  'clinic print should read class exam assignment rows'
);

assert(
  clinicPrint.includes("const AP_CLINIC_PRINT_ASSIGNMENT_FROM_DATE = '2026-06-01'") &&
    clinicPrint.includes('function clinicPrintIsOnOrAfterFromDate'),
  'clinic print should use June 1, 2026 as the assignment visibility baseline'
);

assert(
  clinicPrint.includes('async function clinicPrintRefreshClassAssignments') &&
    clinicPrint.includes('class-exam-assignments?class=') &&
    clinicPrint.includes('clinicPrintMergeClassAssignments'),
  'clinic print should refresh class assignment rows when the modal opens'
);

assert(
  clinicPrint.includes('async function openClinicPrintCenter') &&
    !clinicPrint.includes('출제 기록을 불러오는 중입니다'),
  'clinic print should refresh assignments without showing an internal loading message'
);

assert(
  clinicPrint.includes('function openClinicClassPicker') &&
    clinicPrint.includes('clinicPrintGetActiveClasses') &&
    clinicPrint.includes("onclick=\"openClinicCenter('${safeClassId}')\"") &&
    clinicPrint.includes("onclick=\"clinicPrintOpenSimilarMenu('${safeClassIdForJs}')\""),
  'sidebar clinic entry should let users pick a class and then choose wrong-print or similar-question mode'
);

assert(
  clinicPrint.includes("typeof openClinicSimilarForClass === 'function'") &&
    core.includes('async function openClinicSimilarForClass') &&
    core.includes('computeClassWeakUnits(classId)') &&
    core.includes('renderWeakUnitSummary(weakUnits'),
  'clinic similar-question entry should build class weak-unit recommendations before opening the basket'
);

assert(
  clinicPrint.includes('clinicPrintGetClassExamAssignments(classId).forEach') &&
    clinicPrint.includes('.filter(group => group.printable || group.sessions.length > 0)'),
  'clinic print should show printable assigned exams even before any student session exists'
);

assert(
  clinicPrint.includes('countsCompatible') &&
    clinicPrint.includes('!group.questionCount || !sessionQuestionCount || sessionQuestionCount === group.questionCount'),
  'clinic print should match assignment-created groups with later submitted sessions even when assignment question_count was missing'
);

assert(
  core.includes('class_exam_assignments: Array.isArray(data.class_exam_assignments) ? data.class_exam_assignments') &&
    worker.includes('class_exam_assignments: cea.results') &&
    worker.includes('SELECT * FROM class_exam_assignments'),
  'initial-data should include class_exam_assignments for the AP Math frontend'
);

assert(
  wrongEngine.includes('async function renderMeasuredExamPages') &&
    wrongEngine.includes("document.getElementById('staging')") &&
    wrongEngine.includes('profile.proxyHeight_raw = item.box.scrollHeight') &&
    wrongEngine.includes('const usablePageHeight = tempPage.body.clientHeight') &&
    wrongEngine.includes('grid.style.flex = block.type ===') &&
    wrongEngine.includes('fitQuestionBox(box)'),
  'clinic wrong print engine should use the mixed-engine staging/measurement layout path'
);

assert(
  wrongEngine.includes('await renderSol(area, state.payload)') &&
    wrongEngine.includes('await renderClassPages(area, state.payload)') &&
    wrongEngine.includes('await renderStudentPages(area, state.payload)'),
  'clinic wrong print engine should wait for async measured rendering before final MathJax pass'
);

const countMatches = (source, pattern) => (source.match(pattern) || []).length;

assert(
  wrongEngine.includes('<title>AP Math 오답 클리닉</title>') &&
    wrongEngine.indexOf('</title>') > -1 &&
    wrongEngine.indexOf('<script>') > wrongEngine.indexOf('</title>') &&
    wrongEngine.includes('<span id="ctrl-title">AP Math 오답 클리닉</span>') &&
    wrongEngine.includes('data-mode="exam">문제지</button>') &&
    wrongEngine.includes('data-mode="sol">해설지</button>') &&
    wrongEngine.includes('data-mode="ans">정답표</button>') &&
    wrongEngine.includes('인쇄 / PDF 저장</button>'),
  'clinic wrong print engine should have valid Korean top-level HTML controls'
);

assert(
  wrongEngine.includes('오답 문항을 불러오는 중입니다.') &&
    wrongEngine.includes('출력할 오답 문항이 없습니다.') &&
    wrongEngine.includes('오답지 데이터를 찾을 수 없습니다. AP Math OS에서 다시 열어주세요.'),
  'clinic wrong print engine should have valid Korean notice messages'
);

['�', '臾몄젣', '?댁꽕', '?뺣떟', '?몄뇙', '???', '?ㅻ떟', '?대━'].forEach(pattern => {
  assert(
    !wrongEngine.includes(pattern),
    `clinic wrong print engine should not include mojibake pattern: ${pattern}`
  );
});

assert(
  !wrongEngine.includes("function wrapLatex(text) {\n    return String(text || '');\n}") &&
    !wrongEngine.includes("function wrapLatex(text) { return String(text || ''); }"),
  'clinic wrong print engine should not use the stub wrapLatex implementation'
);

assert(
  wrongEngine.includes("packages: {'[+]': ['ams', 'boldsymbol']}"),
  'clinic wrong print engine should use the archive engine MathJax packages'
);

assert(
  !wrongEngine.includes('legacyRemovedPageSlice') &&
    !wrongEngine.includes('legacyRemovedExamGrid') &&
    !wrongEngine.includes('legacyRenderStudentPages') &&
    !wrongEngine.includes('legacyRenderClassPages') &&
    !wrongEngine.includes('legacyRenderSol'),
  'clinic wrong print engine should not keep legacy dead-code rendering references'
);

{
  const scriptBlocks = [...wrongEngine.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1]);
  assert.doesNotThrow(
    () => new Function(scriptBlocks[scriptBlocks.length - 1]),
    'clinic wrong print engine script should parse'
  );
}

assert.strictEqual(
  countMatches(wrongEngine, /\b(?:async\s+)?function\s+renderSol\s*\(/g),
  1,
  'clinic wrong print engine should have exactly one live renderSol declaration'
);

assert.strictEqual(
  countMatches(wrongEngine, /\b(?:async\s+)?function\s+renderStudentPages\s*\(/g),
  1,
  'clinic wrong print engine should have exactly one live renderStudentPages declaration'
);

assert.strictEqual(
  countMatches(wrongEngine, /\b(?:async\s+)?function\s+renderClassPages\s*\(/g),
  1,
  'clinic wrong print engine should have exactly one live renderClassPages declaration'
);

assert(
  !/\bpaginateItems\s*\(/.test(wrongEngine) &&
    !/\brenderExamBlocks\s*\(/.test(wrongEngine),
  'clinic wrong print engine should not call legacy fixed-slice pagination/rendering'
);

assert(
  /async\s+function\s+renderSol\s*\([\s\S]*?placeSolutionItems/.test(wrongEngine) &&
    wrongEngine.includes('await renderSol(area, state.payload)'),
  'clinic wrong print engine should use async renderSol with placeSolutionItems and await it from render()'
);

console.log('apmath clinic print assignment visibility guard passed');
