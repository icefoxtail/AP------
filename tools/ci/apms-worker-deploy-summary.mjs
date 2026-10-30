#!/usr/bin/env node
// Writes the deployed Worker version id into the job summary after `wrangler deploy`.
//   node tools/ci/apms-worker-deploy-summary.mjs <wrangler-output.ndjson> <deploy.log> [summary.md]
// wrangler writes one JSON object per line to $WRANGLER_OUTPUT_FILE_PATH; the `deploy` entry carries
// version_id. The log's "Current Version ID:" line is a fallback. The deploy already succeeded when this runs,
// so a missing id only warns: the job result (success) is what the Pages ordering gate relies on.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function parseDeployInfo(ndjson, log) {
  for (const line of String(ndjson || "").split(/\r?\n/)) {
    try {
      const entry = JSON.parse(line);
      if (entry && entry.type === "deploy" && entry.version_id) return { versionId: String(entry.version_id), workerName: entry.worker_name || null, source: "wrangler-output" };
    } catch { /* not a JSON line */ }
  }
  const m = /Current Version ID:\s*([0-9a-f-]{8,})/i.exec(String(log || ""));
  return m ? { versionId: m[1], workerName: null, source: "log" } : null;
}

function main() {
  const [outFile, logFile, summaryFile] = process.argv.slice(2);
  const read = f => { try { return f ? fs.readFileSync(f, "utf8") : ""; } catch { return ""; } };
  const info = parseDeployInfo(read(outFile), read(logFile));
  const sha = process.env.GITHUB_SHA || "";
  if (!info) {
    console.log("::warning title=APMS Worker deploy::deploy succeeded but wrangler reported no version id");
    if (summaryFile) fs.appendFileSync(summaryFile, `### APMS Worker deployed\n\nVersion id: not reported by wrangler (see the deploy log). Commit \`${sha}\`.\n`);
    return;
  }
  console.log(`Deployed Worker ${info.workerName || ""} version ${info.versionId}`);
  if (summaryFile) fs.appendFileSync(summaryFile, `### APMS Worker deployed\n\n| | |\n| --- | --- |\n| Worker | ${info.workerName || "ap-math-os-v2612"} |\n| Version id | \`${info.versionId}\` |\n| Commit | \`${sha}\` |\n| Run | ${process.env.GITHUB_SERVER_URL || ""}/${process.env.GITHUB_REPOSITORY || ""}/actions/runs/${process.env.GITHUB_RUN_ID || ""} |\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
