import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";

const root = process.cwd();
const evidence = path.join(root, "docs", "evidence", "high1-geometry-equation");
const manifest = JSON.parse(fs.readFileSync(path.join(evidence, "final_target_manifest.json"), "utf8"));
const capturePath = process.env.GEOMETRY_BROWSER_CAPTURE || path.join(evidence, "browser_harness_capture.json");
if (!fs.existsSync(capturePath)) {
  throw new Error(`REAL_BROWSER_CAPTURE_REQUIRED: ${capturePath}`);
}
const capture = JSON.parse(fs.readFileSync(capturePath, "utf8"));
if (capture.runtime !== "codex-in-app-browser" || capture.synthetic === true) {
  throw new Error("REAL_BROWSER_CAPTURE_REQUIRED: capture.runtime must be codex-in-app-browser and synthetic must be false");
}

const expectedBySource = new Map();
const errors = [];
const shaFile = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const recheckPath = path.join(evidence, "browser_harness_recheck.json");
if (!fs.existsSync(recheckPath)) {
  errors.push({ mode: "recheck", code: "CURRENT_SHA_RECHECK_MISSING" });
}
const recheck = fs.existsSync(recheckPath) ? JSON.parse(fs.readFileSync(recheckPath, "utf8")) : null;
const q20SourcePath = path.join(root, "archive", "exams", "original", "high", "h1", "1mid", "24_제일고_1학기_중간_고1_기출.js");
const q20AssetPath = path.join(root, "archive", "assets", "images", "24_제일고_1학기_중간_고1_기출", "q20-solution.svg");
const engineText = fs.readFileSync(path.join(root, "archive", "engine.html"), "utf8");
const engineAssetVersion = engineText.match(/ARCHIVE_ASSET_CACHE_VERSION\s*=\s*['"]([^'"]+)['"]/)?.[1] || null;
const recheckValid = recheck?.runtime === "codex-in-app-browser"
  && recheck?.synthetic === false
  && recheck?.sourcePath === "original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js"
  && recheck?.sourceSha256 === shaFile(q20SourcePath)
  && recheck?.solutionImageSha256 === shaFile(q20AssetPath)
  && recheck?.assetUrl === "assets/images/24_제일고_1학기_중간_고1_기출/q20-solution.svg?v=" + engineAssetVersion
  && recheck?.mode === "sol"
  && recheck?.engineDataLoaded === true
  && recheck?.pageCount > 0
  && recheck?.q20SvgLoaded === true
  && recheck?.updatedProofVisible === true
  && recheck?.errorText === false
  && recheck?.horizontalOverflow === false;
if (!recheckValid) errors.push({ mode: "recheck", code: "CURRENT_SHA_RECHECK_FAIL", actual: recheck });
for (const row of manifest.rows) {
  if (!expectedBySource.has(row.sourceJsPath)) expectedBySource.set(row.sourceJsPath, { questionCount: 0, solutionImages: 0, solutionImageRefs: new Set() });
  const expected = expectedBySource.get(row.sourceJsPath);
  if (row.solutionImageRef) expected.solutionImageRefs.add(row.solutionImageRef.replace(/^archive\//, ""));
}
for (const [sourcePath, expected] of expectedBySource) {
  const sourceFile = path.join(root, "archive", "exams", sourcePath.replaceAll("/", path.sep));
  try {
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(sourceFile, "utf8"), context, { filename: sourceFile, timeout: 5000 });
    expected.questionCount = (context.window.questionBank || []).length;
  } catch (error) {
    errors.push({ sourcePath, mode: "source", code: "SOURCE_QCOUNT_READ_FAIL", error: String(error) });
  }
  expected.solutionImages = expected.solutionImageRefs.size;
}
const rawSourceCases = Array.isArray(capture.sourceCases) ? capture.sourceCases : [];
const sourceCases = rawSourceCases.flatMap((item) => {
  if (item.modes && typeof item.modes === "object") return Object.entries(item.modes).map(([mode, state]) => ({ sourcePath: item.sourcePath, mode, ...state }));
  return [item];
});
const bySourceMode = new Map(sourceCases.map((item) => [`${item.sourcePath}|${item.mode}`, item]));
for (const [sourcePath, expected] of expectedBySource) {
  for (const mode of ["exam", "sol", "ans"]) {
    const item = bySourceMode.get(`${sourcePath}|${mode}`);
    if (!item) {
      errors.push({ sourcePath, mode, code: "BROWSER_CASE_MISSING" });
      continue;
    }
    const commonFail = !item.engineDataLoaded || (mode !== "exam" && item.pageCount <= 0) || item.errorText || item.horizontalOverflow;
    if (mode === "exam" && (commonFail || item.questionBlocks !== expected.questionCount || item.allImagesLoaded !== true)) {
      errors.push({ sourcePath, mode, code: "EXAM_RENDER_ASSERTION_FAIL", expected, actual: item });
    }
    if (mode === "ans" && (commonFail || item.answerItems !== expected.questionCount)) {
      errors.push({ sourcePath, mode, code: "ANSWER_RENDER_ASSERTION_FAIL", expected, actual: item });
    }
  }
  const sol = bySourceMode.get(`${sourcePath}|sol`);
  if (sol && (!sol.engineDataLoaded || sol.pageCount <= 0 || sol.solutionImages !== expected.solutionImages || sol.loadedSolutionImages !== expected.solutionImages || sol.errorText || sol.horizontalOverflow)) {
    errors.push({ sourcePath, mode: "sol", code: "SOLUTION_RENDER_ASSERTION_FAIL", expected, actual: sol });
  }
}
for (const sample of capture.samples || []) {
  if (sample.mode === "sol" && (!sample.engineDataLoaded || sample.pageCount <= 0 || !sample.imageLoaded || !sample.directSvgVisualVerified || sample.errorText || sample.horizontalOverflow)) {
    errors.push({ sourcePath: sample.sourcePath, mode: sample.mode, code: "SAMPLE_RENDER_ASSERTION_FAIL", actual: sample });
  }
}
const observedImages = sourceCases.filter((item) => item.mode === "sol").reduce((sum, item) => sum + Number(item.loadedSolutionImages || 0), 0);
const expectedImages = [...expectedBySource.values()].reduce((sum, item) => sum + item.solutionImages, 0);
const report = {
  reportType: "independent_C_browser_final",
  status: errors.length === 0 && observedImages === expectedImages ? "PASS" : "FAIL",
  basis: "validated capture produced by an actual Codex in-app browser session; no counts or PASS fields are synthesized",
  capturePath: path.relative(root, capturePath).replaceAll("\\", "/"),
  captureRuntime: capture.runtime,
  executedAt: capture.executedAt || null,
  targetSourceCount: expectedBySource.size,
  productionAssetLoad: { expected: expectedImages, observed: observedImages, loaded: observedImages, fail: expectedImages - observedImages, status: observedImages === expectedImages ? "PASS" : "FAIL" },
  sourceCases: { expected: expectedBySource.size * 3, observed: sourceCases.length, modes: { exam: sourceCases.filter((item) => item.mode === "exam").length, sol: sourceCases.filter((item) => item.mode === "sol").length, ans: sourceCases.filter((item) => item.mode === "ans").length }, pass: sourceCases.length - errors.length, fail: errors.length },
  sourceSolCases: { expected: expectedBySource.size, observed: sourceCases.filter((item) => item.mode === "sol").length, pass: expectedBySource.size - new Set(errors.filter((item) => item.mode === "sol").map((item) => item.sourcePath)).size, fail: errors.filter((item) => item.mode === "sol").length },
  samples: capture.samples || [],
  currentShaRecheck: recheck,
  errors,
  globalCi: "BLOCKED_UNRELATED_H2_PROBABILITY_QCOUNT_DB_JS_24_INDEX_23",
};
const outputPath = path.join(evidence, "c_browser_summary.json");
const tempPath = `${outputPath}.external-review.tmp`;
fs.writeFileSync(tempPath, JSON.stringify(report, null, 2) + "\n", "utf8");
fs.renameSync(tempPath, outputPath);
console.log(JSON.stringify(report, null, 2));
if (report.status !== "PASS") process.exitCode = 1;
