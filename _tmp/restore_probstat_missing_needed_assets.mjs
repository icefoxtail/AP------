import fs from "node:fs";
import path from "node:path";
import cp from "node:child_process";

const root = process.cwd();
const reportPath = path.join(root, "archive", "textbook", "reports", "probstat_table_image_necessity_20260603_105134.json");
const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

const missing = report.items.filter((item) => !fs.existsSync(path.join(root, item.asset)));
let folders = [...new Set(missing.map((item) => path.basename(path.dirname(item.asset))))];
if (!folders.length) {
  const priorRestore = fs
    .readdirSync(path.join(root, "archive", "textbook", "reports"))
    .filter((file) => file.startsWith("probstat_missing_needed_asset_restore_") && file.endsWith(".json"))
    .sort()
    .at(-1);
  if (priorRestore) {
    const prior = JSON.parse(fs.readFileSync(path.join(root, "archive", "textbook", "reports", priorRestore), "utf8"));
    folders = [...new Set(prior.restored.map((item) => path.basename(path.dirname(item.dest))))];
  }
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

const generatedRoot = path.join(root, "archive", "_generated", "past-exams", "high_h2_probability_statistics_all_terms");
const generatedPngs = walk(generatedRoot).filter((file) => file.endsWith(".png"));

function sourcePage(folder, pageName) {
  const match = generatedPngs.find(
    (file) => file.includes(folder) && file.includes(`${path.sep}pages${path.sep}`) && path.basename(file) === pageName
  );
  if (!match) throw new Error(`Missing source page for ${folder}/${pageName}`);
  return match;
}

function copyPage(folder, pageName, destRel) {
  const src = sourcePage(folder, pageName);
  const dest = path.join(root, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return { action: "copy_page", src: rel(src), dest: rel(dest) };
}

function cropPage(folder, pageName, crop, destRel) {
  const src = sourcePage(folder, pageName);
  const dest = path.join(root, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const geometry = `${crop.w}x${crop.h}+${crop.x}+${crop.y}`;
  cp.execFileSync("magick", [src, "-crop", geometry, "+repage", dest], { stdio: "pipe" });
  return { action: "crop", src: rel(src), dest: rel(dest), geometry };
}

const byFolder = Object.fromEntries(folders.map((folder) => [folder, folder]));
const hyo = folders.find((folder) => folder.startsWith("26_"));
const sun = folders.find((folder) => folder.startsWith("25_"));
if (!hyo || !sun) throw new Error(`Unexpected missing folders: ${folders.join(", ")}`);

const restored = [];

for (const page of ["page_p001.png", "page_p002.png", "page_p003.png", "page_p004.png", "page_p005.png"]) {
  restored.push(copyPage(sun, page, `archive/assets/images/${sun}/${page}`));
}

const crops = [
  { folder: hyo, page: "page_p002.png", dest: `archive/assets/images/${hyo}/q10.png`, crop: { x: 850, y: 120, w: 930, h: 720 } },
  { folder: hyo, page: "page_p003.png", dest: `archive/assets/images/${hyo}/q14.png`, crop: { x: 70, y: 1320, w: 870, h: 650 } },
  { folder: hyo, page: "page_p004.png", dest: `archive/assets/images/${hyo}/q17.png`, crop: { x: 70, y: 120, w: 860, h: 900 } },
  { folder: sun, page: "page_p002.png", dest: `archive/assets/images/${sun}/q7.png`, crop: { x: 100, y: 1120, w: 1040, h: 900 } },
  { folder: sun, page: "page_p002.png", dest: `archive/assets/images/${sun}/q8.png`, crop: { x: 100, y: 2060, w: 1040, h: 700 } },
  { folder: sun, page: "page_p004.png", dest: `archive/assets/images/${sun}/q18.png`, crop: { x: 100, y: 1450, w: 1040, h: 1080 } },
  { folder: sun, page: "page_p004.png", dest: `archive/assets/images/${sun}/q19.png`, crop: { x: 1050, y: 130, w: 1100, h: 820 } },
  { folder: sun, page: "page_p005.png", dest: `archive/assets/images/${sun}/q22.png`, crop: { x: 1050, y: 120, w: 1100, h: 1500 } },
  { folder: sun, page: "page_p006.png", dest: `archive/assets/images/${sun}/q23.png`, crop: { x: 90, y: 110, w: 1060, h: 1150 } },
];

for (const item of crops) restored.push(cropPage(item.folder, item.page, item.crop, item.dest));

const out = path.join(
  root,
  "archive",
  "textbook",
  "reports",
  `probstat_missing_needed_asset_restore_${new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_")}.json`
);
fs.writeFileSync(
  out,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      sourceReport: rel(reportPath),
      missingRefsBefore: missing.length,
      restoredCount: restored.length,
      restored,
    },
    null,
    2
  ),
  "utf8"
);

console.log(JSON.stringify({ out: rel(out), missingRefsBefore: missing.length, restoredCount: restored.length }, null, 2));
