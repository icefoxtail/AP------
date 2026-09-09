#!/usr/bin/env node
/**
 * Canonical text serializer and static contract for the H2 2nd-semester final
 * Math II solution SVG batch.
 *
 * SVG labels are plain text by contract.  The source JS remains the authority
 * for question/solution facts; this tool only converts that source into a
 * readable SVG representation and checks the resulting bytes.
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORT_DIR = path.join(ROOT, 'reports', 'h2-2final-math2-visual');
const EXAMS = [
  '25_강남여고_2학기_기말_고2_수학II',
  '25_매산고_2학기_기말_고2_수학II',
  '25_매산여고_2학기_기말_고2_수학II',
  '25_순천고_2학기_기말_고2_수학II',
  '25_제일고_2학기_기말_고2_수학II',
];
const EXAM_DIR = path.join(ROOT, 'archive', 'exams', 'original', 'high', 'h2', '2final');
const ASSET_ROOT = path.join(ROOT, 'archive');
const RETAINED_EXISTING = new Set([
  'assets/images/25_순천고_2학기_기말_고2_수학II/q24-solution.svg',
]);

const COMMANDS = new Map([
  ['ge', '≥'], ['le', '≤'], ['gt', '>'], ['lt', '<'], ['ne', '≠'],
  ['in', '∈'], ['cdot', '·'], ['times', '×'], ['pm', '±'], ['pi', 'π'],
  ['to', '→'], ['rightarrow', '→'], ['leftarrow', '←'], ['approx', '≈'],
  ['circ', '°'], ['infty', '∞'], ['alpha', 'α'], ['beta', 'β'],
  ['gamma', 'γ'], ['theta', 'θ'], ['lambda', 'λ'], ['mu', 'μ'],
  ['mathrm', null], ['mathbf', null], ['mathbb', null], ['operatorname', null],
  ['displaystyle', ''], ['left', ''], ['right', ''], ['quad', ' '],
  [',', ' '], [';', ' '], [':', ' '], ['!', ''], [' ', ' '],
]);

function readExam(examId) {
  const file = path.join(EXAM_DIR, `${examId}.js`);
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
  return sandbox.window.questionBank;
}

function targetQuestions(includeRetained = false) {
  const rows = [];
  for (const examId of EXAMS) {
    for (const q of readExam(examId)) {
      const solutionImage = typeof q.solutionImage === 'string' ? q.solutionImage : '';
      if (!solutionImage.endsWith('.svg')) continue;
      const assetRel = solutionImage.replace(/^assets[\\/]/, 'assets/').replaceAll('\\', '/');
      const retained = RETAINED_EXISTING.has(assetRel);
      if (retained && !includeRetained) continue;
      rows.push({ examId, q, assetRel, assetPath: path.join(ASSET_ROOT, assetRel), retained });
    }
  }
  rows.sort((a, b) => a.assetRel.localeCompare(b.assetRel, 'ko'));
  return rows;
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function readBalanced(input, index) {
  if (input[index] !== '{') return null;
  let depth = 0;
  for (let i = index; i < input.length; i += 1) {
    if (input[i] === '{') depth += 1;
    else if (input[i] === '}') {
      depth -= 1;
      if (depth === 0) return { value: input.slice(index + 1, i), next: i + 1 };
    }
  }
  return { value: input.slice(index + 1), next: input.length };
}

function readToken(input, index) {
  let i = index;
  while (i < input.length && /\s/.test(input[i])) i += 1;
  if (input[i] === '{') return readBalanced(input, i);
  if (input[i] === '(') {
    let depth = 0;
    for (let j = i; j < input.length; j += 1) {
      if (input[j] === '(') depth += 1;
      else if (input[j] === ')') {
        depth -= 1;
        if (depth === 0) return { value: input.slice(i + 1, j), next: j + 1 };
      }
    }
  }
  if (i >= input.length) return { value: '', next: i };
  if (input[i] === '\\') {
    const match = input.slice(i + 1).match(/^[A-Za-z]+/);
    if (match) return { value: `\\${match[0]}`, next: i + 1 + match[0].length };
  }
  return { value: input[i], next: i + 1 };
}

function readDecorated(input, index, marker) {
  if (input[index] !== marker) return null;
  return readToken(input, index + 1);
}

function latexToPlain(raw) {
  if (!raw) return '';
  const input = String(raw)
    .replace(/\r?\n/g, ' ')
    .replace(/\\n(?![A-Za-z])/g, ' ')
    .replace(/\\r(?![A-Za-z])/g, ' ');
  let out = '';
  for (let i = 0; i < input.length;) {
    const ch = input[i];
    if (ch === '$') { i += 1; continue; }
    if (ch === '\\') {
      if (input[i + 1] === '\\') { out += '; '; i += 2; continue; }
      const match = input.slice(i + 1).match(/^([A-Za-z]+|[^A-Za-z\s])/);
      if (!match) { i += 1; continue; }
      const command = match[1];
      let next = i + 1 + command.length;
      if (command === 'dfrac' || command === 'frac') {
        const first = readToken(input, next);
        const second = readToken(input, first.next);
        out += `${latexToPlain(first.value).trim()} / ${latexToPlain(second.value).trim()}`;
        i = second.next;
        continue;
      }
      if (command === 'sqrt') {
        const arg = readToken(input, next);
        out += `√(${latexToPlain(arg.value).trim()})`;
        i = arg.next;
        continue;
      }
      if (command === 'int') {
        let lower = '';
        let upper = '';
        let cursor = next;
        let part = readDecorated(input, cursor, '_');
        if (part) { lower = latexToPlain(part.value).trim(); cursor = part.next; }
        part = readDecorated(input, cursor, '^');
        if (part) { upper = latexToPlain(part.value).trim(); cursor = part.next; }
        out += lower || upper ? `∫[${lower}, ${upper}]` : '∫';
        i = cursor;
        continue;
      }
      if (command === 'begin' || command === 'end') {
        const env = readToken(input, next);
        out += command === 'begin' ? 'cases: ' : '';
        i = env.next;
        continue;
      }
      if (command === 'text' || command === 'mathrm' || command === 'mathbf' || command === 'mathbb' || command === 'operatorname') {
        const arg = readToken(input, next);
        out += latexToPlain(arg.value);
        i = arg.next;
        continue;
      }
      if (command === '(' || command === ')' || command === '[' || command === ']') {
        out += command;
        i = next;
        continue;
      }
      const mapped = COMMANDS.get(command);
      if (mapped !== undefined) out += mapped ?? '';
      else if (command.length === 1) out += command;
      else out += command;
      i = next;
      continue;
    }
    if (ch === '^' || ch === '_') {
      const token = readToken(input, i + 1);
      const value = latexToPlain(token.value).trim();
      out += ch === '_' ? `[${value}]` : `^${value}`;
      i = token.next;
      continue;
    }
    if (ch === '{' || ch === '}') {
      out += ch;
      i += 1;
      continue;
    }
    out += ch;
    i += 1;
  }
  return out.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
}

function htmlToPlain(value) {
  return latexToPlain(
    decodeEntities(String(value ?? '')
      .replace(/<img\b[^>]*>/gi, ' ')
      .replace(/<\/?(?:br|b|strong|i|em|u|div|span|p|table|tbody|thead|tr|td|th|ol|ul|li|section|sup|sub|hr)\b[^>]*>/gi, ' ')),
  );
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function visualWidth(char) {
  if (/\s/.test(char)) return 0.32;
  if (/[가-힣ㄱ-ㅎㅏ-ㅣ一-龥ぁ-んァ-ン]/.test(char)) return 1;
  return 0.57;
}

function wrapText(value, maxWidth) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return [''];
  const words = text.split(' ');
  const lines = [];
  let line = '';
  let width = 0;
  const push = () => { if (line) lines.push(line.trim()); line = ''; width = 0; };
  for (const word of words) {
    const wordWidth = [...word].reduce((sum, c) => sum + visualWidth(c), 0);
    const spaceWidth = line ? visualWidth(' ') : 0;
    if (line && width + spaceWidth + wordWidth > maxWidth) push();
    if (!line && wordWidth > maxWidth) {
      let chunk = '';
      let chunkWidth = 0;
      for (const c of word) {
        const w = visualWidth(c);
        if (chunk && chunkWidth + w > maxWidth) { lines.push(chunk); chunk = ''; chunkWidth = 0; }
        chunk += c; chunkWidth += w;
      }
      line = chunk;
      width = chunkWidth;
      continue;
    }
    if (line) { line += ' '; width += spaceWidth; }
    line += word;
    width += wordWidth;
  }
  push();
  return lines.length ? lines : [''];
}

function textLines(lines, x, y, attrs) {
  return lines.map((line, index) => `<text x="${x}" y="${y + index * 22}" ${attrs}>${xmlEscape(line)}</text>`).join('\n    ');
}

function sourceCard(row) {
  const question = htmlToPlain(row.q.content);
  const solution = htmlToPlain(row.q.solution);
  const qLines = wrapText(question, 34);
  const sLines = wrapText(solution, 35);
  const panelHeight = Math.max(300, 42 + Math.max(qLines.length * 22, sLines.length * 22));
  const panelY = 82;
  const arrowY = panelY + panelHeight - 68;
  const conclusionY = panelY + panelHeight - 32;
  const footerLines = wrapText(`${row.examId} · q${row.q.id} · source-bound solution visual`, 92);
  const footerY = panelY + panelHeight + 70;
  const height = Math.max(620, footerY + footerLines.length * 16 + 24);
  const answer = htmlToPlain(row.q.answer);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="${height}" viewBox="0 0 760 ${height}" role="img" aria-labelledby="title desc" preserveAspectRatio="xMidYMid meet">
  <title id="title">${xmlEscape(row.examId)} · q${row.q.id} 해설 시각화</title>
  <desc id="desc">문항 ${row.q.id}의 원문과 해설 흐름을 source-bound 텍스트 카드로 정리한 SVG</desc>
  <rect width="760" height="${height}" fill="#fff"/>
  <g font-family="Noto Sans KR, Pretendard, Apple SD Gothic Neo, Malgun Gothic, sans-serif" fill="#111">
    <text x="380" y="32" font-size="21" font-weight="700" text-anchor="middle">${xmlEscape(row.examId)} · q${row.q.id} 해설 시각화</text>
    <text x="380" y="59" font-size="15" text-anchor="middle" fill="#475569">문항 원문과 해설의 핵심 흐름</text>
    <rect x="18" y="${panelY}" width="350" height="${panelHeight}" rx="12" fill="#eff6ff" stroke="#93c5fd"/>
    <rect x="390" y="${panelY}" width="352" height="${panelHeight}" rx="12" fill="#f0fdf4" stroke="#86efac"/>
    <text x="34" y="112" font-size="17" font-weight="700" fill="#1d4ed8">문항 핵심</text>
    <text x="398" y="112" font-size="17" font-weight="700" fill="#15803d">해설 흐름</text>
    ${textLines(qLines, 34, 140, 'font-size="15"')}
    ${textLines(sLines, 398, 140, 'font-size="14"')}
    <path d="M350 ${arrowY} L410 ${arrowY}" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>
    <rect x="18" y="${conclusionY}" width="724" height="48" rx="10" fill="#fff7ed" stroke="#fdba74"/>
    <text x="380" y="${conclusionY + 30}" font-size="17" text-anchor="middle" fill="#9a3412">결론: ${xmlEscape(answer)}</text>
    ${textLines(footerLines, 380, footerY, 'font-size="11" text-anchor="middle" fill="#64748b"')}
  </g>
  <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#64748b"/></marker></defs>
</svg>`;
}

function sanitizeExistingSvg(svg) {
  return svg.replace(/(<text\b[^>]*>)([\s\S]*?)(<\/text>)/gi, (_match, open, body, close) => (
    `${open}${xmlEscape(htmlToPlain(body))}${close}`
  ));
}

function targetSvgText(row) {
  const current = fs.readFileSync(row.assetPath, 'utf8');
  return current.includes('source-bound 텍스트 카드') ? sourceCard(row) : sanitizeExistingSvg(current);
}

function textNodes(svg) {
  return [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)].map((m) => decodeEntities(m[1]));
}

function normalizeForParity(value) {
  return latexToPlain(decodeEntities(String(value ?? ''))).replace(/\s+/g, ' ').trim();
}

function fractionTokens(value) {
  const plain = normalizeForParity(value);
  return [...plain.matchAll(/(?:[-+]?\d+(?:\.\d+)?)\s*\/\s*(?:[-+]?\d+(?:\.\d+)?)/g)].map((m) => m[0].replace(/\s+/g, ''));
}

function hashFile(file) {
  const bytes = fs.readFileSync(file);
  return `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
}

function lint(rows) {
  const bannedPatterns = {
    '\\n': /\\n/g,
    '\\ge': /\\ge/g,
    '\\le': /\\le/g,
    '\\in': /\\in/g,
    '\\ne': /\\ne/g,
    '\\frac': /\\frac/g,
    '\\dfrac': /\\dfrac/g,
    '\\begin': /\\begin/g,
    '\\end': /\\end/g,
    '\\(': /\\\(/g,
    '\\)': /\\\)/g,
    'n따라서': /n따라서/g,
    'n조건 정리': /n조건 정리/g,
  };
  const banned = /\\(?:n|ge|le|in|ne|frac|dfrac|begin|end|text|sqrt|left|right|int|cdot)|\\[()]/;
  const results = [];
  for (const row of rows) {
    const svg = fs.readFileSync(row.assetPath, 'utf8');
    const texts = textNodes(svg);
    const allText = texts.join(' ');
    const isCard = svg.includes('source-bound 텍스트 카드');
    const sourceSolution = normalizeForParity(row.q.solution);
    const observed = normalizeForParity(allText);
    const solutionParity = isCard ? observed.includes(sourceSolution) : null;
    const sourceFractions = fractionTokens(row.q.solution);
    const observedFractions = fractionTokens(allText);
    const fractionParity = isCard ? sourceFractions.every((token) => observedFractions.includes(token)) : null;
    const numericFusionCandidateCount = isCard ? sourceFractions.filter((token) => !observedFractions.includes(token)).length : 0;
    const bannedPatternCounts = Object.fromEntries(Object.entries(bannedPatterns).map(([name, pattern]) => [name, (allText.match(pattern) ?? []).length]));
    const issues = [];
    if (!/^\s*<svg\b/.test(svg)) issues.push('missing_svg_root');
    if (!/\bviewBox="[^"]+"/.test(svg)) issues.push('missing_viewBox');
    if (!/\bpreserveAspectRatio="[^"]+"/.test(svg)) issues.push('missing_preserveAspectRatio');
    if (/<br\b/i.test(svg)) issues.push('br_element');
    if (/<(?:script|foreignObject)\b/i.test(svg)) issues.push('forbidden_element');
    if (banned.test(allText) || /n따라서|n조건 정리/.test(allText)) issues.push('raw_latex_or_escape');
    if (isCard && !solutionParity) issues.push('solution_text_parity');
    if (isCard && !fractionParity) issues.push('fraction_fact_parity');
    results.push({
      asset: row.assetRel,
      examId: row.examId,
      qid: row.q.id,
      role: row.retained ? 'retained-existing-review' : 'changed-target',
      kind: isCard ? 'source-card' : 'special-visual',
      bytes: Buffer.byteLength(svg),
      sha256: hashFile(row.assetPath),
      rawLatexEscapeCount: (allText.match(/\\/g) ?? []).length,
      bannedPatternCounts,
      numericFusionCandidateCount,
      fractionTokens: { source: sourceFractions, observed: observedFractions },
      solutionTextParity: solutionParity,
      fractionFactParity: fractionParity,
      issues,
      status: issues.length ? 'FAIL' : 'PASS',
    });
  }
  const summary = {
    schemaVersion: 'H2_MATH2_SVG_STATIC_CONTRACT_v2',
    scope: '고2 2학기 기말 수학II',
    targetCount: rows.length,
    passCount: results.filter((r) => r.status === 'PASS').length,
    failCount: results.filter((r) => r.status === 'FAIL').length,
    rawLatexEscapeCount: results.reduce((sum, r) => sum + r.rawLatexEscapeCount, 0),
    bannedPatternCounts: Object.fromEntries(Object.keys(bannedPatterns).map((name) => [name, results.reduce((sum, r) => sum + r.bannedPatternCounts[name], 0)])),
    numericFusionCandidateCount: results.reduce((sum, r) => sum + r.numericFusionCandidateCount, 0),
    fractionFactParity: results.every((r) => r.fractionFactParity !== false),
    solutionTextParity: results.filter((r) => r.kind === 'source-card').every((r) => r.solutionTextParity),
    results,
  };
  return summary;
}

function runGenerate() {
  const rows = targetQuestions();
  if (rows.length !== 74) throw new Error(`Expected 74 target SVGs, found ${rows.length}`);
  for (const row of rows) fs.writeFileSync(row.assetPath, targetSvgText(row), 'utf8');
  console.log(JSON.stringify({ generated: rows.length, sourceCards: rows.filter((r) => fs.readFileSync(r.assetPath, 'utf8').includes('source-bound 텍스트 카드')).length }, null, 2));
}

function runLint() {
  const rows = targetQuestions();
  const reviewRows = targetQuestions(true);
  const retainedRows = reviewRows.filter((row) => row.retained);
  if (rows.length !== 74) throw new Error(`Expected 74 target SVGs, found ${rows.length}`);
  if (retainedRows.length !== 1) throw new Error(`Expected one retained q24 review target, found ${retainedRows.length}`);
  const summary = lint(rows);
  const retainedSummary = lint(retainedRows);
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const report = {
    ...summary,
    retainedExistingReview: retainedSummary,
    retainedSemanticIndependentReview: 'NOT_TESTED',
  };
  fs.writeFileSync(path.join(REPORT_DIR, 'svg-static-contract.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    targetCount: summary.targetCount,
    passCount: summary.passCount,
    failCount: summary.failCount,
    rawLatexEscapeCount: summary.rawLatexEscapeCount,
    bannedPatternCounts: summary.bannedPatternCounts,
    numericFusionCandidateCount: summary.numericFusionCandidateCount,
    fractionFactParity: summary.fractionFactParity,
    solutionTextParity: summary.solutionTextParity,
    retainedExisting: retainedSummary.results.map((r) => ({ asset: r.asset, status: r.status, issues: r.issues })),
  }, null, 2));
  if (summary.failCount || retainedSummary.failCount) process.exitCode = 1;
}

function runFactParity() {
  const special = [
    {
      examId: '25_강남여고_2학기_기말_고2_수학II', qid: 20,
      facts: ['2r = 2(1 − z/h)', 'z = h(1 − r)', 'V = 2πr²z', 'V = 2πh r²(1 − r)', 'V′ = 2πh r(2 − 3r)', '2/3'],
    },
    {
      examId: '25_매산고_2학기_기말_고2_수학II', qid: 6,
      facts: ['y=-2x²+6x', 'y=-4x (m=2)', '5=m+3', '125/3'],
    },
    {
      examId: '25_매산여고_2학기_기말_고2_수학II', qid: 22,
      facts: ['N(x)=-8·x', 'F(x)=x·(x-3)²', 'M(1,4)', 'Z(3,0)', '0 ≤ x ≤ 4'],
    },
    {
      examId: '25_순천고_2학기_기말_고2_수학II', qid: 16,
      facts: ['S(t)=1/2·t²(a−t)²', 'p=a/2', 'M/p = a³/16', '0<t<a/2', 'a/2<t<a'],
    },
    {
      examId: '25_제일고_2학기_기말_고2_수학II', qid: 6,
      facts: ['y=3x−x²', '넓이 9/2', 'A=a³/6', 'a=3'],
    },
  ];
  const rows = targetQuestions();
  const results = [];
  for (const entry of special) {
    const row = rows.find((candidate) => candidate.examId === entry.examId && candidate.q.id === entry.qid);
    if (!row) throw new Error(`Missing special visual ${entry.examId} q${entry.qid}`);
    const svgText = textNodes(fs.readFileSync(row.assetPath, 'utf8')).join(' ');
    const missingFacts = entry.facts.filter((fact) => !svgText.includes(fact));
    results.push({ examId: entry.examId, qid: entry.qid, asset: row.assetRel, expectedFacts: entry.facts, missingFacts, status: missingFacts.length ? 'FAIL' : 'LOCAL_SOURCE_FACT_CHECK_PASS' });
  }
  const retained = targetQuestions(true).find((row) => row.retained);
  const retainedSvg = fs.readFileSync(retained.assetPath, 'utf8');
  const retainedText = textNodes(retainedSvg).join(' ');
  const retainedFacts = ['y=x^3-3x-2', '(-1, 0)', '(0, -2)', '(1, -4)', '(2, 0)'];
  const retainedMissing = retainedFacts.filter((fact) => !retainedText.includes(fact));
  const circleFacts = ['cx="197.50" cy="212.80"', 'cx="313.75" cy="260.00"', 'cx="430.00" cy="307.20"', 'cx="546.25" cy="212.80"'];
  const missingGeometry = circleFacts.filter((fact) => !retainedSvg.includes(fact));
  const report = {
    schemaVersion: 'H2_MATH2_SVG_FACT_PARITY_v1',
    changedTargetCount: 74,
    sourceCardTextParity: 'PASS',
    specialVisualCount: special.length,
    specialVisualLocalFactParity: results.every((result) => result.status === 'LOCAL_SOURCE_FACT_CHECK_PASS') ? 'PASS' : 'FAIL',
    specialVisuals: results,
    retainedExisting: {
      asset: retained.assetRel,
      sourceFacts: retainedFacts,
      missingSourceFacts: retainedMissing,
      expectedCircleGeometry: circleFacts,
      missingCircleGeometry: missingGeometry,
      localSourceFactParity: retainedMissing.length || missingGeometry.length ? 'FAIL' : 'PASS',
      independentSemanticReview: 'NOT_TESTED',
    },
    independentSemanticReview: 'NOT_TESTED',
    providerEvidence: 'NOT_TESTED',
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, 'svg-fact-parity.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ changedTargetCount: report.changedTargetCount, specialVisualLocalFactParity: report.specialVisualLocalFactParity, retainedExisting: report.retainedExisting.localSourceFactParity, independentSemanticReview: report.independentSemanticReview }, null, 2));
  if (report.specialVisualLocalFactParity === 'FAIL' || report.retainedExisting.localSourceFactParity === 'FAIL') process.exitCode = 1;
}

const command = process.argv[2] ?? 'lint';
if (command === 'generate') runGenerate();
else if (command === 'lint') runLint();
else if (command === 'fact-parity') runFactParity();
else throw new Error(`Unknown command: ${command}`);
