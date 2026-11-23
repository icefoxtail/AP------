window.examTitle = "engine-robust-html";

// HTML 태그 짝이 안 맞는 문항 둘 (tests/archive-render-html-budget.test.js 전용 합성 자료).
//  3번: 본문에 <div>를 열고 안 닫음      6번: 본문에 짝 없는 </div></span>
//  7번: 해설에 <span>·<b>를 열고 안 닫음  나머지: 평범한 문항 (수식 없는 부등호 글자 a<b는 태그가 아니다)
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
  { ...base(2), "content": "2번 문항입니다. a<b 이고 c>d 일 때 옳은 것은?" },
  { ...base(3), "content": "3번 문항입니다. <div style=\"border:1px solid #000\">조건 상자를 열고 닫지 않음 $x$의 값은?" },
  base(4),
  base(5),
  { ...base(6), "content": "6번 문항입니다. </div></span> 짝 없는 닫는 태그 $x+6=8$ 일 때 $x$의 값은?" },
  { ...base(7), "solution": "양변에서 <span><b>7을 빼면 $x=2$ 이다." },
  base(8)
];
