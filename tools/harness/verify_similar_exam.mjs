import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const REPO_ROOT = path.resolve('c:/Users/USER/Desktop/AP------');

function gitBlobSha1(contentBytes) {
  const header = Buffer.from(`blob ${contentBytes.length}\0`);
  return crypto.createHash('sha1').update(header).update(contentBytes).digest('hex');
}

function sha256(contentBytes) {
  return crypto.createHash('sha256').update(contentBytes).digest('hex');
}

export function verifySimilarExam({ stem, jsPath, throwOnError = false }) {
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
        if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
          errors.push(`Q${ord}: image file is not valid SVG (${q.image})`);
        }
        if (!/#ffffff/i.test(svgContent) && !/fill=["']white["']/i.test(svgContent)) {
          errors.push(`Q${ord}: SVG does not have pure-white (#FFFFFF) background (${q.image})`);
        }
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

  // 6. Plans check
  const plansDir = path.join(examDir, `${actualStem}_plans`);
  if (!fs.existsSync(plansDir)) {
    errors.push(`Author plans directory not found: ${plansDir}`);
  } else {
    for (let ord = 1; ord <= totalQuestions; ord++) {
      const pad = String(ord).padStart(2, '0');
      const pPlan = path.join(plansDir, `q${pad}-problem.plan.json`);
      const sPlan = path.join(plansDir, `q${pad}-solution.plan.json`);
      if (!fs.existsSync(pPlan)) errors.push(`Missing problem plan: q${pad}-problem.plan.json`);
      if (!fs.existsSync(sPlan)) errors.push(`Missing solution plan: q${pad}-solution.plan.json`);
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
  if (!fs.existsSync(receiptPath)) {
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
    jsPath: target.endsWith('.js') ? target : null
  });

  if (res.ok) {
    console.log(`[GATE_PASS] ${res.stem}: ${res.totalQuestions} questions, ${res.totalScore} pts, blob ${res.jsBlobSha1}`);
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
