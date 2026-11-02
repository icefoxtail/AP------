import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Resolve from this module, independent of cwd, OS and user's home directory.
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function gitBlobSha1(contentBytes) {
  const header = Buffer.from(`blob ${contentBytes.length}\0`);
  return crypto.createHash('sha1').update(header).update(contentBytes).digest('hex');
}

function sha256(contentBytes) {
  return crypto.createHash('sha256').update(contentBytes).digest('hex');
}

/**
 * Rigorous semantic & mathematical SVG verification.
 * Verifies that the SVG is NOT a mock/placeholder, has substantive geometric/diagram primitives,
 * does not contain NaN/undefined/corrupt coordinate attributes, and maintains strict mathematical
 * semantic alignment with the question text (vertex labels, shaded regions, coordinate axes, blanks).
 */
function verifyMathematicalSvg(svgPath, svgContent, q, ord, errors, ctx = {}) {
  const warnings = ctx.warnings || [];
  const plan = ctx.plan || null;
  // 1. Root & ViewBox
  const svgMatch = svgContent.match(/<svg[^>]*>/i);
  if (!svgMatch || !svgContent.includes('</svg>')) {
    errors.push(`Q${ord}: SVG file is missing valid <svg> root or </svg> closing tag (${q.image})`);
    return;
  }
  const rootTag = svgMatch[0];
  const viewBoxMatch = rootTag.match(/viewBox=["']\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*["']/i);
  if (!viewBoxMatch) {
    errors.push(`Q${ord}: SVG root is missing a valid viewBox (${q.image})`);
  }
  if (viewBoxMatch) {
    const vbW = parseFloat(viewBoxMatch[3]);
    const vbH = parseFloat(viewBoxMatch[4]);
    if (isNaN(vbW) || isNaN(vbH) || vbW <= 0 || vbH <= 0) {
      errors.push(`Q${ord}: SVG viewBox dimensions must be strictly positive numbers (got width=${vbW}, height=${vbH}) in ${q.image}`);
    }
  }

  // Accessibility tags and role per AUTHOR_GUIDE.md and visual contract.
  // The stat-chart / set-diagram engines (data-stat-chart / data-set-diagram) emit no <title>/<desc>:
  // their text alternative is the plan caption, so for those SVGs the caption is required instead.
  const isTextlessEngineSvg = /\bdata-(?:stat-chart|set-diagram)=["']/i.test(rootTag);
  if (isTextlessEngineSvg) {
    const cap = plan?.caption;
    if (typeof cap !== 'string' || cap.trim().length < 10 || !/[가-힣]/.test(cap)) {
      errors.push(`Q${ord}: engine stat-chart/set-diagram SVG has no <title>/<desc> and its plan has no substantive Korean caption to serve as the text alternative (${q.image})`);
    }
  } else {
    if (!/<title\b[^>]*>[\s\S]+?<\/title>/i.test(svgContent)) {
      errors.push(`Q${ord}: SVG is missing required educational <title> tag (${q.image})`);
    }
    if (!/<desc\b[^>]*>[\s\S]+?<\/desc>/i.test(svgContent)) {
      errors.push(`Q${ord}: SVG is missing required educational <desc> tag (${q.image})`);
    }
  }
  if (!/\brole=["']img["']/i.test(rootTag)) {
    errors.push(`Q${ord}: SVG root is missing required role="img" accessibility attribute (${q.image})`);
  }

  // Raw unrendered TeX in <text> elements is prohibited in SVG
  if ([...svgContent.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)]
    .some((match) => /\\(?:frac|sqrt|text|sum|times|cdot|left|right|overline|angle|pi|alpha|beta|gamma)\b/.test(match[1]))) {
    errors.push(`Q${ord}: SVG contains raw unrendered LaTeX commands in <text> elements (${q.image})`);
  }

  // Font size floor: font-size < 11px violates visual contract floor
  if ([...svgContent.matchAll(/\bfont-size\s*(?:=\s*["']|:\s*)(\d+(?:\.\d+)?)(px)?/gi)]
    .some((match) => Number(match[1]) < 11)) {
    errors.push(`Q${ord}: SVG violates 11px font size floor (font-size < 11px) in ${q.image}`);
  }

  // 2. Corrupt coordinates & degenerate geometry
  if (/(?:x|y|cx|cy|r|rx|ry|x1|y1|x2|y2|width|height|points|d)=["'][^"']*(?:NaN|undefined|null)/i.test(svgContent)) {
    errors.push(`Q${ord}: SVG contains corrupt coordinate attributes (NaN, undefined, or null) in ${q.image}`);
  }
  if (/<circle\b[^>]*\br=["']0(?:px)?["']/i.test(svgContent)) {
    errors.push(`Q${ord}: SVG contains degenerate circle with radius 0 in ${q.image}`);
  }
  if (/<path\b[^>]*\bd=["']\s*["']/i.test(svgContent)) {
    errors.push(`Q${ord}: SVG contains empty path d attribute in ${q.image}`);
  }
  const mockTokens = svgContent.match(/\b(TODO|FIXME|PLACEHOLDER|MOCK|임시|스켈레톤|AI-generated)\b/i);
  if (mockTokens) {
    errors.push(`Q${ord}: SVG contains prohibited mock/placeholder token '${mockTokens[0]}' in ${q.image}`);
  }

  // 3. Substantive visual elements count (anti-blank / anti-stub)
  const lineCount = (svgContent.match(/<line\b/gi) || []).length;
  const circleCount = (svgContent.match(/<circle\b/gi) || []).length;
  const ellipseCount = (svgContent.match(/<ellipse\b/gi) || []).length;
  const polygonCount = (svgContent.match(/<polygon\b/gi) || []).length;
  const polylineCount = (svgContent.match(/<polyline\b/gi) || []).length;
  const pathCount = (svgContent.match(/<path\b/gi) || []).length;

  const allRects = svgContent.match(/<rect\b[^>]*>/gi) || [];
  let nonBgRectCount = 0;
  for (const r of allRects) {
    const hasStroke = /\bstroke=["'](?!none)[^"']+["']/i.test(r);
    const hasRx = /\brx=["'][^"']+["']/i.test(r);
    const hasNonZeroOrigin = /\b(?:x|y)=["'](?!0(?:px)?["'])[^"']+["']/i.test(r);
    const isCanvasBg = !hasStroke && !hasRx && !hasNonZeroOrigin && /fill=["'](?:#fff(?:fff)?|white)["']/i.test(r);
    if (!isCanvasBg) nonBgRectCount++;
  }
  const geomPrimitiveCount = lineCount + circleCount + ellipseCount + polygonCount + polylineCount + pathCount + nonBgRectCount;

  const textMatches = [];
  const textRegex = /<text\b[^>]*>([\s\S]*?)<\/text>/gi;
  let tm;
  while ((tm = textRegex.exec(svgContent)) !== null) {
    const cleanText = tm[1].replace(/<[^>]+>/g, '').trim();
    if (cleanText) textMatches.push(cleanText);
  }
  const fullSvgText = textMatches.join(' ');

  // Engine SVGs (fragment-publication) draw labels as glyph outlines, so <text> is empty. Decodable label
  // evidence is: <text>, data-text on label groups, and (for non-geometry engine plans) the
  // symbols the plan itself declares (point ids, curve ids, set/column names). Glyph outlines are never
  // guessed: a symbol with no such evidence is reported, not silently accepted.
  const dataTexts = [...svgContent.matchAll(/\bdata-text=["']([^"']+)["']/gi)].map((m) => m[1]);
  const planGraphFamily = planIsNonGeometryEngine(plan);
  const planSymbols = planGraphFamily ? collectPlanSymbols(plan) : new Set();
  const labelEvidence = [fullSvgText, ...dataTexts, ...planSymbols].join(' ');
  const hasGlyphLabels = /\bdata-label-kind=["']/i.test(svgContent);

  if (geomPrimitiveCount < 2 && !(geomPrimitiveCount >= 1 && textMatches.length >= 3)) {
    errors.push(`Q${ord}: SVG lacks substantive mathematical diagram content (geometric primitives=${geomPrimitiveCount}, text=${textMatches.length}) in ${q.image}`);
  }

  // 4. Semantic / Mathematical Alignment with Question Stem (q.content)
  const stem = q.content || '';

  // 4a. Shaded Area Invariant: If question mentions shaded regions, SVG must contain a non-white shaded shape!
  if (/색칠한|어두운\s*부분|음영|빗금/i.test(stem)) {
    const shapesWithFill = svgContent.match(/<(?:rect|circle|ellipse|path|polygon)\b[^>]*\bfill=["']([^"']+)["'][^>]*>/gi) || [];
    let hasShadedShape = false;
    for (const shape of shapesWithFill) {
      const fillVal = (shape.match(/\bfill=["']([^"']+)["']/i) || [])[1]?.trim()?.toLowerCase();
      if (fillVal && fillVal !== 'none' && fillVal !== 'transparent' && fillVal !== '#ffffff' && fillVal !== '#fff' && fillVal !== 'white') {
        hasShadedShape = true;
        break;
      }
    }
    if (!hasShadedShape && /style=["'][^"']*fill:\s*(?!none|transparent|#fff|white)[^;"']+/i.test(svgContent)) {
      hasShadedShape = true;
    }
    if (!hasShadedShape) {
      errors.push(`Q${ord}: Question stem asks about shaded region ('색칠한 부분'), but SVG contains no shaded shape with non-white fill in ${q.image}`);
    }
  }

  // 4b. Coordinate Graph
  if (/(?:좌표평면|x축|y축|사분면|그래프\s*위의\s*점)/i.test(stem)) {
    const hasX = /(?:^|[^a-zA-Z0-9])x(?:[^a-zA-Z0-9]|$)/i.test(fullSvgText) || /\bdata-owner=["']axis-x["']/i.test(svgContent);
    const hasY = /(?:^|[^a-zA-Z0-9])y(?:[^a-zA-Z0-9]|$)/i.test(fullSvgText) || /\bdata-owner=["']axis-y["']/i.test(svgContent);
    const hasOrigin = /(?:^|[^a-zA-Z0-9])O(?:[^a-zA-Z0-9]|$)/.test(fullSvgText) || planSymbols.has('O');
    const axisLines = (svgContent.match(/<line\b|<path\b/gi) || []).length;
    if (axisLines < 2 || (!hasX && !hasY && !hasOrigin)) {
      errors.push(`Q${ord}: Coordinate graph question requires axis lines and x/y/O labels in SVG (${q.image})`);
    }
  }

  // 4c. Blank Symbols Alignment: ㉠, ㉡, ㉢, ㉣, ㉤, ㉥
  for (const bs of ['㉠', '㉡', '㉢', '㉣', '㉤', '㉥']) {
    if (stem.includes(bs) && !svgContent.includes(bs)) {
      errors.push(`Q${ord}: Blank symbol '${bs}' mentioned in question stem is missing from SVG in ${q.image}`);
    }
  }

  // 4d. Point / Vertex / Diagram Symbol Alignment
  const referencedPoints = new Set();
  const pointMatches = stem.matchAll(/점\s*([A-Z])|원점\s*([O0])|선분\s*([A-Z]{2})|삼각형\s*([A-Z]{3})/g);
  for (const pm of pointMatches) {
    if (pm[1]) referencedPoints.add(pm[1]);
    if (pm[2]) referencedPoints.add(pm[2]);
    if (pm[3]) for (const c of pm[3]) referencedPoints.add(c);
    if (pm[4]) for (const c of pm[4]) referencedPoints.add(c);
  }
  // Single capital letters inside LaTeX math (e.g. $A+B$, $P$)
  const mathCapitals = new Set();
  const mathMatches = stem.matchAll(/\$([^$]+)\$/g);
  for (const mm of mathMatches) {
    const cleanMath = mm[1].replace(/\\[a-zA-Z]+/g, '');
    const capitalLetters = cleanMath.match(/\b[A-Z]\b/g) || [];
    for (const cl of capitalLetters) {
      if (!referencedPoints.has(cl)) mathCapitals.add(cl);
    }
  }
  const symbolPresent = (pt, haystack) => new RegExp(`(^|[^a-zA-Z0-9])${pt}([^a-zA-Z0-9]|$)`).test(haystack);
  for (const pt of referencedPoints) {
    // Explicit point/segment/triangle references must be a decodable label of the figure.
    if (!symbolPresent(pt, labelEvidence)) {
      errors.push(`Q${ord}: Point/symbol '${pt}' referenced in question stem is missing from SVG text labels in ${q.image}`);
    }
  }
  const unlabeledMathSymbols = [];
  for (const pt of mathCapitals) {
    if (symbolPresent(pt, labelEvidence)) continue;
    if (planGraphFamily) {
      // In a function-graph / statistics / set / number-line figure a bare capital in math is usually a
      // function name, random variable, event, set or a moving point that is not drawn. Not enforced as a
      // drawn label, but reported so the limitation is visible.
      unlabeledMathSymbols.push(pt);
    } else {
      errors.push(`Q${ord}: Point/symbol '${pt}' referenced in question stem is missing from SVG text labels in ${q.image}`);
    }
  }
  if (unlabeledMathSymbols.length) {
    warnings.push(`VISUAL_SYMBOL_NOT_DECODABLE: Q${ord}: stem math symbol(s) ${unlabeledMathSymbols.join(',')} not found in SVG text/data-text or plan label symbols` +
      `${hasGlyphLabels ? ' (SVG labels are glyph outlines and cannot be decoded)' : ''}; treated as variable/function/event names of a ${plan.capability} figure, not as drawn labels (${q.image})`);
  }
}

const GRAPH_ENGINE_INPUT_KEYS = ['graphPlan', 'numberLine', 'panels', 'inequalityChain', 'quadraticInequality', 'chart', 'diagram'];

// True when the plan is an engine plan for a function graph / statistics / set / number-line figure
// (not a construction/geometry figure), whose label symbols are declared in the plan itself.
function planIsNonGeometryEngine(plan) {
  if (!plan || typeof plan !== 'object' || plan.status) return false;
  if (plan.capability === 'construction-spike-v1') return false;
  return GRAPH_ENGINE_INPUT_KEYS.some((k) => plan[k] && typeof plan[k] === 'object');
}

// Short symbol tokens (point ids, curve ids, set/column names...) a plan declares, as values or object keys.
function collectPlanSymbols(plan) {
  const out = new Set();
  const isSymbol = (s) => typeof s === 'string' && /^[A-Z][0-9]?$/.test(s);
  const walk = (node) => {
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (isSymbol(k)) out.add(k);
        walk(v);
      }
      return;
    }
    if (isSymbol(node)) out.add(node);
  };
  walk(plan);
  return out;
}

function readJsonSafe(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

// ---------------------------------------------------------------------------
// Review receipt (shared by middle and high school exams)
// ---------------------------------------------------------------------------

// PASS family: SIGNED_OFF_PASS, SIGNED_OFF_PASS_WITH_NOTES, PASS_WITH_VISUAL_DEBT, PASS_WITH_OPEN_DEFECTS, ...
const PASS_STATUS_RE = /^(?:SIGNED_OFF_)?PASS(?:_WITH_[A-Z0-9]+(?:_[A-Z0-9]+)*)?$/;
const FAIL_TOKEN_RE = /(?:^|_)(?:FAIL|FAILED|BLOCK|BLOCKED|REJECT|REJECTED|HOLD|UNSIGNED)(?:_|$)/;

function receiptSignOffIsPass(receipt) {
  if (!receipt || typeof receipt !== 'object') return false;
  const st = receipt.signOffStatus;
  if (typeof st !== 'string' || !PASS_STATUS_RE.test(st) || FAIL_TOKEN_RE.test(st)) return false;
  // The actual verdict, when the receipt states one, must itself be PASS-family.
  if (receipt.overallVerdict !== undefined && !/^PASS(?:_|$)/.test(String(receipt.overallVerdict))) return false;
  return true;
}

const CIRCLED = ['①', '②', '③', '④', '⑤'];
const normAnswer = (v) => String(v ?? '').replace(/\$/g, '').replace(/\s+/g, '');

// Receipts name the per-question evidence differently: `questionReviews` {blindAnswer, blindMatch, blindDerivation}
// (middle) or `questionsReview` {derivedAnswer|blindFrozenAnswer, candidateAnswer, match, method|note} (high);
// some only carry `blindFirstPass.frozenAnswers`. All are normalized to the same checks.
function verifyReceipt(receipt, { bank, blobSha1, totalQuestions, errors, warnings }) {
  if (receipt.candidateGitBlobSha1 !== blobSha1) {
    errors.push(`Receipt candidateGitBlobSha1 mismatch (receipt has ${receipt.candidateGitBlobSha1}, JS blob is ${blobSha1})`);
  }

  if (!receiptSignOffIsPass(receipt)) {
    errors.push(`Receipt signOffStatus is not a PASS-family status (signOffStatus=${receipt.signOffStatus}, overallVerdict=${receipt.overallVerdict})`);
  } else if (/_WITH_/.test(receipt.signOffStatus)) {
    warnings.push(`RECEIPT_QUALIFIED_PASS: signOffStatus ${receipt.signOffStatus} is a PASS with a declared qualifier, not an unconditional sign-off`);
  }
  // `defects` often lists already repaired findings (status VERIFIED_REPAIRED). Only still-open ones matter.
  const openDefects = (Array.isArray(receipt.defects) ? receipt.defects : [])
    .filter((d) => d && typeof d === 'object' && /OPEN|UNRESOLVED|PENDING/i.test(String(d.status ?? '')));
  if (openDefects.length) {
    if (/OPEN_DEFECTS/.test(String(receipt.signOffStatus))) {
      warnings.push(`RECEIPT_OPEN_DEFECTS: receipt declares ${openDefects.length} open defect(s)`);
    } else {
      errors.push(`Receipt lists ${openDefects.length} open defect(s) but signOffStatus (${receipt.signOffStatus}) does not declare OPEN_DEFECTS`);
    }
  } else if (/OPEN_DEFECTS/.test(String(receipt.signOffStatus))) {
    warnings.push('RECEIPT_OPEN_DEFECTS: signOffStatus declares open defects but the receipt lists none in a machine-readable form');
  }

  const shape = Array.isArray(receipt.questionReviews) ? 'questionReviews'
    : Array.isArray(receipt.questionsReview) ? 'questionsReview' : null;
  const bfpRaw = receipt.blindFirstPass ?? receipt.blindSolve;
  const bfp = bfpRaw && typeof bfpRaw === 'object' ? bfpRaw : null;

  // blindFirstPass summary numbers, when stated, must be consistent with the exam.
  if (bfp && Number.isFinite(bfp.totalSolved)) {
    if (bfp.totalSolved !== totalQuestions) errors.push(`Receipt blindFirstPass.totalSolved (${bfp.totalSolved}) != question count (${totalQuestions})`);
    if (Number.isFinite(bfp.answerMismatches) && bfp.answerMismatches !== 0) errors.push(`Receipt blindFirstPass reports ${bfp.answerMismatches} answer mismatch(es)`);
    if (Number.isFinite(bfp.answerMatches) && bfp.answerMatches !== totalQuestions) errors.push(`Receipt blindFirstPass.answerMatches (${bfp.answerMatches}) != question count (${totalQuestions})`);
  }

  let frozen = bfp?.frozenAnswers;
  if (typeof frozen === 'string') { try { frozen = JSON.parse(frozen); } catch { frozen = null; } }
  const frozenMap = frozen && typeof frozen === 'object' && !Array.isArray(frozen) ? frozen : null;

  if (shape) {
    const rows = receipt[shape];
    if (rows.length !== totalQuestions) {
      errors.push(`Receipt ${shape} count mismatch (${rows.length} vs ${totalQuestions})`);
      return;
    }
    const seenQids = new Set();
    const seenDerivations = new Set();
    let copyPasteCount = 0;
    let rowsWithoutDerivation = 0;
    for (const qr of rows) {
      const qid = qr.qid;
      const idx = Number(qid) - 1;
      if (!Number.isInteger(idx) || idx < 0 || idx >= totalQuestions || seenQids.has(Number(qid))) {
        errors.push(`Receipt ${shape} has invalid or duplicate qid (${qid})`);
        continue;
      }
      seenQids.add(Number(qid));
      const q = bank[idx];
      const matched = qr.blindMatch ?? qr.match;
      if (matched !== true) {
        errors.push(`Q${qid}: review receipt ${qr.blindMatch !== undefined || shape === 'questionReviews' ? 'blindMatch' : 'match'} is false`);
      }
      const derived = qr.blindAnswer ?? qr.derivedAnswer ?? qr.blindFrozenAnswer;
      const derivation = qr.blindDerivation ?? qr.method;
      if (shape === 'questionReviews') {
        if (!qr.blindDerivation || typeof qr.blindDerivation !== 'string' || qr.blindDerivation.trim().length < 8) {
          errors.push(`Q${qid}: missing or too brief blindDerivation evidence in receipt`);
        } else {
          if (seenDerivations.has(qr.blindDerivation)) copyPasteCount++;
          seenDerivations.add(qr.blindDerivation);
        }
      } else if (typeof derivation === 'string' && derivation.trim().length >= 8) {
        if (seenDerivations.has(derivation)) copyPasteCount++;
        seenDerivations.add(derivation);
      } else if (derived === undefined || derived === null || String(derived).trim() === '') {
        errors.push(`Q${qid}: receipt has neither a derived/frozen answer nor a derivation for this question`);
      } else {
        rowsWithoutDerivation++;
      }
      // The recorded answers must be the exam's actual answers (tampering with answers or receipt is caught here).
      if (q) {
        // Only multiple-choice answers are compared exactly; descriptive answers are free text with differing notation.
        if (q.questionType === '객관식' && qr.candidateAnswer !== undefined && normAnswer(qr.candidateAnswer) !== normAnswer(q.answer)) {
          errors.push(`Q${qid}: receipt candidateAnswer (${qr.candidateAnswer}) differs from the exam answer (${q.answer})`);
        }
        if (q.questionType === '객관식' && derived !== undefined && derived !== null) {
          const lead = String(derived).trim().charAt(0);
          if (CIRCLED.includes(lead) && lead !== q.answer) {
            errors.push(`Q${qid}: receipt independently derived ${lead} but the exam answer is ${q.answer}`);
          }
        }
      }
    }
    if (copyPasteCount > 3) {
      errors.push(`Receipt fraud detected: ${copyPasteCount} duplicate copy-pasted blindDerivation strings found`);
    }
    if (rowsWithoutDerivation) {
      warnings.push(`EVIDENCE_DEBT: receipt ${shape} has ${rowsWithoutDerivation} row(s) with a derived answer but no derivation text`);
    }
    return;
  }

  if (frozenMap) {
    const keys = Object.keys(frozenMap);
    if (keys.length !== totalQuestions) {
      errors.push(`Receipt blindFirstPass.frozenAnswers count mismatch (${keys.length} vs ${totalQuestions})`);
      return;
    }
    for (const k of keys) {
      const idx = Number(k) - 1;
      if (!Number.isInteger(idx) || idx < 0 || idx >= totalQuestions) {
        errors.push(`Receipt blindFirstPass.frozenAnswers has invalid qid (${k})`);
        continue;
      }
      const q = bank[idx];
      const lead = String(frozenMap[k]).trim().charAt(0);
      if (q?.questionType === '객관식' && CIRCLED.includes(lead) && lead !== q.answer) {
        errors.push(`Q${k}: receipt frozen answer ${lead} but the exam answer is ${q.answer}`);
      }
    }
    if (!bfp || !Number.isFinite(bfp.answerMatches) || !Number.isFinite(bfp.answerMismatches)) {
      errors.push('Receipt has frozenAnswers but no answerMatches/answerMismatches summary for the comparison');
    }
    return;
  }

  errors.push('Receipt has no per-question review evidence (questionReviews, questionsReview or blindFirstPass/blindSolve.frozenAnswers)');
}

// ---------------------------------------------------------------------------
// High school taxonomy: packs are chosen by the item's course/curriculum, not by a middle-school default.
// ---------------------------------------------------------------------------

const PACKS_DIR = path.join(REPO_ROOT, 'archive/data/meta-foundation/canonical/packs');
const normCourse = (s) => String(s ?? '').replace(/\s+/g, '');
let packCache = null;

function loadCanonicalPacks() {
  if (packCache) return packCache;
  packCache = [];
  for (const d of fs.readdirSync(PACKS_DIR).sort()) {
    const packJson = readJsonSafe(path.join(PACKS_DIR, d, 'pack.json'));
    const tax = readJsonSafe(path.join(PACKS_DIR, d, 'taxonomy.json'));
    if (!packJson || !tax) continue;
    packCache.push({
      name: d,
      courses: new Set((packJson.standardCourses || []).map(normCourse)),
      curricula: new Set((packJson.curricula || []).map(String)),
      pts: new Set((tax.problemTypes || []).map((p) => p.problemTypeKey)),
      tpls: new Map((tax.templates || []).map((t) => [t.templateKey, t]))
    });
  }
  return packCache;
}

// Fallback only when the meta item has no course: derive it from the exam stem (longest names first).
const STEM_COURSES = ['공통수학1', '공통수학2', '확률과통계', '미적분II', '미적분I', '수학II', '수학I', '기하', '대수'];

function verifyHighTaxonomy(items, stem, errors, warnings) {
  const packs = loadCanonicalPacks();
  const crossPack = new Map(); // key -> owner pack names
  let unboundPt = 0;
  let unboundTpl = 0;
  for (const it of items) {
    const ord = it.sourceOrdinal;
    const after = it.after || {};
    const pt = after.problemTypeKey;
    const tpl = after.templateKey;
    let course = normCourse(after.courseKey || after.standardCourse);
    if (!course) course = STEM_COURSES.find((c) => stem.includes(c)) || '';
    const curriculum = String(after.curriculumKey || after.curriculum || '');
    const coursePacks = packs.filter((p) => p.courses.has(course) && (!curriculum || p.curricula.has(curriculum)));
    if (!coursePacks.length) {
      errors.push(`Q${ord}: no canonical taxonomy pack declares course '${after.courseKey || after.standardCourse || '(none)'}' for curriculum '${curriculum || '(none)'}'`);
      continue;
    }
    const where = coursePacks.map((p) => p.name).join('+');
    const findPt = (list) => list.find((p) => p.pts.has(pt));
    const findTpl = (list) => list.find((p) => p.tpls.has(tpl));

    let ptOwner = null;
    if (pt) {
      ptOwner = findPt(coursePacks);
      if (!ptOwner) {
        ptOwner = findPt(packs);
        if (!ptOwner) errors.push(`Q${ord}: unregistered problemTypeKey (${pt}) in canonical taxonomy (course packs: ${where})`);
        else crossPack.set(pt, ptOwner.name);
      }
    } else {
      unboundPt++;
    }
    if (tpl) {
      let tplOwner = findTpl(coursePacks);
      if (!tplOwner) {
        tplOwner = findTpl(packs);
        if (!tplOwner) errors.push(`Q${ord}: unregistered templateKey (${tpl}) in canonical taxonomy (course packs: ${where})`);
        else crossPack.set(tpl, tplOwner.name);
      }
      if (tplOwner) {
        const tObj = tplOwner.tpls.get(tpl);
        if (tObj.parentProblemTypeKey !== pt && tObj.problemTypeKey !== pt) {
          errors.push(`Q${ord}: templateKey ${tpl} does not belong to parent ${pt}`);
        }
      }
    } else {
      unboundTpl++;
    }
  }
  if (crossPack.size) {
    warnings.push(`TAXONOMY_CROSS_PACK_REFERENCE: ${crossPack.size} key(s) are registered in another canonical pack than the course packs: ` +
      [...crossPack].map(([k, v]) => `${k}@${v}`).join(', '));
  }
  if (unboundPt || unboundTpl) {
    warnings.push(`TAXONOMY_UNBOUND: ${unboundPt} item(s) without problemTypeKey and ${unboundTpl} without templateKey (not verified against the taxonomy)`);
  }
}

export function verifySimilarExam({ stem, jsPath, throwOnError = false, strictAuthoring = false, phase = 'release' }) {
  if (!['draft', 'release'].includes(phase)) throw new Error('phase must be draft or release');
  const errors = [];
  const warnings = [];

  // 1. Locate files
  let actualStem = stem;
  let canonicalExamDir = null;

  if (actualStem) {
    const candidateDirs = [];
    for (const g of ['m1', 'm2', 'm3']) {
      for (const t of ['1mid', '1final', '2mid', '2final']) {
        candidateDirs.push(path.join(REPO_ROOT, `archive/exams/similar/middle/${g}/${t}`));
      }
    }
    // High school similar exams: archive/exams/similar/high/{h1,h2,h3}/<term dir>
    for (const g of ['h1', 'h2', 'h3']) {
      const groupDir = path.join(REPO_ROOT, `archive/exams/similar/high/${g}`);
      if (!fs.existsSync(groupDir)) continue;
      for (const e of fs.readdirSync(groupDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        if (e.isDirectory()) candidateDirs.push(path.join(groupDir, e.name));
      }
    }
    for (const d of candidateDirs) {
      if (fs.existsSync(path.join(d, `${actualStem}.js`))) {
        canonicalExamDir = d;
        break;
      }
    }
  }

  let resolvedJs = jsPath;
  if (!resolvedJs) {
    if (!canonicalExamDir) {
      const err = `Candidate JS file not found for stem: ${stem}`;
      if (throwOnError) throw new Error(err);
      return { ok: false, errors: [err], warnings };
    }
    resolvedJs = path.join(canonicalExamDir, `${actualStem}.js`);
  }

  if (!actualStem) {
    actualStem = path.basename(resolvedJs, '.js');
  }

  const examDir = canonicalExamDir || path.dirname(resolvedJs);
  const jsBytes = fs.readFileSync(resolvedJs);
  const blobSha1 = gitBlobSha1(jsBytes);
  const isHigh = /[\\/]similar[\\/]high[\\/]/.test(examDir) || /_고[123]_/.test(actualStem);
  const plansDir = path.join(examDir, `${actualStem}_plans`);

  // Review receipt is read up front: its sign-off also decides whether solution-figure visual debt is acknowledged.
  const receiptPath = path.join(examDir, `${actualStem}.review-receipt.json`);
  let receipt = null;
  let receiptParseError = null;
  if (phase !== 'draft' && fs.existsSync(receiptPath)) {
    try { receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8')); } catch (e) { receiptParseError = e; }
  }
  const receiptStatusOk = receiptSignOffIsPass(receipt);
  const receiptAcksVisualDebt = Boolean(receiptStatusOk && /(?:^|_)VISUAL_DEBT(?:_|$)/.test(String(receipt.signOffStatus)) &&
    receipt.candidateGitBlobSha1 === blobSha1);

  // 2. Parse JS
  const sandbox = { window: {}, console };
  try {
    vm.createContext(sandbox);
    vm.runInContext(jsBytes.toString('utf8'), sandbox);
  } catch (e) {
    errors.push(`Failed to evaluate JS sandbox: ${e.message}`);
    return { ok: false, errors, warnings };
  }

  const bank = sandbox.window.questionBank;
  if (!Array.isArray(bank) || !bank.length) {
    errors.push('window.questionBank is empty or not an array');
    return { ok: false, errors, warnings };
  }

  const totalQuestions = bank.length;
  let totalScore = 0.0;
  const mcAnswers = [];
  const mcSlots = { '①': 0, '②': 0, '③': 0, '④': 0, '⑤': 0 };

  // 3. Question-level checks
  for (let i = 0; i < bank.length; i++) {
    const q = bank[i];
    const ord = i + 1;

    // Numbering
    if (q.id !== ord) {
      errors.push(`Q${ord}: id mismatch (expected ${ord}, got ${q.id})`);
    }

    // Points
    const pts = Number(q.points);
    if (isNaN(pts) || pts <= 0) {
      errors.push(`Q${ord}: invalid points (${q.points})`);
    } else {
      totalScore += pts;
    }

    // Content checks
    if (!q.content || typeof q.content !== 'string' || !q.content.trim()) {
      errors.push(`Q${ord}: empty question content`);
    } else {
      if (/\b(undefined|NaN|TODO|PLACEHOLDER|TEMP)\b/i.test(q.content)) {
        errors.push(`Q${ord}: content contains illegal placeholder token`);
      }
    }

    // Type and Choices
    if (q.questionType === '객관식') {
      if (!Array.isArray(q.choices) || q.choices.length !== 5) {
        errors.push(`Q${ord}: MCQ must have exactly 5 choices (got ${q.choices?.length})`);
      } else {
        for (let cIdx = 0; cIdx < q.choices.length; cIdx++) {
          const ch = q.choices[cIdx];
          if (!ch || typeof ch !== 'string' || !ch.trim()) {
            errors.push(`Q${ord} Choice ${cIdx + 1}: empty choice`);
            continue;
          }
          // Choices containing mathematical tokens (digits, variables, arithmetic operators) must be enclosed in LaTeX math.
          // Pure Korean nouns/phrases like '제1사분면', '(가), (나)' are exempt.
          const cleaned = ch
            .replace(/제\d+사분면/g, '')
            .replace(/^[①②③④⑤㉠㉡㉢㉣㉤\s()가-힣]+/, '')
            .replace(/[\s()가-힣]+$/, '');
          const mathChars = /[0-9+\-*/^=<>\\_{}]|[a-zA-Z]/.test(cleaned);
          if (mathChars && !ch.includes('$')) {
            errors.push(`Q${ord} Choice ${cIdx + 1}: mathematical choice not enclosed in LaTeX math '$...$' (${ch})`);
          }
        }
      }

      if (!['①', '②', '③', '④', '⑤'].includes(q.answer)) {
        errors.push(`Q${ord}: invalid MCQ answer (${q.answer})`);
      } else {
        mcAnswers.push(q.answer);
        mcSlots[q.answer] = (mcSlots[q.answer] || 0) + 1;
      }
    } else if (q.questionType === '서술형') {
      if (q.choices && q.choices.length > 0) {
        errors.push(`Q${ord}: Descriptive question must have 0 choices (got ${q.choices.length})`);
      }
      if (!q.answer || typeof q.answer !== 'string' || !q.answer.trim()) {
        errors.push(`Q${ord}: Descriptive question missing answer string`);
      }
    } else {
      errors.push(`Q${ord}: invalid questionType (${q.questionType})`);
    }

    // Solution
    if (!q.solution || typeof q.solution !== 'string' || q.solution.trim().length < 10) {
      errors.push(`Q${ord}: missing or too brief solution explanation`);
    }

    // Image/SVG checks
    if (q.image) {
      let imgPath = path.resolve(REPO_ROOT, q.image);
      if (!fs.existsSync(imgPath)) {
        imgPath = path.resolve(REPO_ROOT, 'archive', q.image);
      }
      if (!fs.existsSync(imgPath)) {
        errors.push(`Q${ord}: referenced image not found on disk (${q.image})`);
      } else {
        const svgContent = fs.readFileSync(imgPath, 'utf8');
        const problemPlan = readJsonSafe(path.join(plansDir, `q${String(ord).padStart(2, '0')}-problem.plan.json`));
        verifyMathematicalSvg(imgPath, svgContent, q, ord, errors, { plan: problemPlan, warnings });
      }
    }
  }

  // 4. Score Invariant
  if (Math.abs(totalScore - 100.0) > 0.0001) {
    errors.push(`Total score invariant violated: sum is ${totalScore.toFixed(1)}, expected 100.0`);
  }

  // 5. Dynamic MCQ Slot Balance (for ANY number of MCQs M)
  const M = mcAnswers.length;
  if (M > 0) {
    const q = Math.floor(M / 5);
    const r = M % 5;
    const minAllowed = q;
    const maxAllowed = r === 0 ? q : q + 1;

    const counts = Object.values(mcSlots);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);

    // Balanced distribution invariant: for any total M MCQs, every slot must have either q or q+1 answers.
    // The difference between the most frequent and least frequent choice must be at most 1 (max - min <= 1).
    if (maxCount - minCount > 1) {
      errors.push(
        `MCQ slot balance violated for ${M} MCQs: distribution is ${JSON.stringify(mcSlots)} ` +
        `(expected each slot between ${minAllowed} and ${maxAllowed}, spread ${maxCount - minCount} > 1)`
      );
    }
  }

  // 6. Author Plans Check. Legacy fixtures may run the static baseline only.
  // New release must use strictAuthoring=true (CLI default); fixture PASS is not an authoring seal.
  if (!strictAuthoring) warnings.push('LEGACY_STATIC_ONLY: engine authoring provenance has not been verified');
  // Compliant with archive/tools/geometry-equation/production/AUTHOR_GUIDE.md
  const SUPPORTED_CAPABILITIES = new Set([
    'construction-spike-v1',
    'polynomial-spike-v1',
    'piecewise-polynomial-spike-v1',
    'quadratic-inequality-chain-v1',
    'number-line-figure-v1',
    'composite-panels-v1',
    'rational-spike-v1',
    'sqrt-affine-spike-v1',
    'absolute-value-spike-v1',
    'piecewise-affine-spike-v1',
    'exponential-affine-spike-v1',
    'logarithmic-affine-spike-v1',
    'trigonometric-spike-v1',
    'piecewise-discontinuous-spike-v1',
    'exp-log-pair-spike-v1',
    'stat-chart-figure-v1',
    'set-diagram-figure-v1'
  ]);
  // Capabilities whose engine input key is verified here (AUTHOR_GUIDE 3-11 / 3-12): the key must be present and its kind valid.
  const ENGINE_INPUT_CONTRACT = {
    'stat-chart-figure-v1': {
      key: 'chart',
      kinds: ['HISTOGRAM', 'FREQUENCY_POLYGON', 'STEM_LEAF', 'BOX_PLOT', 'SCATTER', 'DICE_TABLE', 'TREE', 'DOT_PLOT', 'NORMAL_CURVE']
    },
    'set-diagram-figure-v1': { key: 'diagram', kinds: ['VENN', 'MAPPING', 'MEMBERSHIP_TABLE'] }
  };
  // Real engine capabilities (AUTHOR_GUIDE) for which this harness has no verified input contract. Explicit limitation:
  // reported as an error instead of being silently accepted, so a new use is a deliberate harness extension.
  const KNOWN_UNVERIFIED_ENGINE_CAPABILITIES = new Set([
    'solid-figure-v1', 'multi-curve-figure-v1', 'container-fill-figure-v1', 'lattice-path-figure-v1', 'ellipse-figure-v1'
  ]);

  if (!fs.existsSync(plansDir)) {
    errors.push(`Author plans directory not found: ${plansDir}`);
  } else {
    for (let ord = 1; ord <= totalQuestions; ord++) {
      const pad = String(ord).padStart(2, '0');
      const pPlanPath = path.join(plansDir, `q${pad}-problem.plan.json`);
      const sPlanPath = path.join(plansDir, `q${pad}-solution.plan.json`);

      const q = bank[ord - 1];
      const hasImage = Boolean(q?.image);

      for (const [planPath, role] of [[pPlanPath, 'problem'], [sPlanPath, 'solution']]) {
        const baseName = path.basename(planPath);
        if (!fs.existsSync(planPath)) {
          errors.push(`Q${ord}: Missing ${role} plan file (${baseName})`);
          continue;
        }
        let planData;
        try {
          planData = JSON.parse(fs.readFileSync(planPath, 'utf8'));
        } catch (e) {
          errors.push(`Q${ord}: Malformed JSON in ${baseName}: ${e.message}`);
          continue;
        }

        if (planData.status === 'EXEMPT') {
          if (!planData.reason || typeof planData.reason !== 'string' || planData.reason.trim().length < 5) {
            errors.push(`Q${ord}: ${baseName} marked EXEMPT must have a substantive 'reason' string per AUTHOR_GUIDE.md §2`);
          }
          if (role === 'problem' && hasImage) {
            errors.push(`Q${ord}: Problem has an active image (${q.image}) but problem plan is marked EXEMPT`);
          }
          if (strictAuthoring && role === 'solution' && q?.solutionImage) {
            errors.push(`Q${ord}: Solution EXEMPT conflicts with attached solutionImage`);
          }
        } else if (planData.status === 'UNSUPPORTED') {
          if (!planData.reason || typeof planData.reason !== 'string' || planData.reason.trim().length < 5) {
            errors.push(`Q${ord}: ${baseName} marked UNSUPPORTED must have a substantive 'reason' string per AUTHOR_GUIDE.md §2`);
          }
          if (strictAuthoring) {
            if (role === 'solution' && receiptAcksVisualDebt) {
              // The independent reviewer's receipt (bound to this exact JS blob) signs off with explicit VISUAL_DEBT:
              // a solution figure the engine cannot draw is the declared debt, not a hidden defect. Problem figures
              // a student needs are never accepted this way.
              warnings.push(`VISUAL_DEBT_ACKNOWLEDGED: Q${ord} ${baseName} UNSUPPORTED solution figure accepted via receipt signOffStatus ${receipt.signOffStatus}`);
            } else {
              errors.push(`Q${ord}: ${baseName} UNSUPPORTED cannot be used as a production-visual PASS without an independently approved fallback`);
            }
          }
        } else {
          // Active plan
          if (!planData.capability || !SUPPORTED_CAPABILITIES.has(planData.capability)) {
            const limit = KNOWN_UNVERIFIED_ENGINE_CAPABILITIES.has(planData.capability)
              ? ` (HARNESS_CAPABILITY_LIMIT: '${planData.capability}' is an engine capability but this harness has no verified input contract for it)`
              : '';
            errors.push(`Q${ord}: ${baseName} missing or invalid 'capability' (${planData.capability}) per AUTHOR_GUIDE.md §3${limit}`);
          }
          const contract = ENGINE_INPUT_CONTRACT[planData.capability];
          if (contract) {
            const input = planData[contract.key];
            if (!input || typeof input !== 'object' || !contract.kinds.includes(input.kind)) {
              errors.push(`Q${ord}: ${baseName} ${planData.capability} requires '${contract.key}' with kind one of ${contract.kinds.join('|')} (got ${input && typeof input === 'object' ? input.kind : typeof input})`);
            }
          }
          if (role === 'problem' && !hasImage) {
            errors.push(`Q${ord}: Problem plan is active (${planData.capability}) but question has no image reference`);
          }
          if (strictAuthoring) {
            if (role === 'problem' && /(?:다음\s*그림|그림과\s*같이|색칠한|음영)/.test(q?.content || '') && !q?.image) {
              errors.push(`Q${ord}: Question explicitly needs a figure but no problem image is attached`);
            }
            const source = role === 'problem' ? q?.content : q?.solution;
            const quote = planData.sourceQuote;
            if (typeof quote !== 'string' || quote.length < 12 || quote.length > 40 ||
                typeof source !== 'string' || !source.includes(quote)) {
              errors.push(`Q${ord}: ${baseName} sourceQuote must be an exact 12-40 character quote from its ${role} source`);
            }
            const caption = planData.caption;
            if (typeof caption !== 'string' || caption.trim().length < 10 ||
                !/[가-힣]/.test(caption) || /(?:assets\/images\/|Q\d+\s*시각화\s*다이어그램)/i.test(caption)) {
              errors.push(`Q${ord}: ${baseName} requires a substantive student-facing Korean caption`);
            }
            const engineInputKeys = contract ? [contract.key] : ['mathPlan', 'graphPlan', 'numberLine', 'panels', 'inequalityChain', 'quadraticInequality'];
            if (!engineInputKeys.some(k => planData[k] && typeof planData[k] === 'object')) {
              errors.push(`Q${ord}: ${baseName} has no actual engine input (a capability label alone is not a renderable plan)`);
            }
            const asset = role === 'problem' ? q?.image : q?.solutionImage;
            if (typeof asset !== 'string' || !asset ||
                planData.assetPath !== asset) {
              errors.push(`Q${ord}: ${baseName} assetPath must match the attached ${role} image`);
            }
            const evidence = planData.engineEvidence;
            if (!evidence || !['resultPath', 'statePath', 'svgPath'].every(k => typeof evidence[k] === 'string' && evidence[k])) {
              errors.push(`Q${ord}: ${baseName} missing engineEvidence (resultPath/statePath/svgPath)`);
            } else {
              try {
                const safeFile = (rel) => {
                  const abs = path.resolve(REPO_ROOT, rel);
                  if (!abs.startsWith(REPO_ROOT + path.sep)) throw new Error('evidence path escapes repository');
                  return abs;
                };
                const result = JSON.parse(fs.readFileSync(safeFile(evidence.resultPath), 'utf8'));
                const state = JSON.parse(fs.readFileSync(safeFile(evidence.statePath), 'utf8'));
                const generated = fs.readFileSync(safeFile(evidence.svgPath));
                const actual = typeof asset === 'string'
                  ? (fs.existsSync(safeFile(asset)) ? fs.readFileSync(safeFile(asset)) : fs.readFileSync(safeFile(path.join('archive', asset))))
                  : Buffer.alloc(0);
                const coreOk = result.status === 'ARCHIVE_BOUND' && state?.plan?.capability === planData.capability && generated.equals(actual);
                const ordinalOk = state?.meta?.ordinal === ord;
                // The engine can only capture an ordinal of the registered original exam. When that capture is impossible for
                // this ordinal (documented engine limitation), the evidence may be anchored at another ordinal if (1) status,
                // capability and the generated bytes still match, (2) the evidence directory names this very plan file, and
                // (3) the independent receipt, bound to this JS blob, signs off with explicit VISUAL_DEBT.
                const dirOk = state?.meta?.dir === baseName.replace(/\.plan\.json$/, '');
                if (!coreOk || (!ordinalOk && !(dirOk && receiptAcksVisualDebt))) {
                  errors.push(`Q${ord}: ${baseName} engine output/status/candidate asset mismatch`);
                } else if (!ordinalOk) {
                  warnings.push(`ENGINE_ORDINAL_ANCHOR_MISMATCH: Q${ord} ${baseName} engine evidence is anchored at original ordinal ${state?.meta?.ordinal} (bytes, status and capability match; accepted via receipt ${receipt.signOffStatus})`);
                }
              } catch (e) {
                errors.push(`Q${ord}: ${baseName} engineEvidence unreadable or invalid (${e.message})`);
              }
            }
          }
        }
      }
    }
  }

  // 7. Taxonomy & Metadata Pack verification
  const metaFiles = fs.readdirSync(examDir).filter(f => f.startsWith(`${actualStem}.meta-`) && f.endsWith('.json'));
  if (!metaFiles.length) {
    errors.push(`Small meta JSON not found in ${examDir}`);
  } else {
    const metaPath = path.join(examDir, metaFiles[0]);
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      if (meta.expectedSourceBlobSha1 !== blobSha1) {
        errors.push(`Small meta expectedSourceBlobSha1 mismatch (meta has ${meta.expectedSourceBlobSha1}, JS blob is ${blobSha1})`);
      }
      if (!Array.isArray(meta.items) || meta.items.length !== totalQuestions) {
        errors.push(`Small meta items length mismatch (items=${meta.items?.length}, questions=${totalQuestions})`);
      }

      if (isHigh) {
        verifyHighTaxonomy(meta.items || [], actualStem, errors, warnings);
      } else {
      // Load canonical taxonomy pack matching grade/curriculum, with global registry fallback
      let packName = 'middle1';
      if (actualStem.includes('중3') || (canonicalExamDir && canonicalExamDir.includes('m3'))) {
        packName = (actualStem.includes('2학기') || canonicalExamDir?.includes('2mid') || canonicalExamDir?.includes('2final')) ? 'middle-geometry' : 'middle3';
      } else if (actualStem.includes('중2') || (canonicalExamDir && canonicalExamDir.includes('m2'))) {
        packName = fs.existsSync(path.join(REPO_ROOT, 'archive/data/meta-foundation/canonical/packs/middle2/taxonomy.json')) ? 'middle2' : 'middle-geometry';
      }
      let taxPath = path.join(REPO_ROOT, `archive/data/meta-foundation/canonical/packs/${packName}/taxonomy.json`);
      if (!fs.existsSync(taxPath)) {
        taxPath = path.join(REPO_ROOT, 'archive/data/meta-foundation/compiled/taxonomy_registry.json');
      }
      if (fs.existsSync(taxPath)) {
        const tax = JSON.parse(fs.readFileSync(taxPath, 'utf8'));
        const pts = new Set(tax.problemTypes.map(p => p.problemTypeKey));
        const tpls = new Map(tax.templates.map(t => [t.templateKey, t]));

        for (const it of meta.items || []) {
          const ord = it.sourceOrdinal;
          const pt = it.after?.problemTypeKey;
          const tpl = it.after?.templateKey;

          if (pt && !pts.has(pt)) {
            errors.push(`Q${ord}: unregistered problemTypeKey (${pt}) in canonical taxonomy`);
          }
          if (tpl) {
            if (!tpls.has(tpl)) {
              errors.push(`Q${ord}: unregistered templateKey (${tpl}) in canonical taxonomy`);
            } else {
              const tObj = tpls.get(tpl);
              if (tObj.parentProblemTypeKey !== pt && tObj.problemTypeKey !== pt) {
                errors.push(`Q${ord}: templateKey ${tpl} does not belong to parent ${pt}`);
              }
            }
          }
        }
      }
      }
    } catch (e) {
      errors.push(`Failed to parse small meta JSON: ${e.message}`);
    }
  }

  // 8. Review Receipt & Cryptographic Binding
  if (phase === 'draft') {
    warnings.push('DRAFT_PHASE: review receipt is intentionally not checked; no production authorization');
  } else if (!fs.existsSync(receiptPath)) {
    errors.push(`Review receipt not found: ${receiptPath}`);
  } else if (receiptParseError) {
    errors.push(`Failed to parse review receipt: ${receiptParseError.message}`);
  } else {
    try {
      verifyReceipt(receipt, { bank, blobSha1, totalQuestions, errors, warnings });
    } catch (e) {
      errors.push(`Failed to parse review receipt: ${e.message}`);
    }
  }

  const ok = errors.length === 0;
  if (!ok && throwOnError) {
    throw new Error(`[HARNESS_GATE_FAIL] ${actualStem}:\n - ` + errors.join('\n - '));
  }

  return {
    ok,
    stem: actualStem,
    jsBlobSha1: blobSha1,
    totalQuestions,
    totalScore,
    mcDistribution: mcSlots,
    errors,
    warnings
  };
}

// CLI Execution
if (process.argv[1] && process.argv[1].endsWith('verify_similar_exam.mjs')) {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node tools/harness/verify_similar_exam.mjs [exam_stem_or_js_path]');
    process.exit(1);
  }

  const res = verifySimilarExam({
    stem: target.endsWith('.js') ? null : target,
    jsPath: target.endsWith('.js') ? target : null,
    strictAuthoring: !process.argv.includes('--legacy-baseline'),
    phase: process.argv.includes('--phase=draft') ? 'draft' : 'release'
  });

  if (res.ok) {
    console.log(`[GATE_PASS] ${res.stem}: ${res.totalQuestions} questions, ${res.totalScore} pts, blob ${res.jsBlobSha1}`);
    if (process.argv.includes('--phase=draft') || process.argv.includes('--legacy-baseline')) {
      console.log('[NON_RELEASE_PASS] Draft/legacy checks do not authorize publishing.');
    }
    console.log(`MCQ Distribution:`, JSON.stringify(res.mcDistribution));
    for (const w of res.warnings) console.log(`  [WARN] ${w}`);
    process.exit(0);
  } else {
    console.error(`[GATE_FAIL] ${res.stem} failed with ${res.errors.length} error(s):`);
    for (const err of res.errors) {
      console.error(`  [X] ${err}`);
    }
    for (const w of res.warnings) console.error(`  [WARN] ${w}`);
    process.exit(1);
  }
}
