// Basic-scope source rebind (2026-11-02, user decision on issue #1183).
//
// A basic-scope approval is a question_metadata.json row whose standard unit and sub-unit were approved against
// exact source bytes (sourceFingerprint = content+choices+answer+solution+image, contentFingerprint = content+
// choices+image). When the student figure of an approved question is later added or corrected, the bytes change,
// the Archive 2.0 catalog sees a fingerprint mismatch (sourceStatus HOLD, no canonical parent) and the question
// silently disappears from strict search - although the approved unit/sub-unit still describe it.
//
// This registrar re-binds ONLY the two fingerprints (metadata row) and the identity-map fingerprint to the
// current bytes. It never changes a metadata value, and it refuses unless the change is provably only a figure:
//   - the approved bytes are re-derived from a prior Git blob of the same file (previousSourceBlobSha1) and must
//     reproduce the CURRENT metadata fingerprints exactly (so the approval really was about those bytes);
//   - answer, choices, solution and every classification field of the question are byte-identical;
//   - the stem may differ only by (a) dropping the leading "[도형필요]"/"[그래프필요]" placeholder line once the
//     figure is attached and (b) a few declared literal text fixes that contain no digit, "$" or "\";
//   - a NEW figure is always required (the image reference must change, the file must exist and belong to this
//     question: assets/images/<exam title>/q<ordinal>.<ext>); a stem edit is only allowed on top of that;
//   - a human review file (REVIEW_SCHEMA, an approval evidence ref) must list, per question, the same contentEdits
//     and the sha256 of the resulting stem, and carry this request's requestId/examUid/sourceArchiveFile and the
//     question's UID - the length/character limits cannot judge meaning, the reviewer's recorded edit does;
//   - the target row is a basic-scope approval (approved_* status, approved standard unit and sub-unit, evidence),
//     is not review-reset pending, and is named in the request.
// The reviewed basic parent link (basic-scope-source-links.json, bound to the stem/choices/figure fingerprint) is
// bound to the same bytes: Registration Sync silently drops a link whose body fingerprint no longer matches, which
// is what removes the question from strict search. An item may therefore carry `basicParent` (grade, curriculum,
// course, L1, L2); it is accepted only when it equals the one parent the approved sub-unit maps to in the canonical
// crosswalk table, and an existing link for the same question may not change its parent.
// Anything else (meta value change, stem/answer/choice/solution change, unapproved row, hash drift) is refused
// before the first write and needs a normal re-review registration instead.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { registerDifficulty5 } from "./register-difficulty5.mjs";

export const SCHEMA = "archive-basic-scope-rebind-request-v1";
export const PARENT_SCHEMA = "archive-basic-parent-correction-request-v1";
export const PARENT_REVIEW_SCHEMA = "archive-basic-parent-correction-review-v1";
export const REVIEW_SCHEMA = "archive-basic-scope-rebind-review-v1";
export const RECEIPT_SCHEMA = "archive-basic-scope-rebind-registration-v1";
const META = "archive/data/question_metadata.json";
const IDENTITY = "archive/data/question_identity_map.json";
const LINKS = "archive/data/basic-scope-source-links.json";
const PARENT_LINKS = "archive/data/basic-scope-parent-links.json";
const RECEIPTS = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1";
const EVIDENCE_PREFIX = `${RECEIPTS}/`;
const MAX_ITEMS = 50;
const MAX_EDITS = 3;
const MAX_EDIT_CHARS = 8;
// Fields that carry the classification the approval describes; none may differ between approved and current bytes.
const CLASSIFICATION_FIELDS = ["standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit", "level", "L1", "L2", "L3", "L4",
  "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket", "questionType", "id"];
const PLACEHOLDER = /^\[(?:도형|그래프)필요\]\n/;

const fail = message => { throw new Error("BASIC_SCOPE_REBIND: " + message); };
const sha256 = value => crypto.createHash("sha256").update(value).digest("hex");
const json = value => JSON.stringify(value, null, 2) + "\n";
const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === "object"
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
// Compared through JSON: arrays/objects built inside the vm sandbox have another realm's prototypes.
const eq = (a, b) => stable(a ?? null) === stable(b ?? null);
const requireText = (value, name) => typeof value === "string" && value.trim() ? value : fail(`${name} required`);
const blobSha1 = bytes => crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");

export const sourceFingerprint = q => sha256(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
  answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null }));
export const contentFingerprint = q => sha256(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
  image: q.image ?? null }));

function safePath(root, relative) {
  if (typeof relative !== "string" || !relative || relative.includes("\\") || relative.split("/").some(x => !x || x === "." || x === "..") || path.isAbsolute(relative))
    fail(`unsafe path: ${relative}`);
  const full = path.resolve(root, relative);
  if (!full.startsWith(path.resolve(root) + path.sep)) fail(`path outside repository: ${relative}`);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail(`symlink path: ${relative}`);
  return full;
}

function parseBank(bytes) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx);
  vm.runInContext(bytes.toString("utf8"), ctx, { timeout: 5000 });
  const bank = ctx.window.questionBank || ctx.window.questions;
  return Array.isArray(bank) ? bank : fail("question bank missing");
}

function evidenceRefs(root, refs, what, correction = false) {
  if (!Array.isArray(refs) || !refs.length) fail(`${what} evidenceRefs required`);
  for (const ref of refs) {
    if (!/^[a-f0-9]{64}$/.test(ref?.sha256 || "")) fail(`${what} evidence SHA-256 required`);
    if (!(String(ref.path || "").startsWith(EVIDENCE_PREFIX) || correction && /^docs\/operations\/m1s2-meta-b01-c-20261114\/c2_4-adjudication\.json$/.test(ref.path || "")) || !ref.path.endsWith(".json")) fail(`${what} evidence outside ${EVIDENCE_PREFIX}: ${ref.path}`);
    const full = safePath(root, ref.path);
    if (!fs.existsSync(full) || sha256(fs.readFileSync(full)) !== ref.sha256) fail(`${what} evidence missing/drift: ${ref.path}`);
  }
}

// Stem difference allowed between approved and current bytes (see header). Returns the rule that explained it.
function explainContentChange(previous, current, edits, hasNewImage) {
  const before = previous.content ?? null, after = current.content ?? null;
  if (before === after) { if (edits.length) fail("contentEdits declared but the stem did not change"); return "UNCHANGED"; }
  if (typeof before !== "string" || typeof after !== "string") fail("stem changed type");
  let expected = before, rule = "";
  if (PLACEHOLDER.test(expected)) {
    if (!hasNewImage) fail("placeholder line removed without a newly attached figure");
    expected = expected.replace(PLACEHOLDER, "");
    rule = "PLACEHOLDER_REMOVED";
  }
  for (const edit of edits) {
    const from = edit?.from, to = edit?.to;
    if (typeof from !== "string" || typeof to !== "string" || !from || from === to) fail("contentEdits entries need distinct non-empty from/to");
    if (from.length > MAX_EDIT_CHARS || to.length > MAX_EDIT_CHARS) fail(`contentEdits text longer than ${MAX_EDIT_CHARS} characters`);
    if (/[0-9$\\]/.test(from + to)) fail("contentEdits must not touch digits, $ or backslash (math/numbers)");
    if (expected.split(from).length !== 2) fail(`contentEdits "from" must occur exactly once: ${from}`);
    expected = expected.replace(from, to);
    rule = rule ? `${rule}+TEXT_FIX` : "TEXT_FIX";
  }
  if (expected !== after) fail("stem differs from approved stem beyond placeholder removal and declared text fixes");
  return rule;
}

// The one human review file bound to this request. Its identity fields must equal the request, so a review written
// for another request/exam/question cannot be reused.
function loadReview(root, req, schema = REVIEW_SCHEMA) {
  const reviews = (req.approval.evidenceRefs || []).map(ref => ({ ref, doc: JSON.parse(fs.readFileSync(safePath(root, ref.path), "utf8")) }))
    .filter(row => row.doc?.schemaVersion === schema);
  if (reviews.length !== 1) fail(`exactly one ${schema} approval evidence file required`);
  const { ref, doc } = reviews[0];
  if (doc.requestId !== req.requestId || doc.examUid !== req.examUid || doc.sourceArchiveFile !== req.sourceArchiveFile)
    fail("review file requestId/examUid/sourceArchiveFile differ from the request");
  if (!Array.isArray(doc.questions)) fail("review file questions[] required");
  return { ref, doc };
}

export function registerBasicScopeRebind({ root, request: req, write = false, verifyProjection = false }) {
  const correction = req?.schemaVersion === PARENT_SCHEMA;
  if (!correction && req?.schemaVersion !== SCHEMA) fail("request schema mismatch");
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(req.requestId || "")) fail("valid requestId required");
  requireText(req.examUid, "examUid");
  if (req.approval?.type !== (correction ? "BASIC_PARENT_CORRECTION" : "BASIC_SCOPE_REBIND") || req.approval.metadataReviewed !== true) fail("BASIC_SCOPE_REBIND approval with metadataReviewed=true required");
  requireText(req.approval.approvedBy, "approvedBy");
  evidenceRefs(root, req.approval.evidenceRefs, "approval", correction);
  const review = loadReview(root, req, correction ? PARENT_REVIEW_SCHEMA : REVIEW_SCHEMA);
  if (!Array.isArray(req.items) || !req.items.length || req.items.length > MAX_ITEMS) fail(`items[] required (1..${MAX_ITEMS})`);
  if (req.registryChanges !== undefined) fail("registryChanges are not allowed in a rebind");

  const adjudicationRef = correction ? review.doc.priorReview : null;
  let adjudication;
  if (correction) {
    if (!adjudicationRef || !req.approval.evidenceRefs.some(ref => eq(ref, adjudicationRef)))
      fail("parent adjudication must be bound to approval evidence");
    adjudication = JSON.parse(fs.readFileSync(safePath(root, adjudicationRef.path), "utf8"));
    if (adjudication.schemaVersion !== "m1s2-scoped-final-adjudication-v1" ||
        adjudication.owner !== req.approval.approvedBy || adjudication.sourceArchiveFile !== req.sourceArchiveFile ||
        adjudication.sourceAfterBlob !== req.expectedSourceBlobSha1 || adjudication.expectedQuestionCount !== req.expectedQuestionCount)
      fail("parent adjudication source or owner mismatch");
  }
  const source = requireText(req.sourceArchiveFile, "sourceArchiveFile");
  if (!source.endsWith(".js") || source.startsWith("archive/") || source.startsWith("exams/")) fail("sourceArchiveFile must be archive/exams-relative");
  const bytes = fs.readFileSync(safePath(root, `archive/exams/${source}`));
  if (req.expectedSourceBlobSha1 !== blobSha1(bytes)) fail("source Git blob drift");
  if (!/^[a-f0-9]{40}$/.test(req.previousSourceBlobSha1 || "") || req.previousSourceBlobSha1 === req.expectedSourceBlobSha1) fail("previousSourceBlobSha1 (a different blob) required");
  let previousBytes;
  try {
    previousBytes = execFileSync("git", ["cat-file", "blob", req.previousSourceBlobSha1], { cwd: root, encoding: null, maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
  } catch { fail("previous source blob unavailable in Git"); }
  if (blobSha1(previousBytes) !== req.previousSourceBlobSha1) fail("previous source blob digest mismatch");
  if (correction) {
    const priorCommit = req.previousSourceCommit;
    if (!/^[a-f0-9]{40}$/.test(priorCommit || "") ||
        execFileSync("git", ["rev-parse", "--verify", `${priorCommit}:archive/exams/${source}`], { cwd: root, encoding: "utf8" }).trim() !== req.previousSourceBlobSha1)
      fail("previous source commit/path binding mismatch");
  }
  const bank = parseBank(bytes), previousBank = parseBank(previousBytes);
  if (!Number.isInteger(req.expectedQuestionCount) || bank.length !== req.expectedQuestionCount || previousBank.length !== bank.length) fail("source denominator mismatch");

  const read = file => JSON.parse(fs.readFileSync(safePath(root, file), "utf8"));
  const metadata = read(META), identity = read(IDENTITY);
  const links = read(LINKS), crosswalk = read(PARENT_LINKS).records || [];
  if (links.status !== "REVIEWED_SCOPE_LINKS" || !Array.isArray(links.records)) fail("basic source link file invalid");
  const metaRows = new Map(metadata.records.filter(r => r.sourceArchiveFile === source).map(r => [r.questionUid, r]));
  const idRows = new Map(identity.records.filter(r => r.sourceArchiveFile === source).map(r => [r.questionUid, r]));
  if (metaRows.size !== bank.length || idRows.size !== bank.length) fail("UID denominator mismatch");

  const requestSha256 = sha256(stable(req));
  const receiptPath = `${RECEIPTS}/${req.requestId}.json`;
  const receiptFull = safePath(root, receiptPath);
  const previous = fs.existsSync(receiptFull) ? read(receiptPath) : null;
  if (previous && previous.requestSha256 !== requestSha256) fail("requestId reused with different content");

  // The same nine rows already carry a separate, reviewed difficulty correction.
  // Validate that original request before rebinding its baseline fingerprints.
  let difficultyByUid = new Map();
  if (correction) {
    const original = JSON.parse(execFileSync("git", ["show",
      "c789bb0ad92f7dc9cb163374ecf6c9892bbb4a20:.archive-meta-register/inbox/m1s2-b01-c-25-pungdeok-mid-difficulty-20261114.json"],
    { cwd: root, encoding: "utf8" }));
    if (!eq(req.difficultyEvidence, {
      path: original.reviewedCorrection.evidencePath, sha256: original.reviewedCorrection.evidenceSha256,
    }) || sha256(fs.readFileSync(safePath(root, req.difficultyEvidence.path))) !== req.difficultyEvidence.sha256)
      fail("reviewed difficulty evidence drift");
    const uids = new Set(req.items.map(item => item.questionUid));
    original.gemini.items = original.gemini.items.filter(item => uids.has(item.questionUid));
    original.reviewedCorrection.rows = original.reviewedCorrection.rows.filter(item => uids.has(item.questionUid));
    if (original.gemini.sourceArchiveFile !== source || original.gemini.latestBlobSha !== req.expectedSourceBlobSha1 ||
        original.gemini.items.length !== req.items.length) fail("reviewed difficulty scope mismatch");
    if (!previous) registerDifficulty5({ root, request: original, write: false });
    difficultyByUid = new Map(original.gemini.items.map(item => [item.questionUid, item.after]));
  }
  const seen = new Set(), applied = [];
  for (const item of req.items) {
    const uid = requireText(item?.questionUid, "item questionUid");
    if (seen.has(uid)) fail(`duplicate item: ${uid}`);
    seen.add(uid);
    const row = metaRows.get(uid), id = idRows.get(uid), n = item.sourceOrdinal;
    if (!row || !id) fail(`UID not in source exam: ${uid}`);
    if (!Number.isInteger(n) || n < 1 || n > bank.length || row.sourceOrdinal !== n || id.sourceOrdinal !== n) fail(`UID/source ordinal mismatch: ${uid}`);
    requireText(item.reason, `${uid} reason`);
    evidenceRefs(root, item.evidenceRefs, uid, correction);
    if (!item.evidenceRefs.some(ref => ref.path === review.ref.path && ref.sha256 === review.ref.sha256)) fail(`${uid} evidenceRefs must include the review file`);
    if (!item.before || !item.after || Object.keys(item.before).sort().join() !== "contentFingerprint,sourceFingerprint" ||
        Object.keys(item.after).sort().join() !== "contentFingerprint,sourceFingerprint") fail(`${uid} before/after must hold exactly sourceFingerprint and contentFingerprint`);
    const current = bank[n - 1], prior = previousBank[n - 1];
    const now = { sourceFingerprint: sourceFingerprint(current), contentFingerprint: contentFingerprint(current) };
    const approvedBytes = { sourceFingerprint: sourceFingerprint(prior), contentFingerprint: contentFingerprint(prior) };
    // The request must say what it replaces and what it produces; both are recomputed here, never trusted.
    if (!eq(item.after, now)) fail(`${uid} after fingerprints do not match the current source`);
    if (!correction && eq(item.before, item.after)) fail(`${uid} nothing to rebind`);
    // Basic-scope approval of the target row.
    const fields = row.fieldStatus || {};
    if (!String(row.metadataStatus || "").startsWith("approved_") || !/^approved(?:_|$)/i.test(String(fields.standardUnit || "")) ||
        !/^approved(?:_|$)/i.test(String(fields.subUnit || "")) || !Array.isArray(row.approvalEvidence) || !row.approvalEvidence.some(ref => String(ref || "").trim()))
      fail(`${uid} is not a basic-scope approved row`);
    if (row.registrationUpdateState) fail(`${uid} has a pending review-reset state`);
    // Proof the approval was about the prior bytes: the prior blob must reproduce the stored fingerprints.
    const stored = { sourceFingerprint: row.sourceFingerprint, contentFingerprint: row.contentFingerprint };
    const alreadyRebound = eq(stored, now) && id.sourceFingerprint === now.sourceFingerprint;
    if (!alreadyRebound) {
      if (!eq(stored, item.before) || id.sourceFingerprint !== item.before.sourceFingerprint) fail(`${uid} before fingerprints do not match the registered row/identity`);
      if (!eq(approvedBytes, item.before)) fail(`${uid} the previous source blob does not reproduce the approved fingerprints`);
    } else if (!previous && !verifyProjection) fail(`${uid} is already bound to the current source`);
    if (correction) {
      const parentKeys = ["standardUnitKey", "standardUnit", "subUnitKey", "subUnit"];
      const priorParent = item.parentBefore;
      const nextParent = item.parentAfter;
      const recorded = adjudication.items.filter(q => q?.questionUid === uid);
      if (recorded.length !== 1 || recorded[0].ordinal !== n ||
          !eq(recorded[0].sourceAfter.subUnitKey, nextParent?.subUnitKey) ||
          (Object.hasOwn(recorded[0].sourceAfter, "standardUnitKey") && !eq(recorded[0].sourceAfter.standardUnitKey, nextParent?.standardUnitKey)))
        fail(`${uid} parent is missing from final adjudication`);
      const reviewed = review.doc.questions.filter(q => q?.questionUid === uid);
      if (review.doc.previousSourceBlobSha1 !== req.previousSourceBlobSha1 ||
          review.doc.expectedSourceBlobSha1 !== req.expectedSourceBlobSha1 ||
          reviewed.length !== 1 || !eq(reviewed[0], {
            questionUid: uid, sourceOrdinal: n, before: item.before, after: item.after,
            parentBefore: priorParent, parentAfter: nextParent, basicParent: item.basicParent,
          })) fail(`${uid} parent correction evidence mismatch`);
      for (const key of ["id", "sourceQuestionNo", "content", "choices", "answer", "image", "questionType", "score"]) {
        if (!eq(prior[key], current[key])) fail(`${uid} protected source field changed: ${key}`);
      }
      if (!eq(approvedBytes, item.before) || now.contentFingerprint !== approvedBytes.contentFingerprint)
        fail(`${uid} historical body binding mismatch`);
      if (row.problemTypeKey || row.templateKey ||
          fields.problemType !== "manual_review_pending" || fields.template !== "manual_review_pending")
        fail(`${uid} expected existing type holds`);
      if (![priorParent, nextParent].every(parent => parent && Object.keys(parent).length === parentKeys.length &&
          parentKeys.every(key => typeof parent[key] === "string" && parent[key].trim())) ||
          eq(priorParent, nextParent) || !parentKeys.every(key => eq(current[key], nextParent[key])))
        fail(`${uid} invalid parent correction`);
      const expectedParent = previous ? nextParent : priorParent;
      if (!parentKeys.every(key => eq(row[key], expectedParent[key])) ||
          row.conceptClusterKey !== expectedParent.subUnitKey || (previous && !alreadyRebound))
        fail(`${uid} registered parent drift`);
      const bp = item.basicParent;
      if (!bp || !crosswalk.some(r => ["grade", "curriculumKey", "courseKey", "L1", "L2"].every(key => r[key] === bp[key]) &&
          r.standardUnitKey === nextParent.standardUnitKey && r.subUnitKey === nextParent.subUnitKey))
        fail(`${uid} parent is absent from the canonical crosswalk`);
      const existingLink = links.records.find(link => link.sourceFile === source && Number(link.sourceOrdinal) === n);
      const nextLink = { grade: bp.grade, curriculumKey: bp.curriculumKey, courseKey: bp.courseKey,
        sourceFile: source, sourceOrdinal: n, sourceFingerprint: now.sourceFingerprint, L1: bp.L1, L2: bp.L2,
        reason: `BASIC_PARENT_CORRECTION ${req.requestId}: ${item.reason}`, sourceBodyFingerprint: now.contentFingerprint };
      if ((previous || existingLink) && !eq(existingLink, nextLink)) fail(`${uid} existing reviewed source link differs`);
      const difficulty = difficultyByUid.get(uid);
      if (!difficulty || (previous && Object.entries(difficulty).some(([key, value]) => !eq(row[key], value))))
        fail(`${uid} reviewed difficulty drift`);
      applied.push({ questionUid: uid, sourceOrdinal: n, before: item.before, after: item.after,
        parentBefore: priorParent, parentAfter: nextParent, difficulty, nextLink });
      continue;
    }
    // Only a figure may differ.
    if (!eq(prior.answer, current.answer)) fail(`${uid} answer changed`);
    if (!eq(prior.choices, current.choices)) fail(`${uid} choices changed`);
    if (!eq(prior.solution, current.solution)) fail(`${uid} solution changed`);
    for (const field of CLASSIFICATION_FIELDS) if (!eq(prior[field], current[field])) fail(`${uid} classification field changed in source: ${field}`);
    // A new figure is the reason for this path; the stem may only follow it.
    if (!current.image || current.image === prior.image) fail(`${uid} a newly attached figure is required (image reference unchanged)`);
    const figureDir = `assets/images/${path.basename(source, ".js")}/`;
    const figureName = String(current.image).slice(figureDir.length);
    if (!String(current.image).startsWith(figureDir) || !new RegExp(`^q0*${n}\\.[A-Za-z0-9]+$`).test(figureName))
      fail(`${uid} figure must be ${figureDir}q${n}.<ext>: ${current.image}`);
    const figure = path.resolve(root, "archive", String(current.image));
    if (!figure.startsWith(path.resolve(root, "archive") + path.sep) || !fs.existsSync(figure)) fail(`${uid} figure file missing: ${current.image}`);
    const edits = item.contentEdits || [];
    const contentRule = explainContentChange(prior, current, edits, true);
    // Human review binding: same edits, same resulting stem.
    const reviewed = review.doc.questions.filter(row => row?.questionUid === uid);
    if (reviewed.length !== 1 || reviewed[0].sourceOrdinal !== n) fail(`${uid} review file needs exactly one entry for this question`);
    if (!eq(reviewed[0].contentEdits, edits)) fail(`${uid} contentEdits differ from the review file`);
    if (reviewed[0].contentAfterSha256 !== sha256(String(current.content ?? ""))) fail(`${uid} stem differs from the reviewed stem (contentAfterSha256)`);
    // Reviewed basic parent link bound to the same bytes.
    const existingLink = links.records.find(link => link.sourceFile === source && Number(link.sourceOrdinal) === n);
    let linkAction = "NONE", nextLink = null;
    if (item.basicParent !== undefined) {
      const bp = item.basicParent;
      if (!bp || typeof bp !== "object" || Object.keys(bp).sort().join() !== "L1,L2,courseKey,curriculumKey,grade" ||
          Object.values(bp).some(v => typeof v !== "string" || !v.trim())) fail(`${uid} basicParent needs exactly grade, curriculumKey, courseKey, L1, L2`);
      const mapped = crosswalk.filter(r => r.grade === bp.grade && r.standardUnitKey === row.standardUnitKey && r.subUnitKey === row.subUnitKey);
      const parents = new Set(mapped.map(r => [r.curriculumKey, r.courseKey, r.L1, r.L2].join("\u0000")));
      if (parents.size !== 1 || !parents.has([bp.curriculumKey, bp.courseKey, bp.L1, bp.L2].join("\u0000")))
        fail(`${uid} basicParent is not the single canonical parent of the approved sub-unit ${row.subUnitKey}`);
      if (existingLink && (existingLink.grade !== bp.grade || existingLink.curriculumKey !== bp.curriculumKey || existingLink.courseKey !== bp.courseKey ||
          existingLink.L1 !== bp.L1 || existingLink.L2 !== bp.L2)) fail(`${uid} existing reviewed link has another parent`);
      nextLink = { grade: bp.grade, curriculumKey: bp.curriculumKey, courseKey: bp.courseKey, sourceFile: source, sourceOrdinal: n,
        sourceFingerprint: item.after.sourceFingerprint, L1: bp.L1, L2: bp.L2,
        reason: existingLink?.reason || `BASIC_SCOPE_REBIND ${req.requestId}: approved sub-unit ${row.subUnitKey} maps to this canonical parent; question bytes re-bound after a figure-only change`,
        sourceBodyFingerprint: item.after.contentFingerprint };
      linkAction = !existingLink ? "ADDED" : eq(existingLink, nextLink) ? "UNCHANGED" : "REBOUND";
    } else if (existingLink) fail(`${uid} has a reviewed basic source link; supply basicParent so it is re-bound with the metadata`);
    applied.push({ questionUid: uid, sourceOrdinal: n, before: item.before, after: item.after, contentRule,
      figureChanged: prior.image !== current.image, metadataValuesChanged: false, basicParentLink: linkAction,
      ...(nextLink ? { basicParent: item.basicParent } : {}), nextLink });
  }

  if (verifyProjection) {
    if (!previous) fail("registration receipt required before --verify-projection");
    for (const record of previous.applied) {
      const row = metaRows.get(record.questionUid), id = idRows.get(record.questionUid);
      if (!eq({ sourceFingerprint: row.sourceFingerprint, contentFingerprint: row.contentFingerprint }, record.after) || id.sourceFingerprint !== record.after.sourceFingerprint)
        fail(`registered fingerprint drift: ${record.questionUid}`);
      if (record.nextLink && !links.records.some(link => eq(link, record.nextLink))) fail(`registered basic source link drift: ${record.questionUid}`);
    }
    return { status: "PASS", requestId: req.requestId, verifiedRows: previous.applied.length, totalQuestions: req.items.length, replay: true, consumerSearchStatus: correction ? "STATIC_VALUES_VERIFIED" : "NOT_RUN" };
  }
  if (previous) return { status: "PASS", requestId: req.requestId, replay: true, plannedPaths: [], totalQuestions: req.items.length, verifiedRows: applied.length };

  for (const record of applied) {
    const row = metaRows.get(record.questionUid), id = idRows.get(record.questionUid);
    row.sourceFingerprint = record.after.sourceFingerprint;
    row.contentFingerprint = record.after.contentFingerprint;
    id.sourceFingerprint = record.after.sourceFingerprint;
    if (correction) Object.assign(row, record.parentAfter, record.difficulty, { conceptClusterKey: record.parentAfter.subUnitKey });
    if (record.nextLink) {
      const at = links.records.findIndex(link => link.sourceFile === source && Number(link.sourceOrdinal) === record.sourceOrdinal);
      if (at >= 0) links.records[at] = record.nextLink; else links.records.push(record.nextLink);
    }
  }
  const stableIdentity = { ...identity }; delete stableIdentity.generatedAt; delete stableIdentity.identityDigest;
  identity.identityDigest = sha256(JSON.stringify(stableIdentity));
  const receipt = { schemaVersion: RECEIPT_SCHEMA, requestId: req.requestId, requestSha256, examUid: req.examUid, sourceArchiveFile: source,
    sourceBlobSha1: req.expectedSourceBlobSha1, previousSourceBlobSha1: req.previousSourceBlobSha1, sourceRawSha256: sha256(bytes),
    approval: req.approval, metadataRegistrationStatus: correction ? "BASIC_PARENT_CORRECTED" : "FINGERPRINT_REBOUND", metadataValuesChanged: correction,
    consumerSearchStatus: "NOT_RUN", totalRebound: applied.length, applied };
  const output = new Map([[META, json(metadata)], [IDENTITY, JSON.stringify(identity) + "\n"], [LINKS, json(links)], [receiptPath, json(receipt)]]);
  const changed = [...output].filter(([file, text]) => !fs.existsSync(safePath(root, file)) || fs.readFileSync(safePath(root, file), "utf8").replaceAll("\r\n", "\n") !== text);
  if (write) {
    const backup = new Map();
    try {
      for (const [file, text] of changed) {
        const full = safePath(root, file);
        backup.set(full, fs.existsSync(full) ? fs.readFileSync(full) : null);
        fs.mkdirSync(path.dirname(full), { recursive: true });
        fs.writeFileSync(full, text, "utf8");
      }
    } catch (error) {
      for (const [full, original] of backup) { if (original === null) fs.rmSync(full, { force: true }); else fs.writeFileSync(full, original); }
      throw error;
    }
  }
  return { status: "PASS", write, requestId: req.requestId, approvalType: req.approval.type, totalRebound: applied.length, totalQuestions: req.items.length,
    consumerSearchStatus: "NOT_RUN", replay: false, plannedPaths: changed.map(([file]) => file) };
}
