window.questionBank = [
  {
    id: 1,
    layoutTag: 'grid',
    content: Array.from({ length: 12 }, (_, index) =>
      `${index + 1}번째 조건에서 함수 $f(x)=x^2+1$의 값과 주어진 수열의 관계를 설명하고 계산 과정을 쓰시오.`
    ).join(' '),
    choices: [],
    answer: '$1$',
    solution: '조건을 차례로 정리하여 계산한다.'
  },
  {
    id: 2,
    layoutTag: 'grid',
    content: '함수 $g(x)=2x+1$일 때 $g(3)$의 값을 구하시오.',
    choices: [],
    answer: '$7$',
    solution: '$g(3)=7$'
  },
  {
    id: 3,
    layoutTag: 'grid',
    content: '수열 $1, 3, 5, 7$의 다음 항을 구하시오.',
    choices: [],
    answer: '$9$',
    solution: '공차가 $2$이므로 다음 항은 $9$이다.'
  }
];
