import fs from "node:fs";
import path from "node:path";

const file = path.resolve(process.argv[2] || "");
if (!file || !fs.existsSync(file)) throw new Error("candidate JS path is required");

const macros = new Set([
  "begin", "end", "pm", "sqrt", "ge", "le", "neq", "times", "cdot", "frac", "dfrac",
  "overline", "alpha", "beta", "gamma", "left", "right", "text", "infty", "sum", "prod",
]);

function normalizeMath(segment) {
  let result = "";
  for (let index = 0; index < segment.length;) {
    if (segment[index] !== "\\") {
      result += segment[index++];
      continue;
    }
    let end = index;
    while (segment[end] === "\\") end += 1;
    const tail = segment.slice(end);
    const word = tail.match(/^[A-Za-z]+/)?.[0] || "";
    const known = [...macros].find((macro) => word.startsWith(macro));
    if (known) result += "\\".repeat(2);
    else if (/^[-+0-9A-Za-z]/.test(tail)) result += "\\".repeat(4);
    else result += "\\".repeat(end - index);
    index = end;
  }
  return result;
}

const source = fs.readFileSync(file, "utf8");
const lines = source.split(/(?<=\n)/);
const normalized = lines.map((line) => {
  const parts = line.split("$");
  for (let index = 1; index < parts.length; index += 2) parts[index] = normalizeMath(parts[index]);
  return parts.join("$");
}).join("");

fs.writeFileSync(file, normalized, "utf8");
console.log(JSON.stringify({ file, changed: normalized !== source }, null, 2));
