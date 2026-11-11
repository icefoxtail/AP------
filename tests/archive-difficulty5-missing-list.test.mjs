import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listMissingDifficulty5, summarize } from "../archive/tools/meta-foundation/list-missing-difficulty5.mjs";

// The work list for difficulty rating: only files that still lack a 1~5 number, never a file that is already rated.
const rec = (file, ordinal, bucket) => ({ sourceArchiveFile: file, sourceOrdinal: ordinal, difficultyBucket: bucket });

test("a fully rated file is not listed; unrated and partly rated files are, with what is missing", () => {
  const rows = listMissingDifficulty5([
    rec("original/high/h1/1mid/25_done.js", 1, 2), rec("original/high/h1/1mid/25_done.js", 2, 5),
    rec("original/middle/m2/1mid/24_none.js", 1, "하"), rec("original/middle/m2/1mid/24_none.js", 2, undefined),
    rec("original/high/h2/1mid/26_part.js", 1, 3), rec("original/high/h2/1mid/26_part.js", 3, "UNKNOWN"),
    rec("original/high/h2/1mid/26_part.js", 2, null),
  ]);
  assert.deepEqual(rows.map(r => r.sourceArchiveFile), ["original/high/h2/1mid/26_part.js", "original/middle/m2/1mid/24_none.js"]);
  assert.deepEqual(rows[0], { sourceArchiveFile: "original/high/h2/1mid/26_part.js", kind: "original", total: 3, missing: 2, missingOrdinals: [2, 3] });
  assert.deepEqual(rows[1], { sourceArchiveFile: "original/middle/m2/1mid/24_none.js", kind: "original", total: 2, missing: 2 });
});

test("missing means exactly what the registrar would still apply: anything but an integer 1..5", () => {
  const values = [0, 6, 2.5, "3", "중", "UNKNOWN", null, undefined];
  const rows = listMissingDifficulty5(values.map((v, i) => rec("original/x/26_a.js", i + 1, v)));
  assert.equal(rows[0].missing, values.length);
  assert.deepEqual(listMissingDifficulty5([1, 2, 3, 4, 5].map((v, i) => rec("original/x/26_b.js", i + 1, v))), []);
});

test("school exams come first (newest year first), then types, textbooks, similar; test fixtures are left out", () => {
  const rows = listMissingDifficulty5([
    rec("similar/a/25_s.js", 1, null), rec("textbooks/a/t.js", 1, null), rec("types/a/y.js", 1, null),
    rec("original/a/19_old.js", 1, null), rec("original/a/26_new.js", 1, null), rec("test-fixtures/a/f.js", 1, null),
  ]);
  assert.deepEqual(rows.map(r => r.sourceArchiveFile),
    ["original/a/26_new.js", "original/a/19_old.js", "types/a/y.js", "textbooks/a/t.js", "similar/a/25_s.js"]);
  assert.deepEqual(summarize(rows), { files: 5, questions: 5, byKind: {
    original: { files: 2, questions: 2 }, types: { files: 1, questions: 1 },
    textbooks: { files: 1, questions: 1 }, similar: { files: 1, questions: 1 } } });
});

test("on the real metadata every listed file exists and nothing listed is already fully rated", () => {
  const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const records = JSON.parse(fs.readFileSync(path.join(repo, "archive/data/question_metadata.json"), "utf8")).records;
  const rows = listMissingDifficulty5(records);
  const rated = new Map();
  for (const r of records) {
    const o = rated.get(r.sourceArchiveFile) || { total: 0, done: 0 };
    o.total++; if (Number.isInteger(r.difficultyBucket) && r.difficultyBucket >= 1 && r.difficultyBucket <= 5) o.done++;
    rated.set(r.sourceArchiveFile, o);
  }
  assert.equal(new Set(rows.map(r => r.sourceArchiveFile)).size, rows.length, "no file is listed twice");
  for (const row of rows) {
    const o = rated.get(row.sourceArchiveFile);
    assert.ok(o.done < o.total, row.sourceArchiveFile + " is listed although it is fully rated");
    assert.equal(row.missing, o.total - o.done, row.sourceArchiveFile);
    assert.ok(fs.existsSync(path.join(repo, "archive/exams", row.sourceArchiveFile)), "listed file is missing on disk: " + row.sourceArchiveFile);
  }
});
