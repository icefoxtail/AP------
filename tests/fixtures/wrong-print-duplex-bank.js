window.questionBank = [
  {
    id: 1,
    layoutTag: 'grid',
    content: '첫 번째 수신자의 홀수 packet을 만드는 장문 해설 검수 문항이다.',
    choices: [],
    answer: '$1$',
    solution: Array.from({ length: 72 }, (_, index) =>
      `${index + 1}. 이 해설 조각은 다음 열 또는 다음 쪽으로 안전하게 이어져야 하며 duplex blank 판단의 실제 렌더 근거가 된다.`
    ).join('<br><br>')
  },
  {
    id: 2,
    layoutTag: 'grid',
    content: '두 번째 수신자의 짧은 문항이다.',
    choices: [],
    answer: '$2$',
    solution: '두 번째 수신자 패킷은 legacy recipient composition으로 출력한다.'
  }
];
