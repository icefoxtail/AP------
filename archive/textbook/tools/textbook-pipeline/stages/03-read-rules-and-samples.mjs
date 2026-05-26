import fs from "node:fs";
import path from "node:path";
import { collectQuestionBanks } from "../lib/js-archive-utils.mjs";
import { ensureDir, exists, listFiles, readJson, writeJson } from "../lib/report-utils.mjs";
import { makeStageReport } from "../lib/stage-result-utils.mjs";

async function sampleText(file, max = 2400) {
  try {
    const text = await fs.promises.readFile(file, "utf8");
    return text.slice(0, max);
  } catch {
    return "";
  }
}

export default async function stage03(cfg) {
  const rulesDir = path.resolve(cfg.projectRoot, cfg.rulesDir || "rules");
  const ruleFiles = (await listFiles(rulesDir, (file) => /\.(md|txt|json)$/i.test(file))).slice(0, 24);
  const rules = [];
  for (const file of ruleFiles) {
    rules.push({ file, excerpt: await sampleText(file, 800) });
  }
  const banks = await collectQuestionBanks(cfg.jsDir);
  const samples = banks.slice(0, 8).map((bank) => ({
    file: path.relative(cfg.workspaceRoot, bank.file).replaceAll("\\", "/"),
    setKey: bank.setKey,
    questionCount: bank.questions.length,
    firstQuestionKeys: Object.keys(bank.questions[0] || {}),
  }));
  const requiredReports = [
    "rules_read_report.json",
    "master_table_reference_report.json",
    "js_archive_shape_reference.json",
    "rulebook_gate_report.json",
  ];
  const missingGateReports = [];
  for (const report of requiredReports) {
    if (!(await exists(path.join(cfg.reportsDir, report)))) missingGateReports.push(report);
  }
  const gateReport = await readJson(path.join(cfg.reportsDir, "rulebook_gate_report.json"), null);
  await ensureDir(cfg.reportsDir);
  if (missingGateReports.includes("rules_read_report.json")) await writeJson(path.join(cfg.reportsDir, "rules_read_report.json"), {
    stage: "03-read-rules-and-samples",
    rulesDir,
    readFiles: rules.map((r) => ({ file: r.file, detectedRole: "reference", excerpt: r.excerpt })),
    missingRequiredRoles: [],
    status: "partial",
  });
  await writeJson(path.join(cfg.reportsDir, "archive_sample_report.json"), {
    stage: "03-read-rules-and-samples",
    sampleCount: samples.length,
    samples,
    observedArchiveFields: Array.from(new Set(samples.flatMap((s) => s.firstQuestionKeys))).sort(),
  });
  const report = makeStageReport("03-read-rules-and-samples", {
    inputFiles: [rulesDir, cfg.jsDir],
    outputFiles: [path.join(cfg.reportsDir, "archive_sample_report.json"), ...requiredReports.map((file) => path.join(cfg.reportsDir, file))],
    missingInputs: missingGateReports,
    status: missingGateReports.length ? "partial" : "ok",
    manualReviewCount: missingGateReports.length,
    nextStageContract: {
      rulesReadReport: "generated/reports/rules_read_report.json",
      masterTableReferenceReport: "generated/reports/master_table_reference_report.json",
      gateCanProceed: gateReport?.canProceed ?? null,
    },
    extra: {
      rules: rules.length,
      samples: samples.length,
      gateStatus: gateReport?.status || "missing",
    },
  });
  await writeJson(path.join(cfg.reportsDir, "stage_03_contract_report.json"), report);
  return { name: "03-read-rules-and-samples", status: report.status, rules: rules.length, samples: samples.length };
}
