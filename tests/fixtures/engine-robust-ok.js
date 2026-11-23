window.examTitle = "engine-robust-ok";

// 결함이 없는 같은 모양의 시험지: 자리 표시·알림 띠·진단이 하나도 생기지 않아야 한다 (tests/archive-render-engine-robust.test.js 전용 합성 자료).
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

window.questionBank = [1, 2, 3, 4, 5, 6, 7, 8].map(base);
