// Pure, dependency-free judge of "what changed" between two versions of the same
// archive question (old blob vs current source). It never touches the registrar:
// it only labels a change so a later rebind lane can keep the question's UID and
// metadata instead of dropping them. Deterministic; inputs are never mutated.
import crypto from 'node:crypto';

// ---------------------------------------------------------------------------
// Fingerprints. These two functions must stay character-for-character the same
// as the copies in auto-register-merged-source.mjs, reviewed-exam-registration-v2.mjs,
// register-difficulty5.mjs, register-basic-scope-rebind.mjs, build-archive2-catalog.mjs,
// the browser archive2-source.js and the Worker archive2-questions.js.
// tests/archive-source-delta.test.mjs compares them against those copies.
// ---------------------------------------------------------------------------
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
export const sourceFingerprint = q => sha256(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
export const contentFingerprint = q => sha256(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null}));
export const fingerprints = q => ({ sourceFingerprint: sourceFingerprint(q), contentFingerprint: contentFingerprint(q) });

// ---------------------------------------------------------------------------
// Classes. Evaluated by severity (most severe first), so exactly one applies.
// ---------------------------------------------------------------------------
export const CLASSES = Object.freeze([
  'UNCHANGED',       // nothing the student sees differs
  'FIGURE',          // text is the same (up to notation); only figures differ
  'NOTATION',        // text differs only by the explicit notation rules below
  'SOLUTION',        // only the solution text differs
  'STEM_EDIT',       // stem or choices text differs, answer is the same
  'ANSWER',          // the answer differs
  'REPLACED',        // a different question took this slot
  'NUMBER_MISMATCH', // question number/id differs: cannot tell if it is the same question
]);

// A stem counts as REPLACED when 3-gram recall is below this in BOTH directions.
// Value chosen from about 20 hand-read samples of Middle-3 term-1 stem rewrites; the
// full-population report (source-delta-report.mjs) is meant to calibrate it.
export const REPLACED_RECALL_THRESHOLD = 0.5;
export const GRAM_SIZE = 3;

const TEXT_KEYS = new Set(['content', 'question', 'choices', 'answer', 'solution']);
// Any other key whose name says image/svg/figure is figure data (image, images,
// figureSvg, solutionImage(s), solutionFigureSvg, imageSize, imageAlt, ...).
const FIGURE_KEY = /image|svg|figure/i;
const INLINE_FIGURE = /<img\b(?:[^>"']|"[^"]*"|'[^']*')*>|<svg\b[\s\S]*?<\/svg>/gi;

// ---------------------------------------------------------------------------
// Notation normalization. ONLY the rules below make two different strings "the
// same"; each is something that cannot change the mathematical meaning. When in
// doubt a rule is NOT here (e.g. \sqrt{2} vs 2, \frac12 vs \frac{1}{2}, ×/\times).
// ---------------------------------------------------------------------------
export const NOTATION_RULES = Object.freeze([
  // [id, why it cannot change meaning]
  ['unicode-nfc', 'Hangul/Latin composed vs decomposed code points render identically'],
  ['zero-width', 'zero-width characters are invisible'],
  ['fullwidth-ascii', 'U+FF01..FF5E and U+3000 are width variants of ASCII (not NFKC, which would also fold superscripts and circled digits)'],
  ['minus-sign', 'U+2212 is the minus sign for ASCII hyphen-minus'],
  ['nbsp-br', '&nbsp; and <br> are whitespace'],
  ['math-delimiters', '$..$, $$..$$, \\(..\\), \\[..\\] only switch math mode (escaped \\$ is kept)'],
  ['left-right', '\\left / \\right (and \\left. / \\right.) only size delimiters'],
  ['spacing-commands', '\\, \\; \\: \\! "\\ " \\quad \\qquad only add horizontal space'],
  ['style-commands', '\\displaystyle / \\textstyle only change size'],
  ['dfrac-tfrac', '\\dfrac and \\tfrac are \\frac in another size'],
  ['tex-aliases', '\\leq=\\le, \\geq=\\ge, \\neq=\\ne are TeX aliases'],
  ['single-char-script', '^{x} and _{x} equal ^x and _x for one alphanumeric character'],
  ['whitespace', 'outside math keep digit separators; preserve text spans and command-letter boundaries; other whitespace is presentation'],
]);

export function normalizeNotation(input) {
  let s = String(input ?? '').normalize('NFC');
  s = s.replace(/[​-‍⁠﻿]/g, '');
  s = s.replace(/[！-～]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace(/　/g, ' ');
  s = s.replace(/−/g, '-');
  s = s.replace(/&nbsp;/gi, ' ').replace(/<br\s*\/?>/gi, ' ');
  // Protect literal text spans before any TeX spacing/alias transformations.
  const literals = [];
  let protectedText = '';
  for (let i = 0; i < s.length;) {
    const match = s.slice(i).match(/^\\text\s*\{/);
    if (!match) { protectedText += s[i++]; continue; }
    let end = i + match[0].length, depth = 1;
    for (; end < s.length && depth; end++) {
      if (s[end] === '\\') { end++; continue; }
      if (s[end] === '{') depth++;
      if (s[end] === '}') depth--;
    }
    if (depth) { protectedText += s[i++]; continue; }
    const token = `\uE000${literals.length}\uE001`;
    literals.push(s.slice(i, end));
    protectedText += token;
    i = end;
  }
  s = protectedText;
  s = s.replace(/\\\$/g, '\u0002');
  // Outside math mode preserve numeric token boundaries. Keep the existing
  // presentation normalization elsewhere; math text spans are protected above.
  const pieces = s.split(/(\$\$[\s\S]*?\$\$|\$[^$]*?\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g);
  s = pieces.map((piece, i) => i % 2 ? piece : piece.replace(/(?<=[0-9])\s+(?=[0-9])/g, '\u0003')).join('');
  s = s.replace(/(?<!\\)\\[()[\]]/g, '').replace(/\$/g, '');
  s = s.replace(/\\(?:left|right)\s*\./g, '').replace(/\\(?:left|right)(?![A-Za-z])/g, '');
  s = s.replace(/(?<!\\)\\[,;:! ]/g, '').replace(/\\q?quad(?![A-Za-z])/g, '');
  s = s.replace(/\\(?:display|text)style(?![A-Za-z])/g, '');
  s = s.replace(/\\[dt]frac(?![A-Za-z])/g, '\\frac');
  s = s.replace(/\\leq(?![A-Za-z])/g, '\\le').replace(/\\geq(?![A-Za-z])/g, '\\ge').replace(/\\neq(?![A-Za-z])/g, '\\ne');
  s = s.replace(/([\^_])\s*\{\s*([A-Za-z0-9])\s*\}/g, '$1$2');
  s = s.replace(/(\\[A-Za-z]+)\s+(?=[A-Za-z])/g, '$1\u0001').replace(/\s+/g, '').replace(/\u0001/g, ' ');
  return s.replace(/\u0002/g, '\\$').replace(/\u0003/g, ' ').trim()
    .replace(/\uE000(\d+)\uE001/g, (_, i) => literals[Number(i)]);
}

// ---------------------------------------------------------------------------
// Field access
// ---------------------------------------------------------------------------
const isEmpty = v => v == null || v === '' || (Array.isArray(v) && v.length === 0);
const stable = v => JSON.stringify(v, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
const stemOf = q => q?.content ?? q?.question ?? null;
const answerText = v => v == null ? '' : (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' ? String(v) : stable(v));
const choicesOf = q => Array.isArray(q?.choices) ? q.choices.map(c => typeof c === 'string' ? c : stable(c)) : [];

function splitInline(value) {
  const text = typeof value === 'string' ? value : value == null ? '' : stable(value);
  const figures = [];
  const rest = text.replace(INLINE_FIGURE, m => { figures.push(m); return ' '; });
  return { text: rest, figures };
}

function sideView(q) {
  const stem = splitInline(stemOf(q));
  const choices = choicesOf(q).map(splitInline);
  const answer = splitInline(answerText(q?.answer));
  const solution = splitInline(q?.solution);
  const figureData = {};
  for (const key of Object.keys(q || {}).sort()) {
    if (TEXT_KEYS.has(key) || !FIGURE_KEY.test(key) || isEmpty(q[key])) continue;
    figureData[key] = q[key];
  }
  return {
    exact: { stem: stem.text, choices: choices.map(c => c.text), answer: answer.text, solution: solution.text },
    inline: { stem: stem.figures, choices: choices.flatMap(c => c.figures), answer: answer.figures, solution: solution.figures },
    figureData,
  };
}

const mapValues = (o, fn) => ({ stem: fn(o.stem), choices: o.choices.map(fn), answer: fn(o.answer), solution: fn(o.solution) });
const same = (a, b) => stable(a) === stable(b);

const gramText = s => s.replace(/<[^>]+>/g, ' ').replace(/[^가-힣0-9a-zA-Z+\-−=<>×÷±.]/g, '');
function grams(s) {
  const chars = Array.from(s);
  const out = new Set();
  for (let i = 0; i + GRAM_SIZE <= chars.length; i++) out.add(chars.slice(i, i + GRAM_SIZE).join(''));
  return out;
}
function recall(of, within) {
  if (!of.size) return 1; // too short to judge: never evidence of replacement
  let hit = 0;
  for (const g of of) if (within.has(g)) hit++;
  return hit / of.size;
}

const numberOf = q => q?.questionNumber ?? q?.number ?? q?.id ?? null;

/**
 * classify(oldQuestion, newQuestion) ->
 *   { class, changed:{stemText,choicesText,answer,solutionText,figure,notationOnly},
 *     stemRecall:{oldInNew,newInOld}, details }
 */
export function classify(oldQuestion, newQuestion) {
  const a = sideView(oldQuestion), b = sideView(newQuestion);
  const normA = mapValues(a.exact, normalizeNotation), normB = mapValues(b.exact, normalizeNotation);

  const stemText = normA.stem !== normB.stem;
  const choicesText = !same(normA.choices, normB.choices);
  const answer = normA.answer !== normB.answer;
  const solutionText = normA.solution !== normB.solution;
  const figure = !same(a.figureData, b.figureData) || !same(a.inline, b.inline);
  const exactDiffers = !same(a.exact, b.exact);
  const textChanged = stemText || choicesText || answer || solutionText;
  const notationOnly = !textChanged && exactDiffers;

  const ga = grams(gramText(normA.stem)), gb = grams(gramText(normB.stem));
  const stemRecall = { oldInNew: recall(ga, gb), newInOld: recall(gb, ga) };
  const replaced = stemText && stemRecall.oldInNew < REPLACED_RECALL_THRESHOLD && stemRecall.newInOld < REPLACED_RECALL_THRESHOLD;

  const keys = new Set([...Object.keys(oldQuestion || {}), ...Object.keys(newQuestion || {})]);
  const otherChangedKeys = [...keys].filter(k => !TEXT_KEYS.has(k) && !FIGURE_KEY.test(k)
    && !same(oldQuestion?.[k] ?? null, newQuestion?.[k] ?? null)).sort();

  const numOld = numberOf(oldQuestion), numNew = numberOf(newQuestion);
  const numberMismatch = numOld != null && numNew != null && String(numOld) !== String(numNew);

  let cls;
  if (numberMismatch) cls = 'NUMBER_MISMATCH';
  else if (replaced) cls = 'REPLACED';
  else if (answer) cls = 'ANSWER';
  else if (stemText || choicesText) cls = 'STEM_EDIT';
  else if (solutionText) cls = 'SOLUTION';
  else if (figure) cls = 'FIGURE';
  else if (exactDiffers) cls = 'NOTATION';
  else cls = 'UNCHANGED';

  return {
    class: cls,
    changed: { stemText, choicesText, answer, solutionText, figure, notationOnly },
    stemRecall,
    details: {
      figureKeysChanged: [...new Set([...Object.keys(a.figureData), ...Object.keys(b.figureData)])]
        .filter(k => !same(a.figureData[k] ?? null, b.figureData[k] ?? null)).sort(),
      inlineFigureChanged: !same(a.inline, b.inline),
      choicesCount: { old: a.exact.choices.length, new: b.exact.choices.length },
      gramCount: { old: ga.size, new: gb.size },
      number: { old: numOld, new: numNew },
      otherChangedKeys,
      answerFilled: answer && (isEmpty(oldQuestion?.answer) || (typeof oldQuestion?.answer === 'string' && !oldQuestion.answer.trim()))
        && !isEmpty(newQuestion?.answer) && normB.answer.trim() !== '',
    },
  };
}
