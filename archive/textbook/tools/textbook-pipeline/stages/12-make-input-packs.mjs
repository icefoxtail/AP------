import fs from "node:fs";
import path from "node:path";
import { ensureDir, listFiles, writeJson } from "../lib/report-utils.mjs";
import { zipDirectory } from "../lib/zip-utils.mjs";

export default async function stage12(cfg) {
  const templates = await listFiles(cfg.inputTemplatesDir, (file) => file.endsWith("_input_template.json"));
  const packs = [];
  for (const template of templates) {
    const setKey = path.basename(template, "_input_template.json");
    const packDir = path.join(cfg.reviewPackDir, setKey);
    await ensureDir(packDir);
    await fs.promises.copyFile(template, path.join(packDir, path.basename(template)));
    const schema = path.join(cfg.inputTemplatesDir, `${setKey}_correction_result_schema.json`);
    if (fs.existsSync(schema)) await fs.promises.copyFile(schema, path.join(packDir, path.basename(schema)));
    await writeJson(path.join(packDir, "README.json"), {
      setKey,
      instruction: "Fill correction result JSON only when source crop evidence is clear. Do not invent content.",
    });
    const zip = path.join(cfg.reviewPackDir, `${setKey}_input_pack.zip`);
    const result = await zipDirectory(packDir, zip);
    packs.push({ setKey, packDir, zip, fileCount: result.fileCount });
  }
  await writeJson(path.join(cfg.reportsDir, "input_pack_report.json"), {
    stage: "12-make-input-packs",
    packCount: packs.length,
    packs,
    status: packs.length ? "ok" : "manual_review",
  });
  return { name: "12-make-input-packs", status: packs.length ? "ok" : "manual_review", packCount: packs.length };
}

