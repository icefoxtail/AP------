const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const studentPortal = fs.readFileSync(path.join(root, 'apmath/student/index.html'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive/mixed_engine.html'), 'utf8');
const studentManifest = fs.readFileSync(path.join(root, 'apmath/student/manifest.json'), 'utf8');
const studentServiceWorker = fs.readFileSync(path.join(root, 'apmath/student/sw.js'), 'utf8');

assert(
  studentPortal.includes('<body class="student-portal-theme">') &&
    /<img class="brand-logo" src="\.\/icons\/icon-192\.png(?:\?v=[^"]+)?" alt="AP Math">/.test(studentPortal) &&
    studentPortal.includes('<div class="brand-main">AP Math OS</div>'),
  'student portal should keep the visible AP image brand mark'
);

assert(
    studentPortal.includes('--primary:#111827') &&
    studentPortal.includes('--primary-rgb:17,24,39') &&
    studentManifest.includes('"theme_color": "#F3F4F6"') &&
    /STUDENT_SW_VERSION\s*=\s*'2026\.\d{2}\.\d{2}\.\d+'/.test(studentServiceWorker) &&
    !/#4F46E5|#1A5CFF|#7C3AED|rgba\(26,92,255|rgba\(124,58,237/.test(studentPortal),
  'student portal should use a neutral charcoal theme and avoid blue/purple UI tokens'
);

assert(
  studentPortal.includes('.back-btn') &&
    studentPortal.includes('background:#F3F4F6') &&
    studentPortal.includes('color:#374151'),
  'student portal back/home button should use a visible neutral color on light OMR screens'
);

assert(
  studentPortal.includes('function buildOmrReviewUrl') &&
    studentPortal.includes('function isOmrReviewAvailable') &&
    studentPortal.includes('function renderOmrReviewActions') &&
    studentPortal.includes('packId') &&
    studentPortal.includes('시험지 보기') &&
    studentPortal.includes('정답 보기') &&
    studentPortal.includes('해설 보기'),
  'student portal OMR cards should expose exam, answer, and solution review actions'
);

assert(
  studentPortal.includes("return !!String(exam?.archive_file || '').trim();") &&
    studentPortal.includes('if (!isOmrReviewAvailable(exam)) return') &&
    studentPortal.includes('const showReview = isOmrReviewAvailable(exam)') &&
    studentPortal.includes("showReview ? '' : 'review-hidden'") &&
    !studentPortal.includes('const showReview = isHighSchoolOmrExam(exam)') &&
    !studentPortal.includes('/(중등|중학교|중[1-3])/i.test(source)'),
  'OMR answer/solution review buttons should show for archive-backed middle and high school exams'
);

assert(
  studentPortal.includes('<div class="omr-actions ${showReview ?') &&
    studentPortal.includes("${showReview ? renderOmrReviewActions(exam) : ''}") &&
    studentPortal.includes('입력하기') &&
    studentPortal.includes('제출 완료'),
  'OMR cards should render review actions and input status before and after submission'
);

assert(
  studentPortal.includes('.btn-primary { background:#111827') &&
    studentPortal.includes('.omr-status.pending { background:#F3F4F6; color:#4B5563; }') &&
    studentPortal.includes('.omr-actions {') &&
    studentPortal.includes('.omr-actions.review-hidden') &&
    studentPortal.includes('grid-template-columns:repeat(4,minmax(0,1fr))') &&
    studentPortal.includes('grid-template-columns:repeat(2,minmax(0,1fr))') &&
    studentPortal.includes('height:46px'),
  'OMR action colors and layout should avoid bright blue emphasis and keep four actions responsive'
);

assert(
  mixedEngine.includes('function loadAssessmentPackFallback') &&
    mixedEngine.includes("p.get('packId')") &&
    mixedEngine.includes('assessment/assessment-packs-1sem.generated.js'),
  'mixed engine should recover assessment pack questions on student devices using packId'
);

console.log('student portal OMR review UI checks passed');
