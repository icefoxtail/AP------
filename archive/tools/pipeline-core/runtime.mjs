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
  // Runtime code can load same-origin resources through URL constructors
  // rather than a static script/link tag (for example the approved archive
  // metadata sidecar). These bytes are part of the render closure too.
  for (const match of text.matchAll(/new\s+URL\(\s*["']([^"']+)["']\s*,\s*document\.baseURI/gi)) if (!match[1].endsWith('/')) refs.push(match[1]);
  // question-meta.js resolves this resource dynamically with new URL(), so
  // it is not discoverable from a script/link tag. Keep it in the bound
  // runtime packet instead of letting the browser make an unbound request.
  if (/question_metadata\.json/i.test(text)) refs.push('data/question_metadata.json');
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
    const text = bytes.toString('utf8');
    const extension = path.posix.extname(relative).toLowerCase();
    const refs = extension === '.css' ? cssReferences(text) : extension === '.html' || extension === '.js' ? documentReferences(text) : [];
    // The archive engine loads question-meta.js dynamically, which in turn
    // fetches this JSON through new URL() after the static dependency walk.
    // Bind the current metadata file explicitly for deterministic capture.
    if (relative === enginePath && enginePath === 'archive/engine.html' && fs.existsSync(path.resolve(root, 'archive/data/question_metadata.json'))) refs.push('data/question_metadata.json');
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
    // engine.html configures a second local MathJax loader path dynamically
    // (`AP_VENDOR_BASE + 'mathjax'`). Bind that complete distribution so
    // extensions such as [tex]/boldsymbol cannot become unbound requests.
    if (extension === '.html' && /loader\s*:\s*\{[\s\S]*mathjax\s*:/i.test(text)) {
      for (const file of filesBelow(root, 'archive/vendor/mathjax')) pending.push(file);
    }
    // engine.html asks MathJax to autoload [tex]/boldsymbol. That extension
    // lives in the base MathJax tree rather than the pinned tex/font bundle,
    // so bind the exact dynamic extension explicitly.
    if (relative === enginePath && /boldsymbol/i.test(bytes.toString('utf8'))) pending.push('archive/vendor/mathjax/input/tex/extensions/boldsymbol.js');
    // The local MathJax bundle starts its accessibility speech worker at
    // runtime. It is loaded by importScripts(), so the static dependency walk
    // cannot discover it from HTML/JS tags; bind the repository copy.
    if (relative === enginePath && fs.existsSync(path.resolve(root, 'archive/vendor/mathjax/sre/speech-worker.js'))) {
      for (const file of filesBelow(root, 'archive/vendor/mathjax/sre')) pending.push(file);
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
