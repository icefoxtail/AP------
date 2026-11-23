// Harness for tests/archive2-save-roundtrip.e2e.mjs: the REAL browser screen code (archive/archive2-workspace.js, run in a vm)
// talks to the REAL Worker code (apmath/worker-backup/worker, bundled by esbuild, run in Miniflare with a local D1).
// Nothing in the Worker is patched or stubbed except the test-only entry below, which hands the route a fixture teacher
// (the same convention as tests/archive-saved-papers-runtime.mjs). All network is local: the Pages copy, the R2 image host
// and the API are answered from this checkout. No production request is ever made.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(here, "../..");
const require = createRequire(import.meta.url);
const worker = path.join(root, "apmath/worker-backup/worker");
const requireWorker = createRequire(path.join(worker, "package.json"));

export const core = require("../../archive/archive2-core.js");
const archiveSource = require("../../archive/archive2-source.js");
// The browser catalog: the same digest-checked projection the screen resolves (resolveCatalog over the registered inputs).
export const { catalog } = require("./archive2-scope-harness.cjs");

const BASE = "https://archive.test/archive/";
const API_BASE = "https://archive.test/api";
const readArchive = (file) => fs.readFileSync(path.join(root, "archive", file), "utf8");
const { loadWorkspace } = require("./archive2-workspace-source.cjs");

const MIME = { ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json", ".js": "application/javascript" };
const mimeOf = (file) => MIME[path.extname(file).toLowerCase()] || "image/jpeg";
function localFile(baseDir, relative) {
  const file = path.resolve(baseDir, relative);
  if (!relative || path.relative(baseDir, file).startsWith("..") || !fs.existsSync(file)) return new Response("Not found", { status: 404 });
  return new Response(fs.readFileSync(file), { headers: { "Content-Type": mimeOf(file) } });
}

// Server limit, read from the Worker source so this check follows the server instead of repeating a number.
export const MAX_SAVED_PAPER_BYTES = Number(
  /MAX_SAVED_PAPER_BYTES\s*=\s*([\d_]+)/.exec(fs.readFileSync(path.join(worker, "helpers/archive-saved-papers.js"), "utf8"))[1].replace(/_/g, ""));

// The condition keys the saved-paper route accepts in selection_filters (any other key is answered 409), read from the Worker source.
export function workerFilterKeys() {
  const body = /const FILTER_KEYS = new Set\(\[([\s\S]*?)\]\)/.exec(fs.readFileSync(path.join(worker, "helpers/archive-saved-papers.js"), "utf8"));
  if (!body) throw new Error("the Worker no longer declares FILTER_KEYS");
  const keys = new Set([...body[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]));
  if (!keys.has("grade") || !keys.has("primaryPaths") || !keys.has("scopeQuestionUids")) throw new Error("the parsed Worker key list is not the real one");
  return keys;
}

// ---------------------------------------------------------------- Worker
export async function createWorker() {
  const { Miniflare } = requireWorker("miniflare");
  const { build } = requireWorker("esbuild");
  const bundle = await build({
    stdin: {
      contents: `import { handleExams } from './routes/exams.js';
export default {async fetch(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.split('/').filter(Boolean);
  const role = request.headers.get('X-Fixture-Role') || '';
  const teacher = role ? { id: role === 'admin' ? 'admin' : 'teacher-a', role } : null;
  return handleExams(request, env, teacher, path, url);
}}`,
      resolveDir: worker,
    },
    bundle: true, write: false, format: "esm", platform: "browser", external: ["cloudflare:*", "node:*"],
  });
  const r2Requests = [];
  // Image keys (the part after /exams/images/) the fake R2 answers 404 for: a test adds one to model a picture that cannot be read.
  const missingImageKeys = new Set();
  const mf = new Miniflare({
    modules: true, script: bundle.outputFiles[0].text, compatibilityDate: "2026-07-11", compatibilityFlags: ["nodejs_compat"],
    d1Databases: ["DB"], r2Buckets: ["EXAM_PDF_BUCKET"],
    bindings: { ARCHIVE2_ENABLED: "true", ARCHIVE_PUBLIC_BASE_URL: "https://icefoxtail.github.io/AP------/archive" },
    outboundService: (request) => {
      const url = new URL(request.url);
      if (url.origin !== "https://img.wangjiedu.com" || !url.pathname.startsWith("/exams/images/"))
        return new Response("Unexpected outbound request " + request.url, { status: 502 });
      r2Requests.push(request.url);
      const key = decodeURIComponent(url.pathname.slice("/exams/images/".length));
      if (missingImageKeys.has(key)) return new Response("Not found", { status: 404 });
      return localFile(path.join(root, "archive/assets/images"), key);
    },
    serviceBindings: {
      ARCHIVE2_ASSETS: (request) => {
        const url = new URL(request.url);
        const mounts = [["/AP------/archive/", path.join(root, "archive")], ["/AP------/docs/", path.join(root, "docs")]];
        const mount = mounts.find(([prefix]) => url.pathname.startsWith(prefix));
        // The Pages package ships no exam images (they live on R2): a request for one is a 404, as in production.
        if (/\/assets\/images\//i.test(decodeURIComponent(url.pathname))) return new Response("Not found", { status: 404 });
        return mount ? localFile(mount[1], decodeURIComponent(url.pathname.slice(mount[0].length))) : new Response("Not found", { status: 404 });
      },
    },
  });
  const db = await mf.getD1Database("DB");
  const schema = fs.readFileSync(path.join(worker, "schema.sql"), "utf8");
  for (const table of ["class_exam_assignments", "class_exam_assignment_recipients", "class_exam_assignment_exclusions",
    "exam_blueprints", "exam_sessions", "wrong_answers", "assessment_result_items"]) {
    const match = schema.match(new RegExp("CREATE TABLE IF NOT EXISTS " + table + " \\([\\s\\S]*?\\n\\);"));
    if (!match) throw new Error("schema.sql no longer defines " + table);
    await db.prepare(match[0]).run();
  }
  await db.exec(`
    CREATE TABLE classes(id TEXT PRIMARY KEY,name TEXT,teacher_name TEXT);
    CREATE TABLE students(id TEXT PRIMARY KEY,name TEXT,school_name TEXT DEFAULT '',grade TEXT DEFAULT '고1',student_pin TEXT DEFAULT '',status TEXT DEFAULT '재원');
    CREATE TABLE class_students(class_id TEXT,student_id TEXT);
    CREATE TABLE teacher_classes(teacher_id TEXT,class_id TEXT);
    CREATE TABLE attendance(student_id TEXT,status TEXT,date TEXT);
    ALTER TABLE exam_sessions ADD COLUMN assignment_id TEXT;
  `);
  const migrate = async (sql) => {
    const triggers = [...sql.matchAll(/CREATE TRIGGER IF NOT EXISTS[\s\S]*?END;/g)].map((m) => m[0]);
    const plain = sql.replace(/CREATE TRIGGER IF NOT EXISTS[\s\S]*?END;/g, "").replace(/--[^\n]*/g, "");
    for (const statement of plain.split(";").map((v) => v.trim()).filter(Boolean)) await db.prepare(statement).run();
    for (const trigger of triggers) await db.prepare(trigger).run();
  };
  for (const name of ["20260916_archive2_question_bridge", "20261015_assessment_result_uid_meta_snapshot",
    "20260929_archive_saved_papers", "20261002_archive2_paper_lifecycle_foundation", "20261002_archive2_assignment_context"])
    await migrate(fs.readFileSync(path.join(worker, "migrations", name + ".sql"), "utf8"));
  return { mf, db, r2Requests, missingImageKeys, dispose: () => mf.dispose() };
}

// ---------------------------------------------------------------- Workspace (the real screen script in a vm)
// Deterministic UUIDs. While the paper is being generated the stream is the same for every workspace (so the selection seed is
// fixed: the same data always yields the same selection); afterwards each workspace gets its own stream (batch ids, draft ids
// must differ between workspaces that share one D1).
let workspaceCount = 0;
function seededUuids() {
  let seedMode = false, seedCounter = 0, counter = 0;
  const salt = "ws" + ++workspaceCount;
  const make = (text) => {
    const hex = crypto.createHash("sha256").update(text).digest("hex");
    const variant = "89ab"[parseInt(hex[16], 16) % 4];
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-${variant}${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
  };
  const next = () => (seedMode ? make("archive2-save-roundtrip:seed:" + seedCounter++) : make(`archive2-save-roundtrip:${salt}:${counter++}`));
  return { next, seedMode: (on) => { seedMode = on; if (on) seedCounter = 0; } };
}

// options.shardFiles: a Map(relative path -> Buffer) of the built catalog shards; with it the page has the shard loader and answers
// ".../data/archive2-catalog-shards-v1/<file>" from the map (the screen then builds its catalog from shards, as a browser does).
export function createWorkspace(workerHandle, options = {}) {
  const nodes = new Map(), storage = new Map();
  const node = (id) => {
    if (!nodes.has(id)) nodes.set(id, {
      id, innerHTML: "", textContent: "", dataset: {}, open: false, inert: false,
      setAttribute() {}, addEventListener() {}, querySelectorAll: () => [], querySelector: () => null,
      classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {},
    });
    return nodes.get(id);
  };
  const uuids = seededUuids();
  const wire = { posts: [], beforePost: null, log: [] };
  // The screen registers its click/change handlers with document.addEventListener; keep them so a sample can press the real buttons.
  const events = new Map();
  const sourceForScreen = {
    ...archiveSource,
    restore: (records, cat, options = {}) => archiveSource.restore(records, cat, {
      ...options, baseUrl: BASE, fetcher: async (url) => localFile(path.join(root, "archive"), decodeURIComponent(new URL(String(url)).pathname.replace(/^\/archive\//, ""))),
    }),
  };
  const ctx = vm.createContext({
    console, URL, URLSearchParams, structuredClone, TextEncoder, AbortController, Promise, Response, unescape, encodeURIComponent,
    crypto: { randomUUID: uuids.next, subtle: crypto.webcrypto.subtle, getRandomValues: (a) => crypto.webcrypto.getRandomValues(a) },
    btoa: (v) => Buffer.from(v, "binary").toString("base64"), atob: (v) => Buffer.from(v, "base64").toString("binary"),
    location: new URL(BASE + "workspace.html?view=compose"), history: { pushState() {}, replaceState() {} },
    scrollY: 0, scrollTo() {}, setTimeout: (fn, ms) => { const timer = setTimeout(fn, ms); timer.unref?.(); return timer; }, clearTimeout,
    matchMedia: () => ({ matches: false }),
    localStorage: { getItem: (k) => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) },
    document: {
      baseURI: BASE + "workspace.html", getElementById: node, querySelector: () => null, querySelectorAll: () => [],
      // append() keeps the children: the screen's error alert (showErrorToast) reads firstChild / children[1] of the box it builds.
      createElement: () => {
        const el = { children: [], firstChild: null, textContent: "", innerHTML: "", setAttribute() {}, addEventListener() {}, classList: { add() {} } };
        el.append = (...kids) => { el.children = kids; el.firstChild = kids[0] ?? null; };
        return el;
      },
      body: { dataset: {}, appendChild() {} },
      addEventListener: (name, callback) => { if (!events.has(name)) events.set(name, []); events.get(name).push(callback); },
    },
    addEventListener() {},
    fetch: async (url, init = {}) => {
      const u = String(url);
      if (u.startsWith(API_BASE)) {
        const route = u.slice(API_BASE.length);
        let body = init.body;
        if (init.method === "POST" && route === "/archive-saved-papers") {
          let parsed = JSON.parse(body);
          if (wire.beforePost) parsed = wire.beforePost(parsed) || parsed;
          wire.posts.push(parsed);
          body = JSON.stringify(parsed);
        }
        const res = await workerHandle.mf.dispatchFetch("http://local/api" + route, { ...init, ...(body ? { body } : {}), headers: { ...(init.headers || {}), "X-Fixture-Role": "admin" } });
        const text = await res.text();
        let error = "";
        try { error = String(JSON.parse(text).error || ""); } catch { /* not JSON */ }
        wire.log.push({ route, method: init.method || "GET", status: res.status, error });
        return { ok: res.ok, status: res.status, json: async () => JSON.parse(text) };
      }
      if (options.shardFiles && u.startsWith(BASE + "data/archive2-catalog-shards-v1/")) {
        const bytes = options.shardFiles.get(new URL(u).pathname.split("/").pop());
        if (!bytes) return { ok: false, status: 404, arrayBuffer: async () => new ArrayBuffer(0) };
        const copy = Buffer.from(bytes);
        return { ok: true, status: 200, arrayBuffer: async () => copy.buffer.slice(copy.byteOffset, copy.byteOffset + copy.length) };
      }
      if (u.startsWith(BASE)) {
        const r = localFile(path.join(root, "archive"), decodeURIComponent(new URL(u).pathname.replace(/^\/archive\//, "")));
        return { ok: r.ok, status: r.status, text: async () => r.text(), json: async () => r.json() };
      }
      throw new Error("unexpected network request: " + u);
    },
    ...(options.shardFiles ? { Archive2CatalogShards: require("../../archive/archive2-catalog-shards.js") } : {}),
    Archive2Core: core, ProblemBankMeta: require("../../archive/problem-bank-meta.js"), Archive2Canonical: core.Canonical,
    Archive2Output: require("../../archive/archive2-output.js"), Archive2Papers: require("../../archive/archive2-papers.js"),
    Archive2History: require("../../archive/archive2-history.js"), Archive2Source: sourceForScreen,
    Archive2UnifiedUnits: require("../../archive/archive2-unified-units.js"), Archive2UnitTree: require("../../archive/archive2-unit-tree.js"),
    Archive2QuickPools: require("../../archive/archive2-quick-pools.js"),
    ProblemBankAssessmentRecipes: require("../../archive/problem-bank-assessment-recipes.js"), Archive2Similar: require("../../archive/archive2-similar.js"),
  });
  ctx.window = ctx;
  ctx.APMATH_API_BASE = API_BASE;
  storage.set("APMATH_SESSION", JSON.stringify({ id: "fixture-teacher", session_token: "fixture-token" }));
  loadWorkspace(ctx, `
    render = () => {};
    globalThis.ws = { state, scopeOptions, unifiedIndex, request, review, prepare, generate, savePapers, openSavedPaperRevision, applyDraft, draft, shardGlue: { shardCatalog, installCatalogDerived, ensureShards, ensureShardFiles, shardNeed } };
  `);
  const ws = ctx.ws;
  if (options.shardFiles) {
    // the screen's own first load from shards (grade of state.filters), installed the way loadCatalog installs it
    Object.assign(ws.state, { view: "compose", useMode: "general", ackWarnings: true });
    ws.bootFromShards = async () => {
      const first = await ws.shardGlue.shardCatalog();
      ws.shardGlue.installCatalogDerived(first);
      ws.state.catalog = first;
      return first;
    };
    return { ws, wire, seedMode: uuids.seedMode, click: async () => {}, change: async () => {} };
  }
  Object.assign(ws.state, {
    catalog, byUid: new Map(catalog.records.filter((r) => r.questionUid).map((r) => [r.questionUid, r])),
    finderIndex: core.buildFinderIndex(catalog), metaIndex: [], metaIndexSource: null, useMode: "general", indexVersion: catalog.indexVersion, ackWarnings: true,
  });
  // click(dataset): a screen button press (e.g. { action: "compose-grade", grade: "고1" }); change(filter, value): a compose select/checkbox change.
  // Both run the screen's own document handlers, so the state afterwards is what a teacher's press leaves behind.
  const click = async (dataset) => { for (const callback of events.get("click") || []) await callback({ target: { closest: () => ({ dataset }) } }); };
  const change = async (filter, value) => { for (const callback of events.get("change") || []) await callback({ target: { dataset: { group: "compose", filter }, value } }); };
  return { ws, wire, seedMode: uuids.seedMode, click, change };
}

// ---------------------------------------------------------------- Sample choice (rule-based, data-driven)
const IMAGE_REF = /(\bsrc\s*=\s*)(["'])([^"']+)\2|url\(\s*(["']?)([^)"'\s]+)(["']?\s*\))/gi;
export function imageRefs(question) {
  const refs = [];
  for (const f of ["image", "solutionImage"]) if (typeof question[f] === "string") refs.push(question[f]);
  for (const f of ["content", "question", "solution"])
    if (typeof question[f] === "string") for (const m of question[f].matchAll(IMAGE_REF)) refs.push(m[3] || m[5]);
  return refs.map((value) => {
    const raw = String(value).trim().replace(/\\/g, "/");
    if (!raw || /^(?:data:|blob:|https?:)/i.test(raw)) return "";
    const p = raw.split(/[?#]/, 1)[0];
    const i = p.toLowerCase().indexOf("assets/images/");
    return i < 0 ? "" : p.slice(i);
  }).filter(Boolean);
}
// What the Worker will store, estimated from the screen's own paper. The Worker keeps images as paths and lists each one in the snapshot's
// `assets` (path, sha256, size): it does not embed the picture bytes (only snapshots saved before that change did, and nothing reads them
// as a size model any more). So the size follows the text: the snapshot repeats the questions as bridge rows, filters and scope lists.
// Measured on 2026-11-20 (four 중3 two-unit, 20-question papers with 14-24 pictures): stored bytes were 3.7-4.5 times the paper's text bytes
// whatever the picture count (14 pictures 273,533 B; 24 pictures 269,466 B), and the samples of all five grades stored 10-18% of the limit.
// The factor below errs about 1.3 times above that, and each picture adds its asset row. The server limit itself is still checked on the real stored size (see the sample tests), not on this estimate.
const SNAPSHOT_TEXT_FACTOR = 6;
const ASSET_ROW_BYTES = 300;
export function estimateSnapshotBytes(paper) {
  let images = 0;
  for (const q of paper.questions) images += imageRefs(q).length;
  const text = Buffer.byteLength(JSON.stringify({ questions: paper.questions, meta: paper.meta }));
  return { bytes: text * SNAPSHOT_TEXT_FACTOR + images * ASSET_ROW_BYTES, images };
}
// Does the screen's restored question carry a metadata value that differs from the catalog record? (the S1 failure shape)
export function metadataDiffersFromCatalog(ws, paper) {
  return paper.questions.some((q) => {
    const record = ws.state.byUid.get(q.questionUid);
    return core.META_FIELDS.some((f) => record && record[f] !== undefined && q[f] !== undefined && JSON.stringify(q[f]) !== JSON.stringify(record[f]));
  });
}

export function configureSample(ws, seedMode, grade, scopeKeys, perUnit) {
  ws.state.filters = { grade, semanticSubject: "", originalCurriculum: "", curriculumKey: "", courseKey: "" };
  ws.state.sources = []; ws.state.buckets = [];
  ws.state.scopes = scopeKeys;
  ws.state.distribution = "equal";
  ws.state.count = perUnit;
  seedMode(true); // the seed is the first UUID of the fixed stream: identical for every probe and for the real run
  ws.generate(false);
  seedMode(false);
}

// Two units of one grade (screen order), `perUnit` questions each, whose paper stays well under the server limit.
// Preference: the pair that also exercises an image and a catalog/source metadata difference. Returns null when no pair fits.
export async function chooseSample(grade, { perUnit = 10, maxUnits = 10, budget = MAX_SAVED_PAPER_BYTES * 0.6 } = {}) {
  const { ws, seedMode } = createWorkspace({ mf: null });
  ws.state.filters = { grade, semanticSubject: "", originalCurriculum: "", curriculumKey: "", courseKey: "" };
  ws.state.sources = []; ws.state.buckets = [];
  // Every pair among the first `maxUnits` usable units, in screen order (deterministic): one image-heavy unit cannot empty the search.
  const units = ws.scopeOptions().filter((scope) => scope.count >= perUnit && !scope.unclassified).slice(0, maxUnits);
  let best = null;
  for (let i = 0; i < units.length; i++) for (let j = i + 1; j < units.length; j++) {
    const keys = [units[i].key, units[j].key];
    configureSample(ws, seedMode, grade, keys, perUnit);
    if (!ws.state.selected.length) continue;
    const papers = await ws.prepare();
    if (papers.length !== 1) continue;
    const estimate = estimateSnapshotBytes(papers[0]);
    if (estimate.bytes > budget) continue;
    const score = (estimate.images > 0 ? 1 : 0) + (metadataDiffersFromCatalog(ws, papers[0]) ? 2 : 0);
    if (!best || score > best.score) best = { keys, labels: [units[i].label, units[j].label], score, estimate, questions: ws.state.selected.length };
    if (best.score === 3) return best;
  }
  return best;
}
