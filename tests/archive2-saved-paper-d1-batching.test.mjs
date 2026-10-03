import assert from "node:assert/strict";
import test from "node:test";
import { blueprintInsertStatements } from "../apmath/worker-backup/worker/helpers/archive2-questions.js";

test("guarded Saved Paper blueprint batches stay below D1 bind limit at 1/5/6/10/50 questions", async () => {
  const statements = [];
  const env = {
    DB: {
      prepare(sql) {
        return {
          bind(...params) {
            const statement = { sql, params };
            statements.push(statement);
            return statement;
          },
        };
      },
    },
  };
  const metadataAuthority = {
    buildArchiveQuestionMetadata: () => ({
      standardUnitKey: "H22-C-01",
      standardUnit: "다항식의 연산",
      standardCourse: "공통수학1",
      conceptClusterKey: "",
      subUnitKey: "H22-C-01-CORE",
      typeKey: "",
      templateKey: "",
      difficulty: "MEDIUM",
      metadataRevision: "fixture-v1",
    }),
    buildArchiveMetadataHash: async () => "a".repeat(64),
  };

  for (const count of [1, 5, 6, 10, 50]) {
    statements.length = 0;
    const rows = Array.from({ length: count }, (_, index) => ({
      sourceArchiveFile: "original/high/h2/1mid/fixture.js",
      sourceQuestionNo: index + 1,
      questionUid: `qid_v1_${String(index + 1).padStart(64, "0")}`,
      sourceOrdinal: index + 1,
    }));
    const result = await blueprintInsertStatements(
      env,
      "MIXED:fixture-saved-paper",
      rows,
      metadataAuthority,
      { assignmentGuard: { writeKey: "fixture-write-key" } },
    );

    assert.equal(result.length, Math.ceil(count / 5));
    assert.ok(statements.every((statement) => statement.params.length <= 100));
    assert.equal(
      statements.reduce((sum, statement) => sum + statement.params.length / 17, 0),
      count,
      `${count}-question assignment retains one guarded blueprint insert per question`,
    );
  }
});
