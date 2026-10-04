window.examTitle = 'Broken inline image readiness fixture';

window.questionBank = [
  {
    id: 1,
    standardCourse: '수학',
    standardUnitKey: 'M3-01',
    standardUnit: '수와 연산',
    content: '이 문항은 존재하지 않는 문제 이미지를 가진다.<br><img src="assets/images/test-fixtures/does-not-exist.png" alt="broken inline image"><div class="note-box">이미지 로드 실패는 성공으로 봉인되지 않아야 한다.</div>',
    choices: ['1', '2', '3', '4', '5'],
    answer: '①',
    solution: 'broken inline image은 fail-closed 되어야 한다.'
  }
];
