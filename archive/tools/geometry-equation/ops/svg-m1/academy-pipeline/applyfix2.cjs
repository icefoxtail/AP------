// usage: node applyfix2.cjs <fix.json> <exam dir>  — 따옴표 없는 키(id: 1, answer: "")도 처리
const fs = require("fs"), path = require("path");
const [fx, dir] = process.argv.slice(2);
const fixes = JSON.parse(fs.readFileSync(fx, "utf8"));
const byExam = {};
for (const x of fixes) (byExam[x.exam] = byExam[x.exam] || []).push(x);
const B = String.fromCharCode(92); // backslash
for (const [exam, list] of Object.entries(byExam)) {
  const f = path.join(dir, exam);
  let s = fs.readFileSync(f, "utf8");
  for (const x of list) {
    if (typeof x.value !== "string") throw new Error("non-string " + x.id);
    const idRe = new RegExp('(?:"id"|[^"A-Za-z]id): ' + x.id + ",");
    const m = idRe.exec(s);
    if (!m) throw new Error("no id " + x.id);
    const start = m.index;
    const rest = s.slice(start + m[0].length);
    const n = /(?:"id"|[^"A-Za-z]id): [0-9]+,/.exec(rest);
    const end = n ? start + m[0].length + n.index : s.length;
    const block = s.slice(start, end);
    const re = new RegExp('("' + x.field + '"|[^"A-Za-z]' + x.field + '): "(?:[^"' + B + B + "]|" + B + B + '.)*"');
    if (!re.test(block)) throw new Error("no field " + x.id + " " + x.field);
    s = s.slice(0, start) + block.replace(re, (_, k) => k + ": " + JSON.stringify(x.value)) + s.slice(end);
  }
  fs.writeFileSync(f, s);
  console.log("ok", exam, list.length);
}
