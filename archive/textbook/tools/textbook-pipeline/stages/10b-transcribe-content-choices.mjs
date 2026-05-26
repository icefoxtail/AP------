import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { collectQuestionBanks } from "../lib/js-archive-utils.mjs";
import { renderArchiveJs } from "../lib/js-archive-utils.mjs";
import { ensureDir, readJson, writeJson } from "../lib/report-utils.mjs";
import {
  crosscheckForQuestion,
  hasQuestionSourceCrosscheck,
  loadQuestionCrosscheckMap,
  updatePipelineBookSummary,
} from "../lib/source-crosscheck-utils.mjs";

const execFileAsync = promisify(execFile);

function hasContent(question) {
  return String(question.content || "").trim().length > 0;
}

function hasFormulaRisk(text) {
  const value = String(text || "");
  return [
    /\bn[CPH]\d+\b/,
    /\bn[CPH]r\b/i,
    /\bnCr\b/i,
    /\bnPr\b/i,
    /\b\d+[CPH]\d+\b/,
    /[ₙᵣ₀₁₂₃₄₅₆₇₈₉]/,
    /\^[^{\s]/,
  ].some((pattern) => pattern.test(value));
}

function formulaNote(text) {
  const value = String(text || "");
  if (/[ₙᵣ₀₁₂₃₄₅₆₇₈₉]/.test(value)) return "unicode_subscript_or_superscript_requires_latex_normalization";
  if (/\bnCr\b/i.test(value) || /\bnPr\b/i.test(value)) return "plain_nCr_or_nPr_requires_rulebook_combination_permutation_latex";
  if (/\bn[CPH]\d+\b/.test(value) || /\b\d+[CPH]\d+\b/.test(value)) return "plain_combination_permutation_token_requires_latex";
  if (/\^[^{\s]/.test(value)) return "plain_caret_exponent_requires_latex_group_check";
  return "formula_requires_review";
}

function hasFormula(text) {
  return /[$\\^_=]|[CPH]\s*[_{]|\b\d+[CPH]\d+\b|\bn[CPH]/i.test(String(text || ""));
}

function safeText(value) {
  return String(value ?? "").trim();
}

function hasBrokenOcrText(value) {
  return /[?]{2,}|�|Û|Ü|Ý|Þ|聽/.test(String(value ?? ""));
}

function isImageOnlyContent(value) {
  const text = safeText(value);
  return /<img\b|\.png\b|\.jpe?g\b|page[_-]?full|question[_-]?crop|crop_images/i.test(text);
}

export function passesContentSuccessGate(value) {
  const text = safeText(value);
  return Boolean(text) && !hasBrokenOcrText(text) && !isImageOnlyContent(text);
}

function hasSourceImageEvidence(item) {
  const candidates = [
    item.fullPageImagePath,
    item.pageImagePath,
    item.sourceImage,
    item.sourceImagePath,
    item.cropPath,
    item.questionCropPath,
    item.raw?.fullPageImagePath,
    item.raw?.pageImagePath,
    item.raw?.sourceImage,
    item.raw?.sourceImagePath,
  ];
  return candidates.some((candidate) => safeText(candidate));
}

function collectContentEvidence(raw, reportFile) {
  const source = Array.isArray(raw) ? raw
    : Array.isArray(raw?.applications) ? raw.applications
      : Array.isArray(raw?.items) ? raw.items
        : Array.isArray(raw?.results) ? raw.results
          : Array.isArray(raw?.patches) ? raw.patches
            : [];
  const rows = [];
  for (const item of source) {
    const content = item.content ?? item.replacementContent ?? item.contentText ?? item.transcribedContent;
    const choices = item.choices ?? item.replacementChoices ?? item.choiceTexts ?? item.transcribedChoices;
    const hasContentEvidence = passesContentSuccessGate(content);
    const hasChoicesEvidence = Array.isArray(choices);
    if (!hasContentEvidence && !hasChoicesEvidence) continue;
    rows.push({
      setKey: item.setKey || item.sectionKey || item.fileKey || "",
      id: item.id ?? item.jsId ?? item.questionId ?? item.globalQuestionNo ?? "",
      displayNo: item.displayNo ?? item.sourceDisplayNo ?? item.questionNo ?? "",
      content: hasContentEvidence ? String(content) : undefined,
      choices: hasChoicesEvidence ? choices.map((choice) => String(choice)) : undefined,
      confidence: item.confidence ?? "",
      needsReview: item.needsReview === true,
      source: item.source || reportFile,
      reportFile,
      hasSourceImage: hasSourceImageEvidence(item),
      raw: item,
    });
  }
  return rows;
}

function keyFor(setKey, id, displayNo) {
  return `${setKey || ""}::${id || ""}::${displayNo || ""}`;
}

function mimeType(file) {
  const ext = path.extname(file).toLowerCase();
  if ([".jpg", ".jpeg"].includes(ext)) return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "image/png";
}

function resolveGeneratedPath(cfg, rawPath) {
  if (!rawPath) return "";
  const value = String(rawPath);
  const withoutGenerated = value.replace(/^generated[\\/]/, "");
  const candidates = [
    path.resolve(value),
    cfg.generatedRoot ? path.resolve(cfg.generatedRoot, withoutGenerated) : "",
    cfg.materialRoot ? path.resolve(cfg.materialRoot, value) : "",
    cfg.workspaceRoot ? path.resolve(cfg.workspaceRoot, value) : "",
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0] || "";
}

function extractJson(text) {
  const trimmed = String(text || "").trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1].trim() : trimmed;
  try {
    return JSON.parse(body);
  } catch {
    const first = body.indexOf("{");
    const last = body.lastIndexOf("}");
    if (first >= 0 && last > first) return JSON.parse(body.slice(first, last + 1));
    throw new Error("response_json_parse_failed");
  }
}

function makeTranscribePrompt({ question, setKey, crop, rulebookFormulaPolicy }) {
  return [
    "You are transcribing a Korean math textbook/workbook problem into a JS archive questionBank item.",
    "Use the image as the only source of truth. Do not invent missing text, choices, answers, or explanations.",
    "Return JSON only.",
    "Fill only content and choices. Never include answer or solution.",
    "If the problem text is not fully visible or the number does not match, set needsReview=true and leave content empty.",
    "Do not put image paths, <img>, page crop paths, or question crop paths in content.",
    "If there are multiple-choice options, return choices as an array in original order without circled number symbols.",
    "If there are no choices, return choices as an empty array.",
    "Normalize all formulas to JS archive rulebook notation.",
    `Formula policy: ${JSON.stringify(rulebookFormulaPolicy)}`,
    "",
    "Target question metadata:",
    JSON.stringify({
      setKey,
      id: question.id,
      displayNo: question.displayNo || "",
      pageNo: crop?.pageNo || "",
      sourceDisplayNo: crop?.sourceDisplayNo || crop?.displayNo || "",
      imagePolicy: "full page image first; question crop is zoom evidence only",
    }, null, 2),
    "",
    "Required JSON shape:",
    JSON.stringify({
      content: "",
      choices: [],
      confidence: "high|medium|low",
      needsReview: true,
      reviewReason: "",
      visibleDisplayNo: "",
      formulaRisk: false,
    }, null, 2),
  ].join("\n");
}

async function callGeminiContent({ cfg, imageFile, prompt }) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) throw new Error("api_skipped_no_key");
  const model = process.env.GEMINI_CONTENT_MODEL || process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const data = await fs.promises.readFile(imageFile);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
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
  if (!response.ok) throw new Error(json?.error?.message || response.statusText || "Gemini content transcription failed");
  return { json, model };
}

function normalizeGeminiContentResult(parsed) {
  const content = String(parsed?.content || "").trim();
  const choices = Array.isArray(parsed?.choices) ? parsed.choices.map((choice) => String(choice).trim()).filter(Boolean) : [];
  const confidence = String(parsed?.confidence || "low").toLowerCase();
  const needsReview = parsed?.needsReview !== false;
  return {
    content,
    choices,
    confidence: ["high", "medium", "low"].includes(confidence) ? confidence : "low",
    needsReview,
    reviewReason: String(parsed?.reviewReason || ""),
    visibleDisplayNo: String(parsed?.visibleDisplayNo || ""),
    formulaRisk: parsed?.formulaRisk === true,
  };
}

function classifyPending({ question, crop, evidenceRows }) {
  if (!crop?.pageImagePath && !crop?.fullPageImagePath && !crop?.cropPath && !crop?.finalCropPath && !crop?.refinedCropPath) {
    return "missing_full_page_image";
  }
  if (crop?.mappingStatus === "map_review" || crop?.sourceDisplayNo === null) return "page_mapping_mismatch";
  if (evidenceRows?.length && evidenceRows.every((row) => row.needsReview || !row.hasSourceImage)) return "needs_manual_review";
  if (!passesContentSuccessGate(question.content)) return "content_input_required";
  return "needs_manual_review";
}

function reviewReason({ content, choices, cropPath, formulaRisk }) {
  const reasons = [];
  if (!String(content || "").trim()) reasons.push("content_empty");
  if (!Array.isArray(choices)) reasons.push("choices_not_array");
  if (formulaRisk) reasons.push("formula_requires_rulebook_review");
  if (!cropPath) reasons.push("source_crop_or_page_missing");
  return reasons;
}

function pythonCandidates(cfg) {
  return [
    cfg.pythonExecutable,
    path.join(cfg.workspaceRoot || "", ".venv", "Scripts", "python.exe"),
    path.join(cfg.projectRoot || "", ".venv", "Scripts", "python.exe"),
    "python",
  ].filter(Boolean);
}

async function makeReviewContactSheet(cfg, reviewIndexPath, contactSheetPath) {
  const script = path.join(cfg.pipelineDir, "helpers", "make_content_review_contact_sheet.py");
  const args = [
    script,
    reviewIndexPath,
    contactSheetPath,
    cfg.materialRoot || cfg.workspaceRoot,
    cfg.generatedRoot,
  ];
  const errors = [];
  for (const python of pythonCandidates(cfg)) {
    try {
      await execFileAsync(python, args, { timeout: 60000 });
      return { status: "ok", python };
    } catch (error) {
      errors.push({ python, error: String(error.message || error).split("\n")[0] });
    }
  }
  return { status: "failed", errors };
}

const rulebookFormulaPolicy = {
  requiredForAllFormulas: true,
  source: "rules/JS아카이브룰북.txt section 3-3 and rules/헬모드최종.txt section 9",
  mathWrapper: "$...$",
  lineBreakPolicy: "$...$ must close before each \\n and reopen on the next formula line",
  combination: "${}_{n}C_{r}",
  permutation: "${}_{n}P_{r}",
  topLevelFraction: "$\\dfrac{a}{b}$",
  nestedFraction: "$e^{\\frac{1}{2}}$",
  choicesInequality: ["\\lt", "\\gt"],
  jsBackslashEscape: true,
  koreanInsideTextCommand: "forbidden",
  plainTextFormulaTokensForbidden: ["nCr", "nPr", "nP3", "10P2", "x^2"],
};

export default async function stage10b(cfg) {
  const banks = await collectQuestionBanks(cfg.jsDir);
  const { report: questionSourceReport, map: questionSourceMap } = await loadQuestionCrosscheckMap(cfg);
  const freshManifest = await readJson(path.join(cfg.reportsDir, "fresh_js_input_manifest.json"), null);
  const cropMapRaw = freshManifest
    || await readJson(path.join(cfg.reportsDir, "question_crop_map.json"), null)
    || await readJson(path.join(cfg.reportsDir, "rpm_question_crop_map.json"), null)
    || await readJson(path.join(cfg.reportsDir, "miraen_question_crop_map.json"), null)
    || await readJson(path.join(cfg.reportsDir, "text1_question_crop_map.json"), null);
  const strictManifest = Boolean(freshManifest);
  const cropItems = (Array.isArray(cropMapRaw) ? cropMapRaw : Array.isArray(cropMapRaw?.items) ? cropMapRaw.items : [])
    .filter((item) => item.mappingStatus !== "map_review" && item.sourceDisplayNo !== null);
  const cropBySetId = new Map();
  for (const item of cropItems) {
    const globalId = strictManifest
      ? (item.globalId ?? item.globalQuestionNo ?? item.internalId ?? item.questionGlobalId)
      : (item.globalId ?? item.globalQuestionNo ?? item.internalId ?? item.questionGlobalId ?? item.jsIdCandidate ?? item.finalQuestionId ?? item.id);
    const sourceDisplayNo = strictManifest
      ? item.sourceDisplayNo
      : (item.sourceDisplayNo ?? item.displayNo ?? item.sourceQuestionNo ?? item.questionNo);
    if (globalId !== undefined && globalId !== null && globalId !== "") cropBySetId.set(`${item.setKey}::${globalId}`, item);
    if (sourceDisplayNo !== undefined && sourceDisplayNo !== null && sourceDisplayNo !== "") cropBySetId.set(`${item.setKey}::${sourceDisplayNo}`, item);
  }

  const evidenceReports = cfg.contentEvidenceReports || [
    "content_choices_input_report.json",
    "content_choices_apply_report.json",
    "content_gemini_transcribe_report.json",
    `content_gemini_transcribe_report__${cfg.bookId || cfg.bookIdPrefix || "book"}__${new Date().toISOString().slice(0, 10).replaceAll("-", "")}.json`,
  ];
  const evidenceRows = [];
  const loadedEvidenceReports = [];
  for (const name of evidenceReports) {
    const file = path.isAbsolute(name) ? name : path.join(cfg.reportsDir, name);
    const raw = await readJson(file, null);
    if (!raw) continue;
    const rows = collectContentEvidence(raw, path.basename(file));
    loadedEvidenceReports.push({ file, evidenceCount: rows.length });
    evidenceRows.push(...rows);
  }
  const evidenceByKey = new Map();
  for (const row of evidenceRows) {
    const keys = [
      keyFor(row.setKey, row.id, row.displayNo),
      keyFor(row.setKey, row.id, ""),
      keyFor(row.setKey, "", row.displayNo),
    ];
    for (const key of keys) {
      if (!evidenceByKey.has(key)) evidenceByKey.set(key, []);
      evidenceByKey.get(key).push(row);
    }
  }

  const pending = [];
  const pendingByReason = {};
  const formulaUncertain = [];
  const reviewIndexItems = [];
  const applied = [];
  const rejectedEvidence = [];
  const geminiTranscribe = [];
  const geminiErrors = [];
  const geminiUsageMetadata = [];
  const changedBanks = new Map();
  let questionCount = 0;
  let filledContentCount = 0;
  let choicesFilledCount = 0;
  let beforeEmptyContentCount = 0;

  for (const bank of banks) {
    let workingQuestions = changedBanks.get(bank.setKey) || bank.questions;
    for (const question of bank.questions) {
      questionCount += 1;
      const displayNo = question.displayNo || question.questionNo || "";
      const matchedEvidence = evidenceByKey.get(keyFor(bank.setKey, question.id, displayNo))
        || evidenceByKey.get(keyFor(bank.setKey, question.id, ""))
        || evidenceByKey.get(keyFor(bank.setKey, "", displayNo))
        || [];
      if (!hasContent(question)) {
        beforeEmptyContentCount += 1;
        const crop = cropBySetId.get(`${bank.setKey}::${question.id}`) || cropBySetId.get(`${bank.setKey}::${displayNo}`) || null;
        if (cfg.mode === "production" && !crop) {
          rejectedEvidence.push({
            setKey: bank.setKey,
            id: question.id,
            displayNo,
            evidenceCount: matchedEvidence.length,
            usableEvidenceCount: 0,
            reason: "displayNo_page_mismatch",
          });
          continue;
        }
        const sourceCrosscheck = crosscheckForQuestion(questionSourceMap, bank.setKey, question);
        const sourceCrosschecked = hasQuestionSourceCrosscheck(sourceCrosscheck);
        const usableEvidence = matchedEvidence.filter((row) => !row.needsReview && row.hasSourceImage && sourceCrosschecked && passesContentSuccessGate(row.content));
        const uniqueContent = [...new Set(usableEvidence.map((row) => row.content).filter((value) => value !== undefined))];
        const uniqueChoices = [...new Set(usableEvidence.map((row) => JSON.stringify(Array.isArray(row.choices) ? row.choices : [])).filter(Boolean))].map((value) => JSON.parse(value));
        if ((cfg.contentChoicesInputMode || "apply_unambiguous") === "apply_unambiguous" && uniqueContent.length === 1 && uniqueChoices.length <= 1) {
          const index = workingQuestions.findIndex((item) => String(item.id) === String(question.id));
          if (index >= 0) {
            const nextQuestions = [...workingQuestions];
            nextQuestions[index] = {
              ...nextQuestions[index],
              content: uniqueContent[0],
              choices: uniqueChoices[0] || nextQuestions[index].choices || [],
            };
            workingQuestions = nextQuestions;
            changedBanks.set(bank.setKey, nextQuestions);
            applied.push({
              setKey: bank.setKey,
              id: question.id,
              displayNo,
              contentLength: uniqueContent[0].length,
              choicesCount: Array.isArray(uniqueChoices[0]) ? uniqueChoices[0].length : 0,
              source: usableEvidence[0]?.source || "",
              source_type: "full_page_content_crosscheck",
              fullPageCropCandidates: sourceCrosscheck?.fullPageCropCandidates || [],
              questionCropCandidates: sourceCrosscheck?.questionCropCandidates || [],
              status: "applied",
            });
          }
        } else {
          if (matchedEvidence.length) {
            rejectedEvidence.push({
              setKey: bank.setKey,
              id: question.id,
              displayNo,
              evidenceCount: matchedEvidence.length,
              usableEvidenceCount: usableEvidence.length,
              reason: !sourceCrosschecked ? "crop_js_mismatch" : usableEvidence.length ? "ambiguous_content_evidence" : "no_usable_full_page_evidence",
            });
          }
        }
      }
    }
  }

  if (cfg.makeGeminiContentTranscribe === true) {
    const limit = Number(cfg.contentTranscribeLimit || 0);
    let attempted = 0;
    for (const bank of banks) {
      let workingQuestions = changedBanks.get(bank.setKey) || bank.questions;
      for (const question of bank.questions) {
        const current = workingQuestions.find((item) => String(item.id) === String(question.id)) || question;
        if (hasContent(current)) continue;
        if (limit > 0 && attempted >= limit) continue;
        const displayNo = question.displayNo || question.questionNo || "";
        const sourceCrosscheck = crosscheckForQuestion(questionSourceMap, bank.setKey, question);
        const crop = cropBySetId.get(`${bank.setKey}::${question.id}`) || cropBySetId.get(`${bank.setKey}::${displayNo}`) || {};
        const imagePath = sourceCrosscheck?.fullPageCropCandidates?.[0] || crop.pageImagePath || crop.fullPageImagePath || crop.cropPath || crop.finalCropPath || crop.refinedCropPath || "";
        const imageFile = resolveGeneratedPath(cfg, imagePath);
        if (!imagePath || !fs.existsSync(imageFile)) {
          geminiErrors.push({ setKey: bank.setKey, id: question.id, displayNo, errorType: "source_image_missing", imagePath, imageFile });
          continue;
        }
        attempted += 1;
        try {
          const response = await callGeminiContent({
            cfg,
            imageFile,
            prompt: makeTranscribePrompt({ question, setKey: bank.setKey, crop, rulebookFormulaPolicy }),
          });
          if (response.json?.usageMetadata) geminiUsageMetadata.push({ setKey: bank.setKey, id: question.id, ...response.json.usageMetadata });
          const text = response.json.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n") || "";
          const parsed = normalizeGeminiContentResult(extractJson(text));
          const canApply = hasQuestionSourceCrosscheck(sourceCrosscheck)
            && passesContentSuccessGate(parsed.content)
            && parsed.confidence === "high"
            && parsed.needsReview === false;
          const item = {
            setKey: bank.setKey,
            id: question.id,
            displayNo,
            pageNo: crop.pageNo || "",
            imagePath,
            imageFile,
            model: response.model,
            contentLength: parsed.content.length,
            choicesCount: parsed.choices.length,
            confidence: parsed.confidence,
            needsReview: parsed.needsReview,
            reviewReason: parsed.reviewReason,
            visibleDisplayNo: parsed.visibleDisplayNo,
            formulaRisk: parsed.formulaRisk,
            status: canApply ? "applied" : "manual_review",
          };
          if (canApply) {
            const index = workingQuestions.findIndex((entry) => String(entry.id) === String(question.id));
            if (index >= 0) {
              const nextQuestions = [...workingQuestions];
              nextQuestions[index] = {
                ...nextQuestions[index],
                content: parsed.content,
                choices: parsed.choices,
              };
              workingQuestions = nextQuestions;
              changedBanks.set(bank.setKey, nextQuestions);
              applied.push({
                setKey: bank.setKey,
                id: question.id,
                displayNo,
                contentLength: parsed.content.length,
                choicesCount: parsed.choices.length,
                source: "gemini_content_transcribe",
                source_type: "full_page_content_crosscheck",
                fullPageCropCandidates: sourceCrosscheck?.fullPageCropCandidates || [],
                questionCropCandidates: sourceCrosscheck?.questionCropCandidates || [],
                status: "applied",
              });
            }
          }
          geminiTranscribe.push(item);
        } catch (error) {
          geminiErrors.push({
            setKey: bank.setKey,
            id: question.id,
            displayNo,
            imagePath,
            imageFile,
            errorType: /api_skipped_no_key/.test(error.message) ? "api_skipped_no_key" : "api_error",
            error: error.message,
          });
        }
      }
    }
  }

  if (changedBanks.size) {
    const backupRoot = path.join(cfg.generatedRoot, "backup", `js_before_content_choices_apply_${new Date().toISOString().slice(0, 10).replaceAll("-", "")}`);
    for (const bank of banks) {
      const nextQuestions = changedBanks.get(bank.setKey);
      if (!nextQuestions) continue;
      const backupFile = path.join(backupRoot, path.relative(cfg.jsDir, bank.file));
      await ensureDir(path.dirname(backupFile));
      await import("node:fs").then((fs) => fs.promises.copyFile(bank.file, backupFile));
      await import("node:fs").then((fs) => fs.promises.writeFile(bank.file, renderArchiveJs(bank.examTitle, nextQuestions), "utf8"));
    }
  }

  const refreshedBanks = changedBanks.size ? await collectQuestionBanks(cfg.jsDir) : banks;
  for (const bank of refreshedBanks) {
    for (const question of bank.questions) {
      if (hasContent(question)) filledContentCount += 1;
      else {
        const displayNo = question.displayNo || question.questionNo || "";
        const crop = cropBySetId.get(`${bank.setKey}::${question.id}`) || cropBySetId.get(`${bank.setKey}::${displayNo}`) || {};
        const matchedEvidence = evidenceByKey.get(keyFor(bank.setKey, question.id, displayNo))
          || evidenceByKey.get(keyFor(bank.setKey, question.id, ""))
          || evidenceByKey.get(keyFor(bank.setKey, "", displayNo))
          || [];
        const reason = classifyPending({ question, crop, evidenceRows: matchedEvidence });
        pendingByReason[reason] = (pendingByReason[reason] || 0) + 1;
        pending.push({
          setKey: bank.setKey,
          bookPart: bank.bookPart,
          id: question.id,
          displayNo,
          pageNo: crop.pageNo || "",
          cropPath: crop.cropPath || crop.finalCropPath || crop.refinedCropPath || "",
          fullPageImagePath: crop.pageImagePath || crop.fullPageImagePath || "",
          reason,
          sourceEvidencePolicy: "page_full_images_first",
        });
      }
      if (Array.isArray(question.choices) && question.choices.length) choicesFilledCount += 1;
      const combined = [question.content, ...(Array.isArray(question.choices) ? question.choices : [])].join("\n");
      const formulaRisk = hasFormulaRisk(combined);
      const crop = cropBySetId.get(`${bank.setKey}::${question.id}`) || {};
      const displayNo = crop.sourceDisplayNo || crop.displayNo || question.displayNo || String(question.id);
      const reasons = reviewReason({
        content: question.content,
        choices: question.choices,
        cropPath: crop.cropPath || crop.finalCropPath || crop.refinedCropPath || crop.pageImagePath || "",
        formulaRisk,
      });
      const confidence = reasons.length ? 0.6 : 0.95;
      reviewIndexItems.push({
        setKey: bank.setKey,
        bookPart: bank.bookPart,
        id: question.id,
        displayNo,
        sourceDisplayNo: crop.sourceDisplayNo || null,
        bboxSlotNo: crop.bboxSlotNo ?? null,
        pageNo: crop.pageNo || "",
        cropPath: crop.cropPath || crop.finalCropPath || crop.refinedCropPath || crop.pageImagePath || "",
        content: question.content || "",
        choices: Array.isArray(question.choices) ? question.choices : [],
        hasFormula: hasFormula(combined),
        formulaRisk,
        confidence,
        needsReview: reasons.length > 0,
        reviewReason: reasons.join(","),
      });
      if (formulaRisk) {
        formulaUncertain.push({
          setKey: bank.setKey,
          bookPart: bank.bookPart,
          id: question.id,
          displayNo,
          sourceDisplayNo: crop.sourceDisplayNo || null,
          bboxSlotNo: crop.bboxSlotNo ?? null,
          pageNo: crop.pageNo || "",
          cropPath: crop.cropPath || crop.finalCropPath || crop.refinedCropPath || crop.pageImagePath || "",
          content: question.content || "",
          choices: Array.isArray(question.choices) ? question.choices : [],
          confidence,
          needsReview: true,
          note: formulaNote(combined),
          rulebookTarget: "All formulas must be normalized to JS archive rulebook notation before final PASS.",
        });
      }
    }
  }

  const reviewRoot = cfg.mode === "production" ? cfg.reportsDir : path.join(cfg.draftContentDir, "review");
  await ensureDir(reviewRoot);
  const reviewIndexPath = path.join(reviewRoot, cfg.mode === "production" ? "content_choices_review_index.json" : "review_index.json");
  const contactSheetPath = path.join(reviewRoot, "review_contact_sheet.png");
  await writeJson(reviewIndexPath, {
    stage: "10B-transcribe-content-choices",
    itemCount: reviewIndexItems.length,
    needsReviewCount: reviewIndexItems.filter((item) => item.needsReview).length,
    items: reviewIndexItems,
  });
  let contactSheetStatus = "skipped";
  const contactSheetResult = cfg.mode === "production"
    ? { status: "skipped_production_minimal_reports" }
    : await makeReviewContactSheet(cfg, reviewIndexPath, contactSheetPath);
  contactSheetStatus = contactSheetResult.status;

  const formulaRoot = cfg.mode === "production" ? cfg.reportsDir : path.join(cfg.draftContentDir, "formula_uncertain");
  const bySetKey = new Map();
  for (const item of formulaUncertain) {
    if (!bySetKey.has(item.setKey)) bySetKey.set(item.setKey, []);
    bySetKey.get(item.setKey).push(item);
  }
  for (const [setKey, items] of bySetKey.entries()) {
    if (cfg.mode === "production") continue;
    const dir = path.join(formulaRoot, setKey);
    await ensureDir(dir);
    await writeJson(path.join(dir, "formula_uncertain_items.json"), {
      setKey,
      itemCount: items.length,
      items,
      nextAction: "Normalize formulas against JS archive rulebook before final PASS.",
    });
  }

  const report = {
    stage: "10B-transcribe-content-choices",
    mode: cfg.contentExtractionMode || "manual_or_gpt_assisted",
    sourceEvidencePolicy: "full_page_first_question_crop_zoom_only_question_source_crosscheck_required",
    changedFieldsAllowed: ["content", "choices"],
    rulebookFormulaPolicy,
    questionSourceCrosscheckReport: path.join(cfg.reportsDir, "question_source_crosscheck_report.json"),
    questionSourceCrosscheckedCount: questionSourceReport.crosscheckedCount || 0,
    questionCount,
    beforeEmptyContentCount,
    appliedContentCount: applied.length,
    filledContentCount,
    emptyContentCount: pending.length,
    pendingByReason,
    choicesFilledCount,
    formulaUncertainCount: formulaUncertain.length,
    loadedEvidenceReports,
    rejectedEvidenceCount: rejectedEvidence.length,
    geminiTranscribeAttemptedCount: geminiTranscribe.length + geminiErrors.length,
    geminiTranscribeAppliedCount: geminiTranscribe.filter((item) => item.status === "applied").length,
    geminiTranscribeReviewCount: geminiTranscribe.filter((item) => item.status === "manual_review").length,
    geminiTranscribeErrorCount: geminiErrors.length,
    reviewIndexPath,
    reviewContactSheetPath: contactSheetPath,
    reviewContactSheetStatus: contactSheetStatus,
    reviewContactSheetResult: contactSheetResult,
    status: pending.length || formulaUncertain.length ? "manual_review" : "ok",
  };

  await writeJson(path.join(cfg.reportsDir, "content_choices_extraction_report.json"), report);
  await writeJson(path.join(cfg.reportsDir, "question_source_crosscheck_report.json"), questionSourceReport);
  await updatePipelineBookSummary(cfg, {
    question_source_crosschecked_count: questionSourceReport.crosscheckedCount || 0,
    empty_content_before_10b: beforeEmptyContentCount,
    empty_content_after_10b: pending.length,
    content_from_full_page_crosscheck_count: applied.length,
  });
  await writeJson(path.join(cfg.reportsDir, "content_choices_apply_report.json"), {
    stage: "10B-transcribe-content-choices",
    mode: cfg.contentChoicesInputMode || "apply_unambiguous",
    itemCount: applied.length,
    items: applied,
    rejectedEvidenceCount: rejectedEvidence.length,
    rejectedEvidence,
    geminiTranscribeCount: geminiTranscribe.length,
    geminiTranscribe,
    geminiErrorCount: geminiErrors.length,
    geminiErrors,
    geminiUsageMetadata,
    status: applied.length ? "ok" : "empty",
  });
  await writeJson(path.join(cfg.reportsDir, "content_choices_pending_report.json"), {
    stage: "10B-transcribe-content-choices",
    itemCount: pending.length,
    byReason: pendingByReason,
    items: pending,
    status: pending.length ? "manual_review" : "ok",
  });
  await writeJson(path.join(cfg.reportsDir, "formula_uncertain_report.json"), {
    stage: "10B-transcribe-content-choices",
    rulebookFormulaPolicy,
    itemCount: formulaUncertain.length,
    items: formulaUncertain,
    outputRoot: "generated/draft_content/formula_uncertain",
    status: formulaUncertain.length ? "manual_review" : "ok",
  });

  return {
    name: "10B-transcribe-content-choices",
    status: report.status,
    questionCount,
    beforeEmptyContentCount,
    appliedContentCount: applied.length,
    emptyContentCount: pending.length,
    pendingByReason,
    filledContentCount,
    formulaUncertainCount: formulaUncertain.length,
    reviewContactSheetStatus: contactSheetStatus,
  };
}
