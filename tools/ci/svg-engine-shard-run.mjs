// Runs one deterministic share of the SVG engine tests (archive/tools/geometry-equation) for CI.
//   node tools/ci/svg-engine-shard-run.mjs --suite py|node --shard <i>/<n> --out <dir> [--jobs 4] --tests <dir/glob> [--tests ...]
// --tests (repeatable) names the test files as one-level globs such as dir/*.test.mjs. The workflow owns that list
// (tests/test-inventory.json points at it), so adding a test file under a listed folder needs no change here.
// - py:   each test_*.py module runs as its own `python -m unittest -v <module>` process, <jobs> at a time.
//         Result: <out>/py-<i>.json (one record per module); the module output goes to stdout in log groups.
// - node: one `node --test` over the share's files. Result: <out>/node-<i>.tap; the spec output goes to stdout.
// The split is tools/ci/test-shard.cjs (union == everything, no overlap). tools/ci/svg-engine-test-durations.json is only
// a balancing hint: a missing or stale name is placed with the default weight and never dropped.
// Exit code: 0 only when every selected test passed. Nothing is skipped or isolated here.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);
const {parseShardArg, loadDurations, selectShard} = require('./test-shard.cjs');
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..', '..');

const args = process.argv.slice(2);
const arg = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; };
const suite = arg('--suite');
const shard = parseShardArg(arg('--shard', '1/1'));
const out = path.resolve(arg('--out', '.'));
const jobs = Number(arg('--jobs', '4'));
const patterns = args.flatMap((a, i) => (a === '--tests' ? [args[i + 1]] : []));
if (!['py', 'node'].includes(suite)) throw new Error('usage: --suite py|node');
if (!patterns.length) throw new Error('usage: at least one --tests <dir/glob>');

// One-level glob (the directory part has no wildcard). Returns repo-relative posix paths, sorted.
const escapeRe = text => text.replace(/[.+^${}()|[\]\\]/g, '\\$&');
const expand = pattern => {
  const dir = path.posix.dirname(pattern);
  const re = new RegExp('^' + pattern.slice(dir.length + 1).split('*').map(escapeRe).join('.*') + '$');
  return fs.readdirSync(path.join(repo, dir)).filter(f => re.test(f)).sort().map(f => `${dir}/${f}`);
};
const selected = [...new Set(patterns.flatMap(expand))];
if (!selected.length) throw new Error(`no test files match ${patterns.join(' ')}`);

fs.mkdirSync(out, {recursive: true});
const durations = loadDurations(path.join(here, 'svg-engine-test-durations.json'));
const share = names => selectShard(names.map(name => ({name: `${suite}:${name}`, raw: name})), shard, durations).map(item => item.raw);
const files = share(selected);
console.log(`${suite} shard ${shard.index}/${shard.total}: ${files.length} of ${selected.length} files`);

if (suite === 'node') {
  const child = spawn(process.execPath, ['--test', `--test-concurrency=${jobs}`, '--test-reporter=spec', '--test-reporter-destination=stdout',
    '--test-reporter=tap', `--test-reporter-destination=${path.join(out, `node-${shard.index}.tap`)}`, ...files], {cwd: repo, stdio: 'inherit'});
  child.on('exit', code => process.exit(code ?? 1));
} else {
  // Each module is imported by name with its folder as the working directory (the tests add their own parent to sys.path).
  const run = file => new Promise(resolve => {
    const module = path.posix.basename(file, '.py');
    const started = Date.now();
    const child = spawn(process.env.GEOMETRY_PYTHON || 'python', ['-X', 'utf8', '-m', 'unittest', '-v', module],
      {cwd: path.join(repo, path.posix.dirname(file)), env: {...process.env, PYTHONUTF8: '1'}});
    let text = '';
    child.stdout.on('data', d => { text += d; });
    child.stderr.on('data', d => { text += d; });
    child.on('error', error => resolve({module, file, code: -1, seconds: 0, ran: 0, failed: [], note: String(error)}));
    child.on('close', code => {
      const ran = /^Ran (\d+) tests?/m.exec(text);
      const failed = [...text.matchAll(/^(?:FAIL|ERROR): (.+)$/gm)].map(m => m[1]);
      process.stdout.write(`::group::${module} (${((Date.now() - started) / 1000).toFixed(0)}s, rc ${code})\n${text}\n::endgroup::\n`);
      resolve({module, file, code, seconds: Math.round((Date.now() - started) / 100) / 10, ran: ran ? Number(ran[1]) : 0, failed, note: ran ? '' : 'no tests ran (import failure or crash)'});
    });
  });
  const results = [];
  const queue = [...files];
  await Promise.all(Array.from({length: Math.max(1, jobs)}, async () => { while (queue.length) results.push(await run(queue.shift())); }));
  results.sort((a, b) => a.module.localeCompare(b.module));
  fs.writeFileSync(path.join(out, `py-${shard.index}.json`), JSON.stringify({suite: 'py', shard, results}, null, 1));
  const bad = results.filter(r => r.code !== 0);
  console.log(`py shard ${shard.index}/${shard.total}: ${results.reduce((a, r) => a + r.ran, 0)} tests, ${bad.length} failing modules`);
  process.exit(bad.length ? 1 : 0);
}
