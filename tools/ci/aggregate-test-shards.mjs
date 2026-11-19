// Aggregate the shard results of the CI `test-shards` matrix into the single `test` verdict.
// A shard that failed, was cancelled, was skipped or left no result file makes the verdict fail,
// so a missing shard can never look like a pass.
//
//   node tools/ci/aggregate-test-shards.mjs --dir <downloaded artifacts> --shards-result <needs.test-shards.result> [--summary <file>]
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SCHEMA = 'archive-test-shard-result-v1';

export function readShardResults(dir) {
  const found = [];
  const walk = current => {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.json')) {
        try {
          const data = JSON.parse(fs.readFileSync(full, 'utf8'));
          if (data && data.schema === SCHEMA) found.push(data);
        } catch { /* a malformed file is a missing result */ }
      }
    }
  };
  walk(dir);
  return found;
}

const seconds = ms => Math.round(Number(ms || 0) / 100) / 10;

export function aggregate({ results, shardsResult }) {
  const problems = [];
  if (shardsResult !== 'success') problems.push(`the test-shards matrix ended "${shardsResult || 'unknown'}"`);
  const of = new Set(results.map(result => result.of));
  const total = [...of][0];
  if (!results.length) problems.push('no shard result was found');
  else if (of.size !== 1) problems.push(`shards disagree on the shard count: ${[...of].join(', ')}`);
  else {
    for (let index = 1; index <= total; index += 1) {
      const count = results.filter(result => result.shard === index).length;
      if (count === 0) problems.push(`shard ${index}/${total} left no result`);
      if (count > 1) problems.push(`shard ${index}/${total} reported ${count} times`);
    }
  }
  // Every shard must have run the same kind of run (full registry or a CI scope).
  const modes = new Set(results.map(result => result.mode));
  if (modes.size > 1) problems.push(`shards disagree on the run mode: ${[...modes].map(String).join(', ')}`);
  // A full run must cover the whole registry exactly: all shards agree on its size and their shares add up to it.
  // (A zero-test shard of a full run, or a shard that silently ran less, can no longer look green.)
  // A scoped run is not compared: a shard may legitimately get no test, and package preparation repeats per shard.
  if (modes.size === 1 && modes.has('full')) {
    const fullTotals = new Set(results.map(result => result.fullTotal));
    const covered = results.reduce((n, result) => n + Number(result.total || 0), 0);
    if (fullTotals.size !== 1 || !Number.isInteger([...fullTotals][0])) problems.push(`shards disagree on the full test count: ${[...fullTotals].map(String).join(', ')}`);
    else if (covered !== [...fullTotals][0]) problems.push(`the shards ran ${covered} test command(s) but the full registry has ${[...fullTotals][0]}`);
    for (const result of results) {
      if (!(Number(result.total) > 0)) problems.push(`shard ${result.shard}/${result.of} ran no test command in a full run`);
    }
  }
  const sorted = [...results].sort((a, b) => a.shard - b.shard);
  const sum = key => sorted.reduce((n, result) => n + (Array.isArray(result[key]) ? result[key].length : 0), 0);
  const passed = sorted.reduce((n, result) => n + Number(result.passed || 0), 0);
  const failedFiles = sorted.flatMap(result => (result.failed || []).map(name => ({ shard: result.shard, name })));
  const knownFailed = sum('knownFailed');
  const commands = sorted.reduce((n, result) => n + Number(result.total || 0), 0);
  if (failedFiles.length) problems.push(`${failedFiles.length} test file(s) failed`);
  const lines = [];
  for (const result of sorted) {
    const wall = Object.values(result.durationsMs || {}).reduce((n, ms) => n + ms, 0);
    lines.push(`shard ${result.shard}/${result.of}: PASS ${result.passed} / FAIL ${(result.failed || []).length} / QUARANTINED-FAIL ${(result.knownFailed || []).length} (total ${result.total}), test time ${seconds(wall)}s`);
  }
  const verdict = `PASS ${passed} / FAIL ${failedFiles.length} / QUARANTINED-FAIL ${knownFailed} (total ${commands})`;
  const ok = problems.length === 0;
  const markdown = [
    `### test: ${ok ? 'PASS' : 'FAIL'}`,
    '', '```', verdict, ...lines, '```',
    ...(failedFiles.length ? ['', 'Failed files:', ...failedFiles.map(file => `- shard ${file.shard}: ${file.name}`)] : []),
    ...(problems.length ? ['', 'Problems:', ...problems.map(problem => `- ${problem}`)] : []),
  ].join('\n') + '\n';
  return { ok, verdict, lines, failedFiles, problems, markdown };
}

function main() {
  const args = process.argv.slice(2);
  const option = name => { const at = args.indexOf(name); return at >= 0 ? args[at + 1] : undefined; };
  const dir = option('--dir');
  if (!dir) throw new Error('usage: aggregate-test-shards.mjs --dir <dir> --shards-result <result> [--summary <file>]');
  const outcome = aggregate({ results: readShardResults(dir), shardsResult: option('--shards-result') });
  console.log(outcome.verdict);
  for (const line of outcome.lines) console.log(line);
  for (const file of outcome.failedFiles) console.error(`  FAIL (shard ${file.shard}) ${file.name}`);
  for (const problem of outcome.problems) console.error(`PROBLEM: ${problem}`);
  const summary = option('--summary') || process.env.GITHUB_STEP_SUMMARY;
  if (summary) fs.appendFileSync(summary, outcome.markdown);
  if (!outcome.ok) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
