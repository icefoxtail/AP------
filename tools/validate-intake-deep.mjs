import fs from 'fs';
import path from 'path';
import vm from 'vm';

/**
 * 10-Axis Intake Deep Validator
 * Validates exam JS files against strict structural, syntax, and sanity rules.
 */
export function validateExamFile(filePath) {
  const errors = [];
  const warnings = [];
  const baseName = path.basename(filePath);

  if (!fs.existsSync(filePath)) {
    return { valid: false, errors: [`File does not exist: ${filePath}`], warnings: [] };
  }

  const raw = fs.readFileSync(filePath, 'utf8');

  // 1. JSON AST / Escapes check: single backslash followed by brace without another preceding backslash
  const badEscapes = raw.match(/(?<!\\)\\[{}]/g);
  if (badEscapes) {
    errors.push(`Invalid unescaped LaTeX brace found (${badEscapes.length} occurrences). Use double backslash \\\\{ or \\\\}.`);
  }

  // 2. VM execution check
  const sandbox = { window: {}, var: {}, examData: null };
  const context = vm.createContext(sandbox);
  try {
    vm.runInContext(raw, context);
  } catch (err) {
    errors.push(`VM Execution failed: ${err.message}`);
    return { valid: false, errors, warnings };
  }

  let questions = sandbox.window?.questionBank || sandbox.examData?.questions;
  if (!questions && typeof sandbox.questionBank !== 'undefined') {
    questions = sandbox.questionBank;
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    errors.push('No valid questionBank array found or empty.');
    return { valid: false, errors, warnings };
  }

  const seenIds = new Set();

  questions.forEach((q, idx) => {
    const qNum = q.questionNumber || q.id || (idx + 1);

    // Question numbering
    if (seenIds.has(qNum)) {
      errors.push(`Q${qNum}: Duplicate question number detected.`);
    }
    seenIds.add(qNum);

    // Content check
    if (!q.content || typeof q.content !== 'string' || q.content.trim() === '') {
      errors.push(`Q${qNum}: Empty content.`);
    } else {
      // LaTeX dollar delimiter balance
      const singleDollars = (q.content.match(/(?<!\\)\$/g) || []).length;
      if (singleDollars % 2 !== 0) {
        errors.push(`Q${qNum}: Mismatched LaTeX '$' delimiters in content (count: ${singleDollars}).`);
      }

      // Score tag check
      if (!/\[\d+(?:\.\d+)?점\]/.test(q.content)) {
        warnings.push(`Q${qNum}: Missing score tag like [4.0점] in content.`);
      }
    }

    // Choices check
    const qType = q.questionType || (q.choices && q.choices.length > 0 ? '객관식' : '서술형');
    if (qType === '객관식') {
      if (!Array.isArray(q.choices) || q.choices.length !== 5) {
        errors.push(`Q${qNum}: Multiple choice question must have exactly 5 choices, found ${q.choices ? q.choices.length : 0}.`);
      } else {
        // Duplicate choices check
        const choiceSet = new Set(q.choices.map(c => String(c).trim()));
        if (choiceSet.size < 5) {
          errors.push(`Q${qNum}: Duplicate choices found among the 5 options: [${q.choices.join(', ')}].`);
        }

        // Empty choice check
        q.choices.forEach((c, cIdx) => {
          if (c === null || c === undefined || String(c).trim() === '') {
            errors.push(`Q${qNum}: Choice #${cIdx + 1} is empty.`);
          }
          const cDollars = (String(c).match(/(?<!\\)\$/g) || []).length;
          if (cDollars % 2 !== 0) {
            errors.push(`Q${qNum}: Choice #${cIdx + 1} has mismatched '$' delimiters: "${c}".`);
          }
        });
      }
    } else {
      if (Array.isArray(q.choices) && q.choices.length > 0) {
        errors.push(`Q${qNum}: Subjective/descriptive question must have empty choices array, found ${q.choices.length}.`);
      }
    }

    // Asset checks
    if (q.content && q.content.includes('<img')) {
      const srcMatches = q.content.matchAll(/src=["']([^"']+)["']/g);
      for (const m of srcMatches) {
        const srcPath = m[1];
        if (srcPath.startsWith('/')) {
          errors.push(`Q${qNum}: Image src has leading slash: "${srcPath}". Must use relative path.`);
        }
        const fullDiskPath = path.resolve(process.cwd(), srcPath);
        const archiveDiskPath = path.resolve(process.cwd(), 'archive', srcPath);
        const stagingDiskPath = path.resolve(path.dirname(filePath), '..', '..', '..', srcPath);
        if (!fs.existsSync(fullDiskPath) && !fs.existsSync(archiveDiskPath) && !fs.existsSync(stagingDiskPath)) {
          errors.push(`Q${qNum}: Referenced image does not exist on disk: "${srcPath}".`);
        }
      }
    }

    // Original defect check
    if (q.isOriginalDefect) {
      if (!Array.isArray(q.multipleAnswer) && typeof q.multipleAnswer !== 'number') {
        warnings.push(`Q${qNum}: isOriginalDefect is true but multipleAnswer is missing.`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    totalQuestions: questions.length,
    errors,
    warnings
  };
}

// CLI runner
if (process.argv[1] && process.argv[1].endsWith('validate-intake-deep.mjs')) {
  const target = process.argv[2];
  if (!target) {
    console.log("Usage: node tools/validate-intake-deep.mjs <file_or_dir>");
    process.exit(1);
  }

  const stat = fs.statSync(target);
  let files = [];
  if (stat.isDirectory()) {
    const listFiles = (dir) => {
      for (const f of fs.readdirSync(dir)) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) listFiles(full);
        else if (f.endsWith('.js')) files.push(full);
      }
    };
    listFiles(target);
  } else {
    files = [target];
  }

  let totalErrors = 0;
  for (const f of files) {
    const res = validateExamFile(f);
    console.log(`[${res.valid ? 'PASS' : 'FAIL'}] ${f} (${res.totalQuestions || 0} questions)`);
    if (res.errors.length > 0) {
      totalErrors += res.errors.length;
      res.errors.forEach(e => console.log(`  ❌ ${e}`));
    }
    if (res.warnings.length > 0) {
      res.warnings.forEach(w => console.log(`  ⚠️  ${w}`));
    }
  }

  if (totalErrors > 0) {
    console.log(`\nTotal Errors: ${totalErrors}`);
    process.exit(1);
  } else {
    console.log(`\nAll ${files.length} exam(s) passed deep intake audit.`);
  }
}
