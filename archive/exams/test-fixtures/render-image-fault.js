window.examTitle = "render-image-fault";

// 그림 하나가 안 받아져도 시험지 전체를 막지 않는다 (tests/archive-render-image-fault.test.js 전용 합성 자료).
//  2번: 문제 그림(q.image) 404           4번: 본문 안 인라인 <img> 404
//  3번: 문제 그림 정상(같은 시험지의 다른 그림은 그대로 보인다)
//  5번: 해설 그림(q.solutionImage) 404   1·6번: 그림 없음
const stem = n => `${n}번 문항입니다. $x+${n}=${n + 2}$ 일 때 $x$의 값은?`;
const base = n => ({
  "id": n,
  "standardCourse": "수학",
  "standardUnitKey": "M3-01",
  "standardUnit": "수와 연산",
  "questionType": "객관식",
  "content": stem(n),
  "choices": ["$1$", "$2$", "$3$", "$4$", "$5$"],
  "answer": "②",
  "solution": `양변에서 $${n}$을 빼면 $x=2$ 이므로 정답은 ②이다.\n\n검산: $2+${n}=${n + 2}$ 이므로 조건을 만족한다.`
});

window.questionBank = [
  base(1),
  { ...base(2), "image": "assets/images/test-fixtures/missing-image-q2.png" },
  { ...base(3), "image": "assets/images/test-fixtures/inline-image-readiness.svg" },
  { ...base(4), "content": "4번 문항입니다. 그림을 보고 답하시오.<br><img src=\"assets/images/test-fixtures/missing-inline-q4.png\" alt=\"missing inline\"><br>$x+4=6$ 일 때 $x$의 값은?" },
  { ...base(5), "solutionImage": "assets/images/test-fixtures/missing-solution-q5.png" },
  base(6)
];
