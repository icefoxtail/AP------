import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { buildManifestFromInventoryItem } from "../archive/tools/past-exam-pipeline/lib/exam-id.mjs";
import { makeCandidateJs, makeQuestionSkeleton } from "../archive/tools/past-exam-pipeline/lib/js-candidate.mjs";

test("V2 candidate skeleton carries the current subunit contract", () => {
  const question = makeQuestionSkeleton(1, { examId: "26_금당고_1학기_기말_고1_기출", course: "공통수학1" });

  assert.deepEqual(
    Object.keys(question).filter((key) => key.startsWith("subUnit")),
    ["subUnitKey", "subUnit", "subUnitConfidence", "subUnitClassificationDepth"]
  );
  assert.equal(question.answer, "");
  assert.equal(question.solution, "");
  assert.equal(question.answerStatus, "external_agent_required");
  assert.equal(question.solutionStatus, "external_agent_required");
  assert.match(makeCandidateJs({ examId: "26_금당고_1학기_기말_고1_기출", expectedQuestionCount: 1 }), /subUnitClassificationDepth/);
});

test("inventory manifests resolve to the canonical original archive path", () => {
  const manifest = buildManifestFromInventoryItem(
    {
      examId: "26_금당고_1학기_기말_고1_기출",
      grade: "고1",
      semester: "1",
      examType: "final",
      course: "공통수학1",
      schoolName: "순천금당고등학교",
      pdfPath: "D:/source/exam.pdf",
    },
    { generatedRoot: "C:/generated", candidateFileSuffix: ".candidate", defaultQuestionCount: 20 },
  );

  assert.equal(manifest.archiveRelativePath, "original/high/h1/1final/26_금당고_1학기_기말_고1_기출.js");
  assert.equal(manifest.subject, "공통수학1");
  assert.equal(manifest.contentType, "기출");
  assert.equal(manifest.outputFileName, "26_금당고_1학기_기말_고1_기출.candidate.js");
});

test("promotion contract includes subunit and solution-asset gates", () => {
  const source = fs.readFileSync("archive/tools/past-exam-pipeline/promote-reviewed-exam.mjs", "utf8");

  for (const field of ["subUnitKey", "subUnit", "subUnitConfidence", "subUnitClassificationDepth"]) {
    assert.match(source, new RegExp(field));
  }
  assert.match(source, /canonicalizeAsset\(question, "solutionImage"\)/);
  assert.match(source, /review\.status !== "reviewed_pass"/);
});
