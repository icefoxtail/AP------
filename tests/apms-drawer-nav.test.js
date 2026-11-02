// APMS 사이드바(서랍·레일) 내비게이션 결함 조건 테스트 (N1, 2026-11-02).
// 개수 대신 결함 조건만 본다: 항목 누락 0, 원내평가·OMR 하나, 원장 서랍 구성 불변(D1), "학급" 이름 0,
// 현재 위치(aria-current) 한 개, 레일(≥901px)에서 아이콘이 보이고 이름은 aria-label+title로 남는가.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const ui = read('apmath/js/ui.js');
const css = read('apmath/css/sidebar-foundation.css');
const index = read('apmath/index.html');

// ---------- ui.js 서랍 구역을 가짜 DOM 위에서 실제로 실행한다 ----------
function sliceBetween(src, begin, end) {
    const i = src.indexOf(begin);
    const j = src.indexOf(end, i + begin.length);
    assert.ok(i >= 0 && j > i, `boundary not found: ${begin}`);
    return src.slice(i, j);
}

function parseMenu(html) {
    const sections = [];
    const items = [];
    const re = /<div class="drw-section-label">([^<]*)<\/div>|<button type="button" class="drw-item ([^"]*)"([^>]*)onclick="([^"]*)">\s*<span class="drw-icon" aria-hidden="true">([\s\S]*?)<\/span>\s*<span class="drw-label">([^<]*)<\/span>/g;
    let m;
    while ((m = re.exec(html))) {
        if (m[1] !== undefined) { sections.push({ label: m[1], items: [] }); continue; }
        const attrs = m[3];
        const item = {
            section: sections.length ? sections[sections.length - 1].label : '',
            label: m[6],
            action: m[4],
            icon: m[5],
            nav: (attrs.match(/data-nav="([^"]*)"/) || [])[1] || '',
            ariaLabel: (attrs.match(/aria-label="([^"]*)"/) || [])[1] || '',
            title: (attrs.match(/title="([^"]*)"/) || [])[1] || ''
        };
        items.push(item);
        if (sections.length) sections[sections.length - 1].items.push(item);
    }
    return { sections, items };
}

function makeDrawer(role, view) {
    const code = sliceBetween(ui, 'const DRAWER_ICON_SVG = {', 'function ensureDrawerStyle()');
    const sandbox = {
        console,
        Date,
        appHistoryState: { currentView: view || null },
        apEscapeHtml: v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'),
        setInterval: () => 1,
        clearInterval: () => {},
        MutationObserver: undefined,
        toast() {},
        window: {},
        document: null
    };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    const html = vm.runInContext(`buildDrawerMenu(${JSON.stringify(role)})`, sandbox);
    const parsed = parseMenu(html);

    // 가짜 서랍: data-nav가 있는 항목만 aria-current를 받는다.
    const buttons = parsed.items.filter(i => i.nav).map(i => {
        const attrs = {};
        const cls = new Set();
        return {
            nav: i.nav,
            attrs, cls,
            getAttribute: n => (n === 'data-nav' ? i.nav : attrs[n] ?? null),
            setAttribute: (n, v) => { attrs[n] = v; },
            removeAttribute: n => { delete attrs[n]; },
            classList: { toggle: (c, on) => (on ? cls.add(c) : cls.delete(c)) }
        };
    });
    sandbox.document = {
        getElementById: id => (id === 'app-drawer' ? { querySelectorAll: () => buttons } : null)
    };
    sandbox.window = sandbox;
    return { sandbox, parsed, html, buttons, run: src => vm.runInContext(src, sandbox) };
}

const currentOf = buttons => buttons.filter(b => b.attrs['aria-current'] === 'page').map(b => b.nav);

const TEACHER_SECTIONS = [
    ['수업', ['시간표', '출석부', '진도·교재', '클리닉', '원내평가·OMR']],
    ['반·학생', ['반 관리', '학생 관리', '퇴원생']],
    ['기록', ['일지', '메모', '일정관리']],
    ['평가·리포트', ['리포트 센터', '학교성적']],
    ['자료', ['수업자료', '시험지 보관함', '도형·함수 실험실']],
    ['지원', ['시스템 동기화', '사용설명서']]
];

test('선생님 서랍: 묶음·순서가 계획대로이고 항목 누락·중복이 없다', () => {
    const { parsed } = makeDrawer('teacher');
    assert.deepEqual(parsed.sections.map(s => [s.label, s.items.map(i => i.label)]), TEACHER_SECTIONS);
    const labels = parsed.items.map(i => i.label);
    assert.equal(new Set(labels).size, labels.length, '같은 이름 항목 중복');
});

test('선생님 서랍: 이전 서랍의 모든 기능 진입이 그대로 남아 있다(이름만 바뀜)', () => {
    const { parsed } = makeDrawer('teacher');
    const byLabel = Object.fromEntries(parsed.items.map(i => [i.label, i.action]));
    const must = {
        '시간표': 'openLiveTimetable()',
        '출석부': 'openAttendanceLedger()',
        '진도·교재': 'openGlobalTextbookManage()',
        '클리닉': 'openClinicCenter()',
        '원내평가·OMR': "openExamWorkspace('')",
        '반 관리': 'openClassManageModal()',
        '학생 관리': 'openAddressBook()',
        '퇴원생': 'openWithdrawalReport()',
        '일지': 'openDailyJournalModal()',
        '메모': 'openTodoMemoModal()',
        '일정관리': 'openExamScheduleModal()',
        '리포트 센터': 'openReportCenterHome()',
        '학교성적': 'openSchoolExamLedger()',
        '수업자료': 'openStudyMaterialWrongCenter()',
        '시험지 보관함': 'assessment-mvp.html',
        '도형·함수 실험실': './playground/index.html',
        '시스템 동기화': 'openOperationMenu()',
        '사용설명서': 'openManualCenter()'
    };
    for (const [label, needle] of Object.entries(must)) {
        assert.ok(byLabel[label], `${label} 항목 누락`);
        assert.ok(byLabel[label].includes(needle), `${label} → ${needle} 호출이 없음`);
    }
});

test('원내평가와 OMR 입력은 "원내평가·OMR" 하나이고, 옛 별도 항목은 서랍에 없다', () => {
    for (const role of ['teacher', 'admin']) {
        const { parsed } = makeDrawer(role);
        const labels = parsed.items.map(i => i.label);
        assert.ok(!labels.includes('원내평가'), `${role}: 옛 "원내평가" 항목`);
        assert.ok(!labels.includes('OMR 입력'), `${role}: 옛 "OMR 입력" 항목`);
        assert.ok(!parsed.items.some(i => i.action.includes('openOmrInput')), `${role}: openOmrInput 호출`);
    }
    const teacher = makeDrawer('teacher').parsed.items.filter(i => i.label === '원내평가·OMR');
    assert.equal(teacher.length, 1);
    // 옛 OMR 화면 함수는 지우지 않는다(이력 복원 등 다른 호출처).
    assert.ok(/function openOmrInput\(/.test(read('apmath/js/qr-omr.js')));
});

test('원장 서랍: 항목 구성은 그대로이고(D1) 이름 통일만 적용됐다', () => {
    const { parsed } = makeDrawer('admin');
    assert.deepEqual(parsed.sections.map(s => [s.label, s.items.map(i => i.label)]), [
        ['학생 관리', ['학생 관리', '반 관리']],
        ['운영', ['일정관리', '시간표', '퇴원생', '진단평가']],
        ['수업 자료', ['아카이브', '도형·함수 실험실']],
        ['지원', ['관리', '시스템 동기화', '사용설명서']]
    ]);
    const labels = parsed.items.map(i => i.label);
    for (const banned of ['진도·교재', '교재관리', '클리닉', '원내평가·OMR', '리포트 센터']) {
        assert.ok(!labels.includes(banned), `원장 서랍에 ${banned} 가 들어가면 안 된다(D1)`);
    }
    const byLabel = Object.fromEntries(parsed.items.map(i => [i.label, i.action]));
    assert.ok(byLabel['반 관리'].includes('openClassManageModal()'));
    assert.ok(byLabel['퇴원생'].includes('openDischargedStudents()'));
    assert.ok(byLabel['관리'].includes('openAdminOperationMenu()'));
});

test('이름 통일: 서랍 어디에도 "학급"이 없고, 모든 항목에 아이콘·aria-label·title이 있다', () => {
    for (const role of ['teacher', 'admin']) {
        const { parsed } = makeDrawer(role);
        for (const item of parsed.items) {
            assert.ok(!item.label.includes('학급'), `${role}: ${item.label}`);
            assert.equal(item.ariaLabel, item.label, `${item.label}: aria-label`);
            assert.equal(item.title, item.label, `${item.label}: title`);
            assert.ok(/<svg[\s>]/.test(item.icon), `${item.label}: 아이콘 없음`);
        }
    }
    const ws = read('apmath/js/ws-student-class.js');
    assert.ok(/showModal\('반 관리'/.test(ws) && !/showModal\('학급관리'/.test(ws), '반 관리 작업 화면 제목');
});

test('아이콘: 레일에서 같은 묶음 안 항목끼리 아이콘이 겹치지 않고, 기본 점(default)이 없다', () => {
    for (const role of ['teacher', 'admin']) {
        const { parsed } = makeDrawer(role);
        for (const section of parsed.sections) {
            const icons = section.items.map(i => i.icon);
            assert.equal(new Set(icons).size, icons.length, `${role}/${section.label}: 아이콘 중복`);
        }
        for (const item of parsed.items) {
            assert.ok(!item.icon.includes('<circle cx="12" cy="12" r="4"/>'), `${role}/${item.label}: 기본 점 아이콘`);
        }
    }
});

test('현재 위치: 항목마다 고유 data-nav가 있고, 표시는 늘 한 개 이하이며 정확히 그 항목이다', () => {
    for (const role of ['teacher', 'admin']) {
        const { parsed, buttons, run } = makeDrawer(role);
        const navs = parsed.items.map(i => i.nav).filter(Boolean);
        assert.equal(new Set(navs).size, navs.length, `${role}: data-nav 중복`);
        // 모든 drawerMark 키가 실제 항목의 data-nav와 연결돼 있다
        for (const item of parsed.items) {
            const marks = [...item.action.matchAll(/drawerMark\('([^']+)'/g)].map(m => m[1]);
            for (const key of marks) assert.equal(key, item.nav, `${role}/${item.label}: drawerMark 키가 data-nav와 다름`);
            if (item.nav) assert.ok(marks.length >= 1, `${role}/${item.label}: 눌러도 현재 위치가 안 바뀜`);
        }
        assert.deepEqual(currentOf(buttons), [], '처음엔 표시 없음');
        for (const nav of navs) {
            run(`drawerMark(${JSON.stringify(nav)}, 'modal')`);
            assert.deepEqual(currentOf(buttons), [nav], `${role}: ${nav} 표시가 한 개가 아님`);
        }
    }
});

test('현재 위치: 본 화면(시간표·출석부·학교성적)은 currentView를 따라가고, 모달형은 닫히면 해제된다', () => {
    const t = makeDrawer('teacher', { type: 'attendance' });
    t.run('drawerRefreshCurrent()');
    assert.deepEqual(currentOf(t.buttons), ['attendance']);
    t.sandbox.appHistoryState.currentView = { type: 'schoolExam' };
    t.run('drawerRefreshCurrent()');
    assert.deepEqual(currentOf(t.buttons), ['school']);
    t.sandbox.appHistoryState.currentView = { type: 'dashboard' };
    t.run('drawerRefreshCurrent()');
    assert.deepEqual(currentOf(t.buttons), [], '대시보드에서는 표시 없음');

    // 모달형: 열렸다가(seen) 닫히면 해제
    const m = makeDrawer('teacher', { type: 'dashboard' });
    let open = false;
    m.sandbox.document.getElementById = id => {
        if (id === 'app-drawer') return { querySelectorAll: () => m.buttons };
        if (id === 'modal-overlay') return { classList: { contains: c => (c === 'show' ? open : c === 'hidden' ? !open : false) } };
        return null;
    };
    m.run("drawerMark('class', 'modal')");
    assert.deepEqual(currentOf(m.buttons), ['class']);
    open = true;
    m.run('drawerNavTick()');
    assert.deepEqual(currentOf(m.buttons), ['class'], '모달이 열려 있는 동안 유지');
    open = false;
    m.run('drawerNavTick()');
    assert.deepEqual(currentOf(m.buttons), [], '모달이 닫히면 해제');
});

test('CSS: 레일(≥901px)은 아이콘을 보이고 글자는 숨기며, 현재 위치·포커스·터치 44px 규칙이 있다', () => {
    const tail = css.slice(css.indexOf('[Navigation N1'));
    assert.ok(tail.length > 200, 'N1 구역');
    assert.ok(/#app-drawer:not\(\.drw-expanded\) \.drw-menu \{[^}]*display:block !important/.test(tail), '레일에서 메뉴를 다시 보임');
    assert.ok(/#app-drawer:not\(\.drw-expanded\) \.drw-label \{[^}]*display:none !important/.test(tail), '레일에서 글자 숨김');
    assert.ok(/@media \(min-width:901px\)/.test(tail));
    assert.ok(/\.drw-item\[aria-current="page"\]/.test(tail));
    assert.ok(/\.drw-item:focus-visible \{[^}]*outline:2px solid var\(--primary\)/.test(tail), '포커스 링');
    assert.ok(/min-height:44px/.test(tail));
    assert.ok(/body\.dark #app-drawer \.drw-item\[aria-current="page"\]/.test(tail), '다크 모드 현재 위치');
    assert.ok(/sidebar-foundation\.css\?v=/.test(index), 'index.html의 sidebar-foundation.css에 ?v= 캐시 갱신 표시');
});
