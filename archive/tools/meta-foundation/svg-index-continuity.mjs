import fs from "node:fs";
import crypto from "node:crypto";
import SvgAccessibility from "../../svg-accessibility.js";
import SvgIndexContinuity from "../../../tools/4slot/existing-vector-svg-index-continuity.cjs";

// Shared by every reviewed UI-continuity validator that froze a whole-file copy
// of archive/data/svg-accessibility-index.js. That file is generated and rebuilt
// by every main snapshot commit, so a byte pin on it can never survive the next
// snapshot. The captured screen consumed only the entries keyed by the displayed
// question's own images, so those are compared instead. Every other served file
// of the calling validator keeps its exact live byte pin there.
//
// Accepted when, for the asset keys the caller passes, ALL of the following hold:
//  1. the frozen index (already authenticated by the caller against its pinned
//     sha256, git blob and byte length) and the live index both parse as the
//     generated wrapper and pass the unchanged student runtime lookup over the
//     entire index (no duplicate normalized key + role, schema intact);
//  2. every entry the frozen index held for those keys (both visual roles, every
//     field) exists unchanged in the live index: a changed or removed entry fails;
//  3. an entry that exists only in the live index is accepted ONLY for an asset
//     key that had no entry at all (either role) in the frozen index, and only if
//     it is a problem-role entry with provenanceStatus SOURCE_BOUND,
//     answerHintFree === true, non-empty titleKo / descriptionKo / sourceExamRef,
//     well-formed svgSha256 and gitBlobSha, and both digests equal the live bytes
//     of that very asset file. The picture is unchanged; only accessibility text
//     was added, and the figure-review line owns that text.
const BASE_URL = SvgIndexContinuity.BASE_URL;
const SHA256_FIELD = /^sha256:[a-f0-9]{64}$/;
const SHA1 = /^[a-f0-9]{40}$/;
const stable = value => JSON.stringify(value, (_, row) => row && typeof row === "object" && !Array.isArray(row)
  ? Object.fromEntries(Object.keys(row).sort().map(key => [key, row[key]])) : row);
const text = value => typeof value === "string" && value.trim().length > 0;

export class SvgIndexContinuityError extends Error {
  constructor(code) { super(`SVG_INDEX_CONTINUITY:${code}`); this.code = code; }
}
const fail = code => { throw new SvgIndexContinuityError(code); };

// A new entry can only be accepted if it describes the exact displayed bytes.
function validNewEntry(record, assetBytes) {
  if (record.visualRole !== "problem" || record.provenanceStatus !== "SOURCE_BOUND" || record.answerHintFree !== true ||
      !text(record.titleKo) || !text(record.descriptionKo) || !text(record.sourceExamRef) ||
      !SHA256_FIELD.test(record.svgSha256 || "") || !SHA1.test(record.gitBlobSha || "")) return false;
  if (!Buffer.isBuffer(assetBytes) || assetBytes.length === 0) return false;
  return record.svgSha256 === "sha256:" + crypto.createHash("sha256").update(assetBytes).digest("hex") &&
    record.gitBlobSha === crypto.createHash("sha1").update(`blob ${assetBytes.length}\0`).update(assetBytes).digest("hex");
}

/**
 * @param frozenBytes authenticated bytes of the frozen index
 * @param liveBytes   bytes of the current index (Buffer), or null when unreadable
 * @param assetRefs   [{ path: "archive/assets/..." }] the question's own images
 * @param readAsset   (path) => Buffer|null, safe live read of that asset file
 * Throws SvgIndexContinuityError with code PROBLEM_ASSET_PATH, FROZEN_SVG_INDEX_INVALID
 * or LIVE_SERVED_CODE_DRIFT.
 */
export function compareSvgIndexContinuity({ frozenBytes, liveBytes, assetRefs, readAsset }) {
  if (!Array.isArray(assetRefs) || !assetRefs.length) fail("PROBLEM_ASSET_PATH");
  const pathByKey = new Map();
  try {
    for (const ref of assetRefs) pathByKey.set(SvgAccessibility.normalizeAssetRef(ref.path.slice("archive/".length), BASE_URL), ref.path);
  } catch { fail("PROBLEM_ASSET_PATH"); }
  let before;
  try { before = SvgIndexContinuity.selectEntries(SvgIndexContinuity.parseIndex(frozenBytes), assetRefs); }
  catch (error) { fail(/_ASSET_(?:PATH|KEY|REFS)$/.test(String(error.message)) ? "PROBLEM_ASSET_PATH" : "FROZEN_SVG_INDEX_INVALID"); }
  let after;
  try { after = SvgIndexContinuity.selectEntries(SvgIndexContinuity.parseIndex(liveBytes), assetRefs); }
  catch { fail("LIVE_SERVED_CODE_DRIFT"); }
  const keyOf = record => SvgAccessibility.normalizeAssetRef(record.assetRef, BASE_URL);
  const liveSet = new Set(after.map(stable)), frozenKeys = new Set(before.map(keyOf));
  if (before.some(record => !liveSet.has(stable(record)))) fail("LIVE_SERVED_CODE_DRIFT");
  const frozenSet = new Set(before.map(stable));
  for (const record of after) {
    if (frozenSet.has(stable(record))) continue;
    const key = keyOf(record);
    if (frozenKeys.has(key)) fail("LIVE_SERVED_CODE_DRIFT");
    let bytes = null;
    try { bytes = readAsset(pathByKey.get(key)); } catch { bytes = null; }
    if (!validNewEntry(record, bytes)) fail("LIVE_SERVED_CODE_DRIFT");
  }
}

// Glue for validators that read the live checkout through their own `safe`
// (path/symlink guard) and report through their own `fail`. Any unreadable live
// file is a drift, never a skip.
export function verifySvgIndexFootprint({ frozenBytes, root, indexPath, assetRefs, safe, fail: callerFail }) {
  const read = relative => {
    try {
      const full = safe(root, relative), stat = fs.lstatSync(full);
      if (!stat.isFile() || stat.size < 1 || stat.size > 128 * 1024 * 1024) return null;
      return fs.readFileSync(full);
    } catch { return null; }
  };
  try { compareSvgIndexContinuity({ frozenBytes, liveBytes: read(indexPath), assetRefs, readAsset: read }); }
  catch (error) { if (error instanceof SvgIndexContinuityError) callerFail(error.code); throw error; }
}
