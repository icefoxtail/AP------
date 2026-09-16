import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  auditGeneratedRoots,
  auditProductionAssets,
  extractProductionAssetRefs,
  loadProductionExam
} from '../tools/archive/check-generated-git-policy.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const JEILGO_EXAM = 'archive/exams/original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js';

test('global image extension ignores are absent', () => {
  const source = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
  for (const pattern of ['*.png', '*.jpg', '*.jpeg', '*.gif', '*.svg']) {
    assert.equal(source.split(/\r?\n/).includes(pattern), false, pattern);
  }
});

test('new production SVG and PNG are visible while generated copies are hidden', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-git-policy-'));
  try {
    fs.copyFileSync(path.join(ROOT, '.gitignore'), path.join(tempRoot, '.gitignore'));
    execFileSync('git', ['init', '--quiet'], { cwd: tempRoot, stdio: 'ignore' });
    for (const relative of [
      'archive/assets/images/smoke/new.svg',
      'archive/assets/images/smoke/new.png',
      'archive/_generated/smoke/new.svg',
      'archive/_generated/smoke/new.png'
    ]) {
      const absolute = path.join(tempRoot, relative);
      fs.mkdirSync(path.dirname(absolute), { recursive: true });
      fs.writeFileSync(absolute, relative.endsWith('.svg') ? '<svg/>' : 'png-smoke');
    }
    const status = execFileSync('git', ['status', '--short', '--untracked-files=all'], {
      cwd: tempRoot,
      encoding: 'utf8'
    });
    assert.match(status, /archive\/assets\/images\/smoke\/new\.svg/);
    assert.match(status, /archive\/assets\/images\/smoke\/new\.png/);
    assert.doesNotMatch(status, /archive\/_generated\/smoke/);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('2025 제일고 production references are tracked and not ignored', () => {
  const productionPaths = [JEILGO_EXAM];
  const exam = loadProductionExam(ROOT, JEILGO_EXAM);
  assert.equal(exam.examTitle, '25_제일고_2학기_기말_고1_기출');
  assert.ok(extractProductionAssetRefs(exam.source).length > 0);
  assert.deepEqual(auditProductionAssets({ root: ROOT, productionPaths }).errors, []);
});

test('empty production selection fails closed', () => {
  assert.ok(auditProductionAssets({ root: ROOT, productionPaths: [] }).errors.includes('PRODUCTION_JS_SET_EMPTY'));
});

test('generated roots contain no tracked files', () => {
  assert.deepEqual(auditGeneratedRoots({ root: ROOT }).errors, []);
});
