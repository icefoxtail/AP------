import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "archive", "textbook", "_동아_고등_공통수학1_교과서", "generated");

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(base).filter((file) => /\.(png|jpg|jpeg)$/i.test(file));
const needed = files.filter((file) => {
  const full = file.replaceAll("\\", "/");
  const name = path.basename(file);
  return (
    (full.includes("경우의수") && /q0?5|q0?11|q0?12|page_full|page_p/i.test(name)) ||
    (full.includes("다항식") && /q0?13|page_full|page_p/i.test(name))
  );
});

for (const file of needed) console.log(file);
