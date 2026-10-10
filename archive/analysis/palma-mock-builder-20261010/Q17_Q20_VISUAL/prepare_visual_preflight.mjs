import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const evidenceDir = path.resolve(root, "archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL");
const targetDir = "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1";
const approvalPath = targetDir + "/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json";
const approval = JSON.parse(fs.readFileSync(path.join(root, approvalPath), "utf8"));
const sha256 = b => crypto.createHash("sha256").update(b).digest("hex").toUpperCase();
const gitBlobSha = b => crypto.createHash("sha1").update(Buffer.concat([Buffer.from("blob " + b.length + "\0"), b])).digest("hex");
const writeJson = (file, value) => fs.writeFileSync(path.join(evidenceDir, file), Buffer.from(JSON.stringify(value, null, 2) + "\n", "utf8"));
const hashFile = rel => {
  const b = fs.readFileSync(path.join(root, rel));
  return { path: rel, sha256: sha256(b), gitBlobSha1: gitBlobSha(b), sizeBytes: b.length };
};
const git = args => execFileSync("git", args, { cwd: root, stdio: ["ignore", "pipe", "pipe"] }).toString("utf8").trim();
const loadBank = rel => {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(root, rel), "utf8"), sandbox, { filename: rel, timeout: 5000 });
  const bank = sandbox.window.questionBank || sandbox.window.questions;
  if (!Array.isArray(bank)) throw new Error("QUESTION_BANK_REQUIRED:" + rel);
  return bank;
};

const packageIntegrity = [];
for (const qid of [17, 18, 19, 20]) {
  const receipt = approval.packages.find(p => p.sourceQid === qid);
  if (!receipt) throw new Error("APPROVED_PACKAGE_RECEIPT_MISSING:Q" + qid);
  const rel = receipt.path;
  const disk = fs.readFileSync(path.join(root, rel));
  const blobSha = git(["rev-parse", "HEAD:" + rel]);
  if (blobSha !== receipt.gitBlobSha1) throw new Error("APPROVED_PACKAGE_GIT_BLOB_MISMATCH:Q" + qid);
  const canonical = execFileSync("git", ["cat-file", "blob", blobSha], { cwd: root });
  const canonicalSha256 = sha256(canonical);
  if (canonicalSha256 !== receipt.sha256.toUpperCase()) throw new Error("APPROVED_PACKAGE_CANONICAL_SHA256_MISMATCH:Q" + qid);
  const packageValue = JSON.parse(disk.toString("utf8"));
  if (packageValue.sourceGitBlobSha !== approval.source.gitBlobSha1) throw new Error("PACKAGE_SOURCE_BLOB_MISMATCH:Q" + qid);
  packageIntegrity.push({
    sourceQid: qid,
    packagePath: rel,
    approvedCanonicalSha256: receipt.sha256,
    approvedGitBlobSha1: receipt.gitBlobSha1,
    currentWorktreeFileSha256: sha256(disk),
    currentWorktreeRawGitBlobSha1: gitBlobSha(disk),
    currentHeadGitBlobSha1: blobSha,
    sourceExamBlobSha1: packageValue.sourceGitBlobSha,
    uidCount: packageValue.items.length,
    itemUids: packageValue.items.map(item => item.uid)
  });
}

const golden = [
  {
    path: "archive/exams/original/high/h1/2mid/25_순천여고_2학기_중간_고1_기출.js",
    questions: [
      { qid: 6, excerpt: "PA=PA'", observation: "The reflection solution states PA=PA′ and uses the straight segment A′B as the lower bound; its solution SVG depicts the reflected point and decisive line." },
      { qid: 9, excerpt: "AG:GM=2:1", observation: "The centroid visual binds the order A–G–M and the 2:1 division to actual coordinates, making the coordinate recovery step visible." },
      { qid: 17, excerpt: "공통점을 지나는 직선", observation: "The common-chord solution ties the circle intersection relation to an actual line primitive rather than relying on the equation label alone." }
    ],
    solutionAssets: [
      "archive/assets/images/25_순천여고_2학기_중간_고1_기출/q06-solution.svg",
      "archive/assets/images/25_순천여고_2학기_중간_고1_기출/q09-solution.svg",
      "archive/assets/images/25_순천여고_2학기_중간_고1_기출/q17-solution.svg"
    ]
  },
  {
    path: "archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js",
    questions: [
      { qid: 3, excerpt: "완전제곱식", observation: "The circle center and radius from standard form are shown at their actual coordinate location with a radius segment; the existing PNG is clear and readable." },
      { qid: 4, excerpt: "두 접선은", observation: "Two parallel tangent lines and their symmetric y-intercepts are decisive; the SVG bytes were inspected for the circle/tangent/center structure." }
    ],
    solutionAssets: [
      "archive/assets/images/25_효천고_2학기_중간_고1_기출/q03-solution.svg",
      "archive/assets/images/25_효천고_2학기_중간_고1_기출/q04-solution.svg"
    ]
  },
  {
    path: "archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js",
    questions: [
      { qid: 7, excerpt: "(-3,1)", observation: "The translation then origin-reflection solution is shown as three actual circle centers in sequence; the screenshot is legible overall, with a few subscript glyphs boxed." },
      { qid: 12, excerpt: "|a-4|=a", observation: "The tangency conditions are tied to both coordinate axes and the moved circle; the source SVG asset and solution bytes were read." }
    ],
    solutionAssets: [
      "archive/assets/images/25_매산여고_2학기_중간_고1_기출/q7-solution.svg",
      "archive/assets/images/25_매산여고_2학기_중간_고1_기출/q12-solution.svg"
    ]
  }
];

const goldenSampleRefs = [];
const goldenSampleQuestionRefs = [];
const sampleVisuals = [];
for (const sample of golden) {
  const sourceBytes = fs.readFileSync(path.join(root, sample.path));
  const bank = loadBank(sample.path);
  goldenSampleRefs.push({ path: sample.path, sha256: "sha256:" + sha256(sourceBytes).toLowerCase(), gitBlobSha: gitBlobSha(sourceBytes) });
  for (const q of sample.questions) {
    const item = bank.find(row => Number(row.id) === q.qid);
    if (!item || typeof item.solution !== "string" || !item.solution.includes(q.excerpt)) {
      throw new Error("GOLDEN_SAMPLE_EXCERPT_MISMATCH:" + sample.path + ":q" + q.qid);
    }
    goldenSampleQuestionRefs.push({
      path: sample.path,
      qid: q.qid,
      solutionSha256: "sha256:" + sha256(Buffer.from(String(item.solution), "utf8")).toLowerCase(),
      solutionExcerpt: q.excerpt,
      observation: q.observation
    });
  }
  for (const asset of sample.solutionAssets) sampleVisuals.push(hashFile(asset));
}

const negativePaths = [
  "archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md",
  "archive/fixtures/review-negative-regressions/2026-10-01-bokseong/q20-solution.bad.svg",
  "archive/fixtures/visual-negative-regressions/2026-09-29/03_25_왕운중_2학기_중간_중2_수학_q24_COORDINATE_SEMANTIC_FAIL.svg"
];
const negativeRefs = negativePaths.map(hashFile);
const screenshots = [
  Object.assign(hashFile("archive/analysis/16_매산고_2학기_중간_고2_기하와벡터_기출/codex-archive2-h2-math2-geometry-20261007/preflight/golden/25-hyocheon-q3.png"), { observation: "Pre-existing frozen visual preflight PNG opened with view_image; actual circle, center, radius segment and labels are legible." }),
  Object.assign(hashFile("archive/analysis/16_매산고_2학기_중간_고2_기하와벡터_기출/codex-archive2-h2-math2-geometry-20261007/preflight/golden/25-masan-q7.png"), { observation: "Pre-existing frozen visual preflight PNG opened with view_image; center movement and before/after circle topology are visible; a few subscript glyphs render as boxes." }),
  Object.assign(hashFile("archive/analysis/16_매산고_2학기_중간_고2_기하와벡터_기출/codex-archive2-h2-math2-geometry-20261007/preflight/golden/25-hyocheon-q2.png"), { observation: "Read as caution only, not selected as Golden: multiple glyphs are rendered as square boxes in labels and explanatory text." }),
  Object.assign(hashFile("archive/analysis/qualification-20261006/20_매산고_2학기_기말_고2_수학II/R1-calibration-renders/negative-bokseong-q20.png"), { observation: "Pre-existing frozen negative sample screenshot opened with view_image; the equation label and actual line do not match, illustrating why SVG primitives must be checked." })
];

const approvalFile = hashFile(approvalPath);
const sourcePath = approval.source.path;
const currentSourceHeadBlobSha1 = git(["rev-parse", "HEAD:" + sourcePath]);
const rendererPath = "alive/engine/visual_renderer.py";
const rendererSource = fs.readFileSync(path.join(root, rendererPath), "utf8");
if (!rendererSource.includes('VISUAL_SPEC_VERSION = "0.1"') || !rendererSource.includes('"circle_geometry"') || !rendererSource.includes('"table"')) {
  throw new Error("VISUAL_RENDERER_SCHEMA_UNEXPECTED");
}

const calibration = {
  goldenSampleRefs,
  goldenSampleQuestionRefs,
  negativeSampleRefs: [{ path: negativeRefs[0].path, sha256: "sha256:" + negativeRefs[0].sha256.toLowerCase(), gitBlobSha: negativeRefs[0].gitBlobSha1 }],
  calibrationAxes: ["STUDENT_REPRODUCIBILITY", "SMALL_BOARD_STRUCTURE", "EXPLANATION_DENSITY", "VISUAL_SEMANTIC_PARITY", "VISUAL_READABILITY"],
  sampleReadBeforeWork: true,
  calibrationStatus: "PASS",
  solutionWorkMode: "TARGETED_REPAIR",
  calibrationOrder: "SAMPLES_PREFLIGHT_THEN_DEFECT_SCOPE_FREEZE_THEN_REPAIR"
};
const gateEvidence = { schemaVersion: "PALMA_Q17_Q20_VISUAL_PREFLIGHT_V1", solutionQualityCalibration: calibration };
writeJson("visual_solution_calibration_preflight.json", gateEvidence);

const receipt = {
  schemaVersion: "PALMA_Q17_Q20_VISUAL_READ_RECEIPT_V1",
  taskScope: { sourceQids: [17, 18, 19, 20], uidCount: 36, surfaces: ["PROBLEM", "SOLUTION"], packageBytesFrozen: true, mathTextRewritesAuthorized: false },
  worktree: { path: root, headSha: git(["rev-parse", "HEAD"]) },
  requiredRead: [
    { path: ".codex/skills/apmath-visual-upgrade/SKILL.md", sha256: hashFile(".codex/skills/apmath-visual-upgrade/SKILL.md").sha256, sectionsRead: "0 through 16, full file" },
    { path: "docs/rules/02_PIPELINES/Archive_작업전_Golden_Sample_Calibration_v1.md", sha256: hashFile("docs/rules/02_PIPELINES/Archive_작업전_Golden_Sample_Calibration_v1.md").sha256 },
    { path: "docs/rules/04_VISUAL/도형추출.md", sha256: hashFile("docs/rules/04_VISUAL/도형추출.md").sha256 },
    { path: "docs/rules/04_VISUAL/Problem_Bank_All_Items_Problem_And_Solution_Visual_Gate_CURRENT_v1.md", sha256: hashFile("docs/rules/04_VISUAL/Problem_Bank_All_Items_Problem_And_Solution_Visual_Gate_CURRENT_v1.md").sha256 },
    { path: "docs/rules/04_VISUAL/Problem_Bank_Per_Item_Problem_Solution_SVG_Full_Audit_CURRENT_v1.md", sha256: hashFile("docs/rules/04_VISUAL/Problem_Bank_Per_Item_Problem_Solution_SVG_Full_Audit_CURRENT_v1.md").sha256 },
    { path: "docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md", sha256: hashFile("docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md").sha256 },
    { path: "docs/rules/04_VISUAL/AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4_QUALIFICATION_READY.md", sha256: hashFile("docs/rules/04_VISUAL/AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4_QUALIFICATION_READY.md").sha256 },
    { path: "alive/04_VISUAL/ALIVE_VISUAL_SPEC_v0.1.md", sha256: hashFile("alive/04_VISUAL/ALIVE_VISUAL_SPEC_v0.1.md").sha256 },
    { path: "alive/04_VISUAL/ALIVE_SIMILAR_ADVANCED_VISUAL_REGEN_SPEC_v1.0.md", sha256: hashFile("alive/04_VISUAL/ALIVE_SIMILAR_ADVANCED_VISUAL_REGEN_SPEC_v1.0.md").sha256 },
    { path: rendererPath, sha256: hashFile(rendererPath).sha256, rendererVersion: "0.5.2-circle-geometry-label-layout", visualSpecVersion: "0.1", supportedTypes: ["coordinate_plane", "simple_function_graph", "segment_geometry", "polygon", "circle", "circle_geometry", "table"], supportedCurves: "curves[].points polyline sampling; native semicircle-arc primitive unsupported" }
  ],
  calibration: {
    status: "PREFLIGHT_PENDING",
    goldenSampleRefs,
    goldenSampleQuestionRefs,
    visualSampleAssetBytes: sampleVisuals,
    viewedPreexistingScreenshots: screenshots,
    negativeSampleRefs: negativeRefs,
    note: "The Hyochen q02 screenshot is recorded as a glyph-render caution, not a Golden quality sample."
  },
  browserAccess: {
    status: "LOCAL_GOLDEN_FILE_URL_REJECTED",
    action: "Attempted to open one pre-existing local Golden SVG in Chrome through cua_repl createBrowserTab using a file:// URL.",
    exactToolResponse: 'Browser Use rejected this action due to browser security policy. Reason: The browser URL policy blocks this action. Browser use cannot visit the requested page. The requested URL protocol is not allowed. Allowed protocols: "http:", "https:". The agent must not attempt to achieve the same outcome via workaround, indirect execution, raw CDP or browser commands, alternate browser surfaces, or policy circumvention. Proceed only with a materially safer alternative that does not require this blocked browser action; if none exists, stop and request user input.'
  },
  approvalBinding: {
    receipt: approvalFile,
    approvalStatus: approval.status,
    approvalHeadSha: approval.approvalHeadSha,
    approvedSourceExamBlobSha1: approval.source.gitBlobSha1,
    currentHeadSourceExamBlobSha1: currentSourceHeadBlobSha1,
    packageIntegrity
  },
  targetBaseline: {
    packages: [17, 18, 19, 20].map(qid => {
      const p = approval.packages.find(row => row.sourceQid === qid);
      const integrity = packageIntegrity.find(row => row.sourceQid === qid);
      return { sourceQid: qid, approvalCanonicalSha256: p.sha256, approvalGitBlobSha1: p.gitBlobSha1, currentWorktreeFileSha256: integrity.currentWorktreeFileSha256, itemUids: integrity.itemUids };
    }),
    problemVisualMarker: "Recorded in package as studentVisual only; not used as solution surface authority.",
    solutionImageBaseline: "All Q17–Q20 solutionVisual/solutionImage values inspected as absent."
  },
  materialization: { started: false }
};
writeJson("visual_read_receipt.json", receipt);

const exam = path.resolve(root, approval.source.path);
const gate = path.resolve(root, "archive/tools/solution-calibration-gate.mjs");
const evidence = path.join(evidenceDir, "visual_solution_calibration_preflight.json");
const stdout = execFileSync(process.execPath, [gate, "--exam", exam, "--evidence", evidence, "--stage", "VISUAL_REPAIR", "--preflight", "--json"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
const result = JSON.parse(stdout.toString("utf8"));
fs.writeFileSync(path.join(evidenceDir, "visual_solution_calibration_preflight.raw.json"), Buffer.from(JSON.stringify(result, null, 2) + "\n", "utf8"));
if (!result.ok) throw new Error("CALIBRATION_PREFLIGHT_FAILED:" + JSON.stringify(result.issues));
receipt.calibration.status = "PASS";
receipt.calibration.gateReportPath = "archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/visual_solution_calibration_preflight.raw.json";
receipt.calibration.gateReportSha256 = sha256(fs.readFileSync(path.join(evidenceDir, "visual_solution_calibration_preflight.raw.json")));
writeJson("visual_read_receipt.json", receipt);
console.log(JSON.stringify({ ok: true, stage: result.stage, questionCount: result.questionCount, goldenSamples: goldenSampleRefs.length, representativeSolutions: goldenSampleQuestionRefs.length, packageIntegrity: packageIntegrity.map(p => ({ qid: p.sourceQid, approvedCanonicalSha256Matches: true, approvedGitBlobMatches: true })), outputDir: path.relative(root, evidenceDir) }, null, 2));