import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

// Exercise the actual response registration and reference gate without starting
// Chromium. The recorded integration failure was a valid HTML response followed
// by the shell adding a scene fragment with history.replaceState.
const file = process.env.STUDENT_SMOKE_SCRIPT || path.join(path.dirname(fileURLToPath(import.meta.url)), 'g8-g9-student-live-smoke.mjs');
const source = fs.readFileSync(file, 'utf8');
const responseDeclaration = source.match(/^const responseURL = .*;$/m)?.[0] || '';
const registration = source.match(/verifiedURLs\.add\([^;]+\);/)?.[0];
const begin = source.indexOf('      const references = await page.evaluate');
const end = source.indexOf('\n    } catch (e)', begin);
assert.ok(registration && begin >= 0 && end > begin, 'actual source-verification gate must be found');
const gate = source.slice(begin, end);
const base = new URL('https://icefoxtail.github.io/AP------/apmath/playground/next/labs/');
async function audit(responseURLs, references) {
  const record = { localAssetReferences: [], errors: [] };
  const sandbox = { URL, Promise, Set, base, record, pendingAssets: new Set(), verifiedURLs: new Set(),
    page: { evaluate: async () => references },
    safeURL: raw => { const u = new URL(raw); return u.origin + u.pathname; },
    localRepoPath: raw => new URL(raw).pathname,
    responseURLs };
  return await vm.runInNewContext(`(async () => {
    ${responseDeclaration}
    for (const raw of responseURLs) { const r = { url: () => raw }; ${registration} }
    ${gate}
    return record;
  })()`, sandbox);
}

test('all 48 actual navigation shapes match their verified HTML response after a scene hash is saved', async () => {
  const units = ['g8-triangles', 'g8-quadrilaterals', 'g8-similarity', 'g8-pythagoras', 'g9-trig-ratio', 'g9-circle'];
  let checked = 0;
  for (const unit of units) for (const theme of ['board', 'paper']) for (const tab of ['explore', 'problem', 'review', 'answer']) {
    const document = new URL(`${unit}.html?theme=${theme}`, base).href;
    const script = new URL('../kit/apl-shell.js?v=20261107', base).href;
    const result = await audit([document, script], [`${document}#scene=first&tab=${tab}&step=2`, script]);
    assert.equal(result.errors.length, 0, `${unit}/${theme}/${tab}`);
    assert.equal(result.localAssetReferences.length, 2);
    assert.ok(result.localAssetReferences.every(a => a.responseVerified));
    checked++;
  }
  assert.equal(checked, 48);
});

test('query, path and missing-response differences still fail the unchanged reference gate', async () => {
  const document = new URL('g8-triangles.html?theme=board', base).href;
  for (const missing of [document.replace('board', 'paper'), document.replace('g8-triangles', 'g9-circle'), `${document}&revision=2`, new URL('../kit/missing.js', base).href]) {
    const result = await audit([document], [`${missing}#scene=first`]);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].kind, 'referenced-local-asset-not-verified');
    assert.equal(result.localAssetReferences[0].responseVerified, false);
  }
});

test('fragment normalization preserves encoded hash characters and complete query identity', async () => {
  const resource = new URL('../kit/example%23literal.js?x=a%23b&v=2', base).href;
  const valid = await audit([resource], [`${resource}#local-state`]);
  assert.equal(valid.errors.length, 0);
  const changed = await audit([resource], [`${resource.replace('v=2', 'v=3')}#local-state`]);
  assert.equal(changed.errors.length, 1);
});

test('a response from a different host or port cannot satisfy a same-origin reference', async () => {
  const document = new URL('g8-triangles.html?theme=board', base).href;
  for (const changed of [document.replace('icefoxtail.github.io', 'example.invalid'), document.replace('icefoxtail.github.io', 'icefoxtail.github.io:8443')]) {
    const result = await audit([changed], [`${document}#scene=first`]);
    assert.equal(result.errors.length, 1);
    assert.equal(result.localAssetReferences[0].responseVerified, false);
  }
});
