'use strict';
/**
 * Whole-file digests of a shared RPM crosswalk file that earlier, already sealed ALIVE evidence recorded.
 *
 * The crosswalk files only grow (rows for other questions are added or updated), so approved Meta that pinned the
 * whole-file sha256 of its time can no longer equal the current digest. A pinned digest is accepted when it is
 *   - the current digest, or
 *   - a digest that a committed, sealed receipt recorded for the very same file path.
 * Any other digest is refused. Accepting a digest never replaces the row-level checks: callers must still verify that
 * the record named by the Meta agrees with the CURRENT crosswalk (unit, labels, difficulty, ...).
 */
const fs = require('node:fs');
const path = require('node:path');

const SEALED_RECEIPTS = [
  // [receipt path, field holding { path, sha256 } of the crosswalk file]
  ['archive/data/generated-lite-consumer/v1/meta-browse-alias-receipt-20261009.json', 'rpmCrosswalk'],
  ['archive/data/generated-lite-consumer/v1/legacy-meta-evidence-323.json', 'crosswalk']
];
const SHA64 = /^[a-f0-9]{64}$/i;

function sealedCrosswalkDigests(root, crosswalkRel) {
  const digests = new Set();
  for (const [receiptRel, field] of SEALED_RECEIPTS) {
    const file = path.join(root, receiptRel);
    if (!fs.existsSync(file)) continue;
    const ref = JSON.parse(fs.readFileSync(file, 'utf8'))[field];
    if (ref && ref.path === crosswalkRel && SHA64.test(ref.sha256 || '')) digests.add(ref.sha256.toLowerCase());
  }
  return digests;
}

function crosswalkDigestAccepted(root, crosswalkRel, pinnedSha256, currentSha256) {
  if (!SHA64.test(pinnedSha256 || '')) return false;
  const pinned = pinnedSha256.toLowerCase();
  return pinned === String(currentSha256).toLowerCase() || sealedCrosswalkDigests(root, crosswalkRel).has(pinned);
}

module.exports = { sealedCrosswalkDigests, crosswalkDigestAccepted };
