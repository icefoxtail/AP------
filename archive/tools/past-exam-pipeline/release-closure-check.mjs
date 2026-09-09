import fs from "node:fs";
import path from "node:path";
import { assertReleaseClosure } from "./lib/hardening.mjs";

const index = process.argv.indexOf("--release");
if (index < 0 || !process.argv[index + 1]) throw new Error("--release is required");
const release = JSON.parse(fs.readFileSync(process.argv[index + 1], "utf8"));
const rootIndex = process.argv.indexOf("--root");
const root = rootIndex >= 0 && process.argv[rootIndex + 1] ? path.resolve(process.argv[rootIndex + 1]) : process.cwd();
try {
  console.log(JSON.stringify(assertReleaseClosure(release, { root }), null, 2));
} catch (error) {
  console.error(String(error.message || error));
  process.exitCode = 1;
}
