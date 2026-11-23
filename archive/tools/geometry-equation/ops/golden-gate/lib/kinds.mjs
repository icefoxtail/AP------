// Kind (figure type) table: which golden plans a changed engine file can touch.
//
// Rule of the table: a file is listed with specific kinds only when it is used by those kinds and nothing else.
// Everything else that the render reaches is SHARED (-> the whole golden set), and a file this table has never heard
// of is also the whole set (unknown -> all). Files that render-plan.mjs provably cannot reach are NON_RENDER.
// golden-gate.test.mjs freezes this: every file under production/, visual_engine/ and the other render code roots is
// listed explicitly, and the import graph is checked against the kind assignments (see that test).

export const GE = 'archive/tools/geometry-equation';
const P = `${GE}/production`;

// plan capability -> kind. Graph capabilities share the python graph path, so they are one kind.
export const CAPABILITY_KIND = {
  'construction-spike-v1': 'construction',
  'composite-panels-v1': 'composite',
  'quadratic-inequality-chain-v1': 'chain',
  'number-line-figure-v1': 'number-line',
  'solid-figure-v1': 'solid',
  'set-diagram-figure-v1': 'set',
  'stat-chart-figure-v1': 'stat',
  'ellipse-figure-v1': 'ellipse',
  'container-fill-figure-v1': 'container',
  'lattice-path-figure-v1': 'lattice',
  'polynomial-spike-v1': 'graph',
  'rational-spike-v1': 'graph',
  'piecewise-polynomial-spike-v1': 'graph',
  'piecewise-discontinuous-spike-v1': 'graph',
  'sqrt-affine-spike-v1': 'graph',
  'logarithmic-affine-spike-v1': 'graph',
  'exp-log-pair-spike-v1': 'graph',
  'trigonometric-spike-v1': 'graph',
  'multi-curve-figure-v1': 'graph'
};
export const KINDS = [...new Set(Object.values(CAPABILITY_KIND))].sort();

// Short names a person may type after --families (also: any kind name, any capability name, any manifest fam label like STAT_CHART).
export const KIND_ALIASES = {
  statistics: 'stat', 'stat-chart': 'stat', venn: 'set', 'set-diagram': 'set', numberline: 'number-line', line: 'number-line', solids: 'solid',
  graphs: 'graph', function: 'graph', plane: 'construction', coord: 'construction', conic: 'ellipse', 'ineq-chain': 'chain', panels: 'composite'
};

// file (repo relative) -> kinds whose plans it can change. Each entry says why in the comment.
const k = (kinds, files) => Object.fromEntries(files.map(f => [f.startsWith('archive/') ? f : `${P}/${f}`, kinds]));
export const KIND_FILES = {
  // standalone figure kinds: dispatched by capability from render-plan.mjs; panel use in composites is reached through planKinds() (panel capabilities)
  ...k(['stat'], ['stat-chart-v1.mjs', 'stat_chart_observer.py', 'stat-chart-observer-worker.py']),
  ...k(['set'], ['set-diagram-v1.mjs', 'set_diagram_observer.py', 'set-diagram-observer-worker.py']),
  ...k(['ellipse'], ['ellipse-figure-v1.mjs', 'ellipse_figure.py', 'ellipse_figure_observer.py', 'conic_figure.py', 'conic_figure_observer.py']),
  ...k(['lattice'], ['lattice-path-v1.mjs', 'lattice_path_observer.py', 'lattice-path-observer-worker.py']),
  // lattice_path_observer.py imports container_fill_observer.py, so a container observer change reaches lattice plans too
  ...k(['container', 'lattice'], ['container_fill_observer.py']),
  ...k(['container'], ['container-fill-v1.mjs', 'container-fill-observer-worker.py']),
  ...k(['solid'], ['solid-figure-v1.mjs', 'solid_figure_observer.py', 'solid_figure_observer_worker.py', 'orthogonal-square-prism-union.mjs', 'sphere-parts.mjs']),
  // number lines, the inequality chain, solids and composites all run through the one chain/composite path in render-plan.mjs;
  // composite-candidate-svg-v1.mjs also validates every composite caption with number-line-v1.mjs, so these move together.
  ...k(['number-line', 'chain', 'composite', 'solid'], ['number-line-v1.mjs', 'number_line_observer.py', 'number-line-observer-worker.py', 'point_names.py', 'composite-candidate-svg-v1.mjs']),
  // graph python path (worker.py lazily imports graph_spike); the observer files are called by phase2.mjs, which is shared, so they stay SHARED.
  ...k(['graph'], ['graph_spike.py', 'graph_framing.py', 'linear_text.py', 'discontinuous-pair-v1.mjs']),
  ...k(['construction'], ['construction.py'])
};

// Files that import a kind file although they are not part of its kind (or its dispatchers). Each says why the kind assignment still holds.
export const DISPATCHERS = new Set([
  `${P}/render-plan.mjs`, // picks the figure module by plan capability, inside the capability's own branch
  `${P}/standalone-kinds.mjs`, // the table of the five standalone kinds: render-plan.mjs hands them over by capability, each row runs only for its own kind
  `${P}/archive-inverse-observation-v1.mjs`, // only when --packet-dir is given; the gate renders without one
  `${P}/worker.py` // lazy python imports inside the request kind's handler
]);
export const IMPORT_EXCEPTIONS = {
  [`${P}/number-line-v1.mjs`]: [`${P}/quadratic-inequality-chain-v1.mjs`], // the chain is the number-line kind's stacked form (its kinds list carries 'chain')
  [`${P}/number-line-observer-worker.py`]: [`${P}/quadratic-inequality-chain-v1.mjs`], // same: chain plans run the number-line observer
  [`${P}/composite-candidate-svg-v1.mjs`]: [`${P}/construction-archive-capture-v1.mjs`] // capture calls compositePanelBytes only for schemaVersion composite-candidate-svg-v1 (composite, chain, number-line, solid plans)
};

// Files that render-plan.mjs reaches for every kind (or whose reach cannot be told apart by kind): the whole golden set.
const SHARED_PRODUCTION = [
  // added with engine 3: imported across kinds, so a change runs all 209
  'coordinate-frame.mjs', 'polynomial-text.mjs',
  // added with the panels bundle (same rule)
  'number-line-run-together.mjs', 'composite-expand-fields.mjs', 'conic_label_value.py',
  // added with the score gate: render-plan.mjs records a candidate SVG on every observed failure (same rule)
  'score-candidate.mjs',
  // added with S1 (same rule)
  'accessibility-description.mjs', 'wrap-text.mjs', 'accessible_name_observer.py',
  'render-plan.mjs', 'standalone-kinds.mjs', 'worker.mjs', 'worker.py', 'worker_host.py', 'phase2.mjs', 'contracts.mjs', 'dependencies.mjs', 'dependency-lock.json', 'typography.mjs', 'palette.mjs',
  'store.mjs', 'fingerprint.mjs', 'attempt-log.mjs', 'error-guidance.mjs', 'hidden-curve-label.mjs', 'duplicate-key-point.mjs', 'point-name-observer.mjs',
  'point-names.mjs', 'display-envelope.mjs', 'display-profile-audit.mjs', 'construction-archive-capture-v1.mjs', 'construction-candidate-svg-v1.mjs',
  'quadratic-inequality-chain-v1.mjs', // imported by every standalone kind as a frame helper
  'plane-marks.mjs', 'plane-regions.mjs', 'plane-vectors.mjs', 'plane-callouts.mjs', 'plane_regions_observer.py', 'plane-marks-observer-worker.py', 'primitive-observer-worker.py',
  'graph_observer.py', 'graph-observer-worker.py', 'linked_exp_log_detail_observer.py', 'linear-text.mjs', 'polynomial-notation.mjs', 'cindy-observer.mjs',
  'layout-repair.mjs', 'layout-repair-audit.mjs', 'native-solution-overlay.mjs', 'fact-display-map-v1.mjs', 'repair-budget.mjs', 'source-policy.mjs',
  'blinded-review.mjs', 'resolve-request.mjs', 'encoding-adjudication.mjs', 'archive-inverse-observation-v1.mjs',
  // exam batch (the Archive page shared by the figures of one exam): imported by render-plan.mjs and construction-archive-capture-v1.mjs
  'exam-batch.mjs'
];
export const SHARED_FILES = new Set(SHARED_PRODUCTION.map(f => `${P}/${f}`));
// Whole directories that are shared when the render reaches them: the python engine, pipeline core, page code, fonts, dependencies, measurement.
export const SHARED_PREFIXES = [
  `${GE}/visual_engine/`, 'archive/tools/pipeline-core/', 'alive/runtime/provider-bridge/', 'archive/tools/past-exam-pipeline/lib/',
  'archive/vendor/', 'archive/css/', 'archive/js/', 'apmath/css/', 'apmath/js/', `${GE}/ops/tools/`
];
export const SHARED_EXACT = new Set([
  `${GE}/visual-browser-runtime.mjs`, `${GE}/build-visual-render-matrix.mjs`, `${GE}/record-visual-browser-evidence.mjs`, `${GE}/verify-rendered-layout.mjs`,
  `${GE}/verify-svg-coordinate-parity.mjs`, `${GE}/verify-visual-engine-static.mjs`, `${GE}/verify-visual-extra-primitives.mjs`, `${GE}/legacy_independent_builder.py`,
  `${GE}/audit_publication.py`, 'archive/tools/svg-language-contract.cjs', 'archive/tools/past-exam-pipeline/completion-contract.json', 'archive/data/svg-accessibility-index.js', 'archive/data/master_tables/js_archive_tag_master.json',
  `${GE}/ops/score/score.mjs` // render-plan.mjs scores every failed candidate
]);

// Files in production/ that render-plan.mjs cannot reach (verified by the test). Changing them does not change a render.
const NON_RENDER_PRODUCTION = [
  'audit-slice.mjs', 'build-author-guide.mjs', 'construction-parameters-v1.mjs', 'qualification.mjs', 'register-source-authority.mjs', 'render-problem-figures.mjs',
  'request-adapter-v1.mjs', 'run.mjs', 'setup-spikes.mjs', 'source-inventory-compare-v1.mjs', 'source-schematic-figure.mjs', 'source-schematic-observer.mjs',
  'source-schematic-raster.mjs', 'svg-accessibility-v1.mjs', 'svg-accessibility-v1.test.mjs', 'typography-spike.mjs', 'problem-figure-presentation.mjs',
  'runtime-package.json', 'runtime-package-lock.json', 'requirements.txt'
];
export const NON_RENDER_FILES = new Set(NON_RENDER_PRODUCTION.map(f => `${P}/${f}`));

// ---- what a plan is ----------------------------------------------------------------------------------------------------
// Every capability named anywhere in the plan (composite panels carry their own plan.capability).
export function planCapabilities(plan) {
  const out = new Set();
  const walk = (v, depth) => {
    if (depth > 8 || v === null || typeof v !== 'object') return;
    if (Array.isArray(v)) { for (const x of v) walk(x, depth + 1); return; }
    if (typeof v.capability === 'string') out.add(v.capability);
    for (const x of Object.values(v)) walk(x, depth + 1);
  };
  walk(plan, 0);
  return out;
}
// The kinds a plan exercises. A capability the table does not know becomes 'unknown' (selected by every kind run, never skipped).
export function planKinds(plan) {
  const kinds = new Set();
  for (const c of planCapabilities(plan)) kinds.add(CAPABILITY_KIND[c] ?? 'unknown');
  if (plan && (plan.status === 'EXEMPT' || plan.status === 'UNSUPPORTED') && kinds.size === 0) kinds.add('status-only');
  if (kinds.size === 0) kinds.add('unknown');
  return kinds;
}

// ---- what a changed file does ------------------------------------------------------------------------------------------
// -> {effect: 'ALL' | 'KINDS' | 'ITEM' | 'NONE', kinds?, reason}
export function classifyFile(file, {renderReachable = null, items = []} = {}) {
  if (KIND_FILES[file]) return {effect: 'KINDS', kinds: KIND_FILES[file], reason: 'kind file'};
  // a golden plan: only that item changes
  const planMatch = file.match(new RegExp(`^${GE}/ops/golden/([^/]+)/plan\\.json$`));
  if (planMatch) return {effect: 'ITEM', items: [planMatch[1]], reason: 'golden plan'};
  if (file === `${GE}/ops/golden.manifest.json`) return {effect: 'ALL', reason: 'golden manifest (item list)'};
  if (NON_RENDER_FILES.has(file)) return {effect: 'NONE', reason: 'not reachable from render-plan.mjs'};
  if (SHARED_FILES.has(file) || SHARED_EXACT.has(file) || SHARED_PREFIXES.some(p => file.startsWith(p))) return {effect: 'ALL', reason: 'shared render code'};
  // exam sources and their published figures: the items that read them
  const exam = file.match(/^archive\/exams\/.*?([^/]+)\.js$/);
  if (exam) {
    const hit = items.filter(i => i.sourcePath === file).map(i => i.dir);
    return hit.length ? {effect: 'ITEM', items: hit, reason: 'golden source exam'} : {effect: 'NONE', reason: 'exam not used by a golden item'};
  }
  const assets = file.match(/^archive\/assets\/images\/([^/]+)\//);
  if (assets) {
    const hit = items.filter(i => i.sourcePath.endsWith(`/${assets[1]}.js`)).map(i => i.dir);
    return hit.length ? {effect: 'ITEM', items: hit, reason: 'published figure of a golden source exam'} : {effect: 'NONE', reason: 'assets of an exam not used by a golden item'};
  }
  // archive page code next to engine.html (top level of archive/): the page the render measures in
  if (/^archive\/[^/]+$/.test(file)) return /\.(js|css|html|woff2?|json)$/.test(file) ? {effect: 'ALL', reason: 'archive page code'} : {effect: 'NONE', reason: 'archive top-level non-code file'};
  // Inside the engine folder: documents, tests, ledgers and offline scripts do not render.
  if (file.startsWith(`${GE}/`)) {
    const rest = file.slice(GE.length + 1);
    if (/\.md$/.test(rest)) return {effect: 'NONE', reason: 'document'};
    if (rest.startsWith('tests/')) return {effect: 'NONE', reason: 'engine test (use --tests)'};
    if (rest.startsWith('production/exam-figure-ledger/') || rest.startsWith('production/plans/')) return {effect: 'NONE', reason: 'ledger / authored plans are not render input'};
    if (rest.startsWith('ops/')) return {effect: 'NONE', reason: 'ops tooling'};
    if (rest.startsWith('production/') || rest.startsWith('visual_engine/')) return {effect: 'ALL', reason: 'unknown engine file (not in the kind table): whole set'};
    // a script at the folder root that the render does not import
    if (renderReachable && renderReachable.has(file)) return {effect: 'ALL', reason: 'engine root file reached by the render'};
    if (renderReachable) return {effect: 'NONE', reason: 'engine root script not reached by the render'};
    return {effect: 'ALL', reason: 'engine root file (reach unknown): whole set'};
  }
  // Anything else outside the render's inputs
  return {effect: 'NONE', reason: 'outside the render inputs'};
}

// Resolve --families words to a kind set. Returns {all:boolean, kinds:Set, items:Set (explicit item dirs), unknown:[]}.
export function parseFamilies(words, items) {
  const out = {all: false, kinds: new Set(), items: new Set(), unknown: []};
  for (const raw of words) {
    const w = String(raw).trim();
    if (!w) continue;
    const lw = w.toLowerCase();
    if (lw === 'all') { out.all = true; continue; }
    if (KINDS.includes(lw)) { out.kinds.add(lw); continue; }
    if (KIND_ALIASES[lw]) { out.kinds.add(KIND_ALIASES[lw]); continue; }
    if (CAPABILITY_KIND[w]) { out.kinds.add(CAPABILITY_KIND[w]); continue; }
    const fam = items.filter(i => i.fam === w.toUpperCase());
    if (fam.length) { for (const i of fam) out.items.add(i.dir); continue; }
    if (items.some(i => i.dir === w)) { out.items.add(w); continue; }
    out.unknown.push(w);
  }
  return out;
}

// Which items a run covers. changes: [{file, effect...}] from classifyFile, or families from parseFamilies.
export function selectItems({items, plans, all = false, kinds = new Set(), itemDirs = new Set()}) {
  if (all) return items.map(i => i.dir);
  const chosen = new Set(itemDirs);
  for (const item of items) {
    const pk = planKinds(plans[item.dir]);
    if (pk.has('unknown') && kinds.size) chosen.add(item.dir); // an unmapped capability is never skipped by a kind run
    for (const kd of kinds) if (pk.has(kd)) chosen.add(item.dir);
  }
  return items.map(i => i.dir).filter(d => chosen.has(d));
}

// ---- table version and the soundness rule ---------------------------------------------------------------------------------
import crypto from 'node:crypto';
import fs from 'node:fs';
// Changes whenever the table changes: stored keys made under another table are not reused.
// The classification rules are code too (classifyFile, planKinds, selectItems, chooseItems): the version covers the bytes of the files that hold them.
export const RULE_FILES = ['kinds.mjs', 'select.mjs'];
export const readRuleSources = () => RULE_FILES.map(f => fs.readFileSync(new URL(f, import.meta.url)).toString('utf8'));
export const kindsVersionOf = (table, ruleSources) => crypto.createHash('sha256').update(JSON.stringify({table, ruleSources})).digest('hex').slice(0, 12);
export const currentTable = () => ({
  CAPABILITY_KIND, KIND_FILES, SHARED: [...SHARED_FILES].sort(), SHARED_PREFIXES, SHARED_EXACT: [...SHARED_EXACT].sort(), NON_RENDER: [...NON_RENDER_FILES].sort(),
  DISPATCHERS: [...DISPATCHERS].sort(), IMPORT_EXCEPTIONS, ALIASES: KIND_ALIASES
});
export const KINDS_VERSION = kindsVersionOf(currentTable(), readRuleSources());

// A kind file may only be used by its own kind, the dispatchers (a python dispatcher only through a lazy import), or a listed exception.
// graph: a code graph (importers map file -> [{from, lazy}]). Returns the list of problems (empty = sound).
export function kindTableProblems({graph, kindFiles = KIND_FILES, dispatchers = DISPATCHERS, exceptions = IMPORT_EXCEPTIONS}) {
  const problems = [];
  for (const [file, kinds] of Object.entries(kindFiles)) {
    for (const {from, lazy} of graph.importers.get(file) ?? []) {
      if (dispatchers.has(from)) { if (from.endsWith('.py') && !lazy) problems.push(`${file} is imported at the top of ${from}, so every request kind loads it`); continue; }
      if ((exceptions[file] ?? []).includes(from)) continue;
      const importerKinds = kindFiles[from];
      if (importerKinds && importerKinds.every(k => kinds.includes(k))) continue; // the importer only runs for kinds this file already selects
      if (importerKinds && from.endsWith('composite-candidate-svg-v1.mjs')) continue; // the panel dispatcher: panels are selected through planKinds() of the composite plan
      problems.push(`${file} (kinds ${kinds.join('+')}) is imported by ${from}${importerKinds ? ` (kinds ${importerKinds.join('+')})` : ' (shared or unlisted)'}; list it as ALL, or add an IMPORT_EXCEPTION with the reason`);
    }
  }
  return problems;
}
