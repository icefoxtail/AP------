// The release build dry-run for cache-version stamping, on the real package: every local script/style reference of
// every shipped page resolves inside the package (a dangling one fails the build), the pages come out stamped and
// idempotent, and the byte-bound public pages are left exactly as written. Selection and hashing only; nothing is
// written. It needs the package-only mixed verification shards that the CI test preparation (and the release job)
// materializes; without them there is nothing to plan and the test says so instead of passing silently.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { planPagesSite, versionStampExclusions } from '../tools/build-archive-pages-site.mjs';
import { stampHtmlVersions, textDigest, STAMP_LENGTH } from '../tools/lib/stamp-html-versions.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shardsReady = fs.existsSync(path.join(root, 'archive/data/archive2-source-verification/mixed-v1/context.json'));

test('real package dry-run: shipped pages are stamped from the files they load, bound pages are not', { skip: shardsReady ? false : 'package-only shards are not materialized in this checkout' }, () => {
  const plan = planPagesSite({ sourceRoot: root });
  const byPath = new Map(plan.entries.map((entry) => [entry.path, entry]));
  const bytesOf = (entry) => entry.content ? entry.content.toString('utf8') : fs.readFileSync(entry.absolute, 'utf8');
  assert.ok(plan.versionStamp.pages > 0 && plan.versionStamp.references > 0, 'the release manifest stamps pages');
  const excluded = versionStampExclusions();
  for (const bound of excluded) {
    const entry = byPath.get(bound);
    assert.ok(entry, `${bound} is shipped`);
    assert.equal(entry.content ?? null, null, `${bound} keeps its committed bytes`);
  }
  assert.equal(plan.versionStamp.skippedBound, excluded.size, 'every byte-bound page is left alone');
  for (const entry of plan.entries.filter((item) => item.transform === 'stamp-html-version')) {
    assert.ok(!excluded.has(entry.path), entry.path);
    // already stamped: stamping the output again changes nothing (idempotent)
    const again = stampHtmlVersions({
      htmlPath: entry.path,
      text: bytesOf(entry),
      hashOf: (target) => textDigest(bytesOf(byPath.get(target))),
    });
    assert.deepEqual(again.refs, [], `${entry.path} has no reference left to stamp`);
    assert.equal(again.text, bytesOf(entry));
  }
  assert.ok(plan.totalBytes < plan.maxBytes);
  assert.equal(STAMP_LENGTH, 12);
});
