import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const SOURCE_ROOT = "D:/2026년 기출/1학기기말/분류완료";
const PROJECT_ROOT = path.resolve(import.meta.dirname, "../../../..");
const ARCHIVE_ROOT = path.join(PROJECT_ROOT, "archive");
const OUTPUT_ROOT = path.join(ARCHIVE_ROOT, "_generated", "past-exams", "2026-1final-import");
const MANIFEST_ROOT = path.join(OUTPUT_ROOT, "manifests");

const gradeMap = {
  고1: { archiveGrade: "high/h1", gradeCode: "h1" },
  고2: { archiveGrade: "high/h2", gradeCode: "h2" },
  중2: { archiveGrade: "middle/m2", gradeCode: "m2" },
  중3: { archiveGrade: "middle/m3", gradeCode: "m3" },
};

const schoolShortMap = {
  광양제철고등학교: "광양제철고",
  순천고등학교: "순천고",
  순천금당고등학교: "금당고",
  순천매산고등학교: "매산고",
  순천복성고등학교: "복성고",
  순천여자고등학교: "순천여고",
  순천제일고등학교: "제일고",
  순천팔마고등학교: "팔마고",
  순천효천고등학교: "효천고",
  순천동산중학교: "동산중",
  순천신흥중학교: "신흥중",
  순천왕운중학교: "왕운중",
  순천왕의중학교: "왕의중",
  순천팔마중학교: "팔마중",
  순천삼산중학교: "삼산중",
};

const preferredScanPrefix = new Map([
  ["고2/순천제일고등학교/대수", "S28BW-826071419320"],
  ["고2/순천팔마고등학교/대수", "S28BW-826071419320"],
]);

function normalize(value) {
  return value.replaceAll("\\", "/");
}

function listFilesRecursive(root) {
  const result = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...listFilesRecursive(full));
    else result.push(full);
  }
  return result;
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function outputName(grade, schoolShort, subject) {
  if (grade === "고2") return `26_${schoolShort}_1학기_기말_고2_${subject}`;
  return `26_${schoolShort}_1학기_기말_${grade}_기출`;
}

function findExistingJs(relativePath) {
  const full = path.join(ARCHIVE_ROOT, "exams", relativePath);
  return fs.existsSync(full) ? normalize(full) : "";
}

function main() {
  if (!fs.existsSync(SOURCE_ROOT)) throw new Error(`Source root not found: ${SOURCE_ROOT}`);
  fs.mkdirSync(MANIFEST_ROOT, { recursive: true });

  const allJpg = listFilesRecursive(SOURCE_ROOT)
    .filter((file) => /\.jpe?g$/i.test(file))
    .sort((a, b) => a.localeCompare(b, "ko"));
  const grouped = new Map();
  for (const file of allJpg) {
    const relative = normalize(path.relative(SOURCE_ROOT, file));
    const parts = relative.split("/");
    if (parts.length !== 4) throw new Error(`Unexpected source layout: ${relative}`);
    const key = parts.slice(0, 3).join("/");
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(file);
  }

  const inventory = [];
  for (const [sourceGroup, files] of [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b, "ko"))) {
    const [grade, schoolName, subject] = sourceGroup.split("/");
    const schoolShort = schoolShortMap[schoolName];
    const gradeMeta = gradeMap[grade];
    if (!schoolShort || !gradeMeta) throw new Error(`Missing mapping for ${sourceGroup}`);

    const variants = new Map();
    for (const file of files) {
      const prefix = path.basename(file).replace(/_\d+\.jpe?g$/i, "");
      if (!variants.has(prefix)) variants.set(prefix, []);
      variants.get(prefix).push(file);
    }
    const preferred = preferredScanPrefix.get(sourceGroup) || [...variants.keys()][0];
    const selectedFiles = [...(variants.get(preferred) || [])].sort((a, b) => a.localeCompare(b));
    const title = outputName(grade, schoolShort, subject);
    const archiveRelative = `original/${gradeMeta.archiveGrade}/1final/${title}.js`;
    const existingJsPath = findExistingJs(archiveRelative);
    const status = existingJsPath ? "skip_existing" : "ready_for_candidate";
    const examId = title;
    const manifest = {
      examId,
      year: 2026,
      schoolName,
      schoolShort,
      grade,
      gradeCode: gradeMeta.gradeCode,
      semester: "1",
      examType: "final",
      subject,
      sourceType: "past_exam_scanned_jpg",
      sourceGroup,
      sourcePageImagePaths: selectedFiles.map(normalize),
      selectedScanPrefix: preferred,
      alternateScanVariants: [...variants.entries()]
        .filter(([prefix]) => prefix !== preferred)
        .map(([prefix, variantFiles]) => ({
          prefix,
          pageCount: variantFiles.length,
          files: variantFiles.map(normalize),
          disposition: "duplicate_copy_not_selected",
        })),
      pageRange: `1-${selectedFiles.length}`,
      expectedQuestionCount: 0,
      outputFileName: `${title}.js`,
      outputDir: normalize(path.join(OUTPUT_ROOT, examId)),
      archiveRelativePath: archiveRelative,
      existingJsPath,
      status,
      notes: existingJsPath
        ? "Existing live archive JS found; verify and skip unless a correction is explicitly approved."
        : "Ready for isolated candidate generation. Question count must be confirmed from page evidence.",
    };
    fs.writeFileSync(path.join(MANIFEST_ROOT, `${examId}.json`), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    inventory.push({
      examId,
      grade,
      schoolName,
      subject,
      selectedPageCount: selectedFiles.length,
      sourceFileCount: files.length,
      variantCount: variants.size,
      selectedScanPrefix: preferred,
      status,
      archiveRelativePath: archiveRelative,
      firstPageSha256: sha256(selectedFiles[0]),
      lastPageSha256: sha256(selectedFiles.at(-1)),
    });
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    sourceRoot: SOURCE_ROOT,
    sourceJpgCount: allJpg.length,
    examGroupCount: inventory.length,
    readyForCandidateCount: inventory.filter((item) => item.status === "ready_for_candidate").length,
    skipExistingCount: inventory.filter((item) => item.status === "skip_existing").length,
    selectedPageCount: inventory.reduce((sum, item) => sum + item.selectedPageCount, 0),
    duplicateCopyPageCount: inventory.reduce((sum, item) => sum + item.sourceFileCount - item.selectedPageCount, 0),
    items: inventory,
  };
  fs.writeFileSync(path.join(OUTPUT_ROOT, "inventory.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(summary, null, 2));
}

main();
