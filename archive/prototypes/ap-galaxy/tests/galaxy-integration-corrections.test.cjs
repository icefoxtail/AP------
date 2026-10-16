'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../src/orbital-world.js'), 'utf8');

// Validate the literal expression executed by the frame update; don't merely
// check whether explanatory comments state that the phases are aligned.
test('all six core profiles rotate at the same world rate as the star cloud', () => {
  const expr = source.match(/const coreLocalTurn = ([^;]+);/);
  assert.ok(expr, 'expected core rotation expression');
  const compute = new vm.Script(`(group, GALAXY_HUB_SPIN_RATE, coreWorldRate, simTime) => ${expr[1]}`)
    .runInNewContext();
  const hubRate = .14, profileTurn = 1.14;
  for (const worldRate of [.085, .121, .128, .22, .246]) {
    for (const t of [0, .5, 19, 250]) {
      const localAngle = compute({profile: {turn: profileTurn}}, hubRate, worldRate, t);
      const resultingAngle = hubRate * t + localAngle;
      const expected = profileTurn + worldRate * t;
      assert.ok(Math.abs(resultingAngle - expected) < 1e-9,
        `world ${worldRate}, t ${t}: core ${resultingAngle}, stars ${expected}`);
    }
  }
});

test('non-uniform elliptical core normals use correct inverse-transpose view transform', () => {
  const vertex = source.match(/const SUN_VERTEX = `([^`]+)`;/);
  assert.ok(vertex, 'expected vertex shader');
  assert.match(vertex[1], /normalMatrix\s*\*\s*normal/);
  assert.doesNotMatch(vertex[1], /mat3\(modelMatrix\)\s*\*\s*normal/);
  assert.match(vertex[1], /vViewPosition=-viewPosition\.xyz/);
  const shaders = ['SUN_FRAGMENT', 'GALAXY_CORE_FRAGMENT'].map(name => {
    const re = new RegExp("const " + name + " = `([\\s\\S]*?)`;");
    // Keep the check simple even when multiline shader whitespace changes.
    const m = source.match(re);
    assert.ok(m, `${name} shader not found`);
    return m[1];
  });
  for (const fragment of shaders) {
    assert.match(fragment, /normalize\(vViewNormal\)/);
    assert.match(fragment, /normalize\(vViewPosition\)/);
    assert.doesNotMatch(fragment, /cameraPosition\s*-\s*vWorld/);
  }
  // A nonuniformly scaled ellipsoid must *not* transform its normal like a
  // position vector. This point has an oblique normal in an X/Y cross-section.
  const scale=[1.36,.73,.98], n=[1/Math.SQRT2,1/Math.SQRT2,0];
  const normalize = v => {const l=Math.hypot(...v); return v.map(x=>x/l);};
  const proper=normalize(n.map((v,i)=>v/scale[i]));
  const naive=normalize(n.map((v,i)=>v*scale[i]));
  assert.ok(Math.hypot(...proper.map((v,i)=>v-naive[i])) > .3,
    'the nonuniform-scale normal check should be sensitive to the original bug');
});
