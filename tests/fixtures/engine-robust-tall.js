window.examTitle = "engine-robust-tall";

// 문항 하나가 사다리(글자·그림 줄이기, 한 단 전체) 뒤에도 쪽에 안 들어가도 시험지·해설지 전체가 막히지 않는다
// (tests/archive-render-engine-robust.test.js 전용 합성 자료). 5번만 70줄짜리 본문이고 나머지는 평범한 문항이다.
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
const longBody = Array.from({ length: 70 }, (_, i) => `${i + 1}째 줄: 긴 조건이 이어집니다 $a_${i}+b_${i}=${i}$`).join('<br>');

window.questionBank = [
  base(1),
  base(2),
  base(3),
  base(4),
  { ...base(5), "content": `5번 문항입니다.<br>${longBody}<br>$x$의 값은?` },
  base(6),
  base(7),
  base(8)
];
