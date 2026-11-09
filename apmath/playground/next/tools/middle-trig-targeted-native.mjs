// Isolated observation wrapper. It never edits the pinned product or auditor.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const PRODUCT = 'c45901b8e4d375b7aa73ff291f9cd2af1908f1b1';
const UNIT = 'g9-trig-ratio';
const SCENES = ['std4560Height', 'std3060Mountain', 'quadUnfold2x'];
const VIEWS = ['pc', 'small-mobile'];
const THEMES = ['board', 'paper'];
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const ownPath = fileURLToPath(import.meta.url);
const args = process.argv.slice(2);
const arg = name => { const i = args.indexOf(name); assert(i >= 0 && args[i + 1], `Missing ${name}`); return args[i + 1]; };
const root = path.resolve(arg('--root'));
const out = path.resolve(arg('--out'));
const preflight = args.includes('--preflight');
const git = (...values) => execFileSync('git', values, { cwd: root, encoding: 'utf8' }).trim();
assert.equal(git('rev-parse', 'HEAD'), PRODUCT, 'Product checkout is not the pinned candidate');
assert.equal(git('diff', '--name-only', PRODUCT, '--', 'apmath/playground/next'), '', 'Product/auditor bytes were modified');
assert(!fs.existsSync(path.join(out, 'after', 'report.json')), 'Never reuse an existing run report');
fs.mkdirSync(out, { recursive: true });
const toolsDir = path.join(root, 'apmath/playground/next/tools');
const auditFile = path.join(toolsDir, 'middle-initial-figure-audit.mjs');
const riskFile = path.join(toolsDir, 'middle-initial-interactions.mjs');
const pin = file => {
  const relative = path.relative(root, file);
  const current = fs.readFileSync(file);
  const committed = execFileSync('git', ['show', `${PRODUCT}:${relative}`], { cwd: root });
  assert(current.equals(committed), `Changed pinned source: ${relative}`);
  return { path: relative, sha256: hash(current) };
};
const sources = [pin(auditFile), pin(riskFile)];
const risks = await import(pathToFileURL(riskFile).href);
const before = [...risks.INITIAL_INTERACTION_RISKS[UNIT]];
risks.INITIAL_INTERACTION_RISKS[UNIT].push(...SCENES.filter(id => !before.includes(id)));
assert.deepEqual(risks.INITIAL_INTERACTION_RISKS[UNIT], [...before, ...SCENES.filter(id => !before.includes(id))]);
for (const id of SCENES) assert(risks.needsInitialInteractionCheck(UNIT, { id, index: 999 }));
const forwarded = [auditFile, '--root', root, '--units', UNIT, '--scenes', SCENES.join(','), '--viewports', VIEWS.join(','), '--themes', THEMES.join(','), '--out', path.join(out, 'after')];
const context = { kind: 'PINNED_TRIG_NATIVE_OBSERVATION', productCommit: PRODUCT,
  controllerCommit: process.env.GITHUB_SHA || null, workflowRun: process.env.GITHUB_RUN_ID || null,
  workflowAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
  wrapper: { file: ownPath, sha256: hash(fs.readFileSync(ownPath)) }, pinnedAuditorSources: sources,
  beforeRiskIDs: before, afterRiskIDs: [...risks.INITIAL_INTERACTION_RISKS[UNIT]],
  addedRiskIDs: SCENES.filter(id => !before.includes(id)), argv: forwarded,
  productFilesEdited: false, auditFilesEdited: false, thresholdsChanged: false,
  visualStatus: 'NOT_RUN', automaticStatus: preflight ? 'PREFLIGHT_ONLY' : 'RUNNING', startedAt: new Date().toISOString() };
const save = () => fs.writeFileSync(path.join(out, 'wrapper-context.json'), JSON.stringify(context, null, 2) + '\n');
save();
if (preflight) {
  console.log(JSON.stringify({ preflight: 'PASS', productCommit: PRODUCT, addedRiskIDs: context.addedRiskIDs, actualBrowser: 'NOT_RUN' }));
} else {
  // The unchanged auditor has a CLI guard and a deliberately unexported run().
  // Import the SAME risk-module URL first, then satisfy that guard. The server
  // and this explicit completion loop retain Node until the auditor closes.
  process.argv = [process.argv[0], ...forwarded];
  const deadline = Date.now() + 25 * 60 * 1000;
  const reportPath = path.join(out, 'after', 'report.json');
  try {
    await import(pathToFileURL(auditFile).href);
    let report;
    for (;;) {
      if (fs.existsSync(reportPath)) {
        report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        if (report.finishedAt && report.automaticStatus) break;
      }
      assert(!process.exitCode, 'Auditor reported an error before writing its completed report');
      assert(Date.now() < deadline, 'Auditor did not finish within the wrapper deadline');
      await delay(250);
    }
    assert.equal(report.commit, PRODUCT);
    assert.deepEqual(report.scope.selectedUnits, [UNIT]);
    assert.deepEqual(report.scope.requestedScenes, SCENES);
    assert.deepEqual(report.scope.viewports.map(v => v.name), VIEWS);
    assert.deepEqual(report.scope.themes, THEMES);
    const unit = report.units[UNIT];
    assert.deepEqual([...unit.testedSceneIDs].sort(), [...SCENES].sort());
    for (const id of SCENES) for (const view of VIEWS) for (const theme of THEMES) {
      for (const state of ['first-entry', 'problem-initial', 'review-first', 'interaction-reentry']) {
        assert(unit.captures.some(c => c.id === id && c.view === view && c.theme === theme && c.state === state), `Missing ${id}/${view}/${theme}/${state}`);
      }
      assert(unit.interactions.some(i => i.id === id && i.view === view && i.theme === theme && i.type === 'reentry-after-native-interactions' && i.pass), `Missing successful native lifecycle: ${id}/${view}/${theme}`);
    }
    for (const source of sources) assert.deepEqual(pin(path.join(root, source.path)), source);
    context.automaticStatus = report.automaticStatus;
    context.reportSha256 = hash(fs.readFileSync(reportPath));
    context.captures = unit.captures.length;
    context.finishedAt = new Date().toISOString();
    save();
    assert.equal(report.automaticStatus, 'PASS', 'Auditor checks failed; preserve its original findings');
    assert.equal(report.failures.length, 0);
    assert(!process.exitCode, 'Auditor exit code was not successful');
    console.log(JSON.stringify({ automaticStatus: context.automaticStatus, captures: context.captures, visualStatus: 'NOT_RUN' }));
  } catch (error) {
    context.automaticStatus = 'FAIL'; context.wrapperError = String(error.stack || error); context.finishedAt = new Date().toISOString(); save();
    console.error(error);
    // A launch error before the auditor's try/finally can leave its HTTP server
    // alive. End this failed CI child, retaining every partial report/artifact.
    process.exit(1);
  }
}
