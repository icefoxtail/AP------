import fs from "node:fs";
import path from "node:path";
import { requireProductionClosure } from "../pipeline-core/integration.mjs";
import { productionWritePreflight } from "./lib/hardening.mjs";

function arg(name) {
  const index = process.argv.indexOf(name);
  if (index < 0 || !process.argv[index + 1]) throw new Error(`${name} is required`);
  return process.argv[index + 1];
}

const changedPaths = JSON.parse(fs.readFileSync(arg("--changed-paths"), "utf8"));
const receipt = JSON.parse(fs.readFileSync(arg("--receipt"), "utf8"));
const root = process.argv.includes("--root") ? path.resolve(arg("--root")) : process.cwd();
const candidateFile = arg("--candidate");
const reviewFile = arg("--review");
const closureManifestFile = arg("--closure-manifest");
const identityFile = arg("--source-identities");
const identityPayload = JSON.parse(fs.readFileSync(identityFile, "utf8"));
const expectedSourceIdentities = Array.isArray(identityPayload)
  ? identityPayload
  : identityPayload.identities || identityPayload.questions || identityPayload.includedIdentitySet || [];
const normalizedSourceIdentities = expectedSourceIdentities.map((row) => typeof row === "string" ? { sourceIdentityKey: row } : row);
try {
  const closure = requireProductionClosure(
    root,
    "past-exam",
    ["node", "production-write-preflight.mjs", "--closure-manifest", closureManifestFile],
    [candidateFile],
    normalizedSourceIdentities,
  );
  console.log(JSON.stringify(productionWritePreflight({ changedPaths, receipt, candidateFile, reviewFile, closureManifestFile, expectedSourceIdentities: normalizedSourceIdentities, closure }), null, 2));
} catch (error) {
  console.error(String(error.message || error));
  process.exitCode = 1;
}
