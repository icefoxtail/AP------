// Usage: node merge-prompt.cjs "<G:\내 드라이브\Google AI Studio\<prompt title>>" "<out.js>"
// Reads an AI Studio prompt file (synced to Drive), takes every non-thought model turn,
// extracts the ```js block, collects questionBank objects from all chunks, and writes one JS file.
const fs = require('fs'), vm = require('vm');
const [src, out] = process.argv.slice(2);
const j = JSON.parse(fs.readFileSync(src, 'utf8'));
const chunks = j.chunkedPrompt.chunks.filter(c => c.role === 'model' && !c.isThought && c.text);
let title = null; const byId = new Map(); const answerLines = [];
for (const c of chunks) {
  const m = c.text.match(/```(?:js|javascript)?\s*\n([\s\S]*?)```/);
  let code = m ? m[1] : c.text;
  if (!/questionBank/.test(code)) { const ans = (code.match(/^\s*\/\/\s*정답:.*$/m) || [''])[0]; const body = code.replace(/^\s*\/\/.*$/mg, '').replace(/[\s,;\]]+$/, '').replace(/\}\s*$/, '}'); code = 'window.questionBank = [' + body + '\n];' + ans; }
  const w = {};
  try { vm.runInNewContext(code, { window: w }); } catch (e) { console.error('chunk parse fail:', e.message, code.slice(0, 80)); continue; }
  if (w.examTitle) title = w.examTitle;
  for (const q of w.questionBank || []) byId.set(Number(q.id), q); // later chunks overwrite (re-asks)
  const a = code.match(/\/\/\s*정답:.*$/m); if (a) answerLines.push(a[0]);
}
const qs = [...byId.values()].sort((a, b) => a.id - b.id);
const body = `window.examTitle = ${JSON.stringify(title)};\n\nwindow.questionBank = ${JSON.stringify(qs, null, 2)};\n`;
fs.writeFileSync(out, body);
const ids = qs.map(q => q.id);
console.log(JSON.stringify({ title, count: qs.length, ids: ids.join(','), answerLines }));
