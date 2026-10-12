import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import core from '../../../../archive/archive2-core.js';

const targets = [
  '19_강남여고_1학기_중간_고2_수학I.js',
  '19_순천여고_1학기_중간_고2_수학I.js',
  '19_제일고_1학기_중간_고2_확률과통계.js',
  '20_매산고_1학기_중간_고2_수학I.js',
  '20_매산여고_1학기_중간_고2_수학I.js',
];
const files = [
  ['archive/data/basic-scope-source-links.json', ['records'], x => x],
  ['archive/data/basic-scope-parent-links.json', ['records', 'sourceParents'], x => x],
  ['archive/data/archive2-catalog.json', ['records'], x => core.decodeCatalog(x)],
];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readCurrent = path => fs.readFileSync(path);
const readBaseline = path => execFileSync('git', ['show', `HEAD:${path}`], { encoding: 'buffer', maxBuffer: 100 * 1024 * 1024 });
const parse = bytes => JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''));
const isTarget = row => targets.some(suffix => String(row.sourceFile || row.file || '').endsWith(suffix));
const rowsMap = rows => new Map(rows.filter(row => !isTarget(row)).map(row => [row.questionUid || `${row.sourceFile}#${row.sourceOrdinal}`, JSON.stringify(row)]));
const results = [];
for (const [path, sections, decode] of files) {
  const baselineBytes = readBaseline(path);
  const currentBytes = readCurrent(path);
  const baseline = decode(parse(baselineBytes));
  const current = decode(parse(currentBytes));
  for (const section of sections) {
    const before = rowsMap(baseline[section] || []);
    const after = rowsMap(current[section] || []);
    const exact = before.size === after.size && [...before].every(([key, value]) => after.get(key) === value);
    results.push({ path, section, baselineNonTargetCount: before.size, currentNonTargetCount: after.size, exact });
  }
}
if (results.some(row => !row.exact)) throw new Error('NON_TARGET_BASIC_SCOPE_PARITY_FAILED');
const currentLinks = parse(readCurrent('archive/data/basic-scope-source-links.json'));
const targetLinks = currentLinks.records.filter(isTarget);
if (targetLinks.length !== 116) throw new Error(`TARGET_SOURCE_LINK_DENOMINATOR:${targetLinks.length}`);
const receipt = {
  schemaVersion: 'JS_ARCHIVE_BASIC_ASSIGNMENT_NON_TARGET_PARITY_RECEIPT_V1',
  baselineGitHead: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  targetExams: targets.map(name => name.replace(/\.js$/, '')),
  targetSourceLinkCount: targetLinks.length,
  checks: results,
  status: 'PASS',
  files: [...new Set(files.map(([path]) => path))].map(path => ({ path, baselineSha256: sha(readBaseline(path)), currentSha256: sha(readCurrent(path)) })),
};
fs.writeFileSync(new URL('./ROOT.basic-assignment-non-target-parity.rev1.json', import.meta.url), `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(receipt, null, 2));
