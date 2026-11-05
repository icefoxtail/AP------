// 시험지 JS에서 4칸 판정에 쓰는 필드만 꺼낸다. 메타 필드는 꺼내지 않는다.
// node exam-items.cjs <archive/exams/... .js> [from] [to]   → 문항별 Q/C/S/IMG 출력
const fs = require('fs'), vm = require('vm');
function loadExam(file) {
  const ctx = { window: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx);
  const w = ctx.window;
  if (Array.isArray(w.questionBank)) return w.questionBank.map(q => ({ ordinal: q.id, stem: q.content || q.question || '', choices: Array.isArray(q.choices) ? q.choices : [], solution: q.solution || '', image: q.image || null }));
  if (w.examData && Array.isArray(w.examData.questions)) return w.examData.questions.map(q => ({ ordinal: q.number, stem: q.question || '', choices: Array.isArray(q.choices) ? q.choices : [], solution: q.solution || '', image: q.image || null }));
  throw new Error('UNKNOWN_EXAM_SCHEMA ' + file);
}
module.exports = { loadExam };
if (require.main === module) {
  const [f, a, b] = process.argv.slice(2);
  for (const q of loadExam(f)) {
    if (a && q.ordinal < +a) continue; if (b && q.ordinal > +b) continue;
    console.log(`=== ${q.ordinal}`); console.log('Q: ' + q.stem);
    if (q.choices.length) console.log('C: ' + q.choices.map((c, i) => `${i + 1}) ${c}`).join(' | '));
    console.log('S: ' + q.solution); if (q.image) console.log('IMG: ' + JSON.stringify(q.image));
  }
}
