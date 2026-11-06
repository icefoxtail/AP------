#!/usr/bin/env node
// Technical checks for the original sources selected by the immutable CI diff.
// No answer evaluation, mathematical review, or metadata approval is performed.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import core from '../archive2-core.js';
import { verifyRegistration } from './verify-archive-registration.mjs';
import { loadSource, questionAssetReferences, localAssetPath } from './archive-content-inputs.mjs';
export { loadSource, questionAssetReferences, localAssetPath } from './archive-content-inputs.mjs';
import { readScope } from '../../tools/ci/archive-ci-scope.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

export function parseSvg(file) {
  // ElementTree parses XML without fetching external entities. Browser checks also
  // require these exact bytes to load successfully in the actual output engine.
  const result = spawnSync('python3', ['-c',
    `import sys,json,re,xml.etree.ElementTree as E
r=E.parse(sys.argv[1]).getroot()
assert r.tag.split('}')[-1]=='svg', 'SVG root required'
ids=[e.attrib['id'] for e in r.iter() if 'id' in e.attrib]
assert len(ids)==len(set(ids)), 'duplicate SVG id'
refs=[]
for e in r.iter():
 for key,value in e.attrib.items():
  if key.split('}')[-1]=='href': refs.append(value)
  refs.extend(re.findall(r'url\\(\\s*[\\"\\\']?([^\\s\\"\\\')]+)',value))
for ref in refs:
 if ref.startswith('#'): assert ref[1:] in ids, 'missing SVG fragment '+ref
print(json.dumps([ref for ref in refs if not ref.startswith('#')]))`, file],
  { encoding: 'utf8', timeout: 10000 });
  if (result.error || result.status !== 0) throw new Error('SVG XML parse failed: ' + file + ': ' + (result.error?.message || result.stderr));
  return JSON.parse(result.stdout);
}

export function verifyContentScope({ root = ROOT, scope, checkRegistration = verifyRegistration, svgParser = parseSvg }) {
  if (scope?.mode !== 'archive-content' || !scope.sources?.length) throw new Error('proven Archive content scope required');
  const sourceFiles = scope.sources.map(source => source.slice('archive/exams/'.length));
  const registration = checkRegistration({ root, sources: sourceFiles });
  const catalog = core.decodeCatalog(JSON.parse(fs.readFileSync(path.join(root, 'archive/data/archive2-catalog.json'), 'utf8')));
  const bySource = new Map();
  for (const row of catalog.records || []) {
    const key = core.normalizeFile(row.sourceFile);
    if (!bySource.has(key)) bySource.set(key, []);
    bySource.get(key).push(row);
  }
  const assets = new Set(scope.assets || []);
  const sources = [];
  for (const source of scope.sources) {
    const { questions, sourceSha256 } = loadSource(root, source);
    const records = (bySource.get(core.normalizeFile(source)) || []).sort((a, b) => Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
    if (records.length !== questions.length) throw new Error('source/catalog question count mismatch: ' + source);
    let hasSolution = false;
    let remoteReferences = 0;
    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index];
      if (question.questionUid && question.questionUid !== records[index].questionUid) throw new Error('source/Consumer UID mismatch: ' + source + '#' + (index + 1));
      const fingerprint = sha256(JSON.stringify({ content: question.content ?? null,
        choices: Array.isArray(question.choices) ? question.choices : null, answer: question.answer ?? null,
        solution: question.solution ?? null, image: question.image ?? null }));
      if (records[index].sourceFingerprint !== fingerprint) throw new Error('source/projection VERSION_MISMATCH: ' + source + '#' + (index + 1));
      // An old metadata approval fingerprint is not a final-review certificate
      // for this input. Preserve the catalog's existing SOURCE_ONLY/HOLD policy;
      // only the current source/projection binding is a technical assertion here.
      hasSolution ||= Boolean(question.solution || question.solutionImage || question.solutionImageRef);
      for (const reference of questionAssetReferences(question)) {
        const local = localAssetPath(reference);
        if (local) assets.add(local); else remoteReferences += 1;
      }
    }
    sources.push({ source, sourceSha256, questions: questions.length, modes: hasSolution ? ['exam', 'sol'] : ['exam'], remoteReferences });
  }
  const assetResults = [];
  const pendingAssets = [...assets].sort();
  const visitedAssets = new Set();
  for (const asset of pendingAssets) {
    if (visitedAssets.has(asset)) continue;
    visitedAssets.add(asset);
    if (!asset.startsWith('archive/assets/') || asset.split('/').includes('..')) throw new Error('invalid asset path: ' + asset);
    const absolute = path.join(root, asset);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile() || fs.statSync(absolute).size === 0) throw new Error('required image missing or empty: ' + asset);
    if (/\.svg$/i.test(asset)) for (const reference of svgParser(absolute) || []) {
      if (/^(?:data:|blob:|https?:\/\/|\/\/)/i.test(reference)) continue;
      const resolved = new URL(reference, 'https://archive.invalid/' + asset);
      if (resolved.origin !== 'https://archive.invalid') throw new Error('unsupported SVG reference: ' + asset);
      const nested = decodeURIComponent(resolved.pathname).slice(1);
      if (!nested.startsWith('archive/assets/')) throw new Error('SVG reference escapes Archive assets: ' + asset);
      pendingAssets.push(nested);
    }
    assetResults.push({ path: asset, sha256: sha256(fs.readFileSync(absolute)) });
  }
  return { status: 'TECHNICAL_PASS', headSha: scope.headSha, baseSha: scope.baseSha, registration, sources, assets: assetResults,
    browserStatus: 'NOT_RUN', mathematicalReview: 'NOT_RUN' };
}

function main() {
  const [flag, scopeFile] = process.argv.slice(2);
  if (flag !== '--scope' || !scopeFile) throw new Error('usage: verify-archive-content-scope.mjs --scope <plan>');
  console.log(JSON.stringify(verifyContentScope({ scope: readScope(scopeFile, ROOT) }), null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
