import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  cleanupGeneratedRun,
  inventoryGeneratedArtifacts,
  writeGeneratedLifecycle,
} from '../tools/archive/generated-artifact-lifecycle.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-generated-lifecycle-'));
  const runDir = path.join(root, 'archive', '_generated', 'test-run');
  fs.mkdirSync(path.join(runDir, 'candidate'), { recursive: true });
  fs.mkdirSync(path.join(runDir, 'pages'), { recursive: true });
  fs.mkdirSync(path.join(runDir, 'reports'), { recursive: true });
  return {
    root,
    runDir,
    cleanup: () => fs.rmSync(root, { recursive: true, force: true }),
  };
}

function writeRunFiles(runDir) {
  fs.writeFileSync(path.join(runDir, 'candidate', 'candidate.js'), 'candidate');
  fs.writeFileSync(path.join(runDir, 'pages', 'page.png'), Buffer.from('page'));
  fs.writeFileSync(path.join(runDir, 'reports', 'debug.json'), '{}');
  fs.writeFileSync(path.join(runDir, 'reports', 'production_promotion_receipt.json'), '{}');
}

test('active generated run is retained when success cleanup is requested', () => {
  const f = fixture();
  try {
    writeRunFiles(f.runDir);
    writeGeneratedLifecycle(f.runDir, {
      runId: 'test-run',
      producer: 'past-exam',
      status: 'ACTIVE',
      tempPaths: ['candidate/candidate.js', 'pages/page.png', 'reports/debug.json'],
      canonicalPaths: ['.lifecycle.json', 'reports/production_promotion_receipt.json'],
    });

    const result = cleanupGeneratedRun({ repoRoot: f.root, runDir: f.runDir, mode: 'success' });

    assert.equal(result.status, 'SKIPPED');
    assert.equal(result.reason, 'RUN_NOT_SUCCEEDED');
    assert.equal(fs.existsSync(path.join(f.runDir, 'candidate', 'candidate.js')), true);
    assert.equal(fs.existsSync(path.join(f.runDir, 'reports', 'debug.json')), true);
  } finally {
    f.cleanup();
  }
});

test('successful generated run removes TEMP files but preserves canonical lineage', () => {
  const f = fixture();
  try {
    writeRunFiles(f.runDir);
    writeGeneratedLifecycle(f.runDir, {
      runId: 'test-run',
      producer: 'past-exam',
      status: 'SUCCEEDED',
      tempPaths: ['candidate/candidate.js', 'pages/page.png', 'reports/debug.json'],
      canonicalPaths: ['.lifecycle.json', 'reports/production_promotion_receipt.json'],
    });

    const result = cleanupGeneratedRun({ repoRoot: f.root, runDir: f.runDir, mode: 'success' });

    assert.equal(result.status, 'CLEANED');
    assert.equal(result.removedFiles, 3);
    assert.ok(result.removedBytes > 0);
    assert.equal(fs.existsSync(path.join(f.runDir, 'candidate', 'candidate.js')), false);
    assert.equal(fs.existsSync(path.join(f.runDir, 'pages', 'page.png')), false);
    assert.equal(fs.existsSync(path.join(f.runDir, 'reports', 'debug.json')), false);
    assert.equal(fs.existsSync(path.join(f.runDir, 'reports', 'production_promotion_receipt.json')), true);
    assert.equal(fs.existsSync(path.join(f.runDir, '.lifecycle.json')), true);
  } finally {
    f.cleanup();
  }
});

test('failed generated run is retained for debug retention', () => {
  const f = fixture();
  try {
    writeRunFiles(f.runDir);
    writeGeneratedLifecycle(f.runDir, {
      runId: 'test-run',
      producer: 'past-exam',
      status: 'FAILED',
      tempPaths: ['candidate/candidate.js', 'pages/page.png', 'reports/debug.json'],
      canonicalPaths: ['.lifecycle.json', 'reports/production_promotion_receipt.json'],
    });

    const result = cleanupGeneratedRun({ repoRoot: f.root, runDir: f.runDir, mode: 'success' });

    assert.equal(result.status, 'SKIPPED');
    assert.equal(result.reason, 'RUN_NOT_SUCCEEDED');
    assert.equal(fs.existsSync(path.join(f.runDir, 'pages', 'page.png')), true);
  } finally {
    f.cleanup();
  }
});

test('cleanup rejects a run outside an exact generated workspace', () => {
  const f = fixture();
  const outside = path.join(f.root, 'archive', 'assets', 'images', 'production');
  try {
    fs.mkdirSync(outside, { recursive: true });
    writeGeneratedLifecycle(outside, {
      runId: 'production',
      producer: 'test',
      status: 'SUCCEEDED',
      tempPaths: [],
      canonicalPaths: ['.lifecycle.json'],
    });

    assert.throws(
      () => cleanupGeneratedRun({ repoRoot: f.root, runDir: outside, mode: 'success' }),
      /GENERATED_RUN_ROOT_REQUIRED/,
    );
  } finally {
    f.cleanup();
  }
});

test('inventory counts generated roots without classifying production assets as generated', () => {
  const f = fixture();
  try {
    const production = path.join(f.root, 'archive', 'assets', 'images', 'production', 'q01.svg');
    fs.mkdirSync(path.dirname(production), { recursive: true });
    fs.writeFileSync(production, '<svg/>');
    fs.writeFileSync(path.join(f.runDir, 'candidate', 'candidate.js'), 'candidate');
    const summary = inventoryGeneratedArtifacts({
      repoRoot: f.root,
      roots: ['archive/_generated', 'archive/exams/_generated', 'archive/tools/logic-visual-audit/reports'],
    });

    const generatedRoot = summary.roots.find((row) => row.root === 'archive/_generated');
    assert.equal(generatedRoot.fileCount, 1);
    assert.equal(summary.totalFiles, 1);
    assert.equal(summary.productionFiles, 0);
  } finally {
    f.cleanup();
  }
});
