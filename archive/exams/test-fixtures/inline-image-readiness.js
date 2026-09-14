window.examTitle = 'Inline image readiness fixture';

window.questionBank = [
  {
    id: 1,
    standardCourse: '수학',
    standardUnitKey: 'M3-01',
    standardUnit: '수와 연산',
    content: '인라인 PNG는 발문과 보기 사이에 표시되어야 한다.<br><img src="assets/images/25_제일고_2학기_중간_고2_수학II/q9.png" alt="inline png" style="display:block;max-width:100%;height:auto;margin:8px auto;"><div class="note-box">ㄱ. 첫 번째 보기<br>ㄴ. 두 번째 보기<br>ㄷ. 세 번째 보기</div>',
    choices: ['ㄱ', 'ㄴ', 'ㄱ, ㄴ', 'ㄱ, ㄷ', 'ㄴ, ㄷ'],
    answer: '②',
    solution: '인라인 PNG의 로드 완료를 기다린다.'
  },
  {
    id: 2,
    standardCourse: '수학',
    standardUnitKey: 'M3-01',
    standardUnit: '수와 연산',
    content: '인라인 SVG도 문제 이미지로 준비되어야 한다.<br><img src="assets/images/test-fixtures/inline-image-readiness.svg" alt="inline svg">',
    choices: ['1', '2', '3', '4', '5'],
    answer: '①',
    solution: '인라인 SVG도 naturalWidth와 naturalHeight를 확인한다.'
  },
  {
    id: 3,
    standardCourse: '수학',
    standardUnitKey: 'M3-01',
    standardUnit: '수와 연산',
    image: 'assets/images/25_제일고_2학기_중간_고2_수학II/q9.png',
    content: 'q.image가 있는 legacy 문항은 content의 중복 이미지를 제거하고 필드 이미지 하나만 표시한다.<br><img src="assets/images/25_제일고_2학기_중간_고2_수학II/q9.png" alt="legacy duplicate">',
    choices: ['1', '2', '3', '4', '5'],
    answer: '①',
    solution: '중복 이미지는 하나만 유지한다.'
  },
  {
    id: 4,
    standardCourse: '수학',
    standardUnitKey: 'M3-01',
    standardUnit: '수와 연산',
    content: '이미지가 없는 일반 문항이다.',
    choices: ['1', '2', '3', '4', '5'],
    answer: '①',
    solution: '일반 문항은 기존과 같이 렌더한다.'
  }
];
