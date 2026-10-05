import fs from "node:fs";
import path from "node:path";
import { ensureDir, listFiles } from "./report-utils.mjs";
import { collectQuestionBanks, renderArchiveJs } from "./js-archive-utils.mjs";

export async function emitArchiveCompatible(cfg) {
  const outRoot = path.join(cfg.finalCleanDir, "archiveCompatible", "js");
  const srcFiles = await listFiles(cfg.jsDir, (file) => file.endsWith(".js"));
  for (const src of srcFiles) {
    const rel = path.relative(cfg.jsDir, src);
    const dest = path.join(outRoot, rel);
    await ensureDir(path.dirname(dest));
    await fs.promises.copyFile(src, dest);
  }
  const assetSrcRoot = path.join(cfg.generatedRoot, "assets");
  const assetOutRoot = path.join(cfg.finalCleanDir, "archiveCompatible", "assets");
  const assetFiles = await listFiles(assetSrcRoot, (file) => file.toLowerCase().endsWith(".png"));
  for (const src of assetFiles) {
    const rel = path.relative(assetSrcRoot, src);
    const dest = path.join(assetOutRoot, rel);
    await ensureDir(path.dirname(dest));
    await fs.promises.copyFile(src, dest);
  }
  return { outputRoot: outRoot, fileCount: srcFiles.length, assetOutputRoot: assetOutRoot, assetFileCount: assetFiles.length };
}

export async function emitInternalJs(cfg, model) {
  const banks = await collectQuestionBanks(cfg.jsDir);
  const out = [];
  for (const bank of banks) {
    const questions = model.questions.filter((q) => q.setKey === bank.setKey);
    const dest = path.join(cfg.jsInternalDir, bank.bookPart, `${bank.setKey}.js`);
    await ensureDir(path.dirname(dest));
    const code = `window.examTitle = ${JSON.stringify(bank.examTitle)};\nwindow.textbookInternalQuestionBank = ${JSON.stringify(questions, null, 2)};\n`;
    await fs.promises.writeFile(dest, code, "utf8");
    out.push(dest);
  }
  return out;
}

export function buildInputTemplate(question) {
  return {
    setKey: question.setKey,
    bookPart: question.bookPart,
    id: question.archiveQuestion.id,
    displayNo: question.internal.displayNo,
    sourceCropPath: question.internal.sourceCropPath,
    current: {
      content: question.archiveQuestion.content || "",
      choices: question.archiveQuestion.choices || [],
      answer: question.archiveQuestion.answer || "",
      solution: question.archiveQuestion.solution || "",
    },
    correction: {
      status: "pending",
      content: "",
      choices: [],
      answer: "",
      solution: "",
      note: "",
    },
  };
}
