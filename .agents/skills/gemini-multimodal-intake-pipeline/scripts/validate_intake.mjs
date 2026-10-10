#!/usr/bin/env node

/**
 * validate_intake.mjs
 * Validates candidate intake JS files against the Source-Only contract:
 * - VM evaluation of window.examTitle and window.questionBank
 * - Multiple choice questions choice count == 5
 * - answer and solution MUST be blank strings ("")
 * - Referenced asset images must exist on disk
 * - Automatically updates corresponding .evidence.json validation block
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

function parseArgs(argv) {
  const args = { file: null, root: process.cwd(), evidence: null, json: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') {
      args.json = true;
    } else if (a === '--root') {
      args.root = argv[++i];
    } else if (a === '--evidence') {
      args.evidence = argv[++i];
    } else if (!args.file && !a.startsWith('--')) {
      args.file = a;
    }
  }
  return args;
}

function resolveAssetPath(repoRoot, filePath, rawSrc) {
  if (rawSrc.startsWith('assets/')) {
    return path.resolve(repoRoot, 'archive', rawSrc);
  } else if (rawSrc.startsWith('archive/assets/')) {
    return path.resolve(repoRoot, rawSrc);
  } else {
    return path.resolve(path.dirname(filePath), rawSrc);
  }
}

function validateJs(filePath, repoRoot) {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(filePath)) {
    return { ok: false, errors: [`File does not exist: ${filePath}`], warnings: [] };
  }

  const code = fs.readFileSync(filePath, 'utf8');
  const sandbox = { window: {} };
  const context = vm.createContext(sandbox);

  try {
    vm.runInContext(code, context);
  } catch (err) {
    return { ok: false, errors: [`JavaScript VM execution failed: ${err.message}`], warnings: [] };
  }

  const win = sandbox.window;
  const examTitle = win.examTitle || (win.examData && win.examData.examTitle);
  const questions = win.questionBank || (win.examData && win.examData.questions);

  if (!examTitle) {
    errors.push('window.examTitle is missing');
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    errors.push('window.questionBank is missing or not a non-empty array');
    return { ok: false, errors, warnings };
  }

  let choiceCount = 0;
  let essayCount = 0;
  let checkedImages = 0;
  const missingImages = [];

  questions.forEach((q, idx) => {
    const qNum = q.id ?? (idx + 1);
    const body = q.content || q.question;

    if (!body || typeof body !== 'string') {
      errors.push(`Question #${qNum}: question text/content is missing or not a string`);
    }

    if (q.answer !== "" && q.answer !== null && q.answer !== undefined) {
      errors.push(`Question #${qNum}: answer must be blank in Source-Only intake, but got "${q.answer}"`);
    }
    if (q.solution !== "" && q.solution !== null && q.solution !== undefined) {
      errors.push(`Question #${qNum}: solution must be blank in Source-Only intake, but got "${q.solution}"`);
    }

    const qType = (q.questionType || q.type || '').trim();
    const isEssay = qType.includes('서술') || qType.includes('주관') || qType.includes('단답') || qType.includes('essay');
    const isChoice = qType === '객관식' || qType === 'choice' || (!isEssay && Array.isArray(q.choices) && q.choices.length > 0);

    if (isChoice && !isEssay) {
      choiceCount++;
      if (!Array.isArray(q.choices) || q.choices.length !== 5) {
        errors.push(`Question #${qNum}: choice question expects 5 choices, but got ${q.choices ? q.choices.length : 0}`);
      }
    } else {
      essayCount++;
    }

    if (q.image && typeof q.image === 'string') {
      checkedImages++;
      const resolvedPath = resolveAssetPath(repoRoot, filePath, q.image);
      if (!fs.existsSync(resolvedPath)) {
        missingImages.push({ qid: qNum, src: q.image, resolvedPath });
      }
    }

    const textToCheck = (body || '') + ' ' + (Array.isArray(q.choices) ? q.choices.join(' ') : '');
    const imgMatches = textToCheck.matchAll(/src=["']([^"']+)["']/g);
    for (const match of imgMatches) {
      const src = match[1];
      checkedImages++;
      const resolvedPath = resolveAssetPath(repoRoot, filePath, src);
      if (!fs.existsSync(resolvedPath)) {
        missingImages.push({ qid: qNum, src, resolvedPath });
      }
    }
  });

  if (missingImages.length > 0) {
    for (const mi of missingImages) {
      errors.push(`Question #${mi.qid}: referenced asset not found: ${mi.src} (checked ${mi.resolvedPath})`);
    }
  }

  const ok = errors.length === 0;
  return {
    ok,
    errors,
    warnings,
    stats: {
      examTitle,
      totalQuestions: questions.length,
      choiceCount,
      essayCount,
      checkedImages,
      missingImagesCount: missingImages.length
    }
  };
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.file) {
    console.error('Usage: node validate_intake.mjs <path-to-exam.js> [--root <repo-root>] [--evidence <path-to-evidence.json>] [--json]');
    process.exit(1);
  }

  const targetPath = path.resolve(args.root, args.file);
  const result = validateJs(targetPath, args.root);

  // If evidence path provided, update it
  if (args.evidence && fs.existsSync(args.evidence)) {
    try {
      const ev = JSON.parse(fs.readFileSync(args.evidence, 'utf8'));
      ev.validation = {
        vmExecution: result.ok ? 'PASS' : 'FAIL',
        choiceLengthCheck: result.errors.some(e => e.includes('choice')) ? 'FAIL' : 'PASS',
        answerBlankCheck: result.errors.some(e => e.includes('answer')) ? 'FAIL' : 'PASS',
        solutionBlankCheck: result.errors.some(e => e.includes('solution')) ? 'FAIL' : 'PASS',
        assetExistenceCheck: result.stats.missingImagesCount === 0 ? 'PASS' : 'FAIL'
      };
      fs.writeFileSync(args.evidence, JSON.stringify(ev, null, 2), 'utf8');
      console.log(`Updated evidence file: ${args.evidence}`);
    } catch (err) {
      console.warn(`Warning: Could not update evidence file: ${err.message}`);
    }
  }

  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('============================================================');
    console.log(`  GMDI Validation: ${path.basename(targetPath)}`);
    console.log('============================================================');
    console.log(`Status        : ${result.ok ? 'PASS' : 'FAIL'}`);
    if (result.stats) {
      console.log(`Exam Title    : ${result.stats.examTitle}`);
      console.log(`Total Qs      : ${result.stats.totalQuestions}`);
      console.log(`Choices (MC)  : ${result.stats.choiceCount}`);
      console.log(`Essay/Subj    : ${result.stats.essayCount}`);
      console.log(`Images Checked: ${result.stats.checkedImages}`);
    }
    if (result.warnings.length > 0) {
      console.log('Warnings:');
      result.warnings.forEach(w => console.log(`  - ${w}`));
    }
    if (result.errors.length > 0) {
      console.log('Errors:');
      result.errors.forEach(e => console.log(`  [X] ${e}`));
    }
    console.log('============================================================');
  }

  process.exit(result.ok ? 0 : 1);
}

main();
