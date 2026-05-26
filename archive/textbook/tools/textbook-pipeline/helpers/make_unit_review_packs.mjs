import fs from "node:fs";
import path from "node:path";
import { zipDirectory } from "../lib/zip-utils.mjs";

const workspaceRoot = process.cwd();
const generatedRoot = path.join(workspaceRoot, "generated");
const outRoot = path.join(generatedRoot, "review_pack", "by_unit");

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

async function exists(file) {
  try {
    await fs.promises.access(file);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function copyFileIfExists(src, dest) {
  if (!(await exists(src))) return false;
  await ensureDir(path.dirname(dest));
  await fs.promises.copyFile(src, dest);
  return true;
}

async function copyDirIfExists(src, dest) {
  if (!(await exists(src))) return false;
  await ensureDir(dest);
  await fs.promises.cp(src, dest, { recursive: true });
  return true;
}

async function writeJson(file, data) {
  await ensureDir(path.dirname(file));
  await fs.promises.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function main() {
  const modelPath = path.join(generatedRoot, "internal", "internal_question_model.json");
  const model = JSON.parse(await fs.promises.readFile(modelPath, "utf8"));
  const bySet = new Map();
  for (const q of model.questions) {
    if (!bySet.has(q.setKey)) {
      bySet.set(q.setKey, {
        setKey: q.setKey,
        bookPart: q.bookPart,
        unit: unitOfSetKey(q.setKey),
        questionCount: 0,
        imageCount: 0,
        questions: [],
      });
    }
    const item = bySet.get(q.setKey);
    item.questionCount += 1;
    if (q.archiveQuestion.image) item.imageCount += 1;
    item.questions.push(q);
  }
  const byUnit = new Map();
  for (const setInfo of bySet.values()) {
    if (!byUnit.has(setInfo.unit)) byUnit.set(setInfo.unit, []);
    byUnit.get(setInfo.unit).push(setInfo);
  }

  const packs = [];
  for (const [unit, sets] of byUnit) {
    const unitKey = `비상_공통수학1_${unit}_고1`;
    const packDir = path.join(outRoot, unitKey);
    await fs.promises.rm(packDir, { recursive: true, force: true });
    await ensureDir(packDir);
    const copied = [];
    for (const setInfo of sets) {
      const setKey = setInfo.setKey;
      const bookPart = setInfo.bookPart;
      const paths = [
        [path.join(generatedRoot, "js", bookPart, `${setKey}.js`), path.join(packDir, "js", bookPart, `${setKey}.js`)],
        [path.join(generatedRoot, "js-internal", bookPart, `${setKey}.js`), path.join(packDir, "js-internal", bookPart, `${setKey}.js`)],
        [path.join(generatedRoot, "final_clean", "archiveCompatible", "js", bookPart, `${setKey}.js`), path.join(packDir, "archiveCompatible", "js", bookPart, `${setKey}.js`)],
        [path.join(generatedRoot, "input_templates", `${setKey}_input_template.json`), path.join(packDir, "input_templates", `${setKey}_input_template.json`)],
        [path.join(generatedRoot, "input_templates", `${setKey}_correction_result_schema.json`), path.join(packDir, "input_templates", `${setKey}_correction_result_schema.json`)],
      ];
      for (const [src, dest] of paths) {
        if (await copyFileIfExists(src, dest)) copied.push(rel(dest));
      }
      const dirs = [
        [path.join(generatedRoot, "work", "rendered_pages", bookPart, setKey), path.join(packDir, "page_full_images", bookPart, setKey)],
        [path.join(generatedRoot, "work", "page_crops", bookPart, setKey), path.join(packDir, "page_full_images", bookPart, setKey)],
        [path.join(generatedRoot, "work", "question_crops", bookPart, setKey), path.join(packDir, "question_crops", bookPart, setKey)],
        [path.join(generatedRoot, "work", "question_crops", bookPart, setKey), path.join(packDir, "crop_images", "question_full", bookPart, setKey)],
        [path.join(generatedRoot, "assets", bookPart, setKey), path.join(packDir, "assets", bookPart, setKey)],
        [path.join(generatedRoot, "assets", bookPart, setKey), path.join(packDir, "crop_images", "visual_assets", bookPart, setKey)],
        [path.join(generatedRoot, "final_clean", "archiveCompatible", "assets", bookPart, setKey), path.join(packDir, "archiveCompatible", "assets", bookPart, setKey)],
      ];
      for (const [src, dest] of dirs) {
        if (await copyDirIfExists(src, dest)) copied.push(rel(dest));
      }
      for (const question of setInfo.questions) {
        const src = question.internal?.sourceCropPath ? path.join(workspaceRoot, question.internal.sourceCropPath) : "";
        const displayNo = question.internal?.displayNo || String(question.archiveQuestion.id).padStart(3, "0");
        const pageNo = question.internal?.sourcePageNo || "unknown";
        const cropFile = `q${String(question.archiveQuestion.id).padStart(3, "0")}_page${pageNo}_display${displayNo}.png`;
        const dest = path.join(packDir, "crop_images", "by_js_id", bookPart, setKey, cropFile);
        if (await copyFileIfExists(src, dest)) copied.push(rel(dest));
        if (src) {
          const originalDest = path.join(packDir, "crop_images", "original_question_full", bookPart, setKey, path.basename(src));
          if (await copyFileIfExists(src, originalDest)) copied.push(rel(originalDest));
        }
      }
    }
    const commonReports = [
      "oneclick_pipeline_summary.json",
      "pipeline_validation_report.json",
      "question_crop_map.json",
      "visual_asset_crop_report.json",
      "output_profiles_report.json",
    ];
    for (const report of commonReports) {
      const src = path.join(generatedRoot, "reports", report);
      const dest = path.join(packDir, "reports", report);
      if (await copyFileIfExists(src, dest)) copied.push(rel(dest));
    }
    await copyFileIfExists(
      path.join(generatedRoot, "reports", "visual_asset_contact_sheet.png"),
      path.join(packDir, "reports", "visual_asset_contact_sheet.png"),
    );
    const manifest = {
      unit,
      unitKey,
      purpose: "발문/보기 검수 및 correction_result 입력용 대단원별 작업 묶음",
      primaryEvidenceFolder: "page_full_images",
      questionCropRole: "optional_zoom_reference",
      imageFieldPolicy: "visual_asset_only",
      howToUse: [
        "page_full_images를 1차 원문 근거로 사용해 content/choices를 검수한다.",
        "question_crops와 crop_images는 확대/보조 참고로만 사용한다.",
        "archiveCompatible JS image 필드에는 visual asset crop만 넣는다.",
        "수정 결과는 *_correction_result_schema.json 형식에 맞춰 generated/input_results로 되돌릴 수 있다.",
      ],
      sets,
      copiedCount: copied.length,
      copied,
    };
    await writeJson(path.join(packDir, "manifest.json"), manifest);
    await fs.promises.writeFile(
      path.join(packDir, "README.md"),
      `# ${unitKey}\n\n발문/보기 검수 및 입력용 대단원별 묶음입니다.\n\n- 1차 원문 근거: page_full_images/\n- 확대/보조 참고: crop_images/original_question_full/, crop_images/by_js_id/, question_crops/\n- JS image 필드용 시각자료: crop_images/visual_assets/, assets/\n- JS: js/\n- 내부 메타 포함 JS: js-internal/\n- 발문/보기 입력 템플릿: input_templates/\n- 검증 reports: reports/\n\n발문/보기 입력 시에는 full page 이미지를 먼저 사용합니다. 문항 crop은 확대 요청이나 빠른 검수용 보조 자료입니다. archiveCompatible JS의 image 필드에는 page/question crop을 넣지 않고 visual asset crop만 넣습니다.\n\n수정 결과는 correction_result schema 형식으로 작성해 pipeline 13번 stage에 투입합니다.\n`,
      "utf8",
    );
    const zipPath = path.join(outRoot, `${unitKey}.zip`);
    const zipResult = await zipDirectory(packDir, zipPath);
    packs.push({
      unit,
      unitKey,
      setCount: sets.length,
      questionCount: sets.reduce((sum, item) => sum + item.questionCount, 0),
      imageCount: sets.reduce((sum, item) => sum + item.imageCount, 0),
      packDir: rel(packDir),
      zipPath: rel(zipPath),
      zipFileCount: zipResult.fileCount,
    });
  }
  await writeJson(path.join(generatedRoot, "reports", "unit_review_pack_report.json"), {
    generatedAt: new Date().toISOString(),
    packCount: packs.length,
    packs,
    status: "ok",
  });
  console.log(JSON.stringify({ packCount: packs.length, packs }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
