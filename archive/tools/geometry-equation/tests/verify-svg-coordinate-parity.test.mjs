import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { verifySvgCoordinateParity } from '../verify-svg-coordinate-parity.mjs';

const verifierPath = fileURLToPath(new URL('../verify-svg-coordinate-parity.mjs', import.meta.url));

function fixture(svg, expectedFacts, { renderResult = 'PASS' } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-svg-coordinate-parity-'));
  const coordinateAnchors = '<line id="model-x-axis" x1="180" y1="300" x2="480" y2="300"/><line id="model-y-axis" x1="300" y1="420" x2="300" y2="180"/><circle id="model-x-unit" cx="360" cy="300" r="1" fill="black"/><circle id="model-y-unit" cx="300" cy="240" r="1" fill="black"/>';
  fs.writeFileSync(path.join(root, 'fixture.svg'), svg.replace('</svg>', `${coordinateAnchors}</svg>`), 'utf8');
  return {
    root,
    input: {
      schemaVersion: 'APMATH_SVG_COORDINATE_PARITY_INPUT_v1',
      questionId: 11,
      svg: 'fixture.svg',
      sourceFactStatus: 'PASS',
      expectedFactStatus: 'PASS',
      coordinateModel: {
        originX: 300,
        originY: 300,
        sx: 60,
        sy: 60,
        anchors: {
          origin: { type: 'INTERSECTION', elements: ['model-x-axis', 'model-y-axis'], expected: [0, 0] },
          xAxis: { element: 'model-x-unit', expected: [1, 0] },
          yAxis: { element: 'model-y-unit', expected: [0, 1] }
        }
      },
      tolerance: 1e-8,
      expectedFacts,
      renderResult,
    },
    cleanup: () => fs.rmSync(root, { recursive: true, force: true }),
  };
}

test('good point: geometry parity passes', () => {
  const f = fixture('<svg><circle id="point-P" cx="360" cy="180" r="4"/><text>(1,2)</text></svg>', [{ factId: 'P', type: 'POINT', element: 'point-P', expected: [1, 2] }]);
  try {
    const result = verifySvgCoordinateParity({ root: f.root, input: f.input });
    assert.equal(result.svgMathStatus, 'PASS');
    assert.equal(result.svgFinalStatus, 'PASS');
    assert.equal(result.facts[0].observed[0], 1);
    assert.equal(result.facts[0].observed[1], 2);
  } finally { f.cleanup(); }
});

test('coordinate model spoof: mismatched anchors block SVG math pass', () => {
  const f = fixture('<svg><circle id="point-P" cx="360" cy="180" r="4"/></svg>', [{ factId: 'P', type: 'POINT', element: 'point-P', expected: [1, 2] }]);
  try {
    f.input.coordinateModel.originX = 240;
    const result = verifySvgCoordinateParity({ root: f.root, input: f.input });
    assert.equal(result.coordinateModelParity, 'FAIL');
    assert.equal(result.svgMathStatus, 'FAIL');
  } finally { f.cleanup(); }
});

test('fake origin helper point cannot replace the actual axis intersection', () => {
  const f = fixture('<svg><circle id="fake-origin" cx="240" cy="300" r="1" fill="black"/><circle id="point-P" cx="360" cy="180" r="4"/></svg>', [{ factId: 'P', type: 'POINT', element: 'point-P', expected: [1, 2] }]);
  try {
    f.input.coordinateModel.originX = 240;
    const result = verifySvgCoordinateParity({ root: f.root, input: f.input });
    assert.equal(result.coordinateModelParity, 'FAIL');
    assert.equal(result.svgMathStatus, 'FAIL');
    assert.deepEqual(result.coordinateModelAnchors.find(anchor => anchor.role === 'origin').observed, [1, 0]);
  } finally { f.cleanup(); }
});

test('oversized global and per-fact tolerances are rejected', () => {
  const f = fixture('<svg><circle id="point-P" cx="360" cy="180" r="4"/></svg>', [{ factId: 'P', type: 'POINT', element: 'point-P', expected: [1, 2], tolerance: 0.06 }]);
  try {
    f.input.tolerance = 0.06;
    const result = verifySvgCoordinateParity({ root: f.root, input: f.input });
    assert.equal(result.tolerancePolicy.status, 'FAIL');
    assert.equal(result.svgMathStatus, 'FAIL');
    assert.ok(result.failures.some(value => value.startsWith('TOLERANCE_EXCEEDS_MAX')));
    assert.ok(result.failures.some(value => value.startsWith('FACT_TOLERANCE:P_EXCEEDS_MAX')));
  } finally { f.cleanup(); }
});

test('bent polyline cannot be used to spoof a line slope fact', () => {
  const f = fixture('<svg><polyline id="bent-line" points="240,360 360,180 480,360"/></svg>', [{ factId: 'LINE', type: 'LINE_SLOPE', element: 'bent-line', expected: -1 }]);
  try {
    const result = verifySvgCoordinateParity({ root: f.root, input: f.input });
    assert.equal(result.facts[0].result, 'NOT_TESTED');
    assert.match(result.facts[0].reason, /^LINE_ELEMENT_REQUIRED/);
    assert.equal(result.svgMathStatus, 'FAIL');
  } finally { f.cleanup(); }
});

test('open or closed state without explicit circle fill is not tested', () => {
  const f = fixture('<svg><circle id="endpoint" cx="360" cy="180" r="4"/><line id="branch" x1="300" y1="300" x2="360" y2="180"/></svg>', [{ factId: 'OPEN', type: 'OPEN_CLOSED_POINT', element: 'endpoint', branchElement: 'branch', expected: { point: [1, 2], branchPoint: [1, 2], closed: false } }]);
  try {
    const result = verifySvgCoordinateParity({ root: f.root, input: f.input });
    assert.equal(result.facts[0].result, 'NOT_TESTED');
    assert.equal(result.facts[0].reason, 'OPEN_CLOSED_EXPLICIT_FILL_REQUIRED');
    assert.equal(result.svgMathStatus, 'FAIL');
  } finally { f.cleanup(); }
});

test('open or closed state requires a circle element', () => {
  const f = fixture('<svg><rect id="endpoint" x="356" y="176" width="8" height="8" fill="none"/><line id="branch" x1="300" y1="300" x2="360" y2="180"/></svg>', [{ factId: 'OPEN', type: 'OPEN_CLOSED_POINT', element: 'endpoint', pointIndex: 'center', branchElement: 'branch', expected: { point: [1, 2], branchPoint: [1, 2], closed: false } }]);
  try {
    const result = verifySvgCoordinateParity({ root: f.root, input: f.input });
    assert.equal(result.facts[0].result, 'NOT_TESTED');
    assert.equal(result.facts[0].reason, 'OPEN_CLOSED_CIRCLE_REQUIRED');
    assert.equal(result.svgMathStatus, 'FAIL');
  } finally { f.cleanup(); }
});

test('CLI writes machine-readable evidence for a passing SVG', () => {
  const f = fixture('<svg><circle id="point-P" cx="360" cy="180" r="4"/></svg>', [{ factId: 'P', type: 'POINT', element: 'point-P', expected: [1, 2] }]);
  try {
    const inputPath = path.join(f.root, 'input.json'); const outPath = path.join(f.root, 'evidence.json');
    fs.writeFileSync(inputPath, `${JSON.stringify(f.input)}\n`, 'utf8');
    const run = spawnSync(process.execPath, [verifierPath, '--root', f.root, '--input', inputPath, '--out', outPath], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr || run.stdout);
    const evidence = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    assert.equal(evidence.schemaVersion, 'APMATH_SVG_COORDINATE_PARITY_EVIDENCE_v1');
    assert.equal(evidence.svgMathStatus, 'PASS');
    assert.match(evidence.svgSha256, /^sha256:[a-f0-9]{64}$/);
  } finally { f.cleanup(); }
});

test('wrong point: correct text cannot spoof geometry parity', () => {
  const f = fixture('<svg><circle id="point-P" cx="300" cy="180" r="4"/><text>(1,2)</text><title>point is 1,2</title></svg>', [{ factId: 'P', type: 'POINT', element: 'point-P', expected: [1, 2] }]);
  try {
    const result = verifySvgCoordinateParity({ root: f.root, input: f.input });
    assert.equal(result.svgMathStatus, 'FAIL');
    assert.equal(result.facts[0].result, 'FAIL');
    assert.deepEqual(result.facts[0].observed, [0, 2]);
  } finally { f.cleanup(); }
});

test('wrong slope: correct line label cannot spoof geometry parity', () => {
  const f = fixture('<svg><line id="main-line" x1="240" y1="360" x2="480" y2="420"/><text>y=-x-1</text></svg>', [{ factId: 'LINE', type: 'LINE_SLOPE', element: 'main-line', expected: -1 }]);
  try {
    const result = verifySvgCoordinateParity({ root: f.root, input: f.input });
    assert.equal(result.svgMathStatus, 'FAIL');
    assert.equal(result.facts[0].result, 'FAIL');
    assert.equal(result.facts[0].observed, -0.25);
  } finally { f.cleanup(); }
});

test('wrong midpoint: point relation is checked from actual coordinates', () => {
  const f = fixture('<svg><circle id="A" cx="300" cy="300" r="4"/><circle id="B" cx="540" cy="180" r="4"/><circle id="C" cx="480" cy="240" r="4"/></svg>', [{ factId: 'C_MIDPOINT', type: 'MIDPOINT', element: 'C', points: ['A', 'B'], expected: [2, 1] }]);
  try {
    const result = verifySvgCoordinateParity({ root: f.root, input: f.input });
    assert.equal(result.svgMathStatus, 'FAIL');
    assert.equal(result.facts[0].result, 'FAIL');
    assert.deepEqual(result.facts[0].observed.point, [3, 1]);
    assert.deepEqual(result.facts[0].observed.derivedFromElements, [2, 1]);
  } finally { f.cleanup(); }
});
