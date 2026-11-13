'use strict';

// Task-scoped observation of the unmodified, registered Archive UI.
// Reuses the local teacher fixture and actual finder controls of the repository's
// official middle RPM browser check. No exercise or classification is injected.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');

const root = path.resolve(process.argv[2] || '');
const inputPath = path.resolve(process.argv[3] || '');
const directory = path.resolve(process.argv[4] || '');
const expectedMain = process.env.EXPECTED_MAIN_SHA;
assert(expectedMain && process.env.CHROME_BIN, 'exact main SHA and Google Chrome are required');
const mainSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
assert.equal(mainSha, expectedMain, 'checkout is the registered main snapshot');
const inputBytes = fs.readFileSync(inputPath);
const input = JSON.parse(inputBytes);
const source = 'original/middle/m1/2mid/26_신흥중_2학기_중간_중1_기출.js';
const sourceBytes = fs.readFileSync(path.join(root, 'archive/exams', source));
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(sha256(inputBytes), '948b05e71dab0730fa175355d9cf3773852c7f90260089597ce840a8e48ff0da', 'independently reviewed report input bytes');
assert.equal(sha256(sourceBytes), input.sourceRawSha256, 'source is the frozen reviewed candidate');
assert.equal(input.rows.length, 24);
assert.equal(new Set(input.rows.map(row => row.questionUid)).size, 24);
const rpmGapUids = Object.freeze({
  8: 'qid_v1_b6c658fe81fb556f0b50dd0a137ae096115f366d679b1e1afd05b3346cb72b27',
  10: 'qid_v1_d47f3ed83f1c4b59063a208d4fa43128aedd4985161b81e7853068df7d0af269',
});
assert.deepEqual(input.rows.filter(row => row.effectiveRpmL1L2 === null).map(row => row.sourceOrdinal), [8, 10]);
fs.mkdirSync(directory, { recursive: true });
const report = {
  schemaVersion: 'm1-shinheung-registered-real-chrome-v1', status: 'RUNNING',
  mainSha, source, sourceRawSha256: sha256(sourceBytes),
  reportInputSha256: sha256(inputBytes), checkerSha256: sha256(fs.readFileSync(__filename)),
  dataSource: 'Unmodified registered runtime catalog and actual finder controls',
  fixture: 'Existing repository local-only teacher fixture; no question or metadata fixtures',
  mathematicalReviewPerformed: false, expectedQuestions: 24, observations: [], searches: [],
  passScope: '24 native parents/PT/TPL/eligibility and search/select/reverse; RPM exact parents 23, explicit ambiguous HOLD 1; exact leaves 22, leaf HOLDs 2',
  classificationCounts: null,
  screenshots: [], pageErrors: [], blockedWrites: [],
};

const server = http.createServer((req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404); res.end(); return;
    }
    const mime = { '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html',
      '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' }[path.extname(file)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
  } catch (error) { res.writeHead(500); res.end(String(error)); }
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, headless: true });
    report.browserVersion = await browser.version();
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
    await context.route('**/*', route => {
      const request = route.request();
      if (!['GET', 'HEAD'].includes(request.method())) {
        report.blockedWrites.push({ method: request.method(), url: request.url().split('?')[0] });
        return route.abort();
      }
      if (/workers\.dev|supabase\.co/.test(new URL(request.url()).hostname)) return route.abort();
      return route.continue();
    });
    await context.addInitScript(() => {
      if (['127.0.0.1', 'localhost'].includes(location.hostname))
        localStorage.setItem('APMATH_SESSION', JSON.stringify({ id: 'local-read-only', role: 'teacher' }));
    });
    const page = await context.newPage();
    page.on('pageerror', error => report.pageErrors.push(error.message));
    const url = `http://127.0.0.1:${server.address().port}/archive/workspace.html?view=find`;
    await page.goto(url);
    await page.waitForFunction(() => window.ARCHIVE2_FINAL_CATALOG?.records?.length &&
      window.UnitPastExamsCore && document.getElementById('finder-query'), null, { timeout: 60000 });
    const observed = await page.evaluate(target => {
      const C = window.Archive2Core, U = window.UnitPastExamsCore;
      const catalog = window.ARCHIVE2_FINAL_CATALOG;
      const examIndex = catalog.exams.findIndex(exam => C.normalizeFile(exam.file) === target);
      return { examIndex, rows: catalog.records.filter(record => C.normalizeFile(record.sourceFile) === target).map(record => {
        const resolution = U.resolveRpmParent(record, 'm1');
        const rpm = record.metadataAssignmentEvidence?.rpmMetadata;
        return { questionUid: record.questionUid, problemTypeKey: record.problemTypeKey, templateKey: record.templateKey,
          nativeL1L2: [record.nativeL1 || record.L1, record.nativeL2 || record.L2],
          rpmMetadataFieldPresence: Object.fromEntries(['rpmL1', 'rpmL2', 'rpmL3', 'rpmL4', 'rpmSemanticStatus']
            .map(field => [field, Object.prototype.hasOwnProperty.call(rpm || {}, field)])),
          rpmSemanticStatus: rpm?.rpmSemanticStatus,
          flatRpmL1L4: [rpm?.rpmL1, rpm?.rpmL2, rpm?.rpmL3, rpm?.rpmL4],
          rpmPrimaryPathPresent: Object.prototype.hasOwnProperty.call(record, 'rpmPrimaryPath'),
          rpmPrimaryPath: record.rpmPrimaryPath ?? null,
          parentStatus: resolution.status, parentKey: resolution.parentKey,
          parentReason: resolution.reason, parentGranularity: resolution.granularity ?? null,
          parentBasis: resolution.basis ?? null, baseLeafKey: resolution.baseLeafKey,
          candidateParentKeys: resolution.candidateParentKeys || [],
          crosswalkRecordIds: resolution.crosswalkRecordIds || [],
          effectiveRpmL1L2: resolution.parent ? [resolution.parent.L1, resolution.parent.L2] : null,
          selectionSubUnitKey: U.getSelectionSubUnitKey(record),
          selectionSubUnitLabel: U.getSelectionSubUnitLabel(record),
          generalUseEligible: C.generalUseEligibility(record).ok };
      }) };
    }, source);
    assert(observed.examIndex >= 0, 'exact original exam is in actual catalog');
    assert.deepEqual(observed.rows.map(row => row.questionUid).sort(), input.rows.map(row => row.questionUid).sort());
    report.observations = observed.rows;
    const visibleSourceControl = async () => {
      const control = page.locator(`[data-action="source-toggle"][data-exam="${observed.examIndex}"]`);
      await control.waitFor({ state: 'attached', timeout: 10000 });
      const details = control.locator('xpath=ancestor::details[1]');
      // source-toggle rerenders this menu closed; reopen the fresh DOM through its real summary.
      if (await details.getAttribute('open') === null) await details.locator('summary').click();
      await control.waitFor({ state: 'visible', timeout: 10000 });
      assert.notEqual(await details.getAttribute('open'), null, 'source menu is open through actual UI');
      return control;
    };
    for (const expected of input.rows) {
      const actual = observed.rows.find(row => row.questionUid === expected.questionUid);
      const nativeParent = [expected.targetParentRef.majorUnit, expected.targetParentRef.midUnit];
      const parent = expected.effectiveRpmL1L2 || [expected.targetParentRef.majorUnit, expected.targetParentRef.midUnit];
      assert.deepEqual(actual.nativeL1L2, nativeParent, `Q${expected.sourceOrdinal} registered native parents`);
      assert.equal(actual.problemTypeKey, expected.nativeProblemTypeKey, `Q${expected.sourceOrdinal} official PT`);
      assert.equal(actual.templateKey, expected.nativeTemplateKey, `Q${expected.sourceOrdinal} official TPL`);
      assert.equal(actual.generalUseEligible, true, `Q${expected.sourceOrdinal} actual catalog eligibility`);
      assert.deepEqual(actual.rpmMetadataFieldPresence, {
        rpmL1: true, rpmL2: true, rpmL3: true, rpmL4: true, rpmSemanticStatus: true,
      }, `Q${expected.sourceOrdinal} actual bound RPM fields`);
      const isGap = Object.prototype.hasOwnProperty.call(rpmGapUids, expected.sourceOrdinal);
      if (isGap) {
        assert.equal(expected.questionUid, rpmGapUids[expected.sourceOrdinal], 'HOLD is limited to the exact reviewed ordinal/UID');
        assert.equal(actual.rpmSemanticStatus, 'HOLD', `Q${expected.sourceOrdinal} explicit RPM leaf HOLD`);
        assert.deepEqual(actual.flatRpmL1L4, [null, null, null, null], `Q${expected.sourceOrdinal} no invented flat RPM values`);
        assert.equal(actual.rpmPrimaryPath, null, `Q${expected.sourceOrdinal} no invented RPM primary path`);
        assert.equal(actual.baseLeafKey, '', `Q${expected.sourceOrdinal} no invented RPM leaf key`);
        assert.deepEqual(actual.crosswalkRecordIds, [], `Q${expected.sourceOrdinal} no invented exact leaf crosswalk`);
      } else {
        assert.equal(actual.parentGranularity, 'LEAF', `Q${expected.sourceOrdinal} exact leaf granularity`);
        assert.equal(actual.parentBasis, 'BOUND_RPM_METADATA_PATH', `Q${expected.sourceOrdinal} bound RPM leaf evidence`);
        assert.equal(typeof actual.baseLeafKey, 'string');
        assert(actual.baseLeafKey.length > 0, `Q${expected.sourceOrdinal} official leaf key exists`);
        assert(actual.flatRpmL1L4.every(value => typeof value === 'string' && value.length > 0),
          `Q${expected.sourceOrdinal} complete bound RPM leaf`);
      }
      if (expected.sourceOrdinal === 8) {
        assert.equal(actual.questionUid, rpmGapUids[8]);
        assert.deepEqual(actual.nativeL1L2, ['기본 도형', '위치 관계']);
        assert.equal(actual.parentStatus, 'LEGACY_PARENT_AMBIGUOUS', 'Q8 explicit fail-closed RPM parent');
        assert.equal(actual.parentReason, 'LEGACY_SUBUNIT_HAS_MULTIPLE_PARENTS');
        assert.equal(actual.effectiveRpmL1L2, null);
        assert.equal(actual.parentKey, '');
        assert.equal(actual.parentGranularity, null);
        assert.equal(actual.parentBasis, null);
        assert.equal(actual.selectionSubUnitKey, '');
        assert.equal(actual.selectionSubUnitLabel, '소단원 분류 확인 필요');
        assert.deepEqual(actual.candidateParentKeys.slice().sort(), [
          JSON.stringify(['2022', 'M1-2', '기본 도형', '기본 도형']),
          JSON.stringify(['2022', 'M1-2', '기본 도형', '위치 관계']),
        ].sort(), 'Q8 preserves both official candidate parents');
      } else {
        assert.deepEqual(actual.effectiveRpmL1L2, parent, `Q${expected.sourceOrdinal} effective official parents`);
        assert.equal(actual.parentStatus, 'EXACT', `Q${expected.sourceOrdinal} exact parent resolution`);
        assert.equal(actual.parentReason, '');
        assert.equal(actual.parentKey, JSON.stringify(['2022', 'M1-2', ...parent]));
        assert.equal(actual.selectionSubUnitKey, actual.parentKey);
        assert.equal(actual.selectionSubUnitLabel, parent[1]);
        assert.deepEqual(actual.candidateParentKeys, []);
        if (expected.sourceOrdinal === 10) {
          assert.equal(actual.questionUid, rpmGapUids[10]);
          assert.equal(actual.parentGranularity, 'PARENT', 'Q10 has an exact parent while its leaf stays HOLD');
          assert.equal(actual.parentBasis, 'METADATA_PARENT');
        }
      }
      const searchParent = expected.sourceOrdinal === 8 ? actual.nativeL1L2 : parent;
      const query = `${searchParent[1]} ${expected.questionUid}`;
      await page.locator('#finder-query').fill(query);
      await page.locator('[data-action="finder-search"]').click();
      let control = await visibleSourceControl();
      if (await control.getAttribute('aria-pressed') === 'true') {
        await control.click();
        control = await visibleSourceControl();
      }
      await control.click();
      control = await visibleSourceControl();
      assert.equal(await control.getAttribute('aria-pressed'), 'true', `Q${expected.sourceOrdinal} matching source selection`);
      const searchObservation = { sourceOrdinal: expected.sourceOrdinal, questionUid: expected.questionUid,
        query, parentKey: actual.parentKey, sourceFound: true, sourceSelected: true, sourceDeselected: false };
      report.searches.push(searchObservation);
      if ([2, 4, 8, 10, 13, 24].includes(expected.sourceOrdinal)) {
        const file = `shinheung-q${String(expected.sourceOrdinal).padStart(2, '0')}-finder.png`;
        await visibleSourceControl();
        await page.screenshot({ path: path.join(directory, file), fullPage: false });
        report.screenshots.push({ file, sha256: sha256(fs.readFileSync(path.join(directory, file))) });
      }
      control = await visibleSourceControl();
      await control.click();
      control = await visibleSourceControl();
      assert.equal(await control.getAttribute('aria-pressed'), 'false', 'selection is reversible within the local session');
      searchObservation.sourceDeselected = true;
    }
    assert.equal(report.searches.length, 24);
    report.classificationCounts = {
      nativeParents: observed.rows.filter(actual => {
        const expected = input.rows.find(row => row.questionUid === actual.questionUid);
        return JSON.stringify(actual.nativeL1L2) === JSON.stringify([expected.targetParentRef.majorUnit, expected.targetParentRef.midUnit]);
      }).length,
      rpmExactParents: observed.rows.filter(row => row.parentStatus === 'EXACT').length,
      rpmExplicitParentHolds: observed.rows.filter(row => row.questionUid === rpmGapUids[8] &&
        row.parentStatus === 'LEGACY_PARENT_AMBIGUOUS' && row.rpmSemanticStatus === 'HOLD').length,
      rpmExactLeaves: observed.rows.filter(row => row.parentGranularity === 'LEAF').length,
      rpmLeafHolds: observed.rows.filter(row => row.rpmSemanticStatus === 'HOLD').length,
      searchedSelectedAndReversed: report.searches.filter(row => row.sourceSelected && row.sourceDeselected).length,
    };
    assert.deepEqual(report.classificationCounts, { nativeParents: 24, rpmExactParents: 23,
      rpmExplicitParentHolds: 1, rpmExactLeaves: 22, rpmLeafHolds: 2, searchedSelectedAndReversed: 24 });
    assert.deepEqual(report.pageErrors, []);
    assert.deepEqual(report.blockedWrites, []);
    report.status = 'ACTUAL_CHROME_PASS';
  } catch (error) {
    report.status = 'FAIL'; report.error = String(error.stack || error); process.exitCode = 1;
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
    report.finishedAtUtc = new Date().toISOString();
    fs.writeFileSync(path.join(directory, 'shinheung-registered-browser.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ status: report.status, mainSha, observed: report.observations.length,
      searchedAndSelected: report.searches.length, browserVersion: report.browserVersion, error: report.error }));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
