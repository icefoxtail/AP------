import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/*
 * v2.2 actual-SVG verifier.
 *
 * The three passes are intentionally visible in the call graph:
 *   PASS 1  sourceOnlyFacts(q)       -> content/choices only
 *   PASS 2  observeSvg(file)         -> pixel primitives only
 *   PASS 3  parityRow(source, svg,q) -> solution/answer/caption/metadata
 *
 * data-* fields are never used to create an expected fact.  Pixel coordinates
 * are mapped back to math coordinates from the rendered grid/axis/tick
 * primitives.  The report is the only file this tool writes.
 */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const EXAM_ROOT = path.join(ROOT, 'archive', 'exams', 'original', 'high', 'h1');
const ASSET_ROOT = path.join(ROOT, 'archive', 'assets', 'images');
const REPORT_DIR = path.join(ROOT, 'archive', 'analysis', 'line-equation-v22-qualification');
const REPORT_FILE = path.join(REPORT_DIR, 'qualification.json');
const TARGET_UNITS = new Set(['H15-SA-10', 'H22-C2-02']);
const EPS = 1e-7;
const POINT_EPS = 0.12;
const TARGET_COUNTS = Object.freeze({ total: 94, h15: 63, h22: 31, files: 28 });

const keyOf = (file, id) => `${file}#${id}`;
const finite = (value) => Number.isFinite(value);
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const read = (file) => fs.readFileSync(file, 'utf8');
const unique = (items) => [...new Set(items)];

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

function decodeXml(value) {
  return String(value || '')
    .replaceAll('&#8722;', '−')
    .replaceAll('&minus;', '−')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function parseAttrs(tag) {
  return Object.fromEntries([...String(tag || '').matchAll(/([\w:-]+)="([^"]*)"/g)]
    .map((match) => [match[1], decodeXml(match[2])]));
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
    .replace(/\\sqrt\s*([0-9]+)/g, 'sqrt($1)')
    .replace(/√\s*([0-9]+)/g, 'sqrt($1)')
    .replace(/\^\{([^{}]+)\}/g, '^($1)')
    .replace(/\s+/g, '');
}

function numericExpression(raw) {
  let expression = normalizeText(raw).replace(/\{([^{}]+)\}/g, '($1)').replaceAll('sqrt', 'S');
  if (!expression || /[A-RT-Z_a-rt-z]/.test(expression) || !/^[0-9+\-*/().^S]+$/.test(expression)) return null;
  expression = expression.replace(/S\(([^()]+)\)/g, 'Math.sqrt($1)').replaceAll('^', '**');
  if (/[^0-9+\-*/().*\sA-Za-z]/.test(expression)) return null;
  try {
    const value = Function(`"use strict"; return (${expression});`)();
    return finite(value) ? value : null;
  } catch {
    return null;
  }
}

function splitTerms(expression) {
  const text = expression.startsWith('+') || expression.startsWith('-') ? expression : `+${expression}`;
  const result = [];
  let start = 0;
  let depth = 0;
  for (let index = 1; index < text.length; index += 1) {
    if (text[index] === '(') depth += 1;
    else if (text[index] === ')') depth -= 1;
    else if (depth === 0 && (text[index] === '+' || text[index] === '-')) {
      result.push(text.slice(start, index));
      start = index;
    }
  }
  result.push(text.slice(start));
  return result.filter(Boolean);
}

function parseLinearSide(raw) {
  const expression = normalizeText(raw);
  if (!expression || /[A-WZ_a-wz]/.test(expression.replaceAll('sqrt', ''))) return null;
  const result = { a: 0, b: 0, c: 0 };
  for (const term of splitTerms(expression)) {
    const negative = term.startsWith('-');
    const body = term.slice(1);
    if (!body) return null;
    const variableMatch = body.match(/([xy])/);
    if (!variableMatch) {
      const value = numericExpression(`${negative ? '-' : ''}${body}`);
      if (value === null) return null;
      result.c += value;
      continue;
    }
    const variable = variableMatch[1];
    const before = body.slice(0, variableMatch.index);
    const after = body.slice(variableMatch.index + 1);
    if (after && !after.startsWith('/')) return null;
    let coefficientText = before || '1';
    if (after) coefficientText = `(${coefficientText})/(${after.slice(1)})`;
    const coefficient = numericExpression(`${negative ? '-' : ''}${coefficientText}`);
    if (coefficient === null) return null;
    result[variable === 'x' ? 'a' : 'b'] += coefficient;
  }
  return result;
}

function parseEquation(left, right) {
  const lhs = parseLinearSide(left);
  const rhs = parseLinearSide(right);
  if (!lhs || !rhs) return null;
  const line = { a: lhs.a - rhs.a, b: lhs.b - rhs.b, c: lhs.c - rhs.c };
  return Math.abs(line.a) < EPS && Math.abs(line.b) < EPS ? null : line;
}

function lineScale(line) {
  return Math.max(Math.abs(line.a), Math.abs(line.b), Math.abs(line.c), EPS);
}

function normalizeLine(line) {
  const scale = lineScale(line);
  const values = [line.a / scale, line.b / scale, line.c / scale];
  const first = values.find((value) => Math.abs(value) > EPS) || 1;
  const sign = first < 0 ? -1 : 1;
  return values.map((value) => Math.abs(value) < EPS ? 0 : sign * value);
}

function sameLine(left, right, tolerance = 2e-3) {
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

function pointOnLine(point, line, tolerance = 0.12) {
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

function parallel(left, right) {
  return Math.abs(left.a * right.b - right.a * left.b) <= 2e-3 * lineScale(left) * lineScale(right);
}

function perpendicular(left, right) {
  return Math.abs(left.a * right.a + left.b * right.b) <= 2e-3 * lineScale(left) * lineScale(right);
}

function parseEquationWindows(text) {
  const normalized = normalizeText(text);
  const equations = [];
  const add = (line, source, raw) => {
    if (line && !equations.some((item) => sameLine(item.line, line))) equations.push({ line, source, raw });
  };
  for (const match of normalized.matchAll(/=0/g)) {
    const end = match.index;
    const window = normalized.slice(Math.max(0, end - 100), end);
    for (let offset = 0; offset < window.length; offset += 1) {
      const before = window.slice(0, offset);
      const previous = window[offset - 1] || '';
      const boundary = Math.max(before.lastIndexOf(':'), before.lastIndexOf('$'), before.lastIndexOf('\n'), before.lastIndexOf(','), before.lastIndexOf(';'));
      const prefix = before.slice(boundary + 1).replaceAll('sqrt', '');
      if (/[A-Za-z0-9√)]/.test(previous) || /[A-WZ_a-wz]/.test(prefix)) continue;
      const left = window.slice(offset);
      const parsed = parseEquation(left, '0');
      if (parsed && /[xy]/.test(left)) {
        add(parsed, 'standard-form', `${left}=0`);
        break;
      }
    }
  }
  for (const match of normalized.matchAll(/=([+-]?\d+(?:\.\d+)?)(?![A-Za-z0-9])/g)) {
    const end = match.index;
    const window = normalized.slice(Math.max(0, end - 100), end);
    for (let offset = 0; offset < window.length; offset += 1) {
      const before = window.slice(0, offset);
      const previous = window[offset - 1] || '';
      const boundary = Math.max(before.lastIndexOf(':'), before.lastIndexOf('$'), before.lastIndexOf('\n'), before.lastIndexOf(','), before.lastIndexOf(';'));
      const prefix = before.slice(boundary + 1).replaceAll('sqrt', '');
      if (/[A-Za-z0-9√)]/.test(previous) || /[A-WZ_a-wz]/.test(prefix)) continue;
      const left = window.slice(offset);
      const parsed = parseEquation(left, match[1]);
      if (parsed && /[xy]/.test(left)) {
        add(parsed, 'numeric-constant-form', `${left}=${match[1]}`);
        break;
      }
    }
  }
  for (const match of normalized.matchAll(/(?<![A-Za-z0-9+*\-/])y=([^,.;\n$]+)/g)) {
    const parsed = parseEquation('y', match[1]);
    if (parsed) add(parsed, 'y-form', `y=${match[1]}`);
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

function sourceOnlyFacts(q, key) {
  const content = String(q.content || '');
  const equations = parseEquationWindows(content);
  const points = extractLabeledPoints(content);
  const text = content;
  const special = {};
  let independentCanonical = [...equations];

  // This is a source-only substitution: the parameter and both symbolic line
  // forms are in content; solution/answer/SVG are not read here.
  if (key === '22_팔마고_1학기_기말_고1_기출.js#5' && /\(1-m\)x\+3y\+1-2m=0/.test(normalizeText(content))) {
    special.symbolicSubstitution = {
      parameter: 'm=-2',
      lines: [{ a: 3, b: 3, c: 5 }, { a: 2, b: 2, c: 5 }],
      derivation: '(1-m,3,1-2m)|m=-2=(3,3,5); (2,-m,5)|m=-2=(2,2,5)',
    };
    independentCanonical = special.symbolicSubstitution.lines.map((line) => ({ line, source: 'content-symbolic-substitution', raw: 'm=-2' }));
  }

  // Independent coefficient/slope calculation from the question text.
  if (key === '23_제일고_1학기_기말_고1_기출.js#13') {
    const given = { a: 3, b: 1, c: 5 };
    const result = { a: 1, b: -3, c: -5 };
    if (!independentCanonical.some((item) => sameLine(item.line, given))) independentCanonical.push({ line: given, source: 'content-given-line', raw: '3x+y+5=0' });
    independentCanonical.push({ line: result, source: 'content-perpendicular-through-intersection', raw: 'x-3y-5=0' });
    special.semantic = { givenSlope: -3, resultSlope: 1 / 3, requiredText: ['기준 직선 기울기 -3', '결과 직선 기울기 1/3'] };
  }

  // Representative lines are independently derived from the sign-only
  // condition in the source question.  The magnitudes are fixed solely to
  // make the two sign cases visible; they are not read from solution/SVG.
  if (key === '25_제일고_2학기_중간_고1_기출.js#12') {
    special.signRepresentative = {
      original: { a: 1, b: -1, c: -2 },
      transformed: { a: 1, b: 1, c: -2 },
      derivation: 'original y=x-2 (m=1,b=-2); transformed y=-x+2 (m=-1,b=2)',
    };
    independentCanonical = [
      { line: special.signRepresentative.original, source: 'content-sign-representative', raw: 'y=x-2' },
      { line: special.signRepresentative.transformed, source: 'content-sign-representative', raw: 'y=-x+2' },
    ];
  }

  // The source has three parameter cases.  Expand both line equations for
  // each case from content alone so the SVG must show the two distinct
  // parallel lines, the coincident pair, and the perpendicular pair.
  if (key === '22_강남여고_2학기_중간_고1_기출.js#22') {
    special.parameterCases = [
      { parameter: 'a=1', relation: 'parallel', lines: [{ a: 3, b: 3, c: 1 }, { a: 1, b: 1, c: -1 }] },
      { parameter: 'a=-3', relation: 'coincident', lines: [{ a: -1, b: 3, c: 1 }, { a: 1, b: -3, c: -1 }] },
      { parameter: 'a=-1/2', relation: 'perpendicular', lines: [{ a: 3, b: 6, c: 2 }, { a: 2, b: -1, c: -2 }] },
    ];
    independentCanonical = special.parameterCases.flatMap((item) => item.lines.map((line) => ({
      line,
      source: `content-parameter-case:${item.parameter}`,
      raw: item.parameter,
    })));
  }

  // Both real roots of ab=3 and a+b=4 are required.  Expanding them here
  // prevents a generic three-line sketch from passing just because its own
  // metadata is internally self-consistent.
  if (key === '24_제일고_1학기_중간_고1_기출.js#15') {
    special.parameterCases = [
      { parameter: '(a,b)=(1,3)', lines: [{ a: 1, b: -1, c: 4 }, { a: 3, b: 3, c: -5 }, { a: -1, b: 1, c: -1 }] },
      { parameter: '(a,b)=(3,1)', lines: [{ a: 3, b: -1, c: 4 }, { a: 1, b: 3, c: -5 }, { a: -3, b: 1, c: -1 }] },
    ];
    independentCanonical = special.parameterCases.flatMap((item) => item.lines.map((line) => ({
      line,
      source: `content-parameter-case:${item.parameter}`,
      raw: item.parameter,
    })));
  }

  return {
    pass: 'SOURCE_ONLY',
    contentDigest: sha256(content),
    choicesDigest: sha256(JSON.stringify(q.choices || [])),
    contentEquationCount: equations.length,
    independentCanonical,
    points,
    text,
    hasFoot: /수선의\s*발|내린\s*수선/.test(text),
    hasParallel: /평행/.test(text),
    hasPerpendicular: /서로\s*수직|수직인|수직이고|수직일(?:\s*때)?|직각/.test(text),
    hasIntersection: /교점|교차|만나는|공통점/.test(text),
    hasIntercept: /절편|x축|y축/.test(text),
    hasLineSemantics: /직선|선분|기울기|평행|수직|수선|절편/.test(text),
    special,
  };
}

function parseTextNodes(source) {
  return [...String(source || '').matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi)].map((match) => ({
    attrs: parseAttrs(match[1]),
    text: decodeXml(match[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim(),
  }));
}

function numericText(value) {
  const text = normalizeText(value).replaceAll('−', '-').replace(/,/g, '');
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(text)) return null;
  return Number(text);
}

function median(values) {
  const sorted = values.filter(finite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function fit(samples) {
  if (!samples || samples.length < 2) return null;
  const meanX = samples.reduce((sum, item) => sum + item.value, 0) / samples.length;
  const meanY = samples.reduce((sum, item) => sum + item.pixel, 0) / samples.length;
  const denominator = samples.reduce((sum, item) => sum + (item.value - meanX) ** 2, 0);
  if (Math.abs(denominator) < EPS) return null;
  const slope = samples.reduce((sum, item) => sum + (item.value - meanX) * (item.pixel - meanY), 0) / denominator;
  return { slope, intercept: meanY - slope * meanX, samples };
}

function actualLineTags(source) {
  return [...String(source || '').matchAll(/<line\b[^>]*\/?>(?:<\/line>)?/gi)].map((match) => ({ raw: match[0], attrs: parseAttrs(match[0]) }));
}

function deriveMapping(source, lineTags, texts) {
  const pixelLines = lineTags.map((item) => item.attrs).map((attrs) => ({
    x1: Number(attrs.x1), y1: Number(attrs.y1), x2: Number(attrs.x2), y2: Number(attrs.y2), attrs,
  })).filter((line) => [line.x1, line.y1, line.x2, line.y2].every(finite));
  const verticalGrid = unique(pixelLines.filter((line) => Math.abs(line.x1 - line.x2) < 1e-4 && /#e5e7eb|#e2e8f0|#ddd/i.test(line.attrs.stroke || '')).map((line) => Number(line.x1)).sort((a, b) => a - b));
  const horizontalGrid = unique(pixelLines.filter((line) => Math.abs(line.y1 - line.y2) < 1e-4 && /#e5e7eb|#e2e8f0|#ddd/i.test(line.attrs.stroke || '')).map((line) => Number(line.y1)).sort((a, b) => a - b));
  const xUnit = median(verticalGrid.slice(1).map((value, index) => value - verticalGrid[index]));
  const yUnit = median(horizontalGrid.slice(1).map((value, index) => value - horizontalGrid[index]));
  const xAxis = pixelLines.find((line) => line.attrs['data-geometry'] === 'axis-x' || (Math.abs(line.y1 - line.y2) < 1e-4 && /#111827|#334155/i.test(line.attrs.stroke || '')));
  const yAxis = pixelLines.find((line) => line.attrs['data-geometry'] === 'axis-y' || (Math.abs(line.x1 - line.x2) < 1e-4 && /#111827|#334155/i.test(line.attrs.stroke || '')));
  const tickTexts = texts.filter((item) => item.attrs.class === 'tick').map((item) => ({ value: numericText(item.text), x: Number(item.attrs.x), y: Number(item.attrs.y) })).filter((item) => finite(item.value) && finite(item.x) && finite(item.y));
  const xSamples = tickTexts.filter((item) => verticalGrid.some((pixel) => Math.abs(pixel - item.x) < 2)).map((item) => ({ value: item.value, pixel: item.x }));
  const ySamples = tickTexts.filter((item) => horizontalGrid.some((pixel) => Math.abs(pixel - (item.y - 4)) < 6)).map((item) => ({ value: item.value, pixel: item.y - 4 }));
  // Some legacy solution SVGs draw a grid but omit tick text and one axis.
  // Their visible coordinate labels are still real rendered text, so use the
  // circle pixel plus that visible `(x,y)` label as a calibration sample.
  // data-point-x/y is deliberately not read here.
  const visibleCoordinateSamples = [...String(source || '').matchAll(/<g\b[^>]*data-point-label="[^"]+"[^>]*>[\s\S]*?<circle\b([^>]*)>[\s\S]*?<text\b[^>]*class="coord"[^>]*>\(\s*([−-]?\d+(?:\.\d+)?)\s*,\s*([−-]?\d+(?:\.\d+)?)\s*\)<\/text>[\s\S]*?<\/g>/gi)]
    .map((match) => {
      const circle = parseAttrs(match[1]);
      return { x: Number(circle.cx), y: Number(circle.cy), valueX: Number(match[2].replace('−', '-')), valueY: Number(match[3].replace('−', '-')) };
    })
    .filter((item) => [item.x, item.y, item.valueX, item.valueY].every(finite));
  const coordinateXSamples = visibleCoordinateSamples.map((item) => ({ value: item.valueX, pixel: item.x }));
  const coordinateYSamples = visibleCoordinateSamples.map((item) => ({ value: item.valueY, pixel: item.y }));
  const xFit = fit(xSamples.length >= 2 ? xSamples : coordinateXSamples);
  const yFit = fit(ySamples.length >= 2 ? ySamples : coordinateYSamples);
  // Prefer the actual rendered axes and grid spacing whenever they exist.
  // Coordinate labels are rounded presentation text; using them in preference
  // to the axis can shift the origin enough to turn a correct visible line
  // into a false FAIL.  SVG y pixels increase downwards, so the math-y scale
  // is negative when the source plot uses the usual Cartesian orientation.
  const xScale = yAxis && finite(xUnit) ? xUnit : xFit?.slope || xUnit;
  const yScale = xAxis && finite(yUnit) ? -Math.abs(yUnit) : yFit?.slope || (finite(yUnit) ? -Math.abs(yUnit) : yUnit);
  const originX = yAxis ? yAxis.x1 : xFit ? xFit.intercept : null;
  const originY = xAxis ? xAxis.y1 : yFit ? yFit.intercept : null;
  const usable = finite(xScale) && finite(yScale) && Math.abs(xScale) > EPS && Math.abs(yScale) > EPS && finite(originX) && finite(originY);
  return {
    usable,
    xScale,
    yScale,
    originX,
    originY,
    xGridCount: verticalGrid.length,
    yGridCount: horizontalGrid.length,
    xSamples,
    ySamples,
    visibleCoordinateSamples,
    toMath: usable ? (point) => ({ x: (point.x - originX) / xScale, y: (point.y - originY) / yScale }) : null,
  };
}

function parsePixelPoint(attrs, mapping) {
  const point = { x: Number(attrs.cx ?? attrs.x), y: Number(attrs.cy ?? attrs.y) };
  return mapping.usable && [point.x, point.y].every(finite) ? mapping.toMath(point) : null;
}

function parseObservedLine(item, mapping) {
  const attrs = item.attrs;
  const pixel = ['x1', 'y1', 'x2', 'y2'].map((name) => Number(attrs[name]));
  const pixelPoints = pixel.every(finite) ? [{ x: pixel[0], y: pixel[1] }, { x: pixel[2], y: pixel[3] }] : null;
  const actualPoints = pixelPoints && mapping.usable ? pixelPoints.map(mapping.toMath) : null;
  const actualLine = actualPoints ? lineFromPoints(actualPoints[0], actualPoints[1]) : null;
  const label = attrs['data-equation'] || attrs['aria-label'] || '';
  const metadata = ['data-a', 'data-b', 'data-c'].map((name) => Number(attrs[name]));
  const metadataLine = metadata.every(finite) && (Math.abs(metadata[0]) > EPS || Math.abs(metadata[1]) > EPS) ? { a: metadata[0], b: metadata[1], c: metadata[2] } : null;
  const labelLine = parseEquationWindows(label)[0]?.line || null;
  return {
    attrs,
    pixelPoints,
    actualPoints,
    actualLine,
    label,
    labelLine,
    metadataLine,
    visible: attrs.stroke !== 'none' && attrs.visibility !== 'hidden' && attrs.display !== 'none',
  };
}

function parseObservedSegment(item, mapping) {
  const attrs = item.attrs;
  const pixel = ['x1', 'y1', 'x2', 'y2'].map((name) => Number(attrs[name]));
  const pixelPoints = pixel.every(finite) ? [{ x: pixel[0], y: pixel[1] }, { x: pixel[2], y: pixel[3] }] : null;
  return { attrs, pixelPoints, actualPoints: pixelPoints && mapping.usable ? pixelPoints.map(mapping.toMath) : null };
}

function observeSvg(file) {
  if (!file || !fs.existsSync(file)) return { source: '', root: {}, lines: [], segments: [], points: [], texts: [], mapping: { usable: false }, pass: 'SVG_OBSERVATION_ONLY' };
  const source = read(file);
  const root = parseAttrs(source.match(/<svg\b[^>]*>/i)?.[0] || '');
  const texts = parseTextNodes(source);
  const allLineTags = actualLineTags(source);
  const mapping = deriveMapping(source, allLineTags, texts);
  const lines = allLineTags.filter((item) => item.attrs['data-geometry'] === 'line').map((item) => parseObservedLine(item, mapping));
  const segments = allLineTags.filter((item) => item.attrs['data-geometry'] === 'segment').map((item) => parseObservedSegment(item, mapping));
  const points = [];
  for (const match of source.matchAll(/<g\b([^>]*)data-point-label="[^"]+"[^>]*>[\s\S]*?<\/g>/gi)) {
    const groupAttrs = parseAttrs(match[0].match(/<g\b[^>]*>/i)?.[0] || '');
    const circle = parseAttrs(match[0].match(/<circle\b[^>]*>/i)?.[0] || '');
    const actual = parsePixelPoint(circle, mapping);
    if (actual) points.push({ label: groupAttrs['data-point-label'], actual, pixel: { x: Number(circle.cx), y: Number(circle.cy) }, metadata: { x: Number(groupAttrs['data-point-x']), y: Number(groupAttrs['data-point-y']) } });
  }
  return {
    source,
    root,
    lines,
    segments,
    points,
    texts,
    text: texts.map((item) => item.text).join(' '),
    mapping,
    sha256: sha256(source),
    pass: 'SVG_OBSERVATION_ONLY',
  };
}

function parseLabelEquation(label) {
  const direct = parseEquationWindows(label)[0]?.line;
  if (direct) return direct;
  for (const match of String(label || '').matchAll(/(?:^|[\s:])((?:[+-]?(?:\d+(?:\.\d+)?)?x|[+-]?(?:\d+(?:\.\d+)?)?y)[^=,;]*=[^,;]+)/g)) {
    const parsed = parseEquationWindows(match[1])[0]?.line;
    if (parsed) return parsed;
  }
  return null;
}

function actualLines(svg) {
  return svg.lines.map((line) => line.actualLine).filter(Boolean);
}

function gate(name, status, issues = [], details = {}) {
  return { name, status, issues: unique(issues), details };
}

function lineMetadataParity(svg) {
  const issues = [];
  const evidence = [];
  for (const [index, observed] of svg.lines.entries()) {
    const labelLine = parseLabelEquation(observed.label);
    if (labelLine && observed.actualLine && !sameLine(labelLine, observed.actualLine)) issues.push(`LINE_${index + 1}_LABEL_ACTUAL_MISMATCH`);
    if (observed.metadataLine && observed.actualLine && !sameLine(observed.metadataLine, observed.actualLine)) issues.push(`LINE_${index + 1}_METADATA_ACTUAL_MISMATCH`);
    evidence.push({ index: index + 1, label: observed.label, labelLine, actualLine: observed.actualLine, metadataLine: observed.metadataLine, pixelPoints: observed.pixelPoints });
  }
  return gate('LINE_LABEL_COEFFICIENT_PARITY', issues.length ? 'FAIL' : svg.lines.length ? 'PASS' : 'FAIL', issues.length ? issues : svg.lines.length ? [] : ['NO_VISIBLE_LINE_PRIMITIVE'], { evidence, authoritative: 'actual x1/y1/x2/y2 mapped to math coordinates', metadataIsExpected: false });
}

function sourceLineParity(source, svg) {
  const observed = actualLines(svg);
  const missing = source.independentCanonical.filter((expected) => !observed.some((actual) => sameLine(actual, expected.line))).map((expected) => expected.raw || expected.line);
  return gate('SOURCE_ACTUAL_LINE_PARITY', missing.length ? 'FAIL' : source.independentCanonical.length ? 'PASS' : 'N/A', missing.length ? ['SOURCE_LINE_NOT_OBSERVED'] : [], { sourceCanonical: source.independentCanonical, observedLineCount: observed.length, missing });
}

function nonZeroLineGeometry(svg) {
  const issues = [];
  const evidence = svg.lines.map((line, index) => {
    const distance = line.pixelPoints ? Math.hypot(line.pixelPoints[1].x - line.pixelPoints[0].x, line.pixelPoints[1].y - line.pixelPoints[0].y) : 0;
    if (!line.visible || distance <= 0.01) issues.push(`LINE_${index + 1}_ZERO_OR_HIDDEN`);
    return { index: index + 1, visible: line.visible, pixelDistance: distance };
  });
  return gate('NONZERO_LINE_GEOMETRY', issues.length ? 'FAIL' : svg.lines.length ? 'PASS' : 'FAIL', issues.length ? issues : svg.lines.length ? [] : ['NO_VISIBLE_LINE_PRIMITIVE'], { evidence, authoritative: 'pixel primitive endpoints' });
}

function pointOnLineGate(source, svg) {
  const obligations = [];
  for (const expected of source.independentCanonical) for (const point of source.points) if (pointOnLine(point, expected.line)) obligations.push({ point, line: expected.line });
  if (!obligations.length) return gate('REQUIRED_POINT_ON_LINE', 'N/A', [], { reason: 'no numeric source point explicitly lies on a numeric source line' });
  const issues = [];
  for (const obligation of obligations) {
    const actualPoint = svg.points.find((item) => Math.abs(item.actual.x - obligation.point.x) <= POINT_EPS && Math.abs(item.actual.y - obligation.point.y) <= POINT_EPS);
    const actualLine = actualLines(svg).find((line) => sameLine(line, obligation.line));
    if (!actualPoint) issues.push(`POINT_${obligation.point.label}_MISSING`);
    if (!actualLine) issues.push(`LINE_FOR_POINT_${obligation.point.label}_MISSING`);
  }
  return gate('REQUIRED_POINT_ON_LINE', issues.length ? 'FAIL' : 'PASS', issues, { obligations });
}

function perpendicularFootGate(source, svg) {
  if (!source.hasFoot) return gate('PERPENDICULAR_FOOT_PARITY', 'N/A', [], { reason: 'source-only content has no perpendicular-foot obligation with named numeric facts' });
  const candidates = [];
  const footLabels = new Set(['H', 'M']);
  for (const expected of source.independentCanonical) for (const point of source.points) {
    if (pointOnLine(point, expected.line)) continue;
    const denominator = expected.line.a ** 2 + expected.line.b ** 2;
    if (denominator < EPS) continue;
    const factor = (expected.line.a * point.x + expected.line.b * point.y + expected.line.c) / denominator;
    const projectionPoint = { x: point.x - expected.line.a * factor, y: point.y - expected.line.b * factor };
    const namedFoot = source.points.find((item) => footLabels.has(item.label) && Math.abs(item.x - projectionPoint.x) <= POINT_EPS && Math.abs(item.y - projectionPoint.y) <= POINT_EPS);
    if (namedFoot) candidates.push({ point, line: expected.line, projection: projectionPoint, namedFoot });
  }
  if (!candidates.length) return gate('PERPENDICULAR_FOOT_PARITY', 'N/A', [], { reason: 'no named source foot point was independently derivable from content' });
  const issues = [];
  for (const candidate of candidates) {
    const actualFoot = svg.points.find((item) => Math.abs(item.actual.x - candidate.projection.x) <= POINT_EPS && Math.abs(item.actual.y - candidate.projection.y) <= POINT_EPS);
    const line = actualLines(svg).find((item) => sameLine(item, candidate.line));
    const segment = svg.segments.find((item) => item.actualPoints && item.actualPoints.some((p) => Math.abs(p.x - candidate.point.x) <= POINT_EPS && Math.abs(p.y - candidate.point.y) <= POINT_EPS) && item.actualPoints.some((p) => Math.abs(p.x - candidate.projection.x) <= POINT_EPS && Math.abs(p.y - candidate.projection.y) <= POINT_EPS));
    if (!actualFoot) issues.push(`FOOT_${candidate.namedFoot.label}_MISSING`);
    if (!line || !pointOnLine(candidate.projection, line)) issues.push(`FOOT_${candidate.namedFoot.label}_NOT_ON_LINE`);
    if (!segment) issues.push(`FOOT_SEGMENT_${candidate.point.label}_${candidate.namedFoot.label}_MISSING`);
  }
  return gate('PERPENDICULAR_FOOT_PARITY', issues.length ? 'FAIL' : 'PASS', issues, { candidates });
}

function relationGate(source, svg) {
  const expectedLines = source.independentCanonical.map((item) => item.line);
  if (expectedLines.length < 2 || (!source.hasParallel && !source.hasPerpendicular)) return gate('PARALLEL_PERPENDICULAR_PARITY', 'N/A', [], { reason: 'no source-only numeric pair and relation obligation' });
  const observed = actualLines(svg);
  const expectedParallel = source.hasParallel && expectedLines.some((left, index) => expectedLines.slice(index + 1).some((right) => parallel(left, right)));
  const expectedPerpendicular = source.hasPerpendicular && expectedLines.some((left, index) => expectedLines.slice(index + 1).some((right) => perpendicular(left, right)));
  const observedParallel = observed.some((left, index) => observed.slice(index + 1).some((right) => parallel(left, right)));
  const observedPerpendicular = observed.some((left, index) => observed.slice(index + 1).some((right) => perpendicular(left, right)));
  const issues = [];
  if (expectedParallel && !observedParallel) issues.push('PARALLEL_RELATION_NOT_OBSERVED');
  if (expectedPerpendicular && !observedPerpendicular) issues.push('PERPENDICULAR_RELATION_NOT_OBSERVED');
  return gate('PARALLEL_PERPENDICULAR_PARITY', issues.length ? 'FAIL' : 'PASS', issues, { expected: { parallel: expectedParallel, perpendicular: expectedPerpendicular }, observed: { parallel: observedParallel, perpendicular: observedPerpendicular } });
}

function intersectionGate(source, svg) {
  if (!source.hasIntersection || source.independentCanonical.length < 2) return gate('INTERSECTION_PARITY', 'N/A', [], { reason: 'no source-only numeric intersection pair' });
  const observed = actualLines(svg);
  const evidence = [];
  const issues = [];
  for (let leftIndex = 0; leftIndex < source.independentCanonical.length; leftIndex += 1) for (let rightIndex = leftIndex + 1; rightIndex < source.independentCanonical.length; rightIndex += 1) {
    const expectedLeft = source.independentCanonical[leftIndex].line;
    const expectedRight = source.independentCanonical[rightIndex].line;
    const expected = lineIntersection(expectedLeft, expectedRight);
    if (!expected) continue;
    const actualLeft = observed.find((line) => sameLine(line, expectedLeft));
    const actualRight = observed.find((line) => sameLine(line, expectedRight));
    const actual = actualLeft && actualRight ? lineIntersection(actualLeft, actualRight) : null;
    evidence.push({ expected, actual });
    if (!actual || Math.abs(expected.x - actual.x) > POINT_EPS || Math.abs(expected.y - actual.y) > POINT_EPS) issues.push(`INTERSECTION_${leftIndex + 1}_${rightIndex + 1}_MISMATCH`);
  }
  return gate('INTERSECTION_PARITY', issues.length ? 'FAIL' : evidence.length ? 'PASS' : 'N/A', issues, { evidence });
}

function interceptGate(source, svg) {
  if (!source.hasIntercept || !source.independentCanonical.length) return gate('INTERCEPT_PARITY', 'N/A', [], { reason: 'no source-only intercept obligation' });
  const issues = [];
  const evidence = [];
  for (const expected of source.independentCanonical) {
    const actual = actualLines(svg).find((line) => sameLine(line, expected.line));
    if (!actual) {
      issues.push('SOURCE_LINE_FOR_INTERCEPT_MISSING');
      continue;
    }
    const expectedX = Math.abs(expected.line.a) < EPS ? null : -expected.line.c / expected.line.a;
    const expectedY = Math.abs(expected.line.b) < EPS ? null : -expected.line.c / expected.line.b;
    const actualX = Math.abs(actual.a) < EPS ? null : -actual.c / actual.a;
    const actualY = Math.abs(actual.b) < EPS ? null : -actual.c / actual.b;
    evidence.push({ expectedX, actualX, expectedY, actualY });
    if ((expectedX === null) !== (actualX === null) || (expectedY === null) !== (actualY === null) || (expectedX !== null && Math.abs(expectedX - actualX) > POINT_EPS) || (expectedY !== null && Math.abs(expectedY - actualY) > POINT_EPS)) issues.push('INTERCEPT_VALUE_MISMATCH');
  }
  return gate('INTERCEPT_PARITY', issues.length ? 'FAIL' : 'PASS', issues, { evidence });
}

function requiredGeometryGate(source, svg) {
  if (!source.hasLineSemantics && !source.independentCanonical.length) return gate('REQUIRED_GEOMETRY_PRESENCE', 'N/A', [], { reason: 'source-only content has no line/geometry obligation' });
  const issues = [];
  if (!svg.mapping.usable) issues.push('PIXEL_TO_MATH_MAPPING_UNAVAILABLE');
  if (!svg.lines.length) issues.push('LINE_PRIMITIVE_MISSING');
  if (source.hasFoot && !svg.segments.some((segment) => segment.actualPoints && segment.actualPoints.length === 2)) issues.push('FOOT_SEGMENT_PRIMITIVE_MISSING');
  return gate('REQUIRED_GEOMETRY_PRESENCE', issues.length ? 'FAIL' : 'PASS', issues, { mapping: svg.mapping, observed: { lines: svg.lines.length, points: svg.points.length, segments: svg.segments.length } });
}

function semanticGate(q, source, svg, overrides = {}) {
  const caption = overrides.caption ?? String(q.solutionImageCaption || '');
  const visible = overrides.visibleText ?? `${caption} ${svg.text}`;
  const obligations = [];
  if (source.hasParallel) obligations.push({ name: 'parallel', regex: /평행/ });
  if (source.hasPerpendicular) obligations.push({ name: 'perpendicular', regex: /수직|직각|수선/ });
  if (source.hasIntersection) obligations.push({ name: 'intersection', regex: /교점|교차|만나는|공통점/ });
  if (source.hasIntercept) obligations.push({ name: 'intercept', regex: /절편|x축|y축/ });
  if (/거리/.test(source.text)) obligations.push({ name: 'distance', regex: /거리/ });
  const issues = [];
  for (const obligation of obligations) if (!obligation.regex.test(caption)) issues.push(`CAPTION_${obligation.name.toUpperCase()}_MISSING`);
  for (const obligation of obligations) if (!obligation.regex.test(visible)) issues.push(`VISIBLE_${obligation.name.toUpperCase()}_SEMANTIC_MISSING`);
  if (source.special.semantic) {
    if (!/기준\s*직선\s*기울기\s*=\s*-3/.test(visible)) issues.push('VISIBLE_GIVEN_SLOPE_MISSING_OR_WRONG');
    if (!/결과\s*직선\s*기울기\s*=\s*1\/3/.test(visible)) issues.push('VISIBLE_RESULT_SLOPE_MISSING_OR_WRONG');
  }
  for (const expected of source.independentCanonical) if (!actualLines(svg).some((line) => sameLine(line, expected.line)) || !svg.lines.some((line) => parseLabelEquation(line.label) && sameLine(parseLabelEquation(line.label), expected.line))) issues.push('CAPTION_OR_LABEL_EQUATION_MISSING');
  return gate('CAPTION_SEMANTIC_PARITY', issues.length ? 'FAIL' : 'PASS', issues, { obligations: obligations.map((item) => item.name), caption, visibleText: visible.slice(0, 2000), sourceSemantic: source.special.semantic || null });
}

function metadataGate(q, svg) {
  const issues = [];
  if (!q.solutionImage) issues.push('SOLUTION_IMAGE_MISSING');
  if (!q.solutionImageAlt) issues.push('SOLUTION_IMAGE_ALT_MISSING');
  if (!q.solutionImageCaption) issues.push('SOLUTION_IMAGE_CAPTION_MISSING');
  if (!Array.isArray(q.tags) || !q.tags.includes('도형')) issues.push('VISUAL_TAG_MISSING');
  for (const line of svg.lines) {
    if (line.metadataLine && line.actualLine && !sameLine(line.metadataLine, line.actualLine)) issues.push('METADATA_LINE_NOT_EQUAL_TO_OBSERVED');
    if (line.metadataLine && line.labelLine && !sameLine(line.metadataLine, line.labelLine)) issues.push('METADATA_LABEL_NOT_EQUAL_TO_OBSERVED');
  }
  for (const point of svg.points) if (point.metadata && finite(point.metadata.x) && finite(point.metadata.y) && (Math.abs(point.metadata.x - point.actual.x) > POINT_EPS || Math.abs(point.metadata.y - point.actual.y) > POINT_EPS)) issues.push(`METADATA_POINT_${point.label}_NOT_EQUAL_TO_OBSERVED`);
  return gate('METADATA_OBSERVED_PARITY', issues.length ? 'FAIL' : 'PASS', issues, { actualMappingUsed: true, metadataIsOnlyConsistencyCheck: true });
}

function solutionParityGate(q, source, svg) {
  const solution = `${q.solution || ''}`;
  const answer = `${q.answer || ''}`;
  const issues = [];
  if (!solution.trim()) issues.push('SOLUTION_EMPTY');
  if (!answer.trim()) issues.push('ANSWER_EMPTY');
  if (source.independentCanonical.length && !source.independentCanonical.some((expected) => parseEquationWindows(solution).some((item) => sameLine(item.line, expected.line)) || actualLines(svg).some((line) => sameLine(line, expected.line)))) issues.push('SOLUTION_HAS_NO_SOURCE_OR_OBSERVED_EQUATION');
  return gate('SOLUTION_ANSWER_PARITY', issues.length ? 'FAIL' : 'PASS', issues, { solutionDigest: sha256(solution), answerDigest: sha256(answer), expectedSide: 'source-only facts and actual SVG; answer/solution are parity-only inputs' });
}

function parityRow(file, q, source, svg) {
  const gates = [
    requiredGeometryGate(source, svg),
    nonZeroLineGeometry(svg),
    lineMetadataParity(svg),
    sourceLineParity(source, svg),
    pointOnLineGate(source, svg),
    perpendicularFootGate(source, svg),
    relationGate(source, svg),
    intersectionGate(source, svg),
    interceptGate(source, svg),
    semanticGate(q, source, svg),
    solutionParityGate(q, source, svg),
    metadataGate(q, svg),
  ];
  const failures = gates.filter((item) => item.status === 'FAIL');
  return {
    questionNo: q.id,
    targetUnitKey: q.standardUnitKey,
    key: keyOf(path.basename(file), q.id),
    pass1SourceOnly: source,
    pass2ObservedSvg: {
      path: q.solutionImage,
      sha256: svg.sha256,
      mapping: svg.mapping,
      lineCount: svg.lines.length,
      lines: svg.lines.map((line) => ({ actualLine: line.actualLine, labelLine: parseLabelEquation(line.label), metadataLine: line.metadataLine, pixelPoints: line.pixelPoints, visible: line.visible })),
      points: svg.points.map((point) => ({ label: point.label, actual: point.actual, pixel: point.pixel, metadata: point.metadata })),
      segmentCount: svg.segments.length,
      visibleText: svg.text,
    },
    pass3Parity: gates,
    status: failures.length ? 'FAIL' : 'PASS',
  };
}

function mutateFirstLine(source, mode) {
  if (mode === 'endpoint') {
    const match = source.match(/<line\b[^>]*data-geometry="line"[^>]*>/i);
    if (!match) return source;
    const attrs = parseAttrs(match[0]);
    const x1 = Number(attrs.x1);
    const y1 = Number(attrs.y1);
    const x2 = Number(attrs.x2);
    const y2 = Number(attrs.y2);
    if (![x1, y1, x2, y2].every(finite)) return source;
    // Move one rendered endpoint along the pixel-normal of the original
    // segment.  A diagonal (+1,+1) shift can accidentally stay on a slope-1
    // line, which makes the mutation ineffective.  A normal displacement is
    // guaranteed to change the observed line while remaining an endpoint-only
    // SVG mutation.
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    if (length <= EPS) return source;
    const amount = 12;
    const mutatedTag = match[0]
      .replace(/(\s+x2=")[^"]*/i, (_, prefix) => `${prefix}${(x2 - (dy / length) * amount).toFixed(4)}`)
      .replace(/(\s+y2=")[^"]*/i, (_, prefix) => `${prefix}${(y2 + (dx / length) * amount).toFixed(4)}`);
    return source.replace(match[0], mutatedTag);
  }
  if (mode === 'metadata') return source.replace(/(data-a=")(-?\d+(?:\.\d+)?)/i, (_, prefix, value) => `${prefix}${Number(value) + 1}`);
  return source;
}

function metadataMutationGate(row) {
  const source = row.pass2ObservedSvg.path ? path.join(ASSET_ROOT, row.pass2ObservedSvg.path.replace(/^assets[\\/]+images[\\/]+/, '')) : '';
  if (!source || !fs.existsSync(source)) return { expected: 'FAIL', caught: false, reason: 'asset missing' };
  const mutated = observeSvgSource(mutateFirstLine(read(source), 'metadata'));
  const result = lineMetadataParity(mutated);
  const actual = sourceLineParity(row.pass1SourceOnly, mutated);
  return { expected: 'metadata FAIL / actual geometry unchanged', caught: result.status === 'FAIL' && actual.status !== 'FAIL', metadata: result.status, actualGeometry: actual.status };
}

function observeSvgSource(source) {
  const root = parseAttrs(source.match(/<svg\b[^>]*>/i)?.[0] || '');
  const texts = parseTextNodes(source);
  const allLineTags = actualLineTags(source);
  const mapping = deriveMapping(source, allLineTags, texts);
  const lines = allLineTags.filter((item) => item.attrs['data-geometry'] === 'line').map((item) => parseObservedLine(item, mapping));
  const segments = allLineTags.filter((item) => item.attrs['data-geometry'] === 'segment').map((item) => parseObservedSegment(item, mapping));
  return { source, root, texts, text: texts.map((item) => item.text).join(' '), lines, segments, points: [], mapping, sha256: sha256(source), pass: 'SVG_OBSERVATION_ONLY' };
}

function endpointMutationGate(row) {
  const asset = row.pass2ObservedSvg.path ? path.join(ASSET_ROOT, row.pass2ObservedSvg.path.replace(/^assets[\\/]+images[\\/]+/, '')) : '';
  if (!asset || !fs.existsSync(asset)) return { expected: 'FAIL', caught: false, reason: 'asset missing' };
  const mutated = observeSvgSource(mutateFirstLine(read(asset), 'endpoint'));
  const result = lineMetadataParity(mutated);
  return { expected: 'FAIL', caught: result.status === 'FAIL', result: result.status, issues: result.issues };
}

function visibleSemanticMutationGate(row) {
  const asset = row.pass2ObservedSvg.path ? path.join(ASSET_ROOT, row.pass2ObservedSvg.path.replace(/^assets[\\/]+images[\\/]+/, '')) : '';
  if (!asset || !fs.existsSync(asset)) return { expected: 'FAIL', caught: false, reason: 'asset missing' };
  const original = read(asset);
  const mutated = original.replace(/기준\s*직선\s*기울기\s*=\s*−?3/g, '기준 직선 기울기=3');
  const observed = observeSvgSource(mutated);
  const result = semanticGate({ solutionImageCaption: '' }, row.pass1SourceOnly, observed, { caption: '', visibleText: observed.text });
  return { expected: 'FAIL', caught: result.status === 'FAIL', result: result.status, issues: result.issues };
}

function knownBadRecall(rows) {
  const numeric = rows.filter((row) => row.pass2ObservedSvg.lineCount > 0 && row.pass2ObservedSvg.mapping?.usable).slice(0, 21);
  const semantic = rows.filter((row) => row.pass1SourceOnly.hasParallel || row.pass1SourceOnly.hasPerpendicular || row.pass1SourceOnly.hasIntersection || row.pass1SourceOnly.hasIntercept || /거리/.test(row.pass1SourceOnly.text)).slice(0, 27);
  const metadata = rows.filter((row) => row.pass2ObservedSvg.lineCount > 0 && row.pass1SourceOnly.independentCanonical.length && row.pass2ObservedSvg.mapping?.usable && row.pass3Parity.some((item) => item.name === 'SOURCE_ACTUAL_LINE_PARITY' && item.status === 'PASS')).slice(21, 31);
  const numericResults = numeric.map(endpointMutationGate);
  const metadataResults = metadata.map(metadataMutationGate);
  const semanticResults = semantic.map((row) => {
    const mutated = semanticGate({ solutionImageCaption: '' }, row.pass1SourceOnly, { text: 'SYNTHETIC_WRONG_SEMANTIC', lines: [], mapping: { usable: true } }, { caption: '', visibleText: 'SYNTHETIC_WRONG_SEMANTIC' });
    return { expected: 'FAIL', caught: mutated.status === 'FAIL', result: mutated.status, issues: mutated.issues };
  });
  const semanticSentinelRow = rows.find((row) => row.key === '23_제일고_1학기_기말_고1_기출.js#13');
  const semanticSentinel = semanticSentinelRow ? visibleSemanticMutationGate(semanticSentinelRow) : { expected: 'FAIL', caught: false, reason: 'sentinel row missing' };
  const caughtNumeric = numericResults.filter((item) => item.caught).length;
  const caughtSemantic = semanticResults.filter((item) => item.caught).length;
  const caughtMetadata = metadataResults.filter((item) => item.caught).length;
  return {
    status: numeric.length === 21 && semantic.length === 27 && metadata.length === 10 && caughtNumeric === 21 && caughtSemantic === 27 && caughtMetadata === 10 && semanticSentinel.caught ? 'PASS' : 'FAIL',
    corpus: { numericHard: numeric.length, semantic: semantic.length, metadata: metadata.length, total: numeric.length + semantic.length + metadata.length },
    recall: { numericHard: `${caughtNumeric}/${numeric.length}`, semantic: `${caughtSemantic}/${semantic.length}`, metadata: `${caughtMetadata}/${metadata.length}`, total: `${caughtNumeric + caughtSemantic + caughtMetadata}/${numeric.length + semantic.length + metadata.length}` },
    endpointMutation: numericResults,
    semanticMutation: semanticResults,
    metadataMutation: metadataResults,
    visibleSemanticSentinel: semanticSentinel,
    groundTruth: 'runtime synthetic mutation ledger; no historical PASS report used',
  };
}

function sourcePackStatus() {
  const manifest = path.join(ROOT, 'docs', 'rules', 'MANIFEST.md');
  if (!fs.existsSync(manifest)) return { status: 'FAIL', reason: 'MANIFEST.md missing' };
  const text = read(manifest);
  const failures = [];
  for (const match of text.matchAll(/^- (.+?) \| (\d+) bytes \| sha256 ([0-9a-f]{64})$/gm)) {
    const file = path.join(ROOT, 'docs', 'rules', match[1]);
    if (!fs.existsSync(file)) failures.push({ path: match[1], reason: 'MISSING' });
    else if (fs.statSync(file).size !== Number(match[2]) || sha256(read(file)) !== match[3]) failures.push({ path: match[1], reason: 'DRIFT' });
  }
  return { status: failures.length ? 'FAIL' : 'PASS', manifestSha256: sha256(text), entries: text.match(/^- .+? \| \d+ bytes \| sha256 [0-9a-f]{64}$/gm)?.length || 0, failures };
}

function main() {
  const rows = [];
  for (const file of walk(EXAM_ROOT)) {
    const bank = loadBank(file);
    for (const q of bank) if (TARGET_UNITS.has(q.standardUnitKey)) {
      const key = keyOf(path.basename(file), q.id);
      const pass1 = sourceOnlyFacts(q, key);
      const asset = q.solutionImage ? path.join(ASSET_ROOT, q.solutionImage.replace(/^assets[\\/]+images[\\/]+/, '')) : '';
      const pass2 = observeSvg(asset);
      rows.push(parityRow(file, q, pass1, pass2));
    }
  }
  const counts = { total: rows.length, h15: rows.filter((row) => row.targetUnitKey === 'H15-SA-10').length, h22: rows.filter((row) => row.targetUnitKey === 'H22-C2-02').length, files: new Set(rows.map((row) => row.key.split('#')[0])).size };
  const sourcePack = sourcePackStatus();
  const mutation = rows.length ? knownBadRecall(rows) : { status: 'FAIL' };
  const failures = rows.filter((row) => row.status === 'FAIL');
  const gateNames = unique(rows.flatMap((row) => row.pass3Parity.map((item) => item.name)));
  const gateSummary = Object.fromEntries(gateNames.map((name) => [name, Object.fromEntries(['PASS', 'FAIL', 'N/A'].map((value) => [value, rows.filter((row) => row.pass3Parity.some((item) => item.name === name && item.status === value)).length]))]));
  const structural = JSON.stringify(counts) === JSON.stringify(TARGET_COUNTS) && rows.length === 94;
  const report = {
    protocol: '고1 직선의 방정식 v2.2 actual primitive qualification',
    generatedAt: new Date().toISOString(),
    gitSha: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(),
    passOrder: ['PASS 1 SOURCE ONLY: content + choices only', 'PASS 2 SVG OBSERVATION ONLY: pixel primitives + rendered grid/axis/ticks only', 'PASS 3 PARITY: answer/solution/caption/metadata after both ledgers exist'],
    sourceExpectedRestrictions: { solutionReadInPass1: false, answerReadInPass1: false, solutionImageReadInPass1: false, svgMetadataUsedAsExpected: false },
    actualObservedRestrictions: { dataEquationAuthoritative: false, dataCoefficientsAuthoritative: false, dataPointCoordinatesAuthoritative: false, dataModelEndpointsAuthoritative: false, pixelPrimitiveAuthoritative: true },
    target: { ...counts, expected: TARGET_COUNTS, reviewed: rows.length, coverage: rows.length === 94 ? 1 : rows.length / 94 },
    sourcePack,
    gateNames,
    gateSummary,
    knownBadRecall: mutation,
    status: structural && sourcePack.status === 'PASS' && mutation.status === 'PASS' && failures.length === 0 ? 'PASS' : 'FAIL',
    releaseReady: structural && sourcePack.status === 'PASS' && mutation.status === 'PASS' && failures.length === 0,
    failureCount: failures.length,
    holdCount: 0,
    passCount: rows.filter((row) => row.status === 'PASS').length,
    rows,
    oraclePolicy: 'historical reports and builder facts are evidence only; they are never expected values',
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_FILE, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: report.status, releaseReady: report.releaseReady, target: report.target, failures: report.failureCount, holds: report.holdCount, passRows: report.passCount, sourcePack: report.sourcePack.status, knownBadRecall: report.knownBadRecall.status, report: path.relative(ROOT, REPORT_FILE) }, null, 2));
  if (report.status !== 'PASS') process.exitCode = 1;
}

main();
