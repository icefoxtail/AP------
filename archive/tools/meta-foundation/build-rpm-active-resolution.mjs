#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildResolverDecisionEvidence } from './rpm-active-resolver.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const args = process.argv.slice(2);
const option = name => { const at = args.indexOf(`--${name}`); return at < 0 ? '' : args[at + 1] || ''; };
const inputFile = option('input');
const outputFile = option('out');
if (!inputFile || !outputFile) throw new Error('Usage: build-rpm-active-resolution.mjs --input <decision-isolated-input.json> --out <resolver-evidence.json>');
const input = JSON.parse(fs.readFileSync(path.resolve(root, inputFile), 'utf8'));
const output = buildResolverDecisionEvidence(input.input || input, { repoRoot: root });
const destination = path.resolve(root, outputFile);
if (!destination.startsWith(`${root}${path.sep}`)) throw new Error('OUTPUT_PATH_ESCAPE');
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.validation.status, disposition: output.resolverEvidence.disposition,
  sourceFingerprint: output.resolverEvidence.sourceFingerprint, inputBundleSha: output.resolverEvidence.inputBundleSha,
  evidenceSha: output.resolverEvidence.evidenceSha, validatorReceipt: output.validatorReceipt?.status || null }, null, 2));
if (output.validation.status !== 'PASS') process.exitCode = 1;
