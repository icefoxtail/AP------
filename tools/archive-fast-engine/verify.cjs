const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const cp = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const reports = path.join(root, 'reports/archive-fast-engine-v2');
const readJson = name => JSON.parse(fs.readFileSync(path.join(reports, name), 'utf8'));
const text = name => fs.readFileSync(path.join(reports, name), 'utf8');
const hasPassingTap = name => assert.match(text(name), /# pass \d+[\s\S]*# fail 0/);
const branch = cp.execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim();
const mainHead = cp.execFileSync('git', ['rev-parse', 'origin/main'], { cwd: root, encoding: 'utf8' }).trim();
cp.execFileSync('git', ['merge-base', '--is-ancestor', 'origin/main', 'HEAD'], { cwd: root });
const codeFiles = ['archive/engine.html', 'archive/layout-materializer.js', 'archive/layout-authority.js', 'archive/screen-runtime.js', 'archive/screen-runtime-adapter.js', 'archive/snapshot-contract.js', 'archive/solution-render-executor.js', 'archive/exam-render-executor.js'];
const codeHashes = Object.fromEntries(codeFiles.map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')]));

const phase0 = readJson('phase0-seal.json');
assert.ok(Object.values(phase0.gates).every(value => value === 'PASS'));
for (const [file, expected] of Object.entries(phase0.evidenceHashes)) {
    const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(reports, file))).digest('hex');
    assert.equal(actual, expected, `Phase 0 evidence changed: ${file}`);
}

const phase1a = readJson('phase1a-gates.json');
assert.ok(Object.values(phase1a.gates).every(gate => gate.status === 'PASS'));
for (const name of ['phase1b-gates.json', 'phase1c-gates.json', 'phase1d-gates.json', 'phase2-gates.json', 'phase3-gates.json', 'phase4-gates.json', 'phase5-gates.json', 'phase6-gates.json']) {
    const record = readJson(name);
    const values = Object.values(record.gates || {});
    assert.ok(values.length > 0 && values.every(value => value === 'PASS'), name);
}

const phase7 = readJson('phase7-retirement-review.json');
assert.equal(phase7.decision, 'RETAIN_LEGACY');
assert.equal(phase7.decisionGate, 'PASS');
assert.equal(phase7.telemetry.removalEligible, false);

const primaryBrowser = readJson('main-readiness-regression.json');
assert.equal(primaryBrowser.tests.length, 19);
assert.ok(primaryBrowser.tests.every(test => test.status === 'PASS'));
assert.deepEqual(primaryBrowser.errors, []);
for (const name of ['phase1b-browser.json', 'phase1c-browser.json', 'phase1d-browser.json']) {
    const snapshots = readJson(name);
    assert.equal(snapshots.length, 2, name);
    assert.ok(snapshots.every(snapshot => snapshot.cacheStatus === 'HIT' && snapshot.mathCalls === 0 && snapshot.preflight.pass), name);
}
const prewarm = readJson('phase5-browser.json');
assert.equal(prewarm.length, 2);
assert.ok(prewarm.every(result => result.backgroundPosts === 0 && result.automatic.afterPaint && result.activation.cache === 'HIT'));
const layouts = readJson('phase6-layout-browser.json');
assert.equal(layouts.length, 12);
assert.ok(layouts.every(result => result.parity && result.production.before && result.production.clone === 0));
const legacy = readJson('phase7-legacy-browser.json');
assert.equal(legacy.length, 12);
assert.ok(legacy.every(result => result.math === 0));
assert.ok(legacy.filter(result => ['screen-runtime-legacy', 'renderer-legacy'].includes(result.label)).every(result => result.runtime === false));
assert.ok(legacy.filter(result => result.label === 'observed-layout').every(result => result.runtime && result.layoutProduction === null));

for (const name of ['main-readiness-static.tap', 'phase7-static.tap', 'phase6-static.tap', 'phase5-static.tap', 'phase4-static.tap', 'phase3-static.tap']) hasPassingTap(name);

const readiness = readJson('main-readiness-browser.json');
assert.equal(readiness.version, '20260911.5');
assert.equal(readiness.results.length, 2);
assert.ok(readiness.results.every(result => result.warmScriptCount === 10 && result.header.value === 'ABC' && result.header.committed === 'ABC' && result.header.candidate === 'ABC' && result.clipping.colClass === 'grid-col sol-grid-col' && result.clipping.colOverflow === 'visible' && result.clipping.boxOverflowX === 'visible' && result.clipping.spills && result.qr.submit.candidate === false && result.qr.solution.candidate === false));

const engine = fs.readFileSync(path.join(root, 'archive/engine.html'), 'utf8');
const re = new RegExp('<script\\b[^>]*>([\\s\\S]*?)<\\/script>', 'g');
let match, inlineCount = 0;
while ((match = re.exec(engine))) {
    if (match[1].trim()) { new vm.Script(match[1]); inlineCount += 1; }
}
const syntaxFiles = [
    'archive/render-state-normalizer.js', 'archive/screen-runtime.js', 'archive/screen-runtime-adapter.js',
    'archive/side-effect-ledger.js', 'archive/snapshot-contract.js', 'archive/layout-authority.js',
    'archive/layout-materializer.js', 'archive/mathjax_render_loop.js', 'archive/exam-render-executor.js',
    'archive/solution-render-executor.js', 'tests/archive-layout-browser.cjs', 'tests/archive-legacy-browser.cjs'
];
for (const file of syntaxFiles) cp.execFileSync(process.execPath, ['--check', file], { cwd: root });

const adapter = fs.readFileSync(path.join(root, 'archive/screen-runtime-adapter.js'), 'utf8');
const commit = adapter.slice(adapter.indexOf('    function commit(ctx)'), adapter.indexOf('    function rollback('));
assert.doesNotMatch(commit, /\bawait\b|requestAnimationFrame|setTimeout|\bfetch\s*\(|getBoundingClientRect|offsetWidth|scrollHeight/);
assert.match(adapter, /layoutPlannerMode: \(\) => new URL\(candidate\.environment\.url\)\.searchParams\.get\('layoutPlanner'\) === 'observed' \? 'observed' : 'authority'/);
assert.match(engine, /runtimeParams\.get\('screenRuntime'\) !== 'legacy' && runtimeParams\.get\('renderer'\) !== 'legacy'/);
assert.match(engine, /type: 'PRINT_STALE_REBUILD'/);
for (const script of ['mathjax_render_loop', 'layout-authority', 'layout-materializer', 'solution-render-executor', 'exam-render-executor', 'render-state-normalizer', 'side-effect-ledger', 'screen-runtime', 'snapshot-contract', 'screen-runtime-adapter']) {
    assert.match(engine, new RegExp(`${script.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\.js\\?v=20260911\\.5`));
}
assert.match(adapter, /archive-fast-phase6-20260911\.5/);
assert.match(adapter, /measured-production-v1-20260911\.5/);

const scope = readJson('execution-scope.json');
assert.equal(scope.mergeToMain, false);
assert.equal(scope.pushToMain, false);
assert.equal(branch, scope.branch);

const audit = {
    result: 'PASS',
    checkedAt: new Date().toISOString(),
    branch,
    mergedOriginMain: mainHead,
    codeHashes,
    phases: {
        phase0: '10/10 PASS', phase1A: '18/18 PASS', phase1B: 'PASS', phase1C: 'PASS',
        phase1D: 'PASS', phase2: 'PASS', phase3: 'PASS', phase4: 'PASS', phase5: 'PASS',
        phase6: 'PASS', phase7: 'PASS (RETAIN_LEGACY)'
    },
    browser: { primaryScenarios: 19, snapshotProfiles: 6, layoutComparisons: 12, legacyCases: 12, headerCacheProfiles: 2, qrDesiredStateProfiles: 2 },
    staticTapFiles: ['main-readiness-static.tap', 'phase3-static.tap', 'phase4-static.tap', 'phase5-static.tap', 'phase6-static.tap', 'phase7-static.tap'],
    syntax: { externalFiles: syntaxFiles.length, inlineScripts: inlineCount },
    delivery: 'origin/main is merged into the feature branch; feature branch only is pushed; no merge or push to main'
};
fs.writeFileSync(path.join(reports, 'final-audit.json'), JSON.stringify(audit, null, 2));
console.log(`Final audit PASS: ${branch}; ${codeFiles.length} runtime source hashes recorded`);
