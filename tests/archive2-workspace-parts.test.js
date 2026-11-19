// The teacher workspace screen code is several scripts that share window.Archive2Workspace (docs/agents/archive2-code.md,
// "교사 화면 코드(archive2-workspace*.js) 파일 지도"). Each script lists the names it takes from the others in a header
// (`let …;` + WS.links.push) and publishes its own names with Object.assign(WS.api, {…}). These checks catch the mistakes
// that only show up when a teacher clicks: a name used from another script but not listed in the header, an import nobody
// publishes, a script loaded in the wrong order, or a script missing from the Pages package.
// No file hashes or sizes are pinned.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { workspaceFiles, readWorkspacePart, loadWorkspace, assertWorkspaceScriptVersions } = require('./helpers/archive2-workspace-source.cjs');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'archive/workspace.html'), 'utf8');
const files = workspaceFiles();
const partFiles = files.slice(0, -1);
const textOf = file => fs.readFileSync(path.join(root, 'archive', file), 'utf8');
const stripComments = text => text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|\s)\/\/[^\n]*/g, '$1');

// names a script takes from the others: the `let` list under "names defined in other parts"
function importedNames(text) {
  const match = text.match(/names defined in other parts[^\n]*\n {2}let\s+([\s\S]*?);\n {2}WS\.links\.push/);
  return match ? match[1].split(',').map(name => name.trim()).filter(Boolean) : [];
}
// names a script publishes: every Object.assign(WS.api, {…}) block
function exportedNames(text) {
  const names = [];
  for (const match of text.matchAll(/Object\.assign\(WS\.api, \{([\s\S]*?)\n {2}\}\);/g))
    names.push(...match[1].split(',').map(name => name.trim()).filter(Boolean));
  return names;
}

test('workspace.html loads the workspace scripts in order: core, find, compose, preview, save, recent, then main last', () => {
  assert.deepEqual(files, [
    'archive2-workspace-core.js', 'archive2-workspace-find.js', 'archive2-workspace-compose.js',
    'archive2-workspace-preview.js', 'archive2-workspace-save.js', 'archive2-workspace-recent.js', 'archive2-workspace.js',
  ]);
  const position = file => html.indexOf('src="' + file);
  assert.ok(position('archive2-library.js') > 0 && position('archive2-library.js') < position(files[0]), 'after the scripts they read (library is the last of them)');
  for (let i = 1; i < files.length; i++) assert.ok(position(files[i - 1]) < position(files[i]), files[i] + ' comes after ' + files[i - 1]);
  const afterMain = html.slice(position(files[files.length - 1]), html.indexOf('</head>'));
  assert.equal(afterMain.split('<script').length, 1, 'main is the last script of the page head');
  for (const file of files) assert.match(html, new RegExp('<script defer src="' + file.replace(/\./g, '\\.') + '\\?v='), file + ' is deferred');
  assertWorkspaceScriptVersions(assert);
});

test('every workspace script is in the Pages package', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'tools/archive-pages-release-manifest.json'), 'utf8'));
  for (const file of files) assert.ok(manifest.archiveRootFiles.includes(file), file + ' is listed in archiveRootFiles');
});

test('only main starts the boot block, and each script is one strict IIFE', () => {
  for (const file of partFiles) {
    const text = textOf(file);
    assert.doesNotMatch(text, /^ {2}\(async \(\) => \{/m, file + ' must not boot');
    assert.match(text, /^\(function \(\) \{\n {2}"use strict";\n/m, file + ' is a strict IIFE');
  }
  assert.match(textOf('archive2-workspace.js'), /^ {2}\(async \(\) => \{\n {4}readUrl\(\);/m);
});

test('every name a script imports is published by exactly one other script, and nobody imports its own names', () => {
  const owners = new Map();
  for (const file of files) for (const name of exportedNames(textOf(file))) {
    assert.ok(!owners.has(name), name + ' is published by both ' + owners.get(name) + ' and ' + file);
    owners.set(name, file);
  }
  for (const file of files) for (const name of importedNames(textOf(file))) {
    assert.ok(owners.has(name), file + ' imports ' + name + ' but no script publishes it');
    assert.notEqual(owners.get(name), file, file + ' imports its own ' + name);
  }
});

function stubContext() {
  const node = () => ({ addEventListener() {}, classList: { toggle() {}, add() {}, remove() {} }, dataset: {}, querySelectorAll: () => [] });
  const context = {
    console, URL, URLSearchParams, Date, structuredClone, Intl, crypto,
    location: new URL('https://test.invalid/archive/workspace.html?view=home'),
    history: { state: null, pushState() {}, replaceState() {} },
    localStorage: { getItem: () => null, setItem() {} }, sessionStorage: { getItem: () => null, setItem() {} },
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }), scrollTo() {},
    document: { getElementById: node, querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, body: { dataset: {} } },
    addEventListener() {},
  };
  context.window = context;
  const ctx = vm.createContext(context);
  // modules the workspace only calls later: empty stand-ins are enough to check the linking
  for (const name of ['Archive2QuickPools', 'Archive2UnitTree', 'Archive2UnifiedUnits', 'Archive2Output', 'Archive2Papers', 'Archive2Similar', 'Archive2Source', 'ProblemBankAssessmentRecipes']) ctx[name] = {};
  // the scripts the workspace reads at load time, loaded the way workspace.html loads them
  for (const file of ['problem-bank-meta.js', 'archive2-canonical.js', 'archive2-core.js', 'archive2-history.js'])
    vm.runInContext(textOf(file), ctx, { filename: file });
  return ctx;
}

test('after loading, every imported name is defined and every V.name has an initial value', () => {
  const ctx = loadWorkspace(stubContext());
  const WS = ctx.Archive2Workspace;
  assert.ok(WS && WS.api && WS.v, 'the core script created window.Archive2Workspace');
  for (const file of files) for (const name of importedNames(textOf(file)))
    assert.notEqual(WS.api[name], undefined, file + ' imports ' + name + ' but it is undefined after loading');
  const used = new Set();
  for (const file of files) for (const match of textOf(file).matchAll(/\bV\.(\w+)/g)) used.add(match[1]);
  assert.ok(used.size > 0);
  for (const name of used) assert.ok(name in WS.v, 'V.' + name + ' is never initialised');
});

// Without a parser in the repository this is a text check: a name that another script publishes and this script uses
// as a plain identifier must be imported here (or declared locally). It cannot see every case, but it catches the common one:
// calling a function that lives in another part without adding it to the header.
test('a script does not use another script\'s names without importing them', () => {
  const owners = new Map();
  for (const file of files) for (const name of exportedNames(textOf(file))) owners.set(name, file);
  const problems = [];
  for (const file of files) {
    // the header (imports) and the export blocks are not uses
    const text = stripComments(textOf(file)
      .replace(/\n {2}\/\/ names defined in other parts[\s\S]*?\n {2}\}\);\n/, '\n')
      .replace(/Object\.assign\(WS\.api, \{[\s\S]*?\n {2}\}\);/g, ''));
    const imported = new Set(importedNames(textOf(file)));
    const own = new Set(exportedNames(textOf(file)));
    for (const [name, owner] of owners) {
      if (owner === file || imported.has(name) || own.has(name)) continue;
      const escaped = name.replace(/\$/g, '\\$');
      const declaredHere = new RegExp('\\b(?:const|let|var|function|class)\\s+' + escaped + '\\b|[(,{]\\s*' + escaped + '\\s*(?:=[^=>]|[,)}])|\\b' + escaped + '\\s*=>').test(text);
      if (declaredHere) continue;
      const used = new RegExp('(?<![\\w$.\'"`#-])' + escaped + '(?![\\w$\'"`:-])').test(text);
      if (used) problems.push(file + ' uses ' + name + ' (published by ' + owner + ') without importing it');
    }
  }
  assert.deepEqual(problems, []);
});

test('the scripts together still hold the original entry points other pages call', () => {
  const all = files.map(file => readWorkspacePart(file === 'archive2-workspace.js' ? 'main' : file.replace(/^archive2-workspace-|\.js$/g, ''))).join('\n');
  for (const name of ['Archive2Api', 'Archive2WorkspaceSavedPaperIssue', 'Archive2WorkspaceOpenAssignmentStatus', 'Archive2WorkspaceShowSavedLibrary', 'Archive2WorkspaceShowSavedPaper'])
    assert.match(all, new RegExp('window\\.' + name + ' = '), 'window.' + name + ' is still published');
});
