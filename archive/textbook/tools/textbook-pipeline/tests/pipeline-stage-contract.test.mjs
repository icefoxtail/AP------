import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import stage10bScan from "../stages/10b-scan-broken-formula-strings.mjs";
import stage04bQuestionIdMappingGuard from "../stages/04b-question-id-mapping-guard.mjs";
import stage08cSourceInventory from "../stages/08c-source-inventory.mjs";
import stage08dAnswerSourceOcr from "../stages/08d-answer-source-ocr.mjs";
import stage10bContentChoices, { passesContentSuccessGate } from "../stages/10b-transcribe-content-choices.mjs";
import stage10cScan from "../stages/10c-scan-answer-string-risk.mjs";
import stage10cAnswerFill from "../stages/10c-answer-fill-and-verify.mjs";
import stage12Extract from "../stages/12-formula-repair-target-extract.mjs";
import stage12bGeminiPatch from "../stages/12b-gemini-formula-patch-dry-run.mjs";
import stage12dApply from "../stages/12d-apply-gemini-formula-patches.mjs";
import stage13ApplyCorrections from "../stages/13-apply-corrections.mjs";
import { buildInternalQuestionModel } from "../lib/internal-model-utils.mjs";
import { listArchiveJs } from "../lib/js-archive-utils.mjs";
import { normalizeAnswerGlyph, parseOcrAnswerRows, parseQuickAnswerText } from "../lib/answer-source-ocr-utils.mjs";

function makeTempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "textbook-pipeline-contract-"));
}

function writeArchiveJs(file, questions) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    `window.examTitle = "contract";\n\nwindow.questionBank = ${JSON.stringify(questions, null, 2)};\n`,
    "utf8",
  );
}

function latestJson(dir, prefix) {
  const files = fs.readdirSync(dir)
    .filter((name) => name.startsWith(prefix) && name.endsWith(".json"))
    .map((name) => path.join(dir, name));
  assert.ok(files.length > 0, `missing report prefix ${prefix}`);
  files.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return JSON.parse(fs.readFileSync(files[0], "utf8"));
}

test("10B-SCAN reads content and choices only and reports formula/image risks", async () => {
  const root = makeTempRoot();
  const jsDir = path.join(root, "js");
  const reportsDir = path.join(root, "reports");
  writeArchiveJs(path.join(jsDir, "unit_a.js"), [
    {
      id: 1,
      content: "다음 nCr, nPr, x^2, ², ³, ₙ, ᵣ, @, # 및 <img src=\"p001.png\">를 확인하시오.",
      choices: ["x^2", "정상"],
      answer: "nCr x^2 @ #",
      solution: "nPr x^2 @ #",
    },
  ]);

  const result = await stage10bScan({
    bookId: "contract",
    jsDir,
    reportsDir,
  });

  assert.equal(result.status, "ok");
  const report = latestJson(reportsDir, "broken_formula_string_scan__contract__");
  const combined = report.items.flatMap((item) => item.riskTypes);
  assert.ok(combined.includes("combination_plain_notation"));
  assert.ok(combined.includes("permutation_plain_notation"));
  assert.ok(combined.includes("bare_exponent"));
  assert.ok(combined.includes("unicode_script_notation"));
  assert.ok(combined.includes("broken_ocr_character"));
  assert.ok(combined.includes("content_img_tag"));
  assert.ok(combined.includes("image_only_content_path"));
  assert.ok(report.items.every((item) => item.field === "content" || item.field.startsWith("choices[")));
  assert.ok(!JSON.stringify(report).includes("solution"));
  assert.ok(!JSON.stringify(report).includes("answer:"));
});

test("10C-SCAN reads answer only and reports answer candidate mismatches", async () => {
  const root = makeTempRoot();
  const jsDir = path.join(root, "js");
  const reportsDir = path.join(root, "reports");
  writeArchiveJs(path.join(jsDir, "unit_b.js"), [
    {
      id: 7,
      displayNo: "0007",
      content: "x^2 @ #",
      choices: ["nCr"],
      answer: "nPr x^2 @ #",
      solution: "do not read",
    },
  ]);
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportsDir, "answer_mismatch_report.json"),
    JSON.stringify({ items: [{ setKey: "unit_b", id: 7, displayNo: "0007", status: "mismatch" }] }, null, 2),
    "utf8",
  );

  await stage10cScan({
    bookId: "contract",
    jsDir,
    reportsDir,
  });

  const report = latestJson(reportsDir, "answer_string_risk_scan__contract__");
  const riskTypes = report.items.flatMap((item) => item.riskTypes);
  assert.ok(riskTypes.includes("permutation_plain_notation"));
  assert.ok(riskTypes.includes("bare_exponent"));
  assert.ok(riskTypes.includes("broken_ocr_character"));
  assert.ok(riskTypes.includes("answer_candidate_mismatch"));
  assert.ok(report.items.every((item) => item.field === "answer"));
  assert.ok(!JSON.stringify(report).includes("do not read"));
});

test("one-click runner follows v1 stage contract without 10D direct Gemini transcription", () => {
  const runner = fs.readFileSync(
    path.resolve("archive/textbook/tools/textbook-pipeline/run-oneclick-pipeline.mjs"),
    "utf8",
  );
  const names = [...runner.matchAll(/\["([^"]+)",\s*"([^"]+)"/g)].map((match) => match[1]);
  assert.ok(names.includes("10B-SCAN"));
  assert.ok(names.includes("10C-SCAN"));
  assert.ok(names.includes("08C"));
  assert.ok(names.includes("08D"));
  assert.ok(names.includes("12D"));
  assert.ok(names.includes("14"));
  assert.equal(names.includes("10D"), false);
  assert.ok(names.includes("04B"));
  assert.ok(names.indexOf("06C") < names.indexOf("10B"));
  assert.ok(names.indexOf("04B") > names.indexOf("06"));
  assert.ok(names.indexOf("04B") < names.indexOf("09"));
  assert.ok(names.indexOf("08B") < names.indexOf("08C"));
  assert.ok(names.indexOf("08C") < names.indexOf("09"));
  assert.ok(names.indexOf("08C") < names.indexOf("08D"));
  assert.ok(names.indexOf("08D") < names.indexOf("09"));
  assert.ok(names.indexOf("10B") < names.indexOf("10B-SCAN"));
  assert.ok(names.indexOf("10B-SCAN") < names.indexOf("10B-FAIL"));
  assert.ok(names.indexOf("10B-FAIL") < names.indexOf("10C"));
  assert.ok(names.indexOf("10C") < names.indexOf("10C-SCAN"));
  assert.ok(names.indexOf("12B") < names.indexOf("12D"));
  assert.ok(names.indexOf("12D") < names.indexOf("12C"));
});

test("queue readiness does not require generated/work/question_crops", () => {
  const runner = fs.readFileSync(
    path.resolve("archive/textbook/tools/textbook-pipeline/run-textbook-queue.mjs"),
    "utf8",
  );
  assert.match(runner, /const questionCropReady = hasAnyFile/);
  assert.doesNotMatch(runner, /jsFiles\.length && pageCropReady && questionCropReady \?/);
  assert.doesNotMatch(runner, /if \(!questionCropReady\) missing\.push\("question_crop"\)/);
});

test("queue can reselect not_ready books after readiness inputs appear", () => {
  const runner = fs.readFileSync(
    path.resolve("archive/textbook/tools/textbook-pipeline/run-textbook-queue.mjs"),
    "utf8",
  );
  assert.match(runner, /function isTerminalForSelection/);
  assert.match(runner, /state\.status === "not_ready"/);
  assert.match(runner, /readinessCheck\(book\)\.status === "not_ready"/);
  assert.doesNotMatch(runner, /if \(terminalStatuses\.has\(state\.status\)\) return false;/);
});

test("09 internal model prefers fresh_js_input_manifest before legacy crop maps", async () => {
  const root = makeTempRoot();
  const jsDir = path.join(root, "js");
  const reportsDir = path.join(root, "reports");
  const internalDir = path.join(root, "internal");
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.mkdirSync(internalDir, { recursive: true });

  writeArchiveJs(path.join(jsDir, "unit_manifest.js"), [
    { id: 1001, displayNo: "0007", content: "", choices: [], answer: "", solution: "" },
  ]);

  fs.writeFileSync(
    path.join(reportsDir, "fresh_js_input_manifest.json"),
    JSON.stringify({
      items: [{
        setKey: "unit_manifest",
        globalId: 1001,
        sourceDisplayNo: "0007",
        displayNo: "0007",
        pageNo: 77,
        cropPath: "fresh/crop.png",
        bboxSlotNo: 3,
      }],
    }, null, 2),
    "utf8",
  );

  fs.writeFileSync(
    path.join(reportsDir, "question_crop_map.json"),
    JSON.stringify({
      items: [{
        setKey: "unit_manifest",
        globalId: 1001,
        sourceDisplayNo: "9999",
        displayNo: "9999",
        pageNo: 999,
        cropPath: "legacy/wrong.png",
        bboxSlotNo: 99,
      }],
    }, null, 2),
    "utf8",
  );

  const model = await buildInternalQuestionModel({
    workspaceRoot: root,
    jsDir,
    reportsDir,
    internalDir,
  });

  assert.equal(model.questionCount, 1);
  assert.equal(model.questions[0].internal.sourceDisplayNo, "0007");
  assert.equal(model.questions[0].internal.sourcePageNo, 77);
  assert.equal(model.questions[0].internal.sourceCropPath, "fresh/crop.png");
  assert.equal(model.questions[0].internal.bboxSlotNo, 3);
});

test("04B never promotes OCR id or bboxSlotNo to JS/display identity", async () => {
  const root = makeTempRoot();
  const reportsDir = path.join(root, "reports");
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportsDir, "question_crop_map.json"),
    JSON.stringify({
      items: [
        { setKey: "unit_guard", id: 77, jsIdCandidate: 77, bboxSlotNo: 3, pageNo: 10, cropPath: "crop.png" },
        { setKey: "unit_guard", sourceDisplayNo: "0005", sourceDisplayNoConfirmed: true, bboxSlotNo: 9, globalId: "g5", pageNo: 10, cropPath: "ok.png" },
      ],
    }, null, 2),
    "utf8",
  );

  const result = await stage04bQuestionIdMappingGuard({
    bookId: "contract",
    reportsDir,
  });

  assert.equal(result.acceptedCount, 1);
  const manifest = JSON.parse(fs.readFileSync(path.join(reportsDir, "fresh_js_input_manifest.json"), "utf8"));
  assert.equal(manifest.items[0].sourceDisplayNo, "0005");
  assert.notEqual(manifest.items[0].sourceDisplayNo, "9");
  assert.notEqual(manifest.items[0].globalId, 77);
  const review = JSON.parse(fs.readFileSync(path.join(reportsDir, "question_id_mapping_review.json"), "utf8"));
  assert.equal(review.items[0].reason, "ocr_unreadable");
});

test("10B production uses manifest mapping only and rejects broken OCR success", async () => {
  assert.equal(passesContentSuccessGate("?? 깨짐"), false);
  assert.equal(passesContentSuccessGate("聽 Û"), false);

  const root = makeTempRoot();
  const jsDir = path.join(root, "archive", "textbook", "book", "generated", "js");
  const reportsDir = path.join(root, "archive", "textbook", "book", "generated", "reports");
  const generatedRoot = path.join(root, "archive", "textbook", "book", "generated");
  writeArchiveJs(path.join(jsDir, "unit_prod.js"), [
    { id: 1, displayNo: "0001", content: "", choices: [], answer: "", solution: "" },
  ]);
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportsDir, "fresh_js_input_manifest.json"),
    JSON.stringify({ items: [{ setKey: "unit_prod", globalId: 999, sourceDisplayNo: "9999", pageNo: 9, fullPageImage: "page.png" }] }, null, 2),
    "utf8",
  );
  fs.writeFileSync(
    path.join(reportsDir, "question_crop_map.json"),
    JSON.stringify({ items: [{ setKey: "unit_prod", globalId: 1, sourceDisplayNo: "0001", pageNo: 1, fullPageImage: "legacy.png" }] }, null, 2),
    "utf8",
  );
  fs.writeFileSync(
    path.join(reportsDir, "content_choices_input_report.json"),
    JSON.stringify({ items: [{ setKey: "unit_prod", id: 1, displayNo: "0001", content: "읽히는 문항", choices: ["1", "2"], sourceImage: "page.png" }] }, null, 2),
    "utf8",
  );

  const result = await stage10bContentChoices({
    mode: "production",
    jsDir,
    reportsDir,
    generatedRoot,
    draftContentDir: path.join(generatedRoot, "draft_content"),
    workspaceRoot: root,
    pipelineDir: path.resolve("archive/textbook/tools/textbook-pipeline"),
    contentChoicesInputMode: "apply_unambiguous",
  });

  assert.equal(result.appliedContentCount, 0);
  const code = fs.readFileSync(path.join(jsDir, "unit_prod.js"), "utf8");
  assert.ok(code.includes('"content": ""'));
});

test("08C source inventory finds full page/question crop/answer and solution sources", async () => {
  const root = makeTempRoot();
  const generatedRoot = path.join(root, "generated");
  const jsDir = path.join(generatedRoot, "js");
  const reportsDir = path.join(generatedRoot, "reports");
  const materialRoot = path.join(root, "material");
  writeArchiveJs(path.join(jsDir, "unit_source.js"), [
    { id: 1, displayNo: "0001", content: "", choices: [], answer: "", solution: "" },
  ]);
  fs.mkdirSync(path.join(generatedRoot, "review_pack", "page_full_images"), { recursive: true });
  fs.mkdirSync(path.join(generatedRoot, "review_pack", "question_crop_images"), { recursive: true });
  fs.mkdirSync(materialRoot, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(generatedRoot, "review_pack", "page_full_images", "p001.png"), "");
  fs.writeFileSync(path.join(generatedRoot, "review_pack", "question_crop_images", "q0001.png"), "");
  fs.writeFileSync(path.join(materialRoot, "book_빠른정답.pdf"), "");
  fs.writeFileSync(path.join(materialRoot, "book_정답.pdf"), "");
  fs.writeFileSync(path.join(materialRoot, "book_해설.pdf"), "");
  fs.writeFileSync(path.join(reportsDir, "answer_solution_crop_report.json"), JSON.stringify({ items: [] }), "utf8");
  fs.writeFileSync(path.join(reportsDir, "quick_answer_table_report.json"), JSON.stringify({ items: [] }), "utf8");
  fs.writeFileSync(path.join(reportsDir, "answer_candidate_page_crop_report.json"), JSON.stringify({ items: [] }), "utf8");
  fs.writeFileSync(
    path.join(reportsDir, "fresh_js_input_manifest.json"),
    JSON.stringify({ items: [{ setKey: "unit_source", globalId: 1, sourceDisplayNo: "0001", pageNo: 1, fullPageImage: path.join(generatedRoot, "review_pack", "page_full_images", "p001.png"), cropPath: path.join(generatedRoot, "review_pack", "question_crop_images", "q0001.png") }] }),
    "utf8",
  );

  const result = await stage08cSourceInventory({ workspaceRoot: root, materialRoot, generatedRoot, jsDir, reportsDir });

  assert.equal(result.fullPageCropCount, 1);
  assert.equal(result.questionCropCount, 1);
  assert.equal(result.quickAnswerSourceCount, 2);
  assert.equal(result.answerPdfSourceCount, 1);
  assert.equal(result.solutionPdfSourceCount, 1);
  assert.equal(result.answerSolutionCropCount, 1);
  const questionReport = JSON.parse(fs.readFileSync(path.join(reportsDir, "question_source_crosscheck_report.json"), "utf8"));
  assert.equal(questionReport.crosscheckedCount, 1);
});

test("08D parses quick answer text and OCR answer table rows", () => {
  const quick = parseQuickAnswerText("0001 2\n0002 \u2463\n0003 \u0401\u043a", "quick_answer_pdf");
  assert.deepEqual(quick.map((item) => item.answer), ["2", "\u2463", "\u2463"]);
  assert.equal(normalizeAnswerGlyph("\u0401\u0437"), "\u2460");

  const rows = parseOcrAnswerRows({
    page: 3,
    rows: [
      { text: "0007", x: 10, y: 40, w: 34, h: 10 },
      { text: "\u2462", x: 70, y: 42, w: 10, h: 10 },
      { text: "noise", x: 200, y: 42, w: 30, h: 10 },
    ],
  }, "answer_pdf_ocr");
  assert.equal(rows.length, 1);
  assert.equal(rows[0].displayNo, "0007");
  assert.equal(rows[0].answer, "\u2462");
  assert.equal(rows[0].extraction_method, "pymupdf_render_rapidocr");
});

test("08D writes pypdf zero / RapidOCR fallback report from inventory PDFs", async () => {
  const root = makeTempRoot();
  const generatedRoot = path.join(root, "generated");
  const jsDir = path.join(generatedRoot, "js");
  const reportsDir = path.join(generatedRoot, "reports");
  const workDir = path.join(generatedRoot, "work");
  const materialRoot = path.join(root, "material");
  writeArchiveJs(path.join(jsDir, "unit_ocr.js"), []);
  fs.mkdirSync(materialRoot, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(materialRoot, "book_answer.pdf"), "");

  const fakePython = path.join(root, "fake-python.js");
  fs.writeFileSync(fakePython, [
    "const fs = require('fs');",
    "const outDir = process.argv[3];",
    "fs.mkdirSync(outDir, { recursive: true });",
    "const page = { page: 1, rows: [{ text: '0005', x: 10, y: 10, w: 30, h: 8 }, { text: '3', x: 60, y: 10, w: 10, h: 8 }] };",
    "const pageJson = require('path').join(outDir, 'p001.json');",
    "fs.writeFileSync(pageJson, JSON.stringify(page));",
    "console.log(JSON.stringify({ text: '', textCharCount: 0, pypdfStatus: 'ok', rapidocrStatus: 'ok', pages: [{ page: 1, image: require('path').join(outDir, 'p001.png'), json: pageJson, rowCount: 2 }] }));",
  ].join("\n"), "utf8");

  const result = await stage08dAnswerSourceOcr({
    bookId: "book",
    workspaceRoot: root,
    materialRoot,
    generatedRoot,
    jsDir,
    reportsDir,
    workDir,
    pythonPath: process.execPath,
    answerSourceOcrExtractorScript: fakePython,
  });

  assert.equal(result.pypdfZeroFallbackCount, 1);
  assert.equal(result.itemCount, 1);
  const report = JSON.parse(fs.readFileSync(path.join(reportsDir, "answer_source_ocr_report.json"), "utf8"));
  assert.equal(report.items[0].displayNo, "0005");
  assert.equal(report.items[0].answer, "3");
});

test("10C quick answer applies only after full page/question crop crosscheck", async () => {
  const root = makeTempRoot();
  const generatedRoot = path.join(root, "generated");
  const jsDir = path.join(generatedRoot, "js");
  const reportsDir = path.join(generatedRoot, "reports");
  const page = path.join(generatedRoot, "review_pack", "page_full_images", "p001.png");
  const crop = path.join(generatedRoot, "review_pack", "question_crop_images", "q0004.png");
  writeArchiveJs(path.join(jsDir, "unit_quick.js"), [
    { id: 4, displayNo: "0004", content: "keep", choices: ["a"], answer: "", solution: "" },
  ]);
  fs.mkdirSync(path.dirname(page), { recursive: true });
  fs.mkdirSync(path.dirname(crop), { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(page, "");
  fs.writeFileSync(crop, "");
  fs.writeFileSync(
    path.join(reportsDir, "fresh_js_input_manifest.json"),
    JSON.stringify({ items: [{ setKey: "unit_quick", globalId: 4, sourceDisplayNo: "0004", pageNo: 1, fullPageImage: page, cropPath: crop }] }, null, 2),
    "utf8",
  );
  fs.writeFileSync(
    path.join(reportsDir, "quick_answer_table_report.json"),
    JSON.stringify({ items: [{ setKey: "unit_quick", id: 4, displayNo: "0004", answer: "2", source: "quick_answer_table_report" }] }, null, 2),
    "utf8",
  );

  const result = await stage10cAnswerFill({
    workspaceRoot: root,
    jsDir,
    reportsDir,
    generatedRoot,
    answerFillMode: "apply_unambiguous",
  });

  assert.equal(result.appliedCount, 1);
  assert.equal(result.answerSourceCrosscheckedCount, 1);
  const code = fs.readFileSync(path.join(jsDir, "unit_quick.js"), "utf8");
  assert.ok(code.includes('"answer": "2"'));
  const crosscheck = JSON.parse(fs.readFileSync(path.join(reportsDir, "answer_source_crosscheck_report.json"), "utf8"));
  assert.equal(crosscheck.items[0].source_type, "quick_answer");
});

test("10C does not apply displayNo-only answer evidence without source crosscheck", async () => {
  const root = makeTempRoot();
  const generatedRoot = path.join(root, "generated");
  const jsDir = path.join(generatedRoot, "js");
  const reportsDir = path.join(generatedRoot, "reports");
  writeArchiveJs(path.join(jsDir, "unit_display_only.js"), [
    { id: 4, displayNo: "0004", content: "keep", choices: ["a"], answer: "", solution: "" },
  ]);
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportsDir, "quick_answer_table_report.json"),
    JSON.stringify({ items: [{ setKey: "unit_display_only", displayNo: "0004", answer: "2" }] }, null, 2),
    "utf8",
  );

  const result = await stage10cAnswerFill({ workspaceRoot: root, jsDir, reportsDir, generatedRoot, answerFillMode: "apply_unambiguous" });

  assert.equal(result.appliedCount, 0);
  assert.ok(fs.readFileSync(path.join(jsDir, "unit_display_only.js"), "utf8").includes('"answer": ""'));
  const remaining = JSON.parse(fs.readFileSync(path.join(reportsDir, "remaining_manual_review_after_full_source_search.json"), "utf8"));
  assert.equal(remaining.allowedReasonsOnly, true);
  assert.equal(Object.keys(remaining.remaining_by_precise_reason).includes("answer_source_missing"), false);
});

test("10C keeps direct solve as last resort after full source search", async () => {
  const root = makeTempRoot();
  const jsDir = path.join(root, "archive", "textbook", "book", "generated", "js");
  const reportsDir = path.join(root, "archive", "textbook", "book", "generated", "reports");
  const generatedRoot = path.join(root, "archive", "textbook", "book", "generated");
  const jsFile = path.join(jsDir, "unit_solve.js");
  const original = { id: 8, displayNo: "0008", setKey: "keep", metadata: { a: 1 }, content: "1+1", choices: ["1", "2", "3"], answer: "", solution: "keep solution" };
  writeArchiveJs(jsFile, [original]);
  fs.mkdirSync(reportsDir, { recursive: true });

  const result = await stage10cAnswerFill({
    jsDir,
    reportsDir,
    generatedRoot,
    answerFillMode: "apply_unambiguous",
    solveFromJsQuestionFallback: true,
    allowDirectSolveAfterSourceSearch: true,
  });

  assert.equal(result.fallbackAppliedCount, 1);
  const parsed = /window\.questionBank = ([\s\S]*?);\s*$/.exec(fs.readFileSync(jsFile, "utf8"));
  const q = JSON.parse(parsed[1])[0];
  assert.equal(q.answer, "2");
  assert.equal(q.content, original.content);
  assert.deepEqual(q.choices, original.choices);
  assert.equal(q.solution, original.solution);
  assert.deepEqual(q.metadata, original.metadata);
});

test("10C records solution PDF and answer_solution_crop fallback sources in inventory", async () => {
  const root = makeTempRoot();
  const generatedRoot = path.join(root, "generated");
  const jsDir = path.join(generatedRoot, "js");
  const reportsDir = path.join(generatedRoot, "reports");
  const materialRoot = path.join(root, "material");
  writeArchiveJs(path.join(jsDir, "unit_solution.js"), [
    { id: 1, displayNo: "0001", content: "", choices: [], answer: "", solution: "" },
  ]);
  fs.mkdirSync(materialRoot, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(materialRoot, "book_해설.pdf"), "");
  fs.writeFileSync(path.join(reportsDir, "answer_solution_crop_report.json"), JSON.stringify({ items: [] }), "utf8");

  await stage10cAnswerFill({ workspaceRoot: root, materialRoot, generatedRoot, jsDir, reportsDir });

  const report = JSON.parse(fs.readFileSync(path.join(reportsDir, "answer_source_crosscheck_report.json"), "utf8"));
  assert.equal(report.inventorySummary.solutionPdfSourceCount, 1);
  assert.equal(report.inventorySummary.answerSolutionCropCount, 1);
  assert.ok(report.sourcePriority.indexOf("direct_solve") > report.sourcePriority.indexOf("answer_solution_crop"));
});

test("12D uses replacement-safe formula patching when replacement contains dollars", async () => {
  const root = makeTempRoot();
  const jsDir = path.join(root, "archive", "textbook", "book", "generated", "js");
  const reportsDir = path.join(root, "archive", "textbook", "book", "generated", "reports");
  const generatedRoot = path.join(root, "archive", "textbook", "book", "generated");
  const jsFile = path.join(jsDir, "unit_formula.js");
  writeArchiveJs(jsFile, [{ id: 1, content: "$nCr$", choices: [], answer: "", solution: "" }]);
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportsDir, "formula_correction_patch__contract__20260524.json"),
    JSON.stringify({ patches: [{ id: "1", setKey: "unit_formula", field: "content", targetText: "$nCr$", replacementText: "$${}_{n}C_{r}$", confidence: "high", needsReview: false }] }, null, 2),
    "utf8",
  );

  await stage12dApply({
    bookId: "contract",
    jsDir,
    reportsDir,
    generatedRoot,
    makeGeminiFormulaPatchAutoApply: true,
  });

  assert.ok(fs.readFileSync(jsFile, "utf8").includes('"content": "$${}_{n}C_{r}$"'));
});

test("operational JS scope excludes backup/review/final/draft/report roots", async () => {
  const root = makeTempRoot();
  const generated = path.join(root, "archive", "textbook", "book", "generated");
  writeArchiveJs(path.join(generated, "js", "unit_ok.js"), []);
  writeArchiveJs(path.join(generated, "backup", "js", "unit_backup.js"), []);
  writeArchiveJs(path.join(generated, "review_pack", "js", "unit_review.js"), []);
  writeArchiveJs(path.join(generated, "final_clean", "js", "unit_final.js"), []);
  writeArchiveJs(path.join(generated, "draft_content", "js", "unit_draft.js"), []);
  writeArchiveJs(path.join(root, "archive", "textbook", "generated", "js", "root_bad.js"), []);

  const files = await listArchiveJs(path.join(generated, "js"));
  assert.deepEqual(files.map((file) => path.basename(file)), ["unit_ok.js"]);
});

test("12 target extract reads 10B-SCAN and 10C-SCAN reports without creating replacements", async () => {
  const root = makeTempRoot();
  const reportsDir = path.join(root, "reports");
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportsDir, "broken_formula_string_scan__contract__20260524.json"),
    JSON.stringify({
      items: [{
        id: "1",
        setKey: "unit_c",
        field: "content",
        currentText: "nCr",
        sourceImage: path.join(root, "p001.png"),
        riskTypes: ["combination_plain_notation"],
        needsFormulaRepairTarget: true,
      }],
    }, null, 2),
    "utf8",
  );
  fs.writeFileSync(
    path.join(reportsDir, "answer_string_risk_scan__contract__20260524.json"),
    JSON.stringify({
      items: [{
        id: "2",
        setKey: "unit_c",
        field: "answer",
        currentAnswer: "nPr",
        answerSourceImage: path.join(root, "a001.png"),
        riskTypes: ["permutation_plain_notation"],
        needsFormulaRepairTarget: true,
        requiresAnswerSource: true,
      }],
    }, null, 2),
    "utf8",
  );

  await stage12Extract({ bookId: "contract", reportsDir });

  const report = latestJson(reportsDir, "formula_repair_targets__contract__");
  assert.equal(report.summary.targetCount, 2);
  assert.ok(report.loadedInputs.some((item) => item.file === "broken_formula_string_scan.json"));
  assert.ok(report.loadedInputs.some((item) => item.file === "answer_string_risk_scan.json"));
  assert.ok(report.targets.some((item) => item.field === "content"));
  assert.ok(report.targets.some((item) => item.field === "answer" && item.requiresAnswerSource === true));
  assert.ok(report.targets.every((item) => !("replacementText" in item)));
});

test("12D skips unless makeGeminiFormulaPatchAutoApply is true and leaves JS unchanged", async () => {
  const root = makeTempRoot();
  const jsDir = path.join(root, "js");
  const reportsDir = path.join(root, "reports");
  const generatedRoot = path.join(root, "generated");
  const jsFile = path.join(jsDir, "unit_d.js");
  writeArchiveJs(jsFile, [{ id: 1, content: "nCr", choices: [], answer: "", solution: "" }]);
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportsDir, "formula_correction_patch__contract__20260524.json"),
    JSON.stringify({
      patches: [{
        id: "1",
        setKey: "unit_d",
        field: "content",
        targetText: "nCr",
        replacementText: "${}_{n}C_{r}$",
        confidence: "high",
        needsReview: false,
      }],
    }, null, 2),
    "utf8",
  );
  const before = fs.readFileSync(jsFile, "utf8");

  const result = await stage12dApply({
    bookId: "contract",
    jsDir,
    reportsDir,
    generatedRoot,
    makeGeminiFormulaPatchAutoApply: false,
  });

  assert.equal(result.skipped, true);
  assert.equal(fs.readFileSync(jsFile, "utf8"), before);
  const report = latestJson(reportsDir, "formula_patch_apply_report__contract__");
  assert.equal(report.skipped, true);
});

test("12B writes skipped report when GEMINI_API_KEY is missing and never edits JS", async () => {
  const root = makeTempRoot();
  const reportsDir = path.join(root, "reports");
  const targetFile = path.join(reportsDir, "formula_repair_targets__contract__20260524.json");
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(
    targetFile,
    JSON.stringify({
      targets: [{
        id: "1",
        setKey: "unit_e",
        field: "content",
        currentText: "nCr",
        sourceImage: path.join(root, "p001.png"),
        needsGemini: true,
      }],
    }, null, 2),
    "utf8",
  );
  const oldKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    const result = await stage12bGeminiPatch({
      bookId: "contract",
      reportsDir,
      formulaRepairOutDir: reportsDir,
      formulaRepairTargetsFile: targetFile,
    });
    assert.equal(result.status, "ok");
    assert.equal(result.apiStatus, "skipped");
    const report = latestJson(reportsDir, "formula_api_skipped_report__contract__");
    assert.equal(report.errorType, "api_skipped_no_key");
  } finally {
    if (oldKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = oldKey;
  }
});

test("13 can apply confirmed content choices to JS but never applies solution", async () => {
  const root = makeTempRoot();
  const jsDir = path.join(root, "js");
  const reportsDir = path.join(root, "reports");
  const inputResultsDir = path.join(root, "input_results");
  const generatedRoot = path.join(root, "generated");
  const draftContentDir = path.join(root, "draft_content");
  const jsFile = path.join(jsDir, "unit_f.js");
  writeArchiveJs(jsFile, [{ id: 3, content: "", choices: [], answer: "", solution: "" }]);
  fs.mkdirSync(inputResultsDir, { recursive: true });
  fs.writeFileSync(
    path.join(inputResultsDir, "unit_f_correction_result.json"),
    JSON.stringify({
      items: [{
        setKey: "unit_f",
        id: 3,
        correction: {
          status: "confirmed",
          content: "확인된 발문",
          choices: ["1", "2"],
          solution: "must not apply",
        },
      }],
    }, null, 2),
    "utf8",
  );

  const result = await stage13ApplyCorrections({
    jsDir,
    reportsDir,
    inputResultsDir,
    generatedRoot,
    draftContentDir,
    applyCorrectionsToJs: true,
  });

  assert.equal(result.appliedCount, 2);
  const code = fs.readFileSync(jsFile, "utf8");
  assert.ok(code.includes("확인된 발문"));
  assert.ok(!code.includes("must not apply"));
});

test("10C apply_unambiguous writes only answer from unique evidence", async () => {
  const root = makeTempRoot();
  const jsDir = path.join(root, "js");
  const reportsDir = path.join(root, "reports");
  const generatedRoot = path.join(root, "generated");
  const jsFile = path.join(jsDir, "unit_g.js");
  const page = path.join(generatedRoot, "review_pack", "page_full_images", "p001.png");
  const crop = path.join(generatedRoot, "review_pack", "question_crop_images", "q0004.png");
  writeArchiveJs(jsFile, [{ id: 4, displayNo: "0004", content: "keep", choices: ["a"], answer: "", solution: "" }]);
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.mkdirSync(path.dirname(page), { recursive: true });
  fs.mkdirSync(path.dirname(crop), { recursive: true });
  fs.writeFileSync(page, "");
  fs.writeFileSync(crop, "");
  fs.writeFileSync(
    path.join(reportsDir, "fresh_js_input_manifest.json"),
    JSON.stringify({ items: [{ setKey: "unit_g", globalId: 4, sourceDisplayNo: "0004", pageNo: 1, fullPageImage: page, cropPath: crop }] }, null, 2),
    "utf8",
  );
  fs.writeFileSync(
    path.join(reportsDir, "quick_answer_table_report.json"),
    JSON.stringify({ items: [{ setKey: "unit_g", id: 4, displayNo: "0004", answer: "2" }] }, null, 2),
    "utf8",
  );

  const result = await stage10cAnswerFill({
    workspaceRoot: root,
    jsDir,
    reportsDir,
    generatedRoot,
    answerFillMode: "apply_unambiguous",
  });

  assert.equal(result.appliedCount, 1);
  const code = fs.readFileSync(jsFile, "utf8");
  assert.ok(code.includes('"content": "keep"'));
  assert.ok(code.includes('"answer": "2"'));
  assert.ok(code.includes('"solution": ""'));
});
