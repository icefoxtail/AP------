import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const productionDir = path.join(archiveDir, 'exams');
const candidateDir = path.join(archiveDir, '_generated/past-exams');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/complete-subunit-classification');
const outputPath = path.join(outputDir, 'archive-complete-subunit-candidate-sync-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function writeTextWithRetry(filePath, value) {
  let lastError;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      fs.writeFileSync(filePath, value, 'utf8');
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 11) {
        const wait = new Int32Array(new SharedArrayBuffer(4));
        Atomics.wait(wait, 0, 0, 150);
      }
    }
  }
  throw lastError;
}

function walkJs(root) {
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const filePath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...walkJs(filePath));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(filePath);
  }
  return files.sort((a, b) => a.localeCompare(b, 'en'));
}

function loadQuestionBank(source, file) {
  const context = { window: {}, console };
  vm.runInNewContext(source, context, { timeout: 2000, filename: file });
  if (!Array.isArray(context.window.questionBank)) throw new Error(`questionBank missing: ${file}`);
  return context.window.questionBank;
}

function stableCoreDigest(questionBank) {
  const core = questionBank.map(question => ({
    id: question.id,
    category: question.category,
    standardUnitKey: question.standardUnitKey,
    standardUnit: question.standardUnit,
    content: question.content,
    choices: question.choices,
    answer: question.answer,
    solution: question.solution
  }));
  return sha256(JSON.stringify(core));
}

export function syncCompleteSubunitCandidatesV1() {
  const productionFiles = walkJs(productionDir);
  const candidateFiles = walkJs(candidateDir).filter(filePath => `${path.sep}candidate${path.sep}`.toLowerCase() ===
    filePath.slice(filePath.toLowerCase().indexOf(`${path.sep}candidate${path.sep}`), filePath.toLowerCase().indexOf(`${path.sep}candidate${path.sep}`) + `${path.sep}candidate${path.sep}`.length));
  const byBasename = new Map();
  for (const filePath of productionFiles) {
    const key = path.basename(filePath);
    if (!byBasename.has(key)) byBasename.set(key, []);
    byBasename.get(key).push(filePath);
  }

  const files = [];
  const missingProduction = [];
  const duplicateProduction = [];
  let synced = 0;
  let syncedQuestions = 0;
  for (const candidatePath of candidateFiles) {
    const basename = path.basename(candidatePath);
    const matches = byBasename.get(basename) || [];
    const candidateRelative = path.relative(archiveDir, candidatePath).replaceAll('\\', '/');
    if (matches.length === 0) {
      missingProduction.push(candidateRelative);
      files.push({ candidateFile: candidateRelative, status: 'missing_production_mapping' });
      continue;
    }
    if (matches.length !== 1) {
      duplicateProduction.push({ candidateFile: candidateRelative, productionFiles: matches.map(file => path.relative(archiveDir, file).replaceAll('\\', '/')) });
      files.push({ candidateFile: candidateRelative, status: 'duplicate_production_mapping' });
      continue;
    }

    const productionPath = matches[0];
    const before = fs.readFileSync(candidatePath, 'utf8');
    const production = fs.readFileSync(productionPath, 'utf8');
    const candidateQuestions = loadQuestionBank(before, candidateRelative);
    const productionQuestions = loadQuestionBank(production, path.relative(archiveDir, productionPath));
    if (candidateQuestions.length !== productionQuestions.length) {
      files.push({
        candidateFile: candidateRelative,
        productionFile: path.relative(archiveDir, productionPath).replaceAll('\\', '/'),
        status: 'question_count_mismatch',
        candidateQuestionCount: candidateQuestions.length,
        productionQuestionCount: productionQuestions.length
      });
      continue;
    }

    const beforeCoreDigest = stableCoreDigest(candidateQuestions);
    const productionCoreDigest = stableCoreDigest(productionQuestions);
    const beforeDigest = sha256(before);
    // Production is the authoritative finalized artifact. Candidate files are
    // generated review artifacts; copying the exact production bytes is the
    // only state that satisfies the archive completion gate and preserves all
    // verified content, answers, solutions, and subunit fields.
    if (before !== production) writeTextWithRetry(candidatePath, production);
    const after = fs.readFileSync(candidatePath, 'utf8');
    const afterQuestions = loadQuestionBank(after, candidateRelative);
    const afterDigest = sha256(after);
    if (afterDigest !== sha256(production) || afterQuestions.length !== productionQuestions.length) {
      throw new Error(`candidate validation failed: ${candidateRelative}`);
    }
    files.push({
      candidateFile: candidateRelative,
      productionFile: path.relative(archiveDir, productionPath).replaceAll('\\', '/'),
      status: before === production ? 'already_equal' : 'synced_from_production',
      questionCount: afterQuestions.length,
      beforeDigest,
      afterDigest,
      productionDigest: sha256(production),
      beforeCoreDigest,
      productionCoreDigest,
      coreChangedBeforeSync: beforeCoreDigest !== productionCoreDigest
    });
    synced += 1;
    syncedQuestions += afterQuestions.length;
  }

  const stable = {
    schemaVersion: 'archive-complete-subunit-candidate-sync-v1',
    sourceKind: 'production_canonical_copy',
    writes: { candidateJs: synced > 0, database: false, questionIndex: false, commit: false, push: false },
    totals: {
      candidateFilesFound: candidateFiles.length,
      productionFilesFound: productionFiles.length,
      syncedCandidates: synced,
      syncedQuestions,
      missingProductionMappings: missingProduction.length,
      duplicateProductionMappings: duplicateProduction.length,
      questionCountMismatches: files.filter(file => file.status === 'question_count_mismatch').length
    },
    gates: {
      allMappedCandidatesByteEqual: files.filter(file => ['synced_from_production', 'already_equal'].includes(file.status)).every(file => file.afterDigest === file.productionDigest),
      noAmbiguousMappings: duplicateProduction.length === 0,
      noQuestionCountMismatches: files.every(file => file.status !== 'question_count_mismatch'),
      commitOrPush: false
    },
    files,
    missingProduction,
    duplicateProduction
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const output = syncCompleteSubunitCandidatesV1();
  fs.mkdirSync(outputDir, { recursive: true });
  writeTextWithRetry(outputPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: output.digest, totals: output.totals, gates: output.gates }, null, 2));
}
