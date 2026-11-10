const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const studentPortal = fs.readFileSync(path.join(root, 'apmath/student/index.html'), 'utf8');
const studentExperience = fs.readFileSync(path.join(root, 'apmath/css/apms-student-experience.css'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive/mixed_engine.html'), 'utf8');
const studentManifest = JSON.parse(fs.readFileSync(path.join(root, 'apmath/student/manifest.json'), 'utf8'));
const studentServiceWorker = fs.readFileSync(path.join(root, 'apmath/student/sw.js'), 'utf8');

assert(
  studentPortal.includes('<body class="student-portal-theme">') &&
  /<img class="brand-logo" src="\.\/icons\/icon-192\.png(?:\?v=[^"]+)?" alt="AP Math">/.test(studentPortal) &&
  studentPortal.includes('<div class="brand-main">AP Math OS</div>'),
  'student portal should retain AP Math logo and name'
);
assert(
  studentPortal.includes('apms-student-experience.css?v=2026.11.11.1') &&
  studentExperience.includes('body.student-portal-theme') &&
  studentExperience.includes('--bg:#faf9f7') &&
  studentExperience.includes('--primary:#1c1917') &&
  studentExperience.includes('--border:#e8e5e0') &&
  studentExperience.includes('outline:2px solid #2563eb') &&
  studentManifest.theme_color === '#faf9f7' &&
  /STUDENT_SW_VERSION\s*=\s*'2026\.11\.11\.1'/.test(studentServiceWorker) &&
  !/#4F46E5|#1A5CFF|#7C3AED|rgba\(26,92,255|rgba\(124,58,237/.test(studentExperience),
  'effective student styles should use APMS warm neutrals and accessible focus color'
);
assert(
  studentExperience.includes('body.student-portal-theme .back-btn') &&
  studentExperience.includes('background:white') &&
  studentExperience.includes('color:#292524'),
  'back/home control should be visible on warm white'
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
  'exam, answer and solution modes must remain accessible'
);
const reviewActionsHelper = studentPortal.match(/function renderOmrReviewActions\(exam,\s*options = \{\}\) \{[\s\S]*?\n    \}/);
const pdfActionHelper = studentPortal.match(/function renderOmrPdfAction\(exam\) \{[\s\S]*?\n    \}/);
assert(reviewActionsHelper && pdfActionHelper,'review action helpers must exist');
const actionContext={
  String,escapeHtml:value=>String(value),
  isOmrReviewAvailable:()=>true,
  buildOmrReviewUrl:(_exam,mode)=>'/review?mode='+mode
};
vm.createContext(actionContext);
vm.runInContext(reviewActionsHelper[0]+'\n'+pdfActionHelper[0],actionContext,{
  filename:'student-portal-review-actions.js'
});
const reviewOnlyExam={assignment_id:'cancelled-assignment',is_review_only:true,pdf_ready:true,pdf_status:'ready'};
assert.strictEqual(actionContext.renderOmrPdfAction(reviewOnlyExam),'',
 'review-only assignments must not expose forbidden PDF action');
const reviewOnlyActions=actionContext.renderOmrReviewActions(reviewOnlyExam);
for(const label of ['시험지 보기','정답 보기','해설 보기'])
  assert(reviewOnlyActions.includes(label),'review-only paper must retain '+label);
assert.match(
 actionContext.renderOmrPdfAction({assignment_id:'active-assignment',pdf_ready:true,pdf_status:'ready'}),
 /PDF 다운로드/,'active paper retains PDF download'
);
assert(
 studentPortal.includes("if (!archiveFile.startsWith('MIXED:')) return true;") &&
 studentPortal.includes('mixed_payload_json') &&
 studentPortal.includes('function restoreMixedOmrPayload') &&
 studentPortal.includes('function openOmrReview') &&
 studentPortal.includes('const review=isOmrReviewAvailable(exam)') &&
 !studentPortal.includes('const showReview = isHighSchoolOmrExam(exam)') &&
 !studentPortal.includes('/(중등|중학교|중[1-3])/i.test(source)'),
 'exam reviews remain available to archive-backed middle and high papers'
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
 studentPortal.includes('const canSubmit=!isTeacherPreview&&!submitted&&!unknown') &&
 studentPortal.includes('<div class="omr-action-primary">') &&
 studentPortal.includes('<details class="omr-secondary-details">') &&
 studentPortal.includes('renderOmrPdfAction(exam)') &&
 studentPortal.includes('renderOmrReviewActions(exam,{omitExam:!submitted,omitSolution:submitted})') &&
 studentPortal.includes('틀린 번호 체크 · OMR') &&
 studentPortal.includes('해설로 복습') &&
 studentPortal.includes('제출 완료') &&
 studentPortal.includes('제출 상태 확인 필요'),
 'state-specific cards must preserve primary OMR and complete secondary review/PDF paths'
);
assert(
 studentExperience.includes('body.student-portal-theme .omr-no.wrong') &&
 studentExperience.includes('body.student-portal-theme .omr-actions') &&
 studentExperience.includes('grid-template-columns:repeat(5,minmax(0,1fr))') &&
 studentExperience.includes('min-height:44px') &&
 studentPortal.includes('aria-pressed="'+'$'+'{selected}"'),
 'wrong number selections must be touch-friendly, visible and announced'
);
assert(
 mixedEngine.includes('function loadAssessmentPackFallback') &&
 mixedEngine.includes("p.get('packId')") &&
 mixedEngine.includes('assessment/assessment-packs-1sem.generated.js'),
 'mixed engine recovers assessment pack questions on student devices'
);
console.log('student portal OMR review UI checks passed');
