import fs from "node:fs";
import { productionWritePreflight } from "./lib/hardening.mjs";

function arg(name) {
  const index = process.argv.indexOf(name);
  if (index < 0 || !process.argv[index + 1]) throw new Error(`${name} is required`);
  return process.argv[index + 1];
}

const changedPaths = JSON.parse(fs.readFileSync(arg("--changed-paths"), "utf8"));
const receipt = JSON.parse(fs.readFileSync(arg("--receipt"), "utf8"));
try {
  console.log(JSON.stringify(productionWritePreflight({ changedPaths, receipt }), null, 2));
} catch (error) {
  console.error(String(error.message || error));
  process.exitCode = 1;
}
