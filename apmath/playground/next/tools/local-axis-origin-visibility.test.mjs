// Local coordinate-plane renderers may move the origin fully outside their
// existing native clip. Keep all visible/partly visible paint commands exact.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const cases = [['common-functions.html', 'drawAxesWithTicks'], ['common-lines.html', 'drawPlane']];
function source(file, name) {
  const path = `apmath/playground/next/labs/${file}`;
  const text = fs.readFileSync(path, 'utf8');
  const start = text.indexOf(`  function ${name}(`), end = text.indexOf('\n  }', start);
  assert.ok(start >= 0 && end > start);
  return text.slice(start, end + 4);
}
function draw(code, name, origin, extra = {}) {
  const calls = [], metrics = { width: 9, actualBoundingBoxLeft: 9, actualBoundingBoxRight: 0, actualBoundingBoxAscent: -2, actualBoundingBoxDescent: 11 };
  const ctx = new Proxy({ shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0, filter: 'none', globalCompositeOperation: 'source-over',
    measureText: () => metrics, getTransform: () => ({ a: 2, b: 0, c: 0, d: 2, e: 0, f: 0 }), ...extra },
  { get: (obj, key) => key in obj ? obj[key] : (...args) => calls.push({ name: key, args: [...args] }) });
  const board = { _bbox: false, ctx, W: 300, H: 200, k: 1, fs: 1, lw: 1, font: 'sans-serif', thumb: false,
    colors: { grid: '#333', axis: '#888', tick: '#aaa' }, color: () => '#ffc107', toS: () => origin };
  const scope = vm.createContext({ BOARD: board, state: { fixed: false }, CUR: { grid: true }, Math, Number });
  vm.runInContext(code, scope);
  if (name === 'drawPlane') scope[name](board, { ox: 0, oy: 0, u: 40 }, true);
  else scope[name]({}, 0, 0, 40);
  return calls;
}
for (const [file, name] of cases) {
  test(`${file}: only conclusively invisible clipped origin paint is omitted`, () => {
    const after = source(file, name);
    // An executable mutation restores the old unconditional draw. The actual
    // immutable previous-source PNG comparison is a separate Chromium gate.
    const before = after.replace(/      \/\/ 원점 글자가 native clip[\s\S]*?if \(!plainOrigin \|\| !outsideOrigin\) c.fillText\('O', originX, originY\);/,
      "      c.fillText('O', org.x - 6, org.y + 5);");
    assert.notEqual(before,after,'the negative mutation must restore the old draw');
    for (const origin of [{x:150,y:100},{x:12,y:100},{x:150,y:185},{x:150,y:190},{x:150,y:220},{x:-80,y:100},{x:380,y:100},{x:150,y:-80}]) {
      const oldCalls = draw(before,name,origin), newCalls = draw(after,name,origin);
      const original = oldCalls.find(c=>c.name==='fillText'&&c.args[0]==='O');assert.ok(original);
      const [,x,y] = original.args;
      const whollyOutside = x < -2 || x-9 > 302 || y+11 < -2 || y+2 > 202;
      const expected = whollyOutside ? oldCalls.filter(c=>c!==original) : oldCalls;
      assert.deepEqual(JSON.parse(JSON.stringify(newCalls)),JSON.parse(JSON.stringify(expected)),JSON.stringify(origin));
    }
  });
  test(`${file}: uncertain metrics, transforms and effects retain the original origin draw`, () => {
    const code=source(file,name), origin={x:-100,y:700};
    for(const extra of [{measureText:()=>({width:9})},{measureText:()=>({actualBoundingBoxLeft:NaN})},
      {getTransform:()=>undefined},{getTransform:()=>({a:2,b:.1,c:0,d:2,e:0,f:0})},
      {shadowBlur:3},{shadowOffsetX:4},{shadowOffsetY:4},{filter:'blur(2px)'},{globalCompositeOperation:'copy'}])
      assert.ok(draw(code,name,origin,extra).some(c=>c.name==='fillText'&&c.args[0]==='O'));
  });
}
