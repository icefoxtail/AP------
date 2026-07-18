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

function main() {
  const manifestFile = arg("--manifest");
  const candidateFile = arg("--candidate");
  const reviewFile = arg("--review");
  const assetsDir = arg("--assets");
  const replaceExisting = process.argv.includes("--replace-existing");
  const manifest = readJson(manifestFile);
  const review = readJson(reviewFile);
  const candidate = loadCandidate(candidateFile);
  if (review.status !== "reviewed_pass") throw new Error("review.status must be reviewed_pass");
  if (review.examId !== manifest.examId || candidate.examTitle !== manifest.examId) throw new Error("exam identity mismatch");
  if (!Array.isArray(candidate.questionBank) || candidate.questionBank.length !== review.questionCount) throw new Error("question count mismatch");
  const ids = candidate.questionBank.map((question) => question.id);
  if (ids.some((id, index) => id !== index + 1)) throw new Error("question ids must be sequential from 1");
  const required = ["level", "category", "originalCategory", "standardCourse", "standardUnitKey", "standardUnit", "standardUnitOrder", "questionType", "layoutTag", "tags", "wide", "content", "choices", "answer", "solution"];
  for (const question of candidate.questionBank) {
    for (const key of required) if (!(key in question)) throw new Error(`q${question.id} missing ${key}`);
  }

  const liveJs = path.join(archiveRoot, "exams", manifest.archiveRelativePath);
  if (fs.existsSync(liveJs) && !replaceExisting) throw new Error(`live JS already exists: ${liveJs}`);
  fs.mkdirSync(path.dirname(liveJs), { recursive: true });
  fs.copyFileSync(candidateFile, liveJs);

  const liveAssetsDir = path.join(archiveRoot, "assets", "images", manifest.examId);
  const imageQuestions = candidate.questionBank.filter((question) => question.image);
  if (imageQuestions.length) fs.mkdirSync(liveAssetsDir, { recursive: true });
  for (const question of imageQuestions) {
    const expectedPrefix = `assets/images/${manifest.examId}/`;
    if (!question.image.startsWith(expectedPrefix)) throw new Error(`q${question.id} image path mismatch`);
    const name = path.basename(question.image);
    const source = path.join(assetsDir, name);
    if (!fs.existsSync(source)) throw new Error(`missing generated asset: ${source}`);
    fs.copyFileSync(source, path.join(liveAssetsDir, name));
  }
  console.log(JSON.stringify({ status: "promoted", examId: manifest.examId, liveJs, liveAssetsDir, questionCount: candidate.questionBank.length, imageCount: imageQuestions.length }, null, 2));
}

main();
