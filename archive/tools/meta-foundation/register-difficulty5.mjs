import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

// Registers Gemini's already-decided 5-level difficulty (req_diff5_*.json) into the canonical
// question metadata. No re-judging: Gemini's `after` value is written as-is, subject only to
// format validation and a "never overwrite an existing 1~5 number" guard.
export const SCHEMA = "archive-difficulty5-register-request-v1";
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

function parseBank(bytes) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx);
  vm.runInContext(bytes.toString("utf8"), ctx, { timeout: 5000 });
  const bank = ctx.window.questionBank || ctx.window.questions;
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
  const sourceBytes = fs.readFileSync(sourcePath);
  const sha = blobSha(sourceBytes);
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
      if (q?.id !== undefined && q.id !== n) fail("source question id mismatch #" + n);
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

export function wrapGeminiFile(geminiPath, driveFileId, driveChecksum) {
  const bytes = fs.readFileSync(geminiPath);
  if (!driveFileId) fail("--drive-file-id required");
  return {
    schemaVersion: SCHEMA, driveFileId,
    driveSha256: driveChecksum || crypto.createHash("sha256").update(bytes).digest("hex"),
    driveChecksumSource: driveChecksum ? "drive_metadata" : "local_bytes",
    gemini: JSON.parse(bytes.toString("utf8"))
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const opt = n => { const i = argv.indexOf("--" + n); return i < 0 ? undefined : (argv[i + 1]?.startsWith("--") || argv[i + 1] === undefined ? true : argv[i + 1]); };
  const root = opt("repo-root") ? path.resolve(String(opt("repo-root"))) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
  if (opt("wrap")) {
    const text = JSON.stringify(wrapGeminiFile(path.resolve(String(opt("wrap"))), String(opt("drive-file-id") || ""), opt("drive-checksum") && opt("drive-checksum") !== true ? String(opt("drive-checksum")) : undefined), null, 2) + "\n";
    if (opt("out") && opt("out") !== true) fs.writeFileSync(path.resolve(String(opt("out"))), text, "utf8"); else process.stdout.write(text);
  } else {
    if (!opt("request")) fail("--request or --wrap required");
    const request = JSON.parse(fs.readFileSync(path.resolve(root, String(opt("request"))), "utf8"));
    console.log(JSON.stringify(registerDifficulty5({ root, request, write: Boolean(opt("write")), verifyProjection: Boolean(opt("verify-projection")) }), null, 2));
  }
}
