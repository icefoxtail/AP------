import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const reportDir = path.join(root, "reports", "h2-s1-algebra-visual-upgrade");
const manifest = JSON.parse(fs.readFileSync(path.join(reportDir, "candidate_manifest.json"), "utf8"));
const active = manifest.rows.filter((row) => row.candidateRef && ["ADD_NEW_VISUAL", "REBUILD_EXISTING"].includes(row.disposition) && row.v1Status === "PASS" && row.v2Status === "PASS" && row.v3Status === "PASS");
const bySource = new Map();
for (const row of active) {
  const list = bySource.get(row.sourceJsPath) || [];
  list.push(row);
  bySource.set(row.sourceJsPath, list);
}
const bindings = [];

for (const [sourceJsPath, rows] of bySource) {
  const sourceAbs = path.join(root, sourceJsPath);
  const original = fs.readFileSync(sourceAbs, "utf8");
  const probeWindow = {};
  vm.runInNewContext(original, { window: probeWindow });
  let updated = original;
  for (const row of [...rows].sort((a, b) => b.id - a.id)) {
    const examTitle = probeWindow.examTitle;
    const assetRel = `assets/images/${examTitle}/q${row.id}-solution.svg`;
    const assetAbs = path.join(root, "archive", assetRel);
    fs.mkdirSync(path.dirname(assetAbs), { recursive: true });
    fs.copyFileSync(path.join(root, row.candidateRef), assetAbs);
    const svg = fs.readFileSync(assetAbs, "utf8");
    const title = (svg.match(/<title>([^<]*)<\/title>/) || [])[1] || `문항 ${row.id} 해설 시각자료`;
    const desc = (svg.match(/<desc>([^<]*)<\/desc>/) || [])[1] || "문항의 핵심 사실을 재구성한 해설 시각자료";
    const idMarker = `"id": ${row.id},`;
    const idIndex = updated.indexOf(idMarker);
    if (idIndex < 0) throw new Error(`QUESTION_ID_NOT_FOUND:${row.questionUid}`);
    const blockStart = updated.lastIndexOf("\n  {", idIndex);
    const commaEnd = updated.indexOf("\n  },", idIndex);
    const finalEnd = (() => {
      const crlf = updated.indexOf("\r\n  }\r\n];", idIndex);
      return crlf >= 0 ? crlf : updated.indexOf("\n  }\n];", idIndex);
    })();
    const blockEnd = commaEnd >= 0 && (finalEnd < 0 || commaEnd < finalEnd) ? commaEnd : finalEnd;
    if (blockStart < 0 || blockEnd < 0) throw new Error(`QUESTION_BLOCK_NOT_FOUND:${row.questionUid}`);
    let block = updated.slice(blockStart + 1, blockEnd);
    if (row.inlineSvgInSolution) block = block.replace(/<br><div style='text-align:center; margin: 10px 0;'><svg[\s\S]*?<\/svg><\/div><br>/, "<br>");
    const fields = {
      solutionImage: assetRel,
      solutionImageAlt: title,
      solutionImageCaption: desc,
      solutionImageSize: "full",
      solutionImageStatus: "asset_verified",
    };
    for (const key of Object.keys(fields)) block = block.replace(new RegExp(`^[ \\t]*"${key}":.*(?:\\r?\\n|$)`, "gm"), "");
    const insertion = Object.entries(fields).map(([key, value]) => `    ${JSON.stringify(key)}: ${JSON.stringify(value)},`).join("\n");
    const contentIndex = block.indexOf("\n    \"content\":");
    const insertIndex = contentIndex >= 0 ? contentIndex : block.indexOf("\n    \"solution\":");
    if (insertIndex < 0) {
      console.error(JSON.stringify({ questionUid: row.questionUid, blockStart, blockEnd, idIndex, blockHead: block.slice(0, 180), blockTail: block.slice(-180) }));
      throw new Error(`CONTENT_OR_SOLUTION_FIELD_NOT_FOUND:${row.questionUid}`);
    }
    block = block.slice(0, insertIndex + 1) + insertion + "\n" + block.slice(insertIndex + 1);
    updated = updated.slice(0, blockStart + 1) + block + updated.slice(blockEnd);
    bindings.push({ questionUid: row.questionUid, id: row.id, sourceJsPath, assetPath: assetRel, candidateRef: row.candidateRef, title, desc });
  }
  fs.writeFileSync(sourceAbs, updated, "utf8");
  const checkWindow = {};
  vm.runInNewContext(updated, { window: checkWindow });
}

const out = { schemaVersion: "apmath-visual-production-asset-bindings-v1", generatedAt: new Date().toISOString(), files: [...new Set(bindings.map((row) => row.sourceJsPath))].map((sourceJsPath) => ({ sourceJsPath, rows: bindings.filter((row) => row.sourceJsPath === sourceJsPath) })) };
fs.writeFileSync(path.join(reportDir, "PRODUCTION_ASSET_BINDINGS.json"), JSON.stringify(out, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ files: out.files.length, questions: bindings.length }));
