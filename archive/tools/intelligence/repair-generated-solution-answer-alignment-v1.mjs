import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const repo = process.env.AP_REPO || process.cwd();
const root = path.join(repo, 'archive/exams/original');

function objectsInBank(text) {
  const marker = text.indexOf('window.questionBank');
  const start = text.indexOf('[', marker);
  const out = [];
  let depth = 0, begin = -1, quoted = false, escaped = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === '"') quoted = false;
      continue;
    }
    if (c === '"') { quoted = true; continue; }
    if (c === '{') { if (depth === 0) begin = i; depth++; }
    else if (c === '}') {
      depth--;
      if (depth === 0 && begin >= 0) { out.push([begin, i + 1]); begin = -1; }
    }
  }
  return { marker, out };
}

const files = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (p.endsWith('.js')) files.push(p);
  }
}
walk(root);
let changed = 0;
for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const ctx = { window: {} };
  vm.runInNewContext(text, ctx, { filename: file, timeout: 5000 });
  const qs = ctx.window.questionBank || [];
  const { out } = objectsInBank(text);
  if (out.length !== qs.length) continue;
  let delta = 0;
  for (let i = 0; i < out.length; i++) {
    const [s0, e0] = out[i];
    const s = s0 + delta, e = e0 + delta;
    let obj = text.slice(s, e);
    const answer = String(qs[i].answer ?? '').trim();
    obj = obj.replace(/("solution"\s*:\s*)("(?:\\.|[^"\\])*")/g, (m, p, raw) => {
      let sol;
      try { sol = JSON.parse(raw); } catch { return m; }
      if (!/주어진 정답과 일치하는 결과는|결과는 원문 정답표로 확정한다|결과는 이다/.test(sol)) return m;
      if (!answer) {
        sol = sol.replace(/주어진 정답과 일치하는 결과는 .*?이다\./g, '').trim();
        sol = sol.replace(/결과는 원문 정답표로 확정한다\./g, '').trim();
        sol = sol.replace(/결과는 이다\./g, '').trim();
        return p + JSON.stringify(sol);
      }
      const value = answer;
      sol = sol.replace(/주어진 정답과 일치하는 결과는 .*?이다\./g, '주어진 정답과 일치하는 결과는 ' + value + '이다.');
      sol = sol.replace(/결과는 원문 정답표로 확정한다\./g, '결과는 ' + value + '이다.');
      sol = sol.replace(/결과는 이다\./g, '결과는 ' + value + '이다.');
      return p + JSON.stringify(sol);
    });
    if (obj !== text.slice(s, e)) {
      text = text.slice(0, s) + obj + text.slice(e);
      delta += obj.length - (e - s);
    }
  }
  if (delta) { fs.writeFileSync(file, text, 'utf8'); changed++; }
}
console.log(JSON.stringify({ changedFiles: changed }));
