#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createMetaDecisionDraft, makeSolutionIdentityDraft } from './lib/completion-evidence.mjs';

function arg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : '';
}

function rawSha(file) {
  return `sha256:${crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}`;
}

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }

function loadQuestions(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 1000 });
  if (!Array.isArray(context.window.questionBank)) throw new Error('CANDIDATE_QUESTION_BANK_REQUIRED');
  return context.window.questionBank;
}

function main() {
  const manifestFile = arg('manifest');
  const candidateFile = arg('candidate');
  const inventoryFile = arg('inventory');
  const outputDir = arg('out-dir');
  if (![manifestFile, candidateFile, inventoryFile, outputDir].every(Boolean)) throw new Error('--manifest --candidate --inventory --out-dir are required');
  const manifest = readJson(path.resolve(manifestFile));
  const questions = loadQuestions(path.resolve(candidateFile));
  const inventory = readJson(path.resolve(inventoryFile));
  if (inventory.status !== 'SOURCE_INVENTORY_FROZEN') throw new Error('SOURCE_INVENTORY_FROZEN_REQUIRED');
  if (questions.length !== (inventory.questions || []).filter(row => row.disposition !== 'EXCLUDED_WITH_EVIDENCE').length) throw new Error('SOURCE_INVENTORY_COVERAGE_FAIL');
  for (const q of questions) {
    if (!String(q.answer || '').trim() || !String(q.solution || '').trim()) throw new Error(`SOLUTION_BUILD_REQUIRED:q${q.id}`);
    if (!String(q.sourceIdentityKey || '').trim()) throw new Error(`SOURCE_IDENTITY_REQUIRED:q${q.id}`);
  }
  const root = path.resolve(process.cwd());
  const destination = path.resolve(outputDir);
  const stagingRoot = path.resolve(root, 'archive/_generated') + path.sep;
  const tempRoot = path.resolve(os.tmpdir()) + path.sep;
  const within = (target, parent) => target.toLowerCase().startsWith(parent.toLowerCase());
  if (!within(destination + path.sep, stagingRoot) && !within(destination + path.sep, tempRoot)) throw new Error('COMPLETION_EVIDENCE_STAGING_ONLY');
  const identityPath = path.join(destination, 'solution_identity_evidence.json');
  const metaPath = path.join(destination, 'meta_decision_evidence.json');
  if (fs.existsSync(identityPath) || fs.existsSync(metaPath)) throw new Error('COMPLETION_EVIDENCE_ALREADY_EXISTS');
  const identity = makeSolutionIdentityDraft({ questions, manifest, inventory });
  const identityBytes = `${JSON.stringify(identity, null, 2)}\n`;
  const identitySha = `sha256:${crypto.createHash('sha256').update(identityBytes, 'utf8').digest('hex')}`;
  const meta = createMetaDecisionDraft({ questions, manifest, inventory, solutionIdentityEvidenceSha: identitySha });
  meta.sourceInventorySha = rawSha(path.resolve(inventoryFile));
  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(identityPath, identityBytes, 'utf8');
  fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
  const result = {
    status: 'DRAFTS_CREATED_REVIEW_REQUIRED',
    solutionIdentityEvidence: path.relative(root, identityPath).replaceAll('\\', '/'),
    solutionIdentityEvidenceSha: rawSha(identityPath),
    metaDecisionEvidence: path.relative(root, metaPath).replaceAll('\\', '/'),
    metaDecisionEvidenceSha: rawSha(metaPath),
    questionCount: questions.length,
    passGranted: false,
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1] || '')) main();
