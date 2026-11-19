// Refresh tools/ci/test-durations.json from the shard result files of a CI run
// (the `test-shard-*` artifacts; each holds durationsMs per test command).
//
//   node tools/ci/refresh-test-durations.mjs --dir <downloaded artifacts> [--out tools/ci/test-durations.json]
//
// The file is only a balancing hint for tools/ci/test-shard.cjs; it can be stale without dropping any test.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readShardResults } from './aggregate-test-shards.mjs';

export function buildDurations(results, previous = {}) {
  const seconds = {};
  for (const result of results) {
    if (result.mode !== 'full') continue; // scoped runs only cover part of the registry
    for (const [name, ms] of Object.entries(result.durationsMs || {})) {
      const value = Math.max(0.1, Math.round(Number(ms) / 100) / 10);
      seconds[name] = Math.max(seconds[name] || 0, value);
    }
  }
  const values = Object.values(seconds).sort((a, b) => a - b);
  // The mean (not the median) is the default for a test the file has not seen: a new test is more likely heavy than trivial.
  const fallback = values.length ? Math.round(values.reduce((n, v) => n + v, 0) / values.length * 10) / 10 : previous.defaultSeconds || 5;
  const sorted = Object.fromEntries(Object.entries(seconds).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
  return { schema: 'archive-test-durations-v1', note: previous.note, defaultSeconds: Math.max(0.5, fallback), seconds: sorted };
}

function main() {
  const args = process.argv.slice(2);
  const option = name => { const at = args.indexOf(name); return at >= 0 ? args[at + 1] : undefined; };
  const dir = option('--dir');
  if (!dir) throw new Error('usage: refresh-test-durations.mjs --dir <dir> [--out <file>]');
  const out = option('--out') || path.join(path.dirname(fileURLToPath(import.meta.url)), 'test-durations.json');
  let previous = {};
  try { previous = JSON.parse(fs.readFileSync(out, 'utf8')); } catch { /* first write */ }
  const next = buildDurations(readShardResults(dir), previous);
  if (!Object.keys(next.seconds).length) throw new Error('no full-run shard result with durations found in ' + dir);
  fs.writeFileSync(out, JSON.stringify(next, null, 1) + '\n');
  const total = Object.values(next.seconds).reduce((n, s) => n + s, 0);
  console.log(`${Object.keys(next.seconds).length} tests, ${Math.round(total)}s total, default ${next.defaultSeconds}s -> ${out}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
