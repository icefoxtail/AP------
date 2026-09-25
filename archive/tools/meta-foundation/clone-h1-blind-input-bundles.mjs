#!/usr/bin/env node
/** Clone only sealed input/authority/asset files, never any worker output. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const [sourceArg, targetArg] = process.argv.slice(2);
if (!sourceArg || !targetArg) throw new Error('usage: node clone-h1-blind-input-bundles.mjs SOURCE_ROOT TARGET_ROOT');
const sourceRoot = path.resolve(sourceArg), targetRoot = path.resolve(targetArg);
if (fs.existsSync(targetRoot)) throw new Error(`refusing to overwrite ${targetRoot}`);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const copies = [];
for (const name of fs.readdirSync(sourceRoot).filter(value => /^batch\d+$/.test(value)).sort()) {
  const src = path.join(sourceRoot, name), dst = path.join(targetRoot, name);
  const manifest = JSON.parse(fs.readFileSync(path.join(src, 'bundle-manifest.json'), 'utf8'));
  const listed = [manifest.inputFile, manifest.vocabularyFile, manifest.boundaryAuthorityFile,
    ...(manifest.assets ?? []).map(item => item.path)];
  if (listed.some(value => !value || value.includes('..') || path.isAbsolute(value)))
    throw new Error(`unsafe/absent manifest path ${name}`);
  fs.mkdirSync(path.join(dst, 'output'), { recursive: true });
  for (const relative of listed) {
    const from = path.join(src, relative), to = path.join(dst, relative);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    if (sha(fs.readFileSync(from)) !== sha(fs.readFileSync(to))) throw new Error(`clone hash mismatch ${name}/${relative}`);
  }
  fs.copyFileSync(path.join(src, 'bundle-manifest.json'), path.join(dst, 'bundle-manifest.json'));
  if (sha(fs.readFileSync(path.join(dst, manifest.inputFile))) !== manifest.inputSha256
    || sha(fs.readFileSync(path.join(dst, manifest.vocabularyFile))) !== manifest.vocabularySha256
    || sha(fs.readFileSync(path.join(dst, manifest.boundaryAuthorityFile))) !== manifest.boundaryAuthoritySha256)
    throw new Error(`cloned bundle manifest hash mismatch ${name}`);
  if (fs.readdirSync(path.join(dst, 'output')).length !== 0) throw new Error(`output leaked ${name}`);
  copies.push({ batch: name, count: manifest.count, inputSha256: manifest.inputSha256,
    assets: manifest.assets?.length ?? 0, verdictFilesCopied: 0 });
}
if (copies.length !== 4 || copies.reduce((n, copy) => n + copy.count, 0) !== 67)
  throw new Error('replacement scope coverage mismatch');
console.log(JSON.stringify({ status: 'BLIND_INPUT_ONLY_CLONE', sourceRoot, targetRoot, copies }, null, 2));
