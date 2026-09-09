import fs from "node:fs";
import { assertReleaseClosure } from "./lib/hardening.mjs";

const index = process.argv.indexOf("--release");
if (index < 0 || !process.argv[index + 1]) throw new Error("--release is required");
const release = JSON.parse(fs.readFileSync(process.argv[index + 1], "utf8"));
try {
  console.log(JSON.stringify(assertReleaseClosure(release), null, 2));
} catch (error) {
  console.error(String(error.message || error));
  process.exitCode = 1;
}
