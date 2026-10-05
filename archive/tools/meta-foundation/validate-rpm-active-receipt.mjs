#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateMetaFinalization, validateR2EReceipt, validateResolverEvidence, makeMetaValidatorReceipt } from './rpm-active-resolver.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const args = process.argv.slice(2);
const value = name => { const at = args.indexOf(`--${name}`); return at < 0 ? '' : args[at + 1] || ''; };
const read = file => JSON.parse(fs.readFileSync(path.resolve(ROOT, file), 'utf8'));
const write = (file, data) => fs.writeFileSync(path.resolve(ROOT, file), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
const r2eFile = value('r2e-receipt');
const finalizationFile = value('finalization');
const resolverFile = value('resolver-evidence');
if ([r2eFile, finalizationFile, resolverFile].filter(Boolean).length !== 1) {
  throw new Error('Usage: validate-rpm-active-receipt.mjs (--r2e-receipt <json> | --finalization <json> | --resolver-evidence <json>)');
}

let result;
if (r2eFile) {
  result = validateR2EReceipt(read(r2eFile), { repoRoot: ROOT });
} else if (finalizationFile) {
  const input = read(finalizationFile);
  const preflight = validateMetaFinalization({ ...input, requireValidatorReceipt: false, repoRoot: ROOT });
  if (preflight.status === 'PASS' && args.includes('--write-validator-receipt')) {
    const receipt = makeMetaValidatorReceipt(input.resolverEvidence, preflight);
    write(value('write-validator-receipt'), receipt);
    result = validateMetaFinalization({ ...input, validatorReceipt: receipt, repoRoot: ROOT });
  } else result = validateMetaFinalization({ ...input, repoRoot: ROOT });
} else {
  const input = read(resolverFile);
  result = validateResolverEvidence(input.input, input.resolverEvidence, { repoRoot: ROOT });
}
console.log(JSON.stringify({ validatorId: 'rpm-active-resolver-v1', ...result }, null, 2));
if (result.status !== 'PASS') process.exitCode = 1;
