// Direct type judgment (PT/TPL only) registration lane of the reviewed-exam registrar.
//
// Request: archive-reviewed-exam-meta-register-request-v2 with approval.type DIRECT_JUDGMENT, scope PARTIAL_UIDS and
// fieldScope TYPE_ONLY. The decision (docs/agents/metadata.md, "유형(PT/TPL) 판정은 직접 판정 결과를 정본으로 받는다"):
// one direct judgment (a one-sentence decisive solution step per question) is the official value of the type fields.
//
// What this lane writes, per question: problemTypeKey, templateKey (absent = PT only), fieldStatus.problemType /
// fieldStatus.template = "approved_direct_judgment", and one typeApproval record. Nothing else on the row changes: the
// unit, sub-unit, difficulty, CrossConcept, Condition, integration pattern, RPM path, row-level metadataStatus,
// reviewStatus, tags, fingerprints and the identity map are neither read for approval nor written. No runtime row is
// created. The receipt keeps the registrar's v2 receipt schema (registry lineage reads it) with fieldScope TYPE_ONLY.
//
// Course names: the row's course and the binding's course may differ in spelling or be the same subject of the other curriculum when
// archive/data/meta-foundation/course-aliases.v1.json says so (never across grades or subjects); the judgment records the relation.
//
// A request may also widen a pack's declared scope (append curricula/standardCourses values only) next to its new bindings.
//
// What stays strict (the type fields themselves): the PT is ACTIVE; a TPL is ACTIVE and its parent is the chosen PT; an
// ACTIVE binding of the PT exists for the question's curriculum and course (a new key and its binding may be added by the
// same request through add-only registryChanges); `before` equals the current values; a type that is already approved is
// never overwritten; the judgment is bound to the current source bytes (blob and per-question fingerprints).
import fs from "node:fs";
import { questionMetadataText } from "./question-metadata-format.mjs";
import path from "node:path";
import { refreshRuntime } from "./reviewed-runtime-summary.mjs";
import { loadCourseAliases } from "./course-aliases.mjs";
import { textFingerprint } from "./text-binding-lib.mjs";

export const DIRECT_JUDGMENT = "DIRECT_JUDGMENT";
export const FIELD_SCOPE_TYPE_ONLY = "TYPE_ONLY";
export const TYPE_FIELD_STATUS = "approved_direct_judgment";
export const TYPE_APPROVAL_SCHEMA = "archive-type-direct-judgment-approval-v1";
export const DECISION_DOCUMENT = "docs/agents/metadata.md";
// Statuses of an unapproved type field. Anything else (approved_*, hold, adjudicated, debt) is never overwritten.
const OVERWRITABLE_STATUS = new Set(["", "manual_review_pending", "projection_unmaterialized"]);
const REQUEST_KEYS = new Set(["schemaVersion", "requestId", "examUid", "sourceArchiveFile", "expectedSourceBlobSha1", "expectedQuestionCount",
  "scope", "fieldScope", "approval", "registryChanges", "items"]);
const APPROVAL_KEYS = new Set(["type", "metadataReviewed", "reviewPassCount", "approvedBy", "judge", "decisionRef", "resultSource", "evidenceRefs"]);
const ITEM_KEYS = new Set(["questionUid", "sourceOrdinal", "before", "after", "rationale", "judge", "scope", "judgedFingerprints", "textBindingFingerprint", "evidenceRefs", "reason"]);
const TYPE_FIELDS = ["problemTypeKey", "templateKey"];
const PLACEHOLDER = /^(?:-|none|null|n\/a|tbd|todo|\?+)$/i;
const compact = value => String(value ?? "").normalize("NFC").replace(/\s/g, "");
const empty = value => value === null || value === undefined || value === "";
const textOf = value => typeof value === "string" ? value.trim() : "";
const ADDABLE_REGISTRY = [
  [/^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9-]+\/taxonomy\.json$/, new Set(["problemTypes", "templates"])],
  [/^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9-]+\/bindings\.json$/, new Set(["bindings"])],
];

// 유형 칸에 든 값이 등록부의 ACTIVE 키일 때만 "지킬 값"이다(2026-11-20, 값이 있으면 보인다). 등록부에 없는 옛 키로 채워진 칸은 값이 없는 칸과 같아
// approved 상태여도 채울 수 있고, 옛 키와 옛 상태는 typeApproval.priorType에 그대로 남는다. 등록부의 ACTIVE 키가 든 approved 값은 그대로 보호한다.
// registry는 { pt: Map, tpl: Map } (변환기의 ctx.registry, 등록기의 tables 모두 같은 모양). 변환기와 등록기가 이 함수 하나를 쓴다.
export const typeFieldHoldsRegisteredValue = (registry, field, key) =>
  !empty(key) && (field === "problemType" ? registry.pt : registry.tpl).get(key)?.status === "ACTIVE";
export const isDirectJudgmentRequest = req => req?.approval?.type === DIRECT_JUDGMENT;
// The judgment is bound to the stem and choices of each question (text-v1 fingerprint `textBindingFingerprint`), nothing else: the
// exam file's blob, figures, solution and answer may change after the judge looked. The lane is atomic per request, so one question
// whose stem or choices differ refuses the whole request (the converter leaves such questions out beforehand).
// `judgedFingerprints` is still accepted in old requests but no longer compared.

function assertRequestShape(req, h) {
  const { fail, requireText } = h;
  for (const key of Object.keys(req)) if (!REQUEST_KEYS.has(key)) fail(`direct judgment request key not allowed: ${key}`);
  if (req.scope !== "PARTIAL_UIDS") fail("direct judgment requires scope PARTIAL_UIDS");
  if (req.fieldScope !== FIELD_SCOPE_TYPE_ONLY) fail("direct judgment requires fieldScope TYPE_ONLY");
  if (req.registrationMode !== undefined) fail("direct judgment cannot use a registrationMode");
  const approval = req.approval;
  for (const key of Object.keys(approval)) if (!APPROVAL_KEYS.has(key)) fail(`direct judgment approval key not allowed: ${key}`);
  if (approval.metadataReviewed !== true) fail("direct judgment requires metadataReviewed true");
  if (approval.reviewPassCount !== 1) fail("direct judgment reviewPassCount must be 1");
  requireText(approval.approvedBy, "approvedBy");
  requireText(approval.judge, "approval.judge");
  const ref = approval.decisionRef;
  if (!ref || ref.document !== DECISION_DOCUMENT || !textOf(ref.section)) fail(`decisionRef must name ${DECISION_DOCUMENT} and a section heading`);
  const result = approval.resultSource;
  if (!result || !textOf(result.branch) || !/^[a-f0-9]{40}$/.test(result.commit || "") || !textOf(result.file)) fail("resultSource needs branch, 40-hex commit and file");
  if (!Array.isArray(req.items) || !req.items.length) fail("direct judgment items required");
  for (const item of req.items) {
    for (const key of Object.keys(item)) if (!ITEM_KEYS.has(key)) fail(`direct judgment item key not allowed (type fields only): ${item.questionUid}.${key}`);
  }
}

function checkDecisionDocument(root, ref, h) {
  const full = h.safePath(root, ref.document);
  if (!fs.existsSync(full)) h.fail(`decision document missing: ${ref.document}`);
  if (!fs.readFileSync(full, "utf8").includes(ref.section)) h.fail(`decision section not found in ${ref.document}`);
}

// A pack document may only GROW its declared scope: values are appended to curricula / standardCourses, nothing is removed,
// reordered or changed, and no other field differs. (The pack version is bumped by the registry planner as for any pack change.)
const PACK_FILE = /^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9-]+\/pack\.json$/;
const PACK_SCOPE_FIELDS = ["curricula", "standardCourses"];
export function isPackScopeAddition(change) {
  if (!PACK_FILE.test(change?.path || "") || change.collection) return false;
  const { before, after } = change;
  const plain = v => v && typeof v === "object" && !Array.isArray(v);
  if (!plain(before) || !plain(after)) return false;
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  let added = 0;
  for (const key of keys) {
    if (!PACK_SCOPE_FIELDS.includes(key)) { if (JSON.stringify(before[key] ?? null) !== JSON.stringify(after[key] ?? null)) return false; continue; }
    const a = before[key], b = after[key];
    if (!Array.isArray(a) || !Array.isArray(b) || b.length < a.length) return false;
    if (!a.every((value, i) => b[i] === value)) return false;
    const appended = b.slice(a.length);
    if (appended.some(v => typeof v !== "string" || !v.trim()) || new Set(b).size !== b.length) return false;
    added += appended.length;
  }
  return added > 0;
}

function checkRegistryChanges(changes, h) {
  for (const change of changes) {
    if (PACK_FILE.test(change.path || "")) {
      if (!isPackScopeAddition(change)) h.fail(`direct judgment may only add values to a pack's curricula/standardCourses: ${change.path}`);
      continue;
    }
    const allowed = ADDABLE_REGISTRY.find(([pattern]) => pattern.test(change.path || ""));
    if (!allowed || !allowed[1].has(change.collection) || !change.match || change.before !== null || !change.after || change.after.status !== "ACTIVE")
      h.fail(`direct judgment registryChanges may only add ACTIVE problemTypes/templates/bindings: ${change.path}`);
  }
}

// PT/TPL/binding checks that depend only on the registry and the question's curriculum/course (never on its unit).
function checkTypeKeys(tables, { problemTypeKey, templateKey, scope }, h, aliases) {
  const pt = tables.pt.get(problemTypeKey);
  if (!pt || pt.status !== "ACTIVE") h.fail(`inactive/missing PT: ${problemTypeKey}`);
  if (templateKey) {
    const tpl = tables.tpl.get(templateKey);
    if (!tpl || tpl.status !== "ACTIVE") h.fail(`inactive/missing TPL: ${templateKey}`);
    if (tpl.parentProblemTypeKey !== problemTypeKey) h.fail(`TPL parent mismatch: ${templateKey}`);
  }
  // A binding course that is another spelling of the judged scope course is the same course (successors are a row-vs-scope matter only).
  const sameCourse = (a, b) => ["same", "alias"].includes(aliases.relation(a, b));
  const bindings = [...tables.bindings.values()].filter(b => b.curriculum === scope.curriculum &&
    sameCourse(b.standardCourse, scope.standardCourse) && b.problemTypeKey === problemTypeKey);
  const inScope = bindings.some(b => {
    const pack = tables.packs.get(b.ownerPack || pt.ownerPack);
    return pack && pack.meta.curricula.includes(scope.curriculum) && pack.meta.standardCourses.includes(b.standardCourse);
  });
  if (!bindings.length) h.fail(`ACTIVE curriculum binding missing: ${scope.curriculum}/${scope.standardCourse}/${problemTypeKey}`);
  if (!inScope) h.fail(`binding ownerPack scope missing: ${scope.curriculum}/${scope.standardCourse}/${problemTypeKey}`);
}

const typeSlice = row => ({ questionUid: row.questionUid, sourceArchiveFile: row.sourceArchiveFile, sourceOrdinal: row.sourceOrdinal,
  problemTypeKey: row.problemTypeKey, templateKey: row.templateKey,
  fieldStatus: { problemType: row.fieldStatus?.problemType, template: row.fieldStatus?.template }, typeApproval: row.typeApproval });

export function registerTypeJudgment(ctx) {
  const { root, req, write, verifyProjection, metadata, rows, ids, bank, bytes, blob, receiptPath, requestSha256, previous, scopeFields, h } = ctx;
  const { fail: failWith, eq, safePath, json, digest } = h;
  const aliases = loadCourseAliases(root);
  assertRequestShape(req, h);
  const registryChanges = req.registryChanges || [];
  checkRegistryChanges(registryChanges, h);
  const source = req.sourceArchiveFile;
  const patches = new Map(req.items.map(item => [item.questionUid, item]));
  const consumerFields = { directTypeJudgment: req.items.length, newMetadataApprovals: 0 };

  if (previous) {
    if (previous.schemaVersion !== "archive-reviewed-exam-meta-registration-v2" || previous.fieldScope !== FIELD_SCOPE_TYPE_ONLY ||
        previous.approval?.type !== DIRECT_JUDGMENT || previous.metadataRegistrationStatus !== "REGISTERED" ||
        previous.sourceArchiveFile !== source ||
        previous.scope !== req.scope || previous.expectedQuestionCount !== req.expectedQuestionCount ||
        previous.partialUidCount !== patches.size || previous.totalQuestions !== patches.size ||
        !Array.isArray(previous.typeRecords) || previous.typeRecords.length !== patches.size ||
        previous.appliedRecords?.length || previous.runtimeRecords?.length || previous.appliedIdentityRecords?.length)
      failWith("direct judgment receipt scope/binding drift");
    const tables = h.lookup(h.registryPlan(root, [], h.evidenceRefs));
    for (const record of previous.typeRecords) {
      const patch = patches.get(record.questionUid);
      const current = rows.find(row => row.questionUid === record.questionUid);
      if (!patch || !current || !eq(JSON.parse(JSON.stringify(typeSlice(current))), record)) failWith(`registered type metadata drift: ${record.questionUid}`);
      checkTypeKeys(tables, { problemTypeKey: record.problemTypeKey, templateKey: textOf(record.templateKey), scope: record.typeApproval.scope }, h, aliases);
    }
    return { status: "PASS", requestId: req.requestId, totalQuestions: patches.size, ...scopeFields, fieldScope: FIELD_SCOPE_TYPE_ONLY, replay: true,
      plannedPaths: [], typeApprovals: patches.size, newMetadataApprovals: 0,
      consumerSearchStatus: verifyProjection ? "TYPE_FIELDS_VERIFIED" : "NOT_RUN", browserStatus: "NOT_RUN",
      ...(verifyProjection ? { consumerLanes: consumerFields } : {}) };
  }
  if (verifyProjection) failWith("registration receipt required before --verify-projection");
  // Checked at first registration only: a later edit of the decision document must not invalidate an issued receipt's replay.
  checkDecisionDocument(root, req.approval.decisionRef, h);

  const plan = registryChanges.length ? h.registryPlan(root, registryChanges, h.evidenceRefs) : null;
  const tables = h.lookup(plan || h.registryPlan(root, [], h.evidenceRefs));
  const typeRecords = [], bindingCounts = { exact: 0, content: 0, stale: 0 };
  for (const patch of req.items.slice().sort((a, b) => a.sourceOrdinal - b.sourceOrdinal)) {
    const uid = patch.questionUid, i = patch.sourceOrdinal - 1;
    const current = rows[i], id = ids.get(uid), q = JSON.parse(JSON.stringify(bank[i]));
    if (current?.questionUid !== uid || current.sourceOrdinal !== patch.sourceOrdinal || id?.sourceArchiveFile !== source || id.sourceOrdinal !== patch.sourceOrdinal)
      failWith(`UID/source ordinal mismatch #${patch.sourceOrdinal}`);
    if (!h.sourceUidMatches(q, current, id, i + 1)) failWith(`source UID mismatch #${patch.sourceOrdinal}`);
    h.evidenceRefs(patch.evidenceRefs);
    // The decisive-step sentence is the evidence the decision requires: no sentence, no registration.
    const rationale = textOf(patch.rationale);
    if (rationale.length < 6 || PLACEHOLDER.test(rationale)) failWith(`rationale (decisive solution step) required: ${uid}`);
    const judge = textOf(patch.judge) || req.approval.judge;
    if (!patch.before || !patch.after || Array.isArray(patch.before) || Array.isArray(patch.after)) failWith(`before/after required: ${uid}`);
    for (const side of ["before", "after"]) for (const key of Object.keys(patch[side])) if (!TYPE_FIELDS.includes(key))
      failWith(`direct judgment writes type fields only: ${uid}.${side}.${key}`);
    for (const key of TYPE_FIELDS) if (!Object.hasOwn(patch.before, key)) failWith(`before required: ${uid}.${key}`);
    const problemTypeKey = textOf(patch.after.problemTypeKey), templateKey = textOf(patch.after.templateKey);
    if (!problemTypeKey) failWith(`after.problemTypeKey required: ${uid}`);
    for (const key of TYPE_FIELDS) {
      const was = empty(current[key]) ? "" : current[key], claimed = empty(patch.before[key]) ? "" : patch.before[key];
      if (was !== claimed) failWith(`before mismatch: ${uid}.${key}`);
    }
    // A type that is already approved is final for this lane; an unapproved (draft/pending) value is replaced.
    // A field with no value has nothing to protect: its status is only a tag, so an empty field is filled whatever the tag says.
    for (const field of ["problemType", "template"]) {
      if (!typeFieldHoldsRegisteredValue(tables, field, current[`${field}Key`])) continue;
      const status = String(current.fieldStatus?.[field] ?? "");
      if (/^approved/i.test(status)) failWith(`type already approved: ${uid}.${field}=${status}`);
      if (!OVERWRITABLE_STATUS.has(status)) failWith(`type field status is not overwritable: ${uid}.${field}=${status}`);
    }
    // A row-level taxonomy HOLD is not a reason to refuse (2026-11-20, "값이 있으면 보인다"): the catalog shows a judged type on a held row too;
    // the hold stays on the row's other fields (L4, difficulty, source issue) and this lane never touches them.
    // A receipt on the row's OTHER fields stays replayable: receiptRecordMatchesRow (reviewed-exam-registration-v2.mjs) leaves the type fields
    // out of that comparison when the receipt recorded no type. A row whose type is already approved was refused above.
    const scope = patch.scope;
    if (!scope || !["2015", "2022"].includes(scope.curriculum) || !textOf(scope.standardCourse)) failWith(`scope.curriculum (2015|2022) and scope.standardCourse required: ${uid}`);
    const rowCurriculum = textOf(current.curriculum) || textOf(current.curriculumKey);
    const rowCourse = textOf(current.standardCourse) || textOf(current.courseKey);
    // Row course vs judged course: equal, another spelling of it, the same subject of the other curriculum, or (alias data) a key of a grade
    // at or below the exam's ("reach": units moved between grades, prerequisite content; never a key above the exam's grade).
    const courseRelation = rowCourse ? aliases.relation(rowCourse, scope.standardCourse) ||
      aliases.reach(rowCourse, scope.standardCourse, { sourceArchiveFile: current.sourceArchiveFile, problemTypeKey }) : "";
    if (rowCourse && !courseRelation) failWith(`course mismatch: ${uid} row=${rowCourse} judged=${scope.standardCourse}`);
    // A successor course lives in the other curriculum, so the row's own curriculum is not compared with the binding's then.
    if (rowCurriculum && rowCurriculum !== scope.curriculum && !["successor", "reach"].includes(courseRelation)) failWith(`curriculum mismatch: ${uid} row=${rowCurriculum} judged=${scope.curriculum}`);
    checkTypeKeys(tables, { problemTypeKey, templateKey, scope }, h, aliases);
    // Source binding: the judgment was made on the current question text; the row's own fingerprints are tagged, not rewritten.
    const fp = h.sourceFingerprints(q), judgedText = textFingerprint(q);
    if (!judgedText || patch.textBindingFingerprint !== judgedText) failWith(`stem or choices differ from the judged text (textBindingFingerprint): ${uid}`);
    const rowBinding = current.contentFingerprint !== fp.contentFingerprint ? "stale" : current.sourceFingerprint === fp.sourceFingerprint ? "exact" : "content";
    bindingCounts[rowBinding]++;
    const embedded = { problemTypeKey: q.problemTypeKey ?? null, templateKey: q.templateKey ?? null };
    const hasEmbedded = !empty(q.problemTypeKey) || !empty(q.templateKey);
    // An exam-embedded type that differs from the judged value is no reason to refuse (2026-11-20): the direct judgment is the canonical value;
    // the embedded value and whether it matches are kept in typeApproval.examEmbeddedType below.
    const typeApproval = { schemaVersion: TYPE_APPROVAL_SCHEMA, approvalType: DIRECT_JUDGMENT, reviewPassCount: 1, requestId: req.requestId, judge, rationale,
      // curriculumSource: "row" = the row itself names the curriculum (cross-checked); "request" = only the judgment names it.
      scope: { curriculum: scope.curriculum, standardCourse: scope.standardCourse, curriculumSource: rowCurriculum ? "row" : "request",
        ...(["alias", "successor", "reach"].includes(courseRelation) ? { rowCourse, courseRelation } : {}) },
      judgedSourceFingerprint: fp.sourceFingerprint, judgedContentFingerprint: fp.contentFingerprint, rowBinding,
      // 판정이 본 발문·보기의 지문(text-v1). 이후 해설·정답·그림이 바뀌어도 발문·보기가 같으면 이 판정이 유효하다는 근거다
      // (docs/agents/metadata.md "메타 결속 지문 범위"). 발문이 비어 지문을 만들 수 없는 문항은 필드를 쓰지 않는다.
      textBindingFingerprint: judgedText,
      resultSource: req.approval.resultSource, decisionRef: req.approval.decisionRef, receipt: receiptPath,
      ...(hasEmbedded ? { examEmbeddedType: { ...embedded, matchesRegistered: embedded.problemTypeKey === problemTypeKey && (empty(embedded.templateKey) || embedded.templateKey === templateKey) } } : {}),
      priorType: { problemTypeKey: current.problemTypeKey ?? null, templateKey: current.templateKey ?? null,
        problemTypeStatus: current.fieldStatus?.problemType ?? null, templateStatus: current.fieldStatus?.template ?? null } };
    const final = { ...current, problemTypeKey, templateKey: templateKey || (empty(current.templateKey) ? current.templateKey : ""),
      fieldStatus: { ...(current.fieldStatus || {}), problemType: TYPE_FIELD_STATUS, ...(templateKey ? { template: TYPE_FIELD_STATUS } : {}) },
      typeApproval };
    Object.assign(current, final);
    typeRecords.push(typeSlice(current));
  }

  metadata.counts = { ...(metadata.counts || {}) };
  if (Object.hasOwn(metadata.counts, "explicitProblemTypeHolds")) metadata.counts.explicitProblemTypeHolds = metadata.records.filter(r => r.fieldStatus?.problemType === "manual_review_pending").length;
  if (Object.hasOwn(metadata.counts, "explicitTemplateHolds")) metadata.counts.explicitTemplateHolds = metadata.records.filter(r => r.fieldStatus?.template === "manual_review_pending").length;
  const output = new Map(plan ? plan.output : []);
  if (plan) {
    // A pack whose canonical version moved must keep its runtime file on the same version (consumers compare them).
    const runtimeRoot = "archive/data/meta-foundation/runtime";
    for (const pack of plan.canonical.packs) {
      const before = plan.original.get(`${pack.base}/pack.json`);
      if (!before || before.packVersion === pack.meta.packVersion) continue;
      for (const name of fs.readdirSync(safePath(root, runtimeRoot)).filter(n => n.endsWith(".json") && n !== "runtime-bridge-receipt.json")) {
        const data = JSON.parse(fs.readFileSync(safePath(root, `${runtimeRoot}/${name}`), "utf8"));
        if (data.packId !== pack.meta.packId) continue;
        data.packVersion = pack.meta.packVersion;
        data.runtimeVersion = `${pack.meta.packId}@${pack.meta.packVersion}/reviewed-exam-v2`;
        refreshRuntime(data);
        output.set(`${runtimeRoot}/${name}`, json(data));
      }
    }
  }
  output.set("archive/data/question_metadata.json", questionMetadataText(metadata));
  const outputDigests = [...output].filter(([file, text]) => file !== "archive/data/question_metadata.json" &&
    (!fs.existsSync(safePath(root, file)) || fs.readFileSync(safePath(root, file), "utf8").replaceAll("\r\n", "\n") !== text))
    .map(([file, text]) => ({ path: file, sha256: digest(text) }));
  const receipt = { schemaVersion: "archive-reviewed-exam-meta-registration-v2", requestId: req.requestId, requestSha256, examUid: req.examUid,
    sourceArchiveFile: source, sourceBlobSha1: blob, sourceRawSha256: digest(bytes), approval: req.approval, fieldScope: FIELD_SCOPE_TYPE_ONLY,
    metadataRegistrationStatus: "REGISTERED", examFinalQaStatus: "NOT_EVALUATED_BY_REGISTRAR", consumerSearchStatus: "NOT_RUN",
    totalQuestions: typeRecords.length, registryChanges, typeApprovals: typeRecords.length, newMetadataApprovals: 0, rowBindingCounts: bindingCounts,
    appliedRecords: [], appliedIdentityRecords: [], fingerprintRepairs: [], runtimeRecords: [], typeRecords, outputDigests, ...scopeFields };
  output.set(receiptPath, json(receipt));
  const changed = [...output].filter(([file, text]) => !fs.existsSync(safePath(root, file)) || fs.readFileSync(safePath(root, file), "utf8").replaceAll("\r\n", "\n") !== text);
  if (changed.some(([file]) => file.startsWith("archive/exams/"))) failWith("registration must not write exam source bytes");
  if (!eq(fs.readFileSync(safePath(root, `archive/exams/${source}`)), bytes)) failWith("exam source bytes changed during registration");
  if (write) {
    const backup = new Map();
    try {
      for (const [file, text] of changed) {
        const full = safePath(root, file);
        backup.set(full, fs.existsSync(full) ? fs.readFileSync(full) : null);
        fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, text, "utf8");
      }
    } catch (error) {
      for (const [full, original] of backup) { if (original === null) fs.rmSync(full, { force: true }); else fs.writeFileSync(full, original); }
      throw error;
    }
  }
  return { status: "PASS", write, requestId: req.requestId, approvalType: DIRECT_JUDGMENT, totalQuestions: typeRecords.length, ...scopeFields,
    fieldScope: FIELD_SCOPE_TYPE_ONLY, registryChangeCount: registryChanges.length, typeApprovals: typeRecords.length, newMetadataApprovals: 0,
    rowBindingCounts: bindingCounts, runtimeMaterialized: 0, fingerprintRepairCount: 0, consumerSearchStatus: "NOT_RUN", replay: false,
    plannedPaths: changed.map(([file]) => file) };
}
