import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const bindings = JSON.parse(fs.readFileSync(path.join(root, "reports", "h2-s1-algebra-visual-upgrade", "PRODUCTION_ASSET_BINDINGS.json"), "utf8"));
const paths = [...new Set(bindings.files.map((row) => row.sourceJsPath))];
for (const rel of paths) {
  const file = path.join(root, rel);
  const current = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  fs.writeFileSync(file, current, "utf8");
}
console.log(JSON.stringify({ normalized: paths.length }));
