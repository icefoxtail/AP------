// Cache-version stamping of the shipped pages (manifest "versionStamp": true): the pure stamping module and the
// package step that applies it. Runs in the ordinary CI; the release job builds the real site with the same code.
// No operating counts are pinned; only defect conditions (unstable value, missed rewrite, rewritten bound page).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { stampPackageEntries, versionStampExclusions } from '../tools/build-archive-pages-site.mjs';
import { stampHtmlVersions, textDigest, STAMP_LENGTH } from '../tools/lib/stamp-html-versions.mjs';

const stampOf = (text) => textDigest(text).slice(0, STAMP_LENGTH);

function packageOf(t, files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'version-stamp-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const put = (relative, text) => {
    const absolute = path.join(dir, ...relative.split('/'));
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, text);
  };
  for (const [relative, text] of Object.entries(files)) put(relative, text);
  const entries = () => Object.keys(files).sort().map((relative) => {
    const absolute = path.join(dir, ...relative.split('/'));
    return { path: relative, absolute, bytes: fs.statSync(absolute).size, reasons: ['fixture'] };
  });
  return { dir, put, entries };
}
const textOf = (entry) => entry.content ? entry.content.toString('utf8') : fs.readFileSync(entry.absolute, 'utf8');
const find = (entries, relative) => entries.find((entry) => entry.path === relative);

const SITE = {
  'apmath/page.html': '<!doctype html><link rel="stylesheet" href="css/a.css?v=hand-written"><script defer src="js/core.js?v=20260101"></script><script src="../archive/runtime.js"></script>',
  'apmath/sub/deep.html': '<script src="../js/core.js"></script>',
  'apmath/other.html': '<p>none</p><script src="https://cdn.example.test/lib.js"></script>',
  'apmath/css/a.css': 'body{}',
  'apmath/js/core.js': 'core v1',
  'archive/runtime.js': 'runtime',
};

test('package step: shipped pages carry the hash of each file they load; files stay as they are', (t) => {
  const site = packageOf(t, SITE);
  const entries = site.entries();
  const summary = stampPackageEntries(entries, { versionStamp: true });
  const page = textOf(find(entries, 'apmath/page.html'));
  assert.ok(page.includes(`css/a.css?v=${stampOf('body{}')}"`), 'a hand-written ?v= is replaced');
  assert.ok(page.includes(`js/core.js?v=${stampOf('core v1')}"`));
  assert.ok(page.includes(`../archive/runtime.js?v=${stampOf('runtime')}"`), 'a missing ?v= is added');
  assert.equal(summary.references, 4);
  assert.equal(find(entries, 'apmath/page.html').transform, 'stamp-html-version');
  assert.equal(find(entries, 'apmath/page.html').bytes, Buffer.byteLength(page));
  assert.equal(find(entries, 'apmath/page.html').sourceBytes, Buffer.byteLength(SITE['apmath/page.html']));
  assert.equal(find(entries, 'apmath/other.html').content, undefined, 'a page with nothing local to stamp is untouched');
  assert.equal(find(entries, 'apmath/js/core.js').content, undefined, 'scripts and styles are never rewritten');
  assert.equal(fs.readFileSync(path.join(site.dir, 'apmath/page.html'), 'utf8'), SITE['apmath/page.html'], 'the source page is never edited');
});

test('package step: deterministic, one value per file in every page, and only changed files change', (t) => {
  const site = packageOf(t, SITE);
  const run = () => { const entries = site.entries(); stampPackageEntries(entries, { versionStamp: true }); return entries; };
  const first = run();
  const again = run();
  assert.deepEqual(first.map((e) => [e.path, e.content?.toString('hex')]), again.map((e) => [e.path, e.content?.toString('hex')]), 'same input, same output');
  const valueOf = (entries, relative) => textOf(find(entries, relative)).match(/core\.js\?v=([0-9a-f]+)/)[1];
  assert.equal(valueOf(first, 'apmath/page.html'), valueOf(first, 'apmath/sub/deep.html'), 'one file, one value everywhere');
  site.put('apmath/js/core.js', 'core v2');
  const changed = run();
  assert.notEqual(valueOf(changed, 'apmath/page.html'), valueOf(first, 'apmath/page.html'), 'the changed file gets a new value');
  assert.equal(valueOf(changed, 'apmath/page.html'), stampOf('core v2'));
  assert.equal(valueOf(changed, 'apmath/sub/deep.html'), stampOf('core v2'));
  const untouched = (entries) => textOf(find(entries, 'apmath/page.html')).match(/(?:a\.css|runtime\.js)\?v=[0-9a-f]+/g);
  assert.deepEqual(untouched(changed), untouched(first), 'files that did not change keep their value');
  site.put('apmath/js/core.js', 'core\r\nv2');
  assert.equal(valueOf(run(), 'apmath/page.html'), stampOf('core\nv2'), 'checkout line endings do not change the value');
});

test('package step: a reference to a file outside the package fails, naming page, reference and target', (t) => {
  const site = packageOf(t, { ...SITE, 'apmath/broken.html': '<script src="js/not-there.js"></script>' });
  assert.throws(() => stampPackageEntries(site.entries(), { versionStamp: true }),
    /apmath\/broken\.html references js\/not-there\.js, but apmath\/js\/not-there\.js is not in the Pages package/);
});

test('package step: off unless the manifest says true; pages the public verification compares byte for byte are left alone', (t) => {
  const bound = ['apmath/student/index.html', 'apmath/planner/index.html', 'apmath/homework/index.html', 'apmath/wrong_print_engine.html', 'archive/engine.html', 'archive/mixed_engine.html'];
  const excluded = versionStampExclusions();
  for (const page of bound) assert.ok(excluded.has(page), `${page} is compared with its committed bytes by the public student verification`);
  const files = { ...SITE };
  for (const page of bound) files[page] = '<script src="../js/core.js?v=hand"></script>';
  const site = packageOf(t, files);
  const off = site.entries();
  assert.deepEqual(stampPackageEntries(off, {}), { pages: 0, references: 0, skippedBound: 0 });
  assert.equal(off.some((e) => e.content), false);
  assert.throws(() => stampPackageEntries(site.entries(), { versionStamp: 'yes' }), /versionStamp must be true/);
  const on = site.entries();
  const summary = stampPackageEntries(on, { versionStamp: true });
  for (const page of bound) {
    if (!find(on, page)) continue;
    assert.equal(find(on, page).content, undefined, `${page} keeps its committed bytes`);
    assert.equal(textOf(find(on, page)), '<script src="../js/core.js?v=hand"></script>');
  }
  assert.equal(summary.skippedBound, bound.filter((page) => find(on, page)).length);
});

test('stampHtmlVersions: leaves external, data, blob, root-absolute, templated, commented and already stamped addresses alone', () => {
  const hashOf = (target) => textDigest('x:' + target);
  const stamp = (target) => hashOf(target).slice(0, STAMP_LENGTH);
  const lines = [
    '<script src="https://cdn.example.test/a.js?v=1"></script>',
    '<script src="//cdn.example.test/b.js"></script>',
    '<script src="data:text/javascript,1"></script>',
    '<script src="blob:https://x/1"></script>',
    '<script src="/abs/root.js"></script>',
    '<script src="{{asset}}.js"></script>',
    `<script src="js/done.js?v=${stamp('p/js/done.js')}"></script>`,
    '<link rel="icon" href="icon.png">',
    '<link rel="manifest" href="manifest.json">',
    '<script data-src="js/data-attr.js" src="js/real.js?x=1&v=old&y=2#frag"></script>',
    "<link rel='stylesheet' href='css/single.css'>",
    '<!-- <script src="js/commented-out.js"></script> -->',
    '<script>document.write(\'<script src="js/in-string.js"><\\/script>\');</script>',
  ];
  const { text, refs } = stampHtmlVersions({ htmlPath: 'p/page.html', text: lines.join('\n'), hashOf });
  const out = text.split('\n');
  for (const index of [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12]) assert.equal(out[index], lines[index], `line ${index} unchanged`);
  assert.equal(out[9], `<script data-src="js/data-attr.js" src="js/real.js?x=1&v=${stamp('p/js/real.js')}&y=2#frag"></script>`);
  assert.equal(out[10], `<link rel='stylesheet' href='css/single.css?v=${stamp('p/css/single.css')}'>`);
  assert.deepEqual(refs.map((ref) => ref.target), ['p/js/real.js', 'p/css/single.css']);
});

test('stampHtmlVersions: resolves ../ paths and encoded names, and refuses to leave the package', () => {
  const seen = [];
  const hashOf = (target) => { seen.push(target); return textDigest(target); };
  stampHtmlVersions({ htmlPath: 'a/b/page.html', text: '<script src="../js/x.js"></script><script src="./y%20z.js"></script>', hashOf });
  assert.deepEqual(seen, ['a/js/x.js', 'a/b/y z.js']);
  assert.throws(() => stampHtmlVersions({ htmlPath: 'page.html', text: '<script src="../../out.js"></script>', hashOf }), /outside the package/);
});

test('the release manifest turns version stamping on', () => {
  const manifest = JSON.parse(fs.readFileSync(new URL('../tools/archive-pages-release-manifest.json', import.meta.url), 'utf8'));
  assert.equal(manifest.versionStamp, true);
});
