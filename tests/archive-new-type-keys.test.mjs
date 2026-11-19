// New PT/TPL keys from the NEW_KEY bundle tables (new-type-keys.mjs, option --bundles of the type-judgment converter).
// Fixture-only: a tiny in-memory repository; no operational counts are pinned.
import test from "node:test";
import assert from "node:assert/strict";
import {
  planRequests, makeRegistry, sourceFingerprints, curriculumGuess, pathGrade
} from "../archive/tools/meta-foundation/build-type-judgment-requests.mjs";
import { makeCourseAliases } from "../archive/tools/meta-foundation/course-aliases.mjs";
import { prepareNewKeys, validateTables, ptKeyOf, tplKeyOf } from "../archive/tools/meta-foundation/new-type-keys.mjs";
import crypto from "node:crypto";

const EXAM = "original/middle/m1/1mid/24_가나중_1학기_중간_중1_기출.js";
const sha1 = bytes => crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
const questions = [1, 2, 3, 4, 5, 6].map(n => ({ id: n, content: `학생용 지문 ${n}`, choices: ["1", "2"], answer: "1", solution: `해설 ${n}`, image: "" }));
const bytes = Buffer.from(`window.questions = ${JSON.stringify(questions)};\n`);
const aliasDoc = { spellingGroups: [{ id: "MIDDLE1", grade: "중1", members: ["중1 수학", "중1"] }, { id: "MIDDLE2", grade: "중2", members: ["중2 수학", "중2"] }], successorGroups: [] };
const groups = new Map(aliasDoc.spellingGroups.map(g => [g.id, g]));
const master = new Map([
  ["M1-01", { key: "M1-01", keyType: "standardUnitKey", status: "active" }],
  ["M1-01-A", { key: "M1-01-A", keyType: "subUnitKey", status: "active", standardUnitKey: "M1-01", labelKo: "소단원 A" }],
  ["M1-01-B", { key: "M1-01-B", keyType: "subUnitKey", status: "active", standardUnitKey: "M1-01", labelKo: "소단원 B" }]
]);
const registry = () => makeRegistry({
  problemTypes: [{ problemTypeKey: "PT_A", status: "ACTIVE", ownerPack: "P1" }],
  templates: [{ templateKey: "TPL_A", status: "ACTIVE", parentProblemTypeKey: "PT_A", ownerPack: "P1" }],
  bindings: [{ problemTypeKey: "PT_A", curriculum: "2015", standardCourse: "중1 수학", standardUnitKey: "M1-01", subUnitKey: "M1-01-A", ownerPack: "P1", status: "ACTIVE" }],
  packs: new Map([["P1", { curricula: ["2015"], standardCourses: ["중1 수학"] }]])
});
const fp = n => sourceFingerprints(questions[n - 1]);
const row = (n, over = {}) => ({ questionUid: `uid${n}`, sourceArchiveFile: EXAM, sourceOrdinal: n, ...fp(n), standardCourse: "중1 수학", standardUnitKey: "M1-01", subUnitKey: "M1-01-A",
  problemTypeKey: "", templateKey: "", metadataRevision: "archive-registration-sync-v1", fieldStatus: { problemType: "manual_review_pending", template: "manual_review_pending" }, ...over });
const makeCtx = records => {
  const identity = new Map(records.map(r => [r.questionUid, { questionUid: r.questionUid, sourceArchiveFile: r.sourceArchiveFile, sourceOrdinal: r.sourceOrdinal }]));
  return { records: new Map(records.map(r => [r.questionUid, r])), identity, identityDoc: { records: [...identity.values()] }, rowsBySource: new Map([[EXAM, records]]),
    identityCountBySource: new Map([[EXAM, records.length]]), registry: registry(), aliases: makeCourseAliases(aliasDoc),
    readBank: () => ({ bank: JSON.parse(JSON.stringify(questions)), bytes }), blobOf: (file, b) => sha1(b) };
};
const line = (n, extra = {}) => ({ uid: `uid${n}`, exam: `archive/exams/${EXAM}`, no: n, decision: "NEW_KEY", pt: null, tpl: null, step: `결정 단계 문장 ${n}`, note: "", figure: false, check: "OK",
  _source: { branch: "data/type-judgment-c", commit: "a".repeat(40), file: "docs/plans/x/type-results-c/m1.jsonl" }, ...extra });
const tables = () => ({
  origin: { branch: "data/type-bundles", commit: "b".repeat(40), dir: "docs/plans/x/type-bundles" },
  ptBundles: [
    { bundle: "NPT_M1_NEW_THING", nameKo: "새 개념", definition: "새 개념을 묻는 문항", course: "middle1", absorbInto: null },
    { bundle: "NPT_M1_FOLDED", nameKo: "접힌 개념", definition: "기존 유형에 흡수", course: "middle1", absorbInto: "PT_A" },
    { bundle: "NPT_M1_UNUSED", nameKo: "쓰이지 않는 개념", definition: "문항이 모두 건너뛰어짐", course: "middle1", absorbInto: null }
  ],
  ptAssign: [
    { uid: "uid1", bundle: "NPT_M1_NEW_THING" }, { uid: "uid2", bundle: "NPT_M1_FOLDED" }, { uid: "uid3", bundle: null },
    { uid: "uid6", bundle: "NPT_M1_UNUSED" }
  ],
  tplBundles: [
    { bundle: "NTPL_M1_NEW_STEP", pt: "PT_A", nameKo: "새 풀이", definition: "새 풀이 단계", absorbInto: null },
    { bundle: "NTPL_M1_FOLDED_STEP", pt: "PT_A", nameKo: "접힌 풀이", definition: "기존 풀이에 흡수", absorbInto: "TPL_A" }
  ],
  tplAssign: [{ uid: "uid4", pt: "PT_A", bundle: "NTPL_M1_NEW_STEP" }, { uid: "uid5", pt: "PT_A", bundle: "NTPL_M1_FOLDED_STEP" }]
});
const records = () => [row(1), row(2), row(3), row(4), row(5), row(6, { problemTypeKey: "PT_A", fieldStatus: { problemType: "approved_review2", template: "approved_review2" } })];
const lines = () => [line(1), line(2), line(3), line(4, { decision: "PICK", pt: "PT_A" }), line(5, { decision: "PICK", pt: "PT_A" }), line(6)];
function plan(over = {}) {
  const ctx = makeCtx(over.records || records());
  const nk = prepareNewKeys({ ctx, tables: over.tables || tables(), resultRows: over.lines || lines(), env: { curriculumGuess, pathGrade }, opts: { master, groups, ...(over.opts || {}) } });
  return { nk, ...planRequests({ ctx: { ...nk.ctx, newKeys: { finalize: nk.finalize } }, resultRows: nk.rows, approvedBy: "테스트 결정", allowPackAdditions: true }) };
}

test("keys come from the bundle id: PT_/TPL_ plus the id without its N prefix; anything else is refused", () => {
  assert.equal(ptKeyOf("NPT_M2_FINITE_DECIMAL"), "PT_M2_FINITE_DECIMAL");
  assert.equal(tplKeyOf("NTPL_M3_FACTORIZATION_IDENTITY_CHECK"), "TPL_M3_FACTORIZATION_IDENTITY_CHECK");
  for (const bad of ["PT_M2_X", "NPT_m2_x", "NPT_", "NTPL_M3_X", "", "NPT_M2__X"]) assert.throws(() => ptKeyOf(bad), /BUNDLE_ID_INVALID/);
  assert.throws(() => tplKeyOf("NPT_M3_X"), /BUNDLE_ID_INVALID/);
});

test("table defects stop the run (duplicate bundle, unknown bundle reference, missing name or definition)", () => {
  const t = tables();
  validateTables(t);
  assert.throws(() => validateTables({ ...t, ptBundles: [...t.ptBundles, t.ptBundles[0]] }), /PT_BUNDLE_DUPLICATE/);
  assert.throws(() => validateTables({ ...t, ptAssign: [{ uid: "x", bundle: "NPT_M1_NOPE" }] }), /PT_ASSIGN_BUNDLE_UNKNOWN/);
  assert.throws(() => validateTables({ ...t, tplBundles: [{ ...t.tplBundles[0], definition: " " }] }), /BUNDLE_NAME_OR_DEFINITION_MISSING/);
});

test("NEW_KEY lines become PICK lines of the generated key; folded bundles use the existing key; no-bundle lines are skipped with a reason", () => {
  const { requests, skipped, nk } = plan();
  assert.equal(requests.length, 1);
  const items = new Map(requests[0].items.map(i => [i.questionUid, i]));
  assert.deepEqual(items.get("uid1").after, { problemTypeKey: "PT_M1_NEW_THING" });
  assert.deepEqual(items.get("uid2").after, { problemTypeKey: "PT_A" });
  assert.deepEqual(items.get("uid4").after, { problemTypeKey: "PT_A", templateKey: "TPL_M1_NEW_STEP" });
  assert.deepEqual(items.get("uid5").after, { problemTypeKey: "PT_A", templateKey: "TPL_A" });
  assert.equal(skipped.find(s => s.uid === "uid3").reason, "NEW_KEY_NO_BUNDLE");
  assert.equal(skipped.find(s => s.uid === "uid6").reason, "TYPE_ALREADY_PRESENT");
  // the ledger keeps the original decision of a converted line
  const ledger = JSON.parse([...plan().files].find(([k]) => k.endsWith(".type-ledger.json"))[1]);
  assert.equal(ledger.rows.find(r => r.questionUid === "uid1").decision, "NEW_KEY");
  assert.equal(ledger.rows.find(r => r.questionUid === "uid4").decision, "PICK");
  assert.equal(nk.stats.ptBundles.create, 2);
});

test("registryChanges are add-only taxonomy/binding rows on the carrier request, only for keys that a planned question uses", () => {
  const { requests } = plan();
  const carrier = requests[0];
  assert.ok(carrier.requestId.startsWith("tc-"));
  const changes = carrier.registryChanges;
  const kinds = changes.map(c => c.collection);
  assert.deepEqual(kinds, ["problemTypes", "templates", "bindings"]); // NPT_M1_UNUSED is not emitted: its only line was skipped
  for (const c of changes) {
    assert.equal(c.before, null);
    assert.equal(c.after.status, "ACTIVE");
    assert.deepEqual(c.evidenceRefs, [carrier.approval.evidenceRefs[0]]);
    assert.match(c.path, /^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9-]+\/(taxonomy|bindings)\.json$/);
  }
  const [pt, tpl, binding] = changes.map(c => c.after);
  assert.equal(pt.problemTypeKey, "PT_M1_NEW_THING");
  assert.equal(pt.canonicalLabelKo, "새 개념");
  assert.equal(pt.definition, "새 개념을 묻는 문항");
  assert.equal(pt.ownerPack, "P1");
  assert.deepEqual(pt.supportingQuestionUids, ["uid1"]);
  assert.equal(pt.supportingItemCount, 1);
  assert.deepEqual(pt.evidenceProvenance[0].bundle, "NPT_M1_NEW_THING");
  assert.equal(tpl.templateKey, "TPL_M1_NEW_STEP");
  assert.equal(tpl.parentProblemTypeKey, "PT_A");
  assert.equal(tpl.ownerPack, "P1");
  assert.equal(binding.problemTypeKey, "PT_M1_NEW_THING");
  assert.equal(binding.curriculum, "2015");
  assert.equal(binding.standardCourse, "중1 수학");
  assert.equal(binding.standardUnitKey, "M1-01");
  assert.equal(binding.subUnitKey, "M1-01-A");
  assert.equal(binding.ownerPack, "P1");
});

test("same inputs give byte-identical files and the same keys", () => {
  const a = plan(), b = plan();
  assert.deepEqual([...a.files], [...b.files]);
});

test("a question of another course than its bundle is not bound to the bundle's new key", () => {
  const recs = records().map(r => r.sourceOrdinal === 1 ? { ...r, standardCourse: "중2 수학" } : r);
  const { skipped } = plan({ records: recs });
  assert.equal(skipped.find(s => s.uid === "uid1").reason, "NEW_KEY_ROW_COURSE_DIFFERS_FROM_BUNDLE");
});

test("a question without a valid unit borrows the unit pair of the bundle's other questions of the same course", () => {
  const recs = records().map(r => r.sourceOrdinal === 1 ? { ...r, standardUnitKey: "", subUnitKey: "" } : r);
  const t = tables();
  t.ptAssign.push({ uid: "uid2", bundle: "NPT_M1_NEW_THING" }); // a second line of the same bundle carries a valid pair
  const { requests, skipped } = plan({ records: recs, tables: t });
  const binding = requests[0].registryChanges.find(c => c.collection === "bindings").after;
  assert.equal(binding.standardUnitKey, "M1-01");
  assert.ok(!skipped.some(s => s.reason === "NEW_KEY_NO_VALID_UNIT_FOR_BINDING"));
  assert.deepEqual(requests[0].items.find(i => i.questionUid === "uid1").after, { problemTypeKey: "PT_M1_NEW_THING" });
});

test("a unit-only pair is folded into the sub-unit pair of the same unit (a registry match must be unambiguous)", () => {
  const recs = records().map(r => r.sourceOrdinal === 2 ? { ...r, subUnitKey: "M1-01-NOT-IN-MASTER" } : r);
  const t = tables();
  t.ptAssign = t.ptAssign.map(a => a.uid === "uid2" ? { uid: "uid2", bundle: "NPT_M1_NEW_THING" } : a);
  const { requests } = plan({ records: recs, tables: t });
  const bindings = requests[0].registryChanges.filter(c => c.collection === "bindings").map(c => c.after);
  assert.equal(bindings.length, 1);
  assert.equal(bindings[0].subUnitKey, "M1-01-A");
  assert.equal(bindings[0].supportingItemCount, 2);
});

test("--bundles-only keeps only the lines the bundle tables touch; without it every other line stays", () => {
  const extra = [...lines(), line(7, { decision: "PICK", pt: "PT_A", tpl: "TPL_A" })];
  const withOnly = plan({ lines: extra, opts: { bundlesOnly: true } });
  assert.equal(withOnly.nk.stats.lines.outsideBundles, 1);
  assert.ok(!withOnly.skipped.some(s => s.uid === "uid7"));
  const without = plan({ lines: extra });
  assert.equal(without.nk.stats.lines.outsideBundles, 0);
});

// ---- --replace-draft-types: draft values are replaced in their own "tr-" requests, approved/adjudicated values stay
const replaceRecords = () => [
  row(1), // blank
  row(2, { problemTypeKey: "PT_B", templateKey: "TPL_B", fieldStatus: { problemType: "manual_review_pending", template: "manual_review_pending" } }), // draft, differs
  row(3, { problemTypeKey: "PT_A", templateKey: "TPL_A", fieldStatus: { problemType: "manual_review_pending", template: "manual_review_pending" } }), // draft, same as judged
  row(4, { problemTypeKey: "PT_B", templateKey: "TPL_B", fieldStatus: { problemType: "approved_review2", template: "approved_review2" } }), // approved, differs
  row(5, { problemTypeKey: "PT_B", templateKey: "TPL_B", fieldStatus: { problemType: "r2e_adjudicated", template: "r2e_adjudicated" } }), // adjudicated, differs
  row(6, { problemTypeKey: "PT_B", templateKey: "", fieldStatus: { problemType: "", template: "" } }) // blank status with a value, differs
];
const replaceLines = () => [1, 2, 3, 4, 5, 6].map(n => line(n, { decision: "PICK", pt: "PT_A", tpl: "TPL_A" }));
const replaceCtx = () => { const c = makeCtx(replaceRecords()); c.registry.pt.set("PT_B", { problemTypeKey: "PT_B", status: "ACTIVE", ownerPack: "P1" }); return c; };

test("replace mode: a draft value that differs from the judgment is replaced in a separate tr- request; default mode leaves it", () => {
  const off = planRequests({ ctx: replaceCtx(), resultRows: replaceLines(), approvedBy: "x" });
  assert.deepEqual(off.requests.flatMap(r => r.items.map(i => i.questionUid)), ["uid1"]);
  const on = planRequests({ ctx: replaceCtx(), resultRows: replaceLines(), approvedBy: "x", replaceDraft: true });
  assert.equal(on.requests.length, 2);
  const fill = on.requests.find(r => r.requestId.startsWith("td-")), repl = on.requests.find(r => r.requestId.startsWith("tr-"));
  assert.deepEqual(fill.items.map(i => i.questionUid), ["uid1"]);
  assert.deepEqual(repl.items.map(i => i.questionUid), ["uid2", "uid6"]);
  assert.deepEqual(repl.items[0].before, { problemTypeKey: "PT_B", templateKey: "TPL_B" });
  assert.deepEqual(repl.items[0].after, { problemTypeKey: "PT_A", templateKey: "TPL_A" });
  assert.deepEqual(repl.items[1].before, { problemTypeKey: "PT_B", templateKey: "" });
  assert.ok([fill.requestId, repl.requestId].sort()[0] === fill.requestId, "replacements sort after the blank-field requests");
  for (const r of on.requests) for (const i of r.items) assert.ok(!("level" in i) && i.textBindingFingerprint);
});

test("replace mode: approved and adjudicated values stay and are listed with their existing and judged values; equal values need nothing", () => {
  const { skipped } = planRequests({ ctx: replaceCtx(), resultRows: replaceLines(), approvedBy: "x", replaceDraft: true });
  const by = Object.fromEntries(skipped.map(s => [s.uid, s]));
  assert.equal(by.uid3.reason, "TYPE_ALREADY_PRESENT");
  for (const uid of ["uid4", "uid5"]) assert.equal(by[uid].reason, "TYPE_KEPT_DIFFERS_FROM_JUDGMENT");
  assert.deepEqual(by.uid4.existing, { pt: "PT_B", tpl: "TPL_B", ptStatus: "approved_review2", tplStatus: "approved_review2", approval: "", revision: "archive-registration-sync-v1" });
  assert.deepEqual(by.uid4.judged, { pt: "PT_A", tpl: "TPL_A" });
  assert.equal(by.uid5.existing.ptStatus, "r2e_adjudicated");
});

test("--owner-pack: a bundle of a course that no pack has bindings on is skipped; with a named existing pack it is placed there (the pack only gets the new values appended)", () => {
  const master2 = new Map([...master, ["M2-01", { key: "M2-01", keyType: "standardUnitKey", status: "active" }], ["M2-01-A", { key: "M2-01-A", keyType: "subUnitKey", status: "active", standardUnitKey: "M2-01", labelKo: "소단원" }]]);
  const recs = records().map(r => r.sourceOrdinal === 1 ? row(1, { standardCourse: "중2 수학", curriculum: "2015", standardUnitKey: "M2-01", subUnitKey: "M2-01-A" }) : r);
  const tbl = () => ({ origin: { branch: "data/type-bundles", commit: "b".repeat(40), dir: "docs/plans/x/type-bundles" },
    ptBundles: [{ bundle: "NPT_M2_NEW_THING", nameKo: "새 개념", definition: "새 개념을 묻는 문항", course: "middle2", absorbInto: null }],
    ptAssign: [{ uid: "uid1", bundle: "NPT_M2_NEW_THING" }], tplBundles: [], tplAssign: [] });
  const run = opts => {
    const ctx = makeCtx(recs);
    ctx.registry.packs.set("P2", { curricula: ["2015"], standardCourses: ["중1 수학"], packId: "P2" });
    ctx.registry.packFiles = new Map([["P1", "archive/data/meta-foundation/canonical/packs/p1/pack.json"], ["P2", "archive/data/meta-foundation/canonical/packs/p2/pack.json"]]);
    const nk = prepareNewKeys({ ctx, tables: tbl(), resultRows: [line(1)], env: { curriculumGuess, pathGrade }, opts: { master: master2, groups, ...opts } });
    return planRequests({ ctx: { ...nk.ctx, newKeys: { finalize: nk.finalize } }, resultRows: nk.rows, approvedBy: "테스트 결정", allowPackAdditions: true });
  };
  assert.equal(run({}).skipped.find(s => s.uid === "uid1").reason, "NEW_KEY_OWNER_PACK_UNRESOLVED");
  const { requests, skipped } = run({ ownerPackByBundle: new Map([["NPT_M2_NEW_THING", "P2"]]) });
  assert.equal(requests.length, 1, JSON.stringify(skipped));
  const changes = requests[0].registryChanges;
  assert.equal(changes.find(c => c.collection === "problemTypes").after.ownerPack, "P2");
  assert.ok(changes.some(c => /packs\/p2\/pack\.json$/.test(c.path) && c.after.standardCourses.includes("중2 수학") && c.after.standardCourses.includes("중1 수학")), "the pack file only gains the new course value");
  assert.equal(run({ ownerPackByBundle: new Map([["NPT_M2_NEW_THING", "NO_SUCH_PACK"]]) }).skipped.find(s => s.uid === "uid1").reason, "NEW_KEY_OWNER_PACK_UNRESOLVED", "an unknown pack name is not used");
});
