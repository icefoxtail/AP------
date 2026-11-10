// usage: node .tmp/work/ds-svgtext.cjs <svg 파일> [--brief]
// 그림을 볼 수 없는 작업자(DeepSeek)가 SVG를 글로 읽게 해 주는 요약기. 읽기 전용.
// 출력: viewBox, 접근성 <title>/<desc>, 화면에 보이는 <text> 글자 목록(좌표 포함), 쓰인 색(stroke/fill) 종류와 개수,
//       요소 개수(path/line/circle/rect/polygon), 점선(stroke-dasharray) 사용 여부, 의심 항목(빗금 분수, 영어 단어, 깨진 글자 ?).
const fs = require('fs');
const f = process.argv[2];
if (!f) { console.error('usage: node .tmp/work/ds-svgtext.cjs <svg>'); process.exit(2); }
const s = fs.readFileSync(f, 'utf8');
const dec = t => t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));
const strip = t => dec(t.replace(/<[^>]+>/g, ''));
const out = [];
const vb = s.match(/viewBox="([^"]+)"/);
out.push('file: ' + f + ' (' + s.length + ' bytes)');
out.push('viewBox: ' + (vb ? vb[1] : '(없음)'));
const eng = s.match(/data-engine-version="([^"]*)"|data-publication-profile="([^"]*)"|data-composite="([^"]*)"|data-([a-z0-9-]+)="\4-figure-v1"/);
out.push('신형 표지(data-engine-version 등): ' + (eng ? eng[0] : '없음 -> 구형일 가능성'));
const title = s.match(/<title[^>]*>([\s\S]*?)<\/title>/); const desc = s.match(/<desc[^>]*>([\s\S]*?)<\/desc>/);
out.push('title: ' + (title ? strip(title[1]).slice(0, 300) : '(없음)'));
out.push('desc: ' + (desc ? strip(desc[1]).slice(0, 300) : '(없음)'));
const texts = [];
for (const m of s.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
  const a = m[1]; const x = (a.match(/\bx="([^"]+)"/) || [])[1]; const y = (a.match(/\by="([^"]+)"/) || [])[1];
  const fill = (a.match(/\bfill="([^"]+)"/) || [])[1];
  const t = strip(m[2]).replace(/\s+/g, ' ').trim();
  if (t) texts.push({ t, x, y, fill });
}
out.push('보이는 글자 ' + texts.length + '개:');
for (const q of texts) out.push('  "' + q.t + '"' + (q.x ? ' @(' + q.x + ',' + q.y + ')' : '') + (q.fill ? ' fill=' + q.fill : ''));
const col = {};
for (const m of s.matchAll(/\b(stroke|fill)="(#[0-9a-fA-F]{3,8}|rgb[^"]*|[a-z]+)"/g)) {
  if (['none', 'transparent'].includes(m[2])) continue;
  const k = m[1] + ' ' + m[2]; col[k] = (col[k] || 0) + 1;
}
out.push('색: ' + (Object.entries(col).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ' x' + v).join(', ') || '(없음)'));
const cnt = {};
for (const tag of ['path', 'line', 'polyline', 'polygon', 'circle', 'ellipse', 'rect', 'text']) cnt[tag] = (s.match(new RegExp('<' + tag + '\\b', 'g')) || []).length;
out.push('요소 수: ' + Object.entries(cnt).filter(([, v]) => v).map(([k, v]) => k + ' ' + v).join(', '));
out.push('점선(stroke-dasharray): ' + ((s.match(/stroke-dasharray="[^"]+"/g) || []).length) + '곳');
const warn = [];
for (const q of texts) {
  if (/\d\s*\/\s*\d|[a-z]\s*\/\s*[a-z0-9]/.test(q.t)) warn.push('빗금 분수 의심: ' + q.t);
  if (/\b[A-Za-z]{4,}\b/.test(q.t)) warn.push('영어 단어 의심: ' + q.t);
  if (/\?\?|�/.test(q.t)) warn.push('깨진 글자: ' + q.t);
}
if (/\?\?|�/.test((title ? title[1] : '') + (desc ? desc[1] : ''))) warn.push('title/desc에 깨진 글자');
out.push('의심 항목: ' + (warn.length ? '\n  ' + warn.join('\n  ') : '없음'));
console.log(out.join('\n'));
