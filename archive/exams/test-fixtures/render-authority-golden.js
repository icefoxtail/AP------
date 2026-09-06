window.examTitle = 'Render Authority Golden Fixture';
window.questionBank = [
  {
    id: 1,
    content: '다음 중 옳은 것을 고르시오.',
    choices: ['① $x+1$', '② $x-1$', '③ $x^2$'],
    choiceColumns: 3,
    answer: '③',
    solution: '항등식을 계산하면 정답은 ③이다.'
  },
  {
    id: 2,
    layoutTag: 'fullwidth',
    content: '다음 표의 합을 구하시오.<br><div class="question-table-wrap"><table><tr><th>$a$</th><th>$b$</th></tr><tr><td>$2$</td><td>$3$</td></tr></table></div>',
    choices: [],
    answer: '$5$',
    solution: '표의 두 수를 더하면 $2+3=5$이다.'
  },
  {
    id: 3,
    content: '보기에서 옳은 것을 모두 고르시오. ㄱ. $1$은 소수가 아니다.<br>ㄴ. $2$는 소수이다.<br>ㄷ. $4$는 소수이다.',
    choices: ['① ㄱ', '② ㄱ, ㄴ', '③ ㄴ, ㄷ', '④ ㄱ, ㄴ, ㄷ'],
    answer: '②',
    solution: 'ㄱ, ㄴ만 옳다.'
  },
  {
    id: 4,
    content: '[보기]<br>ㄱ. $x=1$<br>ㄴ. $x=2$<br>ㄷ. $x=3$<br><br>위 보기에서 옳은 것을 고르시오.',
    choices: ['① ㄱ', '② ㄴ', '③ ㄷ', '④ ㄱ, ㄴ'],
    answer: '④',
    solution: '보기의 조건을 모두 대입해 확인한다.'
  },
  {
    id: 5,
    content: '다음 그림의 넓이를 구하시오.',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90"%3E%3Crect x="20" y="15" width="110" height="55" fill="white" stroke="black"/%3E%3Ctext x="70" y="48" font-size="20"%3E6%3C/text%3E%3C/svg%3E',
    imageSize: 'medium',
    choices: ['① 6', '② 12', '③ 18', '④ 24'],
    answer: '②',
    solution: '가로와 세로의 곱으로 계산한다.'
  },
  {
    id: 6,
    content: '긴 해설과 해설 그림을 확인하시오.',
    choices: [],
    answer: '$7$',
    solution: '첫째, 조건을 정리한다. 둘째, 식을 변형한다. 셋째, 결과를 검산한다. 첫째, 조건을 정리한다. 둘째, 식을 변형한다. 셋째, 결과를 검산한다. 첫째, 조건을 정리한다. 둘째, 식을 변형한다. 셋째, 결과를 검산한다. 첫째, 조건을 정리한다. 둘째, 식을 변형한다. 셋째, 결과를 검산한다.',
    solutionImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="180" height="100"%3E%3Cline x1="20" y1="80" x2="160" y2="20" stroke="black"/%3E%3Ctext x="75" y="55" font-size="16"%3Ey=x%3C/text%3E%3C/svg%3E',
    solutionImageAlt: '직선 그래프',
    solutionImageCaption: '해설 그래프',
    solutionImageSize: 'medium'
  },
  {
    id: 7,
    layoutTag: 'subjective-2up',
    content: 'subjective-2up 배치 문항',
    choices: [],
    answer: '$2$',
    solution: '두 행을 점유하는 주관식 배치다.'
  },
  {
    id: 8,
    layoutTag: 'subjective-4up',
    content: 'subjective-4up 배치 문항',
    choices: [],
    answer: '$4$',
    solution: '한 행을 점유하는 주관식 배치다.'
  }
];
