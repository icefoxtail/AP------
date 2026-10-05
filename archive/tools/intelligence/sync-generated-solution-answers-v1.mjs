import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const repo = process.env.AP_REPO || process.cwd();
const root = path.join(repo, 'archive', 'exams', 'original');
const files = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.isFile() && p.endsWith('.js')) files.push(p);
  }
}
walk(root);
let changed = 0;
for (const file of files.sort()) {
  const text = fs.readFileSync(file, 'utf8');
  const context = { window: {} };
  vm.runInNewContext(text, context, { filename: file, timeout: 5000 });
  const qs = context.window.questionBank || [];
  const answers = qs.map(q => String(q.answer ?? '').trim());
  let i = 0;
  const marker = text.indexOf('window.questionBank');
  if (marker < 0) continue;
  const head = text.slice(0, marker);
  const bank = text.slice(marker).replace(/결과는 (?:이다|원문 정답표로 확정한다)\./g, () => {
    const answer = answers[i++];
    return answer ? `결과는 ${answer}이다.` : '결과는 원문 정답표로 확정한다.';
  });
  if (bank !== text.slice(marker)) {
    fs.writeFileSync(file, head + bank, 'utf8');
    changed++;
  }
}
console.log(JSON.stringify({ changedFiles: changed }, null, 2));
