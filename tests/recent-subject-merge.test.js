'use strict';
// 출제 내역 과목 선택: 보이는 이름이 같은 옵션("기출c"·"기출" 모두 "기출")은 한 줄로 합치고, 그 줄을 고르면 두 값의 내역이 모두 걸린다.
// 저장된 값·주소 값(raw:기출c)과 요청의 subject 값은 바뀌지 않는다(표시와 거르기만).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { workspaceHarness, okJson } = require('./helpers/archive2-workspace-ui-harness.cjs');

const root = path.resolve(__dirname, '..');

function row(id, title, subjectKeys) {
  return {
    id, date: '2026-10-01', title, classId: 'class-a', className: '고1 A반',
    targetGrade: '고1', contentGrade: '고1', subjectKeys, subjectLabel: subjectKeys.join(' · '),
    questionCount: 10, recipientCount: 1, submittedCount: 0, pdfStatus: 'pending',
  };
}

function setup(fetcher) {
  const h = workspaceHarness(fetcher);
  vm.runInContext(fs.readFileSync(path.join(root, 'archive/exam-display-title.js'), 'utf8'), h.ctx);
  h.workspace.setClasses([{ id: 'class-a', name: '고1 A반', grade: '고1' }]);
  h.workspace.setView('recent');
  h.workspace.state.recentRows = [
    row('r-c', '기출c 시험', ['raw:기출c']),
    row('r-plain', '기출 시험', ['raw:기출']),
    row('r-other', '다른 과목 시험', ['raw:공통수학1']),
  ];
  return h;
}

test('보이는 이름이 같은 "기출c"와 "기출"은 선택 목록에서 한 줄이다', () => {
  const h = setup();
  const options = h.workspace.recentSubjectOptions();
  assert.deepEqual(Array.from(options, option => option.label).sort(), ['공통수학1', '기출']);
  const merged = options.find(option => option.label === '기출');
  assert.deepEqual(Array.from(merged.keys).sort(), ['raw:기출', 'raw:기출c']);
});

test('이미 고른 값이 raw:기출c로 남아 있어도 합쳐진 줄이 선택된 것으로 보인다', () => {
  const h = setup();
  for (const selected of ['raw:기출c', 'raw:기출']) {
    h.workspace.state.recentFilters.subject = selected;
    const options = h.workspace.recentSubjectOptions();
    assert.equal(options.filter(option => option.label === '기출').length, 1);
    assert.equal(options.find(option => option.label === '기출').value, selected, '고른 값 그대로가 선택 줄의 값이다');
    h.workspace.updateRecentResults();
    assert.match(h.node('recent-subject').innerHTML, new RegExp(`<option value="${selected}" selected>기출</option>`));
    assert.equal((h.node('recent-subject').innerHTML.match(/>기출</g) || []).length, 1);
  }
});

test('합쳐진 줄을 고르면 두 값의 내역이 모두 걸린다', () => {
  const h = setup();
  for (const selected of ['raw:기출c', 'raw:기출']) {
    h.workspace.state.recentFilters.subject = selected;
    const markup = h.workspace.recentAssignmentMarkup();
    assert.equal(markup.split('<h3 class="history-title">기출 시험</h3>').length - 1, 2, `${selected}: 기출c·기출 두 내역(제목은 둘 다 "기출 시험"으로 보인다)`);
    assert.ok(!markup.includes('다른 과목 시험'), `${selected}: 다른 과목은 걸러진다`);
  }
  h.workspace.state.recentFilters.subject = 'raw:공통수학1';
  const other = h.workspace.recentAssignmentMarkup();
  assert.ok(other.includes('다른 과목 시험') && !other.includes('기출 시험'));
});

test('요청은 고른 값을 그대로 보내고 두 값의 과목어를 함께 싣는다', async () => {
  const requests = [];
  const h = setup(async url => { requests.push(new URL(String(url), 'https://test.invalid')); return okJson({ assignments: [] }); });
  h.workspace.state.recentFilters.subject = 'raw:기출c';
  await h.workspace.loadRecent();
  const params = requests.at(-1).searchParams;
  assert.equal(params.get('subject'), 'raw:기출c', '요청의 subject 값은 바뀌지 않는다');
  assert.deepEqual(Array.from(params.getAll('subject_term')).sort(), ['기출', '기출c']);
  assert.equal(h.workspace.state.recentFilters.subject, 'raw:기출c', '저장된 값도 그대로다');
});

test('줄 제목은 "기출c"가 "기출"로 보이고, 제목 검색은 원문과 보이는 이름 둘 다에 걸린다(저장값은 그대로)', () => {
  const h = setup();
  const markup = h.workspace.recentAssignmentMarkup();
  assert.ok(!/기출c/.test(markup), '화면에는 기출c가 남지 않는다');
  assert.ok(markup.includes('<h3 class="history-title">기출 시험</h3>'));
  assert.equal(h.workspace.state.recentRows[0].title, '기출c 시험', '저장된 제목은 그대로');
  for (const query of ['기출c', '기출 시험']) {
    h.workspace.state.recentFilters.query = query;
    const found = h.workspace.recentAssignmentMarkup();
    assert.ok(found.includes('<h3 class="history-title">기출 시험</h3>'), `검색 "${query}"`);
    assert.ok(!found.includes('다른 과목 시험'), `검색 "${query}": 다른 줄은 걸러진다`);
  }
});
