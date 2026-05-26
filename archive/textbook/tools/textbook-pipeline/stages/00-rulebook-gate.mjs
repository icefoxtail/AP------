import path from "node:path";
import { collectArchiveSamples, collectRuleFiles, buildArchiveShapeReference, loadMasterTableFile } from "../lib/rulebook-gate-utils.mjs";
import { makeStageReport, writeStageReport } from "../lib/stage-result-utils.mjs";
import { writeJson } from "../lib/report-utils.mjs";

function parseRequiredNodeVersion(value) {
  const match = String(value || ">=18.0.0").match(/>=\s*(\d+)/);
  return match ? Number(match[1]) : 18;
}

function nodeVersionReport(cfg) {
  const requiredMajor = parseRequiredNodeVersion(cfg.requiredNodeVersion);
  const current = process.versions.node;
  const currentMajor = Number(current.split(".")[0]);
  const ok = currentMajor >= requiredMajor;
  return {
    stage: "00-rulebook-gate",
    requiredNodeVersion: cfg.requiredNodeVersion || ">=18.0.0",
    currentNodeVersion: current,
    ok,
    status: ok ? "ok" : "blocked",
  };
}

export default async function stage00(cfg) {
  const rulesDir = path.resolve(cfg.rulesDir || path.join(cfg.projectRoot, "rules"));
  const archiveRoot = path.resolve(cfg.archiveRoot || path.join(cfg.projectRoot, "archive"));
  const outputs = [];
  const blockedReasons = [];
  const nodeReport = nodeVersionReport(cfg);
  outputs.push(await writeStageReport(cfg, "node_version_report.json", nodeReport));
  if (!nodeReport.ok) {
    outputs.push(await writeStageReport(cfg, "node_version_blocked_report.json", {
      ...nodeReport,
      blockedReasons: [`Node ${nodeReport.currentNodeVersion} does not satisfy ${nodeReport.requiredNodeVersion}`],
    }));
    blockedReasons.push("node_version_below_required");
  }

  const ruleFiles = await collectRuleFiles(rulesDir);
  const roleMap = new Map(ruleFiles.readFiles.map((item) => [item.detectedRole, item.file]));
  const masterTableFile = roleMap.get("standard_unit_master_table") || "";
  const masterTable = await loadMasterTableFile(masterTableFile);
  const archiveSamples = await collectArchiveSamples(archiveRoot, 5);
  const missingRequiredRoles = ruleFiles.missingRequiredRoles;
  if (missingRequiredRoles.length) blockedReasons.push(`missing_rule_roles:${missingRequiredRoles.join(",")}`);
  if (!masterTableFile) blockedReasons.push("standard_unit_master_table_missing");
  if (!archiveSamples.length) blockedReasons.push("archive_sample_missing");

  const rulesReadReport = {
    stage: "00-rulebook-gate",
    rulesDir,
    readFiles: ruleFiles.readFiles,
    missingRequiredRoles,
    status: missingRequiredRoles.length ? "partial" : "ok",
  };
  outputs.push(await writeStageReport(cfg, "rules_read_report.json", rulesReadReport));

  const standardUnits = masterTable.rows;
  const masterReport = {
    stage: "00-rulebook-gate",
    masterTableFile,
    parsedRows: standardUnits.length,
    standardCourses: [...new Set(standardUnits.map((row) => row.standardCourse).filter(Boolean))],
    standardUnits,
    parseWarnings: masterTable.warnings,
    status: masterTableFile && standardUnits.length ? "ok" : "blocked",
  };
  outputs.push(await writeStageReport(cfg, "master_table_reference_report.json", masterReport));

  const shape = {
    stage: "00-rulebook-gate",
    sampleFiles: archiveSamples.map((sample) => sample.file),
    ...buildArchiveShapeReference(archiveSamples),
    status: archiveSamples.length ? "ok" : "partial",
  };
  outputs.push(await writeStageReport(cfg, "js_archive_shape_reference.json", shape));

  const canProceed = Boolean(roleMap.get("js_archive_rulebook") && archiveSamples.length);
  const gateReport = makeStageReport("00-rulebook-gate", {
    inputFiles: [rulesDir, archiveRoot],
    outputFiles: outputs,
    status: blockedReasons.includes("node_version_below_required") ? "blocked" : blockedReasons.length ? "partial" : "ok",
    blockedReasons,
    nextStageContract: {
      rulebookReport: "generated/reports/rules_read_report.json",
      masterTableReport: "generated/reports/master_table_reference_report.json",
      archiveShapeReport: "generated/reports/js_archive_shape_reference.json",
      standardUnitMappingBlocked: !masterTableFile || !standardUnits.length,
    },
    extra: {
      rulebookFound: Boolean(roleMap.get("js_archive_rulebook")),
      masterTableFound: Boolean(masterTableFile && standardUnits.length),
      archiveSamplesFound: archiveSamples.length,
      canProceed,
    },
  });
  outputs.push(await writeStageReport(cfg, "rulebook_gate_report.json", gateReport));
  await writeJson(path.join(cfg.reportsDir, "stage_00_rulebook_gate_contract.json"), gateReport);

  return {
    name: "00-rulebook-gate",
    status: gateReport.status,
    rulebookFound: gateReport.rulebookFound,
    masterTableFound: gateReport.masterTableFound,
    archiveSamplesFound: gateReport.archiveSamplesFound,
  };
}
