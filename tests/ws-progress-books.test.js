// M8 진도·교재: 교재 저장은 한 벌이고 같은 자리에서 갱신한다는 결함 조건 검사.
// 개수가 아니라 결함(전체 재조회·모달 재오픈·초안 손실·라벨 없는 입력·12px 미만 글자 등)이 0인지 본다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const repoRoot = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(repoRoot, file), 'utf8');
const classroomSource = read('apmath/js/classroom.js');
const textbookSource = read('apmath/js/textbook.js');
const wsSource = read('apmath/js/ws-progress-books.js');
const themeCss = read('apmath/css/apms-theme-override.css');
const wsCss = read('apmath/css/ws-progress.css');
const indexHtml = read('apmath/index.html');

function functionBody(source, name) {
    const start = source.search(new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\(`));
    assert.ok(start >= 0, `${name} exists`);
    const next = source.slice(start + 10).search(/\n(?:async\s+)?function\s+\w+\s*\(/);
    return next >= 0 ? source.slice(start, start + 10 + next) : source.slice(start);
}

function makeContext() {
    const elements = new Map();
    const books = [
        { id: 'book-a', class_id: 'class-1', title: '학교부교재', status: 'active', start_date: '2026-03-01', end_date: null },
        { id: 'book-b', class_id: 'class-1', title: '개념서', status: 'active', start_date: '2026-03-01', end_date: null },
        { id: 'book-c', class_id: 'class-1', title: '끝낸 교재', status: 'completed', start_date: '2026-03-01', end_date: '2026-06-01' }
    ];
    const state = {
        db: {
            classes: [
                { id: 'class-1', name: '중3A', grade: '중3', is_active: 1 },
                { id: 'class-2', name: '중2B', grade: '중2', is_active: 0 },
                { id: 'class-3', name: '고1C', grade: '고1', is_active: 1 }
            ],
            class_textbooks: books.map(book => ({ ...book }))
        },
        ui: {
            classProgressModalMeta: { classId: 'class-1', date: '2026-09-17', gradeKey: '중3' },
            classProgressModalState: {
                classId: 'class-1',
                className: '중3A',
                date: '2026-09-17',
                gradeKey: '중3',
                books: books.filter(book => book.status !== 'hidden').map(book => ({ ...book })),
                allBooks: books.map(book => ({ ...book })),
                savedProgressRows: [],
                progressByTextbook: {
                    'book-a': { progressText: 'p.9~20', isChecked: true },
                    'book-b': { progressText: '', isChecked: false },
                    'book-c': { progressText: '', isChecked: false }
                },
                selectedTextbookId: 'book-a',
                manageSelectedId: '',
                groups: [],
                savedPaths: [],
                activeGroupKeys: [],
                courseAddOpen: false,
                courseAddNewTextbookOpen: false,
                inlineAddOpen: true,
                manageMode: false
            }
        }
    };
    const calls = [];
    const context = {
        console,
        window: { confirm: () => true },
        state,
        confirm: () => true,
        document: {
            getElementById(id) { return elements.get(id) || null; },
            querySelector() { return null; },
            querySelectorAll() { return []; }
        },
        apEscapeHtml(value) {
            return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        },
        api: {
            post: async (route, payload) => {
                calls.push({ method: 'POST', route, payload });
                return { success: true, item: { id: 'book-new', class_id: payload.class_id, title: payload.title, status: 'active', start_date: payload.start_date, end_date: null } };
            },
            patch: async (route, payload) => {
                calls.push({ method: 'PATCH', route, payload });
                const id = route.split('/').pop();
                const current = state.db.class_textbooks.find(book => book.id === id);
                return { success: true, item: { ...current, ...payload, end_date: payload.status === 'completed' ? '2026-09-17' : (payload.status === 'active' ? null : (payload.end_date ?? current.end_date)) } };
            },
            delete: async (route, id) => {
                calls.push({ method: 'DELETE', route, id });
                return { success: true };
            }
        },
        toast() {},
        loadData: async () => { calls.push({ method: 'LOAD_DATA' }); },
        _elements: elements,
        _calls: calls
    };
    vm.createContext(context);
    vm.runInContext(classroomSource, context, { filename: 'apmath/js/classroom.js' });
    vm.runInContext(textbookSource, context, { filename: 'apmath/js/textbook.js' });
    vm.runInContext(wsSource, context, { filename: 'apmath/js/ws-progress-books.js' });
    context.classProgressJsArg = value => JSON.stringify(String(value));
    return context;
}

const mutationCalls = context => context._calls.filter(call => call.method !== 'LOAD_DATA');

test('교재 추가: POST 한 번, 응답 행을 바로 반영하고 전체 loadData는 부르지 않는다. 입력하던 진도는 그대로다', async () => {
    const context = makeContext();
    context._elements.set('new-tb-class', { value: 'class-1' });
    context._elements.set('new-tb-title', { value: '새 교재' });
    context._elements.set('new-tb-start', { value: '2026-09-17' });
    const modalState = context.state.ui.classProgressModalState;

    await context.handleAddTextbook();

    assert.deepEqual(JSON.parse(JSON.stringify(mutationCalls(context))), [
        { method: 'POST', route: 'class-textbooks', payload: { class_id: 'class-1', title: '새 교재', start_date: '2026-09-17' } }
    ]);
    assert.equal(context._calls.some(call => call.method === 'LOAD_DATA'), false, '전체 재조회 없음');
    assert.equal(context.state.db.class_textbooks.some(book => book.id === 'book-new'), true);
    assert.equal(modalState.books.some(book => book.id === 'book-new'), true);
    assert.equal(modalState.selectedTextbookId, 'book-new', '방금 추가한 교재가 선택된다');
    assert.equal(modalState.inlineAddOpen, false, '추가 폼이 닫힌다');
    assert.deepEqual(JSON.parse(JSON.stringify(modalState.progressByTextbook['book-a'])), { progressText: 'p.9~20', isChecked: true }, '입력하던 진도 유지');
    assert.deepEqual(JSON.parse(JSON.stringify(modalState.progressByTextbook['book-new'])), { progressText: '', isChecked: false });
});

test('교재 추가 중복 눌림은 요청을 한 번만 보낸다', async () => {
    const context = makeContext();
    context._elements.set('new-tb-class', { value: 'class-1' });
    context._elements.set('new-tb-title', { value: '새 교재' });
    context._elements.set('new-tb-start', { value: '2026-09-17' });
    await Promise.all([context.handleAddTextbook(), context.handleAddTextbook()]);
    assert.equal(mutationCalls(context).filter(call => call.method === 'POST').length, 1);
});

test('상태 변경: payload는 예전 숨은 입력칸 방식과 같고, 숨김 교재는 진도 목록에서 빠지되 관리 목록에는 남는다', async () => {
    const context = makeContext();
    const modalState = context.state.ui.classProgressModalState;

    await context.submitClassProgressTextbookPatch('book-b', 'hidden');

    assert.deepEqual(JSON.parse(JSON.stringify(mutationCalls(context))), [
        { method: 'PATCH', route: 'class-textbooks/book-b', payload: { title: '개념서', start_date: '2026-03-01', end_date: '', status: 'hidden' } }
    ]);
    assert.equal(context._calls.some(call => call.method === 'LOAD_DATA'), false);
    assert.equal(modalState.books.some(book => book.id === 'book-b'), false, '진도 목록에서 빠짐');
    assert.equal(modalState.allBooks.find(book => book.id === 'book-b').status, 'hidden', '관리 목록에는 남음');
    assert.equal('book-b' in modalState.progressByTextbook, false);

    context._calls.length = 0;
    await context.submitClassProgressTextbookPatch('book-b', 'active');
    assert.deepEqual(JSON.parse(JSON.stringify(mutationCalls(context)[0].payload)), {
        title: '개념서', start_date: '2026-03-01', end_date: '', status: 'active', clear_end_date: true
    });
    assert.equal(modalState.books.some(book => book.id === 'book-b'), true, '복구하면 진도 목록에 다시 나타남');
});

test('이름·날짜 수정: 입력칸 값으로 PATCH하고 같은 자리에서 갱신한다', async () => {
    const context = makeContext();
    const modalState = context.state.ui.classProgressModalState;
    modalState.manageMode = true;
    context._elements.set('edit-tb-title', { value: '새 이름' });
    context._elements.set('edit-tb-start', { value: '2026-04-01' });

    await context.handlePatchTextbook('book-a', false);

    assert.deepEqual(JSON.parse(JSON.stringify(mutationCalls(context))), [
        { method: 'PATCH', route: 'class-textbooks/book-a', payload: { title: '새 이름', start_date: '2026-04-01' } }
    ]);
    assert.equal(modalState.books.find(book => book.id === 'book-a').title, '새 이름');
    assert.equal(context._calls.some(call => call.method === 'LOAD_DATA'), false);
});

test('교재 삭제: 확인에서 취소하면 요청이 없고, 확인하면 DELETE 한 번 + 같은 자리 갱신', async () => {
    const context = makeContext();
    const modalState = context.state.ui.classProgressModalState;
    context.confirm = () => false;
    await context.submitClassProgressTextbookDelete('book-a');
    assert.equal(mutationCalls(context).length, 0);

    context.confirm = () => true;
    await context.submitClassProgressTextbookDelete('book-a');
    assert.deepEqual(JSON.parse(JSON.stringify(mutationCalls(context))), [{ method: 'DELETE', route: 'class-textbooks', id: 'book-a' }]);
    assert.equal(context._calls.some(call => call.method === 'LOAD_DATA'), false);
    assert.equal(context.state.db.class_textbooks.some(book => book.id === 'book-a'), false);
    assert.equal(modalState.books.some(book => book.id === 'book-a'), false);
    assert.equal(modalState.selectedTextbookId, 'book-b', '선택하던 교재가 없어지면 다음 진행 중 교재로 옮긴다');
});

test('교재만 바뀌었으면 "저장 안 한 변경"이 아니다. 진도를 입력한 뒤라면 그대로 변경이다', async () => {
    const context = makeContext();
    const modalState = context.state.ui.classProgressModalState;
    context._elements.set('new-tb-class', { value: 'class-1' });
    context._elements.set('new-tb-title', { value: '새 교재' });
    context._elements.set('new-tb-start', { value: '2026-09-17' });
    // 진도 칸에 입력해 둔 상태를 "저장된 기준"으로 삼는다
    context.state.ui.classProgressModalMeta.draftBaseline = context.getClassProgressDraftFingerprint('');
    assert.equal(context.hasUnsavedClassProgressChanges(), false);

    await context.handleAddTextbook();
    assert.equal(context.hasUnsavedClassProgressChanges(), false, '교재 추가만으로 변경됨이 되지 않는다');

    modalState.progressByTextbook['book-b'] = { progressText: 'p.1', isChecked: true };
    assert.equal(context.hasUnsavedClassProgressChanges(), true, '진도를 바꾸면 변경됨');
});

test('교재 관리 입력칸을 고치다 만 상태는 저장 안 한 변경이다', () => {
    const context = makeContext();
    const modalState = context.state.ui.classProgressModalState;
    modalState.manageMode = true;
    context.state.ui.classProgressModalMeta.draftBaseline = context.getClassProgressDraftFingerprint('');
    context._elements.set('edit-tb-title', { value: '고친 이름', dataset: { orig: '학교부교재' } });
    assert.equal(context.hasUnsavedClassProgressChanges(), true);
    context._elements.set('edit-tb-title', { value: '학교부교재', dataset: { orig: '학교부교재' } });
    assert.equal(context.hasUnsavedClassProgressChanges(), false);
});

test('교재 관리 화면: 상태별 목록, 상세 편집, 라벨 없는 입력 0, 반 설정 교재는 편집 불가', () => {
    const context = makeContext();
    const modalState = context.state.ui.classProgressModalState;
    modalState.manageMode = true;
    modalState.allBooks.push({ id: 'book-h', class_id: 'class-1', title: '숨긴 교재', status: 'hidden', start_date: '2026-03-01' });

    const list = context.renderWsProgressManageList();
    assert.match(list, /진행 중/);
    assert.match(list, /완료/);
    assert.match(list, /숨김/);
    assert.equal((list.match(/ws-progress-manage-item__select/g) || []).length, 4);
    assert.match(list, /aria-pressed="true"/, '고른 교재 표시');

    const editor = context.renderClassProgressTextbookDetail(null);
    for (const [, id] of editor.matchAll(/<input[^>]*\sid="([^"]+)"/g)) {
        assert.match(editor, new RegExp(`<label[^>]*for="${id}"`), `${id} 입력칸에 라벨`);
    }
    assert.match(editor, /data-ws-textbook-save/);
    assert.match(editor, /data-ws-textbook-delete/);
    assert.match(editor, /교재 완료 처리/);

    modalState.manageSelectedId = 'book-c';
    const completedEditor = context.renderClassProgressTextbookDetail(null);
    assert.match(completedEditor, /id="edit-tb-end"/, '완료 교재는 종료일도 고친다');
    assert.match(completedEditor, /진행 중으로 복구/);

    modalState.allBooks = [{ id: 'fallback', title: '반 설정 교재', status: 'active', isFallback: true }];
    modalState.manageSelectedId = '';
    const fallbackEditor = context.renderClassProgressTextbookDetail(null);
    assert.doesNotMatch(fallbackEditor, /<input/);
    assert.match(fallbackEditor, /반 설정/);
});

test('서랍 교재관리: 모든 반 탭(숨김 반 맨 뒤) + 교재 관리 모드로 같은 작업 화면을 연다. 반 목록 모달 단계가 없다', () => {
    const context = makeContext();
    assert.deepEqual(Array.from(context.getWsProgressAllClasses(), cls => cls.id), ['class-3', 'class-1', 'class-2'], '(management.js 없이 이름순 예비 정렬) 숨김 반은 맨 뒤');
    const opened = [];
    context.openClassRecordModal = (...args) => { opened.push(args); };
    context.openGlobalTextbookManage();
    assert.equal(opened.length, 1);
    assert.equal(opened[0][0], 'class-3', '숨김 반이 아닌 첫 반');
    assert.deepEqual(JSON.parse(JSON.stringify(opened[0][2])), { mode: 'manage', classScope: 'all', textbookId: '', addOpen: false });

    // 모든 반 범위에서는 담당 반이 아닌 반도 탭에 올라온다
    context.state.ui.classProgressModalState.classScope = 'all';
    const tabs = context.renderClassProgressClassTabs('class-1');
    assert.match(tabs, /중3 · 중3A/);
    assert.match(tabs, /고1 · 고1C/);
    assert.match(tabs, /중2 · 중2B \(숨김\)/);
});

test('옛 교재 모달 3종은 새 교재 관리 모드를 여는 얇은 래퍼다', () => {
    const context = makeContext();
    const opened = [];
    context.openClassRecordModal = (...args) => { opened.push(args); };
    context.openTextbookManageModal();
    context.openAddTextbookModal();
    context.openEditTextbookModal('book-b');
    assert.equal(opened.length, 3);
    assert.equal(opened.every(args => args[2].mode === 'manage' && args[2].classScope === 'all'), true);
    assert.equal(opened[1][2].addOpen, true);
    assert.equal(opened[2][0], 'class-1');
    assert.equal(opened[2][2].textbookId, 'book-b');
    for (const name of ['openTextbookManageModal', 'openAddTextbookModal', 'openEditTextbookModal']) {
        assert.ok(functionBody(textbookSource, name).split('\n').length <= 6, `${name} 래퍼는 짧다`);
    }
});

test('결함 조건(소스): 저장 성공 경로에 전체 재조회·재오픈·모달 연쇄가 없다', () => {
    for (const name of ['handleAddTextbook', 'handlePatchTextbook', 'handleDeleteTextbook', 'patchTextbookWithPayload']) {
        const body = functionBody(textbookSource, name);
        assert.doesNotMatch(body, /openClassRecordModal|returnToPreviousManagementView|resumeClassProgress|showModal/, `${name}`);
        assert.doesNotMatch(body, /closeModal\(/, `${name}`);
    }
    // loadData는 "응답에 행이 없을 때"의 예비 경로에만 있다
    const loadDataLines = textbookSource.split('\n').filter(line => /\bloadData\b/.test(line));
    assert.ok(loadDataLines.length > 0 && loadDataLines.every(line => /else if \(typeof loadData === 'function'\)/.test(line) || /^\s*(\*|\/\/)/.test(line)), loadDataLines.join('\n'));
    assert.doesNotMatch(classroomSource, /classProgressInlineTextbookAction|pendingClassProgressCourseApply|resumeClassProgressAfterInlineTextbookAction/);
    assert.doesNotMatch(textbookSource + wsSource, /classProgressInlineTextbookAction|resumeClassProgressAfterInlineTextbookAction/);
    // 진도 작업 화면 구간(진도 모달 열기~저장)에는 showModalStep이 없다
    const section = classroomSource.slice(classroomSource.indexOf('function _getClassGradeKey'), classroomSource.indexOf('async function saveClassRecord'));
    assert.doesNotMatch(section, /showModalStep|replaceModalStep/);
    assert.equal((section.match(/showModal\(/g) || []).length, 2, '진행 중 표시와 본 화면 두 번만 — 같은 모달을 갈아 끼우는 호출 추가 없음');
});

test('진도 작업 화면은 공통 W 등급 부품 위에 있다', () => {
    const openFn = functionBody(classroomSource, 'openClassRecordModal');
    for (const token of ['apms-modal apms-modal--workspace', 'apms-workspace__bar', 'class="apms-workspace ', 'apms-workspace__list', 'apms-workspace__detail', 'apms-modal__actions']) {
        assert.ok(openFn.includes(token), token);
    }
    assert.doesNotMatch(openFn, /ap-class-progress-layout|ap-class-progress-footer/);
    // 취소 버튼은 헤더 하나만: 하단 액션줄에 따로 두지 않는다
    const actions = openFn.slice(openFn.indexOf('class="apms-modal__actions"'));
    assert.doesNotMatch(actions, />\s*취소\s*</);
    // 저장 함수·입력 ID는 그대로
    assert.match(openFn, /saveClassRecord\(\$\{cidArg\}/);
    assert.match(openFn, /id="record-special-note"/);
    assert.match(openFn, /id="record-progress-books-panel"/);
    assert.match(openFn, /id="record-progress-detail"/);
    // 특이사항은 라벨이 달린 입력칸이다
    assert.match(openFn, /<label class="apms-unified-label" for="record-special-note">/);
});

test('결함 조건(CSS): 진도 구간에 12px 미만 글자가 없고, 옛 껍데기 크기 규칙이 공통 W 부품과 싸우지 않는다', () => {
    const progress = themeCss.slice(themeCss.indexOf('/* Classroom progress modal'));
    const small = progress.match(/font-size:\s*(?:\d|1[01])(?:\.\d+)?px/g) || [];
    assert.deepEqual(small, []);
    assert.doesNotMatch(wsCss, /font-size:\s*(?:\d|1[01])(?:\.\d+)?px/);
    assert.doesNotMatch(themeCss, /#modal-content:has\(\.ap-class-progress-modal\)/);
    assert.doesNotMatch(themeCss, /ap-global-textbook|ap-class-progress-layout|ap-class-progress-footer|ap-class-progress-manage-row/);
    assert.doesNotMatch(wsCss + themeCss, /\.ap-class-progress-modal\s*\{/);
    assert.match(wsCss, /max-width:\s*600px/);
});

test('index.html: 새 파일은 정해진 자리에서 불러온다', () => {
    const textbookAt = indexHtml.indexOf('<script defer src="js/textbook.js"></script>');
    const wsAt = indexHtml.indexOf('<script defer src="js/ws-progress-books.js"></script>');
    assert.ok(textbookAt > 0 && wsAt === textbookAt + '<script defer src="js/textbook.js"></script>\n    '.length, 'textbook.js 바로 다음 줄');
    assert.ok(indexHtml.indexOf('css/ws-progress.css') > indexHtml.indexOf('css/apms-unified-modal.css'));
    assert.ok(indexHtml.indexOf('css/ws-progress.css') > indexHtml.indexOf('css/apms-theme-override.css'));
});
