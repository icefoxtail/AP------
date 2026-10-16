const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'orbit-app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'orbit.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('responsive overlay offset follows the rendered navigation height', () => {
  assert.match(app, /getBoundingClientRect\(\)\.bottom - universe\.getBoundingClientRect\(\)\.top/);
  assert.match(app, /Math\.ceil\(navBottom \+ 12\)/);
  assert.match(app, /new ResizeObserver\(updateGalaxyNavigationOffset\)/);
  assert.match(app, /galaxyNavResizeObserver\.observe\(ui\.galaxyNav\)/);
  assert.match(app, /addEventListener\('resize', updateGalaxyNavigationOffset/);

  for (const selector of [
    '.filter-panel',
    '.list-panel',
    '.secondary-menu>summary',
  ]) {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rule = new RegExp(`${escaped}\\{[^}]*top:var\\(--galaxy-nav-offset`);
    assert.match(css, rule, `${selector} should use the shared measured offset`);
  }
  assert.match(css, /\.universe\.focused \.entry-chip\{top:calc\(var\(--galaxy-nav-offset/);
  assert.match(css, /\.secondary-menu \.atlas-panel\{top:calc\(var\(--galaxy-nav-offset/);
  assert.match(css, /\.filter-panel,\.list-panel\{top:var\(--galaxy-nav-offset/);
  assert.doesNotMatch(css, /\.filter-panel\{top:66px/);
  assert.doesNotMatch(css, /\.list-panel\{top:66px/);
  assert.doesNotMatch(css, /\.secondary-menu>summary\{[^}]*top:(?:66|76)px/);
  assert.match(css, /\.galaxy-nav\{top:60px/);
  assert.match(css, /\.galaxy-nav\{top:58px/);
});

test('renderer bundle import and page assets share the current cache revision', () => {
  const revision = html.match(/orbit\.css\?v=([\w-]+)/)?.[1];
  assert.equal(revision, '20261016-universe-cinema-1');
  assert.match(app, new RegExp(`orbital-world\\.js\\?v=${revision}`));
  assert.equal([...html.matchAll(new RegExp(`\\?v=${revision}`, 'g'))].length, 4);
  assert.doesNotMatch(app, /20261014-curriculum-orbit-1/);
  assert.doesNotMatch(html, /20261016-galaxy-nav-1/);
});


test('cinematic sky composites behind 3D without changing the nav surface', () => {
  const source = fs.readFileSync(path.join(root, 'src/orbital-world.js'), 'utf8');
  const bundle = fs.readFileSync(path.join(root, 'assets/orbital-world.js'), 'utf8');
  assert.match(css, /url\('\.\/assets\/universe-deepfield\.webp'\)/);
  assert.match(source, /scene\.background = null;/);
  assert.match(bundle, /h\.background=null,h\.fog=/);
  assert.match(source, /makeGalaxyDisc\(data, palette, profile, mobile \? 560 : 1080\)/);
  assert.match(bundle, /H\(w,bt,Ft,l\?560:1080\)/);
  assert.ok(fs.statSync(path.join(root, 'assets/universe-deepfield.webp')).size > 4096);
});
