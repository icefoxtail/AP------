// Exact-version inventory for delta lesson audits. This tool never grants PASS.
// A prior phase result is only a reuse candidate when its relevant fingerprint,
// PASS status and explicit evidence refs match. Artifact/provenance verification
// is still required; this tool does not promote references into a new PASS.
// Browser/visual proof is distinct
// from source/math proof. Run from any directory with --out <json>.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const NEXT = path.resolve(HERE, '..');
const ROOT = path.resolve(NEXT, '../../..');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const stable = value => JSON.stringify(value, (_, item) => typeof item === 'function' ? { __function: String(item) } : item && !Array.isArray(item) && typeof item === 'object'
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
const relative = file => path.relative(ROOT, file).split(path.sep).join('/');
const walk = dir => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]) : [];
const digestFiles = files => {
  const inputs = [...new Set(files)].sort().map(file => ({ path: relative(file), sha256: sha(fs.readFileSync(file)) }));
  return { sha256: sha(stable(inputs)), inputs };
};

// A deliberately small recognized grammar, not a filename-only assumption.
// Some lesson-a/b/c files patch scene drawing. Such modules stay in sceneSource.
// Only literal builder registries with local helpers and no observable object
// writes/external calls can use the compiled per-lesson content fingerprint.
const registryStart = /\.push\(\s*(?:function\s*)?\(\s*(?:api|\{[^}]+\})\s*\)\s*(?:=>\s*)?\{/;
function isLiteralLessonRegistry(file) {
  if (!/^lesson-[a-z]\.js$/.test(path.basename(file))) return false;
  const text = fs.readFileSync(file, 'utf8');
  if (text.includes('${')) return false;
  const start = registryStart.exec(text);
  if (!start || !/\bAPL_\w*BUILDERS\b/.test(text.slice(0, start.index))) return false;
  const end = text.lastIndexOf('});');
  if (end <= start.index) return false;
  let body = text.slice(start.index + start[0].length, end).replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g, ' ');
  // No source/runtime object is exposed to the recognized data builder grammar.
  if (/\bsource\b|\.\s*(?:constructor|prototype|__proto__)\b/.test(start[0] + body)) return false;
  body = body.replace(/\bconst\s*\{\s*(?:add|concept|C|P)(?:\s*,\s*(?:add|concept|C|P))*\s*\}\s*=\s*api\s*;/, ' ');
  if (/\bapi\b/.test(body)) return false;
  if (/\b(?:global|window|document|g|new|eval|Function|import|require|this)\b/.test(body)) return false;
  if (/(?:\.\s*\w+|\])\s*(?:=(?!=)|\+\+|--|[-+*/|&]=)/.test(body)) return false;
  const local = new Set([...body.matchAll(/(?:\bconst|\blet|,)\s*(\w+)\s*=/g)].map(m => m[1]));
  const allowed = new Set(['add', 'concept', 'C', 'P', 'Math.sqrt', 'Math.abs', 'Math.round', 'Math.pow', ...local]);
  return [...body.matchAll(/([\w$.]+)\s*\(/g)].every(m => allowed.has(m[1]));
}
function registryEnvelope(file) {
  const text = fs.readFileSync(file, 'utf8'), start = registryStart.exec(text);
  return { path: relative(file), scope: 'registration-wrapper-only', sha256: sha(text.slice(0, start.index + start[0].length) + text.slice(text.lastIndexOf('});'))) };
}

export async function inventory({ previous = null } = {}) {
  const ctx = vm.createContext({ window: {}, console });
  vm.runInContext(fs.readFileSync(path.join(NEXT, 'kit/apl-catalog.js'), 'utf8'), ctx);
  const catalog = ctx.window.APLab.catalog.labs;
  const mf = vm.createContext({ window: {}, console });
  for (const file of ['core', 'g7', 'g8', 'g9']) vm.runInContext(fs.readFileSync(path.join(NEXT, 'labs/middle-functions', file + '.js'), 'utf8'), mf);
  const M = mf.window.APL_MF;
  const helpers = new Map();
  for (const file of walk(path.join(HERE, 'helpers')).filter(f => f.endsWith('-lesson-runtime.mjs'))) {
    const id = /labs\/([\w-]+)\.html/.exec(fs.readFileSync(file, 'utf8'))?.[1];
    if (id) helpers.set(id, file);
  }
  // Include all kit assets (also KaTeX woff/ttf) and the shell's dynamic same-origin
  // student navigation. Captured network inputs from the browser receipt remain
  // the authority for any third-party response bytes or additional loaded URLs.
  const kitFiles = [...walk(path.join(NEXT, 'kit')), ...['css/student-navigation.css', 'js/student-navigation.js'].map(p => path.join(ROOT, 'apmath', p))];
  const kit = digestFiles(kitFiles);
  const mathKit = digestFiles(kitFiles.filter(file => /\/(?:apl-core|apl-compat|apl-geom|apl-space|apl-video-core)\.js$/.test(file)));
  const prior = new Map((previous?.units || []).map(unit => [unit.key, unit]));
  const labs = [], units = [], errors = [];
  for (const item of catalog) {
    if (!item.next) continue;
    const pageId = path.basename(item.next, '.html');
    let def, list, helper;
    if (M.labs[item.id]) {
      def = M.compile(item.id);
      list = def.groups.flatMap(g => g.scenes);
    } else {
      helper = helpers.get(pageId);
      if (!helper) { errors.push({ lab: item.id, code: 'MISSING_NATIVE_LOADER' }); continue; }
      const loaded = await (await import(pathToFileURL(helper))).load();
      def = loaded.def; list = loaded.list;
    }
    const html = path.resolve(NEXT, '../', item.next);
    const sceneFiles = [html, ...walk(path.join(NEXT, 'labs', item.id))];
    if (M.labs[item.id]) sceneFiles.push(...['core', item.course].map(n => path.join(NEXT, 'labs/middle-functions', n + '.js')));
    const source = digestFiles(sceneFiles);
    const literalRegistryFiles = sceneFiles.filter(isLiteralLessonRegistry);
    const sceneSource = digestFiles(sceneFiles.filter(file => !literalRegistryFiles.includes(file)));
    // Prefix/suffix changes cannot hide a new side effect outside a builder body.
    sceneSource.registryEnvelopes = literalRegistryFiles.map(registryEnvelope);
    sceneSource.sha256 = sha(stable({ inputs: sceneSource.inputs, registryEnvelopes: sceneSource.registryEnvelopes }));
    const lab = { id: pageId, catalogId: item.id, title: item.title, course: item.course, scenes: list.length, lessons: 0, source, sceneSource, literalLessonRegistries: literalRegistryFiles.map(relative), helper: helper && relative(helper) };
    if (list.length !== item.sceneTotal) errors.push({ lab: item.id, code: 'CATALOG_SCENE_COUNT', actual: list.length, catalog: item.sceneTotal });
    const ids = new Set();
    // Match Lab's native def.groups enumeration; a flat sceneIndex is not a group index.
    const groupIndex = new Map((def.groups || [{ scenes: def.scenes || [] }]).flatMap((group, gi) => group.scenes.map(scene => [String(scene.id), gi])));
    for (const [sceneIndex, scene] of list.entries()) {
      if (ids.has(scene.id)) errors.push({ lab: item.id, scene: scene.id, code: 'DUPLICATE_SCENE' });
      ids.add(scene.id);
      const raw = def.lessons?.[scene.id];
      const lessons = raw ? (Array.isArray(raw) ? raw : [raw]) : [];
      if (!lessons.length) errors.push({ lab: item.id, scene: scene.id, code: 'MISSING_LESSON' });
      for (const [lessonIndex, lesson] of lessons.entries()) {
        const key = `${pageId}/${scene.id}/${lessonIndex}`;
        const lessonSha256 = sha(stable(lesson));
        const sceneSha256 = sha(stable(scene));
        const base = sceneSource.sha256 + sceneSha256 + lessonSha256;
        const fingerprints = { math: sha(base + mathKit.sha256), structure: sha(base + kit.sha256), browser: sha(base + kit.sha256), visual: sha(base + kit.sha256) };
        const old = prior.get(key);
        const dimensions = Object.fromEntries(Object.entries(fingerprints).map(([name, fingerprint]) => {
          const evidence = old?.dimensions?.[name];
          return [name, evidence?.status === 'PASS' && evidence?.fingerprint === fingerprint && evidence?.evidenceRefs?.length
            ? { status: 'NOT_RUN', fingerprint, selection: 'REUSE_CANDIDATE', evidenceRefs: evidence.evidenceRefs, verificationRequired: 'Verify raw artifact hashes, executed contract and complete input closure before accepting the prior PASS.' }
            : { status: 'NOT_RUN', fingerprint, selection: old ? 'CHANGED_OR_EVIDENCE_DEBT' : 'NEW_OR_EVIDENCE_DEBT', evidenceRefs: [] }];
        }));
        units.push({ key, lab: pageId, catalogId: item.id, scene: String(scene.id), gi: groupIndex.get(String(scene.id)), sceneIndex, lessonIndex, label: lesson.label || '', title: lesson.title || '', duration: lesson.chapters.reduce((sum, ch) => sum + ch.length, 0), chapters: lesson.chapters.length, lessonSha256, sceneSha256, dimensions });
      }
      lab.lessons += lessons.length;
    }
    labs.push(lab);
  }
  let head = null;
  try { head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(); } catch {}
  return { schemaVersion: 2, createdAt: new Date().toISOString(), head, declaration: 'Inventory and version binding only; not a quality PASS. A saved PASS applies only to its evidence contract; independent visual review is separate.', limitations: ['Literal-only lesson builders are split; unknown or mixed runtime/lesson modules conservatively invalidate the entire lab.', 'Third-party response bytes and browser-loaded extra dependencies must be bound by the browser receipt; this source inventory alone does not prove network equivalence.', 'Matching fingerprints and evidence references produce REUSE_CANDIDATE only. This tool does not verify artifact bytes or certify prior execution.'], counts: { labs: labs.length, scenes: labs.reduce((sum, lab) => sum + lab.scenes, 0), lessons: units.length, reuseCandidates: Object.fromEntries(['math', 'structure', 'browser', 'visual'].map(name => [name, units.filter(u => u.dimensions[name].selection === 'REUSE_CANDIDATE').length])) }, sharedDependencies: kit, sharedMathDependencies: mathKit, labs, units, errors };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), value = flag => args[args.indexOf(flag) + 1];
  if (!args.includes('--out') || !value('--out')) throw Error('Usage: node player-audit-scope.mjs --out <json> [--previous <verified-receipt.json>]');
  const previous = args.includes('--previous') ? JSON.parse(fs.readFileSync(value('--previous'), 'utf8')) : null;
  const result = await inventory({ previous });
  fs.mkdirSync(path.dirname(path.resolve(value('--out'))), { recursive: true });
  fs.writeFileSync(value('--out'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ ...result.counts, errors: result.errors.length, out: path.resolve(value('--out')) }));
  if (result.errors.length) { console.error(JSON.stringify(result.errors)); process.exitCode = 1; }
}
