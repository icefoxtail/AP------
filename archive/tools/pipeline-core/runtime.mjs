import fs from 'node:fs';
import path from 'node:path';
import { fileRef, objectSha, safePath } from './canonical.mjs';

const stripSuffix = value => value.replace(/[?#].*$/, '');
const isExternal = value => /^(?:https?:)?\/\//i.test(value);
const isIgnored = value => !value || /^(?:data:|blob:|#|javascript:)/i.test(value);
const posix = value => value.split(path.sep).join('/');

function localReference(from, reference) {
  const clean = stripSuffix(reference.trim());
  if (isIgnored(clean) || isExternal(clean)) return null;
  const base = path.posix.dirname(from);
  return path.posix.normalize(clean.startsWith('/') ? clean.slice(1) : path.posix.join(base, clean));
}

function documentReferences(text) {
  const refs = [];
  for (const match of text.matchAll(/<(?:script|link)\b[^>]*?(?:src|href)=["']([^"']+)["']/gi)) refs.push(match[1]);
  for (const match of text.matchAll(/@import\s+(?:url\()?\s*["']?([^"')\s]+)["']?\s*\)?/gi)) refs.push(match[1]);
  // Dynamic fallback URLs and pinned external scripts are part of the engine contract.
  for (const match of text.matchAll(/https?:\/\/[^\s"'`)<>]+/gi)) refs.push(match[0]);
  return refs;
}

function cssReferences(text) {
  const refs = documentReferences(text);
  for (const match of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) refs.push(match[1]);
  return refs;
}

function filesBelow(root, relativeDirectory) {
  const directory = safePath(root, relativeDirectory);
  const rows = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relative = path.posix.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) rows.push(...filesBelow(root, relative));
    else if (entry.isFile()) rows.push(relative);
  }
  return rows;
}

export function runtimeDependencyBundle(root, enginePath = 'archive/engine.html') {
  const pending = [enginePath], visited = new Set(), externalUrls = new Set();
  while (pending.length) {
    const relative = pending.shift();
    if (visited.has(relative)) continue;
    visited.add(relative);
    const bytes = fs.readFileSync(safePath(root, relative));
    const extension = path.posix.extname(relative).toLowerCase();
    const refs = extension === '.css' ? cssReferences(bytes.toString('utf8')) : extension === '.html' ? documentReferences(bytes.toString('utf8')) : [];
    for (const reference of refs) {
      if (isExternal(reference)) externalUrls.add(reference);
      else {
        const local = localReference(relative, reference);
        if (local) {
          if (!fs.existsSync(path.resolve(root, local))) throw new Error(`RUNTIME_DEPENDENCY_MISSING:${local}`);
          pending.push(local);
        }
      }
    }
    // MathJax selects font chunks dynamically. Bind the complete selected local
    // distribution so a changed loader/font cannot reuse an old render review.
    if (/^archive\/vendor\/mathjax-[^/]+\//.test(relative)) {
      const distribution = relative.split('/').slice(0, 3).join('/');
      for (const file of filesBelow(root, distribution)) pending.push(file);
    }
    // MathJax's accessibility/SRE and TeX extension loaders request files
    // dynamically (for example sre/speech-worker.js and mathmaps/*.json), so
    // static HTML/script discovery alone cannot bind the complete local
    // renderer runtime. Include the complete local MathJax loader tree.
    if ((relative === enginePath || /^archive\/vendor\/mathjax\//.test(relative)) && fs.existsSync(path.resolve(root, 'archive/vendor/mathjax'))) {
      for (const file of filesBelow(root, 'archive/vendor/mathjax')) pending.push(file);
    }
    // question-meta.js resolves its approved sidecar relative to engine.html
    // at runtime instead of declaring it as a static script reference.
    if ((relative === enginePath || relative === 'archive/question-meta.js') && fs.existsSync(path.resolve(root, 'archive/data/question_metadata.json'))) {
      pending.push('archive/data/question_metadata.json');
    }
  }
  const localFiles = [...visited].sort().map(relative => fileRef(root, relative));
  const payload = { schemaVersion: 'APMATH_RENDER_RUNTIME_BUNDLE_v1', enginePath, localFiles, externalUrls: [...externalUrls].sort() };
  return { ...payload, bundleSha: objectSha(payload) };
}

export function validateRuntimeBundle(root, run) {
  const errors = [];
  if (!run?.renderRuntime?.enginePath || !run?.renderRuntime?.bundleSha) return { status: 'BLOCKED', errors: ['RENDER_RUNTIME_BUNDLE_MISSING'] };
  let current;
  try { current = runtimeDependencyBundle(root, run.renderRuntime.enginePath); }
  catch (error) { return { status: 'BLOCKED', errors: [`RENDER_RUNTIME_DISCOVERY:${error.message}`] }; }
  if (current.bundleSha !== run.renderRuntime.bundleSha) errors.push('RENDER_RUNTIME_BUNDLE_STALE');
  const bound = new Map((run.inputs || []).map(ref => [ref.path, ref]));
  for (const ref of current.localFiles) {
    const input = bound.get(ref.path);
    const requiredRole = ref.path === current.enginePath ? 'engine' : 'runtime';
    if (!input || input.role !== requiredRole || input.bytes !== ref.bytes || input.sha256 !== ref.sha256) errors.push(`RENDER_RUNTIME_INPUT_UNBOUND:${ref.path}`);
  }
  const expectedPaths = current.localFiles.map(ref => ref.path).sort();
  const declaredPaths = (run.renderRuntime.localFiles || []).map(ref => ref.path).sort();
  if (JSON.stringify(expectedPaths) !== JSON.stringify(declaredPaths) || JSON.stringify(current.externalUrls) !== JSON.stringify(run.renderRuntime.externalUrls || [])) errors.push('RENDER_RUNTIME_MEMBERSHIP_STALE');
  return { status: errors.length ? 'BLOCKED' : 'PASS', errors, current };
}

export function addRuntimeInputs(run, bundle) {
  run.renderRuntime = bundle;
  const existing = new Set(run.inputs.map(ref => ref.path));
  for (const ref of bundle.localFiles) {
    if (existing.has(ref.path)) continue;
    run.inputs.push({ ...ref, role: ref.path === bundle.enginePath ? 'engine' : 'runtime' });
    existing.add(ref.path);
  }
  return run;
}
