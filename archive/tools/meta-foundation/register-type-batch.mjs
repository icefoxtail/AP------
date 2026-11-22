// One process, many direct type judgments (DIRECT_JUDGMENT, TYPE_ONLY).
//
// The reviewed registration pass used to start one registrar process per request. For a type-only request that
// meant re-reading and re-parsing the 75 MB question_metadata.json and the identity map, re-compiling the whole canonical
// registry, re-serializing and re-writing the 75 MB file: about nine seconds per request, 214 requests = half an hour.
//
// A TypeBatch shares only what the type lane does not change between requests, and defers the one write it can defer:
//  - the parsed metadata and identity map (the lane edits metadata rows in memory; the identity map is read only),
//  - the registry lookup tables (a request without registryChanges never writes any registry file),
//  - the final question_metadata.json text, which is built and written ONCE by flush() instead of once per request.
// Every request still runs the full registrar (evidence digests, source blob, UID/ordinal, rationale, binding, before/after,
// PT/TPL/binding checks, receipt). Receipts and every other file are written per request exactly as before.
//
// Isolation: a request that throws leaves the shared rows as they were (begin() returns an undo), so the next request
// sees what a fresh process would have seen. A caller that runs any OTHER kind of request must flush() first (so disk is
// current) and drop() afterwards (disk may then differ from the cache): tools/ci/register-reviewed-meta-requests.mjs does.
import fs from "node:fs";
import path from "node:path";
import { questionMetadataText, writeMetadataText } from "./question-metadata-format.mjs";

const META = "archive/data/question_metadata.json";
const DIRECT_JUDGMENT = "DIRECT_JUDGMENT";

// Requests the batch may run: type-only direct judgments that write no registry file. Everything else (registry changes,
// other approval types, identity-only mode, replay checks with --verify-projection) keeps its own process.
export function isTypeBatchRequest(req) {
  return Boolean(req) && req.schemaVersion === "archive-reviewed-exam-meta-register-request-v2" &&
    req.approval?.type === DIRECT_JUDGMENT && req.registrationMode === undefined &&
    !(Array.isArray(req.registryChanges) && req.registryChanges.length);
}

export function createTypeBatch(root) {
  const inputs = new Map();
  const state = { tables: null, metadata: null, dirty: false };
  return {
    root,
    // Parsed JSON input shared between requests (metadata, identity map).
    input(file, load) {
      if (!inputs.has(file)) inputs.set(file, load());
      const value = inputs.get(file);
      if (file === META) state.metadata = value;
      return value;
    },
    tables(load) { return state.tables ??= load(); },
    // Snapshot of the rows (and counts) a request may edit; the returned function puts them back after a refusal.
    begin(metadata, rows) {
      const counts = metadata.counts;
      const saved = [...new Set(rows.filter(Boolean))].map(row => [row, structuredClone(row)]);
      return () => {
        for (const [row, original] of saved) {
          for (const key of Object.keys(row)) delete row[key];
          Object.assign(row, original);
        }
        metadata.counts = counts;
      };
    },
    // The request registered: question_metadata.json differs from disk until flush().
    markMetadataChanged() { state.dirty = true; },
    get dirty() { return state.dirty; },
    // Writes the metadata once, in the same form and with the same "did it change" test the per-request writer used.
    flush() {
      if (!state.dirty) return false;
      const text = questionMetadataText(state.metadata);
      const full = path.join(root, META);
      const current = fs.existsSync(full) ? fs.readFileSync(full, "utf8").replaceAll("\r\n", "\n") : null;
      if (current !== text) writeMetadataText(root, text); // checks the assembled file against the shards, writes it, then syncs the shards
      state.dirty = false;
      return current !== text;
    },
    // Disk may have been changed by something else: forget the cached inputs (flush() first).
    drop() {
      if (state.dirty) throw new Error("type batch dropped with unwritten metadata; flush() first");
      inputs.clear();
      state.tables = null;
      state.metadata = null;
    },
  };
}
