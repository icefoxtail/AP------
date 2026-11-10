const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const studentPortal = fs.readFileSync(path.join(root, 'apmath/student/index.html'), 'utf8');
const studentStyles = fs.readFileSync(path.join(root, 'apmath/student/student-portal.css'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive/mixed_engine.html'), 'utf8');
const studentManifest = fs.readFileSync(path.join(root, 'apmath/student/manifest.json'), 'utf8');
const studentServiceWorker = fs.readFileSync(path.join(root, 'apmath/student/sw.js'), 'utf8');

function styleRule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = studentStyles.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]+)\\}`));
  assert(match, `${selector} should have a shared student portal style rule`);
  return match[1];
}
const portalTokens = Object.fromEntries(
  Array.from(styleRule(':root').matchAll(/--([\w-]+):\s*([^;]+);/g), match => [match[1], match[2].trim()])
);

assert(
  studentPortal.includes('<body class="student-portal-theme">') &&
    /<img class="brand-logo" src="\.\/icons\/icon-192\.png(?:\?v=[^"]+)?" alt="AP Math">/.test(studentPortal) &&
    studentPortal.includes('<div class="brand-main">AP Math OS</div>'),
  'student portal should keep the visible AP image brand mark'
);

assert(
    /<link rel="stylesheet" href="\.\/student-portal\.css\?v=[^"]+">/.test(studentPortal) &&
    portalTokens.bg === '#faf9f7' &&
    portalTokens.surface === '#ffffff' &&
    portalTokens['action-primary'] === '#1c1917' &&
    portalTokens.primary === '#2563eb' &&
    JSON.parse(studentManifest).theme_color === portalTokens.bg &&
    JSON.parse(studentManifest).background_color === portalTokens.bg &&
    /STUDENT_SW_VERSION\s*=\s*'2026\.\d{2}\.\d{2}\.\d+'/.test(studentServiceWorker) &&
    !/#4f46e5|#1a5cff|#7c3aed|rgba\(26,92,255|rgba\(124,58,237/i.test(studentStyles),
  'student portal and install shell should use APMS warm surfaces, charcoal actions, and the blue focus/selection token'
);

assert(
  /class="btn back-btn" onclick="renderHome\(\)"/.test(studentPortal) &&
    /min-height:\s*44px/.test(styleRule('.back-btn')) &&
    /color:\s*var\(--secondary\)/.test(styleRule('.back-btn')) &&
    /outline:\s*2px solid var\(--primary\)/.test(studentStyles),
  'student portal back/home controls should retain a 44px target and a visible keyboard focus ring'
);

assert(
  studentPortal.includes('function buildOmrReviewUrl') &&
    studentPortal.includes('function isOmrReviewAvailable') &&
    studentPortal.includes('function renderOmrReviewActions') &&
    studentPortal.includes("url.searchParams.set('studentReview','1')") &&
    studentPortal.includes('packId') &&
    studentPortal.includes('시험지 보기') &&
    studentPortal.includes('정답 보기') &&
    studentPortal.includes('해설 보기'),
  'student portal OMR cards should expose exam, answer, and solution review actions'
);

const reviewActionsHelper = studentPortal.match(/function renderOmrReviewActions\(exam\) \{[\s\S]*?\n    \}/);
const pdfActionHelper = studentPortal.match(/function renderOmrPdfAction\(exam\) \{[\s\S]*?\n    \}/);
assert(reviewActionsHelper, 'review action renderer should exist');
assert(pdfActionHelper, 'PDF action renderer should exist');
const actionContext = {
  String,
  escapeHtml: value => String(value),
  isOmrReviewAvailable: () => true,
  buildOmrReviewUrl: (_exam, mode) => `/review?mode=${mode}`,
};
vm.createContext(actionContext);
vm.runInContext(reviewActionsHelper[0] + '\n' + pdfActionHelper[0], actionContext, {
  filename: 'student-portal-review-actions.js'
});
const reviewOnlyExam = {
  assignment_id: 'cancelled-assignment',
  is_review_only: true,
  pdf_ready: true,
  pdf_status: 'ready',
};
assert.strictEqual(
  actionContext.renderOmrPdfAction(reviewOnlyExam),
  '',
  'review-only assignments must not expose a PDF action rejected by the student PDF endpoint'
);
const reviewOnlyActions = actionContext.renderOmrReviewActions(reviewOnlyExam);
for (const label of ['시험지 보기', '정답 보기', '해설 보기']) {
  assert(reviewOnlyActions.includes(label), `review-only assignments must retain ${label}`);
}
assert.match(
  actionContext.renderOmrPdfAction({ assignment_id: 'active-assignment', pdf_ready: true, pdf_status: 'ready' }),
  /PDF 다운로드/,
  'active assignments should retain the existing PDF download action'
);

assert(
  studentPortal.includes("if (!archiveFile.startsWith('MIXED:')) return true;") &&
    studentPortal.includes('mixed_payload_json') &&
    studentPortal.includes('function restoreMixedOmrPayload') &&
    studentPortal.includes('function openOmrReview') &&
    studentPortal.includes('if (!isOmrReviewAvailable(exam)) return') &&
    studentPortal.includes('const showReview = isOmrReviewAvailable(exam)') &&
    studentPortal.includes("showReview ? '' : 'review-hidden'") &&
    !studentPortal.includes('const showReview = isHighSchoolOmrExam(exam)') &&
    !studentPortal.includes('/(중등|중학교|중[1-3])/i.test(source)'),
  'OMR answer/solution review buttons should show for archive-backed middle and high school exams and restore mixed snapshots'
);

const repairHelper = studentPortal.match(/function repairIssuedStudentReviewSnapshot\(payload\) \{[\s\S]*?\n    \}/);
const restoreHelper = studentPortal.match(/function restoreMixedOmrPayload\(exam\) \{[\s\S]*?\n    \}/);
assert(repairHelper, 'issued review snapshot repair helper should exist');
assert(restoreHelper, 'mixed restore helper should exist');
const stored = new Map();
const context = {
  String,
  JSON,
  Array,
  localStorage: { setItem: (key, value) => stored.set(key, value) }
};
vm.createContext(context);
vm.runInContext(repairHelper[0] + '\n' + restoreHelper[0], context, { filename: 'student-portal-review-restore.js' });
assert.strictEqual(
  context.restoreMixedOmrPayload({ archive_file: 'exams/sample.js' }),
  true,
  'regular archive exams must bypass MIXED payload restoration'
);
assert.strictEqual(
  context.restoreMixedOmrPayload({
    archive_file: 'MIXED:sample-key',
    mixed_payload_json: JSON.stringify({ questions: [{ id: 1 }], meta: { title: 'sample' } })
  }),
  true,
  'mixed exams with a saved question snapshot must restore successfully'
);
assert.strictEqual(stored.has('mixedQuestions_sample-key'), true, 'mixed questions should be stored before opening the engine');
const originalSnapshot={questions:[{id:1,content:'원본 문항'}],meta:{sourceKind:'archive2-original',sourceArchiveFile:'sample.js',questionUids:['canonical-original']}};
assert.strictEqual(context.restoreMixedOmrPayload({assignment_id:'original-assignment',archive_file:'exams/sample.js',mixed_payload_json:JSON.stringify(originalSnapshot)}),true);
assert.deepStrictEqual(JSON.parse(stored.get('archive2Original_original-original-assignment')),originalSnapshot,'Archive 2.0 originals must restore the issued content and identity before opening the same engine');
const hyocheonLegacySolution='각 $a$에 대해 $b=2−|4−a|$를 계산하면 $(−2,−4),(−1,−3),(0,−2),(1,−1),(2,0),(3,1),(5,1),(6,0),(7,−1),(8,−2),(9,−3)$이다.\n따라서 구하는 순서쌍은 $(3,1),(2,0),(1,−1),(0,−2),(−1,−3),(−2,−4),(5,1),(6,0),(7,−1),(8,−2),(9,−3)$이다.';
const hyocheonSnapshot={questions:[{id:23,content:'원본 문항',answer:'원본 정답',solution:hyocheonLegacySolution,solutionImage:'assets/q23-solution.svg'}],meta:{sourceKind:'archive2-original',sourceArchiveFile:'original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',questionUids:['hyocheon-q23']}};
assert.strictEqual(context.restoreMixedOmrPayload({assignment_id:'hyocheon-existing',archive_file:'exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',mixed_payload_json:JSON.stringify(hyocheonSnapshot)}),true);
const repairedHyocheon=JSON.parse(stored.get('archive2Original_original-hyocheon-existing'));
assert(repairedHyocheon.questions[0].solution.includes('$(−2,−4),(−1,−3),(0,−2),(1,−1),(2,0),(3,1)$,\n$(5,1),(6,0),(7,−1),(8,−2),(9,−3)$'),'existing Hyocheon q23 calculation run should be split without changing values');
assert(repairedHyocheon.questions[0].solution.includes('$(3,1),(2,0),(1,−1),(0,−2),(−1,−3),(−2,−4)$,\n$(5,1),(6,0),(7,−1),(8,−2),(9,−3)$'),'existing Hyocheon q23 final answer run should be split without changing values');
assert.strictEqual(repairedHyocheon.questions[0].content,'원본 문항');
assert.strictEqual(repairedHyocheon.questions[0].answer,'원본 정답');
assert.strictEqual(repairedHyocheon.questions[0].solutionImage,'assets/q23-solution.svg');

assert.strictEqual(
  context.restoreMixedOmrPayload({ archive_file: 'MIXED:empty', mixed_payload_json: '' }),
  false,
  'mixed exams without a snapshot must fail closed'
);

assert(
  studentPortal.includes('const showActionArea = showReview || showPdf || isTeacherPreview || submitted || canInput') &&
    /<div class="omr-actions [^\n]*\$\{showReview \?/.test(studentPortal) &&
    studentPortal.includes("${showPdf ? renderOmrPdfAction(exam) : ''}") &&
    studentPortal.includes("${showReview ? renderOmrReviewActions(exam) : ''}") &&
    studentPortal.includes("(isTeacherPreview || submitted) && showReview && showPdf ? 'is-review-only' : ''") &&
    studentPortal.includes('틀린 번호 체크') &&
    studentPortal.includes('완료'),
  'OMR cards should render review actions and input status before and after submission'
);

assert(
  /background:\s*var\(--action-primary\)/.test(styleRule('.btn-primary')) &&
    /min-height:\s*44px/.test(styleRule('.btn')) &&
    /background:\s*var\(--warning-soft\);\s*color:\s*var\(--warning\)/.test(studentStyles) &&
    /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/.test(styleRule('.omr-actions')) &&
    /order:\s*-2/.test(styleRule('.omr-actions .exam-open')) &&
    /order:\s*-1/.test(styleRule('.omr-actions .omr-start')) &&
    /min-height:\s*48px/.test(styleRule('.omr-actions .omr-start')) &&
    /\.omr-actions\.review-hidden \.omr-start\s*\{\s*grid-column:\s*1\s*\/\s*-1/.test(studentStyles) &&
    /\.portal-omr-home-list, \.omr-list\s*\{\s*grid-template-columns:\s*1fr/.test(studentStyles),
  'shared exam cards should prioritize opening the exam and checking wrong numbers, retain 44px controls, and collapse the list on phones'
);

const cardRenderer = studentPortal.match(/function renderOmrExamCard\(exam\) \{[\s\S]*?\n    \}/);
const submissionStatus = studentPortal.match(/function getStudentPortalRecordedSubmission\(exam\) \{[\s\S]*?\n    \}/);
assert(cardRenderer && submissionStatus, 'exam card and recorded submission helpers should exist');
Object.assign(actionContext, { window: {}, isTeacherPreview: false, isLegacyMixedOmrReview: () => false });
vm.runInContext(submissionStatus[0] + '\n' + cardRenderer[0], actionContext);
for (const isSubmitted of [0, 1]) {
  const card = actionContext.renderOmrExamCard({ assignment_id: 'issued-exam', is_submitted: isSubmitted, pdf_ready: true });
  for (const label of ['시험지 보기', '정답 보기', '해설 보기', 'PDF 다운로드']) {
    assert(card.includes(label), `issued exams should retain ${label} with submitted=${isSubmitted}`);
  }
  assert.strictEqual(card.includes('onclick="renderOmrInput('), isSubmitted === 0, 'only an unsubmitted exam should offer OMR entry');
}
for (const guard of [{ is_submitted: undefined }, { is_submitted: 0, is_review_only: true }, { is_submitted: 0, is_cancelled: true }, { is_submitted: 0, is_replaced: true }]) {
  const card = actionContext.renderOmrExamCard({ assignment_id: 'guarded-exam', ...guard });
  assert(!card.includes('onclick="renderOmrInput('), 'unknown, review-only, cancelled, and replaced exams must not expose submission entry');
}
actionContext.isTeacherPreview = true;
assert(!actionContext.renderOmrExamCard({ assignment_id: 'preview', is_submitted: 0 }).includes('onclick="renderOmrInput('), 'teacher preview must remain read-only');

assert(
  mixedEngine.includes('function loadAssessmentPackFallback') &&
    mixedEngine.includes("p.get('packId')") &&
    mixedEngine.includes('assessment/assessment-packs-1sem.generated.js'),
  'mixed engine should recover assessment pack questions on student devices using packId'
);

console.log('student portal OMR review UI checks passed');
