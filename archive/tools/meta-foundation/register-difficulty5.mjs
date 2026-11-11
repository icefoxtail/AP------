import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

// Registers Gemini's already-decided 5-level difficulty (req_diff5_*.json) into the canonical
// question metadata. No re-judging: Gemini's `after` value is written as-is, subject only to
// format validation and a "never overwrite an existing 1~5 number" guard.
export const SCHEMA = "archive-difficulty5-register-request-v1";
export const REVIEWED_CORRECTION_SCHEMA = "archive-difficulty5-reviewed-correction-v1";
const META = "archive/data/question_metadata.json";
const IDENTITY = "archive/data/question_identity_map.json";
const CONFIDENCE = new Set(["high", "medium", "low"]);
const BOUNDARY = new Set(["NONE", "B12", "B23", "B34", "B45"]);
const LEVEL_OF = { "하": 0, "중": 1, "상": 2 };
const fail = message => { throw new Error("DIFFICULTY5: " + message); };
const equal = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const isBucket = v => Number.isInteger(v) && v >= 1 && v <= 5;
const blobSha = bytes => crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
const read = (root, p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const sha256 = v => crypto.createHash("sha256").update(v).digest("hex");
const fingerprint = q => sha256(JSON.stringify({
  content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
  answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null
}));
const contentFingerprint = q => sha256(JSON.stringify({
  content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, image: q.image ?? null
}));

// 1 = 하, 2·3 = 중, 4·5 = 상
const bucketLevel = n => (n === 1 ? 0 : n <= 3 ? 1 : 2);

export function computeLegacyCompat(existingLevel, after) {
  if (!(existingLevel in LEVEL_OF)) return "UNKNOWN";
  const gap = Math.abs(LEVEL_OF[existingLevel] - bucketLevel(after));
  return gap === 0 ? "NORMAL" : gap === 1 ? "BORDERLINE_REVIEW" : "STRONG_CONFLICT";
}

function existingLevelOf(rec, item) {
  if (rec.level in LEVEL_OF) return rec.level;
  if (typeof rec.difficultyBucket === "string" && rec.difficultyBucket in LEVEL_OF) return rec.difficultyBucket;
  const g = item.before?.level;
  return g in LEVEL_OF ? g : null;
}

function registerReviewedCorrection({ root, request, source, sha, bank, doc, ids, byOrdinal, idByOrdinal,
  ordinalByUid, write, verifyProjection }) {
  const correction = request.reviewedCorrection;
  if (correction.schemaVersion !== REVIEWED_CORRECTION_SCHEMA) fail("unsupported reviewed correction schema");
  if (typeof correction.approvalRef !== "string" || !correction.approvalRef.trim()) fail("reviewed correction approvalRef required");
  const evidencePath = String(correction.evidencePath || "");
  if (!evidencePath.startsWith(".archive-meta-register/evidence/") || path.posix.normalize(evidencePath) !== evidencePath || evidencePath.includes(".."))
    fail("reviewed correction evidencePath must be under .archive-meta-register/evidence");
  const evidenceBytes = fs.readFileSync(path.join(root, evidencePath));
  const evidenceSha = sha256(evidenceBytes);
  if (evidenceSha !== correction.evidenceSha256) fail("reviewed correction evidence SHA256 drift");
  const evidence = JSON.parse(evidenceBytes.toString("utf8"));
  if (evidence.schemaVersion !== REVIEWED_CORRECTION_SCHEMA || !Array.isArray(evidence.rows)) fail("reviewed correction evidence schema invalid");
  if (verifyProjection && write) fail("--verify-projection is read-only");

  const gemini = request.gemini;
  const rows = correction.rows;
  if (!Array.isArray(rows) || rows.length !== gemini.items.length || !rows.length) fail("reviewed correction rows/items denominator mismatch");
  const evidenceByKey = new Map(evidence.rows.map(row => [`${row.sourceArchiveFile}#${row.ordinal}`, row]));
  const requestByOrdinal = new Map(gemini.items.map(item => [item.ordinal, item]));
  if (requestByOrdinal.size !== gemini.items.length) fail("duplicate reviewed correction item ordinal");
  const rowByOrdinal = new Map(rows.map(row => [row.ordinal, row]));
  if (rowByOrdinal.size !== rows.length) fail("duplicate reviewed correction row ordinal");

  const counts = { APPLY: 0, ALREADY_REGISTERED: 0, SKIP_INVALID: 0, CONFLICT: 0, VERIFIED: 0 };
  const results = [];
  let changedFields = 0, wrote = false;
  let metadataChanged = false;

  for (const item of gemini.items) {
    const n = item.ordinal, rec = byOrdinal.get(n), idr = idByOrdinal.get(n), review = rowByOrdinal.get(n);
    if (!Number.isInteger(n) || !rec || !idr || !review) fail("reviewed correction ordinal missing in sidecars #" + n);
    if (item.questionUid !== rec.questionUid || item.questionUid !== idr.questionUid || ordinalByUid.get(item.questionUid) !== n)
      fail("ordinal/questionUid mismatch #" + n);
    if (n < 1 || n > bank.length) fail("ordinal outside question bank #" + n);
    const q = bank[n - 1];
    if (q?.id !== undefined && q.id !== n) {
      const stringId = typeof q.id === "string" && q.id.length > 0;
      if (!stringId || q.number !== n || typeof idr.sourceQuestionNo !== "string" || q.id !== idr.sourceQuestionNo ||
          bank.filter(row => row?.id === q.id).length !== 1) fail("source question id mismatch #" + n);
    }
    const sourceLegacyLevel = rec.level ?? q?.level ?? null;
    if ((item.before?.level ?? null) !== sourceLegacyLevel || (review.before?.level ?? null) !== sourceLegacyLevel)
      fail("legacy level baseline mismatch #" + n);

    const key = `${source}#${n}`, proof = evidenceByKey.get(key);
    if (!proof || proof.questionUid !== item.questionUid || proof.questionUid !== review.questionUid)
      fail("reviewed correction evidence row missing/mismatched #" + n);
    const currentFingerprint = fingerprint(q), currentContentFingerprint = contentFingerprint(q);
    if (proof.sourceFingerprint !== currentFingerprint || proof.contentFingerprint !== currentContentFingerprint ||
        review.sourceFingerprint !== currentFingerprint || review.contentFingerprint !== currentContentFingerprint)
      fail("reviewed correction source fingerprint mismatch #" + n);
    if (review.refreshBinding !== false) fail("reviewed correction cannot rebind source metadata #" + n);
    const staleSourceBinding = rec.contentFingerprint !== currentContentFingerprint || idr.sourceFingerprint !== rec.sourceFingerprint;
    if (proof.staleSourceBinding !== staleSourceBinding) fail("reviewed correction stale-binding evidence mismatch #" + n);
    if (!equal(review.before, proof.before) || !equal(review.after, proof.after) || review.decision !== proof.decision || review.reason !== proof.reason)
      fail("reviewed correction row differs from evidence #" + n);
    const next = review.after;
    const nextKeys = Object.keys(next || {}).sort();
    const difficultyKeys = ["difficultyBoundaryFlag", "difficultyBucket", "difficultyConfidence", "legacyLevelCompatibility"];
    const isBucketOnlyKeep = review.decision === "KEEP";
    if (isBucketOnlyKeep) {
      if (JSON.stringify(nextKeys) !== JSON.stringify(["difficultyBucket"]) || !isBucket(next.difficultyBucket))
        fail("reviewed correction KEEP bucket invalid #" + n);
    } else if (JSON.stringify(nextKeys) !== JSON.stringify(difficultyKeys) || !isBucket(next.difficultyBucket) ||
        !CONFIDENCE.has(next.difficultyConfidence) || !BOUNDARY.has(next.difficultyBoundaryFlag) ||
        !["NORMAL", "BORDERLINE_REVIEW", "BORDERLINE_ACCEPTABLE", "STRONG_CONFLICT", "UNKNOWN"].includes(next.legacyLevelCompatibility))
      fail("reviewed correction after fields invalid #" + n);
    if (!equal(item.after, next)) fail("request after differs from reviewed correction evidence #" + n);

    const before = review.before;
    const current = {
      difficultyBucket: rec.difficultyBucket ?? null,
      difficultyConfidence: rec.difficultyConfidence ?? null,
      difficultyBoundaryFlag: rec.difficultyBoundaryFlag ?? null,
      legacyLevelCompatibility: rec.legacyLevelCompatibility ?? null
    };
    const currentFp = { sourceFingerprint: rec.sourceFingerprint ?? null, contentFingerprint: rec.contentFingerprint ?? null };
    const currentIdFp = idr.sourceFingerprint ?? null;
    const expectedNext = {
      sourceFingerprint: before.sourceFingerprint ?? null,
      contentFingerprint: before.contentFingerprint ?? null
    };
    const beforeDifficulty = Object.fromEntries(difficultyKeys.map(field => [field, before[field] ?? null]));
    const beforeFp = { sourceFingerprint: before.sourceFingerprint ?? null, contentFingerprint: before.contentFingerprint ?? null };
    const afterDifficulty = isBucketOnlyKeep ? beforeDifficulty : Object.fromEntries(difficultyKeys.map(field => [field, next[field] ?? null]));
    const isBefore = difficultyKeys.every(field => equal(current[field], beforeDifficulty[field])) &&
      equal(currentFp, beforeFp) && currentIdFp === beforeFp.sourceFingerprint;
    const isAfter = difficultyKeys.every(field => equal(current[field], afterDifficulty[field])) &&
      equal(currentFp, expectedNext) && currentIdFp === expectedNext.sourceFingerprint;
    const result = { ordinal: n, questionUid: item.questionUid, decision: "", before: { ...current, ...currentFp }, after: { ...afterDifficulty, ...expectedNext },
      reason: review.reason, consumerBinding: currentFp.contentFingerprint !== currentContentFingerprint || currentIdFp !== currentFp.sourceFingerprint ? "stale"
        : currentFp.sourceFingerprint === currentFingerprint ? "exact" : "content" };
    if (verifyProjection) {
      if (!isAfter) fail("registered metadata/fingerprint mismatch #" + n);
      result.decision = "VERIFIED"; counts.VERIFIED++;
      results.push(result);
      continue;
    }
    if (isAfter) {
      result.decision = "ALREADY_REGISTERED"; counts.ALREADY_REGISTERED++;
      results.push(result);
      continue;
    }
    if (!isBefore) fail("reviewed correction stale before #" + n);
    if (review.decision === "KEEP" && !equal(beforeDifficulty, afterDifficulty)) fail("KEEP row changes difficulty #" + n);
    if (!new Set(["CORRECT", "KEEP"]).has(review.decision)) fail("reviewed correction decision invalid #" + n);

    let rowChanged = false;
    for (const [field, value] of Object.entries(next)) {
      if (!equal(rec[field], value)) { rec[field] = value; changedFields++; rowChanged = true; }
    }
    if (rowChanged) metadataChanged = true;
    result.decision = "APPLY"; counts.APPLY++;
    results.push(result);
  }

  if (verifyProjection) {
    const consumerBinding = results.reduce((out, row) => (out[row.consumerBinding] = (out[row.consumerBinding] || 0) + 1, out), {});
    return { status: "PASS", mode: "verify-reviewed-correction", requestId: gemini.requestId, sourceArchiveFile: source, sourceBlobSha: sha,
      items: results, summary: { total: results.length, ...counts, changedFields: 0, written: false, consumerBinding,
        staleSourceBinding: consumerBinding.stale || 0 }, ptTpl: "UNTOUCHED_NOT_IN_SCOPE" };
  }

  if (write && metadataChanged) {
    delete doc.digest;
    doc.digest = sha256(JSON.stringify(doc));
    fs.writeFileSync(path.join(root, META), JSON.stringify(doc, null, 2) + "\n", "utf8");
    wrote = true;
  }
  return { status: "PASS", mode: write ? "write-reviewed-correction" : "dry-run-reviewed-correction", requestId: gemini.requestId,
    driveFileId: request.driveFileId ?? null, driveSha256: request.driveSha256 ?? null, sourceArchiveFile: source, sourceBlobSha: sha,
    items: results, summary: { total: results.length, ...counts, changedFields, written: wrote,
      staleSourceBinding: results.filter(row => row.consumerBinding === "stale").length }, ptTpl: "UNTOUCHED_NOT_IN_SCOPE" };
}

function parseBank(bytes) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx);
  vm.runInContext(bytes.toString("utf8"), ctx, { timeout: 5000 });
  const bank = ctx.window.questionBank || ctx.window.questions || ctx.window.examData?.questions;
  if (!Array.isArray(bank)) fail("question bank missing in source");
  return bank;
}

export function registerDifficulty5({ root, request, write = false, verifyProjection = false }) {
  if (!request || request.schemaVersion !== SCHEMA) fail("schemaVersion must be " + SCHEMA);
  if (verifyProjection && write) fail("--verify-projection is read-only");
  const g = request.gemini;
  if (!g || g.schemaVersion !== "v1" || !Array.isArray(g.items) || !g.items.length) fail("gemini v1 payload with items required");
  if (typeof g.requestId !== "string" || !g.requestId) fail("gemini.requestId required");
  const source = String(g.sourceArchiveFile || "").normalize("NFC");
  if (!source.endsWith(".js") || source.includes("..") || path.isAbsolute(source)) fail("invalid sourceArchiveFile");
  const sourcePath = path.join(root, "archive/exams", source);
  if (!fs.existsSync(sourcePath)) fail("source exam file not found: " + source);
  let sourceBytes = fs.readFileSync(sourcePath);
  let sha = blobSha(sourceBytes);
  if (sha !== g.latestBlobSha && sourceBytes.includes(0x0d)) {
    const lfBytes = Buffer.from(sourceBytes.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
    if (blobSha(lfBytes) === g.latestBlobSha) {
      sourceBytes = lfBytes;
      sha = g.latestBlobSha;
    }
  }
  if (sha !== g.latestBlobSha) fail("source Git blob drift (expected " + g.latestBlobSha + ", actual " + sha + ")");

  const doc = read(root, META);
  const ids = read(root, IDENTITY);
  const byOrdinal = new Map(), idByOrdinal = new Map(), ordinalByUid = new Map();
  for (const r of doc.records || []) if (r.sourceArchiveFile === source) {
    if (byOrdinal.has(r.sourceOrdinal)) fail("duplicate metadata ordinal " + r.sourceOrdinal);
    byOrdinal.set(r.sourceOrdinal, r);
    if (ordinalByUid.has(r.questionUid)) fail("duplicate metadata questionUid");
    ordinalByUid.set(r.questionUid, r.sourceOrdinal);
  }
  for (const r of ids.records || []) if (r.sourceArchiveFile === source) {
    if (idByOrdinal.has(r.sourceOrdinal)) fail("duplicate identity ordinal " + r.sourceOrdinal);
    idByOrdinal.set(r.sourceOrdinal, r);
  }
  const bank = parseBank(sourceBytes);

  if (request.reviewedCorrection) {
    return registerReviewedCorrection({ root, request, source, sha, bank, doc, ids, byOrdinal, idByOrdinal,
      ordinalByUid, write, verifyProjection });
  }

  // Whole-file rejection: every ordinal must map 1:1 to the same questionUid in metadata and identity map.
  const seen = new Set(), binding = {};
  for (const item of g.items) {
    const n = item.ordinal, rec = byOrdinal.get(n), idr = idByOrdinal.get(n);
    if (!Number.isInteger(n) || seen.has(n)) fail("bad or duplicate ordinal " + n);
    seen.add(n);
    if (!rec || !idr) fail("ordinal not found in metadata/identity map #" + n);
    if (item.questionUid !== rec.questionUid || item.questionUid !== idr.questionUid ||
        ordinalByUid.get(item.questionUid) !== n) fail("ordinal/questionUid mismatch #" + n);
    if (n < 1 || n > bank.length) fail("ordinal outside question bank #" + n);
    if (verifyProjection) {
      const q = bank[n - 1];
      if (q?.id !== undefined && q.id !== n) {
        // Some banks have stable string IDs (e.g. q01/s01) and a separate display number.
        // Accept them only when the canonical identity, ordinal and unique source ID agree.
        const stringId = typeof q.id === "string" && q.id.length > 0;
        if (!stringId || q.number !== n || typeof idr.sourceQuestionNo !== "string" ||
            q.id !== idr.sourceQuestionNo || bank.filter(row => row?.id === q.id).length !== 1)
          fail("source question id mismatch #" + n);
      }
      // Same binding rule as build-archive2-catalog: "exact" = row approved against these bytes; "content" = only
      // answer/solution bytes changed; "stale" = stem/choices/image changed, so consumers ignore the row's meta hint.
      // Stale binding is pre-existing fingerprint debt, not something this registrar repairs: it is reported, not hidden.
      binding[n] = rec.contentFingerprint !== contentFingerprint(q) || idr.sourceFingerprint !== rec.sourceFingerprint ? "stale"
        : rec.sourceFingerprint === fingerprint(q) ? "exact" : "content";
    }
  }

  const items = [], counts = { APPLY: 0, ALREADY_REGISTERED: 0, SKIP_INVALID: 0, CONFLICT: 0, VERIFIED: 0 };
  let changedFields = 0;
  for (const item of g.items) {
    const rec = byOrdinal.get(item.ordinal), a = item.after || {};
    const cur = {
      difficultyBucket: rec.difficultyBucket ?? null, difficultyConfidence: rec.difficultyConfidence ?? null,
      difficultyBoundaryFlag: rec.difficultyBoundaryFlag ?? null, legacyLevelCompatibility: rec.legacyLevelCompatibility ?? null
    };
    const conf = typeof a.difficultyConfidence === "string" ? a.difficultyConfidence.toLowerCase() : null;
    const out = { ordinal: item.ordinal, questionUid: item.questionUid, decision: "", before: cur, after: null,
                  geminiCompatRaw: a.legacyLevelCompatibility ?? null };
    let reason = null;
    if (!isBucket(a.difficultyBucket)) reason = "difficultyBucket must be an integer 1..5";
    else if (!CONFIDENCE.has(conf)) reason = "difficultyConfidence must be high/medium/low";
    else if (!BOUNDARY.has(a.difficultyBoundaryFlag)) reason = "difficultyBoundaryFlag must be NONE/B12/B23/B34/B45";
    if (reason) { out.decision = "SKIP_INVALID"; out.reason = reason; counts.SKIP_INVALID++; items.push(out); continue; }
    const next = {
      difficultyBucket: a.difficultyBucket, difficultyConfidence: conf, difficultyBoundaryFlag: a.difficultyBoundaryFlag,
      legacyLevelCompatibility: computeLegacyCompat(existingLevelOf(rec, item), a.difficultyBucket)
    };
    out.after = next;
    if (verifyProjection) {
      for (const f of Object.keys(next)) if (!equal(rec[f], next[f])) fail("registered metadata mismatch #" + item.ordinal + "." + f);
      out.decision = "VERIFIED"; out.consumerBinding = binding[item.ordinal]; counts.VERIFIED++; items.push(out); continue;
    }
    if (isBucket(rec.difficultyBucket)) {
      if (rec.difficultyBucket === next.difficultyBucket) { out.decision = "ALREADY_REGISTERED"; counts.ALREADY_REGISTERED++; }
      else { out.decision = "CONFLICT"; out.reason = "existing numeric difficultyBucket is different; not overwritten"; counts.CONFLICT++; }
      items.push(out); continue;
    }
    out.decision = "APPLY"; counts.APPLY++;
    for (const [f, v] of Object.entries(next)) if (!equal(rec[f], v)) { rec[f] = v; changedFields++; }
    items.push(out);
  }

  if (write && counts.APPLY) {
    // Preserve the shared sidecar digest convention (same as the pinpoint registrar).
    delete doc.digest;
    doc.digest = crypto.createHash("sha256").update(JSON.stringify(doc)).digest("hex");
    fs.writeFileSync(path.join(root, META), JSON.stringify(doc, null, 2) + "\n", "utf8");
  }
  return {
    status: "PASS", mode: verifyProjection ? "verify-projection" : write ? "write" : "dry-run",
    requestId: g.requestId, driveFileId: request.driveFileId ?? null, driveSha256: request.driveSha256 ?? null,
    sourceArchiveFile: source, sourceBlobSha: sha, items,
    summary: { total: items.length, ...counts, changedFields, written: Boolean(write && counts.APPLY),
      ...(verifyProjection ? { consumerBinding: Object.values(binding).reduce((m, b) => (m[b] = (m[b] || 0) + 1, m), {}) } : {}) },
    ptTpl: "UNTOUCHED_NOT_IN_SCOPE"
  };
}

// Intake normalization (2026-11-11). Gemini's Drive files drift in shape (sourceOrdinal instead of ordinal, HIGH instead
// of high, a missing schemaVersion) and point at an older Git blob once the exam file has been edited. The courier used to
// repair these by hand from its prompt, and the ledger shows the hand repair was not reliable: 57 files were refused for
// "blob drift" and 48 for a missing ordinal while the repair rules were already in force. The same rules now run here,
// the same way every time. Nothing is judged or guessed: `after.difficultyBucket` and the other ratings are copied as
// they are, and the registrar's own guards (ordinal \u2194 questionUid, value format, never overwrite a number) still apply.
export function normalizeGeminiPayload(raw, { root, driveFileId } = {}) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) fail("gemini payload must be a JSON object");
  const repairs = [];
  const note = tag => { if (!repairs.includes(tag)) repairs.push(tag); };
  const items = !Array.isArray(raw.items) ? raw.items : raw.items.map(source => {
    const item = source && typeof source === "object" ? source : {};
    let ordinal = item.ordinal;
    if (ordinal === undefined && item.sourceOrdinal !== undefined) { ordinal = item.sourceOrdinal; note("REPAIRED_FORMAT"); }
    const after = item.after && typeof item.after === "object" ? item.after : {};
    let confidence = after.difficultyConfidence;
    if (typeof confidence === "string" && !CONFIDENCE.has(confidence) && CONFIDENCE.has(confidence.toLowerCase())) {
      confidence = confidence.toLowerCase();
      note("REPAIRED_FORMAT");
    }
    return {
      ordinal, questionUid: item.questionUid,
      ...(item.before && typeof item.before === "object" && "level" in item.before ? { before: { level: item.before.level } } : {}),
      after: {
        difficultyBucket: after.difficultyBucket, difficultyConfidence: confidence,
        difficultyBoundaryFlag: after.difficultyBoundaryFlag, legacyLevelCompatibility: after.legacyLevelCompatibility
      }
    };
  });
  if (raw.schemaVersion !== "v1") note("REPAIRED_FORMAT");

  // The registrar compares against the LF blob, which is what Git stores and what the workflow's Linux checkout reads.
  // Hashing the working file as it is would give a different number on a Windows checkout with CRLF line endings.
  let latestBlobSha = raw.latestBlobSha, previousBlobSha = null;
  const source = String(raw.sourceArchiveFile || "").normalize("NFC");
  if (root && source.endsWith(".js") && !source.includes("..") && !path.isAbsolute(source)) {
    const sourcePath = path.join(root, "archive/exams", source);
    if (fs.existsSync(sourcePath)) {
      const bytes = fs.readFileSync(sourcePath);
      const current = blobSha(bytes.includes(0x0d) ? Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"), "utf8") : bytes);
      if (current !== latestBlobSha && blobSha(bytes) !== latestBlobSha) {
        previousBlobSha = latestBlobSha ?? null;
        latestBlobSha = current;
        note("REPAIRED_SHA");
      }
    }
  }
  const intakeNote = "Extracted from Drive file " + (driveFileId || "(unknown)") + " (registration fields only)"
    + (repairs.length ? "; " + repairs.join(", ") : "")
    + (previousBlobSha !== null ? "; latestBlobSha was " + previousBlobSha : "");
  return {
    repairs,
    gemini: {
      _intakeNote: intakeNote, schemaVersion: "v1", requestId: raw.requestId, createdAt: raw.createdAt,
      sourceArchiveFile: raw.sourceArchiveFile, latestBlobSha, items
    }
  };
}

// A Drive export sometimes arrives inside a Markdown code fence. Only the fence is removed; the JSON is not touched.
const unfence = text => {
  const fenced = /^\s*```[a-zA-Z0-9_-]*\s*\n([\s\S]*?)\n```\s*$/.exec(text);
  return fenced ? fenced[1] : text;
};

export function wrapGeminiFile(geminiPath, driveFileId, driveChecksum, { normalize = false, root } = {}) {
  const bytes = fs.readFileSync(geminiPath);
  if (!driveFileId) fail("--drive-file-id required");
  const text = bytes.toString("utf8").replace(/^\uFEFF/, "");
  const normalized = normalize ? normalizeGeminiPayload(JSON.parse(unfence(text)), { root, driveFileId }) : null;
  const wrapped = {
    schemaVersion: SCHEMA, driveFileId,
    driveSha256: driveChecksum || crypto.createHash("sha256").update(bytes).digest("hex"),
    driveChecksumSource: driveChecksum ? "drive_metadata" : "local_bytes",
    gemini: normalized ? normalized.gemini : JSON.parse(text)
  };
  // Not part of the request file: the CLI prints it so the courier can record what was repaired.
  if (normalized) Object.defineProperty(wrapped, "repairs", { value: normalized.repairs, enumerable: false });
  return wrapped;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const opt = n => { const i = argv.indexOf("--" + n); return i < 0 ? undefined : (argv[i + 1]?.startsWith("--") || argv[i + 1] === undefined ? true : argv[i + 1]); };
  const root = opt("repo-root") ? path.resolve(String(opt("repo-root"))) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
  if (opt("wrap")) {
    const wrapped = wrapGeminiFile(path.resolve(String(opt("wrap"))), String(opt("drive-file-id") || ""), opt("drive-checksum") && opt("drive-checksum") !== true ? String(opt("drive-checksum")) : undefined,
      { normalize: Boolean(opt("normalize")), root });
    const text = JSON.stringify(wrapped, null, 2) + "\n";
    if (opt("out") && opt("out") !== true) fs.writeFileSync(path.resolve(String(opt("out"))), text, "utf8"); else process.stdout.write(text);
    // stderr, so stdout stays the request JSON when --out is not given
    if (opt("normalize")) console.error("DIFF5_INTAKE_REPAIRS: " + (wrapped.repairs.length ? wrapped.repairs.map(tag => "[" + tag + "]").join(" ") : "none"));
  } else {
    if (!opt("request")) fail("--request or --wrap required");
    const request = JSON.parse(fs.readFileSync(path.resolve(root, String(opt("request"))), "utf8"));
    console.log(JSON.stringify(registerDifficulty5({ root, request, write: Boolean(opt("write")), verifyProjection: Boolean(opt("verify-projection")) }), null, 2));
  }
}
