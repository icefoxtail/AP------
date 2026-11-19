'use strict';
// How tests read and run the teacher workspace script (archive/archive2-workspace*.js).
//
// Tests must not care which file a function lives in, so they go through this helper:
//   readWorkspace()            the source text of every workspace script, in the order workspace.html loads them
//   readWorkspacePart(name)    one script's text ('main' = archive2-workspace.js, 'save' = archive2-workspace-save.js, ...)
//   assertWorkspaceScriptVersions(assert)
//                              every workspace script has a ?v= and no archive page asks for the same file with another ?v=
//   loadWorkspace(ctx, hook)   run the screen code in a vm context up to (not including) its boot block, then run `hook`
//                              (plain statements) where every screen-level name is in scope. `hook` may assign
//                              a screen function or variable (render = () => {}) the way the old inline hooks did.
//                              { boot: true } also runs the boot block (the hook runs before it starts).
//                              { until: '<text>' } stops the screen code just before the first line starting with <text>.
// The text of the screen code is read from the scripts workspace.html lists, never from a fixed file name.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const archiveDir = path.resolve(__dirname, '../../archive');
const MAIN = 'archive2-workspace.js';
const BOOT = '  (async () => {';

function workspaceFiles() {
  const html = fs.readFileSync(path.join(archiveDir, 'workspace.html'), 'utf8');
  const files = [...html.matchAll(/<script\b[^>]*\bsrc="(archive2-workspace(?:-[a-z]+)?\.js)(?:\?v=[^"]*)?"/g)].map(match => match[1]);
  return files.length ? files : [MAIN];
}
const readArchive = file => fs.readFileSync(path.join(archiveDir, file), 'utf8');
const readWorkspace = () => workspaceFiles().map(readArchive).join('\n');
const readWorkspacePart = name => readArchive(name === 'main' ? MAIN : `archive2-workspace-${name}.js`);

// ?v= of each workspace script in every archive page. Versions are not pinned to values (they change with every edit);
// the rule is "present, and the same everywhere the file is requested".
function workspaceScriptVersions() {
  const found = new Map();
  for (const name of fs.readdirSync(archiveDir).filter(file => file.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(archiveDir, name), 'utf8');
    for (const match of html.matchAll(/<script\b[^>]*\bsrc="(archive2-workspace(?:-[a-z]+)?\.js)(?:\?v=([^"]*))?"/g)) {
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

function loadWorkspace(target, hook = '', { boot = false, until = '' } = {}) {
  const ctx = vm.isContext(target) ? target : vm.createContext(target);
  const source = readArchive(MAIN);
  const startup = until ? source.indexOf(until) : source.lastIndexOf(BOOT);
  if (startup <= 0) throw new Error(until ? 'workspace stop marker was not found' : 'workspace network bootstrap was not found');
  const code = boot
    ? source.slice(0, startup) + hook + '\n' + source.slice(startup)
    : source.slice(0, startup) + hook + '\n})();';
  vm.runInContext(code, ctx, { filename: MAIN });
  return ctx;
}

module.exports = { readWorkspace, readWorkspacePart, loadWorkspace, workspaceFiles, workspaceScriptVersions, assertWorkspaceScriptVersions };
