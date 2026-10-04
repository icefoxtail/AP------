import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const EVIDENCE_DIR = path.join(ROOT, 'docs/evidence/2025-m3-visual-publishing-normalize-a');
const INVENTORY_PATH = path.join(EVIDENCE_DIR, 'baseline-inventory.json');
const EXAMS = [
  'archive/exams/original/middle/m3/2mid/25_왕운중_2학기_중간_중3_수학.js',
  'archive/exams/original/middle/m3/2mid/25_풍덕중_2학기_중간_중3_수학.js',
  'archive/exams/original/middle/m3/2final/25_연향중_2학기_기말_중3_기출.js',
  'archive/exams/original/middle/m3/2final/25_금당중_2학기_기말_중3_기출.js',
  'archive/exams/original/middle/m3/2final/25_신흥중_2학기_기말_중3_기출.js',
];
const MOBILE = Object.freeze({ viewportCssPx: 390, imageWrapperCssPx: 298, pageScale: 0.471033, targetLabelCssPx: 12.2 });
const TEXT_FONT = '"Noto Sans KR", "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", Arial, sans-serif';
const MATH_FONT = '"STIX Two Math", "Cambria Math", "Times New Roman", serif';

const sha256 = bytes => 'sha256:' + crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlobSha = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const readGitHead = file => execFileSync('git', ['show', `HEAD:${file}`], { cwd: ROOT });
const parseQuestionBank = file => {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 5000 });
  const questions = context.window.questionBank || context.window.questions;
  if (!Array.isArray(questions)) throw new Error(`QUESTION_BANK_INVALID:${file}`);
  return questions;
};

function xmlText(raw) {
  return raw.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).trim();
}

function readAttr(attrs, name) {
  const match = new RegExp(`(?:^|\\s)${name}=(['"])([\\s\\S]*?)\\1`, 'i').exec(attrs);
  return match?.[2] ?? null;
}

function replaceAttr(attrs, name, value) {
  const matcher = new RegExp(`\\s${name}=(['"])[\\s\\S]*?\\1`, 'i');
  const escaped = String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  if (matcher.test(attrs)) return attrs.replace(matcher, ` ${name}="${escaped}"`);
  return `${attrs} ${name}="${escaped}"`;
}

function removeAttr(attrs, name) {
  return attrs.replace(new RegExp(`\\s${name}=(['"])[\\s\\S]*?\\1`, 'ig'), '');
}

function toneFor(attrs, text) {
  const role = readAttr(attrs, 'data-encoding-role');
  if (role === 'DERIVED_STYLE') return 'teal';
  if (role === 'CONCLUSION_STYLE') return 'blue';
  const fill = readAttr(attrs, 'fill') || (readAttr(attrs, 'style') || '').match(/(?:^|;)\s*fill\s*:\s*([^;]+)/i)?.[1] || '';
  const normalized = fill.toLowerCase().replace(/\s/g, '');
  if (['#0f766e', '#047857', '#16a34a', '#3e7773', '#059669', 'green'].includes(normalized)) return 'teal';
  if (['#2563eb', '#1d4ed8', '#3b82f6', 'blue'].includes(normalized)) return 'blue';
  if (['#dc2626', '#e11d48', '#f97316', '#f59e0b', 'red', 'orange'].includes(normalized)) return 'warm';
  if (/^\s*(?:x|y|r|R)\s*=/.test(text)) return 'blue';
  return 'neutral';
}

function normalizeColor(value) {
  const key = value.toLowerCase();
  if (['#000', '#000000', '#111', '#111111', '#202124', '#222', '#222222', 'black'].includes(key)) return '#1f2937';
  if (['#555', '#555555', '#59636e', '#666', '#666666', '#777', '#777777', '#888', '#888888', '#999', '#999999'].includes(key)) return '#94a3b8';
  if (['#047857', '#16a34a', '#3e7773', '#059669'].includes(key)) return '#0f766e';
  if (['#dc2626', '#e11d48', '#f97316', '#f59e0b'].includes(key)) return '#d97706';
  if (['#1d4ed8', '#3b82f6'].includes(key)) return '#2563eb';
  return value;
}

function normalizeStrokeWidth(value) {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n)) return value;
  if (Math.abs(n - 1) < 1e-9) return '1.15';
  if (Math.abs(n - 1.5) < 1e-9) return '1.35';
  if (Math.abs(n - 2) < 1e-9 || Math.abs(n - 2.1) < 1e-9) return '2.05';
  if (Math.abs(n - 3) < 1e-9) return '2.6';
  return value;
}

function normalizeStyleAttribute(value) {
  return value.split(';').map(part => {
    const m = /^\s*([^:]+)\s*:\s*([\s\S]*?)\s*$/.exec(part);
    if (!m) return part;
    const property = m[1].toLowerCase();
    let v = m[2].trim();
    if (property === 'stroke-width') v = normalizeStrokeWidth(v.replace(/px$/i, '')) + (v.endsWith('px') ? 'px' : '');
    if (property === 'stroke' || property === 'fill' || property === 'color') v = normalizeColor(v);
    return `${m[1].trim()}:${v}`;
  }).filter(Boolean).join(';');
}

function normalizeText(svg, screenFontPx, printFontPx) {
  let count = 0;
  const transformed = svg.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi, (_whole, originalAttrs, body) => {
    count += 1;
    const text = xmlText(body);
    let attrs = originalAttrs;
    const oldClass = readAttr(attrs, 'class') || '';
    const oldRole = readAttr(attrs, 'data-publication-font-role') || '';
    const originalWeight = readAttr(attrs, 'font-weight') || (readAttr(attrs, 'style') || '').match(/(?:^|;)\s*font-weight\s*:\s*([^;]+)/i)?.[1] || '';
    const isText = /\p{Script=Hangul}/u.test(text);
    const hasLatinVariable = /[A-Za-z]/.test(text);
    const originalTitle = /(?:^|\s)(?:title|heading|head)(?:\s|$)/i.test(oldClass) || /(?:^|\s)(?:title|heading|head)(?:\s|$)/i.test(oldRole);
    const tone = toneFor(attrs, text);
    const classSet = new Set(oldClass.split(/\s+/).filter(Boolean).filter(c => !/^ap-pub-/.test(c)));
    classSet.add('ap-pub-label');
    classSet.add(isText ? 'ap-pub-text' : 'ap-pub-math');
    if (!isText && hasLatinVariable) classSet.add('ap-pub-variable');
    if (!isText && !hasLatinVariable) classSet.add('ap-pub-numeric');
    if (originalTitle) classSet.add('ap-pub-title');
    if (originalWeight && /bold|[6-9]00/i.test(originalWeight)) classSet.add('ap-pub-strong');
    attrs = removeAttr(attrs, 'font-size');
    attrs = removeAttr(attrs, 'font-family');
    attrs = removeAttr(attrs, 'font-style');
    attrs = removeAttr(attrs, 'font-weight');
    attrs = removeAttr(attrs, 'fill');
    const oldStyle = readAttr(attrs, 'style');
    if (oldStyle) {
      const retained = normalizeStyleAttribute(oldStyle).split(';').filter(declaration => {
        const name = declaration.split(':', 1)[0].trim().toLowerCase();
        return !['font-size', 'font-family', 'font-style', 'font-weight', 'fill'].includes(name);
      }).join(';');
      attrs = retained ? replaceAttr(attrs, 'style', retained) : removeAttr(attrs, 'style');
    }
    attrs = replaceAttr(attrs, 'class', [...classSet].join(' '));
    attrs = replaceAttr(attrs, 'data-publication-font-role', isText ? 'TEXT' : (hasLatinVariable ? 'MATH_VARIABLE' : 'MATH_VALUE'));
    attrs = replaceAttr(attrs, 'data-publication-tone', tone);
    return `<text${attrs}>${body}</text>`;
  });

  const titleSize = Math.ceil(screenFontPx * 1.18);
  const style = `<style id="apmath-publication-style">\n` +
    `:root{color:#1f2937}\n` +
    `text.ap-pub-label{font-size:${screenFontPx}px!important;font-weight:500!important;fill:#1f2937!important;stroke:none!important;font-kerning:normal}\n` +
    `text.ap-pub-text{font-family:${TEXT_FONT}!important;font-style:normal!important}\n` +
    `text.ap-pub-math{font-family:${MATH_FONT}!important;font-style:normal!important}\n` +
    `text.ap-pub-variable{font-style:italic!important}\n` +
    `text.ap-pub-strong{font-weight:650!important}\n` +
    `text.ap-pub-title{font-size:${titleSize}px!important;font-weight:700!important;fill:#1f2937!important}\n` +
    `text.ap-pub-label[data-publication-tone="teal"]{fill:#0f766e!important}\n` +
    `text.ap-pub-label[data-publication-tone="blue"]{fill:#2563eb!important}\n` +
    `text.ap-pub-label[data-publication-tone="warm"]{fill:#d97706!important}\n` +
    `.g,.main{stroke:#1f2937!important;stroke-width:2.05px!important}\n` +
    `.aux,.guide{stroke:#94a3b8!important;stroke-width:1.35px!important;stroke-dasharray:5 4}\n` +
    `.hi,.accent{stroke:#2563eb!important;stroke-width:2.6px!important}\n` +
    `.dot{fill:#2563eb!important}\n` +
    `line,path,polyline,polygon,circle,ellipse{stroke-linecap:round;stroke-linejoin:round}\n` +
    `@media print{text.ap-pub-label{font-size:${printFontPx}px!important}text.ap-pub-title{font-size:${Math.ceil(printFontPx * 1.18)}px!important}}\n` +
    `</style>`;

  const withoutPrevious = transformed.replace(/<style\b[^>]*id=["']apmath-publication-style["'][^>]*>[\s\S]*?<\/style>/gi, '');
  const rootOpen = /<svg\b([^>]*)>/i.exec(withoutPrevious);
  if (!rootOpen) throw new Error('SVG_ROOT_MISSING');
  let rootAttrs = rootOpen[1];
  rootAttrs = replaceAttr(rootAttrs, 'data-publication-style-version', 'AP_M3_PUBLICATION_2026_10_04');
  const rootStyle = readAttr(rootAttrs, 'style');
  rootAttrs = replaceAttr(rootAttrs, 'style', rootStyle ? `${normalizeStyleAttribute(rootStyle)};color:#1f2937` : 'color:#1f2937');
  let output = withoutPrevious.slice(0, rootOpen.index) + `<svg${rootAttrs}>` + withoutPrevious.slice(rootOpen.index + rootOpen[0].length);
  output = output.replace(/\bstroke-width=(['"])([\d.]+)\1/gi, (_m, quote, v) => `stroke-width=${quote}${normalizeStrokeWidth(v)}${quote}`);
  output = output.replace(/\bstroke-width\s*:\s*([\d.]+)(px)?/gi, (_m, v, px = '') => `stroke-width:${normalizeStrokeWidth(v)}${px}`);
  output = output.replace(/\b(fill|stroke|color)=(['"])(#[\da-f]{3,8}|black|white|currentColor)\2/gi,
    (_m, property, quote, value) => `${property}=${quote}${normalizeColor(value)}${quote}`);
  output = output.replace(/(fill|stroke|color)\s*:\s*(#[\da-f]{3,8}|black|white|currentColor)/gi,
    (_m, property, value) => `${property}:${normalizeColor(value)}`);
  output = output.replace(/<circle\b([^>]*)>/gi, (whole, attrs) => {
    const radius = Number.parseFloat(readAttr(attrs, 'r'));
    if (!Number.isFinite(radius) || radius > 5 || Math.abs(radius - 3.2) < 1e-9) return whole;
    return `<circle${replaceAttr(attrs, 'r', '3.2')}>`;
  });
  output = output.replace(/<\/svg>\s*$/i, `${style}</svg>`);
  return { svg: output, labelCount: count, titleSize };
}

function viewBox(svg) {
  const raw = /\bviewBox=(['"])([^'"]+)\1/i.exec(svg)?.[2];
  if (!raw) throw new Error('SVG_VIEWBOX_MISSING');
  const values = raw.trim().split(/[\s,]+/).map(Number);
  if (values.length !== 4 || values.some(x => !Number.isFinite(x)) || values[2] <= 0 || values[3] <= 0) throw new Error('SVG_VIEWBOX_INVALID');
  return { x: values[0], y: values[1], width: values[2], height: values[3], raw };
}

function geometrySignature(svg) {
  const signature = [];
  const vb = viewBox(svg);
  signature.push({ tag: 'svg', viewBox: vb.raw, preserveAspectRatio: /\bpreserveAspectRatio=(['"])([^'"]+)\1/i.exec(svg)?.[2] || null });
  for (const match of svg.matchAll(/<(line|circle|ellipse|path|polygon|polyline|rect|g)\b([^>]*)>/gi)) {
    const tag = match[1].toLowerCase();
    const attrs = match[2];
    const get = name => readAttr(attrs, name);
    if (tag === 'g') {
      const transform = get('transform');
      if (transform) signature.push({ tag, transform });
      continue;
    }
    const row = { tag, id: get('id'), transform: get('transform') };
    for (const name of ['x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'rx', 'ry', 'x', 'y', 'width', 'height', 'd', 'points']) {
      const value = get(name);
      if (value !== null) row[name] = value;
    }
    const r = get('r');
    if (r !== null && (tag !== 'circle' || Number.parseFloat(r) > 5)) row.r = r;
    if (tag === 'rect' && row.x === null && row.y === null && row.width !== '100%' && row.height !== '100%') {
      row.x = get('x'); row.y = get('y');
    }
    signature.push(row);
  }
  return JSON.stringify(signature);
}

function listQuestionObjects(source, file) {
  const markerIndex = Math.max(source.indexOf('questionBank'), source.indexOf('questions'));
  const arrayStart = source.indexOf('[', markerIndex);
  if (arrayStart < 0) throw new Error(`QUESTION_ARRAY_NOT_FOUND:${file}`);
  const blocks = [];
  let squareDepth = 0, curlyDepth = 0, stringQuote = null, escaped = false, objectStart = -1;
  for (let i = arrayStart; i < source.length; i += 1) {
    const ch = source[i];
    if (stringQuote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === stringQuote) stringQuote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { stringQuote = ch; continue; }
    if (ch === '[') squareDepth += 1;
    else if (ch === ']') {
      squareDepth -= 1;
      if (squareDepth === 0) break;
    } else if (ch === '{') {
      if (squareDepth === 1 && curlyDepth === 0) objectStart = i;
      curlyDepth += 1;
    } else if (ch === '}') {
      curlyDepth -= 1;
      if (squareDepth === 1 && curlyDepth === 0 && objectStart >= 0) {
        blocks.push({ start: objectStart, end: i + 1, text: source.slice(objectStart, i + 1) });
        objectStart = -1;
      }
    }
  }
  return blocks;
}

function setAllSolutionImageSizesToFull(file) {
  let source = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const blocks = listQuestionObjects(source, file);
  let referenced = 0;
  for (const block of [...blocks].reverse()) {
    if (!/"solutionImage"\s*:\s*"[^"]+\.svg(?:\?[^"]*)?"/i.test(block.text)) continue;
    referenced += 1;
    let next = block.text;
    if (/"solutionImageSize"\s*:\s*"[^"]*"/.test(next)) {
      next = next.replace(/("solutionImageSize"\s*:\s*)"[^"]*"/, '$1"full"');
    } else {
      const close = next.lastIndexOf('}');
      const body = next.slice(0, close);
      const trailingComma = /,\s*$/.test(body);
      const indent = /\n([ \t]+)"[^"\n]+"\s*:/.exec(body)?.[1] || '    ';
      next = body + (trailingComma ? '' : ',') + `\n${indent}"solutionImageSize": "full"\n  }`;
    }
    source = source.slice(0, block.start) + next + source.slice(block.end);
  }
  fs.writeFileSync(file, source, 'utf8');
  const questions = parseQuestionBank(file);
  const fullCount = questions.filter(q => q.solutionImage && /\.svg(?:\?|$)/i.test(q.solutionImage) && q.solutionImageSize === 'full').length;
  if (fullCount !== referenced) throw new Error(`SOLUTION_SIZE_PARITY_FAIL:${file}:${fullCount}/${referenced}`);
  return { referenced, fullCount, questionCount: questions.length, sourceSha256: sha256(fs.readFileSync(file)) };
}

if (!fs.existsSync(INVENTORY_PATH)) throw new Error('BASELINE_INVENTORY_REQUIRED');
const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
const rows = [];
for (const item of inventory) {
  const baselineBytes = readGitHead(item.svgPath);
  const baselineSvg = baselineBytes.toString('utf8');
  const currentSvg = fs.readFileSync(item.svgPath, 'utf8').replace(/^\uFEFF/, '');
  const vb = viewBox(baselineSvg);
  const effectiveMobileScale = MOBILE.imageWrapperCssPx * MOBILE.pageScale / vb.width;
  const screenFontPx = Math.ceil(MOBILE.targetLabelCssPx / effectiveMobileScale);
  const printFontPx = Math.ceil(12 * vb.width / MOBILE.imageWrapperCssPx);
  const normalized = normalizeText(currentSvg, screenFontPx, printFontPx);
  const beforeSignature = geometrySignature(baselineSvg);
  const afterSignature = geometrySignature(normalized.svg);
  if (beforeSignature !== afterSignature) throw new Error(`SEMANTIC_GEOMETRY_SIGNATURE_CHANGED:${item.svgPath}`);
  const finalBytes = Buffer.from(normalized.svg, 'utf8');
  fs.writeFileSync(item.svgPath, finalBytes);
  rows.push({
    exam: item.exam,
    qid: item.qid,
    assetPath: item.svgPath,
    action: 'STYLE_NORMALIZE',
    semanticDisposition: 'KEEP_SEMANTIC',
    baselineSvgSha256: sha256(baselineBytes),
    baselineSvgGitBlobSha: gitBlobSha(baselineBytes),
    finalSvgSha256: sha256(finalBytes),
    finalSvgGitBlobSha: gitBlobSha(finalBytes),
    viewBox: vb,
    screenFontPx: { studentLabels: screenFontPx, title: normalized.titleSize, printStudentLabels: printFontPx },
    expectedFinalMobileFontFloorCssPx: Number((screenFontPx * effectiveMobileScale).toFixed(3)),
    styleTokens: ['TEXT_FONT_NOTO_SANS_KR', 'MATH_FONT_STIX_CAMBRIA', 'INK_1F2937', 'GUIDE_94A3B8', 'PRIMARY_2563EB', 'DERIVED_0F766E', 'WARM_D97706', 'MAIN_STROKE_2.05', 'AUX_STROKE_1.35', 'ACCENT_STROKE_2.6', 'FULL_ARCHIVE_SOLUTION_IMAGE'],
    semanticGeometryPreserved: true,
    geometrySignatureSha256: sha256(beforeSignature),
    labelCount: normalized.labelCount,
    sourceExamSha256: item.examSha256,
    solutionSha256: item.solutionSha256,
    title: item.title,
    decisiveRelation: item.solution,
    baselineAuthoredFontPx: item.fontPx,
    baselineDefaultImageSize: 'medium',
    normalizationReason: 'The live 390px Archive profile scales the medium A4 solution page and the image together; the prior SVG-font floor did not hold in the actual page viewport. Full-width solution-image placement and size-specific text tokens raise rendered labels above the 11 CSS px hard floor while retaining every geometry primitive.'
  });
}

const examUpdates = EXAMS.map(setAllSolutionImageSizesToFull);
const report = {
  schemaVersion: 'APMATH_M3_PUBLISHING_STYLE_NORMALIZATION_v1',
  createdAt: new Date().toISOString(),
  baselineCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(),
  mobileRenderProfile: MOBILE,
  denominator: rows.length,
  actions: { ALREADY_CURRENT: 0, STYLE_NORMALIZE: rows.length, POLISH: 0, REBUILD: 0 },
  geometryPrimitiveCoordinateChanges: 0,
  exams: EXAMS.map((file, i) => ({ path: file, ...examUpdates[i] })),
  items: rows,
};
fs.writeFileSync(path.join(EVIDENCE_DIR, 'normalization-ledger.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ denominator: rows.length, actions: report.actions, exams: report.exams.map(({ path: exam, questionCount, referenced, fullCount }) => ({ exam, questionCount, referenced, fullCount })), minAuthoredFinal: Math.min(...rows.map(r => r.screenFontPx.studentLabels)), maxAuthoredFinal: Math.max(...rows.map(r => r.screenFontPx.studentLabels)), minExpectedMobile: Math.min(...rows.map(r => r.expectedFinalMobileFontFloorCssPx)) }, null, 2));
