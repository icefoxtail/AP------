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
function verifyMathematicalSvg(svgPath, svgContent, q, ord, errors) {
  // 1. Root & ViewBox
  const svgMatch = svgContent.match(/<svg[^>]*>/i);
  if (!svgMatch || !svgContent.includes('</svg>')) {
    errors.push(`Q${ord}: SVG file is missing valid <svg> root or </svg> closing tag (${q.image})`);
    return;
  }
  const rootTag = svgMatch[0];
  const viewBoxMatch = rootTag.match(/viewBox=["']\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*["']/i);
  if (viewBoxMatch) {
    const vbW = parseFloat(viewBoxMatch[3]);
    const vbH = parseFloat(viewBoxMatch[4]);
    if (isNaN(vbW) || isNaN(vbH) || vbW <= 0 || vbH <= 0) {
      errors.push(`Q${ord}: SVG viewBox dimensions must be strictly positive numbers (got width=${vbW}, height=${vbH}) in ${q.image}`);
    }
  }

  // Accessibility tags and role per AUTHOR_GUIDE.md and visual contract
  if (!/<title\b[^>]*>[\s\S]+?<\/title>/i.test(svgContent)) {
    errors.push(`Q${ord}: SVG is missing required educational <title> tag (${q.image})`);
  }
  if (!/<desc\b[^>]*>[\s\S]+?<\/desc>/i.test(svgContent)) {
    errors.push(`Q${ord}: SVG is missing required educational <desc> tag (${q.image})`);
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
    const hasX = /(?:^|[^a-zA-Z0-9])x(?:[^a-zA-Z0-9]|$)/i.test(fullSvgText);
    const hasY = /(?:^|[^a-zA-Z0-9])y(?:[^a-zA-Z0-9]|$)/i.test(fullSvgText);
    const hasOrigin = /(?:^|[^a-zA-Z0-9])O(?:[^a-zA-Z0-9]|$)/.test(fullSvgText);
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
  const mathMatches = stem.matchAll(/\$([^$]+)\$/g);
  for (const mm of mathMatches) {
    const cleanMath = mm[1].replace(/\\[a-zA-Z]+/g, '');
    const capitalLetters = cleanMath.match(/\b[A-Z]\b/g) || [];
    for (const cl of capitalLetters) {
      referencedPoints.add(cl);
    }
  }
  for (const pt of referencedPoints) {
    const ptRegex = new RegExp(`(^|[^a-zA-Z0-9])${pt}([^a-zA-Z0-9]|$)`);
    if (!ptRegex.test(fullSvgText)) {
      errors.push(`Q${ord}: Point/symbol '${pt}' referenced in question stem is missing from SVG text labels in ${q.image}`);
    }
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
    const candidateDirs = [
      path.join(REPO_ROOT, 'archive/exams/similar/middle/m1/1mid'),
      path.join(REPO_ROOT, 'archive/exams/similar/middle/m1/1final'),
      path.join(REPO_ROOT, 'archive/exams/similar/middle/m2/1mid'),
      path.join(REPO_ROOT, 'archive/exams/similar/middle/m2/1final'),
      path.join(REPO_ROOT, 'archive/exams/similar/middle/m3/1mid'),
      path.join(REPO_ROOT, 'archive/exams/similar/middle/m3/1final')
    ];
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
        verifyMathematicalSvg(imgPath, svgContent, q, ord, errors);
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
    'trigonometric-spike-v1'
  ]);

  const plansDir = path.join(examDir, `${actualStem}_plans`);
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
        } else if (planData.status === 'UNSUPPORTED') {
          if (!planData.reason || typeof planData.reason !== 'string' || planData.reason.trim().length < 5) {
            errors.push(`Q${ord}: ${baseName} marked UNSUPPORTED must have a substantive 'reason' string per AUTHOR_GUIDE.md §2`);
          }
        } else {
          // Active plan
          if (!planData.capability || !SUPPORTED_CAPABILITIES.has(planData.capability)) {
            errors.push(`Q${ord}: ${baseName} missing or invalid 'capability' (${planData.capability}) per AUTHOR_GUIDE.md §3`);
          }
          if (role === 'problem' && !hasImage) {
            errors.push(`Q${ord}: Problem plan is active (${planData.capability}) but question has no image reference`);
          }
          if (strictAuthoring) {
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
            if (!['mathPlan', 'graphPlan', 'numberLine', 'panels', 'inequalityChain', 'quadraticInequality'].some(k => planData[k] && typeof planData[k] === 'object')) {
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
                if (result.status !== 'ARCHIVE_BOUND' || state?.plan?.capability !== planData.capability ||
                    state?.meta?.ordinal !== ord || !generated.equals(actual)) {
                  errors.push(`Q${ord}: ${baseName} engine output/status/candidate asset mismatch`);
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

      // Load middle1 taxonomy
      const taxPath = path.join(REPO_ROOT, 'archive/data/meta-foundation/canonical/packs/middle1/taxonomy.json');
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
    } catch (e) {
      errors.push(`Failed to parse small meta JSON: ${e.message}`);
    }
  }

  // 8. Review Receipt & Cryptographic Binding
  const receiptPath = path.join(examDir, `${actualStem}.review-receipt.json`);
  if (phase === 'draft') {
    warnings.push('DRAFT_PHASE: review receipt is intentionally not checked; no production authorization');
  } else if (!fs.existsSync(receiptPath)) {
    errors.push(`Review receipt not found: ${receiptPath}`);
  } else {
    try {
      const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
      if (receipt.candidateGitBlobSha1 !== blobSha1) {
        errors.push(`Receipt candidateGitBlobSha1 mismatch (receipt has ${receipt.candidateGitBlobSha1}, JS blob is ${blobSha1})`);
      }
      if (receipt.signOffStatus !== 'SIGNED_OFF_PASS') {
        errors.push(`Receipt signOffStatus is not SIGNED_OFF_PASS (${receipt.signOffStatus})`);
      }

      const qReviews = receipt.questionReviews;
      if (!Array.isArray(qReviews) || qReviews.length !== totalQuestions) {
        errors.push(`Receipt questionReviews count mismatch (${qReviews?.length} vs ${totalQuestions})`);
      } else {
        const seenDerivations = new Set();
        let copyPasteCount = 0;
        for (const qr of qReviews) {
          if (!qr.blindMatch) {
            errors.push(`Q${qr.qid}: review receipt blindMatch is false`);
          }
          if (!qr.blindDerivation || qr.blindDerivation.trim().length < 8) {
            errors.push(`Q${qr.qid}: missing or too brief blindDerivation evidence in receipt`);
          } else {
            if (seenDerivations.has(qr.blindDerivation)) copyPasteCount++;
            seenDerivations.add(qr.blindDerivation);
          }
        }
        if (copyPasteCount > 3) {
          errors.push(`Receipt fraud detected: ${copyPasteCount} duplicate copy-pasted blindDerivation strings found`);
        }
      }
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
    process.exit(0);
  } else {
    console.error(`[GATE_FAIL] ${res.stem} failed with ${res.errors.length} error(s):`);
    for (const err of res.errors) {
      console.error(`  [X] ${err}`);
    }
    process.exit(1);
  }
}
