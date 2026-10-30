// Each archive root JS/CSS file must be referenced with one ?v= cache version across archive/*.html,
// otherwise browsers keep two copies and a stale page can run mixed code.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const archiveDir = path.join(__dirname, '..', 'archive');
// Legacy pages may be exempted only with a written reason: { 'file.html': 'reason' }.
const EXEMPT_PAGES = {};

const refs = new Map();
const pattern = /(?:src|href)=["']([^"'#?]+?\.(?:js|css))(\?[^"']*)?["']/g;
for (const page of fs.readdirSync(archiveDir).filter((name) => name.endsWith('.html'))) {
  if (EXEMPT_PAGES[page]) {
    assert(EXEMPT_PAGES[page].length > 10, `${page}: exemption needs a written reason`);
    continue;
  }
  const html = fs.readFileSync(path.join(archiveDir, page), 'utf8');
  for (const match of html.matchAll(pattern)) {
    const url = match[1];
    if (/^(https?:)?\/\//.test(url)) continue;
    const target = path.normalize(path.join('archive', url)).replace(/\\/g, '/');
    if (!refs.has(target)) refs.set(target, new Map());
    const versions = refs.get(target);
    const version = match[2] || '(none)';
    if (!versions.has(version)) versions.set(version, []);
    versions.get(version).push(page);
  }
}

const conflicts = [];
for (const [target, versions] of refs) {
  if (versions.size > 1)
    conflicts.push(`${target}: ${[...versions].map(([v, pages]) => `${v} <- ${pages.join(',')}`).join(' | ')}`);
}
assert.strictEqual(conflicts.length, 0, `Mixed ?v= cache versions:\n${conflicts.join('\n')}`);
assert(refs.size > 20, 'expected to scan the archive root script/style references');
console.log('archive cache version consistency checks passed');
