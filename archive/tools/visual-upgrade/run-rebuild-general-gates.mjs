import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";

const root = process.cwd();
const report = path.join(root, "reports", "h2-s1-algebra-visual-upgrade");
const specs = JSON.parse(fs.readFileSync(path.join(report, "candidates", "rebuild-general", "rebuild_general_specs.json"), "utf8"));
const evidenceDir = path.join(report, "rebuild-general-evidence");
fs.mkdirSync(evidenceDir, { recursive: true });
const loose = (v) => String(v ?? "").replace(/<\/?[A-Za-z][^>]*>/g, " ").replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2").replace(/\\/g, "").replace(/\s+/g, "").replace(/[\$\{\}\(\)\[\],.:;<>|=+\-]/g, "").toLowerCase();
const sortKeys = (v) => Array.isArray(v) ? v.map(sortKeys) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])])) : v;
const hash = (v) => crypto.createHash("sha256").update(JSON.stringify(sortKeys(v)), "utf8").digest("hex");
function freezeLatest() {
  const map = new Map();
  for (const f of fs.readdirSync(report).filter((n) => n.startsWith("solution_freeze_batch_") && n.endsWith(".json"))) {
    const batch = JSON.parse(fs.readFileSync(path.join(report, f), "utf8"));
    for (const row of batch.rows ?? []) { const old = map.get(row.questionUid); if (!old || Number(batch.batchNo) > old.batchNo) map.set(row.questionUid, { batchNo: Number(batch.batchNo), row }); }
  }
  return map;
}
const freeze = freezeLatest();
const records = [];
for (const spec of specs) {
  const window = {};
  vm.runInNewContext(fs.readFileSync(path.join(root, spec.sourceJsPath), "utf8"), { window });
  const q = window.questionBank.find((row) => Number(row.id) === Number(spec.id));
  const sourceText = `${q.content ?? ""}\n${(q.choices ?? []).join(" ")}\n${q.solution ?? ""}\n${q.answer ?? ""}`;
  const v1Anchors = spec.anchors.map((anchor) => ({ anchor, found: loose(sourceText).includes(loose(anchor)) }));
  const v1Pass = v1Anchors.every((row) => row.found);
  const v1 = { schemaVersion: "apmath-rebuild-general-v1-source-only", status: v1Pass ? "PASS" : "FAIL", questionUid: spec.questionUid, sourceJsPath: spec.sourceJsPath, anchors: v1Anchors, expectedFacts: spec.facts };
  const slug = spec.slug;
  const v1Path = path.join(evidenceDir, `V1_source_only_${slug}.json`); fs.writeFileSync(v1Path, JSON.stringify(v1, null, 2) + "\n", "utf8");

  const svg = fs.readFileSync(path.join(root, spec.candidateRef), "utf8");
  const observedHash = (svg.match(/data-fact-hash="([a-f0-9]+)"/) || [])[1] ?? null;
  const checks = { xmlRoot: /^<svg\b/.test(svg), viewBox: /viewBox="0 0 720 420"/.test(svg), preserveAspectRatio: /preserveAspectRatio="xMidYMid meet"/.test(svg), provenance: /deterministic-python-fact-model-candidate/.test(svg), noLatexOrHtmlBreak: !(/[\$\\]|<br\b/i.test(svg)), title: /<title>[^<]+<\/title>/.test(svg), description: /<desc>[^<]+<\/desc>/.test(svg), graphicalMark: /<(polyline|path|circle|line|polygon|text)\b/.test(svg) };
  const metadata = (svg.match(/data-visual-facts="([^"]+)"/) || [])[1] ?? null;
  const observedFacts = metadata ? JSON.parse(metadata.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")) : null;
  const v2Pass = Object.values(checks).every(Boolean) && observedFacts && observedHash === hash(spec.facts) && JSON.stringify(sortKeys(observedFacts)) === JSON.stringify(sortKeys(spec.facts));
  const v2 = { schemaVersion: "apmath-rebuild-general-v2-artifact-only", status: v2Pass ? "PASS" : "FAIL", questionUid: spec.questionUid, candidateRef: spec.candidateRef, factHash: observedHash, expectedFactHash: hash(spec.facts), observedFacts, structuralChecks: checks };
  const v2Path = path.join(evidenceDir, `V2_artifact_only_${slug}.json`); fs.writeFileSync(v2Path, JSON.stringify(v2, null, 2) + "\n", "utf8");

  const frozen = freeze.get(spec.questionUid)?.row ?? null;
  const v3Pass = v1Pass && v2Pass && frozen?.logicStatus === "PASS";
  const v3 = { schemaVersion: "apmath-rebuild-general-v3-parity", status: v3Pass ? "PASS" : "FAIL", questionUid: spec.questionUid, expectedFacts: spec.facts, observedFacts, solutionFreeze: frozen, parity: { expectedEqualsObserved: JSON.stringify(sortKeys(spec.facts)) === JSON.stringify(sortKeys(observedFacts)), solutionFrozenPass: frozen?.logicStatus === "PASS" } };
  const v3Path = path.join(evidenceDir, `V3_parity_${slug}.json`); fs.writeFileSync(v3Path, JSON.stringify(v3, null, 2) + "\n", "utf8");
  records.push({ questionUid: spec.questionUid, candidateRef: spec.candidateRef, factHash: hash(spec.facts), v1: v1Pass ? "PASS" : "FAIL", v2: v2Pass ? "PASS" : "FAIL", v3: v3Pass ? "PASS" : "FAIL", v1Evidence: path.relative(root, v1Path).replaceAll("\\", "/"), v2Evidence: path.relative(root, v2Path).replaceAll("\\", "/"), v3Evidence: path.relative(root, v3Path).replaceAll("\\", "/"), status: v3Pass ? "REBUILD_CANDIDATE_PASS" : "REBUILD_CANDIDATE_FAIL" });
}
fs.writeFileSync(path.join(report, "candidates", "rebuild-general", "rebuild_general_gate_records.json"), JSON.stringify({ schemaVersion: "apmath-rebuild-general-gates-v1", records }, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ total: records.length, pass: records.filter((r) => r.status === "REBUILD_CANDIDATE_PASS").length, fail: records.filter((r) => r.status !== "REBUILD_CANDIDATE_PASS").length }));
