import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import legacy from "../unit-past-exams-core.js";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const sourceFile = "archive/unit-past-exams-core.js";
const source = fs
  .readFileSync(path.join(root, sourceFile), "utf8")
  .replace(/\r\n/g, "\n");
const records = ["h1", "h2"].flatMap((profileId) =>
  Object.entries(legacy.getProfile(profileId).directKeyMap).map(
    ([fromLegacyUnitKey, toLegacyUnitKey]) => ({
      profileId,
      fromLegacyUnitKey,
      toLegacyUnitKey,
      reviewStatus: "UNREVIEWED",
      automaticMixingAllowed: false,
      note: "기존 runtime 연결 근거. canonical L1/L2 동일성 또는 교육과정 EXACT 승인을 뜻하지 않음.",
    }),
  ),
);
const data = {
  schemaVersion: "archive2-legacy-crosswalk-inventory-v1",
  sourceFile,
  sourceDigest: crypto.createHash("sha256").update(source).digest("hex"),
  total: records.length,
  reviewedExact: 0,
  records,
};
const serialized = JSON.stringify(data, null, 2) + "\n",
  target = path.join(root, "archive/data/archive2-crosswalk-inventory.json");
if (process.argv.includes("--check")) {
  if (fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n") !== serialized)
    throw new Error("crosswalk inventory is stale");
} else fs.writeFileSync(target, serialized);
console.log(
  JSON.stringify({
    total: data.total,
    reviewedExact: data.reviewedExact,
    sourceDigest: data.sourceDigest,
  }),
);
