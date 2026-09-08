import fs from "node:fs";

const files = process.argv.slice(2);
if (files.length === 0) throw new Error("Pass one or more JS files");
for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(/\\\\n(?![A-Za-z])/g, (match) => match.slice(1));
  fs.writeFileSync(file, after, "utf8");
  console.log(JSON.stringify({ file, changed: before !== after, replacements: (before.match(/\\\\n/g) || []).length }));
}
