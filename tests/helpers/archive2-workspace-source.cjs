'use strict';
// How tests read and run the teacher workspace scripts (archive/archive2-workspace*.js).
//
// The screen code is split into several scripts that share window.Archive2Workspace (see docs/agents/archive2-code.md).
// Tests must not care which script a function lives in, so they go through this helper:
//   readWorkspace()            the source text of every workspace script, in the order workspace.html loads them
//   readWorkspacePart(name)    one script's text ('main' = archive2-workspace.js, 'save' = archive2-workspace-save.js, ...)
//   workspaceFunction(text, header)
//                              one top-level function's text (header line to closing brace)
//   loadWorkspace(ctx, hook)   run the screen code in a vm context up to (not including) its boot block, then run `hook`
//                              (plain statements) with every screen-level name in scope, the way the old inline hooks did.
//                              A hook may assign a screen function or variable (render = () => {}); the helper makes the
//                              assignment reach the callers inside the script that owns the function too.
//                              { boot: true } also runs the boot block (the hook then runs right after the boot's first
//                              synchronous step). { until: '<text>' } stops the main script just before <text>.
//   assertWorkspaceScriptVersions(assert)
//                              every workspace script has a ?v= and no archive page asks for the same file with another ?v=
// The scripts are taken from the <script> tags of workspace.html, never from a fixed list of file names.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const archiveDir = path.resolve(__dirname, '../../archive');
const MAIN = 'archive2-workspace.js';
const BOOT = '  (async () => {';
const SCRIPT_TAG = /<script\b[^>]*\bsrc="(archive2-workspace(?:-[a-z]+)?\.js)(?:\?v=([^"]*))?"/g;

const readArchive = file => fs.readFileSync(path.join(archiveDir, file), 'utf8');
function workspaceFiles() {
  const files = [...readArchive('workspace.html').matchAll(SCRIPT_TAG)].map(match => match[1]);
  return files.length ? files : [MAIN];
}
const readWorkspace = () => workspaceFiles().map(readArchive).join('\n');
const readWorkspacePart = name => readArchive(name === 'main' ? MAIN : `archive2-workspace-${name}.js`);

// ?v= of each workspace script in every archive page. Versions are not pinned to values (they change with every edit);
// the rule is "present, and the same everywhere the file is requested".
function workspaceScriptVersions() {
  const found = new Map();
  for (const name of fs.readdirSync(archiveDir).filter(file => file.endsWith('.html'))) {
    for (const match of readArchive(name).matchAll(SCRIPT_TAG)) {
      if (!found.has(match[1])) found.set(match[1], []);
      found.get(match[1]).push(match[2] || '');
    }
  }
  return found;
}
function assertWorkspaceScriptVersions(assert) {
  const versions = workspaceScriptVersions();
  for (const file of workspaceFiles()) {
    const list = versions.get(file) || [];
    assert.ok(list.length > 0 && list.every(version => /^[\w.-]+$/.test(version)), file + ' is loaded with a ?v= cache version');
    assert.equal(new Set(list).size, 1, file + ' is requested with one ?v= everywhere');
  }
}

// The text of one top-level function of the workspace code: from its header line to its closing brace (two-space indent).
function workspaceFunction(text, header) {
  const start = text.indexOf(header);
  if (start < 0) return '';
  const end = text.indexOf('\n  }\n', start);
  return end < 0 ? '' : text.slice(start, end + 5);
}

const declaredNames = text => [...text.matchAll(/^ {2}(?:async )?function (\w+)\(|^ {2}const (\w+) = /gm)].map(match => match[1] || match[2]);
const assignsName = (hook, name) => new RegExp('(?<![\\w.$])' + name.replace(/\$/g, '\\$') + '\\s*=(?![=>])').test(hook);

// A hook that reassigns a screen function (render = () => {}) must also reach callers inside the same script. The function is
// renamed and a `let` of the old name takes its place; the hook's assignment goes through a setter.
function bindAssignedFunctions(text, assigned) {
  const names = [];
  let out = text;
  for (const name of assigned) {
    const declaration = new RegExp('^ {2}(async )?function ' + name + '\\(', 'm');
    if (!declaration.test(out)) continue;
    out = out.replace(declaration, (_all, asyncKeyword) => '  ' + (asyncKeyword || '') + 'function __original_' + name + '(');
    names.push(name);
  }
  if (!names.length) return text;
  const lets = names.map(name => `  let ${name} = __original_${name};\n  WS.api.__set_${name} = value => { ${name} = value; };`).join('\n');
  return out.replace('  const V = WS.v;', all => all + '\n' + lets);
}

function loadWorkspace(target, hook = '', { boot = false, until = '' } = {}) {
  const ctx = vm.isContext(target) ? target : vm.createContext(target);
  const files = workspaceFiles();
  const parts = files.slice(0, -1);
  const main = readArchive(files[files.length - 1]);
  const cut = until ? main.indexOf(until) : main.lastIndexOf(BOOT);
  if (cut <= 0) throw new Error(until ? 'workspace stop marker was not found' : 'workspace network bootstrap was not found');
  if (!parts.length) {
    vm.runInContext(boot ? main.slice(0, cut) + hook + '\n' + main.slice(cut) : main.slice(0, cut) + hook + '\n})();', ctx, { filename: MAIN });
    return ctx;
  }
  const texts = parts.map(readArchive);
  const known = new Set([...texts, main].flatMap(declaredNames));
  const assigned = [...known].filter(name => assignsName(hook, name));
  parts.forEach((file, index) => vm.runInContext(bindAssignedFunctions(texts[index], assigned), ctx, { filename: file }));
  const mainText = boot ? main : main.slice(0, cut) + '\n})();';
  vm.runInContext(bindAssignedFunctions(mainText, assigned), ctx, { filename: MAIN });
  const WS = ctx.Archive2Workspace || ctx.window.Archive2Workspace;
  const scope = new Proxy({}, {
    has: (_target, key) => typeof key === 'string' && (key in WS.api || key in WS.v || assigned.includes(key)),
    get: (_target, key) => (key in WS.v ? WS.v[key] : WS.api[key]),
    set: (_target, key, value) => {
      if (key in WS.v) WS.v[key] = value;
      else {
        if (WS.api['__set_' + key]) WS.api['__set_' + key](value);
        WS.api[key] = value;
        WS.link();
      }
      return true;
    },
  });
  ctx.__workspaceScope = scope;
  try { vm.runInContext('with (__workspaceScope) {' + hook + '\n}', ctx, { filename: 'workspace-hook.js' }); }
  finally { delete ctx.__workspaceScope; }
  return ctx;
}

module.exports = { readWorkspace, readWorkspacePart, workspaceFunction, loadWorkspace, workspaceFiles, workspaceScriptVersions, assertWorkspaceScriptVersions };
