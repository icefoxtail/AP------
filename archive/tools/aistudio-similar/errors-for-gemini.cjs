// Usage: node errors-for-gemini.cjs <check.json>      (check.json = check-judgment 의 --json 출력)
// 실패한 문항마다 한 줄씩, Gemini 같은 채팅에 그대로 붙여 보낼 되돌림 요청을 만든다.
//   qNN: CODE 메시지; CODE 메시지 고쳐서 그 문항만 다시 (문항마다 ```json 블록 하나)
// 시험지 단위 코드(ANSWER_DISTRIBUTION 등)는 맨 앞에 따로 적는다. FAIL 이 없으면 아무것도 쓰지 않고 종료 코드 0.
const fs = require('fs');
const f = process.argv[2];
if (!f) { console.error('Usage: node errors-for-gemini.cjs <check.json>'); process.exit(1); }
const r = JSON.parse(fs.readFileSync(f, 'utf8'));
const lines = [];
const exam = (r.examCodes || []).filter(c => c.severity === 'FAIL');
for (const c of exam) lines.push(`시험지: ${c.code} ${c.msg}`);
for (const it of r.items || []) {
  const fails = (it.codes || []).filter(c => c.severity === 'FAIL');
  if (!fails.length) continue;
  // 같은 코드가 여러 칸이면 메시지만 이어 붙이되 12개를 넘기지 않는다
  const msgs = fails.slice(0, 12).map(c => `${c.code} ${c.msg}`);
  if (fails.length > 12) msgs.push(`…외 ${fails.length - 12}건`);
  lines.push(`q${String(it.qid).padStart(2, '0')}: ${msgs.join('; ')} 고쳐서 그 문항만 다시`);
}
if (lines.length) console.log(lines.join('\n') + '\n(문항마다 ```json 블록 하나, 블록 밖 설명 없이)');
process.exit(0);
