import fs from 'node:fs';
import vm from 'node:vm';
const file = process.argv[2];
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file, timeout: 5000 });
const questions = sandbox.window.questionBank || sandbox.window.questions;
if (!Array.isArray(questions)) throw new Error('QUESTION_BANK_MISSING');
for (let qid = 1; qid <= 24; qid += 1) {
  const q = questions.find(item => Number(item?.id) === qid);
  if (!q) throw new Error('QID_MISSING:' + qid);
  console.log(JSON.stringify({ qid, storedAnswer: q.answer }));
}
