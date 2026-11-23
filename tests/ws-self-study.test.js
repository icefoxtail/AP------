// 학생 자습 기록의 선생님 화면 계산(apmath/js/ws-self-study.js). 개수가 아니라 결함 조건을 본다:
// 안 한 학생이 맞게 나오는가, 다시 푼 뒤에도 틀린 문항이 학생 수로 모이는가, 이유별 인원이 맞는가,
// 기능 꺼짐·필드 없음·깨진 items_json에서 화면이 죽거나 거짓 숫자를 만들지 않는가.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const S = require('../apmath/js/ws-self-study.js');

const roster = [
    { sid: 's1', name: '가영', pending: false, wrongs: ['3', '9'] },
    { sid: 's2', name: '나리', pending: false, wrongs: ['9'] },
    { sid: 's3', name: '다은', pending: false, wrongs: ['5'] },
    { sid: 's4', name: '라온', pending: false, wrongs: [] },
    { sid: 's5', name: '마루', pending: true, wrongs: [] },
];
const item = (src, r, why = null) => ({ k: `w:${src}`, u: null, src, r, why, n: 1, t: '2026-11-23T01:00:00.000Z' });
const set = (student_id, kind, items, extra = {}) => ({
    student_id, assignment_id: 'a1', kind, total: items.length,
    correct: items.filter(i => i.r === 'c').length, wrong: items.filter(i => i.r === 'w' || i.r === 'u').length,
    updated_at: '2026-11-23T05:30:00.000Z', completed_at: null, items, ...extra,
});

test('안 한 학생: 오답이 있었는데 안 푼 학생만, 제출 안 한 학생과 만점자는 넣지 않는다', () => {
    const summary = S.summarizeClass({
        rows: roster, available: true,
        selfStudy: [set('s1', 'wrong', [item(3, 'c'), item(9, 'w', 'calc')])],
    });
    assert.deepEqual(summary.notDone, ['나리', '다은']);
    assert.equal(summary.targetCount, 3);
    assert.equal(summary.practicedCount, 1);
    assert.equal(S.summaryLine(summary), '3명 중 1명 다시 풀었음');
});

test('만점이어도 자습을 한 학생은 푼 사람 수에 들고, 유사 문항 인원은 따로 센다', () => {
    const summary = S.summarizeClass({
        rows: roster, available: true,
        selfStudy: [
            set('s4', 'similar', [item(1, 'c'), item(2, 'c')]),
            set('s1', 'wrong', [item(3, 'c'), item(9, 'c')]),
            set('s1', 'similar', [item(3, 'c')]),
        ],
    });
    assert.equal(summary.practicedCount, 2);
    assert.equal(summary.similarCount, 2);
    assert.equal(summary.targetCount, 4); // 오답 있는 s1·s2·s3 + 자습한 s4
    assert.equal(S.summaryLine(summary), '4명 중 2명 다시 풀었음 · 유사 문항 2명');
});

test('다시 풀고도 틀린 문항: 문항 번호별 학생 수, 모름은 따로, 많이 틀린 순', () => {
    const summary = S.summarizeClass({
        rows: roster, available: true,
        selfStudy: [
            set('s1', 'wrong', [item(3, 'c'), item(9, 'w', 'calc')]),
            set('s2', 'wrong', [item(9, 'u', 'concept')]),
            set('s3', 'wrong', [item(5, 'w', 'guess'), item(9, 'w', 'calc')]),
            // 같은 학생이 유사 문항에서도 원본 9번 계열을 틀려도 한 명으로 센다
            set('s1', 'similar', [{ k: 's:9:x.js:2', src: 9, r: 'w', why: 'calc', n: 1, t: '2026-11-23T01:00:00.000Z' }]),
        ],
    });
    assert.deepEqual(summary.stillWrong, [
        { no: 9, students: 3, unknown: 1 },
        { no: 5, students: 1, unknown: 0 },
    ]);
});

test('틀린 이유별 인원: 한 학생이 같은 이유로 여러 문항을 틀려도 한 명, 이유 없는 문항은 세지 않는다', () => {
    const summary = S.summarizeClass({
        rows: roster, available: true,
        selfStudy: [
            set('s1', 'wrong', [item(3, 'w', 'calc'), item(9, 'w', 'calc'), item(4, 'w', null)]),
            set('s2', 'wrong', [item(9, 'w', 'calc'), item(5, 'u', 'method')]),
            set('s3', 'wrong', [item(5, 'c', 'guess')]), // 맞힌 문항의 이유는 세지 않는다
        ],
    });
    assert.deepEqual(summary.why.map(w => [w.code, w.label, w.students]), [
        ['calc', '계산 실수', 2],
        ['method', '풀이 방법이 안 떠오름', 1],
    ]);
});

test('src가 없으면 키에서 문항 번호를 읽고, 못 읽으면 문항 목록에서 뺀다', () => {
    assert.equal(S.sourceNo({ k: 'w:12' }), 12);
    assert.equal(S.sourceNo({ k: 's:7:file.js:3' }), 7);
    assert.equal(S.sourceNo({ k: 'uid-abc', src: 4 }), 4);
    assert.equal(S.sourceNo({ k: 'uid-abc' }), 0);
    const summary = S.summarizeClass({
        rows: roster, available: true,
        selfStudy: [set('s1', 'wrong', [{ k: 'uid-abc', src: null, r: 'w', why: 'calc' }])],
    });
    assert.deepEqual(summary.stillWrong, []);
    assert.equal(summary.why[0].students, 1);
});

test('기능 꺼짐·필드 없음·형식 이상은 그리지 않는다(null, 빈 문자열)', () => {
    const base = { rows: roster };
    assert.equal(S.summarizeClass({ ...base, available: false, selfStudy: [] }), null);
    assert.equal(S.summarizeClass({ ...base, selfStudy: [] }), null);
    assert.equal(S.summarizeClass({ ...base, available: true }), null);
    assert.equal(S.summarizeClass({ ...base, available: true, selfStudy: 'x' }), null);
    assert.equal(S.summarizeClass(), null);
    assert.equal(S.renderClassHtml(null), '');
    assert.equal(S.renderBadgeHtml(null, 's1'), '');
    assert.equal(S.studentExamLine(undefined, 'a1'), null);
    assert.equal(S.studentExamLine([], 'a1'), null);
    assert.equal(S.renderStudentLineHtml(null, 'a1'), '');
});

test('기록 0건: 오답 있는 학생이 있으면 옅은 한 줄, 없으면 아무것도 그리지 않는다', () => {
    const none = S.summarizeClass({ rows: roster, available: true, selfStudy: [] });
    assert.equal(none.hasRecords, false);
    assert.equal(S.summaryLine(none), null);
    assert.match(S.renderClassHtml(none), /^<div class="wsx-ss wsx-ss--empty">자습 기록 없음<\/div>$/);
    const nobodyWrong = S.summarizeClass({ rows: [{ sid: 's4', name: '라온', pending: false, wrongs: [] }], available: true, selfStudy: [] });
    assert.equal(S.renderClassHtml(nobodyWrong), '');
});

test('깨진 items·알 수 없는 값·명단 밖 학생·열어만 보고 안 푼 세트로 숫자가 거짓이 되지 않는다', () => {
    const summary = S.summarizeClass({
        rows: roster, available: true,
        selfStudy: [
            null, 'x', { student_id: 's1' }, // kind 없음
            { student_id: 's1', assignment_id: 'a1', kind: 'wrong', total: 4, correct: 3, wrong: 1, items: '{깨진' }, // 숫자로 대신
            set('s9', 'wrong', [item(1, 'w', 'calc')]), // 이 시험 명단에 없는 학생
            set('s2', 'wrong', [item(9, null), item(3, null)]), // 열기만 하고 풀지 않음
            { student_id: 's3', assignment_id: 'a1', kind: 'wrong', total: 4, correct: 0, wrong: 1, items: [null, 5, [], item(5, 'w', 'nope')] }, // 이상한 원소·이유 코드
        ],
    });
    assert.equal(summary.practicedCount, 2); // s1, s3
    assert.equal(summary.byStudent.s1.text, '다시 풂 3/4');
    assert.equal(summary.byStudent.s2, undefined);
    assert.equal(summary.byStudent.s9, undefined);
    assert.deepEqual(summary.why, []);
    assert.deepEqual(summary.stillWrong, [{ no: 5, students: 1, unknown: 0 }]);
});

test('학생 줄 표시: "다시 풂 5/6"(맞음/푼 문항), 유사까지 풀었으면 이어 붙이고 안 했으면 없다', () => {
    const items6 = [item(1, 'c'), item(2, 'c'), item(3, 'c'), item(4, 'c'), item(5, 'c'), item(6, 'w', 'calc')];
    const summary = S.summarizeClass({
        rows: roster, available: true,
        selfStudy: [set('s1', 'wrong', items6), set('s1', 'similar', [item(1, 'c'), item(2, 'u')]), set('s2', 'wrong', [item(9, 'w')])],
    });
    assert.equal(summary.byStudent.s1.text, '다시 풂 5/6 · 유사 1/2');
    assert.equal(summary.byStudent.s2.text, '다시 풂 0/1');
    assert.equal(summary.byStudent.s3, undefined);
    assert.equal(S.renderBadgeHtml(summary, 's3'), '');
    assert.match(S.renderBadgeHtml(summary, 's1'), /class="wsx-ss-badge"[^>]*>다시 풂 5\/6 · 유사 1\/2</);
});

test('마크업: 요약 한 줄, 안 푼 학생·틀린 문항·이유가 들어가고 이름은 이스케이프된다', () => {
    const summary = S.summarizeClass({
        rows: roster.map(row => row.sid === 's2' ? { ...row, name: '<b>나리</b>' } : row), available: true,
        selfStudy: [set('s1', 'wrong', [item(3, 'c'), item(9, 'u', 'misread')])],
    });
    const html = S.renderClassHtml(summary, { open: true });
    assert.match(html, /<details class="wsx-ss" open/);
    assert.match(html, /3명 중 1명 다시 풀었음/);
    assert.match(html, /아직 안 푼 학생/);
    assert.match(html, /&lt;b&gt;나리&lt;\/b&gt;/);
    assert.doesNotMatch(html, /<b>나리/);
    assert.match(html, /9번[\s\S]*모름 1명[\s\S]*1명/);
    assert.match(html, /문제를 잘못 읽음 <b>1명<\/b>/);
    assert.doesNotMatch(S.renderClassHtml(summary, { open: false }), /<details class="wsx-ss" open/);
    // 다 맞혔으면 문항 목록 대신 한 줄 안내
    const allRight = S.summarizeClass({ rows: roster, available: true, selfStudy: [set('s1', 'wrong', [item(3, 'c'), item(9, 'c')])] });
    assert.match(S.renderClassHtml(allRight), /다시 푼 문항은 모두 맞혔습니다/);
    assert.doesNotMatch(S.renderClassHtml(allRight), /다시 풀고도 틀린 문항/);
});

test('학생 상세 성적 탭 한 줄: 시험(assignment)별, 날짜는 한국 시간, 집계 숫자만으로도 나온다', () => {
    const sets = [
        { student_id: 's1', assignment_id: 'a1', kind: 'wrong', total: 6, correct: 5, wrong: 1, updated_at: '2026-11-23T16:00:00.000Z' }, // KST 11/24
        { student_id: 's1', assignment_id: 'a1', kind: 'similar', total: 4, correct: 3, wrong: 1, updated_at: '2026-11-23T05:00:00.000Z' },
        { student_id: 's1', assignment_id: 'a2', kind: 'wrong', total: 2, correct: 0, wrong: 0, updated_at: '2026-11-22T05:00:00.000Z' }, // 푼 것 없음
    ];
    assert.equal(S.studentExamLine(sets, 'a1'), '11/24 자습 · 오답 다시 풀기 6문항 중 5개 맞음 · 유사 문항 4문항 중 3개 맞음');
    assert.equal(S.studentExamLine(sets, 'a2'), null);
    assert.equal(S.studentExamLine(sets, 'zzz'), null);
    assert.equal(S.studentExamLine(sets, ''), null);
    assert.match(S.renderStudentLineHtml(sets, 'a1'), /^<span class="ap-ss-line__text">11\/24 자습/);
});

test('학생 성적 탭 줄 끝 "주로 ..." : why_counts를 합쳐 가장 많은 이유 하나, 동률이면 둘까지, 없으면 생략', () => {
    const base = { student_id: 's1', assignment_id: 'a1', total: 4, correct: 1, wrong: 3, updated_at: '2026-11-23T05:00:00.000Z' };
    const zero = { calc: 0, misread: 0, concept: 0, method: 0, guess: 0 };
    const one = [{ ...base, kind: 'wrong', why_counts: { ...zero, concept: 2, calc: 1 } }];
    assert.match(S.studentExamLine(one, 'a1'), / · 주로 개념을 모름$/);
    // 세트(오답·유사)의 건수를 합친다: 계산 1+2=3 > 개념 2
    const merged = [...one, { ...base, kind: 'similar', why_counts: { ...zero, calc: 2 } }];
    assert.match(S.studentExamLine(merged, 'a1'), / · 주로 계산 실수$/);
    // 동률 둘
    const tie = [{ ...base, kind: 'wrong', why_counts: { ...zero, misread: 2, method: 2 } }];
    assert.match(S.studentExamLine(tie, 'a1'), / · 주로 문제를 잘못 읽음·풀이 방법이 안 떠오름$/);
    // 동률 셋 이상이어도 둘까지
    const three = [{ ...base, kind: 'wrong', why_counts: { calc: 1, misread: 1, concept: 1, method: 0, guess: 0 } }];
    assert.match(S.studentExamLine(three, 'a1'), / · 주로 계산 실수·문제를 잘못 읽음$/);
    // why_counts 없음(옛 서버)·전부 0·이상한 값: 생략, 나머지 줄은 그대로
    for (const counts of [undefined, null, zero, 'x', { calc: 'a', misread: -2 }]) {
        const line = S.studentExamLine([{ ...base, kind: 'wrong', why_counts: counts }], 'a1');
        assert.equal(line, '11/23 자습 · 오답 다시 풀기 4문항 중 1개 맞음', String(counts));
    }
    assert.equal(S.topWhy([]), '');
    assert.equal(S.topWhy([null, {}]), '');
});

test('시험 목록 표시: 자습 N명은 1명 이상일 때만, 값이 없거나 0이면 표시 없음', () => {
    assert.equal(S.examListBadgeText(6), '자습 6명');
    assert.equal(S.examListBadgeText(1), '자습 1명');
    for (const value of [0, undefined, null, '', 'x', -1, NaN]) assert.equal(S.examListBadgeText(value), '', String(value));
});

test('시험을 열 때 조회 계획: 목록이 0명이라고 한 id만 호출을 생략하고, 필드를 모르면 지금처럼 조회한다', () => {
    const assignments = [{ id: 'a1', self_study_students: 0 }, { id: 'a2', self_study_students: 3 }, { id: 'a3' }, { id: 'a4', self_study_students: 'x' }];
    assert.equal(S.listCount(assignments, 'a1'), 0);
    assert.equal(S.listCount(assignments, 'a2'), 3);
    assert.equal(S.listCount(assignments, 'a3'), null);
    assert.equal(S.listCount(assignments, 'a4'), null);
    assert.equal(S.listCount(assignments, 'zzz'), null);
    assert.equal(S.listCount(undefined, 'a1'), null);
    assert.deepEqual(S.planLoad(['a1'], assignments), { fetch: [], empty: ['a1'] });
    assert.deepEqual(S.planLoad(['a1', 'a2', 'a3', 'zzz'], assignments), { fetch: ['a2', 'a3', 'zzz'], empty: ['a1'] });
    // 옛 서버(필드 없음): 전부 조회
    assert.deepEqual(S.planLoad(['a1', 'a2'], [{ id: 'a1' }, { id: 'a2' }]), { fetch: ['a1', 'a2'], empty: [] });
    assert.deepEqual(S.planLoad(undefined, undefined), { fetch: [], empty: [] });
    // 0명으로 건너뛴 시험도 오답 있는 학생이 있으면 "자습 기록 없음" 한 줄은 그려진다
    const rows = [{ sid: 's1', name: '가영', pending: false, wrongs: ['3'] }];
    const summary = S.summarizeClass({ rows, available: true, selfStudy: [] });
    assert.match(S.renderClassHtml(summary), /자습 기록 없음/);
});

test('학생 화면과 같은 틀린 이유 문구를 쓴다', () => {
    const record = fs.readFileSync(path.join(root, 'apmath/student/self-study-record.js'), 'utf8');
    assert.deepEqual(Object.keys(S.WHY_LABELS), ['calc', 'misread', 'concept', 'method', 'guess']);
    assert.match(record, /calc: '계산 실수', misread: '문제를 잘못 읽음', concept: '개념을 모름', method: '풀이 방법이 안 떠오름', guess: '찍음'/);
});
