/*
 * Minimal SVG coordinate-parity verifier.
 *
 * This is deliberately a narrow independent-review aid, not a general SVG
 * renderer or path/transform engine.  Expected facts are supplied by an
 * independent problem solve; this tool reads only geometric SVG attributes
 * to calculate observed facts.  Text/title/desc/data-* never participate in
 * an observed value.
 *
 * Usage:
 *   node archive/tools/geometry-equation/verify-svg-coordinate-parity.mjs \
 *     --input reports/q11-svg-coordinate-input.json \
 *     --out reports/q11-svg-coordinate-verification.json
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const EPSILON = 1e-9;
const SUPPORTED_ELEMENTS = new Set(['circle', 'line', 'polyline', 'polygon', 'rect']);
const PASS = 'PASS';
const FAIL = 'FAIL';
const NOT_TESTED = 'NOT_TESTED';

const isFiniteNumber = value => typeof value === 'number' && Number.isFinite(value);
const sha256 = value => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
const clampZero = value => Math.abs(value) < EPSILON ? 0 : value;
const pointDelta = (actual, expected) => [actual[0] - expected[0], actual[1] - expected[1]];
const maxAbs = values => Math.max(...values.map(value => Math.abs(value)));

function parseAttributes(source) {
  const attrs = {};
  for (const match of String(source).matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    attrs[match[1]] = match[2] ?? match[3] ?? '';
  }
  return attrs;
}

function numeric(attrs, field) {
  const value = Number(attrs[field]);
  return Number.isFinite(value) ? value : null;
}

function parsePoints(raw) {
  const values = String(raw ?? '').trim().split(/[\s,]+/).filter(Boolean).map(Number);
  if (values.length < 4 || values.length % 2 !== 0 || values.some(value => !Number.isFinite(value))) return null;
  const points = [];
  for (let index = 0; index < values.length; index += 2) points.push([values[index], values[index + 1]]);
  return points;
}

function parseSvgGeometry(svgText) {
  if (!/<svg\b[^>]*>/i.test(svgText) || !/<\/svg\s*>/i.test(svgText)) {
    return { status: FAIL, errors: ['SVG_XML_PARSE_FAIL'], elements: new Map() };
  }
  // The small verifier does not silently produce wrong screen coordinates for
  // a transformed object. A future need can add a scoped transform adapter.
  if (/\btransform\s*=/i.test(svgText)) {
    return { status: NOT_TESTED, errors: ['SVG_TRANSFORM_NOT_SUPPORTED_BY_MINIMAL_VERIFIER'], elements: new Map() };
  }
  const elements = new Map();
  const duplicateIds = [];
  const tagPattern = /<(circle|line|polyline|polygon|rect)\b([^>]*)>/gi;
  for (const match of svgText.matchAll(tagPattern)) {
    const tag = match[1].toLowerCase();
    const attrs = parseAttributes(match[2]);
    const id = attrs.id;
    if (!id) continue;
    if (elements.has(id)) {
      duplicateIds.push(id);
      continue;
    }
    let points = null;
    if (tag === 'circle') {
      const cx = numeric(attrs, 'cx'); const cy = numeric(attrs, 'cy');
      if (cx !== null && cy !== null) points = [[cx, cy]];
    } else if (tag === 'line') {
      const x1 = numeric(attrs, 'x1'); const y1 = numeric(attrs, 'y1'); const x2 = numeric(attrs, 'x2'); const y2 = numeric(attrs, 'y2');
      if ([x1, y1, x2, y2].every(value => value !== null)) points = [[x1, y1], [x2, y2]];
    } else if (tag === 'polyline' || tag === 'polygon') {
      points = parsePoints(attrs.points);
    } else if (tag === 'rect') {
      const x = numeric(attrs, 'x') ?? 0; const y = numeric(attrs, 'y') ?? 0;
      const width = numeric(attrs, 'width'); const height = numeric(attrs, 'height');
      if (width !== null && height !== null) points = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
    }
    if (!points) {
      elements.set(id, { id, tag, attrs, points: null, error: 'ELEMENT_COORDINATES_INVALID' });
      continue;
    }
    elements.set(id, { id, tag, attrs, points });
  }
  return duplicateIds.length
    ? { status: FAIL, errors: duplicateIds.map(id => `SVG_DUPLICATE_ID:${id}`), elements }
    : { status: PASS, errors: [], elements };
}

function getElement(parsed, selector) {
  const id = String(selector ?? '').replace(/^#/, '');
  const element = parsed.elements.get(id);
  if (!element) throw new Error(`ELEMENT_NOT_FOUND:${selector}`);
  if (!SUPPORTED_ELEMENTS.has(element.tag)) throw new Error(`ELEMENT_TYPE_NOT_SUPPORTED:${element.tag}`);
  if (!element.points) throw new Error(`${element.error ?? 'ELEMENT_COORDINATES_INVALID'}:${selector}`);
  return element;
}

function inversePoint(screen, model) {
  return [
    clampZero((screen[0] - model.originX) / model.sx),
    clampZero((model.originY - screen[1]) / model.sy),
  ];
}

function observedPoint(parsed, selector, model, pointIndex = 0) {
  const element = getElement(parsed, selector);
  let screen;
  if (element.tag === 'rect' && pointIndex === 'center') {
    screen = [(element.points[0][0] + element.points[2][0]) / 2, (element.points[0][1] + element.points[2][1]) / 2];
  } else {
    const index = pointIndex === 'end' ? element.points.length - 1 : pointIndex === 'start' ? 0 : Number(pointIndex);
    if (!Number.isInteger(index) || index < 0 || index >= element.points.length) throw new Error(`POINT_INDEX_INVALID:${selector}`);
    screen = element.points[index];
  }
  return { element, screen, math: inversePoint(screen, model) };
}

function observedLine(parsed, selector, model) {
  const element = getElement(parsed, selector);
  if (!['line', 'polyline', 'polygon'].includes(element.tag) || element.points.length < 2) throw new Error(`LINE_ENDPOINTS_REQUIRED:${selector}`);
  const first = inversePoint(element.points[0], model);
  const last = inversePoint(element.points[element.points.length - 1], model);
  const dx = last[0] - first[0];
  const dy = last[1] - first[1];
  if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON) throw new Error(`DEGENERATE_LINE:${selector}`);
  const slope = Math.abs(dx) < EPSILON ? null : dy / dx;
  const xIntercept = Math.abs(dy) < EPSILON ? null : Math.abs(dx) < EPSILON ? first[0] : first[0] - (first[1] * dx) / dy;
  const yIntercept = slope === null ? null : first[1] - slope * first[0];
  return { element, first, last, direction: [dx, dy], slope: slope === null ? null : clampZero(slope), xIntercept: xIntercept === null ? null : clampZero(xIntercept), yIntercept: yIntercept === null ? null : clampZero(yIntercept) };
}

function intersectLines(left, right) {
  const [x1, y1] = left.first; const [x2, y2] = left.last;
  const [x3, y3] = right.first; const [x4, y4] = right.last;
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denominator) < EPSILON) throw new Error('LINES_PARALLEL_NO_INTERSECTION');
  return [
    clampZero(((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator),
    clampZero(((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator),
  ];
}

function rootFromElement(parsed, selector, model) {
  const element = getElement(parsed, selector);
  const points = element.points.map(point => inversePoint(point, model));
  for (let index = 1; index < points.length; index += 1) {
    const [x1, y1] = points[index - 1]; const [x2, y2] = points[index];
    if (Math.abs(y1) < EPSILON) return x1;
    if (Math.abs(y2) < EPSILON) return x2;
    if (y1 * y2 < 0) return clampZero(x1 + ((0 - y1) * (x2 - x1)) / (y2 - y1));
  }
  throw new Error(`ROOT_NOT_OBSERVED:${selector}`);
}

function compareScalar(expected, observed, tolerance) {
  if (!isFiniteNumber(expected) || !isFiniteNumber(observed)) return { result: FAIL, delta: null, reason: 'SCALAR_VALUE_INVALID' };
  const delta = observed - expected;
  return { result: Math.abs(delta) <= tolerance ? PASS : FAIL, delta, reason: null };
}

function comparePoint(expected, observed, tolerance) {
  if (!Array.isArray(expected) || expected.length !== 2 || expected.some(value => !isFiniteNumber(value)) || !Array.isArray(observed)) return { result: FAIL, delta: null, reason: 'POINT_VALUE_INVALID' };
  const delta = pointDelta(observed, expected);
  return { result: maxAbs(delta) <= tolerance ? PASS : FAIL, delta, reason: null };
}

function normaliseFactType(value) {
  return String(value ?? '').toUpperCase().replaceAll('-', '_').replaceAll(' ', '_');
}

function verifyFact(fact, parsed, model, defaultTolerance) {
  const type = normaliseFactType(fact.type);
  const tolerance = isFiniteNumber(fact.tolerance) && fact.tolerance >= 0 ? fact.tolerance : defaultTolerance;
  const base = { factId: fact.factId ?? fact.id ?? null, type, element: fact.element ?? fact.elements ?? null, expected: fact.expected ?? null, observed: null, delta: null, tolerance, result: FAIL, reason: null };
  try {
    if (type === 'POINT') {
      const observed = observedPoint(parsed, fact.element, model, fact.pointIndex ?? 0).math;
      const compared = comparePoint(fact.expected, observed, tolerance);
      return { ...base, observed, ...compared };
    }
    if (type === 'LINE_SLOPE' || type === 'SLOPE') {
      const observed = observedLine(parsed, fact.element, model).slope;
      const compared = compareScalar(fact.expected, observed, tolerance);
      return { ...base, observed, ...compared };
    }
    if (type === 'INTERCEPT') {
      const line = observedLine(parsed, fact.element, model);
      const expected = fact.expected ?? {};
      const observed = { x: line.xIntercept, y: line.yIntercept };
      const x = expected.x === undefined ? { result: PASS, delta: null } : compareScalar(expected.x, observed.x, tolerance);
      const y = expected.y === undefined ? { result: PASS, delta: null } : compareScalar(expected.y, observed.y, tolerance);
      return { ...base, expected, observed, delta: { x: x.delta, y: y.delta }, result: x.result === PASS && y.result === PASS ? PASS : FAIL, reason: x.reason ?? y.reason ?? null };
    }
    if (type === 'MIDPOINT') {
      const [leftSelector, rightSelector] = fact.points ?? [];
      const left = observedPoint(parsed, leftSelector, model, 0).math;
      const right = observedPoint(parsed, rightSelector, model, 0).math;
      const actual = observedPoint(parsed, fact.element, model, fact.pointIndex ?? 0).math;
      const expectedMidpoint = fact.expected ?? [(left[0] + right[0]) / 2, (left[1] + right[1]) / 2];
      const derived = [(left[0] + right[0]) / 2, (left[1] + right[1]) / 2];
      const target = comparePoint(expectedMidpoint, actual, tolerance);
      const relation = comparePoint(derived, actual, tolerance);
      return { ...base, expected: expectedMidpoint, observed: { point: actual, derivedFromElements: derived }, delta: target.delta, result: target.result === PASS && relation.result === PASS ? PASS : FAIL, reason: target.reason ?? relation.reason ?? (relation.result === FAIL ? 'MIDPOINT_RELATION_FAIL' : null) };
    }
    if (type === 'PARALLEL' || type === 'PERPENDICULAR') {
      const [leftSelector, rightSelector] = fact.elements ?? [];
      const left = observedLine(parsed, leftSelector, model); const right = observedLine(parsed, rightSelector, model);
      const cross = left.direction[0] * right.direction[1] - left.direction[1] * right.direction[0];
      const dot = left.direction[0] * right.direction[0] + left.direction[1] * right.direction[1];
      const scale = Math.max(Math.hypot(...left.direction) * Math.hypot(...right.direction), EPSILON);
      const residual = type === 'PARALLEL' ? cross / scale : dot / scale;
      const expected = fact.expected ?? true;
      const result = expected === true && Math.abs(residual) <= tolerance ? PASS : FAIL;
      return { ...base, expected, observed: { residual, leftDirection: left.direction, rightDirection: right.direction }, delta: residual, result, reason: result === PASS ? null : `${type}_RELATION_FAIL` };
    }
    if (type === 'ROOT') {
      const observed = rootFromElement(parsed, fact.element, model);
      const compared = compareScalar(fact.expected, observed, tolerance);
      return { ...base, observed, ...compared };
    }
    if (type === 'INTERSECTION') {
      const [leftSelector, rightSelector] = fact.elements ?? [];
      const observed = intersectLines(observedLine(parsed, leftSelector, model), observedLine(parsed, rightSelector, model));
      const compared = comparePoint(fact.expected, observed, tolerance);
      return { ...base, observed, ...compared };
    }
    if (type === 'OPEN_CLOSED_POINT') {
      const element = getElement(parsed, fact.element);
      const observedPointValue = observedPoint(parsed, fact.element, model, fact.pointIndex ?? 0).math;
      const fill = String(element.attrs.fill ?? '').trim().toLowerCase();
      const closed = !['none', 'white', '#fff', '#ffffff', 'transparent'].includes(fill);
      const expected = fact.expected ?? {};
      const coordinate = comparePoint(expected.point, observedPointValue, tolerance);
      const state = typeof expected.closed === 'boolean' && expected.closed === closed ? PASS : FAIL;
      if (!fact.branchElement) return { ...base, expected, observed: { point: observedPointValue, closed }, delta: coordinate.delta, result: NOT_TESTED, reason: 'OPEN_CLOSED_BRANCH_ELEMENT_REQUIRED' };
      const branch = observedPoint(parsed, fact.branchElement, model, fact.branchPointIndex ?? 'end').math;
      const branchExpected = expected.branchPoint ?? expected.point;
      const branchParity = comparePoint(branchExpected, branch, tolerance);
      return { ...base, expected, observed: { point: observedPointValue, closed, branch }, delta: coordinate.delta, result: coordinate.result === PASS && state === PASS && branchParity.result === PASS ? PASS : FAIL, reason: coordinate.reason ?? branchParity.reason ?? (state === FAIL ? 'OPEN_CLOSED_STATE_FAIL' : branchParity.result === FAIL ? 'OPEN_CLOSED_BRANCH_APPROACH_FAIL' : null) };
    }
    return { ...base, result: NOT_TESTED, reason: `FACT_TYPE_NOT_SUPPORTED:${type}` };
  } catch (error) {
    return { ...base, result: NOT_TESTED, reason: error.message };
  }
}

function validateInput(input) {
  const errors = [];
  if (!input || typeof input !== 'object') errors.push('INPUT_OBJECT_REQUIRED');
  if (input?.schemaVersion && input.schemaVersion !== 'APMATH_SVG_COORDINATE_PARITY_INPUT_v1') errors.push('INPUT_SCHEMA_VERSION_INVALID');
  if (input?.sourceFactStatus !== PASS) errors.push(input?.sourceFactStatus === 'SOURCE_BLOCKED' ? 'SOURCE_BLOCKED' : 'SOURCE_FACT_NOT_PASS');
  if (input?.expectedFactStatus !== PASS) errors.push('EXPECTED_FACT_NOT_PASS');
  if (!Array.isArray(input?.expectedFacts) || input.expectedFacts.length === 0) errors.push('EXPECTED_FACT_MISSING');
  const model = input?.coordinateModel;
  if (!model || ![model.originX, model.originY, model.sx, model.sy].every(isFiniteNumber) || model.sx <= 0 || model.sy <= 0) errors.push('COORDINATE_MODEL_INVALID');
  for (const fact of input?.expectedFacts ?? []) if (!fact || typeof fact !== 'object' || !fact.type || !(fact.factId ?? fact.id)) errors.push('EXPECTED_FACT_INVALID');
  return errors;
}

export function verifySvgCoordinateParity({ root = process.cwd(), input }) {
  const inputErrors = validateInput(input);
  const svgPath = input?.svg;
  let svgBytes = null;
  let parsed = { status: NOT_TESTED, errors: ['SVG_NOT_READ'], elements: new Map() };
  if (!inputErrors.length && typeof svgPath === 'string' && svgPath) {
    const absolute = path.isAbsolute(svgPath) ? svgPath : path.resolve(root, svgPath);
    try {
      svgBytes = fs.readFileSync(absolute);
      parsed = parseSvgGeometry(svgBytes.toString('utf8'));
    } catch (error) {
      parsed = { status: FAIL, errors: [`SVG_READ_FAIL:${error.code ?? error.message}`], elements: new Map() };
    }
  } else if (!svgPath) inputErrors.push('SVG_PATH_MISSING');

  const defaultTolerance = isFiniteNumber(input?.tolerance) && input.tolerance >= 0 ? input.tolerance : 1e-6;
  const facts = inputErrors.length || parsed.status !== PASS
    ? []
    : input.expectedFacts.map(fact => verifyFact(fact, parsed, input.coordinateModel, defaultTolerance));
  const factFailures = facts.filter(fact => fact.result !== PASS);
  const failures = [...inputErrors, ...parsed.errors, ...factFailures.map(fact => `${fact.factId ?? fact.type}:${fact.reason ?? 'EXPECTED_OBSERVED_PARITY_FAIL'}`)];
  const elementExtractionStatus = parsed.status === PASS && facts.length === input?.expectedFacts?.length ? PASS : parsed.status;
  const observedFactStatus = facts.length && facts.every(fact => fact.observed !== null && fact.result !== NOT_TESTED) ? PASS : NOT_TESTED;
  const expectedObservedParity = facts.length && facts.every(fact => fact.result === PASS) ? PASS : FAIL;
  const svgMathStatus = inputErrors.length === 0 && parsed.status === PASS && expectedObservedParity === PASS ? PASS : FAIL;
  const renderResult = input?.renderResult ?? NOT_TESTED;
  const svgFinalStatus = svgMathStatus === PASS && renderResult === PASS ? PASS : FAIL;
  return {
    schemaVersion: 'APMATH_SVG_COORDINATE_PARITY_EVIDENCE_v1',
    questionId: input?.questionId ?? null,
    svg: svgPath ?? null,
    svgSha256: svgBytes ? sha256(svgBytes) : null,
    sourceFactStatus: input?.sourceFactStatus ?? NOT_TESTED,
    expectedFactStatus: input?.expectedFactStatus ?? NOT_TESTED,
    coordinateModel: input?.coordinateModel ?? null,
    expectedFactCount: input?.expectedFacts?.length ?? 0,
    observedFactCount: facts.filter(fact => fact.observed !== null).length,
    factParityPassCount: facts.filter(fact => fact.result === PASS).length,
    elementExtractionStatus,
    observedFactStatus,
    expectedObservedParity,
    facts,
    svgMathStatus,
    renderResult,
    svgFinalStatus,
    failures,
  };
}

function parseArgs(argv) {
  const value = flag => {
    const index = argv.indexOf(flag);
    return index >= 0 ? argv[index + 1] : null;
  };
  return { input: value('--input'), out: value('--out'), root: value('--root') };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input || !args.out) {
    console.error('Usage: node verify-svg-coordinate-parity.mjs --input <input.json> --out <evidence.json> [--root <repository-root>]');
    process.exitCode = 2;
    return;
  }
  const inputPath = path.resolve(args.input);
  const root = args.root ? path.resolve(args.root) : path.dirname(inputPath);
  let input;
  try {
    input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  } catch (error) {
    console.error(`INPUT_READ_FAIL:${error.message}`);
    process.exitCode = 2;
    return;
  }
  const result = verifySvgCoordinateParity({ root, input });
  const outputPath = path.resolve(args.out);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ svgMathStatus: result.svgMathStatus, svgFinalStatus: result.svgFinalStatus, expectedFactCount: result.expectedFactCount, factParityPassCount: result.factParityPassCount, out: outputPath }, null, 2));
  if (result.svgMathStatus !== PASS) process.exitCode = 1;
}

const thisFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(thisFile)) main();
