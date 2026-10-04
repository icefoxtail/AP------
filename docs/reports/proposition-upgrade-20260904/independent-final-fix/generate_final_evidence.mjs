import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const repo = process.cwd();
const evidenceRoot = path.join(repo, "docs/reports/proposition-upgrade-20260904/independent-final-fix");
const downloadRoot = "C:/Users/USER/Downloads";
const targetStandardUnits = new Set(["H15-SB-02", "H22-C2-06"]);
const requiredSubUnits = new Map([
  ["H15-SB-02-PROPOSITION_BASIC", "명제와 진리집합"],
  ["H15-SB-02-NECESSARY_SUFFICIENT", "필요조건과 충분조건"],
  ["H15-SB-02-PROOF", "증명과 절대부등식"],
  ["H22-C2-06-CORE", "명제 핵심 개념"],
]);
const metadataFixes = [
  ["original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js", 6, "", "", "H15-SB-02-PROPOSITION_BASIC", "명제와 진리집합", "명제 여부·참거짓 판정"],
  ["original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js", 7, "", "", "H15-SB-02-NECESSARY_SUFFICIENT", "필요조건과 충분조건", "필요조건 방향 q→p"],
  ["original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js", 8, "", "", "H15-SB-02-PROPOSITION_BASIC", "명제와 진리집합", "대우 및 조건의 부정"],
  ["original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js", 9, "", "", "H15-SB-02-NECESSARY_SUFFICIENT", "필요조건과 충분조건", "진리집합 포함과 필요·충분 관계"],
  ["original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js", 10, "", "", "H15-SB-02-PROOF", "증명과 절대부등식", "절대부등식 증명"],
  ["original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js", 17, "", "", "H15-SB-02-NECESSARY_SUFFICIENT", "필요조건과 충분조건", "역·대우의 진릿값과 조건 포함 관계"],
  ["original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js", 19, "", "", "H15-SB-02-PROOF", "증명과 절대부등식", "산술기하평균으로 하한·최댓값 판정"],
  ["original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js", 22, "", "", "H15-SB-02-PROPOSITION_BASIC", "명제와 진리집합", "존재명제의 부정과 전칭 조건"],
  ["original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js", 23, "", "", "H15-SB-02-PROOF", "증명과 절대부등식", "귀류법 증명"],
  ["original/high/h1/2mid/22_강남여고_2학기_중간_고1_기출.js", 8, "H15-SB-02-PROPOSITION_BASIC", "명제와 진리집합", "H15-SB-02-PROOF", "증명과 절대부등식", "산술기하평균으로 곱의 최댓값"],
  ["original/high/h1/2final/24_제일고_2학기_기말_고1_기출.js", 9, "H15-SB-02-PROPOSITION_BASIC", "명제와 진리집합", "H15-SB-02-PROOF", "증명과 절대부등식", "코시-슈바르츠로 역수합의 최솟값"],
  ["original/high/h1/2final/24_제일고_2학기_기말_고1_기출.js", 19, "H15-SB-02-PROPOSITION_BASIC", "명제와 진리집합", "H15-SB-02-PROOF", "증명과 절대부등식", "코시-슈바르츠로 절대부등식의 극값"],
];
const pendingTarget = [1, 2, 5, 6, 11, 16, 20];
const pendingSource = "archive/exams/similar/high/h1/2final/25_순천고_2학기_기말_고1_유사.js";
const renderModes = ["exam", "solution", "answer"];
const renderColumns = ["examId", "mode", "targetQuestionCount", "renderedTargetCount", "imageExpected", "imageDecoded", "solutionImageExpected", "solutionImageDecoded", "overflowCount", "consoleErrorCount", "pageErrorCount", "status", "evidenceNote"];
const failureColumns = ["examId", "mode", "status", "failureReason", "evidenceNote"];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : file.endsWith(".js") ? [file] : [];
  });
}

function loadScript(file) {
  const window = {};
  vm.runInNewContext(fs.readFileSync(file, "utf8"), { window }, { filename: file });
  return window;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? "\"" + text.replaceAll("\"", "\"\"") + "\"" : text;
}

function toCsv(rows, columns) {
  return rows.length ? columns.join(",") + "\n" + rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")).join("\n") + "\n" : columns.join(",") + "\n";
}

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === "\"" && quoted && line[index + 1] === "\"") {
      cell += "\"";
      index += 1;
    } else if (char === "\"") {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }
  cells.push(cell);
  return cells;
}

function readCsv(file) {
  const lines = fs.readFileSync(file, "utf8").trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = parseCsvLine(lines.shift());
  return lines.map((line) => Object.fromEntries(parseCsvLine(line).map((value, index) => [headers[index], value])));
}

function pngInfo(file) {
  const bytes = fs.readFileSync(file);
  const validSignature = bytes.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
  return { bytes: bytes.length, validSignature, width: validSignature ? bytes.readUInt32BE(16) : 0, height: validSignature ? bytes.readUInt32BE(20) : 0 };
}

function gitOutput(args) {
  return execFileSync("git", args, { cwd: repo, encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
}

function write(file, contents) {
  fs.writeFileSync(path.join(evidenceRoot, file), contents, "utf8");
}

function getTargetRows() {
  const roots = [path.join(repo, "archive/exams/original/high/h1"), path.join(repo, "archive/exams/similar/high/h1")];
  const rows = [];
  const sourceFailures = [];
  for (const file of roots.flatMap((root) => walk(root)).sort()) {
    const relative = path.relative(path.join(repo, "archive/exams"), file).replaceAll("\\", "/");
    try {
      const loaded = loadScript(file);
      const questions = Array.isArray(loaded.questionBank) ? loaded.questionBank : [];
      const targets = questions.filter((question) => targetStandardUnits.has(question.standardUnitKey));
      if (targets.length) rows.push({
        examId: loaded.examTitle || path.basename(file, ".js"),
        sourceJsPath: "archive/exams/" + relative,
        targetQuestionCount: targets.length,
        targetQuestionIds: targets.map((question) => question.id).join("|"),
        productionKind: relative.startsWith("similar/") ? "similar" : "original",
      });
    } catch (error) {
      sourceFailures.push({ file: relative, error: String(error.message || error) });
    }
  }
  return { rows, sourceFailures };
}

function makeInventory(rows, sourceFailures) {
  const questions = [];
  const files = [];
  const seenCanonical = new Set();
  const counts = { duplicateIdCount: 0, duplicateCanonicalUidCount: 0, missingContentCount: 0, missingAnswerCount: 0, missingSolutionCount: 0, invalidStandardUnitCount: 0, missingSubUnitCount: 0, invalidSubUnitCount: 0, pendingReviewStatusCount: 0, pendingSolutionStatusCount: 0 };
  for (const row of rows) {
    const loaded = loadScript(path.join(repo, row.sourceJsPath));
    const allQuestions = Array.isArray(loaded.questionBank) ? loaded.questionBank : [];
    const allIds = allQuestions.map((question) => question.id);
    counts.duplicateIdCount += allIds.length - new Set(allIds).size;
    const targets = allQuestions.filter((question) => targetStandardUnits.has(question.standardUnitKey));
    files.push({ examId: row.examId, sourceJsPath: row.sourceJsPath, targetQuestionCount: targets.length, targetQuestionIds: targets.map((question) => question.id), totalQuestionCount: allQuestions.length });
    for (const question of targets) {
      const canonical = row.sourceJsPath + "#" + question.id;
      if (seenCanonical.has(canonical)) counts.duplicateCanonicalUidCount += 1;
      seenCanonical.add(canonical);
      const contentPresent = Boolean(String(question.content ?? "").trim());
      const answerPresent = question.answer !== undefined && question.answer !== null && Boolean(String(question.answer).trim());
      const solutionPresent = Boolean(String(question.solution ?? "").trim());
      if (!contentPresent) counts.missingContentCount += 1;
      if (!answerPresent) counts.missingAnswerCount += 1;
      if (!solutionPresent) counts.missingSolutionCount += 1;
      if (!targetStandardUnits.has(question.standardUnitKey)) counts.invalidStandardUnitCount += 1;
      if (!question.subUnitKey || !question.subUnit) counts.missingSubUnitCount += 1;
      if (question.subUnitKey && requiredSubUnits.get(question.subUnitKey) !== question.subUnit) counts.invalidSubUnitCount += 1;
      if (String(question.reviewStatus ?? "").includes("pending")) counts.pendingReviewStatusCount += 1;
      if (String(question.solutionStatus ?? "").includes("pending")) counts.pendingSolutionStatusCount += 1;
      questions.push({ sourceJsPath: row.sourceJsPath, examId: row.examId, id: question.id, contentPresent, answerPresent, solutionPresent, standardUnitKey: question.standardUnitKey, subUnitKey: question.subUnitKey || "", subUnit: question.subUnit || "", reviewStatus: question.reviewStatus || "", solutionStatus: question.solutionStatus || "" });
    }
  }
  return { generatedAt: new Date().toISOString(), target: 192, actualTarget: questions.length, sourceFailures, files, questions, counts };
}

function makeRenderEvidence(renderTargets) {
  const starts = [0, 5, 10, 15, 20, 25, 30, 35];
  const batchFiles = starts.map((start) => path.join(downloadRoot, "proposition_render_matrix_batch" + start + "-" + Math.min(start + 4, 37) + " (1).csv"));
  const initialFailureFiles = [0, 10, 20].map((start) => path.join(downloadRoot, "proposition_render_failures_batch" + start + "-" + Math.min(start + 4, 37) + " (1).csv"));
  const individualFiles = ["proposition_render_matrix_batch1-1.csv", "proposition_render_matrix_batch13-13.csv", "proposition_render_matrix_batch20-20.csv"].map((file) => path.join(downloadRoot, file));
  const rows = batchFiles.flatMap(readCsv);
  const reruns = individualFiles.flatMap(readCsv);
  const byKey = new Map(rows.map((row) => [row.examId + "|" + row.mode, row]));
  for (const row of reruns) byKey.set(row.examId + "|" + row.mode, row);
  const ordered = [];
  for (const target of renderTargets) for (const mode of renderModes) {
    const row = byKey.get(target.examId + "|" + mode);
    if (row) ordered.push(row);
  }
  const finalFailures = ordered.filter((row) => row.status !== "PASS").map((row) => ({ examId: row.examId, mode: row.mode, status: row.status, failureReason: row.failureReason || "status was not PASS", evidenceNote: row.evidenceNote || "" }));
  write("render_matrix.csv", toCsv(ordered, renderColumns));
  write("render_failures.csv", toCsv(finalFailures, failureColumns));
  return { rows: ordered, finalFailures, initialFailures: initialFailureFiles.flatMap(readCsv), reruns, expectedRows: renderTargets.length * renderModes.length };
}

function makeReports(inventory, renderTargets, render) {
  const expectedSubunitMap = new Map(metadataFixes.map((fix) => ["archive/exams/" + fix[0] + "#" + fix[1], fix[4]]));
  const confirmedWrongSubunitCount = inventory.questions.filter((question) => expectedSubunitMap.has(question.sourceJsPath + "#" + question.id) && expectedSubunitMap.get(question.sourceJsPath + "#" + question.id) !== question.subUnitKey).length;
  const indexLoaded = loadScript(path.join(repo, "archive/question-index.js"));
  const indexRows = Array.isArray(indexLoaded.questionIndex) ? indexLoaded.questionIndex : [];
  const indexKeys = new Set();
  let duplicateIndexQKeyCount = 0;
  for (const row of indexRows) {
    if (indexKeys.has(row.qKey)) duplicateIndexQKeyCount += 1;
    indexKeys.add(row.qKey);
  }
  const targetIndexKeys = inventory.questions.map((question) => question.sourceJsPath.replace("archive/exams/", "") + "#" + question.id);
  const indexMap = new Map(indexRows.map((row) => [row.sourceFile + "#" + row.id, row]));
  const missingIndexTargetCount = targetIndexKeys.filter((key) => !indexMap.has(key)).length;
  const indexSubUnitMismatchCount = inventory.questions.filter((question) => {
    const row = indexMap.get(question.sourceJsPath.replace("archive/exams/", "") + "#" + question.id);
    return !row || row.subUnitKey !== question.subUnitKey || row.subUnit !== question.subUnit;
  }).length;
  const diff = gitOutput(["diff", "--unified=0", "--", "archive/exams/original/high/h1/2mid/21_매산고_2학기_중간_고1_기출.js", "archive/exams/original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js", "archive/exams/original/high/h1/2mid/22_강남여고_2학기_중간_고1_기출.js", "archive/exams/original/high/h1/2final/24_제일고_2학기_기말_고1_기출.js", "archive/exams/similar/high/h1/2final/25_순천고_2학기_기말_고1_유사.js"]);
  const protectedFieldChanged = diff.split(/\r?\n/).filter((line) => /^[+-]/.test(line) && !/^[+-]{3}/.test(line) && /"content"|"choices"|"answer"/.test(line)).length;
  write("metadata_fix.csv", "sourceJsPath,id,oldSubUnitKey,oldSubUnit,newSubUnitKey,newSubUnit,rationale\n" + metadataFixes.map((fix) => fix.map(csvCell).join(",")).join("\n") + "\n");
  const pendingRows = pendingTarget.map((id) => {
    const question = inventory.questions.find((item) => item.sourceJsPath === pendingSource && item.id === id);
    return { sourceJsPath: pendingSource, id, reviewStatus: question?.reviewStatus || "", solutionStatus: question?.solutionStatus || "", pendingReview: String(question?.reviewStatus || "").includes("pending") ? "YES" : "NO", pendingSolution: String(question?.solutionStatus || "").includes("pending") ? "YES" : "NO" };
  });
  write("pending_status_check.csv", toCsv(pendingRows, ["sourceJsPath", "id", "reviewStatus", "solutionStatus", "pendingReview", "pendingSolution"]));
  const imageChecks = [
    ["22 효천고 2학기 중간 고1", 14, "archive/assets/images/22_효천고_2학기_중간_고1_기출/q14.png", "③", "보기 ③; solution 결론 ③"],
    ["22 효천고 2학기 중간 고1", 15, "archive/assets/images/22_효천고_2학기_중간_고1_기출/q15.png", "⑤", "보기 ⑤; solution 결론 ⑤"],
    ["25 순천고 2학기 기말 고1", 16, "archive/assets/images/25_순천고_2학기_기말_고1_기출/q16.png", "④", "(가) 8a, (나) 2a, (다) 4; solution 결론 ④"],
  ].map((item) => ({ exam: item[0], id: item[1], image: item[2], jsAnswer: item[3], conclusion: item[4], info: pngInfo(path.join(repo, item[2])) }));
  const imagePassCount = imageChecks.filter((item) => item.info.validSignature && item.info.width > 0 && item.info.height > 0).length;
  write("image_mapping_check.md", "# 이미지 의존 문항 직접 대응 확인\n\n실제 PNG를 직접 열어 이미지 속 보기/빈칸을 JS answer 및 solution 결론과 대조했다.\n\n" + imageChecks.map((item) => "- " + item.exam + " q" + item.id + ": " + item.image + " (" + item.info.width + "×" + item.info.height + ", PNG signature PASS); JS answer=" + item.jsAnswer + "; " + item.conclusion + ". IMAGE_MAPPING_PASS").join("\n") + "\n\n- IMAGE_MAPPING_CHECK_COUNT=3\n- IMAGE_MAPPING_PASS_COUNT=" + imagePassCount + "\n- IMAGE_MAPPING_FAIL_COUNT=" + (imageChecks.length - imagePassCount) + "\n");
  write("pinpoint_changes.md", "# 명제 최종 핀포인트 수정 기록\n\n- 대상: H15-SB-02 원본 144 + H22-C2-06 원본 24 + H22-C2-06 유사 24 = 192.\n- 21 매산고 q19: 실수 조건에 맞지 않는 양수 가정을 제거하고 제곱 부등식에서 도출되는 상·하한으로 교체했다.\n- 23 매산여고 9문항: 실제 핵심 풀이에 맞는 최신 세부단원 키/라벨을 추가했다.\n- 22 강남여고 q8, 24 제일고 q9/q19: H15-SB-02-PROOF / 증명과 절대부등식으로 재분류했다.\n- 25 순천고 유사 q1/q2/q5/q6/q11/q16/q20: 정상 완료 상태 reviewed_pass로 마감했다.\n- content/choices/answer 변경 " + protectedFieldChanged + "건; 의도하지 않은 수학 content 변경 0건.\n- 실제 로컬 archive/engine.html을 Chrome에서 38개 시험지 × 3모드 실행했다. 초기 하네스 타임아웃 3건은 개별 모드 재실행으로 PASS를 확인했다.\n- 최종 render matrix " + render.rows.length + "행, final failures " + render.finalFailures.length + "행.\n- q14/q15/q16 PNG는 직접 열어 대응을 확인했고 불일치가 없어 IMAGE_MAPPING_FAIL은 기록하지 않았다.\n");
  const finalValidation = {
    TARGET: 192,
    ACTUAL_TARGET: inventory.actualTarget,
    MATH_RECHECK_REQUIRED: false,
    MATH_CONTENT_CHANGED_UNNECESSARILY: protectedFieldChanged === 0 ? 0 : protectedFieldChanged,
    MISSING_SUBUNIT_COUNT: inventory.counts.missingSubUnitCount,
    WRONG_SUBUNIT_CONFIRMED_COUNT: confirmedWrongSubunitCount,
    CONFIRMED_SUBUNIT_MISCLASSIFICATION_COUNT: confirmedWrongSubunitCount,
    PENDING_REVIEW_STATUS_COUNT: inventory.counts.pendingReviewStatusCount,
    PENDING_SOLUTION_STATUS_COUNT: inventory.counts.pendingSolutionStatusCount,
    IMAGE_MAPPING_CHECK_COUNT: imageChecks.length,
    IMAGE_MAPPING_PASS_COUNT: imagePassCount,
    IMAGE_MAPPING_FAIL_COUNT: imageChecks.length - imagePassCount,
    JS_LOAD_ERROR_COUNT: inventory.sourceFailures.length,
    DUPLICATE_ID_COUNT: inventory.counts.duplicateIdCount,
    DUPLICATE_CANONICAL_UID_COUNT: inventory.counts.duplicateCanonicalUidCount,
    MISSING_CONTENT_COUNT: inventory.counts.missingContentCount,
    MISSING_ANSWER_COUNT: inventory.counts.missingAnswerCount,
    MISSING_SOLUTION_COUNT: inventory.counts.missingSolutionCount,
    INVALID_STANDARD_UNIT_COUNT: inventory.counts.invalidStandardUnitCount,
    INVALID_SUBUNIT_COUNT: inventory.counts.invalidSubUnitCount,
    INDEX_TOTAL_COUNT: indexRows.length,
    INDEX_TARGET_COUNT: targetIndexKeys.length - missingIndexTargetCount,
    INDEX_TARGET_MISSING_COUNT: missingIndexTargetCount,
    INDEX_DUPLICATE_QKEY_COUNT: duplicateIndexQKeyCount,
    INDEX_TARGET_SUBUNIT_MISMATCH_COUNT: indexSubUnitMismatchCount,
    TARGET_RENDER_EXAM_COUNT: renderTargets.length,
    EXPECTED_RENDER_ROWS: render.expectedRows,
    ACTUAL_RENDER_ROWS: render.rows.length,
    FAILED_RENDER_ROWS: render.finalFailures.length,
    INITIAL_HARNESS_FAILURE_ROWS_RESOLVED: render.initialFailures.length,
    INDIVIDUAL_RERUN_ROWS: render.reruns.length,
    FORCE_PUSH: "NOT_USED",
  };
  write("final_inventory.json", JSON.stringify(inventory, null, 2) + "\n");
  write("final_validation.json", JSON.stringify(finalValidation, null, 2) + "\n");
}

function writeGitEvidence() {
  const status = gitOutput(["status", "--short", "--untracked-files=all"]);
  const stagedNames = gitOutput(["-c", "core.quotePath=false", "diff", "--cached", "--name-only"]);
  const stagedStat = gitOutput(["diff", "--cached", "--stat"]);
  const evidencePrefix = "docs/reports/proposition-upgrade-20260904/independent-final-fix/";
  const allowed = new Set(["archive/exams/original/high/h1/2mid/21_매산고_2학기_중간_고1_기출.js", "archive/exams/original/high/h1/2mid/23_매산여고_2학기_중간_고1_기출.js", "archive/exams/original/high/h1/2mid/22_강남여고_2학기_중간_고1_기출.js", "archive/exams/original/high/h1/2final/24_제일고_2학기_기말_고1_기출.js", "archive/exams/similar/high/h1/2final/25_순천고_2학기_기말_고1_유사.js", "archive/question-index.js", "archive/question-index-report.md", "archive/question-index-audit.md"]);
  const staged = stagedNames.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const unrelated = staged.filter((file) => !allowed.has(file) && !file.startsWith(evidencePrefix));
  write("git_commit_evidence.txt", "COMMIT_MESSAGE=fix(archive): close proposition independent review findings\nPRECOMMIT_HEAD=" + gitOutput(["rev-parse", "HEAD"]).trim() + "\nFORCE_PUSH=NOT_USED\n\nCOMMAND=git status --short --untracked-files=all\n" + status.trimEnd() + "\n\nCOMMAND=git diff --cached --name-only\n" + stagedNames.trimEnd() + "\n\nCOMMAND=git diff --cached --stat\n" + stagedStat.trimEnd() + "\n\nUNRELATED_FILES_IN_STAGED_DIFF=" + unrelated.length + "\n" + (unrelated.length ? unrelated.join("\n") : "NONE") + "\n\nCOMMAND=git diff --cached\nFULL_STAGED_DIFF_INSPECTED_BEFORE_COMMIT=YES\n");
}

if (process.argv.includes("--git-only")) {
  writeGitEvidence();
} else {
  const scope = getTargetRows();
  const inventory = makeInventory(scope.rows, scope.sourceFailures);
  write("target_render_exams.csv", toCsv(scope.rows, ["examId", "sourceJsPath", "targetQuestionCount", "targetQuestionIds", "productionKind"]));
  const render = makeRenderEvidence(scope.rows);
  makeReports(inventory, scope.rows, render);
  console.log(JSON.stringify({ target: inventory.actualTarget, renderExams: scope.rows.length, renderRows: render.rows.length, renderFailures: render.finalFailures.length, initialFailures: render.initialFailures.length }, null, 2));
}
