import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'docs/evidence/2025-m3-visual-publishing-normalize-a');
const browser = JSON.parse(fs.readFileSync(path.join(OUT, 'browser_render_evidence.json'), 'utf8'));
const examPaths = [...new Set(browser.exams.map(row => row.sourcePath))];
const questionsByExam = new Map();
for (const examPath of examPaths) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(examPath, 'utf8'), context, { filename: examPath, timeout: 5000 });
  questionsByExam.set(examPath, context.window.questionBank || context.window.questions);
}

const idIsPoint = text => /^[A-Z]$/.test(String(text || '').trim());
const numericOrAngle = text => /^(?:[-+]?\d+(?:\.\d+)?|[−+]?\d+(?:\.\d+)?(?:°|\s*cm|\s*m|\s*km)?|x\s*=\s*.+|y\s*=\s*.+|r\s*=\s*.+)$/i.test(String(text || '').trim());
const trim = value => String(value || '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").trim();

function attr(attrs, name) { return new RegExp(`(?:^|\\s)${name}=(['"])([\\s\\S]*?)\\1`, 'i').exec(attrs)?.[2] ?? null; }
function writeAttr(attrs, name, value) {
  const matcher = new RegExp(`\\s${name}=(['"])[\\s\\S]*?\\1`, 'i');
  const replacement = ` ${name}="${String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`;
  return matcher.test(attrs) ? attrs.replace(matcher, replacement) : `${attrs}${replacement}`;
}
function parseBox(value) { return { x: Number(value.x), y: Number(value.y), width: Number(value.width), height: Number(value.height) }; }
function overlap(a, b, gap = 2) { return a.x < b.x + b.width + gap && a.x + a.width + gap > b.x && a.y < b.y + b.height + gap && a.y + a.height + gap > b.y; }

function removable(label, question) {
  const text = String(label.text || '').trim();
  if (idIsPoint(text)) return null;
  const formulaBlock = /(?:→|\b(?:BC|CD|EF|AF)\s*:)/.test(text) && text.length >= 20;
  const clippedText = label.clipped && text.length > 10;
  const duplicatedLongConclusion = text.length >= 26 && /[=→]/.test(text) && question?.solution && String(question.solution).includes(text);
  const explanatoryRepeat = text.length >= 32 && /[가-힣]/.test(text);
  if (formulaBlock || clippedText || duplicatedLongConclusion || explanatoryRepeat) {
    return formulaBlock ? 'REDUNDANT_SOLUTION_EQUATION' : (clippedText ? 'REDUNDANT_CLIPPED_ANNOTATION' : 'REDUNDANT_LONG_ANNOTATION');
  }
  return null;
}

function priority(label) {
  if (idIsPoint(label.text)) return 0;
  if (label.ownerPoint || label.ownerSegment || label.ownerVertex) return 1;
  if (numericOrAngle(label.text) || label.kind === 'length' || label.kind === 'angle') return 2;
  if (String(label.text).length > 18) return 4;
  return 3;
}

function candidateOffsets() {
  const steps = [0, 10, -10, 20, -20, 30, -30, 40, -40, 50, -50, 60, -60, 75, -75, 90, -90, 110, -110, 130, -130];
  const out = [];
  for (const dy of steps) for (const dx of steps) out.push({ dx, dy, cost: Math.hypot(dx, dy) + (Math.abs(dx) + Math.abs(dy)) * 0.08 });
  return out.sort((a, b) => a.cost - b.cost);
}
const OFFSETS = candidateOffsets();

function normalizeOne(item, examRow, question) {
  const file = path.join(ROOT, item.assetPath);
  let svg = fs.readFileSync(file, 'utf8');
  const vbRaw = (svg.match(/\bviewBox=(['"])([^'"]+)\1/i) || [])[2];
  const vb = vbRaw.trim().split(/[\s,]+/).map(Number);
  const [vx, vy, vw, vh] = vb;
  const records = item.labels.map(label => ({
    ...label,
    originalAnchor: { x: Number(label.anchorSvg?.[0] ?? 0), y: Number(label.anchorSvg?.[1] ?? 0) },
    originalBox: parseBox(label.svgBBox),
    box: parseBox(label.svgBBox),
    removeReason: removable(label, question),
    move: { dx: 0, dy: 0 },
  }));
  const removed = records.filter(record => record.removeReason);
  const active = records.filter(record => !record.removeReason).sort((a, b) => priority(a) - priority(b) || String(a.text).length - String(b.text).length || a.id.localeCompare(b.id));
  const placed = [];
  const moves = [];
  const unresolved = [];
  for (const label of active) {
    const maxShift = idIsPoint(label.text) ? 38 : (label.ownerPoint || label.ownerSegment || label.ownerVertex) ? 68 : numericOrAngle(label.text) ? 100 : 150;
    let chosen = null;
    for (const offset of OFFSETS) {
      if (offset.cost > maxShift) continue;
      const box = { ...label.originalBox, x: label.originalBox.x + offset.dx, y: label.originalBox.y + offset.dy };
      if (box.x < vx + 5 || box.y < vy + 5 || box.x + box.width > vx + vw - 5 || box.y + box.height > vy + vh - 5) continue;
      if (placed.some(prior => overlap(box, prior.box, 3))) continue;
      chosen = { ...offset, box };
      break;
    }
    if (!chosen) {
      unresolved.push({ id: label.id, text: label.text, reason: 'NO_NONOVERLAPPING_SAFE_POSITION', originalAnchor: label.originalAnchor, originalBox: label.originalBox });
      placed.push({ ...label, box: label.originalBox });
      continue;
    }
    label.move = { dx: chosen.dx, dy: chosen.dy };
    label.box = chosen.box;
    placed.push(label);
    if (chosen.dx || chosen.dy) moves.push({ id: label.id, text: label.text, from: label.originalAnchor, to: { x: label.originalAnchor.x + chosen.dx, y: label.originalAnchor.y + chosen.dy }, delta: label.move });
  }

  let index = 0;
  svg = svg.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi, (whole, attrs, body) => {
    index += 1;
    const label = records[index - 1];
    if (!label) return whole;
    if (label.removeReason) return '';
    if (!label.move.dx && !label.move.dy) return whole;
    const oldX = Number.parseFloat(attr(attrs, 'x') ?? '0'), oldY = Number.parseFloat(attr(attrs, 'y') ?? '0');
    let next = attrs;
    next = writeAttr(next, 'x', Number((oldX + label.move.dx).toFixed(3)));
    next = writeAttr(next, 'y', Number((oldY + label.move.dy).toFixed(3)));
    next = writeAttr(next, 'data-layout-normalized', 'mobile-label-clearance');
    return `<text${next}>${body}</text>`;
  });
  fs.writeFileSync(file, svg, 'utf8');
  return { assetPath: item.assetPath, removed: removed.map(x => ({ id: x.id, text: x.text, reason: x.removeReason })), moves, unresolved };
}

const out = [];
for (const exam of browser.exams) {
  const questions = questionsByExam.get(exam.sourcePath);
  for (const item of exam.solutionImages) {
    const qid = Number((item.assetPath.match(/q(\d+)-solution\.svg$/) || [])[1]);
    const question = questions.find(q => Number(q.id) === qid);
    out.push(normalizeOne(item, exam, question));
  }
}
fs.writeFileSync(path.join(OUT, 'label_layout_changes.json'), JSON.stringify({ schemaVersion: 'APMATH_M3_LABEL_LAYOUT_NORMALIZATION_v1', pass: out.length, changedLabels: out.reduce((n, row) => n + row.moves.length, 0), removedRedundantLabels: out.reduce((n, row) => n + row.removed.length, 0), unresolved: out.flatMap(row => row.unresolved), items: out }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ denominator: out.length, moved: out.reduce((n, row) => n + row.moves.length, 0), removed: out.reduce((n, row) => n + row.removed.length, 0), unresolved: out.flatMap(row => row.unresolved).length }, null, 2));
