import path from "node:path";
import { collectQuestionBanks } from "../lib/js-archive-utils.mjs";
import { sectionTypeFromSetKey } from "../lib/section-utils.mjs";
import { readJson, writeJson } from "../lib/report-utils.mjs";

function unitFromSetKey(setKey) {
  const parts = setKey.split("_");
  return parts[2] || "unknown";
}

export default async function stage04(cfg) {
  const prior = await readJson(path.join(cfg.reportsDir, "text1_section_crop_detection_report.json"), []);
  const banks = await collectQuestionBanks(cfg.jsDir);
  const detected = banks.map((bank) => ({
    detectedSetKey: bank.setKey,
    bookPart: bank.bookPart,
    unit: unitFromSetKey(bank.setKey),
    sectionType: sectionTypeFromSetKey(bank.setKey),
    startPage: null,
    endPage: null,
    evidenceText: "existing generated/js setKey and previous crop reports",
    detectedQuestionCount: bank.questions.length,
    confidence: 0.8,
    needsManualReview: false,
    note: prior.length ? "prior text1 section report exists" : "section inferred from existing JS filename",
  }));
  await writeJson(path.join(cfg.reportsDir, "section_set_detection_report.json"), detected);
  await writeJson(path.join(cfg.reportsDir, "expected_set_keys.json"), detected.map((x) => x.detectedSetKey));
  return { name: "04-detect-sections", status: "ok", setCount: detected.length };
}

