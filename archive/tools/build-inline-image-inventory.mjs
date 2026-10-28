#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(archiveDir, '..');
const examsDir = path.join(archiveDir, 'exams');
const reportPath = path.join(repoRoot, 'docs/reports/archive-inline-image-inventory-20260915.json');
const knownMissingPath = path.join(archiveDir, 'data/inline-image-known-missing-v1.json');

function examFiles(directory, out = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) examFiles(full, out);
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

function archiveRelativeImagePath(src) {
  if (typeof src !== 'string' || !src.startsWith('assets/images/') || src.includes('\\')) return false;
  const pathname = src.split(/[?#]/, 1)[0];
  const segments = pathname.split('/');
  if (segments.some(segment => !segment || segment === '.' || segment === '..')) return false;
  const resolved = path.resolve(archiveDir, pathname);
  return resolved.startsWith(path.join(archiveDir, 'assets', 'images') + path.sep) ? resolved : null;
}

function resolveInlineImageAsset(src, examFile, relativeExamPath) {
  const archiveImage = archiveRelativeImagePath(src);
  if (archiveImage) return { path: archiveImage, relativePathValid: true };

  // Textbook questionBank sources intentionally keep qNN image files beside
  // their JS source; resolving these against archive/assets/images is wrong.
  if (!relativeExamPath.startsWith('textbooks/') || !/^q\d+\.(?:png|jpe?g|webp|svg)$/i.test(src)) {
    return { path: null, relativePathValid: false };
  }
  const resolved = path.resolve(path.dirname(examFile), src);
  const textbookRoot = path.resolve(examsDir, 'textbooks') + path.sep;
  if (!resolved.startsWith(textbookRoot)) return { path: null, relativePathValid: false };
  return { path: resolved, relativePathValid: true };
}

export function buildInlineImageInventory() {
  const records = [];
  const errors = [];
  const knownMissing = JSON.parse(fs.readFileSync(knownMissingPath, 'utf8')).missing;
  const keyFor = ({ file, questionId, src }) => JSON.stringify([file, String(questionId), src]);
  const expectedMissingCounts = new Map();
  for (const reference of knownMissing) {
    const key = keyFor(reference);
    expectedMissingCounts.set(key, (expectedMissingCounts.get(key) || 0) + 1);
  }
  const observedMissingCounts = new Map();

  for (const file of examFiles(examsDir)) {
    const relative = path.relative(examsDir, file).replace(/\\/g, '/');
    const window = {};
    try {
      vm.runInNewContext(fs.readFileSync(file, 'utf8'), { window, console }, { filename: file, timeout: 5000 });
    } catch (error) {
      errors.push(`${relative}: parse failure: ${error.message}`);
      continue;
    }
    const bank = Array.isArray(window.questionBank)
      ? window.questionBank
      : (window.questionBank?.questions || window.questionBank?.problems || []);
    if (!Array.isArray(bank)) continue;

    bank.forEach((question, index) => {
      const content = String(question?.content || question?.question || question?.text || question?.prompt || '');
      for (const match of content.matchAll(/<img\b[^>]*>/gi)) {
        const tag = match[0];
        const src = tag.match(/\bsrc\s*=\s*(["'])(.*?)\1/i)?.[2] || '';
        const pathname = src.split(/[?#]/, 1)[0];
        const { path: assetPath, relativePathValid } = resolveInlineImageAsset(src, file, relative);
        const assetExists = Boolean(assetPath && fs.existsSync(assetPath) && fs.statSync(assetPath).isFile());
        const testFixture = relative.startsWith('test-fixtures/');

        if (!relativePathValid) errors.push(`${relative} q${question?.id ?? index + 1}: image src is not a supported archive image reference: ${src}`);
        else if (!assetExists && !testFixture) {
          const reference = { file: relative, questionId: question?.id ?? index + 1, src };
          const key = keyFor(reference);
          const observed = (observedMissingCounts.get(key) || 0) + 1;
          observedMissingCounts.set(key, observed);
          if (observed > (expectedMissingCounts.get(key) || 0)) {
            errors.push(`${relative} q${reference.questionId}: image asset is missing and is not in the frozen baseline: ${src}`);
          }
        }

        records.push({
          file: relative,
          questionId: question?.id ?? index + 1,
          sourceOrdinal: index + 1,
          src,
          extension: path.extname(pathname).toLowerCase(),
          qImagePresent: Boolean(question?.image),
          contentInlineImage: true,
          testFixture,
          relativePathValid,
          assetExists
        });
      }
    });
  }

  for (const reference of knownMissing) {
    const key = keyFor(reference);
    if ((observedMissingCounts.get(key) || 0) < expectedMissingCounts.get(key)) {
      errors.push(`${reference.file} q${reference.questionId}: frozen missing-image baseline entry is stale: ${reference.src}`);
    }
  }

  records.sort((left, right) => left.file.localeCompare(right.file) || left.sourceOrdinal - right.sourceOrdinal);
  return { records, errors };
}

export function buildInlineImageInventoryReport() {
  const { records, errors } = buildInlineImageInventory();
  const extensionCounts = {};
  for (const record of records) extensionCounts[record.extension] = (extensionCounts[record.extension] || 0) + 1;
  return {
    generatedAt: new Date().toISOString().slice(0, 10),
    scope: 'archive/exams/**/*.js',
    total: records.length,
    productionTotal: records.filter(record => !record.testFixture).length,
    testFixtureTotal: records.filter(record => record.testFixture).length,
    extensionCounts,
    qImageAndInlineTotal: records.filter(record => record.qImagePresent).length,
    validation: {
      relativePathInvalidCount: records.filter(record => !record.relativePathValid).length,
      missingProductionAssetCount: records.filter(record => !record.testFixture && !record.assetExists).length,
      errorCount: errors.length
    },
    records
  };
}

function main() {
  const args = new Set(process.argv.slice(2));
  const write = args.has('--write');
  const check = args.has('--check');
  if (write && check) throw new Error('Choose either --write or --check.');

  const report = buildInlineImageInventoryReport();
  if (report.validation.errorCount) {
    console.error(report.validation);
    for (const message of buildInlineImageInventory().errors) console.error(`FAIL ${message}`);
    process.exitCode = 1;
    return;
  }

  if (write) {
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`Wrote ${path.relative(repoRoot, reportPath)} (${report.total} records)`);
    return;
  }
  if (check) {
    const current = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const { generatedAt: _currentDate, ...currentData } = current;
    const { generatedAt: _reportDate, ...reportData } = report;
    if (JSON.stringify(currentData) !== JSON.stringify(reportData)) {
      console.error('FAIL inline-image inventory differs from current archive assets');
      process.exitCode = 1;
      return;
    }
    console.log(`PASS ${report.total} records; ${report.validation.missingProductionAssetCount} missing production assets`);
    return;
  }
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
