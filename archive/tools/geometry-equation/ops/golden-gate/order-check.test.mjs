// Tests of the order check (lib/order-check.mjs). The scenario and verdict rules are fast; the small render sample needs Chrome and the render dependencies and is skipped without them.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {scenarioItems, scenarioEnv, baseDir, decideOrderCheck, formatTable, orderCheck, REFERENCE, SCENARIO_NAMES, DEFAULT_SOLIDS, DEFAULT_OTHERS} from './lib/order-check.mjs';
import {resolveTarget, ensureSnapshot, MANIFEST} from './lib/snapshot.mjs';
import {resolveChrome} from './lib/env-fingerprint.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');

test('order check scenarios: forward, reversed (non-solids first), every item twice in a row, non-solids alone', () => {
  const S = ['s1', 's2'], O = ['o1', 'o2'];
  assert.deepEqual(scenarioItems('fwd', S, O), ['s1', 's2', 'o1', 'o2']);
  assert.deepEqual(scenarioItems(REFERENCE, S, O), ['s1', 's2', 'o1', 'o2']);
  assert.deepEqual(scenarioItems('rev', S, O), ['o2', 'o1', 's2', 's1']);
  assert.deepEqual(scenarioItems('twice', S, O).map(baseDir), ['s1', 's1', 's2', 's2', 'o1', 'o1', 'o2', 'o2']);
  assert.equal(new Set(scenarioItems('twice', S, O)).size, 8, 'the second render of an item has its own name');
  assert.deepEqual(scenarioItems('alone', S, O), ['o1', 'o2']);
  assert.throws(() => scenarioItems('sideways', S, O));
  assert.deepEqual(scenarioEnv(REFERENCE), {GEOMETRY_WORKER_REUSE: '0', GEOMETRY_BROWSER_REUSE: '0'});
  assert.equal(scenarioEnv('fwd').GEOMETRY_WORKER_REUSE, '1');
});

test('order check defaults: every scenario is a known one and the sample lists real golden items', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(REPO, MANIFEST), 'utf8'));
  const dirs = new Set(manifest.items.map(i => i.dir));
  for (const d of [...DEFAULT_SOLIDS, ...DEFAULT_OTHERS]) assert.ok(dirs.has(d), `${d} is a golden item`);
  assert.ok(DEFAULT_SOLIDS.length >= 4 && DEFAULT_OTHERS.length >= 2);
  for (const n of SCENARIO_NAMES) assert.ok(scenarioItems(n, DEFAULT_SOLIDS, DEFAULT_OTHERS).length > 0);
});

const row = (scenario, item, verdict, more = {}) => ({scenario, item, base: baseDir(item), verdict, status: 'ARCHIVE_BOUND', code: null, svgSha: 'a'.repeat(64), refSvgSha: 'a'.repeat(64), ...more});

test('order check verdict: a differing cell is a leak (exit 1), an item that did not run cannot vouch (exit 2), all equal passes', () => {
  const ok = {rows: [row(REFERENCE, 'x', 'REFERENCE'), row('rev', 'x', 'SAME')], solidsRendered: 1, scenarios: [REFERENCE, 'rev']};
  assert.equal(decideOrderCheck(ok).exit, 0);
  assert.equal(decideOrderCheck({...ok, rows: [...ok.rows, row('rev', 'y', 'DIFF')]}).exit, 1);
  assert.equal(decideOrderCheck({...ok, rows: [...ok.rows, row('rev', 'y', 'NOT_RUN')]}).exit, 2);
  assert.equal(decideOrderCheck({...ok, solidsRendered: 0}).exit, 2, 'no solid drawn: nothing was checked');
  assert.ok(formatTable(ok).length === 2);
});

// A small real sample: two solids and one graph; a fresh python and Chrome per request against the reversed order with the reuse on (one process each; the wide check with every scenario is golden-gate --order-check).
const DEPS = path.join(REPO, '.tmp/apmath-visual-engine/dependencies');
const canRender = Boolean(resolveChrome()) && fs.existsSync(path.join(DEPS, 'node_modules/playwright')) && fs.existsSync(path.join(DEPS, 'python'));
test('order check sample: two solids and a graph come out byte-identical in reversed order (reuse on) and with a fresh python and Chrome per request', {skip: !canRender, timeout: 15 * 60e3}, async () => {
  const cacheRoot = path.join(REPO, '.tmp/golden-gate-test/order-check');
  fs.mkdirSync(cacheRoot, {recursive: true});
  const snap = ensureSnapshot({repo: REPO, target: resolveTarget(REPO, '@worktree'), cacheRoot, depsDir: DEPS});
  const result = await orderCheck({snap, solids: ['item64g1', 'item22'], others: ['item14'], scenarios: [REFERENCE, 'rev'], cacheRoot, depsDir: DEPS, lockDir: path.join(cacheRoot, 'locks')});
  const bad = result.rows.filter(r => r.verdict === 'DIFF' || r.verdict === 'NOT_RUN');
  assert.deepEqual(bad.map(r => `${r.scenario} ${r.item} ${r.verdict}`), []);
  assert.ok(result.solidsRendered >= 1, 'at least one solid figure was drawn, so something was compared');
  assert.equal(decideOrderCheck(result).exit, 0);
});
