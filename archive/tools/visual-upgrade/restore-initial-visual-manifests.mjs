import fs from "node:fs";
import path from "node:path";
import childProcess from "node:child_process";

const root = process.cwd();
const files = [
  "reports/h2-s1-algebra-visual-upgrade/visual_triage.json",
  "reports/h2-s1-algebra-visual-upgrade/candidate_manifest.json",
];
for (const rel of files) {
  const bytes = childProcess.execFileSync("git", ["show", `HEAD:${rel}`]);
  fs.writeFileSync(path.join(root, rel), bytes);
}
console.log(JSON.stringify({ restored: files }));
