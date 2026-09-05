import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeJson, sha256 } from './lib/io.mjs';

const repoRoot = path.resolve(process.cwd());
const root = path.join(repoRoot, 'archive/tools/logic-visual-audit');
const artifactReport = readJson(path.join(root, 'reports/v2-evidence-freeze.json'));
const items = Object.values(artifactReport.items).filter((item) => item.artifactExists);
const results = items.map((item) => inspectArtifact(item));
const pass = results.every((item) => item.pass);
const output = {
  renderQualificationVersion: 'logic-visual-qualification-render-static-v1',
  renderMode: 'SVG_STATIC_RENDER_PROFILE',
  commonCoreDStatus: 'SEPARATE_AUTHORITY',
  pass,
  artifactCount: results.length,
  results,
  reportSha: sha256(results),
  note: 'This qualification profile checks SVG structure and asset/render contracts. It does not replace Common Core D browser render evidence.'
};
writeJson(path.join(root, 'reports/qualification-render.json'), output);
console.log(JSON.stringify({ renderMode: output.renderMode, artifactCount: output.artifactCount, pass: output.pass, reportSha: output.reportSha }, null, 2));
if (!pass) process.exitCode = 1;

function inspectArtifact(item) {
  const absolutePath = path.join(repoRoot, 'archive', item.artifactPath);
  const svg = fs.readFileSync(absolutePath, 'utf8');
  const viewBox = parseNumbers(svg.match(/<svg\b[^>]*\bviewBox=["']([^"']+)["']/i)?.[1]);
  const dimensions = svg.match(/<svg\b[^>]*(?:width|height)=["'][^"']+["']/i)?.[0] ?? '';
  const textNodes = [...svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi)].map((match) => ({ x: number(attr(match[1], 'x')), y: number(attr(match[1], 'y')), text: match[2].replace(/<[^>]+>/g, '').trim() }));
  const finiteText = textNodes.every((node) => Number.isFinite(node.x) && Number.isFinite(node.y));
  const inViewBox = Boolean(viewBox && textNodes.every((node) => node.x >= viewBox[0] - 5 && node.x <= viewBox[0] + viewBox[2] + 5 && node.y >= viewBox[1] - 5 && node.y <= viewBox[1] + viewBox[3] + 5));
  const duplicateTextPositionCount = countDuplicatePositions(textNodes);
  const glyphPass = !svg.includes('�') && !svg.includes('&#xfffd;');
  const assetPass = fs.existsSync(absolutePath) && item.artifactSha === sha256(fs.readFileSync(absolutePath));
  const readingOrderPass = /<title\b[^>]*>/.test(svg) && /<desc\b[^>]*>/.test(svg) && finiteText;
  const clippingPass = Boolean(viewBox && viewBox[2] > 0 && viewBox[3] > 0 && inViewBox);
  const collisionPass = duplicateTextPositionCount === 0;
  const grayscalePass = [...svg.matchAll(/(?:fill|stroke)=["']([^"']+)["']/gi)].every((match) => !match[1].includes('undefined'));
  const checks = { clipping: clippingPass ? 'PASS' : 'FAIL', collision: collisionPass ? 'PASS' : 'FAIL', grayscale: grayscalePass ? 'PASS' : 'FAIL', glyph: glyphPass ? 'PASS' : 'FAIL', assetAssociation: assetPass ? 'PASS' : 'FAIL', readingOrder: readingOrderPass ? 'PASS' : 'FAIL', viewBox: viewBox ? 'PASS' : 'FAIL', dimensions: dimensions ? 'PASS' : 'WARN' };
  return { questionUid: item.questionUid, artifactPath: item.artifactPath, pass: Object.values(checks).every((value) => value !== 'FAIL'), checks, duplicateTextPositionCount, artifactSha: item.artifactSha };
}

function countDuplicatePositions(nodes) {
  const seen = new Set();
  let duplicates = 0;
  for (const node of nodes) {
    const key = `${node.x}:${node.y}`;
    if (seen.has(key)) duplicates += 1;
    seen.add(key);
  }
  return duplicates;
}

function attr(tag, name) {
  return tag.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'))?.[1] ?? null;
}

function number(value) {
  const parsed = Number.parseFloat(value ?? '');
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function parseNumbers(value) {
  return String(value ?? '').match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
}
