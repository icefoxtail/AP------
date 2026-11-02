// M7 클리닉 작업 화면(2026-11-02) 결함 조건 테스트. 개수가 아니라 결함을 검사한다.
// 화면 동작(반 전환 시 모달 유지, 취소가 한 번에 닫힘, 늦은 응답 가드)은 tests/apms-clinic-workspace-browser.cjs 가 실제 Chrome으로 본다.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const clinicPrint = read('apmath/js/clinic-print.js');
const core = read('apmath/js/core.js');
const shell = read('apmath/js/ws-clinic-shell.js');
const similar = read('apmath/js/ws-clinic-similar.js');
const wsCss = read('apmath/css/ws-clinic.css');
const printCss = read('apmath/css/apms-clinic-print.css');
const indexHtml = read('apmath/index.html');

function functionBody(source, signature) {
    const start = source.indexOf(signature);
    assert.ok(start >= 0, `${signature} 를 찾을 수 없다`);
    const open = source.indexOf('{', source.indexOf(')', start));
    let depth = 0;
    for (let i = open; i < source.length; i++) {
        if (source[i] === '{') depth++;
        else if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1);
    }
    throw new Error(`${signature} 의 끝을 찾을 수 없다`);
}

const checks = [];
function check(name, fn) { checks.push(name); fn(); }

check('작업 화면 구간에 모달 연쇄(showModalStep·replaceModalStep) 0, showModal 은 껍데기 한 곳뿐', () => {
    for (const [name, src] of [['ws-clinic-shell.js', shell], ['ws-clinic-similar.js', similar]]) {
        assert.equal(/showModalStep\(|replaceModalStep\(/.test(src), false, `${name}: 단계 모달을 쓰면 취소가 단계마다 반 화면으로 나간다`);
    }
    assert.equal((shell.match(/\bshowModal\(/g) || []).length, 1, '껍데기만 showModal 을 부른다(반·탭을 바꿔도 같은 모달 안에서 내용만 바뀐다)');
    assert.equal((similar.match(/\bshowModal\(/g) || []).length, 0, '유사문항 보기는 모달을 새로 열지 않는다');
});

check('옛 진입점은 얇은 래퍼로 남아 같은 작업 화면을 연다(2버튼 메뉴·반 고르기 모달 없음)', () => {
    assert.match(functionBody(clinicPrint, 'function openClinicCenter('), /wsClinicOpen\(classId\)/);
    assert.match(functionBody(clinicPrint, 'function openClinicClassPicker('), /openClinicCenter\(''\)/);
    assert.match(functionBody(core, 'async function openClinicSimilarForClass('), /wsClinicOpenSimilar\(classId\)/);
    for (const name of ['openClinicCenter', 'openClinicClassPicker', 'openClinicSimilarForClass', 'openClinicPrintCenter']) {
        assert.ok(clinicPrint.includes(`function ${name}`) || core.includes(`function ${name}`), `${name} 가 지워지면 호출처가 깨진다`);
    }
    assert.equal(/clinic-print-menu-|clinic-print-class-/.test(clinicPrint + printCss), false, '쓰지 않는 메뉴·반 고르기 마크업/CSS 가 남아 있다');
});

check('출력 센터는 모달을 먼저 열고(자리에서 로딩) 늦게 온 응답이 다른 반 화면을 덮지 못한다', () => {
    const body = functionBody(clinicPrint, 'async function openClinicPrintCenter(');
    const begin = body.indexOf('wsClinicBeginPrint(classId)');
    const firstAwait = body.indexOf('await clinicPrintRefreshClassAssignments');
    const guard = body.indexOf('wsClinicIsCurrent(wsToken)');
    const mount = body.indexOf('wsClinicMountPrint(wsToken');
    assert.ok(begin > 0 && begin < firstAwait, '껍데기(불러오는 중)를 API 대기보다 먼저 연다');
    assert.ok(guard > firstAwait && guard < mount, 'API 응답 뒤, 화면을 그리기 전에 최신 요청인지 확인한다');
    assert.match(shell, /function wsClinicIsCurrent\(token\)/);
    assert.match(shell, /Number\(token\) === wsClinicState\.seq/);
});

check('출력 센터 본문(입력 ID·출제/미리보기 버튼)은 그대로다', () => {
    const body = functionBody(clinicPrint, 'async function openClinicPrintCenter(');
    for (const id of ['clinic-print-summary', 'clinic-print-mode-cards', 'clinic-print-exam-list', 'clinic-print-student-list',
        'clinic-print-recommendation-section', 'clinic-print-recommendation-assessment-title', 'clinic-print-repeat-section',
        'clinic-print-header-title', 'clinic-print-header-subtitle', 'clinic-print-header-name', 'clinic-print-header-score',
        'clinic-print-header-date', 'clinic-print-header-sol', 'clinic-print-header-ans', 'clinic-print-preview-btn', 'clinic-print-submit-btn', 'clinic-print-preview-frame']) {
        assert.ok(body.includes(`id="${id}"`), `출력 센터 입력 ID ${id} 가 사라졌다`);
    }
    assert.ok(body.includes("onclick=\"clinicPrintSubmit('${safeClassIdForJs}')\"") && body.includes("onclick=\"clinicPrintPreview('${safeClassIdForJs}')\""));
    // 껍데기 파일이 없는 환경(단독 테스트)에서는 예전처럼 불러온 뒤 모달을 연다.
    assert.match(body, /showModal\('오답 클리닉 출력 센터', printCenterHtml\)/);
});

check('껍데기는 출제·출력 로직과 학생에게 가는 데이터를 건드리지 않는다', () => {
    for (const forbidden of ['api.post', 'api.patch', 'api.delete', 'fetch(', 'clinicPrintSubmit(', 'clinicPrintOpenStoredOrFallback', 'clinicPrintRefreshClassAssignments', 'localStorage']) {
        assert.equal(shell.includes(forbidden), false, `ws-clinic-shell.js 에 ${forbidden} 가 있다`);
    }
    assert.equal(/api\.(post|patch|put|delete)\(/.test(similar), false, 'ws-clinic-similar.js 는 서버에 쓰지 않는다');
});

check('반 전환·탭 전환 전에 저장 안 한 선택이 있으면 묻는다', () => {
    assert.match(functionBody(shell, 'function wsClinicConfirmLeave('), /isModalDirty\(\)/);
    assert.match(functionBody(shell, 'function wsClinicSwitchClass('), /wsClinicConfirmLeave\(\)/);
    assert.match(functionBody(shell, 'function wsClinicSwitchView('), /wsClinicConfirmLeave\(\)/);
});

check('아래쪽 취소 줄을 두지 않는다(헤더 취소 하나)', () => {
    assert.equal(/apms-modal__actions|apms-unified-actions/.test(shell + similar), false);
});

check('모든 인라인 onclick 이 정의된 전역 함수를 부른다', () => {
    const defined = new Set([...(shell + similar).matchAll(/^(?:async )?function (\w+)/gm)].map(m => m[1]));
    for (const m of (shell + similar).matchAll(/onclick="(\w+)\(/g)) assert.ok(defined.has(m[1]) || typeof globalThis[m[1]] === 'function', `${m[1]} 가 정의되어 있지 않다`);
});

check('새 화면 글자는 12px 이상, 출력 센터 CSS 에도 12px 미만 글자가 없다', () => {
    assert.equal(/font-size:\s*(?:[0-9]|1[01])(?:\.\d+)?px/.test(wsCss.replace(/font-size:9px|font-size:10px|font-size:11px|font-size: 9px|font-size: 10px|font-size: 11px/g, '')), false, 'ws-clinic.css 에 12px 미만 글자');
    assert.equal(/font-size:\s*(?:[0-9]|1[01])(?:\.\d+)?px/.test(printCss), false, 'apms-clinic-print.css 에 12px 미만 글자');
});

check('유사문항 보기는 늦게 온 응답을 버리고, 단원 선택에 서버 왕복이 없다', () => {
    assert.match(functionBody(similar, 'async function wsClinicLoadRecommendations('), /wsClinicSimilar !== data \|\| !wsClinicIsCurrent\(data\.token\)/);
    assert.match(functionBody(similar, 'async function wsClinicOpenSimilar('), /if \(!wsClinicIsCurrent\(token\)\) return false/);
    const select = functionBody(similar, 'function wsClinicSelectUnit(');
    assert.equal(/await |fetch\(|api\.|buildSimilarQuestionCandidates/.test(select), false, '단원을 고르는 데 서버 왕복이 있다');
    assert.equal(/font-size:\s*(?:[0-9]|1[01])px/.test(similar), false, '유사문항 보기에 12px 미만 인라인 글자');
});

check('바구니 삭제·비우기는 옛 모달(openClinicBasketByKey)을 다시 열지 않고 같은 자리에서 반영한다', () => {
    for (const name of ['function wsClinicRemoveCandidate(', 'function wsClinicClearBasket(', 'function wsClinicAddCandidate(']) {
        const body = functionBody(similar, name);
        assert.equal(/openClinicBasketByKey|showModal|setModalBody/.test(body), false, `${name} 가 모달을 다시 연다`);
        assert.match(body, /wsClinicRenderDetail\(true\)/);
    }
});

check('반 탭 표기: 공통 함수 apmsClassLabel 을 먼저 쓰고 학년을 겹쳐 쓰지 않는다', () => {
    const body = functionBody(shell, 'function wsClinicClassLabel(');
    assert.match(body, /typeof window\.apmsClassLabel === 'function'/);
    assert.match(body, /!name\.includes\(grade\)/);
    assert.equal(/' · '/.test(functionBody(shell, 'function wsClinicBarHtml(')), false, '탭에 "학년 · 이름"을 겹쳐 쓰지 않는다');
});

check('내 반이 아닌 활성 반(대강·보강)도 "다른 반" 선택 칸으로 열 수 있고, 선택 칸은 변경 감지에서 빠진다', () => {
    const bar = functionBody(shell, 'function wsClinicBarHtml(');
    assert.match(bar, /wsClinicGetAllActiveClasses\(\)/);
    assert.match(bar, /<select class="ws-clinic-otherclass" data-apms-nodirty/);
    assert.match(bar, /wsClinicClassLabel\(cls, all\)/);
    assert.match(functionBody(shell, 'function wsClinicPickOtherClass('), /wsClinicSwitchClass\(id\)/);
    assert.match(functionBody(shell, 'function wsClinicShow('), /wsClinicState\.extras\.push/);
    assert.match(wsCss, /\.ws-clinic-otherclass[\s\S]*?font-size: 16px/);
});

check('index.html 은 clinic-print.js 바로 뒤에 새 스크립트를, 클리닉 CSS 뒤에 새 CSS를 불러온다', () => {
    const order = ['js/clinic-print.js', 'js/ws-clinic-shell.js', 'js/ws-clinic-similar.js'].map(f => indexHtml.indexOf(`src="${f}`));
    assert.ok(order.every(i => i > 0) && order[0] < order[1] && order[1] < order[2], '스크립트 순서');
    assert.ok(indexHtml.indexOf('css/ws-clinic.css') > indexHtml.indexOf('css/apms-clinic-print.css'));
});

console.log(`apmath-clinic-workspace.test.js: ${checks.length}개 검사 통과`);
