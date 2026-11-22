// Static reference graph of the render code (ESM imports, python imports, python scripts named in .mjs files).
// Used by (a) the kind table soundness test and (b) test selection of --tests. It reads files only; it never runs them.
import fs from 'node:fs';
import path from 'node:path';

const GE = 'archive/tools/geometry-equation';
const JS_RE = /\.(mjs|cjs|js)$/;

const JS_PATTERNS = [
  {re: /\bimport\s+(?:[^'"()]*?\sfrom\s*)?['"]([^'"]+)['"]/g, lazy: false},
  {re: /\bexport\s+[^'"]*?\sfrom\s*['"]([^'"]+)['"]/g, lazy: false},
  {re: /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g, lazy: true},
  {re: /new URL\(\s*['"]([^'"]+)['"]\s*,\s*import\.meta\.url/g, lazy: false},
  {re: /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g, lazy: false}
];

// ignoreNameEdgesFrom: files that merely list python file names (fingerprint.mjs hashes them for stage caching) are not users of those files.
export function buildCodeGraph(root, entries, {maxNodes = 5000, ignoreNameEdgesFrom = [`${GE}/production/fingerprint.mjs`]} = {}) {
  const exists = f => { try { return fs.statSync(path.join(root, f)).isFile(); } catch { return false; } };
  const edges = new Map(); // file -> [{to, lazy}]
  const queue = [...entries];
  const seen = new Set();
  while (queue.length && seen.size < maxNodes) {
    const f = queue.pop();
    if (seen.has(f) || !exists(f)) continue;
    seen.add(f);
    const text = fs.readFileSync(path.join(root, f), 'utf8');
    const out = [];
    const add = (to, lazy) => { if (to && exists(to) && to !== f) { out.push({to, lazy}); queue.push(to); } };
    const dir = path.posix.dirname(f);
    if (JS_RE.test(f)) {
      for (const {re, lazy} of JS_PATTERNS) for (const m of text.matchAll(re)) {
        const s = m[1];
        if (s.startsWith('.')) add(path.posix.normalize(path.posix.join(dir, s)), lazy);
      }
      // python scripts named as string literals ('worker.py'); only names that exist next to this file or in production/
      if (!ignoreNameEdgesFrom.includes(f)) for (const m of text.matchAll(/['"`]([A-Za-z0-9_.\/-]+\.py)['"`]/g)) {
        for (const base of [dir, `${GE}/production`, GE]) { const c = path.posix.normalize(path.posix.join(base, m[1])); if (exists(c)) { add(c, false); break; } }
      }
    } else if (f.endsWith('.py')) {
      const lines = text.split('\n');
      for (const line of lines) {
        const m = line.match(/^(\s*)(?:from\s+([A-Za-z_.][\w.]*)\s+import\s+(.*)|import\s+([A-Za-z_][\w., ]*))/);
        if (!m) continue;
        const lazy = m[1].length > 0;
        const mods = m[2] ? [[m[2], m[3]]] : m[4].split(',').map(s => [s.trim().split(/\s+as\s+/)[0], '']);
        for (const [mod, names] of mods) {
          const cands = [];
          if (mod.startsWith('.')) {
            const base = mod.replace(/^\.+/, '');
            if (base) cands.push(path.posix.join(dir, base.replace(/\./g, '/') + '.py'));
            else for (const n of String(names).split(',')) cands.push(path.posix.join(dir, n.trim().split(/\s+as\s+/)[0] + '.py'));
          } else {
            const parts = mod.split('.').join('/');
            cands.push(path.posix.join(dir, parts + '.py'), path.posix.join(GE, parts + '.py'), path.posix.join(GE, 'production', parts + '.py'));
          }
          for (const c of cands) if (exists(c)) { add(c, lazy); break; }
        }
      }
    }
    edges.set(f, out);
  }
  const importers = new Map();
  for (const [from, list] of edges) for (const {to, lazy} of list) (importers.get(to) ?? importers.set(to, []).get(to)).push({from, lazy});
  return {nodes: seen, edges, importers};
}

// Forward closure of one file in a graph.
export function closureOf(graph, start) {
  const out = new Set(); const q = [start];
  while (q.length) { const f = q.pop(); if (out.has(f)) continue; out.add(f); for (const {to} of graph.edges.get(f) ?? []) q.push(to); }
  return out;
}
