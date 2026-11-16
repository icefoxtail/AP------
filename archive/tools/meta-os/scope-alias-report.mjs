// Read-only observations; binding lookup is not registration approval.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { curriculumForQuestion } from '../meta-foundation/active-registry.mjs';
import { canonicalCourse, sameCourse, sameUnit } from './scope-alias.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const scope = row => ({ curriculum: row.curriculum || row.curriculumKey || '', course: row.standardCourse || row.courseKey || '', standardUnitKey: row.standardUnitKey || '', sourceArchiveFile: row.sourceArchiveFile || '' });
const add = (obj, key) => { obj[key] = (obj[key] || 0) + 1; };
export function buildScopeAliasReport(records, bindings) {
  const active = bindings.filter(b => b.status === 'ACTIVE');
  const byType = new Map();
  for (const b of active) { const rows = byType.get(b.problemTypeKey) || []; rows.push(b); byType.set(b.problemTypeKey, rows); }
  const observed = {}, byGradeSemester = {}, confidence = {}, unknownAliases = {}, samples = { conflicts: [], unknown: [], recovered: [] };
  let conflictCount = 0, unknownCount = 0;
  const lookup = { eligible: 0, noProblemType: 0, missingCurriculum: 0, exact: 0, alias: 0, missingBefore: 0, missingAfter: 0, ambiguousBefore: 0, ambiguousAfter: 0, preservedExact: 0 };
  for (const row of records) {
    const input = scope(row), c = canonicalCourse(input);
    add(observed, input.course); add(confidence, c.confidence);
    const level = c.courseId?.startsWith('M') ? 'middle' : c.courseId?.startsWith('H') ? 'high' : input.sourceArchiveFile.includes('/middle/') ? 'middle' : input.sourceArchiveFile.includes('/high/') ? 'high' : 'UNKNOWN';
    const group = `${level}/${c.grade ?? 'UNKNOWN'}/${c.semester ?? 'UNKNOWN'}`;
    const g = byGradeSemester[group] ||= { records: 0, exact: 0, alias: 0, missingBefore: 0, missingAfter: 0 };
    g.records++;
    const sample = { questionUid: row.questionUid, ...input, canonical: c };
    if (c.conflict || c.confidence === 'CONFLICT') { conflictCount++; if (samples.conflicts.length < 10) samples.conflicts.push(sample); }
    if (c.unknownAlias || c.confidence === 'UNKNOWN_ALIAS') { unknownCount++; add(unknownAliases, input.course); if (samples.unknown.length < 10) samples.unknown.push(sample); }
    if (!row.problemTypeKey) { lookup.noProblemType++; continue; }
    lookup.eligible++;
    if (!input.curriculum) lookup.missingCurriculum++;
    const pool = (byType.get(row.problemTypeKey) || []).filter(b => b.curriculum === input.curriculum && (b.subUnitKey ?? null) === (row.subUnitKey ?? null));
    const exact = pool.filter(b => b.standardUnitKey === input.standardUnitKey && b.standardCourse === input.course);
    if (exact.length) { lookup.exact++; lookup.preservedExact++; g.exact++; if (exact.length > 1) lookup.ambiguousBefore++; continue; }
    lookup.missingBefore++; g.missingBefore++;
    const aliases = pool.filter(b => sameCourse(input, scope(b)) && sameUnit(input, scope(b)));
    if (aliases.length === 1) { lookup.alias++; g.alias++; if (samples.recovered.length < 10) samples.recovered.push({ ...sample, binding: aliases[0] }); }
    else { lookup.missingAfter++; g.missingAfter++; if (aliases.length > 1) lookup.ambiguousAfter++; }
  }
  lookup.ambiguousAfter += lookup.ambiguousBefore;
  return { schemaVersion: 'scope-alias-report-v1', mode: 'READ_ONLY_BINDING_LOOKUP', note: 'Same-curriculum/PT/subunit ACTIVE binding lookup only; no metadata mutation, key/pack/parent approval or full registration inferred. UI integration deferred.', records: records.length, observed, confidence, conflictCount, unknownCount, unknownAliases, lookup, byGradeSemester, samples };
}
export function outsideOutput(file, root = ROOT) {
  const output = path.resolve(file);
  let parent = path.dirname(output), suffix = [];
  while (!fs.existsSync(parent)) { suffix.unshift(path.basename(parent)); parent = path.dirname(parent); }
  const resolved = path.join(fs.realpathSync(parent), ...suffix, path.basename(output));
  const realRoot = fs.realpathSync(root);
  if (resolved === realRoot || resolved.startsWith(realRoot + path.sep)) throw new Error('--out must be outside the repository');
  if (fs.existsSync(output) || fs.lstatSync(path.dirname(output), { throwIfNoEntry: false })?.isSymbolicLink()) throw new Error('--out must be a new file in a real directory');
  return output;
}
export function runCli(argv = process.argv.slice(2)) {
  if (argv.length !== 3 || argv[0] !== '--report' || argv[1] !== '--out' || !argv[2]) throw new Error('Usage: scope-alias.mjs --report --out <new file outside repository>');
  const output = outsideOutput(argv[2]);
  const read = relative => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));
  const records = read('archive/data/question_metadata.json').records;
  const bindings = read('archive/data/meta-foundation/compiled/curriculum_bindings.json').bindings;
  const report = buildScopeAliasReport(records, bindings);
  // Existing active-field consumer interpretation is shown separately, not
  // mislabeled as registrar failure or silently used to fill operational rows.
  const consumer = buildScopeAliasReport(records.map(row => ({ ...row, curriculum: curriculumForQuestion(row) })), bindings);
  report.existingConsumerInterpretation = { method: 'active-registry.curriculumForQuestion', lookup: consumer.lookup, byGradeSemester: consumer.byGradeSemester, recovered: consumer.samples.recovered };

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ output, records: report.records, lookup: report.lookup }));
  return report;
}
