// 해설·문제 글의 제어문자와 역슬래시 빠진 LaTeX 명령 탐지. usage: node ctl.cjs <js...> | node ctl.cjs --json <fix.json...>
const path = require("path");
const fs = require("fs");
const B = String.fromCharCode(92);
const words = ["overline", "angle", "triangle", "riangle", "dfrac", "frac", "text{", "ext{", "mathrm", "times", "imes", "parallel", "circ", "sqrt", "perp", "equiv", "square"];
function check(v) {
  const r = [];
  for (let i = 0; i < v.length; i++) {
    const c = v.charCodeAt(i);
    if (c < 32 && c !== 10 && c !== 13) { r.push("CTL(" + c + ")"); break; }
  }
  for (const w of words) {
    let i = -1;
    while ((i = v.indexOf(w, i + 1)) >= 0) {
      const p = i > 0 ? v[i - 1] : "";
      if (p !== B && !/[a-zA-Z]/.test(p)) { r.push("BARE:" + w + "@" + v.slice(Math.max(0, i - 8), i + 12).replace(/\n/g, " ")); break; }
    }
  }
  return r;
}
const args = process.argv.slice(2);
if (args[0] === "--json") {
  for (const f of args.slice(1)) for (const x of JSON.parse(fs.readFileSync(f, "utf8"))) { const r = check(String(x.value)); if (r.length) console.log(path.basename(path.dirname(f)), x.id, x.field, r.join(" ")); }
} else {
  for (const f of args) {
    const w = {}; global.window = w; require(path.resolve(f));
    for (const q of (w.questionBank || w.examData.questions)) for (const k of ["content", "question", "solution", "answer"]) {
      if (typeof q[k] !== "string") continue;
      const r = check(q[k]); if (r.length) console.log(path.basename(f).slice(0, 12), q.id, k, r.join(" "));
    }
  }
}
