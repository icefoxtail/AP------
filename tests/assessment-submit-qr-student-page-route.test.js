const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 2026-11-01 사용자 결정: 시험지 끝 제출 QR은 기본 숨김, 선생님이 고를 때만(showSubmitQr=1) 표시,
// 연결은 고장 난 /check/ 가 아니라 학생 포털(apmath/student/?omr=1)로 한다.
// submitQr=1은 '반 출제 등록' 신호로 남기고 QR 표시와 분리했다(출제 흐름이 자동으로 submitQr=1을 붙인다).
// 해설·포털 QR(solQr, portalQr)은 그대로다.

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const engine = read('archive/engine.html');
const mixedEngine = read('archive/mixed_engine.html');
const adapter = read('archive/screen-runtime-adapter.js');
const studentPortal = read('apmath/student/index.html');
const checkPage = read('check/index.html');
const qrOmr = read('apmath/js/qr-omr.js');

function slice(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert(start >= 0, `missing ${startMarker}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert(end > start, `missing ${endMarker}`);
  return source.slice(start, end);
}

for (const [label, source] of [
  ['engine.html', engine],
  ['mixed_engine.html', mixedEngine],
]) {
  // 기본 숨김: osqr/submitQr 같은 다른 파라미터로 제출 QR이 자동으로 켜지지 않는다.
  const show = slice(source, 'function shouldShowSubmitQr() {', 'function ');
  assert(/showSubmitQr/.test(show) && !/osqr|'submitQr'/.test(show), `${label} must draw the submit QR only for showSubmitQr=1`);
  const state = slice(source, 'function getQrOutputState(', 'function syncQrOutputControls(');
  assert(/submit: params\.get\('showSubmitQr'\) === '1'/.test(state) && !/osqr/.test(state), `${label} popover state must follow showSubmitQr only`);
  assert(/shouldShowSubmitQr\(\)\)*\s*return;/.test(slice(source, 'function injectSubmitQrToLastExamPage(', 'targetPage')) && !/shouldRenderSubmitQr/.test(slice(source, 'function injectSubmitQrToLastExamPage(', 'targetPage')), `${label} must gate the drawing on the teacher choice`);

  // 연결: 항상 학생 포털. /check/ 로는 가지 않는다.
  const target = slice(source, 'function buildSubmitQrTargetUrl() {', 'function injectSubmitQrToLastExamPage');
  assert(target.includes("new URL('../apmath/student/', window.location.href)") && target.includes("url.searchParams.set('omr', '1')") && target.includes("url.searchParams.set('archiveFile'"), `${label} submit QR must go to the student portal`);
  assert(!source.includes("new URL('../check/'"), `${label} must not build /check/ links`);
  assert(source.includes('학생페이지로 이동') && !source.includes('반 정보 없음'), `${label} should label the submit QR as a student-page QR`);

  // 선생님만 보는 출력 설정 안의 선택지이고, 해설 QR 선택지는 그대로다.
  assert(/id="chk-submit-qr"/.test(source) && /id="chk-sol-qr"/.test(source), `${label} keeps both QR choices in the teacher output popover`);
  assert(/function shouldRenderSolutionQr\(/.test(source) && /function injectQrToLastExamPage\(/.test(source), `${label} keeps the solution QR`);
  assert(/body\.screen-fit-mode \.qr-output-wrap \{ display: none !important; \}/.test(source), `${label} hides the QR choice on student (fit=screen) views`);
  // 반 출제 등록 신호는 그대로 submitQr=1.
  assert(/function shouldRenderSubmitQr\(/.test(source), `${label} keeps the class assignment registration signal`);
}

// Archive 2.0 런타임 어댑터
assert(/showSubmitQr = p\.get\('showSubmitQr'\) === '1'/.test(adapter), 'adapter reads showSubmitQr');
assert(/renderSubmitQr: showSubmitQr && !preview && input\.mode === 'exam'/.test(adapter), 'adapter draws the submit QR only for the teacher choice');
assert(/renderSubmit: submit && !preview/.test(adapter) && /if \(!c\.qrState\.renderSubmit\) return;/.test(adapter), 'adapter keeps class assignment registration on submitQr=1');
assert(!/new URL\(hasClass \? '\.\.\/check\/'/.test(adapter) && /new URL\('\.\.\/apmath\/student\/', url\)/.test(adapter), 'adapter submit QR target is the student portal');
assert(/renderSolution: sol && !preview/.test(adapter) && /portalQr/.test(adapter), 'adapter keeps solution and portal QR');
assert(/url\.searchParams\.set\(key === 'submit' \? 'showSubmitQr' : 'solQr'/.test(adapter), 'adapter QR_CHANGE toggles showSubmitQr, not the registration signal');

// 학생 포털은 omr=1이면 OMR 목록을 바로 연다.
assert(
  studentPortal.includes('function shouldOpenOmrFromUrl()') &&
    studentPortal.includes("params.get('omr') === '1'") &&
    studentPortal.includes('await renderOmrExams();'),
  'student portal should open the OMR list automatically for QR links with omr=1'
);

// 이미 인쇄된 옛 QR(/check/?...)은 학생 포털로 넘어간다. 없는 ../js/check.js 를 불러 빈 화면이 되면 안 된다.
assert(!/<script[^>]+src=/.test(checkPage), 'check/index.html must not load external scripts (old ../js/check.js was a 404)');
assert(/href="\.\.\/apmath\/student\/\?omr=1"/.test(checkPage), 'check/index.html needs a no-JS link to the student portal');
{
  const replaced = [];
  vm.runInNewContext(checkPage.match(/<script>([\s\S]*?)<\/script>/)[1], {
    window: { location: { replace: url => replaced.push(url), href: '' } },
  });
  assert.deepStrictEqual(replaced, ['../apmath/student/?omr=1']);
}

// APMS QR 공유 카드는 남기고, 연결 주소만 학생 포털로 바꾼다. OMR 입력은 그대로.
assert(/function getStudentPortalBaseUrl\(/.test(qrOmr) && !/getCheckBaseUrl|new URL\('check\/'|\$\{path\}check\//.test(qrOmr), 'APMS QR share card must point at the student portal');
assert(/params\.set\('omr', '1'\)/.test(qrOmr) && /function openQrGenerator\(/.test(qrOmr), 'APMS QR share card stays and builds omr=1 links');
assert(/function openOmrInput\(/.test(qrOmr) && /function saveOmrInputBulk|async function saveOmrInputBulk/.test(qrOmr), 'APMS OMR input tools must remain');

console.log('assessment submit QR (default hidden, teacher choice, student portal route) checks passed');
