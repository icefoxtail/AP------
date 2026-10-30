#!/usr/bin/env node
// Builds archive/data/archive2-extension-keys.json: the compact, DERIVED, read-only index of the
// Generated-only extension keys (EXT-L3/L4/COND/CROSS/CC/TPL) that archive/archive2-key-resolver.js
// loads lazily. It only READS archive/generated/lite/v1/**/extension-* and
// archive/data/meta-foundation/extensions/**; it never writes to a source registry.
//   node archive/tools/build-archive2-extension-keys.mjs          write the derived index
//   node archive/tools/build-archive2-extension-keys.mjs --check  exit 1 when the committed index is stale
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { buildIndex } = require("./archive2-extension-key-extract.cjs");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const target = path.join(root, "archive", "data", "archive2-extension-keys.json");
// One definition per line keeps the derived file reviewable when a scheduled line adds keys.
function serialize(index) {
  const { definitions, bindings, ...head } = index;
  const lines = (rows) => `[\n${rows.map((row) => JSON.stringify(row)).join(",\n")}\n]`;
  const header = JSON.stringify(head).slice(1, -1);
  return `{${header},"definitions":${lines(definitions)},"bindings":${lines(bindings)}}\n`;
}
const next = serialize(buildIndex(root));

if (process.argv.includes("--check")) {
  const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  if (current !== next) {
    console.error("archive/data/archive2-extension-keys.json is stale: run node archive/tools/build-archive2-extension-keys.mjs");
    process.exit(1);
  }
  console.log("archive2 extension key index is current");
} else {
  if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== next) fs.writeFileSync(target, next);
  const index = JSON.parse(next);
  console.log(`archive2 extension key index: ${index.definitionCount} definitions from ${index.sourceFileCount} files (${Object.entries(index.definitionsByKind).map(([k, v]) => `${k}=${v}`).join(" ")})`);
}
