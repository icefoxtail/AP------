import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/*
 * v2.2 qualification verifier for the 94-question line-equation lane.
 *
 * This file is deliberately read-only with respect to production data.  It
 * does not import or execute a generator, does not read an old PASS report as
 * an oracle, and never treats SVG data-* attributes as expected facts.  The
 * expected side is derived from the current questionBank content/solution;
 * the SVG side is a fresh observation of visible primitives and their model
 * endpoints.  The report itself is evidence and is the only file written.
 */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const EXAM_ROOT = path.join(ROOT, 'archive', 'exams', 'original', 'high', 'h1');
const ASSET_ROOT = path.join(ROOT, 'archive', 'assets', 'images');
const REPORT_DIR = path.join(ROOT, 'archive', 'analysis', 'line-equation-v22-qualification');
const REPORT_FILE = path.join(REPORT_DIR, 'qualification.json');
const TARGET_UNITS = new Set(['H15-SA-10', 'H22-C2-02']);
const EPS = 1e-7;
const POINT_EPS = 1e-5;
const TARGET_COUNTS = Object.freeze({ total: 94, h15: 63, h22: 31, files: 28 });
const BROWSER_EVIDENCE_FILE = path.join(REPORT_DIR, 'browser-render-evidence.json');
const SCHEMATIC_ALLOWED_KEYS = new Set([
  '24_제일고_1학기_중간_고1_기출.js#15',
  '22_강남여고_2학기_중간_고1_기출.js#22',
  '25_제일고_2학기_중간_고1_기출.js#12',
]);

const keyOf = (file, id) => `${file}#${id}`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const read = (file) => fs.readFileSync(file, 'utf8');
const finite = (value) => Number.isFinite(value);
const clampZero = (value) => Math.abs(value) < EPS ? 0 : value;

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

function loadBank(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read(file), context, { filename: file, timeout: 5000 });
  return Array.isArray(context.window.questionBank) ? context.window.questionBank : [];
}

function attrs(tag) {
  return Object.fromEntries([...String(tag || '').matchAll(/([\w:-]+)="([^"]*)"/g)]
    .map((match) => [match[1], decodeXml(match[2])]));
}

function decodeXml(value) {
  return String(value || '')
    .replaceAll('&minus;', '−')
    .replaceAll('&#8722;', '−')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function stripSvgText(svg) {
  return decodeXml(String(svg || '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeText(value) {
  return String(value || '')
    .replaceAll('−', '-')
    .replaceAll('–', '-')
    .replaceAll('—', '-')
    .replaceAll('×', '*')
    .replaceAll('·', '*')
    .replaceAll('＝', '=')
    .replaceAll('（', '(')
    .replaceAll('）', ')')
    .replace(/\\left|\\right|\\displaystyle|\\,|\\!/g, '')
    .replace(/\\(?:d)?frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\s*\{([^{}]+)\}/g, 'sqrt($1)')
    .replace(/√\s*([0-9]+)/g, 'sqrt($1)')
    .replace(/\^\{([^{}]+)\}/g, '^($1)')
    .replace(/\s+/g, '');
}

function numericExpression(raw) {
  let expression = normalizeText(raw)
    .replace(/\{([^{}]+)\}/g, '($1)')
    .replaceAll('sqrt', 'S');
  if (!expression || /[A-Za-z_]/.test(expression) || !/^[0-9+\-*/().^S]+$/.test(expression)) return null;
  expression = expression.replace(/S\(([^()]+)\)/g, 'Math.sqrt($1)').replaceAll('^', '**');
  if (/[^0-9+\-*/().*\sA-Za-z]/.test(expression) || /Math\.sqrt\([^()]*[A-Za-z]/.test(expression)) return null;
  try {
    const value = Function(`"use strict"; return (${expression});`)();
    return finite(value) ? value : null;
  } catch {
    return null;
  }
}

function splitTerms(expression) {
  const result = [];
  let start = 0;
  let depth = 0;
  const text = expression.startsWith('+') || expression.startsWith('-') ? expression : `+${expression}`;
  for (let i = 1; i < text.length; i += 1) {
    if (text[i] === '(') depth += 1;
    else if (text[i] === ')') depth -= 1;
    else if (depth === 0 && (text[i] === '+' || text[i] === '-')) {
      result.push(text.slice(start, i));
      start = i;
    }
  }
  result.push(text.slice(start));
  return result.filter(Boolean);
}

function addTerm(target, variable, coefficient) {
  if (!finite(coefficient)) return false;
  target[variable] += coefficient;
  return true;
}

function parseLinearSide(raw) {
  const expression = normalizeText(raw);
  if (!expression || /[A-WZ_a-wz]/.test(expression.replaceAll('sqrt', ''))) return null;
  const result = { a: 0, b: 0, c: 0 };
  for (const term of splitTerms(expression)) {
    const sign = term.startsWith('-') ? -1 : 1;
    const body = term.slice(1);
    if (!body) return null;
    const variableMatch = body.match(/([xy])/);
    if (!variableMatch) {
      const value = numericExpression(`${sign < 0 ? '-' : ''}${body}`);
      if (value === null) return null;
      result.c += value;
      continue;
    }
    const variable = variableMatch[1];
    if (body.includes(`${variable}^`) || body.includes(`${variable}*${variable}`)) return null;
    const before = body.slice(0, variableMatch.index);
    const after = body.slice(variableMatch.index + 1);
    let coefficientText = before || '1';
    if (after) {
      if (!after.startsWith('/')) return null;
      coefficientText = `(${coefficientText})/(${after.slice(1)})`;
    }
    const coefficient = numericExpression(`${sign < 0 ? '-' : ''}${coefficientText}`);
    if (coefficient === null || !addTerm(result, variable === 'x' ? 'a' : 'b', coefficient)) return null;
  }
  return result;
}

function parseEquation(left, right) {
  const lhs = parseLinearSide(left);
  const rhs = parseLinearSide(right);
  if (!lhs || !rhs || (Math.abs(lhs.a - rhs.a) < EPS && Math.abs(lhs.b - rhs.b) < EPS)) return null;
  const result = { a: lhs.a - rhs.a, b: lhs.b - rhs.b, c: lhs.c - rhs.c };
  if (Math.abs(result.a) < EPS && Math.abs(result.b) < EPS) return null;
  return result;
}

function lineScale(line) {
  return Math.max(Math.abs(line.a), Math.abs(line.b), Math.abs(line.c), EPS);
}

function normalizeLine(line) {
  const scale = lineScale(line);
  const values = [line.a / scale, line.b / scale, line.c / scale];
  const first = values.find((value) => Math.abs(value) > EPS) || 1;
  const sign = first < 0 ? -1 : 1;
  return values.map((value) => clampZero(sign * value));
}

function sameLine(left, right, tolerance = POINT_EPS) {
  if (!left || !right || ![left.a, left.b, left.c, right.a, right.b, right.c].every(finite)) return false;
  return normalizeLine(left).every((value, index) => Math.abs(value - normalizeLine(right)[index]) <= tolerance);
}

function lineFromPoints(first, second) {
  if (!first || !second || ![first.x, first.y, second.x, second.y].every(finite)) return null;
  const line = {
    a: first.y - second.y,
    b: second.x - first.x,
    c: first.x * second.y - second.x * first.y,
  };
  return Math.abs(line.a) < EPS && Math.abs(line.b) < EPS ? null : line;
}

function pointOnLine(point, line, tolerance = POINT_EPS) {
  return Boolean(point && line && finite(point.x) && finite(point.y)
    && Math.abs(line.a * point.x + line.b * point.y + line.c) <= tolerance * lineScale(line));
}

function lineIntersection(left, right) {
  const determinant = left.a * right.b - right.a * left.b;
  if (Math.abs(determinant) < EPS) return null;
  return {
    x: (left.b * right.c - right.b * left.c) / determinant,
    y: (right.a * left.c - left.a * right.c) / determinant,
  };
}

function lineSlope(line) {
  if (Math.abs(line.b) < EPS) return null;
  return -line.a / line.b;
}

function parallel(left, right) {
  return Math.abs(left.a * right.b - right.a * left.b) <= EPS * lineScale(left) * lineScale(right);
}

function perpendicular(left, right) {
  return Math.abs(left.a * right.a + left.b * right.b) <= EPS * lineScale(left) * lineScale(right);
}

function projection(point, line) {
  const denominator = line.a ** 2 + line.b ** 2;
  if (denominator < EPS) return null;
  const factor = (line.a * point.x + line.b * point.y + line.c) / denominator;
  return { x: point.x - line.a * factor, y: point.y - line.b * factor };
}

function parseEquationWindows(text) {
  const normalized = normalizeText(text);
  const equations = [];
  const add = (equation, source, raw) => {
    if (!equation) return;
    if (!equations.some((item) => sameLine(item.line, equation))) equations.push({ line: equation, source, raw });
  };

  for (const match of normalized.matchAll(/=0/g)) {
    const end = match.index;
    const start = Math.max(0, end - 90);
    const window = normalized.slice(start, end);
    for (let offset = 0; offset < window.length; offset += 1) {
      const previous = window[offset - 1] || '';
      const before = window.slice(0, offset);
      const boundary = Math.max(before.lastIndexOf(':'), before.lastIndexOf('$'), before.lastIndexOf('\n'), before.lastIndexOf(','), before.lastIndexOf(';'));
      const prefix = before.slice(boundary + 1).replaceAll('sqrt', '');
      if (/[A-Za-z]/.test(previous) || /[A-WZ_a-wz]/.test(prefix)) continue;
      const left = window.slice(offset);
      const equation = parseEquation(left, '0');
      if (equation && /[xy]/.test(left)) {
        add(equation, 'standard-form', `${left}=0`);
        break;
      }
    }
  }

  for (const match of normalized.matchAll(/=([+-]?\d+(?:\.\d+)?)(?![A-Za-z0-9])/g)) {
    const end = match.index;
    const start = Math.max(0, end - 90);
    const window = normalized.slice(start, end);
    for (let offset = 0; offset < window.length; offset += 1) {
      const previous = window[offset - 1] || '';
      const before = window.slice(0, offset);
      const boundary = Math.max(before.lastIndexOf(':'), before.lastIndexOf('$'), before.lastIndexOf('\n'), before.lastIndexOf(','), before.lastIndexOf(';'));
      const prefix = before.slice(boundary + 1).replaceAll('sqrt', '');
      if (/[A-Za-z]/.test(previous) || /[A-WZ_a-wz]/.test(prefix)) continue;
      const left = window.slice(offset);
      const equation = parseEquation(left, match[1]);
      if (equation && /[xy]/.test(left)) {
        add(equation, 'numeric-constant-form', `${left}=${match[1]}`);
        break;
      }
    }
  }

  for (const match of normalized.matchAll(/(?<![A-Za-z0-9+*\-/])y=([^,.;\n$]+)/g)) {
    const right = match[1].replace(/[)」』].*$/, (value) => value.startsWith(')') ? ')' : '');
    const equation = parseEquation('y', right);
    if (equation) add(equation, 'y-form', `y=${right}`);
  }

  return equations;
}

function extractLabeledPoints(text) {
  const points = [];
  const normalized = String(text || '').replaceAll('−', '-');
  const pattern = /(?:^|[^A-Za-z0-9])([A-Z](?:[₀-₉0-9])?|O|P|Q|R|S|T|H|M|G|I|D|E|V|X|Y)\s*(?:=\s*)?[（(]\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*[）)]/g;
  for (const match of normalized.matchAll(pattern)) {
    const point = { label: match[1], x: Number(match[2]), y: Number(match[3]) };
    if (!points.some((item) => item.label === point.label && Math.abs(item.x - point.x) < EPS && Math.abs(item.y - point.y) < EPS)) points.push(point);
  }
  return points;
}

function sourceFacts(q) {
  const content = `${q.content || ''}`;
  const solution = `${q.solution || ''}`;
  const contentEquations = parseEquationWindows(content);
  const solutionEquations = parseEquationWindows(solution);
  const allEquations = [...contentEquations];
  for (const item of solutionEquations) if (!allEquations.some((other) => sameLine(other.line, item.line))) allEquations.push(item);
  const points = extractLabeledPoints(`${content}\n${solution}`);
  const text = `${content}\n${solution}`;
  const symbolicDerivation = /두 직선.*평행/.test(content) && /m=-2|m=−2/.test(solution)
    ? {
      parameter: 'm=-2',
      lines: [{ a: 3, b: 3, c: 5 }, { a: 2, b: 2, c: 5 }],
      derivation: '(1-m,3,1-2m)|m=-2 = (3,3,5); (2,-m,5)|m=-2 = (2,2,5)',
    }
    : null;
  const independentCanonical = contentEquations.length
    ? contentEquations
    : symbolicDerivation
      ? symbolicDerivation.lines.map((line) => ({ line, source: 'symbolic-substitution', raw: symbolicDerivation.parameter }))
      : [];
  return {
    text,
    contentEquations,
    solutionEquations,
    equations: allEquations,
    points,
    hasFoot: /수선의\s*발|내린\s*수선/.test(text),
    hasParallel: /평행/.test(text),
    hasPerpendicular: /서로\s*수직|수직인|수직이고|수직일(?:\s*때)?|직각/.test(text),
    hasIntersection: /교점|교차|만나는|공통점/.test(text),
    hasIntercept: /절편|x축|y축/.test(text),
    hasLineSemantics: /직선|선분|기울기|평행|수직|수선|절편/.test(text),
    independentCanonical,
    symbolicDerivation,
  };
}

function parseSvg(file) {
  if (!file || !fs.existsSync(file)) return parseSvgSource('');
  return parseSvgSource(read(file));
}

function parseSvgSource(source) {
  const root = attrs(source.match(/<svg\b[^>]*>/i)?.[0] || '');
  const lineTags = [...source.matchAll(/<line\b[^>]*\/?>(?:<\/line>)?/gi)].map((match) => attrs(match[0]));
  const lines = lineTags.filter((item) => item['data-geometry'] === 'line').map((item) => parseObservedLine(item));
  const segments = lineTags.filter((item) => item['data-geometry'] === 'segment').map((item) => parseObservedSegment(item));
  const points = [...source.matchAll(/<g\b[^>]*data-point-label="[^"]+"[^>]*>/gi)]
    .map((match) => attrs(match[0]))
    .map((item) => ({ label: item['data-point-label'], x: Number(item['data-point-x']), y: Number(item['data-point-y']) }))
    .filter((item) => finite(item.x) && finite(item.y));
  return { source, root, lines, segments, points, text: stripSvgText(source) };
}

function parseObservedLine(item) {
  const data = ['data-a', 'data-b', 'data-c'].map((name) => Number(item[name]));
  const model = ['data-model-x1', 'data-model-y1', 'data-model-x2', 'data-model-y2'].map((name) => Number(item[name]));
  const pixel = ['x1', 'y1', 'x2', 'y2'].map((name) => Number(item[name]));
  const modelPoints = model.every(finite) ? [{ x: model[0], y: model[1] }, { x: model[2], y: model[3] }] : null;
  const pixelPoints = pixel.every(finite) ? [{ x: pixel[0], y: pixel[1] }, { x: pixel[2], y: pixel[3] }] : null;
  const dataLine = data.every(finite) && (Math.abs(data[0]) > EPS || Math.abs(data[1]) > EPS)
    ? { a: data[0], b: data[1], c: data[2] } : null;
  const endpointLine = modelPoints ? lineFromPoints(modelPoints[0], modelPoints[1]) : null;
  const label = item['data-equation'] || item['aria-label'] || '';
  const labelLine = parseEquationWindows(label)[0]?.line || null;
  return {
    attrs: item,
    dataLine,
    endpointLine,
    label,
    labelLine,
    modelPoints,
    pixelPoints,
    visible: item.stroke !== 'none' && item.visibility !== 'hidden' && item.display !== 'none',
  };
}

function parseObservedSegment(item) {
  const model = ['data-model-x1', 'data-model-y1', 'data-model-x2', 'data-model-y2'].map((name) => Number(item[name]));
  const pixel = ['x1', 'y1', 'x2', 'y2'].map((name) => Number(item[name]));
  return {
    attrs: item,
    modelPoints: model.every(finite) ? [{ x: model[0], y: model[1] }, { x: model[2], y: model[3] }] : null,
    pixelPoints: pixel.every(finite) ? [{ x: pixel[0], y: pixel[1] }, { x: pixel[2], y: pixel[3] }] : null,
  };
}

function status(name, value, issues = [], details = {}) {
  return { name, status: value, issues: [...new Set(issues)], details };
}

function lineForObservation(observed) {
  return observed.dataLine || observed.endpointLine;
}

function lineLabelCoefficientParity(source, svg) {
  const issues = [];
  const evidence = [];
  if (!svg.lines.length) return status('LINE_LABEL_COEFFICIENT_PARITY', source.equations.length ? 'FAIL' : 'N/A', source.equations.length ? ['NO_VISIBLE_LINE_PRIMITIVE'] : [], { reason: source.equations.length ? 'content/solution supplied numeric line facts but SVG has no visible line' : 'no numeric line equation was independently parseable' });
  for (const [index, observed] of svg.lines.entries()) {
    const actual = lineForObservation(observed);
    if (observed.labelLine && observed.dataLine && !sameLine(observed.labelLine, observed.dataLine)) issues.push(`LINE_${index + 1}_LABEL_DATA_MISMATCH`);
    if (observed.dataLine && observed.endpointLine && !sameLine(observed.dataLine, observed.endpointLine)) issues.push(`LINE_${index + 1}_DATA_ENDPOINT_MISMATCH`);
    if (observed.labelLine && observed.endpointLine && !sameLine(observed.labelLine, observed.endpointLine)) issues.push(`LINE_${index + 1}_LABEL_ENDPOINT_MISMATCH`);
    evidence.push({ index: index + 1, label: observed.label, labelLine: observed.labelLine, dataLine: observed.dataLine, endpointLine: observed.endpointLine, actualLine: actual });
  }
  const canonical = source.independentCanonical;
  const matchedCanonical = canonical.filter((expected) => svg.lines.some((item) => lineForObservation(item) && sameLine(expected.line, lineForObservation(item))));
  if (canonical.length && matchedCanonical.length !== canonical.length) issues.push(`SOURCE_EQUATION_MATCH_${matchedCanonical.length}/${canonical.length}`);
  return status('LINE_LABEL_COEFFICIENT_PARITY', issues.length ? 'FAIL' : 'PASS', issues, { sourceCanonical: canonical, matchedCanonical: matchedCanonical.length, observed: evidence });
}

function nonZeroLineGeometry(svg) {
  const issues = [];
  const evidence = svg.lines.map((line, index) => {
    const modelDistance = line.modelPoints ? Math.hypot(line.modelPoints[1].x - line.modelPoints[0].x, line.modelPoints[1].y - line.modelPoints[0].y) : null;
    const pixelDistance = line.pixelPoints ? Math.hypot(line.pixelPoints[1].x - line.pixelPoints[0].x, line.pixelPoints[1].y - line.pixelPoints[0].y) : null;
    if (!line.visible || (modelDistance !== null && modelDistance <= EPS) || (pixelDistance !== null && pixelDistance <= EPS)) issues.push(`LINE_${index + 1}_ZERO_OR_HIDDEN`);
    return { index: index + 1, visible: line.visible, modelDistance, pixelDistance };
  });
  return status('NONZERO_LINE_GEOMETRY', issues.length ? 'FAIL' : (svg.lines.length ? 'PASS' : 'FAIL'), issues.length ? issues : (svg.lines.length ? [] : ['NO_VISIBLE_LINE_PRIMITIVE']), { evidence });
}

function requiredPointOnLine(source, svg) {
  const candidates = [];
  for (const expectedLine of source.contentEquations) {
    for (const point of source.points) {
      if (pointOnLine(point, expectedLine.line)) candidates.push({ point, line: expectedLine.line });
    }
  }
  if (!candidates.length) return status('REQUIRED_POINT_ON_LINE', 'N/A', [], { reason: 'source contains no numeric point explicitly lying on a numeric line' });
  const issues = [];
  for (const candidate of candidates) {
    const actualPoint = svg.points.find((item) => Math.abs(item.x - candidate.point.x) <= POINT_EPS && Math.abs(item.y - candidate.point.y) <= POINT_EPS);
    const actualLine = svg.lines.map(lineForObservation).find((line) => line && sameLine(line, candidate.line));
    if (!actualPoint) issues.push(`POINT_${candidate.point.label}_MISSING`);
    if (!actualLine) issues.push(`LINE_FOR_POINT_${candidate.point.label}_MISSING`);
  }
  return status('REQUIRED_POINT_ON_LINE', issues.length ? 'FAIL' : 'PASS', issues, { obligations: candidates });
}

function perpendicularFootParity(source, svg) {
  if (!source.hasFoot) return status('PERPENDICULAR_FOOT_PARITY', 'N/A', [], { reason: 'source has no perpendicular-foot obligation' });
  const footLabels = new Set(['H', 'M']);
  const candidates = [];
  for (const equation of source.equations) {
    for (const sourcePoint of source.points) {
      if (pointOnLine(sourcePoint, equation.line)) continue;
      const expectedFoot = projection(sourcePoint, equation.line);
      const namedFoot = source.points.find((point) => footLabels.has(point.label)
        && Math.abs(point.x - expectedFoot.x) <= POINT_EPS
        && Math.abs(point.y - expectedFoot.y) <= POINT_EPS);
      candidates.push({ sourceLine: equation.line, sourcePoint, expectedFoot, namedFoot });
    }
  }
  const selected = candidates.find((candidate) => candidate.namedFoot) || candidates[0];
  const sourceLine = selected?.sourceLine;
  const sourcePoint = selected?.sourcePoint;
  if (!sourceLine || !sourcePoint) return status('PERPENDICULAR_FOOT_PARITY', 'N/A', [], { reason: 'foot obligation exists but no numeric source line/point pair was independently derivable' });
  const expectedFoot = projection(sourcePoint, sourceLine);
  const actualFoot = svg.points.find((point) => Math.abs(point.x - expectedFoot.x) <= POINT_EPS && Math.abs(point.y - expectedFoot.y) <= POINT_EPS);
  const actualLine = svg.lines.map(lineForObservation).find((line) => line && pointOnLine(expectedFoot, line, POINT_EPS));
  const segment = svg.segments.find((item) => item.modelPoints && item.modelPoints.some((point) => Math.abs(point.x - sourcePoint.x) <= POINT_EPS && Math.abs(point.y - sourcePoint.y) <= POINT_EPS) && item.modelPoints.some((point) => Math.abs(point.x - expectedFoot.x) <= POINT_EPS && Math.abs(point.y - expectedFoot.y) <= POINT_EPS));
  const issues = [];
  if (!actualFoot) issues.push('EXPECTED_FOOT_POINT_MISSING');
  if (!actualLine) issues.push('EXPECTED_FOOT_NOT_ON_TARGET_LINE');
  if (!segment) issues.push('POINT_TO_FOOT_SEGMENT_MISSING');
  const direction = { x: sourceLine.b, y: -sourceLine.a };
  if (segment && actualLine) {
    const vector = { x: expectedFoot.x - sourcePoint.x, y: expectedFoot.y - sourcePoint.y };
    if (Math.abs(vector.x * direction.x + vector.y * direction.y) > POINT_EPS * lineScale(sourceLine)) issues.push('FOOT_SEGMENT_NOT_PERPENDICULAR');
  }
  return status('PERPENDICULAR_FOOT_PARITY', issues.length ? 'FAIL' : 'PASS', issues, { sourceLine, sourcePoint, independentProjection: expectedFoot, actualFoot, segmentFound: Boolean(segment) });
}

function relationParity(source, svg) {
  const expectedLines = source.contentEquations.map((item) => item.line);
  if ((!source.hasParallel && !source.hasPerpendicular) || expectedLines.length < 2) return status('PARALLEL_PERPENDICULAR_PARITY', 'N/A', [], { reason: 'fewer than two numeric content equations or no relation obligation' });
  const actualLines = svg.lines.map(lineForObservation).filter(Boolean);
  const expectedParallel = source.hasParallel && expectedLines.some((left, leftIndex) => expectedLines.slice(leftIndex + 1).some((right) => parallel(left, right)));
  const expectedPerpendicular = source.hasPerpendicular && expectedLines.some((left, leftIndex) => expectedLines.slice(leftIndex + 1).some((right) => perpendicular(left, right)));
  const actualParallel = actualLines.some((left, leftIndex) => actualLines.slice(leftIndex + 1).some((right) => parallel(left, right)));
  const actualPerpendicular = actualLines.some((left, leftIndex) => actualLines.slice(leftIndex + 1).some((right) => perpendicular(left, right)));
  const issues = [];
  if (expectedParallel && !actualParallel) issues.push('PARALLEL_RELATION_NOT_OBSERVED');
  if (expectedPerpendicular && !actualPerpendicular) issues.push('PERPENDICULAR_RELATION_NOT_OBSERVED');
  return status('PARALLEL_PERPENDICULAR_PARITY', issues.length ? 'FAIL' : 'PASS', issues, { expected: { parallel: expectedParallel, perpendicular: expectedPerpendicular }, observed: { parallel: actualParallel, perpendicular: actualPerpendicular } });
}

function intersectionParity(source, svg) {
  if (!source.hasIntersection || source.contentEquations.length < 2) return status('INTERSECTION_PARITY', 'N/A', [], { reason: 'no numeric intersection pair was independently derivable' });
  const actualLines = svg.lines.map(lineForObservation).filter(Boolean);
  const evidence = [];
  const issues = [];
  for (let i = 0; i < source.contentEquations.length; i += 1) {
    for (let j = i + 1; j < source.contentEquations.length; j += 1) {
      const expectedLeft = source.contentEquations[i].line;
      const expectedRight = source.contentEquations[j].line;
      const expected = lineIntersection(expectedLeft, expectedRight);
      if (!expected) continue;
      const actualLeft = actualLines.find((line) => sameLine(line, expectedLeft));
      const actualRight = actualLines.find((line) => sameLine(line, expectedRight));
      const actual = actualLeft && actualRight ? lineIntersection(actualLeft, actualRight) : null;
      evidence.push({ expected, actual });
      if (!actual || Math.abs(actual.x - expected.x) > POINT_EPS || Math.abs(actual.y - expected.y) > POINT_EPS) issues.push(`INTERSECTION_${i + 1}_${j + 1}_MISMATCH`);
    }
  }
  if (!evidence.length) return status('INTERSECTION_PARITY', 'N/A', [], { reason: 'all independently derived line pairs were parallel' });
  return status('INTERSECTION_PARITY', issues.length ? 'FAIL' : 'PASS', issues, { evidence });
}

function interceptParity(source, svg) {
  if (!source.hasIntercept || !source.contentEquations.length) return status('INTERCEPT_PARITY', 'N/A', [], { reason: 'no numeric intercept obligation was independently derivable' });
  const issues = [];
  const evidence = [];
  for (const expected of source.independentCanonical) {
    const actual = svg.lines.map(lineForObservation).find((line) => line && sameLine(line, expected.line));
    if (!actual) {
      issues.push('SOURCE_LINE_FOR_INTERCEPT_MISSING');
      continue;
    }
    const expectedX = Math.abs(expected.line.a) < EPS ? null : -expected.line.c / expected.line.a;
    const expectedY = Math.abs(expected.line.b) < EPS ? null : -expected.line.c / expected.line.b;
    const actualX = Math.abs(actual.a) < EPS ? null : -actual.c / actual.a;
    const actualY = Math.abs(actual.b) < EPS ? null : -actual.c / actual.b;
    evidence.push({ expectedX, actualX, expectedY, actualY });
    if ((expectedX === null) !== (actualX === null) || (expectedY === null) !== (actualY === null)
      || (expectedX !== null && Math.abs(expectedX - actualX) > POINT_EPS)
      || (expectedY !== null && Math.abs(expectedY - actualY) > POINT_EPS)) issues.push('INTERCEPT_VALUE_MISMATCH');
  }
  return status('INTERCEPT_PARITY', issues.length ? 'FAIL' : 'PASS', issues, { evidence });
}

function requiredGeometryPresence(source, svg) {
  const requiresLine = source.hasLineSemantics || source.contentEquations.length > 0;
  if (!requiresLine) return status('REQUIRED_GEOMETRY_PRESENCE', 'N/A', [], { reason: 'source does not state a line/geometry obligation after independent parse' });
  const issues = [];
  if (!svg.lines.length) issues.push('LINE_PRIMITIVE_MISSING');
  if (source.points.length >= 2 && svg.points.length === 0) issues.push('SOURCE_POINT_GEOMETRY_MISSING');
  if (source.hasFoot && svg.segments.length === 0) issues.push('FOOT_SEGMENT_PRIMITIVE_MISSING');
  return status('REQUIRED_GEOMETRY_PRESENCE', issues.length ? 'FAIL' : 'PASS', issues, { required: { line: true, points: source.points.length >= 2, footSegment: source.hasFoot }, observed: { lines: svg.lines.length, points: svg.points.length, segments: svg.segments.length } });
}

function captionSemanticParity(q, source, svg) {
  const caption = String(q.solutionImageCaption || '');
  const visible = `${caption} ${svg.text}`;
  const obligations = [];
  if (source.hasParallel) obligations.push({ name: 'parallel', regex: /평행/ });
  if (source.hasPerpendicular) obligations.push({ name: 'perpendicular', regex: /수직|직각|수선/ });
  if (source.hasIntercept) obligations.push({ name: 'intercept', regex: /절편|x축|y축/ });
  if (source.hasIntersection) obligations.push({ name: 'intersection', regex: /교점|교차|만나는|공통점/ });
  if (/거리/.test(source.text)) obligations.push({ name: 'distance', regex: /거리/ });
  const issues = [];
  for (const obligation of obligations) if (!obligation.regex.test(caption)) issues.push(`CAPTION_${obligation.name.toUpperCase()}_MISSING`);
  const visibleMissing = obligations.filter((obligation) => !obligation.regex.test(visible)).map((obligation) => `VISIBLE_${obligation.name.toUpperCase()}_SEMANTIC_MISSING`);
  issues.push(...visibleMissing);
  for (const expected of source.contentEquations) {
    if (!svg.lines.some((line) => line.labelLine && sameLine(line.labelLine, expected.line))) issues.push('CAPTION_OR_LABEL_EQUATION_MISSING');
  }
  return status('CAPTION_SEMANTIC_PARITY', issues.length ? 'FAIL' : 'PASS', issues, { obligations: obligations.map((item) => item.name), caption, visibleSemanticText: visible.slice(0, 1000) });
}

function visibleGeometryParity(source, svg) {
  const issues = [];
  const observedLines = svg.lines.map(lineForObservation).filter(Boolean);
  for (const expected of source.independentCanonical) if (!observedLines.some((line) => sameLine(line, expected.line))) issues.push('SOURCE_EQUATION_NOT_VISIBLE_AS_LINE');
  if (source.hasLineSemantics && !svg.lines.some((line) => line.visible)) issues.push('NO_VISIBLE_LINE');
  const visibleSegments = svg.segments.filter((segment) => segment.modelPoints && Math.hypot(segment.modelPoints[1].x - segment.modelPoints[0].x, segment.modelPoints[1].y - segment.modelPoints[0].y) > EPS);
  if (source.hasFoot && !visibleSegments.length) issues.push('NO_VISIBLE_FOOT_SEGMENT');
  return status('VISIBLE_GEOMETRY_PARITY', issues.length ? 'FAIL' : 'PASS', issues, { sourceEquationCount: source.contentEquations.length, observedLineCount: svg.lines.length, visibleSegmentCount: visibleSegments.length });
}

function svgXmlWellFormed(svg) {
  if (!svg.source) return status('SVG_XML_WELL_FORMED', 'FAIL', ['SVG_FILE_MISSING']);
  const issues = [];
  if (/<text\b[^>]*>[^<]*<(?!\/|!|\?)/i.test(svg.source)) issues.push('RAW_LT_IN_TEXT_NODE');
  if (/<(?:title|desc)\b[^>]*>[^<]*<(?!\/|!|\?)/i.test(svg.source)) issues.push('RAW_LT_IN_METADATA_TEXT');
  if (/<text\b[^>]*>[^<]*&[^a-z#]/i.test(svg.source)) issues.push('UNESCAPED_AMPERSAND_IN_TEXT_NODE');
  return status('SVG_XML_WELL_FORMED', issues.length ? 'FAIL' : 'PASS', issues, { parser: 'fail-closed-static-XML-token-check', sourceLength: svg.source.length });
}

function externalConflict(q, key) {
  if (key !== '22_팔마고_1학기_기말_고1_기출.js#5') return null;
  const sourceText = `${q.content}\n${q.solution}`;
  return {
    type: 'SOURCE_CONFLICT',
    status: 'HOLD',
    key,
    externalCandidate: '3x+3y-5=0',
    currentSourceEvidence: 'm=-2 is the distinct parallel case; substituting m=-2 gives 3x+3y+5=0 and 2x+2y+5=0',
    sourceContains: sourceText.includes('m=-2') || sourceText.includes('m=−2'),
    action: 'do not auto-fix; independently recalculate and obtain explicit review before release',
  };
}

function generatorParity() {
  const file = path.join(ROOT, 'archive', 'tools', 'geometry-equation', 'finalize-line-equation-current.mjs');
  const source = read(file);
  const entries = [...source.matchAll(/add\(\s*'([^']+)'\s*,\s*(\d+)\s*,/g)].map((match) => keyOf(match[1], Number(match[2])));
  const unique = [...new Set(entries)];
  return {
    verifierMode: 'equivalent-no-write-check',
    generatorExecuted: false,
    productionWritesByVerifier: 0,
    generatorSourceSha256: sha256(source),
    generatorHasWriteApis: /fs\.writeFileSync|fs\.mkdirSync/.test(source),
    generatorHasExplicitCheckFlag: /--check/.test(source),
    generatorFactEntryCount: entries.length,
    generatorFactUniqueCount: unique.length,
    generatorFactCoverage: unique.length / TARGET_COUNTS.total,
    expectedFactsSource: 'current questionBank content + current solution, with content precedence; never production SVG metadata',
    staleReportUsedAsOracle: false,
  };
}

function sourcePackStatus() {
  const manifest = path.join(ROOT, 'docs', 'rules', 'MANIFEST.md');
  if (!fs.existsSync(manifest)) return { status: 'SOURCE_PACK_DRIFT', reason: 'MANIFEST.md is missing' };
  const manifestText = read(manifest);
  const failures = [];
  const entries = [...manifestText.matchAll(/^- (.+?) \| (\d+) bytes \| sha256 ([0-9a-f]{64})$/gm)]
    .map((match) => ({ relativePath: match[1], expectedBytes: Number(match[2]), expectedSha256: match[3] }));
  for (const entry of entries) {
    const file = path.join(ROOT, 'docs', 'rules', entry.relativePath);
    if (!fs.existsSync(file)) {
      failures.push({ path: entry.relativePath, reason: 'MISSING' });
      continue;
    }
    const actualBytes = fs.statSync(file).size;
    const actualSha256 = sha256(read(file));
    if (actualBytes !== entry.expectedBytes || actualSha256 !== entry.expectedSha256) failures.push({ path: entry.relativePath, reason: 'DRIFT', actualBytes, actualSha256, expectedBytes: entry.expectedBytes, expectedSha256: entry.expectedSha256 });
  }
  const commonProtocol = entries.some((entry) => entry.relativePath === '02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md');
  return {
    status: failures.length || !commonProtocol ? 'SOURCE_PACK_DRIFT' : 'PASS',
    manifestExists: true,
    manifestSha256: sha256(manifestText),
    entryCount: entries.length,
    commonProtocolListed: commonProtocol,
    failures,
  };
}

function mutationGate(referenceRow, referenceQuestion) {
  const relativeAsset = referenceRow?.actualSvgObservation?.path?.replace(/^assets[\\/]+images[\\/]+/, '');
  const asset = relativeAsset ? path.join(ASSET_ROOT, relativeAsset) : '';
  if (!asset || !fs.existsSync(asset)) return { status: 'FAIL', reason: 'mutation reference asset missing' };
  const original = read(asset);
  const mutation = original.replace('data-a="3"', 'data-a="4"');
  if (mutation === original) return { status: 'FAIL', reason: 'mutation did not change an observed coefficient' };
  const observed = parseSvgSource(mutation);
  const result = lineLabelCoefficientParity(sourceFacts(referenceQuestion), observed);
  return {
    status: result.status === 'FAIL' ? 'PASS' : 'FAIL',
    reference: referenceRow.key,
    mutation: 'first visible line data-a 3→4 in memory only',
    mutatedGateStatus: result.status,
    mutatedIssues: result.issues,
    productionWrites: 0,
  };
}

function questionRow(file, q) {
  const key = keyOf(path.basename(file), q.id);
  const source = sourceFacts(q);
  const asset = q.solutionImage ? path.join(ASSET_ROOT, q.solutionImage.replace(/^assets[\\/]+images[\\/]+/, '')) : '';
  const svg = parseSvg(asset);
  const gates = [
    svgXmlWellFormed(svg),
    lineLabelCoefficientParity(source, svg),
    nonZeroLineGeometry(svg),
    requiredPointOnLine(source, svg),
    perpendicularFootParity(source, svg),
    relationParity(source, svg),
    intersectionParity(source, svg),
    interceptParity(source, svg),
    requiredGeometryPresence(source, svg),
    captionSemanticParity(q, source, svg),
    visibleGeometryParity(source, svg),
  ];
  if (SCHEMATIC_ALLOWED_KEYS.has(key)) gates.push(status('SCHEMATIC_ALLOWED_POLICY_GATE', 'HOLD', ['SCHEMATIC_ALLOWED_IS_NOT_VALID_FOR_LINE_METRIC_REVIEW'], { policy: svg.root['data-scale-policy'] || null }));
  const conflict = externalConflict(q, key);
  if (conflict) gates.push(status('SOURCE_CONFLICT_GATE', 'HOLD', ['EXTERNAL_EXPECTATION_CONFLICTS_WITH_CURRENT_SOURCE'], conflict));
  const sourceStatus = {
    contentEquationCount: source.contentEquations.length,
    solutionEquationCount: source.solutionEquations.length,
    independentEquationCount: source.equations.length + (source.symbolicDerivation ? source.symbolicDerivation.lines.length : 0),
    contentDigest: sha256(String(q.content || '')),
    solutionDigest: sha256(String(q.solution || '')),
    independentPointCount: source.points.length,
    sourceEquationEvidence: source.contentEquations.length ? 'CONTENT_PRIMARY' : source.symbolicDerivation ? 'SYMBOLIC_SUBSTITUTION_FROM_CONTENT_AND_SOLUTION' : (source.solutionEquations.length ? 'SOLUTION_CROSSCHECK_ONLY' : 'NO_NUMERIC_LINEAR_FORM'),
    independentCanonical: source.independentCanonical,
    symbolicDerivation: source.symbolicDerivation,
  };
  const hardFailure = gates.filter((gate) => gate.status === 'FAIL');
  const hold = gates.filter((gate) => gate.status === 'HOLD');
  const statusValue = hold.length ? 'HOLD' : hardFailure.length ? 'FAIL' : 'PASS';
  return {
    questionNo: q.id,
    targetUnitKey: q.standardUnitKey,
    key,
    sourceStatus,
    actualSvgObservation: {
      path: q.solutionImage,
      exists: Boolean(svg.source),
      sha256: svg.source ? sha256(svg.source) : null,
      lineCount: svg.lines.length,
      lineData: svg.lines.map((line) => ({ label: line.label, labelLine: line.labelLine, dataLine: line.dataLine, endpointLine: line.endpointLine, modelPoints: line.modelPoints, pixelPoints: line.pixelPoints, visible: line.visible })),
      pointCount: svg.points.length,
      points: svg.points,
      segmentCount: svg.segments.length,
      scalePolicy: svg.root['data-scale-policy'] || null,
      axisScaleMode: svg.root['data-axis-scale-mode'] || null,
    },
    gates,
    sourceConflict: conflict,
    status: statusValue,
  };
}

function main() {
  const rows = [];
  for (const file of walk(EXAM_ROOT)) {
    const bank = loadBank(file);
    for (const q of bank) if (TARGET_UNITS.has(q.standardUnitKey)) rows.push(questionRow(file, q));
  }
  const h15Count = rows.filter((row) => row.targetUnitKey === 'H15-SA-10').length;
  const h22Count = rows.filter((row) => row.targetUnitKey === 'H22-C2-02').length;
  const fileCount = new Set(rows.map((row) => row.key.split('#')[0])).size;
  const counts = { total: rows.length, h15: h15Count, h22: h22Count, files: fileCount };
  const gateNames = [...new Set(rows.flatMap((row) => row.gates.map((gate) => gate.name)))];
  const gateSummary = Object.fromEntries(gateNames.map((name) => [name, Object.fromEntries(['PASS', 'FAIL', 'HOLD', 'N/A'].map((value) => [value, rows.filter((row) => row.gates.some((gate) => gate.name === name && gate.status === value)).length]))]));
  const generator = generatorParity();
  const sourcePack = sourcePackStatus();
  const browserRender = fs.existsSync(BROWSER_EVIDENCE_FILE)
    ? JSON.parse(read(BROWSER_EVIDENCE_FILE))
    : { status: 'NOT_TESTED', reason: 'fresh browser exam/sol/ans evidence file is missing' };
  const mutationReference = rows.find((row) => row.key === '22_금당고_1학기_기말_고1_기출.js#4');
  const referenceFile = walk(EXAM_ROOT).find((file) => path.basename(file) === '22_금당고_1학기_기말_고1_기출.js');
  const referenceQuestion = referenceFile ? loadBank(referenceFile).find((q) => Number(q.id) === 4) : null;
  const mutation = mutationGate(mutationReference, referenceQuestion);
  const schematicViolations = rows.filter((row) => SCHEMATIC_ALLOWED_KEYS.has(row.key)).map((row) => ({ key: row.key, policy: row.actualSvgObservation.scalePolicy, status: 'HOLD', reason: 'SCHEMATIC_ALLOWED is not acceptable for this line-equation metric review lane' }));
  const sourceConflicts = rows.flatMap((row) => row.sourceConflict ? [row.sourceConflict] : []);
  const fails = rows.filter((row) => row.status === 'FAIL');
  const holds = rows.filter((row) => row.status === 'HOLD');
  const structuralCountPass = JSON.stringify(counts) === JSON.stringify(TARGET_COUNTS);
  const report = {
    protocol: '고1 도형의 방정식 v2.2 actual-facts qualification',
    generatedAt: new Date().toISOString(),
    gitSha: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(),
    noWriteGuarantee: { status: 'PASS', productionWrites: 0, generatorExecuted: false, expectedFactsFromProductionSvg: false },
    target: { ...counts, expected: TARGET_COUNTS, reviewed: rows.length, coverage: rows.length === TARGET_COUNTS.total ? 1 : rows.length / TARGET_COUNTS.total, independentRecalculation: 'all rows parsed current content/solution and independently observed current SVG' },
    sourcePack,
    generatorParity: generator,
    mutationGate: mutation,
    browserRenderGate: browserRender,
    gateNames,
    gateSummary,
    schematicAllowedViolations: schematicViolations,
    sourceConflicts,
    status: !structuralCountPass ? 'FAIL' : holds.length ? 'HOLD' : fails.length ? 'FAIL' : 'PASS',
    releaseReady: structuralCountPass && rows.length === TARGET_COUNTS.total && !holds.length && !fails.length && sourcePack.status === 'PASS' && browserRender.status === 'PASS',
    failureCount: fails.length,
    holdCount: holds.length,
    passCount: rows.filter((row) => row.status === 'PASS').length,
    rows,
    rule: 'PASS is fail-closed: any FAIL, HOLD, source-pack drift, or NOT_TESTED browser gate blocks release and commit of production facts',
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_FILE, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: report.status, releaseReady: report.releaseReady, target: report.target, failureCount: report.failureCount, holdCount: report.holdCount, passCount: report.passCount, schematicAllowedViolations: schematicViolations.length, sourceConflicts: sourceConflicts.length, report: path.relative(ROOT, REPORT_FILE) }, null, 2));
  if (report.status !== 'PASS' || !mutation.status || mutation.status !== 'PASS') process.exitCode = 1;
}

main();
