// A snapshot is the part of a git ref (or of the working tree) that the golden render reads, unpacked on the cache drive.
// No git worktree is created: `git archive` (refs) or a file copy (working tree) fills a plain folder. The render runs inside that
// folder, so base and head renders never touch the checkout and never write into it.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {git, gitText, nulList, sha256, mkdirp, readJson, posix, walkFiles} from './util.mjs';
import {GE, classifyFile} from './kinds.mjs';
import {buildCodeGraph} from './code-graph.mjs';

// What the render reads besides the engine: the pipeline core, the vendored Archive page the figure is measured in, fonts, dependencies' code.
export const SNAPSHOT_SPECS = [
  GE, // the whole engine folder (render code, golden plans, ops tools the engine tests call); only the key leaves out what cannot render
  ':(top,glob)archive/*',
  'archive/tools/pipeline-core', 'archive/tools/past-exam-pipeline/lib', 'archive/tools/past-exam-pipeline/completion-contract.json', 'archive/tools/svg-language-contract.cjs',
  'alive/runtime/provider-bridge', 'archive/vendor', 'archive/css', 'archive/js',
  'archive/data/svg-accessibility-index.js', 'archive/data/master_tables/js_archive_tag_master.json',
  'apmath/css/student-navigation.css', 'apmath/js/student-navigation.js'
];
// Which of an exam's files the snapshot carries: every file of its asset folder whatever the extension (question images are PNG/JPG, solutions SVG),
// plus every image path the exam JS names that exists in the repo (any folder). The snapshot must lack nothing the repo has: see missingAssets().
export const ASSET_RULE = 'exam asset folder (any extension) + image paths named in the exam JS';
// Bump when what a stored result record holds changes: old records are then not reused.
export const RESULT_FORMAT = 2;
// a snapshot made with other specs or asset rules is another snapshot
const SPEC_ID = sha256(JSON.stringify([SNAPSHOT_SPECS, ASSET_RULE])).slice(0, 6);
export const MANIFEST = `${GE}/ops/golden.manifest.json`;
export const RENDER_PLAN = `${GE}/production/render-plan.mjs`;

export function resolveTarget(repo, ref) {
  if (ref === '@worktree' || ref === 'WORKTREE' || ref === 'worktree') return {type: 'worktree', label: 'working tree'};
  const sha = gitText(repo, ['rev-parse', '--verify', `${ref}^{commit}`]).trim();
  return {type: 'commit', sha, label: `${ref} (${sha.slice(0, 10)})`};
}

const unpack = (repo, specs, dir, target) => {
  if (target.type === 'commit') {
    const tar = path.join(dir, '..', `.unpack-${process.pid}-${Date.now()}.tar`);
    git(repo, ['archive', '--format=tar', '-o', tar, target.sha, '--', ...specs]);
    // relative names: GNU tar reads 'D:' in an absolute path as a remote host
    const r = spawnSync('tar', ['-xf', path.basename(tar), '-C', path.basename(dir)], {cwd: path.dirname(tar), windowsHide: true});
    fs.rmSync(tar, {force: true});
    if (r.status !== 0) throw new Error('tar failed: ' + String(r.stderr).slice(0, 300));
    return;
  }
  const files = nulList(git(repo, ['ls-files', '-z', '-c', '-o', '--exclude-standard', '--', ...specs]));
  for (const f of files) {
    const src = path.join(repo, f);
    if (!fs.existsSync(src) || !fs.statSync(src).isFile()) continue; // deleted in the working tree
    const dst = path.join(dir, f);
    mkdirp(path.dirname(dst));
    fs.copyFileSync(src, dst);
  }
};

const examFiles = manifest => [...new Set(manifest.items.map(i => i.sourcePath))];
const uidOf = sourcePath => path.posix.basename(sourcePath, '.js');
const literal = p => `:(literal)${p}`;

// Files of the target (commit or working tree) under the given literal paths (directories or files), repo relative.
export function repoFilesUnder(repo, target, paths) {
  const out = [];
  for (let i = 0; i < paths.length; i += 40) {
    const specs = paths.slice(i, i + 40).map(literal);
    if (target.type === 'commit') out.push(...nulList(git(repo, ['ls-tree', '-r', '-z', '--name-only', target.sha, '--', ...specs])));
    else for (const f of nulList(git(repo, ['ls-files', '-z', '-c', '-o', '--exclude-standard', '--', ...specs]))) if (fs.existsSync(path.join(repo, f))) out.push(f);
  }
  return [...new Set(out.map(posix))];
}

// Image paths an exam JS names. A bare file name belongs to the exam's own asset folder (already carried whole); a path with a folder is looked up
// as written, under archive/, under archive/assets/ and under archive/assets/images/.
export function extractImageRefs(text) {
  const refs = new Set();
  for (const m of text.matchAll(/["'`]([^"'`\s\\]+\.(?:png|jpe?g|gif|webp|svg|bmp|avif))["'`]/gi)) refs.add(m[1]);
  return [...refs];
}
export function refCandidates(ref) {
  const r = ref.replace(/^\.?\//, '');
  if (!r.includes('/')) return [];
  return r.startsWith('archive/') ? [r] : [`archive/${r}`, `archive/assets/${r}`, `archive/assets/images/${r}`];
}

// Everything the repo holds for each golden exam: {item: [repo paths]}. The unpacked exam JS files must already be in `dir`.
export function expectedAssets({repo, target, dir, manifest}) {
  const sources = examFiles(manifest);
  const uidFiles = repoFilesUnder(repo, target, sources.map(s => `archive/assets/images/${uidOf(s)}`));
  const refsBySource = new Map(), allCandidates = new Set();
  for (const s of sources) {
    const cands = new Set();
    for (const ref of extractImageRefs(fs.readFileSync(path.join(dir, s), 'utf8'))) for (const c of refCandidates(ref)) cands.add(c);
    refsBySource.set(s, [...cands]); for (const c of cands) allCandidates.add(c);
  }
  const existing = new Set(repoFilesUnder(repo, target, [...allCandidates]));
  const bySource = {};
  for (const s of sources) {
    const prefix = `archive/assets/images/${uidOf(s)}/`;
    bySource[s] = [...new Set([...uidFiles.filter(f => f.startsWith(prefix)), ...refsBySource.get(s).filter(c => existing.has(c))])].sort();
  }
  return {bySource, files: [...new Set(Object.values(bySource).flat())].sort()};
}

// Expected files the snapshot does not hold. For a snapshot of a correct unpack this is empty; a folder that lost a file reports it here.
export function missingAssets(dir, expectedBySource, items) {
  const blocked = {};
  for (const it of items) {
    const lacking = (expectedBySource[it.sourcePath] ?? []).filter(p => !fs.existsSync(path.join(dir, p)));
    if (lacking.length) blocked[it.dir] = lacking;
  }
  return blocked;
}

// Remove a snapshot folder without ever following the dependency junction into the shared dependencies.
export function removeSnapshot(dir) {
  const link = path.join(dir, '.tmp/apmath-visual-engine/dependencies');
  try { if (fs.lstatSync(link).isSymbolicLink() || fs.lstatSync(link).isDirectory()) { try { fs.unlinkSync(link); } catch { fs.rmdirSync(link); } } } catch { /* no link */ }
  fs.rmSync(dir, {recursive: true, force: true});
}

// Snapshots are cheap to rebuild: a working-tree one is dropped after a day, a commit one after two weeks without use.
export function pruneSnapshots(cacheRoot, now = Date.now()) {
  const root = path.join(cacheRoot, 'snapshots');
  if (!fs.existsSync(root)) return;
  for (const e of fs.readdirSync(root)) {
    const dir = path.join(root, e);
    if (e.endsWith('.tar')) { try { if (now - fs.statSync(dir).mtimeMs > 600e3) fs.rmSync(dir, {force: true}); } catch { /* in use */ } continue; }
    let age; try { age = now - fs.statSync(fs.existsSync(path.join(dir, '.snapshot-complete')) ? path.join(dir, '.snapshot-complete') : dir).mtimeMs; } catch { continue; }
    if ((e.startsWith('w-') && age > 24 * 3600e3) || (e.startsWith('c-') && age > 14 * 24 * 3600e3) || (e.endsWith('.part') && age > 3600e3)) removeSnapshot(dir);
  }
}

const junction = (target, link) => {
  mkdirp(path.dirname(link));
  if (fs.existsSync(link)) return;
  fs.symlinkSync(target, link, process.platform === 'win32' ? 'junction' : 'dir');
};

// Returns {dir, id, target, manifest, items, plans, commonKey, itemKey(item), reachable}.
export function ensureSnapshot({repo, target, cacheRoot, depsDir, log = () => {}}) {
  const snapRoot = mkdirp(path.join(cacheRoot, 'snapshots'));
  let dir, id;
  if (target.type === 'commit') {
    id = `c-${target.sha.slice(0, 12)}-${SPEC_ID}`;
    dir = path.join(snapRoot, id);
  } else {
    id = `w-${Date.now().toString(36)}`;
    dir = path.join(snapRoot, id + '.part');
  }
  const done = path.join(dir, '.snapshot-complete');
  if (!fs.existsSync(done)) {
    removeSnapshot(dir);
    mkdirp(dir);
    log(`unpacking ${target.label} -> ${dir}`);
    unpack(repo, SNAPSHOT_SPECS, dir, target);
    const manifest = readJson(path.join(dir, MANIFEST));
    const sources = examFiles(manifest);
    for (let i = 0; i < sources.length; i += 25) unpack(repo, sources.slice(i, i + 25).map(literal), dir, target);
    const expected = expectedAssets({repo, target, dir, manifest});
    for (let i = 0; i < expected.files.length; i += 60) unpack(repo, expected.files.slice(i, i + 60).map(literal), dir, target);
    fs.writeFileSync(path.join(dir, '.snapshot-assets.json'), JSON.stringify({rule: ASSET_RULE, bySource: expected.bySource}));
    fs.writeFileSync(done, new Date().toISOString());
  }
  let finalDir = dir;
  if (target.type === 'worktree') {
    // working-tree snapshots are named by content so an unchanged tree is a cache hit
    const manifestHash = contentHash(dir);
    id = `w-${manifestHash.slice(0, 12)}`;
    finalDir = path.join(snapRoot, id);
    if (fs.existsSync(path.join(finalDir, '.snapshot-complete'))) removeSnapshot(dir);
    else { removeSnapshot(finalDir); fs.renameSync(dir, finalDir); }
  }
  junction(depsDir, path.join(finalDir, '.tmp/apmath-visual-engine/dependencies'));
  try { const now = new Date(); fs.utimesSync(path.join(finalDir, '.snapshot-complete'), now, now); } catch { /* marks use */ }
  return describeSnapshot(finalDir, id, target);
}

function contentHash(dir) {
  const h = [];
  for (const f of walkFiles(dir, {skip: rel => rel.startsWith('.tmp/') || rel.startsWith('.snapshot')})) h.push(f + '\0' + sha256(fs.readFileSync(path.join(dir, f))));
  return sha256(h.join('\n'));
}

export function describeSnapshot(dir, id, target) {
  const manifest = readJson(path.join(dir, MANIFEST));
  const items = manifest.items;
  const plans = {};
  for (const i of items) plans[i.dir] = readJson(path.join(dir, GE, 'ops/golden', i.dir, 'plan.json'));
  let assets = {bySource: {}};
  try { assets = readJson(path.join(dir, '.snapshot-assets.json')); } catch { /* a fixture without the list */ }
  const blocked = missingAssets(dir, assets.bySource, items);
  const keyFile = path.join(dir, '.snapshot-keys.json');
  const graph = buildCodeGraph(dir, [RENDER_PLAN]);
  const reachable = graph.nodes;
  let keys = null;
  try { keys = readJson(keyFile); } catch { /* computed below */ }
  const files = walkFiles(dir, {skip: rel => rel.startsWith('.tmp/') || rel.startsWith('.snapshot')});
  const classified = files.map(f => [f, classifyFile(f, {renderReachable: reachable, items})]);
  if (!keys) {
    const common = classified.filter(([, c]) => c.effect === 'ALL' || c.effect === 'KINDS').map(([f]) => f + '\0' + sha256(fs.readFileSync(path.join(dir, f))));
    const itemFiles = {};
    for (const [f, c] of classified) if (c.effect === 'ITEM') for (const it of c.items) (itemFiles[it] ??= []).push(f + '\0' + sha256(fs.readFileSync(path.join(dir, f))));
    // every asset the exam needs counts for the keys of its items, whatever the extension or folder
    for (const it of items) for (const p of assets.bySource[it.sourcePath] ?? []) {
      if (!fs.existsSync(path.join(dir, p))) continue;
      const line = p + String.fromCharCode(0) + sha256(fs.readFileSync(path.join(dir, p)));
      const list = (itemFiles[it.dir] ??= []);
      if (!list.includes(line)) list.push(line);
    }
    keys = {commonKey: sha256(common.join('\n')), commonFiles: common.length, itemFiles: Object.fromEntries(Object.entries(itemFiles).map(([k, v]) => [k, sha256(v.sort().join('\n'))]))};
    fs.writeFileSync(keyFile, JSON.stringify(keys));
  }
  const itemKey = item => sha256([keys.commonKey, item.dir, item.sourcePath, String(item.ordinal), keys.itemFiles[item.dir] ?? '', ASSET_RULE, `result-format-${RESULT_FORMAT}`].join('\n'));
  return {dir, id, target, manifest, items, plans, blocked, assets, commonKey: keys.commonKey, commonFiles: keys.commonFiles, itemKey, reachable, graph, fileList: files};
}

// Paths changed between two targets (repo relative, posix). Either side may be the working tree.
export function changedFiles(repo, base, head) {
  const lines = new Set();
  if (head.type === 'commit') {
    for (const f of nulList(git(repo, ['diff', '--name-only', '-z', '--no-renames', base.sha, head.sha]))) lines.add(f);
  } else {
    for (const f of nulList(git(repo, ['diff', '--name-only', '-z', '--no-renames', base.sha]))) lines.add(f);
    for (const f of nulList(git(repo, ['ls-files', '-z', '-o', '--exclude-standard']))) lines.add(f);
  }
  return [...lines].map(posix).sort();
}
