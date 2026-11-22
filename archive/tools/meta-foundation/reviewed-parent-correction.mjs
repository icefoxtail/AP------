// Publishes a previously reviewed parent correction without approving a missing
// native type or an absent RPM leaf. The older Pungdeok correction contract and
// figure-only rebind continue through their unchanged registrar branches.
import fs from "node:fs";
import { questionMetadataText, assertMetadataAssembledCurrent, syncMetadataShards } from "./question-metadata-format.mjs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { registerDifficulty5 } from "./register-difficulty5.mjs";
import { refreshRuntime } from "./reviewed-runtime-summary.mjs";
import { REASSESSED_STUDENT_FIELDS } from "./reviewed-source-reassessment.mjs";

const META = "archive/data/question_metadata.json", IDENTITY = "archive/data/question_identity_map.json";
const LINKS = "archive/data/basic-scope-source-links.json", PARENTS = "archive/data/basic-scope-parent-links.json";
const EVIDENCE = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/";
const D5 = ["difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility"];
const PARENT = ["standardUnitKey", "standardUnit", "subUnitKey", "subUnit"];
const SEMANTIC = ["crossConceptKeys", "conditionKeys", "integrationPattern"];
const BEFORE = [...PARENT, "conceptClusterKey", "sourceFingerprint", "contentFingerprint", "problemTypeKey", "templateKey", ...D5, ...SEMANTIC];
const fail = message => { throw new Error("REVIEWED_PARENT_CORRECTION: " + message); };
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const blob = bytes => crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === "object"
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const same = (a, b) => stable(a ?? null) === stable(b ?? null);
const json = value => JSON.stringify(value, null, 2) + "\n";
const text = value => typeof value === "string" && value.trim();
const pick = (row, keys) => Object.fromEntries(keys.map(k => [k, row?.[k] ?? null]));
const fingerprints = q => ({
  sourceFingerprint: sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
    answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null })),
  contentFingerprint: sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, image: q.image ?? null })),
});
const payload = q => pick(q, REASSESSED_STUDENT_FIELDS);

function safe(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || relative.includes("\\") || /[\x00-\x1f]/.test(relative) ||
      relative.split("/").some(p => !p || p === "." || p === "..")) fail("unsafe path");
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail("symlink path");
  return full;
}
function git(root, args) {
  try { return execFileSync("git", args, { cwd: root, maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] }); }
  catch { fail("immutable Git object unavailable"); }
}
function exactCommit(root, commit) {
  if (!/^[a-f0-9]{40}$/.test(commit || "") || git(root, ["rev-parse", "--verify", `${commit}^{commit}`]).toString().trim() !== commit)
    fail("exact immutable commit required");
}
function bank(bytes) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(bytes.toString(), ctx, { timeout: 5000 });
  const rows = ctx.window.questionBank || ctx.window.questions;
  if (!Array.isArray(rows)) fail("source bank missing");
  return JSON.parse(JSON.stringify(rows));
}
function unique(rows, key, label) {
  if (!Array.isArray(rows)) fail(`${label} missing`);
  const map = new Map();
  for (const row of rows) {
    if (row?.[key] == null || map.has(row[key])) fail(`${label} duplicate/missing ${key}`);
    map.set(row[key], row);
  }
  return map;
}
function bound(root, ref, refs, prefix = EVIDENCE) {
  if (!ref || !/^[a-f0-9]{64}$/.test(ref.sha256 || "") || !ref.path?.startsWith(prefix) || !ref.path.endsWith(".json") ||
      !refs?.some(r => same(r, ref))) fail("SHA-bound evidence reference required");
  const bytes = fs.readFileSync(safe(root, ref.path));
  if (sha(bytes) !== ref.sha256) fail("evidence SHA drift");
  return { bytes, data: JSON.parse(bytes) };
}
function nativeReview(root, req) {
  const spec = req.approval.nativeParentReview;
  if (spec.schemaVersion !== "archive-reviewed-parent-correction-v1") fail("native parent review schema mismatch");
  exactCommit(root, spec.reviewCommit); safe(root, spec.reviewPath);
  const nativePrefix = spec.reviewRef?.path === spec.reviewPath ? "docs/operations/" : EVIDENCE;
  const loaded = bound(root, spec.reviewRef, req.approval.evidenceRefs, nativePrefix);
  if (sha(git(root, ["show", `${spec.reviewCommit}:${spec.reviewPath}`])) !== spec.reviewRef.sha256)
    fail("native review differs from its immutable commit");
  const doc = loaded.data;
  const kind = doc.schemaVersion;
  if (!["m1s2-integrated-metadata-review-v1", "m1-s2-integrated-semantic-review-v1"].includes(kind) ||
      doc.sourceArchiveFile !== req.sourceArchiveFile || !text(doc.reviewer || doc.worker)) fail("unsupported native review/source");
  const count = doc.questionCount ?? doc.reviewedCount;
  if (count !== req.expectedQuestionCount || doc.items?.length !== count) fail("native review denominator mismatch");
  const byUid = unique(doc.items, "questionUid", "native review"), byOrdinal = unique(doc.items, "sourceOrdinal", "native review");
  if ([...byOrdinal.keys()].some(n => !Number.isInteger(n) || n < 1 || n > count)) fail("native review ordinal outside exam");
  const sourcePath = `archive/exams/${req.sourceArchiveFile}`;
  const committed = bank(git(root, ["show", `${spec.reviewCommit}:${sourcePath}`]));
  const reviewed = bank(git(root, ["cat-file", "blob", doc.sourceGitBlobSha]));
  if (committed.length !== count || reviewed.length !== count) fail("native source denominator mismatch");
  return { spec, doc, kind, byUid, committed, reviewed };
}
function verifyAssets(root, commit, question) {
  const paths = new Set();
  for (const key of ["image", "images", "solutionImage", "solutionImages"]) {
    const values = Array.isArray(question[key]) ? question[key] : [question[key]];
    for (const value of values) {
      if (value == null || value === "") continue;
      if (typeof value !== "string" || !/^(?:archive\/)?assets\//.test(value) || /[?#]/.test(value)) fail("unsupported reviewed asset shape");
      paths.add(value.startsWith("archive/") ? value : `archive/${value}`);
    }
  }
  for (const p of paths) {
    const full = safe(root, p), priorBlob = git(root, ["rev-parse", `${commit}:${p}`]).toString().trim();
    const currentBlob = fs.existsSync(full) ? blob(fs.readFileSync(full)) : git(root, ["rev-parse", `HEAD:${p}`]).toString().trim();
    if (priorBlob !== currentBlob) fail("reviewed renderer asset bytes changed");
  }
}
function existingNative(root, row, after) {
  const dir = "archive/data/meta-foundation/canonical/packs";
  const matches = [];
  for (const name of fs.readdirSync(safe(root, dir))) {
    const p = `${dir}/${name}`;
    if (!fs.existsSync(safe(root, `${p}/pack.json`)) || !fs.existsSync(safe(root, `${p}/taxonomy.json`))) continue;
    const pack = JSON.parse(fs.readFileSync(safe(root, `${p}/pack.json`)));
    const tax = JSON.parse(fs.readFileSync(safe(root, `${p}/taxonomy.json`)));
    const pt = tax.problemTypes?.find(r => r.problemTypeKey === row.problemTypeKey && r.status === "ACTIVE");
    const tpl = tax.templates?.find(r => r.templateKey === row.templateKey && r.status === "ACTIVE" && r.parentProblemTypeKey === row.problemTypeKey);
    if (!pt || !tpl || pack.canonicalStatus !== "ACTIVE" || !pack.curricula?.includes(after.curriculumKey) || !pack.standardCourses?.includes(row.standardCourse)) continue;
    const bindings = JSON.parse(fs.readFileSync(safe(root, `${p}/bindings.json`))).bindings || [];
    const exact = bindings.filter(r => r.status === "ACTIVE" && r.curriculum === after.curriculumKey && r.standardCourse === row.standardCourse &&
      r.problemTypeKey === row.problemTypeKey && r.standardUnitKey === after.standardUnitKey && r.subUnitKey === after.subUnitKey);
    if (exact.length === 1) matches.push({ packId: pack.packId, pt, tpl, binding: exact[0] });
  }
  if (matches.length !== 1) fail("preserved type requires one ACTIVE exact binding and unchanged PT/TPL");
  return matches[0];
}

export function registerReviewedParentCorrection({ root, request: req, write = false, verifyProjection = false }) {
  if (write && verifyProjection) fail("projection verification is read-only");
  if (req.schemaVersion !== "archive-basic-parent-correction-request-v1" || req.approval?.type !== "BASIC_PARENT_CORRECTION" ||
      req.approval.metadataReviewed !== true || !text(req.approval.approvedBy) || req.registryChanges !== undefined ||
      !/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(req.requestId || "")) fail("request identity/approval mismatch");
  if (!req.sourceArchiveFile?.startsWith("original/middle/m1/2") || !req.sourceArchiveFile.endsWith(".js") ||
      req.examUid !== path.basename(req.sourceArchiveFile, ".js")) fail("unsupported source/exam identity");
  if (!Array.isArray(req.items) || req.items.length < 1 || req.items.length > 50) fail("item scope required");
  unique(req.items, "questionUid", "request"); unique(req.items, "sourceOrdinal", "request");
  const read = p => JSON.parse(fs.readFileSync(safe(root, p)));
  const bytes = fs.readFileSync(safe(root, `archive/exams/${req.sourceArchiveFile}`));
  if (blob(bytes) !== req.expectedSourceBlobSha1) fail("current source Git blob drift");
  exactCommit(root, req.previousSourceCommit);
  if (git(root, ["rev-parse", `${req.previousSourceCommit}:archive/exams/${req.sourceArchiveFile}`]).toString().trim() !== req.previousSourceBlobSha1)
    fail("previous source commit/path binding mismatch");
  const current = bank(bytes), prior = bank(git(root, ["cat-file", "blob", req.previousSourceBlobSha1]));
  if (!Number.isInteger(req.expectedQuestionCount) || current.length !== req.expectedQuestionCount || prior.length !== current.length)
    fail("source denominator mismatch");
  const native = nativeReview(root, req), meta = read(META), identity = read(IDENTITY), links = read(LINKS), parents = read(PARENTS);
  const m = unique(meta.records.filter(r => r.sourceArchiveFile === req.sourceArchiveFile), "questionUid", "metadata");
  const ids = unique(identity.records.filter(r => r.sourceArchiveFile === req.sourceArchiveFile), "questionUid", "identity");
  if (m.size !== current.length || ids.size !== current.length || links.status !== "REVIEWED_SCOPE_LINKS") fail("sidecar denominator/status mismatch");
  const receiptPath = `${EVIDENCE}${req.requestId}.json`, receiptFull = safe(root, receiptPath), requestSha256 = sha(stable(req));
  const previous = fs.existsSync(receiptFull) ? read(receiptPath) : null;
  if (previous && previous.requestSha256 !== requestSha256) fail("requestId reused with different content");
  if (verifyProjection && !previous) fail("registration receipt required");
  const difficulty = bound(root, req.difficultyRequestRef, req.approval.evidenceRefs, ".archive-meta-register/evidence/").data;
  const difficultyEvidence = { path: difficulty.reviewedCorrection?.evidencePath, sha256: difficulty.reviewedCorrection?.evidenceSha256 };
  if (!same(req.difficultyEvidence, difficultyEvidence)) fail("reviewed difficulty evidence binding mismatch");
  bound(root, req.difficultyEvidence, req.approval.evidenceRefs, ".archive-meta-register/evidence/");
  if (difficulty.schemaVersion !== "archive-difficulty5-register-request-v1" || difficulty.gemini?.sourceArchiveFile !== req.sourceArchiveFile ||
      difficulty.gemini.latestBlobSha !== req.expectedSourceBlobSha1 || difficulty.gemini.items?.length !== req.items.length ||
      !same(difficulty.gemini.items.map(r => r.questionUid).sort(), req.items.map(r => r.questionUid).sort())) fail("reviewed difficulty scope mismatch");
  if (!previous) registerDifficulty5({ root, request: difficulty, write: false });
  const difficultyRows = unique(difficulty.gemini.items, "questionUid", "difficulty");
  const runtimeRoot = "archive/data/meta-foundation/runtime", runtimes = new Map();
  for (const file of fs.readdirSync(safe(root, runtimeRoot)).filter(f => f.endsWith(".json") && f !== "runtime-bridge-receipt.json")) {
    const data = read(`${runtimeRoot}/${file}`);
    if (Array.isArray(data.records)) runtimes.set(`${runtimeRoot}/${file}`, data);
  }
  const touched = new Set(), applied = [];
  for (const item of req.items) {
    const uid = item.questionUid, n = item.sourceOrdinal, row = m.get(uid), id = ids.get(uid), judged = native.byUid.get(uid);
    if (!row || !id || !judged || judged.sourceOrdinal !== n || row.sourceOrdinal !== n || id.sourceOrdinal !== n || !text(item.reason))
      fail("UID/ordinal/native review mismatch");
    bound(root, native.spec.reviewRef, item.evidenceRefs, native.spec.reviewRef.path === native.spec.reviewPath ? "docs/operations/" : EVIDENCE);
    const q = current[n - 1], old = prior[n - 1], now = fingerprints(q), was = fingerprints(old);
    if (!same(item.before, was) || !same(item.after, now) || !same(item.after.contentFingerprint, item.before.contentFingerprint))
      fail(`${uid} before/after source fingerprints mismatch`);
    if (!same(payload(q), payload(native.reviewed[n - 1])) || !same(payload(q), payload(native.committed[n - 1])))
      fail(`${uid} reviewed student payload changed`);
    verifyAssets(root, native.spec.reviewCommit, q);
    for (const k of ["id", "sourceQuestionNo", "content", "choices", "answer", "image", "questionType", "score"])
      if (!same(old[k], q[k])) fail(`${uid} protected source field changed: ${k}`);
    const hashes = judged.hashes || judged.fourSlot?.sourceFingerprints;
    if (hashes?.QFULL !== now.sourceFingerprint || hashes.QBODY !== now.contentFingerprint) fail(`${uid} native fingerprints mismatch`);
    if (!String(row.metadataStatus).startsWith("approved_") || row.registrationUpdateState ||
        !["standardUnit", "subUnit"].every(k => /^approved(?:_|$)/.test(row.fieldStatus?.[k] || "")) || !row.approvalEvidence?.length)
      fail(`${uid} prior basic approval missing`);
    const wanted = judged.reviewedProposedMetadata || judged.proposed;
    const rpm = judged.rpmProposedParent || judged.rpmDecision;
    if (!wanted || !text(judged.decisiveStep) || rpm?.status && rpm.status !== "RPM_LEAF_GAP" ||
        judged.publicationStatus && judged.publicationStatus !== "HOLD_SHARED_PARENT_CONSUMER_CONFLICT") fail(`${uid} unsettled native parent review`);
    if (!same(item.parentAfter, pick(wanted, PARENT)) || !same(item.parentBefore, pick(item.expectedBefore, PARENT)) ||
        same(item.parentBefore, item.parentAfter) || !PARENT.every(k => text(wanted[k]) && same(q[k], wanted[k]))) fail(`${uid} reviewed parent correction mismatch`);
    if (!same(Object.keys(item.expectedBefore || {}).sort(), BEFORE.slice().sort())) fail(`${uid} exact before snapshot required`);
    const bp = { grade: "중1", curriculumKey: rpm.curriculum, courseKey: rpm.scope, L1: rpm.majorUnit, L2: rpm.midUnit };
    if (!same(item.basicParent, bp) || !parents.records?.some(r => Object.entries(bp).every(([k, v]) => r[k] === v) &&
        r.standardUnitKey === wanted.standardUnitKey && r.subUnitKey === wanted.subUnitKey)) fail(`${uid} canonical basic parent mismatch`);
    const d5 = difficultyRows.get(uid)?.after;
    if (!same(d5, pick(wanted, D5)) || !D5.every(k => same(q[k], wanted[k]))) fail(`${uid} reviewed difficulty disagreement`);
    const semantic = pick(wanted, SEMANTIC);
    if (!SEMANTIC.every(k => same(q[k], semantic[k])) || !Array.isArray(semantic.crossConceptKeys) || !Array.isArray(semantic.conditionKeys) ||
        !same(semantic.crossConceptKeys, item.expectedBefore.crossConceptKeys || []) || !same(semantic.conditionKeys, item.expectedBefore.conditionKeys || []) ||
        !text(semantic.integrationPattern)) fail(`${uid} unsupported auxiliary semantic change`);
    const oldRuntime = [...runtimes.entries()].flatMap(([file, data]) => data.records.filter(r => r.questionUid === uid).map(r => ({ file, row: r })));
    const original = previous ? previous.applied.find(r => r.questionUid === uid) : null;
    if (previous && !original) fail(`${uid} prior receipt scope mismatch`);
    if (!previous && (!same(pick(row, BEFORE), item.expectedBefore) || id.sourceFingerprint !== was.sourceFingerprint)) fail(`${uid} registered before drift`);
    if (previous && (!same(row, original.metadataAfter) || id.sourceFingerprint !== now.sourceFingerprint ||
        !same(oldRuntime.map(r => ({ file: r.file, row: r.row })), original.runtimeAfter))) fail(`${uid} registered projection drift`);
    const carried = ["standardCourse", "level", "problemTypeKey", "templateKey", "primaryMethod", "decisiveStep"];
    const next = { ...row, ...Object.fromEntries(carried.filter(k => Object.hasOwn(wanted, k)).map(k => [k, wanted[k]])),
      ...item.parentAfter, ...semantic, ...d5, ...now, conceptClusterKey: wanted.subUnitKey,
      L1: bp.L1, L2: bp.L2, curriculum: bp.curriculumKey, curriculumKey: bp.curriculumKey, courseKey: bp.courseKey,
      rpmPrimaryPath: null, rpmL1: bp.L1, rpmL2: bp.L2, rpmL3: null, rpmL4: null,
      rpmPathStatus: "HOLD_NO_EQUIVALENT_PATH", rpmPathHoldReason: "Native review retains RPM_LEAF_GAP; only the reviewed basic parent is published.",
      approvalEvidence: [...new Set([...row.approvalEvidence, receiptPath])] };
    let preservedNative = null;
    if (item.typeDisposition === "PRESERVE_APPROVED_TYPE") {
      if (judged.gapType !== "RPM_LEAF_GAP" || !same(pick(wanted, ["problemTypeKey", "templateKey"]), pick(item.expectedBefore, ["problemTypeKey", "templateKey"])) ||
          !["problemType", "template"].every(k => /^approved(?:_|$)/.test(row.fieldStatus?.[k] || "")) || oldRuntime.length !== 1)
        fail(`${uid} reviewed type preservation mismatch`);
      preservedNative = existingNative(root, row, next);
      Object.assign(next, { L3: preservedNative.pt.canonicalLabelKo, L4: preservedNative.tpl.canonicalLabelKo });
      const rr = oldRuntime[0].row;
      if (!previous && (!same(pick(rr, ["sourceFingerprint", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey"]),
          pick(item.expectedBefore, ["sourceFingerprint", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey"])) ||
          runtimes.get(oldRuntime[0].file).packId !== preservedNative.packId)) fail(`${uid} approved runtime drift`);
      Object.assign(rr, pick(next, [...PARENT, ...SEMANTIC, ...D5, "sourceFingerprint", "contentFingerprint", "L1", "L2", "L3", "L4", "curriculum", "curriculumKey", "courseKey", "standardCourse", "rpmPathStatus", "rpmPathHoldReason"]));
      if (Object.hasOwn(rr, "approvedSourceFingerprint")) rr.approvedSourceFingerprint = now.sourceFingerprint;
      touched.add(oldRuntime[0].file);
    } else {
      if (judged.judgment !== "CORRECT_WITH_TYPE_HOLD" || judged.typeReview?.status !== "RPM_LEAF_GAP") fail(`${uid} explicit native type hold missing`);
      if (item.typeDisposition === "WITHDRAW_UNSUPPORTED_TYPE") {
        if (wanted.problemTypeKey !== null || wanted.templateKey !== null || !item.expectedBefore.problemTypeKey || !item.expectedBefore.templateKey ||
            !same(judged.typeReview.currentPair, [item.expectedBefore.problemTypeKey, item.expectedBefore.templateKey])) fail(`${uid} type withdrawal is not reviewed`);
      } else if (item.typeDisposition === "KEEP_UNREGISTERED_TYPE") {
        if (item.expectedBefore.problemTypeKey || item.expectedBefore.templateKey || oldRuntime.length) fail(`${uid} unregistered type state drift`);
      } else fail(`${uid} explicit type disposition required`);
      Object.assign(next, { problemTypeKey: item.typeDisposition === "KEEP_UNREGISTERED_TYPE" ? item.expectedBefore.problemTypeKey : null,
        templateKey: item.typeDisposition === "KEEP_UNREGISTERED_TYPE" ? item.expectedBefore.templateKey : null,
        L3: null, L4: null, metadataStatus: "approved_partial_with_explicit_holds", metadataApprovalType: "BASIC_PARENT_CORRECTION",
        metadataRevision: `archive-basic-parent-correction-v1:${req.requestId}`,
        foundationTaxonomyStatus: "HOLD", metaFoundationStatus: "HOLD",
        tagStatus: "approved_subunit_concept_partial", metaFoundationHoldReason: "TYPE_PATH_UNBOUND_UNIT_SUB_ONLY",
        l3Disposition: "HOLD", l4Disposition: "HOLD",
        fieldStatus: { ...row.fieldStatus, problemType: "manual_review_pending", template: "manual_review_pending" } });
      for (const r of oldRuntime) { runtimes.get(r.file).records = runtimes.get(r.file).records.filter(x => x.questionUid !== uid); touched.add(r.file); }
    }
    const existingLinks = links.records.filter(r => r.sourceFile === req.sourceArchiveFile && Number(r.sourceOrdinal) === n);
    if (existingLinks.length > 1) fail(`${uid} duplicate basic source link`);
    const nextLink = { ...bp, sourceFile: req.sourceArchiveFile, sourceOrdinal: n, sourceFingerprint: now.sourceFingerprint,
      sourceBodyFingerprint: now.contentFingerprint, reason: `BASIC_PARENT_CORRECTION ${req.requestId}: ${item.reason}` };
    if (!same(existingLinks[0] || null, previous ? nextLink : item.linkBefore)) fail(`${uid} basic source link before drift`);
    Object.assign(row, next); id.sourceFingerprint = now.sourceFingerprint;
    links.records = links.records.filter(r => !(r.sourceFile === req.sourceArchiveFile && Number(r.sourceOrdinal) === n)); links.records.push(nextLink);
    applied.push({ questionUid: uid, sourceOrdinal: n, before: item.before, after: item.after, parentBefore: item.parentBefore,
      parentAfter: item.parentAfter, difficulty: d5, nextLink, typeDisposition: item.typeDisposition, metadataAfter: next,
      runtimeAfter: preservedNative ? oldRuntime.map(r => ({ file: r.file, row: r.row })) : [],
      nativeReview: { commit: native.spec.reviewCommit, path: native.spec.reviewPath, sha256: native.spec.reviewRef.sha256 },
      newFullSemanticApproval: false, nativeTypeApprovalPreserved: Boolean(preservedNative), rpmLeafApproved: false });
  }
  if (previous) return { status: "PASS", requestId: req.requestId, replay: true, verifiedRows: applied.length,
    totalQuestions: applied.length, plannedPaths: [], consumerSearchStatus: "STATIC_VALUES_VERIFIED" };
  const stableIdentity = { ...identity }; delete stableIdentity.generatedAt; delete stableIdentity.identityDigest;
  identity.identityDigest = sha(JSON.stringify(stableIdentity));
  for (const [field, statusField] of [["explicitProblemTypeHolds", "problemType"], ["explicitTemplateHolds", "template"]])
    if (Object.hasOwn(meta.counts || {}, field)) meta.counts[field] = meta.records.filter(r => r.fieldStatus?.[statusField] === "manual_review_pending").length;
  const receipt = { schemaVersion: "archive-basic-scope-rebind-registration-v1", requestId: req.requestId, requestSha256,
    examUid: req.examUid, sourceArchiveFile: req.sourceArchiveFile, sourceBlobSha1: req.expectedSourceBlobSha1,
    previousSourceBlobSha1: req.previousSourceBlobSha1, sourceRawSha256: sha(bytes), approval: req.approval,
    metadataRegistrationStatus: "BASIC_PARENT_CORRECTED", metadataValuesChanged: true, consumerSearchStatus: "NOT_RUN",
    totalRebound: applied.length, newFullSemanticApprovals: 0, nativeTypeApprovalsPreserved: applied.filter(r => r.nativeTypeApprovalPreserved).length,
    explicitTypeHolds: applied.filter(r => !r.nativeTypeApprovalPreserved).length, applied };
  const outputs = new Map([[META, questionMetadataText(meta)], [IDENTITY, JSON.stringify(identity) + "\n"], [LINKS, json(links)], [receiptPath, json(receipt)]]);
  for (const file of touched) { const rt = runtimes.get(file); refreshRuntime(rt);
    if (Object.hasOwn(rt.counts || {}, "runtimeSelectable")) rt.counts.runtimeSelectable = rt.records.filter(r => r.runtimeSelectable === true).length;
    outputs.set(file, json(rt)); }
  const changed = [...outputs].filter(([file, value]) => !fs.existsSync(safe(root, file)) || fs.readFileSync(safe(root, file), "utf8") !== value);
  if (write) {
    assertMetadataAssembledCurrent(root);
    const backups = new Map();
    try { for (const [file, value] of changed) { const full = safe(root, file); backups.set(full, fs.existsSync(full) ? fs.readFileSync(full) : null);
      fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, value); }
      syncMetadataShards(root); }
    catch (error) { for (const [file, value] of backups) { if (value === null) fs.rmSync(file, { force: true }); else fs.writeFileSync(file, value); } throw error; }
  }
  return { status: "PASS", write, requestId: req.requestId, approvalType: req.approval.type, totalRebound: applied.length,
    totalQuestions: applied.length, consumerSearchStatus: "NOT_RUN", replay: false, plannedPaths: changed.map(([file]) => file) };
}
