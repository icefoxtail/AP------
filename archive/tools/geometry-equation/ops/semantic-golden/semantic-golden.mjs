// Semantic golden runner: one table (table.json) of figures a student would read wrongly, one runner.
//   node archive/tools/geometry-equation/ops/semantic-golden/semantic-golden.mjs [--ids a,b] [--table file.json] [--neutralize name,name]
// Per row: the generator verdict (the plan made into a figure or a refusal, compared with `expect`) and, when the row names an observer, each named mutation of the
// normal figure fed to that observer, which has to refuse it with exactly the row's code. The checks are the engine's own observers and tests, called as they are.
// Exit: 0 every check as expected (known gaps are listed apart, never counted as a pass), 1 a check failed, 2 nothing could be run (render dependencies missing).
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../../../..');
export const DEFAULT_TABLE = path.join(here, 'table.json');

// What the table may name. The python registry (semantic_golden.py) must list the same names: semantic-golden.test.mjs compares them.
export const GENERATOR_KINDS = ['math-label-serialize', 'exp-label-tex', 'region-fixture', 'angle-fixture', 'axis-titles-model', 'axis-value-layout', 'construction-marks'];
export const OBSERVER_MUTATIONS = {
  'exp-formula-glyphs': ['glue-exp-factor'],
  'angle-label': ['degree-label-add-pi'],
  'region-label': ['area-label-onto-side'],
  'axis-titles': ['rename-axis-title'],
  'layout-capture': ['minus-pi-tick-as-y'],
};
const PYTHON_OBSERVERS = new Set(['exp-formula-glyphs', 'angle-label', 'region-label', 'axis-titles']);
const CODE = /^[A-Z][A-Z0-9_]*$/;

export const codeMatches = (actual, expected) => typeof actual === 'string' && (actual === expected || actual.startsWith(expected + ':'));

// ---------------------------------------------------------------------------------------------------------------- table
export function loadTable(file = DEFAULT_TABLE) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// the format of the table, with no engine code and no dependency: every problem as a string
export function validateTable(table, {baseDir = here, root = repo} = {}) {
  const problems = [];
  if (!table || table.schema !== 'semantic-golden-table-v1' || !Array.isArray(table.rows)) return ['table: schema semantic-golden-table-v1 and rows[] required'];
  const seen = new Set();
  for (const [index, row] of table.rows.entries()) {
    const at = `row ${index}${row && row.id ? ' (' + row.id + ')' : ''}`;
    if (!row || typeof row !== 'object') { problems.push(`${at}: not an object`); continue; }
    if (typeof row.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(row.id)) problems.push(`${at}: id must be kebab-case`);
    else if (seen.has(row.id)) problems.push(`${at}: duplicate id`);
    else seen.add(row.id);
    if (typeof row.defect !== 'string' || row.defect.length < 10) problems.push(`${at}: defect (what the student would read wrongly) required`);
    if (!Array.isArray(row.reuses) || row.reuses.length === 0) problems.push(`${at}: reuses[] required (the existing test or observer this row stands on; no second copy of a check)`);
    else for (const file of row.reuses) if (!fs.existsSync(path.join(root, file))) problems.push(`${at}: reuses ${file} does not exist`);
    if (typeof row.plan === 'string') { if (!fs.existsSync(path.join(baseDir, row.plan))) problems.push(`${at}: plan file ${row.plan} does not exist`); }
    else if (!row.plan || typeof row.plan !== 'object' || Array.isArray(row.plan)) problems.push(`${at}: plan must be an object or a path`);
    if (row.planPatch !== undefined && (typeof row.planPatch !== 'object' || row.planPatch === null)) problems.push(`${at}: planPatch must be an object`);
    if (!row.generator || !GENERATOR_KINDS.includes(row.generator.kind)) problems.push(`${at}: generator.kind must be one of ${GENERATOR_KINDS.join(', ')}`);
    if (typeof row.expect !== 'string' || !(row.expect === 'PASS' || (row.expect.startsWith('REJECT:') && CODE.test(row.expect.slice(7))))) problems.push(`${at}: expect must be PASS or REJECT:<CODE>`);
    if (row.observer !== undefined) {
      const names = row.observer && OBSERVER_MUTATIONS[row.observer.kind];
      if (!names) problems.push(`${at}: observer.kind must be one of ${Object.keys(OBSERVER_MUTATIONS).join(', ')}`);
      if (!Array.isArray(row.mutations) || row.mutations.length === 0) problems.push(`${at}: an observer row needs mutations[]`);
      else for (const [m, entry] of row.mutations.entries()) {
        const where = `${at} mutation ${m}`;
        if (!entry || typeof entry.name !== 'string' || (names && !names.includes(entry.name))) problems.push(`${where}: name must be one of ${names ? names.join(', ') : '(no observer)'}`);
        if (!entry || typeof entry.expect !== 'string' || !CODE.test(entry.expect)) problems.push(`${where}: expect must be the observer's refusal code`);
        if (entry && entry.knownGap !== undefined && (typeof entry.knownGap !== 'string' || entry.knownGap.length < 10)) problems.push(`${where}: knownGap must say why the observer does not refuse it (10+ chars)`);
        if (entry && entry.args !== undefined && (typeof entry.args !== 'object' || entry.args === null)) problems.push(`${where}: args must be an object`);
      }
    } else if (row.mutations !== undefined) problems.push(`${at}: mutations without an observer`);
  }
  return problems;
}

function setPath(object, dotted, value) {
  const keys = dotted.split('.');
  let node = object;
  for (const key of keys.slice(0, -1)) {
    if (node[key] === undefined) throw new Error(`planPatch: ${dotted} does not exist in the plan`);
    node = node[key];
  }
  if (node[keys.at(-1)] === undefined && !Array.isArray(node)) { /* a new field is allowed */ }
  node[keys.at(-1)] = value;
}

export function resolvePlan(row, baseDir = here) {
  const plan = typeof row.plan === 'string' ? JSON.parse(fs.readFileSync(path.join(baseDir, row.plan), 'utf8')) : structuredClone(row.plan);
  for (const [dotted, value] of Object.entries(row.planPatch || {})) setPath(plan, dotted, value);
  return plan;
}

// ---------------------------------------------------------------------------------------------------------------- environment
async function pythonEnv() {
  const env = {...process.env};
  if (!env.PYTHONPATH) {
    try { const {dependencyRoot} = await import('../../production/dependencies.mjs'); env.PYTHONPATH = path.join(dependencyRoot, 'python'); } catch { /* no dependencies */ }
  }
  return env;
}

export async function hasPythonDeps() {
  try {
    const run = spawnSync(process.env.GEOMETRY_PYTHON || process.env.PYTHON || 'python', ['-c', 'import importlib.util,sys;sys.exit(0 if importlib.util.find_spec("sympy") else 1)'], {env: await pythonEnv(), stdio: 'ignore'});
    return run.status === 0;
  } catch { return false; }
}

async function pythonPhase(phase, rows, neutralize) {
  if (rows.length === 0) return [];
  const run = spawnSync(process.env.GEOMETRY_PYTHON || process.env.PYTHON || 'python', ['-X', 'utf8', path.join(here, 'semantic_golden.py')],
    {input: JSON.stringify({phase, rows, neutralize}), encoding: 'utf8', env: await pythonEnv(), maxBuffer: 64 * 1024 * 1024});
  if (run.status !== 0) throw new Error(`semantic_golden.py ${phase} failed: ${String(run.stderr).slice(-1500)}`);
  return JSON.parse(run.stdout);
}

// the glyph svg MathJax makes of a TeX string (the same typesetter the figures use), so the normal label is a drawn one
async function typeset(tex) {
  const {dependency} = await import('../../production/dependencies.mjs');
  const {mathjax} = dependency('mathjax-full/js/mathjax.js'); const {TeX} = dependency('mathjax-full/js/input/tex.js'); const {SVG} = dependency('mathjax-full/js/output/svg.js');
  const {liteAdaptor} = dependency('mathjax-full/js/adaptors/liteAdaptor.js'); const {RegisterHTMLHandler} = dependency('mathjax-full/js/handlers/html.js');
  const adaptor = liteAdaptor(); RegisterHTMLHandler(adaptor);
  const doc = mathjax.document('', {InputJax: new TeX(), OutputJax: new SVG({fontCache: 'none'})});
  return adaptor.outerHTML(adaptor.firstChild(doc.convert(tex, {display: false})));
}

// ---------------------------------------------------------------------------------------------------------------- generators on the node side
async function generatorOnNode(row, plan) {
  if (row.generator.kind === 'construction-marks') {
    const {pythonWorker} = await import('../../production/worker.mjs');
    const {specFor} = await import('../../production/phase2.mjs');
    const {assetIdentity} = await import('../../production/contracts.mjs');
    const identity = assetIdentity('l1_unit_exam|1', 'SOLUTION_VISUAL', 'decisive-relation');
    const response = await pythonWorker({action: 'construction', graph: plan.mathPlan}, {timeoutMs: 90000});
    if (response.status !== 'OK') return {verdict: 'REJECT', code: 'CONSTRUCTION_MODEL_' + JSON.stringify(response.result).slice(0, 80), facts: {}};
    try { specFor(plan, response.result, identity.assetId); } catch (error) { return {verdict: 'REJECT', code: String(error.message), facts: {}}; }
    return {verdict: 'PASS', code: null, facts: {}};
  }
  throw new Error('no node generator ' + row.generator.kind);
}

// ---------------------------------------------------------------------------------------------------------------- the run
const compare = (verdict, expect) => expect === 'PASS' ? verdict.verdict === 'PASS' : verdict.verdict === 'REJECT' && codeMatches(verdict.code, expect.slice(7));

export async function runTable(table, {ids, neutralize = [], baseDir = here, root = repo} = {}) {
  const problems = validateTable(table, {baseDir, root});
  if (problems.length) return {format: problems, rows: []};
  const rows = table.rows.filter(row => !ids || ids.includes(row.id)).map(row => ({...row, plan: resolvePlan(row, baseDir)}));
  const results = new Map(rows.map(row => [row.id, {id: row.id, defect: row.defect, expect: row.expect, generator: null, mutations: [], status: 'OK', notes: []}]));
  const note = (row, text) => results.get(row.id).notes.push(text);
  const fail = row => { results.get(row.id).status = 'FAIL'; };

  if (!await hasPythonDeps()) {
    for (const result of results.values()) { result.status = 'NOT_RUN'; result.notes.push('python render dependencies (sympy) are not installed'); }
    return {format: [], rows: [...results.values()]};
  }

  // generator phase
  const pyGenRows = rows.filter(row => row.generator.kind !== 'construction-marks');
  for (const row of pyGenRows) if (row.generator.kind === 'exp-label-tex') {
    const {expLogFormulaText} = await import('../../production/phase2.mjs');
    row.generatedText = expLogFormulaText({family: row.plan.graphPlan.family, base: row.plan.graphPlan.base, shiftX: row.plan.graphPlan.shiftX, coefficients: row.plan.graphPlan.coefficients});
  }
  const generated = new Map();
  for (const out of await pythonPhase('generator', pyGenRows, neutralize)) generated.set(out.id, out);
  for (const row of rows.filter(r => r.generator.kind === 'construction-marks')) generated.set(row.id, await generatorOnNode(row, row.plan));
  for (const row of rows) {
    const out = generated.get(row.id);
    const result = results.get(row.id);
    if (out.crash) { fail(row); note(row, 'generator crashed: ' + out.crash); continue; }
    result.generator = {verdict: out.verdict, code: out.code};
    result.generatorOk = compare(out, row.expect);
    if (!result.generatorOk) { fail(row); note(row, `generator gave ${out.verdict}${out.code ? ':' + out.code : ''}, expected ${row.expect}`); }
    row.facts = out.facts || {};
  }

  // observer phase (a row whose generator verdict is wrong is not observed: its normal figure is not the one the table describes)
  const observed = rows.filter(row => row.observer && results.get(row.id).status === 'OK');
  for (const row of observed) if (row.observer.kind === 'exp-formula-glyphs') row.facts.baseSvg = await typeset(row.facts.tex);
  const pyRows = observed.filter(row => PYTHON_OBSERVERS.has(row.observer.kind));
  const observations = new Map();
  for (const out of await pythonPhase('observer', pyRows, neutralize)) observations.set(out.id, out);
  const layoutCapture = await import('./layout-capture.mjs');
  for (const row of observed.filter(r => r.observer.kind === 'layout-capture')) {
    const box = row.facts.box, base = layoutCapture.axisValueCapture({box: {x: box.x, y: box.y, width: box.width, height: box.height}});
    const prefix = row.observer.codePrefix;
    const entry = {normal: await layoutCapture.observeCapture(base, {codePrefix: prefix}), mutations: []};
    for (const m of row.mutations) {
      try {
        const mutated = neutralize.includes(m.name) ? base : layoutCapture.MUTATIONS[m.name](base, m.args || {});
        entry.mutations.push({name: m.name, errors: await layoutCapture.observeCapture(mutated, {codePrefix: prefix})});
      } catch (error) {
        if (error instanceof layoutCapture.MutationNotApplicable) entry.mutations.push({name: m.name, notApplicable: error.message}); else throw error;
      }
    }
    observations.set(row.id, entry);
  }
  for (const row of observed) {
    const result = results.get(row.id), seen = observations.get(row.id);
    if (!seen || seen.crash) { fail(row); note(row, 'observer crashed: ' + (seen && seen.crash)); continue; }
    if (seen.normal.length) { fail(row); note(row, 'the normal figure is refused by its own observer: ' + seen.normal.join(', ')); }
    row.mutations.forEach((entry, i) => {
      const got = seen.mutations[i] || {};
      const out = {name: entry.name, args: entry.args || {}, expect: entry.expect, errors: got.errors || [], status: 'OK'};
      if (got.error || got.notApplicable) { out.status = 'FAIL'; out.note = got.error || 'not applicable: ' + got.notApplicable; }
      else {
        const hit = got.errors.some(code => codeMatches(code, entry.expect));
        if (entry.knownGap) { out.status = hit ? 'FAIL' : 'KNOWN_GAP'; out.note = hit ? 'the observer now refuses it: remove knownGap from the row' : entry.knownGap; }
        else if (!hit) { out.status = 'FAIL'; out.note = `the observer did not refuse it with ${entry.expect} (it gave ${got.errors.length ? got.errors.join(', ') : 'nothing'})`; }
      }
      result.mutations.push(out);
      if (out.status === 'FAIL') fail(row);
    });
  }
  return {format: [], rows: [...results.values()]};
}

export function summarize(report) {
  const counts = {rows: report.rows.length, checks: 0, pass: 0, fail: 0, knownGap: 0, notRun: 0};
  for (const row of report.rows) {
    if (row.status === 'NOT_RUN') { counts.notRun++; continue; }
    if (row.generator) { counts.checks++; if (row.generatorOk) counts.pass++; else counts.fail++; }
    for (const m of row.mutations) { counts.checks++; if (m.status === 'OK') counts.pass++; else if (m.status === 'KNOWN_GAP') counts.knownGap++; else counts.fail++; }
  }
  return counts;
}

export function exitCode(report) {
  if (report.format.length) return 1;
  const counts = summarize(report);
  if (counts.fail || report.rows.some(row => row.status === 'FAIL')) return 1;
  if (counts.notRun) return 2;
  return 0;
}

export function printReport(report, log = console.log) {
  if (report.format.length) { log('table format errors:'); for (const p of report.format) log('  ' + p); return; }
  for (const row of report.rows) {
    log(`${row.status.padEnd(8)} ${row.id}`);
    if (row.generator) log(`           generator ${row.generator.verdict}${row.generator.code ? ':' + row.generator.code : ''} (expect ${row.expect})`);
    for (const m of row.mutations) log(`           ${m.status.padEnd(9)} ${m.name} ${JSON.stringify(m.args)} -> ${m.errors.join(', ') || '(no refusal)'}${m.status === 'OK' ? '' : '   [' + (m.note || '') + ']'}`);
    for (const n of row.notes) log('           ! ' + n);
  }
  const c = summarize(report);
  log(`semantic golden: ${c.rows} rows, ${c.checks} checks: ${c.pass} pass, ${c.fail} FAIL, ${c.knownGap} KNOWN_GAP (not counted as pass), ${c.notRun} rows NOT_RUN`);
  for (const row of report.rows) for (const m of row.mutations) if (m.status === 'KNOWN_GAP') log(`  KNOWN_GAP ${row.id} / ${m.name}: ${m.note}`);
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const arg = name => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : undefined; };
  const table = loadTable(arg('--table') ? path.resolve(arg('--table')) : DEFAULT_TABLE);
  const report = await runTable(table, {ids: arg('--ids')?.split(','), neutralize: arg('--neutralize')?.split(',') || []});
  printReport(report);
  process.exitCode = exitCode(report);
}
