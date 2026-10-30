// AP Math Lab 2.0 · 카탈로그·키트 정합성 검사 (브라우저 없이 수 초 안에 끝남)
// 실행: node --test apmath/playground/next/tools/catalog.test.mjs
// tools/run-tests.js 의 requiredCommands 에 등록되어 있어 CI에서 막습니다.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { renderManifest } from './gen-manifest.mjs';

const NEXT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLAYGROUND = path.resolve(NEXT, '..');

function loadCatalog() {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(NEXT, 'kit/apl-catalog.js'), 'utf8'), ctx);
  return ctx.window.APLab.catalog;
}
const cat = loadCatalog();
const strip = (p) => decodeURIComponent(p.split(/[?#]/)[0]);

test('실험실 id는 겹치지 않고 필수 항목을 갖는다', () => {
  const ids = new Set();
  for (const lab of cat.labs) {
    assert.ok(lab.id && /^[a-z0-9-]+$/.test(lab.id), `id 형식: ${lab.id}`);
    assert.ok(!ids.has(lab.id), `중복 id: ${lab.id}`);
    ids.add(lab.id);
    for (const key of ['course', 'unit', 'strand', 'title', 'summary', 'legacy', 'glyph']) assert.ok(lab[key], `${lab.id}.${key} 비어 있음`);
    assert.ok(cat.courses.some((c) => c.id === lab.course), `${lab.id}: 없는 과정 ${lab.course}`);
    assert.ok(cat.strands.some((s) => s.id === lab.strand), `${lab.id}: 없는 노선 ${lab.strand}`);
  }
});

test('카탈로그가 가리키는 파일이 모두 존재한다 (폴더 이름 변경으로 링크가 깨지는 일을 막음)', () => {
  for (const lab of cat.labs) {
    assert.ok(fs.existsSync(path.join(PLAYGROUND, strip(lab.legacy))), `${lab.id}: 기존 경로 없음 ${lab.legacy}`);
    if (lab.next) assert.ok(fs.existsSync(path.join(PLAYGROUND, strip(lab.next))), `${lab.id}: 2.0 경로 없음 ${lab.next}`);
    for (const x of lab.extra || []) assert.ok(fs.existsSync(path.join(PLAYGROUND, strip(x.href))), `${lab.id}: 추가 링크 없음 ${x.href}`);
  }
});

test('노선도의 역은 모두 실제 실험실이다', () => {
  const ids = new Set(cat.labs.map((l) => l.id));
  for (const s of cat.strands) for (const st of s.stations) assert.ok(ids.has(st), `${s.id}: 없는 역 ${st}`);
});

test('labs/ 안의 실험실 HTML은 모두 카탈로그에 등록되어 있다', () => {
  const registered = new Set(cat.labs.map((l) => path.normalize(strip(l.legacy))));
  const PORTALS = new Set([path.normalize('labs/대수/index.html')]); // 허브 카드에서 뺀 묶음 포털(#978)
  const missing = [];
  (function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) { if (!/katex/i.test(name)) walk(full); continue; }
      if (!name.endsWith('.html')) continue;
      const rel = path.normalize(path.relative(PLAYGROUND, full));
      if (!registered.has(rel) && !PORTALS.has(rel)) missing.push(rel);
    }
  })(path.join(PLAYGROUND, 'labs'));
  assert.deepEqual(missing, [], `카탈로그에 등록되지 않은 실험실: ${missing.join(', ')}`);
});

test('2.0 페이지가 불러오는 키트 파일이 존재하고 문법이 맞다', () => {
  const pages = [path.join(NEXT, 'index.html'), path.join(NEXT, 'compare.html'), ...fs.readdirSync(path.join(NEXT, 'labs')).filter((f) => f.endsWith('.html')).map((f) => path.join(NEXT, 'labs', f))];
  for (const page of pages) {
    const html = fs.readFileSync(page, 'utf8');
    for (const m of html.matchAll(/(?:src|href)="(\.{1,2}\/[^"#?]+)"/g)) {
      const target = path.resolve(path.dirname(page), m[1]);
      if (target.startsWith(PLAYGROUND)) assert.ok(fs.existsSync(target), `${path.basename(page)} → 없는 파일 ${m[1]}`);
    }
  }
  for (const f of fs.readdirSync(path.join(NEXT, 'kit')).filter((f) => f.endsWith('.js'))) {
    execFileSync(process.execPath, ['--check', path.join(NEXT, 'kit', f)]);
  }
});

test('모든 HTML이 불러오는 로컬 스크립트·스타일·아이콘 파일이 존재한다 (404 방지)', () => {
  // 외부(http·//)·data:·#는 건너뜁니다. 주석 처리된 태그는 무시하고, ?쿼리·#해시는 떼고, %XX 인코딩은 풀어 확인합니다.
  const VENDOR = path.join(NEXT, 'kit', 'vendor');
  const pages = [];
  (function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) { if (full !== VENDOR) walk(full); continue; }
      if (name.endsWith('.html')) pages.push(full);
    }
  })(PLAYGROUND);
  assert.ok(pages.length > 40, `HTML 파일을 거의 찾지 못했습니다 (${pages.length}개)`);
  const broken = [];
  let checked = 0;
  for (const page of pages) {
    const html = fs.readFileSync(page, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
    for (const m of html.matchAll(/<(script|link)\b[^>]*>/gi)) {
      const attr = m[1].toLowerCase() === 'script' ? 'src' : 'href';
      const a = m[0].match(new RegExp(`\\b${attr}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
      const ref = a && (a[1] ?? a[2] ?? a[3]);
      if (!ref || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(ref)) continue;
      const clean = strip(ref);
      if (!clean) continue;
      checked += 1;
      const target = clean.startsWith('/') ? path.join(PLAYGROUND, clean) : path.resolve(path.dirname(page), clean);
      if (!fs.existsSync(target)) broken.push(`${path.relative(PLAYGROUND, page)} → ${ref}`);
    }
  }
  assert.ok(checked > 50, `확인한 참조가 너무 적습니다 (${checked}개)`);
  assert.deepEqual(broken, [], `없는 파일을 가리키는 참조:\n${broken.join('\n')}`);
});

test('2.0 파일이 .gitignore에 걸려 배포에서 빠지지 않는다', () => {
  // 저장소 루트 .gitignore의 `catalog.js` 규칙 때문에 목록 파일이 커밋에서 빠진 적이 있습니다.
  const files = [];
  (function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) walk(full); else files.push(full);
    }
  })(NEXT);
  let ignored = '';
  try {
    ignored = execFileSync('git', ['check-ignore', '--no-index', ...files], { cwd: NEXT, encoding: 'utf8' });
  } catch (e) {
    if (e.status !== 1) throw e; // 1 = 걸린 파일 없음
  }
  assert.equal(ignored.trim(), '', `.gitignore에 걸린 파일: ${ignored.trim()}`);
});

test('manifest.json이 카탈로그와 같고 가리키는 파일이 모두 존재한다', () => {
  // 실험실을 더하거나 고쳤다면: node apmath/playground/next/tools/gen-manifest.mjs
  const text = fs.readFileSync(path.join(PLAYGROUND, 'manifest.json'), 'utf8').replace(/\r\n/g, '\n');
  const manifest = JSON.parse(text);
  // 생성기와 따로, 개수·id·제목·경로를 카탈로그에서 직접 대조합니다 (생성기가 틀려도 검사가 통과해 버리지 않도록).
  assert.equal(manifest.lab_count, cat.labs.length, 'lab_count 가 카탈로그 실험실 수와 다름');
  assert.deepEqual(manifest.labs.map((l) => l.id), Array.from(cat.labs, (l) => l.id), 'manifest 의 실험실 목록·순서가 카탈로그와 다름');
  cat.labs.forEach((lab, i) => {
    const m = manifest.labs[i];
    assert.equal(m.title, lab.title, `${lab.id}: 제목`);
    assert.equal(m.course, lab.course, `${lab.id}: 과정`);
    assert.equal(m.unit, lab.unit, `${lab.id}: 단원`);
    assert.equal(m.path, strip(lab.legacy), `${lab.id}: 경로`);
    assert.equal(m.next, lab.next ? strip(lab.next) : undefined, `${lab.id}: 2.0 경로`);
  });
  for (const m of manifest.labs) {
    assert.ok(fs.existsSync(path.join(PLAYGROUND, m.path)), `${m.id}: manifest 경로 없음 ${m.path}`);
    if (m.next) assert.ok(fs.existsSync(path.join(PLAYGROUND, m.next)), `${m.id}: manifest 2.0 경로 없음 ${m.next}`);
  }
  // 글자 하나까지 같아야 합니다: 생성기를 다시 돌려도 diff가 없다는 뜻입니다.
  assert.equal(text, renderManifest(cat), 'manifest.json 이 낡았습니다 → node apmath/playground/next/tools/gen-manifest.mjs');
});
