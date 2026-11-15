import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const digest = value => createHash('sha256').update(value).digest('hex');
const colorPattern = /^#[0-9a-f]{6}$/i;
const idPattern = /^[a-z][a-z0-9_-]*$/i;

function replaceExpected(value, pattern, replacement, label, expected = 1) {
  let matches = 0;
  const result = value.replace(pattern, (...args) => {
    matches++;
    return replacement(...args);
  });
  if (matches !== expected || result === value) throw Error('Unexpected stroke profile target count: ' + label);
  return result;
}

function adjustElement(svg, { elementId, width }) {
  if (!idPattern.test(elementId) || !Number.isFinite(width) || width < 1 || width > 5) {
    throw Error('Invalid stroke profile element: ' + elementId);
  }
  const target = new RegExp('(<(?:line|polyline)\\b[^>]*\\s+id="' + elementId + '"[^>]*\\s+stroke-width=")[^"]+(")', 'g');
  return replaceExpected(svg, target, (_match, start, end) => start + width + end, elementId);
}

function adjustCurveClass(svg, { width, previousColor, color, expectedDeclarations = 1 }) {
  if (width !== undefined) {
    if (!Number.isFinite(width) || width < 1 || width > 5 || color !== undefined) {
      throw Error('Invalid curve class stroke width');
    }
    return replaceExpected(svg, /(?:\.shape,)?\.curve\{[^{}]*stroke-width:[^{}]+\}/g,
      rule => rule + '.curve{stroke-width:' + width + '}', '.curve');
  }
  if (!colorPattern.test(previousColor) || !colorPattern.test(color)
    || !Number.isSafeInteger(expectedDeclarations) || expectedDeclarations < 1) throw Error('Invalid curve class color');
  const rule = new RegExp('(\\.curve\\{[^{}]*?stroke:)' + previousColor + '(?=;|\\})', 'g');
  return replaceExpected(svg, rule, (_match, start) => start + color, '.curve color', expectedDeclarations);
}

function movePointLabel(svg, { text, dx, dy }) {
  if (!/^[A-Z]$/.test(text) || ![dx, dy].every(n => Number.isFinite(n) && Math.abs(n) <= 80)) {
    throw Error('Invalid point label placement');
  }
  const target = new RegExp('(<text\\b)([^>]*>\\s*' + text + '\\s*<\\/text>)', 'g');
  return replaceExpected(svg, target, (_match, start, rest) => {
    if (/\btransform\s*=/.test(rest)) throw Error('Point label already has a transform: ' + text);
    return start + ' transform="translate(' + dx + ' ' + dy + ')"' + rest;
  }, text);
}

function withAccessibility(svg, { title, description }) {
  if (![title, description].every(value => typeof value === 'string' && /[가-힣]/.test(value) && value.length <= 240)) {
    throw Error('Invalid problem figure accessibility description');
  }
  const xml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const cleaned = svg.replace(/<(title|desc)\b[^>]*>[\s\S]*?<\/\1>/g, '');
  return replaceExpected(cleaned, /<svg\b([^>]*)>/, (_match, attrs) => {
    const attributes = attrs.replace(/\s+(?:role|aria-labelledby|aria-describedby)\s*=\s*(?:"[^"]*"|'[^']*')/g, '');
    return '<svg' + attributes + ' role="img" aria-labelledby="figure-title figure-description">'
      + '<title id="figure-title">' + xml(title) + '</title><desc id="figure-description">' + xml(description) + '</desc>';
  }, 'figure accessibility');
}

// Keep the source's geometry, labels and typography fixed while tuning strokes
// or moving explicitly named point labels. Pin the source by its content hash.
export function composeProblemPresentation(plan, { repoRoot, identity }) {
  const { sourceAsset, sourceSha256, adjustments } = plan;
  if (typeof sourceAsset !== 'string' || !sourceAsset.startsWith('archive/assets/images/')
    || path.posix.normalize(sourceAsset) !== sourceAsset || /[\\:\x00]/.test(sourceAsset) || !sourceAsset.endsWith('.svg')
    || !Array.isArray(adjustments) || !adjustments.length) throw Error('Invalid problem figure presentation source');
  const original = fs.readFileSync(path.join(repoRoot, sourceAsset));
  const inputSha256 = digest(original);
  if (inputSha256 !== sourceSha256) throw Error('Problem figure source SHA mismatch');
  let svg = original.toString('utf8');
  for (const adjustment of adjustments) {
    if (plan.capability === 'problem-point-label-profile-v1') {
      svg = movePointLabel(svg, adjustment);
    } else if (adjustment.elementId) {
      svg = adjustElement(svg, adjustment);
    } else if (adjustment.selector === '.curve') {
      svg = replaceExpected(svg, /(<style(?:\s[^>]*)?>)([\s\S]*?)(<\/style>)/g,
        (_match, open, rules, close) => open + adjustCurveClass(rules, adjustment) + close, 'curve stylesheet');
    } else {
      throw Error('Unsupported problem stroke profile adjustment');
    }
  }
  if (plan.accessibility !== undefined) svg = withAccessibility(svg, plan.accessibility);
  if (plan.trimWhitespace === true) svg = svg.replace(/[\t ]+(?=\r?\n)/g, '');
  return { identity, status: 'STYLE_RECOMPOSED', inputSha256, outputSha256: digest(svg), svg };
}
