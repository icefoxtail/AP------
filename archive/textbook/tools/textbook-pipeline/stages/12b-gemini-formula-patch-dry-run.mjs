import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) args[key] = true;
    else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", "");
}

function safeName(value) {
  return String(value || "book").replace(/[\\/:*?"<>|]/g, "_");
}

async function writeJson(file, value) {
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await fs.promises.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function readJson(file) {
  return JSON.parse((await fs.promises.readFile(file, "utf8")).replace(/^\uFEFF/, ""));
}

async function findLatestTargetsFile(outDir, bookId) {
  let entries = [];
  try {
    entries = await fs.promises.readdir(outDir, { withFileTypes: true });
  } catch {
    return "";
  }
  const safeBook = safeName(bookId);
  const candidates = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".json")) continue;
    if (!entry.name.startsWith(`formula_repair_targets__${safeBook}__`)) continue;
    if (entry.name.includes("_summary__")) continue;
    const full = path.join(outDir, entry.name);
    const stat = await fs.promises.stat(full);
    candidates.push({ file: full, mtimeMs: stat.mtimeMs });
  }
  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return candidates[0]?.file || "";
}

function mimeType(file) {
  const ext = path.extname(file).toLowerCase();
  if ([".jpg", ".jpeg"].includes(ext)) return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "image/png";
}

function resolveImagePath(imagePath, inputFile, outDir, cfg = {}) {
  if (!imagePath) return "";
  const withoutGeneratedPrefix = String(imagePath).replace(/^generated[\\/]/, "");
  const candidates = [
    path.resolve(imagePath),
    cfg.generatedRoot ? path.resolve(cfg.generatedRoot, withoutGeneratedPrefix) : "",
    cfg.materialRoot ? path.resolve(cfg.materialRoot, imagePath) : "",
    cfg.workspaceRoot && cfg.materialRoot ? path.resolve(cfg.workspaceRoot, path.relative(cfg.workspaceRoot, cfg.materialRoot), imagePath) : "",
    path.resolve(path.dirname(inputFile), imagePath),
    path.resolve(path.dirname(path.dirname(inputFile)), imagePath),
    path.resolve(outDir, imagePath),
    path.resolve(process.cwd(), imagePath),
  ];
  for (const candidate of candidates.filter(Boolean)) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return candidates.find(Boolean) || "";
}

function extractJson(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1].trim() : trimmed;
  try {
    return JSON.parse(body);
  } catch {
    const first = body.indexOf("{");
    const last = body.lastIndexOf("}");
    if (first >= 0 && last > first) return JSON.parse(body.slice(first, last + 1));
    throw new Error("Gemini response did not contain parseable JSON.");
  }
}

const allowedFields = new Set(["content", "choices[0]", "choices[1]", "choices[2]", "choices[3]", "choices[4]", "answer"]);

function validatePatch(rawPatch, target) {
  const patch = {
    id: String(rawPatch?.id || target.id || ""),
    setKey: String(rawPatch?.setKey || target.setKey || ""),
    field: String(rawPatch?.field || target.field || ""),
    targetText: String(rawPatch?.targetText || ""),
    replacementText: String(rawPatch?.replacementText || ""),
    rulebookNotation: rawPatch?.rulebookNotation === true,
    evidence: rawPatch?.evidence && typeof rawPatch.evidence === "object" ? rawPatch.evidence : { imagePath: target.sourceImage || target.questionCrop || "" },
    confidence: String(rawPatch?.confidence || "low"),
    needsReview: rawPatch?.needsReview !== false,
    reviewReason: String(rawPatch?.reviewReason || ""),
  };
  const errors = [];
  if (!patch.id) errors.push("id_missing");
  if (!allowedFields.has(patch.field)) errors.push("field_not_allowed");
  if (!patch.targetText) errors.push("targetText_missing");
  if (!patch.replacementText) errors.push("replacementText_missing");
  if (!["high", "medium", "low"].includes(patch.confidence)) errors.push("confidence_invalid");
  return { patch, valid: errors.length === 0, errors };
}

function makePrompt({ target, rulebookExcerpt }) {
  return [
    "You are not a sentence writer. You are a JS archive first-pass correction patch generator.",
    "Follow JS_ARCHIVE_FORMULA_RULEBOOK.md only.",
    "Judge only the explicit target field: content, choices[index], or answer.",
    "Do not change Korean prose, spacing, particles, choice order, ids, sourceQuestionNo, or solution.",
    "Do not infer content or choices from answer or solution.",
    "For answer targets, use answer crop or answer-table evidence only.",
    "If the image does not clearly prove the correction, return needsReview=true.",
    "Output JSON only following FORMULA_CORRECTION_PATCH_SCHEMA.",
    "Return targetText -> replacementText first-pass patches only. Do not rewrite the full content, choice sentence, or answer structure.",
    "",
    "Rulebook excerpt:",
    rulebookExcerpt,
    "",
    "Target:",
    JSON.stringify(target, null, 2),
    "",
    "Required JSON shape:",
    JSON.stringify({
      schemaVersion: "apmath.formulaCorrectionPatch.v1",
      bookId: "",
      source: { mode: "page_full_image", imagePath: "" },
      patches: [{ id: "", setKey: "", field: "content", targetText: "", replacementText: "", rulebookNotation: true, evidence: { imagePath: "", visibleToken: "" }, confidence: "high", needsReview: false, reviewReason: "" }],
    }, null, 2),
  ].join("\n");
}

async function callGemini({ apiKey, model, prompt, imageFile }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const data = await fs.promises.readFile(imageFile);
  const body = {
    contents: [{
      role: "user",
      parts: [
        { text: prompt },
        { inlineData: { mimeType: mimeType(imageFile), data: data.toString("base64") } },
      ],
    }],
    generationConfig: { responseMimeType: "application/json", temperature: 0 },
  };
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const message = json?.error?.message || response.statusText || "Gemini API error";
    throw new Error(message);
  }
  return json;
}

async function runDryRun({ bookId, inputFile, outDir, limit, cfg = {} }) {
  const stamp = dateStamp();
  const safeBook = safeName(bookId);
  const apiKey = process.env.GEMINI_API_KEY || "";
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const baseOutput = {
    bookId,
    createdAt: new Date().toISOString(),
    mode: "GEMINI_FORMULA_PATCH_DRY_RUN",
    inputFile,
  };
  const skippedFile = path.join(outDir, `formula_api_skipped_report__${safeBook}__${stamp}.json`);
  const patchFile = path.join(outDir, `formula_correction_patch__${safeBook}__${stamp}.json`);
  const costFile = path.join(outDir, `formula_api_cost_summary__${safeBook}__${stamp}.json`);
  const errorFile = path.join(outDir, `formula_api_error_report__${safeBook}__${stamp}.json`);

  let input;
  try {
    input = await readJson(inputFile);
  } catch (error) {
    const report = { ...baseOutput, status: "skipped", errorType: "input_schema_error", error: error.message };
    await writeJson(errorFile, { ...report, errors: [report] });
    return { status: "skipped", errorType: "input_schema_error", errorFile };
  }
  const targets = Array.isArray(input?.targets) ? input.targets : [];
  if (!targets.length) {
    const report = { ...baseOutput, status: "skipped", reason: "no_formula_repair_targets", targetCount: 0 };
    await writeJson(skippedFile, report);
    return { status: "skipped", reason: "no_formula_repair_targets", skippedFile };
  }
  if (!apiKey) {
    const report = { ...baseOutput, status: "skipped", errorType: "api_skipped_no_key", reason: "GEMINI_API_KEY is not set", targetCount: targets.length };
    await writeJson(skippedFile, report);
    return { status: "skipped", errorType: "api_skipped_no_key", skippedFile };
  }

  const rulebookPath = path.resolve(process.cwd(), "docs/textbook-pipeline/JS_ARCHIVE_FORMULA_RULEBOOK.md");
  let rulebookExcerpt = "Use JS archive formula rulebook notation only.";
  if (fs.existsSync(rulebookPath)) rulebookExcerpt = (await fs.promises.readFile(rulebookPath, "utf8")).slice(0, 12000);

  const selectedTargets = targets.filter((target) => target?.needsGemini !== false).slice(0, limit > 0 ? limit : targets.length);
  const patches = [];
  const errors = [];
  const usage = [];
  let successCount = 0;
  let needsReviewCount = 0;
  let parseErrorCount = 0;
  let imageMissingCount = 0;
  let invalidPatchSchemaCount = 0;

  for (const target of selectedTargets) {
    const source = target.sourceImage || target.questionCrop || "";
    const imageFile = resolveImagePath(source, inputFile, outDir, cfg);
    if (!source || !fs.existsSync(imageFile)) {
      imageMissingCount += 1;
      errors.push({ errorType: "image_missing", id: target.id || "", field: target.field || "", sourceImage: source, resolvedPath: imageFile });
      continue;
    }
    try {
      const response = await callGemini({ apiKey, model, prompt: makePrompt({ target, rulebookExcerpt }), imageFile });
      if (response.usageMetadata) usage.push({ id: target.id || "", ...response.usageMetadata });
      const text = response.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n") || "";
      const parsed = extractJson(text);
      const rawPatches = Array.isArray(parsed?.patches) ? parsed.patches : [];
      if (!rawPatches.length) {
        errors.push({ errorType: "no_patch_returned", id: target.id || "", field: target.field || "" });
        continue;
      }
      for (const rawPatch of rawPatches) {
        const validation = validatePatch(rawPatch, target);
        if (!validation.valid) {
          invalidPatchSchemaCount += 1;
          errors.push({ errorType: "invalid_patch_schema", id: target.id || "", field: target.field || "", errors: validation.errors, rawPatch });
          continue;
        }
        if (validation.patch.needsReview) needsReviewCount += 1;
        patches.push(validation.patch);
        successCount += 1;
      }
    } catch (error) {
      const errorType = /parseable JSON|JSON/i.test(error.message) ? "api_parse_error" : "api_error";
      if (errorType === "api_parse_error") parseErrorCount += 1;
      errors.push({ errorType, id: target.id || "", field: target.field || "", error: error.message });
    }
  }

  const patchReport = {
    schemaVersion: "apmath.formulaCorrectionPatch.v1",
    bookId,
    createdAt: new Date().toISOString(),
    source: { mode: "formula_repair_targets", imagePath: "per_patch_evidence" },
    patches,
    dryRun: true,
    jsModified: false,
  };
  const costSummary = {
    ...baseOutput,
    model,
    itemCount: selectedTargets.length,
    successCount,
    needsReviewCount,
    parseErrorCount,
    imageMissingCount,
    inputSchemaErrorCount: 0,
    invalidPatchSchemaCount,
    usageMetadata: usage,
    promptTokenCount: usage.reduce((sum, item) => sum + Number(item.promptTokenCount || 0), 0),
    candidatesTokenCount: usage.reduce((sum, item) => sum + Number(item.candidatesTokenCount || 0), 0),
    totalTokenCount: usage.reduce((sum, item) => sum + Number(item.totalTokenCount || 0), 0),
    costEstimate: null,
    costEstimateNote: "No price conversion is hardcoded because Gemini unit prices can change.",
  };
  await writeJson(patchFile, patchReport);
  await writeJson(costFile, costSummary);
  await writeJson(errorFile, { ...baseOutput, errorCount: errors.length, errors });
  return { status: "ok", patchFile, costFile, errorFile, patchCount: patches.length, errorCount: errors.length };
}

export default async function stage12bGeminiFormulaPatchDryRun(cfg = {}) {
  if (cfg.makeGeminiFormulaPatchDryRun === false) {
    return { status: "ok", skipped: true, reason: "makeGeminiFormulaPatchDryRun=false" };
  }
  const bookId = cfg.bookId || cfg.materialKey || cfg.bookName || "book";
  const outDir = cfg.formulaRepairOutDir || cfg.reportsDir || process.cwd();
  const inputFile = cfg.formulaRepairTargetsFile || cfg.input || await findLatestTargetsFile(outDir, bookId);
  if (!inputFile) {
    const skippedFile = path.join(outDir, `formula_api_skipped_report__${safeName(bookId)}__${dateStamp()}.json`);
    await writeJson(skippedFile, {
      bookId,
      createdAt: new Date().toISOString(),
      mode: "GEMINI_FORMULA_PATCH_DRY_RUN",
      status: "ok",
      apiStatus: "skipped",
      reason: "formulaRepairTargetsFile_missing",
    });
    return { status: "ok", apiStatus: "skipped", reason: "formulaRepairTargetsFile_missing", skippedFile };
  }
  const result = await runDryRun({ bookId, inputFile: path.resolve(inputFile), outDir, limit: Number(cfg.formulaRepairLimit || 0), cfg });
  if (result.status === "skipped") return { ...result, apiStatus: "skipped", status: "ok" };
  return result;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  const bookId = args["book-id"] || args.bookId || "book";
  const inputFile = path.resolve(args.input || "");
  const outDir = path.resolve(args.out || path.dirname(inputFile || "."));
  const limit = args.limit ? Number(args.limit) : 0;
  if (!args.input) {
    console.error("--input <formula_repair_targets json path> is required");
    process.exitCode = 1;
  } else {
    runDryRun({ bookId, inputFile, outDir, limit }).then((result) => {
      console.log(JSON.stringify(result, null, 2));
    }).catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  }
}




