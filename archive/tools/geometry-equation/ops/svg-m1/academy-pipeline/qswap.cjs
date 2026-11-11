// 문제 그림 스캔 PNG를 검정 엔진 SVG로 바꾼다(본문 <img> 경로까지).
// usage: node qswap.cjs <exam js> <old asset basename> <new svg source> <new asset basename> [--dry]
const fs = require('fs'), path = require('path'), vm = require('vm');
const [js, oldBase, svgSrc, newBase] = process.argv.slice(2);
const dry = process.argv.includes('--dry');
const exam = path.basename(js, '.js');
const oldRef = 'assets/images/' + exam + '/' + oldBase;
const newRef = 'assets/images/' + exam + '/' + newBase;
const load = (src) => { const c = { window: {} }; vm.runInNewContext(src, c); return c.window.questionBank || c.window.examData.questions; };
const before = fs.readFileSync(js, 'utf8');
const n = before.split(oldRef).length - 1;
if (!n) { console.error('FAIL: no reference to ' + oldRef); process.exit(1); }
const after = before.split(oldRef).join(newRef);
const a = load(before), b = load(after);
if (a.length !== b.length) { console.error('FAIL: length'); process.exit(1); }
const changed = [];
for (let i = 0; i < a.length; i++) for (const k of new Set([...Object.keys(a[i]), ...Object.keys(b[i])])) {
  const x = JSON.stringify(a[i][k]), y = JSON.stringify(b[i][k]);
  if (x !== y) {
    if (x.split(oldRef).join(newRef) !== y) { console.error('FAIL: unexpected change', a[i].id, k); process.exit(1); }
    changed.push(a[i].id + '.' + k);
  }
}
const dest = path.join('archive', newRef);
if (fs.existsSync(dest)) { console.error('FAIL: exists ' + dest); process.exit(1); }
const svg = fs.readFileSync(svgSrc, 'utf8');
if (/#(?!000|fff|FFF|0{6}|f{6}|F{6})[0-9a-fA-F]{3,6}\b/.test(svg.replace(/#(1f2937|111827|6b7280|9ca3af|d1d5db|e5e7eb|374151|4b5563)\b/gi, ''))) console.log('NOTE: non-gray color present, check by eye');
console.log((dry ? '[DRY] ' : '') + exam, 'refs', n, 'fields', changed.join(','), '->', newRef);
if (!dry) { fs.writeFileSync(js, after); fs.copyFileSync(svgSrc, dest); }
