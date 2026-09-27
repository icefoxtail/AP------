const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../../archive/archive2-core.js');
const catalog = core.decodeCatalog(require('../../archive/data/archive2-catalog.json'));
const archiveDir = path.resolve(__dirname, '../../archive');
const workspaceSource = fs.readFileSync(path.join(archiveDir, 'archive2-workspace.js'), 'utf8');

function workspace(filters = { grade: '중1' }, data = catalog) {
  const listeners = {}, controls = {};
  const window = { Archive2Core: core };
  vm.runInNewContext(workspaceSource.slice(0, workspaceSource.indexOf('  document.addEventListener("submit"')) +
    '\nrender = () => {}; scheduleSave = () => {}; window.scopeTest = { state, scopeOptions, renderScopes, selectedScopePaths, taxonomyRowsForFilters };\n})();', {
    window, crypto,
    document: { addEventListener: (name, fn) => listeners[name] = fn, getElementById: id => controls[id] },
  });
  Object.assign(window.scopeTest.state, { catalog: data, filters });
  return { ...window.scopeTest, controls, click: dataset => listeners.click({ target: { closest: () => ({ dataset }) } }) };
}

async function productionCatalog() {
  const window = { Archive2Core: core };
  vm.runInNewContext(fs.readFileSync(path.join(archiveDir, 'meta-foundation-runtime.js'), 'utf8'), {
    window, document: { baseURI: 'https://scope.test/archive/' }, URL, console,
    fetch: async url => {
      const file = path.join(archiveDir, new URL(url).pathname.replace(/^\/archive\//, ''));
      return { ok: fs.existsSync(file), status: fs.existsSync(file) ? 200 : 404,
        json: async () => JSON.parse(fs.readFileSync(file, 'utf8')) };
    },
  });
  const data = await window.applyArchiveMetaFoundationCatalog(catalog);
  return { data, runtime: window.ARCHIVE_META_FOUNDATION_RUNTIME };
}

function filterCases() {
  const cases = [];
  for (const curriculumKey of ['', '2015', '2022']) {
    for (const grade of ['중1', '중2', '중3'])
      for (const courseKey of ['', `M${grade[1]}-1`, `M${grade[1]}-2`])
        cases.push({ grade, curriculumKey, courseKey });
    for (const semanticSubject of ['', ...core.subjectProjectionOptions('고1').map(s => s.value)])
      cases.push({ grade: '고1', curriculumKey, semanticSubject });
    for (const grade of ['고2', '고3'])
      for (const { value: semanticSubject } of core.highSemanticSubjectOptions())
        cases.push({ grade, curriculumKey, semanticSubject });
  }
  return cases;
}

module.exports = { core, catalog, workspace, productionCatalog, filterCases };
