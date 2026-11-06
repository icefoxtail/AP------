#!/usr/bin/env node
// CI tests the immutable checkout and base carried by its push, PR or manual event.
// Registration candidates have their own pre-push technical/footprint gate, so a
// registration or Pages completion never starts a second, moving-main CI run.
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const SHA = /^[0-9a-f]{40}$/i;
const EVENTS = new Set(["push", "pull_request", "workflow_dispatch"]);

function exactSha(value, label) {
  if (typeof value !== "string" || value.length !== 40 || !SHA.test(value) || /^0+$/.test(value)) {
    throw new Error(`${label} requires an exact non-zero 40-character commit SHA`);
  }
  return value.toLowerCase();
}

export async function planCiRun({ eventName, sha, event }) {
  if (!EVENTS.has(eventName)) throw new Error(`unsupported CI event: ${String(eventName)}`);
  const checkoutRef = exactSha(sha, "CI checkout");
  if (!event || typeof event !== "object" || Array.isArray(event)) throw new Error("CI event payload is missing or invalid");
  const suppliedBase = eventName === "pull_request" ? event.pull_request?.base?.sha
    : eventName === "push" ? event.before : event.inputs?.base_sha;
  const baseSha = exactSha(suppliedBase, `${eventName} event base`);
  return { run: true, checkoutRef, baseSha,
    reason: `fixed ${eventName} snapshot ${checkoutRef}; auditing ${baseSha}..${checkoutRef}` };
}

async function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) throw new Error("GITHUB_EVENT_PATH is required for an immutable CI event");
  const event = JSON.parse(fs.readFileSync(eventPath, "utf8"));
  const plan = await planCiRun({
    eventName: process.env.EVENT_NAME || process.env.GITHUB_EVENT_NAME || "",
    sha: process.env.GITHUB_SHA,
    event
  });
  console.log(JSON.stringify(plan));
  const lines = [
    `run=${plan.run}`,
    `checkout_ref=${plan.checkoutRef}`,
    `base_sha=${plan.baseSha}`,
    `reason=${plan.reason}`
  ];
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, lines.join("\n") + "\n");
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `CI plan: ${plan.reason}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch(error => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
}
