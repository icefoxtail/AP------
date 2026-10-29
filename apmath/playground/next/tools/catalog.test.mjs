// AP Math Lab 2.0 · 카탈로그·키트 정합성 검사 (브라우저 없이 수 초 안에 끝남)
// 실행: node --test apmath/playground/next/tools/catalog.test.mjs
// 2.0 구조를 채택하면 tools/run-tests.js 의 requiredCommands 에 등록해 CI에서 막도록 합니다.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const NEXT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLAYGROUND = path.resolve(NEXT, '..');

function loadCatalog() {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(NEXT, 'kit/catalog.js'), 'utf8'), ctx);
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
