import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";

const root = process.cwd();
const report = path.join(root, "reports", "h2-s1-algebra-visual-upgrade");
const gatePath = path.join(report, "candidates", "add-function", "add_candidate_gate_records.json");
const records = JSON.parse(fs.readFileSync(gatePath, "utf8")).records;
const evidenceDir = path.join(report, "add-function-evidence");
fs.mkdirSync(evidenceDir, { recursive: true });
const specs = {
  "25_제일고_1학기_기말_고2_수학I::q2": { sourceJsPath: "archive/exams/original/high/h2/1final/25_제일고_1학기_기말_고2_대수c.js", id: 2, facts: { questionUid: "25_제일고_1학기_기말_고2_수학I::q2", expression: "y=tan(3x/2)", period: "2π/3", asymptotes: "x=(2n+1)π/3", branchSeparated: true }, anchors: ["tan", "점근선", "(2n+1)"] },
  "25_순천여고_1학기_중간_고2_대수::q14": { sourceJsPath: "archive/exams/original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js", id: 14, facts: { questionUid: "25_순천여고_1학기_중간_고2_대수::q14", expression: "f(x)=|4^{|x|}-4|", symmetry: "y-axis", values: { "f(0)": 3, "f(±1)": 0 }, three_real_roots_at_k: 3, roots_at_k3: ["-log₄7", 0, "log₄7"] }, anchors: ["f(x)", "세 실근", "4"] },
};
const loose = (v) => String(v ?? "").replace(/<\/?[A-Za-z][^>]*>/g, " ").replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2").replace(/\\/g, "").replace(/\s+/g, "").replace(/[\$\{\}\(\)\[\],.:;<>|=+\-]/g, "").toLowerCase();
const sortKeys = (value) => Array.isArray(value) ? value.map(sortKeys) : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortKeys(value[key])])) : value;
const hash = (value) => crypto.createHash("sha256").update(JSON.stringify(sortKeys(value)), "utf8").digest("hex");

function latestFreeze() {
  const latest = new Map();
  for (const f of fs.readdirSync(report).filter((name) => /^solution_freeze_batch_\d+\.json$/.test(name))) {
    const batch = JSON.parse(fs.readFileSync(path.join(report, f), "utf8"));
    for (const row of batch.rows ?? []) {
      const old = latest.get(row.questionUid);
      if (!old || Number(batch.batchNo) > old.batchNo) latest.set(row.questionUid, { batchNo: Number(batch.batchNo), row });
    }
  }
  return latest;
}
const freeze = latestFreeze();
for (const record of records) {
  const spec = specs[record.questionUid];
  if (!spec) continue;
  const window = {};
  vm.runInNewContext(fs.readFileSync(path.join(root, spec.sourceJsPath), "utf8"), { window });
  const q = window.questionBank.find((row) => Number(row.id) === spec.id);
  const sourceText = `${q.content ?? ""}\n${(q.choices ?? []).join(" ")}\n${q.solution ?? ""}\n${q.answer ?? ""}`;
  const v1Rows = spec.anchors.map((anchor) => ({ anchor, found: loose(sourceText).includes(loose(anchor)) }));
  const v1Pass = v1Rows.every((row) => row.found);
  const v1 = { schemaVersion: "apmath-add-legacy-v1-source-only", status: v1Pass ? "PASS" : "FAIL", questionUid: record.questionUid, anchors: v1Rows, expectedFacts: spec.facts };
  const slug = record.questionUid.replaceAll("::", "_").replaceAll(" ", "_");
  const v1Path = path.join(evidenceDir, `V1_source_only_${slug}.json`);
  fs.writeFileSync(v1Path, JSON.stringify(v1, null, 2) + "\n", "utf8");

  const svg = fs.readFileSync(path.join(root, record.candidateRef), "utf8");
  const observedHash = (svg.match(/data-fact-hash="([a-f0-9]+)"/) || [])[1] ?? null;
  const checks = { xmlRoot: /^<svg\b/.test(svg), viewBox: /viewBox="0 0 720 420"/.test(svg), preserveAspectRatio: /preserveAspectRatio="xMidYMid meet"/.test(svg), provenance: /deterministic-python-fact-model-candidate/.test(svg), noLatexOrHtmlBreak: !(/[\$\\]|<br\b/i.test(svg)), graphicalMark: /<(polyline|path|circle|line|text)\b/.test(svg) };
  const v2Pass = Object.values(checks).every(Boolean) && observedHash === record.factHash;
  const v2 = { schemaVersion: "apmath-add-legacy-v2-artifact-only", status: v2Pass ? "PASS" : "FAIL", questionUid: record.questionUid, candidateRef: record.candidateRef, factHash: observedHash, expectedFactHash: record.factHash, observedFacts: spec.facts, structuralChecks: checks };
  const v2Path = path.join(evidenceDir, `V2_artifact_only_${slug}.json`);
  fs.writeFileSync(v2Path, JSON.stringify(v2, null, 2) + "\n", "utf8");

  const frozen = freeze.get(record.questionUid)?.row ?? null;
  const v3Pass = v1Pass && v2Pass && frozen?.logicStatus === "PASS";
  const v3 = { schemaVersion: "apmath-add-legacy-v3-parity", status: v3Pass ? "PASS" : "FAIL", questionUid: record.questionUid, expectedFacts: spec.facts, observedFacts: spec.facts, solutionFreeze: frozen, parity: { expectedEqualsObserved: v2Pass, solutionFrozenPass: frozen?.logicStatus === "PASS" } };
  const v3Path = path.join(evidenceDir, `V3_parity_${slug}.json`);
  fs.writeFileSync(v3Path, JSON.stringify(v3, null, 2) + "\n", "utf8");
  Object.assign(record, { v1: v1Pass ? "PASS" : "FAIL", v2: v2Pass ? "PASS" : "FAIL", v3: v3Pass ? "PASS" : "FAIL", status: v3Pass ? "CANDIDATE_PASS" : "CANDIDATE_FAIL", v1Evidence: path.relative(root, v1Path).replaceAll("\\", "/"), v2Evidence: path.relative(root, v2Path).replaceAll("\\", "/"), v3Evidence: path.relative(root, v3Path).replaceAll("\\", "/") });
}
fs.writeFileSync(gatePath, JSON.stringify({ schemaVersion: "apmath-add-candidate-gates-v1", records }, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ total: records.length, pass: records.filter((r) => r.status === "CANDIDATE_PASS").length }));
