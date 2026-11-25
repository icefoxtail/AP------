import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { pythonWorker } from '../production/worker.mjs';

const observerScript = fileURLToPath(new URL('../production/graph-observer-worker.py', import.meta.url));

const suncheonQ20Plan = {
  capability: 'multi-curve-figure-v1',
  caption: '두 로그함수와 네 개의 구간 제한 절댓값 함수의 그래프',
  graphPlan: {
    family: 'multi-curve',
    viewport: [-2, 8, -2, 10],
    axisTickValues: { x: ['1', '3', '7'], y: ['1', '3', '5', '7', '9'] },
    curves: [
      { id: 'g', kind: 'LOGARITHMIC', base: '2', coefficients: ['1', '1', '-1', '2'], domain: ['105/100', '8'], color: 'BLUE' },
      { id: 'h', kind: 'LOGARITHMIC', base: '1/2', coefficients: ['1', '1', '-1', '1'], domain: ['101/100', '8'], color: 'WARM' },
      { id: 'f1', kind: 'ABSOLUTE_VALUE', coefficients: ['-3', '1', '-2', '3'], domain: ['2', '4'], hideLabel: true },
      { id: 'f2', kind: 'ABSOLUTE_VALUE', coefficients: ['-3', '1', '-2', '5'], domain: ['1', '5'], hideLabel: true },
      { id: 'f3', kind: 'ABSOLUTE_VALUE', coefficients: ['-3', '1', '-2', '7'], domain: ['0', '6'], hideLabel: true },
      { id: 'f4', kind: 'ABSOLUTE_VALUE', coefficients: ['-3', '1', '-2', '9'], domain: ['-1', '7'], hideLabel: true },
    ],
  },
};

async function checked(packet, options) {
  const result = await pythonWorker(packet, options);
  assert.equal(result.status, 'OK', JSON.stringify(result.result));
  return result.result;
}

function polyline(svg, id) {
  const tag = svg.match(new RegExp(`<polyline\\b[^>]*data-branch="CURVE_${id}"[^>]*/>`))?.[0];
  assert.ok(tag, `missing CURVE_${id}`);
  const raw = tag.match(/points="([^"]+)"/)[1];
  return raw.split(/\s+/).map((pair) => pair.split(',').map(Number));
}

test('ABSOLUTE_VALUE multi-curve renders 4 tents + 2 logs and passes independent observer', async () => {
  const { graphPlan } = await checked({ action: 'frame_graph', graphPlan: suncheonQ20Plan.graphPlan });
  const { svg, transform } = await checked({ action: 'graph', graphPlan });
  const { result: obs } = await pythonWorker({ graphPlan, svg, transform }, { script: observerScript });
  assert.equal(obs.status, 'PASS', JSON.stringify(obs.errors));
  assert.equal(obs.curveCount, 6);
  for (const [id, peakY] of [['f1', 3], ['f2', 5], ['f3', 7], ['f4', 9]]) {
    const pts = polyline(svg, id).map(([px, py]) => [
      (px - transform.originX) / transform.sx,
      (transform.originY - py) / transform.sy,
    ]);
    assert.ok(pts.some(([x, y]) => Math.abs(x - 3) < 1e-3 && Math.abs(y - peakY) < 1e-3), `missing exact peak (3,${peakY}) for ${id}`);
  }
});

test('ABSOLUTE_VALUE rejects zero A/k, missing domain, and inverseOf', async () => {
  for (const [bad, code] of [
    [{ ...suncheonQ20Plan.graphPlan, curves: [{ id: 'a', kind: 'ABSOLUTE_VALUE', coefficients: ['0', '0', '1', '0'], domain: ['0', '2'] }, suncheonQ20Plan.graphPlan.curves[2]] }, 'MULTI_CURVE_COEFFICIENT_INVALID:a'],
    [{ ...suncheonQ20Plan.graphPlan, curves: [{ id: 'a', kind: 'ABSOLUTE_VALUE', coefficients: ['-3', '1', '0', '3'], domain: ['2', '4'] }, suncheonQ20Plan.graphPlan.curves[2]] }, 'MULTI_CURVE_COEFFICIENT_INVALID:a'],
    [{ ...suncheonQ20Plan.graphPlan, curves: [{ id: 'a', kind: 'ABSOLUTE_VALUE', coefficients: ['-3', '1', '-2', '3'] }, suncheonQ20Plan.graphPlan.curves[2]] }, 'MULTI_CURVE_DOMAIN_INVALID:a'],
    [{ ...suncheonQ20Plan.graphPlan, curves: [suncheonQ20Plan.graphPlan.curves[2], { id: 'inv', inverseOf: 'f1', domain: ['1', '3'] }] }, 'MULTI_CURVE_INVERSE_UNSUPPORTED:inv'],
  ]) {
    const res = await pythonWorker({ action: 'frame_graph', graphPlan: bad });
    assert.equal(res.status, 'ERROR');
    assert.ok(String(res.result?.code || res.result?.message || res.result).includes(code), `${JSON.stringify(res)} expected ${code}`);
  }
});
