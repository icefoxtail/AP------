import path from "node:path";
import { normalizeGeneratedJs } from "../lib/js-normalization-utils.mjs";
import { ensureDir } from "../lib/report-utils.mjs";

function parseArgs(argv) {
  const args = { generatedRoot: "generated", publisher: "", textbook: "", grade: "" };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--generated-root") args.generatedRoot = argv[++i];
    else if (argv[i] === "--publisher") args.publisher = argv[++i];
    else if (argv[i] === "--textbook") args.textbook = argv[++i];
    else if (argv[i] === "--grade") args.grade = argv[++i];
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const workspaceRoot = process.cwd();
  const generatedRoot = path.resolve(workspaceRoot, args.generatedRoot);
  const cfg = {
    workspaceRoot,
    generatedRoot,
    jsDir: path.join(generatedRoot, "js"),
    reportsDir: path.join(generatedRoot, "reports"),
    publisher: args.publisher,
    textbook: args.textbook,
    grade: args.grade,
  };
  await ensureDir(cfg.reportsDir);
  const result = await normalizeGeneratedJs(cfg, { writeBack: true });
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
