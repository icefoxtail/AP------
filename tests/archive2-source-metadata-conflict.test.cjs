const { test } = require("node:test");
const assert = require("node:assert/strict");
const source = require("../archive/archive2-source.js");

// restore() must treat a source/catalog metadata difference as a conflict only when
// the catalog record asserts a non-empty value. Empty/undefined catalog fields
// (fallback/unverified taxonomy) keep the source value and must not throw.
const FILE = "synthetic/metadata_conflict_fixture.js";
const BANK_JS =
  "window.questionBank = [{ content: 'Q1', choices: ['1','2'], answer: '1', solution: 's', image: null, curriculumKey: '2015', courseKey: 'math1' }];";

async function restoreWith(recordOverrides) {
  const question = source.evaluate(BANK_JS, FILE)[0];
  const record = {
    sourceFile: FILE,
    sourceOrdinal: 1,
    sourceFingerprint: await source.fingerprint(question),
    questionUid: "qid_v1_" + (await source.digest(FILE + "#1")),
    sourceQuestionNo: 1,
    year: "2022",
    school: "테스트고",
    ...recordOverrides,
  };
  const catalog = { sourceHashes: [[FILE, await source.digest(BANK_JS)]] };
  const fetcher = async () => ({ ok: true, status: 200, text: async () => BANK_JS });
  return source.restore([record], catalog, { baseUrl: "http://127.0.0.1/", fetcher });
}

for (const [label, value] of [["empty string", ""], ["undefined", undefined], ["null", null], ["blank", "  "]]) {
  test("empty catalog curriculumKey (" + label + ") restores and keeps the source value", async () => {
    const overrides = { courseKey: "math1" };
    if (value !== undefined) overrides.curriculumKey = value;
    const [restored] = await restoreWith(overrides);
    assert.equal(restored.curriculumKey, "2015");
    assert.equal(restored.courseKey, "math1");
  });
}

test("catalog curriculumKey equal to the source restores", async () => {
  const [restored] = await restoreWith({ curriculumKey: "2015", courseKey: "math1" });
  assert.equal(restored.curriculumKey, "2015");
});

test("catalog asserting a different non-empty curriculumKey still conflicts", async () => {
  await assert.rejects(
    () => restoreWith({ curriculumKey: "2022", courseKey: "math1" }),
    /source metadata 충돌: curriculumKey/,
  );
});

test("catalog asserting a different non-empty courseKey still conflicts", async () => {
  await assert.rejects(
    () => restoreWith({ curriculumKey: "2015", courseKey: "algebra" }),
    /source metadata 충돌: courseKey/,
  );
});

const REV_BANK_JS =
  "window.questionBank = [{ content: 'Q1', choices: ['1','2'], answer: '1', solution: 's', image: null, metaFoundationPackVersion: '1.0.0', metadataRevision: 'meta-foundation:H1_FOUNDATION@1.0.0' }];";

async function restoreRevision(recordOverrides) {
  const question = source.evaluate(REV_BANK_JS, FILE)[0];
  const record = {
    sourceFile: FILE,
    sourceOrdinal: 1,
    sourceFingerprint: await source.fingerprint(question),
    questionUid: "qid_v1_" + (await source.digest(FILE + "#1")),
    sourceQuestionNo: 1,
    ...recordOverrides,
  };
  const catalog = { sourceHashes: [[FILE, await source.digest(REV_BANK_JS)]] };
  const fetcher = async () => ({ ok: true, status: 200, text: async () => REV_BANK_JS });
  return source.restore([record], catalog, { baseUrl: "http://127.0.0.1/", fetcher });
}

test("newer catalog re-certification supersedes the stale source metaFoundationPackVersion", async () => {
  const [restored] = await restoreRevision({
    metaFoundationPackVersion: "1.0.3",
    metadataRevision: "meta-foundation:H1_FOUNDATION@1.0.3:exam-meta_pipeline_audit-v2:test",
  });
  assert.equal(restored.metaFoundationPackVersion, "1.0.3");
});

test("metaFoundationPackVersion difference without a differing catalog metadataRevision still conflicts", async () => {
  await assert.rejects(
    () => restoreRevision({
      metaFoundationPackVersion: "1.0.3",
      metadataRevision: "meta-foundation:H1_FOUNDATION@1.0.0",
    }),
    /source metadata 충돌: metaFoundationPackVersion/,
  );
});
