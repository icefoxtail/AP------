"use strict";
// Guards the layoutTag-only source edition of the issued M2 geometry approval observer
// (24_연향중 2학기 중간). The edition adds no approval; its only allowed difference from
// the 2372 edition is the per-question layoutTag string value. Rejections must carry the
// specific LAYOUT_TAG_ONLY reason, not just any assertion failure.
const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { assertLayoutTagOnlyEdition, SOURCE_EDITION_2372, SOURCE_EDITION_LAYOUT_TAG } =
  require("./helpers/middle-geometry-issued-approval.cjs");

const root = path.resolve(__dirname, "..");
const SOURCE = "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js";
const pinsOf = bytes => ({
  gitBlobSha1: crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex"),
  sha256: crypto.createHash("sha256").update(bytes).digest("hex"), bytes: bytes.length
});
const gitBlob = sha => execFileSync("git", ["cat-file", "blob", sha], { cwd: root, maxBuffer: 16 * 1024 * 1024 });
const baseBytes = gitBlob(SOURCE_EDITION_2372.pins.gitBlobSha1);
const liveBytes = fs.readFileSync(path.join(root, SOURCE));

// Re-serialises the bank of the live file (2-space JSON, verified identical below) after a mutation.
const text = liveBytes.toString("utf8");
const start = text.indexOf("[", text.indexOf("window.questionBank")), end = text.lastIndexOf("]") + 1;
const liveBank = JSON.parse(text.slice(start, end));
const prefix = text.slice(0, start), suffix = text.slice(end);
function variant(mutate, indent = 2, edges = {}) {
  const bank = JSON.parse(JSON.stringify(liveBank));
  mutate(bank);
  return Buffer.from((edges.prefix ?? prefix) + JSON.stringify(bank, null, indent) + (edges.suffix ?? suffix), "utf8");
}
const reason = message => ({ name: "AssertionError", message });

let passed = 0;
function test(name, fn) { fn(); passed++; console.log("PASS " + name); }

test("fixture: re-serialising the live bank reproduces the file byte for byte", () => {
  assert.ok(variant(() => {}).equals(liveBytes));
});

test("edition pins: 2372 edition unchanged and live file is the layoutTag edition", () => {
  assert.deepStrictEqual(SOURCE_EDITION_2372.pins, {
    bytes: 66857, sha256: "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
    gitBlobSha1: "35d1f2446122393d7bff665d131d9bb3d01d404f" });
  assert.strictEqual(SOURCE_EDITION_2372.commit, "5a20d765998a2101899572ba84a359fef751ecfb");
  assert.deepStrictEqual(pinsOf(baseBytes), SOURCE_EDITION_2372.pins);
  assert.strictEqual(SOURCE_EDITION_LAYOUT_TAG.layoutTagOnly.base, SOURCE_EDITION_2372);
  assert.deepStrictEqual(pinsOf(liveBytes), SOURCE_EDITION_LAYOUT_TAG.pins);
});

test("accepts the real current file: only layoutTag differs from the 2372 edition", () => {
  const changes = assertLayoutTagOnlyEdition(baseBytes, liveBytes);
  assert.strictEqual(changes.length, 21);
  assert.deepStrictEqual(changes, SOURCE_EDITION_LAYOUT_TAG.layoutTagOnly.changes);
  assert.ok(changes.every(row => row.fields.length === 1 && row.fields[0] === "layoutTag"));
  assert.deepStrictEqual(assertLayoutTagOnlyEdition(baseBytes, baseBytes), []);
});

test("accepts any layoutTag string value change (and nothing else)", () => {
  const bytes = variant(bank => { bank[10].layoutTag = "fullwidth"; });
  assert.deepStrictEqual(assertLayoutTagOnlyEdition(liveBytes, bytes), [{ sourceOrdinal: 11, fields: ["layoutTag"] }]);
});

test("rejects a one-character content change", () => {
  const bytes = variant(bank => { bank[2].content = bank[2].content.slice(0, -1) + (bank[2].content.endsWith("x") ? "y" : "x"); });
  assert.notDeepStrictEqual(pinsOf(bytes), SOURCE_EDITION_LAYOUT_TAG.pins);
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes, bytes), reason("LAYOUT_TAG_ONLY:QUESTION_VALUE:3:content"));
});

test("rejects an answer change", () => {
  const bytes = variant(bank => { bank[2].answer = String(bank[2].answer) + "0"; });
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes, bytes), reason("LAYOUT_TAG_ONLY:QUESTION_VALUE:3:answer"));
});

test("rejects solution, choices and image changes", () => {
  for (const [key, value] of [["solution", "x"], ["choices", ["a"]], ["image", "assets/images/other.png"]])
    assert.throws(() => assertLayoutTagOnlyEdition(baseBytes, variant(bank => { bank[0][key] = value; })),
      reason("LAYOUT_TAG_ONLY:QUESTION_VALUE:1:" + key));
});

test("rejects an added question", () => {
  const bytes = variant(bank => { bank.push(JSON.parse(JSON.stringify(bank[bank.length - 1]))); });
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes, bytes), reason("LAYOUT_TAG_ONLY:QUESTION_COUNT"));
});

test("rejects a removed question", () => {
  const bytes = variant(bank => { bank.pop(); });
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes, bytes), reason("LAYOUT_TAG_ONLY:QUESTION_COUNT"));
});

test("rejects reordered questions", () => {
  const bytes = variant(bank => { [bank[2], bank[3]] = [bank[3], bank[2]]; });
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes, bytes), reason("LAYOUT_TAG_ONLY:QUESTION_VALUE:3:id"));
});

test("rejects an added, removed or renamed non-layoutTag key", () => {
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes, variant(bank => { bank[2].extraKey = 1; })),
    reason("LAYOUT_TAG_ONLY:QUESTION_KEYS:3"));
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes, variant(bank => { delete bank[2].answer; })),
    reason("LAYOUT_TAG_ONLY:QUESTION_KEYS:3"));
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes, variant(bank => {
    bank[2].level2 = bank[2].level; delete bank[2].level; })), reason("LAYOUT_TAG_ONLY:QUESTION_KEYS:3"));
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes, variant(bank => { delete bank[2].layoutTag; })),
    reason("LAYOUT_TAG_ONLY:QUESTION_KEYS:3"));
});

test("rejects a changed non-layoutTag value even next to a layoutTag change", () => {
  const bytes = variant(bank => { bank[4].layoutTag = "fullwidth"; bank[4].level = "상"; });
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes, bytes), reason("LAYOUT_TAG_ONLY:QUESTION_VALUE:5:level"));
});

test("rejects a non-string layoutTag", () => {
  for (const value of [null, 5, true, ["grid"], { value: "grid" }])
    assert.throws(() => assertLayoutTagOnlyEdition(baseBytes, variant(bank => { bank[2].layoutTag = value; })),
      reason("LAYOUT_TAG_ONLY:LAYOUT_TAG_TYPE:3"));
});

test("rejects changed text outside the bank", () => {
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes,
    variant(() => {}, 2, { prefix: prefix.replace("24_연향중", "24_연향고") })), reason("LAYOUT_TAG_ONLY:TEXT_OUTSIDE_BANK"));
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes,
    variant(() => {}, 2, { suffix: suffix + "window.extra = 1;\n" })), reason("LAYOUT_TAG_ONLY:TEXT_OUTSIDE_BANK"));
});

test("rejects reformatting inside the bank", () => {
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes, variant(() => {}, 4)), reason("LAYOUT_TAG_ONLY:TEXT_FORMAT"));
});

test("rejects a source that is not a single JSON bank", () => {
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes, Buffer.from(text + "window.questionBank = [];\n")),
    reason("LAYOUT_TAG_ONLY:BANK_ASSIGNMENT:next"));
  assert.throws(() => assertLayoutTagOnlyEdition(baseBytes,
    Buffer.from(text.replace('"layoutTag": "grid"', "layoutTag: 'grid'"))), reason("LAYOUT_TAG_ONLY:BANK_JSON:next"));
});

console.log("middle-geometry layoutTag edition: " + passed + " tests passed");
