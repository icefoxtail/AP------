import fs from "node:fs";
import path from "node:path";
import { correctionAllowedFields, normalizeCorrection } from "../lib/correction-utils.mjs";
import { collectQuestionBanks, renderArchiveJs } from "../lib/js-archive-utils.mjs";
import { ensureDir, listFiles, readJson, writeJson } from "../lib/report-utils.mjs";

export default async function stage13(cfg) {
  const correctionFiles = await listFiles(cfg.inputResultsDir, (file) => file.endsWith("_correction_result.json"));
  const applications = [];
  const skipped = [];
  if (!correctionFiles.length) {
    await writeJson(path.join(cfg.reportsDir, "correction_apply_report.json"), {
      stage: "13-apply-corrections",
      correctionFileCount: 0,
      appliedCount: 0,
      status: "ok",
      note: "no correction result files found",
    });
    return { name: "13-apply-corrections", status: "ok", appliedCount: 0 };
  }
  const bySet = new Map();
  for (const file of correctionFiles) {
    const raw = await readJson(file, null);
    const items = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [];
    for (const item of items) {
      const correction = normalizeCorrection(item.correction || item);
      if (!correction || correction.status !== "confirmed") continue;
      bySet.set(`${item.setKey}:${item.id}`, correction);
    }
  }
  const banks = await collectQuestionBanks(cfg.jsDir);
  for (const bank of banks) {
    let changed = false;
    const nextQuestions = bank.questions.map((q) => {
      const correction = bySet.get(`${bank.setKey}:${q.id}`);
      if (!correction) return q;
      const next = { ...q };
      for (const field of correctionAllowedFields) {
        if (Object.hasOwn(correction, field)) {
          next[field] = correction[field];
          changed = true;
          applications.push({ setKey: bank.setKey, id: q.id, field, status: "applied" });
        }
      }
      return next;
    });
    if (changed) {
      const dest = cfg.applyCorrectionsToJs === true
        ? bank.file
        : path.join(cfg.draftContentDir, bank.bookPart, `${bank.setKey}.js`);
      if (cfg.applyCorrectionsToJs === true) {
        const backupRoot = path.join(cfg.generatedRoot, "backup", `js_before_stage13_apply_${new Date().toISOString().slice(0, 10).replaceAll("-", "")}`);
        const backupFile = path.join(backupRoot, path.relative(cfg.jsDir, bank.file));
        await ensureDir(path.dirname(backupFile));
        await fs.promises.copyFile(bank.file, backupFile);
      }
      await ensureDir(path.dirname(dest));
      await fs.promises.writeFile(dest, renderArchiveJs(bank.examTitle, nextQuestions), "utf8");
    }
  }
  await writeJson(path.join(cfg.reportsDir, "correction_apply_report.json"), {
    stage: "13-apply-corrections",
    correctionFileCount: correctionFiles.length,
    applyCorrectionsToJs: cfg.applyCorrectionsToJs === true,
    appliedCount: applications.length,
    applications,
    skipped,
    status: "ok",
  });
  return { name: "13-apply-corrections", status: "ok", appliedCount: applications.length };
}
