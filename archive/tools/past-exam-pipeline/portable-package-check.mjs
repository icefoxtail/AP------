import fs from "node:fs";
import { validatePortableZip } from "./lib/portable-package.mjs";

function arg(name) {
  const index = process.argv.indexOf(name);
  if (index < 0 || !process.argv[index + 1]) throw new Error(`${name} is required`);
  return process.argv[index + 1];
}

const result = validatePortableZip({ zipFile: arg("--zip"), manifestFile: process.argv.includes("--manifest") ? arg("--manifest") : "" });
console.log(JSON.stringify(result, null, 2));
if (result.status !== "PASS") process.exitCode = 1;
