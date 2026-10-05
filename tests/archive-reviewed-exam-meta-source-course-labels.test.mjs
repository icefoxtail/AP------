import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("reviewed exam Meta registration resolves the existing Common Math 1 H22-C-05 scope", () => {
  const sourceArchiveFile = "original/high/h1/2mid/26_매산고_2학기_중간_고1_기출.js";
  const sourcePath = path.join(root, "archive", "exams", sourceArchiveFile);
  const bytes = fs.readFileSync(sourcePath);
  const expectedSourceBlobSha1 = crypto
    .createHash("sha1")
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest("hex");
  const requestPath = path.join(
    root,
    ".archive-meta-register",
    "inbox",
    `course-labels-test-${process.pid}.json`,
  );
  const request = {
    schemaVersion: "archive-reviewed-exam-meta-register-request-v1",
    sourceArchiveFile,
    expectedQuestionCount: 21,
    expectedSourceBlobSha1,
    metadataReviewed: true,
    reviewPassCount: 2,
    reviewBranch: "work/line3/26-maesan-h1-2mid-r1-targeted-repair2-20261001",
    reviewCommit: "3422afc51340cbad7568ceae0244effba4078dc4",
    evidencePath:
      "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/h1-26-maesan-2mid-course-label-test.json",
    crosswalkPath: "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json",
  };

  fs.mkdirSync(path.dirname(requestPath), { recursive: true });
  fs.writeFileSync(requestPath, `${JSON.stringify(request, null, 2)}\n`, "utf8");
  try {
    const result = spawnSync(
      process.execPath,
      [
        "archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs",
        "--request",
        path.relative(root, requestPath),
      ],
      { cwd: root, encoding: "utf8" },
    );

    assert.equal(result.status, 0, result.stderr || result.stdout);
    const output = JSON.parse(result.stdout);
    assert.equal(output.status, "PASS");
    assert.equal(output.totalQuestions, 21);
  } finally {
    fs.rmSync(requestPath, { force: true });
  }
});
