const test = require("node:test");
const assert = require("node:assert/strict");
const O = require("../archive/archive2-output.js");
const P = require("../archive/archive2-papers.js");
test("display title and QR policy preserve identity input", () => {
  const exam = {
    file: "25_매산고_1학기_중간_고1_기출.js",
    year: 2025,
    school: "매산고",
    grade: "고1",
    semester: 1,
    examType: "mid",
  };
  assert.equal(O.displayTitle(exam), "2025 매산고 고1 1학기 중간고사");
  assert.equal(exam.file, "25_매산고_1학기_중간_고1_기출.js");
  const off = O.applyUrl(
    new URL("https://example.test/archive/engine.html"),
    {},
  );
  assert.equal(off.searchParams.get("solQr"), "0");
  assert.equal(off.searchParams.get("submitQr"), "0");
  const on = O.applyUrl(new URL(off), { includeQr: true });
  assert.equal(on.searchParams.get("solQr"), "1");
  assert.equal(on.searchParams.get("portalQr"), "1");
});
test("split receipt freezes exactly one paper until remaining paper succeeds", () => {
  const first = Array.from({ length: 80 }, (_, i) => ({
      questionUid: "uid-" + i,
    })),
    changed = first.map((q, i) => ({ questionUid: "new-" + i }));
  const receipts = [
    {
      partIndex: 0,
      key: "paper-a",
      questionUids: first.slice(0, 50).map((q) => q.questionUid),
      ready: false,
    },
  ];
  assert.deepEqual(P.status(80, receipts), {
    total: 2,
    saved: 1,
    pending: 1,
    complete: false,
    pdfPending: 1,
  });
  const recovered = P.preserve(first, changed, receipts);
  assert.deepEqual(recovered.slice(0, 50), first.slice(0, 50));
  assert.deepEqual(recovered.slice(50), changed.slice(50));
  receipts.push({
    partIndex: 1,
    key: "paper-b2",
    questionUids: recovered.slice(50).map((q) => q.questionUid),
    ready: true,
  });
  assert.equal(P.status(80, receipts).complete, true);
  assert.equal(P.lockedUids(receipts).size, 80);
});
