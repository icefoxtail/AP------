import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const policyPath = "archive/data/archive2-canonical-projection-policy.json";
const masterPath = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const masterReference = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const policyBytes = fs.readFileSync(path.join(root, policyPath));
const policy = JSON.parse(policyBytes.toString("utf8").replace(/^\uFEFF/, ""));
const masterBytes = fs.readFileSync(path.join(root, masterPath));
const masterSha256 = hash(masterBytes);

if (policy.schemaVersion !== "archive2-canonical-projection-policy-v1" ||
    policy.status !== "ACTIVE" || !Array.isArray(policy.gradeCourseAllowlist) ||
    policy.gradeCourseAllowlist.length === 0 ||
    !Array.isArray(policy.high23SharedSubjects) || policy.high23SharedSubjects.length === 0 ||
    !String(policy.canonicalMasterPath || "").replaceAll("\\", "/").endsWith(masterReference)) {
  throw new Error("Archive2 projection policy is not a valid active canonical binding");
}

const priorBindings = new Set();
for (const row of policy.high23SharedSubjects) {
  if (row.approvalStatus !== "APPROVED" ||
      row.evidenceReference !== masterReference ||
      !/^[a-f0-9]{64}$/i.test(String(row.taxonomyVersion || "")) ||
      !/^[a-f0-9]{64}$/i.test(String(row.evidenceSha256 || "")) ||
      row.taxonomyVersion !== row.evidenceSha256) {
    throw new Error("Projection policy contains an unapproved or inconsistent canonical binding");
  }
  priorBindings.add(row.taxonomyVersion.toLowerCase());
}
if (priorBindings.size !== 1) {
  throw new Error("Projection policy rows do not share one prior canonical master binding");
}

policy.canonicalMasterSha256 = masterSha256;
for (const row of policy.high23SharedSubjects) {
  row.taxonomyVersion = masterSha256;
  row.evidenceSha256 = masterSha256;
}
const expected = JSON.stringify(policy, null, 2) + "\n";
const actual = policyBytes.toString("utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
if (process.argv.includes("--check")) {
  if (actual !== expected) throw new Error("Archive2 projection policy canonical binding is stale");
} else {
  fs.writeFileSync(path.join(root, policyPath), expected, "utf8");
}
console.log(`Archive2 projection policy bound to CANONICAL_MASTER sha256 ${masterSha256}`);
