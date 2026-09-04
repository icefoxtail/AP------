import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const archiveRoot = path.resolve(here, "../..");

function arg(name) {
  const index = process.argv.indexOf(name);
  if (index < 0 || !process.argv[index + 1]) throw new Error(`${name} is required`);
  return path.resolve(process.argv[index + 1]);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function loadCandidate(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
  return context.window;
}

function isNonEmpty(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function loadSubunitMaster() {
  const file = path.join(archiveRoot, "data", "master_tables", "js_archive_tag_master.json");
  const rows = JSON.parse(fs.readFileSync(file, "utf8"));
  return Array.isArray(rows) ? rows.filter((row) => isNonEmpty(row?.subUnitKey)) : [];
}

function writeCandidate(file, candidate) {
  const source = [
    `window.examTitle = ${JSON.stringify(candidate.examTitle)};`,
    `window.questionBank = ${JSON.stringify(candidate.questionBank, null, 2)};`,
    "",
  ].join("\n");
  fs.writeFileSync(file, source, "utf8");
}

function main() {
  const manifestFile = arg("--manifest");
  const candidateFile = arg("--candidate");
  const reviewFile = arg("--review");
  const assetsDir = arg("--assets");
  const replaceExisting = process.argv.includes("--replace-existing");
  const manifest = readJson(manifestFile);
  const review = readJson(reviewFile);
  const candidate = loadCandidate(candidateFile);
  const masterRows = loadSubunitMaster();
  if (review.status !== "reviewed_pass") throw new Error("review.status must be reviewed_pass");
  if (review.examId !== manifest.examId || candidate.examTitle !== manifest.examId) throw new Error("exam identity mismatch");
  if (!Array.isArray(candidate.questionBank) || candidate.questionBank.length !== review.questionCount) throw new Error("question count mismatch");
  const ids = candidate.questionBank.map((question) => question.id);
  if (ids.some((id, index) => id !== index + 1)) throw new Error("question ids must be sequential from 1");
  if (!manifest.archiveRelativePath) throw new Error("manifest.archiveRelativePath is required");
  const required = ["level", "category", "originalCategory", "standardCourse", "standardUnitKey", "standardUnit", "standardUnitOrder", "questionType", "layoutTag", "tags", "wide", "content", "choices", "answer", "solution", ...["subUnitKey", "subUnit", "subUnitConfidence", "subUnitClassificationDepth"]];
  const nonEmptyRequired = ["content", "answer", "solution", "subUnitKey", "subUnit", "subUnitConfidence", "subUnitClassificationDepth"];
  const confidenceValues = new Set(["existing_preserved", "candidate_evidence", "category_or_cue_inferred", "rule_inferred"]);
  const depthValues = new Set(["complete_candidate", "complete_category", "complete_documented", "complete_rule"]);
  for (const question of candidate.questionBank) {
    for (const key of required) if (!(key in question)) throw new Error(`q${question.id} missing ${key}`);
    for (const key of nonEmptyRequired) if (!isNonEmpty(question[key])) throw new Error(`q${question.id} empty ${key}`);
    if (!confidenceValues.has(question.subUnitConfidence)) throw new Error(`q${question.id} invalid subUnitConfidence`);
    if (!depthValues.has(question.subUnitClassificationDepth)) throw new Error(`q${question.id} invalid subUnitClassificationDepth`);
    const masterMatch = masterRows.find((row) =>
      row.subUnitKey === question.subUnitKey &&
      row.standardUnitKey === question.standardUnitKey &&
      row.labelKo === question.subUnit &&
      row.status !== "deprecated"
    );
    if (!masterMatch) throw new Error(`q${question.id} subunit master mismatch`);
  }

  const liveRoot = path.resolve(archiveRoot, "exams");
  const liveJs = path.resolve(liveRoot, manifest.archiveRelativePath);
  if (!liveJs.startsWith(`${liveRoot}${path.sep}`)) throw new Error("manifest.archiveRelativePath escapes archive/exams");
  if (fs.existsSync(liveJs) && !replaceExisting) throw new Error(`live JS already exists: ${liveJs}`);

  const liveAssetsDir = path.join(archiveRoot, "assets", "images", manifest.examId);
  const expectedPrefix = `assets/images/${manifest.examId}/`;
  const assetSources = new Map();
  function canonicalizeAsset(question, field) {
    const value = String(question[field] || "");
    if (!value) return;
    if (value.startsWith(expectedPrefix)) {
      assetSources.set(path.basename(value), value);
      return;
    }
    if (value.startsWith("assets/") && !value.includes("/images/")) {
      const canonical = `${expectedPrefix}${path.basename(value)}`;
      question[field] = canonical;
      if (field === "image" && question.visualAsset === value) question.visualAsset = canonical;
      assetSources.set(path.basename(canonical), canonical);
      return;
    }
    throw new Error(`q${question.id} ${field} path mismatch`);
  }
  for (const question of candidate.questionBank) {
    canonicalizeAsset(question, "image");
    canonicalizeAsset(question, "solutionImage");
  }
  if (assetSources.size) fs.mkdirSync(liveAssetsDir, { recursive: true });
  for (const canonical of assetSources.values()) {
    const name = path.basename(canonical);
    const source = path.join(assetsDir, name);
    if (!fs.existsSync(source)) throw new Error(`missing generated asset: ${source}`);
    fs.copyFileSync(source, path.join(liveAssetsDir, name));
  }
  fs.mkdirSync(path.dirname(liveJs), { recursive: true });
  // Re-serialize once so V2 staging asset paths are canonicalized in both files.
  writeCandidate(candidateFile, candidate);
  fs.copyFileSync(candidateFile, liveJs);
  console.log(JSON.stringify({ status: "promoted", examId: manifest.examId, liveJs, liveAssetsDir, questionCount: candidate.questionBank.length, assetCount: assetSources.size }, null, 2));
}

main();
