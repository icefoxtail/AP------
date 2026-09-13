import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rebuildApprovedIndex } from "./register-approved-exam.mjs";

function arg(name) {
  const index = process.argv.indexOf(name);
  if (index < 0 || !process.argv[index + 1]) throw new Error(name + " is required");
  return process.argv[index + 1];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = process.cwd();
    const result = rebuildApprovedIndex({
      root,
      examId: arg("--exam-id"),
      targetFile: arg("--target-file"),
      dbEntry: JSON.parse(fs.readFileSync(path.resolve(arg("--db-entry")), "utf8")),
      indexPath: arg("--index-path"),
      expectedIndexSha256: arg("--expected-index-sha256"),
      registration: JSON.parse(fs.readFileSync(path.resolve(arg("--registration-result")), "utf8")),
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(String(error.message || error));
    process.exitCode = 1;
  }
}
