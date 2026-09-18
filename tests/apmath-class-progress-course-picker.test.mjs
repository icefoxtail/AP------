import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const classroomSource = fs.readFileSync(path.join(repoRoot, 'apmath/js/classroom.js'), 'utf8');
const textbookSource = fs.readFileSync(path.join(repoRoot, 'apmath/js/textbook.js'), 'utf8');

function makeGroup(curriculumKey, level, courseKey, courseLabel = courseKey) {
    const key = [curriculumKey, level, courseKey].join('|');
    return {
        key,
        curriculumKey,
        level,
        courseKey,
        courseLabel,
        gradeKey: level === 'middle' ? '중1' : '고1',
        items: [{
            canonicalPathKey: `${key}|단원|소단원`,
            curriculumKey,
            level,
            courseKey,
            l1: '단원',
            l2: '소단원'
        }]
    };
}

const groups = [
    makeGroup('2015', 'high', '수학 하'),
    makeGroup('2022', 'middle', 'M1-1', '중1 과정 · 1학기'),
    makeGroup('2022', 'middle', 'M1-2', '중1 과정 · 2학기'),
    makeGroup('2022', 'middle', 'M2-1', '중2 과정 · 1학기'),
    makeGroup('2022', 'middle', 'M2-2', '중2 과정 · 2학기'),
    makeGroup('2022', 'middle', 'M3-1', '중3 과정 · 1학기'),
    makeGroup('2022', 'middle', 'M3-2', '중3 과정 · 2학기'),
    makeGroup('2022', 'high', '공통수학1'),
    makeGroup('2022', 'high', '공통수학2'),
    makeGroup('2022', 'high', '대수'),
    makeGroup('2022', 'high', '미적분I'),
    makeGroup('2022', 'high', '미적분II'),
    makeGroup('2022', 'high', '확률과통계', '확률과 통계'),
    makeGroup('2022', 'high', '기하')
];

function makeContext(gradeKey = '중1') {
    const elements = new Map();
    const state = {
        db: { classes: [{ id: 'class-1', name: `${gradeKey} 테스트반` }] },
        ui: {
            classProgressModalMeta: { classId: 'class-1', date: '2026-09-17', gradeKey },
            classProgressModalState: {
                classId: 'class-1',
                className: `${gradeKey} 테스트반`,
                date: '2026-09-17',
                gradeKey,
                books: [
                    { id: 'book-a', class_id: 'class-1', title: '학교부교재', status: 'active', start_date: '2026-03-01' },
                    { id: 'book-b', class_id: 'class-1', title: '개념서', status: 'active', start_date: '2026-03-01' }
                ],
                allBooks: [],
                progressByTextbook: {
                    'book-a': { progressText: '', isChecked: false },
                    'book-b': { progressText: '', isChecked: false }
                },
                selectedTextbookId: 'book-a',
                groups,
                savedPaths: [],
                activeGroupKeys: [],
                courseAddOpen: true,
                courseAddShowAll: false,
                courseAddSelectedGroupKey: '',
                courseAddBookIds: [],
                courseAddNewTextbookOpen: false
            }
        }
    };
    const context = {
        console,
        window: {},
        state,
        document: {
            getElementById(id) { return elements.get(id) || null; },
            querySelector() { return null; },
            querySelectorAll(selector) {
                if (selector === '.ap-class-progress-course-book-choice:checked') return context._courseBookCheckboxes || [];
                return [];
            }
        },
        apEscapeHtml(value) {
            return String(value ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },
        _elements: elements,
        _courseBookCheckboxes: [],
        _addHandlerCalls: []
    };
    vm.createContext(context);
    vm.runInContext(classroomSource, context, { filename: 'apmath/js/classroom.js' });
    vm.runInContext(textbookSource, context, { filename: 'apmath/js/textbook.js' });
    return context;
}

function optionKeys(html) {
    return Array.from(html.matchAll(/<option value="([^"]*)"/g))
        .map(match => match[1])
        .filter(Boolean);
}

test('course options match each grade, hide 2015, remove recommendation copy, and expand for middle grades', () => {
    const expectedByGrade = {
        중1: ['M1-1', 'M1-2', 'M2-1', 'M2-2', 'M3-1', 'M3-2'],
        중2: ['M2-1', 'M2-2', 'M3-1', 'M3-2', '공통수학1', '공통수학2'],
        중3: ['M3-1', 'M3-2', '공통수학1', '공통수학2', '대수', '미적분I', '미적분II', '확률과통계', '기하'],
        고1: ['공통수학1', '공통수학2', '대수', '미적분I', '미적분II', '확률과통계', '기하'],
        고2: ['대수', '미적분I', '미적분II', '확률과통계', '기하'],
        고3: ['대수', '미적분I', '미적분II', '확률과통계', '기하']
    };
    const keyFor = courseKey => groups.find(group => group.curriculumKey === '2022' && group.courseKey === courseKey).key;

    for (const [gradeKey, expectedCourseKeys] of Object.entries(expectedByGrade)) {
        const context = makeContext(gradeKey);
        const html = context.renderClassProgressCourseAddControl();
        const expected = expectedCourseKeys.map(keyFor);
        assert.deepEqual(optionKeys(html), expected, `${gradeKey} 기본 과정 범위`);
        assert.doesNotMatch(html, /2015|추천/, `${gradeKey} 신규 선택에서 2015/추천 표시 제거`);
        assert.equal(html.includes('교육과정 더보기'), gradeKey.startsWith('중'), `${gradeKey} 더보기 노출`);
        assert.match(html, /class="ap-class-progress-course-book-choice"/);
    }

    const middleContext = makeContext('중1');
    middleContext.toggleClassProgressCourseCatalog();
    const expandedHtml = middleContext.renderClassProgressCourseAddControl();
    assert.deepEqual(optionKeys(expandedHtml), groups.filter(group => group.curriculumKey === '2022').map(group => group.key));
    assert.doesNotMatch(expandedHtml, /2015|추천/);
});

test('existing saved 2015 course panels remain visible when the new picker excludes 2015', () => {
    const context = makeContext('고1');
    const modalState = context.state.ui.classProgressModalState;
    modalState.activeGroupKeys = ['2015|high|수학 하'];
    modalState.groups = groups;
    const detail = context.renderClassProgressTextbookDetail(modalState.books[0]);
    const picker = context.renderClassProgressCourseAddControl();
    assert.match(detail, /data-progress-group="2015\|high\|수학 하"/);
    assert.doesNotMatch(picker, /2015/);
    assert.doesNotMatch(detail, /추천/);
});

test('applying a selected course and active books adds a course card and collapses the picker', () => {
    const context = makeContext('중1');
    const modalState = context.state.ui.classProgressModalState;
    const key = '2022|middle|M1-1';
    context._courseBookCheckboxes = [{ value: 'book-a' }, { value: 'book-b' }];
    const inserted = [];
    let emptyRemoved = false;
    const root = {
        querySelectorAll() { return []; },
        querySelector() { return { remove() { emptyRemoved = true; } }; },
        insertAdjacentHTML(_position, html) { inserted.push(html); }
    };
    const control = { outerHTML: '' };
    const detail = { innerHTML: '' };
    context._elements.set('record-progress-course-panels', root);
    context._elements.set('record-progress-course-add', control);
    context._elements.set('record-progress-course-select', { value: key, options: [{ value: key, disabled: false }] });
    context._elements.set('record-progress-detail', detail);

    context.applyClassProgressCourseAndTextbooks();

    assert.equal(emptyRemoved, true);
    assert.match(inserted[0], /data-progress-group="2022\|middle\|M1-1"/);
    assert.deepEqual(Array.from(modalState.activeGroupKeys), [key]);
    assert.equal(modalState.progressByTextbook['book-a'].isChecked, true);
    assert.equal(modalState.progressByTextbook['book-b'].isChecked, true);
    assert.equal(modalState.courseAddOpen, false);
    assert.match(detail.innerHTML, /onclick="toggleClassProgressCourseAdd\(\)"/);
});

test('inline textbook registration reuses handleAddTextbook and carries the apply draft through modal reopen', async () => {
    const context = makeContext('고1');
    const modalState = context.state.ui.classProgressModalState;
    const key = '2022|high|공통수학2';
    modalState.courseAddSelectedGroupKey = key;
    context._courseBookCheckboxes = [{ value: 'book-a' }];
    modalState.courseAddNewTextbookOpen = true;
    context._elements.set('new-tb-class', { value: 'class-1' });
    context._elements.set('new-tb-title', { value: '개념원리 공통수학2' });
    context._elements.set('new-tb-start', { value: '2026-09-17' });
    context.state.db.class_textbooks = [];
    context.state.ui.modalReturnView = { type: 'classDetail', classId: 'class-1' };
    context.api = {
        post: async (path, payload) => {
            context._addHandlerCalls.push({ path, payload, action: context.state.ui.classProgressInlineTextbookAction });
            return { success: true, item: { id: 'book-new', class_id: 'class-1', title: payload.title, status: 'active', start_date: payload.start_date } };
        }
    };
    context.loadData = async () => {
        context.state.db.class_textbooks.push({ id: 'book-new', class_id: 'class-1', title: '개념원리 공통수학2', status: 'active', start_date: '2026-09-17' });
    };
    context.toast = () => {};
    let reopened = null;
    context.openClassRecordModal = (classId, date) => { reopened = [classId, date]; };

    await context.applyClassProgressCourseAndTextbooks();

    assert.equal(context._addHandlerCalls.length, 1);
    assert.equal(context._addHandlerCalls[0].path, 'class-textbooks');
    assert.equal(JSON.stringify(context._addHandlerCalls[0].payload), JSON.stringify({ class_id: 'class-1', title: '개념원리 공통수학2', start_date: '2026-09-17' }));
    assert.equal(context._addHandlerCalls[0].action.mode, 'add');
    assert.equal(context._addHandlerCalls[0].action.courseApplyDraft.groupKey, key);
    assert.deepEqual(Array.from(context._addHandlerCalls[0].action.courseApplyDraft.selectedBookIds), ['book-a']);
    assert.equal(context._addHandlerCalls[0].action.courseApplyDraft.newTextbookTitle, '개념원리 공통수학2');
    assert.deepEqual(reopened, ['class-1', '2026-09-17']);
    assert.equal(context.state.ui.pendingClassProgressCourseApply.groupKey, key);
    assert.equal(context.state.ui.pendingClassProgressCourseApply.addedTextbookId, 'book-new');

    const progressByTextbook = {
        'book-a': { progressText: '', isChecked: false },
        'book-new': { progressText: '', isChecked: false }
    };
    const activeKeys = context.applyPendingClassProgressCourseApply(
        'class-1',
        '2026-09-17',
        groups,
        new Set(),
        progressByTextbook,
        context.state.db.class_textbooks
    );
    assert.equal(activeKeys.has(key), true);
    assert.equal(progressByTextbook['book-a'].isChecked, true);
    assert.equal(progressByTextbook['book-new'].isChecked, true);
    assert.equal(context.state.ui.pendingClassProgressCourseApply, null);
});
