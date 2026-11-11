#!/usr/bin/env node
'use strict';
// 문제 그림(발문 그림) SVG 게시 스크립트.
// 사용: node .tmp/work/qfig/publish-qfig.cjs <시험지 JS 경로> <qfig 시험지 폴더> [--size <등급>] [--dry]
// - 폴더의 TABLE.md에서 판정이 DONE인 문항만 처리한다.
// - 새 SVG를 archive/assets/images/<시험지 폴더>/<id>_question-v2.svg(이미 있고 내용이 다르면 -v3...)로 복사한다. 옛 파일은 지우지 않는다.
// - 시험지 JS는 해당 문항의 "image"(필요 시 "imageSize") 값 문자열만 바이트 단위로 바꾼다. 다른 필드는 건드리지 않는다.
// - 쓰기 뒤 vm으로 다시 읽어 image·imageSize 외 필드가 바뀌지 않았는지 검증하고, 어긋나면 원본 JS를 되돌리고 새 SVG도 지우고 실패한다.
const fs = require('fs'), path = require('path'), vm = require('vm');

const SIZES = ['small', 'half', 'medium', 'large', 'full', 'tall'];
const args = process.argv.slice(2);
const pos = []; let size = null, dry = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dry') dry = true;
  else if (args[i] === '--size') size = args[++i];
  else pos.push(args[i]);
}
if (pos.length !== 2) die('사용법: node publish-qfig.cjs <시험지 JS 경로> <qfig 시험지 폴더> [--size <등급>] [--dry]');
if (size && !SIZES.includes(size)) die('--size는 ' + SIZES.join('|') + ' 중 하나여야 한다: ' + size);
const examPath = path.resolve(pos[0]), qdir = path.resolve(pos[1]);
function die(msg) { console.error('FAIL: ' + msg); process.exit(1); }
if (!fs.existsSync(examPath)) die('시험지 JS가 없다: ' + examPath);
if (!fs.existsSync(path.join(qdir, 'TABLE.md'))) die('TABLE.md가 없다: ' + qdir);

// archive 루트(= .../archive)와 시험지 키
const norm = examPath.replace(/\\/g, '/');
const am = norm.match(/^(.*\/archive)\/exams\//);
if (!am) die('시험지 JS 경로가 archive/exams/ 아래가 아니다: ' + examPath);
const archiveRoot = am[1];
const examKey = path.basename(examPath, '.js');
const assetDir = path.join(archiveRoot, 'assets', 'images', examKey);

function loadExam(text) {
  const ctx = { window: {} };
  vm.runInNewContext(text, ctx, { timeout: 20000 });
  return ctx.window.examData || ctx.window.questionBank;
}
const origBytes = fs.readFileSync(examPath);
const origText = origBytes.toString('utf8');
const eol = origText.includes('\r\n') ? '\r\n' : '\n';
const origExam = loadExam(origText);
const origQs = Array.isArray(origExam) ? origExam : origExam.questions;

// TABLE.md: DONE 행
const done = [];
for (const line of fs.readFileSync(path.join(qdir, 'TABLE.md'), 'utf8').split(/\r?\n/)) {
  if (!line.startsWith('|')) continue;
  const cells = line.split('|').slice(1, -1).map(s => s.trim());
  if (cells.length >= 3 && /^DONE\b/.test(cells[2]) && /^(?:[A-Za-z]\w*|\d+)$/.test(cells[0])) done.push(cells[0]);
}
if (!done.length) die('TABLE.md에 DONE 문항이 없다');

// SVG 접근성(학생용 언어) 검사: 저장소 계약 검사기를 그대로 부른다.
let langContract = null;
const lcPath = path.join(archiveRoot, 'tools', 'svg-language-contract.cjs');
if (fs.existsSync(lcPath)) langContract = require(lcPath);

const plan = [], warnings = [];
for (const id of done) {
  const q = origQs.find(x => String(x.id) === id);
  if (!q) { warnings.push(id + ': 시험지에 없는 문항 id, 건너뜀'); continue; }
  // 새 파일 이름 접두: 숫자 id는 q<id>, 문자열 id는 id 그대로
  const base = typeof q.id === 'number' ? 'q' + id : id;
  const figPath = [path.join(qdir, id, 'figure.svg'), path.join(qdir, 'q' + id, 'figure.svg')].find(f => fs.existsSync(f));
  if (!figPath) { warnings.push(id + ': figure.svg 없음, 건너뜀'); continue; }
  const svg = fs.readFileSync(figPath);
  if (langContract) {
    const r = langContract.validateSvgStudentLanguage(svg.toString('utf8'), { assetRef: 'assets/images/' + examKey + '/' + base + '_question-v2.svg' });
    if (r.status !== 'PASS') { warnings.push(id + ': 접근성 검사 실패 ' + JSON.stringify(r.errors).slice(0, 200) + ', 건너뜀'); continue; }
  }
  const imgCount = (String(q.question || q.content || '').match(/<img\b/gi) || []).length;
  const hasImage = typeof q.image === 'string' && q.image;
  if (!hasImage && imgCount !== 1) { warnings.push(id + ': image 키가 없고 본문 <img>가 ' + imgCount + '개라 건너뜀'); continue; }
  const prefix = hasImage ? q.image.slice(0, q.image.lastIndexOf('/') + 1) : 'assets/images/' + examKey + '/';
  // 새 파일 이름: v2, 이미 있으면 같은 내용일 때만 재사용, 다르면 v3...
  let n = 2, reuse = false, fname;
  for (; ; n++) {
    fname = base + '_question-v' + n + '.svg';
    const dest = path.join(assetDir, fname);
    if (!fs.existsSync(dest)) break;
    if (Buffer.compare(fs.readFileSync(dest), svg) === 0) { reuse = true; break; }
  }
  const newImage = prefix + fname;
  plan.push({ id, hadImage: !!hasImage, oldImage: q.image || null, newImage, fname, dest: path.join(assetDir, fname), svg, reuse, oldSize: q.imageSize || null });
}

// 문항 객체 구간 찾기(6칸 들여쓰기 "id" 줄에서 다음 4칸 "}" 줄까지)와 문자열 치환
function findObj(text, id) {
  // id 줄(숫자/문자열 id, 들여쓰기 자유)을 하나 찾고, 바로 앞 줄 "{"의 들여쓰기 J로 객체 끝 "}"를 찾는다.
  const esc = String(id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const ms = [...text.matchAll(new RegExp('^( *)"id": (?:' + esc + '|"' + esc + '"),\\r?$', 'gm'))];
  if (ms.length !== 1) return null;
  const idx = ms[0].index, ind = ms[0][1];
  const bm = text.slice(0, idx).match(/\n( *)\{\r?\n$/);
  if (!bm) return null;
  const J = bm[1];
  // 끝: J+"}" 다음 줄이 J+"{" 또는 "]"인 첫 위치(중첩 객체의 닫는 괄호와 구분)
  const endRe = new RegExp(eol + J + '\\},?(?=' + eol + '(?:' + J + '\\{|\\]))', 'g');
  endRe.lastIndex = idx;
  const em = endRe.exec(text);
  if (!em) return null;
  return { start: idx, end: em.index, ind };
}
let text = origText;
const changed = [];
// 뒤에서부터 고쳐도 되지만 문항별로 위치를 다시 찾는다.
for (const p of plan) {
  const loc = findObj(text, p.id);
  if (!loc) { warnings.push(p.id + ': 문항 객체 위치를 찾지 못해 건너뜀'); p.skip = true; continue; }
  let obj = text.slice(loc.start, loc.end);
  const fields = [];
  const IND = loc.ind;
  const imgRe = new RegExp('^(' + IND + '"image": )"((?:[^"\\\\]|\\\\.)*)"(,?)\\r?$', 'm');
  if (p.hadImage) {
    const m = obj.match(imgRe);
    if (!m) { warnings.push(p.id + ': image 줄 형식이 달라 건너뜀'); p.skip = true; continue; }
    if (JSON.parse('"' + m[2] + '"') !== p.newImage) { obj = obj.replace(imgRe, (a, k, v, c) => k + JSON.stringify(p.newImage) + c); fields.push('image'); }
  } else {
    obj = obj + ',' + eol + IND + '"image": ' + JSON.stringify(p.newImage);
    fields.push('image(추가)');
  }
  if (size) {
    const sizeRe = new RegExp('^(' + IND + '"imageSize": )"((?:[^"\\\\]|\\\\.)*)"(,?)\\r?$', 'm');
    const sm = obj.match(sizeRe);
    if (sm) { if (sm[2] !== size) { obj = obj.replace(sizeRe, (a, k, v, c) => k + JSON.stringify(size) + c); fields.push('imageSize'); } }
    else {
      const m2 = obj.match(imgRe);
      if (m2) {
        // image 줄 바로 뒤에 imageSize 줄을 넣는다(image가 마지막 속성이면 쉼표 처리).
        if (m2[3] === ',') obj = obj.replace(imgRe, (a) => a + eol + IND + '"imageSize": ' + JSON.stringify(size) + ',');
        else obj = obj.replace(imgRe, (a, k, v) => k + '"' + v + '",' + eol + IND + '"imageSize": ' + JSON.stringify(size));
      } else obj = obj + ',' + eol + IND + '"imageSize": ' + JSON.stringify(size);
      fields.push('imageSize(추가)');
    }
  }
  text = text.slice(0, loc.start) + obj + text.slice(loc.end);
  p.fields = fields;
  if (fields.length || !p.reuse) changed.push(p);
}

// 결과 출력(계획)
console.log((dry ? '[DRY] ' : '') + '시험지: ' + path.relative(process.cwd(), examPath) + '  DONE 문항 ' + done.length + '개, size=' + (size || '(바꾸지 않음)'));
for (const p of plan) {
  if (p.skip) continue;
  console.log('  ' + p.id + '  image: ' + (p.oldImage || '(없음)') + '  ->  ' + p.newImage + (p.fields && p.fields.length ? '' : '  (이미 같음)') + '  | 바뀌는 필드: ' + ((p.fields && p.fields.join(', ')) || '없음') + '  | 새 파일 ' + (p.reuse ? '이미 있음(내용 같음)' : '복사 예정'));
}
for (const w of warnings) console.warn('경고: ' + w);
if (dry) { const e = verify(text); console.log('[DRY] 메모리 검증(image·imageSize 외 변경 0): ' + (e ? '실패 - ' + e : '통과')); console.log('[DRY] 아무것도 쓰지 않았다.'); process.exit(e ? 1 : 0); }

// 메모리 안 검증: image·imageSize 외 변경 0
function verify(newText) {
  const ne = loadExam(newText);
  const nq = Array.isArray(ne) ? ne : ne.questions;
  if (nq.length !== origQs.length) return '문항 수가 다르다';
  const ids = new Set(plan.filter(p => !p.skip).map(p => p.id));
  const exp = Object.fromEntries(plan.filter(p => !p.skip).map(p => [p.id, p]));
  for (let i = 0; i < origQs.length; i++) {
    const a = { ...origQs[i] }, b = { ...nq[i] };
    if (ids.has(String(a.id))) {
      const p = exp[String(a.id)];
      if (b.image !== p.newImage) return a.id + ': image가 기대값과 다르다';
      if (size && b.imageSize !== size) return a.id + ': imageSize가 기대값과 다르다';
      delete a.image; delete b.image; delete a.imageSize; delete b.imageSize;
    }
    if (JSON.stringify(a) !== JSON.stringify(b)) return a.id + ': image·imageSize 외 필드가 바뀌었다';
  }
  if (!Array.isArray(ne)) {
    const a = { ...origExam }, b = { ...ne }; delete a.questions; delete b.questions;
    if (JSON.stringify(a) !== JSON.stringify(b)) return '시험지 최상위 필드가 바뀌었다';
  }
  return null;
}
const err0 = verify(text);
if (err0) die('쓰기 전 검증 실패(아무것도 쓰지 않음): ' + err0);

// 쓰기: 새 SVG 복사 → JS 저장 → 다시 읽어 검증, 실패하면 되돌림
const created = [];
try {
  fs.mkdirSync(assetDir, { recursive: true });
  for (const p of plan) {
    if (p.skip || p.reuse) continue;
    fs.writeFileSync(p.dest, p.svg); created.push(p.dest);
  }
  fs.writeFileSync(examPath, Buffer.from(text, 'utf8'));
  const err1 = verify(fs.readFileSync(examPath, 'utf8'));
  if (err1) throw new Error('쓴 뒤 검증 실패: ' + err1);
} catch (e) {
  fs.writeFileSync(examPath, origBytes);
  for (const f of created) { try { fs.unlinkSync(f); } catch (x) { } }
  die(e.message + ' (원본 JS를 되돌리고 새 SVG를 지웠다)');
}
console.log('완료: 시험지 JS 저장, 새 SVG ' + created.length + '개 복사.');
console.log('바뀐 문항: ' + plan.filter(p => !p.skip).map(p => p.id + '[' + ((p.fields || []).join('+') || '변경 없음') + ']').join(' '));
console.log('검증: image·imageSize 외 필드 변경 0 (vm 재읽기 통과). 줄끝 ' + (eol === '\n' ? 'LF' : 'CRLF') + ' 유지.');