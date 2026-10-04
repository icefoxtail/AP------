import fs from "node:fs";
import path from "node:path";

const workspaceRoot = process.cwd();
const generatedRoot = path.join(workspaceRoot, "generated");
const outRoot = path.join(generatedRoot, "review_pack", "by_unit_fresh");

function unitOfSetKey(setKey) {
  if (setKey.includes("경우의수")) return "경우의수";
  if (setKey.includes("행렬")) return "행렬";
  if (setKey.includes("방정식과부등식") || setKey.includes("복소수와이차방정식") || setKey.includes("이차방정식과이차함수") || setKey.includes("여러가지방정식과부등식")) return "방정식과부등식";
  if (setKey.includes("다항식") || setKey.includes("나머지정리와인수분해")) return "다항식";
  return "기타";
}

function rel(target) {
  return path.relative(workspaceRoot, target).replaceAll("\\", "/");
}

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.promises.copyFile(src, dest);
}

async function copyIfExists(src, dest) {
  try {
    await copyFile(src, dest);
    return true;
  } catch {
    return false;
  }
}

async function writeJson(file, data) {
  await ensureDir(path.dirname(file));
  await fs.promises.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function pageImageCandidates(q) {
  const pageNo = q.internal?.sourcePageNo;
  const setKey = q.setKey;
  const bookPart = q.bookPart || "textbook";
  const direct = q.internal?.sourcePageImage || q.internal?.pageImage || "";
  const candidates = [];
  if (direct) candidates.push(path.join(workspaceRoot, direct));
  if (pageNo) {
    candidates.push(path.join(generatedRoot, "work", "rendered_pages", bookPart, setKey, `page_${String(pageNo).padStart(3, "0")}.png`));
    candidates.push(path.join(generatedRoot, "work", "page_crops", bookPart, setKey, `page${pageNo}.png`));
  }
  return candidates;
}

async function main() {
  const model = JSON.parse(await fs.promises.readFile(path.join(generatedRoot, "internal", "internal_question_model.json"), "utf8"));
  await fs.promises.rm(outRoot, { recursive: true, force: true });
  await ensureDir(outRoot);

  const byUnit = new Map();
  for (const q of model.questions) {
    const unit = unitOfSetKey(q.setKey);
    if (!byUnit.has(unit)) byUnit.set(unit, []);
    byUnit.get(unit).push(q);
  }

  const packs = [];
  for (const [unit, questions] of byUnit) {
    const unitKey = `비상_공통수학1_${unit}_고1`;
    const packDir = path.join(outRoot, unitKey);
    await ensureDir(packDir);

    const cropIndex = [];
    const setKeys = [...new Set(questions.map((q) => q.setKey))].sort((a, b) => a.localeCompare(b, "ko"));
    for (const setKey of setKeys) {
      const bookPart = questions.find((q) => q.setKey === setKey)?.bookPart || "textbook";
      await copyIfExists(path.join(generatedRoot, "js", bookPart, `${setKey}.js`), path.join(packDir, "js", `${setKey}.js`));
      await copyIfExists(path.join(generatedRoot, "input_templates", `${setKey}_input_template.json`), path.join(packDir, "input_templates", `${setKey}_input_template.json`));
      await copyIfExists(path.join(generatedRoot, "input_templates", `${setKey}_correction_result_schema.json`), path.join(packDir, "input_templates", `${setKey}_correction_result_schema.json`));
    }

    const sortedQuestions = [...questions].sort((a, b) => {
      if (a.setKey !== b.setKey) return a.setKey.localeCompare(b.setKey, "ko");
      return Number(a.archiveQuestion.id) - Number(b.archiveQuestion.id);
    });

    for (const q of sortedQuestions) {
      const pageNo = q.internal?.sourcePageNo || null;
      let pageCopied = false;
      for (const pageSrc of pageImageCandidates(q)) {
        const pageName = pageNo ? `p${String(pageNo).padStart(3, "0")}.png` : path.basename(pageSrc);
        pageCopied = await copyIfExists(pageSrc, path.join(packDir, "page_full_images", pageName));
        if (pageCopied) break;
      }
      const srcRel = q.internal?.sourceCropPath || "";
      const src = srcRel ? path.join(workspaceRoot, srcRel) : "";
      const originalFile = src ? path.basename(src) : "";
      const dest = originalFile ? path.join(packDir, "question_crop_images", originalFile) : "";
      const copied = src && dest ? await copyIfExists(src, dest) : false;
      cropIndex.push({
        setKey: q.setKey,
        bookPart: q.bookPart,
        jsId: q.archiveQuestion.id,
        displayNo: q.internal?.displayNo || "",
        pageNo,
        pageImagePath: pageCopied && pageNo ? `page_full_images/p${String(pageNo).padStart(3, "0")}.png` : "",
        originalCropFile: originalFile,
        cropImagePath: copied ? rel(dest) : "",
        sourceCropPath: srcRel,
        status: copied ? "copied" : "missing",
      });
    }

    const assetQuestions = sortedQuestions.filter((q) => q.archiveQuestion.image);
    for (const q of assetQuestions) {
      const src = path.join(generatedRoot, q.archiveQuestion.image.replaceAll("/", path.sep));
      const assetName = `${q.setKey}_q${String(q.archiveQuestion.id).padStart(3, "0")}_${path.basename(q.archiveQuestion.image)}`;
      await copyIfExists(src, path.join(packDir, "visual_asset_images", assetName));
    }

    await writeJson(path.join(packDir, "crop_index.json"), cropIndex);
    await writeJson(path.join(packDir, "manifest.json"), {
      unit,
      unitKey,
      primaryEvidenceFolder: "page_full_images",
      questionCropRole: "optional_zoom_reference",
      imageFieldPolicy: "visual_asset_only",
      purpose: "content/choices review pack. Use page_full_images first; question_crop_images is optional zoom/reference material.",
      questionCount: sortedQuestions.length,
      pageFullImageCount: cropIndex.filter((x) => x.pageImagePath).length,
      cropImageCount: cropIndex.filter((x) => x.status === "copied").length,
      visualAssetCount: assetQuestions.length,
      setKeys,
      requiredReviewFolder: "page_full_images",
    });
    await fs.promises.writeFile(path.join(packDir, "README.md"), `# ${unitKey}\n\nThis is a content/choices input review pack.\n\nPrimary evidence:\n\n- page_full_images/\n\nOptional zoom/reference material:\n\n- question_crop_images/\n\nVisual assets for final JS image fields:\n\n- visual_asset_images/\n\nUse full page images first. Question crops are only for zooming into a problem. Final archive-compatible JS image fields must contain visual asset crops only.\n\nSupporting files:\n\n- js/: current JS skeleton\n- input_templates/: correction input template and schema\n- crop_index.json: JS id/displayNo/pageNo/page image/crop mapping\n`, "utf8");

    packs.push({
      unit,
      unitKey,
      packDir: rel(packDir),
      questionCount: sortedQuestions.length,
      cropImageCount: cropIndex.filter((x) => x.status === "copied").length,
      visualAssetCount: assetQuestions.length,
    });
  }

  await writeJson(path.join(generatedRoot, "reports", "fresh_unit_crop_review_pack_report.json"), {
    generatedAt: new Date().toISOString(),
    packCount: packs.length,
    packs,
    status: packs.every((p) => p.questionCount === p.cropImageCount) ? "ok" : "manual_review",
  });
  console.log(JSON.stringify({ packCount: packs.length, packs }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
