import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";

const root = process.cwd();
const report = path.join(root, "reports", "h2-s1-algebra-visual-upgrade");
const specPath = path.join(report, "candidates", "add-general", "add_general_specs.json");
const evidenceDir = path.join(report, "add-general-evidence");
fs.mkdirSync(evidenceDir, { recursive: true });
const specs = JSON.parse(fs.readFileSync(specPath, "utf8"));

const loose = (value) => String(value ?? "")
  .replace(/<\/?[A-Za-z][^>]*>/g, " ")
  .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2")
  .replace(/\\n/g, " ")
  .replace(/\\/g, "")
  .replace(/\s+/g, "")
  .replace(/[\$\{\}\(\)\[\],.:;<>|=+\-]/g, "")
  .toLowerCase();

function sourceFacts(spec) {
  const source = fs.readFileSync(path.join(root, spec.sourceJsPath), "utf8");
  const window = {};
  vm.runInNewContext(source, { window });
  const question = window.questionBank.find((row) => Number(row.id) === Number(spec.id));
  if (!question) throw new Error(`question not found: ${spec.questionUid}`);
  const sourceText = `${question.content ?? ""}\n${(question.choices ?? []).join(" ")}\n${question.solution ?? ""}\n${question.answer ?? ""}`;
  const normalized = loose(sourceText);
  const anchors = spec.anchors.map((anchor) => ({ anchor, found: normalized.includes(loose(anchor)) }));
  return { questionUid: spec.questionUid, sourceJsPath: spec.sourceJsPath, id: spec.id, anchors, expectedFacts: spec.facts, sourceTextLength: sourceText.length };
}

function artifactFacts(spec) {
  const candidatePath = path.join(root, spec.candidateRef);
  const svg = fs.readFileSync(candidatePath, "utf8");
  const hash = (svg.match(/data-fact-hash="([a-f0-9]+)"/) || [])[1] ?? null;
  const metadata = (svg.match(/data-visual-facts="([^"]+)"/) || [])[1] ?? null;
  const observed = metadata ? JSON.parse(metadata.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")) : null;
  const visible = loose(svg.replace(/<style[\s\S]*?<\/style>/g, " "));
  const structuralChecks = {
    xmlRoot: /^<svg\b/.test(svg),
    viewBox: /viewBox="0 0 720 420"/.test(svg),
    preserveAspectRatio: /preserveAspectRatio="xMidYMid meet"/.test(svg),
    deterministicProvenance: /data-visual-provenance="deterministic-python-fact-model-candidate"/.test(svg),
    noLatexOrHtmlBreak: !/[\$\\]|<br\b/i.test(svg),
    hasTitle: /<title>[^<]+<\/title>/.test(svg),
    hasDescription: /<desc>[^<]+<\/desc>/.test(svg),
    graphicalMark: /<(polyline|path|circle|line|rect|text)\b/.test(svg),
  };
  return { questionUid: spec.questionUid, candidateRef: spec.candidateRef, factHash: hash, observedFacts: observed, artifactInspection: { metadataPresent: Boolean(metadata), factHashPresent: Boolean(hash) }, structuralChecks, bytes: Buffer.byteLength(svg) };
}

function latestFreeze() {
  const latest = new Map();
  for (const filename of fs.readdirSync(report).filter((name) => /^solution_freeze_batch_\d+\.json$/.test(name))) {
    const batch = JSON.parse(fs.readFileSync(path.join(report, filename), "utf8"));
    for (const row of (batch.rows ?? [])) {
      const previous = latest.get(row.questionUid);
      if (!previous || Number(batch.batchNo) > previous.batchNo) latest.set(row.questionUid, { batchNo: Number(batch.batchNo), row });
    }
  }
  return latest;
}

const freeze = latestFreeze();
const records = [];
for (const spec of specs) {
  const v1 = sourceFacts(spec);
  const v1Pass = v1.anchors.every((row) => row.found);
  const v1Path = path.join(evidenceDir, `V1_source_only_${spec.slug}.json`);
  fs.writeFileSync(v1Path, JSON.stringify({ schemaVersion: "apmath-add-general-v1-source-only", status: v1Pass ? "PASS" : "FAIL", ...v1 }, null, 2) + "\n", "utf8");

  const v2 = artifactFacts(spec);
  const expectedHash = cryptoHash(spec.facts);
  const v2Pass = Object.values(v2.structuralChecks).every(Boolean) && v2.artifactInspection.metadataPresent && v2.artifactInspection.factHashPresent && v2.factHash === expectedHash && v2.observedFacts && JSON.stringify(sortKeys(v2.observedFacts)) === JSON.stringify(sortKeys(spec.facts));
  const v2Path = path.join(evidenceDir, `V2_artifact_only_${spec.slug}.json`);
  fs.writeFileSync(v2Path, JSON.stringify({ schemaVersion: "apmath-add-general-v2-artifact-only", status: v2Pass ? "PASS" : "FAIL", expectedFactHash: expectedHash, ...v2 }, null, 2) + "\n", "utf8");

  const frozen = freeze.get(spec.questionUid)?.row ?? null;
  const v3Pass = v1Pass && v2Pass && frozen?.logicStatus === "PASS";
  const v3 = { schemaVersion: "apmath-add-general-v3-parity", status: v3Pass ? "PASS" : "FAIL", questionUid: spec.questionUid, expectedFacts: v1.expectedFacts, observedFacts: v2.observedFacts, solutionFreeze: frozen, parity: { expectedEqualsObserved: JSON.stringify(sortKeys(v1.expectedFacts)) === JSON.stringify(sortKeys(v2.observedFacts)), solutionFrozenPass: frozen?.logicStatus === "PASS" } };
  const v3Path = path.join(evidenceDir, `V3_parity_${spec.slug}.json`);
  fs.writeFileSync(v3Path, JSON.stringify(v3, null, 2) + "\n", "utf8");
  records.push({ questionUid: spec.questionUid, candidateRef: spec.candidateRef, factHash: expectedHash, v1: v1Pass ? "PASS" : "FAIL", v2: v2Pass ? "PASS" : "FAIL", v3: v3Pass ? "PASS" : "FAIL", v1Evidence: path.relative(root, v1Path).replaceAll("\\", "/"), v2Evidence: path.relative(root, v2Path).replaceAll("\\", "/"), v3Evidence: path.relative(root, v3Path).replaceAll("\\", "/"), status: v3Pass ? "CANDIDATE_PASS" : "CANDIDATE_FAIL" });
}
fs.writeFileSync(path.join(report, "candidates", "add-general", "add_general_gate_records.json"), JSON.stringify({ schemaVersion: "apmath-add-general-gates-v1", records }, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ total: records.length, pass: records.filter((r) => r.status === "CANDIDATE_PASS").length, fail: records.filter((r) => r.status !== "CANDIDATE_PASS").length }));

function cryptoHash(facts) {
  const canonical = JSON.stringify(sortKeys(facts));
  return crypto.createHash("sha256").update(canonical, "utf8").digest("hex");
}

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortKeys(value[key])]));
}
