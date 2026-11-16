import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { pathToFileURL } from 'node:url';
import { readProblemInput, readProblemSource, problemIdentity, problemDigest, normalizedInputDigest } from '../../production/problem-plan.mjs';
import { loadBank } from '../../build-visual-render-matrix.mjs';
import { repoRoot } from '../../visual-browser-runtime.mjs';

function expectedQuestion(question, { key, index }, old, asset) {
  const updated = structuredClone(question);
  if (key === 'choices') updated.choices[index] = updated.choices[index].replace(old, asset);
  else updated[key] = updated[key].replace(old, asset);
  if (updated.visualAsset === old) updated.visualAsset = asset;
  if (updated.visualSpec?.assetRef === old) updated.visualSpec.assetRef = asset;
  return updated;
}

function prepareEntry(entry, root) {
  const item = readProblemInput(entry.item);
  const plan = readProblemInput(entry.plan);
  const source = readProblemSource(item, root);
  const receipt = readProblemInput(path.join(entry.out, 'figure-result.json'));
  const svg = fs.readFileSync(path.join(entry.out, 'figure-problem.svg'));
  if (receipt.status !== 'PROBLEM_RENDERED' || receipt.layoutStatus !== 'PASS' ||
      !isDeepStrictEqual(receipt.identity, problemIdentity(item)) ||
      receipt.sourcePath !== item.sourcePath || receipt.ordinal !== item.ordinal ||
      receipt.slot !== item.slot || receipt.assetRef !== item.assetRef ||
      receipt.itemSha256 !== normalizedInputDigest(item) || receipt.planSha256 !== normalizedInputDigest(plan) ||
      receipt.sourceSha256 !== problemDigest(source.code) || receipt.svgSha256 !== problemDigest(svg)) {
    throw Error('PROBLEM_RENDER_RECEIPT_MISMATCH:' + item.sourcePath + ':' + item.ordinal + ':' + item.slot);
  }
  const previous = path.join(root, 'archive', item.assetRef);
  const reuse = fs.existsSync(previous) && fs.readFileSync(previous).equals(svg);
  const asset = reuse ? item.assetRef : item.assetRef.replace(/\.svg$/, '-engine-' + receipt.svgSha256.slice(0, 12) + '.svg');
  const destination = path.join(root, 'archive', asset);
  if (fs.existsSync(destination) && !fs.readFileSync(destination).equals(svg)) {
    throw Error('PROBLEM_ASSET_COLLISION:' + asset);
  }
  return { item, source, svg, asset, destination };
}

export function publishProblemFigures(entries, { root = repoRoot, apply = false } = {}) {
  if (!Array.isArray(entries) || !entries.length) throw Error('PROBLEM_PUBLISH_MANIFEST_EMPTY');
  const exams = new Map();
  const assets = new Map();
  const rows = [];
  for (const entry of entries) {
    const { item, source, svg, asset, destination } = prepareEntry(entry, root);
    if (!exams.has(source.sourceFile)) {
      exams.set(source.sourceFile, { before: source.code, after: source.code, bank: structuredClone(source.bank), seen: new Set() });
    }
    const exam = exams.get(source.sourceFile);
    const slotId = item.ordinal + ':' + item.slot;
    if (exam.seen.has(slotId)) throw Error('DUPLICATE_PROBLEM_SLOT:' + slotId);
    exam.seen.add(slotId);
    exam.after = exam.after.replaceAll(item.assetRef, asset);
    exam.bank[item.ordinal - 1] = expectedQuestion(exam.bank[item.ordinal - 1], source.slot, item.assetRef, asset);
    if (!fs.existsSync(destination)) assets.set(destination, svg);
    rows.push({ sourcePath: item.sourcePath, ordinal: item.ordinal, slot: item.slot, asset, sha256: problemDigest(svg) });
  }
  for (const [file, exam] of exams) {
    if (!isDeepStrictEqual(structuredClone(loadBank(exam.after)), exam.bank)) throw Error('PROBLEM_PUBLISH_FIELD_DRIFT:' + file);
  }
  if (!apply) return { status: 'PROBLEM_PUBLISH_READY', rows };
  const writtenAssets = [];
  const writtenExams = [];
  try {
    for (const [file, svg] of assets) {
      fs.writeFileSync(file, svg, { flag: 'wx' });
      writtenAssets.push(file);
    }
    for (const [file, exam] of exams) {
      if (fs.readFileSync(file, 'utf8') !== exam.before) throw Error('PROBLEM_SOURCE_CHANGED:' + file);
      if (exam.before === exam.after) continue;
      writtenExams.push([file, exam.before]);
      fs.writeFileSync(file, exam.after);
    }
  } catch (error) {
    for (const [file, code] of writtenExams.reverse()) fs.writeFileSync(file, code);
    for (const file of writtenAssets) fs.unlinkSync(file);
    throw error;
  }
  return { status: 'PROBLEM_BOUND', rows };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [manifest, flag] = process.argv.slice(2);
  if (!manifest || (flag && flag !== '--apply')) throw Error('Usage: node publish-problem-figures.mjs manifest.json [--apply]');
  const entries = readProblemInput(manifest);
  console.log(JSON.stringify(publishProblemFigures(entries, { apply: flag === '--apply' }), null, 2));
}
